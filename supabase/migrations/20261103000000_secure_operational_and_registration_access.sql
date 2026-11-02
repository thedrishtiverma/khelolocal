drop policy if exists "operational_state_authenticated_read" on public.operational_state;
create policy "operational_state_admin_read" on public.operational_state
for select to authenticated using (public.is_admin_user());

create or replace function public.save_operational_state(
  next_payload jsonb,
  expected_version bigint default null
)
returns table(version bigint, updated_at timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
declare
  next_version bigint;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;
  if not exists (select 1 from public.profiles where id = auth.uid() and is_active) then
    raise exception 'Active profile required';
  end if;
  if not public.is_admin_user() then
    raise exception 'Administrator access required';
  end if;
  if jsonb_typeof(next_payload) <> 'object' then
    raise exception 'Operational state must be an object';
  end if;

  select s.version into next_version
  from public.operational_state s
  where s.id = 'primary'
  for update;
  if found and expected_version is not null and next_version <> expected_version then
    raise exception 'State has changed. Refresh and retry.' using errcode = '40001';
  end if;

  insert into public.operational_state (id, payload, version, updated_by)
  values ('primary', next_payload, 1, auth.uid())
  on conflict (id) do update set
    payload = excluded.payload,
    version = public.operational_state.version + 1,
    updated_by = auth.uid(),
    updated_at = now()
  returning operational_state.version, operational_state.updated_at into version, updated_at;

  insert into public.operational_state_audit (state_version, changed_by)
  values (version, auth.uid());
  return next;
end;
$$;

revoke all on function public.save_operational_state(jsonb, bigint) from public, anon;
grant execute on function public.save_operational_state(jsonb, bigint) to authenticated;

drop policy if exists "tournament_domain_read" on public.tournament_domain;
drop policy if exists "tournament_domain_owner_write" on public.tournament_domain;
create policy "tournament_domain_public_or_owner_read" on public.tournament_domain
for select to anon, authenticated
using (
  payload ->> 'status' in ('UPCOMING', 'REGISTRATION_OPEN', 'LIVE', 'COMPLETED', 'CANCELLED')
  or organizer_profile_id = auth.uid()::text
  or public.is_admin_user()
);
create policy "tournament_domain_owner_insert" on public.tournament_domain
for insert to authenticated
with check (organizer_profile_id = auth.uid()::text or public.is_admin_user());
create policy "tournament_domain_owner_update" on public.tournament_domain
for update to authenticated
using (organizer_profile_id = auth.uid()::text or public.is_admin_user())
with check (organizer_profile_id = auth.uid()::text or public.is_admin_user());
create policy "tournament_domain_owner_delete_draft" on public.tournament_domain
for delete to authenticated
using (
  (organizer_profile_id = auth.uid()::text and payload ->> 'status' = 'DRAFT')
  or public.is_admin_user()
);

drop policy if exists "registrations_read" on public.tournament_registrations;
drop policy if exists "registrations_athlete_write" on public.tournament_registrations;
drop policy if exists "registrations_athlete_update" on public.tournament_registrations;
drop policy if exists "registrations_organizer_review" on public.tournament_registrations;
create policy "registrations_participant_or_organizer_read" on public.tournament_registrations
for select to authenticated
using (
  athlete_profile_id = auth.uid()::text
  or public.is_admin_user()
  or exists (
    select 1
    from public.tournament_domain t
    where t.id = tournament_registrations.tournament_id
      and t.organizer_profile_id = auth.uid()::text
  )
);

revoke insert, update, delete on public.tournament_registrations from anon, authenticated;
grant select on public.tournament_registrations to authenticated;
grant select on public.tournament_domain to anon, authenticated;
grant insert, update, delete on public.tournament_domain to authenticated;

create index if not exists tournament_domain_status_created_idx
on public.tournament_domain ((payload ->> 'status'), created_at desc);
create index if not exists tournament_domain_sport_idx
on public.tournament_domain ((payload ->> 'sportId'));
create index if not exists tournament_domain_city_idx
on public.tournament_domain ((payload ->> 'cityName'));
create index if not exists tournament_domain_age_gender_idx
on public.tournament_domain ((payload ->> 'ageCategory'), (payload ->> 'genderCategory'));
create index if not exists tournament_domain_start_date_idx
on public.tournament_domain ((payload ->> 'startDate'));
create index if not exists tournament_registrations_event_athlete_status_idx
on public.tournament_registrations (tournament_id, athlete_profile_id, status);
create index if not exists tournament_registrations_athlete_date_idx
on public.tournament_registrations (athlete_profile_id, registration_date desc);

create or replace function public.register_for_tournament(
  p_tournament_id text,
  p_team_id text default null
)
returns public.tournament_registrations
language plpgsql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
declare
  event_row public.tournament_domain%rowtype;
  registration_row public.tournament_registrations%rowtype;
  athlete_birth_date date;
  athlete_gender public.gender_type;
  event_gender text;
  age_limit integer;
  capacity integer;
  active_registrations integer;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;
  if not exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'athlete' and p.is_active
  ) then
    raise exception 'Active athlete profile required';
  end if;
  if p_team_id is not null then
    raise exception 'Team registration is not yet supported';
  end if;

  select * into event_row
  from public.tournament_domain
  where id = p_tournament_id
  for update;
  if not found then
    raise exception 'Tournament not found';
  end if;
  if event_row.organizer_profile_id = auth.uid()::text then
    raise exception 'Organizers cannot register for their own tournament';
  end if;
  if event_row.payload ->> 'status' is distinct from 'REGISTRATION_OPEN' then
    raise exception 'Registration is not open';
  end if;
  if event_row.payload ->> 'ageCategory' in ('U-17', 'U-19') then
    age_limit := case event_row.payload ->> 'ageCategory'
      when 'U-17' then 17
      when 'U-19' then 19
    end;
    select ap.date_of_birth, ap.gender
    into athlete_birth_date, athlete_gender
    from public.athlete_profiles ap
    where ap.auth_user_id = auth.uid();
    if athlete_birth_date is null then
      raise exception 'Date of birth is required for this age category';
    end if;
    if (timezone('Asia/Kolkata', now())::date) >=
      (athlete_birth_date + make_interval(years => age_limit))::date
    then
      raise exception 'Athlete does not meet the age category';
    end if;
  end if;
  event_gender := event_row.payload ->> 'genderCategory';
  if event_gender in ('MALE', 'FEMALE') then
    if athlete_gender is null or upper(athlete_gender::text) <> event_gender then
      raise exception 'Athlete does not meet the gender eligibility';
    end if;
  end if;
  if not coalesce(event_row.payload ->> 'maxParticipants' ~ '^[1-9][0-9]*$', false) then
    raise exception 'Tournament capacity is not configured';
  end if;

  capacity := (event_row.payload ->> 'maxParticipants')::integer;
  select count(*)::integer into active_registrations
  from public.tournament_registrations r
  where r.tournament_id = p_tournament_id
    and r.status in ('PENDING', 'APPROVED');
  if active_registrations >= capacity then
    raise exception 'Tournament is full';
  end if;
  if exists (
    select 1
    from public.tournament_registrations r
    where r.tournament_id = p_tournament_id
      and r.athlete_profile_id = auth.uid()::text
      and r.status in ('PENDING', 'APPROVED')
  ) then
    raise exception 'Already registered';
  end if;

  insert into public.tournament_registrations (
    id, tournament_id, athlete_profile_id, team_id, status
  )
  values (
    gen_random_uuid()::text, p_tournament_id, auth.uid()::text, null, 'PENDING'
  )
  returning * into registration_row;

  return registration_row;
end;
$$;

create or replace function public.review_tournament_registration(
  p_registration_id text,
  p_status text
)
returns public.tournament_registrations
language plpgsql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
declare
  event_row public.tournament_domain%rowtype;
  registration_row public.tournament_registrations%rowtype;
  event_id text;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;
  if p_status is null or p_status not in ('APPROVED', 'REJECTED') then
    raise exception 'Invalid registration status';
  end if;

  select r.tournament_id into event_id
  from public.tournament_registrations r
  where r.id = p_registration_id;
  if not found then
    raise exception 'Registration not found';
  end if;

  select * into event_row
  from public.tournament_domain t
  where t.id = event_id
  for update;
  if not found then
    raise exception 'Tournament not found';
  end if;
  if event_row.organizer_profile_id <> auth.uid()::text and not public.is_admin_user() then
    raise exception 'Organizer access required';
  end if;

  select * into registration_row
  from public.tournament_registrations r
  where r.id = p_registration_id
  for update;
  if registration_row.status <> 'PENDING' then
    raise exception 'Only pending registrations can be reviewed';
  end if;

  update public.tournament_registrations r
  set status = p_status, updated_at = now()
  where r.id = p_registration_id
  returning * into registration_row;

  update public.tournament_domain t
  set payload = jsonb_set(
        t.payload,
        '{currentParticipants}',
        to_jsonb((
          select count(*)::integer
          from public.tournament_registrations r
          where r.tournament_id = event_id and r.status = 'APPROVED'
        )),
        true
      ),
      updated_at = now()
  where t.id = event_id;

  return registration_row;
end;
$$;

revoke all on function public.register_for_tournament(text, text) from public, anon;
revoke all on function public.review_tournament_registration(text, text) from public, anon;
grant execute on function public.register_for_tournament(text, text) to authenticated;
grant execute on function public.review_tournament_registration(text, text) to authenticated;

create or replace function public.prevent_unverified_result_publication()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
begin
  if auth.uid() is not null and not public.is_admin_user()
    and new.payload ->> 'resultStatus' = 'VERIFIED'
  then
    raise exception 'Only platform reviewers can verify results' using errcode = '42501';
  end if;
  return new;
end;
$$;

create trigger match_results_prevent_owner_verification
before insert or update on public.match_results
for each row execute function public.prevent_unverified_result_publication();

create or replace function public.prevent_unverified_performance_publication()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
begin
  if auth.uid() is not null and not public.is_admin_user()
    and new.payload ->> 'verified' = 'true'
  then
    raise exception 'Only platform reviewers can verify performances' using errcode = '42501';
  end if;
  return new;
end;
$$;

create trigger match_performances_prevent_owner_verification
before insert or update on public.match_performances
for each row execute function public.prevent_unverified_performance_publication();

drop policy if exists "match_results_read" on public.match_results;
drop policy if exists "match_results_owner_write" on public.match_results;
create policy "match_results_public_verified_or_owner_read" on public.match_results
for select to anon, authenticated
using (
  public.is_admin_user()
  or exists (
    select 1 from public.tournament_domain t
    where t.id = match_results.tournament_id
      and t.organizer_profile_id = auth.uid()::text
  )
  or (
    payload ->> 'resultStatus' = 'VERIFIED'
    and exists (
      select 1 from public.tournament_domain t
      where t.id = match_results.tournament_id
        and t.payload ->> 'status' in ('UPCOMING', 'REGISTRATION_OPEN', 'LIVE', 'COMPLETED', 'CANCELLED')
    )
  )
);
create policy "match_results_owner_insert" on public.match_results
for insert to authenticated
with check (
  (organizer_profile_id = auth.uid()::text and exists (
    select 1 from public.tournament_domain t
    where t.id = match_results.tournament_id and t.organizer_profile_id = auth.uid()::text
  ))
  or public.is_admin_user()
);
create policy "match_results_owner_update" on public.match_results
for update to authenticated
using (organizer_profile_id = auth.uid()::text or public.is_admin_user())
with check (
  (organizer_profile_id = auth.uid()::text and exists (
    select 1 from public.tournament_domain t
    where t.id = match_results.tournament_id and t.organizer_profile_id = auth.uid()::text
  ))
  or public.is_admin_user()
);
create policy "match_results_owner_delete" on public.match_results
for delete to authenticated
using (organizer_profile_id = auth.uid()::text or public.is_admin_user());

drop policy if exists "match_performances_read" on public.match_performances;
drop policy if exists "match_performances_owner_write" on public.match_performances;
create policy "match_performances_public_verified_or_owner_read" on public.match_performances
for select to anon, authenticated
using (
  public.is_admin_user()
  or exists (
    select 1
    from public.match_results r
    join public.tournament_domain t on t.id = r.tournament_id
    where r.id = match_performances.match_id
      and r.organizer_profile_id = auth.uid()::text
  )
  or exists (
    select 1
    from public.match_results r
    join public.tournament_domain t on t.id = r.tournament_id
    where r.id = match_performances.match_id
      and r.payload ->> 'resultStatus' = 'VERIFIED'
      and t.payload ->> 'status' in ('UPCOMING', 'REGISTRATION_OPEN', 'LIVE', 'COMPLETED', 'CANCELLED')
  )
);
create policy "match_performances_owner_insert" on public.match_performances
for insert to authenticated
with check (
  public.is_admin_user()
  or exists (
    select 1
    from public.match_results r
    join public.tournament_domain t on t.id = r.tournament_id
    where r.id = match_performances.match_id
      and r.organizer_profile_id = auth.uid()::text
      and t.organizer_profile_id = auth.uid()::text
  )
);
create policy "match_performances_owner_update" on public.match_performances
for update to authenticated
using (
  public.is_admin_user()
  or exists (
    select 1 from public.match_results r
    where r.id = match_performances.match_id and r.organizer_profile_id = auth.uid()::text
  )
)
with check (
  public.is_admin_user()
  or exists (
    select 1 from public.match_results r
    join public.tournament_domain t on t.id = r.tournament_id
    where r.id = match_performances.match_id
      and r.organizer_profile_id = auth.uid()::text
      and t.organizer_profile_id = auth.uid()::text
  )
);
create policy "match_performances_owner_delete" on public.match_performances
for delete to authenticated
using (
  public.is_admin_user()
  or exists (
    select 1 from public.match_results r
    where r.id = match_performances.match_id and r.organizer_profile_id = auth.uid()::text
  )
);

revoke all on public.match_results, public.match_performances from anon, authenticated;
grant select on public.match_results, public.match_performances to anon, authenticated;
grant insert, update, delete on public.match_results, public.match_performances to authenticated;

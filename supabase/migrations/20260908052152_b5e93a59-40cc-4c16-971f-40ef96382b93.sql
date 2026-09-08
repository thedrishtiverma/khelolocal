
create schema if not exists private;
revoke all on schema private from anon, authenticated;
grant usage on schema private to authenticated;

create or replace function private.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

create or replace function private.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin') $$;

create or replace function private.has_current_role(_role public.app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = auth.uid() and role = _role) $$;

create or replace function private.app_user_id()
returns text language sql stable security definer set search_path = public
as $$ select id from public.app_users where auth_user_id = auth.uid() limit 1 $$;

create or replace function private.owns_organizer(_organizer_id text)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.organizers o where o.id = _organizer_id and o.user_id = private.app_user_id()) $$;

create or replace function private.owns_college(_college_id text)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.colleges c where c.id = _college_id and c.user_id = private.app_user_id()) $$;

create or replace function private.owns_volunteer(_volunteer_id text)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.volunteers v where v.id = _volunteer_id and v.user_id = private.app_user_id()) $$;

grant execute on function private.has_role(uuid, public.app_role) to authenticated;
grant execute on function private.is_admin() to authenticated;
grant execute on function private.has_current_role(public.app_role) to authenticated;
grant execute on function private.app_user_id() to authenticated;
grant execute on function private.owns_organizer(text) to authenticated;
grant execute on function private.owns_college(text) to authenticated;
grant execute on function private.owns_volunteer(text) to authenticated;

-- remove the publicly executable SECURITY DEFINER function from the exposed schema
drop function if exists public.has_role(uuid, public.app_role);

-- app_users: own row or admin
drop policy if exists app_users_auth_read on public.app_users;
drop policy if exists app_users_auth_write on public.app_users;
create policy app_users_self_read on public.app_users for select to authenticated
  using (auth_user_id = auth.uid() or private.is_admin());
create policy app_users_self_write on public.app_users for all to authenticated
  using (auth_user_id = auth.uid() or private.is_admin())
  with check (auth_user_id = auth.uid() or private.is_admin());

-- organizers: contact details for signed-in users only
drop policy if exists organizers_public_read on public.organizers;
drop policy if exists organizers_auth_write on public.organizers;
revoke select on public.organizers from anon;
create policy organizers_auth_read on public.organizers for select to authenticated using (true);
create policy organizers_owner_write on public.organizers for all to authenticated
  using (user_id = private.app_user_id() or private.is_admin())
  with check (user_id = private.app_user_id() or private.is_admin());

-- volunteers: own record or admin
drop policy if exists volunteers_auth_read on public.volunteers;
drop policy if exists volunteers_auth_write on public.volunteers;
create policy volunteers_self_read on public.volunteers for select to authenticated
  using (user_id = private.app_user_id() or private.is_admin());
create policy volunteers_self_write on public.volunteers for all to authenticated
  using (user_id = private.app_user_id() or private.is_admin())
  with check (user_id = private.app_user_id() or private.is_admin());

-- field_submissions: submitting volunteer or admin
drop policy if exists field_submissions_auth_read on public.field_submissions;
drop policy if exists field_submissions_auth_write on public.field_submissions;
create policy field_submissions_owner_read on public.field_submissions for select to authenticated
  using (private.owns_volunteer(volunteer_id) or private.is_admin());
create policy field_submissions_owner_write on public.field_submissions for all to authenticated
  using (private.owns_volunteer(volunteer_id) or private.is_admin())
  with check (private.owns_volunteer(volunteer_id) or private.is_admin());

-- connections: scout owner (athlete may read their own)
drop policy if exists connections_auth_read on public.connections;
drop policy if exists connections_auth_write on public.connections;
create policy connections_owner_read on public.connections for select to authenticated
  using (
    scout_user_id = private.app_user_id()
    or scout_user_id = auth.uid()::text
    or private.is_admin()
    or exists (select 1 from public.athletes a where a.id = connections.athlete_id and a.user_id = private.app_user_id())
  );
create policy connections_owner_write on public.connections for all to authenticated
  using (scout_user_id = private.app_user_id() or scout_user_id = auth.uid()::text or private.is_admin())
  with check (scout_user_id = private.app_user_id() or scout_user_id = auth.uid()::text or private.is_admin());

-- saved_athletes: owner only
drop policy if exists saved_auth_read on public.saved_athletes;
drop policy if exists saved_auth_write on public.saved_athletes;
create policy saved_owner_read on public.saved_athletes for select to authenticated
  using (user_id = private.app_user_id() or user_id = auth.uid()::text);
create policy saved_owner_write on public.saved_athletes for all to authenticated
  using (user_id = private.app_user_id() or user_id = auth.uid()::text)
  with check (user_id = private.app_user_id() or user_id = auth.uid()::text);

-- athletes: owner / college of record / admin
drop policy if exists athletes_auth_write on public.athletes;
create policy athletes_owner_write on public.athletes for all to authenticated
  using (user_id = private.app_user_id() or private.owns_college(college_id) or private.is_admin())
  with check (user_id = private.app_user_id() or private.owns_college(college_id) or private.is_admin());

-- colleges
drop policy if exists colleges_auth_write on public.colleges;
create policy colleges_owner_write on public.colleges for all to authenticated
  using (user_id = private.app_user_id() or private.is_admin())
  with check (user_id = private.app_user_id() or private.is_admin());

-- college_records
drop policy if exists college_records_auth_write on public.college_records;
create policy college_records_owner_write on public.college_records for all to authenticated
  using (private.owns_college(college_id) or private.is_admin())
  with check (private.owns_college(college_id) or private.is_admin());

-- tournaments
drop policy if exists tournaments_auth_write on public.tournaments;
create policy tournaments_owner_write on public.tournaments for all to authenticated
  using (private.owns_organizer(organizer_id) or private.is_admin())
  with check (private.owns_organizer(organizer_id) or private.is_admin());

-- organizer-run competition data
drop policy if exists matches_auth_write on public.matches;
create policy matches_organizer_write on public.matches for all to authenticated
  using (private.has_current_role('organizer') or private.is_admin())
  with check (private.has_current_role('organizer') or private.is_admin());

drop policy if exists registrations_auth_write on public.registrations;
create policy registrations_write on public.registrations for all to authenticated
  using (private.has_current_role('organizer') or private.has_current_role('athlete') or private.is_admin())
  with check (private.has_current_role('organizer') or private.has_current_role('athlete') or private.is_admin());

drop policy if exists teams_auth_write on public.teams;
create policy teams_write on public.teams for all to authenticated
  using (private.has_current_role('organizer') or private.has_current_role('athlete') or private.is_admin())
  with check (private.has_current_role('organizer') or private.has_current_role('athlete') or private.is_admin());

drop policy if exists achievements_auth_write on public.achievements;
create policy achievements_write on public.achievements for all to authenticated
  using (private.has_current_role('organizer') or private.is_admin())
  with check (private.has_current_role('organizer') or private.is_admin());

drop policy if exists player_performances_auth_write on public.player_performances;
create policy player_performances_write on public.player_performances for all to authenticated
  using (private.has_current_role('organizer') or private.is_admin())
  with check (private.has_current_role('organizer') or private.is_admin());

drop policy if exists verifications_auth_write on public.verifications;
create policy verifications_write on public.verifications for all to authenticated
  using (private.has_current_role('organizer') or private.is_admin())
  with check (private.has_current_role('organizer') or private.is_admin());

-- reference data: admins only
drop policy if exists sports_auth_write on public.sports;
create policy sports_admin_write on public.sports for all to authenticated
  using (private.is_admin()) with check (private.is_admin());

drop policy if exists cities_auth_write on public.cities;
create policy cities_admin_write on public.cities for all to authenticated
  using (private.is_admin()) with check (private.is_admin());

drop policy if exists zones_auth_write on public.zones;
create policy zones_admin_write on public.zones for all to authenticated
  using (private.is_admin()) with check (private.is_admin());

-- Production auth/profile completion. Apply this after the foundation migration.
-- It creates a profile inside the database transaction that creates auth.users,
-- so sign-up also works when Supabase email confirmation is enabled.

create or replace function public.signup_role(metadata jsonb)
returns public.app_role
language sql
immutable
set search_path = public
as $$
  select case lower(coalesce(metadata ->> 'requested_role', 'athlete'))
    when 'organizer' then 'organizer'::public.app_role
    when 'institution' then 'institution'::public.app_role
    when 'volunteer' then 'volunteer'::public.app_role
    when 'scout' then 'scout'::public.app_role
    else 'athlete'::public.app_role
  end;
$$;

create or replace function public.create_profile_for_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  assigned_role public.app_role := public.signup_role(new.raw_user_meta_data);
  display_name text := coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), split_part(new.email, '@', 1));
begin
  insert into public.profiles (id, auth_user_id, email, name, role)
  values (new.id, new.id, new.email, display_name, assigned_role)
  on conflict (id) do nothing;

  if assigned_role = 'athlete' then
    insert into public.athlete_profiles (id, profile_id, auth_user_id)
    values (new.id, new.id, new.id)
    on conflict (id) do nothing;
  elsif assigned_role = 'organizer' then
    insert into public.organizer_profiles (id, profile_id, auth_user_id, organization_name, email)
    values (new.id, new.id, new.id, display_name, new.email)
    on conflict (id) do nothing;
  elsif assigned_role = 'institution' then
    insert into public.institution_profiles (id, profile_id, auth_user_id, institution_name, email)
    values (new.id, new.id, new.id, display_name, new.email)
    on conflict (id) do nothing;
  elsif assigned_role = 'volunteer' then
    insert into public.volunteer_profiles (id, profile_id, auth_user_id)
    values (new.id, new.id, new.id)
    on conflict (id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists create_profile_for_auth_user on auth.users;
create trigger create_profile_for_auth_user
  after insert on auth.users
  for each row execute function public.create_profile_for_auth_user();

-- New accounts may never self-select admin; create administrators only with the
-- Supabase dashboard/service role. Admins can view and operate all profiles.
drop policy if exists "profiles_self_write" on public.profiles;
create policy "profiles_self_write" on public.profiles
for all to authenticated
using (auth.uid() = id or public.is_admin_user())
with check (
  (auth.uid() = id and role <> 'admin')
  or public.is_admin_user()
);

-- Correct the public-visibility predicate: it must inspect the profile being
-- requested, not the viewer's profile.
drop policy if exists "organizer_profiles_public_select" on public.organizer_profiles;
create policy "organizer_profiles_public_select" on public.organizer_profiles
for select to anon, authenticated
using (
  auth.uid() = auth_user_id
  or public.is_admin_user()
  or exists (select 1 from public.profiles p where p.id = organizer_profiles.profile_id and p.profile_visibility = 'public')
);

drop policy if exists "institution_profiles_public_select" on public.institution_profiles;
create policy "institution_profiles_public_select" on public.institution_profiles
for select to anon, authenticated
using (
  auth.uid() = auth_user_id
  or public.is_admin_user()
  or exists (select 1 from public.profiles p where p.id = institution_profiles.profile_id and p.profile_visibility = 'public')
);

-- Existing installations can safely backfill any users made before this trigger.
insert into public.profiles (id, auth_user_id, email, name, role)
select u.id, u.id, u.email,
       coalesce(nullif(trim(u.raw_user_meta_data ->> 'full_name'), ''), split_part(u.email, '@', 1)),
       public.signup_role(u.raw_user_meta_data)
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id)
on conflict (id) do nothing;

insert into public.athlete_profiles (id, profile_id, auth_user_id)
select p.id, p.id, p.auth_user_id
from public.profiles p
where p.role = 'athlete'
on conflict (id) do nothing;

insert into public.organizer_profiles (id, profile_id, auth_user_id, organization_name, email)
select p.id, p.id, p.auth_user_id, p.name, p.email
from public.profiles p
where p.role = 'organizer'
on conflict (id) do nothing;

insert into public.institution_profiles (id, profile_id, auth_user_id, institution_name, email)
select p.id, p.id, p.auth_user_id, p.name, p.email
from public.profiles p
where p.role = 'institution'
on conflict (id) do nothing;

insert into public.volunteer_profiles (id, profile_id, auth_user_id)
select p.id, p.id, p.auth_user_id
from public.profiles p
where p.role = 'volunteer'
on conflict (id) do nothing;

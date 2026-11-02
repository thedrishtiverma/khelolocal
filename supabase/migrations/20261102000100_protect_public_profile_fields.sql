drop policy if exists "profiles_public_select" on public.profiles;
create policy "profiles_owner_admin_select" on public.profiles
for select to authenticated
using (auth.uid() = id or public.is_admin_user());

revoke select on public.profiles from anon;

create or replace view public.profile_directory
with (security_barrier = true)
as
select id, name, role, city_id, area, profile_photo_url, bio, created_at
from public.profiles
where profile_visibility = 'public'
  and role <> 'athlete';

drop policy if exists "athlete_profiles_public_select" on public.athlete_profiles;
create policy "athlete_profiles_owner_admin_select" on public.athlete_profiles
for select to authenticated
using (auth.uid() = auth_user_id or public.is_admin_user());

revoke select on public.athlete_profiles from anon;

create or replace view public.athlete_directory
with (security_barrier = true)
as
select
  athlete.id,
  profile.name,
  athlete.city,
  athlete.area,
  athlete.institution,
  athlete.primary_sport,
  athlete.secondary_sports,
  athlete.position,
  athlete.position_group,
  athlete.age_group,
  athlete.gender,
  athlete.bio,
  athlete.verification_status,
  athlete.profile_photo_url
from public.athlete_profiles athlete
join public.profiles profile on profile.id = athlete.profile_id
where athlete.profile_visibility = 'public'
  and profile.profile_visibility = 'public'
  and athlete.date_of_birth is not null
  and athlete.date_of_birth <= (
    timezone('Asia/Kolkata', now())::date - interval '18 years'
  )::date;

drop policy if exists "organizer_profiles_public_select" on public.organizer_profiles;
create policy "organizer_profiles_owner_admin_select" on public.organizer_profiles
for select to authenticated
using (auth.uid() = auth_user_id or public.is_admin_user());

revoke select on public.organizer_profiles from anon;

create or replace view public.organizer_directory
with (security_barrier = true)
as
select
  organizer.id,
  profile.name,
  organizer.organization_name,
  organizer.organizer_type,
  organizer.city,
  organizer.area,
  organizer.description,
  organizer.verification_status,
  organizer.profile_photo_url
from public.organizer_profiles organizer
join public.profiles profile on profile.id = organizer.profile_id
where profile.profile_visibility = 'public';

drop policy if exists "institution_profiles_public_select" on public.institution_profiles;
create policy "institution_profiles_owner_admin_select" on public.institution_profiles
for select to authenticated
using (auth.uid() = auth_user_id or public.is_admin_user());

revoke select on public.institution_profiles from anon;

create or replace view public.institution_directory
with (security_barrier = true)
as
select
  institution.id,
  profile.name,
  institution.institution_name,
  institution.institution_type,
  institution.city,
  institution.area,
  institution.description,
  institution.verification_status,
  institution.profile_photo_url
from public.institution_profiles institution
join public.profiles profile on profile.id = institution.profile_id
where profile.profile_visibility = 'public';

drop policy if exists athletes_public_read on public.athletes;
create policy athletes_owner_college_admin_read on public.athletes
for select to authenticated
using (
  user_id = private.app_user_id()
  or private.owns_college(college_id)
  or private.is_admin()
);

revoke select on public.athletes from anon;

create or replace view public.legacy_athlete_directory
with (security_barrier = true)
as
select
  id,
  name,
  profile_image,
  city_id,
  city_name,
  primary_sport,
  position,
  position_group,
  age_category,
  bio,
  verification_status,
  tournaments_played,
  matches_played,
  wins,
  losses,
  goals,
  verified_achievements_count,
  college_name,
  enrollment_year
from public.athletes
where date_of_birth ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
  and date_of_birth <= to_char(
    timezone('Asia/Kolkata', now())::date - interval '18 years',
    'YYYY-MM-DD'
  );

grant select on public.profile_directory to anon, authenticated;
grant select on public.athlete_directory to anon, authenticated;
grant select on public.organizer_directory to anon, authenticated;
grant select on public.institution_directory to anon, authenticated;
grant select on public.legacy_athlete_directory to anon, authenticated;

notify pgrst, 'reload schema';

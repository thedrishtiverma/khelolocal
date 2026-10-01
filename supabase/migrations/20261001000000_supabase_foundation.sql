create extension if not exists postgis;

create type public.app_role as enum (
  'athlete',
  'organizer',
  'institution',
  'volunteer',
  'admin'
);

create type public.profile_visibility as enum (
  'private',
  'public',
  'network'
);

create type public.verification_status as enum (
  'pending',
  'verified',
  'rejected'
);

create type public.gender_type as enum (
  'male',
  'female',
  'other'
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null unique,
  name text not null default '',
  phone text default '',
  role public.app_role not null,
  city_id text default '',
  area text default '',
  profile_photo_url text default '',
  bio text default '',
  profile_visibility public.profile_visibility not null default 'private',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.prevent_self_admin_assignment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role = 'admin' and auth.uid() is not null and new.id = auth.uid() then
    raise exception 'Admin role cannot be assigned from the client app.';
  end if;
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create trigger profiles_prevent_self_admin_assignment
before insert or update on public.profiles
for each row
execute function public.prevent_self_admin_assignment();

create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_city_area on public.profiles(city_id, area);

create table if not exists public.sports (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  icon text default '',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.athlete_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  city text default '',
  area text default '',
  institution text default '',
  primary_sport text default '',
  secondary_sports text[] not null default '{}',
  position text default '',
  position_group text default '',
  age_group text default '',
  bio text default '',
  date_of_birth date,
  gender public.gender_type,
  contact_visibility text default 'private',
  profile_visibility public.profile_visibility not null default 'private',
  verification_status public.verification_status not null default 'pending',
  profile_photo_url text default '',
  latitude double precision,
  longitude double precision,
  geo_point geography(point, 4326),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organizer_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  organization_name text not null default '',
  organizer_type text not null default 'Club',
  city text default '',
  area text default '',
  phone text default '',
  email text default '',
  description text default '',
  verification_status public.verification_status not null default 'pending',
  profile_photo_url text default '',
  latitude double precision,
  longitude double precision,
  geo_point geography(point, 4326),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.institution_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  institution_name text not null default '',
  institution_type text not null default 'College',
  city text default '',
  area text default '',
  address text default '',
  phone text default '',
  email text default '',
  description text default '',
  verification_status public.verification_status not null default 'pending',
  profile_photo_url text default '',
  latitude double precision,
  longitude double precision,
  geo_point geography(point, 4326),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.volunteer_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  city text default '',
  area text default '',
  role text default 'field-volunteer',
  active boolean not null default true,
  profile_photo_url text default '',
  latitude double precision,
  longitude double precision,
  geo_point geography(point, 4326),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sport_id uuid not null references public.sports(id) on delete restrict,
  city text default '',
  area text default '',
  captain_profile_id uuid references public.profiles(id) on delete set null,
  coach_profile_id uuid references public.profiles(id) on delete set null,
  latitude double precision,
  longitude double precision,
  geo_point geography(point, 4326),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.coaches (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  team_id uuid references public.teams(id) on delete set null,
  primary_sport text default '',
  coaching_role text default 'coach',
  verification_status public.verification_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_athlete_profiles_geo_point on public.athlete_profiles using gist (geo_point);
create index if not exists idx_organizer_profiles_geo_point on public.organizer_profiles using gist (geo_point);
create index if not exists idx_institution_profiles_geo_point on public.institution_profiles using gist (geo_point);
create index if not exists idx_volunteer_profiles_geo_point on public.volunteer_profiles using gist (geo_point);
create index if not exists idx_teams_geo_point on public.teams using gist (geo_point);

create or replace function public.is_admin_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  );
$$;

grant usage on schema public to anon, authenticated;
revoke all on schema public from anon;

grant select on public.sports to anon, authenticated;
grant all on public.sports to service_role;

grant select on public.profiles to authenticated;
grant select on public.profiles to anon with grant option;
grant update, insert, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;

grant select on public.athlete_profiles to anon, authenticated;
grant all on public.athlete_profiles to service_role;
grant select, insert, update, delete on public.athlete_profiles to authenticated;

grant select on public.organizer_profiles to anon, authenticated;
grant all on public.organizer_profiles to service_role;
grant select, insert, update, delete on public.organizer_profiles to authenticated;

grant select on public.institution_profiles to anon, authenticated;
grant all on public.institution_profiles to service_role;
grant select, insert, update, delete on public.institution_profiles to authenticated;

grant select on public.volunteer_profiles to anon, authenticated;
grant all on public.volunteer_profiles to service_role;
grant select, insert, update, delete on public.volunteer_profiles to authenticated;

grant select on public.teams to anon, authenticated;
grant all on public.teams to service_role;
grant select, insert, update, delete on public.teams to authenticated;

grant select on public.coaches to anon, authenticated;
grant all on public.coaches to service_role;
grant select, insert, update, delete on public.coaches to authenticated;

alter table public.profiles enable row level security;
alter table public.sports enable row level security;
alter table public.athlete_profiles enable row level security;
alter table public.organizer_profiles enable row level security;
alter table public.institution_profiles enable row level security;
alter table public.volunteer_profiles enable row level security;
alter table public.teams enable row level security;
alter table public.coaches enable row level security;

create policy "profiles_public_select" on public.profiles
for select to anon, authenticated
using (
  profile_visibility = 'public'
  or auth.uid() = id
  or public.is_admin_user()
);

create policy "profiles_self_write" on public.profiles
for all to authenticated
using (auth.uid() = id or public.is_admin_user())
with check (auth.uid() = id and role <> 'admin');

create policy "profiles_admin_write" on public.profiles
for all to service_role
using (true)
with check (true);

create policy "sports_public_select" on public.sports
for select to anon, authenticated
using (true);

create policy "sports_admin_write" on public.sports
for all to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

create policy "athlete_profiles_public_select" on public.athlete_profiles
for select to anon, authenticated
using (
  profile_visibility = 'public'
  or auth.uid() = auth_user_id
  or public.is_admin_user()
);

create policy "athlete_profiles_owner_write" on public.athlete_profiles
for all to authenticated
using (auth.uid() = auth_user_id or public.is_admin_user())
with check (auth.uid() = auth_user_id or public.is_admin_user());

create policy "organizer_profiles_public_select" on public.organizer_profiles
for select to anon, authenticated
using (
  auth.uid() = auth_user_id
  or public.is_admin_user()
  or exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.profile_visibility = 'public'
  )
);

create policy "organizer_profiles_owner_write" on public.organizer_profiles
for all to authenticated
using (auth.uid() = auth_user_id or public.is_admin_user())
with check (auth.uid() = auth_user_id or public.is_admin_user());

create policy "institution_profiles_public_select" on public.institution_profiles
for select to anon, authenticated
using (
  auth.uid() = auth_user_id
  or public.is_admin_user()
  or exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.profile_visibility = 'public'
  )
);

create policy "institution_profiles_owner_write" on public.institution_profiles
for all to authenticated
using (auth.uid() = auth_user_id or public.is_admin_user())
with check (auth.uid() = auth_user_id or public.is_admin_user());

create policy "volunteer_profiles_public_select" on public.volunteer_profiles
for select to anon, authenticated
using (
  auth.uid() = auth_user_id
  or public.is_admin_user()
);

create policy "volunteer_profiles_owner_write" on public.volunteer_profiles
for all to authenticated
using (auth.uid() = auth_user_id or public.is_admin_user())
with check (auth.uid() = auth_user_id or public.is_admin_user());

create policy "teams_public_select" on public.teams
for select to anon, authenticated
using (true);

create policy "teams_owner_write" on public.teams
for all to authenticated
using (
  captain_profile_id = auth.uid()
  or coach_profile_id = auth.uid()
  or public.is_admin_user()
)
with check (
  captain_profile_id = auth.uid()
  or coach_profile_id = auth.uid()
  or public.is_admin_user()
);

create policy "coaches_public_select" on public.coaches
for select to anon, authenticated
using (true);

create policy "coaches_owner_write" on public.coaches
for all to authenticated
using (auth.uid() = auth_user_id or public.is_admin_user())
with check (auth.uid() = auth_user_id or public.is_admin_user());

create or replace trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create or replace trigger athlete_profiles_set_updated_at
before update on public.athlete_profiles
for each row
execute function public.set_updated_at();

create or replace trigger organizer_profiles_set_updated_at
before update on public.organizer_profiles
for each row
execute function public.set_updated_at();

create or replace trigger institution_profiles_set_updated_at
before update on public.institution_profiles
for each row
execute function public.set_updated_at();

create or replace trigger volunteer_profiles_set_updated_at
before update on public.volunteer_profiles
for each row
execute function public.set_updated_at();

create or replace trigger teams_set_updated_at
before update on public.teams
for each row
execute function public.set_updated_at();

create or replace trigger coaches_set_updated_at
before update on public.coaches
for each row
execute function public.set_updated_at();

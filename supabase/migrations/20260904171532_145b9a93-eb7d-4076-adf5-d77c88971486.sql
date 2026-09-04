create table public.cities ( id text primary key, name text, state text, country text, latitude double precision, longitude double precision, active boolean, created_at timestamptz not null default now(), updated_at_db timestamptz not null default now());
grant select on public.cities to anon;
grant select, insert, update, delete on public.cities to authenticated;
grant all on public.cities to service_role;
alter table public.cities enable row level security;
create policy "cities_public_read" on public.cities for select to anon, authenticated using (true);
create policy "cities_auth_write" on public.cities for all to authenticated using (true) with check (true);

create table public.sports ( id text primary key, name text, icon text, active boolean, created_at timestamptz not null default now(), updated_at_db timestamptz not null default now());
grant select on public.sports to anon;
grant select, insert, update, delete on public.sports to authenticated;
grant all on public.sports to service_role;
alter table public.sports enable row level security;
create policy "sports_public_read" on public.sports for select to anon, authenticated using (true);
create policy "sports_auth_write" on public.sports for all to authenticated using (true) with check (true);

create table public.zones ( id text primary key, name text, city_id text, city_name text, localities jsonb not null default '[]'::jsonb, latitude double precision, longitude double precision, created_at timestamptz not null default now(), updated_at_db timestamptz not null default now());
grant select on public.zones to anon;
grant select, insert, update, delete on public.zones to authenticated;
grant all on public.zones to service_role;
alter table public.zones enable row level security;
create policy "zones_public_read" on public.zones for select to anon, authenticated using (true);
create policy "zones_auth_write" on public.zones for all to authenticated using (true) with check (true);

create table public.app_users ( id text primary key, name text, email text, phone text, role text, city_id text, profile_image text, created_at text, updated_at text, is_active boolean, auth_user_id uuid, updated_at_db timestamptz not null default now());
grant select, insert, update, delete on public.app_users to authenticated;
grant all on public.app_users to service_role;
alter table public.app_users enable row level security;
create policy "app_users_auth_read" on public.app_users for select to authenticated using (true);
create policy "app_users_auth_write" on public.app_users for all to authenticated using (true) with check (true);

create table public.volunteers ( id text primary key, user_id text, name text, zone_id text, zone_name text, city_id text, phone text, joined_at text, created_at text, updated_at text, updated_at_db timestamptz not null default now());
grant select, insert, update, delete on public.volunteers to authenticated;
grant all on public.volunteers to service_role;
alter table public.volunteers enable row level security;
create policy "volunteers_auth_read" on public.volunteers for select to authenticated using (true);
create policy "volunteers_auth_write" on public.volunteers for all to authenticated using (true) with check (true);

create table public.field_submissions ( id text primary key, kind text, volunteer_id text, zone_id text, zone_name text, title text, sport_id text, locality text, address text, gps text, contact_name text, contact_phone text, start_date text, notes text, attachment_name text, attachment_url text, status text, review_note text, verified_by text, submitted_at text, created_at text, updated_at text, updated_at_db timestamptz not null default now());
grant select, insert, update, delete on public.field_submissions to authenticated;
grant all on public.field_submissions to service_role;
alter table public.field_submissions enable row level security;
create policy "field_submissions_auth_read" on public.field_submissions for select to authenticated using (true);
create policy "field_submissions_auth_write" on public.field_submissions for all to authenticated using (true) with check (true);

create table public.athletes ( id text primary key, user_id text, name text, profile_image text, city_id text, city_name text, date_of_birth text, gender text, primary_sport text, secondary_sports jsonb not null default '[]'::jsonb, position text, position_group text, age_category text, skills jsonb not null default '[]'::jsonb, bio text, verification_status text, tournaments_played integer, matches_played integer, wins integer, losses integer, goals integer, verified_achievements_count integer, college_id text, college_name text, enrollment_year text, created_at text, updated_at text, updated_at_db timestamptz not null default now());
grant select on public.athletes to anon;
grant select, insert, update, delete on public.athletes to authenticated;
grant all on public.athletes to service_role;
alter table public.athletes enable row level security;
create policy "athletes_public_read" on public.athletes for select to anon, authenticated using (true);
create policy "athletes_auth_write" on public.athletes for all to authenticated using (true) with check (true);

create table public.organizers ( id text primary key, user_id text, organization_name text, organization_type text, city_id text, city_name text, description text, logo text, phone text, email text, verification_status text, tournaments_hosted integer, created_at text, updated_at text, updated_at_db timestamptz not null default now());
grant select on public.organizers to anon;
grant select, insert, update, delete on public.organizers to authenticated;
grant all on public.organizers to service_role;
alter table public.organizers enable row level security;
create policy "organizers_public_read" on public.organizers for select to anon, authenticated using (true);
create policy "organizers_auth_write" on public.organizers for all to authenticated using (true) with check (true);

create table public.colleges ( id text primary key, user_id text, name text, short_name text, city_id text, city_name text, sports_event_name text, description text, verification_status text, created_at text, updated_at text, updated_at_db timestamptz not null default now());
grant select on public.colleges to anon;
grant select, insert, update, delete on public.colleges to authenticated;
grant all on public.colleges to service_role;
alter table public.colleges enable row level security;
create policy "colleges_public_read" on public.colleges for select to anon, authenticated using (true);
create policy "colleges_auth_write" on public.colleges for all to authenticated using (true) with check (true);

create table public.college_records ( id text primary key, college_id text, college_name text, athlete_id text, athlete_name text, sport_id text, sport_name text, event_name text, season text, level text, title text, description text, represented_for text, status text, college_verified_by text, admin_verified_by text, submitted_at text, updated_at text, created_at timestamptz not null default now(), updated_at_db timestamptz not null default now());
grant select on public.college_records to anon;
grant select, insert, update, delete on public.college_records to authenticated;
grant all on public.college_records to service_role;
alter table public.college_records enable row level security;
create policy "college_records_public_read" on public.college_records for select to anon, authenticated using (true);
create policy "college_records_auth_write" on public.college_records for all to authenticated using (true) with check (true);

create table public.tournaments ( id text primary key, name text, sport_id text, sport_name text, organizer_id text, organizer_name text, city_id text, city_name text, venue text, address text, start_date text, end_date text, registration_deadline text, age_category text, gender_category text, format text, max_participants integer, current_participants integer, registration_fee integer, prize_pool integer, description text, status text, banner_image text, admin_verified boolean, created_at text, updated_at text, updated_at_db timestamptz not null default now());
grant select on public.tournaments to anon;
grant select, insert, update, delete on public.tournaments to authenticated;
grant all on public.tournaments to service_role;
alter table public.tournaments enable row level security;
create policy "tournaments_public_read" on public.tournaments for select to anon, authenticated using (true);
create policy "tournaments_auth_write" on public.tournaments for all to authenticated using (true) with check (true);

create table public.registrations ( id text primary key, tournament_id text, athlete_id text, team_id text, registration_date text, status text, payment_status text, seed_number integer, created_at timestamptz not null default now(), updated_at_db timestamptz not null default now());
grant select on public.registrations to anon;
grant select, insert, update, delete on public.registrations to authenticated;
grant all on public.registrations to service_role;
alter table public.registrations enable row level security;
create policy "registrations_public_read" on public.registrations for select to anon, authenticated using (true);
create policy "registrations_auth_write" on public.registrations for all to authenticated using (true) with check (true);

create table public.teams ( id text primary key, name text, sport_id text, sport_name text, city_id text, city_name text, logo text, captain_id text, coach_id text, players jsonb not null default '[]'::jsonb, created_at text, updated_at_db timestamptz not null default now());
grant select on public.teams to anon;
grant select, insert, update, delete on public.teams to authenticated;
grant all on public.teams to service_role;
alter table public.teams enable row level security;
create policy "teams_public_read" on public.teams for select to anon, authenticated using (true);
create policy "teams_auth_write" on public.teams for all to authenticated using (true) with check (true);

create table public.matches ( id text primary key, tournament_id text, round text, match_number integer, team_a_id text, team_b_id text, team_a_score integer, team_b_score integer, scheduled_at text, venue text, status text, winner_id text, result_status text, created_at text, updated_at text, updated_at_db timestamptz not null default now());
grant select on public.matches to anon;
grant select, insert, update, delete on public.matches to authenticated;
grant all on public.matches to service_role;
alter table public.matches enable row level security;
create policy "matches_public_read" on public.matches for select to anon, authenticated using (true);
create policy "matches_auth_write" on public.matches for all to authenticated using (true) with check (true);

create table public.player_performances ( id text primary key, match_id text, tournament_id text, athlete_id text, team_id text, goals integer, assists integer, points integer, player_of_match boolean, performance_notes text, verified boolean, raid_points integer, tackle_points integer, bonus_points integer, created_at text, updated_at_db timestamptz not null default now());
grant select on public.player_performances to anon;
grant select, insert, update, delete on public.player_performances to authenticated;
grant all on public.player_performances to service_role;
alter table public.player_performances enable row level security;
create policy "player_performances_public_read" on public.player_performances for select to anon, authenticated using (true);
create policy "player_performances_auth_write" on public.player_performances for all to authenticated using (true) with check (true);

create table public.verifications ( id text primary key, match_id text, tournament_id text, organizer_id text, status text, verified_at text, verification_note text, created_at timestamptz not null default now(), updated_at_db timestamptz not null default now());
grant select on public.verifications to anon;
grant select, insert, update, delete on public.verifications to authenticated;
grant all on public.verifications to service_role;
alter table public.verifications enable row level security;
create policy "verifications_public_read" on public.verifications for select to anon, authenticated using (true);
create policy "verifications_auth_write" on public.verifications for all to authenticated using (true) with check (true);

create table public.achievements ( id text primary key, athlete_id text, tournament_id text, match_id text, title text, description text, achievement_type text, verified boolean, verified_by text, date text, created_at text, updated_at_db timestamptz not null default now());
grant select on public.achievements to anon;
grant select, insert, update, delete on public.achievements to authenticated;
grant all on public.achievements to service_role;
alter table public.achievements enable row level security;
create policy "achievements_public_read" on public.achievements for select to anon, authenticated using (true);
create policy "achievements_auth_write" on public.achievements for all to authenticated using (true) with check (true);

create table public.connections ( id text primary key, scout_user_id text, athlete_id text, status text, created_at text, updated_at_db timestamptz not null default now());
grant select, insert, update, delete on public.connections to authenticated;
grant all on public.connections to service_role;
alter table public.connections enable row level security;
create policy "connections_auth_read" on public.connections for select to authenticated using (true);
create policy "connections_auth_write" on public.connections for all to authenticated using (true) with check (true);

create table public.saved_athletes ( id uuid primary key default gen_random_uuid(), user_id text not null, athlete_id text not null, created_at timestamptz not null default now(), unique (user_id, athlete_id));
grant select, insert, update, delete on public.saved_athletes to authenticated;
grant all on public.saved_athletes to service_role;
alter table public.saved_athletes enable row level security;
create policy "saved_auth_read" on public.saved_athletes for select to authenticated using (true);
create policy "saved_auth_write" on public.saved_athletes for all to authenticated using (true) with check (true);

create type public.app_role as enum ('admin', 'college', 'organizer', 'volunteer', 'scout', 'athlete');

create table public.user_roles ( id uuid primary key default gen_random_uuid(), user_id uuid not null, role public.app_role not null, created_at timestamptz not null default now(), unique (user_id, role));
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "user_roles_self_read" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;
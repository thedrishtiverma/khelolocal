-- First normalized slice of operational data: tournament participation and
-- results. IDs remain text temporarily so the seeded demo dataset and the
-- production UUID profile IDs can coexist during the migration.
create table if not exists public.tournament_domain (
  id text primary key,
  organizer_profile_id text not null,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tournament_registrations (
  id text primary key,
  tournament_id text not null references public.tournament_domain(id) on delete cascade,
  athlete_profile_id text not null,
  team_id text,
  status text not null check (status in ('PENDING', 'APPROVED', 'REJECTED', 'WITHDRAWN')),
  registration_date timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.match_results (
  id text primary key,
  tournament_id text not null references public.tournament_domain(id) on delete cascade,
  organizer_profile_id text not null,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.match_performances (
  id text primary key,
  match_id text not null references public.match_results(id) on delete cascade,
  athlete_profile_id text not null,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.tournament_domain enable row level security;
alter table public.tournament_registrations enable row level security;
alter table public.match_results enable row level security;
alter table public.match_performances enable row level security;

create policy "tournament_domain_read" on public.tournament_domain for select to authenticated using (true);
create policy "tournament_domain_owner_write" on public.tournament_domain for all to authenticated
using (organizer_profile_id = auth.uid()::text or public.is_admin_user())
with check (organizer_profile_id = auth.uid()::text or public.is_admin_user());

create policy "registrations_read" on public.tournament_registrations for select to authenticated using (true);
create policy "registrations_athlete_write" on public.tournament_registrations for insert to authenticated
with check (athlete_profile_id = auth.uid()::text or public.is_admin_user());
create policy "registrations_athlete_update" on public.tournament_registrations for update to authenticated
using (athlete_profile_id = auth.uid()::text or public.is_admin_user())
with check (athlete_profile_id = auth.uid()::text or public.is_admin_user());
create policy "registrations_organizer_review" on public.tournament_registrations for update to authenticated
using (
  public.is_admin_user() or exists (
    select 1 from public.tournament_domain t
    where t.id = tournament_registrations.tournament_id and t.organizer_profile_id = auth.uid()::text
  )
)
with check (
  public.is_admin_user() or exists (
    select 1 from public.tournament_domain t
    where t.id = tournament_registrations.tournament_id and t.organizer_profile_id = auth.uid()::text
  )
);

create policy "match_results_read" on public.match_results for select to authenticated using (true);
create policy "match_results_owner_write" on public.match_results for all to authenticated
using (organizer_profile_id = auth.uid()::text or public.is_admin_user())
with check (organizer_profile_id = auth.uid()::text or public.is_admin_user());

create policy "match_performances_read" on public.match_performances for select to authenticated using (true);
create policy "match_performances_owner_write" on public.match_performances for all to authenticated
using (
  public.is_admin_user() or exists (
    select 1 from public.match_results r where r.id = match_performances.match_id and r.organizer_profile_id = auth.uid()::text
  )
)
with check (
  public.is_admin_user() or exists (
    select 1 from public.match_results r where r.id = match_performances.match_id and r.organizer_profile_id = auth.uid()::text
  )
);

create index if not exists tournament_registrations_tournament_idx on public.tournament_registrations(tournament_id);
create index if not exists match_results_tournament_idx on public.match_results(tournament_id);
create index if not exists match_performances_match_idx on public.match_performances(match_id);

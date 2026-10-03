-- Shared operational data for the current tournament UI. The JSON document
-- retains the existing, well-tested client model while moving its persistence
-- and audit trail off the browser. Domain tables can be carved out gradually
-- without a disruptive rewrite of the live workflows.
create table if not exists public.operational_state (
  id text primary key check (id = 'primary'),
  payload jsonb not null,
  version bigint not null default 1,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table if not exists public.operational_state_audit (
  id bigint generated always as identity primary key,
  state_version bigint not null,
  changed_by uuid references public.profiles(id) on delete set null,
  changed_at timestamptz not null default now()
);

alter table public.operational_state enable row level security;
alter table public.operational_state_audit enable row level security;

create policy "operational_state_authenticated_read" on public.operational_state
for select to authenticated using (true);

create policy "operational_state_audit_admin_read" on public.operational_state_audit
for select to authenticated using (public.is_admin_user());

-- All writes go through this RPC: no client receives direct table write access.
-- Optimistic versioning prevents a stale browser from silently overwriting a
-- newer tournament result.
create or replace function public.save_operational_state(
  next_payload jsonb,
  expected_version bigint default null
)
returns table(version bigint, updated_at timestamptz)
language plpgsql
security definer
set search_path = public
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
  if jsonb_typeof(next_payload) <> 'object' then
    raise exception 'Operational state must be an object';
  end if;

  select s.version into next_version from public.operational_state s where s.id = 'primary' for update;
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

revoke all on public.operational_state from anon, authenticated;
revoke all on public.operational_state_audit from anon, authenticated;
grant select on public.operational_state to authenticated;
grant select on public.operational_state_audit to authenticated;
grant execute on function public.save_operational_state(jsonb, bigint) to authenticated;

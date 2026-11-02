create or replace function public.prevent_owner_verification_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is not null then
    if tg_op = 'INSERT'
      and new.auth_user_id = current_user_id
      and new.verification_status <> 'pending'
    then
      raise exception 'Profile verification status is assigned by platform reviewers.';
    end if;

    if tg_op = 'UPDATE'
      and old.auth_user_id = current_user_id
      and new.verification_status is distinct from old.verification_status
    then
      raise exception 'Profile verification status is assigned by platform reviewers.';
    end if;
  end if;

  return new;
end;
$$;

create trigger athlete_profiles_prevent_owner_verification_change
before insert or update on public.athlete_profiles
for each row
execute function public.prevent_owner_verification_status_change();

create trigger organizer_profiles_prevent_owner_verification_change
before insert or update on public.organizer_profiles
for each row
execute function public.prevent_owner_verification_status_change();

create trigger institution_profiles_prevent_owner_verification_change
before insert or update on public.institution_profiles
for each row
execute function public.prevent_owner_verification_status_change();

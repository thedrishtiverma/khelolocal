create or replace function public.prevent_self_admin_assignment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is not null then
    if tg_op = 'INSERT' and new.id = current_user_id then
      raise exception 'Profile rows are provisioned during signup and cannot be inserted by the account owner.';
    end if;

    if tg_op = 'UPDATE'
      and old.id = current_user_id
      and (new.role is distinct from old.role or new.is_active is distinct from old.is_active)
    then
      raise exception 'Profile role and active status cannot be changed by the account owner.';
    end if;

    if new.role = 'admin' and new.id = current_user_id then
      raise exception 'Admin role cannot be assigned from the client app.';
    end if;
  end if;

  return new;
end;
$$;

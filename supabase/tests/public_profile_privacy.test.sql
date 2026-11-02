begin;

select plan(14);

insert into auth.users (
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data
)
values
  (
    'c2fb4eb9-d193-40bf-8cc6-00d52d9b5001',
    'authenticated',
    'authenticated',
    'private-minor@example.invalid',
    '',
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"requested_role":"athlete"}'::jsonb
  ),
  (
    'c2fb4eb9-d193-40bf-8cc6-00d52d9b5002',
    'authenticated',
    'authenticated',
    'public-adult@example.invalid',
    '',
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"requested_role":"athlete"}'::jsonb
  );

update public.profiles
set profile_visibility = 'public'
where id in (
  'c2fb4eb9-d193-40bf-8cc6-00d52d9b5001',
  'c2fb4eb9-d193-40bf-8cc6-00d52d9b5002'
);

update public.athlete_profiles
set profile_visibility = 'public',
    date_of_birth = case id
      when 'c2fb4eb9-d193-40bf-8cc6-00d52d9b5001' then date '2010-01-01'
      else date '1990-01-01'
    end
where id in (
  'c2fb4eb9-d193-40bf-8cc6-00d52d9b5001',
  'c2fb4eb9-d193-40bf-8cc6-00d52d9b5002'
);

select ok(
  not has_table_privilege('anon', 'public.profiles', 'SELECT'),
  'anonymous users cannot read profile rows directly'
);
select ok(
  not has_table_privilege('anon', 'public.athlete_profiles', 'SELECT'),
  'anonymous users cannot read athlete profile rows directly'
);
select ok(
  not has_table_privilege('anon', 'public.organizer_profiles', 'SELECT'),
  'anonymous users cannot read organizer contact rows directly'
);
select ok(
  not has_table_privilege('anon', 'public.institution_profiles', 'SELECT'),
  'anonymous users cannot read institution contact rows directly'
);
select ok(
  not has_table_privilege('anon', 'public.athletes', 'SELECT'),
  'anonymous users cannot read legacy athlete rows directly'
);

select hasnt_column('public', 'profile_directory', 'email', 'public profile listing omits email');
select hasnt_column('public', 'profile_directory', 'phone', 'public profile listing omits phone');
select hasnt_column('public', 'athlete_directory', 'date_of_birth', 'athlete listing omits birth date');
select hasnt_column('public', 'athlete_directory', 'latitude', 'athlete listing omits location coordinates');
select hasnt_column('public', 'legacy_athlete_directory', 'date_of_birth', 'legacy athlete listing omits birth date');
select hasnt_column('public', 'organizer_directory', 'email', 'organizer listing omits email');
select hasnt_column('public', 'institution_directory', 'phone', 'institution listing omits phone');

set local role anon;
select is(
  (select count(*)::integer from public.athlete_directory where id = 'c2fb4eb9-d193-40bf-8cc6-00d52d9b5001'),
  0,
  'public athlete listing excludes minors'
);
select is(
  (select count(*)::integer from public.athlete_directory where id = 'c2fb4eb9-d193-40bf-8cc6-00d52d9b5002'),
  1,
  'public athlete listing includes public adult profiles'
);

select * from finish();
rollback;

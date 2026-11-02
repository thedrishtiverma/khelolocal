begin;

select plan(6);

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
values (
  (
    'd18a6e5e-1db4-4fbb-903f-e4031f78ea3f',
    'authenticated',
    'authenticated',
    'rls-athlete-owner@example.invalid',
    '',
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"requested_role":"athlete"}'::jsonb
  ),
  (
    'd18a6e5e-1db4-4fbb-903f-e4031f78ea40',
    'authenticated',
    'authenticated',
    'rls-organizer-owner@example.invalid',
    '',
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"requested_role":"organizer"}'::jsonb
  ),
  (
    'd18a6e5e-1db4-4fbb-903f-e4031f78ea41',
    'authenticated',
    'authenticated',
    'rls-institution-owner@example.invalid',
    '',
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"requested_role":"institution"}'::jsonb
  );

set local role authenticated;
select set_config(
  'request.jwt.claim.sub',
  'd18a6e5e-1db4-4fbb-903f-e4031f78ea3f',
  true
);

select throws_ok(
  $$update public.profiles set role = 'organizer' where id = 'd18a6e5e-1db4-4fbb-903f-e4031f78ea3f'$$,
  'P0001',
  'Profile role and active status cannot be changed by the account owner.',
  'an account owner cannot assign themselves another role'
);

select throws_ok(
  $$update public.profiles set is_active = false where id = 'd18a6e5e-1db4-4fbb-903f-e4031f78ea3f'$$,
  'P0001',
  'Profile role and active status cannot be changed by the account owner.',
  'an account owner cannot change their own active status'
);

select throws_ok(
  $$insert into public.profiles (id, auth_user_id, email, role) values ('d18a6e5e-1db4-4fbb-903f-e4031f78ea3f', 'd18a6e5e-1db4-4fbb-903f-e4031f78ea3f', 'duplicate@example.invalid', 'organizer')$$,
  'P0001',
  'Profile rows are provisioned during signup and cannot be inserted by the account owner.',
  'an account owner cannot provision a profile with an elevated role'
);

select throws_ok(
  $$update public.athlete_profiles set verification_status = 'verified' where id = 'd18a6e5e-1db4-4fbb-903f-e4031f78ea3f'$$,
  'P0001',
  'Profile verification status is assigned by platform reviewers.',
  'an athlete cannot verify their own profile'
);

select set_config('request.jwt.claim.sub', 'd18a6e5e-1db4-4fbb-903f-e4031f78ea40', true);
select throws_ok(
  $$update public.organizer_profiles set verification_status = 'verified' where id = 'd18a6e5e-1db4-4fbb-903f-e4031f78ea40'$$,
  'P0001',
  'Profile verification status is assigned by platform reviewers.',
  'an organizer cannot verify their own profile'
);

select set_config('request.jwt.claim.sub', 'd18a6e5e-1db4-4fbb-903f-e4031f78ea41', true);
select throws_ok(
  $$update public.institution_profiles set verification_status = 'verified' where id = 'd18a6e5e-1db4-4fbb-903f-e4031f78ea41'$$,
  'P0001',
  'Profile verification status is assigned by platform reviewers.',
  'an institution cannot verify its own profile'
);

select * from finish();
rollback;

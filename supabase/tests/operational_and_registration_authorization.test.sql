begin;

select plan(11);

insert into auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data
)
values
  (
    'e61a6827-04db-4f2d-9e85-4918c9c85201', 'authenticated', 'authenticated',
    'registration-athlete@example.invalid', '', now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"requested_role":"athlete"}'::jsonb
  ),
  (
    'e61a6827-04db-4f2d-9e85-4918c9c85202', 'authenticated', 'authenticated',
    'registration-organizer@example.invalid', '', now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"requested_role":"organizer"}'::jsonb
  ),
  (
    'e61a6827-04db-4f2d-9e85-4918c9c85203', 'authenticated', 'authenticated',
    'registration-second-athlete@example.invalid', '', now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"requested_role":"athlete"}'::jsonb
  );

insert into public.tournament_domain (id, organizer_profile_id, payload)
values
  (
    'registration-security-event',
    'e61a6827-04db-4f2d-9e85-4918c9c85202',
    '{"status":"REGISTRATION_OPEN","maxParticipants":1}'::jsonb
  ),
  (
    'registration-security-draft',
    'e61a6827-04db-4f2d-9e85-4918c9c85202',
    '{"status":"DRAFT","maxParticipants":1}'::jsonb
  );

set local role authenticated;
select set_config('request.jwt.claim.sub', 'e61a6827-04db-4f2d-9e85-4918c9c85201', true);

select is(
  (select count(*)::integer from public.tournament_domain where id = 'registration-security-event'),
  1,
  'public registration-open events are discoverable'
);
select is(
  (select count(*)::integer from public.tournament_domain where id = 'registration-security-draft'),
  0,
  'draft events are not visible to unrelated users'
);
select is(
  (select (public.register_for_tournament('registration-security-event')).status),
  'PENDING',
  'an athlete registers only as the authenticated user'
);
select throws_ok(
  $$select public.register_for_tournament('registration-security-event')$$,
  'P0001',
  'Already registered',
  'an active duplicate registration is rejected'
);
select throws_ok(
  $$select public.review_tournament_registration(
    (select id from public.tournament_registrations where tournament_id = 'registration-security-event'),
    'APPROVED'
  )$$,
  'P0001',
  'Organizer access required',
  'participants cannot review registrations'
);

select set_config('request.jwt.claim.sub', 'e61a6827-04db-4f2d-9e85-4918c9c85203', true);
select throws_ok(
  $$select public.register_for_tournament('registration-security-event')$$,
  'P0001',
  'Tournament is full',
  'capacity is enforced under the event row lock'
);

select set_config('request.jwt.claim.sub', 'e61a6827-04db-4f2d-9e85-4918c9c85202', true);
select is(
  (select count(*)::integer from public.tournament_registrations where tournament_id = 'registration-security-event'),
  1,
  'the event organizer can view registrations for their event'
);
select is(
  (select public.review_tournament_registration(
    (select id from public.tournament_registrations where tournament_id = 'registration-security-event'),
    'APPROVED'
  )).status,
  'APPROVED',
  'the event organizer can approve a pending registration'
);

select set_config('request.jwt.claim.sub', 'e61a6827-04db-4f2d-9e85-4918c9c85201', true);
select throws_ok(
  $$update public.tournament_registrations set status = 'APPROVED' where tournament_id = 'registration-security-event'$$,
  '42501',
  'participants cannot directly change registration status'
);
select throws_ok(
  $$select * from public.save_operational_state('{"forged":true}'::jsonb, null)$$,
  'P0001',
  'Administrator access required',
  'ordinary users cannot overwrite the shared application state'
);
select is(
  (select count(*)::integer from public.operational_state),
  0,
  'ordinary users cannot read the shared application state'
);

select * from finish();
rollback;

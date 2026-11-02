# Engineering setup and security notes

## Local setup

Use Node.js 22 and npm; the checked-in `package-lock.json` is the lockfile used by CI. Copy `.env.example` to `.env.local`, then replace the Supabase URL and publishable key with values for the target project. The publishable key is intended for browser use; `SUPABASE_SERVICE_ROLE_KEY`, when needed by server-only code, must remain server-side and must never be given a `VITE_` prefix.

```bash
npm ci
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
```

The test command runs Vitest once. UI tests use jsdom and React Testing Library.

## KheloLocal icon and banner artwork

The original sport, role, activity, and status SVGs are defined in
`src/components/shared/KheloIcon.tsx`, with their named catalogs centralized in
`src/components/shared/khelo-icon-registry.ts`. Sport-specific banner compositions live in
`src/components/shared/BannerArtwork.tsx` and use the existing light/dark theme tokens.

When adding a sport, add its canonical ID to `SPORT_CATALOG`, register its pictogram and display
label in `SPORT_ICON_REGISTRY`, add a dedicated `SportGeometry` composition, and extend
`KheloIcon.test.tsx`. Keep compatibility aliases in the registry when older data uses another ID.
Role, activity, and status additions likewise belong in their registries and catalog coverage tests.
The existing icon library remains appropriate for familiar interface controls; use the KheloLocal
assets for sport, identity, network activity, status, and profile/banner visuals.

## Data and service boundaries

- `src/lib/services/store.tsx` is the UI-facing application store and coordinates profile/auth operations, local demo storage, and updates to shared operational data.
- `src/lib/services/db.ts` persists the unauthenticated demo experience in browser `localStorage`; that data is not a production database.
- `src/lib/services/backend-state.ts` loads and saves the legacy application-wide JSON document through `operational_state` and the `save_operational_state` RPC.
- `src/lib/services/tournament-backend.ts` persists tournament, registration, match-result, and performance records to normalized Supabase domain tables.
- `src/integrations/supabase/auth-helpers.ts` maps Supabase profiles and contains profile operations. Supabase RLS, not client-side role checks, is the authorization boundary.

Core relationships include `auth.users` to `profiles` (one-to-one), role-specific profiles to `profiles`, tournament registrations to tournament-domain records, match results to tournaments, and match performances to match results. The legacy JSON state and normalized tournament tables currently coexist; they are not yet a single transactional source of truth.

The shared JSON document contains more data than should be available to ordinary users. The `20261103000000_secure_operational_and_registration_access.sql` migration therefore limits its read and write RPC to platform administrators. Regular registration creation and review use database RPCs that derive the participant from `auth.uid()`, lock the event while checking capacity, and restrict review to the event organizer. Direct registration table writes are revoked. These database changes intentionally do not make the legacy JSON document a suitable production API.

## Database migrations and authorization tests

Apply migrations in order against a local Supabase stack:

```bash
npx supabase start
npx supabase db reset
npx supabase test db
```

The SQL tests use pgTAP and verify the profile-owner role and account-state guard. Review the migrations and test results against a disposable project before applying them to a production project. Back up production data and use the Supabase dashboard/SQL editor to confirm the deployed migration version and RLS state.

Public profile data is exposed through restricted directory views; direct access to private profile tables is owner/admin scoped. External consumers that selected public data directly from these base tables must switch to the directory views. Database triggers prevent owners from changing their profile role, active state, or verification state on normalized role-profile tables. The database tests verify these guards, that directory views omit contact fields and exact birth dates, and that minors are not included. A separate pgTAP suite covers shared-state access and the registration RPC authorization, duplicate, and capacity rules.

Some legacy application tables and UI flows still use browser state and lack equivalent normalized authorization rules. In particular, tournament creation, results, achievements, teams, notifications, and public discovery are not yet consistently hydrated from PostgreSQL. Supabase-mode non-admin changes must not be treated as durably persisted unless a dedicated database operation is confirmed. The shared operational document is administrator-only until it is replaced by scoped APIs.

No storage buckets are declared in the checked-in migrations. If buckets are configured in the Supabase dashboard, manually verify each bucket's public setting and `storage.objects` policies; no claim about dashboard-only storage configuration can be made from this repository.

## Current implementation checklist

- [x] Audit the existing React/TanStack Start application, Supabase integration, migration history, CI workflow, and working-tree state.
- [x] Run baseline type-check, unit tests, lint, and production build.
- [x] Restrict the legacy shared operational-state document and add server-enforced registration creation/review checks.
- [x] Add pgTAP authorization tests for those database rules.
- [ ] Apply migrations to a disposable Supabase project and execute the database tests.
- [ ] Replace legacy browser/JSON state with user-scoped relational reads and writes across the core workflows.
- [ ] Verify authentication, storage, deployment, monitoring, backups, and end-to-end flows against configured live infrastructure.

Baseline checks: TypeScript, unit tests, and production build passed. Repository-wide lint failed before implementation with 1,157 errors and 14 warnings; most reported errors are existing formatting violations. Supabase CLI and `psql` are not installed in the current environment, so migrations and pgTAP tests have not been executed here.

## CI and deployment

`.github/workflows/quality.yml` runs `npm ci`, lint, TypeScript checking, Vitest, and a production build on pushes and pull requests. After dependencies install, it runs every check even if an earlier check fails so the CI result reports all current blockers. The build receives explicitly fake Supabase values and does not connect to a real project. It does not publish or deploy.

The checked-in repository does not establish a verified production deployment target or deploy workflow. Before deployment, confirm the platform/build adapter, required server environment variables, Supabase redirect URLs and auth settings, applied migrations, database backups, and any dashboard-configured storage policies. Keep service-role credentials only in the deployment platform's server-side secret store.

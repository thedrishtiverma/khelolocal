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

## Data and service boundaries

- `src/lib/services/store.tsx` is the UI-facing application store and coordinates profile/auth operations, local demo storage, and updates to shared operational data.
- `src/lib/services/db.ts` persists the unauthenticated demo experience in browser `localStorage`; that data is not a production database.
- `src/lib/services/backend-state.ts` loads and saves the legacy application-wide JSON document through `operational_state` and the `save_operational_state` RPC.
- `src/lib/services/tournament-backend.ts` persists tournament, registration, match-result, and performance records to normalized Supabase domain tables.
- `src/integrations/supabase/auth-helpers.ts` maps Supabase profiles and contains profile operations. Supabase RLS, not client-side role checks, is the authorization boundary.

Core relationships include `auth.users` to `profiles` (one-to-one), role-specific profiles to `profiles`, tournament registrations to tournament-domain records, match results to tournaments, and match performances to match results. The legacy JSON state and normalized tournament tables currently coexist; they are not yet a single transactional source of truth.

## Database migrations and authorization tests

Apply migrations in order against a local Supabase stack:

```bash
npx supabase start
npx supabase db reset
npx supabase test db
```

The SQL tests use pgTAP and verify the profile-owner role and account-state guard. Review the migrations and test results against a disposable project before applying them to a production project. Back up production data and use the Supabase dashboard/SQL editor to confirm the deployed migration version and RLS state.

Public profile data is exposed through restricted directory views; direct access to private profile tables is owner/admin scoped. External consumers that selected public data directly from these base tables must switch to the directory views. Database triggers prevent owners from changing their profile role, active state, or verification state on normalized role-profile tables. The database tests verify these guards, that directory views omit contact fields and exact birth dates, and that minors are not included. These protections do not yet cover all legacy application tables: their owner/role write policies still permit some review-state fields to be changed with the rest of a row.

The current policy model also includes authenticated access to the shared operational-state document. In particular, do not treat the JSON document as field- or row-level authorization: authenticated users can read its full payload and invoke its write RPC. Replacing it with user/role-scoped writes and reads requires a separate data/API migration to preserve the existing workflows.

No storage buckets are declared in the checked-in migrations. If buckets are configured in the Supabase dashboard, manually verify each bucket's public setting and `storage.objects` policies; no claim about dashboard-only storage configuration can be made from this repository.

## CI and deployment

`.github/workflows/quality.yml` runs `npm ci`, lint, TypeScript checking, Vitest, and a production build on pushes and pull requests. After dependencies install, it runs every check even if an earlier check fails so the CI result reports all current blockers. The build receives explicitly fake Supabase values and does not connect to a real project. It does not publish or deploy.

The checked-in repository does not establish a verified production deployment target or deploy workflow. Before deployment, confirm the platform/build adapter, required server environment variables, Supabase redirect URLs and auth settings, applied migrations, database backups, and any dashboard-configured storage policies. Keep service-role credentials only in the deployment platform's server-side secret store.

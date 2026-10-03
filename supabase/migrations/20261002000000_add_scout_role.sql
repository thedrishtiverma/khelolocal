-- Kept separate from consumers of the enum: PostgreSQL makes a newly-added
-- enum value available only after this migration transaction commits.
alter type public.app_role add value if not exists 'scout';

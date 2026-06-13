# Supabase StyleOS Alpha Safety Checklist

Use this checklist before running any StyleOS Alpha SQL against the existing ruhang365 Supabase Project.

## Backup and Review

- [ ] Confirm a recent Supabase backup exists.
- [ ] Confirm the SQL has been manually reviewed.
- [ ] Confirm this is the intended ruhang365 Supabase Project.
- [ ] Confirm no migration has been run from this draft without approval.

## Schema Boundary

- [ ] Confirm no existing `public` table will be modified.
- [ ] Confirm `styleos` schema does not exist or can be safely created.
- [ ] Confirm all StyleOS business tables are under `styleos`.
- [ ] Confirm Alpha does not add workspace or team tables.

## RLS and Access

- [ ] Confirm RLS is enabled on every `styleos` table.
- [ ] Confirm `anon` has no broad permissions on StyleOS tables.
- [ ] Confirm public intake will use a server route and `intake_token`.
- [ ] Confirm public report access will use a server route and `share_token`.
- [ ] Confirm public feedback will use a server route and `share_token`.
- [ ] Confirm service role key will not enter frontend code.

## Sensitive Data

- [ ] Confirm there is no raw photo field.
- [ ] Confirm there is no phone field.
- [ ] Confirm there is no email field.
- [ ] Confirm there is no WeChat field.
- [ ] Confirm there is no ID card field.
- [ ] Confirm there is no address field.
- [ ] Confirm CandidateKnowledge only stores abstract feature-solution-outcome mapping.

## Environment Files

- [ ] Confirm `.env.local` is not committed.
- [ ] Confirm database password is not committed.
- [ ] Confirm service role key is not committed.
- [ ] Confirm JWT secrets are not committed.
- [ ] Confirm connection strings are not committed.

## Post-run Verification

- [ ] Confirm `styleos` schema exists.
- [ ] Confirm all expected tables exist.
- [ ] Confirm RLS is enabled on all `styleos` tables.
- [ ] Confirm no existing `public` table changed.
- [ ] Confirm rollback plan is available and reviewed.

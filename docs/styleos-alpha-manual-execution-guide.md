# StyleOS Alpha Manual Execution Guide

This guide is for maintainers executing the StyleOS Alpha SQL draft manually. Do not execute the SQL if you do not understand what each step does.

## Execution Location

Run scripts manually in the Supabase SQL Editor for the existing ruhang365 Supabase Project.

Do not run these scripts against another project.

## Before Execution

- Confirm a current Supabase backup exists.
- Confirm this is not a business peak period.
- Confirm `styleos` schema does not already exist, or review existing objects first.
- Confirm no script modifies existing `public` tables.
- Confirm `.env.local` and service role keys are not committed.
- Confirm service role key will not be used in frontend code.

## Step 1: Run Preflight

Run:

```text
supabase/styleos-alpha-preflight.sql
```

Expected result:

- SQL parses.
- Dependencies resolve.
- Final `rollback` completes.
- No `styleos` schema remains after the script finishes.

After preflight, verify no residue:

```sql
select schema_name
from information_schema.schemata
where schema_name = 'styleos';
```

Expected result: zero rows.

## Step 2: Run Final SQL

Run only if preflight passes:

1. `supabase/styleos-alpha-schema.sql`
2. `supabase/styleos-alpha-indexes.sql`
3. `supabase/styleos-alpha-rls.sql`

Run them in this exact order.

If any step fails, stop. Do not continue.

## Step 3: Run Verification

Run:

```text
supabase/styleos-alpha-verify.sql
```

Success means:

- `styleos` schema exists.
- Six expected tables exist.
- Every `styleos` table has RLS enabled.
- Expected policies exist.
- Expected indexes exist.
- Sensitive field check returns zero rows.
- `intake_token` and `share_token` columns exist.
- `anon` does not have broad table privileges.

## How to Judge Failure

Stop and review if:

- Any SQL step errors.
- Preflight leaves `styleos` schema behind.
- Verification shows missing tables.
- Verification shows RLS disabled.
- Verification shows `anon` privileges on StyleOS tables.
- Verification finds raw photo, phone, WeChat, ID card, address, image, or email fields.
- The project is not the expected ruhang365 project.

## Rollback Guidance

Run rollback only when:

- Alpha apply partially succeeded and must be reverted.
- You have a verified backup.
- You understand the objects rollback will drop.
- No production data depends on the `styleos` schema.

Rollback file:

```text
supabase/styleos-alpha-rollback.sql
```

Do not run rollback blindly in production.

## Operational Notes

- Do not execute during business peak hours.
- Do not paste secrets into SQL Editor.
- Do not expose `styleos` schema to the API before RLS and grants are verified.
- Do not enable public intake/report/feedback by granting `anon` table access.
- Public flows should use server routes with token validation.

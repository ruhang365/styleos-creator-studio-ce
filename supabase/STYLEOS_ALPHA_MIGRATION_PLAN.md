# StyleOS Alpha Migration Plan

This is a draft plan for adding StyleOS Alpha persistence to the existing ruhang365 Supabase Project. Do not execute these files until they have been reviewed.

## 1. Why Reuse ruhang365 Supabase Project

StyleOS Alpha should reuse the existing ruhang365 Supabase Project because ruhang365 already has the shared platform account layer through Supabase Auth. Reusing `auth.users` avoids creating a second account system for early Alpha users.

## 2. Why Create styleos Schema

StyleOS business tables should live in a dedicated `styleos` schema so Alpha data is isolated from existing `public` platform tables. This keeps the migration narrow and avoids changing current ruhang365 production tables.

## 3. What This Migration Creates

- `styleos` schema
- `styleos.set_updated_at()` helper function
- `styleos.services`
- `styleos.fan_cases`
- `styleos.reports`
- `styleos.feedback`
- `styleos.candidate_knowledge`
- `styleos.consent_records`
- indexes for creator, case, report, status, token, and review queries
- RLS policies for authenticated creator-owned access

## 4. What It Does Not Touch

- existing `public` tables
- `public.profiles`
- `auth.users`
- payment tables
- subscription tables
- membership tables
- workspace or team models
- storage buckets
- Edge Functions
- production data

## 5. Backup Checklist Before Running

- Confirm a recent Supabase backup exists.
- Export current schema metadata for reference.
- Confirm `styleos` schema does not exist or is safe to create.
- Confirm no existing production process depends on a `styleos` schema.
- Confirm no raw photo or sensitive identity fields are included.
- Confirm service role keys and database passwords are not committed.
- Confirm `.env.local` is not committed.

## 6. Run Order

Run only after review:

1. `styleos-alpha-schema.sql`
2. `styleos-alpha-indexes.sql`
3. `styleos-alpha-rls.sql`

## 7. Verification SQL

```sql
select schema_name from information_schema.schemata where schema_name = 'styleos';
```

```sql
select table_schema, table_name
from information_schema.tables
where table_schema = 'styleos'
order by table_name;
```

```sql
select schemaname, tablename, rowsecurity
from pg_tables
where schemaname = 'styleos'
order by tablename;
```

## 8. Rollback Plan

Use `styleos-alpha-rollback.sql` only in Alpha or after a reviewed backup. The rollback drops policies, triggers, tables, and helper function in dependency order.

Do not use `drop schema styleos cascade` blindly in production. If rollback fails because the schema is not empty, inspect remaining objects first.

## 9. Known Limitations

- This is a SQL draft, not an executed migration.
- It does not create a workspace or team model.
- Public intake, report, and feedback routes are not opened through direct anon table access.
- Token-based public access should be implemented through server routes.
- `styleos` schema exposure through Supabase Data API must be reviewed before frontend integration.
- Candidate knowledge remains `E0` until reviewed and upgraded.

## 10. Next Step

Connect Creator Studio CE to Supabase after schema, indexes, RLS, grants, server routes, and environment handling are reviewed.

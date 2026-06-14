# StyleOS Alpha SQL Review

This is a static review of the StyleOS Alpha SQL draft. It does not confirm that the SQL has been executed.

## Review Scope

Reviewed files:

- [Schema SQL](../supabase/styleos-alpha-schema.sql)
- [Indexes SQL](../supabase/styleos-alpha-indexes.sql)
- [RLS SQL](../supabase/styleos-alpha-rls.sql)
- [Rollback SQL](../supabase/styleos-alpha-rollback.sql)
- [Migration Plan](../supabase/STYLEOS_ALPHA_MIGRATION_PLAN.md)
- [Preflight SQL](../supabase/styleos-alpha-preflight.sql)
- [Verify SQL](../supabase/styleos-alpha-verify.sql)
- [Final Apply Order](../supabase/styleos-alpha-final-apply-order.md)

## Static Review Checklist

| Check | Result | Notes |
| --- | --- | --- |
| Only adds `styleos` schema | Pass | SQL creates `styleos` schema and objects under that schema only. |
| Does not modify existing `public` tables | Pass | No `alter table public.*`, `drop table public.*`, or `update public.*` appears in the draft. |
| Does not create workspace/team tables | Pass | No workspace, team, organization, or member tables are introduced. |
| References `auth.users` | Pass | Creator-owned tables use `creator_user_id references auth.users(id)`. |
| No raw photo / phone / wechat / id_card / address fields | Pass | The draft avoids those sensitive fields. |
| Public links use token fields | Pass | `intake_token` and `share_token` are present. |
| RLS covers all `styleos` tables | Pass | Six `styleos` tables have RLS enabled. |
| No broad `anon` policies | Pass | No policy is granted to `anon`. |
| Rollback exists | Pass | Rollback draft drops policies, triggers, tables, function, and empty schema. |
| Verification SQL exists | Pass | `styleos-alpha-verify.sql` checks schema, tables, RLS, policies, indexes, sensitive fields, token columns, and grants. |
| Custom schema grants reviewed | Fixed | Initial draft lacked grants. `styleos-alpha-schema.sql` now grants usage/table privileges to `authenticated` and `service_role`, not `anon`. |
| Table privileges reviewed | Fixed | `grant select, insert, update, delete on all tables in schema styleos` added for `authenticated` and `service_role`. |
| Supabase custom schema API exposure noted | Pass | Final apply order and docs require checking Supabase API settings before client access. |

## Grant Review

Supabase custom schemas may require schema exposure in API settings plus Postgres grants before SDK access works. The draft now includes:

```sql
grant usage on schema styleos to authenticated;
grant usage on schema styleos to service_role;
grant select, insert, update, delete on all tables in schema styleos to authenticated;
grant select, insert, update, delete on all tables in schema styleos to service_role;
```

It also adds default table privileges for future tables in `styleos`.

No broad `anon` grants are included. Public intake, report, and feedback should go through server routes and token validation.

## Potential Issues and TODO

- Supabase Dashboard API settings must be reviewed before SDK access to `styleos`.
- If the schema is not exposed to the Data API, server-side SQL or RPC access may still be needed.
- `service_role` can bypass RLS; the key must never be shipped to frontend code.
- Token values need sufficient entropy and lifecycle rules before public routes are enabled.
- `feedback` insert is open only to authenticated creators in the draft. Public feedback should be handled by a server route, not direct `anon` insert.
- `candidate_knowledge` privacy depends on application-layer extraction discipline; SQL cannot fully prevent personal information in free-text fields.
- Final execution should occur outside business peak hours and only after backup confirmation.

## Review Result

The SQL draft is ready for manual maintainer review as a preflight pack. It is not yet a production migration.

# Supabase StyleOS Alpha Schema

StyleOS Alpha uses the existing ruhang365 Supabase Project and shared `auth.users`.

StyleOS business tables are isolated under the `styleos` schema. The Alpha schema does not introduce a workspace model, does not modify existing `public` tables, and does not store raw photos.

中文说明：
StyleOS Alpha 复用现有入行365 Supabase 和统一账号体系，业务数据放在 `styleos` schema，不混入 `public` 现有表。

## Account Model

- StyleOS Alpha directly reuses `auth.users`.
- StyleOS creator-owned records use `creator_user_id`.
- `creator_user_id` references `auth.users(id)`.
- `public.profiles` may remain the ruhang365 unified profile layer, but this draft does not modify it.

## Schema Boundary

The draft creates:

- `styleos.services`
- `styleos.fan_cases`
- `styleos.reports`
- `styleos.feedback`
- `styleos.candidate_knowledge`
- `styleos.consent_records`

The draft does not create:

- workspace tables
- team tables
- payment tables
- subscription tables
- raw photo storage
- public table changes

## Knowledge Boundary

StyleOS core knowledge is not user identity data. The core asset is the abstract mapping:

```text
feature tags -> styling solution -> execution feedback -> rule evidence
```

`styleos.candidate_knowledge` is designed to store abstract feature, recommendation, feedback, evidence, and review fields. It should not store raw photos, phone numbers, WeChat IDs, ID card numbers, or addresses.

## Public Access Boundary

Alpha should not give `anon` direct broad access to:

- `styleos.fan_cases`
- `styleos.reports`
- `styleos.feedback`
- `styleos.candidate_knowledge`

Future public intake, report, and feedback flows should be implemented through server routes that validate token fields such as `intake_token` and `share_token`.

## Draft Files

- [Migration Plan](../supabase/STYLEOS_ALPHA_MIGRATION_PLAN.md)
- [Schema SQL](../supabase/styleos-alpha-schema.sql)
- [Indexes SQL](../supabase/styleos-alpha-indexes.sql)
- [RLS SQL](../supabase/styleos-alpha-rls.sql)
- [Rollback SQL](../supabase/styleos-alpha-rollback.sql)
- [Safety Checklist](supabase-styleos-alpha-safety-checklist.md)

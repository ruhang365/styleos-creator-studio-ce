# Supabase Schema Access Notes

StyleOS Creator Studio CE uses the existing ruhang365 Supabase Project and stores StyleOS Alpha data in the dedicated `styleos` schema.

## Exposed Schema

Supabase Data API access to non-public schemas requires Dashboard configuration.

Confirm that the project API settings expose:

- `public`
- `styleos`

Do not remove existing exposed schemas without a separate migration and rollout plan.

## REST Schema Profile

For non-public schema REST operations, requests may need schema profile headers.

Read requests commonly use:

```text
Accept-Profile: styleos
```

Write or delete requests commonly use:

```text
Content-Profile: styleos
```

The application code should use `supabase.schema("styleos")` or server helpers that target the `styleos` schema.

Operational scripts that use raw REST endpoints must set the schema profile explicitly.

## Cleanup Safety

When cleaning synthetic E2E data:

- use a unique marker
- delete only marker-related rows
- trace related rows through `service_id`, `case_id`, `report_id`, or `source_case_id`
- do not clean `public` tables
- do not clean `auth` users
- do not print keys, tokens, JWTs, database passwords, or connection strings

## Candidate Knowledge Traceability

Candidate Knowledge should be traceable through:

- `source_case_id`
- report association
- feedback association
- synthetic marker when present in source text

The marker is a test traceability aid, not a production modeling field.

## Permissions

Public intake, report, and feedback flows should continue to run through server route handlers and token validation.

Do not grant broad `anon` access to `styleos` tables.

Service role or secret keys must stay server-side only.

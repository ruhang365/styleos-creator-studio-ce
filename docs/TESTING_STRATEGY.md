# Testing Strategy

## Build Tests

Run Supabase Mode build:

```bash
npm run build
```

Run Local Mode build:

```bash
NEXT_PUBLIC_STORAGE_MODE=local npm run build
```

## Smoke Tests

Smoke tests should cover:

- `/api/health`
- `/setup`
- `/login`
- `/dashboard`
- `/services`
- `/cases`
- `/knowledge/candidates`
- public fake-token API responses

## E2E Tests

Use synthetic markers:

```text
STYLEOS_E2E_TEST_<timestamp>
```

E2E must cover:

- service creation
- intake token
- API GET intake
- API POST intake
- API-created case visibility
- tag generation
- rule matching
- Lite Report
- Barber Brief
- report delivery
- API GET shared report
- API POST feedback
- Candidate Knowledge extraction
- cleanup verification

## Auth Session Tests

Confirm:

- magic link sends
- callback succeeds
- session exists on `/setup`
- dashboard recognizes login
- session persists after refresh

Do not output email, user id, JWT, or tokens.

## Consent Tests

Full E2E should create:

- one `service_processing` consent record
- one `anonymized_learning` consent record

Before cleanup, `consent_records` should increase by 2.

## Cleanup Tests

After cleanup:

- marker has no residual rows
- all six `styleos` table counts return to pre-test values
- no `public` tables were touched
- no `auth` users were modified

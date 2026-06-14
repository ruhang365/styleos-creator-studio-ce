# E2E Testing

This document describes the synthetic E2E rules for StyleOS Creator Studio CE.

## Scope

The v0.2.2 E2E flow covers:

1. Creator creates a synthetic hairstyle service.
2. Fan submits synthetic intake through a cloud intake link.
3. Creator reviews the case.
4. Creator generates tags.
5. Creator matches and saves rules.
6. Creator generates a Lite Report.
7. Creator generates a Barber Brief.
8. Creator marks the report as delivered.
9. Fan opens the shared report link.
10. Fan submits feedback.
11. Creator extracts Candidate Knowledge.
12. Maintainer verifies cleanup.

## Synthetic Marker

Every E2E run must use a unique marker:

```text
STYLEOS_E2E_TEST_<timestamp>
```

Use the marker only for testing and cleanup. Do not treat it as a production field design.

Include the marker in synthetic service names, fan aliases, creator notes, report markdown, feedback text, and candidate knowledge summaries when the source text contains it.

## Data Safety

E2E data must be synthetic.

Do not write:

- real names
- raw photos
- phone numbers
- WeChat IDs
- ID card numbers
- addresses
- email addresses
- payment data

Do not modify `public` tables.

Do not modify `auth` users.

Do not output keys, tokens, JWTs, database passwords, or connection strings.

## Candidate Knowledge Traceability

Candidate Knowledge must remain traceable through stable source links:

- `source_case_id`
- associated report
- associated feedback
- synthetic marker when present in source text

Candidate Knowledge should store abstract feature-solution-outcome mapping, not fan identity.

Allowed fields include:

- feature tags
- scenario tags
- constraints
- selected rule ids
- recommendation summary
- execution card summary
- avoid list
- feedback score
- creator feedback summary
- execution status
- reuse potential
- consent status
- anonymization status
- review status
- evidence level

Do not store fan alias as a core knowledge field.

## Consent Records

The E2E flow should create consent records for:

- `service_processing` during intake submission
- `anonymized_learning` during feedback submission

Consent records must not include sensitive personal data.

### API-created fan case visibility

API POST intake creates `styleos.fan_cases` through the public server route. The created fan case must be visible in the Creator UI `/cases` after the authenticated creator refreshes the page.

Creator UI visibility depends on:

- `creator_user_id` inherited from the service
- `service_id` matching the source service
- queries using the `styleos` schema
- Supabase adapter field mapping from snake_case rows to frontend models
- an authenticated creator session matching `creator_user_id`

If API intake succeeds but `/cases` does not show the new case, first inspect the Supabase adapter query and field mapping before changing RLS or database structure.

## Cleanup Rules

Cleanup must delete only data related to the current marker.

Recommended cleanup order:

1. `styleos.candidate_knowledge`
2. `styleos.feedback`
3. `styleos.consent_records`
4. `styleos.reports`
5. `styleos.fan_cases`
6. `styleos.services`

If a row does not contain the marker directly, trace it through `source_case_id`, `case_id`, `report_id`, or `service_id`.

After cleanup, verify:

- the marker no longer exists in StyleOS tables
- related service, case, report, feedback, candidate knowledge, and consent records are removed
- no `public` tables were touched
- no `auth` users were touched

## Build Checks

Run both builds after E2E-related code changes:

```bash
npm run build
NEXT_PUBLIC_STORAGE_MODE=local npm run build
```

Do not run a full write E2E unless the task explicitly asks for it.

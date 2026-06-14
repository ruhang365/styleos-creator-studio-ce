# Post-deployment E2E

This is the hosted version of the Final API-assisted Synthetic E2E test. Use the deployed domain placeholder:

```text
https://your-alpha-domain.vercel.app
```

## Token Handling

Do not record full intake tokens or share tokens. If needed, record only:

```text
first6***last4
```

## Expected Count Changes

Before cleanup, one full synthetic E2E run should change `styleos` table counts by:

- `services` +1
- `fan_cases` +1
- `reports` +1
- `feedback` +1
- `candidate_knowledge` +1
- `consent_records` +2

## Flow

1. Create a unique synthetic marker.
2. Confirm `/api/health`.
3. Log in with an approved Alpha creator account.
4. Create a synthetic service in the creator UI.
5. Run API GET intake.
6. Run API POST intake.
7. Confirm the API-created case appears in `/cases`.
8. Generate tags and rules in the creator UI.
9. Generate and deliver report and Barber Brief in the creator UI.
10. Run API GET shared report.
11. Run API POST feedback.
12. Extract Candidate Knowledge in the creator UI.
13. Verify Candidate Knowledge contains `source_case_id` and the marker.
14. Verify consent records include `service_processing` and `anonymized_learning`.

## Cleanup Order

Delete only rows linked to the current marker or traced through the current service, case, report, feedback, and candidate ids.

1. `styleos.candidate_knowledge`
2. `styleos.feedback`
3. `styleos.consent_records`
4. `styleos.reports`
5. `styleos.fan_cases`
6. `styleos.services`

After cleanup, confirm the marker has no residual rows and table counts return to the pre-test state.

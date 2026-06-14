# Data Cleanup Runbook

## Scope

Use this runbook only for synthetic StyleOS Alpha test data.

Do not delete:

- `public` table data
- `auth` users
- non-test StyleOS rows
- rows without a verified link to the current marker

## Marker Cleanup

Every write test must use a unique marker:

```text
STYLEOS_E2E_TEST_<timestamp>
```

Search by marker first. For rows that do not contain the marker directly, trace by:

- `service_id`
- `case_id`
- `source_case_id`
- `report_id`
- `feedback_id`

## Cleanup Order

1. `styleos.candidate_knowledge`
2. `styleos.feedback`
3. `styleos.consent_records`
4. `styleos.reports`
5. `styleos.fan_cases`
6. `styleos.services`

## Safety Steps

1. Query first.
2. Confirm ids belong to the marker run.
3. Delete only traced rows.
4. Verify marker has no residual rows.
5. Verify table counts return to pre-test counts.
6. Do not output sensitive row content.

## Stop Conditions

Stop if:

- rows cannot be confidently linked to the marker
- deletion would touch `public`
- deletion would touch `auth`
- real personal data may be involved and no approval was given

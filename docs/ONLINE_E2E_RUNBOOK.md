# Online E2E Runbook

Use this runbook for the hosted Alpha domain. Do not use real personal data.

## Marker

Create a unique marker for every run:

```text
STYLEOS_E2E_TEST_<timestamp>
```

Put this marker in the synthetic service name, fan alias, creator notes, report markdown, feedback text, and Candidate Knowledge summary when available.

## Preconditions

- Hosted Alpha is reachable.
- `/api/health` returns safe JSON.
- Creator can log in with an approved internal test account.
- Supabase Mode is configured.
- No real photos or sensitive personal data are used.

## Flow

1. Record pre-test row counts for:
   - `styleos.services`
   - `styleos.fan_cases`
   - `styleos.reports`
   - `styleos.feedback`
   - `styleos.candidate_knowledge`
   - `styleos.consent_records`
2. Create a synthetic hairstyle service in the Creator UI.
3. Confirm the service has an intake token.
4. Run `GET /api/intake/[token]`.
5. Run `POST /api/intake/[token]` with synthetic intake.
6. Confirm one `service_processing` consent record exists.
7. Open `/cases` and confirm the API-created case is visible.
8. Open the case detail page.
9. Generate and save tags.
10. Auto-match rules and save 3-5 selected rules.
11. Generate Lite Report.
12. Generate Barber Brief.
13. Confirm report content includes the marker.
14. Save report.
15. Mark report as delivered.
16. Run `GET /api/reports/[shareToken]`.
17. Run `POST /api/feedback/[shareToken]` with synthetic feedback and anonymized-learning consent.
18. Confirm one `anonymized_learning` consent record exists.
19. Open Candidate Knowledge Queue.
20. Extract Candidate Knowledge.
21. Confirm Candidate Knowledge has `source_case_id`.
22. Confirm Candidate Knowledge keeps the marker in an abstracted summary.

## Expected Count Changes Before Cleanup

- `services`: +1
- `fan_cases`: +1
- `reports`: +1
- `feedback`: +1
- `candidate_knowledge`: +1
- `consent_records`: +2

## Cleanup Order

Delete only rows linked to this marker or traced through this run's service, case, report, feedback, and candidate ids.

1. `styleos.candidate_knowledge`
2. `styleos.feedback`
3. `styleos.consent_records`
4. `styleos.reports`
5. `styleos.fan_cases`
6. `styleos.services`

## Final Verification

After cleanup:

- the marker has no residual rows
- all six table counts return to pre-test values
- no `public` tables were touched
- no `auth` users were modified
- no secret values were printed

## Failure Rule

If any step fails, stop the run. Do not directly write database rows to bypass product logic.

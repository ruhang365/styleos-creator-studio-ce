# Alpha Smoke Test

Run this after a planned hosted Alpha deployment. Use only synthetic test data.

## Marker

Use a unique marker for each run:

```text
STYLEOS_ALPHA_SMOKE_<timestamp>
```

Put the marker in service name, fan alias, creator notes, report content, feedback text, and cleanup notes.

## Steps

1. Open `/api/health`.
2. Confirm the response is JSON and contains no secrets.
3. Open `/setup`.
4. Confirm Supabase Mode and Alpha configuration status.
5. Open `/login`.
6. Send magic link to an approved Alpha test account.
7. Complete login.
8. Confirm `/dashboard` recognizes the creator session.
9. Create a synthetic service.
10. Copy or record the intake token in masked form only.
11. Run API GET intake.
12. Run API POST synthetic intake.
13. Confirm the case enters the creator backend.
14. Generate tags.
15. Match and save rules.
16. Generate Lite Report.
17. Generate Barber Brief.
18. Save and deliver the report.
19. Run API GET shared report.
20. Run API POST feedback.
21. Extract Candidate Knowledge.
22. Verify two consent records exist for the run.
23. Clean up all rows linked to the marker.

## Safety Rules

- Do not upload photos.
- Do not use real personal data.
- Do not include phone numbers, WeChat IDs, ID card numbers, addresses, emails, or payment data.
- Do not touch `public` tables.
- Do not touch `auth` users.
- Clean up after every test run.

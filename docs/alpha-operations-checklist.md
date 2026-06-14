# Alpha Operations Checklist

Use this checklist during a hosted Alpha. It is operational guidance, not an automated monitoring system.

## Daily Checks

- `/api/health` returns expected JSON.
- `/setup` shows Supabase configuration status.
- Supabase `styleos` table counts are within expected range.
- There is no uncleaned synthetic test data.
- There are no visible 500 errors in the app.
- Creator feedback has been reviewed.
- Candidate Knowledge queue has been reviewed.
- Consent records look consistent with case, report, and feedback activity.
- No abnormal authorization data is visible.

## Weekly Checks

- Review tester feedback.
- Review known limitations and update the Alpha plan.
- Confirm no secrets have been pasted into GitHub issues or docs.
- Confirm no `.env.local` file has entered Git.
- Confirm no real personal data appears in public reports or issues.

## Incident Response

If a sensitive data issue appears:

1. Stop sharing the affected test link.
2. Do not copy the sensitive data into chat or issues.
3. Record only a sanitized summary.
4. Remove the data through the approved Supabase administration path.
5. Review whether the Alpha tester needs updated guidance.

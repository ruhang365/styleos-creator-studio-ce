# Incident Response

## General Rule

Pause Alpha testing when an incident affects login, data safety, report delivery, feedback, cleanup, or secret handling.

## Login Broken

1. Check `/api/health`.
2. Check hosted `/login`.
3. Check Supabase Auth redirect URLs.
4. Check Vercel environment variable presence by name only.
5. Do not output emails, tokens, JWTs, or keys.

## Supabase Env Broken

1. Confirm the app shows Supabase configured status.
2. Confirm Vercel env variable names exist.
3. Do not print values.
4. Redeploy only after env configuration is corrected.

## Vercel Deploy Failed

1. Read build error summary.
2. Do not paste secrets from logs.
3. Fix only the blocking issue.
4. Run both build commands locally.
5. Push only after verification.

## Candidate Data Issue

1. Stop Candidate Knowledge extraction.
2. Identify affected synthetic marker or case.
3. Confirm whether consent exists.
4. Remove sensitive data if any was accidentally entered.
5. Record the incident without saving personal data.

## Accidental Real Personal Data

1. Stop testing.
2. Do not copy the personal data into reports.
3. Identify affected rows by id or marker without exposing content.
4. Delete only the affected rows after explicit approval.
5. Verify no public repo, issue, log, or screenshot contains the data.

## Test Data Not Cleaned

1. Identify the synthetic marker.
2. Trace service, case, report, feedback, candidate, and consent ids.
3. Follow [DATA_CLEANUP_RUNBOOK.md](DATA_CLEANUP_RUNBOOK.md).
4. Confirm table counts return to baseline.

## Secret Exposure

1. Stop the workflow.
2. Remove the exposed secret from any local report or screenshot.
3. Rotate the secret in the owning platform.
4. Redeploy if the app depends on the rotated value.

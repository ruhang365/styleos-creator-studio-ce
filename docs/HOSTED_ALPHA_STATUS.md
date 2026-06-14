# Hosted Alpha Status

## Alpha URL

```text
https://styleos-creator-studio-ce.vercel.app
```

## Current Status

- Hosted Alpha deployed: yes
- `/api/health`: expected to return safe JSON
- Supabase configured: yes in hosted Alpha
- Storage mode: Supabase Mode
- Auth: Supabase Magic Link Auth
- Current gate: Hosted Online Synthetic E2E

## Available Pages

- `/setup`
- `/login`
- `/dashboard`
- `/services`
- `/cases`
- `/knowledge/candidates`
- `/api/health`
- `/api/intake/[token]`
- `/api/reports/[shareToken]`
- `/api/feedback/[shareToken]`

## Known Limits

- Only Hairstyle Workflow is supported.
- No payment.
- No AI API.
- No image upload.
- No mini program or native app.
- No team workspace.
- No StyleOS Pro review workflow.
- Candidate Knowledge still requires manual review.
- Real small-B Alpha invitations should wait until Hosted Online Synthetic E2E passes.

## Next Required Action

Run Hosted Online Synthetic E2E with synthetic data only, then verify cleanup and table counts.

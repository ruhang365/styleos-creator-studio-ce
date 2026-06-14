# Security

## Reporting

For security vulnerabilities, use placeholder official channel for now.

Do not report real personal data in public issues.

## Do Not Submit Secrets

Do not submit:

- API keys
- tokens
- cookies
- passwords
- private credentials
- private user data

## Public Issue Safety

Avoid including real user cases in public reports.

Use synthetic examples when describing bugs, workflow gaps, or data issues.

## Data Safety

If a vulnerability involves personal data, describe the risk without including the data itself.

## Alpha Secret Handling

Alpha deployment variables should be configured in the hosting platform environment variable settings.

- Do not commit `.env.local`.
- Do not paste real secrets into Markdown files.
- Do not paste secrets into GitHub issues.
- Do not paste secrets into support screenshots or logs.
- Do not print Supabase keys, service role keys, secret keys, JWTs, database passwords, or connection strings.

## Vercel Env Vars

Public variables may use `NEXT_PUBLIC_` only when they are safe for browser exposure.

Server-only variables such as `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_SECRET_KEY` must not use `NEXT_PUBLIC_`.

## Service Role Boundary

Service role or secret keys are only allowed in server route handlers. They must never enter client components, browser bundles, public logs, or shared screenshots.

## Codex Operation Safety

Codex tasks must follow these rules:

- Do not output secrets.
- Do not commit env files.
- Do not execute SQL unless the user explicitly requests it.
- Do not modify Supabase schema without a reviewed migration plan.
- Do not modify existing ruhang365 `public` tables during CE work.
- Do not modify `auth` schema or auth users unless explicitly requested.
- Use synthetic data for tests.
- Clean up test data by marker after write tests.
- Stop immediately if real personal data appears in a test path.

## Real Personal Information Handling

If real personal information is accidentally entered during Alpha testing:

1. Stop testing.
2. Do not copy the personal data into reports, issues, screenshots, or logs.
3. Identify affected rows without exposing their content.
4. Delete affected rows only after explicit approval.
5. Verify no public repository content contains the data.

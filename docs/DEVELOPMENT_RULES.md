# Development Rules

## Execution Rules

- Do one stage at a time.
- Do not skip gates.
- Confirm the task goal before editing.
- Check git status before changing files.
- Read the target file before editing it.
- Keep changes minimal and scoped.
- Prefer fixing E2E blockers before adding new features.

## Build Rules

Before completing material changes, run:

```bash
npm run build
NEXT_PUBLIC_STORAGE_MODE=local npm run build
```

If a future lint script is added, run it as well.

## Secret Rules

- Do not commit `.env.local`.
- Do not output Supabase keys, service role keys, secret keys, JWTs, database passwords, connection strings, emails, or user ids.
- Do not paste real secrets into docs, issues, screenshots, or logs.

## Database Rules

- Do not execute SQL unless the user explicitly asks for it.
- Database changes require preflight, review, apply order, verification, and rollback plan.
- Do not modify existing ruhang365 `public` tables during StyleOS CE work.
- Do not modify `auth` schema or auth users unless explicitly requested.

## Test Data Rules

- Use synthetic markers for write tests.
- Clean up synthetic rows after E2E.
- Do not use real photos.
- Do not write phone, WeChat, ID card, address, or private identity data.

## Product Scope Rules

- Current scope is Hairstyle Workflow.
- Do not add Color, Outfit, Makeup, payment, AI API, image upload, mini program, native app, workspace, or Pro library before the current gates pass.

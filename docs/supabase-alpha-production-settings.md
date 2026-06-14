# Supabase Alpha Production Settings

The Alpha uses the existing ruhang365 Supabase Project. Do not create a separate Supabase Project for StyleOS Alpha.

## Exposed Schemas

Confirm the Data API exposed schemas include:

- `public`
- `styleos`

Do not remove existing exposed schemas unless the Supabase project owner has reviewed the impact.

## Auth Redirect URLs

Add these Alpha redirect URL placeholders:

```text
https://your-alpha-domain.vercel.app/auth/callback
https://your-alpha-domain.vercel.app/**
```

## Site URL

If the project already has an official ruhang365 Site URL, do not change it casually.

For Alpha, first add Redirect URLs. Only change Site URL after the platform owner confirms it will not break existing ruhang365 flows.

## API Keys

- Browser code may only use the anon key or publishable key.
- Server route handlers may use the service role key or secret key.
- Never expose service role or secret keys to the browser.
- Never paste real keys into docs, GitHub issues, chat, or screenshots.

## RLS

- Keep RLS enabled on all `styleos` tables.
- Do not grant broad `anon` access.
- Creator-owned rows should remain protected by creator identity.
- Public intake, report, and feedback access should continue through token-based server routes.

## Database Boundary

Do not modify existing `public` business tables during Alpha deployment preparation.

Do not execute migrations as part of this preparation pack.

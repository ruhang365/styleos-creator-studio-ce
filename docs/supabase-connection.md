# Supabase Connection

StyleOS Creator Studio CE v0.2.2 can optionally connect to the existing ruhang365 Supabase Project.

## Project Boundary

- StyleOS reuses the existing ruhang365 Supabase Project.
- StyleOS uses the shared `auth.users` account system.
- StyleOS business data lives in the dedicated `styleos` schema.
- StyleOS CE does not use an independent Supabase Project.
- StyleOS CE does not write to `public.profiles`.
- StyleOS CE does not introduce workspace or team tables.

## Environment

Create `.env.local` locally. Do not commit it.

```bash
NEXT_PUBLIC_STORAGE_MODE=supabase
NEXT_PUBLIC_SUPABASE_URL=placeholder
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder
SUPABASE_SERVICE_ROLE_KEY=placeholder
```

`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` can be used instead of `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

`SUPABASE_SECRET_KEY` can be used instead of `SUPABASE_SERVICE_ROLE_KEY`.

Only `NEXT_PUBLIC_` values are allowed in browser code. Service role or secret keys must only be used by server route handlers.

## Custom Schema

The app reads and writes `styleos` through Supabase schema access. Confirm in Supabase Dashboard API settings that the `styleos` schema is exposed if client or route access returns schema visibility errors.

The SQL grants should allow `authenticated` and `service_role` access to `styleos` tables while avoiding broad `anon` permissions.

## Local Fallback

If Supabase Mode is requested but public configuration is incomplete, the app falls back to Local Mode and shows a setup warning.

Use `/setup` to inspect current mode and configuration status without printing secrets.

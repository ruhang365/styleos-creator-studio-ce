# Storage Modes

Creator Studio CE supports two storage modes.

## Local Mode

Local Mode is the default.

- no Supabase configuration required
- stores data in browser localStorage
- keeps the existing v0.2 workflow available
- supports reset from Dashboard
- works for local demos and development
- does not share intake, reports, or feedback across devices

Use:

```bash
NEXT_PUBLIC_STORAGE_MODE=local
```

## Supabase Mode

Supabase Mode is optional.

- uses the existing ruhang365 Supabase Project
- uses shared `auth.users`
- stores StyleOS business data in `styleos`
- supports shareable intake links
- supports shareable report links
- supports cloud feedback submission
- supports creator-owned candidate knowledge storage

Use:

```bash
NEXT_PUBLIC_STORAGE_MODE=supabase
NEXT_PUBLIC_SUPABASE_URL=placeholder
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder
SUPABASE_SERVICE_ROLE_KEY=placeholder
```

## Security Boundary

- no service role key in client code
- no writes to `public.profiles`
- no workspace or team model
- no payment integration
- no AI API integration
- no image upload
- no raw photo storage

If Supabase configuration is incomplete, the app must not crash. It falls back to Local Mode.

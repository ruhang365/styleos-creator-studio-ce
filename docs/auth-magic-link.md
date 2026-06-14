# Magic Link Auth

StyleOS Creator Studio CE uses Supabase email magic links only in optional Supabase Mode. Local Mode does not require Supabase Auth.

## How Magic Link Works In CE

1. The creator opens `/login`.
2. The app calls Supabase `signInWithOtp`.
3. Supabase sends a magic link to an existing internal test account.
4. The link returns to `/auth/callback`.
5. The callback creates a browser Supabase session.
6. The creator returns to `/dashboard`.

CE does not write to `public.profiles` during this flow.

## Required Redirect URLs

The ruhang365 Supabase Project must allow these local redirect URLs:

- `http://localhost:3000/auth/callback`
- `http://localhost:3000/**`

Do not remove existing production redirect URLs when adding local URLs.

## Local Callback URL

The local callback route is:

```text
http://localhost:3000/auth/callback
```

The app sets this as `emailRedirectTo` when sending a magic link.

## Code Flow

Some Supabase magic links return with a `code` search parameter. The callback must call `exchangeCodeForSession(code)` so Supabase can create and persist a browser session.

## Hash Token Flow

Some auth flows return with tokens in the URL hash. The callback also handles this by calling `setSession` with the returned access and refresh tokens. Tokens must never be displayed, logged, copied into docs, or sent to chat.

## Existing Internal Test Accounts

CE sets `shouldCreateUser: false` when sending a magic link. This prevents accidental creation of new Supabase Auth users during internal testing. Use only an existing ruhang365 internal test account.

## Troubleshooting

Callback returns 200 but no session:
Check that `/auth/callback` exchanges the `code` or hash tokens and that the link is opened in the same browser that requested it.

Redirect URL mismatch:
Confirm the local callback URL is listed in Supabase Auth URL Configuration.

Expired magic link:
Request a new magic link. Magic links are one-time use and expire.

Missing code or hash:
The callback cannot create a session without auth callback parameters unless a session already exists.

Supabase not configured:
Confirm `.env.local` has storage mode, project URL, and a public anon or publishable key. Do not commit `.env.local`.

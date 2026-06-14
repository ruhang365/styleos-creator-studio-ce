# Vercel Deployment Guide

This guide prepares a planned Alpha deployment. Do not treat it as proof that an Alpha deployment already exists.

## Steps

1. Log in to Vercel.
2. Import GitHub repository: `ruhang365/styleos-creator-studio-ce`.
3. Select framework: Next.js.
4. Set build command:

```bash
npm run build
```

5. Keep output settings as the default Next.js output.
6. Configure Environment Variables using [.env.alpha.example](../.env.alpha.example).
7. Do not upload or paste `.env.local` into Vercel.
8. Deploy for the first time and obtain the Vercel domain placeholder:

```text
https://your-alpha-domain.vercel.app
```

9. Add the Vercel domain to Supabase Auth Redirect URLs:

```text
https://your-alpha-domain.vercel.app/auth/callback
https://your-alpha-domain.vercel.app/**
```

10. Redeploy after Auth URL settings are updated.
11. Visit:

```text
https://your-alpha-domain.vercel.app/api/health
```

12. Visit:

```text
https://your-alpha-domain.vercel.app/setup
```

13. Run the [Alpha Smoke Test](alpha-smoke-test.md).

## Environment Variable Safety

- Public browser variables may use `NEXT_PUBLIC_`.
- Server secrets must not use `NEXT_PUBLIC_`.
- Service role or secret keys must remain server-only.
- Do not paste secrets into GitHub issues, screenshots, logs, or public chat.

## Deployment Boundary

Do not connect payment, AI APIs, photo upload, mini program infrastructure, or native apps during this Alpha preparation step.

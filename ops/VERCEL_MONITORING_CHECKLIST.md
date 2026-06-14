# Vercel Monitoring Checklist

## Deployment

- [ ] Production deployment is ready.
- [ ] Production branch is `main`.
- [ ] Build command is `npm run build`.
- [ ] Install command is `npm install`.
- [ ] Framework is Next.js.

## Runtime

- [ ] Alpha URL opens.
- [ ] `/api/health` returns JSON.
- [ ] `/setup` opens.
- [ ] `/login` opens.
- [ ] `/dashboard` does not 500.
- [ ] `/services` does not 500.
- [ ] `/cases` does not 500.
- [ ] `/knowledge/candidates` does not 500.

## Environment

- [ ] `NEXT_PUBLIC_STORAGE_MODE` is configured.
- [ ] Supabase public config is configured.
- [ ] Supabase server secret is configured.
- [ ] `NEXT_PUBLIC_ALPHA_MODE` is configured.
- [ ] `NEXT_PUBLIC_APP_URL` is configured.
- [ ] No env values are printed in reports.

## Logs

- [ ] Review build logs for errors.
- [ ] Review runtime logs for 500s.
- [ ] Do not paste secrets from logs.

## Redeploy Process

1. Fix only the blocking issue.
2. Run both build commands locally.
3. Commit and push.
4. Wait for Vercel deployment.
5. Recheck `/api/health` and key pages.

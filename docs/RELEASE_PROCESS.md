# Release Process

## Standard Flow

1. Confirm working tree is clean.
2. Confirm scope and release note.
3. Run Supabase Mode build:

   ```bash
   npm run build
   ```

4. Run Local Mode build:

   ```bash
   NEXT_PUBLIC_STORAGE_MODE=local npm run build
   ```

5. Update `CHANGELOG.md`.
6. Commit changes.
7. Push `main`.
8. Let Vercel deploy from `main`.
9. Check `/api/health`.
10. Run hosted smoke test.
11. Run Hosted Online Synthetic E2E when the release changes workflow behavior.
12. Confirm cleanup.
13. Notify Alpha testers only when the release is safe for the current test stage.

## Release Notes

Release notes should include:

- what changed
- what was verified
- what remains limited
- any data safety notes
- whether Alpha users should retest

## Stop Conditions

Stop the release if:

- build fails
- Local Mode fails
- hosted health check fails
- magic link login fails
- Online E2E cannot clean up data
- secrets appear in logs or docs

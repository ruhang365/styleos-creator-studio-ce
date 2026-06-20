# Codex Continuation Guide

## Current Priority

The next priority is guided 1-3 account Alpha testing preparation. Alpha UI polish, v0 UI integration, local build verification, hosted synthetic E2E, and cleanup verification have passed. Do not start new modules before guided Alpha feedback is reviewed.

## Required Startup Checks

Run:

```bash
pwd
git status --short --branch
git log --oneline -5 --decorate
```

Read the relevant docs before editing:

- [PROJECT_HANDOFF.md](PROJECT_HANDOFF.md)
- [CURRENT_STATUS.md](CURRENT_STATUS.md)
- [ONLINE_E2E_RUNBOOK.md](ONLINE_E2E_RUNBOOK.md)
- [DEVELOPMENT_RULES.md](DEVELOPMENT_RULES.md)

## Forbidden Unless Explicitly Requested

- executing SQL
- modifying Supabase schema
- modifying existing `public` tables
- modifying `auth` schema or users
- outputting secrets
- committing `.env.local`
- uploading photos
- adding payment
- adding AI API
- adding Color, Outfit, or Makeup modules

## Typical Next Instructions

- Prepare guided Alpha tester onboarding and feedback capture.
- Fix a P0 Alpha blocker.
- Improve report editor usability.
- Improve Barber Brief clarity.
- Prepare Alpha feedback pack.

## How To Decide If The Next Stage Is Allowed

Move from Hosted Alpha readiness to small-B Alpha only if:

- hosted E2E passes
- cleanup is verified
- login is stable
- no secrets are exposed
- Alpha onboarding and feedback process are ready
- guided testers agree to synthetic-data-first usage

## How To Run E2E

Use [ONLINE_E2E_RUNBOOK.md](ONLINE_E2E_RUNBOOK.md). Always use a unique synthetic marker and never output full tokens.

## How To Clean Test Data

Use marker-based cleanup and delete in this order:

1. `styleos.candidate_knowledge`
2. `styleos.feedback`
3. `styleos.consent_records`
4. `styleos.reports`
5. `styleos.fan_cases`
6. `styleos.services`

Verify all six table counts return to pre-test values.

## How To Protect Secrets

- Read env variable names only unless the task explicitly requires writing them to a hosting platform.
- Never print values.
- Never paste keys into docs.
- Never include tokens, JWTs, emails, user ids, passwords, or connection strings in reports.

## How To Update Docs

When scope changes, update:

- `README.md`
- `ROADMAP.md`
- `CHANGELOG.md`
- this guide
- affected runbooks or status docs

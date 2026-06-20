# Project Handoff

## What This Project Is

StyleOS Creator Studio CE is the open-source community edition of the StyleOS creator workspace. It helps small-B creators in styling, outfit, image consulting, hairstyle, beauty, and makeup workflows standardize consultation, generate deliverables, collect feedback, and build Candidate Knowledge.

The current product is a Web SaaS-style Alpha running as a Next.js application. It supports Local Mode and optional Supabase Mode.

## What Is Complete

- Next.js App Router web app skeleton
- Local Mode using browser localStorage
- Supabase Mode using the existing ruhang365 Supabase Project
- Magic Link Auth through shared `auth.users`
- dedicated `styleos` schema
- service creation
- fan intake
- case management
- tag generation
- rule matching
- Lite Report generation
- Barber Brief generation
- shared report route
- feedback route
- Candidate Knowledge Queue
- consent_records
- Vercel Hosted Alpha
- Alpha UI polish and v0 UI integration
- hosted smoke test
- local API-assisted synthetic E2E
- hosted API-assisted synthetic E2E
- post-UI hosted synthetic E2E
- hosted E2E cleanup verification

## What Must Not Be Done Yet

- Do not invite broad real small-B Alpha creators before guided internal testing produces usable feedback.
- Do not upload real photos.
- Do not collect phone, WeChat, ID card, address, or private identity data.
- Do not add payment.
- Do not add AI APIs.
- Do not expand to Color, Outfit, or Makeup before the current Alpha gate is complete.
- Do not modify Supabase schema or public ruhang365 tables without an explicit migration task.
- Do not treat Candidate Knowledge as Pro content before consent, anonymization, and review.

## Repository Relationship

- `ruhang365/styleos-protocol`: open standard library, rule cards, schemas, starter knowledge, and GitHub community surface.
- `ruhang365/styleos-creator-studio-ce`: runnable community edition product and Alpha workspace.

The protocol repo defines the open standard. This CE repo turns that standard into a workflow product.

## Product Layer Relationship

- StyleOS Protocol: open standard and public knowledge foundation.
- Creator Studio CE: open-source community edition product.
- StyleOS Cloud: future official hosted product.
- StyleOS Pro: future closed advanced knowledge, expert model, and verified case library.

## Hosted Alpha

Alpha URL:

```text
https://styleos-creator-studio-ce.vercel.app
```

Hosted Alpha is deployed. Alpha UI polish and v0 UI integration are complete. Hosted Online Synthetic E2E has passed after UI integration, and cleanup has been verified. The next gate is guided creator testing with synthetic data first.

## Current Database Structure

StyleOS reuses the existing ruhang365 Supabase Project. Creator login uses shared `auth.users`. StyleOS business data is isolated in the `styleos` schema:

- `styleos.services`
- `styleos.fan_cases`
- `styleos.reports`
- `styleos.feedback`
- `styleos.candidate_knowledge`
- `styleos.consent_records`

The current Alpha does not introduce workspace or team tables and does not modify existing `public` business tables.

## Current Test Status

- Local API-assisted synthetic E2E: passed.
- Hosted Alpha smoke test: passed.
- Hosted Alpha Online Synthetic E2E: passed.
- Post-UI Hosted Alpha Online Synthetic E2E: passed.
- Final cleanup after local and hosted E2E: verified.

## Next Priorities

1. Prepare 1-3 guided Alpha testers with synthetic-data-first instructions.
2. Collect Alpha feedback.
3. Fix P0 workflow issues before building new modules.
4. Improve report editor usability and Barber Brief clarity.
5. Decide whether Candidate Knowledge review needs a dedicated guided UI step.

## Codex Development Principles

- Start each task with git and repo-state checks.
- Do one stage at a time.
- Prefer docs and verification before new features.
- Do not output secrets.
- Do not commit `.env.local`.
- Do not execute SQL unless explicitly requested.
- Use synthetic data for tests.
- Clean up test data after each write test.
- Keep Local Mode and Supabase Mode both buildable.

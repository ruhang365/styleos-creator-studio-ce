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
- hosted smoke test
- local API-assisted synthetic E2E

## What Must Not Be Done Yet

- Do not invite real small-B Alpha creators before Hosted Online Synthetic E2E passes.
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

Hosted Alpha is deployed. Online synthetic E2E is the next required gate before inviting Alpha creators.

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
- Hosted Alpha Online Synthetic E2E: not yet completed.
- Final cleanup after local E2E: verified.

## Next Priorities

1. Run Hosted Online Synthetic E2E.
2. Verify test data cleanup on the hosted Alpha.
3. Prepare 3-5 small-B Alpha testers with synthetic-data-only instructions.
4. Collect Alpha feedback.
5. Fix P0 workflow issues before building new modules.

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

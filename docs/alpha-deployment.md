# Alpha Deployment

v0.2.3 prepares StyleOS Creator Studio CE for a hosted Alpha deployment. This document describes the deployment target and boundaries. It does not mean the Alpha has already been deployed.

## Deployment Goal

The hosted Alpha should validate whether small-B creators can use the Hairstyle Workflow to turn fan consultation into a structured service, Lite Report, Barber Brief, feedback loop, and Candidate Knowledge item.

The Alpha is intended for 3-5 invited small-B testers only.

## Why Web SaaS Alpha

A web Alpha is the fastest way to test the workflow across creator devices without building app-store, mini-program, or mobile-app infrastructure.

Web deployment also keeps the current Next.js app, Supabase Auth, token routes, and `styleos` schema in one reviewable path.

## Why Not Mini Program Or App

The current goal is workflow validation, not channel distribution. A mini program or native app would add review, platform, and release overhead before the core workflow is stable.

The Alpha should stay web-first until the service flow, consent flow, report flow, and Candidate Knowledge review flow are stable enough for broader product decisions.

## Deployment Prerequisites

- GitHub repository: `ruhang365/styleos-creator-studio-ce`
- Build command: `npm run build`
- Hosted storage mode: `NEXT_PUBLIC_STORAGE_MODE=supabase`
- Existing ruhang365 Supabase Project
- `styleos` schema already created and verified
- Supabase Auth magic link configured for the Alpha domain
- Environment variables configured from [Alpha Env Vars](alpha-env-vars.md)
- Pre-launch smoke test plan from [Alpha Smoke Test](alpha-smoke-test.md)

## Recommended Platform

Use Vercel for the Alpha deployment because the project is a Next.js App Router app and does not need custom infrastructure for this phase.

Deployment instructions are in [Vercel Deployment Guide](vercel-deployment-guide.md).

## Supabase Scope

The Alpha reuses the existing ruhang365 Supabase Project.

- Do not create a separate Supabase Project.
- Store StyleOS data in the dedicated `styleos` schema.
- Do not modify existing `public` business tables.
- Keep using shared `auth.users`.
- Keep public intake, report, and feedback flows behind token-based server routes.

Production settings are listed in [Supabase Alpha Production Settings](supabase-alpha-production-settings.md).

## Alpha Product Boundaries

The Alpha does not include:

- public registration
- payment
- AI API integration
- photo upload
- mini program
- native app
- team workspace
- formal StyleOS Pro library
- expert certification
- production-grade SLA

## Data Boundary

Alpha testers should use synthetic or low-risk test data. They must not upload real sensitive personal data, photos, phone numbers, WeChat IDs, ID card numbers, addresses, emails, payment data, or private conversations.

Candidate Knowledge should only store abstract feature-solution-outcome mappings after consent.

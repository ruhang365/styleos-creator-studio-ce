# Product Requirements Document

## Product

StyleOS Creator Studio CE is the open-source community edition workspace for small-B styling creators. It helps hairstyle, outfit, image consulting, beauty, and styling creators turn fan consultation into structured intake, tag-based analysis, rule matching, Lite Reports, Barber Briefs, feedback, and reusable Candidate Knowledge.

This is not a consumer color-test app. It is a creator operations tool for standardizing service delivery and learning from execution outcomes.

## Stage

Current stage: Hosted Alpha readiness.

The hosted Alpha is deployed at:

```text
https://styleos-creator-studio-ce.vercel.app
```

The next gate is Hosted Online Synthetic E2E. Real small-B Alpha invitations should wait until that gate passes and test data cleanup is verified.

## Target Users

- Hairstyle bloggers
- Outfit and styling bloggers
- Image consultants
- Beauty creators
- Photography, makeup, and styling studios

Alpha users should first test with synthetic data. They should not use the Alpha to serve real clients until the project owner explicitly approves that stage.

## Problem

Creators often handle consultation through unstructured chat, repeated manual replies, unclear service menus, inconsistent report formats, and limited feedback capture. Their expertise is hard to reuse because cases do not become structured evidence.

StyleOS turns this into a repeatable workflow:

```text
Fan intake -> feature tags -> rule matching -> report -> execution feedback -> candidate knowledge
```

## Current Scope

The current product supports only the Hairstyle Workflow:

- creator magic link login
- service menu
- tokenized fan intake
- case management
- tag generation
- hairstyle rule matching
- Lite Report generation
- Barber Brief generation
- shared report link
- feedback collection
- Candidate Knowledge Queue
- consent_records for processing and anonymized learning

## Non-goals

The current Alpha does not include:

- payment
- AI API integration
- raw photo upload
- color, outfit, makeup, or other modules
- mini program
- native app
- team workspace
- StyleOS Pro library
- expert certification
- public self-serve creator registration

## Core Data Principle

Personal identity data is not the durable asset. The durable asset is:

```text
Feature Tags -> Styling Recommendation -> Execution Feedback -> Rule Evidence
```

Candidate Knowledge must store abstract feature-solution-outcome mapping. It must not store raw photos, phone numbers, WeChat IDs, ID card numbers, addresses, or private identity details.

## Functional Requirements

1. Creator can log in through Supabase magic link.
2. Creator can create an active hairstyle service.
3. Service can generate a high-entropy intake token.
4. Fan can submit synthetic intake through the public API route without login.
5. API-created cases are visible in Creator UI.
6. Creator can generate and save tags.
7. Creator can auto-match and save hairstyle rules.
8. Creator can generate Lite Report and Barber Brief.
9. Creator can mark a report as delivered and share it by token.
10. Fan can submit feedback through the public feedback API route.
11. Feedback consent can create anonymized-learning consent records.
12. Creator can extract Candidate Knowledge after feedback.
13. Candidate Knowledge keeps `source_case_id` and abstracted marker evidence for synthetic E2E.
14. Test data can be cleaned precisely by marker and traced ids.

## Non-functional Requirements

- `npm run build` must pass.
- `NEXT_PUBLIC_STORAGE_MODE=local npm run build` must pass.
- Local Mode must keep working without Supabase.
- Supabase Mode must not crash when unauthenticated.
- Server secrets must stay server-only.
- `.env.local` must stay ignored.
- Online Alpha must expose no secrets through pages, logs, health checks, or API errors.

## Alpha Acceptance Criteria

Alpha is ready for 3-5 small-B testers only after:

- Hosted Online Synthetic E2E passes.
- Test data cleanup is verified.
- `/api/health` returns safe JSON.
- Magic link login works on the hosted domain.
- Public token routes return clear responses.
- `styleos` table counts return to pre-test values after cleanup.
- Alpha onboarding and feedback operations are ready.

## Next Version Direction

The next product step is not a new module. The next step is Hosted Online E2E, then 3-5 small-B Alpha onboarding, then Hairstyle Workflow refinement based on evidence.

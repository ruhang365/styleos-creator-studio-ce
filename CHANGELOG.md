# Changelog

All notable changes to StyleOS Creator Studio CE will be documented in this file.

## Unreleased - Alpha UI Polish and Hosted E2E Sync

- Expanded the PRD into a full product requirements document.
- Added target users, product goals, user journeys, page requirements, data boundaries, Alpha acceptance criteria, risks, metrics, and release plan.
- Added Vercel v0 UI brief and prompt pack.
- Clarified that v0 should only generate UI and must not change auth, storage, API routes, Supabase schema, or privacy rules.
- Integrated the selected v0 UI polish into the Alpha workflow.
- Verified local and hosted E2E after UI integration.
- Verified hosted synthetic test cleanup returned all six `styleos` tables to baseline.
- Updated Alpha status docs for guided tester onboarding as the next gate.
- Added the Alpha testing pack and expanded invite, task, feedback, and daily checklist materials for guided testers.

## v0.2.4 - Project Handoff & Alpha Readiness Pack

- Added handoff docs.
- Added PRD.
- Added alpha readiness checklist.
- Added online E2E runbook.
- Added operations runbooks.
- Added alpha onboarding materials.
- Added backlog and release milestones.
- Added Codex continuation guide.

## v0.2.3 - Alpha Deployment Preparation Pack

- Added Alpha deployment docs.
- Added Vercel deployment guide.
- Added Alpha env vars guide.
- Added health check route.
- Added Alpha smoke test.
- Added Alpha access policy.
- Added creator onboarding materials.
- Added Alpha invitation and feedback templates.

## v0.2.2-case-visibility-fix - API-created Case Visibility

- Fixed Supabase fan case visibility in Creator UI.
- Ensured API-created fan cases use creator_user_id from service.
- Aligned Supabase adapter field mapping.
- Added loading guards for case list and case detail pages.
- Added regression guidance for API-created fan cases.

## v0.2.2-e2e-fix - E2E Traceability and Consent Fixes

- Improved Candidate Knowledge source traceability.
- Preserved synthetic E2E marker in abstracted summaries when present.
- Added consent_records creation for intake and feedback.
- Added independent Generate Barber Brief action.
- Improved intake enum options.
- Added E2E testing and schema access notes.

## v0.2.2-auth-fix - Magic Link Callback Fix

- Fixed magic link callback handling.
- Added code flow session exchange.
- Added hash token fallback.
- Added auth diagnostics.
- Added magic link auth docs.

## v0.2.2 - Supabase Connection & Shareable Workflow

- Added Supabase optional mode.
- Added storage adapter abstraction.
- Added auth helpers.
- Added shareable intake route.
- Added shareable report route.
- Added cloud feedback route.
- Added setup page.
- Added storage mode docs.
- Added candidate knowledge cloud support.

## v0.2.1-preflight - StyleOS Alpha Supabase Preflight Pack

- Added preflight SQL.
- Added verification SQL.
- Added final apply order.
- Added manual execution guide.
- Added SQL review.
- Added risk register.
- Added grant / custom schema review notes.

## v0.2.1 - StyleOS Alpha Supabase Schema Draft

- Added styleos schema SQL draft.
- Added RLS draft.
- Added indexes draft.
- Added rollback draft.
- Added migration plan.
- Added safety checklist.
- Clarified reuse of existing ruhang365 Supabase Project.

## v0.2.0 - Web App Skeleton

- Added Next.js app skeleton.
- Added local creator dashboard.
- Added service menu.
- Added fan intake workflow.
- Added case management.
- Added tag workbench.
- Added hairstyle rule matching.
- Added lite report generator.
- Added barber brief generator.
- Added feedback workflow.
- Added candidate knowledge queue.

## v0.1.0 - Product Definition

- Initialized product documentation.
- Added architecture docs.
- Added MVP scope.
- Added data model.
- Added open-core boundary.
- Added knowledge flow.
- Added specs and synthetic examples.

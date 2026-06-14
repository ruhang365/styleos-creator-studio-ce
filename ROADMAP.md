# Roadmap

## v0.1 - Product Definition

- Initialize product documentation.
- Define product scope and open-core boundary.
- Define architecture, MVP, data model, knowledge flow, privacy policy, specs, and synthetic examples.

## v0.2 - Web App Skeleton (current / completed)

- Added local-first Next.js App Router skeleton.
- Added local creator dashboard and service menu.
- Added fan intake, case management, tag workbench, rule matching, report, feedback, and candidate queue flows.
- Kept all persistence in browser localStorage.

## v0.2.1 - StyleOS Alpha Supabase Schema Draft

- Prepare draft SQL for a dedicated `styleos` schema in the existing ruhang365 Supabase Project.
- Reuse `auth.users` through `creator_user_id`.
- Add draft tables, indexes, RLS policies, rollback, migration plan, and safety checklist.
- Do not execute SQL until manual review is complete.

## v0.2.1-preflight - Supabase SQL Preflight Pack

- Add preflight SQL wrapped in `begin` / `rollback`.
- Add post-apply verification SQL.
- Add final apply order, manual execution guide, SQL review, and risk register.
- Review custom schema grants and Supabase API exposure requirements.

## v0.2.2 - Execute StyleOS Alpha Schema

- Execute reviewed SQL manually in the existing ruhang365 Supabase Project.
- Verify `styleos` schema, tables, RLS, policies, indexes, grants, and sensitive-field checks.
- Stop on any preflight or verification failure.

## v0.2.3 - Connect Creator Studio CE to Supabase

- Connect Creator Studio CE to Supabase after schema review.
- Add server routes for token-based public intake, report, and feedback flows.
- Keep service role keys out of frontend code.
- Preserve local-first development mode.

## v0.3 - Hairstyle Workflow MVP Refinement (next)

- Refine Hairstyle Workflow usability.
- Improve rule matching transparency.
- Improve report editing ergonomics.
- Add stronger validation for consent, anonymization, and candidate extraction.

## v0.4 - Report Generator

- Implement lite report draft flow.
- Implement creator manual edit flow.
- Implement barber brief generator.

## v0.5 - Candidate Knowledge Queue

- Implement candidate extraction.
- Implement anonymization and consent status.
- Implement maintainer review states.

## v0.6 - Alpha Cloud Deployment

- Prepare limited hosted deployment path.
- Add operational documentation.
- Keep Cloud features separate from CE scope.

## v1.0 - Creator Studio CE Stable

- Stabilize core workflows.
- Stabilize self-host path.
- Stabilize privacy guardrails.
- Publish CE compatibility guidance.

# Product Requirements Document

## 1. Product Summary

StyleOS Creator Studio CE is the open-source community edition workflow tool for small-B styling creators. It helps creators turn styling expertise into structured services, repeatable delivery, feedback capture, and reusable Candidate Knowledge.

This is not a consumer quiz, color-test toy, one-off report generator, or internal admin backend. It is a practical consultation tool that a creator can use while serving a client.

The Alpha UI must be Chinese-first for China-based users. English can appear as secondary product terminology where useful, but the default operating interface should be Simplified Chinese.

Current hosted Alpha:

```text
https://styleos-creator-studio-ce.vercel.app
```

Current stage: Hosted Alpha, invite-only, Hairstyle Workflow only.

## 2. Product Context

Many hairstyle, image, beauty, and styling creators already answer fan questions through chat, social media comments, and ad hoc private consultations. The workflow is usually manual:

- unclear service menu
- unstructured fan intake
- repeated one-off advice
- inconsistent report format
- no structured feedback loop
- no durable way to turn repeated cases into reusable knowledge

StyleOS Creator Studio CE converts this into a repeatable workflow:

```text
Service -> Intake -> Case -> Tags -> Rules -> Report -> Feedback -> Candidate Knowledge
```

The product does not try to replace creator judgment. It gives creators an operating system for collecting signals, applying structured rules, producing deliverables, and learning from outcomes.

## 3. Product Goals

### 3.1 Alpha Goals

The Alpha version must prove that an invited creator can complete a full hairstyle service workflow online:

1. Log in through magic link.
2. Create or review a hairstyle service.
3. Share an intake link.
4. Receive a fan intake submission.
5. Review a case.
6. Generate and adjust tags.
7. Match hairstyle rules.
8. Generate a Lite Report and Barber Brief.
9. Deliver a shared report link.
10. Receive feedback.
11. Extract Candidate Knowledge only when consent allows reuse.

### 3.2 Business Goals

- Validate whether small-B styling creators understand the service workflow.
- Validate whether creators can use reports and barber briefs as practical deliverables.
- Validate whether feedback can become useful Candidate Knowledge.
- Validate whether invite-only hosted Alpha is enough for early testing before building StyleOS Cloud.

### 3.3 Product Quality Goals

- The first screen must feel like a usable product, not documentation.
- The first screen must feel like a consultation tool, not an admin dashboard.
- User-facing UI must be Chinese-first, with optional English support only as a secondary layer.
- Each core page must tell the creator what to do next.
- Empty states must be actionable.
- Public fan links must be simple and safe.
- No page should expose technical implementation details to Alpha users.

## 4. Target Users

### 4.1 Primary User

Small-B styling creators who already provide advice or paid consultation around:

- hairstyle suitability
- personal image
- outfit direction
- beauty or makeup planning
- photo-shoot styling
- workplace or social image improvement

Alpha priority: creators who can test the Hairstyle Workflow with synthetic or low-risk data.

### 4.2 Secondary User

Fans or clients who receive a creator's intake link or report link.

They do not need accounts. They only need to:

- open an intake link
- submit structured intake
- open a shared report link
- submit feedback with explicit consent choice

### 4.3 Maintainer / Operator

The project owner or maintainer who:

- manages allowlisted Alpha accounts
- monitors health checks
- reviews E2E results
- verifies cleanup
- decides when to expand access

## 5. User Problems

## 5.1 Creator Problems

| Problem | Current pain | Desired product response |
| --- | --- | --- |
| Service is unclear | Fans ask open-ended questions repeatedly | Creator defines a service menu item |
| Intake is messy | Context is scattered in chat | Fan submits structured intake |
| Advice is inconsistent | Each response starts from scratch | Tags and rule cards create repeatable reasoning |
| Delivery is hard | Creator manually writes long replies | Lite Report and Barber Brief provide deliverable formats |
| Feedback is lost | Creator rarely learns what worked | Feedback route captures outcome signals |
| Knowledge is not reusable | Good cases remain buried | Candidate Knowledge abstracts reusable patterns |

## 5.2 Fan Problems

| Problem | Current pain | Desired product response |
| --- | --- | --- |
| Hard to explain needs | Fans do not know what context matters | Intake form guides useful inputs |
| Advice is not actionable | Fans receive vague suggestions | Report and barber brief translate advice into action |
| No safe feedback channel | Fans have no structured follow-up | Feedback link captures what worked |

## 6. Product Principles

1. Creator judgment stays central.
2. The app should guide workflow, not pretend to be a fully autonomous stylist.
3. Personal identity data is not the core asset.
4. Candidate Knowledge must be abstracted, consent-aware, and reviewable.
5. Alpha must be invite-only before real small-B usage.
6. Local Mode and Supabase Mode must both remain usable.
7. The first module stays Hairstyle until Alpha feedback proves the workflow.

## 7. Current Scope

### 7.1 In Scope

- Invite-only hosted Alpha
- Supabase Mode
- Local Mode fallback
- Supabase magic link login
- Hairstyle service menu
- Tokenized public fan intake
- Creator case list and case detail
- Tag generation and save flow
- Rule matching and selected rules
- Lite Report generation
- Barber Brief generation
- Shared report route
- Feedback route
- Consent records
- Candidate Knowledge Queue
- Synthetic E2E write and cleanup
- Health check route

### 7.2 Out of Scope

- payment
- AI API integration
- raw photo upload
- real photo storage
- color module
- outfit module
- makeup module
- mini program
- native mobile app
- team workspace
- workspace billing
- public self-serve signup
- StyleOS Pro advanced library
- certification
- real client production usage

## 8. Current Release State

Hosted Alpha has passed:

- local synthetic E2E
- hosted smoke test
- invite-only allowlist configuration
- hosted magic link login check
- hosted API-assisted synthetic E2E
- post-UI hosted synthetic E2E
- cleanup verification

Current database baseline after cleanup:

- `styleos.services`: 0
- `styleos.fan_cases`: 0
- `styleos.reports`: 0
- `styleos.feedback`: 0
- `styleos.candidate_knowledge`: 0
- `styleos.consent_records`: 0

The next product step is guided Alpha onboarding and feedback review, not a new module.

## 9. Core User Journeys

### 9.1 Creator Setup Journey

1. Creator opens hosted Alpha URL.
2. Creator lands on Login.
3. Creator enters allowlisted email.
4. Creator clicks magic link.
5. Creator returns to the hairstyle consultation workbench.
6. Creator sees storage mode and product readiness through Setup or the workbench.

Acceptance:

- Non-allowlisted users cannot receive access.
- The login page explains invite-only status without exposing implementation details.
- The workbench does not feel like a blank developer page or generic admin dashboard.

### 9.2 Service Creation Journey

1. Creator opens Services.
2. Creator creates a hairstyle service.
3. System generates an intake token.
4. Creator sees a same-origin cloud intake link.
5. Creator can copy the intake link.

Acceptance:

- Service creation should be understandable without reading documentation.
- The service detail page must show the next action: share intake link.
- Link UI must support manual copy and same-tab open.

### 9.3 Fan Intake Journey

1. Fan opens tokenized intake link.
2. Fan sees service information.
3. Fan fills structured intake.
4. Fan confirms service processing consent.
5. Fan submits intake.
6. Fan sees a clear success state.

Acceptance:

- Fan does not need login.
- Intake does not request raw photo, phone, WeChat, ID card, address, or email.
- API-created case appears in Creator UI.

### 9.4 Creator Case Processing Journey

1. Creator opens Cases.
2. Creator sees the new fan case.
3. Creator opens case detail.
4. Creator reviews intake summary.
5. Creator generates tags.
6. Creator saves tags.
7. Creator auto-matches rules.
8. Creator selects 3-5 rules.
9. Creator saves selected rules.

Acceptance:

- Case list must not look empty when cases exist.
- Case detail must show workflow state.
- Creator should understand what still needs to be done.

### 9.5 Report Delivery Journey

1. Creator opens case report page.
2. Creator generates Lite Report.
3. Creator generates Barber Brief.
4. Creator reviews and saves report.
5. Creator marks report delivered.
6. Creator shares report link.
7. Fan opens shared report link.

Acceptance:

- Report and Barber Brief are visibly separate deliverables.
- Shared report does not expose creator private fields.
- Shared report works without fan login.

### 9.6 Feedback and Knowledge Journey

1. Fan opens feedback link.
2. Fan submits feedback score and text.
3. Fan explicitly chooses anonymized learning consent.
4. Creator opens Candidate Knowledge Queue.
5. Creator extracts candidate knowledge from consented feedback.
6. Candidate Knowledge stores abstract fields only.

Acceptance:

- Feedback API writes `consent_records`.
- Candidate Knowledge keeps `source_case_id`.
- Candidate Knowledge does not store fan alias as core knowledge.
- `pro_candidate` stays false unless explicitly reviewed in a future workflow.

## 10. Functional Requirements

### 10.1 Authentication

- The hosted Alpha must use Supabase magic link login.
- Hosted Alpha access must be invite-only.
- The app must support an allowlist using server-only configuration.
- Magic link errors must be safe and not expose internal keys or tokens.
- The frontend must never expose service role or secret keys.

### 10.2 Storage Modes

- Local Mode remains the default fallback.
- Supabase Mode is enabled when configured.
- Missing Supabase configuration must show setup guidance, not crash.
- All product pages should use the storage adapter abstraction, not direct localStorage.

### 10.3 Services

Creators must be able to:

- list services
- create hairstyle service
- view service detail
- see service status
- see local and cloud intake links
- copy or manually open cloud intake link

Service must include:

- service name
- module
- description
- delivery format
- status
- high-entropy intake token

### 10.4 Intake

Public intake route must:

- find active service by token
- expose only service basics
- accept structured intake without fan login
- remove sensitive fields
- create fan case
- create service processing consent record

### 10.5 Cases

Creators must be able to:

- list own cases
- open case detail
- view intake summary
- see status
- generate and save tags
- run rule matching
- save selected rule ids

### 10.6 Reports

Creators must be able to:

- generate Lite Report
- generate Barber Brief
- save report
- mark report as delivered
- access share token

Public report route must:

- find report by share token
- return markdown and barber brief
- not return creator private fields
- work without fan login

### 10.7 Feedback

Public feedback route must:

- find report by share token
- require `consent_to_anonymized_learning`
- write feedback
- write anonymized learning consent record
- not create Candidate Knowledge directly

### 10.8 Candidate Knowledge

Creators must be able to:

- view candidate queue
- extract candidate knowledge from feedback
- review consent status
- keep source case traceability

Candidate Knowledge fields must include:

- feature tags
- scenario tags
- constraints
- selected rule ids
- recommendation summary
- execution card summary
- avoid list
- user feedback score
- creator feedback
- execution status
- reuse potential
- consent status
- anonymization status
- review status
- evidence level
- pro candidate
- public rule candidate

Candidate Knowledge must not store:

- raw photos
- phone numbers
- WeChat IDs
- ID card numbers
- addresses
- emails
- fan alias as core knowledge

## 11. Page Requirements

### 11.1 `/login`

Purpose: invite-only creator login.

Requirements:

- show StyleOS Creator Studio CE identity
- explain hosted Alpha is invite-only
- show email magic link form in Supabase Mode
- show Local Mode profile setup when Local Mode is active
- show safe error for unauthorized email
- show sign out state when logged in

UI direction:

- simple, credible, not marketing-heavy
- should make the next action obvious

### 11.2 `/setup`

Purpose: operator and creator readiness check.

Requirements:

- show storage mode
- show Supabase configured boolean
- show Alpha mode boolean
- show Alpha allowlist configured boolean
- show current login state without email or user id
- link to key docs

UI direction:

- status dashboard, not documentation wall
- green/yellow/red readiness signals

### 11.3 `/dashboard`

Purpose: creator home.

Requirements:

- show workflow overview
- show current counts
- show next recommended action
- link to Services, Cases, Candidate Queue
- show empty states when no data exists

UI direction:

- operational console
- compact and action-oriented

### 11.4 `/services`

Purpose: service menu management.

Requirements:

- list creator services
- show active/draft/paused status
- show module and delivery format
- create service CTA
- empty state with clear action

### 11.5 `/services/[serviceId]`

Purpose: service detail and sharing.

Requirements:

- show service metadata
- show cloud intake link in Supabase Mode
- show local intake link in Local Mode
- provide copy link affordance
- provide same-tab open link
- show note that cross-device sharing requires Supabase Mode

### 11.6 `/intake/[token]`

Purpose: public fan intake.

Requirements:

- show service name and description
- show structured hairstyle intake form
- require processing consent
- show success state after submit
- no login required
- no sensitive fields

### 11.7 `/cases`

Purpose: creator case workbench.

Requirements:

- list cases
- show fan alias, service, status, created date
- show next action per case
- clear empty state

### 11.8 `/cases/[caseId]`

Purpose: case review.

Requirements:

- show intake summary
- show target scenario
- show constraints
- show status
- link to tags, rules, and report steps

### 11.9 `/cases/[caseId]/tags`

Purpose: tag generation and review.

Requirements:

- generate tags from intake
- display tag group, tag, confidence, rationale
- allow save tags

### 11.10 `/cases/[caseId]/rules`

Purpose: rule matching and selection.

Requirements:

- auto-match hairstyle rules
- display match reason
- allow select 3-5 relevant rules
- save selected rules

### 11.11 `/cases/[caseId]/report`

Purpose: deliverable creation.

Requirements:

- generate Lite Report
- generate Barber Brief
- show both deliverables separately
- save report
- mark as delivered
- expose share link after report exists

### 11.12 `/reports/[shareToken]`

Purpose: public shared report.

Requirements:

- show report markdown
- show Barber Brief
- show feedback CTA
- no login required
- no creator private fields

### 11.13 `/feedback/[shareToken]`

Purpose: fan feedback.

Requirements:

- show score input
- show usefulness fields
- require anonymized learning consent checkbox
- show success state
- no login required

### 11.14 `/knowledge/candidates`

Purpose: Candidate Knowledge review queue.

Requirements:

- list candidates
- show consent status
- show anonymization status
- show source case traceability
- show recommendation summary
- show evidence level
- prevent denied-consent candidates from becoming Pro candidates

## 12. Data and Privacy Requirements

### 12.1 Data Allowed in Alpha

- synthetic service descriptions
- structured hairstyle intake text
- tags
- selected rules
- report markdown
- barber brief text
- feedback text
- consent records
- abstracted candidate knowledge

### 12.2 Data Not Allowed in Alpha

- raw photos
- phone numbers
- WeChat IDs
- ID card numbers
- addresses
- emails inside StyleOS business tables
- payment records
- private chat transcripts
- real client sensitive data

### 12.3 Consent

Two consent types are required in the workflow:

- `service_processing`
- `anonymized_learning`

Candidate Knowledge extraction requires anonymized learning consent. If consent is denied, the candidate may exist for internal traceability but must not be marked `pro_candidate`.

## 13. Technical Requirements

- `npm install` must pass.
- `npm run build` must pass.
- `NEXT_PUBLIC_STORAGE_MODE=local npm run build` must pass.
- Hosted `/api/health` must return safe JSON.
- Supabase Mode must use the existing ruhang365 Supabase Project.
- StyleOS business data must stay inside `styleos` schema.
- No migration should be executed during UI work.
- No service role key may enter the browser bundle.
- No `.env.local` may be committed.

## 14. Non-functional Requirements

### 14.1 Reliability

- public token routes must return clear 404 or safe error when token is invalid
- authenticated creator pages must not white screen when unauthenticated
- setup page must explain configuration gaps

### 14.2 Usability

- core pages must be navigable from the app shell
- each page needs one primary action
- empty states must be useful
- status labels must be understandable to non-engineers

### 14.3 Security

- invite-only access for Alpha
- no secret output in UI, logs, reports, or docs
- no broad anon table permissions
- public routes return only necessary fields

## 15. Success Metrics

### 15.1 Alpha Product Metrics

- 3-5 invited creators can log in successfully.
- At least 3 creators complete service creation.
- At least 3 synthetic or low-risk intake submissions are completed.
- At least 3 reports are delivered through share links.
- At least 3 feedback submissions are captured.
- At least 1-3 Candidate Knowledge records are extracted with consent.

### 15.2 Qualitative Metrics

- Creators can explain what the product does after first use.
- Creators understand the difference between case data and Candidate Knowledge.
- Creators can identify where to share intake and report links.
- Creators consider Barber Brief useful as a practical deliverable.

### 15.3 Safety Metrics

- zero leaked secrets
- zero committed `.env.local`
- zero raw photo uploads
- zero sensitive personal fields in `styleos` business tables
- synthetic test cleanup returns table counts to baseline

## 16. Alpha Test Plan

### 16.1 Internal Test

Before inviting creators:

1. Run hosted health check.
2. Verify magic link login.
3. Run hosted synthetic E2E.
4. Verify cleanup.
5. Confirm invite-only allowlist.
6. Confirm UI pages do not show internal implementation details.

### 16.2 Guided Alpha Test

For each invited creator:

1. Log in.
2. Review the hairstyle consultation workbench.
3. Create or inspect a hairstyle service.
4. Share intake link to a test device.
5. Submit synthetic intake.
6. Process case.
7. Generate report and Barber Brief.
8. Open shared report.
9. Submit feedback.
10. Extract Candidate Knowledge only with consent.
11. Record friction and confusion.

## 17. UI Direction

The Alpha UI should feel like a Chinese-first practical consultation tool for small-B creators, not a generic admin backend.

Product feel:

- Chinese-first
- practical
- calm
- professional
- guided
- action-oriented
- mobile-aware
- suitable for use during a real consultation

It should not feel like:

- a SaaS admin console
- an analytics dashboard
- a CRM
- a marketing landing page
- a decorative portfolio site
- a consumer quiz

Visual priorities:

- the main call to action is starting or continuing a hairstyle consultation
- the workflow is shown as a clear task path, not just as status metadata
- each page explains the next operating step in plain Chinese
- service links, cases, reports, and feedback feel like work tools
- public fan pages are simple, safe, and mobile-friendly
- setup and health information stays secondary and operator-oriented
- restrained color system
- readable forms
- practical empty states

Copy priorities:

- Prefer natural Simplified Chinese labels such as `发型咨询`, `开始咨询`, `采集信息`, `案例`, `生成标签`, `匹配规则`, `顾客报告`, `理发师沟通卡`, `反馈`, and `候选知识`.
- Keep English terms such as `Lite Report`, `Barber Brief`, and `Candidate Knowledge` only where they clarify product terminology.
- Avoid user-facing admin language such as `Dashboard`, `Workspace`, `Admin`, `Database`, `Schema`, `RLS`, and `Service Role`.

## 18. v0 Design Scope

Use Vercel v0 for UI polish, not product logic.

v0 may generate:

- page layouts
- responsive UI structure
- form presentation
- workflow cards
- status components
- empty states
- navigation refinements

v0 must not change:

- Supabase schema
- auth logic
- storage adapter contracts
- public API route behavior
- data privacy constraints
- token generation
- E2E cleanup logic

See [v0 UI Brief](v0-ui-brief.md).

## 19. Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| UI polish hides workflow complexity | creators do not understand core flow | keep next-action guidance per page |
| v0 rewrites business logic | E2E breaks | restrict v0 scope to UI components and pages |
| creators enter real sensitive data | privacy risk | keep Alpha onboarding and form guardrails explicit |
| invite-only auth blocks valid tester | Alpha test friction | keep allowlist operations runbook current |
| Candidate Knowledge stores identity data | privacy and trust risk | enforce abstract field set and review states |
| broad public access too early | support and data risk | keep Alpha invite-only |

## 20. Open Questions

- Should the first public Alpha include a simplified dashboard checklist?
- Should the service creation page be prefilled for Alpha to reduce friction?
- Should the report editor support manual Markdown editing before AI integration?
- Should Candidate Knowledge extraction stay creator-triggered or become guided by a review wizard?
- How many Alpha creators are enough before deciding on StyleOS Cloud packaging?

## 21. Release Plan

### v0.2.6 - Alpha UI Polish and v0 Design Pass

- complete PRD
- create v0 UI brief
- generate UI options in v0
- integrate selected UI without changing storage or API behavior
- verify Chinese-first practical-tool positioning
- rerun local and hosted E2E

### v0.2.7 - Alpha Creator Onboarding

- invite 3-5 controlled testers
- run guided Alpha tasks
- collect P0/P1/P2 feedback
- decide whether to refine Hairstyle or expand scope

### v0.3 - Hairstyle Workflow MVP Refinement

- improve report editing
- improve rule explanation
- improve case status clarity
- improve Candidate Knowledge review ergonomics

## 22. Definition of Done

The PRD-backed Alpha UI work is done when:

- PRD and v0 UI Brief are linked from README.
- The core UI is Chinese-first and no longer reads like a generic admin backend.
- v0-generated UI is integrated without breaking existing workflows.
- `npm run build` passes.
- Local Mode build passes.
- Hosted health check stays green.
- Hosted synthetic E2E passes and cleans up.
- 1-3 internal testers can operate the product without engineer guidance.

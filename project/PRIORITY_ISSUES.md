# Priority Issues

## 1. Hosted Online Synthetic E2E

- title: Complete Hosted Online Synthetic E2E
- why it matters: This is the required gate before inviting Alpha creators.
- scope: Run full hosted synthetic service, intake, case, report, feedback, candidate, and cleanup flow.
- acceptance criteria: All six `styleos` table counts return to pre-test values.
- not included: real user testing or feature changes.

## 2. Alpha User Onboarding

- title: Prepare 3-5 Alpha creator onboarding flow
- why it matters: Testers need clear synthetic-data-only instructions.
- scope: Invite, onboarding, task list, feedback summary.
- acceptance criteria: A tester can complete the workflow without private support.
- not included: public signup.

## 3. Report Editor Usability

- title: Improve Lite Report editing clarity
- why it matters: Report quality is the creator-facing deliverable.
- scope: Review report generation and edit flow after Alpha feedback.
- acceptance criteria: Creator can save, edit, and deliver report without confusion.
- not included: AI-generated prose.

## 4. Case Flow Clarity

- title: Clarify case state progression
- why it matters: Creators need to understand what to do next.
- scope: Status labels, empty states, next-step cues.
- acceptance criteria: Alpha tester can move from intake to delivered report.
- not included: team workflow.

## 5. Barber Brief UX

- title: Improve Barber Brief readability
- why it matters: Barber Brief is the execution bridge.
- scope: Structure, headings, avoid list, action language.
- acceptance criteria: A tester can tell what to give to a hairstylist.
- not included: printable PDF.

## 6. Consent Review

- title: Make consent states easier to inspect
- why it matters: Candidate reuse depends on consent.
- scope: Surface processing and anonymized-learning consent states.
- acceptance criteria: Maintainer can verify consent in E2E and Alpha review.
- not included: new legal workflow.

## 7. Candidate Knowledge Review UI

- title: Add clearer Candidate Knowledge review states
- why it matters: Candidate Knowledge is not automatically trusted.
- scope: Review status, evidence level, reuse potential, Pro candidate flags.
- acceptance criteria: Reviewer can tell pending from approved or denied items.
- not included: StyleOS Pro publication.

## 8. Creator Feedback Workflow

- title: Improve creator-side feedback capture
- why it matters: Creator judgment is part of evidence.
- scope: Capture creator feedback after fan feedback.
- acceptance criteria: Candidate Knowledge includes creator feedback summary.
- not included: AI review.

## 9. Alpha Error Monitoring

- title: Define daily hosted Alpha error review
- why it matters: Small Alpha still needs operational discipline.
- scope: Vercel logs, health check, Supabase counts, tester reports.
- acceptance criteria: Daily checklist can be completed in under 15 minutes.
- not included: automated observability platform.

## 10. Scope Expansion Decision

- title: Decide Hairstyle refinement versus Color expansion
- why it matters: Expanding too early may hide workflow problems.
- scope: Review Alpha feedback after first tester batch.
- acceptance criteria: Decision recorded in product decisions log.
- not included: implementing Color module.

# Alpha Testing Pack

Use this pack to run the first guided 1-3 account Alpha tests after Alpha UI polish and post-UI hosted synthetic E2E verification.

## Goal

Validate whether a small-B creator understands and values the Hairstyle Workflow:

```text
Service -> Intake -> Case -> Tags -> Rules -> Report -> Feedback -> Candidate Knowledge
```

This Alpha is not for paid client delivery, broad public access, or real personal data collection.

## Operator Sequence

1. Select one tester at a time.
2. Confirm the tester is comfortable using synthetic data first.
3. Add or confirm the tester's email in the Alpha allowlist through the approved hosting process.
4. Send the short invite or role-specific invitation.
5. Send the onboarding message and test task list.
6. Ask the tester to complete the workflow while noting unclear steps.
7. Collect feedback with the feedback form.
8. Summarize feedback into P0, P1, and P2.
9. Decide whether the next tester can proceed or whether a blocker must be fixed first.

## Materials

- Short invite: [Alpha Small-B Invite Short](../launch/alpha-small-b-invite-short.md)
- Long invite: [Alpha Small-B Invite Long](../launch/alpha-small-b-invite-long.md)
- Role-specific invites: [Alpha Invitation Message](../launch/alpha-invitation-message.md)
- Onboarding message: [Alpha Onboarding Message](../launch/alpha-onboarding-message.md)
- Test script: [Alpha Test Script](../launch/alpha-test-script.md)
- Test task list: [Alpha Test Task List](../launch/alpha-test-task-list.md)
- Feedback form: [Alpha Feedback Form](../launch/alpha-feedback-form.md)
- Feedback summary: [Alpha Feedback Summary Template](../launch/alpha-feedback-summary-template.md)
- Daily checklist: [Daily Alpha Checklist](../ops/DAILY_ALPHA_CHECKLIST.md)
- Incident response: [Incident Response](../ops/INCIDENT_RESPONSE.md)

## Pre-Test Checklist

- [ ] Tester is one of the 1-3 guided Alpha accounts.
- [ ] Tester understands this is a workflow Alpha, not a production service.
- [ ] Tester agrees to use synthetic data first.
- [ ] Tester has been told not to enter photos, phone numbers, WeChat IDs, ID card numbers, addresses, private client records, or payment data.
- [ ] Hosted Alpha URL is reachable.
- [ ] `/api/health` returns `ok: true`.
- [ ] Alpha allowlist and magic-link login are ready.
- [ ] Daily checklist owner is assigned for this test day.
- [ ] Incident response owner is assigned for this test day.

## Test Data Guidance

Use fictional but realistic hairstyle consultation details:

- fan alias: synthetic persona only
- scenario: commute, interview, dating, camera appearance, or creator content shoot
- concern: side volume, flat crown, hard-to-style fringe, conservative workplace constraints
- goal: cleaner outline, lower maintenance, natural color, easier barber communication

Do not use:

- real photos
- phone numbers
- WeChat IDs
- ID card numbers
- addresses
- private client records
- emails in free-text fields
- payment information
- screenshots containing private chats

## Stop Conditions

Pause the test before inviting the next tester if any of these happen:

- login fails for an approved tester
- service creation fails
- intake creates no visible case
- report cannot be saved or opened
- feedback cannot be submitted
- Candidate Knowledge cannot be extracted after consented feedback
- test data cannot be cleaned when cleanup is required
- a tester enters sensitive personal data
- a P0 issue appears in data safety, auth, or report delivery

## Feedback Classification

- P0: blocks login, service creation, intake, case visibility, report delivery, feedback, cleanup, or data safety.
- P1: slows the workflow, causes misunderstanding, or creates high-friction editing or review.
- P2: useful improvement that does not block Alpha validation.

## Next-Tester Rule

Invite the next tester only when:

- all P0 issues from the previous test are fixed or explicitly accepted
- no sensitive data remains in the system or feedback notes
- the daily Alpha checklist is reviewed
- the feedback summary has a clear next action


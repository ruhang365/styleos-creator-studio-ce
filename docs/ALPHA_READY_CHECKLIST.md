# Alpha Ready Checklist

Use this checklist before inviting 3-5 small-B Alpha creators.

## Required Gates

- [x] Hosted Alpha Online Synthetic E2E passed.
- [x] Test data cleanup verified.
- [x] `/api/health` returns safe JSON.
- [x] Hosted magic link login works.
- [x] `/setup` shows Supabase configured.
- [x] `/dashboard`, `/services`, `/cases`, and `/knowledge/candidates` do not 500.
- [x] Public intake route returns expected token response.
- [x] Public report route returns expected shared report response.
- [x] Public feedback route accepts synthetic feedback.
- [x] `consent_records` increases by 2 during E2E and returns to baseline after cleanup.
- [x] Candidate Knowledge keeps `source_case_id` and marker evidence in synthetic E2E.
- [ ] Alpha UI polish completed.
- [ ] v0 UI integration passes local and hosted E2E.

## Alpha Operations

- [ ] 1-3 approved test accounts are prepared for guided UI feedback.
- [x] Alpha access strategy is confirmed.
- [ ] Alpha onboarding message is ready.
- [ ] Alpha test task list is ready.
- [ ] Alpha feedback summary template is ready.
- [ ] Daily Alpha checklist owner is assigned.
- [ ] Incident response owner is assigned.

## Data Safety

- [ ] Testers are told to use synthetic data first.
- [ ] Testers are told not to upload real photos.
- [ ] Testers are told not to enter phone, WeChat, ID card, address, or private identity data.
- [ ] Public GitHub issues and feedback must use sanitized examples.

## Decision

Do not invite Alpha creators until all required gates are checked.

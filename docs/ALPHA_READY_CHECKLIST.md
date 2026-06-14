# Alpha Ready Checklist

Use this checklist before inviting 3-5 small-B Alpha creators.

## Required Gates

- [ ] Hosted Alpha Online Synthetic E2E passed.
- [ ] Test data cleanup verified.
- [ ] `/api/health` returns safe JSON.
- [ ] Hosted magic link login works.
- [ ] `/setup` shows Supabase configured.
- [ ] `/dashboard`, `/services`, `/cases`, and `/knowledge/candidates` do not 500.
- [ ] Public intake route returns expected token response.
- [ ] Public report route returns expected shared report response.
- [ ] Public feedback route accepts synthetic feedback.
- [ ] `consent_records` increases by 2 during E2E and returns to baseline after cleanup.
- [ ] Candidate Knowledge keeps `source_case_id` and marker evidence in synthetic E2E.

## Alpha Operations

- [ ] 3-5 approved test accounts are prepared.
- [ ] Alpha access strategy is confirmed.
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

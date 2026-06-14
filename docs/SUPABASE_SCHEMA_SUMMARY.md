# Supabase Schema Summary

StyleOS Alpha reuses the existing ruhang365 Supabase Project. StyleOS data is isolated under the `styleos` schema. The current Alpha does not modify existing `public` business tables and does not modify the `auth` schema.

## Tables

| Table | Purpose | Personal information | Knowledge use |
| --- | --- | --- | --- |
| `styleos.services` | Creator service menu items and intake tokens | Low. Creator-owned service description only. | Service context can explain where a case came from. |
| `styleos.fan_cases` | Fan intake case workflow | Medium to high. Intake can include user-provided context. | Raw case data must not enter public knowledge directly. |
| `styleos.reports` | Lite Report, Barber Brief, share token, delivery state | Medium to high. Report may summarize case-specific advice. | Only abstracted recommendations may inform Candidate Knowledge. |
| `styleos.feedback` | Fan feedback on delivered report | Medium. Feedback text can contain personal context. | May become evidence only with anonymized-learning consent. |
| `styleos.candidate_knowledge` | Abstracted reusable learning | Should not contain identity data. | Main candidate knowledge queue. |
| `styleos.consent_records` | Service processing and anonymized learning consent | High because it records authorization state. | Required guardrail before reuse. |

## Candidate Knowledge Boundary

`candidate_knowledge` must not save raw photos, phone numbers, WeChat IDs, ID card numbers, addresses, or real identity details. It should store abstracted feature-solution-outcome mapping:

- feature tags
- scenario tags
- constraints
- selected rule ids
- recommendation summary
- execution card summary
- avoid list
- feedback score
- creator feedback summary
- consent status
- anonymization status
- review status
- evidence level

## Auth Relationship

Creator-owned tables use `creator_user_id` linked to shared `auth.users`. Current Alpha does not add workspace, team, or organization tables.

## API Boundary

Public token routes may read or write only the minimum data needed for intake, shared report, and feedback. They must not expose creator private fields, Candidate Knowledge, SQL details, or server secrets.

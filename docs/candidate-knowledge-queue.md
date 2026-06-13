# Candidate Knowledge Queue

Candidate Knowledge Queue stores reviewable, anonymized feature-solution-feedback mappings.

## What Enters the Queue

- feature tags
- recommendation summary
- execution feedback
- creator feedback
- user feedback score
- consent status
- anonymization status
- evidence level

## What Must Not Enter

- real photos
- names
- contact details
- private messages
- payment data
- unapproved personal stories
- raw identity records

## How Anonymization Works

1. Remove identity fields.
2. Replace case references with internal IDs.
3. Keep only structured tags and abstracted notes.
4. Confirm consent scope.
5. Send to maintainer or reviewer queue.

## Review Statuses

- `new`
- `needs_anonymization`
- `needs_consent`
- `under_review`
- `open_rule_candidate`
- `pro_candidate`
- `expert_review_needed`
- `rejected`
- `archived`

## Evidence Levels

- E0: synthetic starter
- E1: creator submitted
- E2: repeated creator observation
- E3: expert reviewed
- E4: data-supported
- E5: Pro validated pattern

## Open Rule Candidate

Open rule candidates may become public protocol rules after privacy, clarity, limitation, and evidence review.

## Pro Candidate

Pro candidates may require stricter authorization, expert review, and commercial knowledge governance.

## Rejected / Archived

Candidates should be rejected or archived when privacy is unclear, evidence is weak, language is unsafe, or the pattern is not reusable.

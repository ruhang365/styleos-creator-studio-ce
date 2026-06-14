# Data and Privacy Principles

## Core Principle

StyleOS does not need to collect personal identity data as its core asset. The reusable asset is abstracted knowledge:

```text
Feature Tags -> Styling Recommendation -> Execution Feedback -> Rule Evidence
```

## Alpha Rules

- Do not upload real photos.
- Do not enter phone numbers.
- Do not enter WeChat IDs.
- Do not enter ID card numbers.
- Do not enter addresses.
- Do not enter private identity records.
- Do not put real cases in public GitHub issues.
- Use synthetic examples for tests and bug reports.

## Raw Photos

Raw photo storage is not part of current CE Alpha. Do not add image upload until data handling, consent, storage, retention, and deletion policies are explicitly designed.

## Candidate Knowledge

Candidate Knowledge should store only abstract structure:

- feature tags
- scenario tags
- constraints
- selected rule ids
- recommendation summary
- execution feedback
- creator feedback
- evidence level
- review status

It must not store fan alias as core knowledge and must not store identity data.

## Consent

`consent_records` must track authorization. Feedback can enter anonymized reuse only when consent is granted and the resulting knowledge is anonymized and reviewed.

## Public Repository Rule

Public docs, issues, examples, screenshots, and logs must not contain personal data or secrets.

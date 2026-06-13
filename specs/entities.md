# Entities

Entity and relationship draft.

| Entity | Key relationships | Notes |
| --- | --- | --- |
| Creator | has many Services, FanCases, LiteReports | workspace owner |
| Service | belongs to Creator; has many FanCases | service menu item |
| FanCase | belongs to Creator and Service; has FanIntake, tags, report, feedback | private workflow record |
| FanIntake | belongs to FanCase | structured intake |
| StyleTag | belongs to FanCase or protocol taxonomy | feature / goal / scenario labels |
| RuleCard | matched by RuleMatch | starter, creator, or future Pro rule |
| RuleMatch | belongs to FanCase and RuleCard | accepted / rejected / overridden by creator |
| LiteReport | belongs to FanCase | creator-reviewed deliverable |
| ExecutionCard | belongs to LiteReport or FanCase | barber brief or similar |
| Feedback | belongs to LiteReport | outcome and usefulness feedback |
| CandidateKnowledge | derived from FanCase and Feedback | anonymized mapping |
| ConsentRecord | belongs to FanCase | authorization and reuse scope |

## Relationship Principle

Private case data should not automatically become CandidateKnowledge. Extraction requires anonymization, consent, and review.

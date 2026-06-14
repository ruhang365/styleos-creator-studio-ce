# Data Model

This document defines entities at product-definition level. It is not a database migration.

## Alpha Supabase Model

StyleOS Alpha reuses the existing ruhang365 Supabase Project and shared `auth.users`.

Alpha does not use a workspace model. Creator-owned StyleOS records use `creator_user_id`, which references `auth.users(id)`. A future version may migrate to a workspace model if team access, multi-creator studios, or organization billing become required.

StyleOS Alpha business tables are isolated under the `styleos` schema:

- `styleos.services`
- `styleos.fan_cases`
- `styleos.reports`
- `styleos.feedback`
- `styleos.candidate_knowledge`
- `styleos.consent_records`

This Alpha draft does not modify existing `public` tables. `public.profiles` may remain the ruhang365 unified profile layer, but the StyleOS Alpha migration does not change it.

## v0.2.2 Storage Fields

Supabase Mode maps CE objects to the existing `styleos` tables:

- `creator_user_id` references `auth.users(id)` and owns creator records.
- `intake_token` identifies public intake links for services.
- `share_token` identifies public report and feedback links.
- `styleos.fan_cases.intake` stores structured text intake only.
- `styleos.reports.barber_brief` stores the action brief as JSON.
- `styleos.feedback.consent_to_anonymized_learning` controls candidate reuse.

Candidate knowledge stores:

- `feature_tags`
- `scenario_tags`
- `constraints`
- `selected_rule_ids`
- `recommendation_summary`
- `execution_card_summary`
- `avoid_list`
- `user_feedback_score`
- `creator_feedback`
- `execution_status`
- `reuse_potential`
- `consent_status`
- `anonymization_status`
- `review_status`
- `evidence_level`
- `pro_candidate`
- `public_rule_candidate`

Candidate knowledge must not store `fan_alias` as a core knowledge field.

## Entity Overview

| Entity | Purpose | Privacy level | Open-source relation | Pro relation |
| --- | --- | --- | --- | --- |
| Creator | Workspace owner who provides styling services | medium | CE user role | may access Pro in future Cloud |
| Service | Creator-defined service offering | low | CE workflow object | Pro templates may enhance it |
| FanCase | A service case submitted by a fan/client | high | CE local/private object | only abstracted data may become candidate |
| FanIntake | Structured intake response for a case | high | aligns with protocol schema | not Pro content by default |
| StyleTag | Structured feature or goal label | low to medium | from protocol or creator extension | Pro may include advanced tags |
| RuleCard | Reusable styling rule | low | starter rules from protocol | Pro may include expert-reviewed rules |
| RuleMatch | Match between case tags and rule cards | medium | CE computation/result | Pro may improve ranking |
| LiteReport | Creator-edited deliverable report | high | uses protocol report shape | Pro may provide templates |
| ExecutionCard | Practical brief such as barber brief | medium | uses protocol execution cards | Pro may offer polished variants |
| Feedback | User/creator feedback after delivery | high | CE private record | abstracted feedback may become evidence |
| CandidateKnowledge | Anonymized feature-solution-feedback mapping | medium | queue structure is open | may become Pro candidate |
| ConsentRecord | Tracks authorization for reuse | high | privacy guardrail | required for Pro candidate review |

## Entity Details

### Creator

- purpose: workspace owner and service provider.
- key fields: `creator_user_id`, `display_name`, `role`, `created_at`.
- privacy level: medium.
- open-source relation: core CE user role backed by shared `auth.users`.
- Pro relation: may access future Pro library through Cloud.

### Service

- purpose: defines a creator's service menu item.
- key fields: `id`, `creator_user_id`, `name`, `module`, `description`, `price_note`, `delivery_format`, `status`, `intake_token`.
- privacy level: low.
- open-source relation: CE workflow object.
- Pro relation: future Pro may provide high-conversion service templates.

### FanCase

- purpose: tracks one fan/client consultation workflow.
- key fields: `id`, `creator_user_id`, `service_id`, `fan_alias`, `target_scenario`, `status`, `intake`, `tags`, `selected_rule_ids`, `share_token`.
- privacy level: high.
- open-source relation: CE private workflow object.
- Pro relation: raw case does not enter Pro by default.

### FanIntake

- purpose: stores structured intake answers for a case.
- key fields: `intake_id`, `case_id`, `scenario`, `goals`, `constraints`, `maintenance_level`, `uploaded_asset_refs`.
- privacy level: high.
- open-source relation: aligns with styleos-protocol input schema.
- Pro relation: only anonymized and reviewed fields may become candidate knowledge.

### StyleTag

- purpose: labels feature, goal, scenario, maintenance, and constraint signals.
- key fields: `tag_id`, `tag_group`, `label`, `source`, `confidence`, `notes`.
- privacy level: low to medium.
- open-source relation: can come from protocol taxonomy.
- Pro relation: advanced tags may belong to Pro.

### RuleCard

- purpose: expresses reusable styling logic.
- key fields: `rule_id`, `module`, `conditions`, `recommendation`, `avoid`, `evidence_level`, `status`.
- privacy level: low.
- open-source relation: starter rules can come from protocol.
- Pro relation: expert-reviewed and verified rules may belong to Pro.

### RuleMatch

- purpose: links a FanCase to relevant RuleCards.
- key fields: `match_id`, `case_id`, `rule_id`, `match_reason`, `confidence`, `creator_override`.
- privacy level: medium.
- open-source relation: CE workflow result.
- Pro relation: Pro may improve ranking and explanation.

### LiteReport

- purpose: creator-reviewed service deliverable.
- key fields: `id`, `creator_user_id`, `case_id`, `share_token`, `markdown`, `barber_brief`, `status`, `delivered_at`.
- privacy level: high.
- open-source relation: uses protocol report structure.
- Pro relation: Pro may provide advanced report templates.

### ExecutionCard

- purpose: converts recommendations into action-ready instructions.
- key fields: `execution_card_id`, `case_id`, `type`, `goal`, `keep`, `adjust`, `avoid`, `maintenance_note`.
- privacy level: medium.
- open-source relation: aligns with protocol execution cards.
- Pro relation: Pro may provide more refined execution templates.

### Feedback

- purpose: records post-delivery outcome and user/creator review.
- key fields: `id`, `report_id`, `case_id`, `score`, `easy_to_understand`, `most_useful`, `will_use_barber_brief`, `shown_to_hairstylist`, `feedback_text`, `consent_to_anonymized_learning`.
- privacy level: high.
- open-source relation: CE private record.
- Pro relation: abstracted feedback may become evidence after review.

### ConsentRecord

- purpose: tracks whether data can be reused beyond the original service.
- key fields: `id`, `case_id`, `report_id`, `consent_type`, `consent_value`, `consent_note`, `created_at`.
- privacy level: high.
- open-source relation: required privacy guardrail.
- Pro relation: required before candidate knowledge review.

## CandidateKnowledge

CandidateKnowledge does not save real photos, names, or contact details. It saves the abstracted mapping: feature tags -> recommendation summary -> execution feedback.

### Fields

- `candidate_id`
- `creator_user_id`
- `source_case_id`
- `feature_tags`
- `scenario_tags`
- `constraints`
- `selected_rule_ids`
- `recommendation_summary`
- `execution_card_summary`
- `avoid_list`
- `creator_feedback`
- `user_feedback_score`
- `execution_status`
- `reuse_potential`
- `anonymization_status`
- `consent_status`
- `review_status`
- `evidence_level`
- `pro_candidate`
- `public_rule_candidate`

### Purpose

CandidateKnowledge helps maintainers and reviewers decide whether a repeated styling pattern should become:

- a public starter rule
- a Pro candidate
- an expert-review candidate
- rejected or archived

### Privacy Rule

CandidateKnowledge stores structured learning, not personal identity data.

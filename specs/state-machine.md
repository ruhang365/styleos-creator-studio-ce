# State Machine

FanCase state machine.

```mermaid
stateDiagram-v2
    [*] --> draft
    draft --> intake_submitted
    intake_submitted --> tagging
    tagging --> rule_matching
    rule_matching --> report_draft
    report_draft --> creator_review
    creator_review --> delivered
    delivered --> feedback_received
    feedback_received --> candidate_extracted
    candidate_extracted --> archived
    delivered --> archived
    creator_review --> archived
```

## States

- `draft`: service case created but not submitted.
- `intake_submitted`: fan intake received.
- `tagging`: creator reviews and assigns tags.
- `rule_matching`: system or creator matches rule cards.
- `report_draft`: lite report generated or started.
- `creator_review`: creator manually edits and approves.
- `delivered`: report delivered to fan/client.
- `feedback_received`: feedback submitted.
- `candidate_extracted`: anonymized candidate knowledge extracted.
- `archived`: workflow closed.

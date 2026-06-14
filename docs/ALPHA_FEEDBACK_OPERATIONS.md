# Alpha Feedback Operations

## Feedback Sources

- tester messages
- observed workflow blockers
- hosted Alpha errors
- `/api/health` status
- failed E2E steps
- Candidate Knowledge review gaps

## Feedback Categories

- P0: blocks login, service creation, intake, case visibility, report delivery, feedback, cleanup, or data safety.
- P1: slows the workflow or makes it confusing.
- P2: useful enhancement but not required for Alpha validation.

## Daily Process

1. Review new feedback.
2. Remove any sensitive personal data before saving notes.
3. Classify each item as P0, P1, or P2.
4. Add confirmed work to `project/BACKLOG.md` or `project/PRIORITY_ISSUES.md`.
5. Decide whether the issue blocks the next Alpha tester.
6. Update the daily Alpha checklist.

## Decision Questions

- Is this a workflow blocker?
- Is this a UI clarity issue?
- Is this a data safety issue?
- Does this require a code fix?
- Does this require a doc or onboarding fix?
- Does this suggest a new feature, or does the current workflow need simplification?

## Next-round Criteria

Move to another Alpha tester only when P0 issues from the previous run are resolved or explicitly accepted.

# Product Decisions Log

## Current Decisions

| Decision | Status | Reason |
| --- | --- | --- |
| Start with Web SaaS, not app or mini program | Active | Fastest path to workflow validation. |
| Serve small-B creators first, not direct consumer users | Active | Creators own the service workflow and knowledge loop. |
| Start with Hairstyle Module | Active | Narrow enough for complete E2E validation. |
| Protocol open-source, CE open-source, Cloud hosted, Pro closed | Active | Keeps standards open while preserving commercial product layers. |
| Reuse ruhang365 Supabase Project | Active | Uses existing auth and platform foundation. |
| Isolate StyleOS data in `styleos` schema | Active | Avoids modifying existing ruhang365 public business tables. |
| Do not collect raw photos as a core asset | Active | Core asset is abstract feature-solution-outcome mapping. |
| Alpha does not include payment, AI API, or image upload | Active | Avoids scope expansion before workflow validation. |
| Hosted Online E2E is required before real Alpha invites | Active | Prevents onboarding users before cleanup and hosted workflow are proven. |

## Core Asset Decision

StyleOS should not treat personal identity data as the primary asset. The durable asset is:

```text
Feature Tags -> Styling Recommendation -> Execution Feedback -> Rule Evidence
```

## Review Cadence

Update this log when a decision changes scope, data boundary, licensing, Alpha access, or commercialization direction.

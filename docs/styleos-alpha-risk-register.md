# StyleOS Alpha Risk Register

This register tracks known risks before executing the StyleOS Alpha Supabase SQL draft.

| Risk | Impact | Mitigation | Owner | Status |
| --- | --- | --- | --- | --- |
| Mistakenly modifying existing `public` tables | Could break current ruhang365 platform data or production flows | Keep all StyleOS objects under `styleos`; review SQL for `public.*` changes before execution | StyleOS maintainer | Open |
| RLS configuration error | Creators may see or modify records they do not own, or all access may fail | Use `creator_user_id = auth.uid()` policies, run verify SQL, test with multiple users before Alpha | StyleOS maintainer | Open |
| `anon` permissions too broad | Public users could access private cases, reports, or candidate knowledge | Do not grant broad `anon` table privileges; implement public flows through server routes and tokens | StyleOS maintainer | Open |
| Custom schema not exposed | Frontend SDK access may fail even when tables exist | Check Supabase API settings for exposed schemas; add `styleos` only after RLS and grants are verified | Platform maintainer | Open |
| Service role key leakage | Full database access could be compromised | Keep service role key server-only; never commit `.env.local`; audit deployment env vars | Platform maintainer | Open |
| Token links are guessable | Intake/report/feedback links could be enumerated | Generate high-entropy tokens, avoid sequential values, support rotation or revocation | StyleOS maintainer | Open |
| `candidate_knowledge` stores personal information | Sensitive user data could become reusable knowledge | Sanitize extraction, keep only abstract feature-solution-outcome mapping, review before promotion | Knowledge maintainer | Open |
| Rollback misuse | Alpha tables and data could be deleted unintentionally | Use rollback only after backup and object inventory; do not run blindly in production | Platform maintainer | Open |
| Schema conflicts with future workspace model | Future team/studio support may require migration | Keep `creator_user_id` simple for Alpha and document future workspace migration path | Product maintainer | Open |
| Alpha data incompatible with future Cloud migration | Persistence may require data transforms later | Keep schema minimal, use explicit statuses, document migration assumptions, avoid hidden coupling | Product maintainer | Open |

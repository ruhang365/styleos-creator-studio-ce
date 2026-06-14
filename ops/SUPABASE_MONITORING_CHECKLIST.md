# Supabase Monitoring Checklist

## Daily Checks

- [ ] `styleos.services` count
- [ ] `styleos.fan_cases` count
- [ ] `styleos.reports` count
- [ ] `styleos.feedback` count
- [ ] `styleos.candidate_knowledge` count
- [ ] `styleos.consent_records` count

## Safety Checks

- [ ] RLS remains enabled on all `styleos` tables.
- [ ] `anon` does not have broad direct table access.
- [ ] service role or secret key is not exposed to client code.
- [ ] `styleos` remains exposed in Supabase API settings when Supabase Mode needs it.
- [ ] Auth redirect URLs include the hosted Alpha callback and wildcard.
- [ ] localhost redirects remain for local development.

## Data Checks

- [ ] No suspicious unclean synthetic markers.
- [ ] No raw photo fields or uploaded image references in Alpha data.
- [ ] No phone, WeChat, ID card, address, or private identity fields.
- [ ] Candidate Knowledge uses abstract feature-solution-outcome mapping.

## Incident Trigger

Pause Alpha if unexpected rows, missing consent, RLS issues, schema exposure errors, or secret exposure are detected.

# Alpha Access Policy

StyleOS Creator Studio CE Alpha is invite-only.

## Access Scope

- Invite 3-5 small-B testers first.
- Do not open public registration.
- Use Supabase Auth magic link with `shouldCreateUser=false`.
- Only existing test accounts or manually created Alpha accounts should log in.
- Do not accept real payment in Alpha.
- Do not use Alpha as a production service for the public.

## Creator Requirements

Alpha creators must agree to:

- use synthetic or low-risk test data first
- avoid uploading real photos
- avoid entering sensitive personal data
- avoid adding phone numbers, WeChat IDs, ID card numbers, addresses, emails, payment records, or private messages
- report issues with synthetic examples

## Fan Data Boundary

Fan intake is only for testing the workflow. It should not be treated as production customer data during Alpha.

Candidate Knowledge may only be extracted after feedback consent and should store abstract feature-solution-outcome structure, not fan identity.

## Account Operations

Alpha accounts should be created or approved manually by the maintainer. If an invite should be removed, disable access through the Supabase Auth administration path instead of changing application code.

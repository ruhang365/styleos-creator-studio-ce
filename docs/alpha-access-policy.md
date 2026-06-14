# Alpha Access Policy

StyleOS Creator Studio CE Alpha is invite-only.

## Access Scope

- Invite 3-5 small-B testers first.
- Do not open public registration.
- Use the server-side `/api/auth/magic-link` route for magic link requests.
- Use Supabase Auth magic link with `shouldCreateUser=false`.
- Configure `STYLEOS_ALPHA_ALLOWED_EMAILS` or `STYLEOS_ALPHA_ALLOWED_EMAIL_HASHES` as a server-only allowlist.
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

Alpha accounts should be created or approved manually by the maintainer. If an invite should be removed, remove the account from the server-only allowlist and disable access through the Supabase Auth administration path when needed.

Do not commit real email addresses, email hashes, Supabase keys, JWTs, or Auth links to the repository.

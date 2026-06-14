# Alpha Environment Variables

Use [.env.alpha.example](../.env.alpha.example) as the template for a hosted Alpha. Do not commit real secrets.

## Public Variables

| Variable | Purpose | Required in Alpha | Client visible | Example placeholder |
| --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_STORAGE_MODE` | Selects storage adapter. Alpha must use Supabase Mode. | yes | yes | `supabase` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL for browser and server clients. | yes | yes | `https://your-project.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Legacy public browser key. Use this or publishable key. | conditional | yes | `placeholder-anon-key` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Newer public browser key. Use this or anon key. | conditional | yes | `placeholder-publishable-key` |
| `NEXT_PUBLIC_APP_URL` | Deployed app URL used for links and operational checks. | yes | yes | `https://your-alpha-domain.vercel.app` |
| `NEXT_PUBLIC_ALPHA_MODE` | Indicates the deployed app is in Alpha mode. | yes | yes | `true` |

## Server-only Variables

| Variable | Purpose | Required in Alpha | Client visible | Example placeholder |
| --- | --- | --- | --- | --- |
| `SUPABASE_SERVICE_ROLE_KEY` | Legacy server-only key for token routes. Use this or secret key. | conditional | no | `placeholder-service-role-key` |
| `SUPABASE_SECRET_KEY` | Newer server-only key for token routes. Use this or service role key. | conditional | no | `placeholder-secret-key` |
| `STYLEOS_ALPHA_ALLOWED_EMAILS` | Comma-separated approved Alpha login emails. Use this or hashed allowlist. | conditional | no | `placeholder@example.com` |
| `STYLEOS_ALPHA_ALLOWED_EMAIL_HASHES` | Comma-separated SHA-256 hashes of lowercased approved emails. Use this or email allowlist. | conditional | no | `placeholder-sha256-hash` |

## Rules

- Do not commit `.env.local`.
- Do not paste real keys into Markdown files.
- Do not paste real Alpha account emails or hashes into Markdown files.
- Do not put server secrets in `NEXT_PUBLIC_` variables.
- Do not put Alpha allowlists in `NEXT_PUBLIC_` variables.
- Rotate secrets if they are ever exposed.

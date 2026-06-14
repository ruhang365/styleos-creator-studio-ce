# StyleOS Creator Studio CE

Open-source community edition of StyleOS Creator Studio, a workflow tool for AI-powered personal styling services.

中文说明：
StyleOS Creator Studio CE 是入行365 StyleOS 的开源社区版小 B 工作台，帮助造型、穿搭、形象、发型、美妆创作者把粉丝咨询转化为结构化服务、Lite Report 和可复用知识。

This repository is the local-first community edition of Creator Studio. It is not StyleOS Cloud and does not include hosted accounts, payments, production databases, AI APIs, or real user photo upload.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

For a production build check:

```bash
npm run build
```

No lint script is configured in v0.2. If a future version adds one, run:

```bash
npm run lint
```

Reset local data from the Dashboard by using `Reset Local Data`, or clear the browser localStorage keys that start with `styleos_ce_`.

## Storage Modes

Local Mode is the default and does not require Supabase:

```bash
NEXT_PUBLIC_STORAGE_MODE=local
```

Supabase Mode is optional and uses the existing ruhang365 Supabase Project:

```bash
NEXT_PUBLIC_STORAGE_MODE=supabase
NEXT_PUBLIC_SUPABASE_URL=placeholder
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder
SUPABASE_SERVICE_ROLE_KEY=placeholder
```

`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` can replace `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

`SUPABASE_SECRET_KEY` can replace `SUPABASE_SERVICE_ROLE_KEY`.

Do not commit `.env.local`. Service role or secret keys must only be used in server route handlers.

Setup page: `/setup`

- [Supabase Connection](docs/supabase-connection.md)
- [Storage Modes](docs/storage-modes.md)
- [Shareable Cloud Workflow](docs/shareable-cloud-workflow.md)
- [Magic Link Auth](docs/auth-magic-link.md)

## E2E Test Readiness

v0.2.2 now supports a complete synthetic E2E flow with service creation, fan intake, rule matching, report delivery, feedback, candidate knowledge extraction, and cleanup verification.

- [E2E Testing](docs/e2e-testing.md)
- [Supabase Schema Access Notes](docs/supabase-schema-access-notes.md)

## Alpha Deployment

v0.2.3 prepares the project for a hosted Alpha deployment. The Alpha is planned as an invite-only Web SaaS test for 3-5 small-B creators. It is not deployed by this repository change.

- [Alpha Deployment](docs/alpha-deployment.md)
- [Vercel Deployment Guide](docs/vercel-deployment-guide.md)
- [Alpha Env Vars](docs/alpha-env-vars.md)
- [Alpha Smoke Test](docs/alpha-smoke-test.md)
- [Alpha Access Policy](docs/alpha-access-policy.md)

## Health Check

`GET /api/health` returns a safe JSON status for app version, storage mode, Supabase configuration booleans, Alpha mode, and timestamp. It does not query business data or expose secrets.

## v0.2 Web App Skeleton

The CE app now includes a runnable Next.js App Router skeleton for the Hairstyle Workflow:

- local creator profile
- dashboard metrics
- service menu
- fan intake workflow
- case management
- tag workbench
- hairstyle rule matching
- Lite Report generator
- Barber Brief generator
- feedback workflow
- Candidate Knowledge Queue

All records are stored in browser localStorage and all seed examples are synthetic.

## Supabase Alpha Schema

StyleOS Alpha is designed to reuse the existing ruhang365 Supabase Project while isolating StyleOS business data in a dedicated `styleos` schema.

This repository includes SQL draft files only. They require human review before execution and must not be treated as already-applied migrations.

- [StyleOS Alpha Migration Plan](supabase/STYLEOS_ALPHA_MIGRATION_PLAN.md)
- [Supabase StyleOS Alpha Schema](docs/supabase-styleos-alpha-schema.md)
- [Supabase StyleOS Alpha Safety Checklist](docs/supabase-styleos-alpha-safety-checklist.md)

## Supabase Alpha Preflight

StyleOS Alpha reuses the existing ruhang365 Supabase Project and adds a dedicated `styleos` schema. Before running any SQL, review the preflight pack.

- [Preflight SQL](supabase/styleos-alpha-preflight.sql)
- [Verify SQL](supabase/styleos-alpha-verify.sql)
- [Final Apply Order](supabase/styleos-alpha-final-apply-order.md)
- [Manual Execution Guide](docs/styleos-alpha-manual-execution-guide.md)
- [Risk Register](docs/styleos-alpha-risk-register.md)

## Relationship with styleos-protocol

- `ruhang365/styleos-protocol` is the open standard library.
- `ruhang365/styleos-creator-studio-ce` is the runnable community edition product repository.
- StyleOS Cloud is the planned official hosted service.
- StyleOS Pro is the planned closed advanced knowledge library.

## What This Product Does

- Creator service menu
- Fan intake form
- Case management
- Tag workbench
- Rule card matching
- Lite report generation
- Execution card generation
- Feedback collection
- Candidate Knowledge Queue

## What This Product Does NOT Include

- StyleOS Pro advanced library
- expert model library
- real case database
- payment system
- official certification system
- commercial operations admin
- offline institution network
- real user data

## Why CE Exists

Creator Studio CE exists to help developers and creators understand how StyleOS moves from protocol to product.

Small-B users can self-host CE if they have technical support. Most small-B users are expected to use the future official hosted StyleOS Cloud product for daily work.

## Core Principle

StyleOS does not need to collect personal identity data as its core asset. The durable asset is structured candidate knowledge: feature tags -> styling solution -> execution feedback -> rule evidence.

中文说明：
小 B 商家产生的个人信息不是 StyleOS 要收集的核心资产。真正要沉淀的是“特征标签 -> 造型方案 -> 执行反馈 -> 规则证据”的结构化候选知识。数据进入知识库前必须经过授权、脱敏、结构化和复核。

## Current Scope

The first product definition focuses on the Hairstyle Suitability Workflow:

- fan intake
- hairstyle tags
- hairstyle rule matching
- hairstyle lite report
- barber brief
- feedback
- candidate knowledge queue

## Documentation Map

- [Product](PRODUCT.md)
- [Architecture](ARCHITECTURE.md)
- [MVP Scope](MVP_SCOPE.md)
- [Data Model](DATA_MODEL.md)
- [Open-Core Boundary](OPEN_CORE_BOUNDARY.md)
- [Knowledge Flow](KNOWLEDGE_FLOW.md)
- [Privacy and Data Policy](PRIVACY_AND_DATA_POLICY.md)
- [Roadmap](ROADMAP.md)
- [Contributing](CONTRIBUTING.md)
- [Security](SECURITY.md)
- [Local Development](docs/local-development.md)
- [v0.2 Web App Skeleton](docs/v0.2-web-app-skeleton.md)
- [Supabase StyleOS Alpha Schema](docs/supabase-styleos-alpha-schema.md)
- [Supabase StyleOS Alpha Safety Checklist](docs/supabase-styleos-alpha-safety-checklist.md)
- [StyleOS Alpha Manual Execution Guide](docs/styleos-alpha-manual-execution-guide.md)
- [StyleOS Alpha Risk Register](docs/styleos-alpha-risk-register.md)
- [Supabase Connection](docs/supabase-connection.md)
- [Storage Modes](docs/storage-modes.md)
- [Shareable Cloud Workflow](docs/shareable-cloud-workflow.md)
- [Magic Link Auth](docs/auth-magic-link.md)
- [E2E Testing](docs/e2e-testing.md)
- [Supabase Schema Access Notes](docs/supabase-schema-access-notes.md)
- [v0.2.2 Supabase Connection](docs/v0.2.2-supabase-connection.md)
- [Alpha Deployment](docs/alpha-deployment.md)
- [Alpha Env Vars](docs/alpha-env-vars.md)
- [Alpha Smoke Test](docs/alpha-smoke-test.md)
- [Alpha Access Policy](docs/alpha-access-policy.md)
- [Alpha Creator Onboarding](docs/alpha-creator-onboarding.md)
- [Alpha Operations Checklist](docs/alpha-operations-checklist.md)
- [Alpha Known Limitations](docs/alpha-known-limitations.md)
- [Vercel Deployment Guide](docs/vercel-deployment-guide.md)
- [Supabase Alpha Production Settings](docs/supabase-alpha-production-settings.md)
- [Post-deployment E2E](docs/post-deployment-e2e.md)

## License

This project is licensed under GNU Affero General Public License v3.0.

## Trademark Notice

AGPL-3.0 does not grant rights to use ruhang365, StyleOS, StyleOS Cloud, StyleOS Pro, or StyleOS Certified trademarks.

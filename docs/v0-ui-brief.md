# v0 UI Brief

This brief turns the StyleOS Creator Studio CE PRD into a practical Vercel v0 prompt pack.

Use v0 for UI generation only. Do not ask v0 to redesign the data model, Supabase schema, auth logic, route handlers, or storage adapter contracts.

## Product Context

StyleOS Creator Studio CE is an invite-only hosted Alpha workflow tool for small-B styling creators.

The current module is Hairstyle Workflow only.

The product helps creators move through:

```text
Service -> Intake -> Case -> Tags -> Rules -> Report -> Feedback -> Candidate Knowledge
```

It is a Chinese-first practical consultation tool, not a generic admin dashboard, consumer quiz, marketing landing page, or decorative website.

The product is for China-based users. The default UI language must be Simplified Chinese. English can appear only as secondary terminology where useful, such as `Lite Report`, `Barber Brief`, or `Candidate Knowledge`.

## Current v0 Evaluation Notes

The previous v0 pass improved the visual shell but still missed the product direction:

- too much English remained in user-facing pages
- the app still felt like a SaaS/admin backend
- screenshots were inconsistent with the actual latest source
- some public/user-facing pages were not localized
- the branch included generated artifacts such as screenshots and `tsconfig.tsbuildinfo`

The next v0 pass must correct these issues instead of only polishing cards and navigation.

## Audience

Primary user:

- Chinese hairstyle bloggers
- Chinese image consultants
- beauty and styling creators serving Chinese users
- small styling studios and small-B service providers

Secondary user:

- fan or client opening a public intake or report link, usually on a mobile device

Operator:

- maintainer checking setup, health, and Alpha readiness

## Design Goal

Make the hosted Alpha feel usable for 3-5 invited Chinese creators.

The product should feel like a tool a creator can use during a consultation. The first screen after login should answer:

- What am I doing now?
- How do I start a hairstyle consultation?
- Which case needs my next action?
- Where do I copy or open the intake/report link?
- What output can I give to the client or hairstylist?

The UI should reduce confusion around:

- what to do first
- where to create a service
- where to find the intake link
- how to process a case
- when a report is delivered
- how feedback becomes Candidate Knowledge

## Visual Direction

Use a quiet practical-tool interface:

- Chinese-first labels and helper copy
- task-first home page, not metric-first dashboard
- guided 5-step consultation workflow
- one obvious next action per page
- service link and report link copy/open controls
- scan-friendly case cards
- readable intake/report/feedback forms
- practical empty states
- calm neutral palette with restrained accent colors
- mobile-friendly public intake/report/feedback pages
- optional desktop left navigation, but do not make the product feel like an admin system
- no decorative hero section
- no gradient-orb background
- no oversized marketing layout
- no consumer quiz styling
- no CRM/admin/pricing/team workspace styling

Cards should be used for individual items or bounded work surfaces only. Do not nest cards inside cards.

## Recommended UI System

Use:

- Next.js App Router
- React
- TypeScript
- the existing route structure
- the existing data and storage calls
- existing CSS/component conventions where possible
- lucide-style icons only if helpful

Do not add:

- broad UI dependencies without explicit review
- payment UI
- AI chat UI
- photo upload UI
- CRM/team/workspace UI
- pricing page
- public signup page
- screenshots or generated build cache files

## Pages to Redesign First

### 1. `/login`

Goal: invite-only Alpha login.

Must show:

- StyleOS Creator Studio CE product name
- invite-only Alpha status
- email magic link form
- safe error state for non-allowlisted users
- logged-in state with sign out

Do not show:

- API keys
- Supabase implementation details
- public signup promise

### 2. `/dashboard`

Goal: creator home and workflow overview.

Must show:

- current workflow status
- metrics for services, cases, reports, feedback, candidates
- next recommended action
- quick links to Services, Cases, Candidate Queue, Setup
- clear empty state when there is no data

Tone: practical operations dashboard.

### 3. `/services`

Goal: service menu management.

Must show:

- service list
- service status
- module
- delivery format
- create service CTA
- empty state

### 4. `/services/[serviceId]`

Goal: service detail and intake sharing.

Must show:

- service overview
- cloud intake link when Supabase Mode is active
- local intake link when Local Mode is active
- copy link affordance
- same-tab open link
- guidance that cross-device links require Supabase Mode

### 5. `/cases`

Goal: case workbench.

Must show:

- case list
- status
- service name
- target scenario
- next action
- empty state

### 6. `/cases/[caseId]`

Goal: case review hub.

Must show:

- intake summary
- target scenario
- current concern
- styling goal
- constraints
- workflow step links: Tags, Rules, Report
- current status

### 7. `/cases/[caseId]/tags`

Goal: tag review.

Must show:

- generated tags
- tag group
- confidence
- rationale
- save action

### 8. `/cases/[caseId]/rules`

Goal: rule selection.

Must show:

- matched rules
- match reasons
- selected rule count
- save selected rules action

### 9. `/cases/[caseId]/report`

Goal: report and Barber Brief delivery.

Must show:

- Lite Report panel
- Barber Brief panel
- generate actions
- save action
- mark delivered action
- share link once report exists

### 10. `/reports/[shareToken]`

Goal: public fan-facing shared report.

Must show:

- report markdown
- Barber Brief
- feedback CTA

No login required.

### 11. `/feedback/[shareToken]`

Goal: public fan feedback.

Must show:

- score
- usefulness fields
- anonymized learning consent checkbox
- submit button
- success state

### 12. `/knowledge/candidates`

Goal: Candidate Knowledge review queue.

Must show:

- candidate list
- consent status
- anonymization status
- evidence level
- source case traceability
- recommendation summary
- public rule candidate / Pro candidate states

## Component Ideas

v0 can generate these as reusable UI pieces:

- `AppShell`
- `PageHeader`
- `WorkflowStepper`
- `StatusBadge`
- `MetricStrip`
- `NextActionPanel`
- `EmptyState`
- `ServiceCard`
- `CaseTable`
- `IntakeSummary`
- `RuleMatchCard`
- `ReportPreview`
- `BarberBriefPanel`
- `ConsentStatusBadge`
- `CandidateKnowledgeCard`
- `SetupStatusGrid`

## Copy Rules

Default UI language: Simplified Chinese.

Use product language:

- 创作者 / 造型顾问
- 发型咨询
- 服务链接
- 采集信息
- 案例
- 发型标签
- 发型规则
- 顾客报告 / Lite Report
- 理发师沟通卡 / Barber Brief
- 顾客反馈
- 候选知识 / Candidate Knowledge
- 授权同意

Avoid technical language in user-facing UI:

- schema
- RLS
- service role
- storage adapter
- Supabase table
- JSONB
- migration
- dashboard
- workspace
- admin

Operator-only pages such as `/setup` may show configuration booleans, but never secrets.

If bilingual support is included, keep it simple:

- default language: Chinese
- optional toggle: `中文 / English`
- store preference locally only
- do not add new API routes, database tables, or external translation services

## Data Safety Rules

Do not design fields for:

- raw photo upload
- phone number
- WeChat ID
- ID card
- address
- payment
- real identity verification

Feedback consent must be a separate visible checkbox.

Candidate Knowledge must describe abstracted learning, not personal identity data.

## v0 Prompt - Round 2

Use this prompt in v0:

```text
You are redesigning the UI for StyleOS Creator Studio CE.

Important product direction:
This is a Chinese-first practical hairstyle consultation tool for small-B creators in China. It must NOT feel like a generic SaaS admin dashboard, CRM, analytics backend, or documentation site.

Default language:
Simplified Chinese.

Optional:
You may include a lightweight `中文 / English` language toggle if it is UI-only and does not add database tables, API routes, external translation services, or auth changes.

Product context:
StyleOS Creator Studio CE helps a hairstyle creator complete a consultation workflow:

1. 创建或选择发型咨询服务
2. 分享采集链接
3. 顾客提交结构化采集信息
4. 创作者处理案例
5. 生成发型标签
6. 匹配发型规则
7. 生成顾客报告 Lite Report
8. 生成理发师沟通卡 Barber Brief
9. 收集顾客反馈
10. 在授权后提炼候选知识 Candidate Knowledge

Core feeling:
It should feel like a focused work tool that a creator can use while serving a client. The main screen should make the next action obvious. Do not lead with analytics metrics. Do not make the first screen feel like a backend control panel.

Visual direction:
- quiet, professional, practical
- Chinese-first page titles, labels, buttons, helper copy, empty states, and errors
- task-first home page centered on “开始发型咨询” and “继续处理案例”
- guided 5-step workflow: 采集信息 -> 生成标签 -> 匹配规则 -> 生成报告 -> 收集反馈/提炼知识
- mobile-friendly public pages for intake, report, and feedback
- desktop creator pages can use navigation, but avoid admin words like Dashboard, Workspace, Admin, CRM
- use restrained colors, readable forms, clear status chips, and one primary action per page
- no decorative hero, no gradient orb background, no pricing page, no public signup page

Recommended Chinese labels:
- 发型咨询
- 开始咨询
- 继续处理
- 服务链接
- 复制链接
- 在本页打开
- 采集信息
- 咨询案例
- 生成发型标签
- 匹配发型规则
- 生成顾客报告
- 生成理发师沟通卡
- 标记已交付
- 收集反馈
- 提炼候选知识
- 设置

Pages to design:
- /login: invite-only Alpha login, Chinese magic-link form, safe non-allowlist error, signed-in state
- /dashboard: rename visually to 发型咨询工作台 or 今日咨询, not Dashboard; show start/continue actions before metrics
- /services: 服务链接 page for creating and sharing intake links
- /services/[serviceId]: service detail with full URL text field, copy link, same-tab open link, local/cloud link explanation
- /intake/[token]: public mobile-first 顾客采集 form; no login; no photo upload; no phone/wechat/id_card/address/email fields
- /cases: 咨询案例 page with filters and next action per case
- /cases/[caseId]: case review hub with intake summary and guided workflow stepper
- /cases/[caseId]/tags: tag generation/review page
- /cases/[caseId]/rules: rule matching/selection page
- /cases/[caseId]/report: report and Barber Brief editor/delivery page
- /reports/[shareToken]: public shared report page, mobile-friendly, no login
- /feedback/[shareToken]: public feedback page with separate anonymized-learning consent checkbox
- /knowledge/candidates: 候选知识 page, abstracted learning review, consent status, source case traceability
- /setup: secondary settings/status page; keep technical details away from normal creator workflow

Do not change:
- Supabase schema
- auth logic
- storage adapter contracts
- public API route behavior
- token generation
- E2E cleanup logic
- route paths
- privacy/data safety rules

Do not add:
- payment
- AI chat
- photo upload
- public signup
- team/workspace model
- CRM
- pricing page
- new modules
- database migrations
- SQL files
- screenshots
- tsconfig.tsbuildinfo
- secrets or environment files

Do not expose:
- Supabase URL/key/secret
- service role key
- JWT/token
- email/user id
- database implementation details

Acceptance target:
After this UI pass, a Chinese small-B creator should understand within 10 seconds:
1. this is a hairstyle consultation tool
2. how to start a consultation
3. where to process cases
4. what output is produced for the client and hairstylist
5. where feedback becomes reusable knowledge
```

## v0 Prompt - Round 3 Targeted Fix

Use this prompt after Round 2 if v0 has already created a task-first dashboard but still leaves English/admin surfaces elsewhere:

```text
Continue from the current `styleos-ui-design` branch.

Do NOT redesign the whole app again.
Keep the current task-first dashboard direction:
- “发型咨询”
- “开始发型咨询”
- “继续处理案例”
- “开始采集”
- “进行中的咨询”
- guided 5-step consultation flow

Your job is to finish the remaining Chinese-first practical-tool pass and clean up generated artifacts.

Current problems to fix:
1. `/dashboard` direction is now close to correct. Preserve it.
2. `/login` is still English and sometimes appears as an unstyled old page.
3. `/setup` is still English and too technical for normal creators.
4. `/reports/[reportId]` is still English.
5. `/feedback/[reportId]` is still English.
6. `/knowledge/candidates` is still English and reads like a backend queue.
7. `src/app/layout.tsx` still uses `html lang="en"` and English metadata.
8. `src/app/layout.tsx` imports `Inter` with only latin subset. This is not suitable as the primary Chinese UI font.
9. Seed/sample UI still exposes English strings such as `synthetic_user_dvcd`, `Hairstyle Suitability Card`, and English intake examples.
10. The branch includes screenshots and `tsconfig.tsbuildinfo`. These must not be committed.

Required fixes:

1. Language and metadata
- Set the app document language to `zh-CN`.
- Use Chinese-first metadata.
- Remove `next/font/google` Inter unless you configure a Chinese-appropriate system font stack without external font fetching.
- Prefer a local system font stack:
  `-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", "Segoe UI", sans-serif`.

2. `/login`
- Make the page fully Chinese-first.
- Use title like `内测登录` or `创作者登录`.
- Explain invite-only Alpha in plain Chinese.
- Keep magic link login.
- Keep safe allowlist error.
- Keep signed-in state and sign out.
- Do not expose Supabase implementation details, keys, email values, user ids, tokens, or env status.

3. `/setup`
- Make it a secondary `设置` page, not a developer dashboard.
- Creator-facing labels should be Chinese.
- Technical booleans may remain, but they should be grouped under `连接状态` or `运行状态`.
- Do not show secrets or actual env values.
- Keep setup useful but visually secondary.

4. `/reports/[reportId]`
- Make it a mobile-friendly public `顾客报告` page.
- No login required.
- Chinese empty/error states.
- Show Lite Report and Barber Brief clearly as:
  - `顾客报告`
  - `理发师沟通卡`
- Feedback CTA should be Chinese, such as `提交反馈`.
- Do not expose creator private fields or internal implementation details.

5. `/feedback/[reportId]`
- Make it a mobile-friendly public `反馈` page.
- Fully Chinese labels, helper text, empty/error/success states.
- The anonymized learning consent checkbox must be separate and visible.
- Do not add phone, WeChat, email, address, ID card, photo upload, or payment fields.

6. `/knowledge/candidates`
- Rename visually to `候选知识`.
- Explain in Chinese that this stores abstracted feature-solution-feedback patterns, not personal identity.
- Buttons should be Chinese:
  - `从反馈案例提炼`
  - `查看案例`
  - `标记为公共规则候选`
  - `标记为 Pro 候选`
- Consent, anonymization, evidence, and review status should be readable in Chinese.
- Keep denied-consent protections unchanged.

7. Sample and empty-state copy
- Local seed examples shown in UI should be Chinese or neutral synthetic labels.
- Avoid showing English sample values in primary UI.
- Prefer labels like:
  - `体验顾客`
  - `通勤与会议场景`
  - `希望轮廓更清爽，减少下颌线压迫感`
  - `有限打理时间`
- Do not use real names, phone numbers, WeChat IDs, emails, addresses, ID cards, or raw photo references.

8. Generated artifacts cleanup
- Remove all screenshot files from the branch:
  - `home.png`
  - `dash.png`
  - `dash2.png`
  - `dash3.png`
  - `login.png`
  - `services.png`
  - `cases.png`
  - `detail.png`
  - `candidates.png`
  - `wb.png`
- Remove `tsconfig.tsbuildinfo`.
- Add `tsconfig.tsbuildinfo` to `.gitignore` if not already ignored.
- Do not add new screenshots or build cache files.

9. Keep boundaries
Do not change:
- Supabase schema
- auth logic
- storage adapter contracts
- API route behavior
- token generation
- E2E cleanup logic
- route paths
- privacy rules

Do not add:
- payment
- AI chat
- photo upload
- public signup
- CRM
- team/workspace model
- pricing page
- new modules
- SQL files
- migrations
- env files
- secrets

Acceptance criteria:
- `/dashboard` remains task-first and practical.
- `/login`, `/setup`, `/reports/[reportId]`, `/feedback/[reportId]`, and `/knowledge/candidates` are Chinese-first.
- Public report and feedback pages are mobile-friendly.
- `html lang` is `zh-CN`.
- Metadata is Chinese-first.
- No screenshots are committed.
- `tsconfig.tsbuildinfo` is removed and ignored.
- No secrets or env values are exposed.
- No sensitive personal-data fields are added.
- No backend, auth, Supabase, API, storage, token, or schema behavior is changed.
- `npm run build` passes.
```

## Integration Rules for Codex

When integrating v0 output:

1. Keep existing route paths.
2. Keep existing storage adapter calls.
3. Keep existing Supabase helper files.
4. Keep existing API routes.
5. Keep Local Mode working.
6. Keep Supabase Mode working.
7. Run `npm run build`.
8. Run `NEXT_PUBLIC_STORAGE_MODE=local npm run build`.
9. Run hosted health check.
10. Run hosted synthetic E2E after deployment.

## Acceptance Criteria

The v0 UI pass is acceptable when:

- all core pages remain reachable through navigation
- core user-facing UI is Chinese-first
- the product no longer reads like a generic admin backend
- `/dashboard` is visually a consultation workbench, not a metric dashboard
- public intake/report/feedback pages are mobile-friendly
- no page white screens
- no TypeScript build errors
- no new secret exposure
- no new sensitive data fields
- no screenshots or build cache artifacts are committed
- Local Mode still works
- Supabase Mode still works
- Hosted synthetic E2E still passes and cleans up

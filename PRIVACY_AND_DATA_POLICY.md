# Privacy and Data Policy

StyleOS Creator Studio CE should collect only what is necessary for the service workflow.

## Core Principles

1. Do not collect unnecessary personal data.
2. Raw photos are not the core knowledge asset.
3. Personal information must not enter public repositories.
4. Candidate knowledge must be anonymized.
5. User consent is required before reuse.
6. Small-B creators must not upload real user data to public GitHub issues.
7. Pro candidate knowledge requires stricter review and authorization.

## Alpha Supabase Guardrails

StyleOS Alpha must not store:

- raw photos
- ID card numbers
- phone numbers
- WeChat IDs
- addresses
- database secrets
- service role keys

Candidate knowledge may only store abstracted feature-solution-outcome mapping. User personal information is not the core asset of StyleOS.

## v0.2.2 CE Privacy Boundary

Raw photos are not stored in current CE v0.2.2.

Personal identity data is not the core knowledge asset. The app must not collect or preserve phone numbers, WeChat IDs, ID card numbers, addresses, emails, or raw photos in StyleOS business tables.

CandidateKnowledge stores abstracted feature-solution-outcome mapping.

Consent is required before anonymized reuse. If feedback does not grant `consent_to_anonymized_learning`, candidate knowledge must use `consent_status=denied` and must not be marked as `pro_candidate`.

## Alpha Phase Data Principles

The hosted Alpha must use synthetic or low-risk test data first.

- Do not upload photos.
- Do not collect sensitive personal information.
- Do not enter phone numbers, WeChat IDs, ID card numbers, addresses, emails, payment records, or private messages.
- Candidate Knowledge may only store abstract feature-solution-outcome structure.
- Alpha testers must not upload real sensitive materials.
- Public feedback and GitHub issues must use sanitized examples only.

## 中文核心原则

1. 不收集不必要的个人数据。
2. 原始照片不是核心知识资产。
3. 个人信息不能进入公开仓库。
4. 候选知识必须脱敏。
5. 复用前必须获得用户授权。
6. 小 B 创作者不能把真实用户数据上传到公开 GitHub issue。
7. Pro 候选知识需要更严格的复核和授权。

## Alpha Supabase 中文边界

StyleOS Alpha 不保存 raw photo，不保存身份证、手机号、微信号、地址。`candidate_knowledge` 只保存抽象后的“特征标签 -> 造型方案 -> 执行反馈 -> 规则证据”映射。

用户个人信息不是 StyleOS 的核心资产。

## Public Repository Rule

Public examples must be synthetic. Do not submit:

- real user photos
- real names
- contact details
- ID card numbers
- phone numbers
- WeChat IDs
- addresses
- private messages
- unauthorized cases
- payment records
- private service records

## Candidate Knowledge Rule

Candidate knowledge may only store abstracted mappings:

- feature tags
- recommendation summary
- execution feedback
- creator feedback
- evidence level
- review status

It must not store identity data as reusable knowledge.

# StyleOS Creator Studio CE

Open-source community edition of StyleOS Creator Studio, a workflow tool for AI-powered personal styling services.

中文说明：
StyleOS Creator Studio CE 是入行365 StyleOS 的开源社区版小 B 工作台，帮助造型、穿搭、形象、发型、美妆创作者把粉丝咨询转化为结构化服务、Lite Report 和可复用知识。

This repository is a product-definition repository first. It defines the runnable product architecture and workflow before implementation starts.

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

## License

This project is licensed under GNU Affero General Public License v3.0.

## Trademark Notice

AGPL-3.0 does not grant rights to use ruhang365, StyleOS, StyleOS Cloud, StyleOS Pro, or StyleOS Certified trademarks.

import type { CaseStatus, ReviewStatus, ServiceStatus } from "@/types";

type Status = CaseStatus | ServiceStatus | ReviewStatus | "draft" | "delivered" | "pending" | "starter" | "unverified";

const successStatuses: Status[] = ["active", "delivered", "feedback_received", "candidate_extracted", "public_rule_candidate", "pro_candidate"];
const warningStatuses: Status[] = ["draft", "intake_submitted", "tagging", "rule_matching", "report_draft", "pending", "starter", "unverified"];
const dangerStatuses: Status[] = ["paused", "rejected", "archived"];

const labelMap: Partial<Record<Status, string>> = {
  intake_submitted: "已采集",
  tagging: "标签中",
  rule_matching: "规则匹配",
  report_draft: "报告草稿",
  creator_review: "待审阅",
  delivered: "已交付",
  feedback_received: "已反馈",
  candidate_extracted: "已提炼",
  archived: "已归档",
  active: "启用中",
  paused: "已暂停",
  draft: "草稿",
  pending: "待处理",
  starter: "入门",
  unverified: "未验证",
  public_rule_candidate: "公共规则候选",
  pro_candidate: "Pro 候选",
  rejected: "已拒绝"
};

export default function StatusBadge({ status }: { status: Status }) {
  const tone = successStatuses.includes(status)
    ? "success"
    : warningStatuses.includes(status)
      ? "warning"
      : dangerStatuses.includes(status)
        ? "danger"
        : "neutral";

  return <span className={`status ${tone}`}>{labelMap[status] ?? status.replaceAll("_", " ")}</span>;
}

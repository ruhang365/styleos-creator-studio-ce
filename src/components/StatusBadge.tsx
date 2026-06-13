import type { CaseStatus, ReviewStatus, ServiceStatus } from "@/types";

type Status = CaseStatus | ServiceStatus | ReviewStatus | "draft" | "delivered" | "pending" | "starter" | "unverified";

const successStatuses: Status[] = ["active", "delivered", "feedback_received", "candidate_extracted", "public_rule_candidate", "pro_candidate"];
const warningStatuses: Status[] = ["draft", "intake_submitted", "tagging", "rule_matching", "report_draft", "pending", "starter", "unverified"];
const dangerStatuses: Status[] = ["paused", "rejected", "archived"];

export default function StatusBadge({ status }: { status: Status }) {
  const tone = successStatuses.includes(status)
    ? "success"
    : warningStatuses.includes(status)
      ? "warning"
      : dangerStatuses.includes(status)
        ? "danger"
        : "neutral";

  return <span className={`status ${tone}`}>{status.replaceAll("_", " ")}</span>;
}

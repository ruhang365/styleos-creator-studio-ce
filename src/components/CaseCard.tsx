import Link from "next/link";
import type { FanCase } from "@/types";
import StatusBadge from "@/components/StatusBadge";

function nextAction(status: FanCase["status"]) {
  const map: Record<FanCase["status"], string> = {
    intake_submitted: "Generate tags",
    tagging: "Match rules",
    rule_matching: "Generate report",
    report_draft: "Mark delivered",
    delivered: "Collect feedback",
    feedback_received: "Extract candidate knowledge",
    candidate_extracted: "Review candidate"
  };
  return map[status];
}

export default function CaseCard({ caseItem }: { caseItem: FanCase }) {
  return (
    <article className="card">
      <div className="card-row">
        <div>
          <h3>{caseItem.fanNickname}</h3>
          <p className="muted">{caseItem.serviceName}</p>
        </div>
        <StatusBadge status={caseItem.status} />
      </div>
      <p>{caseItem.targetScenario}</p>
      <p className="muted">Next action: {nextAction(caseItem.status)}</p>
      <p className="muted">Updated: {new Date(caseItem.updatedAt).toLocaleString()}</p>
      <Link className="button" href={`/cases/${caseItem.caseId}`}>
        Open Case
      </Link>
    </article>
  );
}

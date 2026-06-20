import Link from "next/link";
import type { FanCase } from "@/types";
import StatusBadge from "@/components/StatusBadge";

function nextAction(status: FanCase["status"]) {
  const map: Record<FanCase["status"], string> = {
    intake_submitted: "生成发型标签",
    tagging: "匹配发型规则",
    rule_matching: "生成顾客报告",
    report_draft: "标记为已交付",
    creator_review: "审阅报告",
    delivered: "收集反馈",
    feedback_received: "提炼知识候选",
    candidate_extracted: "审阅候选知识",
    archived: "已归档"
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
      <p className="muted">下一步：{nextAction(caseItem.status)}</p>
      <p className="muted">更新于：{new Date(caseItem.updatedAt).toLocaleString("zh-CN")}</p>
      <Link className="button" href={`/cases/${caseItem.caseId}`}>
        打开案例
      </Link>
    </article>
  );
}

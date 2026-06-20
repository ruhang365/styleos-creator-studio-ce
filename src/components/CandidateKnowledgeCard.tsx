import type { CandidateKnowledge } from "@/types";
import StatusBadge from "@/components/StatusBadge";

interface CandidateKnowledgeCardProps {
  candidate: CandidateKnowledge;
  onStatusChange?: (candidateId: string, action: "public" | "pro" | "reject" | "archive") => void;
}

export default function CandidateKnowledgeCard({ candidate, onStatusChange }: CandidateKnowledgeCardProps) {
  const proDisabled = candidate.consent_status !== "granted";
  const consentLabel = candidate.consent_status === "granted" ? "已授权" : candidate.consent_status === "denied" ? "未授权" : "未知";
  const anonymizationLabel =
    candidate.anonymization_status === "anonymized"
      ? "已脱敏"
      : candidate.anonymization_status === "rejected"
        ? "脱敏不通过"
        : "待脱敏";

  return (
    <article className="card">
      <div className="card-row">
        <div>
          <h3>候选知识 {candidate.candidate_id}</h3>
          <p className="muted">来源案例：{candidate.source_case_id}</p>
        </div>
        <StatusBadge status={candidate.review_status} />
      </div>
      <p>
        <strong>特征标签：</strong>
        {candidate.feature_tags.join(", ") || "暂无"}
      </p>
      <p>{candidate.recommendation_summary}</p>
      <p className="muted">执行反馈：{candidate.execution_feedback || candidate.execution_card_summary}</p>
      <p className="muted">
        评分：{candidate.user_feedback_score} / 授权：{consentLabel} / 脱敏：{anonymizationLabel} / 证据等级：
        {candidate.evidence_level}
      </p>
      {onStatusChange ? (
        <div className="actions">
          <button className="button" onClick={() => onStatusChange(candidate.candidate_id, "public")} type="button">
            标记为公共规则候选
          </button>
          <button className="button" disabled={proDisabled} onClick={() => onStatusChange(candidate.candidate_id, "pro")} type="button">
            标记为 Pro 候选
          </button>
          <button className="button" onClick={() => onStatusChange(candidate.candidate_id, "reject")} type="button">
            标记不通过
          </button>
          <button className="button ghost" onClick={() => onStatusChange(candidate.candidate_id, "archive")} type="button">
            归档
          </button>
        </div>
      ) : null}
    </article>
  );
}

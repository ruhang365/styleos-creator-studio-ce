import type { CandidateKnowledge } from "@/types";
import StatusBadge from "@/components/StatusBadge";

interface CandidateKnowledgeCardProps {
  candidate: CandidateKnowledge;
  onStatusChange?: (candidateId: string, action: "public" | "pro" | "reject" | "archive") => void;
}

export default function CandidateKnowledgeCard({ candidate, onStatusChange }: CandidateKnowledgeCardProps) {
  const proDisabled = candidate.consent_status !== "granted";

  return (
    <article className="card">
      <div className="card-row">
        <div>
          <h3>{candidate.candidate_id}</h3>
          <p className="muted">Source case: {candidate.source_case_id}</p>
        </div>
        <StatusBadge status={candidate.review_status} />
      </div>
      <p>
        <strong>Mapping:</strong> {candidate.feature_tags.join(", ")}
      </p>
      <p>{candidate.recommendation_summary}</p>
      <p className="muted">Execution feedback: {candidate.execution_feedback || candidate.execution_card_summary}</p>
      <p className="muted">Score: {candidate.user_feedback_score} / Consent: {candidate.consent_status}</p>
      {onStatusChange ? (
        <div className="actions">
          <button className="button" onClick={() => onStatusChange(candidate.candidate_id, "public")} type="button">
            Mark Public Rule Candidate
          </button>
          <button className="button" disabled={proDisabled} onClick={() => onStatusChange(candidate.candidate_id, "pro")} type="button">
            Mark Pro Candidate
          </button>
          <button className="button" onClick={() => onStatusChange(candidate.candidate_id, "reject")} type="button">
            Reject
          </button>
          <button className="button ghost" onClick={() => onStatusChange(candidate.candidate_id, "archive")} type="button">
            Archive
          </button>
        </div>
      ) : null}
    </article>
  );
}

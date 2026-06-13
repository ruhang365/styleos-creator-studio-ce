"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import TagChip from "@/components/TagChip";
import { extractCandidateKnowledge } from "@/lib/candidateKnowledge";
import {
  getCandidateKnowledge,
  getCases,
  getFeedback,
  getReports,
  saveCandidateKnowledge,
  saveCases,
  seedInitialData
} from "@/lib/storage";
import { nowIso } from "@/lib/ids";
import type { CandidateKnowledge, FanCase, Feedback, LiteReport } from "@/types";

export default function CaseDetailPage() {
  const params = useParams();
  const caseId = String(params.caseId ?? "");
  const [caseItem, setCaseItem] = useState<FanCase | null>(null);
  const [report, setReport] = useState<LiteReport | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [candidate, setCandidate] = useState<CandidateKnowledge | null>(null);
  const [message, setMessage] = useState("");

  const refresh = () => {
    const cases = getCases();
    const foundCase = cases.find((item) => item.caseId === caseId) ?? null;
    setCaseItem(foundCase);
    setReport(foundCase?.reportId ? getReports().find((item) => item.reportId === foundCase.reportId) ?? null : null);
    setFeedback(foundCase?.feedbackId ? getFeedback().find((item) => item.feedbackId === foundCase.feedbackId) ?? null : null);
    setCandidate(
      foundCase?.candidateKnowledgeId
        ? getCandidateKnowledge().find((item) => item.candidate_id === foundCase.candidateKnowledgeId) ?? null
        : null
    );
  };

  useEffect(() => {
    seedInitialData();
    refresh();
  }, [caseId]);

  const extractCandidate = () => {
    if (!caseItem || !report || !feedback) {
      setMessage("Feedback and report are required before extraction.");
      return;
    }
    const existing = getCandidateKnowledge().find((item) => item.source_case_id === caseItem.caseId);
    const candidateItem = existing ?? extractCandidateKnowledge(caseItem, report, feedback);
    const nextCandidates = existing
      ? getCandidateKnowledge().map((item) => (item.candidate_id === existing.candidate_id ? candidateItem : item))
      : [candidateItem, ...getCandidateKnowledge()];
    saveCandidateKnowledge(nextCandidates);
    const nextCases = getCases().map((item) =>
      item.caseId === caseItem.caseId
        ? { ...item, status: "candidate_extracted" as const, candidateKnowledgeId: candidateItem.candidate_id, updatedAt: nowIso() }
        : item
    );
    saveCases(nextCases);
    setMessage("Candidate knowledge extracted as abstract mapping. No nickname, photo, or contact was copied.");
    refresh();
  };

  if (!caseItem) {
    return (
      <AppShell title="Case Detail" description="Case not found.">
        <EmptyState title="Case not found" description="Return to the case list and open a local case." />
      </AppShell>
    );
  }

  return (
    <AppShell title={`Case: ${caseItem.fanNickname}`} description="Intake summary, tags, rule matches, report, feedback, and candidate status.">
      <section className="panel">
        <div className="card-row">
          <div>
            <h2>{caseItem.fanNickname}</h2>
            <p className="muted">{caseItem.targetScenario}</p>
          </div>
          <StatusBadge status={caseItem.status} />
        </div>
        <div className="actions">
          <Link className="button primary" href={`/cases/${caseItem.caseId}/tags`}>
            Go to Tag Workbench
          </Link>
          <Link className="button" href={`/cases/${caseItem.caseId}/rules`}>
            Match Rules
          </Link>
          <Link className="button" href={`/cases/${caseItem.caseId}/report`}>
            Generate Report
          </Link>
          {caseItem.reportId ? (
            <Link className="button" href={`/feedback/${caseItem.reportId}`}>
              View Feedback
            </Link>
          ) : (
            <button className="button" disabled type="button">
              View Feedback
            </button>
          )}
          <button className="button" onClick={extractCandidate} type="button">
            Extract Candidate Knowledge
          </button>
        </div>
      </section>

      {message ? <div className="notice">{message}</div> : null}

      <section className="grid two">
        <article className="panel">
          <h3>Intake summary</h3>
          <p><strong>Goal:</strong> {caseItem.intake.stylingGoal}</p>
          <p><strong>Concern:</strong> {caseItem.intake.currentHairstyleConcern}</p>
          <p><strong>Constraints:</strong> {caseItem.intake.workplaceSchoolConstraints}</p>
        </article>
        <article className="panel">
          <h3>Status summary</h3>
          <p className="muted">Selected tags: {caseItem.tags.length}</p>
          <p className="muted">Matched rules: {caseItem.selectedRuleIds.length}</p>
          <p className="muted">Report status: {report?.status ?? "not generated"}</p>
          <p className="muted">Feedback summary: {feedback ? `${feedback.satisfactionScore}/5` : "not received"}</p>
          <p className="muted">Candidate knowledge: {candidate?.review_status ?? "not extracted"}</p>
        </article>
      </section>

      <section className="panel">
        <h3>Selected tags</h3>
        <div className="chips">
          {caseItem.tags.length > 0 ? caseItem.tags.map((tag) => <TagChip key={tag.tagId} tag={tag} />) : <p className="muted">No tags saved yet.</p>}
        </div>
      </section>
    </AppShell>
  );
}

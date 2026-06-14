"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import TagChip from "@/components/TagChip";
import { extractCandidateKnowledge } from "@/lib/candidateKnowledge";
import { getStorageAdapter } from "@/lib/storage";
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
  const [isLoading, setIsLoading] = useState(true);

  const refresh = async () => {
    const storage = getStorageAdapter();
    const [foundCase, reports, feedbackItems, candidates] = await Promise.all([
      storage.getCaseById(caseId),
      storage.listReports(),
      storage.listFeedback(),
      storage.listCandidateKnowledge()
    ]);
    setCaseItem(foundCase);
    setReport(foundCase ? reports.find((item) => item.reportId === foundCase.reportId || item.caseId === foundCase.caseId) ?? null : null);
    setFeedback(
      foundCase ? feedbackItems.find((item) => item.feedbackId === foundCase.feedbackId || item.caseId === foundCase.caseId) ?? null : null
    );
    const candidateForCase = foundCase
      ? candidates.find(
          (item) => item.candidate_id === foundCase.candidateKnowledgeId || item.source_case_id === foundCase.caseId
        ) ?? null
      : null;
    setCandidate(candidateForCase);
  };

  useEffect(() => {
    const storage = getStorageAdapter();
    setIsLoading(true);
    storage
      .seedInitialData()
      .then(refresh)
      .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load case."))
      .finally(() => setIsLoading(false));
  }, [caseId]);

  const extractCandidate = async () => {
    if (!caseItem || !report || !feedback) {
      setMessage("Feedback and report are required before extraction.");
      return;
    }
    const storage = getStorageAdapter();
    const candidates = await storage.listCandidateKnowledge();
    const existing = candidates.find((item) => item.source_case_id === caseItem.caseId);
    const candidateItem = existing ?? extractCandidateKnowledge(caseItem, report, feedback);
    const savedCandidate = existing
      ? await storage.updateCandidateKnowledge(existing.candidate_id, candidateItem)
      : await storage.createCandidateKnowledge(candidateItem);
    const now = nowIso();
    await storage.updateCase(caseItem.caseId, {
      status: "candidate_extracted",
      candidateKnowledgeId: savedCandidate.candidate_id,
      updatedAt: now
    });
    setCaseItem({
      ...caseItem,
      status: "candidate_extracted",
      candidateKnowledgeId: savedCandidate.candidate_id,
      updatedAt: now
    });
    setCandidate(savedCandidate);
    setMessage("Candidate knowledge extracted as abstract mapping. No nickname, photo, or contact was copied.");
    await refresh();
  };

  if (!caseItem && isLoading) {
    return (
      <AppShell title="Case Detail" description="Loading case.">
        <EmptyState title="Loading case" description="Loading the cloud fan case for the current creator session." />
      </AppShell>
    );
  }

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

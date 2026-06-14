"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import CandidateKnowledgeCard from "@/components/CandidateKnowledgeCard";
import EmptyState from "@/components/EmptyState";
import { extractCandidateKnowledge } from "@/lib/candidateKnowledge";
import { getStorageMode } from "@/lib/config-public";
import { getStorageAdapter } from "@/lib/storage";
import { nowIso } from "@/lib/ids";
import type { CandidateKnowledge } from "@/types";

export default function CandidateQueuePage() {
  const mode = getStorageMode();
  const [candidates, setCandidates] = useState<CandidateKnowledge[]>([]);
  const [message, setMessage] = useState("");

  const refresh = async () => {
    const storage = getStorageAdapter();
    setCandidates(await storage.listCandidateKnowledge());
  };

  useEffect(() => {
    const storage = getStorageAdapter();
    storage
      .seedInitialData()
      .then(refresh)
      .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load candidate knowledge."));
  }, []);

  const extractFromFeedback = async () => {
    const storage = getStorageAdapter();
    const [cases, reports, feedbackItems, existing] = await Promise.all([
      storage.listCases(),
      storage.listReports(),
      storage.listFeedback(),
      storage.listCandidateKnowledge()
    ]);
    const existingSourceIds = new Set(existing.map((item) => item.source_case_id));

    const nextCandidates = feedbackItems
      .map((feedback) => {
        const caseItem = cases.find((item) => item.caseId === feedback.caseId);
        const report = reports.find((item) => item.reportId === feedback.reportId);
        if (!caseItem || !report || existingSourceIds.has(caseItem.caseId)) {
          return null;
        }
        return extractCandidateKnowledge(caseItem, report, feedback);
      })
      .filter((item): item is CandidateKnowledge => Boolean(item));

    if (nextCandidates.length === 0) {
      setMessage("No new feedback case is ready for extraction.");
      return;
    }

    const savedCandidates = await Promise.all(nextCandidates.map((candidate) => storage.createCandidateKnowledge(candidate)));
    await Promise.all(
      savedCandidates.map((candidate) =>
        storage.updateCase(candidate.source_case_id, {
          candidateKnowledgeId: candidate.candidate_id,
          status: "candidate_extracted",
          updatedAt: nowIso()
        })
      )
    );
    setMessage(`Extracted ${nextCandidates.length} candidate knowledge item(s).`);
    await refresh();
  };

  const updateStatus = async (candidateId: string, action: "public" | "pro" | "reject" | "archive") => {
    const storage = getStorageAdapter();
    const candidate = candidates.find((item) => item.candidate_id === candidateId);
    if (!candidate) {
      return;
    }
    if (action === "pro" && candidate.consent_status !== "granted") {
      setMessage("Consent is required before marking a candidate as pro_candidate.");
      return;
    }

    const updates =
      action === "public"
        ? {
            public_rule_candidate: true,
            pro_candidate: false,
            review_status: "public_rule_candidate" as const,
            updatedAt: nowIso()
          }
        : action === "pro"
          ? {
              public_rule_candidate: false,
              pro_candidate: true,
              review_status: "pro_candidate" as const,
              updatedAt: nowIso()
            }
          : {
              public_rule_candidate: false,
              pro_candidate: false,
              review_status: action === "reject" ? ("rejected" as const) : ("archived" as const),
              updatedAt: nowIso()
            };

    await storage.updateCandidateKnowledge(candidateId, updates);
    await refresh();
  };

  return (
    <AppShell title="Candidate Knowledge Queue" description={`Abstract ${mode === "supabase" ? "cloud" : "local"} feedback cases into reviewable knowledge candidates.`}>
      <section className="page-header">
        <div>
          <h2>Candidate Knowledge Queue</h2>
          <p>
            CandidateKnowledge does not save real names, photos, or contacts. It stores abstract feature tags, recommendation summary,
            execution feedback, and review status.
          </p>
        </div>
        <button className="button primary" onClick={extractFromFeedback} type="button">
          Extract from feedback case
        </button>
      </section>

      {message ? <div className="notice">{message}</div> : null}

      {candidates.length === 0 ? (
        <EmptyState
          title="No candidates yet"
          description="Deliver a report, collect feedback, then extract a candidate knowledge item."
          action={
            <Link className="button" href="/cases">
              View Cases
            </Link>
          }
        />
      ) : (
        <section className="list">
          {candidates.map((candidate) => (
            <CandidateKnowledgeCard candidate={candidate} key={candidate.candidate_id} onStatusChange={updateStatus} />
          ))}
        </section>
      )}
    </AppShell>
  );
}

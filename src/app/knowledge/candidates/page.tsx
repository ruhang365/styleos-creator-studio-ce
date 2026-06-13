"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import CandidateKnowledgeCard from "@/components/CandidateKnowledgeCard";
import EmptyState from "@/components/EmptyState";
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
import type { CandidateKnowledge } from "@/types";

export default function CandidateQueuePage() {
  const [candidates, setCandidates] = useState<CandidateKnowledge[]>([]);
  const [message, setMessage] = useState("");

  const refresh = () => {
    setCandidates(getCandidateKnowledge());
  };

  useEffect(() => {
    seedInitialData();
    refresh();
  }, []);

  const extractFromFeedback = () => {
    const cases = getCases();
    const reports = getReports();
    const feedbackItems = getFeedback();
    const existing = getCandidateKnowledge();
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

    saveCandidateKnowledge([...nextCandidates, ...existing]);
    saveCases(
      cases.map((caseItem) => {
        const extracted = nextCandidates.find((candidate) => candidate.source_case_id === caseItem.caseId);
        return extracted
          ? { ...caseItem, candidateKnowledgeId: extracted.candidate_id, status: "candidate_extracted" as const, updatedAt: nowIso() }
          : caseItem;
      })
    );
    setMessage(`Extracted ${nextCandidates.length} candidate knowledge item(s).`);
    refresh();
  };

  const updateStatus = (candidateId: string, action: "public" | "pro" | "reject" | "archive") => {
    const nextCandidates = getCandidateKnowledge().map((candidate) => {
      if (candidate.candidate_id !== candidateId) {
        return candidate;
      }
      if (action === "public") {
        return {
          ...candidate,
          public_rule_candidate: true,
          pro_candidate: false,
          review_status: "public_rule_candidate" as const,
          updatedAt: nowIso()
        };
      }
      if (action === "pro") {
        return {
          ...candidate,
          public_rule_candidate: false,
          pro_candidate: true,
          review_status: "pro_candidate" as const,
          updatedAt: nowIso()
        };
      }
      return {
        ...candidate,
        public_rule_candidate: false,
        pro_candidate: false,
        review_status: action === "reject" ? ("rejected" as const) : ("archived" as const),
        updatedAt: nowIso()
      };
    });
    saveCandidateKnowledge(nextCandidates);
    setCandidates(nextCandidates);
  };

  return (
    <AppShell title="Candidate Knowledge Queue" description="Abstract feedback cases into reviewable knowledge candidates.">
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

"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import EmptyState from "@/components/EmptyState";
import FeedbackForm from "@/components/FeedbackForm";
import { createId, nowIso } from "@/lib/ids";
import { getCases, getFeedback, getReports, saveCases, saveFeedback, seedInitialData } from "@/lib/storage";
import type { FanCase, Feedback, LiteReport } from "@/types";

type FeedbackDraft = Omit<Feedback, "feedbackId" | "reportId" | "caseId" | "createdAt">;

export default function FeedbackPage() {
  const params = useParams();
  const reportId = String(params.reportId ?? "");
  const [report, setReport] = useState<LiteReport | null>(null);
  const [caseItem, setCaseItem] = useState<FanCase | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    seedInitialData();
    const foundReport = getReports().find((item) => item.reportId === reportId) ?? null;
    setReport(foundReport);
    setCaseItem(foundReport ? getCases().find((item) => item.caseId === foundReport.caseId) ?? null : null);
  }, [reportId]);

  const submit = (draft: FeedbackDraft) => {
    if (!report || !caseItem) {
      return;
    }
    const feedback: Feedback = {
      feedbackId: createId("feedback"),
      reportId: report.reportId,
      caseId: caseItem.caseId,
      createdAt: nowIso(),
      ...draft
    };
    saveFeedback([feedback, ...getFeedback().filter((item) => item.reportId !== report.reportId)]);
    saveCases(
      getCases().map((item) =>
        item.caseId === caseItem.caseId
          ? { ...item, feedbackId: feedback.feedbackId, status: "feedback_received" as const, updatedAt: nowIso() }
          : item
      )
    );
    setMessage("Feedback saved. Case status is now feedback_received.");
  };

  if (!report || !caseItem) {
    return (
      <AppShell title="Feedback" description="Report not found.">
        <EmptyState title="Report not found" description="Generate and save a report before collecting feedback." />
      </AppShell>
    );
  }

  return (
    <AppShell title="Feedback" description="Collect lightweight feedback for a local CE report.">
      <section className="panel">
        <h2>{report.title}</h2>
        <p className="muted">Feedback is stored locally and can be abstracted into Candidate Knowledge only after review.</p>
        <Link className="button" href={`/reports/${report.reportId}`}>
          View Report
        </Link>
      </section>
      {message ? (
        <div className="notice">
          {message}{" "}
          <Link href={`/cases/${caseItem.caseId}`}>
            Back to case
          </Link>
        </div>
      ) : null}
      <FeedbackForm onSubmit={submit} />
    </AppShell>
  );
}

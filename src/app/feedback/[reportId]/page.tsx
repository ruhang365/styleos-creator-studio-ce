"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import EmptyState from "@/components/EmptyState";
import FeedbackForm from "@/components/FeedbackForm";
import { nowIso } from "@/lib/ids";
import { getStorageMode } from "@/lib/config-public";
import { getStorageAdapter } from "@/lib/storage";
import type { FanCase, Feedback, LiteReport } from "@/types";

type FeedbackDraft = Omit<Feedback, "feedbackId" | "reportId" | "caseId" | "createdAt">;

export default function FeedbackPage() {
  const params = useParams();
  const reportIdOrToken = String(params.reportId ?? "");
  const mode = getStorageMode();
  const [report, setReport] = useState<LiteReport | null>(null);
  const [caseItem, setCaseItem] = useState<FanCase | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (mode === "supabase") {
      fetch(`/api/reports/${reportIdOrToken}`)
        .then(async (response) => {
          const result = await response.json();
          if (!response.ok) {
            throw new Error(result.error ?? "Unable to load report.");
          }
          return result.report;
        })
        .then((cloudReport) => {
          setReport({
            reportId: cloudReport.id,
            caseId: "",
            title: `Hairstyle Lite Report - ${cloudReport.id.slice(0, 8)}`,
            markdown: cloudReport.markdown ?? "",
            barberBrief: cloudReport.barber_brief ?? "",
            status: cloudReport.status,
            shareToken: reportIdOrToken,
            createdAt: "",
            updatedAt: "",
            deliveredAt: cloudReport.delivered_at ?? undefined
          });
          setCaseItem(null);
        })
        .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load report."));
      return;
    }

    const storage = getStorageAdapter();
    storage
      .seedInitialData()
      .then(() => Promise.all([storage.getReportById(reportIdOrToken), storage.listCases()]))
      .then(([foundReport, cases]) => {
        setReport(foundReport);
        setCaseItem(foundReport ? cases.find((item) => item.caseId === foundReport.caseId) ?? null : null);
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load feedback."));
  }, [mode, reportIdOrToken]);

  const submit = async (draft: FeedbackDraft) => {
    if (!report) {
      return;
    }
    if (mode === "supabase") {
      const response = await fetch(`/api/feedback/${reportIdOrToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...draft,
          consent_to_anonymized_learning: draft.consentToAnonymizedLearning
        })
      });
      const result = await response.json();
      if (!response.ok) {
        setMessage(result.error ?? "Unable to submit feedback.");
        return;
      }
      setMessage("Feedback submitted. The creator can review it before extracting candidate knowledge.");
      return;
    }

    if (!caseItem) {
      return;
    }
    const storage = getStorageAdapter();
    const feedback = await storage.createFeedback({
      reportId: report.reportId,
      caseId: caseItem.caseId,
      ...draft
    });
    await storage.updateCase(caseItem.caseId, { feedbackId: feedback.feedbackId, status: "feedback_received", updatedAt: nowIso() });
    setMessage("Feedback saved. Case status is now feedback_received.");
  };

  if (!report || (mode === "local" && !caseItem)) {
    return (
      <AppShell title="Feedback" description="Report not found.">
        <EmptyState title="Report not found" description={message || "Generate and save a report before collecting feedback."} />
      </AppShell>
    );
  }

  return (
    <AppShell title="Feedback" description="Collect lightweight feedback for a local CE report.">
      <section className="panel">
        <h2>{report.title}</h2>
        <p className="muted">Feedback is stored locally and can be abstracted into Candidate Knowledge only after review.</p>
        <Link className="button" href={`/reports/${mode === "supabase" && report.shareToken ? report.shareToken : report.reportId}`}>
          View Report
        </Link>
      </section>
      {message ? (
        <div className="notice">
          {message}{" "}
          {caseItem ? <Link href={`/cases/${caseItem.caseId}`}>Back to case</Link> : null}
        </div>
      ) : null}
      <FeedbackForm onSubmit={submit} />
    </AppShell>
  );
}

"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import BarberBriefPreview from "@/components/BarberBriefPreview";
import EmptyState from "@/components/EmptyState";
import ReportPreview from "@/components/ReportPreview";
import { getStorageMode } from "@/lib/config-public";
import { getStorageAdapter } from "@/lib/storage";
import type { FanCase, LiteReport } from "@/types";

export default function SharedReportPage() {
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
      .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load report."));
  }, [mode, reportIdOrToken]);

  if (!report) {
    return (
      <AppShell title="Shared Report" description="Report not found.">
        <EmptyState title="Report not found" description={message || "Generate and save a report from a case first."} />
      </AppShell>
    );
  }

  return (
    <AppShell title={report.title} description={`${mode === "supabase" ? "Cloud" : "Local"} shared report view.`}>
      <section className="page-header">
        <div>
          <h2>{report.title}</h2>
          <p>Status: {report.status}</p>
        </div>
        <div className="actions">
          <Link className="button primary" href={`/feedback/${mode === "supabase" && report.shareToken ? report.shareToken : report.reportId}`}>
            Open Feedback Link
          </Link>
          {caseItem ? (
            <Link className="button" href={`/cases/${caseItem.caseId}`}>
              Back to Case
            </Link>
          ) : null}
        </div>
      </section>
      <ReportPreview markdown={report.markdown} />
      <BarberBriefPreview brief={report.barberBrief} />
      <div className="notice">
        Disclaimer: CE v0.2.2 does not upload real photos, does not call AI APIs, and does not provide medical beauty advice.
      </div>
    </AppShell>
  );
}

"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import BarberBriefPreview from "@/components/BarberBriefPreview";
import EmptyState from "@/components/EmptyState";
import ReportPreview from "@/components/ReportPreview";
import { getCases, getReports, seedInitialData } from "@/lib/storage";
import type { FanCase, LiteReport } from "@/types";

export default function SharedReportPage() {
  const params = useParams();
  const reportId = String(params.reportId ?? "");
  const [report, setReport] = useState<LiteReport | null>(null);
  const [caseItem, setCaseItem] = useState<FanCase | null>(null);

  useEffect(() => {
    seedInitialData();
    const foundReport = getReports().find((item) => item.reportId === reportId) ?? null;
    setReport(foundReport);
    setCaseItem(foundReport ? getCases().find((item) => item.caseId === foundReport.caseId) ?? null : null);
  }, [reportId]);

  if (!report) {
    return (
      <AppShell title="Shared Report" description="Report not found.">
        <EmptyState title="Report not found" description="Generate and save a report from a case first." />
      </AppShell>
    );
  }

  return (
    <AppShell title={report.title} description="Local shared report view. No real permission control in CE v0.2.">
      <section className="page-header">
        <div>
          <h2>{report.title}</h2>
          <p>Status: {report.status}</p>
        </div>
        <div className="actions">
          <Link className="button primary" href={`/feedback/${report.reportId}`}>
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
        Disclaimer: CE v0.2 is local-only, does not upload real photos, does not call AI APIs, and does not provide medical beauty advice.
      </div>
    </AppShell>
  );
}

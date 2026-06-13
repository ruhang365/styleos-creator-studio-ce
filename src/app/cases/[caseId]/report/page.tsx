"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import BarberBriefPreview from "@/components/BarberBriefPreview";
import EmptyState from "@/components/EmptyState";
import { hairstyleRules } from "@/data/hairstyleRules";
import { createId, nowIso } from "@/lib/ids";
import { generateLiteReport } from "@/lib/reportGenerator";
import { copyableMarkdown } from "@/lib/markdown";
import { getCases, getReports, saveCases, saveReports, seedInitialData } from "@/lib/storage";
import type { FanCase, LiteReport } from "@/types";

export default function ReportEditorPage() {
  const params = useParams();
  const caseId = String(params.caseId ?? "");
  const [caseItem, setCaseItem] = useState<FanCase | null>(null);
  const [report, setReport] = useState<LiteReport | null>(null);
  const [markdown, setMarkdown] = useState("");
  const [barberBrief, setBarberBrief] = useState("");
  const [message, setMessage] = useState("");

  const refresh = () => {
    const foundCase = getCases().find((item) => item.caseId === caseId) ?? null;
    const foundReport = foundCase?.reportId ? getReports().find((item) => item.reportId === foundCase.reportId) ?? null : null;
    setCaseItem(foundCase);
    setReport(foundReport);
    setMarkdown(foundReport?.markdown ?? "");
    setBarberBrief(foundReport?.barberBrief ?? "");
  };

  useEffect(() => {
    seedInitialData();
    refresh();
  }, [caseId]);

  const generate = () => {
    if (!caseItem) {
      return;
    }
    const selectedRules = hairstyleRules.filter((rule) => caseItem.selectedRuleIds.includes(rule.rule_id));
    const generated = generateLiteReport(caseItem, selectedRules);
    setMarkdown(generated.markdown);
    setBarberBrief(generated.barberBrief);
    setMessage("Lite Report generated from intake, tags, and selected rules.");
  };

  const save = () => {
    if (!caseItem || !markdown.trim()) {
      return;
    }
    const now = nowIso();
    const reportId = report?.reportId ?? createId("report");
    const nextReport: LiteReport = {
      reportId,
      caseId: caseItem.caseId,
      title: `Hairstyle Lite Report - ${caseItem.fanNickname}`,
      markdown,
      barberBrief,
      status: report?.status ?? "draft",
      createdAt: report?.createdAt ?? now,
      updatedAt: now,
      deliveredAt: report?.deliveredAt
    };
    const reports = getReports();
    saveReports(report ? reports.map((item) => (item.reportId === report.reportId ? nextReport : item)) : [nextReport, ...reports]);
    saveCases(
      getCases().map((item) =>
        item.caseId === caseItem.caseId ? { ...item, reportId, status: "report_draft" as const, updatedAt: now } : item
      )
    );
    setReport(nextReport);
    setMessage("Report saved as draft.");
  };

  const markDelivered = () => {
    if (!caseItem || !report) {
      return;
    }
    const now = nowIso();
    const nextReport = { ...report, status: "delivered" as const, deliveredAt: now, updatedAt: now, markdown, barberBrief };
    saveReports(getReports().map((item) => (item.reportId === report.reportId ? nextReport : item)));
    saveCases(getCases().map((item) => (item.caseId === caseItem.caseId ? { ...item, status: "delivered" as const, updatedAt: now } : item)));
    setReport(nextReport);
    setMessage("Report marked as delivered.");
  };

  if (!caseItem) {
    return (
      <AppShell title="Report Editor" description="Case not found.">
        <EmptyState title="Case not found" description="Return to the case list and open a valid case." />
      </AppShell>
    );
  }

  return (
    <AppShell title="Report Editor" description="Generate, edit, copy, print, and deliver a local Lite Report.">
      {message ? <div className="notice">{message}</div> : null}
      <section className="panel">
        <div className="actions">
          <button className="button primary" onClick={generate} type="button">
            Generate Lite Report
          </button>
          <button className="button" onClick={save} type="button">
            Save Report
          </button>
          <button
            className="button"
            onClick={() => {
              navigator.clipboard.writeText(copyableMarkdown(markdown));
              setMessage("Markdown copied.");
            }}
            type="button"
          >
            Copy Markdown
          </button>
          <button className="button" onClick={() => window.print()} type="button">
            Print / Save as PDF
          </button>
          <button className="button" disabled={!report} onClick={markDelivered} type="button">
            Mark as Delivered
          </button>
          {report ? (
            <Link className="button ghost" href={`/reports/${report.reportId}`}>
              Open Shared Report
            </Link>
          ) : null}
        </div>
      </section>

      <section className="grid two">
        <label className="field">
          Edit Markdown
          <textarea className="textarea-large" value={markdown} onChange={(event) => setMarkdown(event.target.value)} />
        </label>
        <BarberBriefPreview brief={barberBrief || "Generate a report to create the Barber Brief."} />
      </section>
    </AppShell>
  );
}

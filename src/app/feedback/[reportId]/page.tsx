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
            throw new Error(result.error ?? "无法加载报告。");
          }
          return result.report;
        })
        .then((cloudReport) => {
          setReport({
            reportId: cloudReport.id,
            caseId: "",
            title: `顾客报告 - ${cloudReport.id.slice(0, 8)}`,
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
        .catch((error) => setMessage(error instanceof Error ? error.message : "无法加载报告。"));
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
      .catch((error) => setMessage(error instanceof Error ? error.message : "无法加载反馈表。"));
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
        setMessage(result.error ?? "无法提交反馈。");
        return;
      }
      setMessage("反馈已提交。创作者会先复核，再决定是否提炼为候选知识。");
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
    setMessage("反馈已保存，案例状态已更新。");
  };

  if (!report || (mode === "local" && !caseItem)) {
    return (
      <AppShell title="顾客反馈" description="未找到报告。">
        <EmptyState title="未找到报告" description={message || "请先由创作者生成并保存报告。"} />
      </AppShell>
    );
  }

  return (
    <AppShell title="顾客反馈" description="反馈会在授权后用于提炼脱敏的候选知识。">
      <section className="panel">
        <h2>{report.title}</h2>
        <p className="muted">反馈会先进入创作者复核流程；只有勾选脱敏学习授权后，才会用于候选知识提炼。</p>
        <Link className="button" href={`/reports/${mode === "supabase" && report.shareToken ? report.shareToken : report.reportId}`}>
          查看报告
        </Link>
      </section>
      {message ? (
        <div className="notice">
          {message}{" "}
          {caseItem ? <Link href={`/cases/${caseItem.caseId}`}>返回案例</Link> : null}
        </div>
      ) : null}
      <FeedbackForm onSubmit={submit} />
    </AppShell>
  );
}

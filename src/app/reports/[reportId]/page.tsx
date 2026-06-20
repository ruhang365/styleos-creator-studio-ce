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
      .catch((error) => setMessage(error instanceof Error ? error.message : "无法加载报告。"));
  }, [mode, reportIdOrToken]);

  if (!report) {
    return (
      <AppShell title="顾客报告" description="未找到报告。">
        <EmptyState title="未找到报告" description={message || "请先从案例中生成并保存报告。"} />
      </AppShell>
    );
  }

  return (
    <AppShell title={report.title} description={`${mode === "supabase" ? "云端" : "本地"}分享报告。`}>
      <section className="page-header">
        <div>
          <h2>{report.title}</h2>
          <p>状态：{report.status === "delivered" ? "已交付" : "草稿"}</p>
        </div>
        <div className="actions">
          <Link className="button primary" href={`/feedback/${mode === "supabase" && report.shareToken ? report.shareToken : report.reportId}`}>
            提交反馈
          </Link>
          {caseItem ? (
            <Link className="button" href={`/cases/${caseItem.caseId}`}>
              返回案例
            </Link>
          ) : null}
        </div>
      </section>
      <ReportPreview markdown={report.markdown} />
      <BarberBriefPreview brief={report.barberBrief} />
      <div className="notice">
        当前 CE 版本不上传真实照片、不调用 AI API，也不提供医疗美容建议；请以创作者复核后的实际服务沟通为准。
      </div>
    </AppShell>
  );
}

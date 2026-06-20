"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import BarberBriefPreview from "@/components/BarberBriefPreview";
import EmptyState from "@/components/EmptyState";
import WorkflowSteps from "@/components/WorkflowSteps";
import { hairstyleRules } from "@/data/hairstyleRules";
import { nowIso } from "@/lib/ids";
import { generateBarberBrief } from "@/lib/barberBriefGenerator";
import { generateLiteReport } from "@/lib/reportGenerator";
import { copyableMarkdown } from "@/lib/markdown";
import { getStorageMode } from "@/lib/config-public";
import { getStorageAdapter } from "@/lib/storage";
import type { FanCase, LiteReport } from "@/types";

export default function ReportEditorPage() {
  const params = useParams();
  const caseId = String(params.caseId ?? "");
  const mode = getStorageMode();
  const [caseItem, setCaseItem] = useState<FanCase | null>(null);
  const [report, setReport] = useState<LiteReport | null>(null);
  const [markdown, setMarkdown] = useState("");
  const [barberBrief, setBarberBrief] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const refresh = async () => {
    const storage = getStorageAdapter();
    const [foundCase, reports] = await Promise.all([storage.getCaseById(caseId), storage.listReports()]);
    const foundReport = foundCase ? reports.find((item) => item.reportId === foundCase.reportId || item.caseId === foundCase.caseId) ?? null : null;
    setCaseItem(foundCase);
    setReport(foundReport);
    setMarkdown(foundReport?.markdown ?? "");
    setBarberBrief(foundReport?.barberBrief ?? "");
  };

  useEffect(() => {
    const storage = getStorageAdapter();
    setIsLoading(true);
    storage
      .seedInitialData()
      .then(refresh)
      .catch((error) => setMessage(error instanceof Error ? error.message : "无法加载报告编辑器。"))
      .finally(() => setIsLoading(false));
  }, [caseId]);

  const generate = () => {
    if (!caseItem) {
      return;
    }
    const selectedRules = hairstyleRules.filter((rule) => caseItem.selectedRuleIds.includes(rule.rule_id));
    const generated = generateLiteReport(caseItem, selectedRules);
    setMarkdown(generated.markdown);
    setBarberBrief(generated.barberBrief);
    setMessage("已根据采集信息、标签与所选规则生成 Lite Report。");
  };

  const generateBrief = () => {
    if (!caseItem) {
      return;
    }
    const selectedRules = hairstyleRules.filter((rule) => caseItem.selectedRuleIds.includes(rule.rule_id));
    setBarberBrief(generateBarberBrief(caseItem, selectedRules));
    setMessage("已根据采集信息与所选规则生成 Barber Brief 沟通卡。");
  };

  const save = async () => {
    if (!caseItem || !markdown.trim()) {
      setMessage("请先生成或填写 Lite Report 再保存。");
      return;
    }
    const storage = getStorageAdapter();
    const now = nowIso();
    const nextReportInput = {
      caseId: caseItem.caseId,
      title: `Hairstyle Lite Report - ${caseItem.fanNickname}`,
      markdown,
      barberBrief,
      status: report?.status ?? "draft",
      createdAt: report?.createdAt ?? now,
      updatedAt: now,
      deliveredAt: report?.deliveredAt
    };
    const savedReport: LiteReport = report
      ? await storage.updateReport(report.reportId, nextReportInput)
      : await storage.createReport(nextReportInput);
    await storage.updateCase(caseItem.caseId, { reportId: savedReport.reportId, status: "report_draft", updatedAt: now });
    setReport(savedReport);
    setMessage("报告已保存为草稿。");
  };

  const markDelivered = async () => {
    if (!caseItem || !report) {
      return;
    }
    if (!markdown.trim() || !barberBrief.trim()) {
      setMessage("标记交付前，请先生成 Lite Report 与 Barber Brief 沟通卡。");
      return;
    }
    const storage = getStorageAdapter();
    const now = nowIso();
    const nextReport = await storage.updateReport(report.reportId, {
      status: "delivered",
      deliveredAt: now,
      updatedAt: now,
      markdown,
      barberBrief
    });
    await storage.updateCase(caseItem.caseId, { status: "delivered", updatedAt: now });
    setReport(nextReport);
    setMessage("报告已标记为已交付。");
  };

  if (!caseItem && isLoading) {
    return (
      <AppShell title="生成报告与沟通卡" description="正在加载案例。">
        <EmptyState title="正在加载案例" description="正在加载当前工作区的发型咨询案例。" />
      </AppShell>
    );
  }

  if (!caseItem) {
    return (
      <AppShell title="生成报告与沟通卡" description="未找到案例。">
        <EmptyState title="未找到案例" description="返回案例记录，重新打开一个有效案例。" />
      </AppShell>
    );
  }

  return (
    <AppShell title="生成报告与沟通卡" description="第 4 - 5 步 · 生成给顾客看的 Lite Report 和给理发师看的 Barber Brief。">
      <section className="panel">
        <WorkflowSteps activeKey={barberBrief.trim() ? "brief" : "report"} />
      </section>
      {message ? <div className="notice">{message}</div> : null}
      <section className="panel">
        <div className="actions">
          <button className="button primary" onClick={generate} type="button">
            生成 Lite Report
          </button>
          <button className="button" onClick={generateBrief} type="button">
            生成沟通卡
          </button>
          <button className="button" onClick={save} type="button">
            保存报告
          </button>
          <button
            className="button"
            onClick={() => {
              navigator.clipboard.writeText(copyableMarkdown(markdown));
              setMessage("已复制 Markdown。");
            }}
            type="button"
          >
            复制 Markdown
          </button>
          <button className="button" onClick={() => window.print()} type="button">
            打印 / 存为 PDF
          </button>
          <button className="button" disabled={!report} onClick={markDelivered} type="button">
            标记为已交付
          </button>
          {report ? (
            <Link className="button ghost" href={`/reports/${mode === "supabase" && report.shareToken ? report.shareToken : report.reportId}`}>
              打开分享报告
            </Link>
          ) : null}
        </div>
      </section>

      <section className="grid two">
        <label className="field">
          编辑 Markdown（顾客报告）
          <textarea className="textarea-large" value={markdown} onChange={(event) => setMarkdown(event.target.value)} />
        </label>
        <BarberBriefPreview brief={barberBrief || "生成报告后会在这里显示给理发师看的沟通卡。"} />
      </section>
    </AppShell>
  );
}

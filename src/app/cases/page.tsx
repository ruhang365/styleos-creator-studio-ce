"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import CaseCard from "@/components/CaseCard";
import EmptyState from "@/components/EmptyState";
import { getStorageMode } from "@/lib/config-public";
import { getStorageAdapter } from "@/lib/storage";
import type { CaseStatus, FanCase } from "@/types";

const statusLabels: Record<CaseStatus, string> = {
  intake_submitted: "已采集",
  tagging: "标签中",
  rule_matching: "规则匹配",
  report_draft: "报告草稿",
  creator_review: "待审阅",
  delivered: "已交付",
  feedback_received: "已反馈",
  candidate_extracted: "已提炼",
  archived: "已归档"
};

const statuses = Object.keys(statusLabels) as CaseStatus[];

export default function CasesPage() {
  const mode = getStorageMode();
  const [cases, setCases] = useState<FanCase[]>([]);
  const [filter, setFilter] = useState<CaseStatus | "all">("all");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storage = getStorageAdapter();
    setIsLoading(true);
    storage
      .seedInitialData()
      .then(() => storage.listCases())
      .then(setCases)
      .catch((error) => setMessage(error instanceof Error ? error.message : "无法加载案例。"))
      .finally(() => setIsLoading(false));
  }, []);

  const visibleCases = filter === "all" ? cases : cases.filter((caseItem) => caseItem.status === filter);

  return (
    <AppShell title="案例记录" description={`全部发型咨询案例，按状态筛选并跟进下一步 · ${mode === "supabase" ? "云端工作区" : "本地工作区"}`}>
      {message ? <div className="notice">{message}</div> : null}
      <section className="page-header">
        <div>
          <h2>咨询案例</h2>
          <p>请勿在此处录入真实身份信息或原始照片，CE 仅记录结构化特征标签。</p>
        </div>
        <Link className="button primary" href="/services">
          从服务开始咨询
        </Link>
      </section>

      <div className="filter-row">
        <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")} type="button">
          全部
        </button>
        {statuses.map((status) => (
          <button className={filter === status ? "active" : ""} key={status} onClick={() => setFilter(status)} type="button">
            {statusLabels[status]}
          </button>
        ))}
      </div>

      {isLoading ? (
        <EmptyState title="正在加载案例" description="正在加载当前工作区的发型咨询案例。" />
      ) : visibleCases.length === 0 ? (
        <EmptyState title="没有符合条件的案例" description="从“发型咨询”工作台开始新咨询，或录入一个体验案例。" />
      ) : (
        <section className="grid two">
          {visibleCases.map((caseItem) => (
            <CaseCard caseItem={caseItem} key={caseItem.caseId} />
          ))}
        </section>
      )}
    </AppShell>
  );
}

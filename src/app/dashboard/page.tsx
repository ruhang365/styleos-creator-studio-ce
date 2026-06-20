"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ClipboardList, PlayCircle, RotateCcw } from "lucide-react";
import AppShell from "@/components/AppShell";
import CaseCard from "@/components/CaseCard";
import EmptyState from "@/components/EmptyState";
import WorkflowSteps from "@/components/WorkflowSteps";
import { createSyntheticFanCase } from "@/lib/caseFactory";
import { getStorageMode, isSupabaseModeRequestedButIncomplete } from "@/lib/config-public";
import { getStorageAdapter } from "@/lib/storage";
import type { CandidateKnowledge, Creator, FanCase, LiteReport, Service } from "@/types";

const PENDING_STATUSES = ["intake_submitted", "tagging", "rule_matching", "report_draft", "creator_review", "delivered"];

const STATUS_STEP: Record<string, string> = {
  intake_submitted: "待生成标签",
  tagging: "正在整理标签",
  rule_matching: "正在匹配规则",
  report_draft: "报告草稿中",
  creator_review: "待复核",
  delivered: "已交付，待反馈"
};

export default function DashboardPage() {
  const mode = getStorageMode();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [cases, setCases] = useState<FanCase[]>([]);
  const [reports, setReports] = useState<LiteReport[]>([]);
  const [, setCandidates] = useState<CandidateKnowledge[]>([]);
  const [message, setMessage] = useState("");

  const refresh = async () => {
    const storage = getStorageAdapter();
    try {
      await storage.seedInitialData();
      const [nextCreator, nextServices, nextCases, nextReports, nextCandidates] = await Promise.all([
        storage.getCurrentCreator(),
        storage.listServices(),
        storage.listCases(),
        storage.listReports(),
        storage.listCandidateKnowledge()
      ]);
      setCreator(nextCreator);
      setServices(nextServices);
      setCases(nextCases);
      setReports(nextReports);
      setCandidates(nextCandidates);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "无法加载咨询数据。");
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const createSynthetic = async () => {
    const storage = getStorageAdapter();
    const service = services[0] ?? (await storage.listServices())[0];
    if (!service) {
      setMessage("请先创建一个服务，再录入体验案例。");
      return;
    }
    const nextCase = createSyntheticFanCase(service);
    const savedCase = await storage.createCase(nextCase);
    await refresh();
    setMessage(`已录入体验案例：${savedCase.fanNickname}。`);
  };

  const resetLocal = async () => {
    const storage = getStorageAdapter();
    await storage.resetAllData();
    await refresh();
    setMessage("本地数据已重置为初始示例。");
  };

  const pendingCases = cases
    .filter((caseItem) => PENDING_STATUSES.includes(caseItem.status))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  const startHref = services[0]?.intakePath ?? "/services/new";
  const resumeCase = pendingCases[0];

  return (
    <AppShell
      title="发型咨询"
      description={mode === "supabase" ? "云端工作区 · 一次咨询从采集到沟通卡" : "本地工作区 · 一次咨询从采集到沟通卡"}
    >
      {isSupabaseModeRequestedButIncomplete() ? (
        <div className="notice">已选择 Supabase 云端模式，但配置尚不完整，当前自动使用本地模式。</div>
      ) : null}
      {message ? <div className="notice">{message}</div> : null}

      <section className="task-grid" aria-label="主要操作">
        <article className="task-card primary">
          <span className="task-icon" aria-hidden="true">
            <PlayCircle size={22} />
          </span>
          <h2>开始发型咨询</h2>
          <p>采集一位顾客的脸型、发质与造型诉求，进入引导式流程。</p>
          <Link className="button primary" href={startHref}>
            开始采集
            <ArrowRight size={16} />
          </Link>
        </article>

        <article className="task-card">
          <span className="task-icon" aria-hidden="true">
            <ClipboardList size={22} />
          </span>
          <h2>继续处理案例</h2>
          {resumeCase ? (
            <>
              <p>
                上次进行到 <strong>{resumeCase.fanNickname}</strong> · {STATUS_STEP[resumeCase.status] ?? "进行中"}
              </p>
              <Link className="button" href={`/cases/${resumeCase.caseId}`}>
                继续这一单
                <ArrowRight size={16} />
              </Link>
            </>
          ) : (
            <>
              <p>当前没有进行中的咨询。先开始一单，或录入体验案例熟悉流程。</p>
              <button className="button" onClick={createSynthetic} type="button">
                录入体验案例
              </button>
            </>
          )}
        </article>
      </section>

      <section className="panel">
        <div className="card-row">
          <h3>进行中的咨询</h3>
          {pendingCases.length > 0 ? (
            <Link className="button ghost" href="/cases">
              查看全部
            </Link>
          ) : null}
        </div>
        {pendingCases.length === 0 ? (
          <EmptyState
            title="暂无进行中的咨询"
            description="点击“开始采集”记录一位顾客，或先录入一个体验案例走一遍完整流程。"
            action={
              <Link className="button primary" href={startHref}>
                开始采集
              </Link>
            }
          />
        ) : (
          <section className="grid two">
            {pendingCases.slice(0, 4).map((caseItem) => (
              <CaseCard caseItem={caseItem} key={caseItem.caseId} />
            ))}
          </section>
        )}
      </section>

      <section className="panel subtle">
        <div className="card-row">
          <h3>咨询流程</h3>
          <span className="muted">5 步走完一单</span>
        </div>
        <p className="muted" style={{ marginTop: 0 }}>
          每个新案例都会沿着这条流程推进，案例详情页会高亮当前所在步骤。
        </p>
        <WorkflowSteps />
      </section>

      <details className="tool-meta">
        <summary>工作区与数据</summary>
        <div className="grid two">
          <div className="meta-block">
            <h4>顾问资料</h4>
            <p className="muted">昵称：{creator?.displayName ?? "—"}</p>
            <p className="muted">顾问类型：{creator?.creatorType ?? "—"}</p>
            <p className="muted">擅长方向：{creator?.focusArea ?? "—"}</p>
            <Link className="button" href="/setup">
              前往设置
            </Link>
          </div>
          <div className="meta-block">
            <h4>本地数据</h4>
            <p className="muted">
              {mode === "local"
                ? "重置会清除本地记录，仅恢复初始示例数据。"
                : "云端模式下不提供一键重置，请在 Supabase 控制台处理。"}
            </p>
            <button className="button danger" disabled={mode !== "local"} onClick={resetLocal} type="button">
              <RotateCcw size={15} />
              重置本地数据
            </button>
          </div>
        </div>
      </details>
    </AppShell>
  );
}

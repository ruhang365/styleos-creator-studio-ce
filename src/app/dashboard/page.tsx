"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import CaseCard from "@/components/CaseCard";
import EmptyState from "@/components/EmptyState";
import WorkflowSteps from "@/components/WorkflowSteps";
import { createSyntheticFanCase } from "@/lib/caseFactory";
import { getStorageMode, isSupabaseModeRequestedButIncomplete } from "@/lib/config-public";
import { getStorageAdapter } from "@/lib/storage";
import type { CandidateKnowledge, Creator, FanCase, LiteReport, Service } from "@/types";

const PENDING_STATUSES = ["intake_submitted", "tagging", "rule_matching", "report_draft", "creator_review", "delivered"];

export default function DashboardPage() {
  const mode = getStorageMode();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [cases, setCases] = useState<FanCase[]>([]);
  const [reports, setReports] = useState<LiteReport[]>([]);
  const [candidates, setCandidates] = useState<CandidateKnowledge[]>([]);
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
      setMessage(error instanceof Error ? error.message : "无法加载工作台数据。");
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
    setMessage("本地数据已重置为 CE 初始示例。");
  };

  const pendingCases = cases
    .filter((caseItem) => PENDING_STATUSES.includes(caseItem.status))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  const deliveredReports = reports.filter((report) => report.status === "delivered");
  const startHref = services[0]?.intakePath ?? "/services/new";

  return (
    <AppShell
      title="发型咨询工作台"
      description={`从顾客采集到沟通卡的完整造型咨询流程 · ${mode === "supabase" ? "云端工作区" : "本地工作区"}`}
    >
      {isSupabaseModeRequestedButIncomplete() ? (
        <div className="notice">已选择 Supabase 云端模式，但配置尚不完整，当前自动使用本地模式。</div>
      ) : null}

      <section className="page-header">
        <div>
          <h2>{creator?.studioName ?? "我的造型工作室"}</h2>
          <p>
            {creator?.displayName ?? "造型顾问"} · 跟着下面 5 步，把一次粉丝咨询做成顾客方案和理发师沟通卡。
          </p>
        </div>
        <div className="actions">
          <Link className="button primary" href={startHref}>
            开始新咨询
          </Link>
          <button className="button" onClick={createSynthetic} type="button">
            录入体验案例
          </button>
          <Link className="button ghost" href="/cases">
            查看全部案例
          </Link>
        </div>
      </section>

      {message ? <div className="notice">{message}</div> : null}

      <section className="panel">
        <div className="card-row">
          <h3>造型咨询流程</h3>
          <span className="muted">5 步走完一次咨询</span>
        </div>
        <p className="muted" style={{ marginTop: 0 }}>
          每个新案例都会沿着这条流程推进，案例详情页会高亮当前所在步骤。
        </p>
        <WorkflowSteps />
      </section>

      <section className="grid four">
        <article className="panel metric">
          <span className="muted">服务入口</span>
          <strong>{services.length}</strong>
        </article>
        <article className="panel metric">
          <span className="muted">咨询案例</span>
          <strong>{cases.length}</strong>
        </article>
        <article className="panel metric">
          <span className="muted">待处理</span>
          <strong>{pendingCases.length}</strong>
        </article>
        <article className="panel metric">
          <span className="muted">已交付报告</span>
          <strong>{deliveredReports.length}</strong>
        </article>
      </section>

      <section className="panel">
        <div className="card-row">
          <h3>待处理咨询</h3>
          <Link className="button ghost" href="/cases">
            全部案例
          </Link>
        </div>
        {pendingCases.length === 0 ? (
          <EmptyState
            title="暂无待处理咨询"
            description="点击“开始新咨询”采集一位顾客，或先录入一个体验案例熟悉流程。"
            action={
              <Link className="button primary" href={startHref}>
                开始新咨询
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

      <section className="grid two">
        <div className="panel">
          <h3>顾问资料</h3>
          <p className="muted">昵称：{creator?.displayName ?? "—"}</p>
          <p className="muted">顾问类型：{creator?.creatorType ?? "—"}</p>
          <p className="muted">擅长方向：{creator?.focusArea ?? "—"}</p>
          <Link className="button" href="/setup">
            前往设置
          </Link>
        </div>
        <div className="panel">
          <h3>数据控制</h3>
          <p className="muted">
            {mode === "local"
              ? "重置会清除本地存储记录，仅恢复 CE 初始示例数据。"
              : "云端模式下 CE 不提供一键重置，请在 Supabase 控制台执行数据治理操作。"}
          </p>
          <button className="button danger" disabled={mode !== "local"} onClick={resetLocal} type="button">
            重置本地数据
          </button>
        </div>
      </section>
    </AppShell>
  );
}

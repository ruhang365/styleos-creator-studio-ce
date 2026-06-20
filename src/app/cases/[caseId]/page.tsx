"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import TagChip from "@/components/TagChip";
import WorkflowSteps from "@/components/WorkflowSteps";
import { extractCandidateKnowledge } from "@/lib/candidateKnowledge";
import { getStorageAdapter } from "@/lib/storage";
import { nowIso } from "@/lib/ids";
import type { CandidateKnowledge, CaseStatus, FanCase, Feedback, LiteReport } from "@/types";

const stepForStatus: Partial<Record<CaseStatus, string>> = {
  intake_submitted: "tags",
  tagging: "rules",
  rule_matching: "report",
  report_draft: "report",
  creator_review: "report",
  delivered: "brief",
  feedback_received: "brief"
};

export default function CaseDetailPage() {
  const params = useParams();
  const caseId = String(params.caseId ?? "");
  const [caseItem, setCaseItem] = useState<FanCase | null>(null);
  const [report, setReport] = useState<LiteReport | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [candidate, setCandidate] = useState<CandidateKnowledge | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const refresh = async () => {
    const storage = getStorageAdapter();
    const [foundCase, reports, feedbackItems, candidates] = await Promise.all([
      storage.getCaseById(caseId),
      storage.listReports(),
      storage.listFeedback(),
      storage.listCandidateKnowledge()
    ]);
    setCaseItem(foundCase);
    setReport(foundCase ? reports.find((item) => item.reportId === foundCase.reportId || item.caseId === foundCase.caseId) ?? null : null);
    setFeedback(
      foundCase ? feedbackItems.find((item) => item.feedbackId === foundCase.feedbackId || item.caseId === foundCase.caseId) ?? null : null
    );
    const candidateForCase = foundCase
      ? candidates.find(
          (item) => item.candidate_id === foundCase.candidateKnowledgeId || item.source_case_id === foundCase.caseId
        ) ?? null
      : null;
    setCandidate(candidateForCase);
  };

  useEffect(() => {
    const storage = getStorageAdapter();
    setIsLoading(true);
    storage
      .seedInitialData()
      .then(refresh)
      .catch((error) => setMessage(error instanceof Error ? error.message : "无法加载案例。"))
      .finally(() => setIsLoading(false));
  }, [caseId]);

  const extractCandidate = async () => {
    if (!caseItem || !report || !feedback) {
      setMessage("需要先有报告和顾客反馈，才能提炼候选知识。");
      return;
    }
    const storage = getStorageAdapter();
    const candidates = await storage.listCandidateKnowledge();
    const existing = candidates.find((item) => item.source_case_id === caseItem.caseId);
    const candidateItem = existing ?? extractCandidateKnowledge(caseItem, report, feedback);
    const savedCandidate = existing
      ? await storage.updateCandidateKnowledge(existing.candidate_id, candidateItem)
      : await storage.createCandidateKnowledge(candidateItem);
    const now = nowIso();
    await storage.updateCase(caseItem.caseId, {
      status: "candidate_extracted",
      candidateKnowledgeId: savedCandidate.candidate_id,
      updatedAt: now
    });
    setCaseItem({
      ...caseItem,
      status: "candidate_extracted",
      candidateKnowledgeId: savedCandidate.candidate_id,
      updatedAt: now
    });
    setCandidate(savedCandidate);
    setMessage("已提炼为抽象的候选知识，未复制昵称、照片或联系方式。");
    await refresh();
  };

  if (!caseItem && isLoading) {
    return (
      <AppShell title="案例详情" description="正在加载案例。">
        <EmptyState title="正在加载案例" description="正在加载当前工作区的发型咨询案例。" />
      </AppShell>
    );
  }

  if (!caseItem) {
    return (
      <AppShell title="案例详情" description="未找到案例。">
        <EmptyState title="未找到案例" description="返回案例记录，重新打开一个案例。" />
      </AppShell>
    );
  }

  return (
    <AppShell title={`案例：${caseItem.fanNickname}`} description="采集摘要、标签、规则匹配、报告、反馈与候选知识状态。">
      <section className="panel">
        <div className="card-row">
          <div>
            <h2>{caseItem.fanNickname}</h2>
            <p className="muted">{caseItem.targetScenario}</p>
          </div>
          <StatusBadge status={caseItem.status} />
        </div>
        <WorkflowSteps activeKey={stepForStatus[caseItem.status]} />
        <div className="actions" style={{ marginTop: 16 }}>
          <Link className="button primary" href={`/cases/${caseItem.caseId}/tags`}>
            生成发型标签
          </Link>
          <Link className="button" href={`/cases/${caseItem.caseId}/rules`}>
            匹配发型规则
          </Link>
          <Link className="button" href={`/cases/${caseItem.caseId}/report`}>
            生成报告与沟通卡
          </Link>
          {caseItem.reportId ? (
            <Link className="button" href={`/feedback/${caseItem.reportId}`}>
              查看反馈
            </Link>
          ) : (
            <button className="button" disabled type="button">
              查看反馈
            </button>
          )}
          <button className="button" onClick={extractCandidate} type="button">
            提炼候选知识
          </button>
        </div>
      </section>

      {message ? <div className="notice">{message}</div> : null}

      <section className="grid two">
        <article className="panel">
          <h3>采集摘要</h3>
          <p><strong>造型目标：</strong>{caseItem.intake.stylingGoal}</p>
          <p><strong>当前困扰：</strong>{caseItem.intake.currentHairstyleConcern}</p>
          <p><strong>限制条件：</strong>{caseItem.intake.workplaceSchoolConstraints}</p>
        </article>
        <article className="panel">
          <h3>进度概览</h3>
          <p className="muted">已选标签：{caseItem.tags.length}</p>
          <p className="muted">匹配规则：{caseItem.selectedRuleIds.length}</p>
          <p className="muted">报告状态：{report ? <StatusBadge status={report.status} /> : "未生成"}</p>
          <p className="muted">反馈评分：{feedback ? `${feedback.satisfactionScore}/5` : "未收集"}</p>
          <p className="muted">候选知识：{candidate?.review_status ?? "未提炼"}</p>
        </article>
      </section>

      <section className="panel">
        <h3>已选标签</h3>
        <div className="chips">
          {caseItem.tags.length > 0 ? caseItem.tags.map((tag) => <TagChip key={tag.tagId} tag={tag} />) : <p className="muted">尚未保存标签。</p>}
        </div>
      </section>
    </AppShell>
  );
}

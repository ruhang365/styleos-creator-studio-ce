"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import CandidateKnowledgeCard from "@/components/CandidateKnowledgeCard";
import EmptyState from "@/components/EmptyState";
import { extractCandidateKnowledge } from "@/lib/candidateKnowledge";
import { getStorageMode } from "@/lib/config-public";
import { getStorageAdapter } from "@/lib/storage";
import { nowIso } from "@/lib/ids";
import type { CandidateKnowledge } from "@/types";

export default function CandidateQueuePage() {
  const mode = getStorageMode();
  const [candidates, setCandidates] = useState<CandidateKnowledge[]>([]);
  const [message, setMessage] = useState("");

  const refresh = async () => {
    const storage = getStorageAdapter();
    setCandidates(await storage.listCandidateKnowledge());
  };

  useEffect(() => {
    const storage = getStorageAdapter();
    storage
      .seedInitialData()
      .then(refresh)
      .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load candidate knowledge."));
  }, []);

  const extractFromFeedback = async () => {
    const storage = getStorageAdapter();
    const [cases, reports, feedbackItems, existing] = await Promise.all([
      storage.listCases(),
      storage.listReports(),
      storage.listFeedback(),
      storage.listCandidateKnowledge()
    ]);
    const existingSourceIds = new Set(existing.map((item) => item.source_case_id));

    const nextCandidates = feedbackItems
      .map((feedback) => {
        const caseItem = cases.find((item) => item.caseId === feedback.caseId);
        const report = reports.find((item) => item.reportId === feedback.reportId);
        if (!caseItem || !report || existingSourceIds.has(caseItem.caseId)) {
          return null;
        }
        return extractCandidateKnowledge(caseItem, report, feedback);
      })
      .filter((item): item is CandidateKnowledge => Boolean(item));

    if (nextCandidates.length === 0) {
      setMessage("暂无可提炼的反馈案例。");
      return;
    }

    const savedCandidates = await Promise.all(nextCandidates.map((candidate) => storage.createCandidateKnowledge(candidate)));
    await Promise.all(
      savedCandidates.map((candidate) =>
        storage.updateCase(candidate.source_case_id, {
          candidateKnowledgeId: candidate.candidate_id,
          status: "candidate_extracted",
          updatedAt: nowIso()
        })
      )
    );
    setMessage(`已提炼 ${nextCandidates.length} 条候选知识。`);
    await refresh();
  };

  const updateStatus = async (candidateId: string, action: "public" | "pro" | "reject" | "archive") => {
    const storage = getStorageAdapter();
    const candidate = candidates.find((item) => item.candidate_id === candidateId);
    if (!candidate) {
      return;
    }
    if (action === "pro" && candidate.consent_status !== "granted") {
      setMessage("标记为 Pro 候选前需要先获得授权同意。");
      return;
    }

    const updates =
      action === "public"
        ? {
            public_rule_candidate: true,
            pro_candidate: false,
            review_status: "public_rule_candidate" as const,
            updatedAt: nowIso()
          }
        : action === "pro"
          ? {
              public_rule_candidate: false,
              pro_candidate: true,
              review_status: "pro_candidate" as const,
              updatedAt: nowIso()
            }
          : {
              public_rule_candidate: false,
              pro_candidate: false,
              review_status: action === "reject" ? ("rejected" as const) : ("archived" as const),
              updatedAt: nowIso()
            };

    await storage.updateCandidateKnowledge(candidateId, updates);
    await refresh();
  };

  return (
    <AppShell title="知识候选" description={`把反馈完成的案例提炼成可复用、可审阅的经验 · ${mode === "supabase" ? "云端工作区" : "本地工作区"}`}>
      <section className="page-header">
        <div>
          <h2>候选知识队列</h2>
          <p>
            候选知识不会保存真实姓名、照片或联系方式，只沉淀抽象的特征标签、方案要点、执行反馈与审阅状态。
          </p>
        </div>
        <button className="button primary" onClick={extractFromFeedback} type="button">
          从反馈案例提炼
        </button>
      </section>

      {message ? <div className="notice">{message}</div> : null}

      {candidates.length === 0 ? (
        <EmptyState
          title="还没有候选知识"
          description="先交付报告、收集顾客反馈，再从案例中提炼一条候选知识。"
          action={
            <Link className="button" href="/cases">
              查看案例
            </Link>
          }
        />
      ) : (
        <section className="list">
          {candidates.map((candidate) => (
            <CandidateKnowledgeCard candidate={candidate} key={candidate.candidate_id} onStatusChange={updateStatus} />
          ))}
        </section>
      )}
    </AppShell>
  );
}

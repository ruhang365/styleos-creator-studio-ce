"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import EmptyState from "@/components/EmptyState";
import RuleCard from "@/components/RuleCard";
import WorkflowSteps from "@/components/WorkflowSteps";
import { hairstyleRules } from "@/data/hairstyleRules";
import { nowIso } from "@/lib/ids";
import { matchRules } from "@/lib/ruleMatcher";
import { getStorageAdapter } from "@/lib/storage";
import type { FanCase, RuleMatch } from "@/types";

export default function RuleMatchingPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = String(params.caseId ?? "");
  const [caseItem, setCaseItem] = useState<FanCase | null>(null);
  const [matches, setMatches] = useState<RuleMatch[]>([]);
  const [selectedRuleIds, setSelectedRuleIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storage = getStorageAdapter();
    setIsLoading(true);
    storage
      .seedInitialData()
      .then(() => storage.getCaseById(caseId))
      .then((found) => {
        setCaseItem(found);
        setMatches(found?.ruleMatches ?? []);
        setSelectedRuleIds(found?.selectedRuleIds ?? []);
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "无法加载案例。"))
      .finally(() => setIsLoading(false));
  }, [caseId]);

  const autoMatch = () => {
    if (!caseItem) {
      return;
    }
    const nextMatches = matchRules(caseItem.tags, hairstyleRules);
    setMatches(nextMatches);
    setSelectedRuleIds(nextMatches.filter((match) => match.selected).map((match) => match.ruleId));
  };

  const save = async () => {
    if (!caseItem) {
      return;
    }
    const nextMatches = matches.map((match) => ({ ...match, selected: selectedRuleIds.includes(match.ruleId) }));
    const storage = getStorageAdapter();
    await storage.updateCase(caseItem.caseId, {
      ruleMatches: nextMatches,
      selectedRuleIds,
      status: "rule_matching",
      updatedAt: nowIso()
    });
    setMessage("已保存所选规则，案例状态更新为“规则匹配”。");
  };

  if (!caseItem && isLoading) {
    return (
      <AppShell title="匹配发型规则" description="正在加载案例。">
        <EmptyState title="正在加载案例" description="正在加载当前工作区的发型咨询案例。" />
      </AppShell>
    );
  }

  if (!caseItem) {
    return (
      <AppShell title="匹配发型规则" description="未找到案例。">
        <EmptyState title="未找到案例" description="返回案例记录，重新打开一个有效案例。" />
      </AppShell>
    );
  }

  return (
    <AppShell title="匹配发型规则" description="第 3 步 · 用已保存的标签匹配本地发型方案规则。">
      <section className="panel">
        <WorkflowSteps activeKey="rules" />
      </section>
      {caseItem.tags.length === 0 ? (
        <div className="notice">尚未保存标签，建议先完成“生成发型标签”再匹配，效果更准。</div>
      ) : null}
      {message ? <div className="notice">{message}</div> : null}
      <section className="panel">
        <div className="actions">
          <button className="button primary" onClick={autoMatch} type="button">
            自动匹配规则
          </button>
          <button className="button" onClick={save} type="button">
            保存所选规则
          </button>
          <button className="button ghost" onClick={() => router.push(`/cases/${caseItem.caseId}/report`)} type="button">
            下一步：生成报告
          </button>
        </div>
      </section>
      <section className="grid two">
        {hairstyleRules.map((rule) => {
          const match = matches.find((item) => item.ruleId === rule.rule_id);
          const selected = selectedRuleIds.includes(rule.rule_id);
          return (
            <RuleCard
              key={rule.rule_id}
              match={match}
              onToggle={(ruleId) =>
                setSelectedRuleIds((current) =>
                  current.includes(ruleId) ? current.filter((item) => item !== ruleId) : [...current, ruleId]
                )
              }
              rule={rule}
              selected={selected}
            />
          );
        })}
      </section>
    </AppShell>
  );
}

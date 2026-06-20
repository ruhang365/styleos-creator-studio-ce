"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import EmptyState from "@/components/EmptyState";
import TagChip from "@/components/TagChip";
import WorkflowSteps from "@/components/WorkflowSteps";
import { createId, nowIso } from "@/lib/ids";
import { generateStyleTags } from "@/lib/tagger";
import { getStorageAdapter } from "@/lib/storage";
import type { FanCase, StyleTag } from "@/types";

export default function TagWorkbenchPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = String(params.caseId ?? "");
  const [caseItem, setCaseItem] = useState<FanCase | null>(null);
  const [tags, setTags] = useState<StyleTag[]>([]);
  const [manualTag, setManualTag] = useState("");
  const [manualGroup, setManualGroup] = useState<StyleTag["group"]>("Goal");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storage = getStorageAdapter();
    storage
      .seedInitialData()
      .then(() => storage.getCaseById(caseId))
      .then((found) => {
        setCaseItem(found);
        setTags(found?.tags ?? []);
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "无法加载案例。"));
  }, [caseId]);

  const save = async () => {
    if (!caseItem) {
      return;
    }
    const storage = getStorageAdapter();
    await storage.updateCase(caseItem.caseId, { tags, status: "tagging", updatedAt: nowIso() });
    setMessage("标签已保存，案例状态更新为“标签中”。");
  };

  if (!caseItem) {
    return (
      <AppShell title="生成发型标签" description="未找到案例。">
        <EmptyState title="未找到案例" description="返回案例记录，重新打开一个有效案例。" />
      </AppShell>
    );
  }

  return (
    <AppShell title="生成发型标签" description="第 2 步 · 从采集信息自动生成标签，再手动微调。">
      <section className="panel">
        <WorkflowSteps activeKey="tags" />
      </section>
      {message ? <div className="notice">{message}</div> : null}
      <section className="panel">
        <h3>采集依据</h3>
        <p className="muted">当前困扰：{caseItem.intake.currentHairstyleConcern}</p>
        <p className="muted">造型目标：{caseItem.intake.stylingGoal}</p>
        <div className="actions">
          <button className="button primary" onClick={() => setTags(generateStyleTags(caseItem.intake))} type="button">
            自动生成标签
          </button>
          <button className="button" onClick={save} type="button">
            保存标签
          </button>
          <button className="button ghost" onClick={() => router.push(`/cases/${caseItem.caseId}/rules`)} type="button">
            下一步：匹配规则
          </button>
        </div>
      </section>

      <section className="form-card">
        <h3>手动添加标签</h3>
        <div className="form-grid">
          <label className="field">
            标签分组
            <select value={manualGroup} onChange={(event) => setManualGroup(event.target.value as StyleTag["group"])}>
              <option value="Basic">基础</option>
              <option value="Face & Proportion">脸型与比例</option>
              <option value="Hair Attribute">发质属性</option>
              <option value="Goal">造型目标</option>
              <option value="Constraint">限制条件</option>
            </select>
          </label>
          <label className="field">
            标签名称
            <input value={manualTag} onChange={(event) => setManualTag(event.target.value)} placeholder="例如：goal_clean_outline" />
          </label>
        </div>
        <button
          className="button"
          onClick={() => {
            if (!manualTag.trim()) {
              return;
            }
            setTags([
              ...tags,
              {
                tagId: createId("tag"),
                group: manualGroup,
                label: manualTag.trim(),
                value: manualTag.trim(),
                source: "manual"
              }
            ]);
            setManualTag("");
          }}
          type="button"
        >
          添加标签
        </button>
      </section>

      <section className="panel">
        <h3>已选标签</h3>
        <div className="chips">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <TagChip key={tag.tagId} onRemove={(tagId) => setTags(tags.filter((item) => item.tagId !== tagId))} tag={tag} />
            ))
          ) : (
            <p className="muted">尚未生成或添加标签。</p>
          )}
        </div>
      </section>
    </AppShell>
  );
}

"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import EmptyState from "@/components/EmptyState";
import WorkflowSteps from "@/components/WorkflowSteps";
import { syntheticFanIntake } from "@/data/syntheticExamples";
import { createCaseFromIntake } from "@/lib/caseFactory";
import { getStorageMode } from "@/lib/config-public";
import { getStorageAdapter } from "@/lib/storage";
import type { FanIntake, Service } from "@/types";

export default function IntakePage() {
  const params = useParams();
  const router = useRouter();
  const serviceIdOrToken = String(params.serviceId ?? "");
  const mode = getStorageMode();
  const [service, setService] = useState<Service | null>(null);
  const [form, setForm] = useState<FanIntake>(syntheticFanIntake);
  const [message, setMessage] = useState("");
  const [submittedCaseId, setSubmittedCaseId] = useState("");

  useEffect(() => {
    if (mode === "supabase") {
      fetch(`/api/intake/${serviceIdOrToken}`)
        .then(async (response) => {
          if (!response.ok) {
            throw new Error((await response.json()).error ?? "无法加载服务。");
          }
          return response.json();
        })
        .then(({ service: cloudService }) => {
          setService({
            serviceId: cloudService.id,
            creatorId: "",
            serviceName: cloudService.name,
            module: cloudService.module,
            status: cloudService.status,
            description: cloudService.description ?? "",
            deliveryFormat: "Markdown Lite Report + Barber Brief",
            intakePath: `/intake/${serviceIdOrToken}`,
            intakeToken: serviceIdOrToken,
            createdAt: "",
            updatedAt: ""
          });
        })
        .catch((error) => setMessage(error instanceof Error ? error.message : "无法加载服务。"));
      return;
    }

    const storage = getStorageAdapter();
    storage
      .seedInitialData()
      .then(() => storage.getServiceById(serviceIdOrToken))
      .then(setService)
      .catch((error) => setMessage(error instanceof Error ? error.message : "无法加载服务。"));
  }, [mode, serviceIdOrToken]);

  const update = <K extends keyof FanIntake>(field: K, value: FanIntake[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  if (!service && !message) {
    return (
      <AppShell title="采集顾客信息" description="正在加载采集表。">
        <div className="panel">正在加载采集表...</div>
      </AppShell>
    );
  }

  if (!service) {
    return (
      <AppShell title="采集顾客信息" description="未找到服务。">
        <EmptyState title="未找到服务" description={message || "请从服务链接列表打开一个有效的采集入口。"} />
      </AppShell>
    );
  }

  if (submittedCaseId) {
    return (
      <AppShell title="采集顾客信息" description="采集已提交。">
        <section className="panel">
          <h2>采集已提交</h2>
          <p className="muted">已收到结构化采集信息。无需上传照片、电话、微信、身份证、住址或邮箱。</p>
          <p className="muted">案例编号：{submittedCaseId}</p>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell title="采集顾客信息" description="第 1 步 · CE 版本仅采集结构化文本字段，不上传真实照片。">
      <section className="panel">
        <WorkflowSteps activeKey="intake" />
      </section>
      <div className="notice">
        {"当前 CE 版本不上传真实照片。照片不是 StyleOS 的核心知识资产，本产品重点沉淀“特征标签 → 造型方案 → 执行反馈”。"}
      </div>
      <form
        className="form-card"
        onSubmit={async (event) => {
          event.preventDefault();
          if (mode === "supabase") {
            try {
              const response = await fetch(`/api/intake/${serviceIdOrToken}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  intake: form,
                  fan_alias: form.fanNickname,
                  target_scenario: form.targetScenario
                })
              });
              const result = await response.json();
              if (!response.ok) {
                throw new Error(result.error ?? "无法提交采集信息。");
              }
              setSubmittedCaseId(result.case_id);
            } catch (error) {
              setMessage(error instanceof Error ? error.message : "无法提交采集信息。");
            }
            return;
          }

          const storage = getStorageAdapter();
          const nextCase = createCaseFromIntake(service, form);
          const savedCase = await storage.createCase(nextCase);
          await storage.createConsentRecord({
            caseId: savedCase.caseId,
            consentType: "service_processing",
            consentValue: form.consentToLocalProcessing,
            consentNote: form.consentToLocalProcessing
              ? "已在本地采集表中获得服务处理同意。"
              : "本地采集表中未获得服务处理同意。"
          });
          router.push(`/cases/${savedCase.caseId}`);
        }}
      >
        {message ? <div className="notice">{message}</div> : null}
        <div className="form-grid">
          <label className="field">
            顾客昵称
            <input value={form.fanNickname} onChange={(event) => update("fanNickname", event.target.value)} />
          </label>
          <label className="field">
            目标场景
            <input value={form.targetScenario} onChange={(event) => update("targetScenario", event.target.value)} />
          </label>
          <label className="field full">
            当前发型困扰
            <textarea
              value={form.currentHairstyleConcern}
              onChange={(event) => update("currentHairstyleConcern", event.target.value)}
            />
          </label>
          <label className="field full">
            造型目标
            <textarea value={form.stylingGoal} onChange={(event) => update("stylingGoal", event.target.value)} />
          </label>
          <label className="field">
            脸型
            <select value={form.faceShapeTag} onChange={(event) => update("faceShapeTag", event.target.value)}>
              <option value="oval">鹅蛋脸</option>
              <option value="round">圆脸</option>
              <option value="long">长脸</option>
              <option value="square">方脸</option>
              <option value="heart">心形脸</option>
            </select>
          </label>
          <label className="field">
            额头印象
            <select value={form.foreheadImpression} onChange={(event) => update("foreheadImpression", event.target.value)}>
              <option value="low">偏低</option>
              <option value="medium">适中</option>
              <option value="high">偏高</option>
            </select>
          </label>
          <label className="field">
            下颌线条
            <select value={form.jawlineSignal} onChange={(event) => update("jawlineSignal", event.target.value)}>
              <option value="soft">柔和</option>
              <option value="square">方正</option>
              <option value="narrow">窄</option>
            </select>
          </label>
          <label className="field">
            发量
            <select value={form.hairVolume} onChange={(event) => update("hairVolume", event.target.value)}>
              <option value="low">偏少</option>
              <option value="medium">适中</option>
              <option value="high">偏多</option>
            </select>
          </label>
          <label className="field">
            发质
            <select value={form.hairTexture} onChange={(event) => update("hairTexture", event.target.value)}>
              <option value="straight">直发</option>
              <option value="wavy">微卷</option>
              <option value="curly">卷发</option>
            </select>
          </label>
          <label className="field">
            头型走向
            <select value={form.hairShape} onChange={(event) => update("hairShape", event.target.value)}>
              <option value="flat_crown">头顶扁塌</option>
              <option value="side_volume">两侧蓬松</option>
              <option value="balanced">均衡</option>
            </select>
          </label>
          <label className="field">
            头顶高度
            <select value={form.crownHeight} onChange={(event) => update("crownHeight", event.target.value)}>
              <option value="low">偏低</option>
              <option value="medium">适中</option>
              <option value="high">偏高</option>
            </select>
          </label>
          <label className="field">
            打理意愿
            <select value={form.maintenanceWillingness} onChange={(event) => update("maintenanceWillingness", event.target.value)}>
              <option value="low">低</option>
              <option value="medium">中</option>
              <option value="high">高</option>
            </select>
          </label>
          <label className="field">
            剪短意愿
            <select value={form.willingnessToCutShort} onChange={(event) => update("willingnessToCutShort", event.target.value)}>
              <option value="no">不接受</option>
              <option value="maybe">看情况</option>
              <option value="yes">接受</option>
            </select>
          </label>
          <label className="field">
            烫发意愿
            <select value={form.willingnessToPerm} onChange={(event) => update("willingnessToPerm", event.target.value)}>
              <option value="no">不接受</option>
              <option value="maybe">看情况</option>
              <option value="yes">接受</option>
            </select>
          </label>
          <label className="field">
            染发意愿
            <select value={form.willingnessToColor} onChange={(event) => update("willingnessToColor", event.target.value)}>
              <option value="no">不接受</option>
              <option value="maybe">看情况</option>
              <option value="yes">接受</option>
            </select>
          </label>
          <label className="field full">
            职场 / 校园限制
            <textarea
              placeholder="例如：需要面客、单位风格保守、可打理时间有限"
              value={form.workplaceSchoolConstraints}
              onChange={(event) => update("workplaceSchoolConstraints", event.target.value)}
            />
          </label>
          <label className="field full">
            顾问备注
            <textarea value={form.creatorNotes} onChange={(event) => update("creatorNotes", event.target.value)} />
          </label>
          <label className="field full">
            <span>
              <input
                checked={form.consentToLocalProcessing}
                onChange={(event) => update("consentToLocalProcessing", event.target.checked)}
                type="checkbox"
              />{" "}
              我已了解：本 CE 版本会在当前{mode === "supabase" ? "云端模式" : "本地模式"}工作流中保存结构化采集信息。
            </span>
          </label>
        </div>
        <button className="button primary" disabled={!form.consentToLocalProcessing} type="submit">
          提交采集
        </button>
      </form>
    </AppShell>
  );
}

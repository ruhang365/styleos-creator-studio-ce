"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import EmptyState from "@/components/EmptyState";
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
            throw new Error((await response.json()).error ?? "Unable to load service.");
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
        .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load service."));
      return;
    }

    const storage = getStorageAdapter();
    storage
      .seedInitialData()
      .then(() => storage.getServiceById(serviceIdOrToken))
      .then(setService)
      .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load service."));
  }, [mode, serviceIdOrToken]);

  const update = <K extends keyof FanIntake>(field: K, value: FanIntake[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  if (!service && !message) {
    return (
      <AppShell title="Fan Intake" description="Service not found.">
        <div className="panel">Loading intake form...</div>
      </AppShell>
    );
  }

  if (!service) {
    return (
      <AppShell title="Fan Intake" description="Service not found.">
        <EmptyState title="Service not found" description={message || "Open a valid service intake link from the service menu."} />
      </AppShell>
    );
  }

  if (submittedCaseId) {
    return (
      <AppShell title="Fan Intake" description="Intake submitted.">
        <section className="panel">
          <h2>Intake submitted</h2>
          <p className="muted">Your structured intake was received. No photo, phone, wechat, id card, address, or email is required.</p>
          <p className="muted">Case reference: {submittedCaseId}</p>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell title="Fan Intake" description="CE MVP collects structured text fields only. No real photo upload.">
      <div className="notice">
        {"当前 CE MVP 不上传真实照片。照片不是 StyleOS 的核心知识资产。本产品重点沉淀“特征标签 -> 造型方案 -> 执行反馈”。"}
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
                throw new Error(result.error ?? "Unable to submit intake.");
              }
              setSubmittedCaseId(result.case_id);
            } catch (error) {
              setMessage(error instanceof Error ? error.message : "Unable to submit intake.");
            }
            return;
          }

          const storage = getStorageAdapter();
          const nextCase = createCaseFromIntake(service, form);
          const savedCase = await storage.createCase(nextCase);
          router.push(`/cases/${savedCase.caseId}`);
        }}
      >
        {message ? <div className="notice">{message}</div> : null}
        <div className="form-grid">
          <label className="field">
            fan nickname
            <input value={form.fanNickname} onChange={(event) => update("fanNickname", event.target.value)} />
          </label>
          <label className="field">
            target scenario
            <input value={form.targetScenario} onChange={(event) => update("targetScenario", event.target.value)} />
          </label>
          <label className="field full">
            current hairstyle concern
            <textarea
              value={form.currentHairstyleConcern}
              onChange={(event) => update("currentHairstyleConcern", event.target.value)}
            />
          </label>
          <label className="field full">
            styling goal
            <textarea value={form.stylingGoal} onChange={(event) => update("stylingGoal", event.target.value)} />
          </label>
          <label className="field">
            face shape tag
            <select value={form.faceShapeTag} onChange={(event) => update("faceShapeTag", event.target.value)}>
              <option value="oval">oval</option>
              <option value="round">round</option>
              <option value="long">long</option>
              <option value="square">square</option>
              <option value="heart">heart</option>
            </select>
          </label>
          <label className="field">
            forehead impression
            <select value={form.foreheadImpression} onChange={(event) => update("foreheadImpression", event.target.value)}>
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
          </label>
          <label className="field">
            jawline signal
            <select value={form.jawlineSignal} onChange={(event) => update("jawlineSignal", event.target.value)}>
              <option value="soft">soft</option>
              <option value="square">square</option>
              <option value="narrow">narrow</option>
            </select>
          </label>
          <label className="field">
            hair volume
            <select value={form.hairVolume} onChange={(event) => update("hairVolume", event.target.value)}>
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
          </label>
          <label className="field">
            hair texture
            <select value={form.hairTexture} onChange={(event) => update("hairTexture", event.target.value)}>
              <option value="straight">straight</option>
              <option value="wavy">wavy</option>
              <option value="curly">curly</option>
            </select>
          </label>
          <label className="field">
            hair shape
            <select value={form.hairShape} onChange={(event) => update("hairShape", event.target.value)}>
              <option value="flat_crown">flat_crown</option>
              <option value="side_volume">side_volume</option>
              <option value="balanced">balanced</option>
            </select>
          </label>
          <label className="field">
            crown height
            <select value={form.crownHeight} onChange={(event) => update("crownHeight", event.target.value)}>
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
          </label>
          <label className="field">
            maintenance willingness
            <select value={form.maintenanceWillingness} onChange={(event) => update("maintenanceWillingness", event.target.value)}>
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
          </label>
          <label className="field">
            willingness to cut short
            <select value={form.willingnessToCutShort} onChange={(event) => update("willingnessToCutShort", event.target.value)}>
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
          </label>
          <label className="field">
            willingness to perm
            <select value={form.willingnessToPerm} onChange={(event) => update("willingnessToPerm", event.target.value)}>
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
          </label>
          <label className="field">
            willingness to color
            <select value={form.willingnessToColor} onChange={(event) => update("willingnessToColor", event.target.value)}>
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
          </label>
          <label className="field full">
            workplace / school constraints
            <textarea
              value={form.workplaceSchoolConstraints}
              onChange={(event) => update("workplaceSchoolConstraints", event.target.value)}
            />
          </label>
          <label className="field full">
            creator notes
            <textarea value={form.creatorNotes} onChange={(event) => update("creatorNotes", event.target.value)} />
          </label>
          <label className="field full">
            <span>
              <input
                checked={form.consentToLocalProcessing}
                onChange={(event) => update("consentToLocalProcessing", event.target.checked)}
                type="checkbox"
              />{" "}
              I understand this CE MVP stores structured intake in the current {mode === "supabase" ? "Supabase Mode" : "Local Mode"} workflow.
            </span>
          </label>
        </div>
        <button className="button primary" disabled={!form.consentToLocalProcessing} type="submit">
          Submit Intake
        </button>
      </form>
    </AppShell>
  );
}

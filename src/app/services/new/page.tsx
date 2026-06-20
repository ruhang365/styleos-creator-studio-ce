"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { getStorageMode } from "@/lib/config-public";
import { getStorageAdapter } from "@/lib/storage";
import type { Service, ServiceStatus } from "@/types";

const initialForm = {
  serviceName: "发型适配咨询卡",
  description: "发型咨询服务，包含采集信息、生成标签、匹配规则、顾客报告、理发师沟通卡和反馈。",
  priceNote: "",
  deliveryFormat: "顾客报告 Lite Report + 理发师沟通卡 Barber Brief",
  status: "active" as ServiceStatus
};

export default function NewServicePage() {
  const router = useRouter();
  const mode = getStorageMode();
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");

  useEffect(() => {
    void getStorageAdapter().seedInitialData();
  }, []);

  return (
    <AppShell title="新建服务链接" description="当前 Alpha 只开放发型咨询模块。">
      <form
        className="form-card"
        onSubmit={async (event) => {
          event.preventDefault();
          const storage = getStorageAdapter();
          const creator = await storage.getCurrentCreator();
          if (!creator) {
            setMessage("云端模式需要先完成创作者登录，再创建服务。");
            return;
          }
          const service: Omit<Service, "serviceId" | "createdAt" | "updatedAt" | "intakePath"> = {
            creatorId: creator.creatorId,
            serviceName: form.serviceName,
            module: "hairstyle",
            description: form.description,
            priceNote: form.priceNote,
            deliveryFormat: form.deliveryFormat,
            status: form.status
          };
          try {
            const savedService = await storage.createService(service);
            router.push(`/services/${savedService.serviceId}`);
          } catch (error) {
            setMessage(error instanceof Error ? error.message : "无法保存服务。");
          }
        }}
      >
        {message ? <div className="notice">{message}</div> : null}
        <p className="muted">当前模式：{mode === "supabase" ? "云端模式" : "本地模式"}</p>
        <div className="form-grid">
          <label className="field">
            服务名称
            <input value={form.serviceName} onChange={(event) => setForm({ ...form, serviceName: event.target.value })} />
          </label>
          <label className="field">
            服务模块
            <select value="hairstyle" onChange={() => undefined}>
              <option value="hairstyle">发型咨询</option>
              <option disabled value="wardrobe">
                穿搭模块暂未开放
              </option>
              <option disabled value="makeup">
                妆容模块暂未开放
              </option>
            </select>
          </label>
          <label className="field full">
            服务说明
            <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          </label>
          <label className="field">
            价格备注（可选）
            <input value={form.priceNote} onChange={(event) => setForm({ ...form, priceNote: event.target.value })} />
          </label>
          <label className="field">
            交付形式
            <input value={form.deliveryFormat} onChange={(event) => setForm({ ...form, deliveryFormat: event.target.value })} />
          </label>
          <label className="field">
            状态
            <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as ServiceStatus })}>
              <option value="active">启用中</option>
              <option value="draft">草稿</option>
              <option value="paused">暂停</option>
            </select>
          </label>
        </div>
        <button className="button primary" type="submit">
          保存服务
        </button>
      </form>
    </AppShell>
  );
}

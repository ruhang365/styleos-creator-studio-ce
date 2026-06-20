"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import CaseCard from "@/components/CaseCard";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import { createSyntheticFanCase } from "@/lib/caseFactory";
import { getStorageMode } from "@/lib/config-public";
import { getStorageAdapter } from "@/lib/storage";
import type { FanCase, Service } from "@/types";

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = String(params.serviceId ?? "");
  const mode = getStorageMode();
  const [service, setService] = useState<Service | null>(null);
  const [cases, setCases] = useState<FanCase[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storage = getStorageAdapter();
    setIsLoading(true);
    storage
      .seedInitialData()
      .then(() => Promise.all([storage.getServiceById(serviceId), storage.listCases()]))
      .then(([nextService, nextCases]) => {
        setService(nextService);
        setCases(nextCases.filter((caseItem) => caseItem.serviceId === serviceId));
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "无法加载服务。"))
      .finally(() => setIsLoading(false));
  }, [serviceId]);

  const createSynthetic = async () => {
    if (!service) {
      return;
    }
    const storage = getStorageAdapter();
    const nextCase = createSyntheticFanCase(service);
    const savedCase = await storage.createCase(nextCase);
    router.push(`/cases/${savedCase.caseId}`);
  };

  if (!service && isLoading) {
    return (
      <AppShell title="服务详情" description="正在加载服务。">
        <EmptyState title="正在加载服务" description="正在加载当前工作区的服务链接。" />
      </AppShell>
    );
  }

  if (!service) {
    return (
      <AppShell title="服务详情" description="未找到服务。">
        <EmptyState title="未找到服务" description="返回服务链接列表，选择一个可用服务。" />
      </AppShell>
    );
  }

  return (
    <AppShell title={service.serviceName} description="查看服务详情、采集链接和关联案例。">
      {message ? <div className="notice">{message}</div> : null}
      <section className="panel">
        <div className="card-row">
          <div>
            <h2>{service.serviceName}</h2>
            <p className="muted">{service.description}</p>
          </div>
          <StatusBadge status={service.status} />
        </div>
        <p className="muted">交付形式：{service.deliveryFormat}</p>
        <p className="muted">本地采集链接：/intake/{service.serviceId}</p>
        {mode === "supabase" && service.intakeToken ? (
          <p className="muted">云端采集链接：/intake/{service.intakeToken}</p>
        ) : (
          <p className="muted">跨设备分享采集链接需要使用云端模式。</p>
        )}
        <div className="actions">
          <button className="button primary" onClick={createSynthetic} type="button">
            录入体验案例
          </button>
          <Link className="button" href={mode === "supabase" && service.intakeToken ? `/intake/${service.intakeToken}` : `/intake/${service.serviceId}`}>
            打开采集表
          </Link>
        </div>
      </section>

      <section className="grid two">
        {cases.length === 0 ? (
          <EmptyState title="这个服务还没有案例" description="可以先录入体验案例，或打开采集表提交一条测试采集。" />
        ) : (
          cases.map((caseItem) => <CaseCard caseItem={caseItem} key={caseItem.caseId} />)
        )}
      </section>
    </AppShell>
  );
}

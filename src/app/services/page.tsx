"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import EmptyState from "@/components/EmptyState";
import ServiceCard from "@/components/ServiceCard";
import { getStorageMode } from "@/lib/config-public";
import { getStorageAdapter } from "@/lib/storage";
import type { FanCase, Service } from "@/types";

export default function ServicesPage() {
  const mode = getStorageMode();
  const [services, setServices] = useState<Service[]>([]);
  const [cases, setCases] = useState<FanCase[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storage = getStorageAdapter();
    storage
      .seedInitialData()
      .then(() => Promise.all([storage.listServices(), storage.listCases()]))
      .then(([nextServices, nextCases]) => {
        setServices(nextServices);
        setCases(nextCases);
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "无法加载服务链接。"));
  }, []);

  return (
    <AppShell title="服务链接" description={`管理顾客采集入口 · ${mode === "supabase" ? "云端工作区" : "本地工作区"}`}>
      {message ? <div className="notice">{message}</div> : null}
      <section className="page-header">
        <div>
          <h2>采集入口管理</h2>
          <p>每个服务对应一条采集链接，把它发给顾客即可开始一次发型咨询。当前仅开放“发型”模块。</p>
        </div>
        <Link className="button primary" href="/services/new">
          新建服务链接
        </Link>
      </section>

      {services.length === 0 ? (
        <EmptyState
          title="还没有服务链接"
          description="创建一个发型服务，生成采集链接后即可开始咨询流程。"
          action={
            <Link className="button primary" href="/services/new">
              新建服务链接
            </Link>
          }
        />
      ) : (
        <section className="grid two">
          {services.map((service) => (
            <ServiceCard
              caseCount={cases.filter((caseItem) => caseItem.serviceId === service.serviceId).length}
              key={service.serviceId}
              service={service}
            />
          ))}
        </section>
      )}
    </AppShell>
  );
}

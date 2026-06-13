"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import CaseCard from "@/components/CaseCard";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import { createSyntheticFanCase } from "@/lib/caseFactory";
import { getCases, getServices, saveCases, seedInitialData } from "@/lib/storage";
import type { FanCase, Service } from "@/types";

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = String(params.serviceId ?? "");
  const [service, setService] = useState<Service | null>(null);
  const [cases, setCases] = useState<FanCase[]>([]);

  useEffect(() => {
    seedInitialData();
    const services = getServices();
    setService(services.find((item) => item.serviceId === serviceId) ?? null);
    setCases(getCases().filter((caseItem) => caseItem.serviceId === serviceId));
  }, [serviceId]);

  const createSynthetic = () => {
    if (!service) {
      return;
    }
    const nextCase = createSyntheticFanCase(service);
    saveCases([nextCase, ...getCases()]);
    router.push(`/cases/${nextCase.caseId}`);
  };

  if (!service) {
    return (
      <AppShell title="Service Detail" description="Service not found in localStorage.">
        <EmptyState title="Service not found" description="Return to the service menu and choose an available local service." />
      </AppShell>
    );
  }

  return (
    <AppShell title={service.serviceName} description="Service detail, intake link, and related local cases.">
      <section className="panel">
        <div className="card-row">
          <div>
            <h2>{service.serviceName}</h2>
            <p className="muted">{service.description}</p>
          </div>
          <StatusBadge status={service.status} />
        </div>
        <p className="muted">Delivery format: {service.deliveryFormat}</p>
        <p className="muted">Intake link: {service.intakePath}</p>
        <div className="actions">
          <button className="button primary" onClick={createSynthetic} type="button">
            Create Synthetic Case
          </button>
          <Link className="button" href={service.intakePath}>
            Open Intake Form
          </Link>
        </div>
      </section>

      <section className="grid two">
        {cases.length === 0 ? (
          <EmptyState title="No cases for this service" description="Create a synthetic case or open the intake form." />
        ) : (
          cases.map((caseItem) => <CaseCard caseItem={caseItem} key={caseItem.caseId} />)
        )}
      </section>
    </AppShell>
  );
}

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
      .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load service."))
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
      <AppShell title="Service Detail" description="Loading service.">
        <EmptyState title="Loading service" description="Loading the cloud service for the current creator session." />
      </AppShell>
    );
  }

  if (!service) {
    return (
      <AppShell title="Service Detail" description="Service not found.">
        <EmptyState title="Service not found" description="Return to the service menu and choose an available service." />
      </AppShell>
    );
  }

  return (
    <AppShell title={service.serviceName} description="Service detail, intake link, and related cases.">
      {message ? <div className="notice">{message}</div> : null}
      <section className="panel">
        <div className="card-row">
          <div>
            <h2>{service.serviceName}</h2>
            <p className="muted">{service.description}</p>
          </div>
          <StatusBadge status={service.status} />
        </div>
        <p className="muted">Delivery format: {service.deliveryFormat}</p>
        <p className="muted">Local intake link: /intake/{service.serviceId}</p>
        {mode === "supabase" && service.intakeToken ? (
          <p className="muted">Cloud intake link: /intake/{service.intakeToken}</p>
        ) : (
          <p className="muted">Enable Supabase Mode to share intake links across devices.</p>
        )}
        <div className="actions">
          <button className="button primary" onClick={createSynthetic} type="button">
            Create Synthetic Case
          </button>
          <Link className="button" href={mode === "supabase" && service.intakeToken ? `/intake/${service.intakeToken}` : `/intake/${service.serviceId}`}>
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

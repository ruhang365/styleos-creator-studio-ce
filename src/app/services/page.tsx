"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import EmptyState from "@/components/EmptyState";
import ServiceCard from "@/components/ServiceCard";
import { getCases, getServices, seedInitialData } from "@/lib/storage";
import type { FanCase, Service } from "@/types";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [cases, setCases] = useState<FanCase[]>([]);

  useEffect(() => {
    seedInitialData();
    setServices(getServices());
    setCases(getCases());
  }, []);

  return (
    <AppShell title="Services" description="Creator service menu for local Hairstyle Workflow services.">
      <section className="page-header">
        <div>
          <h2>Service menu</h2>
          <p>Default seed service: Hairstyle Suitability Card. Other modules are intentionally out of scope in v0.2.</p>
        </div>
        <Link className="button primary" href="/services/new">
          Create Service
        </Link>
      </section>

      {services.length === 0 ? (
        <EmptyState
          title="No services yet"
          description="Create a hairstyle service to start a local CE workflow."
          action={
            <Link className="button primary" href="/services/new">
              Create Service
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

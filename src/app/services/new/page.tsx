"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { getCreator, getServices, saveServices, seedInitialData } from "@/lib/storage";
import { createId, nowIso } from "@/lib/ids";
import type { Service, ServiceStatus } from "@/types";

const initialForm = {
  serviceName: "Hairstyle Suitability Card",
  description: "Local hairstyle suitability workflow with intake, tags, rules, report, barber brief, and feedback.",
  priceNote: "",
  deliveryFormat: "Markdown Lite Report + Barber Brief",
  status: "active" as ServiceStatus
};

export default function NewServicePage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    seedInitialData();
  }, []);

  return (
    <AppShell title="Create Service" description="Only the hairstyle module is active in CE v0.2.">
      <form
        className="form-card"
        onSubmit={(event) => {
          event.preventDefault();
          const creator = getCreator();
          const serviceId = createId("service");
          const now = nowIso();
          const service: Service = {
            serviceId,
            creatorId: creator.creatorId,
            serviceName: form.serviceName,
            module: "hairstyle",
            description: form.description,
            priceNote: form.priceNote,
            deliveryFormat: form.deliveryFormat,
            status: form.status,
            intakePath: `/intake/${serviceId}`,
            createdAt: now,
            updatedAt: now
          };
          saveServices([service, ...getServices()]);
          router.push(`/services/${serviceId}`);
        }}
      >
        <div className="form-grid">
          <label className="field">
            Service name
            <input value={form.serviceName} onChange={(event) => setForm({ ...form, serviceName: event.target.value })} />
          </label>
          <label className="field">
            Module
            <select value="hairstyle" onChange={() => undefined}>
              <option value="hairstyle">hairstyle</option>
              <option disabled value="wardrobe">
                wardrobe - Coming Soon
              </option>
              <option disabled value="makeup">
                makeup - Coming Soon
              </option>
            </select>
          </label>
          <label className="field full">
            Description
            <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          </label>
          <label className="field">
            Price note, optional local note only
            <input value={form.priceNote} onChange={(event) => setForm({ ...form, priceNote: event.target.value })} />
          </label>
          <label className="field">
            Delivery format
            <input value={form.deliveryFormat} onChange={(event) => setForm({ ...form, deliveryFormat: event.target.value })} />
          </label>
          <label className="field">
            Status
            <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as ServiceStatus })}>
              <option value="active">active</option>
              <option value="draft">draft</option>
              <option value="paused">paused</option>
            </select>
          </label>
        </div>
        <button className="button primary" type="submit">
          Save Service
        </button>
      </form>
    </AppShell>
  );
}

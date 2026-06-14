"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import CaseCard from "@/components/CaseCard";
import EmptyState from "@/components/EmptyState";
import { getStorageMode } from "@/lib/config-public";
import { getStorageAdapter } from "@/lib/storage";
import type { CaseStatus, FanCase } from "@/types";

const statuses: CaseStatus[] = [
  "intake_submitted",
  "tagging",
  "rule_matching",
  "report_draft",
  "creator_review",
  "delivered",
  "feedback_received",
  "candidate_extracted",
  "archived"
];

export default function CasesPage() {
  const mode = getStorageMode();
  const [cases, setCases] = useState<FanCase[]>([]);
  const [filter, setFilter] = useState<CaseStatus | "all">("all");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storage = getStorageAdapter();
    storage
      .seedInitialData()
      .then(() => storage.listCases())
      .then(setCases)
      .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load cases."));
  }, []);

  const visibleCases = filter === "all" ? cases : cases.filter((caseItem) => caseItem.status === filter);

  return (
    <AppShell title="Cases" description={`All ${mode === "supabase" ? "cloud" : "local"} fan cases, with status filters and next-action routing.`}>
      {message ? <div className="notice">{message}</div> : null}
      <section className="page-header">
        <div>
          <h2>Case management</h2>
          <p>Do not enter real personal identity data or raw photos in this CE skeleton.</p>
        </div>
        <Link className="button primary" href="/services">
          Create from Service
        </Link>
      </section>

      <div className="filter-row">
        <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")} type="button">
          all
        </button>
        {statuses.map((status) => (
          <button className={filter === status ? "active" : ""} key={status} onClick={() => setFilter(status)} type="button">
            {status.replaceAll("_", " ")}
          </button>
        ))}
      </div>

      {visibleCases.length === 0 ? (
        <EmptyState title="No cases found" description="Create a synthetic fan case from Dashboard or a service detail page." />
      ) : (
        <section className="grid two">
          {visibleCases.map((caseItem) => (
            <CaseCard caseItem={caseItem} key={caseItem.caseId} />
          ))}
        </section>
      )}
    </AppShell>
  );
}

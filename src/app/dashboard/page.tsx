"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { createSyntheticFanCase } from "@/lib/caseFactory";
import { getStorageMode, isSupabaseModeRequestedButIncomplete } from "@/lib/config-public";
import { getStorageAdapter } from "@/lib/storage";
import type { CandidateKnowledge, Creator, FanCase, LiteReport, Service } from "@/types";

export default function DashboardPage() {
  const mode = getStorageMode();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [cases, setCases] = useState<FanCase[]>([]);
  const [reports, setReports] = useState<LiteReport[]>([]);
  const [candidates, setCandidates] = useState<CandidateKnowledge[]>([]);
  const [message, setMessage] = useState("");

  const refresh = async () => {
    const storage = getStorageAdapter();
    try {
      await storage.seedInitialData();
      const [nextCreator, nextServices, nextCases, nextReports, nextCandidates] = await Promise.all([
        storage.getCurrentCreator(),
        storage.listServices(),
        storage.listCases(),
        storage.listReports(),
        storage.listCandidateKnowledge()
      ]);
      setCreator(nextCreator);
      setServices(nextServices);
      setCases(nextCases);
      setReports(nextReports);
      setCandidates(nextCandidates);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load dashboard data.");
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const createSynthetic = async () => {
    const storage = getStorageAdapter();
    const service = services[0] ?? (await storage.listServices())[0];
    if (!service) {
      setMessage("Create a service before adding a synthetic case.");
      return;
    }
    const nextCase = createSyntheticFanCase(service);
    const savedCase = await storage.createCase(nextCase);
    await refresh();
    setMessage(`Created synthetic case ${savedCase.fanNickname}.`);
  };

  const resetLocal = async () => {
    const storage = getStorageAdapter();
    await storage.resetAllData();
    await refresh();
    setMessage("Local data reset to CE seed state.");
  };

  const pendingCases = cases.filter((caseItem) => !["delivered", "feedback_received", "candidate_extracted"].includes(caseItem.status));
  const deliveredReports = reports.filter((report) => report.status === "delivered");

  return (
    <AppShell title="Dashboard" description={`${mode === "supabase" ? "Supabase" : "Local"} creator workspace for the Hairstyle Workflow MVP.`}>
      {isSupabaseModeRequestedButIncomplete() ? (
        <div className="notice">Supabase Mode was requested but is not fully configured. The app is using Local Mode.</div>
      ) : null}
      <section className="page-header">
        <div>
          <h2>{creator?.studioName ?? "StyleOS Local Studio"}</h2>
          <p>{creator?.displayName ?? "Synthetic Creator"} · {mode === "supabase" ? "Supabase Mode" : "Local Mode"} · hairstyle workflow only.</p>
        </div>
        <div className="actions">
          <Link className="button primary" href="/services/new">
            Create Hairstyle Service
          </Link>
          <button className="button" onClick={createSynthetic} type="button">
            New Synthetic Fan Case
          </button>
          <Link className="button" href="/knowledge/candidates">
            View Candidate Queue
          </Link>
        </div>
      </section>

      {message ? <div className="notice">{message}</div> : null}

      <section className="grid five">
        <article className="panel metric">
          <span className="muted">Total services</span>
          <strong>{services.length}</strong>
        </article>
        <article className="panel metric">
          <span className="muted">Total cases</span>
          <strong>{cases.length}</strong>
        </article>
        <article className="panel metric">
          <span className="muted">Pending cases</span>
          <strong>{pendingCases.length}</strong>
        </article>
        <article className="panel metric">
          <span className="muted">Delivered reports</span>
          <strong>{deliveredReports.length}</strong>
        </article>
        <article className="panel metric">
          <span className="muted">Candidate knowledge</span>
          <strong>{candidates.length}</strong>
        </article>
      </section>

      <section className="grid two">
        <div className="panel">
          <h3>Creator profile</h3>
          <p className="muted">Display name: {creator?.displayName}</p>
          <p className="muted">Creator type: {creator?.creatorType}</p>
          <p className="muted">Focus area: {creator?.focusArea}</p>
          <Link className="button" href="/login">
            Edit Local Profile
          </Link>
        </div>
        <div className="panel">
          <h3>Data controls</h3>
          <p className="muted">
            {mode === "local"
              ? "Reset removes localStorage records and restores only synthetic CE seed data."
              : "Cloud reset is disabled in CE. Use Supabase dashboard procedures for cloud data governance."}
          </p>
          <button className="button danger" disabled={mode !== "local"} onClick={resetLocal} type="button">
            Reset Local Data
          </button>
        </div>
      </section>
    </AppShell>
  );
}

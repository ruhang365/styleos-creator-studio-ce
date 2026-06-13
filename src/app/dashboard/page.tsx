"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { createSyntheticFanCase } from "@/lib/caseFactory";
import {
  getCandidateKnowledge,
  getCases,
  getCreator,
  getReports,
  getServices,
  resetAllData,
  saveCases,
  seedInitialData
} from "@/lib/storage";
import type { CandidateKnowledge, Creator, FanCase, LiteReport, Service } from "@/types";

export default function DashboardPage() {
  const [creator, setCreator] = useState<Creator | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [cases, setCases] = useState<FanCase[]>([]);
  const [reports, setReports] = useState<LiteReport[]>([]);
  const [candidates, setCandidates] = useState<CandidateKnowledge[]>([]);
  const [message, setMessage] = useState("");

  const refresh = () => {
    setCreator(getCreator());
    setServices(getServices());
    setCases(getCases());
    setReports(getReports());
    setCandidates(getCandidateKnowledge());
  };

  useEffect(() => {
    seedInitialData();
    refresh();
  }, []);

  const createSynthetic = () => {
    const service = services[0] ?? getServices()[0];
    const nextCase = createSyntheticFanCase(service);
    const nextCases = [nextCase, ...getCases()];
    saveCases(nextCases);
    setCases(nextCases);
    setMessage(`Created synthetic case ${nextCase.fanNickname}.`);
  };

  const resetLocal = () => {
    resetAllData();
    refresh();
    setMessage("Local data reset to CE seed state.");
  };

  const pendingCases = cases.filter((caseItem) => !["delivered", "feedback_received", "candidate_extracted"].includes(caseItem.status));
  const deliveredReports = reports.filter((report) => report.status === "delivered");

  return (
    <AppShell title="Dashboard" description="Local creator workspace for the Hairstyle Workflow MVP skeleton.">
      <section className="page-header">
        <div>
          <h2>{creator?.studioName ?? "StyleOS Local Studio"}</h2>
          <p>{creator?.displayName ?? "Synthetic Creator"} · CE local-only workspace · no Cloud account required.</p>
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
          <h3>Local data controls</h3>
          <p className="muted">Reset removes localStorage records and restores only synthetic CE seed data.</p>
          <button className="button danger" onClick={resetLocal} type="button">
            Reset Local Data
          </button>
        </div>
      </section>
    </AppShell>
  );
}

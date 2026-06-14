"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import EmptyState from "@/components/EmptyState";
import RuleCard from "@/components/RuleCard";
import { hairstyleRules } from "@/data/hairstyleRules";
import { nowIso } from "@/lib/ids";
import { matchRules } from "@/lib/ruleMatcher";
import { getStorageAdapter } from "@/lib/storage";
import type { FanCase, RuleMatch } from "@/types";

export default function RuleMatchingPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = String(params.caseId ?? "");
  const [caseItem, setCaseItem] = useState<FanCase | null>(null);
  const [matches, setMatches] = useState<RuleMatch[]>([]);
  const [selectedRuleIds, setSelectedRuleIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storage = getStorageAdapter();
    setIsLoading(true);
    storage
      .seedInitialData()
      .then(() => storage.getCaseById(caseId))
      .then((found) => {
        setCaseItem(found);
        setMatches(found?.ruleMatches ?? []);
        setSelectedRuleIds(found?.selectedRuleIds ?? []);
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load case."))
      .finally(() => setIsLoading(false));
  }, [caseId]);

  const autoMatch = () => {
    if (!caseItem) {
      return;
    }
    const nextMatches = matchRules(caseItem.tags, hairstyleRules);
    setMatches(nextMatches);
    setSelectedRuleIds(nextMatches.filter((match) => match.selected).map((match) => match.ruleId));
  };

  const save = async () => {
    if (!caseItem) {
      return;
    }
    const nextMatches = matches.map((match) => ({ ...match, selected: selectedRuleIds.includes(match.ruleId) }));
    const storage = getStorageAdapter();
    await storage.updateCase(caseItem.caseId, {
      ruleMatches: nextMatches,
      selectedRuleIds,
      status: "rule_matching",
      updatedAt: nowIso()
    });
    setMessage("Selected rules saved. Case status is now rule_matching.");
  };

  if (!caseItem && isLoading) {
    return (
      <AppShell title="Rule Matching" description="Loading case.">
        <EmptyState title="Loading case" description="Loading the cloud fan case for the current creator session." />
      </AppShell>
    );
  }

  if (!caseItem) {
    return (
      <AppShell title="Rule Matching" description="Case not found.">
        <EmptyState title="Case not found" description="Return to the case list and open a valid case." />
      </AppShell>
    );
  }

  return (
    <AppShell title="Rule Matching" description="Match local hairstyle seed rules against saved Style Tags.">
      {caseItem.tags.length === 0 ? (
        <div className="notice">No tags saved yet. Open Tag Workbench first for better matches.</div>
      ) : null}
      {message ? <div className="notice">{message}</div> : null}
      <section className="panel">
        <div className="actions">
          <button className="button primary" onClick={autoMatch} type="button">
            Auto Match Rules
          </button>
          <button className="button" onClick={save} type="button">
            Save Selected Rules
          </button>
          <button className="button ghost" onClick={() => router.push(`/cases/${caseItem.caseId}/report`)} type="button">
            Continue to Report
          </button>
        </div>
      </section>
      <section className="grid two">
        {hairstyleRules.map((rule) => {
          const match = matches.find((item) => item.ruleId === rule.rule_id);
          const selected = selectedRuleIds.includes(rule.rule_id);
          return (
            <RuleCard
              key={rule.rule_id}
              match={match}
              onToggle={(ruleId) =>
                setSelectedRuleIds((current) =>
                  current.includes(ruleId) ? current.filter((item) => item !== ruleId) : [...current, ruleId]
                )
              }
              rule={rule}
              selected={selected}
            />
          );
        })}
      </section>
    </AppShell>
  );
}

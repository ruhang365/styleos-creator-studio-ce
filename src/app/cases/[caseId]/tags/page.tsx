"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import EmptyState from "@/components/EmptyState";
import TagChip from "@/components/TagChip";
import { createId, nowIso } from "@/lib/ids";
import { generateStyleTags } from "@/lib/tagger";
import { getStorageAdapter } from "@/lib/storage";
import type { FanCase, StyleTag } from "@/types";

export default function TagWorkbenchPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = String(params.caseId ?? "");
  const [caseItem, setCaseItem] = useState<FanCase | null>(null);
  const [tags, setTags] = useState<StyleTag[]>([]);
  const [manualTag, setManualTag] = useState("");
  const [manualGroup, setManualGroup] = useState<StyleTag["group"]>("Goal");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storage = getStorageAdapter();
    storage
      .seedInitialData()
      .then(() => storage.getCaseById(caseId))
      .then((found) => {
        setCaseItem(found);
        setTags(found?.tags ?? []);
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load case."));
  }, [caseId]);

  const save = async () => {
    if (!caseItem) {
      return;
    }
    const storage = getStorageAdapter();
    await storage.updateCase(caseItem.caseId, { tags, status: "tagging", updatedAt: nowIso() });
    setMessage("Tags saved. Case status is now tagging.");
  };

  if (!caseItem) {
    return (
      <AppShell title="Tag Workbench" description="Case not found.">
        <EmptyState title="Case not found" description="Return to the case list and open a valid case." />
      </AppShell>
    );
  }

  return (
    <AppShell title="Tag Workbench" description="Generate initial style tags from intake, then adjust manually.">
      {message ? <div className="notice">{message}</div> : null}
      <section className="panel">
        <h3>Intake basis</h3>
        <p className="muted">{caseItem.intake.currentHairstyleConcern}</p>
        <p className="muted">{caseItem.intake.stylingGoal}</p>
        <div className="actions">
          <button className="button primary" onClick={() => setTags(generateStyleTags(caseItem.intake))} type="button">
            Generate Tags
          </button>
          <button className="button" onClick={save} type="button">
            Save Tags
          </button>
          <button className="button ghost" onClick={() => router.push(`/cases/${caseItem.caseId}/rules`)} type="button">
            Continue to Rules
          </button>
        </div>
      </section>

      <section className="form-card">
        <h3>Manually add tag</h3>
        <div className="form-grid">
          <label className="field">
            Tag group
            <select value={manualGroup} onChange={(event) => setManualGroup(event.target.value as StyleTag["group"])}>
              <option value="Basic">Basic</option>
              <option value="Face & Proportion">Face & Proportion</option>
              <option value="Hair Attribute">Hair Attribute</option>
              <option value="Goal">Goal</option>
              <option value="Constraint">Constraint</option>
            </select>
          </label>
          <label className="field">
            Tag label
            <input value={manualTag} onChange={(event) => setManualTag(event.target.value)} placeholder="goal_clean_outline" />
          </label>
        </div>
        <button
          className="button"
          onClick={() => {
            if (!manualTag.trim()) {
              return;
            }
            setTags([
              ...tags,
              {
                tagId: createId("tag"),
                group: manualGroup,
                label: manualTag.trim(),
                value: manualTag.trim(),
                source: "manual"
              }
            ]);
            setManualTag("");
          }}
          type="button"
        >
          Add Tag
        </button>
      </section>

      <section className="panel">
        <h3>Selected tags</h3>
        <div className="chips">
          {tags.map((tag) => (
            <TagChip key={tag.tagId} onRemove={(tagId) => setTags(tags.filter((item) => item.tagId !== tagId))} tag={tag} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { getCreator, saveCreator, seedInitialData } from "@/lib/storage";
import { nowIso } from "@/lib/ids";
import type { Creator } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const [creator, setCreator] = useState<Creator | null>(null);

  useEffect(() => {
    seedInitialData();
    setCreator(getCreator());
  }, []);

  if (!creator) {
    return (
      <AppShell title="Creator Profile" description="Local profile loading.">
        <div className="panel">Loading local creator profile...</div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Creator Profile" description="No real login in CE v0.2. This profile is saved only in localStorage.">
      <form
        className="form-card"
        onSubmit={(event) => {
          event.preventDefault();
          saveCreator({ ...creator, updatedAt: nowIso() });
          router.push("/dashboard");
        }}
      >
        <div className="form-grid">
          <label className="field">
            Creator display name
            <input
              value={creator.displayName}
              onChange={(event) => setCreator({ ...creator, displayName: event.target.value })}
            />
          </label>
          <label className="field">
            Creator type
            <select
              value={creator.creatorType}
              onChange={(event) => setCreator({ ...creator, creatorType: event.target.value as Creator["creatorType"] })}
            >
              <option value="individual_creator">individual_creator</option>
              <option value="small_studio">small_studio</option>
              <option value="training_team">training_team</option>
            </select>
          </label>
          <label className="field">
            Focus area
            <input value={creator.focusArea} onChange={(event) => setCreator({ ...creator, focusArea: event.target.value })} />
          </label>
          <label className="field">
            Studio name
            <input value={creator.studioName} onChange={(event) => setCreator({ ...creator, studioName: event.target.value })} />
          </label>
        </div>
        <button className="button primary" type="submit">
          Save and enter dashboard
        </button>
      </form>
    </AppShell>
  );
}

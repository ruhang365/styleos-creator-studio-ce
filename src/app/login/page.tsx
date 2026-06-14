"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { getRequestedStorageMode, getStorageMode, isSupabaseConfigured, isSupabaseModeRequestedButIncomplete } from "@/lib/config-public";
import { getCurrentUser, signInWithOtp, signOut } from "@/lib/supabase/auth";
import { getCreator, saveCreator, seedInitialData } from "@/lib/storage";
import { nowIso } from "@/lib/ids";
import type { Creator } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const mode = getStorageMode();
  const requestedMode = getRequestedStorageMode();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [email, setEmail] = useState("");
  const [userStatus, setUserStatus] = useState("checking");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (mode === "local") {
      seedInitialData();
      setCreator(getCreator());
      setUserStatus("local mode");
      return;
    }

    getCurrentUser()
      .then((user) => setUserStatus(user ? "logged in" : "not logged in"))
      .catch(() => setUserStatus("not logged in"));
  }, [mode]);

  if (mode === "supabase") {
    return (
      <AppShell title="Creator Login" description="Supabase Mode uses ruhang365 auth.users with email magic link login.">
        <section className="panel">
          <h2>Supabase Mode</h2>
          <p className="muted">Current user: {userStatus}</p>
          <p className="muted">Creator profile is not written to public.profiles in CE v0.2.2.</p>
        </section>

        {message ? <div className="notice">{message}</div> : null}

        <form
          className="form-card"
          onSubmit={async (event) => {
            event.preventDefault();
            try {
              const { error } = await signInWithOtp(email);
              if (error) {
                throw error;
              }
              setMessage("Magic link sent. Open the link in this browser to complete login.");
            } catch (error) {
              setMessage("Unable to send magic link. Use an existing internal test account and check redirect URL settings.");
            }
          }}
        >
          <div className="form-grid">
            <label className="field">
              Email
              <input
                autoComplete="email"
                inputMode="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="creator@example.com"
                type="email"
                value={email}
              />
            </label>
          </div>
          <div className="actions">
            <button className="button primary" disabled={!email.trim()} type="submit">
              Send Magic Link
            </button>
            <button
              className="button"
              onClick={async () => {
                await signOut();
                setUserStatus("not logged in");
                setMessage("Signed out.");
              }}
              type="button"
            >
              Sign Out
            </button>
          </div>
        </form>
      </AppShell>
    );
  }

  if (!creator) {
    return (
      <AppShell title="Creator Profile" description="Local profile loading.">
        <div className="panel">Loading local creator profile...</div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Creator Profile" description="Local Mode profile is saved only in this browser.">
      {isSupabaseModeRequestedButIncomplete() ? (
        <div className="notice">
          Supabase Mode was requested, but public Supabase configuration is incomplete. Current mode is Local Mode.
        </div>
      ) : null}
      {requestedMode === "local" || !isSupabaseConfigured() ? null : <div className="notice">Current mode: {mode}</div>}
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

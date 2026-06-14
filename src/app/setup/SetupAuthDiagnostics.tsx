"use client";

import { useEffect, useState } from "react";
import type { StorageMode } from "@/lib/config-public";
import { getCurrentUser, getSession } from "@/lib/supabase/auth";

interface AuthDiagnosticState {
  sessionExists: string;
  userAuthenticated: string;
  callbackRouteAvailable: string;
}

export default function SetupAuthDiagnostics({ mode }: { mode: StorageMode }) {
  const [state, setState] = useState<AuthDiagnosticState>({
    sessionExists: mode === "local" ? "local mode" : "checking",
    userAuthenticated: mode === "local" ? "local mode" : "checking",
    callbackRouteAvailable: "yes"
  });

  useEffect(() => {
    if (mode === "local") {
      setState({
        sessionExists: "local mode",
        userAuthenticated: "local mode",
        callbackRouteAvailable: "yes"
      });
      return;
    }

    let mounted = true;
    Promise.all([getSession(), getCurrentUser()])
      .then(([session, user]) => {
        if (!mounted) {
          return;
        }
        setState({
          sessionExists: session ? "yes" : "no",
          userAuthenticated: user ? "yes" : "no",
          callbackRouteAvailable: "yes"
        });
      })
      .catch(() => {
        if (!mounted) {
          return;
        }
        setState({
          sessionExists: "no",
          userAuthenticated: "no",
          callbackRouteAvailable: "yes"
        });
      });

    return () => {
      mounted = false;
    };
  }, [mode]);

  return (
    <>
      <p className="muted">Session exists: {state.sessionExists}</p>
      <p className="muted">User authenticated: {state.userAuthenticated}</p>
      <p className="muted">Callback route available: {state.callbackRouteAvailable}</p>
    </>
  );
}

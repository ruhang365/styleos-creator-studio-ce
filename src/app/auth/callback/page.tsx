"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { completeAuthCallbackFromUrl } from "@/lib/supabase/auth";

type CallbackStatus = "checking" | "success" | "error";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<CallbackStatus>("checking");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    completeAuthCallbackFromUrl(window.location.href)
      .then((result) => {
        if (!mounted) {
          return;
        }
        if (result.ok) {
          setStatus("success");
          window.history.replaceState(null, "", "/auth/callback");
          router.replace("/dashboard");
          return;
        }
        setStatus("error");
        setError(result.error ?? "Unable to complete login.");
      })
      .catch(() => {
        if (mounted) {
          setStatus("error");
          setError("Unable to complete login.");
        }
      });

    return () => {
      mounted = false;
    };
  }, [router]);

  return (
    <AppShell title="Completing Login" description="Finishing Supabase magic link sign-in.">
      {status === "error" ? (
        <section className="panel">
          <h2>Login failed</h2>
          <p className="muted">{error}</p>
          <Link className="button primary" href="/login">
            Back to login
          </Link>
        </section>
      ) : status === "success" ? (
        <div className="panel">Login complete. Redirecting to dashboard...</div>
      ) : (
        <div className="panel">Completing login...</div>
      )}
    </AppShell>
  );
}

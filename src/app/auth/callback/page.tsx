"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { getSession } from "@/lib/supabase/auth";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    getSession()
      .then((session) => {
        if (!mounted) {
          return;
        }
        if (session) {
          router.replace("/dashboard");
          return;
        }
        setError("No Supabase session was found after callback.");
      })
      .catch((currentError) => {
        if (mounted) {
          setError(currentError instanceof Error ? currentError.message : "Unable to complete login.");
        }
      });

    return () => {
      mounted = false;
    };
  }, [router]);

  return (
    <AppShell title="Completing Login" description="Finishing Supabase magic link sign-in.">
      {error ? (
        <section className="panel">
          <h2>Login failed</h2>
          <p className="muted">{error}</p>
          <Link className="button primary" href="/login">
            Back to login
          </Link>
        </section>
      ) : (
        <div className="panel">Completing login...</div>
      )}
    </AppShell>
  );
}

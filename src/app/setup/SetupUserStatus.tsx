"use client";

import { useEffect, useState } from "react";
import type { StorageMode } from "@/lib/config-public";
import { getCurrentUser } from "@/lib/supabase/auth";

export default function SetupUserStatus({ mode }: { mode: StorageMode }) {
  const [status, setStatus] = useState(mode === "local" ? "local mode" : "checking");

  useEffect(() => {
    if (mode === "local") {
      setStatus("local mode");
      return;
    }

    let mounted = true;
    getCurrentUser()
      .then((user) => {
        if (mounted) {
          setStatus(user ? "logged in" : "not logged in");
        }
      })
      .catch(() => {
        if (mounted) {
          setStatus("not logged in");
        }
      });

    return () => {
      mounted = false;
    };
  }, [mode]);

  return <span>{status}</span>;
}

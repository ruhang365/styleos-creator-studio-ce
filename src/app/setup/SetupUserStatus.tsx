"use client";

import { useEffect, useState } from "react";
import type { StorageMode } from "@/lib/config-public";
import { getCurrentUser } from "@/lib/supabase/auth";

export default function SetupUserStatus({ mode }: { mode: StorageMode }) {
  const [status, setStatus] = useState(mode === "local" ? "本地模式" : "检查中");

  useEffect(() => {
    if (mode === "local") {
      setStatus("本地模式");
      return;
    }

    let mounted = true;
    getCurrentUser()
      .then((user) => {
        if (mounted) {
          setStatus(user ? "已登录" : "未登录");
        }
      })
      .catch(() => {
        if (mounted) {
          setStatus("未登录");
        }
      });

    return () => {
      mounted = false;
    };
  }, [mode]);

  return <span>{status}</span>;
}

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
    sessionExists: mode === "local" ? "本地模式" : "检查中",
    userAuthenticated: mode === "local" ? "本地模式" : "检查中",
    callbackRouteAvailable: "可用"
  });

  useEffect(() => {
    if (mode === "local") {
      setState({
        sessionExists: "本地模式",
        userAuthenticated: "本地模式",
        callbackRouteAvailable: "可用"
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
          sessionExists: session ? "有" : "无",
          userAuthenticated: user ? "已登录" : "未登录",
          callbackRouteAvailable: "可用"
        });
      })
      .catch(() => {
        if (!mounted) {
          return;
        }
        setState({
          sessionExists: "无",
          userAuthenticated: "未登录",
          callbackRouteAvailable: "可用"
        });
      });

    return () => {
      mounted = false;
    };
  }, [mode]);

  return (
    <>
      <p className="muted">登录会话：{state.sessionExists}</p>
      <p className="muted">登录状态：{state.userAuthenticated}</p>
      <p className="muted">回调页面：{state.callbackRouteAvailable}</p>
    </>
  );
}

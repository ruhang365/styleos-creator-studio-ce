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
        setError(result.error ?? "无法完成登录。");
      })
      .catch(() => {
        if (mounted) {
          setStatus("error");
          setError("无法完成登录。");
        }
      });

    return () => {
      mounted = false;
    };
  }, [router]);

  return (
    <AppShell title="正在完成登录" description="正在处理邮箱魔法链接登录。">
      {status === "error" ? (
        <section className="panel">
          <h2>登录失败</h2>
          <p className="muted">{error}</p>
          <Link className="button primary" href="/login">
            返回登录
          </Link>
        </section>
      ) : status === "success" ? (
        <div className="panel">登录完成，正在进入工作台...</div>
      ) : (
        <div className="panel">正在完成登录...</div>
      )}
    </AppShell>
  );
}

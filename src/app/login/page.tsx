"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { getRequestedStorageMode, getStorageMode, isSupabaseConfigured, isSupabaseModeRequestedButIncomplete } from "@/lib/config-public";
import { getCurrentUser, signOut } from "@/lib/supabase/auth";
import { getCreator, saveCreator, seedInitialData } from "@/lib/storage";
import { nowIso } from "@/lib/ids";
import type { Creator } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const mode = getStorageMode();
  const requestedMode = getRequestedStorageMode();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [email, setEmail] = useState("");
  const [userStatus, setUserStatus] = useState("检查中");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (mode === "local") {
      seedInitialData();
      setCreator(getCreator());
      setUserStatus("本地模式");
      return;
    }

    getCurrentUser()
      .then((user) => setUserStatus(user ? "已登录" : "未登录"))
      .catch(() => setUserStatus("未登录"));
  }, [mode]);

  if (mode === "supabase") {
    return (
      <AppShell title="创作者登录" description="邀请制 Alpha 登录。输入已授权邮箱，打开邮件链接后进入发型咨询工作台。">
        <section className="panel">
          <h2>内测登录</h2>
          <p className="muted">当前状态：{userStatus}</p>
          <p className="muted">Hosted Alpha 仅面向已邀请账号开放。未在 allowlist 内的邮箱不会获得访问权限。</p>
        </section>

        {message ? <div className="notice">{message}</div> : null}

        <form
          className="form-card"
          onSubmit={async (event) => {
            event.preventDefault();
            try {
              const response = await fetch("/api/auth/magic-link", {
                method: "POST",
                headers: {
                  "content-type": "application/json"
                },
                body: JSON.stringify({ email })
              });
              const result = (await response.json()) as { error?: string; message?: string };
              if (!response.ok) {
                throw new Error(result.error ?? "无法发送登录链接。");
              }
              setMessage(result.message ?? "登录链接已发送。请在这个浏览器里打开邮件链接完成登录。");
            } catch (error) {
              setMessage(error instanceof Error ? error.message : "无法发送登录链接，请确认使用已邀请的 Alpha 邮箱。");
            }
          }}
        >
          <div className="form-grid">
            <label className="field">
              登录邮箱
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
              发送登录链接
            </button>
            <button
              className="button"
              onClick={async () => {
                await signOut();
                setUserStatus("未登录");
                setMessage("已退出登录。");
              }}
              type="button"
            >
              退出登录
            </button>
          </div>
        </form>
      </AppShell>
    );
  }

  if (!creator) {
    return (
      <AppShell title="创作者资料" description="正在加载本地创作者资料。">
        <div className="panel">正在加载本地创作者资料...</div>
      </AppShell>
    );
  }

  return (
    <AppShell title="创作者资料" description="本地模式资料只保存在当前浏览器中。">
      {isSupabaseModeRequestedButIncomplete() ? (
        <div className="notice">
          已选择云端模式，但公开配置尚不完整，当前自动使用本地模式。
        </div>
      ) : null}
      {requestedMode === "local" || !isSupabaseConfigured() ? null : (
        <div className="notice">当前模式：本地模式</div>
      )}
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
            创作者昵称
            <input
              value={creator.displayName}
              onChange={(event) => setCreator({ ...creator, displayName: event.target.value })}
            />
          </label>
          <label className="field">
            创作者类型
            <select
              value={creator.creatorType}
              onChange={(event) => setCreator({ ...creator, creatorType: event.target.value as Creator["creatorType"] })}
            >
              <option value="individual_creator">个人创作者</option>
              <option value="small_studio">小型工作室</option>
              <option value="training_team">培训团队</option>
            </select>
          </label>
          <label className="field">
            擅长方向
            <input value={creator.focusArea} onChange={(event) => setCreator({ ...creator, focusArea: event.target.value })} />
          </label>
          <label className="field">
            工作室名称
            <input value={creator.studioName} onChange={(event) => setCreator({ ...creator, studioName: event.target.value })} />
          </label>
        </div>
        <button className="button primary" type="submit">
          保存并进入工作台
        </button>
      </form>
    </AppShell>
  );
}

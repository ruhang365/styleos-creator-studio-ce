import Link from "next/link";
import AppShell from "@/components/AppShell";
import {
  getPublicSupabaseConfig,
  getRequestedStorageMode,
  getServerSupabaseConfig,
  getStorageMode,
  isSupabaseModeRequestedButIncomplete
} from "@/lib/config";
import { isAlphaAccessConfigured } from "@/lib/alphaAccess";
import SetupAuthDiagnostics from "@/app/setup/SetupAuthDiagnostics";
import SetupUserStatus from "@/app/setup/SetupUserStatus";

export default function SetupPage() {
  const mode = getStorageMode();
  const requestedMode = getRequestedStorageMode();
  const publicConfig = getPublicSupabaseConfig();
  const serverConfig = getServerSupabaseConfig();
  const incomplete = isSupabaseModeRequestedButIncomplete();
  const alphaMode = process.env.NEXT_PUBLIC_ALPHA_MODE === "true";
  const alphaAccessConfigured = !alphaMode || isAlphaAccessConfigured();

  return (
    <AppShell title="设置" description="查看工作区连接状态、登录状态与 Alpha 运行状态。">
      {incomplete ? (
        <div className="notice">
          已选择云端模式，但公开连接配置尚不完整，当前自动回退到本地模式。
        </div>
      ) : null}

      <section className="grid two">
        <article className="panel">
          <h2>运行状态</h2>
          <p className="muted">期望模式：{requestedMode === "supabase" ? "云端模式" : "本地模式"}</p>
          <p className="muted">当前模式：{mode === "supabase" ? "云端模式" : "本地模式"}</p>
          <p className="muted">云端连接：{publicConfig.isConfigured ? "已配置" : "未配置"}</p>
          <p className="muted">邀请制 Alpha：{alphaMode ? "已开启" : "未开启"}</p>
          <p className="muted">邀请名单：{alphaAccessConfigured ? "已配置" : "未配置"}</p>
        </article>

        <article className="panel">
          <h2>连接状态</h2>
          <p className="muted">公开 URL：{publicConfig.url ? "已配置" : "未配置"}</p>
          <p className="muted">公开访问密钥：{publicConfig.publicKey ? "已配置" : "未配置"}</p>
          <p className="muted">服务端密钥：{serverConfig.isServerConfigured ? "已配置" : "未配置"}</p>
          <p className="muted">
            当前用户：<SetupUserStatus mode={mode} />
          </p>
          <SetupAuthDiagnostics mode={mode} />
        </article>
      </section>

      <section className="panel">
        <h2>运维文档</h2>
        <div className="actions">
          <Link className="button" href="/docs/supabase-connection.md">
            云端连接
          </Link>
          <Link className="button" href="/docs/storage-modes.md">
            存储模式
          </Link>
          <Link className="button" href="/docs/shareable-cloud-workflow.md">
            分享流程
          </Link>
          <Link className="button" href="/docs/auth-magic-link.md">
            邮箱登录
          </Link>
        </div>
      </section>
    </AppShell>
  );
}

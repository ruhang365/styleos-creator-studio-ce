import Link from "next/link";
import AppShell from "@/components/AppShell";
import {
  getPublicSupabaseConfig,
  getRequestedStorageMode,
  getServerSupabaseConfig,
  getStorageMode,
  isSupabaseModeRequestedButIncomplete
} from "@/lib/config";
import SetupUserStatus from "@/app/setup/SetupUserStatus";

export default function SetupPage() {
  const mode = getStorageMode();
  const requestedMode = getRequestedStorageMode();
  const publicConfig = getPublicSupabaseConfig();
  const serverConfig = getServerSupabaseConfig();
  const incomplete = isSupabaseModeRequestedButIncomplete();

  return (
    <AppShell title="Setup" description="Storage mode and Supabase connection status for Creator Studio CE.">
      {incomplete ? (
        <div className="notice">
          Supabase Mode was requested, but public Supabase configuration is incomplete. The app has fallen back to Local Mode.
        </div>
      ) : null}

      <section className="grid two">
        <article className="panel">
          <h2>Storage</h2>
          <p className="muted">Requested storage mode: {requestedMode}</p>
          <p className="muted">Current storage mode: {mode}</p>
          <p className="muted">Supabase configured: {publicConfig.isConfigured ? "yes" : "no"}</p>
        </article>

        <article className="panel">
          <h2>Supabase</h2>
          <p className="muted">Public URL configured: {publicConfig.url ? "yes" : "no"}</p>
          <p className="muted">Public key configured: {publicConfig.publicKey ? "yes" : "no"}</p>
          <p className="muted">Server secret configured: {serverConfig.isServerConfigured ? "yes" : "no"}</p>
          <p className="muted">
            Current user: <SetupUserStatus mode={mode} />
          </p>
        </article>
      </section>

      <section className="panel">
        <h2>Docs</h2>
        <div className="actions">
          <Link className="button" href="/docs/supabase-connection.md">
            Supabase connection
          </Link>
          <Link className="button" href="/docs/storage-modes.md">
            Storage modes
          </Link>
          <Link className="button" href="/docs/shareable-cloud-workflow.md">
            Shareable workflow
          </Link>
        </div>
      </section>
    </AppShell>
  );
}

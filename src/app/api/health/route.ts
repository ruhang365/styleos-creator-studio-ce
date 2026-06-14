import { NextResponse } from "next/server";
import { getPublicSupabaseConfig, getRequestedStorageMode, getServerSupabaseConfig, getStorageMode } from "@/lib/config";
import { isAlphaAccessConfigured } from "@/lib/alphaAccess";

export async function GET() {
  const requestedStorageMode = getRequestedStorageMode();
  const storageMode = getStorageMode();
  const publicConfig = getPublicSupabaseConfig();
  const serverConfig = getServerSupabaseConfig();
  const publicSupabaseConfigured = publicConfig.isConfigured;
  const serverSupabaseConfigured = serverConfig.isServerConfigured;
  const supabaseConfigured = publicSupabaseConfigured && serverSupabaseConfigured;
  const alphaMode = process.env.NEXT_PUBLIC_ALPHA_MODE === "true";
  const alphaAccessConfigured = !alphaMode || isAlphaAccessConfigured();
  const hasConfigurationWarning = (requestedStorageMode === "supabase" && !supabaseConfigured) || !alphaAccessConfigured;

  return NextResponse.json({
    ok: !hasConfigurationWarning,
    app: "styleos-creator-studio-ce",
    version: "v0.2.3-alpha-prep",
    storageMode,
    supabaseConfigured,
    publicSupabaseConfigured,
    serverSupabaseConfigured,
    alphaMode,
    alphaInviteOnly: alphaMode,
    alphaAccessConfigured,
    warning: hasConfigurationWarning ? "Supabase Mode or Alpha access configuration is incomplete." : null,
    timestamp: new Date().toISOString()
  });
}

import { NextResponse } from "next/server";
import { getPublicSupabaseConfig, getRequestedStorageMode, getServerSupabaseConfig, getStorageMode } from "@/lib/config";

export async function GET() {
  const requestedStorageMode = getRequestedStorageMode();
  const storageMode = getStorageMode();
  const publicConfig = getPublicSupabaseConfig();
  const serverConfig = getServerSupabaseConfig();
  const publicSupabaseConfigured = publicConfig.isConfigured;
  const serverSupabaseConfigured = serverConfig.isServerConfigured;
  const supabaseConfigured = publicSupabaseConfigured && serverSupabaseConfigured;
  const alphaMode = process.env.NEXT_PUBLIC_ALPHA_MODE === "true";
  const hasConfigurationWarning = requestedStorageMode === "supabase" && !supabaseConfigured;

  return NextResponse.json({
    ok: !hasConfigurationWarning,
    app: "styleos-creator-studio-ce",
    version: "v0.2.3-alpha-prep",
    storageMode,
    supabaseConfigured,
    publicSupabaseConfigured,
    serverSupabaseConfigured,
    alphaMode,
    warning: hasConfigurationWarning ? "Supabase Mode is requested but Alpha configuration is incomplete." : null,
    timestamp: new Date().toISOString()
  });
}

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getServerSupabaseConfig } from "@/lib/config";

export function getSupabaseServiceClient(): SupabaseClient {
  const config = getServerSupabaseConfig();

  if (!config.isServerConfigured) {
    throw new Error("Supabase server configuration is incomplete.");
  }

  return createClient(config.url, config.serverKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

export function getStyleosServiceClient() {
  return getSupabaseServiceClient().schema("styleos");
}

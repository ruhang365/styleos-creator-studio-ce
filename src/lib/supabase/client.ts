import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getPublicSupabaseConfig } from "@/lib/config-public";

let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient() {
  const config = getPublicSupabaseConfig();
  if (!config.isConfigured) {
    return null;
  }

  if (!browserClient) {
    browserClient = createClient(config.url, config.publicKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  }

  return browserClient;
}

export function getStyleosBrowserClient() {
  const client = getSupabaseBrowserClient();
  return client ? client.schema("styleos") : null;
}

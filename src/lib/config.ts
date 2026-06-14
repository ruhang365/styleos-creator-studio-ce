export {
  getPublicSupabaseConfig,
  getRequestedStorageMode,
  getStorageMode,
  isSupabaseConfigured,
  isSupabaseModeRequestedButIncomplete
} from "@/lib/config-public";
export type { PublicSupabaseConfig, StorageMode } from "@/lib/config-public";

import { getPublicSupabaseConfig, type PublicSupabaseConfig } from "@/lib/config-public";

export interface ServerSupabaseConfig extends PublicSupabaseConfig {
  serverKey: string;
  isServerConfigured: boolean;
}

export function getServerSupabaseConfig(): ServerSupabaseConfig {
  const publicConfig = getPublicSupabaseConfig();
  const serverKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || "";

  return {
    ...publicConfig,
    serverKey,
    isServerConfigured: Boolean(publicConfig.url && serverKey)
  };
}

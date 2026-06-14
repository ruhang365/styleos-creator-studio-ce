export type StorageMode = "local" | "supabase";

export interface PublicSupabaseConfig {
  url: string;
  publicKey: string;
  isConfigured: boolean;
}

export function getRequestedStorageMode(): StorageMode {
  return process.env.NEXT_PUBLIC_STORAGE_MODE === "supabase" ? "supabase" : "local";
}

export function getPublicSupabaseConfig(): PublicSupabaseConfig {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const publicKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";

  return {
    url,
    publicKey,
    isConfigured: Boolean(url && publicKey)
  };
}

export function isSupabaseConfigured() {
  return getPublicSupabaseConfig().isConfigured;
}

export function getStorageMode(): StorageMode {
  const requestedMode = getRequestedStorageMode();
  if (requestedMode === "supabase" && isSupabaseConfigured()) {
    return "supabase";
  }
  return "local";
}

export function isSupabaseModeRequestedButIncomplete() {
  return getRequestedStorageMode() === "supabase" && !isSupabaseConfigured();
}

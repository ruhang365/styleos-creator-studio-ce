import { getSupabaseBrowserClient } from "@/lib/supabase/client";

function requireBrowserClient() {
  const client = getSupabaseBrowserClient();
  if (!client) {
    throw new Error("Supabase is not configured.");
  }
  return client;
}

export async function signInWithOtp(email: string) {
  const client = requireBrowserClient();
  const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined;

  return client.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo
    }
  });
}

export async function signOut() {
  const client = requireBrowserClient();
  return client.auth.signOut();
}

export async function getCurrentUser() {
  const client = getSupabaseBrowserClient();
  if (!client) {
    return null;
  }
  const { data, error } = await client.auth.getUser();
  if (error) {
    return null;
  }
  return data.user;
}

export async function getSession() {
  const client = getSupabaseBrowserClient();
  if (!client) {
    return null;
  }
  const { data, error } = await client.auth.getSession();
  if (error) {
    return null;
  }
  return data.session;
}

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export interface AuthCallbackResult {
  ok: boolean;
  error?: string;
}

function requireBrowserClient() {
  const client = getSupabaseBrowserClient();
  if (!client) {
    throw new Error("云端登录尚未配置。");
  }
  return client;
}

function safeAuthError(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    const message = error.message.replace(/https?:\/\/\S+/g, "[url]").replace(/eyJ[\w-]+\.[\w-]+\.[\w-]+/g, "[token]");
    return message.length > 180 ? fallback : message;
  }
  return fallback;
}

export async function signInWithOtp(email: string) {
  const client = requireBrowserClient();
  const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined;

  return client.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo,
      shouldCreateUser: false
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

export async function completeAuthCallbackFromUrl(url: string): Promise<AuthCallbackResult> {
  const client = getSupabaseBrowserClient();
  if (!client) {
    return { ok: false, error: "云端登录尚未配置。" };
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return { ok: false, error: "登录回调链接无效。" };
  }

  const callbackError = parsedUrl.searchParams.get("error_description") || parsedUrl.searchParams.get("error");
  if (callbackError) {
    return { ok: false, error: "登录链接已被拒绝或已失效。" };
  }

  const code = parsedUrl.searchParams.get("code");
  if (code) {
    const { error } = await client.auth.exchangeCodeForSession(code);
    if (error) {
      const { data } = await client.auth.getSession();
      if (data.session) {
        return { ok: true };
      }
      return { ok: false, error: safeAuthError(error, "无法完成登录链接校验。") };
    }
    return { ok: true };
  }

  const hashParams = new URLSearchParams(parsedUrl.hash.replace(/^#/, ""));
  const accessToken = hashParams.get("access_token");
  const refreshToken = hashParams.get("refresh_token");
  if (accessToken && refreshToken) {
    const { error } = await client.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    });
    if (error) {
      return { ok: false, error: safeAuthError(error, "无法保存登录会话。") };
    }
    return { ok: true };
  }

  const session = await getSession();
  if (session) {
    return { ok: true };
  }

  return { ok: false, error: "登录回调缺少必要参数。" };
}

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getPublicSupabaseConfig } from "@/lib/config";
import { isAlphaAccessConfigured, isAlphaEmailAllowed, normalizeAlphaEmail } from "@/lib/alphaAccess";

function getSafeRedirectOrigin(request: Request) {
  const configuredAppUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (configuredAppUrl) {
    return configuredAppUrl.replace(/\/$/, "");
  }

  const requestUrl = new URL(request.url);
  return requestUrl.origin;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  try {
    const publicConfig = getPublicSupabaseConfig();
    if (!publicConfig.isConfigured) {
      return NextResponse.json({ error: "云端公开配置尚不完整。" }, { status: 503 });
    }

    if (!isAlphaAccessConfigured()) {
      return NextResponse.json({ error: "Alpha 邀请名单尚未配置。" }, { status: 503 });
    }

    const body = (await request.json()) as Record<string, unknown>;
    const email = normalizeAlphaEmail(typeof body.email === "string" ? body.email : "");
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "请输入有效的 Alpha 账号邮箱。" }, { status: 400 });
    }

    if (!isAlphaEmailAllowed(email)) {
      return NextResponse.json({ error: "当前 Alpha 仅限已邀请账号访问。" }, { status: 403 });
    }

    const supabase = createClient(publicConfig.url, publicConfig.publicKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    const redirectTo = `${getSafeRedirectOrigin(request)}/auth/callback`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
        shouldCreateUser: false
      }
    });

    if (error) {
      return NextResponse.json({ error: "无法发送 Alpha 登录链接。" }, { status: 400 });
    }

    return NextResponse.json({ ok: true, message: "登录链接已发送到已邀请邮箱。" });
  } catch {
    return NextResponse.json({ error: "无法请求 Alpha 登录链接。" }, { status: 500 });
  }
}

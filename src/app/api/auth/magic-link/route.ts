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
      return NextResponse.json({ error: "Supabase public configuration is incomplete." }, { status: 503 });
    }

    if (!isAlphaAccessConfigured()) {
      return NextResponse.json({ error: "Alpha invite list is not configured." }, { status: 503 });
    }

    const body = (await request.json()) as Record<string, unknown>;
    const email = normalizeAlphaEmail(typeof body.email === "string" ? body.email : "");
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Enter a valid Alpha account email." }, { status: 400 });
    }

    if (!isAlphaEmailAllowed(email)) {
      return NextResponse.json({ error: "This Alpha is invite-only. Use an approved test account." }, { status: 403 });
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
      return NextResponse.json({ error: "Unable to send Alpha magic link." }, { status: 400 });
    }

    return NextResponse.json({ ok: true, message: "Magic link sent for an approved Alpha account." });
  } catch {
    return NextResponse.json({ error: "Unable to request Alpha magic link." }, { status: 500 });
  }
}


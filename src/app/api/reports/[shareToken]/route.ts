import { NextResponse } from "next/server";
import { getStyleosServiceClient } from "@/lib/supabase/server";

function getBarberBriefText(value: unknown) {
  if (!value || typeof value !== "object") {
    return "";
  }
  const text = (value as Record<string, unknown>).text;
  return typeof text === "string" ? text : JSON.stringify(value, null, 2);
}

export async function GET(_: Request, { params }: { params: { shareToken: string } }) {
  try {
    const client = getStyleosServiceClient();
    const { data, error } = await client
      .from("reports")
      .select("id,share_token,markdown,barber_brief,status,delivered_at")
      .eq("share_token", params.shareToken)
      .in("status", ["draft", "delivered"])
      .maybeSingle();

    if (error) {
      throw error;
    }
    if (!data) {
      return NextResponse.json({ error: "Report not found." }, { status: 404 });
    }

    return NextResponse.json({
      report: {
        id: data.id,
        markdown: data.markdown,
        barber_brief: getBarberBriefText(data.barber_brief),
        status: data.status,
        delivered_at: data.delivered_at
      }
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load report." }, { status: 500 });
  }
}

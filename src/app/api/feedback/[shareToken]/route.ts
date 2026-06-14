import { NextResponse } from "next/server";
import { getStyleosServiceClient } from "@/lib/supabase/server";

function booleanFromChoice(value: unknown) {
  return value === true || value === "yes" || value === "planned";
}

export async function POST(request: Request, { params }: { params: { shareToken: string } }) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const consent = body.consent_to_anonymized_learning ?? body.consentToAnonymizedLearning;

    if (typeof consent !== "boolean") {
      return NextResponse.json({ error: "consent_to_anonymized_learning is required." }, { status: 400 });
    }

    const client = getStyleosServiceClient();
    const { data: report, error: reportError } = await client
      .from("reports")
      .select("id,case_id,share_token,status")
      .eq("share_token", params.shareToken)
      .in("status", ["draft", "delivered"])
      .maybeSingle();

    if (reportError) {
      throw reportError;
    }
    if (!report) {
      return NextResponse.json({ error: "Report not found." }, { status: 404 });
    }

    const { data: feedback, error: feedbackError } = await client
      .from("feedback")
      .insert({
        report_id: report.id,
        case_id: report.case_id,
        score: Number(body.score ?? body.satisfactionScore ?? 0) || null,
        easy_to_understand: booleanFromChoice(body.easy_to_understand ?? body.easyToUnderstand),
        most_useful: String(body.most_useful ?? body.mostUsefulPart ?? ""),
        will_use_barber_brief: booleanFromChoice(body.will_use_barber_brief ?? body.willUseBarberBrief),
        shown_to_hairstylist: booleanFromChoice(body.shown_to_hairstylist ?? body.showedToHairstylist),
        feedback_text: String(body.feedback_text ?? body.creatorNote ?? ""),
        consent_to_anonymized_learning: consent
      })
      .select("id")
      .single();

    if (feedbackError) {
      throw feedbackError;
    }

    return NextResponse.json({
      ok: true,
      feedback_id: feedback.id
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to submit feedback." }, { status: 500 });
  }
}

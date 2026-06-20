import { NextResponse } from "next/server";
import { sanitizeText } from "@/lib/sanitizer";
import { getStyleosServiceClient } from "@/lib/supabase/server";
import { appendSyntheticMarkers, extractSyntheticMarkers } from "@/lib/syntheticMarkers";

function booleanFromChoice(value: unknown) {
  return value === true || value === "yes" || value === "planned";
}

export async function POST(request: Request, { params }: { params: { shareToken: string } }) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const consent = body.consent_to_anonymized_learning ?? body.consentToAnonymizedLearning;

    if (typeof consent !== "boolean") {
      return NextResponse.json({ error: "请先选择是否同意脱敏学习授权。" }, { status: 400 });
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
      return NextResponse.json({ error: "未找到报告。" }, { status: 404 });
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

    const feedbackText = String(body.feedback_text ?? body.creatorNote ?? "");
    const consentMarkers = extractSyntheticMarkers(feedbackText, String(body.most_useful ?? body.mostUsefulPart ?? ""));
    const { error: consentError } = await client.from("consent_records").insert({
      case_id: report.case_id,
      report_id: report.id,
      consent_type: "anonymized_learning",
      consent_value: consent,
      consent_note: appendSyntheticMarkers(
        sanitizeText(
          consent ? "顾客同意将本次反馈脱敏后用于候选知识提炼。" : "顾客未同意将本次反馈用于候选知识提炼。"
        ),
        consentMarkers
      )
    });

    if (consentError) {
      throw new Error("无法记录反馈授权。");
    }

    return NextResponse.json({
      ok: true,
      feedback_id: feedback.id
    });
  } catch (error) {
    const message = error instanceof Error && error.message === "无法记录反馈授权。" ? error.message : "无法提交反馈。";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getStyleosServiceClient } from "@/lib/supabase/server";
import { sanitizeText } from "@/lib/sanitizer";
import { appendSyntheticMarkers, extractSyntheticMarkers } from "@/lib/syntheticMarkers";
import { createShareToken } from "@/lib/tokens";

const sensitiveFieldPatterns = ["phone", "wechat", "id_card", "address", "photo", "image", "email"];

function removeSensitiveFields(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(removeSensitiveFields);
  }
  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).reduce<Record<string, unknown>>((next, [key, child]) => {
      const lowerKey = key.toLowerCase();
      if (sensitiveFieldPatterns.some((pattern) => lowerKey.includes(pattern))) {
        return next;
      }
      next[key] = removeSensitiveFields(child);
      return next;
    }, {});
  }
  return value;
}

function stringField(value: unknown) {
  return typeof value === "string" ? value : "";
}

function normalizeIntakeAliases(value: Record<string, unknown>) {
  const next = { ...value };

  const aliasMap: Array<[string, string]> = [
    ["faceShape", "faceShapeTag"],
    ["constraints", "workplaceSchoolConstraints"],
    ["serviceProcessingConsent", "consentToLocalProcessing"]
  ];

  aliasMap.forEach(([from, to]) => {
    if (next[to] === undefined && next[from] !== undefined) {
      next[to] = next[from];
    }
  });

  if (next.fanNickname === undefined && next.fan_alias !== undefined) {
    next.fanNickname = next.fan_alias;
  }
  if (next.targetScenario === undefined && next.target_scenario !== undefined) {
    next.targetScenario = next.target_scenario;
  }
  if (next.currentHairstyleConcern === undefined && next.current_hairstyle_concern !== undefined) {
    next.currentHairstyleConcern = next.current_hairstyle_concern;
  }
  if (next.stylingGoal === undefined && next.styling_goal !== undefined) {
    next.stylingGoal = next.styling_goal;
  }

  return next;
}

export async function GET(_: Request, { params }: { params: { token: string } }) {
  try {
    const client = getStyleosServiceClient();
    const { data, error } = await client
      .from("services")
      .select("id,name,module,description,status")
      .eq("intake_token", params.token)
      .maybeSingle();

    if (error) {
      throw error;
    }
    if (!data) {
      return NextResponse.json({ error: "未找到服务。" }, { status: 404 });
    }

    return NextResponse.json({
      service: {
        id: data.id,
        name: data.name,
        module: data.module,
        description: data.description,
        status: data.status
      }
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "无法加载服务。" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { token: string } }) {
  try {
    const client = getStyleosServiceClient();
    const { data: service, error: serviceError } = await client
      .from("services")
      .select("id,creator_user_id,name,status")
      .eq("intake_token", params.token)
      .eq("status", "active")
      .maybeSingle();

    if (serviceError) {
      throw serviceError;
    }
    if (!service) {
      return NextResponse.json({ error: "未找到可用服务。" }, { status: 404 });
    }

    const body = (await request.json()) as Record<string, unknown>;
    const rawIntake = body.intake && typeof body.intake === "object" ? body.intake : body;
    const intake = normalizeIntakeAliases(removeSensitiveFields(rawIntake) as Record<string, unknown>);
    const fanAlias = sanitizeText(String(body.fan_alias ?? intake.fanNickname ?? "体验顾客"), 80) || "体验顾客";
    const targetScenario = sanitizeText(String(body.target_scenario ?? intake.targetScenario ?? ""), 160);
    const consentValue = Boolean(
      intake.consentToLocalProcessing ?? body.consent_to_local_processing ?? body.consentToLocalProcessing ?? body.serviceProcessingConsent
    );
    const consentMarkers = extractSyntheticMarkers(stringField(intake.creatorNotes), stringField(body.consent_note));

    const { data: fanCase, error: caseError } = await client
      .from("fan_cases")
      .insert({
        creator_user_id: service.creator_user_id,
        service_id: service.id,
        fan_alias: fanAlias,
        target_scenario: targetScenario,
        status: "intake_submitted",
        intake,
        tags: [],
        selected_rule_ids: [],
        share_token: createShareToken()
      })
      .select("id,status")
      .single();

    if (caseError) {
      throw caseError;
    }

    const { error: consentError } = await client.from("consent_records").insert({
      case_id: fanCase.id,
      report_id: null,
      consent_type: "service_processing",
      consent_value: consentValue,
      consent_note: appendSyntheticMarkers(
        sanitizeText(
          consentValue
            ? "已在采集表中获得服务处理同意。"
            : "采集表中未获得服务处理同意。"
        ),
        consentMarkers
      )
    });

    if (consentError) {
      throw new Error("无法记录采集授权。");
    }

    return NextResponse.json({
      ok: true,
      case_id: fanCase.id,
      status: fanCase.status
    });
  } catch (error) {
    const message = error instanceof Error && error.message === "无法记录采集授权。" ? error.message : "无法提交采集信息。";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

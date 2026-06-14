import { NextResponse } from "next/server";
import { getStyleosServiceClient } from "@/lib/supabase/server";
import { sanitizeText } from "@/lib/sanitizer";
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
      return NextResponse.json({ error: "Service not found." }, { status: 404 });
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
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load service." }, { status: 500 });
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
      return NextResponse.json({ error: "Active service not found." }, { status: 404 });
    }

    const body = (await request.json()) as Record<string, unknown>;
    const rawIntake = body.intake && typeof body.intake === "object" ? body.intake : body;
    const intake = removeSensitiveFields(rawIntake) as Record<string, unknown>;
    const fanAlias = sanitizeText(String(body.fan_alias ?? intake.fanNickname ?? "fan_alias"), 80) || "fan_alias";
    const targetScenario = sanitizeText(String(body.target_scenario ?? intake.targetScenario ?? ""), 160);

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

    return NextResponse.json({
      ok: true,
      case_id: fanCase.id,
      status: fanCase.status
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to submit intake." }, { status: 500 });
  }
}

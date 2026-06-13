import type { FanCase, FanIntake, Service } from "@/types";
import { syntheticFanIntake } from "@/data/syntheticExamples";
import { createId, nowIso } from "@/lib/ids";
import { sanitizeText } from "@/lib/sanitizer";

export function createCaseFromIntake(service: Service, intake: FanIntake): FanCase {
  const now = nowIso();
  const fanNickname = sanitizeText(intake.fanNickname || "synthetic_user", 80);

  return {
    caseId: createId("case"),
    serviceId: service.serviceId,
    serviceName: service.serviceName,
    fanNickname: fanNickname || "synthetic_user",
    targetScenario: sanitizeText(intake.targetScenario, 160),
    status: "intake_submitted",
    intake: {
      ...intake,
      fanNickname: fanNickname || "synthetic_user"
    },
    tags: [],
    ruleMatches: [],
    selectedRuleIds: [],
    createdAt: now,
    updatedAt: now
  };
}

export function createSyntheticFanCase(service: Service) {
  return createCaseFromIntake(service, {
    ...syntheticFanIntake,
    fanNickname: `synthetic_user_${Date.now().toString(36).slice(-4)}`
  });
}

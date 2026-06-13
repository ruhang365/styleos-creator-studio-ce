import type { FanCase, RuleCard } from "@/types";
import { bullets } from "@/lib/markdown";

export function generateBarberBrief(caseItem: FanCase, selectedRules: RuleCard[]) {
  const hints = selectedRules.map((rule) => rule.barber_brief_hint);
  const intake = caseItem.intake;

  return [
    "## Barber Brief",
    "",
    `Client scenario: ${intake.targetScenario}`,
    `Main goal: ${intake.stylingGoal}`,
    "",
    "Recommended execution notes:",
    bullets(hints.length > 0 ? hints : ["Use the intake and creator-selected tags to define a conservative first version."]),
    "",
    "Constraints to respect:",
    bullets([
      `Maintenance willingness: ${intake.maintenanceWillingness}`,
      `Cut-short willingness: ${intake.willingnessToCutShort}`,
      `Perm willingness: ${intake.willingnessToPerm}`,
      `Color willingness: ${intake.willingnessToColor}`,
      intake.workplaceSchoolConstraints
    ]),
    "",
    "CE disclaimer: This is a local planning brief, not a professional guarantee."
  ].join("\n");
}

export function recommendationSummary(selectedRules: RuleCard[]) {
  if (selectedRules.length === 0) {
    return "No rule has been selected yet.";
  }
  return selectedRules.map((rule) => rule.recommendation).join(" ");
}

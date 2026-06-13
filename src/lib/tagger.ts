import type { FanIntake, StyleTag } from "@/types";
import { createId } from "@/lib/ids";

function generated(group: StyleTag["group"], label: string, value: string): StyleTag {
  return {
    tagId: createId("tag"),
    group,
    label,
    value,
    source: "generated"
  };
}

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

export function generateStyleTags(intake: FanIntake): StyleTag[] {
  const tags: StyleTag[] = [];
  const scenario = normalize(intake.targetScenario);
  const goal = normalize(intake.stylingGoal);
  const concern = normalize(intake.currentHairstyleConcern);

  tags.push(generated("Basic", "scenario_professional", intake.targetScenario));
  if (scenario.includes("work") || scenario.includes("professional") || scenario.includes("interview")) {
    tags.push(generated("Basic", "scenario_work", intake.targetScenario));
  }

  tags.push(generated("Face & Proportion", `face_${normalize(intake.faceShapeTag)}`, intake.faceShapeTag));
  tags.push(generated("Face & Proportion", `forehead_${normalize(intake.foreheadImpression)}`, intake.foreheadImpression));
  tags.push(generated("Face & Proportion", `jaw_${normalize(intake.jawlineSignal)}`, intake.jawlineSignal));
  tags.push(generated("Hair Attribute", `volume_${normalize(intake.hairVolume)}`, intake.hairVolume));
  tags.push(generated("Hair Attribute", `hair_${normalize(intake.hairTexture)}`, intake.hairTexture));
  tags.push(generated("Hair Attribute", `hair_${normalize(intake.hairShape)}`, intake.hairShape));
  tags.push(generated("Hair Attribute", `crown_${normalize(intake.crownHeight)}`, intake.crownHeight));
  tags.push(generated("Constraint", `maintenance_${normalize(intake.maintenanceWillingness)}`, intake.maintenanceWillingness));
  tags.push(generated("Constraint", `cut_short_${normalize(intake.willingnessToCutShort)}`, intake.willingnessToCutShort));
  tags.push(generated("Constraint", `perm_${normalize(intake.willingnessToPerm)}`, intake.willingnessToPerm));
  tags.push(generated("Constraint", `color_${normalize(intake.willingnessToColor)}`, intake.willingnessToColor));

  if (goal.includes("lift") || concern.includes("flat")) {
    tags.push(generated("Goal", "goal_lift", intake.stylingGoal));
  }
  if (goal.includes("clean") || goal.includes("outline")) {
    tags.push(generated("Goal", "goal_clean_outline", intake.stylingGoal));
  }
  if (goal.includes("easy") || goal.includes("routine")) {
    tags.push(generated("Goal", "goal_easy_routine", intake.stylingGoal));
  }
  if (goal.includes("refresh")) {
    tags.push(generated("Goal", "goal_refresh", intake.stylingGoal));
  }
  if (intake.workplaceSchoolConstraints.toLowerCase().includes("conservative")) {
    tags.push(generated("Constraint", "constraint_conservative", intake.workplaceSchoolConstraints));
  }

  const unique = new Map<string, StyleTag>();
  tags.forEach((tag) => unique.set(`${tag.group}:${tag.label}`, tag));
  return Array.from(unique.values());
}

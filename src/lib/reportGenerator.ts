import type { FanCase, RuleCard } from "@/types";
import { generateBarberBrief } from "@/lib/barberBriefGenerator";
import { bullets, heading } from "@/lib/markdown";

export function generateLiteReport(caseItem: FanCase, selectedRules: RuleCard[]) {
  const intake = caseItem.intake;
  const tags = caseItem.tags.map((tag) => `${tag.group}: ${tag.label}`);
  const recommendations = selectedRules.map((rule) => rule.recommendation);
  const avoidList = selectedRules.flatMap((rule) => rule.avoid);
  const limitations = selectedRules.flatMap((rule) => rule.limitations);
  const barberBrief = generateBarberBrief(caseItem, selectedRules);

  const markdown = [
    `# Hairstyle Lite Report - ${caseItem.fanNickname}`,
    "",
    heading(
      "Summary",
      `This local CE report converts synthetic intake into a hairstyle direction for ${intake.targetScenario}. The current goal is ${intake.stylingGoal}.`
    ),
    heading("Input Tags", bullets(tags.length > 0 ? tags : ["No tags saved yet."])),
    heading(
      "Hairstyle Direction",
      recommendations.length > 0
        ? bullets(recommendations)
        : "Generate tags and match rules before using this report with a real workflow."
    ),
    heading(
      "Suitable Options",
      bullets([
        "A shape-led refresh that respects the user's maintenance level.",
        "A clear barber brief that focuses on cut, side volume, crown height, and front line.",
        "A conservative fallback if the user is not ready for strong change."
      ])
    ),
    heading("Avoid List", bullets(avoidList.length > 0 ? avoidList : ["No avoid list generated yet."])),
    heading(
      "Hair Color Direction",
      intake.willingnessToColor === "low" || intake.willingnessToColor === "no"
        ? "Keep color natural. Use cut and shape as the main refresh lever."
        : "Use color as an optional supporting lever after shape direction is confirmed."
    ),
    barberBrief,
    heading(
      "Next Action Checklist",
      bullets([
        "Creator reviews selected rules.",
        "Creator edits wording before delivery.",
        "Fan reads the report.",
        "Fan optionally shares Barber Brief with a hairstylist.",
        "Creator collects feedback before extracting candidate knowledge."
      ])
    ),
    heading(
      "Disclaimer",
      `StyleOS Creator Studio CE is a local-first community edition. It does not upload real photos, connect payment, call AI APIs, or provide medical beauty advice. ${limitations.join(" ")}`
    )
  ].join("\n\n");

  return {
    title: `Hairstyle Lite Report - ${caseItem.fanNickname}`,
    markdown,
    barberBrief
  };
}

import type { FanCase, RuleCard } from "@/types";
import { bullets } from "@/lib/markdown";

export function generateBarberBrief(caseItem: FanCase, selectedRules: RuleCard[]) {
  const hints = selectedRules.map((rule) => rule.barber_brief_hint);
  const intake = caseItem.intake;

  return [
    "## 理发师沟通卡 / Barber Brief",
    "",
    `顾客场景：${intake.targetScenario}`,
    `主要目标：${intake.stylingGoal}`,
    "",
    "建议执行要点：",
    bullets(hints.length > 0 ? hints : ["根据采集信息和创作者选择的标签，先给出稳妥的第一版方案。"]),
    "",
    "需要尊重的限制：",
    bullets([
      `打理意愿：${intake.maintenanceWillingness}`,
      `剪短意愿：${intake.willingnessToCutShort}`,
      `烫发意愿：${intake.willingnessToPerm}`,
      `染发意愿：${intake.willingnessToColor}`,
      intake.workplaceSchoolConstraints
    ]),
    "",
    "CE 说明：这是一张咨询沟通卡，用于辅助创作者和理发师沟通。"
  ].join("\n");
}

export function recommendationSummary(selectedRules: RuleCard[]) {
  if (selectedRules.length === 0) {
    return "还没有选择规则。";
  }
  return selectedRules.map((rule) => rule.recommendation).join(" ");
}

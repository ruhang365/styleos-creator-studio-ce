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
    `# 顾客报告 Lite Report - ${caseItem.fanNickname}`,
    "",
    heading(
      "咨询摘要",
      `这份 CE 报告把结构化采集信息整理成适用于「${intake.targetScenario}」的发型方向。当前目标是：${intake.stylingGoal}。`
    ),
    heading("发型标签", bullets(tags.length > 0 ? tags : ["还没有保存标签。"])),
    heading(
      "发型方向",
      recommendations.length > 0
        ? bullets(recommendations)
        : "请先生成标签并匹配规则，再将报告用于真实咨询流程。"
    ),
    heading(
      "适合选项",
      bullets([
        "以轮廓调整为主，匹配顾客可接受的打理强度。",
        "把剪裁、两侧体积、头顶高度和刘海/前发线写进理发师沟通卡。",
        "如果顾客暂时不想大改，保留稳妥过渡方案。"
      ])
    ),
    heading("避免项", bullets(avoidList.length > 0 ? avoidList : ["还没有生成避免项。"])),
    heading(
      "染发方向",
      intake.willingnessToColor === "low" || intake.willingnessToColor === "no"
        ? "保持自然发色，把剪裁和轮廓作为主要调整杠杆。"
        : "先确认轮廓方向，再把发色作为辅助调整选项。"
    ),
    barberBrief,
    heading(
      "下一步动作",
      bullets([
        "创作者复核已选择的规则。",
        "交付前调整报告措辞。",
        "顾客阅读报告。",
        "顾客可将 Barber Brief 给理发师沟通。",
        "创作者收集反馈后，再决定是否提炼候选知识。"
      ])
    ),
    heading(
      "使用说明",
      `StyleOS Creator Studio CE 当前不上传真实照片、不包含支付、不调用 AI API，也不提供医疗美容建议。${limitations.join(" ")}`
    )
  ].join("\n\n");

  return {
    title: `顾客报告 - ${caseItem.fanNickname}`,
    markdown,
    barberBrief
  };
}

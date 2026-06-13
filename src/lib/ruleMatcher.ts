import type { RuleCard, RuleMatch, StyleTag } from "@/types";

export function matchRules(tags: StyleTag[], rules: RuleCard[]): RuleMatch[] {
  const tagLabels = new Set(tags.map((tag) => tag.label));

  return rules
    .map((rule) => {
      const matchedTags = rule.tags.filter((tag) => tagLabels.has(tag));
      const score = matchedTags.length / Math.max(rule.tags.length, 1);
      const reasons =
        matchedTags.length > 0
          ? matchedTags.map((tag) => `Matched ${tag}`)
          : ["No generated tag matched yet"];

      return {
        ruleId: rule.rule_id,
        score,
        reasons,
        selected: score > 0
      };
    })
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score);
}

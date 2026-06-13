import type { CandidateKnowledge, FanCase, Feedback, LiteReport } from "@/types";
import { recommendationSummary } from "@/lib/barberBriefGenerator";
import { hairstyleRules } from "@/data/hairstyleRules";
import { createId, nowIso } from "@/lib/ids";
import { sanitizeText } from "@/lib/sanitizer";

export function extractCandidateKnowledge(caseItem: FanCase, report: LiteReport, feedback: Feedback): CandidateKnowledge {
  const selectedRules = hairstyleRules.filter((rule) => caseItem.selectedRuleIds.includes(rule.rule_id));
  const now = nowIso();

  return {
    candidate_id: createId("candidate"),
    source_case_id: caseItem.caseId,
    feature_tags: caseItem.tags.map((tag) => tag.label),
    recommendation_summary: recommendationSummary(selectedRules),
    execution_feedback: sanitizeText(
      `Useful part: ${feedback.mostUsefulPart}. Barber brief: ${feedback.willUseBarberBrief}. Hairstylist usage: ${feedback.showedToHairstylist}. Report status: ${report.status}.`
    ),
    creator_feedback: sanitizeText(feedback.creatorNote || "No creator note supplied."),
    user_feedback_score: feedback.satisfactionScore,
    anonymization_status: "abstracted",
    consent_status: feedback.consentToAnonymizedLearning ? "granted" : "not_granted",
    review_status: "pending",
    evidence_level: "E0",
    pro_candidate: false,
    public_rule_candidate: false,
    createdAt: now,
    updatedAt: now
  };
}

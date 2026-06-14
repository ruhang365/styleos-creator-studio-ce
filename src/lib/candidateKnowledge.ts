import type { CandidateKnowledge, FanCase, Feedback, LiteReport } from "@/types";
import { recommendationSummary } from "@/lib/barberBriefGenerator";
import { hairstyleRules } from "@/data/hairstyleRules";
import { createId, nowIso } from "@/lib/ids";
import { sanitizeText } from "@/lib/sanitizer";
import { appendSyntheticMarkers, extractSyntheticMarkers } from "@/lib/syntheticMarkers";

export function extractCandidateKnowledge(caseItem: FanCase, report: LiteReport, feedback: Feedback): CandidateKnowledge {
  const selectedRules = hairstyleRules.filter((rule) => caseItem.selectedRuleIds.includes(rule.rule_id));
  const now = nowIso();
  const markers = extractSyntheticMarkers(report.markdown, report.barberBrief, feedback.creatorNote, feedback.mostUsefulPart, caseItem.intake.creatorNotes);
  const sourceSummary = appendSyntheticMarkers(
    sanitizeText(
      [
        `Rule recommendation: ${recommendationSummary(selectedRules)}`,
        `Scenario: ${caseItem.targetScenario}`,
        `Report status: ${report.status}`,
        `Feedback score: ${feedback.satisfactionScore}`
      ].join(" ")
    ),
    markers
  );
  const feedbackSummary = appendSyntheticMarkers(
    sanitizeText(
      [
        `Useful part: ${feedback.mostUsefulPart}.`,
        `Barber brief: ${feedback.willUseBarberBrief}.`,
        `Hairstylist usage: ${feedback.showedToHairstylist}.`,
        `Report status: ${report.status}.`
      ].join(" ")
    ),
    markers
  );
  const creatorFeedback = appendSyntheticMarkers(sanitizeText(feedback.creatorNote || "No creator note supplied."), markers);

  return {
    candidate_id: createId("candidate"),
    source_case_id: caseItem.caseId,
    feature_tags: caseItem.tags.map((tag) => tag.label),
    scenario_tags: [caseItem.targetScenario].filter(Boolean),
    constraints: [caseItem.intake.workplaceSchoolConstraints].filter(Boolean),
    selected_rule_ids: caseItem.selectedRuleIds,
    recommendation_summary: sourceSummary,
    execution_card_summary: feedbackSummary,
    avoid_list: selectedRules.flatMap((rule) => rule.avoid),
    execution_feedback: feedbackSummary,
    creator_feedback: creatorFeedback,
    user_feedback_score: feedback.satisfactionScore,
    execution_status: report.status,
    reuse_potential: feedback.consentToAnonymizedLearning ? "reviewable" : "blocked_without_consent",
    anonymization_status: feedback.consentToAnonymizedLearning ? "anonymized" : "pending",
    consent_status: feedback.consentToAnonymizedLearning ? "granted" : "denied",
    review_status: "pending",
    evidence_level: "E0",
    pro_candidate: false,
    public_rule_candidate: false,
    createdAt: now,
    updatedAt: now
  };
}

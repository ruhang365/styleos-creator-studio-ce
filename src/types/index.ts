export type CreatorType = "individual_creator" | "small_studio" | "training_team";
export type ServiceModule = "hairstyle";
export type ServiceStatus = "draft" | "active" | "paused";

export type CaseStatus =
  | "intake_submitted"
  | "tagging"
  | "rule_matching"
  | "report_draft"
  | "delivered"
  | "feedback_received"
  | "candidate_extracted";

export type EvidenceLevel = "E0" | "E1" | "E2" | "E3";
export type ReviewStatus = "pending" | "public_rule_candidate" | "pro_candidate" | "rejected" | "archived";
export type ConsentStatus = "granted" | "not_granted";
export type AnonymizationStatus = "abstracted" | "needs_review";

export interface Creator {
  creatorId: string;
  displayName: string;
  creatorType: CreatorType;
  focusArea: string;
  studioName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  serviceId: string;
  creatorId: string;
  serviceName: string;
  module: ServiceModule;
  status: ServiceStatus;
  description: string;
  priceNote?: string;
  deliveryFormat: string;
  intakePath: string;
  createdAt: string;
  updatedAt: string;
}

export interface FanIntake {
  fanNickname: string;
  targetScenario: string;
  currentHairstyleConcern: string;
  stylingGoal: string;
  faceShapeTag: string;
  foreheadImpression: string;
  jawlineSignal: string;
  hairVolume: string;
  hairTexture: string;
  hairShape: string;
  crownHeight: string;
  maintenanceWillingness: string;
  willingnessToCutShort: string;
  willingnessToPerm: string;
  willingnessToColor: string;
  workplaceSchoolConstraints: string;
  creatorNotes: string;
  consentToLocalProcessing: boolean;
}

export interface StyleTag {
  tagId: string;
  group: "Basic" | "Face & Proportion" | "Hair Attribute" | "Goal" | "Constraint";
  label: string;
  value: string;
  source: "generated" | "manual";
}

export interface RuleCard {
  rule_id: string;
  rule_name: string;
  tags: string[];
  status: "starter" | "unverified";
  evidence_level: EvidenceLevel;
  applicable_conditions: string[];
  recommendation: string;
  avoid: string[];
  limitations: string[];
  barber_brief_hint: string;
}

export interface RuleMatch {
  ruleId: string;
  score: number;
  reasons: string[];
  selected: boolean;
}

export interface FanCase {
  caseId: string;
  serviceId: string;
  serviceName: string;
  fanNickname: string;
  targetScenario: string;
  status: CaseStatus;
  intake: FanIntake;
  tags: StyleTag[];
  ruleMatches: RuleMatch[];
  selectedRuleIds: string[];
  reportId?: string;
  feedbackId?: string;
  candidateKnowledgeId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExecutionCard {
  executionId: string;
  caseId: string;
  title: string;
  checklist: string[];
  barberBrief: string;
}

export interface LiteReport {
  reportId: string;
  caseId: string;
  title: string;
  markdown: string;
  barberBrief: string;
  status: "draft" | "delivered";
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string;
}

export interface Feedback {
  feedbackId: string;
  reportId: string;
  caseId: string;
  easyToUnderstand: "yes" | "partly" | "no";
  mostUsefulPart: string;
  willUseBarberBrief: "yes" | "not_sure" | "no";
  showedToHairstylist: "yes" | "planned" | "no";
  satisfactionScore: number;
  creatorNote: string;
  consentToAnonymizedLearning: boolean;
  createdAt: string;
}

export interface CandidateKnowledge {
  candidate_id: string;
  source_case_id: string;
  feature_tags: string[];
  recommendation_summary: string;
  execution_feedback: string;
  creator_feedback: string;
  user_feedback_score: number;
  anonymization_status: AnonymizationStatus;
  consent_status: ConsentStatus;
  review_status: ReviewStatus;
  evidence_level: EvidenceLevel;
  pro_candidate: boolean;
  public_rule_candidate: boolean;
  createdAt: string;
  updatedAt: string;
}

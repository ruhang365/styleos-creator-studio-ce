import { getCurrentUser } from "@/lib/supabase/auth";
import { getStyleosBrowserClient } from "@/lib/supabase/client";
import { createIntakeToken, createShareToken } from "@/lib/tokens";
import type { CandidateKnowledge, Creator, FanCase, Feedback, LiteReport, Service, ServiceStatus } from "@/types";
import type {
  CandidateKnowledgeInput,
  CaseInput,
  FeedbackInput,
  ReportInput,
  ServiceInput,
  StorageAdapter
} from "@/lib/storage/types";

type JsonRecord = Record<string, unknown>;

interface ServiceRow {
  id: string;
  creator_user_id: string;
  name: string;
  module: "hairstyle";
  description: string | null;
  price_note: string | null;
  delivery_format: string | null;
  status: "active" | "paused" | "archived";
  intake_token: string;
  created_at: string;
  updated_at: string;
}

interface CaseRow {
  id: string;
  creator_user_id: string;
  service_id: string;
  fan_alias: string | null;
  target_scenario: string | null;
  status: FanCase["status"];
  intake: JsonRecord;
  tags: unknown[];
  selected_rule_ids: string[];
  share_token: string | null;
  created_at: string;
  updated_at: string;
}

interface ReportRow {
  id: string;
  creator_user_id: string;
  case_id: string;
  share_token: string;
  markdown: string | null;
  barber_brief: JsonRecord | null;
  status: LiteReport["status"];
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
}

interface FeedbackRow {
  id: string;
  report_id: string;
  case_id: string;
  score: number | null;
  easy_to_understand: boolean | null;
  most_useful: string | null;
  will_use_barber_brief: boolean | null;
  shown_to_hairstylist: boolean | null;
  feedback_text: string | null;
  consent_to_anonymized_learning: boolean;
  created_at: string;
}

interface CandidateKnowledgeRow {
  id: string;
  creator_user_id: string;
  source_case_id: string | null;
  feature_tags: string[];
  scenario_tags: string[];
  constraints: string[];
  selected_rule_ids: string[];
  recommendation_summary: string | null;
  execution_card_summary: string | null;
  avoid_list: string[];
  user_feedback_score: number | null;
  creator_feedback: string | null;
  execution_status: string | null;
  reuse_potential: string | null;
  anonymization_status: CandidateKnowledge["anonymization_status"];
  consent_status: CandidateKnowledge["consent_status"];
  review_status: CandidateKnowledge["review_status"];
  evidence_level: CandidateKnowledge["evidence_level"];
  pro_candidate: boolean;
  public_rule_candidate: boolean;
  created_at: string;
  updated_at: string;
}

function requireStyleosClient() {
  const client = getStyleosBrowserClient();
  if (!client) {
    throw new Error("Supabase Mode is selected but public Supabase configuration is incomplete.");
  }
  return client;
}

async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Supabase Mode requires creator login.");
  }
  return user;
}

function toDbServiceStatus(status: ServiceStatus): ServiceRow["status"] {
  if (status === "archived") {
    return "archived";
  }
  if (status === "paused" || status === "draft") {
    return "paused";
  }
  return "active";
}

function mapService(row: ServiceRow): Service {
  return {
    serviceId: row.id,
    creatorId: row.creator_user_id,
    serviceName: row.name,
    module: row.module,
    status: row.status,
    description: row.description ?? "",
    priceNote: row.price_note ?? "",
    deliveryFormat: row.delivery_format ?? "Markdown Lite Report + Barber Brief",
    intakeToken: row.intake_token,
    intakePath: `/intake/${row.intake_token}`,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapCase(row: CaseRow, serviceName = "Hairstyle Service"): FanCase {
  return {
    caseId: row.id,
    creatorId: row.creator_user_id,
    serviceId: row.service_id,
    serviceName,
    fanNickname: row.fan_alias ?? "fan_alias",
    targetScenario: row.target_scenario ?? "",
    status: row.status,
    intake: row.intake as unknown as FanCase["intake"],
    tags: (Array.isArray(row.tags) ? row.tags : []) as unknown as FanCase["tags"],
    ruleMatches: [],
    selectedRuleIds: row.selected_rule_ids ?? [],
    shareToken: row.share_token ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function getBarberBriefText(value: JsonRecord | null) {
  if (!value) {
    return "";
  }
  const text = value.text;
  return typeof text === "string" ? text : JSON.stringify(value, null, 2);
}

function mapReport(row: ReportRow): LiteReport {
  return {
    reportId: row.id,
    caseId: row.case_id,
    title: `Hairstyle Lite Report - ${row.id.slice(0, 8)}`,
    markdown: row.markdown ?? "",
    barberBrief: getBarberBriefText(row.barber_brief),
    status: row.status,
    shareToken: row.share_token,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deliveredAt: row.delivered_at ?? undefined
  };
}

function mapFeedback(row: FeedbackRow): Feedback {
  return {
    feedbackId: row.id,
    reportId: row.report_id,
    caseId: row.case_id,
    easyToUnderstand: row.easy_to_understand === false ? "no" : "yes",
    mostUsefulPart: row.most_useful ?? "",
    willUseBarberBrief: row.will_use_barber_brief === false ? "no" : "yes",
    showedToHairstylist: row.shown_to_hairstylist === true ? "yes" : "no",
    satisfactionScore: row.score ?? 0,
    creatorNote: row.feedback_text ?? "",
    consentToAnonymizedLearning: row.consent_to_anonymized_learning,
    createdAt: row.created_at
  };
}

function mapCandidate(row: CandidateKnowledgeRow): CandidateKnowledge {
  return {
    candidate_id: row.id,
    source_case_id: row.source_case_id ?? "",
    feature_tags: row.feature_tags ?? [],
    scenario_tags: row.scenario_tags ?? [],
    constraints: row.constraints ?? [],
    selected_rule_ids: row.selected_rule_ids ?? [],
    recommendation_summary: row.recommendation_summary ?? "",
    execution_card_summary: row.execution_card_summary ?? "",
    avoid_list: row.avoid_list ?? [],
    execution_feedback: row.execution_card_summary ?? "",
    creator_feedback: row.creator_feedback ?? "",
    user_feedback_score: row.user_feedback_score ?? 0,
    execution_status: row.execution_status ?? "",
    reuse_potential: row.reuse_potential ?? "",
    anonymization_status: row.anonymization_status,
    consent_status: row.consent_status,
    review_status: row.review_status,
    evidence_level: row.evidence_level,
    pro_candidate: row.consent_status === "granted" && row.pro_candidate,
    public_rule_candidate: row.public_rule_candidate,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function listServicesInternal() {
  await requireUser();
  const client = requireStyleosClient();
  const { data, error } = await client.from("services").select("*").order("created_at", { ascending: false });
  if (error) {
    throw error;
  }
  return ((data ?? []) as ServiceRow[]).map(mapService);
}

export const supabaseAdapter: StorageAdapter = {
  async getCurrentCreator() {
    const user = await getCurrentUser();
    if (!user) {
      return null;
    }
    return {
      creatorId: user.id,
      displayName: "Authenticated Creator",
      creatorType: "individual_creator",
      focusArea: "Hairstyle workflow",
      studioName: "StyleOS Cloud Studio",
      createdAt: user.created_at ?? new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  async saveCreator(creator: Creator) {
    await requireUser();
    return creator;
  },
  async listServices() {
    return listServicesInternal();
  },
  async createService(service: ServiceInput) {
    const user = await requireUser();
    const client = requireStyleosClient();
    const { data, error } = await client
      .from("services")
      .insert({
        creator_user_id: user.id,
        name: service.serviceName,
        module: "hairstyle",
        description: service.description,
        price_note: service.priceNote ?? null,
        delivery_format: service.deliveryFormat,
        status: toDbServiceStatus(service.status),
        intake_token: service.intakeToken ?? createIntakeToken()
      })
      .select("*")
      .single();
    if (error) {
      throw error;
    }
    return mapService(data as ServiceRow);
  },
  async updateService(serviceId, updates) {
    await requireUser();
    const client = requireStyleosClient();
    const payload: Partial<ServiceRow> = {};
    if (updates.serviceName) payload.name = updates.serviceName;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.priceNote !== undefined) payload.price_note = updates.priceNote;
    if (updates.deliveryFormat !== undefined) payload.delivery_format = updates.deliveryFormat;
    if (updates.status) payload.status = toDbServiceStatus(updates.status);

    const { data, error } = await client.from("services").update(payload).eq("id", serviceId).select("*").single();
    if (error) {
      throw error;
    }
    return mapService(data as ServiceRow);
  },
  async getServiceById(serviceId) {
    const services = await listServicesInternal();
    return services.find((service) => service.serviceId === serviceId) ?? null;
  },
  async getServiceByIntakeToken(intakeToken) {
    await requireUser();
    const client = requireStyleosClient();
    const { data, error } = await client.from("services").select("*").eq("intake_token", intakeToken).maybeSingle();
    if (error) {
      throw error;
    }
    return data ? mapService(data as ServiceRow) : null;
  },
  async listCases() {
    await requireUser();
    const client = requireStyleosClient();
    const [caseResult, services] = await Promise.all([
      client.from("fan_cases").select("*").order("created_at", { ascending: false }),
      listServicesInternal()
    ]);
    if (caseResult.error) {
      throw caseResult.error;
    }
    const serviceNameById = new Map(services.map((service) => [service.serviceId, service.serviceName]));
    return ((caseResult.data ?? []) as CaseRow[]).map((row) => mapCase(row, serviceNameById.get(row.service_id)));
  },
  async createCase(caseItem: CaseInput) {
    const user = await requireUser();
    const client = requireStyleosClient();
    const { data, error } = await client
      .from("fan_cases")
      .insert({
        creator_user_id: user.id,
        service_id: caseItem.serviceId,
        fan_alias: caseItem.fanNickname,
        target_scenario: caseItem.targetScenario,
        status: caseItem.status,
        intake: caseItem.intake,
        tags: caseItem.tags,
        selected_rule_ids: caseItem.selectedRuleIds,
        share_token: caseItem.shareToken ?? createShareToken()
      })
      .select("*")
      .single();
    if (error) {
      throw error;
    }
    return mapCase(data as CaseRow, caseItem.serviceName);
  },
  async updateCase(caseId, updates) {
    await requireUser();
    const client = requireStyleosClient();
    const payload: Partial<CaseRow> = {};
    if (updates.fanNickname !== undefined) payload.fan_alias = updates.fanNickname;
    if (updates.targetScenario !== undefined) payload.target_scenario = updates.targetScenario;
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.intake !== undefined) payload.intake = updates.intake as unknown as JsonRecord;
    if (updates.tags !== undefined) payload.tags = updates.tags as unknown[];
    if (updates.selectedRuleIds !== undefined) payload.selected_rule_ids = updates.selectedRuleIds;
    if (updates.shareToken !== undefined) payload.share_token = updates.shareToken;

    const { data, error } = await client.from("fan_cases").update(payload).eq("id", caseId).select("*").single();
    if (error) {
      throw error;
    }
    return mapCase(data as CaseRow);
  },
  async getCaseById(caseId) {
    const cases = await this.listCases();
    return cases.find((caseItem) => caseItem.caseId === caseId) ?? null;
  },
  async listReports() {
    await requireUser();
    const client = requireStyleosClient();
    const { data, error } = await client.from("reports").select("*").order("created_at", { ascending: false });
    if (error) {
      throw error;
    }
    return ((data ?? []) as ReportRow[]).map(mapReport);
  },
  async createReport(report: ReportInput) {
    const user = await requireUser();
    const client = requireStyleosClient();
    const { data, error } = await client
      .from("reports")
      .insert({
        creator_user_id: user.id,
        case_id: report.caseId,
        share_token: report.shareToken ?? createShareToken(),
        markdown: report.markdown,
        barber_brief: { text: report.barberBrief },
        status: report.status,
        delivered_at: report.deliveredAt ?? null
      })
      .select("*")
      .single();
    if (error) {
      throw error;
    }
    return mapReport(data as ReportRow);
  },
  async updateReport(reportId, updates) {
    await requireUser();
    const client = requireStyleosClient();
    const payload: Partial<ReportRow> = {};
    if (updates.markdown !== undefined) payload.markdown = updates.markdown;
    if (updates.barberBrief !== undefined) payload.barber_brief = { text: updates.barberBrief };
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.deliveredAt !== undefined) payload.delivered_at = updates.deliveredAt;

    const { data, error } = await client.from("reports").update(payload).eq("id", reportId).select("*").single();
    if (error) {
      throw error;
    }
    return mapReport(data as ReportRow);
  },
  async getReportById(reportId) {
    const reports = await this.listReports();
    return reports.find((report) => report.reportId === reportId) ?? null;
  },
  async getReportByShareToken(shareToken) {
    await requireUser();
    const client = requireStyleosClient();
    const { data, error } = await client.from("reports").select("*").eq("share_token", shareToken).maybeSingle();
    if (error) {
      throw error;
    }
    return data ? mapReport(data as ReportRow) : null;
  },
  async listFeedback() {
    await requireUser();
    const client = requireStyleosClient();
    const { data, error } = await client.from("feedback").select("*").order("created_at", { ascending: false });
    if (error) {
      throw error;
    }
    return ((data ?? []) as FeedbackRow[]).map(mapFeedback);
  },
  async createFeedback(feedback: FeedbackInput) {
    await requireUser();
    const client = requireStyleosClient();
    const { data, error } = await client
      .from("feedback")
      .insert({
        report_id: feedback.reportId,
        case_id: feedback.caseId,
        score: feedback.satisfactionScore,
        easy_to_understand: feedback.easyToUnderstand === "yes",
        most_useful: feedback.mostUsefulPart,
        will_use_barber_brief: feedback.willUseBarberBrief === "yes",
        shown_to_hairstylist: feedback.showedToHairstylist === "yes",
        feedback_text: feedback.creatorNote,
        consent_to_anonymized_learning: feedback.consentToAnonymizedLearning
      })
      .select("*")
      .single();
    if (error) {
      throw error;
    }
    return mapFeedback(data as FeedbackRow);
  },
  async listCandidateKnowledge() {
    await requireUser();
    const client = requireStyleosClient();
    const { data, error } = await client.from("candidate_knowledge").select("*").order("created_at", { ascending: false });
    if (error) {
      throw error;
    }
    return ((data ?? []) as CandidateKnowledgeRow[]).map(mapCandidate);
  },
  async createCandidateKnowledge(candidate: CandidateKnowledgeInput) {
    const user = await requireUser();
    const client = requireStyleosClient();
    const consentStatus = candidate.consent_status ?? "unknown";
    const { data, error } = await client
      .from("candidate_knowledge")
      .insert({
        creator_user_id: user.id,
        source_case_id: candidate.source_case_id || null,
        feature_tags: candidate.feature_tags,
        scenario_tags: candidate.scenario_tags,
        constraints: candidate.constraints,
        selected_rule_ids: candidate.selected_rule_ids,
        recommendation_summary: candidate.recommendation_summary,
        execution_card_summary: candidate.execution_card_summary,
        avoid_list: candidate.avoid_list,
        user_feedback_score: candidate.user_feedback_score,
        creator_feedback: candidate.creator_feedback,
        execution_status: candidate.execution_status,
        reuse_potential: candidate.reuse_potential,
        anonymization_status: candidate.anonymization_status,
        consent_status: consentStatus,
        review_status: candidate.review_status,
        evidence_level: candidate.evidence_level,
        pro_candidate: consentStatus === "granted" && candidate.pro_candidate,
        public_rule_candidate: candidate.public_rule_candidate
      })
      .select("*")
      .single();
    if (error) {
      throw error;
    }
    return mapCandidate(data as CandidateKnowledgeRow);
  },
  async updateCandidateKnowledge(candidateId, updates) {
    await requireUser();
    const client = requireStyleosClient();
    const payload: Partial<CandidateKnowledgeRow> = {};
    if (updates.review_status !== undefined) payload.review_status = updates.review_status;
    if (updates.public_rule_candidate !== undefined) payload.public_rule_candidate = updates.public_rule_candidate;
    if (updates.pro_candidate !== undefined) payload.pro_candidate = updates.consent_status === "denied" ? false : updates.pro_candidate;
    if (updates.creator_feedback !== undefined) payload.creator_feedback = updates.creator_feedback;
    if (updates.consent_status !== undefined) payload.consent_status = updates.consent_status;
    if (updates.anonymization_status !== undefined) payload.anonymization_status = updates.anonymization_status;

    const { data, error } = await client.from("candidate_knowledge").update(payload).eq("id", candidateId).select("*").single();
    if (error) {
      throw error;
    }
    return mapCandidate(data as CandidateKnowledgeRow);
  },
  async resetAllData() {
    throw new Error("Cloud reset is disabled. Use Local Mode reset only.");
  },
  async seedInitialData() {
    return;
  }
};

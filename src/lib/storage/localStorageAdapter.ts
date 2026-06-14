import { defaultCreator, seedServices } from "@/data/seedServices";
import { createId, nowIso } from "@/lib/ids";
import { createIntakeToken, createShareToken } from "@/lib/tokens";
import type { CandidateKnowledge, ConsentRecord, Creator, FanCase, Feedback, LiteReport, Service } from "@/types";
import type {
  CandidateKnowledgeInput,
  CaseInput,
  ConsentRecordInput,
  FeedbackInput,
  ReportInput,
  ServiceInput,
  StorageAdapter
} from "@/lib/storage/types";

const keys = {
  initialized: "styleos_ce_initialized_v0_2",
  creator: "styleos_ce_creator",
  services: "styleos_ce_services",
  cases: "styleos_ce_cases",
  reports: "styleos_ce_reports",
  feedback: "styleos_ce_feedback",
  consentRecords: "styleos_ce_consent_records",
  candidates: "styleos_ce_candidates"
};

const memoryStore = new Map<string, string>();
const fallbackPrefix = "styleos_ce_fallback_store:";

function canUseLocalStorage() {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
    return false;
  }
  try {
    const probeKey = "styleos_ce_storage_probe";
    window.localStorage.setItem(probeKey, "true");
    window.localStorage.removeItem(probeKey);
    return true;
  } catch {
    return false;
  }
}

function readFallbackStore() {
  if (typeof window === "undefined") {
    return {} as Record<string, string>;
  }
  if (!window.name.startsWith(fallbackPrefix)) {
    return {} as Record<string, string>;
  }
  try {
    return JSON.parse(window.name.slice(fallbackPrefix.length)) as Record<string, string>;
  } catch {
    return {} as Record<string, string>;
  }
}

function writeFallbackStore(value: Record<string, string>) {
  if (typeof window === "undefined") {
    return;
  }
  window.name = `${fallbackPrefix}${JSON.stringify(value)}`;
}

function getRaw(key: string) {
  if (canUseLocalStorage()) {
    return window.localStorage.getItem(key);
  }
  const fallback = readFallbackStore();
  if (fallback[key]) {
    return fallback[key];
  }
  return memoryStore.get(key) ?? null;
}

function setRaw(key: string, value: string) {
  if (canUseLocalStorage()) {
    window.localStorage.setItem(key, value);
    return;
  }
  memoryStore.set(key, value);
  const fallback = readFallbackStore();
  fallback[key] = value;
  writeFallbackStore(fallback);
}

function removeRaw(key: string) {
  if (canUseLocalStorage()) {
    window.localStorage.removeItem(key);
    return;
  }
  memoryStore.delete(key);
  const fallback = readFallbackStore();
  delete fallback[key];
  writeFallbackStore(fallback);
}

function readJson<T>(key: string, fallback: T): T {
  const raw = getRaw(key);
  if (!raw) {
    return fallback;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  setRaw(key, JSON.stringify(value));
}

function withServiceDefaults(service: Service): Service {
  const intakeToken = service.intakeToken ?? createIntakeToken();
  return {
    ...service,
    intakeToken,
    intakePath: service.intakePath || `/intake/${service.serviceId}`
  };
}

function withReportDefaults(report: LiteReport): LiteReport {
  return {
    ...report,
    shareToken: report.shareToken ?? createShareToken()
  };
}

export function seedInitialDataSync() {
  if (getRaw(keys.initialized)) {
    return;
  }
  writeJson(keys.creator, defaultCreator);
  writeJson(keys.services, seedServices.map(withServiceDefaults));
  writeJson(keys.cases, []);
  writeJson(keys.reports, []);
  writeJson(keys.feedback, []);
  writeJson(keys.consentRecords, []);
  writeJson(keys.candidates, []);
  setRaw(keys.initialized, "true");
}

export function resetAllDataSync() {
  Object.values(keys).forEach((key) => removeRaw(key));
  seedInitialDataSync();
}

export function getCreatorSync() {
  seedInitialDataSync();
  return readJson<Creator>(keys.creator, defaultCreator);
}

export function saveCreatorSync(creator: Creator) {
  writeJson(keys.creator, creator);
}

export function getServicesSync() {
  seedInitialDataSync();
  const services = readJson<Service[]>(keys.services, seedServices);
  const normalized = services.map(withServiceDefaults);
  writeJson(keys.services, normalized);
  return normalized;
}

export function saveServicesSync(services: Service[]) {
  writeJson(keys.services, services.map(withServiceDefaults));
}

export function getCasesSync() {
  seedInitialDataSync();
  return readJson<FanCase[]>(keys.cases, []);
}

export function saveCasesSync(cases: FanCase[]) {
  writeJson(keys.cases, cases);
}

export function getReportsSync() {
  seedInitialDataSync();
  const reports = readJson<LiteReport[]>(keys.reports, []);
  const normalized = reports.map(withReportDefaults);
  writeJson(keys.reports, normalized);
  return normalized;
}

export function saveReportsSync(reports: LiteReport[]) {
  writeJson(keys.reports, reports.map(withReportDefaults));
}

export function getFeedbackSync() {
  seedInitialDataSync();
  return readJson<Feedback[]>(keys.feedback, []);
}

export function saveFeedbackSync(feedback: Feedback[]) {
  writeJson(keys.feedback, feedback);
}

export function getConsentRecordsSync() {
  seedInitialDataSync();
  return readJson<ConsentRecord[]>(keys.consentRecords, []);
}

export function saveConsentRecordsSync(records: ConsentRecord[]) {
  writeJson(keys.consentRecords, records);
}

export function getCandidateKnowledgeSync() {
  seedInitialDataSync();
  return readJson<CandidateKnowledge[]>(keys.candidates, []);
}

export function saveCandidateKnowledgeSync(candidates: CandidateKnowledge[]) {
  writeJson(keys.candidates, candidates);
}

export const localStorageAdapter: StorageAdapter = {
  async getCurrentCreator() {
    return getCreatorSync();
  },
  async saveCreator(creator) {
    const next = { ...creator, updatedAt: nowIso() };
    saveCreatorSync(next);
    return next;
  },
  async listServices() {
    return getServicesSync();
  },
  async createService(service) {
    const now = nowIso();
    const serviceId = service.serviceId ?? createId("service");
    const next: Service = withServiceDefaults({
      ...service,
      serviceId,
      intakePath: service.intakePath ?? `/intake/${serviceId}`,
      createdAt: service.createdAt ?? now,
      updatedAt: service.updatedAt ?? now
    });
    saveServicesSync([next, ...getServicesSync()]);
    return next;
  },
  async updateService(serviceId, updates) {
    const services = getServicesSync();
    const existing = services.find((service) => service.serviceId === serviceId);
    if (!existing) {
      throw new Error("Service not found.");
    }
    const next = withServiceDefaults({ ...existing, ...updates, updatedAt: nowIso() });
    saveServicesSync(services.map((service) => (service.serviceId === serviceId ? next : service)));
    return next;
  },
  async getServiceById(serviceId) {
    return getServicesSync().find((service) => service.serviceId === serviceId) ?? null;
  },
  async getServiceByIntakeToken(intakeToken) {
    return getServicesSync().find((service) => service.intakeToken === intakeToken || service.serviceId === intakeToken) ?? null;
  },
  async listCases() {
    return getCasesSync();
  },
  async createCase(caseItem) {
    const now = nowIso();
    const next: FanCase = {
      ...caseItem,
      caseId: caseItem.caseId ?? createId("case"),
      createdAt: caseItem.createdAt ?? now,
      updatedAt: caseItem.updatedAt ?? now
    };
    saveCasesSync([next, ...getCasesSync()]);
    return next;
  },
  async updateCase(caseId, updates) {
    const cases = getCasesSync();
    const existing = cases.find((caseItem) => caseItem.caseId === caseId);
    if (!existing) {
      throw new Error("Case not found.");
    }
    const next = { ...existing, ...updates, updatedAt: nowIso() };
    saveCasesSync(cases.map((caseItem) => (caseItem.caseId === caseId ? next : caseItem)));
    return next;
  },
  async getCaseById(caseId) {
    return getCasesSync().find((caseItem) => caseItem.caseId === caseId) ?? null;
  },
  async listReports() {
    return getReportsSync();
  },
  async createReport(report) {
    const now = nowIso();
    const next: LiteReport = withReportDefaults({
      ...report,
      reportId: report.reportId ?? createId("report"),
      createdAt: report.createdAt ?? now,
      updatedAt: report.updatedAt ?? now
    });
    saveReportsSync([next, ...getReportsSync()]);
    return next;
  },
  async updateReport(reportId, updates) {
    const reports = getReportsSync();
    const existing = reports.find((report) => report.reportId === reportId);
    if (!existing) {
      throw new Error("Report not found.");
    }
    const next = withReportDefaults({ ...existing, ...updates, updatedAt: nowIso() });
    saveReportsSync(reports.map((report) => (report.reportId === reportId ? next : report)));
    return next;
  },
  async getReportById(reportId) {
    return getReportsSync().find((report) => report.reportId === reportId) ?? null;
  },
  async getReportByShareToken(shareToken) {
    return getReportsSync().find((report) => report.shareToken === shareToken || report.reportId === shareToken) ?? null;
  },
  async listFeedback() {
    return getFeedbackSync();
  },
  async createFeedback(feedback) {
    const next: Feedback = {
      ...feedback,
      feedbackId: feedback.feedbackId ?? createId("feedback"),
      createdAt: feedback.createdAt ?? nowIso()
    };
    saveFeedbackSync([next, ...getFeedbackSync().filter((item) => item.reportId !== next.reportId)]);
    await this.createConsentRecord({
      caseId: next.caseId,
      reportId: next.reportId,
      consentType: "anonymized_learning",
      consentValue: next.consentToAnonymizedLearning,
      consentNote: next.consentToAnonymizedLearning
        ? "Fan allowed anonymized learning from this feedback."
        : "Fan did not allow anonymized learning from this feedback."
    });
    return next;
  },
  async listConsentRecords() {
    return getConsentRecordsSync();
  },
  async createConsentRecord(consent: ConsentRecordInput) {
    const next: ConsentRecord = {
      ...consent,
      consentId: consent.consentId ?? createId("consent"),
      createdAt: consent.createdAt ?? nowIso()
    };
    saveConsentRecordsSync([next, ...getConsentRecordsSync()]);
    return next;
  },
  async listCandidateKnowledge() {
    return getCandidateKnowledgeSync();
  },
  async createCandidateKnowledge(candidate) {
    const now = nowIso();
    const next: CandidateKnowledge = {
      ...candidate,
      candidate_id: candidate.candidate_id ?? createId("candidate"),
      createdAt: candidate.createdAt ?? now,
      updatedAt: candidate.updatedAt ?? now
    };
    saveCandidateKnowledgeSync([next, ...getCandidateKnowledgeSync()]);
    return next;
  },
  async updateCandidateKnowledge(candidateId, updates) {
    const candidates = getCandidateKnowledgeSync();
    const existing = candidates.find((candidate) => candidate.candidate_id === candidateId);
    if (!existing) {
      throw new Error("Candidate knowledge not found.");
    }
    const next = { ...existing, ...updates, updatedAt: nowIso() };
    saveCandidateKnowledgeSync(candidates.map((candidate) => (candidate.candidate_id === candidateId ? next : candidate)));
    return next;
  },
  async resetAllData() {
    resetAllDataSync();
  },
  async seedInitialData() {
    seedInitialDataSync();
  }
};

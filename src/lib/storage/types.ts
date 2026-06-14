import type { CandidateKnowledge, Creator, FanCase, Feedback, LiteReport, Service } from "@/types";

export type ServiceInput = Omit<Service, "serviceId" | "createdAt" | "updatedAt" | "intakePath" | "intakeToken"> &
  Partial<Pick<Service, "serviceId" | "createdAt" | "updatedAt" | "intakePath" | "intakeToken">>;

export type CaseInput = Omit<FanCase, "caseId" | "createdAt" | "updatedAt"> &
  Partial<Pick<FanCase, "caseId" | "createdAt" | "updatedAt">>;

export type ReportInput = Omit<LiteReport, "reportId" | "createdAt" | "updatedAt" | "shareToken"> &
  Partial<Pick<LiteReport, "reportId" | "createdAt" | "updatedAt" | "shareToken">>;

export type FeedbackInput = Omit<Feedback, "feedbackId" | "createdAt"> & Partial<Pick<Feedback, "feedbackId" | "createdAt">>;

export type CandidateKnowledgeInput = Omit<CandidateKnowledge, "candidate_id" | "createdAt" | "updatedAt"> &
  Partial<Pick<CandidateKnowledge, "candidate_id" | "createdAt" | "updatedAt">>;

export interface StorageAdapter {
  getCurrentCreator(): Promise<Creator | null>;
  saveCreator(creator: Creator): Promise<Creator>;

  listServices(): Promise<Service[]>;
  createService(service: ServiceInput): Promise<Service>;
  updateService(serviceId: string, updates: Partial<Service>): Promise<Service>;
  getServiceById(serviceId: string): Promise<Service | null>;
  getServiceByIntakeToken(intakeToken: string): Promise<Service | null>;

  listCases(): Promise<FanCase[]>;
  createCase(caseItem: CaseInput): Promise<FanCase>;
  updateCase(caseId: string, updates: Partial<FanCase>): Promise<FanCase>;
  getCaseById(caseId: string): Promise<FanCase | null>;

  listReports(): Promise<LiteReport[]>;
  createReport(report: ReportInput): Promise<LiteReport>;
  updateReport(reportId: string, updates: Partial<LiteReport>): Promise<LiteReport>;
  getReportById(reportId: string): Promise<LiteReport | null>;
  getReportByShareToken(shareToken: string): Promise<LiteReport | null>;

  listFeedback(): Promise<Feedback[]>;
  createFeedback(feedback: FeedbackInput): Promise<Feedback>;

  listCandidateKnowledge(): Promise<CandidateKnowledge[]>;
  createCandidateKnowledge(candidate: CandidateKnowledgeInput): Promise<CandidateKnowledge>;
  updateCandidateKnowledge(candidateId: string, updates: Partial<CandidateKnowledge>): Promise<CandidateKnowledge>;

  resetAllData(): Promise<void>;
  seedInitialData(): Promise<void>;
}

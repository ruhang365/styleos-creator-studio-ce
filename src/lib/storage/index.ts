import { getStorageMode } from "@/lib/config-public";
import { localStorageAdapter } from "@/lib/storage/localStorageAdapter";
import { supabaseAdapter } from "@/lib/storage/supabaseAdapter";
import {
  getCandidateKnowledgeSync,
  getCasesSync,
  getConsentRecordsSync,
  getCreatorSync,
  getFeedbackSync,
  getReportsSync,
  getServicesSync,
  resetAllDataSync,
  saveCandidateKnowledgeSync,
  saveCasesSync,
  saveConsentRecordsSync,
  saveCreatorSync,
  saveFeedbackSync,
  saveReportsSync,
  saveServicesSync,
  seedInitialDataSync
} from "@/lib/storage/localStorageAdapter";

export * from "@/lib/storage/types";

export function getStorageAdapter() {
  return getStorageMode() === "supabase" ? supabaseAdapter : localStorageAdapter;
}

export async function getCurrentCreator() {
  return getStorageAdapter().getCurrentCreator();
}

export async function saveCurrentCreator(creator: Parameters<typeof localStorageAdapter.saveCreator>[0]) {
  return getStorageAdapter().saveCreator(creator);
}

export async function listServices() {
  return getStorageAdapter().listServices();
}

export async function listCases() {
  return getStorageAdapter().listCases();
}

export async function listReports() {
  return getStorageAdapter().listReports();
}

export async function listFeedback() {
  return getStorageAdapter().listFeedback();
}

export async function listConsentRecords() {
  return getStorageAdapter().listConsentRecords();
}

export async function listCandidateKnowledge() {
  return getStorageAdapter().listCandidateKnowledge();
}

export const seedInitialData = seedInitialDataSync;
export const resetAllData = resetAllDataSync;
export const getCreator = getCreatorSync;
export const saveCreator = saveCreatorSync;
export const getServices = getServicesSync;
export const saveServices = saveServicesSync;
export const getCases = getCasesSync;
export const saveCases = saveCasesSync;
export const getReports = getReportsSync;
export const saveReports = saveReportsSync;
export const getFeedback = getFeedbackSync;
export const saveFeedback = saveFeedbackSync;
export const getConsentRecords = getConsentRecordsSync;
export const saveConsentRecords = saveConsentRecordsSync;
export const getCandidateKnowledge = getCandidateKnowledgeSync;
export const saveCandidateKnowledge = saveCandidateKnowledgeSync;

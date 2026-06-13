import { defaultCreator, seedServices } from "@/data/seedServices";
import type { CandidateKnowledge, Creator, FanCase, Feedback, LiteReport, Service } from "@/types";

const keys = {
  initialized: "styleos_ce_initialized_v0_2",
  creator: "styleos_ce_creator",
  services: "styleos_ce_services",
  cases: "styleos_ce_cases",
  reports: "styleos_ce_reports",
  feedback: "styleos_ce_feedback",
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

export function seedInitialData() {
  if (getRaw(keys.initialized)) {
    return;
  }
  writeJson(keys.creator, defaultCreator);
  writeJson(keys.services, seedServices);
  writeJson(keys.cases, []);
  writeJson(keys.reports, []);
  writeJson(keys.feedback, []);
  writeJson(keys.candidates, []);
  setRaw(keys.initialized, "true");
}

export function resetAllData() {
  Object.values(keys).forEach((key) => removeRaw(key));
  seedInitialData();
}

export function getCreator() {
  seedInitialData();
  return readJson<Creator>(keys.creator, defaultCreator);
}

export function getCreators() {
  return [getCreator()];
}

export function saveCreator(creator: Creator) {
  writeJson(keys.creator, creator);
}

export function getServices() {
  seedInitialData();
  return readJson<Service[]>(keys.services, seedServices);
}

export function saveServices(services: Service[]) {
  writeJson(keys.services, services);
}

export function getCases() {
  seedInitialData();
  return readJson<FanCase[]>(keys.cases, []);
}

export function saveCases(cases: FanCase[]) {
  writeJson(keys.cases, cases);
}

export function getReports() {
  seedInitialData();
  return readJson<LiteReport[]>(keys.reports, []);
}

export function saveReports(reports: LiteReport[]) {
  writeJson(keys.reports, reports);
}

export function getFeedback() {
  seedInitialData();
  return readJson<Feedback[]>(keys.feedback, []);
}

export function saveFeedback(feedback: Feedback[]) {
  writeJson(keys.feedback, feedback);
}

export function getCandidateKnowledge() {
  seedInitialData();
  return readJson<CandidateKnowledge[]>(keys.candidates, []);
}

export function saveCandidateKnowledge(candidates: CandidateKnowledge[]) {
  writeJson(keys.candidates, candidates);
}

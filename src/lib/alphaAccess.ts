import { createHash } from "crypto";

function splitEnvList(value: string) {
  return value
    .split(/[\s,;]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function normalizeAlphaEmail(email: string) {
  return email.trim().toLowerCase();
}

export function hashAlphaEmail(email: string) {
  return createHash("sha256").update(normalizeAlphaEmail(email)).digest("hex");
}

export function getAlphaAllowedEmails() {
  return splitEnvList(process.env.STYLEOS_ALPHA_ALLOWED_EMAILS ?? "").map(normalizeAlphaEmail);
}

export function getAlphaAllowedEmailHashes() {
  return splitEnvList(process.env.STYLEOS_ALPHA_ALLOWED_EMAIL_HASHES ?? "").map((hash) => hash.toLowerCase());
}

export function isAlphaAccessConfigured() {
  return getAlphaAllowedEmails().length > 0 || getAlphaAllowedEmailHashes().length > 0;
}

export function isAlphaEmailAllowed(email: string) {
  const normalized = normalizeAlphaEmail(email);
  if (!normalized) {
    return false;
  }

  const allowedEmails = getAlphaAllowedEmails();
  if (allowedEmails.includes(normalized)) {
    return true;
  }

  const allowedHashes = getAlphaAllowedEmailHashes();
  return allowedHashes.includes(hashAlphaEmail(normalized));
}


const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const PHONE_PATTERN = /(?:\+?\d[\d\s-]{7,}\d)/g;

export function sanitizeText(value: string, maxLength = 1200) {
  return value
    .replace(EMAIL_PATTERN, "[email_removed]")
    .replace(PHONE_PATTERN, "[phone_removed]")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function nonEmpty(value: string | undefined, fallback: string) {
  const cleaned = sanitizeText(value ?? "");
  return cleaned.length > 0 ? cleaned : fallback;
}

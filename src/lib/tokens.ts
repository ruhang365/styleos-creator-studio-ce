function createSecureToken(prefix: string) {
  const cryptoApi = globalThis.crypto;

  if (cryptoApi?.randomUUID) {
    return `${prefix}_${cryptoApi.randomUUID().replaceAll("-", "")}`;
  }

  if (cryptoApi?.getRandomValues) {
    const bytes = new Uint8Array(24);
    cryptoApi.getRandomValues(bytes);
    const value = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
    return `${prefix}_${value}`;
  }

  throw new Error("Secure token generation requires Web Crypto support.");
}

export function createIntakeToken() {
  return createSecureToken("intake");
}

export function createShareToken() {
  return createSecureToken("share");
}

export function createFeedbackToken() {
  return createSecureToken("feedback");
}

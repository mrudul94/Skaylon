/**
 * Sanity webhook signature check, with WebCrypto only (runs on Workers).
 *
 * Header `sanity-webhook-signature: t=<unix ms>,v1=<sig>` where
 * sig = base64url(HMAC-SHA256(secret, `${t}.${rawBody}`)).
 * Rejects stale timestamps to stop replays. Constant-time comparison.
 * Tested by scripts/verify-webhook.mts.
 */
export const MAX_AGE_MS = 5 * 60 * 1000;

function toBase64Url(bytes: ArrayBuffer): string {
  let s = "";
  for (const b of new Uint8Array(bytes)) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

const normalise = (sig: string) => sig.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function signPayload(secret: string, timestamp: number, body: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return toBase64Url(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${timestamp}.${body}`)));
}

export async function verifySanitySignature(
  body: string,
  header: string | null,
  secret: string,
  now = Date.now(),
): Promise<{ ok: true } | { ok: false; reason: string }> {
  if (!header) return { ok: false, reason: "missing signature" };
  const parts = Object.fromEntries(header.split(",").map((p) => p.trim().split("=", 2) as [string, string]));
  const t = Number(parts.t);
  const v1 = parts.v1;
  if (!Number.isFinite(t) || !v1) return { ok: false, reason: "malformed signature" };
  if (Math.abs(now - t) > MAX_AGE_MS) return { ok: false, reason: "stale signature" };
  const expected = await signPayload(secret, t, body);
  return timingSafeEqual(expected, normalise(v1)) ? { ok: true } : { ok: false, reason: "bad signature" };
}

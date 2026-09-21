import "server-only";

type Limiter = { limit: (opts: { key: string }) => Promise<{ success: boolean }> };

// Fallback for `next start`/dev (no Workers binding): per-process window.
const memory = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX = 5;

/**
 * 5 submissions per minute per IP. On Cloudflare this uses the Workers Rate
 * Limiting binding (wrangler.jsonc → CONTACT_RATE_LIMIT), which is shared
 * across isolates; elsewhere an in-memory window.
 */
export async function allowSubmission(ip: string): Promise<boolean> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const env = getCloudflareContext().env as unknown as { CONTACT_RATE_LIMIT?: Limiter };
    if (env.CONTACT_RATE_LIMIT) return (await env.CONTACT_RATE_LIMIT.limit({ key: ip })).success;
  } catch {
    // Not running on Workers.
  }
  const now = Date.now();
  const recent = (memory.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX) return false;
  recent.push(now);
  memory.set(ip, recent);
  return true;
}

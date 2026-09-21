import { NextResponse } from "next/server";

const EVENTS = new Set(["cta_click", "contact_submitted", "contact_failed", "whatsapp_click", "email_click"]);

type AnalyticsEngine = { writeDataPoint: (p: { blobs?: string[]; doubles?: number[]; indexes?: string[] }) => void };

/**
 * First-party conversion events → Workers Analytics Engine (binding EVENTS).
 * Stores the event name, a short label, the path and the visitor's country
 * (from Cloudflare's edge), never an IP or identifier. Same-origin only.
 */
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== new URL(request.url).host) {
    return new NextResponse(null, { status: 403 });
  }

  let payload: { name?: unknown; label?: unknown; path?: unknown };
  try {
    payload = await request.json();
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  if (typeof payload.name !== "string" || !EVENTS.has(payload.name)) {
    return new NextResponse(null, { status: 400 });
  }
  const label = typeof payload.label === "string" ? payload.label.slice(0, 60) : "";
  const path = typeof payload.path === "string" ? payload.path.slice(0, 200) : "";

  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const ctx = getCloudflareContext();
    const events = (ctx.env as unknown as { EVENTS?: AnalyticsEngine }).EVENTS;
    const country = (ctx.cf as { country?: string } | undefined)?.country ?? "";
    events?.writeDataPoint({ blobs: [payload.name, label, path, country], doubles: [1], indexes: [payload.name] });
  } catch {
    // Not on Workers (local dev/tests): accept and drop.
  }
  return new NextResponse(null, { status: 204 });
}

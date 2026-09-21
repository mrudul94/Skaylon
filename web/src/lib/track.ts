"use client";

export type TrackEvent = "cta_click" | "contact_submitted" | "contact_failed" | "whatsapp_click" | "email_click";

/**
 * First-party, cookieless conversion events → /api/event → Workers Analytics
 * Engine. sendBeacon survives navigation; nothing identifies the visitor.
 */
export function track(name: TrackEvent, label?: string) {
  try {
    const body = JSON.stringify({ name, label, path: location.pathname });
    if (!navigator.sendBeacon?.("/api/event", new Blob([body], { type: "application/json" }))) {
      void fetch("/api/event", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } });
    }
  } catch {
    // Analytics must never break the page.
  }
}

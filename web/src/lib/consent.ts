"use client";

/**
 * Cookie consent for optional analytics (Cloudflare Web Analytics and the
 * site's own anonymous event counts). Nothing optional runs until the visitor
 * chooses "Accept"; "Reject" is just as easy, and the choice can be changed
 * any time from "Cookie settings" in the footer.
 *
 * The choice itself is stored in one strictly necessary first-party cookie
 * (`skaylon_consent`, 180 days). Bump CONSENT_VERSION if what "analytics"
 * covers changes, so everyone is asked again.
 */
export type ConsentChoice = "granted" | "denied";

export const CONSENT_COOKIE = "skaylon_consent";
export const CONSENT_VERSION = "1";
const MAX_AGE = 60 * 60 * 24 * 180;
export const CONSENT_EVENT = "skaylon:consent";
export const OPEN_SETTINGS_EVENT = "skaylon:cookie-settings";

export function readConsent(): ConsentChoice | null {
  try {
    const match = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]*)`));
    if (!match) return null;
    const [version, choice] = decodeURIComponent(match[1] ?? "").split(":");
    if (version !== CONSENT_VERSION) return null;
    return choice === "granted" || choice === "denied" ? choice : null;
  } catch {
    return null;
  }
}

export function saveConsent(choice: ConsentChoice) {
  try {
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(`${CONSENT_VERSION}:${choice}`)}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${secure}`;
  } catch {
    // Cookies blocked: the banner simply shows again next visit.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: choice }));
}

export const analyticsAllowed = () => readConsent() === "granted";

/** Re-open the consent banner (footer "Cookie settings"). */
export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}

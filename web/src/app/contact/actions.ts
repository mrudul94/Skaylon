"use server";

import { headers } from "next/headers";
import { buildEnquiryEmail } from "@/lib/contact-email";
import { botSignals, contactSchema, fieldErrors, type ContactState } from "@/lib/contact-schema";
import { serverEnv } from "@/lib/env";
import { allowSubmission } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/resend";
import { verifyTurnstile } from "@/lib/turnstile";

const FALLBACK = "Please email skaylon.in@gmail.com directly and we'll reply personally.";
const FIELDS = ["name", "email", "company", "phone", "service", "budget", "message"] as const;

async function sha256(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Contact form Server Action. Order matters: cheap checks first, the paid /
 * networked ones last. Nothing is stored; the enquiry only goes to the inbox.
 */
export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const raw = Object.fromEntries(
    [...formData.entries()].filter((e): e is [string, string] => typeof e[1] === "string"),
  );
  const values = Object.fromEntries(FIELDS.map((f) => [f, raw[f] ?? ""]));
  const cfg = serverEnv();
  const dryRun = cfg.CONTACT_DRY_RUN === "1";

  if (!cfg.TURNSTILE_SECRET_KEY || (!dryRun && (!cfg.RESEND_API_KEY || !cfg.CONTACT_TO_EMAIL || !cfg.CONTACT_FROM_EMAIL))) {
    console.error("[contact] form submitted but email/Turnstile secrets are not configured");
    return { status: "error", message: `The form is temporarily unavailable. ${FALLBACK}`, values };
  }

  // 1. Bot heuristics (free). A filled honeypot gets a fake success so the
  //    bot learns nothing; timing problems get a retryable error, since a
  //    real person with autofill could trip them.
  const bot = botSignals(raw.website, raw.startedAt, Date.now());
  if (bot === "honeypot") return { status: "success" };
  if (bot) {
    return { status: "error", message: "Something went wrong sending the form. Please try again in a moment.", values };
  }

  // 2. Rate limit per IP.
  const h = await headers();
  const ip = h.get("cf-connecting-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!(await allowSubmission(ip))) {
    return { status: "error", message: `Too many messages from your connection. Wait a minute, or ${FALLBACK.toLowerCase()}`, values };
  }

  // 3. Validation (authoritative; the browser only pre-checks).
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return { status: "error", message: "Please check the highlighted fields.", fieldErrors: fieldErrors(parsed.error), values };
  }

  // 4. Turnstile (network).
  if (!(await verifyTurnstile(raw["cf-turnstile-response"], cfg.TURNSTILE_SECRET_KEY, ip))) {
    return { status: "error", message: "We couldn't confirm you're human. Please try the check again.", values };
  }

  // 5. Deliver.
  const email = buildEnquiryEmail(parsed.data, { receivedAt: new Date().toISOString() });
  if (dryRun) {
    console.info("[contact] DRY RUN, not sent:", email.subject);
    return { status: "success" };
  }
  const sent = await sendEmail({
    apiKey: cfg.RESEND_API_KEY!,
    from: cfg.CONTACT_FROM_EMAIL!,
    to: cfg.CONTACT_TO_EMAIL!,
    replyTo: email.replyTo,
    subject: email.subject,
    text: email.text,
    html: email.html,
    idempotencyKey: await sha256(`${parsed.data.email}|${parsed.data.message}|${raw.startedAt}`),
  }).catch(() => ({ ok: false as const, status: 0 }));

  if (!sent.ok) {
    console.error(`[contact] Resend failed with status ${sent.status}`);
    return { status: "error", message: `Your message couldn't be sent just now. ${FALLBACK}`, values };
  }
  return { status: "success" };
}

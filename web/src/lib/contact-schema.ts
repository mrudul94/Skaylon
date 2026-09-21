import { z } from "zod";
import { BUDGETS, MAX_FILL_MS, MIN_FILL_MS } from "./contact-options.ts";

/**
 * The contact form contract, enforced by the server action (the browser
 * pre-checks with native constraints, mirroring these limits). Tested by
 * scripts/verify-contact.mts.
 */
export { BUDGETS, MAX_FILL_MS, MIN_FILL_MS };

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Keep this under ${max} characters.`)
    .optional()
    .transform((v) => (v ? v : undefined));

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80, "Keep your name under 80 characters."),
  email: z.string().trim().max(254, "That email is too long.").pipe(z.email("Please enter a valid email address.")),
  company: optionalText(120),
  phone: z
    .string()
    .trim()
    .max(24)
    .regex(/^[+()\d\s-]*$/, "Use digits, spaces, +, - or brackets.")
    .optional()
    .transform((v) => (v ? v : undefined)),
  service: optionalText(60),
  budget: z.enum(BUDGETS).optional().or(z.literal("").transform(() => undefined)),
  message: z
    .string()
    .trim()
    .min(20, "Tell us a little more: at least 20 characters.")
    .max(4000, "Keep your message under 4000 characters."),
  consent: z.literal("on", { error: "Please confirm we may use these details to reply." }),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof z.input<typeof contactSchema>;

export type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string; fieldErrors?: Partial<Record<ContactField, string>>; values?: Record<string, string> };

/** Bot heuristics that need no third party: honeypot + fill time. */
export function botSignals(honeypot: string | undefined, startedAt: string | undefined, now: number): string | null {
  if (honeypot && honeypot.trim() !== "") return "honeypot";
  const started = Number(startedAt);
  if (!Number.isFinite(started) || started <= 0) return "no-timestamp";
  const elapsed = now - started;
  if (elapsed < MIN_FILL_MS) return "too-fast";
  if (elapsed > MAX_FILL_MS) return "stale";
  return null;
}

export function fieldErrors(error: z.ZodError): Partial<Record<ContactField, string>> {
  const out: Partial<Record<ContactField, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as ContactField | undefined;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

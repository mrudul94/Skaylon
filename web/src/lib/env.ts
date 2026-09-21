import { z } from "zod";

/**
 * Environment contract, validated once at import. A bad or missing value fails
 * the build / first request loudly instead of surfacing as a broken page.
 *
 * Variables for later checkpoints are optional until those checkpoints make
 * them required: Sanity (CP2), Turnstile + Resend (CP5).
 */

const publicSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().transform((u) => u.replace(/\/$/, "")),
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min(1).optional(),
  NEXT_PUBLIC_SANITY_DATASET: z.string().min(1).default("production"),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_CF_BEACON_TOKEN: z.string().min(1).optional(),
});

const serverSchema = z.object({
  SANITY_API_READ_TOKEN: z.string().min(1).optional(),
  SANITY_REVALIDATE_SECRET: z.string().min(16).optional(),
  TURNSTILE_SECRET_KEY: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  CONTACT_TO_EMAIL: z.email().optional(),
  CONTACT_FROM_EMAIL: z.string().min(1).optional(),
  /** "1" = log enquiries instead of emailing (local e2e only; never set in production). */
  CONTACT_DRY_RUN: z.enum(["1"]).optional(),
});

function format(error: z.ZodError): string {
  return error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n");
}

// NEXT_PUBLIC_* must be referenced literally so Next can inline them client-side.
const publicResult = publicSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  NEXT_PUBLIC_CF_BEACON_TOKEN: process.env.NEXT_PUBLIC_CF_BEACON_TOKEN,
});

if (!publicResult.success) {
  throw new Error(`Invalid public environment:\n${format(publicResult.error)}`);
}

export const env = publicResult.data;

/** Server-only secrets. Throws if called from the browser. */
export function serverEnv() {
  if (typeof window !== "undefined") {
    throw new Error("serverEnv() called on the client");
  }
  const result = serverSchema.safeParse(process.env);
  if (!result.success) {
    throw new Error(`Invalid server environment:\n${format(result.error)}`);
  }
  return result.data;
}

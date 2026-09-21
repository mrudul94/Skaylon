import "server-only";
import { createClient, type QueryParams, type SanityClient } from "@sanity/client";
import { env, serverEnv } from "@/lib/env";

/** Every Sanity-backed page carries this tag; the webhook revalidates it. */
export const SANITY_TAG = "sanity";

export const sanityConfigured = Boolean(env.NEXT_PUBLIC_SANITY_PROJECT_ID);

let client: SanityClient | null = null;
function getClient(): SanityClient {
  client ??= createClient({
    projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: "2025-01-01",
    // Straight from the API, not the CDN: right after a publish the webhook
    // revalidates, and the regenerated page must not read a stale CDN copy.
    useCdn: false,
    perspective: "published",
    token: serverEnv().SANITY_API_READ_TOKEN,
  });
  return client;
}

/**
 * Tagged, ISR-cached query. Pages regenerate when the Sanity webhook calls
 * revalidateTag(SANITY_TAG), with an hourly time-based fallback in case a
 * webhook is ever missed.
 */
export async function sanityFetch<T>(query: string, params: QueryParams = {}): Promise<T> {
  return getClient().fetch<T>(query, params, {
    next: { tags: [SANITY_TAG], revalidate: 3600 },
  });
}

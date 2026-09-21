import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";
import memoryQueue from "@opennextjs/cloudflare/overrides/queue/memory-queue";
import d1NextTagCache from "@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache";

/**
 * ISR on Workers:
 * - KV incremental cache (NEXT_INC_CACHE_KV): rendered pages, pre-populated
 *   with the build output on every deploy.
 * - D1 tag cache (NEXT_TAG_CACHE_D1): revalidateTag("sanity") from the Sanity
 *   webhook takes effect immediately (the KV tag cache is eventually
 *   consistent, up to 60 s, and marked experimental).
 * - Memory queue for the hourly time-based fallback: fine at this traffic.
 */
export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
  tagCache: d1NextTagCache,
  queue: memoryQueue,
  enableCacheInterception: true,
});

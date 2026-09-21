/**
 * next/image loader. Workers has no built-in image optimizer, so Sanity's
 * image CDN does the resizing and format negotiation (AVIF/WebP). Local
 * images are pre-optimized at build time and served as-is.
 */
export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (src.startsWith("https://cdn.sanity.io/")) {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(quality ?? 75));
    url.searchParams.set("auto", "format");
    url.searchParams.set("fit", "max");
    return url.toString();
  }
  return src;
}

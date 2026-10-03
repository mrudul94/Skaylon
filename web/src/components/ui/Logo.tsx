/**
 * The Skaylon logo (swoosh mark + wordmark), from brand/skaylon-logo.png via
 * scripts/render-brand-assets.mjs. Rendered as an <img> with alt "Skaylon",
 * so the name is still read by screen readers and search engines. The dark
 * theme uses logo-dark.webp (same render script, light wordmark).
 */
export function Logo({ className, priority = false }: { className?: string; priority?: boolean }) {
  // Two images, one per theme; CSS hides the other (display:none also keeps it
  // out of the accessibility tree, and the lazy one isn't fetched until shown).
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.webp"
        srcSet="/logo.webp 1x, /logo@2x.webp 2x"
        alt="Skaylon"
        width={149}
        height={33}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
        className={`theme-light-only h-[33px] w-auto ${className ?? ""}`}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-dark.webp"
        srcSet="/logo-dark.webp 1x, /logo-dark@2x.webp 2x"
        alt="Skaylon"
        width={149}
        height={33}
        decoding="async"
        loading="lazy"
        className={`theme-dark-only h-[33px] w-auto ${className ?? ""}`}
      />
    </>
  );
}

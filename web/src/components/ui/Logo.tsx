/**
 * The Skaylon logo (swoosh mark + wordmark), from brand/skaylon-logo.png via
 * scripts/render-brand-assets.mjs. Rendered as an <img> with alt "Skaylon",
 * so the name is still read by screen readers and search engines.
 */
export function Logo({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.webp"
      srcSet="/logo.webp 1x, /logo@2x.webp 2x"
      alt="Skaylon"
      width={149}
      height={33}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
      className={`h-[33px] w-auto ${className ?? ""}`}
    />
  );
}

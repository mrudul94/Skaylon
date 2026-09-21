/** Wordmark with the monolith glyph: a tall block split by one angled seam. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className ?? ""}`}>
      <svg aria-hidden="true" viewBox="0 0 20 28" width="14" height="20">
        <path d="M2 1h16v11.5L2 16.5z" fill="currentColor" />
        <path d="M2 18.6l16-4v12.4H2z" fill="var(--color-ember)" />
      </svg>
      <span className="text-[0.95rem] font-medium tracking-[0.32em] uppercase">Skaylon</span>
    </span>
  );
}

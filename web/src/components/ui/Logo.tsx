/** Wordmark with the orbit glyph: the 3D world's core and its ring, flattened. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={`group/logo inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" className="overflow-visible">
        <circle cx="12" cy="12" r="5.2" fill="var(--color-accent)" />
        <circle cx="12" cy="12" r="5.2" fill="var(--color-cyan)" opacity="0.55" transform="translate(1.4 -1.4) scale(0.9)" style={{ transformOrigin: "12px 12px" }} />
        <ellipse
          cx="12"
          cy="12"
          rx="11"
          ry="4.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          transform="rotate(-28 12 12)"
          className="origin-center transition-transform duration-700 ease-cinematic group-hover/logo:rotate-180"
        />
      </svg>
      <span className="text-[1.05rem] font-semibold tracking-[-0.02em]">Skaylon</span>
    </span>
  );
}

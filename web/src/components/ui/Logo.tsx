/** Wordmark with the brand glyph (the same mark as app/icon.svg). Decorative: the parent link carries the name. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <svg aria-hidden="true" viewBox="0 0 32 32" width="28" height="28">
        <rect width="32" height="32" rx="6" fill="#14161a" />
        <path d="M10 4h12v11.5L10 18.5z" fill="#ece8e1" />
        <path d="M10 20.6l12-3V28H10z" fill="#d9764a" />
      </svg>
      <span className="text-[1.1rem] font-semibold tracking-[-0.02em]">Skaylon</span>
    </span>
  );
}

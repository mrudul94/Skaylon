/** Small line icon per service (decorative). Unknown slugs get a neutral mark. */
const paths: Record<string, string> = {
  "website-development": "M3 5h18v14H3zM3 9h18M7 7h.01M10 7h.01",
  "web-application-development": "M3 4h18v16H3zM3 8h18M8 8v12M11 12h6M11 16h4",
  "mobile-app-development": "M7 2h10v20H7zM11 18h2",
  "custom-software-development": "M4 6l8-4 8 4-8 4zM4 12l8 4 8-4M4 18l8 4 8-4",
  "ui-ux-design": "M4 20l4-1 11-11-3-3L5 16zM14 6l3 3",
  "backend-api-development": "M4 5h16v5H4zM4 14h16v5H4zM8 7.5h.01M8 16.5h.01M12 10v4",
};

export function ServiceIcon({ slug, size = "md" }: { slug: string; size?: "md" | "lg" }) {
  return (
    <span
      aria-hidden="true"
      className={`service-icon flex shrink-0 items-center justify-center rounded-lg bg-accent-wash text-accent-ink ${size === "lg" ? "h-14 w-14" : "h-11 w-11"}`}
    >
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={paths[slug] ?? "M4 4h16v16H4z"} />
      </svg>
    </span>
  );
}

import type { SiteSettings } from "@/content/types";

/** Simple line icons for common networks, chosen from the label or URL. */
const ICONS: [RegExp, string][] = [
  [/linkedin/i, "M4 9h3v11H4zM5.5 4a1.75 1.75 0 110 3.5 1.75 1.75 0 010-3.5zM10 9h3v1.6c.5-.9 1.7-1.8 3.4-1.8 3 0 3.6 2 3.6 4.6V20h-3v-5.8c0-1.4 0-3-1.9-3s-2.1 1.4-2.1 2.9V20h-3z"],
  [/github/i, "M12 3a9 9 0 00-2.8 17.5c.5.1.6-.2.6-.4v-1.6c-2.5.5-3-1.1-3-1.1-.4-1-1-1.3-1-1.3-.8-.6.1-.6.1-.6.9.1 1.4 1 1.4 1 .8 1.4 2.1 1 2.6.8.1-.6.3-1 .6-1.2-2-.2-4.1-1-4.1-4.5 0-1 .4-1.8 1-2.4-.1-.3-.4-1.2.1-2.5 0 0 .8-.2 2.5.9a8.6 8.6 0 014.5 0c1.7-1.1 2.5-.9 2.5-.9.5 1.3.2 2.2.1 2.5.6.6 1 1.4 1 2.4 0 3.5-2.1 4.3-4.1 4.5.3.3.6.8.6 1.6v2.4c0 .2.1.5.6.4A9 9 0 0012 3z"],
  [/instagram/i, "M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zm5 5a4 4 0 100 8 4 4 0 000-8zm5.5-1.5h.01"],
  [/(^x$|twitter|x\.com)/i, "M4 4l16 16M20 4L4 20"],
  [/youtube/i, "M3 8a3 3 0 013-3h12a3 3 0 013 3v8a3 3 0 01-3 3H6a3 3 0 01-3-3zm7 1v6l5-3z"],
  [/facebook/i, "M14 8h3V4h-3a4 4 0 00-4 4v2H8v4h2v7h4v-7h3l1-4h-4V8z"],
  [/behance/i, "M3 7h6a3 3 0 010 6H3zm0 6h6.5a3 3 0 010 6H3zM15 8h5M14 15h7a3.5 3.5 0 10-1 2.5"],
  [/dribbble/i, "M12 3a9 9 0 100 18 9 9 0 000-18zM5 8c4 1 9 0 13-3M3.5 13c5-2 10 0 13 7M9 3.5c3 4 5 10 5.5 17"],
];

function iconFor(label: string, url: string) {
  return ICONS.find(([re]) => re.test(label) || re.test(url))?.[1];
}

export function SocialLinks({ socials, className }: { socials: SiteSettings["socials"]; className?: string }) {
  if (socials.length === 0) return null;
  return (
    <ul className={`flex flex-wrap gap-2 ${className ?? ""}`}>
      {socials.map((s) => {
        const d = iconFor(s.label, s.url);
        return (
          <li key={s.url}>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer me"
              className="flex h-10 min-w-10 items-center justify-center gap-2 rounded-lg border border-line-strong bg-surface px-2.5 text-sm text-ink-2 transition-colors hover:border-ink hover:text-ink"
            >
              {d ? (
                <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d={d} />
                </svg>
              ) : (
                <span>{s.label}</span>
              )}
              <span className="sr-only">
                {d ? s.label : ""} (opens in a new tab)
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

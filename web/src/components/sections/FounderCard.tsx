import type { SiteSettings } from "@/content/types";

/**
 * The founder, as a real person: photo (from the CMS) or a monogram until one
 * is added, name, role and an optional factual bio. `tone` matches the
 * surface it sits on.
 */
export function FounderCard({ site, tone = "light", className }: { site: SiteSettings; tone?: "light" | "dark"; className?: string }) {
  if (!site.founder) return null;
  const dark = tone === "dark";
  const photo = site.founderPhoto;
  return (
    <div className={`flex items-center gap-4 ${className ?? ""}`}>
      {photo ? (
        // A plain <img>: the photo is tiny and already sized (local files are
        // pre-optimised; a CMS photo is cropped by Sanity's CDN below). This
        // also avoids next/image's custom loader, which Turbopack dev ignores.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photo.url.startsWith("https://cdn.sanity.io/") ? `${photo.url}?w=144&h=144&fit=crop&auto=format` : photo.url}
          alt={photo.alt}
          width={72}
          height={72}
          loading="lazy"
          decoding="async"
          className="h-[4.5rem] w-[4.5rem] shrink-0 rounded-full object-cover ring-2 ring-accent/70 ring-offset-2 ring-offset-transparent"
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-full bg-accent text-2xl font-semibold text-ink"
        >
          {site.founder.charAt(0)}
        </span>
      )}
      <div className="min-w-0">
        <p className={`font-semibold ${dark ? "text-paper" : "text-ink"}`}>{site.founder}</p>
        <p className={`text-sm ${dark ? "text-paper/75" : "text-ink-muted"}`}>Founder, {site.legalName}. Leads every project.</p>
        {site.founderBio && <p className={`mt-2 text-sm leading-relaxed ${dark ? "text-paper/75" : "text-ink-muted"}`}>{site.founderBio}</p>}
      </div>
    </div>
  );
}

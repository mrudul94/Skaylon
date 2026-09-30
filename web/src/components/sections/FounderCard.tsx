import Image from "next/image";
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
        <Image
          src={photo.url}
          alt={photo.alt}
          width={112}
          height={112}
          sizes="56px"
          className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-accent/60 ring-offset-2 ring-offset-transparent"
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent text-xl font-semibold text-ink"
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

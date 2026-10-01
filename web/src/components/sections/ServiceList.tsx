import Link from "next/link";
import type { Service } from "@/content/types";
import { Arrow } from "@/components/ui/primitives";
import { Reveal } from "@/scroll/Reveal";
import { ServiceIcon } from "./ServiceIcon";

/** Short scan-tags per service. Every term appears in that service's own copy. */
const TAGS: Record<string, string[]> = {
  "website-development": ["CMS", "Technical SEO", "Accessibility"],
  "web-application-development": ["React", "Next.js", "Node.js"],
  "mobile-app-development": ["Flutter", "iOS", "Android"],
  "custom-software-development": ["Automation", "Reporting", "MVPs"],
  "ui-ux-design": ["Figma", "Prototypes", "Design systems"],
  "backend-api-development": ["Node.js", "TypeScript", "REST APIs"],
};

/** Service cards; the whole card is one link (stretched from the heading). */
export function ServiceList({
  services,
  headingLevel = "h3",
}: {
  services: Service[];
  headingLevel?: "h2" | "h3";
}) {
  const H = headingLevel;
  return (
    <Reveal
      as="ul"
      stagger
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {services.map((service, i) => {
        const tags = TAGS[service.slug] ?? [];
        return (
          <li
            key={service.slug}
            className="spot service-card card-link card-lift group relative flex flex-col overflow-hidden rounded-xl border hairline bg-surface p-6"
          >
            {/* Accent rule that grows along the top edge on hover. */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-within:scale-x-100"
            />
            <div className="flex items-start justify-between">
              <ServiceIcon slug={service.slug} />
              <span
                aria-hidden="true"
                className="font-mono text-sm text-ink-muted"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <H className="mt-5 text-title font-semibold">
              <Link
                href={`/services/${service.slug}`}
                className="after:absolute after:inset-0 after:rounded-xl"
              >
                {service.name}
              </Link>
            </H>
            <p className="mt-3 flex-1 leading-relaxed text-ink-muted">
              {service.summary}
            </p>
            {tags.length > 0 && (
              <ul
                aria-label={`${service.name} highlights`}
                className="mt-5 flex flex-wrap gap-1.5"
              >
                {tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-md bg-paper-2 px-2 py-1 text-xs font-medium text-ink-2"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            )}
            <span
              aria-hidden="true"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent-ink"
            >
              Learn more <Arrow className="card-arrow" />
            </span>
          </li>
        );
      })}
    </Reveal>
  );
}

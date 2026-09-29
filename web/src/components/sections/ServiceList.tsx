import type { Service } from "@/content/types";
import { ServiceRowLink } from "./ServiceRowLink";
import { ArrowUpRight } from "@/components/ui/primitives";
import { Reveal } from "@/scroll/Reveal";

/**
 * Numbered, full-width rows. Hover: a tinted panel wipes in from the left,
 * the name slides, the arrow disc fills and turns, and the matching
 * satellite lights up in the 3D world.
 */
export function ServiceList({ services, headingLevel = "h3" }: { services: Service[]; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <Reveal as="ul" stagger className="border-t border-chalk/[0.09]">
      {services.map((service, i) => (
        <li key={service.slug} className="border-b border-chalk/[0.09]" data-wedge={service.wedgeIndex}>
          <ServiceRowLink
            wedge={service.wedgeIndex}
            href={`/services/${service.slug}`}
            data-cursor=""
            className="group relative isolate grid gap-3 overflow-hidden px-1 py-8 sm:grid-cols-[4.5rem_1.1fr_1.2fr_auto] sm:items-center sm:gap-8 sm:px-4 sm:py-10"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 -z-10 origin-left scale-x-0 bg-gradient-to-r from-accent/[0.14] via-accent/[0.06] to-cyan/[0.02] transition-transform duration-700 ease-cinematic group-hover:scale-x-100 group-focus-visible:scale-x-100"
            />
            <span className="font-mono text-xs text-chalk-muted tabular-nums transition-colors duration-500 group-hover:text-cyan">
              {String(i + 1).padStart(2, "0")}
            </span>
            <H className="text-title font-medium transition-transform duration-700 ease-cinematic group-hover:translate-x-3">
              {service.name}
            </H>
            <p className="text-chalk-muted transition-colors duration-500 group-hover:text-chalk">{service.summary}</p>
            <span
              aria-hidden="true"
              className="hidden h-12 w-12 items-center justify-center rounded-full border border-chalk/15 transition-all duration-700 ease-cinematic group-hover:rotate-45 group-hover:border-transparent group-hover:bg-chalk group-hover:text-ink-950 sm:flex"
            >
              <ArrowUpRight />
            </span>
          </ServiceRowLink>
        </li>
      ))}
    </Reveal>
  );
}

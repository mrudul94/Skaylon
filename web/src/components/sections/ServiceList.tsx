import type { Service } from "@/content/types";
import { ServiceRowLink } from "./ServiceRowLink";
import { Arrow } from "@/components/ui/primitives";
import { Reveal } from "@/scroll/Reveal";

/** Numbered, full-width rows. Hovering or focusing a row lights its icon in the 3D world. */
export function ServiceList({ services, headingLevel = "h3" }: { services: Service[]; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <Reveal as="ul" stagger className="hairline border-t">
      {services.map((service, i) => (
        <li key={service.slug} className="hairline border-b" data-wedge={service.wedgeIndex}>
          <ServiceRowLink
            wedge={service.wedgeIndex}
            href={`/services/${service.slug}`}
            className="group grid gap-3 py-8 transition-colors duration-500 ease-cinematic hover:text-ember sm:grid-cols-[4rem_1fr_1.2fr_auto] sm:items-baseline sm:gap-8 sm:py-10"
          >
            <span className="text-sm text-bone-muted tabular-nums">{String(i + 1).padStart(2, "0")}</span>
            <H className="text-title font-light">{service.name}</H>
            <p className="text-bone-muted transition-colors duration-500 group-hover:text-bone">{service.summary}</p>
            <Arrow className="hidden transition-transform duration-500 ease-cinematic group-hover:translate-x-1 sm:block" />
          </ServiceRowLink>
        </li>
      ))}
    </Reveal>
  );
}

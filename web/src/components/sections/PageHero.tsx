import type { ReactNode } from "react";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

/** Top of every inner page. The h1 is the LCP element: never animated. */
export function PageHero({
  eyebrow,
  heading,
  sub,
  crumbs,
  children,
}: {
  eyebrow: string;
  heading: string;
  sub?: string;
  crumbs?: Crumb[];
  children?: ReactNode;
}) {
  return (
    <header className="pt-36 pb-16 sm:pt-44 sm:pb-24">
      <Container>
        {crumbs && <Breadcrumbs items={crumbs} />}
        <Eyebrow className={crumbs ? "mt-10" : undefined}>{eyebrow}</Eyebrow>
        {/* Long headlines step down a size so they hold to ~2 lines. */}
        <h1
          className={`mt-6 max-w-5xl font-light text-balance ${heading.length > 32 ? "text-display" : "text-display-xl"}`}
        >
          {heading}
        </h1>
        {sub && <p className="mt-8 max-w-2xl text-lead text-bone-muted">{sub}</p>}
        {children}
      </Container>
    </header>
  );
}

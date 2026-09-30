import type { ReactNode } from "react";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

/** Top of every inner page: breadcrumbs, the page's only h1, and a summary. */
export function PageHero({
  eyebrow,
  heading,
  sub,
  crumbs,
  children,
  visual,
}: {
  eyebrow: string;
  heading: string;
  sub?: string;
  crumbs?: Crumb[];
  children?: ReactNode;
  /** Decorative illustration shown beside the text on wide screens. */
  visual?: ReactNode;
}) {
  // Long headlines step down a size so they hold to about three lines.
  const size = heading.length > 32 ? "text-display" : "text-display-xl";
  return (
    <header className="relative overflow-hidden pt-28 pb-12 sm:pt-36 sm:pb-16">
      <div className="backdrop" aria-hidden="true" />
      <Container className={visual ? "grid items-center gap-10 lg:grid-cols-[1.15fr_1fr]" : undefined}>
        <div>
          {crumbs && <Breadcrumbs items={crumbs} />}
          <Eyebrow className={crumbs ? "mt-8" : undefined}>{eyebrow}</Eyebrow>
          <h1 className={`mt-4 max-w-4xl ${size} font-semibold text-balance`}>{heading}</h1>
          {sub && (
            <p className="hero-in mt-5 max-w-2xl text-lead text-ink-muted" style={{ "--d": "80ms" } as React.CSSProperties}>
              {sub}
            </p>
          )}
          {children && (
            <div className="hero-in" style={{ "--d": "160ms" } as React.CSSProperties}>
              {children}
            </div>
          )}
        </div>
        {visual && <div className="hero-in hidden lg:block" style={{ "--d": "200ms" } as React.CSSProperties}>{visual}</div>}
      </Container>
    </header>
  );
}

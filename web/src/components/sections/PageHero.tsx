import type { ReactNode } from "react";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { RiseText } from "@/components/motion/RiseText";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

/**
 * Top of every inner page. The h1 is the LCP element: its words rise in with
 * a CSS-only animation that starts on first paint (never waits for JS).
 */
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
    <header className="pt-36 pb-16 sm:pt-48 sm:pb-24">
      <Container>
        {crumbs && (
          <div className="fade-in" style={{ "--delay": "0ms" } as React.CSSProperties}>
            <Breadcrumbs items={crumbs} />
          </div>
        )}
        <div className="fade-in" style={{ "--delay": "100ms" } as React.CSSProperties}>
          <Eyebrow className={crumbs ? "mt-10" : undefined}>{eyebrow}</Eyebrow>
        </div>
        {/* Long headlines step down a size so they hold to ~2 lines. */}
        <h1
          className={`mt-7 max-w-5xl font-medium text-balance ${heading.length > 32 ? "text-display" : "text-display-xl"}`}
        >
          <RiseText text={heading} accentWords={1} />
        </h1>
        {sub && (
          <p className="fade-in mt-9 max-w-2xl text-lead text-chalk-muted" style={{ "--delay": "450ms" } as React.CSSProperties}>
            {sub}
          </p>
        )}
        {children}
      </Container>
    </header>
  );
}

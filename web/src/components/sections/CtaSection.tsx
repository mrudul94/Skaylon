import { AccentLast, ButtonLink, Container, Eyebrow } from "@/components/ui/primitives";
import { Reveal } from "@/scroll/Reveal";

export function CtaSection({
  eyebrow = "Start a project",
  title,
  label,
  href = "/contact",
  chapter,
  body,
}: {
  eyebrow?: string;
  title: string;
  label: string;
  href?: string;
  /** Marks the section as a 3D chapter anchor (home page). */
  chapter?: string;
  body?: string;
}) {
  return (
    <section aria-labelledby="cta-heading" data-chapter={chapter} className="relative py-28 sm:py-44">
      <Container>
        <Reveal className="relative overflow-hidden rounded-[2rem] border border-chalk/[0.08] bg-gradient-to-br from-ink-800/80 via-ink-900/70 to-ink-950/60 px-6 py-16 backdrop-blur-md sm:px-16 sm:py-24">
          <div aria-hidden="true" className="pointer-events-none absolute -top-32 -right-24 h-96 w-96 rounded-full bg-accent/25 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 left-1/4 h-80 w-80 rounded-full bg-cyan/10 blur-3xl" />
          <div className="relative">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 id="cta-heading" className="mt-8 max-w-5xl text-display font-medium text-balance">
              <AccentLast text={title} />
            </h2>
            {body && <p className="mt-8 max-w-2xl text-lead text-chalk-muted">{body}</p>}
            <div className="mt-12 flex flex-wrap items-center gap-4">
              <ButtonLink href={href} className="min-h-14 px-8 text-base" data-track="cta_click" data-track-label={label}>
                {label}
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

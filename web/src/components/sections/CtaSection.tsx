import { ButtonLink, Container } from "@/components/ui/primitives";

/** Closing call to action. One per page (fixed heading id). */
export function CtaSection({
  title,
  label,
  href = "/contact",
  body = "Tell us about your project in a few lines. We reply within one to two working days with next steps, usually a short call.",
  secondary,
}: {
  title: string;
  label: string;
  href?: string;
  body?: string;
  secondary?: { label: string; href: string };
}) {
  return (
    <section aria-labelledby="cta-heading" className="py-16 sm:py-24">
      <Container>
        <div className="cta-band relative overflow-hidden rounded-2xl bg-ink px-6 py-12 text-paper sm:px-12 sm:py-20">
          <div
            aria-hidden="true"
            className="cta-glow pointer-events-none absolute -top-32 -right-24 h-96 w-96 rounded-full bg-accent/35 blur-3xl"
          />
          <div className="relative max-w-2xl">
            <h2 id="cta-heading" className="text-display font-semibold text-balance">
              {title}
            </h2>
            <p className="mt-4 text-lead text-paper/80">{body}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={href} variant="secondary" className="border-paper bg-paper" data-track="cta_click" data-track-label={label}>
                {label}
              </ButtonLink>
              {secondary && (
                <ButtonLink
                  href={secondary.href}
                  arrow={false}
                  className="border-paper/40 bg-transparent hover:border-paper hover:bg-transparent"
                >
                  {secondary.label}
                </ButtonLink>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

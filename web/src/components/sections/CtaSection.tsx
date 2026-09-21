import { ButtonLink, Container, Eyebrow } from "@/components/ui/primitives";
import { Reveal } from "@/scroll/Reveal";

export function CtaSection({
  eyebrow = "Start a project",
  title,
  label,
  href = "/contact",
  chapter,
}: {
  eyebrow?: string;
  title: string;
  label: string;
  href?: string;
  /** Marks the section as a 3D chapter anchor (home page). */
  chapter?: string;
}) {
  return (
    <section aria-labelledby="cta-heading" data-chapter={chapter} className="py-28 sm:py-40">
      <Container>
        <Reveal className="hairline border-t pt-16 sm:pt-24">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 id="cta-heading" className="mt-6 max-w-4xl text-display font-light text-balance">
            {title}
          </h2>
          <div className="mt-10">
            <ButtonLink href={href} data-track="cta_click" data-track-label={label}>
              {label}
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

import type { PricingPackage } from "@/content/types";
import { ButtonLink } from "@/components/ui/primitives";
import { formatInr } from "@/lib/format";
import { Reveal } from "@/scroll/Reveal";

/**
 * Package cards. Fixed-price packages lead with "Starting from ₹…" and a solid
 * button; feature-priced ones show their label and an outline button.
 */
export function PricingCards({ packages }: { packages: PricingPackage[] }) {
  return (
    <Reveal as="ul" stagger className="grid gap-6 md:grid-cols-2">
      {packages.map((p) => {
        const fixed = p.priceFrom != null;
        const href = p.serviceSlug ? `/contact?service=${p.serviceSlug}` : "/contact";
        return (
          <li key={p.name} className="spot card-lift flex flex-col rounded-2xl border hairline bg-surface p-6 sm:p-8">
            <h3 className="text-title font-semibold">{p.name}</h3>
            <p className="mt-2 text-ink-muted">{p.description}</p>

            <div className="mt-6 border-t hairline pt-6">
              {fixed ? (
                <p>
                  <span className="block text-sm text-ink-muted">Starting from</span>
                  <span className="mt-1 block text-[clamp(2.2rem,1.8rem+1.4vw,2.9rem)] leading-none font-semibold tracking-tight tabular-nums">
                    {formatInr(p.priceFrom!)}
                  </span>
                </p>
              ) : (
                <p>
                  <span className="block text-sm text-ink-muted">Price</span>
                  <span className="font-serif-accent mt-1 block text-[clamp(1.9rem,1.6rem+1vw,2.4rem)] leading-none text-accent-ink">
                    {p.priceLabel ?? "Priced on features"}
                  </span>
                </p>
              )}
            </div>

            <ul aria-label={`Included in ${p.name}`} className="mt-6 space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex gap-3">
                  <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" className="mt-1 shrink-0 text-accent-ink">
                    <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-ink-2">{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-8">
              <ButtonLink
                href={href}
                variant={fixed ? "primary" : "secondary"}
                className="w-full"
                data-track="cta_click"
                data-track-label={`pricing-${p.name}`}
              >
                {p.ctaLabel}
              </ButtonLink>
            </div>
          </li>
        );
      })}
    </Reveal>
  );
}

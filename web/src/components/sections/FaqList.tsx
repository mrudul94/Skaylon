import type { Faq } from "@/content/types";
import { Container, Eyebrow } from "@/components/ui/primitives";

/**
 * Visible FAQ (the only FAQs that get FAQPage schema). Native <details>:
 * keyboard and screen-reader accessible with zero JS. The first answer starts
 * open so the section leads with a real answer.
 */
export function FaqList({
  faqs,
  heading = "Frequently asked questions",
  intro,
}: {
  faqs: { question: string; answer: string }[] | Faq[];
  heading?: string;
  intro?: string;
}) {
  if (faqs.length === 0) return null;
  return (
    <section aria-labelledby="faq-heading" className="py-16 sm:py-20">
      <Container className="grid gap-10 lg:grid-cols-[1fr_2fr]">
        <div>
          <Eyebrow>FAQ</Eyebrow>
          <h2 id="faq-heading" className="mt-4 text-[clamp(1.6rem,1.3rem+1.2vw,2.3rem)] leading-[1.12] font-semibold tracking-[-0.025em] text-balance">
            {heading}
          </h2>
          {intro && <p className="mt-4 text-ink-muted">{intro}</p>}
        </div>
        <div className="divide-y divide-line border-y hairline">
          {faqs.map((faq, i) => (
            <details key={faq.question} className="group" open={i === 0}>
              <summary className="flex cursor-pointer items-start justify-between gap-6 py-5">
                <h3 className="text-[1.08rem] leading-snug font-medium">{faq.question}</h3>
                <span
                  aria-hidden="true"
                  className="faq-icon mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line-strong text-ink-muted transition-transform duration-200 group-hover:border-ink group-hover:text-ink"
                >
                  <svg viewBox="0 0 16 16" width="12" height="12">
                    <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </span>
              </summary>
              <p className="max-w-2xl pb-6 leading-relaxed text-ink-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}

import type { Faq } from "@/content/types";
import { Container } from "@/components/ui/primitives";

/** Native <details>: keyboard and screen-reader accessible with zero JS. */
export function FaqList({ faqs, heading = "Questions, answered" }: { faqs: Faq[]; heading?: string }) {
  if (faqs.length === 0) return null;
  return (
    <section aria-labelledby="faq-heading" className="py-20 sm:py-28">
      <Container className="grid gap-12 lg:grid-cols-[1fr_2fr]">
        <h2 id="faq-heading" className="text-title font-light">
          {heading}
        </h2>
        <div className="hairline border-t">
          {faqs.map((faq) => (
            <details key={faq.question} className="group hairline border-b">
              <summary className="flex cursor-pointer items-start justify-between gap-6 py-6 text-lg">
                <span>{faq.question}</span>
                <span
                  aria-hidden="true"
                  className="mt-1 text-ember transition-transform duration-500 ease-cinematic group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="max-w-2xl pb-6 text-bone-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}

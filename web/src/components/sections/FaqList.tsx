import type { Faq } from "@/content/types";
import { Container, Eyebrow } from "@/components/ui/primitives";

/** Native <details>: keyboard and screen-reader accessible with zero JS. */
export function FaqList({ faqs, heading = "Questions, answered" }: { faqs: Faq[]; heading?: string }) {
  if (faqs.length === 0) return null;
  return (
    <section aria-labelledby="faq-heading" className="py-20 sm:py-28">
      <Container className="grid gap-12 lg:grid-cols-[1fr_2fr]">
        <div>
          <Eyebrow>FAQ</Eyebrow>
          <h2 id="faq-heading" className="mt-6 text-title font-medium">
            {heading}
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-chalk/[0.08] bg-ink-900/50 backdrop-blur-sm transition-colors duration-500 hover:border-chalk/20 open:border-accent/30 open:bg-ink-800/60"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-6 px-6 py-5 text-lg">
                <span>{faq.question}</span>
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-chalk/15 text-chalk-muted transition-all duration-500 ease-cinematic group-hover:border-chalk/40 group-hover:text-chalk group-open:rotate-45 group-open:border-transparent group-open:bg-accent group-open:text-ink-950"
                >
                  <svg viewBox="0 0 16 16" width="14" height="14">
                    <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                </span>
              </summary>
              <p className="max-w-2xl px-6 pb-6 text-chalk-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}

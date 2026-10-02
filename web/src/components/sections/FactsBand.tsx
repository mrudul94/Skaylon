import type { ReactNode } from "react";
import { Container } from "@/components/ui/primitives";
import { CountUp } from "@/components/visuals/CountUp";
import { Reveal } from "@/scroll/Reveal";

type Fact = { value: ReactNode; label: string; detail: string };

/**
 * A dark band of facts about how Skaylon works. Every figure is taken from
 * the site's own content (service count, process phases, reply time, code
 * ownership): no invented statistics.
 */
export function FactsBand({ services, phases }: { services: number; phases: number }) {
  const facts: Fact[] = [
    { value: <CountUp value={services} />, label: "Services", detail: "From UI/UX design to backend APIs" },
    { value: <CountUp value={phases} />, label: "Clear phases", detail: "Discover, plan, build, launch" },
    {
      value: "1–2",
      label: "Working days to reply",
      detail: "Every enquiry gets a personal answer",
    },
    {
      value: (
        <>
          <CountUp value={100} />%
        </>
      ),
      label: "Code ownership",
      detail: "Source, designs and docs handed over",
    },
  ];
  return (
    <section aria-labelledby="facts-heading" className="dark-band relative overflow-hidden bg-ink py-14 text-paper sm:py-16">
      <div aria-hidden="true" className="aurora aurora-dark" />
      <Container className="relative">
        <h2 id="facts-heading" className="sr-only">
          Skaylon at a glance
        </h2>
        <Reveal as="ul" stagger className="grid gap-px overflow-hidden rounded-2xl bg-paper/10 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((f) => (
            <li key={f.label} className="spot bg-ink/95 p-6 sm:p-8">
              <p className="font-serif-accent text-[clamp(2.6rem,2rem+2vw,3.6rem)] leading-none text-accent-light">{f.value}</p>
              <p className="mt-4 font-semibold">{f.label}</p>
              <p className="mt-1 text-sm text-paper/65">{f.detail}</p>
            </li>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}

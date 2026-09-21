import type { ProcessPhase } from "@/content/types";
import { Reveal } from "@/scroll/Reveal";

export function ProcessSteps({ phases, detailed = false }: { phases: ProcessPhase[]; detailed?: boolean }) {
  return (
    <Reveal as="ol" stagger className="grid gap-px overflow-hidden rounded-sm bg-bone/10 md:grid-cols-2 xl:grid-cols-4">
      {phases.map((phase) => (
        <li key={phase.number} className="flex flex-col bg-graphite-950 p-8 sm:p-10">
          <span className="font-serif text-5xl text-ember">{phase.number}</span>
          <h3 className="mt-8 text-title font-light">{phase.title}</h3>
          <p className="mt-4 text-bone-muted">{phase.summary}</p>
          {detailed && (
            <dl className="mt-auto pt-8 text-sm">
              <dt className="text-eyebrow text-bone-muted uppercase">Typical duration</dt>
              <dd className="mt-2">{phase.duration}</dd>
              <dt className="mt-6 text-eyebrow text-bone-muted uppercase">Deliverables</dt>
              <dd className="mt-2">
                <ul className="space-y-1">
                  {phase.deliverables.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </dd>
            </dl>
          )}
        </li>
      ))}
    </Reveal>
  );
}

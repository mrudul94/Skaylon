import type { ProcessPhase } from "@/content/types";
import { Reveal } from "@/scroll/Reveal";

export function ProcessSteps({ phases, detailed = false }: { phases: ProcessPhase[]; detailed?: boolean }) {
  return (
    <Reveal as="ol" stagger className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {phases.map((phase) => (
        <li key={phase.number} className="flex flex-col rounded-xl border hairline bg-surface p-6">
          <span aria-hidden="true" className="font-mono text-sm text-accent-ink">
            {phase.number}
          </span>
          <h3 className="mt-3 text-title font-semibold">{phase.title}</h3>
          <p className="mt-3 leading-relaxed text-ink-muted">{phase.summary}</p>
          <dl className="mt-auto pt-6 text-sm">
            <dt className="font-mono text-eyebrow text-ink-muted uppercase">Typical duration</dt>
            <dd className="mt-1 font-medium">{phase.duration}</dd>
            {detailed && (
              <>
                <dt className="mt-4 font-mono text-eyebrow text-ink-muted uppercase">Deliverables</dt>
                <dd className="mt-2">
                  <ul className="flex flex-wrap gap-2">
                    {phase.deliverables.map((d) => (
                      <li key={d} className="rounded-md bg-paper-2 px-2.5 py-1 text-xs text-ink-2">
                        {d}
                      </li>
                    ))}
                  </ul>
                </dd>
              </>
            )}
          </dl>
        </li>
      ))}
    </Reveal>
  );
}

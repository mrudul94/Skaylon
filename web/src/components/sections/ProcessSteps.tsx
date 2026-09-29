import type { ProcessPhase } from "@/content/types";
import { Tilt } from "@/components/motion/Tilt";
import { Reveal } from "@/scroll/Reveal";

export function ProcessSteps({ phases, detailed = false }: { phases: ProcessPhase[]; detailed?: boolean }) {
  return (
    <Reveal as="ol" stagger className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {phases.map((phase) => (
        <Tilt key={phase.number} as="li" max={5} className="glass flex flex-col rounded-3xl p-8">
          <span className="text-gradient text-6xl font-semibold tracking-[-0.06em] tabular-nums">{phase.number}</span>
          <h3 className="mt-10 text-title font-medium">{phase.title}</h3>
          <p className="mt-4 text-chalk-muted">{phase.summary}</p>
          {detailed && (
            <dl className="mt-auto pt-10 text-sm">
              <dt className="font-mono text-eyebrow text-chalk-muted uppercase">Typical duration</dt>
              <dd className="mt-2">{phase.duration}</dd>
              <dt className="mt-6 font-mono text-eyebrow text-chalk-muted uppercase">Deliverables</dt>
              <dd className="mt-3">
                <ul className="flex flex-wrap gap-2">
                  {phase.deliverables.map((d) => (
                    <li key={d} className="rounded-full bg-chalk/[0.05] px-3 py-1.5 text-xs text-chalk-muted">
                      {d}
                    </li>
                  ))}
                </ul>
              </dd>
            </dl>
          )}
        </Tilt>
      ))}
    </Reveal>
  );
}

import type { ProcessPhase } from "@/content/types";
import { Reveal } from "@/scroll/Reveal";

/**
 * Home-page process on a dark band: four phases joined by a line that draws
 * across as the section scrolls in (.tl-line, CSS only). Every phase, title
 * and duration is real HTML text, fully visible without JS.
 */
export function ProcessTimeline({ phases }: { phases: ProcessPhase[] }) {
  return (
    <Reveal as="ol" stagger className="relative grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
      {phases.map((phase, i) => (
        <li key={phase.number} className="relative pl-12 lg:pt-10 lg:pl-0">
          {/* Vertical connector between phases (phones and tablets). */}
          {i < phases.length - 1 && (
            <span aria-hidden="true" className="absolute top-9 -bottom-8 left-4 w-px bg-paper/15 lg:hidden">
              <span className="tl-line tl-line-y block h-full w-full bg-gradient-to-b from-accent-light to-accent-light/30" />
            </span>
          )}
          {/* Connector: a segment from this dot to the next (desktop). */}
          {i < phases.length - 1 && (
            <span aria-hidden="true" className="absolute top-[0.9rem] left-8 hidden h-px w-[calc(100%-0.5rem)] bg-paper/15 lg:block">
              <span className="tl-line block h-full w-full bg-gradient-to-r from-accent-light to-accent-light/40" />
            </span>
          )}
          <span
            aria-hidden="true"
            className="absolute top-0 left-0 flex h-8 w-8 items-center justify-center rounded-full border border-accent-light/60 bg-ink font-mono text-xs text-accent-light"
          >
            {phase.number}
          </span>
          <h3 className="text-title font-semibold text-paper lg:mt-2">{phase.title}</h3>
          <p className="mt-3 leading-relaxed text-paper/70">{phase.summary}</p>
          <p className="mt-5 border-t border-paper/10 pt-3 text-sm">
            <span className="block font-mono text-eyebrow text-paper/60 uppercase">Typical duration</span>
            <span className="mt-1 block font-medium text-paper">{phase.duration}</span>
          </p>
        </li>
      ))}
    </Reveal>
  );
}

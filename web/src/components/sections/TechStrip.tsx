/**
 * "Built with" strip. The list is real text once (so it is readable and
 * indexable); a second, aria-hidden copy makes the loop seamless and is
 * removed under reduced motion, which also stops the scroll.
 * Only technologies named in Skaylon's own service copy are listed.
 */
const TECH = ["React", "Next.js", "TypeScript", "Node.js", "Flutter", "Figma", "REST APIs", "Accessible, SEO-ready HTML"];

function Track({ hidden }: { hidden?: boolean }) {
  return (
    <ul className="marquee-track gap-10 pr-10" aria-hidden={hidden || undefined}>
      {TECH.map((t) => (
        <li key={t} className="flex shrink-0 items-center gap-3 text-lg font-medium whitespace-nowrap text-ink-2">
          <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-accent" />
          {/* The loop copy is generated content: never duplicated page text. */}
          {hidden ? <span data-t={t} className="gen-text" /> : t}
        </li>
      ))}
    </ul>
  );
}

export function TechStrip() {
  return (
    <section aria-labelledby="tech-heading" className="border-y hairline bg-surface py-6">
      <div className="mx-auto flex max-w-page flex-col gap-4 px-4 sm:px-6 lg:flex-row lg:items-center lg:gap-10 lg:px-8">
        <h2 id="tech-heading" className="shrink-0 font-mono text-eyebrow font-medium text-ink-muted uppercase">
          Built with
        </h2>
        <div className="marquee min-w-0 flex-1">
          <Track />
          <Track hidden />
        </div>
      </div>
    </section>
  );
}

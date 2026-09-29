import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/types";
import { Tilt } from "@/components/motion/Tilt";
import { ArrowUpRight, ButtonLink } from "@/components/ui/primitives";
import { Reveal } from "@/scroll/Reveal";

export function ProjectGrid({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return <ProjectsEmptyState />;
  return (
    <Reveal as="ul" stagger className="grid gap-x-6 gap-y-14 md:grid-cols-2">
      {projects.map((project, i) => (
        <li key={project.slug} className={i % 2 === 1 ? "md:mt-24" : undefined}>
          <Link href={`/work/${project.slug}`} className="group block" data-cursor="">
            <Tilt max={4} className="overflow-hidden rounded-3xl border border-chalk/[0.08]">
              <div className="relative aspect-[4/3] overflow-hidden bg-ink-800">
                <Image
                  src={project.cover.url}
                  alt={project.cover.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[1.4s] ease-cinematic group-hover:scale-[1.06]"
                />
                <span
                  aria-hidden="true"
                  className="absolute right-5 bottom-5 flex h-14 w-14 translate-y-3 items-center justify-center rounded-full bg-chalk text-ink-950 opacity-0 transition-all duration-700 ease-cinematic group-hover:translate-y-0 group-hover:rotate-45 group-hover:opacity-100"
                >
                  <ArrowUpRight />
                </span>
              </div>
            </Tilt>
            <div className="mt-6 flex items-baseline justify-between gap-6">
              <h3 className="text-title font-medium transition-colors duration-500 group-hover:text-accent">
                {project.title}
              </h3>
              <span className="font-mono text-xs text-chalk-muted tabular-nums">
                {project.industry} · {project.year}
              </span>
            </div>
            <p className="mt-2 text-chalk-muted">{project.summary}</p>
          </Link>
        </li>
      ))}
    </Reveal>
  );
}

function ProjectsEmptyState() {
  return (
    <Tilt max={3} className="glass overflow-hidden rounded-3xl px-6 py-16 text-center sm:px-16 sm:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
      <p className="relative inline-flex items-center gap-3 rounded-full border border-chalk/10 px-4 py-2 font-mono text-eyebrow text-chalk-muted uppercase">
        <span className="pulse-dot" aria-hidden="true" />
        Case studies in preparation
      </p>
      <p className="relative mx-auto mt-8 max-w-xl text-lead text-chalk-muted">
        We publish work only with our clients&apos; permission and real, measured outcomes. Detailed case studies
        are being prepared. Ask us for relevant examples on a call.
      </p>
      <div className="relative mt-10 flex justify-center">
        <ButtonLink href="/contact" variant="ghost">
          Request examples
        </ButtonLink>
      </div>
    </Tilt>
  );
}

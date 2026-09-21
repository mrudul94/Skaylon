import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/types";
import { ButtonLink } from "@/components/ui/primitives";
import { Reveal } from "@/scroll/Reveal";

export function ProjectGrid({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return <ProjectsEmptyState />;
  return (
    <Reveal as="ul" stagger className="grid gap-x-8 gap-y-16 md:grid-cols-2">
      {projects.map((project) => (
        <li key={project.slug}>
          <Link href={`/work/${project.slug}`} className="group block">
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-graphite-800">
              <Image
                src={project.cover.url}
                alt={project.cover.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-[1.4s] ease-cinematic group-hover:scale-[1.03]"
              />
            </div>
            <div className="mt-6 flex items-baseline justify-between gap-6">
              <h3 className="text-title font-light group-hover:text-ember">{project.title}</h3>
              <span className="text-sm text-bone-muted tabular-nums">{project.year}</span>
            </div>
            <p className="mt-2 text-bone-muted">{project.summary}</p>
          </Link>
        </li>
      ))}
    </Reveal>
  );
}

function ProjectsEmptyState() {
  return (
    <div className="hairline rounded-sm border px-6 py-16 text-center sm:px-16 sm:py-24">
      <p className="text-eyebrow text-ember uppercase">Case studies in preparation</p>
      <p className="mx-auto mt-6 max-w-xl text-lead text-bone-muted">
        We publish work only with our clients&apos; permission and real, measured outcomes. Detailed case studies
        are being prepared. Ask us for relevant examples on a call.
      </p>
      <div className="mt-10 flex justify-center">
        <ButtonLink href="/contact" variant="ghost">
          Request examples
        </ButtonLink>
      </div>
    </div>
  );
}

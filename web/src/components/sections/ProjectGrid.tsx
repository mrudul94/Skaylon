import { CmsImage } from "@/components/ui/CmsImage";
import Link from "next/link";
import type { Project } from "@/content/types";
import { ButtonLink } from "@/components/ui/primitives";
import { Reveal } from "@/scroll/Reveal";

export function ProjectGrid({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return <ProjectsEmptyState />;
  return (
    <Reveal as="ul" stagger className="grid gap-8 md:grid-cols-2">
      {projects.map((project, i) => (
        <li key={project.slug}>
          <Link href={`/work/${project.slug}`} className="group block">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl border hairline bg-paper-2 transition-shadow duration-300 group-hover:shadow-[0_30px_60px_-30px_rgb(20_22_26/0.45)]">
              <CmsImage
                src={project.cover.url}
                alt={project.cover.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                priority={i < 2}
                className="object-cover object-left-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
            </div>
            <div className="mt-5 flex items-baseline justify-between gap-6">
              <h3 className="text-title font-semibold group-hover:underline">{project.title}</h3>
              <span className="shrink-0 text-sm whitespace-nowrap text-ink-muted tabular-nums">
                {project.industry} · {project.year}
              </span>
            </div>
            <p className="mt-2 text-ink-muted">{project.summary}</p>
          </Link>
        </li>
      ))}
    </Reveal>
  );
}

function ProjectsEmptyState() {
  return (
    <div className="rounded-xl border hairline bg-surface px-6 py-12 text-center sm:px-12">
      <p className="text-title font-semibold">Case studies are being prepared</p>
      <p className="mx-auto mt-3 max-w-xl text-ink-muted">
        We only publish client work with the client&apos;s permission. Detailed case studies will appear here once
        they are approved. In the meantime, we are happy to walk you through relevant examples on a call.
      </p>
      <div className="mt-8 flex justify-center">
        <ButtonLink href="/contact" variant="secondary">
          Ask for relevant examples
        </ButtonLink>
      </div>
    </div>
  );
}

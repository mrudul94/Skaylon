import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, getProjects, getServices } from "@/content";
import { CtaSection } from "@/components/sections/CtaSection";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/primitives";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbs, projectSchema } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { Reveal } from "@/scroll/Reveal";
import { WorldPose } from "@/world/WorldPose";

type Props = { params: Promise<{ slug: string }> };

// Case studies published in Sanity after a deploy render on demand (then
// cache); unknown slugs still 404 via notFound().
export const dynamicParams = true;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject((await params).slug);
  if (!project) return {};
  return pageMetadata({
    title: project.seo.title ?? project.title,
    description: project.seo.description ?? project.summary,
    path: `/work/${project.slug}`,
    noindex: project.seo.noindex,
    image: {
      url: `${project.cover.url}?w=1200&h=630&fit=crop&auto=format`,
      width: 1200,
      height: 630,
      alt: project.cover.alt,
    },
  });
}

const STORY = [
  ["challenge", "The challenge"],
  ["approach", "Our thinking"],
  ["solution", "The solution"],
  ["outcome", "The outcome"],
] as const;

export default async function ProjectPage({ params }: Props) {
  const project = await getProject((await params).slug);
  if (!project) notFound();
  const services = (await getServices()).filter((s) => project.serviceSlugs.includes(s.slug));
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Work", href: "/work" },
    { label: project.title, href: `/work/${project.slug}` },
  ];

  return (
    <article>
      <JsonLd data={[breadcrumbs(crumbs), projectSchema(project)]} />
      <WorldPose pose="work" />
      <PageHero
        eyebrow={`${project.client} · ${project.industry} · ${project.year}`}
        heading={project.title}
        sub={project.summary}
        crumbs={crumbs}
      />

      <Container>
        <div className="relative aspect-[16/9] overflow-hidden rounded-sm bg-graphite-800">
          <Image
            src={project.cover.url}
            alt={project.cover.alt}
            fill
            priority
            sizes="(min-width: 1440px) 1344px, 100vw"
            className="object-cover"
          />
        </div>

        <dl className="hairline mt-12 grid gap-8 border-b pb-12 sm:grid-cols-3">
          <div>
            <dt className="text-eyebrow text-bone-muted uppercase">Services</dt>
            <dd className="mt-3 space-y-1">
              {services.map((s) => (
                <Link key={s.slug} href={`/services/${s.slug}`} className="block hover:text-ember">
                  {s.name}
                </Link>
              ))}
            </dd>
          </div>
          <div>
            <dt className="text-eyebrow text-bone-muted uppercase">Stack</dt>
            <dd className="mt-3">{project.techStack.join(" · ")}</dd>
          </div>
          {project.liveUrl && (
            <div>
              <dt className="text-eyebrow text-bone-muted uppercase">Live</dt>
              <dd className="mt-3">
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="hover:text-ember">
                  Visit site<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </dd>
            </div>
          )}
        </dl>

        {project.metrics.length > 0 && (
          <Reveal as="dl" stagger className="grid gap-10 py-20 sm:grid-cols-3">
            {project.metrics.map((m) => (
              <div key={m.label} className="flex flex-col-reverse">
                <dt className="mt-3 text-bone-muted">{m.label}</dt>
                <dd className="font-serif text-6xl text-ember">{m.value}</dd>
              </div>
            ))}
          </Reveal>
        )}

        {STORY.map(([key, heading]) =>
          project[key].length > 0 ? (
            <section key={key} aria-labelledby={`${key}-heading`} className="grid gap-8 py-16 lg:grid-cols-[1fr_2fr]">
              <h2 id={`${key}-heading`} className="text-title font-light">
                {heading}
              </h2>
              <div className="space-y-5 text-lead text-bone-muted">
                {project[key].map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </section>
          ) : null,
        )}

        {project.gallery.length > 0 && (
          <ul className="grid gap-8 py-16 md:grid-cols-2">
            {project.gallery.map((img) => (
              <li key={img.url} className="relative aspect-[4/3] overflow-hidden rounded-sm bg-graphite-800">
                <Image src={img.url} alt={img.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
              </li>
            ))}
          </ul>
        )}
      </Container>

      <CtaSection title="Facing a similar problem?" label="Start a project" />
    </article>
  );
}

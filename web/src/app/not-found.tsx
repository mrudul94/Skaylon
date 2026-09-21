import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink, Container, Eyebrow } from "@/components/ui/primitives";
import { primaryNav } from "@/lib/nav";
import { WorldPose } from "@/world/WorldPose";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

// The world shows the product with a piece torn out.
export default function NotFound() {
  return (
    <section className="flex min-h-svh items-center pt-20">
      <WorldPose pose="missing" />
      <Container>
        <Eyebrow>404</Eyebrow>
        <h1 className="mt-6 max-w-4xl text-display-xl font-light text-balance">A piece is missing.</h1>
        <p className="mt-8 max-w-xl text-lead text-bone-muted">
          The page you&apos;re looking for doesn&apos;t exist or has moved. Here&apos;s where you can go instead.
        </p>
        <div className="mt-10">
          <ButtonLink href="/">Back to home</ButtonLink>
        </div>
        <nav aria-label="Suggested pages" className="mt-14">
          <ul className="flex flex-wrap gap-x-8 gap-y-3 text-bone-muted">
            {[...primaryNav, { label: "Contact", href: "/contact" }].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="underline-offset-4 hover:text-bone hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </section>
  );
}

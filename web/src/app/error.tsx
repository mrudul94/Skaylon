"use client";

import { useEffect } from "react";
import { Container, Eyebrow } from "@/components/ui/primitives";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-svh items-center pt-20">
      <Container>
        <Eyebrow>Something went wrong</Eyebrow>
        <h1 className="mt-6 max-w-4xl text-display font-light text-balance">This page failed to load.</h1>
        <p className="mt-6 max-w-xl text-lead text-bone-muted">
          It&apos;s on our side, not yours. Try again, or email skaylon.in@gmail.com if it keeps happening.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-10 inline-flex min-h-12 items-center rounded-full bg-bone px-6 text-sm font-medium text-graphite-950 hover:bg-ember"
        >
          Try again
        </button>
        {error.digest && <p className="mt-8 text-xs text-bone-muted">Reference: {error.digest}</p>}
      </Container>
    </section>
  );
}

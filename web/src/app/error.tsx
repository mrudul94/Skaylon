"use client";

import { useEffect } from "react";
import { buttonClass, Container, Eyebrow } from "@/components/ui/primitives";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="pt-32 pb-20 sm:pt-40">
      <Container>
        <Eyebrow>Something went wrong</Eyebrow>
        <h1 className="mt-4 max-w-3xl text-display font-semibold text-balance">This page failed to load</h1>
        <p className="mt-5 max-w-xl text-lead text-ink-muted">
          The problem is on our side. Please try again, or email{" "}
          <a href="mailto:skaylon.in@gmail.com" className="font-medium text-ink underline">
            skaylon.in@gmail.com
          </a>{" "}
          if it keeps happening.
        </p>
        <button type="button" onClick={reset} className={buttonClass("primary", "mt-8")}>
          Try again
        </button>
        {error.digest && <p className="mt-6 text-sm text-ink-muted">Reference: {error.digest}</p>}
      </Container>
    </section>
  );
}

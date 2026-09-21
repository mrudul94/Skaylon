"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink, Container } from "@/components/ui/primitives";
import { isActive, primaryNav } from "@/lib/nav";
import { lenisRef } from "@/scroll/lenis";

export function Header() {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  // Native modal <dialog>: focus trap, Escape to close and inert background for free.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      lenisRef.current?.stop();
    } else if (!open && dialog.open) {
      dialog.close();
    }
    if (!open) lenisRef.current?.start();
  }, [open]);

  // Close when a link navigates.
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-bone/[0.06] bg-graphite-950/55 backdrop-blur-xl">
      <Container className="flex h-20 items-center justify-between">
        <Link href="/" aria-label="Skaylon — home" className="-m-2 p-2">
          <Logo />
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-10 text-sm">
            {primaryNav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`transition-colors duration-500 hover:text-bone ${active ? "text-bone" : "text-bone-muted"}`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden md:block">
          <ButtonLink href="/contact" className="min-h-10 px-5" data-track="cta_click" data-track-label="header">

            Start a project
          </ButtonLink>
        </div>

        <button
          type="button"
          className="-m-2 flex min-h-11 min-w-11 items-center justify-center p-2 md:hidden"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(true)}
        >
          <span className="sr-only">Open menu</span>
          <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24">
            <path d="M3 8h18M3 16h18" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </button>
      </Container>

      <dialog
        id="mobile-menu"
        ref={dialogRef}
        aria-label="Menu"
        data-lenis-prevent
        onClose={() => setOpen(false)}
        className="menu m-0 h-dvh max-h-none w-full max-w-none bg-graphite-950 p-0 text-bone"
      >
        <Container className="flex h-full flex-col">
          <div className="flex h-20 items-center justify-between">
            <Logo />
            <button
              type="button"
              className="-m-2 flex min-h-11 min-w-11 items-center justify-center p-2"
              onClick={() => setOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24">
                <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </button>
          </div>
          <nav aria-label="Mobile" className="mt-12">
            <ul className="space-y-2">
              {[...primaryNav, { label: "Contact", href: "/contact" }].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className="block py-2 text-display font-light aria-[current=page]:text-ember"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </dialog>
    </header>
  );
}

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
  const headerRef = useRef<HTMLElement>(null);
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

  // Hide while scrolling down past the hero, show again on any scroll up.
  // Written straight to data attributes: no re-renders while scrolling.
  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const el = headerRef.current;
      if (!el) return;
      el.dataset.scrolled = y > 24 ? "true" : "false";
      if (Math.abs(y - last) < 6) return;
      el.dataset.hidden = y > last && y > 240 && !el.contains(document.activeElement) ? "true" : "false";
      last = y;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header ref={headerRef} className="site-header group/header fixed inset-x-0 top-0 z-50 pt-3 sm:pt-4">
      <Container>
        <div className="flex h-16 items-center justify-between rounded-full border border-transparent px-3 transition-[background-color,border-color,backdrop-filter] duration-700 ease-cinematic group-data-[scrolled=true]/header:border-chalk/[0.08] group-data-[scrolled=true]/header:bg-ink-900/60 group-data-[scrolled=true]/header:backdrop-blur-xl sm:px-4">
          <Link href="/" aria-label="Skaylon — home" className="-m-1 rounded-full p-2">
            <Logo />
          </Link>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-1 text-sm">
              {primaryNav.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`relative flex items-center gap-2 rounded-full px-4 py-2 transition-colors duration-500 hover:text-chalk ${active ? "text-chalk" : "text-chalk-muted"}`}
                    >
                      {active && <span aria-hidden="true" className="h-1 w-1 rounded-full bg-cyan" />}
                      <span className="roll" data-text={item.label}>
                        <span>{item.label}</span>
                      </span>
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
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-chalk/10 bg-ink-900/60 backdrop-blur-md md:hidden"
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            <span className="sr-only">Open menu</span>
            <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22">
              <path d="M4 9h16M4 15h10" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </button>
        </div>
      </Container>

      <dialog
        id="mobile-menu"
        ref={dialogRef}
        aria-label="Menu"
        data-lenis-prevent
        onClose={() => setOpen(false)}
        className="menu m-0 h-dvh max-h-none w-full max-w-none bg-ink-950 p-0 text-chalk"
      >
        <Container className="flex h-full flex-col pb-10">
          <div className="flex h-16 items-center justify-between pt-3 sm:pt-4">
            <Logo />
            <button
              type="button"
              className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-chalk/10"
              onClick={() => setOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </button>
          </div>
          <nav aria-label="Mobile" className="mt-14">
            <ul className="space-y-1">
              {[...primaryNav, { label: "Contact", href: "/contact" }].map((item, i) => (
                <li key={item.href} className="menu-item" style={{ "--i": i } as React.CSSProperties}>
                  <Link
                    href={item.href}
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 py-2 text-display font-medium aria-[current=page]:text-accent"
                  >
                    <span className="font-mono text-xs text-chalk-muted">{String(i + 1).padStart(2, "0")}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="menu-item mt-auto font-mono text-xs text-chalk-muted uppercase" style={{ "--i": 6 } as React.CSSProperties}>
            Software studio · Kasaragod, Kerala
          </p>
        </Container>
      </dialog>
    </header>
  );
}

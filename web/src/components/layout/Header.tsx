"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink, Container } from "@/components/ui/primitives";
import { isActive, primaryNav, type NavService } from "@/lib/nav";
import { ServicesMenu } from "./ServicesMenu";

export function Header({
  services,
  phone,
}: {
  services: NavService[];
  phone: string;
}) {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  // Native modal <dialog>: focus trap, Escape to close and inert background for free.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  // Close when a link navigates.
  useEffect(() => {
    setOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  // Border and solid background once the page has scrolled. Written straight
  // to a data attribute: no re-renders while scrolling.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      if (headerRef.current)
        headerRef.current.dataset.scrolled =
          window.scrollY > 8 ? "true" : "false";
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

  const tel = `tel:${phone.replace(/\s/g, "")}`;

  return (
    <header
      ref={headerRef}
      className="site-header fixed inset-x-0 top-0 z-50 border-b border-transparent bg-paper/80 backdrop-blur-md transition-colors duration-200"
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]">
          <Link
            href="/"
            aria-label="Skaylon home"
            className="-m-1 rounded-md p-1"
          >
            <Logo priority />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              <li>
                <ServicesMenu services={services} />
              </li>
              {primaryNav.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`block rounded-md px-3 py-2 text-[0.95rem] hover:text-ink ${active ? "font-medium text-ink" : "text-ink-2"}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <a
              href={tel}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border hairline bg-surface px-3.5 text-sm font-medium text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
              data-track="phone_click"
              data-track-label="header"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                width="15"
                height="15"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-accent-ink"
              >
                <path d="M5 4h3.5l1.8 4.4-2.2 1.4a11 11 0 0 0 6.1 6.1l1.4-2.2L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4z" />
              </svg>
              {phone}
            </a>
            <ButtonLink
              href="/contact"
              className="min-h-11"
              data-track="cta_click"
              data-track-label="header"
            >
              Start a project
            </ButtonLink>
          </div>

          {/* Tablets: no sticky bar (phones only) and no desktop nav yet, so
              the main call to action sits beside the menu button. */}
          <div className="flex items-center gap-3 lg:hidden">
            <ButtonLink
              href="/contact"
              className="hidden min-h-11 md:inline-flex"
              data-track="cta_click"
              data-track-label="header-tablet"
            >
              Start a project
            </ButtonLink>
            <button
              type="button"
              className="flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg border border-line-strong bg-surface px-3 text-sm font-medium lg:hidden"
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(true)}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                width="20"
                height="20"
              >
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
              </svg>
              Menu
            </button>
          </div>
        </div>
      </Container>

      <dialog
        id="mobile-menu"
        ref={dialogRef}
        aria-label="Site menu"
        onClose={() => {
          setOpen(false);
          setServicesOpen(false);
        }}
        className="sheet m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain bg-paper p-0 text-ink"
      >
        <Container className="flex min-h-full flex-col pb-8">
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/"
              aria-label="Skaylon home"
              onClick={() => setOpen(false)}
              className="-m-1 rounded-md p-1"
            >
              <Logo />
            </Link>
            <button
              type="button"
              className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-line-strong bg-surface px-3 text-sm font-medium"
              onClick={() => setOpen(false)}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                width="20"
                height="20"
              >
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
              </svg>
              Close
            </button>
          </div>

          <nav aria-label="Mobile" className="mt-6">
            <ul className="divide-y divide-line border-y hairline">
              <li>
                <button
                  type="button"
                  aria-expanded={servicesOpen}
                  aria-controls="mobile-services"
                  onClick={() => setServicesOpen((o) => !o)}
                  className="flex w-full items-center justify-between py-4 text-left text-xl font-semibold"
                >
                  Services
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 12 12"
                    width="14"
                    height="14"
                    className={`transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
                  >
                    <path
                      d="M2.5 4.5L6 8l3.5-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </button>
                <ul
                  id="mobile-services"
                  hidden={!servicesOpen}
                  className="space-y-1 pb-4"
                >
                  {services.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/services/${s.slug}`}
                        aria-current={
                          pathname === `/services/${s.slug}`
                            ? "page"
                            : undefined
                        }
                        onClick={() => setOpen(false)}
                        className="block rounded-lg px-3 py-2.5 hover:bg-paper-2 aria-[current=page]:bg-accent-wash"
                      >
                        <span className="block font-medium">{s.name}</span>
                        <span className="block text-sm text-ink-muted">
                          {s.description}
                        </span>
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/services"
                      onClick={() => setOpen(false)}
                      className="block px-3 py-2.5 text-sm font-medium text-accent-ink underline"
                    >
                      All services overview
                    </Link>
                  </li>
                </ul>
              </li>
              {[...primaryNav, { label: "Contact", href: "/contact" }].map(
                (item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={
                        isActive(pathname, item.href) ? "page" : undefined
                      }
                      onClick={() => setOpen(false)}
                      className="block py-4 text-xl font-semibold aria-[current=page]:text-accent-ink"
                    >
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="mt-auto space-y-3 pt-8">
            <ButtonLink
              href="/contact"
              className="w-full"
              onClick={() => setOpen(false)}
              data-track="cta_click"
              data-track-label="mobile-menu"
            >
              Start a project
            </ButtonLink>
            <a
              href={tel}
              className="flex min-h-12 w-full items-center justify-center rounded-lg border border-line-strong text-[0.95rem] font-medium"
              data-track="phone_click"
              data-track-label="mobile-menu"
            >
              Call {phone}
            </a>
          </div>
        </Container>
      </dialog>
    </header>
  );
}

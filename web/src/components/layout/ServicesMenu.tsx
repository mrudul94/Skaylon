"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Arrow } from "@/components/ui/primitives";
import { isActive, type NavService } from "@/lib/nav";

/**
 * Desktop Services menu (disclosure navigation pattern).
 *
 * - "Services" is a real link to /services (works without JS too).
 * - The panel opens on hover (mouse only, with a short intent delay), from the
 *   arrow button next to the link (click, Enter/Space), or with ArrowDown on
 *   either.
 * - Arrow keys, Home and End move between the links; Escape closes and
 *   returns focus to the arrow button; Tab out, click outside or navigating
 *   closes.
 */
export function ServicesMenu({ services }: { services: NavService[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const active = isActive(pathname, "/services");

  const links = () => Array.from(wrapRef.current?.querySelectorAll<HTMLAnchorElement>("[data-menu-link]") ?? []);

  const close = useCallback((returnFocus = false) => {
    clearTimeout(timer.current);
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  }, []);

  useEffect(() => close(), [pathname, close]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, close]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const onTriggerKey = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => links()[0]?.focus());
    }
  };

  const onPanelKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const items = links();
    const i = items.indexOf(document.activeElement as HTMLAnchorElement);
    const focus = (n: number) => items[(n + items.length) % items.length]?.focus();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      focus(i + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (i <= 0) buttonRef.current?.focus();
      else focus(i - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focus(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focus(items.length - 1);
    }
  };

  return (
    <div
      ref={wrapRef}
      className="relative"
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.stopPropagation();
          close(true);
        }
      }}
      onBlur={(e) => {
        if (open && !wrapRef.current?.contains(e.relatedTarget as Node | null)) close();
      }}
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return;
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setOpen(true), 90);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse") return;
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setOpen(false), 180);
      }}
    >
      <div className="flex items-center">
        <Link
          href="/services"
          aria-current={pathname === "/services" ? "page" : undefined}
          onKeyDown={onTriggerKey}
          className={`rounded-md py-2 pr-1 pl-3 text-[0.95rem] hover:text-ink ${active ? "font-medium text-ink" : "text-ink-2"}`}
        >
          Services
        </Link>
        <button
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={onTriggerKey}
          className="flex h-9 w-8 items-center justify-center rounded-md text-ink-2 hover:text-ink"
        >
          <span className="sr-only">Show services menu</span>
          <svg aria-hidden="true" viewBox="0 0 12 12" width="12" height="12" className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
            <path d="M2.5 4.5L6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </div>

      <div
        id={panelId}
        hidden={!open}
        onKeyDown={onPanelKey}
        className="menu-panel absolute top-full left-1/2 z-50 mt-2 w-[min(44rem,calc(100vw-2rem))] -translate-x-1/2 rounded-xl border hairline bg-surface p-3 shadow-[0_24px_60px_-24px_rgb(20_22_26/0.35)]"
      >
        <ul className="grid gap-1 sm:grid-cols-2">
          {services.map((s) => (
            <li key={s.slug}>
              <Link
                data-menu-link
                href={`/services/${s.slug}`}
                aria-current={pathname === `/services/${s.slug}` ? "page" : undefined}
                className="block rounded-lg p-3 hover:bg-paper focus-visible:bg-paper aria-[current=page]:bg-accent-wash"
              >
                <span className="block font-medium text-ink">{s.name}</span>
                <span className="mt-0.5 block text-sm leading-snug text-ink-muted">{s.description}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-paper px-4 py-3 text-sm">
          <Link data-menu-link href="/services" className="inline-flex items-center gap-2 font-medium text-ink hover:underline">
            All services overview <Arrow />
          </Link>
          <Link data-menu-link href="/contact" className="text-accent-ink hover:underline">
            Not sure which you need? Ask us
          </Link>
        </div>
      </div>
    </div>
  );
}

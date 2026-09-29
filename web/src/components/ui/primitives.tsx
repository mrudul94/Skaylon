import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Magnetic } from "@/components/motion/Magnetic";

function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export { cx };

export function Container({
  as: Tag = "div",
  className,
  children,
}: {
  as?: "div" | "section" | "header" | "footer";
  className?: string;
  children: ReactNode;
}) {
  const Element = Tag as unknown as React.FC<React.HTMLAttributes<HTMLElement>>;
  return <Element className={cx("mx-auto w-full max-w-page px-4 sm:px-6 lg:px-12", className)}>{children}</Element>;
}

/** Mono label with a short accent rule: section kickers, metadata. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cx("flex items-center gap-3 font-mono text-eyebrow text-chalk-muted uppercase", className)}>
      <span aria-hidden="true" className="h-px w-6 bg-gradient-to-r from-accent to-cyan" />
      {children}
    </p>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: "primary" | "ghost";
  /** Pull toward the pointer on hover (desktop). */
  magnetic?: boolean;
};

/**
 * Pill button. Hover: a fill wipes up from the bottom and the arrow loops
 * through (`.btn` in globals.css); optionally magnetic.
 */
export function ButtonLink({ variant = "primary", magnetic = true, className, children, ...props }: ButtonLinkProps) {
  const link = (
    <Link
      {...props}
      className={cx(
        "btn group inline-flex min-h-12 items-center gap-3 rounded-full px-6 text-sm font-medium tracking-tight",
        variant === "primary"
          ? "bg-chalk text-ink-950 [--btn-fill:linear-gradient(100deg,var(--color-accent),var(--color-cyan))]"
          : "border border-chalk/20 text-chalk [--btn-fill:var(--color-chalk)] hover:border-chalk hover:text-ink-950 focus-visible:text-ink-950",
        className,
      )}
    >
      {children}
      <span className="btn-arrow" aria-hidden="true">
        <Arrow />
        <Arrow />
      </span>
    </Link>
  );
  return magnetic ? <Magnetic>{link}</Magnetic> : link;
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" className={className}>
      <path d="M1 8h13M9 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

/** Arrow pointing up-right: external / "go to" affordance on cards. */
export function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" className={className}>
      <path d="M4 12L12 4M5.5 4H12v6.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function SectionHeading({
  id,
  eyebrow,
  heading,
  as: Tag = "h2",
  className,
  children,
}: {
  id?: string;
  eyebrow?: string;
  heading: string;
  as?: "h1" | "h2";
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cx("max-w-3xl", className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <Tag id={id} className={cx("mt-6 font-medium text-balance", Tag === "h1" ? "text-display-xl" : "text-display")}>
        <AccentLast text={heading} />
      </Tag>
      {children && <div className="mt-7 space-y-4 text-lead text-chalk-muted">{children}</div>}
    </div>
  );
}

/**
 * Sets a headline's last word in the gradient serif italic. The text content
 * is unchanged (tests and screen readers see the plain heading).
 */
export function AccentLast({ text }: { text: string }) {
  const i = text.lastIndexOf(" ");
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i + 1)}
      <span className="serif-accent text-gradient">{text.slice(i + 1)}</span>
    </>
  );
}

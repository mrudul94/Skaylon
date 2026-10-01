import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

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
  return <Element className={cx("mx-auto w-full max-w-page px-4 sm:px-6 lg:px-8", className)}>{children}</Element>;
}

/** Small uppercase label above a heading. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cx("flex items-center gap-2.5 font-mono text-eyebrow font-medium text-accent-ink uppercase", className)}>
      <span aria-hidden="true" className="h-px w-5 bg-accent" />
      {children}
    </p>
  );
}

const buttonStyles = {
  primary: "btn-sheen bg-ink text-paper hover:bg-ink-2 border border-ink",
  secondary: "border border-line-strong bg-surface text-ink hover:border-ink",
  accent: "bg-accent-ink text-white hover:bg-[#8a3814] border border-accent-ink",
} as const;

export type ButtonVariant = keyof typeof buttonStyles;

export function buttonClass(variant: ButtonVariant = "primary", className?: string) {
  return cx(
    "btn inline-flex min-h-12 items-center justify-center gap-2.5 rounded-lg px-5 text-[0.95rem] font-medium",
    buttonStyles[variant],
    className,
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: ButtonVariant; arrow?: boolean };

export function ButtonLink({ variant = "primary", arrow = true, className, children, ...props }: ButtonLinkProps) {
  return (
    <Link {...props} className={buttonClass(variant, className)}>
      {children}
      {arrow && (
        <span className="btn-arrow" aria-hidden="true">
          <Arrow />
        </span>
      )}
    </Link>
  );
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" className={className}>
      <path d="M1 8h13M9 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/**
 * Sets the first matching phrase in a heading in the brand accent, with a
 * soft marker underline. The text content is unchanged, so search engines,
 * AI tools and screen readers see the plain heading.
 */
export function AccentPhrase({ text, phrases }: { text: string; phrases: string[] }) {
  const lower = text.toLowerCase();
  const phrase = phrases.find((p) => lower.includes(p.toLowerCase()));
  if (!phrase) return <>{text}</>;
  const i = lower.indexOf(phrase.toLowerCase());
  return (
    <>
      {text.slice(0, i)}
      <span className="accent-phrase">{text.slice(i, i + phrase.length)}</span>
      {text.slice(i + phrase.length)}
    </>
  );
}

export function Check({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" className={className}>
      <path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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
      <Tag id={id} className={cx("mt-4 font-semibold text-balance", Tag === "h1" ? "text-display-xl" : "text-display")}>
        {heading}
      </Tag>
      {children && <div className="mt-5 space-y-4 text-lead text-ink-muted">{children}</div>}
    </div>
  );
}

/** "In short" answer box: a quotable summary near the top of a page (AEO/GEO). */
export function Summary({ children, label = "In short", className }: { children: ReactNode; label?: string; className?: string }) {
  return (
    <aside aria-label={label} className={cx("relative border-l-2 border-accent py-1 pl-5 sm:pl-8", className)}>
      <p className="font-mono text-eyebrow font-medium text-accent-ink uppercase">{label}</p>
      <div className="mt-3 max-w-4xl text-[clamp(1.12rem,1rem+0.55vw,1.45rem)] leading-[1.55] tracking-[-0.01em] text-ink-2">{children}</div>
    </aside>
  );
}

/** Grid of titled cards (capabilities, audiences, reasons). */
export function CardGrid({
  items,
  headingLevel = "h3",
  columns = 3,
  className,
}: {
  items: { title: string; description: string }[];
  headingLevel?: "h3" | "h4";
  columns?: 2 | 3;
  className?: string;
}) {
  const H = headingLevel;
  return (
    <ul
      data-stagger-target
      className={cx("grid gap-4 sm:grid-cols-2", columns === 3 && (items.length === 5 ? "lg:grid-cols-6" : "lg:grid-cols-3"), className)}
    >
      {items.map((item, i) => (
        <li
          key={item.title}
          className={cx(
            "spot card-link card-lift rounded-xl border hairline bg-surface p-6",
            columns === 3 && items.length === 5 && (i < 3 ? "lg:col-span-2" : "lg:col-span-3"),
          )}
        >
          <span aria-hidden="true" className="font-mono text-sm text-accent-ink">
            {String(i + 1).padStart(2, "0")}
          </span>
          <H className="mt-3 text-lg font-semibold tracking-tight">{item.title}</H>
          <p className="mt-2 leading-relaxed text-ink-muted">{item.description}</p>
        </li>
      ))}
    </ul>
  );
}

/** Numbered steps (process on home and service pages). */
export function StepList({ steps, className }: { steps: { title: string; description: string }[]; className?: string }) {
  return (
    <ol data-stagger-target className={cx("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {steps.map((step, i) => (
        <li key={step.title} className="rounded-xl border hairline bg-surface p-6">
          <span aria-hidden="true" className="font-mono text-sm text-accent-ink">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-3 text-lg font-semibold tracking-tight">{step.title}</h3>
          <p className="mt-2 leading-relaxed text-ink-muted">{step.description}</p>
        </li>
      ))}
    </ol>
  );
}

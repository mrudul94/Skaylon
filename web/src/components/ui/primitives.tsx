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
  return <Element className={cx("mx-auto w-full max-w-page px-4 sm:px-6 lg:px-12", className)}>{children}</Element>;
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cx("text-eyebrow font-medium text-ember uppercase", className)}>{children}</p>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: "primary" | "ghost";
};

export function ButtonLink({ variant = "primary", className, children, ...props }: ButtonLinkProps) {
  return (
    <Link
      {...props}
      className={cx(
        "group inline-flex min-h-12 items-center gap-3 rounded-full px-6 text-sm font-medium tracking-wide transition-colors duration-500 ease-cinematic",
        variant === "primary"
          ? "bg-bone text-graphite-950 hover:bg-ember"
          : "border border-bone/25 text-bone hover:border-ember hover:text-ember",
        className,
      )}
    >
      {children}
      <Arrow className="transition-transform duration-500 ease-cinematic group-hover:translate-x-1" />
    </Link>
  );
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" className={className}>
      <path d="M1 8h13M9 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.4" />
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
      <Tag id={id} className={cx("mt-5 font-light text-balance", Tag === "h1" ? "text-display-xl" : "text-display")}>
        {heading}
      </Tag>
      {children && <div className="mt-6 space-y-4 text-lead text-bone-muted">{children}</div>}
    </div>
  );
}

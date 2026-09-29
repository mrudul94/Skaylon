import Link from "next/link";

export type Crumb = { label: string; href: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 font-mono text-xs text-chalk-muted uppercase">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="text-chalk">
                  {item.label}
                </span>
              ) : (
                <>
                  <Link href={item.href} className="link-draw pb-0.5 hover:text-chalk">
                    {item.label}
                  </Link>
                  <span aria-hidden="true" className="text-chalk/30">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

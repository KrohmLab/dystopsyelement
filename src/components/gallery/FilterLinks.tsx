import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { cn } from "../../lib/cn";

type Item = { label: string; href: string; count?: number; current: boolean };

/**
 * Filtre de la galerie (année, photographe) sous forme de liens : chaque choix est une vraie page pré-rendue,
 * partageable et indexable. Défile horizontalement sur mobile au lieu de passer à la ligne.
 */
export function FilterLinks({ label, items }: { label: string; items: Item[] }) {
  const list = useRef<HTMLUListElement>(null);
  const current = items.findIndex((item) => item.current);

  // Mobile : le choix actif est ramené dans la zone visible du défilement horizontal (sans bouger la page).
  useEffect(() => {
    const ul = list.current;
    const active = ul?.children[current] as HTMLElement | undefined;
    if (!ul || !active || ul.scrollWidth <= ul.clientWidth) return;
    const box = active.getBoundingClientRect();
    ul.scrollLeft += box.left - ul.getBoundingClientRect().left - (ul.clientWidth - box.width) / 2;
  }, [current]);

  return (
    <nav aria-label={label} className="flex min-w-0 flex-col gap-1.5">
      <span className="font-display text-eyebrow font-bold text-ink-muted uppercase">{label}</span>
      <ul ref={list} className="rail-x -mx-gutter flex gap-2 overflow-x-auto px-gutter pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {items.map((item) => (
          <li key={item.href} className="shrink-0">
            <Link
              to={item.href}
              prefetch="intent"
              preventScrollReset
              aria-current={item.current ? "page" : undefined}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 px-4 font-display text-label-sm font-bold uppercase no-underline transition-colors duration-fast chamfer-sm",
                item.current ? "bg-nexen-lilac text-on-accent" : "bg-void/70 text-ink-soft inset-ring inset-ring-line-strong hover:text-ink hover:inset-ring-nexen-lilac",
              )}
            >
              {item.label}
              {item.count !== undefined && <span className={cn("text-micro tabular-nums", item.current ? "text-on-accent" : "text-ink-muted")}>{item.count}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

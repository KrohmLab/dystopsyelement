import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { cn } from "../../lib/cn";

type Item = { label: string; href: string; count?: number; current: boolean };

const RAIL =
  "rail-x -mx-gutter flex gap-2 overflow-x-auto px-gutter pb-1 sm:mx-0 sm:flex-wrap sm:px-0";
const chip = (current: boolean) =>
  cn(
    "inline-flex min-h-11 cursor-pointer items-center gap-2 px-4 font-display text-label-sm font-bold whitespace-nowrap uppercase no-underline transition-colors duration-fast chamfer-sm",
    current
      ? "bg-nexen-lilac text-on-accent"
      : "bg-void/70 text-ink-soft inset-ring inset-ring-line-strong hover:text-ink hover:inset-ring-nexen-lilac",
  );

/** Mobile : le choix actif est ramené dans la zone visible du défilement horizontal (sans bouger la page). */
function useActiveInView(current: number) {
  const list = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const ul = list.current;
    const active = ul?.children[current] as HTMLElement | undefined;
    if (!ul || !active || ul.scrollWidth <= ul.clientWidth) return;
    const box = active.getBoundingClientRect();
    ul.scrollLeft +=
      box.left -
      ul.getBoundingClientRect().left -
      (ul.clientWidth - box.width) / 2;
  }, [current]);
  return list;
}

/**
 * Filtre de la galerie (année, photographe) sous forme de liens : chaque choix est une vraie page pré-rendue,
 * partageable et indexable. Défile horizontalement sur mobile au lieu de passer à la ligne.
 */
export function FilterLinks({
  label,
  items,
}: {
  label: string;
  items: Item[];
}) {
  const list = useActiveInView(items.findIndex((item) => item.current));

  return (
    <nav aria-label={label} className="flex min-w-0 flex-col gap-1.5">
      <span className="font-display text-eyebrow font-bold text-ink-muted uppercase">
        {label}
      </span>
      <ul ref={list} className={RAIL}>
        {items.map((item) => (
          <li key={item.href} className="shrink-0">
            <Link
              to={item.href}
              prefetch="intent"
              preventScrollReset
              aria-current={item.current ? "page" : undefined}
              className={chip(item.current)}
            >
              {item.label}
              {item.count !== undefined && (
                <span
                  className={cn(
                    "text-micro tabular-nums",
                    item.current ? "text-on-accent" : "text-ink-muted",
                  )}
                >
                  {item.count}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Même filtre, en boutons, pour un choix sur place (aperçu de la galerie sur la page Nexen). */
export function FilterButtons<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  const list = useActiveInView(
    options.findIndex((option) => option.value === value),
  );
  return (
    <div
      role="group"
      aria-label={label}
      className="flex min-w-0 flex-col gap-1.5"
    >
      <span
        aria-hidden="true"
        className="font-display text-eyebrow font-bold text-ink-muted uppercase"
      >
        {label}
      </span>
      <ul ref={list} className={RAIL}>
        {options.map((option) => (
          <li key={option.value} className="shrink-0">
            <button
              type="button"
              aria-pressed={option.value === value}
              onClick={() => onChange(option.value)}
              className={chip(option.value === value)}
            >
              {option.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { cn } from "../../lib/cn";

export type SegmentOption<T extends string> = {
  value: T;
  label: string;
  /** Classes de l'option active (couleur de scène…) ; cyan par défaut. */
  activeClass?: string;
};

type Props<T extends string> = {
  /** Libellé du groupe, affiché en petit au-dessus (et lu par les lecteurs d'écran). */
  label: string;
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

/**
 * Sélecteur segmenté (DESIGN_SYSTEM §7.16 bis) : un seul bloc biseauté, une option active pleine.
 * Remplace une rangée de boutons indépendants pour les choix exclusifs (scène, jour…).
 */
export function Segmented<T extends string>({ label, options, value, onChange, className }: Props<T>) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <span className="font-display text-eyebrow font-bold text-ink-muted uppercase">{label}</span>
      <div role="group" aria-label={label} className="flex bg-void/70 p-1 inset-ring inset-ring-line-strong chamfer-sm">
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.value)}
              className={cn(
                "min-h-10 min-w-0 flex-1 basis-0 cursor-pointer px-1.5 font-display sm:basis-auto sm:px-3 text-label-sm font-bold whitespace-nowrap uppercase transition-colors duration-base chamfer-sm",
                active ? (option.activeClass ?? "bg-cyan text-on-accent") : "text-ink-soft hover:text-ink",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

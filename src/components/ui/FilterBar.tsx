import { cn } from "../../lib/cn";

type Props<T extends string> = {
  /** Libellé du groupe, lu par les lecteurs d'écran. */
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

/** Onglets / filtres sans rechargement (DESIGN_SYSTEM §7.16 bis) : l'option active est en cyan plein. */
export function FilterBar<T extends string>({ label, options, value, onChange, className }: Props<T>) {
  return (
    <div role="group" aria-label={label} className={cn("flex flex-wrap justify-center gap-2", className)}>
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option)}
            className={cn(
              "min-h-10 cursor-pointer px-4 font-display text-label-sm font-bold uppercase transition-colors duration-base chamfer-sm",
              active ? "bg-cyan text-on-accent" : "bg-surface text-ink-soft inset-ring inset-ring-line-strong hover:text-cyan hover:inset-ring-cyan-line",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

import { useId } from "react";
import { cn } from "../../lib/cn";
import { ChevronDownIcon } from "../icons";

type Option = { value: string; label: string };

type Props = {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

/** Liste déroulante compacte (filtres) : `<select>` natif, contour biseauté, chevron cyan. */
export function SelectField({ label, options, value, onChange, className }: Props) {
  const id = useId();
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <label htmlFor={id} className="font-display text-eyebrow font-bold text-ink-muted uppercase">
        {label}
      </label>
      <div className="relative bg-line-strong p-px transition-colors duration-fast chamfer-sm focus-within:bg-cyan">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="block min-h-11.5 w-full cursor-pointer appearance-none bg-void px-4 pr-11 font-display text-label-sm font-bold text-ink uppercase outline-none chamfer-sm"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon size={20} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-cyan" />
      </div>
    </div>
  );
}

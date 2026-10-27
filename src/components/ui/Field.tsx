import { useId } from "react";
import { cn } from "../../lib/cn";

type Props = {
  label: string;
  name: string;
  type?: "text" | "email" | "textarea" | "select";
  defaultValue?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  rows?: number;
  /** Options de la liste (`type="select"`). */
  options?: string[];
  /** Message d'erreur : passe le champ en état invalide. */
  error?: string;
};

const CONTROL =
  "block w-full bg-surface px-4 py-3 font-body text-body text-ink outline-none chamfer-sm placeholder:text-ink-faint";

/**
 * Champ de formulaire (DESIGN_SYSTEM §7.13) : texte, e-mail, zone de texte ou liste.
 * Contour biseauté en deux calques : `line-strong` au repos, `cyan` au focus, `danger` en erreur.
 */
export function Field({ label, name, type = "text", defaultValue, placeholder, autoComplete, required, rows = 5, options = [], error }: Props) {
  const id = useId();
  const errorId = `${id}-erreur`;
  const aria = error ? { "aria-invalid": true, "aria-describedby": errorId } : {};
  const common = { id, name, required, ...aria };

  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-display text-eyebrow font-bold text-ink-muted uppercase">
        {label}
      </label>
      <div className={cn("p-px transition-colors duration-fast chamfer-sm", error ? "bg-danger" : "bg-line-strong focus-within:bg-cyan")}>
        {type === "textarea" ? (
          <textarea {...common} rows={rows} placeholder={placeholder} defaultValue={defaultValue} className={cn(CONTROL, "resize-y")} />
        ) : type === "select" ? (
          <select {...common} defaultValue={defaultValue} className={cn(CONTROL, "h-12")}>
            {options.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        ) : (
          <input
            {...common}
            type={type}
            defaultValue={defaultValue}
            placeholder={placeholder}
            autoComplete={autoComplete}
            className={cn(CONTROL, "h-12")}
          />
        )}
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 text-small text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

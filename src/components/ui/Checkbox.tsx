import { useId, type ReactNode } from "react";

/** Case à cocher avec son libellé (consentement RGPD du formulaire). */
export function Checkbox({ name, required, children }: { name: string; required?: boolean; children: ReactNode }) {
  const id = useId();
  return (
    <div className="flex items-start gap-3 text-small">
      <input id={id} name={name} required={required} type="checkbox" className="mt-0.5 size-5 shrink-0 accent-cyan" />
      <label htmlFor={id}>{children}</label>
    </div>
  );
}

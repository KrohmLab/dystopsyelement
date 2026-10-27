import type { ReactNode } from "react";
import { PlusIcon } from "../icons";

/** Question / réponse repliable, en `<details>` natif : fonctionne sans JavaScript (DESIGN_SYSTEM §7.14). */
export function Accordion({ question, open, children }: { question: string; open?: boolean; children: ReactNode }) {
  return (
    <details className="group border-b border-line" open={open}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-display text-h3 font-bold text-ink uppercase [&::-webkit-details-marker]:hidden">
        <span>{question}</span>
        <PlusIcon size={24} className="shrink-0 text-cyan transition-transform duration-base group-open:rotate-45" />
      </summary>
      <div className="max-w-prose pb-5 [&_a]:text-cyan [&_a]:underline">{children}</div>
    </details>
  );
}

import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

type Tone = "cyan" | "pink" | "lilac";
const TONE: Record<Tone, string> = { cyan: "text-cyan", pink: "text-pink", lilac: "text-nexen-lilac" };

type Props = {
  eyebrow: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  /** Sur-titre rose si la section est orientée vente ; lilas sur la page Nexen. */
  tone?: Tone;
  /** Identifiant du H2, pour `aria-labelledby` de la section. */
  id?: string;
  /** Action (un Button ghost) à droite en desktop, dessous en mobile. */
  action?: ReactNode;
};

/** En-tête de section (DESIGN_SYSTEM §7.4) : sur-titre « // CODE », titre H2, accroche optionnelle, action. */
export function SectionHeader({ eyebrow, title, lead, align = "left", tone = "cyan", id, action }: Props) {
  return (
    <div className={cn("mb-10 flex flex-wrap items-end gap-x-8 gap-y-4", align === "center" ? "justify-center text-center" : "justify-between")}>
      <div className={cn(align === "center" && "flex flex-col items-center")}>
        <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
        <h2 id={id} className="text-h2 font-black">
          {title}
        </h2>
        {lead && <p className="mt-4 max-w-prose text-lead text-ink-soft">{lead}</p>}
      </div>
      {action}
    </div>
  );
}

/** Sur-titre « // CODE » (DESIGN_SYSTEM §3.2). */
export function Eyebrow({ tone = "cyan", children }: { tone?: Tone; children: ReactNode }) {
  return <p className={cn("mb-3 font-display text-eyebrow font-bold uppercase", TONE[tone])}>// {children}</p>;
}

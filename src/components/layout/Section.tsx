import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

type Props = {
  tone?: "void" | "abyss";
  grid?: boolean;
  id?: string;
  labelledBy?: string;
  className?: string;
  children: ReactNode;
};

/** Conteneur de section : marges, largeur max, fond alterné `void` / `abyss` (DESIGN_SYSTEM §7.4). */
export function Section({ tone = "void", grid = false, id, labelledBy, className, children }: Props) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("relative px-gutter py-section", tone === "abyss" ? "bg-abyss" : "bg-void", grid && "bg-grid", className)}
    >
      <div className="relative mx-auto max-w-site">{children}</div>
    </section>
  );
}

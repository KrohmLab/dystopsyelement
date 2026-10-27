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

/** Conteneur de section : marges, largeur max, fond alterné transparent / voilé (DESIGN_SYSTEM §7.4). */
export function Section({ tone = "void", grid = false, id, labelledBy, className, children }: Props) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "relative px-gutter py-section",
        // Le fond vivant du site (SiteBackdrop) transparaît : « void » laisse tout voir, « abyss » voile légèrement.
        tone === "abyss" && "section-veil bg-abyss/55",
        grid && "bg-grid",
        className,
      )}
    >
      <div className="relative mx-auto max-w-site">{children}</div>
    </section>
  );
}

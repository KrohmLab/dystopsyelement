import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

type Props = {
  tone?: "void" | "abyss";
  grid?: boolean;
  id?: string;
  labelledBy?: string;
  /** Ambiance du sol quadrillé global quand la section est au centre de l'écran (SiteBackdrop). */
  floor?: "hero" | "hero-lilac" | "pink" | "lilac" | "peach" | "calm" | "horizon" | "off";
  /** Décor discret derrière le contenu (motif flottant), coupé aux bords de la section ; masqué sur mobile. */
  decor?: ReactNode;
  className?: string;
  children: ReactNode;
};

/** Conteneur de section : marges, largeur max, fond alterné transparent / voilé (DESIGN_SYSTEM §7.4). */
export function Section({ tone = "void", grid = false, id, labelledBy, floor, decor, className, children }: Props) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-floor={floor}
      className={cn(
        "relative px-gutter py-section",
        // Le fond vivant du site (SiteBackdrop) transparaît : « void » laisse tout voir, « abyss » voile légèrement.
        tone === "abyss" && "section-veil bg-abyss/40",
        grid && "bg-grid",
        className,
      )}
    >
      {decor && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block">
          {decor}
        </div>
      )}
      <div className="relative z-10 mx-auto max-w-site">{children}</div>
    </section>
  );
}

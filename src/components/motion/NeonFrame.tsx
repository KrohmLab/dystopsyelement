import type { CSSProperties } from "react";
import { cn } from "../../lib/cn";

// Équerres aux quatre coins + filets haut et bas, en coordonnées 0–100 étirées sur le conteneur.
const CORNERS = ["M0 12V0h8", "M92 0h8v12", "M100 88v12h-8", "M8 100H0V88"];
const RAILS = ["M14 0h30", "M56 100h30"];

/**
 * Cadre néon décoratif qui se trace à l'arrivée puis respire (DESIGN_SYSTEM §7.17), en CSS pur :
 * l'animation démarre sans attendre JavaScript. Styles dans theme.css.
 */
export function NeonFrame({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className={cn("neon-frame pointer-events-none", className)}>
      {CORNERS.map((d, i) => (
        <path key={d} d={d} pathLength={1} className="neon-frame__corner" style={{ "--delay": `${i * 120}ms` } as CSSProperties} />
      ))}
      {RAILS.map((d, i) => (
        <path key={d} d={d} pathLength={1} className="neon-frame__rail" style={{ "--delay": `${400 + i * 150}ms` } as CSSProperties} />
      ))}
    </svg>
  );
}

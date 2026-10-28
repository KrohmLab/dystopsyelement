import type { CSSProperties, ReactNode } from "react";
import { cn } from "../../lib/cn";

// Motifs techniques de la v1 (FloatingPattern) : cible, hexagone, circuit, code-barres. Tracés en currentColor.
const SHAPES: Record<1 | 2 | 3 | 4, ReactNode> = {
  1: (
    <g fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="50" cy="50" r="40" strokeDasharray="10 5 2 5" />
      <circle cx="50" cy="50" r="30" strokeDasharray="5 20" strokeWidth="4" />
      <path d="M50 0v20M50 80v20M0 50h20M80 50h20" />
      <rect x="45" y="45" width="10" height="10" fill="currentColor" />
    </g>
  ),
  2: (
    <g fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" strokeDasharray="10 5" />
      <polygon points="50,25 70,38 70,62 50,75 30,62 30,38" />
      <circle cx="50" cy="50" r="5" fill="currentColor" />
      <path d="M50 10v15M85 30l-15 8M85 70l-15-8M50 90V75M15 70l15-8M15 30l15 8" />
    </g>
  ),
  3: (
    <g fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 90l30-30h20l30-30M10 10l20 20v30l30 30" />
      <g fill="currentColor" stroke="none">
        <circle cx="10" cy="90" r="4" />
        <circle cx="40" cy="60" r="3" />
        <circle cx="60" cy="60" r="3" />
        <circle cx="90" cy="30" r="4" />
        <circle cx="10" cy="10" r="4" />
        <circle cx="30" cy="30" r="3" />
        <circle cx="60" cy="90" r="4" />
      </g>
      <rect x="70" y="70" width="20" height="20" strokeDasharray="4 2" />
      <rect x="75" y="75" width="10" height="10" fill="currentColor" opacity="0.5" />
    </g>
  ),
  4: (
    <g fill="currentColor">
      <path d="M10 10h5v20h-5zM20 10h15v20H20zM40 10h2v20h-2zM45 10h8v20h-8zM60 10h20v20H60zM85 10h5v20h-5z" />
      <path d="M10 35h5v25h-5zM20 35h15v25H20zM40 35h2v25h-2zM45 35h8v25h-8zM60 35h20v25H60zM85 35h5v25h-5z" />
      <path d="M10 68h5v7h-5zM20 68h15v7H20zM40 68h2v7h-2zM45 68h8v7h-8zM60 68h20v7H60zM85 68h5v7h-5z" />
      <path d="M10 77h5v13h-5zM20 77h15v13H20zM40 77h2v13h-2zM45 77h8v13h-8zM60 77h20v13H60zM85 77h5v13h-5z" />
    </g>
  ),
};

type Props = {
  variant: 1 | 2 | 3 | 4;
  tone?: "cyan" | "pink";
  /** Taille et position dans la section (classes Tailwind). */
  className?: string;
  /** Décalage de l'animation (s), pour que les motifs d'une même section ne bougent pas ensemble. */
  delay?: number;
};

/**
 * Motif technique flottant (repris de la v1, DESIGN_SYSTEM §7.17) : très discret, il dérive lentement et glitche
 * brièvement toutes les quelques secondes. Décoratif, en CSS pur ; immobile en mouvement réduit.
 */
export function FloatingPattern({ variant, tone = "cyan", className, delay = 0 }: Props) {
  const shape = (
    <svg viewBox="0 0 100 100" className="size-full">
      {SHAPES[variant]}
    </svg>
  );
  return (
    <span
      aria-hidden="true"
      className={cn("floater", tone === "cyan" ? "text-cyan" : "text-pink", className)}
      style={{ "--delay": `${delay}s` } as CSSProperties}
    >
      {shape}
      <span className="floater__glitch">{shape}</span>
    </span>
  );
}

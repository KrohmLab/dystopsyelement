import { cn } from "../../lib/cn";
import { Logo } from "../layout/Logo";

/**
 * Emplacement graphique quand aucun visuel réel n'est fourni (contenu provisoire, SITE_PLAN §0) :
 * trame de grille, lueur cyan et logo en filigrane. Jamais de photo de banque d'images.
 */
export function GraphicFill({ label, className }: { label?: string; className?: string }) {
  return (
    <div aria-hidden="true" className={cn("relative size-full overflow-hidden bg-surface bg-grid", className)}>
      <span className="absolute inset-0 bg-radial-[at_70%_90%] from-cyan-line to-transparent to-70%" />
      <Logo className="absolute top-1/2 left-1/2 size-1/3 -translate-1/2 text-ink opacity-10" />
      {label && (
        <span className="absolute bottom-3 left-4 font-display text-eyebrow font-bold text-ink-faint uppercase">{label}</span>
      )}
    </div>
  );
}

import frame from "../../../assets/frames/cyber-frame.svg?raw";
import { cn } from "../../lib/cn";

/**
 * Grand cadre cyber du hero de la v1 (desktop), converti en SVG unique `currentColor`.
 * Mobile : NeonFrame, plus léger. Décoratif.
 */
export function CyberFrame({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("cyber-frame pointer-events-none block text-cyan [&>svg]:size-full", className)}
      dangerouslySetInnerHTML={{ __html: frame }}
    />
  );
}

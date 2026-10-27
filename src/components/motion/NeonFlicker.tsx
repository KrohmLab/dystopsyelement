import { useRef, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { useInView } from "../../lib/useInView";

/**
 * S'allume comme un néon qui grésille au premier passage dans le viewport (DESIGN_SYSTEM §7.17),
 * puis garde une lueur cyan. Sans JavaScript ou en mouvement réduit : allumé d'emblée.
 */
export function NeonFlicker({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useInView(ref, "flicker");
  return (
    <div ref={ref} data-flicker="" className={cn("neon-flicker", className)}>
      {children}
    </div>
  );
}

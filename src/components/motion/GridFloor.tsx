import { cn } from "../../lib/cn";

/** Grille cyan en perspective qui défile au sol, façon horizon néon (DESIGN_SYSTEM §7.17). Styles dans theme.css. */
export function GridFloor({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("grid-floor pointer-events-none", className)}>
      <div className="grid-floor__plane">
        <div className="grid-floor__lines" />
      </div>
    </div>
  );
}

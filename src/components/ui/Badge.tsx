import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

type Variant = "live" | "info" | "neutral" | "outline";

const TONE: Record<Variant, string> = {
  live: "bg-pink-dim text-pink inset-ring inset-ring-pink-line",
  info: "bg-cyan-dim text-cyan inset-ring inset-ring-cyan-line",
  neutral: "bg-surface text-ink-muted",
  outline: "text-ink-soft inset-ring inset-ring-line-strong",
};

/** Pastille d'état (DESIGN_SYSTEM §7.10). `live` = rose avec point pulsant. */
export function Badge({ variant = "info", className, children }: { variant?: Variant; className?: string; children: ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-2 px-2.5 py-1 font-body text-micro font-bold uppercase chamfer-sm", TONE[variant], className)}>
      {variant === "live" && <span aria-hidden="true" className="size-2 animate-pulse-dot rounded-full bg-pink" />}
      {children}
    </span>
  );
}

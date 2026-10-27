/** Barre de progression de lecture en CSS pur (`animation-timeline`, styles dans theme.css), masquée si non supportée. */
export function ScrollProgress() {
  return (
    <div
      aria-hidden="true"
      className="scroll-progress pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-linear-to-r from-cyan to-pink"
    />
  );
}

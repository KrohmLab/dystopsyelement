/** Lien d'évitement, visible uniquement au clavier (DESIGN_SYSTEM §10). */
export function SkipLink() {
  return (
    <a
      href="#contenu"
      className="sr-only-focusable fixed top-4 left-4 z-50 bg-cyan px-4 py-3 font-display text-label font-bold text-on-accent uppercase chamfer-sm"
    >
      Aller au contenu
    </a>
  );
}

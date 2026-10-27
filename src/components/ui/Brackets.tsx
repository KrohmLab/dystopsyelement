const CORNER =
  "pointer-events-none absolute z-10 size-3 border-cyan/60 transition-all duration-base ease-out-expo group-hover:size-6 group-hover:border-cyan group-focus-visible:size-6 group-focus-visible:border-cyan";

/**
 * Équerres décoratives haut-gauche / bas-droite (DESIGN_SYSTEM §5.2), qui grandissent au survol.
 * À placer dans un parent `relative group` (cartes, hero, portails).
 */
export function Brackets() {
  return (
    <>
      <span aria-hidden="true" className={`${CORNER} -top-px -left-px border-t-2 border-l-2`} />
      <span aria-hidden="true" className={`${CORNER} -right-px -bottom-px border-r-2 border-b-2`} />
    </>
  );
}

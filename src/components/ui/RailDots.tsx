import { useEffect, useState } from "react";
import { cn } from "../../lib/cn";

/**
 * Pagination d'un carrousel mobile `.rail` (DESIGN_SYSTEM §7.19) : un trait par élément, l'actif s'allonge.
 * Le carrousel lui-même est un simple défilement horizontal aimanté en CSS ; ces boutons y sautent directement.
 * Masqué dès md, où le carrousel redevient une grille.
 */
export function RailDots({ target, count, label }: { target: string; count: number; label: string }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const rail = document.getElementById(target);
    if (!rail) return;
    const update = () => {
      const max = rail.scrollWidth - rail.clientWidth;
      setActive(max > 0 ? Math.round((rail.scrollLeft / max) * (count - 1)) : 0);
    };
    update();
    rail.addEventListener("scroll", update, { passive: true });
    return () => rail.removeEventListener("scroll", update);
  }, [target, count]);

  const go = (index: number) => {
    const rail = document.getElementById(target);
    const item = rail?.children[index];
    if (!rail || !(item instanceof HTMLElement)) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rail.scrollTo({ left: item.offsetLeft - parseFloat(getComputedStyle(rail).paddingLeft), behavior: smooth ? "smooth" : "auto" });
  };

  if (count < 2) return null;
  return (
    <div role="group" aria-label={label} className="mt-4 flex justify-center md:hidden">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`${i + 1} sur ${count}`}
          aria-current={i === active || undefined}
          onClick={() => go(i)}
          className="group cursor-pointer p-2"
        >
          <span className={cn("block h-1 transition-all duration-base ease-out-expo", i === active ? "w-6 bg-cyan" : "w-3 bg-line-strong group-hover:bg-ink-muted")} />
        </button>
      ))}
    </div>
  );
}

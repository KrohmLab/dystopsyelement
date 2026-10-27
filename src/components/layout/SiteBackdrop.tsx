import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

/**
 * Fond vivant de tout le site (DESIGN_SYSTEM §5.3) : lueurs cyan / rose qui dérivent, sol quadrillé
 * en perspective fixe en bas de l'écran — il suit le visiteur depuis le hero et se transforme selon la
 * section au centre de l'écran (attribut data-floor : hero, pink, lilac, peach, calm, horizon, off).
 * Spectaculaire dans le hero, puis bas, pâle et immobile (sauf au défilement) sous le contenu.
 * Décoratif, sous le contenu ; styles dans theme.css. Mouvement réduit : immobile, sans transition.
 */
export function SiteBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const backdrop = ref.current;
    if (!backdrop || !("IntersectionObserver" in window)) return;
    const sections = [...document.querySelectorAll<HTMLElement>("[data-floor]")];
    const visible = new Map<HTMLElement, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => visible.set(entry.target as HTMLElement, entry.isIntersecting));
        // La section qui croise la ligne du milieu de l'écran donne l'ambiance ; sinon, ambiance par défaut.
        const current = sections.find((section) => visible.get(section));
        if (current?.dataset.floor) backdrop.dataset.floor = current.dataset.floor;
        else delete backdrop.dataset.floor;
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    sections.forEach((section) => io.observe(section));
    return () => io.disconnect();
  }, [pathname]);

  return (
    <div ref={ref} aria-hidden="true" className="site-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-void">
      <span className="site-backdrop__glow site-backdrop__glow--cyan" />
      <span className="site-backdrop__glow site-backdrop__glow--pink" />
      <span className="site-backdrop__glow site-backdrop__glow--deep" />
      <span className="site-backdrop__vignette" />
      {/* Le sol passe au-dessus du vignettage, sinon le bas de l'écran l'éteint. */}
      <div className="site-backdrop__floor">
        <div className="site-backdrop__plane">
          <div className="site-backdrop__lines" />
          <div className="site-backdrop__lines site-backdrop__lines--run" />
        </div>
        <span className="site-backdrop__horizon" />
      </div>
      <span className="absolute inset-0 bg-scanlines opacity-60" />
    </div>
  );
}

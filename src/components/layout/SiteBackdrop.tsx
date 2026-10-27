import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { useMotionLevel } from "../../lib/useMotionLevel";

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
  const level = useMotionLevel();

  // PC à la souris : les lueurs du fond (visibles à travers les sections) glissent avec le curseur,
  // et un halo cyan → rose le suit. Mouvement lissé ; coupé sur tactile et en mouvement réduit.
  useEffect(() => {
    const backdrop = ref.current;
    if (!backdrop || level !== "full") return;
    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let frame = 0;
    const tick = () => {
      x += (targetX - x) * 0.07;
      y += (targetY - y) * 0.07;
      backdrop.style.setProperty("--mx", x.toFixed(3));
      backdrop.style.setProperty("--my", y.toFixed(3));
      frame = Math.abs(targetX - x) + Math.abs(targetY - y) > 0.002 ? requestAnimationFrame(tick) : 0;
    };
    const move = (event: PointerEvent) => {
      targetX = (event.clientX / window.innerWidth) * 2 - 1;
      targetY = (event.clientY / window.innerHeight) * 2 - 1;
      backdrop.dataset.pointer = "";
      if (!frame) frame = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(frame);
      delete backdrop.dataset.pointer;
    };
  }, [level]);

  useEffect(() => {
    const backdrop = ref.current;
    if (!backdrop) return;
    // L'ambiance vient de l'élément [data-floor] situé au milieu de l'écran. Lu à chaque image de défilement
    // plutôt qu'avec un IntersectionObserver : après une navigation, l'ancienne page est encore dans le DOM
    // quand cet effet tourne et le défilement revient en haut ensuite, l'observateur ratait le nouveau hero.
    let frame = 0;
    const update = () => {
      frame = 0;
      // En haut de page, l'ambiance du hero (les heros de pages secondaires font moins d'un demi-écran).
      const top = window.scrollY < 40 ? document.querySelector<HTMLElement>("main [data-floor]")?.dataset.floor : undefined;
      const middle = top ? [] : document.elementsFromPoint(window.innerWidth / 2, window.innerHeight / 2);
      const floor = top ?? middle.map((el) => el.closest<HTMLElement>("[data-floor]")?.dataset.floor).find(Boolean);
      // Rien sous le milieu (menu ouvert : la page est inerte) : on garde l'ambiance en cours.
      if (floor) backdrop.dataset.floor = floor;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    // Deuxième lecture une fois la nouvelle page peinte et le défilement restauré.
    const settle = window.setTimeout(schedule, 120);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(settle);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);

  return (
    <div ref={ref} aria-hidden="true" className="site-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-void">
      <span className="site-backdrop__glow site-backdrop__glow--cyan" />
      <span className="site-backdrop__glow site-backdrop__glow--pink" />
      <span className="site-backdrop__glow site-backdrop__glow--deep" />
      <span className="site-backdrop__cursor" />
      <span className="site-backdrop__vignette" />
      {/* Le sol passe au-dessus du vignettage, sinon le bas de l'écran l'éteint. */}
      <div className="site-backdrop__floor">
        {/* Enveloppe de la plongée de fin du hero hologramme (ambiance « holo », animation liée au défilement). */}
        <div className="site-backdrop__dive">
          <div className="site-backdrop__plane">
            <div className="site-backdrop__lines" />
            <div className="site-backdrop__lines site-backdrop__lines--run" />
            <div className="site-backdrop__pink" />
          </div>
          <span className="site-backdrop__floor-glow" />
        </div>
        <span className="site-backdrop__horizon" />
      </div>
      <span className="absolute inset-0 bg-scanlines opacity-60" />
    </div>
  );
}

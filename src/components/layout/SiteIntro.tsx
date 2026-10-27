import { useEffect } from "react";
import { Logo } from "./Logo";

/** Durée de l'intro avant l'apparition du hero (ms), synchronisée avec --intro-offset dans theme.css. */
export const INTRO_MS = 1500;

/**
 * Script inline de <head> : l'intro ne joue qu'à la première page vue de la session, et jamais en
 * mouvement réduit. Pose html[data-intro="on"] (joue) ou "off" ; sans JavaScript, pas d'intro.
 */
export const INTRO_SCRIPT = `try{var k="dystopsy:intro",d=document.documentElement;if(sessionStorage.getItem(k)||matchMedia("(prefers-reduced-motion: reduce)").matches){d.dataset.intro="off"}else{sessionStorage.setItem(k,"1");d.dataset.intro="on"}}catch(e){}`;

/**
 * Intro de lancement (DESIGN_SYSTEM §6.2) : horizon qui se trace, sol quadrillé qui se lève, logo néon,
 * puis le rideau s'ouvre sur la page. En CSS pur (styles dans theme.css), décoratif, ne bloque aucun clic.
 */
export function SiteIntro() {
  // Fin de l'intro : les pages visitées ensuite ne décalent plus leurs animations.
  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.intro !== "on") return;
    const timer = window.setTimeout(() => (root.dataset.intro = "done"), INTRO_MS + 400);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div aria-hidden="true" className="site-intro">
      <div className="site-intro__floor">
        <div className="site-intro__lines" />
      </div>
      <span className="site-intro__horizon" />
      <Logo className="site-intro__logo size-24 text-cyan" />
    </div>
  );
}

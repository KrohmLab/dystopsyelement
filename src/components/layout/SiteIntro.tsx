import { useEffect } from "react";
import { site } from "../../site";
import { Logo } from "./Logo";

/** Durée de l'intro avant l'entrée du hero (ms), synchronisée avec --intro-offset dans theme.css. */
export const INTRO_MS = 3100;

/**
 * Script inline de <head> : l'intro ne joue qu'à la première page vue de la session, et jamais en
 * mouvement réduit. Pose html[data-intro="on"] (joue) ou "off" ; sans JavaScript, pas d'intro.
 */
export const INTRO_SCRIPT = `try{var k="dystopsy:intro",d=document.documentElement;if(sessionStorage.getItem(k)||matchMedia("(prefers-reduced-motion: reduce)").matches){d.dataset.intro="off"}else{sessionStorage.setItem(k,"1");d.dataset.intro="on"}}catch(e){}`;

/**
 * Intro de lancement (DESIGN_SYSTEM §6.2, docs/hero-hologramme §4) : ligne cathodique qui s'allume et flashe,
 * logo en scintillement néon, « {site.name} présente » qui se resserre, trois ondes de choc, puis l'écran s'ouvre
 * en deux sur la page. En CSS pur (styles dans theme.css), décoratif, ne bloque aucun clic.
 */
export function SiteIntro() {
  // Fin de l'intro : les pages visitées ensuite ne décalent plus leurs animations.
  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.intro !== "on") return;
    const timer = window.setTimeout(() => (root.dataset.intro = "done"), INTRO_MS + 700);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div aria-hidden="true" className="site-intro">
      <span className="site-intro__half site-intro__half--top" />
      <span className="site-intro__half site-intro__half--bottom" />
      <span className="site-intro__crt" />
      <Logo className="site-intro__logo text-ink" />
      <p className="site-intro__text">{site.name} présente</p>
      <span className="site-intro__burst" />
      <span className="site-intro__burst site-intro__burst--pink" />
      <span className="site-intro__burst" />
    </div>
  );
}

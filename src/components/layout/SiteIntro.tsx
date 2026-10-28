import { useEffect } from "react";
import { site } from "../../site";
import { Logo } from "./Logo";

/** Durée de l'intro avant l'entrée du hero (ms), synchronisée avec --intro-offset dans theme.css. */
export const INTRO_MS = 3100;

/** Durée de l'entrée du hero après la fin de l'intro (ms) : allumage du radar, glitch du texte (theme.css). */
const ENTRANCE_MS = 1200;

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
  // Fin de l'intro puis de l'entrée du hero : les pages visitées ensuite ne décalent plus leurs animations.
  // Calée sur l'animation CSS de l'intro elle-même (et non sur un minuteur lancé au chargement du script) :
  // l'horloge des animations ne part qu'au premier affichage, parfois plusieurs secondes plus tard sur mobile.
  // Remettre --intro-offset à 0 trop tôt ferait sauter l'entrée du hero à son état final.
  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.intro !== "on") return;
    let timer = 0;
    let cancelled = false;
    const finish = () => {
      if (!cancelled) root.dataset.intro = "done";
    };
    const intro = document.querySelector(".site-intro");
    const gone = intro?.getAnimations().find((a) => a instanceof CSSAnimation && a.animationName === "intro-gone");
    if (gone) {
      gone.finished.then(() => (timer = window.setTimeout(finish, ENTRANCE_MS))).catch(finish);
    } else {
      finish();
    }
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
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

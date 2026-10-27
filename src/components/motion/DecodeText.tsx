import { useEffect, useState } from "react";

const GLYPHS = "!<>-_/\\[]{}=+*^?#01ΛΞΣ";

type Props = {
  text: string;
  /** Durée du décodage, en ms. */
  duration?: number;
  delay?: number;
};

/**
 * Texte qui se décode lettre par lettre à l'arrivée (DESIGN_SYSTEM §7.17). Le vrai texte est rendu au
 * pré-rendu et réserve la place (pas de décalage de mise en page) ; les lecteurs d'écran le lisent tel quel.
 * Mouvement réduit : texte final directement.
 */
export function DecodeText({ text, duration = 900, delay = 0 }: Props) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = performance.now() + delay;
    let frame = requestAnimationFrame(function tick(now) {
      const progress = Math.min(1, Math.max(0, (now - start) / duration));
      const revealed = Math.floor(progress * text.length);
      setDisplay(
        [...text]
          .map((char, i) => (i < revealed || char === " " ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join(""),
      );
      if (progress < 1) frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [text, duration, delay]);

  return (
    <span className="relative inline-block">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="invisible">
        {text}
      </span>
      <span aria-hidden="true" className="absolute inset-0">
        {display}
      </span>
    </span>
  );
}

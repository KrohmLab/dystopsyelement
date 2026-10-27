import { useEffect, useRef, type ReactNode } from "react";
import { useMotionLevel } from "../../lib/useMotionLevel";

type Props = {
  /** Décalage maximal au défilement, en px (moitié sur tablette et mobile). */
  speed?: number;
  /** Décalage maximal à la souris, en px (desktop uniquement). */
  mouse?: number;
  className?: string;
  children: ReactNode;
};

/**
 * Calque qui se décale au défilement et suit légèrement la souris (DESIGN_SYSTEM §6.2).
 * JavaScript natif (sans `motion`, pour garder l'accueil sous son budget) : la transformation est écrite
 * directement sur l'élément, une fois par image, la souris étant lissée. Mouvement réduit et pré-rendu : immobile.
 */
export function Parallax({ speed = 60, mouse = 12, className, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const level = useMotionLevel();

  useEffect(() => {
    const layer = ref.current;
    // Le calque se mesure sur son parent, que la transformation ne déplace pas.
    const frameOf = layer?.parentElement;
    if (!layer || !frameOf) return;
    if (level === "reduced") {
      layer.style.transform = "";
      return;
    }
    const amplitude = level === "full" ? speed : speed / 2;
    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let frame = 0;

    const render = () => {
      frame = 0;
      x += (targetX - x) * 0.08;
      y += (targetY - y) * 0.08;
      const rect = frameOf.getBoundingClientRect();
      // 0 quand le haut du parent entre par le bas de l'écran, 1 quand son bas sort par le haut.
      const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
      layer.style.transform = `translate3d(${x}px, ${(progress * 2 - 1) * amplitude + y}px, 0)`;
      if (Math.abs(targetX - x) + Math.abs(targetY - y) > 0.1) frame = requestAnimationFrame(render);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };
    const onMove = (event: PointerEvent) => {
      targetX = (event.clientX / window.innerWidth - 0.5) * 2 * mouse;
      targetY = (event.clientY / window.innerHeight - 0.5) * 2 * mouse;
      schedule();
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const followMouse = level === "full" && mouse !== 0;
    if (followMouse) window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pointermove", onMove);
    };
  }, [level, speed, mouse]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

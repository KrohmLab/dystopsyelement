import { useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
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

const SPRING = { stiffness: 60, damping: 20, mass: 0.6 };

/**
 * Calque qui se décale au défilement et suit légèrement la souris (DESIGN_SYSTEM §6.2).
 * Seuls les hooks de `motion` sont utilisés (pas de composant `motion.div`) pour garder le JavaScript léger :
 * la transformation est écrite directement sur l'élément. Mouvement réduit et pré-rendu : immobile.
 */
export function Parallax({ speed = 60, mouse = 12, className, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const level = useMotionLevel();
  const amplitude = level === "reduced" ? 0 : level === "full" ? speed : speed / 2;

  // Le niveau passe de « reduced » (pré-rendu) au niveau réel après l'hydratation : amplitude lue via une ref.
  const amplitudeRef = useRef(amplitude);
  useEffect(() => {
    amplitudeRef.current = amplitude;
  }, [amplitude]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scrollY = useTransform(scrollYProgress, (progress) => (progress * 2 - 1) * amplitudeRef.current);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, SPRING);
  const y = useSpring(pointerY, SPRING);

  const apply = () => {
    if (ref.current) ref.current.style.transform = `translate3d(${x.get()}px, ${scrollY.get() + y.get()}px, 0)`;
  };
  useMotionValueEvent(scrollY, "change", apply);
  useMotionValueEvent(x, "change", apply);
  useMotionValueEvent(y, "change", apply);

  useEffect(() => {
    if (level !== "full" || mouse === 0) {
      pointerX.set(0);
      pointerY.set(0);
      return;
    }
    const onMove = (event: PointerEvent) => {
      pointerX.set((event.clientX / window.innerWidth - 0.5) * 2 * mouse);
      pointerY.set((event.clientY / window.innerHeight - 0.5) * 2 * mouse);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [level, mouse, pointerX, pointerY]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

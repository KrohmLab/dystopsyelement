import { useEffect, useRef, useState } from "react";

/**
 * Chiffre qui défile jusqu'à sa valeur au premier passage dans le viewport (« 48 h », « 500 »…).
 * Le texte final est rendu au pré-rendu ; mouvement réduit : affiché directement.
 */
export function CountUp({ value, duration = 1400 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const match = /^(\d+)(.*)$/.exec(value);
  const target = match ? Number(match[1]) : null;
  const suffix = match?.[2] ?? "";
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || target === null || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 4);
        setDisplay(`${Math.round(target * eased)}${suffix}`);
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      setDisplay(`0${suffix}`);
      frame = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target, suffix, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  );
}

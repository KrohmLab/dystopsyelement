import { useEffect, type RefObject } from "react";

/**
 * Pose `data-{attribute}="in"` sur l'élément à son premier passage dans le viewport (une seule fois).
 * Sans IntersectionObserver, l'état final est appliqué directement.
 */
export function useInView(ref: RefObject<HTMLElement | null>, attribute: string, rootMargin = "0px 0px -10% 0px") {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.dataset[attribute] = "in";
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.dataset[attribute] = "in";
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, attribute, rootMargin]);
}

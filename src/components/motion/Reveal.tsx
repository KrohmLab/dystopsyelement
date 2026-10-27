import { useRef, type ComponentPropsWithoutRef, type CSSProperties, type ElementType } from "react";
import { useInView } from "../../lib/useInView";

type Props<T extends ElementType> = { as?: T; delay?: number } & ComponentPropsWithoutRef<T>;

/**
 * Fondu + montée de 16 px au premier passage dans le viewport (DESIGN_SYSTEM §6), par transition CSS.
 * `delay` (ms) pour les cascades. Sans JavaScript ou en mouvement réduit, le contenu est visible d'emblée.
 */
export function Reveal<T extends ElementType = "div">({ as, delay = 0, style, ...rest }: Props<T>) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);
  useInView(ref, "reveal");
  return <Tag ref={ref} data-reveal="" style={{ ...style, "--reveal-delay": `${delay}ms` } as CSSProperties} {...rest} />;
}

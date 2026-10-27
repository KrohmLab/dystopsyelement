import avif960 from "../../../assets/patterns/pattern-01-960.avif";
import avif1920 from "../../../assets/patterns/pattern-01-1920.avif";
import webp960 from "../../../assets/patterns/pattern-01-960.webp";
import webp1920 from "../../../assets/patterns/pattern-01-1920.webp";
import { cn } from "../../lib/cn";

const SIZES = "(min-width: 80rem) 80rem, 100vw";

/** Séparateur décoratif : motif de circuit de la v1, statique, à 40 % d'opacité (DESIGN_SYSTEM §5.3). */
export function Divider({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("flex justify-center px-gutter opacity-40", className)}>
      <picture className="w-full max-w-site">
        <source type="image/avif" srcSet={`${avif960} 960w, ${avif1920} 1920w`} sizes={SIZES} />
        <img
          src={webp960}
          srcSet={`${webp960} 960w, ${webp1920} 1920w`}
          sizes={SIZES}
          width={1920}
          height={179}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-auto w-full"
        />
      </picture>
    </div>
  );
}

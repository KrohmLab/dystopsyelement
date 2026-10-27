import { cn } from "../../lib/cn";
import { getImage } from "../../lib/images";
import { GraphicFill } from "./GraphicFill";

type Props = {
  /** Clé de assets/images.json ; sans visuel, emplacement graphique (contenu provisoire). */
  image: string | null | undefined;
  /** Texte alternatif ; vide pour un visuel décoratif. */
  alt: string;
  sizes: string;
  /** Visuel principal de la page (LCP) : chargé en priorité. */
  priority?: boolean;
  className?: string;
  /** Libellé discret de l'emplacement graphique (« Visuel Artiste 1 »). */
  fallbackLabel?: string;
};

/** Visuel réel en AVIF + WebP aux bonnes largeurs (DESIGN_SYSTEM §9), ou emplacement graphique. */
export function ResponsiveImage({ image, alt, sizes, priority = false, className, fallbackLabel }: Props) {
  const sources = getImage(image);
  if (!sources) return <GraphicFill label={fallbackLabel} className={className} />;
  return (
    <picture>
      <source type="image/avif" srcSet={sources.avif} sizes={sizes} />
      <img
        src={sources.src}
        srcSet={sources.webp}
        sizes={sizes}
        width={sources.width}
        height={sources.height}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        className={cn("size-full object-cover", className)}
      />
    </picture>
  );
}

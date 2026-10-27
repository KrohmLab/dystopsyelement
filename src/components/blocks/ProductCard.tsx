import type { Product } from "../../content/schemas";
import { ExternalIcon } from "../icons";
import { Badge } from "../ui/Badge";
import { Brackets } from "../ui/Brackets";
import { ResponsiveImage } from "../ui/ResponsiveImage";

/** Produit de la vitrine (DESIGN_SYSTEM §7.7) : toute la carte mène à l'annonce Vinted, dans un nouvel onglet. */
export function ProductCard({ product }: { product: Product }) {
  return (
    <a
      href={product.vintedUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col bg-surface no-underline transition-colors duration-base hover:bg-surface-raised"
    >
      <Brackets />
      <div className="relative aspect-square overflow-hidden chamfer-md">
        <ResponsiveImage
          image={product.image}
          alt=""
          sizes="(min-width: 64rem) 18rem, 50vw"
          fallbackLabel={product.name}
          className="opacity-70 grayscale transition duration-slow ease-out-expo group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
        />
        <span className="absolute top-3 left-3">
          <Badge variant="neutral">{product.category}</Badge>
        </span>
      </div>
      <span className="flex items-end justify-between gap-3 p-4">
        <span className="flex flex-col gap-1">
          <span className="font-display text-h3 font-bold text-ink uppercase transition-colors duration-fast group-hover:text-cyan md:max-lg:text-label-lg">{product.name}</span>
          <span className="font-display text-label font-bold text-cyan text-glow-cyan">{product.price}</span>
        </span>
        <ExternalIcon size={20} className="shrink-0 text-pink" />
      </span>
      <span className="sr-only">Voir sur Vinted (nouvel onglet)</span>
    </a>
  );
}

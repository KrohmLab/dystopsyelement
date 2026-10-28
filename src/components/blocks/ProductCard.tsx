import { useState } from "react";
import type { Product } from "../../content/schemas";
import { cn } from "../../lib/cn";
import { site } from "../../site";
import { Badge } from "../ui/Badge";
import { Brackets } from "../ui/Brackets";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { ResponsiveImage } from "../ui/ResponsiveImage";
import { Segmented } from "../ui/Segmented";

type Cut = Product["variants"][number]["cut"];
type Size = Product["variants"][number]["size"];

const SIZE_ORDER: Size[] = ["XS", "S", "M", "L", "XL", "XXL"];
const CUT_LABEL: Record<Cut, string> = { H: "Coupe homme", F: "Coupe femme" };
const bySize = (a: Size, b: Size) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b);

/** Tailles disponibles d'un produit, toutes coupes confondues, dans l'ordre XS → XXL. */
export function availableSizes(product: Product): Size[] {
  return [...new Set(product.variants.map((v) => v.size))].sort(bySize);
}

/**
 * Produit de la vitrine (DESIGN_SYSTEM §7.7) : une carte par produit, quelle que soit la taille. Chaque pièce est
 * vendue séparément sur Vinted (une annonce par coupe et par taille) : la carte ouvre un choix coupe + taille,
 * puis renvoie vers l'annonce exacte. Sans annonce disponible, le produit est « épuisé » (lien vers la boutique).
 */
export function ProductCard({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const sizes = availableSizes(product);
  const soldOut = product.variants.length === 0;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative flex w-full cursor-pointer flex-col bg-surface text-left transition-colors duration-base hover:bg-surface-raised"
      >
        <Brackets />
        <span className="relative block aspect-3/4 overflow-hidden chamfer-md">
          <ResponsiveImage
            image={product.image}
            alt=""
            sizes="(min-width: 64rem) 18rem, 50vw"
            fallbackLabel={product.name}
            className="transition duration-slow ease-out-expo group-hover:scale-105"
          />
          {product.imageAlt && (
            <span className="absolute inset-0 opacity-0 transition-opacity duration-slow group-hover:opacity-100">
              <ResponsiveImage image={product.imageAlt} alt="" sizes="(min-width: 64rem) 18rem, 50vw" />
            </span>
          )}
          <span className="absolute top-3 left-3">
            <Badge variant="neutral">{product.category}</Badge>
          </span>
        </span>
        <span className="flex flex-col gap-2 p-4">
          <span className="font-display text-h3 font-bold text-ink uppercase transition-colors duration-fast group-hover:text-cyan md:max-lg:text-label-lg">
            {product.name}
          </span>
          <span className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-display text-label font-bold text-cyan text-glow-cyan">{product.price}</span>
            <span className="text-micro font-semibold text-ink-muted uppercase">{soldOut ? "Épuisé" : sizes.join(" · ")}</span>
          </span>
        </span>
      </button>

      <Modal open={open} onClose={() => setOpen(false)} label={product.name}>
        <ProductPicker product={product} />
      </Modal>
    </>
  );
}

/** Contenu de la fenêtre produit : visuels, description, choix de la coupe et de la taille, lien Vinted. */
function ProductPicker({ product }: { product: Product }) {
  const cuts = (["H", "F"] as Cut[]).filter((cut) => product.variants.some((v) => v.cut === cut));
  const [cut, setCut] = useState<Cut | undefined>(cuts[0]);
  const sizes = product.variants.filter((v) => v.cut === cut).map((v) => v.size).sort(bySize);
  const [size, setSize] = useState<Size | undefined>(undefined);
  const chosenSize = size && sizes.includes(size) ? size : undefined;
  const variant = product.variants.find((v) => v.cut === cut && v.size === chosenSize);
  const [view, setView] = useState<"image" | "imageAlt">("image");

  return (
    <div className="grid md:grid-cols-[2fr_3fr]">
      <div className="relative bg-void">
        <div className="aspect-3/4 md:aspect-auto md:h-full">
          <ResponsiveImage image={product[view] ?? product.image} alt="" sizes="(min-width: 48rem) 20rem, 100vw" fallbackLabel={product.name} />
        </div>
        {product.imageAlt && (
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
            {(["image", "imageAlt"] as const).map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={view === key}
                onClick={() => setView(key)}
                className={cn(
                  "min-h-9 cursor-pointer px-3 font-display text-label-sm font-bold uppercase chamfer-sm",
                  view === key ? "bg-cyan text-on-accent" : "bg-void/80 text-ink-soft hover:text-ink",
                )}
              >
                {key === "image" ? "Dos" : "Face"}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6 p-6 pt-14 md:p-8 md:pt-14">
        <div>
          <p className="mb-2 font-display text-eyebrow font-bold text-cyan uppercase">// {product.category}</p>
          <h2 className="text-h2 font-black">{product.name}</h2>
          <p className="mt-2 font-display text-h3 font-bold text-cyan text-glow-cyan">{product.price}</p>
          {product.description && <p className="mt-4 text-body text-ink-soft">{product.description}</p>}
        </div>

        {cuts.length === 0 ? (
          <p className="text-body text-ink-muted">Toutes les pièces ont trouvé preneur. Retrouvez la boutique sur Vinted.</p>
        ) : (
          <>
            {cuts.length > 1 && (
              <Segmented
                label="Coupe (oversize unisexe)"
                options={cuts.map((value) => ({ value, label: CUT_LABEL[value] }))}
                value={cut ?? cuts[0] ?? "H"}
                onChange={(value) => setCut(value)}
              />
            )}
            <div className="flex flex-col gap-1.5">
              <span id={`${product.slug}-taille`} className="font-display text-eyebrow font-bold text-ink-muted uppercase">
                Taille disponible
              </span>
              <div role="group" aria-labelledby={`${product.slug}-taille`} className="flex flex-wrap gap-2">
                {sizes.map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={chosenSize === value}
                    onClick={() => setSize(value)}
                    className={cn(
                      "grid min-h-11 min-w-14 cursor-pointer place-items-center px-3 font-display text-label font-bold uppercase transition-colors duration-fast chamfer-sm",
                      chosenSize === value ? "bg-cyan text-on-accent" : "bg-void inset-ring inset-ring-line-strong text-ink hover:inset-ring-cyan",
                    )}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="mt-auto">
          {variant ? (
            <Button fullWidth href={variant.vintedUrl}>
              Acheter sur Vinted · {variant.size}
            </Button>
          ) : cuts.length > 0 ? (
            <p aria-live="polite" className="text-small text-ink-muted">
              Choisissez une taille : chaque pièce est vendue séparément sur Vinted.
            </p>
          ) : (
            site.shopUrl && (
              <Button variant="secondary" fullWidth href={site.shopUrl}>
                Voir la boutique Vinted
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

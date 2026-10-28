import { useState } from "react";
import { PageHero } from "../components/blocks/PageHero";
import { availableSizes, ProductCard } from "../components/blocks/ProductCard";
import { Section } from "../components/layout/Section";
import { Button } from "../components/ui/Button";
import { Segmented } from "../components/ui/Segmented";
import { SelectField } from "../components/ui/SelectField";
import { products, site } from "../content/load.server";
import { pageMeta } from "../lib/seo";
import type { Route } from "./+types/shop";

export function loader() {
  return { products, shopUrl: site.shopUrl };
}

export const meta: Route.MetaFunction = () =>
  pageMeta({ title: "Shop", description: "Le merch officiel Dystopsy Element et Nexen Festival, en vente sur Vinted.", path: "/shop", image: "/og/shop.jpg" });

/**
 * Shop vitrine (SITE_PLAN §7) : une carte par produit ; filtres par type et par taille disponible, sans
 * rechargement. Chaque produit ouvre le choix coupe + taille, qui renvoie vers l'annonce Vinted correspondante.
 */
export default function Shop({ loaderData }: Route.ComponentProps) {
  const { products, shopUrl } = loaderData;
  const categories = ["Tous", ...new Set(products.map((p) => p.category))];
  const sizes = [...new Set(products.flatMap(availableSizes))];
  const [category, setCategory] = useState("Tous");
  const [size, setSize] = useState("");
  const visible = products.filter((p) => (category === "Tous" || p.category === category) && (!size || availableSizes(p).some((s) => s === size)));

  return (
    <>
      <PageHero eyebrow="Supportez l'asso" title="Shop" lead="Le merch officiel du Nexen Festival, en vente sur Vinted : chaque pièce soutient l'association.">
        {shopUrl && <Button href={shopUrl}>Voir le shop Vinted</Button>}
      </PageHero>
      <Section labelledBy="produits-titre" floor="pink">
        <h2 id="produits-titre" className="sr-only">
          Produits
        </h2>
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end">
          {categories.length > 2 && <Segmented label="Type" options={categories.map((value) => ({ value, label: value }))} value={category} onChange={setCategory} />}
          {sizes.length > 1 && (
            <SelectField
              label="Taille"
              options={[{ value: "", label: "Toutes les tailles" }, ...sizes.map((value) => ({ value, label: value }))]}
              value={size}
              onChange={setSize}
              className="sm:w-64 sm:shrink-0"
            />
          )}
        </div>
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4" aria-live="polite">
          {visible.map((product) => (
            <li key={product.slug} className="animate-[fade-up_var(--duration-slow)_var(--ease-out-expo)_both]">
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
        {visible.length === 0 && <p className="text-body text-ink-muted">Aucun produit dans cette taille pour le moment.</p>}
      </Section>
    </>
  );
}

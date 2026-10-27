import { useState } from "react";
import { PageHero } from "../components/blocks/PageHero";
import { ProductCard } from "../components/blocks/ProductCard";
import { Section } from "../components/layout/Section";
import { Button } from "../components/ui/Button";
import { FilterBar } from "../components/ui/FilterBar";
import { products, site } from "../content/load.server";
import { pageMeta } from "../lib/seo";
import type { Route } from "./+types/shop";

const CATEGORIES = ["Tous", "T-shirts", "Pulls", "Autres"] as const;
type Category = (typeof CATEGORIES)[number];

export function loader() {
  return { products, shopUrl: site.shopUrl };
}

export const meta: Route.MetaFunction = () =>
  pageMeta({ title: "Shop", description: "La boutique de Dystopsy Element, en vente sur Vinted.", path: "/shop" });

/** Boutique vitrine (SITE_PLAN §7) : filtres sans rechargement, chaque produit renvoie vers son annonce Vinted. */
export default function Shop({ loaderData }: Route.ComponentProps) {
  const { products, shopUrl } = loaderData;
  const [category, setCategory] = useState<Category>("Tous");
  const visible = category === "Tous" ? products : products.filter((p) => p.category === category);

  return (
    <>
      <PageHero eyebrow="Supportez l'asso" title="Black market" lead="Texte provisoire : une phrase sur la boutique, en vente sur Vinted.">
        {shopUrl && <Button href={shopUrl}>Voir la boutique Vinted</Button>}
      </PageHero>
      <Section labelledBy="produits-titre" floor="pink">
        <h2 id="produits-titre" className="sr-only">
          Produits
        </h2>
        <FilterBar label="Filtrer par catégorie" options={CATEGORIES} value={category} onChange={setCategory} className="mb-12" />
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4" aria-live="polite">
          {visible.map((product) => (
            <li key={product.slug} className="animate-[fade-up_var(--duration-slow)_var(--ease-out-expo)_both]">
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}

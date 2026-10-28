import { site } from "../site";

// Balises de page communes : titre, description, URL canonique, Open Graph et Twitter.
// L'origine vient de content/site.json → url (adresse workers.dev tant que le domaine n'est pas choisi).
type Options = {
  /** Titre de la page, sans le nom du site. Absent sur l'accueil. */
  title?: string;
  description?: string | null;
  /** Chemin de la page, ex. « /agenda ». */
  path: string;
  /** Chemin de l'image de partage (1200×630, public/og/) ; par défaut celle du site. */
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  noindex?: boolean;
  /** Données structurées schema.org (JSON-LD) de la page. */
  jsonLd?: Record<string, unknown>;
};

/** Image de partage par défaut (scripts/og-images.mjs) : pages sans image propre. */
const DEFAULT_IMAGE = "/og/site.jpg";

export function pageMeta({ title, description = site.description, path, image = DEFAULT_IMAGE, imageAlt, type = "website", noindex, jsonLd }: Options) {
  const fullTitle = title ? `${title} · ${site.name}` : site.name;
  const url = `${site.url}${path}`;
  const img = `${site.url}${image}`;
  return [
    { title: fullTitle },
    ...(description ? [{ name: "description", content: description }] : []),
    { tagName: "link", rel: "canonical", href: url },
    ...(noindex ? [{ name: "robots", content: "noindex" }] : []),
    { property: "og:site_name", content: site.name },
    { property: "og:locale", content: "fr_FR" },
    { property: "og:type", content: type },
    { property: "og:title", content: fullTitle },
    ...(description ? [{ property: "og:description", content: description }] : []),
    { property: "og:url", content: url },
    { property: "og:image", content: img },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: imageAlt ?? fullTitle },
    { name: "twitter:card", content: "summary_large_image" },
    ...(jsonLd ? [{ "script:ld+json": { "@context": "https://schema.org", ...jsonLd } }] : []),
  ];
}

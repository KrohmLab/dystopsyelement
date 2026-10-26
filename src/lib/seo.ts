import { site } from "../site";

// Balises de page communes : titre, description, URL canonique, Open Graph et Twitter.
// L'origine vient de content/site.json → url (adresse workers.dev tant que le domaine n'est pas choisi).
type Options = {
  /** Titre de la page, sans le nom du site. Absent sur l'accueil. */
  title?: string;
  description?: string | null;
  /** Chemin de la page, ex. « /agenda ». */
  path: string;
  /** Chemin de l'image de partage (1200×630). */
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  noindex?: boolean;
};

export function pageMeta({ title, description = site.description, path, image, imageAlt, type = "website", noindex }: Options) {
  const fullTitle = title ? `${title} · ${site.name}` : site.name;
  const url = `${site.url}${path}`;
  const img = image ? `${site.url}${image}` : null;
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
    ...(img
      ? [
          { property: "og:image", content: img },
          { property: "og:image:width", content: "1200" },
          { property: "og:image:height", content: "630" },
          { property: "og:image:alt", content: imageAlt ?? fullTitle },
        ]
      : []),
    { name: "twitter:card", content: img ? "summary_large_image" : "summary" },
  ];
}

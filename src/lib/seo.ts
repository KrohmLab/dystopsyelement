import { site } from "../data/site.ts";

export interface SeoInput {
  /** Titre de la page, sans le nom du site. Absent sur l'accueil. */
  title?: string;
  description?: string;
  /** Chemin de la page (ex. `/nexen`), pour l'URL canonique. */
  path: string;
  /** Image Open Graph absolue ou relative au site. */
  image?: string;
  noindex?: boolean;
}

export interface Seo {
  title: string;
  description?: string;
  canonical: string;
  image?: string;
  noindex: boolean;
}

export function buildSeo({ title, description, path, image, noindex = false }: SeoInput): Seo {
  return {
    title: title ? `${title} · ${site.name}` : site.name,
    description: description ?? site.description,
    canonical: new URL(path, site.url).href,
    image: image ? new URL(image, site.url).href : undefined,
    noindex,
  };
}

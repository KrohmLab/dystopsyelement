import type { Album } from "../content/schemas";

/** Fichiers d'une photo de la galerie (public/photos) : vignette carrée 480 px ou grand format 1600 px, en AVIF. */
export const photoSrc = (album: Pick<Album, "year" | "slug">, id: string, size: "s" | "l") => `/photos/${album.year}/${album.slug}/${id}-${size}.avif`;

export const albumPath = (album: Pick<Album, "year" | "slug">) => `/galerie/${album.year}/${album.slug}`;

/** `count` photos réparties sur tout l'album (aperçus, couvertures). */
export function spread<T>(items: T[], count: number): T[] {
  if (items.length <= count) return items;
  return Array.from({ length: count }, (_, i) => items[Math.floor((i * items.length) / count)] as T);
}

import type { Config } from "@react-router/dev/config";
import { readdir, readFile } from "node:fs/promises";

/** Slugs des événements (noms des fichiers content/events/*.md), pour pré-rendre chaque fiche. */
async function eventSlugs(): Promise<string[]> {
  const files = await readdir(new URL("./content/events/", import.meta.url));
  return files.filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
}

/** Pages de la galerie : une par année et une par album (content/gallery.json). */
async function galleryPaths(): Promise<string[]> {
  const albums: { year: number; slug: string }[] = JSON.parse(await readFile(new URL("./content/gallery.json", import.meta.url), "utf8"));
  const years = [...new Set(albums.map((a) => a.year))];
  return ["/galerie", ...years.map((y) => `/galerie/${y}`), ...albums.map((a) => `/galerie/${a.year}/${a.slug}`)];
}

export default {
  appDirectory: "src",
  // Site 100 % statique : chaque route est pré-rendue au build, aucun serveur à l'exécution.
  ssr: false,
  async prerender({ getStaticPaths }) {
    // "/404" est rendu par la route joker (*) puis copié en build/client/404.html
    // par scripts/postbuild.mjs : Cloudflare le sert avec un statut 404.
    const slugs = await eventSlugs();
    return [...new Set([...getStaticPaths(), ...slugs.map((s) => `/agenda/${s}`), ...(await galleryPaths()), "/404"])];
  },
} satisfies Config;

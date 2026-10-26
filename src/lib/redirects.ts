import { writeFile } from "node:fs/promises";
import type { AstroIntegration } from "astro";
import { site } from "../data/site.ts";

/**
 * Génère `dist/_redirects` (SITE_PLAN §1) : les anciennes URLs de la v1 renvoient vers la v2.
 * Les règles `/shop` dépendent de `site.shopUrl` : tant qu'elle n'est pas fournie, elles mènent à l'accueil.
 */
export function redirectRules(shopUrl = site.shopUrl): string {
  const shop = shopUrl ?? "/";
  const rules: [from: string, to: string][] = [
    ["/events", "/agenda"],
    ["/events/:id", "/agenda/:id"],
    ["/shop", shop],
    ["/shop/:id", shop],
    ["/programmation", "/nexen"],
    ["/univers", "/nexen"],
    ["/infos", "/nexen"],
  ];
  return rules.map(([from, to]) => `${from} ${to} 301`).join("\n") + "\n";
}

export function redirects(): AstroIntegration {
  return {
    name: "dystopsy-redirects",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        await writeFile(new URL("_redirects", dir), redirectRules());
        logger.info("_redirects généré");
      },
    },
  };
}

// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { site } from "./src/data/site.ts";
import { redirects } from "./src/lib/redirects.ts";

// Pages hors index : la page de démonstration du design system et la 404.
const hiddenPages = ["/styleguide", "/404"];

export default defineConfig({
  // TODO(asso) : remplacer par le domaine définitif quand il sera choisi.
  site: site.url,
  output: "static",
  // `nexen.html` plutôt que `nexen/index.html` : URLs sans barre finale, servies telles quelles par le Worker.
  build: { format: "file" },
  trailingSlash: "never",
  integrations: [
    sitemap({
      filter: (page) => !hiddenPages.some((path) => new URL(page).pathname.startsWith(path)),
    }),
    redirects(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});

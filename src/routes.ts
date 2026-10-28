import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("nexen", "routes/nexen.tsx"),
  route("agenda", "routes/agenda.tsx"),
  route("agenda/:slug", "routes/evenement.tsx"),
  route("galerie/:annee?", "routes/galerie.tsx"),
  route("galerie/:annee/:photographe", "routes/galerie-album.tsx"),
  route("prestations", "routes/prestations.tsx"),
  route("shop", "routes/shop.tsx"),
  route("contact", "routes/contact.tsx"),
  route("mentions-legales", "routes/mentions-legales.tsx"),
  // Page interne du design system, non indexée (meta noindex, exclue du sitemap).
  route("styleguide", "routes/styleguide.tsx"),
  // Route joker : toute URL inconnue. Pré-rendue sous /404 (voir react-router.config.ts).
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;

import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  // Page interne du design system, non indexée (meta noindex, exclue du sitemap).
  route("styleguide", "routes/styleguide.tsx"),
  // Route joker : toute URL inconnue. Pré-rendue sous /404 (voir react-router.config.ts).
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;

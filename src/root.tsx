import { isRouteErrorResponse, Link, Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import orbitron from "@fontsource-variable/orbitron/files/orbitron-latin-wght-normal.woff2?url";
import rajdhani from "@fontsource/rajdhani/files/rajdhani-latin-500-normal.woff2?url";
import type { Route } from "./+types/root";
import { DEPLOY_SKEW_SCRIPT, useDeploySkewGuard } from "./lib/deploySkew";
import { useScrollTopOnNavigate } from "./lib/useScrollTopOnNavigate";
import "./styles/theme.css";

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
  // Deux polices préchargées au maximum (DESIGN_SYSTEM §11) : Orbitron (titres) et Rajdhani 500 (texte).
  { rel: "preload", href: orbitron, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
  { rel: "preload", href: rajdhani, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#020202" />
        {/* Avant tout le reste : rejoint le lien cliqué si un ancien onglet a rechargé la page à sa place. */}
        <script dangerouslySetInnerHTML={{ __html: DEPLOY_SKEW_SCRIPT }} />
        <Meta />
        <Links />
      </head>
      <body className="flex min-h-svh flex-col">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  useDeploySkewGuard();
  useScrollTopOnNavigate();
  return (
    <>
      <a
        href="#contenu"
        className="sr-only-focusable fixed top-4 left-4 z-50 bg-cyan px-4 py-3 font-display text-label font-bold text-on-accent uppercase chamfer-sm"
      >
        Aller au contenu
      </a>
      <main id="contenu" tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </main>
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const title = isRouteErrorResponse(error) ? `Erreur ${error.status}` : "Erreur";
  return (
    <main id="contenu" className="mx-auto flex min-h-svh max-w-site flex-col justify-center gap-5 px-gutter py-section">
      <p className="font-display text-eyebrow font-bold text-cyan uppercase">// {title}</p>
      <h1 className="text-h1 font-black">Une erreur est survenue</h1>
      <Link className="font-display text-label font-bold text-cyan uppercase" to="/">
        Retour à l'accueil
      </Link>
    </main>
  );
}

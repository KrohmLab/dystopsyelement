import { isRouteErrorResponse, Link, Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "react-router";
import orbitron from "@fontsource-variable/orbitron/files/orbitron-latin-wght-normal.woff2?url";
import rajdhani from "@fontsource/rajdhani/files/rajdhani-latin-500-normal.woff2?url";
import type { Route } from "./+types/root";
import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";
import { ScrollProgress } from "./components/layout/ScrollProgress";
import { SiteBackdrop } from "./components/layout/SiteBackdrop";
import { INTRO_SCRIPT, SiteIntro } from "./components/layout/SiteIntro";
import { SkipLink } from "./components/layout/SkipLink";
import { DEPLOY_SKEW_SCRIPT, useDeploySkewGuard } from "./lib/deploySkew";
import { formatDateRange, getFeatured } from "./lib/events";
import { getNavigation, type Ticket } from "./lib/navigation";
import { events, services, site } from "./content/load.server";
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
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
        {/* Sans JavaScript, les éléments à apparition et les néons restent visibles. */}
        <noscript>
          <style>{"[data-reveal],[data-flicker]{opacity:1!important;transform:none!important}"}</style>
        </noscript>
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

// Calculé au build (pages pré-rendues, reconstruites chaque nuit) : navigation et bouton Billetterie.
export function loader() {
  const featured = getFeatured(events, new Date());
  const ticketUrl = featured?.upcoming ? featured.event.ticketUrl : null;
  const ticket: Ticket = ticketUrl ? { href: ticketUrl, external: true } : { href: "/agenda", external: false };
  const next = featured?.upcoming ? { title: featured.event.title, slug: featured.event.slug, dates: formatDateRange(featured.event) } : null;
  return { nav: getNavigation({ hasServices: services.length > 0 }), ticket, next, socials: site.socials, email: site.email };
}

export default function App() {
  const { nav, ticket, next, socials, email } = useLoaderData<typeof loader>();
  useDeploySkewGuard();
  useScrollTopOnNavigate();
  return (
    <>
      <SkipLink />
      <SiteIntro />
      <SiteBackdrop />
      <ScrollProgress />
      <Header nav={nav} ticket={ticket} next={next} socials={socials} email={email} />
      <main id="contenu" tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </main>
      <Footer nav={nav} ticket={ticket} />
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const title = isRouteErrorResponse(error) ? `Erreur ${error.status}` : "Erreur";
  return (
    <main id="contenu" className="flex min-h-svh flex-col justify-center gap-5 px-site py-section">
      <p className="font-display text-eyebrow font-bold text-cyan uppercase">// {title}</p>
      <h1 className="text-h1 font-black">Une erreur est survenue</h1>
      <Link className="font-display text-label font-bold text-cyan uppercase" to="/">
        Retour à l'accueil
      </Link>
    </main>
  );
}

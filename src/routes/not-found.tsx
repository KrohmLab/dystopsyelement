import { Link } from "react-router";
import { ArrowRightIcon } from "../components/icons";
import { FloatingPattern } from "../components/motion/FloatingPattern";
import { Button } from "../components/ui/Button";
import { pageMeta } from "../lib/seo";
import type { Route } from "./+types/not-found";

export const meta: Route.MetaFunction = () => pageMeta({ title: "Page introuvable", path: "/404", noindex: true });

// Pistes de sortie : les pages les plus visitées.
const ROUTES = [
  { label: "Nexen Festival", href: "/nexen" },
  { label: "Agenda", href: "/agenda" },
  { label: "Galerie", href: "/galerie" },
  { label: "Shop", href: "/shop" },
];

/**
 * Page 404 (pré-rendue en 404.html, servie avec le statut 404 par Cloudflare) : « signal perdu », titre en glitch,
 * retour à l'accueil et raccourcis vers les pages principales.
 */
export default function NotFound() {
  return (
    <section aria-labelledby="introuvable-titre" data-floor="hero" className="relative isolate flex min-h-svh items-center overflow-hidden px-gutter pt-header pb-section">
      <span aria-hidden="true" className="absolute inset-0 -z-10 bg-scanlines" />
      <span aria-hidden="true" className="hidden md:block">
        <FloatingPattern variant={1} tone="pink" className="absolute -right-16 top-1/4 size-96" />
      </span>
      <div className="mx-auto flex w-full max-w-site flex-col items-start gap-6">
        <p className="font-display text-eyebrow font-bold text-cyan uppercase">// Erreur 404 · signal perdu</p>
        <h1 id="introuvable-titre" className="glitch text-display font-black" data-text="Page introuvable">
          Page introuvable
        </h1>
        <p className="max-w-xl text-lead text-ink-soft">Cette page n'existe pas ou a été déplacée. Reprenez la transmission depuis l'accueil.</p>
        <Button variant="secondary" size="lg" href="/">
          Retour à l'accueil
        </Button>
        <nav aria-label="Pages principales" className="mt-6 w-full">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {ROUTES.map((route) => (
              <li key={route.href}>
                <Link
                  to={route.href}
                  prefetch="intent"
                  className="group flex min-h-14 items-center justify-between gap-4 bg-surface/80 px-5 font-display text-label font-bold text-ink uppercase no-underline inset-ring inset-ring-line-strong transition-colors duration-fast chamfer-sm hover:text-cyan hover:inset-ring-cyan"
                >
                  {route.label}
                  <ArrowRightIcon className="shrink-0 text-cyan transition-transform duration-base ease-out-expo group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}

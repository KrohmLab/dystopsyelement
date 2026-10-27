import { Link } from "react-router";
import { pageMeta } from "../lib/seo";
import type { Route } from "./+types/not-found";

export const meta: Route.MetaFunction = () => pageMeta({ title: "Page introuvable", path: "/404", noindex: true });

// Page 404 provisoire : sa version finale arrive en phase 3.
export default function NotFound() {
  return (
    <div data-floor="hero" className="flex min-h-svh flex-col justify-center gap-5 px-site py-section">
      <p className="font-display text-eyebrow font-bold text-cyan uppercase">// Erreur 404</p>
      <h1 className="glitch text-h1 font-black" data-text="Page introuvable">
        Page introuvable
      </h1>
      <Link className="font-display text-label font-bold text-cyan uppercase" to="/">
        Retour à l'accueil
      </Link>
    </div>
  );
}

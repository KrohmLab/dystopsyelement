import { Logo } from "../components/Logo";
import { site } from "../content/load.server";
import { pageMeta } from "../lib/seo";
import type { Route } from "./+types/home";

// Le loader lit les contenus validés au build : un content/site.json invalide fait échouer le build.
export function loader() {
  return { name: site.name };
}

export const meta: Route.MetaFunction = () => pageMeta({ path: "/" });

// Page d'accueil provisoire : les sections arrivent en phase 3 (SITE_PLAN §3).
export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <div className="grid min-h-svh place-items-center px-gutter py-section">
      <div className="flex flex-col items-center gap-8 text-center">
        <Logo className="size-32 text-cyan" />
        <h1 className="glitch text-display font-black" data-text={loaderData.name}>
          {loaderData.name}
        </h1>
      </div>
    </div>
  );
}

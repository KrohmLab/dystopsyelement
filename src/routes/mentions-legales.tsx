import type { ReactNode } from "react";
import { PageHero } from "../components/blocks/PageHero";
import { site } from "../content/load.server";
import { pageMeta } from "../lib/seo";
import type { Route } from "./+types/mentions-legales";

export function loader() {
  return { legal: site.legal, name: site.name, email: site.email };
}

export const meta: Route.MetaFunction = () =>
  pageMeta({ title: "Mentions légales", description: "Mentions légales et données personnelles du site de Dystopsy Element.", path: "/mentions-legales" });

function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-titre`} className="border-b border-line py-10 first:pt-0">
      <h2 id={`${id}-titre`} className="mb-4 text-h3 font-bold">
        {title}
      </h2>
      <div className="grid gap-3 text-ink-soft [&_a]:text-cyan [&_a]:underline">{children}</div>
    </section>
  );
}

// Champ légal non fourni : mention provisoire visible (SITE_PLAN §0), à compléter par l'asso.
const value = (field: string | null) => field ?? "À compléter (provisoire)";

/** Mentions légales et confidentialité (SITE_PLAN §8 bis). */
export default function MentionsLegales({ loaderData }: Route.ComponentProps) {
  const { legal, name, email } = loaderData;
  const mail = email ? <a href={`mailto:${email}`}>{email}</a> : "l'adresse de contact de l'association";
  return (
    <>
      <PageHero eyebrow="Informations légales" title="Mentions légales" />
      <div data-floor="calm" className="mx-auto max-w-3xl px-gutter py-section">
        <Block id="editeur" title="Éditeur du site">
          <p>
            {legal.publisher ?? name}, association loi 1901.
            <br />
            RNA : {value(legal.rna)}. Siège : {value(legal.address)}.
            <br />
            Directeur de la publication : {value(legal.publicationDirector)}.
          </p>
        </Block>
        <Block id="hebergement" title="Hébergement">
          <p>Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, États-Unis.</p>
        </Block>
        <Block id="donnees" title="Données personnelles">
          <p>
            Le formulaire de contact transmet vos nom, prénom, adresse e-mail et message à l'association, via le service Web3Forms, dans le seul but de vous répondre. Ces
            données ne sont ni revendues ni utilisées à d'autres fins.
          </p>
          <p>Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données : écrivez à {mail}.</p>
        </Block>
        <Block id="cookies" title="Cookies">
          <p>Ce site ne dépose aucun cookie. La mesure d'audience (Cloudflare Web Analytics) fonctionne sans cookie et sans donnée personnelle.</p>
        </Block>
        <Block id="credits" title="Crédits photos">
          <p>À compléter (provisoire) : auteurs des photos et visuels.</p>
        </Block>
      </div>
    </>
  );
}

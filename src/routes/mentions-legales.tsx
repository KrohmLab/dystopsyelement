import type { ReactNode } from "react";
import { PageHero } from "../components/blocks/PageHero";
import { albums, site } from "../content/load.server";
import { pageMeta } from "../lib/seo";
import type { Route } from "./+types/mentions-legales";

export function loader() {
  // Crédits : chaque photographe de la galerie une fois, avec son profil s'il est connu.
  const photographers = [...new Map(albums.map((a) => [a.photographer, a.profile])).entries()].map(([name, profile]) => ({ name, profile }));
  return { legal: site.legal, name: site.name, email: site.email, photographers };
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
  const { legal, name, email, photographers } = loaderData;
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
          <p>
            Vous pouvez aussi adresser une réclamation à la CNIL (<a href="https://www.cnil.fr">cnil.fr</a>).
          </p>
        </Block>
        <Block id="cookies" title="Cookies">
          <p>Ce site ne dépose aucun cookie. La mesure d'audience (Cloudflare Web Analytics) fonctionne sans cookie et sans donnée personnelle.</p>
        </Block>
        <Block id="liens" title="Liens externes">
          <p>
            Billetterie (HelloAsso), shop (Vinted), réseaux sociaux, formulaire de candidature et écoutes (SoundCloud) s'ouvrent sur les sites de ces services, qui
            appliquent leurs propres règles de confidentialité et de cookies. Aucun de leurs contenus n'est chargé sur ce site.
          </p>
        </Block>
        <Block id="credits" title="Crédits photos">
          {photographers.length > 0 && (
            <p>
              Galerie et photos du Nexen Festival :{" "}
              {photographers.map((p, i) => (
                <span key={p.name}>
                  {i > 0 && ", "}
                  {p.profile ? <a href={p.profile}>{p.name}</a> : p.name}
                </span>
              ))}
              .
            </p>
          )}
          <p>Affiches et visuels des événements : publications officielles de Dystopsy Element (auteurs à préciser).</p>
        </Block>
      </div>
    </>
  );
}

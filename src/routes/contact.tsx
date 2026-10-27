import { useSearchParams } from "react-router";
import { ContactForm } from "../components/blocks/ContactForm";
import { PageHero } from "../components/blocks/PageHero";
import { TeamGrid } from "../components/blocks/TeamGrid";
import { InstagramIcon, FacebookIcon, MapPinIcon, SoundCloudIcon, TicketIcon, YouTubeIcon } from "../components/icons";
import { Section } from "../components/layout/Section";
import { SectionHeader } from "../components/layout/SectionHeader";
import { Brackets } from "../components/ui/Brackets";
import { Button } from "../components/ui/Button";
import { events, site, team } from "../content/load.server";
import { getFeatured } from "../lib/events";
import { useHydrated } from "../lib/useHydrated";
import { pageMeta } from "../lib/seo";
import type { Route } from "./+types/contact";

export function loader() {
  const featured = getFeatured(events, new Date());
  return {
    subjects: site.contactSubjects,
    email: site.email,
    city: site.city,
    socials: site.socials,
    ticketUrl: featured?.upcoming ? featured.event.ticketUrl : null,
    team,
  };
}

export const meta: Route.MetaFunction = () =>
  pageMeta({ title: "Contact", description: "Écrire à Dystopsy Element : billetterie, boutique, prestations, et l'équipe de l'asso.", path: "/contact" });

const NETWORKS = [
  { key: "instagram", label: "Instagram", Icon: InstagramIcon },
  { key: "facebook", label: "Facebook", Icon: FacebookIcon },
  { key: "soundcloud", label: "SoundCloud", Icon: SoundCloudIcon },
  { key: "youtube", label: "YouTube", Icon: YouTubeIcon },
] as const;

/** Contact (SITE_PLAN §8) : raccourcis, formulaire (sujet prérempli via ?sujet=), coordonnées, L'Équipe. */
export default function Contact({ loaderData }: Route.ComponentProps) {
  const { subjects, email, city, socials, ticketUrl, team } = loaderData;
  const [params] = useSearchParams();
  const hydrated = useHydrated();
  // ?sujet= lu après l'hydratation (page pré-rendue sans paramètre).
  const wanted = hydrated ? params.get("sujet")?.toLowerCase() : undefined;
  const defaultSubject = subjects.find((s) => s.toLowerCase() === wanted);

  return (
    <>
      <PageHero eyebrow="Transmission" title="Contact" lead="Texte provisoire : une phrase d'invitation à écrire.">
        {ticketUrl && (
          <Button variant="secondary" icon={TicketIcon} href={ticketUrl}>
            Billetterie
          </Button>
        )}
        <Button variant="secondary" href="/shop">
          Boutique
        </Button>
        <Button variant="secondary" href="/contact?sujet=Prestation#formulaire">
          Devis prestation
        </Button>
      </PageHero>

      <Section id="formulaire" labelledBy="formulaire-titre">
        <div className="grid gap-14 lg:grid-cols-[3fr_2fr]">
          <div>
            <SectionHeader id="formulaire-titre" eyebrow="Terminal" title="Nous écrire" />
            <ContactForm subjects={subjects} defaultSubject={defaultSubject} />
          </div>
          <aside aria-labelledby="qg-titre" className="group relative self-start bg-surface p-8 chamfer-lg">
            <Brackets />
            <h2 id="qg-titre" className="mb-6 font-display text-h3 font-black uppercase">
              QG Dystopsy
            </h2>
            <ul className="grid gap-4 text-ink-soft">
              {city && (
                <li className="inline-flex items-center gap-3">
                  <MapPinIcon className="text-cyan" />
                  {city}
                </li>
              )}
              {email && (
                <li>
                  <a href={`mailto:${email}`} className="text-cyan underline">
                    {email}
                  </a>
                </li>
              )}
            </ul>
            <ul className="mt-6 flex flex-wrap gap-2.5">
              {NETWORKS.map(({ key, label, Icon }) => {
                const href = socials[key];
                return href ? (
                  <li key={key}>
                    <a href={href} target="_blank" rel="noopener noreferrer" className="group/social block size-11 bg-cyan-line p-px transition-colors duration-base chamfer-sm hover:bg-cyan">
                      <span className="grid size-full place-items-center bg-surface text-cyan transition-colors duration-base chamfer-sm group-hover/social:bg-cyan group-hover/social:text-on-accent">
                        <Icon size={20} />
                      </span>
                      <span className="sr-only">{label} (nouvel onglet)</span>
                    </a>
                  </li>
                ) : null;
              })}
            </ul>
          </aside>
        </div>
      </Section>

      {team.length > 0 && (
        <Section tone="abyss" labelledBy="equipe-titre">
          <SectionHeader id="equipe-titre" eyebrow="L'asso" title="L'équipe" align="center" />
          <TeamGrid team={team} />
        </Section>
      )}
    </>
  );
}

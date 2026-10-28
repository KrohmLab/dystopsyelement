import { useSearchParams } from "react-router";
import { EventCard } from "../components/blocks/EventCard";
import { PageHero } from "../components/blocks/PageHero";
import { Ticker } from "../components/blocks/Ticker";
import { Section } from "../components/layout/Section";
import { Reveal } from "../components/motion/Reveal";
import { Button } from "../components/ui/Button";
import { FilterBar } from "../components/ui/FilterBar";
import { events, site } from "../content/load.server";
import { toSummary } from "../content/summaries";
import { getPast, getUpcoming } from "../lib/events";
import { pageMeta } from "../lib/seo";
import type { Route } from "./+types/agenda";

const TABS = ["À venir", "Passés"] as const;

export function loader() {
  const now = new Date();
  return {
    upcoming: getUpcoming(events, now).map((e) => toSummary(e, now)),
    past: getPast(events, now).map((e) => toSummary(e, now)),
    instagramUrl: site.socials.instagram,
  };
}

export const meta: Route.MetaFunction = () => pageMeta({ title: "Agenda", description: "Les prochaines dates de Dystopsy Element et les événements passés.", path: "/agenda" });

/** Agenda (SITE_PLAN §5) : onglets À venir / Passés sans rechargement, état dans l'URL (?vue=passes). */
export default function Agenda({ loaderData }: Route.ComponentProps) {
  const { upcoming, past, instagramUrl } = loaderData;
  const [params, setParams] = useSearchParams();
  // Sans date annoncée, l'agenda s'ouvre sur les événements passés.
  const vue = params.get("vue") ?? (upcoming.length === 0 ? "passes" : "a-venir");
  const tab = vue === "passes" ? "Passés" : "À venir";
  const list = tab === "Passés" ? past : upcoming;

  return (
    <>
      <PageHero eyebrow="Billetterie" title="Agenda" lead="Texte provisoire : une phrase d'introduction à l'agenda." image="events/nexens-home-2026-banner" />
      <Ticker items={["Open air festival", "Psytrance · Techno · Bass · Chill"]} />
      <Section labelledBy="agenda-liste" floor="calm">
        <h2 id="agenda-liste" className="sr-only">
          Événements {tab.toLowerCase()}
        </h2>
        <FilterBar
          label="Afficher les événements"
          options={TABS}
          value={tab}
          onChange={(value) => setParams({ vue: value === "Passés" ? "passes" : "a-venir" }, { replace: true, preventScrollReset: true })}
          className="mb-12"
        />
        {list.length > 0 ? (
          <ul key={tab} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
            {list.map((event, i) => (
              <Reveal as="li" key={event.slug} delay={(i % 3) * 100}>
                <EventCard event={event} />
              </Reveal>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center gap-6 py-12 text-center">
            <p className="font-display text-h3 font-bold text-ink-muted uppercase">Aucune date annoncée pour l'instant</p>
            {instagramUrl && (
              <Button variant="secondary" href={instagramUrl}>
                Suivre sur Instagram
              </Button>
            )}
          </div>
        )}
      </Section>
    </>
  );
}

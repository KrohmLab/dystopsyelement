import { Link } from "react-router";
import { EventLineup } from "../components/blocks/EventLineup";
import { EventCard } from "../components/blocks/EventCard";
import { ReadMore } from "../components/blocks/ReadMore";
import { ShareButton } from "../components/blocks/ShareButton";
import { StickyTicketBar } from "../components/blocks/StickyTicketBar";
import { ArrowRightIcon, CalendarIcon, MapPinIcon, TicketIcon } from "../components/icons";
import { CtaBanner } from "../components/layout/CtaBanner";
import { Section } from "../components/layout/Section";
import { SectionHeader } from "../components/layout/SectionHeader";
import { Reveal } from "../components/motion/Reveal";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { ResponsiveImage } from "../components/ui/ResponsiveImage";
import { events, getEvent, nexen2026, ogImage, site } from "../content/load.server";
import { toSummary } from "../content/summaries";
import { formatDateRange, getUpcoming } from "../lib/events";
import { pageMeta } from "../lib/seo";
import type { Route } from "./+types/evenement";

export function loader({ params }: Route.LoaderArgs) {
  const event = getEvent(params.slug);
  if (!event) throw new Response("Événement introuvable", { status: 404 });
  const now = new Date();
  const summary = toSummary(event, now);
  // Deux autres événements : à venir d'abord, sinon les plus récents.
  const og = ogImage(`/og/agenda/${event.slug}.jpg`);
  const others = [...getUpcoming(events, now), ...events].filter((e, i, all) => e.slug !== event.slug && all.indexOf(e) === i).slice(0, 2);
  return {
    event: summary,
    dates: formatDateRange(event),
    timeRange: event.timeRange,
    facebookUrl: event.facebookUrl,
    summaryHtml: event.summaryHtml,
    lineup: event.lineup,
    others: others.map((e) => toSummary(e, now)),
    /** Festival détaillé (line-up, timetable, carte) sur sa propre page. */
    festivalPage: event.slug === nexen2026.event ? "/nexen" : null,
    og,
    jsonLd: { ...musicEvent(event, site.url, summary.upcoming), image: [`${site.url}${og ?? "/og/site.jpg"}`] },
  };
}

/** Données structurées schema.org MusicEvent (résultats enrichis des moteurs de recherche). Aucun prix : non publié. */
function musicEvent(event: NonNullable<ReturnType<typeof getEvent>>, origin: string, upcoming: boolean) {
  // Festival détaillé : son line-up est dans content/festival (timetable), pas dans la fiche.
  const performers = event.slug === nexen2026.event ? [...new Set(nexen2026.sets.map((set) => set.artist))] : event.lineup.map((entry) => entry.name);
  const text = event.summaryHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return {
    "@type": "MusicEvent",
    name: event.title,
    startDate: event.startDate,
    endDate: event.endDate,
    eventStatus: event.status === "annule" ? "https://schema.org/EventCancelled" : "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.venue,
      address: { "@type": "PostalAddress", ...(event.city ? { addressLocality: event.city } : {}), addressCountry: "FR" },
    },
    ...(text ? { description: text.length > 300 ? `${text.slice(0, 297)}…` : text } : {}),
    url: `${origin}/agenda/${event.slug}`,
    organizer: { "@type": "Organization", name: site.name, url: origin },
    ...(performers.length > 0 ? { performer: performers.map((name) => ({ "@type": "PerformingGroup", name })) } : {}),
    // Billetterie : seulement tant que l'événement est à venir.
    ...(upcoming && event.ticketUrl
      ? {
          offers: {
            "@type": "Offer",
            url: event.ticketUrl,
            availability: event.status === "complet" ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
          },
        }
      : {}),
  };
}

export const meta: Route.MetaFunction = ({ data }) =>
  data
    ? pageMeta({
        title: data.event.title,
        description: `${data.dates} · ${[data.event.venue, data.event.city].filter(Boolean).join(", ")}`,
        path: `/agenda/${data.event.slug}`,
        type: "article",
        image: data.og,
        imageAlt: `Visuel de ${data.event.title}`,
        jsonLd: data.jsonLd,
      })
    : [{ title: "Événement introuvable" }];

/** Fiche événement (SITE_PLAN §5) : hero, résumé dépliable, line-up + modales, autres événements. */
export default function Evenement({ loaderData }: Route.ComponentProps) {
  const { event, dates, timeRange, facebookUrl, summaryHtml, lineup, others, festivalPage } = loaderData;
  const canBuy = event.upcoming && event.ticketUrl && event.status !== "complet" && event.status !== "annule";
  const place = [event.venue, event.city].filter(Boolean).join(", ");

  return (
    <>
      <section aria-labelledby="evenement-titre" data-floor="hero" className="relative isolate flex min-h-[80svh] items-end overflow-hidden border-b border-line px-gutter pt-header">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <ResponsiveImage image={event.cover} alt="" sizes="100vw" priority fallbackLabel={event.title} className="opacity-50 mix-blend-luminosity" />
          <span className="absolute inset-0 bg-linear-to-t from-void via-void/50 to-void/70" />
          <span className="absolute inset-0 bg-scanlines" />
        </div>
        <div className="mx-auto w-full max-w-site py-section">
          <Link to="/agenda" className="mb-8 inline-flex min-h-11 items-center gap-2 font-display text-label font-bold text-cyan uppercase no-underline">
            <ArrowRightIcon size={16} className="rotate-180" />
            Retour à l'agenda
          </Link>
          <div className="mb-5">
            {event.upcoming ? (
              event.status === "dernieres-places" ? <Badge variant="live">Dernières places</Badge> : <Badge variant="info">À venir</Badge>
            ) : (
              <Badge variant="neutral">Passé</Badge>
            )}
          </div>
          <h1 id="evenement-titre" className="glitch max-w-4xl text-h1 font-black" data-text={event.title}>
            {event.title}
          </h1>
          <p className="mt-5 flex flex-wrap gap-x-7 gap-y-3 text-lead">
            <span className="inline-flex items-center gap-2.5">
              <CalendarIcon className="text-cyan" />
              {dates}
              {timeRange && ` · ${timeRange}`}
            </span>
            <span className="inline-flex items-center gap-2.5">
              <MapPinIcon className="text-cyan" />
              {place}
            </span>
          </p>
          <div className="mt-8 hidden flex-wrap gap-4 md:flex">
            {canBuy && (
              <Button size="lg" icon={TicketIcon} href={event.ticketUrl ?? undefined}>
                Billetterie
              </Button>
            )}
            {facebookUrl && (
              <Button variant="secondary" size="lg" href={facebookUrl}>
                Événement Facebook
              </Button>
            )}
            <ShareButton title={event.title} />
          </div>
        </div>
      </section>

      {summaryHtml && (
        <Section labelledBy="resume-titre" floor="calm">
          <SectionHeader id="resume-titre" eyebrow="Transmission" title="L'essentiel" />
          <ReadMore html={summaryHtml} />
          {facebookUrl && (
            <div className="mt-8 md:hidden">
              <Button variant="secondary" href={facebookUrl}>
                Événement Facebook
              </Button>
            </div>
          )}
        </Section>
      )}

      {lineup.length > 0 && (
        <Section tone="abyss" labelledBy="lineup-titre">
          <SectionHeader id="lineup-titre" eyebrow="Programmation" title="Line-up" />
          <EventLineup lineup={lineup} />
        </Section>
      )}

      {festivalPage && (
        <Section tone="abyss" labelledBy="festival-titre" floor="lilac">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-3 font-display text-eyebrow font-bold text-nexen-lilac uppercase">// Programmation</p>
              <h2 id="festival-titre" className="text-h2 font-black">
                Line-up, timetable & carte
              </h2>
            </div>
            <Button variant="festival" href={`${festivalPage}#line-up`}>
              Explorer le festival
            </Button>
          </div>
        </Section>
      )}

      {others.length > 0 && (
        <Section grid labelledBy="autres-titre" floor="calm">
          <SectionHeader
            id="autres-titre"
            eyebrow="Agenda"
            title="Autres dates"
            action={
              <Button variant="ghost" href="/agenda">
                Tout l'agenda
              </Button>
            }
          />
          <ul className="grid gap-6 md:grid-cols-2 md:gap-8">
            {others.map((other, i) => (
              <Reveal as="li" key={other.slug} delay={i * 120}>
                <EventCard event={other} />
              </Reveal>
            ))}
          </ul>
        </Section>
      )}

      <CtaBanner
        eyebrow="Contact"
        title="Une question ?"
        primary={canBuy ? { label: "Billetterie", href: event.ticketUrl ?? "/agenda" } : { label: "Nous écrire", href: "/contact" }}
        secondary={canBuy ? { label: "Nous écrire", href: "/contact" } : undefined}
      />
      {/* Barre collante mobile seulement quand la billetterie est ouverte (le partage est déjà dans le hero), avec son espace dessous. */}
      {canBuy && event.ticketUrl && (
        <>
          <div className="h-20 md:hidden" />
          <StickyTicketBar ticketUrl={event.ticketUrl} title={event.title} />
        </>
      )}
    </>
  );
}

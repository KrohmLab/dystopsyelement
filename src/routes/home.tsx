import { EventCard } from "../components/blocks/EventCard";
import { HomeHero } from "../components/blocks/HomeHero";
import { NexenFeature } from "../components/blocks/NexenFeature";
import { Portal } from "../components/blocks/Portal";
import { ProductCard } from "../components/blocks/ProductCard";
import { Ticker } from "../components/blocks/Ticker";
import { CtaBanner } from "../components/layout/CtaBanner";
import { Section } from "../components/layout/Section";
import { SectionHeader } from "../components/layout/SectionHeader";
import { Reveal } from "../components/motion/Reveal";
import { Button } from "../components/ui/Button";
import { RailDots } from "../components/ui/RailDots";
import { albums, events, getEvent, nexen2026, products, services, site } from "../content/load.server";
import { toSummary } from "../content/summaries";
import { formatDateRange, getFeatured, getPast, getUpcoming } from "../lib/events";
import { pageMeta } from "../lib/seo";
import { site as siteSettings } from "../site";
import type { Route } from "./+types/home";
import { FloatingPattern } from "../components/motion/FloatingPattern";

// Termes des affiches officielles (SITE_PLAN §3.2).
const TICKER = ["Open air festival", "Psytrance · Techno · Bass · Chill"];

export function loader() {
  const now = new Date();
  const featured = getFeatured(events, now);
  const nexen = getEvent(nexen2026.event);
  const portals = [
    { label: "Nexen", href: "/nexen", image: "festival/flyer-2026" },
    { label: "Agenda", href: "/agenda", image: "events/nexens-home-2026-banner" },
    ...(albums.length > 0 ? [{ label: "Galerie", href: "/galerie", image: "festival/portail-galerie" }] : []),
    ...(services.length > 0 ? [{ label: "Prestations", href: "/prestations", image: "festival/photo-jour" }] : []),
    { label: "Shop", href: "/shop", image: "shop/merch-2026" },
    ...(site.donateUrl ? [{ label: "Faire un don", href: site.donateUrl, image: "festival/photo-don" }] : []),
    ...(site.booking ? [{ label: site.booking.label, href: site.booking.url, image: "festival/booking-2027" }] : []),
  ];
  // Rien à venir : la section agenda montre les dernières dates passées (hors celle déjà mise en avant dans le hero).
  const upcoming = getUpcoming(events, now);
  const dates = upcoming.length > 0 ? upcoming : getPast(events, now).filter((e) => e.slug !== featured?.event.slug);
  return {
    featured: featured ? toSummary(featured.event, now) : null,
    dates: dates.slice(0, 3).map((e) => toSummary(e, now)),
    datesUpcoming: upcoming.length > 0,
    nexen: nexen && {
      title: nexen.title,
      dates: formatDateRange(nexen),
      place: nexen.venue,
      ticketUrl: toSummary(nexen, now).upcoming ? nexen.ticketUrl : null,
      tagline: nexen2026.tagline,
      // Chiffres courts (une ligne chacun) : scènes, heures de son, nombre d'artistes, jauge.
      facts: [
        ...nexen2026.facts.filter((fact) => fact.label === "scènes" || fact.value.endsWith(" h")),
        { value: String(new Set(nexen2026.sets.map((set) => set.artist)).size), label: "artistes" },
        ...nexen2026.facts.filter((fact) => fact.label.startsWith("festivaliers")).map((fact) => ({ ...fact, label: "festivaliers" })),
      ],
      stages: nexen2026.stages.map(({ slug, name, role, families }) => ({
        slug,
        name,
        role,
        families,
        artists: [...new Set(nexen2026.sets.filter((set) => set.stage === slug).map((set) => set.artist))],
      })),
    },
    portals,
    products: products.slice(0, 4),
    instagramUrl: site.socials.instagram,
  };
}

export const meta: Route.MetaFunction = () =>
  pageMeta({
    path: "/",
    // L'association, ses réseaux et son festival (fiche des moteurs de recherche).
    jsonLd: {
      "@type": "Organization",
      name: siteSettings.name,
      url: siteSettings.url,
      ...(siteSettings.email ? { email: siteSettings.email } : {}),
      sameAs: Object.values(siteSettings.socials).filter(Boolean),
    },
  });

// Grille 2 colonnes (sous lg) : le premier portail est large, et le dernier aussi s'il resterait seul sur sa ligne.
const wide = (i: number, count: number) => i === 0 || (i === count - 1 && (count - 1) % 2 === 1);

/** Accueil « mode spectacle » (SITE_PLAN §3) : visuels et liens, aucune section de présentation. */
export default function Home({ loaderData }: Route.ComponentProps) {
  const { featured, dates, datesUpcoming, nexen, portals, products, instagramUrl } = loaderData;
  return (
    <>
      {featured && <HomeHero event={featured} fallbackImage="festival/fond" />}

      <Section tone="abyss" labelledBy="portails-titre" floor="pink" decor={<FloatingPattern variant={3} tone="cyan" className="-right-16 top-8 size-96" delay={1} />}>
        <h2 id="portails-titre" className="sr-only">
          Explorer le site
        </h2>
        <ul id="portails-rail" className="portals rail grid gap-4 sm:grid-cols-2 md:gap-6">
          {portals.map((portal, i) => (
            <Reveal as="li" key={portal.href} delay={i * 90} data-default={i === 0 || undefined} className={wide(i, portals.length) ? "sm:col-span-2" : undefined}>
              <Portal label={portal.label} eyebrow={String(i + 1).padStart(2, "0")} href={portal.href} image={portal.image} className={i === 0 ? "min-h-72" : undefined} />
            </Reveal>
          ))}
        </ul>
        <RailDots target="portails-rail" count={portals.length} label="Portails" />
      </Section>

      <Ticker items={TICKER} />

      {nexen && <NexenFeature {...nexen} />}

      {dates.length > 0 && (
        <Section grid labelledBy="dates-titre" floor="calm">
          <SectionHeader
            id="dates-titre"
            eyebrow="Agenda"
            title={datesUpcoming ? "Prochaines dates" : "Dernières dates"}
            action={
              <Button variant="ghost" href="/agenda">
                Tout l'agenda
              </Button>
            }
          />
          <ul id="dates-rail" className="rail grid gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
            {dates.map((event, i) => (
              <Reveal as="li" key={event.slug} delay={i * 120}>
                <EventCard event={event} />
              </Reveal>
            ))}
          </ul>
          <RailDots target="dates-rail" count={dates.length} label={datesUpcoming ? "Prochaines dates" : "Dernières dates"} />
        </Section>
      )}

      <Section tone="abyss" labelledBy="shop-titre" floor="pink" decor={<FloatingPattern variant={1} tone="pink" className="-left-16 top-1/4 size-72" delay={0.5} />}>
        <SectionHeader
          id="shop-titre"
          eyebrow="Supportez l'asso"
          tone="pink"
          title="Shop"
          action={
            <Button variant="secondary" href="/shop">
              Voir tout le shop
            </Button>
          }
        />
        <ul id="shop-rail" className="rail rail--narrow grid grid-cols-2 gap-4 md:max-w-3xl md:gap-6">
          {products.map((product, i) => (
            <Reveal as="li" key={product.slug} delay={i * 80}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </ul>
        <RailDots target="shop-rail" count={products.length} label="Shop" />
      </Section>

      <CtaBanner
        eyebrow="Contact"
        title="Nous écrire"
        primary={{ label: "Nous écrire", href: "/contact" }}
        secondary={instagramUrl ? { label: "Suivre sur Instagram", href: instagramUrl } : undefined}
      />
    </>
  );
}

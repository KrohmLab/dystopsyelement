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
import { events, getEvent, products, services, site } from "../content/load.server";
import { toSummary } from "../content/summaries";
import { formatDateRange, getFeatured, getUpcoming } from "../lib/events";
import { pageMeta } from "../lib/seo";
import type { Route } from "./+types/home";

// Termes des affiches officielles (SITE_PLAN §3.2).
const TICKER = ["Open air festival", "Psytrance · Techno · Bass · Chill"];

export function loader() {
  const now = new Date();
  const featured = getFeatured(events, now);
  const nexen = getEvent("nexen-festival-2026");
  const portals = [
    { label: "Nexen", href: "/nexen", image: "festival/fond" },
    { label: "Agenda", href: "/agenda", image: "events/nexens-home-2026-banner" },
    ...(services.length > 0 ? [{ label: "Prestations", href: "/prestations", image: null }] : []),
    { label: "Shop", href: "/shop", image: null },
    { label: "Contact", href: "/contact", image: null },
    ...(site.socials.instagram ? [{ label: "Instagram", href: site.socials.instagram, image: null }] : []),
  ];
  return {
    featured: featured ? toSummary(featured.event, now) : null,
    upcoming: getUpcoming(events, now).slice(0, 3).map((e) => toSummary(e, now)),
    nexen: nexen && { dates: formatDateRange(nexen), place: nexen.venue, ticketUrl: toSummary(nexen, now).upcoming ? nexen.ticketUrl : null },
    portals,
    products: products.slice(0, 4),
    instagramUrl: site.socials.instagram,
  };
}

export const meta: Route.MetaFunction = () => pageMeta({ path: "/" });

/** Accueil « mode spectacle » (SITE_PLAN §3) : visuels et liens, aucune section de présentation. */
export default function Home({ loaderData }: Route.ComponentProps) {
  const { featured, upcoming, nexen, portals, products, instagramUrl } = loaderData;
  return (
    <>
      {featured && <HomeHero event={featured} fallbackImage="festival/fond" instagramUrl={instagramUrl} />}
      <Ticker items={TICKER} />

      <Section tone="abyss" labelledBy="portails-titre">
        <h2 id="portails-titre" className="sr-only">
          Explorer le site
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
          {portals.map((portal, i) => (
            <Reveal as="li" key={portal.href} delay={(i % 3) * 120} className={i === 0 ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : undefined}>
              <Portal
                label={portal.label}
                eyebrow={String(i + 1).padStart(2, "0")}
                href={portal.href}
                image={portal.image}
                className={i === 0 ? "h-full min-h-72 lg:min-h-full" : undefined}
              />
            </Reveal>
          ))}
        </ul>
      </Section>

      {nexen && <NexenFeature dates={nexen.dates} place={nexen.place} ticketUrl={nexen.ticketUrl} />}

      {upcoming.length > 0 && (
        <Section grid labelledBy="dates-titre">
          <SectionHeader
            id="dates-titre"
            eyebrow="Agenda"
            title="Prochaines dates"
            action={
              <Button variant="ghost" href="/agenda">
                Tout l'agenda
              </Button>
            }
          />
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
            {upcoming.map((event, i) => (
              <Reveal as="li" key={event.slug} delay={i * 120}>
                <EventCard event={event} />
              </Reveal>
            ))}
          </ul>
        </Section>
      )}

      <Section tone="abyss" labelledBy="boutique-titre">
        <SectionHeader
          id="boutique-titre"
          eyebrow="Supportez l'asso"
          tone="pink"
          title="Boutique"
          action={
            <Button variant="secondary" href="/shop">
              Voir tout le shop
            </Button>
          }
        />
        <ul className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {products.map((product, i) => (
            <Reveal as="li" key={product.slug} delay={i * 80}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </ul>
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

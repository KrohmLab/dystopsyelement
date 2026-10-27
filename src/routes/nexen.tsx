import { ArtistGrid } from "../components/blocks/ArtistGrid";
import { PageHero } from "../components/blocks/PageHero";
import { CtaBanner } from "../components/layout/CtaBanner";
import { Section } from "../components/layout/Section";
import { SectionHeader } from "../components/layout/SectionHeader";
import { NeonFlicker } from "../components/motion/NeonFlicker";
import { Parallax } from "../components/motion/Parallax";
import { Reveal } from "../components/motion/Reveal";
import { Accordion } from "../components/ui/Accordion";
import { Button } from "../components/ui/Button";
import { ResponsiveImage } from "../components/ui/ResponsiveImage";
import { TicketIcon } from "../components/icons";
import { artists, faq, getEvent } from "../content/load.server";
import { toSummary } from "../content/summaries";
import { formatDateRange } from "../lib/events";
import { pageMeta } from "../lib/seo";
import type { Route } from "./+types/nexen";

// Édition affichée. TODO(asso) : passer à l'édition suivante dès qu'elle est annoncée.
const EDITION = "nexen-festival-2026";
// Galerie : photo de jour réelle + emplacements provisoires numérotés.
const GALLERY: { image: string | null; alt: string }[] = [
  { image: "festival/photo-jour", alt: "Nexen Festival, photo de jour" },
  { image: "festival/fond", alt: "Visuel du Nexen Festival 2026" },
  { image: null, alt: "" },
  { image: null, alt: "" },
  { image: null, alt: "" },
  { image: null, alt: "" },
];

export function loader() {
  const event = getEvent(EDITION);
  if (!event) throw new Response("Édition introuvable", { status: 404 });
  const summary = toSummary(event, new Date());
  return {
    title: event.title,
    dates: formatDateRange(event),
    place: [event.venue, event.city].filter(Boolean).join(", "),
    cover: event.cover,
    ticketUrl: summary.upcoming ? event.ticketUrl : null,
    facebookUrl: event.facebookUrl,
    lineup: event.lineup.flatMap((slug) => artists.filter((a) => a.slug === slug)),
    faq,
  };
}

export const meta: Route.MetaFunction = ({ data }) =>
  pageMeta({ title: "Nexen Festival", description: data ? `${data.title} · ${data.dates} · ${data.place}` : undefined, path: "/nexen" });

/** Page du festival (SITE_PLAN §4) : line-up avec modales, univers, infos pratiques, galerie. */
export default function Nexen({ loaderData }: Route.ComponentProps) {
  const { dates, place, cover, ticketUrl, facebookUrl, lineup } = loaderData;
  return (
    <>
      <PageHero eyebrow={`${dates} · ${place}`} title="Nexen Festival" image={cover}>
        {ticketUrl && (
          <Button variant="festival" icon={TicketIcon} href={ticketUrl}>
            Billetterie
          </Button>
        )}
        {facebookUrl && (
          <Button variant="secondary" href={facebookUrl}>
            Événement Facebook
          </Button>
        )}
      </PageHero>

      <Section id="line-up" labelledBy="lineup-titre">
        <SectionHeader id="lineup-titre" eyebrow="Programmation" title="Line-up" />
        <ArtistGrid artists={lineup} />
        <Reveal className="mx-auto mt-14 max-w-md overflow-hidden chamfer-lg">
          <ResponsiveImage image="festival/lineup-2026" alt="Affiche officielle du line-up du Nexen Festival 2026" sizes="28rem" />
        </Reveal>
      </Section>

      <section id="univers" aria-labelledby="univers-titre" className="relative isolate overflow-hidden border-y border-pink-line px-gutter py-section text-center">
        <Parallax speed={80} mouse={10} className="absolute -inset-24 -z-20">
          <ResponsiveImage image="festival/fond" alt="" sizes="100vw" className="opacity-45" />
        </Parallax>
        <span aria-hidden="true" className="absolute inset-0 -z-10 bg-radial from-void/30 to-void to-80%" />
        <div className="mx-auto flex max-w-site flex-col items-center">
          <SectionHeader id="univers-titre" eyebrow="L'univers" tone="pink" title="Open air festival" align="center" />
          <NeonFlicker className="w-[min(26rem,80%)]">
            <ResponsiveImage image="festival/logo-nexen" alt="Nexen Open Air Festival" sizes="26rem" className="object-contain" />
          </NeonFlicker>
          <p className="mt-6 max-w-prose text-lead text-ink-soft">Texte provisoire : une phrase sur l'univers du festival.</p>
        </div>
      </section>

      {loaderData.faq.length > 0 && (
        <Section id="infos" tone="abyss" labelledBy="infos-titre">
          <div className="mx-auto max-w-3xl">
            <SectionHeader id="infos-titre" eyebrow="Infos pratiques" title="Avant de venir" />
            {loaderData.faq.map((item, i) => (
              <Accordion key={item.question} question={item.question} open={i === 0}>
                <p>{item.answer}</p>
              </Accordion>
            ))}
          </div>
        </Section>
      )}

      <Section id="galerie" labelledBy="galerie-titre">
        <SectionHeader id="galerie-titre" eyebrow="Galerie" title="En images" />
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {GALLERY.map(({ image, alt }, i) => (
            <Reveal as="li" key={i} delay={(i % 3) * 80} className={i === 0 ? "col-span-2 row-span-2" : undefined}>
              <div className="group aspect-square overflow-hidden chamfer-md">
                <ResponsiveImage
                  image={image}
                  alt={alt}
                  sizes="(min-width: 48rem) 33vw, 50vw"
                  fallbackLabel={`Photo ${i + 1}`}
                  className="transition duration-slow ease-out-expo group-hover:scale-105"
                />
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      <CtaBanner
        eyebrow="Nexen"
        title={ticketUrl ? loaderData.title : "Prochaine édition à venir"}
        primary={ticketUrl ? { label: "Prendre ma place", href: ticketUrl } : { label: "Voir l'agenda", href: "/agenda" }}
      />
    </>
  );
}

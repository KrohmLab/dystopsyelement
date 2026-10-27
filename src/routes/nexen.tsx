import type { ComponentType } from "react";
import { Link } from "react-router";
import {
  ArrowRightIcon,
  ArtIcon,
  CalendarIcon,
  CheckIcon,
  CloseIcon,
  DropIcon,
  FireIcon,
  FoodIcon,
  InfoIcon,
  MapPinIcon,
  StoreIcon,
  TentIcon,
  TicketIcon,
  TreeIcon,
  YogaIcon,
} from "../components/icons";
import { Section } from "../components/layout/Section";
import { Eyebrow, SectionHeader } from "../components/layout/SectionHeader";
import { CountUp } from "../components/motion/CountUp";
import { GridFloor } from "../components/motion/GridFloor";
import { NeonFlicker } from "../components/motion/NeonFlicker";
import { Parallax } from "../components/motion/Parallax";
import { Reveal } from "../components/motion/Reveal";
import { LineupExplorer, STAGE_TONE } from "../components/nexen/LineupExplorer";
import { SiteMap3D } from "../components/nexen/SiteMap3D";
import { Badge } from "../components/ui/Badge";
import { Brackets } from "../components/ui/Brackets";
import { Button } from "../components/ui/Button";
import { ResponsiveImage } from "../components/ui/ResponsiveImage";
import { getEvent, nexen2026 } from "../content/load.server";
import { toSummary } from "../content/summaries";
import { cn } from "../lib/cn";
import { formatDateRange } from "../lib/events";
import { pageMeta } from "../lib/seo";
import type { Route } from "./+types/nexen";

export function loader() {
  const event = getEvent(nexen2026.event);
  if (!event) throw new Response("Édition introuvable", { status: 404 });
  const upcoming = toSummary(event, new Date()).upcoming;
  return { festival: nexen2026, dates: formatDateRange(event), place: event.venue, cover: event.cover, upcoming };
}

export const meta: Route.MetaFunction = ({ data }) =>
  pageMeta({
    title: "Nexen Festival",
    description: data ? `${data.festival.title} · ${data.dates} · ${data.place}. Deux scènes, 48 h de son non-stop en open air.` : undefined,
    path: "/nexen",
  });

const EXPERIENCE_ICONS: Record<string, ComponentType<{ size?: 32; className?: string }>> = {
  tree: TreeIcon,
  tent: TentIcon,
  store: StoreIcon,
  food: FoodIcon,
  fire: FireIcon,
  yoga: YogaIcon,
  art: ArtIcon,
  drop: DropIcon,
};

// Galerie : photo de jour réelle + emplacements provisoires numérotés.
const GALLERY: { image: string | null; alt: string }[] = [
  { image: "festival/photo-jour", alt: "Nexen Festival, photo de jour" },
  { image: "festival/fond", alt: "Visuel du Nexen Festival 2026" },
  { image: null, alt: "" },
  { image: null, alt: "" },
  { image: null, alt: "" },
  { image: null, alt: "" },
];

/**
 * Page du festival (SITE_PLAN §4) : présentation interactive complète de l'édition 2026, aux couleurs de
 * l'événement (lilas Nexus, pêche Engine, violet de la carte). Données : content/festival/nexen-2026.json.
 */
export default function Nexen({ loaderData }: Route.ComponentProps) {
  const { festival, dates, place, cover, upcoming } = loaderData;
  const { links } = festival;
  const setsByStage = (slug: string) => festival.sets.filter((s) => s.stage === slug).length;

  return (
    <div className="nexen-page">
      {/* Hero */}
      <section aria-labelledby="nexen-titre" className="relative isolate flex min-h-svh items-center overflow-hidden">
        <Parallax speed={70} mouse={18} className="absolute -inset-10 -z-20">
          <ResponsiveImage image={cover} alt="" sizes="100vw" priority className="opacity-60" />
        </Parallax>
        <span aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-void via-nexen-violet-dim to-void/70" />
        <span aria-hidden="true" className="absolute inset-0 -z-10 bg-radial from-transparent to-void to-80%" />
        <GridFloor className="absolute inset-x-0 bottom-0 -z-10 h-2/5" />
        <span aria-hidden="true" className="absolute inset-0 -z-10 bg-scanlines" />

        <div className="hero-enter mx-auto flex w-full max-w-site flex-col items-center px-gutter pt-header pb-section text-center">
          <Badge variant={upcoming ? "live" : "neutral"}>{upcoming ? "Billetterie ouverte" : "Édition 2026 · Prochaine édition à venir"}</Badge>
          <h1 id="nexen-titre" className="sr-only">
            {festival.title}
          </h1>
          <NeonFlicker className="mt-8 w-[min(36rem,88%)]">
            <ResponsiveImage image="festival/logo-nexen" alt="" sizes="36rem" priority className="object-contain" />
          </NeonFlicker>
          <p className="mt-6 flex flex-wrap justify-center gap-x-7 gap-y-2 text-lead text-ink">
            <span className="inline-flex items-center gap-2.5">
              <CalendarIcon className="text-nexen-lilac" />
              {dates}
            </span>
            <span className="inline-flex items-center gap-2.5">
              <MapPinIcon className="text-nexen-lilac" />
              {place}
            </span>
          </p>
          <p className="mt-2 font-display text-eyebrow font-bold text-nexen-peach uppercase">{festival.tagline}</p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            {upcoming ? (
              <Button variant="festival" icon={TicketIcon} href={links.ticket}>
                Billetterie
              </Button>
            ) : (
              <Button variant="festival" href="#line-up">
                Explorer le line-up
              </Button>
            )}
            <Button variant="secondary" size="lg" href={links.facebook}>
              Revivre l'événement
            </Button>
          </div>
        </div>
      </section>

      {/* Chiffres clés */}
      <section aria-label="Le festival en chiffres" className="relative border-y border-nexen-lilac-line bg-nexen-violet-dim px-gutter py-12">
        <ul className="mx-auto grid max-w-site grid-cols-2 gap-8 text-center sm:grid-cols-3 lg:grid-cols-5">
          {festival.facts.map((fact, i) => (
            <Reveal as="li" key={fact.label} delay={i * 90} className="flex flex-col items-center gap-1">
              <span className="font-display text-h1 font-black text-ink text-glow-cyan">
                <CountUp value={fact.value} />
              </span>
              <span className="font-display text-eyebrow font-bold text-nexen-lilac uppercase">{fact.label}</span>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* L'expérience */}
      <Section labelledBy="experience-titre">
        <SectionHeader id="experience-titre" eyebrow="L'expérience" tone="lilac" title="Trois jours hors du temps" />
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {festival.experience.map((item, i) => {
            const Icon = EXPERIENCE_ICONS[item.icon] ?? InfoIcon;
            return (
              <Reveal as="li" key={item.title} delay={(i % 4) * 90}>
                <div className="group relative h-full bg-surface/80 p-5 inset-ring inset-ring-line transition duration-base hover:-translate-y-1 hover:bg-surface-raised hover:inset-ring-nexen-lilac-line sm:p-6">
                  <Brackets />
                  <span className="mb-4 grid size-14 place-items-center bg-nexen-violet-dim text-nexen-lilac inset-ring inset-ring-nexen-lilac-line chamfer-sm transition duration-base group-hover:bg-nexen-lilac group-hover:text-on-accent">
                    <Icon size={32} />
                  </span>
                  <h3 className="text-h3 font-bold">{item.title}</h3>
                  <p className="mt-2 text-small text-ink-muted">{item.text}</p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </Section>

      {/* Les scènes */}
      <Section tone="abyss" labelledBy="scenes-titre">
        <SectionHeader id="scenes-titre" eyebrow="Les scènes" tone="lilac" title="Nexus & Engine" />
        <ul className="grid gap-5 lg:grid-cols-2">
          {festival.stages.map((stage, i) => {
            const tone = STAGE_TONE[stage.slug];
            return (
              <Reveal as="li" key={stage.slug} delay={i * 150}>
                <Link
                  to={`/nexen?scene=${encodeURIComponent(stage.name)}#line-up`}
                  preventScrollReset
                  className={cn("stage-panel group relative flex min-h-96 flex-col justify-end overflow-hidden p-8 no-underline inset-ring chamfer-lg sm:p-10", tone.ring)}
                >
                  <span aria-hidden="true" className={cn("stage-panel__glow absolute inset-0", `stage-panel__glow--${stage.slug}`)} />
                  <span aria-hidden="true" className="absolute inset-0 bg-scanlines" />
                  <span aria-hidden="true" className="stage-panel__index absolute top-6 right-8 font-display text-display font-black">
                    0{i + 1}
                  </span>
                  <Brackets />
                  <span className="relative">
                    <span className={cn("font-display text-eyebrow font-bold uppercase", tone.text)}>// {stage.role}</span>
                    <span className="glitch-hover mt-3 block font-display text-h1 font-black text-ink uppercase" data-text={stage.name}>
                      {stage.name}
                    </span>
                    <span className="mt-4 flex flex-wrap gap-2">
                      {stage.families.map((family) => (
                        <Badge key={family} variant="outline">
                          {family}
                        </Badge>
                      ))}
                    </span>
                    <span className="mt-6 flex flex-wrap items-center justify-between gap-4 text-small text-ink-soft">
                      <span>
                        {setsByStage(stage.slug)} passages · mapping {stage.mapping.join(" & ")}
                      </span>
                      <span className={cn("inline-flex items-center gap-2 font-display text-label font-bold uppercase", tone.text)}>
                        Voir le line-up
                        <ArrowRightIcon size={20} className="transition-transform duration-base group-hover:translate-x-1" />
                      </span>
                    </span>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </Section>

      {/* Line-up */}
      <Section id="line-up" labelledBy="lineup-titre">
        <SectionHeader
          id="lineup-titre"
          eyebrow="Programmation"
          tone="lilac"
          title="Line-up & timetable"
          lead="Filtrez par scène, par jour ou par style ; touchez un artiste pour ouvrir sa fiche."
        />
        <LineupExplorer sets={festival.sets} breaks={festival.breaks} days={festival.days} families={festival.families} stages={festival.stages} />
      </Section>

      {/* Carte 3D */}
      <div id="carte">
        <SiteMap3D map={festival.map} />
      </div>

      {/* Infos pratiques */}
      <Section id="infos" tone="abyss" labelledBy="infos-titre">
        <SectionHeader id="infos-titre" eyebrow="Infos pratiques" tone="lilac" title="Avant de venir" />
        <ol className="timeline mb-14 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {festival.schedule.map((step, i) => (
            <Reveal as="li" key={step.when} delay={i * 80} className="timeline__step relative pt-6">
              <span aria-hidden="true" className="timeline__dot" />
              <p className="font-display text-eyebrow font-bold text-nexen-peach uppercase">{step.when}</p>
              <p className="mt-1 text-small text-ink-soft">{step.what}</p>
            </Reveal>
          ))}
        </ol>
        <div className="grid gap-5 lg:grid-cols-3">
          <InfoList title={festival.practical.knowTitle} items={festival.practical.know} tone="lilac" />
          <InfoList title="À amener" items={festival.practical.bring} tone="cyan" />
          <InfoList title="Interdit" items={festival.practical.forbidden} tone="danger" />
        </div>
      </Section>

      {/* Village, restauration, galerie d'art */}
      <Section id="village" labelledBy="village-titre">
        <SectionHeader id="village-titre" eyebrow="Le village" tone="lilac" title="Market, food & art" />
        <div className="grid gap-12 lg:grid-cols-[3fr_2fr]">
          <div>
            <h3 className="mb-5 font-display text-label font-bold text-nexen-gold uppercase">Artisans & créateurs</h3>
            <ul className="grid gap-3 sm:grid-cols-2">
              {festival.village.stands.map((stand, i) => (
                <Reveal as="li" key={stand.name} delay={(i % 6) * 60}>
                  <div className="group flex h-full flex-col gap-1 bg-surface/80 px-4 py-3 inset-ring inset-ring-line transition duration-base hover:bg-surface-raised hover:inset-ring-nexen-gold">
                    <span className="font-display text-label font-bold text-ink uppercase transition-colors duration-fast group-hover:text-nexen-gold">{stand.name}</span>
                    <span className="text-small text-ink-muted">{stand.what}</span>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
          <div className="grid content-start gap-10">
            <div>
              <h3 className="mb-5 font-display text-label font-bold text-nexen-peach uppercase">Restauration</h3>
              <ul className="grid gap-3">
                {festival.village.food.map((food) => (
                  <li key={food.name} className="flex items-start gap-4 bg-surface/80 p-4 inset-ring inset-ring-nexen-peach-line chamfer-sm">
                    <FoodIcon size={24} className="mt-0.5 shrink-0 text-nexen-peach" />
                    <span>
                      <span className="block font-display text-label font-bold text-ink uppercase">{food.name}</span>
                      <span className="text-small text-ink-muted">{food.what}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-5 font-display text-label font-bold text-nexen-lilac uppercase">Galerie d'art</h3>
              <ul className="flex flex-wrap gap-2">
                {festival.village.gallery.map((artist) => (
                  <li key={artist}>
                    <Badge variant="outline">{artist}</Badge>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* Crew */}
      <section aria-labelledby="crew-titre" className="relative overflow-hidden border-y border-nexen-lilac-line bg-nexen-violet-dim px-gutter py-14">
        <div className="mx-auto max-w-site">
          <Eyebrow tone="lilac">Crédits</Eyebrow>
          <h2 id="crew-titre" className="mb-8 text-h2 font-black">
            Ils font le Nexen
          </h2>
          <ul className="grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {festival.crew.map((credit) => (
              <li key={credit.role}>
                <p className="font-display text-eyebrow font-bold text-nexen-peach uppercase">{credit.role}</p>
                <p className="mt-1 font-display text-h3 font-bold text-ink uppercase">{credit.names.join(" · ")}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Galerie */}
      <Section id="galerie" labelledBy="galerie-titre">
        <SectionHeader id="galerie-titre" eyebrow="Galerie" tone="lilac" title="En images" />
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
        <Reveal className="mx-auto mt-14 max-w-md overflow-hidden chamfer-lg">
          <ResponsiveImage image="festival/lineup-2026" alt="Affiche officielle du line-up du Nexen Festival 2026" sizes="28rem" />
        </Reveal>
      </Section>

      {/* Liens */}
      <section aria-labelledby="liens-titre" className="relative isolate overflow-hidden px-gutter py-section text-center">
        <span aria-hidden="true" className="absolute inset-0 -z-10 bg-radial from-nexen-violet-dim to-transparent to-70%" />
        <Eyebrow tone="lilac">Nexen</Eyebrow>
        <h2 id="liens-titre" className="text-h2 font-black">
          {upcoming ? "On s'y retrouve ?" : "Rendez-vous à la prochaine édition"}
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {upcoming && (
            <Button size="lg" icon={TicketIcon} href={links.ticket}>
              Billetterie
            </Button>
          )}
          <Button variant="secondary" size="lg" href={links.merch}>
            Merch sur Vinted
          </Button>
          <Button variant="secondary" size="lg" href={links.carpool}>
            Covoiturage
          </Button>
          <Button variant="secondary" size="lg" href={links.facebook}>
            Événement Facebook
          </Button>
        </div>
      </section>
    </div>
  );
}

const INFO_TONE = {
  lilac: { ring: "inset-ring-nexen-lilac-line", text: "text-nexen-lilac", Icon: InfoIcon },
  cyan: { ring: "inset-ring-cyan-line", text: "text-cyan", Icon: CheckIcon },
  danger: { ring: "inset-ring-danger", text: "text-danger", Icon: CloseIcon },
} as const;

function InfoList({ title, items, tone }: { title: string; items: string[]; tone: keyof typeof INFO_TONE }) {
  const { ring, text, Icon } = INFO_TONE[tone];
  return (
    <Reveal className={cn("relative bg-surface/85 p-6 inset-ring chamfer-md", ring)}>
      <h3 className={cn("mb-5 font-display text-label font-black uppercase", text)}>{title}</h3>
      <ul className="grid gap-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-small text-ink-soft">
            <Icon size={16} className={cn("mt-1 shrink-0", text)} />
            {item}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

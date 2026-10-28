import type { CSSProperties } from "react";
import { formatDateRange } from "../../lib/events";
import { splitHeroTitle } from "../../lib/heroTitle";
import { CalendarIcon, MapPinIcon, TicketIcon } from "../icons";
import { Parallax } from "../motion/Parallax";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { ResponsiveImage } from "../ui/ResponsiveImage";
import type { EventSummary } from "./EventCard";
import { HoloCenter } from "./hologram/HoloCenter";
import { HoloRadar } from "./hologram/HoloRadar";

type Props = {
  event: EventSummary;
  /** Visuel de repli quand l'événement n'en a pas encore (fond Nexen). */
  fallbackImage: string;
};

/** Délai d'entrée après l'intro (s), en plus de --intro-offset. */
const at = (delay: number) => ({ "--enter-delay": `${delay}s` }) as CSSProperties;

/**
 * Hero « hologramme » de l'accueil (docs/hero-hologramme/HERO_HOLOGRAMME.md, DESIGN_SYSTEM §6.2) : un seul événement,
 * radar holographique (logo Nexen pour un festival, visuel de l'événement pour une soirée). La section fait 260svh :
 * son étage collant se défait au défilement (glitch du texte, radar qui s'éteint en point, sol qui plonge, voile noir),
 * en CSS pur piloté par la view-timeline --hero (styles « Hero hologramme » de theme.css).
 */
export function HomeHero({ event, fallbackImage }: Props) {
  const variant = event.kind === "festival" ? "festival" : "soiree";
  const place = [event.venue, event.city].filter(Boolean).join(", ");
  const title = splitHeroTitle(event.title);
  const center =
    variant === "festival" ? (
      <HoloCenter kind="logo" image="festival/logo-nexen" />
    ) : event.cover ? (
      <HoloCenter kind="visual" image={event.cover} focus={event.heroFocus} />
    ) : (
      <HoloCenter kind="brand" />
    );

  // Bloc de texte, rendu deux fois : le vrai, et un calque RGB décoratif qui se décale pendant le glitch de sortie.
  const copy = (ghost: boolean) => {
    const Title = ghost ? "p" : "h1";
    return (
      <>
        <div>
          {event.upcoming ? (
            <Badge variant="live">{event.status === "dernieres-places" ? "Dernières places" : "Prochain événement"}</Badge>
          ) : (
            <Badge variant="neutral">Dernier événement</Badge>
          )}
        </div>
        <Title id={ghost ? undefined : "hero-titre"} className="holo-title">
          <span className="block">
            <span className="holo-title__main glitch text-glow-cyan" data-text={title.first}>
              {title.first}
            </span>
          </span>
          {title.rest && (
            <>
              {" "}
              <span className="block">
                <span className="holo-title__rest">{title.rest}</span>
              </span>
            </>
          )}
        </Title>
        <p className="holo-meta">
          <span>
            <CalendarIcon className="text-cyan" />
            {formatDateRange(event)}
          </span>
          <span>
            <MapPinIcon className="text-cyan" />
            {place}
          </span>
        </p>
        {!ghost && (
          <div className="holo-actions">
            {event.upcoming && event.ticketUrl ? (
              <Button size="lg" icon={TicketIcon} href={event.ticketUrl}>
                Billetterie
              </Button>
            ) : (
              <Button size="lg" href="/agenda">
                Voir l'agenda
              </Button>
            )}
            <Button variant="secondary" size="lg" href={`/agenda/${event.slug}`}>
              Voir l'événement
            </Button>
          </div>
        )}
      </>
    );
  };

  return (
    <section aria-labelledby="hero-titre" data-floor={variant === "festival" ? "holo" : "off"} data-variant={variant} className="holo-hero">
      <div className="holo-hero__stage">
        {/* Fond : zoom au défilement (enveloppe) + parallaxe souris (Parallax, desktop). */}
        <div aria-hidden="true" className="holo-hero__bg holo-scroll">
          <Parallax speed={0} mouse={14} className="size-full">
            <ResponsiveImage image={event.cover ?? fallbackImage} alt="" sizes="100vw" priority className="holo-hero__bg-image" />
          </Parallax>
        </div>
        <span aria-hidden="true" className="holo-hero__veil" />
        {variant === "soiree" && <span aria-hidden="true" className="holo-hero__grid bg-grid" />}
        <span aria-hidden="true" className="holo-hero__scanlines bg-scanlines" />

        {/* Radar : glisse au centre (h-move) › s'éteint (h-off) au défilement ; s'allume après l'intro (h-off à l'envers). */}
        <div aria-hidden="true" className="holo-hero__radar holo-scroll">
          <div className="holo-hero__radar-off holo-scroll">
            <span className="holo-hero__ignite" />
            <div className="holo-hero__radar-in">
              <HoloRadar center={center} />
            </div>
          </div>
        </div>

        <div className="holo-hero__copy">
          {/* Le texte entre en glitch après l'intro (temps, enveloppe intérieure) et sort en glitch au défilement (enveloppe
              extérieure) : la même animation, jouée à l'envers puis à l'endroit. Un calque RGB accompagne chaque glitch. */}
          <div className="holo-hero__text holo-scroll">
            <div className="holo-hero__flow holo-glitch-in">{copy(false)}</div>
          </div>
          <div aria-hidden="true" inert className="holo-hero__ghost">
            <div className="holo-hero__flow">{copy(true)}</div>
          </div>
          <div aria-hidden="true" inert className="holo-hero__rgb holo-scroll">
            <div className="holo-hero__flow">{copy(true)}</div>
          </div>
        </div>

        <span aria-hidden="true" className="holo-hero__dot holo-scroll" />
        <div aria-hidden="true" className="holo-hero__cue holo-scroll">
          <span className="holo-enter" style={at(1)}>
            <span className="holo-hero__mouse" />
            Défiler
          </span>
        </div>
        <span aria-hidden="true" className="holo-hero__dark holo-scroll" />
      </div>
    </section>
  );
}

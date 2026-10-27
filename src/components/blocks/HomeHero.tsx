import { formatDateRange } from "../../lib/events";
import { CalendarIcon, MapPinIcon, TicketIcon } from "../icons";
import { DecodeText } from "../motion/DecodeText";
import { NeonFrame } from "../motion/NeonFrame";
import { Parallax } from "../motion/Parallax";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { ResponsiveImage } from "../ui/ResponsiveImage";
import { CyberFrame } from "./CyberFrame";
import type { EventSummary } from "./EventCard";

type Props = {
  event: EventSummary;
  /** Visuel de repli quand l'événement n'en a pas encore (fond Nexen). */
  fallbackImage: string;
  instagramUrl: string | null;
};

/**
 * Hero de l'accueil en « mode spectacle » (DESIGN_SYSTEM §6.2, SITE_PLAN §3.1) : un seul événement,
 * grand cadre cyber de la v1, titre décodé + glitch, grille au sol, visuel en parallaxe.
 */
export function HomeHero({ event, fallbackImage, instagramUrl }: Props) {
  const place = [event.venue, event.city].filter(Boolean).join(", ");
  return (
    <section aria-labelledby="hero-titre" data-floor="hero" className="relative isolate flex min-h-svh items-center overflow-hidden">
      {/* Le visuel s'efface vers le bas : le sol quadrillé global (fixe, SiteBackdrop) apparaît dessous et suit le défilement. */}
      <Parallax speed={50} mouse={14} className="hero-fade absolute -inset-8 -z-20">
        <ResponsiveImage image={event.cover ?? fallbackImage} alt="" sizes="100vw" priority className="opacity-40 mix-blend-luminosity" />
      </Parallax>
      <span aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-transparent via-void/30 to-void/85" />
      <span aria-hidden="true" className="absolute inset-0 -z-10 bg-scanlines" />
      <div className="absolute inset-x-8 top-20 bottom-6 -z-10 hidden md:block">
        <CyberFrame className="size-full" />
      </div>
      <div className="absolute inset-x-3 top-20 bottom-3 -z-10 md:hidden">
        <NeonFrame className="size-full" />
      </div>

      <div className="hero-enter mx-auto w-full max-w-site px-gutter pt-header pb-section md:px-24">
        {event.upcoming ? (
          <Badge variant="live">{event.status === "dernieres-places" ? "Dernières places" : "Prochain événement"}</Badge>
        ) : (
          <Badge variant="neutral">Prochaine édition à venir</Badge>
        )}
        <h1 id="hero-titre" className="glitch mt-5 mb-5 max-w-4xl text-display font-black text-glow-cyan" data-text={event.title}>
          <DecodeText text={event.title} />
        </h1>
        <p className="mb-9 flex flex-wrap gap-x-7 gap-y-3 text-lead">
          {event.upcoming && (
            <span className="inline-flex items-center gap-2.5">
              <CalendarIcon className="text-cyan" />
              {formatDateRange(event)}
            </span>
          )}
          <span className="inline-flex items-center gap-2.5">
            <MapPinIcon className="text-cyan" />
            {place}
          </span>
        </p>
        <div className="flex flex-wrap items-center gap-4">
          {event.upcoming && event.ticketUrl ? (
            <Button size="lg" icon={TicketIcon} href={event.ticketUrl}>
              Billetterie
            </Button>
          ) : (
            <Button size="lg" href="/agenda">
              Voir l'agenda
            </Button>
          )}
          {event.upcoming || !instagramUrl ? (
            <Button variant="secondary" size="lg" href={`/agenda/${event.slug}`}>
              Voir l'événement
            </Button>
          ) : (
            <Button variant="secondary" size="lg" href={instagramUrl}>
              Suivre sur Instagram
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

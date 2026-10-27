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
    <section aria-labelledby="hero-titre" data-floor="hero" className="relative isolate flex min-h-svh flex-col overflow-hidden">
      {/* Le visuel s'efface vers le bas : le sol quadrillé global (fixe, SiteBackdrop) apparaît dessous et suit le défilement. */}
      <Parallax speed={50} mouse={14} className="hero-fade absolute -inset-8 -z-20">
        <ResponsiveImage image={event.cover ?? fallbackImage} alt="" sizes="100vw" priority className="opacity-40 mix-blend-luminosity" />
      </Parallax>
      <span aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-transparent via-void/30 to-void/85" />
      <span aria-hidden="true" className="absolute inset-0 -z-10 bg-scanlines" />

      {/* Boîte cadrée : le cadre en épouse le contour et le contenu garde ses marges intérieures. Si le texte grandit
          (fenêtre étroite ou basse, titre long), la boîte et le cadre grandissent avec : le texte ne passe jamais dessus.
          Grand cadre v1 à partir de lg (dessiné pour le paysage) ; en dessous, équerres néon sur tout l'écran, en-tête compris. */}
      <div className="relative m-2 flex flex-1 md:m-3 lg:mx-8 lg:mt-20 lg:mb-6">
        <div className="absolute inset-0 -z-10 hidden lg:block">
          <CyberFrame className="size-full" />
        </div>
        <div className="absolute inset-0 -z-10 lg:hidden">
          <NeonFrame className="size-full" />
        </div>

        <div className="hero-frame-content hero-enter flex w-full flex-col items-center justify-center px-5 pt-28 pb-16 text-center md:px-12 md:pt-32 md:pb-20 lg:items-start lg:text-left">
          {event.upcoming ? (
            <Badge variant="live">{event.status === "dernieres-places" ? "Dernières places" : "Prochain événement"}</Badge>
          ) : (
            <Badge variant="neutral">Prochaine édition à venir</Badge>
          )}
          <h1 id="hero-titre" className="glitch mt-5 mb-5 max-w-4xl text-display font-black wrap-break-word text-glow-cyan" data-text={event.title}>
            <DecodeText text={event.title} />
          </h1>
          <p className="mb-9 flex flex-wrap justify-center gap-x-7 gap-y-3 text-lead lg:justify-start">
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
          <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
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
      </div>
    </section>
  );
}

import { Link } from "react-router";
import type { DystopsyEvent } from "../../content/schemas";
import { formatDateRange } from "../../lib/events";
import { MapPinIcon, TicketIcon } from "../icons";
import { Badge } from "../ui/Badge";
import { Brackets } from "../ui/Brackets";
import { Button } from "../ui/Button";
import { ResponsiveImage } from "../ui/ResponsiveImage";

export type EventSummary = Pick<
  DystopsyEvent,
  "slug" | "title" | "kind" | "startDate" | "endDate" | "venue" | "city" | "cover" | "ticketUrl" | "status"
> & { upcoming: boolean };

function StatusBadge({ event }: { event: EventSummary }) {
  if (!event.upcoming) return <Badge variant="neutral">Passé</Badge>;
  if (event.status === "complet") return <Badge variant="neutral">Complet</Badge>;
  if (event.status === "annule") return <Badge variant="neutral">Annulé</Badge>;
  if (event.status === "dernieres-places") return <Badge variant="live">Dernières places</Badge>;
  return <Badge variant="info">À venir</Badge>;
}

/**
 * Carte événement (DESIGN_SYSTEM §7.6) : visuel 16:9 gris → couleur au survol, statut, date, titre, lieu,
 * « Voir l'événement » (toute la carte) et bouton « Billets » distinct si à venir.
 */
export function EventCard({ event }: { event: EventSummary }) {
  const canBuy = event.upcoming && event.ticketUrl && event.status !== "complet" && event.status !== "annule";
  return (
    <article className="group relative flex flex-col bg-surface transition-colors duration-base hover:bg-surface-raised">
      <Brackets />
      <div className="relative aspect-video overflow-hidden chamfer-lg">
        <ResponsiveImage
          image={event.cover}
          alt=""
          sizes="(min-width: 64rem) 25rem, (min-width: 48rem) 50vw, 100vw"
          fallbackLabel={event.title}
          className="opacity-70 grayscale transition duration-slow ease-out-expo group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
        />
        <span className="absolute top-3 left-3">
          <StatusBadge event={event} />
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="text-micro font-semibold text-cyan uppercase">{formatDateRange(event)}</span>
        <h3 className="text-h3 font-bold">
          <Link to={`/agenda/${event.slug}`} prefetch="intent" className="no-underline after:absolute after:inset-0">
            {event.title}
          </Link>
        </h3>
        <span className="inline-flex items-center gap-1.5 text-small text-ink-muted">
          <MapPinIcon size={16} className="text-cyan" />
          {[event.venue, event.city].filter(Boolean).join(", ")}
        </span>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
          <span className="font-display text-label font-bold text-cyan uppercase">Voir l'événement →</span>
          {canBuy && (
            <span className="relative z-10">
              <Button size="sm" icon={TicketIcon} href={event.ticketUrl ?? undefined}>
                Billets
              </Button>
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

import type { EventSummary } from "../components/blocks/EventCard";
import { isPast } from "../lib/events";
import type { DystopsyEvent } from "./schemas";

/** Données d'un événement nécessaires aux cartes et au hero (sans le résumé HTML), statut calculé au build. */
export function toSummary(event: DystopsyEvent, now: Date): EventSummary {
  const { slug, title, kind, startDate, endDate, venue, city, cover, ticketUrl, status } = event;
  return { slug, title, kind, startDate, endDate, venue, city, cover, ticketUrl, status, upcoming: !isPast(event, now) };
}

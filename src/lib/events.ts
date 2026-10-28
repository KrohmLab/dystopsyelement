// Logique « prochain événement » (SITE_PLAN §2). Sans dépendance, testée par events.test.ts.
// Les dates sont des chaînes AAAA-MM-JJ, comparées au jour courant à Paris.

type Dated = { startDate: string; endDate: string };

/** Date du jour à Paris, au format AAAA-MM-JJ. */
export function parisDay(now: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

/** Un événement est passé le lendemain de sa date de fin. */
export function isPast(event: Dated, now: Date): boolean {
  return event.endDate < parisDay(now);
}

/** Événements à venir (ou en cours), du plus proche au plus lointain. */
export function getUpcoming<T extends Dated>(events: T[], now: Date): T[] {
  return events.filter((e) => !isPast(e, now)).sort((a, b) => a.startDate.localeCompare(b.startDate));
}

/** Événements passés, du plus récent au plus ancien. */
export function getPast<T extends Dated>(events: T[], now: Date): T[] {
  return events.filter((e) => isPast(e, now)).sort((a, b) => b.startDate.localeCompare(a.startDate));
}

/** Événement mis en avant : le prochain à venir ; sinon le dernier qui a eu lieu, quel qu'il soit. */
export function getFeatured<T extends Dated>(events: T[], now: Date): { event: T; upcoming: boolean } | null {
  const next = getUpcoming(events, now)[0];
  if (next) return { event: next, upcoming: true };
  const last = getPast(events, now)[0];
  return last ? { event: last, upcoming: false } : null;
}

const DAY = new Intl.DateTimeFormat("fr-FR", { day: "numeric", timeZone: "UTC" });
const DAY_MONTH = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", timeZone: "UTC" });
const FULL = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** « 7 mai 2026 », « 5 – 7 juin 2026 », « 30 mai – 1 juin 2026 ». */
export function formatDateRange({ startDate, endDate }: Dated): string {
  const start = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${endDate}T00:00:00Z`);
  if (startDate === endDate) return FULL.format(start);
  if (startDate.slice(0, 7) === endDate.slice(0, 7)) return `${DAY.format(start)} – ${FULL.format(end)}`;
  if (startDate.slice(0, 4) === endDate.slice(0, 4)) return `${DAY_MONTH.format(start)} – ${FULL.format(end)}`;
  return `${FULL.format(start)} – ${FULL.format(end)}`;
}

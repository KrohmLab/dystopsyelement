// Tests de la logique « prochain événement » : `npm test` (node:test, TypeScript natif de Node 24).
import { strict as assert } from "node:assert";
import { test } from "node:test";
import { formatDateRange, getFeatured, getPast, getUpcoming, isPast, parisDay } from "./events.ts";

const at = (iso: string) => new Date(iso);
const nexen = { slug: "nexen", kind: "festival", startDate: "2026-06-05", endDate: "2026-06-07" };
const home = { slug: "home", kind: "soiree", startDate: "2026-05-07", endDate: "2026-05-07" };
const next = { slug: "next", kind: "soiree", startDate: "2027-02-12", endDate: "2027-02-12" };
const later = { slug: "later", kind: "festival", startDate: "2027-06-04", endDate: "2027-06-06" };

test("le jour courant est calculé à Paris", () => {
  // 23:30 UTC le 6 juin = 01:30 le 7 juin à Paris (heure d'été).
  assert.equal(parisDay(at("2026-06-06T23:30:00Z")), "2026-06-07");
});

test("un événement reste à venir jusqu'à la fin de son dernier jour", () => {
  assert.equal(isPast(nexen, at("2026-06-07T21:00:00Z")), false);
  assert.equal(isPast(nexen, at("2026-06-07T22:30:00Z")), true); // 00:30 le 8 juin à Paris
});

test("à venir : du plus proche au plus lointain ; passés : du plus récent au plus ancien", () => {
  const all = [later, home, nexen, next];
  const now = at("2026-10-27T10:00:00Z");
  assert.deepEqual(getUpcoming(all, now).map((e) => e.slug), ["next", "later"]);
  assert.deepEqual(getPast(all, now).map((e) => e.slug), ["nexen", "home"]);
});

test("mis en avant : le prochain événement s'il existe", () => {
  assert.deepEqual(getFeatured([home, nexen, next], at("2026-10-27T10:00:00Z")), { event: next, upcoming: true });
});

test("mis en avant : sinon le dernier festival passé, même si une soirée est plus récente", () => {
  const recentParty = { slug: "party", kind: "soiree", startDate: "2026-09-01", endDate: "2026-09-01" };
  assert.deepEqual(getFeatured([home, nexen, recentParty], at("2026-10-27T10:00:00Z")), { event: nexen, upcoming: false });
});

test("mis en avant : rien sans événement", () => {
  assert.equal(getFeatured([], at("2026-10-27T10:00:00Z")), null);
});

test("dates lisibles en français", () => {
  assert.equal(formatDateRange(home), "7 mai 2026");
  assert.equal(formatDateRange(nexen), "5 – 7 juin 2026");
  assert.equal(formatDateRange({ startDate: "2026-05-30", endDate: "2026-06-01" }), "30 mai – 1 juin 2026");
});

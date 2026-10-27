// Chargement et validation des contenus, exécuté au build (loaders pré-rendus) : jamais envoyé au navigateur.
// Une erreur de validation lève une exception et fait échouer `npm run build`.
import { marked } from "marked";
import { parse as parseYaml } from "yaml";
import type { z } from "zod";
import artistsJson from "../../content/artists.json";
import faqJson from "../../content/faq.json";
import productsJson from "../../content/products.json";
import servicesJson from "../../content/services.json";
import siteJson from "../../content/site.json";
import teamJson from "../../content/team.json";
import imagesJson from "../../assets/images.json";
import {
  artistSchema,
  eventFrontmatterSchema,
  faqSchema,
  memberSchema,
  productSchema,
  serviceSchema,
  siteSchema,
  type DystopsyEvent,
} from "./schemas";

function validate<T extends z.ZodType>(schema: T, data: unknown, source: string): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `  - ${i.path.join(".") || "(racine)"} : ${i.message}`).join("\n");
    throw new Error(`Contenu invalide dans ${source} :\n${issues}`);
  }
  return result.data;
}

export const site = validate(siteSchema, siteJson, "content/site.json");
export const artists = validate(artistSchema.array(), artistsJson, "content/artists.json");
export const team = validate(memberSchema.array(), teamJson, "content/team.json");
export const products = validate(productSchema.array(), productsJson, "content/products.json");
export const services = validate(serviceSchema.array(), servicesJson, "content/services.json");
export const faq = validate(faqSchema.array(), faqJson, "content/faq.json");

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/;
const eventFiles = import.meta.glob<string>("../../content/events/*.md", { query: "?raw", import: "default", eager: true });

function loadEvents(): DystopsyEvent[] {
  const slugs = new Set<string>();
  const events = Object.entries(eventFiles).map(([path, raw]) => {
    const source = path.replace(/^(\.\.\/)+/, "");
    const match = FRONTMATTER.exec(raw);
    if (!match) throw new Error(`Frontmatter introuvable dans ${source}`);
    // Les dates restent des chaînes AAAA-MM-JJ (pas de conversion en Date UTC).
    const fm = validate(eventFrontmatterSchema, parseYaml(match[1] ?? "", { schema: "core" }), source);
    if (slugs.has(fm.slug)) throw new Error(`Slug d'événement en double : ${fm.slug} (${source})`);
    // Le nom du fichier sert à pré-rendre la fiche (react-router.config.ts) : il doit égaler le slug.
    if (!source.endsWith(`/${fm.slug}.md`)) throw new Error(`${source} : le fichier doit s'appeler ${fm.slug}.md`);
    slugs.add(fm.slug);
    const body = (match[2] ?? "").replace(/<!--[\s\S]*?-->/g, "").trim();
    return { ...fm, summaryHtml: body ? (marked.parse(body, { async: false }) as string) : "" };
  });
  return events.sort((a, b) => b.startDate.localeCompare(a.startDate));
}

export const events = loadEvents();

// Contrôles croisés : chaque référence pointe vers un contenu existant.
const images = imagesJson as Record<string, unknown>;
const artistSlugs = new Set(artists.map((a) => a.slug));
for (const event of events) {
  for (const slug of event.lineup) {
    if (!artistSlugs.has(slug)) throw new Error(`content/events/${event.slug}.md : artiste inconnu dans le line-up (${slug})`);
  }
  if (event.cover && !(event.cover in images)) throw new Error(`content/events/${event.slug}.md : visuel inconnu (${event.cover})`);
}
for (const item of [...artists, ...team, ...products, ...services]) {
  const key = "photo" in item ? item.photo : item.image;
  if (key && !(key in images)) throw new Error(`content : visuel inconnu (${key})`);
}

export function getEvent(slug: string): DystopsyEvent | undefined {
  return events.find((e) => e.slug === slug);
}

// Contenus provisoires restants (SITE_PLAN §0) : affichés une fois au build, jamais au navigateur.
const provisional = [
  ...site.placeholders.map((field) => `site.${field}`),
  ...events.filter((e) => e.placeholder || e.summaryHtml.includes("provisoire")).map((e) => `événement ${e.slug}`),
  ...[artists, team, products, services, faq].flat().filter((item) => item.placeholder).map((item) => ("slug" in item ? item.slug : item.question)),
];
if (provisional.length > 0 && !(globalThis as { __provisionalReported?: boolean }).__provisionalReported) {
  (globalThis as { __provisionalReported?: boolean }).__provisionalReported = true;
  console.warn(`⚠ ${provisional.length} contenus provisoires (placeholder) à remplacer avant la mise en ligne publique.`);
}

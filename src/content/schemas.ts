// Schémas des contenus de content/. Stricts : un champ inconnu ou mal typé fait échouer le build.
// `placeholder: true` = contenu provisoire numéroté (SITE_PLAN §0), à remplacer par le vrai contenu de l'asso.
import { z } from "zod";

const url = z.url();
const slug = z.string().regex(/^[a-z0-9-]+$/, "slug : minuscules, chiffres et tirets");
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date attendue au format AAAA-MM-JJ");
/** Clé d'un visuel de assets/images.json (ex. « events/nexen-2026-banner »). */
const imageKey = z.string().regex(/^[a-z]+\/[a-z0-9-]+$/);
const nullable = <T extends z.ZodType>(schema: T) => schema.nullable();
const placeholder = z.boolean().optional();

export const siteSchema = z.strictObject({
  name: z.string().min(1),
  /** Origine publique du site, sans barre finale (workers.dev tant que le domaine n'est pas choisi). */
  url: url.refine((value) => !value.endsWith("/"), "sans barre finale"),
  /** Meta description par défaut (≤ 155 caractères). */
  description: nullable(z.string().max(155)),
  email: nullable(z.email()),
  /** Boutique Vinted (bouton « Voir la boutique Vinted »). */
  shopUrl: nullable(url),
  socials: z.strictObject({
    instagram: nullable(url),
    facebook: nullable(url),
    soundcloud: nullable(url),
    youtube: nullable(url),
  }),
  /** Phrase de présentation du footer. */
  tagline: nullable(z.string().max(160)),
  /** Ville affichée dans le bloc coordonnées de /contact. */
  city: nullable(z.string()),
  contactSubjects: z.array(z.string()).min(1),
  legal: z.strictObject({
    publisher: nullable(z.string()),
    rna: nullable(z.string()),
    address: nullable(z.string()),
    publicationDirector: nullable(z.string()),
  }),
  /** Champs de ce fichier encore provisoires (chemins « socials.instagram »…), comptés au build. */
  placeholders: z.array(z.string()),
  /** Anciennes URL de la v1 → pages v2 (301), écrites dans _redirects par scripts/seo-files.mjs. */
  legacyRedirects: z.record(z.string().startsWith("/"), z.string().startsWith("/")),
});

export const lineupEntrySchema = z.strictObject({
  name: z.string().min(1),
  style: z.string().optional(),
  label: z.string().optional(),
  /** Scène (festivals) : « Nexus », « Engine »… */
  stage: z.string().optional(),
});

export const eventFrontmatterSchema = z
  .strictObject({
    slug,
    title: z.string().min(1),
    kind: z.enum(["festival", "soiree"]),
    startDate: isoDate,
    endDate: isoDate,
    /** Horaires lisibles, ex. « 21:00 → 01:00 ». */
    timeRange: nullable(z.string()),
    venue: z.string().min(1),
    city: nullable(z.string()),
    cover: nullable(imageKey),
    /** Cadrage du visuel au centre du radar du hero (valeur CSS object-position, ex. « 72% 40% »). */
    heroFocus: z
      .string()
      .regex(/^\d{1,3}% \d{1,3}%$/, "heroFocus attend « X% Y% »")
      .default("50% 50%"),
    ticketUrl: nullable(url),
    facebookUrl: nullable(url),
    status: nullable(z.enum(["complet", "dernieres-places", "annule"])),

    /** Line-up : nom, style, label, scène (festivals). Vide si non communiqué. */
    lineup: z.array(lineupEntrySchema).default([]),
    placeholder,
  })
  .refine((e) => e.endDate >= e.startDate, { message: "endDate doit suivre startDate" });

export const memberSchema = z.strictObject({
  slug,
  name: z.string().min(1),
  role: z.string(),
  pole: z.enum(["Direction", "Organisation", "Technique"]),
  photo: nullable(imageKey),
  bio: nullable(z.string().max(400)),
  placeholder,
});

/** Une annonce Vinted = une coupe et une taille d'un produit (la boutique vend chaque pièce séparément). */
export const productVariantSchema = z.strictObject({
  cut: z.enum(["H", "F"]),
  size: z.enum(["XS", "S", "M", "L", "XL", "XXL"]),
  vintedUrl: url,
});

export const productSchema = z.strictObject({
  slug,
  name: z.string().min(1),
  category: z.enum(["T-shirts", "Sweats", "Accessoires"]),
  price: z.string(),
  /** Visuel principal (dos), puis visuel au survol (face). */
  image: nullable(imageKey),
  imageAlt: nullable(imageKey),
  /** Courte description (≤ 220 caractères). */
  description: nullable(z.string().max(220)),
  /** Annonces disponibles ; vide = produit épuisé (lien vers la boutique). */
  variants: z.array(productVariantSchema),
  placeholder,
});

export const serviceSchema = z.strictObject({
  slug,
  title: z.string().min(1),
  tagline: z.string().max(110),
  points: z.array(z.string()).max(3),
  image: nullable(imageKey),
  placeholder,
});

export const faqSchema = z.strictObject({
  question: z.string().min(1),
  answer: z.string().max(280),
  placeholder,
});

const time = z.string().regex(/^\d{2}:\d{2}$/, "heure attendue au format HH:MM");
const stageSlug = z.enum(["nexus", "engine"]);
const day = z.enum(["Vendredi", "Samedi", "Dimanche"]);

/** Festival détaillé (content/festival/*.json) : scènes, timetable, infos pratiques, carte, village, crew. */
export const festivalSchema = z.strictObject({
  slug,
  title: z.string(),
  /** Slug de l'événement correspondant dans content/events/. */
  event: slug,
  tagline: z.string(),
  facts: z.array(z.strictObject({ value: z.string(), label: z.string() })),
  experience: z.array(z.strictObject({ title: z.string(), text: z.string(), icon: z.string() })),
  stages: z.array(
    z.strictObject({ slug: stageSlug, name: z.string(), role: z.string(), families: z.array(z.string()), mapping: z.array(z.string()) }),
  ),
  days: z.array(z.strictObject({ key: day, date: isoDate, label: z.string() })),
  families: z.array(z.string()),
  sets: z.array(
    z.strictObject({
      slug,
      artist: z.string(),
      stage: stageSlug,
      day,
      date: isoDate,
      start: time,
      end: time,
      style: z.string(),
      family: z.string(),
      label: nullable(z.string()),
      soundcloud: nullable(url),
    }),
  ),
  breaks: z.array(
    z.strictObject({ stage: stageSlug, day, start: time, end: nullable(time), kind: z.literal("fin").optional() }),
  ),
  schedule: z.array(z.strictObject({ when: z.string(), what: z.string() })),
  practical: z.strictObject({
    knowTitle: z.string(),
    know: z.array(z.string()),
    bring: z.array(z.string()),
    forbidden: z.array(z.string()),
  }),
  map: z.strictObject({
    zones: z.array(
      z.strictObject({
        id: z.string(),
        name: z.string(),
        kind: z.enum(["festival", "village", "benevoles", "chill", "camping", "parking"]),
        text: z.string(),
      }),
    ),
    legend: z.array(z.strictObject({ kind: z.string(), label: z.string() })),
    services: z.array(z.string()),
  }),
  village: z.strictObject({
    stands: z.array(z.strictObject({ name: z.string(), what: z.string() })),
    food: z.array(z.strictObject({ name: z.string(), what: z.string() })),
    gallery: z.array(z.string()),
  }),
  crew: z.array(z.strictObject({ role: z.string(), names: z.array(z.string()) })),
  links: z.strictObject({ ticket: url, merch: url, carpool: url, facebook: url }),
  source: z.string(),
});

export type Site = z.infer<typeof siteSchema>;
export type Festival = z.infer<typeof festivalSchema>;
export type FestivalSet = Festival["sets"][number];
export type Member = z.infer<typeof memberSchema>;
export type Product = z.infer<typeof productSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type Faq = z.infer<typeof faqSchema>;

/** Événement publié, prêt pour l'interface (résumé Markdown rendu en HTML). */
export type DystopsyEvent = z.infer<typeof eventFrontmatterSchema> & { summaryHtml: string };

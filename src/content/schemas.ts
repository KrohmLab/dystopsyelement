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
    ticketUrl: nullable(url),
    facebookUrl: nullable(url),
    status: nullable(z.enum(["complet", "dernieres-places", "annule"])),
    /** Slugs des artistes de content/artists.json. */
    lineup: z.array(slug),
    placeholder,
  })
  .refine((e) => e.endDate >= e.startDate, { message: "endDate doit suivre startDate" });

export const artistSchema = z.strictObject({
  slug,
  name: z.string().min(1),
  format: z.enum(["Live", "DJ Set"]),
  genre: z.string(),
  photo: nullable(imageKey),
  bio: nullable(z.string().max(400)),
  links: z.strictObject({ soundcloud: nullable(url), instagram: nullable(url) }),
  placeholder,
});

export const memberSchema = z.strictObject({
  slug,
  name: z.string().min(1),
  role: z.string(),
  pole: z.enum(["Direction", "Organisation", "Technique"]),
  photo: nullable(imageKey),
  bio: nullable(z.string().max(400)),
  placeholder,
});

export const productSchema = z.strictObject({
  slug,
  name: z.string().min(1),
  category: z.enum(["T-shirts", "Pulls", "Autres"]),
  price: z.string(),
  image: nullable(imageKey),
  /** Annonce Vinted du produit. */
  vintedUrl: url,
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

export type Site = z.infer<typeof siteSchema>;
export type Artist = z.infer<typeof artistSchema>;
export type Member = z.infer<typeof memberSchema>;
export type Product = z.infer<typeof productSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type Faq = z.infer<typeof faqSchema>;

/** Événement publié, prêt pour l'interface (résumé Markdown rendu en HTML). */
export type DystopsyEvent = z.infer<typeof eventFrontmatterSchema> & { summaryHtml: string };

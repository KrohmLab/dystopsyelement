// Schémas des contenus de content/. Stricts : un champ inconnu ou mal typé fait échouer le build.
// Les champs à null sont des contenus que l'asso n'a pas encore fournis : l'interface masque l'élément.
import { z } from "zod";

const url = z.url();
const nullable = <T extends z.ZodType>(schema: T) => schema.nullable();

export const siteSchema = z.strictObject({
  name: z.string().min(1),
  /** Origine publique du site, sans barre finale (workers.dev tant que le domaine n'est pas choisi). */
  url: url.refine((value) => !value.endsWith("/"), "sans barre finale"),
  /** Meta description par défaut (≤ 155 caractères). */
  description: nullable(z.string().max(155)),
  email: nullable(z.email()),
  /** Boutique Vinted. Sans URL, pas de lien Shop et /shop redirige vers l'accueil. */
  shopUrl: nullable(url),
  socials: z.strictObject({
    instagram: nullable(url),
    facebook: nullable(url),
    soundcloud: nullable(url),
    youtube: nullable(url),
  }),
  /** Phrase de présentation du footer. */
  tagline: nullable(z.string()),
  contactSubjects: z.array(z.string()),
  legal: z.strictObject({
    rna: nullable(z.string()),
    address: nullable(z.string()),
    publisher: nullable(z.string()),
  }),
  /** Anciennes URL de la v1 → pages v2 (301), écrites dans _redirects par scripts/seo-files.mjs. */
  legacyRedirects: z.record(z.string().startsWith("/"), z.string().startsWith("/")),
});

export type Site = z.infer<typeof siteSchema>;

// Chargement et validation des contenus, exécuté au build (loaders pré-rendus) : jamais envoyé au navigateur.
// Une erreur de validation lève une exception et fait échouer `npm run build`.
import type { z } from "zod";
import siteJson from "../../content/site.json";
import { siteSchema } from "./schemas";

function validate<T extends z.ZodType>(schema: T, data: unknown, source: string): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `  - ${i.path.join(".") || "(racine)"} : ${i.message}`).join("\n");
    throw new Error(`Contenu invalide dans ${source} :\n${issues}`);
  }
  return result.data;
}

export const site = validate(siteSchema, siteJson, "content/site.json");

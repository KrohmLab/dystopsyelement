import type { Site } from "./content/schemas";
import siteJson from "../content/site.json";

// Réglages du site côté navigateur. La validation (zod) a lieu au build dans content/load.server.ts :
// ici, simple typage, pour ne pas envoyer zod au navigateur.
export const site = siteJson as Site;

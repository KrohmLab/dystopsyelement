// Visuels réels de assets/ (AVIF + WebP aux largeurs de assets/images.json), pour <ResponsiveImage>.
import manifest from "../../assets/images.json";

const files = import.meta.glob<string>("../../assets/{events,festival,shop}/*.{avif,webp}", { import: "default", eager: true, query: "?url" });

export type ImageSources = { avif: string; webp: string; src: string; width: number; height: number };

/** Sources d'un visuel par sa clé (« festival/fond »), ou null s'il n'existe pas. */
export function getImage(key: string | null | undefined): ImageSources | null {
  if (!key) return null;
  const entry = (manifest as Record<string, { width: number; height: number; widths: number[] }>)[key];
  if (!entry) return null;
  const url = (w: number, ext: string) => files[`../../assets/${key}-${w}.${ext}`] ?? "";
  const set = (ext: string) => entry.widths.map((w) => `${url(w, ext)} ${w}w`).join(", ");
  const middle = entry.widths[Math.min(1, entry.widths.length - 1)] ?? entry.width;
  return { avif: set("avif"), webp: set("webp"), src: url(middle, "webp"), width: entry.width, height: entry.height };
}

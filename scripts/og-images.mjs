// Images de partage (Open Graph, 1200 × 630, JPEG) dans public/og/ : site, pages principales, chaque événement
// (depuis son visuel) et chaque album photo. À relancer après l'ajout d'un événement ou d'un album : `npm run og`.
// Une page dont l'image manque utilise /og/site.jpg (voir src/lib/seo.ts et src/content/load.server.ts).
// sharp vient de wrangler (dépendance de développement) : le script tourne en local, les images sont versionnées.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = new URL("../", import.meta.url).pathname;
const out = path.join(root, "public/og");
const W = 1200;
const H = 630;

/** Plus grand fichier WebP d'un visuel de assets/images.json (ex. « events/nexen-2026-banner »). */
function asset(key) {
  const [dir, name] = key.split("/");
  const files = fs.readdirSync(path.join(root, "assets", dir)).filter((f) => new RegExp(`^${name}-(\\d+)\\.webp$`).test(f));
  const best = files.sort((a, b) => Number(b.match(/-(\d+)\.webp$/)[1]) - Number(a.match(/-(\d+)\.webp$/)[1]))[0];
  return best ? path.join(root, "assets", dir, best) : null;
}

// Logo Dystopsy en blanc, avec un halo cyan, posé sur les visuels du site.
const logoSvg = fs.readFileSync(path.join(root, "assets/brand/logo-dystopsy.svg"), "utf8").replace('fill="currentColor"', 'fill="#ffffff"');
const logo = await sharp(Buffer.from(logoSvg)).resize(300, 300).png().toBuffer();
// Halo : disque plein (le logo est ajouré, un halo calqué sur lui transparaîtrait dans les découpes).
const glow = await sharp(Buffer.from('<svg width="360" height="360"><circle cx="180" cy="180" r="150" fill="#75feed"/></svg>')).blur(18).png().toBuffer();
const shade = Buffer.from(
  `<svg width="${W}" height="${H}"><defs><radialGradient id="g"><stop offset="0" stop-color="#05070a" stop-opacity="0.15"/><stop offset="1" stop-color="#05070a" stop-opacity="0.75"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`,
);

/** Visuel recadré en 1200 × 630 ; un visuel trop haut ou trop étroit est posé entier sur un fond flou de lui-même. */
async function frame(input, { position = "attention" } = {}) {
  const meta = await sharp(input).metadata();
  const ratio = meta.width / meta.height;
  if (ratio > 1.5) return sharp(input).resize(W, H, { fit: "cover", position });
  const background = await sharp(input).resize(W, H, { fit: "cover" }).blur(30).modulate({ brightness: 0.45 }).toBuffer();
  const front = await sharp(input).resize(W, H, { fit: "inside" }).toBuffer();
  return sharp(background).composite([{ input: front, gravity: "center" }]);
}

async function save(image, name, { withLogo = false } = {}) {
  const file = path.join(out, `${name}.jpg`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  let pipeline = image;
  if (withLogo) {
    const base = await image.toBuffer();
    pipeline = sharp(base).composite([{ input: shade }, { input: glow, gravity: "center" }, { input: logo, gravity: "center" }]);
  }
  await pipeline.jpeg({ quality: 82, mozjpeg: true }).toFile(file);
}

let count = 0;
const done = async (promise) => {
  await promise;
  count++;
};

// Site (accueil et pages sans image propre) : mapping néon de la scène + logo.
await done(save(await frame(asset("festival/portail-galerie")), "site", { withLogo: true }));
await done(save(await frame(asset("events/nexen-2026-banner")), "nexen"));
await done(save(await frame(asset("festival/photo-don")), "galerie", { withLogo: true }));
await done(save(await frame(asset("shop/merch-2026")), "shop"));

// Événements : leur visuel officiel.
for (const file of fs.readdirSync(path.join(root, "content/events")).filter((f) => /^[a-z0-9-]+\.md$/.test(f))) {
  const raw = fs.readFileSync(path.join(root, "content/events", file), "utf8");
  const cover = raw.match(/^cover:\s*"?([a-z]+\/[a-z0-9-]+)"?\s*$/m)?.[1];
  const input = cover && asset(cover);
  if (input) await done(save(await frame(input), `agenda/${file.replace(/\.md$/, "")}`));
}

// Albums : leur première photo (grand format AVIF).
for (const album of JSON.parse(fs.readFileSync(path.join(root, "content/gallery.json"), "utf8"))) {
  const first = album.photos[0];
  const input = first && path.join(root, "public/photos", String(album.year), album.slug, `${first.id}-l.avif`);
  if (input && fs.existsSync(input)) await done(save(await frame(input), `galerie/${album.year}-${album.slug}`));
}

console.log(`og: ${count} images dans public/og/`);

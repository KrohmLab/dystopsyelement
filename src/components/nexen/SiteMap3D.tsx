import { useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState, type CSSProperties } from "react";
import type { Festival } from "../../content/schemas";
import { cn } from "../../lib/cn";
import { useMotionLevel } from "../../lib/useMotionLevel";
import { Eyebrow } from "../layout/SectionHeader";

type Zone = Festival["map"]["zones"][number];
type Kind = Zone["kind"];

// Tracés repris de la carte officielle « Map festival 2026 » (en % du plan, 1000 × 620).
const PLATFORM = "14% 40%, 20% 18%, 30% 13%, 40% 5%, 53% 5%, 60% 22%, 88% 27%, 91% 62%, 62% 71%, 20% 71%, 13% 56%";
const SHAPES: Record<string, { points: string; label: [number, number]; z: number }> = {
  benevoles: { points: "21% 20%, 31% 17%, 32% 31%, 20% 33%", label: [26, 24], z: 34 },
  village: { points: "17% 36%, 31% 34%, 31% 62%, 16% 63%", label: [23, 49], z: 34 },
  festival: { points: "33% 14%, 40% 10%, 52% 10%, 56% 22%, 56% 50%, 51% 62%, 33% 62%", label: [0, 0], z: 30 },
  chill: { points: "55% 53%, 62% 51%, 63% 63%, 56% 66%", label: [59, 59], z: 40 },
  camping: { points: "60% 30%, 88% 32%, 88% 58%, 61% 60%", label: [74, 38], z: 22 },
  parking: { points: "16% 78%, 34% 76%, 36% 92%, 15% 93%", label: [25, 85], z: 18 },
};
// Points d'intérêt de la zone festival.
const SPOTS: { id: string; name: string; at: [number, number]; z: number }[] = [
  { id: "nexus", name: "Nexus", at: [44, 9], z: 150 },
  { id: "engine", name: "Engine", at: [40, 45], z: 120 },
  { id: "bar", name: "Bar", at: [50, 25], z: 80 },
  { id: "galerie", name: "Galerie", at: [49, 43], z: 80 },
];
const TENTS: [number, number][] = [[66, 38], [74, 36], [82, 41], [69, 50], [79, 52]];
const CARS: [number, number][] = [[21, 84], [29, 83]];
const ENTRANCES: { name: string; at: [number, number] }[] = [
  { name: "Entrée village", at: [12, 47] },
  { name: "Entrée camping", at: [58, 35] },
];

const KIND_BG: Record<Kind, string> = {
  festival: "bg-cyan/60",
  village: "bg-nexen-gold/80",
  benevoles: "bg-nexen-ember/80",
  chill: "bg-pink/70",
  camping: "bg-ink-faint/60",
  parking: "bg-ink-faint/60",
};
const KIND_DOT: Record<string, string> = {
  festival: "bg-cyan",
  village: "bg-nexen-gold",
  benevoles: "bg-nexen-ember",
  chill: "bg-pink",
  camping: "bg-ink-faint",
  parking: "bg-ink-faint",
};

const at = ([x, y]: [number, number], z: number): CSSProperties => ({ left: `${x}%`, top: `${y}%`, "--z": `${z}px` }) as CSSProperties;

/**
 * Carte du site en 3D (page Nexen) : au défilement, le plan vu de dessus bascule en vue isométrique et ses
 * éléments se soulèvent (zones, scènes en tours néon, tentes, étiquettes). Zones cliquables avec leur descriptif.
 * Une seule variable CSS (--p, de 0 à 1) pilote toute la scène (styles dans theme.css).
 * Mouvement réduit et sans JavaScript : état final, sans défilement accroché.
 */
export function SiteMap3D({ map }: { map: Festival["map"] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const level = useMotionLevel();
  const animate = level !== "reduced";
  const [active, setActive] = useState<string>("nexus");

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    // Le plan s'ouvre sur les deux premiers tiers du défilement, puis reste ouvert.
    sceneRef.current?.style.setProperty("--p", animate ? String(Math.min(1, progress * 1.5)) : "1");
  });

  const zones = map.zones;
  const activeZone = zones.find((z) => z.id === active) ?? zones[0];

  return (
    <section ref={sectionRef} aria-labelledby="carte-titre" data-animate={animate || undefined} className="map3d relative">
      <div className="map3d__viewport">
        <div className="relative z-10 mx-auto w-full max-w-site px-gutter pt-header">
          <Eyebrow tone="pink">Map festival 2026</Eyebrow>
          <h2 id="carte-titre" className="text-h2 font-black">
            La carte du site
          </h2>
        </div>

        <div className="map3d__stage" aria-hidden="true">
          <div ref={sceneRef} className="map3d__plane">
            <span className="map3d__floor" />
            <svg className="map3d__road" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M14 74 C 30 66, 60 80, 93 67" />
            </svg>
            {[0, 1, 2].map((slice) => (
              <span key={slice} className="map3d__slab bg-nexen-violet" style={{ clipPath: `polygon(${PLATFORM})`, "--z": `${4 + slice * 4}px`, opacity: slice === 2 ? 0.85 : 0.5 } as CSSProperties} />
            ))}
            {zones
              .filter((zone) => SHAPES[zone.kind === "festival" ? "festival" : zone.id] && (zone.kind !== "festival" || zone.id === "nexus"))
              .map((zone) => {
                const key = zone.kind === "festival" ? "festival" : zone.id;
                const shape = SHAPES[key];
                if (!shape) return null;
                const isActive = activeZone?.kind === zone.kind && (zone.kind === "festival" || activeZone?.id === zone.id);
                return [0, 1].map((slice) => (
                  <span
                    key={`${key}-${slice}`}
                    className={cn("map3d__slab", KIND_BG[zone.kind], slice === 1 && "map3d__top", slice === 1 && isActive && "map3d__top--active")}
                    style={{ clipPath: `polygon(${shape.points})`, "--z": `${shape.z + slice * 6 + (isActive && slice === 1 ? 14 : 0)}px` } as CSSProperties}
                  />
                ));
              })}
            {SPOTS.slice(0, 2).map((spot) => (
              <span key={spot.id} className={cn("map3d__tower", spot.id === "nexus" ? "map3d__tower--nexus" : "map3d__tower--engine")} style={at(spot.at, 0)}>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <span key={i} style={{ "--z": `${40 + i * 18}px` } as CSSProperties} />
                ))}
              </span>
            ))}
            {TENTS.map((pos, i) => (
              <span key={i} className="map3d__tent" style={at(pos, 30)} />
            ))}
            {CARS.map((pos, i) => (
              <span key={i} className="map3d__car" style={at(pos, 24)} />
            ))}
            {SPOTS.map((spot) => (
              <span key={spot.id} className="map3d__label map3d__label--spot" style={at(spot.at, spot.z)}>
                {spot.name}
              </span>
            ))}
            {zones
              .filter((zone) => zone.kind !== "festival")
              .map((zone) => {
                const shape = SHAPES[zone.id];
                return shape ? (
                  <span key={zone.id} className="map3d__label" style={at(shape.label, shape.z + 50)}>
                    {zone.name}
                  </span>
                ) : null;
              })}
            {ENTRANCES.map((entrance) => (
              <span key={entrance.name} className="map3d__label map3d__label--small" style={at(entrance.at, 60)}>
                {entrance.name}
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-site px-gutter pb-6">
          <div className="map3d__panel ml-auto max-w-md bg-surface/85 p-4 backdrop-blur-sm inset-ring inset-ring-nexen-lilac-line chamfer-md md:p-5">
            <ul className="-mx-1 mb-3 flex gap-2 overflow-x-auto px-1 pb-1 md:mx-0 md:mb-4 md:flex-wrap md:overflow-visible md:px-0" aria-label="Zones du site">
              {zones.map((zone) => (
                <li key={zone.id}>
                  <button
                    type="button"
                    aria-pressed={zone.id === activeZone?.id}
                    onClick={() => setActive(zone.id)}
                    onMouseEnter={() => setActive(zone.id)}
                    onFocus={() => setActive(zone.id)}
                    className={cn(
                      "inline-flex min-h-9 cursor-pointer items-center gap-2 px-3 text-micro font-semibold whitespace-nowrap uppercase transition-colors duration-fast chamfer-sm",
                      zone.id === activeZone?.id ? "bg-ink text-on-accent" : "bg-void/70 text-ink-soft hover:text-ink",
                    )}
                  >
                    <span aria-hidden="true" className={cn("size-2.5 rounded-full", KIND_DOT[zone.kind])} />
                    {zone.name}
                  </button>
                </li>
              ))}
            </ul>
            {activeZone && (
              <p aria-live="polite" className="text-small text-ink-soft md:text-body">
                <b className="font-display text-label font-bold text-ink uppercase">{activeZone.name}</b>
                <br />
                {activeZone.text}
              </p>
            )}
            <p className="mt-4 hidden border-t border-line pt-3 text-micro font-semibold text-ink-muted uppercase md:block">{map.services.join(" · ")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

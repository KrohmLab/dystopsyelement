import { useEffect, useRef, useState, type PointerEvent } from "react";
import { createPortal } from "react-dom";
import type { Album } from "../../content/schemas";
import { photoSrc } from "../../lib/gallery";
import { useModal } from "../../lib/useModal";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from "../icons";
import { CreditName } from "./ProfileLink";

type Photo = Album["photos"][number];

type Props = {
  album: Pick<Album, "year" | "slug" | "photographer" | "profile">;
  photos: Photo[];
  index: number;
  onIndex: (index: number) => void;
  onClose: () => void;
};

const NAV = "grid size-12 cursor-pointer place-items-center bg-void/70 text-ink transition-colors duration-fast chamfer-sm hover:text-cyan disabled:pointer-events-none disabled:opacity-30";

/**
 * Visionneuse plein écran de la galerie : photo grand format, précédente / suivante (boutons, flèches du
 * clavier, glissé au doigt), Échap pour fermer, focus piégé. Les photos voisines sont préchargées.
 */
export function Lightbox({ album, photos, index, onIndex, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const photo = photos[index];
  const [loaded, setLoaded] = useState<string | null>(null);
  const start = useRef<number | null>(null);
  useModal({ open: true, onClose, containers: [ref], initialFocus: closeRef });

  const go = (delta: number) => {
    const next = index + delta;
    if (next >= 0 && next < photos.length) onIndex(next);
  };

  // Flèches du clavier (Échap est géré par useModal).
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") onIndex(Math.min(index + 1, photos.length - 1));
      if (event.key === "ArrowLeft") onIndex(Math.max(index - 1, 0));
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [index, photos.length, onIndex]);

  // Préchargement des voisines : la suivante s'affiche sans attente.
  useEffect(() => {
    for (const i of [index + 1, index - 1, index + 2]) {
      const neighbour = photos[i];
      if (neighbour) new Image().src = photoSrc(album, neighbour.id, "l");
    }
  }, [album, photos, index]);

  const down = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") start.current = event.clientX;
  };
  const up = (event: PointerEvent) => {
    if (start.current === null) return;
    const dx = event.clientX - start.current;
    start.current = null;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  };

  if (!photo) return null;
  return createPortal(
    <div ref={ref} role="dialog" aria-modal="true" aria-label={`Photo ${index + 1} sur ${photos.length}, ${album.photographer}`} className="lightbox fixed inset-0 z-50 flex flex-col bg-void/95 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-gutter">
        <p className="font-display text-label-sm font-bold text-ink-soft uppercase" aria-live="polite">
          <span className="text-ink tabular-nums">{index + 1}</span> / {photos.length} · <CreditName name={album.photographer} url={album.profile} /> · Nexen {album.year}
        </p>
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Fermer la visionneuse" className={NAV}>
          <CloseIcon size={24} />
        </button>
      </div>

      <div className="relative min-h-0 flex-1 touch-pan-y select-none" onPointerDown={down} onPointerUp={up} onPointerCancel={() => (start.current = null)}>
        {loaded !== photo.id && <span aria-hidden="true" className="lightbox__loader" />}
        <img
          key={photo.id}
          src={photoSrc(album, photo.id, "l")}
          width={photo.w}
          height={photo.h}
          alt={`Nexen Festival ${album.year}, photo de ${album.photographer} (${index + 1} sur ${photos.length})`}
          decoding="async"
          onLoad={() => setLoaded(photo.id)}
          draggable={false}
          className="lightbox__img absolute inset-0 m-auto size-full object-contain px-2 sm:px-20"
        />
        <button type="button" onClick={() => go(-1)} disabled={index === 0} aria-label="Photo précédente" className={`${NAV} absolute top-1/2 left-2 hidden -translate-y-1/2 sm:grid`}>
          <ArrowLeftIcon size={24} />
        </button>
        <button type="button" onClick={() => go(1)} disabled={index === photos.length - 1} aria-label="Photo suivante" className={`${NAV} absolute top-1/2 right-2 hidden -translate-y-1/2 sm:grid`}>
          <ArrowRightIcon size={24} />
        </button>
      </div>

      {/* Mobile : boutons sous la photo, à portée du pouce (le glissé fonctionne aussi). */}
      <div className="flex justify-center gap-4 px-4 py-3 sm:hidden">
        <button type="button" onClick={() => go(-1)} disabled={index === 0} aria-label="Photo précédente" className={NAV}>
          <ArrowLeftIcon size={24} />
        </button>
        <button type="button" onClick={() => go(1)} disabled={index === photos.length - 1} aria-label="Photo suivante" className={NAV}>
          <ArrowRightIcon size={24} />
        </button>
      </div>
    </div>,
    document.body,
  );
}

import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import type { Album } from "../../content/schemas";
import { photoSrc } from "../../lib/gallery";

// La visionneuse n'est chargée qu'au premier clic sur une photo.
const Lightbox = lazy(() => import("./Lightbox").then((m) => ({ default: m.Lightbox })));

type Props = { album: Pick<Album, "year" | "slug" | "photographer" | "photos"> };

/** Vignettes rendues d'abord (pré-rendu), puis par paquets au défilement : HTML léger, DOM qui grandit à la demande. */
const BATCH = 40;

/**
 * Grille d'un album : vignettes carrées 480 px (AVIF, chargement différé sauf la première rangée), ouverture
 * de la visionneuse au clic. La photo ouverte est dans l'URL (?photo=…) : lien partageable.
 */
export function PhotoGrid({ album }: Props) {
  const { photos } = album;
  const [params, setParams] = useSearchParams();
  const found = photos.findIndex((p) => p.id === params.get("photo"));
  const open = found >= 0 ? found : null;
  const [batches, setBatches] = useState(1);
  // La photo ouverte (lien partagé, visionneuse) est toujours rendue dans la grille.
  const shown = Math.max(batches * BATCH, (open ?? -1) + 1);
  const sentinel = useRef<HTMLLIElement>(null);

  // Paquet suivant quand la fin de la grille approche (une demi-hauteur d'écran avant).
  useEffect(() => {
    const el = sentinel.current;
    if (!el || shown >= photos.length) return;
    const io = new IntersectionObserver(([entry]) => entry?.isIntersecting && setBatches((n) => n + 1), { rootMargin: "0px 0px 50% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [shown, photos.length]);

  const select = useCallback(
    (i: number | null) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (i === null) next.delete("photo");
          else next.set("photo", photos[i]?.id ?? "");
          return next;
        },
        { replace: true, preventScrollReset: true },
      );
    },
    [photos, setParams],
  );

  return (
    <>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 xl:grid-cols-5">
        {photos.slice(0, shown).map((photo, i) => (
          <li key={photo.id} className="photo-tile">
            <button
              type="button"
              onClick={() => select(i)}
              className="group relative block aspect-square w-full cursor-zoom-in overflow-hidden bg-surface chamfer-sm"
              aria-label={`Agrandir la photo ${i + 1} sur ${photos.length}`}
            >
              <img
                src={photoSrc(album, photo.id, "s")}
                width={480}
                height={480}
                alt=""
                loading={i < 10 ? "eager" : "lazy"}
                fetchPriority={i < 4 ? "high" : undefined}
                decoding="async"
                className="size-full object-cover transition duration-slow ease-out-expo group-hover:scale-105"
              />
            </button>
          </li>
        ))}
        {shown < photos.length && <li ref={sentinel} aria-hidden="true" className="col-span-full h-px" />}
      </ul>
      {open !== null && (
        <Suspense fallback={null}>
          <Lightbox album={album} photos={photos} index={open} onIndex={select} onClose={() => select(null)} />
        </Suspense>
      )}
    </>
  );
}

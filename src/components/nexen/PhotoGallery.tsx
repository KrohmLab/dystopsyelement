import { useState } from "react";
import type { Festival } from "../../content/schemas";
import { Reveal } from "../motion/Reveal";
import { Button } from "../ui/Button";
import { ResponsiveImage } from "../ui/ResponsiveImage";
import { Segmented } from "../ui/Segmented";

type Album = Festival["gallery"][number];

/**
 * Galerie de l'édition (page Nexen) : un album par photographe, au choix. Une sélection de photos sur le site,
 * l'album complet sur la page Facebook de l'asso. Crédit du photographe sous la grille.
 */
export function PhotoGallery({ albums }: { albums: Album[] }) {
  const [current, setCurrent] = useState(albums[0]?.photographer ?? "");
  const album = albums.find((a) => a.photographer === current) ?? albums[0];
  if (!album) return null;

  return (
    <div className="flex flex-col gap-8">
      {albums.length > 1 && (
        <Segmented
          label="Photographe"
          options={albums.map((a) => ({ value: a.photographer, label: a.photographer, activeClass: "bg-nexen-lilac text-on-accent" }))}
          value={album.photographer}
          onChange={setCurrent}
          className="sm:max-w-xl"
        />
      )}
      <ul key={album.photographer} className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4" aria-label={`Photos de ${album.photographer}`}>
        {album.photos.map(({ image, alt }, i) => (
          <Reveal as="li" key={image} delay={(i % 4) * 60} className={i === 0 ? "col-span-2 row-span-2" : undefined}>
            <div className="group aspect-square overflow-hidden chamfer-md">
              <ResponsiveImage
                image={image}
                alt={alt}
                sizes={i === 0 ? "(min-width: 48rem) 50vw, 100vw" : "(min-width: 48rem) 25vw, 50vw"}
                className="transition duration-slow ease-out-expo group-hover:scale-105"
              />
            </div>
          </Reveal>
        ))}
      </ul>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-small text-ink-muted">
          Photos : <span className="font-semibold text-ink">{album.photographer}</span> · {album.photos.length} sur {album.count}
        </p>
        <Button variant="secondary" href={album.albumUrl}>
          Tout l'album ({album.count} photos)
        </Button>
      </div>
    </div>
  );
}

import { useState } from "react";
import type { Album } from "../../content/schemas";
import { albumPath, photoSrc } from "../../lib/gallery";
import { ProfileLink } from "../gallery/ProfileLink";
import { Reveal } from "../motion/Reveal";
import { Button } from "../ui/Button";
import { Segmented } from "../ui/Segmented";

type Preview = Pick<Album, "year" | "slug" | "photographer" | "profile"> & { count: number; photos: string[] };

/**
 * Aperçu de la galerie sur la page Nexen : un album par photographe, au choix, quelques photos réparties
 * sur tout l'album, puis le lien vers l'album complet dans la page Galerie.
 */
export function PhotoGallery({ albums }: { albums: Preview[] }) {
  const [current, setCurrent] = useState(albums[0]?.slug ?? "");
  const album = albums.find((a) => a.slug === current) ?? albums[0];
  if (!album) return null;

  return (
    <div className="flex flex-col gap-8">
      {albums.length > 1 && (
        <Segmented
          label="Photographe"
          options={albums.map((a) => ({ value: a.slug, label: a.photographer, activeClass: "bg-nexen-lilac text-on-accent" }))}
          value={album.slug}
          onChange={setCurrent}
          className="sm:max-w-xl"
        />
      )}
      <ul key={album.slug} className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4" aria-label={`Photos de ${album.photographer}`}>
        {album.photos.map((id, i) => (
          <Reveal as="li" key={id} delay={(i % 4) * 60} className={i === 0 ? "col-span-2 row-span-2" : undefined}>
            <div className="group aspect-square overflow-hidden bg-surface chamfer-md">
              <img
                src={photoSrc(album, id, i === 0 ? "l" : "s")}
                width={480}
                height={480}
                alt={`Nexen Festival ${album.year}, photo de ${album.photographer}`}
                loading="lazy"
                decoding="async"
                className="size-full object-cover transition duration-slow ease-out-expo group-hover:scale-105"
              />
            </div>
          </Reveal>
        ))}
      </ul>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex flex-wrap items-center gap-3 text-small text-ink-muted">
          <span>
            Photos : <span className="font-semibold text-ink">{album.photographer}</span>
          </span>
          <ProfileLink name={album.photographer} url={album.profile} />
        </p>
        <Button variant="secondary" href={albumPath(album)}>
          Voir les {album.count} photos
        </Button>
      </div>
    </div>
  );
}

import { data, Link } from "react-router";
import { PageHero } from "../components/blocks/PageHero";
import { FilterLinks } from "../components/gallery/FilterLinks";
import { ArrowRightIcon } from "../components/icons";
import { Section } from "../components/layout/Section";
import { Brackets } from "../components/ui/Brackets";
import { albums } from "../content/load.server";
import { albumPath, photoSrc, spread } from "../lib/gallery";
import { pageMeta } from "../lib/seo";
import type { Route } from "./+types/galerie";

export function loader({ params }: Route.LoaderArgs) {
  const year = params.annee ? Number(params.annee) : null;
  if (year !== null && !albums.some((a) => a.year === year)) throw data("Année introuvable", { status: 404 });
  // Seules les données des couvertures partent dans la page (pas les listes complètes de photos).
  return {
    year,
    albums: albums.map((album) => ({
      year: album.year,
      slug: album.slug,
      photographer: album.photographer,
      count: album.photos.length,
      covers: spread(album.photos, 4).map((p) => p.id),
    })),
  };
}

export const meta: Route.MetaFunction = ({ data }) =>
  data?.year
    ? pageMeta({ title: `Galerie Nexen ${data.year}`, description: `Les photos du Nexen Festival ${data.year}, par photographe.`, path: `/galerie/${data.year}`, image: "/og/galerie.jpg" })
    : pageMeta({ title: "Galerie", description: "Toutes les photos du Nexen Festival, édition par édition et photographe par photographe.", path: "/galerie", image: "/og/galerie.jpg" });

/** Galerie : albums de toutes les éditions (/galerie) ou d'une année (/galerie/2025) ; chaque album a sa page. */
export default function Galerie({ loaderData }: Route.ComponentProps) {
  const { albums, year } = loaderData;
  const years = [...new Set(albums.map((a) => a.year))];
  const visible = years.filter((y) => !year || y === year);
  const total = albums.reduce((n, a) => n + a.count, 0);

  return (
    <>
      <PageHero eyebrow="Nexen Festival" title={year ? `Galerie ${year}` : "Galerie"} lead={`${total} photos de ${years.length > 1 ? `${years.length} éditions` : "l'édition " + years[0]}, par les photographes du festival.`} image="festival/photo-don" />
      <Section labelledBy="albums-titre" floor="lilac">
        <h2 id="albums-titre" className="sr-only">
          Albums
        </h2>
        <div className="mb-12">
          <FilterLinks
            label="Année"
            items={[
              { label: "Toutes", href: "/galerie", current: !year },
              ...years.map((y) => ({ label: String(y), href: `/galerie/${y}`, current: y === year })),
            ]}
          />
        </div>
        <div className="flex flex-col gap-16">
          {visible.map((y) => (
            <section key={y} aria-labelledby={`annee-${y}`}>
              <h3 id={`annee-${y}`} className="mb-6 flex items-baseline gap-3 font-display text-h2 font-black uppercase">
                Nexen {y}
                <span className="text-small font-semibold text-ink-muted normal-case">
                  {albums.filter((a) => a.year === y).reduce((n, a) => n + a.count, 0)} photos
                </span>
              </h3>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
                {albums
                  .filter((a) => a.year === y)
                  .map((album) => (
                    <li key={album.slug}>
                      <AlbumCard album={album} />
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </div>
      </Section>
    </>
  );
}

type Card = Route.ComponentProps["loaderData"]["albums"][number];

/** Carte d'album : mosaïque de 4 vignettes, photographe, nombre de photos. */
function AlbumCard({ album }: { album: Card }) {
  return (
    <Link to={albumPath(album)} prefetch="intent" className="group relative block bg-surface no-underline transition-colors duration-base hover:bg-surface-raised">
      <Brackets />
      <span className="grid grid-cols-2 gap-px overflow-hidden chamfer-md">
        {album.covers.map((id) => (
          <img key={id} src={photoSrc(album, id, "s")} width={480} height={480} alt="" loading="lazy" decoding="async" className="aspect-square size-full object-cover transition duration-slow ease-out-expo group-hover:scale-105" />
        ))}
      </span>
      <span className="flex items-center justify-between gap-4 p-4">
        <span>
          <span className="block font-display text-h3 font-black text-ink uppercase transition-colors duration-fast group-hover:text-nexen-lilac">{album.photographer}</span>
          <span className="text-small text-ink-muted">
            Nexen {album.year} · {album.count} photos
          </span>
        </span>
        <ArrowRightIcon size={24} className="shrink-0 text-nexen-lilac transition-transform duration-base ease-out-expo group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

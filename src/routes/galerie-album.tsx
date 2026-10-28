import { data, Link, type ShouldRevalidateFunction } from "react-router";
import { FilterLinks } from "../components/gallery/FilterLinks";
import { PhotoGrid } from "../components/gallery/PhotoGrid";
import { CreditName, ProfileLink } from "../components/gallery/ProfileLink";
import { Eyebrow } from "../components/layout/SectionHeader";
import { albums, ogImage } from "../content/load.server";
import { albumPath } from "../lib/gallery";
import { pageMeta } from "../lib/seo";
import type { Route } from "./+types/galerie-album";

export function loader({ params }: Route.LoaderArgs) {
  const year = Number(params.annee);
  const album = albums.find((a) => a.year === year && a.slug === params.photographe);
  if (!album) throw data("Album introuvable", { status: 404 });
  const years = [...new Set(albums.map((a) => a.year))];
  return {
    og: ogImage(`/og/galerie/${album.year}-${album.slug}.jpg`),
    album: { year: album.year, slug: album.slug, photographer: album.photographer, profile: album.profile, photos: album.photos },
    // Filtre année : chaque année mène à sa page ; filtre photographe : les albums de la même année.
    years: years.map((y) => ({ label: String(y), href: `/galerie/${y}`, current: y === year })),
    photographers: albums
      .filter((a) => a.year === year)
      .map((a) => ({ label: a.photographer, href: albumPath(a), count: a.photos.length, current: a.slug === album.slug })),
  };
}

// Ouvrir une photo ne change que ?photo= : pas de rechargement des données de la page.
export const shouldRevalidate: ShouldRevalidateFunction = ({ currentUrl, nextUrl }) => currentUrl.pathname !== nextUrl.pathname;

export const meta: Route.MetaFunction = ({ data }) => {
  if (!data) return pageMeta({ title: "Galerie", path: "/galerie" });
  const { album } = data;
  return pageMeta({
    title: `Nexen ${album.year} · Photos de ${album.photographer}`,
    description: `${album.photos.length} photos du Nexen Festival ${album.year} par ${album.photographer}.`,
    path: albumPath(album),
    image: data.og,
  });
};

/** Album d'un photographe : filtres année / photographe, grille de toutes les photos, visionneuse. */
export default function GalerieAlbum({ loaderData }: Route.ComponentProps) {
  const { album, years, photographers } = loaderData;
  return (
    <section aria-labelledby="album-titre" data-floor="lilac" className="px-gutter pt-header pb-section">
      <div className="mx-auto max-w-site">
        <nav aria-label="Fil d'Ariane" className="mt-8 mb-4 text-small text-ink-muted">
          <Link to="/galerie" className="text-ink-soft hover:text-ink">
            Galerie
          </Link>{" "}
          /{" "}
          <Link to={`/galerie/${album.year}`} className="text-ink-soft hover:text-ink">
            {album.year}
          </Link>{" "}
          / <span aria-current="page">{album.photographer}</span>
        </nav>
        <Eyebrow tone="lilac">Nexen {album.year}</Eyebrow>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <h1 id="album-titre" className="text-h1 font-black">
            {album.photographer}
          </h1>
          <ProfileLink name={album.photographer} url={album.profile} />
        </div>
        <p className="mt-2 text-lead text-ink-soft">{album.photos.length} photos</p>

        <div className="my-10 flex flex-col gap-6">
          <FilterLinks label="Année" items={years} />
          {photographers.length > 1 && <FilterLinks label="Photographe" items={photographers} />}
        </div>

        <PhotoGrid key={albumPath(album)} album={album} />
        <p className="mt-10 text-small text-ink-muted">
          Photos : <CreditName name={album.photographer} url={album.profile} />.
        </p>
      </div>
    </section>
  );
}

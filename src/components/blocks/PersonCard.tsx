import type { ReactNode } from "react";
import { Badge } from "../ui/Badge";
import { Brackets } from "../ui/Brackets";
import { ResponsiveImage } from "../ui/ResponsiveImage";

type Props = {
  name: string;
  badge: string;
  line: string;
  photo: string | null;
  onOpen: () => void;
};

/** Carte portrait cliquable (artiste, membre) qui ouvre une modale (DESIGN_SYSTEM §7.16 bis). */
export function PersonCard({ name, badge, line, photo, onOpen }: Props) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      className="group relative flex w-full cursor-pointer flex-col bg-surface text-left transition-colors duration-base hover:bg-surface-raised"
    >
      <Brackets />
      <div className="relative aspect-4/5 overflow-hidden chamfer-md">
        <ResponsiveImage
          image={photo}
          alt=""
          sizes="(min-width: 64rem) 18rem, 50vw"
          fallbackLabel={name}
          className="opacity-70 grayscale transition duration-slow ease-out-expo group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
        />
        <span className="absolute top-3 left-3">
          <Badge variant="info">{badge}</Badge>
        </span>
      </div>
      <span className="flex flex-col gap-1 p-4">
        <span className="font-display text-h3 font-bold text-ink uppercase transition-colors duration-fast group-hover:text-cyan">{name}</span>
        <span className="text-small text-ink-muted">{line}</span>
      </span>
    </button>
  );
}

/** Contenu de modale d'une personne : photo, badge, nom, ligne, bio, liens. */
export function PersonDetail({ name, badge, line, photo, bio, links }: Omit<Props, "onOpen"> & { bio: string | null; links?: ReactNode }) {
  return (
    <div className="grid sm:grid-cols-[2fr_3fr]">
      <div className="aspect-4/5 overflow-hidden sm:aspect-auto">
        <ResponsiveImage image={photo} alt={name} sizes="(min-width: 40rem) 18rem, 100vw" fallbackLabel={name} />
      </div>
      <div className="flex flex-col gap-4 p-6 pt-14 sm:p-8 sm:pt-14">
        <Badge variant="info" className="self-start">
          {badge}
        </Badge>
        <h2 className="text-h2 font-black">{name}</h2>
        <p className="text-micro font-semibold text-cyan uppercase">{line}</p>
        {bio && <p className="text-ink-soft">{bio}</p>}
        {links}
      </div>
    </div>
  );
}

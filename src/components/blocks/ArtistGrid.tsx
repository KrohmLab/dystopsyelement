import { useState } from "react";
import type { Artist } from "../../content/schemas";
import { SoundCloudIcon, InstagramIcon } from "../icons";
import { Modal } from "../ui/Modal";
import { Reveal } from "../motion/Reveal";
import { PersonCard, PersonDetail } from "./PersonCard";

/** Line-up : cartes artistes, clic → modale (photo, format, genre, bio, liens). */
export function ArtistGrid({ artists }: { artists: Artist[] }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const open = artists.find((a) => a.slug === openSlug);
  const links = open && [
    open.links.soundcloud && { href: open.links.soundcloud, label: "SoundCloud", Icon: SoundCloudIcon },
    open.links.instagram && { href: open.links.instagram, label: "Instagram", Icon: InstagramIcon },
  ].filter((link) => !!link);

  return (
    <>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {artists.map((artist, i) => (
          <Reveal as="li" key={artist.slug} delay={(i % 4) * 80}>
            <PersonCard name={artist.name} badge={artist.format} line={artist.genre} photo={artist.photo} onOpen={() => setOpenSlug(artist.slug)} />
          </Reveal>
        ))}
      </ul>
      <Modal open={!!open} onClose={() => setOpenSlug(null)} label={open?.name ?? ""}>
        {open && (
          <PersonDetail
            name={open.name}
            badge={open.format}
            line={open.genre}
            photo={open.photo}
            bio={open.bio}
            links={
              links && links.length > 0 ? (
                <ul className="mt-2 flex gap-3">
                  {links.map(({ href, label, Icon }) => (
                    <li key={label}>
                      <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-cyan no-underline hover:text-glow-cyan">
                        <Icon size={20} />
                        {label}
                        <span className="sr-only">(nouvel onglet)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null
            }
          />
        )}
      </Modal>
    </>
  );
}

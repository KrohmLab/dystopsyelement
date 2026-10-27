import { useState } from "react";
import type { Member } from "../../content/schemas";
import { FilterBar } from "../ui/FilterBar";
import { Modal } from "../ui/Modal";
import { PersonCard, PersonDetail } from "./PersonCard";

const POLES = ["Tous", "Direction", "Organisation", "Technique"] as const;
type Pole = (typeof POLES)[number];

/** L'Équipe : filtres par pôle, cartes membres, clic → modale. */
export function TeamGrid({ team }: { team: Member[] }) {
  const [pole, setPole] = useState<Pole>("Tous");
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const visible = pole === "Tous" ? team : team.filter((m) => m.pole === pole);
  const open = team.find((m) => m.slug === openSlug);

  return (
    <>
      <FilterBar label="Filtrer par pôle" options={POLES} value={pole} onChange={setPole} className="mb-10" />
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4" aria-live="polite">
        {visible.map((member) => (
          <li key={member.slug} className="animate-[fade-up_var(--duration-slow)_var(--ease-out-expo)_both]">
            <PersonCard name={member.name} badge={member.pole} line={member.role} photo={member.photo} onOpen={() => setOpenSlug(member.slug)} />
          </li>
        ))}
      </ul>
      <Modal open={!!open} onClose={() => setOpenSlug(null)} label={open?.name ?? ""}>
        {open && <PersonDetail name={open.name} badge={open.pole} line={open.role} photo={open.photo} bio={open.bio} />}
      </Modal>
    </>
  );
}

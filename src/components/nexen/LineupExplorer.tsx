import { useMemo, useState, type CSSProperties } from "react";
import { useSearchParams } from "react-router";
import type { Festival, FestivalSet } from "../../content/schemas";
import { cn } from "../../lib/cn";
import { ClockIcon, ExternalIcon, SoundCloudIcon } from "../icons";
import { Brackets } from "../ui/Brackets";
import { FilterBar } from "../ui/FilterBar";
import { Modal } from "../ui/Modal";

type Props = Pick<Festival, "sets" | "breaks" | "days" | "families" | "stages">;

const ALL = "Tous";
const VIEWS = ["Cartes", "Timetable"] as const;
type View = (typeof VIEWS)[number];

/** Couleurs de scène (affiches Timetable 2026) : Nexus lilas, Engine pêche. */
export const STAGE_TONE = {
  nexus: { text: "text-nexen-lilac", ring: "inset-ring-nexen-lilac-line", bg: "bg-nexen-lilac", line: "bg-nexen-lilac-line" },
  engine: { text: "text-nexen-peach", ring: "inset-ring-nexen-peach-line", bg: "bg-nexen-peach", line: "bg-nexen-peach-line" },
} as const;

const DAY_SHORT: Record<string, string> = { Vendredi: "Ven.", Samedi: "Sam.", Dimanche: "Dim." };
const hm = (t: string) => t.replace(":", " h ").replace(" h 00", " h");

/** Minutes depuis le vendredi 00:00 ; une heure de fin avant le début passe au lendemain. */
function minutes(date: string, time: string): number {
  const day = (Date.parse(`${date}T00:00:00Z`) - Date.parse("2026-06-05T00:00:00Z")) / 60000;
  const [h = 0, m = 0] = time.split(":").map(Number);
  return day + h * 60 + m;
}
const setStart = (s: FestivalSet) => minutes(s.date, s.start);
const setEnd = (s: FestivalSet) => {
  const end = minutes(s.date, s.end);
  return end > setStart(s) ? end : end + 24 * 60;
};

/**
 * Line-up interactif (page Nexen) : filtres scène / jour / style dans l'URL (?scene=&jour=&style=),
 * vue cartes (clic → fiche de l'artiste) ou timetable par jour, les deux scènes côte à côte.
 */
export function LineupExplorer({ sets, breaks, days, families, stages }: Props) {
  const [params, setParams] = useSearchParams();
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const stageNames = stages.map((s) => s.name);
  const scene = stageNames.includes(params.get("scene") ?? "") ? (params.get("scene") as string) : ALL;
  const jour = days.some((d) => d.key === params.get("jour")) ? (params.get("jour") as string) : ALL;
  const style = families.includes(params.get("style") ?? "") ? (params.get("style") as string) : ALL;
  const view: View = params.get("affichage") === "timetable" ? "Timetable" : "Cartes";

  const update = (key: string, value: string, empty = ALL) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === empty) next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true, preventScrollReset: true },
    );

  const stageSlug = stages.find((s) => s.name === scene)?.slug;
  const matches = (s: FestivalSet) => (!stageSlug || s.stage === stageSlug) && (jour === ALL || s.day === jour) && (style === ALL || s.family === style);
  const visible = useMemo(() => sets.filter(matches).sort((a, b) => setStart(a) - setStart(b)), [sets, stageSlug, jour, style]); // eslint-disable-line react-hooks/exhaustive-deps
  const open = sets.find((s) => s.slug === openSlug);
  const openStage = stages.find((s) => s.slug === open?.stage);

  return (
    <div>
      <div className="mb-10 grid gap-4">
        <FilterBar label="Scène" options={[ALL, ...stageNames]} value={scene} onChange={(v) => update("scene", v)} />
        <FilterBar label="Jour" options={[ALL, ...days.map((d) => d.key)]} value={jour} onChange={(v) => update("jour", v)} />
        <FilterBar label="Style" options={[ALL, ...families]} value={style} onChange={(v) => update("style", v)} />
        <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
          <FilterBar label="Affichage" options={VIEWS} value={view} onChange={(v) => update("affichage", v === "Timetable" ? "timetable" : "Cartes", "Cartes")} />
          <p className="text-small text-ink-muted" aria-live="polite">
            {visible.length} {visible.length > 1 ? "passages" : "passage"}
          </p>
        </div>
      </div>

      {view === "Cartes" ? (
        visible.length > 0 ? (
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {visible.map((set, i) => (
              <li key={set.slug} className="animate-[fade-up_var(--duration-slow)_var(--ease-out-expo)_both]" style={{ animationDelay: `${Math.min(i, 12) * 30}ms` }}>
                <SetCard set={set} onOpen={() => setOpenSlug(set.slug)} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-12 text-center font-display text-h3 font-bold text-ink-muted uppercase">Aucun passage pour ces filtres</p>
        )
      ) : (
        <Timetable sets={sets} breaks={breaks} days={days} stages={stages} jour={jour} matches={matches} onOpen={setOpenSlug} onDay={(d) => update("jour", d)} />
      )}

      <Modal open={!!open} onClose={() => setOpenSlug(null)} label={open?.artist ?? ""}>
        {open && openStage && (
          <div className="relative overflow-hidden p-6 pt-14 sm:p-10 sm:pt-14">
            <span aria-hidden="true" className={cn("absolute inset-x-0 top-0 h-1", STAGE_TONE[open.stage].bg)} />
            <span aria-hidden="true" className="absolute inset-0 bg-grid opacity-60" />
            <div className="relative">
              <p className={cn("font-display text-eyebrow font-bold uppercase", STAGE_TONE[open.stage].text)}>
                // {openStage.name} · {openStage.role}
              </p>
              <h2 className="glitch mt-3 text-h1 font-black" data-text={open.artist}>
                {open.artist}
              </h2>
              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                <Detail term="Passage" value={`${open.day} · ${hm(open.start)} → ${hm(open.end)}`} />
                <Detail term="Style" value={open.style} />
                {open.label && <Detail term="Label" value={open.label} />}
                <Detail term="Famille" value={open.family} />
              </dl>
              <div className="mt-8 flex flex-wrap gap-4">
                {open.soundcloud && (
                  <a
                    href={open.soundcloud}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center gap-2 bg-pink px-5 font-display text-label font-bold text-on-accent uppercase no-underline chamfer-md hover:bg-pink-hover"
                  >
                    <SoundCloudIcon size={20} />
                    Écouter sur SoundCloud
                    <ExternalIcon size={16} />
                    <span className="sr-only">(nouvel onglet)</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setOpenSlug(null);
                    setParams({ affichage: "timetable", jour: open.day }, { replace: true, preventScrollReset: true });
                  }}
                  className="inline-flex min-h-12 cursor-pointer items-center gap-2 px-5 font-display text-label font-bold text-cyan uppercase inset-ring inset-ring-cyan-line chamfer-md hover:bg-cyan-dim"
                >
                  <ClockIcon size={20} />
                  Voir dans le timetable
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Detail({ term, value }: { term: string; value: string }) {
  return (
    <div className="bg-void/60 p-4 inset-ring inset-ring-line chamfer-sm">
      <dt className="font-display text-eyebrow font-bold text-ink-muted uppercase">{term}</dt>
      <dd className="mt-1 text-lead text-ink">{value}</dd>
    </div>
  );
}

/** Carte d'un passage : couleur de la scène, jour + heure, artiste, style ; clic → fiche. */
function SetCard({ set, onOpen }: { set: FestivalSet; onOpen: () => void }) {
  const tone = STAGE_TONE[set.stage];
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      className={cn(
        "set-card group relative flex h-full w-full cursor-pointer flex-col gap-3 overflow-hidden bg-surface/90 p-4 text-left inset-ring transition duration-base hover:-translate-y-1 hover:bg-surface-raised sm:p-5",
        tone.ring,
      )}
    >
      <Brackets />
      <span aria-hidden="true" className={cn("set-card__bar absolute inset-x-0 top-0 h-0.5 origin-left scale-x-25 transition-transform duration-slow ease-out-expo group-hover:scale-x-100", tone.bg)} />
      <span className="flex items-center justify-between gap-2 text-micro font-semibold uppercase">
        <span className={tone.text}>{set.stage === "nexus" ? "Nexus" : "Engine"}</span>
        <span className="text-ink-muted">
          {DAY_SHORT[set.day]} {hm(set.start)}
        </span>
      </span>
      <span className="glitch-hover font-display text-h3 font-black break-words text-ink uppercase" data-text={set.artist}>
        {set.artist}
      </span>
      <span className="mt-auto text-small text-ink-soft">{set.style}</span>
    </button>
  );
}

const REM_PER_MIN = 0.075;

type TimetableProps = Pick<Props, "sets" | "breaks" | "days" | "stages"> & {
  jour: string;
  matches: (s: FestivalSet) => boolean;
  onOpen: (slug: string) => void;
  onDay: (day: string) => void;
};

/** Timetable d'un jour : les deux scènes en colonnes, blocs à la hauteur de leur durée ; hors filtres = atténués. */
function Timetable({ sets, breaks, days, stages, jour, matches, onOpen, onDay }: TimetableProps) {
  const day = jour === ALL ? (days[0]?.key ?? "Vendredi") : jour;
  const daySets = sets.filter((s) => s.day === day);
  const from = Math.floor(Math.min(...daySets.map(setStart)) / 60) * 60;
  const to = Math.ceil(Math.max(...daySets.map(setEnd)) / 60) * 60;
  const hours = Array.from({ length: (to - from) / 60 + 1 }, (_, i) => from + i * 60);
  const date = days.find((d) => d.key === day)?.date ?? "2026-06-05";

  return (
    <div>
      {jour === ALL && (
        <div className="mb-6">
          <FilterBar label="Jour du timetable" options={days.map((d) => d.key)} value={day} onChange={onDay} />
        </div>
      )}
      <div className="overflow-x-auto pb-2">
        <div className="grid min-w-xl grid-cols-[3.5rem_1fr_1fr] gap-x-3">
          <span />
          {stages.map((stage) => (
            <p key={stage.slug} className={cn("pb-3 text-center font-display text-label font-black uppercase", STAGE_TONE[stage.slug].text)}>
              {stage.name}
            </p>
          ))}
          <div className="relative" style={{ height: `${(to - from) * REM_PER_MIN}rem` }}>
            {hours.map((h) => (
              <span key={h} className="absolute right-0 -translate-y-1/2 text-micro font-semibold text-ink-muted" style={{ top: `${(h - from) * REM_PER_MIN}rem` }}>
                {String(Math.floor(h / 60) % 24).padStart(2, "0")} h
              </span>
            ))}
          </div>
          {stages.map((stage) => (
            <div key={stage.slug} className="relative border-l border-line bg-void/40" style={{ height: `${(to - from) * REM_PER_MIN}rem` }}>
              {hours.map((h) => (
                <span key={h} aria-hidden="true" className="absolute inset-x-0 border-t border-line/60" style={{ top: `${(h - from) * REM_PER_MIN}rem` }} />
              ))}
              {breaks
                .filter((b) => b.stage === stage.slug && b.day === day)
                .map((b) => {
                  const start = minutes(date, b.start);
                  const end = b.end ? minutes(date, b.end) : start + 30;
                  return (
                    <span
                      key={`${b.start}-${b.kind ?? "break"}`}
                      className="tt-break absolute inset-x-1 grid place-items-center font-display text-eyebrow font-bold text-nexen-peach uppercase"
                      style={{ top: `${(start - from) * REM_PER_MIN}rem`, height: `${Math.max(end - start, 30) * REM_PER_MIN}rem` }}
                    >
                      {b.kind === "fin" ? "Fin" : "Break"}
                    </span>
                  );
                })}
              {daySets
                .filter((s) => s.stage === stage.slug)
                .map((s) => {
                  const tone = STAGE_TONE[s.stage];
                  const active = matches(s);
                  return (
                    <button
                      key={s.slug}
                      type="button"
                      onClick={() => onOpen(s.slug)}
                      aria-haspopup="dialog"
                      className={cn(
                        "group absolute inset-x-1 flex cursor-pointer flex-col justify-center overflow-hidden bg-surface px-3 text-left inset-ring transition duration-base hover:z-10 hover:bg-surface-raised hover:scale-x-103",
                        tone.ring,
                        !active && "opacity-25",
                      )}
                      style={{ top: `${(setStart(s) - from) * REM_PER_MIN}rem`, height: `${(setEnd(s) - setStart(s)) * REM_PER_MIN}rem` } as CSSProperties}
                    >
                      <span aria-hidden="true" className={cn("absolute inset-y-0 left-0 w-1", tone.bg)} />
                      <span className="truncate font-display text-label font-black text-ink uppercase">{s.artist}</span>
                      <span className="truncate text-micro font-semibold text-ink-muted">
                        {hm(s.start)} · {s.style}
                      </span>
                    </button>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import type { DystopsyEvent } from "../../content/schemas";
import { cn } from "../../lib/cn";

type Entry = DystopsyEvent["lineup"][number];

// Couleurs des scènes Nexen (DESIGN_SYSTEM §7.16 ter) ; les autres scènes restent en cyan.
const STAGE_TONE: Record<string, string> = {
  Nexus: "text-nexen-lilac",
  Engine: "text-nexen-peach",
};

/**
 * Line-up d'une fiche événement : groupé par scène (festivals), en colonnes. Nom en avant, style et label en
 * dessous. Textes repris tels que publiés par l'asso (content/events/*.md).
 */
export function EventLineup({ lineup }: { lineup: Entry[] }) {
  const stages = [...new Set(lineup.map((entry) => entry.stage ?? ""))];
  return (
    <div className="flex flex-col gap-12">
      {stages.map((stage) => {
        const entries = lineup.filter((entry) => (entry.stage ?? "") === stage);
        return (
          <section key={stage || "lineup"} aria-label={stage ? `Scène ${stage}` : undefined}>
            {stage && (
              <h3 className={cn("mb-6 flex items-baseline gap-3 font-display text-h3 font-black uppercase", STAGE_TONE[stage] ?? "text-cyan")}>
                {stage} Stage
                <span className="text-micro font-semibold text-ink-muted">{entries.length} artistes</span>
              </h3>
            )}
            <ul className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
              {entries.map((entry) => (
                <li key={entry.name} className="border-l border-line-strong pl-4">
                  <p className="font-display text-label-lg font-bold text-ink uppercase">{entry.name}</p>
                  {(entry.style || entry.label) && (
                    <p className="mt-1 text-small text-ink-muted">{[entry.style, entry.label].filter(Boolean).join(" · ")}</p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

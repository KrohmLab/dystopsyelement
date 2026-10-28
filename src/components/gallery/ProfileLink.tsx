import { cn } from "../../lib/cn";
import { ExternalIcon, FacebookIcon } from "../icons";

type Props = { name: string; url: string | null; className?: string };

/** Crédit du photographe : lien vers son profil (icône + « Profil »), nouvel onglet. Rien si le profil n'est pas fourni. */
export function ProfileLink({ name, url, className }: Props) {
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex min-h-11 shrink-0 items-center gap-2 bg-void/70 px-3 font-display text-label-sm font-bold text-ink-soft uppercase no-underline inset-ring inset-ring-line-strong transition-colors duration-fast chamfer-sm hover:text-ink hover:inset-ring-nexen-lilac",
        className,
      )}
    >
      <FacebookIcon size={20} className="text-nexen-lilac" />
      Profil
      <ExternalIcon size={16} />
      <span className="sr-only"> de {name} sur Facebook (nouvel onglet)</span>
    </a>
  );
}

/** Nom du photographe en lien vers son profil (crédits en ligne) ; texte simple sans profil. */
export function CreditName({ name, url }: { name: string; url: string | null }) {
  if (!url) return <span className="font-semibold text-ink">{name}</span>;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="font-semibold text-ink underline decoration-nexen-lilac underline-offset-4 hover:text-nexen-lilac">
      {name}
      <span className="sr-only"> (profil Facebook, nouvel onglet)</span>
    </a>
  );
}

import { cn } from "../../lib/cn";
import { ExternalIcon, FacebookIcon, InstagramIcon } from "../icons";

type Props = { name: string; url: string | null; className?: string };

/** Réseau du profil, d'après son adresse (icône et libellé lu). */
const network = (url: string) => (url.includes("instagram.com") ? { label: "Instagram", Icon: InstagramIcon } : { label: "Facebook", Icon: FacebookIcon });

/** Crédit du photographe : lien vers son profil (icône du réseau + « Profil »), nouvel onglet. Rien si le profil n'est pas fourni. */
export function ProfileLink({ name, url, className }: Props) {
  if (!url) return null;
  const { label, Icon } = network(url);
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
      <Icon size={20} className="text-nexen-lilac" />
      Profil
      <ExternalIcon size={16} />
      <span className="sr-only">
        {" "}
        de {name} sur {label} (nouvel onglet)
      </span>
    </a>
  );
}

/** Nom du photographe en lien vers son profil (crédits en ligne) ; texte simple sans profil. */
export function CreditName({ name, url }: { name: string; url: string | null }) {
  if (!url) return <span className="font-semibold text-ink">{name}</span>;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="font-semibold text-ink underline decoration-nexen-lilac underline-offset-4 hover:text-nexen-lilac">
      {name}
      <span className="sr-only"> (profil {network(url).label}, nouvel onglet)</span>
    </a>
  );
}

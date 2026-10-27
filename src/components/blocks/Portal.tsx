import { Link } from "react-router";
import { cn } from "../../lib/cn";
import { isExternal } from "../../lib/navigation";
import { ArrowRightIcon, ExternalIcon } from "../icons";
import { Brackets } from "../ui/Brackets";
import { ResponsiveImage } from "../ui/ResponsiveImage";

type Props = {
  label: string;
  href: string;
  /** Sur-titre code (« // 01 »…), facultatif. */
  eyebrow?: string;
  /** Visuel réel de l'asso (clé de assets/images.json) ; sans visuel, traitement graphique (grille + lueur). */
  image?: string | null;
  className?: string;
};

/**
 * Tuile de navigation de l'accueil (DESIGN_SYSTEM §7.18) : grand visuel, libellé d'un ou deux mots,
 * glitch RGB, balayage lumineux et équerres au survol ou au focus. Tuile entière cliquable.
 */
export function Portal({ label, href, eyebrow, image, className }: Props) {
  const external = isExternal(href);
  const classes = cn(
    "group relative flex min-h-56 flex-col justify-end overflow-hidden bg-surface p-6 no-underline chamfer-lg",
    // Balayage lumineux au survol.
    "after:pointer-events-none after:absolute after:inset-y-0 after:left-0 after:w-1/3 after:bg-linear-to-r after:from-transparent after:via-cyan/20 after:to-transparent after:opacity-0 group-hover:after:animate-shine group-hover:after:opacity-100",
    className,
  );

  const content = (
    <>
      {image ? (
        <span aria-hidden="true" className="absolute inset-0">
          <ResponsiveImage
            image={image}
            alt=""
            sizes="(min-width: 64rem) 40rem, 100vw"
            className="opacity-60 grayscale transition duration-slow ease-out-expo group-hover:scale-105 group-hover:opacity-90 group-hover:grayscale-0"
          />
        </span>
      ) : (
        <span aria-hidden="true" className="absolute inset-0 bg-grid transition-opacity duration-slow group-hover:opacity-60">
          <span className="absolute inset-0 bg-radial-[at_80%_100%] from-cyan-line to-transparent to-70% transition-opacity duration-slow group-hover:opacity-0" />
          <span className="absolute inset-0 bg-radial-[at_80%_100%] from-pink-line to-transparent to-70% opacity-0 transition-opacity duration-slow group-hover:opacity-100" />
        </span>
      )}
      <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-void via-void/50 to-transparent" />
      <span aria-hidden="true" className="absolute inset-0 bg-scanlines" />
      <Brackets />
      <span className="relative flex items-end justify-between gap-4">
        <span>
          {eyebrow && (
            <span className="mb-2 block font-display text-eyebrow font-bold text-cyan uppercase">// {eyebrow}</span>
          )}
          <span className="glitch-hover block font-display text-h3 font-black text-ink uppercase" data-text={label}>
            {label}
          </span>
        </span>
        {external ? (
          <ExternalIcon size={32} className="shrink-0 text-cyan" />
        ) : (
          <ArrowRightIcon size={32} className="shrink-0 text-cyan transition-transform duration-base ease-out-expo group-hover:translate-x-1" />
        )}
      </span>
      {external && <span className="sr-only">(nouvel onglet)</span>}
    </>
  );

  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
      {content}
    </a>
  ) : (
    <Link to={href} prefetch="intent" className={classes}>
      {content}
    </Link>
  );
}

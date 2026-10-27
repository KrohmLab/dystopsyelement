import type { ComponentType, ReactNode } from "react";
import { Link } from "react-router";
import { cn } from "../../lib/cn";
import { isExternal } from "../../lib/navigation";
import { ArrowRightIcon, ExternalIcon } from "../icons";

type Variant = "primary" | "secondary" | "ghost" | "festival";
type Size = "sm" | "md" | "lg";
type IconComponent = ComponentType<{ size?: 16 | 20 | 24 | 32; className?: string }>;

type Props = {
  variant?: Variant;
  size?: Size;
  /** Lien : interne (`/agenda`, via React Router) ou externe (`https://…`). Sans `href`, rendu en `<button>`. */
  href?: string;
  icon?: IconComponent;
  iconPosition?: "start" | "end";
  /** Nouvel onglet, icône ↗ et mention pour les lecteurs d'écran. Par défaut : vrai pour les URL externes. */
  external?: boolean;
  fullWidth?: boolean;
  type?: "button" | "submit";
  className?: string;
  onClick?: () => void;
  children: ReactNode;
  "aria-controls"?: string;
  "aria-expanded"?: boolean;
};

const HEIGHT: Record<Size, string> = { sm: "min-h-10", md: "min-h-12", lg: "min-h-14" };
const TEXT: Record<Size, string> = { sm: "text-label-sm", md: "text-label", lg: "text-label-lg" };
const PADDING: Record<Size, string> = { sm: "px-4", md: "px-6", lg: "px-8" };

/**
 * Bouton unique du site (DESIGN_SYSTEM §7.1). Rose (`primary`) = conversion, un seul par section.
 * Hauteur minimale : un libellé long passe à la ligne sur mobile au lieu de déborder.
 */
export function Button({
  variant = "primary",
  size = "md",
  href,
  icon: StartIcon,
  iconPosition = "start",
  external = href ? isExternal(href) : false,
  fullWidth = false,
  type = "button",
  className,
  onClick,
  children,
  ...aria
}: Props) {
  const isGhost = variant === "ghost";
  const chamfer = size === "sm" ? "chamfer-sm" : "chamfer-md";
  // Les variantes « ghost » et « festival » avancent vers leur destination : flèche par défaut.
  const EndIcon: IconComponent | undefined = external
    ? ExternalIcon
    : iconPosition === "end"
      ? StartIcon
      : isGhost || variant === "festival"
        ? ArrowRightIcon
        : undefined;
  const LeadIcon = iconPosition === "start" && !isGhost ? StartIcon : undefined;
  const iconSize = size === "lg" || variant === "festival" ? 20 : 16;

  const outer = cn(
    "group/btn relative inline-flex max-w-full cursor-pointer items-stretch text-center font-display font-bold uppercase no-underline",
    fullWidth && "w-full",
    variant === "primary" &&
      cn(
        HEIGHT[size],
        TEXT[size],
        chamfer,
        "overflow-hidden bg-pink text-on-accent transition duration-base hover:bg-pink-hover hover:shadow-glow-pink",
        // Balayage lumineux au survol uniquement.
        "after:pointer-events-none after:absolute after:inset-y-0 after:left-0 after:w-2/5 after:bg-linear-to-r after:from-transparent after:via-ink/35 after:to-transparent after:opacity-0 hover:after:animate-shine hover:after:opacity-100",
      ),
    variant === "secondary" &&
      cn(HEIGHT[size], TEXT[size], chamfer, "bg-cyan-line p-px text-ink transition duration-base hover:bg-cyan hover:text-cyan"),
    variant === "festival" &&
      "min-h-16 bg-linear-to-r from-cyan via-pink to-cyan bg-size-[200%_auto] bg-left p-0.75 text-label-lg text-ink transition-[background-position] duration-slow chamfer-lg hover:bg-right",
    isGhost && "py-1.5 text-label text-cyan transition duration-base hover:text-glow-cyan",
    className,
  );

  const inner = cn(
    "relative flex w-full items-center justify-center gap-2.5",
    !isGhost && "py-2",
    variant === "primary" && PADDING[size],
    variant === "secondary" &&
      cn(
        PADDING[size],
        chamfer,
        "bg-void after:absolute after:inset-0 after:bg-cyan-dim after:opacity-0 after:transition-opacity after:duration-base group-hover/btn:after:opacity-100",
      ),
    variant === "festival" && "gap-3.5 bg-void px-10 chamfer-lg",
  );

  const content = (
    <span className={inner}>
      {LeadIcon && <LeadIcon size={iconSize} className={cn("relative shrink-0", variant === "festival" && "text-pink")} />}
      <span className="relative">{children}</span>
      {external && <span className="sr-only">(nouvel onglet)</span>}
      {EndIcon && (
        <EndIcon
          size={iconSize}
          className={cn(
            "relative shrink-0 transition-transform duration-base ease-out-expo",
            (isGhost || variant === "festival") && "group-hover/btn:translate-x-1",
            variant === "festival" && "text-cyan",
          )}
        />
      )}
    </span>
  );

  if (!href) {
    return (
      <button type={type} className={outer} onClick={onClick} {...aria}>
        {content}
      </button>
    );
  }
  if (external || isExternal(href)) {
    return (
      <a href={href} className={outer} onClick={onClick} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {content}
      </a>
    );
  }
  return (
    <Link to={href} className={outer} onClick={onClick} prefetch="intent">
      {content}
    </Link>
  );
}

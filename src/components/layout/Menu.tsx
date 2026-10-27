import { useEffect, useRef, type CSSProperties, type RefObject } from "react";
import { Link, NavLink, useLocation } from "react-router";
import type { Site } from "../../content/schemas";
import type { NavItem, Ticket } from "../../lib/navigation";
import { useModal } from "../../lib/useModal";
import { ArrowRightIcon, ExternalIcon, FacebookIcon, InstagramIcon, SoundCloudIcon, TicketIcon, YouTubeIcon } from "../icons";
import { GridFloor } from "../motion/GridFloor";
import { Button } from "../ui/Button";
import { Logo } from "./Logo";

export type NextEvent = { title: string; slug: string; dates: string } | null;

type Props = {
  open: boolean;
  onClose: () => void;
  nav: NavItem[];
  ticket: Ticket;
  next: NextEvent;
  socials: Site["socials"];
  email: string | null;
  /** L'en-tête reste visible au-dessus du menu : son bouton (devenu croix) ferme le menu. */
  headerRef: RefObject<HTMLElement | null>;
  returnFocusRef: RefObject<HTMLElement | null>;
};

const NETWORKS = [
  { key: "instagram", label: "Instagram", Icon: InstagramIcon },
  { key: "facebook", label: "Facebook", Icon: FacebookIcon },
  { key: "soundcloud", label: "SoundCloud", Icon: SoundCloudIcon },
  { key: "youtube", label: "YouTube", Icon: YouTubeIcon },
] as const;

const LINK = "menu__link group relative flex items-baseline gap-4 py-2 no-underline sm:gap-6";

/** Un effet de survol par lien (couleur, mouvement, glitch) : styles .menu__link[data-fx] dans theme.css. */
const FX = ["glitch", "neon", "spread", "slice", "shake", "wave"] as const;

/**
 * Menu plein écran, à toutes les tailles (DESIGN_SYSTEM §7.2) : rideau qui descend avec une barre de scan,
 * liens numérotés en cascade, glitch au survol, sol quadrillé en fond ; prochain événement, billetterie
 * et réseaux à côté. Focus piégé, Échap, page inerte (useModal) ; fermé à chaque navigation.
 */
export function Menu({ open, onClose, nav, ticket, next, socials, email, headerRef, returnFocusRef }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  // Toute navigation referme le menu.
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  useModal({ open, onClose, containers: [headerRef, panelRef], initialFocus: panelRef, returnFocus: returnFocusRef, keepHeader: true });

  return (
    <div
      ref={panelRef}
      id="menu-principal"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      inert={!open}
      data-open={open || undefined}
      className="menu fixed inset-0 z-30 overflow-x-hidden overflow-y-auto overscroll-contain bg-void"
    >
      {/* Décor */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0">
        <span className="absolute inset-0 bg-radial-[at_15%_20%] from-cyan-dim to-transparent to-60%" />
        <span className="absolute inset-0 bg-radial-[at_90%_80%] from-pink-dim to-transparent to-60%" />
        <GridFloor className="absolute inset-x-0 bottom-0 h-2/5 opacity-70" />
        <Logo className="menu__mark absolute top-1/2 -right-[18%] size-[min(92vh,54rem)] -translate-y-1/2 text-cyan" />
        <span className="absolute inset-0 bg-scanlines" />
      </div>
      <span aria-hidden="true" className="menu__scanbar" />

      <div className="relative mx-auto grid min-h-full max-w-site grid-cols-1 gap-12 px-gutter pt-28 pb-16 lg:grid-cols-[3fr_2fr] lg:items-center lg:gap-16 [&>*]:min-w-0">
        <nav aria-label="Navigation principale">
          <ol className="flex flex-col">
            {[{ label: "Accueil", href: "/" }, ...nav].map((item, i) => {
              const content = (
                <>
                  <span className="font-display text-eyebrow font-bold text-cyan">{String(i).padStart(2, "0")}</span>
                  <span aria-hidden="true" className="menu__sweep" />
                  <span className="menu__label glitch-hover font-display text-h1 font-black text-ink uppercase" data-text={item.label}>
                    {item.label}
                  </span>
                  {item.external ? (
                    <ExternalIcon size={32} className="self-center text-pink" />
                  ) : (
                    <ArrowRightIcon size={32} className="hidden self-center text-cyan opacity-0 sm:block transition duration-base ease-out-expo group-hover:translate-x-2 group-hover:opacity-100 group-focus-visible:opacity-100" />
                  )}
                </>
              );
              return (
                <li key={item.href} className="menu__item border-b border-line/60" style={{ "--i": i } as CSSProperties}>
                  {item.external ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className={LINK} data-fx={FX[i % FX.length]}>
                      {content}
                      <span className="sr-only">(nouvel onglet)</span>
                    </a>
                  ) : (
                    <NavLink to={item.href} end={item.href === "/"} className={LINK} data-fx={FX[i % FX.length]}>
                      {content}
                    </NavLink>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="menu__aside flex flex-col gap-6 lg:max-w-sm lg:justify-self-end">
          {next && (
            <div className="relative bg-surface/80 p-5 inset-ring inset-ring-cyan-line chamfer-md">
              <p className="mb-2 font-display text-eyebrow font-bold text-cyan uppercase">// Prochain événement</p>
              <Link to={`/agenda/${next.slug}`} className="block font-display text-h3 font-bold text-ink uppercase no-underline hover:text-cyan">
                {next.title}
              </Link>
              <p className="mt-1 text-micro font-semibold text-ink-muted uppercase">{next.dates}</p>
            </div>
          )}
          <Button size="lg" icon={TicketIcon} fullWidth href={ticket.href} external={ticket.external}>
            Billetterie
          </Button>
          <ul className="flex flex-wrap gap-2.5">
            {NETWORKS.map(({ key, label, Icon }) => {
              const href = socials[key];
              return href ? (
                <li key={key}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="group/social block size-11 bg-cyan-line p-px transition-colors duration-base chamfer-sm hover:bg-cyan">
                    <span className="grid size-full place-items-center bg-void text-cyan transition-colors duration-base chamfer-sm group-hover/social:bg-cyan group-hover/social:text-on-accent">
                      <Icon size={20} />
                    </span>
                    <span className="sr-only">{label} (nouvel onglet)</span>
                  </a>
                </li>
              ) : null;
            })}
          </ul>
          {email && (
            <a href={`mailto:${email}`} className="text-small text-ink-muted underline hover:text-cyan">
              {email}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

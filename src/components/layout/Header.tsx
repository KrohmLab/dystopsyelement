import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import type { Site } from "../../content/schemas";
import { cn } from "../../lib/cn";
import type { NavItem, Ticket } from "../../lib/navigation";
import { site } from "../../site";
import { TicketIcon } from "../icons";
import { Button } from "../ui/Button";
import { Logo } from "./Logo";
import { Menu, type NextEvent } from "./Menu";

type Props = {
  nav: NavItem[];
  ticket: Ticket;
  next: NextEvent;
  socials: Site["socials"];
  email: string | null;
};

/**
 * En-tête fixe (DESIGN_SYSTEM §7.2) : logo, Billetterie et bouton Menu à toutes les tailles d'écran
 * (menu plein écran). Transparent au repos, fond flouté + grille après 50 px de scroll, logo qui glitche.
 */
export function Header({ nav, ticket, next, socials, email }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 50);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        data-scrolled={scrolled || undefined}
        data-menu={menuOpen || undefined}
        className={cn(
          "group/header fixed inset-x-0 top-0 z-40 border-b px-gutter transition duration-base",
          menuOpen
            ? "border-transparent"
            : "border-transparent data-scrolled:border-cyan-line data-scrolled:bg-abyss/60 data-scrolled:bg-grid data-scrolled:shadow-header data-scrolled:backdrop-blur-lg",
        )}
      >
        {/* Au repos, sous lg, l'en-tête descend un peu pour respirer dans le cadre du hero ; il remonte dès le défilement. */}
        <div className="mx-auto flex h-header max-w-site items-center justify-between gap-6 transition-transform duration-base ease-out-expo max-lg:translate-y-3 md:max-lg:translate-y-4 group-data-scrolled/header:translate-y-0">
          <Link to="/" className="group/brand flex items-center gap-3 text-ink no-underline" aria-label={`${site.name}, accueil`}>
            <Logo className="logo-mark size-10 transition-[filter] duration-base group-hover/brand:drop-shadow-md group-hover/brand:drop-shadow-cyan" />
            <span className="hidden font-display text-label font-bold uppercase lg:inline">{site.name}</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className={cn("hidden transition-opacity duration-base sm:block", menuOpen && "pointer-events-none opacity-0")}>
              <Button size="sm" icon={TicketIcon} href={ticket.href} external={ticket.external}>
                Billetterie
              </Button>
            </div>
            {/* Mobile : billetterie en icône seule, à gauche du menu (le libellé complet est dans le menu). */}
            <TicketShortcut ticket={ticket} hidden={menuOpen} />
            <button
              ref={burgerRef}
              type="button"
              aria-expanded={menuOpen}
              aria-controls="menu-principal"
              onClick={() => setMenuOpen((open) => !open)}
              data-open={menuOpen || undefined}
              className="burger group/burger flex min-h-11 cursor-pointer items-center gap-3 px-1 text-ink"
            >
              <span className="hidden font-display text-label font-bold uppercase transition-colors duration-fast group-hover/burger:text-cyan md:inline">
                {menuOpen ? "Fermer" : "Menu"}
              </span>
              <span className="sr-only md:hidden">{menuOpen ? "Fermer le menu" : "Ouvrir le menu"}</span>
              <span aria-hidden="true" className="burger__icon">
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </header>

      <Menu
        open={menuOpen}
        onClose={closeMenu}
        nav={nav}
        ticket={ticket}
        next={next}
        socials={socials}
        email={email}
        headerRef={headerRef}
        returnFocusRef={burgerRef}
      />
    </>
  );
}

function TicketShortcut({ ticket, hidden }: { ticket: Ticket; hidden: boolean }) {
  const className = cn(
    "grid size-11 place-items-center bg-pink text-on-accent no-underline transition duration-base chamfer-sm hover:bg-pink-hover hover:shadow-glow-pink sm:hidden",
    hidden && "pointer-events-none opacity-0",
  );
  const label = ticket.external ? "Billetterie (nouvel onglet)" : "Billetterie";
  return ticket.external ? (
    <a href={ticket.href} target="_blank" rel="noopener noreferrer" aria-label={label} className={className} tabIndex={hidden ? -1 : undefined}>
      <TicketIcon size={24} />
    </a>
  ) : (
    <Link to={ticket.href} prefetch="intent" aria-label={label} className={className} tabIndex={hidden ? -1 : undefined}>
      <TicketIcon size={24} />
    </Link>
  );
}

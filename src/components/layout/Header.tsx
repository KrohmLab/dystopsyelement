import { useCallback, useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router";
import { cn } from "../../lib/cn";
import type { NavItem, Ticket } from "../../lib/navigation";
import { site } from "../../site";
import { CloseIcon, ExternalIcon, MenuIcon, TicketIcon } from "../icons";
import { Button } from "../ui/Button";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";

const LINK =
  "group/link relative flex items-center gap-1 px-4 py-2.5 font-display text-label font-bold text-ink-soft uppercase no-underline transition-colors duration-fast hover:text-ink aria-[current=page]:text-cyan";
const BRACKET =
  "absolute top-1/2 -translate-y-1/2 text-cyan opacity-0 transition-all duration-base ease-out-expo group-hover/link:opacity-100";

/** Lien de navigation desktop : crochets [ ] cyan qui glissent et soulignement au survol (effet v1). */
function NavEntry({ item }: { item: NavItem }) {
  const decor = (
    <>
      <span aria-hidden="true" className={`${BRACKET} left-2 group-hover/link:left-0.5`}>
        [
      </span>
      <span aria-hidden="true" className={`${BRACKET} right-2 group-hover/link:right-0.5`}>
        ]
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-x-4 bottom-1 h-0.5 origin-left scale-x-0 bg-cyan transition-transform duration-base ease-out-expo group-hover/link:scale-x-100"
      />
    </>
  );
  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={LINK}>
        {item.label}
        <ExternalIcon size={16} />
        <span className="sr-only">(nouvel onglet)</span>
        {decor}
      </a>
    );
  }
  return (
    <NavLink to={item.href} prefetch="intent" className={LINK}>
      {item.label}
      {decor}
    </NavLink>
  );
}

/**
 * En-tête fixe (DESIGN_SYSTEM §7.2) : transparent au repos, fond flouté + grille après 50 px de scroll,
 * logo qui glitche une fois au premier défilement. Le menu plein écran s'ouvre sous l'en-tête.
 */
export function Header({ nav, ticket }: { nav: NavItem[]; ticket: Ticket }) {
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
        className={cn(
          "fixed inset-x-0 top-0 z-40 border-b transition duration-base",
          menuOpen
            ? "border-cyan-line bg-void"
            : "border-transparent data-scrolled:border-cyan-line data-scrolled:bg-abyss/60 data-scrolled:bg-grid data-scrolled:shadow-header data-scrolled:backdrop-blur-lg",
        )}
      >
        <div className="mx-auto flex h-header max-w-site items-center justify-between gap-6 px-gutter">
          <Link to="/" className="group/brand flex items-center gap-3 text-ink" aria-label={`${site.name}, accueil`}>
            <Logo className="logo-mark size-10 transition-[filter] duration-base group-hover/brand:drop-shadow-md group-hover/brand:drop-shadow-cyan" />
            <span className="hidden font-display text-label font-bold uppercase xl:inline">{site.name}</span>
          </Link>

          <nav aria-label="Navigation principale" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <NavEntry item={item} />
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            {/* En mobile, la billetterie est dans le menu (bouton pleine largeur). */}
            <div className="hidden sm:block">
              <Button size="sm" icon={TicketIcon} href={ticket.href} external={ticket.external}>
                Billetterie
              </Button>
            </div>
            <button
              ref={burgerRef}
              type="button"
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={menuOpen}
              aria-controls="menu-principal"
              onClick={() => setMenuOpen((open) => !open)}
              className="grid size-11 cursor-pointer place-items-center text-ink lg:hidden"
            >
              {menuOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={closeMenu} nav={nav} ticket={ticket} headerRef={headerRef} returnFocusRef={burgerRef} />
    </>
  );
}

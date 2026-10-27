import { useEffect, useRef, type RefObject } from "react";
import { NavLink, useLocation } from "react-router";
import type { NavItem, Ticket } from "../../lib/navigation";
import { useModal } from "../../lib/useModal";
import { ExternalIcon, TicketIcon } from "../icons";
import { Button } from "../ui/Button";

type Props = {
  open: boolean;
  onClose: () => void;
  nav: NavItem[];
  ticket: Ticket;
  /** L'en-tête reste visible au-dessus du menu : son bouton burger (devenu croix) ferme le menu. */
  headerRef: RefObject<HTMLElement | null>;
  returnFocusRef: RefObject<HTMLElement | null>;
};

const LINK =
  "flex items-center gap-2 border-l-2 border-transparent py-3 pl-4 font-display text-h3 font-bold text-ink uppercase no-underline transition-colors duration-fast hover:border-cyan hover:text-cyan aria-[current=page]:border-cyan aria-[current=page]:text-cyan";

/**
 * Menu plein écran sous l'en-tête (mobile et tablette, DESIGN_SYSTEM §7.2) : focus piégé, Échap,
 * page inerte et scroll bloqué (useModal), fermeture à chaque navigation.
 */
export function MobileMenu({ open, onClose, nav, ticket, headerRef, returnFocusRef }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  // Toute navigation referme le menu.
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Repasser en desktop referme le menu.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 64rem)");
    const onChange = (event: MediaQueryListEvent) => event.matches && onClose();
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [onClose]);

  useModal({ open, onClose, containers: [headerRef, panelRef], initialFocus: panelRef, returnFocus: returnFocusRef, keepHeader: true });

  return (
    <div
      ref={panelRef}
      id="menu-principal"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      inert={!open}
      className={`fixed inset-x-0 top-header bottom-0 z-30 flex flex-col overflow-y-auto overscroll-contain bg-void transition-opacity duration-base lg:hidden ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <nav aria-label="Navigation principale" className="flex-1 px-gutter py-6">
        <ul className="flex flex-col gap-2">
          {nav.map((item) => (
            <li key={item.href}>
              {item.external ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer" className={LINK}>
                  {item.label}
                  <ExternalIcon size={24} />
                  <span className="sr-only">(nouvel onglet)</span>
                </a>
              ) : (
                <NavLink to={item.href} className={LINK}>
                  {item.label}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div className="shrink-0 px-gutter pt-4 pb-8">
        <Button size="lg" icon={TicketIcon} fullWidth href={ticket.href} external={ticket.external} onClick={onClose}>
          Billetterie
        </Button>
      </div>
    </div>
  );
}

import { site } from "../site";

export type NavItem = { label: string; href: string; external?: boolean };

/** Destination du bouton Billetterie (header, menu, footer). */
export type Ticket = { href: string; external: boolean };

/**
 * Navigation principale (SITE_PLAN §1) : Nexen · Agenda · Prestations · Shop ↗ · Contact.
 * Prestations n'apparaît qu'une fois des prestations fournies, Shop qu'avec `shopUrl`.
 */
export function getNavigation({ hasServices = false } = {}): NavItem[] {
  const items: (NavItem | false)[] = [
    { label: "Nexen", href: "/nexen" },
    { label: "Agenda", href: "/agenda" },
    hasServices && { label: "Prestations", href: "/prestations" },
    !!site.shopUrl && { label: "Shop", href: site.shopUrl, external: true },
    { label: "Contact", href: "/contact" },
  ];
  return items.filter((item): item is NavItem => !!item);
}

export const isExternal = (href: string) => /^(https?:|mailto:)/.test(href);

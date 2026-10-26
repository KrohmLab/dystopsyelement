import { site } from "../data/site.ts";

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface Ticket {
  href: string;
  external: boolean;
}

/**
 * Navigation principale (SITE_PLAN §1) : Nexen · Agenda · Prestations · Shop ↗ · Contact.
 * Prestations n'apparaît qu'une fois la collection `services` remplie, Shop qu'avec `site.shopUrl`.
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

/** `aria-current` : la rubrique est active sur sa page et ses sous-pages (`/agenda/...`). */
export function isCurrent(href: string, pathname: string): boolean {
  if (href.startsWith("http")) return false;
  const path = pathname.replace(/\.html$/, "").replace(/\/$/, "") || "/";
  return path === href || path.startsWith(`${href}/`);
}

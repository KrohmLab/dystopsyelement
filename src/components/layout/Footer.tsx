import type { ComponentType } from "react";
import { Link } from "react-router";
import type { NavItem, Ticket } from "../../lib/navigation";
import { site } from "../../site";
import { ExternalIcon, FacebookIcon, InstagramIcon, SoundCloudIcon, YouTubeIcon } from "../icons";
import { Logo } from "./Logo";

const NETWORKS: { key: keyof typeof site.socials; label: string; Icon: ComponentType<{ size?: 20 }> }[] = [
  { key: "instagram", label: "Instagram", Icon: InstagramIcon },
  { key: "facebook", label: "Facebook", Icon: FacebookIcon },
  { key: "soundcloud", label: "SoundCloud", Icon: SoundCloudIcon },
  { key: "youtube", label: "YouTube", Icon: YouTubeIcon },
];

const HEADING = "mb-4 font-display text-eyebrow font-bold text-cyan uppercase";
const LINK = "inline-flex items-center gap-1 text-ink-muted no-underline transition-colors duration-fast hover:text-ink";

function FooterLink({ item }: { item: NavItem }) {
  if (item.external || item.href.startsWith("mailto:")) {
    return (
      <a href={item.href} className={LINK} {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {item.label}
        {item.external && <ExternalIcon size={16} />}
        {item.external && <span className="sr-only">(nouvel onglet)</span>}
      </a>
    );
  }
  return (
    <Link to={item.href} className={LINK} prefetch="intent">
      {item.label}
    </Link>
  );
}

/**
 * Pied de page (DESIGN_SYSTEM §7.3) : marque + phrase + réseaux · navigation · contact, puis barre légale.
 * Liens réels uniquement : un réseau, une phrase ou un e-mail absent de content/site.json n'est pas affiché.
 */
export function Footer({ nav, ticket }: { nav: NavItem[]; ticket: Ticket }) {
  const socials = NETWORKS.flatMap((network) => {
    const href = site.socials[network.key];
    return href ? [{ ...network, href }] : [];
  });
  const contact: NavItem[] = [
    { label: "Formulaire", href: "/contact" },
    { label: "Billetterie", href: ticket.href, external: ticket.external },
    { label: "Boutique", href: "/shop" },
    ...(site.email ? [{ label: site.email, href: `mailto:${site.email}` }] : []),
  ];
  const columns = [
    { title: "Navigation", links: nav },
    { title: "Contact", links: contact },
  ];

  return (
    <footer id="pied-de-page" className="border-t border-cyan-line bg-void/85 px-gutter pt-14 pb-7">
      <div className="mx-auto max-w-site">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <Link to="/" className="inline-flex items-center gap-3 text-ink no-underline" aria-label={`${site.name}, accueil`}>
              <Logo className="size-10" />
              <span className="font-display text-label font-bold uppercase">{site.name}</span>
            </Link>
            {site.tagline && <p className="mt-4 max-w-prose text-ink-soft">{site.tagline}</p>}
            {socials.length > 0 && (
              <ul className="mt-5 flex gap-2.5">
                {socials.map(({ key, label, href, Icon }) => (
                  <li key={key}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/social block size-11 bg-cyan-line p-px transition-colors duration-base chamfer-sm hover:bg-cyan"
                    >
                      <span className="grid size-full place-items-center bg-void text-cyan transition-colors duration-base chamfer-sm group-hover/social:bg-cyan group-hover/social:text-on-accent">
                        <Icon size={20} />
                      </span>
                      <span className="sr-only">{label} (nouvel onglet)</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h2 className={HEADING}>{column.title}</h2>
              <ul className="grid gap-2">
                {column.links.map((item) => (
                  <li key={item.label}>
                    <FooterLink item={item} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap justify-between gap-x-6 gap-y-3 border-t border-line pt-5 text-small text-ink-muted">
          <span>
            © {new Date().getFullYear()} {site.name}
          </span>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <Link to="/mentions-legales" className={LINK}>
                Mentions légales
              </Link>
            </li>
            <li>
              <Link to="/mentions-legales#credits" className={LINK}>
                Crédits photos
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

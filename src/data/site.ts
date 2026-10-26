/**
 * Réglages globaux du site. Une valeur absente = l'élément n'est pas rendu (SITE_PLAN §10).
 * Ne rien inventer : ce qui manque reste vide avec un TODO(asso), et figure dans docs/TODO_CONTENU.md.
 */

export interface Site {
  name: string;
  /** URL publique du site, sans barre finale. */
  url: string;
  locale: string;
  /** Meta description par défaut. */
  description?: string;
  email?: string;
  shopUrl?: string;
  socials: {
    instagram?: string;
    facebook?: string;
    soundcloud?: string;
    youtube?: string;
  };
  tagline?: string;
  contactSubjects: string[];
  legal: {
    rna?: string;
    address?: string;
    publisher?: string;
  };
}

export const site: Site = {
  name: "Dystopsy Element",
  // TODO(asso) : remplacer par le domaine définitif quand il sera choisi.
  url: "https://dystopsyelement.krohmlab.workers.dev",
  locale: "fr_FR",
  // TODO(asso) : phrase de présentation pour les moteurs de recherche (≤ 155 caractères).
  description: undefined,
  // TODO(asso) : e-mail de contact.
  email: undefined,
  // TODO(asso) : URL de la boutique Vinted.
  shopUrl: undefined,
  // TODO(asso) : URLs des réseaux sociaux.
  socials: {},
  // TODO(asso) : phrase de présentation du footer.
  tagline: undefined,
  // TODO(asso) : liste des sujets du formulaire de contact à valider.
  contactSubjects: [],
  // TODO(asso) : n° RNA, siège, directeur de publication.
  legal: {},
};

# Dystopsy Element — Plan du site v2

> Objectif fixé par le président : **moins de texte, des sections qui mènent quelque part.**
> Version 2.1 (27/10/2026) : arborescence et sections reprises de la v1 (`dystopsyelements.pages.dev`), construites avec des **contenus provisoires numérotés** en attendant les vrais contenus.
> Chaque section est décrite par : contenu · CTA → destination.

## 0. Contenus : réels, provisoires, jamais inventés

Le prototype Figma Make contenait des contenus générés par IA. **Ils ne sont pas repris**, même reformulés : artistes (NEO-TRINITY, GLITCH.SYS…), membres (« Alex 'Zero' Mercer »…), produits (T-shirt Glitch, Hoodie Neon Core…), événement « SYSTEM FAILURE [01] », descriptions d'événements, textes « univers » (« protocole », « matrice »…), textes des activités, coordonnées, phrase du footer, termes des bandeaux (« SYNC_BPM:145 »…).

**Réel** (conservé) : logo Dystopsy Element, logo Nexen, affiches et bannières, photo de jour du festival, motifs graphiques, et les données factuelles des deux événements réels (§9).

**Provisoire** (décision du 27/10/2026) : pour construire dès maintenant toutes les pages, sections, cartes, animations et interactions, chaque contenu manquant est remplacé par un **contenu provisoire numéroté et visiblement factice** :

| Type | Exemple de provisoire |
|---|---|
| Événement | « Événement 1 », date « 2027-01-01 » marquée provisoire, lieu « Lieu 1 », ville « Ville 1 » |
| Artiste | « Artiste 1 », format Live / DJ Set, genre « Genre 1 » |
| Membre | « Membre 1 », rôle « Rôle 1 », pôle Direction / Organisation / Technique |
| Produit | « Produit 1 », catégorie T-shirts / Pulls / Autres, prix « 00,00 € » |
| Prestation | « Prestation 1 », 3 points « Point 1 »… |
| Question (FAQ) | « Question 1 ? » / « Réponse 1. » |
| Texte | « Texte provisoire 1. » (budgets DESIGN_SYSTEM §8 respectés) |
| Visuel | emplacement graphique (grille, motif, logo), jamais de photo de banque d'images |
| Lien externe | page interne du site ou accueil du service (`https://www.vinted.fr`), jamais d'URL inventée ni de `#` |

Règles :
- Tout provisoire vit dans `content/` avec **`placeholder: true`** : le remplacer = modifier un fichier, sans toucher au code.
- Le build liste les provisoires restants (`npm run build` affiche le compte). **Le site n'est pas « terminé » tant qu'il en reste** (CLAUDE.md §9) ; ils sont acceptés sur les aperçus.
- Les vrais contenus arrivent en dernier, fournis par l'asso (§11).

---

## 1. Arborescence

Reprise de la v1 (`dystopsyelements.pages.dev`), avec les pages que la v1 annonçait sans les avoir (Nexen, Prestations).

| Route | Page | v1 |
|---|---|---|
| `/` | Accueil | `/` |
| `/nexen` | Nexen Festival | lien « Nexen Festival 2026 » (pointait vers `/`) |
| `/agenda` | Agenda : onglets À venir / Passés | `/events` (« Billetterie ») |
| `/agenda/[slug]` | Fiche événement | `/events/:id` |
| `/prestations` | Prestations (décoration, arts vivants, production…) | lien « Prestations » (pointait vers `/`) |
| `/shop` | Boutique : vitrine, chaque produit renvoie vers son annonce **Vinted** | `/shop` (« Black Market ») |
| `/contact` | Contact + L'Équipe | `/contact` |
| `/mentions-legales` | Mentions légales + confidentialité | n'existait pas (obligatoire) |
| `/404` | Page introuvable | |

Navigation principale, dans le **menu plein écran** (bouton Menu, à toutes les tailles d'écran) : **Accueil · Nexen · Agenda · Prestations · Shop · Contact**. En-tête : logo, bouton rose **Billetterie** et bouton Menu.
Le bouton Billetterie pointe vers le `ticketUrl` du prochain événement qui en a un ; sinon vers `/agenda`.
**Billetterie : HelloAsso** et **achats : Vinted**, toujours en liens externes (nouvel onglet, icône ↗). Aucun panier ni paiement sur le site.

Redirections 301 (`_redirects`, générées depuis `content/site.json`) :
```
/events            /agenda           301
/events/:id        /agenda/:id       301
/shop/:id          /shop             301
/programmation     /nexen            301
/univers           /nexen            301
/infos             /nexen            301
```

---

## 2. Logique « prochain événement »

Au 26 octobre 2026, les deux événements réels sont passés. Le site ne met jamais en avant un événement terminé.

1. S'il existe un événement avec `endDate ≥ aujourd'hui` → il alimente le Hero et le bouton Billetterie.
2. Sinon → le Hero affiche le **dernier festival Nexen** en mode « passé » : visuel, titre, badge `Prochaine édition à venir` (sans date ni année), CTA **Suivre sur Instagram** (si l'URL existe) et **Voir l'agenda** → `/agenda`.
3. Un événement passé reste dans `/agenda` (« Passés »), sans bouton billetterie.

Le site est reconstruit chaque nuit (CLAUDE.md §7) pour que la bascule soit automatique.

---

## 3. Accueil `/`

> Demande du client (27/10/2026) : un accueil **toujours aussi graphique et fort dans sa DA**, avec un effet « waouh » et des animations, mais **moins de texte**, **aucune section de présentation** et **plus d'appels à l'action** vers les pages du site et les liens externes. Animations : DESIGN_SYSTEM §6.2.

Sections dans l'ordre, fonds alternés `void` / `abyss`. Aucun paragraphe de présentation.

**3.1 Hero** (plein écran, animé) — **un seul événement** (le prochain, sinon le dernier Nexen : §2), dans le grand cadre cyber de la v1 · badge statut · titre (décodage + glitch) · date · lieu
CTA principal **Prendre ma place** → `ticketUrl` · CTA secondaire **Voir l'événement** → `/agenda/[slug]`

**3.2 Ticker** — termes des affiches réelles : `OPEN AIR FESTIVAL ✦ PSYTRANCE · TECHNO · BASS · CHILL ✦`

**3.3 Portails** — remplace la section « Festival » en 4 étapes de la v1 : grille de grandes tuiles `Portal`, sans texte d'accompagnement : **Nexen** → `/nexen` · **Agenda** → `/agenda` · **Prestations** → `/prestations` · **Shop** → `/shop` · **Contact** → `/contact` · **Instagram** ↗ (si URL). Apparition en cascade.

**3.4 Nexen Festival** — comme la v1 : logo Nexen qui s'allume (néon) sur fond d'écailles en parallaxe, dates et lieu
Tuiles-liens : **Line-up** → `/nexen#line-up` · **L'univers** → `/nexen#univers` · **Infos pratiques** → `/nexen#infos`
CTA `festival` **Billetterie** → `ticketUrl` si à venir, sinon **Voir le festival** → `/nexen`

**3.5 Prochaines dates** — `// AGENDA` · « Prochaines dates » · **Tout l'agenda** → `/agenda` · 3 `EventCard` max

**3.6 Boutique** — comme la v1 : `// SUPPORTEZ L'ASSO` · « Boutique » · 4 `ProductCard` (survol, catégorie, prix) → annonce Vinted · **Voir tout le shop** → `/shop`

**3.7 CtaBanner** — **Nous écrire** → `/contact` · **Suivre sur Instagram** ↗ (si URL) · réseaux

---

## 4. Nexen `/nexen`

**Hero** : bannière de l'édition, H1 « NEXEN FESTIVAL » (glitch), dates et lieu, CTA `festival` **Billetterie** (si à venir), **Événement Facebook** ↗.
**`#line-up`** : grille d'`ArtistCard` (photo, format Live / DJ Set, genre) ; clic → **modale artiste** (photo, format, genre, courte bio, liens SoundCloud / Instagram). Affiche officielle du line-up en complément (image réelle).
**`#univers`** : bloc visuel (fond, écailles, logo néon) + une phrase courte.
**`#infos`** : `Accordion` de questions-réponses.
**`#galerie`** : grille de photos (photo de jour du festival + emplacements).
**CtaBanner** : **Prendre ma place** (si à venir) ou **Voir l'agenda**.

---

## 5. Agenda `/agenda` et `/agenda/[slug]`

**Liste** (v1 « Billetterie ») : hero court (H1 « AGENDA », une phrase), ticker, **onglets À venir / Passés** (filtrage sans rechargement, état dans l'URL `?vue=passes`), grille d'`EventCard`. Onglet vide : « Aucune date annoncée pour l'instant » + **Suivre sur Instagram** (si URL).

**Fiche** :
Hero : visuel plein écran, **Retour**, badge statut, H1, date, horaires, lieu, **Événement Facebook** ↗.
Barre d'actions collante sur mobile : **Prendre ma place** (si à venir et `ticketUrl`) + **Partager**.
**Le résumé** (v1 « Transmission ») : texte court, bouton **Lire la suite** qui déplie le reste.
**Line-up** : `ArtistCard` → modale artiste (comme `/nexen`).
Pied : 2 autres événements + CtaBanner.

---

## 6. Prestations `/prestations`

Hero court + une section ancrée par prestation (v1 : décoration & scénographie, arts vivants & performers, production d'événements) : visuel, titre, 3 points courts, CTA **Demander un devis** → `/contact?sujet=prestation&prestation=<id>`. Galerie de réalisations. CtaBanner **Demander un devis**.

---

## 7. Shop `/shop`

Vitrine (v1 « Black Market ») : H1, **filtres** par catégorie (Tous · T-shirts · Pulls · Autres, sans rechargement), grille de `ProductCard` (visuel gris → couleur au survol, catégorie, nom, prix). Clic → **annonce Vinted** du produit (nouvel onglet). Bouton **Voir la boutique Vinted** ↗ → `site.shopUrl`. Pas de fiche produit ni de panier sur le site.

---

## 8. Contact `/contact`

H1 « CONTACT ».
Raccourcis : **Billetterie** ↗ · **Boutique** → `/shop` · **Devis prestation** (pré-sélectionne le sujet).
Formulaire : Prénom · Nom · E-mail · Sujet (`site.contactSubjects`, prérempli via `?sujet=`) · Message · case RGPD · honeypot. Bouton **Envoyer**.
Bloc coordonnées (v1 « QG ») : e-mail, réseaux, ville.
**L'Équipe** : filtres par pôle (Tous · Direction · Organisation · Technique), grille de `MemberCard` ; clic → **modale membre** (photo, rôle, pôle, courte présentation).

## 8 bis. Mentions légales `/mentions-legales`

Éditeur (Dystopsy Element, n° RNA, siège, directeur de publication), hébergeur (Cloudflare, Inc.), crédits photos (`#credits`), données personnelles du formulaire.

---

## 9. Données réelles reprises de la v1

| Événement | Données conservées |
|---|---|
| **Nexen Festival 2026** | Dates : 5 → 7 juin 2026 · Lieu : Maine-et-Loire · Billetterie : `https://www.helloasso.com/associations/dystopsy-elements/evenements/nexen-festival-2026` · Facebook : `https://www.facebook.com/events/1363260745173238` · Visuels : bannière, logo Nexen, fond, écailles, affiche line-up, photo de jour |
| **Nexen's Home** | Date : 7 mai 2026, 21:00 → 01:00 · Lieu : La Maison Café, Nantes · Facebook : `https://www.facebook.com/events/1132770079034517` · Visuel : bannière · Billetterie v1 = `#` → **non reprise** |

Ces données sont à faire confirmer par l'asso lors de la migration.

---

## 10. Modèle de données (`content/`, validé par zod au build)

| Fichier | Contenu |
|---|---|
| `site.json` | nom, url, description, email, shopUrl, réseaux, tagline, sujets du formulaire, mentions légales, redirections v1 |
| `events/*.md` | frontmatter : slug, title, kind (festival / soirée), startDate, endDate, timeRange, venue, city, cover, ticketUrl, facebookUrl, status, lineup (slugs d'artistes), placeholder ; corps Markdown = résumé |
| `artists.json` | slug, name, format (Live / DJ Set), genre, photo, bio, liens, placeholder |
| `team.json` | slug, name, role, pole (Direction / Organisation / Technique), photo, bio, placeholder |
| `products.json` | slug, name, category (T-shirts / Pulls / Autres), price, image, vintedUrl, placeholder |
| `services.json` | slug, title, tagline, points, image, placeholder |
| `faq.json` | question, answer, placeholder |

`placeholder: true` = contenu provisoire (§0). Une valeur réelle absente (`null`) masque l'élément.

---

## 11. Contenus à fournir par l'association

Voir `docs/TODO_CONTENU.md` : chaque contenu provisoire de `content/` y est listé, avec les réglages de `site.json` encore vides.

# Dystopsy Element — Plan du site v2

> Objectif fixé par le président : **moins de texte, des sections qui mènent quelque part.**
> Chaque section est décrite par : contenu · CTA → destination.

## 0. Règle absolue : rien d'inventé

Le prototype Figma Make contenait beaucoup de contenus générés par IA. **Ils sont tous supprimés** et ne doivent pas être recréés, même reformulés :

| Contenu v1 généré par IA | Décision |
|---|---|
| Artistes (NEO-TRINITY, GLITCH.SYS, etc.), leurs photos, styles, labels, liens SoundCloud/Instagram | Supprimés |
| Membres de l'équipe et leurs photos | Supprimés |
| Articles de boutique (T-shirt Glitch, Hoodie Neon Core, Masque Anti-Smog, Longsleeve Cyber-Grid…) et pages produit | Supprimés |
| Événement « SYSTEM FAILURE [01] » | Supprimé |
| Descriptions d'événements (`shortDescription`, `longDescription`) | Supprimées |
| Textes « univers » (« protocole », « matrice », « Layer 01 », « Secteur 4 »…) | Supprimés |
| Textes des activités (décoration, arts vivants, production) | Supprimés, à réécrire par l'asso |
| Coordonnées (`contact@dystopsyelement.fr`, `+33 6 00 00 00 00`, « Underground City, Sector 7 ») | Supprimées |
| Phrase de présentation du footer | Supprimée |
| Termes des bandeaux défilants (« SYNC_BPM:145 », « SYSTEM_HACKED »…) | Supprimés |

**Ce qui est conservé (réel)** : le logo Dystopsy Element, le logo Nexen, les visuels d'affiches et de bannières, la photo de jour du festival, les motifs graphiques, et les données factuelles des deux événements réels (titre, dates, lieu, lien HelloAsso, lien Facebook) listées au §9.

Tout texte manquant reste **vide** avec `// TODO(asso)`. Un bloc dont le contenu est vide **n'est pas affiché** : on préfère une section absente à une section inventée.

---

## 1. Arborescence

| Route | Page | Remplace (v1) |
|---|---|---|
| `/` | Accueil | `/` |
| `/nexen` | Nexen Festival | lien « Nexen Festival 2026 » qui pointait vers `/` |
| `/agenda` | Événements (à venir / passés) | `/events` |
| `/agenda/[slug]` | Fiche événement | `/events/:id` |
| `/prestations` | Prestations de l'asso | lien « Prestations » qui pointait vers `/` |
| `/contact` | Contact | `/contact` |
| `/mentions-legales` | Mentions légales + confidentialité | n'existait pas (obligatoire) |
| `/404` | Page introuvable | |

**Pas de page boutique sur le site** : la boutique est sur **Vinted**. Le lien « Shop » de la navigation est un lien externe (nouvel onglet, icône ↗) vers `site.shopUrl`.
**Billetterie : HelloAsso**, toujours en lien externe.

Navigation principale : **Nexen · Agenda · Prestations · Shop ↗ · Contact** + bouton rose **Billetterie**.
Le bouton Billetterie pointe vers le `ticketUrl` du prochain événement qui en a un ; sinon vers `/agenda`.

Redirections 301 (`public/_redirects`) :
```
/events            /agenda           301
/events/:id        /agenda/:id       301
/shop              <URL Vinted>      301
/shop/:id          <URL Vinted>      301
/programmation     /nexen            301
/univers           /nexen            301
/infos             /nexen            301
```
(Les deux règles `/shop` sont générées depuis `site.shopUrl` ; si l'URL n'est pas encore fournie, elles redirigent vers `/`.)

---

## 2. Logique « prochain événement »

Au 26 octobre 2026, les deux événements réels sont passés. Le site ne met jamais en avant un événement terminé.

1. S'il existe un événement avec `endDate ≥ aujourd'hui` → il alimente le Hero et le bouton Billetterie.
2. Sinon → le Hero affiche le **dernier festival Nexen** en mode « passé » : visuel, titre, badge `Prochaine édition à venir` (sans date ni année), CTA **Suivre sur Instagram** (si l'URL existe) et **Voir l'agenda** → `/agenda`.
3. Un événement passé reste dans `/agenda` (« Passés »), sans bouton billetterie.

Le site est reconstruit chaque nuit (CLAUDE.md §7) pour que la bascule soit automatique.

---

## 3. Accueil `/`

Sections dans l'ordre, fonds alternés `void` / `abyss`. Une section dont les données sont vides n'est pas rendue.

**3.1 Hero** — badge statut · titre (glitch) · date · lieu
CTA principal **Prendre ma place** → `ticketUrl` (HelloAsso) · CTA secondaire **Voir l'événement** → `/agenda/[slug]`
(État de repli : §2.)

**3.2 Ticker** — termes issus des affiches réelles : `OPEN AIR FESTIVAL ✦ PSYTRANCE · TECHNO · BASS · CHILL ✦`

**3.3 Nexen Festival** — logo Nexen sur visuel de fond (comme la v1), dates et lieu de l'édition affichée
Tuiles-liens : **Line-up** → `/nexen#line-up` · **Infos pratiques** → `/nexen#infos` (si contenu fourni)
CTA principal (variante `festival`) **Billetterie** → `ticketUrl` si à venir, sinon **Voir le festival** → `/nexen`

**3.4 Agenda** — `// AGENDA` · « Prochaines dates » · action **Tout l'agenda** → `/agenda` · 3 `EventCard` max

**3.5 Prestations** — `// PRESTATIONS` · titre et accroche **à fournir** · 1 à 3 `ServiceTile` → `/prestations#<id>` · CTA **Demander un devis** → `/contact?sujet=prestation`
Non rendue tant que la collection `services` est vide.

**3.6 Shop** — bloc court (pas de grille de produits) : `// SHOP` · « La boutique est sur Vinted » · CTA **Voir la boutique** ↗ → `site.shopUrl`
Non rendu tant que `shopUrl` est vide.

**3.7 CtaBanner** — titre et accroche **à fournir** · CTA **Nous écrire** → `/contact` · **Suivre sur Instagram** ↗ (si URL)

---

## 4. Nexen `/nexen`

**Hero** : bannière de l'édition, H1 « NEXEN FESTIVAL » (glitch), dates et lieu, CTA **Billetterie** (si à venir).
**`#line-up`** : l'**affiche officielle du line-up** (image réelle, avec texte alternatif reprenant les noms qui y figurent, recopiés à l'identique). Une liste HTML d'artistes avec liens ne sera ajoutée que si l'asso la fournit.
**`#infos`** : `Accordion` de questions-réponses **fournies par l'asso**. Non rendu tant que vide.
**`#galerie`** : photos réelles uniquement (aujourd'hui : la photo de jour du festival). Non rendue sous 3 photos.
**CtaBanner** : **Prendre ma place** (si à venir) ou **Voir l'agenda**.

---

## 5. Agenda `/agenda` et `/agenda/[slug]`

**Liste** : H1 « AGENDA », sections **À venir** puis **Passés**, grille d'`EventCard`. Si rien à venir : « Aucune date annoncée pour l'instant » + **Suivre sur Instagram** (si URL).

**Fiche** :
Hero compact : visuel, badge statut, H1, date, horaires, lieu.
Barre d'actions collante sur mobile : **Prendre ma place** (si à venir et `ticketUrl`) + **Partager**.
Bloc « L'essentiel » : `summary` **fourni par l'asso** (≤ 60 mots), sinon absent.
Line-up : affiche si disponible ; liste d'artistes seulement si fournie.
Liens : événement Facebook, billetterie HelloAsso.
Pied : 2 autres événements + CtaBanner.

---

## 6. Prestations `/prestations`

Structure prête, contenu **entièrement à fournir** par l'asso (types de prestations, textes, photos de réalisations, éventuelles références).
Pour chaque prestation : section ancrée avec visuel, titre, 3 points courts et CTA **Demander un devis** → `/contact?sujet=prestation&prestation=<id>`.
Tant que la collection est vide : la page affiche seulement H1 + CTA **Nous contacter** et n'apparaît pas dans la navigation.

---

## 7. Contact `/contact`

H1 « CONTACT ».
Raccourcis avant le formulaire : **Billetterie** ↗ (HelloAsso) · **Boutique** ↗ (Vinted) · **Devis prestation** (pré-sélectionne le sujet).
Formulaire : Nom · E-mail · Sujet (liste définie dans `site.ts`, à valider par l'asso ; prérempli via `?sujet=`) · Message · case RGPD · honeypot. Bouton **Envoyer**.
Coordonnées : e-mail et réseaux **réels uniquement**, à fournir.

---

## 8. Mentions légales `/mentions-legales`

Éditeur (Dystopsy Element, n° RNA, siège, directeur de publication), hébergeur (Cloudflare, Inc.), crédits photos, données personnelles du formulaire. Champs à fournir ; la page ne publie que ce qui est renseigné.

---

## 9. Données réelles reprises de la v1

| Événement | Données conservées |
|---|---|
| **Nexen Festival 2026** | Dates : 5 → 7 juin 2026 · Lieu : Maine-et-Loire · Billetterie : `https://www.helloasso.com/associations/dystopsy-elements/evenements/nexen-festival-2026` · Facebook : `https://www.facebook.com/events/1363260745173238` · Visuels : bannière, logo Nexen, fond, écailles, affiche line-up, photo de jour |
| **Nexen's Home** | Date : 7 mai 2026, 21:00 → 01:00 · Lieu : La Maison Café, Nantes · Facebook : `https://www.facebook.com/events/1132770079034517` · Visuel : bannière · Billetterie v1 = `#` → **non reprise** |

Ces données sont à faire confirmer par l'asso lors de la migration.

---

## 10. Modèle de données

```ts
// src/content.config.ts
events: {
  title: string; slug: string; kind: "festival" | "soiree";
  startDate: date; endDate: date; timeRange?: string;
  venue: string; city?: string; mapUrl?: url;
  cover: image(); lineupPoster?: image();
  summary?: string.max(400);            // fourni par l'asso uniquement
  ticketUrl?: url;                      // HelloAsso
  facebookUrl?: url;
  status?: "complet" | "dernieres-places" | "annule";
  lineup?: { name: string; type?: "Live" | "DJ Set"; soundcloud?: url; instagram?: url }[]; // fourni par l'asso uniquement
}
services: { id: string; title: string; tagline: string.max(90); points: string[]; cover?: image(); icon: string }   // vide au départ
faq:      { question: string; answer: string.max(280) }                                                              // vide au départ

// src/data/site.ts
name: "Dystopsy Element";
email?: string;                                     // TODO(asso)
shopUrl?: url;                                      // TODO(asso) : URL de la boutique Vinted
socials: { instagram?: url; facebook?: url; soundcloud?: url; youtube?: url };   // TODO(asso)
tagline?: string;                                   // TODO(asso) : phrase du footer
contactSubjects: string[];                          // TODO(asso) : liste à valider
legal: { rna?: string; address?: string; publisher?: string };                    // TODO(asso)
```
Une valeur absente = l'élément n'est **pas rendu** (jamais de `href="#"`, jamais de texte de remplacement visible).

---

## 11. Contenus à fournir par l'association

| Élément | Où |
|---|---|
| URL de la boutique Vinted | `site.shopUrl` |
| URLs Instagram, Facebook, SoundCloud, YouTube | `site.socials` |
| E-mail de contact | `site.email` |
| Phrase de présentation (footer) | `site.tagline` |
| Prestations : types, textes, photos | collection `services` |
| Infos pratiques du festival | collection `faq` |
| Résumés des événements (≤ 60 mots) | `events/*.md` |
| Line-up texte avec liens (optionnel, l'affiche suffit) | `events/*.md` |
| Prochains événements et prochaine édition Nexen | `events/*.md` |
| Lien billetterie Nexen's Home (s'il existait) | `events/nexens-home.md` |
| Sujets du formulaire de contact | `site.contactSubjects` |
| Clé Web3Forms | variable Cloudflare `PUBLIC_WEB3FORMS_KEY` |
| Mentions légales (RNA, siège, directeur de publication) | `site.legal` |
| Nom de domaine final | `astro.config.mjs` |

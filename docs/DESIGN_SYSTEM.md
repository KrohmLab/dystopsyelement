# Dystopsy Element — Design System v2

> Version 2.1 · 27 octobre 2026 (accueil « mode spectacle ») · 2.0 · 26 octobre 2026 · Remplace le prototype Figma Make (dépôt `KrohmLab/dystopsyelement`).
> Les valeurs exactes vivent dans `src/styles/tokens.css`. Ce document explique **quoi utiliser, où, et pourquoi**.

---

## 0. Ce qui change par rapport à la v1

La v1 avait une direction artistique forte, mais chaque composant réinventait ses propres règles : 4 façons de faire un bouton, des arrondis `rounded-md`, `rounded-full` et des biseaux mélangés, des gris Tailwind pris au hasard (`gray-300` à `gray-900`), cyan et rose utilisés indifféremment, des textes « hacker » sur chaque bloc, un curseur custom, du scroll-jacking et ~10 Mo d'images.

La v2 garde **l'ADN** (noir profond, cyan `#75feed`, rose `#fc029b`, Orbitron + Rajdhani, coins biseautés, glitch, grille, scanlines) et impose **une seule règle par décision**.

| Sujet | v1 (constaté) | v2 (règle) |
|---|---|---|
| Couleurs d'accent | Cyan et rose interchangeables | **Rose = conversion**, **cyan = navigation / info / focus** |
| Formes | `rounded-*` + biseaux + cercles | **Biseau partout**, aucun arrondi (sauf pastilles d'état) |
| Boutons | 4 styles ad hoc | 1 composant `Button`, 4 variantes, 3 tailles |
| Gris | 9 nuances Tailwind | 4 tokens texte + 2 tokens ligne |
| Effets | Glitch, scan, parallax, curseur partout | Accueil spectaculaire (§6.2), autres pages sobres (§6.1) ; pas de curseur personnalisé |
| Texte | Paragraphes de 30–50 mots | Budget strict (voir §8), chaque section finit par un CTA |
| Polices | Google Fonts (requête externe) | Auto-hébergées (`@fontsource`), perf + RGPD |

---

## 1. Principes

**1. Aller à l'essentiel.** Une section = un message = une action. Si un bloc n'a pas de bouton qui mène quelque part, il n'a pas sa place.

**2. Le rose fait vendre, le cyan fait naviguer.** Un visiteur doit pouvoir repérer « où je prends ma place » en un coup d'œil : c'est toujours rose.

**3. L'univers est dans l'image, pas dans le texte.** L'ambiance cyberpunk passe par les visuels, les biseaux, la grille et les micro-effets, pas par des phrases du type « Le protocole de sécurité est suspendu ».

**4. Rapide d'abord.** Le site doit s'afficher en moins de 2 s sur un mobile en 4G, sur un parking de festival.

**5. L'accueil impressionne, les autres pages informent.** La page d'accueil est la vitrine : effet « waouh », animations à l'arrivée et au défilement, univers cyberpunk assumé (§6.2), avec un contenu réduit à des visuels et des liens. Les autres pages (agenda, fiches, contact, mentions) restent sobres : effets à l'interaction uniquement (§6.1).

---

## 2. Couleurs

### 2.1 Palette

| Token | Valeur | Rôle |
|---|---|---|
| `void` | `#020202` | Fond de page |
| `abyss` | `#050505` | Sections alternées, header scrollé |
| `surface` | `#0a0a0a` | Cartes, champs de formulaire |
| `surface-raised` | `#111114` | Survol de carte, menu mobile |
| `line` | `#1f1f24` | Bordures par défaut |
| `line-strong` | `#2e2e36` | Bordures au survol, séparateurs |
| `ink` | `#ffffff` | Titres, texte important |
| `ink-soft` | `#d1d5db` | Paragraphes |
| `ink-muted` | `#9ca3af` | Méta, légendes |
| `ink-faint` | `#6b7280` | Décoratif ou ≥ 24 px uniquement |
| `cyan` | `#75feed` | Navigation, info, liens, focus |
| `pink` | `#fc029b` | Conversion : billetterie, acheter, envoyer |
| `on-accent` | `#020202` | Texte posé sur cyan ou rose |
| `danger` | `#ff4d6d` | Erreurs de formulaire |

Variantes d'opacité prêtes : `cyan-dim` (10 %), `cyan-line` (30 %), `pink-dim` (10 %), `pink-line` (40 %).
Les palettes Tailwind par défaut sont **désactivées** dans `tokens.css` (`--color-*: initial`) : `bg-gray-800` ou `text-purple-500` ne compileront pas. C'est voulu.

### 2.2 Règles d'usage

| Situation | Couleur |
|---|---|
| Billetterie (HelloAsso), boutique (Vinted), « Envoyer », « Demander un devis » | **pink** |
| Liens, flèches « Voir », navigation, onglets actifs, focus clavier | **cyan** |
| Badge « Complet » / « Passé » | `ink-muted` sur `surface` |
| Badge « Bientôt » / « Nouveau » | cyan |
| Badge « Dernières places » | pink |
| Dégradé cyan → rose | **Réservé** à la barre de progression de scroll et au CTA du festival. Nulle part ailleurs. |

### 2.3 Contrastes vérifiés (sur `void`)

`ink` 20:1 · `ink-soft` 14:1 · `ink-muted` 7.9:1 · `cyan` 17:1 · `pink` 5.5:1 (AA texte) · `ink-faint` 4.3:1 (grand texte seulement).
**Texte blanc sur rose = 3.7:1 → interdit.** Sur un fond rose ou cyan, le texte est toujours `on-accent` (noir).

---

## 3. Typographie

| Famille | Token | Usage |
|---|---|---|
| **Orbitron** (variable 400–900) | `font-display` | Titres, boutons, navigation, sur-titres, prix |
| **Rajdhani** (500, 600, 700) | `font-body` | Tout le reste |

Installation : `@fontsource-variable/orbitron` et `@fontsource/rajdhani` (poids 500, 600, 700, sous-ensemble latin). Précharger uniquement Orbitron 900 et Rajdhani 500.

### 3.1 Échelle

| Token | Taille | Police / graisse | Casse | Usage |
|---|---|---|---|---|
| `text-display` | 40 → 88 px | Orbitron 900 | MAJ | Titre du hero d'accueil uniquement |
| `text-h1` | 32 → 60 px | Orbitron 900 | MAJ | Titre de page |
| `text-h2` | 28 → 48 px | Orbitron 900 | MAJ | Titre de section |
| `text-h3` | 18 → 24 px | Orbitron 700 | MAJ | Titre de carte |
| `text-lead` | 18 → 22 px | Rajdhani 500 | — | Accroche sous un titre (1 phrase) |
| `text-body` | 18 px | Rajdhani 500 | — | Paragraphe |
| `text-small` | 16 px | Rajdhani 500 | — | Texte secondaire |
| `text-label` | 13 px · tracking 0.2em | Orbitron 700 | MAJ | Boutons, navigation |
| `text-eyebrow` | 12 px · tracking 0.3em | Orbitron 700 | MAJ | Sur-titre `// CODE` |
| `text-micro` | 12 px · tracking 0.1em | Rajdhani 600 | MAJ | Badges, méta (date, lieu) |

Règles : pas de texte de lecture sous 16 px · jamais de paragraphe en Orbitron · une seule ligne de `text-lead` par section · `text-wrap: balance` sur les titres (déjà dans la base).

### 3.2 Le sur-titre « code »

C'est l'élément qui porte l'univers sans alourdir le texte. Format : `// ` + 1 à 2 mots en majuscules.
Exemples : `// AGENDA`, `// NEXEN`, `// PRESTATIONS`, `// SHOP`, `// CONTACT`. Ce sont des libellés de navigation, pas du contenu : ils ne décrivent rien d'inventé.
Couleur : cyan par défaut, rose si la section est orientée vente.

---

## 4. Espacement & mise en page

Base 4 px (échelle Tailwind standard). Trois tokens structurants :

| Token | Valeur | Usage |
|---|---|---|
| `max-w-site` | 1280 px | Conteneur de toutes les sections |
| `px-gutter` | 20 → 64 px | Marges latérales (fluide) — **remplace** les `px-4 sm:px-6 lg:px-8` / `px-8 md:px-16` de la v1 |
| `py-section` | 64 → 112 px | Espacement vertical de chaque section |

Rythme interne d'une section : sur-titre → 12 px → titre → 16 px → accroche → 32 px → contenu → 40 px → CTA.

Grilles : cartes en `grid gap-6 md:gap-8`, 1 colonne mobile, 2 en `md`, 3 en `lg`. Points de rupture Tailwind par défaut (`sm` 640, `md` 768, `lg` 1024, `xl` 1280). **Mobile-first** obligatoire.

---

## 5. Formes, bordures, effets

### 5.1 Le biseau (signature)

Tout élément « objet » (bouton, carte, image, champ, badge) a deux coins coupés : haut-gauche et bas-droit.

| Utilitaire | Coupe | Usage |
|---|---|---|
| `chamfer-sm` | 8 px | Badges, petits boutons, champs |
| `chamfer-md` | 12 px | Boutons md/lg, cartes |
| `chamfer-lg` | 16 px | Visuels, grands blocs, CTA festival |

`clip-path` coupe aussi les bordures CSS. Pour un contour biseauté, utiliser le **motif à deux calques** :

```html
<span class="relative block chamfer-md bg-cyan-line p-px">        <!-- calque « bordure » -->
  <span class="block chamfer-md bg-surface">…contenu…</span>       <!-- calque « fond » -->
</span>
```

Aucun `rounded-*` dans le code, sauf `rounded-full` pour les pastilles d'état (point « live ») et les puces de pagination.

### 5.2 Coins « crochets »

Deux équerres de 12 px (bordure 2 px) aux coins haut-gauche et bas-droit, en cyan à 60 % d'opacité, qui s'agrandissent à 24 px au survol. Composant `<Brackets />`. À utiliser sur les cartes et le hero, pas ailleurs.

### 5.3 Textures de fond

| Utilitaire | Effet | Où |
|---|---|---|
| `SiteBackdrop` | Fond fixe de tout le site : lueurs cyan / rose qui dérivent lentement, sol quadrillé en perspective qui **avance au défilement** (prolonge le sol du hero), scanlines, vignettage | Derrière toutes les pages ; les sections sont transparentes (`void`) ou voilées à 55 % avec filets lumineux (`abyss`) |
| `bg-grid` | Grille cyan à 5 %, pas de 40 px | Fond de 1 section sur 2, header scrollé |
| `bg-scanlines` | Lignes horizontales à 3 % | Par-dessus les visuels plein écran |
| Motifs `Pattern_0X` (PNG v1) | Ornements flottants | Retirés du DOM. Réutiliser **un** motif en SVG comme séparateur décoratif (`<Divider />`) |

### 5.4 Lueurs

`text-glow-cyan` / `text-glow-pink` et `shadow-glow-cyan` / `shadow-glow-pink` : **uniquement en état `:hover` / `:focus-visible`**, jamais au repos, sauf sur l'accueil (titre du hero, logo Nexen, néons décoratifs : §6.2).

### 5.5 Glitch

Utilitaire `glitch` + attribut `data-text`. Pages intérieures : **un seul élément par page**, le H1. Accueil : glitch permanent sur le titre du hero, glitch ponctuel (au survol ou à l'apparition) sur les tuiles Portail et le logo Nexen. Le logo du header glitche une fois quand on commence à scroller (comportement v1 conservé). Désactivé automatiquement par `prefers-reduced-motion`.

---

## 6. Mouvement

| Token | Valeur | Usage |
|---|---|---|
| `duration-fast` | 150 ms | Couleur, opacité |
| `duration-base` | 300 ms | Survol, menus |
| `duration-slow` | 600 ms | Apparition de section |
| `ease-out-expo` | — | Entrées |
| `ease-in-out` | — | Balayages |

### 6.1 Pages intérieures : sobre

Autorisé : apparition en fondu + translation 16 px au premier passage dans le viewport (une fois) · balayage lumineux `animate-shine` sur le CTA principal au survol · défilement `animate-marquee` du bandeau séparateur · flèche qui avance de 4 px au survol.

### 6.2 Accueil : mode spectacle

L'accueil doit produire un effet « waouh » dès l'arrivée. Animations prévues (composants §7.17) :

| Où | Effet | Technique |
|---|---|---|
| Lancement du site (1re page de la session, ≈ 1,5 s) | `SiteIntro` : écran noir, horizon néon qui se trace, sol quadrillé qui se lève, logo qui s'allume, puis le rideau s'ouvre sur la page ; les animations du hero attendent la fin de l'intro | CSS pur (`html[data-intro]`) |
| Hero, à l'arrivée (≈ 1 s) | Le cadre néon `NeonFrame` se trace, le titre se décode lettre par lettre (`DecodeText`) puis glitche, la grille en perspective `GridFloor` défile au sol, scanlines par-dessus | CSS + `motion` |
| Hero, ensuite | Parallaxe légère du visuel à la souris (desktop) et au défilement | `motion` (`useScroll`, ressorts) |
| Bandeau | Défilement continu `animate-marquee` | CSS |
| Portails | Apparition en cascade au défilement ; au survol : glitch RGB, balayage lumineux, équerres qui s'agrandissent, visuel qui passe du gris à la couleur | CSS + `Reveal` |
| Nexen | Le logo s'allume comme un néon qui grésille, le fond d'écailles se décale au défilement | CSS + `Parallax` |
| Sections | Apparition en fondu + glitch de ligne au premier passage | `Reveal` |

Garde-fous (bloquants) :
- **Le contenu est dans le HTML dès le départ** : titre, dates, liens sont rendus au pré-rendu ; l'animation les décore, elle ne retarde ni leur affichage, ni le LCP, ni le référencement. Sans JavaScript, tout est visible.
- **Le visiteur garde la main** : pas de scroll-jacking, pas de section « sticky » à étapes, pas de carrousel automatique.
- **`prefers-reduced-motion`** : toutes les animations sont coupées (décodage, parallaxe, néons, défilements), le contenu s'affiche directement.
- **Mobile allégé** : pas d'effet à la souris, parallaxe réduite, moins de couches animées.
- **Uniquement `transform` et `opacity`** pour les animations continues (pas de `filter` ni de `box-shadow` animés en boucle).

### 6.3 Interdit partout

Curseur personnalisé · scroll-jacking · animations qui retardent l'affichage du texte. **Exception validée le 27/10/2026** : la carte 3D de la page Nexen (`SiteMap3D`) utilise une section collante qui pivote en 3D au défilement, à la demande du client ; le défilement reste libre (pas de blocage), et en mouvement réduit la carte s'affiche directement dans son état final, sans section collante. Librairie autorisée : **`motion`** (comme le site Outrance), pour les animations liées au défilement ou à la souris ; le reste en CSS.

---

## 7. Composants

Tous dans `src/components/`, en composants React (`.tsx`).

### 7.1 `Button`

Props : `variant` · `size` · `href` · `icon` (nom Lucide) · `iconPosition` · `external` (ajoute `target="_blank" rel="noopener"` + icône ↗) · `fullWidth`.
Rendu `<a>` si `href`, sinon `<button>`.

| Variante | Repos | Survol | Usage |
|---|---|---|---|
| `primary` | Fond `pink`, texte `on-accent` | Fond `pink-hover` + `shadow-glow-pink` + `animate-shine` | **1 seul par section** : l'action n°1 (le bouton Billetterie du header est la seule exception permanente) |
| `secondary` | Contour `cyan-line`, fond `surface`/transparent, texte `ink` | Contour `cyan` plein, texte `cyan`, fond `cyan-dim` | Action alternative |
| `ghost` | Texte `cyan` + flèche | Flèche +4 px, `text-glow-cyan` | « Voir tout », liens de carte |
| `festival` | Contour dégradé cyan→rose (motif deux calques), fond `void` | Dégradé qui glisse | **Uniquement** le CTA Billetterie Nexen |

| Taille | Hauteur | Padding X | Typo |
|---|---|---|---|
| `sm` | 40 px | 16 px | `text-label` 12 px |
| `md` (défaut) | 48 px | 24 px | `text-label` |
| `lg` | 56 px | 32 px | `text-label` 14 px |

Toutes les tailles respectent une cible tactile ≥ 44 px (sauf `sm`, réservé au desktop). Forme : `chamfer-sm` (sm) / `chamfer-md` (md, lg). Libellés : verbe d'action, 1 à 3 mots (« Billetterie », « Voir le line-up », « Demander un devis »).

### 7.2 `Header` et `Menu` (plein écran, toutes tailles)

Hauteur `spacing-header` (72 px). Logo Dystopsy (SVG, 40 px) à gauche ; à droite `Button primary sm` « Billetterie » (dès `sm`) et le bouton **Menu** (trois traits qui deviennent une croix, libellé « Menu » / « Fermer » dès `md`). **Pas de liens dans l'en-tête, même sur grand écran** (décision du 27/10/2026) : toute la navigation passe par le menu plein écran.
Au repos : transparent. Après 50 px de scroll : fond `abyss/60` + `backdrop-blur` + bordure basse `cyan-line` + `bg-grid` + `shadow-header`. Le logo glitche une fois au premier défilement.
**Menu plein écran** : fond `void` avec lueurs cyan / rose, sol quadrillé, grand logo en filigrane qui pivote, scanlines. Liens numérotés (`00 Accueil`, `01 Nexen`…) en `text-h1` : entrée en cascade avec glitch RGB. **Un effet de survol par lien**, avec sa couleur : glitch RGB (cyan), néon qui grésille (lilas), lettres qui s'écartent (rose), découpe en deux tranches (pêche), secousse numérique (or), dégradé qui défile dans les lettres ; bande lumineuse qui balaie le lien. Grand logo en filigrane cyan à 14 % avec lueur. Colonne latérale : prochain événement, Billetterie pleine largeur, réseaux, e-mail.
Ouverture : rideau qui descend (`clip-path`) avec une barre néon cyan → rose au bord ; fermeture : rideau qui remonte, liens qui s'effacent. Focus piégé, Échap, page inerte, focus rendu au bouton (`useModal`). Mouvement réduit : apparition directe.

### 7.3 `Footer`

Trois colonnes (une seule sur mobile) : marque + 1 phrase + réseaux · navigation · contact. Puis une barre basse : © année · Mentions légales · Crédits photos.
Icônes réseaux : carrés `chamfer-sm` 44 px, contour `cyan-line`, survol fond `cyan` + icône `on-accent`. **Liens réels uniquement** : un réseau sans URL n'est pas affiché.

### 7.4 `Section` & `SectionHeader`

`<Section tone="void|abyss" grid id>` : applique `py-section`, `px-gutter`, `max-w-site`, fond, et `bg-grid` si demandé. Alterner `void` / `abyss` d'une section à l'autre.
`<SectionHeader eyebrow title lead align="left|center" action>` : sur-titre code, titre H2, accroche optionnelle (≤ 20 mots), et un `action` (Button ghost) aligné à droite en desktop, sous le titre en mobile.

### 7.5 `Hero`

Plein écran (`min-h-[100svh]`), visuel de fond chargé en priorité (`fetchPriority="high"`, LCP), assombri par dégradé `void` (bas) + `void/80` (haut), `mix-blend-luminosity` à 40 % (rendu v1 conservé), `bg-scanlines` par-dessus, `GridFloor` au sol et `NeonFrame` (desktop). Animations d'arrivée et parallaxe : §6.2.
Contenu : badge pulsant rose (`Badge live`) · titre `text-display glitch` · ligne méta (date · lieu) avec icônes cyan · 2 boutons (`primary` + `secondary`).
**Pas de carrousel** : le hero affiche le **prochain événement** (calculé au build depuis la collection `events`). S'il n'y en a aucun à venir, il affiche le dernier festival Nexen en état « passé » (voir SITE_PLAN §2). Les autres événements sont dans la section Agenda juste en dessous.

### 7.6 `EventCard`

Visuel 16:9 `chamfer-lg` (niveaux de gris → couleur au survol, comme la v1) · badge statut (`À venir` cyan / `Dernières places` rose / `Passé` neutre) · date en `text-micro` cyan · titre `text-h3` · lieu `text-small ink-muted` · **pas de description** · CTA : `ghost` « Voir l'événement » + bouton `primary sm` « Billets » si `ticketUrl` et à venir.
Toute la carte est cliquable (lien étendu via pseudo-élément), le bouton Billets reste un lien distinct au-dessus.

### 7.7 `ProductCard` (boutique vitrine)

Visuel carré `chamfer-md` (niveaux de gris → couleur au survol), badge catégorie, nom `text-h3`, prix en `font-display` cyan avec lueur. Toute la carte est un lien externe vers l'annonce **Vinted** (nouvel onglet, icône ↗) : aucune fiche produit ni panier sur le site.

### 7.8 `ServiceTile`

Pour Prestations. Icône Lucide 32 px dans un carré `chamfer-sm` bordé d'accent · titre `text-h3` · **une ligne** de description (≤ 15 mots, fournie par l'asso) · `Brackets` · CTA `ghost` « Découvrir ». Accents alternés cyan / rose / blanc (repris de la v1, purement décoratif).

### 7.9 `CtaBanner`

Bloc pleine largeur en fin de page : fond `abyss` + `bg-grid`, titre `text-h2`, une ligne, 1 bouton `primary` + 1 `secondary`. Chaque page se termine par un `CtaBanner` avant le footer.

### 7.10 `Badge`

`chamfer-sm`, `text-micro`, padding 4×10 px. Variantes : `live` (rose, point pulsant `animate-pulse-dot`), `info` (cyan), `neutral` (`ink-muted` sur `surface`), `outline`.

### 7.11 `Ticker` (séparateur)

Reprend `CyberSeparator` v1 en **une seule** variante : bandeau 48 px, `animate-marquee`, texte `text-eyebrow` alterné cyan/rose. Contenu limité aux termes présents sur les affiches officielles (« OPEN AIR FESTIVAL ✦ PSYTRANCE · TECHNO · BASS · CHILL ») et aux noms/dates d'événements réels. Les faux codes v1 (« SYNC_BPM:145 », « SYSTEM_HACKED »…) sont supprimés. `aria-hidden="true"`. Maximum 2 par page.

### 7.12 `Brackets`, `CyberFrame`, `Divider`

Ornements purs, `aria-hidden`, SVG inline. `CyberFrame` = le cadre du hero v1 converti en fichier SVG unique (desktop) + version mobile simplifiée. `Divider` = un motif `Pattern_0X` vectorisé, 40 % d'opacité.

### 7.13 Formulaires (`Field`, `Textarea`, `Select`, `Checkbox`)

Label au-dessus en `text-eyebrow ink-muted` · champ `surface`, `chamfer-sm`, hauteur 48 px, contour `line` (motif deux calques) → `cyan` au focus · erreur : contour `danger` + message `text-small danger` relié par `aria-describedby` · placeholder réaliste et en français (pas de « john.doe@network.com »). Champ honeypot anti-spam caché. Placeholders neutres (« Votre nom », « vous@exemple.fr »).

### 7.14 `Accordion` (FAQ / infos pratiques)

Basé sur `<details>/<summary>` natif (zéro JS). Bordure basse `line`, titre `text-h3`, icône + cyan qui pivote. Réponses ≤ 40 mots, avec lien si besoin.

### 7.15 `ScrollProgress`

Barre 2 px en haut de page, dégradé cyan → rose, via `animation-timeline: scroll()` en CSS (pas de JS). Masquée si non supportée.

### 7.16 Icônes

SVG inline dans `src/components/icons.tsx` (tracés Lucide), trait 1.5, tailles 16 / 20 / 24 / 32. Les icônes décoratives ont `aria-hidden="true"`. Icônes réseaux : Instagram, Facebook, SoundCloud, YouTube (si URL fournie).

---

### 7.16 bis Cartes avec modale (`ArtistCard`, `MemberCard`, `Modal`)

Carte portrait `chamfer-md` (photo en niveaux de gris → couleur au survol, `Brackets`), badge (format ou pôle), nom `text-h3`, une ligne en `text-small`. Clic ou Entrée → `Modal` : panneau `surface-raised` biseauté, photo, nom, rôle ou format, courte bio, liens ; focus piégé, Échap, clic sur le fond, retour du focus (`useModal`).
Filtres et onglets (`Tabs`) : boutons `secondary sm`, l'actif en cyan plein (`aria-pressed` / `aria-selected`), filtrage sans rechargement.

### 7.16 ter Couleurs Nexen

Tokens `nexen-violet`, `nexen-lilac` (Nexus Stage), `nexen-peach` (Engine Stage, Break / Fin), `nexen-gold` (village), `nexen-ember` (bénévoles), relevés sur l'affiche, le timetable et la carte 2026. Réservés à la page `/nexen` et aux éléments du festival ; le reste du site garde cyan / rose.

### 7.17 Briques d'animation (accueil)

Dans `src/components/motion/`. Toutes respectent `prefers-reduced-motion` (rendu statique) et affichent leur contenu sans JavaScript.

| Composant | Rôle |
|---|---|
| `Reveal` | Apparition au premier passage dans le viewport (fondu + translation 16 px), option `delay` pour les cascades |
| `DecodeText` | Texte qui se décode lettre par lettre à l'arrivée ; le vrai texte est dans le HTML, lu tel quel par les lecteurs d'écran |
| `Parallax` | Décalage d'un calque au défilement (et à la souris en desktop), amplitude réduite sur mobile |
| `NeonFrame` | Cadre néon SVG (équerres + lignes) qui se trace à l'arrivée, puis respire légèrement |
| `GridFloor` | Grille cyan en perspective qui défile au sol (fond du hero) |
| `NeonFlicker` | Allumage d'un néon qui grésille (logo Nexen) |
| `CountUp` | Chiffre qui défile jusqu'à sa valeur au premier passage dans le viewport |

### 7.18 `Portal` (tuile de navigation)

Grande tuile visuelle vers une page du site ou un lien externe. **Sur grand écran, les tuiles forment une rangée** : la première est étirée par défaut, celle survolée (ou au focus clavier) s'étire à son tour et les autres se replient en bande verticale avec leur libellé à la verticale. Sur mobile et tablette : grille. Visuel en fond (gris → couleur au survol), libellé `text-h3` d'un ou deux mots, sur-titre code optionnel, flèche → ou ↗ (externe). Survol / focus : barre de scan qui descend, liseré néon cyan → rose en bas, glitch RGB sur le libellé, balayage lumineux, visuel qui passe en couleur, `Brackets` qui s'agrandissent. Tuile entière cliquable, `chamfer-lg`. Une tuile dont la destination n'existe pas (URL non fournie, collection vide) n'est pas rendue.

## 8. Contenu : la règle « moins de texte »

**Rien de réel n'est inventé.** Tous les textes, noms, chiffres et coordonnées réels viennent de l'asso. En attendant, les sections sont construites avec des **contenus provisoires numérotés** (SITE_PLAN §0), qui respectent les budgets ci-dessous. Les contenus générés par IA dans Figma Make (artistes, membres, articles, descriptions, coordonnées) sont supprimés (voir SITE_PLAN §0).

Demande du président : aller à l'essentiel, chaque section mène quelque part.

| Élément | Budget max |
|---|---|
| Sur-titre | 2 mots |
| Titre H1 / H2 | 6 mots |
| Accroche (`lead`) | 1 phrase, 20 mots |
| Texte de carte | 15 mots (souvent zéro) |
| Paragraphe de page (rare) | 60 mots |
| Réponse FAQ | 40 mots |
| Libellé de bouton | 3 mots, verbe d'action |

Chaque section respecte le schéma **Titre → (1 ligne) → Visuel/Cartes → CTA**. Pas de section sans CTA, sauf le hero du footer.

Ton : direct, vouvoiement ou tournure impersonnelle. Les libellés de boutons (« Billetterie », « Voir le line-up », « Voir la boutique ») sont des éléments d'interface, pas du contenu. L'univers se dit avec les sur-titres `// CODE` et les visuels, pas avec du jargon. À bannir : « protocole », « matrice », « secteur 7 », « système hacké », faux codes hexadécimaux dans le contenu lisible.

---

## 9. Images

Format source déposé dans `assets/`, décliné en amont en AVIF + WebP aux largeurs 480 / 960 / 1440 / 1920 (script `sharp` ponctuel), servi via `<picture>` avec `width`/`height` (zéro décalage de mise en page) et `loading="lazy"` hors écran.
Budgets : hero ≤ 200 Ko (AVIF 1920 px) · carte ≤ 60 Ko · page d'accueil totale ≤ 900 Ko.
Traitement graphique uniforme : visuels d'événements en niveaux de gris + 70 % d'opacité au repos, couleur au survol (signature v1). `alt` descriptif obligatoire, `alt=""` pour les décoratifs.
Les photos Unsplash de la v1 (artistes, membres, produits) sont **supprimées**, sans remplacement par d'autres photos de banque d'images. Seuls les visuels réels de l'asso sont utilisés.

---

## 10. Accessibilité (niveau visé : WCAG 2.2 AA / RGAA)

`lang="fr"` · un seul `h1` par page · lien d'évitement « Aller au contenu » · focus visible cyan partout · navigation clavier complète (menu mobile compris) · cibles ≥ 44 px · contraste respecté (§2.3) · `prefers-reduced-motion` coupe glitch, marquee, shine, apparitions · les liens externes annoncent l'ouverture d'un nouvel onglet · les iframes SoundCloud sont chargées au clic (façade) avec un titre.

---

## 11. Performance (budgets bloquants)

Lighthouse mobile ≥ 95 sur les 4 axes (accueil : Performance ≥ 90, compte tenu des animations) · LCP < 2 s (4G) · CLS < 0.05 · INP < 200 ms · JavaScript total sur l'accueil < 150 Ko gzip (React, React Router et `motion` compris) · polices : 2 fichiers préchargés max · aucune requête vers un domaine tiers au chargement (sauf HelloAsso au clic, analytics Cloudflare).

---

## 12. Correspondance v1 → v2

| Composant v1 | Devient | Note |
|---|---|---|
| `HeroSlider` | `Hero` | Plus de carrousel, prochain événement |
| `FestivalSection` (scroll à 4 étapes) | Supprimée | Remplacée par le bloc `NexenFeature` (logo + 3 CTA) |
| `NexenSection` | `NexenFeature` | Liens vers `/nexen#line-up`, `#infos` (les routes v1 `/programmation` etc. n'existaient pas) |
| `ActivitiesSection` | `ServiceTile` | Textes v1 supprimés, contenu à fournir par l'asso |
| `MerchSection` (react-slick) + pages Shop | `ProductCard` (accueil + `/shop`) | Vitrine, chaque produit renvoie vers Vinted ; produits v1 supprimés |
| `CyberSeparator` (4 variantes) | `Ticker` (1 variante) | Contenu réel |
| `FloatingPattern` | `Divider` | Un seul motif, statique |
| `FestivalSection` / `NexenSection` (animations) | `Parallax`, `NeonFlicker`, `Reveal` | Effet « waouh » conservé sur l'accueil, sans scroll-jacking |
| `CustomCursor` | Supprimé | Décision confirmée le 27/10/2026 |
| `CyberFrame` | `CyberFrame` (SVG fichier) | 18 Ko de chemins inline → fichier mis en cache |
| `components/ui/*` (60 fichiers shadcn), MUI, Emotion, Radix, recharts, react-dnd… | Supprimés | Inutilisés |

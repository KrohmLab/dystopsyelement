# Hero « Hologramme » — brief d'intégration

> À lire avant de toucher au code. Maquettes validées par l'asso (canevas Design, versions 06 et 07).
> Branche de départ : `ameliorations-mobile-souris` (commit `267b74c`). Crée une branche `hero-hologramme`.
> Les règles de `CLAUDE.md`, `docs/DESIGN_SYSTEM.md` et `docs/SITE_PLAN.md` restent prioritaires (tokens, pas de contenu inventé, accessibilité, budgets de performance).

## 1. Les fichiers de référence

Le dossier `reference/` contient les prototypes validés, en HTML autonome. Ouvre-les dans Chrome et fais défiler **à l'intérieur du cadre** pour voir l'intro puis la sortie.

| Fichier | Ce qu'il montre |
|---|---|
| `hologramme-festival-grille-*.html` | Variante **festival** : logo Nexen dans le radar, sol quadrillé |
| `hologramme-club-*.html` | Variante **soirée** : visuel de l'événement dans le radar et en fond |
| `hologramme-styles-prototype.css` | CSS brut des prototypes (keyframes, classes), à porter |
| `img/` | Visuels utilisés (déjà présents dans `assets/`, sauf le recadrage `nexens-home-maison.webp`, donné pour montrer le cadrage attendu) |

Chaque variante existe en desktop 1440×900, tablette 820×1180 et mobile 390×844 : les positions de chaque format sont dans les fichiers.

Ce sont des **maquettes** : valeurs en pixels figés, couleurs en hexadécimal, conteneur de défilement interne. Ne les copie pas telles quelles. Reproduis le **rendu et la chorégraphie** avec l'architecture, les tokens et les composants du projet.

## 2. Ce qu'il faut construire

Remplacer le contenu de `src/components/blocks/HomeHero.tsx` par le hero hologramme. **Un seul composant**, dont la variante dépend de l'événement mis en avant (`featured`) :

| | `kind: "festival"` | `kind: "soiree"` |
|---|---|---|
| Centre du radar | Logo Nexen (`festival/logo-nexen`) en hologramme | Visuel de l'événement (`event.cover`) en hologramme, masque circulaire |
| Fond | `event.cover`, sinon `festival/fond` (comme aujourd'hui) | `event.cover` |
| Titre | Titre de l'événement (glitch) | Titre de l'événement ; s'il fait 2 mots, 2e mot en contour néon (cf. « NEXEN'S / HOME ») |

Le recadrage du visuel au centre du radar se règle par un **nouveau champ optionnel** du schéma des événements, `heroFocus` (valeur `object-position`, ex. `"72% 40%"`, défaut `"50% 50%"`). Pour Nexen's Home, le cadrage attendu est celui de `img/nexens-home-maison.webp` (la maison, sans le titre de l'affiche).

**Contenus** : on garde exactement la logique actuelle de `HomeHero` (badge selon `upcoming`/`status`, date, lieu, boutons Billetterie / Voir l'agenda / Voir l'événement / Instagram). Les textes des prototypes (« Soirée club », lien Facebook, horaires) ne sont que des exemples : **n'ajoute aucun contenu** qui ne vient pas de `content/`.

### Anatomie

```
<section data-floor="hero" class="holo-hero"> (hauteur 260svh, porte le view-timeline --hero)
  └─ .holo-hero__stage  (sticky, top 0, hauteur 100svh)
       ├─ fond : visuel en parallaxe/zoom + voile + scanlines
       ├─ radar : graduations, 2 anneaux pointillés, anneau à 2 points, 2 arcs néon, balayage conique,
       │          cône de lumière, plateforme, particules montantes, centre holographique (logo ou visuel)
       ├─ texte : badge, H1 (glitch), méta, boutons  + calque RGB dupliqué (aria-hidden, inert)
       ├─ point lumineux d'extinction
       └─ voile noir de fin
```

Découpe proposée : `blocks/hologram/HoloRadar.tsx` (radar seul, décoratif, prop `center: ReactNode`), `blocks/hologram/HoloCenter.tsx` (logo ou visuel), `blocks/HomeHero.tsx` (assemblage + texte). Styles dans `src/styles/theme.css`, section « Hero hologramme », avec les tokens (`void`, `cyan`, `pink`, `nexen-violet`, `nexen-lilac`…), aucune couleur en dur dans les composants.

## 3. Le sol quadrillé

Ne crée pas de deuxième sol : le sol de `SiteBackdrop` (`data-floor="hero"`) est déjà affiché sous le hero. Le radar doit sembler **posé sur l'horizon** (plateforme juste au-dessus de la ligne rose).

Pour lier le sol au défilement du hero, déclare `timeline-scope: --hero` sur `body` : le fond fixe (hors du hero dans le DOM) peut alors utiliser `animation-timeline: --hero`. Effets attendus sur le sol pendant la sortie (cf. variante festival) : il s'aplatit (`rotateX` 72° → 82°), une deuxième grille rose avance avec le défilement, puis il « plonge » vers l'avant et s'efface au moment où l'hologramme s'éteint.

## 4. L'intro (au chargement)

Remplace la séquence de `SiteIntro` par celle des prototypes, en gardant tout le mécanisme existant (`INTRO_SCRIPT` : une seule fois par session, jamais en mouvement réduit, `html[data-intro]`).

| Temps | Effet |
|---|---|
| 0 → 0,45 s | Ligne cyan horizontale qui s'allume au centre (allumage d'écran cathodique) |
| 0,45 → 0,8 s | La ligne s'épaissit dans un éclair blanc puis redevient fine |
| 0,75 → 3,1 s | Logo Dystopsy en scintillement néon ; « {site.name} présente » qui se resserre lettre par lettre |
| 2,55 → 3,7 s | Trois ondes de choc (cyan, rose, cyan) |
| 2,8 → 3,1 s | Éclair rose sur la ligne |
| 3,0 → 3,7 s | L'écran s'ouvre en deux (moitié haute vers le haut, basse vers le bas) |

`--intro-offset` passe à **3,1 s** (synchronise toutes les entrées du hero). Entrée du hero après l'intro : le radar se déploie en tournant (1,4 s), sur-titre et badge en fondu montant, titre dévoilé ligne par ligne de gauche à droite, puis méta et boutons, enfin l'indication « Défiler » (souris animée, desktop et tablette seulement).

## 5. La sortie au défilement (le cœur de la demande)

Pilotée en CSS par `view-timeline: --hero block` sur la section, plages en `contain` (la phase où l'étage sticky est collé) :

| Plage `contain` | Élément | Effet |
|---|---|---|
| 0 % → 100 % | Fond | Zoom 1,06 → 1,4 |
| 0 % → 6 % | « Défiler » | Disparaît |
| 6 % → 30 % | Texte | **Glitch de sortie** : découpes `clip-path` en tranches, décalages horizontaux, `skew`, `hue-rotate`, écrasement final en ligne (`scaleX(2.2)`, `clip-path: inset(50% 0)`), opacité 0. Le calque RGB dupliqué apparaît et se décale en sens inverse |
| 4 % → 42 % | Radar | Glisse au centre de l'écran et grossit (×1,15 ; ×1,3 sur mobile) |
| 50 % → 80 % | Radar | **Extinction** : grésillement de luminosité, écrasement en ligne lumineuse (`scale(1.25, .012)`), puis en point, puis disparition |
| 72 % → 92 % | Point lumineux | Apparaît au centre puis s'éteint (rémanence) |
| 70 % → 100 % | Sol | Plonge et s'efface |
| 82 % → 100 % | Voile noir | Monte à 100 % : transition propre vers la section suivante |

Les keyframes exactes sont dans `hologramme-styles-prototype.css` : `h-glitch`, `h-rgb`, `h-off`, `h-dot`, `h-dark`, `s-bgzoom`, `s-tilt`, `s-travel`, `s-dive`, et `h-move` (la translation du radar varie selon le format, calcule-la pour centrer le radar sur l'écran réel).

**Arrivée de la section suivante** : le titre et les portails (« Explorer le site ») apparaissent au fil de leur entrée dans l'écran (`animation-timeline: view()`, plage `entry`), légèrement décalés entre eux. Réutilise `Reveal` si c'est plus cohérent.

Règles techniques : animations scroll-driven sur des **éléments enveloppes** distincts de ceux qui ont des animations en temps (rotation des anneaux, apparition), sinon elles s'écrasent. Uniquement `transform`, `opacity`, `filter`, `clip-path`.

## 6. Niveaux de mouvement et repli

| Niveau (`useMotionLevel`) | Comportement |
|---|---|
| `full` | Tout, y compris la parallaxe souris existante sur le fond |
| `tablet` | Tout sauf la parallaxe souris |
| `mobile` | Tout, mais sans `blur` dans le glitch (coût GPU) et 8 particules au lieu de 16 |
| `reduced` | Pas d'intro, pas de rotation, pas de glitch ; hero statique de 100svh, aucune sortie animée |

Sans support de `animation-timeline` (`@supports not`) : le hero fait 100svh, aucune animation liée au défilement, la page reste propre.

## 7. Accessibilité

Un seul `h1`. Le calque RGB dupliqué porte `aria-hidden="true"` et `inert`. Radar, intro, point et voiles : `aria-hidden`. Termine la keyframe `h-glitch` par `visibility: hidden` : une fois le texte disparu, les boutons invisibles ne sont plus cliquables ni atteignables au clavier (ils redeviennent visibles en remontant).

## 8. Critères de fin

- [ ] Rendu conforme aux 6 fichiers de référence sur Chrome à 1440, 820 et 390 px (y compris en hauteur réduite, ex. 1280×720)
- [ ] Intro une seule fois par session ; hero et intro synchronisés par `--intro-offset`
- [ ] Sortie au défilement fluide (60 i/s sur desktop, pas de saccade visible sur un mobile milieu de gamme)
- [ ] Variante choisie automatiquement selon `kind` ; `heroFocus` dans le schéma ; Nexen's Home cadré sur la maison
- [ ] Aucune couleur ni taille en dur hors tokens ; aucun contenu ajouté
- [ ] `prefers-reduced-motion` et navigateur sans `animation-timeline` testés
- [ ] Lighthouse mobile ≥ 95 sur `/` ; JS ajouté sur l'accueil < 3 Ko (tout est en CSS)
- [ ] `npm run typecheck`, `npm run lint`, `npm test`, `npm run build` au vert

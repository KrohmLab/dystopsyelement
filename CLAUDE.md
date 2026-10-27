# CLAUDE.md — Dystopsy Element v2

Tu es le **product builder** (concepteur-développeur) du site de l'association **Dystopsy Element** (au singulier ; seuls l'ancienne URL `dystopsyelements.pages.dev` et l'URL HelloAsso gardent un « s »).
Tu reconstruis le site **de zéro**, en gardant la direction artistique de la v1 mais en la simplifiant, puis tu le déploies sur **GitHub → Cloudflare Workers** (assets statiques).
La stack est **la même que celle du site Outrance** (`~/Documents/GitHub/outrance`), standard de tous les sites KrohmLab : en cas de doute sur un choix technique, fais comme Outrance.
Figma n'est plus utilisé : ce dépôt est la seule source de vérité.

## 1. Documents de référence (à lire avant toute ligne de code)

| Fichier | Contenu | Autorité |
|---|---|---|
| `docs/DESIGN_SYSTEM.md` | Principes, tokens, composants, règles de contenu | Fait foi pour le visuel |
| `docs/SITE_PLAN.md` | Pages, sections, CTA et destinations, modèle de données | Fait foi pour la structure |
| `src/styles/tokens.css` | Tokens Tailwind v4 (déjà prêts, à importer tel quel) | Source unique des valeurs |
| `docs/styleguide.html` | Rendu visuel de référence des tokens et composants | Référence visuelle |
| `assets/brand/logo-dystopsy.svg` | Logo extrait de la v1 (`fill="currentColor"`) | |

En cas de conflit entre ces documents et une idée « qui rendrait mieux » : **les documents gagnent**. Si une règle te semble mauvaise, signale-le dans ta réponse au lieu de la contourner.

## 2. Stack

Identique au site Outrance : mêmes paquets, mêmes versions majeures, mêmes conventions.

| Couche | Choix | Pourquoi |
|---|---|---|
| Framework | **React Router 7** (mode framework, `ssr: false` + `prerender`) sur **Vite** | Chaque page est pré-rendue en HTML au build, puis React prend le relais (navigation, interactivité). Même stack qu'Outrance. |
| UI | **React 19** | Composants partagés entre les sites KrohmLab |
| Styles | **Tailwind CSS v4** via `@tailwindcss/vite`, tokens dans `src/styles/tokens.css` | Tokens centralisés |
| Langage | **TypeScript strict** (`noUncheckedIndexedAccess`) | |
| Contenus | Dossier `content/` : `site.json`, `events/*.md` (frontmatter YAML), validés par **zod** dans `src/content/load.server.ts` (`schemas.ts`) ; Markdown rendu avec `marked` | Ajouter un événement = ajouter un fichier. Un contenu invalide fait échouer le build. |
| Images | Fichiers sources dans `assets/`, importés par Vite (URL avec empreinte). Redimensionnés en amont (script `sharp` ponctuel) ; `width`/`height`, `loading="lazy"` hors écran | Comme Outrance |
| Polices | `@fontsource-variable/orbitron`, `@fontsource/rajdhani` (500/600/700, latin), importées dans le CSS | Pas de Google Fonts (perf + RGPD) |
| Icônes | SVG inline dans `src/components/icons.tsx` | Comme Outrance |
| Animations | CSS d'abord ; `motion` autorisé quand une animation le justifie, toujours coupée par `prefers-reduced-motion` | |
| SEO | `pageMeta()` (`src/lib/seo.ts`) dans le `meta` de chaque route ; `scripts/seo-files.mjs` génère sitemap, robots.txt et `_redirects` ; JSON-LD `MusicEvent` sur les fiches événement | |
| Qualité | `npm run typecheck` (`react-router typegen && tsc`), `npm run lint` (ESLint + typescript-eslint + react-hooks) | |
| Runtime | Node **24 LTS** (fichier `.node-version`) | |

Versions : épingle des versions exactes dans `package.json` (pas de `^`), publiées depuis **au moins 14 jours**, et alignées sur Outrance.
Interdit : MUI, Emotion, Radix, shadcn/ui, react-slick, recharts, react-dnd, toute librairie de carrousel. Si tu ressens le besoin d'une dépendance, justifie-la dans le message de commit.

## 3. Structure du dépôt

```
/
├─ CLAUDE.md
├─ docs/                     DESIGN_SYSTEM.md · SITE_PLAN.md · styleguide.html · TODO_CONTENU.md
├─ assets/                   images sources réelles uniquement (brand/, events/, festival/, patterns/)
├─ content/                  site.json · events/*.md · artists.json · team.json · products.json · services.json · faq.json
├─ public/                   favicon.svg · _headers (§7)
├─ scripts/                  postbuild.mjs (404.html) · seo-files.mjs (sitemap, robots, _redirects)
├─ src/
│  ├─ root.tsx               document HTML, en-tête, pied de page, lien d'évitement
│  ├─ routes.ts              table des routes
│  ├─ routes/                home · nexen · agenda · evenement · prestations · shop · contact · mentions-legales · not-found · styleguide
│  ├─ components/            ui/ (Button, Badge, Field…) · layout/ (Header, Footer…) · motion/ (Reveal, DecodeText, Parallax…) · blocks/ (Hero, Portal, EventCard…) · icons.tsx
│  ├─ content/               schemas.ts · load.server.ts (lecture + validation au build, jamais envoyé au navigateur)
│  ├─ lib/                   seo.ts · events.ts (prochain événement) · utilitaires
│  ├─ site.ts                réglages du site côté client (depuis content/site.json)
│  └─ styles/                theme.css (Tailwind + polices + tokens) · tokens.css
├─ .github/workflows/        ci.yml · nightly-rebuild.yml (§7)
├─ react-router.config.ts    pré-rendu de toutes les routes
├─ vite.config.ts
├─ wrangler.jsonc            Worker Cloudflare (§7)
└─ package.json
```

## 4. Règles de code

1. **Aucune valeur en dur.** Pas de `#75feed`, `bg-[#...]`, `text-[13px]`, `rounded-md`. Uniquement les classes issues des tokens (`bg-void`, `text-cyan`, `text-h2`, `chamfer-md`, `px-gutter`…). La palette Tailwind par défaut est désactivée : si une classe ne compile pas, c'est qu'elle est interdite.
2. **Un composant = une responsabilité.** Les pages assemblent des composants, elles ne contiennent pas de styles complexes.
3. **Pas de contenu dans les composants.** Les textes viennent de `content/` (`site.json`, `events/*.md`).
4. **Une URL manquante = pas de bouton.** Jamais de `href="#"`. Les champs optionnels absents masquent l'élément.
5. **Rose = conversion, cyan = navigation** (DESIGN_SYSTEM §2.2). Un seul `Button primary` par section (hors bouton Billetterie du header).
6. **Budgets de texte** (DESIGN_SYSTEM §8) : si un texte fourni les dépasse, raccourcis-le et signale-le.
7. **Accessibilité** (DESIGN_SYSTEM §10) dès le premier composant, pas en fin de projet.
8. **N'invente rien de réel, construis avec du provisoire.** Aucune donnée présentée comme vraie n'est inventée (date, lieu, prix, URL, nom d'artiste ou de membre, e-mail, texte de présentation). Pour construire pages, sections et interactions avant l'arrivée des contenus, utilise des **contenus provisoires numérotés et visiblement factices** (« Artiste 1 », « Événement 2 », « Produit 3 »…) marqués `placeholder: true` dans `content/` (SITE_PLAN §0). Les liens externes provisoires pointent vers une page du site ou l'accueil du service, jamais vers `#` ni une URL inventée. `docs/TODO_CONTENU.md` liste tout ce qui reste provisoire.
9. Commits en français, au format `type(portée): message` (`feat(hero): état prochaine édition`).

## 5. Reprise des contenus et assets de la v1

La v1 est dans le dépôt `KrohmLab/dystopsyelement` (branche `main`, dernier commit Figma Make `7e913f0`).
1. Avant de remplacer le code, crée le tag **`v1-figma-make`** sur le dernier commit pour l'archiver.
2. Récupère depuis `src/imports/` de la v1 et place dans `assets/` (renommés en kebab-case) :
   `NXN26---Banner-FB.jpg` → `events/nexen-2026-banner.jpg` · `NexensHome---Banner-FB.png` → `events/nexens-home-2026-banner.jpg` (convertir en JPG qualité 85) · `Logo-NEXEN.png` → `festival/logo-nexen.png` · `NXN26---Fond-Vierge-(Carré).jpg` → `festival/fond.jpg` · `Ecailles_FULL.jpg` → `festival/ecailles.jpg` · `nexen_jour.jpg` → `festival/photo-jour.jpg` · `8354966702361017823.png` (affiche line-up officielle) → `festival/lineup-2026.jpg` · `Pattern_01-solo.png` → vectoriser ou garder en PNG pour `Divider`.
   Les fichiers sources > 2 Mo doivent être redimensionnés à 2400 px max avant commit (script `sharp` ponctuel, non conservé).
3. `CyberFrame` : convertis les chemins de `src/imports/svg-esp92axs1t.ts` (+ `HeaderHomeMobile.tsx` pour mobile) en fichiers `.svg` dans `src/assets/frames/`, importés en `?raw` ou convertis en composants React, `fill="currentColor"`.
4. Données : crée **uniquement** les 2 événements réels listés dans SITE_PLAN §9 (Nexen Festival 2026, Nexen's Home), avec leurs seules données factuelles. **Ne reprends pas** les descriptions, les artistes, l'événement « SYSTEM FAILURE [01] », les produits, les membres ni aucun autre contenu de la liste SITE_PLAN §0.
5. Les URLs Unsplash, les IDs SoundCloud fictifs, les liens `#` et les coordonnées v1 ne sont pas repris. Là où il faut quelque chose pour construire, utilise les contenus provisoires numérotés (§4.8).

## 6. Intégrations

| Besoin | Solution | Config |
|---|---|---|
| Billetterie | **HelloAsso**, lien externe (nouvel onglet) | `ticketUrl` par événement |
| Formulaire de contact | **Web3Forms** (gratuit, sans backend) — alternative : Formspree | Clé publique en variable `VITE_WEB3FORMS_KEY` (variable de build Workers Builds, voir §7). Envoi `fetch` en amélioration progressive : le `<form action>` fonctionne aussi sans JS. Honeypot + case RGPD. |
| Pré-remplissage du sujet | Lecture de `?sujet=` côté client (5 lignes de JS) | |
| SoundCloud | Façade : bouton « Écouter » → injecte l'iframe au clic | |
| Boutique | **Vinted**, lien externe unique (navigation, bloc `ShopLink`, page contact). Aucun catalogue sur le site. | `site.shopUrl` |
| Statistiques | **Cloudflare Web Analytics** (sans cookie) | Activer dans le tableau de bord Cloudflare (Web Analytics, site `*.workers.dev` puis domaine perso), aucun script à ajouter |
| Carte / itinéraire | Simple lien sortant (OpenStreetMap ou Google Maps), pas d'iframe | |

## 7. Déploiement

**GitHub**
- Dépôt : `KrohmLab/dystopsyelement` (renommé ; l'ancien nom `dystopsyelements` redirige). **`main` = production** (comme le site Outrance) : une branche et une PR vers `main` par phase ou par changement, avec l'URL d'aperçu Cloudflare dans la description. La branche `production` de la v1 n'est plus utilisée (à supprimer après la mise en ligne).
- **Couper la synchronisation Figma Make** avec ce dépôt avant le premier push v2 (sinon elle écrasera le code). À faire par l'utilisateur dans Figma Make ; rappelle-le-lui si ce n'est pas confirmé.
- `ci.yml` : sur chaque PR et sur `main`, `npm ci && npm run typecheck && npm run lint && npm run build`.

**Cloudflare Workers** (Worker existant `dystopsyelement`, compte Krohm Lab, URL `dystopsyelement.krohmlab.workers.dev`) — même fonctionnement que le site Outrance.
- Worker décrit dans `wrangler.jsonc` à la racine (versionné). Aujourd'hui **sans script** : tout est servi en fichiers statiques depuis `build/client`. Si une API côté serveur devient nécessaire (comme `/api/newsletter` chez Outrance), ajouter `main: "./worker/index.ts"` et `run_worker_first`.
  ```jsonc
  {
    "$schema": "node_modules/wrangler/config-schema.json",
    "name": "dystopsyelement",
    "compatibility_date": "2026-10-01",
    "workers_dev": true,
    "preview_urls": true,
    "previews": {},
    "assets": {
      "directory": "./build/client",
      "html_handling": "drop-trailing-slash",
      "not_found_handling": "404-page"
    }
  }
  ```
  `wrangler` en `devDependency` (version épinglée). Script `preview` : `npm run build && wrangler dev`.
- **Workers Builds** (connexion Git, réglée par l'utilisateur dans le tableau de bord) : dépôt `KrohmLab/dystopsyelement`, branche de production `main`, commande de build `npm run build`, déploiement `npx wrangler deploy` ; onglet *Previews* : builds des autres branches activés, commande `npx wrangler preview` (d'où le bloc `"previews": {}`) → URL d'aperçu par branche et par PR. La version de Node est lue dans `.node-version` (pas de variable `NODE_VERSION`). Variable de build : `VITE_WEB3FORMS_KEY` (variable **de build**, pas d'exécution : Vite l'intègre au code).
- **Reconstruction quotidienne** (pour que le « prochain événement » bascule tout seul) : créer un *Deploy Hook* dans Workers Builds (Settings → Builds → Deploy Hooks, branche `main`), le stocker en secret GitHub `CF_DEPLOY_HOOK`, et `nightly-rebuild.yml` l'appelle chaque nuit à 02:00 UTC (04:00 à Paris en été, 03:00 en hiver) via `curl -X POST`. Bouton `workflow_dispatch` pour lancer à la main.
- `_headers` (dans `public/`) et `_redirects` (généré par `scripts/seo-files.mjs` depuis `content/site.json` → `legacyRedirects` et `shopUrl`) sont appliqués nativement par les assets statiques Workers.
- L'ancien projet **Pages** `dystopsyelement` (`dystopsyelements.pages.dev`) n'est plus relié au dépôt ; l'utilisateur le supprimera une fois la v2 en ligne.
- `public/_headers` :
  ```
  /assets/*
    Cache-Control: public, max-age=31536000, immutable
  /*
    X-Content-Type-Options: nosniff
    Referrer-Policy: strict-origin-when-cross-origin
    Permissions-Policy: camera=(), microphone=(), geolocation=()
    X-Frame-Options: DENY
  ```
- `_redirects` : voir SITE_PLAN §1 (généré, voir ci-dessus). Plus besoin de règle SPA : chaque page est un vrai fichier HTML.
- Domaine personnalisé : à brancher quand l'asso l'aura choisi (mettre à jour `url` dans `content/site.json`).

Tu ne peux pas cliquer dans les interfaces GitHub ou Cloudflare : quand une action manuelle est nécessaire, donne à l'utilisateur les étapes exactes, une par une.

## 8. Plan d'exécution

Travaille phase par phase. Une branche par phase (`phase-0-socle`, `phase-1-design-system`…). À la fin de chaque phase : build vert, commit, PR vers `main`, courte synthèse à l'utilisateur (ce qui est fait, ce qui manque, ce qu'il doit faire).

| Phase | Contenu | Critère de fin |
|---|---|---|
| **0. Socle** | Tag `v1-figma-make`, nettoyage du dépôt, init React Router + Tailwind + TS strict (comme Outrance), `tokens.css`, polices, `root.tsx`, SEO de base, `_headers`, `_redirects`, CI | `npm run build`, `typecheck` et `lint` OK, page aux bonnes couleurs/polices |
| **1. Design system** | Tous les composants `ui/`, `layout/` et `motion/` + `Portal`, page cachée `/styleguide` (non indexée, exclue du sitemap) qui les affiche tous dans tous leurs états | La page `/styleguide` correspond visuellement à `docs/styleguide.html` |
| **2. Contenus** | `content/` + schémas zod, migration des données et assets v1, `lib/events.ts` avec tests de la logique « prochain événement » | `typecheck` OK, images < budgets |
| **3. Pages** | Accueil, Nexen, Agenda (+ fiche), Prestations, Contact, Mentions légales, 404 — dans cet ordre | Chaque section a son CTA vers la bonne destination (SITE_PLAN) |
| **4. Finitions** | Formulaire branché, façade SoundCloud, JSON-LD, OG images, sitemap, accessibilité clavier, `prefers-reduced-motion` | Checklist §9 entièrement cochée |
| **5. Mise en ligne** | Branchement du domaine, vérif Workers Builds, Deploy Hook nocturne, `docs/TODO_CONTENU.md` à jour | Site en ligne sur `dystopsyelement.krohmlab.workers.dev` |

## 9. Définition de « terminé »

- [ ] Lighthouse mobile ≥ 95 (Performance, Accessibilité, Bonnes pratiques, SEO) sur `/nexen`, `/agenda`, `/agenda/[slug]` ; sur `/` : Performance ≥ 90 (animations, DESIGN_SYSTEM §6.2), les 3 autres axes ≥ 95
- [ ] JS total sur l'accueil < 150 Ko gzip (React + React Router compris) ; aucune requête tierce au chargement
- [ ] Aucune valeur de couleur ou de taille en dur (`grep -rE "#[0-9a-fA-F]{3,6}|\[[0-9]+px\]" src/components src/routes` ne renvoie rien)
- [ ] Aucun `href="#"`, aucune image Unsplash, aucun texte lorem, aucun contenu issu de Figma Make listé dans SITE_PLAN §0, **aucun contenu `placeholder: true` restant** (le build en affiche le compte)
- [ ] Le nom affiché partout est « Dystopsy Element »
- [ ] Navigation complète au clavier, menu mobile compris ; focus toujours visible
- [ ] Rendu vérifié à 360, 768, 1280 et 1920 px
- [ ] `prefers-reduced-motion` : plus aucune animation (accueil compris)
- [ ] Recharger n'importe quelle URL renvoie la page (pas de 404) ; anciennes URLs v1 redirigées
- [ ] Formulaire testé de bout en bout (réception de l'e-mail)
- [ ] `docs/TODO_CONTENU.md` liste tout ce que l'asso doit encore fournir

# CLAUDE.md — Dystopsy Element v2

Tu es le **product builder** (concepteur-développeur) du site de l'association **Dystopsy Element** (au singulier ; seuls l'ancienne URL `dystopsyelements.pages.dev` et l'URL HelloAsso gardent un « s »).
Tu reconstruis le site **de zéro**, en gardant la direction artistique de la v1 mais en la simplifiant, puis tu le déploies sur **GitHub → Cloudflare Workers** (assets statiques).
Figma n'est plus utilisé : ce dépôt est la seule source de vérité.

## 1. Documents de référence (à lire avant toute ligne de code)

| Fichier | Contenu | Autorité |
|---|---|---|
| `docs/DESIGN_SYSTEM.md` | Principes, tokens, composants, règles de contenu | Fait foi pour le visuel |
| `docs/SITE_PLAN.md` | Pages, sections, CTA et destinations, modèle de données | Fait foi pour la structure |
| `src/styles/tokens.css` | Tokens Tailwind v4 (déjà prêts, à importer tel quel) | Source unique des valeurs |
| `docs/styleguide.html` | Rendu visuel de référence des tokens et composants | Référence visuelle |
| `public/brand/logo-dystopsy.svg` | Logo extrait de la v1 (`fill="currentColor"`) | |

En cas de conflit entre ces documents et une idée « qui rendrait mieux » : **les documents gagnent**. Si une règle te semble mauvaise, signale-le dans ta réponse au lieu de la contourner.

## 2. Stack

| Couche | Choix | Pourquoi |
|---|---|---|
| Framework | **Astro** (dernière version stable, 7.x au 26/10/2026), sortie **100 % statique** | HTML pré-rendu, zéro JS par défaut. La v1 envoyait une SPA React complète pour un site vitrine. Astro tourne sur Vite : même outillage que la v1. |
| Styles | **Tailwind CSS v4** via `@tailwindcss/vite` + `src/styles/tokens.css` | Continuité v1, tokens centralisés |
| Langage | **TypeScript strict** | |
| Contenus | **Content collections** Astro (Markdown/YAML + schémas Zod) | Ajouter un événement = ajouter un fichier |
| Images | `astro:assets` (`<Image>` / `<Picture>`, AVIF + WebP) | La v1 pesait ~10 Mo d'images |
| Polices | `@fontsource-variable/orbitron`, `@fontsource/rajdhani` (500/600/700, latin) | Pas de Google Fonts (perf + RGPD) |
| Icônes | `@lucide/astro` (ou SVG inline) | |
| Interactivité | Scripts vanilla `<script>` dans les composants Astro | Menu mobile, partage, façade SoundCloud : < 3 Ko au total |
| React | **Non installé par défaut.** Ajouter `@astrojs/react` uniquement si un composant le justifie vraiment (aucun prévu) | |
| Animations | CSS uniquement (keyframes des tokens, `animation-timeline`, IntersectionObserver natif). **Pas de `motion`.** | |
| SEO | `@astrojs/sitemap`, balises meta/OG par page, JSON-LD `MusicEvent` sur les fiches événement | |
| Qualité | `astro check`, Prettier (+ `prettier-plugin-astro`, `prettier-plugin-tailwindcss`) | |
| Runtime | Node **24 LTS** (fichier `.nvmrc`) | |

Versions : épingle des versions exactes dans `package.json` (pas de `^`), publiées depuis **au moins 14 jours**.
Interdit : MUI, Emotion, Radix, shadcn/ui, react-slick, recharts, react-dnd, toute librairie de carrousel. Si tu ressens le besoin d'une dépendance, justifie-la dans le message de commit.

## 3. Structure du dépôt

```
/
├─ CLAUDE.md
├─ docs/                     DESIGN_SYSTEM.md · SITE_PLAN.md · styleguide.html
├─ public/
│  ├─ brand/                 logo-dystopsy.svg, favicon.svg, og-default.jpg
│  ├─ _redirects             redirections 301 v1 → v2 (SITE_PLAN §1)
│  └─ _headers               cache + en-têtes de sécurité (§7)
├─ src/
│  ├─ assets/                images sources réelles uniquement (events/, festival/, patterns/, services/ quand fournies)
│  ├─ components/
│  │  ├─ ui/                 Button, Badge, Field, Accordion, Brackets, Divider
│  │  ├─ layout/             Header, MobileMenu, Footer, Section, SectionHeader, CtaBanner, ScrollProgress, SkipLink
│  │  ├─ blocks/             Hero, NexenFeature, Ticker, EventCard, ShopLink, ServiceTile, ArtistRow, SoundcloudFacade, CyberFrame
│  ├─ content/               events/*.md · services/*.md (vide) · faq/*.md (vide)
│  ├─ content.config.ts      schémas (SITE_PLAN §10)
│  ├─ data/site.ts           réglages globaux, réseaux, festival, légal
│  ├─ layouts/BaseLayout.astro
│  ├─ lib/                   events.ts (getUpcoming, getNext, isPast), seo.ts, cn.ts
│  ├─ pages/                 index · nexen · agenda/index · agenda/[slug] · prestations · contact · mentions-legales · 404 (pas de pages shop : boutique sur Vinted)
│  └─ styles/                global.css (import tailwind + tokens + fonts) · tokens.css
├─ .github/workflows/        ci.yml (build + check), nightly-rebuild.yml (§7)
├─ astro.config.mjs
├─ wrangler.jsonc            Worker Cloudflare, assets statiques (§7)
└─ package.json
```

## 4. Règles de code

1. **Aucune valeur en dur.** Pas de `#75feed`, `bg-[#...]`, `text-[13px]`, `rounded-md`. Uniquement les classes issues des tokens (`bg-void`, `text-cyan`, `text-h2`, `chamfer-md`, `px-gutter`…). La palette Tailwind par défaut est désactivée : si une classe ne compile pas, c'est qu'elle est interdite.
2. **Un composant = une responsabilité.** Les pages assemblent des composants, elles ne contiennent pas de styles complexes.
3. **Pas de contenu dans les composants.** Les textes viennent des collections ou de `site.ts`.
4. **Une URL manquante = pas de bouton.** Jamais de `href="#"`. Les champs optionnels absents masquent l'élément.
5. **Rose = conversion, cyan = navigation** (DESIGN_SYSTEM §2.2). Un seul `Button primary` par section (hors bouton Billetterie du header).
6. **Budgets de texte** (DESIGN_SYSTEM §8) : si un texte fourni les dépasse, raccourcis-le et signale-le.
7. **Accessibilité** (DESIGN_SYSTEM §10) dès le premier composant, pas en fin de projet.
8. **N'invente rien** : ni donnée factuelle (date, lieu, prix, URL, nom d'artiste, e-mail), ni texte de présentation, ni produit, ni membre, ni FAQ, ni chiffre clé, ni référence client. Pas de texte de remplacement visible non plus (« Lorem », « Texte à venir »). Ce qui manque reste vide dans `site.ts` / les collections avec un commentaire `// TODO(asso): …`, et la liste des manques est mise à jour dans `docs/TODO_CONTENU.md`.
9. Commits en français, au format `type(portée): message` (`feat(hero): état prochaine édition`).

## 5. Reprise des contenus et assets de la v1

La v1 est dans le dépôt `KrohmLab/dystopsyelement` (branche `main`, dernier commit Figma Make `7e913f0`).
1. Avant de remplacer le code, crée le tag **`v1-figma-make`** sur le dernier commit pour l'archiver.
2. Récupère depuis `src/imports/` de la v1 et place dans `src/assets/` (renommés en kebab-case) :
   `NXN26---Banner-FB.jpg` → `events/nexen-2026-banner.jpg` · `NexensHome---Banner-FB.png` → `events/nexens-home-2026-banner.jpg` (convertir en JPG qualité 85) · `Logo-NEXEN.png` → `festival/logo-nexen.png` · `NXN26---Fond-Vierge-(Carré).jpg` → `festival/fond.jpg` · `Ecailles_FULL.jpg` → `festival/ecailles.jpg` · `nexen_jour.jpg` → `festival/photo-jour.jpg` · `8354966702361017823.png` (affiche line-up officielle) → `festival/lineup-2026.jpg` · `Pattern_01-solo.png` → vectoriser ou garder en PNG pour `Divider`.
   Les fichiers sources > 2 Mo doivent être redimensionnés à 2400 px max avant commit (script `sharp` ponctuel, non conservé).
3. `CyberFrame` : convertis les chemins de `src/imports/svg-esp92axs1t.ts` (+ `HeaderHomeMobile.tsx` pour mobile) en fichiers `.svg` dans `src/assets/frames/`, importés comme composants (`?raw` ou import SVG Astro), `fill="currentColor"`.
4. Données : crée **uniquement** les 2 événements réels listés dans SITE_PLAN §9 (Nexen Festival 2026, Nexen's Home), avec leurs seules données factuelles. **Ne reprends pas** les descriptions, les artistes, l'événement « SYSTEM FAILURE [01] », les produits, les membres ni aucun autre contenu de la liste SITE_PLAN §0.
5. Les URLs Unsplash, les IDs SoundCloud fictifs, les liens `#` et les coordonnées v1 ne sont pas repris. Ne les remplace pas par d'autres placeholders.

## 6. Intégrations

| Besoin | Solution | Config |
|---|---|---|
| Billetterie | **HelloAsso**, lien externe (nouvel onglet) | `ticketUrl` par événement |
| Formulaire de contact | **Web3Forms** (gratuit, sans backend) — alternative : Formspree | Clé publique en variable `PUBLIC_WEB3FORMS_KEY` (variable de build Workers Builds, voir §7). Envoi `fetch` en amélioration progressive : le `<form action>` fonctionne aussi sans JS. Honeypot + case RGPD. |
| Pré-remplissage du sujet | Lecture de `?sujet=` côté client (5 lignes de JS) | |
| SoundCloud | Façade : bouton « Écouter » → injecte l'iframe au clic | |
| Boutique | **Vinted**, lien externe unique (navigation, bloc `ShopLink`, page contact). Aucun catalogue sur le site. | `site.shopUrl` |
| Statistiques | **Cloudflare Web Analytics** (sans cookie) | Activer dans le tableau de bord Cloudflare (Web Analytics, site `*.workers.dev` puis domaine perso), aucun script à ajouter |
| Carte / itinéraire | Simple lien sortant (OpenStreetMap ou Google Maps), pas d'iframe | |

## 7. Déploiement

**GitHub**
- Dépôt : `KrohmLab/dystopsyelement` (renommé ; l'ancien nom `dystopsyelements` redirige). **`main` = production** (comme le site Outrance) : une branche et une PR vers `main` par phase ou par changement, avec l'URL d'aperçu Cloudflare dans la description. La branche `production` de la v1 n'est plus utilisée (à supprimer après la mise en ligne).
- **Couper la synchronisation Figma Make** avec ce dépôt avant le premier push v2 (sinon elle écrasera le code). À faire par l'utilisateur dans Figma Make ; rappelle-le-lui si ce n'est pas confirmé.
- `ci.yml` : sur chaque PR, `npm ci && npm run check && npm run build`.

**Cloudflare Workers** (Worker existant `dystopsyelement`, compte Krohm Lab, URL `dystopsyelement.krohmlab.workers.dev`) — même fonctionnement que le site Outrance.
- Worker **sans script**, assets statiques uniquement, décrit dans `wrangler.jsonc` à la racine (versionné) :
  ```jsonc
  {
    "$schema": "node_modules/wrangler/config-schema.json",
    "name": "dystopsyelement",
    "compatibility_date": "<date du jour à l'init>",
    "workers_dev": true,
    "preview_urls": true,
    "previews": {},
    "assets": {
      "directory": "./dist",
      "not_found_handling": "404-page"
    }
  }
  ```
  `wrangler` en `devDependency` (version épinglée). Script `preview` : `npm run build && wrangler dev`.
- **Workers Builds** (connexion Git, réglée par l'utilisateur dans le tableau de bord) : dépôt `KrohmLab/dystopsyelement`, branche de production `main`, commande de build `npm run build`, déploiement `npx wrangler deploy` ; onglet *Previews* : builds des autres branches activés, commande `npx wrangler preview` (d'où le bloc `"previews": {}` dans `wrangler.jsonc`) → URL d'aperçu par branche et par PR. La version de Node est lue dans `.nvmrc` (pas de variable `NODE_VERSION`). Variable de build : `PUBLIC_WEB3FORMS_KEY` (variable **de build**, pas d'exécution : Astro l'intègre au HTML).
- **Reconstruction quotidienne** (pour que le « prochain événement » bascule tout seul) : créer un *Deploy Hook* dans Workers Builds (Settings → Builds → Deploy Hooks, branche `main`), le stocker en secret GitHub `CF_DEPLOY_HOOK`, et `nightly-rebuild.yml` l'appelle chaque nuit à 02:00 UTC (04:00 à Paris en été, 03:00 en hiver) via `curl -X POST`. Le build utilise ainsi les mêmes réglages et variables que les déploiements normaux. Bouton `workflow_dispatch` pour lancer à la main.
- `_headers` et `_redirects` sont pris en charge nativement par les assets statiques Workers. `_headers` est dans `public/` ; `_redirects` est généré au build dans `dist/` par `src/lib/redirects.ts` (les règles `/shop` dépendent de `site.shopUrl`).
- L'ancien projet **Pages** `dystopsyelement` (`dystopsyelements.pages.dev`) n'est plus utilisé : l'utilisateur le supprimera une fois la v2 en ligne sur le Worker.
- `public/_headers` :
  ```
  /_astro/*
    Cache-Control: public, max-age=31536000, immutable
  /*
    X-Content-Type-Options: nosniff
    Referrer-Policy: strict-origin-when-cross-origin
    Permissions-Policy: camera=(), microphone=(), geolocation=()
    X-Frame-Options: DENY
  ```
- `_redirects` : voir SITE_PLAN §1 (généré, voir ci-dessus). Plus besoin de règle SPA : chaque page est un vrai fichier HTML.
- Domaine personnalisé : à brancher quand l'asso l'aura choisi (mettre à jour `site` dans `astro.config.mjs`).

Tu ne peux pas cliquer dans les interfaces GitHub ou Cloudflare : quand une action manuelle est nécessaire, donne à l'utilisateur les étapes exactes, une par une.

## 8. Plan d'exécution

Travaille phase par phase. Une branche par phase (`phase-0-socle`, `phase-1-design-system`…). À la fin de chaque phase : build vert, commit, PR vers `main`, courte synthèse à l'utilisateur (ce qui est fait, ce qui manque, ce qu'il doit faire).

| Phase | Contenu | Critère de fin |
|---|---|---|
| **0. Socle** | Tag `v1-figma-make`, nettoyage du dépôt, init Astro + Tailwind + TS strict, `tokens.css`, polices, `BaseLayout`, SEO de base, `_headers`, `_redirects`, CI | `npm run build` OK, page vide aux bonnes couleurs/polices, Lighthouse 100 |
| **1. Design system** | Tous les composants `ui/` et `layout/`, page cachée `/styleguide` (non indexée, exclue du sitemap) qui les affiche tous dans tous leurs états | La page `/styleguide` correspond visuellement à `docs/styleguide.html` |
| **2. Contenus** | Collections + schémas, migration des données et assets v1, `lib/events.ts` avec tests de la logique « prochain événement » | `astro check` OK, images < budgets |
| **3. Pages** | Accueil, Nexen, Agenda (+ fiche), Prestations, Contact, Mentions légales, 404 — dans cet ordre | Chaque section a son CTA vers la bonne destination (SITE_PLAN) |
| **4. Finitions** | Formulaire branché, façade SoundCloud, JSON-LD, OG images, sitemap, accessibilité clavier, `prefers-reduced-motion` | Checklist §9 entièrement cochée |
| **5. Mise en ligne** | Branchement du domaine, vérif Workers Builds, Deploy Hook nocturne, `docs/TODO_CONTENU.md` à jour | Site en ligne sur `dystopsyelement.krohmlab.workers.dev` |

## 9. Définition de « terminé »

- [ ] Lighthouse mobile ≥ 95 (Performance, Accessibilité, Bonnes pratiques, SEO) sur `/`, `/nexen`, `/agenda`, `/agenda/[slug]`
- [ ] JS total sur l'accueil < 30 Ko gzip ; aucune requête tierce au chargement
- [ ] Aucune valeur de couleur ou de taille en dur (`grep -rE "#[0-9a-fA-F]{3,6}|\[[0-9]+px\]" src/components src/pages` ne renvoie rien)
- [ ] Aucun `href="#"`, aucune image Unsplash, aucun texte lorem, aucun contenu issu de Figma Make listé dans SITE_PLAN §0
- [ ] Le nom affiché partout est « Dystopsy Element »
- [ ] Navigation complète au clavier, menu mobile compris ; focus toujours visible
- [ ] Rendu vérifié à 360, 768, 1280 et 1920 px
- [ ] `prefers-reduced-motion` : plus aucune animation
- [ ] Recharger n'importe quelle URL renvoie la page (pas de 404) ; anciennes URLs v1 redirigées
- [ ] Formulaire testé de bout en bout (réception de l'e-mail)
- [ ] `docs/TODO_CONTENU.md` liste tout ce que l'asso doit encore fournir

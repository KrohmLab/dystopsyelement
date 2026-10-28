# Contenus à fournir par l'association

Le site est construit avec des **contenus provisoires numérotés** (SITE_PLAN §0) : « Artiste 1 », « Produit 2 »… marqués `placeholder: true` dans `content/`.
Remplacer un contenu = modifier le fichier indiqué, sans toucher au code. `npm run build` affiche le nombre de provisoires restants ; **il doit être à 0 avant la mise en ligne publique**.

## Contenus provisoires à remplacer

| Élément | Fichier | Aujourd'hui |
|---|---|---|
| Phrase de présentation pour Google et les partages (≤ 155 caractères) | `content/site.json` → `description` | Texte provisoire |
| Phrase du pied de page | `content/site.json` → `tagline` | Texte provisoire |
| Ville (bloc « QG ») | `content/site.json` → `city` | « Ville 1 » |
| Sujets du formulaire de contact | `content/site.json` → `contactSubjects` | « Sujet 1 », « Sujet 2 », « Prestation » |
| Équipe (nom, rôle, pôle, photo, présentation) | `content/team.json` | « Membre 1 » à « Membre 8 » |
| Prestations (titre, accroche, 3 points, photo) | `content/services.json` | « Prestation 1 » à « Prestation 3 » |
| Infos pratiques du festival (questions / réponses ≤ 40 mots) | `content/faq.json` | « Question 1 » à « Question 4 » |
| Phrases d'introduction (agenda, prestations, boutique, contact, univers Nexen) | `src/routes/*.tsx` (props `lead`) | Texte provisoire |
| Photos de la galerie Nexen | `assets/festival/` + `src/routes/nexen.tsx` | photo de jour + emplacements |

## Renseigné le 28/10/2026

- **Événements** (`content/events/*.md`) : les 17 événements de la page Facebook de Dystopsy Element (NEXEN 2023 à 2026, teasers, Nexus Alchemy, Engine Reload…), avec dates, lieux, line-up tels que publiés, visuels officiels et un résumé reformulé de leur description. À relire par l'asso : résumés, styles et labels des artistes. Pas de prochaine date annoncée à ce jour : l'accueil met en avant le dernier événement (Engine Reload — Chapitre II).
- **Boutique** (`content/products.json`) : T-shirt et Sweat officiels Nexen Festival, avec chaque annonce Vinted (coupe H/F × taille). **À tenir à jour à la main** : Vinted n'a pas d'API publique et interdit l'aspiration automatique. Quand une pièce est vendue, retirer sa ligne dans `variants` ; quand une annonce est ajoutée, ajouter une ligne `{ "cut", "size", "vintedUrl" }`. Un produit sans annonce s'affiche « Épuisé ».

- **Réseaux et liens** (`content/site.json`) : Instagram `@dystopsy_element_nexen`, page Facebook, page de dons HelloAsso et formulaire « Booking artistes 2027 » (repris du Linktree). SoundCloud et YouTube : aucun compte trouvé, icônes masquées ; ajouter l'URL dans `socials` si l'asso en a un. Le libellé du portail Booking (avec l'année) se change dans `booking.label`.
- **Visuels de l'accueil** : flyer Nexen 2026 et visuel merch (Instagram), photo de Pamp' (Nexen 2026) et visuel « Booking artistes 2027 » (Linktree).

- **Galerie** (`content/gallery.json`, `public/photos/`) : toutes les photos des 11 albums Facebook « NEXEN [année] par … » (2024 : Lila, No. VP - MiiNeo ; 2025 : Andrés, Lila, No. VP - MiiNeo, Pamp', So Visual ; 2026 : Lila, No. VP - MiiNeo, Pamp', So Visual), soit 1 305 photos. Lien vers le profil Facebook de chaque photographe à côté de son nom (`profile`). À faire valider par l'asso et les photographes (droit de publication sur le site). Pas d'album 2023 sur Facebook. **Nouvel album** : ajouter une entrée dans `content/gallery.json` et ses fichiers AVIF dans `public/photos/[année]/[slug]/` (vignette 480 px carrée `-s`, grand format 1600 px `-l`).

## Déjà renseigné (événement Facebook officiel, relevé du 27/10/2026)

E-mail de contact, profil Vinted, et pour le Nexen Festival 2026 : description, infos pratiques, line-up et timetable des deux scènes, carte du site, village, restauration, galerie d'art et crédits (`content/festival/nexen-2026.json`). À faire relire par l'asso.

## Réglages à fournir

| Élément | Où | Effet tant qu'il manque |
|---|---|---|
| Mentions légales (éditeur, n° RNA, siège, directeur de publication) | `content/site.json` → `legal` | « À compléter (provisoire) » sur la page |
| Crédits photos | `src/routes/mentions-legales.tsx` (`#credits`) | « À compléter (provisoire) » |
| Clé Web3Forms | variable de build Cloudflare `VITE_WEB3FORMS_KEY` | Formulaire non branché |
| Confirmation des données des 2 événements repris de la v1 (SITE_PLAN §9) | `content/events/*.md` | — |
| Nom de domaine final | `content/site.json` → `url` | Site sur `dystopsyelement.krohmlab.workers.dev` |

## Images de partage (réseaux sociaux)

Après l'ajout d'un événement (avec visuel) ou d'un album photo : `npm run og`, puis commiter `public/og/`. Sans image dédiée, la page utilise l'image du site (`public/og/site.jpg`).

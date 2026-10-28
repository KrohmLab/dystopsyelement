# Contenus à fournir par l'association

Le site est construit avec des **contenus provisoires numérotés** (SITE_PLAN §0) : « Artiste 1 », « Produit 2 »… marqués `placeholder: true` dans `content/`.
Remplacer un contenu = modifier le fichier indiqué, sans toucher au code. `npm run build` affiche le nombre de provisoires restants ; **il doit être à 0 avant la mise en ligne publique**.

## Contenus provisoires à remplacer

| Élément | Fichier | Aujourd'hui |
|---|---|---|
| Phrase de présentation pour Google et les partages (≤ 155 caractères) | `content/site.json` → `description` | Texte provisoire |
| URLs Instagram, Facebook, SoundCloud, YouTube | `content/site.json` → `socials` | accueil de chaque réseau |
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

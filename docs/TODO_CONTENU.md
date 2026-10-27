# Contenus à fournir par l'association

Le site est construit avec des **contenus provisoires numérotés** (SITE_PLAN §0) : « Artiste 1 », « Produit 2 »… marqués `placeholder: true` dans `content/`.
Remplacer un contenu = modifier le fichier indiqué, sans toucher au code. `npm run build` affiche le nombre de provisoires restants ; **il doit être à 0 avant la mise en ligne publique**.

## Contenus provisoires à remplacer

| Élément | Fichier | Aujourd'hui |
|---|---|---|
| Phrase de présentation pour Google et les partages (≤ 155 caractères) | `content/site.json` → `description` | Texte provisoire |
| E-mail de contact | `content/site.json` → `email` | `provisoire@example.com` |
| URL de la boutique Vinted | `content/site.json` → `shopUrl` | accueil de Vinted |
| URLs Instagram, Facebook, SoundCloud, YouTube | `content/site.json` → `socials` | accueil de chaque réseau |
| Phrase du pied de page | `content/site.json` → `tagline` | Texte provisoire |
| Ville (bloc « QG ») | `content/site.json` → `city` | « Ville 1 » |
| Sujets du formulaire de contact | `content/site.json` → `contactSubjects` | « Sujet 1 », « Sujet 2 », « Prestation » |
| Prochains événements | `content/events/*.md` | « Événement 1 » à « Événement 4 » |
| Résumés des événements réels (Nexen Festival 2026, Nexen's Home) | `content/events/nexen-festival-2026.md`, `nexens-home.md` (corps du fichier) | Texte provisoire |
| Line-up (noms, format, genre, photo, bio, liens) | `content/artists.json` + `lineup` de chaque événement | « Artiste 1 » à « Artiste 8 » |
| Équipe (nom, rôle, pôle, photo, présentation) | `content/team.json` | « Membre 1 » à « Membre 8 » |
| Produits de la boutique (nom, catégorie, prix, photo, lien de l'annonce Vinted) | `content/products.json` | « Produit 1 » à « Produit 8 » |
| Prestations (titre, accroche, 3 points, photo) | `content/services.json` | « Prestation 1 » à « Prestation 3 » |
| Infos pratiques du festival (questions / réponses ≤ 40 mots) | `content/faq.json` | « Question 1 » à « Question 4 » |
| Phrases d'introduction (agenda, prestations, boutique, contact, univers Nexen) | `src/routes/*.tsx` (props `lead`) | Texte provisoire |
| Photos de la galerie Nexen | `assets/festival/` + `src/routes/nexen.tsx` | photo de jour + emplacements |

## Réglages à fournir

| Élément | Où | Effet tant qu'il manque |
|---|---|---|
| Mentions légales (éditeur, n° RNA, siège, directeur de publication) | `content/site.json` → `legal` | « À compléter (provisoire) » sur la page |
| Crédits photos | `src/routes/mentions-legales.tsx` (`#credits`) | « À compléter (provisoire) » |
| Clé Web3Forms | variable de build Cloudflare `VITE_WEB3FORMS_KEY` | Formulaire non branché |
| Confirmation des données des 2 événements repris de la v1 (SITE_PLAN §9) | `content/events/*.md` | — |
| Nom de domaine final | `content/site.json` → `url` | Site sur `dystopsyelement.krohmlab.workers.dev` |

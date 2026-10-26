# Contenus à fournir par l'association

Tant qu'un élément manque, le bloc correspondant n'est pas affiché sur le site (rien n'est inventé).
Mis à jour à chaque phase (CLAUDE.md §4.8).

| Élément | Où le renseigner | Effet tant qu'il manque |
|---|---|---|
| Phrase de présentation pour Google et les partages (≤ 155 caractères) | `site.description` (`src/data/site.ts`) | Pas de meta description (léger malus SEO Lighthouse) |
| URL de la boutique Vinted | `site.shopUrl` | Pas de lien Shop ; `/shop` redirige vers l'accueil |
| URLs Instagram, Facebook, SoundCloud, YouTube | `site.socials` | Icônes réseaux et CTA « Suivre » masqués |
| E-mail de contact | `site.email` | Non affiché |
| Phrase de présentation du footer | `site.tagline` | Non affichée |
| Sujets du formulaire de contact | `site.contactSubjects` | — |
| Mentions légales (n° RNA, siège, directeur de publication) | `site.legal` | Champs absents de la page |
| Prestations : types, textes, photos | collection `services` | Section et page Prestations réduites |
| Infos pratiques du festival (questions / réponses) | collection `faq` | Section `#infos` masquée |
| Résumés des événements (≤ 60 mots) | `src/content/events/*.md` | Bloc « L'essentiel » masqué |
| Line-up texte avec liens (optionnel, l'affiche suffit) | `src/content/events/*.md` | Seule l'affiche est montrée |
| Prochains événements et prochaine édition Nexen | `src/content/events/*.md` | Le hero montre le dernier Nexen en mode « passé » |
| Lien billetterie Nexen's Home (s'il existait) | `src/content/events/nexens-home.md` | Pas de bouton billetterie |
| Clé Web3Forms | variable de build Cloudflare `PUBLIC_WEB3FORMS_KEY` | Formulaire non branché |
| Confirmation des données des 2 événements repris de la v1 (SITE_PLAN §9) | `src/content/events/*.md` | — |
| Nom de domaine final | `site.url` (`src/data/site.ts`) | Site sur `dystopsyelement.krohmlab.workers.dev` |

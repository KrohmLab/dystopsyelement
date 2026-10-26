# Contenus à fournir par l'association

Tant qu'un élément manque, le bloc correspondant n'est pas affiché sur le site (rien n'est inventé).
Mis à jour à chaque phase (CLAUDE.md §4.8).

| Élément | Où le renseigner | Effet tant qu'il manque |
|---|---|---|
| Phrase de présentation pour Google et les partages (≤ 155 caractères) | `description` (`content/site.json`) | Pas de meta description (léger malus SEO Lighthouse) |
| URL de la boutique Vinted | `shopUrl` (`content/site.json`) | Pas de lien Shop ; `/shop` redirige vers l'accueil |
| URLs Instagram, Facebook, SoundCloud, YouTube | `socials` (`content/site.json`) | Icônes réseaux et CTA « Suivre » masqués |
| E-mail de contact | `email` (`content/site.json`) | Non affiché |
| Phrase de présentation du footer | `tagline` (`content/site.json`) | Non affichée |
| Sujets du formulaire de contact | `contactSubjects` (`content/site.json`) | — |
| Mentions légales (n° RNA, siège, directeur de publication) | `legal` (`content/site.json`) | Champs absents de la page |
| Prestations : types, textes, photos | `content/` (format à définir) | Section et page Prestations réduites |
| Infos pratiques du festival (questions / réponses) | `content/` (format à définir) | Section `#infos` masquée |
| Résumés des événements (≤ 60 mots) | `content/events/*.md` | Bloc « L'essentiel » masqué |
| Line-up texte avec liens (optionnel, l'affiche suffit) | `content/events/*.md` | Seule l'affiche est montrée |
| Prochains événements et prochaine édition Nexen | `content/events/*.md` | Le hero montre le dernier Nexen en mode « passé » |
| Lien billetterie Nexen's Home (s'il existait) | `content/events/nexens-home.md` | Pas de bouton billetterie |
| Clé Web3Forms | variable de build Cloudflare `VITE_WEB3FORMS_KEY` | Formulaire non branché |
| Confirmation des données des 2 événements repris de la v1 (SITE_PLAN §9) | `content/events/*.md` | — |
| Nom de domaine final | `url` (`content/site.json`) | Site sur `dystopsyelement.krohmlab.workers.dev` |

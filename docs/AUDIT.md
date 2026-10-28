# Audit du site — 28/10/2026

Site en ligne : https://dystopsyelement.krohmlab.workers.dev (branche `main`). Mesures sur la production.

## Scores Lighthouse (mobile, 4G lente simulée)

| Page | Perf. | Access. | Bonnes pratiques | SEO | LCP | CLS | Poids |
|---|---|---|---|---|---|---|---|
| `/` | 72 | 100 | 100 | 100 | 4,1 s | 0 | 671 Ko |
| `/nexen` | 76 | 100 | 100 | 100 | 4,2 s | 0,06 | 373 Ko |
| `/agenda` | 81 | 100 | 100 | 100 | 3,9 s | 0,07 | 436 Ko |
| `/agenda/nexen-festival-2026` | 81 | 100 | 100 | 100 | 3,7 s | 0,06 | 377 Ko |
| `/galerie` | 82 | 100 | 100 | 100 | 4,1 s | 0,06 | 547 Ko |
| `/galerie/2025/nvp-miineo` | 87 | 100 | 100 | 100 | 3,3 s | 0 | 579 Ko |
| `/shop` | 85 | 100 | 100 | 100 | 3,4 s | 0,06 | 330 Ko |
| `/contact` | 86 | 100 | 100 | 100 | 3,3 s | 0,06 | 233 Ko |

Objectif CLAUDE.md §9 : Perf ≥ 95 (≥ 90 sur l'accueil). **Non atteint.** En conditions réelles, l'élément principal s'affiche en < 1 s (TTFB 450 ms + image 90 ms + rendu 320 ms) ; l'écart vient de la simulation 4G lente : CSS (24 Ko) et polices bloquent le premier rendu (≈ 940 ms simulés), ≈ 56 Ko de JS inutilisé au chargement (React + React Router), l'intro de 3 s retarde l'affichage sur l'accueil. Aucun blocage du fil principal (TBT 0 ms). JS de l'accueil : 141 Ko gzip (budget 150).

## Cookies, RGPD

- **Zéro cookie** : aucun en-tête `Set-Cookie` (pages, photos, 404), `document.cookie` vide, aucun `localStorage`.
- **Aucune requête tierce** au chargement : tout vient du domaine du site (vérifié en naviguant et en défilant l'accueil).
- `sessionStorage` : 2 clés techniques sans donnée personnelle (`dystopsy:intro` = intro déjà vue, positions de défilement de React Router) : exemptées de consentement.
- Liens sortants seulement (HelloAsso, Vinted, Facebook, Instagram, SoundCloud, Google Forms) : aucun contenu embarqué.
- En-têtes : `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options` OK ; pas de `Content-Security-Policy` ni de HSTS (à ajouter avec le domaine définitif).
- Mentions légales : RNA, siège et directeur de publication manquants (obligatoires, LCEN) ; durée de conservation des messages du formulaire non indiquée ; la page annonce Cloudflare Web Analytics, **qui n'est pas activé** (aucun script de mesure détecté).

## Points forts

- Identité visuelle forte et cohérente (hologramme, néons, sol quadrillé, motifs), animations coupées en mouvement réduit.
- Contenus réels : 17 événements, line-up et timetable Nexen 2026, boutique Vinted par taille, 1 305 photos sur 3 éditions avec crédits.
- 100 % statique et pré-rendu (39 pages) : rien à maintenir côté serveur, sitemap et redirections générés.
- Accessibilité 100 partout : lien d'évitement, focus, dialogues avec piège de focus, libellés, images décrites.
- Galerie légère : vignettes 20 Ko, grand format chargé à la demande, cache 1 an.
- Qualité : TypeScript strict, lint, tests, aucune valeur en dur, aucun `href="#"`, aucun lorem/Unsplash.

## Points faibles et incohérences

1. **19 contenus provisoires visibles** (liste ci-dessous) : la phrase du pied de page « Texte provisoire » s'affiche sur toutes les pages ; la description Google de l'accueil est provisoire.
2. **Formulaire de contact inopérant en production** : clé Web3Forms absente du build (l'envoi affiche une erreur).
3. **Reconstruction nocturne en échec** : secret GitHub `CF_DEPLOY_HOOK` manquant ; le « prochain événement » ne bascule pas tout seul.
4. **Prestations** : page entière en provisoire (« Prestation 1 à 3 ») mais présente dans le menu et en portail d'accueil.
5. **Bouton rose « Billetterie »** (en-tête, menu) : sans événement en vente, il mène à l'agenda des dates passées ; le sur-titre de l'agenda dit aussi « Billetterie ».
6. ~~Nommage de la boutique~~ : tout est « Shop » (corrigé).
7. Portails renommés « Faire un don » et « Nexen Application 2027 ».
8. ~~Partage sur les réseaux~~ : images d'aperçu sur toutes les pages (`npm run og`), JSON-LD `MusicEvent` sur les fiches et `Organization` sur l'accueil (corrigé).
9. ~~Page 404 minimale~~ : page finale avec raccourcis (corrigé).
10. Photos de la galerie en AVIF uniquement (iOS ≤ 15 sans affichage).
11. Doublons iCloud « … 2 » dans le dossier local : ils cassent le build local (pas la production).

## Encore simulé / à fournir par l'asso

| Élément | Où | Aujourd'hui |
|---|---|---|
| Description pour Google et les partages | `content/site.json` → `description` | Texte provisoire |
| Phrase du pied de page | `site.json` → `tagline` | Texte provisoire |
| Ville (bloc QG, contact) | `site.json` → `city` | « Ville 1 » |
| Sujets du formulaire | `site.json` → `contactSubjects` | « Sujet 1 », « Sujet 2 » |
| Mentions légales : RNA, siège, directeur de publication | `site.json` → `legal` | « À compléter » |
| Équipe (8 membres) | `content/team.json` | « Membre 1 à 8 » |
| Prestations (3) | `content/services.json` | « Prestation 1 à 3 » |
| FAQ / infos pratiques (4) | `content/faq.json` | « Question 1 à 4 » |
| Phrases d'intro Agenda, Contact, Prestations | `src/routes/*.tsx` | Texte provisoire |
| Auteurs des affiches | mentions légales | « à préciser » |
| Validation des photos par les photographes | — | à faire |
| Domaine définitif | `site.json` → `url` | workers.dev |

## Reste à faire (technique)

- Ajouter la clé Web3Forms (variable de build `VITE_WEB3FORMS_KEY` dans Workers Builds) puis tester un envoi de bout en bout.
- Créer le Deploy Hook Cloudflare et le secret GitHub `CF_DEPLOY_HOOK`.
- Activer Cloudflare Web Analytics, ou retirer la phrase des mentions légales.
- Performance : polices préchargées / CSS critique en ligne, intro plus courte ou non bloquante pour le LCP, découpe du JS au chargement.
- Décider du sort de Prestations (masquer tant que vide ?) et du bouton Billetterie hors saison.
- CSP + HSTS une fois le domaine branché ; Lighthouse à refaire.
- Tests manuels restants : navigation complète au clavier, mouvement réduit dans un vrai navigateur, rendu 1920 px.

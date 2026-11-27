@AGENTS.md

# ialucide — Contexte projet pour Claude Code

## Stack
- Next.js 16 static export (output: 'export')
- Cloudflare Pages — déploiement automatique sur push main
- Domaine : ialucide.fr (OVH, DNS Cloudflare)

## Workflow publication article
1. Créer le fichier MDX dans /content/ avec frontmatter complet
2. git add, commit, push → Cloudflare déploie en 2-3 min
3. La notification IndexNow est automatique : le workflow GitHub Actions
   `.github/workflows/indexnow.yml` se déclenche sur tout push main touchant
   `content/**.mdx`, détecte les fichiers ajoutés/modifiés, attend que chaque
   URL réponde 200 (jusqu'à 5 min), puis soumet à IndexNow. Rien à faire
   manuellement. Pour une soumission exceptionnelle du site entier, la
   commande manuelle reste disponible : `npm run indexnow` (sans `--urls`).

## Images et couleurs (performance et contraste, 02/11/2026)
- Image de couverture locale : WebP de 1 200 px de large max, jamais un PNG de plusieurs Mo
  (le site est en export statique, Next ne redimensionne rien : un PNG de 2 Mo est servi tel quel,
  c'est ce qui faisait peser la page d'accueil 6,8 Mo). Après l'ajout d'une image de
  couverture locale, lancer `npm run thumbnails` pour créer sa vignette « nom-640.webp » utilisée
  par les cartes d'articles (lib/images.ts). Commiter l'image et sa vignette ensemble.
- Images Imgur : utiliser la variante « h » (1 024 px, ex. `https://i.imgur.com/XXXXXXXh.jpg`),
  jamais le PNG d'origine ; les cartes passent automatiquement à la variante « l » (640 px).
- Images Unsplash : garder le paramètre `?w=1200&q=80` ; les cartes passent à `w=640`.
- Images inline dans le corps d'un article : mêmes règles (WebP 1 200 px max), avec un texte
  `alt` descriptif. Figure reprise d'une étude sous licence CC BY : légende en italique sous
  l'image avec la source complète et la mention de licence.
- Logo : `/logo-nav.webp` (249x136, 7 Ko) dans la barre de navigation et le pied de page ; ne pas
  revenir au PNG 1408x768 de 186 Ko. Toujours déclarer `width` et `height` sur un `<img>`.
- Couleurs de texte : or `#c9a84c` réservé aux fonds sombres et aux grands titres ; petit texte
  et liens sur fond clair en or foncé `#8a6a1c` (4,8:1). Texte secondaire : gris `#6b6b6b` sur
  fond clair uniquement, gris clair `#a8a59c` sur fond sombre (`#6b6b6b` y tombe à 3,2:1).

## Vidéos dans les articles (depuis le 06/11/2026)
- Fichiers dans `public/videos/` : MP4 H.264 1280x720, `-movflags +faststart`, sans piste audio si la vidéo
  est muette, moins de 25 Mo (limite par fichier de Cloudflare Pages), plus une affiche WebP 1280x720.
- Insertion en HTML brut dans le MDX : `<video src="/videos/x.mp4" poster="/videos/x-poster.webp" controls
  preload="none" playsinline muted loop width="1280" height="720" aria-label="..."></video>`, suivie d'une
  légende en italique. `preload="none"` protège le poids de la page et le LCP.
- Lecture automatique en boucle (depuis le 06/11) : `components/ArticleVideos.tsx`, monté par la page article
  seulement si le contenu contient `<video`. Lecture quand la vidéo est visible à 50 %, pause hors écran, rien
  téléchargé avant ; pas de relance si le lecteur a mis en pause ; aucune lecture auto avec
  `prefers-reduced-motion`. Ne PAS mettre l'attribut `autoplay` (filtré, et il chargerait la vidéo dès
  l'ouverture de la page). Testé en Chrome headless (CDP) sur ces 6 cas le 06/11.
- `rehypeSanitize` (`articleContentSchema`, `app/article/[slug]/page.tsx`) n'autorise sur `<video>` que ces
  attributs (dont `loop`) : `autoplay`, gestionnaires `on*` et `src` en `javascript:` sont supprimés (testé le 06/11).
- Illustrations générées par IA : le dire dans la légende et dans la vidéo, et ne jamais les présenter comme
  une photo réelle d'un lieu ou d'une institution. Source de la première vidéo : projet Remotion hors dépôt.

## Format MDX obligatoire
title, slug, excerpt, tag, author, read_time, image_url, featured, date

Optionnel : `seo_title` (balise `<title>` seulement, viser <= 60 caractères ; sinon `title` est utilisé).
Le gabarit n'ajoute `| ialucide` que si le total reste <= 60 caractères. Ne jamais remettre de suffixe
fixe type "Guide 2026" dans `app/article/[slug]/page.tsx`.

Optionnel : `updated: "AAAA-MM-JJ"` pour une mise à jour substantielle d'un article existant. Affiche
« Mis à jour - JJ/MM/AAAA » sous le titre et alimente `dateModified` (schema Article) et `lastModified`
(sitemap). Ne jamais avancer `date` pour signaler une mise à jour : `date` reste la date de publication
(elle sert aussi au tri de la page d'accueil).

`excerpt` : 155 caractères maximum. Il sert de meta description, coupée au dernier mot entier avant
155 caractères (`truncateAtWord()` dans `app/article/[slug]/page.tsx`) : au-delà, Google affiche une
phrase tronquée qui se termine en « … ».

## Signature des articles (champ `author`, depuis le 03/11/2026)
Deux valeurs pour les textes d'ialucide, écrites exactement ainsi : `"Daniel Rollin"` ou
`"La rédaction ialucide"`, plus les articles invités déclarés dans `GUEST_AUTHORS` (voir plus bas).
Aucune autre variante (« Rédaction IA Lucide », « Rédaction iALucide », « digicorpex » ont été
normalisées le 03/11).

- **« Daniel Rollin »** : texte à la première personne ou expérience vécue ; mention Digicorpex à la
  première personne (« l'agence que j'ai fondée », cf. Axe éditorial plus bas : sous une signature
  collective, le « je » de la disclosure devient ambigu) ; analyse d'opinion ou critique
  méthodologique ; article construit autour de la lecture d'une étude précise ; pages de confiance
  (`avis-ialucide-ia`).
- **« La rédaction ialucide »** : fiches métiers, comparatifs et listicles d'outils, guides
  pratiques, y compris quand ils citent des études en appui.
- En cas de doute : Daniel Rollin.

**Articles invités (depuis le 24/11/2026)** : troisième famille de valeurs, déclarée dans
`GUEST_AUTHORS` (`lib/articles.ts`), dont la clé est la valeur exacte du champ `author`
(ex. `"Incroyable.ai (article invité)"`). Effets : schema `Organization` au nom et à l'URL de la
publication invitée (jamais au nom d'ialucide), encadré « Article invité » sous l'en-tête de
l'article. Conditions éditoriales : texte relu et ajusté par Daniel avant publication, mêmes règles
que le reste du site (sources primaires, prix HT datés, « la limite à connaître », style), aucune
rémunération, un seul lien vers la publication invitée, pas de lien affilié. Un nouvel invité
s'ajoute dans `GUEST_AUTHORS` avant publication, sinon `assertAuthor()` bloque le build. La page
/about/ annonce cette règle.

Répartition au 03/11/2026 : 22 Daniel Rollin, 26 La rédaction ialucide (commit `62b1dc8`).

La page /about/ annonce publiquement cette règle (commit `7860f37`) : « Les articles signés « La
rédaction ialucide » sont des contenus pratiques : fiches métiers, comparatifs d'outils, guides. Ils
sont produits et relus sous ma responsabilité de directeur de la publication. Les analyses, les
lectures d'études et les retours d'expérience portent mon nom. » Toute évolution de la règle doit
mettre ce paragraphe à jour.

Schema Article (`app/article/[slug]/page.tsx`) : `author` en `Organization` avec
`url: https://ialucide.fr/about/` pour la rédaction ; `Person` avec `url` /about/ et `sameAs`
LinkedIn pour Daniel Rollin. La comparaison se fait sur la constante `REDACTION_AUTHOR`
(`lib/articles.ts`). Le build bloque toute autre valeur : `assertAuthor()` lève une erreur au
chargement des articles (« content/<fichier> (slug …) : author "…" invalide »), y compris si le champ
est absent ou vide. Une variante d'orthographe ne peut donc plus produire en silence un schema
`Person` au nom de la rédaction : corriger le frontmatter, ne jamais assouplir la liste.

## Liens internes
- Toujours lier vers l'URL finale, avec le slash final (`/article/slug/`). Avant d'ajouter un lien,
  vérifier que le slug existe dans `content/` et qu'il n'a pas été fusionné (voir `public/_redirects`
  et les sessions SEO plus bas) : un lien vers un article fusionné fonctionne mais passe par une 301.
- Deux articles proches (même étude, même requête) : différencier l'angle et le public visé, et lier
  dans les deux sens, plutôt que de laisser deux pages viser la même requête.

## Performance (PageSpeed mobile 96 au 02/11/2026, contre 81 avant)
- Ne jamais démarrer une animation à `opacity: 0` sur un élément visible au chargement : le navigateur
  ne compte pas un élément invisible comme affiché, ce qui retardait le LCP mobile d'environ 2,3 s.
  L'animation `.animate-fade-in-up` (globals.css) est volontairement en translation seule.
- Mesurer avec PageSpeed Insights après chaque changement de gabarit ou d'images, en relançant
  l'analyse une fois le déploiement confirmé : une seule mesure varie de quelques points.

## Polices (depuis le 26/11/2026)
- **Polices locales uniquement** : `next/font/local` avec les woff2 de `app/fonts/` (licence OFL de chaque
  famille à côté). **Jamais `next/font/google`**, ni d'`@import` vers fonts.googleapis.com : le
  téléchargement chez Google pendant le build échouait par intermittence et faisait planter Turbopack
  (« Can't resolve '@vercel/turbopack-next/internal/font/google/font' »), cause des builds Cloudflare
  intermittents du 26/11/2026.
- Fichiers générés depuis le dépôt google/fonts (`ofl/<famille>/`) avec fontTools : polices variables
  limitées aux graisses utilisées, sous-ensemble latin de Google Fonts plus les glyphes du site présents
  dans la police (Ł ł ń ← → ≈ ≤ ≥, μ pour Playfair), `--no-hinting --desubroutinize
  --layout-features+=lnum,pnum,tnum`. Une nouvelle graisse ou un nouveau caractère hors latin demande de
  régénérer le fichier concerné.

## Scripts tiers et requêtes vers Google (depuis le 27/11/2026)
- **Aucune requête vers un domaine Google avant consentement.** Seul GA4 se charge, et seulement après
  « Accepter » (`components/AnalyticsConsent.tsx`). Ne jamais ajouter de script tiers dans `app/layout.tsx`
  ni dans un composant chargé sur toutes les pages sans passer par ce consentement.
- **Sources préférées Google = lien simple, jamais de script** : `https://www.google.com/preferences/source?q=ialucide.fr`
  (lien direct documenté par Google Search Central), en nouvel onglet, bouton en HTML et CSS du site
  (`components/Footer.tsx`, `components/ArticleSidebar.tsx`). Le script `news.google.com/swg/js/v1/publisher.js`
  a été retiré le 27/11/2026 : il se chargeait sur toutes les pages sans consentement depuis le 03/09.
- **Contrôle mensuel** : lister les domaines tiers contactés par l'accueil, un article et l'outil, avec un
  navigateur sans consentement enregistré (Chrome headless + protocole DevTools, événements
  `Network.requestWillBeSent`, page défilée jusqu'en bas). Attendu : `ialucide.fr` seul. Puis cliquer
  « Accepter » : seuls `googletagmanager.com` et `google-analytics.com` doivent s'ajouter. Tout autre
  domaine : le signaler à Daniel avant de corriger, et vérifier la politique de confidentialité.

## Déploiement Cloudflare Pages
- Toujours faire `git pull --ff-only` avant de modifier quoi que ce soit (le 03/11/2026, le dépôt
  local avait 22 commits de retard).
- Vérifier le statut d'un build sans le tableau de bord (dépôt public, pas besoin de `gh`, qui n'est
  pas installé sur le Mac de Daniel) :
  `curl -s https://api.github.com/repos/Dany-226/ia-lucide/commits/<sha>/check-runs`
  puis lire le check « Cloudflare Pages » : `status` completed et `conclusion` success attendus.
  Interroger le DERNIER commit du push : Cloudflare ne construit que la tête de chaque push, les
  commits intermédiaires renvoient `"check_runs": []` (constaté le 03/11 sur `62b1dc8` et `dc0c78a`),
  ce qui n'est pas un échec. Un « Not Found » signifie que le dépôt n'est plus public.
- Le workflow IndexNow au vert ne prouve pas qu'un déploiement a réussi (les URL existantes répondent
  déjà 200 avec l'ancienne version). Vérifier le build Cloudflare et le contenu en production.
- Le 02/11/2026, deux builds contenant de nouvelles images ont échoué alors que le même code compilait
  en local ; une relance sans modification (commit vide ou « Retry deployment ») a réussi les deux fois.
  Si un build échoue sur du code qui compile en local : relancer une fois avant d'investiguer, puis
  lire le journal dans Cloudflare Pages → Deployments si l'échec se reproduit.

## Marque, métadonnées et données structurées (depuis le 13/11/2026)

**Graphie de la marque : « ialucide »**, tout en minuscules, partout : titles, descriptions, texte
visible, attributs `alt` du logo, schema. Jamais « IA Lucide », « iALucide », « IALucide ».
Seule exception : le logotype en capitales de la charte newsletter (`brand/newsletter-design.md`).
Accroche officielle : « L'IA sans illusions, métier par métier ».

**Titles** : le layout racine définit `title.default` (« ialucide | L'IA sans illusions, métier
par métier ») et `title.template` (`%s | ialucide`). Une page déclare seulement son nom
(« Contact ») et le template ajoute la marque. Ne jamais écrire « | ialucide » à la main dans un
title de page : il apparaîtrait en double. Les articles gardent leur règle propre (suffixe
seulement si le total reste <= 60 caractères, cf. Format MDX) via un title absolu.

**Open Graph obligatoire, via `lib/seo.ts`** : chaque page exporte
`metadata = pageMetadata({ title | absoluteTitle, description, path, ... })` (ou le renvoie
depuis `generateMetadata()`). Le helper produit le title, la canonical et les balises
og:title/description/url (absolue, slash final)/image (absolue, logo par défaut)/type
(`article` sur les articles, `website` ailleurs)/locale `fr_FR`/site_name `ialucide`, plus
`twitter:card summary_large_image`. Ne jamais déclarer un objet `openGraph` ou `twitter` à la
main dans une page : Next le substitue entièrement à celui du layout, ce qui faisait disparaître
site_name, url, type et locale sur tout le site (constaté par l'audit Ahrefs du 11/11).

**JSON-LD obligatoire** :
- Layout racine : `Organization` (`@id` https://ialucide.fr/#organization, logo, description,
  e-mail, `sameAs` Instagram seul, pas de page LinkedIn entreprise).
- Articles : `Article` (headline, description, image, datePublished = `date`, dateModified =
  `updated` sinon `date`, author selon la règle de signature, publisher relié à l'Organization)
  + `BreadcrumbList`. Le `sameAs` du `Person` Daniel Rollin contient LinkedIn et le compte X
  (`x.com/daniel_rol22591`) ; le compte X ne va pas dans l'Organization.
- Pages hubs (/metiers/, /outils/, /comprendre/, /education-ia/, /ressources/) :
  `collectionPageJsonLd()` (CollectionPage + ItemList des éléments listés, URL absolues ; les
  liens d'affiliation sont remplacés par l'URL officielle de l'outil). Le FAQPage de /metiers/
  reste à part.

### Hub /metiers/ (révision du 27/11/2026)
- Page la plus citée du site par les moteurs IA (Bing IA : 1 264 citations sur 1 626 entre le
  25/08 et le 23/11/2026). Toute modification doit l'enrichir, jamais la remplacer : URL fixe,
  titre inchangé sauf changement du nombre de métiers (règle des 4 semaines, dernier changement
  de titre le 13/11/2026).
- Date de révision : constante `METIERS_HUB_UPDATED` (`lib/seo.ts`), affichée sous l'intro,
  transmise en `dateModified` (CollectionPage) et en `lastModified` (sitemap). L'avancer à chaque
  révision du classement, des sources ou de la liste des métiers, pas pour une retouche de style ;
  mettre à jour `UPDATED_LABEL` et la phrase « Révision du … » de la section Méthode en même temps.
- Classement (depuis le 27/11/2026) : sections par catégorie de l'OIT (gradient 4 à « non exposé »,
  plus « Sans code ISCO-08 fidèle »), sans aucun horizon de temps. Ligne d'introduction de chaque section :
  `INTRO_CATEGORIE` (au pluriel, validée par Daniel le 27/11). Données dans `FICHES` (`app/metiers/page.tsx`) :
  - métier couvert par l'outil : `outil: { domaine, poste }`, catégorie lue au build dans
    `data/metiers/<domaine>/<poste>.json` (jamais recopiée), lien vers /metiers/<domaine>/ et postes voisins
    du domaine affichés ; le build échoue si le poste est introuvable ou non publié ;
  - métier hors outil : `isco: { code, titre, categorie }`, catégorie (colonne `potential25`) relevée dans
    `data/source/Final_Scores_ISCO08_Gmyrek_et_al_2025.xlsx`, mention « hors outil pour l'instant » ;
  - `sansCode` : aucune catégorie affichée plutôt qu'une approximation.
- Codes ISCO-08 des métiers hors outil, validés par Daniel le 27/11/2026 : journaliste 2642 (gradient 3),
  commercial 3322 (gradient 2), graphiste 2166 (gradient 2), consultant 2421 (gradient 2), contrôleur
  financier 2411 (gradient 3), directeur financier 1211 (minimale), médecin 2211 (non exposé), notaire 2619
  (minimale, avec la note « ce code décrit mal le notariat français » et lien vers /metiers/droit/).
  Sans catégorie : manager (pas de code unique), analyste risque assurance et analyste risque opérationnel
  (pas d'équivalent fidèle). Postes de l'outil retenus : assistant administratif = assistant·e de direction
  (3343), enseignant = enseignant·e du secondaire (2330), analyste risque et analyste risque crédit = 2413.
  Changer un code demande l'accord de Daniel et une mise à jour de cette liste.
- Vocabulaire du hub : exposition, potentiel élevé / partiel / faible. Jamais « menacé(s) », « les plus
  menacés », « automatise(nt) », « s'automatise(nt) », « automatisable », « irremplaçable », « outil ou
  menace », « augmenté ». Exceptions : le nom propre « Observatoire des emplois menacés et émergents », le
  slug `developpeur-augmente-ia-2026`, et le title et la description (inchangés jusqu'au 23/12/2026,
  règle des 4 semaines, qui ne couvre que ces deux balises).
- `ETUDES` : source primaire, date, lien, et « la limite à connaître » formulée par les auteurs. L'OIT
  (Gmyrek et al., 2025, ILO Working Paper 140, publié le 20/05/2025, CC BY 4.0) est en tête et sert de
  référence au classement ; Coface/OEM est présenté comme une autre mesure, avec sa propre méthode.
  Le chiffre « 5 millions d'emplois » ne vient pas de l'étude Coface/OEM : ne jamais le réintroduire.
  Lien d'une étude : champ `article.href` (URL interne complète, slash final).
- FAQ : `components/MetiersFaqItem.tsx` utilise `<details>` natif pour que les réponses soient
  dans le HTML statique (avant le 25/11, elles n'étaient rendues qu'après un clic). Toute réponse
  modifiée l'est dans `FAQ`, qui alimente aussi le FAQPage.
- Nouveau métier : ajouter l'entrée dans `METIERS` seulement quand la fiche est publiée, puis
  mettre à jour le nombre de professions dans l'intro et `PAGE_DESCRIPTION`.
- Autre page indexable : `webPageJsonLd()` au minimum (ex. /diagnostic-exposition-ia/).
- Une seule balise H1 par page : le gabarit article affiche déjà le titre en H1, un MDX ne
  commence jamais par `# Titre`.

Une nouvelle page indexable doit aussi être ajoutée à `app/sitemap.ts` (pages légales et
contact incluses, priorité 0.3).

### Diagnostic v2 « Où passe la ligne » (en ligne depuis le 27/11/2026)
- Spec : `docs/spec-diagnostic-exposition-v2.md`, **locale et non versionnée** (`docs/` est dans
  `.gitignore` : le dépôt est public). Ne jamais la commiter ni la citer dans un fichier publié. Elle
  fait foi pour tout ce qui touche au diagnostic ; CLAUDE.md fait foi pour les règles générales. URL
  conservée : /diagnostic-exposition-ia/.
- Source : `data/source/Final_Scores_ISCO08_Gmyrek_et_al_2025.xlsx` (OIT, CC BY 4.0), avec le README
  du dépôt (clauses de traduction et d'adaptation à reproduire sur la page méthodologie). Écrire
  « d'après les données de l'OIT », jamais « diagnostic OIT », ni logo de l'OIT.
- Données : `data/metiers/postes.json` (périmètre et valeurs attendues du §3), un JSON par poste dans
  `data/metiers/<domaine>/<poste>.json`, tableau de relecture `data/metiers/relecture.csv`.
- Scripts : `python3 scripts/import-oit.py` (génère les JSON, s'arrête sur tout écart avec la spec),
  `python3 scripts/import-relecture.py` (réimporte le tableau validé), `node scripts/check-metiers.js`
  (contrôle §9, lancé par `npm run build` ; sur main, il échoue tant qu'aucun poste n'est publié). Scores, catégorie OIT et bandes ne se modifient
  jamais à la main, ni dans les JSON ni dans le CSV.
- **Aucune tâche publiée sans statut `valide`** donné par Daniel (traduction et pertinence, exclusions
  comprises). Un poste ne passe à `"publie": true` que lorsque toutes ses tâches sont validées.
- Vocabulaire : potentiel élevé / partiel / faible pour les tâches ; jamais « automatisable »,
  « menacé », « augmenté », « protégé », ni de probabilité de perdre son emploi.
- Écarts au tableau §3 de la spec (décidés le 26/11/2026) : Avocat et Juriste fusionnés en
  « Avocat·e ou juriste » (tâches et catégorie de 2611 ; 2619 en code associé, avec une note de
  méthode) ; 2413 renommé « Analyste financier·ère ou risque ». Une tâche dont le libellé s'écarte du
  texte de l'OIT pour coller au poste en France porte `adaptation: true` et sa raison (signalée sur la
  page méthodologie, clause d'adaptation de la licence). 22 postes, 177 tâches, 164 retenues.
- **Mise en ligne conditionnée au hub /metiers/** : l'outil ne sort pas tant que le contenu du hub
  n'est pas corrigé (classements alignés sur les catégories de l'OIT, vocabulaire sans « menacé » ni
  « automatisable », OIT ajoutée à `ETUDES`). Le title et la description du hub ne changent
  qu'après le 23/12/2026 (règle des 4 semaines à compter du 25/11).
- Interface (branche `diagnostic-v2`, depuis le 26/11/2026) : calcul pur et testé dans
  `lib/diagnostic-calcul.ts` (`npm test`), données serveur dans `lib/diagnostic-data.ts`, composants dans
  `components/diagnostic/`, textes affichés dans `data/metiers/textes.json` (statut `propose` tant que
  Daniel ne les a pas validés ; vocabulaire et tirets contrôlés par check-metiers). Pages : l'outil
  /diagnostic-exposition-ia/, /methodologie-exposition-ia/ (signée Daniel Rollin), /metiers/<domaine>/
  (signées « La rédaction ialucide »). Le hub /metiers/ lit les catégories des postes (voir Hub /metiers/).
- Visibilité : `DIAGNOSTIC_PREVIEW` (`CF_PAGES_BRANCH !== 'main'`). En prévisualisation, tous les postes
  sont visibles et les pages sont en noindex ; en production, seuls les postes `"publie": true`.
- Inscription : `functions/api/diagnostic-submit.ts` (champs personnalisés metier_domaine, metier_poste,
  isco08, categorie_oit, part_potentiel_eleve, statut, date_diagnostic, à créer dans Beehiiv ; tags
  metier-<domaine>, diagnostic-v2, attente-<métier>). Les tâches cochées ne sont jamais envoyées.
- **Statut : en ligne depuis le 27/11/2026** (fusion `d91d7ee`). 22 postes publiés (`"publie": true`),
  177 tâches et 106 textes au statut `valide`, champs personnalisés Beehiiv créés le 26/11. Inscription
  testée en production le 27/11 (7 champs et tags `metier-<domaine>`, `diagnostic-v2` remplis).
  Pages de domaine et méthodologie soumises à IndexNow le 27/11. Ancienne URL
  `/diagnostic-exposition-ia/resultat/` redirigée en 301 (`public/_redirects`).
- Nouveau poste : JSON généré par `import-oit.py`, tâches validées par Daniel, puis `"publie": true` ;
  `check-metiers` avec `CF_PAGES_BRANCH=main` avant de pousser.

## Conventions
- Zéro border-radius sur boutons et cards
- generateMetadata() sur chaque nouvelle page
- Jamais de 'use client' sur une page qui a besoin de metadata SEO
- Disclosure affiliation sur tous les listicles

## Méthodologie de debug technique

Avant de déclarer un correctif validé : tester plusieurs cas indépendants, pas un seul.
Une explication qui permet de clore rapidement une investigation est suspecte si elle
n'a pas été confrontée à un deuxième test qui pourrait la contredire.

## Structure clé
- /content/ → articles MDX
- /app/ → pages Next.js
- /public/ → images statiques
- /brand/ → logos et design system newsletter

## Affiliation
- Base44 : programme via Impact.com (meta tag vérification déployée)
- Pennylane : contact envoyé, programme direct
- Liens affiliés à intégrer dans /content/outils-ia-experts-comptables-2026.mdx
  et /content/base44-bolt-lovable-v0-comparatif-vibe-coding-2026.mdx

## robots.txt

Le fichier `app/robots.txt` (statique, convention native Next.js - **pas** `app/robots.ts`,
qui ne peut pas exprimer le champ non-standard `Content-Signal`) contient les directives
suivantes, à ne jamais supprimer sans vérifier d'abord si Cloudflare "Managed robots.txt"
(AI Crawl Control → Overview) est actif :

- `Content-Signal: search=yes,ai-train=no,use=reference` - réserve de droits sur
  l'entraînement IA au titre de l'article 4 de la directive UE 2019/790
- `Disallow: /` explicite pour : Amazonbot, Applebot-Extended, Bytespider, CCBot,
  ClaudeBot, CloudflareBrowserRenderingCrawler, Google-Extended, GPTBot, meta-externalagent

Politique (validée le 13/11/2026) : bloquer l'entraînement, autoriser la recherche IA. Les
robots de recherche et agents utilisateur (OAI-SearchBot, ChatGPT-User, Claude-SearchBot,
Claude-User, PerplexityBot, Perplexity-User, plus Googlebot et bingbot) sont autorisés dans un
groupe commun qui **répète** la ligne `Content-Signal` : un robot qui trouve son propre groupe
ignore entièrement le groupe `*`, donc ne lirait pas la réserve `ai-train=no`. Tout nouveau groupe
nommé doit reprendre cette ligne.

Le toggle Cloudflare Dashboard → AI Crawl Control → Overview → "Managed robots.txt" est
désactivé depuis le 23/08/2026. S'il est réactivé, Cloudflare injecte automatiquement ces
mêmes règles EN PLUS du contenu du repo (pas en fallback comme on aurait pu le croire),
créant un fichier dupliqué. Ne jamais le réactiver sans vider en parallèle le contenu géré
par Cloudflare du fichier repo.

## Style éditorial — Patterns à bannir

Ces éléments signalent un texte généré par IA. Les éviter systématiquement dans tous les articles et contenus ialucide.

### Typographie
- Cadratins (—) et demi-cadratins (–) → remplacer par tirets simples (-)
- Guillemets typographiques automatiques si incohérents avec le reste

### Tournures à ne jamais utiliser
- "Il est important de noter que..."
- "Il convient de souligner que..."
- "En conclusion," en début de paragraphe
- "Par ailleurs," / "De plus," / "En outre," comme transitions
- "Cela étant dit,"
- "Il va sans dire que..."
- "Force est de constater que..."
- "Dans ce contexte,"
- "À cet égard,"
- Toute phrase commençant par "Cela" ou "Ceci" comme sujet principal

### Structure
- Pas de listes à bullets pour tout expliquer — privilégier la prose
- Pas de gras sur chaque point clé d'un paragraphe — le gras est rare et signifiant
- Pas de conclusion qui résume ce qui vient d'être dit
- Pas de phrase d'accroche générique en intro ("Dans un monde où l'IA...")
- Pas de questions rhétoriques en fin de section

### Sources et chiffres
- Aucun chiffre sans source vérifiable (« 3x plus vite », « 70 % de temps gagné » ont été retirés le
  02/11/2026). Pour une étude, lire la source primaire (note, PDF) plutôt que ses reprises presse, et
  citer les limites que les auteurs indiquent eux-mêmes (causalité, période, champ).
- Ne jamais présenter ialucide comme proposant des prestations (formation, audit, accompagnement) :
  c'est un site éditorial. Les prestations relèvent de Digicorpex, avec la disclosure ci-dessous.
- Prix et offres d'outils : vérifier sur la page officielle de l'éditeur, indiquer HT et la devise,
  et dater le relevé dans l'article (les prix changent souvent).

### Ton
- Pas de superlatifs non justifiés ("révolutionnaire", "incontournable", "majeur")
- Pas d'évangélisme ("l'IA va transformer...", "une opportunité sans précédent...")
- Pas de catastrophisme ("les métiers vont disparaître...", "une menace existentielle...")
- Pas de fausse neutralité ("certains pensent X, d'autres pensent Y" sans prise de position)

## Contenu Instagram — règles de production

**Format obligatoire : 1080x1080 (carré), jamais 4:5 (1080x1350).** Instagram recadre
automatiquement les posts 4:5 en carré au moment de l'upload, sauf action manuelle de
l'utilisateur (icône d'expansion) - tout contenu placé dans les ~135px du haut ou du bas d'un
visuel 4:5 disparaît silencieusement au recadrage. Toujours générer en 1080x1080 pour éliminer
ce risque, pas de marge de sécurité à calculer.

**Ne jamais utiliser Canva:generate-design pour du contenu de marque.** La génération IA de
Canva produit des résultats hors charte (typographie, mise en page, ton visuel) qui ne
respectent pas l'identité ialucide, même avec un prompt détaillé. Pour tout visuel de marque
(posts Instagram, slides, visuels newsletter au-delà du hero simple), générer directement en
code (Python/Pillow) avec les polices et couleurs exactes de la charte, pas via génération IA
d'image.

**Polices** : télécharger depuis le dépôt officiel Google Fonts
(raw.githubusercontent.com/google/fonts, licence OFL) plutôt que de supposer leur présence dans
l'environnement :
- Playfair Display : ofl/playfairdisplay/PlayfairDisplay[wght].ttf
- Space Grotesk : ofl/spacegrotesk/SpaceGrotesk[wght].ttf
- DM Mono : ofl/dmmono/DMMono-Regular.ttf et DMMono-Medium.ttf

**Assets logo** (fournis par Daniel le 25/08/2026, à réutiliser) :
- `logo-white.png` : malgré son nom, c'est la version DORÉE avec fond RÉELLEMENT transparent
  (canal alpha exploitable) - à utiliser sur fonds sombres
- Aucune version sombre avec transparence native n'existe : la version noire fournie
  (`ialucide_logo_black_fonts.png`) a un fond crème opaque baked-in (~RGB 241,240,222) qu'il faut
  détourer par chroma key (seuil de distance colorimétrique ~22) avant de pouvoir la superposer
  sur un fond coloré (ex : fond or de la slide CTA)
- Ne jamais utiliser `ialucide_logo_gold.png` comme overlay - fond texturé papier baked-in, non
  détourable proprement

**Process de génération** : demander toujours confirmation du format et du texte de chaque slide
avant génération en masse. Ne jamais proposer plusieurs variantes générées par IA à choisir
(rejeté explicitement le 25/08 - "designs grotesques") - construire directement le rendu final en
code, avec un seul résultat cohérent avec la charte.

## Réseaux sociaux

- **Instagram** : @ialucide (https://www.instagram.com/ialucide/) - handle et marque alignés
- **X (Twitter)** : compte marque ialucide, mais le handle technique n'a jamais été personnalisé
  et reste sur l'attribution automatique @daniel_rol22591 (https://x.com/daniel_rol22591) - le nom
  affiché est "ialucide", mais l'URL/handle ne le reflète pas. À corriger un jour en changeant le
  handle depuis les réglages du compte X si Daniel veut aligner les deux comptes, non urgent.

Pour toute production de contenu multi-plateforme (ex : carrousel Instagram + version X),
vérifier lequel des deux comptes est visé avant de produire, les formats et contraintes diffèrent
(voir section "Contenu Instagram — règles de production" juste au-dessus pour le format
Instagram ; le format X n'a pas encore été documenté, à faire lors de la première production de
contenu pour ce compte).

## Axe éditorial — Agents IA / Digicorpex

Digicorpex (www.digicorpex.com) est l'agence de Daniel Rollin, basée à Bordeaux : conception
d'agents IA sur mesure pour PME/TPE (automatisation d'appels, devis, relances, wiki IA/mémoire
d'entreprise). C'est une structure commerciale que Daniel possède et dirige - pas un partenaire
d'affiliation tiers.

**Règle de disclosure obligatoire** : tout article ialucide qui lie vers digicorpex.com doit le
faire avec une mention explicite et non ambiguë du type de lien - par exemple "Digicorpex est
l'agence que j'ai fondée pour déployer ce type d'agents en PME" ou équivalent. Jamais de lien
silencieux vers digicorpex présenté comme une recommandation neutre. Cette règle est non
négociable et prime sur toute autre considération de fluidité rédactionnelle - cohérente avec le
principe déjà en place de disclosure affiliation standard sur les articles monétisés (cf.
Conventions plus haut), mais encore plus stricte puisqu'il s'agit d'un intérêt direct, pas d'une
commission sur un outil tiers testé.

**Angle du pilier "Agents IA"** : pas de contenu générique "les agents IA en 2026, tout savoir" -
ça sort de la ligne éditoriale factuelle/anti-évangélisme (cf. Style éditorial ci-dessus). Cas
d'usage métier par métier, dans la continuité du format déjà utilisé sur ialucide (comptables,
juristes, RH...), avec le même principe "ce que fait l'IA concrètement" + "la limite à connaître".
Digicorpex traite en parallèle sur son propre blog l'angle "déploiement technique" des mêmes
métiers - maillage réciproque naturel entre les deux sites sans duplication de contenu, chacun
gardant sa focale (ialucide : impact métier / digicorpex : mise en œuvre).

**Premier article de référence** : le cas Expertise Prothèse (plateforme no-code
Airtable/Softr/Make que Daniel a fondée, sur laquelle il a ensuite branché des agents IA pour la
SEO/Search Console) - cas vérifiable, vécu directement, illustre à la fois l'angle ialucide
(résultats concrets, avant/après) et le savoir-faire digicorpex, sans recourir à un cas client
tiers non vérifiable.

## Session SEO — 15 juillet 2026 : découverte et correction d'un Worker Cloudflare obsolète

### Contexte critique découvert
Un Worker Cloudflare nommé `ialucide-seo` était routé sur `ialucide.fr/*` (priorité sur Cloudflare Pages)
depuis l'époque Base44/Vite SPA. Il n'était documenté nulle part (ni ici, ni dans le projet).

**Ce qu'il faisait** : pour les requêtes de crawlers uniquement (Googlebot, Bingbot, etc. — détection par
user-agent), il appelait `BASE44_API_URL` (`https://ialucide.base44.app/getArticles`) pour générer du HTML
pré-rendu — un mécanisme de prerendering nécessaire à l'époque de la SPA React, devenu obsolète depuis la
migration Next.js static export.

**Le problème** : Base44 a été fermé (compte résilié). Le Worker continuait à s'exécuter, l'appel API échouait
silencieusement (`try/catch` → tableau vide), et le Worker servait quand même un `200 OK` avec une **page
d'accueil vide de tout article** — uniquement à Googlebot, mise en cache 1h. Les visiteurs humains n'étaient
jamais affectés (le Worker les laissait passer en `pass-through` direct vers Pages).

**Conséquence probable** : c'est la cause la plus vraisemblable de la chute d'indexation observée sur 3 mois
(40 → 18 pages indexées dans GSC), la homepage étant le point d'entrée principal du maillage interne pour
Googlebot.

### Action effectuée
Suppression complète de la route Workers `ialucide.fr/*` → `ialucide-seo` (Cloudflare Dashboard →
Workers Routes → Remove). Cloudflare Pages sert désormais directement le HTML statique Next.js à tous les
visiteurs, y compris les crawlers. Vérifié via GSC Inspection de l'URL (test live) : homepage complète avec
tous les articles et le maillage interne intact.

**Point de vigilance pour l'avenir** : si un besoin de prerendering spécifique aux crawlers réapparaît, ne
jamais dépendre d'une API externe sans fallback vers le contenu statique en cas d'échec. Toujours vérifier
les Workers Routes actives (`ialucide.fr/*`) avant tout diagnostic SEO — elles s'exécutent avant Cloudflare
Pages et peuvent masquer complètement le comportement réel du site pour Google.

### Redirect Rules créées (Cloudflare Dashboard → Rules → Redirect Rules)
Pour corriger les 9 URLs en 404 identifiées dans GSC (Indexation → Pages → Introuvable 404), toutes héritées
de l'ancienne architecture Base44 avec query strings — non gérables via `_redirects` (limitation déjà connue,
cf. section SEO plus haut) :

1. `redirect-article-slug` — `ialucide.fr/article?slug=*` → `ialucide.fr/article/${1}/` (301)
2. `redirect-article-slug-uppercase` — `ialucide.fr/Article?slug=*` → `ialucide.fr/article/${1}/` (301)
3. `redirect-article-id` — `ialucide.fr/*rticle?id=*` → `ialucide.fr/metiers/` (301, pas de mapping
   id→slug disponible, fallback vers page thématique)
4. `redirect-about-camelcase` — `ialucide.fr/About` → `ialucide.fr/about/` (301)

Testé et validé : les 3 cas passent, y compris la chaîne complète `?slug=comptable` → `/article/comptable/`
→ résolution via `_redirects` existant → `expert-comptable-ia-guide-2026` (bon article final).

### Session SEO — 19 août 2026 : table de correspondance anciens slugs Base44 → slugs actuels

11 nouvelles URLs en 404 remontées par GSC, toutes héritées de Base44. Investigation complète :
test direct de chaque URL (`curl -IL`), croisement avec les slugs de `content/*.mdx` et avec les
4 Redirect Rules ci-dessus.

**Cause racine** : `redirect-article-slug` et `redirect-article-slug-uppercase` sont des wildcards
génériques (`/article?slug=*` → `/article/${1}/`) qui supposent que l'ancien slug = le nom du
fichier MDX actuel. Faux pour les slugs Base44 raccourcis renommés lors de la migration Next.js -
la redirection aboutit à un 404 silencieux au lieu du bon article.

Table de correspondance (vérifiée via `git log` sur le commit de migration initiale `4577623` -
les fichiers actuels existent déjà sous leur nom long depuis ce tout premier commit Next.js, aucun
renommage `git mv` détecté : les slugs courts Base44 n'ont jamais existé comme fichiers dans ce repo) :

| Ancien slug Base44 | Slug actuel |
|---|---|
| `architecte` | `architecte-ia-conception-batiment` |
| `juriste-avocat` | `juriste-ia-avocat-pratique-augmentee` |
| `comptable` | `expert-comptable-ia-guide-2026` (déjà couvert via `_redirects`) |
| `ia-comptabilite-expert-comptable-2026` | `expert-comptable-ia-guide-2026` |
| `medecin` | inchangé, slug déjà correct |
| `developpeur-augmente-ia-2026` | inchangé, slug déjà correct |

**Slug orphelin `ia-comptabilite-expert-comptable-2026` résolu** : la règle `_redirects` ajoutée le
11/05 (`fix: redirect slug 404 ia-comptabilite vers outils-ia-experts-comptables`) pointait vers le
mauvais article - `outils-ia-experts-comptables-2026` est un comparatif d'outils, alors que le titre
d'`expert-comptable-ia-guide-2026` ("IA et Comptabilité : Guide 2026 de l'Expert-Comptable Augmenté")
correspond terme à terme à l'ancien slug. Cette règle était de toute façon inopérante : shadow par
la règle générique `/article/:slug /article/:slug/ 301` déclarée plus haut dans le même fichier.

**Point d'attention `_redirects`** : Cloudflare Pages traite ce fichier de haut en bas, premier match
gagnant. Toute règle spécifique par chemin doit être déclarée avant les règles génériques `/article/:slug`,
sous peine d'être silencieusement neutralisée comme ci-dessus.

### À surveiller (pas d'action immédiate)
- Courbe GSC Indexation (Vue d'ensemble) sur les 1-3 prochaines semaines — test de l'hypothèse Worker.
- Les 26 URLs "Explorée, actuellement non indexée" (GSC) — hypothèse initiale de cannibalisation éditoriale
  invalidée après lecture du contenu réel (articles distincts, pas de gabarit pauvre). Attendre un recrawl
  post-correction avant tout nouveau diagnostic sur ce point — ne pas retravailler le contenu maintenant.

## Session SEO — 23 août 2026 : audit redirections post-migration Base44, bug de matching query string

Point de départ : une redirection incorrecte observée en prod (`/article?slug=juriste-ia-avocat-
pratique-augmentee` atterrissait sur un article sans rapport). Investigation en plusieurs temps :
audit complet de `public/_redirects` et des liens internes, recherche d'une règle générale antérieure
dans le fichier, puis test direct en prod sur plusieurs slugs pour confirmer la cause.

**Cause racine, plus large qu'un bug ponctuel** : Cloudflare Pages `_redirects` ne matche JAMAIS sur
la query string, seulement sur le chemin. Toute règle du type `/article?slug=X ... 301` dans ce
fichier est du code mort - la première règle avec le même chemin gagne pour toutes les requêtes,
peu importe la query string, qui est ensuite rattachée telle quelle à la destination. Confirmé par
test direct en prod (`curl -sI`) sur plusieurs slugs distincts (`commercial`, `medecin`, `comptable`,
`juriste-ia-avocat-pratique-augmentee`) : tous redirigeaient vers la même mauvaise destination
(`adaptation-ia-manager-retour-experience`, la première règle du bloc). La section entière
(78 lignes, "format query string Base44") a été supprimée du fichier - voir commit `600af69`. Cela
invalide au passage l'affirmation "testé et validé" de la session du 15 juillet plus haut : soit ce
test reposait sur un comportement des Redirect Rules dashboard qui a changé depuis, soit le test
initial était insuffisant (un seul cas testé, cf. méthodologie ci-dessous).

Le 06/11/2026, les 7 dernières lignes à query string encore présentes (`/Article?id=…`, `/Article?slug=…`,
signalées « invalid redirect lines » dans le journal de build) ont été supprimées ; la seule règle restante
est `/Article / 301`, écrite sous sa forme réelle.

Le routing par query string doit passer exclusivement par les Cloudflare Redirect Rules (dashboard),
en "URI Full equals" pour un match exact ou "Wildcard pattern" (pas "Custom filter expression" avec
un `*` littéral - ça ne matche jamais) pour un pattern générique.

**Méthode de test à toujours appliquer** : `curl -IL "URL" -H "Cache-Control: no-cache"`, jamais
uniquement au navigateur - le cache edge Cloudflare ET le cache navigateur peuvent tous les deux
resservir une ancienne réponse après une correction de règle, donnant une fausse impression d'échec
ou de succès. Tester plusieurs slugs/valeurs différents avant de déclarer une règle wildcard
fonctionnelle - un seul test positif ne prouve rien sur un pattern générique (cf. Méthodologie de
debug technique plus haut).

**Table de correspondance des Redirect Rules actives (dashboard, 9 règles, état au 23/08/2026)** :

| # | Nom | Match | Action |
|---|---|---|---|
| 1 | Redirect newsletter subdomain to /newsletter/ | Hostname equals `newsletter.ialucide.fr` | 301 → `https://ialucide.fr/newsletter/` |
| 2 | `redirect-ia-comptabilite-old-path` | URI Full equals `https://ialucide.fr/article/ia-comptabilite-expert-comptable-2026` | 301 → `https://ialucide.fr/article/outils-ia-experts-comptables-2026/` (repointée le 20/10/2026) |
| 3 | `redirect-juriste-avocat-old-slug` | URI Full equals `https://ialucide.fr/article?slug=juriste-avocat`, URI Full equals `https://ialucide.fr/Article?slug=juriste-avocat` | 301 → `https://ialucide.fr/article/juriste-ia-avocat-pratique-augmentee/` |
| 4 | `redirect-architecte-old-slug` | URI Full equals `https://ialucide.fr/article?slug=architecte`, URI Full equals `https://ialucide.fr/Article?slug=architecte` | 301 → `https://ialucide.fr/article/architecte-ia-conception-batiment/` |
| 5 | `redirect-article-slug` | URI Full wildcard `https://ialucide.fr/article?slug=*` | 301 → wildcard_replace vers `https://ialucide.fr/article/${1}/` |
| 6 | `redirect-article-slug-uppercase` | URI Full wildcard `https://ialucide.fr/Article?slug=*` | 301 → wildcard_replace vers `https://ialucide.fr/article/${1}/` |
| 7 | `redirect-article-id` | URI Full wildcard `https://ialucide.fr/*rticle?id=*` | 301 → wildcard_replace(...) |
| 8 | `redirect-about-camelcase` | URI Full wildcard `https://ialucide.fr/About` | 301 → wildcard_replace(...) |
| 9 | `redirect-old-juriste-articles-to-guide` | URI Full equals `https://ialucide.fr/article/harvey-ai-france-cabinets-avocats/`, URI Full equals `https://ialucide.fr/article/outils-ia-juristes-avocats-2026/`, URI Full equals `https://ialucide.fr/article/juriste-ia-avocat-pratique-augmentee/` | 301 → `https://ialucide.fr/article/guide-ia-juristes-avocats-2026/` |

Règles 5 et 6 corrigées le 23/08 : étaient en "Custom filter expression" avec opérateur equals
littéral, ne matchaient jamais - reconstruites en "Wildcard pattern".

**Note importante** : les règles 3 et 9 se recoupent volontairement sur
`juriste-ia-avocat-pratique-augmentee` - ce n'est pas une redondance à nettoyer. La règle 3 amène
l'ancien slug court Base44 `juriste-avocat` vers `/article/juriste-ia-avocat-pratique-augmentee/`,
qui n'existe plus comme article depuis la fusion ; la règle 9 rattrape ensuite ce chemin (ainsi que
les deux autres anciens slugs fusionnés) vers `/article/guide-ia-juristes-avocats-2026/`. Double hop
délibéré, validé par `curl -IL` le 23/08/2026.

## Session SEO — 20 octobre 2026 : CTR (analyse GSC 3 mois)

- Gabarit `<title>` des articles corrigé : suppression du suffixe fixe " : Guide 2026 | ialucide", champ
  `seo_title` optionnel (cf. Format MDX).
- `seo_title` + intros alignés sur les requêtes réelles : Pennylane ("pennylane sci", pos. 5-7, 0 clic),
  Base44 ("base44 vs lovable", pos. 6-9, 0 clic : verdict + tableau en tête), agent-ia-devis,
  agent-ia-serveur, cours-claude.
- **Fusion comptable** : `expert-comptable-ia-guide-2026` (mince, chiffres non sourcés) fusionné dans
  `outils-ia-experts-comptables-2026` (cannibalisation : pos. 22 vs 42 sur la même intention).
  301 dans `_redirects`, `/article/comptable/` repointé en direct, slug /metiers/ et liens internes mis à jour.
  La table "anciens slugs Base44" plus haut (19 août) est donc obsolète pour `comptable` et
  `ia-comptabilite-expert-comptable-2026` : cible finale = `outils-ia-experts-comptables-2026`.
  Redirect Rule dashboard n°2 (`redirect-ia-comptabilite-old-path`) repointée le 20/10 vers
  `outils-ia-experts-comptables-2026/` (validé `curl -IL` : 301 unique puis 200).
- Auteur `digicorpex` remplacé par `Daniel Rollin` sur les 12 fiches métier historiques (E-E-A-T,
  cohérence de signature).

## Session SEO — 2 novembre 2026 : CTR, performance et contraste

- Analyse GSC 3 mois : ignorer les requêtes au format « entre X et Y, pour default topic… <context>
  company url: … » (sondes automatiques d'un outil de suivi de visibilité IA, pas des internautes).
  L'export ne relie pas requêtes et pages : toute attribution requête → page est une déduction.
- Ne pas retoucher le titre ou l'excerpt d'une page modifiée depuis moins de 4 semaines : comparer
  d'abord les périodes avant/après dans GSC. Pages retouchées le 20/10 et le 02/11 à évaluer début décembre.
- `seo_title` + excerpt + intro réécrits : `analyste-risque-remplace-par-ia` (pos. 4-5, 0 clic),
  `guide-ia-juristes-avocats-2026` (titre de 92 caractères tronqué). Refonte complète :
  `developpeur-augmente-ia-2026` et `choisir-llm-professionnel-comparatif` (champ `updated`).
- Meta description coupée en plein mot sur 19 articles : corrigé par `truncateAtWord()`.
- Images, animation du hero, logo, contraste : voir sections « Images et couleurs » et « Performance ».


@AGENTS.md

# ialucide — Contexte projet pour Claude Code

## Stack
- Next.js 16 static export (output: 'export')
- Cloudflare Pages — déploiement automatique sur push main
- Domaine : ialucide.fr (OVH, DNS Cloudflare)

## Workflow publication article
1. Créer le fichier MDX dans /content/ avec frontmatter complet
2. git add, commit, push → Cloudflare déploie en 2-3 min
3. Une fois le déploiement propagé, notifier les moteurs de recherche via IndexNow :
   `npm run indexnow -- --urls=https://ialucide.fr/article/<slug-du-nouvel-article>/`
   (sans argument `--urls`, la commande soumet tout le site — à réserver aux cas exceptionnels)

## Format MDX obligatoire
title, slug, excerpt, tag, author, read_time, image_url, featured, date

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

### Ton
- Pas de superlatifs non justifiés ("révolutionnaire", "incontournable", "majeur")
- Pas d'évangélisme ("l'IA va transformer...", "une opportunité sans précédent...")
- Pas de catastrophisme ("les métiers vont disparaître...", "une menace existentielle...")
- Pas de fausse neutralité ("certains pensent X, d'autres pensent Y" sans prise de position)

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
| 2 | `redirect-ia-comptabilite-old-path` | URI Full equals `https://ialucide.fr/article/ia-comptabilite-expert-comptable-2026` | 301 → `https://ialucide.fr/article/expert-comptable-ia-guide-2026/` |
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

@AGENTS.md

# ialucide — Contexte projet pour Claude Code

## Stack
- Next.js 16 static export (output: 'export')
- Cloudflare Pages — déploiement automatique sur push main
- Domaine : ialucide.fr (OVH, DNS Cloudflare)

## Workflow publication article
1. Créer le fichier MDX dans /content/ avec frontmatter complet
2. git add, commit, push → Cloudflare déploie en 2-3 min

## Format MDX obligatoire
title, slug, excerpt, tag, author, read_time, image_url, featured, date

## Conventions
- Zéro border-radius sur boutons et cards
- generateMetadata() sur chaque nouvelle page
- Jamais de 'use client' sur une page qui a besoin de metadata SEO
- Disclosure affiliation sur tous les listicles

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

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

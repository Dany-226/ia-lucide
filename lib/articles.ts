import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'content');

/** Signature collective : schema Organization au lieu de Person. */
export const REDACTION_AUTHOR = 'La rédaction ialucide';

const ALLOWED_AUTHORS = ['Daniel Rollin', REDACTION_AUTHOR];

// Fait échouer le build plutôt que de publier un schema Person au nom d'une variante.
function assertAuthor(filename: string, slug: string, author: unknown): void {
  if (typeof author !== 'string' || !ALLOWED_AUTHORS.includes(author)) {
    throw new Error(
      `content/${filename} (slug ${slug}) : author ${JSON.stringify(author)} invalide. ` +
      `Valeurs acceptées : ${ALLOWED_AUTHORS.map(a => `"${a}"`).join(' ou ')} (cf. CLAUDE.md, Signature des articles).`
    );
  }
}

export interface Article {
  slug: string;
  title: string;
  /** Titre SEO optionnel pour la balise <title> (sinon : title). Viser <= 60 caractères. */
  seo_title?: string;
  excerpt: string;
  tag: string;
  category?: 'metiers' | 'outils' | 'comprendre' | 'entrepreneuriat' | 'education-ia';
  author: string;
  read_time: string;
  date: string;
  /** Date de mise à jour optionnelle (AAAA-MM-JJ), affichée « Mis à jour - JJ/MM/AAAA ». */
  updated?: string;
  image_url?: string;
  featured?: boolean;
  content?: string;
}

export function getAllArticles(): Article[] {
  const files = fs.readdirSync(contentDir);
  return files
    .filter(f => f.endsWith('.mdx'))
    .map(filename => {
      const raw = fs.readFileSync(path.join(contentDir, filename), 'utf-8');
      const { data } = matter(raw);
      const slug = data.slug || filename.replace('.mdx', '');
      assertAuthor(filename, slug, data.author);
      return {
        title: '',
        excerpt: '',
        tag: '',
        author: '',
        read_time: '5',
        date: '2026-01-01',
        ...data,
        slug,
      } as Article;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getFeaturedArticles(): Article[] {
  return getAllArticles().filter(a => a.featured);
}

export function getArticleBySlug(slug: string): Article | null {
  const files = fs.readdirSync(contentDir);
  const file = files.find(f => f === `${slug}.mdx`);
  if (!file) return null;
  const raw = fs.readFileSync(path.join(contentDir, file), 'utf-8');
  const { data, content } = matter(raw);
  assertAuthor(file, slug, data.author);
  return {
    title: '',
    excerpt: '',
    tag: '',
    author: '',
    read_time: '5',
    date: '2026-01-01',
    ...data,
    slug,
    content,
  } as Article;
}

const METIER_TAGS = new Set([
  'architecte',
  'assistant',
  'comptable',
  'commercial',
  'consultant',
  'contrôleur financier',
  'développeur',
  'enseignant',
  'graphiste',
  'journaliste',
  'juriste',
  'management',
  'médecin',
  'notaire',
  'ressources humaines',
  'traducteur',
]);

export function isMetierArticle(article: Article): boolean {
  return METIER_TAGS.has(article.tag.toLowerCase());
}

export function getMetierArticles(): Article[] {
  return getAllArticles().filter(isMetierArticle);
}

export function getRelatedArticles(article: Article, limit = 4): Article[] {
  const all = getAllArticles();
  const tag = article.tag.toLowerCase();
  const sameTag = all.filter(
    a => a.slug !== article.slug && a.tag.toLowerCase() === tag
  );

  if (sameTag.length >= 2 || !article.category) {
    return sameTag.slice(0, limit);
  }

  const usedSlugs = new Set(sameTag.map(a => a.slug));
  const sameCategory = all.filter(
    a => a.slug !== article.slug && a.category === article.category && !usedSlugs.has(a.slug)
  );

  return [...sameTag, ...sameCategory].slice(0, limit);
}

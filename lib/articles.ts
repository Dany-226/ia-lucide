import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'content');

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  author: string;
  read_time: string;
  date: string;
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
      return {
        title: '',
        excerpt: '',
        tag: '',
        author: '',
        read_time: '5',
        date: '2026-01-01',
        ...data,
        slug: data.slug || filename.replace('.mdx', ''),
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
  return getAllArticles()
    .filter(a => a.slug !== article.slug && a.tag === article.tag)
    .slice(0, limit);
}

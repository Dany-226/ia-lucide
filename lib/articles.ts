import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'content');

export function getAllArticles() {
  const files = fs.readdirSync(contentDir);
  return files
    .filter(f => f.endsWith('.mdx'))
    .map(filename => {
      const raw = fs.readFileSync(path.join(contentDir, filename), 'utf-8');
      const { data } = matter(raw);
      return { ...data, slug: data.slug || filename.replace('.mdx', '') };
    })
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getArticleBySlug(slug: string) {
  const files = fs.readdirSync(contentDir);
  const file = files.find(f => f === `${slug}.mdx`);
  if (!file) return null;
  const raw = fs.readFileSync(path.join(contentDir, file), 'utf-8');
  const { data, content } = matter(raw);
  return { ...data, slug, content };
}

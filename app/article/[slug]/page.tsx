import { getAllArticles, getArticleBySlug } from '@/lib/articles';
import { notFound } from 'next/navigation';
import { remark } from 'remark';
import html from 'remark-html';

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((a: any) => ({ slug: a.slug }));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();
  const processed = await remark().use(html).process((article as any).content);
  const contentHtml = processed.toString();
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">{(article as any).title}</h1>
      <p className="text-gray-500 mb-8">{(article as any).excerpt}</p>
      <article className="prose prose-gray max-w-none" dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </main>
  );
}

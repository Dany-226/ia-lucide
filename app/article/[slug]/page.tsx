import { getAllArticles, getArticleBySlug, getRelatedArticles } from '@/lib/articles';
import { notFound } from 'next/navigation';
import { remark } from 'remark';
import html from 'remark-html';
import Link from 'next/link';
import ArticleSidebar from '@/components/ArticleSidebar';

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map(a => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: `${article.title} : Guide 2026 | ialucide`,
    description: (article.excerpt || '').slice(0, 155),
    alternates: {
      canonical: `https://ialucide.fr/article/${slug}/`,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.image_url ? [article.image_url] : [],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const processed = await remark().use(html).process(article.content ?? '');
  const contentHtml = processed.toString();

  const related = getRelatedArticles(article);
  const allRecent = getAllArticles().filter(a => a.slug !== slug).slice(0, 3);
  const sameTagArticles = related.slice(0, 3);
  const sidebarArticles = related.length > 0 ? related : allRecent;

  const formattedDate = article.date
    ? new Date(article.date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <div className="pt-24 md:pt-32 pb-20 bg-[#fcf9f0] min-h-screen">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Back link */}
        <Link
          href="/"
          className="font-mono inline-flex items-center gap-2 mb-12 text-xs font-bold tracking-[0.1em] uppercase text-[#6b6b6b] hover:text-[#1c1c17] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M8 2L3 7L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Retour
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 lg:gap-16">
          {/* ── Main article ── */}
          <article>
            {/* Header */}
            <header className="mb-12 md:mb-16">
              {/* Tag — Label-MD */}
              <span className="font-mono inline-block text-xs font-bold tracking-[0.1em] uppercase text-[#c9a84c] bg-[#1c1c17] px-3 py-1.5 mb-6">
                {article.tag}
              </span>
              {/* Article headline — Headline-MD scale, Space Grotesk 700 */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1c1c17] leading-[1.05] mb-6" style={{ letterSpacing: '-0.02em' }}>
                {article.title}
              </h1>
              <p className="text-base md:text-lg text-[#1c1c17] leading-relaxed mb-8">
                {article.excerpt}
              </p>
              {/* Label-MD metadata */}
              <div className="font-mono flex flex-wrap items-center gap-4 text-xs font-bold tracking-[0.05em] uppercase text-[#6b6b6b]">
                <span>{article.author || 'Rédaction IA Lucide'}</span>
                <span className="w-1 h-1 bg-[#c9a84c]/40 rounded-full" />
                {formattedDate && <span>{formattedDate}</span>}
                {article.read_time && (
                  <>
                    <span className="w-1 h-1 bg-[#c9a84c]/40 rounded-full" />
                    <span>{article.read_time} min de lecture</span>
                  </>
                )}
              </div>
              <div className="h-px bg-[#c9a84c]/15 mt-8" />
            </header>

            {/* Article body */}
            <div
              className="prose-ia"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />

            {/* Newsletter CTA */}
            <div className="mt-12 bg-[#1a3a4a] px-6 py-8 text-center">
              <span className="font-mono text-xs font-bold tracking-[0.3em] uppercase text-[#c9a84c] block mb-3">
                Newsletter
              </span>
              <p className="text-[1.75rem] font-bold text-white mb-4" style={{ letterSpacing: '-0.02em' }}>
                Rejoignez 500+ professionnels lucides qui domptent l&apos;IA
              </p>
              <p className="text-base text-[#fcf9f0]/70 mb-6">
                Une analyse par semaine. Concrète. Sans bullshit.
              </p>
              <a
                href="https://5f540821.sibforms.com/serve/MUIFAEeWVNhCOvJ0YK2GWiW7rGJ8g3biN7u2pd1jE74wZhs4RWPpsKMe6DCRyUfAtUL6RzsxcxgvzBSIWzIHGexnBr97R55NjLqWhtZvIZqB3zcZCM06gqyCRp-BQtOgmvgqJv2DHSo9o8sK_SeTTAVzJFAcovxwUSXF--E6dN10q_ByVgQpwQvg5twwUGhvL6p-NpsfnjdOAKvYqg=="
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#c9a84c] border border-[#c9a84c] px-8 py-3 hover:bg-[#c9a84c] hover:text-[#1a3a4a] transition-all duration-500"
              >
                S&apos;inscrire gratuitement
              </a>
            </div>

            {/* Ressources CTA */}
            <div className="mt-6 border border-[#c9a84c]/30 bg-white px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-base text-[#1c1c17] leading-relaxed">
                Retrouvez la liste complète des outils validés par{' '}
                <strong className="font-bold">ialucide</strong> sur notre page Ressources.
              </p>
              <Link
                href="/ressources"
                className="font-mono inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#1c1c17] border border-[#1c1c17] px-4 py-2.5 hover:bg-[#1c1c17] hover:text-[#fcf9f0] transition-all duration-500 whitespace-nowrap flex-shrink-0"
              >
                Voir les ressources
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M1 10L10 1M10 1H4M10 1v6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>

            {/* Related articles — même tag (maillage interne SEO) */}
            {(sameTagArticles.length > 0 || allRecent.length > 0) && (
              <div className="mt-16 pt-12 border-t border-[#c9a84c]/20">
                <div className="mb-8">
                  <span className="font-mono text-xs font-bold tracking-[0.3em] uppercase text-[#c9a84c] block mb-2">
                    {sameTagArticles.length > 0 ? `${article.tag}` : 'À lire aussi'}
                  </span>
                  <h2 className="text-[1.75rem] md:text-3xl font-bold text-[#1c1c17]" style={{ letterSpacing: '-0.02em' }}>
                    {sameTagArticles.length > 0
                      ? `Articles du même métier`
                      : 'Articles récents'}
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(sameTagArticles.length > 0 ? sameTagArticles : allRecent).slice(0, 2).map((rel) => (
                    <Link
                      key={rel.slug}
                      href={`/article/${rel.slug}`}
                      className="group border border-[#c9a84c]/15 bg-white p-6 hover:border-[#c9a84c]/40 hover:shadow-[0_2px_32px_rgba(28,28,23,0.08)] transition-all duration-300"
                    >
                      <span className="font-mono inline-block text-xs font-bold tracking-[0.1em] uppercase text-[#c9a84c] bg-[#1c1c17] px-3 py-1.5 mb-4">
                        {rel.tag}
                      </span>
                      <h3 className="text-[1.375rem] font-bold text-[#1c1c17] mb-3 group-hover:text-[#c9a84c] transition-colors duration-300 leading-snug" style={{ letterSpacing: '-0.02em' }}>
                        {rel.title}
                      </h3>
                      <p className="text-base text-[#6b6b6b] mb-4 leading-relaxed">
                        {rel.excerpt}
                      </p>
                      <span className="font-mono inline-flex items-center gap-1 text-xs font-bold tracking-widest uppercase text-[#1c1c17] hover:text-[#c9a84c] transition-colors">
                        Lire la suite →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* ── Sidebar ── */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <ArticleSidebar relatedArticles={sidebarArticles} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

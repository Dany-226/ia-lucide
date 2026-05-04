import type { Metadata } from 'next';
import { getAllArticles } from '@/lib/articles';
import ArticleCard from '@/components/ArticleCard';

export const metadata: Metadata = {
  title: 'Meilleurs outils IA professionnels 2026 — Comparatifs honnêtes | ialucide',
  description: 'Comparatifs et avis sur les outils IA pour juristes, comptables et développeurs. Sans langue de bois.',
  alternates: { canonical: 'https://ialucide.fr/outils/' },
  openGraph: {
    description: 'Comparatifs et avis sur les outils IA pour juristes, comptables et développeurs. Sans langue de bois.',
  },
  twitter: {
    description: 'Comparatifs et avis sur les outils IA pour juristes, comptables et développeurs. Sans langue de bois.',
  },
};

const OUTILS_TAGS = new Set(['juriste', 'comptable', 'développeur']);

export default function OutilsPage() {
  const articles = getAllArticles().filter(a => {
    const tag = a.tag.toLowerCase();
    const slug = a.slug.toLowerCase();
    return OUTILS_TAGS.has(tag) && (slug.includes('outils') || slug.includes('comparatif'));
  });

  return (
    <>
      <section className="pt-32 pb-16 bg-[#1c1c17]">
        <div className="max-w-4xl mx-auto px-5 md:px-8 text-center">
          <span className="font-mono text-xs font-bold tracking-[0.4em] uppercase text-[#c9a84c] mb-6 block">
            Comparatifs &amp; avis
          </span>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#fcf9f0] leading-tight mb-6"
            style={{ letterSpacing: '-0.02em' }}
          >
            Outils IA professionnels
          </h1>
          <p className="text-base text-[#6b6b6b] max-w-xl mx-auto leading-relaxed">
            Comparatifs et avis sur les outils IA pour juristes, comptables et développeurs. Sans langue de bois.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-[#fcf9f0]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="flex items-center gap-6 mb-12 md:mb-16">
            <div className="h-px flex-1 bg-[#c9a84c]/20" />
            <h2 className="font-mono text-xs font-bold tracking-[0.4em] uppercase text-[#c9a84c]">
              {articles.length} comparatif{articles.length > 1 ? 's' : ''}
            </h2>
            <div className="h-px flex-1 bg-[#c9a84c]/20" />
          </div>

          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {articles.map(article => (
                <ArticleCard key={article.slug} {...article} />
              ))}
            </div>
          ) : (
            <p className="text-center text-[#6b6b6b] font-mono text-sm">Aucun article pour le moment.</p>
          )}
        </div>
      </section>
    </>
  );
}

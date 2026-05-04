import type { Metadata } from 'next';
import { getAllArticles } from '@/lib/articles';
import ArticleCard from '@/components/ArticleCard';

export const metadata: Metadata = {
  title: "Comprendre l'IA — Analyses sans jargon | ialucide",
  description: "Analyses factuelles sur l'impact de l'IA sur le travail, les licenciements, la souveraineté des données.",
  alternates: { canonical: 'https://ialucide.fr/comprendre/' },
  openGraph: {
    description: "Analyses factuelles sur l'impact de l'IA sur le travail, les licenciements, la souveraineté des données.",
  },
  twitter: {
    description: "Analyses factuelles sur l'impact de l'IA sur le travail, les licenciements, la souveraineté des données.",
  },
};

export default function ComprendrePage() {
  const articles = getAllArticles().filter(a => a.category === 'comprendre');

  return (
    <>
      <section className="pt-32 pb-16 bg-[#1c1c17]">
        <div className="max-w-4xl mx-auto px-5 md:px-8 text-center">
          <span className="font-mono text-xs font-bold tracking-[0.4em] uppercase text-[#c9a84c] mb-6 block">
            Analyses &amp; perspectives
          </span>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#fcf9f0] leading-tight mb-6"
            style={{ letterSpacing: '-0.02em' }}
          >
            Comprendre l&apos;IA
          </h1>
          <p className="text-base text-[#6b6b6b] max-w-xl mx-auto leading-relaxed">
            Analyses factuelles sur l&apos;impact de l&apos;IA sur le travail, les licenciements, la souveraineté des données.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-[#fcf9f0]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="flex items-center gap-6 mb-12 md:mb-16">
            <div className="h-px flex-1 bg-[#c9a84c]/20" />
            <h2 className="font-mono text-xs font-bold tracking-[0.4em] uppercase text-[#c9a84c]">
              {articles.length} analyse{articles.length > 1 ? 's' : ''}
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

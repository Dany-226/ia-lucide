import Link from 'next/link';
import Image from 'next/image';
import { getAllArticles } from '@/lib/articles';
import ArticleCard from '@/components/ArticleCard';

export default function Home() {
  const articles = getAllArticles();

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#0e0e0e]" />

        {/* Grain texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Vertical gold line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-[#c9a84c]/40 to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto px-5 text-center">
          <div className="animate-fade-in-up">
            <span
              className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-[#c9a84c] mb-6 block"
            >
              Média indépendant
            </span>
          </div>

          <h1
            className="animate-fade-in-up animate-delay-1 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black italic leading-[0.95] tracking-tight text-[#f4f0e8] mb-8"
          >
            Voir l&apos;IA
            <br />
            <span className="text-[#c9a84c]">sans illusions</span>
          </h1>

          <p
            className="animate-fade-in-up animate-delay-2 text-base md:text-lg text-[#6b6b6b] max-w-xl mx-auto mb-12 leading-relaxed"
          >
            Analyses, enquêtes et perspectives sur la transformation des métiers
            par l&apos;intelligence artificielle. Sans jargon, sans fantasme.
          </p>

          <div className="animate-fade-in-up animate-delay-3 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#articles"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#0e0e0e] transition-all duration-500 text-xs tracking-widest uppercase"
            >
              Lire les derniers articles
            </a>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-[#6b6b6b]/30 text-[#6b6b6b] hover:border-[#f4f0e8]/50 hover:text-[#f4f0e8] transition-all duration-500 text-xs tracking-widest uppercase"
            >
              Notre mission
            </Link>
          </div>
        </div>

        {/* Scroll arrow */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-[#c9a84c]/40">
            <path d="M9 3v12M4 11l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </section>

      {/* ── Articles Grid ── */}
      <section id="articles" className="py-20 md:py-28 bg-[#f4f0e8]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          {/* Section header */}
          <div className="flex items-center gap-6 mb-12 md:mb-16">
            <div className="h-px flex-1 bg-[#c9a84c]/20" />
            <h2
              className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-[#c9a84c]"
            >
              Derniers articles
            </h2>
            <div className="h-px flex-1 bg-[#c9a84c]/20" />
          </div>

          {/* Featured article — full width */}
          {articles.length > 0 && (
            <div className="mb-8">
              <Link href={`/article/${articles[0].slug}`} className="group block">
                <article className="bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] hover:border-t-2 hover:border-t-[#c9a84c] transition-all duration-500 hover:-translate-y-1">
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    {articles[0].image_url && (
                      <div className="relative overflow-hidden" style={{ minHeight: '300px' }}>
                        <Image
                          src={articles[0].image_url}
                          alt={articles[0].title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          priority
                        />
                        <div className="absolute inset-0 bg-[#0e0e0e]/25 group-hover:bg-[#0e0e0e]/10 transition-all duration-500" />
                        <div className="absolute top-4 left-4">
                          <span
                            className="text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 bg-[#0e0e0e]/80 text-[#c9a84c] border border-[#c9a84c]/30"
                          >
                            {articles[0].tag}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="p-8 md:p-10 flex flex-col justify-center space-y-4">
                      <h3
                        className="text-2xl md:text-3xl font-bold text-[#0e0e0e] leading-tight group-hover:text-[#c9a84c] transition-colors duration-300"
                      >
                        {articles[0].title}
                      </h3>
                      <p
                        className="text-base text-[#6b6b6b] leading-relaxed line-clamp-3"
                      >
                        {articles[0].excerpt}
                      </p>
                      <div className="flex items-center gap-3 pt-2">
                        <span
                          className="text-[10px] tracking-wider text-[#6b6b6b] uppercase"
                        >
                          {articles[0].author || 'Rédaction'}
                        </span>
                        <span className="w-1 h-1 bg-[#c9a84c]/40 rounded-full" />
                        <span
                          className="text-[10px] tracking-wider text-[#6b6b6b]"
                        >
                          {articles[0].read_time} min de lecture
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            </div>
          )}

          {/* Rest of articles grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {articles.slice(1).map((article, i) => (
              <ArticleCard key={article.slug} {...article} />
            ))}
          </div>
        </div>
      </section>

      {/* ── ailucide.com Promo ── */}
      <section className="py-20 bg-[#1a3a4a]">
        <div className="max-w-3xl mx-auto px-5 md:px-8 text-center">
          <span
            className="font-mono text-[10px] tracking-[0.4em] uppercase text-[#c9a84c] mb-6 block"
          >
            Pour les cadres et dirigeants
          </span>
          <h2
            className="font-playfair text-3xl sm:text-4xl md:text-5xl font-black not-italic text-white mb-6 leading-tight"
          >
            Mesurez votre exposition à l&apos;IA en 10 minutes.
          </h2>
          <p
            className="font-source text-base md:text-lg text-[#f4f0e8] mb-10 leading-relaxed max-w-2xl mx-auto"
            style={{ fontWeight: 300 }}
          >
            Diagnostic patrimonial et professionnel gratuit — méthode utilisée par des profils à hauts revenus.
          </p>
          <a
            href="https://ailucide.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-[#c9a84c] text-[#c9a84c] font-mono hover:bg-[#c9a84c] hover:text-[#1a3a4a] transition-all duration-500 text-xs tracking-widest uppercase"
          >
            Faire mon diagnostic
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7H11M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section id="newsletter" className="py-20 bg-[#f4f0e8]">
        <div className="max-w-2xl mx-auto px-5 md:px-8 text-center">
          <span
            className="text-[10px] tracking-[0.4em] uppercase text-[#c9a84c] mb-4 block"
          >
            Newsletter gratuite
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold text-[#0e0e0e] mb-4"
          >
            Une analyse par semaine.
          </h2>
          <p
            className="text-base text-[#6b6b6b] mb-8 leading-relaxed"
          >
            Concrète. Sans bullshit. Pour les professionnels qui veulent comprendre et agir.
          </p>
          <a
            href="https://newsletter.ialucide.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0e0e0e] text-[#f4f0e8] hover:bg-[#c9a84c] hover:text-[#0e0e0e] transition-all duration-500 text-xs tracking-widest uppercase"
          >
            S&apos;inscrire gratuitement
          </a>
        </div>
      </section>
    </>
  );
}

import Link from 'next/link';
import type { Article } from '@/lib/articles';

interface ArticleSidebarProps {
  relatedArticles: Article[];
}

export default function ArticleSidebar({ relatedArticles }: ArticleSidebarProps) {
  return (
    <aside className="space-y-8">
      {/* Newsletter mini CTA */}
      <div className="bg-white shadow-md p-6">
        <span
          className="text-[10px] tracking-[0.3em] uppercase text-[#c9a84c] block mb-3"
        >
          Newsletter
        </span>
        <p
          className="text-lg font-semibold text-[#0e0e0e] mb-2"
        >
          Restez lucide
        </p>
        <p
          className="text-xs text-[#6b6b6b] mb-4"
        >
          Une analyse par semaine sur l&apos;IA et les métiers.
        </p>
        <a
          href="https://newsletter.ialucide.fr/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-[10px] tracking-widest uppercase text-[#c9a84c] border-b border-[#c9a84c]/40 hover:border-[#c9a84c] transition-colors pb-0.5"
        >
          S&apos;inscrire →
        </a>
      </div>

      {/* ailucide.com CTA */}
      <div className="bg-[#1a3a4a] p-6">
        <p
          className="text-lg font-semibold text-white mb-2"
        >
          Cadre ou dirigeant ?
        </p>
        <p
          className="text-sm text-[#f4f0e8]/80 mb-4"
        >
          Mesurez votre exposition à l&apos;IA en 10 minutes.
        </p>
        <a
          href="https://ailucide.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-[10px] tracking-widest uppercase text-[#c9a84c] border border-[#c9a84c] px-4 py-2 hover:bg-[#c9a84c] hover:text-[#1a3a4a] transition-all duration-500"
        >
          Faire mon diagnostic
        </a>
      </div>

      {/* Related articles */}
      {relatedArticles.length > 0 && (
        <div className="bg-white shadow-md p-6">
          <span
            className="text-[10px] tracking-[0.3em] uppercase text-[#c9a84c] block mb-6"
          >
            À lire aussi
          </span>
          <div className="space-y-6">
            {relatedArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/article/${article.slug}`}
                className="block group"
              >
                <span
                  className="text-[9px] tracking-wider uppercase text-[#6b6b6b]"
                >
                  {article.tag}
                </span>
                <h4
                  className="text-sm font-semibold text-[#0e0e0e] mt-1 group-hover:text-[#c9a84c] transition-colors duration-300 leading-snug"
                >
                  {article.title}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}

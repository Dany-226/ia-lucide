import Link from 'next/link';
import type { Article } from '@/lib/articles';

interface ArticleSidebarProps {
  relatedArticles: Article[];
}

export default function ArticleSidebar({ relatedArticles }: ArticleSidebarProps) {
  return (
    <aside className="space-y-8">
      {/* Newsletter mini CTA */}
      <div className="bg-white shadow-[0_2px_32px_rgba(28,28,23,0.04)] p-6">
        {/* Label-MD */}
        <span className="font-mono text-xs font-bold tracking-[0.1em] uppercase text-[#c9a84c] block mb-3">
          Newsletter
        </span>
        {/* Title-LG */}
        <p className="text-[1.375rem] font-bold text-[#1c1c17] mb-2" style={{ letterSpacing: '-0.02em' }}>
          Restez lucide
        </p>
        {/* Body-LG */}
        <p className="text-base text-[#6b6b6b] mb-4">
          Une analyse par semaine sur l&apos;IA et les métiers.
        </p>
        <a
          href="https://ialucide.beehiiv.com/subscribe"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono inline-block text-xs font-bold tracking-widest uppercase text-[#c9a84c] border-b border-[#c9a84c]/40 hover:border-[#c9a84c] transition-colors pb-0.5"
        >
          S&apos;inscrire →
        </a>
      </div>

      {/* ailucide.com CTA */}
      <div className="bg-[#1a3a4a] p-6">
        <p className="text-[1.375rem] font-bold text-white mb-2" style={{ letterSpacing: '-0.02em' }}>
          Cadre ou dirigeant ?
        </p>
        <p className="text-base text-[#fcf9f0]/80 mb-4">
          Mesurez votre exposition à l&apos;IA en 10 minutes.
        </p>
        <a
          href="https://ailucide.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono inline-block text-xs font-bold tracking-widest uppercase text-[#c9a84c] border border-[#c9a84c] px-4 py-2 hover:bg-[#c9a84c] hover:text-[#1a3a4a] transition-all duration-500"
        >
          Faire mon diagnostic
        </a>
      </div>

      {/* Related articles */}
      {relatedArticles.length > 0 && (
        <div className="bg-white shadow-[0_2px_32px_rgba(28,28,23,0.04)] p-6">
          <span className="font-mono text-xs font-bold tracking-[0.1em] uppercase text-[#c9a84c] block mb-6">
            À lire aussi
          </span>
          <div className="space-y-6">
            {relatedArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/article/${article.slug}`}
                className="block group"
              >
                <span className="font-mono text-xs font-bold tracking-[0.05em] uppercase text-[#6b6b6b]">
                  {article.tag}
                </span>
                <h4 className="text-base font-bold text-[#1c1c17] mt-1 group-hover:text-[#c9a84c] transition-colors duration-300 leading-snug" style={{ letterSpacing: '-0.01em' }}>
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

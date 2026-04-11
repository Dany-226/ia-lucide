import Link from 'next/link';
import { getAllArticles } from '@/lib/articles';

export default async function Footer() {
  const recentArticles = getAllArticles().slice(0, 5);

  return (
    <footer className="border-t border-[#c9a84c]/15 bg-[#1c1c17]">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
          {/* Logo + tagline */}
          <div className="space-y-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-white.png"
              alt="iALucide"
              style={{ height: '48px', width: 'auto', filter: 'invert(1)' }}
            />
            <p className="text-sm text-[#6b6b6b] leading-relaxed max-w-xs">
              Le regard lucide sur l&apos;IA qui transforme les métiers.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#c9a84c]">
              Navigation
            </h4>
            <div className="space-y-3">
              {[
                { label: 'Articles', href: '/#articles' },
                { label: 'Métiers', href: '/metiers/' },
                { label: 'Ressources', href: '/ressources/' },
                { label: 'À propos', href: '/about/' },
                { label: 'Notre méthodologie', href: '/article/avis-ialucide-ia/' },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block text-sm text-[#6b6b6b] hover:text-[#fcf9f0] transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Articles récents — maillage interne SEO */}
          <div className="space-y-4">
            <h4 className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#c9a84c]">
              Articles récents
            </h4>
            <div className="space-y-3">
              {recentArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/article/${article.slug}/`}
                  className="block text-sm text-[#6b6b6b] hover:text-[#fcf9f0] transition-colors duration-300 leading-snug"
                >
                  {article.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#c9a84c]">
              Contact
            </h4>
            <a
              href="mailto:contact@ialucide.fr"
              className="block text-sm text-[#6b6b6b] hover:text-[#c9a84c] transition-colors duration-300"
            >
              contact@ialucide.fr
            </a>
            <a
              href="https://ailucide.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#6b6b6b] hover:text-[#c9a84c] transition-colors duration-300 mt-2"
            >
              ailucide.com →
            </a>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[#c9a84c]/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-[10px] tracking-wider text-[#6b6b6b] uppercase">
            © 2026 IA Lucide — Tous droits réservés
          </p>
          <p className="text-xs text-[#6b6b6b]/50 italic">
            ialucide.fr
          </p>
        </div>
      </div>
    </footer>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Newsletter — l'IA sans illusions | ialucide",
  description: "Une analyse par semaine sur l'impact réel de l'IA sur les métiers. Lucide, sans évangélisme ni catastrophisme. Inscription gratuite.",
  alternates: {
    canonical: 'https://ialucide.fr/newsletter/',
  },
  openGraph: {
    title: "La newsletter ialucide — l'IA sans illusions",
    description: "Une analyse par semaine sur l'impact réel de l'IA sur les métiers. Lucide, sans évangélisme ni catastrophisme. Inscription gratuite.",
  },
  twitter: {
    card: 'summary_large_image',
    title: "La newsletter ialucide — l'IA sans illusions",
    description: "Une analyse par semaine sur l'impact réel de l'IA sur les métiers. Lucide, sans évangélisme ni catastrophisme. Inscription gratuite.",
  },
};

export default function NewsletterPage() {
  return (
    <div className="pt-28 md:pt-36 pb-24 bg-[#fcf9f0] min-h-screen">
      <div className="max-w-3xl mx-auto px-5 md:px-8">

        {/* Hero */}
        <div className="mb-16 md:mb-20">
          <span className="font-mono text-xs font-bold tracking-[0.4em] uppercase text-[#c9a84c] mb-6 block">
            Newsletter gratuite
          </span>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-black italic text-[#1a3a4a] leading-[1.05] mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            La newsletter ialucide
          </h1>
          <p className="text-xl font-bold text-[#c9a84c] mb-8">
            Une analyse par semaine sur l&apos;IA et les métiers
          </p>
          <div className="h-px bg-[#c9a84c]/15" />
        </div>

        {/* Pitch éditorial */}
        <div className="space-y-6 text-base text-[#1c1c17] leading-[1.85] mb-16">
          <p>
            Chaque semaine, ialucide publie une analyse concrète sur l&apos;impact de l&apos;intelligence artificielle sur un métier, un secteur ou une pratique professionnelle. Pas de promesses. Pas de prophéties de fin du monde. Des faits, des exemples réels, des conclusions actionnables.
          </p>
          <p>
            L&apos;IA transforme le travail — c&apos;est indéniable. Mais ni l&apos;évangélisme tech ("l&apos;IA va tout révolutionner dans six mois") ni le catastrophisme ("votre métier va disparaître") ne vous aident à décider ce que vous devez faire, maintenant, dans votre quotidien professionnel. Cette newsletter existe pour combler cet espace.
          </p>
          <p>
            Elle s&apos;adresse aux professionnels en exercice — comptables, juristes, managers, développeurs, médecins, commerciaux — qui veulent comprendre sans être manipulés, et agir sans panique. Une analyse par semaine. Lucide. Sans bullshit.
          </p>
        </div>

        {/* CTA principal */}
        <div className="mb-10">
          <a
            href="https://ialucide.beehiiv.com/subscribe"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono inline-flex items-center justify-center gap-2 w-full sm:w-auto px-10 py-4 bg-[#1a3a4a] text-[#fcf9f0] hover:bg-[#c9a84c] hover:text-[#1a3a4a] transition-all duration-500 text-xs font-bold tracking-widest uppercase"
          >
            S&apos;inscrire gratuitement
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7H11M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

        {/* Anciens numéros */}
        <div className="mb-16 border border-[#c9a84c]/20 bg-white p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-base text-[#1c1c17] leading-relaxed">
            Consultez les analyses déjà publiées avant de vous inscrire.
          </p>
          <a
            href="https://ialucide.beehiiv.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#1c1c17] border border-[#1c1c17] px-5 py-2.5 hover:bg-[#1c1c17] hover:text-[#fcf9f0] transition-all duration-500 whitespace-nowrap flex-shrink-0"
          >
            Voir les anciens numéros
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M1 10L10 1M10 1H4M10 1v6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

        {/* RGPD */}
        <div className="h-px bg-[#c9a84c]/15 mb-10" />
        <p className="font-mono text-xs text-[#6b6b6b] tracking-wider leading-relaxed">
          Désinscription en un clic. Vos données sont traitées par Beehiiv conformément à notre{' '}
          <Link href="/politique-confidentialite/" className="text-[#c9a84c] hover:underline">
            politique de confidentialité
          </Link>.
        </p>

      </div>
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { jsonLdHtml, pageMetadata, webPageJsonLd } from '@/lib/seo';
import { DIAGNOSTIC_ROBOTS, getDiagData } from '@/lib/diagnostic-data';
import Parcours from '@/components/diagnostic/Parcours';

// « Où passe la ligne », diagnostic v2 (spec docs/spec-diagnostic-exposition-v2.md, locale).
// L'URL /diagnostic-exposition-ia/ est conservée pour son historique dans la Search Console.
const PATH = '/diagnostic-exposition-ia/';
const PAGE_DESCRIPTION =
  "Choisissez votre poste et vos tâches : d'après les données de l'OIT, voyez lesquelles ont un potentiel élevé, partiel ou faible pour l'IA générative.";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: 'Où passe la ligne',
    description: PAGE_DESCRIPTION,
    path: PATH,
    robots: DIAGNOSTIC_ROBOTS,
  });
}

export default function OuPasseLaLignePage() {
  const data = getDiagData();
  const jsonLd = webPageJsonLd({ name: 'Où passe la ligne', description: PAGE_DESCRIPTION, path: PATH });
  return (
    <div className="bg-[#fcf9f0] min-h-screen pt-24 md:pt-32 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(jsonLd) }} />
      <div className="max-w-5xl mx-auto px-5 md:px-8">
        <header className="mb-12 md:mb-16 max-w-3xl">
          <span className="font-mono text-xs font-bold tracking-[0.3em] uppercase text-[#8a6a1c] block mb-4">
            D&apos;après les données de l&apos;OIT
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#1c1c17] leading-[1.05] mb-4" style={{ letterSpacing: '-0.02em' }}>
            Où passe la ligne
          </h1>
          <p className="text-xl md:text-2xl text-[#1c1c17] leading-snug mb-6">{data.textes['outil.sous_titre']}</p>
          <p className="text-base text-[#6b6b6b] leading-relaxed">
            {data.textes['outil.intro']}{' '}
            <Link href="/methodologie-exposition-ia/" className="text-[#8a6a1c] underline underline-offset-2">La méthode est publique.</Link>
          </p>
        </header>
        <Parcours data={data} />
      </div>
    </div>
  );
}

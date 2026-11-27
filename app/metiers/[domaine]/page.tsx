import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { absoluteUrl, jsonLdHtml, pageMetadata, webPageJsonLd, ORGANIZATION_ID, SITE_NAME } from '@/lib/seo';
import { DIAGNOSTIC_ROBOTS, getDomaines, texte } from '@/lib/diagnostic-data';
import { BANDES } from '@/lib/diagnostic-calcul';
import { COULEUR_BANDE, PastilleBande, minusculeInitiale, remplir } from '@/components/diagnostic/commun';

// Pages de domaine du diagnostic v2 (spec §9) : comparaison des postes d'un domaine d'après
// les JSON de data/metiers/, lien vers l'outil avec le domaine présélectionné. Signées
// « La rédaction ialucide ». Le hub /metiers/ (app/metiers/page.tsx) n'est pas modifié ici.
export const dynamicParams = false;

export function generateStaticParams() {
  return getDomaines().map((d) => ({ domaine: d.slug }));
}

const fr = (x: number) => x.toFixed(2).replace('.', ',');
const LIEN = 'text-[#8a6a1c] underline underline-offset-2 hover:text-[#1c1c17]';

function trouver(slug: string) {
  return getDomaines().find((d) => d.slug === slug);
}

function titreDe(libelle: string) {
  const base = `${libelle} : l'IA poste par poste (OIT)`;
  const avecMarque = `${base} | ${SITE_NAME}`;
  return avecMarque.length <= 60 ? avecMarque : base;
}

function descriptionDe(d: NonNullable<ReturnType<typeof trouver>>) {
  const postes = d.postes.map((p) => p.libelle.split(' / ')[0]).join(', ');
  const s = `${d.libelle} : ${postes}. Catégorie d'exposition à l'IA générative et tâches de chaque poste, d'après les données de l'OIT.`;
  if (s.length <= 155) return s;
  const cut = s.slice(0, 155);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:]$/, '');
}

export async function generateMetadata({ params }: { params: Promise<{ domaine: string }> }): Promise<Metadata> {
  const { domaine } = await params;
  const d = trouver(domaine);
  if (!d) return {};
  return pageMetadata({
    absoluteTitle: titreDe(d.libelle),
    description: descriptionDe(d),
    path: `/metiers/${d.slug}/`,
    robots: DIAGNOSTIC_ROBOTS,
  });
}

export default async function DomainePage({ params }: { params: Promise<{ domaine: string }> }) {
  const { domaine } = await params;
  const d = trouver(domaine);
  if (!d) notFound();

  const path = `/metiers/${d.slug}/`;
  const maj = d.postes.map((p) => p.maj).sort().at(-1) ?? '';
  const tries = [...d.postes].sort((a, b) => b.mu - a.mu);
  const comparaison =
    d.postes.length >= 2
      ? remplir(texte('domaine.comparaison'), {
          plus: tries[0].libelle,
          moins: tries[tries.length - 1].libelle,
          cat_plus: minusculeInitiale(texte(`categorie.${tries[0].code}.libelle`)),
          cat_moins: minusculeInitiale(texte(`categorie.${tries[tries.length - 1].code}.libelle`)),
        })
      : null;

  const jsonLd = [
    {
      ...webPageJsonLd({ name: titreDe(d.libelle).replace(` | ${SITE_NAME}`, ''), description: descriptionDe(d), path }),
      author: { '@id': ORGANIZATION_ID },
      ...(maj ? { dateModified: maj } : {}),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Métiers', item: absoluteUrl('/metiers/') },
        { '@type': 'ListItem', position: 2, name: d.libelle, item: absoluteUrl(path) },
      ],
    },
  ];

  return (
    <div className="bg-[#fcf9f0] min-h-screen pt-24 md:pt-32 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(jsonLd) }} />
      <div className="max-w-5xl mx-auto px-5 md:px-8">
        <nav aria-label="Fil d'Ariane" className="font-mono text-xs tracking-[0.1em] uppercase text-[#6b6b6b] mb-6">
          <Link href="/metiers/" className="hover:text-[#1c1c17]">Métiers</Link> / <span>{d.libelle}</span>
        </nav>

        <header className="mb-12 max-w-3xl">
          <span className="font-mono text-xs font-bold tracking-[0.3em] uppercase text-[#8a6a1c] block mb-4">D&apos;après les données de l&apos;OIT</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#1c1c17] leading-[1.05] mb-6" style={{ letterSpacing: '-0.02em' }}>
            {d.libelle} : l&apos;IA poste par poste
          </h1>
          <p className="text-lg text-[#1c1c17] leading-relaxed mb-4">{d.description}</p>
          {comparaison && <p className="text-lg text-[#1c1c17] leading-relaxed mb-4">{comparaison}</p>}
          <p className="font-mono text-xs tracking-[0.1em] uppercase text-[#6b6b6b]">
            La rédaction ialucide{maj && <> · Données mises à jour le <time dateTime={maj}>{maj.split('-').reverse().join('/')}</time></>}
          </p>
        </header>

        {/* Comparaison des postes */}
        <section aria-labelledby="comparaison" className="mb-14">
          <h2 id="comparaison" className="text-[1.75rem] font-bold text-[#1c1c17] mb-5">Les postes comparés</h2>
          <div className="overflow-x-auto bg-white">
            <table className="w-full">
              <thead>
                <tr>
                  {['Poste', 'Catégorie OIT', 'Score moyen', ...BANDES.map((b) => texte(`bande.${b}.libelle`))].map((h) => (
                    <th key={h} className="text-left font-mono text-xs font-bold tracking-[0.1em] uppercase text-[#6b6b6b] px-4 py-3 align-bottom">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tries.map((p) => (
                  <tr key={p.slug}>
                    <td className="px-4 py-3 text-base font-bold text-[#1c1c17] border-t border-[#1c1c17]/10"><a href={`#${p.slug}`} className="hover:text-[#8a6a1c]">{p.libelle}</a></td>
                    <td className="px-4 py-3 text-sm text-[#1c1c17] border-t border-[#1c1c17]/10">
                      {texte(`categorie.${p.code}.libelle`)}
                      <span lang="en" className="block text-xs text-[#6b6b6b]">{p.categorie}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-sm text-[#1c1c17] border-t border-[#1c1c17]/10">{fr(p.mu)}</td>
                    {BANDES.map((b) => (
                      <td key={b} className="px-4 py-3 font-mono text-sm text-[#1c1c17] border-t border-[#1c1c17]/10">
                        {p.taches.filter((x) => x.bande === b).length}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-[#6b6b6b] leading-relaxed mt-3">
            Score moyen : moyenne des scores des tâches du poste (0 à 1), publiée par l&apos;OIT. Colonnes de droite : nombre de tâches retenues par bande. {texte('bande.note')}
          </p>
          <div className="mt-8">
            <Link
              href={`/diagnostic-exposition-ia/?d=${d.slug}`}
              className="font-mono inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#fcf9f0] bg-[#1a3a4a] border border-[#1a3a4a] px-8 py-4 hover:bg-[#1c1c17] transition-colors duration-300"
            >
              Voir où passe la ligne dans mon poste
            </Link>
          </div>
        </section>

        {/* Détail par poste */}
        {tries.map((p) => (
          <section key={p.slug} id={p.slug} aria-labelledby={`titre-${p.slug}`} className="mb-14 scroll-mt-28">
            <h2 id={`titre-${p.slug}`} className="text-[1.75rem] font-bold text-[#1c1c17] mb-1">{p.libelle}</h2>
            <p className="font-mono text-xs tracking-[0.1em] uppercase text-[#6b6b6b] mb-4">
              ISCO-08 {p.isco08} (<span lang="en">{p.iscoTitre}</span>) · {texte(`categorie.${p.code}.libelle`)} · μ {fr(p.mu)}, σ {fr(p.sd)}
            </p>
            <p className="text-base text-[#1c1c17] leading-relaxed mb-2 max-w-3xl">{p.description}</p>
            <p className="text-base text-[#6b6b6b] leading-relaxed mb-2 max-w-3xl">{texte(`categorie.${p.code}.explication`)}</p>
            {p.note && <p className="text-base text-[#6b6b6b] leading-relaxed mb-2 max-w-3xl">{p.note}</p>}
            <ul className="mt-5 bg-white divide-y divide-[#1c1c17]/10">
              {[...p.taches].sort((a, b) => b.score - a.score).map((x) => (
                <li key={x.id} className="px-5 py-4" style={{ borderLeft: `4px solid ${COULEUR_BANDE[x.bande]}` }}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-base text-[#1c1c17] leading-snug">{x.fr}</p>
                    <span className="inline-flex items-center gap-3">
                      <PastilleBande bande={x.bande} libelle={texte(`bande.${x.bande}.libelle`)} />
                      <span className="font-mono text-xs text-[#6b6b6b]">{fr(x.score)}</span>
                    </span>
                  </div>
                  {x.adaptation && <p className="text-xs text-[#6b6b6b] mt-1">Libellé adapté par ialucide : {x.adaptation}</p>}
                  <details className="mt-1">
                    <summary className="text-xs text-[#8a6a1c] cursor-pointer">Texte d&apos;origine (OIT)</summary>
                    <p lang="en" className="text-xs text-[#6b6b6b] leading-relaxed mt-1">{x.en}</p>
                  </details>
                </li>
              ))}
            </ul>
          </section>
        ))}

        {d.articles.length > 0 && (
          <section aria-labelledby="analyses" className="mb-14">
            <h2 id="analyses" className="text-[1.75rem] font-bold text-[#1c1c17] mb-4">Nos analyses</h2>
            <ul className="space-y-2">
              {d.articles.map((a) => (
                <li key={a.slug}><Link href={`/article/${a.slug}/`} className={LIEN}>{a.titre}</Link></li>
              ))}
            </ul>
          </section>
        )}

        <section aria-label="Avertissement" className="border-t border-[#1c1c17]/15 pt-6 max-w-3xl">
          <p className="text-base text-[#1c1c17] leading-relaxed">{texte('avertissement')}</p>
          <p className="text-sm text-[#6b6b6b] leading-relaxed mt-2">
            {texte('avertissement.source')}{' '}
            <Link href="/methodologie-exposition-ia/" className={LIEN}>Méthodologie complète</Link>
          </p>
        </section>
      </div>
    </div>
  );
}

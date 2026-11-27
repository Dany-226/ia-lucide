import type { Metadata } from 'next';
import Link from 'next/link';
import { jsonLdHtml, pageMetadata, webPageJsonLd, SITE_URL } from '@/lib/seo';
import { DIAGNOSTIC_ROBOTS, getMethodologie, texte } from '@/lib/diagnostic-data';
import { CODES_CATEGORIE } from '@/lib/diagnostic-types';
import { minusculeInitiale } from '@/components/diagnostic/commun';

// Méthodologie publique du diagnostic « Où passe la ligne » (spec §1.6, §2 et §9).
// Signée Daniel Rollin. Tableaux des postes, des tâches écartées et des adaptations générés
// depuis data/metiers/. Jamais le logo de l'OIT, jamais « diagnostic OIT ».
const PATH = '/methodologie-exposition-ia/';
const PAGE_DESCRIPTION =
  "Source, licence, seuils de l'OIT, tâches écartées et adaptées, limites : comment fonctionne l'outil « Où passe la ligne » et ce qu'il ne mesure pas.";

const CITATION =
  'Gmyrek, P., Berg, J., Kamiński, K., Konopczyński, F., Ładna, A., Nafradi, B., Rosłaniec, K., Troszyński, M. 2025. Generative AI and Jobs: A Refined Global Index of Occupational Exposure. ILO Working Paper 140. Genève : Bureau international du Travail. © OIT.';

// Texte anglais repris du README du dépôt de l'OIT (data/source/README-OIT.md).
const CLAUSE_TRADUCTION_EN =
  'This is a translation of a copyrighted work of the International Labour Organization (ILO). This translation has not been prepared, reviewed or endorsed by the ILO and should not be considered an official ILO translation. The ILO disclaims all responsibility for its content and accuracy. Responsibility rests solely with the author(s) of the translation.';
const CLAUSE_TRADUCTION_FR =
  "Ceci est une traduction d'une œuvre protégée par le droit d'auteur de l'Organisation internationale du Travail (OIT). Cette traduction n'a été ni préparée, ni revue, ni approuvée par l'OIT et ne doit pas être considérée comme une traduction officielle de l'OIT. L'OIT décline toute responsabilité quant à son contenu et à son exactitude. La responsabilité en incombe exclusivement à l'auteur ou aux auteurs de la traduction.";
const CLAUSE_ADAPTATION_EN =
  'This is an adaptation of a copyrighted work of the International Labour Organization (ILO). This adaptation has not been prepared, reviewed or endorsed by the ILO and should not be considered an official ILO adaptation. The ILO disclaims all responsibility for its content and accuracy. Responsibility rests solely with the author(s) of the adaptation.';
const CLAUSE_ADAPTATION_FR =
  "Ceci est une adaptation d'une œuvre protégée par le droit d'auteur de l'Organisation internationale du Travail (OIT). Cette adaptation n'a été ni préparée, ni revue, ni approuvée par l'OIT et ne doit pas être considérée comme une adaptation officielle de l'OIT. L'OIT décline toute responsabilité quant à son contenu et à son exactitude. La responsabilité en incombe exclusivement à l'auteur ou aux auteurs de l'adaptation.";

const SEUILS: { categorie: string; condition: string }[] = [
  { categorie: 'Exposed: Gradient 4', condition: 'μ ≥ 0,6 et μ − σ ≥ 0,5' },
  { categorie: 'Exposed: Gradient 3', condition: '0,5 ≤ μ < 0,6 et μ + σ ≥ 0,5' },
  { categorie: 'Exposed: Gradient 2', condition: '0,4 ≤ μ < 0,5 et μ + σ ≥ 0,5' },
  { categorie: 'Exposed: Gradient 1', condition: 'μ < 0,4 et μ + σ ≥ 0,5' },
  { categorie: 'Minimal Exposure', condition: 'μ < 0,5 et μ + σ > 0,4, hors gradients' },
  { categorie: 'Not Exposed', condition: 'aucune des conditions précédentes' },
];

const JOURNAL: { date: string; texte: string }[] = [
  {
    date: '26/11/2026',
    texte:
      "Téléchargement du fichier de l'OIT (version publiée sur GitHub), vérification des seuils (ils redonnent la catégorie publiée pour 423 professions sur 427 ; les 4 écarts sont des cas où μ + σ vaut exactement 0,40, un effet d'arrondi), traduction et relecture des tâches des 22 postes.",
  },
];

const fr = (x: number) => x.toFixed(2).replace('.', ',');
const H2 = 'text-[1.75rem] font-bold text-[#1c1c17] mb-5 scroll-mt-28';
const P = 'text-base text-[#1c1c17] leading-relaxed mb-4';
const LIEN = 'text-[#8a6a1c] underline underline-offset-2 hover:text-[#1c1c17]';
const TH = 'text-left font-mono text-xs font-bold tracking-[0.1em] uppercase text-[#6b6b6b] px-3 py-2 align-bottom';
const TD = 'px-3 py-3 text-sm text-[#1c1c17] align-top border-t border-[#1c1c17]/10';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "Méthodologie : l'exposition à l'IA d'après l'OIT",
    description: PAGE_DESCRIPTION,
    path: PATH,
    robots: DIAGNOSTIC_ROBOTS,
  });
}

export default function MethodologiePage() {
  const { postes, ecartees, adaptations } = getMethodologie();
  const maj = postes.map((p) => p.maj).sort().at(-1) ?? '';
  const majFr = maj.split('-').reverse().join('/');
  const fusion = postes.find((p) => p.associes.length > 0);
  const nbRetenues = postes.reduce((a, p) => a + p.taches.length, 0);
  const nbTotal = postes.reduce((a, p) => a + p.nbTaches, 0);

  const jsonLd = {
    ...webPageJsonLd({ name: 'Méthodologie : « Où passe la ligne »', description: PAGE_DESCRIPTION, path: PATH }),
    author: { '@type': 'Person', name: 'Daniel Rollin', url: `${SITE_URL}/about/` },
    ...(maj ? { dateModified: maj } : {}),
  };

  const sommaire = [
    ['mesure', "Ce que mesure l'outil"],
    ['source', 'La source'],
    ['licence', 'Licence et clauses'],
    ['seuils', "Les catégories de l'OIT"],
    ['bandes', 'Les bandes par tâche : une adaptation'],
    ['calcul', 'Le calcul du résultat'],
    ['postes', 'Les postes retenus'],
    ['ecartees', 'Les tâches écartées'],
    ['adaptations', 'Les libellés adaptés'],
    ['limites', 'Les limites reconnues par les auteurs'],
    ['ne-mesure-pas', "Ce que l'outil ne mesure pas"],
    ['journal', 'Journal des mises à jour'],
  ];

  return (
    <div className="bg-[#fcf9f0] min-h-screen pt-24 md:pt-32 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(jsonLd) }} />
      <article className="max-w-3xl mx-auto px-5 md:px-8">
        <header className="mb-12">
          <span className="font-mono text-xs font-bold tracking-[0.3em] uppercase text-[#8a6a1c] block mb-4">Méthodologie</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#1c1c17] leading-[1.05] mb-6" style={{ letterSpacing: '-0.02em' }}>
            Comment fonctionne « Où passe la ligne »
          </h1>
          <p className="font-mono text-xs tracking-[0.1em] uppercase text-[#6b6b6b]">
            Par <Link href="/about/" className={LIEN}>Daniel Rollin</Link>
            {maj && <> · Mis à jour le <time dateTime={maj}>{majFr}</time></>}
          </p>
        </header>

        <nav aria-label="Sommaire" className="bg-white p-6 mb-14">
          <p className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-[#6b6b6b] mb-3">Sommaire</p>
          <ol className="list-decimal pl-5 space-y-1">
            {sommaire.map(([id, titre]) => (
              <li key={id} className="text-sm"><a href={`#${id}`} className={LIEN}>{titre}</a></li>
            ))}
          </ol>
        </nav>

        <section id="mesure" className="mb-14">
          <h2 className={H2}>Ce que mesure l&apos;outil</h2>
          <p className={P}>
            L&apos;outil reprend, poste par poste, les scores publiés par l&apos;Organisation internationale du Travail pour chaque tâche d&apos;une profession. Ces scores vont de 0 (la tâche ne peut pas être réalisée par l&apos;IA générative actuelle) à 1 (elle pourrait l&apos;être entièrement). Ils mesurent un potentiel technique, pas une automatisation observée, et pas davantage une destruction d&apos;emplois : les auteurs le précisent eux-mêmes.
          </p>
          <p className={P}>
            Le résultat affiche d&apos;abord la catégorie que l&apos;OIT attribue au poste, telle qu&apos;elle est publiée. Le reste de la page est une lecture personnalisée : la part de votre temps qui porte sur des tâches à potentiel élevé, partiel ou faible. Aucun pourcentage de risque n&apos;est calculé, et aucune phrase n&apos;est rédigée à la volée par une IA : les textes viennent de modèles fixes, relus.
          </p>
          <p className={P}>
            Dans ces données, l&apos;exposition varie bien plus d&apos;un niveau de poste à l&apos;autre que d&apos;une tâche à l&apos;autre au sein d&apos;un même poste. Un aide-comptable a un score moyen de 0,64, un comptable de 0,51. C&apos;est pourquoi l&apos;outil demande d&apos;abord le poste, puis le temps passé sur chaque tâche.
          </p>
        </section>

        <section id="source" className="mb-14">
          <h2 className={H2}>La source</h2>
          <p className={P}>{CITATION}{' '}
            <a href="https://doi.org/10.54394/HETP0387" target="_blank" rel="noopener noreferrer" className={LIEN}>https://doi.org/10.54394/HETP0387</a>
          </p>
          <p className={P}>
            Le rapport est en ligne sur{' '}
            <a href="https://www.ilo.org/publications/generative-ai-and-jobs-refined-global-index-occupational-exposure" target="_blank" rel="noopener noreferrer" className={LIEN}>le site de l&apos;OIT</a>
            {' '}(seuils : tableau 5, p. 38 du rapport imprimé), avec{' '}
            <a href="https://www.ilo.org/publications/generative-ai-and-jobs-2025-update" target="_blank" rel="noopener noreferrer" className={LIEN}>une note de synthèse, aussi en français</a>.
            Les données viennent du fichier <code className="font-mono text-sm break-all">Final_Scores_ISCO08_Gmyrek_et_al_2025.xlsx</code>, publié dans{' '}
            <a href="https://github.com/pgmyrek/2025_GenAI_scores_ISCO08" target="_blank" rel="noopener noreferrer" className={LIEN}>le dépôt GitHub des auteurs</a>
            {' '}: 3 265 tâches, 427 professions de la classification internationale ISCO-08.
          </p>
          <p className={P}>
            L&apos;outil utilise le score 2025 de chaque tâche, la moyenne (μ) et l&apos;écart-type (σ) des scores de la profession, et sa catégorie. D&apos;après le dictionnaire des données des auteurs, le score 2025 d&apos;une tâche est la moyenne des prédictions de deux modèles (GPT-4o et Gemini Flash 1.5), sauf pour 46 tâches sur 3 265, dont le score a été fixé après une conciliation par des experts. Les prédictions des modèles et leurs justifications, présentes dans le fichier, ne sont pas utilisées ici.
          </p>
          <p className={P}>
            Un script relit le fichier et produit les données de chaque poste ; aucun score, aucune catégorie n&apos;est saisi à la main. Le site vérifie à chaque mise en ligne que ses données correspondent toujours au fichier de l&apos;OIT.
          </p>
        </section>

        <section id="licence" className="mb-14">
          <h2 className={H2}>Licence et clauses</h2>
          <p className={P}>
            Les données sont publiées sous licence{' '}
            <a href="https://creativecommons.org/licenses/by/4.0/deed.fr" target="_blank" rel="noopener noreferrer" className={LIEN}>Creative Commons Attribution 4.0 (CC BY 4.0)</a>,
            qui autorise leur réutilisation et leur adaptation à condition de citer l&apos;OIT et d&apos;indiquer les modifications. ialucide a traduit les tâches en français, en a écarté certaines, a adapté quelques libellés et applique aux tâches des seuils que l&apos;OIT réserve aux professions. Ces modifications sont décrites sur cette page. L&apos;outil n&apos;est ni réalisé, ni revu, ni approuvé par l&apos;OIT : c&apos;est une lecture d&apos;ialucide, d&apos;après les données de l&apos;OIT.
          </p>
          <p className={P}>Les deux clauses exigées par le dépôt des auteurs sont reproduites ci-dessous. Le texte anglais fait foi ; la version française est une traduction d&apos;ialucide.</p>
          {[
            ['Clause de traduction', CLAUSE_TRADUCTION_EN, CLAUSE_TRADUCTION_FR],
            ["Clause d'adaptation", CLAUSE_ADAPTATION_EN, CLAUSE_ADAPTATION_FR],
          ].map(([titre, en, frTxt]) => (
            <div key={titre} className="bg-white p-6 mb-4" style={{ borderLeft: '4px solid #1a3a4a' }}>
              <h3 className="text-lg font-bold text-[#1c1c17] mb-3">{titre}</h3>
              <p lang="en" className="text-sm text-[#1c1c17] leading-relaxed italic mb-3">{en}</p>
              <p className="text-sm text-[#6b6b6b] leading-relaxed">{frTxt}</p>
            </div>
          ))}
          <p className={P}>
            Conformément à la licence, ni le nom ni l&apos;emblème de l&apos;OIT ne sont utilisés pour désigner l&apos;outil ou laisser penser à un partenariat.
          </p>
        </section>

        <section id="seuils" className="mb-14">
          <h2 className={H2}>Les catégories de l&apos;OIT</h2>
          <p className={P}>
            L&apos;OIT classe chaque profession à partir de la moyenne μ et de l&apos;écart-type σ des scores de ses tâches. La catégorie affichée par l&apos;outil est toujours celle de l&apos;OIT, même quand des tâches sont écartées. Le libellé français est celui d&apos;ialucide.
          </p>
          <div className="overflow-x-auto bg-white mb-4">
            <table className="w-full">
              <thead><tr><th className={TH}>Catégorie OIT</th><th className={TH}>Condition</th><th className={TH}>Libellé ialucide</th></tr></thead>
              <tbody>
                {SEUILS.map((s) => (
                  <tr key={s.categorie}>
                    <td className={TD}><span lang="en">{s.categorie}</span></td>
                    <td className={`${TD} font-mono whitespace-nowrap`}>{s.condition}</td>
                    <td className={TD}>{texte(`categorie.${CODES_CATEGORIE[s.categorie]}.libelle`)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-[#6b6b6b] leading-relaxed">« Non exposé » est un libellé de classement, pas une garantie.</p>
        </section>

        <section id="bandes" className="mb-14">
          <h2 className={H2}>Les bandes par tâche : une adaptation</h2>
          <p className={P}>
            L&apos;OIT classe des professions, pas des tâches. Pour montrer quelles tâches d&apos;un poste sont concernées, ialucide applique aux scores de tâche les mêmes bornes de 0,4 et 0,6. C&apos;est une adaptation, qui n&apos;engage pas l&apos;OIT :
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            {(['eleve', 'partiel', 'faible'] as const).map((b) => (
              <li key={b} className="text-base text-[#1c1c17] leading-relaxed">
                <strong>{texte(`bande.${b}.libelle`)}</strong> : {texte(`bande.${b}.definition`)}
              </li>
            ))}
          </ul>
          <p className={P}>
            Les mots « automatisable », « augmenté » ou « protégé », utilisés dans la première version de l&apos;outil, ont été abandonnés : ils prêtaient à l&apos;étude des conclusions qu&apos;elle ne tire pas. La conclusion générale de l&apos;OIT porte sur la transformation des emplois.
          </p>
        </section>

        <section id="calcul" className="mb-14">
          <h2 className={H2}>Le calcul du résultat</h2>
          <p className={P}>
            Pour chaque tâche retenue du poste, vous indiquez le temps qu&apos;elle occupe : jamais, un peu, une bonne part ou l&apos;essentiel de votre temps, soit un poids de 0, 1, 2 ou 3. La part de chaque bande est la somme des poids de ses tâches divisée par la somme de tous les poids. Les parts sont arrondies à 5 points par la méthode des plus forts restes, pour que leur total fasse toujours 100. Avec moins de deux tâches qui occupent votre temps, aucune répartition n&apos;est affichée, seulement la catégorie du poste.
          </p>
          <p className={P}>
            Les trois questions de contexte (statut, taille de la structure, usage de l&apos;IA) n&apos;entrent pas dans le calcul : elles servent seulement à choisir les pistes proposées. Le calcul se fait dans votre navigateur. Rien n&apos;est enregistré si vous ne vous inscrivez pas, et les tâches cochées ne sont jamais transmises, même en cas d&apos;inscription.
          </p>
        </section>

        <section id="postes" className="mb-14">
          <h2 className={H2}>Les postes retenus</h2>
          <p className={P}>
            {postes.length} postes, {nbRetenues} tâches retenues sur {nbTotal}. Chaque poste correspond à un code ISCO-08 ; quand le code décrit mal le poste en France, c&apos;est dit ci-dessous.
          </p>
          <div className="overflow-x-auto bg-white mb-6">
            <table className="w-full">
              <thead><tr><th className={TH}>Poste</th><th className={TH}>Code ISCO-08</th><th className={TH}>Catégorie OIT</th><th className={TH}>μ / σ</th><th className={TH}>Tâches</th></tr></thead>
              <tbody>
                {postes.map((p) => (
                  <tr key={p.slug}>
                    <td className={TD}>
                      <Link href={`/metiers/${p.domaine}/`} className={LIEN}>{p.libelle}</Link>
                      <span className="block text-xs text-[#6b6b6b]">{p.domaineLibelle}</span>
                    </td>
                    <td className={TD}>{p.isco08}<span lang="en" className="block text-xs text-[#6b6b6b]">{p.iscoTitre}</span></td>
                    <td className={TD}>{texte(`categorie.${p.code}.libelle`)}<span lang="en" className="block text-xs text-[#6b6b6b]">{p.categorie}</span></td>
                    <td className={`${TD} font-mono whitespace-nowrap`}>{fr(p.mu)} / {fr(p.sd)}</td>
                    <td className={`${TD} font-mono`}>{p.taches.length} / {p.nbTaches}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {fusion && (
            <div className="bg-white p-6 mb-4" style={{ borderLeft: '4px solid #c9a84c' }}>
              <h3 className="text-lg font-bold text-[#1c1c17] mb-2">{fusion.libelle} : un poste, deux codes</h3>
              <p className="text-base text-[#1c1c17] leading-relaxed">{fusion.note}</p>
              {fusion.associes.map((a) => (
                <p key={a.isco08} className="text-sm text-[#6b6b6b] mt-2">
                  Code {a.isco08} (<span lang="en">{a.isco_titre}</span>) : μ {fr(a.oit.mu)}, σ {fr(a.oit.sd)}, {minusculeInitiale(texte(`categorie.${CODES_CATEGORIE[a.oit.categorie]}.libelle`))}.
                </p>
              ))}
            </div>
          )}
          <p className={P}>
            Le poste d&apos;analyste financier·ère ou risque correspond au code 2413 (<span lang="en">Financial Analysts</span>). Le risque opérationnel ou assurantiel n&apos;a pas d&apos;équivalent fidèle dans la classification : l&apos;outil s&apos;en tient au risque financier, et les tâches d&apos;investissement du code sont écartées.
          </p>
        </section>

        <section id="ecartees" className="mb-14">
          <h2 className={H2}>Les tâches écartées</h2>
          <p className={P}>
            Une tâche n&apos;est écartée que si elle ne correspond pas au poste en France. Elle reste comptée dans la catégorie de l&apos;OIT, qui n&apos;est jamais recalculée. {ecartees.length} tâches sont écartées :
          </p>
          <div className="space-y-4">
            {ecartees.map((e) => (
              <div key={`${e.isco08}-${e.id}`} className="bg-white p-5">
                <p className="font-mono text-xs font-bold tracking-[0.1em] uppercase text-[#6b6b6b] mb-2">{e.poste} · ISCO {e.isco08}, tâche {e.id}</p>
                <p lang="en" className="text-sm text-[#1c1c17] italic leading-relaxed mb-2">{e.en}</p>
                <p className="text-sm text-[#1c1c17] leading-relaxed"><strong>Pourquoi :</strong> {e.raison}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="adaptations" className="mb-14">
          <h2 className={H2}>Les libellés adaptés</h2>
          <p className={P}>
            Les tâches sont traduites fidèlement, reformulées pour un lecteur non spécialiste sans en changer le sens. Pour {adaptations.length} d&apos;entre elles, le libellé français s&apos;écarte du texte de l&apos;OIT pour correspondre à la pratique française. Le score reste celui de la tâche d&apos;origine.
          </p>
          <div className="space-y-4">
            {adaptations.map((a) => (
              <div key={`${a.isco08}-${a.id}`} className="bg-white p-5">
                <p className="font-mono text-xs font-bold tracking-[0.1em] uppercase text-[#6b6b6b] mb-2">{a.poste} · ISCO {a.isco08}, tâche {a.id}</p>
                <p lang="en" className="text-sm text-[#6b6b6b] italic leading-relaxed mb-2">{a.en}</p>
                <p className="text-base text-[#1c1c17] leading-relaxed mb-2">{a.fr}</p>
                <p className="text-sm text-[#1c1c17] leading-relaxed"><strong>Pourquoi :</strong> {a.raison}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="limites" className="mb-14">
          <h2 className={H2}>Les limites reconnues par les auteurs</h2>
          <p className={P}>
            La méthode a été construite à partir de données polonaises, puis étendue au niveau international. Les tâches sont celles de la classification internationale ISCO-08, rédigées pour l&apos;ensemble des pays : certaines décrivent mal un poste en France, d&apos;où les exclusions et les adaptations ci-dessus.
          </p>
          <p className={P}>
            Les évaluations gardent une part subjective, qu&apos;elles viennent des modèles ou des experts qui les ont corrigées. Un score n&apos;est pas une mesure : c&apos;est une estimation, à lire comme un ordre de grandeur.
          </p>
          <p className={P}>
            Enfin, exposition ne veut pas dire adoption, et adoption ne veut pas dire destruction d&apos;emplois. Les auteurs mesurent ce que l&apos;IA générative pourrait techniquement faire sur une tâche, pas ce que les entreprises en feront ni à quel rythme. Leur conclusion générale porte sur la transformation des emplois.
          </p>
        </section>

        <section id="ne-mesure-pas" className="mb-14">
          <h2 className={H2}>Ce que l&apos;outil ne mesure pas</h2>
          <p className={P}>
            Nous avons publié une critique des calculateurs de risque qui réduisent un métier à un chiffre :{' '}
            <Link href="/article/calculateurs-risque-ia-ne-mesurent-rien/" className={LIEN}>les calculateurs de risque IA ne mesurent rien</Link>.
            Cet outil n&apos;échappe pas à toutes ses limites. Il ne voit pas :
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li className="text-base text-[#1c1c17] leading-relaxed"><strong>le secteur</strong> : un même poste ne se vit pas de la même façon dans une banque, un hôpital ou une PME industrielle ;</li>
            <li className="text-base text-[#1c1c17] leading-relaxed"><strong>la taille de la structure</strong>, que l&apos;outil demande seulement pour choisir les pistes ;</li>
            <li className="text-base text-[#1c1c17] leading-relaxed"><strong>les outils déjà en place</strong> dans votre entreprise ;</li>
            <li className="text-base text-[#1c1c17] leading-relaxed"><strong>le rythme d&apos;adoption</strong> : une technologie disponible n&apos;est pas une technologie utilisée, et l&apos;écart se compte souvent en années ;</li>
            <li className="text-base text-[#1c1c17] leading-relaxed"><strong>la responsabilité professionnelle</strong> : signer des comptes, valider un acte, approuver un crédit engage une personne, quelle que soit la qualité de l&apos;outil en amont ;</li>
            <li className="text-base text-[#1c1c17] leading-relaxed"><strong>la capacité d&apos;adaptation individuelle</strong> : deux personnes au même poste ne réagissent pas de la même façon à l&apos;arrivée d&apos;un outil.</li>
          </ul>
          <p className={P}>
            Le résultat montre où passe la ligne entre les tâches de votre semaine, d&apos;après une source publique et vérifiable. Il ne dit pas ce qui va vous arriver.
          </p>
        </section>

        <section id="journal" className="mb-14">
          <h2 className={H2}>Journal des mises à jour</h2>
          <ul className="space-y-3">
            {JOURNAL.map((j) => (
              <li key={j.date} className="text-base text-[#1c1c17] leading-relaxed">
                <span className="font-mono text-sm text-[#6b6b6b]">{j.date}</span> : {j.texte}
              </li>
            ))}
          </ul>
          <p className="text-sm text-[#6b6b6b] leading-relaxed mt-6">
            Les données sont mises à jour à chaque nouvelle version publiée par les auteurs.
          </p>
        </section>

        <div className="bg-[#1a3a4a] p-8 md:p-10">
          <p className="text-xl font-bold text-white mb-4">Où passe la ligne dans votre poste ?</p>
          <Link href="/diagnostic-exposition-ia/" className="font-mono inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#c9a84c] border border-[#c9a84c] px-6 py-4 hover:bg-[#c9a84c] hover:text-[#1a3a4a] transition-colors duration-300">
            Faire le test
          </Link>
        </div>
      </article>
    </div>
  );
}

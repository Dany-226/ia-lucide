import type { Metadata } from 'next';
import { collectionPageJsonLd, jsonLdHtml, METIERS_HUB_UPDATED, pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import MetiersFaqItem from '@/components/MetiersFaqItem';

const PAGE_DESCRIPTION =
  "Quels métiers sont menacés par l'IA en 2026 ? 21 professions analysées tâche par tâche, sans catastrophisme ni déni : comptable, juriste, médecin...";

export const metadata: Metadata = pageMetadata({
  absoluteTitle: "Métiers menacés par l'IA en France : 21 analyses (2026)",
  description: PAGE_DESCRIPTION,
  path: "/metiers/",
});

const METIERS = [
  {
    niveau: 'rouge' as const,
    label: 'Exposition forte',
    color: '#c0392b',
    metiers: [
      {
        titre: 'Comptable',
        description: "Saisie, rapprochements, déclarations fiscales : les IA automatisent l'essentiel des tâches répétitives. Le rôle évolue vers le conseil et l'analyse stratégique.",
        slug: 'outils-ia-experts-comptables-2026',
      },
      {
        titre: 'Traducteur',
        description: "La traduction automatique a atteint un niveau professionnel pour de nombreuses paires de langues. La valeur se déplace vers la post-édition et la spécialisation sectorielle.",
        slug: 'traducteur',
      },
      {
        titre: 'Assistant administratif',
        description: "Gestion d'agendas, rédaction d'emails, saisie documentaire, organisation de réunions : ces tâches sont massivement prises en charge par les outils d'IA générative.",
        slug: 'assistant',
      },
      {
        titre: 'Journaliste / Rédacteur',
        description: "Génération de brèves, synthèses de données, rédaction standardisée : l'IA occupe déjà ce terrain. Le reportage d'investigation et l'analyse de fond résistent mieux.",
        slug: 'journaliste',
      },
      {
        titre: 'Développeur',
        description: "Écriture de code, tests, documentation : ce sont les tâches les plus couvertes par l'IA dans les usages observés, et les embauches de jeunes développeurs ont le plus reculé. Le métier se déplace vers l'architecture, la revue de code et la responsabilité de ce qui part en production.",
        slug: 'developpeur-augmente-ia-2026',
      },
    ],
  },
  {
    niveau: 'jaune' as const,
    label: 'Exposition modérée',
    color: '#c9a84c',
    metiers: [
      {
        titre: 'Juriste / Avocat',
        description: "Recherche jurisprudentielle, premiers jets de contrats, veille réglementaire : l'IA prend en charge le travail préparatoire, celui des assistants juridiques en premier. Le conseil, la stratégie, la plaidoirie et la responsabilité professionnelle restent à l'avocat.",
        slug: 'guide-ia-juristes-avocats-2026',
      },
      {
        titre: 'RH / Recruteur',
        description: "Tri de CV, rédaction de fiches de poste, scoring de candidats : l'IA prend en charge le volume. L'évaluation humaine, culturelle et comportementale reste déterminante.",
        slug: 'rh-recruteur',
      },
      {
        titre: 'Commercial',
        description: "Prospection automatisée, scoring de leads, personnalisation des messages : l'IA augmente la productivité commerciale. La négociation complexe et la relation long terme restent humaines.",
        slug: 'commercial',
      },
      {
        titre: 'Graphiste / Designer',
        description: "Génération d'images, déclinaisons créatives, maquettes : les outils génératifs accélèrent la production. La direction artistique, le sens de la marque et la relation client restent centraux.",
        slug: 'graphiste',
      },
      {
        titre: 'Médecin',
        description: "Aide au diagnostic, rédaction de comptes-rendus, analyse d'imagerie : l'IA augmente le praticien sans le remplacer. La relation patient et le jugement clinique global restent irremplaçables.",
        slug: 'medecin',
      },
      {
        titre: 'Notaire',
        description: "Constitution du dossier, lecture des pièces, préparation des projets d'actes : l'IA accélère le travail préparatoire des études. L'authentification, le conseil et la responsabilité de l'acte restent au notaire.",
        slug: 'notaire-ia-authenticite',
      },
      {
        titre: 'Directeur financier / CFO',
        description: "Clôture, reporting, prévisions : les agents prennent en charge la collecte et le rapprochement des données. L'arbitrage, la responsabilité des comptes et le rôle de partenaire de la direction restent humains.",
        slug: 'directeur-financier-cfo-ia-2026',
      },
      {
        titre: 'Contrôleur financier',
        description: "Consolidation, reporting, détection d'anomalies : les tâches répétitives s'automatisent. L'interprétation des écarts, le conseil aux opérationnels et la vision stratégique restent humains.",
        slug: 'controleur-financier',
      },
      {
        titre: 'Analyste risque',
        description: "Scoring de premier niveau, agrégation de données, brouillons de rapports : les tâches standards s'automatisent. La validation des cas ambigus et la responsabilité de la décision finale restent humaines.",
        slug: 'analyste-risque-remplace-par-ia',
      },
      {
        titre: 'Analyste risque crédit',
        description: "Le scoring de crédit s'automatise depuis des décennies. L'IA générative accélère surtout la rédaction des mémos et l'agrégation de données - les dossiers atypiques restent arbitrés manuellement.",
        slug: 'analyste-risque-credit-ia-banque',
      },
      {
        titre: 'Analyste risque assurance',
        description: "Pré-scoring de souscription, détection de fraude, chiffrage des sinistres simples : l'automatisation avance vite sur les profils standards. La fonction actuarielle et les sinistres complexes restent humains.",
        slug: 'analyste-risque-assurance-ia',
      },
      {
        titre: 'Analyste risque opérationnel',
        description: "Cartographie des incidents et agrégation de signaux internes s'automatisent. L'évaluation de la culture du risque et l'arbitrage en comité restent un jugement humain.",
        slug: 'analyste-risque-operationnel-ia-entreprise',
      },
    ],
  },
  {
    niveau: 'vert' as const,
    label: 'Exposition faible',
    color: '#2e7d52',
    metiers: [
      {
        titre: 'Manager',
        description: "Motivation, cohésion d'équipe, gestion des tensions et des carrières : les dimensions relationnelles et politiques du management échappent encore largement à l'automatisation.",
        slug: 'manager',
      },
      {
        titre: 'Consultant',
        description: "Diagnostic organisationnel, conduite du changement, influence des décisions : la valeur du consultant réside dans son jugement contextuel et sa capacité à convaincre des parties prenantes complexes.",
        slug: 'consultant',
      },
      {
        titre: 'Architecte',
        description: "Les outils génératifs accélèrent la phase conceptuelle, mais la maîtrise d'œuvre, la responsabilité légale, la relation client et la vision urbaine restent profondément humaines.",
        slug: 'architecte-ia-conception-batiment',
      },
      {
        titre: 'Enseignant',
        description: "Personnalisation des parcours et correction assistée : l'IA change la posture pédagogique. Mais la transmission, la motivation et la relation éducative restent irremplaçables.",
        slug: 'enseignant',
      },
    ],
  },
];

// Date de la dernière révision du hub : affichée sous l'introduction, transmise en
// dateModified (JSON-LD) et en lastModified (sitemap.ts). À avancer à chaque révision
// du classement ou des sources, jamais pour une simple retouche de style.
const UPDATED_ISO = METIERS_HUB_UPDATED;
const UPDATED_LABEL = '25 novembre 2026';

// Études de référence citées dans la section « Ce que disent les études récentes ».
// Règle : source primaire, date, et la limite indiquée par les auteurs eux-mêmes.
const ETUDES = [
  {
    source: 'Coface et Observatoire des emplois menacés et émergents',
    date: '1er avril 2026',
    url: 'https://www.coface.com/fr/actualites-economie-conseils-d-experts/emplois-competences-valeur-ce-que-l-ia-est-en-train-de-bouleverser',
    texte: "923 professions décomposées en tâches, chacune notée selon des règles explicites. En France, 16 % du contenu du travail est potentiellement automatisable, ce qui place le pays dans la moyenne européenne. Les familles les plus exposées sont le management et l'administration, les métiers créatifs, le droit et la finance, l'ingénierie et l'informatique.",
    limite: "L'étude mesure une exposition technique des tâches. Ses auteurs précisent qu'elle ne préjuge d'aucun volume de destructions nettes d'emplois.",
  },
  {
    source: 'Banque de France et HEC Paris (LIFT), Bloc-notes Éco n° 463',
    date: '8 octobre 2026',
    url: 'https://www.banque-france.fr/fr/publications-et-statistiques/publications/ia-generative-les-premiers-changements-du-marche-du-travail-sur-les-jeunes',
    texte: "Un indice d'exposition construit sur le répertoire des métiers de France Travail (ROME), croisé avec les embauches réelles. Chez les 21-29 ans, les embauches en CDI des métiers les plus exposés se situent en mars 2026 à 28,3 % sous leur niveau de novembre 2022, contre 7,5 % pour les métiers les moins exposés.",
    limite: "Les auteurs établissent une association, pas un effet causal, et leur indice mesure une capacité technique, pas l'usage réel de l'IA.",
    article: { label: "Notre lecture détaillée de l'étude", slug: 'ia-embauche-jeunes-etude-banque-de-france' },
  },
  {
    source: 'France Travail, enquête auprès des employeurs',
    date: '17 novembre 2026',
    url: 'https://www.francetravail.org/accueil/actualites/infographies/2026/l-impact-de-l-ia-a-5-ans-sur-les-metiers-la-vision-des-employeurs.html?type=article',
    texte: "16 000 établissements interrogés sur l'impact de l'IA à cinq ans. Les métiers qu'ils jugent fragilisés, ceux dont l'IA peut réaliser l'essentiel des tâches : secrétaires administratifs, aides-comptables, assistants juridiques. Avocats, responsables RH, radiologues et chefs de projet sont classés parmi les métiers augmentés, où l'IA assiste et l'humain décide.",
    limite: "Ce sont des anticipations d'employeurs, pas une mesure. Seuls 6 % d'entre eux pensent que l'IA pourrait concurrencer l'humain sur leur métier principal.",
  },
  {
    source: 'Anthropic, « Labor market impacts of AI »',
    date: '5 mars 2026',
    url: 'https://www.anthropic.com/research/labor-market-impacts',
    texte: "Une mesure de l'exposition observée : la part des tâches d'un métier pour lesquelles l'assistant Claude est réellement utilisé au travail. Les programmeurs arrivent en tête avec 75 % de tâches couvertes, les opérateurs de saisie de données sont à 67 %. Environ 30 % des travailleurs ont une exposition nulle, comme les cuisiniers, les mécaniciens ou les barmans.",
    limite: "Les données portent sur les métiers américains (nomenclature O*NET) et sur un seul assistant, publiées par l'éditeur de cet assistant.",
  },
  {
    source: 'Direction générale du Trésor, Trésor-Éco n° 391',
    date: '30 juin 2026',
    url: 'https://www.tresor.economie.gouv.fr/Articles/2026/06/30/l-intelligence-artificielle-quels-effets-sur-l-emploi',
    texte: "L'effet net de l'IA sur le volume d'emploi y est jugé incertain : elle peut remplacer certains postes mais aussi accroître la productivité et la demande de travail. Les premiers licenciements attribués à l'IA touchent surtout la finance et l'informatique, et l'IA sert parfois de justification à des licenciements qui ont d'autres causes.",
    limite: "Les auteurs signalent le manque de recul et une adoption encore limitée dans les entreprises.",
    article: { label: "Licenciements et IA : les vraies raisons", slug: 'licenciements-ia-vraies-raisons' },
  },
];

const FAQ = [
  {
    q: "Quels métiers sont les plus menacés par l'IA ?",
    a: "Selon les études publiées en 2026, les métiers administratifs et de saisie, la comptabilité courante, la traduction, la rédaction standardisée et le développement logiciel. France Travail cite les secrétaires administratifs, les aides-comptables et les assistants juridiques. Anthropic mesure 75 % de tâches couvertes chez les programmeurs. Exposé ne veut pas dire supprimé : c'est d'abord la composition du travail qui change.",
  },
  {
    q: "Quels métiers sont les moins menacés par l'IA ?",
    a: "Ceux qui reposent sur le geste, le terrain ou la relation : artisans, cuisiniers, aides à domicile, psychologues, selon les employeurs interrogés par France Travail. Dans les usages observés par Anthropic, environ 30 % des travailleurs ont une exposition nulle. Parmi les métiers analysés ici, manager, consultant, architecte et enseignant restent en exposition faible.",
  },
  {
    q: "Comment l'IA va-t-elle concrètement changer mon métier ?",
    a: "L'IA transforme d'abord les tâches répétitives et traitables en volume : saisie, recherche, rédaction standardisée, classification. Elle gagne ensuite une partie des tâches analytiques. Ce qui résiste : la relation humaine, le jugement en situation, la responsabilité et la créativité ancrée dans l'expérience.",
  },
  {
    q: "Mon métier va-t-il disparaître à cause de l'IA ?",
    a: "La disparition totale d'un métier est rare. Ce qui se transforme, c'est la composition des tâches qui le définissent. Le premier effet mesuré en France porte sur les embauches : l'étude Banque de France et HEC Paris montre un recul des recrutements en CDI dans les métiers exposés, plus marqué chez les moins de 30 ans. Dans ces métiers, la valeur se déplace vers la supervision, le conseil et la relation client.",
  },
  {
    q: "Comment se préparer à ces transformations ?",
    a: "Commencez par regarder ce que les outils font réellement dans votre métier, au-delà des annonces. Repérez ensuite, dans votre semaine, les tâches courantes qu'un outil prend déjà en charge. Investissez enfin dans ce qui reste au professionnel : le jugement, la relation, la responsabilité de la décision.",
  },
  {
    q: "L'IA est-elle un outil ou une menace pour les professionnels ?",
    a: "Cela dépend moins de l'outil que de la place qu'on lui donne. Un professionnel qui l'utilise sur ses tâches courantes gagne du temps ; celui qui l'ignore voit ce temps gagné par ses concurrents. Les études récentes montrent aussi un effet plus discret : dans les métiers exposés, ce sont les postes de débutants qui se raréfient en premier.",
  },
  {
    q: "Ces analyses sont-elles fiables ? Qui les produit ?",
    a: "ialucide est une publication indépendante. Chaque analyse s'appuie sur des études publiées et datées (Coface et OEM, Banque de France, France Travail, Direction générale du Trésor, Anthropic) et cite ses sources, avec leurs limites. Les fiches signées « La rédaction ialucide » sont relues sous la responsabilité du directeur de la publication. ialucide ne vend ni formation ni logiciel.",
  },
];

function MetierCard({ metier, color }: { metier: typeof METIERS[0]['metiers'][0]; color: string }) {
  return (
    <div
      className="bg-white p-5 group hover:shadow-[0_2px_32px_rgba(28,28,23,0.08)] transition-shadow duration-300"
      style={{ borderLeft: `4px solid ${color}` }}
    >
      <h3
        className="text-[1.375rem] font-bold text-[#1c1c17] mb-2 group-hover:text-[#c9a84c] transition-colors duration-300"
        style={{ letterSpacing: '-0.02em' }}
      >
        {metier.titre}
      </h3>
      <p className="text-base text-[#6b6b6b] leading-relaxed mb-4">
        {metier.description}
      </p>
      <Link
        href={`/article/${metier.slug}/`}
        className="font-mono inline-flex items-center gap-1 text-xs font-bold tracking-widest uppercase transition-colors"
        style={{ color }}
      >
        Lire l&apos;analyse
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <path d="M2 5.5H9M6 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Link>
    </div>
  );
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
};

// Fiches listées sur la page, dans l'ordre d'affichage (FAQPage conservé à part).
const collectionJsonLd = collectionPageJsonLd({
  name: "Métiers menacés par l'IA en France : analyses par profession",
  description: PAGE_DESCRIPTION,
  path: '/metiers/',
  dateModified: UPDATED_ISO,
  items: METIERS.flatMap((section) =>
    section.metiers.map((m) => ({ name: m.titre, url: `/article/${m.slug}/` })),
  ),
});

export default function MetiersPage() {
  return (
    <div className="bg-[#fcf9f0] min-h-screen pt-24 md:pt-32 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(collectionJsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="max-w-5xl mx-auto px-5 md:px-8">

        {/* Header */}
        <header className="mb-16 md:mb-20 max-w-2xl">
          <span className="font-mono text-xs font-bold tracking-[0.3em] uppercase text-[#8a6a1c] block mb-4">
            Analyse par métier
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#1c1c17] leading-[1.05] mb-6" style={{ letterSpacing: '-0.02em' }}>
            Votre métier face à l&apos;IA
          </h1>
          <p className="text-base text-[#1c1c17] leading-relaxed mb-4">
            21 professions analysées avec méthode. Pas de catastrophisme, pas de déni : une lecture lucide de ce que l&apos;IA change réellement, tâche par tâche.
          </p>
          <p className="text-base text-[#6b6b6b] leading-relaxed mb-4">
            Le niveau d&apos;exposition correspond à la part des tâches du métier que les outils d&apos;IA actuels peuvent prendre en charge dans les 3 à 5 prochaines années. La méthode et les études utilisées sont détaillées <a href="#methode" className="text-[#8a6a1c] underline underline-offset-2">plus bas</a>.
          </p>
          <p className="text-base text-[#6b6b6b] leading-relaxed mb-4">
            Selon l&apos;étude de Coface et de l&apos;Observatoire des emplois menacés et émergents publiée le 1er avril 2026, 16 % du contenu du travail est potentiellement automatisable en France, et environ une profession sur huit dépasse le seuil de 30 % de tâches automatisables. L&apos;étude mesure une exposition technique et ne prévoit aucun volume de destructions d&apos;emplois. Le chiffre de « 5 millions d&apos;emplois menacés », repris par une partie de la presse, n&apos;y figure pas.
          </p>
          <p className="font-mono text-xs tracking-[0.1em] uppercase text-[#6b6b6b]">
            Mis à jour le <time dateTime={UPDATED_ISO}>{UPDATED_LABEL}</time>
          </p>
        </header>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-12">
          {[
            { label: 'Exposition forte', color: '#c0392b' },
            { label: 'Exposition modérée', color: '#c9a84c' },
            { label: 'Exposition faible', color: '#2e7d52' },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="font-mono text-xs font-bold tracking-[0.1em] uppercase text-[#6b6b6b]">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Métier sections */}
        {METIERS.map((section) => (
          <section key={section.niveau} className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8" style={{ backgroundColor: section.color }} />
              <h2 className="text-[1.75rem] font-bold text-[#1c1c17]" style={{ letterSpacing: '-0.02em' }}>
                {section.label}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.metiers.map((metier) => (
                <MetierCard key={metier.slug} metier={metier} color={section.color} />
              ))}
            </div>
          </section>
        ))}

        {/* Divider */}
        <div className="h-px bg-[#c9a84c]/20 my-16" />

        {/* Méthode */}
        <section id="methode" className="mb-16 max-w-3xl scroll-mt-28">
          <span className="font-mono text-xs font-bold tracking-[0.3em] uppercase text-[#8a6a1c] block mb-4">
            Méthode
          </span>
          <h2 className="text-[1.75rem] font-bold text-[#1c1c17] mb-6" style={{ letterSpacing: '-0.02em' }}>
            Comment nous classons les métiers
          </h2>
          <p className="text-base text-[#1c1c17] leading-relaxed mb-4">
            Le niveau d&apos;exposition mesure la part des tâches courantes d&apos;un métier qu&apos;un outil d&apos;IA actuel peut réaliser ou fortement accélérer, à un horizon de 3 à 5 ans.
          </p>
          <ul className="space-y-3 mb-6">
            <li className="text-base text-[#1c1c17] leading-relaxed pl-4" style={{ borderLeft: '3px solid #c0392b' }}>
              <strong>Exposition forte</strong>&nbsp;: l&apos;IA prend déjà en charge l&apos;essentiel des tâches courantes du métier.
            </li>
            <li className="text-base text-[#1c1c17] leading-relaxed pl-4" style={{ borderLeft: '3px solid #c9a84c' }}>
              <strong>Exposition modérée</strong>&nbsp;: une part importante des tâches s&apos;automatise, mais la décision, la relation ou la responsabilité restent au professionnel.
            </li>
            <li className="text-base text-[#1c1c17] leading-relaxed pl-4" style={{ borderLeft: '3px solid #2e7d52' }}>
              <strong>Exposition faible</strong>&nbsp;: le métier repose surtout sur le jugement en situation, la relation ou la présence physique, que les outils actuels ne remplacent pas.
            </li>
          </ul>
          <p className="text-base text-[#6b6b6b] leading-relaxed mb-4">
            Chaque niveau est confronté aux études publiées ci-dessous. Être exposé ne veut pas dire disparaître : ces études mesurent ce que l&apos;IA sait faire, pas ce que les entreprises décideront d&apos;en faire.
          </p>
          <p className="text-base text-[#6b6b6b] leading-relaxed">
            Le classement est révisé à chaque nouvelle étude de référence. Révision du {UPDATED_LABEL} : le développeur passe en exposition forte, le juriste et l&apos;avocat en exposition modérée.
          </p>
        </section>

        {/* Études */}
        <section className="mb-16 max-w-3xl">
          <span className="font-mono text-xs font-bold tracking-[0.3em] uppercase text-[#8a6a1c] block mb-4">
            Sources
          </span>
          <h2 className="text-[1.75rem] font-bold text-[#1c1c17] mb-8" style={{ letterSpacing: '-0.02em' }}>
            Ce que disent les études récentes
          </h2>
          <div className="space-y-8">
            {ETUDES.map((etude) => (
              <article key={etude.source} className="bg-white p-6" style={{ borderLeft: '4px solid #1a3a4a' }}>
                <h3 className="text-lg font-bold text-[#1c1c17] mb-1 leading-snug">
                  <a href={etude.url} target="_blank" rel="noopener noreferrer" className="hover:text-[#8a6a1c] transition-colors">
                    {etude.source}
                  </a>
                </h3>
                <p className="font-mono text-xs tracking-[0.1em] uppercase text-[#6b6b6b] mb-3">
                  {etude.date}
                </p>
                <p className="text-base text-[#1c1c17] leading-relaxed mb-3">
                  {etude.texte}
                </p>
                <p className="text-base text-[#6b6b6b] leading-relaxed">
                  <strong className="text-[#1c1c17]">La limite à connaître :</strong> {etude.limite}
                </p>
                {etude.article && (
                  <Link
                    href={`/article/${etude.article.slug}/`}
                    className="font-mono inline-flex items-center gap-1 mt-4 text-xs font-bold tracking-widest uppercase text-[#8a6a1c]"
                  >
                    {etude.article.label}
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
                      <path d="M2 5.5H9M6 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                )}
              </article>
            ))}
          </div>
        </section>

        <div className="h-px bg-[#c9a84c]/20 my-16" />

        {/* FAQ */}
        <section className="mb-20">
          <span className="font-mono text-xs font-bold tracking-[0.3em] uppercase text-[#8a6a1c] block mb-4">
            Questions fréquentes
          </span>
          <h2 className="text-[1.75rem] font-bold text-[#1c1c17] mb-10" style={{ letterSpacing: '-0.02em' }}>
            Ce que vous vous demandez vraiment
          </h2>
          <div>
            {FAQ.map((item, i) => (
              <MetiersFaqItem key={i} item={item} />
            ))}
          </div>
        </section>

        {/* CTA diagnostic exposition */}
        <section className="bg-[#1a3a4a] p-10 md:p-14 text-center">
          <span className="font-mono text-xs font-bold tracking-[0.3em] uppercase text-[#c9a84c] block mb-4">
            Cadre ou dirigeant ?
          </span>
          <h2 className="text-[1.75rem] md:text-4xl font-bold text-white mb-4" style={{ letterSpacing: '-0.02em' }}>
            Mesurez votre exposition à l&apos;IA
          </h2>
          <p className="text-base text-[#fcf9f0]/80 mb-8 max-w-xl mx-auto leading-relaxed">
            Un diagnostic personnalisé en 10 minutes. Comprenez précisément quelles dimensions de votre poste sont concernées et par quoi commencer.
          </p>
          <Link
            href="/diagnostic-exposition-ia/"
            className="font-mono inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#c9a84c] border border-[#c9a84c] px-8 py-4 hover:bg-[#c9a84c] hover:text-[#1a3a4a] transition-all duration-500"
          >
            Faire mon diagnostic
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7H12M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </section>

      </div>
    </div>
  );
}

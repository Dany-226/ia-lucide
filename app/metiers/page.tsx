import type { Metadata } from 'next';
import { collectionPageJsonLd, jsonLdHtml, METIERS_HUB_UPDATED, pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import MetiersFaqItem from '@/components/MetiersFaqItem';
import EncartOutil from '@/components/EncartOutil';
import { getDomaines, texte } from '@/lib/diagnostic-data';
import type { CodeCategorie } from '@/lib/diagnostic-types';

const PAGE_DESCRIPTION =
  "Quels métiers sont menacés par l'IA en 2026 ? 21 professions analysées tâche par tâche, sans catastrophisme ni déni : comptable, juriste, médecin...";

export const metadata: Metadata = pageMetadata({
  absoluteTitle: "Métiers menacés par l'IA en France : 21 analyses (2026)",
  description: PAGE_DESCRIPTION,
  path: "/metiers/",
});

// Classement : catégories de l'OIT (Gmyrek et al., 2025, ILO Working Paper 140), du plus
// exposé au moins exposé. Plus aucun classement maison ni horizon de temps (révision du 27/11/2026).
// - Métier couvert par l'outil (`outil`) : catégorie lue au build dans data/metiers/<domaine>/<poste>.json,
//   jamais recopiée ici ; la carte renvoie vers /metiers/<domaine>/.
// - Métier hors outil (`isco`) : catégorie du code ISCO-08 lue dans
//   data/source/Final_Scores_ISCO08_Gmyrek_et_al_2025.xlsx (colonne potential25, relevé du 27/11/2026).
// - `sansCode` : pas de code ISCO-08 fidèle ; aucune catégorie affichée.
type Fiche = {
  titre: string;
  description: string;
  slug: string;
  outil?: { domaine: string; poste: string };
  isco?: { code: string; titre: string; categorie: keyof typeof CODES_CATEGORIE_HUB; domaine?: string; note?: string };
  sansCode?: { note: string };
};

// Libellés OIT publiés (colonne potential25) acceptés pour les métiers hors outil.
const CODES_CATEGORIE_HUB = {
  'Exposed: Gradient 4': 'G4',
  'Exposed: Gradient 3': 'G3',
  'Exposed: Gradient 2': 'G2',
  'Exposed: Gradient 1': 'G1',
  'Minimal Exposure': 'MIN',
  'Not Exposed': 'NE',
} as const satisfies Record<string, CodeCategorie>;

const FICHES: Fiche[] = [
  {
    titre: 'Comptable',
    description: "Saisie, rapprochements, déclarations fiscales : une bonne part des tâches courantes a un potentiel notable pour l'IA générative. Le rôle se déplace vers le conseil et l'analyse.",
    slug: 'outils-ia-experts-comptables-2026',
    outil: { domaine: 'comptabilite', poste: 'comptable' },
  },
  {
    titre: 'Traducteur',
    description: "La traduction automatique atteint un niveau professionnel sur de nombreuses paires de langues. La valeur se déplace vers la post-édition, la relecture et la spécialisation sectorielle.",
    slug: 'traducteur',
    outil: { domaine: 'traduction', poste: 'traducteur-interprete' },
  },
  {
    titre: 'Assistant administratif',
    description: "Gestion d'agendas, rédaction d'e-mails, saisie documentaire, organisation de réunions : c'est sur ces tâches que l'IA générative a le plus de potentiel. L'organisation et l'arbitrage des priorités restent au poste.",
    slug: 'assistant',
    outil: { domaine: 'secretariat-assistanat', poste: 'assistant-direction' },
  },
  {
    titre: 'Journaliste / Rédacteur',
    description: "Brèves, synthèses de données, rédaction standardisée : l'IA générative est déjà utilisée sur ce terrain. Le reportage, l'enquête et l'analyse de fond en dépendent beaucoup moins.",
    slug: 'journaliste',
    isco: { code: '2642', titre: 'Journalists', categorie: 'Exposed: Gradient 3' },
  },
  {
    titre: 'Développeur',
    description: "Écriture de code, tests, documentation : ce sont les tâches les plus couvertes par l'IA dans les usages observés, et les embauches de jeunes développeurs ont le plus reculé. Le métier se déplace vers l'architecture, la revue de code et la responsabilité de ce qui part en production.",
    slug: 'developpeur-augmente-ia-2026',
    outil: { domaine: 'developpement', poste: 'developpeur-logiciel' },
  },
  {
    titre: 'Juriste / Avocat',
    description: "Recherche jurisprudentielle, premiers jets de contrats, veille réglementaire : l'IA prend en charge une partie du travail préparatoire, celui des assistants juridiques en premier. Le conseil, la stratégie, la plaidoirie et la responsabilité professionnelle restent à l'avocat.",
    slug: 'guide-ia-juristes-avocats-2026',
    outil: { domaine: 'droit', poste: 'avocat-juriste' },
  },
  {
    titre: 'RH / Recruteur',
    description: "Tri de CV, rédaction de fiches de poste, présélection de candidats : l'IA prend en charge une partie du volume. L'évaluation humaine, culturelle et comportementale reste déterminante.",
    slug: 'rh-recruteur',
    outil: { domaine: 'ressources-humaines', poste: 'charge-rh-recrutement' },
  },
  {
    titre: 'Commercial',
    description: "Prospection, priorisation des contacts, personnalisation des messages : l'IA générative accélère la préparation commerciale. La négociation complexe et la relation dans la durée restent au commercial.",
    slug: 'commercial',
    isco: { code: '3322', titre: 'Commercial Sales Representatives', categorie: 'Exposed: Gradient 2' },
  },
  {
    titre: 'Graphiste / Designer',
    description: "Génération d'images, déclinaisons créatives, maquettes : les outils génératifs accélèrent la production. La direction artistique, le sens de la marque et la relation client restent centraux.",
    slug: 'graphiste',
    isco: { code: '2166', titre: 'Graphic and Multimedia Designers', categorie: 'Exposed: Gradient 2' },
  },
  {
    titre: 'Médecin',
    description: "Aide au diagnostic, rédaction de comptes-rendus, analyse d'imagerie : l'IA assiste le praticien sur des tâches précises. La relation avec le patient et le jugement clinique d'ensemble restent au médecin.",
    slug: 'medecin',
    isco: { code: '2211', titre: 'Generalist Medical Practitioners', categorie: 'Not Exposed' },
  },
  {
    titre: 'Notaire',
    description: "Constitution du dossier, lecture des pièces, préparation des projets d'actes : l'IA accélère le travail préparatoire des études. L'authentification, le conseil et la responsabilité de l'acte restent au notaire.",
    slug: 'notaire-ia-authenticite',
    isco: {
      code: '2619',
      titre: 'Legal Professionals Not Elsewhere Classified',
      categorie: 'Minimal Exposure',
      domaine: 'droit',
      note: "Ce code décrit mal le notariat français. Dans l'étude, la secrétaire juridique et le clerc sont plus exposés que le notaire.",
    },
  },
  {
    titre: 'Directeur financier / CFO',
    description: "Clôture, reporting, prévisions : les agents prennent en charge la collecte et le rapprochement des données. L'arbitrage, la responsabilité des comptes et le rôle de partenaire de la direction restent humains.",
    slug: 'directeur-financier-cfo-ia-2026',
    isco: { code: '1211', titre: 'Finance Managers', categorie: 'Minimal Exposure' },
  },
  {
    titre: 'Contrôleur financier',
    description: "Consolidation, reporting, détection d'anomalies : l'IA prend en charge une part croissante des tâches répétitives. L'interprétation des écarts, le conseil aux opérationnels et la vision stratégique restent au contrôleur.",
    slug: 'controleur-financier',
    isco: { code: '2411', titre: 'Accountants', categorie: 'Exposed: Gradient 3' },
  },
  {
    titre: 'Analyste risque',
    description: "Scoring de premier niveau, agrégation de données, brouillons de rapports : les tâches standards ont un potentiel élevé pour l'IA générative. La validation des cas ambigus et la responsabilité de la décision finale restent humaines.",
    slug: 'analyste-risque-remplace-par-ia',
    outil: { domaine: 'analyse-risque', poste: 'analyste-financier-risque' },
  },
  {
    titre: 'Analyste risque crédit',
    description: "Le scoring de crédit est outillé depuis des décennies. L'IA générative accélère surtout la rédaction des mémos et l'agrégation de données : les dossiers atypiques restent arbitrés au cas par cas.",
    slug: 'analyste-risque-credit-ia-banque',
    outil: { domaine: 'analyse-risque', poste: 'analyste-financier-risque' },
  },
  {
    titre: 'Analyste risque assurance',
    description: "Pré-scoring de souscription, détection de fraude, chiffrage des sinistres simples : l'IA avance vite sur les dossiers standards. La fonction actuarielle et les sinistres complexes restent traités au cas par cas.",
    slug: 'analyste-risque-assurance-ia',
    sansCode: { note: "Pas d'équivalent fidèle dans la nomenclature ISCO-08 : le métier se partage entre plusieurs codes (actuaires, experts en sinistres, analystes financiers)." },
  },
  {
    titre: 'Analyste risque opérationnel',
    description: "Cartographie des incidents, agrégation de signaux internes : l'IA prend en charge une partie de la collecte. L'évaluation de la culture du risque et l'arbitrage en comité restent un jugement humain.",
    slug: 'analyste-risque-operationnel-ia-entreprise',
    sansCode: { note: "Pas d'équivalent fidèle dans la nomenclature ISCO-08, qui n'a pas de code propre au risque opérationnel." },
  },
  {
    titre: 'Manager',
    description: "Motivation, cohésion d'équipe, gestion des tensions et des carrières : les dimensions relationnelles et politiques du management restent peu exposées à l'IA générative.",
    slug: 'manager',
    sansCode: { note: "Pas de code unique : les codes de direction de l'ISCO-08 dépendent du secteur. La plupart sont en exposition minimale, quelques-uns en exposition modérée." },
  },
  {
    titre: 'Consultant',
    description: "Diagnostic organisationnel, conduite du changement : l'IA produit vite des analyses et des synthèses. La valeur du consultant tient à son jugement en contexte et à sa capacité à convaincre.",
    slug: 'consultant',
    isco: { code: '2421', titre: 'Management and Organization Analysts', categorie: 'Exposed: Gradient 2' },
  },
  {
    titre: 'Architecte',
    description: "Les outils génératifs accélèrent la phase conceptuelle. La maîtrise d'œuvre, la responsabilité légale, la relation client et la vision urbaine restent à l'architecte.",
    slug: 'architecte-ia-conception-batiment',
    outil: { domaine: 'architecture', poste: 'architecte' },
  },
  {
    titre: 'Enseignant',
    description: "Personnalisation des parcours et correction assistée : l'IA change la posture pédagogique. La transmission, la motivation des élèves et la relation éducative restent au cœur du métier.",
    slug: 'enseignant',
    outil: { domaine: 'enseignement', poste: 'enseignant-secondaire' },
  },
];

const ORDRE: CodeCategorie[] = ['G4', 'G3', 'G2', 'G1', 'MIN', 'NE'];

// Ligne d'introduction de chaque section, au pluriel (les explications de textes.json parlent d'un poste).
const INTRO_CATEGORIE: Record<CodeCategorie, string> = {
  G4: "Métiers dont la plupart des tâches ont un potentiel élevé pour l'IA générative, avec peu d'écart d'une tâche à l'autre.",
  G3: "Métiers dont une bonne partie des tâches a un potentiel notable pour l'IA générative, même si certaines en ont nettement moins.",
  G2: "Métiers qui mêlent des tâches au potentiel notable pour l'IA générative et d'autres au potentiel faible : l'effet varie d'une tâche à l'autre.",
  G1: "Métiers qui reposent surtout sur des tâches à faible potentiel pour l'IA générative, avec quelques tâches au potentiel nettement plus élevé.",
  MIN: "Métiers où le potentiel de l'IA générative reste limité sur l'ensemble des tâches, même si quelques-unes ont un potentiel partiel.",
  NE: "Métiers dont les tâches gardent un potentiel faible pour l'IA générative, avec peu d'écart entre elles. « Non exposé » est un libellé de classement de l'OIT, pas une garantie.",
};

// Palette neutre (pas de rouge ni de vert, cf. components/diagnostic/commun.tsx), du plus au moins exposé.
const COULEUR_CATEGORIE: Record<CodeCategorie, string> = {
  G4: '#1a3a4a',
  G3: '#4a6b78',
  G2: '#c9a84c',
  G1: '#d9c38a',
  MIN: '#b9b4a5',
  NE: '#dcd8cb',
};

type CarteHub = {
  fiche: Fiche;
  code: CodeCategorie | null;
  isco: string | null;
  domaine: { slug: string; libelle: string } | null;
  voisins: { libelle: string; code: CodeCategorie }[];
  horsOutil: boolean;
  note: string | null;
};

const court = (libelle: string) => libelle.split(' / ')[0];

function construireCartes(): CarteHub[] {
  const domaines = getDomaines();
  return FICHES.map((fiche) => {
    if (fiche.outil) {
      const d = domaines.find((x) => x.slug === fiche.outil!.domaine);
      const p = d?.postes.find((x) => x.slug === fiche.outil!.poste);
      if (!d || !p) throw new Error(`app/metiers/page.tsx : poste « ${fiche.outil.domaine}/${fiche.outil.poste} » introuvable ou non publié`);
      return {
        fiche,
        code: p.code,
        isco: p.isco08,
        domaine: { slug: d.slug, libelle: d.libelle },
        voisins: d.postes.filter((x) => x.slug !== p.slug).map((x) => ({ libelle: court(x.libelle), code: x.code })),
        horsOutil: false,
        note: null,
      };
    }
    if (fiche.isco) {
      const d = fiche.isco.domaine ? domaines.find((x) => x.slug === fiche.isco!.domaine) : undefined;
      return {
        fiche,
        code: CODES_CATEGORIE_HUB[fiche.isco.categorie],
        isco: fiche.isco.code,
        domaine: d ? { slug: d.slug, libelle: d.libelle } : null,
        voisins: [],
        horsOutil: true,
        note: fiche.isco.note ?? null,
      };
    }
    return { fiche, code: null, isco: null, domaine: null, voisins: [], horsOutil: true, note: fiche.sansCode?.note ?? null };
  });
}

const CARTES = construireCartes();
const SECTIONS = [
  ...ORDRE.map((code) => ({ code, cartes: CARTES.filter((c) => c.code === code) })),
  { code: null, cartes: CARTES.filter((c) => c.code === null) },
].filter((s) => s.cartes.length > 0);

// Date de la dernière révision du hub : affichée sous l'introduction, transmise en
// dateModified (JSON-LD) et en lastModified (sitemap.ts). À avancer à chaque révision
// du classement ou des sources, jamais pour une simple retouche de style.
const UPDATED_ISO = METIERS_HUB_UPDATED;
const UPDATED_LABEL = '27 novembre 2026';

// Études de référence citées dans la section « Ce que disent les études récentes ».
// Règle : source primaire, date, et la limite indiquée par les auteurs eux-mêmes.
const ETUDES = [
  {
    source: "Organisation internationale du Travail (OIT), Gmyrek et al., ILO Working Paper 140",
    date: '20 mai 2025',
    url: 'https://www.ilo.org/publications/generative-ai-and-jobs-refined-global-index-occupational-exposure',
    texte: "3 265 tâches de 427 professions de la nomenclature internationale ISCO-08, chacune notée de 0 à 1 selon le potentiel technique de l'IA générative. Chaque profession est rangée dans une catégorie, du gradient 4 (exposition élevée et homogène) à « non exposé ». C'est la source du classement de cette page et de l'outil « Où passe la ligne ». Données publiées sous licence CC BY 4.0.",
    limite: "Les auteurs mesurent un potentiel technique, pas une adoption ni des pertes d'emplois. La méthode part d'évaluations faites en Pologne, étendues au niveau international, avec une part de jugement subjectif.",
    article: { label: 'Notre méthodologie détaillée', href: '/methodologie-exposition-ia/' },
  },
  {
    source: 'Coface et Observatoire des emplois menacés et émergents',
    date: '1er avril 2026',
    url: 'https://www.coface.com/fr/actualites-economie-conseils-d-experts/emplois-competences-valeur-ce-que-l-ia-est-en-train-de-bouleverser',
    texte: "Une autre mesure, avec sa propre méthode : 923 professions décomposées en tâches, chacune notée selon des règles explicites. En France, 16 % du contenu du travail serait techniquement à la portée des outils actuels, ce qui place le pays dans la moyenne européenne. Les familles les plus exposées sont le management et l'administration, les métiers créatifs, le droit et la finance, l'ingénierie et l'informatique.",
    limite: "L'étude mesure une exposition technique des tâches. Ses auteurs précisent qu'elle ne préjuge d'aucun volume de destructions nettes d'emplois.",
  },
  {
    source: 'Banque de France et HEC Paris (LIFT), Bloc-notes Éco n° 463',
    date: '8 octobre 2026',
    url: 'https://www.banque-france.fr/fr/publications-et-statistiques/publications/ia-generative-les-premiers-changements-du-marche-du-travail-sur-les-jeunes',
    texte: "Un indice d'exposition construit sur le répertoire des métiers de France Travail (ROME), croisé avec les embauches réelles. Chez les 21-29 ans, les embauches en CDI des métiers les plus exposés se situent en mars 2026 à 28,3 % sous leur niveau de novembre 2022, contre 7,5 % pour les métiers les moins exposés.",
    limite: "Les auteurs établissent une association, pas un effet causal, et leur indice mesure une capacité technique, pas l'usage réel de l'IA.",
    article: { label: "Notre lecture détaillée de l'étude", href: '/article/ia-embauche-jeunes-etude-banque-de-france/' },
  },
  {
    source: 'France Travail, enquête auprès des employeurs',
    date: '17 novembre 2026',
    url: 'https://www.francetravail.org/accueil/actualites/infographies/2026/l-impact-de-l-ia-a-5-ans-sur-les-metiers-la-vision-des-employeurs.html?type=article',
    texte: "16 000 établissements interrogés sur l'impact de l'IA à cinq ans. Les métiers qu'ils jugent fragilisés, ceux dont l'IA peut réaliser l'essentiel des tâches : secrétaires administratifs, aides-comptables, assistants juridiques. Avocats, responsables RH, radiologues et chefs de projet sont rangés parmi les métiers où, selon les employeurs, l'IA assiste et l'humain décide.",
    limite: "Ce sont des anticipations d'employeurs, pas une mesure. Seuls 6 % d'entre eux pensent que l'IA pourrait concurrencer l'humain sur leur métier principal.",
    article: { label: "Notre lecture de l'enquête complète", href: '/article/ia-entreprises-enquete-france-travail-2026/' },
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
    article: { label: "Licenciements et IA : les vraies raisons", href: '/article/licenciements-ia-vraies-raisons/' },
  },
];

const FAQ = [
  {
    q: "Quels métiers sont les plus exposés à l'IA ?",
    a: "Dans les données de l'OIT, les postes administratifs et d'exécution : employé administratif, aide-comptable, assistant RH, ainsi que l'analyste financier et le développeur web, tous en gradient 4 (exposition élevée et homogène). France Travail cite de son côté les secrétaires administratifs, les aides-comptables et les assistants juridiques. Dans un même domaine, le niveau de poste change beaucoup le résultat : l'aide-comptable est plus exposé que l'expert-comptable. Exposé ne veut pas dire supprimé : c'est d'abord la composition du travail qui change.",
  },
  {
    q: "Quels métiers sont les moins exposés à l'IA ?",
    a: "Ceux qui reposent sur le geste, le terrain ou la relation : artisans, cuisiniers, aides à domicile, psychologues, selon les employeurs interrogés par France Travail. Dans les usages observés par Anthropic, environ 30 % des travailleurs ont une exposition nulle. Parmi les métiers présentés ici, l'OIT classe le professeur des écoles, l'enseignant du secondaire et le médecin généraliste en « non exposé », l'avocat, l'architecte et le directeur financier en exposition minimale. « Non exposé » est un libellé de classement, pas une garantie.",
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
    q: "Faut-il se servir de l'IA dans son métier ?",
    a: "Cela dépend moins de l'outil que de la place qu'on lui donne. Un professionnel qui l'utilise sur ses tâches courantes gagne du temps ; celui qui l'ignore voit ce temps gagné par ses concurrents. Les études récentes montrent aussi un effet plus discret : dans les métiers exposés, ce sont les postes de débutants qui se raréfient en premier.",
  },
  {
    q: "Ces analyses sont-elles fiables ? Qui les produit ?",
    a: "ialucide est une publication indépendante. Le classement de cette page reprend les catégories publiées par l'OIT (Gmyrek et al., 2025, ILO Working Paper 140, données sous licence CC BY 4.0), sans les modifier ; la méthode est détaillée sur la page méthodologie. Chaque analyse s'appuie aussi sur des études publiées et datées (Coface et OEM, Banque de France, France Travail, Direction générale du Trésor, Anthropic) et cite ses sources, avec leurs limites. Les fiches signées « La rédaction ialucide » sont relues sous la responsabilité du directeur de la publication. ialucide ne vend ni formation ni logiciel.",
  },
];

function MetierCard({ carte }: { carte: CarteHub }) {
  const { fiche, code, isco, domaine, voisins, horsOutil, note } = carte;
  const couleur = code ? COULEUR_CATEGORIE[code] : '#dcd8cb';
  return (
    <div
      className="bg-white p-5 group hover:shadow-[0_2px_32px_rgba(28,28,23,0.08)] transition-shadow duration-300 flex flex-col"
      style={{ borderLeft: `4px solid ${couleur}` }}
    >
      <h3
        className="text-[1.375rem] font-bold text-[#1c1c17] mb-1 group-hover:text-[#8a6a1c] transition-colors duration-300"
        style={{ letterSpacing: '-0.02em' }}
      >
        {fiche.titre}
      </h3>
      <p className="font-mono text-xs tracking-[0.05em] text-[#6b6b6b] mb-3">
        {code ? <>{texte(`categorie.${code}.libelle`)} · ISCO-08 {isco}</> : 'Sans catégorie OIT'}
        {horsOutil && <> · hors outil pour l&apos;instant</>}
      </p>
      <p className="text-base text-[#6b6b6b] leading-relaxed mb-3">
        {fiche.description}
      </p>
      {note && <p className="text-sm text-[#6b6b6b] leading-relaxed mb-3">{note}</p>}
      {voisins.length > 0 && (
        <p className="text-sm text-[#6b6b6b] leading-relaxed mb-3">
          Dans le même domaine :{' '}
          {voisins.map((v, i) => (
            <span key={v.libelle}>
              {i > 0 && ' ; '}
              {v.libelle} ({texte(`categorie.${v.code}.libelle`).toLowerCase()})
            </span>
          ))}
          .
        </p>
      )}
      <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2">
        <Link
          href={`/article/${fiche.slug}/`}
          className="font-mono inline-flex items-center gap-1 text-xs font-bold tracking-widest uppercase text-[#8a6a1c] hover:text-[#1c1c17] transition-colors"
        >
          Lire l&apos;analyse
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
            <path d="M2 5.5H9M6 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        {domaine && (
          <Link
            href={`/metiers/${domaine.slug}/`}
            className="font-mono inline-flex items-center gap-1 text-xs font-bold tracking-widest uppercase text-[#1a3a4a] hover:text-[#8a6a1c] transition-colors"
          >
            {domaine.libelle} : les postes
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
              <path d="M2 5.5H9M6 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        )}
      </div>
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
  name: "Métiers et IA en France : analyses par profession, d'après les catégories de l'OIT",
  description: PAGE_DESCRIPTION,
  path: '/metiers/',
  dateModified: UPDATED_ISO,
  items: SECTIONS.flatMap((section) =>
    section.cartes.map((c) => ({ name: c.fiche.titre, url: `/article/${c.fiche.slug}/` })),
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
            Les métiers sont rangés selon les catégories publiées par l&apos;Organisation internationale du Travail (OIT) en 2025, qui mesurent le potentiel technique de l&apos;IA générative sur les tâches de chaque profession. Ce potentiel ne dit ni quand ni si les entreprises s&apos;en serviront. La méthode est détaillée <a href="#methode" className="text-[#8a6a1c] underline underline-offset-2">plus bas</a>.
          </p>
          <p className="text-base text-[#6b6b6b] leading-relaxed mb-4">
            D&apos;autres mesures existent, avec leur propre méthode. Selon l&apos;étude de Coface et de l&apos;Observatoire des emplois menacés et émergents publiée le 1er avril 2026, 16 % du contenu du travail en France serait techniquement à la portée des outils actuels, et environ une profession sur huit dépasse le seuil de 30 % de tâches concernées. L&apos;étude mesure une exposition technique et ne prévoit aucun volume de destructions d&apos;emplois. Le chiffre de 5 millions d&apos;emplois, repris par une partie de la presse, n&apos;y figure pas.
          </p>
          <p className="font-mono text-xs tracking-[0.1em] uppercase text-[#6b6b6b]">
            Mis à jour le <time dateTime={UPDATED_ISO}>{UPDATED_LABEL}</time>
          </p>
        </header>

        {/* Légende : les six catégories de l'OIT, du plus au moins exposé */}
        <div className="flex flex-wrap gap-x-5 gap-y-3 mb-12">
          {ORDRE.map((code) => (
            <div key={code} className="flex items-center gap-2">
              <div className="w-3 h-3" style={{ backgroundColor: COULEUR_CATEGORIE[code] }} />
              <span className="font-mono text-xs font-bold tracking-[0.1em] uppercase text-[#6b6b6b]">
                {texte(`categorie.${code}.libelle`)}
              </span>
            </div>
          ))}
        </div>

        {/* Sections par catégorie OIT */}
        {SECTIONS.map((section) => (
          <section key={section.code ?? 'sans-code'} className="mb-16">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-8" style={{ backgroundColor: section.code ? COULEUR_CATEGORIE[section.code] : '#dcd8cb' }} />
              <h2 className="text-[1.75rem] font-bold text-[#1c1c17]" style={{ letterSpacing: '-0.02em' }}>
                {section.code ? texte(`categorie.${section.code}.libelle`) : 'Sans code ISCO-08 fidèle'}
              </h2>
            </div>
            <p className="text-base text-[#6b6b6b] leading-relaxed mb-6 max-w-3xl">
              {section.code
                ? INTRO_CATEGORIE[section.code]
                : "Ces métiers n'ont pas d'équivalent fidèle dans la nomenclature de l'OIT : nous n'affichons pas de catégorie plutôt que d'en choisir une approximative."}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.cartes.map((carte) => (
                <MetierCard key={carte.fiche.slug} carte={carte} />
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
            Comment les métiers sont classés
          </h2>
          <p className="text-base text-[#1c1c17] leading-relaxed mb-4">
            L&apos;OIT a noté chacune des 3 265 tâches des 427 professions de la nomenclature internationale ISCO-08, de 0 à 1, selon ce que l&apos;IA générative peut techniquement en réaliser. Elle range ensuite chaque profession dans une catégorie, d&apos;après la moyenne des scores de ses tâches (μ) et leur dispersion (σ) :
          </p>
          <ul className="space-y-3 mb-6">
            {([
              ['G4', 'μ ≥ 0,6 et μ − σ ≥ 0,5'],
              ['G3', '0,5 ≤ μ < 0,6 et μ + σ ≥ 0,5'],
              ['G2', '0,4 ≤ μ < 0,5 et μ + σ ≥ 0,5'],
              ['G1', 'μ < 0,4 et μ + σ ≥ 0,5'],
              ['MIN', 'μ < 0,5 et μ + σ > 0,4, hors gradients'],
              ['NE', 'aucune des conditions précédentes'],
            ] as [CodeCategorie, string][]).map(([code, condition]) => (
              <li key={code} className="text-base text-[#1c1c17] leading-relaxed pl-4" style={{ borderLeft: `3px solid ${COULEUR_CATEGORIE[code]}` }}>
                <strong>{texte(`categorie.${code}.libelle`)}</strong>&nbsp;: {condition}.
              </li>
            ))}
          </ul>
          <p className="text-base text-[#6b6b6b] leading-relaxed mb-4">
            La catégorie affichée est celle que publie l&apos;OIT, sans modification. Pour les métiers couverts par l&apos;outil « Où passe la ligne », c&apos;est celle du poste correspondant, et la page du domaine compare les postes voisins : dans un même métier, le niveau de poste change beaucoup le résultat. Pour les métiers hors outil, c&apos;est celle du code ISCO-08 le plus proche, un choix de correspondance fait par ialucide. Quand aucun code ne correspond fidèlement, nous n&apos;affichons pas de catégorie.
          </p>
          <p className="text-base text-[#6b6b6b] leading-relaxed mb-4">
            Être exposé ne veut pas dire disparaître : ces catégories mesurent ce que l&apos;IA générative sait faire, pas ce que les entreprises décideront d&apos;en faire. Les études ci-dessous en donnent d&apos;autres éclairages. Source, licence, seuils et limites : <Link href="/methodologie-exposition-ia/" className="text-[#8a6a1c] underline underline-offset-2">méthodologie complète</Link>.
          </p>
          <p className="text-base text-[#6b6b6b] leading-relaxed">
            Le classement est révisé à chaque nouvelle version des données de l&apos;OIT. Révision du {UPDATED_LABEL} : le classement maison en trois niveaux est remplacé par les catégories de l&apos;OIT.
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
                    href={etude.article.href}
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

        {/* Outil « Où passe la ligne » */}
        <EncartOutil />

      </div>
    </div>
  );
}

import { getAllArticles, getArticleBySlug, getRelatedArticles, REDACTION_AUTHOR } from '@/lib/articles';
import { notFound } from 'next/navigation';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema, type Options as SanitizeSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import Link from 'next/link';
import ArticleSidebar from '@/components/ArticleSidebar';
import ArticleCard from '@/components/ArticleCard';
import ArticleVideos from '@/components/ArticleVideos';
import { pageMetadata, ORGANIZATION_ID, SITE_LOGO, SITE_NAME, SITE_URL } from '@/lib/seo';

const CATEGORY_MAP = {
  metiers:       { label: 'Métiers',       href: '/metiers/' },
  outils:        { label: 'Outils',        href: '/outils/' },
  comprendre:    { label: 'Comprendre',    href: '/comprendre/' },
  'education-ia': { label: 'Éducation IA', href: '/education-ia/' },
} as const;

// FAQPage schema par article, sur le même modèle que le tableau FAQ codé en
// dur sur /metiers/ — un article n'entre ici que si son contenu affiche
// réellement une section FAQ correspondante.
const ARTICLE_FAQS: Record<string, { q: string; a: string }[]> = {
  'metiers-ia-qui-recrutent-offres-emploi': [
    {
      q: "Quel métier de l'IA recrute le plus en France ?",
      a: "Le data engineer, avec 1 548 offres mentionnant le terme sur France Travail le 11 novembre 2026, devant l'ingénieur IA (699) et le data scientist (402). Ces trois métiers concentrent l'essentiel des recrutements liés à l'IA.",
    },
    {
      q: "Le métier de prompt engineer recrute-t-il ?",
      a: "Très peu. Le relevé du 11 novembre 2026 ne trouve que deux offres distinctes portant cet intitulé dans toute la France. La rédaction d'instructions pour les modèles est devenue une compétence attendue dans d'autres postes, surtout d'ingénieur et de développeur.",
    },
    {
      q: "Peut-on travailler dans l'IA sans bac+5 ?",
      a: "C'est difficile sur les postes techniques : sur les 61 offres lues en détail, 25 précisent le diplôme, et 22 d'entre elles demandent un bac+5 ou un bac+4/5. Aucune ne mentionne une formation courte. Les voies plus accessibles passent par l'alternance, les postes d'adoption de l'IA en entreprise ou l'intégration de l'IA dans son métier actuel.",
    },
    {
      q: "Combien gagne-t-on dans un métier de l'IA en début de carrière ?",
      a: "Dans notre échantillon de 61 offres, les CDI ouverts aux débutants qui affichent un salaire annoncent de 36 000 à 47 000 € par an. Avec un à cinq ans d'expérience, les fourchettes vont de 32 000 à 80 000 €, et la plupart démarrent à 45 000 € ou plus. Ces montants sont des ordres de grandeur, pas une grille.",
    },
    {
      q: "À quelle fréquence ces chiffres sont-ils mis à jour ?",
      a: "Tous les trois mois, avec les mêmes recherches sur France Travail. Le prochain relevé est prévu en février 2027.",
    },
  ],
  'orientation-scolaire-ia-parents': [
    {
      q: "Faut-il éviter les filières jugées « à risque » face à l'IA ?",
      a: "Pas nécessairement. Une filière rarement citée comme « automatisable » n'est jamais totalement à l'abri d'une évolution, et une filière souvent citée comme exposée conserve des tâches qui resteront humaines longtemps. Le critère filière seul est insuffisant ; il doit se combiner avec l'intérêt réel de l'enfant et la réversibilité du parcours.",
    },
    {
      q: "Mon enfant utilise déjà l'IA pour ses devoirs, dois-je m'inquiéter ?",
      a: "L'usage n'est pas le problème en soi, l'usage exclusif l'est. Un enfant qui utilise l'IA pour accélérer une tâche mais continue à produire du travail personnel sans assistance sur d'autres tâches développe les deux compétences. Un enfant qui délègue systématiquement perd l'entraînement que ces tâches étaient censées offrir.",
    },
    {
      q: "À quel âge commencer à parler d'IA et d'orientation avec son enfant ?",
      a: "Dès le collège, sous une forme légère : discuter des outils, de ce qu'ils font bien ou mal, sans en faire un sujet anxiogène. L'orientation proprement dite se construit surtout au lycée, mais les habitudes d'usage de l'IA se forment plus tôt.",
    },
    {
      q: "Est-ce qu'un diplôme reste utile si l'IA automatise une partie du métier visé ?",
      a: "Oui, dans la grande majorité des cas : le diplôme atteste souvent d'autre chose que la seule exécution de tâches, comme la méthode, le réseau, la crédibilité, l'accès à une profession réglementée. La question n'est pas « le diplôme sert-il encore ? » mais « quelles compétences, en plus du diplôme, viennent le compléter ? ».",
    },
    {
      q: "Comment savoir si je transmets de l'angoisse plutôt que de la lucidité à mon enfant ?",
      a: "Un bon indicateur : si vos échanges sur l'orientation tournent surtout autour de ce qu'il faut éviter plutôt que de ce que l'enfant a envie de construire, la balance penche probablement du côté de l'angoisse. Reformuler régulièrement en termes de curiosité et de compétences plutôt qu'en termes de risques aide à rééquilibrer.",
    },
  ],
  'cours-claude-anthropic-academy-bilan': [
    {
      q: "L'Anthropic Academy est-elle vraiment gratuite ?",
      a: "Oui pour les cours et l'attestation de complétion. Les exercices pratiques des cours Claude Code demandent un compte Claude payant ou une clé API. Seule la certification Pearson VUE est payante, de 99 à 175 dollars selon le niveau.",
    },
    {
      q: "Faut-il payer la certification pour que ça compte sur un CV ?",
      a: "Non, pas systématiquement. L'attestation gratuite suffit à documenter une curiosité et une pratique réelle sur un profil professionnel. La certification payante n'ajoute de la valeur que dans des contextes techniques ou commerciaux précis, détaillés plus haut.",
    },
    {
      q: "Un indépendant peut-il passer la certification sans appartenir à une grande entreprise ?",
      a: "Oui. L'entrée au Claude Partner Network au niveau de base est gratuite et ouverte aux freelances et indépendants, malgré ce que le nom du programme laisse supposer.",
    },
    {
      q: "La certification Claude est-elle finançable par le CPF en France ?",
      a: "Non. Anthropic n'a pas de certification Qualiopi, RNCP ou Répertoire Spécifique. Pour un financement CPF ou OPCO, il faut passer par un organisme de formation français certifié, sur un autre programme.",
    },
    {
      q: "Combien de temps avant d'être vraiment opérationnel avec Claude après ces cours ?",
      a: "Le socle non technique de six à huit heures donne des réflexes d'usage corrects en quelques jours de pratique. Le niveau développeur, quinze à vingt heures de cours, demande ensuite plusieurs semaines de projet réel pour que les notions se transforment en compétence exploitable.",
    },
  ],
  'guide-ia-juristes-avocats-2026': [
    {
      q: "Harvey est-il conforme au RGPD pour un cabinet français ?",
      a: "Pas de réponse tranchée à ce jour. Harvey est une entreprise américaine dont les données sont hébergées aux États-Unis, ce qui expose au Cloud Act : les autorités américaines peuvent exiger l'accès aux données sans en informer le client. Le RGPD encadre le transfert de données personnelles hors Union européenne, mais le CNB n'a pas rendu d'avis formel sur Harvey à ce jour. Un cabinet qui envisage l'outil pour des dossiers sensibles doit traiter cette zone grise comme un risque à documenter, pas comme une question déjà réglée par un éditeur qui affirme sa conformité.",
    },
    {
      q: "Ces outils donnent-ils accès aux bases de données de jurisprudence payantes ?",
      a: "Ça dépend complètement de l'outil, et c'est une confusion fréquente. Doctrine et Ordalie intègrent l'accès à la jurisprudence dans leur offre : c'est leur cœur de métier, la couche IA vient s'ajouter à une base documentaire déjà constituée. Harvey et Luminance n'ont pas cette fonction pour le droit français : ce sont des outils d'analyse et de rédaction, pas des bases de données juridiques. L'abonnement Claude grand public ou ChatGPT n'a accès à aucune base de jurisprudence à jour, ce qui explique le risque d'hallucination déjà évoqué plus haut : sans base vérifiée en arrière-plan, l'outil peut citer un arrêt qui n'existe pas. Claude for Legal fait exception sur ce point précis, avec une intégration Thomson Reuters pour la recherche juridique, mais reste positionné sur les grands cabinets internationaux plutôt que sur la pratique française courante.",
    },
    {
      q: "Ordalie ou Harvey, lequel choisir ?",
      a: "La question part d'une fausse équivalence : ces deux outils ne visent pas le même cabinet. Harvey cible les structures internationales avec des budgets à cinq chiffres par utilisateur et par an, sur des dossiers transfrontaliers en volume. Ordalie cible les avocats solos et les cabinets de 2 à 20 personnes en pratique française, à un tarif accessible dès l'entrée de gamme. Un cabinet de taille moyenne qui hésite entre les deux n'a en réalité pas le choix : son budget et son volume de dossiers transfrontaliers tranchent la question avant même de comparer les fonctionnalités.",
    },
    {
      q: "Doctrine ou Ordalie, pour un cabinet français ?",
      a: "Les deux sont pertinents, et pas nécessairement en exclusion l'un de l'autre. Doctrine reste la référence la plus établie, avec la couverture documentaire la plus large et un partenariat officiel avec le Barreau de Paris depuis plus longtemps. Ordalie mise sur des modèles entraînés spécifiquement sur le droit français plutôt que sur une base documentaire élargie, à un tarif plus accessible pour un avocat solo. Un cabinet qui démarre avec un budget serré peut commencer par Ordalie et ajouter Doctrine plus tard, ou l'inverse selon ce qui pèse le plus dans sa pratique quotidienne, recherche documentaire ou aide à la rédaction.",
    },
    {
      q: "Peut-on remplacer Doctrine par Claude ou ChatGPT pour la recherche juridique ?",
      a: "Non, pas avec l'abonnement Claude grand public, et ce n'est pas une question de préférence mais de fonction. Claude et ChatGPT, dans leur version grand public, n'ont pas accès à une base de jurisprudence française à jour et peuvent générer une citation de décision inexistante avec une syntaxe parfaitement crédible. Ils sont utiles en complément, pour la rédaction, la reformulation ou le résumé, jamais comme substitut à un outil qui interroge une base documentaire vérifiée. Claude for Legal dispose bien d'un accès documentaire dédié via Thomson Reuters, mais cible aujourd'hui les grands cabinets internationaux, pas la pratique française courante - pour un cabinet français de taille moyenne, Doctrine ou Ordalie restent la réponse pertinente.",
    },
    {
      q: "Combien coûte un abonnement Harvey ?",
      a: "Aucun tarif n'est publié. Les estimations du marché situent les contrats entre 1 000 et 3 000 dollars par avocat et par mois, réservés aux cabinets qui peuvent engager plusieurs dizaines de milliers de dollars par an et par utilisateur. Il n'existe ni abonnement individuel ni essai gratuit, ce qui exclut de fait l'essentiel des cabinets français de moins de 20 avocats.",
    },
    {
      q: "Claude for Legal ou Doctrine, lequel choisir pour un cabinet français ?",
      a: "Ce ne sont pas des concurrents directs aujourd'hui. Doctrine est conçu pour le droit français avec hébergement en France et une base documentaire construite pour cette pratique. Claude for Legal cible pour l'instant les grands cabinets internationaux, sans hébergement européen confirmé ni tarification publique. Pour un cabinet français de taille courante, Doctrine reste le choix par défaut, Claude for Legal étant un outil à surveiller plutôt qu'une alternative disponible dans l'immédiat.",
    },
  ],
  'facturation-electronique-auto-entrepreneur-plateforme-gratuite': [
    {
      q: "La facturation électronique est-elle obligatoire pour un auto-entrepreneur ?",
      a: "Oui. Depuis le 1er septembre 2026, tout auto-entrepreneur doit pouvoir recevoir des factures électroniques via une plateforme agréée, y compris en franchise de TVA. L'émission devient obligatoire au 1er septembre 2027 pour les factures adressées à des clients professionnels établis en France.",
    },
    {
      q: "Existe-t-il une plateforme de facturation électronique gratuite ?",
      a: "Oui, plusieurs plateformes agréées proposent une offre à 0 € pour les indépendants. Vérifiez qu'elle couvre l'émission et la réception, et notez ses plafonds de factures ou d'utilisateurs.",
    },
    {
      q: "Un site de facturation gratuit qui génère des PDF suffit-il ?",
      a: "Non, pour les clients professionnels établis en France à partir de septembre 2027. Un PDF classique n'est pas une facture électronique au sens de la réforme : il faut un format structuré (Factur-X, UBL ou CII) transmis par une plateforme agréée.",
    },
    {
      q: "Comment corriger une facture électronique déjà émise ?",
      a: "On ne modifie pas une facture émise, électronique ou non. On émet une facture d'avoir qui annule tout ou partie de la facture initiale, puis, si nécessaire, une nouvelle facture. Votre plateforme gère ces avoirs dans le même circuit que les factures.",
    },
  ],
  'agent-ia-pme-comparatif-2026': [
    {
      q: "Quelle différence entre un assistant IA et un agent IA ?",
      a: "Un assistant répond à une demande dans une conversation. Un agent reçoit un objectif, décide des étapes, utilise des outils et rend un résultat terminé. Pour comparer les assistants de conversation entre eux, voir notre comparatif des LLM pour un usage professionnel.",
    },
    {
      q: "Faut-il un agent différent pour chaque tâche ?",
      a: "Non. La plupart des offres permettent de créer plusieurs agents dans le même abonnement, chacun avec ses instructions et ses outils. Limiter chaque agent aux outils dont il a besoin réduit le risque d'erreur.",
    },
    {
      q: "Peut-on utiliser son abonnement ChatGPT ou Claude dans un autre outil ?",
      a: "Certaines plateformes, comme Rerun, le proposent en pilotant les outils officiels de ces éditeurs. Vérifiez que l'usage prévu reste compatible avec les conditions de votre abonnement, en particulier pour un usage d'équipe.",
    },
    {
      q: "Ces agents sont-ils fiables pour des tâches longues ?",
      a: "Pas encore. Sur le benchmark OSWorld 2.0, publié en juin 2026, le meilleur modèle termine environ une tâche longue sur cinq. Le guide de l'automatisation IA détaille ces résultats.",
    },
  ],
  'automatisation-ia-entreprise-guide-2026': [
    {
      q: "Quelle est la différence entre une automatisation et un agent IA ?",
      a: "Dans une automatisation, un humain définit les étapes à l'avance et l'IA n'intervient qu'à des points précis. Un agent reçoit un objectif et choisit lui-même ses étapes et ses outils. La première est plus prévisible, le second plus souple.",
    },
    {
      q: "Faut-il savoir coder pour automatiser avec l'IA ?",
      a: "Pas pour les deux premiers niveaux. Les fonctions intégrées s'activent dans les réglages, et n8n, Make ou Zapier se configurent par blocs visuels. Le code devient utile pour connecter un logiciel métier dépourvu de connecteur ou pour héberger n8n sur ses propres serveurs.",
    },
    {
      q: "Combien coûte une première automatisation IA ?",
      a: "Pour un workflow simple, les offres d'entrée de gamme des plateformes no-code se situent entre une dizaine et une cinquantaine d'euros par mois, auxquels peut s'ajouter la consommation du modèle d'IA. Le coût principal reste le temps passé à décrire le processus et à le tester.",
    },
    {
      q: "Les agents IA vont-ils remplacer Zapier ou Make ?",
      a: "Ces éditeurs intègrent eux-mêmes des agents dans leurs workflows, et Microsoft réunit workflows et agents dans Copilot Studio. Le mouvement de 2026 va vers la combinaison des deux : des étapes fixes là où l'entreprise a besoin de prévisibilité, un agent là où il faut de la souplesse.",
    },
  ],
};

// Autorise uniquement <div class="cta-button-wrapper">, <a class="cta-button" href="..."> et
// <video> (attributs de lecture listés ci-dessous) en plus du schéma par défaut (GitHub) - tout le
// reste du HTML brut reste filtré. Vidéos hébergées dans public/videos/ (voir CLAUDE.md).
const articleContentSchema: SanitizeSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), 'video'],
  attributes: {
    ...defaultSchema.attributes,
    video: ['src', 'poster', 'controls', 'preload', 'playsInline', 'muted', 'loop', 'width', 'height', 'ariaLabel'],
    a: [
      ...(defaultSchema.attributes?.a ?? []).filter(
        (attr) => !(Array.isArray(attr) && attr[0] === 'className')
      ),
      ['className', 'data-footnote-backref', 'cta-button'],
    ],
    div: [
      ...(defaultSchema.attributes?.div ?? []),
      ['className', 'cta-button-wrapper'],
    ],
  },
};

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map(a => ({ slug: a.slug }));
}

// Coupe un texte à `max` caractères au plus, sur une fin de mot, avec une ellipse.
// Évite les meta descriptions coupées en plein mot (ex. "sans être ras").
function truncateAtWord(text: string, max: number): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  const base = lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut;
  return base.replace(/[\s,;:.\-–—(]+$/u, '') + '…';
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  // Balise <title> : seo_title si fourni, sinon le titre éditorial.
  // Suffixe de marque ajouté seulement si le total reste <= 60 caractères
  // (au-delà, Google tronque ou réécrit le titre).
  const baseTitle = article.seo_title || article.title;
  const pageTitle = baseTitle.length <= 49 ? `${baseTitle} | ialucide` : baseTitle;
  // Le suffixe est géré ici (title absolu), pas par le template du layout.
  // og:title garde le titre éditorial, plus parlant en partage que le seo_title.
  return pageMetadata({
    absoluteTitle: pageTitle,
    ogTitle: article.title,
    description: truncateAtWord(article.excerpt || '', 155),
    path: `/article/${slug}/`,
    image: article.image_url || undefined,
    type: 'article',
    publishedTime: article.date,
    modifiedTime: article.updated || article.date,
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const processed = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSanitize, articleContentSchema)
    .use(rehypeStringify)
    .process(article.content ?? '');
  const contentHtml = processed.toString();

  const related = getRelatedArticles(article);
  const allRecent = getAllArticles().filter(a => a.slug !== slug).slice(0, 3);
  const sameTagArticles = related.slice(0, 3);
  const sidebarArticles = related.length > 0 ? related : allRecent;

  const sameCategoryArticles = article.category
    ? getAllArticles()
        .filter(a => a.slug !== slug && a.category === article.category)
        .slice(0, 3)
    : [];

  const formattedDate = article.date
    ? new Date(article.date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  // Date de mise à jour optionnelle, au format JJ/MM/AAAA.
  const formattedUpdated = article.updated
    ? new Date(article.updated).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    : '';

  const catEntry = article.category && article.category in CATEGORY_MAP
    ? CATEGORY_MAP[article.category as keyof typeof CATEGORY_MAP]
    : null;
  const truncatedTitle = article.title.length > 40
    ? article.title.slice(0, 40) + '…'
    : article.title;

  const breadcrumbItems = [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://ialucide.fr/' },
    ...(catEntry ? [{
      '@type': 'ListItem',
      position: 2,
      name: catEntry.label,
      item: `https://ialucide.fr${catEntry.href}`,
    }] : []),
    { '@type': 'ListItem', position: catEntry ? 3 : 2, name: article.title },
  ];
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  };

  const canonicalUrl = `https://ialucide.fr/article/${slug}/`;
  const absoluteImageUrl = article.image_url
    ? (article.image_url.startsWith('http')
        ? article.image_url
        : `https://ialucide.fr${article.image_url}`)
    : undefined;

  const authorName = article.author || REDACTION_AUTHOR;
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    datePublished: article.date,
    dateModified: article.updated || article.date,
    author: authorName === REDACTION_AUTHOR
      ? {
          '@type': 'Organization',
          name: REDACTION_AUTHOR,
          url: 'https://ialucide.fr/about/',
        }
      : {
          '@type': 'Person',
          name: authorName,
          url: 'https://ialucide.fr/about/',
          sameAs: ['https://www.linkedin.com/in/danielrollin', 'https://x.com/daniel_rol22591'],
        },
    publisher: {
      '@type': 'Organization',
      '@id': ORGANIZATION_ID,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      logo: {
        '@type': 'ImageObject',
        url: SITE_LOGO.url,
        width: SITE_LOGO.width,
        height: SITE_LOGO.height,
      },
    },
    ...(absoluteImageUrl ? { image: absoluteImageUrl } : {}),
    description: article.excerpt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
  };

  const articleFaq = ARTICLE_FAQS[slug];
  const faqJsonLd = articleFaq
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: articleFaq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a,
          },
        })),
      }
    : null;

  return (
    <div className="pt-24 md:pt-32 pb-20 bg-[#fcf9f0] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Fil d'Ariane" className="mb-8">
          <ol className="font-mono flex flex-wrap items-center gap-0 text-[11px] tracking-[0.05em]">
            <li>
              <Link href="/" className="text-[#6b6b6b] hover:text-[#c9a84c] transition-colors duration-200">
                Accueil
              </Link>
            </li>
            {catEntry && (
              <>
                <li className="mx-2 text-[#8a6a1c] select-none">›</li>
                <li>
                  <Link href={catEntry.href} className="text-[#6b6b6b] hover:text-[#c9a84c] transition-colors duration-200">
                    {catEntry.label}
                  </Link>
                </li>
              </>
            )}
            <li className="mx-2 text-[#8a6a1c] select-none">›</li>
            <li className="text-[#6b6b6b]">{truncatedTitle}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 lg:gap-16">
          {/* ── Main article ── */}
          <article>
            {/* Header */}
            <header className="mb-12 md:mb-16">
              {/* Tag — Label-MD */}
              <span className="font-mono inline-block text-xs font-bold tracking-[0.1em] uppercase text-[#c9a84c] bg-[#1c1c17] px-3 py-1.5 mb-6">
                {article.tag}
              </span>
              {/* Article headline — Headline-MD scale, Space Grotesk 700 */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1c1c17] leading-[1.05] mb-6" style={{ letterSpacing: '-0.02em' }}>
                {article.title}
              </h1>
              <p className="text-base md:text-lg text-[#1c1c17] leading-relaxed mb-8">
                {article.excerpt}
              </p>
              {/* Label-MD metadata */}
              <div className="font-mono flex flex-wrap items-center gap-4 text-xs font-bold tracking-[0.05em] uppercase text-[#6b6b6b]">
                <span>{authorName}</span>
                <span className="w-1 h-1 bg-[#c9a84c]/40 rounded-full" />
                {formattedDate && <span>{formattedDate}</span>}
                {formattedUpdated && (
                  <>
                    <span className="w-1 h-1 bg-[#c9a84c]/40 rounded-full" />
                    <span>Mis à jour - {formattedUpdated}</span>
                  </>
                )}
                {article.read_time && (
                  <>
                    <span className="w-1 h-1 bg-[#c9a84c]/40 rounded-full" />
                    <span>{article.read_time} min de lecture</span>
                  </>
                )}
              </div>
              <div className="h-px bg-[#c9a84c]/15 mt-8" />
            </header>

            {/* Article body */}
            <div
              className="prose-ia"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
            {contentHtml.includes('<video') && <ArticleVideos />}

            {/* Newsletter CTA */}
            <div className="mt-12 bg-[#1a3a4a] px-6 py-8 text-center">
              <span className="font-mono text-xs font-bold tracking-[0.3em] uppercase text-[#c9a84c] block mb-3">
                Newsletter
              </span>
              <p className="text-[1.75rem] font-bold text-white mb-4" style={{ letterSpacing: '-0.02em' }}>
                Rejoignez 500+ professionnels lucides qui domptent l&apos;IA
              </p>
              <p className="text-base text-[#fcf9f0]/70 mb-6">
                Une analyse par semaine. Concrète. Sans bullshit.
              </p>
              <a
                href="https://ialucide.beehiiv.com/subscribe"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#c9a84c] border border-[#c9a84c] px-8 py-3 hover:bg-[#c9a84c] hover:text-[#1a3a4a] transition-all duration-500"
              >
                S&apos;inscrire gratuitement
              </a>
            </div>

            {/* Ressources CTA */}
            <div className="mt-6 border border-[#c9a84c]/30 bg-white px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-base text-[#1c1c17] leading-relaxed">
                Retrouvez la liste complète des outils validés par{' '}
                <strong className="font-bold">ialucide</strong> sur notre page Ressources.
              </p>
              <Link
                href="/ressources"
                className="font-mono inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#1c1c17] border border-[#1c1c17] px-4 py-2.5 hover:bg-[#1c1c17] hover:text-[#fcf9f0] transition-all duration-500 whitespace-nowrap flex-shrink-0"
              >
                Voir les ressources
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M1 10L10 1M10 1H4M10 1v6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>

            {/* Related articles — même tag (maillage interne SEO) */}
            {(sameTagArticles.length > 0 || allRecent.length > 0) && (
              <div className="mt-16 pt-12 border-t border-[#c9a84c]/20">
                <div className="mb-8">
                  <span className="font-mono text-xs font-bold tracking-[0.3em] uppercase text-[#8a6a1c] block mb-2">
                    {sameTagArticles.length > 0 ? `${article.tag}` : 'À lire aussi'}
                  </span>
                  <h2 className="text-[1.75rem] md:text-3xl font-bold text-[#1c1c17]" style={{ letterSpacing: '-0.02em' }}>
                    {sameTagArticles.length > 0
                      ? `Articles du même métier`
                      : 'Articles récents'}
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(sameTagArticles.length > 0 ? sameTagArticles : allRecent).slice(0, 2).map((rel) => (
                    <Link
                      key={rel.slug}
                      href={`/article/${rel.slug}/`}
                      className="group border border-[#c9a84c]/15 bg-white p-6 hover:border-[#c9a84c]/40 hover:shadow-[0_2px_32px_rgba(28,28,23,0.08)] transition-all duration-300"
                    >
                      <span className="font-mono inline-block text-xs font-bold tracking-[0.1em] uppercase text-[#c9a84c] bg-[#1c1c17] px-3 py-1.5 mb-4">
                        {rel.tag}
                      </span>
                      <h3 className="text-[1.375rem] font-bold text-[#1c1c17] mb-3 group-hover:text-[#c9a84c] transition-colors duration-300 leading-snug" style={{ letterSpacing: '-0.02em' }}>
                        {rel.title}
                      </h3>
                      <p className="text-base text-[#6b6b6b] mb-4 leading-relaxed">
                        {rel.excerpt}
                      </p>
                      <span className="font-mono inline-flex items-center gap-1 text-xs font-bold tracking-widest uppercase text-[#1c1c17] hover:text-[#c9a84c] transition-colors">
                        Lire la suite →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* ── Sidebar ── */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <ArticleSidebar relatedArticles={sidebarArticles} />
            </div>
          </div>
        </div>
      </div>

      {sameCategoryArticles.length > 0 && (
        <section className="py-16 md:py-20 border-t border-[#c9a84c]/20 mt-12 bg-[#fcf9f0]">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <div className="flex items-center gap-6 mb-10 md:mb-14">
              <div className="h-px flex-1 bg-[#c9a84c]/20" />
              <h2 className="font-mono text-xs font-bold tracking-[0.4em] uppercase text-[#8a6a1c]">
                Dans la même catégorie
              </h2>
              <div className="h-px flex-1 bg-[#c9a84c]/20" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {sameCategoryArticles.map(a => (
                <ArticleCard key={a.slug} {...a} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

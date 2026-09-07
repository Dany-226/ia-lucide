import { getAllArticles, getArticleBySlug, getRelatedArticles } from '@/lib/articles';
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
};

// Autorise uniquement <div class="cta-button-wrapper"> et <a class="cta-button" href="...">
// en plus du schéma par défaut (GitHub) — tout le reste du HTML brut reste filtré.
const articleContentSchema: SanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: `${article.title} : Guide 2026 | ialucide`,
    description: (article.excerpt || '').slice(0, 155),
    alternates: {
      canonical: `https://ialucide.fr/article/${slug}/`,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.image_url ? [article.image_url] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: (article.excerpt || '').slice(0, 200),
    },
  };
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

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    datePublished: article.date,
    dateModified: article.date,
    author: {
      '@type': 'Person',
      name: article.author || 'Rédaction IA Lucide',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ialucide',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ialucide.fr/logo-black.png',
        width: 1408,
        height: 768,
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
                <li className="mx-2 text-[#c9a84c] select-none">›</li>
                <li>
                  <Link href={catEntry.href} className="text-[#6b6b6b] hover:text-[#c9a84c] transition-colors duration-200">
                    {catEntry.label}
                  </Link>
                </li>
              </>
            )}
            <li className="mx-2 text-[#c9a84c] select-none">›</li>
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
                <span>{article.author || 'Rédaction IA Lucide'}</span>
                <span className="w-1 h-1 bg-[#c9a84c]/40 rounded-full" />
                {formattedDate && <span>{formattedDate}</span>}
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
                  <span className="font-mono text-xs font-bold tracking-[0.3em] uppercase text-[#c9a84c] block mb-2">
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
              <h2 className="font-mono text-xs font-bold tracking-[0.4em] uppercase text-[#c9a84c]">
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

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Outils IA Recommandés : La Sélection Expert de ialucide',
  description:
    'Découvrez les meilleurs outils d\'intelligence artificielle testés et validés par ialucide pour les comptables, juristes, développeurs et architectes.',
};

const TOOLS = [
  {
    category: "Pour l'Expert-Comptable & la Finance",
    description: 'Automatisez la saisie et passez au conseil stratégique avec ces solutions leaders.',
    items: [
      {
        name: 'Pennylane',
        subtitle: 'La plateforme tout-en-un',
        description: "Le meilleur outil actuel pour piloter la comptabilité en temps réel avec une brique IA puissante pour l'automatisation des flux.",
        cta: 'Découvrir Pennylane',
        href: 'https://www.pennylane.com',
      },
      {
        name: 'Indy',
        subtitle: 'Pour les indépendants',
        description: "Une solution d'une simplicité redoutable pour automatiser la comptabilité des freelances et des petites structures.",
        cta: 'Tester Indy gratuitement',
        href: 'https://www.indy.fr',
      },
    ],
  },
  {
    category: 'Pour les Métiers du Droit',
    description: 'Optimisez vos recherches de jurisprudence et l\'analyse de vos contrats complexes.',
    items: [
      {
        name: 'Harvey',
        subtitle: 'IA juridique générative',
        description: "L'assistant IA conçu spécifiquement pour les cabinets d'avocats et les équipes juridiques. Rédaction, recherche, analyse de contrats au niveau senior.",
        cta: 'Découvrir Harvey',
        href: 'https://www.harvey.ai',
      },
      {
        name: 'Luminance',
        subtitle: 'Analyse de documents juridiques',
        description: 'Plateforme d\'IA spécialisée dans la revue et l\'analyse de contrats complexes. Détecte les anomalies et les risques en quelques secondes.',
        cta: 'Découvrir Luminance',
        href: 'https://www.luminance.com',
      },
      {
        name: 'Claude (Anthropic)',
        subtitle: 'Assistant IA pour le droit',
        description: "Le LLM le plus fiable pour la rédaction de mémos juridiques, l'analyse de jurisprudence et la synthèse de dossiers complexes. Privilégié par les juristes pour sa rigueur.",
        cta: 'Essayer Claude',
        href: 'https://claude.ai',
      },
      {
        name: 'Notion AI',
        subtitle: 'Gestion de base documentaire',
        description: "L'outil idéal pour centraliser votre veille juridique et utiliser l'IA pour résumer instantanément vos dossiers complexes.",
        cta: 'Organiser votre cabinet',
        href: 'https://www.notion.so',
      },
    ],
  },
  {
    category: 'Pour le Développeur Augmenté',
    description: 'Codez plus vite, testez mieux et sécurisez vos déploiements.',
    items: [
      {
        name: 'DeepLearning.AI (Coursera)',
        subtitle: 'Formation Expert',
        description: "Le meilleur parcours certifiant pour comprendre les modèles LLM et devenir un véritable architecte de l'IA.",
        cta: "Se former à l'IA",
        href: 'https://www.deeplearning.ai',
      },
    ],
  },
];

function ToolCard({ tool }: { tool: typeof TOOLS[0]['items'][0] }) {
  return (
    <div className="bg-white border border-[#c9a84c]/15 p-6 hover:border-[#c9a84c]/40 hover:shadow-md transition-all duration-300">
      <div className="mb-3">
        <h3
          className="text-xl font-bold text-[#0e0e0e]"
        >
          {tool.name}
        </h3>
        <span
          className="text-[10px] tracking-widest uppercase text-[#c9a84c]"
        >
          {tool.subtitle}
        </span>
      </div>
      <p
        className="text-sm text-[#6b6b6b] leading-relaxed mb-5"
      >
        {tool.description}
      </p>
      <a
        href={tool.href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase text-[#0e0e0e] border border-[#0e0e0e] px-4 py-2.5 hover:bg-[#0e0e0e] hover:text-[#f4f0e8] transition-all duration-500"
      >
        {tool.cta}
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <path d="M1 10L10 1M10 1H4M10 1v6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </a>
    </div>
  );
}

export default function RessourcesPage() {
  return (
    <div className="bg-[#f4f0e8] min-h-screen pt-24 md:pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-5 md:px-8">

        {/* Header */}
        <header className="mb-16 md:mb-20">
          <span
            className="text-[10px] tracking-[0.4em] uppercase text-[#c9a84c] block mb-4"
          >
            Ressources — Mis à jour mensuellement
          </span>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-black text-[#0e0e0e] leading-[1.05] mb-6"
          >
            Les Meilleurs Outils IA : La Sélection ialucide
          </h1>
          <p
            className="text-lg text-[#0e0e0e] leading-relaxed max-w-2xl"
          >
            Le paysage de l&apos;intelligence artificielle évolue chaque jour. Pour vous aider à naviguer dans cet écosystème, l&apos;équipe de{' '}
            <strong>ialucide</strong> a testé, comparé et sélectionné les solutions les plus performantes pour chaque métier.
          </p>
          <div className="h-px bg-[#c9a84c]/15 mt-10" />
        </header>

        {/* Tool sections */}
        <div className="space-y-16">
          {TOOLS.map((section) => (
            <section key={section.category}>
              <div className="mb-6">
                <h2
                  className="text-2xl md:text-3xl font-bold text-[#0e0e0e] mb-2"
                >
                  {section.category}
                </h2>
                <p
                  className="text-base text-[#6b6b6b]"
                >
                  {section.description}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {section.items.map((tool) => (
                  <ToolCard key={tool.name} tool={tool} />
                ))}
              </div>
              <div className="h-px bg-[#c9a84c]/15 mt-12" />
            </section>
          ))}
        </div>

        {/* Base44 section */}
        <section className="mb-12">
          <h2
            className="text-2xl md:text-3xl font-bold text-[#0e0e0e] mb-2"
          >
            Vibecoder une application web
          </h2>
          <p
            className="text-base text-[#6b6b6b] mb-6"
          >
            Découvrir l&apos;assistance IA pour développer vos idées
          </p>
          <div className="bg-white border border-[#c9a84c]/15 p-6 hover:border-[#c9a84c]/40 hover:shadow-md transition-all duration-300">
            <div className="mb-3">
              <h3
                className="text-xl font-bold text-[#0e0e0e]"
              >
                Base44
              </h3>
              <span
                className="text-[10px] tracking-widest uppercase text-[#c9a84c]"
              >
                Développement IA no-code / low-code
              </span>
            </div>
            <p
              className="text-sm text-[#6b6b6b] leading-relaxed mb-5"
            >
              Transformez vos idées en applications web fonctionnelles grâce à l&apos;IA. Base44 vous permet de concevoir, développer et déployer vos projets digitaux sans être développeur.
            </p>
            <a
              href="https://base44.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase text-[#0e0e0e] border border-[#0e0e0e] px-4 py-2.5 hover:bg-[#0e0e0e] hover:text-[#f4f0e8] transition-all duration-500"
            >
              Découvrir Base44
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M1 10L10 1M10 1H4M10 1v6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
          <div className="h-px bg-[#c9a84c]/15 mt-12" />
        </section>

        {/* CTA final */}
        <section className="bg-[#1a3a4a] p-10 md:p-14 text-center mt-8">
          <span
            className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#c9a84c] block mb-4"
          >
            Accompagnement sur mesure
          </span>
          <h2
            className="font-playfair text-2xl md:text-3xl font-black not-italic text-white mb-4"
          >
            Les outils ne sont rien sans la méthode.
          </h2>
          <p
            className="font-source text-base text-[#f4f0e8]/80 mb-8 max-w-xl mx-auto"
            style={{ fontWeight: 400 }}
          >
            Si vous souhaitez un audit complet des outils adaptés à votre structure, l&apos;équipe de{' '}
            <strong className="text-white">ialucide</strong> vous accompagne.
          </p>
          <a
            href="mailto:contact@ialucide.fr"
            className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-[#c9a84c] border border-[#c9a84c] px-8 py-4 hover:bg-[#c9a84c] hover:text-[#1a3a4a] transition-all duration-500"
          >
            Réserver un audit IA
          </a>
        </section>

        {/* Mention affiliation */}
        <section className="mt-12 border border-[#c9a84c]/20 bg-white p-6 md:p-8">
          <h2
            className="text-lg font-bold text-[#0e0e0e] mb-4"
          >
            Mention de Transparence (Affiliation)
          </h2>
          <blockquote
            className="border-l-2 border-[#c9a84c] pl-5 mb-4 italic text-sm text-[#6b6b6b] leading-relaxed"
          >
            L&apos;indépendance de nos analyses est au cœur de la mission de ialucide. Certains des liens figurant sur cette page sont des liens d&apos;affiliation. Cela signifie que si vous décidez de souscrire à un service via ces liens, nous pouvons percevoir une commission.{' '}
            <strong className="text-[#0e0e0e]">Cela n&apos;entraîne aucun surcoût pour vous.</strong>
          </blockquote>
          <p
            className="text-sm text-[#6b6b6b] leading-relaxed"
          >
            Ces commissions nous permettent de financer la maintenance du site et de continuer à vous proposer des contenus de haute qualité gratuitement.
          </p>
        </section>

      </div>
    </div>
  );
}

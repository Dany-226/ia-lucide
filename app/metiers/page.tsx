'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Metadata } from 'next';

const METIERS = [
  {
    niveau: 'rouge' as const,
    label: 'Exposition forte',
    color: '#c0392b',
    metiers: [
      {
        titre: 'Comptable',
        description: "Saisie, rapprochements, déclarations fiscales : les IA automatisent l'essentiel des tâches répétitives. Le rôle évolue vers le conseil et l'analyse stratégique.",
        slug: 'comptable',
      },
      {
        titre: 'Juriste / Avocat',
        description: "Recherche jurisprudentielle, rédaction de contrats, veille réglementaire : les legaltechs et les LLM performent déjà au niveau junior. La plaidoirie et la stratégie résistent.",
        slug: 'juriste-ia-avocat-pratique-augmentee',
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
    ],
  },
  {
    niveau: 'jaune' as const,
    label: 'Exposition modérée',
    color: '#c9a84c',
    metiers: [
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
        titre: 'Contrôleur financier',
        description: "Consolidation, reporting, détection d'anomalies : les tâches répétitives s'automatisent. L'interprétation des écarts, le conseil aux opérationnels et la vision stratégique restent humains.",
        slug: 'controleur-financier',
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
        titre: 'Développeur',
        description: "La génération de code accélère la production mais exige plus de recul architectural. Le développeur se transforme en chef d'orchestre, superviseur de l'IA plutôt que simple exécutant.",
        slug: 'developpeur',
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

const FAQ = [
  {
    q: "Comment l'IA va-t-elle concrètement changer mon métier ?",
    a: "L'IA transforme d'abord les tâches répétitives et traitables en volume : saisie, recherche, rédaction standardisée, classification. Dans un second temps, elle touche les tâches analytiques. Ce qui résiste : la relation humaine, le jugement contextuel, la responsabilité et la créativité ancrée dans l'expérience.",
  },
  {
    q: "Mon métier va-t-il disparaître à cause de l'IA ?",
    a: "La disparition totale d'un métier est rare. Ce qui se transforme, c'est la composition des tâches qui le définissent. Certains profils juniors sont davantage menacés que les seniors. Les métiers à forte exposition voient leur valeur se déplacer vers des compétences de supervision, de conseil et de relation client.",
  },
  {
    q: "Comment se préparer à ces transformations ?",
    a: "Trois axes : comprendre ce que l'IA fait réellement (pas juste les annonces), identifier les 20% de vos tâches les plus exposées, et développer activement les compétences que l'IA ne peut pas reproduire — jugement, relation, sens politique, créativité stratégique.",
  },
  {
    q: "L'IA est-elle un outil ou une menace pour les professionnels ?",
    a: "Les deux simultanément, selon votre positionnement. Pour celui qui la maîtrise, c'est un levier de productivité sans précédent. Pour celui qui l'ignore, c'est une pression compétitive croissante. La variable déterminante n'est pas l'IA elle-même mais la vitesse d'adaptation de chaque professionnel.",
  },
  {
    q: "Ces analyses sont-elles fiables ? Qui les produit ?",
    a: "IA Lucide est une publication indépendante. Nos analyses s'appuient sur des études académiques, des rapports sectoriels (McKinsey, Goldman Sachs, OCDE) et des entretiens avec des professionnels en exercice. Nous ne vendons ni formation ni logiciel : notre seul intérêt est la clarté.",
  },
];

function MetierCard({ metier, color }: { metier: typeof METIERS[0]['metiers'][0]; color: string }) {
  return (
    <div
      className="bg-white p-5 group hover:shadow-[0_2px_32px_rgba(28,28,23,0.08)] transition-shadow duration-300"
      style={{ borderLeft: `4px solid ${color}` }}
    >
      {/* Title-LG */}
      <h3
        className="text-[1.375rem] font-bold text-[#1c1c17] mb-2 group-hover:text-[#c9a84c] transition-colors duration-300"
        style={{ letterSpacing: '-0.02em' }}
      >
        {metier.titre}
      </h3>
      {/* Body-LG */}
      <p className="text-base text-[#6b6b6b] leading-relaxed mb-4">
        {metier.description}
      </p>
      <Link
        href={`/article/${metier.slug}`}
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

function FaqItem({ item }: { item: typeof FAQ[0] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#0e0e0e]/10">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left"
      >
        <span className="text-base font-bold text-[#1c1c17] leading-snug">
          {item.q}
        </span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          className="text-[#c9a84c] mt-0.5 flex-shrink-0 transition-transform duration-300"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <path d="M4 6l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <p
          className="text-base text-[#6b6b6b] leading-relaxed pb-5 pr-8"
        >
          {item.a}
        </p>
      )}
    </div>
  );
}

export default function MetiersPage() {
  return (
    <div className="bg-[#fcf9f0] min-h-screen pt-24 md:pt-32 pb-24">
      <div className="max-w-5xl mx-auto px-5 md:px-8">

        {/* Header */}
        <header className="mb-16 md:mb-20 max-w-2xl">
          <span className="font-mono text-xs font-bold tracking-[0.3em] uppercase text-[#c9a84c] block mb-4">
            Analyse par métier
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#1c1c17] leading-[1.05] mb-6" style={{ letterSpacing: '-0.02em' }}>
            Votre métier face à l&apos;IA
          </h1>
          <p className="text-base text-[#1c1c17] leading-relaxed mb-4">
            15 professions analysées avec méthode. Pas de catastrophisme, pas de déni : une lecture lucide de ce que l&apos;IA change réellement, tâche par tâche.
          </p>
          <p className="text-base text-[#6b6b6b] leading-relaxed">
            Chaque analyse est construite à partir de sources publiques, retours terrain et observations concrètes sur l&apos;évolution des outils. Le niveau d&apos;exposition est évalué selon la proportion de tâches automatisables dans les 3 à 5 prochaines années.
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

        {/* FAQ */}
        <section className="mb-20">
          <span className="font-mono text-xs font-bold tracking-[0.3em] uppercase text-[#c9a84c] block mb-4">
            Questions fréquentes
          </span>
          <h2 className="text-[1.75rem] font-bold text-[#1c1c17] mb-10" style={{ letterSpacing: '-0.02em' }}>
            Ce que vous vous demandez vraiment
          </h2>
          <div>
            {FAQ.map((item, i) => (
              <FaqItem key={i} item={item} />
            ))}
          </div>
        </section>

        {/* CTA ailucide.com */}
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
          <a
            href="https://ailucide.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#c9a84c] border border-[#c9a84c] px-8 py-4 hover:bg-[#c9a84c] hover:text-[#1a3a4a] transition-all duration-500"
          >
            Faire mon diagnostic
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7H12M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </section>

      </div>
    </div>
  );
}

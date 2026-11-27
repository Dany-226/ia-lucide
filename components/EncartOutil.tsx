import Link from 'next/link';

// Encart unique vers l'outil « Où passe la ligne » (/diagnostic-exposition-ia/).
// Version large : accueil, hub /metiers/, page À propos. Version compacte : colonne des articles.
// Pas d'animation : un élément visible au chargement ne démarre jamais à opacity: 0 (LCP).

const TITRE = 'Où passe la ligne dans votre poste\u00a0?';
const TEXTE =
  "Choisissez votre métier et vos tâches\u00a0: d'après les données de l'OIT, voyez lesquelles l'IA générative touche, et lesquelles elle touche peu.";
const BOUTON = 'Voir mon poste';
const HREF = '/diagnostic-exposition-ia/';

function Fleche() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 7H12M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function EncartOutil({ variante = 'large' }: { variante?: 'large' | 'compacte' }) {
  if (variante === 'compacte') {
    return (
      <div className="bg-[#1a3a4a] p-6">
        <p className="text-[1.375rem] font-bold text-white mb-2 leading-snug" style={{ letterSpacing: '-0.02em' }}>
          {TITRE}
        </p>
        <p className="text-base text-[#fcf9f0]/80 mb-5 leading-relaxed">{TEXTE}</p>
        <Link
          href={HREF}
          className="font-mono inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#c9a84c] border border-[#c9a84c] px-4 py-2 hover:bg-[#c9a84c] hover:text-[#1a3a4a] transition-colors duration-500"
        >
          {BOUTON}
          <Fleche />
        </Link>
      </div>
    );
  }

  return (
    <section className="bg-[#1a3a4a] px-6 py-12 md:px-14 md:py-16 text-center">
      <div className="max-w-2xl mx-auto">
        <h2
          className="text-[1.75rem] sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
          style={{ letterSpacing: '-0.02em' }}
        >
          {TITRE}
        </h2>
        <p className="text-base text-[#fcf9f0]/80 mb-10 leading-relaxed">{TEXTE}</p>
        <Link
          href={HREF}
          className="font-mono inline-flex items-center gap-2 px-8 py-3.5 border border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#1a3a4a] transition-colors duration-500 text-xs font-bold tracking-widest uppercase"
        >
          {BOUTON}
          <Fleche />
        </Link>
      </div>
    </section>
  );
}

// Accordéon FAQ de /metiers/ en <details> natif : la réponse est dans le HTML statique
// (lisible par Googlebot et les robots des moteurs IA), sans JavaScript côté client.
// Avant le 25/11/2026, la réponse n'était rendue qu'après un clic (useState), donc absente
// du HTML exporté.

interface FaqItemProps {
  item: { q: string; a: string };
}

export default function MetiersFaqItem({ item }: FaqItemProps) {
  return (
    <details className="group border-b border-[#0e0e0e]/10">
      <summary className="w-full flex items-start justify-between gap-4 py-5 text-left cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <span className="text-base font-bold text-[#1c1c17] leading-snug">
          {item.q}
        </span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          aria-hidden="true"
          className="text-[#8a6a1c] mt-0.5 flex-shrink-0 transition-transform duration-300 group-open:rotate-180"
        >
          <path d="M4 6l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </summary>
      <p className="text-base text-[#6b6b6b] leading-relaxed pb-5 pr-8">
        {item.a}
      </p>
    </details>
  );
}

// Éléments partagés par le parcours, la page de résultat et les pages de domaine.
import type { Bande } from '@/lib/diagnostic-calcul';

/** Couleurs des bandes : palette neutre de la charte, pas de rouge ni de vert (pas d'alarme). */
export const COULEUR_BANDE: Record<Bande, string> = {
  eleve: '#1a3a4a',
  partiel: '#c9a84c',
  faible: '#b9b4a5',
};

/** Remplace les variables {nom} d'un modèle de texte. */
export function remplir(modele: string, vars: Record<string, string | number> = {}): string {
  return modele.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}

/** « 0,64 » : nombre décimal à la française. */
export function decimal(x: number, d = 2): string {
  return x.toFixed(d).replace('.', ',');
}

/** « A, B et C ». */
export function enumeration(items: string[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} et ${items[items.length - 1]}`;
}

export function Etiquette({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`font-mono text-xs font-bold tracking-[0.2em] uppercase text-[#8a6a1c] ${className}`}>
      {children}
    </span>
  );
}

export function PastilleBande({ bande, libelle }: { bande: Bande; libelle: string }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-[0.1em] uppercase text-[#1c1c17]">
      <span aria-hidden="true" className="inline-block w-3 h-3" style={{ backgroundColor: COULEUR_BANDE[bande] }} />
      {libelle}
    </span>
  );
}

export const BOUTON =
  'font-mono inline-flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase px-6 py-4 border transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed';
export const BOUTON_PLEIN = `${BOUTON} bg-[#1a3a4a] border-[#1a3a4a] text-[#fcf9f0] hover:bg-[#1c1c17] hover:border-[#1c1c17]`;
export const BOUTON_CONTOUR = `${BOUTON} bg-transparent border-[#1a3a4a] text-[#1a3a4a] hover:bg-[#1a3a4a] hover:text-[#fcf9f0]`;
export const CHAMP =
  'w-full bg-white border border-[#1c1c17]/20 px-4 py-3 text-base text-[#1c1c17] placeholder:text-[#6b6b6b] focus:outline-none focus:border-[#1a3a4a]';
export const LIEN = 'text-[#8a6a1c] underline underline-offset-2 hover:text-[#1c1c17]';

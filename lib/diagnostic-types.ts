// Types partagés entre le chargeur de données (build) et les composants client du diagnostic.
import type { Bande, Piste } from './diagnostic-calcul';

export type CodeCategorie = 'G4' | 'G3' | 'G2' | 'G1' | 'MIN' | 'NE';

export const CODES_CATEGORIE: Record<string, CodeCategorie> = {
  'Exposed: Gradient 4': 'G4',
  'Exposed: Gradient 3': 'G3',
  'Exposed: Gradient 2': 'G2',
  'Exposed: Gradient 1': 'G1',
  'Minimal Exposure': 'MIN',
  'Not Exposed': 'NE',
};

/** Rang d'exposition, du plus exposé (0) au moins exposé (5). */
export const RANG_CATEGORIE: Record<CodeCategorie, number> = { G4: 0, G3: 1, G2: 2, G1: 3, MIN: 4, NE: 5 };

export type LienArticle = { slug: string; titre: string };

export type TacheV = {
  id: number;
  fr: string;
  en: string;
  score: number;
  bande: Bande;
  /** Raison de l'adaptation du libellé, ou null si traduction fidèle. */
  adaptation: string | null;
};

export type PosteV = {
  slug: string;
  domaine: string;
  libelle: string;
  description: string;
  isco08: string;
  iscoTitre: string;
  /** Catégorie OIT telle que publiée (« Exposed: Gradient 4 »...). */
  categorie: string;
  code: CodeCategorie;
  mu: number;
  sd: number;
  note: string | null;
  /** Ligne courte sur le résultat quand le poste a une note de méthode (détail sur la méthodologie). */
  noteResultat: string | null;
  /** Articles de la piste « outils » : liens_postes, sinon liens_domaines (textes.json). */
  articles: LienArticle[];
  /** Tâches retenues et validées, dans l'ordre de l'OIT (l'ordre de l'URL de partage). */
  taches: TacheV[];
  maj: string;
};

export type DomaineV = {
  slug: string;
  libelle: string;
  description: string;
  postes: PosteV[];
  articles: LienArticle[];
};

export type DiagData = {
  domaines: DomaineV[];
  textes: Record<string, string>;
  liensPistes: Record<Exclude<Piste, 'outils'>, LienArticle[]>;
};

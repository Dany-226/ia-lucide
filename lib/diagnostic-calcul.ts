// Moteur de calcul du diagnostic « Où passe la ligne » (spec §6.1).
// Fonctions pures, sans dépendance : utilisées côté client par le parcours, et testées par
// scripts/diagnostic-calcul.test.mjs (`npm test`). Uniquement de la syntaxe TypeScript
// effaçable (annotations de type), pour que Node puisse importer ce fichier directement.

export type Bande = 'eleve' | 'partiel' | 'faible';

/** Ordre d'affichage, et ordre de départage en cas d'égalité. */
export const BANDES: readonly Bande[] = ['eleve', 'partiel', 'faible'];

/** Échelle de temps de l'écran 3 : poids 0 à 3. */
export const ECHELLE: readonly { poids: number; libelle: string }[] = [
  { poids: 0, libelle: 'Jamais' },
  { poids: 1, libelle: 'Un peu' },
  { poids: 2, libelle: 'Une bonne part' },
  { poids: 3, libelle: "L'essentiel de mon temps" },
];

export type Repartition = {
  /** Parts arrondies à 5 points, dont la somme vaut toujours 100. */
  parts: Record<Bande, number>;
  /** Parts exactes, avant arrondi (en %). */
  exactes: Record<Bande, number>;
  /** Bande qui pèse le plus (parts exactes ; égalité départagée dans l'ordre de BANDES). */
  dominante: Bande;
  /** Nombre de tâches avec un poids supérieur à 0. */
  nbTaches: number;
};

/**
 * Répartition du temps par bande. Seules les tâches retenues sont passées ici.
 * Renvoie null si moins de 2 tâches ont un poids : on n'affiche alors que la catégorie OIT.
 *
 * Arrondi à 5 points par la méthode des plus forts restes : chaque part est ramenée au
 * multiple de 5 inférieur, puis les tranches de 5 manquantes vont aux plus grands restes.
 * La somme affichée vaut donc toujours 100 (un arrondi indépendant pouvait donner 95 ou 105).
 */
export function repartition(bandes: readonly Bande[], poids: readonly number[]): Repartition | null {
  if (bandes.length !== poids.length) throw new Error('bandes et poids de longueurs différentes');
  for (const p of poids) {
    if (!Number.isInteger(p) || p < 0 || p > 3) throw new Error(`poids invalide : ${p}`);
  }
  const nbTaches = poids.filter((p) => p > 0).length;
  if (nbTaches < 2) return null;

  const total = poids.reduce((a, b) => a + b, 0);
  const somme: Record<Bande, number> = { eleve: 0, partiel: 0, faible: 0 };
  bandes.forEach((b, i) => { somme[b] += poids[i]; });

  const exactes = { eleve: 0, partiel: 0, faible: 0 } as Record<Bande, number>;
  const tranches = { eleve: 0, partiel: 0, faible: 0 } as Record<Bande, number>;
  const restes: { bande: Bande; reste: number }[] = [];
  for (const b of BANDES) {
    exactes[b] = (somme[b] / total) * 100;
    const u = exactes[b] / 5;
    // Tolérance pour les valeurs flottantes du type 59,99999 (= 12 tranches exactes).
    tranches[b] = Math.floor(u + 1e-9);
    restes.push({ bande: b, reste: u - tranches[b] });
  }
  let manquantes = 20 - BANDES.reduce((a, b) => a + tranches[b], 0);
  restes.sort((x, y) => (y.reste - x.reste > 1e-9 ? 1 : x.reste - y.reste > 1e-9 ? -1 : BANDES.indexOf(x.bande) - BANDES.indexOf(y.bande)));
  for (const r of restes) {
    if (manquantes <= 0) break;
    if (r.reste > 1e-9) { tranches[r.bande] += 1; manquantes -= 1; }
  }

  const parts = { eleve: tranches.eleve * 5, partiel: tranches.partiel * 5, faible: tranches.faible * 5 };
  let dominante: Bande = BANDES[0];
  for (const b of BANDES) if (exactes[b] > exactes[dominante] + 1e-9) dominante = b;
  return { parts, exactes, dominante, nbTaches };
}

/** Encode les poids pour l'URL de partage : un chiffre (0 à 3) par tâche retenue, dans l'ordre. */
export function encoderPoids(poids: readonly number[]): string {
  return poids.map((p) => String(p)).join('');
}

/** Décode le paramètre t ; null si invalide ou si le nombre de tâches ne correspond pas. */
export function decoderPoids(t: string | null | undefined, nbTaches: number): number[] | null {
  if (!t || !/^[0-3]+$/.test(t) || t.length !== nbTaches) return null;
  return t.split('').map(Number);
}

/** Pistes d'action (spec §7) : au plus 3, dans l'ordre du tableau. */
export type Piste = 'outils' | 'voisins' | 'independant' | 'demarrer';

export function pistes(input: {
  repartition: Repartition | null;
  categorie: string;
  statut: string | null;
  usageIa: string | null;
  outilsDisponibles: boolean;
}): Piste[] {
  const out: Piste[] = [];
  const r = input.repartition;
  if (r && r.dominante === 'partiel' && input.outilsDisponibles) out.push('outils');
  const gradient34 = input.categorie === 'Exposed: Gradient 3' || input.categorie === 'Exposed: Gradient 4';
  if (gradient34 || (r && r.parts.eleve >= 40)) out.push('voisins');
  if (input.statut === 'independant' || input.statut === 'activite-a-cote') out.push('independant');
  if (input.usageIa === 'aucun') out.push('demarrer');
  return out.slice(0, 3);
}

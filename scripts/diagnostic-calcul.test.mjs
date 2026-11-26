// Tests du moteur de calcul (spec §6.1). Lancer : npm test
// Node importe directement le fichier TypeScript (suppression des types, Node 22.18+).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { repartition, encoderPoids, decoderPoids, pistes } from '../lib/diagnostic-calcul.ts';

// Cas 1, calculé à la main. Aide-comptable (5 tâches) : bandes partiel, élevé, élevé, élevé, élevé ;
// poids 3, 2, 1, 0, 1. Total P = 7. Élevé = 2 + 1 + 0 + 1 = 4, soit 57,14 % ; partiel = 3, soit
// 42,86 % ; faible = 0. En tranches de 5 : 11,43 et 8,57 ; planchers 11 et 8, soit 19 tranches ; la
// 20e va au plus grand reste (partiel, 0,57). Résultat : 55 / 45 / 0, dominante élevé.
test('cas 1 : deux bandes, dominante élevé', () => {
  const r = repartition(['partiel', 'eleve', 'eleve', 'eleve', 'eleve'], [3, 2, 1, 0, 1]);
  assert.deepEqual(r.parts, { eleve: 55, partiel: 45, faible: 0 });
  assert.equal(r.dominante, 'eleve');
  assert.equal(r.nbTaches, 4);
});

// Cas 2, calculé à la main. Bandes faible, faible, partiel, élevé ; poids 3, 3, 2, 1. P = 9.
// Faible 6/9 = 66,67 % ; partiel 2/9 = 22,22 % ; élevé 1/9 = 11,11 %. Un arrondi indépendant
// au multiple de 5 donnerait 65 + 20 + 10 = 95. Plus forts restes : tranches 13,33 / 4,44 / 2,22,
// planchers 13 + 4 + 2 = 19, la 20e va au partiel (reste 0,44). Résultat : 10 / 25 / 65.
test('cas 2 : la somme affichée vaut 100', () => {
  const r = repartition(['faible', 'faible', 'partiel', 'eleve'], [3, 3, 2, 1]);
  assert.deepEqual(r.parts, { eleve: 10, partiel: 25, faible: 65 });
  assert.equal(r.parts.eleve + r.parts.partiel + r.parts.faible, 100);
  assert.equal(r.dominante, 'faible');
});

// Cas 3, calculé à la main. Bandes élevé, faible, partiel ; poids 1, 1, 0. P = 2 : 50 / 0 / 50,
// déjà multiples de 5. Égalité élevé-faible : départagée dans l'ordre élevé, partiel, faible.
test('cas 3 : égalité, parts exactes', () => {
  const r = repartition(['eleve', 'faible', 'partiel'], [1, 1, 0]);
  assert.deepEqual(r.parts, { eleve: 50, partiel: 0, faible: 50 });
  assert.equal(r.dominante, 'eleve');
});

test('moins de 2 tâches avec un poids : pas de résultat', () => {
  assert.equal(repartition(['eleve', 'faible', 'partiel'], [3, 0, 0]), null);
  assert.equal(repartition(['eleve', 'faible'], [0, 0]), null);
});

test('poids invalides refusés', () => {
  assert.throws(() => repartition(['eleve', 'faible'], [4, 1]));
  assert.throws(() => repartition(['eleve'], [1, 1]));
});

test('URL de partage : encodage et décodage', () => {
  assert.equal(encoderPoids([3, 0, 2, 1]), '3021');
  assert.deepEqual(decoderPoids('3021', 4), [3, 0, 2, 1]);
  assert.equal(decoderPoids('3021', 5), null);
  assert.equal(decoderPoids('30a1', 4), null);
  assert.equal(decoderPoids(null, 4), null);
});

test('pistes : au plus 3, dans l\'ordre du tableau §7', () => {
  const r = repartition(['partiel', 'partiel', 'eleve'], [3, 2, 1]);
  assert.deepEqual(
    pistes({ repartition: r, categorie: 'Exposed: Gradient 3', statut: 'independant', usageIa: 'aucun', outilsDisponibles: true }),
    ['outils', 'voisins', 'independant'],
  );
  assert.deepEqual(
    pistes({ repartition: null, categorie: 'Minimal Exposure', statut: 'salarie', usageIa: 'aucun', outilsDisponibles: true }),
    ['demarrer'],
  );
  // Part élevée >= 40 % sur un poste en gradient 1 : piste « postes voisins ».
  const r2 = repartition(['eleve', 'faible'], [2, 3]);
  assert.equal(r2.parts.eleve, 40);
  assert.deepEqual(
    pistes({ repartition: r2, categorie: 'Exposed: Gradient 1', statut: null, usageIa: null, outilsDisponibles: false }),
    ['voisins'],
  );
});

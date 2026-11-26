#!/usr/bin/env node
'use strict';

// Contrôle des données du diagnostic v2 « Où passe la ligne » (spec §9,
// docs/spec-diagnostic-exposition-v2.md). Sort en erreur (code 1) si :
// - une tâche d'un poste publié (« publie »: true) n'a pas le statut « valide » ;
// - une tâche écartée n'a pas de raison, ou une adaptation n'a pas de raison ;
// - les valeurs de l'OIT d'un JSON (μ, σ, catégorie, scores, textes, liste des tâches) ne
//   correspondent plus à l'Excel de référence, ou une bande ne correspond plus à son score.
//
// Aucune dépendance : l'Excel est relu directement (zip + XML). Pas encore branché sur le
// build ; à lancer à la main : `node scripts/check-metiers.js`.

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = path.join(__dirname, '..');
const EXCEL = path.join(ROOT, 'data/source/Final_Scores_ISCO08_Gmyrek_et_al_2025.xlsx');
const METIERS_DIR = path.join(ROOT, 'data/metiers');
const POSTES = path.join(METIERS_DIR, 'postes.json');
const SOURCE = 'Gmyrek et al. 2025, ILO WP 140, CC BY 4.0';
const STATUTS = ['propose', 'valide', 'rejete'];
// Même table que MOJIBAKE dans scripts/metiers_common.py.
const MOJIBAKE = [['‚Äô', '’'], ['¬¥', '´']];
const EPS = 1e-9;

// ---------- Lecture de l'Excel ----------

function unzip(buf) {
  let eocd = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('archive xlsx illisible');
  const count = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  const files = {};
  for (let n = 0; n < count; n++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) throw new Error('répertoire zip invalide');
    const method = buf.readUInt16LE(p + 10);
    const csize = buf.readUInt32LE(p + 20);
    const nlen = buf.readUInt16LE(p + 28);
    const elen = buf.readUInt16LE(p + 30);
    const clen = buf.readUInt16LE(p + 32);
    const off = buf.readUInt32LE(p + 42);
    const name = buf.toString('utf8', p + 46, p + 46 + nlen);
    const data = off + 30 + buf.readUInt16LE(off + 26) + buf.readUInt16LE(off + 28);
    const raw = buf.subarray(data, data + csize);
    files[name] = () => (method === 8 ? zlib.inflateRawSync(raw) : raw).toString('utf8');
    p += 46 + nlen + elen + clen;
  }
  return files;
}

function decode(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos);/gi, (m, e) => {
    if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
    return { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" }[e.toLowerCase()];
  });
}

function textOf(xml) {
  const parts = [];
  xml.replace(/<rPh\b[\s\S]*?<\/rPh>/g, '').replace(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>|<t(?:\s[^>]*)?\/>/g, (m, t) => { parts.push(t || ''); return ''; });
  return decode(parts.join(''));
}

function readExcel(file) {
  const files = unzip(fs.readFileSync(file));
  const shared = [];
  if (files['xl/sharedStrings.xml']) {
    files['xl/sharedStrings.xml']().replace(/<si>([\s\S]*?)<\/si>/g, (m, si) => { shared.push(textOf(si)); return ''; });
  }
  const sheet = files['xl/worksheets/sheet1.xml'];
  if (!sheet) throw new Error('feuille 1 absente');
  const rows = [];
  sheet().replace(/<row\b[^>]*>([\s\S]*?)<\/row>/g, (m, body) => {
    const row = {};
    body.replace(/<c r="([A-Z]+)\d+"([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g, (mm, col, attrs, inner) => {
      if (!inner) return '';
      const t = (attrs.match(/\bt="(\w+)"/) || [])[1];
      const v = (inner.match(/<v>([\s\S]*?)<\/v>/) || [])[1];
      if (t === 's') row[col] = shared[Number(v)];
      else if (t === 'inlineStr') row[col] = textOf(inner);
      else if (t === 'str' || t === 'b' || t === 'e') row[col] = decode(v || '');
      else if (v !== undefined) row[col] = Number(v);
      return '';
    });
    rows.push(row);
    return '';
  });
  const header = rows.shift();
  const col = {};
  for (const [k, name] of Object.entries(header)) col[name] = k;
  const need = ['ISCO_08', 'Title', 'taskID', 'Task_ISCO', 'score_2025', 'mean_score_2025', 'SD_2025', 'potential25'];
  const missing = need.filter((n) => !col[n]);
  if (missing.length) throw new Error(`colonnes absentes : ${missing.join(', ')}`);
  const occ = new Map();
  for (const r of rows) {
    if (r[col.ISCO_08] === undefined) continue;
    const code = String(r[col.ISCO_08]).trim();
    if (!occ.has(code)) occ.set(code, []);
    occ.get(code).push(Object.fromEntries(need.map((n) => [n, r[col[n]]])));
  }
  return occ;
}

// ---------- Règles (identiques à scripts/metiers_common.py) ----------

const repair = (s) => MOJIBAKE.reduce((acc, [bad, good]) => acc.split(bad).join(good), String(s).trim());
const round = (x, d) => Math.round(Number(x) * 10 ** d) / 10 ** d;
const bande = (s) => (s >= 0.6 ? 'eleve' : s >= 0.4 ? 'partiel' : 'faible');
function categorie(mu, sd) {
  if (mu >= 0.6 && mu - sd >= 0.5) return 'Exposed: Gradient 4';
  if (mu >= 0.5 && mu < 0.6 && mu + sd >= 0.5) return 'Exposed: Gradient 3';
  if (mu >= 0.4 && mu < 0.5 && mu + sd >= 0.5) return 'Exposed: Gradient 2';
  if (mu < 0.4 && mu + sd >= 0.5) return 'Exposed: Gradient 1';
  if (mu < 0.5 && mu + sd > 0.4) return 'Minimal Exposure';
  return 'Not Exposed';
}
const isDate = (s) => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s);
const blank = (s) => s === null || s === undefined || String(s).trim() === '';

// ---------- Contrôle ----------

// Vérifie isco_titre et le bloc oit (μ, σ, catégorie) d'un poste ou d'un code associé.
function checkOit(doc, occ, prefix, err) {
  const rows = occ.get(String(doc.isco08));
  if (!rows) { err(`${prefix}ISCO ${doc.isco08} absent de l'Excel`); return null; }
  const r0 = rows[0];
  const mu = round(r0.mean_score_2025, 2);
  const sd = round(r0.SD_2025, 2);
  const cat = String(r0.potential25).trim();
  const oit = doc.oit || {};
  if (doc.isco_titre !== repair(r0.Title)) err(`${prefix}isco_titre ne correspond plus à l'Excel (« ${repair(r0.Title)} »)`);
  if (!(Math.abs(oit.mu - mu) < EPS)) err(`${prefix}oit.mu ${oit.mu}, Excel ${mu}`);
  if (!(Math.abs(oit.sd - sd) < EPS)) err(`${prefix}oit.sd ${oit.sd}, Excel ${sd}`);
  if (oit.categorie !== cat) err(`${prefix}oit.categorie « ${oit.categorie} », Excel « ${cat} »`);
  if (categorie(mu, sd) !== cat) err(`${prefix}les seuils du tableau 5 donnent « ${categorie(mu, sd)} », l'Excel « ${cat} »`);
  return rows;
}

function checkPoste(doc, cfg, occ, rel, errors) {
  const err = (m) => errors.push(`${rel} : ${m}`);
  for (const k of ['domaine', 'poste', 'isco08']) {
    if (doc[k] !== cfg[k]) err(`${k} « ${doc[k]} » au lieu de « ${cfg[k]} » (postes.json)`);
  }
  if (doc.source !== SOURCE) err(`source « ${doc.source} » au lieu de « ${SOURCE} »`);
  if (typeof doc.publie !== 'boolean') err('champ « publie » absent ou non booléen');
  const rows = checkOit(doc, occ, '', err);
  if (!rows) return;

  // Note de méthode et codes associés : recopiés de postes.json, valeurs OIT vérifiées.
  if ((doc.note_methode ?? null) !== (cfg.note_methode ?? null)) err('note_methode différente de postes.json');
  const assocCfg = (cfg.isco_associes || []).map((a) => a.isco08);
  const assoc = Array.isArray(doc.isco_associes) ? doc.isco_associes : [];
  if (JSON.stringify(assoc.map((a) => a.isco08)) !== JSON.stringify(assocCfg)) {
    err(`isco_associes [${assoc.map((a) => a.isco08)}] au lieu de [${assocCfg}] (postes.json)`);
  }
  for (const a of assoc) checkOit(a, occ, `code associé ${a.isco08} : `, err);

  const excel = new Map(rows.map((r) => [Number(r.taskID), r]));
  const taches = Array.isArray(doc.taches) ? doc.taches : [];
  const ids = new Set();
  for (const t of taches) {
    const where = `tâche ${t.task_id}`;
    if (ids.has(t.task_id)) err(`${where} en double`);
    ids.add(t.task_id);
    const x = excel.get(t.task_id);
    if (!x) { err(`${where} absente de l'Excel`); continue; }
    if (t.texte_en !== repair(x.Task_ISCO)) err(`${where} : texte_en ne correspond plus à l'Excel`);
    if (!(Math.abs(t.score_2025 - round(x.score_2025, 4)) < EPS)) err(`${where} : score ${t.score_2025}, Excel ${round(x.score_2025, 4)}`);
    if (t.bande !== bande(t.score_2025)) err(`${where} : bande « ${t.bande} » pour un score de ${t.score_2025} (attendu « ${bande(t.score_2025)} »)`);
    if (!STATUTS.includes(t.statut)) err(`${where} : statut « ${t.statut} » inconnu`);
    if (typeof t.retenue !== 'boolean') err(`${where} : « retenue » doit valoir true ou false`);
    if (t.retenue === false && blank(t.raison_exclusion)) err(`${where} : tâche écartée sans raison`);
    if (t.retenue === true && !blank(t.raison_exclusion)) err(`${where} : tâche retenue avec une raison d'exclusion`);
    if (typeof t.adaptation !== 'boolean') err(`${where} : « adaptation » doit valoir true ou false`);
    if (t.adaptation === true && blank(t.raison_adaptation)) err(`${where} : adaptation sans raison`);
    if (t.adaptation === false && !blank(t.raison_adaptation)) err(`${where} : raison d'adaptation sans adaptation`);
    if (t.adaptation === true && t.retenue === false) err(`${where} : tâche écartée marquée comme adaptation`);
    if (t.statut === 'valide' && blank(t.libelle_fr)) err(`${where} : validée sans libellé français`);
    if ((t.statut === 'valide' || t.statut === 'rejete') && !isDate(t.valide_le)) err(`${where} : statut « ${t.statut} » sans date valide_le`);
    if (t.statut === 'propose' && t.valide_le !== null) err(`${where} : statut « propose » avec une date valide_le`);
    // Spec §1.4 et §9 : rien ne s'affiche sans validation. Les tâches écartées sont aussi
    // publiées (avec leur raison, sur la page méthodologie) : leur exclusion doit être validée.
    if (doc.publie === true && t.statut !== 'valide') {
      err(`${where} : poste publié, tâche ${t.retenue ? 'retenue' : 'écartée'} au statut « ${t.statut} » (« valide » requis)`);
    }
  }
  for (const id of excel.keys()) if (!ids.has(id)) err(`tâche ${id} de l'Excel absente du JSON`);
  if (doc.publie === true && !taches.some((t) => t.retenue)) err('poste publié sans aucune tâche retenue');
}

function main() {
  const errors = [];
  const occ = readExcel(EXCEL);
  const cfg = JSON.parse(fs.readFileSync(POSTES, 'utf8'));
  const expected = new Map(cfg.postes.map((p) => [`${p.domaine}/${p.poste}.json`, p]));

  const found = [];
  for (const d of fs.readdirSync(METIERS_DIR, { withFileTypes: true })) {
    if (!d.isDirectory()) continue;
    for (const f of fs.readdirSync(path.join(METIERS_DIR, d.name))) {
      if (f.endsWith('.json')) found.push(`${d.name}/${f}`);
    }
  }
  for (const rel of found) if (!expected.has(rel)) errors.push(`data/metiers/${rel} : absent de postes.json`);

  let publies = 0;
  const statuts = { propose: 0, valide: 0, rejete: 0 };
  for (const [rel, p] of expected) {
    const file = path.join(METIERS_DIR, rel);
    if (!fs.existsSync(file)) { errors.push(`data/metiers/${rel} : fichier manquant (lancer scripts/import-oit.py)`); continue; }
    let doc;
    try { doc = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { errors.push(`data/metiers/${rel} : JSON invalide (${e.message})`); continue; }
    checkPoste(doc, p, occ, `data/metiers/${rel}`, errors);
    if (doc.publie === true) publies++;
    for (const t of doc.taches || []) if (t.statut in statuts) statuts[t.statut]++;
  }

  const tx = checkTextes(cfg, publies, errors);

  // Build de production (branche main sur Cloudflare Pages) : la v2 remplace la v1 à l'URL
  // /diagnostic-exposition-ia/ ; sans poste publié, l'outil serait vide (et Next refuse une
  // route /metiers/[domaine] sans aucune page). On l'arrête ici avec un message clair.
  if (process.env.CF_PAGES_BRANCH === 'main' && publies === 0) {
    errors.push('build de production sans aucun poste publié : passer "publie": true sur les postes validés avant de fusionner diagnostic-v2 dans main (voir CLAUDE.md, Diagnostic v2)');
  }

  if (errors.length) {
    console.error(`check-metiers : ${errors.length} erreur(s)`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  console.log(`check-metiers : OK, ${expected.size} postes (${publies} publiés), tâches : ${statuts.valide} valide, ${statuts.propose} propose, ${statuts.rejete} rejete ; textes : ${tx.valide} valide, ${tx.propose} propose, ${tx.rejete} rejete.`);
}

// Modèles de texte (data/metiers/textes.json, spec §1.7) : toutes les entrées utilisées par
// les pages existent, les articles liés existent dans content/, et dès qu'un poste est publié,
// toutes les entrées sont « valide ».
function checkTextes(cfg, publies, errors) {
  const rel = 'data/metiers/textes.json';
  const err = (m) => errors.push(`${rel} : ${m}`);
  const counts = { propose: 0, valide: 0, rejete: 0 };
  let tx;
  try { tx = JSON.parse(fs.readFileSync(path.join(METIERS_DIR, 'textes.json'), 'utf8')); } catch (e) { err(`illisible (${e.message})`); return counts; }
  const entrees = tx.entrees || {};
  const required = [
    'outil.sous_titre', 'outil.intro', 'repartition.phrase', 'repartition.aucun_resultat', 'comparaison.intro',
    'avertissement', 'avertissement.source', 'bande.note', 'domaine.comparaison',
    'metier_absent.texte', 'metier_absent.confirmation', 'piste.titre',
    'inscription.titre', 'inscription.consentement', 'inscription.donnees', 'inscription.confirmation',
    'partage.texte', 'partage.note',
  ];
  for (const e of ['domaine', 'poste', 'taches', 'contexte']) required.push(`ecran.${e}.titre`, `ecran.${e}.intro`);
  required.push('ecran.resultat.titre');
  const codes = ['G4', 'G3', 'G2', 'G1', 'MIN', 'NE'];
  const bandes = ['eleve', 'partiel', 'faible'];
  for (const c of codes) {
    required.push(`categorie.${c}.libelle`, `categorie.${c}.explication`);
    for (const b of bandes) required.push(`synthese.${c}.${b}`);
  }
  for (const b of bandes) required.push(`bande.${b}.libelle`, `bande.${b}.definition`);
  for (const p of ['outils', 'voisins', 'independant', 'demarrer']) required.push(`piste.${p}.titre`, `piste.${p}.texte`);
  required.push('piste.voisins.recrutement', 'piste.demarrer.texte_sans_tache');
  for (const d of cfg.domaines) required.push(`domaines.${d.slug}.description`);
  for (const p of cfg.postes) required.push(`postes.${p.poste}.description`);
  for (const k of required) if (!entrees[k]) err(`entrée « ${k} » manquante`);

  const interdits = /automatisable|menacé|remplacé|remplacer|probabilité de perdre|% de risque/i;
  for (const [k, e] of Object.entries(entrees)) {
    if (!e || blank(e.texte)) { err(`« ${k} » : texte vide`); continue; }
    if (!STATUTS.includes(e.statut)) err(`« ${k} » : statut « ${e.statut} » inconnu`);
    else counts[e.statut]++;
    if (/[–—]/.test(e.texte)) err(`« ${k} » : tiret long ou demi-cadratin (règle éditoriale)`);
    // « probabilité de perdre » est permis seulement dans une négation (avertissement, intro).
    const m = e.texte.match(interdits);
    if (m && !/(ni une|pas une|n'est pas une) probabilité de perdre/i.test(e.texte)) err(`« ${k} » : vocabulaire interdit (« ${m[0]} »)`);
    if (publies > 0 && e.statut !== 'valide') err(`« ${k} » : statut « ${e.statut} » alors qu'un poste est publié (« valide » requis)`);
  }
  const slugs = [...Object.values(tx.liens_domaines || {}), ...Object.values(tx.liens_postes || {}), ...Object.values(tx.liens_pistes || {})].flat();
  for (const s of new Set(slugs)) {
    if (!fs.existsSync(path.join(ROOT, 'content', `${s}.mdx`))) err(`article lié « ${s} » absent de content/`);
  }
  for (const d of Object.keys(tx.liens_domaines || {})) {
    if (!cfg.domaines.some((x) => x.slug === d)) err(`liens_domaines : domaine « ${d} » inconnu`);
  }
  for (const p of Object.keys(tx.liens_postes || {})) {
    if (!cfg.postes.some((x) => x.poste === p)) err(`liens_postes : poste « ${p} » inconnu`);
  }
  return counts;
}

main();

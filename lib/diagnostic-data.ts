// Chargement des données du diagnostic v2 au build (spec §4 à §9). Lit data/metiers/ (JSON
// générés par scripts/import-oit.py et validés par Daniel) et data/metiers/textes.json.
// Serveur uniquement : les pages passent le résultat aux composants client en props.
import fs from 'fs';
import path from 'path';
import { getArticleBySlug } from './articles';
import { CODES_CATEGORIE, type DiagData, type DomaineV, type LienArticle, type PosteV } from './diagnostic-types';
import type { Bande } from './diagnostic-calcul';

const DIR = path.join(process.cwd(), 'data', 'metiers');

/**
 * Prévisualisation : tout build qui n'est pas celui de la branche de production (main) sur
 * Cloudflare Pages, y compris un build local. En prévisualisation, les postes non publiés
 * (« publie »: false) sont affichés et les nouvelles pages sont en noindex. En production,
 * seuls les postes publiés apparaissent.
 */
export const DIAGNOSTIC_PREVIEW = process.env.CF_PAGES_BRANCH !== 'main';

/** Robots des pages du diagnostic v2 : noindex tant qu'on n'est pas en production. */
export const DIAGNOSTIC_ROBOTS = DIAGNOSTIC_PREVIEW ? { index: false, follow: true } : undefined;

type TacheJson = {
  task_id: number;
  texte_en: string;
  libelle_fr: string | null;
  score_2025: number;
  bande: Bande;
  retenue: boolean;
  raison_exclusion: string | null;
  adaptation: boolean;
  raison_adaptation: string | null;
  statut: string;
};

export type PosteJson = {
  domaine: string;
  poste: string;
  libelle: string;
  isco08: string;
  isco_titre: string;
  oit: { mu: number; sd: number; categorie: string };
  note_methode: string | null;
  isco_associes: { isco08: string; isco_titre: string; oit: { mu: number; sd: number; categorie: string } }[];
  publie: boolean;
  taches: TacheJson[];
  maj: string;
};

type Config = {
  domaines: { slug: string; libelle: string }[];
  postes: { domaine: string; poste: string }[];
};

type Textes = {
  liens_domaines: Record<string, string[]>;
  /** Prioritaire sur liens_domaines pour la piste « outils » du résultat. */
  liens_postes: Record<string, string[]>;
  liens_pistes: Record<string, string[]>;
  entrees: Record<string, { texte: string; statut: string }>;
};

function readJson<T>(rel: string): T {
  return JSON.parse(fs.readFileSync(path.join(DIR, rel), 'utf8')) as T;
}

let cache: { config: Config; postes: PosteJson[]; textes: Textes } | null = null;

function load() {
  if (!cache) {
    const config = readJson<Config>('postes.json');
    const postes = config.postes.map((p) => readJson<PosteJson>(`${p.domaine}/${p.poste}.json`));
    const textes = readJson<Textes>('textes.json');
    cache = { config, postes, textes };
  }
  return cache;
}

function lien(slug: string): LienArticle {
  const a = getArticleBySlug(slug);
  if (!a) throw new Error(`data/metiers/textes.json : article « ${slug} » introuvable dans content/`);
  return { slug, titre: a.title };
}

export function texte(key: string): string {
  const e = load().textes.entrees[key];
  if (!e) throw new Error(`data/metiers/textes.json : entrée « ${key} » manquante`);
  return e.texte;
}

/** Postes visibles : publiés en production, tous en prévisualisation. */
export function postesVisibles(): PosteJson[] {
  return load().postes.filter((p) => p.publie || DIAGNOSTIC_PREVIEW);
}

function toPosteV(p: PosteJson): PosteV {
  const code = CODES_CATEGORIE[p.oit.categorie];
  if (!code) throw new Error(`${p.poste} : catégorie OIT inconnue « ${p.oit.categorie} »`);
  return {
    slug: p.poste,
    domaine: p.domaine,
    libelle: p.libelle,
    description: texte(`postes.${p.poste}.description`),
    isco08: p.isco08,
    iscoTitre: p.isco_titre,
    categorie: p.oit.categorie,
    code,
    mu: p.oit.mu,
    sd: p.oit.sd,
    note: p.note_methode,
    noteResultat: load().textes.entrees[`postes.${p.poste}.note_resultat`]?.texte ?? null,
    articles: (load().textes.liens_postes[p.poste] ?? load().textes.liens_domaines[p.domaine] ?? []).map(lien),
    // Spec §1.4 : seules les tâches retenues et validées s'affichent.
    taches: p.taches
      .filter((t) => t.retenue && t.statut === 'valide' && t.libelle_fr)
      .map((t) => ({
        id: t.task_id,
        fr: t.libelle_fr as string,
        en: t.texte_en,
        score: t.score_2025,
        bande: t.bande,
        adaptation: t.adaptation ? t.raison_adaptation : null,
      })),
    maj: p.maj,
  };
}

export function getDomaines(): DomaineV[] {
  const { config, textes } = load();
  const visibles = postesVisibles();
  return config.domaines
    .map((d) => ({
      slug: d.slug,
      libelle: d.libelle,
      description: texte(`domaines.${d.slug}.description`),
      postes: visibles.filter((p) => p.domaine === d.slug).map(toPosteV),
      articles: (textes.liens_domaines[d.slug] || []).map(lien),
    }))
    .filter((d) => d.postes.length > 0);
}

export function getDiagData(): DiagData {
  const { textes } = load();
  const t: Record<string, string> = {};
  for (const [k, v] of Object.entries(textes.entrees)) t[k] = v.texte;
  const lp = (k: string) => (textes.liens_pistes[k] || []).map(lien);
  return {
    domaines: getDomaines(),
    textes: t,
    liensPistes: { voisins: lp('voisins'), independant: lp('independant'), demarrer: lp('demarrer') },
  };
}

/** Données de la page méthodologie : tâches écartées, adaptations, codes associés. */
export function getMethodologie() {
  const { config } = load();
  const visibles = postesVisibles();
  const libDomaine = (s: string) => config.domaines.find((d) => d.slug === s)?.libelle ?? s;
  const ecartees: { poste: string; domaine: string; isco08: string; id: number; en: string; fr: string; raison: string }[] = [];
  const adaptations: { poste: string; domaine: string; isco08: string; id: number; en: string; fr: string; raison: string }[] = [];
  for (const p of visibles) {
    for (const t of p.taches) {
      const base = { poste: p.libelle, domaine: libDomaine(p.domaine), isco08: p.isco08, id: t.task_id, en: t.texte_en, fr: t.libelle_fr ?? '' };
      if (!t.retenue) ecartees.push({ ...base, raison: t.raison_exclusion ?? '' });
      if (t.adaptation) adaptations.push({ ...base, raison: t.raison_adaptation ?? '' });
    }
  }
  return {
    postes: visibles.map((p) => ({
      ...toPosteV(p),
      domaineLibelle: libDomaine(p.domaine),
      nbTaches: p.taches.length,
      associes: p.isco_associes,
    })),
    ecartees,
    adaptations,
  };
}

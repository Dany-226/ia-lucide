'use client';

// Parcours « Où passe la ligne » en 5 écrans (spec §5) : domaine, poste, tâches, contexte,
// résultat. Tout se calcule dans le navigateur ; rien n'est envoyé sans inscription.
// URL de partage (§8.3) : ?p=<poste>&t=<poids> rejoue le calcul ; ?d=<domaine> présélectionne
// le domaine (lien depuis les pages /metiers/<domaine>/). Lues dans un useEffect plutôt
// qu'avec useSearchParams, pour que l'écran 1 soit dans le HTML statique.
import { useEffect, useMemo, useRef, useState } from 'react';
import { ECHELLE, decoderPoids, repartition } from '@/lib/diagnostic-calcul';
import type { DiagData, DomaineV, PosteV } from '@/lib/diagnostic-types';
import { BOUTON_CONTOUR, BOUTON_PLEIN, CHAMP, Etiquette } from './commun';
import { MetierAbsent } from './Formulaires';
import Resultat, { type Contexte } from './Resultat';

const QUESTIONS: { cle: keyof Contexte; titre: string; options: { v: string; l: string }[] }[] = [
  {
    cle: 'statut',
    titre: 'Votre statut',
    options: [
      { v: 'salarie', l: 'Salarié·e' },
      { v: 'independant', l: 'Indépendant·e' },
      { v: 'activite-a-cote', l: 'Salarié·e avec une activité à côté' },
      { v: 'recherche', l: "En recherche d'emploi" },
    ],
  },
  {
    cle: 'taille',
    titre: 'La taille de votre structure',
    options: [
      { v: '1', l: 'Seul·e' },
      { v: '2-9', l: '2 à 9 personnes' },
      { v: '10-249', l: '10 à 249 personnes' },
      { v: '250+', l: '250 personnes ou plus' },
    ],
  },
  {
    cle: 'usage',
    titre: "Votre usage actuel de l'IA au travail",
    options: [
      { v: 'aucun', l: 'Aucun' },
      { v: 'occasionnel', l: 'Occasionnel' },
      { v: 'regulier', l: 'Régulier' },
    ],
  },
];

const CONTEXTE_VIDE: Contexte = { statut: null, taille: null, usage: null };

function normaliser(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

export default function Parcours({ data }: { data: DiagData }) {
  const t = data.textes;
  const [etape, setEtape] = useState(1);
  const [domaineSlug, setDomaineSlug] = useState<string | null>(null);
  const [posteSlug, setPosteSlug] = useState<string | null>(null);
  const [poids, setPoids] = useState<number[]>([]);
  const [contexte, setContexte] = useState<Contexte>(CONTEXTE_VIDE);
  const [recherche, setRecherche] = useState('');
  const [absentOuvert, setAbsentOuvert] = useState(false);
  const haut = useRef<HTMLDivElement>(null);
  const premierRendu = useRef(true);

  const domaine: DomaineV | undefined = data.domaines.find((d) => d.slug === domaineSlug);
  const poste: PosteV | undefined = domaine?.postes.find((p) => p.slug === posteSlug);

  // Lecture de l'URL au chargement.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const p = q.get('p');
    const d = q.get('d');
    if (p) {
      for (const dom of data.domaines) {
        const pos = dom.postes.find((x) => x.slug === p);
        if (!pos) continue;
        const w = decoderPoids(q.get('t'), pos.taches.length);
        setDomaineSlug(dom.slug);
        setPosteSlug(pos.slug);
        if (w) { setPoids(w); setEtape(5); } else { setPoids(pos.taches.map(() => 0)); setEtape(3); }
        return;
      }
    }
    if (d && data.domaines.some((x) => x.slug === d)) {
      setDomaineSlug(d);
      setEtape(2);
    }
  }, [data.domaines]);

  // Remonte en haut de l'outil à chaque changement d'écran (pas au premier rendu).
  useEffect(() => {
    if (premierRendu.current) { premierRendu.current = false; return; }
    haut.current?.scrollIntoView({ block: 'start' });
  }, [etape]);

  const r = useMemo(() => (poste ? repartition(poste.taches.map((x) => x.bande), poids) : null), [poste, poids]);

  const domainesFiltres = useMemo(() => {
    const q = normaliser(recherche);
    if (!q) return data.domaines;
    return data.domaines.filter(
      (d) => normaliser(d.libelle).includes(q) || d.postes.some((p) => normaliser(p.libelle).includes(q)),
    );
  }, [recherche, data.domaines]);

  function choisirDomaine(slug: string) {
    setDomaineSlug(slug);
    setPosteSlug(null);
    setEtape(2);
  }
  function choisirPoste(p: PosteV) {
    if (p.slug !== posteSlug) setPoids(p.taches.map(() => 0));
    setPosteSlug(p.slug);
    setEtape(3);
  }
  function recommencer() {
    setDomaineSlug(null);
    setPosteSlug(null);
    setPoids([]);
    setContexte(CONTEXTE_VIDE);
    setEtape(1);
    if (window.location.search) window.history.replaceState(null, '', window.location.pathname);
  }

  const nbAvecTemps = poids.filter((w) => w > 0).length;

  return (
    <div ref={haut} className="scroll-mt-28">
      {etape < 5 && (
        <div className="flex items-center justify-between gap-4 mb-8">
          <Etiquette>Étape {etape} sur 5</Etiquette>
          {etape > 1 && (
            <button type="button" onClick={() => setEtape(etape - 1)} className="font-mono text-xs font-bold tracking-widest uppercase text-[#8a6a1c] hover:text-[#1c1c17]">
              ← Retour
            </button>
          )}
        </div>
      )}

      {/* Écran 1 : le domaine */}
      {etape === 1 && (
        <section aria-labelledby="ecran-domaine">
          <h2 id="ecran-domaine" className="text-[1.75rem] font-bold text-[#1c1c17] mb-2">{t['ecran.domaine.titre']}</h2>
          <p className="text-base text-[#6b6b6b] leading-relaxed mb-6">{t['ecran.domaine.intro']}</p>
          <label htmlFor="recherche-metier" className="sr-only">Chercher un métier</label>
          <input
            id="recherche-metier"
            type="search"
            placeholder="Chercher un métier : comptable, secrétaire, traducteur…"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className={`${CHAMP} mb-6`}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {domainesFiltres.map((d) => (
              <button
                key={d.slug}
                type="button"
                onClick={() => choisirDomaine(d.slug)}
                className="text-left bg-white p-5 hover:shadow-[0_2px_32px_rgba(28,28,23,0.08)] transition-shadow duration-300"
                style={{ borderLeft: '4px solid #c9a84c' }}
              >
                <span className="block text-xl font-bold text-[#1c1c17] mb-2">{d.libelle}</span>
                <span className="block text-sm text-[#6b6b6b] leading-relaxed">{d.postes.map((p) => p.libelle).join(' · ')}</span>
              </button>
            ))}
          </div>
          {domainesFiltres.length === 0 && (
            <p className="text-base text-[#1c1c17] mt-2 mb-6">Aucun domaine ne correspond à « {recherche} » pour l&apos;instant.</p>
          )}
          <div className="mt-8">
            {domainesFiltres.length === 0 || absentOuvert ? (
              <MetierAbsent key={recherche} textes={t} saisieInitiale={recherche} />
            ) : (
              <button type="button" onClick={() => setAbsentOuvert(true)} className="font-mono text-xs font-bold tracking-widest uppercase text-[#8a6a1c] hover:text-[#1c1c17] underline underline-offset-4">
                Mon métier n&apos;est pas dans la liste
              </button>
            )}
          </div>
        </section>
      )}

      {/* Écran 2 : le poste */}
      {etape === 2 && domaine && (
        <section aria-labelledby="ecran-poste">
          <Etiquette>{domaine.libelle}</Etiquette>
          <h2 id="ecran-poste" className="text-[1.75rem] font-bold text-[#1c1c17] mt-2 mb-2">{t['ecran.poste.titre']}</h2>
          <p className="text-base text-[#1c1c17] leading-relaxed mb-6 max-w-3xl">{t['ecran.poste.intro']}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {domaine.postes.map((p) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => choisirPoste(p)}
                className={`text-left bg-white p-5 hover:shadow-[0_2px_32px_rgba(28,28,23,0.08)] transition-shadow duration-300 ${p.slug === posteSlug ? 'outline outline-2 outline-[#1a3a4a]' : ''}`}
                style={{ borderLeft: '4px solid #1a3a4a' }}
              >
                <span className="block text-xl font-bold text-[#1c1c17] mb-2">{p.libelle}</span>
                <span className="block text-base text-[#6b6b6b] leading-relaxed">{p.description}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Écran 3 : les tâches */}
      {etape === 3 && poste && (
        <section aria-labelledby="ecran-taches">
          <Etiquette>{poste.libelle}</Etiquette>
          <h2 id="ecran-taches" className="text-[1.75rem] font-bold text-[#1c1c17] mt-2 mb-2">{t['ecran.taches.titre']}</h2>
          <p className="text-base text-[#6b6b6b] leading-relaxed mb-6 max-w-3xl">{t['ecran.taches.intro']}</p>
          <ol className="space-y-4">
            {poste.taches.map((tache, i) => (
              <li key={tache.id} className="bg-white p-5">
                <fieldset>
                  <legend className="text-base text-[#1c1c17] leading-snug mb-3">{tache.fr}</legend>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {ECHELLE.map((e) => {
                      const id = `tache-${tache.id}-${e.poids}`;
                      const actif = poids[i] === e.poids;
                      return (
                        <label
                          key={e.poids}
                          htmlFor={id}
                          className={`cursor-pointer border px-3 py-2 text-sm text-center transition-colors duration-200 ${actif ? 'bg-[#1a3a4a] border-[#1a3a4a] text-[#fcf9f0]' : 'bg-transparent border-[#1c1c17]/20 text-[#1c1c17] hover:border-[#1a3a4a]'}`}
                        >
                          <input
                            id={id}
                            type="radio"
                            name={`tache-${tache.id}`}
                            value={e.poids}
                            checked={actif}
                            onChange={() => setPoids((prev) => prev.map((w, j) => (j === i ? e.poids : w)))}
                            className="sr-only"
                          />
                          {e.libelle}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap items-center gap-4 mt-8">
            <button type="button" onClick={() => setEtape(4)} className={BOUTON_PLEIN}>Continuer</button>
            <span className="text-sm text-[#6b6b6b]">
              {nbAvecTemps} tâche{nbAvecTemps > 1 ? 's' : ''} avec du temps
              {nbAvecTemps < 2 ? ' : il en faut au moins 2 pour une répartition.' : '.'}
            </span>
          </div>
        </section>
      )}

      {/* Écran 4 : le contexte, hors calcul */}
      {etape === 4 && poste && (
        <section aria-labelledby="ecran-contexte">
          <h2 id="ecran-contexte" className="text-[1.75rem] font-bold text-[#1c1c17] mb-2">{t['ecran.contexte.titre']}</h2>
          <p className="text-base text-[#6b6b6b] leading-relaxed mb-6 max-w-3xl">{t['ecran.contexte.intro']}</p>
          <div className="space-y-6">
            {QUESTIONS.map((q) => (
              <fieldset key={q.cle} className="bg-white p-5">
                <legend className="text-base font-bold text-[#1c1c17] mb-3">{q.titre}</legend>
                <div className="flex flex-wrap gap-2">
                  {q.options.map((o) => {
                    const id = `ctx-${q.cle}-${o.v}`;
                    const actif = contexte[q.cle] === o.v;
                    return (
                      <label
                        key={o.v}
                        htmlFor={id}
                        className={`cursor-pointer border px-4 py-2 text-sm transition-colors duration-200 ${actif ? 'bg-[#1a3a4a] border-[#1a3a4a] text-[#fcf9f0]' : 'bg-transparent border-[#1c1c17]/20 text-[#1c1c17] hover:border-[#1a3a4a]'}`}
                      >
                        <input
                          id={id}
                          type="radio"
                          name={`ctx-${q.cle}`}
                          value={o.v}
                          checked={actif}
                          onChange={() => setContexte((c) => ({ ...c, [q.cle]: o.v }))}
                          className="sr-only"
                        />
                        {o.l}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mt-8">
            <button type="button" onClick={() => setEtape(5)} className={BOUTON_PLEIN}>Voir le résultat</button>
            <button type="button" onClick={() => { setContexte(CONTEXTE_VIDE); setEtape(5); }} className={BOUTON_CONTOUR}>Passer</button>
          </div>
        </section>
      )}

      {/* Écran 5 : le résultat */}
      {etape === 5 && domaine && poste && (
        <Resultat
          data={data}
          domaine={domaine}
          poste={poste}
          poids={poids}
          repartition={r}
          contexte={contexte}
          onModifier={() => setEtape(3)}
          onRecommencer={recommencer}
        />
      )}
    </div>
  );
}

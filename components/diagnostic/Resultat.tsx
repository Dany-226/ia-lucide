'use client';

// Écran 5, le résultat (spec §6.2). Ordre : catégorie OIT, répartition du temps, tâches en
// trois colonnes, synthèse, comparaison avec les postes voisins, pistes (§7), avertissement,
// inscription facultative et partage. Le résultat ne dépend jamais de l'inscription.
import { useState } from 'react';
import Link from 'next/link';
import { BANDES, ECHELLE, encoderPoids, pistes as choisirPistes, type Piste, type Repartition } from '@/lib/diagnostic-calcul';
import { RANG_CATEGORIE, type DiagData, type DomaineV, type PosteV } from '@/lib/diagnostic-types';
import { COULEUR_BANDE, BOUTON_CONTOUR, Etiquette, LIEN, PastilleBande, enumeration, minusculeInitiale, remplir } from './commun';
import { Inscription } from './Formulaires';

export type Contexte = { statut: string | null; taille: string | null; usage: string | null };

function LiensArticles({ liens }: { liens: { slug: string; titre: string }[] }) {
  if (!liens.length) return null;
  return (
    <ul className="mt-3 space-y-1">
      {liens.map((l) => (
        <li key={l.slug}>
          <Link href={`/article/${l.slug}/`} className={LIEN}>{l.titre}</Link>
        </li>
      ))}
    </ul>
  );
}

function BarreRepartition({ r, t }: { r: Repartition; t: Record<string, string> }) {
  return (
    <div>
      <div className="flex w-full h-6" role="img" aria-label={remplir(t['repartition.phrase'], r.parts)}>
        {BANDES.map((b) =>
          r.parts[b] > 0 ? <div key={b} style={{ width: `${r.parts[b]}%`, backgroundColor: COULEUR_BANDE[b] }} /> : null,
        )}
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3">
        {BANDES.map((b) => (
          <span key={b} className="inline-flex items-center gap-2">
            <PastilleBande bande={b} libelle={t[`bande.${b}.libelle`]} />
            <span className="font-mono text-xs text-[#6b6b6b]">{r.parts[b]} %</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Resultat(props: {
  data: DiagData;
  domaine: DomaineV;
  poste: PosteV;
  poids: number[];
  repartition: Repartition | null;
  contexte: Contexte;
  onModifier: () => void;
  onRecommencer: () => void;
}) {
  const { data, domaine, poste, poids, repartition: r, contexte } = props;
  const t = data.textes;
  const libCat = t[`categorie.${poste.code}.libelle`];
  const [copie, setCopie] = useState(false);

  const cochees = poste.taches.map((tache, i) => ({ tache, poids: poids[i] })).filter((x) => x.poids > 0);
  const voisins = domaine.postes.filter((p) => p.slug !== poste.slug);
  const moinsExposes = voisins.filter((p) => RANG_CATEGORIE[p.code] > RANG_CATEGORIE[poste.code]);

  const liste: Piste[] = choisirPistes({
    repartition: r,
    categorie: poste.categorie,
    statut: contexte.statut,
    usageIa: contexte.usage,
    outilsDisponibles: domaine.articles.length > 0,
  });

  // Piste « démarrer » : la tâche à potentiel partiel qui pèse le plus dans la semaine,
  // sinon la première tâche à potentiel partiel du poste.
  const partielle =
    [...cochees].filter((x) => x.tache.bande === 'partiel').sort((a, b) => b.poids - a.poids)[0]?.tache ??
    poste.taches.find((x) => x.bande === 'partiel');

  const synthese = r ? remplir(t[`synthese.${poste.code}.${r.dominante}`], { poste: poste.libelle }) : null;

  const urlPartage = () =>
    `${window.location.origin}/diagnostic-exposition-ia/?p=${poste.slug}&t=${encoderPoids(poids)}&utm_source=partage`;
  const textePartage = remplir(t['partage.texte'], { categorie: libCat });

  async function partager() {
    const url = urlPartage();
    if (navigator.share) {
      try { await navigator.share({ title: 'Où passe la ligne', text: textePartage, url }); return; } catch { /* annulé */ }
    }
    try {
      await navigator.clipboard.writeText(`${textePartage} ${url}`);
      setCopie(true);
    } catch {
      window.prompt('Copiez ce lien :', url);
    }
  }

  return (
    <div className="space-y-14">
      {/* 1. Catégorie OIT */}
      <section aria-labelledby="res-categorie">
        <Etiquette>{t['ecran.resultat.titre']}</Etiquette>
        <p className="text-lg font-bold text-[#1c1c17] mt-3">{poste.libelle}</p>
        <h2 id="res-categorie" className="text-3xl md:text-4xl font-bold text-[#1c1c17] mt-1 mb-2 leading-tight">
          {libCat}
        </h2>
        <p className="font-mono text-xs tracking-[0.1em] uppercase text-[#6b6b6b] mb-4">
          Catégorie OIT : {poste.categorie} · ISCO-08 {poste.isco08} ({poste.iscoTitre})
        </p>
        <p className="text-lg text-[#1c1c17] leading-relaxed max-w-3xl">{t[`categorie.${poste.code}.explication`]}</p>
        {poste.note && <p className="text-base text-[#6b6b6b] leading-relaxed mt-3 max-w-3xl">{poste.note}</p>}
        <p className="text-sm text-[#6b6b6b] mt-3">
          La catégorie est la donnée officielle de l&apos;OIT ; tout le reste de cette page est une lecture personnalisée.{' '}
          <Link href="/methodologie-exposition-ia/" className={LIEN}>Voir la méthode</Link>
        </p>
      </section>

      {/* 2. Répartition du temps */}
      <section aria-labelledby="res-repartition" className="bg-white p-6 md:p-8">
        <h3 id="res-repartition" className="text-xl font-bold text-[#1c1c17] mb-4">La répartition de votre temps</h3>
        {r ? (
          <>
            <p className="text-lg text-[#1c1c17] leading-relaxed mb-5">{remplir(t['repartition.phrase'], r.parts)}</p>
            <BarreRepartition r={r} t={t} />
          </>
        ) : (
          <p className="text-base text-[#1c1c17] leading-relaxed">{t['repartition.aucun_resultat']}</p>
        )}
        <p className="text-sm text-[#6b6b6b] leading-relaxed mt-5">{t['bande.note']}</p>
      </section>

      {/* 3. Tâches cochées en trois colonnes */}
      {cochees.length > 0 && (
        <section aria-labelledby="res-taches">
          <h3 id="res-taches" className="text-xl font-bold text-[#1c1c17] mb-6">Vos tâches, par potentiel</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BANDES.map((b) => {
              const items = cochees.filter((x) => x.tache.bande === b);
              return (
                <div key={b} className="bg-white p-5" style={{ borderTop: `4px solid ${COULEUR_BANDE[b]}` }}>
                  <PastilleBande bande={b} libelle={t[`bande.${b}.libelle`]} />
                  <p className="text-sm text-[#6b6b6b] leading-relaxed mt-2 mb-4">{t[`bande.${b}.definition`]}</p>
                  {items.length === 0 ? (
                    <p className="text-sm text-[#6b6b6b]">Aucune tâche cochée.</p>
                  ) : (
                    <ul className="space-y-4">
                      {items.map(({ tache, poids: p }) => (
                        <li key={tache.id}>
                          <p className="text-base text-[#1c1c17] leading-snug">{tache.fr}</p>
                          <p className="font-mono text-xs text-[#6b6b6b] mt-1">
                            {ECHELLE[p].libelle} · score OIT {tache.score.toFixed(2).replace('.', ',')}
                          </p>
                          {tache.adaptation && (
                            <p className="text-xs text-[#6b6b6b] mt-1">Libellé adapté par ialucide : {tache.adaptation}</p>
                          )}
                          <details className="mt-1">
                            <summary className="text-xs text-[#8a6a1c] cursor-pointer">Texte d&apos;origine (OIT)</summary>
                            <p lang="en" className="text-xs text-[#6b6b6b] leading-relaxed mt-1">{tache.en}</p>
                          </details>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. Synthèse */}
      {synthese && (
        <section aria-labelledby="res-synthese" className="max-w-3xl">
          <h3 id="res-synthese" className="text-xl font-bold text-[#1c1c17] mb-3">En résumé</h3>
          <p className="text-lg text-[#1c1c17] leading-relaxed">{synthese}</p>
        </section>
      )}

      {/* 5. Comparaison avec les postes voisins */}
      {voisins.length > 0 && (
        <section aria-labelledby="res-comparaison">
          <h3 id="res-comparaison" className="text-xl font-bold text-[#1c1c17] mb-2">Les postes voisins : {minusculeInitiale(domaine.libelle)}</h3>
          <p className="text-base text-[#6b6b6b] leading-relaxed mb-5 max-w-3xl">{t['comparaison.intro']}</p>
          <ul className="divide-y divide-[#1c1c17]/10 bg-white">
            {domaine.postes.map((p) => (
              <li key={p.slug} className={`flex flex-wrap items-baseline justify-between gap-2 px-5 py-4 ${p.slug === poste.slug ? 'bg-[#f3eedd]' : ''}`}>
                <span className="text-base text-[#1c1c17] font-bold">
                  {p.libelle}
                  {p.slug === poste.slug && <span className="font-mono text-xs font-normal text-[#6b6b6b]"> (votre poste)</span>}
                </span>
                <span className="font-mono text-xs tracking-[0.05em] text-[#1c1c17]">
                  {t[`categorie.${p.code}.libelle`]} · score moyen {p.mu.toFixed(2).replace('.', ',')}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-sm mt-3">
            <Link href={`/metiers/${domaine.slug}/`} className={LIEN}>Comparer tous les postes du domaine, tâche par tâche</Link>
          </p>
        </section>
      )}

      {/* 6. Pistes (§7) */}
      {liste.length > 0 && (
        <section aria-labelledby="res-pistes">
          <h3 id="res-pistes" className="text-xl font-bold text-[#1c1c17] mb-5">{t['piste.titre']}</h3>
          <div className="space-y-4">
            {liste.map((p) => (
              <div key={p} className="bg-white p-6" style={{ borderLeft: '4px solid #1a3a4a' }}>
                <h4 className="text-lg font-bold text-[#1c1c17] mb-2">{t[`piste.${p}.titre`]}</h4>
                {p === 'outils' && (
                  <>
                    <p className="text-base text-[#1c1c17] leading-relaxed">{t['piste.outils.texte']}</p>
                    <LiensArticles liens={domaine.articles} />
                  </>
                )}
                {p === 'voisins' && (
                  <>
                    {moinsExposes.length > 0 && (
                      <>
                        <p className="text-base text-[#1c1c17] leading-relaxed">
                          {remplir(t['piste.voisins.texte'], { voisins: enumeration(moinsExposes.map((v) => v.libelle)) })}
                        </p>
                        {moinsExposes.map((v) => (
                          <div key={v.slug} className="mt-3">
                            <p className="font-mono text-xs font-bold tracking-[0.1em] uppercase text-[#6b6b6b]">{v.libelle}</p>
                            <ul className="list-disc pl-5 mt-1 space-y-1">
                              {v.taches.filter((x) => x.bande === 'faible').slice(0, 3).map((x) => (
                                <li key={x.id} className="text-base text-[#1c1c17]">{x.fr}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </>
                    )}
                    <p className={`text-base text-[#1c1c17] leading-relaxed ${moinsExposes.length ? 'mt-4' : ''}`}>{t['piste.voisins.recrutement']}</p>
                    <LiensArticles liens={data.liensPistes.voisins} />
                  </>
                )}
                {p === 'independant' && (
                  <>
                    <p className="text-base text-[#1c1c17] leading-relaxed">{t['piste.independant.texte']}</p>
                    <p className="text-sm text-[#6b6b6b] mt-2">
                      Sources :{' '}
                      <a href="https://www.insee.fr/fr/statistiques/9013403" target="_blank" rel="noopener noreferrer" className={LIEN}>Insee Première n° 2114</a>
                      {' ; '}
                      <a href="https://www.insee.fr/fr/statistiques/9025263" target="_blank" rel="noopener noreferrer" className={LIEN}>Insee Analyses Île-de-France n° 224</a>
                    </p>
                    <LiensArticles liens={data.liensPistes.independant} />
                  </>
                )}
                {p === 'demarrer' && (
                  <>
                    <p className="text-base text-[#1c1c17] leading-relaxed">
                      {partielle ? remplir(t['piste.demarrer.texte'], { tache: partielle.fr }) : t['piste.demarrer.texte_sans_tache']}
                    </p>
                    <LiensArticles liens={data.liensPistes.demarrer} />
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. Avertissement */}
      <section aria-label="Avertissement" className="border-t border-[#1c1c17]/15 pt-6 max-w-3xl">
        <p className="text-base text-[#1c1c17] leading-relaxed">{t['avertissement']}</p>
        <p className="text-sm text-[#6b6b6b] leading-relaxed mt-2">
          {t['avertissement.source']} Fiche du poste mise à jour le {poste.maj.split('-').reverse().join('/')}.{' '}
          <Link href="/methodologie-exposition-ia/" className={LIEN}>Méthodologie complète</Link>
        </p>
      </section>

      {/* 8. Inscription facultative et partage */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 md:p-8">
          <Inscription
            textes={t}
            domaine={domaine.slug}
            poste={poste.slug}
            isco08={poste.isco08}
            categorie={poste.categorie}
            partEleve={r ? r.parts.eleve : null}
            statut={contexte.statut}
          />
        </div>
        <div className="bg-[#1a3a4a] p-6 md:p-8 text-[#fcf9f0]">
          <h3 className="text-xl font-bold mb-3 text-[#c9a84c]">Partager</h3>
          <p className="text-base leading-relaxed mb-3">{textePartage}</p>
          <p className="text-sm text-[#a8a59c] leading-relaxed mb-5">{t['partage.note']}</p>
          <button type="button" onClick={partager} className="font-mono inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#c9a84c] border border-[#c9a84c] px-6 py-4 hover:bg-[#c9a84c] hover:text-[#1a3a4a] transition-colors duration-300">
            Partager mon résultat
          </button>
          {copie && <p role="status" className="text-sm text-[#a8a59c] mt-3">Lien copié.</p>}
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={props.onModifier} className={BOUTON_CONTOUR}>Modifier mes réponses</button>
        <button type="button" onClick={props.onRecommencer} className={BOUTON_CONTOUR}>Choisir un autre poste</button>
      </div>
    </div>
  );
}

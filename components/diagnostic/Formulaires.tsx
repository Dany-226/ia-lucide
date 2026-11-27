'use client';

// Formulaires du diagnostic : inscription après le résultat (spec §8.1) et « Prévenez-moi »
// pour un métier absent (§5, écran 1). Aucune case précochée. Les tâches cochées ne sont
// jamais envoyées : seuls le poste, la catégorie OIT, la part à potentiel élevé et le statut.
import { useState } from 'react';
import { BOUTON_PLEIN, CHAMP, avecLiens } from './commun';

type Etat = 'idle' | 'envoi' | 'ok' | 'erreur';

async function envoyer(payload: Record<string, unknown>): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch('/api/diagnostic-submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = (await res.json().catch(() => ({}))) as { success?: boolean; error?: string };
    return { ok: res.ok && data.success === true, error: data.error };
  } catch {
    return { ok: false };
  }
}

function Consentement({ id, texte, coche, onChange }: { id: string; texte: string; coche: boolean; onChange: (v: boolean) => void }) {
  return (
    <label htmlFor={id} className="flex items-start gap-3 text-sm text-[#1c1c17] leading-relaxed cursor-pointer">
      <input
        id={id}
        type="checkbox"
        checked={coche}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 w-4 h-4 shrink-0 accent-[#1a3a4a]"
        required
      />
      <span>{avecLiens(texte)}</span>
    </label>
  );
}

export function Inscription(props: {
  textes: Record<string, string>;
  domaine: string;
  poste: string;
  isco08: string;
  categorie: string;
  partEleve: number | null;
  statut: string | null;
}) {
  const { textes } = props;
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [etat, setEtat] = useState<Etat>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) return;
    setEtat('envoi');
    const r = await envoyer({
      type: 'resultat',
      email: email.trim(),
      consentement: true,
      domaine: props.domaine,
      poste: props.poste,
      isco08: props.isco08,
      categorie_oit: props.categorie,
      part_potentiel_eleve: props.partEleve,
      statut: props.statut ?? '',
      date_diagnostic: new Date().toISOString().slice(0, 10),
    });
    setEtat(r.ok ? 'ok' : 'erreur');
    setMessage(r.ok ? textes['inscription.confirmation'] : r.error || "L'inscription n'a pas abouti. Réessayez dans un instant.");
  }

  if (etat === 'ok') {
    return <p role="status" className="text-base text-[#1c1c17]">{message}</p>;
  }
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate={false}>
      <h3 className="text-xl font-bold text-[#1c1c17] leading-snug">{textes['inscription.titre']}</h3>
      <label htmlFor="inscription-email" className="sr-only">Adresse e-mail</label>
      <input
        id="inscription-email"
        type="email"
        required
        autoComplete="email"
        placeholder="votre@email.fr"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={CHAMP}
      />
      <Consentement id="inscription-consentement" texte={textes['inscription.consentement']} coche={consent} onChange={setConsent} />
      <p className="text-sm text-[#6b6b6b] leading-relaxed">{textes['inscription.donnees']}</p>
      <button type="submit" className={BOUTON_PLEIN} disabled={etat === 'envoi' || !consent || !email}>
        {etat === 'envoi' ? 'Envoi…' : "M'inscrire"}
      </button>
      {etat === 'erreur' && <p role="alert" className="text-sm text-[#1c1c17]">{message}</p>}
    </form>
  );
}

export function MetierAbsent({ textes, saisieInitiale }: { textes: Record<string, string>; saisieInitiale: string }) {
  const [saisie, setSaisie] = useState(saisieInitiale);
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [etat, setEtat] = useState<Etat>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent || !saisie.trim()) return;
    setEtat('envoi');
    const r = await envoyer({ type: 'attente', email: email.trim(), consentement: true, saisie: saisie.trim() });
    setEtat(r.ok ? 'ok' : 'erreur');
    setMessage(r.ok ? textes['metier_absent.confirmation'] : r.error || "L'envoi n'a pas abouti. Réessayez dans un instant.");
  }

  if (etat === 'ok') return <p role="status" className="text-base text-[#1c1c17]">{message}</p>;
  return (
    <form onSubmit={onSubmit} className="bg-white p-6 space-y-4" style={{ borderLeft: '4px solid #c9a84c' }}>
      <h3 className="text-lg font-bold text-[#1c1c17]">Prévenez-moi quand mon métier sera disponible</h3>
      <p className="text-base text-[#6b6b6b] leading-relaxed">{textes['metier_absent.texte']}</p>
      <div>
        <label htmlFor="absent-metier" className="block text-sm font-bold text-[#1c1c17] mb-1">Votre métier</label>
        <input id="absent-metier" type="text" required maxLength={60} value={saisie} onChange={(e) => setSaisie(e.target.value)} className={CHAMP} />
      </div>
      <div>
        <label htmlFor="absent-email" className="block text-sm font-bold text-[#1c1c17] mb-1">Votre e-mail</label>
        <input id="absent-email" type="email" required autoComplete="email" placeholder="votre@email.fr" value={email} onChange={(e) => setEmail(e.target.value)} className={CHAMP} />
      </div>
      <Consentement id="absent-consentement" texte={textes['inscription.consentement']} coche={consent} onChange={setConsent} />
      <button type="submit" className={BOUTON_PLEIN} disabled={etat === 'envoi' || !consent || !email || !saisie.trim()}>
        {etat === 'envoi' ? 'Envoi…' : 'Prévenez-moi'}
      </button>
      {etat === 'erreur' && <p role="alert" className="text-sm text-[#1c1c17]">{message}</p>}
    </form>
  );
}

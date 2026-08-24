'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SECTEURS = [
  'Finance/Assurance',
  'Droit/Justice',
  'Conseil',
  'Santé/Médical',
  'Industrie',
  'Tech/Numérique',
  'Immobilier',
  'Autre',
];

const SECTEURS_SANS_MODIFICATEUR = ['Finance/Assurance', 'Droit/Justice', 'Santé/Médical'];

const ANCIENNETES = ['Moins de 3 ans', '3-7 ans', '7-15 ans', '15 ans et plus'];

const ENCADREMENTS = ['Aucune', '1-5', '6-15', 'Plus de 15'];

const INQUIETUDES = [
  'Perte de valeur ajoutée',
  'Remplacement du poste',
  'Dévalorisation salariale',
  'Rien de précis',
];

interface Answers {
  poste: string;
  secteur: string;
  anciennete: string;
  taches: number | null;
  decision: number | null;
  relationnel: number | null;
  encadrement: string;
  inquietude: string;
  email: string;
  consentement: boolean;
}

const INITIAL_ANSWERS: Answers = {
  poste: '',
  secteur: '',
  anciennete: '',
  taches: null,
  decision: null,
  relationnel: null,
  encadrement: '',
  inquietude: '',
  email: '',
  consentement: false,
};

function scoreSecteur(secteur: string): number {
  return SECTEURS_SANS_MODIFICATEUR.includes(secteur) ? 0 : 2;
}

function scoreAnciennete(v: string): number {
  switch (v) {
    case 'Moins de 3 ans':
      return 2;
    case '3-7 ans':
      return 1;
    case '7-15 ans':
      return 0;
    case '15 ans et plus':
      return -2;
    default:
      return 0;
  }
}

function scoreTaches(v: number): number {
  return (v - 1) * 3;
}

function scoreDecision(v: number): number {
  return (5 - v) * 3;
}

function scoreRelationnel(v: number): number {
  return (5 - v) * 2;
}

function scoreEncadrement(v: string): number {
  switch (v) {
    case 'Aucune':
      return 4;
    case '1-5':
      return 3;
    case '6-15':
      return 1;
    case 'Plus de 15':
      return 0;
    default:
      return 0;
  }
}

const TOTAL_STEPS = 9;

const inputClass =
  'w-full bg-transparent border border-[#c9a84c]/30 focus:border-[#c9a84c] px-5 py-4 text-[#f4f0e8] text-base outline-none transition-colors';

const optionButtonClass = (selected: boolean) =>
  `w-full text-left px-6 py-4 border transition-all duration-300 text-base ${
    selected
      ? 'border-[#c9a84c] bg-[#c9a84c] text-[#0e0e0e] font-bold'
      : 'border-[#c9a84c]/30 text-[#f4f0e8] hover:border-[#c9a84c]/70'
  }`;

export default function DiagnosticForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(INITIAL_ANSWERS);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof Answers>(key: K, value: Answers[K]) {
    setAnswers((a) => ({ ...a, [key]: value }));
  }

  function isStepValid(): boolean {
    switch (step) {
      case 0:
        return answers.poste.trim().length > 0;
      case 1:
        return answers.secteur !== '';
      case 2:
        return answers.anciennete !== '';
      case 3:
        return answers.taches !== null;
      case 4:
        return answers.decision !== null;
      case 5:
        return answers.relationnel !== null;
      case 6:
        return answers.encadrement !== '';
      case 7:
        return answers.inquietude !== '';
      case 8:
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answers.email) && answers.consentement;
      default:
        return false;
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);

    const subScores = {
      anciennete: scoreAnciennete(answers.anciennete),
      taches: scoreTaches(answers.taches as number),
      decision: scoreDecision(answers.decision as number),
      relationnel: scoreRelationnel(answers.relationnel as number),
      encadrement: scoreEncadrement(answers.encadrement),
      secteur: scoreSecteur(answers.secteur),
    };
    const total =
      subScores.anciennete +
      subScores.taches +
      subScores.decision +
      subScores.relationnel +
      subScores.encadrement +
      subScores.secteur;

    try {
      const res = await fetch('/api/diagnostic-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: answers.email,
          poste: answers.poste,
          secteur: answers.secteur,
          inquietude: answers.inquietude,
          anciennete: subScores.anciennete,
          procedural: subScores.taches,
          decision: subScores.decision,
          relationnel: subScores.relationnel,
          encadrement: subScores.encadrement,
          secteur_modif: subScores.secteur,
          score_total: total,
        }),
      });

      if (!res.ok) {
        throw new Error('submit-failed');
      }

      sessionStorage.setItem('diagnostic-email', answers.email);

      const params = new URLSearchParams({
        total: String(total),
        anciennete: String(subScores.anciennete),
        taches: String(subScores.taches),
        decision: String(subScores.decision),
        relationnel: String(subScores.relationnel),
        encadrement: String(subScores.encadrement),
        secteur: String(subScores.secteur),
      });
      router.push(`/diagnostic-exposition-ia/resultat?${params.toString()}`);
    } catch {
      setError("Une erreur est survenue lors de l'envoi. Réessayez dans quelques instants.");
      setSubmitting(false);
    }
  }

  function handleNext() {
    if (step === TOTAL_STEPS - 1) {
      handleSubmit();
    } else {
      setStep((s) => s + 1);
    }
  }

  function handlePrevious() {
    setStep((s) => Math.max(0, s - 1));
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] flex flex-col items-center justify-center px-5 md:px-8 py-20">
      <div className="w-full max-w-xl">
        {/* Progress */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xs font-bold tracking-[0.3em] uppercase text-[#c9a84c]">
              Diagnostic exposition IA
            </span>
            <span className="font-mono text-xs text-[#f4f0e8]/50">
              {step + 1} / {TOTAL_STEPS}
            </span>
          </div>
          <div className="h-px bg-[#c9a84c]/15 relative">
            <div
              className="absolute top-0 left-0 h-px bg-[#c9a84c] transition-all duration-500"
              style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="min-h-[280px]">
          {step === 0 && (
            <div className="space-y-6">
              <h1 className="text-2xl md:text-3xl font-bold text-[#f4f0e8] leading-tight">
                Quel est votre poste actuel ?
              </h1>
              <input
                type="text"
                value={answers.poste}
                onChange={(e) => update('poste', e.target.value)}
                placeholder="Ex : Contrôleur financier"
                className={inputClass}
                autoFocus
              />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <h1 className="text-2xl md:text-3xl font-bold text-[#f4f0e8] leading-tight">
                Dans quel secteur travaillez-vous ?
              </h1>
              <div className="grid grid-cols-2 gap-3">
                {SECTEURS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => update('secteur', s)}
                    className={optionButtonClass(answers.secteur === s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h1 className="text-2xl md:text-3xl font-bold text-[#f4f0e8] leading-tight">
                Depuis combien de temps occupez-vous cette fonction ?
              </h1>
              <div className="space-y-3">
                {ANCIENNETES.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => update('anciennete', a)}
                    className={optionButtonClass(answers.anciennete === a)}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <LikertStep
              question="Une part importante de mon travail consiste à traiter des dossiers, produire des rapports ou analyser des données selon des procédures établies."
              value={answers.taches}
              onSelect={(v) => update('taches', v)}
            />
          )}

          {step === 4 && (
            <LikertStep
              question="Je prends régulièrement des décisions sur des situations ambiguës, sans précédent clair."
              value={answers.decision}
              onSelect={(v) => update('decision', v)}
            />
          )}

          {step === 5 && (
            <LikertStep
              question="Une part importante de mon travail consiste à négocier, manager ou entretenir des relations à fort enjeu."
              value={answers.relationnel}
              onSelect={(v) => update('relationnel', v)}
            />
          )}

          {step === 6 && (
            <div className="space-y-6">
              <h1 className="text-2xl md:text-3xl font-bold text-[#f4f0e8] leading-tight">
                Combien de personnes encadrez-vous directement ?
              </h1>
              <div className="space-y-3">
                {ENCADREMENTS.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => update('encadrement', e)}
                    className={optionButtonClass(answers.encadrement === e)}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-6">
              <h1 className="text-2xl md:text-3xl font-bold text-[#f4f0e8] leading-tight">
                Qu&apos;est-ce qui vous inquiète le plus concrètement ?
              </h1>
              <div className="space-y-3">
                {INQUIETUDES.map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => update('inquietude', i)}
                    className={optionButtonClass(answers.inquietude === i)}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 8 && (
            <div className="space-y-6">
              <h1 className="text-2xl md:text-3xl font-bold text-[#f4f0e8] leading-tight">
                Où envoyer vos résultats ?
              </h1>
              <input
                type="email"
                value={answers.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="vous@exemple.com"
                className={inputClass}
                autoFocus
              />
              <label className="flex items-start gap-3 text-sm text-[#f4f0e8]/70 leading-relaxed cursor-pointer">
                <input
                  type="checkbox"
                  checked={answers.consentement}
                  onChange={(e) => update('consentement', e.target.checked)}
                  className="mt-1 accent-[#c9a84c]"
                />
                J&apos;accepte de recevoir les résultats et le contenu associé par email.
              </label>
              {error && <p className="text-sm text-[#E24B4A]">{error}</p>}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={step === 0 || submitting}
            className="font-mono text-xs font-bold tracking-widest uppercase text-[#f4f0e8]/50 hover:text-[#f4f0e8] disabled:opacity-0 disabled:pointer-events-none transition-colors"
          >
            ← Précédent
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={!isStepValid() || submitting}
            className="font-mono inline-flex items-center gap-2 px-8 py-3.5 border border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#0e0e0e] disabled:opacity-30 disabled:pointer-events-none transition-all duration-500 text-xs font-bold tracking-widest uppercase"
          >
            {step === TOTAL_STEPS - 1
              ? submitting
                ? 'Envoi...'
                : 'Voir mon score'
              : 'Suivant →'}
          </button>
        </div>
      </div>
    </div>
  );
}

function LikertStep({
  question,
  value,
  onSelect,
}: {
  question: string;
  value: number | null;
  onSelect: (v: number) => void;
}) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-[#f4f0e8] leading-tight">{question}</h1>
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs text-[#f4f0e8]/50 shrink-0">Pas du tout</span>
        <div className="flex gap-2 flex-1 justify-center">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onSelect(n)}
              className={`w-14 h-14 border font-mono font-bold transition-all duration-300 ${
                value === n
                  ? 'border-[#c9a84c] bg-[#c9a84c] text-[#0e0e0e]'
                  : 'border-[#c9a84c]/30 text-[#f4f0e8] hover:border-[#c9a84c]/70'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <span className="font-mono text-xs text-[#f4f0e8]/50 shrink-0">Tout à fait</span>
      </div>
    </div>
  );
}

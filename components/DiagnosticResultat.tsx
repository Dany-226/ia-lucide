'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Gauge from './Gauge';

const VERT = '#639922';
const JAUNE_VERT = '#97C459';
const ORANGE = '#EF9F27';
const ROUGE = '#E24B4A';

function colorByRange3(score: number, b1: number, b2: number): string {
  if (score <= b1) return VERT;
  if (score <= b2) return ORANGE;
  return ROUGE;
}

function textByColor(color: string, texts: { vert: string; orange: string; rouge: string }): string {
  if (color === VERT) return texts.vert;
  if (color === ORANGE) return texts.orange;
  return texts.rouge;
}

function colorAnciennete(score: number): string {
  if (score === 2) return ROUGE;
  if (score === 1) return ORANGE;
  if (score === 0) return JAUNE_VERT;
  return VERT; // -2
}

function textAnciennete(score: number): string {
  if (score === 2)
    return "Vous êtes tôt dans cette fonction. Les recrutements juniors reculent en premier dans les secteurs exposés, pas parce que le travail junior est moins bon, mais parce qu'il est souvent le plus codifiable.";
  if (score === 1)
    return "Ancienneté encore récente. L'expertise tacite qui protège le mieux se construit surtout après 7-8 ans dans une fonction.";
  if (score === 0)
    return "Vous avez construit une expertise qui ne se réplique pas facilement en quelques mois.";
  return "Votre ancienneté constitue une vraie protection : le jugement accumulé sur 15 ans et plus ne s'improvise pas.";
}

function colorEncadrement(score: number): string {
  if (score === 4) return ROUGE;
  if (score === 3) return ORANGE;
  if (score === 1) return JAUNE_VERT;
  return VERT; // 0
}

function textEncadrement(score: number): string {
  if (score === 4)
    return "Le management d'équipe reste l'un des rares rôles où le relationnel humain est peu substituable. Son absence retire une protection.";
  if (score === 3) return "Un encadrement d'équipe restreint.";
  if (score === 1) return 'Un encadrement d\'équipe conséquent.';
  return "Un encadrement d'équipe large, une protection réelle.";
}

function colorSecteur(score: number): string {
  return score === 2 ? ROUGE : VERT;
}

function textSecteur(score: number): string {
  return score === 2
    ? "Votre secteur n'a pas le même frein réglementaire face à l'adoption de l'IA."
    : "Un cadre réglementaire qui ralentit structurellement l'adoption de l'IA sur les décisions à enjeu dans votre secteur.";
}

function globalLevel(total: number): { label: string; color: string } {
  if (total <= 10) return { label: 'Faible', color: VERT };
  if (total <= 22) return { label: 'Modérée', color: ORANGE };
  return { label: 'Élevée', color: ROUGE };
}

const SOURCES = [
  {
    name: 'Coface / Observatoire des Emplois Menacés et Émergents (OEM), 2026',
    links: [
      {
        label: 'Le Journal du Geek',
        href: 'https://www.journaldugeek.com/2026/04/02/5-millions-demplois-menaces-par-lia-en-france-voici-les-professions-concernees/',
      },
      {
        label: 'CFE-CGC',
        href: 'https://www.cfecgc.org/actualites/intelligence-artificielle-en-france-5-millions-demplois-menaces-en-france',
      },
    ],
  },
  {
    name: 'OCDE, Employment Outlook 2023',
    links: [
      {
        label: 'oecd.org',
        href: 'https://www.oecd.org/en/publications/oecd-employment-outlook-2023_08785bba-en.html',
      },
    ],
  },
  {
    name: 'Anthropic Economic Index, rapport de mars 2026',
    links: [
      {
        label: 'anthropic.com',
        href: 'https://www.anthropic.com/research/economic-index-march-2026-report',
      },
    ],
  },
  {
    name: 'France Stratégie / DARES, "Les métiers en 2030"',
    links: [
      {
        label: 'dares.travail-emploi.gouv.fr',
        href: 'https://dares.travail-emploi.gouv.fr/sites/default/files/4f14abe57cd069624a02f1a1790d9f22/Les%20m%C3%A9tiers%20en%202030%20-%20Le%20rapport.pdf',
      },
    ],
  },
];

function DimensionCard({
  title,
  score,
  min,
  max,
  segments,
  text,
}: {
  title: string;
  score: number;
  min: number;
  max: number;
  segments: { from: number; to: number; color: string }[];
  text: string;
}) {
  return (
    <div className="border border-[#c9a84c]/20 p-6 flex flex-col items-center text-center">
      <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-[#c9a84c] mb-4">
        {title}
      </span>
      <Gauge score={score} min={min} max={max} segments={segments} size={160} />
      <p className="text-sm text-[#f4f0e8]/70 leading-relaxed mt-4">{text}</p>
    </div>
  );
}

export default function DiagnosticResultat() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string | null>(null);
  const [ctaState, setCtaState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  useEffect(() => {
    setEmail(sessionStorage.getItem('diagnostic-email'));
  }, []);

  const total = Number(searchParams.get('total') ?? 0);
  const anciennete = Number(searchParams.get('anciennete') ?? 0);
  const taches = Number(searchParams.get('taches') ?? 0);
  const decision = Number(searchParams.get('decision') ?? 0);
  const relationnel = Number(searchParams.get('relationnel') ?? 0);
  const encadrement = Number(searchParams.get('encadrement') ?? 0);
  const secteur = Number(searchParams.get('secteur') ?? 0);

  const level = globalLevel(total);

  const tachesColor = colorByRange3(taches, 3, 8);
  const decisionColor = colorByRange3(decision, 3, 8);
  const relationnelColor = colorByRange3(relationnel, 2, 5);

  async function handleCtaClick() {
    setCtaState('sending');
    try {
      const res = await fetch('/api/diagnostic-interet-conseiller', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('failed');
      setCtaState('sent');
    } catch {
      setCtaState('error');
    }
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] px-5 md:px-8 py-20">
      <div className="max-w-4xl mx-auto">
        {/* Score global */}
        <div className="text-center mb-20">
          <span className="font-mono text-xs font-bold tracking-[0.3em] uppercase text-[#c9a84c] mb-8 block">
            Votre exposition IA
          </span>
          <div className="flex justify-center">
            <Gauge
              score={total}
              min={-2}
              max={40}
              segments={[
                { from: -2, to: 10, color: VERT },
                { from: 10, to: 22, color: ORANGE },
                { from: 22, to: 40, color: ROUGE },
              ]}
              size={320}
            />
          </div>
          <p className="text-3xl md:text-4xl font-bold mt-4" style={{ color: level.color }}>
            {level.label}
          </p>
        </div>

        {/* 6 jauges individuelles */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          <DimensionCard
            title="Ancienneté"
            score={anciennete}
            min={-2}
            max={2}
            segments={[
              { from: -2, to: -1, color: VERT },
              { from: -1, to: 0, color: JAUNE_VERT },
              { from: 0, to: 1, color: ORANGE },
              { from: 1, to: 2, color: ROUGE },
            ]}
            text={textAnciennete(anciennete)}
          />
          <DimensionCard
            title="Tâches procédurales"
            score={taches}
            min={0}
            max={12}
            segments={[
              { from: 0, to: 3, color: VERT },
              { from: 3, to: 8, color: ORANGE },
              { from: 8, to: 12, color: ROUGE },
            ]}
            text={textByColor(tachesColor, {
              vert: 'Votre travail repose peu sur des tâches procédurales, un facteur de protection important.',
              orange: 'Un mélange de tâches procédurales et de travail plus singulier.',
              rouge:
                "Une part importante de votre travail suit des procédures établies, exactement le type de tâche où l'IA progresse le plus vite.",
            })}
          />
          <DimensionCard
            title="Décision ambiguë"
            score={decision}
            min={0}
            max={12}
            segments={[
              { from: 0, to: 3, color: VERT },
              { from: 3, to: 8, color: ORANGE },
              { from: 8, to: 12, color: ROUGE },
            ]}
            text={textByColor(decisionColor, {
              vert: "Vous arbitrez régulièrement des situations sans précédent clair, un vrai facteur de protection : l'IA reste peu fiable sur le jugement en zone grise.",
              orange: 'Vous arbitrez parfois des situations sans précédent clair.',
              rouge:
                "Votre travail suit rarement des situations ambiguës à trancher, une routine décisionnelle de plus en plus couverte par l'IA.",
            })}
          />
          <DimensionCard
            title="Relationnel à enjeu"
            score={relationnel}
            min={0}
            max={8}
            segments={[
              { from: 0, to: 2, color: VERT },
              { from: 2, to: 5, color: ORANGE },
              { from: 5, to: 8, color: ROUGE },
            ]}
            text={textByColor(relationnelColor, {
              vert: 'Négociation, management ou relation client à fort enjeu occupent une vraie place dans votre travail, un registre qui reste difficile à automatiser.',
              orange: 'Le relationnel à enjeu occupe une place modérée dans votre travail.',
              rouge: 'Le relationnel à fort enjeu occupe peu de place dans votre travail actuel.',
            })}
          />
          <DimensionCard
            title="Encadrement"
            score={encadrement}
            min={0}
            max={4}
            segments={[
              { from: 0, to: 1, color: VERT },
              { from: 1, to: 2, color: JAUNE_VERT },
              { from: 2, to: 3, color: ORANGE },
              { from: 3, to: 4, color: ROUGE },
            ]}
            text={textEncadrement(encadrement)}
          />
          <DimensionCard
            title="Secteur"
            score={secteur}
            min={0}
            max={2}
            segments={[
              { from: 0, to: 1, color: VERT },
              { from: 1, to: 2, color: ROUGE },
            ]}
            text={textSecteur(secteur)}
          />
        </div>

        {/* Sources et méthodologie */}
        <div className="border-t border-[#c9a84c]/15 pt-12 mb-16">
          <h2 className="font-mono text-xs font-bold tracking-[0.3em] uppercase text-[#c9a84c] mb-6">
            Sources et méthodologie
          </h2>
          <ul className="space-y-3 mb-6">
            {SOURCES.map((source) => (
              <li key={source.name} className="text-sm text-[#f4f0e8]/70">
                {source.name}
                {' — '}
                {source.links.map((link, i) => (
                  <span key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#c9a84c] hover:underline"
                    >
                      {link.label}
                    </a>
                    {i < source.links.length - 1 && ' · '}
                  </span>
                ))}
              </li>
            ))}
          </ul>
          <p className="text-sm text-[#f4f0e8]/50 italic leading-relaxed">
            Ces chiffres mesurent l&apos;exposition des tâches, pas leur suppression. Un métier exposé n&apos;est
            pas un métier condamné.
          </p>
        </div>

        {/* CTA conseiller */}
        <div className="border border-[#c9a84c]/30 p-8 md:p-10 text-center">
          <p className="text-base md:text-lg text-[#f4f0e8]/80 leading-relaxed mb-6 max-w-xl mx-auto">
            Si ce résultat change la façon dont vous envisagez la suite, ça peut valoir la peine d&apos;anticiper
            aussi le volet patrimonial.
          </p>
          <button
            type="button"
            onClick={handleCtaClick}
            disabled={ctaState === 'sending' || ctaState === 'sent'}
            className="font-mono inline-flex items-center gap-2 px-8 py-3.5 border border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#0e0e0e] disabled:opacity-50 transition-all duration-500 text-xs font-bold tracking-widest uppercase"
          >
            {ctaState === 'sent'
              ? 'Demande envoyée'
              : ctaState === 'sending'
                ? 'Envoi...'
                : 'Être mis en relation avec un conseiller spécialisé'}
          </button>
          {ctaState === 'error' && (
            <p className="text-sm text-[#E24B4A] mt-4">
              Une erreur est survenue. Réessayez dans quelques instants.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

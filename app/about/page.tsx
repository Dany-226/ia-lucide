import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'À propos — IA Lucide',
  description:
    "IA Lucide : le regard lucide sur l'IA qui transforme les métiers. Qui nous sommes, notre mission, notre méthodologie.",
};

export default function AboutPage() {
  return (
    <div className="pt-28 md:pt-36 pb-20 bg-[#0e0e0e] min-h-screen">
      <div className="max-w-3xl mx-auto px-5 md:px-8">

        {/* Header */}
        <div className="mb-16 md:mb-20 animate-fade-in-up">
          <span
            className="text-[10px] tracking-[0.4em] uppercase text-[#c9a84c] mb-6 block"
          >
            À propos — Février 2026
          </span>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-black italic text-[#f4f0e8] leading-[1.05]"
          >
            Voir l&apos;IA sans illusions.
          </h1>
          <div className="h-px bg-[#c9a84c]/15 mt-10" />
        </div>

        <div className="space-y-14 animate-fade-in-up animate-delay-1">

          {/* Section 1 */}
          <section>
            <h2
              className="text-2xl md:text-3xl font-bold italic text-[#f4f0e8] mb-6"
            >
              Pourquoi ialucide.fr ?
            </h2>
            <div className="space-y-5">
              {[
                "Depuis 15 ans, j'exerce dans un secteur médical où la technicité est élevée, la réglementation contraignante, et les transformations technologiques — quand elles arrivent — arrivent vite et sans prévenir.",
                "Quand les premiers outils d'IA ont commencé à modifier concrètement certaines de mes tâches quotidiennes, j'ai cherché des analyses sérieuses sur ce que ça changeait vraiment pour les professionnels en exercice. Pas des prédictions. Pas des promesses. Des faits, tâche par tâche.",
                "Je n'ai pas trouvé ce que je cherchais. L'information existait, mais noyée entre deux postures également inutiles : le catastrophisme qui prédit la fin du travail humain, et l'évangélisme qui promet que \"l'IA va vous libérer pour l'essentiel.\"",
                "Les professionnels qui travaillent — commerciaux, juristes, comptables, managers, médecins — n'ont pas besoin de grandes théories. Ils ont besoin de savoir, concrètement, ce qui change dans leur métier. Ce qu'ils risquent de perdre. Ce qu'ils ont intérêt à apprendre. Ce qu'ils peuvent faire dans les 90 prochains jours.",
              ].map((text, i) => (
                <p
                  key={i}
                  className="text-base md:text-lg text-[#d4d0c8] leading-[1.85]"
                >
                  {text}
                </p>
              ))}
              <p
                className="text-base md:text-lg text-[#c9a84c] leading-[1.85] font-semibold"
              >
                C&apos;est pour répondre à cette question que ialucide.fr existe.
              </p>
            </div>
          </section>

          <div className="h-px bg-[#c9a84c]/15" />

          {/* Section 2 */}
          <section>
            <h2
              className="text-2xl md:text-3xl font-bold italic text-[#f4f0e8] mb-8"
            >
              Ce que vous trouverez ici
            </h2>
            <div className="space-y-8">
              {[
                {
                  title: 'Des analyses par métier — pas des généralités.',
                  text: "Chaque profession est touchée différemment, à un rythme différent, sur des tâches différentes. Un comptable n'a pas les mêmes enjeux qu'un journaliste ou qu'un médecin. Chaque analyse est construite spécifiquement pour le métier concerné, avec des exemples concrets, des outils réels et un plan d'action actionnable.",
                },
                {
                  title: 'Un regard honnête — ni dans la peur, ni dans le déni.',
                  text: "Certaines tâches vont disparaître. Certains postes vont évoluer radicalement. Le nier ne sert à personne. Mais l'ampleur de la transformation varie énormément selon les métiers, les niveaux d'expertise et les types de missions. ialucide.fr s'efforce de distinguer ce qui est déjà là, ce qui arrive dans 2 ans, et ce qui reste incertain.",
                },
                {
                  title: "Des ressources pour agir — pas pour s'inquiéter.",
                  text: "Chaque analyse se termine par un plan d'action concret. Des outils à tester, des formations à suivre, des compétences à développer. L'objectif n'est pas de vous laisser avec une meilleure compréhension du problème — c'est de vous donner les moyens d'y répondre.",
                },
              ].map((item) => (
                <div key={item.title} className="border-l-2 border-[#c9a84c]/40 pl-6">
                  <h3
                    className="text-lg font-semibold text-[#f4f0e8] mb-2"
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-base text-[#d4d0c8] leading-[1.8]"
                  >
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <div className="h-px bg-[#c9a84c]/15" />

          {/* Section 3 — Qui suis-je */}
          <section>
            <h2
              className="text-2xl md:text-3xl font-bold italic text-[#f4f0e8] mb-6"
            >
              Qui suis-je ?
            </h2>
            <div className="space-y-5">
              <p
                className="text-base md:text-lg text-[#d4d0c8] leading-[1.85]"
              >
                Je m&apos;appelle <strong className="text-[#f4f0e8] font-semibold">Daniel Rollin</strong>. Depuis 15 ans, j&apos;exerce comme expert indépendant en appareillage prothétique externe en France — un métier de haute technicité, au carrefour du médical, du réglementaire et de la relation patient.
              </p>
              <p
                className="text-base md:text-lg text-[#d4d0c8] leading-[1.85]"
              >
                C&apos;est dans ce secteur que j&apos;ai observé pour la première fois, concrètement, ce que fait une technologie disruptive sur un métier : pas de façon abstraite, mais tâche par tâche, compétence par compétence. Ce que l&apos;outil remplace. Ce qu&apos;il amplifie. Ce qu&apos;il rend obsolète sans prévenir.
              </p>
              <p
                className="text-base md:text-lg text-[#d4d0c8] leading-[1.85]"
              >
                En parallèle, j&apos;ai fondé DIGICORPEX et commencé à construire des outils digitaux pour mon secteur — ce qui m&apos;a amené à tester, comprendre et challenger les modèles d&apos;IA dans des contextes professionnels réels, pas en laboratoire.
              </p>
              <p
                className="text-base md:text-lg text-[#d4d0c8] leading-[1.85]"
              >
                Je ne suis pas chercheur en IA. Ce que je fais, c&apos;est appliquer à d&apos;autres métiers la même grille d&apos;analyse que j&apos;ai développée sur le mien : qu&apos;est-ce qui change vraiment ? À quel rythme ? Avec quelles conséquences concrètes pour les professionnels en exercice ?{' '}
                <a
                  href="https://fr.linkedin.com/in/danielrollin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#c9a84c] hover:underline"
                >
                  Mon profil LinkedIn
                </a>
              </p>
              <p
                className="text-base md:text-lg text-[#d4d0c8] leading-[1.85]"
              >
                ialucide.fr est le résultat de cette démarche.
              </p>
            </div>
          </section>

          <div className="h-px bg-[#c9a84c]/15" />

          {/* Contact */}
          <section>
            <h2
              className="text-2xl md:text-3xl font-bold italic text-[#f4f0e8] mb-6"
            >
              Une question ? Une suggestion ?
            </h2>
            <p
              className="text-base md:text-lg text-[#d4d0c8] leading-[1.85] mb-8"
            >
              Si vous travaillez dans un métier que nous n&apos;avons pas encore analysé, si vous avez des retours d&apos;expérience concrets sur l&apos;IA dans votre secteur, ou si vous souhaitez échanger — écrivez-moi.
            </p>
            <a
              href="mailto:contact@ialucide.fr"
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#0e0e0e] transition-all duration-500 text-xs tracking-widest uppercase"
            >
              contact@ialucide.fr
            </a>
          </section>

          <div className="h-px bg-[#c9a84c]/15" />

          {/* ailucide.com */}
          <section className="border border-[#c9a84c]/20 p-8">
            <h2
              className="text-xl font-bold text-[#f4f0e8] mb-4"
            >
              ialucide.fr et ailucide.com
            </h2>
            <p
              className="text-base text-[#d4d0c8] leading-[1.8] mb-4"
            >
              ialucide.fr s&apos;adresse à tous les professionnels qui veulent comprendre l&apos;impact de l&apos;IA sur leur métier.
            </p>
            <p
              className="text-base text-[#d4d0c8] leading-[1.8]"
            >
              Si vous êtes cadre supérieur, dirigeant ou profession libérale et que vous souhaitez aller plus loin — mesurez votre exposition professionnelle et patrimoniale à l&apos;IA sur{' '}
              <a
                href="https://ailucide.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#c9a84c] hover:underline"
              >
                ailucide.com
              </a>.
            </p>
          </section>

          {/* Final quote */}
          <blockquote className="border-l-2 border-[#c9a84c] pl-6 my-4">
            <p
              className="text-xl md:text-2xl italic text-[#c9a84c]/80 leading-relaxed"
            >
              &ldquo;Voir l&apos;IA sans illusions.&rdquo;
            </p>
          </blockquote>

        </div>
      </div>
    </div>
  );
}

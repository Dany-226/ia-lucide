import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact — IA Lucide',
  description: "Contactez ialucide.fr — questions, suggestions, retours d'expérience professionnels sur l'IA.",
  alternates: {
    canonical: 'https://ialucide.fr/contact/',
  },
  openGraph: {
    description: "Contactez ialucide.fr — questions, suggestions, retours d'expérience professionnels sur l'IA.",
  },
  twitter: {
    description: "Contactez ialucide.fr — questions, suggestions, retours d'expérience professionnels sur l'IA.",
  },
};

export default function ContactPage() {
  return (
    <div className="pt-28 md:pt-36 pb-20 bg-[#1c1c17] min-h-screen">
      <div className="max-w-3xl mx-auto px-5 md:px-8">

        {/* Header */}
        <div className="mb-16 md:mb-20">
          <span className="font-mono text-xs font-bold tracking-[0.4em] uppercase text-[#c9a84c] mb-6 block">
            Nous écrire
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#fcf9f0] leading-[1.05]">
            Contact
          </h1>
          <div className="h-px bg-[#c9a84c]/15 mt-10" />
        </div>

        <div className="space-y-14">

          {/* Intro */}
          <section>
            <div className="space-y-5">
              <p className="text-base md:text-lg text-[#fcf9f0]/70 leading-[1.85]">
                Vous travaillez dans un métier que nous n&apos;avons pas encore analysé ? Vous avez des retours d&apos;expérience concrets sur l&apos;IA dans votre secteur ? Vous souhaitez corriger une information ou proposer une collaboration ?
              </p>
              <p className="text-base md:text-lg text-[#fcf9f0]/70 leading-[1.85]">
                Écrivez-nous directement. Nous lisons tous les messages.
              </p>
            </div>
          </section>

          <div className="h-px bg-[#c9a84c]/15" />

          {/* Canaux de contact */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-[#fcf9f0] mb-8">
              Nous joindre
            </h2>
            <div className="space-y-6">

              {/* Email */}
              <div className="border border-[#c9a84c]/20 p-8 space-y-4">
                <h3 className="font-mono text-xs font-bold tracking-[0.3em] uppercase text-[#c9a84c]">
                  Email
                </h3>
                <p className="text-base text-[#fcf9f0]/70 leading-[1.8]">
                  Pour toute question, suggestion ou demande de collaboration.
                </p>
                <a
                  href="mailto:contact@ialucide.fr"
                  className="font-mono inline-flex items-center gap-2 px-8 py-3.5 border border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#1c1c17] transition-all duration-500 text-xs font-bold tracking-widest uppercase"
                >
                  contact@ialucide.fr
                </a>
              </div>

              {/* LinkedIn */}
              <div className="border border-[#c9a84c]/20 p-8 space-y-4">
                <h3 className="font-mono text-xs font-bold tracking-[0.3em] uppercase text-[#c9a84c]">
                  LinkedIn
                </h3>
                <p className="text-base text-[#fcf9f0]/70 leading-[1.8]">
                  Pour échanger sur l&apos;impact de l&apos;IA sur les métiers, ou simplement suivre les publications.
                </p>
                <a
                  href="https://www.linkedin.com/in/danielrollin/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono inline-flex items-center gap-2 px-8 py-3.5 border border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#1c1c17] transition-all duration-500 text-xs font-bold tracking-widest uppercase"
                >
                  Daniel Rollin →
                </a>
              </div>
            </div>
          </section>

          <div className="h-px bg-[#c9a84c]/15" />

          {/* Éditeur */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-[#fcf9f0] mb-6">
              Éditeur
            </h2>
            <div className="space-y-3 text-base text-[#fcf9f0]/70 leading-[1.85]">
              <p>
                ialucide.fr est édité par <strong className="text-[#fcf9f0]">DIGICORPEX</strong>, fondée et dirigée par Daniel Rollin.
              </p>
              <p>
                Pour les informations légales complètes, consultez les{' '}
                <a href="/mentions-legales/" className="text-[#c9a84c] hover:underline">
                  mentions légales
                </a>.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

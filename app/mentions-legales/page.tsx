import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mentions légales — IA Lucide',
  description: 'Mentions légales de ialucide.fr — éditeur DIGICORPEX, hébergeur Cloudflare Inc.',
  alternates: {
    canonical: 'https://ialucide.fr/mentions-legales/',
  },
  openGraph: {
    description: 'Mentions légales de ialucide.fr — éditeur DIGICORPEX, hébergeur Cloudflare Inc.',
  },
  twitter: {
    description: 'Mentions légales de ialucide.fr — éditeur DIGICORPEX, hébergeur Cloudflare Inc.',
  },
};

export default function MentionsLegalesPage() {
  return (
    <div className="pt-28 md:pt-36 pb-20 bg-[#1c1c17] min-h-screen">
      <div className="max-w-3xl mx-auto px-5 md:px-8">

        {/* Header */}
        <div className="mb-16 md:mb-20">
          <span className="font-mono text-xs font-bold tracking-[0.4em] uppercase text-[#c9a84c] mb-6 block">
            Informations légales
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#fcf9f0] leading-[1.05]">
            Mentions légales
          </h1>
          <div className="h-px bg-[#c9a84c]/15 mt-10" />
        </div>

        <div className="space-y-14">

          {/* Éditeur */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-[#fcf9f0] mb-6">
              Éditeur du site
            </h2>
            <div className="space-y-3 text-base text-[#fcf9f0]/70 leading-[1.85]">
              <p><strong className="text-[#fcf9f0]">Raison sociale :</strong> DIGICORPEX</p>
              <p><strong className="text-[#fcf9f0]">Directeur de la publication :</strong> Daniel Rollin</p>
              <p>
                <strong className="text-[#fcf9f0]">Contact :</strong>{' '}
                <a
                  href="mailto:contact@ialucide.fr"
                  className="text-[#c9a84c] hover:underline"
                >
                  contact@ialucide.fr
                </a>
              </p>
              <p><strong className="text-[#fcf9f0]">Site web :</strong> ialucide.fr</p>
            </div>
          </section>

          <div className="h-px bg-[#c9a84c]/15" />

          {/* Hébergeur */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-[#fcf9f0] mb-6">
              Hébergeur
            </h2>
            <div className="space-y-3 text-base text-[#fcf9f0]/70 leading-[1.85]">
              <p><strong className="text-[#fcf9f0]">Société :</strong> Cloudflare, Inc.</p>
              <p><strong className="text-[#fcf9f0]">Siège social :</strong> 101 Townsend St, San Francisco, CA 94107, États-Unis</p>
              <p><strong className="text-[#fcf9f0]">Site web :</strong> cloudflare.com</p>
            </div>
          </section>

          <div className="h-px bg-[#c9a84c]/15" />

          {/* Propriété intellectuelle */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-[#fcf9f0] mb-6">
              Propriété intellectuelle
            </h2>
            <p className="text-base text-[#fcf9f0]/70 leading-[1.85]">
              L&apos;ensemble des contenus publiés sur ialucide.fr (textes, analyses, structure éditoriale) est la propriété exclusive de DIGICORPEX, sauf mention contraire. Toute reproduction, même partielle, sans autorisation écrite préalable est interdite.
            </p>
          </section>

          <div className="h-px bg-[#c9a84c]/15" />

          {/* Responsabilité */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-[#fcf9f0] mb-6">
              Limitation de responsabilité
            </h2>
            <p className="text-base text-[#fcf9f0]/70 leading-[1.85]">
              Les informations publiées sur ialucide.fr sont fournies à titre informatif. DIGICORPEX s&apos;efforce d&apos;assurer l&apos;exactitude et la mise à jour des informations diffusées, mais ne peut garantir leur exhaustivité ou leur actualité. L&apos;utilisateur est seul responsable de l&apos;usage qu&apos;il fait des informations consultées.
            </p>
          </section>

          <div className="h-px bg-[#c9a84c]/15" />

          {/* Données personnelles */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-[#fcf9f0] mb-6">
              Données personnelles & cookies
            </h2>
            <p className="text-base text-[#fcf9f0]/70 leading-[1.85]">
              Pour toute information sur la collecte et le traitement des données personnelles, veuillez consulter notre{' '}
              <a href="/politique-confidentialite/" className="text-[#c9a84c] hover:underline">
                politique de confidentialité
              </a>.
            </p>
          </section>

          <div className="h-px bg-[#c9a84c]/15" />

          <p className="font-mono text-xs text-[#6b6b6b] tracking-wider">
            Dernière mise à jour : avril 2026
          </p>

        </div>
      </div>
    </div>
  );
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de confidentialité — IA Lucide',
  description: 'Politique de confidentialité de ialucide.fr — RGPD, cookies, newsletter Beehiiv.',
  alternates: {
    canonical: 'https://ialucide.fr/politique-confidentialite/',
  },
  openGraph: {
    description: 'Politique de confidentialité de ialucide.fr — RGPD, cookies, newsletter Beehiiv.',
  },
  twitter: {
    description: 'Politique de confidentialité de ialucide.fr — RGPD, cookies, newsletter Beehiiv.',
  },
};

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="pt-28 md:pt-36 pb-20 bg-[#1c1c17] min-h-screen">
      <div className="max-w-3xl mx-auto px-5 md:px-8">

        {/* Header */}
        <div className="mb-16 md:mb-20">
          <span className="font-mono text-xs font-bold tracking-[0.4em] uppercase text-[#c9a84c] mb-6 block">
            Vie privée & données
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#fcf9f0] leading-[1.05]">
            Politique de confidentialité
          </h1>
          <div className="h-px bg-[#c9a84c]/15 mt-10" />
        </div>

        <div className="space-y-14">

          {/* Principe général */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-[#fcf9f0] mb-6">
              Principe général
            </h2>
            <p className="text-base text-[#fcf9f0]/70 leading-[1.85]">
              ialucide.fr ne collecte aucune donnée personnelle lors de la simple navigation sur le site. Aucun formulaire d&apos;inscription, aucun espace membre, aucune création de compte n&apos;est proposé. Les seules données personnelles traitées concernent les abonnés à la newsletter (voir ci-dessous).
            </p>
          </section>

          <div className="h-px bg-[#c9a84c]/15" />

          {/* Newsletter */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-[#fcf9f0] mb-6">
              Newsletter — Beehiiv
            </h2>
            <div className="space-y-5 text-base text-[#fcf9f0]/70 leading-[1.85]">
              <p>
                Si vous choisissez de vous abonner à la newsletter de ialucide.fr, votre adresse e-mail est transmise et stockée par notre prestataire d&apos;emailing{' '}
                <strong className="text-[#fcf9f0]">Beehiiv</strong>, plateforme d&apos;envoi de newsletters dont le siège est situé aux États-Unis.
              </p>
              <div className="border-l-2 border-[#c9a84c]/40 pl-6 space-y-3">
                <p><strong className="text-[#fcf9f0]">Données collectées :</strong> adresse e-mail uniquement.</p>
                <p><strong className="text-[#fcf9f0]">Finalité :</strong> envoi de la newsletter ialucide.fr.</p>
                <p><strong className="text-[#fcf9f0]">Base légale :</strong> consentement (opt-in explicite).</p>
                <p><strong className="text-[#fcf9f0]">Durée de conservation :</strong> jusqu&apos;à désinscription.</p>
                <p><strong className="text-[#fcf9f0]">Désinscription :</strong> via le lien présent dans chaque email ou par demande à contact@ialucide.fr.</p>
              </div>
              <p>
                Beehiiv agit en qualité de sous-traitant au sens du RGPD. Leur politique de confidentialité est consultable sur{' '}
                <a href="https://www.beehiiv.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#c9a84c] hover:underline">beehiiv.com/privacy</a>.
              </p>
            </div>
          </section>

          <div className="h-px bg-[#c9a84c]/15" />

          {/* Cookies */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-[#fcf9f0] mb-6">
              Cookies & traceurs
            </h2>
            <div className="space-y-8 text-base text-[#fcf9f0]/70 leading-[1.85]">
              <p>
                ialucide.fr utilise des cookies tiers à des fins de mesure d&apos;audience et de monétisation. Aucun cookie fonctionnel ni cookie de préférence n&apos;est déposé.
              </p>

              <div>
                <h3 className="text-lg font-semibold text-[#fcf9f0] mb-3">Google Analytics</h3>
                <div className="border-l-2 border-[#c9a84c]/40 pl-6 space-y-2">
                  <p><strong className="text-[#fcf9f0]">Éditeur :</strong> Google LLC (États-Unis)</p>
                  <p><strong className="text-[#fcf9f0]">Finalité :</strong> mesure d&apos;audience anonymisée (pages vues, provenance du trafic, durée de session).</p>
                  <p><strong className="text-[#fcf9f0]">Base légale :</strong> intérêt légitime / consentement selon les paramètres du navigateur.</p>
                  <p><strong className="text-[#fcf9f0]">Opt-out :</strong> extension navigateur Google Analytics Opt-out ou refus via les paramètres de votre navigateur.</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#fcf9f0] mb-3">Google AdSense</h3>
                <div className="border-l-2 border-[#c9a84c]/40 pl-6 space-y-2">
                  <p><strong className="text-[#fcf9f0]">Éditeur :</strong> Google LLC (États-Unis)</p>
                  <p><strong className="text-[#fcf9f0]">Finalité :</strong> affichage de publicités contextuelles pouvant impliquer le dépôt de cookies publicitaires.</p>
                  <p><strong className="text-[#fcf9f0]">Base légale :</strong> consentement.</p>
                  <p><strong className="text-[#fcf9f0]">Opt-out :</strong> via les paramètres publicitaires Google (adssettings.google.com) ou votre navigateur.</p>
                </div>
              </div>

              <p>
                Les transferts de données vers les États-Unis s&apos;effectuent dans le cadre du Data Privacy Framework UE-États-Unis ou sous clauses contractuelles types approuvées par la Commission européenne.
              </p>
            </div>
          </section>

          <div className="h-px bg-[#c9a84c]/15" />

          {/* Droits RGPD */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-[#fcf9f0] mb-6">
              Vos droits (RGPD)
            </h2>
            <div className="space-y-5 text-base text-[#fcf9f0]/70 leading-[1.85]">
              <p>
                Conformément au Règlement Général sur la Protection des Données (RGPD — Règlement UE 2016/679) et à la loi Informatique et Libertés, vous disposez des droits suivants :
              </p>
              <ul className="space-y-2 pl-4">
                {[
                  'Droit d\'accès à vos données personnelles',
                  'Droit de rectification des données inexactes',
                  'Droit à l\'effacement (« droit à l\'oubli »)',
                  'Droit à la limitation du traitement',
                  'Droit d\'opposition au traitement',
                  'Droit à la portabilité de vos données',
                  'Droit de retirer votre consentement à tout moment',
                ].map((droit) => (
                  <li key={droit} className="flex items-start gap-2">
                    <span className="text-[#c9a84c] mt-1 shrink-0">—</span>
                    <span>{droit}</span>
                  </li>
                ))}
              </ul>
              <p>
                Pour exercer vos droits, contactez-nous à{' '}
                <a href="mailto:contact@ialucide.fr" className="text-[#c9a84c] hover:underline">
                  contact@ialucide.fr
                </a>.
                Vous disposez également du droit d&apos;introduire une réclamation auprès de la{' '}
                <strong className="text-[#fcf9f0]">CNIL</strong> (cnil.fr).
              </p>
            </div>
          </section>

          <div className="h-px bg-[#c9a84c]/15" />

          {/* Responsable */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-[#fcf9f0] mb-6">
              Responsable du traitement
            </h2>
            <div className="space-y-3 text-base text-[#fcf9f0]/70 leading-[1.85]">
              <p><strong className="text-[#fcf9f0]">DIGICORPEX</strong></p>
              <p>
                Contact :{' '}
                <a href="mailto:contact@ialucide.fr" className="text-[#c9a84c] hover:underline">
                  contact@ialucide.fr
                </a>
              </p>
            </div>
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

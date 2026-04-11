import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Métiers & IA : 15 Professions Analysées | IA Lucide',
  description:
    "Découvrez comment l'IA transforme 15 professions : comptable, juriste, médecin, développeur... Analyses par métier avec niveaux d'exposition et plans d'action.",
  alternates: {
    canonical: 'https://ialucide.fr/metiers/',
  },
};

export default function MetiersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from 'next';
import DiagnosticForm from '@/components/DiagnosticForm';

export const metadata: Metadata = {
  title: 'Diagnostic exposition IA — IA Lucide',
  description:
    "Évaluez en 8 questions votre exposition réelle à l'automatisation par l'IA, selon votre poste, votre secteur et la nature de votre travail.",
  alternates: {
    canonical: 'https://ialucide.fr/diagnostic-exposition-ia/',
  },
  openGraph: {
    description:
      "Évaluez en 8 questions votre exposition réelle à l'automatisation par l'IA, selon votre poste, votre secteur et la nature de votre travail.",
  },
  twitter: {
    description:
      "Évaluez en 8 questions votre exposition réelle à l'automatisation par l'IA, selon votre poste, votre secteur et la nature de votre travail.",
  },
};

export default function DiagnosticExpositionIAPage() {
  return <DiagnosticForm />;
}

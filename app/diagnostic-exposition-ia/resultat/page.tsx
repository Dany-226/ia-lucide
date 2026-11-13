import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { Suspense } from 'react';
import DiagnosticResultat from '@/components/DiagnosticResultat';

export const metadata: Metadata = pageMetadata({
  title: 'Vos résultats - Diagnostic exposition IA',
  description:
    "Résultat de votre diagnostic d'exposition à l'automatisation par l'IA, selon votre poste, votre secteur et la nature de votre travail.",
  path: '/diagnostic-exposition-ia/resultat/',
  robots: { index: false, follow: false },
});

export default function DiagnosticResultatPage() {
  return (
    <Suspense fallback={null}>
      <DiagnosticResultat />
    </Suspense>
  );
}

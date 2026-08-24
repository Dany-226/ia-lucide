import type { Metadata } from 'next';
import { Suspense } from 'react';
import DiagnosticResultat from '@/components/DiagnosticResultat';

export const metadata: Metadata = {
  title: 'Vos résultats — Diagnostic exposition IA — IA Lucide',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DiagnosticResultatPage() {
  return (
    <Suspense fallback={null}>
      <DiagnosticResultat />
    </Suspense>
  );
}

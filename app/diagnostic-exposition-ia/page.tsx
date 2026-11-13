import type { Metadata } from 'next';
import { jsonLdHtml, pageMetadata, webPageJsonLd } from '@/lib/seo';
import DiagnosticForm from '@/components/DiagnosticForm';

const PAGE_DESCRIPTION =
  "Évaluez en 8 questions votre exposition réelle à l'automatisation par l'IA, selon votre poste, votre secteur et la nature de votre travail.";

export const metadata: Metadata = pageMetadata({
  title: "Diagnostic exposition IA",
  description: PAGE_DESCRIPTION,
  path: "/diagnostic-exposition-ia/",
});

export default function DiagnosticExpositionIAPage() {
  const jsonLd = webPageJsonLd({
    name: 'Diagnostic exposition IA',
    description: PAGE_DESCRIPTION,
    path: '/diagnostic-exposition-ia/',
  });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(jsonLd) }} />
      <DiagnosticForm />
    </>
  );
}

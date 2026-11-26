import type { MetadataRoute } from 'next';
import { getAllArticles } from '@/lib/articles';
import { METIERS_HUB_UPDATED } from '@/lib/seo';
import { getDomaines } from '@/lib/diagnostic-data';

export const dynamic = 'force-static';

const BASE_URL = 'https://ialucide.fr';

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/metiers/`,
      lastModified: new Date(METIERS_HUB_UPDATED),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/outils/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/comprendre/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/education-ia/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/diagnostic-exposition-ia/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/newsletter/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/ressources/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/contact/`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/mentions-legales/`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/politique-confidentialite/`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Diagnostic v2 : méthodologie et pages de domaine (domaines avec au moins un poste
  // visible). En noindex hors production (lib/diagnostic-data.ts, DIAGNOSTIC_ROBOTS).
  const domaines = getDomaines();
  const majDomaine = (postes: { maj: string }[]) => new Date(postes.map((p) => p.maj).sort().at(-1) || Date.now());
  const diagnosticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/methodologie-exposition-ia/`,
      lastModified: majDomaine(domaines.flatMap((d) => d.postes)),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...domaines.map((d) => ({
      url: `${BASE_URL}/metiers/${d.slug}/`,
      lastModified: majDomaine(d.postes),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${BASE_URL}/article/${article.slug}/`,
    lastModified: new Date(article.updated || article.date || Date.now()),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...diagnosticRoutes, ...articleRoutes];
}

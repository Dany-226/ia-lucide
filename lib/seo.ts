import type { Metadata } from 'next';

// Métadonnées et données structurées communes à toutes les pages.
// Next fusionne `openGraph` et `twitter` page par page de façon superficielle : un objet
// openGraph déclaré par une page remplace entièrement celui du layout (site_name, locale,
// type disparaissaient). Chaque page passe donc par pageMetadata(), qui renvoie les blocs
// complets.

export const SITE_URL = 'https://ialucide.fr';
export const SITE_NAME = 'ialucide';
export const SITE_TAGLINE = "L'IA sans illusions, métier par métier";
export const SITE_DESCRIPTION =
  "Analyses claires et sans illusions sur l'impact de l'intelligence artificielle sur les métiers et le travail. Ni catastrophisme, ni évangélisme.";
export const SITE_EMAIL = 'contact@ialucide.fr';
// Logo 1408x768 : sert aussi d'image Open Graph par défaut (ratio proche de 1,91:1).
export const SITE_LOGO = { url: `${SITE_URL}/logo-black.png`, width: 1408, height: 768 };
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
// Comptes de la marque (validé le 13/11/2026 : Instagram seul, pas de page LinkedIn entreprise).
export const ORGANIZATION_SAME_AS = ['https://www.instagram.com/ialucide/'];

/** Chemin relatif (« /x/ ») ou URL absolue → URL absolue. */
export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}

type PageMetadataInput = {
  /** Title sans la marque : le template du layout ajoute « | ialucide ». */
  title?: string;
  /** Title complet, utilisé tel quel (pas de template). */
  absoluteTitle?: string;
  description: string;
  /** Chemin canonique avec slash final, ex. « /contact/ ». */
  path: string;
  /** Titre Open Graph s'il diffère du <title>. */
  ogTitle?: string;
  /** Image relative ou absolue ; logo par défaut. */
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  robots?: Metadata['robots'];
};

export function pageMetadata(input: PageMetadataInput): Metadata {
  const fullTitle = input.absoluteTitle ?? `${input.title} | ${SITE_NAME}`;
  const url = absoluteUrl(input.path);
  const image = input.image
    ? { url: absoluteUrl(input.image) }
    : { url: SITE_LOGO.url, width: SITE_LOGO.width, height: SITE_LOGO.height };
  const ogTitle = input.ogTitle ?? fullTitle;

  return {
    // absolute partout : le titre complet est calculé ici, et Next applique sinon le
    // template du layout aussi à og:title.
    title: { absolute: fullTitle },
    description: input.description,
    alternates: { canonical: url },
    openGraph: {
      title: { absolute: ogTitle },
      description: input.description,
      url,
      siteName: SITE_NAME,
      locale: 'fr_FR',
      images: [image],
      ...(input.type === 'article'
        ? {
            type: 'article' as const,
            publishedTime: input.publishedTime,
            modifiedTime: input.modifiedTime,
          }
        : { type: 'website' as const }),
    },
    twitter: {
      card: 'summary_large_image',
      title: { absolute: ogTitle },
      description: input.description,
      images: [image.url],
    },
    ...(input.robots ? { robots: input.robots } : {}),
  };
}

/** JSON-LD Organization, émis une fois dans le layout racine. */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: {
      '@type': 'ImageObject',
      url: SITE_LOGO.url,
      width: SITE_LOGO.width,
      height: SITE_LOGO.height,
    },
    description: SITE_DESCRIPTION,
    email: SITE_EMAIL,
    sameAs: ORGANIZATION_SAME_AS,
  };
}

type ListEntry = { name: string; url: string };

/** JSON-LD CollectionPage + ItemList pour une page hub. */
export function collectionPageJsonLd(input: {
  name: string;
  description: string;
  path: string;
  items: ListEntry[];
}) {
  const url = absoluteUrl(input.path);
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': url,
    url,
    name: input.name,
    description: input.description,
    inLanguage: 'fr-FR',
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: `${SITE_URL}/` },
    publisher: { '@id': ORGANIZATION_ID },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: input.items.length,
      itemListElement: input.items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        url: absoluteUrl(item.url),
      })),
    },
  };
}

/** JSON-LD WebPage simple. */
export function webPageJsonLd(input: { name: string; description: string; path: string }) {
  const url = absoluteUrl(input.path);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': url,
    url,
    name: input.name,
    description: input.description,
    inLanguage: 'fr-FR',
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: `${SITE_URL}/` },
    publisher: { '@id': ORGANIZATION_ID },
  };
}

/** Balise <script type="application/ld+json"> sérialisée (échappe « < »). */
export function jsonLdHtml(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

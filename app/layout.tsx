import type { Metadata } from 'next';
import Script from 'next/script';
import localFont from 'next/font/local';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnalyticsConsent from '@/components/AnalyticsConsent';
import { SITE_DESCRIPTION, SITE_LOGO, SITE_NAME, jsonLdHtml, organizationJsonLd } from '@/lib/seo';

// Polices auto-hébergées (app/fonts/, licence OFL à côté de chaque famille) : jamais
// next/font/google, dont le téléchargement pendant le build faisait échouer Cloudflare Pages
// par intermittence (26/11/2026). Sous-ensemble latin, plus les glyphes du site que ces polices
// contiennent (Ł ł ń ← → ≈ ≤ ≥, μ pour Playfair). Variables CSS inchangées (--nf-*).
const playfair = localFont({
  src: [
    { path: './fonts/PlayfairDisplay-latin-wght.woff2', weight: '700 900', style: 'normal' },
    { path: './fonts/PlayfairDisplay-Italic-latin-wght.woff2', weight: '700 900', style: 'italic' },
  ],
  variable: '--nf-playfair',
  display: 'swap',
  adjustFontFallback: 'Times New Roman',
});

const spaceGrotesk = localFont({
  src: './fonts/SpaceGrotesk-latin-wght.woff2',
  weight: '400 700',
  style: 'normal',
  variable: '--nf-sans',
  display: 'swap',
});

const dmMono = localFont({
  src: [
    { path: './fonts/DMMono-Light-latin.woff2', weight: '300', style: 'normal' },
    { path: './fonts/DMMono-Regular-latin.woff2', weight: '400', style: 'normal' },
    { path: './fonts/DMMono-Medium-latin.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--nf-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  // URL de base des métadonnées : sans elle, Next complète les images relatives
  // (og:image, twitter:image) avec http://localhost:3000 au build.
  metadataBase: new URL('https://ialucide.fr'),
  title: {
    default: "ialucide | L'IA sans illusions, métier par métier",
    template: '%s | ialucide',
  },
  description:
    "Analyses claires et sans illusions sur l'impact de l'intelligence artificielle sur les métiers et le travail. Ni catastrophisme, ni évangélisme.",
  openGraph: {
    title: "ialucide | L'IA sans illusions, métier par métier",
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    locale: 'fr_FR',
    type: 'website',
    images: [SITE_LOGO],
  },
  twitter: {
    card: 'summary_large_image',
    images: [SITE_LOGO.url],
  },
  other: {
    'impact-site-verification': '679f10f1-0511-476f-979a-b265417ca7b6',
    linkavista: '2c6575b0c306bafa92df0f7d26e4d9f9f5e67384',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${playfair.variable} ${spaceGrotesk.variable} ${dmMono.variable} font-sans`}
    >
      <body className="min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdHtml(organizationJsonLd()) }}
        />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <AnalyticsConsent />
        <Script
          async
          src="https://news.google.com/swg/js/v1/publisher.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}

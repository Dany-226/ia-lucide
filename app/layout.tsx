import type { Metadata } from 'next';
import { Playfair_Display, Source_Serif_4, DM_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--nf-playfair',
  display: 'swap',
  weight: ['400', '700', '900'],
  style: ['normal', 'italic'],
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--nf-source',
  display: 'swap',
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--nf-mono',
  display: 'swap',
  weight: ['300', '400', '500'],
});

export const metadata: Metadata = {
  title: "IA Lucide — Le regard lucide sur l'IA qui transforme les métiers",
  description:
    "Analyses claires et sans illusions sur l'impact de l'intelligence artificielle sur les métiers et le travail. Ni catastrophisme, ni évangélisme.",
  openGraph: {
    title: "IA Lucide — Le regard lucide sur l'IA",
    description:
      "Analyses par métier sur l'impact réel de l'intelligence artificielle.",
    siteName: 'IA Lucide',
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
      className={`${playfair.variable} ${sourceSerif.variable} ${dmMono.variable} font-source`}
    >
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

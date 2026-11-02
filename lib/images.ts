import fs from 'fs';
import path from 'path';

/**
 * URL d'une version allégée (≈ 640 px de large) d'une image de couverture, pour
 * les cartes d'articles affichées autour de 370 px. Retombe sur l'URL d'origine
 * quand aucune version allégée n'existe.
 * - Imgur : variante « l » (640 px) générée par Imgur à la place de « h » (1024 px).
 * - Unsplash : paramètre w=640.
 * - Images locales : fichier « nom-640.webp » créé par `npm run thumbnails`.
 */
export function thumbnailUrl(url?: string): string | undefined {
  if (!url) return url;
  const imgur = url.match(/^(https:\/\/i\.imgur\.com\/[A-Za-z0-9]{7})h\.jpg$/);
  if (imgur) return `${imgur[1]}l.jpg`;
  if (url.startsWith('https://images.unsplash.com/')) return url.replace(/([?&])w=\d+/, '$1w=640');
  const local = url.replace(/^https:\/\/ialucide\.fr/, '');
  if (local.startsWith('/') && /\.(png|jpe?g|webp)$/i.test(local)) {
    const thumb = local.replace(/\.(png|jpe?g|webp)$/i, '-640.webp');
    if (fs.existsSync(path.join(process.cwd(), 'public', thumb))) return thumb;
  }
  return url;
}

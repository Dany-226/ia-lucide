// Génère une vignette WebP de 640 px de large (« nom-640.webp ») pour chaque image
// locale utilisée comme image_url d'article. Les cartes d'articles l'utilisent
// automatiquement si elle existe (voir lib/images.ts). À lancer après l'ajout
// d'une nouvelle image de couverture locale : `npm run thumbnails`.
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import sharp from 'sharp';

const WIDTH = 640;
const root = process.cwd();
const contentDir = path.join(root, 'content');
let made = 0;

for (const file of fs.readdirSync(contentDir).filter((f) => f.endsWith('.mdx'))) {
  const { data } = matter(fs.readFileSync(path.join(contentDir, file), 'utf8'));
  const url = data.image_url || '';
  const local = url.replace(/^https:\/\/ialucide\.fr/, '');
  if (!local.startsWith('/') || !/\.(png|jpe?g|webp)$/i.test(local)) continue;
  const src = path.join(root, 'public', local);
  const dst = src.replace(/\.(png|jpe?g|webp)$/i, `-${WIDTH}.webp`);
  if (!fs.existsSync(src) || fs.existsSync(dst)) continue;
  await sharp(src).resize({ width: WIDTH, withoutEnlargement: true }).webp({ quality: 75 }).toFile(dst);
  made++;
  console.log('vignette', path.relative(root, dst));
}
console.log(`${made} vignette(s) créée(s)`);

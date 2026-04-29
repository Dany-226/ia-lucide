const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generate() {
  const carouselsDir = path.join(__dirname, 'carousels');
  const carousels = fs.readdirSync(carouselsDir);

  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });

  for (const carousel of carousels) {
    const contentPath = path.join(carouselsDir, carousel, 'content.json');
    if (!fs.existsSync(contentPath)) continue;

    const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
    const outputDir = path.join(carouselsDir, carousel, 'output');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    const template = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');

    for (let i = 0; i < content.slides.length; i++) {
      const slide = content.slides[i];
      const html = template.replace('SLIDE_DATA_PLACEHOLDER', JSON.stringify(slide));
      const tmpPath = path.join(__dirname, '_tmp_slide.html');
      fs.writeFileSync(tmpPath, html);

      const page = await browser.newPage();
      await page.setViewport({ width: 1080, height: 1080 });
      await page.goto('file://' + tmpPath);
      await page.waitForTimeout(500);

      const filename = `slide-${String(i + 1).padStart(2, '0')}.png`;
      await page.screenshot({ path: path.join(outputDir, filename) });
      await page.close();
      console.log(`✓ ${carousel} — ${filename}`);
    }
  }

  await browser.close();
  if (fs.existsSync(path.join(__dirname, '_tmp_slide.html'))) {
    fs.unlinkSync(path.join(__dirname, '_tmp_slide.html'));
  }
  console.log('\nDone. PNGs dans instagram/carousels/*/output/');
}

generate().catch(console.error);

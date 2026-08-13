#!/usr/bin/env node
'use strict';

const https = require('https');
const { getAllArticles } = require('../lib/articles.ts');

const HOST = 'ialucide.fr';
const KEY = 'd775bf377fb14f6083ea031bfe791cc9';
const KEY_LOCATION = `https://ialucide.fr/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

function parseUrlsArg(argv) {
  const arg = argv.find((a) => a.startsWith('--urls='));
  if (!arg) return null;
  return arg
    .slice('--urls='.length)
    .split(',')
    .map((u) => u.trim())
    .filter(Boolean);
}

function getAllArticleUrls() {
  return getAllArticles().map((a) => `https://ialucide.fr/article/${a.slug}/`);
}

function submit(urlList) {
  const payload = JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  });

  return new Promise((resolve, reject) => {
    const req = https.request(
      ENDPOINT,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Length': Buffer.byteLength(payload),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => resolve({ statusCode: res.statusCode, body }));
      }
    );
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function main() {
  const specificUrls = parseUrlsArg(process.argv.slice(2));
  const urlList = specificUrls ?? getAllArticleUrls();

  if (urlList.length === 0) {
    console.error('Aucune URL à soumettre.');
    process.exitCode = 1;
    return;
  }

  console.log(`Soumission de ${urlList.length} URL(s) à IndexNow :`);
  urlList.forEach((u) => console.log(`  - ${u}`));

  const { statusCode, body } = await submit(urlList);

  if (statusCode >= 200 && statusCode < 300) {
    console.log(`OK (${statusCode})`);
  } else {
    console.error(`Échec (${statusCode})${body ? `: ${body}` : ''}`);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error('Erreur IndexNow :', err);
  process.exitCode = 1;
});

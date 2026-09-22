#!/usr/bin/env node
/**
 * Troca APENAS o bloco do hero (entre <!-- HERO:START --> e <!-- HERO:END -->)
 * por uma imagem aleatória de images/heroes.json.
 *
 * O resto do README.md nunca é tocado.
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const README_PATH = path.join(ROOT, 'README.md');
const HEROES_PATH = path.join(ROOT, 'images', 'heroes.json');

const START = '<!-- HERO:START -->';
const END = '<!-- HERO:END -->';

const die = (msg) => {
  console.error(`\x1b[31m✖\x1b[0m ${msg}`);
  process.exit(1);
};

// 1. carrega o catálogo de imagens
let images;
try {
  ({ images } = JSON.parse(fs.readFileSync(HEROES_PATH, 'utf-8')));
} catch (err) {
  die(`não consegui ler ${path.relative(ROOT, HEROES_PATH)}: ${err.message}`);
}

if (!Array.isArray(images) || images.length === 0) {
  die('heroes.json não tem nenhuma imagem na lista "images".');
}

// 2. localiza o bloco do hero dentro do README
const readme = fs.readFileSync(README_PATH, 'utf-8');
const startIdx = readme.indexOf(START);
const endIdx = readme.indexOf(END);

if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
  die(`marcadores "${START}" / "${END}" não encontrados no README.md.`);
}

// 3. sorteia uma imagem diferente da que já está lá
const currentBlock = readme.slice(startIdx + START.length, endIdx);
const currentUrl = (currentBlock.match(/src="([^"]+)"/) || [])[1];

const pool = images.filter((img) => img && img.url && img.url !== currentUrl);
const candidates = pool.length > 0 ? pool : images;
const hero = candidates[Math.floor(Math.random() * candidates.length)];

// 4. reescreve só o bloco
const block = [
  START,
  '<div align="center">',
  `  <img src="${hero.url}" alt="${hero.name}" width="100%" />`,
  '</div>',
  END,
].join('\n');

const updated = readme.slice(0, startIdx) + block + readme.slice(endIdx + END.length);

if (updated === readme) {
  console.log('\x1b[33m…\x1b[0m nada mudou, README já está com essa imagem.');
  process.exit(0);
}

fs.writeFileSync(README_PATH, updated);
console.log(`\x1b[32m✔\x1b[0m hero atualizado: ${hero.name}`);
console.log(`  ${hero.url}`);

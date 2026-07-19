#!/usr/bin/env node
/*
 * validate-release.js - release hygiene checks for PsychoPharmRef.
 *
 * This script protects the current Hugo/static deployment shape while the
 * project moves toward a cleaner source-of-truth architecture.
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const errors = [];
const warnings = [];
const passes = [];

const VOID_TAGS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

function abs(relPath) {
  return path.join(ROOT, relPath);
}

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function rel(filePath) {
  return toPosix(path.relative(ROOT, filePath));
}

function exists(relPath) {
  return fs.existsSync(abs(relPath));
}

function read(relPath) {
  return fs.readFileSync(abs(relPath), 'utf8');
}

function sha256(relPath) {
  return crypto.createHash('sha256').update(fs.readFileSync(abs(relPath))).digest('hex');
}

function walk(dirRel, predicate) {
  const dirAbs = abs(dirRel);
  if (!fs.existsSync(dirAbs)) return [];

  const out = [];
  const stack = [dirAbs];

  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const entryPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(entryPath);
      } else if (!predicate || predicate(entryPath)) {
        out.push(rel(entryPath));
      }
    }
  }

  return out.sort();
}

function mirrorTargetFor(sourceRel) {
  return `hugo-site/static/${sourceRel}`;
}

function addMirrorPair(pairs, sourceRel, targetRel) {
  pairs.set(`${sourceRel} -> ${targetRel}`, { sourceRel, targetRel });
}

function buildMirrorPairs() {
  const pairs = new Map();

  addMirrorPair(pairs, 'index.html', 'hugo-site/static/index.html');
  addMirrorPair(pairs, 'css/styles.css', 'hugo-site/static/css/styles.css');
  addMirrorPair(pairs, 'blog/blog.css', 'hugo-site/static/css/blog.css');
  addMirrorPair(pairs, 'blog/slides.css', 'hugo-site/static/css/slides.css');
  addMirrorPair(pairs, 'blog/slides.js', 'hugo-site/static/js/slides.js');
  addMirrorPair(pairs, 'data/drug-skus.json', 'hugo-site/static/data/drug-skus.json');
  addMirrorPair(pairs, 'data/prices.json', 'hugo-site/static/data/prices.json');

  for (const sourceRel of walk('data/clinical', file => file.endsWith('.json'))) {
    addMirrorPair(pairs, sourceRel, mirrorTargetFor(sourceRel));
  }

  for (const sourceRel of walk('js', file => file.endsWith('.js'))) {
    addMirrorPair(pairs, sourceRel, mirrorTargetFor(sourceRel));
  }

  for (const sourceRel of walk('css/tools', file => file.endsWith('.css'))) {
    addMirrorPair(pairs, sourceRel, mirrorTargetFor(sourceRel));
  }

  return [...pairs.values()].sort((a, b) => a.sourceRel.localeCompare(b.sourceRel));
}

function checkMirrorPairs() {
  const pairs = buildMirrorPairs();
  let checked = 0;

  for (const { sourceRel, targetRel } of pairs) {
    if (!exists(sourceRel)) {
      errors.push(`Mirror source missing: ${sourceRel}`);
      continue;
    }
    if (!exists(targetRel)) {
      errors.push(`Mirror target missing: ${sourceRel} -> ${targetRel}`);
      continue;
    }
    checked += 1;
    if (sha256(sourceRel) !== sha256(targetRel)) {
      errors.push(`Mirror drift: ${sourceRel} differs from ${targetRel}`);
    }
  }

  passes.push(`Checked ${checked} mirrored deploy asset pairs`);
}

function extractLocalVersionedAssets(indexRel) {
  const html = read(indexRel);
  const assetRe = /\b(?:src|href)=["']([^"']+\.(?:js|css)(?:\?[^"']*)?)["']/g;
  const assets = [];
  let match;

  while ((match = assetRe.exec(html))) {
    const raw = match[1];
    if (/^(https?:)?\/\//.test(raw) || raw.startsWith('data:')) continue;

    const [assetPath, query = ''] = raw.split('?');
    if (!assetPath.startsWith('js/') && !assetPath.startsWith('css/')) continue;

    const params = new URLSearchParams(query);
    assets.push({
      raw,
      assetPath,
      version: params.get('v'),
    });
  }

  return assets;
}

function checkCacheBusts() {
  const rootAssets = extractLocalVersionedAssets('index.html');
  const staticAssets = extractLocalVersionedAssets('hugo-site/static/index.html');

  for (const asset of rootAssets) {
    if (!asset.version) {
      errors.push(`Missing cache-bust query in index.html for ${asset.raw}`);
    }
    if (!exists(asset.assetPath)) {
      errors.push(`index.html references missing source asset: ${asset.assetPath}`);
    }
    const staticRel = mirrorTargetFor(asset.assetPath);
    if (!exists(staticRel)) {
      errors.push(`index.html references asset missing from Hugo static: ${staticRel}`);
    }
  }

  const rootRaw = rootAssets.map(asset => asset.raw).sort();
  const staticRaw = staticAssets.map(asset => asset.raw).sort();
  if (JSON.stringify(rootRaw) !== JSON.stringify(staticRaw)) {
    errors.push('Versioned JS/CSS references differ between index.html and hugo-site/static/index.html');
  }

  passes.push(`Checked ${rootAssets.length} versioned JS/CSS references in index.html`);
}

function extractLazyToolIds() {
  const html = read('index.html');
  const sectionRe = /<section\b[^>]*\bdata-lazy-tool=["']([^"']+)["'][^>]*>/g;
  const ids = new Set();
  let match;

  while ((match = sectionRe.exec(html))) {
    ids.add(match[1]);
  }

  return [...ids].sort();
}

function checkLazyToolAssets() {
  const lazyToolIds = extractLazyToolIds();

  for (const toolId of lazyToolIds) {
    for (const assetRel of [`css/tools/${toolId}.css`, `js/tools/${toolId}.js`]) {
      if (!exists(assetRel)) {
        errors.push(`Lazy tool "${toolId}" is missing source asset: ${assetRel}`);
      }
      const staticRel = mirrorTargetFor(assetRel);
      if (!exists(staticRel)) {
        errors.push(`Lazy tool "${toolId}" is missing Hugo static asset: ${staticRel}`);
      }
    }
  }

  passes.push(`Checked source/static assets for ${lazyToolIds.length} lazy tools`);
}

function stripRawTextBlocks(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '');
}

function checkHtmlBalance(fileRel) {
  const html = stripRawTextBlocks(read(fileRel));
  const tagRe = /<\/?\s*([a-zA-Z][a-zA-Z0-9:-]*)\b[^<>]*>/g;
  const stack = [];
  let match;

  while ((match = tagRe.exec(html))) {
    const full = match[0];
    const tag = match[1].toLowerCase();

    if (full.startsWith('</')) {
      const last = stack.pop();
      if (last !== tag) {
        errors.push(`HTML tag mismatch in ${fileRel}: expected </${last || 'none'}> before ${full}`);
        return;
      }
      continue;
    }

    if (VOID_TAGS.has(tag) || /\/\s*>$/.test(full)) continue;
    stack.push(tag);
  }

  if (stack.length) {
    errors.push(`HTML tag imbalance in ${fileRel}: unclosed <${stack[stack.length - 1]}>`);
  } else {
    passes.push(`Checked HTML tag balance for ${fileRel}`);
  }
}

function checkLoaderVersionLiterals() {
  const app = read('js/app.js');
  const requiredPatterns = [
    [/css\/tools\/'\s*\+\s*toolId\s*\+\s*'\.css\?v=[0-9]{8}[a-z]/, 'lazy CSS loader version'],
    [/js\/tools\/'\s*\+\s*toolId\s*\+\s*'\.js\?v=[0-9]{8}[a-z]/, 'lazy JS loader version'],
    [/js\/tools\/tool-utils\.js\?v=[0-9]{8}[a-z]/, 'tool-utils loader version'],
  ];

  for (const [pattern, label] of requiredPatterns) {
    if (!pattern.test(app)) {
      warnings.push(`Could not find ${label} in js/app.js`);
    }
  }

  passes.push('Checked lazy-loader cache-bust literals in js/app.js');
}

function listBlogArticleFiles(dirRel) {
  return walk(dirRel, file => file.endsWith('.html'))
    .map(file => path.basename(file))
    .filter(name => name !== 'sidebar.html')
    .sort();
}

function compareFileLists(label, expected, actual) {
  const expectedSet = new Set(expected);
  const actualSet = new Set(actual);
  const missing = expected.filter(item => !actualSet.has(item));
  const extra = actual.filter(item => !expectedSet.has(item));

  if (missing.length) {
    errors.push(`${label} missing ${missing.length} file(s): ${missing.join(', ')}`);
  }
  if (extra.length) {
    errors.push(`${label} has ${extra.length} extra file(s): ${extra.join(', ')}`);
  }
}

function checkBlogIndex() {
  const legacyFiles = listBlogArticleFiles('blog');
  const hugoFiles = listBlogArticleFiles('hugo-site/content/blog');
  const expectedCount = legacyFiles.length;

  compareFileLists('Hugo blog content', legacyFiles, hugoFiles);

  let entries;
  try {
    entries = JSON.parse(read('js/blog-index.json'));
  } catch (error) {
    errors.push(`Could not parse js/blog-index.json: ${error.message}`);
    return;
  }

  if (!Array.isArray(entries)) {
    errors.push('js/blog-index.json must be a JSON array');
    return;
  }

  const indexFiles = entries.map(entry => entry && entry.file).filter(Boolean).sort();
  const duplicateFiles = indexFiles.filter((file, idx) => idx > 0 && file === indexFiles[idx - 1]);
  if (duplicateFiles.length) {
    errors.push(`js/blog-index.json has duplicate file entries: ${[...new Set(duplicateFiles)].join(', ')}`);
  }

  compareFileLists('js/blog-index.json', legacyFiles, [...new Set(indexFiles)].sort());

  for (const htmlRel of ['index.html', 'hugo-site/static/index.html']) {
    const html = read(htmlRel);
    const countMatches = [...html.matchAll(/All Posts \((\d+) articles\)|(\d+) evidence-based clinical articles|Browse All (\d+) Articles/g)];
    if (!countMatches.length) {
      errors.push(`Could not find displayed blog article counts in ${htmlRel}`);
      continue;
    }

    for (const match of countMatches) {
      const count = Number(match[1] || match[2] || match[3]);
      if (count !== expectedCount) {
        errors.push(`${htmlRel} displays ${count} blog articles, but blog/ contains ${expectedCount}`);
      }
    }
  }

  passes.push(`Checked blog index coverage and displayed count for ${expectedCount} articles`);
}

function main() {
  console.log('PsychoPharmRef release validation');
  console.log('==================================\n');

  checkMirrorPairs();
  checkCacheBusts();
  checkLazyToolAssets();
  checkHtmlBalance('index.html');
  checkHtmlBalance('hugo-site/static/index.html');
  checkLoaderVersionLiterals();
  checkBlogIndex();

  for (const pass of passes) {
    console.log(`PASS: ${pass}`);
  }

  if (warnings.length) {
    console.log('\nWarnings');
    for (const warning of warnings) {
      console.log(`WARN: ${warning}`);
    }
  }

  if (errors.length) {
    console.log('\nErrors');
    for (const error of errors) {
      console.log(`ERROR: ${error}`);
    }
    console.log(`\nRESULT: failed with ${errors.length} error(s).`);
    process.exit(1);
  }

  console.log('\nRESULT: release hygiene checks passed.');
}

main();

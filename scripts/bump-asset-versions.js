#!/usr/bin/env node
/*
 * bump-asset-versions.js
 *
 * Bumps local JS/CSS cache-bust query strings in the SPA entry files and
 * mirrors the updated deploy assets into hugo-site/static/.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SOURCE_FILES = ['index.html', 'js/app.js'];
const MIRRORS = [
  ['index.html', 'hugo-site/static/index.html'],
  ['js/app.js', 'hugo-site/static/js/app.js'],
];
const VERSION_RE = /\?v=(\d{8})([a-z]?)/g;

function abs(relPath) {
  return path.join(ROOT, relPath);
}

function todayStamp() {
  if (process.env.ASSET_VERSION_DATE) {
    const override = process.env.ASSET_VERSION_DATE;
    if (!/^\d{8}$/.test(override)) {
      throw new Error('ASSET_VERSION_DATE must use YYYYMMDD format');
    }
    return override;
  }

  const now = new Date();
  const yyyy = String(now.getFullYear());
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
}

function nextVersion(files, stamp) {
  let maxCode = 96; // one before "a"

  for (const relPath of files) {
    const text = fs.readFileSync(abs(relPath), 'utf8');
    for (const match of text.matchAll(VERSION_RE)) {
      if (match[1] !== stamp || !match[2]) continue;
      maxCode = Math.max(maxCode, match[2].charCodeAt(0));
    }
  }

  if (maxCode >= 122) {
    throw new Error(`No suffixes left for ${stamp}; update this script to support multi-letter suffixes.`);
  }

  return `${stamp}${String.fromCharCode(maxCode + 1)}`;
}

function bumpFile(relPath, version, dryRun) {
  const filePath = abs(relPath);
  const before = fs.readFileSync(filePath, 'utf8');
  let count = 0;
  const after = before.replace(VERSION_RE, () => {
    count += 1;
    return `?v=${version}`;
  });

  if (!count) {
    return { relPath, count: 0, changed: false };
  }

  if (!dryRun && after !== before) {
    fs.writeFileSync(filePath, after, 'utf8');
  }

  return { relPath, count, changed: after !== before };
}

function mirrorFiles(dryRun) {
  for (const [source, target] of MIRRORS) {
    if (dryRun) continue;
    fs.mkdirSync(path.dirname(abs(target)), { recursive: true });
    fs.copyFileSync(abs(source), abs(target));
  }
}

function main() {
  const args = new Set(process.argv.slice(2));
  const dryRun = args.has('--dry-run');
  for (const arg of args) {
    if (arg !== '--dry-run') {
      console.error('Usage: node scripts/bump-asset-versions.js [--dry-run]');
      return 2;
    }
  }

  const stamp = todayStamp();
  const version = nextVersion(SOURCE_FILES, stamp);
  const results = SOURCE_FILES.map(relPath => bumpFile(relPath, version, dryRun));
  mirrorFiles(dryRun);

  const mode = dryRun ? 'Would bump' : 'Bumped';
  console.log(`${mode} asset versions to ${version}`);
  for (const result of results) {
    console.log(`  ${result.relPath}: ${result.count} version reference(s)`);
  }
  if (!dryRun) {
    console.log('Mirrored index.html and js/app.js into hugo-site/static/.');
  }

  return 0;
}

process.exit(main());

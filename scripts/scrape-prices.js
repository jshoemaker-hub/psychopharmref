#!/usr/bin/env node
/*
 * scripts/scrape-prices.js
 *
 * Weekly price scraper for PsychoPharmRef.
 *
 * Sources:
 *   1. Cost Plus Drugs   (retail, transparent)        — JSON-LD on product page
 *   2. HealthWarehouse   (retail mail-order, VIPPS)   — custom JSON-LD with offers[] by quantity
 *   3. NADAC             (CMS wholesale anchor)       — weekly CSV from data.medicaid.gov
 *
 * No external dependencies — uses Node 18+ global `fetch`.
 *
 * Reads:  data/drug-skus.json
 * Writes: data/prices.json (and mirrors to hugo-site/static/data/prices.json)
 *
 * Run:    node scripts/scrape-prices.js
 *         node scripts/scrape-prices.js --only=Sertraline,Escitalopram   (debug subset)
 *         node scripts/scrape-prices.js --no-write                       (dry run, log only)
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const REPO_ROOT  = path.resolve(__dirname, '..');
const SKUS_PATH  = path.join(REPO_ROOT, 'data', 'drug-skus.json');
const OUT_PATH   = path.join(REPO_ROOT, 'data', 'prices.json');
const HUGO_OUT   = path.join(REPO_ROOT, 'hugo-site', 'static', 'data', 'prices.json');

const UA = 'Mozilla/5.0 (compatible; PsychoPharmRefBot/1.0; +https://psychopharm.netlify.app)';

const args = process.argv.slice(2);
const ONLY    = (args.find(a => a.startsWith('--only=')) || '').slice('--only='.length).split(',').filter(Boolean);
const DRY_RUN = args.includes('--no-write');

// ───────────────────────────────────────────────────────────── helpers ──

function logInfo(msg)  { console.log(`[info]  ${msg}`); }
function logWarn(msg)  { console.warn(`[warn]  ${msg}`); }
function logError(msg) { console.error(`[error] ${msg}`); }

async function fetchText(url, opts = {}) {
  const r = await fetch(url, {
    redirect: 'follow',
    ...opts,
    headers: { 'user-agent': UA, accept: 'text/html,application/xhtml+xml,application/xml,application/json,*/*', ...(opts.headers || {}) },
  });
  if (!r.ok) throw new Error(`HTTP ${r.status} ${r.statusText} :: ${url}`);
  return r.text();
}

async function fetchJson(url, opts = {}) {
  const t = await fetchText(url, { ...opts, headers: { accept: 'application/json', ...(opts.headers || {}) } });
  return JSON.parse(t);
}

// Tokenize an arbitrary string into lowercase alphanumeric chunks (digits stay attached)
function tokenize(s) {
  return (s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

// "0.5 mg" -> "0.5"; "100 mg" -> "100"; "45/105 mg" -> "45" (first numeric)
function strengthDigits(s) {
  const m = (s || '').match(/[\d.]+/);
  return m ? m[0] : '';
}

// Form keyword bucket: "ER tablet" -> { release: "er", form: "tablet" }
function formProfile(form) {
  const f = (form || '').toLowerCase();
  let release = null;
  if (/\b(er|xr|xl|sr|cr)\b/.test(f) || /extended\s*release/.test(f)) release = 'er';
  else if (/\bdr\b/.test(f) || /delayed\s*release/.test(f)) release = 'dr';
  else if (/\bsl\b/.test(f) || /sublingual/.test(f)) release = 'sl';
  let dose = 'unknown';
  if (/tablet/.test(f)) dose = 'tablet';
  else if (/capsule/.test(f)) dose = 'capsule';
  else if (/spray|nasal/.test(f)) dose = 'spray';
  else if (/syrup|solution|liquid|concentrate/.test(f)) dose = 'liquid';
  else if (/injection|iv\b|infusion/.test(f)) dose = 'injection';
  return { release, dose };
}

// ─────────────────────────────────────────────── Cost Plus Drugs source ──

let cpdSitemapCache = null;
async function loadCpdSitemap() {
  if (cpdSitemapCache) return cpdSitemapCache;
  logInfo('Fetching costplusdrugs.com/sitemap.xml…');
  const xml = await fetchText('https://www.costplusdrugs.com/sitemap.xml');
  const urls = [...xml.matchAll(/<loc>([^<]*\/medications\/[^<]+)<\/loc>/g)]
    .map(m => m[1])
    .filter(u => !u.includes('/categories/') && !u.endsWith('/medications/'));
  logInfo(`  → ${urls.length} CPD product URLs.`);
  cpdSitemapCache = urls;
  return urls;
}

function findCpdUrl(sitemap, drugName, sku) {
  const drugTokens   = tokenize(drugName);                 // ["sertraline"]
  const sd           = strengthDigits(sku.strength);       // "50"
  const profile      = formProfile(sku.form);              // { release: null, dose: 'tablet' }
  const wantsRelease = profile.release;                    // "er" | "dr" | "sl" | null

  // Skip uncommon dose forms — CPD doesn't typically carry sprays/injections
  if (profile.dose === 'spray' || profile.dose === 'injection') return null;

  const scored = sitemap.map(url => {
    const slug = url.split('/medications/')[1].replace(/\/+$/, '').toLowerCase();
    const slugTokens = tokenize(slug);
    let score = 0;

    // Drug name must match — every drug-name token present
    const allDrugTokensPresent = drugTokens.every(t => slug.includes(t));
    if (!allDrugTokensPresent) return null;
    score += 10;

    // Strength digits
    if (sd && new RegExp(`(^|[^0-9])${sd.replace('.', '\\.')}\\s*mg`).test(slug)) score += 6;
    else if (sd && slug.includes(sd)) score += 3;
    else if (sd) score -= 4;

    // Form match
    if (profile.dose !== 'unknown' && slug.includes(profile.dose)) score += 4;
    else if (profile.dose !== 'unknown') score -= 3;

    // Release type match
    const slugIsER = /(extended|er|xr|xl|sr|cr)/.test(slug);
    const slugIsDR = /(delayed|dr-)/.test(slug);
    const slugIsSL = /(sublingual|-sl-)/.test(slug);
    const slugRelease = slugIsER ? 'er' : slugIsDR ? 'dr' : slugIsSL ? 'sl' : null;
    if (wantsRelease && slugRelease === wantsRelease) score += 4;
    else if (wantsRelease && slugRelease !== wantsRelease) score -= 5;
    else if (!wantsRelease && slugRelease) score -= 3;

    // Penalty for non-standard form variants when we want plain tablet/capsule
    if (/(bottleof|solution|concentrate|powder|liquid|suspension|kit|patch|nasal-spray|injection|cream|gel|ointment|orallyDisintegrating|odt)/.test(slug)) score -= 6;

    // Slug noise penalty: prefer shorter slugs (more specific = closer match)
    score -= Math.max(0, slugTokens.length - 4) * 0.5;

    return { url, slug, score };
  }).filter(Boolean);

  if (!scored.length) return null;
  scored.sort((a, b) => b.score - a.score);
  const top = scored[0];
  // Threshold: need at least drug-name + strength + form (10+6+4 = 20) to be confident
  if (top.score < 17) return null;
  return top.url;
}

async function scrapeCpd(url) {
  const html = await fetchText(url);
  const ldMatch = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/);
  if (!ldMatch) throw new Error('No JSON-LD');
  const ld = JSON.parse(ldMatch[1]);
  const price = ld?.offers?.price;
  if (typeof price !== 'number' || !Number.isFinite(price)) throw new Error('No offers.price');
  return { available: true, price, url };
}

// ─────────────────────────────────────────────── HealthWarehouse source ──

let hwSitemapCache = null;
async function loadHwSitemap() {
  if (hwSitemapCache) return hwSitemapCache;
  logInfo('Fetching healthwarehouse.com/sitemap.xml…');
  const xml = await fetchText('https://www.healthwarehouse.com/sitemap.xml');
  // Accept any /<slug-with-dashes> URL on healthwarehouse.com that isn't an obvious non-product path
  const exclude = /(^|\/)(careers|company-media|contact-us|create-account|login|cart|checkout|category|categories|brand|brands|account|orders|wishlist|search|sitemap|privacy|terms|about|help|faq|blog|news)\b/i;
  const urls = [...xml.matchAll(/<loc>(https?:\/\/(?:www\.)?healthwarehouse\.com\/[^<]+)<\/loc>/g)]
    .map(m => m[1])
    .filter(u => /-/.test(u.split('/').pop() || ''))
    .filter(u => !exclude.test(u));
  logInfo(`  → ${urls.length} HealthWarehouse product URLs.`);
  hwSitemapCache = urls;
  return urls;
}

function findHwUrl(sitemap, drugName, sku) {
  const drugTokens = tokenize(drugName);
  const sd         = strengthDigits(sku.strength);
  const profile    = formProfile(sku.form);
  if (profile.dose === 'injection') return null;

  const scored = sitemap.map(url => {
    const slug = (url.split('healthwarehouse.com/')[1] || '').toLowerCase();
    const slugTokens = tokenize(slug);
    let score = 0;
    if (!drugTokens.every(t => slug.includes(t))) return null;
    score += 10;
    if (sd && new RegExp(`${sd.replace('.', '\\.')}\\s*mg`).test(slug)) score += 6;
    else if (sd && slug.includes(sd)) score += 3;
    else if (sd) score -= 4;

    if (profile.dose === 'tablet' && /tablet/.test(slug)) score += 4;
    else if (profile.dose === 'capsule' && /capsule/.test(slug)) score += 4;
    else if (profile.dose !== 'unknown') score -= 2;

    const wantsER = profile.release === 'er';
    const slugER  = /(extended|-er-|-xr-|-xl-|-sr-|-cr-)/.test(slug);
    if (wantsER && slugER) score += 4;
    else if (wantsER && !slugER) score -= 5;
    else if (!wantsER && slugER) score -= 3;

    // Penalize obvious non-matching forms
    if (/(solution|concentrate|powder|liquid|suspension|kit|cream|gel|ointment|odt|orally-disintegrating|patch|nasal|injection)/.test(slug)) score -= 6;

    // Prefer shorter slugs
    score -= Math.max(0, slugTokens.length - 5) * 0.4;
    return { url, slug, score };
  }).filter(Boolean);

  if (!scored.length) return null;
  scored.sort((a, b) => b.score - a.score);
  const top = scored[0];
  if (top.score < 17) return null;
  return top.url;
}

async function scrapeHw(url, sku) {
  const html = await fetchText(url);
  // HealthWarehouse uses 3 JSON-LD blocks; the product is the last one with no @type field but `productName` + `offers`
  const ldBlocks = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  let productLd = null;
  for (const raw of ldBlocks) {
    try {
      const j = JSON.parse(raw);
      if (j && (j.productName || j.offers)) { productLd = j; break; }
    } catch (_) { /* try next */ }
  }
  if (!productLd) throw new Error('No product JSON-LD');
  const offers = productLd.offers || [];
  if (!Array.isArray(offers) || !offers.length) throw new Error('No offers[]');

  // Pick the offer that matches sku.quantity (e.g. 30); fall back to closest available pack size
  const wantQty = sku.quantity;
  let bestOffer = null;
  let bestDelta = Infinity;
  for (const o of offers) {
    const qty = o?.eligibleQuantity?.value ?? o?.priceSpecification?.eligibleQuantity?.value;
    if (typeof qty !== 'number') continue;
    if (qty === 1) continue; // unit price, not pack price
    const delta = Math.abs(qty - wantQty);
    if (delta < bestDelta) { bestDelta = delta; bestOffer = { qty, price: o.price }; }
  }
  if (!bestOffer || typeof bestOffer.price !== 'number') throw new Error('No matching pack-size offer');
  return { available: true, price: bestOffer.price, packSize: bestOffer.qty, url };
}

// ─────────────────────────────────────────────────────── NADAC source ──

async function loadNadacCsv() {
  logInfo('Discovering current NADAC weekly dataset…');
  const search = await fetchJson('https://data.medicaid.gov/api/1/search?fulltext=nadac+national+average+drug+acquisition+cost&page-size=20');
  const items = Object.values(search.results || {});
  // Pick the dataset whose title starts "NADAC (National Average Drug Acquisition Cost)" with the most recent year, falling back on `modified`
  const candidates = items
    .filter(d => /^NADAC \(National Average Drug Acquisition Cost\)/i.test(d.title || ''))
    .sort((a, b) => (b.modified || '').localeCompare(a.modified || ''));
  if (!candidates.length) throw new Error('No NADAC dataset found in CMS metastore');
  const dataset = candidates[0];
  const downloadUrl = (dataset.distribution || []).map(d => d.downloadURL).find(u => /\.csv$/i.test(u || ''));
  if (!downloadUrl) throw new Error(`Dataset ${dataset.identifier} has no CSV distribution`);

  logInfo(`  → ${dataset.title} (modified ${dataset.modified})`);
  logInfo(`  → ${downloadUrl}`);
  const csv = await fetchText(downloadUrl);
  return { csv, datasetTitle: dataset.title, downloadUrl, modified: dataset.modified };
}

// Naive CSV parser sufficient for NADAC (no embedded newlines; commas inside quoted strings handled)
function parseCsv(text) {
  const rows = [];
  let row = [], cell = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i+1] === '"') { cell += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else cell += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { row.push(cell); cell = ''; }
      else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
      else if (c === '\r') { /* skip */ }
      else cell += c;
    }
  }
  if (cell.length || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

let nadacIndex = null; // { rows: [...], headers: {...}, meta: {...} }
async function loadNadacIndex() {
  if (nadacIndex) return nadacIndex;
  const { csv, datasetTitle, downloadUrl, modified } = await loadNadacCsv();
  const rows = parseCsv(csv);
  if (!rows.length) throw new Error('Empty NADAC CSV');
  const header = rows[0].map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
  const idx = (name) => header.indexOf(name);
  const cols = {
    desc:    idx('ndc_description'),
    ndc:     idx('ndc'),
    perUnit: idx('nadac_per_unit'),
    unit:    idx('pricing_unit'),
    type:    idx('pharmacy_type_indicator'),    // B(rand) or G(eneric)
    eff:     idx('effective_date'),
  };
  for (const [k, v] of Object.entries(cols)) {
    if (v < 0) throw new Error(`NADAC CSV missing column: ${k} (header was: ${header.join('|')})`);
  }
  const data = rows.slice(1)
    .filter(r => r[cols.desc])
    .map(r => ({
      desc:    r[cols.desc],
      ndc:     r[cols.ndc],
      perUnit: parseFloat(r[cols.perUnit]),
      unit:    r[cols.unit],
      type:    r[cols.type],
      eff:     r[cols.eff],
    }))
    .filter(r => Number.isFinite(r.perUnit) && r.perUnit > 0);
  logInfo(`  → ${data.length} NADAC rows parsed.`);
  nadacIndex = { data, datasetTitle, downloadUrl, modified };
  return nadacIndex;
}

function findNadacRows(index, drugName, sku) {
  const drugTokens = tokenize(drugName);
  const sd         = strengthDigits(sku.strength);
  const profile    = formProfile(sku.form);
  // Match on description: must contain all drug-name tokens, the strength digits, and a form keyword
  const formWord = profile.dose === 'tablet' ? 'TABLET'
    : profile.dose === 'capsule' ? 'CAPSULE'
    : profile.dose === 'spray' ? 'SPRAY'
    : profile.dose === 'liquid' ? '(SOLUTION|SYRUP|CONCENTRATE|LIQUID)'
    : null;

  const matches = index.data.filter(r => {
    const desc = r.desc.toUpperCase();
    if (!drugTokens.every(t => desc.includes(t.toUpperCase()))) return false;
    if (sd && !new RegExp(`(^|\\D)${sd.replace('.', '\\.')}\\s*MG`).test(desc)) return false;
    if (formWord && !new RegExp(formWord).test(desc)) return false;
    // Release-type filter
    const wantsER = profile.release === 'er';
    const wantsDR = profile.release === 'dr';
    const descER = /(EXTENDED|ER\b|XR\b|XL\b|SR\b|CR\b|24HR)/.test(desc);
    const descDR = /(DELAYED|DR\b|EC\b)/.test(desc);
    if (wantsER && !descER) return false;
    if (wantsDR && !descDR) return false;
    if (!wantsER && !wantsDR && (descER || descDR)) return false;
    return true;
  });
  return matches;
}

function summarizeNadacMatches(matches, sku) {
  if (!matches.length) return null;
  // Prefer generic (G) rows when available; otherwise use whatever exists
  const generics = matches.filter(m => m.type === 'G');
  const pool = generics.length ? generics : matches;
  // Median per-unit (more robust than mean to outliers)
  const perUnits = pool.map(m => m.perUnit).sort((a, b) => a - b);
  const median = perUnits[Math.floor(perUnits.length / 2)];
  const totalPrice = +(median * sku.quantity).toFixed(2);
  // Pick a representative description from the pool
  const rep = pool[0];
  return {
    available: true,
    price: totalPrice,
    perUnit: +median.toFixed(4),
    ndcDescription: rep.desc,
    pharmacyType: rep.type,
    effectiveDate: rep.eff,
    matchCount: pool.length,
  };
}

// ─────────────────────────────────────────────────────────── orchestration ──

async function main() {
  const skusFile = JSON.parse(fs.readFileSync(SKUS_PATH, 'utf8'));
  const skus = skusFile.skus || skusFile;

  const sources = [
    { key: 'CostPlusDrugs',   displayName: 'Cost Plus Drugs', url: 'https://costplusdrugs.com/',           type: 'retail' },
    { key: 'HealthWarehouse', displayName: 'HealthWarehouse', url: 'https://www.healthwarehouse.com/',     type: 'retail' },
    { key: 'NADAC',           displayName: 'NADAC (wholesale)', url: 'https://data.medicaid.gov/dataset/', type: 'wholesale', excludeFromBest: true },
  ];

  const drugList = Object.entries(skus)
    .filter(([, s]) => !s.clinicOnly)
    .filter(([name]) => !ONLY.length || ONLY.includes(name));

  logInfo(`Scraping ${drugList.length} drugs across ${sources.length} sources…`);

  // Load all indexes once
  let cpdSitemap, hwSitemap, nadac;
  try { cpdSitemap = await loadCpdSitemap(); } catch (e) { logError(`CPD sitemap failed: ${e.message}`); cpdSitemap = []; }
  try { hwSitemap  = await loadHwSitemap();  } catch (e) { logError(`HW sitemap failed: ${e.message}`); hwSitemap = []; }
  try { nadac      = await loadNadacIndex(); } catch (e) { logError(`NADAC load failed: ${e.message}`); nadac = null; }

  const prices = {};
  const errors = {};
  const stats  = { CostPlusDrugs: 0, HealthWarehouse: 0, NADAC: 0 };

  for (const [drugName, sku] of drugList) {
    process.stdout.write(`  ${drugName.padEnd(28)}`);
    const drugErrors = [];
    const drugPrices = {};

    // CPD
    if (cpdSitemap.length) {
      const url = findCpdUrl(cpdSitemap, drugName, sku);
      if (!url) drugErrors.push('CostPlusDrugs: no slug match');
      else {
        try {
          const r = await scrapeCpd(url);
          drugPrices.CostPlusDrugs = { ...r, asOf: new Date().toISOString().slice(0, 10) };
          stats.CostPlusDrugs++;
        } catch (e) {
          drugErrors.push(`CostPlusDrugs: ${e.message} (${url})`);
        }
      }
    }

    // HealthWarehouse
    if (hwSitemap.length) {
      const url = findHwUrl(hwSitemap, drugName, sku);
      if (!url) drugErrors.push('HealthWarehouse: no slug match');
      else {
        try {
          const r = await scrapeHw(url, sku);
          drugPrices.HealthWarehouse = { ...r, asOf: new Date().toISOString().slice(0, 10) };
          stats.HealthWarehouse++;
        } catch (e) {
          drugErrors.push(`HealthWarehouse: ${e.message} (${url})`);
        }
      }
    }

    // NADAC (offline lookup, no network call per drug)
    if (nadac) {
      const matches = findNadacRows(nadac, drugName, sku);
      const summary = summarizeNadacMatches(matches, sku);
      if (!summary) drugErrors.push('NADAC: no matching NDC rows');
      else {
        drugPrices.NADAC = { ...summary, asOf: new Date().toISOString().slice(0, 10) };
        stats.NADAC++;
      }
    }

    // Output line
    const tag = (k) => drugPrices[k] ? `${k.slice(0,3)}=$${drugPrices[k].price.toFixed(2)}` : `${k.slice(0,3)}=—`;
    process.stdout.write(`  ${tag('CostPlusDrugs')}  ${tag('HealthWarehouse')}  ${tag('NADAC')}\n`);

    prices[drugName] = drugPrices;
    if (drugErrors.length) errors[drugName] = drugErrors;
  }

  const output = {
    $schema: 'Generated by scripts/scrape-prices.js. Sources: Cost Plus Drugs (transparent retail), HealthWarehouse (mail-order retail), NADAC (CMS wholesale anchor — not a buyable patient price; excluded from best-price comparison).',
    lastUpdated: new Date().toISOString(),
    zipCode: '98643',
    sources,
    nadacDataset: nadac ? { title: nadac.datasetTitle, downloadUrl: nadac.downloadUrl, modified: nadac.modified } : null,
    prices,
    errors,
    stats,
  };

  logInfo(`\nResults: CPD=${stats.CostPlusDrugs}/${drugList.length}  HW=${stats.HealthWarehouse}/${drugList.length}  NADAC=${stats.NADAC}/${drugList.length}`);
  const errorCount = Object.values(errors).reduce((sum, arr) => sum + arr.length, 0);
  if (errorCount) logWarn(`${errorCount} per-source lookup errors across ${Object.keys(errors).length} drugs (see prices.json "errors" map for detail).`);

  if (DRY_RUN) {
    logInfo('--no-write set; not writing prices.json.');
    return;
  }

  const json = JSON.stringify(output, null, 2);
  fs.writeFileSync(OUT_PATH, json);
  logInfo(`Wrote ${OUT_PATH} (${json.length.toLocaleString()} bytes)`);

  // Mirror to hugo-site/static/data/prices.json (deployment requirement per CLAUDE.md)
  const hugoDir = path.dirname(HUGO_OUT);
  if (!fs.existsSync(hugoDir)) fs.mkdirSync(hugoDir, { recursive: true });
  fs.writeFileSync(HUGO_OUT, json);
  logInfo(`Mirrored to ${HUGO_OUT}`);
}

main().catch(err => {
  logError(`Fatal: ${err.stack || err.message}`);
  process.exit(1);
});

#!/usr/bin/env node
/*
 * scripts/merge-retail-prices.js
 *
 * Phase 3 of the hybrid weekly price-scrape flow.
 *
 *   Phase 1 (bash):    node scripts/scrape-prices.js
 *                      → data/prices.json (NADAC populated)
 *                      → data/cpd-targets.json {drugName: cpdProductUrl}
 *                      → data/hw-targets.json  {drugName: [url1, url2, url3]}
 *
 *   Phase 2 (browser): Claude-in-Chrome navigates to one CPD product page
 *                      to set Cloudflare clearance, parallel-fetches all
 *                      CPD targets, writes data/cpd-prices.json. Then
 *                      navigates to one HW product page, parallel-fetches
 *                      all HW candidate lists (trying each URL in order
 *                      until one returns product data), writes
 *                      data/hw-prices.json.
 *
 *                      Both files share this shape:
 *                          {
 *                            "generatedAt": "2026-04-25T...",
 *                            "results": {
 *                              "Sertraline":  { "available": true,  "price": 5.69, "url": "..." },
 *                              "Bupropion":   { "available": false, "error": "404" },
 *                              ...
 *                            }
 *                          }
 *                      For HW, each result also includes "packSize" if
 *                      the matched offer pack was != sku.quantity.
 *
 *   Phase 3 (this):    node scripts/merge-retail-prices.js
 *                      → merges CostPlusDrugs + HealthWarehouse entries
 *                        into data/prices.json
 *                      → mirrors to hugo-site/static/data/prices.json
 *                      → updates lastUpdated, stats, errors
 */

'use strict';

const fs   = require('node:fs');
const path = require('node:path');

const REPO_ROOT = path.resolve(__dirname, '..');
const PRICES    = path.join(REPO_ROOT, 'data', 'prices.json');
const HUGO      = path.join(REPO_ROOT, 'hugo-site', 'static', 'data', 'prices.json');
const CPD_IN    = path.join(REPO_ROOT, 'data', 'cpd-prices.json');
const HW_IN     = path.join(REPO_ROOT, 'data', 'hw-prices.json');
const SKUS_IN   = path.join(REPO_ROOT, 'data', 'drug-skus.json');
const SKUS      = (JSON.parse(fs.readFileSync(SKUS_IN, 'utf8')).skus) || {};

// ── Sanity checks on retail matches (round 7) ──────────────────────────────
// Returns { ok, price, reason } after normalizing pack counts and rejecting
// wrong-product matches. Never publishes a price it cannot reconcile.
function firstNumber(s) { const m = String(s || '').match(/[\d.]+/); return m ? parseFloat(m[0]) : null; }
function vetRetail(drugName, entry, nadac) {
  const sku = SKUS[drugName] || {};
  // Product slug = last path segment (CPD URLs are /medications/<slug>/)
  const slug = String(entry.url || '').toLowerCase().replace(/[?#].*$/, '').replace(/\/+$/, '').split('/').pop() || '';
  let price = entry.price;
  const nameTokens = drugName.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  // 1) Strength in the product slug must match the SKU strength (e.g. 150mg ≠ 50 mg, 2-5mg ≠ 5 mg)
  // CPD writes decimals as 0_1mg / 37_5mg; some slugs use 2-5mg for 2.5 mg
  const sm = slug.match(/(?:^|[^0-9])(\d+(?:[-_]\d+)?)mg/);
  const skuStrength = firstNumber(sku.strength);
  if (sm && skuStrength != null) {
    const slugStrength = parseFloat(sm[1].replace(/[-_]/, '.'));
    if (Math.abs(slugStrength - skuStrength) > 1e-6) return { ok: false, reason: `strength mismatch (${sm[1]}mg page vs ${sku.strength} SKU)` };
  }
  // 2) Generic SKU matched to a brand-prefixed or combination product page
  const prefixes = [nameTokens[0], ...((sku.aliases || []).map(a => String(a).toLowerCase()))].filter(Boolean);
  if (sku.generic && prefixes.length && !prefixes.some(p => slug.startsWith(p))) {
    return { ok: false, reason: 'brand or combination product page matched for a generic SKU' };
  }
  // 3) Multi-pack listings ("...-30ct-pack" with packSize = number of packs): rescale to SKU quantity
  const ct = slug.match(/(\d+)ct/);
  if (ct && typeof entry.unitPrice === 'number' && sku.quantity) {
    price = +(entry.unitPrice * sku.quantity / parseInt(ct[1], 10)).toFixed(2);
  } else if (typeof entry.packSize === 'number' && sku.quantity && entry.packSize !== sku.quantity && entry.packSize >= 10) {
    price = +(entry.price * sku.quantity / entry.packSize).toFixed(2);
  }
  // 4) Outlier guard: >10× NADAC AND >$50 above it (cheap generics legitimately retail at many × NADAC)
  if (nadac && nadac.available && typeof nadac.price === 'number' && nadac.price > 0 && price > 10 * nadac.price && price - nadac.price > 50) {
    return { ok: false, reason: `outlier (>10× NADAC: $${price} vs $${nadac.price})` };
  }
  return { ok: true, price };
}

function logInfo(m)  { console.log(`[info]  ${m}`); }
function logWarn(m)  { console.warn(`[warn]  ${m}`); }
function logError(m) { console.error(`[error] ${m}`); }

if (!fs.existsSync(PRICES)) {
  logError(`prices.json not found: ${PRICES}`);
  logError('Did Phase 1 (node scripts/scrape-prices.js) run yet?');
  process.exit(1);
}

const prices = JSON.parse(fs.readFileSync(PRICES, 'utf8'));
const today  = new Date().toISOString().slice(0, 10);
prices.errors = prices.errors || {};
prices.stats  = prices.stats  || {};
delete prices.errors['(pipeline)'];

function clearSourceErrors(drug, sourceKey) {
  if (!prices.errors[drug]) return;
  prices.errors[drug] = prices.errors[drug].filter(e => !e.startsWith(`${sourceKey}:`) && !e.startsWith(`${sourceKey} `));
  if (!prices.errors[drug].length) delete prices.errors[drug];
}

function addError(drug, msg) {
  prices.errors[drug] = prices.errors[drug] || [];
  prices.errors[drug].push(msg);
}

function mergeOneSource(sourceKey, inputPath, label) {
  if (!fs.existsSync(inputPath)) {
    logWarn(`${label} input not found: ${inputPath} — skipping (browser phase may not have run for this source)`);
    return 0;
  }
  const blob = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const results = blob.results || blob;
  // asOf = when the browser phase actually scraped, not when this merge ran
  const scrapedOn = (blob.generatedAt || '').slice(0, 10) || today;
  let merged = 0, failed = 0, rejected = 0;
  // Stale input = the fetch/browser step failed or was skipped. Say so in
  // prices.json errors instead of silently re-merging old prices.
  const ageDays = scrapedOn ? Math.floor((Date.parse(today) - Date.parse(scrapedOn)) / 86400000) : null;
  if (ageDays != null && ageDays > 8) {
    const msg = `${sourceKey}: input ${path.basename(inputPath)} is ${ageDays} days old (generated ${scrapedOn}); the fetch step failed or was skipped`;
    logError(msg);
    addError('(pipeline)', msg);
  }

  for (const [drugName, entry] of Object.entries(results)) {
    if (!prices.prices[drugName]) prices.prices[drugName] = {};
    clearSourceErrors(drugName, sourceKey);
    // HealthWarehouse hides controlled / state-scheduled prices until a state is
    // chosen, so a scraped number for these is stale or wrong. Keep the reason.
    const skuInfo = SKUS[drugName] || {};
    if (sourceKey === 'HealthWarehouse' && (skuInfo.controlled || skuInfo.hwReason)) {
      prices.prices[drugName][sourceKey] = { available: false, reason: skuInfo.hwReason || 'Controlled — HealthWarehouse shows price only after state selection', url: entry && entry.url, asOf: scrapedOn };
      continue;
    }

    if (entry && entry.available && typeof entry.price === 'number') {
      const vet = vetRetail(drugName, entry, prices.prices[drugName].NADAC);
      if (!vet.ok) {
        rejected++;
        prices.prices[drugName][sourceKey] = { available: false, reason: 'Excluded: ' + vet.reason, url: entry.url, asOf: scrapedOn };
        addError(drugName, `${sourceKey}: excluded — ${vet.reason} (${entry.url})`);
        continue;
      }
      const out = { available: true, price: vet.price, url: entry.url, asOf: entry.asOf || scrapedOn };
      if (vet.price !== entry.price) out.rawPrice = entry.price;
      if (typeof entry.packSize === 'number' && entry.packSize > 0) out.packSize = entry.packSize;
      prices.prices[drugName][sourceKey] = out;
      merged++;
    } else if (entry && entry.notListed) {
      // Clean "not carried" answer from the Cost Plus API: a reason, not an error
      prices.prices[drugName][sourceKey] = { available: false, reason: entry.reason || 'Not listed', asOf: scrapedOn };
    } else {
      failed++;
      const errMsg = entry?.error || 'no price returned';
      addError(drugName, `${sourceKey} (browser): ${errMsg}${entry?.url ? ' (' + entry.url + ')' : ''}`);
    }
  }

  logInfo(`${label}: merged ${merged} prices, ${failed} failures, ${rejected} excluded by sanity checks.`);
  prices.stats[sourceKey] = merged;
  return merged;
}

const cpdMerged = mergeOneSource('CostPlusDrugs',   CPD_IN, 'Cost Plus Drugs');
const hwMerged  = mergeOneSource('HealthWarehouse', HW_IN,  'HealthWarehouse');

// Every retail cell gets either a price or a reason — never a bare blank.
for (const [drugName, sku] of Object.entries(SKUS)) {
  if (sku.clinicOnly) continue;
  const row = prices.prices[drugName] = prices.prices[drugName] || {};
  for (const [key, file] of [['CostPlusDrugs', CPD_IN], ['HealthWarehouse', HW_IN]]) {
    if (row[key]) continue;
    let when = '';
    try { when = (JSON.parse(fs.readFileSync(file, 'utf8')).generatedAt || '').slice(0, 10); } catch (e) {}
    row[key] = { available: false, reason: `No listing found${when ? ' (last checked ' + when + ')' : ''}` };
  }
}

prices.lastUpdated = new Date().toISOString();

const json = JSON.stringify(prices, null, 2);
fs.writeFileSync(PRICES, json);
fs.writeFileSync(HUGO, json);

logInfo(`Wrote ${PRICES}`);
logInfo(`Mirrored to ${HUGO}`);

const totalDrugs = Object.keys(prices.prices).length;
const cpdHits   = Object.values(prices.prices).filter(p => p.CostPlusDrugs?.available).length;
const hwHits    = Object.values(prices.prices).filter(p => p.HealthWarehouse?.available).length;
const nadacHits = Object.values(prices.prices).filter(p => p.NADAC?.available).length;
logInfo(`Final coverage: CPD=${cpdHits}/${totalDrugs}  HW=${hwHits}/${totalDrugs}  NADAC=${nadacHits}/${totalDrugs}`);

// Exit non-zero if both retail sources are empty — blocks the cron from
// committing an obviously-broken result.
if (cpdHits === 0 && hwHits === 0) {
  logError('Both retail sources returned zero prices — not a usable update.');
  process.exit(2);
}

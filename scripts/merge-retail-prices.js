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
  let merged = 0, failed = 0;

  for (const [drugName, entry] of Object.entries(results)) {
    if (!prices.prices[drugName]) prices.prices[drugName] = {};
    clearSourceErrors(drugName, sourceKey);

    if (entry && entry.available && typeof entry.price === 'number') {
      const out = { available: true, price: entry.price, url: entry.url, asOf: today };
      if (typeof entry.packSize === 'number' && entry.packSize > 0) out.packSize = entry.packSize;
      prices.prices[drugName][sourceKey] = out;
      merged++;
    } else {
      failed++;
      const errMsg = entry?.error || 'no price returned';
      addError(drugName, `${sourceKey} (browser): ${errMsg}${entry?.url ? ' (' + entry.url + ')' : ''}`);
    }
  }

  logInfo(`${label}: merged ${merged} prices, ${failed} failures.`);
  prices.stats[sourceKey] = merged;
  return merged;
}

const cpdMerged = mergeOneSource('CostPlusDrugs',   CPD_IN, 'Cost Plus Drugs');
const hwMerged  = mergeOneSource('HealthWarehouse', HW_IN,  'HealthWarehouse');

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

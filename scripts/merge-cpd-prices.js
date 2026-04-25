#!/usr/bin/env node
/*
 * scripts/merge-cpd-prices.js
 *
 * Phase 3 of the hybrid weekly price-scrape flow.
 *
 *   Phase 1 (bash):    node scripts/scrape-prices.js
 *                      → writes data/prices.json (HW + NADAC populated)
 *                      → writes data/cpd-targets.json {drugName: cpdProductUrl}
 *
 *   Phase 2 (browser): Claude-in-Chrome navigates to one CPD product, then
 *                      runs a single javascript_tool that fetches all CPD
 *                      target URLs in parallel (same-origin, so the
 *                      Cloudflare clearance cookie set on the first
 *                      navigation passes through). Output is written to
 *                      data/cpd-prices.json with shape:
 *                          {
 *                            "generatedAt": "2026-04-25T...",
 *                            "results": {
 *                              "Sertraline":   { "available": true,  "price": 5.69, "url": "..." },
 *                              "Bupropion":    { "available": false, "error": "404" },
 *                              ...
 *                            }
 *                          }
 *
 *   Phase 3 (this):    node scripts/merge-cpd-prices.js
 *                      → merges the CPD entries into data/prices.json
 *                      → re-mirrors to hugo-site/static/data/prices.json
 *                      → updates lastUpdated + stats + errors
 *
 * Run:    node scripts/merge-cpd-prices.js
 *         node scripts/merge-cpd-prices.js --input=data/cpd-prices.json  (override)
 */

'use strict';

const fs   = require('node:fs');
const path = require('node:path');

const REPO_ROOT  = path.resolve(__dirname, '..');
const PRICES     = path.join(REPO_ROOT, 'data', 'prices.json');
const HUGO       = path.join(REPO_ROOT, 'hugo-site', 'static', 'data', 'prices.json');
const DEFAULT_IN = path.join(REPO_ROOT, 'data', 'cpd-prices.json');

const args = process.argv.slice(2);
const INPUT = (args.find(a => a.startsWith('--input=')) || `--input=${DEFAULT_IN}`).slice('--input='.length);

function logInfo(m)  { console.log(`[info]  ${m}`); }
function logWarn(m)  { console.warn(`[warn]  ${m}`); }
function logError(m) { console.error(`[error] ${m}`); }

if (!fs.existsSync(INPUT)) {
  logError(`Input file not found: ${INPUT}`);
  logError('Did Phase 2 (browser scrape) write data/cpd-prices.json yet?');
  process.exit(1);
}
if (!fs.existsSync(PRICES)) {
  logError(`prices.json not found: ${PRICES}`);
  logError('Did Phase 1 (node scripts/scrape-prices.js) run yet?');
  process.exit(1);
}

const cpdInput = JSON.parse(fs.readFileSync(INPUT, 'utf8'));
const prices   = JSON.parse(fs.readFileSync(PRICES, 'utf8'));

const results = cpdInput.results || cpdInput;   // accept either {results: {...}} or flat object
const today   = new Date().toISOString().slice(0, 10);

let merged = 0;
let failed = 0;
const errors = prices.errors || {};

for (const [drugName, entry] of Object.entries(results)) {
  if (!prices.prices[drugName]) prices.prices[drugName] = {};
  if (entry && entry.available && typeof entry.price === 'number') {
    prices.prices[drugName].CostPlusDrugs = {
      available: true,
      price: entry.price,
      url: entry.url,
      asOf: today,
    };
    merged++;
    // Clear any stale CostPlusDrugs error from earlier
    if (errors[drugName]) {
      errors[drugName] = errors[drugName].filter(e => !e.startsWith('CostPlusDrugs:'));
      if (!errors[drugName].length) delete errors[drugName];
    }
  } else {
    failed++;
    const errMsg = entry?.error || 'no price returned';
    errors[drugName] = (errors[drugName] || []).filter(e => !e.startsWith('CostPlusDrugs:'));
    errors[drugName].push(`CostPlusDrugs (browser): ${errMsg}${entry?.url ? ' (' + entry.url + ')' : ''}`);
  }
}

prices.errors = errors;
prices.stats = prices.stats || {};
prices.stats.CostPlusDrugs = merged;
prices.lastUpdated = new Date().toISOString();

const json = JSON.stringify(prices, null, 2);
fs.writeFileSync(PRICES, json);
fs.writeFileSync(HUGO, json);

logInfo(`Merged ${merged} CPD prices into prices.json (${failed} failures).`);
logInfo(`Wrote ${PRICES}`);
logInfo(`Mirrored to ${HUGO}`);

// Final tally across all sources
const totalDrugs = Object.keys(prices.prices).length;
const cpdHits = Object.values(prices.prices).filter(p => p.CostPlusDrugs?.available).length;
const hwHits  = Object.values(prices.prices).filter(p => p.HealthWarehouse?.available).length;
const nadacHits = Object.values(prices.prices).filter(p => p.NADAC?.available).length;
logInfo(`Final coverage: CPD=${cpdHits}/${totalDrugs}  HW=${hwHits}/${totalDrugs}  NADAC=${nadacHits}/${totalDrugs}`);

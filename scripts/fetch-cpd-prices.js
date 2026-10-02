#!/usr/bin/env node
/*
 * scripts/fetch-cpd-prices.js
 *
 * Phase 2a of the weekly price refresh: Cost Plus Drugs prices from the
 * public Cost Plus price API (no browser, no Cloudflare session needed).
 * Replaces the Cost Plus half of the browser bookmarklet phase.
 *
 *   node scripts/fetch-cpd-prices.js            → writes data/cpd-prices.json
 *   node scripts/fetch-cpd-prices.js --no-write → log only
 *   node scripts/merge-retail-prices.js         → merges it into prices.json
 *
 * Price = unit_billing_price (includes the 15% markup) × SKU quantity + $5
 * pharmacy fee. Shipping is not included.
 *
 * Matching: the API catalog row must contain every drug-name token (or an
 * alias, or the exact sku.cpdName), the same strength, the same dose form
 * (tablet/capsule) and the same release type (IR/ER/DR/SL; XL vs SR when the
 * SKU names one). Controlled and clinic-only SKUs are skipped.
 *
 * If the API call fails the script exits non-zero WITHOUT writing, so the
 * merge step sees a stale generatedAt and records it in prices.json errors.
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const REPO_ROOT = path.resolve(__dirname, '..');
const SKUS_PATH = path.join(REPO_ROOT, 'data', 'drug-skus.json');
const OUT_PATH  = path.join(REPO_ROOT, 'data', 'cpd-prices.json');
const API       = 'https://us-central1-costplusdrugs-publicapi.cloudfunctions.net/main';
const FEE       = 5;
const DRY_RUN   = process.argv.includes('--no-write');

const tokens = s => String(s || '').toLowerCase().replace(/[^a-z0-9.]+/g, ' ').trim().split(/\s+/).filter(Boolean);
const nums = s => (String(s || '').match(/\d+(?:\.\d+)?/g) || []).map(Number);
const money = s => parseFloat(String(s || '').replace(/[^0-9.]/g, ''));

function releaseOf(text) {
  const t = ' ' + String(text || '').toLowerCase() + ' ';
  if (/sublingual|\bsl\b/.test(t)) return 'sl';
  if (/delayed|\bdr\b|\bec\b/.test(t)) return 'dr';
  if (/\bxl\b/.test(t)) return 'xl';
  if (/sustained|\bsr\b/.test(t)) return 'sr';
  if (/extended|\ber\b|\bxr\b|\bcr\b|24 ?hr/.test(t)) return 'er';
  return 'ir';
}
const releaseFamily = r => (r === 'xl' || r === 'sr' || r === 'er') ? 'er' : r;

function doseOf(text) {
  const t = String(text || '').toLowerCase();
  if (/tablet/.test(t)) return 'tablet';
  if (/capsule/.test(t)) return 'capsule';
  return 'other';
}

function matchRow(rows, drugName, sku) {
  const names = sku.cpdName ? [sku.cpdName] : [drugName, ...(sku.aliases || [])];
  const want = nums(sku.strength);
  const wantDose = doseOf(sku.form);
  const wantRel = releaseOf(sku.form);
  const cands = rows.filter(r => {
    const med = String(r.medication_name || '');
    const nameOk = sku.cpdName
      ? med.toLowerCase() === sku.cpdName.toLowerCase()
      : names.some(n => { const mt = tokens(med); return tokens(n).every(t => mt.includes(t)); });
    if (!nameOk) return false;
    const form = String(r.form || '');
    if (/chew|odt|disintegrat|kit|suspension|solution|patch|dropper|bottle|cream|gel|inject|spray/i.test(form + ' ' + r.strength)) return false;
    if (/\/\s*(ml|24 ?hr)|&|\bx\b/i.test(r.strength)) return false;
    const have = nums(r.strength);
    if (!want.length || have.length !== want.length || have.some((v, i) => Math.abs(v - want[i]) > 1e-9)) return false;
    if (doseOf(form) !== wantDose) return false;
    const rel = releaseOf(med + ' ' + form + ' ' + (r.brand_name || ''));
    if (wantRel === 'xl' || wantRel === 'sr') { if (rel !== wantRel) return false; }
    else if (releaseFamily(rel) !== releaseFamily(wantRel)) return false;
    return Number.isFinite(money(r.unit_billing_price));
  });
  if (sku.cpdUrl) {
    const byUrl = cands.find(r => String(r.url).toLowerCase() === sku.cpdUrl.toLowerCase());
    if (byUrl) return byUrl;
  }
  cands.sort((a, b) => (a.brand_generic === 'Generic' ? 0 : 1) - (b.brand_generic === 'Generic' ? 0 : 1) || money(a.unit_billing_price) - money(b.unit_billing_price));
  return cands[0] || null;
}

async function main() {
  const skus = JSON.parse(fs.readFileSync(SKUS_PATH, 'utf8')).skus;
  const today = new Date().toISOString().slice(0, 10);
  let rows;
  try {
    const r = await fetch(API, { headers: { accept: 'application/json' } });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    rows = (await r.json()).results;
    if (!Array.isArray(rows) || rows.length < 100) throw new Error(`unexpected catalog size (${rows && rows.length})`);
  } catch (e) {
    console.error(`[error] Cost Plus API failed: ${e.message}. Not writing ${OUT_PATH}.`);
    process.exit(1);
  }
  console.log(`[info]  Cost Plus catalog: ${rows.length} rows`);
  const results = {};
  let hit = 0, miss = 0;
  for (const [drugName, sku] of Object.entries(skus)) {
    if (sku.clinicOnly || sku.controlled) continue;
    const row = matchRow(rows, drugName, sku);
    if (row) {
      const unit = money(row.unit_billing_price);
      const price = +(unit * sku.quantity + FEE).toFixed(2);
      results[drugName] = { available: true, price, unitPrice: unit, url: row.url, product: `${row.medication_name} ${row.strength} ${row.form}`, asOf: today };
      hit++;
      console.log(`  ${drugName.padEnd(28)} $${price.toFixed(2)}  ${row.medication_name} ${row.strength} ${row.form}`);
    } else if (!sku.retailReason) {
      results[drugName] = { available: false, notListed: true, reason: `Not listed by Cost Plus for this strength/form (checked ${today})` };
      miss++;
      console.log(`  ${drugName.padEnd(28)} not listed`);
    }
  }
  console.log(`[info]  ${hit} priced, ${miss} not listed.`);
  if (DRY_RUN) return;
  fs.writeFileSync(OUT_PATH, JSON.stringify({ generatedAt: new Date().toISOString(), source: API, results }, null, 2));
  console.log(`[info]  Wrote ${OUT_PATH}`);
}

main().catch(e => { console.error(`[error] ${e.stack || e.message}`); process.exit(1); });

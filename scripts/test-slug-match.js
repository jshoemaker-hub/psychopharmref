#!/usr/bin/env node
/*
 * scripts/test-slug-match.js
 *
 * Offline validation of the slug-matching heuristics in scrape-prices.js.
 * Uses synthetic mini-sitemaps derived from real URLs sampled during probing,
 * so this can run inside the Cowork sandbox (no external network).
 *
 * Run:  node scripts/test-slug-match.js
 */

'use strict';

const path = require('node:path');
// Load the matcher functions by requiring the scrape script's exports… but
// it doesn't export. Quick workaround: re-implement the imports via a tiny
// fake module pattern — copy the heuristics from scrape-prices.js below.

function tokenize(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(/\s+/).filter(Boolean);
}
function strengthDigits(s) {
  const m = (s || '').match(/[\d.]+/);
  return m ? m[0] : '';
}
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

function findCpdUrl(sitemap, drugName, sku) {
  const drugTokens = tokenize(drugName);
  const sd = strengthDigits(sku.strength);
  const profile = formProfile(sku.form);
  const wantsRelease = profile.release;
  if (profile.dose === 'spray' || profile.dose === 'injection') return null;
  const scored = sitemap.map(url => {
    const slug = url.split('/medications/')[1].replace(/\/+$/, '').toLowerCase();
    const slugTokens = tokenize(slug);
    let score = 0;
    if (!drugTokens.every(t => slug.includes(t))) return null;
    score += 10;
    if (sd && new RegExp(`(^|[^0-9])${sd.replace('.', '\\.')}\\s*mg`).test(slug)) score += 6;
    else if (sd && slug.includes(sd)) score += 3;
    else if (sd) score -= 4;
    if (profile.dose !== 'unknown' && slug.includes(profile.dose)) score += 4;
    else if (profile.dose !== 'unknown') score -= 3;
    const slugIsER = /(extended|-er-|-er$|^er-|-xr-|-xr$|^xr-|-xl-|-xl$|^xl-|-sr-|-sr$|^sr-|-cr-|-cr$|^cr-)/.test(slug);
    const slugIsDR = /(delayed|-dr-|-dr$|^dr-)/.test(slug);
    const slugIsSL = /(sublingual|-sl-|-sl$|^sl-)/.test(slug);
    const slugRelease = slugIsER ? 'er' : slugIsDR ? 'dr' : slugIsSL ? 'sl' : null;
    if (wantsRelease && slugRelease === wantsRelease) score += 4;
    else if (wantsRelease && slugRelease !== wantsRelease) score -= 5;
    else if (!wantsRelease && slugRelease) score -= 3;
    if (/(bottleof|solution|concentrate|powder|liquid|suspension|kit|patch|nasal-spray|injection|cream|gel|ointment|odt)/.test(slug)) score -= 6;
    score -= Math.max(0, slugTokens.length - 4) * 0.5;
    return { url, slug, score };
  }).filter(Boolean);
  if (!scored.length) return null;
  scored.sort((a, b) => b.score - a.score);
  return scored[0].score >= 15 ? scored[0].url : null;
}

function findHwUrl(sitemap, drugName, sku) {
  const drugTokens = tokenize(drugName);
  const sd = strengthDigits(sku.strength);
  const profile = formProfile(sku.form);
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
    const slugER = /(extended|-er-|-er$|^er-|-xr-|-xr$|^xr-|-xl-|-xl$|^xl-|-sr-|-sr$|^sr-|-cr-|-cr$|^cr-)/.test(slug);
    if (wantsER && slugER) score += 4;
    else if (wantsER && !slugER) score -= 5;
    else if (!wantsER && slugER) score -= 3;
    if (/(solution|concentrate|powder|liquid|suspension|kit|cream|gel|ointment|odt|orally-disintegrating|patch|nasal|injection)/.test(slug)) score -= 6;
    score -= Math.max(0, slugTokens.length - 5) * 0.4;
    return { url, slug, score };
  }).filter(Boolean);
  if (!scored.length) return null;
  scored.sort((a, b) => b.score - a.score);
  return scored[0].score >= 15 ? scored[0].url : null;
}

// Synthetic sitemaps populated with real URLs sampled during probing
const cpdSitemap = [
  'https://www.costplusdrugs.com/medications/sertraline-50mg-tablet/',
  'https://www.costplusdrugs.com/medications/sertraline-100mg-tablet/',
  'https://www.costplusdrugs.com/medications/sertraline-25mg-tablet/',
  'https://www.costplusdrugs.com/medications/sertraline-150mg-capsule/',
  'https://www.costplusdrugs.com/medications/sertraline-hcl-20mg-ml-bottle-of-concentrate-60-zoloft/',
  'https://www.costplusdrugs.com/medications/EscitalopramOxalate-10mg-Tablet/',
  'https://www.costplusdrugs.com/medications/EscitalopramOxalate-20mg-Tablet/',
  'https://www.costplusdrugs.com/medications/EscitalopramOxalate-5mg-Tablet/',
  'https://www.costplusdrugs.com/medications/escitalopram-oxalate-5mg-5ml-bottle-of-solution-240-lexapro/',
  'https://www.costplusdrugs.com/medications/fluoxetine-10mg-capsule/',
  'https://www.costplusdrugs.com/medications/fluoxetine-20mg-capsule/',
  'https://www.costplusdrugs.com/medications/bupropion-xl-150mg-tablet/',
  'https://www.costplusdrugs.com/medications/bupropion-xl-300mg-tablet/',
  'https://www.costplusdrugs.com/medications/bupropion-hcl-100mg-tablet/',
  'https://www.costplusdrugs.com/medications/lithium-carbonate-300mg-capsule/',
  'https://www.costplusdrugs.com/medications/aripiprazole-10mg-tablet/',
];
const hwSitemap = [
  'https://www.healthwarehouse.com/sertraline-50mg-tablets-generic-zoloft',
  'https://www.healthwarehouse.com/sertraline-100mg-tablets-generic-zoloft',
  'https://www.healthwarehouse.com/sertraline-25mg-tablets-generic-zoloft',
  'https://www.healthwarehouse.com/sertraline-50mg-tablets-greenstone',
  'https://www.healthwarehouse.com/escitalopram-10mg-tablet',
  'https://www.healthwarehouse.com/escitalopram-20mg-tablet',
  'https://www.healthwarehouse.com/fluoxetine-20mg-capsule',
  'https://www.healthwarehouse.com/bupropion-xl-150mg-tablet',
  'https://www.healthwarehouse.com/lithium-carbonate-300mg-capsule',
];

const cases = [
  { drug: 'Sertraline',   sku: { form: 'tablet',    strength: '50 mg' },  expectCpd: 'sertraline-50mg-tablet',          expectHw: 'sertraline-50mg-tablets-generic-zoloft' },
  { drug: 'Escitalopram', sku: { form: 'tablet',    strength: '10 mg' },  expectCpd: 'EscitalopramOxalate-10mg-Tablet', expectHw: 'escitalopram-10mg-tablet' },
  { drug: 'Fluoxetine',   sku: { form: 'capsule',   strength: '20 mg' },  expectCpd: 'fluoxetine-20mg-capsule',         expectHw: 'fluoxetine-20mg-capsule' },
  { drug: 'Bupropion',    sku: { form: 'ER tablet', strength: '150 mg' }, expectCpd: 'bupropion-xl-150mg-tablet',       expectHw: 'bupropion-xl-150mg-tablet' },
  { drug: 'Lithium',      sku: { form: 'capsule',   strength: '300 mg' }, expectCpd: 'lithium-carbonate-300mg-capsule', expectHw: 'lithium-carbonate-300mg-capsule' },
  { drug: 'Aripiprazole', sku: { form: 'tablet',    strength: '10 mg' },  expectCpd: 'aripiprazole-10mg-tablet',        expectHw: null /* not in sample sitemap */ },
];

let pass = 0, fail = 0;
console.log('Slug-match unit test\n──────────────────────────────────────────────────────────');
for (const c of cases) {
  const cpd = findCpdUrl(cpdSitemap, c.drug, c.sku);
  const hw  = findHwUrl(hwSitemap,  c.drug, c.sku);
  const cpdOk = c.expectCpd === null ? cpd === null : (cpd && cpd.includes(c.expectCpd));
  const hwOk  = c.expectHw  === null ? hw  === null : (hw  && hw.includes(c.expectHw));
  const status = cpdOk && hwOk ? 'PASS' : 'FAIL';
  if (cpdOk && hwOk) pass++; else fail++;
  console.log(`${status}  ${c.drug.padEnd(14)} ${c.sku.form.padEnd(11)} ${c.sku.strength.padEnd(7)}`);
  console.log(`        CPD: ${cpd || '(no match)'}  ${cpdOk ? '✓' : '✗ expected …' + c.expectCpd}`);
  console.log(`         HW: ${hw  || '(no match)'}  ${hwOk  ? '✓' : '✗ expected …' + c.expectHw}`);
}
console.log('──────────────────────────────────────────────────────────');
console.log(`${pass} pass, ${fail} fail.`);
process.exit(fail ? 1 : 0);

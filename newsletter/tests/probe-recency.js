// tests/probe-recency.js
//
// One-off probe: ask Grok-with-web_search what major psychiatric pharmacology
// / regulatory developments occurred in a recent window. This is the
// "what's new" coverage probe — orthogonal to fact-checking. It tells you
// what topics the brief / draft might be missing entirely.
//
// Usage:
//   XAI_API_KEY=... node tests/probe-recency.js
//   XAI_API_KEY=... SINCE=2026-04-12 UNTIL=2026-04-26 node tests/probe-recency.js
//
// Defaults: window = 14 days back through today.
// Override the model with PROBE_MODEL (default: validator's XAI_MODEL or grok-4-fast).

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { surveyRecency, formatRecencyReport } from '../lib/validator.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function nDaysAgo(n) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

async function main() {
  const since = process.env.SINCE || nDaysAgo(14);
  const until = process.env.UNTIL || new Date().toISOString().slice(0, 10);
  const model = process.env.PROBE_MODEL; // optional override
  const timeoutMs = Number(process.env.PROBE_TIMEOUT_MS) || 90000;

  console.log(`Calling surveyRecency since=${since} until=${until} model=${model || '(default)'} at ${new Date().toISOString()}`);
  const t0 = Date.now();
  const result = await surveyRecency(since, { until, model, timeoutMs });
  console.log(`Got response after ${Math.round((Date.now() - t0) / 1000)}s`);

  const report = formatRecencyReport(result);
  console.log('\n' + report);

  const outBase = path.join(__dirname, '..', 'briefs', `recency-probe-${until}`);
  fs.writeFileSync(`${outBase}.txt`, report + '\n', 'utf8');
  fs.writeFileSync(`${outBase}.json`, JSON.stringify(result, null, 2), 'utf8');
  console.log(`\nWrote ${outBase}.txt`);
  console.log(`Wrote ${outBase}.json`);

  if (!result.ok) {
    console.log(`\nHeadline: probe returned ok=false (${result.error || 'unknown'}).`);
  } else {
    const high = (result.items || []).filter(i => i.relevance === 'high').length;
    const med = (result.items || []).filter(i => i.relevance === 'medium').length;
    console.log(`\nHeadline: ${result.items?.length || 0} item(s) (${high} high, ${med} medium).`);
  }
}

main().catch(err => {
  console.error('Probe failed:', err);
  process.exit(1);
});

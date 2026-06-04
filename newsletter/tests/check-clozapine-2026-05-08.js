// tests/check-clozapine-2026-05-08.js
//
// One-off probe: feed the 2026-05-08 S2 clozapine paragraph (which was
// drafted from an empty/evergreen brief, so the source-level validator had
// nothing to grade) into the new factCheckDraft() pass and see whether xAI
// flags the obsolete-Clozapine-REMS claim.
//
// Run from newsletter/:
//   XAI_API_KEY=... node tests/check-clozapine-2026-05-08.js
//
// Writes a verdict report to drafts/2026-05-08-s2-draft-verification.txt
// next to the existing draft, and a JSON sidecar for machine inspection.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { factCheckDraft, formatDraftReport } from '../lib/validator.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const draftPath = path.join(__dirname, '..', 'drafts', '2026-05-08-draft.html');

function extractSection2(html) {
  // Drafts are emitted with HTML comment markers '<!-- Section 2 -->' /
  // '<!-- Section 3 -->'. Slice between them.
  const start = html.indexOf('<!-- Section 2 -->');
  const end = html.indexOf('<!-- Section 3 -->');
  if (start < 0 || end < 0 || end <= start) {
    throw new Error('Could not locate Section 2 markers in draft HTML');
  }
  return html.slice(start, end);
}

async function main() {
  const html = fs.readFileSync(draftPath, 'utf8');
  const s2 = extractSection2(html);
  console.log(`Loaded S2 prose (${s2.length} chars from ${path.basename(draftPath)})\n`);

  const sectionLabel = 'S2 — clozapine essentials (2026-05-08)';
  const focusArea = 'Clozapine monitoring, REMS status, non-hematologic risks. Verify whether any cited safety/regulatory program is still in force as of your knowledge cutoff.';

  // Allow the runner to override model + timeout for faster ad-hoc probes.
  // Default to grok-4-fast for the web-search probe so the round-trip fits
  // inside our shell timeout; flip to grok-4 once we have a baseline.
  const probeModel = process.env.PROBE_MODEL || 'grok-4-fast';
  const probeTimeoutMs = Number(process.env.PROBE_TIMEOUT_MS) || 38000;
  console.log(`Calling factCheckDraft (model=${probeModel}, web_search=on, timeout=${probeTimeoutMs}ms) at ${new Date().toISOString()}`);
  const t0 = Date.now();
  const result = await factCheckDraft(sectionLabel, s2, {
    focusArea,
    webSearch: true,
    model: probeModel,
    timeoutMs: probeTimeoutMs,
  });
  console.log(`Got response after ${Math.round((Date.now() - t0) / 1000)}s`);

  const report = formatDraftReport(sectionLabel, result);
  console.log(report);

  const outBase = path.join(__dirname, '..', 'drafts', '2026-05-08-s2-draft-verification');
  fs.writeFileSync(`${outBase}.txt`, report + '\n', 'utf8');
  fs.writeFileSync(`${outBase}.json`, JSON.stringify(result, null, 2), 'utf8');
  console.log(`\nWrote ${outBase}.txt`);
  console.log(`Wrote ${outBase}.json`);

  // Surface a one-line headline so the runner's exit is easy to scan.
  const disagreements = (result.verdicts || []).filter(v => v.verdict === 'disagree');
  if (disagreements.length === 0) {
    console.log('\nHeadline: NO disagreements flagged.');
  } else {
    console.log(`\nHeadline: ${disagreements.length} disagreement(s) flagged:`);
    disagreements.forEach((v, i) => {
      console.log(`  ${i + 1}. [${v.severity}] ${v.claim}`);
      console.log(`     -> ${v.reasoning}`);
    });
  }
}

main().catch(err => {
  console.error('Probe failed:', err);
  process.exit(1);
});

#!/usr/bin/env node
// generate.js — CLI entrypoint for PsychoPharmRef newsletter pipeline

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import config from './config.js';
import { dispatch } from './lib/research.js';
import { findRelevantPosts, buildCorpus } from './lib/blog-linker.js';
import { draftSection, generateNewsletterMeta, assembleHtml, extractBodyOnly } from './lib/draft.js';
import { postDraft } from './lib/post.js';
import { factCheckBrief, factCheckDraft, surveyRecency, formatReport, formatDraftReport, formatRecencyReport } from './lib/validator.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const briefsDir = path.join(__dirname, 'briefs');
const draftsDir = path.join(__dirname, 'drafts');
const blogIndexPath = path.join(__dirname, 'blog-index.json');
const rotationLogPath = path.join(briefsDir, 'rotation-log.json');

// Ensure output directories exist
if (!fs.existsSync(briefsDir)) fs.mkdirSync(briefsDir, { recursive: true });
if (!fs.existsSync(draftsDir)) fs.mkdirSync(draftsDir, { recursive: true });

// Returns today's date string YYYY-MM-DD
function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

// Returns most recent config file in briefs/ by filename sort
function findLatestConfig() {
  const files = fs.readdirSync(briefsDir)
    .filter(f => f.endsWith('-config.json'))
    .sort();
  if (files.length === 0) return null;
  return path.join(briefsDir, files[files.length - 1]);
}

/**
 * findPreviousConfigDate — return the date string (YYYY-MM-DD) of the most
 * recent config strictly before `currentDate`. Used by the recency probe to
 * anchor its "since" window at the previous letter's send date. Returns null
 * if no prior config exists.
 */
function findPreviousConfigDate(currentDate) {
  const dates = fs.readdirSync(briefsDir)
    .filter(f => /^\d{4}-\d{2}-\d{2}-config\.json$/.test(f))
    .map(f => f.slice(0, 10))
    .filter(d => d < currentDate)
    .sort();
  return dates.length > 0 ? dates[dates.length - 1] : null;
}

// Validate required environment variables
function validateEnv() {
  const required = [
    'ANTHROPIC_API_KEY',
    'PERPLEXITY_API_KEY',
    'BEEHIIV_API_KEY',
    'BEEHIIV_PUBLICATION_ID',
    'CONGRESS_API_KEY',
    'XAI_API_KEY',
  ];
  const missing = required.filter(k => !process.env[k]);
  if (missing.length > 0) {
    console.error('Missing required environment variables:');
    missing.forEach(k => console.error(`  - ${k}`));
    console.error('\nCopy .env.example to .env and fill in your API keys.');
    process.exit(1);
  }
}

// Prompt user for topic selection
function promptMenu(rl, question) {
  return new Promise(resolve => {
    rl.question(question, answer => resolve(answer.trim()));
  });
}

/* ──────────────────────────────────────────────────────────────────────────
   Rotation helpers (added 2026-04-16)
   ────────────────────────────────────────────────────────────────────────── */

// Parse YYYY-MM-DD to a UTC Date at midnight.
function parseDateUtc(dateStr) {
  return new Date(`${dateStr}T00:00:00Z`);
}

// Format a Date as YYYY-MM-DD (UTC).
function formatDateUtc(d) {
  return d.toISOString().slice(0, 10);
}

// Add days to a YYYY-MM-DD string, returning YYYY-MM-DD (UTC).
function addDays(dateStr, days) {
  const d = parseDateUtc(dateStr);
  d.setUTCDate(d.getUTCDate() + days);
  return formatDateUtc(d);
}

// Given a letter number and the rotation config, resolve topic keys.
function resolveRotationForLetter(letterNumber, rotation) {
  const scheduleIndex = ((letterNumber - rotation.anchorLetterNumber) % rotation.schedule.length + rotation.schedule.length) % rotation.schedule.length;
  const [s1Slot, s2Slot, s3Slot] = rotation.schedule[scheduleIndex]; // 1-indexed slots
  return {
    letterNumber,
    scheduleIndex,
    scheduleRow: [s1Slot, s2Slot, s3Slot],
    s1: rotation.sections.s1[s1Slot - 1],
    s2: rotation.sections.s2[s2Slot - 1],
    s3: rotation.sections.s3[s3Slot - 1],
  };
}

// Compute scheduled send date for a given letter number.
function scheduledSendDate(letterNumber, rotation) {
  const offsetWeeks = letterNumber - rotation.anchorLetterNumber;
  return addDays(rotation.anchorDate, offsetWeeks * rotation.cadenceDays);
}

// Infer the next letter number to generate. Scans briefs/ for existing config
// files, finds the max letterNumber present, and returns max + 1. If none exist,
// returns anchorLetterNumber.
function inferNextLetterNumber(rotation) {
  if (!fs.existsSync(briefsDir)) return rotation.anchorLetterNumber;
  const configFiles = fs.readdirSync(briefsDir).filter(f => f.endsWith('-config.json'));

  let maxLetterSeen = rotation.anchorLetterNumber - 1;
  for (const f of configFiles) {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(briefsDir, f), 'utf8'));
      if (typeof data.letterNumber === 'number' && data.letterNumber > maxLetterSeen) {
        maxLetterSeen = data.letterNumber;
      }
    } catch { /* ignore bad files */ }
  }
  // If no config files had letterNumber recorded (pre-rotation legacy files),
  // anchor the first run at anchorLetterNumber + (existing file count) so
  // existing 2026-04-17-config.json counts as letter 1 retroactively.
  if (maxLetterSeen < rotation.anchorLetterNumber && configFiles.length > 0) {
    return rotation.anchorLetterNumber + configFiles.length;
  }
  return maxLetterSeen + 1;
}

// Append one entry to rotation-log.json. Creates the file if absent.
function appendRotationLog(entry) {
  let log = [];
  if (fs.existsSync(rotationLogPath)) {
    try {
      log = JSON.parse(fs.readFileSync(rotationLogPath, 'utf8'));
      if (!Array.isArray(log)) log = [];
    } catch {
      log = [];
    }
  }
  log.push(entry);
  fs.writeFileSync(rotationLogPath, JSON.stringify(log, null, 2));
}

// Print upcoming rotation rows.
function printSchedule(rotation, count = 16, startLetter) {
  const firstLetter = startLetter ?? inferNextLetterNumber(rotation);
  console.log(`\nRotation schedule (anchor: letter ${rotation.anchorLetterNumber} = ${rotation.anchorDate}, weekly):\n`);
  console.log('Letter | Send date  | S1                         | S2                        | S3');
  console.log('-------|------------|----------------------------|---------------------------|----------------------------');
  for (let n = firstLetter; n < firstLetter + count; n++) {
    const r = resolveRotationForLetter(n, rotation);
    const d = scheduledSendDate(n, rotation);
    const s1Label = (config.topics[r.s1]?.label || r.s1).padEnd(26).slice(0, 26);
    const s2Label = (config.topics[r.s2]?.label || r.s2).padEnd(25).slice(0, 25);
    const s3Label = (config.topics[r.s3]?.label || r.s3).padEnd(26).slice(0, 26);
    console.log(`${String(n).padStart(6)} | ${d} | ${s1Label} | ${s2Label} | ${s3Label}`);
  }
  console.log('');
}

// Interactive topic picker
async function pickTopics(options = {}) {
  const rotation = config.rotation;
  const { override, letterOverride } = options;

  let letterNumber, s1, s2, s3, scheduleRow, pickMode;

  if (override) {
    // Interactive menu — legacy behavior, for one-off breaking stories.
    const s1Keys = rotation.sections.s1;
    const s2Keys = rotation.sections.s2;
    const s3Keys = rotation.sections.s3;

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    function buildMenu(keys) {
      return keys.map((k, i) => `  ${i + 1}. ${config.topics[k].label}`).join('\n');
    }

    async function pickFromGroup(label, keys) {
      while (true) {
        const answer = await promptMenu(rl, `\n${label}\n${buildMenu(keys)}\nEnter number: `);
        const n = parseInt(answer, 10);
        if (!isNaN(n) && n >= 1 && n <= keys.length) {
          console.log(`Selected: ${config.topics[keys[n - 1]].label}`);
          return { key: keys[n - 1], slot: n };
        }
        console.log(`Invalid choice. Please enter a number between 1 and ${keys.length}.`);
      }
    }

    console.log('\n=== PsychoPharmRef Newsletter — Manual Topic Override ===');
    const s1Pick = await pickFromGroup('Section 1 (News & Regulatory):', s1Keys);
    const s2Pick = await pickFromGroup('Section 2 (Educational / Evidence):', s2Keys);
    const s3Pick = await pickFromGroup('Section 3 (Deep Dive):', s3Keys);
    rl.close();

    letterNumber = letterOverride ?? inferNextLetterNumber(rotation);
    s1 = s1Pick.key; s2 = s2Pick.key; s3 = s3Pick.key;
    scheduleRow = [s1Pick.slot, s2Pick.slot, s3Pick.slot];
    pickMode = 'manual-override';
  } else {
    // Schedule-driven default.
    letterNumber = letterOverride ?? inferNextLetterNumber(rotation);
    const r = resolveRotationForLetter(letterNumber, rotation);
    s1 = r.s1; s2 = r.s2; s3 = r.s3;
    scheduleRow = r.scheduleRow;
    pickMode = 'schedule';
  }

  const sendDate = scheduledSendDate(letterNumber, rotation);
  const configData = {
    date: sendDate,
    letterNumber,
    scheduleRow,
    pickMode,
    s1, s2, s3,
  };

  const outPath = path.join(briefsDir, `${sendDate}-config.json`);
  fs.writeFileSync(outPath, JSON.stringify(configData, null, 2));

  appendRotationLog({
    letterNumber,
    date: sendDate,
    s1, s2, s3,
    scheduleRow,
    pickMode,
    pickedAt: new Date().toISOString(),
  });

  console.log(`\nLetter ${letterNumber} (send date ${sendDate}) — ${pickMode}`);
  console.log(`  S1: ${config.topics[s1]?.label || s1}`);
  console.log(`  S2: ${config.topics[s2]?.label || s2}`);
  console.log(`  S3: ${config.topics[s3]?.label || s3}`);
  console.log(`\nConfig saved to ${outPath}`);
  console.log('Next step: node newsletter/generate.js --research');
}

// Research step: fetch briefs for all 3 sections
async function runResearch() {
  validateEnv();

  const configPath = findLatestConfig();
  if (!configPath) {
    console.error('No config file found. Run --pick-topics first.');
    process.exit(1);
  }

  const weekConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const { date, s1, s2, s3 } = weekConfig;
  console.log(`\nResearching topics for ${date}: ${s1} | ${s2} | ${s3}`);

  // Load blog index for linker (optional — skip if not built yet)
  let corpus = null;
  let blogIndex = [];
  if (fs.existsSync(blogIndexPath)) {
    blogIndex = JSON.parse(fs.readFileSync(blogIndexPath, 'utf8'));
    corpus = buildCorpus(blogIndexPath);
  } else {
    console.warn('Warning: blog-index.json not found. Run build-blog-index.js for blog linking.');
  }

  const sections = [
    { key: s1, label: 'S1', outFile: `${date}-s1-brief.json` },
    { key: s2, label: 'S2', outFile: `${date}-s2-brief.json` },
    { key: s3, label: 'S3', outFile: `${date}-s3-brief.json` },
  ];

  const fetchPromises = sections.map(async (sec, idx) => {
    console.log(`[${idx + 1}/3] Fetching ${sec.label} (${sec.key})...`);
    const topicConfig = config.topics[sec.key];
    if (!topicConfig) {
      return { key: sec.key, sources: [], warnings: [`Unknown topic key: ${sec.key}`] };
    }

    const handlerName = topicConfig.handler;
    const handlerFn = dispatch[sec.key];
    if (!handlerFn) {
      return { key: sec.key, sources: [], warnings: [`No dispatch handler for ${sec.key} (expected ${handlerName})`] };
    }

    const brief = await handlerFn(sec.key, config);
    return brief;
  });

  const results = await Promise.allSettled(fetchPromises);

  // Collect verification results across all 3 sections so we can report once.
  const verificationResults = [];

  for (let i = 0; i < sections.length; i++) {
    const sec = sections[i];
    let brief;

    if (results[i].status === 'fulfilled') {
      brief = results[i].value;
    } else {
      console.error(`[${i + 1}/3] ${sec.label} fetch failed: ${results[i].reason}`);
      brief = {
        topic: sec.key,
        sources: [],
        relevantBlogPosts: [],
        warnings: [`Fetch failed: ${results[i].reason?.message || results[i].reason}`],
      };
    }

    // Run blog linker
    if (corpus && blogIndex.length > 0) {
      const query = [brief.topic, ...((brief.sources || []).map(s => s.excerpt || ''))].join(' ');
      brief.relevantBlogPosts = findRelevantPosts(query, corpus, blogIndex, config.blogSimilarityThreshold);
      console.log(`  Blog posts linked for ${sec.label}: ${brief.relevantBlogPosts.length}`);
    } else {
      brief.relevantBlogPosts = brief.relevantBlogPosts || [];
    }

    // ── xAI/Grok cross-check (added 2026-04-26; mode: annotate-only) ──────
    // Annotate the brief with per-source verdicts; do NOT halt on disagreement.
    // Disagreements are surfaced (a) on each source as `xaiVerdict`, (b) in a
    // top-level `xaiConflicts` array on the brief, and (c) in sidecar
    // verification.{json,txt} files. The pipeline continues so Jerad can
    // review the conflicts at draft time and decide what to do.
    if (brief.sources && brief.sources.length > 0) {
      console.log(`  Validating ${sec.label} via xAI...`);
      const topicConf = config.topics[sec.key] || {};
      const verifyResult = await factCheckBrief(brief, {
        sectionLabel: `${sec.label}: ${topicConf.label || sec.key}`,
        focusArea: topicConf.focusArea || '',
      });

      // Annotate each source with its verdict (matched by sourceIndex 1-based).
      const verdictByIndex = new Map(verifyResult.verdicts.map(v => [v.sourceIndex, v]));
      brief.sources = brief.sources.map((s, i) => {
        const v = verdictByIndex.get(i + 1);
        if (!v) return s;
        return {
          ...s,
          xaiVerdict: {
            verdict: v.verdict,
            severity: v.severity,
            reasoning: v.reasoning,
          },
        };
      });

      // Top-level summary of disagreements (empty array if all clean).
      brief.xaiConflicts = verifyResult.verdicts
        .filter(v => v.verdict === 'disagree')
        .map(v => ({
          sourceIndex: v.sourceIndex,
          sourceTitle: v.sourceTitle,
          sourceUrl: v.sourceUrl,
          severity: v.severity,
          reasoning: v.reasoning,
        }));
      brief.xaiSummary = verifyResult.summary || '';
      brief.xaiModel = verifyResult.model || null;

      const reportText = formatReport(`${sec.label}: ${topicConf.label || sec.key}`, verifyResult);
      const reportPath = path.join(briefsDir, `${date}-${sec.label.toLowerCase()}-verification.txt`);
      const jsonPath = path.join(briefsDir, `${date}-${sec.label.toLowerCase()}-verification.json`);
      fs.writeFileSync(reportPath, reportText);
      fs.writeFileSync(jsonPath, JSON.stringify(verifyResult, null, 2));

      if (verifyResult.ok) {
        console.log(`  ✓ ${sec.label} validated (${verifyResult.verdicts.length} verdict(s), 0 disagreements)`);
      } else {
        console.warn(`  ⚠ ${sec.label} ${verifyResult.disagreementCount || 0} disagreement(s) annotated — see ${reportPath}`);
      }
      verificationResults.push({ section: sec.label, key: sec.key, result: verifyResult, reportPath });
    } else {
      console.log(`  (no sources to validate for ${sec.label})`);
      brief.xaiConflicts = [];
      verificationResults.push({ section: sec.label, key: sec.key, result: { ok: true, verdicts: [], summary: 'no sources' } });
    }

    // Write the (now annotated) brief to disk.
    const outPath = path.join(briefsDir, sec.outFile);
    fs.writeFileSync(outPath, JSON.stringify(brief, null, 2));
    console.log(`  Brief saved: ${outPath}`);
    if (brief.warnings && brief.warnings.length > 0) {
      brief.warnings.forEach(w => console.warn(`  Warning: ${w}`));
    }
  }

  // ── Conflicts summary (annotate-only mode: never blocks, always reports) ─
  const flagged = verificationResults.filter(v => !v.result.ok);
  if (flagged.length > 0) {
    console.warn('\n══════════════════════════════════════════════════════════════');
    console.warn('  xAI CROSS-CHECK — disagreements annotated (pipeline did NOT halt)');
    console.warn('══════════════════════════════════════════════════════════════');
    for (const b of flagged) {
      console.warn(`\n${formatReport(`${b.section}: ${b.key}`, b.result)}`);
    }
    console.warn('\nReview the flagged sources before --draft. To act on a flag:');
    console.warn('  • Edit the affected brief JSON to remove or correct the source, or');
    console.warn('  • Leave it in (each source carries its xaiVerdict for your review).');
  } else {
    console.log('\nxAI cross-check: all sections clean (no disagreements).');
  }

  // ── Recency probe (annotate-only, what's-missing coverage check) ────────
  // The brief / draft fact-checks grade claims that ARE made. They cannot
  // catch what's MISSING. surveyRecency closes that gap by asking Grok-with-
  // web_search what major psych-pharm developments occurred recently, so the
  // human reviewer can decide whether anything should be folded into a
  // section before --draft.
  //
  // Window anchoring (revised 2026-04-27): the probe must be anchored to
  // REAL dates, not letter dates. Forward-scheduled letters point at future
  // dates; web_search obviously can't find events that haven't been
  // published yet. So `until` defaults to today and `since` defaults to 7
  // days ago. Override via RECENCY_SINCE / RECENCY_UNTIL env vars when you
  // want to widen the window (e.g. catching a backlog after time off).
  //
  // Annotate-only: skipped if XAI_API_KEY missing or RECENCY_PROBE=0. Never
  // blocks; never auto-modifies briefs.
  const recencyEnabled = process.env.RECENCY_PROBE !== '0' && !!process.env.XAI_API_KEY;
  if (recencyEnabled) {
    const today = new Date().toISOString().slice(0, 10);
    const until = process.env.RECENCY_UNTIL || today;
    const defaultSince = (() => {
      const d = new Date(until + 'T00:00:00Z');
      d.setUTCDate(d.getUTCDate() - 7);
      return d.toISOString().slice(0, 10);
    })();
    const since = process.env.RECENCY_SINCE || defaultSince;
    console.log(`\nRunning recency probe (xAI + web_search, since=${since}, until=${until})…`);
    try {
      const recency = await surveyRecency(since, { until, timeoutMs: 90000 });
      // Sidecar is named after the letter date so it lives next to the
      // brief, even though the probe window itself is anchored to today.
      const probeBase = path.join(briefsDir, `${weekConfig.date}-recency-probe`);
      fs.writeFileSync(`${probeBase}.json`, JSON.stringify(recency, null, 2));
      fs.writeFileSync(`${probeBase}.txt`, formatRecencyReport(recency) + '\n');
      const total = (recency.items || []).length;
      const high = (recency.items || []).filter(i => i.relevance === 'high').length;
      console.log(`  ${total} item(s) returned (${high} high-relevance) → ${path.basename(probeBase)}.txt`);
      // Surface the high-relevance headlines on the console so flag-worthy
      // items don't get buried in the sidecar.
      (recency.items || [])
        .filter(i => i.relevance === 'high')
        .forEach(i => console.log(`    [${i.category}] ${i.date || '(no date)'} — ${i.title}`));
      if (!recency.ok) console.warn(`  Probe returned error: ${recency.error || recency.summary}`);
    } catch (err) {
      console.warn(`  Recency probe threw: ${err.message}`);
    }
  } else if (!process.env.XAI_API_KEY) {
    console.log('\n(Recency probe skipped: XAI_API_KEY not set.)');
  } else {
    console.log('\n(Recency probe skipped: RECENCY_PROBE=0.)');
  }

  console.log('\nResearch complete. Review brief files before running --draft.');
  console.log('Next step: node newsletter/generate.js --draft');
}

// Draft step: generate newsletter HTML
async function runDraft() {
  validateEnv();

  const configPath = findLatestConfig();
  if (!configPath) {
    console.error('No config file found. Run --pick-topics first.');
    process.exit(1);
  }

  const weekConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const { date, s1, s2, s3 } = weekConfig;

  // Check all brief files exist
  const briefPaths = {
    s1: path.join(briefsDir, `${date}-s1-brief.json`),
    s2: path.join(briefsDir, `${date}-s2-brief.json`),
    s3: path.join(briefsDir, `${date}-s3-brief.json`),
  };

  const missing = Object.entries(briefPaths).filter(([, p]) => !fs.existsSync(p));
  if (missing.length > 0) {
    console.error('Missing brief files:');
    missing.forEach(([k, p]) => console.error(`  ${k}: ${p}`));
    console.error('\nRun --research first to generate briefs.');
    process.exit(1);
  }

  const briefs = {
    s1: JSON.parse(fs.readFileSync(briefPaths.s1, 'utf8')),
    s2: JSON.parse(fs.readFileSync(briefPaths.s2, 'utf8')),
    s3: JSON.parse(fs.readFileSync(briefPaths.s3, 'utf8')),
  };

  console.log(`\nDrafting newsletter for ${date}: ${s1} | ${s2} | ${s3}`);

  // Draft all 3 sections in parallel along with the 4-field newsletter meta.
  const [meta, r1, r2, r3] = await Promise.all([
    generateNewsletterMeta(
      config.topics[s1]?.label || s1,
      config.topics[s2]?.label || s2,
      config.topics[s3]?.label || s3,
      config
    ),
    draftSection(s1, briefs.s1, config, { sendDate: date }).catch(e => `<!-- DRAFT FAILED: ${e.message} — fill manually -->`),
    draftSection(s2, briefs.s2, config, { sendDate: date }).catch(e => `<!-- DRAFT FAILED: ${e.message} — fill manually -->`),
    draftSection(s3, briefs.s3, config, { sendDate: date }).catch(e => `<!-- DRAFT FAILED: ${e.message} — fill manually -->`),
  ]);

  const blogPostsPerSection = [
    briefs.s1.relevantBlogPosts || [],
    briefs.s2.relevantBlogPosts || [],
    briefs.s3.relevantBlogPosts || [],
  ];

  // Pass briefs through so assembleHtml can render xAI conflict banners
  // (review-only; stripped before the body is copied to Beehiiv).
  const html = assembleHtml([r1, r2, r3], blogPostsPerSection, config.cta, meta, date, [briefs.s1, briefs.s2, briefs.s3]);

  const draftPath = path.join(draftsDir, `${date}-draft.html`);
  fs.writeFileSync(draftPath, html);
  console.log(`\nDraft saved: ${draftPath}`);
  console.log(`Title:    ${meta.title}`);
  console.log(`Subtitle: ${meta.subtitle}`);
  console.log(`Subject:  ${meta.subject}`);
  console.log(`Preview:  ${meta.previewText}`);

  // Save all four meta fields alongside draft for --post step
  const metaPath = path.join(draftsDir, `${date}-meta.json`);
  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));

  // ──────────────────────────────────────────────────────────────────────
  // Post-draft fact-check (annotate-only).
  //
  // factCheckBrief grades brief SOURCES; it has nothing to grade when a
  // section falls back to evergreen drafting (no sources). factCheckDraft
  // closes that gap by grading the rendered prose itself, with web_search
  // grounding so currency claims (REMS still in force? approval still
  // active? trial result final?) are checked against current sources
  // rather than Grok's training cutoff.
  //
  // Annotate-only: this never blocks. If XAI_API_KEY is missing or the
  // user sets DRAFT_FACT_CHECK=0, this section is skipped entirely.
  // ──────────────────────────────────────────────────────────────────────
  const draftFactCheckEnabled = process.env.DRAFT_FACT_CHECK !== '0' && !!process.env.XAI_API_KEY;
  if (draftFactCheckEnabled) {
    console.log('\nRunning post-draft fact-check (xAI + web_search) on each section…');
    const sectionInputs = [
      { key: s1, label: config.topics[s1]?.label || s1, html: r1 },
      { key: s2, label: config.topics[s2]?.label || s2, html: r2 },
      { key: s3, label: config.topics[s3]?.label || s3, html: r3 },
    ];
    const checks = await Promise.all(sectionInputs.map(async (s) => {
      const sectionLabel = `${s.key} — ${s.label} (${date})`;
      try {
        const result = await factCheckDraft(sectionLabel, s.html, {
          webSearch: true,
          // Slightly higher timeout than source-grader — web_search adds latency.
          timeoutMs: 90000,
        });
        return { ...s, sectionLabel, result };
      } catch (err) {
        return {
          ...s,
          sectionLabel,
          result: {
            ok: false,
            verdicts: [],
            summary: `factCheckDraft threw: ${err.message}`,
            error: 'exception',
          },
        };
      }
    }));

    let totalDisagreements = 0;
    for (const c of checks) {
      const base = path.join(draftsDir, `${date}-${c.key}-draft-verification`);
      fs.writeFileSync(`${base}.json`, JSON.stringify(c.result, null, 2));
      fs.writeFileSync(`${base}.txt`, formatDraftReport(c.sectionLabel, c.result) + '\n');
      const dCount = c.result.disagreementCount || 0;
      totalDisagreements += dCount;
      const tag = dCount > 0 ? `${dCount} flag${dCount === 1 ? '' : 's'}` : 'clean';
      console.log(`  ${c.key}: ${tag} → ${path.basename(base)}.txt`);
      if (dCount > 0 && Array.isArray(c.result.verdicts)) {
        c.result.verdicts
          .filter(v => v.verdict === 'disagree')
          .forEach(v => console.log(`    [${v.severity}] ${v.claim.slice(0, 140)}`));
      }
    }
    if (totalDisagreements > 0) {
      console.log(`\n  ${totalDisagreements} draft-level disagreement(s) flagged. Review the .txt sidecars before --post.`);
    } else {
      console.log('  All three sections passed the draft fact-check.');
    }
  } else if (!process.env.XAI_API_KEY) {
    console.log('\n(Post-draft fact-check skipped: XAI_API_KEY not set.)');
  } else {
    console.log('\n(Post-draft fact-check skipped: DRAFT_FACT_CHECK=0.)');
  }

  console.log('\nNext step: Review the draft, then run node newsletter/generate.js --post');
}

// ──────────────────────────────────────────────────────────────────────────
// Post step — handoff to Beehiiv's web UI.
//
// Beehiiv gates POST /v2/publications/{id}/posts to the Enterprise plan. On
// Launch/Scale/Max the API call always 403s with "This endpoint is only
// available on the enterprise plan". Rather than keep banging against that,
// --post now runs a fast manual-paste handoff:
//
//   1. Copy the HTML to the system clipboard (pbcopy / xclip / clip).
//   2. Print the subject and preview text so they can be pasted into Beehiiv.
//   3. Open the Beehiiv compose page in the default browser.
//
// If you ever upgrade to Enterprise, use --api-post to attempt the API path
// via postDraft() in lib/post.js.
// ──────────────────────────────────────────────────────────────────────────

import { spawn, spawnSync } from 'child_process';

// Copy a string to the OS clipboard. Returns true on success.
function copyToClipboard(text) {
  const platform = process.platform;
  let cmd, args;
  if (platform === 'darwin') {
    cmd = 'pbcopy'; args = [];
  } else if (platform === 'win32') {
    cmd = 'clip'; args = [];
  } else {
    // Linux / other — try xclip, fall back to wl-copy
    cmd = 'xclip'; args = ['-selection', 'clipboard'];
  }
  try {
    const proc = spawnSync(cmd, args, { input: text, encoding: 'utf8' });
    if (proc.error || proc.status !== 0) {
      if (platform !== 'darwin' && platform !== 'win32') {
        // Linux fallback: wl-copy for Wayland
        const alt = spawnSync('wl-copy', [], { input: text, encoding: 'utf8' });
        return !alt.error && alt.status === 0;
      }
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

// Open a URL or file in the default browser/application. Non-blocking.
function openInBrowser(target) {
  const platform = process.platform;
  let cmd, args;
  if (platform === 'darwin') { cmd = 'open'; args = [target]; }
  else if (platform === 'win32') { cmd = 'cmd'; args = ['/c', 'start', '', target]; }
  else { cmd = 'xdg-open'; args = [target]; }
  try {
    const proc = spawn(cmd, args, { stdio: 'ignore', detached: true });
    proc.unref();
    return true;
  } catch {
    return false;
  }
}

async function runPost(options = {}) {
  // Only require env vars used by the handoff path (none) or API path.
  // Draft/post metadata just need the filesystem.

  const configPath = findLatestConfig();
  if (!configPath) {
    console.error('No config file found.');
    process.exit(1);
  }

  const weekConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const { date } = weekConfig;

  const draftPath = path.join(draftsDir, `${date}-draft.html`);
  const metaPath = path.join(draftsDir, `${date}-meta.json`);

  if (!fs.existsSync(draftPath)) {
    console.error(`Draft not found: ${draftPath}`);
    console.error('Run --draft first.');
    process.exit(1);
  }

  const htmlContent = fs.readFileSync(draftPath, 'utf8');
  // Body-only HTML for Beehiiv's HTML editor (strips the copy-paste header block).
  const bodyHtml = extractBodyOnly(htmlContent);

  // Default meta in case metaPath is missing or older-format.
  let meta = {
    title: `PsychoPharmRef — ${date}`,
    subtitle: '',
    subject: `PsychoPharmRef Weekly — ${date}`,
    previewText: 'This week in psychopharmacology.',
  };

  if (fs.existsSync(metaPath)) {
    const loaded = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    meta = {
      title: loaded.title || loaded.subject || meta.title,
      subtitle: loaded.subtitle || meta.subtitle,
      subject: loaded.subject || meta.subject,
      previewText: loaded.previewText || meta.previewText,
    };
  }

  // ── API path (only if explicitly requested; requires Enterprise plan) ──
  if (options.api) {
    validateEnv();
    console.log(`\nPosting draft to Beehiiv via API...`);
    console.log(`Title: ${meta.title}`);
    try {
      const result = await postDraft(bodyHtml, meta.subject, meta.previewText, {
        ...config,
        beehiivPublicationId: process.env.BEEHIIV_PUBLICATION_ID,
      });
      console.log(`\nDraft created: ${result.draftUrl}`);
      console.log('Open the URL above to review and send in Beehiiv.');
      return;
    } catch (err) {
      console.error(`\nBeehiiv API post failed: ${err.message}`);
      console.error('(If you see a 403, the Create Post endpoint requires the Enterprise plan.)');
      console.error('Falling back to handoff mode...\n');
      // fall through to handoff
    }
  }

  // ── Handoff path (default): clipboard gets body-only HTML ──
  const clipboardOk = copyToClipboard(bodyHtml);
  const composeUrl = 'https://app.beehiiv.com/?action=new_post';
  const browserOk = openInBrowser(composeUrl);

  console.log('\n=== Beehiiv Handoff ===');
  console.log(`Draft file:    ${draftPath}`);
  console.log('');
  console.log('Copy-paste fields for Beehiiv:');
  console.log(`  Title:         ${meta.title}`);
  console.log(`  Subtitle:      ${meta.subtitle}`);
  console.log(`  Email subject: ${meta.subject}`);
  console.log(`  Preview text:  ${meta.previewText}`);
  console.log('');
  console.log(clipboardOk
    ? '✓ Body HTML (without the copy-paste header) copied to clipboard — paste into Beehiiv\'s HTML editor.'
    : '✗ Clipboard copy failed — open the draft file above and copy the body manually.');
  console.log(browserOk
    ? '✓ Opening Beehiiv compose page in your browser.'
    : `✗ Could not open browser. Visit: ${composeUrl}`);
  console.log('');
  console.log('Set title, subtitle, email subject, preview → paste HTML body → review → send.');
}

// Main entrypoint
const args = process.argv.slice(2);

// Parse numeric option: --letter N / --count N
function numArg(flag) {
  const i = args.indexOf(flag);
  if (i === -1) return undefined;
  const n = parseInt(args[i + 1], 10);
  return Number.isFinite(n) ? n : undefined;
}

const override = args.includes('--override');
const letterOverride = numArg('--letter');

if (args.includes('--pick-topics')) {
  pickTopics({ override, letterOverride }).catch(err => { console.error(err); process.exit(1); });
} else if (args.includes('--schedule')) {
  const count = numArg('--count') ?? 16;
  printSchedule(config.rotation, count, letterOverride);
} else if (args.includes('--research')) {
  runResearch().catch(err => { console.error(err); process.exit(1); });
} else if (args.includes('--draft')) {
  runDraft().catch(err => { console.error(err); process.exit(1); });
} else if (args.includes('--post')) {
  runPost({ api: args.includes('--api') }).catch(err => { console.error(err); process.exit(1); });
} else if (args.includes('--api-post')) {
  runPost({ api: true }).catch(err => { console.error(err); process.exit(1); });
} else {
  console.log('Usage: node newsletter/generate.js [command] [options]');
  console.log('');
  console.log('Commands:');
  console.log('  --pick-topics             Pick next letter per rotation schedule (default)');
  console.log('  --pick-topics --override  Interactive menu instead of schedule');
  console.log('  --pick-topics --letter N  Force a specific letter number');
  console.log('  --schedule                Print upcoming 16 letters');
  console.log('  --schedule --count N      Print N upcoming letters');
  console.log('  --schedule --letter N     Start printing at letter N');
  console.log('  --research                Fetch sources and build research briefs');
  console.log('  --draft                   Generate newsletter draft via Claude API');
  console.log('  --post                    Copy HTML to clipboard + open Beehiiv compose page');
  console.log('  --post --api              Try Beehiiv API first (requires Enterprise plan),');
  console.log('                            fall back to clipboard handoff on failure');
  process.exit(0);
}

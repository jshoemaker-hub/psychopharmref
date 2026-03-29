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
import { draftSection, generateSubjectAndPreview, assembleHtml } from './lib/draft.js';
import { postDraft } from './lib/post.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const briefsDir = path.join(__dirname, 'briefs');
const draftsDir = path.join(__dirname, 'drafts');
const blogIndexPath = path.join(__dirname, 'blog-index.json');

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

// Validate required environment variables
function validateEnv() {
  const required = [
    'ANTHROPIC_API_KEY',
    'PERPLEXITY_API_KEY',
    'BEEHIIV_API_KEY',
    'BEEHIIV_PUBLICATION_ID',
    'CONGRESS_API_KEY',
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

// Interactive topic picker
async function pickTopics() {
  const s1Keys = Object.keys(config.topics).filter(k => config.topics[k].section === 's1');
  const s2Keys = Object.keys(config.topics).filter(k => config.topics[k].section === 's2');
  const s3Keys = Object.keys(config.topics).filter(k => config.topics[k].section === 's3');

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
        return keys[n - 1];
      }
      console.log(`Invalid choice. Please enter a number between 1 and ${keys.length}.`);
    }
  }

  console.log('\n=== PsychoPharmRef Newsletter — Topic Selection ===');
  const s1 = await pickFromGroup('Section 1 (News & Regulatory) — pick one:', s1Keys);
  const s2 = await pickFromGroup('Section 2 (Educational / Evidence) — pick one:', s2Keys);
  const s3 = await pickFromGroup('Section 3 (Deep Dive) — pick one:', s3Keys);
  rl.close();

  const date = todayStr();
  const configData = { date, s1, s2, s3 };
  const outPath = path.join(briefsDir, `${date}-config.json`);
  fs.writeFileSync(outPath, JSON.stringify(configData, null, 2));
  console.log(`\nConfig saved to ${outPath}`);
  console.log(`Topics: ${s1} | ${s2} | ${s3}`);
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

    const outPath = path.join(briefsDir, sec.outFile);
    fs.writeFileSync(outPath, JSON.stringify(brief, null, 2));
    console.log(`  Brief saved: ${outPath}`);
    if (brief.warnings && brief.warnings.length > 0) {
      brief.warnings.forEach(w => console.warn(`  Warning: ${w}`));
    }
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

  // Draft all 3 sections in parallel along with subject/preview
  const [subjectData, r1, r2, r3] = await Promise.all([
    generateSubjectAndPreview(
      config.topics[s1]?.label || s1,
      config.topics[s2]?.label || s2,
      config.topics[s3]?.label || s3,
      config
    ),
    draftSection(s1, briefs.s1, config).catch(e => `<!-- DRAFT FAILED: ${e.message} — fill manually -->`),
    draftSection(s2, briefs.s2, config).catch(e => `<!-- DRAFT FAILED: ${e.message} — fill manually -->`),
    draftSection(s3, briefs.s3, config).catch(e => `<!-- DRAFT FAILED: ${e.message} — fill manually -->`),
  ]);

  const blogPostsPerSection = [
    briefs.s1.relevantBlogPosts || [],
    briefs.s2.relevantBlogPosts || [],
    briefs.s3.relevantBlogPosts || [],
  ];

  const html = assembleHtml([r1, r2, r3], blogPostsPerSection, config.cta);

  const draftPath = path.join(draftsDir, `${date}-draft.html`);
  fs.writeFileSync(draftPath, html);
  console.log(`\nDraft saved: ${draftPath}`);
  console.log(`Subject: ${subjectData.subject}`);
  console.log(`Preview: ${subjectData.previewText}`);

  // Save subject/preview alongside draft for --post step
  const metaPath = path.join(draftsDir, `${date}-meta.json`);
  fs.writeFileSync(metaPath, JSON.stringify(subjectData, null, 2));

  console.log('\nNext step: Review the draft, then run node newsletter/generate.js --post');
}

// Post step: send draft to Beehiiv
async function runPost() {
  validateEnv();

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
  let subject = `PsychoPharmRef Weekly — ${date}`;
  let previewText = 'This week in psychopharmacology.';

  if (fs.existsSync(metaPath)) {
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    subject = meta.subject || subject;
    previewText = meta.previewText || previewText;
  }

  console.log(`\nPosting draft to Beehiiv...`);
  console.log(`Subject: ${subject}`);

  try {
    const result = await postDraft(htmlContent, subject, previewText, {
      ...config,
      beehiivPublicationId: process.env.BEEHIIV_PUBLICATION_ID,
    });
    console.log(`\nDraft created: ${result.draftUrl}`);
    console.log('Open the URL above to review and send in Beehiiv.');
  } catch (err) {
    console.error(`\nBeehiiv post failed: ${err.message}`);
    console.error(`The HTML draft is saved at: ${draftPath}`);
    console.error('You can paste the HTML manually into Beehiiv\'s HTML editor as a fallback.');
    process.exit(1);
  }
}

// Main entrypoint
const args = process.argv.slice(2);

if (args.includes('--pick-topics')) {
  pickTopics().catch(err => { console.error(err); process.exit(1); });
} else if (args.includes('--research')) {
  runResearch().catch(err => { console.error(err); process.exit(1); });
} else if (args.includes('--draft')) {
  runDraft().catch(err => { console.error(err); process.exit(1); });
} else if (args.includes('--post')) {
  runPost().catch(err => { console.error(err); process.exit(1); });
} else {
  console.log('Usage: node newsletter/generate.js [--pick-topics|--research|--draft|--post]');
  console.log('');
  console.log('Steps:');
  console.log('  --pick-topics   Interactive menu to select 3 topics (S1/S2/S3)');
  console.log('  --research      Fetch sources and build research briefs');
  console.log('  --draft         Generate newsletter draft via Claude API');
  console.log('  --post          Post draft to Beehiiv (requires BEEHIIV_API_KEY)');
  process.exit(0);
}

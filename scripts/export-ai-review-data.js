#!/usr/bin/env node
/*
 * export-ai-review-data.js - build a stable, machine-readable review snapshot.
 *
 * The monthly data review uses this as a compact source bundle for AI-assisted
 * clinical freshness checks. It is intentionally read-only: it never edits app
 * data, mirrored Hugo assets, or generated blog files.
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const DEFAULT_OUT_DIR = '.review-data';
const JS_DATA_EXPORTS = [
  'RECEPTOR_GLOSSARY',
  'SYNAPTIC_BINDING',
  'RECEPTOR_COLORS',
  'RECEPTOR_LIST',
  'P450_ENZYMES',
  'PERINATAL_DATA',
  'MEDICATIONS',
  'RECEPTOR_CIRCUIT_MAP',
  'CIRCUIT_CONDITIONS_MAP',
  'FDA_SAFETY_DATA',
];

function usage() {
  return [
    'Usage: npm run export:ai-review-data -- [--out-dir <dir>] [--stdout]',
    '',
    'Options:',
    '  --out-dir <dir>  Directory for JSON/JSONL exports. Default: .review-data',
    '  --stdout         Write the JSON export to stdout instead of files',
    '  --help           Show this help text',
  ].join('\n');
}

function parseArgs(argv) {
  const options = {
    outDir: DEFAULT_OUT_DIR,
    stdout: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--stdout') {
      options.stdout = true;
    } else if (arg === '--out-dir') {
      const value = argv[i + 1];
      if (!value) {
        throw new Error('--out-dir requires a directory path');
      }
      options.outDir = value;
      i += 1;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function abs(relPath) {
  return path.join(ROOT, relPath);
}

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function rel(filePath) {
  return toPosix(path.relative(ROOT, filePath));
}

function exists(relPath) {
  return fs.existsSync(abs(relPath));
}

function readText(relPath) {
  return fs.readFileSync(abs(relPath), 'utf8');
}

function readJson(relPath, warnings) {
  try {
    return JSON.parse(readText(relPath));
  } catch (err) {
    warnings.push(`${relPath}: could not parse JSON (${err.message})`);
    return null;
  }
}

function sha256(relPath) {
  return crypto.createHash('sha256').update(fs.readFileSync(abs(relPath))).digest('hex');
}

function fileInfo(relPath) {
  if (!exists(relPath)) {
    return {
      path: relPath,
      exists: false,
    };
  }

  const stats = fs.statSync(abs(relPath));
  return {
    path: relPath,
    exists: true,
    bytes: stats.size,
    mtime: stats.mtime.toISOString(),
    sha256: sha256(relPath),
  };
}

function walkFiles(dirRel, predicate) {
  if (!exists(dirRel)) return [];

  const out = [];
  const stack = [abs(dirRel)];

  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const entryPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(entryPath);
      } else if (!predicate || predicate(entryPath)) {
        out.push(rel(entryPath));
      }
    }
  }

  return out.sort();
}

function safeGit(args) {
  try {
    return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
  } catch (_err) {
    return null;
  }
}

function loadJsData() {
  const relPath = 'js/data.js';
  const source = readText(relPath);
  const exportExpression = `\n;({ ${JS_DATA_EXPORTS.join(', ')} });`;
  return vm.runInNewContext(source + exportExpression, {}, {
    filename: relPath,
    timeout: 5000,
  });
}

function groupCount(items, keyFn) {
  return items.reduce((counts, item) => {
    const key = keyFn(item) || 'unknown';
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
}

function normalizeMedication(medication, perinatalData, fdaSafetyData) {
  return {
    id: medication.id,
    name: medication.name,
    brandName: medication.brandName || null,
    class: medication.class || null,
    category: medication.category || null,
    development: medication.development || null,
    indications: medication.indications || [],
    dosing: medication.dosing || null,
    halfLife: medication.halfLife || null,
    tmax: medication.tmax ?? null,
    p450: medication.p450 || null,
    renalImpairment: medication.renalImpairment || null,
    hepaticImpairment: medication.hepaticImpairment || null,
    geriatricDosing: medication.geriatricDosing || null,
    qtInterval: medication.qtInterval ?? null,
    proteinBinding: medication.proteinBinding ?? null,
    effects: medication.effects || null,
    receptorKi: medication.receptorKi || null,
    perinatal: perinatalData[medication.id] || null,
    fdaSafety: fdaSafetyData[medication.id] || null,
  };
}

function sourceReviewDate(source) {
  const time = Date.parse(source.last_reviewed || '');
  return Number.isNaN(time) ? Number.POSITIVE_INFINITY : time;
}

function loadClinicalScales(warnings) {
  return walkFiles('data/clinical/scales', filePath => filePath.endsWith('.json'))
    .map(filePath => {
      const scale = readJson(filePath, warnings);
      return {
        file: filePath,
        data: scale,
      };
    })
    .filter(entry => entry.data);
}

function htmlToText(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function extractHtmlTitle(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? htmlToText(match[1]) : null;
}

function loadBlogPosts(blogIndex) {
  const indexByFile = new Map((blogIndex || []).map(entry => [entry.file, entry]));
  return walkFiles('blog', filePath => filePath.endsWith('.html') && path.basename(filePath) !== 'sidebar.html')
    .map(filePath => {
      const fileName = path.basename(filePath);
      const html = readText(filePath);
      const text = htmlToText(html);
      const indexEntry = indexByFile.get(fileName) || {};
      return {
        file: filePath,
        title: indexEntry.title || extractHtmlTitle(html),
        desc: indexEntry.desc || null,
        keywords: indexEntry.keywords || [],
        snippet: indexEntry.snippet || text.slice(0, 300),
        word_count_estimate: text ? text.split(/\s+/).length : 0,
        file_info: fileInfo(filePath),
      };
    });
}

function summarizePricingFile(filePath, warnings) {
  const info = fileInfo(filePath);
  const summary = {
    file: filePath,
    file_info: info,
    parsed_json: false,
    top_level_type: null,
    record_count: null,
    sample_keys: [],
    data: null,
  };

  if (!info.exists || !filePath.endsWith('.json')) {
    return summary;
  }

  const value = readJson(filePath, warnings);
  if (value === null) return summary;

  summary.parsed_json = true;
  summary.top_level_type = Array.isArray(value) ? 'array' : typeof value;
  summary.record_count = Array.isArray(value)
    ? value.length
    : value && typeof value === 'object'
      ? Object.keys(value).length
      : null;
  summary.sample_keys = value && typeof value === 'object'
    ? Object.keys(value).slice(0, 20)
    : [];
  summary.data = value;
  return summary;
}

function makeReviewHints(medications, clinicalSources) {
  return {
    oldest_clinical_sources: [...clinicalSources]
      .sort((a, b) => sourceReviewDate(a) - sourceReviewDate(b))
      .slice(0, 20)
      .map(source => ({
        id: source.id,
        label: source.label,
        last_reviewed: source.last_reviewed || null,
        review_status: source.review_status || null,
        notes: source.notes || null,
      })),
    medications_missing_dailymed_dosing_url: medications
      .filter(med => !med.dosing || !med.dosing.citation || !med.dosing.citation.url)
      .map(med => ({ id: med.id, name: med.name, class: med.class || null })),
    medications_missing_receptor_ki: medications
      .filter(med => !med.receptorKi)
      .map(med => ({ id: med.id, name: med.name, class: med.class || null })),
    medications_with_black_box_warnings: medications
      .filter(med => med.fdaSafety && Array.isArray(med.fdaSafety.blackBoxWarnings) && med.fdaSafety.blackBoxWarnings.length)
      .map(med => ({
        id: med.id,
        name: med.name,
        warning_count: med.fdaSafety.blackBoxWarnings.length,
      })),
    perinatal_category_review_queue: medications
      .filter(med => med.perinatal && med.perinatal.pregnancy && med.perinatal.pregnancy.fdaCategory)
      .map(med => ({
        id: med.id,
        name: med.name,
        fdaCategory: med.perinatal.pregnancy.fdaCategory,
        risk: med.perinatal.pregnancy.risk || null,
      })),
  };
}

function buildJsonl(exportData) {
  const rows = [
    {
      record_type: 'metadata',
      id: exportData.schema_version,
      payload: {
        generated_at: exportData.generated_at,
        repository: exportData.repository,
        git: exportData.git,
        inventory: exportData.inventory,
      },
    },
    ...exportData.medications.map(medication => ({
      record_type: 'medication',
      id: medication.id,
      payload: medication,
    })),
    ...exportData.receptor_glossary.map(entry => ({
      record_type: 'receptor_glossary',
      id: entry.receptor,
      payload: entry,
    })),
    ...exportData.clinical_sources.map(source => ({
      record_type: 'clinical_source',
      id: source.id,
      payload: source,
    })),
    ...exportData.clinical_scales.map(scale => ({
      record_type: 'clinical_scale',
      id: scale.data.id || scale.file,
      payload: scale,
    })),
    ...exportData.blog_posts.map(post => ({
      record_type: 'blog_post',
      id: post.file,
      payload: post,
    })),
    ...exportData.pricing_files.map(file => ({
      record_type: 'pricing_file',
      id: file.file,
      payload: file,
    })),
  ];

  return rows.map(row => JSON.stringify(row)).join('\n') + '\n';
}

function buildExport() {
  const warnings = [];
  const jsData = loadJsData();
  const medications = jsData.MEDICATIONS.map(medication => {
    return normalizeMedication(medication, jsData.PERINATAL_DATA, jsData.FDA_SAFETY_DATA);
  });
  const clinicalSources = readJson('data/clinical/sources.json', warnings) || [];
  const clinicalScales = loadClinicalScales(warnings);
  const blogIndex = readJson('js/blog-index.json', warnings) || [];
  const blogPosts = loadBlogPosts(blogIndex);
  const pricingFilePaths = [
    'data/drug-skus.json',
    'data/prices.json',
    'data/cpd-prices.json',
    'data/cpd-targets.json',
    'data/hw-prices.json',
    'data/hw-targets.json',
    'data/cpd-decoded.html',
    'data/cpd-fetched.html',
    'data/page-sample.html',
    'data/view-source_https___www.costplusdrugs.com_medications_categories_mental-health_.html',
  ].filter(exists);
  const pricingFiles = pricingFilePaths.map(filePath => summarizePricingFile(filePath, warnings));

  return {
    schema_version: 'psychopharm-ai-review-data-v1',
    generated_at: new Date().toISOString(),
    repository: 'PsychoPharmRef',
    project_root: ROOT,
    git: {
      branch: safeGit(['branch', '--show-current']),
      commit: safeGit(['rev-parse', 'HEAD']),
      status_short: safeGit(['status', '--short']),
    },
    export_warnings: warnings,
    source_files: {
      core_data: fileInfo('js/data.js'),
      clinical_sources: fileInfo('data/clinical/sources.json'),
      blog_index: fileInfo('js/blog-index.json'),
      package_json: fileInfo('package.json'),
      deploy_index: fileInfo('hugo-site/static/index.html'),
    },
    inventory: {
      medications_count: medications.length,
      medications_by_category: groupCount(medications, medication => medication.category),
      medications_by_class: groupCount(medications, medication => medication.class),
      receptor_glossary_entries_count: jsData.RECEPTOR_GLOSSARY.length,
      receptor_list_count: jsData.RECEPTOR_LIST.length,
      p450_enzymes_count: jsData.P450_ENZYMES.length,
      clinical_sources_count: clinicalSources.length,
      clinical_scales_count: clinicalScales.length,
      blog_posts_count: blogPosts.length,
      blog_index_entries_count: blogIndex.length,
      pricing_files: pricingFilePaths,
    },
    review_hints: makeReviewHints(medications, clinicalSources),
    medications,
    receptor_glossary: jsData.RECEPTOR_GLOSSARY,
    synaptic_binding: jsData.SYNAPTIC_BINDING,
    receptor_colors: jsData.RECEPTOR_COLORS,
    receptor_list: jsData.RECEPTOR_LIST,
    p450_enzymes: jsData.P450_ENZYMES,
    receptor_circuit_map: jsData.RECEPTOR_CIRCUIT_MAP,
    circuit_conditions_map: jsData.CIRCUIT_CONDITIONS_MAP,
    clinical_sources: clinicalSources,
    clinical_scales: clinicalScales,
    pricing_files: pricingFiles,
    blog_posts: blogPosts,
  };
}

function writeExport(exportData, options) {
  const date = exportData.generated_at.slice(0, 10);
  const outDir = path.resolve(ROOT, options.outDir);
  fs.mkdirSync(outDir, { recursive: true });

  const json = JSON.stringify(exportData, null, 2) + '\n';
  const jsonl = buildJsonl(exportData);
  const datedJson = path.join(outDir, `psychopharm-ai-review-data-${date}.json`);
  const datedJsonl = path.join(outDir, `psychopharm-ai-review-data-${date}.jsonl`);
  const latestJson = path.join(outDir, 'psychopharm-ai-review-data-latest.json');
  const latestJsonl = path.join(outDir, 'psychopharm-ai-review-data-latest.jsonl');

  fs.writeFileSync(datedJson, json);
  fs.writeFileSync(datedJsonl, jsonl);
  fs.copyFileSync(datedJson, latestJson);
  fs.copyFileSync(datedJsonl, latestJsonl);

  return {
    datedJson: rel(datedJson),
    datedJsonl: rel(datedJsonl),
    latestJson: rel(latestJson),
    latestJsonl: rel(latestJsonl),
  };
}

function main() {
  let options;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (err) {
    console.error(err.message);
    console.error('');
    console.error(usage());
    process.exit(1);
  }

  if (options.help) {
    console.log(usage());
    return;
  }

  const exportData = buildExport();

  if (options.stdout) {
    process.stdout.write(JSON.stringify(exportData, null, 2));
    process.stdout.write('\n');
    return;
  }

  const written = writeExport(exportData, options);
  console.log('PsychoPharmRef AI review data export');
  console.log('=====================================');
  console.log(`JSON:  ${written.datedJson}`);
  console.log(`JSONL: ${written.datedJsonl}`);
  console.log(`Latest JSON:  ${written.latestJson}`);
  console.log(`Latest JSONL: ${written.latestJsonl}`);
  console.log('');
  console.log(`Medications: ${exportData.inventory.medications_count}`);
  console.log(`Clinical scales: ${exportData.inventory.clinical_scales_count}`);
  console.log(`Clinical sources: ${exportData.inventory.clinical_sources_count}`);
  console.log(`Blog posts: ${exportData.inventory.blog_posts_count}`);
  console.log(`Pricing files: ${exportData.inventory.pricing_files.length}`);

  if (exportData.export_warnings.length) {
    console.log('');
    console.log('Warnings:');
    for (const warning of exportData.export_warnings) {
      console.log(`WARN: ${warning}`);
    }
  }
}

main();

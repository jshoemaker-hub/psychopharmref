#!/usr/bin/env node
/**
 * Apply a question-bank patch to js/qbank-data.js.
 *
 * The site serves window.QBANK_DATA from js/qbank-data.js (mirrored to
 * hugo-site/static/js/qbank-data.js). This file is the source of truth;
 * it is not generated from the topic JSON files under question-bank/.
 *
 * Patch entries:
 *   { id, field, old, new }          edit one field
 *   { id, action: "delete", reason } remove the record
 *
 * A field edit is written only when the current value deep-equals `old`.
 * If the current value already deep-equals `new`, the edit is skipped.
 * Any other difference is reported and left unchanged.
 * `old: null` matches a field that is absent on the record, so a patch can
 * add source_blog_title / source_blog_url to questions that lack those keys.
 *
 * Usage:
 *   node scripts/apply-qbank-patch.js <patch.json> [--data js/qbank-data.js] [--dry-run]
 *
 * Re-runs are safe: already-applied edits count as skipped, and deletes of
 * records that are already gone count as skipped.
 */
'use strict';

const fs = require('fs');
const path = require('path');

function usage() {
  console.error('Usage: node scripts/apply-qbank-patch.js <patch.json> [--data js/qbank-data.js] [--dry-run]');
  process.exit(2);
}

function deepEqual(a, b) {
  if (a === b) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const ka = Object.keys(a);
    const kb = Object.keys(b);
    if (ka.length !== kb.length) return false;
    for (const k of ka) {
      if (!Object.prototype.hasOwnProperty.call(b, k) || !deepEqual(a[k], b[k])) return false;
    }
    return true;
  }
  return false;
}

function preview(value) {
  const s = typeof value === 'string' ? value : JSON.stringify(value);
  if (s == null) return String(s);
  return s.length > 180 ? s.slice(0, 180) + '…' : s;
}

function loadBank(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const start = raw.indexOf('[');
  const end = raw.lastIndexOf(']');
  if (start < 0 || end < start) throw new Error('No JSON array in ' + file);
  const arr = JSON.parse(raw.slice(start, end + 1));
  if (!Array.isArray(arr)) throw new Error('QBANK_DATA is not an array');
  return arr;
}

function writeBank(file, arr) {
  const text =
    '/* PsychoPharmRef Question Bank - ' + arr.length + ' Questions */\n' +
    '(function(){window.QBANK_DATA=' + JSON.stringify(arr) + ';\n})();\n';
  fs.writeFileSync(file, text);
}

function parseArgs(argv) {
  const args = { data: path.join('js', 'qbank-data.js'), dryRun: false, patch: null };
  const rest = argv.slice(2);
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a === '--dry-run') args.dryRun = true;
    else if (a === '--data') {
      args.data = rest[++i];
      if (!args.data) usage();
    } else if (a.startsWith('-')) usage();
    else if (!args.patch) args.patch = a;
    else usage();
  }
  if (!args.patch) usage();
  return args;
}

function main() {
  const args = parseArgs(process.argv);
  const patchPath = path.resolve(args.patch);
  const dataPath = path.resolve(args.data);
  const patch = JSON.parse(fs.readFileSync(patchPath, 'utf8'));
  if (!Array.isArray(patch)) throw new Error('Patch must be a JSON array');

  const arr = loadBank(dataPath);
  const before = arr.length;
  const byId = new Map();
  arr.forEach((q, i) => {
    if (!byId.has(q.id)) byId.set(q.id, []);
    byId.get(q.id).push(i);
  });

  const report = {
    patch: path.relative(process.cwd(), patchPath),
    data: path.relative(process.cwd(), dataPath),
    dryRun: args.dryRun,
    patchEntries: patch.length,
    applied: 0,
    skipped: 0,
    mismatched: 0,
    questionsBefore: before,
    appliedEdits: [],
    skippedEntries: [],
    mismatches: []
  };

  function skip(entry, reason) {
    report.skipped++;
    report.skippedEntries.push({ id: entry.id, field: entry.field || entry.action || '', reason });
  }
  function mismatch(entry, reason, current) {
    report.mismatched++;
    const row = { id: entry.id, field: entry.field || entry.action || '', reason };
    if (current !== undefined) row.current = preview(current);
    report.mismatches.push(row);
  }

  for (const entry of patch) {
    const idxs = byId.get(entry.id) || [];
    if (entry.action === 'delete') {
      if (idxs.length === 0) {
        skip(entry, 'record already absent');
        continue;
      }
      // Remove from the end so earlier indexes stay valid, then rebuild byId.
      idxs.slice().sort((a, b) => b - a).forEach(i => arr.splice(i, 1));
      report.applied++;
      report.appliedEdits.push({ id: entry.id, action: 'delete' });
      // Rebuild index map after a structural change. Deletes are rare.
      byId.clear();
      arr.forEach((q, i) => {
        if (!byId.has(q.id)) byId.set(q.id, []);
        byId.get(q.id).push(i);
      });
      continue;
    }

    if (!entry.field || !Object.prototype.hasOwnProperty.call(entry, 'old') || !Object.prototype.hasOwnProperty.call(entry, 'new')) {
      mismatch(entry, 'unrecognized patch entry');
      continue;
    }
    if (idxs.length === 0) {
      mismatch(entry, 'id not found');
      continue;
    }
    if (idxs.length > 1) {
      mismatch(entry, 'duplicate ids (' + idxs.length + '); not applied');
      continue;
    }
    const q = arr[idxs[0]];
    const hasField = Object.prototype.hasOwnProperty.call(q, entry.field);
    if (!hasField) {
      if (entry.old !== null) {
        mismatch(entry, 'field missing on record', undefined);
        continue;
      }
      if (entry.new === null) {
        skip(entry, 'already equals new');
        continue;
      }
      q[entry.field] = entry.new;
      report.applied++;
      report.appliedEdits.push({ id: entry.id, field: entry.field });
      continue;
    }
    const current = q[entry.field];
    if (deepEqual(current, entry.new)) {
      skip(entry, 'already equals new');
      continue;
    }
    if (!deepEqual(current, entry.old)) {
      mismatch(entry, 'current value does not equal old', current);
      continue;
    }
    q[entry.field] = entry.new;
    report.applied++;
    report.appliedEdits.push({ id: entry.id, field: entry.field });
  }

  const cats = new Set();
  const sources = new Set();
  let missingSource = 0;
  let bad = 0;
  arr.forEach(q => {
    if (q.usmle_category) cats.add(q.usmle_category);
    if (q.source_blog_title) sources.add(q.source_blog_title);
    else missingSource++;
    if (!Array.isArray(q.options) || q.correct_index < 0 || q.correct_index >= q.options.length) bad++;
  });

  report.questionsAfter = arr.length;
  report.deleted = before - arr.length;
  report.categories = cats.size;
  report.sourceChapters = sources.size;
  report.missingSourceTitle = missingSource;
  report.invalidCorrectIndex = bad;
  report.categoryNames = [...cats].sort();

  if (!args.dryRun) {
    writeBank(dataPath, arr);
    const mirror = path.resolve('hugo-site/static/js/qbank-data.js');
    if (fs.existsSync(path.dirname(mirror)) && path.resolve(dataPath) !== mirror) {
      writeBank(mirror, arr);
      report.mirroredTo = path.relative(process.cwd(), mirror);
    }
  }

  const summary = {
    applied: report.applied,
    skipped: report.skipped,
    mismatched: report.mismatched,
    questionsBefore: report.questionsBefore,
    questionsAfter: report.questionsAfter,
    deleted: report.deleted,
    categories: report.categories,
    sourceChapters: report.sourceChapters,
    missingSourceTitle: report.missingSourceTitle,
    invalidCorrectIndex: report.invalidCorrectIndex,
    dryRun: report.dryRun,
    mirroredTo: report.mirroredTo || null
  };
  console.log(JSON.stringify(summary, null, 2));
  if (report.mismatches.length) {
    console.log('\nMismatches:');
    report.mismatches.forEach(m => {
      console.log('- id ' + m.id + ' ' + m.field + ': ' + m.reason + (m.current ? '\n  current: ' + m.current : ''));
    });
  }
  if (report.skipped && process.argv.includes('--verbose')) {
    console.log('\nSkipped:');
    report.skippedEntries.forEach(s => {
      console.log('- id ' + s.id + ' ' + s.field + ': ' + s.reason);
    });
  }

  if (report.mismatched) process.exitCode = 1;
}

main();

#!/usr/bin/env node
/*
 * validate-clinical-data.js - validate structured clinical source files.
 *
 * This is intentionally strict for fields that affect scoring and provenance.
 * It lets the project migrate clinical tools toward data-driven rendering
 * without waiting for a full frontend rewrite.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CLINICAL_DIR = path.join(ROOT, 'data', 'clinical');
const SCALE_DIR = path.join(CLINICAL_DIR, 'scales');

const errors = [];
const passes = [];

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    errors.push(`${path.relative(ROOT, filePath)}: invalid JSON (${err.message})`);
    return null;
  }
}

function rel(filePath) {
  return path.relative(ROOT, filePath).split(path.sep).join('/');
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function expect(condition, message) {
  if (!condition) errors.push(message);
}

function loadSources() {
  const sourcePath = path.join(CLINICAL_DIR, 'sources.json');
  const sources = readJson(sourcePath);
  if (!Array.isArray(sources)) {
    errors.push('data/clinical/sources.json must be an array');
    return new Map();
  }

  const out = new Map();
  for (const source of sources) {
    expect(isNonEmptyString(source.id), 'sources.json: every source needs id');
    expect(isNonEmptyString(source.label), `sources.json:${source.id || 'unknown'} needs label`);
    expect(isNonEmptyString(source.last_reviewed), `sources.json:${source.id || 'unknown'} needs last_reviewed`);
    expect(isNonEmptyString(source.review_status), `sources.json:${source.id || 'unknown'} needs review_status`);
    if (source.id) {
      expect(!out.has(source.id), `sources.json: duplicate source id "${source.id}"`);
      out.set(source.id, source);
    }
  }

  passes.push(`Loaded ${out.size} clinical source references`);
  return out;
}

function scoreResponses(responses) {
  return responses.reduce((sum, value) => sum + value, 0);
}

function severityForScore(scale, score) {
  return scale.severity_bands.find(band => score >= band.min && score <= band.max);
}

function safetyFlagsForResponses(scale, responses) {
  return scale.items
    .filter((item, index) => {
      if (!item.safety_flag) return false;
      const response = responses[index];
      const flag = item.safety_flag;
      if (flag.trigger === 'response_greater_than') return response > flag.value;
      errors.push(`${scale.id}: unsupported safety_flag trigger "${flag.trigger}" on ${item.id}`);
      return false;
    })
    .map(item => item.id);
}

function validateBandCoverage(scale, fileRel) {
  const bands = [...scale.severity_bands].sort((a, b) => a.min - b.min);
  let expectedMin = scale.score.min;

  for (const band of bands) {
    expect(Number.isInteger(band.min), `${fileRel}: severity band "${band.label}" needs integer min`);
    expect(Number.isInteger(band.max), `${fileRel}: severity band "${band.label}" needs integer max`);
    expect(isNonEmptyString(band.label), `${fileRel}: severity band needs label`);
    expect(isNonEmptyString(band.action), `${fileRel}: severity band "${band.label}" needs action`);
    expect(band.min <= band.max, `${fileRel}: severity band "${band.label}" has min > max`);
    expect(band.min === expectedMin, `${fileRel}: severity bands must cover every score; expected min ${expectedMin}, got ${band.min}`);
    expectedMin = band.max + 1;
  }

  expect(expectedMin === scale.score.max + 1, `${fileRel}: severity bands stop at ${expectedMin - 1}; expected ${scale.score.max}`);
}

function validateScale(scale, filePath, sources) {
  const fileRel = rel(filePath);
  if (!scale) return;

  expect(isNonEmptyString(scale.id), `${fileRel}: missing id`);
  expect(isNonEmptyString(scale.tool_section_id), `${fileRel}: missing tool_section_id`);
  expect(isNonEmptyString(scale.title), `${fileRel}: missing title`);
  expect(isNonEmptyString(scale.short_title), `${fileRel}: missing short_title`);
  expect(isNonEmptyString(scale.last_reviewed), `${fileRel}: missing last_reviewed`);
  expect(Array.isArray(scale.source_ids) && scale.source_ids.length > 0, `${fileRel}: source_ids must be a non-empty array`);

  for (const sourceId of scale.source_ids || []) {
    expect(sources.has(sourceId), `${fileRel}: unknown source_id "${sourceId}"`);
  }

  expect(scale.score && scale.score.method === 'sum', `${fileRel}: score.method must be "sum"`);
  expect(Number.isInteger(scale.score && scale.score.min), `${fileRel}: score.min must be an integer`);
  expect(Number.isInteger(scale.score && scale.score.max), `${fileRel}: score.max must be an integer`);
  expect(Number.isInteger(scale.score && scale.score.item_count), `${fileRel}: score.item_count must be an integer`);

  expect(Array.isArray(scale.options) && scale.options.length > 0, `${fileRel}: options must be a non-empty array`);
  const optionValues = new Set();
  for (const option of scale.options || []) {
    expect(Number.isInteger(option.value), `${fileRel}: option values must be integers`);
    expect(isNonEmptyString(option.label), `${fileRel}: every option needs label`);
    expect(!optionValues.has(option.value), `${fileRel}: duplicate option value ${option.value}`);
    optionValues.add(option.value);
  }

  const minOption = Math.min(...optionValues);
  const maxOption = Math.max(...optionValues);
  expect(minOption === 0, `${fileRel}: option values should start at 0`);
  expect(scale.score.max === scale.score.item_count * maxOption, `${fileRel}: score.max should equal item_count * highest option`);

  expect(Array.isArray(scale.items), `${fileRel}: items must be an array`);
  expect(scale.items.length === scale.score.item_count, `${fileRel}: expected ${scale.score.item_count} items, found ${scale.items.length}`);
  const itemIds = new Set();
  scale.items.forEach((item, index) => {
    expect(isNonEmptyString(item.id), `${fileRel}: item ${index + 1} needs id`);
    expect(!itemIds.has(item.id), `${fileRel}: duplicate item id "${item.id}"`);
    itemIds.add(item.id);
    expect(item.number === index + 1, `${fileRel}: item ${item.id} number should be ${index + 1}`);
    expect(isNonEmptyString(item.text), `${fileRel}: item ${item.id} needs text`);
  });

  expect(Array.isArray(scale.severity_bands) && scale.severity_bands.length > 0, `${fileRel}: severity_bands must be a non-empty array`);
  validateBandCoverage(scale, fileRel);

  for (const vector of scale.test_vectors || []) {
    expect(Array.isArray(vector.responses), `${fileRel}: test vector "${vector.name}" needs responses array`);
    expect(vector.responses.length === scale.score.item_count, `${fileRel}: test vector "${vector.name}" response count mismatch`);
    for (const response of vector.responses) {
      expect(optionValues.has(response), `${fileRel}: test vector "${vector.name}" has invalid response ${response}`);
    }

    const score = scoreResponses(vector.responses);
    const severity = severityForScore(scale, score);
    const flags = safetyFlagsForResponses(scale, vector.responses);

    expect(score === vector.expected_score, `${fileRel}: test vector "${vector.name}" expected score ${vector.expected_score}, got ${score}`);
    expect(severity && severity.label === vector.expected_severity, `${fileRel}: test vector "${vector.name}" expected severity ${vector.expected_severity}, got ${severity ? severity.label : 'none'}`);
    expect(JSON.stringify(flags) === JSON.stringify(vector.expected_safety_flags || []), `${fileRel}: test vector "${vector.name}" safety flags mismatch`);
  }

  passes.push(`Validated ${scale.short_title} (${scale.items.length} items, ${scale.severity_bands.length} severity bands)`);
}

function main() {
  console.log('PsychoPharmRef clinical data validation');
  console.log('=======================================\n');

  const sources = loadSources();
  const scaleFiles = fs.readdirSync(SCALE_DIR)
    .filter(name => name.endsWith('.json'))
    .sort()
    .map(name => path.join(SCALE_DIR, name));

  expect(scaleFiles.length > 0, 'data/clinical/scales must contain at least one scale JSON file');

  for (const filePath of scaleFiles) {
    validateScale(readJson(filePath), filePath, sources);
  }

  for (const pass of passes) {
    console.log(`PASS: ${pass}`);
  }

  if (errors.length) {
    console.log('\nErrors');
    for (const error of errors) {
      console.log(`ERROR: ${error}`);
    }
    console.log(`\nRESULT: failed with ${errors.length} error(s).`);
    process.exit(1);
  }

  console.log('\nRESULT: clinical data checks passed.');
}

main();

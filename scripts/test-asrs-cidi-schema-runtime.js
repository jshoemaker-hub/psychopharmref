#!/usr/bin/env node
/*
 * Smoke-test ASRS and CIDI schema-backed runtime paths.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { JSDOM } = require('jsdom');

const ROOT = path.resolve(__dirname, '..');

function read(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function installBrowserStubs(window) {
  let copiedText = '';
  const requests = [];

  window.fetch = function fetchLocalJson(url) {
    const parsed = new URL(url, window.location.href);
    const relPath = parsed.pathname.replace(/^\/+/, '');
    requests.push(relPath);
    const filePath = path.join(ROOT, relPath);
    return Promise.resolve({
      ok: true,
      status: 200,
      json: function json() {
        return Promise.resolve(JSON.parse(fs.readFileSync(filePath, 'utf8')));
      },
    });
  };

  window.confirm = () => true;
  window.document.execCommand = () => true;
  Object.defineProperty(window.navigator, 'clipboard', {
    configurable: true,
    value: {
      writeText(text) {
        copiedText = text;
        return Promise.resolve();
      },
    },
  });

  return {
    requests,
    getCopiedText() {
      return copiedText;
    },
  };
}

function buildAsrsDom() {
  const inputs = [];
  for (let itemNumber = 1; itemNumber <= 18; itemNumber += 1) {
    for (let value = 0; value <= 4; value += 1) {
      const cls = itemNumber <= 6 ? 'as-a-item' : 'as-b-item';
      inputs.push(`<input type="radio" name="asrs-${itemNumber}" value="${value}" class="${cls}">`);
    }
  }

  return new JSDOM(`
    <!doctype html>
    <html>
      <body>
        <section id="asrs-tool">
          <div class="section-header"></div>
          ${inputs.join('\n')}
          <span id="as-parta-count">&#8212;</span>
          <span id="as-parta-result">&#8212;</span>
          <span id="as-freq-0">&#8212;</span>
          <span id="as-freq-1">&#8212;</span>
          <span id="as-freq-2">&#8212;</span>
          <span id="as-freq-3">&#8212;</span>
          <span id="as-freq-4">&#8212;</span>
          <button id="as-report-btn" type="button">Generate Report</button>
          <button id="as-reset-btn" type="button">Reset</button>
        </section>
      </body>
    </html>
  `, {
    url: 'https://psychopharmref.test/',
    runScripts: 'outside-only',
  });
}

function buildCidiDom() {
  const symptomIds = [
    'irritability',
    'restlessness',
    'disinhibition',
    'grandiosity',
    'goal-directed',
    'concentration',
    'racing',
    'sleep',
    'spending',
  ];
  const symptoms = symptomIds.map(id => `<input type="checkbox" name="ci-symptoms" value="${id}">`);

  return new JSDOM(`
    <!doctype html>
    <html>
      <body>
        <section id="cidi-tool">
          <div class="section-header"></div>
          <input type="radio" name="ci-q1" value="yes">
          <input type="radio" name="ci-q1" value="no">
          <input type="radio" name="ci-q2" value="yes">
          <input type="radio" name="ci-q2" value="no">
          <div id="ci-q3-group" class="ci-disabled">
            <input type="radio" name="ci-q3" value="yes">
            <input type="radio" name="ci-q3" value="no">
          </div>
          <div id="ci-symptoms-container" class="ci-disabled">${symptoms.join('\n')}</div>
          <span id="ci-score-text">&#8212;</span>
          <span id="ci-risk-badge"></span>
          <span id="ci-probability-text"></span>
          <button id="ci-report-btn" type="button">Generate Report & Copy</button>
          <button id="ci-reset-btn" type="button">Reset</button>
        </section>
      </body>
    </html>
  `, {
    url: 'https://psychopharmref.test/',
    runScripts: 'outside-only',
  });
}

function selectRadio(window, name, value) {
  const input = window.document.querySelector(`input[name="${name}"][value="${value}"]`);
  assert(input, `missing radio ${name}=${value}`);
  input.checked = true;
  input.dispatchEvent(new window.Event('change', { bubbles: true }));
}

async function runAsrsCase() {
  const dom = buildAsrsDom();
  const { window } = dom;
  const stubs = installBrowserStubs(window);

  window.eval(read('js/tools/tool-utils.js'));
  window.eval(read('js/tools/asrs-tool.js'));
  await wait(30);

  assert(stubs.requests.includes('data/clinical/scales/asrs.json'), 'ASRS schema was not requested');
  assert(stubs.requests.includes('data/clinical/sources.json'), 'Clinical sources were not requested for ASRS');

  [2, 2, 2, 3, 0, 3].forEach((value, index) => {
    selectRadio(window, `asrs-${index + 1}`, String(value));
  });
  [0, 1, 2, 3, 4].forEach((value, index) => {
    selectRadio(window, `asrs-${index + 7}`, String(value));
  });
  await wait(20);

  assert.strictEqual(window.document.getElementById('as-parta-count').textContent, '5/6 items in clinical range');
  assert(window.document.getElementById('as-parta-result').textContent.includes('Positive screen'), 'ASRS positive result not shown');
  assert.strictEqual(window.document.getElementById('as-freq-4').textContent, '1');

  window.document.getElementById('as-report-btn').click();
  await wait(20);

  const report = stubs.getCopiedText();
  assert(report.includes('Part A Result: 5/6 items in clinical range'), 'ASRS report missing Part A result');
  assert(report.includes('Part B Frequency: 1 Never, 1 Rarely, 1 Sometimes, 1 Often, 1 Very Often'), 'ASRS report missing Part B frequencies');
  assert(report.includes('Reference: Kessler RC, Adler L'), 'ASRS report missing reference');

  window.document.getElementById('as-reset-btn').click();
  await wait(20);
  assert.strictEqual(window.document.getElementById('as-parta-count').textContent, '\u2014');

  dom.window.close();
}

async function runCidiCase() {
  const dom = buildCidiDom();
  const { window } = dom;
  const stubs = installBrowserStubs(window);

  window.eval(read('js/tools/tool-utils.js'));
  window.eval(read('js/tools/cidi-tool.js'));
  await wait(30);

  assert(stubs.requests.includes('data/clinical/scales/cidi.json'), 'CIDI schema was not requested');
  assert(stubs.requests.includes('data/clinical/sources.json'), 'Clinical sources were not requested for CIDI');

  selectRadio(window, 'ci-q1', 'yes');
  selectRadio(window, 'ci-q2', 'no');
  selectRadio(window, 'ci-q3', 'yes');

  Array.from(window.document.querySelectorAll('input[name="ci-symptoms"]'))
    .slice(0, 7)
    .forEach(input => {
      input.checked = true;
      input.dispatchEvent(new window.Event('change', { bubbles: true }));
    });
  await wait(20);

  assert.strictEqual(window.document.getElementById('ci-score-text').textContent, '7/9 Symptoms');
  assert(window.document.getElementById('ci-risk-badge').textContent.includes('High Risk'), 'CIDI high risk result not shown');
  assert.strictEqual(window.document.getElementById('ci-probability-text').textContent, 'Probability of bipolar disorder: 50-79%');

  window.document.getElementById('ci-report-btn').click();
  await wait(20);

  const report = stubs.getCopiedText();
  assert(report.includes('Screen Result: Positive: High Risk (50-79%)'), 'CIDI report missing high risk result');
  assert(report.includes('Criterion B Symptoms Endorsed (7/9)'), 'CIDI report missing symptom count');
  assert(report.includes('Reference: Kessler RC, Akiskal HS'), 'CIDI report missing Kessler reference');
  assert(report.includes('Reference: Gill JM, Chen YX'), 'CIDI report missing risk-table reference');

  window.document.getElementById('ci-reset-btn').click();
  await wait(20);
  assert.strictEqual(window.document.getElementById('ci-score-text').textContent, '\u2014');

  dom.window.close();
}

async function main() {
  await runAsrsCase();
  await runCidiCase();
  console.log('PASS: ASRS and CIDI schema runtime smoke tests passed.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

#!/usr/bin/env node
/*
 * Smoke-test AIMS and Y-BOCS schema-backed runtime paths.
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

function buildAimsDom() {
  const inputs = [];
  for (let itemNumber = 1; itemNumber <= 10; itemNumber += 1) {
    for (let value = 0; value <= 4; value += 1) {
      inputs.push(`<input type="radio" name="ai-item${itemNumber}" value="${value}">`);
    }
  }
  for (let itemNumber = 11; itemNumber <= 12; itemNumber += 1) {
    for (let value = 0; value <= 1; value += 1) {
      inputs.push(`<input type="radio" name="ai-item${itemNumber}" value="${value}">`);
    }
  }

  return new JSDOM(`
    <!doctype html>
    <html>
      <body>
        <section id="aims-tool">
          <div class="section-header"></div>
          <button id="ai-procedure-header" type="button"></button>
          <div id="ai-procedure-content"></div>
          ${inputs.join('\n')}
          <span id="ai-facial-score">0/16</span>
          <span id="ai-extremity-score">0/8</span>
          <span id="ai-trunk-score">0/4</span>
          <span id="ai-total-score">0/28</span>
          <span id="ai-severity-level"></span>
          <span id="ai-screen-status" class="ai-severity-negative"></span>
          <button id="ai-report-btn" type="button">Generate Report & Copy</button>
          <button id="ai-reset-btn" type="button">Reset</button>
          <div id="ai-reset-modal"><button id="ai-reset-confirm" type="button"></button><button id="ai-reset-cancel" type="button"></button></div>
        </section>
      </body>
    </html>
  `, {
    url: 'https://psychopharmref.test/',
    runScripts: 'outside-only',
  });
}

function buildYbocsDom() {
  const inputs = [];
  for (let itemNumber = 1; itemNumber <= 16; itemNumber += 1) {
    for (let value = 0; value <= 4; value += 1) {
      inputs.push(`<input type="radio" name="yb-item-${itemNumber}" value="${value}">`);
    }
  }
  for (const itemId of ['1b', '6b']) {
    for (let value = 0; value <= 4; value += 1) {
      inputs.push(`<input type="radio" name="yb-item-${itemId}" value="${value}">`);
    }
  }
  for (const itemNumber of [17, 18]) {
    for (let value = 0; value <= 6; value += 1) {
      inputs.push(`<input type="radio" name="yb-item-${itemNumber}" value="${value}">`);
    }
  }
  for (let value = 0; value <= 3; value += 1) {
    inputs.push(`<input type="radio" name="yb-item-19" value="${value}">`);
  }

  return new JSDOM(`
    <!doctype html>
    <html>
      <body>
        <section id="ybocs-tool">
          <div class="section-header"></div>
          <button class="yb-tab-btn yb-active" data-tab="checklist" type="button"></button>
          <button class="yb-tab-btn" data-tab="severity" type="button"></button>
          <div id="yb-tab-checklist" class="yb-tab-content yb-active">
            <div class="yb-checklist-item">
              <label class="yb-checklist-label">Fear might harm self</label>
              <input type="checkbox" class="yb-obs-harm-self" data-type="current">
            </div>
            <div class="yb-checklist-item">
              <label class="yb-checklist-label">Excessive listmaking</label>
              <input type="checkbox" class="yb-comp-misc-list" data-type="past">
            </div>
            <span id="yb-current-obs-count">0</span>
            <span id="yb-past-obs-count">0</span>
            <span id="yb-current-comp-count">0</span>
            <span id="yb-past-comp-count">0</span>
            <span id="yb-total-current-count">0</span>
            <span id="yb-total-past-count">0</span>
            <button id="yb-copy-checklist-btn" type="button">Copy Checklist</button>
          </div>
          <div id="yb-tab-severity" class="yb-tab-content">
            ${inputs.join('\n')}
            <span id="yb-investigational-answered">0</span>
            <button id="yb-copy-investigational-btn" type="button">Copy Investigational Items</button>
          </div>
          <span id="yb-obs-subtotal">0</span>
          <span id="yb-comp-subtotal">0</span>
          <span id="yb-total-score">0</span>
          <span id="yb-severity-badge">Subclinical</span>
          <button id="yb-generate-btn" type="button">Generate Report & Copy</button>
          <button id="yb-reset-btn" type="button">Reset</button>
        </section>
      </body>
    </html>
  `, {
    url: 'https://psychopharmref.test/',
    runScripts: 'outside-only',
  });
}

function selectResponses(window, prefix, responses) {
  responses.forEach((value, index) => {
    const itemNumber = index + 1;
    const input = window.document.querySelector(`input[name="${prefix}${itemNumber}"][value="${value}"]`);
    assert(input, `missing input ${prefix}${itemNumber}=${value}`);
    input.checked = true;
    input.dispatchEvent(new window.Event('change', { bubbles: true }));
  });
}

async function runAimsCase() {
  const dom = buildAimsDom();
  const { window } = dom;
  const stubs = installBrowserStubs(window);

  window.eval(read('js/tools/tool-utils.js'));
  window.eval(read('js/tools/aims-tool.js'));
  await wait(30);

  assert(stubs.requests.includes('data/clinical/scales/aims.json'), 'AIMS schema was not requested');

  selectResponses(window, 'ai-item', [0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0]);
  await wait(20);

  assert.strictEqual(window.document.getElementById('ai-total-score').textContent, '2/28');
  assert.strictEqual(window.document.getElementById('ai-severity-level').textContent, 'Minimal Dyskinesia');
  assert.strictEqual(window.document.getElementById('ai-facial-score').textContent, '2/16');
  assert.strictEqual(window.document.getElementById('ai-screen-status').textContent, 'POSITIVE');

  window.document.getElementById('ai-report-btn').click();
  await wait(20);

  const report = stubs.getCopiedText();
  assert(report.includes('Total Movement Score: 2/28'), 'AIMS report missing total');
  assert(report.includes('Tardive Dyskinesia Screen: POSITIVE'), 'AIMS report missing screen');
  assert(report.includes('Reference: Guy W. ECDEU Assessment Manual'), 'AIMS report missing reference');
  dom.window.close();
}

async function runYbocsCase() {
  const dom = buildYbocsDom();
  const { window } = dom;
  const stubs = installBrowserStubs(window);

  window.eval(read('js/tools/tool-utils.js'));
  window.eval(read('js/tools/ybocs-tool.js'));
  await wait(30);

  assert(stubs.requests.includes('data/clinical/scales/ybocs.json'), 'Y-BOCS schema was not requested');

  selectResponses(window, 'yb-item-', [2, 2, 2, 2, 0, 2, 2, 2, 2, 0]);
  const supplemental = window.document.querySelector('input[name="yb-item-1b"][value="3"]');
  supplemental.checked = true;
  const currentObsession = window.document.querySelector('.yb-obs-harm-self');
  currentObsession.checked = true;
  currentObsession.dispatchEvent(new window.Event('change', { bubbles: true }));
  const pastCompulsion = window.document.querySelector('.yb-comp-misc-list');
  pastCompulsion.checked = true;
  pastCompulsion.dispatchEvent(new window.Event('change', { bubbles: true }));
  const insight = window.document.querySelector('input[name="yb-item-11"][value="2"]');
  insight.checked = true;
  insight.dispatchEvent(new window.Event('change', { bubbles: true }));
  await wait(20);

  assert.strictEqual(window.document.getElementById('yb-total-score').textContent, '16');
  assert.strictEqual(window.document.getElementById('yb-obs-subtotal').textContent, '8');
  assert.strictEqual(window.document.getElementById('yb-comp-subtotal').textContent, '8');
  assert.strictEqual(window.document.getElementById('yb-severity-badge').textContent, 'Moderate');
  assert.strictEqual(window.document.getElementById('yb-current-obs-count').textContent, '1');
  assert.strictEqual(window.document.getElementById('yb-past-comp-count').textContent, '1');
  assert.strictEqual(window.document.getElementById('yb-total-current-count').textContent, '1');
  assert.strictEqual(window.document.getElementById('yb-total-past-count').textContent, '1');
  assert.strictEqual(window.document.getElementById('yb-investigational-answered').textContent, '1');

  window.document.getElementById('yb-copy-checklist-btn').click();
  await wait(20);

  const checklistReport = stubs.getCopiedText();
  assert(checklistReport.includes('Y-BOCS Symptom Checklist'), 'Y-BOCS checklist report missing heading');
  assert(checklistReport.includes('Current Obsessions (1): Fear might harm self'), 'Y-BOCS checklist report missing current obsession');
  assert(checklistReport.includes('Past Compulsions (1): Excessive listmaking'), 'Y-BOCS checklist report missing past compulsion');

  window.document.getElementById('yb-copy-investigational-btn').click();
  await wait(20);

  const investigationalReport = stubs.getCopiedText();
  assert(investigationalReport.includes('Y-BOCS Investigational Items'), 'Y-BOCS investigational report missing heading');
  assert(investigationalReport.includes('Completed: 1/9'), 'Y-BOCS investigational report missing completion count');
  assert(investigationalReport.includes('11. Insight: 2'), 'Y-BOCS investigational report missing item score');

  window.document.getElementById('yb-generate-btn').click();
  await wait(20);

  const report = stubs.getCopiedText();
  assert(report.includes('Total Score: 16/40'), 'Y-BOCS report missing total');
  assert(report.includes('Severity: Moderate'), 'Y-BOCS report missing severity');
  assert(report.includes('1b. Obsession-Free Interval: 3'), 'Y-BOCS report missing supplemental item');
  assert(report.includes('Current Obsessions: Fear might harm self'), 'Y-BOCS report missing checklist item');
  assert(report.includes('Reference: Goodman WK, Price LH'), 'Y-BOCS report missing reference');
  dom.window.close();
}

async function main() {
  await runAimsCase();
  await runYbocsCase();
  console.log('PASS: AIMS and Y-BOCS schema runtime smoke tests passed.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

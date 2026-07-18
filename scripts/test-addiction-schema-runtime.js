#!/usr/bin/env node
/*
 * Smoke-test schema-backed runtime paths for CIWA-Ar, COWS, and DSM-5-TR SUD.
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
  window.HTMLElement.prototype.scrollIntoView = function noop() {};
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

function radioInputs(prefix, maxValuesByItem) {
  const inputs = [];
  Object.entries(maxValuesByItem).forEach(([itemNumber, values]) => {
    values.forEach(value => {
      inputs.push(`<input type="radio" name="${prefix}${itemNumber}" value="${value}" ${value === 0 ? 'checked' : ''}>`);
    });
  });
  return inputs.join('\n');
}

function buildCiwaDom() {
  const values = {};
  for (let itemNumber = 1; itemNumber <= 9; itemNumber += 1) values[itemNumber] = [0, 1, 2, 3, 4, 5, 6, 7];
  values[10] = [0, 1, 2, 3, 4];

  return new JSDOM(`
    <!doctype html>
    <html>
      <body>
        <section id="ciwa-tool">
          <form id="ciwa-form">${radioInputs('ciwa-item', values)}</form>
          <span id="ciwa-total-score">0</span>
          <span id="ciwa-severity-level"></span>
          <div id="ciwa-guidance"></div>
          <div id="ciwa-summary"><div id="ciwa-summary-grid"></div></div>
          <input id="ciwa-pulse">
          <input id="ciwa-bp">
          <button id="ciwa-report-btn" type="button">Copy Report</button>
          <button id="ciwa-reset-btn" type="button">Reset</button>
        </section>
      </body>
    </html>
  `, {
    url: 'https://psychopharmref.test/',
    runScripts: 'outside-only',
  });
}

function buildCowsDom() {
  const values = {
    1: [0, 1, 2, 4],
    2: [0, 1, 2, 3, 4],
    3: [0, 1, 3, 5],
    4: [0, 1, 2, 5],
    5: [0, 1, 2, 4],
    6: [0, 1, 2, 4],
    7: [0, 1, 2, 3, 5],
    8: [0, 1, 2, 4],
    9: [0, 1, 2, 4],
    10: [0, 1, 2, 4],
    11: [0, 3, 5],
  };

  return new JSDOM(`
    <!doctype html>
    <html>
      <body>
        <section id="cows-tool">
          <form id="cows-form">${radioInputs('cows-item', values)}</form>
          <span id="cows-total-score">0</span>
          <span id="cows-severity-level"></span>
          <div id="cows-guidance"></div>
          <div id="cows-summary"><div id="cows-summary-grid"></div></div>
          <textarea id="cows-reason"></textarea>
          <button id="cows-report-btn" type="button">Copy Report</button>
          <button id="cows-reset-btn" type="button">Reset</button>
        </section>
      </body>
    </html>
  `, {
    url: 'https://psychopharmref.test/',
    runScripts: 'outside-only',
  });
}

function buildSudDom() {
  return new JSDOM(`
    <!doctype html>
    <html>
      <body>
        <div id="content"></div>
        <section id="sud-tool">
          <span id="sud-date-display"></span>
          <select id="sud-substance">
            <option value=""></option>
            <option value="opioid">Opioid</option>
            <option value="phencyclidine">Phencyclidine</option>
          </select>
          <div id="sud-subopts" class="sud-hidden"></div>
          <div id="sud-specify-group" class="sud-hidden"><input id="sud-specify"></div>
          <div id="sud-stim-group" class="sud-hidden"><select id="sud-stim-type"><option value="amphetamine"></option></select></div>
          <div id="sud-criteria-card" class="sud-hidden">
            <p id="sud-criteria-note" class="sud-hidden"></p>
            <div id="sud-criteria-list"></div>
            <b id="sud-count">0</b><span id="sud-max"></span>
            <div id="sud-severity"></div>
          </div>
          <div id="sud-specifiers-card" class="sud-hidden">
            <input type="checkbox" id="sud-rem-early">
            <input type="checkbox" id="sud-rem-sustained">
            <input type="checkbox" id="sud-controlled">
            <input type="checkbox" id="sud-maintenance">
            <input id="sud-maintenance-detail">
          </div>
          <div id="sud-notes-card" class="sud-hidden"><textarea id="sud-notes"></textarea></div>
          <button id="sud-generate-btn" type="button">Generate Report & Copy</button>
          <div id="sud-output" class="sud-hidden">
            <pre id="sud-output-text"></pre>
            <button id="sud-copy-btn" type="button">Copy</button>
            <button id="sud-reset-btn" type="button">Reset</button>
            <span id="sud-copy-status"></span>
          </div>
        </section>
      </body>
    </html>
  `, {
    url: 'https://psychopharmref.test/',
    runScripts: 'outside-only',
  });
}

function selectRadio(window, selector) {
  const input = window.document.querySelector(selector);
  assert(input, `missing input ${selector}`);
  input.checked = true;
  input.dispatchEvent(new window.Event('change', { bubbles: true }));
}

async function runCiwaCase() {
  const dom = buildCiwaDom();
  const { window } = dom;
  const stubs = installBrowserStubs(window);

  window.eval(read('js/tools/tool-utils.js'));
  window.eval(read('js/tools/ciwa-tool.js'));
  await wait(30);

  assert(stubs.requests.includes('data/clinical/scales/ciwa.json'), 'CIWA-Ar schema was not requested');

  selectRadio(window, 'input[name="ciwa-item1"][value="7"]');
  selectRadio(window, 'input[name="ciwa-item10"][value="4"]');
  await wait(20);

  assert.strictEqual(window.document.getElementById('ciwa-total-score').textContent, '11');
  assert.strictEqual(window.document.getElementById('ciwa-severity-level').textContent, 'Moderate withdrawal');

  window.document.getElementById('ciwa-report-btn').click();
  await wait(20);

  const report = stubs.getCopiedText();
  assert(report.includes('Total Score: 11 / 67'), 'CIWA-Ar report missing total');
  assert(report.includes('10. Orientation / Clouding of Sensorium: 4/4'), 'CIWA-Ar report missing item 10 max');
  assert(report.includes('Reference: Sullivan JT'), 'CIWA-Ar report missing reference');
  dom.window.close();
}

async function runCowsCase() {
  const dom = buildCowsDom();
  const { window } = dom;
  const stubs = installBrowserStubs(window);

  window.eval(read('js/tools/tool-utils.js'));
  window.eval(read('js/tools/cows-tool.js'));
  await wait(30);

  assert(stubs.requests.includes('data/clinical/scales/cows.json'), 'COWS schema was not requested');

  selectRadio(window, 'input[name="cows-item1"][value="4"]');
  selectRadio(window, 'input[name="cows-item3"][value="5"]');
  selectRadio(window, 'input[name="cows-item11"][value="5"]');
  await wait(20);

  assert.strictEqual(window.document.getElementById('cows-total-score').textContent, '14');
  assert.strictEqual(window.document.getElementById('cows-severity-level').textContent, 'Moderate withdrawal');

  window.document.getElementById('cows-report-btn').click();
  await wait(20);

  const report = stubs.getCopiedText();
  assert(report.includes('Total Score: 14 / 48'), 'COWS report missing total');
  assert(report.includes('11. Gooseflesh Skin: 5/5'), 'COWS report missing weighted item');
  assert(report.includes('Reference: Wesson DR, Ling W'), 'COWS report missing reference');
  dom.window.close();
}

async function runSudCase() {
  const dom = buildSudDom();
  const { window } = dom;
  const stubs = installBrowserStubs(window);

  window.eval(read('js/tools/tool-utils.js'));
  window.eval(read('js/tools/sud-tool.js'));
  await wait(30);

  assert(stubs.requests.includes('data/clinical/scales/sud.json'), 'SUD schema was not requested');

  const substance = window.document.getElementById('sud-substance');
  substance.value = 'opioid';
  substance.dispatchEvent(new window.Event('change', { bubbles: true }));
  await wait(20);

  selectRadio(window, '#sud-crit-0');
  selectRadio(window, '#sud-crit-1');
  await wait(20);

  assert.strictEqual(window.document.getElementById('sud-count').textContent, '2');
  assert(window.document.getElementById('sud-severity').textContent.includes('MILD'), 'SUD severity did not update');
  assert.strictEqual(window.document.getElementById('sud-max').textContent, '/ 11');

  window.document.getElementById('sud-generate-btn').click();
  await wait(20);

  const report = stubs.getCopiedText();
  assert(report.includes('Criteria met (past 12 months): 2 of 11'), 'SUD report missing criteria count');
  assert(report.includes('Severity: Mild'), 'SUD report missing severity');
  assert(report.includes('Reference: McNeely J'), 'SUD report missing reference');

  substance.value = 'phencyclidine';
  substance.dispatchEvent(new window.Event('change', { bubbles: true }));
  await wait(20);

  assert.strictEqual(window.document.getElementById('sud-max').textContent, '/ 10');
  assert(window.document.getElementById('sud-crit-10').disabled, 'SUD withdrawal criterion was not disabled for PCP');
  dom.window.close();
}

async function main() {
  await runCiwaCase();
  await runCowsCase();
  await runSudCase();
  console.log('PASS: CIWA-Ar, COWS, and SUD schema runtime smoke tests passed.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

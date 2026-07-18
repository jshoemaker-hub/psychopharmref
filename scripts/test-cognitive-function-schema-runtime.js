#!/usr/bin/env node
/*
 * Smoke-test schema-backed runtime paths for CDR, SLUMS, ADL/IADL, and ACE.
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
  window.print = () => {};
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

function radioInputs(name, values) {
  return values.map(value => (
    `<label class="cdr-opt"><input type="radio" name="${name}" value="${value}"><span>${value}</span></label>`
  )).join('\n');
}

function selectRadio(window, selector) {
  const input = window.document.querySelector(selector);
  assert(input, `missing input ${selector}`);
  input.checked = true;
  input.dispatchEvent(new window.Event('change', { bubbles: true }));
}

function buildCdrDom() {
  const domainCards = [
    ['memory', [0, 0.5, 1, 2, 3]],
    ['orientation', [0, 0.5, 1, 2, 3]],
    ['judgment', [0, 0.5, 1, 2, 3]],
    ['community', [0, 0.5, 1, 2, 3]],
    ['home', [0, 0.5, 1, 2, 3]],
    ['personalcare', [0, 1, 2, 3]],
  ].map(([domain, values]) => (
    `<div class="cdr-domain-card"><div class="cdr-opts">${radioInputs(`cdr-${domain}`, values)}</div></div>`
  )).join('\n');

  return new JSDOM(`
    <!doctype html>
    <html>
      <body>
        <section id="cdr-tool">
          <div class="section-header"></div>
          <div id="cdr-grid">${domainCards}</div>
          <button id="cdr-calc-btn" type="button">Calculate</button>
          <button id="cdr-reset-btn" type="button">Reset</button>
          <button id="cdr-print-btn" type="button">Print</button>
          <div id="cdr-error"></div>
          <div id="cdr-results">
            <div id="cdr-score-row"></div>
            <div id="cdr-interp"></div>
            <table><tbody id="cdr-box-tbody"></tbody><tfoot><tr><th id="cdr-sb-val"></th></tr></tfoot></table>
            <div id="cdr-summary-wrap"><pre id="cdr-summary-text"></pre><button id="cdr-copy-btn" type="button">Copy</button><div id="cdr-copy-msg"></div></div>
          </div>
        </section>
      </body>
    </html>
  `, {
    url: 'https://psychopharmref.test/',
    runScripts: 'outside-only',
  });
}

function buildSlumsDom() {
  const domains = ['orientation', 'executive', 'attention', 'memory', 'workingmemory', 'language', 'visuospatial'];
  const domainHtml = domains.map(domain => `
    <span id="sl-score-${domain}">0</span>
    <div id="sl-bar-${domain}"></div>
    <div id="sl-note-${domain}"></div>
  `).join('\n');

  return new JSDOM(`
    <!doctype html>
    <html>
      <body>
        <section id="slums-tool">
          <input type="radio" name="sl-education" value="high-school" checked>
          <input type="radio" name="sl-education" value="less-than-high-school">
          <input type="checkbox" class="sl-q-check" data-question="1" data-points="1">
          <input type="radio" name="sl-q6" class="sl-q-radio" data-question="6" data-points="3">
          <div class="sl-results-section">
            <div id="sl-total-score">0</div>
            <div id="sl-interpretation"><div class="sl-interp-category"></div><div class="sl-interp-note"></div></div>
            ${domainHtml}
            <button id="sl-copy-summary" type="button">Copy Summary to Clipboard</button>
            <div id="sl-copy-feedback"></div>
            <pre id="sl-summary-text"></pre>
            <button id="sl-reset-btn" type="button">Reset</button>
          </div>
        </section>
      </body>
    </html>
  `, {
    url: 'https://psychopharmref.test/',
    runScripts: 'outside-only',
  });
}

function buildAdlDom() {
  return new JSDOM(`
    <!doctype html>
    <html>
      <body>
        <section id="adl-tool">
          <input type="radio" name="ad-bathing" value="Independent" class="ad-adl-item">
          <input type="radio" name="ad-bathing" value="Dependent" class="ad-adl-item">
          <input type="radio" name="ad-shopping" value="Independent" class="ad-iadl-item">
          <input type="radio" name="ad-shopping" value="Dependent" class="ad-iadl-item">
          <span id="ad-adl-independent">0</span><span id="ad-adl-help">0</span><span id="ad-adl-dependent">0</span><span id="ad-adl-cannot">0</span>
          <span id="ad-iadl-independent">0</span><span id="ad-iadl-help">0</span><span id="ad-iadl-dependent">0</span><span id="ad-iadl-cannot">0</span>
          <button id="ad-generate-btn" type="button">Generate Report</button>
          <button id="ad-reset-btn" type="button">Reset</button>
        </section>
      </body>
    </html>
  `, {
    url: 'https://psychopharmref.test/',
    runScripts: 'outside-only',
  });
}

function buildAceDom() {
  return new JSDOM(`
    <!doctype html>
    <html>
      <body>
        <div id="content"></div>
        <section id="ace-tool">
          <span id="ace-date-display"></span>
          <input id="ace-minutes">
          <textarea id="ace-condition"></textarea>
          <textarea id="ace-treatment"></textarea>
          <textarea id="ace-alternatives"></textarea>
          <div id="ace-domains"></div>
          <input type="radio" name="ace-impression" value="prob-cap">
          <textarea id="ace-comments"></textarea>
          <button id="ace-generate-btn" type="button">Generate Report & Copy</button>
          <button id="ace-print-btn" type="button">Print</button>
          <div id="ace-output" class="ace-hidden">
            <pre id="ace-output-text"></pre>
            <button id="ace-copy-btn" type="button">Copy</button>
            <button id="ace-reset-btn" type="button">Reset</button>
            <span id="ace-copy-status"></span>
          </div>
        </section>
      </body>
    </html>
  `, {
    url: 'https://psychopharmref.test/',
    runScripts: 'outside-only',
  });
}

async function runCdrCase() {
  const dom = buildCdrDom();
  const { window } = dom;
  const stubs = installBrowserStubs(window);

  window.eval(read('js/tools/tool-utils.js'));
  window.eval(read('js/tools/cdr-tool.js'));
  await wait(30);

  assert(stubs.requests.includes('data/clinical/scales/cdr.json'), 'CDR schema was not requested');

  ['memory', 'orientation', 'judgment', 'community', 'home'].forEach(domain => {
    selectRadio(window, `input[name="cdr-${domain}"][value="0.5"]`);
  });
  selectRadio(window, 'input[name="cdr-personalcare"][value="0"]');
  window.document.getElementById('cdr-calc-btn').click();
  await wait(20);

  assert(window.document.getElementById('cdr-score-row').textContent.includes('Global CDR'), 'CDR score row missing global score');
  assert(window.document.getElementById('cdr-summary-text').textContent.includes('CDR-SB:           2.5'), 'CDR report missing sum of boxes');

  window.document.getElementById('cdr-copy-btn').click();
  await wait(20);
  assert(stubs.getCopiedText().includes('Reference: Morris JC'), 'CDR report missing reference');
  dom.window.close();
}

async function runSlumsCase() {
  const dom = buildSlumsDom();
  const { window } = dom;
  const stubs = installBrowserStubs(window);

  window.eval(read('js/tools/tool-utils.js'));
  window.eval(read('js/tools/slums-tool.js'));
  await wait(30);

  assert(stubs.requests.includes('data/clinical/scales/slums.json'), 'SLUMS schema was not requested');

  const q1 = window.document.querySelector('.sl-q-check');
  q1.checked = true;
  q1.dispatchEvent(new window.Event('change', { bubbles: true }));
  await wait(20);

  assert.strictEqual(window.document.getElementById('sl-total-score').textContent, '1');
  assert.strictEqual(window.document.querySelector('.sl-interp-category').textContent, 'Dementia');

  window.document.getElementById('sl-copy-summary').click();
  await wait(20);
  assert(stubs.getCopiedText().includes('TOTAL SCORE: 1/30'), 'SLUMS report missing total');
  assert(stubs.getCopiedText().includes('Reference: Tariq SH'), 'SLUMS report missing reference');
  dom.window.close();
}

async function runAdlCase() {
  const dom = buildAdlDom();
  const { window } = dom;
  const stubs = installBrowserStubs(window);

  window.eval(read('js/tools/tool-utils.js'));
  window.eval(read('js/tools/adl-tool.js'));
  await wait(30);

  assert(stubs.requests.includes('data/clinical/scales/adl-iadl.json'), 'ADL/IADL schema was not requested');

  selectRadio(window, 'input[name="ad-bathing"][value="Independent"]');
  selectRadio(window, 'input[name="ad-shopping"][value="Dependent"]');
  await wait(20);

  assert.strictEqual(window.document.getElementById('ad-adl-independent').textContent, '1');
  assert.strictEqual(window.document.getElementById('ad-iadl-dependent').textContent, '1');

  window.document.getElementById('ad-generate-btn').click();
  await wait(20);
  assert(stubs.getCopiedText().includes('Bathing: Independent'), 'ADL report missing selected ADL item');
  assert(stubs.getCopiedText().includes('Reference: Katz S'), 'ADL report missing Katz reference');
  assert(stubs.getCopiedText().includes('Reference: Lawton MP'), 'ADL report missing Lawton reference');
  dom.window.close();
}

async function runAceCase() {
  const dom = buildAceDom();
  const { window } = dom;
  const stubs = installBrowserStubs(window);

  window.eval(read('js/tools/tool-utils.js'));
  window.eval(read('js/tools/ace-tool.js'));
  await wait(30);

  assert(stubs.requests.includes('data/clinical/scales/ace.json'), 'ACE schema was not requested');

  window.document.getElementById('ace-condition').value = 'Pneumonia';
  window.document.getElementById('ace-treatment').value = 'Antibiotics';
  selectRadio(window, 'input[name="ace-d1"][value="yes"]');
  selectRadio(window, 'input[name="ace-impression"][value="prob-cap"]');

  window.document.getElementById('ace-generate-btn').click();
  await wait(20);

  const report = stubs.getCopiedText();
  assert(report.includes('Medical condition: Pneumonia'), 'ACE report missing decision context');
  assert(report.includes('OVERALL IMPRESSION: Probably Capable'), 'ACE report missing overall impression');
  assert(report.includes('Etchells E'), 'ACE report missing Etchells reference');
  dom.window.close();
}

async function main() {
  await runCdrCase();
  await runSlumsCase();
  await runAdlCase();
  await runAceCase();
  console.log('PASS: Cognitive/function/capacity schema runtime smoke tests passed.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

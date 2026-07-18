#!/usr/bin/env node
/*
 * Smoke-test the BFCRS schema-backed runtime path.
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

function crsInputs() {
  const binaryItems = new Set([12, 17, 18, 19, 20, 21]);
  const inputs = [];

  for (let itemNumber = 1; itemNumber <= 23; itemNumber += 1) {
    const values = binaryItems.has(itemNumber) ? [0, 3] : [0, 1, 2, 3];
    values.forEach(value => {
      inputs.push(`<input type="radio" name="bf-crs-${itemNumber}" value="${value}">`);
    });
  }

  return inputs.join('\n');
}

function csiInputs() {
  const inputs = [];
  for (let itemNumber = 1; itemNumber <= 14; itemNumber += 1) {
    inputs.push(`<input type="checkbox" name="bf-csi-${itemNumber}" value="1">`);
  }
  return inputs.join('\n');
}

function buildDom() {
  return new JSDOM(`
    <!doctype html>
    <html>
      <body>
        <section id="bfcrs-tool">
          <div class="section-header"></div>
          <button class="bf-tab-btn bf-active" data-tab="bf-csi-tab" type="button"></button>
          <button class="bf-tab-btn" data-tab="bf-crs-tab" type="button"></button>
          <div id="bf-csi-tab" class="bf-tab-content bf-active">
            ${csiInputs()}
            <span id="bf-csi-score">0</span>
            <div id="bf-csi-interpretation" class="bf-interpretation"></div>
            <div id="bf-csi-items-list"></div>
            <button id="bf-csi-generate" type="button">Copy Report</button>
          </div>
          <div id="bf-crs-tab" class="bf-tab-content">
            <fieldset class="bf-fieldset">
              <legend class="bf-legend"></legend>
              ${crsInputs()}
            </fieldset>
            <span id="bf-crs-severity">0</span>
            <span id="bf-crs-items-present">0</span>
            <span id="bf-crs-screening-positive">0</span>
            <div id="bf-crs-interpretation" class="bf-interpretation"></div>
            <div id="bf-crs-subtype"></div>
            <div id="bf-crs-warning"></div>
            <button id="bf-crs-generate" type="button">Copy Report</button>
          </div>
        </section>
      </body>
    </html>
  `, {
    url: 'https://psychopharmref.test/',
    runScripts: 'outside-only',
  });
}

function check(window, selector) {
  const input = window.document.querySelector(selector);
  assert(input, `missing input ${selector}`);
  input.checked = true;
  input.dispatchEvent(new window.Event('change', { bubbles: true }));
}

async function main() {
  const dom = buildDom();
  const { window } = dom;
  const stubs = installBrowserStubs(window);

  window.eval(read('js/tools/tool-utils.js'));
  window.eval(read('js/tools/bfcrs-tool.js'));
  await wait(30);

  assert(stubs.requests.includes('data/clinical/scales/bfcrs.json'), 'BFCRS schema was not requested');
  assert(stubs.requests.includes('data/clinical/sources.json'), 'clinical sources were not requested');

  check(window, 'input[name="bf-csi-1"]');
  check(window, 'input[name="bf-csi-12"]');
  await wait(20);

  assert.strictEqual(window.document.getElementById('bf-csi-score').textContent, '2');
  assert.strictEqual(window.document.getElementById('bf-csi-interpretation').textContent, 'Positive screen - catatonia likely');
  assert(window.document.getElementById('bf-csi-items-list').textContent.includes('Waxy Flexibility'));

  window.document.getElementById('bf-csi-generate').click();
  await wait(20);

  const csiReport = stubs.getCopiedText();
  assert(csiReport.includes('Bush-Francis Catatonia Screening Instrument'), 'CSI report missing heading');
  assert(csiReport.includes('Screening Score: 2/14'), 'CSI report missing score');
  assert(csiReport.includes('12. Waxy Flexibility: Present'), 'CSI report missing binary screening item');
  assert(csiReport.includes('Reference: Bush G, Fink M'), 'CSI report missing reference');

  check(window, 'input[name="bf-crs-1"][value="1"]');
  check(window, 'input[name="bf-crs-2"][value="1"]');
  check(window, 'input[name="bf-crs-12"][value="3"]');
  check(window, 'input[name="bf-crs-14"][value="3"]');
  check(window, 'input[name="bf-crs-23"][value="2"]');
  await wait(20);

  assert.strictEqual(window.document.getElementById('bf-crs-severity').textContent, '10');
  assert.strictEqual(window.document.getElementById('bf-crs-items-present').textContent, '5');
  assert.strictEqual(window.document.getElementById('bf-crs-screening-positive').textContent, '4');
  assert.strictEqual(window.document.getElementById('bf-crs-interpretation').textContent, 'Mild catatonia');
  assert.strictEqual(window.document.getElementById('bf-crs-subtype').textContent, 'Predominant subtype: Excited');
  assert(window.document.getElementById('bf-crs-warning').textContent.includes('malignant catatonia'), 'CRS warning did not appear');

  window.document.getElementById('bf-crs-generate').click();
  await wait(20);

  const crsReport = stubs.getCopiedText();
  assert(crsReport.includes('Bush-Francis Catatonia Rating Scale'), 'CRS report missing heading');
  assert(crsReport.includes('Severity Score: 10/69'), 'CRS report missing severity score');
  assert(crsReport.includes('12. Waxy Flexibility: 3/3'), 'CRS report missing binary item score');
  assert(crsReport.includes('Screening Items Positive: 4/14'), 'CRS report missing screening count');
  assert(crsReport.includes('WARNING - Autonomic instability present'), 'CRS report missing malignant warning');
  assert(crsReport.includes('Reference: University of Rochester Medicine'), 'CRS report missing clinical source');

  dom.window.close();
  console.log('PASS: BFCRS schema runtime smoke test passed.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

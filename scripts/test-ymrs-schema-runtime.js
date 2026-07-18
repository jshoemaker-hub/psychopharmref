#!/usr/bin/env node
/*
 * Smoke-test the YMRS schema-backed runtime path.
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

function buildYmrsDom() {
  const allowedValues = {
    1: [0, 1, 2, 3, 4],
    2: [0, 1, 2, 3, 4],
    3: [0, 1, 2, 3, 4],
    4: [0, 1, 2, 3, 4],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 4, 6, 8],
    7: [0, 1, 2, 3, 4],
    8: [0, 2, 4, 6, 8],
    9: [0, 2, 4, 6, 8],
    10: [0, 1, 2, 3, 4],
    11: [0, 1, 2, 3, 4],
  };
  const inputs = [];
  Object.entries(allowedValues).forEach(([itemNumber, values]) => {
    values.forEach(value => {
      inputs.push(`<input type="radio" name="ym-item${itemNumber}" value="${value}">`);
    });
  });

  return new JSDOM(`
    <!doctype html>
    <html>
      <body>
        <section id="ymrs-tool">
          <div class="section-header"></div>
          <form id="ym-form">${inputs.join('\n')}</form>
          <span id="ym-total-score">0</span>
          <span id="ym-severity-level" class="ym-severity-label"></span>
          <button id="ym-report-btn" type="button">Generate Report & Copy</button>
          <button id="ym-reset-btn" type="button">Reset</button>
          <div id="ym-summary"><div id="ym-summary-grid"></div></div>
        </section>
      </body>
    </html>
  `, {
    url: 'https://psychopharmref.test/',
    runScripts: 'outside-only',
  });
}

function selectResponses(window, responses) {
  responses.forEach((value, index) => {
    const itemNumber = index + 1;
    const input = window.document.querySelector(`input[name="ym-item${itemNumber}"][value="${value}"]`);
    assert(input, `missing YMRS input ${itemNumber}=${value}`);
    input.checked = true;
    input.dispatchEvent(new window.Event('change', { bubbles: true }));
  });
}

async function main() {
  const dom = buildYmrsDom();
  const { window } = dom;
  const stubs = installBrowserStubs(window);

  window.eval(read('js/tools/tool-utils.js'));
  window.eval(read('js/tools/ymrs-tool.js'));

  await wait(30);

  assert(stubs.requests.includes('data/clinical/scales/ymrs.json'), 'YMRS schema was not requested');
  assert(stubs.requests.includes('data/clinical/sources.json'), 'Clinical sources were not requested');

  selectResponses(window, [3, 3, 3, 3, 4, 4, 2, 2, 2, 0, 0]);
  await wait(20);

  assert.strictEqual(window.document.getElementById('ym-total-score').textContent, '26');
  assert.strictEqual(window.document.getElementById('ym-severity-level').textContent, 'Severe mania');
  assert(window.document.getElementById('ym-summary-grid').textContent.includes('5. Irritability'), 'summary missing item label');
  assert(window.document.getElementById('ym-summary-grid').textContent.includes('4/8'), 'summary missing variable item max');

  window.document.getElementById('ym-report-btn').click();
  await wait(20);

  const report = stubs.getCopiedText();
  assert(report.includes('Total Score: 26/60'), 'report missing total score');
  assert(report.includes('Severity: Severe mania'), 'report missing severity');
  assert(report.includes('5. Irritability: 4/8'), 'report missing variable max item score');
  assert(report.includes('items 5, 6, 8, and 9 use 0/2/4/6/8 scoring'), 'report missing scoring note');
  assert(report.includes('Reference: Young RC, Biggs JT'), 'report missing Young reference');
  assert(report.includes('Reference: Lukasiewicz M, Gerard S'), 'report missing Lukasiewicz reference');

  dom.window.close();
  console.log('PASS: YMRS schema runtime smoke test passed.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

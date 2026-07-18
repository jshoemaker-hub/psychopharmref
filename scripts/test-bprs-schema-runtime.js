#!/usr/bin/env node
/*
 * Smoke-test the BPRS schema-backed runtime path.
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

function buildBprsDom() {
  const inputs = [];
  for (let itemNumber = 1; itemNumber <= 18; itemNumber += 1) {
    for (let value = 0; value <= 7; value += 1) {
      inputs.push(`<input type="radio" name="bp-item${itemNumber}" value="${value}">`);
    }
  }

  return new JSDOM(`
    <!doctype html>
    <html>
      <body>
        <form id="bp-form">${inputs.join('\n')}</form>
        <span id="bp-total-score">0</span>
        <span id="bp-severity" class="bp-severity-label bp-severity-normal"></span>
        <span id="bp-sub-positive-symptoms">0</span>
        <span id="bp-sub-negative-symptoms">0</span>
        <span id="bp-sub-affective-symptoms">0</span>
        <span id="bp-sub-activation">0</span>
        <span id="bp-sub-other">0</span>
        <button id="bp-copy-btn" type="button">Copy Report</button>
        <button id="bp-reset-btn" type="button">Reset</button>
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
    const input = window.document.querySelector(`input[name="bp-item${itemNumber}"][value="${value}"]`);
    assert(input, `missing BPRS input ${itemNumber}=${value}`);
    input.checked = true;
    input.dispatchEvent(new window.Event('change', { bubbles: true }));
  });
}

async function main() {
  const dom = buildBprsDom();
  const { window } = dom;
  const stubs = installBrowserStubs(window);

  window.eval(read('js/tools/tool-utils.js'));
  window.eval(read('js/tools/bprs-tool.js'));

  await wait(30);

  assert(stubs.requests.includes('data/clinical/scales/bprs.json'), 'BPRS schema was not requested');
  assert(stubs.requests.includes('data/clinical/sources.json'), 'Clinical sources were not requested');

  selectResponses(window, [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 3, 3, 3, 0]);
  await wait(20);

  assert.strictEqual(window.document.getElementById('bp-total-score').textContent, '53');
  assert.strictEqual(window.document.getElementById('bp-severity').textContent, 'Markedly Ill or Worse');
  assert.strictEqual(window.document.getElementById('bp-sub-positive-symptoms').textContent, '15');
  assert.strictEqual(window.document.getElementById('bp-sub-negative-symptoms').textContent, '9');
  assert.strictEqual(window.document.getElementById('bp-sub-affective-symptoms').textContent, '9');
  assert.strictEqual(window.document.getElementById('bp-sub-activation').textContent, '9');
  assert.strictEqual(window.document.getElementById('bp-sub-other').textContent, '11');

  window.document.getElementById('bp-copy-btn').click();
  await wait(20);

  const report = stubs.getCopiedText();
  assert(report.includes('Total Score: 53 - Markedly Ill or Worse'), 'report missing total severity line');
  assert(report.includes('Severity anchors (Leucht et al., 2005)'), 'report missing severity anchor note');
  assert(report.includes('Reference: Overall JE, Gorham DR.'), 'report missing Overall/Gorham reference');
  assert(report.includes('Reference: Leucht S, Kane JM'), 'report missing Leucht reference');

  dom.window.close();
  console.log('PASS: BPRS schema runtime smoke test passed.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

#!/usr/bin/env node
/*
 * Smoke-test the PCL-5 schema-backed runtime path.
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

function buildPcl5Dom() {
  const inputs = [];
  for (let itemNumber = 1; itemNumber <= 20; itemNumber += 1) {
    for (let value = 0; value <= 4; value += 1) {
      inputs.push(`<input type="radio" name="pc-item-${itemNumber}" value="${value}">`);
    }
  }

  return new JSDOM(`
    <!doctype html>
    <html>
      <body>
        <section id="pcl5-tool">
          <div class="section-header"></div>
          ${inputs.join('\n')}
          <span id="pc-total">0</span>
          <span id="pc-severity" class="pc-severity"></span>
          <span id="pc-clusterB">0</span>
          <span id="pc-clusterC">0</span>
          <span id="pc-clusterD">0</span>
          <span id="pc-clusterE">0</span>
          <span id="pc-crit-b"></span><span id="pc-crit-b-count">0</span>
          <span id="pc-crit-c"></span><span id="pc-crit-c-count">0</span>
          <span id="pc-crit-d"></span><span id="pc-crit-d-count">0</span>
          <span id="pc-crit-e"></span><span id="pc-crit-e-count">0</span>
          <span id="pc-diagnosis"></span>
          <span id="pc-cutoff"></span>
          <button id="pc-report-btn" type="button">Generate Report & Copy</button>
          <button id="pc-reset-btn" type="button">Reset</button>
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
    const input = window.document.querySelector(`input[name="pc-item-${itemNumber}"][value="${value}"]`);
    assert(input, `missing PCL-5 input ${itemNumber}=${value}`);
    input.checked = true;
    input.dispatchEvent(new window.Event('change', { bubbles: true }));
  });
}

async function main() {
  const dom = buildPcl5Dom();
  const { window } = dom;
  const stubs = installBrowserStubs(window);

  window.eval(read('js/tools/tool-utils.js'));
  window.eval(read('js/tools/pcl5-tool.js'));

  await wait(30);

  assert(stubs.requests.includes('data/clinical/scales/pcl5.json'), 'PCL-5 schema was not requested');
  assert(stubs.requests.includes('data/clinical/sources.json'), 'Clinical sources were not requested');

  selectResponses(window, [3, 0, 0, 0, 0, 2, 0, 2, 2, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4]);
  await wait(20);

  assert.strictEqual(window.document.getElementById('pc-total').textContent, '33');
  assert.strictEqual(window.document.getElementById('pc-severity').textContent, 'Moderately severe symptoms (33-51)');
  assert.strictEqual(window.document.getElementById('pc-clusterB').textContent, '3');
  assert.strictEqual(window.document.getElementById('pc-clusterC').textContent, '2');
  assert.strictEqual(window.document.getElementById('pc-clusterD').textContent, '4');
  assert.strictEqual(window.document.getElementById('pc-clusterE').textContent, '24');
  assert.strictEqual(window.document.getElementById('pc-crit-b').textContent, 'Met');
  assert.strictEqual(window.document.getElementById('pc-crit-c').textContent, 'Met');
  assert.strictEqual(window.document.getElementById('pc-crit-d').textContent, 'Met');
  assert.strictEqual(window.document.getElementById('pc-crit-e').textContent, 'Met');
  assert.strictEqual(window.document.getElementById('pc-diagnosis').textContent, 'Met');
  assert.strictEqual(window.document.getElementById('pc-cutoff').textContent, 'Above threshold (>=33)');

  window.document.getElementById('pc-report-btn').click();
  await wait(20);

  const report = stubs.getCopiedText();
  assert(report.includes('Total Score: 33/80'), 'report missing total score');
  assert(report.includes('Provisional PTSD Diagnosis: Met'), 'report missing diagnosis line');
  assert(report.includes('Criterion D (>=2 negative cognition symptoms): Met (2/7 endorsed)'), 'report missing criterion detail');
  assert(report.includes('Cut-off Score (>=33): Above threshold'), 'report missing cutoff line');
  assert(report.includes('Reference: U.S. Department of Veterans Affairs'), 'report missing VA reference');
  assert(report.includes('Reference: Blevins CA, Weathers FW'), 'report missing Blevins reference');

  dom.window.close();
  console.log('PASS: PCL-5 schema runtime smoke test passed.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

#!/usr/bin/env node
/*
 * Smoke-test the PHQ-9 runtime path that loads structured clinical data.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { JSDOM } = require('jsdom');

const ROOT = path.resolve(__dirname, '..');

function read(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

function buildPhqDom() {
  const rows = [];
  for (let i = 1; i <= 9; i += 1) {
    for (let value = 0; value <= 3; value += 1) {
      rows.push(`<input class="ph-radio" type="radio" name="ph-q${i}" value="${value}">`);
    }
  }

  return new JSDOM(`
    <!doctype html>
    <html>
      <body>
        <div id="ph-score-num"></div>
        <div id="ph-severity" class="ph-severity"></div>
        <div id="ph-item9-alert" class="ph-item9-alert"></div>
        ${rows.join('\n')}
        <button class="ph-func-btn" type="button">Not difficult at all</button>
        <button class="ph-func-btn" type="button">Somewhat difficult</button>
        <button class="ph-func-btn" type="button">Very difficult</button>
        <button class="ph-func-btn" type="button">Extremely difficult</button>
        <button id="ph-report-btn" type="button">Generate Report &amp; Copy</button>
        <button id="ph-reset-btn" type="button">Reset</button>
      </body>
    </html>
  `, {
    url: 'https://psychopharmref.test/',
    runScripts: 'outside-only',
  });
}

function installBrowserStubs(window) {
  let copiedText = '';

  window.fetch = function fetchLocalJson(url) {
    const parsed = new URL(url, window.location.href);
    const relPath = parsed.pathname.replace(/^\/+/, '');
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

  return function getCopiedText() {
    return copiedText;
  };
}

function selectResponses(window, responses) {
  responses.forEach((value, index) => {
    const itemNumber = index + 1;
    const input = window.document.querySelector(`input[name="ph-q${itemNumber}"][value="${value}"]`);
    assert(input, `missing PHQ-9 input q${itemNumber}=${value}`);
    input.checked = true;
    input.dispatchEvent(new window.Event('change', { bubbles: true }));
  });
}

async function main() {
  const dom = buildPhqDom();
  const { window } = dom;
  const getCopiedText = installBrowserStubs(window);

  window.eval(read('js/tools/tool-utils.js'));
  window.eval(read('js/tools/phq9-tool.js'));

  await new Promise(resolve => setTimeout(resolve, 20));

  selectResponses(window, [2, 2, 1, 1, 1, 1, 1, 1, 1]);

  assert.strictEqual(window.document.getElementById('ph-score-num').textContent, '11');
  assert.strictEqual(window.document.getElementById('ph-severity').textContent, 'Moderate');
  assert(window.document.getElementById('ph-item9-alert').classList.contains('visible'));

  window.document.getElementById('ph-report-btn').click();
  await new Promise(resolve => setTimeout(resolve, 20));

  const report = getCopiedText();
  assert(report.includes('Total: 11 / 27'));
  assert(report.includes('Severity: Moderate'));
  assert(report.includes('Item 9 endorsed - assess suicidal ideation and safety'));
  assert(report.includes('Reference: Kroenke K, Spitzer RL, Williams JBW.'));

  console.log('PASS: PHQ-9 schema runtime smoke test passed.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

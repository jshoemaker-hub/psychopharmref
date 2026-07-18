#!/usr/bin/env node
/*
 * Smoke-test the GAD-7 runtime path that loads structured clinical data.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { JSDOM } = require('jsdom');

const ROOT = path.resolve(__dirname, '..');

function read(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

function buildGadDom() {
  const rows = [];
  for (let i = 1; i <= 7; i += 1) {
    for (let value = 0; value <= 3; value += 1) {
      rows.push(`<input class="gad-radio" type="radio" name="gad-q${i}" value="${value}">`);
    }
  }

  return new JSDOM(`
    <!doctype html>
    <html>
      <body>
        <div id="gad-score-num"></div>
        <div id="gad-severity" class="gad-severity"></div>
        ${rows.join('\n')}
        <button class="gad-func-btn" type="button">Not difficult at all</button>
        <button class="gad-func-btn" type="button">Somewhat difficult</button>
        <button class="gad-func-btn" type="button">Very difficult</button>
        <button class="gad-func-btn" type="button">Extremely difficult</button>
        <button id="gad-report-btn" type="button">Generate Report &amp; Copy</button>
        <button id="gad-reset-btn" type="button">Reset</button>
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
    const input = window.document.querySelector(`input[name="gad-q${itemNumber}"][value="${value}"]`);
    assert(input, `missing GAD-7 input q${itemNumber}=${value}`);
    input.checked = true;
    input.dispatchEvent(new window.Event('change', { bubbles: true }));
  });
}

async function main() {
  const dom = buildGadDom();
  const { window } = dom;
  const getCopiedText = installBrowserStubs(window);

  window.eval(read('js/tools/tool-utils.js'));
  window.eval(read('js/tools/gad7-tool.js'));

  await new Promise(resolve => setTimeout(resolve, 20));

  selectResponses(window, [2, 2, 2, 2, 1, 1, 1]);

  assert.strictEqual(window.document.getElementById('gad-score-num').textContent, '11');
  assert.strictEqual(window.document.getElementById('gad-severity').textContent, 'Moderate');

  window.document.getElementById('gad-report-btn').click();
  await new Promise(resolve => setTimeout(resolve, 20));

  const report = getCopiedText();
  assert(report.includes('Total: 11 / 21'));
  assert(report.includes('Severity: Moderate'));
  assert(report.includes('Possible anxiety disorder - consider treatment plan or referral'));
  assert(report.includes('Screening threshold >=10'));
  assert(report.includes('Reference: Spitzer RL, Kroenke K, Williams JBW, Lowe B.'));

  console.log('PASS: GAD-7 schema runtime smoke test passed.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

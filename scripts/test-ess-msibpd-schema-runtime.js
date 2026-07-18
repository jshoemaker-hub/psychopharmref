#!/usr/bin/env node
/*
 * Smoke-test schema runtime paths for ESS and MSI-BPD.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { JSDOM } = require('jsdom');

const ROOT = path.resolve(__dirname, '..');

function read(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
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

function buildScaleDom(config) {
  const rows = [];
  for (let i = 1; i <= config.itemCount; i += 1) {
    for (const value of config.optionValues) {
      rows.push(`<input class="${config.radioClass}" type="radio" name="${config.inputPrefix}${i}" value="${value}">`);
    }
  }

  return new JSDOM(`
    <!doctype html>
    <html>
      <body>
        <section id="${config.sectionId}">
          <div class="section-header"></div>
        </section>
        <div id="${config.scoreElementId}"></div>
        <div id="${config.severityElementId}" class="${config.severityBaseClass}"></div>
        ${rows.join('\n')}
        <button id="${config.reportButtonId}" type="button">Generate Report</button>
        <button id="${config.resetButtonId}" type="button">Reset</button>
      </body>
    </html>
  `, {
    url: 'https://psychopharmref.test/',
    runScripts: 'outside-only',
  });
}

function selectResponses(window, config, responses) {
  responses.forEach((value, index) => {
    const itemNumber = index + 1;
    const input = window.document.querySelector(`input[name="${config.inputPrefix}${itemNumber}"][value="${value}"]`);
    assert(input, `${config.label}: missing input q${itemNumber}=${value}`);
    input.checked = true;
    input.dispatchEvent(new window.Event('change', { bubbles: true }));
  });
}

async function runCase(config) {
  const dom = buildScaleDom(config);
  const { window } = dom;
  const getCopiedText = installBrowserStubs(window);

  window.eval(read('js/tools/tool-utils.js'));
  window.eval(read(config.toolScript));

  await new Promise(resolve => setTimeout(resolve, 20));
  selectResponses(window, config, config.responses);

  assert.strictEqual(window.document.getElementById(config.scoreElementId).textContent, config.expectedScore);
  assert.strictEqual(window.document.getElementById(config.severityElementId).textContent, config.expectedSeverity);

  window.document.getElementById(config.reportButtonId).click();
  await new Promise(resolve => setTimeout(resolve, 20));

  const report = getCopiedText();
  for (const expectedText of config.expectedReportIncludes) {
    assert(report.includes(expectedText), `${config.label}: report missing "${expectedText}"`);
  }
}

async function main() {
  await runCase({
    label: 'ESS',
    toolScript: 'js/tools/ess-tool.js',
    sectionId: 'ess-tool',
    itemCount: 8,
    optionValues: [0, 1, 2, 3],
    inputPrefix: 'ess-',
    radioClass: 'es-item',
    scoreElementId: 'es-score',
    severityElementId: 'es-interp',
    severityBaseClass: 'es-interp',
    reportButtonId: 'es-report-btn',
    resetButtonId: 'es-reset-btn',
    responses: [3, 3, 3, 2, 2, 1, 1, 1],
    expectedScore: '16',
    expectedSeverity: 'Excessive daytime sleepiness - strongly consider seeking medical attention',
    expectedReportIncludes: [
      'Total: 16 / 24',
      'Severity: Excessive daytime sleepiness - strongly consider seeking medical attention',
      'Reference: Johns MW.'
    ],
  });

  await runCase({
    label: 'MSI-BPD',
    toolScript: 'js/tools/msibpd-tool.js',
    sectionId: 'msibpd-tool',
    itemCount: 10,
    optionValues: [0, 1],
    inputPrefix: 'mb-q',
    radioClass: 'mb-item',
    scoreElementId: 'mb-score',
    severityElementId: 'mb-interp',
    severityBaseClass: 'mb-interpretation',
    reportButtonId: 'mb-report-btn',
    resetButtonId: 'mb-reset-btn',
    responses: [1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    expectedScore: '7',
    expectedSeverity: 'Positive screen - symptoms highly consistent with BPD; further evaluation warranted',
    expectedReportIncludes: [
      'Total: 7 / 10',
      'Severity: Positive screen - symptoms highly consistent with BPD; further evaluation warranted',
      'cutoff of 7 or more is a positive screen',
      'Reference: Zanarini MC, Vujanovic AA'
    ],
  });

  console.log('PASS: ESS and MSI-BPD schema runtime smoke tests passed.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

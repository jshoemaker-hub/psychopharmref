#!/usr/bin/env node
/*
 * Smoke-test the PANSS schema-backed runtime path.
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
    return Promise.resolve({
      ok: true,
      status: 200,
      json: function json() {
        return Promise.resolve(JSON.parse(read(relPath)));
      },
    });
  };

  window.confirm = () => true;
  window.printBlankForm = () => {};
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

function radioInputs(prefix, itemIds) {
  return itemIds.map(itemId => {
    return [1, 2, 3, 4, 5, 6, 7].map(value => {
      return `<input type="radio" name="${prefix}-${itemId}" value="${value}">`;
    }).join('\n');
  }).join('\n');
}

function buildDom() {
  const panss6Items = ['P1', 'P2', 'P3', 'N1', 'N4', 'N6'];
  const panss30Items = [
    'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7',
    'N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7',
    'G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8',
    'G9', 'G10', 'G11', 'G12', 'G13', 'G14', 'G15', 'G16',
  ];

  return new JSDOM(`
    <!doctype html>
    <html>
      <body>
        <section id="panss-tool">
          <div class="section-header"></div>
          <button class="ps-tab-btn ps-tab-active" data-tab="panss6">PANSS-6</button>
          <button class="ps-tab-btn" data-tab="panss30">PANSS-30</button>

          <div id="panss6-tab" class="ps-tab-content ps-tab-active">
            <form id="ps-form-6">${radioInputs('ps6', panss6Items)}</form>
            <div class="ps-score-display">
              <span class="ps-6-positive"></span>
              <span class="ps-6-negative"></span>
              <span class="ps-6-total"></span>
            </div>
            <button id="ps6-generate" type="button">Generate Report</button>
            <button id="ps6-reset" type="button">Reset</button>
          </div>

          <div id="panss30-tab" class="ps-tab-content">
            <div class="ps-subscale-header" data-target="positive-scale"></div>
            <div id="positive-scale" class="ps-subscale-content"></div>
            <form id="ps-form-30">${radioInputs('ps30', panss30Items)}</form>
            <div class="ps-score-display">
              <span class="ps-30-positive"></span>
              <span class="ps-30-negative"></span>
              <span class="ps-30-general"></span>
              <span class="ps-30-total"></span>
              <span class="ps-30-composite"></span>
              <span class="ps-30-severity"></span>
              <span class="ps-marder-positive"></span>
              <span class="ps-marder-negative"></span>
              <span class="ps-marder-disorg"></span>
              <span class="ps-marder-hostile"></span>
              <span class="ps-marder-anxiety"></span>
            </div>
            <button id="ps30-generate" type="button">Generate Report</button>
            <button id="ps30-reset" type="button">Reset</button>
          </div>
        </section>
      </body>
    </html>
  `, {
    url: 'https://psychopharmref.test/',
    runScripts: 'outside-only',
  });
}

function selectRadio(window, name, value) {
  const input = window.document.querySelector(`input[name="${name}"][value="${value}"]`);
  assert(input, `missing input ${name}=${value}`);
  input.checked = true;
  input.dispatchEvent(new window.Event('change', { bubbles: true }));
}

async function runCase() {
  const dom = buildDom();
  const { window } = dom;
  const stubs = installBrowserStubs(window);

  window.eval(read('js/tools/tool-utils.js'));
  window.eval(read('js/tools/panss-tool.js'));
  await wait(30);

  assert(stubs.requests.includes('data/clinical/scales/panss.json'), 'PANSS schema was not requested');
  assert(stubs.requests.includes('data/clinical/sources.json'), 'Clinical sources were not requested');

  selectRadio(window, 'ps6-P1', 3);
  selectRadio(window, 'ps6-P2', 4);
  selectRadio(window, 'ps6-P3', 5);
  selectRadio(window, 'ps6-N1', 2);
  selectRadio(window, 'ps6-N4', 3);
  selectRadio(window, 'ps6-N6', 4);
  await wait(20);

  assert.strictEqual(window.document.querySelector('.ps-6-positive').textContent, '12');
  assert.strictEqual(window.document.querySelector('.ps-6-negative').textContent, '9');
  assert.strictEqual(window.document.querySelector('.ps-6-total').textContent, '21');

  window.document.getElementById('ps6-generate').click();
  await wait(20);
  assert(stubs.getCopiedText().includes('PANSS-6 (Brief Psychosis Assessment)'), 'PANSS-6 report missing heading');
  assert(stubs.getCopiedText().includes('P2. Conceptual Disorganization: 4'), 'PANSS-6 report missing schema item label');
  assert(stubs.getCopiedText().includes('Total PANSS-6: 21/42'), 'PANSS-6 report missing total');

  const panss30Items = [
    'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7',
    'N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7',
    'G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8',
    'G9', 'G10', 'G11', 'G12', 'G13', 'G14', 'G15', 'G16',
  ];
  panss30Items.forEach(itemId => selectRadio(window, `ps30-${itemId}`, 1));
  selectRadio(window, 'ps30-P1', 7);
  selectRadio(window, 'ps30-P3', 6);
  selectRadio(window, 'ps30-G9', 5);
  await wait(20);

  assert.strictEqual(window.document.querySelector('.ps-30-positive').textContent, '18');
  assert.strictEqual(window.document.querySelector('.ps-30-negative').textContent, '7');
  assert.strictEqual(window.document.querySelector('.ps-30-general').textContent, '20');
  assert.strictEqual(window.document.querySelector('.ps-30-total').textContent, '45');
  assert.strictEqual(window.document.querySelector('.ps-30-composite').textContent, '+11');
  assert.strictEqual(window.document.querySelector('.ps-marder-positive').textContent, '20');

  window.document.getElementById('ps30-generate').click();
  await wait(20);
  assert(stubs.getCopiedText().includes('TOTAL PANSS: 45/210'), 'PANSS-30 report missing total');
  assert(stubs.getCopiedText().includes('G16. Active Social Avoidance: 1'), 'PANSS-30 report missing schema item label');
  assert(stubs.getCopiedText().includes('Positive Symptoms (P1,P3,P5,P6,G9): 20/35'), 'PANSS-30 report missing Marder positive factor');

  dom.window.close();
}

runCase()
  .then(() => {
    console.log('PASS: PANSS schema runtime smoke test passed.');
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

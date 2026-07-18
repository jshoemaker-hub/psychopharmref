#!/usr/bin/env node
/*
 * Regression test for schema-driven scale tools in the full page lazy-loader.
 *
 * Reproduces the stale-helper shape that can happen when a browser cached an
 * older tool-utils.js before these tools moved to ToolUtils.createScaleTool().
 */

const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole, requestInterceptor } = require('jsdom');

const ROOT = path.resolve(__dirname, '..');

const CASES = [
  {
    label: 'PHQ-9',
    sectionId: 'phq9-tool',
    inputSelector: 'input[name="ph-q9"][value="1"]',
    scoreElementId: 'ph-score-num',
    expectedScore: '1',
    severityElementId: 'ph-severity',
    expectedSeverity: '1 / 9 answered',
    alertElementId: 'ph-item9-alert',
  },
  {
    label: 'GAD-7',
    sectionId: 'gad7-tool',
    inputSelector: 'input[name="gad-q1"][value="3"]',
    scoreElementId: 'gad-score-num',
    expectedScore: '3',
    severityElementId: 'gad-severity',
    expectedSeverity: '1 / 7 answered',
  },
  {
    label: 'ESS',
    sectionId: 'ess-tool',
    inputSelector: 'input[name="ess-1"][value="3"]',
    scoreElementId: 'es-score',
    expectedScore: '3',
    severityElementId: 'es-interp',
    expectedSeverity: '1 / 8 answered',
  },
  {
    label: 'MSI-BPD',
    sectionId: 'msibpd-tool',
    inputSelector: 'input[name="mb-q1"][value="1"]',
    scoreElementId: 'mb-score',
    expectedScore: '1',
    severityElementId: 'mb-interp',
    expectedSeverity: '1 / 10 answered',
  },
  {
    label: 'BPRS',
    sectionId: 'bprs-tool',
    inputSelector: 'input[name="bp-item1"][value="3"]',
    scoreElementId: 'bp-total-score',
    expectedScore: '3',
    severityElementId: 'bp-severity',
    expectedSeverity: 'Below Mild',
    requiredToolUtilsMethod: 'loadClinicalScale',
  },
  {
    label: 'PCL-5',
    sectionId: 'pcl5-tool',
    inputSelector: 'input[name="pc-item-1"][value="3"]',
    scoreElementId: 'pc-total',
    expectedScore: '3',
    severityElementId: 'pc-severity',
    expectedSeverity: 'Minimal symptoms (0-10)',
    requiredToolUtilsMethod: 'loadClinicalScale',
  },
  {
    label: 'YMRS',
    sectionId: 'ymrs-tool',
    inputSelector: 'input[name="ym-item1"][value="3"]',
    scoreElementId: 'ym-total-score',
    expectedScore: '3',
    severityElementId: 'ym-severity-level',
    expectedSeverity: 'Remission',
    requiredToolUtilsMethod: 'loadClinicalScale',
  },
  {
    label: 'Y-BOCS',
    sectionId: 'ybocs-tool',
    inputSelector: 'input[name="yb-item-1"][value="2"]',
    scoreElementId: 'yb-total-score',
    expectedScore: '2',
    severityElementId: 'yb-severity-badge',
    expectedSeverity: 'Subclinical',
    requiredToolUtilsMethod: 'loadClinicalScale',
    extraInputSelectors: [
      'input[name="yb-item-2"][value="2"]',
      'input[name="yb-item-3"][value="2"]',
      'input[name="yb-item-4"][value="2"]',
      'input[name="yb-item-5"][value="2"]',
      'input[name="yb-item-6"][value="2"]',
      'input[name="yb-item-7"][value="2"]',
      'input[name="yb-item-8"][value="2"]',
      'input[name="yb-item-9"][value="2"]',
      'input[name="yb-item-10"][value="2"]',
    ],
    expectedScoreAfterExtraInputs: '20',
    expectedSeverityAfterExtraInputs: 'Moderate',
    reportButtonId: 'yb-generate-btn',
    expectedReportText: 'Total Score: 20/40',
  },
  {
    label: 'AIMS',
    sectionId: 'aims-tool',
    inputSelector: 'input[name="ai-item1"][value="2"]',
    scoreElementId: 'ai-total-score',
    expectedScore: '2/28',
    severityElementId: 'ai-severity-level',
    expectedSeverity: 'Minimal Dyskinesia',
    requiredToolUtilsMethod: 'loadClinicalScale',
  },
  {
    label: 'BFCRS',
    sectionId: 'bfcrs-tool',
    inputSelector: 'input[name="bf-crs-1"][value="1"]',
    scoreElementId: 'bf-crs-severity',
    expectedScore: '1',
    severityElementId: 'bf-crs-interpretation',
    expectedSeverity: 'Mild catatonia',
    requiredToolUtilsMethod: 'loadClinicalScale',
    reportButtonId: 'bf-crs-generate',
    expectedReportText: 'Severity Score: 1/69',
  },
  {
    label: 'CIWA-Ar',
    sectionId: 'ciwa-tool',
    inputSelector: 'input[name="ciwa-item1"][value="4"]',
    scoreElementId: 'ciwa-total-score',
    expectedScore: '4',
    severityElementId: 'ciwa-severity-level',
    expectedSeverity: 'Minimal to mild withdrawal',
    requiredToolUtilsMethod: 'loadClinicalScale',
    reportButtonId: 'ciwa-report-btn',
    expectedReportText: 'Total Score: 4 / 67',
  },
  {
    label: 'COWS',
    sectionId: 'cows-tool',
    inputSelector: 'input[name="cows-item1"][value="4"]',
    scoreElementId: 'cows-total-score',
    expectedScore: '4',
    severityElementId: 'cows-severity-level',
    expectedSeverity: 'No significant withdrawal',
    requiredToolUtilsMethod: 'loadClinicalScale',
    reportButtonId: 'cows-report-btn',
    expectedReportText: 'Total Score: 4 / 48',
  },
  {
    label: 'SUD',
    sectionId: 'sud-tool',
    inputSelector: '#sud-substance',
    selectValue: 'opioid',
    scoreElementId: 'sud-count',
    expectedScore: '0',
    severityElementId: 'sud-severity',
    expectedSeverity: 'NO SUD',
    requiredToolUtilsMethod: 'loadClinicalScale',
  },
  {
    label: 'ASRS',
    sectionId: 'asrs-tool',
    inputSelector: 'input[name="asrs-1"][value="2"]',
    scoreElementId: 'as-parta-count',
    expectedScore: '\u2014',
    severityElementId: 'as-parta-result',
    expectedSeverity: '\u2014',
    requiredToolUtilsMethod: 'loadClinicalScale',
  },
  {
    label: 'CIDI',
    sectionId: 'cidi-tool',
    inputSelector: 'input[name="ci-q1"][value="yes"]',
    scoreElementId: 'ci-score-text',
    expectedScore: '\u2014',
    severityElementId: 'ci-score-text',
    expectedSeverity: '\u2014',
    requiredToolUtilsMethod: 'loadClinicalScale',
  },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function contentType(filePath) {
  if (filePath.endsWith('.js')) return 'application/javascript';
  if (filePath.endsWith('.css')) return 'text/css';
  if (filePath.endsWith('.json')) return 'application/json';
  if (filePath.endsWith('.html')) return 'text/html';
  return 'text/plain';
}

async function runCase(testCase) {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const messages = [];
  const requests = [];
  let copiedText = '';
  const virtualConsole = new VirtualConsole();

  ['error', 'warn'].forEach(level => {
    virtualConsole.on(level, (...args) => messages.push(args.map(String).join(' ')));
  });
  virtualConsole.on('jsdomError', err => {
    if (!/Could not load script: "https:\/\/|HTMLCanvasElement's getContext|reading 'setTransform'/.test(err.message)) {
      messages.push(err.message);
    }
  });

  const dom = new JSDOM(html, {
    url: 'https://psychopharmref.test/',
    runScripts: 'dangerously',
    resources: {
      interceptors: [
        requestInterceptor(async request => {
          const parsed = new URL(request.url);
          if (parsed.origin !== 'https://psychopharmref.test') return undefined;

          const relPath = parsed.pathname.replace(/^\/+/, '') || 'index.html';
          const filePath = path.join(ROOT, relPath);
          requests.push(relPath);

          try {
            const body = await fs.promises.readFile(filePath, 'utf8');
            return new Response(body, {
              status: 200,
              headers: { 'Content-Type': contentType(filePath) },
            });
          } catch (err) {
            return new Response('', { status: 404 });
          }
        }),
      ],
    },
    pretendToBeVisual: true,
    virtualConsole,
    beforeParse(window) {
      window.fetch = function fetchLocalJson(url) {
        const parsed = new URL(url, window.location.href);
        const filePath = path.join(ROOT, parsed.pathname.replace(/^\/+/, ''));
        return fs.promises.readFile(filePath, 'utf8').then(text => ({
          ok: true,
          status: 200,
          json: () => Promise.resolve(JSON.parse(text)),
        }));
      };
      window.confirm = () => true;
      Object.defineProperty(window.navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText(text) {
            copiedText = text;
            return Promise.resolve();
          },
        },
      });

      // Simulate an older helper already loaded in a long-lived browser tab.
      window.ToolUtils = {
        copyWithButton: () => Promise.resolve(),
        confirmReset: (message, callback) => callback(),
        dateStamp: () => 'July 18, 2026',
      };
    },
  });

  try {
    await new Promise(resolve => dom.window.addEventListener('load', resolve));
    await wait(50);

    dom.window.switchSection(testCase.sectionId);
    await wait(300);

    const requiredToolUtilsMethod = testCase.requiredToolUtilsMethod || 'createScaleTool';
    assert(
      typeof dom.window.ToolUtils[requiredToolUtilsMethod] === 'function',
      `${testCase.label}: tool-utils.js was not refreshed for schema-driven runtime`
    );
    assert(
      requests.some(relPath => relPath === 'js/tools/tool-utils.js'),
      `${testCase.label}: lazy loader did not request tool-utils.js when stale helper was present`
    );

    const input = dom.window.document.querySelector(testCase.inputSelector);
    assert(input, `${testCase.label}: missing test input`);
    if (testCase.selectValue !== undefined) {
      input.value = testCase.selectValue;
    } else {
      input.checked = true;
    }
    input.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    await wait(50);

    const scoreEl = dom.window.document.getElementById(testCase.scoreElementId);
    assert(scoreEl.textContent === testCase.expectedScore, `${testCase.label}: score did not update`);

    const severityEl = dom.window.document.getElementById(testCase.severityElementId);
    assert(
      severityEl.textContent === testCase.expectedSeverity,
      `${testCase.label}: answered count did not update`
    );

    if (testCase.alertElementId) {
      const alert = dom.window.document.getElementById(testCase.alertElementId);
      assert(alert.classList.contains('visible'), `${testCase.label}: safety alert did not become visible`);
    }

    for (const selector of testCase.extraInputSelectors || []) {
      const extraInput = dom.window.document.querySelector(selector);
      assert(extraInput, `${testCase.label}: missing extra test input ${selector}`);
      extraInput.checked = true;
      extraInput.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    }

    if (testCase.extraInputSelectors) {
      await wait(50);
      assert(
        scoreEl.textContent === testCase.expectedScoreAfterExtraInputs,
        `${testCase.label}: full score did not update`
      );
      assert(
        severityEl.textContent === testCase.expectedSeverityAfterExtraInputs,
        `${testCase.label}: full severity did not update`
      );
    }

    if (testCase.reportButtonId) {
      const reportButton = dom.window.document.getElementById(testCase.reportButtonId);
      assert(reportButton, `${testCase.label}: missing report button`);
      reportButton.click();
      await wait(50);
      assert(copiedText.includes(testCase.expectedReportText), `${testCase.label}: report copy did not include expected text`);
    }
  } finally {
    dom.window.close();
  }

  if (messages.length) {
    throw new Error(`${testCase.label}: unexpected lazy-loader console messages:\n${messages.join('\n')}`);
  }
}

async function main() {
  for (const testCase of CASES) {
    await runCase(testCase);
  }

  console.log('PASS: Schema scale page lazy-loader refresh tests passed.');
}

main().catch(err => {
  console.error(err.stack || err.message);
  process.exit(1);
});

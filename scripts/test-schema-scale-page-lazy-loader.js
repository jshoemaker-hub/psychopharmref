#!/usr/bin/env node
/*
 * Regression test for schema-driven scale tools in the full page lazy-loader.
 *
 * Reproduces the stale-helper shape that can happen when a browser cached an
 * older tool-utils.js before PHQ-9/GAD-7 moved to ToolUtils.createScaleTool().
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

    assert(
      typeof dom.window.ToolUtils.createScaleTool === 'function',
      `${testCase.label}: tool-utils.js was not refreshed for schema-driven runtime`
    );
    assert(
      requests.some(relPath => relPath === 'js/tools/tool-utils.js'),
      `${testCase.label}: lazy loader did not request tool-utils.js when stale helper was present`
    );

    const input = dom.window.document.querySelector(testCase.inputSelector);
    assert(input, `${testCase.label}: missing test input`);
    input.checked = true;
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

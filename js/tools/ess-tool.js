(function() {
  var FALLBACK_SCALE = {
    id: 'ess',
    short_title: 'ESS',
    score: { max: 24, item_count: 8 },
    options: [
      { value: 0, label: 'Would never nod off' },
      { value: 1, label: 'Slight chance' },
      { value: 2, label: 'Moderate chance' },
      { value: 3, label: 'High chance' }
    ],
    items: [
      { id: 'ess-1', number: 1, text: 'Sitting and reading' },
      { id: 'ess-2', number: 2, text: 'Watching TV' },
      { id: 'ess-3', number: 3, text: 'Sitting, inactive, in a public place (e.g., meeting, theater, dinner event)' },
      { id: 'ess-4', number: 4, text: 'As a passenger in a car for an hour or more without a break' },
      { id: 'ess-5', number: 5, text: 'Lying down to rest when circumstances permit' },
      { id: 'ess-6', number: 6, text: 'Sitting and talking to someone' },
      { id: 'ess-7', number: 7, text: 'Sitting quietly after a meal without alcohol' },
      { id: 'ess-8', number: 8, text: 'In a car, while stopped for a few minutes in traffic or at a light' }
    ],
    severity_bands: [
      { min: 0, max: 7, label: 'Unlikely that you are abnormally sleepy', class: 'es-normal', action: 'Monitor clinically; no abnormal daytime sleepiness suggested by score alone' },
      { min: 8, max: 9, label: 'Average amount of daytime sleepiness', class: 'es-average', action: 'Monitor symptoms and context; reassess if impairment or safety concerns are present' },
      { min: 10, max: 15, label: 'Excessive daytime sleepiness - further evaluation recommended', class: 'es-excessive', action: 'Consider formal sleep evaluation and review sleep, medication, and medical contributors' },
      { min: 16, max: 24, label: 'Excessive daytime sleepiness - strongly consider seeking medical attention', class: 'es-excessive', action: 'Strongly consider physician or sleep-medicine evaluation, especially with driving or occupational risk' }
    ],
    report: {
      heading: 'Epworth Sleepiness Scale (ESS)',
      scoring_note: 'Scoring: 0-7 unlikely abnormal sleepiness, 8-9 average daytime sleepiness, 10-15 excessive daytime sleepiness, 16-24 high excessive daytime sleepiness.'
    },
    references: [
      { label: 'Johns MW. A new method for measuring daytime sleepiness: the Epworth sleepiness scale. Sleep. 1991;14(6):540-545.' }
    ]
  };

  ToolUtils.createScaleTool({
    scaleId: 'ess',
    fallbackScale: FALLBACK_SCALE,
    inputNamePrefix: 'ess-',
    radioSelector: '.es-item',
    functionalButtonSelector: '.es-func-btn',
    scoreElementId: 'es-score',
    severityElementId: 'es-interp',
    severityBaseClass: 'es-interp',
    incompleteSeverityClass: 'es-normal',
    reportButtonId: 'es-report-btn',
    resetButtonId: 'es-reset-btn',
    resetConfirmMessage: 'Reset all ESS responses?',
    reportHeading: 'Epworth Sleepiness Scale (ESS)',
    schemaErrorLabel: 'ESS'
  });

  (function addPrintBtn() {
    var sec = document.getElementById('ess-tool');
    if (!sec) return;
    var header = sec.querySelector('.section-header');
    if (!header) return;
    var btn = document.createElement('button');
    btn.className = 'pf-inline-btn';
    btn.onclick = function() { if (typeof printBlankForm === 'function') printBlankForm('epworth'); };
    btn.innerHTML = '🖨️ Print Blank Form';
    btn.title = 'Print a blank version of this form';
    header.appendChild(btn);
  })();
})();

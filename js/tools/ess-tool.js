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
      { min: 0, max: 5, label: 'Lower normal daytime sleepiness', class: 'es-normal', action: 'Within the normal range; no excessive daytime sleepiness suggested by score alone' },
      { min: 6, max: 10, label: 'Higher normal daytime sleepiness', class: 'es-average', action: 'Upper end of normal; monitor if symptoms, impairment, or safety concerns are present' },
      { min: 11, max: 12, label: 'Mild excessive daytime sleepiness', class: 'es-excessive', action: 'Excessive daytime sleepiness (ESS >10); review sleep, medication, and medical contributors' },
      { min: 13, max: 15, label: 'Moderate excessive daytime sleepiness', class: 'es-excessive', action: 'Consider formal sleep evaluation; review sleep, medication, and medical contributors' },
      { min: 16, max: 24, label: 'Severe excessive daytime sleepiness', class: 'es-excessive', action: 'Strongly consider physician or sleep-medicine evaluation, especially with driving or occupational risk' }
    ],
    report: {
      heading: 'Epworth Sleepiness Scale (ESS)',
      scoring_note: 'Scoring (Johns, current ESS bands): 0-5 lower normal, 6-10 higher normal, 11-12 mild excessive, 13-15 moderate excessive, 16-24 severe excessive daytime sleepiness. A total >10 indicates excessive daytime sleepiness.'
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

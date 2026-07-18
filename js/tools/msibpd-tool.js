(function() {
  var FALLBACK_SCALE = {
    id: 'msibpd',
    short_title: 'MSI-BPD',
    score: { max: 10, item_count: 10 },
    options: [
      { value: 0, label: 'No' },
      { value: 1, label: 'Yes' }
    ],
    items: [
      { id: 'msibpd-1', number: 1, text: 'Troubled relationships' },
      { id: 'msibpd-2', number: 2, text: 'Self-harm / suicide attempt' },
      { id: 'msibpd-3', number: 3, text: 'Impulsivity problems' },
      { id: 'msibpd-4', number: 4, text: 'Extreme moodiness' },
      { id: 'msibpd-5', number: 5, text: 'Frequent anger' },
      { id: 'msibpd-6', number: 6, text: 'Distrustfulness' },
      { id: 'msibpd-7', number: 7, text: 'Unreality / derealization' },
      { id: 'msibpd-8', number: 8, text: 'Chronic emptiness' },
      { id: 'msibpd-9', number: 9, text: 'Identity confusion' },
      { id: 'msibpd-10', number: 10, text: 'Fear of abandonment' }
    ],
    severity_bands: [
      { min: 0, max: 6, label: 'Below screening threshold', class: 'mb-negative', action: 'Continue diagnostic assessment based on clinical context' },
      { min: 7, max: 10, label: 'Positive screen - symptoms highly consistent with BPD; further evaluation warranted', class: 'mb-positive', action: 'Prompt comprehensive psychiatric evaluation for borderline personality disorder and differential diagnoses' }
    ],
    report: {
      heading: 'McLean Screening Instrument for BPD (MSI-BPD)',
      scoring_note: 'Scoring: total score 0-10; cutoff of 7 or more is a positive screen in the original validation study.',
      screening_note: 'This is a screening tool, not a diagnostic instrument. Interpret alongside clinical interview and DSM criteria.'
    },
    references: [
      { label: 'Zanarini MC, Vujanovic AA, Parachini EA, Boulanger JL, Frankenburg FR, Hennen J. A screening measure for BPD: the McLean Screening Instrument for Borderline Personality Disorder (MSI-BPD). J Pers Disord. 2003;17(6):568-573.' }
    ]
  };

  ToolUtils.createScaleTool({
    scaleId: 'msibpd',
    fallbackScale: FALLBACK_SCALE,
    inputNamePrefix: 'mb-q',
    radioSelector: '.mb-item',
    functionalButtonSelector: '.mb-func-btn',
    scoreElementId: 'mb-score',
    severityElementId: 'mb-interp',
    severityBaseClass: 'mb-interpretation',
    incompleteSeverityClass: 'mb-negative',
    reportButtonId: 'mb-report-btn',
    resetButtonId: 'mb-reset-btn',
    resetConfirmMessage: 'Reset all MSI-BPD responses?',
    reportHeading: 'McLean Screening Instrument for BPD (MSI-BPD)',
    schemaErrorLabel: 'MSI-BPD'
  });

  (function addPrintBtn() {
    var sec = document.getElementById('msibpd-tool');
    if (!sec) return;
    var header = sec.querySelector('.section-header');
    if (!header) return;
    var btn = document.createElement('button');
    btn.className = 'pf-inline-btn';
    btn.onclick = function() { if (typeof printBlankForm === 'function') printBlankForm('msibpd'); };
    btn.innerHTML = '🖨️ Print Blank Form';
    btn.title = 'Print a blank version of this form';
    header.appendChild(btn);
  })();
})();

(function() {
  var FALLBACK_SCALE = {
    id: 'gad7',
    short_title: 'GAD-7',
    score: { max: 21, item_count: 7 },
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'Over half the days' },
      { value: 3, label: 'Nearly every day' }
    ],
    items: [
      { id: 'gad7-1', number: 1, text: 'Feeling nervous, anxious, or on edge' },
      { id: 'gad7-2', number: 2, text: 'Not being able to stop or control worrying' },
      { id: 'gad7-3', number: 3, text: 'Worrying too much about different things' },
      { id: 'gad7-4', number: 4, text: 'Trouble relaxing' },
      { id: 'gad7-5', number: 5, text: "Being so restless that it's hard to sit still" },
      { id: 'gad7-6', number: 6, text: 'Becoming easily annoyed or irritable' },
      { id: 'gad7-7', number: 7, text: 'Feeling afraid as if something awful might happen' }
    ],
    severity_bands: [
      { min: 0, max: 4, label: 'Minimal', class: 'gad-sev-minimal', action: 'Monitor; reassess as needed' },
      { min: 5, max: 9, label: 'Mild', class: 'gad-sev-mild', action: 'Watchful waiting; consider re-evaluation in 2-4 weeks' },
      { min: 10, max: 14, label: 'Moderate', class: 'gad-sev-moderate', action: 'Possible anxiety disorder - consider treatment plan or referral' },
      { min: 15, max: 21, label: 'Severe', class: 'gad-sev-severe', action: 'Likely anxiety disorder - active treatment recommended' }
    ],
    report: {
      heading: 'Generalized Anxiety Disorder 7-item Scale (GAD-7)',
      scoring_note: 'Scoring: 0-4 Minimal, 5-9 Mild, 10-14 Moderate, 15-21 Severe',
      screening_note: 'Screening threshold >=10 (sensitivity 89%, specificity 82% for GAD).'
    },
    references: [
      { label: 'Spitzer RL, Kroenke K, Williams JBW, Lowe B. Arch Intern Med. 2006;166:1092-1097.' }
    ]
  };

  ToolUtils.createScaleTool({
    scaleId: 'gad7',
    fallbackScale: FALLBACK_SCALE,
    inputNamePrefix: 'gad-q',
    radioSelector: '.gad-radio',
    functionalButtonSelector: '.gad-func-btn',
    scoreElementId: 'gad-score-num',
    severityElementId: 'gad-severity',
    severityBaseClass: 'gad-severity',
    incompleteSeverityClass: 'gad-sev-minimal',
    reportButtonId: 'gad-report-btn',
    resetButtonId: 'gad-reset-btn',
    resetConfirmMessage: 'Reset all GAD-7 responses?',
    reportHeading: 'Generalized Anxiety Disorder 7-item Scale (GAD-7)',
    schemaErrorLabel: 'GAD-7'
  });
})();

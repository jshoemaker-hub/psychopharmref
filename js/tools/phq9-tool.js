(function() {
  var FALLBACK_SCALE = {
    id: 'phq9',
    short_title: 'PHQ-9',
    score: { max: 27, item_count: 9 },
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' }
    ],
    items: [
      { id: 'phq9-1', number: 1, text: 'Little interest or pleasure in doing things' },
      { id: 'phq9-2', number: 2, text: 'Feeling down, depressed, or hopeless' },
      { id: 'phq9-3', number: 3, text: 'Trouble falling or staying asleep, or sleeping too much' },
      { id: 'phq9-4', number: 4, text: 'Feeling tired or having little energy' },
      { id: 'phq9-5', number: 5, text: 'Poor appetite or overeating' },
      { id: 'phq9-6', number: 6, text: 'Feeling bad about yourself - or that you are a failure or have let yourself or your family down' },
      { id: 'phq9-7', number: 7, text: 'Trouble concentrating on things, such as reading the newspaper or watching television' },
      { id: 'phq9-8', number: 8, text: 'Moving or speaking so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual' },
      {
        id: 'phq9-9',
        number: 9,
        text: 'Thoughts that you would be better off dead or of hurting yourself in some way',
        safety_flag: {
          trigger: 'response_greater_than',
          value: 0,
          message: 'Item 9 endorsed - assess suicidal ideation and safety'
        }
      }
    ],
    severity_bands: [
      { min: 0, max: 4, label: 'None-Minimal', class: 'ph-sev-none', action: 'None indicated' },
      { min: 5, max: 9, label: 'Mild', class: 'ph-sev-mild', action: 'Watchful waiting; repeat PHQ-9 at follow-up' },
      { min: 10, max: 14, label: 'Moderate', class: 'ph-sev-moderate', action: 'Treatment plan, considering counseling, follow-up, and/or pharmacotherapy' },
      { min: 15, max: 19, label: 'Moderately Severe', class: 'ph-sev-mod-sev', action: 'Active treatment with pharmacotherapy and/or psychotherapy' },
      { min: 20, max: 27, label: 'Severe', class: 'ph-sev-severe', action: 'Immediate initiation of pharmacotherapy and, if severe impairment or poor response, expedited referral to mental health specialist' }
    ],
    report: {
      heading: 'Patient Health Questionnaire-9 (PHQ-9)',
      scoring_note: 'Scoring: 0-4 None-Minimal, 5-9 Mild, 10-14 Moderate, 15-19 Moderately Severe, 20-27 Severe'
    },
    references: [
      { label: 'Kroenke K, Spitzer RL, Williams JBW. The PHQ-9. J Gen Intern Med. 2001;16:606-613.' }
    ]
  };

  ToolUtils.createScaleTool({
    scaleId: 'phq9',
    fallbackScale: FALLBACK_SCALE,
    inputNamePrefix: 'ph-q',
    radioSelector: '.ph-radio',
    functionalButtonSelector: '.ph-func-btn',
    scoreElementId: 'ph-score-num',
    severityElementId: 'ph-severity',
    severityBaseClass: 'ph-severity',
    incompleteSeverityClass: 'ph-sev-none',
    reportButtonId: 'ph-report-btn',
    resetButtonId: 'ph-reset-btn',
    resetConfirmMessage: 'Reset all PHQ-9 responses?',
    reportHeading: 'Patient Health Questionnaire-9 (PHQ-9)',
    schemaErrorLabel: 'PHQ-9',
    safetyAlert: {
      elementId: 'ph-item9-alert',
      itemId: 'phq9-9'
    }
  });
})();

(function() {
  var fallbackScale = {
    id: 'cidi',
    title: 'CIDI 3.0 Bipolar Screening Scale',
    short_title: 'CIDI Bipolar',
    source_ids: ['kessler-2006-cidi-bipolar', 'jabfm-2012-cidi-risk'],
    score: {
      min: 0,
      max: 9,
      item_count: 9,
      method: 'threshold_count'
    },
    stem_questions: [
      { id: 'euphoria', report_label: 'Euphoria (Q1 - elevated mood)' },
      { id: 'irritability', report_label: 'Irritability (Q2 - irritable mood)' }
    ],
    gate_question: { id: 'criterion-b', report_label: 'Criterion B Gate (Q3)' },
    items: [
      { id: 'irritability', number: 1, text: 'Extreme irritability (shouting, fights, arguments)', clinical_threshold: 1 },
      { id: 'restlessness', number: 2, text: 'Restlessness or agitation (pacing, inability to sit still)', clinical_threshold: 1 },
      { id: 'disinhibition', number: 3, text: 'Unusual or embarrassing behavior (oversharing, disinhibition)', clinical_threshold: 1 },
      { id: 'grandiosity', number: 4, text: 'Inflated self-esteem or special powers/talents', clinical_threshold: 1 },
      { id: 'goal-directed', number: 5, text: 'Increased goal-directed activity (multiple new projects)', clinical_threshold: 1 },
      { id: 'concentration', number: 6, text: 'Difficulty concentrating', clinical_threshold: 1 },
      { id: 'racing', number: 7, text: 'Racing or jumping thoughts', clinical_threshold: 1 },
      { id: 'sleep', number: 8, text: 'Decreased need for sleep (4 hours or less without fatigue)', clinical_threshold: 1 },
      { id: 'spending', number: 9, text: 'Excessive spending with financial consequences', clinical_threshold: 1 }
    ],
    severity_bands: [
      { min: 0, max: 4, label: 'Very Low Risk', probability: '<5%', class: 'ci-risk-very-low', action: 'Continue differential assessment as indicated' },
      { min: 5, max: 5, label: 'Low Risk', probability: '5-24%', class: 'ci-risk-low', action: 'Consider comprehensive bipolar assessment if clinical concern remains' },
      { min: 6, max: 6, label: 'Moderate Risk', probability: '25-49%', class: 'ci-risk-moderate', action: 'Recommend comprehensive psychiatric evaluation' },
      { min: 7, max: 8, label: 'High Risk', probability: '50-79%', class: 'ci-risk-high', action: 'Recommend prompt psychiatric evaluation and safety assessment' },
      { min: 9, max: 9, label: 'Very High Risk', probability: '>=80%', class: 'ci-risk-very-high', action: 'Arrange urgent comprehensive psychiatric evaluation and safety assessment' }
    ],
    report: {
      heading: 'CIDI 3.0 Bipolar Screening Scale',
      scoring_note: 'Scoring: after a positive stem and Criterion B gate, count the 9 symptom questions endorsed yes and map the 0-9 count to the risk table.',
      screening_note: 'The CIDI bipolar screen estimates risk and does not establish a bipolar diagnosis.'
    }
  };

  var scale = fallbackScale;
  var q1Radio = document.querySelectorAll('input[name="ci-q1"]');
  var q2Radio = document.querySelectorAll('input[name="ci-q2"]');
  var q3Radio = document.querySelectorAll('input[name="ci-q3"]');
  var symptomsCheckboxes = document.querySelectorAll('input[name="ci-symptoms"]');
  var q3Group = document.getElementById('ci-q3-group');
  var symptomsContainer = document.getElementById('ci-symptoms-container');
  var reportBtn = document.getElementById('ci-report-btn');
  var resetBtn = document.getElementById('ci-reset-btn');
  var scoreText = document.getElementById('ci-score-text');
  var riskBadge = document.getElementById('ci-risk-badge');
  var probabilityText = document.getElementById('ci-probability-text');

  function getRadioValue(name) {
    var selected = document.querySelector('input[name="' + name + '"]:checked');
    return selected ? selected.value : null;
  }

  function getCheckedSymptoms() {
    return Array.from(symptomsCheckboxes).filter(function(cb) {
      return cb.checked;
    });
  }

  function getSymptomLabel(symptomId) {
    for (var i = 0; i < scale.items.length; i++) {
      if (scale.items[i].id === symptomId) return scale.items[i].text;
    }
    return symptomId;
  }

  function getSeverity(score) {
    for (var i = 0; i < scale.severity_bands.length; i++) {
      var band = scale.severity_bands[i];
      if (score >= band.min && score <= band.max) return band;
    }
    return scale.severity_bands[0];
  }

  function clearResult() {
    scoreText.textContent = '\u2014';
    riskBadge.innerHTML = '';
    probabilityText.textContent = '';
  }

  function displayNegativeScreen() {
    scoreText.textContent = 'Screen Negative';
    riskBadge.innerHTML = '<span class="ci-risk-negative">Negative Screen</span>';
    probabilityText.textContent = 'No evidence of bipolar disorder on screening.';
  }

  function displayRisk(severity, symptomCount) {
    scoreText.textContent = symptomCount + '/9 Symptoms';
    riskBadge.innerHTML = '<span class="' + severity.class + '">' + severity.label + '</span>';
    probabilityText.textContent = 'Probability of bipolar disorder: ' + severity.probability;
  }

  function updateDisplay() {
    var q1Value = getRadioValue('ci-q1');
    var q2Value = getRadioValue('ci-q2');
    var q3Value = getRadioValue('ci-q3');
    var symptomCount = getCheckedSymptoms().length;
    var stemPassed = q1Value === 'yes' || q2Value === 'yes';

    if (!stemPassed) {
      q3Group.classList.add('ci-disabled');
      symptomsContainer.classList.add('ci-disabled');
      if (q1Value === 'no' && q2Value === 'no') {
        displayNegativeScreen();
      } else {
        clearResult();
      }
      return;
    }

    q3Group.classList.remove('ci-disabled');

    if (q3Value === 'yes') {
      symptomsContainer.classList.remove('ci-disabled');
      displayRisk(getSeverity(symptomCount), symptomCount);
    } else {
      symptomsContainer.classList.add('ci-disabled');
      if (q3Value === 'no') {
        displayNegativeScreen();
      } else {
        clearResult();
      }
    }
  }

  function valueForReport(value) {
    return value ? value.toUpperCase() : 'Not answered';
  }

  function screenResultText(q1Value, q2Value, q3Value, symptomCount) {
    if (q1Value === 'no' && q2Value === 'no') return 'Negative (stem criteria not met)';
    if (q1Value !== 'yes' && q2Value !== 'yes') return 'Incomplete (stem questions not fully answered)';
    if (q3Value === 'no') return 'Negative (Criterion B gate not met)';
    if (q3Value !== 'yes') return 'Incomplete (Criterion B gate not answered)';

    var severity = getSeverity(symptomCount);
    return 'Positive: ' + severity.label + ' (' + severity.probability + ')';
  }

  function interpretationText(q1Value, q2Value, q3Value, symptomCount) {
    if (q1Value === 'no' && q2Value === 'no') {
      return 'No evidence of mood elevation or significant irritability. Bipolar disorder screening negative.';
    }
    if (q1Value !== 'yes' && q2Value !== 'yes') {
      return 'Stem questions are incomplete. Complete both stem questions before interpreting the screen.';
    }
    if (q3Value === 'no') {
      return 'Mood elevation or irritability reported, but no supporting Criterion B symptoms. Screening negative for bipolar disorder.';
    }
    if (q3Value !== 'yes') {
      return 'Criterion B gate is incomplete. Complete the gate question before interpreting the symptom count.';
    }
    if (symptomCount === 0) {
      return 'Mood elevation/irritability endorsed but no associated symptoms. Low probability of bipolar disorder.';
    }
    if (symptomCount < 5) {
      return 'Limited symptom endorsement. Consider broader differential diagnosis for mood disturbance.';
    }
    if (symptomCount < 7) {
      return 'Moderate symptom burden. Recommend comprehensive psychiatric evaluation and assessment for bipolar II or cyclothymia.';
    }
    return 'High symptom burden with significant mood dysregulation. Recommend urgent psychiatric evaluation and consideration of bipolar I or II disorder. Assess safety and need for higher level of care.';
  }

  function referenceLines() {
    return (scale.references || []).map(function(ref) {
      return ref && ref.label ? 'Reference: ' + ref.label : '';
    }).filter(Boolean);
  }

  function generateReport() {
    var q1Value = getRadioValue('ci-q1');
    var q2Value = getRadioValue('ci-q2');
    var q3Value = getRadioValue('ci-q3');
    var checkedSymptoms = getCheckedSymptoms();
    var symptomCount = checkedSymptoms.length;
    var lines = [
      (scale.report && scale.report.heading) || 'CIDI 3.0 Bipolar Screening Scale',
      'Date: ' + ToolUtils.dateStamp(),
      '',
      'Stem Questions:',
      '  ' + (scale.stem_questions[0].report_label || 'Euphoria stem') + ': ' + valueForReport(q1Value),
      '  ' + (scale.stem_questions[1].report_label || 'Irritability stem') + ': ' + valueForReport(q2Value),
      '  ' + (scale.gate_question.report_label || 'Criterion B Gate') + ': ' + valueForReport(q3Value),
      '',
      'Screen Result: ' + screenResultText(q1Value, q2Value, q3Value, symptomCount),
      ''
    ];

    if (checkedSymptoms.length > 0) {
      lines.push('Criterion B Symptoms Endorsed (' + symptomCount + '/9):');
      checkedSymptoms.forEach(function(cb) {
        lines.push('  - ' + getSymptomLabel(cb.value));
      });
      lines.push('');
    }

    lines.push('Clinical Interpretation:');
    lines.push(interpretationText(q1Value, q2Value, q3Value, symptomCount));

    if (scale.report && scale.report.scoring_note) {
      lines.push('');
      lines.push(scale.report.scoring_note);
    }
    if (scale.report && scale.report.screening_note) {
      lines.push(scale.report.screening_note);
    }
    referenceLines().forEach(function(line) {
      lines.push(line);
    });

    return lines.join('\n');
  }

  function reset() {
    ToolUtils.confirmReset('Reset all answers and scores?', function() {
      q1Radio.forEach(function(r) { r.checked = false; });
      q2Radio.forEach(function(r) { r.checked = false; });
      q3Radio.forEach(function(r) { r.checked = false; });
      symptomsCheckboxes.forEach(function(cb) { cb.checked = false; });
      clearResult();
      q3Group.classList.add('ci-disabled');
      symptomsContainer.classList.add('ci-disabled');
    });
  }

  function loadSchema() {
    if (!window.ToolUtils || typeof ToolUtils.loadClinicalScale !== 'function') return;
    ToolUtils.loadClinicalScale('cidi').then(function(loadedScale) {
      scale = loadedScale;
      updateDisplay();
    }).catch(function(err) {
      console.warn('CIDI schema unavailable; using embedded fallback.', err);
    });
  }

  q1Radio.forEach(function(r) { r.addEventListener('change', updateDisplay); });
  q2Radio.forEach(function(r) { r.addEventListener('change', updateDisplay); });
  q3Radio.forEach(function(r) { r.addEventListener('change', updateDisplay); });
  symptomsCheckboxes.forEach(function(cb) { cb.addEventListener('change', updateDisplay); });
  if (reportBtn) {
    reportBtn.addEventListener('click', function() {
      ToolUtils.copyWithButton(generateReport(), reportBtn);
    });
  }
  if (resetBtn) resetBtn.addEventListener('click', reset);

  (function addPrintBtn() {
    var sec = document.getElementById('cidi-tool');
    if (!sec) return;
    var header = sec.querySelector('.section-header');
    if (!header) return;
    var btn = document.createElement('button');
    btn.className = 'pf-inline-btn';
    btn.onclick = function() { if (typeof printBlankForm === 'function') printBlankForm('cidi'); };
    btn.textContent = 'Print Blank Form';
    btn.title = 'Print a blank version of this form';
    header.appendChild(btn);
  })();

  loadSchema();
  updateDisplay();
})();

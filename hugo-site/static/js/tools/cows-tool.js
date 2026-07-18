(function() {
  'use strict';

  var FALLBACK_SCALE = {
    id: 'cows',
    score: { min: 0, max: 48, item_count: 11, method: 'sum' },
    items: [
      { number: 1, text: 'Resting Pulse Rate', max: 4 },
      { number: 2, text: 'Sweating', max: 4 },
      { number: 3, text: 'Restlessness', max: 5 },
      { number: 4, text: 'Pupil Size', max: 5 },
      { number: 5, text: 'Bone or Joint Aches', max: 4 },
      { number: 6, text: 'Runny Nose or Tearing', max: 4 },
      { number: 7, text: 'GI Upset', max: 5 },
      { number: 8, text: 'Tremor', max: 4 },
      { number: 9, text: 'Yawning', max: 4 },
      { number: 10, text: 'Anxiety or Irritability', max: 4 },
      { number: 11, text: 'Gooseflesh Skin', max: 5 }
    ],
    severity_bands: [
      { min: 0, max: 4, label: 'No significant withdrawal', class: 'cows-severity-minimal', action: 'Minimal signs of opioid withdrawal. Buprenorphine induction not yet recommended; reassess in 1-2 hours or await further objective signs.' },
      { min: 5, max: 12, label: 'Mild withdrawal', class: 'cows-severity-mild', action: 'Mild withdrawal. Generally considered the lower threshold for initiating buprenorphine when clinically appropriate.' },
      { min: 13, max: 24, label: 'Moderate withdrawal', class: 'cows-severity-moderate', action: 'Moderate withdrawal. Appropriate for buprenorphine induction; consider adjunctive supportive medications.' },
      { min: 25, max: 36, label: 'Moderately severe withdrawal', class: 'cows-severity-msevere', action: 'Moderately severe withdrawal. Initiate treatment promptly and monitor for dehydration and electrolyte disturbance.' },
      { min: 37, max: 48, label: 'Severe withdrawal', class: 'cows-severity-severe', action: 'Severe withdrawal. Consider higher level of care, aggressive symptom control, and rapid initiation of MOUD per program.' }
    ],
    report: {
      heading: 'COWS (Clinical Opiate Withdrawal Scale)',
      scoring_note: 'Scoring: total score is the sum of 11 clinician-rated opioid withdrawal items (0-48). Item weights vary by symptom.',
      screening_note: 'Common interpretation: 5-12 mild, 13-24 moderate, 25-36 moderately severe, >36 severe.'
    },
    references: [
      { label: 'Wesson DR, Ling W. The Clinical Opiate Withdrawal Scale (COWS). J Psychoactive Drugs. 2003;35(2):253-259.' }
    ]
  };

  var scale = FALLBACK_SCALE;
  var form = document.getElementById('cows-form');
  var totalScoreEl = document.getElementById('cows-total-score');
  var severityEl = document.getElementById('cows-severity-level');
  var guidanceEl = document.getElementById('cows-guidance');
  var reportBtn = document.getElementById('cows-report-btn');
  var resetBtn = document.getElementById('cows-reset-btn');
  var summarySection = document.getElementById('cows-summary');
  var summaryGrid = document.getElementById('cows-summary-grid');
  var reasonEl = document.getElementById('cows-reason');

  function getItems() {
    return scale.items || FALLBACK_SCALE.items;
  }

  function getItemValue(itemNumber) {
    var selected = form.querySelector('input[name="cows-item' + itemNumber + '"]:checked');
    return selected ? parseInt(selected.value, 10) : 0;
  }

  function calculateScore() {
    var total = 0;
    var scores = {};
    getItems().forEach(function(item) {
      var score = getItemValue(item.number);
      total += score;
      scores[item.number] = score;
    });
    return { total: total, scores: scores };
  }

  function getSeverity(total) {
    var bands = scale.severity_bands || FALLBACK_SCALE.severity_bands;
    for (var i = 0; i < bands.length; i++) {
      if (total >= bands[i].min && total <= bands[i].max) return bands[i];
    }
    return bands[bands.length - 1];
  }

  function updateDisplay() {
    var res = calculateScore();
    var sev = getSeverity(res.total);

    totalScoreEl.textContent = res.total;
    severityEl.textContent = sev.label;
    severityEl.className = 'cows-severity-label ' + (sev.class || '');
    guidanceEl.textContent = sev.action || '';

    summaryGrid.innerHTML = '';
    getItems().forEach(function(item) {
      var score = res.scores[item.number];
      var cell = document.createElement('div');
      cell.className = 'cows-summary-item';
      cell.innerHTML =
        '<div class="cows-summary-item-label">' + item.number + '. ' + item.text + '</div>' +
        '<div><span class="cows-summary-item-score">' + score + '/' + item.max + '</span></div>';
      summaryGrid.appendChild(cell);
    });
    summarySection.classList.add('cows-show');
  }

  function generateReport() {
    var res = calculateScore();
    var sev = getSeverity(res.total);
    var reason = (reasonEl && reasonEl.value) ? reasonEl.value.trim() : '';
    var reportMeta = scale.report || FALLBACK_SCALE.report;
    var lines = [
      reportMeta.heading || 'COWS (Clinical Opiate Withdrawal Scale)',
      'Date: ' + ToolUtils.dateStamp()
    ];

    if (reason) lines.push('Reason for assessment: ' + reason);
    lines.push('');
    lines.push('Total Score: ' + res.total + ' / ' + scale.score.max);
    lines.push('Severity: ' + sev.label);
    lines.push('');
    lines.push('Individual Item Scores:');
    getItems().forEach(function(item) {
      lines.push((item.number < 10 ? '  ' : ' ') + item.number + '. ' + item.text + ': ' + res.scores[item.number] + '/' + item.max);
    });
    lines.push('');
    if (reportMeta.screening_note) lines.push(reportMeta.screening_note);
    lines.push('');
    lines.push('Clinical Interpretation: ' + (sev.action || ''));
    lines.push('');
    if (reportMeta.scoring_note) lines.push(reportMeta.scoring_note);
    (scale.references || FALLBACK_SCALE.references).forEach(function(ref) {
      if (ref && ref.label) lines.push('Reference: ' + ref.label);
    });

    return lines.join('\n');
  }

  function loadSchema() {
    if (typeof ToolUtils === 'undefined' || typeof ToolUtils.loadClinicalScale !== 'function') return;

    ToolUtils.loadClinicalScale('cows').then(function(loadedScale) {
      scale = loadedScale;
      updateDisplay();
    }).catch(function(err) {
      console.warn('COWS schema unavailable; using embedded fallback.', err);
    });
  }

  form.addEventListener('change', updateDisplay);
  reportBtn.addEventListener('click', function() {
    ToolUtils.copyWithButton(generateReport(), reportBtn);
  });
  resetBtn.addEventListener('click', function() {
    ToolUtils.confirmReset('Reset all COWS scores? This action cannot be undone.', function() {
      form.reset();
      if (reasonEl) reasonEl.value = '';
      updateDisplay();
    });
  });

  loadSchema();
  updateDisplay();
})();

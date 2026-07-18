(function() {
  'use strict';

  var FALLBACK_SCALE = {
    id: 'ciwa',
    score: { min: 0, max: 67, item_count: 10, method: 'sum' },
    items: [
      { number: 1, text: 'Nausea & Vomiting', max: 7 },
      { number: 2, text: 'Tremor', max: 7 },
      { number: 3, text: 'Paroxysmal Sweats', max: 7 },
      { number: 4, text: 'Anxiety', max: 7 },
      { number: 5, text: 'Agitation', max: 7 },
      { number: 6, text: 'Tactile Disturbances', max: 7 },
      { number: 7, text: 'Auditory Disturbances', max: 7 },
      { number: 8, text: 'Visual Disturbances', max: 7 },
      { number: 9, text: 'Headache / Fullness in Head', max: 7 },
      { number: 10, text: 'Orientation / Clouding of Sensorium', max: 4 }
    ],
    severity_bands: [
      { min: 0, max: 9, label: 'Minimal to mild withdrawal', class: 'ciwa-severity-minimal', action: 'Scores <10 do not usually require additional medication for withdrawal. Continue symptom-triggered reassessment per protocol.' },
      { min: 10, max: 15, label: 'Moderate withdrawal', class: 'ciwa-severity-moderate', action: 'Marked autonomic arousal. Consider benzodiazepine and continued frequent (q1h) reassessment.' },
      { min: 16, max: 67, label: 'Severe withdrawal', class: 'ciwa-severity-severe', action: 'Impending delirium tremens risk. Treat with benzodiazepine promptly, monitor closely, and consider higher level of care.' }
    ],
    report: {
      heading: 'CIWA-Ar (Clinical Institute Withdrawal Assessment - Alcohol, Revised)',
      scoring_note: 'Scoring: total score is the sum of 10 clinician-rated items (0-67). Item 10 is scored 0-4; all other items are scored 0-7.',
      screening_note: 'Common interpretation: <10 minimal/mild withdrawal, 10-15 moderate withdrawal, >=16 severe withdrawal.'
    },
    references: [
      { label: 'Sullivan JT, Sykora K, Schneiderman J, Naranjo CA, Sellers EM. Assessment of alcohol withdrawal: the revised Clinical Institute Withdrawal Assessment for Alcohol scale (CIWA-Ar). Br J Addict. 1989;84(11):1353-1357.' }
    ]
  };

  var scale = FALLBACK_SCALE;
  var section = document.getElementById('ciwa-tool');
  var form = document.getElementById('ciwa-form');
  var totalScoreEl = document.getElementById('ciwa-total-score');
  var severityEl = document.getElementById('ciwa-severity-level');
  var guidanceEl = document.getElementById('ciwa-guidance');
  var reportBtn = document.getElementById('ciwa-report-btn');
  var resetBtn = document.getElementById('ciwa-reset-btn');
  var summarySection = document.getElementById('ciwa-summary');
  var summaryGrid = document.getElementById('ciwa-summary-grid');
  var pulseEl = document.getElementById('ciwa-pulse');
  var bpEl = document.getElementById('ciwa-bp');

  function getItems() {
    return scale.items || FALLBACK_SCALE.items;
  }

  function getItemValue(itemNumber) {
    var selected = form.querySelector('input[name="ciwa-item' + itemNumber + '"]:checked');
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
    severityEl.className = 'ciwa-severity-label ' + (sev.class || '');
    guidanceEl.textContent = sev.action || '';

    summaryGrid.innerHTML = '';
    getItems().forEach(function(item) {
      var score = res.scores[item.number];
      var cell = document.createElement('div');
      cell.className = 'ciwa-summary-item';
      cell.innerHTML =
        '<div class="ciwa-summary-item-label">' + item.number + '. ' + item.text + '</div>' +
        '<div><span class="ciwa-summary-item-score">' + score + '/' + item.max + '</span></div>';
      summaryGrid.appendChild(cell);
    });
    summarySection.classList.add('ciwa-show');
  }

  function generateReport() {
    var res = calculateScore();
    var sev = getSeverity(res.total);
    var pulse = (pulseEl && pulseEl.value) ? pulseEl.value.trim() : '';
    var bp = (bpEl && bpEl.value) ? bpEl.value.trim() : '';
    var reportMeta = scale.report || FALLBACK_SCALE.report;
    var lines = [
      reportMeta.heading || 'CIWA-Ar (Clinical Institute Withdrawal Assessment - Alcohol, Revised)',
      'Date: ' + ToolUtils.dateStamp()
    ];

    if (pulse) lines.push('Pulse: ' + pulse + ' bpm');
    if (bp) lines.push('Blood pressure: ' + bp);
    lines.push('');
    lines.push('Total Score: ' + res.total + ' / ' + scale.score.max);
    lines.push('Severity: ' + sev.label);
    lines.push('');
    lines.push('Individual Item Scores:');
    getItems().forEach(function(item) {
      lines.push((item.number < 10 ? '  ' : ' ') + item.number + '. ' + item.text + ': ' + res.scores[item.number] + '/' + item.max);
    });
    lines.push('');
    lines.push('Clinical Interpretation: ' + (sev.action || ''));
    lines.push('');
    if (reportMeta.scoring_note) lines.push(reportMeta.scoring_note);
    if (reportMeta.screening_note) lines.push(reportMeta.screening_note);
    (scale.references || FALLBACK_SCALE.references).forEach(function(ref) {
      if (ref && ref.label) lines.push('Reference: ' + ref.label);
    });

    return lines.join('\n');
  }

  function loadSchema() {
    if (typeof ToolUtils === 'undefined' || typeof ToolUtils.loadClinicalScale !== 'function') return;

    ToolUtils.loadClinicalScale('ciwa').then(function(loadedScale) {
      scale = loadedScale;
      updateDisplay();
    }).catch(function(err) {
      console.warn('CIWA-Ar schema unavailable; using embedded fallback.', err);
    });
  }

  form.addEventListener('change', updateDisplay);
  reportBtn.addEventListener('click', function() {
    ToolUtils.copyWithButton(generateReport(), reportBtn);
  });
  resetBtn.addEventListener('click', function() {
    ToolUtils.confirmReset('Reset all CIWA-Ar scores? This action cannot be undone.', function() {
      form.reset();
      if (pulseEl) pulseEl.value = '';
      if (bpEl) bpEl.value = '';
      updateDisplay();
    });
  });

  loadSchema();
  updateDisplay();
})();

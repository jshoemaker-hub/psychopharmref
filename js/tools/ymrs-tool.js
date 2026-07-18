(function() {
  var FALLBACK_SCALE = {
    id: 'ymrs',
    short_title: 'YMRS',
    score: { min: 0, max: 60, item_count: 11, method: 'sum' },
    items: [
      { id: 'ymrs-1', number: 1, text: 'Elevated Mood', max: 4 },
      { id: 'ymrs-2', number: 2, text: 'Increased Motor Activity-Energy', max: 4 },
      { id: 'ymrs-3', number: 3, text: 'Sexual Interest', max: 4 },
      { id: 'ymrs-4', number: 4, text: 'Sleep', max: 4 },
      { id: 'ymrs-5', number: 5, text: 'Irritability', max: 8 },
      { id: 'ymrs-6', number: 6, text: 'Speech (Rate/Amount)', max: 8 },
      { id: 'ymrs-7', number: 7, text: 'Language-Thought Disorder', max: 4 },
      { id: 'ymrs-8', number: 8, text: 'Content', max: 8 },
      { id: 'ymrs-9', number: 9, text: 'Disruptive-Aggressive Behavior', max: 8 },
      { id: 'ymrs-10', number: 10, text: 'Appearance', max: 4 },
      { id: 'ymrs-11', number: 11, text: 'Insight', max: 4 }
    ],
    severity_bands: [
      { min: 0, max: 11, label: 'Remission', class: 'ym-severity-remission' },
      { min: 12, max: 19, label: 'Mild mania', class: 'ym-severity-mild' },
      { min: 20, max: 25, label: 'Moderate mania', class: 'ym-severity-moderate' },
      { min: 26, max: 60, label: 'Severe mania', class: 'ym-severity-severe' }
    ],
    report: {
      heading: 'Young Mania Rating Scale (YMRS)',
      scoring_note: 'Scoring: 11 clinician-rated items summed for a 0-60 total; items 5, 6, 8, and 9 use 0/2/4/6/8 scoring.'
    },
    references: [
      { label: 'Young RC, Biggs JT, Ziegler VE, Meyer DA. A rating scale for mania: reliability, validity and sensitivity. Br J Psychiatry. 1978;133:429-435.' }
    ]
  };

  var scale = FALLBACK_SCALE;

  var form = document.getElementById('ym-form');
  var totalScoreEl = document.getElementById('ym-total-score');
  var severityEl = document.getElementById('ym-severity-level');
  var reportBtn = document.getElementById('ym-report-btn');
  var resetBtn = document.getElementById('ym-reset-btn');
  var summarySection = document.getElementById('ym-summary');
  var summaryGrid = document.getElementById('ym-summary-grid');

  function getItems() {
    return scale.items || FALLBACK_SCALE.items;
  }

  function getSelectedValue(itemNumber) {
    var selected = form.querySelector('input[name="ym-item' + itemNumber + '"]:checked');
    return selected ? parseInt(selected.value, 10) : 0;
  }

  function calculateScore() {
    var total = 0;
    var scores = {};

    getItems().forEach(function(item) {
      var score = getSelectedValue(item.number);
      total += score;
      scores[item.number] = score;
    });

    return { total: total, scores: scores };
  }

  function getSeverityLevel(total) {
    var bands = scale.severity_bands || FALLBACK_SCALE.severity_bands;
    for (var i = 0; i < bands.length; i++) {
      if (total >= bands[i].min && total <= bands[i].max) return bands[i];
    }
    return bands[bands.length - 1];
  }

  function updateDisplay() {
    var result = calculateScore();
    var severity = getSeverityLevel(result.total);

    totalScoreEl.textContent = result.total;
    severityEl.textContent = severity.label;
    severityEl.className = 'ym-severity-label ' + (severity.class || '');

    summaryGrid.innerHTML = '';
    getItems().forEach(function(item) {
      var summaryItem = document.createElement('div');
      summaryItem.className = 'ym-summary-item';
      summaryItem.innerHTML = [
        '<div class="ym-summary-item-label">' + item.number + '. ' + item.text + '</div>',
        '<div class="ym-summary-item-score">' + result.scores[item.number] + '/' + item.max + '</div>'
      ].join('');
      summaryGrid.appendChild(summaryItem);
    });

    summarySection.classList.add('ym-show');
  }

  function generateReport() {
    var result = calculateScore();
    var severity = getSeverityLevel(result.total);
    var reportMeta = scale.report || FALLBACK_SCALE.report;
    var lines = [
      reportMeta.heading || 'Young Mania Rating Scale (YMRS)',
      'Date: ' + ToolUtils.dateStamp(),
      '',
      'Total Score: ' + result.total + '/' + scale.score.max,
      'Severity: ' + severity.label,
      ''
    ];

    if (severity.action) {
      lines.push('Clinical Note: ' + severity.action);
      lines.push('');
    } else {
      lines.push('Clinical Note: Score of ' + result.total + ' indicates ' + severity.label.toLowerCase() + '.');
      lines.push('');
    }

    lines.push('Individual Item Scores:');
    getItems().forEach(function(item) {
      lines.push('  ' + item.number + '. ' + item.text + ': ' + result.scores[item.number] + '/' + item.max);
    });

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

    ToolUtils.loadClinicalScale('ymrs').then(function(loadedScale) {
      scale = loadedScale;
      updateDisplay();
    }).catch(function(err) {
      console.warn('YMRS schema unavailable; using embedded fallback.', err);
    });
  }

  function addPrintBtn() {
    var sec = document.getElementById('ymrs-tool');
    if (!sec) return;
    var header = sec.querySelector('.section-header');
    if (!header) return;
    var btn = document.createElement('button');
    btn.className = 'pf-inline-btn';
    btn.onclick = function() { if (typeof printBlankForm === 'function') printBlankForm('ymrs'); };
    btn.innerHTML = 'Print Blank Form';
    btn.title = 'Print a blank version of this form';
    header.appendChild(btn);
  }

  function init() {
    form.addEventListener('change', updateDisplay);
    reportBtn.addEventListener('click', function() {
      ToolUtils.copyWithButton(generateReport(), reportBtn);
    });
    resetBtn.addEventListener('click', function() {
      ToolUtils.confirmReset('Reset all YMRS scores?', function() {
        form.reset();
        updateDisplay();
      });
    });

    addPrintBtn();
    loadSchema();
    updateDisplay();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

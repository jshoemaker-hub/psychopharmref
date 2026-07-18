(function() {
  var FALLBACK_SCALE = {
    id: 'bprs',
    short_title: 'BPRS',
    score: { min: 0, max: 126, item_count: 18, method: 'sum' },
    options: [
      { value: 0, label: 'Not Assessed', report_label: 'not assessed' },
      { value: 1, label: 'Not Present', report_label: 'not present' },
      { value: 2, label: 'Very Mild', report_label: 'very mild' },
      { value: 3, label: 'Mild', report_label: 'mild' },
      { value: 4, label: 'Moderate', report_label: 'moderate' },
      { value: 5, label: 'Moderately Severe', report_label: 'moderately severe' },
      { value: 6, label: 'Severe', report_label: 'severe' },
      { value: 7, label: 'Extremely Severe', report_label: 'extremely severe' }
    ],
    items: [
      { id: 'bprs-1', number: 1, text: 'Somatic Concern' },
      { id: 'bprs-2', number: 2, text: 'Anxiety' },
      { id: 'bprs-3', number: 3, text: 'Emotional Withdrawal' },
      { id: 'bprs-4', number: 4, text: 'Conceptual Disorganization' },
      { id: 'bprs-5', number: 5, text: 'Guilt Feelings' },
      { id: 'bprs-6', number: 6, text: 'Tension' },
      { id: 'bprs-7', number: 7, text: 'Mannerisms and Posturing' },
      { id: 'bprs-8', number: 8, text: 'Grandiosity' },
      { id: 'bprs-9', number: 9, text: 'Depressive Mood' },
      { id: 'bprs-10', number: 10, text: 'Hostility' },
      { id: 'bprs-11', number: 11, text: 'Suspiciousness' },
      { id: 'bprs-12', number: 12, text: 'Hallucinatory Behavior' },
      { id: 'bprs-13', number: 13, text: 'Motor Retardation' },
      { id: 'bprs-14', number: 14, text: 'Uncooperativeness' },
      { id: 'bprs-15', number: 15, text: 'Unusual Thought Content' },
      { id: 'bprs-16', number: 16, text: 'Blunted Affect' },
      { id: 'bprs-17', number: 17, text: 'Excitement' },
      { id: 'bprs-18', number: 18, text: 'Disorientation' }
    ],
    subscales: [
      { id: 'positive-symptoms', label: 'Positive Symptoms', item_numbers: [4, 8, 11, 12, 15] },
      { id: 'negative-symptoms', label: 'Negative Symptoms', item_numbers: [3, 13, 16] },
      { id: 'affective-symptoms', label: 'Affective Symptoms', item_numbers: [2, 5, 9] },
      { id: 'activation', label: 'Activation', item_numbers: [6, 7, 17] },
      { id: 'other', label: 'Other', item_numbers: [1, 10, 14, 18] }
    ],
    severity_bands: [
      { min: 0, max: 0, label: 'Not rated', display_label: '-', class: 'bp-severity-normal', action: 'No BPRS severity interpretation until at least one item is scored above not assessed' },
      { min: 1, max: 30, label: 'Below Mild', class: 'bp-severity-normal', action: 'Below the Leucht et al. mildly ill anchor; interpret with clinical interview' },
      { min: 31, max: 40, label: 'Mildly Ill', class: 'bp-severity-mild', action: 'Approximately corresponds to Clinical Global Impression mildly ill' },
      { min: 41, max: 52, label: 'Moderately Ill', class: 'bp-severity-moderate', action: 'Approximately corresponds to Clinical Global Impression moderately ill' },
      { min: 53, max: 126, label: 'Markedly Ill or Worse', class: 'bp-severity-severe', action: 'Approximately corresponds to Clinical Global Impression markedly ill or greater' }
    ],
    report: {
      heading: 'BPRS (Brief Psychiatric Rating Scale)',
      scoring_note: 'Severity anchors (Leucht et al., 2005): mildly ill ~= 31, moderately ill ~= 41, markedly ill ~= 53.'
    },
    references: [
      { label: 'Overall JE, Gorham DR. The Brief Psychiatric Rating Scale. Psychol Rep. 1962;10(3):799-812.' },
      { label: 'Leucht S, Kane JM, Kissling W, Hamann J, Etschel E, Engel R. Clinical implications of Brief Psychiatric Rating Scale scores. Br J Psychiatry. 2005;187:366-371.' }
    ]
  };

  var scale = FALLBACK_SCALE;

  function getItems() {
    return scale.items || FALLBACK_SCALE.items;
  }

  function getOptions() {
    return scale.options || FALLBACK_SCALE.options;
  }

  function getSubscales() {
    return scale.subscales || FALLBACK_SCALE.subscales;
  }

  function slugify(text) {
    return String(text || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function getValue(itemNumber) {
    var el = document.querySelector('input[name="bp-item' + itemNumber + '"]:checked');
    return el ? parseInt(el.value, 10) : 0;
  }

  function getScores() {
    return getItems().map(function(item) {
      return getValue(item.number);
    });
  }

  function totalScore(scores) {
    return scores.reduce(function(a, b) { return a + b; }, 0);
  }

  function optionLabel(value) {
    var opts = getOptions();
    for (var i = 0; i < opts.length; i++) {
      if (opts[i].value === value) return opts[i].report_label || String(opts[i].label || '').toLowerCase();
    }
    return '';
  }

  function getSeverityBand(total) {
    var bands = scale.severity_bands || FALLBACK_SCALE.severity_bands;
    for (var i = 0; i < bands.length; i++) {
      if (total >= bands[i].min && total <= bands[i].max) return bands[i];
    }
    return bands[bands.length - 1];
  }

  function severityLabel(total) {
    var band = getSeverityBand(total);
    var display = band.display_label || band.label;
    if (display === '-') display = '\u2014';
    return {
      text: display,
      reportText: band.label,
      cls: band.class || 'bp-severity-normal',
      action: band.action || ''
    };
  }

  function subscaleScore(subscale, scores) {
    return (subscale.item_numbers || []).reduce(function(sum, itemNumber) {
      return sum + (scores[itemNumber - 1] || 0);
    }, 0);
  }

  function updateScores() {
    var scores = getScores();
    var total = totalScore(scores);

    document.getElementById('bp-total-score').textContent = total;

    var sev = severityLabel(total);
    var sevEl = document.getElementById('bp-severity');
    sevEl.textContent = sev.text;
    sevEl.className = 'bp-severity-label ' + sev.cls;

    getSubscales().forEach(function(subscale) {
      var key = subscale.id || slugify(subscale.label);
      var el = document.getElementById('bp-sub-' + key);
      if (el) el.textContent = subscaleScore(subscale, scores);
    });
  }

  function generateReport() {
    var scores = getScores();
    var total = totalScore(scores);
    var sev = severityLabel(total);
    var report = scale.report || FALLBACK_SCALE.report;

    var lines = [
      report.heading || 'BPRS (Brief Psychiatric Rating Scale)',
      'Date: ' + ToolUtils.dateStamp(),
      '-------------------------------------',
      ''
    ];

    lines.push('Item Scores (0=not assessed, 1=not present, 2-7=severity):');
    getItems().forEach(function(item, index) {
      var val = scores[index];
      lines.push('  ' + item.number + '. ' + item.text + ': ' + val + ' (' + optionLabel(val) + ')');
    });

    lines.push('');
    lines.push('Subscale Scores:');
    getSubscales().forEach(function(subscale) {
      lines.push('  ' + subscale.label + ': ' + subscaleScore(subscale, scores));
    });

    lines.push('');
    lines.push('Total Score: ' + total + ' - ' + sev.reportText);
    if (sev.action) lines.push('Interpretation: ' + sev.action);
    lines.push('');
    lines.push(report.scoring_note || 'Severity anchors (Leucht et al., 2005): mildly ill ~= 31, moderately ill ~= 41, markedly ill ~= 53.');

    (scale.references || FALLBACK_SCALE.references).forEach(function(ref) {
      if (ref && ref.label) lines.push('Reference: ' + ref.label);
    });

    var btn = document.getElementById('bp-copy-btn');
    ToolUtils.copyWithButton(lines.join('\n'), btn);
  }

  function loadSchema() {
    if (typeof ToolUtils === 'undefined' || typeof ToolUtils.loadClinicalScale !== 'function') return;

    ToolUtils.loadClinicalScale('bprs').then(function(loadedScale) {
      scale = loadedScale;
      updateScores();
    }).catch(function(err) {
      console.warn('BPRS schema unavailable; using embedded fallback.', err);
    });
  }

  function init() {
    getItems().forEach(function(item) {
      var inputs = document.querySelectorAll('input[name="bp-item' + item.number + '"]');
      inputs.forEach(function(inp) {
        inp.addEventListener('change', updateScores);
      });
    });

    document.getElementById('bp-copy-btn').addEventListener('click', generateReport);
    document.getElementById('bp-reset-btn').addEventListener('click', function() {
      ToolUtils.confirmReset('Reset all BPRS scores?', function() {
        document.getElementById('bp-form').reset();
        updateScores();
      });
    });

    loadSchema();
    updateScores();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

(function() {
  var FALLBACK_SCALE = {
    id: 'aims',
    score: { min: 0, max: 28, item_count: 12, scored_item_numbers: [1, 2, 3, 4, 5, 6, 7], method: 'sum' },
    items: [
      { number: 1, text: 'Muscles of Facial Expression', max: 4 },
      { number: 2, text: 'Lips and Perioral Area', max: 4 },
      { number: 3, text: 'Jaw', max: 4 },
      { number: 4, text: 'Tongue', max: 4 },
      { number: 5, text: 'Upper Extremities', max: 4 },
      { number: 6, text: 'Lower Extremities', max: 4 },
      { number: 7, text: 'Neck, Shoulders, Hips', max: 4 },
      { number: 8, text: 'Severity of Abnormal Movements Overall', max: 4 },
      { number: 9, text: 'Incapacitation Due to Abnormal Movements', max: 4 },
      { number: 10, text: 'Patient Awareness of Abnormal Movements', max: 4 },
      { number: 11, text: 'Current Problems with Teeth and/or Dentures', max: 1 },
      { number: 12, text: 'Does Patient Usually Wear Dentures', max: 1 }
    ],
    subscales: [
      { id: 'facial-oral', label: 'Facial & Oral Movements', item_numbers: [1, 2, 3, 4], max: 16, display_element_id: 'ai-facial-score' },
      { id: 'extremity', label: 'Extremity Movements', item_numbers: [5, 6], max: 8, display_element_id: 'ai-extremity-score' },
      { id: 'trunk', label: 'Trunk Movements', item_numbers: [7], max: 4, display_element_id: 'ai-trunk-score' }
    ],
    screening_rules: [
      { id: 'td-screen', two_items_at: 2, one_item_at: 3, criterion_label: 'Schooler–Kane: ≥2 in two areas or ≥3 in one', movement_item_numbers: [1, 2, 3, 4, 5, 6, 7], global_item_number: 8, positive_label: 'POSITIVE', negative_label: 'NEGATIVE', display_element_id: 'ai-screen-status' }
    ],
    severity_bands: [
      { min: 0, max: 0, label: 'No movements rated (0)' },
      { min: 1, max: 7, label: 'Total 1–7 (descriptive)' },
      { min: 8, max: 14, label: 'Total 8–14 (descriptive)' },
      { min: 15, max: 21, label: 'Total 15–21 (descriptive)' },
      { min: 22, max: 28, label: 'Total 22–28 (descriptive)' }
    ],
    report: {
      heading: 'Abnormal Involuntary Movement Scale (AIMS)',
      scoring_note: 'Scoring: total movement score is the sum of items 1-7 (0-28). AIMS has no validated total-score severity bands; total-score bands shown here are descriptive only. Severity comes from the Schooler–Kane screen and global item 8. Items 8-10 are global judgments; items 11-12 document dental status.',
      screening_note: 'Positive TD screen uses the Schooler–Kane criterion: a rating of 2 (mild) or higher in at least two body areas (items 1-7), or 3 (moderate) or higher in at least one area. Global item 8 is reported but does not count toward the screen by itself.'
    },
    references: [
      { label: 'Guy W. ECDEU Assessment Manual for Psychopharmacology, Revised. Rockville, MD: U.S. Department of Health, Education, and Welfare; 1976:534-537.' }
    ]
  };

  var scale = FALLBACK_SCALE;
  var section = document.getElementById('aims-tool');

  function getItems() {
    return scale.items || FALLBACK_SCALE.items;
  }

  function getSubscales() {
    return scale.subscales || FALLBACK_SCALE.subscales;
  }

  function getScreenRule() {
    var rules = scale.screening_rules || FALLBACK_SCALE.screening_rules;
    return rules[0];
  }

  function getScoredItemNumbers() {
    return (scale.score && scale.score.scored_item_numbers) || FALLBACK_SCALE.score.scored_item_numbers;
  }

  function getItem(number) {
    return getItems().find(function(item) { return item.number === number; });
  }

  function getItemValue(itemNumber) {
    var selected = section.querySelector('input[name="ai-item' + itemNumber + '"]:checked');
    return selected ? parseInt(selected.value, 10) : 0;
  }

  function itemSum(itemNumbers) {
    return (itemNumbers || []).reduce(function(total, itemNumber) {
      return total + getItemValue(itemNumber);
    }, 0);
  }

  function severityForScore(score) {
    var bands = scale.severity_bands || FALLBACK_SCALE.severity_bands;
    for (var i = 0; i < bands.length; i++) {
      if (score >= bands[i].min && score <= bands[i].max) return bands[i];
    }
    return bands[bands.length - 1];
  }

  function totalMovementScore() {
    return itemSum(getScoredItemNumbers());
  }

  // Schooler–Kane research criterion: >=2 (mild) in at least two body areas
  // (items 1-7), or >=3 (moderate) in at least one. Global item 8 is reported
  // but does not count toward the screen by itself.
  function screenThresholds(rule) {
    return {
      two: rule.two_items_at != null ? rule.two_items_at : (rule.threshold != null ? rule.threshold : 2),
      one: rule.one_item_at != null ? rule.one_item_at : 3
    };
  }

  function positiveItems() {
    var rule = getScreenRule();
    var t = screenThresholds(rule);
    var items = [];
    (rule.movement_item_numbers || []).forEach(function(itemNumber) {
      var value = getItemValue(itemNumber);
      if (value >= t.two) {
        var item = getItem(itemNumber);
        items.push('Item ' + itemNumber + ' (' + item.text + '): ' + value + '/' + item.max);
      }
    });
    return items;
  }

  function isPositiveScreen() {
    var rule = getScreenRule();
    var t = screenThresholds(rule);
    var values = (rule.movement_item_numbers || []).map(getItemValue);
    var atTwo = values.filter(function(v) { return v >= t.two; }).length;
    var atOne = values.some(function(v) { return v >= t.one; });
    return atTwo >= 2 || atOne;
  }

  function updateScores() {
    getSubscales().forEach(function(subscale) {
      var el = document.getElementById(subscale.display_element_id);
      if (el) el.textContent = itemSum(subscale.item_numbers) + '/' + subscale.max;
    });

    var total = totalMovementScore();
    document.getElementById('ai-total-score').textContent = total + '/' + scale.score.max;
    var aiMove = (getScreenRule().movement_item_numbers || [1, 2, 3, 4, 5, 6, 7]);
    var aiAnswered = ToolUtils.countAnswered(section, aiMove.map(function(n) { return 'ai-item' + n; }));
    var aiComplete = aiAnswered >= aiMove.length;
    var aiGlobalEl = document.getElementById('ai-global-severity');
    if (aiGlobalEl) {
      var g8 = getItemValue(8);
      var g8Answered = ToolUtils.countAnswered(section, ['ai-item8']) >= 1;
      aiGlobalEl.textContent = g8Answered ? (g8 + '/4 — ' + GLOBAL8_ANCHORS[g8]) : '—';
    }
    var aiSevEl = document.getElementById('ai-severity-level');
    aiSevEl.textContent = aiComplete ? severityForScore(total).label : ToolUtils.incompleteText(aiAnswered, aiMove.length) + ' (items 1–7)';
    aiSevEl.classList.toggle('scale-incomplete', !aiComplete);

    var rule = getScreenRule();
    var screenElement = document.getElementById(rule.display_element_id);
    var positive = isPositiveScreen();
    screenElement.textContent = positive ? rule.positive_label : rule.negative_label;
    screenElement.classList.toggle('ai-severity-positive', positive);
    screenElement.classList.toggle('ai-severity-negative', !positive);
  }

  var GLOBAL8_ANCHORS = ['None, normal', 'Minimal', 'Mild', 'Moderate', 'Severe'];

  function yesNo(itemNumber) {
    return getItemValue(itemNumber) ? 'Yes' : 'No';
  }

  function generateReport() {
    var total = totalMovementScore();
    var severity = severityForScore(total);
    var reportMeta = scale.report || FALLBACK_SCALE.report;
    var positive = isPositiveScreen();
    var rule = getScreenRule();
    var lines = [
      reportMeta.heading || 'Abnormal Involuntary Movement Scale (AIMS)',
      'Date: ' + ToolUtils.dateStamp(),
      '',
      'SUMMARY',
      '  ' + rule.label + ': ' + (positive ? rule.positive_label : rule.negative_label) + ' (' + (rule.criterion_label || 'Schooler–Kane: ≥2 in two areas or ≥3 in one') + ')',
      '  Global severity (item 8): ' + getItemValue(8) + '/4 — ' + GLOBAL8_ANCHORS[getItemValue(8)],
      '',
      'MOVEMENT RATINGS'
    ];

    getSubscales().forEach(function(subscale) {
      lines.push(subscale.label + ':');
      subscale.item_numbers.forEach(function(itemNumber) {
        var item = getItem(itemNumber);
        lines.push('  ' + item.number + '. ' + item.text + ': ' + getItemValue(item.number) + '/' + item.max);
      });
      lines.push('  Subtotal: ' + itemSum(subscale.item_numbers) + '/' + subscale.max);
      lines.push('');
    });

    lines.push('Total Movement Score: ' + total + '/' + scale.score.max);
    var aiDone = ToolUtils.countAnswered(section, (getScreenRule().movement_item_numbers || [1, 2, 3, 4, 5, 6, 7]).map(function(n) { return 'ai-item' + n; })) >= (getScreenRule().movement_item_numbers || [1, 2, 3, 4, 5, 6, 7]).length;
    lines.push('Total-score band (descriptive, not validated): ' + (aiDone ? severity.label : 'Not classified (not all movement items 1-7 rated)'));
    lines.push('');
    lines.push('GLOBAL JUDGMENTS');
    [8, 9, 10].forEach(function(itemNumber) {
      var item = getItem(itemNumber);
      lines.push('  ' + item.number + '. ' + item.text + ': ' + getItemValue(item.number) + '/' + item.max);
    });
    lines.push('');
    lines.push('DENTAL STATUS');
    lines.push('  11. Current dental/denture problems: ' + yesNo(11));
    lines.push('  12. Usually wears dentures: ' + yesNo(12));
    lines.push('');
    lines.push(rule.label + ': ' + (positive ? rule.positive_label : rule.negative_label) +
      ' (' + (rule.criterion_label || 'Schooler–Kane: ≥2 in two areas or ≥3 in one') + ')');

    var positives = positiveItems();
    if (positives.length) lines.push('Movement items rated >=2: ' + positives.join(', '));

    lines.push('');
    lines.push('Clinical Note: ' + (positive
      ? 'POSITIVE screen for tardive dyskinesia. Consider clinical correlation, duration of antipsychotic exposure, and risk factors.'
      : 'NEGATIVE screen for tardive dyskinesia. Continue baseline monitoring, particularly if patient remains on antipsychotic medications.'));
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

    ToolUtils.loadClinicalScale('aims').then(function(loadedScale) {
      scale = loadedScale;
      updateScores();
    }).catch(function(err) {
      console.warn('AIMS schema unavailable; using embedded fallback.', err);
    });
  }

  function initProcedureToggle() {
    var header = document.getElementById('ai-procedure-header');
    var content = document.getElementById('ai-procedure-content');
    if (!header || !content) return;
    header.addEventListener('click', function() {
      header.classList.toggle('ai-collapsed');
      content.classList.toggle('ai-collapsed');
    });
  }

  function resetForm() {
    section.querySelectorAll('input[type="radio"]').forEach(function(radio) {
      radio.checked = false;
    });
    updateScores();
  }

  function addPrintBtn() {
    var header = section.querySelector('.section-header');
    if (!header) return;
    var btn = document.createElement('button');
    btn.className = 'pf-inline-btn';
    btn.onclick = function() { if (typeof printBlankForm === 'function') printBlankForm('aims'); };
    btn.innerHTML = 'Print Blank Form';
    btn.title = 'Print a blank version of this form';
    header.appendChild(btn);
  }

  function init() {
    initProcedureToggle();

    section.querySelectorAll('input[type="radio"]').forEach(function(radio) {
      radio.addEventListener('change', updateScores);
    });

    document.getElementById('ai-report-btn').addEventListener('click', function() {
      ToolUtils.copyWithButton(generateReport(), document.getElementById('ai-report-btn'));
    });

    document.getElementById('ai-reset-btn').addEventListener('click', function() {
      document.getElementById('ai-reset-modal').classList.add('ai-active');
    });

    document.getElementById('ai-reset-confirm').addEventListener('click', function() {
      resetForm();
      document.getElementById('ai-reset-modal').classList.remove('ai-active');
    });

    document.getElementById('ai-reset-cancel').addEventListener('click', function() {
      document.getElementById('ai-reset-modal').classList.remove('ai-active');
    });

    document.getElementById('ai-reset-modal').addEventListener('click', function(event) {
      if (event.target.id === 'ai-reset-modal') {
        document.getElementById('ai-reset-modal').classList.remove('ai-active');
      }
    });

    addPrintBtn();
    loadSchema();
    updateScores();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

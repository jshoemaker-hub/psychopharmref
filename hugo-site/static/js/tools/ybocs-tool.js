(function() {
  var FALLBACK_SCALE = {
    id: 'ybocs',
    score: { min: 0, max: 40, item_count: 10, method: 'sum' },
    items: [
      { number: 1, text: 'Time Occupied by Obsessive Thoughts', max: 4 },
      { number: 2, text: 'Interference Due to Obsessive Thoughts', max: 4 },
      { number: 3, text: 'Distress Associated with Obsessive Thoughts', max: 4 },
      { number: 4, text: 'Resistance Against Obsessions', max: 4 },
      { number: 5, text: 'Degree of Control Over Obsessive Thoughts', max: 4 },
      { number: 6, text: 'Time Spent Performing Compulsive Behaviors', max: 4 },
      { number: 7, text: 'Interference Due to Compulsive Behaviors', max: 4 },
      { number: 8, text: 'Distress Associated with Compulsive Behavior', max: 4 },
      { number: 9, text: 'Resistance Against Compulsions', max: 4 },
      { number: 10, text: 'Degree of Control Over Compulsive Behavior', max: 4 }
    ],
    subscales: [
      { id: 'obsessions', label: 'Obsession Subtotal', item_numbers: [1, 2, 3, 4, 5], max: 20, display_element_id: 'yb-obs-subtotal' },
      { id: 'compulsions', label: 'Compulsion Subtotal', item_numbers: [6, 7, 8, 9, 10], max: 20, display_element_id: 'yb-comp-subtotal' }
    ],
    supplemental_items: [
      { id: '1b', label: 'Obsession-Free Interval' },
      { id: '6b', label: 'Compulsion-Free Interval' }
    ],
    investigational_items: [
      { id: '11', label: 'Insight' },
      { id: '12', label: 'Avoidance' },
      { id: '13', label: 'Indecisiveness' },
      { id: '14', label: 'Overvalued Responsibility' },
      { id: '15', label: 'Pervasive Slowness' },
      { id: '16', label: 'Pathological Doubting' },
      { id: '17', label: 'Global Severity' },
      { id: '18', label: 'Global Improvement' },
      { id: '19', label: 'Reliability' }
    ],
    severity_bands: [
      { min: 0, max: 7, label: 'Subclinical' },
      { min: 8, max: 15, label: 'Mild' },
      { min: 16, max: 23, label: 'Moderate' },
      { min: 24, max: 31, label: 'Severe' },
      { min: 32, max: 40, label: 'Extreme' }
    ],
    report: {
      heading: 'Yale-Brown Obsessive Compulsive Scale (Y-BOCS)',
      scoring_note: 'Scoring: items 1-5 form the obsession subtotal (0-20), items 6-10 form the compulsion subtotal (0-20), and the total ranges 0-40.',
      screening_note: 'Common interpretation bands: 0-7 subclinical, 8-15 mild, 16-23 moderate, 24-31 severe, 32-40 extreme.'
    },
    references: [
      { label: 'Goodman WK, Price LH, Rasmussen SA, Mazure C, Fleischmann RL, Hill CL, Heninger GR, Charney DS. The Yale-Brown Obsessive Compulsive Scale. I. Development, use, and reliability. Arch Gen Psychiatry. 1989;46(11):1006-1011.' }
    ]
  };

  var scale = FALLBACK_SCALE;
  var section = document.getElementById('ybocs-tool');

  function getItems() {
    return scale.items || FALLBACK_SCALE.items;
  }

  function getSubscales() {
    return scale.subscales || FALLBACK_SCALE.subscales;
  }

  function getSupplementalItems() {
    return scale.supplemental_items || FALLBACK_SCALE.supplemental_items;
  }

  function getInvestigationalItems() {
    return scale.investigational_items || FALLBACK_SCALE.investigational_items;
  }

  function getSelectedRadio(itemId) {
    var radio = section.querySelector('input[name="yb-item-' + itemId + '"]:checked');
    return radio || null;
  }

  function getSelectedValue(itemId) {
    var radio = getSelectedRadio(itemId);
    return radio ? parseInt(radio.value, 10) : 0;
  }

  function itemSum(itemNumbers) {
    return (itemNumbers || []).reduce(function(total, itemNumber) {
      return total + getSelectedValue(itemNumber);
    }, 0);
  }

  function totalScore() {
    return getItems().reduce(function(total, item) {
      return total + getSelectedValue(item.number);
    }, 0);
  }

  function severityForScore(total) {
    var bands = scale.severity_bands || FALLBACK_SCALE.severity_bands;
    for (var i = 0; i < bands.length; i++) {
      if (total >= bands[i].min && total <= bands[i].max) return bands[i];
    }
    return bands[bands.length - 1];
  }

  function updateScores() {
    getSubscales().forEach(function(subscale) {
      var el = document.getElementById(subscale.display_element_id);
      if (el) el.textContent = itemSum(subscale.item_numbers);
    });

    var total = totalScore();
    var totalEl = document.getElementById('yb-total-score');
    var severityEl = document.getElementById('yb-severity-badge');
    if (totalEl) totalEl.textContent = total;
    if (severityEl) severityEl.textContent = severityForScore(total).label;
  }

  function checkedLabels(selector) {
    var labels = [];
    section.querySelectorAll(selector).forEach(function(cb) {
      if (!cb.checked) return;
      var item = cb.closest('.yb-checklist-item');
      if (!item) return;
      var label = item.querySelector('.yb-checklist-label');
      if (label) labels.push(label.textContent.trim());
    });
    return labels;
  }

  function checklistSelections() {
    return {
      obsessionsCurrent: checkedLabels('input[type="checkbox"][class^="yb-obs-"][data-type="current"]'),
      obsessionsPast: checkedLabels('input[type="checkbox"][class^="yb-obs-"][data-type="past"]'),
      compulsionsCurrent: checkedLabels('input[type="checkbox"][class^="yb-comp-"][data-type="current"]'),
      compulsionsPast: checkedLabels('input[type="checkbox"][class^="yb-comp-"][data-type="past"]')
    };
  }

  function checklistCounts() {
    var selections = checklistSelections();
    return {
      currentObsessions: selections.obsessionsCurrent.length,
      pastObsessions: selections.obsessionsPast.length,
      currentCompulsions: selections.compulsionsCurrent.length,
      pastCompulsions: selections.compulsionsPast.length,
      totalCurrent: selections.obsessionsCurrent.length + selections.compulsionsCurrent.length,
      totalPast: selections.obsessionsPast.length + selections.compulsionsPast.length
    };
  }

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function updateChecklistSummary() {
    var counts = checklistCounts();
    setText('yb-current-obs-count', counts.currentObsessions);
    setText('yb-past-obs-count', counts.pastObsessions);
    setText('yb-current-comp-count', counts.currentCompulsions);
    setText('yb-past-comp-count', counts.pastCompulsions);
    setText('yb-total-current-count', counts.totalCurrent);
    setText('yb-total-past-count', counts.totalPast);
  }

  function investigationalAnsweredCount() {
    return getInvestigationalItems().reduce(function(total, item) {
      return total + (getSelectedRadio(item.id) ? 1 : 0);
    }, 0);
  }

  function updateInvestigationalSummary() {
    setText('yb-investigational-answered', investigationalAnsweredCount());
  }

  function formatChecklistLine(label, values) {
    return label + ' (' + values.length + '): ' + (values.length ? values.join('; ') : 'None endorsed');
  }

  function generateChecklistReport() {
    var selections = checklistSelections();
    var counts = checklistCounts();
    var lines = [
      'Y-BOCS Symptom Checklist',
      'Date: ' + ToolUtils.dateStamp(),
      '',
      formatChecklistLine('Current Obsessions', selections.obsessionsCurrent),
      formatChecklistLine('Past Obsessions', selections.obsessionsPast),
      formatChecklistLine('Current Compulsions', selections.compulsionsCurrent),
      formatChecklistLine('Past Compulsions', selections.compulsionsPast),
      '',
      'Checklist Total: ' + counts.totalCurrent + ' current / ' + counts.totalPast + ' past',
      'Note: Checklist selections are descriptive and are not included in the Y-BOCS 0-40 severity score.'
    ];

    return lines.join('\n');
  }

  function generateInvestigationalReport() {
    var items = getInvestigationalItems();
    var lines = [
      'Y-BOCS Investigational Items',
      'Date: ' + ToolUtils.dateStamp(),
      '',
      'Completed: ' + investigationalAnsweredCount() + '/' + items.length
    ];

    items.forEach(function(item) {
      var selected = getSelectedRadio(item.id);
      lines.push(item.id + '. ' + item.label + ': ' + (selected ? selected.value : 'Not rated'));
    });

    lines.push('');
    lines.push('Note: Investigational items are not included in the Y-BOCS 0-40 severity score.');

    return lines.join('\n');
  }

  function generateReport() {
    var total = totalScore();
    var severity = severityForScore(total);
    var reportMeta = scale.report || FALLBACK_SCALE.report;
    var lines = [
      reportMeta.heading || 'Yale-Brown Obsessive Compulsive Scale (Y-BOCS)',
      'Date: ' + ToolUtils.dateStamp(),
      '',
      'SEVERITY SCALE'
    ];

    getSubscales().forEach(function(subscale) {
      lines.push(subscale.label + ' (Items ' + subscale.item_numbers[0] + '-' + subscale.item_numbers[subscale.item_numbers.length - 1] + '): ' + itemSum(subscale.item_numbers) + '/' + subscale.max);
    });
    lines.push('Total Score: ' + total + '/' + scale.score.max);
    lines.push('Severity: ' + severity.label);
    lines.push('');
    lines.push('Core Item Scores:');

    getItems().forEach(function(item) {
      lines.push('  ' + item.number + '. ' + item.text + ': ' + getSelectedValue(item.number) + '/' + item.max);
    });

    lines.push('');
    lines.push('Supplemental Items (not in total):');
    getSupplementalItems().forEach(function(item) {
      lines.push('  ' + item.id + '. ' + item.label + ': ' + getSelectedValue(item.id));
    });

    lines.push('');
    lines.push('Investigational Items:');
    getInvestigationalItems().forEach(function(item) {
      lines.push('  ' + item.id + '. ' + item.label + ': ' + getSelectedValue(item.id));
    });

    var checklist = checklistSelections();

    lines.push('');
    lines.push('SYMPTOM CHECKLIST');
    lines.push('Current Obsessions: ' + (checklist.obsessionsCurrent.length ? checklist.obsessionsCurrent.join('; ') : 'None endorsed'));
    lines.push('Past Obsessions: ' + (checklist.obsessionsPast.length ? checklist.obsessionsPast.join('; ') : 'None endorsed'));
    lines.push('Current Compulsions: ' + (checklist.compulsionsCurrent.length ? checklist.compulsionsCurrent.join('; ') : 'None endorsed'));
    lines.push('Past Compulsions: ' + (checklist.compulsionsPast.length ? checklist.compulsionsPast.join('; ') : 'None endorsed'));
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

    ToolUtils.loadClinicalScale('ybocs').then(function(loadedScale) {
      scale = loadedScale;
      updateScores();
    }).catch(function(err) {
      console.warn('Y-BOCS schema unavailable; using embedded fallback.', err);
    });
  }

  function addPrintBtn() {
    var header = section.querySelector('.section-header');
    if (!header) return;
    var btn = document.createElement('button');
    btn.className = 'pf-inline-btn';
    btn.onclick = function() { if (typeof printBlankForm === 'function') printBlankForm('ybocs'); };
    btn.innerHTML = 'Print Blank Form';
    btn.title = 'Print a blank version of this form';
    header.appendChild(btn);
  }

  function init() {
    section.querySelectorAll('.yb-tab-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var tab = btn.dataset.tab;
        section.querySelectorAll('.yb-tab-btn').forEach(function(b) { b.classList.remove('yb-active'); });
        section.querySelectorAll('.yb-tab-content').forEach(function(c) { c.classList.remove('yb-active'); });
        btn.classList.add('yb-active');
        document.getElementById('yb-tab-' + tab).classList.add('yb-active');
      });
    });

    section.addEventListener('change', function(event) {
      if (event.target && event.target.matches('input[type="radio"][name^="yb-item-"]')) {
        updateScores();
        updateInvestigationalSummary();
      }
      if (event.target && event.target.matches('input[type="checkbox"]')) {
        updateChecklistSummary();
      }
    });

    var copyChecklistBtn = document.getElementById('yb-copy-checklist-btn');
    if (copyChecklistBtn) {
      copyChecklistBtn.addEventListener('click', function() {
        ToolUtils.copyWithButton(generateChecklistReport(), copyChecklistBtn);
      });
    }

    var copyInvestigationalBtn = document.getElementById('yb-copy-investigational-btn');
    if (copyInvestigationalBtn) {
      copyInvestigationalBtn.addEventListener('click', function() {
        ToolUtils.copyWithButton(generateInvestigationalReport(), copyInvestigationalBtn);
      });
    }

    var generateBtn = document.getElementById('yb-generate-btn');
    if (generateBtn) {
      generateBtn.addEventListener('click', function() {
        ToolUtils.copyWithButton(generateReport(), generateBtn);
      });
    }

    var resetBtn = document.getElementById('yb-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', function() {
        ToolUtils.confirmReset('Reset all Y-BOCS scores and checkboxes?', function() {
          section.querySelectorAll('input[type="radio"]').forEach(function(radio) { radio.checked = false; });
          section.querySelectorAll('input[type="checkbox"]').forEach(function(cb) { cb.checked = false; });
          updateScores();
          updateChecklistSummary();
          updateInvestigationalSummary();
        });
      });
    }

    addPrintBtn();
    loadSchema();
    updateScores();
    updateChecklistSummary();
    updateInvestigationalSummary();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

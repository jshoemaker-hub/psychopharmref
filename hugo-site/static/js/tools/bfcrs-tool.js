(function() {
  var FALLBACK_SCALE = {
    id: 'bfcrs',
    score: { min: 0, max: 69, item_count: 23, method: 'sum' },
    items: [
      { number: 1, text: 'Immobility/Stupor', max: 3 },
      { number: 2, text: 'Mutism', max: 3 },
      { number: 3, text: 'Staring', max: 3 },
      { number: 4, text: 'Posturing/Catalepsy', max: 3 },
      { number: 5, text: 'Grimacing', max: 3 },
      { number: 6, text: 'Echopraxia/Echolalia', max: 3 },
      { number: 7, text: 'Stereotypy', max: 3 },
      { number: 8, text: 'Mannerisms', max: 3 },
      { number: 9, text: 'Verbigeration', max: 3 },
      { number: 10, text: 'Rigidity', max: 3 },
      { number: 11, text: 'Negativism', max: 3 },
      { number: 12, text: 'Waxy Flexibility', max: 3, allowed_values: [0, 3], binary: true },
      { number: 13, text: 'Withdrawal', max: 3 },
      { number: 14, text: 'Excitement', max: 3 },
      { number: 15, text: 'Impulsivity', max: 3 },
      { number: 16, text: 'Automatic Obedience', max: 3 },
      { number: 17, text: 'Passive Obedience (Mitgehen)', max: 3, allowed_values: [0, 3], binary: true },
      { number: 18, text: 'Muscle Resistance (Gegenhalten)', max: 3, allowed_values: [0, 3], binary: true },
      { number: 19, text: 'Motorically Stuck (Ambitendency)', max: 3, allowed_values: [0, 3], binary: true },
      { number: 20, text: 'Grasp Reflex', max: 3, allowed_values: [0, 3], binary: true },
      { number: 21, text: 'Perseveration', max: 3, allowed_values: [0, 3], binary: true },
      { number: 22, text: 'Combativeness', max: 3 },
      { number: 23, text: 'Autonomic Abnormality', max: 3 }
    ],
    screening: {
      item_numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
      positive_item_threshold: 1,
      positive_screen_min_items: 2,
      positive_label: 'Positive screen - catatonia likely',
      negative_label: 'Negative screen - catatonia unlikely'
    },
    subtype_groups: [
      { id: 'retarded', label: 'Retarded/Withdrawn', item_numbers: [1, 2, 3, 4, 10, 13] },
      { id: 'excited', label: 'Excited', item_numbers: [14, 6, 7, 8, 15, 22] }
    ],
    malignant_warning: {
      item_numbers: [14, 23],
      threshold: 1,
      message: 'WARNING - Autonomic instability present with excitement. Evaluate for malignant catatonia as a medical emergency.'
    },
    severity_bands: [
      { min: 0, max: 0, label: 'No catatonia detected', class: 'negative' },
      { min: 1, max: 10, label: 'Mild catatonia', class: 'mild' },
      { min: 11, max: 20, label: 'Moderate catatonia', class: 'moderate' },
      { min: 21, max: 30, label: 'Severe catatonia', class: 'severe' },
      { min: 31, max: 69, label: 'Extreme catatonia', class: 'extreme' }
    ],
    report: {
      heading: 'Bush-Francis Catatonia Rating Scale (BFCRS)',
      screening_heading: 'Bush-Francis Catatonia Screening Instrument (BFCSI)',
      scoring_note: 'Scoring: the full BFCRS severity score is the sum of items 1-23 (0-69). Items 12 and 17-21 are binary and are scored 0 or 3 only.',
      screening_note: 'The 14-item screening instrument is positive when two or more screening items are present.'
    },
    references: [
      { label: 'Bush G, Fink M, Petrides G, Dowling F, Francis A. Catatonia. I. Rating scale and standardized examination. Acta Psychiatr Scand. 1996;93(2):129-136.' },
      { label: 'University of Rochester Medicine. Bush-Francis Catatonia Rating Scale educational resources and item scoring.' }
    ]
  };

  var scale = FALLBACK_SCALE;
  var section = document.getElementById('bfcrs-tool');

  function getItems() {
    return scale.items || FALLBACK_SCALE.items;
  }

  function getScreening() {
    return scale.screening || FALLBACK_SCALE.screening;
  }

  function getSubtypeGroups() {
    return scale.subtype_groups || FALLBACK_SCALE.subtype_groups;
  }

  function getMalignantWarning() {
    return scale.malignant_warning || FALLBACK_SCALE.malignant_warning;
  }

  function getItem(itemNumber) {
    var items = getItems();
    for (var i = 0; i < items.length; i++) {
      if (items[i].number === itemNumber) return items[i];
    }
    return null;
  }

  function itemLabel(itemNumber) {
    var item = getItem(itemNumber);
    return item ? item.text : 'Item ' + itemNumber;
  }

  function getCrsRadio(itemNumber) {
    return section.querySelector('input[name="bf-crs-' + itemNumber + '"]:checked');
  }

  function getCrsValue(itemNumber) {
    var radio = getCrsRadio(itemNumber);
    return radio ? parseInt(radio.value, 10) : 0;
  }

  function getCsiCheckbox(itemNumber) {
    return section.querySelector('input[name="bf-csi-' + itemNumber + '"]');
  }

  function itemSum(itemNumbers) {
    return (itemNumbers || []).reduce(function(total, itemNumber) {
      return total + getCrsValue(itemNumber);
    }, 0);
  }

  function severityForScore(score) {
    var bands = scale.severity_bands || FALLBACK_SCALE.severity_bands;
    for (var i = 0; i < bands.length; i++) {
      if (score >= bands[i].min && score <= bands[i].max) return bands[i];
    }
    return bands[bands.length - 1];
  }

  function crsTotalScore() {
    return getItems().reduce(function(total, item) {
      return total + getCrsValue(item.number);
    }, 0);
  }

  function crsItemsPresent() {
    return getItems().filter(function(item) {
      return getCrsValue(item.number) > 0;
    });
  }

  function csiPresentItems() {
    var screening = getScreening();
    return (screening.item_numbers || []).filter(function(itemNumber) {
      var checkbox = getCsiCheckbox(itemNumber);
      return checkbox && checkbox.checked;
    });
  }

  function crsScreeningPositiveItems() {
    var screening = getScreening();
    var threshold = screening.positive_item_threshold || 1;
    return (screening.item_numbers || []).filter(function(itemNumber) {
      return getCrsValue(itemNumber) >= threshold;
    });
  }

  function csiResultLabel(count) {
    var screening = getScreening();
    return count >= screening.positive_screen_min_items ? screening.positive_label : screening.negative_label;
  }

  function updateCSIScore() {
    var presentItems = csiPresentItems();
    var score = presentItems.length;
    var scoreEl = document.getElementById('bf-csi-score');
    var interpDiv = document.getElementById('bf-csi-interpretation');
    var listDiv = document.getElementById('bf-csi-items-list');

    if (scoreEl) scoreEl.textContent = score;
    if (interpDiv) {
      interpDiv.className = 'bf-interpretation ' + (score >= getScreening().positive_screen_min_items ? 'positive' : 'negative');
      interpDiv.textContent = csiResultLabel(score);
    }
    if (listDiv) {
      listDiv.textContent = presentItems.length
        ? 'Items present: ' + presentItems.map(itemLabel).join(', ')
        : '';
    }
  }

  function subtypeResult() {
    var total = crsTotalScore();
    if (total === 0) return '';

    var groups = getSubtypeGroups();
    var retarded = groups.find(function(group) { return group.id === 'retarded'; }) || groups[0];
    var excited = groups.find(function(group) { return group.id === 'excited'; }) || groups[1];
    var retardedScore = retarded ? itemSum(retarded.item_numbers) : 0;
    var excitedScore = excited ? itemSum(excited.item_numbers) : 0;

    if (retardedScore > excitedScore && retardedScore > 0) return 'Predominant subtype: ' + retarded.label;
    if (excitedScore > retardedScore && excitedScore > 0) return 'Predominant subtype: ' + excited.label;
    return 'Predominant subtype: Mixed';
  }

  function hasMalignantWarning() {
    var warning = getMalignantWarning();
    var threshold = warning.threshold || 1;
    return (warning.item_numbers || []).every(function(itemNumber) {
      return getCrsValue(itemNumber) >= threshold;
    });
  }

  function updateCRSScore() {
    var total = crsTotalScore();
    var present = crsItemsPresent();
    var screeningPositive = crsScreeningPositiveItems();
    var severity = severityForScore(total);
    var severityEl = document.getElementById('bf-crs-severity');
    var presentEl = document.getElementById('bf-crs-items-present');
    var screeningEl = document.getElementById('bf-crs-screening-positive');
    var interpDiv = document.getElementById('bf-crs-interpretation');
    var subtypeDiv = document.getElementById('bf-crs-subtype');
    var warningDiv = document.getElementById('bf-crs-warning');

    if (severityEl) severityEl.textContent = total;
    if (presentEl) presentEl.textContent = present.length;
    if (screeningEl) screeningEl.textContent = screeningPositive.length;
    if (interpDiv) {
      interpDiv.className = 'bf-interpretation ' + (severity.class || '');
      interpDiv.textContent = severity.label;
    }
    if (subtypeDiv) subtypeDiv.textContent = subtypeResult();
    if (warningDiv) {
      if (hasMalignantWarning()) {
        warningDiv.textContent = getMalignantWarning().message;
        warningDiv.style.display = 'block';
      } else {
        warningDiv.textContent = '';
        warningDiv.style.display = 'none';
      }
    }
  }

  function referencesLines() {
    var lines = [];
    (scale.references || FALLBACK_SCALE.references).forEach(function(ref) {
      if (ref && ref.label) lines.push('Reference: ' + ref.label);
    });
    return lines;
  }

  function generateCSIReport() {
    var reportMeta = scale.report || FALLBACK_SCALE.report;
    var presentItems = csiPresentItems();
    var lines = [
      reportMeta.screening_heading || 'Bush-Francis Catatonia Screening Instrument (BFCSI)',
      'Date: ' + ToolUtils.dateStamp(),
      '',
      'SCREENING ITEMS'
    ];

    (getScreening().item_numbers || []).forEach(function(itemNumber) {
      lines.push(itemNumber + '. ' + itemLabel(itemNumber) + ': ' + (presentItems.indexOf(itemNumber) >= 0 ? 'Present' : 'Absent'));
    });

    lines.push('');
    lines.push('Screening Score: ' + presentItems.length + '/14');
    lines.push('Result: ' + csiResultLabel(presentItems.length));
    if (presentItems.length) {
      lines.push('Items Present: ' + presentItems.map(itemLabel).join(', '));
    }
    lines.push('');
    if (reportMeta.screening_note) lines.push(reportMeta.screening_note);
    lines = lines.concat(referencesLines());

    return lines.join('\n');
  }

  function generateCRSReport() {
    var total = crsTotalScore();
    var severity = severityForScore(total);
    var present = crsItemsPresent();
    var screeningPositive = crsScreeningPositiveItems();
    var reportMeta = scale.report || FALLBACK_SCALE.report;
    var lines = [
      reportMeta.heading || 'Bush-Francis Catatonia Rating Scale (BFCRS)',
      'Date: ' + ToolUtils.dateStamp(),
      '',
      'ITEM SCORES'
    ];

    getItems().forEach(function(item) {
      var radio = getCrsRadio(item.number);
      lines.push(item.number + '. ' + item.text + ': ' + (radio ? radio.value + '/' + item.max : 'Not rated'));
    });

    lines.push('');
    lines.push('SUMMARY');
    lines.push('Severity Score: ' + total + '/' + scale.score.max);
    lines.push('Items Present: ' + present.length + '/23');
    lines.push('Screening Items Positive: ' + screeningPositive.length + '/14');
    lines.push('Severity: ' + severity.label);
    if (subtypeResult()) lines.push(subtypeResult());
    if (hasMalignantWarning()) {
      lines.push('');
      lines.push(getMalignantWarning().message);
    }
    lines.push('');
    if (reportMeta.scoring_note) lines.push(reportMeta.scoring_note);
    if (reportMeta.screening_note) lines.push(reportMeta.screening_note);
    lines = lines.concat(referencesLines());

    return lines.join('\n');
  }

  function loadSchema() {
    if (typeof ToolUtils === 'undefined' || typeof ToolUtils.loadClinicalScale !== 'function') return;

    ToolUtils.loadClinicalScale('bfcrs').then(function(loadedScale) {
      scale = loadedScale;
      updateCSIScore();
      updateCRSScore();
    }).catch(function(err) {
      console.warn('BFCRS schema unavailable; using embedded fallback.', err);
    });
  }

  function addPrintBtn() {
    var header = section.querySelector('.section-header');
    if (!header) return;
    var btn = document.createElement('button');
    btn.className = 'pf-inline-btn';
    btn.onclick = function() { if (typeof printBlankForm === 'function') printBlankForm('bfcrs'); };
    btn.innerHTML = 'Print Blank Form';
    btn.title = 'Print a blank version of this form';
    header.appendChild(btn);
  }

  function initCollapsibles() {
    section.querySelectorAll('.bf-fieldset').forEach(function(fieldset) {
      var legend = fieldset.querySelector('.bf-legend');
      if (!legend) return;
      legend.addEventListener('click', function() {
        fieldset.classList.toggle('bf-collapsed');
      });
    });
  }

  function initTabs() {
    section.querySelectorAll('.bf-tab-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var tabId = btn.getAttribute('data-tab');
        section.querySelectorAll('.bf-tab-btn').forEach(function(b) { b.classList.remove('bf-active'); });
        section.querySelectorAll('.bf-tab-content').forEach(function(t) { t.classList.remove('bf-active'); });
        btn.classList.add('bf-active');
        var tab = document.getElementById(tabId);
        if (tab) tab.classList.add('bf-active');
      });
    });
  }

  function init() {
    initCollapsibles();
    initTabs();

    section.querySelectorAll('input[name^="bf-csi-"]').forEach(function(checkbox) {
      checkbox.addEventListener('change', updateCSIScore);
    });

    section.querySelectorAll('input[name^="bf-crs-"]').forEach(function(radio) {
      radio.addEventListener('change', updateCRSScore);
    });

    var csiGenerateBtn = document.getElementById('bf-csi-generate');
    if (csiGenerateBtn) {
      csiGenerateBtn.addEventListener('click', function() {
        ToolUtils.copyWithButton(generateCSIReport(), csiGenerateBtn);
      });
    }

    var crsGenerateBtn = document.getElementById('bf-crs-generate');
    if (crsGenerateBtn) {
      crsGenerateBtn.addEventListener('click', function() {
        ToolUtils.copyWithButton(generateCRSReport(), crsGenerateBtn);
      });
    }

    addPrintBtn();
    loadSchema();
    updateCSIScore();
    updateCRSScore();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

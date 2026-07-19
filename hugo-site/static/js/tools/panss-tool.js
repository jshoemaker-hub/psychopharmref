(function() {
  'use strict';

  var FALLBACK_SCALE = {
    id: 'panss',
    short_title: 'PANSS',
    options: [
      { value: 1, label: 'Absent' },
      { value: 2, label: 'Minimal' },
      { value: 3, label: 'Mild' },
      { value: 4, label: 'Moderate' },
      { value: 5, label: 'Moderately Severe' },
      { value: 6, label: 'Severe' },
      { value: 7, label: 'Extreme' }
    ],
    items: [
      { id: 'P1', text: 'Delusions' },
      { id: 'P2', text: 'Conceptual Disorganization' },
      { id: 'P3', text: 'Hallucinatory Behavior' },
      { id: 'P4', text: 'Excitement' },
      { id: 'P5', text: 'Grandiosity' },
      { id: 'P6', text: 'Suspiciousness/Persecution' },
      { id: 'P7', text: 'Hostility' },
      { id: 'N1', text: 'Blunted Affect' },
      { id: 'N2', text: 'Emotional Withdrawal' },
      { id: 'N3', text: 'Poor Rapport' },
      { id: 'N4', text: 'Passive/Apathetic Social Withdrawal' },
      { id: 'N5', text: 'Difficulty in Abstract Thinking' },
      { id: 'N6', text: 'Lack of Spontaneity and Flow of Conversation' },
      { id: 'N7', text: 'Stereotyped Thinking' },
      { id: 'G1', text: 'Somatic Concern' },
      { id: 'G2', text: 'Anxiety' },
      { id: 'G3', text: 'Guilt Feelings' },
      { id: 'G4', text: 'Tension' },
      { id: 'G5', text: 'Mannerisms and Posturing' },
      { id: 'G6', text: 'Depression' },
      { id: 'G7', text: 'Motor Retardation' },
      { id: 'G8', text: 'Uncooperativeness' },
      { id: 'G9', text: 'Unusual Thought Content' },
      { id: 'G10', text: 'Disorientation' },
      { id: 'G11', text: 'Poor Attention' },
      { id: 'G12', text: 'Lack of Judgment and Insight' },
      { id: 'G13', text: 'Disturbance of Volition' },
      { id: 'G14', text: 'Poor Impulse Control' },
      { id: 'G15', text: 'Preoccupation' },
      { id: 'G16', text: 'Active Social Avoidance' }
    ],
    versions: [
      {
        id: 'panss-6',
        heading: 'PANSS-6 (Brief Psychosis Assessment)',
        item_ids: ['P1', 'P2', 'P3', 'N1', 'N4', 'N6'],
        max: 42,
        subscales: [
          { id: 'positive', label: 'Positive Subscale', item_ids: ['P1', 'P2', 'P3'], max: 21 },
          { id: 'negative', label: 'Negative Subscale', item_ids: ['N1', 'N4', 'N6'], max: 21 }
        ]
      },
      {
        id: 'panss-30',
        heading: 'PANSS-30 (Full Psychosis Assessment)',
        item_ids: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10', 'G11', 'G12', 'G13', 'G14', 'G15', 'G16'],
        max: 210
      }
    ],
    subscales: [
      { id: 'positive', label: 'Positive Scale', report_heading: 'POSITIVE SCALE (P1-P7)', item_ids: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7'], max: 49 },
      { id: 'negative', label: 'Negative Scale', report_heading: 'NEGATIVE SCALE (N1-N7)', item_ids: ['N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7'], max: 49 },
      { id: 'general', label: 'General Psychopathology', report_heading: 'GENERAL PSYCHOPATHOLOGY (G1-G16)', item_ids: ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10', 'G11', 'G12', 'G13', 'G14', 'G15', 'G16'], max: 112 }
    ],
    marder_factors: [
      { id: 'positive', label: 'Positive Symptoms', item_ids: ['P1', 'P3', 'P5', 'P6', 'G9'], max: 35 },
      { id: 'negative', label: 'Negative Symptoms', item_ids: ['N1', 'N2', 'N3', 'N4', 'N6', 'G7'], max: 42 },
      { id: 'disorganized', label: 'Disorganized Thought', item_ids: ['P2', 'N5', 'G11'], max: 21 },
      { id: 'hostility', label: 'Uncontrolled Hostility/Excitement', item_ids: ['P4', 'P7', 'G8', 'G14'], max: 28 },
      { id: 'anxiety', label: 'Anxiety/Depression', item_ids: ['G2', 'G3', 'G4', 'G6'], max: 28 }
    ],
    severity_bands: [
      { min: 0, max: 0, label: 'Not rated', display_label: '-' },
      { min: 1, max: 57, label: 'Mild illness' },
      { min: 58, max: 74, label: 'Moderate illness' },
      { min: 75, max: 95, label: 'Marked illness' },
      { min: 96, max: 115, label: 'Severe illness' },
      { min: 116, max: 210, label: 'Extremely severe' }
    ],
    report: {
      panss6_note: 'Interpret in clinical context alongside CGI-S rating. No formal severity cut-offs established.'
    }
  };

  var scale = FALLBACK_SCALE;

  function getItems() {
    return scale.items || FALLBACK_SCALE.items;
  }

  function getVersions() {
    return scale.versions || FALLBACK_SCALE.versions;
  }

  function getSubscales() {
    return scale.subscales || FALLBACK_SCALE.subscales;
  }

  function getMarderFactors() {
    return scale.marder_factors || FALLBACK_SCALE.marder_factors;
  }

  function findById(list, id) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  function getVersion(id) {
    return findById(getVersions(), id) || findById(FALLBACK_SCALE.versions, id);
  }

  function getItem(id) {
    return findById(getItems(), id) || findById(FALLBACK_SCALE.items, id) || { id: id, text: id };
  }

  function getSeverity(total) {
    var bands = scale.severity_bands || FALLBACK_SCALE.severity_bands;
    for (var i = 0; i < bands.length; i++) {
      if (total >= bands[i].min && total <= bands[i].max) return bands[i];
    }
    return bands[bands.length - 1];
  }

  function getForm(prefix) {
    return document.getElementById(prefix === 'ps6' ? 'ps-form-6' : 'ps-form-30');
  }

  function getScore(prefix, itemId) {
    var form = getForm(prefix);
    if (!form) return 0;
    var checked = form.querySelector('input[name="' + prefix + '-' + itemId + '"]:checked');
    return checked ? parseInt(checked.value, 10) : 0;
  }

  function sumItems(prefix, itemIds) {
    return (itemIds || []).reduce(function(sum, itemId) {
      return sum + getScore(prefix, itemId);
    }, 0);
  }

  function setText(selector, value) {
    var el = document.querySelector(selector);
    if (el) el.textContent = value;
  }

  function displayScore(score) {
    return score > 0 ? String(score) : '\u2014';
  }

  function formatComposite(score) {
    return score > 0 ? '+' + score : String(score);
  }

  function dateStamp() {
    if (window.ToolUtils && typeof ToolUtils.dateStamp === 'function') {
      return ToolUtils.dateStamp();
    }
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function copyWithButton(text, btn) {
    if (window.ToolUtils && typeof ToolUtils.copyWithButton === 'function') {
      ToolUtils.copyWithButton(text, btn);
      return;
    }
    navigator.clipboard.writeText(text).then(function() {
      var orig = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(function() { btn.textContent = orig; }, 2000);
    });
  }

  function confirmReset(message, callback) {
    if (window.ToolUtils && typeof ToolUtils.confirmReset === 'function') {
      ToolUtils.confirmReset(message, callback);
      return;
    }
    if (confirm(message)) callback();
  }

  function showReportWarning(formId) {
    var form = document.getElementById(formId);
    var tab = form && form.closest ? form.closest('.ps-tab-content') : null;
    var display = tab ? tab.querySelector('.ps-score-display') : document.querySelector('.ps-score-display');
    if (!display) return;

    var existing = display.querySelector('.ps-report-warning');
    if (!existing) {
      existing = document.createElement('div');
      existing.className = 'mt-warning ps-report-warning';
      display.insertBefore(existing, display.firstChild);
    }
    existing.textContent = 'Please rate all items before generating a report.';
  }

  function updatePANSS6Scores() {
    var version = getVersion('panss-6');
    var positive = version.subscales[0];
    var negative = version.subscales[1];
    var positiveScore = sumItems('ps6', positive.item_ids);
    var negativeScore = sumItems('ps6', negative.item_ids);
    var totalScore = positiveScore + negativeScore;

    setText('.ps-6-positive', displayScore(positiveScore));
    setText('.ps-6-negative', displayScore(negativeScore));
    setText('.ps-6-total', displayScore(totalScore));
  }

  function updatePANSS30Scores() {
    var positive = findById(getSubscales(), 'positive');
    var negative = findById(getSubscales(), 'negative');
    var general = findById(getSubscales(), 'general');
    var totalVersion = getVersion('panss-30');

    var positiveScore = sumItems('ps30', positive.item_ids);
    var negativeScore = sumItems('ps30', negative.item_ids);
    var generalScore = sumItems('ps30', general.item_ids);
    var totalScore = sumItems('ps30', totalVersion.item_ids);
    var compositeIndex = positiveScore - negativeScore;
    var severity = totalScore > 0 ? getSeverity(totalScore).label : '\u2014';
    var marder = getMarderFactors();

    setText('.ps-30-positive', displayScore(positiveScore));
    setText('.ps-30-negative', displayScore(negativeScore));
    setText('.ps-30-general', displayScore(generalScore));
    setText('.ps-30-total', displayScore(totalScore));
    setText('.ps-30-composite', totalScore > 0 ? formatComposite(compositeIndex) : '\u2014');
    setText('.ps-30-severity', severity);
    setText('.ps-marder-positive', displayScore(sumItems('ps30', marder[0].item_ids)));
    setText('.ps-marder-negative', displayScore(sumItems('ps30', marder[1].item_ids)));
    setText('.ps-marder-disorg', displayScore(sumItems('ps30', marder[2].item_ids)));
    setText('.ps-marder-hostile', displayScore(sumItems('ps30', marder[3].item_ids)));
    setText('.ps-marder-anxiety', displayScore(sumItems('ps30', marder[4].item_ids)));
  }

  function itemLine(prefix, itemId) {
    return itemId + '. ' + getItem(itemId).text + ': ' + getScore(prefix, itemId);
  }

  function generatePANSS6Report() {
    var version = getVersion('panss-6');
    var positive = version.subscales[0];
    var negative = version.subscales[1];
    var positiveScore = sumItems('ps6', positive.item_ids);
    var negativeScore = sumItems('ps6', negative.item_ids);
    var totalScore = positiveScore + negativeScore;

    if (totalScore === 0) {
      showReportWarning('ps-form-6');
      return;
    }

    var lines = [
      version.heading || 'PANSS-6 (Brief Psychosis Assessment)',
      'Date: ' + dateStamp(),
      '',
      'ITEM SCORES:'
    ];

    version.item_ids.forEach(function(itemId) {
      lines.push(itemLine('ps6', itemId));
    });

    lines.push('');
    lines.push('SUBSCALE SCORES:');
    lines.push(positive.label + ': ' + positiveScore + '/' + positive.max);
    lines.push(negative.label + ': ' + negativeScore + '/' + negative.max);
    lines.push('Total PANSS-6: ' + totalScore + '/' + version.max);
    lines.push('');
    lines.push('Note: ' + ((scale.report && scale.report.panss6_note) || FALLBACK_SCALE.report.panss6_note));

    copyWithButton(lines.join('\n'), document.getElementById('ps6-generate'));
  }

  function addSubscaleReport(lines, prefix, subscale) {
    var score = sumItems(prefix, subscale.item_ids);
    lines.push((subscale.report_heading || subscale.label.toUpperCase()) + ': ' + score + '/' + subscale.max);
    subscale.item_ids.forEach(function(itemId) {
      lines.push(itemLine(prefix, itemId));
    });
    lines.push('');
  }

  function generatePANSS30Report() {
    var version = getVersion('panss-30');
    var positive = findById(getSubscales(), 'positive');
    var negative = findById(getSubscales(), 'negative');
    var totalScore = sumItems('ps30', version.item_ids);

    if (totalScore === 0) {
      showReportWarning('ps-form-30');
      return;
    }

    var positiveScore = sumItems('ps30', positive.item_ids);
    var negativeScore = sumItems('ps30', negative.item_ids);
    var compositeIndex = positiveScore - negativeScore;
    var severity = getSeverity(totalScore).label;
    var lines = [
      version.heading || 'PANSS-30 (Full Psychosis Assessment)',
      'Date: ' + dateStamp(),
      ''
    ];

    getSubscales().forEach(function(subscale) {
      addSubscaleReport(lines, 'ps30', subscale);
    });

    lines.push('TOTAL PANSS: ' + totalScore + '/' + version.max);
    lines.push('Composite Index (P - N): ' + formatComposite(compositeIndex));
    lines.push('Severity: ' + severity);
    lines.push('');
    lines.push('MARDER FACTOR ANALYSIS:');

    getMarderFactors().forEach(function(factor) {
      lines.push(factor.label + ' (' + factor.item_ids.join(',') + '): ' + sumItems('ps30', factor.item_ids) + '/' + factor.max);
    });

    copyWithButton(lines.join('\n'), document.getElementById('ps30-generate'));
  }

  function loadSchema() {
    if (!window.ToolUtils || typeof ToolUtils.loadClinicalScale !== 'function') return;

    ToolUtils.loadClinicalScale('panss').then(function(loadedScale) {
      scale = loadedScale;
      updatePANSS6Scores();
      updatePANSS30Scores();
    }).catch(function(err) {
      console.warn('PANSS schema unavailable; using embedded fallback.', err);
    });
  }

  function initTabs() {
    document.querySelectorAll('.ps-tab-btn').forEach(function(button) {
      button.addEventListener('click', function() {
        var tabId = this.getAttribute('data-tab') + '-tab';

        document.querySelectorAll('.ps-tab-btn').forEach(function(btn) {
          btn.classList.remove('ps-tab-active');
        });
        document.querySelectorAll('.ps-tab-content').forEach(function(content) {
          content.classList.remove('ps-tab-active');
        });

        this.classList.add('ps-tab-active');
        var tab = document.getElementById(tabId);
        if (tab) tab.classList.add('ps-tab-active');
      });
    });
  }

  function initAccordions() {
    document.querySelectorAll('.ps-subscale-header').forEach(function(header) {
      header.addEventListener('click', function() {
        var targetId = this.getAttribute('data-target');
        var targetElement = document.getElementById(targetId);

        this.classList.toggle('ps-subscale-open');
        if (targetElement) targetElement.classList.toggle('ps-subscale-expanded');
      });
    });
  }

  function addPrintButtons() {
    var sec = document.getElementById('panss-tool');
    if (!sec) return;
    var header = sec.querySelector('.section-header');
    if (!header || header.querySelector('.ps-print-buttons')) return;

    var btnDiv = document.createElement('div');
    btnDiv.className = 'ps-print-buttons';
    btnDiv.style.display = 'flex';
    btnDiv.style.gap = '8px';

    var btn1 = document.createElement('button');
    btn1.className = 'pf-inline-btn';
    btn1.onclick = function() { if (typeof printBlankForm === 'function') printBlankForm('panss-6'); };
    btn1.innerHTML = '🖨️ Print PANSS-6';
    btn1.title = 'Print a blank version of the PANSS-6 form';

    var btn2 = document.createElement('button');
    btn2.className = 'pf-inline-btn';
    btn2.onclick = function() { if (typeof printBlankForm === 'function') printBlankForm('panss-30'); };
    btn2.innerHTML = '🖨️ Print PANSS-30';
    btn2.title = 'Print a blank version of the PANSS-30 form';

    btnDiv.appendChild(btn1);
    btnDiv.appendChild(btn2);
    header.appendChild(btnDiv);
  }

  function init() {
    initTabs();
    initAccordions();

    var form6 = document.getElementById('ps-form-6');
    if (form6) {
      form6.querySelectorAll('input[type="radio"]').forEach(function(radio) {
        radio.addEventListener('change', updatePANSS6Scores);
      });
    }

    var form30 = document.getElementById('ps-form-30');
    if (form30) {
      form30.querySelectorAll('input[type="radio"]').forEach(function(radio) {
        radio.addEventListener('change', updatePANSS30Scores);
      });
    }

    var ps6Generate = document.getElementById('ps6-generate');
    if (ps6Generate) ps6Generate.addEventListener('click', generatePANSS6Report);

    var ps30Generate = document.getElementById('ps30-generate');
    if (ps30Generate) ps30Generate.addEventListener('click', generatePANSS30Report);

    var ps6Reset = document.getElementById('ps6-reset');
    if (ps6Reset) {
      ps6Reset.addEventListener('click', function() {
        confirmReset('Are you sure you want to reset all ratings?', function() {
          document.getElementById('ps-form-6').reset();
          updatePANSS6Scores();
        });
      });
    }

    var ps30Reset = document.getElementById('ps30-reset');
    if (ps30Reset) {
      ps30Reset.addEventListener('click', function() {
        confirmReset('Are you sure you want to reset all ratings?', function() {
          document.getElementById('ps-form-30').reset();
          updatePANSS30Scores();
        });
      });
    }

    addPrintButtons();
    loadSchema();
    updatePANSS6Scores();
    updatePANSS30Scores();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

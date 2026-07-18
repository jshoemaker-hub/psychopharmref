(function() {
  var FALLBACK_SCALE = {
    id: 'pcl5',
    short_title: 'PCL-5',
    score: { min: 0, max: 80, item_count: 20, method: 'sum' },
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'A little bit' },
      { value: 2, label: 'Moderately' },
      { value: 3, label: 'Quite a bit' },
      { value: 4, label: 'Extremely' }
    ],
    items: [
      { id: 'pcl5-1', number: 1, text: 'Repeated, disturbing, and unwanted memories of the stressful experience' },
      { id: 'pcl5-2', number: 2, text: 'Repeated, disturbing dreams of the stressful experience' },
      { id: 'pcl5-3', number: 3, text: 'Feeling as if the stressful experience were actually happening again' },
      { id: 'pcl5-4', number: 4, text: 'Feeling very upset when reminded of the stressful experience' },
      { id: 'pcl5-5', number: 5, text: 'Strong physical reactions when reminded of the stressful experience' },
      { id: 'pcl5-6', number: 6, text: 'Avoiding memories, thoughts, or feelings related to the stressful experience' },
      { id: 'pcl5-7', number: 7, text: 'Avoiding external reminders of the stressful experience' },
      { id: 'pcl5-8', number: 8, text: 'Trouble remembering important parts of the stressful experience' },
      { id: 'pcl5-9', number: 9, text: 'Strong negative beliefs about yourself, other people, or the world' },
      { id: 'pcl5-10', number: 10, text: 'Blaming yourself or someone else for the stressful experience or what happened after it' },
      { id: 'pcl5-11', number: 11, text: 'Strong negative feelings such as fear, horror, anger, guilt, or shame' },
      { id: 'pcl5-12', number: 12, text: 'Loss of interest in activities that you used to enjoy' },
      { id: 'pcl5-13', number: 13, text: 'Feeling distant or cut off from other people' },
      { id: 'pcl5-14', number: 14, text: 'Trouble experiencing positive feelings' },
      { id: 'pcl5-15', number: 15, text: 'Irritable behavior, angry outbursts, or acting aggressively' },
      { id: 'pcl5-16', number: 16, text: 'Taking too many risks or doing things that could cause you harm' },
      { id: 'pcl5-17', number: 17, text: 'Being superalert, watchful, or on guard' },
      { id: 'pcl5-18', number: 18, text: 'Feeling jumpy or easily startled' },
      { id: 'pcl5-19', number: 19, text: 'Having difficulty concentrating' },
      { id: 'pcl5-20', number: 20, text: 'Trouble falling or staying asleep' }
    ],
    subscales: [
      { id: 'cluster-b', label: 'Cluster B - Intrusion', report_label: 'B - Intrusion', item_numbers: [1, 2, 3, 4, 5], max: 20, display_element_id: 'pc-clusterB' },
      { id: 'cluster-c', label: 'Cluster C - Avoidance', report_label: 'C - Avoidance', item_numbers: [6, 7], max: 8, display_element_id: 'pc-clusterC' },
      { id: 'cluster-d', label: 'Cluster D - Negative Cognitions/Mood', report_label: 'D - Negative Cognitions/Mood', item_numbers: [8, 9, 10, 11, 12, 13, 14], max: 28, display_element_id: 'pc-clusterD' },
      { id: 'cluster-e', label: 'Cluster E - Arousal/Reactivity', report_label: 'E - Arousal/Reactivity', item_numbers: [15, 16, 17, 18, 19, 20], max: 24, display_element_id: 'pc-clusterE' }
    ],
    diagnostic_criteria: [
      { id: 'b', report_label: 'Criterion B (>=1 intrusion symptom)', item_numbers: [1, 2, 3, 4, 5], symptom_threshold: 2, min_endorsed: 1, display_element_id: 'pc-crit-b', count_element_id: 'pc-crit-b-count' },
      { id: 'c', report_label: 'Criterion C (>=1 avoidance symptom)', item_numbers: [6, 7], symptom_threshold: 2, min_endorsed: 1, display_element_id: 'pc-crit-c', count_element_id: 'pc-crit-c-count' },
      { id: 'd', report_label: 'Criterion D (>=2 negative cognition symptoms)', item_numbers: [8, 9, 10, 11, 12, 13, 14], symptom_threshold: 2, min_endorsed: 2, display_element_id: 'pc-crit-d', count_element_id: 'pc-crit-d-count' },
      { id: 'e', report_label: 'Criterion E (>=2 arousal symptoms)', item_numbers: [15, 16, 17, 18, 19, 20], symptom_threshold: 2, min_endorsed: 2, display_element_id: 'pc-crit-e', count_element_id: 'pc-crit-e-count' }
    ],
    cutoffs: [
      { id: 'probable-ptsd', threshold: 33, operator: 'greater_than_or_equal', label_above: 'Above threshold (>=33)', label_below: 'Below threshold (<33)', report_label_above: 'Above threshold', report_label_below: 'Below threshold', display_element_id: 'pc-cutoff' }
    ],
    severity_bands: [
      { min: 0, max: 10, label: 'Minimal symptoms (0-10)', class: 'pc-severity-minimal' },
      { min: 11, max: 20, label: 'Mild symptoms (11-20)', class: 'pc-severity-mild' },
      { min: 21, max: 32, label: 'Moderate symptoms (21-32)', class: 'pc-severity-moderate' },
      { min: 33, max: 51, label: 'Moderately severe symptoms (33-51)', class: 'pc-severity-moderately-severe' },
      { min: 52, max: 80, label: 'Severe symptoms (52-80)', class: 'pc-severity-severe' }
    ],
    report: {
      heading: 'PCL-5 (PTSD Checklist for DSM-5)',
      scoring_note: 'Scoring: total symptom severity score ranges 0-80; DSM-5 cluster scores are B items 1-5, C items 6-7, D items 8-14, and E items 15-20.',
      screening_note: 'Provisional PTSD diagnosis: count each item rated 2 or higher as endorsed, requiring at least 1 B item, 1 C item, 2 D items, and 2 E items. PCL-5 results require clinical confirmation; CAPS-5 is the diagnostic gold standard.'
    },
    references: [
      { label: 'U.S. Department of Veterans Affairs, National Center for PTSD. PTSD Checklist for DSM-5 (PCL-5).' },
      { label: 'Blevins CA, Weathers FW, Davis MT, Witte TK, Domino JL. The Posttraumatic Stress Disorder Checklist for DSM-5 (PCL-5): Development and initial psychometric evaluation. J Trauma Stress. 2015;28(6):489-498.' }
    ]
  };

  var scale = FALLBACK_SCALE;

  function getItems() {
    return scale.items || FALLBACK_SCALE.items;
  }

  function getSubscales() {
    return scale.subscales || FALLBACK_SCALE.subscales;
  }

  function getCriteria() {
    return scale.diagnostic_criteria || FALLBACK_SCALE.diagnostic_criteria;
  }

  function getCutoff() {
    var cutoffs = scale.cutoffs || FALLBACK_SCALE.cutoffs;
    return cutoffs[0];
  }

  function getSelectedValue(itemNumber) {
    var selected = document.querySelector('input[name="pc-item-' + itemNumber + '"]:checked');
    return selected ? parseInt(selected.value, 10) : 0;
  }

  function getScores() {
    return getItems().map(function(item) {
      return getSelectedValue(item.number);
    });
  }

  function totalScore(scores) {
    return scores.reduce(function(total, value) { return total + value; }, 0);
  }

  function itemSum(itemNumbers, scores) {
    return (itemNumbers || []).reduce(function(sum, itemNumber) {
      return sum + (scores[itemNumber - 1] || 0);
    }, 0);
  }

  function severityForScore(total) {
    var bands = scale.severity_bands || FALLBACK_SCALE.severity_bands;
    for (var i = 0; i < bands.length; i++) {
      if (total >= bands[i].min && total <= bands[i].max) return bands[i];
    }
    return bands[bands.length - 1];
  }

  function cutoffResult(total) {
    var cutoff = getCutoff();
    var above = total >= cutoff.threshold;
    return {
      text: above ? cutoff.label_above : cutoff.label_below,
      reportText: above ? cutoff.report_label_above : cutoff.report_label_below
    };
  }

  function criterionResult(criterion, scores) {
    var threshold = criterion.symptom_threshold || 2;
    var count = (criterion.item_numbers || []).filter(function(itemNumber) {
      return (scores[itemNumber - 1] || 0) >= threshold;
    }).length;
    return {
      count: count,
      total: (criterion.item_numbers || []).length,
      met: count >= criterion.min_endorsed
    };
  }

  function updateCriterionDisplay(elemId, met, count) {
    var elem = document.getElementById(elemId);
    if (!elem) return;
    elem.textContent = met ? 'Met' : 'Not Met';
    elem.className = met
      ? 'pc-criterion-status pc-criterion-met'
      : 'pc-criterion-status pc-criterion-not-met';

    var countElem = document.getElementById(elemId + '-count');
    if (countElem) countElem.textContent = count;
  }

  function updateScores() {
    var scores = getScores();
    var total = totalScore(scores);

    document.getElementById('pc-total').textContent = total;

    getSubscales().forEach(function(subscale) {
      var el = document.getElementById(subscale.display_element_id);
      if (el) el.textContent = itemSum(subscale.item_numbers, scores);
    });

    var severity = severityForScore(total);
    var severityDiv = document.getElementById('pc-severity');
    severityDiv.textContent = severity.label;
    severityDiv.className = 'pc-severity ' + (severity.class || '');

    var cutoff = getCutoff();
    var cutoffSpan = document.getElementById(cutoff.display_element_id);
    if (cutoffSpan) cutoffSpan.textContent = cutoffResult(total).text;

    var allMet = true;
    getCriteria().forEach(function(criterion) {
      var result = criterionResult(criterion, scores);
      updateCriterionDisplay(criterion.display_element_id, result.met, result.count);
      if (!result.met) allMet = false;
    });

    var diagnosisSpan = document.getElementById('pc-diagnosis');
    diagnosisSpan.textContent = allMet ? 'Met' : 'Not Met';
    diagnosisSpan.className = allMet
      ? 'pc-criterion-status pc-criterion-met'
      : 'pc-criterion-status pc-criterion-not-met';
  }

  function generateReport() {
    var scores = getScores();
    var total = totalScore(scores);
    var severity = severityForScore(total);
    var reportMeta = scale.report || FALLBACK_SCALE.report;
    var cutoff = cutoffResult(total);

    var criteriaResults = getCriteria().map(function(criterion) {
      return {
        criterion: criterion,
        result: criterionResult(criterion, scores)
      };
    });
    var diagnosisMet = criteriaResults.every(function(entry) { return entry.result.met; });

    var lines = [
      reportMeta.heading || 'PCL-5 (PTSD Checklist for DSM-5)',
      'Date: ' + ToolUtils.dateStamp(),
      '',
      'Total Score: ' + total + '/' + scale.score.max,
      'Severity: ' + severity.label,
      '',
      'Cluster Scores:'
    ];

    getSubscales().forEach(function(subscale) {
      lines.push('  ' + subscale.report_label + ' (Items ' + subscale.item_numbers[0] + '-' + subscale.item_numbers[subscale.item_numbers.length - 1] + '): ' + itemSum(subscale.item_numbers, scores) + '/' + subscale.max);
    });

    lines.push('');
    lines.push('Provisional PTSD Diagnosis: ' + (diagnosisMet ? 'Met' : 'Not Met'));
    criteriaResults.forEach(function(entry) {
      lines.push('  ' + entry.criterion.report_label + ': ' + (entry.result.met ? 'Met' : 'Not Met') + ' (' + entry.result.count + '/' + entry.result.total + ' endorsed)');
    });

    lines.push('');
    lines.push('Cut-off Score (>=' + getCutoff().threshold + '): ' + cutoff.reportText);
    lines.push('');
    lines.push('Individual Item Scores:');
    getItems().forEach(function(item, index) {
      lines.push('  Item ' + item.number + '. ' + item.text + ': ' + scores[index]);
    });

    lines.push('');
    if (reportMeta.scoring_note) lines.push(reportMeta.scoring_note);
    if (reportMeta.screening_note) lines.push(reportMeta.screening_note);
    (scale.references || FALLBACK_SCALE.references).forEach(function(ref) {
      if (ref && ref.label) lines.push('Reference: ' + ref.label);
    });

    ToolUtils.copyWithButton(lines.join('\n'), document.getElementById('pc-report-btn'));
  }

  function initClusterToggles() {
    document.querySelectorAll('#pcl5-tool .pc-cluster-header').forEach(function(header) {
      header.addEventListener('click', function() {
        var clusterId = this.getAttribute('data-cluster');
        var clusterItems = document.getElementById('pc-cluster-' + clusterId);
        var toggle = this.querySelector('.pc-cluster-toggle');
        if (!clusterItems || !toggle) return;

        clusterItems.classList.toggle('active');
        toggle.textContent = clusterItems.classList.contains('active') ? '-' : '+';
      });
    });
  }

  function loadSchema() {
    if (typeof ToolUtils === 'undefined' || typeof ToolUtils.loadClinicalScale !== 'function') return;

    ToolUtils.loadClinicalScale('pcl5').then(function(loadedScale) {
      scale = loadedScale;
      updateScores();
    }).catch(function(err) {
      console.warn('PCL-5 schema unavailable; using embedded fallback.', err);
    });
  }

  function addPrintBtn() {
    var sec = document.getElementById('pcl5-tool');
    if (!sec) return;
    var header = sec.querySelector('.section-header');
    if (!header) return;
    var btn = document.createElement('button');
    btn.className = 'pf-inline-btn';
    btn.onclick = function() { if (typeof printBlankForm === 'function') printBlankForm('pcl5'); };
    btn.innerHTML = 'Print Blank Form';
    btn.title = 'Print a blank version of this form';
    header.appendChild(btn);
  }

  function init() {
    initClusterToggles();

    document.querySelectorAll('#pcl5-tool input[type="radio"]').forEach(function(input) {
      input.addEventListener('change', updateScores);
    });

    document.getElementById('pc-report-btn').addEventListener('click', generateReport);
    document.getElementById('pc-reset-btn').addEventListener('click', function() {
      ToolUtils.confirmReset('Reset all PCL-5 responses?', function() {
        document.querySelectorAll('#pcl5-tool input[type="radio"]').forEach(function(input) {
          input.checked = false;
        });
        updateScores();
      });
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

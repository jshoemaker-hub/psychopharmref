(function() {
  'use strict';

  var fallbackScale = {
    id: 'adl-iadl',
    report: {
      heading: 'ADL / IADL Functional Assessment',
      scoring_note: 'Counts summarize observed independence and assistance needs.'
    },
    options: [
      { value: 'Independent', label: 'Independent' },
      { value: 'Needs Help', label: 'Needs Help' },
      { value: 'Dependent', label: 'Dependent' },
      { value: 'Cannot Do', label: 'Cannot Do' }
    ],
    groups: [
      {
        id: 'adl',
        label: 'Activities of Daily Living (ADL)',
        items: [
          { id: 'bathing', label: 'Bathing' },
          { id: 'dressing', label: 'Dressing' },
          { id: 'grooming', label: 'Grooming' },
          { id: 'mouth-care', label: 'Mouth Care' },
          { id: 'toileting', label: 'Toileting' },
          { id: 'transferring', label: 'Transferring (Bed/Chair)' },
          { id: 'walking', label: 'Walking' },
          { id: 'stairs', label: 'Climbing Stairs' },
          { id: 'eating', label: 'Eating' }
        ]
      },
      {
        id: 'iadl',
        label: 'Instrumental Activities of Daily Living (IADL)',
        items: [
          { id: 'shopping', label: 'Shopping' },
          { id: 'cooking', label: 'Cooking' },
          { id: 'medications', label: 'Managing Medications' },
          { id: 'phone', label: 'Using Phone / Looking Up Numbers' },
          { id: 'housework', label: 'Doing Housework' },
          { id: 'laundry', label: 'Doing Laundry' },
          { id: 'driving', label: 'Driving / Using Public Transportation' },
          { id: 'finances', label: 'Managing Finances' }
        ]
      }
    ],
    references: [
      { label: 'Katz S, Ford AB, Moskowitz RW, Jackson BA, Jaffe MW. JAMA. 1963;185:914-919.' },
      { label: 'Lawton MP, Brody EM. Gerontologist. 1969;9(3):179-186.' }
    ]
  };

  var scale = fallbackScale;

  function applyScale(nextScale) {
    if (nextScale) scale = nextScale;
    updateSummary();
  }

  if (window.ToolUtils && ToolUtils.loadClinicalScale) {
    ToolUtils.loadClinicalScale('adl-iadl').then(applyScale).catch(function(){});
  }

  function optionValues() {
    return (scale.options || fallbackScale.options).map(function(option) { return option.value; });
  }

  function groupById(groupId) {
    return (scale.groups || fallbackScale.groups).filter(function(group) { return group.id === groupId; })[0];
  }

  function countsForItems(items) {
    var counts = {};
    optionValues().forEach(function(value) { counts[value] = 0; });

    (items || []).forEach(function(item) {
      var el = document.querySelector('input[name="ad-' + item.id + '"]:checked');
      if (el && counts[el.value] !== undefined) counts[el.value]++;
    });

    return counts;
  }

  function countText(counts) {
    return (counts.Independent || 0) + ' Independent, ' +
      (counts['Needs Help'] || 0) + ' Needs Help, ' +
      (counts.Dependent || 0) + ' Dependent, ' +
      (counts['Cannot Do'] || 0) + ' Cannot Do';
  }

  function updateGroupSummary(groupId, prefix) {
    var group = groupById(groupId);
    var counts = countsForItems(group ? group.items : []);
    document.getElementById(prefix + '-independent').textContent = counts.Independent || 0;
    document.getElementById(prefix + '-help').textContent = counts['Needs Help'] || 0;
    document.getElementById(prefix + '-dependent').textContent = counts.Dependent || 0;
    document.getElementById(prefix + '-cannot').textContent = counts['Cannot Do'] || 0;
    return counts;
  }

  function updateSummary() {
    updateGroupSummary('adl', 'ad-adl');
    updateGroupSummary('iadl', 'ad-iadl');
  }

  function selectedValue(itemId) {
    var el = document.querySelector('input[name="ad-' + itemId + '"]:checked');
    return el ? el.value : '';
  }

  function referenceLines() {
    return (scale.references || fallbackScale.references || []).map(function(ref) {
      return 'Reference: ' + ref.label;
    });
  }

  function generateReport() {
    var groups = scale.groups || fallbackScale.groups;
    var totalRated = 0;
    var overall = {};
    optionValues().forEach(function(value) { overall[value] = 0; });

    var report = ((scale.report && scale.report.heading) || fallbackScale.report.heading) + '\n';
    report += 'Date: ' + ToolUtils.dateStamp() + '\n\n';

    groups.forEach(function(group) {
      var counts = countsForItems(group.items);
      report += group.label.toUpperCase() + '\n';
      group.items.forEach(function(item) {
        var value = selectedValue(item.id);
        if (value) {
          report += item.label + ': ' + value + '\n';
          counts[value] = counts[value] || 0;
          overall[value] = (overall[value] || 0) + 1;
          totalRated++;
        }
      });
      report += group.label.replace(/\s*\([^)]*\)/g, '') + ' Summary: ' + countText(counts) + '\n\n';
    });

    report += 'Overall: ' + totalRated + '/17 items rated | ' + countText(overall) + '\n';
    if (scale.report && scale.report.scoring_note) {
      report += '\nNote: ' + scale.report.scoring_note + '\n';
    }
    referenceLines().forEach(function(line) { report += line + '\n'; });

    ToolUtils.copyWithButton(report, document.getElementById('ad-generate-btn'));
  }

  document.querySelectorAll('.ad-adl-item, .ad-iadl-item').forEach(function(el) {
    el.addEventListener('change', updateSummary);
  });

  document.getElementById('ad-generate-btn').addEventListener('click', generateReport);
  document.getElementById('ad-reset-btn').addEventListener('click', function() {
    ToolUtils.confirmReset('Reset all ADL/IADL responses?', function() {
      document.querySelectorAll('.ad-adl-item, .ad-iadl-item').forEach(function(r){ r.checked = false; });
      updateSummary();
    });
  });

  updateSummary();
})();

(function() {

  var ITEMS = [
    'bp-item1','bp-item2','bp-item3','bp-item4','bp-item5','bp-item6',
    'bp-item7','bp-item8','bp-item9','bp-item10','bp-item11','bp-item12',
    'bp-item13','bp-item14','bp-item15','bp-item16','bp-item17','bp-item18'
  ];

  var ITEM_NAMES = [
    'Somatic Concern','Anxiety','Emotional Withdrawal','Conceptual Disorganization',
    'Guilt Feelings','Tension','Mannerisms & Posturing','Grandiosity',
    'Depressive Mood','Hostility','Suspiciousness','Hallucinatory Behavior',
    'Motor Retardation','Uncooperativeness','Unusual Thought Content',
    'Blunted Affect','Excitement','Disorientation'
  ];

  // Subscale groupings (index 0-based)
  var SUBSCALES = {
    'Positive Symptoms':   [3, 7, 10, 11, 14],   // items 4,8,11,12,15
    'Negative Symptoms':   [2, 12, 15],            // items 3,13,16
    'Affective Symptoms':  [1, 4, 8],              // items 2,5,9
    'Activation':          [5, 6, 16],             // items 6,7,17
    'Other':               [0, 9, 13, 17]          // items 1,10,14,18
  };

  function getValue(name) {
    var el = document.querySelector('input[name="' + name + '"]:checked');
    return el ? parseInt(el.value) : 0;
  }

  function getScores() {
    return ITEMS.map(function(name) { return getValue(name); });
  }

  function totalScore(scores) {
    return scores.reduce(function(a, b) { return a + b; }, 0);
  }

  function severityLabel(total) {
    // Scored items: max possible = 18*7 = 126; min meaningful = 18 (all "not present")
    // Severity anchors (Leucht et al., 2005) based on total:
    if (total === 0) return { text: '—', cls: 'bp-severity-normal' };
    if (total < 31)  return { text: 'Below Mild', cls: 'bp-severity-normal' };
    if (total < 41)  return { text: 'Mildly Ill', cls: 'bp-severity-mild' };
    if (total < 53)  return { text: 'Moderately Ill', cls: 'bp-severity-moderate' };
    return { text: 'Markedly Ill or Worse', cls: 'bp-severity-severe' };
  }

  function updateScores() {
    var scores = getScores();
    var total = totalScore(scores);

    document.getElementById('bp-total-score').textContent = total;

    var sev = severityLabel(total);
    var sevEl = document.getElementById('bp-severity');
    sevEl.textContent = sev.text;
    sevEl.className = 'bp-severity-label ' + sev.cls;

    // Subscale scores
    Object.keys(SUBSCALES).forEach(function(name) {
      var indices = SUBSCALES[name];
      var sub = indices.reduce(function(a, i) { return a + scores[i]; }, 0);
      var key = name.toLowerCase().replace(/[^a-z]+/g, '-');
      var el = document.getElementById('bp-sub-' + key);
      if (el) el.textContent = sub;
    });
  }

  function generateReport() {
    var scores = getScores();
    var total = totalScore(scores);
    var sev = severityLabel(total);

    var lines = [
      'BPRS (Brief Psychiatric Rating Scale)',
      'Date: ' + ToolUtils.dateStamp(),
      '─────────────────────────────────────',
      ''
    ];

    lines.push('Item Scores (0=not assessed, 1=not present, 2–7=severity):');
    ITEMS.forEach(function(name, i) {
      var val = scores[i];
      var label = val === 0 ? 'not assessed' : val === 1 ? 'not present' :
                  val === 2 ? 'very mild' : val === 3 ? 'mild' :
                  val === 4 ? 'moderate' : val === 5 ? 'moderately severe' :
                  val === 6 ? 'severe' : 'extremely severe';
      lines.push('  ' + (i + 1) + '. ' + ITEM_NAMES[i] + ': ' + val + ' (' + label + ')');
    });

    lines.push('');
    lines.push('Subscale Scores:');
    Object.keys(SUBSCALES).forEach(function(name) {
      var indices = SUBSCALES[name];
      var sub = indices.reduce(function(a, i) { return a + scores[i]; }, 0);
      lines.push('  ' + name + ': ' + sub);
    });

    lines.push('');
    lines.push('Total Score: ' + total + ' — ' + sev.text);
    lines.push('');
    lines.push('Severity anchors (Leucht et al., 2005):');
    lines.push('  Mildly ill ≈ 31 | Moderately ill ≈ 41 | Markedly ill ≈ 53');

    var btn = document.getElementById('bp-copy-btn');
    ToolUtils.copyWithButton(lines.join('\n'), btn);
  }

  function init() {
    ITEMS.forEach(function(name) {
      var inputs = document.querySelectorAll('input[name="' + name + '"]');
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

    updateScores();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

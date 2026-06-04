(function() {
  var ITEMS = [
    'Feeling nervous, anxious, or on edge',
    'Not being able to stop or control worrying',
    'Worrying too much about different things',
    'Trouble relaxing',
    'Being so restless that it\'s hard to sit still',
    'Becoming easily annoyed or irritable',
    'Feeling afraid as if something awful might happen'
  ];

  var OPTS = ['Not at all', 'Several days', 'Over half the days', 'Nearly every day'];

  var selectedFunc = null;

  function getScore() {
    var total = 0;
    for (var i = 1; i <= 7; i++) {
      var el = document.querySelector('input[name="gad-q' + i + '"]:checked');
      if (el) total += parseInt(el.value, 10);
    }
    return total;
  }

  function getAnswered() {
    var n = 0;
    for (var i = 1; i <= 7; i++) {
      if (document.querySelector('input[name="gad-q' + i + '"]:checked')) n++;
    }
    return n;
  }

  function getSeverity(s) {
    if (s <= 4)  return { text: 'Minimal',  cls: 'gad-sev-minimal' };
    if (s <= 9)  return { text: 'Mild',     cls: 'gad-sev-mild' };
    if (s <= 14) return { text: 'Moderate', cls: 'gad-sev-moderate' };
    return       { text: 'Severe',   cls: 'gad-sev-severe' };
  }

  function getAction(s) {
    if (s <= 4)  return 'Monitor; reassess as needed';
    if (s <= 9)  return 'Watchful waiting; consider re-evaluation in 2–4 weeks';
    if (s <= 14) return 'Possible anxiety disorder — consider treatment plan or referral';
    return 'Likely anxiety disorder — active treatment recommended';
  }

  function update() {
    var score = getScore();
    var answered = getAnswered();
    document.getElementById('gad-score-num').textContent = score;
    var sev = getSeverity(score);
    var sevEl = document.getElementById('gad-severity');
    sevEl.textContent = answered < 7 ? answered + ' / 7 answered' : sev.text;
    sevEl.className = 'gad-severity ' + (answered < 7 ? 'gad-sev-minimal' : sev.cls);
  }

  function setFunc(val, btn) {
    selectedFunc = val;
    document.querySelectorAll('.gad-func-btn').forEach(function(b) {
      b.classList.remove('selected');
    });
    btn.classList.add('selected');
  }

  function generateReport() {
    var score = getScore();
    var sev = getSeverity(score);
    var action = getAction(score);
    var d = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    var lines = [
      'Generalized Anxiety Disorder 7-item Scale (GAD-7)',
      'Date: ' + d,
      '',
      'SCORES:',
      '  Total: ' + score + ' / 21',
      '  Severity: ' + sev.text,
      '  Recommended action: ' + action,
      ''
    ];
    if (selectedFunc) {
      lines.push('  Functional impairment: ' + selectedFunc);
      lines.push('');
    }
    lines.push('ITEM RESPONSES:');
    for (var i = 1; i <= 7; i++) {
      var el = document.querySelector('input[name="gad-q' + i + '"]:checked');
      var val = el ? parseInt(el.value, 10) : 0;
      lines.push('  ' + i + '. ' + ITEMS[i-1] + ': ' + val + ' (' + OPTS[val] + ')');
    }
    lines.push('');
    lines.push('Scoring: 0-4 Minimal, 5-9 Mild, 10-14 Moderate, 15-21 Severe');
    lines.push('Screening threshold ≥10 (sensitivity 89%, specificity 82% for GAD).');
    lines.push('Reference: Spitzer RL, Kroenke K, Williams JBW, Lowe B. Arch Intern Med. 2006;166:1092-1097.');
    return lines.join('\n');
  }

  // Bind events
  document.querySelectorAll('.gad-radio').forEach(function(r) {
    r.addEventListener('change', update);
  });

  document.querySelectorAll('.gad-func-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      setFunc(btn.textContent.trim(), btn);
    });
  });

  document.getElementById('gad-report-btn').addEventListener('click', function() {
    ToolUtils.copyWithButton(generateReport(), document.getElementById('gad-report-btn'));
  });

  document.getElementById('gad-reset-btn').addEventListener('click', function() {
    ToolUtils.confirmReset('Reset all GAD-7 responses?', function() {
      document.querySelectorAll('.gad-radio').forEach(function(r) { r.checked = false; });
      selectedFunc = null;
      document.querySelectorAll('.gad-func-btn').forEach(function(b) { b.classList.remove('selected'); });
      update();
    });
  });

  update();
})();

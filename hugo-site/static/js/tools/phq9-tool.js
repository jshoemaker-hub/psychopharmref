(function() {
  var ITEMS = [
    'Little interest or pleasure in doing things',
    'Feeling down, depressed, or hopeless',
    'Trouble falling or staying asleep, or sleeping too much',
    'Feeling tired or having little energy',
    'Poor appetite or overeating',
    'Feeling bad about yourself — or that you are a failure or have let yourself or your family down',
    'Trouble concentrating on things, such as reading the newspaper or watching television',
    'Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual',
    'Thoughts that you would be better off dead or of hurting yourself in some way'
  ];

  var OPTS = ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'];

  var selectedFunc = null;

  function getScore() {
    var total = 0;
    for (var i = 1; i <= 9; i++) {
      var el = document.querySelector('input[name="ph-q' + i + '"]:checked');
      if (el) total += parseInt(el.value, 10);
    }
    return total;
  }

  function getAnswered() {
    var n = 0;
    for (var i = 1; i <= 9; i++) {
      if (document.querySelector('input[name="ph-q' + i + '"]:checked')) n++;
    }
    return n;
  }

  function getSeverity(s) {
    if (s <= 4)  return { text: 'None–Minimal',  cls: 'ph-sev-none' };
    if (s <= 9)  return { text: 'Mild',           cls: 'ph-sev-mild' };
    if (s <= 14) return { text: 'Moderate',       cls: 'ph-sev-moderate' };
    if (s <= 19) return { text: 'Moderately Severe', cls: 'ph-sev-mod-sev' };
    return       { text: 'Severe',           cls: 'ph-sev-severe' };
  }

  function getAction(s) {
    if (s <= 4)  return 'None indicated';
    if (s <= 9)  return 'Watchful waiting; repeat PHQ-9 at follow-up';
    if (s <= 14) return 'Treatment plan, considering counseling, follow-up, and/or pharmacotherapy';
    if (s <= 19) return 'Active treatment with pharmacotherapy and/or psychotherapy';
    return 'Immediate initiation of pharmacotherapy and, if severe impairment or poor response, expedited referral to mental health specialist';
  }

  function update() {
    var score = getScore();
    var answered = getAnswered();
    document.getElementById('ph-score-num').textContent = score;
    var sev = getSeverity(score);
    var sevEl = document.getElementById('ph-severity');
    sevEl.textContent = answered < 9 ? answered + ' / 9 answered' : sev.text;
    sevEl.className = 'ph-severity ' + (answered < 9 ? 'ph-sev-none' : sev.cls);

    // Item 9 alert
    var q9 = document.querySelector('input[name="ph-q9"]:checked');
    var alertEl = document.getElementById('ph-item9-alert');
    if (q9 && parseInt(q9.value, 10) > 0) {
      alertEl.classList.add('visible');
    } else {
      alertEl.classList.remove('visible');
    }
  }

  function setFunc(val, btn) {
    selectedFunc = val;
    document.querySelectorAll('.ph-func-btn').forEach(function(b) {
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
      'Patient Health Questionnaire-9 (PHQ-9)',
      'Date: ' + d,
      '',
      'SCORES:',
      '  Total: ' + score + ' / 27',
      '  Severity: ' + sev.text,
      '  Recommended action: ' + action,
      ''
    ];
    if (selectedFunc) {
      lines.push('  Functional impairment: ' + selectedFunc);
      lines.push('');
    }
    lines.push('ITEM RESPONSES:');
    for (var i = 1; i <= 9; i++) {
      var el = document.querySelector('input[name="ph-q' + i + '"]:checked');
      var val = el ? parseInt(el.value, 10) : 0;
      lines.push('  ' + i + '. ' + ITEMS[i-1] + ': ' + val + ' (' + OPTS[val] + ')');
    }
    var q9 = document.querySelector('input[name="ph-q9"]:checked');
    if (q9 && parseInt(q9.value, 10) > 0) {
      lines.push('');
      lines.push('  *** Item 9 endorsed — assess suicidal ideation and safety ***');
    }
    lines.push('');
    lines.push('Scoring: 0-4 None-Minimal, 5-9 Mild, 10-14 Moderate, 15-19 Moderately Severe, 20-27 Severe');
    lines.push('Reference: Kroenke K, Spitzer RL, Williams JBW. The PHQ-9. J Gen Intern Med. 2001;16:606-613.');
    return lines.join('\n');
  }

  // Bind events
  document.querySelectorAll('.ph-radio').forEach(function(r) {
    r.addEventListener('change', update);
  });

  document.querySelectorAll('.ph-func-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      setFunc(btn.textContent.trim(), btn);
    });
  });

  document.getElementById('ph-report-btn').addEventListener('click', function() {
    ToolUtils.copyWithButton(generateReport(), document.getElementById('ph-report-btn'));
  });

  document.getElementById('ph-reset-btn').addEventListener('click', function() {
    ToolUtils.confirmReset('Reset all PHQ-9 responses?', function() {
      document.querySelectorAll('.ph-radio').forEach(function(r) { r.checked = false; });
      selectedFunc = null;
      document.querySelectorAll('.ph-func-btn').forEach(function(b) { b.classList.remove('selected'); });
      update();
    });
  });

  update();
})();

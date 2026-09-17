/* ═══════════════════════════════════════════════════════════════════════
   isi-tool.js — Insomnia Severity Index (ISI)
   7-item self-report scale (Morin), each item 0–4, total 0–28.
   Builds the scored form into #isi-root. Uses ToolUtils for clipboard/date.
   Per-item response anchors are preserved (items 1–3, 4, and 5–7 differ).
   Prefix: isi-
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var root = document.getElementById('isi-root');
  if (!root || root.dataset.isiBuilt) return;
  root.dataset.isiBuilt = '1';

  var U = window.ToolUtils || {};
  function dateStamp() { return (U.dateStamp ? U.dateStamp() : new Date().toLocaleDateString()); }
  function copyBtn(text, btn) {
    if (U.copyWithButton) { U.copyWithButton(text, btn); return; }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(function () {
        var o = btn.textContent; btn.textContent = 'Copied!';
        setTimeout(function () { btn.textContent = o; }, 2000);
      });
    }
  }
  function confirmReset(msg, fn) {
    if (U.confirmReset) { U.confirmReset(msg, fn); return; }
    if (window.confirm(msg)) fn();
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  // ── ISI items with their own response anchors ──────────────────────────
  var SEV = ['None', 'Mild', 'Moderate', 'Severe', 'Very severe'];
  var SAT = ['Very satisfied', 'Satisfied', 'Moderately satisfied', 'Dissatisfied', 'Very dissatisfied'];
  var DEG = ['Not at all', 'A little', 'Somewhat', 'Much', 'Very much'];

  var ITEMS = [
    { n: 1, text: 'Difficulty falling asleep', opts: SEV },
    { n: 2, text: 'Difficulty staying asleep', opts: SEV },
    { n: 3, text: 'Problem waking up too early', opts: SEV },
    { n: 4, text: 'How SATISFIED / DISSATISFIED are you with your current sleep pattern?', opts: SAT },
    { n: 5, text: 'How NOTICEABLE to others do you think your sleep problem is in terms of impairing the quality of your life?', opts: DEG },
    { n: 6, text: 'How WORRIED / DISTRESSED are you about your current sleep problem?', opts: DEG },
    { n: 7, text: 'To what extent do you consider your sleep problem to INTERFERE with your daily functioning (daytime fatigue, mood, ability to function at work / daily chores, concentration, memory) currently?', opts: DEG }
  ];

  var BANDS = [
    { min: 0,  max: 7,  label: 'No clinically significant insomnia', cls: 'isi-none',
      action: 'No clinically significant insomnia. Provide general sleep-hygiene guidance if concerns persist; reassess if symptoms change.' },
    { min: 8,  max: 14, label: 'Subthreshold insomnia', cls: 'isi-sub',
      action: 'Subthreshold insomnia. Offer sleep-hygiene and stimulus-control education and brief CBT-I strategies; monitor and reassess.' },
    { min: 15, max: 21, label: 'Clinical insomnia (moderate severity)', cls: 'isi-mod',
      action: 'Clinically significant insomnia. First-line CBT-I recommended; evaluate contributing medical, psychiatric, and substance factors.' },
    { min: 22, max: 28, label: 'Clinical insomnia (severe)', cls: 'isi-sev',
      action: 'Severe clinical insomnia. Strongly consider structured CBT-I with or without a pharmacologic adjunct; assess comorbidities and safety.' }
  ];

  var SCORING_NOTE = 'Scoring: sum of 7 items (0–28). 0–7 no clinically significant insomnia; 8–14 subthreshold; 15–21 clinical insomnia (moderate); 22–28 clinical insomnia (severe). Community screening cutoff for detecting insomnia is often ≥ 10. Treatment response is commonly defined as a ≥ 6-point reduction and remission as a total score < 8.';

  var REFERENCES = [
    'Morin CM. Insomnia: Psychological Assessment and Management. New York: Guilford Press; 1993.',
    'Bastien CH, Vallieres A, Morin CM. Validation of the Insomnia Severity Index as an outcome measure for insomnia research. Sleep Med. 2001;2(4):297-307.',
    'Morin CM, Belleville G, Belanger L, Ivers H. The Insomnia Severity Index: psychometric indicators to detect insomnia cases and evaluate treatment response. Sleep. 2011;34(5):601-608.'
  ];

  // ── Build the form ─────────────────────────────────────────────────────
  function buildItem(item) {
    var opts = item.opts.map(function (label, v) {
      var id = 'isi-i' + item.n + '-o' + v;
      return '<label class="isi-opt" for="' + id + '">' +
               '<input type="radio" id="' + id + '" name="isi-' + item.n + '" value="' + v + '" class="isi-radio">' +
               '<span class="isi-opt-num">' + v + '</span>' +
               '<span class="isi-opt-label">' + esc(label) + '</span>' +
             '</label>';
    }).join('');
    return '<div class="isi-item">' +
             '<div class="isi-q"><span class="isi-q-num">' + item.n + '.</span> ' + esc(item.text) + '</div>' +
             '<div class="isi-opts">' + opts + '</div>' +
           '</div>';
  }

  root.innerHTML =
    '<div class="isi-container">' +
      '<p class="isi-instructions"><strong>Instructions:</strong> Rate the <strong>CURRENT</strong> severity of the sleep problem(s) over the <strong>last 2 weeks</strong>. Select one option (0–4) for each of the seven items.</p>' +
      '<div class="isi-items">' + ITEMS.map(buildItem).join('') + '</div>' +
      '<div class="isi-score-box">' +
        '<div><span class="isi-score-num" id="isi-score">0</span><span class="isi-score-max"> / 28</span></div>' +
        '<div class="isi-interp isi-none" id="isi-interp">Answer all 7 items to see the interpretation</div>' +
      '</div>' +
      '<div class="isi-cbti">' +
        '<strong>Next step:</strong> First-line treatment for chronic insomnia is CBT-I. ' +
        '<a href="#" class="isi-cbti-link" data-cbti="1">Open the CBT-I treatment module &rarr;</a>' +
      '</div>' +
      '<div class="isi-buttons">' +
        '<button type="button" class="isi-btn isi-btn-primary" id="isi-report-btn">Generate Report</button>' +
        '<button type="button" class="isi-btn isi-btn-secondary" id="isi-reset-btn">Reset</button>' +
      '</div>' +
      '<p class="isi-refs"><em>Insomnia Severity Index &copy; Morin, C.M. (1993).</em> ' +
        REFERENCES.map(esc).join('<br>') + '</p>' +
    '</div>';

  // ── Scoring / interpretation ───────────────────────────────────────────
  function selectedValue(n) {
    var el = root.querySelector('input[name="isi-' + n + '"]:checked');
    return el ? parseInt(el.value, 10) : null;
  }
  function bandFor(score) {
    for (var i = 0; i < BANDS.length; i++) {
      if (score >= BANDS[i].min && score <= BANDS[i].max) return BANDS[i];
    }
    return BANDS[0];
  }
  function update() {
    var total = 0, answered = 0;
    ITEMS.forEach(function (it) {
      var v = selectedValue(it.n);
      if (v !== null) { total += v; answered++; }
    });
    var scoreEl = root.querySelector('#isi-score');
    if (scoreEl) scoreEl.textContent = total;
    var interp = root.querySelector('#isi-interp');
    if (interp) {
      if (answered < ITEMS.length) {
        interp.textContent = answered + ' / ' + ITEMS.length + ' answered';
        interp.className = 'isi-interp isi-none';
      } else {
        var b = bandFor(total);
        interp.textContent = b.label;
        interp.className = 'isi-interp ' + b.cls;
      }
    }
  }

  function generateReport() {
    var total = 0, answered = 0;
    ITEMS.forEach(function (it) {
      var v = selectedValue(it.n);
      if (v !== null) { total += v; answered++; }
    });
    var complete = answered === ITEMS.length;
    var b = bandFor(total);
    var lines = [
      'Insomnia Severity Index (ISI)',
      'Date: ' + dateStamp(),
      '',
      'SCORE: ' + total + ' / 28' + (complete ? '' : '  (INCOMPLETE: ' + answered + ' / ' + ITEMS.length + ' items answered)'),
      'Interpretation: ' + (complete ? b.label : 'Not classified until all items answered'),
      'Recommended action: ' + (complete ? b.action : 'Complete all items before interpreting.'),
      '',
      'ITEM RESPONSES:'
    ];
    ITEMS.forEach(function (it) {
      var v = selectedValue(it.n);
      var anchor = (v === null) ? '(not answered)' : v + ' (' + it.opts[v] + ')';
      lines.push('  ' + it.n + '. ' + it.text + ': ' + anchor);
    });
    lines.push('');
    lines.push(SCORING_NOTE);
    REFERENCES.forEach(function (r) { lines.push('Reference: ' + r); });
    return lines.join('\n');
  }

  // ── Wire events ────────────────────────────────────────────────────────
  root.querySelectorAll('.isi-radio').forEach(function (r) {
    r.addEventListener('change', update);
  });
  var reportBtn = root.querySelector('#isi-report-btn');
  if (reportBtn) reportBtn.addEventListener('click', function () { copyBtn(generateReport(), reportBtn); });
  var resetBtn = root.querySelector('#isi-reset-btn');
  if (resetBtn) resetBtn.addEventListener('click', function () {
    confirmReset('Reset all ISI responses?', function () {
      root.querySelectorAll('.isi-radio').forEach(function (r) { r.checked = false; });
      update();
    });
  });
  var cbtiLink = root.querySelector('.isi-cbti-link');
  if (cbtiLink) cbtiLink.addEventListener('click', function (e) {
    e.preventDefault();
    if (typeof switchSection === 'function') switchSection('cbti-insomnia');
  });

  update();
})();

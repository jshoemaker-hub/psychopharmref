/* ═══════════════════════════════════════════════════════════════════════
   foundations.js — Course module 1
   "Foundational Principles of Behavioral & Cognitive-Behavioral Therapy"
   Audience: trainees & advanced students.  Builds into #fnd-root.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var root = document.getElementById('fnd-root');
  if (!root || root.dataset.fndBuilt) return;
  root.dataset.fndBuilt = '1';

  var U = window.ToolUtils || {};
  function dateStamp() { return (U.dateStamp ? U.dateStamp() : new Date().toLocaleDateString()); }
  function copyBtn(t, b) { if (U.copyWithButton) U.copyWithButton(t, b); }
  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') e.className = attrs[k]; else if (k === 'html') e.innerHTML = attrs[k]; else e.setAttribute(k, attrs[k]);
    });
    if (html != null) e.innerHTML = html; return e;
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function val(sel, ctx) { var n = (ctx || root).querySelector(sel); return n ? n.value.trim() : ''; }

  function buildTable(cols, opts) {
    opts = opts || {}; var wrap = el('div'); var table = el('table', { class: 'fnd-table' });
    var thead = el('thead'), htr = el('tr');
    cols.forEach(function (c) { htr.appendChild(el('th', c.width ? { style: 'width:' + c.width } : null, esc(c.label))); });
    htr.appendChild(el('th', { style: 'width:34px' }, '')); thead.appendChild(htr); table.appendChild(thead);
    var tbody = el('tbody'); table.appendChild(tbody); wrap.appendChild(table);
    function cell(c) {
      var td = el('td'), input;
      if (c.type === 'select') { input = el('select'); (c.opts || []).forEach(function (o) { input.appendChild(el('option', { value: o }, esc(o))); }); }
      else if (c.type === 'textarea') input = el('textarea', { placeholder: c.ph || '' });
      else if (c.type === 'num') input = el('input', { type: 'number', min: '0', max: '100', class: 'fnd-num', placeholder: c.ph || '' });
      else if (c.type === 'date') input = el('input', { type: 'date' });
      else input = el('input', { type: 'text', placeholder: c.ph || '' });
      input.setAttribute('data-key', c.key); td.appendChild(input); return td;
    }
    function addRow(data) {
      var tr = el('tr');
      cols.forEach(function (c) { var td = cell(c); if (data && data[c.key] != null) td.querySelector('[data-key]').value = data[c.key]; tr.appendChild(td); });
      var delTd = el('td'); var del = el('button', { class: 'fnd-row-del', type: 'button', title: 'Remove' }, '&times;');
      del.onclick = function () { tr.remove(); }; delTd.appendChild(del); tr.appendChild(delTd); tbody.appendChild(tr); return tr;
    }
    (opts.starter || []).forEach(addRow); if (!opts.starter) addRow();
    var addBtn = el('button', { class: 'fnd-btn fnd-btn-ghost fnd-btn-sm', type: 'button' }, '+ Add row');
    addBtn.onclick = function () { addRow(); };
    wrap.appendChild(el('div', { class: 'fnd-actions' })).appendChild(addBtn);
    wrap._readRows = function () {
      return Array.prototype.map.call(tbody.querySelectorAll('tr'), function (tr) {
        var o = {}; tr.querySelectorAll('[data-key]').forEach(function (i) { o[i.getAttribute('data-key')] = i.value.trim(); }); return o;
      }).filter(function (o) { return Object.keys(o).some(function (k) { return o[k]; }); });
    };
    return wrap;
  }

  // Shared SMART+GAS card factory (used across modules)
  function buildSmartGas(pfx, opts) {
    opts = opts || {};
    var box = el('div');
    var smart = el('div', { class: pfx + '-card' });
    smart.appendChild(el('h4', null, opts.smartTitle || 'SMART goal builder'));
    var fields = opts.fields || [
      ['specific', 'Specific', 'What exactly?', ''], ['measurable', 'Measurable', 'How measured?', ''],
      ['achievable', 'Achievable', 'Realistic?', ''], ['relevant', 'Relevant', 'Why it matters', ''], ['timebound', 'Time-bound', 'By when', '']
    ];
    fields.forEach(function (x) {
      var d = el('div', { class: pfx + '-field' });
      d.innerHTML = '<label>' + x[1] + ' <span class="' + pfx + '-hint">' + x[2] + '</span></label>';
      d.appendChild(el('input', { type: 'text', 'data-smart': x[0], placeholder: x[3] })); smart.appendChild(d);
    });
    var preview = el('div', { class: pfx + '-preview' }); smart.appendChild(preview);
    smart.addEventListener('input', function () {
      var g = {}; smart.querySelectorAll('[data-smart]').forEach(function (i) { g[i.getAttribute('data-smart')] = i.value.trim(); });
      if (!g.specific && !g.measurable) { preview.innerHTML = ''; return; }
      preview.innerHTML = '<strong>Goal:</strong> ' + esc(g.specific || '…') + (g.measurable ? ' — ' + esc(g.measurable) : '') +
        (g.timebound ? ', ' + esc(g.timebound) : '') + (g.relevant ? '. <em>' + esc(g.relevant) + '.</em>' : '.');
    });
    box.appendChild(smart);
    var gas = el('div', { class: pfx + '-card' });
    gas.appendChild(el('h4', null, 'Goal Attainment Scaling (GAS)'));
    var gnf = el('div', { class: pfx + '-field' }); gnf.innerHTML = '<label>Goal name</label>';
    gnf.appendChild(el('input', { type: 'text', 'data-gas': 'name', placeholder: 'short label' })); gas.appendChild(gnf);
    var levels = [['-2', 'Much less than expected'], ['-1', 'Somewhat less than expected'], ['0', 'Expected outcome'], ['+1', 'Somewhat more than expected'], ['+2', 'Much more than expected']];
    levels.forEach(function (lv, i) {
      var row = el('div', { class: pfx + '-gas-level' });
      row.appendChild(el('span', { class: pfx + '-gas-tag ' + pfx + '-gas-' + (i - 2 < 0 ? '-' + Math.abs(i - 2) : (i - 2)) }, lv[0] + '<br>' + lv[1]));
      var inp = el('input', { type: 'text', 'data-gas-level': lv[0], placeholder: 'Describe this level' });
      inp.style.cssText = 'width:100%;box-sizing:border-box;padding:8px 10px;border:1px solid var(--border);border-radius:6px;background:#fdfcf9;';
      row.appendChild(inp); gas.appendChild(row);
    });
    var curField = el('div', { class: pfx + '-field' }); curField.innerHTML = '<label>Current attainment level</label>';
    var curSel = el('select', { 'data-gas': 'current' }); ['-2', '-1', '0', '+1', '+2'].forEach(function (v) { curSel.appendChild(el('option', { value: v }, v)); });
    curSel.value = '-2'; curField.appendChild(curSel); gas.appendChild(curField);
    var tOut = el('div', { class: pfx + '-readout' }); gas.appendChild(tOut);
    function updateT() {
      var x = parseInt(curSel.value, 10), rho = 0.3, T = 50 + (10 * x) / Math.sqrt((1 - rho) + rho);
      tOut.innerHTML = '<span class="' + pfx + '-stat"><b>' + Math.round(T) + '</b>GAS T-score</span><span class="' + pfx + '-stat"><b>' + curSel.value + '</b>current level</span><span class="' + pfx + '-stat" style="font-size:12px;color:#7a7364;">T=50 = expected; &gt;50 exceeds expectation.</span>';
    }
    curSel.addEventListener('change', updateT); updateT();
    box.appendChild(gas);
    box._report = function () {
      var g = {}; smart.querySelectorAll('[data-smart]').forEach(function (i) { g[i.getAttribute('data-smart')] = i.value.trim(); });
      var lines = ['SMART GOAL']; fields.forEach(function (x) { lines.push('  ' + x[1] + ': ' + (g[x[0]] || '-')); });
      lines.push('', 'GOAL ATTAINMENT SCALING — ' + (val('[data-gas="name"]', gas) || '(goal)'));
      levels.forEach(function (lv) { lines.push('  ' + lv[0] + ' (' + lv[1] + '): ' + (val('[data-gas-level="' + lv[0] + '"]', gas) || '-')); });
      lines.push('  Current level: ' + curSel.value); return lines.join('\n');
    };
    return box;
  }

  var LEARN_HTML =
    '<div class="fnd-learn">' +
      '<p class="fnd-lead">This foundational module covers the principles shared across every therapy in the course: how behavior is learned and changed, how thoughts, feelings, and behavior interact, and how to build a formulation, structure a session, and measure progress. Master these and each disorder-specific module becomes an application of the same core skills.</p>' +

      '<h3>1. Core behavioral principles</h3>' +
      '<dl class="fnd-acr">' +
        '<dt>ABC</dt><dd><strong>A</strong>ntecedent &rarr; <strong>B</strong>ehavior &rarr; <strong>C</strong>onsequence — the basic unit of analysis.</dd>' +
        '<dt>Reinforcement</dt><dd>increases behavior — <em>positive</em> (add something valued) or <em>negative</em> (remove something aversive).</dd>' +
        '<dt>Punishment / extinction</dt><dd>punishment decreases behavior; extinction is withholding the reinforcer that maintained it (expect an initial &ldquo;extinction burst&rdquo;).</dd>' +
        '<dt>Schedules</dt><dd>continuous vs. intermittent reinforcement; intermittent schedules make behavior more resistant to extinction.</dd>' +
        '<dt>Stimulus control</dt><dd>behavior comes under the control of specific antecedent cues.</dd>' +
        '<dt>Prompting / shaping / chaining</dt><dd>techniques to evoke, build, and link new behavior; fade prompts and program for generalization &amp; maintenance.</dd>' +
      '</dl>' +

      '<h3>2. The cognitive model (Beck)</h3>' +
      '<p>Situations trigger <strong>automatic thoughts</strong>, which drive emotional and behavioral responses. Automatic thoughts flow from deeper <strong>core beliefs</strong> and <strong>intermediate beliefs</strong> (rules, assumptions, attitudes). Therapy makes these visible and tests them. The practical model: <em>Situation &rarr; Automatic thought &rarr; Emotion &amp; Behavior &rarr; Consequence.</em></p>' +

      '<h3>3. Functional assessment &amp; case formulation</h3>' +
      '<p>Formulation is the engine of individualized treatment. Build a <strong>problem list</strong>, generate <strong>hypotheses</strong> about mechanisms (behavioral function and/or cognitive maintenance), and derive <strong>treatment targets</strong>. Revisit and revise as data accrue. The Functional Analysis and Case Formulation tabs operationalize this.</p>' +

      '<h3>4. Therapeutic alliance &amp; collaborative empiricism</h3>' +
      '<p>CBT is done <em>with</em> the client, not <em>to</em> them. <strong>Collaborative empiricism</strong> treats thoughts as hypotheses to test together. <strong>Socratic questioning / guided discovery</strong> helps clients reach new perspectives through their own reasoning rather than being told. A strong, warm alliance is necessary (not sufficient) for change.</p>' +

      '<h3>5. Outcome measurement</h3>' +
      '<p>Measurement-based care improves outcomes. Use repeated, validated symptom measures (PHQ-9, GAD-7, disorder-specific scales), session-by-session ratings, and individualized <strong>Goal Attainment Scaling</strong> for functional goals. The Measurement tab provides GAS plus a generic session tracker.</p>' +

      '<h3>6. Ethics, consent &amp; cultural humility</h3>' +
      '<ul>' +
        '<li>Informed consent to the model, methods, risks, and alternatives.</li>' +
        '<li>Cultural humility — adapt values, examples, and goals to the client&rsquo;s context; examine your own assumptions.</li>' +
        '<li>Neurodiversity-affirming practice — target client-valued outcomes, not conformity; respect different ways of being.</li>' +
        '<li>Scope, competence, and appropriate supervision.</li>' +
      '</ul>' +

      '<h3>7. The standard session structure</h3>' +
      '<ol>' +
        '<li>Set a collaborative agenda</li>' +
        '<li>Brief mood/symptom check (ideally a rating)</li>' +
        '<li>Review previous homework</li>' +
        '<li>Teach / practice the session&rsquo;s skill</li>' +
        '<li>Assign new homework collaboratively</li>' +
        '<li>Summarize and elicit feedback</li>' +
      '</ol>' +
      '<p>This structure recurs in every module; the Session Structure tab turns it into an adherence checklist.</p>' +

      '<h3>Key references</h3>' +
      '<ul class="fnd-refs">' +
        '<li>Beck, J. S. (2020). <em>Cognitive Behavior Therapy: Basics and Beyond</em> (3rd ed.). Guilford Press.</li>' +
        '<li>Cooper, J. O., Heron, T. E., &amp; Heward, W. L. (2020). <em>Applied Behavior Analysis</em> (3rd ed.). Pearson.</li>' +
        '<li>Persons, J. B. (2008). <em>The Case Formulation Approach to Cognitive-Behavior Therapy.</em> Guilford Press.</li>' +
        '<li>Kazantzis, N., et al. Socratic questioning &amp; collaborative empiricism (reviews).</li>' +
      '</ul>' +
    '</div>';

  // FUNCTIONAL ANALYSIS
  function buildFunctional() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'fnd-ws-intro' }, 'Gather ABC data on a target behavior, then hypothesize its function. Function-based understanding guides every behavioral intervention in the course.'));
    var card = el('div', { class: 'fnd-card' }); card.innerHTML = '<h4>ABC data log</h4>';
    var t = buildTable([
      { key: 'antecedent', label: 'Antecedent (before)', type: 'textarea' },
      { key: 'behavior', label: 'Behavior (observable)', type: 'textarea' },
      { key: 'consequence', label: 'Consequence (after)', type: 'textarea' }
    ]);
    card.appendChild(t); panel.appendChild(card);
    var fn = el('div', { class: 'fnd-card' }); fn.innerHTML = '<h4>Hypothesized function</h4>';
    var d = el('div', { class: 'fnd-field' }); d.innerHTML = '<label>Most likely function</label>';
    var sel = el('select', { 'data-fn': 'function' }); ['Escape / avoidance', 'Attention / social', 'Access to tangible / activity', 'Automatic / sensory'].forEach(function (o) { sel.appendChild(el('option', { value: o }, o)); });
    d.appendChild(sel); fn.appendChild(d);
    var d2 = el('div', { class: 'fnd-field' }); d2.innerHTML = '<label>Working hypothesis <span class="fnd-hint">"When ___, the behavior ___, which results in ___ (function)."</span></label>';
    d2.appendChild(el('textarea', { 'data-fn': 'hypothesis' })); fn.appendChild(d2);
    panel.appendChild(fn);
    var actions = el('div', { class: 'fnd-actions' });
    var copy = el('button', { class: 'fnd-btn', type: 'button' }, 'Copy functional analysis');
    copy.onclick = function () {
      var lines = ['FUNCTIONAL ANALYSIS', 'Date: ' + dateStamp(), '', 'ABC LOG'];
      t._readRows().forEach(function (r) { lines.push('  A: ' + (r.antecedent || '-') + ' | B: ' + (r.behavior || '-') + ' | C: ' + (r.consequence || '-')); });
      lines.push('', 'Hypothesized function: ' + val('[data-fn="function"]', fn));
      lines.push('Working hypothesis: ' + (val('[data-fn="hypothesis"]', fn) || '-'));
      copyBtn(lines.join('\n'), copy);
    };
    actions.appendChild(copy); panel.appendChild(actions); return panel;
  }

  // CASE FORMULATION
  function buildFormulation() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'fnd-ws-intro' }, 'Assemble a working formulation. Map a recent situation through the cognitive model, list the problems, and derive treatment targets.'));
    var cm = el('div', { class: 'fnd-card' }); cm.innerHTML = '<h4>Cognitive model — a recent example</h4>';
    [['situation', 'Situation / trigger', 'What happened?'],
     ['thought', 'Automatic thought', 'What went through your mind?'],
     ['emotion', 'Emotion (and intensity 0-100)', 'e.g. anxiety 80'],
     ['behavior', 'Behavior / response', 'What did you do?'],
     ['consequence', 'Consequence', 'Short- and long-term effects']].forEach(function (x) {
      var d = el('div', { class: 'fnd-field' }); d.innerHTML = '<label>' + x[1] + ' <span class="fnd-hint">' + x[2] + '</span></label>';
      d.appendChild(el('textarea', { 'data-cm': x[0] })); cm.appendChild(d);
    });
    panel.appendChild(cm);
    var pl = el('div', { class: 'fnd-card' }); pl.innerHTML = '<h4>Problem list &amp; treatment targets</h4>';
    var t = buildTable([
      { key: 'problem', label: 'Problem', type: 'text' },
      { key: 'mechanism', label: 'Hypothesized mechanism', type: 'text', ph: 'behavioral function / belief' },
      { key: 'target', label: 'Treatment target / technique', type: 'text' }
    ]);
    pl.appendChild(t); panel.appendChild(pl);
    var actions = el('div', { class: 'fnd-actions' });
    var copy = el('button', { class: 'fnd-btn', type: 'button' }, 'Copy formulation');
    copy.onclick = function () {
      var lines = ['CASE FORMULATION', 'Date: ' + dateStamp(), '', 'COGNITIVE MODEL'];
      [['situation', 'Situation'], ['thought', 'Automatic thought'], ['emotion', 'Emotion'], ['behavior', 'Behavior'], ['consequence', 'Consequence']].forEach(function (x) { lines.push('  ' + x[1] + ': ' + (val('[data-cm="' + x[0] + '"]', cm) || '-')); });
      lines.push('', 'PROBLEM LIST → TARGETS');
      t._readRows().forEach(function (r) { lines.push('  • ' + (r.problem || '-') + ' [mechanism: ' + (r.mechanism || '-') + '] → ' + (r.target || '-')); });
      copyBtn(lines.join('\n'), copy);
    };
    actions.appendChild(copy); panel.appendChild(actions); return panel;
  }

  // SESSION STRUCTURE
  var SESSION_ITEMS = ['Set a collaborative agenda', 'Brief mood/symptom check (rating)', 'Bridge from previous session', 'Review previous homework', 'Teach / practice the session skill', 'Assign new homework collaboratively', 'Summarize key points', 'Elicit client feedback on the session'];
  function buildSession() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'fnd-ws-intro' }, 'Use as a self-supervision checklist. Check each component delivered; the adherence percentage updates live.'));
    var card = el('div', { class: 'fnd-card' }); card.innerHTML = '<h4>Standard session checklist</h4>';
    SESSION_ITEMS.forEach(function (it, i) { var l = el('label', { class: 'fnd-check' }); l.innerHTML = '<input type="checkbox" data-ss="' + i + '"> <span>' + esc(it) + '</span>'; card.appendChild(l); });
    var out = el('div', { class: 'fnd-readout' }); card.appendChild(out);
    function refresh() { var boxes = card.querySelectorAll('[data-ss]'), done = card.querySelectorAll('[data-ss]:checked').length; out.innerHTML = '<span class="fnd-stat"><b>' + done + '/' + boxes.length + '</b>components</span><span class="fnd-stat"><b>' + Math.round(done / boxes.length * 100) + '%</b>adherence</span>'; }
    card.addEventListener('change', refresh); refresh(); panel.appendChild(card);
    var actions = el('div', { class: 'fnd-actions' });
    var copy = el('button', { class: 'fnd-btn', type: 'button' }, 'Copy session checklist');
    copy.onclick = function () {
      var done = card.querySelectorAll('[data-ss]:checked').length, boxes = card.querySelectorAll('[data-ss]');
      var lines = ['SESSION STRUCTURE CHECKLIST', 'Date: ' + dateStamp(), '', 'Adherence: ' + done + '/' + boxes.length + ' (' + Math.round(done / boxes.length * 100) + '%)', ''];
      SESSION_ITEMS.forEach(function (it, i) { lines.push('  [' + (card.querySelector('[data-ss="' + i + '"]').checked ? 'x' : ' ') + '] ' + it); });
      copyBtn(lines.join('\n'), copy);
    };
    actions.appendChild(copy);
    var reset = el('button', { class: 'fnd-btn fnd-btn-ghost', type: 'button' }, 'Reset');
    reset.onclick = function () { card.querySelectorAll('[data-ss]').forEach(function (b) { b.checked = false; }); refresh(); };
    actions.appendChild(reset); panel.appendChild(actions); return panel;
  }

  // MEASUREMENT
  function buildMeasurement() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'fnd-ws-intro' }, 'Set an individualized goal with Goal Attainment Scaling and track a repeated measure across sessions.'));
    var sg = buildSmartGas('fnd', { fields: [
      ['specific', 'Specific', 'What will change?', ''], ['measurable', 'Measurable', 'How measured?', ''],
      ['achievable', 'Achievable', 'Realistic step?', ''], ['relevant', 'Relevant', 'Why it matters', ''], ['timebound', 'Time-bound', 'By when', '']
    ] });
    panel.appendChild(sg);
    var track = el('div', { class: 'fnd-card' }); track.innerHTML = '<h4>Session-rating tracker</h4>';
    track.appendChild(el('p', { class: 'fnd-ws-intro' }, 'Log a repeated measure (e.g., PHQ-9, GAD-7, or a 0–10 distress rating) each session.'));
    var st = buildTable([
      { key: 'date', label: 'Date', type: 'date', width: '150px' },
      { key: 'measure', label: 'Measure', type: 'text', ph: 'e.g. PHQ-9', width: '120px' },
      { key: 'score', label: 'Score', type: 'num', width: '90px' }
    ]);
    track.appendChild(st); var trend = el('ul', { class: 'fnd-progress-list' }); track.appendChild(trend);
    function refreshTrend() {
      var rows = st._readRows().filter(function (r) { return r.score !== '' && !isNaN(parseFloat(r.score)); }); trend.innerHTML = '';
      if (!rows.length) return; var base = parseFloat(rows[0].score);
      rows.forEach(function (r, i) {
        var v = parseFloat(r.score), d = v - base;
        var dh = i === 0 ? '<span class="fnd-hint">baseline</span>' : (d <= 0 ? '<span class="fnd-delta-up">' + d + '</span>' : '<span class="fnd-delta-down">+' + d + '</span>');
        var li = el('li'); li.innerHTML = '<span>' + esc(r.date || ('Session ' + (i + 1))) + ' — ' + esc(r.measure || '') + ' ' + v + '</span>' + dh; trend.appendChild(li);
      });
    }
    track.addEventListener('input', refreshTrend);
    track.addEventListener('click', function (e) { if (/Add row/.test(e.target.textContent) || e.target.classList.contains('fnd-row-del')) setTimeout(refreshTrend, 0); });
    panel.appendChild(track);
    var actions = el('div', { class: 'fnd-actions' });
    var copy = el('button', { class: 'fnd-btn', type: 'button' }, 'Copy goal + measures');
    copy.onclick = function () {
      var lines = ['MEASUREMENT PLAN', 'Date: ' + dateStamp(), '', sg._report()];
      var rows = st._readRows().filter(function (r) { return r.score; });
      if (rows.length) { lines.push('', 'MEASURE TREND'); var base = parseFloat(rows[0].score); rows.forEach(function (r, i) { var d = parseFloat(r.score) - base; lines.push('  ' + (r.date || ('S' + (i + 1))) + ': ' + (r.measure || '') + ' ' + r.score + (i === 0 ? ' (baseline)' : ' (' + (d <= 0 ? '' : '+') + d + ')')); }); }
      copyBtn(lines.join('\n'), copy);
    };
    actions.appendChild(copy); panel.appendChild(actions); return panel;
  }

  // SOCRATIC TOOLKIT
  function buildSocratic() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'fnd-ws-intro' }, 'A reference set for guided discovery. Use these question types to help clients examine thoughts through their own reasoning — not to lecture or debate.'));
    var groups = [
      ['Clarify', ['What do you mean by that exactly?', 'Can you give me a recent example?', 'How would you describe what happened?']],
      ['Examine evidence', ['What makes you think that’s true?', 'What evidence is there on the other side?', 'If a friend said this, what would you tell them?']],
      ['Alternative views', ['Is there another way to look at this?', 'What’s the most helpful way to see it?', 'What would someone who cares about you say?']],
      ['Consequences / decatastrophize', ['What’s the worst that could realistically happen? Could you cope?', 'What’s most likely to happen?', 'How much will this matter in a year?']],
      ['Guided discovery', ['What do you make of that?', 'Given all this, what conclusion do you draw?', 'What might you try differently next time?']]
    ];
    groups.forEach(function (g) {
      var card = el('div', { class: 'fnd-card' }); card.innerHTML = '<h4>' + esc(g[0]) + '</h4>';
      var ul = el('ul'); ul.style.cssText = 'margin:0;padding-left:20px;line-height:1.7;';
      g[1].forEach(function (q) { ul.appendChild(el('li', null, esc(q))); }); card.appendChild(ul); panel.appendChild(card);
    });
    var ce = el('div', { class: 'fnd-card' }); ce.innerHTML = '<h4>Collaborative empiricism — self-check</h4>';
    ['I treated thoughts as hypotheses to test, not facts to accept or reject', 'I used the client’s own words and examples', 'I asked more than I told', 'We reached conclusions together (guided discovery)', 'I stayed curious and non-judgmental', 'I checked the client’s reaction and understanding'].forEach(function (it, i) {
      var l = el('label', { class: 'fnd-check' }); l.innerHTML = '<input type="checkbox" data-ce="' + i + '"> <span>' + esc(it) + '</span>'; ce.appendChild(l);
    });
    panel.appendChild(ce);
    var actions = el('div', { class: 'fnd-actions' });
    var copy = el('button', { class: 'fnd-btn', type: 'button' }, 'Copy Socratic question set');
    copy.onclick = function () {
      var lines = ['SOCRATIC QUESTION TOOLKIT', 'Date: ' + dateStamp(), ''];
      groups.forEach(function (g) { lines.push(g[0].toUpperCase()); g[1].forEach(function (q) { lines.push('  • ' + q); }); lines.push(''); });
      copyBtn(lines.join('\n'), copy);
    };
    actions.appendChild(copy); panel.appendChild(actions); return panel;
  }

  var TABS = [
    { id: 'learn', label: 'Learn', build: function () { return el('div', { html: LEARN_HTML }); } },
    { id: 'functional', label: 'Functional Analysis', build: buildFunctional },
    { id: 'formulation', label: 'Case Formulation', build: buildFormulation },
    { id: 'session', label: 'Session Structure', build: buildSession },
    { id: 'measurement', label: 'Measurement', build: buildMeasurement },
    { id: 'socratic', label: 'Socratic Toolkit', build: buildSocratic }
  ];

  var meta = el('div', { class: 'fnd-meta' });
  meta.innerHTML = '<span class="fnd-chip fnd-chip-accent">Module 1 of 7</span><span class="fnd-chip">Foundations</span><span class="fnd-chip">Behavioral + Cognitive</span><span class="fnd-chip">Shared across all modules</span><span class="fnd-chip">Trainee / advanced student</span><span class="fnd-chip">~3&ndash;4 contact hours</span>';
  root.appendChild(meta);

  // Print / Save-as-PDF: build every panel, then print (global print CSS shows only the active section; module CSS reveals all panels).
  var fndPrintBar = el('div', { class: 'fnd-actions' });
  var fndPrintBtn = el('button', { class: 'fnd-btn fnd-btn-ghost fnd-btn-sm', type: 'button' }, '\u1F5A8 Print / Save as PDF');
  fndPrintBtn.innerHTML = '&#128424; Print / Save as PDF';
  fndPrintBtn.onclick = function () {
    var allTabs = tabBar.querySelectorAll('.fnd-tab');
    Array.prototype.forEach.call(allTabs, function (b) { b.click(); });
    if (allTabs[0]) allTabs[0].click();
    window.print();
  };
  fndPrintBar.appendChild(fndPrintBtn);
  root.appendChild(fndPrintBar);
  var tabBar = el('div', { class: 'fnd-tabs' }), panels = el('div');
  TABS.forEach(function (t, i) {
    var btn = el('button', { class: 'fnd-tab' + (i === 0 ? ' fnd-active' : ''), type: 'button' }, t.label);
    var panel = el('div', { class: 'fnd-panel' + (i === 0 ? ' fnd-active' : '') }); var built = false;
    function activate() {
      tabBar.querySelectorAll('.fnd-tab').forEach(function (b) { b.classList.remove('fnd-active'); });
      panels.querySelectorAll('.fnd-panel').forEach(function (p) { p.classList.remove('fnd-active'); });
      btn.classList.add('fnd-active'); panel.classList.add('fnd-active');
      if (!built) { panel.appendChild(t.build()); built = true; }
    }
    btn.onclick = activate; if (i === 0) { panel.appendChild(t.build()); built = true; }
    tabBar.appendChild(btn); panels.appendChild(panel);
  });
  root.appendChild(tabBar); root.appendChild(panels);
  var hash = (location.hash || '').split(':')[1];
  if (hash) { var idx = TABS.map(function (t) { return t.id; }).indexOf(hash); if (idx > -1) tabBar.querySelectorAll('.fnd-tab')[idx].click(); }
})();

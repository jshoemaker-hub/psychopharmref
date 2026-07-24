/* ═══════════════════════════════════════════════════════════════════════
   aba-autism.js — Course module 2
   "ABA & Naturalistic Approaches for Autism Spectrum Disorder: A How-To"
   Audience: trainees & advanced students.
   Builds a tabbed module into #aba-root. Uses ToolUtils for clipboard/date.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var root = document.getElementById('aba-root');
  if (!root || root.dataset.abaBuilt) return;
  root.dataset.abaBuilt = '1';

  var U = window.ToolUtils || {};
  function dateStamp() { return (U.dateStamp ? U.dateStamp() : new Date().toLocaleDateString()); }
  function copyBtn(text, btn) { if (U.copyWithButton) U.copyWithButton(text, btn); }

  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') e.className = attrs[k];
      else if (k === 'html') e.innerHTML = attrs[k];
      else e.setAttribute(k, attrs[k]);
    });
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function val(sel, ctx) { var n = (ctx || root).querySelector(sel); return n ? n.value.trim() : ''; }

  // ═══════════════════════════════════════════════════════════════════════
  //  DIDACTIC CONTENT (Learn tab)
  // ═══════════════════════════════════════════════════════════════════════
  var LEARN_HTML =
    '<div class="aba-learn">' +
      '<p class="aba-lead">Behavioral interventions grounded in Applied Behavior Analysis (ABA) have the strongest evidence base for building skills and reducing interfering behaviors in autistic children, especially in early intervention. This module teaches the core procedures &mdash; discrete trial training, naturalistic developmental behavioral interventions (PRT, ESDM), and function-based support &mdash; delivered in a way that is <strong>assent-based and neurodiversity-affirming</strong>.</p>' +

      '<div class="aba-callout aba-tip"><span class="aba-callout-title">A note on modern, affirming practice</span>ABA has a contested history, and parts of the autistic community have raised valid concerns about older, compliance-driven, &ldquo;normalization&rdquo; approaches. Contemporary best practice targets <em>functional, client-selected skills</em> (communication, self-help, safety, participation), honors autistic ways of being, does not aim to suppress harmless behaviors such as stimming, and treats the child&rsquo;s <strong>assent</strong> and wellbeing as central. This module teaches the techniques within that affirming frame.</div>' +

      '<h3>1. Core behavioral principles</h3>' +
      '<p>All the procedures below rest on a small set of principles:</p>' +
      '<dl class="aba-acr">' +
        '<dt>ABC</dt><dd><strong>A</strong>ntecedent &rarr; <strong>B</strong>ehavior &rarr; <strong>C</strong>onsequence &mdash; the unit of behavioral analysis.</dd>' +
        '<dt>Reinforcement</dt><dd>a consequence that increases a behavior; can be positive (adding something valued) or negative (removing something aversive).</dd>' +
        '<dt>Prompting</dt><dd>extra help to evoke a correct response (physical, model, gestural, positional, verbal, visual).</dd>' +
        '<dt>Fading</dt><dd>systematically reducing prompts so the behavior becomes independent.</dd>' +
        '<dt>Shaping</dt><dd>reinforcing successive approximations toward a target skill.</dd>' +
        '<dt>Chaining</dt><dd>teaching a multi-step skill by linking individual steps (forward, backward, total task).</dd>' +
      '</dl>' +
      '<p>The endgame of every teaching program is <strong>generalization</strong> (the skill occurs across people, settings, and materials) and <strong>maintenance</strong> (it persists over time). Plan for both from the start rather than hoping they happen.</p>' +

      '<h3>2. Assessment before teaching</h3>' +
      '<ul>' +
        '<li><strong>Preference assessment:</strong> identify what is genuinely reinforcing for this child (free-operant observation, or single/paired-item presentation). Reinforcers are individual and change &mdash; re-check often.</li>' +
        '<li><strong>Skill probes / baseline:</strong> sample current performance on target skills before instruction.</li>' +
        '<li><strong>Functional behavior assessment (FBA):</strong> for interfering behaviors, gather ABC data to hypothesize the behavior&rsquo;s <em>function</em> (see the Behavior Plan tab).</li>' +
        '<li><strong>Developmental checklists:</strong> map strengths and next-step skills across domains.</li>' +
      '</ul>' +

      '<h3>3. Discrete Trial Training (DTT) &mdash; step by step</h3>' +
      '<p>DTT teaches a skill by breaking it into discrete components and presenting many structured learning trials. Each trial has three parts:</p>' +
      '<ol>' +
        '<li><strong>Antecedent (S<sup>D</sup>):</strong> a clear, consistent instruction or cue.</li>' +
        '<li><strong>Response:</strong> the child&rsquo;s answer, prompted as needed.</li>' +
        '<li><strong>Consequence:</strong> immediate reinforcement for correct/independent responses, or a gentle correction procedure for errors.</li>' +
      '</ol>' +
      '<p>Key parameters to control:</p>' +
      '<ul>' +
        '<li><strong>Prompt hierarchy &amp; fading:</strong> use the least intrusive prompt that ensures success, then fade. <em>Errorless learning</em> (prompt immediately to prevent errors, then fade the prompt) speeds acquisition and reduces frustration.</li>' +
        '<li><strong>Massed vs. distributed trials</strong> and <strong>interspersal</strong> of mastered tasks to maintain momentum and reduce fatigue.</li>' +
        '<li><strong>Trial-by-trial data:</strong> record each response (independent / prompted / incorrect) and compute percent-independent to drive decisions. The DTT tab includes a live data grid.</li>' +
      '</ul>' +
      '<div class="aba-callout aba-tip"><span class="aba-callout-title">Mastery criterion</span>Define it in advance &mdash; e.g., &ge;80&ndash;90% independent correct across 2&ndash;3 consecutive sessions &mdash; then move to the next target and program for generalization.</div>' +

      '<h3>4. Naturalistic approaches: PRT &amp; ESDM</h3>' +
      '<h4>Pivotal Response Training (PRT)</h4>' +
      '<p>PRT targets <strong>pivotal areas</strong> that produce broad gains: <em>motivation</em>, <em>responsivity to multiple cues</em>, <em>self-management</em>, and <em>self-initiations</em>. It is delivered in natural interactions &mdash; follow the child&rsquo;s lead, use child choice, intersperse maintenance and acquisition tasks, reinforce reasonable attempts, and use <strong>natural/direct reinforcers</strong> (the item or activity the child was reaching for), with turn-taking and shared control.</p>' +
      '<h4>Early Start Denver Model (ESDM)</h4>' +
      '<p>ESDM is a manualized early intervention for toddlers that fuses ABA with developmental and relationship-based strategies inside play and daily routines. Learning objectives are embedded in joint activities, affect and engagement are prioritized, and teaching happens in the flow of naturalistic interaction rather than at a table.</p>' +

      '<h3>5. Supporting techniques</h3>' +
      '<ul>' +
        '<li><strong>Functional Communication Training (FCT):</strong> teach a communicative replacement (word, sign, picture, AAC) that serves the <em>same function</em> as an interfering behavior &mdash; the single most useful behavior-reduction strategy.</li>' +
        '<li><strong>Visual supports &amp; activity schedules:</strong> make expectations and sequences predictable and reduce reliance on adult prompts.</li>' +
        '<li><strong>Social skills teaching</strong> and peer-mediated strategies for interaction goals.</li>' +
      '</ul>' +

      '<h3>6. Dosage &amp; caregiver involvement</h3>' +
      '<p>Early intensive behavioral intervention is often delivered at higher weekly hours, but hours should be matched to the child&rsquo;s needs and tolerance, not maximized for their own sake. <strong>Caregiver coaching is essential</strong> &mdash; parents implementing strategies in daily routines drives generalization and is often the highest-yield component.</p>' +

      '<h3>7. Common challenges &amp; solutions</h3>' +
      '<div class="aba-callout aba-tip"><span class="aba-callout-title">Escape-maintained behavior</span>If a behavior functions to escape demands, reduce it by teaching a break/help request (FCT), grading task difficulty, and honoring the communicative request &mdash; not by escalating demands.</div>' +
      '<div class="aba-callout aba-tip"><span class="aba-callout-title">Prompt dependence</span>Prevent it with least-to-most or time-delay fading, and reinforce independent responding more richly than prompted responding.</div>' +
      '<div class="aba-callout aba-tip"><span class="aba-callout-title">Caregiver / provider fidelity</span>Use brief coaching, modeling, and feedback; track treatment integrity with a checklist rather than assuming procedures are delivered as written.</div>' +

      '<h3>8. Neurodiversity-affirming, assent-based practice</h3>' +
      '<ul>' +
        '<li>Target skills the learner and family value (communication, autonomy, safety, participation) &mdash; not conformity for its own sake.</li>' +
        '<li>Monitor <strong>assent</strong>: watch for engagement vs. distress, build in choice and breaks, and stop or adjust when the child withdraws assent.</li>' +
        '<li>Do not suppress harmless self-regulatory behaviors (e.g., stimming); protect the child&rsquo;s sensory needs.</li>' +
        '<li>Center wellbeing and quality of life as outcomes, alongside skill acquisition.</li>' +
      '</ul>' +

      '<h3>Key references</h3>' +
      '<ul class="aba-refs">' +
        '<li>Cooper, J. O., Heron, T. E., &amp; Heward, W. L. (2020). <em>Applied Behavior Analysis</em> (3rd ed.). Pearson.</li>' +
        '<li>Rogers, S. J., &amp; Dawson, G. (2010). <em>Early Start Denver Model for Young Children with Autism.</em> Guilford Press.</li>' +
        '<li>Koegel, R. L., &amp; Koegel, L. K. <em>Pivotal Response Treatment</em> manuals and papers.</li>' +
        '<li>Smith, T. (2001). Discrete trial training in the treatment of autism. <em>Focus on Autism and Other Developmental Disabilities.</em></li>' +
        '<li>CDC. Treatment and Intervention for Autism Spectrum Disorder (behavioral approaches).</li>' +
        '<li>AFIRM modules (National Clearinghouse on Autism Evidence &amp; Practice) on DTT, PRT, FCT, and prompting.</li>' +
      '</ul>' +
    '</div>';

  // ═══════════════════════════════════════════════════════════════════════
  //  Reusable dynamic table
  // ═══════════════════════════════════════════════════════════════════════
  function buildTable(cols, opts) {
    opts = opts || {};
    var wrap = el('div');
    var table = el('table', { class: 'aba-table' });
    var thead = el('thead');
    var htr = el('tr');
    cols.forEach(function (c) { htr.appendChild(el('th', c.width ? { style: 'width:' + c.width } : null, esc(c.label))); });
    htr.appendChild(el('th', { style: 'width:34px' }, ''));
    thead.appendChild(htr);
    table.appendChild(thead);
    var tbody = el('tbody');
    table.appendChild(tbody);
    wrap.appendChild(table);

    function cell(c) {
      var td = el('td');
      var input;
      if (c.type === 'select') {
        input = el('select');
        (c.opts || []).forEach(function (o) { input.appendChild(el('option', { value: o }, esc(o))); });
      } else if (c.type === 'textarea') {
        input = el('textarea', { placeholder: c.ph || '' });
      } else if (c.type === 'num') {
        input = el('input', { type: 'number', min: '0', max: '100', class: 'aba-num', placeholder: c.ph || '' });
      } else if (c.type === 'date') {
        input = el('input', { type: 'date' });
      } else {
        input = el('input', { type: 'text', placeholder: c.ph || '' });
      }
      input.setAttribute('data-key', c.key);
      td.appendChild(input);
      return td;
    }
    function addRow(data) {
      var tr = el('tr');
      cols.forEach(function (c) {
        var td = cell(c);
        if (data && data[c.key] != null) td.querySelector('[data-key]').value = data[c.key];
        tr.appendChild(td);
      });
      var delTd = el('td');
      var del = el('button', { class: 'aba-row-del', title: 'Remove row', type: 'button' }, '&times;');
      del.onclick = function () { tr.remove(); };
      delTd.appendChild(del);
      tr.appendChild(delTd);
      tbody.appendChild(tr);
      return tr;
    }
    (opts.starter || []).forEach(addRow);
    if (!opts.starter) addRow();

    var addBtn = el('button', { class: 'aba-btn aba-btn-ghost aba-btn-sm', type: 'button' }, '+ Add row');
    addBtn.onclick = function () { addRow(); };
    var actWrap = el('div', { class: 'aba-actions' });
    actWrap.appendChild(addBtn);
    wrap.appendChild(actWrap);

    wrap._readRows = function () {
      return Array.prototype.map.call(tbody.querySelectorAll('tr'), function (tr) {
        var o = {};
        tr.querySelectorAll('[data-key]').forEach(function (inp) { o[inp.getAttribute('data-key')] = inp.value.trim(); });
        return o;
      }).filter(function (o) { return Object.keys(o).some(function (k) { return o[k]; }); });
    };
    return wrap;
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  ASSESS tab — preference assessment + ABC baseline
  // ═══════════════════════════════════════════════════════════════════════
  function buildAssess() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'aba-ws-intro' },
      'Assessment worksheets to complete <em>before</em> teaching. Identify true reinforcers, sample baseline skill levels, and gather ABC data on any interfering behavior.'));

    var p1 = el('div', { class: 'aba-card' });
    p1.innerHTML = '<h4>Preference assessment</h4>';
    p1.appendChild(el('p', { class: 'aba-ws-intro' }, 'List candidate items/activities and rate observed preference (0&ndash;10). Reinforcers are individual and shift &mdash; re-check often.'));
    var t1 = buildTable([
      { key: 'item', label: 'Item / activity', type: 'text', ph: 'e.g. bubbles, tablet, spinning top' },
      { key: 'method', label: 'How assessed', type: 'select', opts: ['Free-operant', 'Single-item', 'Paired (forced-choice)', 'Caregiver report'], width: '150px' },
      { key: 'pref', label: 'Preference 0-10', type: 'num', width: '90px' }
    ]);
    p1.appendChild(t1);
    panel.appendChild(p1);

    var p2 = el('div', { class: 'aba-card' });
    p2.innerHTML = '<h4>Skill probe / baseline</h4>';
    var t2 = buildTable([
      { key: 'skill', label: 'Target skill', type: 'text', ph: 'e.g. imitates 1-step action' },
      { key: 'domain', label: 'Domain', type: 'select', opts: ['Communication', 'Play/Social', 'Imitation', 'Self-help', 'Motor', 'Academic', 'Safety'], width: '130px' },
      { key: 'baseline', label: 'Baseline % correct', type: 'num', width: '100px' }
    ]);
    p2.appendChild(t2);
    panel.appendChild(p2);

    var p3 = el('div', { class: 'aba-card' });
    p3.innerHTML = '<h4>ABC data log (interfering behavior)</h4>';
    var t3 = buildTable([
      { key: 'antecedent', label: 'Antecedent (what happened before)', type: 'textarea' },
      { key: 'behavior', label: 'Behavior (observable)', type: 'textarea' },
      { key: 'consequence', label: 'Consequence (what happened after)', type: 'textarea' }
    ]);
    p3.appendChild(t3);
    panel.appendChild(p3);

    var actions = el('div', { class: 'aba-actions' });
    var copy = el('button', { class: 'aba-btn', type: 'button' }, 'Copy assessment');
    copy.onclick = function () {
      var lines = ['ABA — ASSESSMENT', 'Date: ' + dateStamp(), '', 'PREFERENCE ASSESSMENT'];
      t1._readRows().forEach(function (r) { lines.push('  • ' + (r.item || '-') + ' [' + (r.method || '') + '] pref ' + (r.pref || '-') + '/10'); });
      lines.push('', 'SKILL PROBES / BASELINE');
      t2._readRows().forEach(function (r) { lines.push('  • ' + (r.skill || '-') + ' (' + (r.domain || '') + ') baseline ' + (r.baseline || '-') + '%'); });
      var abc = t3._readRows();
      if (abc.length) { lines.push('', 'ABC LOG'); abc.forEach(function (r) { lines.push('  A: ' + (r.antecedent || '-') + ' | B: ' + (r.behavior || '-') + ' | C: ' + (r.consequence || '-')); }); }
      copyBtn(lines.join('\n'), copy);
    };
    actions.appendChild(copy);
    panel.appendChild(actions);
    return panel;
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  DTT tab — program planner + trial-by-trial data grid
  // ═══════════════════════════════════════════════════════════════════════
  function buildDTT() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'aba-ws-intro' },
      'Plan a discrete-trial program, then score trials live. Tap each trial cell to cycle <b>+</b> (independent correct) &rarr; <b>P</b> (prompted correct) &rarr; <b>&minus;</b> (incorrect) &rarr; blank. Percent-independent updates automatically.'));

    // Program planner
    var plan = el('div', { class: 'aba-card' });
    plan.innerHTML = '<h4>Program plan</h4>';
    var f = [
      ['target', 'Target skill', 'e.g. Receptive ID of "cup"'],
      ['sd', 'Antecedent / Sᴰ (instruction)', 'e.g. "Touch cup" with 2 items on table'],
      ['response', 'Target response', 'e.g. Touches cup within 3s'],
      ['prompt', 'Prompt & fading plan', 'e.g. Errorless: full physical → partial → gestural → independent'],
      ['reinforcer', 'Reinforcer', 'e.g. bubbles + praise (from preference assessment)'],
      ['correction', 'Error-correction procedure', 'e.g. remove items, re-present with immediate prompt'],
      ['mastery', 'Mastery criterion', 'e.g. ≥90% independent across 3 sessions']
    ];
    f.forEach(function (x) {
      var d = el('div', { class: 'aba-field' });
      d.innerHTML = '<label>' + x[1] + '</label>';
      var inp = el('input', { type: 'text', 'data-plan': x[0], placeholder: x[2] });
      d.appendChild(inp);
      plan.appendChild(d);
    });
    panel.appendChild(plan);

    // Trial grid
    var grid = el('div', { class: 'aba-card' });
    grid.innerHTML = '<h4>Trial-by-trial data (this session)</h4>';
    var trialsWrap = el('div', { class: 'aba-trials' });
    var NUM = 10;
    for (var i = 0; i < NUM; i++) {
      var cell = el('button', { class: 'aba-trial', type: 'button', title: 'Trial ' + (i + 1) }, String(i + 1));
      cell.onclick = (function (c) {
        return function () {
          var order = ['', '+', 'P', '-'];
          var cur = c.getAttribute('data-score') || '';
          var next = order[(order.indexOf(cur) + 1) % order.length];
          if (next) { c.setAttribute('data-score', next); c.textContent = next === '-' ? '−' : next; }
          else { c.removeAttribute('data-score'); c.textContent = String(Array.prototype.indexOf.call(trialsWrap.children, c) + 1); }
          refresh();
        };
      })(cell);
      trialsWrap.appendChild(cell);
    }
    grid.appendChild(trialsWrap);
    grid.appendChild(el('p', { class: 'aba-trial-legend' }, '<b>+</b> independent correct &nbsp; <b>P</b> prompted correct &nbsp; <b>&minus;</b> incorrect'));
    var readout = el('div', { class: 'aba-readout' });
    grid.appendChild(readout);
    function scores() {
      return Array.prototype.map.call(trialsWrap.children, function (c) { return c.getAttribute('data-score') || ''; });
    }
    function refresh() {
      var s = scores();
      var scored = s.filter(function (x) { return x; });
      var ind = s.filter(function (x) { return x === '+'; }).length;
      var pr = s.filter(function (x) { return x === 'P'; }).length;
      var pct = scored.length ? Math.round((ind / scored.length) * 100) : 0;
      readout.innerHTML =
        '<span class="aba-stat"><b>' + pct + '%</b>independent correct</span>' +
        '<span class="aba-stat"><b>' + ind + '</b>independent</span>' +
        '<span class="aba-stat"><b>' + pr + '</b>prompted</span>' +
        '<span class="aba-stat"><b>' + scored.length + '/' + NUM + '</b>trials scored</span>';
    }
    refresh();
    panel.appendChild(grid);

    var actions = el('div', { class: 'aba-actions' });
    var copy = el('button', { class: 'aba-btn', type: 'button' }, 'Copy DTT program + data');
    copy.onclick = function () {
      var lines = ['DISCRETE TRIAL TRAINING — PROGRAM & DATA', 'Date: ' + dateStamp(), ''];
      f.forEach(function (x) { lines.push('  ' + x[1] + ': ' + (val('[data-plan="' + x[0] + '"]', plan) || '-')); });
      var s = scores();
      var scored = s.filter(function (x) { return x; });
      var ind = s.filter(function (x) { return x === '+'; }).length;
      var pct = scored.length ? Math.round((ind / scored.length) * 100) : 0;
      lines.push('', 'TRIAL DATA: ' + s.map(function (x, i) { return (i + 1) + ':' + (x || '.'); }).join('  '));
      lines.push('Percent independent: ' + pct + '% (' + ind + '/' + scored.length + ' scored)');
      copyBtn(lines.join('\n'), copy);
    };
    actions.appendChild(copy);
    var reset = el('button', { class: 'aba-btn aba-btn-ghost', type: 'button' }, 'Clear trials');
    reset.onclick = function () {
      Array.prototype.forEach.call(trialsWrap.children, function (c, i) { c.removeAttribute('data-score'); c.textContent = String(i + 1); });
      refresh();
    };
    actions.appendChild(reset);
    panel.appendChild(actions);
    return panel;
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  NATURALISTIC tab — PRT / ESDM planning
  // ═══════════════════════════════════════════════════════════════════════
  function buildNaturalistic() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'aba-ws-intro' },
      'Plan naturalistic teaching embedded in play and routines. Choose pivotal targets, natural reinforcers, and the routines where learning opportunities will be embedded.'));

    var pivotal = el('div', { class: 'aba-card' });
    pivotal.innerHTML = '<h4>PRT pivotal-area targets</h4>';
    var t = buildTable([
      { key: 'pivotal', label: 'Pivotal area', type: 'select', opts: ['Motivation', 'Response to multiple cues', 'Self-management', 'Self-initiation'], width: '160px' },
      { key: 'target', label: 'Specific target behavior', type: 'text', ph: 'e.g. requests preferred item with a word' },
      { key: 'reinforcer', label: 'Natural / direct reinforcer', type: 'text', ph: 'e.g. gets the actual item requested' }
    ]);
    pivotal.appendChild(t);
    panel.appendChild(pivotal);

    var strat = el('div', { class: 'aba-card' });
    strat.innerHTML = '<h4>Naturalistic strategy checklist</h4>';
    var items = [
      'Follow the child’s lead and use child choice',
      'Use natural/direct reinforcers (the item or activity itself)',
      'Reinforce reasonable attempts, not just perfect responses',
      'Intersperse maintenance (mastered) and acquisition tasks',
      'Share control / take turns',
      'Embed targets in daily routines (meals, play, dressing)',
      'Prioritize engagement and positive affect (ESDM)'
    ];
    items.forEach(function (it, i) {
      var lab = el('label', { class: 'aba-field', style: 'display:flex;gap:8px;align-items:flex-start;margin:6px 0;font-weight:400;' });
      lab.innerHTML = '<input type="checkbox" data-nat="' + i + '" style="margin-top:3px;"> <span>' + esc(it) + '</span>';
      strat.appendChild(lab);
    });
    panel.appendChild(strat);

    var routines = el('div', { class: 'aba-card' });
    routines.innerHTML = '<h4>Embedded-opportunity plan</h4>';
    var rt = buildTable([
      { key: 'routine', label: 'Routine / activity', type: 'text', ph: 'e.g. snack time' },
      { key: 'opportunity', label: 'Embedded learning opportunity', type: 'textarea', ph: 'e.g. pause before giving food to prompt a request' }
    ]);
    routines.appendChild(rt);
    panel.appendChild(routines);

    var actions = el('div', { class: 'aba-actions' });
    var copy = el('button', { class: 'aba-btn', type: 'button' }, 'Copy naturalistic plan');
    copy.onclick = function () {
      var lines = ['NATURALISTIC (PRT/ESDM) PLAN', 'Date: ' + dateStamp(), '', 'PIVOTAL TARGETS'];
      t._readRows().forEach(function (r) { lines.push('  • [' + (r.pivotal || '') + '] ' + (r.target || '-') + ' → reinforcer: ' + (r.reinforcer || '-')); });
      lines.push('', 'STRATEGY CHECKLIST');
      items.forEach(function (it, i) { lines.push('  [' + (strat.querySelector('[data-nat="' + i + '"]').checked ? 'x' : ' ') + '] ' + it); });
      var rr = rt._readRows();
      if (rr.length) { lines.push('', 'EMBEDDED OPPORTUNITIES'); rr.forEach(function (r) { lines.push('  • ' + (r.routine || '-') + ': ' + (r.opportunity || '-')); }); }
      copyBtn(lines.join('\n'), copy);
    };
    actions.appendChild(copy);
    panel.appendChild(actions);
    return panel;
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  BEHAVIOR PLAN tab — FBA → function → intervention (FCT)
  // ═══════════════════════════════════════════════════════════════════════
  function buildBehaviorPlan() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'aba-ws-intro' },
      'Turn ABC data into a function-based support plan. Identify the hypothesized <strong>function</strong> of the behavior, then design antecedent strategies, a communicative <strong>replacement behavior</strong> (FCT) that serves the same function, and consequence strategies. Behavior reduction should always pair with teaching a replacement.'));

    var card = el('div', { class: 'aba-card' });
    card.innerHTML = '<h4>Function-based behavior support plan</h4>';
    var f = [
      ['behavior', 'Target behavior (observable, measurable)', 'text', 'e.g. throws materials during table work'],
      ['function', 'Hypothesized function', 'select', ''],
      ['antecedent', 'Antecedent / prevention strategies', 'textarea', 'e.g. offer choices, grade task, visual schedule, pre-teach'],
      ['replacement', 'Replacement behavior (FCT) — same function', 'textarea', 'e.g. teach "break please" card that produces a break'],
      ['consequence', 'Consequence strategies', 'textarea', 'e.g. reinforce replacement immediately; withhold escape for target behavior safely'],
      ['reinforce', 'How the replacement is reinforced', 'text', 'e.g. break granted immediately + praise']
    ];
    f.forEach(function (x) {
      var d = el('div', { class: 'aba-field' });
      d.innerHTML = '<label>' + x[1] + '</label>';
      var inp;
      if (x[2] === 'select') {
        inp = el('select', { 'data-bp': x[0] });
        ['Escape / avoidance (demands)', 'Attention', 'Access to tangible / activity', 'Automatic / sensory'].forEach(function (o) { inp.appendChild(el('option', { value: o }, o)); });
      } else if (x[2] === 'textarea') {
        inp = el('textarea', { 'data-bp': x[0], placeholder: x[3] });
      } else {
        inp = el('input', { type: 'text', 'data-bp': x[0], placeholder: x[3] });
      }
      d.appendChild(inp);
      card.appendChild(d);
    });
    panel.appendChild(card);
    panel.appendChild(el('div', { class: 'aba-callout aba-tip' },
      '<span class="aba-callout-title">Match the replacement to the function</span>If the behavior gets escape, the replacement must also get escape (a break). If it gets attention, the replacement gets attention. A replacement that doesn’t serve the same function won’t stick.'));

    var actions = el('div', { class: 'aba-actions' });
    var copy = el('button', { class: 'aba-btn', type: 'button' }, 'Copy behavior plan');
    copy.onclick = function () {
      var lines = ['FUNCTION-BASED BEHAVIOR SUPPORT PLAN', 'Date: ' + dateStamp(), ''];
      f.forEach(function (x) { lines.push('  ' + x[1] + ': ' + (val('[data-bp="' + x[0] + '"]', card) || '-')); });
      copyBtn(lines.join('\n'), copy);
    };
    actions.appendChild(copy);
    panel.appendChild(actions);
    return panel;
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  GOALS & PROGRESS tab — SMART + GAS + acquisition tracker
  // ═══════════════════════════════════════════════════════════════════════
  function buildGoals() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'aba-ws-intro' },
      'Write measurable skill-acquisition goals, scale them with Goal Attainment Scaling, and track percent-independent across sessions to judge progress toward mastery.'));

    var smart = el('div', { class: 'aba-card' });
    smart.appendChild(el('h4', null, 'Measurable skill goal (SMART)'));
    var fields = [
      ['specific', 'Specific skill', 'What exactly will the learner do?', 'e.g. Request items using a picture card'],
      ['measurable', 'Measurable', 'Criterion / how measured', 'e.g. ≥90% independent'],
      ['achievable', 'Achievable', 'Realistic next step from baseline?', 'e.g. from 20% baseline'],
      ['relevant', 'Relevant / functional', 'Why it matters to the learner/family', 'e.g. reduces frustration, builds autonomy'],
      ['timebound', 'Time-bound', 'By when', 'e.g. across 3 sessions within 6 weeks']
    ];
    fields.forEach(function (x) {
      var d = el('div', { class: 'aba-field' });
      d.innerHTML = '<label>' + x[1] + ' <span class="aba-hint">' + x[2] + '</span></label>';
      d.appendChild(el('input', { type: 'text', 'data-smart': x[0], placeholder: x[3] }));
      smart.appendChild(d);
    });
    var preview = el('div', { class: 'aba-preview' });
    smart.appendChild(preview);
    smart.addEventListener('input', function () {
      var g = {};
      smart.querySelectorAll('[data-smart]').forEach(function (i) { g[i.getAttribute('data-smart')] = i.value.trim(); });
      if (!g.specific && !g.measurable) { preview.innerHTML = ''; return; }
      preview.innerHTML = '<strong>Goal:</strong> ' + esc(g.specific || '…') +
        (g.measurable ? ' to ' + esc(g.measurable) : '') +
        (g.timebound ? ', ' + esc(g.timebound) : '') +
        (g.relevant ? '. <em>' + esc(g.relevant) + '.</em>' : '.');
    });
    panel.appendChild(smart);

    // GAS
    var gas = el('div', { class: 'aba-card' });
    gas.appendChild(el('h4', null, 'Goal Attainment Scaling (GAS)'));
    var gnf = el('div', { class: 'aba-field' });
    gnf.innerHTML = '<label>Goal name</label>';
    gnf.appendChild(el('input', { type: 'text', 'data-gas': 'name', placeholder: 'e.g. Independent requesting' }));
    gas.appendChild(gnf);
    var levels = [
      ['-2', 'Much less than expected', 'aba-gas--2'],
      ['-1', 'Somewhat less than expected', 'aba-gas--1'],
      ['0', 'Expected outcome', 'aba-gas-0'],
      ['+1', 'Somewhat more than expected', 'aba-gas-1'],
      ['+2', 'Much more than expected', 'aba-gas-2']
    ];
    levels.forEach(function (lv) {
      var row = el('div', { class: 'aba-gas-level' });
      row.appendChild(el('span', { class: 'aba-gas-tag ' + lv[2] }, lv[0] + '<br>' + lv[1]));
      var inp = el('input', { type: 'text', 'data-gas-level': lv[0], placeholder: 'Describe this outcome level' });
      inp.style.cssText = 'width:100%;box-sizing:border-box;padding:8px 10px;border:1px solid var(--border);border-radius:6px;background:#fdfcf9;';
      row.appendChild(inp);
      gas.appendChild(row);
    });
    var curField = el('div', { class: 'aba-field' });
    curField.innerHTML = '<label>Current attainment level</label>';
    var curSel = el('select', { 'data-gas': 'current' });
    ['-2', '-1', '0', '+1', '+2'].forEach(function (v) { curSel.appendChild(el('option', { value: v }, v)); });
    curSel.value = '-2';
    curField.appendChild(curSel);
    gas.appendChild(curField);
    var tOut = el('div', { class: 'aba-readout' });
    gas.appendChild(tOut);
    function updateT() {
      var x = parseInt(curSel.value, 10);
      var rho = 0.3;
      var T = 50 + (10 * x) / Math.sqrt((1 - rho) + rho);
      tOut.innerHTML = '<span class="aba-stat"><b>' + Math.round(T) + '</b>GAS T-score</span>' +
        '<span class="aba-stat"><b>' + curSel.value + '</b>current level</span>' +
        '<span class="aba-stat" style="font-size:12px;color:#7a7364;">T=50 is the expected outcome; &gt;50 exceeds expectation.</span>';
    }
    curSel.addEventListener('change', updateT);
    updateT();
    panel.appendChild(gas);

    // Acquisition tracker
    var track = el('div', { class: 'aba-card' });
    track.appendChild(el('h4', null, 'Skill-acquisition tracker'));
    track.appendChild(el('p', { class: 'aba-ws-intro' }, 'Log percent-independent per session to watch the learning curve toward mastery.'));
    var st = buildTable([
      { key: 'date', label: 'Session date', type: 'date', width: '150px' },
      { key: 'target', label: 'Target skill', type: 'text' },
      { key: 'pct', label: '% independent', type: 'num', width: '110px' }
    ]);
    track.appendChild(st);
    var trend = el('ul', { class: 'aba-progress-list' });
    track.appendChild(trend);
    function refreshTrend() {
      var rows = st._readRows().filter(function (r) { return r.pct !== '' && !isNaN(parseFloat(r.pct)); });
      trend.innerHTML = '';
      if (!rows.length) return;
      var base = parseFloat(rows[0].pct);
      rows.forEach(function (r, i) {
        var v = parseFloat(r.pct); var d = v - base;
        var deltaHtml = i === 0 ? '<span class="aba-hint">baseline</span>' :
          (d >= 0 ? '<span class="aba-delta-up">+' + d + ' pts</span>' : '<span class="aba-delta-down">' + d + ' pts</span>');
        var li = el('li');
        li.innerHTML = '<span>' + esc(r.date || ('Session ' + (i + 1))) + ' — ' + esc(r.target || '') + ' ' + v + '%</span>' + deltaHtml;
        trend.appendChild(li);
      });
    }
    track.addEventListener('input', refreshTrend);
    track.addEventListener('click', function (e) { if (/Add row/.test(e.target.textContent) || e.target.classList.contains('aba-row-del')) setTimeout(refreshTrend, 0); });
    panel.appendChild(track);

    var actions = el('div', { class: 'aba-actions' });
    var copy = el('button', { class: 'aba-btn', type: 'button' }, 'Copy goals + progress');
    copy.onclick = function () {
      var g = {};
      smart.querySelectorAll('[data-smart]').forEach(function (i) { g[i.getAttribute('data-smart')] = i.value.trim(); });
      var lines = ['ABA — GOALS & PROGRESS', 'Date: ' + dateStamp(), '', 'SMART SKILL GOAL'];
      fields.forEach(function (x) { lines.push('  ' + x[1] + ': ' + (g[x[0]] || '-')); });
      lines.push('', 'GOAL ATTAINMENT SCALING — ' + (val('[data-gas="name"]', gas) || '(goal)'));
      levels.forEach(function (lv) { lines.push('  ' + lv[0] + ' (' + lv[1] + '): ' + (val('[data-gas-level="' + lv[0] + '"]', gas) || '-')); });
      lines.push('  Current level: ' + curSel.value);
      var rows = st._readRows().filter(function (r) { return r.pct; });
      if (rows.length) {
        lines.push('', 'ACQUISITION TREND');
        var base = parseFloat(rows[0].pct);
        rows.forEach(function (r, i) {
          var d = parseFloat(r.pct) - base;
          lines.push('  ' + (r.date || ('Session ' + (i + 1))) + ': ' + (r.target || '') + ' ' + r.pct + '%' + (i === 0 ? ' (baseline)' : ' (' + (d >= 0 ? '+' : '') + d + ' pts)'));
        });
      }
      copyBtn(lines.join('\n'), copy);
    };
    actions.appendChild(copy);
    panel.appendChild(actions);
    return panel;
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  Assemble tabs
  // ═══════════════════════════════════════════════════════════════════════
  var TABS = [
    { id: 'learn', label: 'Learn', build: function () { return el('div', { html: LEARN_HTML }); } },
    { id: 'assess', label: 'Assess', build: buildAssess },
    { id: 'dtt', label: 'DTT', build: buildDTT },
    { id: 'naturalistic', label: 'Naturalistic (PRT/ESDM)', build: buildNaturalistic },
    { id: 'behavior', label: 'Behavior Plan (FBA)', build: buildBehaviorPlan },
    { id: 'goals', label: 'Goals & Progress', build: buildGoals }
  ];

  var meta = el('div', { class: 'aba-meta' });
  meta.innerHTML =
    '<span class="aba-chip aba-chip-accent">Module 2 of 7</span>' +
    '<span class="aba-chip">ABA · DTT · PRT · ESDM</span>' +
    '<span class="aba-chip">Autism Spectrum Disorder</span>' +
    '<span class="aba-chip">Neurodiversity-affirming</span>' +
    '<span class="aba-chip">Trainee / advanced student</span>' +
    '<span class="aba-chip">~5–7 contact hours</span>';
  root.appendChild(meta);

  // Print / Save-as-PDF: build every panel, then print (global print CSS shows only the active section; module CSS reveals all panels).
  var abaPrintBar = el('div', { class: 'aba-actions' });
  var abaPrintBtn = el('button', { class: 'aba-btn aba-btn-ghost aba-btn-sm', type: 'button' }, '\u1F5A8 Print / Save as PDF');
  abaPrintBtn.innerHTML = '&#128424; Print / Save as PDF';
  abaPrintBtn.onclick = function () {
    var allTabs = tabBar.querySelectorAll('.aba-tab');
    Array.prototype.forEach.call(allTabs, function (b) { b.click(); });
    if (allTabs[0]) allTabs[0].click();
    window.print();
  };
  abaPrintBar.appendChild(abaPrintBtn);
  root.appendChild(abaPrintBar);

  var tabBar = el('div', { class: 'aba-tabs' });
  var panels = el('div');
  TABS.forEach(function (t, i) {
    var btn = el('button', { class: 'aba-tab' + (i === 0 ? ' aba-active' : ''), type: 'button' }, t.label);
    var panel = el('div', { class: 'aba-panel' + (i === 0 ? ' aba-active' : '') });
    var built = false;
    function activate() {
      tabBar.querySelectorAll('.aba-tab').forEach(function (b) { b.classList.remove('aba-active'); });
      panels.querySelectorAll('.aba-panel').forEach(function (p) { p.classList.remove('aba-active'); });
      btn.classList.add('aba-active');
      panel.classList.add('aba-active');
      if (!built) { panel.appendChild(t.build()); built = true; }
    }
    btn.onclick = activate;
    if (i === 0) { panel.appendChild(t.build()); built = true; }
    tabBar.appendChild(btn);
    panels.appendChild(panel);
  });
  root.appendChild(tabBar);
  root.appendChild(panels);

  var hash = (location.hash || '').split(':')[1];
  if (hash) {
    var idx = TABS.map(function (t) { return t.id; }).indexOf(hash);
    if (idx > -1) tabBar.querySelectorAll('.aba-tab')[idx].click();
  }
})();

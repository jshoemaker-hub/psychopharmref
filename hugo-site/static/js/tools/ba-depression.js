/* ═══════════════════════════════════════════════════════════════════════
   ba-depression.js — Flagship course module
   "Behavioral Activation & CBT for Depression: A Practical How-To"
   Audience: trainees & advanced students.
   Builds a tabbed module (Learn + interactive worksheets + goal tools +
   fidelity/outcomes) into #ba-root. Uses ToolUtils for clipboard/date/reset.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var root = document.getElementById('ba-root');
  if (!root || root.dataset.baBuilt) return;
  root.dataset.baBuilt = '1';

  var U = window.ToolUtils || {};
  function dateStamp() { return (U.dateStamp ? U.dateStamp() : new Date().toLocaleDateString()); }
  function copyBtn(text, btn) { if (U.copyWithButton) U.copyWithButton(text, btn); }

  // ── small DOM helpers ──────────────────────────────────────────────────
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
    '<div class="ba-learn">' +
      '<p class="ba-lead">Behavioral Activation (BA) is a structured, present-focused therapy that treats depression by re-engaging people with sources of positive reinforcement and reducing avoidance. It is effective as a stand-alone treatment and is the behavioral engine inside full cognitive-behavioral therapy (CBT). Component-analysis and non-inferiority trials show BA performs comparably to full CBT and antidepressant medication for major depression, while being simpler to learn and deliver.</p>' +

      '<h3>1. The behavioral model of depression</h3>' +
      '<p>Depression is understood as a self-maintaining cycle. A loss, stressor, or low mood reduces activity; reduced activity cuts off contact with positive reinforcement and reward; life feels flat and effortful; the person withdraws further to escape discomfort. Short-term relief from avoidance negatively reinforces withdrawal, deepening the cycle.</p>' +
      '<div class="ba-cycle">' +
        '<span class="ba-cycle-node">Low mood / life stressor</span>' +
        '<span class="ba-cycle-arrow">&rarr;</span>' +
        '<span class="ba-cycle-node">Withdrawal &amp; avoidance</span>' +
        '<span class="ba-cycle-arrow">&rarr;</span>' +
        '<span class="ba-cycle-node">Less positive reinforcement / reward</span>' +
        '<span class="ba-cycle-arrow">&rarr;</span>' +
        '<span class="ba-cycle-node">Worse mood, more fatigue</span>' +
        '<span class="ba-cycle-arrow">&#8630;</span>' +
      '</div>' +
      '<p>BA breaks the cycle from the <em>outside in</em>: rather than waiting to feel motivated, the client schedules and performs values-consistent activities, which restores reinforcement and lifts mood. The core clinical slogan is <strong>&ldquo;action before motivation&rdquo;</strong> &mdash; behavior change leads, and mood follows.</p>' +

      '<h3>2. Core principles to teach the client</h3>' +
      '<ul>' +
        '<li><strong>Mood follows action, not the reverse.</strong> Waiting to feel like it keeps the cycle going.</li>' +
        '<li><strong>Activity is medicine at a dose.</strong> We schedule it deliberately, then review what actually happened.</li>' +
        '<li><strong>Work from the outside in.</strong> Change what you do; feelings and thoughts shift downstream.</li>' +
        '<li><strong>Approach, don&rsquo;t avoid.</strong> Avoidance brings short-term relief but long-term cost. We replace it with values-based approach.</li>' +
        '<li><strong>Use a functional, non-judgmental lens.</strong> Every behavior makes sense given its antecedents and consequences (the ABC model).</li>' +
      '</ul>' +

      '<h3>3. Step-by-step delivery</h3>' +
      '<h4>Step 1 &mdash; Psychoeducation &amp; rationale</h4>' +
      '<p>Present the model collaboratively using the client&rsquo;s own examples. Draw the depression cycle together and elicit a recent instance where withdrawal made things worse. Introduce &ldquo;action before motivation&rdquo; and set the expectation that treatment is active and homework-driven.</p>' +
      '<h4>Step 2 &mdash; Baseline self-monitoring</h4>' +
      '<p>Have the client log activities and mood for one week using the <em>Activity &amp; Mood Log</em> (Monitor tab). Rate each activity for <strong>mastery</strong> (sense of accomplishment, 0&ndash;10) and <strong>pleasure</strong> (enjoyment, 0&ndash;10). This reveals the activity&ndash;mood link, identifies depleted domains, and surfaces avoidance patterns.</p>' +
      '<h4>Step 3 &mdash; Values &amp; activity identification</h4>' +
      '<p>Clarify what matters across life areas (relationships, work/education, health, recreation, community, spirituality, daily responsibilities). Depression narrows life to obligations; BA deliberately rebuilds toward valued directions. Use the <em>Values Compass</em> (Values tab) to generate candidate activities tied to each value.</p>' +
      '<h4>Step 4 &mdash; Activity scheduling (graded &amp; values-based)</h4>' +
      '<p>Collaboratively schedule specific activities at specific times. Two anchors:</p>' +
      '<ul>' +
        '<li><strong>Graded:</strong> start small and build. Break large activities into achievable steps so early attempts succeed (a graded-task hierarchy).</li>' +
        '<li><strong>Values-based:</strong> favor activities that express what matters, not just pleasant distractions.</li>' +
      '</ul>' +
      '<p>Schedule <em>when</em> and <em>where</em>, not just <em>what</em>. Predict mastery and pleasure, then compare with what actually occurred &mdash; prediction/outcome mismatches are powerful learning.</p>' +
      '<h4>Step 5 &mdash; Targeting avoidance: TRAP &rarr; TRAC</h4>' +
      '<p>Teach clients to spot avoidance patterns and replace them with approach coping.</p>' +
      '<dl class="ba-acr">' +
        '<dt>TRAP</dt><dd><strong>T</strong>rigger &rarr; <strong>R</strong>esponse (emotion) &rarr; <strong>A</strong>voidance <strong>P</strong>attern</dd>' +
        '<dt>TRAC</dt><dd><strong>T</strong>rigger &rarr; <strong>R</strong>esponse (emotion) &rarr; <strong>A</strong>lternative <strong>C</strong>oping (values-based approach)</dd>' +
      '</dl>' +
      '<p>The <strong>ACTION</strong> acronym helps clients decide what to do: <em>Assess</em> the function of the behavior; <em>Choose</em> to activate or avoid; <em>Try</em> the chosen behavior; <em>Integrate</em> it into routine; <em>Observe</em> the result; <em>Never give up</em>.</p>' +
      '<h4>Step 6 &mdash; Problem-solving barriers</h4>' +
      '<p>When a scheduled activity doesn&rsquo;t happen, treat it as data, not failure. Identify the barrier (practical, skills, mood, cognitive), problem-solve collaboratively, and re-grade the task to a more achievable size.</p>' +
      '<h4>Step 7 &mdash; Rumination as avoidance</h4>' +
      '<p>Rumination often functions as covert avoidance. Rather than challenging thought content, coach clients to notice rumination, gently label it, and re-engage attention with the current activity (attention to direct experience). This is BA&rsquo;s alternative to lengthy cognitive disputation.</p>' +
      '<h4>Step 8 &mdash; Relapse prevention</h4>' +
      '<p>Consolidate the client&rsquo;s personal model, list early-warning signs, and build a written activation plan for high-risk periods. Space sessions out and add boosters. The goal is a self-directed &ldquo;be your own BA therapist&rdquo; skillset.</p>' +

      '<h3>4. Adding cognitive techniques (full CBT)</h3>' +
      '<p>When cognitions are a strong maintaining factor, layer in CBT tools: <strong>thought records</strong> to identify and evaluate automatic thoughts, <strong>behavioral experiments</strong> to test predictions in vivo, and structured <strong>problem-solving</strong>. Behavioral experiments pair naturally with activity scheduling &mdash; the scheduled activity becomes a test of a specific negative prediction.</p>' +

      '<h3>5. Session structure (the standard template)</h3>' +
      '<ol>' +
        '<li>Set a collaborative agenda</li>' +
        '<li>Brief mood check (ideally a rating-scale score, e.g., PHQ-9)</li>' +
        '<li>Review self-monitoring &amp; homework from last session</li>' +
        '<li>Link activity to mood; draw out the pattern</li>' +
        '<li>Teach/practice the session&rsquo;s skill (scheduling, TRAP&ndash;TRAC, problem-solving)</li>' +
        '<li>Collaboratively assign next activities (homework)</li>' +
        '<li>Summarize and elicit feedback</li>' +
      '</ol>' +
      '<p>Typical course: <strong>8&ndash;20 sessions</strong>, weekly, with tapering and boosters. Early sessions are more frequent to build momentum.</p>' +

      '<h3>6. Troubleshooting</h3>' +
      '<div class="ba-callout ba-tip"><span class="ba-callout-title">Low motivation / &ldquo;I didn&rsquo;t feel like it&rdquo;</span>Reframe as expected &mdash; motivation is the target, not the prerequisite. Re-grade to a smaller task, schedule a specific time, and use if-then implementation plans.</div>' +
      '<div class="ba-callout ba-tip"><span class="ba-callout-title">Homework not done</span>Explore the barrier non-judgmentally, shrink the task, add environmental cues/reminders, and consider in-session rehearsal. Never skip homework review &mdash; doing so signals it doesn&rsquo;t matter.</div>' +
      '<div class="ba-callout ba-tip"><span class="ba-callout-title">&ldquo;Nothing is enjoyable&rdquo; (anhedonia)</span>De-emphasize pleasure; lead with mastery and values. Schedule the activity regardless of anticipated enjoyment and review actual ratings &mdash; anticipation is usually more negative than experience.</div>' +

      '<h3>7. Adaptations</h3>' +
      '<ul>' +
        '<li><strong>Severe depression:</strong> BA is a strong first choice; keep tasks very small and concrete, increase structure and frequency.</li>' +
        '<li><strong>Bipolar depression:</strong> use BA cautiously &mdash; emphasize <em>routine and rhythm regulation</em> (sleep/wake, social rhythms) over open-ended activation, and monitor for switch into hypomania/mania. Coordinate with pharmacotherapy.</li>' +
        '<li><strong>Medical comorbidity / low energy:</strong> grade to physical capacity; coordinate with medical care.</li>' +
        '<li><strong>Older adults:</strong> BA has strong evidence; adapt for sensory, cognitive, and mobility factors.</li>' +
        '<li><strong>Adolescents:</strong> involve caregivers, use concrete values, and reinforce engagement.</li>' +
        '<li><strong>Culture:</strong> define values and rewarding activities within the client&rsquo;s cultural and family context; avoid imposing individualistic assumptions.</li>' +
      '</ul>' +

      '<h3>8. Combining with medication</h3>' +
      '<p>BA and antidepressants are compatible and frequently combined. Medication can raise energy and initiation enough to make activation feasible; BA builds durable skills that reduce relapse. Track both symptom scores and activity engagement, and coordinate messaging so the client sees the two treatments as complementary rather than competing.</p>' +

      '<h3>9. Measuring outcomes</h3>' +
      '<p>Use a repeated, validated measure every session or two: the <strong>PHQ-9</strong> for depressive severity (built into this site), and optionally the <strong>Behavioral Activation for Depression Scale (BADS)</strong> to track the mechanism (activation vs. avoidance). Pair symptom scores with individualized <strong>Goal Attainment Scaling</strong> (Goals tab) for functional change.</p>' +

      '<h3>Key references</h3>' +
      '<ul class="ba-refs">' +
        '<li>Martell, C. R., Dimidjian, S., &amp; Herman-Dunn, R. (2022). <em>Behavioral Activation for Depression: A Clinician&rsquo;s Guide</em> (2nd ed.). Guilford Press.</li>' +
        '<li>Dimidjian, S., et al. (2006). Randomized trial of behavioral activation, cognitive therapy, and antidepressant medication in the acute treatment of adults with major depression. <em>J Consult Clin Psychol.</em></li>' +
        '<li>Ekers, D., et al. (2014). Behavioural activation for depression: systematic review and meta-analysis. <em>PLoS ONE.</em></li>' +
        '<li>Beck, A. T., Rush, A. J., Shaw, B. F., &amp; Emery, G. (1979). <em>Cognitive Therapy of Depression.</em> Guilford Press.</li>' +
        '<li>Beck, J. S. (2020). <em>Cognitive Behavior Therapy: Basics and Beyond</em> (3rd ed.). Guilford Press.</li>' +
        '<li>Lejuez, C. W., et al. (2011). Ten-year revision of the Brief Behavioral Activation Treatment for Depression (BATD-R). <em>Behav Modif.</em></li>' +
      '</ul>' +
    '</div>';

  // ═══════════════════════════════════════════════════════════════════════
  //  Reusable dynamic-table worksheet
  //  cols: [{key,label,type,ph,opts,width}], starter rows optional
  // ═══════════════════════════════════════════════════════════════════════
  function buildTable(cols, opts) {
    opts = opts || {};
    var wrap = el('div');
    var table = el('table', { class: 'ba-table' });
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
        input = el('input', { type: 'number', min: '0', max: '10', class: 'ba-num', placeholder: c.ph || '' });
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
      var del = el('button', { class: 'ba-row-del', title: 'Remove row', type: 'button' }, '&times;');
      del.onclick = function () { tr.remove(); };
      delTd.appendChild(del);
      tr.appendChild(delTd);
      tbody.appendChild(tr);
      return tr;
    }
    (opts.starter || []).forEach(addRow);
    if (!opts.starter) addRow();

    var addBtn = el('button', { class: 'ba-btn ba-btn-ghost ba-btn-sm', type: 'button' }, '+ Add row');
    addBtn.onclick = function () { addRow(); };
    wrap.appendChild(el('div', { class: 'ba-actions' })).appendChild(addBtn);

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
  //  MONITOR tab — Activity & Mood Log
  // ═══════════════════════════════════════════════════════════════════════
  function buildMonitor() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'ba-ws-intro' },
      'Baseline self-monitoring worksheet (Step 2). Log real activities across a week and rate <strong>mood</strong>, <strong>mastery</strong> (sense of accomplishment), and <strong>pleasure</strong> (enjoyment) from 0&ndash;10. Review the activity&ndash;mood link with your client and look for avoidance patterns and depleted life areas.'));
    var card = el('div', { class: 'ba-card' });
    card.appendChild(el('h4', null, 'Activity &amp; Mood Log'));
    var t = buildTable([
      { key: 'day', label: 'Day', type: 'select', opts: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], width: '70px' },
      { key: 'time', label: 'Time', type: 'text', ph: 'e.g. 9am', width: '80px' },
      { key: 'activity', label: 'Activity (what you actually did)', type: 'text', ph: 'Describe the activity' },
      { key: 'mood', label: 'Mood 0-10', type: 'num', width: '70px' },
      { key: 'mastery', label: 'Mastery 0-10', type: 'num', width: '70px' },
      { key: 'pleasure', label: 'Pleasure 0-10', type: 'num', width: '70px' }
    ], { starter: [
      { day: 'Mon', time: 'Morning' }, { day: 'Mon', time: 'Afternoon' }, { day: 'Mon', time: 'Evening' }
    ] });
    card.appendChild(t);
    panel.appendChild(card);

    var readout = el('div', { class: 'ba-readout' });
    panel.appendChild(readout);
    function refresh() {
      var rows = t._readRows();
      var moods = rows.map(function (r) { return parseFloat(r.mood); }).filter(function (n) { return !isNaN(n); });
      var mas = rows.map(function (r) { return parseFloat(r.mastery); }).filter(function (n) { return !isNaN(n); });
      var ple = rows.map(function (r) { return parseFloat(r.pleasure); }).filter(function (n) { return !isNaN(n); });
      function avg(a) { return a.length ? (a.reduce(function (x, y) { return x + y; }, 0) / a.length).toFixed(1) : '—'; }
      readout.innerHTML =
        '<span class="ba-stat"><b>' + rows.length + '</b>activities logged</span>' +
        '<span class="ba-stat"><b>' + avg(moods) + '</b>avg mood</span>' +
        '<span class="ba-stat"><b>' + avg(mas) + '</b>avg mastery</span>' +
        '<span class="ba-stat"><b>' + avg(ple) + '</b>avg pleasure</span>';
    }
    panel.addEventListener('input', refresh);
    panel.addEventListener('click', function (e) { if (e.target.classList.contains('ba-row-del') || e.target.textContent === '+ Add row') setTimeout(refresh, 0); });
    refresh();

    var actions = el('div', { class: 'ba-actions' });
    var copy = el('button', { class: 'ba-btn', type: 'button' }, 'Copy log summary');
    copy.onclick = function () {
      var rows = t._readRows();
      var lines = ['ACTIVITY & MOOD LOG', 'Date: ' + dateStamp(), ''];
      rows.forEach(function (r) {
        lines.push([r.day, r.time].filter(Boolean).join(' ') + ' — ' + (r.activity || '(activity)') +
          '  [mood ' + (r.mood || '-') + ' / mastery ' + (r.mastery || '-') + ' / pleasure ' + (r.pleasure || '-') + ']');
      });
      lines.push('', 'Reflection prompts: Which activities lifted mood? Which were avoided? Which life areas are depleted?');
      copyBtn(lines.join('\n'), copy);
    };
    actions.appendChild(copy);
    panel.appendChild(actions);
    return panel;
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  VALUES tab — Values Compass
  // ═══════════════════════════════════════════════════════════════════════
  var LIFE_AREAS = [
    'Relationships & family', 'Work / education', 'Health & body',
    'Recreation & hobbies', 'Community & friends', 'Spirituality / meaning',
    'Daily responsibilities'
  ];
  function buildValues() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'ba-ws-intro' },
      'Values clarification worksheet (Step 3). For each life area, name what matters to your client, rate how important it is now (0&ndash;10), and brainstorm concrete activities that express that value. These become candidates for scheduling.'));
    var cards = [];
    LIFE_AREAS.forEach(function (area) {
      var card = el('div', { class: 'ba-card' });
      card.setAttribute('data-area', area);
      card.appendChild(el('h4', null, esc(area)));
      var g = el('div', { class: 'ba-grid2' });
      var f1 = el('div', { class: 'ba-field' });
      f1.innerHTML = '<label>What matters here? <span class="ba-hint">the value/direction</span></label>';
      var v1 = el('input', { type: 'text', 'data-key': 'value', placeholder: 'e.g. being a present parent' });
      f1.appendChild(v1);
      var f2 = el('div', { class: 'ba-field' });
      f2.innerHTML = '<label>Importance now <span class="ba-hint">0-10</span></label>';
      var v2 = el('input', { type: 'number', min: '0', max: '10', 'data-key': 'importance', class: 'ba-num' });
      f2.appendChild(v2);
      g.appendChild(f1); g.appendChild(f2);
      card.appendChild(g);
      var f3 = el('div', { class: 'ba-field' });
      f3.innerHTML = '<label>Activities that express this value <span class="ba-hint">brainstorm 2-4</span></label>';
      var v3 = el('textarea', { 'data-key': 'activities', placeholder: 'e.g. read with kids at bedtime; call my brother weekly' });
      f3.appendChild(v3);
      card.appendChild(f3);
      cards.push(card);
      panel.appendChild(card);
    });
    var actions = el('div', { class: 'ba-actions' });
    var copy = el('button', { class: 'ba-btn', type: 'button' }, 'Copy values map');
    copy.onclick = function () {
      var lines = ['VALUES COMPASS', 'Date: ' + dateStamp(), ''];
      cards.forEach(function (card) {
        var value = val('[data-key="value"]', card);
        var imp = val('[data-key="importance"]', card);
        var acts = val('[data-key="activities"]', card);
        if (value || acts) {
          lines.push(card.getAttribute('data-area') + (imp ? '  (importance ' + imp + '/10)' : ''));
          if (value) lines.push('  Value: ' + value);
          if (acts) lines.push('  Activities: ' + acts.replace(/\n/g, '; '));
          lines.push('');
        }
      });
      copyBtn(lines.join('\n'), copy);
    };
    actions.appendChild(copy);
    panel.appendChild(actions);
    return panel;
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  SCHEDULE tab — Activity Scheduling Planner (graded, values-based)
  // ═══════════════════════════════════════════════════════════════════════
  function buildSchedule() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'ba-ws-intro' },
      'Activity scheduling worksheet (Step 4) &mdash; this is the client&rsquo;s homework. Schedule specific, values-based activities at specific times. Use <strong>difficulty</strong> to grade tasks from easy to hard, and record <strong>predicted</strong> mastery/pleasure now; compare with actual ratings next session.'));
    var card = el('div', { class: 'ba-card' });
    card.appendChild(el('h4', null, 'Weekly Activity Schedule'));
    var t = buildTable([
      { key: 'activity', label: 'Planned activity', type: 'text', ph: 'Specific & concrete' },
      { key: 'value', label: 'Linked value / life area', type: 'text', ph: 'why it matters' },
      { key: 'day', label: 'Day', type: 'select', opts: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], width: '70px' },
      { key: 'time', label: 'Time', type: 'text', ph: 'e.g. 10am', width: '80px' },
      { key: 'difficulty', label: 'Difficulty', type: 'select', opts: ['Easy', 'Medium', 'Hard'], width: '90px' },
      { key: 'pmastery', label: 'Pred. mastery', type: 'num', width: '70px' },
      { key: 'ppleasure', label: 'Pred. pleasure', type: 'num', width: '70px' }
    ]);
    card.appendChild(t);
    panel.appendChild(card);
    panel.appendChild(el('div', { class: 'ba-callout ba-tip' },
      '<span class="ba-callout-title">Grading tip</span>If an activity feels too big, break it into a hierarchy of smaller steps and schedule only the first. Success on a small step builds momentum for the next.'));

    var actions = el('div', { class: 'ba-actions' });
    var copy = el('button', { class: 'ba-btn', type: 'button' }, 'Copy schedule (homework)');
    copy.onclick = function () {
      var rows = t._readRows();
      var lines = ['WEEKLY ACTIVITY SCHEDULE — HOMEWORK', 'Date: ' + dateStamp(), ''];
      rows.forEach(function (r) {
        lines.push('• ' + (r.day || '') + ' ' + (r.time || '') + ' — ' + (r.activity || '(activity)') +
          (r.difficulty ? ' [' + r.difficulty + ']' : '') +
          (r.value ? '  (value: ' + r.value + ')' : '') +
          '  predicted mastery ' + (r.pmastery || '-') + ' / pleasure ' + (r.ppleasure || '-'));
      });
      lines.push('', 'Next session: record ACTUAL mastery/pleasure and compare with predictions.');
      copyBtn(lines.join('\n'), copy);
    };
    actions.appendChild(copy);
    panel.appendChild(actions);
    return panel;
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  GOALS tab — SMART builder + Goal Attainment Scaling
  // ═══════════════════════════════════════════════════════════════════════
  function buildGoals() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'ba-ws-intro' },
      'Goal-setting worksheet. Draft a <strong>SMART</strong> goal, then convert it into a <strong>Goal Attainment Scaling (GAS)</strong> ladder so functional progress can be measured objectively across sessions.'));

    // --- SMART builder ---
    var smart = el('div', { class: 'ba-card' });
    smart.appendChild(el('h4', null, 'SMART goal builder'));
    var fields = [
      ['specific', 'Specific', 'What exactly will the client do?', 'e.g. Walk with a friend'],
      ['measurable', 'Measurable', 'How will you know it happened?', 'e.g. 20 minutes, tracked on phone'],
      ['achievable', 'Achievable', 'Is it realistic right now? Grade if needed.', 'e.g. start at 2x/week'],
      ['relevant', 'Relevant', 'Which value does it serve?', 'e.g. health & friendship'],
      ['timebound', 'Time-bound', 'By when / how often?', 'e.g. Tue & Sat mornings for 3 weeks']
    ];
    fields.forEach(function (f) {
      var d = el('div', { class: 'ba-field' });
      d.innerHTML = '<label>' + f[1] + ' <span class="ba-hint">' + f[2] + '</span></label>';
      d.appendChild(el('input', { type: 'text', 'data-smart': f[0], placeholder: f[3] }));
      smart.appendChild(d);
    });
    var preview = el('div', { class: 'ba-preview' });
    smart.appendChild(preview);
    function updatePreview() {
      var g = {};
      smart.querySelectorAll('[data-smart]').forEach(function (i) { g[i.getAttribute('data-smart')] = i.value.trim(); });
      if (!g.specific && !g.measurable) { preview.innerHTML = ''; return; }
      preview.innerHTML = '<strong>Goal:</strong> ' + esc(g.specific || '…') +
        (g.measurable ? ' — ' + esc(g.measurable) : '') +
        (g.timebound ? ', ' + esc(g.timebound) : '') +
        (g.relevant ? '. <em>Value: ' + esc(g.relevant) + '.</em>' : '.') +
        (g.achievable ? ' <span class="ba-hint">(' + esc(g.achievable) + ')</span>' : '');
    }
    smart.addEventListener('input', updatePreview);
    panel.appendChild(smart);

    // --- Goal Attainment Scaling ---
    var gas = el('div', { class: 'ba-card' });
    gas.appendChild(el('h4', null, 'Goal Attainment Scaling (GAS)'));
    gas.appendChild(el('p', { class: 'ba-ws-intro' },
      'Define what each outcome level looks like. &minus;2 = much less than expected, 0 = expected outcome, +2 = much better than expected. Then mark the current level. GAS lets you quantify individualized progress and compute a standardized T-score.'));
    var levels = [
      ['-2', 'Much less than expected', 'ba-gas--2'],
      ['-1', 'Somewhat less than expected', 'ba-gas--1'],
      ['0', 'Expected outcome', 'ba-gas-0'],
      ['+1', 'Somewhat more than expected', 'ba-gas-1'],
      ['+2', 'Much more than expected', 'ba-gas-2']
    ];
    var goalNameField = el('div', { class: 'ba-field' });
    goalNameField.innerHTML = '<label>Goal name</label>';
    goalNameField.appendChild(el('input', { type: 'text', 'data-gas': 'name', placeholder: 'e.g. Increase social contact' }));
    gas.appendChild(goalNameField);
    levels.forEach(function (lv) {
      var row = el('div', { class: 'ba-gas-level' });
      row.appendChild(el('span', { class: 'ba-gas-tag ' + lv[2] }, lv[0] + '<br>' + lv[1]));
      var inp = el('input', { type: 'text', 'data-gas-level': lv[0], placeholder: 'Describe this outcome level' });
      inp.style.width = '100%'; inp.style.boxSizing = 'border-box'; inp.style.padding = '8px 10px';
      inp.style.border = '1px solid var(--border)'; inp.style.borderRadius = '6px'; inp.style.background = '#fdfcf9';
      row.appendChild(inp);
      gas.appendChild(row);
    });
    var curField = el('div', { class: 'ba-field' });
    curField.innerHTML = '<label>Current attainment level</label>';
    var curSel = el('select', { 'data-gas': 'current' });
    ['-2', '-1', '0', '+1', '+2'].forEach(function (v) { curSel.appendChild(el('option', { value: v }, v)); });
    curSel.value = '-2';
    curField.appendChild(curSel);
    gas.appendChild(curField);
    var tOut = el('div', { class: 'ba-readout' });
    gas.appendChild(tOut);
    function updateT() {
      var x = parseInt(curSel.value, 10);
      // Single-goal GAS T-score (Kiresuk & Sherman), equal weights, rho=0.3
      var rho = 0.3;
      var T = 50 + (10 * x) / Math.sqrt((1 - rho) + rho);
      tOut.innerHTML = '<span class="ba-stat"><b>' + Math.round(T) + '</b>GAS T-score</span>' +
        '<span class="ba-stat"><b>' + curSel.value + '</b>current level</span>' +
        '<span class="ba-stat" style="font-size:12px;color:#7a7364;">T=50 is the expected outcome; &gt;50 exceeds expectation.</span>';
    }
    curSel.addEventListener('change', updateT);
    updateT();
    panel.appendChild(gas);

    var actions = el('div', { class: 'ba-actions' });
    var copy = el('button', { class: 'ba-btn', type: 'button' }, 'Copy goal plan');
    copy.onclick = function () {
      var g = {};
      smart.querySelectorAll('[data-smart]').forEach(function (i) { g[i.getAttribute('data-smart')] = i.value.trim(); });
      var lines = ['GOAL PLAN', 'Date: ' + dateStamp(), '', 'SMART GOAL'];
      lines.push('  Specific: ' + (g.specific || '-'));
      lines.push('  Measurable: ' + (g.measurable || '-'));
      lines.push('  Achievable: ' + (g.achievable || '-'));
      lines.push('  Relevant: ' + (g.relevant || '-'));
      lines.push('  Time-bound: ' + (g.timebound || '-'));
      lines.push('', 'GOAL ATTAINMENT SCALING — ' + (val('[data-gas="name"]', gas) || '(goal)'));
      levels.forEach(function (lv) {
        lines.push('  ' + lv[0] + ' (' + lv[1] + '): ' + (val('[data-gas-level="' + lv[0] + '"]', gas) || '-'));
      });
      lines.push('  Current level: ' + curSel.value);
      copyBtn(lines.join('\n'), copy);
    };
    actions.appendChild(copy);
    panel.appendChild(actions);
    return panel;
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  FIDELITY & OUTCOMES tab
  // ═══════════════════════════════════════════════════════════════════════
  var FIDELITY_ITEMS = [
    'Set a collaborative agenda',
    'Completed a mood check (e.g., PHQ-9 score)',
    'Reviewed self-monitoring / previous homework',
    'Explicitly linked activity to mood',
    'Taught or practiced a BA skill this session',
    'Identified avoidance (TRAP) and an alternative coping plan (TRAC)',
    'Problem-solved barriers to activation',
    'Collaboratively assigned next activities (homework)',
    'Graded task difficulty to an achievable level',
    'Summarized and elicited client feedback'
  ];
  function buildFidelity() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'ba-ws-intro' },
      'Use this after a session for self-supervision or peer review. Check each core BA component that was delivered, then track the PHQ-9 across sessions to monitor symptom change.'));

    // Fidelity checklist
    var card = el('div', { class: 'ba-card' });
    card.appendChild(el('h4', null, 'BA session adherence checklist'));
    FIDELITY_ITEMS.forEach(function (item, i) {
      var lab = el('label', { class: 'ba-check' });
      lab.innerHTML = '<input type="checkbox" data-fid="' + i + '"> <span>' + esc(item) + '</span>';
      card.appendChild(lab);
    });
    var fidOut = el('div', { class: 'ba-readout' });
    card.appendChild(fidOut);
    function refreshFid() {
      var boxes = card.querySelectorAll('[data-fid]');
      var done = card.querySelectorAll('[data-fid]:checked').length;
      var pct = Math.round((done / boxes.length) * 100);
      fidOut.innerHTML = '<span class="ba-stat"><b>' + done + '/' + boxes.length + '</b>components delivered</span>' +
        '<span class="ba-stat"><b>' + pct + '%</b>adherence</span>';
    }
    card.addEventListener('change', refreshFid);
    refreshFid();
    panel.appendChild(card);

    // PHQ-9 tracker
    var pcard = el('div', { class: 'ba-card' });
    pcard.appendChild(el('h4', null, 'PHQ-9 progress tracker'));
    pcard.appendChild(el('p', { class: 'ba-ws-intro' },
      'Enter the PHQ-9 total (0&ndash;27) per session. Change from baseline is shown automatically. A drop of &ge;5 points (and/or &ge;50%) is a common response threshold.'));
    var pt = buildTable([
      { key: 'date', label: 'Session date', type: 'date', width: '150px' },
      { key: 'session', label: 'Session #', type: 'text', ph: '#', width: '80px' },
      { key: 'phq', label: 'PHQ-9 total (0-27)', type: 'num', width: '110px' },
      { key: 'note', label: 'Note', type: 'text', ph: 'optional' }
    ]);
    pcard.appendChild(pt);
    var trend = el('ul', { class: 'ba-progress-list' });
    pcard.appendChild(trend);
    function refreshTrend() {
      var rows = pt._readRows().filter(function (r) { return r.phq !== '' && !isNaN(parseFloat(r.phq)); });
      trend.innerHTML = '';
      if (!rows.length) return;
      var base = parseFloat(rows[0].phq);
      rows.forEach(function (r, i) {
        var v = parseFloat(r.phq);
        var d = v - base;
        var deltaHtml = i === 0 ? '<span class="ba-hint">baseline</span>' :
          (d <= 0 ? '<span class="ba-delta-up">' + d + ' from baseline</span>' :
            '<span class="ba-delta-down">+' + d + ' from baseline</span>');
        var li = el('li');
        li.innerHTML = '<span>' + esc(r.date || ('Session ' + (r.session || (i + 1)))) + ' — PHQ-9 ' + v + '</span>' + deltaHtml;
        trend.appendChild(li);
      });
    }
    pcard.addEventListener('input', refreshTrend);
    pcard.addEventListener('click', function (e) { if (e.target.textContent === '+ Add row' || e.target.classList.contains('ba-row-del')) setTimeout(refreshTrend, 0); });
    panel.appendChild(pcard);

    var actions = el('div', { class: 'ba-actions' });
    var copy = el('button', { class: 'ba-btn', type: 'button' }, 'Copy fidelity + outcomes report');
    copy.onclick = function () {
      var boxes = card.querySelectorAll('[data-fid]');
      var done = card.querySelectorAll('[data-fid]:checked').length;
      var lines = ['BA SESSION FIDELITY & OUTCOMES', 'Date: ' + dateStamp(), '',
        'Adherence: ' + done + '/' + boxes.length + ' components (' + Math.round((done / boxes.length) * 100) + '%)', ''];
      FIDELITY_ITEMS.forEach(function (item, i) {
        lines.push('  [' + (card.querySelector('[data-fid="' + i + '"]').checked ? 'x' : ' ') + '] ' + item);
      });
      var rows = pt._readRows().filter(function (r) { return r.phq; });
      if (rows.length) {
        lines.push('', 'PHQ-9 TREND');
        var base = parseFloat(rows[0].phq);
        rows.forEach(function (r, i) {
          var d = parseFloat(r.phq) - base;
          lines.push('  ' + (r.date || ('Session ' + (r.session || (i + 1)))) + ': ' + r.phq +
            (i === 0 ? ' (baseline)' : ' (' + (d <= 0 ? '' : '+') + d + ')') + (r.note ? ' — ' + r.note : ''));
        });
      }
      copyBtn(lines.join('\n'), copy);
    };
    actions.appendChild(copy);
    var reset = el('button', { class: 'ba-btn ba-btn-ghost', type: 'button' }, 'Reset checklist');
    reset.onclick = function () {
      if (U.confirmReset) U.confirmReset('Reset the adherence checklist?', function () {
        card.querySelectorAll('[data-fid]').forEach(function (b) { b.checked = false; });
        refreshFid();
      });
    };
    actions.appendChild(reset);
    panel.appendChild(actions);
    return panel;
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  Assemble tabs
  // ═══════════════════════════════════════════════════════════════════════
  var TABS = [
    { id: 'learn', label: 'Learn', build: function () { return el('div', { html: LEARN_HTML }); } },
    { id: 'monitor', label: 'Monitor', build: buildMonitor },
    { id: 'values', label: 'Values', build: buildValues },
    { id: 'schedule', label: 'Schedule', build: buildSchedule },
    { id: 'goals', label: 'Goals', build: buildGoals },
    { id: 'fidelity', label: 'Fidelity & Outcomes', build: buildFidelity }
  ];

  var meta = el('div', { class: 'ba-meta' });
  meta.innerHTML =
    '<span class="ba-chip ba-chip-accent">Module 3 of 7</span>' +
    '<span class="ba-chip">Behavioral Activation &amp; CBT</span>' +
    '<span class="ba-chip">Depression</span>' +
    '<span class="ba-chip">Trainee / advanced student</span>' +
    '<span class="ba-chip">~4&ndash;6 contact hours</span>';
  root.appendChild(meta);

  var tabBar = el('div', { class: 'ba-tabs' });
  var panels = el('div');
  TABS.forEach(function (t, i) {
    var btn = el('button', { class: 'ba-tab' + (i === 0 ? ' ba-active' : ''), type: 'button' }, t.label);
    var panel = el('div', { class: 'ba-panel' + (i === 0 ? ' ba-active' : '') });
    var built = false;
    function activate() {
      tabBar.querySelectorAll('.ba-tab').forEach(function (b) { b.classList.remove('ba-active'); });
      panels.querySelectorAll('.ba-panel').forEach(function (p) { p.classList.remove('ba-active'); });
      btn.classList.add('ba-active');
      panel.classList.add('ba-active');
      if (!built) { panel.appendChild(t.build()); built = true; }
    }
    btn.onclick = activate;
    if (i === 0) { panel.appendChild(t.build()); built = true; }
    tabBar.appendChild(btn);
    panels.appendChild(panel);
  });
  root.appendChild(tabBar);
  root.appendChild(panels);

  // Allow deep-linking to a tab via hash: #ba-depression:goals
  var hash = (location.hash || '').split(':')[1];
  if (hash) {
    var idx = TABS.map(function (t) { return t.id; }).indexOf(hash);
    if (idx > -1) tabBar.querySelectorAll('.ba-tab')[idx].click();
  }
})();

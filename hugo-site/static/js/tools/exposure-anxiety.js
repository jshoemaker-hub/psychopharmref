/* ═══════════════════════════════════════════════════════════════════════
   exposure-anxiety.js — Course module 4
   "Exposure-Based CBT for Anxiety Disorders (incl. ERP for OCD): A How-To"
   Audience: trainees & advanced students.
   Builds a tabbed module into #ex-root. Uses ToolUtils for clipboard/date/reset.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var root = document.getElementById('ex-root');
  if (!root || root.dataset.exBuilt) return;
  root.dataset.exBuilt = '1';

  var U = window.ToolUtils || {};
  function dateStamp() { return (U.dateStamp ? U.dateStamp() : new Date().toLocaleDateString()); }
  function copyBtn(text, btn) { if (U.copyWithButton) U.copyWithButton(text, btn); }

  // ── DOM helpers ────────────────────────────────────────────────────────
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
    '<div class="ex-learn">' +
      '<p class="ex-lead">Exposure therapy is the most effective psychological treatment for anxiety disorders, OCD, and specific phobias. It works by having the client deliberately and repeatedly approach feared situations, sensations, or thoughts &mdash; without avoidance or safety behaviors &mdash; so that new, non-threat learning can form. This module teaches the modern <strong>inhibitory-learning</strong> approach and how to deliver it in session.</p>' +

      '<h3>1. From habituation to inhibitory learning</h3>' +
      '<p>Older models framed exposure as <em>habituation</em> &mdash; stay in the situation until fear (SUDS) drops. The current, evidence-based model is <strong>inhibitory learning</strong>: the original fear association is never erased; instead exposure builds a new, competing &ldquo;safe&rdquo; association that inhibits the fear memory. The therapeutic target is therefore <strong>expectancy violation</strong> &mdash; the mismatch between what the client predicts will happen and what actually happens &mdash; not within-session fear reduction.</p>' +
      '<div class="ex-callout ex-tip"><span class="ex-callout-title">Practical implication</span>Design each exposure as a <em>behavioral test of a specific prediction</em>. Success is defined by learning (&ldquo;my feared outcome didn&rsquo;t happen, or I coped&rdquo;), not by whether the client calmed down. An exposure where fear stays high but the prediction is violated is a success.</div>' +

      '<h3>2. Core inhibitory-learning strategies</h3>' +
      '<ul>' +
        '<li><strong>Expectancy violation:</strong> make the prediction explicit and specific before exposure, then review whether it came true.</li>' +
        '<li><strong>Deepened extinction:</strong> combine multiple feared cues once each is tolerated.</li>' +
        '<li><strong>Variability:</strong> vary situations, durations, order, and intensity rather than a rigid low-to-high march. Variable, unpredictable practice builds more durable learning.</li>' +
        '<li><strong>Remove safety behaviors &amp; signals:</strong> subtle avoidance (carrying medication, over-preparing, distraction, reassurance) blocks new learning.</li>' +
        '<li><strong>Multiple contexts:</strong> practice across places, times, and states to reduce return of fear.</li>' +
        '<li><strong>Retrieval cues:</strong> help the client recall what they learned when fear returns.</li>' +
      '</ul>' +

      '<h3>3. Assessment &amp; functional analysis</h3>' +
      '<p>Map the anxiety before exposing anything: feared situations and stimuli; the specific feared outcomes/predictions; avoidance (overt and covert); and safety behaviors. Identify physical sensations that are themselves feared (for panic/health anxiety &rarr; interoceptive work). Use <strong>SUDS</strong> (Subjective Units of Distress, 0&ndash;100) as the common currency for rating items. The <em>Assess</em> and <em>Hierarchy</em> tabs operationalize this.</p>' +

      '<h3>4. Types of exposure</h3>' +
      '<ul>' +
        '<li><strong>In vivo</strong> &mdash; direct contact with the real feared situation/object (most common).</li>' +
        '<li><strong>Imaginal</strong> &mdash; vividly imagining feared images, memories, or worst-case narratives (worry, PTSD, some OCD).</li>' +
        '<li><strong>Interoceptive</strong> &mdash; deliberately inducing feared body sensations (e.g., hyperventilation, spinning, straw-breathing) for panic disorder.</li>' +
        '<li><strong>Virtual reality</strong> &mdash; simulated environments when in vivo is impractical (flying, heights).</li>' +
      '</ul>' +

      '<h3>5. Step-by-step exposure delivery</h3>' +
      '<ol>' +
        '<li><strong>Psychoeducation &amp; rationale:</strong> explain the anxiety cycle and how avoidance maintains fear; introduce inhibitory learning and expectancy violation. Secure informed consent and a collaborative stance.</li>' +
        '<li><strong>Build the hierarchy:</strong> generate a menu of exposure tasks, each with a SUDS rating; you don&rsquo;t have to go strictly bottom-up.</li>' +
        '<li><strong>Set up each exposure as a test:</strong> identify the specific prediction and rate its expected likelihood/cost.</li>' +
        '<li><strong>Conduct the exposure:</strong> approach the cue, drop safety behaviors, stay engaged, track SUDS periodically (as data, not the goal).</li>' +
        '<li><strong>Process &amp; consolidate:</strong> compare prediction vs. outcome; ask &ldquo;what did you learn?&rdquo; and reinforce the new learning.</li>' +
        '<li><strong>Assign between-session practice:</strong> frequent, varied, self-directed exposures generalize the learning. Homework is essential.</li>' +
      '</ol>' +

      '<h3>6. Exposure &amp; Response Prevention (ERP) for OCD</h3>' +
      '<p>ERP is the specialized exposure protocol for OCD and the frontline psychotherapy. The client is exposed to obsessional triggers (situations, thoughts, images) while <strong>preventing the compulsive response</strong> (rituals, checking, mental neutralizing, reassurance-seeking). Response prevention is the active ingredient: it lets the client learn that anxiety subsides and feared outcomes don&rsquo;t occur <em>without</em> the ritual.</p>' +
      '<dl class="ex-acr">' +
        '<dt>Trigger</dt><dd>the situation/thought that sets off the obsession</dd>' +
        '<dt>Obsession</dt><dd>the intrusive thought/image/urge and the feared outcome</dd>' +
        '<dt>Compulsion</dt><dd>the ritual or neutralizing act that must be resisted</dd>' +
        '<dt>Response prevention</dt><dd>the explicit plan for NOT performing the compulsion</dd>' +
      '</dl>' +
      '<p>The <em>ERP</em> tab maps triggers &rarr; obsessions &rarr; compulsions &rarr; response-prevention plans. Build ritual resistance gradually and target covert mental rituals and reassurance-seeking, which are easy to miss.</p>' +

      '<h3>7. Integrating cognitive techniques</h3>' +
      '<p>Light cognitive work supports exposure: identify and gently examine catastrophic predictions before exposure, then let the exposure be the test. Avoid turning disputation into a safety behavior (endless reassurance). The strongest belief change comes from experience, not argument.</p>' +

      '<h3>8. Session structure &amp; course</h3>' +
      '<ol>' +
        '<li>Agenda &amp; brief symptom check (e.g., GAD-7, or disorder-specific measure)</li>' +
        '<li>Review homework exposures &amp; consolidate learning</li>' +
        '<li>Set up today&rsquo;s exposure as a prediction test</li>' +
        '<li>Conduct the exposure (in-session), drop safety behaviors</li>' +
        '<li>Process: prediction vs. outcome, &ldquo;what did you learn?&rdquo;</li>' +
        '<li>Assign varied between-session practice</li>' +
      '</ol>' +
      '<p>Typical course: <strong>8&ndash;16 sessions</strong>; specific phobia can respond in far fewer (even a single prolonged session). Sessions are often longer (60&ndash;90 min) to allow adequate in-session exposure.</p>' +

      '<h3>9. Managing distress, dropout, and therapist anxiety</h3>' +
      '<div class="ex-callout ex-tip"><span class="ex-callout-title">Client distress</span>Distress during exposure is expected and therapeutic, not dangerous. Prepare the client, stay warm and confident, and frame willingness to feel anxiety as the skill being built. Do not rescue with reassurance.</div>' +
      '<div class="ex-callout ex-tip"><span class="ex-callout-title">Dropout risk</span>A clear rationale, collaborative pacing, early wins, and strong alliance reduce dropout. Never spring exposures on the client &mdash; predictability of the plan (not of the outcome) builds trust.</div>' +
      '<div class="ex-callout ex-warn"><span class="ex-callout-title">Therapist anxiety about exposure</span>Clinician avoidance is a leading reason exposure is under-delivered or delivered too cautiously. Notice your own urge to soften or cut exposures short; supervision and doing your own exposure ladder help.</div>' +

      '<h3>10. Adaptations</h3>' +
      '<ul>' +
        '<li><strong>Children:</strong> use developmentally appropriate rewards, parental coaching, and playful framing; involve caregivers as exposure coaches (and address family accommodation).</li>' +
        '<li><strong>PTSD:</strong> prolonged exposure uses imaginal exposure to the trauma memory plus in vivo exposure to avoided reminders.</li>' +
        '<li><strong>Panic disorder:</strong> emphasize interoceptive exposure to feared body sensations.</li>' +
        '<li><strong>Specific phobia:</strong> intensive/massed exposure is highly efficient.</li>' +
        '<li><strong>Comorbid depression / low motivation:</strong> pair with behavioral activation and keep early tasks achievable.</li>' +
      '</ul>' +

      '<h3>Key references</h3>' +
      '<ul class="ex-refs">' +
        '<li>Abramowitz, J. S., Deacon, B. J., &amp; Whiteside, S. P. H. (2019). <em>Exposure Therapy for Anxiety</em> (2nd ed.). Guilford Press.</li>' +
        '<li>Craske, M. G., Treanor, M., Conway, C. C., Zbozinek, T., &amp; Vervliet, B. (2014). Maximizing exposure therapy: an inhibitory learning approach. <em>Behaviour Research and Therapy.</em></li>' +
        '<li>Foa, E. B., Yadin, E., &amp; Lichner, T. K. (2012). <em>Exposure and Response (Ritual) Prevention for OCD: Therapist Guide</em> (2nd ed.). Oxford.</li>' +
        '<li>Barlow, D. H., &amp; Craske, M. G. <em>Mastery of Your Anxiety and Panic (MAP)</em> protocols.</li>' +
        '<li>Foa, E. B., Hembree, E. A., &amp; Rothbaum, B. O. (2007). <em>Prolonged Exposure Therapy for PTSD.</em> Oxford.</li>' +
      '</ul>' +
    '</div>';

  // ═══════════════════════════════════════════════════════════════════════
  //  Reusable dynamic table
  // ═══════════════════════════════════════════════════════════════════════
  function buildTable(cols, opts) {
    opts = opts || {};
    var wrap = el('div');
    var table = el('table', { class: 'ex-table' });
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
      } else if (c.type === 'suds') {
        input = el('input', { type: 'number', min: '0', max: '100', step: '5', class: 'ex-num', placeholder: '0-100' });
      } else if (c.type === 'pct') {
        input = el('input', { type: 'number', min: '0', max: '100', step: '5', class: 'ex-num', placeholder: '%' });
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
      var del = el('button', { class: 'ex-row-del', title: 'Remove row', type: 'button' }, '&times;');
      del.onclick = function () { tr.remove(); };
      delTd.appendChild(del);
      tr.appendChild(delTd);
      tbody.appendChild(tr);
      return tr;
    }
    (opts.starter || []).forEach(addRow);
    if (!opts.starter) addRow();

    var addBtn = el('button', { class: 'ex-btn ex-btn-ghost ex-btn-sm', type: 'button' }, '+ Add row');
    addBtn.onclick = function () { addRow(); };
    var actWrap = el('div', { class: 'ex-actions' });
    actWrap.appendChild(addBtn);
    if (opts.sortBtn) {
      var sortBtn = el('button', { class: 'ex-btn ex-btn-ghost ex-btn-sm', type: 'button' }, '↑ Sort by SUDS');
      sortBtn.onclick = function () {
        var rows = Array.prototype.slice.call(tbody.querySelectorAll('tr'));
        rows.sort(function (a, b) {
          function s(tr) { var n = tr.querySelector('[data-key="' + opts.sortBtn + '"]'); var v = n ? parseFloat(n.value) : NaN; return isNaN(v) ? 999 : v; }
          return s(a) - s(b);
        });
        rows.forEach(function (r) { tbody.appendChild(r); });
      };
      actWrap.appendChild(sortBtn);
    }
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

  function sudsLegend() {
    return el('div', { class: 'ex-suds-legend' }, '<span>SUDS 0-100:</span>' +
      '<span class="ex-suds-band ex-suds-low">0-30 mild</span>' +
      '<span class="ex-suds-band ex-suds-mod">40-60 moderate</span>' +
      '<span class="ex-suds-band ex-suds-high">70-100 severe</span>');
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  ASSESS tab — functional analysis
  // ═══════════════════════════════════════════════════════════════════════
  function buildAssess() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'ex-ws-intro' },
      'Functional assessment worksheet. Map feared situations, the specific feared outcomes, avoidance, and safety behaviors <em>before</em> designing exposures. Naming safety behaviors explicitly is essential &mdash; they are what you will later ask the client to drop.'));

    var f1 = el('div', { class: 'ex-card' });
    f1.innerHTML = '<h4>Feared situations &amp; predictions</h4>';
    var t1 = buildTable([
      { key: 'situation', label: 'Feared situation / stimulus / thought', type: 'text', ph: 'What triggers the anxiety?' },
      { key: 'prediction', label: 'Feared outcome (specific prediction)', type: 'text', ph: 'What does the client fear will happen?' },
      { key: 'suds', label: 'SUDS 0-100', type: 'suds', width: '90px' }
    ]);
    f1.appendChild(sudsLegend());
    f1.appendChild(t1);
    panel.appendChild(f1);

    var f2 = el('div', { class: 'ex-card' });
    f2.innerHTML = '<h4>Avoidance &amp; safety behaviors</h4>';
    var t2 = buildTable([
      { key: 'avoid', label: 'What the client avoids (overt or covert)', type: 'text', ph: 'e.g. crowds, eye contact, dirty surfaces' },
      { key: 'safety', label: 'Safety behavior / crutch used', type: 'text', ph: 'e.g. carries meds, over-checks, distraction, reassurance' }
    ]);
    f2.appendChild(t2);
    panel.appendChild(f2);

    var f3 = el('div', { class: 'ex-card' });
    f3.innerHTML = '<h4>Feared body sensations <span style="font-weight:400;color:#7a7364;font-size:12px;">(for panic / health anxiety &rarr; interoceptive exposure)</span></h4>';
    var t3 = buildTable([
      { key: 'sensation', label: 'Feared sensation', type: 'text', ph: 'e.g. racing heart, dizziness, breathlessness' },
      { key: 'induce', label: 'How it could be induced', type: 'text', ph: 'e.g. jog in place, spin, straw-breathe' },
      { key: 'suds', label: 'SUDS 0-100', type: 'suds', width: '90px' }
    ]);
    f3.appendChild(t3);
    panel.appendChild(f3);

    var actions = el('div', { class: 'ex-actions' });
    var copy = el('button', { class: 'ex-btn', type: 'button' }, 'Copy assessment');
    copy.onclick = function () {
      var lines = ['EXPOSURE — FUNCTIONAL ASSESSMENT', 'Date: ' + dateStamp(), '', 'FEARED SITUATIONS & PREDICTIONS'];
      t1._readRows().forEach(function (r) { lines.push('  • ' + (r.situation || '-') + ' → predicts: ' + (r.prediction || '-') + ' [SUDS ' + (r.suds || '-') + ']'); });
      lines.push('', 'AVOIDANCE & SAFETY BEHAVIORS');
      t2._readRows().forEach(function (r) { lines.push('  • avoids: ' + (r.avoid || '-') + '  | safety: ' + (r.safety || '-')); });
      var s3 = t3._readRows();
      if (s3.length) { lines.push('', 'FEARED BODY SENSATIONS (interoceptive targets)'); s3.forEach(function (r) { lines.push('  • ' + (r.sensation || '-') + ' → induce via ' + (r.induce || '-') + ' [SUDS ' + (r.suds || '-') + ']'); }); }
      copyBtn(lines.join('\n'), copy);
    };
    actions.appendChild(copy);
    panel.appendChild(actions);
    return panel;
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  HIERARCHY tab — SUDS exposure ladder
  // ═══════════════════════════════════════════════════════════════════════
  function buildHierarchy() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'ex-ws-intro' },
      'Build the exposure hierarchy (a menu of tasks). Rate each item&rsquo;s anticipated distress with SUDS (0&ndash;100) and note the safety behaviors to drop. Remember: with the inhibitory-learning model you can vary the order rather than march strictly bottom-up.'));
    var card = el('div', { class: 'ex-card' });
    card.appendChild(el('h4', null, 'Exposure hierarchy'));
    card.appendChild(sudsLegend());
    var t = buildTable([
      { key: 'item', label: 'Exposure task', type: 'text', ph: 'Specific, do-able step' },
      { key: 'type', label: 'Type', type: 'select', opts: ['In vivo', 'Imaginal', 'Interoceptive', 'VR'], width: '110px' },
      { key: 'suds', label: 'SUDS 0-100', type: 'suds', width: '90px' },
      { key: 'safety', label: 'Safety behavior to drop', type: 'text' }
    ], { sortBtn: 'suds' });
    card.appendChild(t);
    panel.appendChild(card);

    var readout = el('div', { class: 'ex-readout' });
    panel.appendChild(readout);
    function refresh() {
      var rows = t._readRows();
      var suds = rows.map(function (r) { return parseFloat(r.suds); }).filter(function (n) { return !isNaN(n); });
      readout.innerHTML = '<span class="ex-stat"><b>' + rows.length + '</b>hierarchy items</span>' +
        '<span class="ex-stat"><b>' + (suds.length ? Math.min.apply(null, suds) : '—') + '</b>lowest SUDS (start here)</span>' +
        '<span class="ex-stat"><b>' + (suds.length ? Math.max.apply(null, suds) : '—') + '</b>highest SUDS</span>';
    }
    panel.addEventListener('input', refresh);
    panel.addEventListener('click', function (e) { if (e.target.classList.contains('ex-row-del') || /Add row|Sort by SUDS/.test(e.target.textContent)) setTimeout(refresh, 0); });
    refresh();

    var actions = el('div', { class: 'ex-actions' });
    var copy = el('button', { class: 'ex-btn', type: 'button' }, 'Copy hierarchy');
    copy.onclick = function () {
      var rows = t._readRows().slice().sort(function (a, b) { return (parseFloat(a.suds) || 999) - (parseFloat(b.suds) || 999); });
      var lines = ['EXPOSURE HIERARCHY', 'Date: ' + dateStamp(), ''];
      rows.forEach(function (r) { lines.push('  [SUDS ' + (r.suds || '-') + '] ' + (r.item || '-') + ' (' + (r.type || '') + ')' + (r.safety ? '  — drop: ' + r.safety : '')); });
      copyBtn(lines.join('\n'), copy);
    };
    actions.appendChild(copy);
    panel.appendChild(actions);
    return panel;
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  EXPOSURE LOG tab — expectancy / inhibitory-learning record
  // ═══════════════════════════════════════════════════════════════════════
  function buildExposureLog() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'ex-ws-intro' },
      'The core inhibitory-learning worksheet &mdash; set up every exposure as a test of a prediction. Record the <strong>prediction</strong> and its expected likelihood <em>before</em>, then the <strong>actual outcome</strong> and <strong>what was learned</strong> after. The gap between predicted and actual is the therapeutic mechanism (expectancy violation). SUDS is tracked as data, not as the goal.'));
    var card = el('div', { class: 'ex-card' });
    card.appendChild(el('h4', null, 'Exposure practice record'));
    var t = buildTable([
      { key: 'date', label: 'Date', type: 'date', width: '130px' },
      { key: 'task', label: 'Exposure task', type: 'text', ph: 'What did you do?' },
      { key: 'prediction', label: 'Prediction (what you feared)', type: 'textarea' },
      { key: 'likelihood', label: 'Expected likelihood %', type: 'pct', width: '80px' },
      { key: 'peak', label: 'Peak SUDS', type: 'suds', width: '80px' },
      { key: 'outcome', label: 'What actually happened', type: 'textarea' },
      { key: 'learned', label: 'What I learned', type: 'textarea' }
    ]);
    card.appendChild(t);
    panel.appendChild(card);
    panel.appendChild(el('div', { class: 'ex-callout ex-tip' },
      '<span class="ex-callout-title">Coaching the debrief</span>After each exposure ask: &ldquo;What did you expect? What actually happened? What does that tell you?&rdquo; Reinforce the new learning in the client&rsquo;s own words &mdash; this is what you want them to recall when fear returns.'));

    var actions = el('div', { class: 'ex-actions' });
    var copy = el('button', { class: 'ex-btn', type: 'button' }, 'Copy exposure record');
    copy.onclick = function () {
      var rows = t._readRows();
      var lines = ['EXPOSURE PRACTICE RECORD (inhibitory learning)', 'Date: ' + dateStamp(), ''];
      rows.forEach(function (r) {
        lines.push((r.date || '') + ' — ' + (r.task || '(task)'));
        lines.push('   Prediction: ' + (r.prediction || '-') + ' (expected likelihood ' + (r.likelihood || '-') + '%)');
        lines.push('   Peak SUDS: ' + (r.peak || '-'));
        lines.push('   Actual outcome: ' + (r.outcome || '-'));
        lines.push('   Learned: ' + (r.learned || '-'));
        lines.push('');
      });
      copyBtn(lines.join('\n'), copy);
    };
    actions.appendChild(copy);
    panel.appendChild(actions);
    return panel;
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  ERP tab — OCD mapping + response prevention
  // ═══════════════════════════════════════════════════════════════════════
  function buildERP() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'ex-ws-intro' },
      'ERP mapping worksheet for OCD. For each trigger, record the obsession and feared outcome, the compulsion to be resisted, and an explicit <strong>response-prevention plan</strong>. Response prevention is the active ingredient &mdash; don&rsquo;t forget covert mental rituals and reassurance-seeking.'));
    var card = el('div', { class: 'ex-card' });
    card.appendChild(el('h4', null, 'Trigger → Obsession → Compulsion → Response prevention'));
    card.appendChild(sudsLegend());
    var t = buildTable([
      { key: 'trigger', label: 'Trigger', type: 'text', ph: 'situation / thought' },
      { key: 'obsession', label: 'Obsession & feared outcome', type: 'textarea' },
      { key: 'compulsion', label: 'Compulsion (incl. mental rituals)', type: 'textarea' },
      { key: 'rp', label: 'Response-prevention plan', type: 'textarea' },
      { key: 'suds', label: 'SUDS 0-100', type: 'suds', width: '80px' }
    ]);
    card.appendChild(t);
    panel.appendChild(card);
    panel.appendChild(el('div', { class: 'ex-callout ex-warn' },
      '<span class="ex-callout-title">Watch for hidden compulsions</span>Reassurance-seeking, mental reviewing/neutralizing, praying to undo, and family accommodation all function as compulsions. If they aren&rsquo;t prevented, ERP stalls.'));

    var actions = el('div', { class: 'ex-actions' });
    var copy = el('button', { class: 'ex-btn', type: 'button' }, 'Copy ERP plan');
    copy.onclick = function () {
      var rows = t._readRows();
      var lines = ['ERP PLAN (OCD)', 'Date: ' + dateStamp(), ''];
      rows.forEach(function (r) {
        lines.push('Trigger: ' + (r.trigger || '-') + '  [SUDS ' + (r.suds || '-') + ']');
        lines.push('   Obsession/feared outcome: ' + (r.obsession || '-'));
        lines.push('   Compulsion to resist: ' + (r.compulsion || '-'));
        lines.push('   Response prevention: ' + (r.rp || '-'));
        lines.push('');
      });
      copyBtn(lines.join('\n'), copy);
    };
    actions.appendChild(copy);
    panel.appendChild(actions);
    return panel;
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  OUTCOMES tab — SMART + GAS + severity tracker
  // ═══════════════════════════════════════════════════════════════════════
  function buildOutcomes() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'ex-ws-intro' },
      'Set functional goals and track symptom change. Draft a <strong>SMART</strong> goal, scale it with <strong>Goal Attainment Scaling</strong>, and log a repeated severity measure (e.g., GAD-7 total, 0&ndash;21) across sessions.'));

    // SMART
    var smart = el('div', { class: 'ex-card' });
    smart.appendChild(el('h4', null, 'SMART goal builder'));
    var fields = [
      ['specific', 'Specific', 'What exposure/approach behavior will the client do?', 'e.g. Ride the bus alone'],
      ['measurable', 'Measurable', 'How will you know?', 'e.g. 3 stops, no safety behaviors'],
      ['achievable', 'Achievable', 'Realistic now? Grade if needed.', 'e.g. start with 1 stop'],
      ['relevant', 'Relevant', 'Which value/goal does it serve?', 'e.g. independence, get to work'],
      ['timebound', 'Time-bound', 'By when / how often?', 'e.g. 4x/week for 2 weeks']
    ];
    fields.forEach(function (f) {
      var d = el('div', { class: 'ex-field' });
      d.innerHTML = '<label>' + f[1] + ' <span class="ex-hint">' + f[2] + '</span></label>';
      d.appendChild(el('input', { type: 'text', 'data-smart': f[0], placeholder: f[3] }));
      smart.appendChild(d);
    });
    var preview = el('div', { class: 'ex-preview' });
    smart.appendChild(preview);
    smart.addEventListener('input', function () {
      var g = {};
      smart.querySelectorAll('[data-smart]').forEach(function (i) { g[i.getAttribute('data-smart')] = i.value.trim(); });
      if (!g.specific && !g.measurable) { preview.innerHTML = ''; return; }
      preview.innerHTML = '<strong>Goal:</strong> ' + esc(g.specific || '…') +
        (g.measurable ? ' — ' + esc(g.measurable) : '') +
        (g.timebound ? ', ' + esc(g.timebound) : '') +
        (g.relevant ? '. <em>Value: ' + esc(g.relevant) + '.</em>' : '.') +
        (g.achievable ? ' <span class="ex-hint">(' + esc(g.achievable) + ')</span>' : '');
    });
    panel.appendChild(smart);

    // GAS
    var gas = el('div', { class: 'ex-card' });
    gas.appendChild(el('h4', null, 'Goal Attainment Scaling (GAS)'));
    var gnf = el('div', { class: 'ex-field' });
    gnf.innerHTML = '<label>Goal name</label>';
    gnf.appendChild(el('input', { type: 'text', 'data-gas': 'name', placeholder: 'e.g. Travel independently' }));
    gas.appendChild(gnf);
    var levels = [
      ['-2', 'Much less than expected', 'ex-gas--2'],
      ['-1', 'Somewhat less than expected', 'ex-gas--1'],
      ['0', 'Expected outcome', 'ex-gas-0'],
      ['+1', 'Somewhat more than expected', 'ex-gas-1'],
      ['+2', 'Much more than expected', 'ex-gas-2']
    ];
    levels.forEach(function (lv) {
      var row = el('div', { class: 'ex-gas-level' });
      row.appendChild(el('span', { class: 'ex-gas-tag ' + lv[2] }, lv[0] + '<br>' + lv[1]));
      var inp = el('input', { type: 'text', 'data-gas-level': lv[0], placeholder: 'Describe this outcome level' });
      inp.style.cssText = 'width:100%;box-sizing:border-box;padding:8px 10px;border:1px solid var(--border);border-radius:6px;background:#fdfcf9;';
      row.appendChild(inp);
      gas.appendChild(row);
    });
    var curField = el('div', { class: 'ex-field' });
    curField.innerHTML = '<label>Current attainment level</label>';
    var curSel = el('select', { 'data-gas': 'current' });
    ['-2', '-1', '0', '+1', '+2'].forEach(function (v) { curSel.appendChild(el('option', { value: v }, v)); });
    curSel.value = '-2';
    curField.appendChild(curSel);
    gas.appendChild(curField);
    var tOut = el('div', { class: 'ex-readout' });
    gas.appendChild(tOut);
    function updateT() {
      var x = parseInt(curSel.value, 10);
      var rho = 0.3;
      var T = 50 + (10 * x) / Math.sqrt((1 - rho) + rho);
      tOut.innerHTML = '<span class="ex-stat"><b>' + Math.round(T) + '</b>GAS T-score</span>' +
        '<span class="ex-stat"><b>' + curSel.value + '</b>current level</span>' +
        '<span class="ex-stat" style="font-size:12px;color:#7a7364;">T=50 is the expected outcome; &gt;50 exceeds expectation.</span>';
    }
    curSel.addEventListener('change', updateT);
    updateT();
    panel.appendChild(gas);

    // Severity tracker
    var scard = el('div', { class: 'ex-card' });
    scard.appendChild(el('h4', null, 'Symptom severity tracker'));
    scard.appendChild(el('p', { class: 'ex-ws-intro' },
      'Enter a repeated measure (e.g., GAD-7 0&ndash;21, or disorder-specific total) per session. Change from baseline is shown automatically.'));
    var st = buildTable([
      { key: 'date', label: 'Session date', type: 'date', width: '150px' },
      { key: 'measure', label: 'Measure', type: 'text', ph: 'e.g. GAD-7', width: '110px' },
      { key: 'score', label: 'Total score', type: 'pct', width: '100px' },
      { key: 'note', label: 'Note', type: 'text', ph: 'optional' }
    ]);
    scard.appendChild(st);
    var trend = el('ul', { class: 'ex-progress-list' });
    scard.appendChild(trend);
    function refreshTrend() {
      var rows = st._readRows().filter(function (r) { return r.score !== '' && !isNaN(parseFloat(r.score)); });
      trend.innerHTML = '';
      if (!rows.length) return;
      var base = parseFloat(rows[0].score);
      rows.forEach(function (r, i) {
        var v = parseFloat(r.score); var d = v - base;
        var deltaHtml = i === 0 ? '<span class="ex-hint">baseline</span>' :
          (d <= 0 ? '<span class="ex-delta-up">' + d + ' from baseline</span>' : '<span class="ex-delta-down">+' + d + ' from baseline</span>');
        var li = el('li');
        li.innerHTML = '<span>' + esc(r.date || ('Session ' + (i + 1))) + ' — ' + esc(r.measure || '') + ' ' + v + '</span>' + deltaHtml;
        trend.appendChild(li);
      });
    }
    scard.addEventListener('input', refreshTrend);
    scard.addEventListener('click', function (e) { if (/Add row/.test(e.target.textContent) || e.target.classList.contains('ex-row-del')) setTimeout(refreshTrend, 0); });
    panel.appendChild(scard);

    var actions = el('div', { class: 'ex-actions' });
    var copy = el('button', { class: 'ex-btn', type: 'button' }, 'Copy goals + outcomes');
    copy.onclick = function () {
      var g = {};
      smart.querySelectorAll('[data-smart]').forEach(function (i) { g[i.getAttribute('data-smart')] = i.value.trim(); });
      var lines = ['EXPOSURE — GOALS & OUTCOMES', 'Date: ' + dateStamp(), '', 'SMART GOAL'];
      lines.push('  Specific: ' + (g.specific || '-'));
      lines.push('  Measurable: ' + (g.measurable || '-'));
      lines.push('  Achievable: ' + (g.achievable || '-'));
      lines.push('  Relevant: ' + (g.relevant || '-'));
      lines.push('  Time-bound: ' + (g.timebound || '-'));
      lines.push('', 'GOAL ATTAINMENT SCALING — ' + (val('[data-gas="name"]', gas) || '(goal)'));
      levels.forEach(function (lv) { lines.push('  ' + lv[0] + ' (' + lv[1] + '): ' + (val('[data-gas-level="' + lv[0] + '"]', gas) || '-')); });
      lines.push('  Current level: ' + curSel.value);
      var rows = st._readRows().filter(function (r) { return r.score; });
      if (rows.length) {
        lines.push('', 'SEVERITY TREND');
        var base = parseFloat(rows[0].score);
        rows.forEach(function (r, i) {
          var d = parseFloat(r.score) - base;
          lines.push('  ' + (r.date || ('Session ' + (i + 1))) + ': ' + (r.measure || '') + ' ' + r.score + (i === 0 ? ' (baseline)' : ' (' + (d <= 0 ? '' : '+') + d + ')') + (r.note ? ' — ' + r.note : ''));
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
    { id: 'hierarchy', label: 'Hierarchy', build: buildHierarchy },
    { id: 'log', label: 'Exposure Log', build: buildExposureLog },
    { id: 'erp', label: 'ERP (OCD)', build: buildERP },
    { id: 'outcomes', label: 'Goals & Outcomes', build: buildOutcomes }
  ];

  var meta = el('div', { class: 'ex-meta' });
  meta.innerHTML =
    '<span class="ex-chip ex-chip-accent">Module 4 of 7</span>' +
    '<span class="ex-chip">Exposure &amp; ERP</span>' +
    '<span class="ex-chip">Anxiety / OCD</span>' +
    '<span class="ex-chip">Inhibitory-learning model</span>' +
    '<span class="ex-chip">Trainee / advanced student</span>' +
    '<span class="ex-chip">~4&ndash;6 contact hours</span>';
  root.appendChild(meta);

  var tabBar = el('div', { class: 'ex-tabs' });
  var panels = el('div');
  TABS.forEach(function (t, i) {
    var btn = el('button', { class: 'ex-tab' + (i === 0 ? ' ex-active' : ''), type: 'button' }, t.label);
    var panel = el('div', { class: 'ex-panel' + (i === 0 ? ' ex-active' : '') });
    var built = false;
    function activate() {
      tabBar.querySelectorAll('.ex-tab').forEach(function (b) { b.classList.remove('ex-active'); });
      panels.querySelectorAll('.ex-panel').forEach(function (p) { p.classList.remove('ex-active'); });
      btn.classList.add('ex-active');
      panel.classList.add('ex-active');
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
    if (idx > -1) tabBar.querySelectorAll('.ex-tab')[idx].click();
  }
})();

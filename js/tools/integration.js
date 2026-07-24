/* ═══════════════════════════════════════════════════════════════════════
   integration.js — Course module 7
   "Integration, Advanced Topics & Implementation: A How-To"
   Audience: trainees & advanced students.  Builds into #int-root.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var root = document.getElementById('int-root');
  if (!root || root.dataset.intBuilt) return;
  root.dataset.intBuilt = '1';

  var U = window.ToolUtils || {};
  function dateStamp() { return (U.dateStamp ? U.dateStamp() : new Date().toLocaleDateString()); }
  function copyBtn(t, b) { if (U.copyWithButton) U.copyWithButton(t, b); }
  function el(tag, attrs, html) { var e = document.createElement(tag); if (attrs) Object.keys(attrs).forEach(function (k) { if (k === 'class') e.className = attrs[k]; else if (k === 'html') e.innerHTML = attrs[k]; else e.setAttribute(k, attrs[k]); }); if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function val(sel, ctx) { var n = (ctx || root).querySelector(sel); return n ? n.value.trim() : ''; }

  function buildTable(cols, opts) {
    opts = opts || {}; var wrap = el('div'); var table = el('table', { class: 'int-table' });
    var thead = el('thead'), htr = el('tr');
    cols.forEach(function (c) { htr.appendChild(el('th', c.width ? { style: 'width:' + c.width } : null, esc(c.label))); });
    htr.appendChild(el('th', { style: 'width:34px' }, '')); thead.appendChild(htr); table.appendChild(thead);
    var tbody = el('tbody'); table.appendChild(tbody); wrap.appendChild(table);
    function cell(c) { var td = el('td'), input; if (c.type === 'select') { input = el('select'); (c.opts || []).forEach(function (o) { input.appendChild(el('option', { value: o }, esc(o))); }); } else if (c.type === 'textarea') input = el('textarea', { placeholder: c.ph || '' }); else if (c.type === 'num') input = el('input', { type: 'number', min: '0', max: '100', class: 'int-num', placeholder: c.ph || '' }); else if (c.type === 'date') input = el('input', { type: 'date' }); else input = el('input', { type: 'text', placeholder: c.ph || '' }); input.setAttribute('data-key', c.key); td.appendChild(input); return td; }
    function addRow(data) { var tr = el('tr'); cols.forEach(function (c) { var td = cell(c); if (data && data[c.key] != null) td.querySelector('[data-key]').value = data[c.key]; tr.appendChild(td); }); var delTd = el('td'); var del = el('button', { class: 'int-row-del', type: 'button', title: 'Remove' }, '&times;'); del.onclick = function () { tr.remove(); }; delTd.appendChild(del); tr.appendChild(delTd); tbody.appendChild(tr); return tr; }
    (opts.starter || []).forEach(addRow); if (!opts.starter) addRow();
    var addBtn = el('button', { class: 'int-btn int-btn-ghost int-btn-sm', type: 'button' }, '+ Add row'); addBtn.onclick = function () { addRow(); };
    wrap.appendChild(el('div', { class: 'int-actions' })).appendChild(addBtn);
    wrap._readRows = function () { return Array.prototype.map.call(tbody.querySelectorAll('tr'), function (tr) { var o = {}; tr.querySelectorAll('[data-key]').forEach(function (i) { o[i.getAttribute('data-key')] = i.value.trim(); }); return o; }).filter(function (o) { return Object.keys(o).some(function (k) { return o[k]; }); }); };
    return wrap;
  }

  var LEARN_HTML =
    '<div class="int-learn">' +
      '<p class="int-lead">The final module ties the course together: how to sequence and combine therapies for real, comorbid presentations; how to integrate psychotherapy with medication; how to sustain fidelity and look after yourself; and how to implement these treatments in modern service contexts (telehealth, stepped care). It closes with a personal action plan.</p>' +

      '<h3>1. Transdiagnostic formulation &amp; sequencing</h3>' +
      '<p>Real clients rarely fit one protocol. Build a single formulation that identifies shared <strong>maintaining mechanisms</strong> across problems (avoidance, unhelpful appraisals, low reinforcement, arousal) and lets you pick a parsimonious set of interventions. Then <strong>sequence</strong> deliberately: stabilize risk and function first, treat the most impairing or foundational problem next, and watch for shared mechanisms so one intervention benefits several problems.</p>' +

      '<h3>2. Combining therapy with pharmacotherapy</h3>' +
      '<p>Behavioral therapies and medication are usually complementary. Clarify each treatment&rsquo;s <strong>role</strong> (e.g., medication to lift energy/arousal enough to engage; therapy to build durable skills and reduce relapse), coordinate with the prescriber, support shared decision-making, and align messaging so treatments are seen as working together. Track both symptom scores and functional change.</p>' +

      '<h3>3. Comorbidity &amp; complex presentations</h3>' +
      '<p>With comorbidity, prioritize by risk, impairment, and client preference; use the formulation to find leverage points; and keep the plan feasible. Avoid protocol overload — deliver fewer techniques well.</p>' +

      '<h3>4. Supervision, fidelity &amp; self-care</h3>' +
      '<ul>' +
        '<li><strong>Fidelity / treatment integrity:</strong> use adherence and competence checklists, session recording/review, and outcome data to keep delivery on-model.</li>' +
        '<li><strong>Supervision:</strong> case consultation, live/recorded review, and deliberate practice of specific skills.</li>' +
        '<li><strong>Self-care:</strong> manage caseload, monitor burnout, and use peer support — sustainable practice protects both clinician and client.</li>' +
      '</ul>' +

      '<h3>5. Digital tools, telehealth &amp; stepped care</h3>' +
      '<ul>' +
        '<li><strong>Telehealth:</strong> adapt exposures, worksheets, and safety planning to remote delivery; confirm privacy, consent, and local emergency resources.</li>' +
        '<li><strong>Digital tools:</strong> apps and internet-CBT can extend reach and support homework; choose evidence-informed tools and integrate them into the plan.</li>' +
        '<li><strong>Stepped care:</strong> match intensity to need — low-intensity/guided self-help first for milder presentations, stepping up to high-intensity therapy when needed.</li>' +
      '</ul>' +

      '<h3>6. Measuring &amp; reporting outcomes</h3>' +
      '<p>Use routine outcome monitoring for clinical feedback and, where relevant, service/research reporting: standardized symptom measures, individualized Goal Attainment Scaling, and functional indicators. Feed the data back into the formulation and the plan.</p>' +

      '<h3>7. Course wrap-up</h3>' +
      '<p>Consolidate learning with a case presentation and a concrete <strong>action plan</strong>: which techniques you will practice, which measures you will adopt, what supervision you will seek, and your next implementation steps. The Capstone tab structures this. (Course assessment: a written case formulation plus a live or recorded demonstration of two techniques from different modules.)</p>' +

      '<h3>Key references</h3>' +
      '<ul class="int-refs">' +
        '<li>Guideline documents from NICE, APA, NIMH, CDC, and the SAMHSA Evidence-Based Practices Resource Center.</li>' +
        '<li>Persons, J. B. (2008). <em>The Case Formulation Approach to Cognitive-Behavior Therapy.</em> Guilford Press.</li>' +
        '<li>Bower, P., &amp; Gilbody, S. Stepped care for common mental disorders (reviews).</li>' +
        '<li>Routine outcome monitoring / measurement-based care literature (e.g., Lambert).</li>' +
      '</ul>' +
    '</div>';

  // FORMULATION & SEQUENCING
  function buildSequencing() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'int-ws-intro' }, 'Assemble a transdiagnostic plan: list problems, name shared maintaining mechanisms, then set a treatment sequence.'));
    var pl = el('div', { class: 'int-card' }); pl.innerHTML = '<h4>Problem list &amp; shared mechanisms</h4>';
    var t = buildTable([
      { key: 'problem', label: 'Problem / diagnosis', type: 'text' },
      { key: 'impair', label: 'Impairment 0-100', type: 'num', width: '90px' },
      { key: 'mechanism', label: 'Maintaining mechanism', type: 'text', ph: 'avoidance, appraisal, arousal…' }
    ]);
    pl.appendChild(t); panel.appendChild(pl);
    var seq = el('div', { class: 'int-card' }); seq.innerHTML = '<h4>Sequencing plan</h4>';
    [['first', 'Treat first (risk / stabilization / foundational)', ''],
     ['next', 'Then', ''],
     ['later', 'Later', ''],
     ['shared', 'Shared mechanism to target across problems', 'one intervention that helps several problems']].forEach(function (x) { var d = el('div', { class: 'int-field' }); d.innerHTML = '<label>' + x[1] + (x[2] ? ' <span class="int-hint">' + x[2] + '</span>' : '') + '</label>'; d.appendChild(el('textarea', { 'data-seq': x[0] })); seq.appendChild(d); });
    panel.appendChild(seq);
    var actions = el('div', { class: 'int-actions' }); var copy = el('button', { class: 'int-btn', type: 'button' }, 'Copy formulation & sequence');
    copy.onclick = function () {
      var lines = ['TRANSDIAGNOSTIC FORMULATION & SEQUENCING', 'Date: ' + dateStamp(), '', 'PROBLEM LIST'];
      t._readRows().forEach(function (r) { lines.push('  • ' + (r.problem || '-') + ' [impairment ' + (r.impair || '-') + '] mechanism: ' + (r.mechanism || '-')); });
      lines.push('', 'SEQUENCE'); [['first', 'Treat first'], ['next', 'Then'], ['later', 'Later'], ['shared', 'Shared mechanism']].forEach(function (x) { lines.push('  ' + x[1] + ': ' + (val('[data-seq="' + x[0] + '"]', seq) || '-')); });
      copyBtn(lines.join('\n'), copy);
    };
    actions.appendChild(copy); panel.appendChild(actions); return panel;
  }

  // THERAPY + MEDICATION
  function buildMeds() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'int-ws-intro' }, 'Plan how psychotherapy and medication work together for this client. Define each treatment&rsquo;s role, coordination, and shared monitoring.'));
    var card = el('div', { class: 'int-card' }); card.innerHTML = '<h4>Therapy + medication integration</h4>';
    [['targets', 'Target symptoms / problems', ''],
     ['medrole', 'Medication role', 'e.g. raise energy/arousal to enable engagement; reduce acute symptoms'],
     ['therole', 'Therapy role', 'e.g. build durable skills, reduce avoidance, prevent relapse'],
     ['coordination', 'Coordination with prescriber', 'who does what; how you’ll communicate'],
     ['messaging', 'Shared message to client', 'framing the two as complementary'],
     ['monitoring', 'Shared monitoring', 'measures & cadence (symptoms + function)']].forEach(function (x) { var d = el('div', { class: 'int-field' }); d.innerHTML = '<label>' + x[1] + (x[2] ? ' <span class="int-hint">' + x[2] + '</span>' : '') + '</label>'; d.appendChild(el('textarea', { 'data-med': x[0] })); card.appendChild(d); });
    panel.appendChild(card);
    panel.appendChild(el('div', { class: 'int-callout int-tip' }, '<span class="int-callout-title">Not legal/medical advice</span>This planner supports coordination; prescribing decisions rest with the treating clinician and the client.'));
    var actions = el('div', { class: 'int-actions' }); var copy = el('button', { class: 'int-btn', type: 'button' }, 'Copy integration plan');
    copy.onclick = function () { var lines = ['THERAPY + MEDICATION INTEGRATION', 'Date: ' + dateStamp(), '']; [['targets', 'Targets'], ['medrole', 'Medication role'], ['therole', 'Therapy role'], ['coordination', 'Coordination'], ['messaging', 'Client message'], ['monitoring', 'Monitoring']].forEach(function (x) { lines.push('  ' + x[1] + ': ' + (val('[data-med="' + x[0] + '"]', card) || '-')); }); copyBtn(lines.join('\n'), copy); };
    actions.appendChild(copy); panel.appendChild(actions); return panel;
  }

  // FIDELITY & SUPERVISION
  function buildFidelity() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'int-ws-intro' }, 'Keep delivery on-model and sustainable. Build a treatment-integrity checklist for a chosen protocol, plan supervision, and check your own self-care.'));
    var ti = el('div', { class: 'int-card' }); ti.innerHTML = '<h4>Treatment-integrity checklist</h4>';
    ti.appendChild(el('p', { class: 'int-ws-intro' }, 'List the core components of the protocol you are delivering, then check those actually delivered this session. Adherence % updates live.'));
    var t = buildTable([{ key: 'component', label: 'Core component', type: 'text', ph: 'e.g. reviewed exposure homework' }], { starter: [{ component: 'Set collaborative agenda' }, { component: 'Reviewed homework' }, { component: 'Delivered core technique' }, { component: 'Assigned new homework' }, { component: 'Elicited feedback' }] });
    ti.appendChild(t);
    var out = el('div', { class: 'int-readout' }); ti.appendChild(out);
    // checkbox column added dynamically alongside table rows is complex; use a simple parallel checklist derived from rows
    var checkWrap = el('div'); ti.appendChild(checkWrap);
    var rebuild = el('button', { class: 'int-btn int-btn-ghost int-btn-sm', type: 'button' }, 'Build checklist from components ↑');
    ti.appendChild(el('div', { class: 'int-actions' })).appendChild(rebuild);
    function buildChecks() {
      var comps = t._readRows().map(function (r) { return r.component; }).filter(Boolean);
      checkWrap.innerHTML = '<h4 style="color:var(--accent2);font-size:14px;margin:14px 0 6px;">Delivered this session?</h4>';
      comps.forEach(function (c, i) { var l = el('label', { class: 'int-check' }); l.innerHTML = '<input type="checkbox" data-ti="' + i + '"> <span>' + esc(c) + '</span>'; checkWrap.appendChild(l); });
      checkWrap._comps = comps; refresh();
    }
    function refresh() { var boxes = checkWrap.querySelectorAll('[data-ti]'), done = checkWrap.querySelectorAll('[data-ti]:checked').length; out.innerHTML = boxes.length ? '<span class="int-stat"><b>' + done + '/' + boxes.length + '</b>components</span><span class="int-stat"><b>' + Math.round(done / boxes.length * 100) + '%</b>adherence</span>' : '<span class="int-stat" style="color:#7a7364;">Build the checklist to score adherence.</span>'; }
    rebuild.onclick = buildChecks; checkWrap.addEventListener('change', refresh); buildChecks();
    panel.appendChild(ti);
    var sup = el('div', { class: 'int-card' }); sup.innerHTML = '<h4>Supervision &amp; self-care plan</h4>';
    [['supervision', 'Supervision plan', 'consultation, recording review, deliberate practice'],
     ['skills', 'Specific skills to practice', ''],
     ['selfcare', 'Self-care & burnout monitoring', 'caseload, peer support, boundaries']].forEach(function (x) { var d = el('div', { class: 'int-field' }); d.innerHTML = '<label>' + x[1] + (x[2] ? ' <span class="int-hint">' + x[2] + '</span>' : '') + '</label>'; d.appendChild(el('textarea', { 'data-sup': x[0] })); sup.appendChild(d); });
    panel.appendChild(sup);
    var actions = el('div', { class: 'int-actions' }); var copy = el('button', { class: 'int-btn', type: 'button' }, 'Copy fidelity & supervision');
    copy.onclick = function () {
      var lines = ['FIDELITY & SUPERVISION', 'Date: ' + dateStamp(), '', 'TREATMENT-INTEGRITY CHECKLIST'];
      var comps = checkWrap._comps || []; comps.forEach(function (c, i) { var box = checkWrap.querySelector('[data-ti="' + i + '"]'); lines.push('  [' + (box && box.checked ? 'x' : ' ') + '] ' + c); });
      if (comps.length) { var done = checkWrap.querySelectorAll('[data-ti]:checked').length; lines.push('  Adherence: ' + done + '/' + comps.length + ' (' + Math.round(done / comps.length * 100) + '%)'); }
      lines.push('', 'SUPERVISION & SELF-CARE'); [['supervision', 'Supervision'], ['skills', 'Skills to practice'], ['selfcare', 'Self-care']].forEach(function (x) { lines.push('  ' + x[1] + ': ' + (val('[data-sup="' + x[0] + '"]', sup) || '-')); });
      copyBtn(lines.join('\n'), copy);
    };
    actions.appendChild(copy); panel.appendChild(actions); return panel;
  }

  // STEPPED CARE & TELEHEALTH
  function buildImplementation() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'int-ws-intro' }, 'Plan delivery in your service context: match intensity to need and adapt for remote/digital delivery.'));
    var sc = el('div', { class: 'int-card' }); sc.innerHTML = '<h4>Stepped-care match</h4>';
    var d = el('div', { class: 'int-field' }); d.innerHTML = '<label>Presentation severity / complexity</label>'; var sel = el('select', { 'data-imp': 'severity' }); ['Mild / subclinical', 'Moderate', 'Severe / complex'].forEach(function (o) { sel.appendChild(el('option', { value: o }, o)); }); d.appendChild(sel); sc.appendChild(d);
    var d2 = el('div', { class: 'int-field' }); d2.innerHTML = '<label>Matched step <span class="int-hint">guided self-help → low-intensity → high-intensity → specialist</span></label>'; d2.appendChild(el('input', { type: 'text', 'data-imp': 'step', placeholder: 'e.g. guided iCBT with brief check-ins' })); sc.appendChild(d2);
    var d3 = el('div', { class: 'int-field' }); d3.innerHTML = '<label>Step-up / step-down criteria</label>'; d3.appendChild(el('textarea', { 'data-imp': 'criteria', placeholder: 'e.g. step up if no PHQ-9 improvement in 4 weeks' })); sc.appendChild(d3);
    panel.appendChild(sc);
    var tele = el('div', { class: 'int-card' }); tele.innerHTML = '<h4>Telehealth / digital readiness checklist</h4>';
    ['Private, confidential setting for both parties', 'Informed consent for telehealth', 'Local emergency contacts & address on file', 'Safety plan adapted for remote delivery', 'Worksheets/materials shareable on-screen or sent ahead', 'Exposures/role-plays adapted for remote format', 'Chosen digital tools are evidence-informed & integrated', 'Backup plan for tech failure'].forEach(function (it, i) { var l = el('label', { class: 'int-check' }); l.innerHTML = '<input type="checkbox" data-tele="' + i + '"> <span>' + esc(it) + '</span>'; tele.appendChild(l); });
    var tout = el('div', { class: 'int-readout' }); tele.appendChild(tout);
    function refresh() { var boxes = tele.querySelectorAll('[data-tele]'), done = tele.querySelectorAll('[data-tele]:checked').length; tout.innerHTML = '<span class="int-stat"><b>' + done + '/' + boxes.length + '</b>ready</span><span class="int-stat"><b>' + Math.round(done / boxes.length * 100) + '%</b>complete</span>'; }
    tele.addEventListener('change', refresh); refresh();
    panel.appendChild(tele);
    var actions = el('div', { class: 'int-actions' }); var copy = el('button', { class: 'int-btn', type: 'button' }, 'Copy implementation plan');
    copy.onclick = function () {
      var lines = ['IMPLEMENTATION — STEPPED CARE & TELEHEALTH', 'Date: ' + dateStamp(), '', 'Severity: ' + val('[data-imp="severity"]', sc), 'Matched step: ' + (val('[data-imp="step"]', sc) || '-'), 'Step-up/down: ' + (val('[data-imp="criteria"]', sc) || '-'), '', 'TELEHEALTH READINESS'];
      ['Private setting', 'Telehealth consent', 'Emergency contacts', 'Remote safety plan', 'Shareable materials', 'Adapted exposures/role-plays', 'Evidence-informed digital tools', 'Tech backup plan'].forEach(function (it, i) { lines.push('  [' + (tele.querySelector('[data-tele="' + i + '"]').checked ? 'x' : ' ') + '] ' + it); });
      copyBtn(lines.join('\n'), copy);
    };
    actions.appendChild(copy); panel.appendChild(actions); return panel;
  }

  // CAPSTONE ACTION PLAN
  function buildCapstone() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'int-ws-intro' }, 'Your personal implementation plan. Commit to specific techniques to practice, measures to adopt, supervision to seek, and next steps — and scale a learning goal with GAS.'));
    var card = el('div', { class: 'int-card' }); card.innerHTML = '<h4>Action plan</h4>';
    var t = buildTable([
      { key: 'technique', label: 'Technique to practice', type: 'text', ph: 'from any module' },
      { key: 'module', label: 'From module', type: 'select', opts: ['1 Foundations', '2 ABA/Autism', '3 BA/Depression', '4 Exposure/Anxiety', '5 Anger/PMT', '6 CBTp/Psychosis'], width: '150px' },
      { key: 'how', label: 'How I will practice it', type: 'text' }
    ]);
    card.appendChild(t); panel.appendChild(card);
    var extra = el('div', { class: 'int-card' }); extra.innerHTML = '<h4>Commitments</h4>';
    [['measures', 'Outcome measures I will adopt', 'e.g. PHQ-9, GAD-7, GAS every 2 sessions'],
     ['supervision', 'Supervision / consultation I will seek', ''],
     ['next', 'Next concrete steps (this month)', '']].forEach(function (x) { var d = el('div', { class: 'int-field' }); d.innerHTML = '<label>' + x[1] + (x[2] ? ' <span class="int-hint">' + x[2] + '</span>' : '') + '</label>'; d.appendChild(el('textarea', { 'data-cap': x[0] })); extra.appendChild(d); });
    panel.appendChild(extra);

    // GAS for a personal learning goal
    var gas = el('div', { class: 'int-card' }); gas.appendChild(el('h4', null, 'Learning goal — Goal Attainment Scaling'));
    var gnf = el('div', { class: 'int-field' }); gnf.innerHTML = '<label>Learning goal name</label>'; gnf.appendChild(el('input', { type: 'text', 'data-gas': 'name', placeholder: 'e.g. Deliver exposure with fidelity' })); gas.appendChild(gnf);
    var levels = [['-2', 'Much less than expected', 'int-gas--2'], ['-1', 'Somewhat less than expected', 'int-gas--1'], ['0', 'Expected outcome', 'int-gas-0'], ['+1', 'Somewhat more than expected', 'int-gas-1'], ['+2', 'Much more than expected', 'int-gas-2']];
    levels.forEach(function (lv) { var row = el('div', { class: 'int-gas-level' }); row.appendChild(el('span', { class: 'int-gas-tag ' + lv[2] }, lv[0] + '<br>' + lv[1])); var inp = el('input', { type: 'text', 'data-gas-level': lv[0], placeholder: 'Describe this level' }); inp.style.cssText = 'width:100%;box-sizing:border-box;padding:8px 10px;border:1px solid var(--border);border-radius:6px;background:#fdfcf9;'; row.appendChild(inp); gas.appendChild(row); });
    var curField = el('div', { class: 'int-field' }); curField.innerHTML = '<label>Current level</label>'; var curSel = el('select', { 'data-gas': 'current' }); ['-2', '-1', '0', '+1', '+2'].forEach(function (v) { curSel.appendChild(el('option', { value: v }, v)); }); curSel.value = '-2'; curField.appendChild(curSel); gas.appendChild(curField);
    var tOut = el('div', { class: 'int-readout' }); gas.appendChild(tOut);
    function updateT() { var x = parseInt(curSel.value, 10), rho = 0.3, T = 50 + (10 * x) / Math.sqrt((1 - rho) + rho); tOut.innerHTML = '<span class="int-stat"><b>' + Math.round(T) + '</b>GAS T-score</span><span class="int-stat"><b>' + curSel.value + '</b>current level</span>'; }
    curSel.addEventListener('change', updateT); updateT();
    panel.appendChild(gas);

    var actions = el('div', { class: 'int-actions' }); var copy = el('button', { class: 'int-btn', type: 'button' }, 'Copy my action plan');
    copy.onclick = function () {
      var lines = ['CAPSTONE ACTION PLAN', 'Date: ' + dateStamp(), '', 'TECHNIQUES TO PRACTICE'];
      t._readRows().forEach(function (r) { lines.push('  • ' + (r.technique || '-') + ' [' + (r.module || '') + '] — ' + (r.how || '-')); });
      lines.push('', 'COMMITMENTS'); [['measures', 'Measures'], ['supervision', 'Supervision'], ['next', 'Next steps']].forEach(function (x) { lines.push('  ' + x[1] + ': ' + (val('[data-cap="' + x[0] + '"]', extra) || '-')); });
      lines.push('', 'LEARNING GOAL (GAS) — ' + (val('[data-gas="name"]', gas) || '(goal)'));
      levels.forEach(function (lv) { lines.push('  ' + lv[0] + ' (' + lv[1] + '): ' + (val('[data-gas-level="' + lv[0] + '"]', gas) || '-')); });
      lines.push('  Current level: ' + curSel.value);
      copyBtn(lines.join('\n'), copy);
    };
    actions.appendChild(copy); panel.appendChild(actions); return panel;
  }

  var TABS = [
    { id: 'learn', label: 'Learn', build: function () { return el('div', { html: LEARN_HTML }); } },
    { id: 'sequencing', label: 'Formulation & Sequencing', build: buildSequencing },
    { id: 'meds', label: 'Therapy + Medication', build: buildMeds },
    { id: 'fidelity', label: 'Fidelity & Supervision', build: buildFidelity },
    { id: 'implementation', label: 'Stepped Care & Telehealth', build: buildImplementation },
    { id: 'capstone', label: 'Capstone Action Plan', build: buildCapstone }
  ];
  var meta = el('div', { class: 'int-meta' });
  meta.innerHTML = '<span class="int-chip int-chip-accent">Module 7 of 7</span><span class="int-chip">Integration</span><span class="int-chip">Combining with medication</span><span class="int-chip">Fidelity & implementation</span><span class="int-chip">Capstone</span><span class="int-chip">~3&ndash;4 contact hours</span>';
  root.appendChild(meta);

  // Print / Save-as-PDF: build every panel, then print (global print CSS shows only the active section; module CSS reveals all panels).
  var intPrintBar = el('div', { class: 'int-actions' });
  var intPrintBtn = el('button', { class: 'int-btn int-btn-ghost int-btn-sm', type: 'button' }, '\u1F5A8 Print / Save as PDF');
  intPrintBtn.innerHTML = '&#128424; Print / Save as PDF';
  intPrintBtn.onclick = function () {
    var allTabs = tabBar.querySelectorAll('.int-tab');
    Array.prototype.forEach.call(allTabs, function (b) { b.click(); });
    if (allTabs[0]) allTabs[0].click();
    window.print();
  };
  intPrintBar.appendChild(intPrintBtn);
  root.appendChild(intPrintBar);
  var tabBar = el('div', { class: 'int-tabs' }), panels = el('div');
  TABS.forEach(function (t, i) {
    var btn = el('button', { class: 'int-tab' + (i === 0 ? ' int-active' : ''), type: 'button' }, t.label);
    var panel = el('div', { class: 'int-panel' + (i === 0 ? ' int-active' : '') }); var built = false;
    function activate() { tabBar.querySelectorAll('.int-tab').forEach(function (b) { b.classList.remove('int-active'); }); panels.querySelectorAll('.int-panel').forEach(function (p) { p.classList.remove('int-active'); }); btn.classList.add('int-active'); panel.classList.add('int-active'); if (!built) { panel.appendChild(t.build()); built = true; } }
    btn.onclick = activate; if (i === 0) { panel.appendChild(t.build()); built = true; } tabBar.appendChild(btn); panels.appendChild(panel);
  });
  root.appendChild(tabBar); root.appendChild(panels);
  var hash = (location.hash || '').split(':')[1]; if (hash) { var idx = TABS.map(function (t) { return t.id; }).indexOf(hash); if (idx > -1) tabBar.querySelectorAll('.int-tab')[idx].click(); }
})();

/* ═══════════════════════════════════════════════════════════════════════
   anger-pmt.js — Course module 5
   "CBT for Anger Management & Parent Management Training (PMT): A How-To"
   Audience: trainees & advanced students.  Builds into #ang-root.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var root = document.getElementById('ang-root');
  if (!root || root.dataset.angBuilt) return;
  root.dataset.angBuilt = '1';

  var U = window.ToolUtils || {};
  function dateStamp() { return (U.dateStamp ? U.dateStamp() : new Date().toLocaleDateString()); }
  function copyBtn(t, b) { if (U.copyWithButton) U.copyWithButton(t, b); }
  function el(tag, attrs, html) { var e = document.createElement(tag); if (attrs) Object.keys(attrs).forEach(function (k) { if (k === 'class') e.className = attrs[k]; else if (k === 'html') e.innerHTML = attrs[k]; else e.setAttribute(k, attrs[k]); }); if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function val(sel, ctx) { var n = (ctx || root).querySelector(sel); return n ? n.value.trim() : ''; }

  function buildTable(cols, opts) {
    opts = opts || {}; var wrap = el('div'); var table = el('table', { class: 'ang-table' });
    var thead = el('thead'), htr = el('tr');
    cols.forEach(function (c) { htr.appendChild(el('th', c.width ? { style: 'width:' + c.width } : null, esc(c.label))); });
    htr.appendChild(el('th', { style: 'width:34px' }, '')); thead.appendChild(htr); table.appendChild(thead);
    var tbody = el('tbody'); table.appendChild(tbody); wrap.appendChild(table);
    function cell(c) {
      var td = el('td'), input;
      if (c.type === 'select') { input = el('select'); (c.opts || []).forEach(function (o) { input.appendChild(el('option', { value: o }, esc(o))); }); }
      else if (c.type === 'textarea') input = el('textarea', { placeholder: c.ph || '' });
      else if (c.type === 'num') input = el('input', { type: 'number', min: '0', max: '100', class: 'ang-num', placeholder: c.ph || '' });
      else if (c.type === 'date') input = el('input', { type: 'date' });
      else input = el('input', { type: 'text', placeholder: c.ph || '' });
      input.setAttribute('data-key', c.key); td.appendChild(input); return td;
    }
    function addRow(data) { var tr = el('tr'); cols.forEach(function (c) { var td = cell(c); if (data && data[c.key] != null) td.querySelector('[data-key]').value = data[c.key]; tr.appendChild(td); }); var delTd = el('td'); var del = el('button', { class: 'ang-row-del', type: 'button', title: 'Remove' }, '&times;'); del.onclick = function () { tr.remove(); }; delTd.appendChild(del); tr.appendChild(delTd); tbody.appendChild(tr); return tr; }
    (opts.starter || []).forEach(addRow); if (!opts.starter) addRow();
    var addBtn = el('button', { class: 'ang-btn ang-btn-ghost ang-btn-sm', type: 'button' }, '+ Add row'); addBtn.onclick = function () { addRow(); };
    wrap.appendChild(el('div', { class: 'ang-actions' })).appendChild(addBtn);
    wrap._readRows = function () { return Array.prototype.map.call(tbody.querySelectorAll('tr'), function (tr) { var o = {}; tr.querySelectorAll('[data-key]').forEach(function (i) { o[i.getAttribute('data-key')] = i.value.trim(); }); return o; }).filter(function (o) { return Object.keys(o).some(function (k) { return o[k]; }); }); };
    return wrap;
  }

  function buildSmartGas() {
    var box = el('div');
    var smart = el('div', { class: 'ang-card' }); smart.appendChild(el('h4', null, 'Goal builder (SMART)'));
    var fields = [['specific', 'Specific', 'What behavior will change?', 'e.g. use a coping plan when provoked'], ['measurable', 'Measurable', 'How measured?', 'e.g. anger outbursts/week'], ['achievable', 'Achievable', 'Realistic step?', ''], ['relevant', 'Relevant', 'Why it matters', 'e.g. protect relationships'], ['timebound', 'Time-bound', 'By when', '']];
    fields.forEach(function (x) { var d = el('div', { class: 'ang-field' }); d.innerHTML = '<label>' + x[1] + ' <span class="ang-hint">' + x[2] + '</span></label>'; d.appendChild(el('input', { type: 'text', 'data-smart': x[0], placeholder: x[3] })); smart.appendChild(d); });
    var preview = el('div', { class: 'ang-preview' }); smart.appendChild(preview);
    smart.addEventListener('input', function () { var g = {}; smart.querySelectorAll('[data-smart]').forEach(function (i) { g[i.getAttribute('data-smart')] = i.value.trim(); }); if (!g.specific && !g.measurable) { preview.innerHTML = ''; return; } preview.innerHTML = '<strong>Goal:</strong> ' + esc(g.specific || '…') + (g.measurable ? ' — ' + esc(g.measurable) : '') + (g.timebound ? ', ' + esc(g.timebound) : '') + (g.relevant ? '. <em>' + esc(g.relevant) + '.</em>' : '.'); });
    box.appendChild(smart);
    var gas = el('div', { class: 'ang-card' }); gas.appendChild(el('h4', null, 'Goal Attainment Scaling (GAS)'));
    var gnf = el('div', { class: 'ang-field' }); gnf.innerHTML = '<label>Goal name</label>'; gnf.appendChild(el('input', { type: 'text', 'data-gas': 'name', placeholder: 'short label' })); gas.appendChild(gnf);
    var levels = [['-2', 'Much less than expected', 'ang-gas--2'], ['-1', 'Somewhat less than expected', 'ang-gas--1'], ['0', 'Expected outcome', 'ang-gas-0'], ['+1', 'Somewhat more than expected', 'ang-gas-1'], ['+2', 'Much more than expected', 'ang-gas-2']];
    levels.forEach(function (lv) { var row = el('div', { class: 'ang-gas-level' }); row.appendChild(el('span', { class: 'ang-gas-tag ' + lv[2] }, lv[0] + '<br>' + lv[1])); var inp = el('input', { type: 'text', 'data-gas-level': lv[0], placeholder: 'Describe this level' }); inp.style.cssText = 'width:100%;box-sizing:border-box;padding:8px 10px;border:1px solid var(--border);border-radius:6px;background:#fdfcf9;'; row.appendChild(inp); gas.appendChild(row); });
    var curField = el('div', { class: 'ang-field' }); curField.innerHTML = '<label>Current attainment level</label>'; var curSel = el('select', { 'data-gas': 'current' }); ['-2', '-1', '0', '+1', '+2'].forEach(function (v) { curSel.appendChild(el('option', { value: v }, v)); }); curSel.value = '-2'; curField.appendChild(curSel); gas.appendChild(curField);
    var tOut = el('div', { class: 'ang-readout' }); gas.appendChild(tOut);
    function updateT() { var x = parseInt(curSel.value, 10), rho = 0.3, T = 50 + (10 * x) / Math.sqrt((1 - rho) + rho); tOut.innerHTML = '<span class="ang-stat"><b>' + Math.round(T) + '</b>GAS T-score</span><span class="ang-stat"><b>' + curSel.value + '</b>current level</span><span class="ang-stat" style="font-size:12px;color:#7a7364;">T=50 = expected; &gt;50 exceeds expectation.</span>'; }
    curSel.addEventListener('change', updateT); updateT(); box.appendChild(gas);
    box._report = function () { var g = {}; smart.querySelectorAll('[data-smart]').forEach(function (i) { g[i.getAttribute('data-smart')] = i.value.trim(); }); var lines = ['SMART GOAL']; fields.forEach(function (x) { lines.push('  ' + x[1] + ': ' + (g[x[0]] || '-')); }); lines.push('', 'GOAL ATTAINMENT SCALING — ' + (val('[data-gas="name"]', gas) || '(goal)')); levels.forEach(function (lv) { lines.push('  ' + lv[0] + ' (' + lv[1] + '): ' + (val('[data-gas-level="' + lv[0] + '"]', gas) || '-')); }); lines.push('  Current level: ' + curSel.value); return lines.join('\n'); };
    return box;
  }

  var LEARN_HTML =
    '<div class="ang-learn">' +
      '<p class="ang-lead">This module covers two evidence-based routes to reducing anger, irritability, and aggression: <strong>CBT for anger</strong> (for adults and adolescents who want to manage their own anger) and <strong>Parent Management Training</strong> (PMT, for caregivers of children with irritability and disruptive behavior). Both target the cycle that keeps anger going and replace it with skills.</p>' +

      '<h3>Part A — CBT for Anger (adults &amp; adolescents)</h3>' +
      '<h4>1. Assessment</h4>' +
      '<p>Map the anger episode: external and internal <strong>triggers</strong>, the <strong>appraisals</strong> that fuel anger (especially <em>hostile attribution bias</em> — reading hostile intent into ambiguous events), <strong>physiological arousal</strong>, the <strong>behavior</strong> (aggression, withdrawal), and its <strong>consequences</strong>. Self-monitoring with an anger log builds awareness and reveals patterns.</p>' +
      '<h4>2. Core techniques</h4>' +
      '<ul>' +
        '<li><strong>Cognitive restructuring:</strong> identify and test anger-generating thoughts (hostile attributions, &ldquo;shoulds,&rdquo; catastrophizing, demandingness); generate balanced, coping-focused alternatives.</li>' +
        '<li><strong>Arousal reduction:</strong> progressive muscle relaxation, paced/diaphragmatic breathing, and cued relaxation to lower physiological activation.</li>' +
        '<li><strong>Assertiveness &amp; problem-solving:</strong> get needs met without aggression; structured problem-solving for recurring conflicts.</li>' +
        '<li><strong>Stress inoculation:</strong> rehearse coping across phases — <em>prepare</em> for the provocation, <em>confront</em> it, <em>cope</em> with arousal, and <em>reflect</em> afterward — using coping self-statements, graded to increasingly provocative scenarios.</li>' +
      '</ul>' +
      '<h4>3. Structure &amp; relapse prevention</h4>' +
      '<p>Standard CBT session structure with homework (anger logs, relaxation practice, planned coping). Build a written plan for high-risk situations and expect lapses as learning opportunities.</p>' +

      '<h3>Part B — Parent Management Training (PMT)</h3>' +
      '<h4>1. Rationale: the coercive cycle</h4>' +
      '<p>Child disruptive behavior is often maintained by a <strong>coercive cycle</strong>: a parent makes a demand, the child escalates (whines, argues, tantrums), the parent gives in to stop the aversive behavior — which negatively reinforces the child&rsquo;s escalation <em>and</em> the parent&rsquo;s giving in. PMT teaches parents to reverse the contingencies.</p>' +
      '<h4>2. Core skills (taught to caregivers)</h4>' +
      '<ul>' +
        '<li><strong>Positive attending &amp; reinforcement:</strong> catch the child being good; use labeled praise and rewards for desired behavior; special child-led play time.</li>' +
        '<li><strong>Effective commands:</strong> clear, specific, one-at-a-time, direct (not a question), followed by wait time.</li>' +
        '<li><strong>Consistent consequences:</strong> planned ignoring for attention-seeking minor misbehavior; when-then/if-then contingencies; a rewards system.</li>' +
        '<li><strong>Time-out &amp; privilege removal:</strong> delivered calmly, consistently, and briefly, for defined behaviors.</li>' +
        '<li><strong>Problem-solving with older children.</strong></li>' +
      '</ul>' +
      '<h4>3. Structure &amp; fidelity</h4>' +
      '<p>Sessions are parent-focused (sometimes parent&ndash;child), with in-session role-play/coaching, home-practice logs, and fidelity monitoring. Generalization depends on consistent home implementation — coaching parents to fluency is the active ingredient.</p>' +

      '<div class="ang-callout ang-warn"><span class="ang-callout-title">Safety &amp; screening</span>Assess for domestic violence, abuse, and safety before recommending techniques. Where aggression poses risk, prioritize safety planning and appropriate referral. Adapt PMT to family context and avoid harsh or shaming discipline.</div>' +

      '<h3>Key references</h3>' +
      '<ul class="ang-refs">' +
        '<li>Novaco, R. W. Anger treatment and stress-inoculation approaches.</li>' +
        '<li>Kazdin, A. E. <em>Parent Management Training.</em> Oxford University Press.</li>' +
        '<li>Barkley, R. A. <em>Defiant Children</em> (parent-training program).</li>' +
        '<li>Sukhodolsky, D. G., et al. Reviews of behavioral interventions for irritability/aggression &amp; anger in youth.</li>' +
        '<li>APA resources on anger management &amp; CBT effectiveness.</li>' +
      '</ul>' +
    '</div>';

  // ANGER LOG
  function buildAngerLog() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'ang-ws-intro' }, 'Self-monitoring log (Part A). Capture triggers, hot thoughts (watch for hostile attributions), arousal, behavior, and consequences. Reviewing the pattern is the first intervention.'));
    var card = el('div', { class: 'ang-card' }); card.innerHTML = '<h4>Anger episode log</h4>';
    var t = buildTable([
      { key: 'trigger', label: 'Trigger / situation', type: 'text' },
      { key: 'thought', label: 'Hot thought (hostile appraisal?)', type: 'textarea' },
      { key: 'anger', label: 'Anger 0-100', type: 'num', width: '80px' },
      { key: 'body', label: 'Body signs', type: 'text', ph: 'e.g. tense, hot' },
      { key: 'behavior', label: 'What I did', type: 'text' },
      { key: 'consequence', label: 'Consequence', type: 'text' }
    ]);
    card.appendChild(t); panel.appendChild(card);
    var out = el('div', { class: 'ang-readout' }); panel.appendChild(out);
    function refresh() { var rows = t._readRows(); var a = rows.map(function (r) { return parseFloat(r.anger); }).filter(function (n) { return !isNaN(n); }); out.innerHTML = '<span class="ang-stat"><b>' + rows.length + '</b>episodes</span><span class="ang-stat"><b>' + (a.length ? Math.round(a.reduce(function (x, y) { return x + y; }, 0) / a.length) : '—') + '</b>avg anger</span><span class="ang-stat"><b>' + (a.length ? Math.max.apply(null, a) : '—') + '</b>peak anger</span>'; }
    panel.addEventListener('input', refresh); panel.addEventListener('click', function (e) { if (/Add row/.test(e.target.textContent) || e.target.classList.contains('ang-row-del')) setTimeout(refresh, 0); }); refresh();
    var actions = el('div', { class: 'ang-actions' }); var copy = el('button', { class: 'ang-btn', type: 'button' }, 'Copy anger log');
    copy.onclick = function () { var lines = ['ANGER EPISODE LOG', 'Date: ' + dateStamp(), '']; t._readRows().forEach(function (r) { lines.push('• ' + (r.trigger || '-') + ' [anger ' + (r.anger || '-') + '] thought: ' + (r.thought || '-') + ' → ' + (r.behavior || '-') + ' (' + (r.consequence || '-') + ')'); }); copyBtn(lines.join('\n'), copy); };
    actions.appendChild(copy); panel.appendChild(actions); return panel;
  }

  // ANGER SKILLS
  function buildAngerSkills() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'ang-ws-intro' }, 'Build the three core coping skills: restructure hot thoughts, lower arousal, and rehearse a stress-inoculation plan for a specific provocation.'));
    var cr = el('div', { class: 'ang-card' }); cr.innerHTML = '<h4>Cognitive restructuring (anger)</h4>';
    var t = buildTable([
      { key: 'hot', label: 'Hot thought (hostile appraisal / "should")', type: 'textarea' },
      { key: 'evidence', label: 'Evidence & other explanations', type: 'textarea' },
      { key: 'coping', label: 'Balanced / coping thought', type: 'textarea' }
    ]);
    cr.appendChild(t); panel.appendChild(cr);
    var relax = el('div', { class: 'ang-card' }); relax.innerHTML = '<h4>Arousal-reduction practice</h4>';
    ['Paced / diaphragmatic breathing', 'Progressive muscle relaxation', 'Cued relaxation word', 'Brief time-away / walk', 'Physical exercise routine'].forEach(function (it, i) { var l = el('label', { class: 'ang-check' }); l.innerHTML = '<input type="checkbox" data-relax="' + i + '"> <span>' + esc(it) + '</span>'; relax.appendChild(l); });
    panel.appendChild(relax);
    var si = el('div', { class: 'ang-card' }); si.innerHTML = '<h4>Stress-inoculation plan</h4>';
    si.appendChild(el('p', { class: 'ang-ws-intro' }, 'Write a coping self-statement for each phase of a specific provocation you can rehearse.'));
    [['prepare', 'Prepare (before)', 'e.g. "I can handle this. Stick to the plan."'],
     ['confront', 'Confront (during)', 'e.g. "Stay calm. I don\'t have to react."'],
     ['cope', 'Cope with arousal (peak)', 'e.g. "Breathe. My muscles are tight — relax them."'],
     ['reflect', 'Reflect (after)', 'e.g. "I handled that better than before."']].forEach(function (x) { var d = el('div', { class: 'ang-field' }); d.innerHTML = '<label>' + x[1] + ' <span class="ang-hint">' + x[2] + '</span></label>'; d.appendChild(el('textarea', { 'data-si': x[0] })); si.appendChild(d); });
    panel.appendChild(si);
    var actions = el('div', { class: 'ang-actions' }); var copy = el('button', { class: 'ang-btn', type: 'button' }, 'Copy anger skills plan');
    copy.onclick = function () {
      var lines = ['ANGER SKILLS PLAN', 'Date: ' + dateStamp(), '', 'COGNITIVE RESTRUCTURING'];
      t._readRows().forEach(function (r) { lines.push('  Hot: ' + (r.hot || '-') + ' | Evidence: ' + (r.evidence || '-') + ' | Coping: ' + (r.coping || '-')); });
      lines.push('', 'AROUSAL REDUCTION'); ['Paced / diaphragmatic breathing', 'Progressive muscle relaxation', 'Cued relaxation word', 'Brief time-away / walk', 'Physical exercise routine'].forEach(function (it, i) { lines.push('  [' + (relax.querySelector('[data-relax="' + i + '"]').checked ? 'x' : ' ') + '] ' + it); });
      lines.push('', 'STRESS INOCULATION');
      [['prepare', 'Prepare'], ['confront', 'Confront'], ['cope', 'Cope with arousal'], ['reflect', 'Reflect']].forEach(function (x) { lines.push('  ' + x[1] + ': ' + (val('[data-si="' + x[0] + '"]', si) || '-')); });
      copyBtn(lines.join('\n'), copy);
    };
    actions.appendChild(copy); panel.appendChild(actions); return panel;
  }

  // PMT PLAN
  function buildPMT() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'ang-ws-intro' }, 'Build the caregiver plan (Part B). Reverse the coercive cycle: increase positive attention, give effective commands, and apply consistent consequences.'));
    var cc = el('div', { class: 'ang-card' }); cc.innerHTML = '<h4>Coercive cycle to interrupt</h4>';
    var d = el('div', { class: 'ang-field' }); d.innerHTML = '<label>Describe a recurring cycle <span class="ang-hint">demand → escalation → giving in</span></label>'; d.appendChild(el('textarea', { 'data-pmt': 'cycle', placeholder: 'e.g. "Turn off the game" → screaming → parent lets him keep playing' })); cc.appendChild(d);
    panel.appendChild(cc);
    var pos = el('div', { class: 'ang-card' }); pos.innerHTML = '<h4>Positive attending &amp; reinforcement</h4>';
    var pt = buildTable([
      { key: 'behavior', label: 'Desired behavior to reinforce', type: 'text' },
      { key: 'how', label: 'How (labeled praise / reward)', type: 'text' }
    ]);
    pos.appendChild(pt);
    var sp = el('div', { class: 'ang-field' }); sp.innerHTML = '<label>Daily special (child-led) play time <span class="ang-hint">when & how long</span></label>'; sp.appendChild(el('input', { type: 'text', 'data-pmt': 'playtime', placeholder: 'e.g. 10 min after dinner, child chooses' })); pos.appendChild(sp);
    panel.appendChild(pos);
    var cmd = el('div', { class: 'ang-card' }); cmd.innerHTML = '<h4>Effective-command checklist</h4>';
    ['Get the child’s attention first', 'State it as a command, not a question', 'One instruction at a time', 'Specific and concrete', 'Calm, neutral tone', 'Allow wait time (~5s) to comply', 'Praise compliance immediately'].forEach(function (it, i) { var l = el('label', { class: 'ang-check' }); l.innerHTML = '<input type="checkbox" data-cmd="' + i + '"> <span>' + esc(it) + '</span>'; cmd.appendChild(l); });
    panel.appendChild(cmd);
    var con = el('div', { class: 'ang-card' }); con.innerHTML = '<h4>Consequence system</h4>';
    [['ignore', 'Behaviors to planned-ignore', 'minor attention-seeking (whining, mild protest)'],
     ['rewards', 'Reward system', 'e.g. token/points chart for target behaviors'],
     ['timeout', 'Time-out plan', 'which behaviors, where, how long (~1 min/yr age), how ended'],
     ['privilege', 'Privilege removal', 'defined behaviors → specific privilege lost']].forEach(function (x) { var f = el('div', { class: 'ang-field' }); f.innerHTML = '<label>' + x[1] + ' <span class="ang-hint">' + x[2] + '</span></label>'; f.appendChild(el('textarea', { 'data-pmt': x[0] })); con.appendChild(f); });
    panel.appendChild(con);
    var actions = el('div', { class: 'ang-actions' }); var copy = el('button', { class: 'ang-btn', type: 'button' }, 'Copy PMT plan');
    copy.onclick = function () {
      var lines = ['PARENT MANAGEMENT TRAINING — PLAN', 'Date: ' + dateStamp(), '', 'Coercive cycle: ' + (val('[data-pmt="cycle"]', panel) || '-'), '', 'POSITIVE ATTENDING'];
      pt._readRows().forEach(function (r) { lines.push('  • ' + (r.behavior || '-') + ' → ' + (r.how || '-')); });
      lines.push('  Special play time: ' + (val('[data-pmt="playtime"]', panel) || '-'));
      lines.push('', 'EFFECTIVE COMMANDS'); ['Get attention first', 'Command not question', 'One at a time', 'Specific', 'Calm tone', 'Wait time', 'Praise compliance'].forEach(function (it, i) { lines.push('  [' + (cmd.querySelector('[data-cmd="' + i + '"]').checked ? 'x' : ' ') + '] ' + it); });
      lines.push('', 'CONSEQUENCES');
      [['ignore', 'Planned ignoring'], ['rewards', 'Reward system'], ['timeout', 'Time-out'], ['privilege', 'Privilege removal']].forEach(function (x) { lines.push('  ' + x[1] + ': ' + (val('[data-pmt="' + x[0] + '"]', con) || '-')); });
      copyBtn(lines.join('\n'), copy);
    };
    actions.appendChild(copy); panel.appendChild(actions); return panel;
  }

  // GOALS
  function buildGoals() { var panel = el('div'); panel.appendChild(el('p', { class: 'ang-ws-intro' }, 'Set a measurable goal for anger control or the child behavior plan, and scale it with GAS.')); var sg = buildSmartGas(); panel.appendChild(sg); var actions = el('div', { class: 'ang-actions' }); var copy = el('button', { class: 'ang-btn', type: 'button' }, 'Copy goal plan'); copy.onclick = function () { copyBtn(['ANGER / PMT — GOAL', 'Date: ' + dateStamp(), '', sg._report()].join('\n'), copy); }; actions.appendChild(copy); panel.appendChild(actions); return panel; }

  // OUTCOMES
  function buildOutcomes() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'ang-ws-intro' }, 'Track anger episodes (adult) or target-behavior frequency (child) across sessions to judge progress.'));
    var card = el('div', { class: 'ang-card' }); card.innerHTML = '<h4>Progress tracker</h4>';
    var st = buildTable([
      { key: 'date', label: 'Date', type: 'date', width: '150px' },
      { key: 'metric', label: 'What is counted', type: 'text', ph: 'e.g. outbursts/week' },
      { key: 'count', label: 'Count / rating', type: 'num', width: '100px' }
    ]);
    card.appendChild(st); var trend = el('ul', { class: 'ang-progress-list' }); card.appendChild(trend);
    function refreshTrend() { var rows = st._readRows().filter(function (r) { return r.count !== '' && !isNaN(parseFloat(r.count)); }); trend.innerHTML = ''; if (!rows.length) return; var base = parseFloat(rows[0].count); rows.forEach(function (r, i) { var v = parseFloat(r.count), d = v - base; var dh = i === 0 ? '<span class="ang-hint">baseline</span>' : (d <= 0 ? '<span class="ang-delta-up">' + d + '</span>' : '<span class="ang-delta-down">+' + d + '</span>'); var li = el('li'); li.innerHTML = '<span>' + esc(r.date || ('Session ' + (i + 1))) + ' — ' + esc(r.metric || '') + ' ' + v + '</span>' + dh; trend.appendChild(li); }); }
    card.addEventListener('input', refreshTrend); card.addEventListener('click', function (e) { if (/Add row/.test(e.target.textContent) || e.target.classList.contains('ang-row-del')) setTimeout(refreshTrend, 0); });
    panel.appendChild(card);
    var actions = el('div', { class: 'ang-actions' }); var copy = el('button', { class: 'ang-btn', type: 'button' }, 'Copy progress');
    copy.onclick = function () { var rows = st._readRows().filter(function (r) { return r.count; }); var lines = ['ANGER / PMT — PROGRESS', 'Date: ' + dateStamp(), '']; if (rows.length) { var base = parseFloat(rows[0].count); rows.forEach(function (r, i) { var d = parseFloat(r.count) - base; lines.push('  ' + (r.date || ('S' + (i + 1))) + ': ' + (r.metric || '') + ' ' + r.count + (i === 0 ? ' (baseline)' : ' (' + (d <= 0 ? '' : '+') + d + ')')); }); } else lines.push('  (no data)'); copyBtn(lines.join('\n'), copy); };
    actions.appendChild(copy); panel.appendChild(actions); return panel;
  }

  var TABS = [
    { id: 'learn', label: 'Learn', build: function () { return el('div', { html: LEARN_HTML }); } },
    { id: 'angerlog', label: 'Anger Log', build: buildAngerLog },
    { id: 'skills', label: 'Anger Skills', build: buildAngerSkills },
    { id: 'pmt', label: 'PMT Plan', build: buildPMT },
    { id: 'goals', label: 'Goals', build: buildGoals },
    { id: 'outcomes', label: 'Outcomes', build: buildOutcomes }
  ];
  var meta = el('div', { class: 'ang-meta' });
  meta.innerHTML = '<span class="ang-chip ang-chip-accent">Module 5 of 7</span><span class="ang-chip">CBT for Anger</span><span class="ang-chip">Parent Management Training</span><span class="ang-chip">Irritability / Aggression</span><span class="ang-chip">Trainee / advanced student</span><span class="ang-chip">~4&ndash;5 contact hours</span>';
  root.appendChild(meta);

  // Print / Save-as-PDF: build every panel, then print (global print CSS shows only the active section; module CSS reveals all panels).
  var angPrintBar = el('div', { class: 'ang-actions' });
  var angPrintBtn = el('button', { class: 'ang-btn ang-btn-ghost ang-btn-sm', type: 'button' }, '\u1F5A8 Print / Save as PDF');
  angPrintBtn.innerHTML = '&#128424; Print / Save as PDF';
  angPrintBtn.onclick = function () {
    var allTabs = tabBar.querySelectorAll('.ang-tab');
    Array.prototype.forEach.call(allTabs, function (b) { b.click(); });
    if (allTabs[0]) allTabs[0].click();
    window.print();
  };
  angPrintBar.appendChild(angPrintBtn);
  root.appendChild(angPrintBar);
  var tabBar = el('div', { class: 'ang-tabs' }), panels = el('div');
  TABS.forEach(function (t, i) {
    var btn = el('button', { class: 'ang-tab' + (i === 0 ? ' ang-active' : ''), type: 'button' }, t.label);
    var panel = el('div', { class: 'ang-panel' + (i === 0 ? ' ang-active' : '') }); var built = false;
    function activate() { tabBar.querySelectorAll('.ang-tab').forEach(function (b) { b.classList.remove('ang-active'); }); panels.querySelectorAll('.ang-panel').forEach(function (p) { p.classList.remove('ang-active'); }); btn.classList.add('ang-active'); panel.classList.add('ang-active'); if (!built) { panel.appendChild(t.build()); built = true; } }
    btn.onclick = activate; if (i === 0) { panel.appendChild(t.build()); built = true; } tabBar.appendChild(btn); panels.appendChild(panel);
  });
  root.appendChild(tabBar); root.appendChild(panels);
  var hash = (location.hash || '').split(':')[1]; if (hash) { var idx = TABS.map(function (t) { return t.id; }).indexOf(hash); if (idx > -1) tabBar.querySelectorAll('.ang-tab')[idx].click(); }
})();

/* ═══════════════════════════════════════════════════════════════════════
   cbtp-psychosis.js — Course module 6
   "CBT for Psychosis (CBTp) & Related Approaches: A How-To"
   Audience: trainees & advanced students.
   Builds a tabbed module into #cbp-root. Uses ToolUtils for clipboard/date.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var root = document.getElementById('cbp-root');
  if (!root || root.dataset.cbpBuilt) return;
  root.dataset.cbpBuilt = '1';

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
    '<div class="cbp-learn">' +
      '<p class="cbp-lead">Cognitive Behavioral Therapy for psychosis (CBTp) helps people with psychotic experiences reduce the distress and disruption those experiences cause &mdash; not by arguing they are &ldquo;false,&rdquo; but by collaboratively exploring how events, appraisals, emotions, and behavior interact. NICE and APA guidance recommend offering CBTp to everyone with schizophrenia/psychosis, alongside medication. This module teaches the core stance and techniques, plus the essentials of family intervention, social skills training, and cognitive remediation.</p>' +

      '<h3>1. Stance: engagement &amp; normalizing first</h3>' +
      '<p>Engagement is the intervention&rsquo;s foundation. Move at the person&rsquo;s pace, take their experiences seriously, and be transparent and non-confrontational. <strong>Normalizing</strong> &mdash; framing unusual experiences on a continuum with ordinary experience (e.g., most people have had unusual perceptions under stress, sleep deprivation, or grief) &mdash; reduces shame and fear and opens space for exploration.</p>' +
      '<div class="cbp-callout cbp-tip"><span class="cbp-callout-title">Golden rule</span>You are not trying to talk someone out of a belief or convince them a voice isn&rsquo;t real. You are working together to reduce distress and expand life. Collaborative empiricism, curiosity, and guided discovery &mdash; never debate.</div>' +

      '<h3>2. Assessment &amp; collaborative formulation</h3>' +
      '<p>Build a shared, individualized understanding. Two complementary maps:</p>' +
      '<dl class="cbp-acr">' +
        '<dt>ABC</dt><dd><strong>A</strong>ctivating event/trigger &rarr; <strong>B</strong>eliefs/appraisals (the meaning given) &rarr; <strong>C</strong>onsequences (emotion &amp; behavior). The appraisal, not the event, drives distress.</dd>' +
        '<dt>The 4 Ps</dt><dd><strong>P</strong>redisposing, <strong>P</strong>recipitating, <strong>P</strong>erpetuating, and <strong>P</strong>rotective factors &mdash; the longitudinal formulation.</dd>' +
      '</dl>' +
      '<p>The <em>Formulate</em> tab operationalizes both. A good formulation makes symptoms understandable, identifies maintaining cycles (e.g., safety behaviors, avoidance, worry), and points to intervention targets.</p>' +

      '<h3>3. Working with distressing voices (hallucinations)</h3>' +
      '<p>In CBTp, distress from voices is driven largely by <strong>beliefs about the voices</strong> &mdash; their perceived power, malevolence/benevolence, omniscience, and the need to comply &mdash; more than by their content or frequency. Steps:</p>' +
      '<ul>' +
        '<li><strong>Assess</strong> frequency, triggers, content, and especially beliefs about the voice&rsquo;s power and control.</li>' +
        '<li><strong>Coping strategy enhancement:</strong> identify and strengthen what already helps (engaging in activity, focusing/refocusing attention, listening to music, subvocalization tasks, relaxation, connecting with others).</li>' +
        '<li><strong>Belief modification:</strong> gently test beliefs about the voice&rsquo;s power/omniscience (e.g., resisting a command safely to test the belief the voice is all-powerful).</li>' +
        '<li>Foster a sense of <strong>control and choice</strong> in relation to the voice.</li>' +
      '</ul>' +

      '<h3>4. Working with distressing beliefs (delusions)</h3>' +
      '<p>Approach beliefs as understandable given the person&rsquo;s experiences. Techniques, always collaborative:</p>' +
      '<ul>' +
        '<li>Rate <strong>conviction</strong> (0&ndash;100%) and revisit it over time rather than seeking instant change.</li>' +
        '<li><strong>Examine the evidence</strong> for and against, gently and curiously (guided discovery).</li>' +
        '<li>Generate and weigh <strong>alternative explanations</strong>.</li>' +
        '<li>Design <strong>behavioral experiments</strong> to test specific predictions in vivo.</li>' +
      '</ul>' +
      '<div class="cbp-callout cbp-warn"><span class="cbp-callout-title">Safety &amp; pacing</span>Never challenge a belief that is providing protection without a plan, and avoid direct confrontation of firmly held beliefs early on. If a belief involves risk to self or others (e.g., command hallucinations, persecutory beliefs driving action), prioritize risk assessment and safety planning.</div>' +

      '<h3>5. Negative symptoms &amp; functioning</h3>' +
      '<p>For negative symptoms and low activity, borrow behavioral-activation logic: collaboratively set valued, achievable goals; schedule graded activity; address defeatist performance beliefs (&ldquo;there&rsquo;s no point,&rsquo; &ldquo;I&rsquo;ll fail&rdquo;) that maintain withdrawal; and build mastery and social connection. The <em>Goals</em> tab supports this.</p>' +

      '<h3>6. Course &amp; format</h3>' +
      '<p>NICE recommends <strong>at least 16 planned sessions</strong>, individually delivered (group formats exist). Sessions are structured but flexible, follow the formulation, and are paced to engagement. Homework is collaborative and often behavioral (experiments, coping practice).</p>' +

      '<h3>7. Family intervention &amp; psychoeducation</h3>' +
      '<p>Family intervention is a strongly evidence-based adjunct that reduces relapse. Core ingredients: psychoeducation about psychosis; improving communication; collaborative problem-solving; and reducing high expressed emotion (criticism, hostility, emotional over-involvement) through support and reframing.</p>' +

      '<h3>8. Social skills training &amp; cognitive remediation</h3>' +
      '<ul>' +
        '<li><strong>Social skills training (SST):</strong> structured, behavioral teaching of interpersonal skills &mdash; instruction, modeling, role-play, feedback, and homework &mdash; to improve functioning.</li>' +
        '<li><strong>Cognitive Remediation Therapy (CRT):</strong> drill-and-practice plus strategy coaching targeting cognitive domains (attention, memory, executive function), with a bridge to real-world functioning. Best paired with rehabilitation.</li>' +
      '</ul>' +

      '<h3>9. Integration with medication &amp; crisis planning</h3>' +
      '<p>CBTp complements antipsychotic medication; it is not a replacement. Coordinate with the prescriber, support informed shared decision-making about medication, and build a written <strong>staying-well / crisis plan</strong> (early warning signs, coping strategies, supports, and contacts) &mdash; see the <em>Outcomes &amp; Staying Well</em> tab.</p>' +

      '<h3>10. Managing engagement difficulties &amp; therapist reactions</h3>' +
      '<div class="cbp-callout cbp-tip"><span class="cbp-callout-title">Engagement</span>Expect variable engagement. Flexibility on setting, length, and agenda, plus genuine interest in the person&rsquo;s life and goals (not just symptoms), builds the alliance that makes CBTp possible.</div>' +
      '<div class="cbp-callout cbp-tip"><span class="cbp-callout-title">Your own reactions</span>Clinicians can feel anxious or helpless with psychosis and retreat into reassurance or avoidance. Supervision, a solid formulation, and comfort with uncertainty keep the work collaborative and steady.</div>' +

      '<h3>Key references</h3>' +
      '<ul class="cbp-refs">' +
        '<li>NICE Guideline CG178 &mdash; <em>Psychosis and schizophrenia in adults: prevention and management.</em></li>' +
        '<li>Landa, Y. (2017). <em>Cognitive Behavioral Therapy for Psychosis (CBTp): An Introductory Manual for Clinicians.</em> VA / VISN 2.</li>' +
        '<li>Kingdon, D., &amp; Turkington, D. (2005). <em>Cognitive Therapy of Schizophrenia.</em> Guilford Press.</li>' +
        '<li>Morrison, A. P., et al. Cognitive therapy for psychosis (manuals &amp; trials).</li>' +
        '<li>Wykes, T., &amp; Reeder, C. <em>Cognitive Remediation Therapy for Schizophrenia.</em></li>' +
        '<li>SAMHSA &amp; APA resources on psychosocial treatments for schizophrenia; family intervention evidence base.</li>' +
      '</ul>' +
    '</div>';

  // ═══════════════════════════════════════════════════════════════════════
  //  Reusable table
  // ═══════════════════════════════════════════════════════════════════════
  function buildTable(cols, opts) {
    opts = opts || {};
    var wrap = el('div');
    var table = el('table', { class: 'cbp-table' });
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
        input = el('input', { type: 'number', min: '0', max: '100', class: 'cbp-num', placeholder: c.ph || '' });
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
      var del = el('button', { class: 'cbp-row-del', title: 'Remove row', type: 'button' }, '&times;');
      del.onclick = function () { tr.remove(); };
      delTd.appendChild(del);
      tr.appendChild(delTd);
      tbody.appendChild(tr);
      return tr;
    }
    (opts.starter || []).forEach(addRow);
    if (!opts.starter) addRow();

    var addBtn = el('button', { class: 'cbp-btn cbp-btn-ghost cbp-btn-sm', type: 'button' }, '+ Add row');
    addBtn.onclick = function () { addRow(); };
    var actWrap = el('div', { class: 'cbp-actions' });
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

  // Conviction/belief slider (0-100)
  function slider(label, initial) {
    var row = el('div');
    row.appendChild(el('label', { style: 'font-weight:600;font-size:13px;' }, label));
    var flex = el('div', { class: 'cbp-slider-row' });
    var range = el('input', { type: 'range', min: '0', max: '100', step: '5', value: String(initial == null ? 50 : initial) });
    var out = el('span', { class: 'cbp-slider-val' }, range.value + '%');
    range.addEventListener('input', function () { out.textContent = range.value + '%'; });
    flex.appendChild(range); flex.appendChild(out);
    row.appendChild(flex);
    row._get = function () { return range.value; };
    row._range = range;
    return row;
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  FORMULATE tab — ABC + 4 Ps
  // ═══════════════════════════════════════════════════════════════════════
  function buildFormulate() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'cbp-ws-intro' },
      'Build a shared, individualized formulation. The <strong>ABC</strong> map shows how appraisals (not events) drive distress; the <strong>4 Ps</strong> map the longitudinal picture. Complete these collaboratively, in the person&rsquo;s own words.'));

    var abc = el('div', { class: 'cbp-card' });
    abc.innerHTML = '<h4>ABC formulation</h4>';
    [['a', 'A — Activating event / trigger', 'e.g. heard a noise at night'],
     ['b', 'B — Belief / appraisal (the meaning)', 'e.g. "They are coming to get me"'],
     ['c', 'C — Consequences (emotion & behavior)', 'e.g. terror; barricaded the door, didn\'t sleep']].forEach(function (x) {
      var d = el('div', { class: 'cbp-field' });
      d.innerHTML = '<label>' + x[1] + '</label>';
      d.appendChild(el('textarea', { 'data-abc': x[0], placeholder: x[2] }));
      abc.appendChild(d);
    });
    panel.appendChild(abc);

    var ps = el('div', { class: 'cbp-card' });
    ps.innerHTML = '<h4>Longitudinal formulation — the 4 Ps</h4>';
    var grid = el('div', { class: 'cbp-4p' });
    [['predisposing', 'Predisposing', 'vulnerabilities: genetics, early adversity, trauma'],
     ['precipitating', 'Precipitating', 'triggers: stressors, substance use, sleep loss'],
     ['perpetuating', 'Perpetuating', 'maintaining: safety behaviors, avoidance, worry, isolation'],
     ['protective', 'Protective', 'strengths: supports, coping, interests, treatment']].forEach(function (x) {
      var d = el('div', { class: 'cbp-field' });
      d.innerHTML = '<label>' + x[1] + ' <span class="cbp-hint">' + x[2] + '</span></label>';
      d.appendChild(el('textarea', { 'data-p': x[0] }));
      grid.appendChild(d);
    });
    ps.appendChild(grid);
    panel.appendChild(ps);

    var actions = el('div', { class: 'cbp-actions' });
    var copy = el('button', { class: 'cbp-btn', type: 'button' }, 'Copy formulation');
    copy.onclick = function () {
      var lines = ['CBTp — COLLABORATIVE FORMULATION', 'Date: ' + dateStamp(), '', 'ABC'];
      lines.push('  A (trigger): ' + (val('[data-abc="a"]', abc) || '-'));
      lines.push('  B (appraisal): ' + (val('[data-abc="b"]', abc) || '-'));
      lines.push('  C (emotion/behavior): ' + (val('[data-abc="c"]', abc) || '-'));
      lines.push('', '4 Ps');
      [['predisposing', 'Predisposing'], ['precipitating', 'Precipitating'], ['perpetuating', 'Perpetuating'], ['protective', 'Protective']].forEach(function (x) {
        lines.push('  ' + x[1] + ': ' + (val('[data-p="' + x[0] + '"]', ps) || '-'));
      });
      copyBtn(lines.join('\n'), copy);
    };
    actions.appendChild(copy);
    panel.appendChild(actions);
    return panel;
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  VOICES tab — beliefs about voices + coping
  // ═══════════════════════════════════════════════════════════════════════
  function buildVoices() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'cbp-ws-intro' },
      'Distress from voices is driven mostly by <strong>beliefs about the voice</strong> (its power, control, and intent), not its content. Assess those beliefs, strengthen coping, and plan gentle belief testing.'));

    var assess = el('div', { class: 'cbp-card' });
    assess.innerHTML = '<h4>Voice assessment</h4>';
    var f = el('div', { class: 'cbp-field' });
    f.innerHTML = '<label>Content / what the voice says</label>';
    f.appendChild(el('textarea', { 'data-v': 'content', placeholder: 'brief description' }));
    assess.appendChild(f);
    var f2 = el('div', { class: 'cbp-field' });
    f2.innerHTML = '<label>Triggers & timing <span class="cbp-hint">when is it worse?</span></label>';
    f2.appendChild(el('textarea', { 'data-v': 'triggers' }));
    assess.appendChild(f2);
    var sPower = slider('Belief: how powerful is the voice? (0–100%)', 60);
    var sControl = slider('Perceived control over the voice (0–100%)', 20);
    var sComply = slider('Pressure to comply (0–100%)', 40);
    [sPower, sControl, sComply].forEach(function (s) { assess.appendChild(s); });
    assess._sliders = { power: sPower, control: sControl, comply: sComply };
    panel.appendChild(assess);

    var cope = el('div', { class: 'cbp-card' });
    cope.innerHTML = '<h4>Coping-strategy enhancement</h4>';
    cope.appendChild(el('p', { class: 'cbp-ws-intro' }, 'Check strategies to try or strengthen, and note what already helps.'));
    var strategies = [
      'Engage in an absorbing activity', 'Refocus / shift attention', 'Listen to music or a podcast',
      'Subvocalization task (humming, counting, reading aloud)', 'Physical exercise / walk',
      'Relaxation or paced breathing', 'Connect with a trusted person', 'Talk back / set limits with the voice',
      'Reduce isolation & structure the day'
    ];
    strategies.forEach(function (s, i) {
      var lab = el('label', { style: 'display:flex;gap:8px;align-items:flex-start;margin:6px 0;font-size:13.5px;' });
      lab.innerHTML = '<input type="checkbox" data-cope="' + i + '" style="margin-top:3px;"> <span>' + esc(s) + '</span>';
      cope.appendChild(lab);
    });
    var note = el('div', { class: 'cbp-field' });
    note.innerHTML = '<label>Belief-testing plan <span class="cbp-hint">e.g. safely resist a low-risk command to test "the voice is all-powerful"</span></label>';
    note.appendChild(el('textarea', { 'data-v': 'test' }));
    cope.appendChild(note);
    panel.appendChild(cope);

    var actions = el('div', { class: 'cbp-actions' });
    var copy = el('button', { class: 'cbp-btn', type: 'button' }, 'Copy voices plan');
    copy.onclick = function () {
      var s = assess._sliders;
      var lines = ['CBTp — WORKING WITH VOICES', 'Date: ' + dateStamp(), ''];
      lines.push('Content: ' + (val('[data-v="content"]', assess) || '-'));
      lines.push('Triggers/timing: ' + (val('[data-v="triggers"]', assess) || '-'));
      lines.push('Beliefs about the voice — power ' + s.power._get() + '%, control ' + s.control._get() + '%, pressure to comply ' + s.comply._get() + '%');
      lines.push('', 'COPING STRATEGIES');
      strategies.forEach(function (st, i) { lines.push('  [' + (cope.querySelector('[data-cope="' + i + '"]').checked ? 'x' : ' ') + '] ' + st); });
      lines.push('', 'Belief-testing plan: ' + (val('[data-v="test"]', cope) || '-'));
      copyBtn(lines.join('\n'), copy);
    };
    actions.appendChild(copy);
    panel.appendChild(actions);
    return panel;
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  BELIEFS tab — delusion work: conviction, evidence, alternatives, experiment
  // ═══════════════════════════════════════════════════════════════════════
  function buildBeliefs() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'cbp-ws-intro' },
      'Work with a distressing belief collaboratively and curiously &mdash; never as a debate. Rate conviction, examine evidence gently, generate alternatives, and design a behavioral experiment to test a specific prediction.'));

    var card = el('div', { class: 'cbp-card' });
    card.innerHTML = '<h4>The belief</h4>';
    var bf = el('div', { class: 'cbp-field' });
    bf.innerHTML = '<label>Belief (in the person\'s words)</label>';
    bf.appendChild(el('textarea', { 'data-b': 'belief', placeholder: 'e.g. "My neighbor is monitoring me through the TV"' }));
    card.appendChild(bf);
    var sConv = slider('Conviction (0–100%)', 80);
    var sDistress = slider('Distress it causes (0–100%)', 70);
    card.appendChild(sConv); card.appendChild(sDistress);
    panel.appendChild(card);

    var ev = el('div', { class: 'cbp-card' });
    ev.innerHTML = '<h4>Examine the evidence</h4>';
    var evt = buildTable([
      { key: 'for', label: 'Evidence FOR the belief', type: 'textarea' },
      { key: 'against', label: 'Evidence AGAINST / other explanations', type: 'textarea' }
    ]);
    ev.appendChild(evt);
    panel.appendChild(ev);

    var alt = el('div', { class: 'cbp-card' });
    alt.innerHTML = '<h4>Alternative explanation & behavioral experiment</h4>';
    var af = el('div', { class: 'cbp-field' });
    af.innerHTML = '<label>Possible alternative explanation</label>';
    af.appendChild(el('textarea', { 'data-b': 'alt', placeholder: 'A less threatening account that also fits the facts' }));
    alt.appendChild(af);
    [['prediction', 'Experiment: prediction to test', 'e.g. "If I unplug the TV, they will still know my movements"'],
     ['experiment', 'What we will do', 'e.g. unplug TV for a day; track any evidence of monitoring'],
     ['outcome', 'Result & what it suggests', 'complete after the experiment']].forEach(function (x) {
      var d = el('div', { class: 'cbp-field' });
      d.innerHTML = '<label>' + x[1] + '</label>';
      d.appendChild(el('textarea', { 'data-b': x[0], placeholder: x[2] }));
      alt.appendChild(d);
    });
    panel.appendChild(alt);

    var actions = el('div', { class: 'cbp-actions' });
    var copy = el('button', { class: 'cbp-btn', type: 'button' }, 'Copy belief work');
    copy.onclick = function () {
      var lines = ['CBTp — WORKING WITH A BELIEF', 'Date: ' + dateStamp(), ''];
      lines.push('Belief: ' + (val('[data-b="belief"]', card) || '-'));
      lines.push('Conviction: ' + sConv._get() + '%  |  Distress: ' + sDistress._get() + '%');
      lines.push('', 'EVIDENCE');
      evt._readRows().forEach(function (r) { lines.push('  FOR: ' + (r.for || '-') + '  ||  AGAINST: ' + (r.against || '-')); });
      lines.push('', 'Alternative explanation: ' + (val('[data-b="alt"]', alt) || '-'));
      lines.push('Experiment prediction: ' + (val('[data-b="prediction"]', alt) || '-'));
      lines.push('What we will do: ' + (val('[data-b="experiment"]', alt) || '-'));
      lines.push('Result: ' + (val('[data-b="outcome"]', alt) || '-'));
      copyBtn(lines.join('\n'), copy);
    };
    actions.appendChild(copy);
    panel.appendChild(actions);
    return panel;
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  GOALS tab — functioning / negative symptoms: SMART + GAS
  // ═══════════════════════════════════════════════════════════════════════
  function buildGoals() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'cbp-ws-intro' },
      'For negative symptoms and functioning, set valued, achievable goals and schedule graded activity. Watch for defeatist beliefs (&ldquo;there&rsquo;s no point&rdquo;) that maintain withdrawal. Scale goals with GAS.'));

    var smart = el('div', { class: 'cbp-card' });
    smart.appendChild(el('h4', null, 'Valued functioning goal (SMART)'));
    var fields = [
      ['specific', 'Specific', 'What will the person do?', 'e.g. Attend a peer group'],
      ['measurable', 'Measurable', 'How will you know?', 'e.g. once this week'],
      ['achievable', 'Achievable', 'Graded to current capacity?', 'e.g. go for 20 min with support'],
      ['relevant', 'Relevant / valued', 'Why it matters to them', 'e.g. connection, less isolation'],
      ['timebound', 'Time-bound', 'By when', 'e.g. by next session']
    ];
    fields.forEach(function (x) {
      var d = el('div', { class: 'cbp-field' });
      d.innerHTML = '<label>' + x[1] + ' <span class="cbp-hint">' + x[2] + '</span></label>';
      d.appendChild(el('input', { type: 'text', 'data-smart': x[0], placeholder: x[3] }));
      smart.appendChild(d);
    });
    var defeat = el('div', { class: 'cbp-field' });
    defeat.innerHTML = '<label>Defeatist belief to address <span class="cbp-hint">and a more helpful alternative</span></label>';
    defeat.appendChild(el('textarea', { 'data-smart': 'defeat', placeholder: 'e.g. "I\'ll fail" → "I can try one small step with support"' }));
    smart.appendChild(defeat);
    var preview = el('div', { class: 'cbp-preview' });
    smart.appendChild(preview);
    smart.addEventListener('input', function () {
      var g = {};
      smart.querySelectorAll('[data-smart]').forEach(function (i) { g[i.getAttribute('data-smart')] = i.value.trim(); });
      if (!g.specific && !g.measurable) { preview.innerHTML = ''; return; }
      preview.innerHTML = '<strong>Goal:</strong> ' + esc(g.specific || '…') +
        (g.measurable ? ' — ' + esc(g.measurable) : '') +
        (g.timebound ? ', ' + esc(g.timebound) : '') +
        (g.relevant ? '. <em>Value: ' + esc(g.relevant) + '.</em>' : '.');
    });
    panel.appendChild(smart);

    var gas = el('div', { class: 'cbp-card' });
    gas.appendChild(el('h4', null, 'Goal Attainment Scaling (GAS)'));
    var gnf = el('div', { class: 'cbp-field' });
    gnf.innerHTML = '<label>Goal name</label>';
    gnf.appendChild(el('input', { type: 'text', 'data-gas': 'name', placeholder: 'e.g. Increase social participation' }));
    gas.appendChild(gnf);
    var levels = [
      ['-2', 'Much less than expected', 'cbp-gas--2'],
      ['-1', 'Somewhat less than expected', 'cbp-gas--1'],
      ['0', 'Expected outcome', 'cbp-gas-0'],
      ['+1', 'Somewhat more than expected', 'cbp-gas-1'],
      ['+2', 'Much more than expected', 'cbp-gas-2']
    ];
    levels.forEach(function (lv) {
      var row = el('div', { class: 'cbp-gas-level' });
      row.appendChild(el('span', { class: 'cbp-gas-tag ' + lv[2] }, lv[0] + '<br>' + lv[1]));
      var inp = el('input', { type: 'text', 'data-gas-level': lv[0], placeholder: 'Describe this outcome level' });
      inp.style.cssText = 'width:100%;box-sizing:border-box;padding:8px 10px;border:1px solid var(--border);border-radius:6px;background:#fdfcf9;';
      row.appendChild(inp);
      gas.appendChild(row);
    });
    var curField = el('div', { class: 'cbp-field' });
    curField.innerHTML = '<label>Current attainment level</label>';
    var curSel = el('select', { 'data-gas': 'current' });
    ['-2', '-1', '0', '+1', '+2'].forEach(function (v) { curSel.appendChild(el('option', { value: v }, v)); });
    curSel.value = '-2';
    curField.appendChild(curSel);
    gas.appendChild(curField);
    var tOut = el('div', { class: 'cbp-readout' });
    gas.appendChild(tOut);
    function updateT() {
      var x = parseInt(curSel.value, 10);
      var rho = 0.3;
      var T = 50 + (10 * x) / Math.sqrt((1 - rho) + rho);
      tOut.innerHTML = '<span class="cbp-stat"><b>' + Math.round(T) + '</b>GAS T-score</span>' +
        '<span class="cbp-stat"><b>' + curSel.value + '</b>current level</span>' +
        '<span class="cbp-stat" style="font-size:12px;color:#7a7364;">T=50 is the expected outcome; &gt;50 exceeds expectation.</span>';
    }
    curSel.addEventListener('change', updateT);
    updateT();
    panel.appendChild(gas);

    var actions = el('div', { class: 'cbp-actions' });
    var copy = el('button', { class: 'cbp-btn', type: 'button' }, 'Copy goal plan');
    copy.onclick = function () {
      var g = {};
      smart.querySelectorAll('[data-smart]').forEach(function (i) { g[i.getAttribute('data-smart')] = i.value.trim(); });
      var lines = ['CBTp — FUNCTIONING GOAL', 'Date: ' + dateStamp(), '', 'SMART GOAL'];
      fields.forEach(function (x) { lines.push('  ' + x[1] + ': ' + (g[x[0]] || '-')); });
      lines.push('  Defeatist belief → alternative: ' + (g.defeat || '-'));
      lines.push('', 'GOAL ATTAINMENT SCALING — ' + (val('[data-gas="name"]', gas) || '(goal)'));
      levels.forEach(function (lv) { lines.push('  ' + lv[0] + ' (' + lv[1] + '): ' + (val('[data-gas-level="' + lv[0] + '"]', gas) || '-')); });
      lines.push('  Current level: ' + curSel.value);
      copyBtn(lines.join('\n'), copy);
    };
    actions.appendChild(copy);
    panel.appendChild(actions);
    return panel;
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  OUTCOMES & STAYING WELL tab
  // ═══════════════════════════════════════════════════════════════════════
  function buildOutcomes() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'cbp-ws-intro' },
      'Track distress/conviction over time and build a written staying-well / crisis plan. Coordinate medication decisions with the prescriber.'));

    var track = el('div', { class: 'cbp-card' });
    track.innerHTML = '<h4>Distress / conviction tracker</h4>';
    track.appendChild(el('p', { class: 'cbp-ws-intro' }, 'Log a target rating (0&ndash;100) per session &mdash; e.g., distress from voices, or conviction in a belief. Change from baseline shown automatically.'));
    var st = buildTable([
      { key: 'date', label: 'Session date', type: 'date', width: '150px' },
      { key: 'target', label: 'What is rated', type: 'text', ph: 'e.g. voice distress' },
      { key: 'score', label: 'Rating 0-100', type: 'num', width: '100px' }
    ]);
    track.appendChild(st);
    var trend = el('ul', { class: 'cbp-progress-list' });
    track.appendChild(trend);
    function refreshTrend() {
      var rows = st._readRows().filter(function (r) { return r.score !== '' && !isNaN(parseFloat(r.score)); });
      trend.innerHTML = '';
      if (!rows.length) return;
      var base = parseFloat(rows[0].score);
      rows.forEach(function (r, i) {
        var v = parseFloat(r.score); var d = v - base;
        var deltaHtml = i === 0 ? '<span class="cbp-hint">baseline</span>' :
          (d <= 0 ? '<span class="cbp-delta-up">' + d + ' from baseline</span>' : '<span class="cbp-delta-down">+' + d + ' from baseline</span>');
        var li = el('li');
        li.innerHTML = '<span>' + esc(r.date || ('Session ' + (i + 1))) + ' — ' + esc(r.target || '') + ' ' + v + '</span>' + deltaHtml;
        trend.appendChild(li);
      });
    }
    track.addEventListener('input', refreshTrend);
    track.addEventListener('click', function (e) { if (/Add row/.test(e.target.textContent) || e.target.classList.contains('cbp-row-del')) setTimeout(refreshTrend, 0); });
    panel.appendChild(track);

    var plan = el('div', { class: 'cbp-card' });
    plan.innerHTML = '<h4>Staying-well / crisis plan</h4>';
    [['signs', 'Early warning signs', 'e.g. sleeping less, more suspicious, withdrawing'],
     ['coping', 'Coping strategies that help', 'e.g. routine, coping cards, contact key worker'],
     ['supports', 'Supports & contacts', 'trusted people, clinician, crisis line'],
     ['meds', 'Medication plan / shared decisions', 'coordinate with prescriber'],
     ['ifthen', 'If things worsen, then…', 'agreed steps and who to call']].forEach(function (x) {
      var d = el('div', { class: 'cbp-field' });
      d.innerHTML = '<label>' + x[1] + ' <span class="cbp-hint">' + x[2] + '</span></label>';
      d.appendChild(el('textarea', { 'data-plan': x[0] }));
      plan.appendChild(d);
    });
    panel.appendChild(plan);
    panel.appendChild(el('div', { class: 'cbp-callout cbp-warn' },
      '<span class="cbp-callout-title">Risk</span>If there is risk to self or others (e.g., command hallucinations or persecutory beliefs driving action), prioritize a full risk assessment and safety plan and coordinate with the treating team.'));

    var actions = el('div', { class: 'cbp-actions' });
    var copy = el('button', { class: 'cbp-btn', type: 'button' }, 'Copy outcomes + staying-well plan');
    copy.onclick = function () {
      var lines = ['CBTp — OUTCOMES & STAYING WELL', 'Date: ' + dateStamp(), '', 'TRACKER'];
      var rows = st._readRows().filter(function (r) { return r.score; });
      if (rows.length) {
        var base = parseFloat(rows[0].score);
        rows.forEach(function (r, i) {
          var d = parseFloat(r.score) - base;
          lines.push('  ' + (r.date || ('Session ' + (i + 1))) + ': ' + (r.target || '') + ' ' + r.score + (i === 0 ? ' (baseline)' : ' (' + (d <= 0 ? '' : '+') + d + ')'));
        });
      } else { lines.push('  (no data)'); }
      lines.push('', 'STAYING-WELL / CRISIS PLAN');
      [['signs', 'Early warning signs'], ['coping', 'Coping strategies'], ['supports', 'Supports & contacts'], ['meds', 'Medication plan'], ['ifthen', 'If worsens, then']].forEach(function (x) {
        lines.push('  ' + x[1] + ': ' + (val('[data-plan="' + x[0] + '"]', plan) || '-'));
      });
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
    { id: 'formulate', label: 'Formulate', build: buildFormulate },
    { id: 'voices', label: 'Voices', build: buildVoices },
    { id: 'beliefs', label: 'Beliefs', build: buildBeliefs },
    { id: 'goals', label: 'Goals', build: buildGoals },
    { id: 'outcomes', label: 'Outcomes & Staying Well', build: buildOutcomes }
  ];

  var meta = el('div', { class: 'cbp-meta' });
  meta.innerHTML =
    '<span class="cbp-chip cbp-chip-accent">Module 6 of 7</span>' +
    '<span class="cbp-chip">CBTp</span>' +
    '<span class="cbp-chip">Schizophrenia / Psychosis</span>' +
    '<span class="cbp-chip">Collaborative &amp; normalizing</span>' +
    '<span class="cbp-chip">Trainee / advanced student</span>' +
    '<span class="cbp-chip">~5&ndash;7 contact hours</span>';
  root.appendChild(meta);

  var tabBar = el('div', { class: 'cbp-tabs' });
  var panels = el('div');
  TABS.forEach(function (t, i) {
    var btn = el('button', { class: 'cbp-tab' + (i === 0 ? ' cbp-active' : ''), type: 'button' }, t.label);
    var panel = el('div', { class: 'cbp-panel' + (i === 0 ? ' cbp-active' : '') });
    var built = false;
    function activate() {
      tabBar.querySelectorAll('.cbp-tab').forEach(function (b) { b.classList.remove('cbp-active'); });
      panels.querySelectorAll('.cbp-panel').forEach(function (p) { p.classList.remove('cbp-active'); });
      btn.classList.add('cbp-active');
      panel.classList.add('cbp-active');
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
    if (idx > -1) tabBar.querySelectorAll('.cbp-tab')[idx].click();
  }
})();

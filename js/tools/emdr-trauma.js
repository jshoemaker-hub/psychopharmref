/* ═══════════════════════════════════════════════════════════════════════
   emdr-trauma.js — Course module 8
   "EMDR Therapy for Trauma & PTSD: A How-To"
   Audience: trainees & advanced students (adjunct to formal EMDR training).
   Builds a tabbed module into #emdr-root. Uses ToolUtils for clipboard/date/reset.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var root = document.getElementById('emdr-root');
  if (!root || root.dataset.emdrBuilt) return;
  root.dataset.emdrBuilt = '1';

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

  // ── Standard negative / positive cognition lists (Shapiro), grouped ─────
  var COG_GROUPS = [
    { theme: 'Responsibility / Defectiveness', pairs: [
      ['I am not good enough', 'I am good enough as I am'],
      ['I am a bad person', 'I am a good / loving person'],
      ['I am worthless / inadequate', 'I am worthy; I am significant'],
      ['I am not lovable', 'I am lovable'],
      ['I am shameful', 'I am fine / honorable as I am'],
      ['I deserve only bad things', 'I deserve good things'],
      ['I did something wrong', 'I did the best I could / I learned from it'],
      ['I should have done something', 'I did the best I could'],
      ['I cannot be trusted', 'I can be trusted']
    ]},
    { theme: 'Safety / Vulnerability', pairs: [
      ['I am in danger', 'It is over; I am safe now'],
      ['I cannot trust anyone', 'I can choose whom to trust'],
      ['I cannot protect myself', 'I can (learn to) protect myself'],
      ['I am going to die', 'I survived; I can handle it']
    ]},
    { theme: 'Control / Choice', pairs: [
      ['I am powerless / helpless', 'I now have choices'],
      ['I am not in control', 'I am now in control'],
      ['I cannot get what I want', 'I can get what I want'],
      ['I cannot stand it', 'I can handle it'],
      ['I cannot trust myself', 'I can trust myself'],
      ['I cannot succeed', 'I can succeed'],
      ['I have to be perfect / please everyone', 'I can be myself / make mistakes']
    ]}
  ];
  function cogSelect(kind) { // kind: 'nc' or 'pc'
    var sel = el('select');
    sel.appendChild(el('option', { value: '' }, kind === 'nc' ? '— choose negative cognition —' : '— choose positive cognition —'));
    COG_GROUPS.forEach(function (g) {
      var og = el('optgroup', { label: g.theme });
      g.pairs.forEach(function (p) {
        var t = kind === 'nc' ? p[0] : p[1];
        og.appendChild(el('option', { value: t }, esc(t)));
      });
      sel.appendChild(og);
    });
    sel.appendChild(el('option', { value: '__custom__' }, 'Other / write my own…'));
    return sel;
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  DIDACTIC CONTENT (Learn tab)
  // ═══════════════════════════════════════════════════════════════════════
  var LEARN_HTML =
    '<div class="emdr-learn">' +
      '<p class="emdr-lead">Eye Movement Desensitization and Reprocessing (EMDR) is a structured, eight-phase, trauma-focused psychotherapy in which the client attends to a disturbing memory while simultaneously engaging in bilateral (dual-attention) stimulation &mdash; classically side-to-side eye movements. Across the phases the memory is accessed, processed, and linked to more adaptive information, so that it is stored in a less distressing, non-triggering form. This module teaches how the protocol is actually delivered; it is an adjunct to, not a substitute for, formal EMDR training and consultation.</p>' +

      '<div class="emdr-callout emdr-warn"><span class="emdr-callout-title">Training &amp; scope</span>EMDR is delivered from an approved training curriculum (e.g., EMDRIA-approved) with consultation. Reprocessing can surface intense affect and abreaction. Do not begin reprocessing (Phases 3&ndash;6) until stabilization and dual-attention resources are in place, and always screen for dissociation before proceeding.</div>' +

      '<h3>1. The model: Adaptive Information Processing (AIP)</h3>' +
      '<p>EMDR rests on Shapiro&rsquo;s <strong>Adaptive Information Processing</strong> model, which proposes that psychological distress arises from memories that were stored in a dysfunctional, state-dependent form &mdash; frozen with the original images, negative beliefs, emotions, and body sensations. The brain has an innate system for processing experience toward an adaptive resolution; trauma can overwhelm it, leaving the memory unintegrated. EMDR is theorized to reactivate that processing system so the memory can link to adaptive networks. Whether or not one accepts AIP as a mechanism, it is the clinical map the protocol follows.</p>' +

      '<h3>2. What the evidence shows (and the mechanism debate)</h3>' +
      '<p>EMDR is an <strong>evidence-based, guideline-recommended</strong> treatment for PTSD. It is recommended for PTSD in adults by the <strong>VA/DoD Clinical Practice Guideline</strong> (2023, alongside Prolonged Exposure and Cognitive Processing Therapy), the <strong>World Health Organization</strong>, <strong>NICE</strong>, and the <strong>ISTSS</strong> guidelines. Meta-analyses show large effect sizes for PTSD symptom reduction, broadly comparable to trauma-focused CBT.</p>' +
      '<div class="emdr-callout emdr-tip"><span class="emdr-callout-title">Be honest about mechanism</span>The <em>efficacy</em> of EMDR for PTSD is well supported. The <em>mechanism</em> is debated. Component (&ldquo;dismantling&rdquo;) studies have questioned whether the eye movements add benefit beyond the exposure and cognitive elements; some meta-analyses find eye movements do contribute (most consistent with a <strong>working-memory taxation</strong> account &mdash; holding the memory while performing a demanding dual task reduces its vividness and emotionality), while critics argue the specific bilateral stimulation is inert and EMDR &ldquo;works&rdquo; through imaginal exposure. A clinically honest stance: recommend EMDR as an effective PTSD treatment, while acknowledging the active-ingredient question is not fully settled.</div>' +
      '<p>Some professional guidelines (e.g., the APA clinical practice guideline) have rated the EMDR evidence base more conservatively than trauma-focused CBT, a point of ongoing debate in the field. Present EMDR to clients as one of several strongly supported trauma-focused options.</p>' +

      '<h3>3. The eight phases at a glance</h3>' +
      '<ol class="emdr-phases">' +
        '<li><strong>Phase 1 &mdash; History &amp; treatment planning.</strong> Take a history, assess suitability and dissociation, and build the <em>target sequence</em>: the past events, present triggers, and future templates to be processed (the three prongs).</li>' +
        '<li><strong>Phase 2 &mdash; Preparation.</strong> Explain the model and mechanics, set expectations, and install stabilization/affect-regulation resources (Calm/Safe Place, Container, resource development). Establish the stop signal and confirm the client can use dual attention and return to baseline.</li>' +
        '<li><strong>Phase 3 &mdash; Assessment.</strong> Activate the target: select the image, the <strong>Negative Cognition (NC)</strong> and desired <strong>Positive Cognition (PC)</strong>, rate the PC on the <strong>VOC</strong> (Validity of Cognition, 1&ndash;7), name the emotion, rate the <strong>SUDS</strong> (Subjective Units of Disturbance, 0&ndash;10), and locate the body sensation.</li>' +
        '<li><strong>Phase 4 &mdash; Desensitization.</strong> Hold the image + NC + body sensation while delivering sets of bilateral stimulation; after each set the client briefly notices &ldquo;what comes up&rdquo; and follows the associative chain. Continue until SUDS drops toward 0.</li>' +
        '<li><strong>Phase 5 &mdash; Installation.</strong> Pair the target with the Positive Cognition and strengthen it with BLS until the VOC approaches 7.</li>' +
        '<li><strong>Phase 6 &mdash; Body scan.</strong> With the memory and PC in mind, scan the body for residual tension or sensation and process any that remains until the scan is clear.</li>' +
        '<li><strong>Phase 7 &mdash; Closure.</strong> Return the client to equilibrium at the end of every session (complete or incomplete), using containment/calm-place resources; brief on between-session effects and logging (TICES/log).</li>' +
        '<li><strong>Phase 8 &mdash; Reevaluation.</strong> At the next session, recheck the previous target (SUDS/VOC), review the log, and decide what to process next in the plan.</li>' +
      '</ol>' +

      '<h3>4. Phase 1 &mdash; History, screening &amp; target sequence</h3>' +
      '<p>Beyond a standard history, three tasks matter: (a) confirm <strong>readiness &amp; stability</strong> (adequate affect tolerance, safety, support, and no untreated conditions that contraindicate reprocessing right now); (b) <strong>screen for dissociation</strong> (e.g., DES-II; consider a structured interview if elevated) &mdash; complex dissociative presentations need a phase-oriented approach and often modified pacing; and (c) build the <strong>three-pronged target sequence</strong>: the formative <em>past</em> events (touchstone memories), the <em>present</em> triggers that still activate distress, and the <em>future</em> templates for adaptive action. The <em>Plan</em> tab operationalizes this, including the floatback/affect-bridge technique for finding touchstone memories.</p>' +

      '<h3>5. Phase 2 &mdash; Preparation &amp; resourcing</h3>' +
      '<p>Preparation makes reprocessing safe and tolerable. Cover the mechanics and metaphors (e.g., &ldquo;just notice, like watching scenery go by on a train&rdquo;), agree a <strong>stop signal</strong>, and install resources:</p>' +
      '<ul>' +
        '<li><strong>Calm/Safe Place</strong> &mdash; a vivid, self-generated soothing image enhanced with a cue word and a few sets of <em>slow, short</em> BLS; used for closure and affect regulation. (Some clients prefer &ldquo;calm&rdquo; to &ldquo;safe.&rdquo;)</li>' +
        '<li><strong>Container</strong> &mdash; an imagined vessel for putting away disturbing material between sessions.</li>' +
        '<li><strong>Resource Development &amp; Installation (RDI)</strong> &mdash; strengthening mastery, relational, and symbolic resources for clients who need more stabilization before trauma processing.</li>' +
      '</ul>' +
      '<div class="emdr-callout emdr-tip"><span class="emdr-callout-title">Slow vs. fast BLS</span>Use <em>short, slow</em> sets when installing calming resources; use <em>longer, faster</em> sets during desensitization. If BLS during a calm-place exercise brings up disturbance, that resource may be contaminated &mdash; choose another.</div>' +

      '<h3>6. Phase 3 &mdash; Assessment (activating the target)</h3>' +
      '<p>Fully access one target before reprocessing it. The standard elicitation:</p>' +
      '<dl class="emdr-acr">' +
        '<dt>Image</dt><dd>&ldquo;What picture represents the worst part of the incident?&rdquo;</dd>' +
        '<dt>Negative Cognition (NC)</dt><dd>a present-tense, irrational, self-referencing belief that goes with the image (&ldquo;I am&hellip;&rdquo;)</dd>' +
        '<dt>Positive Cognition (PC)</dt><dd>the desired adaptive belief in the same theme</dd>' +
        '<dt>VOC 1&ndash;7</dt><dd>how true the PC <em>feels</em> now (1 = completely false, 7 = completely true)</dd>' +
        '<dt>Emotion</dt><dd>&ldquo;When you bring up that image and those words, what emotion do you feel now?&rdquo;</dd>' +
        '<dt>SUDS 0&ndash;10</dt><dd>current level of disturbance (0 = neutral/calm, 10 = worst imaginable)</dd>' +
        '<dt>Body location</dt><dd>&ldquo;Where do you feel it in your body?&rdquo;</dd>' +
      '</dl>' +
      '<p>The NC and PC should share a theme (responsibility, safety, or control/choice) and be well matched. The <em>Assess</em> tab includes the standard cognition menus. Keep the PC realistic and self-referencing; avoid PCs that require another person to change.</p>' +

      '<h3>7. Phases 4&ndash;6 &mdash; Desensitization, installation, body scan</h3>' +
      '<ol>' +
        '<li><strong>Desensitize:</strong> hold image + NC + body sensation; run a set of BLS (~24&ndash;30 passes to start, adjusted to the client). Then: &ldquo;Take a breath. What do you notice now?&rdquo; Follow wherever it goes for the next set (the associative chain). Periodically return to target and re-rate SUDS. Use <strong>cognitive interweaves</strong> (a proactive question or statement) when processing loops or stalls (blocked processing) &mdash; e.g., responsibility (&ldquo;Whose fault was it?&rdquo;), safety (&ldquo;Are you safe now?&rdquo;), or choice (&ldquo;Do you have choices now?&rdquo;).</li>' +
        '<li><strong>Install:</strong> when SUDS is 0 (or ecologically valid), check the PC still fits, then hold target + PC and run BLS to raise VOC toward 7.</li>' +
        '<li><strong>Body scan:</strong> hold memory + PC, mentally scan head-to-toe; reprocess any residual sensation until the scan is clear.</li>' +
      '</ol>' +
      '<div class="emdr-callout emdr-tip"><span class="emdr-callout-title">Reading the process</span>Between sets, say little and stay out of the way &mdash; brief prompts (&ldquo;Notice that,&rdquo; &ldquo;Go with that&rdquo;) keep processing moving. Interweaves are for when it stalls, not a running commentary.</div>' +

      '<h3>8. Phases 7&ndash;8 &mdash; Closure &amp; reevaluation</h3>' +
      '<p>End <em>every</em> session with the client stable, whether the target is complete or not. For an <strong>incomplete</strong> target: no closing suggestions of resolution; use the Container and Calm/Safe Place, and normalize continued processing between sessions. Give the log/journaling instruction (record disturbances using TICES: Trigger, Image, Cognition, Emotion, Sensation). At the next session (<strong>reevaluation</strong>): re-access the prior target, recheck SUDS/VOC, review the log, and choose the next target from the plan.</p>' +

      '<h3>9. The three-pronged protocol</h3>' +
      '<p>Complete treatment processes all three prongs: <strong>past</strong> (the memories that set the pattern), <strong>present</strong> (current triggers, reprocessed as they arise), and <strong>future</strong> (a <em>future template</em> &mdash; the client imagines handling an anticipated situation with the PC and adaptive behavior, strengthened with BLS). Skipping the present and future prongs is a common reason gains do not generalize.</p>' +

      '<h3>10. Adaptations &amp; cautions</h3>' +
      '<ul>' +
        '<li><strong>Complex/dissociative trauma:</strong> extend Phase 2, use a phase-oriented (stabilization-first) approach, titrate processing, and consider modified protocols.</li>' +
        '<li><strong>Children &amp; adolescents:</strong> use developmentally adapted scripts, shorter sets, tactile/auditory BLS, drawing, and caregiver involvement.</li>' +
        '<li><strong>Recent traumatic events:</strong> specific early-intervention protocols (e.g., R-TEP/EMD) exist for acute presentations.</li>' +
        '<li><strong>Bilateral stimulation modality:</strong> eye movements, alternating tactile (taps/buzzers), or auditory tones; choose what the client tolerates and can follow.</li>' +
        '<li><strong>Comorbidity &amp; safety:</strong> address active suicidality, unstable substance use, and current danger before reprocessing; coordinate with the treating team and medication plan.</li>' +
      '</ul>' +

      '<h3>Key references</h3>' +
      '<ul class="emdr-refs">' +
        '<li>Shapiro, F. (2018). <em>Eye Movement Desensitization and Reprocessing (EMDR) Therapy: Basic Principles, Protocols, and Procedures</em> (3rd ed.). Guilford Press.</li>' +
        '<li>Department of Veterans Affairs &amp; Department of Defense (2023). <em>VA/DoD Clinical Practice Guideline for the Management of PTSD and Acute Stress Disorder.</em></li>' +
        '<li>World Health Organization (2013). <em>Guidelines for the Management of Conditions Specifically Related to Stress.</em></li>' +
        '<li>National Institute for Health and Care Excellence (NICE, 2018). <em>Post-traumatic stress disorder</em> [NG116].</li>' +
        '<li>Lee, C. W., &amp; Cuijpers, P. (2013). A meta-analysis of the contribution of eye movements in processing emotional memories. <em>Journal of Behavior Therapy and Experimental Psychiatry.</em></li>' +
        '<li>Landin-Romero, R., et al. (2018). How does EMDR work? Working-memory and neurobiological accounts. <em>Frontiers in Psychology.</em></li>' +
      '</ul>' +
      '<p class="emdr-disc-inline">Educational content for supervised skill development. The interactive worksheets below are teaching aids, not validated instruments, and do not replace EMDR training, consultation, or clinical judgment.</p>' +
    '</div>';

  // ═══════════════════════════════════════════════════════════════════════
  //  Reusable dynamic table (SUDS 0-10 / VOC 1-7 aware)
  // ═══════════════════════════════════════════════════════════════════════
  function buildTable(cols, opts) {
    opts = opts || {};
    var wrap = el('div');
    var table = el('table', { class: 'emdr-table' });
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
        input = el('input', { type: 'number', min: '0', max: '10', step: '1', class: 'emdr-num', placeholder: '0-10' });
      } else if (c.type === 'voc') {
        input = el('input', { type: 'number', min: '1', max: '7', step: '1', class: 'emdr-num', placeholder: '1-7' });
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
      var del = el('button', { class: 'emdr-row-del', title: 'Remove row', type: 'button' }, '&times;');
      del.onclick = function () { tr.remove(); };
      delTd.appendChild(del);
      tr.appendChild(delTd);
      tbody.appendChild(tr);
      return tr;
    }
    (opts.starter || []).forEach(addRow);
    if (!opts.starter) addRow();

    var addBtn = el('button', { class: 'emdr-btn emdr-btn-ghost emdr-btn-sm', type: 'button' }, '+ Add row');
    addBtn.onclick = function () { addRow(); };
    var actWrap = el('div', { class: 'emdr-actions' });
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

  function sudsLegend() {
    return el('div', { class: 'emdr-scale-legend' }, '<span><b>SUDS 0&ndash;10</b> (disturbance):</span>' +
      '<span class="emdr-band emdr-band-low">0 neutral/calm</span>' +
      '<span class="emdr-band emdr-band-mod">4&ndash;6 moderate</span>' +
      '<span class="emdr-band emdr-band-high">10 worst imaginable</span>' +
      '<span style="margin-left:10px;"><b>VOC 1&ndash;7</b> (how true the positive belief feels): 1 false &rarr; 7 completely true</span>');
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  PREPARE tab — Phase 2 stabilization & resourcing
  // ═══════════════════════════════════════════════════════════════════════
  function buildPrepare() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'emdr-ws-intro' },
      'Phase 2 worksheet. Install affect-regulation resources and confirm readiness <em>before</em> any reprocessing. Enhance each resource with short, slow sets of bilateral stimulation; if BLS brings up disturbance, choose a different resource.'));

    // Readiness checklist
    var rc = el('div', { class: 'emdr-card' });
    rc.innerHTML = '<h4>Readiness &amp; dissociation screen</h4>';
    var checks = [
      'Rapport &amp; informed consent for EMDR obtained',
      'Model, mechanics &amp; metaphor explained ("just notice")',
      'Stop signal agreed and practiced',
      'Dual attention tested (client can hold an image while doing BLS and return to now)',
      'Affect tolerance adequate; client can down-regulate',
      'Dissociation screened (e.g., DES-II); complex/dissociative presentation flagged',
      'Current safety: no active suicidality / unmanaged substance use / ongoing danger',
      'Support system &amp; between-session coping in place'
    ];
    var clWrap = el('div', { class: 'emdr-checklist' });
    checks.forEach(function (c) {
      var id = 'emdr-rc-' + Math.random().toString(36).slice(2, 8);
      var row = el('label', { class: 'emdr-check-row', 'for': id });
      row.appendChild(el('input', { type: 'checkbox', id: id, 'data-check': c }));
      row.appendChild(el('span', { html: c }));
      clWrap.appendChild(row);
    });
    rc.appendChild(clWrap);
    panel.appendChild(rc);

    // Calm/Safe place
    var cp = el('div', { class: 'emdr-card' });
    cp.innerHTML = '<h4>Calm / Safe Place</h4>';
    [
      ['image', 'Image / place (real or imagined)', 'Where the client feels calm and safe'],
      ['sensations', 'Sights, sounds, smells, sensations', 'Make it vivid and multisensory'],
      ['emotion', 'Emotion &amp; where it is felt in the body', 'e.g. calm, warmth in the chest'],
      ['cue', 'Cue word', 'A single word that brings the place to mind'],
      ['disturb', 'Any disturbance that arose with BLS?', 'If yes, pick another resource']
    ].forEach(function (f) {
      var d = el('div', { class: 'emdr-field' });
      d.innerHTML = '<label>' + f[1] + ' <span class="emdr-hint">' + f[2] + '</span></label>';
      d.appendChild(el('input', { type: 'text', 'data-calm': f[0], placeholder: f[2] }));
      cp.appendChild(d);
    });
    panel.appendChild(cp);

    // Container
    var cont = el('div', { class: 'emdr-card' });
    cont.innerHTML = '<h4>Container</h4>';
    [
      ['vessel', 'The container (what it looks like, how it seals)', 'e.g. a vault, a box with a lid'],
      ['use', 'What will be placed in it between sessions', 'Disturbing images/thoughts to set aside']
    ].forEach(function (f) {
      var d = el('div', { class: 'emdr-field' });
      d.innerHTML = '<label>' + f[1] + ' <span class="emdr-hint">' + f[2] + '</span></label>';
      d.appendChild(el('textarea', { 'data-cont': f[0], placeholder: f[2] }));
      cont.appendChild(d);
    });
    panel.appendChild(cont);

    // RDI
    var rdi = el('div', { class: 'emdr-card' });
    rdi.innerHTML = '<h4>Resource Development &amp; Installation (RDI)</h4>';
    rdi.appendChild(el('p', { class: 'emdr-ws-intro' }, 'For clients who need more stabilization first. Identify mastery, relational, and symbolic resources, then strengthen each with short BLS sets.'));
    var rdiT = buildTable([
      { key: 'resource', label: 'Resource', type: 'text', ph: 'A memory, person, or symbol of strength' },
      { key: 'type', label: 'Type', type: 'select', opts: ['Mastery', 'Relational', 'Symbolic'], width: '120px' },
      { key: 'sensation', label: 'Felt sense / cue word', type: 'text', ph: 'Body sensation + cue word' }
    ]);
    rdi.appendChild(rdiT);
    panel.appendChild(rdi);

    var actions = el('div', { class: 'emdr-actions' });
    var copy = el('button', { class: 'emdr-btn', type: 'button' }, 'Copy preparation notes');
    copy.onclick = function () {
      var lines = ['EMDR — PHASE 2 PREPARATION', 'Date: ' + dateStamp(), '', 'READINESS & SCREEN'];
      clWrap.querySelectorAll('[data-check]').forEach(function (cb) {
        lines.push('  [' + (cb.checked ? 'x' : ' ') + '] ' + cb.getAttribute('data-check').replace(/&amp;/g, '&'));
      });
      lines.push('', 'CALM / SAFE PLACE');
      [['image', 'Image/place'], ['sensations', 'Sensations'], ['emotion', 'Emotion/body'], ['cue', 'Cue word'], ['disturb', 'Disturbance w/ BLS']].forEach(function (f) {
        lines.push('  ' + f[1] + ': ' + (val('[data-calm="' + f[0] + '"]', cp) || '-'));
      });
      lines.push('', 'CONTAINER');
      lines.push('  Vessel: ' + (val('[data-cont="vessel"]', cont) || '-'));
      lines.push('  Contents: ' + (val('[data-cont="use"]', cont) || '-'));
      var rs = rdiT._readRows();
      if (rs.length) {
        lines.push('', 'RESOURCES (RDI)');
        rs.forEach(function (r) { lines.push('  • ' + (r.resource || '-') + ' [' + (r.type || '') + '] — ' + (r.sensation || '-')); });
      }
      copyBtn(lines.join('\n'), copy);
    };
    actions.appendChild(copy);
    panel.appendChild(actions);
    return panel;
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  ASSESS tab — Phase 3 target activation (NC/PC, VOC, SUDS, body)
  // ═══════════════════════════════════════════════════════════════════════
  function buildAssess() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'emdr-ws-intro' },
      'Phase 3 worksheet. Fully activate one target before reprocessing: image, Negative Cognition, desired Positive Cognition (same theme), VOC (1&ndash;7), emotion, SUDS (0&ndash;10), and body location. Use the menus for the standard Shapiro cognitions or write your own.'));
    panel.appendChild(sudsLegend());

    var card = el('div', { class: 'emdr-card' });
    card.appendChild(el('h4', null, 'Target assessment'));

    function fieldRow(label, hint, node) {
      var d = el('div', { class: 'emdr-field' });
      d.innerHTML = '<label>' + label + (hint ? ' <span class="emdr-hint">' + hint + '</span>' : '') + '</label>';
      d.appendChild(node);
      return d;
    }

    var memInput = el('input', { type: 'text', 'data-a': 'memory', placeholder: 'Name/label for this target memory' });
    card.appendChild(fieldRow('Target memory', 'the incident being processed', memInput));

    var imgInput = el('textarea', { 'data-a': 'image', placeholder: 'The picture that represents the worst part' });
    card.appendChild(fieldRow('Image', '&ldquo;What picture represents the worst part?&rdquo;', imgInput));

    // NC select + custom
    var ncSel = cogSelect('nc');
    ncSel.setAttribute('data-a', 'ncsel');
    var ncCustom = el('input', { type: 'text', 'data-a': 'nccustom', placeholder: 'Write the negative cognition (present-tense "I am…")', style: 'display:none;margin-top:6px;' });
    ncSel.addEventListener('change', function () { ncCustom.style.display = ncSel.value === '__custom__' ? 'block' : 'none'; });
    var ncWrap = el('div'); ncWrap.appendChild(ncSel); ncWrap.appendChild(ncCustom);
    card.appendChild(fieldRow('Negative Cognition (NC)', 'irrational, present-tense, self-referencing', ncWrap));

    // PC select + custom
    var pcSel = cogSelect('pc');
    pcSel.setAttribute('data-a', 'pcsel');
    var pcCustom = el('input', { type: 'text', 'data-a': 'pccustom', placeholder: 'Write the positive cognition (adaptive, same theme)', style: 'display:none;margin-top:6px;' });
    pcSel.addEventListener('change', function () { pcCustom.style.display = pcSel.value === '__custom__' ? 'block' : 'none'; });
    var pcWrap = el('div'); pcWrap.appendChild(pcSel); pcWrap.appendChild(pcCustom);
    card.appendChild(fieldRow('Positive Cognition (PC)', 'desired, realistic, self-referencing', pcWrap));

    var vocInput = el('input', { type: 'number', min: '1', max: '7', step: '1', class: 'emdr-num', 'data-a': 'voc', placeholder: '1-7' });
    card.appendChild(fieldRow('VOC (baseline)', 'how true the PC <em>feels</em> now, 1&ndash;7', vocInput));

    var emoInput = el('input', { type: 'text', 'data-a': 'emotion', placeholder: 'e.g. fear, shame, anger' });
    card.appendChild(fieldRow('Emotion', '&ldquo;What emotion do you feel now?&rdquo;', emoInput));

    var sudsInput = el('input', { type: 'number', min: '0', max: '10', step: '1', class: 'emdr-num', 'data-a': 'suds', placeholder: '0-10' });
    card.appendChild(fieldRow('SUDS (baseline)', 'disturbance now, 0&ndash;10', sudsInput));

    var bodyInput = el('input', { type: 'text', 'data-a': 'body', placeholder: 'e.g. tightness in chest, stomach' });
    card.appendChild(fieldRow('Body location', '&ldquo;Where do you feel it in your body?&rdquo;', bodyInput));

    panel.appendChild(card);

    panel.appendChild(el('div', { class: 'emdr-callout emdr-tip' },
      '<span class="emdr-callout-title">Matching NC &amp; PC</span>Keep both in the same theme (responsibility, safety, or control/choice). The PC should be believable as a direction of travel &mdash; not yet fully true (that is what Phases 4&ndash;5 are for) &mdash; and should not depend on someone else changing.'));

    var actions = el('div', { class: 'emdr-actions' });
    var copy = el('button', { class: 'emdr-btn', type: 'button' }, 'Copy target assessment');
    copy.onclick = function () {
      function cog(selKey, customKey) {
        var v = val('[data-a="' + selKey + '"]', card);
        if (v === '__custom__') return val('[data-a="' + customKey + '"]', card) || '-';
        return v || '-';
      }
      var lines = ['EMDR — PHASE 3 TARGET ASSESSMENT', 'Date: ' + dateStamp(), ''];
      lines.push('Target memory: ' + (val('[data-a="memory"]', card) || '-'));
      lines.push('Image: ' + (val('[data-a="image"]', card) || '-'));
      lines.push('Negative Cognition: ' + cog('ncsel', 'nccustom'));
      lines.push('Positive Cognition: ' + cog('pcsel', 'pccustom'));
      lines.push('VOC (baseline): ' + (val('[data-a="voc"]', card) || '-') + ' / 7');
      lines.push('Emotion: ' + (val('[data-a="emotion"]', card) || '-'));
      lines.push('SUDS (baseline): ' + (val('[data-a="suds"]', card) || '-') + ' / 10');
      lines.push('Body location: ' + (val('[data-a="body"]', card) || '-'));
      copyBtn(lines.join('\n'), copy);
    };
    actions.appendChild(copy);
    panel.appendChild(actions);
    return panel;
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  REPROCESS tab — Phases 4-6 set-by-set log
  // ═══════════════════════════════════════════════════════════════════════
  function buildReprocess() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'emdr-ws-intro' },
      'Phases 4&ndash;6 record. Log each set of bilateral stimulation and what emerged, tracking SUDS down toward 0 (desensitization), then VOC up toward 7 (installation), and finally a clear body scan. Note any cognitive interweave used when processing stalled.'));

    var card = el('div', { class: 'emdr-card' });
    card.appendChild(el('h4', null, 'Desensitization set log (Phase 4)'));
    card.appendChild(sudsLegend());
    var t = buildTable([
      { key: 'set', label: '#', type: 'text', ph: 'set', width: '46px' },
      { key: 'channel', label: 'What came up (image / thought / emotion / sensation)', type: 'textarea' },
      { key: 'interweave', label: 'Interweave used (if stalled)', type: 'text', ph: 'responsibility / safety / choice' },
      { key: 'suds', label: 'SUDS 0-10', type: 'suds', width: '78px' }
    ], { starter: [{ set: '1' }, { set: '2' }, { set: '3' }] });
    card.appendChild(t);
    panel.appendChild(card);

    var readout = el('div', { class: 'emdr-readout' });
    panel.appendChild(readout);
    function refresh() {
      var rows = t._readRows();
      var suds = rows.map(function (r) { return parseFloat(r.suds); }).filter(function (n) { return !isNaN(n); });
      readout.innerHTML = '<span class="emdr-stat"><b>' + rows.length + '</b>sets logged</span>' +
        '<span class="emdr-stat"><b>' + (suds.length ? suds[0] : '—') + '</b>starting SUDS</span>' +
        '<span class="emdr-stat"><b>' + (suds.length ? suds[suds.length - 1] : '—') + '</b>current SUDS</span>' +
        '<span class="emdr-stat" style="font-size:12px;color:#7a7364;">Target SUDS = 0 before installation.</span>';
    }
    panel.addEventListener('input', refresh);
    panel.addEventListener('click', function (e) { if (e.target.classList.contains('emdr-row-del') || /Add row/.test(e.target.textContent)) setTimeout(refresh, 0); });
    refresh();

    // Installation + body scan
    var inst = el('div', { class: 'emdr-card' });
    inst.innerHTML = '<h4>Installation &amp; body scan (Phases 5&ndash;6)</h4>';
    [
      ['pc', 'Positive Cognition installed', 'Confirm it still fits; may have shifted'],
      ['vocpre', 'VOC before installation (1-7)', ''],
      ['vocpost', 'VOC after installation (1-7)', 'Aim toward 7'],
      ['bodyscan', 'Body scan result', 'Clear? Any residual sensation reprocessed?']
    ].forEach(function (f) {
      var d = el('div', { class: 'emdr-field' });
      d.innerHTML = '<label>' + f[1] + (f[2] ? ' <span class="emdr-hint">' + f[2] + '</span>' : '') + '</label>';
      var isNum = f[0].indexOf('voc') === 0;
      d.appendChild(el(isNum ? 'input' : 'input', isNum
        ? { type: 'number', min: '1', max: '7', step: '1', class: 'emdr-num', 'data-i': f[0] }
        : { type: 'text', 'data-i': f[0], placeholder: f[2] }));
      inst.appendChild(d);
    });
    panel.appendChild(inst);

    panel.appendChild(el('div', { class: 'emdr-callout emdr-warn' },
      '<span class="emdr-callout-title">Incomplete session?</span>If SUDS is not at 0 (or the body scan is not clear) at time&rsquo;s end, do <em>not</em> suggest resolution. Use the Container and Calm/Safe Place to close, and resume at the next reevaluation.'));

    var actions = el('div', { class: 'emdr-actions' });
    var copy = el('button', { class: 'emdr-btn', type: 'button' }, 'Copy reprocessing log');
    copy.onclick = function () {
      var lines = ['EMDR — REPROCESSING LOG (Phases 4-6)', 'Date: ' + dateStamp(), '', 'DESENSITIZATION SETS'];
      t._readRows().forEach(function (r) {
        lines.push('  Set ' + (r.set || '?') + ': ' + (r.channel || '-') + (r.interweave ? '  [interweave: ' + r.interweave + ']' : '') + '  → SUDS ' + (r.suds || '-'));
      });
      lines.push('', 'INSTALLATION & BODY SCAN');
      lines.push('  PC installed: ' + (val('[data-i="pc"]', inst) || '-'));
      lines.push('  VOC before → after: ' + (val('[data-i="vocpre"]', inst) || '-') + ' → ' + (val('[data-i="vocpost"]', inst) || '-') + ' / 7');
      lines.push('  Body scan: ' + (val('[data-i="bodyscan"]', inst) || '-'));
      copyBtn(lines.join('\n'), copy);
    };
    actions.appendChild(copy);
    panel.appendChild(actions);
    return panel;
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  PLAN tab — three-pronged target sequence + floatback
  // ═══════════════════════════════════════════════════════════════════════
  function buildPlan() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'emdr-ws-intro' },
      'Phase 1 worksheet. Build the three-pronged target sequence: the <strong>past</strong> events that set the pattern (touchstone memories), the <strong>present</strong> triggers that still activate distress, and the <strong>future</strong> templates for adaptive action. Use the floatback/affect-bridge prompt to find touchstone memories behind current triggers.'));

    // Presenting issue + NC theme
    var head = el('div', { class: 'emdr-card' });
    head.innerHTML = '<h4>Presenting issue &amp; theme</h4>';
    [
      ['issue', 'Presenting problem / symptom', 'What the client wants to work on'],
      ['nc', 'Core negative cognition / theme', 'e.g. "I am powerless" (control theme)'],
      ['pc', 'Desired positive cognition', 'e.g. "I now have choices"']
    ].forEach(function (f) {
      var d = el('div', { class: 'emdr-field' });
      d.innerHTML = '<label>' + f[1] + ' <span class="emdr-hint">' + f[2] + '</span></label>';
      d.appendChild(el('input', { type: 'text', 'data-p': f[0], placeholder: f[2] }));
      head.appendChild(d);
    });
    panel.appendChild(head);

    // Floatback
    panel.appendChild(el('div', { class: 'emdr-callout emdr-tip' },
      '<span class="emdr-callout-title">Floatback / affect bridge</span>To find a touchstone memory: have the client hold the current trigger image, the negative belief, and the body sensation, then &ldquo;let your mind float back to the earliest time you remember feeling this same way.&rdquo; The memory that surfaces is often the target to process first.'));

    // Past
    var past = el('div', { class: 'emdr-card' });
    past.innerHTML = '<h4>PAST &mdash; touchstone &amp; formative memories</h4>';
    var pastT = buildTable([
      { key: 'memory', label: 'Memory / event', type: 'text', ph: 'Earliest / worst / most representative' },
      { key: 'age', label: 'Age', type: 'text', width: '60px' },
      { key: 'suds', label: 'SUDS 0-10', type: 'suds', width: '78px' },
      { key: 'order', label: 'Process order', type: 'text', width: '90px', ph: '1, 2, 3…' }
    ]);
    past.appendChild(pastT);
    panel.appendChild(past);

    // Present
    var pres = el('div', { class: 'emdr-card' });
    pres.innerHTML = '<h4>PRESENT &mdash; current triggers</h4>';
    var presT = buildTable([
      { key: 'trigger', label: 'Current trigger / situation', type: 'text', ph: 'What sets off the reaction now' },
      { key: 'reaction', label: 'Reaction', type: 'text', ph: 'emotion / behavior' },
      { key: 'suds', label: 'SUDS 0-10', type: 'suds', width: '78px' }
    ]);
    pres.appendChild(presT);
    panel.appendChild(pres);

    // Future
    var fut = el('div', { class: 'emdr-card' });
    fut.innerHTML = '<h4>FUTURE &mdash; templates</h4>';
    var futT = buildTable([
      { key: 'situation', label: 'Anticipated situation', type: 'text', ph: 'Where the client will need the new response' },
      { key: 'response', label: 'Desired adaptive response (with PC)', type: 'text' }
    ]);
    fut.appendChild(futT);
    panel.appendChild(fut);

    var actions = el('div', { class: 'emdr-actions' });
    var copy = el('button', { class: 'emdr-btn', type: 'button' }, 'Copy target sequence plan');
    copy.onclick = function () {
      var lines = ['EMDR — THREE-PRONGED TARGET SEQUENCE PLAN', 'Date: ' + dateStamp(), ''];
      lines.push('Presenting issue: ' + (val('[data-p="issue"]', head) || '-'));
      lines.push('Negative cognition/theme: ' + (val('[data-p="nc"]', head) || '-'));
      lines.push('Positive cognition: ' + (val('[data-p="pc"]', head) || '-'));
      lines.push('', 'PAST (touchstone/formative)');
      pastT._readRows().forEach(function (r) { lines.push('  • ' + (r.memory || '-') + (r.age ? ' (age ' + r.age + ')' : '') + ' [SUDS ' + (r.suds || '-') + ']' + (r.order ? '  — order ' + r.order : '')); });
      lines.push('', 'PRESENT (triggers)');
      presT._readRows().forEach(function (r) { lines.push('  • ' + (r.trigger || '-') + ' → ' + (r.reaction || '-') + ' [SUDS ' + (r.suds || '-') + ']'); });
      lines.push('', 'FUTURE (templates)');
      futT._readRows().forEach(function (r) { lines.push('  • ' + (r.situation || '-') + ' → ' + (r.response || '-')); });
      copyBtn(lines.join('\n'), copy);
    };
    actions.appendChild(copy);
    panel.appendChild(actions);
    return panel;
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  OUTCOMES tab — goals + PCL-5 tracker
  // ═══════════════════════════════════════════════════════════════════════
  function buildOutcomes() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'emdr-ws-intro' },
      'Set a functional goal and track a repeated PTSD severity measure across sessions. PCL-5 total ranges 0&ndash;80; a drop of roughly 10&ndash;20 points is generally considered clinically meaningful.'));

    // SMART
    var smart = el('div', { class: 'emdr-card' });
    smart.appendChild(el('h4', null, 'SMART goal builder'));
    var fields = [
      ['specific', 'Specific', 'What will the client be able to do?', 'e.g. Drive past the crash site'],
      ['measurable', 'Measurable', 'How will you know?', 'e.g. without a panic response'],
      ['achievable', 'Achievable', 'Realistic now? Grade if needed.', 'e.g. start as a passenger'],
      ['relevant', 'Relevant', 'Which value/goal does it serve?', 'e.g. get back to work'],
      ['timebound', 'Time-bound', 'By when / how often?', 'e.g. within 6 sessions']
    ];
    fields.forEach(function (f) {
      var d = el('div', { class: 'emdr-field' });
      d.innerHTML = '<label>' + f[1] + ' <span class="emdr-hint">' + f[2] + '</span></label>';
      d.appendChild(el('input', { type: 'text', 'data-smart': f[0], placeholder: f[3] }));
      smart.appendChild(d);
    });
    var preview = el('div', { class: 'emdr-preview' });
    smart.appendChild(preview);
    smart.addEventListener('input', function () {
      var g = {};
      smart.querySelectorAll('[data-smart]').forEach(function (i) { g[i.getAttribute('data-smart')] = i.value.trim(); });
      if (!g.specific && !g.measurable) { preview.innerHTML = ''; return; }
      preview.innerHTML = '<strong>Goal:</strong> ' + esc(g.specific || '…') +
        (g.measurable ? ' — ' + esc(g.measurable) : '') +
        (g.timebound ? ', ' + esc(g.timebound) : '') +
        (g.relevant ? '. <em>Value: ' + esc(g.relevant) + '.</em>' : '.') +
        (g.achievable ? ' <span class="emdr-hint">(' + esc(g.achievable) + ')</span>' : '');
    });
    panel.appendChild(smart);

    // Severity tracker
    var scard = el('div', { class: 'emdr-card' });
    scard.appendChild(el('h4', null, 'PTSD severity tracker'));
    scard.appendChild(el('p', { class: 'emdr-ws-intro' },
      'Enter a repeated measure per session (PCL-5 total 0&ndash;80, or other). Change from baseline is shown automatically.'));
    var st = buildTable([
      { key: 'date', label: 'Session date', type: 'date', width: '150px' },
      { key: 'measure', label: 'Measure', type: 'text', ph: 'e.g. PCL-5', width: '110px' },
      { key: 'score', label: 'Total score', type: 'text', width: '100px', ph: '0-80' },
      { key: 'note', label: 'Note', type: 'text', ph: 'target processed / event' }
    ]);
    scard.appendChild(st);
    var trend = el('ul', { class: 'emdr-progress-list' });
    scard.appendChild(trend);
    function refreshTrend() {
      var rows = st._readRows().filter(function (r) { return r.score !== '' && !isNaN(parseFloat(r.score)); });
      trend.innerHTML = '';
      if (!rows.length) return;
      var base = parseFloat(rows[0].score);
      rows.forEach(function (r, i) {
        var v = parseFloat(r.score); var d = v - base;
        var deltaHtml = i === 0 ? '<span class="emdr-hint">baseline</span>' :
          (d <= 0 ? '<span class="emdr-delta-up">' + d + ' from baseline</span>' : '<span class="emdr-delta-down">+' + d + ' from baseline</span>');
        var li = el('li');
        li.innerHTML = '<span>' + esc(r.date || ('Session ' + (i + 1))) + ' — ' + esc(r.measure || '') + ' ' + v + '</span>' + deltaHtml;
        trend.appendChild(li);
      });
    }
    scard.addEventListener('input', refreshTrend);
    scard.addEventListener('click', function (e) { if (/Add row/.test(e.target.textContent) || e.target.classList.contains('emdr-row-del')) setTimeout(refreshTrend, 0); });
    panel.appendChild(scard);

    var actions = el('div', { class: 'emdr-actions' });
    var copy = el('button', { class: 'emdr-btn', type: 'button' }, 'Copy goals + outcomes');
    copy.onclick = function () {
      var g = {};
      smart.querySelectorAll('[data-smart]').forEach(function (i) { g[i.getAttribute('data-smart')] = i.value.trim(); });
      var lines = ['EMDR — GOALS & OUTCOMES', 'Date: ' + dateStamp(), '', 'SMART GOAL'];
      lines.push('  Specific: ' + (g.specific || '-'));
      lines.push('  Measurable: ' + (g.measurable || '-'));
      lines.push('  Achievable: ' + (g.achievable || '-'));
      lines.push('  Relevant: ' + (g.relevant || '-'));
      lines.push('  Time-bound: ' + (g.timebound || '-'));
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
    { id: 'plan', label: 'Target Plan', build: buildPlan },
    { id: 'prepare', label: 'Prepare (Ph. 2)', build: buildPrepare },
    { id: 'assess', label: 'Assess (Ph. 3)', build: buildAssess },
    { id: 'reprocess', label: 'Reprocess (Ph. 4-6)', build: buildReprocess },
    { id: 'outcomes', label: 'Goals & Outcomes', build: buildOutcomes }
  ];

  var meta = el('div', { class: 'emdr-meta' });
  meta.innerHTML =
    '<span class="emdr-chip emdr-chip-accent">Module 8 of 8</span>' +
    '<span class="emdr-chip">EMDR therapy</span>' +
    '<span class="emdr-chip">Trauma / PTSD</span>' +
    '<span class="emdr-chip">8-phase protocol</span>' +
    '<span class="emdr-chip">Trainee / advanced student</span>' +
    '<span class="emdr-chip">~4&ndash;6 contact hours</span>';
  root.appendChild(meta);

  // Print / Save-as-PDF: build every panel, then print.
  var printBar = el('div', { class: 'emdr-actions' });
  var printBtn = el('button', { class: 'emdr-btn emdr-btn-ghost emdr-btn-sm', type: 'button' });
  printBtn.innerHTML = '&#128424; Print / Save as PDF';
  printBtn.onclick = function () {
    var allTabs = tabBar.querySelectorAll('.emdr-tab');
    Array.prototype.forEach.call(allTabs, function (b) { b.click(); });
    if (allTabs[0]) allTabs[0].click();
    window.print();
  };
  printBar.appendChild(printBtn);
  root.appendChild(printBar);

  var tabBar = el('div', { class: 'emdr-tabs' });
  var panels = el('div');
  TABS.forEach(function (t, i) {
    var btn = el('button', { class: 'emdr-tab' + (i === 0 ? ' emdr-active' : ''), type: 'button' }, t.label);
    var panel = el('div', { class: 'emdr-panel' + (i === 0 ? ' emdr-active' : '') });
    var built = false;
    function activate() {
      tabBar.querySelectorAll('.emdr-tab').forEach(function (b) { b.classList.remove('emdr-active'); });
      panels.querySelectorAll('.emdr-panel').forEach(function (p) { p.classList.remove('emdr-active'); });
      btn.classList.add('emdr-active');
      panel.classList.add('emdr-active');
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
    if (idx > -1) tabBar.querySelectorAll('.emdr-tab')[idx].click();
  }
})();

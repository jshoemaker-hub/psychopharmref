/* ═══════════════════════════════════════════════════════════════════════
   cbti-insomnia.js — Course module 9
   "CBT for Insomnia (CBT-I): A How-To"
   Audience: clinicians, trainees & advanced students.
   Builds a tabbed module into #cbti-root. Uses ToolUtils for clipboard/date.
   Tabs: Learn · Sleep Diary (efficiency calc) · Sleep Prescription (SRT
   calculator + titration) · Stimulus Control (checklist) · Cognitive
   Restructuring.
   Prefix: cbti-
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var root = document.getElementById('cbti-root');
  if (!root || root.dataset.cbtiBuilt) return;
  root.dataset.cbtiBuilt = '1';

  var U = window.ToolUtils || {};
  function dateStamp() { return (U.dateStamp ? U.dateStamp() : new Date().toLocaleDateString()); }
  function copyBtn(text, btn) { if (U.copyWithButton) U.copyWithButton(text, btn); else if (navigator.clipboard) navigator.clipboard.writeText(text); }

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

  // ── Time / duration helpers ────────────────────────────────────────────
  function toMin(t) {
    // "HH:MM" -> minutes since midnight, or null
    if (!t) return null;
    var m = /^(\d{1,2}):(\d{2})$/.exec(t.trim());
    if (!m) return null;
    var h = +m[1], mm = +m[2];
    if (h > 23 || mm > 59) return null;
    return h * 60 + mm;
  }
  function num(v) { var n = parseFloat(v); return isNaN(n) ? null : n; }
  function fmtHM(mins) {
    if (mins == null || isNaN(mins) || mins < 0) return '—';
    mins = Math.round(mins);
    var h = Math.floor(mins / 60), m = mins % 60;
    return h + 'h ' + (m < 10 ? '0' + m : m) + 'm';
  }
  // Time-in-bed from into-bed to out-of-bed times (handles crossing midnight)
  function spanMin(startT, endT) {
    var a = toMin(startT), b = toMin(endT);
    if (a == null || b == null) return null;
    if (b <= a) b += 1440;
    return b - a;
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  DIDACTIC CONTENT (Learn tab)
  // ═══════════════════════════════════════════════════════════════════════
  var LEARN_HTML =
    '<div class="cbti-learn">' +
      '<p class="cbti-lead">Cognitive Behavioral Therapy for Insomnia (CBT-I) is the recommended <strong>first-line treatment for chronic insomnia disorder</strong> &mdash; ahead of hypnotic medication &mdash; endorsed by the American College of Physicians and the American Academy of Sleep Medicine. It is a brief, structured, multi-component treatment (typically 4&ndash;8 sessions) that targets the behaviors and thoughts that <em>perpetuate</em> insomnia. This module teaches how to actually deliver it.</p>' +

      '<h3>1. Why insomnia persists: the 3-P (Spielman) model</h3>' +
      '<p>Chronic insomnia is best formulated with the <strong>3-P model</strong>: <strong>Predisposing</strong> factors (trait hyperarousal, family history, tendency to worry), a <strong>Precipitating</strong> event (stress, illness, a schedule change) that triggers acute sleeplessness, and <strong>Perpetuating</strong> factors that keep it going after the trigger has passed. The perpetuating factors are largely behavioral and cognitive &mdash; spending excessive time in bed, irregular schedules, napping, effortful &ldquo;trying&rdquo; to sleep, and catastrophic beliefs about sleep loss &mdash; and they are exactly what CBT-I removes.</p>' +
      '<div class="cbti-callout cbti-tip"><span class="cbti-callout-title">Core principle</span>Acute insomnia is caused by the precipitant; <em>chronic</em> insomnia is maintained by the coping responses to it. CBT-I works by dismantling those perpetuating responses, not by directly forcing sleep.</div>' +

      '<h3>2. Assessment &amp; the sleep diary</h3>' +
      '<p>Begin with a <strong>1&ndash;2 week baseline sleep diary</strong> (the <em>Sleep Diary</em> tab). The diary is the backbone of CBT-I: it yields the metrics you titrate treatment against &mdash; sleep-onset latency (SOL), wake after sleep onset (WASO), total sleep time (TST), time in bed (TIB), and <strong>sleep efficiency</strong> (SE = TST &divide; TIB &times; 100). Use retrospective recall only to supplement, not replace, the prospective diary.</p>' +
      '<p>Screen for and co-manage other sleep and psychiatric disorders before or alongside CBT-I: obstructive sleep apnea (snoring, witnessed apneas, BMI, STOP-BANG), restless legs syndrome, circadian rhythm disorders (delayed/advanced phase), and untreated mood, anxiety, PTSD, or substance use. CBT-I still works in the presence of most comorbidities &mdash; comorbid insomnia is treated, not deferred &mdash; but untreated OSA must be addressed.</p>' +
      '<div class="cbti-callout cbti-warn"><span class="cbti-callout-title">Screen before restricting</span>Do not start sleep restriction in someone with untreated obstructive sleep apnea, and use it cautiously (or defer) in bipolar disorder, seizure disorders, parasomnias, and occupations with high safety demands (see &sect;9). Sleep restriction transiently increases daytime sleepiness.</div>' +

      '<h3>3. The components of CBT-I</h3>' +
      '<p>CBT-I is a package. Its evidence-based active ingredients are <strong>sleep restriction</strong> and <strong>stimulus control</strong> (the behavioral core), <strong>cognitive therapy</strong>, and <strong>arousal reduction / relaxation</strong>, with <strong>sleep hygiene</strong> as a necessary-but-insufficient adjunct. Each has its own tab or section below.</p>' +
      '<dl class="cbti-acr">' +
        '<dt>Sleep restriction</dt><dd>match time in bed to actual sleep to consolidate sleep and rebuild sleep drive</dd>' +
        '<dt>Stimulus control</dt><dd>re-associate the bed with sleeping rather than with wakefulness and arousal</dd>' +
        '<dt>Cognitive therapy</dt><dd>correct catastrophic and unrealistic beliefs about sleep; reduce sleep-effort and monitoring</dd>' +
        '<dt>Relaxation</dt><dd>lower cognitive and somatic hyperarousal at bedtime</dd>' +
        '<dt>Sleep hygiene</dt><dd>remove environmental &amp; lifestyle obstacles (adjunct only)</dd>' +
      '</dl>' +

      '<h3>4. Sleep restriction therapy (SRT)</h3>' +
      '<p>Sleep restriction is the most powerful single component. It works by creating a mild, controlled sleep debt that increases homeostatic sleep drive, shortens sleep latency, and consolidates fragmented sleep. Delivery:</p>' +
      '<ol>' +
        '<li><strong>Compute the baseline:</strong> from the diary, take mean TST and mean SE over the baseline week (the <em>Sleep Diary</em> tab computes these).</li>' +
        '<li><strong>Set the prescribed time in bed (TIB)</strong> equal to mean TST &mdash; but <strong>never below a floor of 5 hours</strong> (some protocols use 5.5). Do not restrict below what the person actually sleeps.</li>' +
        '<li><strong>Fix the rise time</strong> (out-of-bed time) first, anchored to the person&rsquo;s obligations, then back-calculate the prescribed bedtime = rise time &minus; prescribed TIB. A fixed, consistent rise time is non-negotiable.</li>' +
        '<li><strong>Titrate weekly by sleep efficiency</strong> (see the <em>Sleep Prescription</em> tab): raise or lower TIB in ~15-minute steps based on the past week&rsquo;s SE.</li>' +
      '</ol>' +
      '<div class="cbti-callout cbti-tip"><span class="cbti-callout-title">Weekly titration rule of thumb</span>SE &ge; 90% &rarr; <strong>increase</strong> TIB by 15 min. SE 85&ndash;89% &rarr; <strong>hold</strong>. SE &lt; 85% &rarr; <strong>decrease</strong> TIB by 15 min (not below the 5-hour floor). Thresholds vary between protocols; the principle is constant: earn more time in bed by sleeping efficiently.</div>' +
      '<p>Warn the client that the first 1&ndash;2 weeks bring increased daytime sleepiness &mdash; this is expected and is the engine of the treatment. Address driving and occupational safety explicitly. A gentler variant, <strong>sleep-restriction &ldquo;compression&rdquo;</strong> (gradually trimming TIB toward TST), is an option for frail, older, or safety-sensitive patients.</p>' +

      '<h3>5. Stimulus control</h3>' +
      '<p>Bootzin&rsquo;s stimulus-control instructions retrain the bed as a cue for sleep rather than for frustrated wakefulness. The rules are deceptively simple and easy to under-deliver &mdash; they must be explained with rationale and reviewed for adherence (the <em>Stimulus Control</em> tab operationalizes them):</p>' +
      '<ol>' +
        '<li>Go to bed only when <strong>sleepy</strong> (not merely tired or &ldquo;on schedule&rdquo;).</li>' +
        '<li>Use the bed and bedroom <strong>only for sleep and sex</strong> &mdash; no phone, TV, reading, working, or worrying in bed.</li>' +
        '<li>If you don&rsquo;t fall asleep within ~15&ndash;20 minutes (by feel, not by clock-watching), <strong>get out of bed</strong>, go to another room, and do something quiet and calm in dim light; return only when sleepy. Repeat as many times as needed.</li>' +
        '<li>Keep a <strong>fixed rise time</strong> every day of the week, regardless of how the night went.</li>' +
        '<li><strong>Do not nap</strong> during the day (or limit to a single brief, early nap if truly unavoidable).</li>' +
      '</ol>' +

      '<h3>6. Cognitive therapy for insomnia</h3>' +
      '<p>Target the <strong>dysfunctional beliefs and worry</strong> that drive nighttime arousal and daytime distress: unrealistic sleep-need expectations (&ldquo;I must get 8 hours&rdquo;), catastrophizing about consequences (&ldquo;I won&rsquo;t function / I&rsquo;ll get sick&rdquo;), monitoring and clock-watching, and the paradox of <strong>sleep effort</strong> (the harder you try to sleep, the more aroused you become). Techniques (the <em>Cognitive Restructuring</em> tab):</p>' +
      '<ul>' +
        '<li><strong>Socratic examination</strong> of specific sleep-related predictions, weighing evidence for and against, then building a balanced alternative belief.</li>' +
        '<li><strong>Behavioral experiments</strong> testing catastrophic predictions (e.g., functioning after a poor night).</li>' +
        '<li><strong>Constructive worry / scheduled worry</strong> earlier in the evening to offload rumination before bed.</li>' +
        '<li><strong>Paradoxical intention</strong> &mdash; gently giving up the effort to fall asleep &mdash; to defuse performance anxiety.</li>' +
        '<li><strong>Dropping safety behaviors</strong> (extended lie-ins, cancelled plans, excess caffeine) that maintain the problem.</li>' +
      '</ul>' +

      '<h3>7. Relaxation &amp; arousal reduction</h3>' +
      '<p>Insomnia is a disorder of hyperarousal. Teach and rehearse one or two methods &mdash; diaphragmatic breathing, progressive muscle relaxation, autogenic training, or mindfulness/body-scan &mdash; practiced in the daytime first, then applied to the pre-sleep period and during middle-of-the-night awakenings. A wind-down &ldquo;buffer zone&rdquo; of 30&ndash;60 minutes of low-stimulation activity before bed supports this.</p>' +

      '<h3>8. Sleep hygiene (adjunct only)</h3>' +
      '<p>Sleep hygiene &mdash; caffeine/alcohol/nicotine timing, exercise, light exposure, a cool dark quiet room, limiting evening screens &mdash; is necessary background but is <strong>not effective as a stand-alone treatment</strong> and should never be offered as if it were CBT-I. Use it to remove obstacles, not as the intervention.</p>' +

      '<h3>9. Session structure &amp; course</h3>' +
      '<p>A typical course is <strong>4&ndash;8 sessions</strong>:</p>' +
      '<ol>' +
        '<li><strong>Session 1:</strong> assessment, formulation (3-P model), rationale, start the sleep diary.</li>' +
        '<li><strong>Session 2:</strong> review the baseline diary; introduce sleep restriction (set TIB, fix rise time) and stimulus control.</li>' +
        '<li><strong>Sessions 3&ndash;5:</strong> weekly titration of TIB by sleep efficiency; troubleshoot adherence; add cognitive therapy and relaxation.</li>' +
        '<li><strong>Later sessions:</strong> consolidate gains, address residual beliefs, and build a relapse-prevention / staying-well plan.</li>' +
      '</ol>' +
      '<p>Briefer and scalable formats are well supported: <strong>Brief Behavioral Treatment for Insomnia (BBTI)</strong> (2&ndash;4 sessions, restriction + stimulus control) and <strong>digital CBT-I (dCBT-I)</strong> for stepped-care delivery.</p>' +

      '<h3>10. Adaptations, cautions &amp; hypnotic tapering</h3>' +
      '<ul>' +
        '<li><strong>Older adults:</strong> favor sleep-restriction compression and fall-risk-aware get-out-of-bed instructions.</li>' +
        '<li><strong>Comorbid depression, PTSD, chronic pain:</strong> CBT-I improves both sleep and the comorbid condition; deliver concurrently.</li>' +
        '<li><strong>Hypnotic discontinuation:</strong> CBT-I facilitates gradual, prescriber-supervised tapering of benzodiazepine-receptor agonists; pair the taper schedule with the behavioral program.</li>' +
        '<li><strong>Cautions/contraindications to sleep restriction:</strong> untreated OSA, bipolar disorder (sleep loss can precipitate mania), seizure disorders (sleep deprivation lowers threshold), parasomnias, and safety-critical occupations &mdash; modify, monitor, or defer.</li>' +
      '</ul>' +

      '<h3>11. Outcome measures</h3>' +
      '<p>Track the <strong>Insomnia Severity Index (ISI)</strong> as the primary patient-reported outcome, alongside diary-derived SE, SOL, WASO, and TST. The <strong>Epworth Sleepiness Scale (ESS)</strong> and <strong>PSQI</strong> supplement the picture (an ESS tool is available elsewhere on this site). Define success as consolidated, efficient sleep and reduced daytime impairment &mdash; not a fixed number of hours.</p>' +

      '<h3>Key references</h3>' +
      '<ul class="cbti-refs">' +
        '<li>Edinger, J. D., et al. (2021). Behavioral and psychological treatments for chronic insomnia disorder in adults: an AASM clinical practice guideline. <em>Journal of Clinical Sleep Medicine.</em></li>' +
        '<li>Qaseem, A., et al. (2016). Management of chronic insomnia disorder in adults: a clinical practice guideline from the American College of Physicians. <em>Annals of Internal Medicine.</em></li>' +
        '<li>Perlis, M. L., Jungquist, C., Smith, M. T., &amp; Posner, D. (2005). <em>Cognitive Behavioral Treatment of Insomnia: A Session-by-Session Guide.</em> Springer.</li>' +
        '<li>Morin, C. M., &amp; Espie, C. A. (2003). <em>Insomnia: A Clinical Guide to Assessment and Treatment.</em> Springer.</li>' +
        '<li>Spielman, A. J., Caruso, L. S., &amp; Glovinsky, P. B. (1987). A behavioral perspective on insomnia treatment. <em>Psychiatric Clinics of North America.</em></li>' +
        '<li>Bootzin, R. R., &amp; Epstein, D. R. (2011). Understanding and treating insomnia. <em>Annual Review of Clinical Psychology.</em></li>' +
        '<li>Buysse, D. J., et al. (2011). Efficacy of Brief Behavioral Treatment for Insomnia in older adults. <em>Archives of Internal Medicine.</em></li>' +
      '</ul>' +
    '</div>';

  // ═══════════════════════════════════════════════════════════════════════
  //  Reusable dynamic table (mirrors the module family convention)
  // ═══════════════════════════════════════════════════════════════════════
  function buildTable(cols, opts) {
    opts = opts || {};
    var wrap = el('div', { class: 'cbti-tablewrap' });
    var table = el('table', { class: 'cbti-table' });
    var thead = el('thead');
    var htr = el('tr');
    cols.forEach(function (c) { htr.appendChild(el('th', c.width ? { style: 'width:' + c.width } : null, c.label)); });
    if (opts.computed) opts.computed.forEach(function (c) { htr.appendChild(el('th', { class: 'cbti-th-calc', style: c.width ? 'width:' + c.width : '' }, c.label)); });
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
      } else if (c.type === 'time') {
        input = el('input', { type: 'time', class: 'cbti-time' });
      } else if (c.type === 'mins') {
        input = el('input', { type: 'number', min: '0', step: '5', class: 'cbti-num', placeholder: c.ph || 'min' });
      } else if (c.type === 'int') {
        input = el('input', { type: 'number', min: '0', step: '1', class: 'cbti-num', placeholder: c.ph || '' });
      } else if (c.type === 'pct') {
        input = el('input', { type: 'number', min: '0', max: '100', step: '5', class: 'cbti-num', placeholder: '%' });
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
      if (opts.computed) opts.computed.forEach(function (c) {
        tr.appendChild(el('td', { class: 'cbti-calc', 'data-calc': c.key }, '—'));
      });
      var delTd = el('td');
      var del = el('button', { class: 'cbti-row-del', title: 'Remove row', type: 'button' }, '&times;');
      del.onclick = function () { tr.remove(); };
      delTd.appendChild(del);
      tr.appendChild(delTd);
      tbody.appendChild(tr);
      return tr;
    }
    (opts.starter || []).forEach(addRow);
    if (!opts.starter) addRow();

    var addBtn = el('button', { class: 'cbti-btn cbti-btn-ghost cbti-btn-sm', type: 'button' }, '+ Add night');
    if (opts.addLabel) addBtn.textContent = opts.addLabel;
    addBtn.onclick = function () { addRow(); };
    var actWrap = el('div', { class: 'cbti-actions' });
    actWrap.appendChild(addBtn);
    wrap.appendChild(actWrap);

    wrap._readRows = function () {
      return Array.prototype.map.call(tbody.querySelectorAll('tr'), function (tr) {
        var o = {};
        tr.querySelectorAll('[data-key]').forEach(function (inp) { o[inp.getAttribute('data-key')] = inp.value.trim(); });
        return o;
      }).filter(function (o) { return Object.keys(o).some(function (k) { return o[k]; }); });
    };
    wrap._tbody = tbody;
    return wrap;
  }

  function seBand(se) {
    if (se == null || isNaN(se)) return '';
    if (se >= 90) return 'cbti-se-high';
    if (se >= 85) return 'cbti-se-mod';
    return 'cbti-se-low';
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  Shared diary reference (Sleep Prescription tab pulls from it)
  // ═══════════════════════════════════════════════════════════════════════
  var diaryTable = null;
  function diaryAverages() {
    if (!diaryTable) return null;
    var rows = Array.prototype.slice.call(diaryTable._tbody.querySelectorAll('tr'));
    var tst = [], tib = [], se = [], sol = [], waso = [];
    rows.forEach(function (tr) {
      var r = {};
      tr.querySelectorAll('[data-key]').forEach(function (i) { r[i.getAttribute('data-key')] = i.value.trim(); });
      var c = computeNight(r);
      if (c.tib != null && c.tst != null && c.se != null) {
        tib.push(c.tib); tst.push(c.tst); se.push(c.se);
        if (num(r.sol) != null) sol.push(num(r.sol));
        if (num(r.waso) != null) waso.push(num(r.waso));
      }
    });
    if (!se.length) return null;
    function mean(a) { return a.reduce(function (x, y) { return x + y; }, 0) / a.length; }
    return { n: se.length, tst: mean(tst), tib: mean(tib), se: mean(se),
             sol: sol.length ? mean(sol) : null, waso: waso.length ? mean(waso) : null };
  }

  // TST = (final wake - lights out) - SOL - WASO ; TIB = out of bed - into bed
  function computeNight(r) {
    var tib = spanMin(r.inbed, r.outbed);
    var asleepSpan = spanMin(r.lightsout, r.finalwake);
    var sol = num(r.sol), waso = num(r.waso);
    var tst = null;
    if (asleepSpan != null && sol != null && waso != null) {
      tst = asleepSpan - sol - waso;
      if (tst < 0) tst = null;
    }
    var se = (tib != null && tst != null && tib > 0) ? (tst / tib * 100) : null;
    return { tib: tib, tst: tst, se: se };
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  SLEEP DIARY tab
  // ═══════════════════════════════════════════════════════════════════════
  function buildDiary() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'cbti-ws-intro' },
      'Prospective sleep diary &mdash; complete each morning for 1&ndash;2 weeks at baseline, then throughout treatment. Enter clock times as HH:MM and durations in minutes. Total sleep time (TST), time in bed (TIB), and <strong>sleep efficiency (SE)</strong> are computed for each night, with weekly averages below. These averages drive the sleep prescription.'));

    var card = el('div', { class: 'cbti-card' });
    card.appendChild(el('h4', null, 'Nightly sleep diary'));
    card.appendChild(el('div', { class: 'cbti-se-legend' },
      '<span>Sleep efficiency:</span>' +
      '<span class="cbti-se-band cbti-se-high">&ge;90% raise TIB</span>' +
      '<span class="cbti-se-band cbti-se-mod">85&ndash;89% hold</span>' +
      '<span class="cbti-se-band cbti-se-low">&lt;85% lower TIB</span>'));

    var readout = el('div', { class: 'cbti-readout' });

    var t = buildTable([
      { key: 'date', label: 'Date', type: 'date', width: '130px' },
      { key: 'inbed', label: 'Into bed', type: 'time', width: '92px' },
      { key: 'lightsout', label: 'Lights out', type: 'time', width: '92px' },
      { key: 'sol', label: 'Mins to fall asleep', type: 'mins', width: '78px' },
      { key: 'waso', label: 'Mins awake in night', type: 'mins', width: '78px' },
      { key: 'finalwake', label: 'Final wake', type: 'time', width: '92px' },
      { key: 'outbed', label: 'Out of bed', type: 'time', width: '92px' },
      { key: 'nap', label: 'Daytime nap (min)', type: 'mins', width: '70px' }
    ], {
      computed: [
        { key: 'tst', label: 'TST', width: '68px' },
        { key: 'tib', label: 'TIB', width: '68px' },
        { key: 'se', label: 'SE %', width: '58px' }
      ],
      addLabel: '+ Add night'
    });
    diaryTable = t;
    card.appendChild(t);
    panel.appendChild(card);
    panel.appendChild(readout);

    function refresh() {
      var rows = Array.prototype.slice.call(t._tbody.querySelectorAll('tr'));
      var tstArr = [], tibArr = [], seArr = [], solArr = [], wasoArr = [];
      rows.forEach(function (tr) {
        var r = {};
        tr.querySelectorAll('[data-key]').forEach(function (i) { r[i.getAttribute('data-key')] = i.value.trim(); });
        var c = computeNight(r);
        var tstCell = tr.querySelector('[data-calc="tst"]');
        var tibCell = tr.querySelector('[data-calc="tib"]');
        var seCell = tr.querySelector('[data-calc="se"]');
        if (tstCell) tstCell.textContent = fmtHM(c.tst);
        if (tibCell) tibCell.textContent = fmtHM(c.tib);
        if (seCell) {
          seCell.textContent = (c.se == null ? '—' : Math.round(c.se) + '%');
          seCell.className = 'cbti-calc cbti-se-cell ' + seBand(c.se);
        }
        if (c.se != null) {
          tstArr.push(c.tst); tibArr.push(c.tib); seArr.push(c.se);
          if (num(r.sol) != null) solArr.push(num(r.sol));
          if (num(r.waso) != null) wasoArr.push(num(r.waso));
        }
      });
      function mean(a) { return a.length ? a.reduce(function (x, y) { return x + y; }, 0) / a.length : null; }
      var mSE = mean(seArr);
      readout.innerHTML =
        '<span class="cbti-stat"><b>' + seArr.length + '</b>nights with full data</span>' +
        '<span class="cbti-stat"><b>' + fmtHM(mean(tstArr)) + '</b>mean sleep (TST)</span>' +
        '<span class="cbti-stat"><b>' + fmtHM(mean(tibArr)) + '</b>mean time in bed</span>' +
        '<span class="cbti-stat"><b>' + (mSE == null ? '—' : Math.round(mSE) + '%') + '</b>mean sleep efficiency</span>' +
        '<span class="cbti-stat"><b>' + (mean(solArr) == null ? '—' : Math.round(mean(solArr)) + ' min') + '</b>mean onset latency</span>' +
        '<span class="cbti-stat"><b>' + (mean(wasoArr) == null ? '—' : Math.round(mean(wasoArr)) + ' min') + '</b>mean WASO</span>';
    }
    panel.addEventListener('input', refresh);
    panel.addEventListener('click', function (e) {
      if (e.target.classList.contains('cbti-row-del') || /Add night/.test(e.target.textContent || '')) setTimeout(refresh, 0);
    });
    refresh();

    var actions = el('div', { class: 'cbti-actions' });
    var copy = el('button', { class: 'cbti-btn', type: 'button' }, 'Copy diary summary');
    copy.onclick = function () {
      var avg = diaryAverages();
      var lines = ['CBT-I SLEEP DIARY', 'Date: ' + dateStamp(), ''];
      t._readRows().forEach(function (r) {
        var c = computeNight(r);
        lines.push('  ' + (r.date || '-') + ': TST ' + fmtHM(c.tst) + ' | TIB ' + fmtHM(c.tib) + ' | SE ' + (c.se == null ? '-' : Math.round(c.se) + '%'));
      });
      if (avg) {
        lines.push('', 'WEEKLY AVERAGES (n=' + avg.n + ' nights)');
        lines.push('  Mean TST: ' + fmtHM(avg.tst));
        lines.push('  Mean TIB: ' + fmtHM(avg.tib));
        lines.push('  Mean SE:  ' + Math.round(avg.se) + '%');
        if (avg.sol != null) lines.push('  Mean SOL: ' + Math.round(avg.sol) + ' min');
        if (avg.waso != null) lines.push('  Mean WASO: ' + Math.round(avg.waso) + ' min');
      }
      copyBtn(lines.join('\n'), copy);
    };
    actions.appendChild(copy);
    panel.appendChild(actions);
    return panel;
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  SLEEP PRESCRIPTION tab (sleep-restriction calculator + titration)
  // ═══════════════════════════════════════════════════════════════════════
  function buildPrescription() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'cbti-ws-intro' },
      'Set the initial sleep-restriction prescription from baseline diary data, then use the weekly titration tool to adjust time in bed by sleep efficiency. The <strong>5-hour floor</strong> is enforced &mdash; never prescribe less time in bed than the person actually sleeps, and never below 5 hours.'));

    // ── Initial prescription ──
    var c1 = el('div', { class: 'cbti-card' });
    c1.innerHTML = '<h4>1 &middot; Initial prescription</h4>';
    var g = el('div', { class: 'cbti-grid2' });
    g.innerHTML =
      '<div class="cbti-field"><label>Baseline mean total sleep time <span class="cbti-hint">(hours : minutes, from diary)</span></label>' +
        '<div class="cbti-hm"><input type="number" min="0" max="14" step="1" class="cbti-num" data-p="tst-h" placeholder="h"> h ' +
        '<input type="number" min="0" max="59" step="5" class="cbti-num" data-p="tst-m" placeholder="min"> min</div></div>' +
      '<div class="cbti-field"><label>Fixed rise (out-of-bed) time <span class="cbti-hint">(anchor to obligations)</span></label>' +
        '<input type="time" class="cbti-time" data-p="rise"></div>';
    c1.appendChild(g);
    var pullBtn = el('button', { class: 'cbti-btn cbti-btn-ghost cbti-btn-sm', type: 'button' }, '↓ Pull mean TST from Sleep Diary');
    pullBtn.onclick = function () {
      var avg = diaryAverages();
      if (!avg) { pullBtn.textContent = 'Open & fill the Sleep Diary tab first'; setTimeout(function () { pullBtn.innerHTML = '&#8595; Pull mean TST from Sleep Diary'; }, 2200); return; }
      var mins = Math.round(avg.tst);
      panel.querySelector('[data-p="tst-h"]').value = Math.floor(mins / 60);
      panel.querySelector('[data-p="tst-m"]').value = mins % 60;
      calcInitial();
    };
    c1.appendChild(pullBtn);
    var out1 = el('div', { class: 'cbti-rx' });
    c1.appendChild(out1);
    panel.appendChild(c1);

    function initialTIB() {
      var h = num(val('[data-p="tst-h"]', panel)), m = num(val('[data-p="tst-m"]', panel));
      if (h == null && m == null) return null;
      var mins = (h || 0) * 60 + (m || 0);
      return mins;
    }
    function calcInitial() {
      var tst = initialTIB();
      var rise = val('[data-p="rise"]', panel);
      if (tst == null) { out1.innerHTML = '<span class="cbti-rx-empty">Enter baseline mean sleep time to compute the prescription.</span>'; return; }
      var floored = Math.max(tst, 300); // 5-hour floor
      var rxTIB = Math.round(floored / 5) * 5; // round to 5 min
      var bedStr = '—';
      if (toMin(rise) != null) {
        var bed = (toMin(rise) - rxTIB) % 1440; if (bed < 0) bed += 1440;
        var bh = Math.floor(bed / 60), bm = bed % 60;
        bedStr = (bh < 10 ? '0' + bh : bh) + ':' + (bm < 10 ? '0' + bm : bm);
      }
      var note = (tst < 300) ? '<div class="cbti-rx-note">Mean sleep is below 5 h; prescription is held at the <strong>5-hour floor</strong> rather than restricting further.</div>' : '';
      out1.innerHTML =
        '<div class="cbti-rx-grid">' +
          '<div class="cbti-rx-item"><span class="cbti-rx-val">' + fmtHM(rxTIB) + '</span><span class="cbti-rx-lab">Prescribed time in bed</span></div>' +
          '<div class="cbti-rx-item"><span class="cbti-rx-val">' + bedStr + '</span><span class="cbti-rx-lab">Prescribed bedtime</span></div>' +
          '<div class="cbti-rx-item"><span class="cbti-rx-val">' + (rise || '—') + '</span><span class="cbti-rx-lab">Fixed rise time</span></div>' +
        '</div>' + note;
    }
    c1.addEventListener('input', calcInitial);
    calcInitial();

    // ── Weekly titration ──
    var c2 = el('div', { class: 'cbti-card' });
    c2.innerHTML = '<h4>2 &middot; Weekly titration</h4>' +
      '<p class="cbti-hint" style="margin:0 0 10px;">Each week, enter the current prescribed time in bed and the past week&rsquo;s mean sleep efficiency to get the next prescription.</p>';
    var g2 = el('div', { class: 'cbti-grid2' });
    g2.innerHTML =
      '<div class="cbti-field"><label>Current time in bed <span class="cbti-hint">(hours : minutes)</span></label>' +
        '<div class="cbti-hm"><input type="number" min="0" max="14" step="1" class="cbti-num" data-t="tib-h" placeholder="h"> h ' +
        '<input type="number" min="0" max="59" step="5" class="cbti-num" data-t="tib-m" placeholder="min"> min</div></div>' +
      '<div class="cbti-field"><label>Past week&rsquo;s mean sleep efficiency</label>' +
        '<input type="number" min="0" max="100" step="1" class="cbti-num" data-t="se" placeholder="%"> %</div>';
    c2.appendChild(g2);
    var pullSE = el('button', { class: 'cbti-btn cbti-btn-ghost cbti-btn-sm', type: 'button' }, '↓ Pull mean SE from Sleep Diary');
    pullSE.onclick = function () {
      var avg = diaryAverages();
      if (!avg) { pullSE.textContent = 'Open & fill the Sleep Diary tab first'; setTimeout(function () { pullSE.innerHTML = '&#8595; Pull mean SE from Sleep Diary'; }, 2200); return; }
      panel.querySelector('[data-t="se"]').value = Math.round(avg.se);
      calcTitrate();
    };
    c2.appendChild(pullSE);
    var out2 = el('div', { class: 'cbti-rx' });
    c2.appendChild(out2);
    panel.appendChild(c2);

    function calcTitrate() {
      var h = num(val('[data-t="tib-h"]', panel)), m = num(val('[data-t="tib-m"]', panel));
      var se = num(val('[data-t="se"]', panel));
      if ((h == null && m == null) || se == null) { out2.innerHTML = '<span class="cbti-rx-empty">Enter current time in bed and sleep efficiency for a recommendation.</span>'; return; }
      var cur = (h || 0) * 60 + (m || 0);
      var rec, deltaTxt, band, next;
      if (se >= 90) { rec = 'Increase'; next = cur + 15; deltaTxt = '+15 min'; band = 'cbti-se-high'; }
      else if (se >= 85) { rec = 'Hold'; next = cur; deltaTxt = 'no change'; band = 'cbti-se-mod'; }
      else { rec = 'Decrease'; next = Math.max(cur - 15, 300); deltaTxt = (next === cur ? 'at 5-hour floor' : '−15 min'); band = 'cbti-se-low'; }
      var floorNote = (se < 85 && next === 300 && cur <= 300) ? '<div class="cbti-rx-note">Already at the 5-hour floor &mdash; hold rather than restrict further, and revisit adherence, comorbid sleep disorders, and daytime safety.</div>' : '';
      out2.innerHTML =
        '<div class="cbti-rec ' + band + '"><span class="cbti-rec-verb">' + rec + '</span> time in bed (' + deltaTxt + ')</div>' +
        '<div class="cbti-rx-grid">' +
          '<div class="cbti-rx-item"><span class="cbti-rx-val">' + fmtHM(cur) + '</span><span class="cbti-rx-lab">Current TIB</span></div>' +
          '<div class="cbti-rx-item"><span class="cbti-rx-val">' + fmtHM(next) + '</span><span class="cbti-rx-lab">Next week&rsquo;s TIB</span></div>' +
          '<div class="cbti-rx-item"><span class="cbti-rx-val">' + Math.round(se) + '%</span><span class="cbti-rx-lab">Sleep efficiency</span></div>' +
        '</div>' + floorNote +
        '<p class="cbti-hint" style="margin:10px 0 0;">Keep the rise time fixed; apply the change to bedtime. Thresholds (&ge;90 / 85&ndash;89 / &lt;85) vary between protocols &mdash; adjust to your setting.</p>';
    }
    c2.addEventListener('input', calcTitrate);
    calcTitrate();

    var actions = el('div', { class: 'cbti-actions' });
    var copy = el('button', { class: 'cbti-btn', type: 'button' }, 'Copy prescription');
    copy.onclick = function () {
      var lines = ['CBT-I SLEEP PRESCRIPTION', 'Date: ' + dateStamp(), '', out1.textContent.replace(/\s+/g, ' ').trim(), '', 'TITRATION: ' + out2.textContent.replace(/\s+/g, ' ').trim()];
      copyBtn(lines.join('\n'), copy);
    };
    actions.appendChild(copy);
    panel.appendChild(actions);
    return panel;
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  STIMULUS CONTROL tab (interactive checklist)
  // ═══════════════════════════════════════════════════════════════════════
  var SC_RULES = [
    ['Go to bed only when sleepy', 'Sleepy (eyes heavy, nodding) is not the same as tired or bored. Waiting for true sleepiness prevents long, frustrating time awake in bed.'],
    ['Use the bed only for sleep and sex', 'No phone, TV, laptop, reading, eating, working, or worrying in bed. This rebuilds the bed&rsquo;s association with sleep.'],
    ['If not asleep in ~15&ndash;20 minutes, get out of bed', 'Judge by feel, not the clock. Go to another room, do something quiet and calm in dim light, and return only when sleepy. Repeat as many times as needed, including on middle-of-the-night awakenings.'],
    ['Keep a fixed rise time every day', 'Get up at the same time seven days a week regardless of how you slept &mdash; this anchors the circadian rhythm and builds sleep drive.'],
    ['Do not nap during the day', 'Napping discharges the sleep drive you are trying to build. If a nap is unavoidable, keep it brief and early.']
  ];
  function buildStimulusControl() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'cbti-ws-intro' },
      'Bootzin&rsquo;s stimulus-control instructions, as a personalizable adherence checklist. Review each rule with its rationale, tick the ones the client is working on, and note the individualized plan and obstacles. Bring this back each week to review adherence &mdash; under-delivery of stimulus control is a common reason CBT-I underperforms.'));

    var card = el('div', { class: 'cbti-card' });
    card.appendChild(el('h4', null, 'Stimulus-control plan'));
    var list = el('div', { class: 'cbti-sc-list' });
    SC_RULES.forEach(function (rule, i) {
      var row = el('div', { class: 'cbti-sc-item' });
      row.innerHTML =
        '<label class="cbti-sc-head"><input type="checkbox" data-sc="' + i + '"> <span class="cbti-sc-rule">' + rule[0] + '</span></label>' +
        '<div class="cbti-sc-why">' + rule[1] + '</div>';
      var note = el('textarea', { class: 'cbti-sc-note', placeholder: 'Individualized plan / obstacles / this-week adherence…', 'data-scnote': i });
      row.appendChild(note);
      list.appendChild(row);
    });
    card.appendChild(list);
    panel.appendChild(card);

    var actions = el('div', { class: 'cbti-actions' });
    var copy = el('button', { class: 'cbti-btn', type: 'button' }, 'Copy plan');
    copy.onclick = function () {
      var lines = ['CBT-I STIMULUS-CONTROL PLAN', 'Date: ' + dateStamp(), ''];
      SC_RULES.forEach(function (rule, i) {
        var on = panel.querySelector('[data-sc="' + i + '"]').checked;
        var note = val('[data-scnote="' + i + '"]', panel);
        lines.push('  [' + (on ? 'x' : ' ') + '] ' + rule[0].replace(/&[a-z]+;/g, '-') + (note ? '\n        → ' + note : ''));
      });
      copyBtn(lines.join('\n'), copy);
    };
    actions.appendChild(copy);
    panel.appendChild(actions);
    return panel;
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  COGNITIVE RESTRUCTURING tab
  // ═══════════════════════════════════════════════════════════════════════
  function buildCognitive() {
    var panel = el('div');
    panel.appendChild(el('p', { class: 'cbti-ws-intro' },
      'Identify and restructure the dysfunctional beliefs about sleep that fuel nighttime arousal and daytime distress. For each belief, rate how strongly it is held, weigh the evidence for and against, and build a balanced alternative &mdash; then re-rate. Common targets: unrealistic sleep-need expectations, catastrophizing about the consequences of a poor night, and the belief that sleep is controllable through effort.'));

    var card = el('div', { class: 'cbti-card' });
    card.appendChild(el('h4', null, 'Belief record'));
    var t = buildTable([
      { key: 'belief', label: 'Unhelpful belief / thought about sleep', type: 'textarea' },
      { key: 'before', label: 'Belief % (before)', type: 'pct', width: '78px' },
      { key: 'for', label: 'Evidence for', type: 'textarea' },
      { key: 'against', label: 'Evidence against', type: 'textarea' },
      { key: 'balanced', label: 'Balanced / alternative belief', type: 'textarea' },
      { key: 'after', label: 'Belief % (after)', type: 'pct', width: '78px' }
    ], { addLabel: '+ Add belief', starter: [
      { belief: 'If I don’t get 8 hours, I won’t be able to function tomorrow.' },
      { belief: 'I’ve lost control over my ability to sleep.' },
      { belief: 'I must make up for lost sleep by sleeping in or napping.' }
    ] });
    card.appendChild(t);
    panel.appendChild(card);

    var ref = el('div', { class: 'cbti-callout cbti-tip' });
    ref.innerHTML = '<span class="cbti-callout-title">Common dysfunctional beliefs about sleep (DBAS themes)</span>' +
      'Unrealistic sleep-need expectations &middot; misattribution of daytime impairment solely to sleep &middot; catastrophizing after a poor night &middot; belief that sleep is uncontrollable &middot; unhelpful sleep-promoting practices (long lie-ins, effortful &ldquo;trying&rdquo;). Aim for balanced, evidence-based alternatives rather than mere reassurance.';
    panel.appendChild(ref);

    var actions = el('div', { class: 'cbti-actions' });
    var copy = el('button', { class: 'cbti-btn', type: 'button' }, 'Copy belief record');
    copy.onclick = function () {
      var lines = ['CBT-I COGNITIVE RESTRUCTURING', 'Date: ' + dateStamp(), ''];
      t._readRows().forEach(function (r) {
        lines.push('BELIEF: ' + (r.belief || '-') + (r.before ? ' [' + r.before + '%]' : ''));
        if (r.for) lines.push('  Evidence for: ' + r.for);
        if (r.against) lines.push('  Evidence against: ' + r.against);
        if (r.balanced) lines.push('  Balanced belief: ' + r.balanced + (r.after ? ' [' + r.after + '%]' : ''));
        lines.push('');
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
    { id: 'diary', label: 'Sleep Diary', build: buildDiary },
    { id: 'prescription', label: 'Sleep Prescription', build: buildPrescription },
    { id: 'stimulus', label: 'Stimulus Control', build: buildStimulusControl },
    { id: 'cognitive', label: 'Cognitive Restructuring', build: buildCognitive }
  ];

  var meta = el('div', { class: 'cbti-meta' });
  meta.innerHTML =
    '<span class="cbti-chip cbti-chip-accent">Module 9 of 9</span>' +
    '<span class="cbti-chip">CBT-I</span>' +
    '<span class="cbti-chip">Chronic insomnia</span>' +
    '<span class="cbti-chip">First-line treatment</span>' +
    '<span class="cbti-chip">Clinician / trainee</span>' +
    '<span class="cbti-chip">~4&ndash;6 contact hours</span>';
  root.appendChild(meta);

  // Print / Save-as-PDF: build every panel, then print.
  var printBar = el('div', { class: 'cbti-actions' });
  var printBtn = el('button', { class: 'cbti-btn cbti-btn-ghost cbti-btn-sm', type: 'button' }, '');
  printBtn.innerHTML = '&#128424; Print / Save as PDF';
  printBtn.onclick = function () {
    var allTabs = tabBar.querySelectorAll('.cbti-tab');
    Array.prototype.forEach.call(allTabs, function (b) { b.click(); });
    if (allTabs[0]) allTabs[0].click();
    window.print();
  };
  printBar.appendChild(printBtn);
  root.appendChild(printBar);

  var tabBar = el('div', { class: 'cbti-tabs' });
  var panels = el('div');
  TABS.forEach(function (t, i) {
    var btn = el('button', { class: 'cbti-tab' + (i === 0 ? ' cbti-active' : ''), type: 'button' }, t.label);
    var panel = el('div', { class: 'cbti-panel' + (i === 0 ? ' cbti-active' : '') });
    var built = false;
    function activate() {
      tabBar.querySelectorAll('.cbti-tab').forEach(function (b) { b.classList.remove('cbti-active'); });
      panels.querySelectorAll('.cbti-panel').forEach(function (p) { p.classList.remove('cbti-active'); });
      btn.classList.add('cbti-active');
      panel.classList.add('cbti-active');
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
    if (idx > -1) tabBar.querySelectorAll('.cbti-tab')[idx].click();
  }
})();

/* ══════════════════════════════════════════════════════════════════════════
   Tolerability Comparison tool  (js/tools/tolerability-compare.js)
   Third tab under "Binding & Comparison". Head-to-head of relative side-effect
   tiers with a clinician view and a simplified patient view.

   HYBRID coverage:
     • Tolerability tier visuals + patient dots are DATA-DRIVEN for any med
       (TOL_DATA, straight from psychopharm-tolerability.csv).
     • Class safety is keyed by drug class (CLASS_SAFETY) — universal.
     • Rich blocks (at-a-glance, incidence, pearls, patient specifics) render
       only where CURATED content exists — seeded with Fetzima / Savella.
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var root = document.getElementById('tolerability-compare');
  if (!root || root.dataset.tcInit === '1') return;
  root.dataset.tcInit = '1';

  /* ── tier scaffolding ──────────────────────────────────────────────────── */
  var TIER_POS = { none: 7, minimal: 30, low: 52, moderate: 74, high: 93 };
  var TIER_LABEL = { none: 'None', minimal: 'Minimal', low: 'Low', moderate: 'Moderate', high: 'High' };
  var TIER_LEVEL = { none: 1, minimal: 1, low: 2, moderate: 3, high: 4 };
  var LEVEL_WORD = { 1: 'Uncommon', 2: 'Sometimes', 3: 'Fairly common', 4: 'Common' };
  var DCOLORS = ['var(--tc-d1)', 'var(--tc-d2)', 'var(--tc-d3)', 'var(--tc-d4)'];
  var DCOLORHEX = ['#356a8f', '#a4562a', '#5f7a2b', '#7d5a9c'];

  /* ── DATA: [generic, brand, class, weight, sedation, sexual, anticholinergic, qtc]
        tiers straight from psychopharm-tolerability.csv (clinician-reviewed 2026-08-20) */
  var RAW = [
    ['Gepirone', 'Exxua', 'Azapirone', 'minimal', 'minimal', 'minimal', 'minimal', 'moderate'],
    ['Dextromethorphan/Bupropion', 'Auvelity', 'Combination', 'minimal', 'low', 'low', 'minimal', 'minimal'],
    ['Chlorpromazine', 'Thorazine', 'FGA', 'moderate', 'high', 'moderate', 'moderate', 'moderate'],
    ['Fluphenazine', 'Prolixin', 'FGA', 'low', 'low', 'moderate', 'low', 'low'],
    ['Haloperidol', 'Haldol', 'FGA', 'low', 'low', 'moderate', 'minimal', 'moderate'],
    ['Loxapine', 'Loxitane', 'FGA', 'low', 'moderate', 'low', 'low', 'low'],
    ['Molindone', 'Moban', 'FGA', 'minimal', 'low', 'low', 'minimal', 'minimal'],
    ['Perphenazine', 'Trilafon', 'FGA', 'low', 'low', 'moderate', 'low', 'low'],
    ['Pimozide', 'Orap', 'FGA', 'low', 'low', 'moderate', 'low', 'high'],
    ['Thioridazine', 'Mellaril', 'FGA', 'moderate', 'high', 'high', 'high', 'high'],
    ['Thiothixene', 'Navane', 'FGA', 'low', 'low', 'moderate', 'low', 'low'],
    ['Trifluoperazine', 'Stelazine', 'FGA', 'low', 'low', 'moderate', 'low', 'low'],
    ['Phenelzine', 'Nardil', 'MAOI', 'moderate', 'moderate', 'high', 'low', 'low'],
    ['Tranylcypromine', 'Parnate', 'MAOI', 'low', 'minimal', 'moderate', 'low', 'low'],
    ['Bupropion', 'Wellbutrin', 'NDRI', 'minimal', 'minimal', 'minimal', 'minimal', 'minimal'],
    ['Esketamine', 'Spravato', 'NMDA Antagonist', 'minimal', 'moderate', 'minimal', 'minimal', 'minimal'],
    ['Mirtazapine', 'Remeron', 'NaSSA', 'high', 'high', 'minimal', 'low', 'low'],
    ['Brexanolone', 'Zulresso', 'Neuroactive Steroid', 'none', 'high', 'none', 'none', 'minimal'],
    ['Zuranolone', 'Zurzuvae', 'Neuroactive Steroid', 'minimal', 'high', 'minimal', 'minimal', 'minimal'],
    ['Trazodone', 'Desyrel', 'SARI', 'low', 'high', 'low', 'minimal', 'moderate'],
    ['Aripiprazole', 'Abilify', 'SGA', 'low', 'minimal', 'minimal', 'minimal', 'minimal'],
    ['Asenapine', 'Saphris', 'SGA', 'low', 'moderate', 'low', 'minimal', 'low'],
    ['Brexpiprazole', 'Rexulti', 'SGA', 'low', 'low', 'minimal', 'minimal', 'minimal'],
    ['Cariprazine', 'Vraylar', 'SGA', 'low', 'minimal', 'minimal', 'minimal', 'minimal'],
    ['Clozapine', 'Clozaril', 'SGA', 'high', 'high', 'low', 'high', 'moderate'],
    ['Iloperidone', 'Fanapt', 'SGA', 'moderate', 'moderate', 'moderate', 'minimal', 'high'],
    ['Lumateperone', 'Caplyta', 'SGA', 'minimal', 'low', 'minimal', 'minimal', 'minimal'],
    ['Lurasidone', 'Latuda', 'SGA', 'minimal', 'low', 'minimal', 'minimal', 'minimal'],
    ['Olanzapine', 'Zyprexa', 'SGA', 'high', 'high', 'low', 'moderate', 'low'],
    ['Paliperidone', 'Invega', 'SGA', 'moderate', 'low', 'high', 'minimal', 'low'],
    ['Pimavanserin', 'Nuplazid', 'SGA', 'minimal', 'minimal', 'none', 'minimal', 'moderate'],
    ['Quetiapine', 'Seroquel', 'SGA', 'moderate', 'high', 'minimal', 'low', 'moderate'],
    ['Risperidone', 'Risperdal', 'SGA', 'moderate', 'low', 'high', 'minimal', 'low'],
    ['Ziprasidone', 'Geodon', 'SGA', 'minimal', 'moderate', 'low', 'minimal', 'high'],
    ['Desvenlafaxine', 'Pristiq', 'SNRI', 'low', 'low', 'moderate', 'minimal', 'minimal'],
    ['Duloxetine', 'Cymbalta', 'SNRI', 'low', 'low', 'moderate', 'low', 'minimal'],
    ['Levomilnacipran', 'Fetzima', 'SNRI', 'minimal', 'low', 'moderate', 'minimal', 'minimal'],
    ['Milnacipran', 'Savella', 'SNRI', 'minimal', 'low', 'moderate', 'low', 'minimal'],
    ['Venlafaxine', 'Effexor', 'SNRI', 'low', 'low', 'high', 'minimal', 'low'],
    ['Citalopram', 'Celexa', 'SSRI', 'low', 'low', 'high', 'minimal', 'moderate'],
    ['Escitalopram', 'Lexapro', 'SSRI', 'low', 'low', 'high', 'minimal', 'low'],
    ['Fluoxetine', 'Prozac', 'SSRI', 'minimal', 'minimal', 'high', 'minimal', 'minimal'],
    ['Fluvoxamine', 'Luvox', 'SSRI', 'low', 'moderate', 'high', 'minimal', 'low'],
    ['Paroxetine', 'Paxil', 'SSRI', 'moderate', 'moderate', 'high', 'moderate', 'low'],
    ['Sertraline', 'Zoloft', 'SSRI', 'low', 'low', 'high', 'minimal', 'minimal'],
    ['Vilazodone', 'Viibryd', 'SSRI/5HT1A', 'minimal', 'low', 'low', 'minimal', 'minimal'],
    ['Vortioxetine', 'Trintellix', 'SSRI/5HT1A', 'minimal', 'minimal', 'low', 'minimal', 'minimal'],
    ['Amitriptyline', 'Elavil', 'TCA', 'high', 'high', 'moderate', 'high', 'high'],
    ['Doxepin', 'Sinequan / Silenor', 'TCA', 'moderate', 'high', 'low', 'high', 'moderate'],
    ['Imipramine', 'Tofranil', 'TCA', 'moderate', 'moderate', 'moderate', 'high', 'high'],
    ['Nortriptyline', 'Pamelor', 'TCA', 'moderate', 'moderate', 'low', 'moderate', 'moderate']
  ];
  var AXES = ['weight', 'sedation', 'sexual', 'anticholinergic', 'qtc'];
  var TOL = {};
  RAW.forEach(function (r) {
    TOL[r[0]] = {
      generic: r[0], brand: r[1], cls: r[2],
      weight: r[3], sedation: r[4], sexual: r[5], anticholinergic: r[6], qtc: r[7]
    };
  });

  /* clinician tolerability row labels */
  var TOL_ROWS = [
    ['weight', 'Weight gain', ''],
    ['sedation', 'Sedation', 'drowsiness'],
    ['sexual', 'Sexual', 'libido / function'],
    ['anticholinergic', 'Anticholinergic', 'dry mouth · constipation'],
    ['qtc', 'QTc', 'heart-rhythm effect']
  ];
  /* patient-facing derived rows (simplified: QTc & anticholinergic jargon dropped) */
  var PAT_DERIVED = [
    ['weight', 'Weight gain', ''],
    ['sedation', 'Sleepiness', ''],
    ['sexual', 'Sexual side effects', '']
  ];

  /* ── CLASS SAFETY (universal, keyed by class) ──────────────────────────── */
  var AD_BASE = [
    'Boxed warning: suicidal thoughts/behavior in patients <25, early in treatment and at dose changes',
    'Screen for bipolarity — antidepressants can precipitate mania/hypomania',
    'Discontinuation syndrome if stopped abruptly — taper',
    'Hyponatremia / SIADH, especially in older adults'
  ];
  var SEROTONERGIC = [
    'Serotonin syndrome risk — caution with other serotonergic agents and MAOIs',
    'Increased bleeding risk with NSAIDs, aspirin, or anticoagulants'
  ];
  var CLASS_SAFETY = {
    SSRI: { clin: AD_BASE.concat(SEROTONERGIC, ['Sexual dysfunction and GI upset are common early effects']),
      pt: ['mood', 'serotonin', 'stop', 'bleed'] },
    SNRI: { clin: AD_BASE.concat(SEROTONERGIC, ['Can raise blood pressure and heart rate — monitor BP/HR', 'Urinary hesitancy with stronger noradrenergic activity']),
      pt: ['mood', 'heart', 'serotonin', 'stop', 'bleed'] },
    'SSRI/5HT1A': { clin: AD_BASE.concat(SEROTONERGIC, ['Generally lower sexual dysfunction than classic SSRIs']),
      pt: ['mood', 'serotonin', 'stop', 'bleed'] },
    SARI: { clin: AD_BASE.concat(SEROTONERGIC, ['Sedation and orthostasis; rare priapism — seek care for prolonged erection', 'QTc prolongation at higher doses']),
      pt: ['mood', 'serotonin', 'stop', 'bleed'] },
    NaSSA: { clin: AD_BASE.concat(['Marked sedation and appetite/weight gain; comparatively low sexual/GI effects', 'Rare agranulocytosis']),
      pt: ['mood', 'stop'] },
    NDRI: { clin: AD_BASE.concat(['Dose-related seizure risk — contraindicated in seizure disorders, active eating disorders, abrupt sedative/alcohol withdrawal', 'Activating: insomnia, jitteriness; low sexual dysfunction']),
      pt: ['mood', 'stop', 'seizure'] },
    MAOI: { clin: AD_BASE.concat(['Hypertensive crisis with tyramine-rich foods and sympathomimetics — dietary counseling essential', 'Serotonin syndrome with many drugs — strict washout periods required']),
      pt: ['mood', 'diet', 'serotonin', 'stop'] },
    Azapirone: { clin: AD_BASE.concat(SEROTONERGIC, ['Baseline/periodic ECG per labeling — QTc effect']),
      pt: ['mood', 'serotonin', 'stop'] },
    Combination: { clin: AD_BASE.concat(SEROTONERGIC, ['Component-specific effects — review each ingredient']),
      pt: ['mood', 'serotonin', 'stop'] },
    'NMDA Antagonist': { clin: AD_BASE.concat(['Sedation, dissociation, and transient BP rise — post-dose monitoring per REMS', 'Abuse potential']),
      pt: ['mood', 'heart', 'stop'] },
    'Neuroactive Steroid': { clin: AD_BASE.concat(['Marked sedation — do not drive until ≥12 h and effects assessed', 'CNS depression additive with alcohol/sedatives']),
      pt: ['mood', 'sleepy'] },
    SGA: { clin: [
      'Metabolic risk: weight gain, dyslipidemia, hyperglycemia/diabetes — monitor weight, lipids, glucose',
      'EPS and akathisia; tardive dyskinesia with long-term use',
      'Hyperprolactinemia (agent-dependent); QTc prolongation (agent-dependent)',
      'Neuroleptic malignant syndrome (rare); orthostasis and sedation',
      'Boxed warning: increased mortality in elderly patients with dementia-related psychosis'],
      pt: ['movement', 'metabolic', 'heart', 'nms'] },
    FGA: { clin: [
      'Higher EPS, akathisia, and tardive dyskinesia risk than SGAs',
      'Hyperprolactinemia; QTc prolongation (agent-dependent, e.g., pimozide, thioridazine)',
      'Neuroleptic malignant syndrome (rare); orthostasis, sedation, anticholinergic effects',
      'Boxed warning: increased mortality in elderly patients with dementia-related psychosis'],
      pt: ['movement', 'heart', 'nms'] }
  };
  var PT_SAFETY = {
    mood: ['🧠', '<b>Mood changes or thoughts of self-harm</b> — especially in the first weeks or after a dose change, and most important for people under 25.'],
    heart: ['❤️', '<b>A racing or pounding heartbeat, or a jump in blood pressure</b> — these medicines can nudge them up, so your doctor may check them.'],
    serotonin: ['🌡️', '<b>Agitation, sweating, shivering, muscle stiffness or confusion together</b> — rare, but can signal a serious reaction (serotonin syndrome). Seek help.'],
    stop: ['🚫', "<b>Don't stop suddenly.</b> Stopping on your own can cause withdrawal effects — your doctor can help you taper safely."],
    bleed: ['🩸', '<b>Easy bruising or bleeding</b> — more likely if you also take aspirin, NSAIDs (like ibuprofen), or blood thinners.'],
    seizure: ['⚡', '<b>Any seizure or fainting</b> — tell your doctor right away; this type of medicine can rarely lower the seizure threshold.'],
    diet: ['🧀', '<b>Follow the food and medicine list your doctor gives you</b> — certain aged foods and other drugs can cause a dangerous blood-pressure spike with this medicine.'],
    movement: ['🕺', '<b>New restlessness, stiffness, tremor, or unusual movements</b> — tell your doctor; these can often be managed by adjusting the medicine.'],
    metabolic: ['⚖️', '<b>Weight, blood sugar, and cholesterol</b> — this medicine can affect them, so your doctor will check them from time to time.'],
    nms: ['🌡️', '<b>High fever with muscle stiffness and confusion</b> — rare but serious; seek emergency care.'],
    sleepy: ['😴', "<b>Strong drowsiness</b> — don't drive or use machinery until you know how it affects you."]
  };

  /* ── CURATED rich content (seed: Fetzima / Savella) ────────────────────── */
  var CURATED = {
    Levomilnacipran: {
      indication: 'Major depressive disorder (adults)',
      mechanism: 'SNRI, NET>SERT (more NE-weighted)',
      dosing: '20 → 40–120 mg once daily',
      formulation: 'Extended-release capsule',
      firstLine: 'No — later-line SNRI option',
      boxed: 'Suicidality <25 yo',
      incidence: [['Nausea', 17], ['Constipation', 9], ['Sweating', 9], ['↑ Heart rate', 6], ['Erectile dysfunction', 6], ['Vomiting', 5], ['Palpitations', 5]],
      incNote: 'from MDD registration trials (≥5% and ≥2× placebo)',
      ptFor: 'Depression (FDA-approved for adults)',
      ptTake: 'One capsule, once a day',
      ptLikert: [['Nausea / upset stomach', '', 3], ['Sweating', '', 3], ['Faster heartbeat / higher BP', '', 3], ['Sexual side effects', 'more in men', 3], ['Trouble urinating', '', 3], ['Weight gain', '', 1], ['Sleepiness', '', 2]]
    },
    Milnacipran: {
      indication: 'Fibromyalgia only — MDD is off-label in US',
      mechanism: 'SNRI, NET≈/>SERT (racemate)',
      dosing: 'Titrate to 50 mg BID (up to 100 mg BID)',
      formulation: 'Immediate-release tablet',
      firstLine: 'Not an MDD agent per label',
      boxed: 'Suicidality <25 yo (class)',
      incidence: [['Nausea', 37], ['Headache', null], ['Constipation', null], ['Dizziness', null], ['Insomnia', null], ['Hot flush', null], ['Sweating', null], ['Palpitations', null], ['Dry mouth', null]],
      incNote: 'from fibromyalgia trials (different population)',
      ptFor: 'Approved for fibromyalgia (pain). Using it for depression would be "off-label."',
      ptTake: 'A tablet, usually twice a day',
      ptLikert: [['Nausea / upset stomach', '', 4], ['Sweating', '', 3], ['Faster heartbeat / higher BP', '', 3], ['Sexual side effects', 'more in men', 3], ['Trouble urinating', '', 2], ['Weight gain', '', 1], ['Sleepiness', '', 2]]
    }
  };
  /* curated multi-drug SETS keyed by sorted generics — pearls + vsNote */
  var CURATED_SETS = {
    'Levomilnacipran|Milnacipran': {
      vsNote: 'Levomilnacipran is the more active enantiomer of racemic milnacipran · both NET>SERT-leaning, more NE-weighted for Fetzima',
      pearls: [
        '<b>Enantiomer relationship:</b> Fetzima (levomilnacipran) is the purified more-active isomer of the racemate in Savella — expect qualitatively similar effects with a more NE-weighted profile.',
        '<b>Indication drives the choice:</b> only Fetzima is FDA-approved and studied for depression in the US; using Savella for MDD is off-label.',
        '<b>NET-forward side effects:</b> urinary hesitancy, sweating, and cardiovascular signals (HR/BP) tend to stand out more than for SSRIs; nausea is the most common early complaint for both and often settles.',
        '<b>Not first-line:</b> neither is a typical first SNRI choice versus better-studied options; individual tolerance varies widely.'
      ],
      good: [
        'Nausea is the most common early effect for both — it often eases over the first weeks, and taking it with food can help.',
        'Neither tends to cause much weight gain (some people even lose a little).',
        'Because they work in similar ways, their side effects are broadly similar.',
        'Some people simply tolerate one better than the other — that’s normal.'
      ]
    }
  };

  /* ── build the DOM shell ───────────────────────────────────────────────── */
  var host = document.getElementById('tc-body');
  var genericsSorted = Object.keys(TOL).sort();
  var state = { n: 2, picks: ['Levomilnacipran', 'Milnacipran', '', ''], view: 'clin' };

  function optionsHTML(sel) {
    var out = '<option value="">— Select medication —</option>';
    genericsSorted.forEach(function (g) {
      var d = TOL[g];
      out += '<option value="' + g + '"' + (g === sel ? ' selected' : '') + '>' + d.brand + ' (' + g + ')</option>';
    });
    return out;
  }
  function buildSlots() {
    var slots = document.getElementById('tc-slots');
    var html = '';
    for (var i = 0; i < state.n; i++) {
      html += '<div class="tc-slot d' + (i + 1) + '"><label>Drug ' + (i + 1) + '</label>' +
        '<select data-slot="' + i + '">' + optionsHTML(state.picks[i]) + '</select></div>';
    }
    slots.innerHTML = html;
    slots.querySelectorAll('select').forEach(function (s) {
      s.addEventListener('change', function () {
        state.picks[parseInt(s.dataset.slot, 10)] = s.value;
        render();
      });
    });
  }

  /* ── helpers ───────────────────────────────────────────────────────────── */
  function selected() {
    var out = [];
    for (var i = 0; i < state.n; i++) { if (state.picks[i] && TOL[state.picks[i]]) out.push(TOL[state.picks[i]]); }
    // de-dupe
    var seen = {}, uniq = [];
    out.forEach(function (d) { if (!seen[d.generic]) { seen[d.generic] = 1; uniq.push(d); } });
    return uniq;
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function setKey(list) { return list.map(function (d) { return d.generic; }).sort().join('|'); }

  /* ── render tolerability head-to-head (universal) ──────────────────────── */
  function renderTol(list) {
    var legend = '<div class="tc-legend">';
    list.forEach(function (d, i) {
      legend += '<span class="tc-key"><span class="tc-dot" style="background:' + DCOLORS[i] + '">' + (i + 1) + '</span>' + esc(d.brand) + '</span>';
    });
    legend += '<span style="color:var(--text-muted)">Left = lower burden · Right = higher</span></div>';

    var rows = '';
    TOL_ROWS.forEach(function (ax) {
      var key = ax[0], label = ax[1], sub = ax[2];
      var tiers = list.map(function (d) { return d[key]; });
      var differs = tiers.some(function (t) { return t !== tiers[0]; });
      // markers (nudge apart when identical positions collide)
      var positions = list.map(function (d) { return TIER_POS[d[key]]; });
      var adj = positions.slice();
      for (var i = 0; i < adj.length; i++) {
        for (var j = 0; j < i; j++) {
          if (Math.abs(adj[i] - adj[j]) < 4) { adj[i] = Math.min(96, adj[i] + 3); adj[j] = Math.max(4, adj[j] - 3); }
        }
      }
      var marks = '', chips = '';
      list.forEach(function (d, i) {
        marks += '<span class="tc-mk" style="left:' + adj[i] + '%;background:' + DCOLORS[i] + '" title="' + esc(d.brand) + ' — ' + TIER_LABEL[d[key]] + '">' + (i + 1) + '</span>';
        chips += '<span class="tc-chip"><span class="cdot" style="background:' + DCOLORS[i] + '"></span>' + esc(d.brand) + ': <b>' + TIER_LABEL[d[key]] + '</b></span>';
      });
      rows += '<div class="tc-row"><div class="tc-label">' + label + (sub ? '<small>' + sub + '</small>' : '') +
        (differs ? '<span class="badge">↔ differs</span>' : '') + '</div>' +
        '<div><div class="tc-track">' + marks + '</div><div class="tc-readout">' + chips + '</div></div></div>';
    });

    return '<h2 class="tc-h2">Tolerability — head to head</h2>' +
      '<p class="tc-desc">Relative tiers (none · minimal · low · moderate · high) within the psychotropic landscape — not absolute incidence. Marker position <em>is</em> the tier; each is numbered and labeled so it never rests on color. Rows marked <b>differs</b> are where these agents separate.</p>' +
      '<div class="tc-panel">' + legend +
      '<div class="tc-grid">' + rows + '</div>' +
      '<div class="tc-scale-ends"><span><em>Lower</em><em>Higher</em></span></div></div>';
  }

  /* ── at-a-glance (curated) ─────────────────────────────────────────────── */
  function renderFacts(list) {
    var anyCur = list.some(function (d) { return CURATED[d.generic]; });
    if (!anyCur) return '';
    var fields = [
      ['indication', 'FDA indication'], ['mechanism', 'Mechanism lean'],
      ['dosing', 'Dosing'], ['formulation', 'Formulation'],
      ['firstLine', 'First-line?'], ['boxed', 'Boxed warning']
    ];
    var cols = list.length;
    var head = '<div class="fh rk"></div>';
    list.forEach(function (d, i) { head += '<div class="fh" style="color:' + DCOLORS[i] + '">' + esc(d.brand) + '</div>'; });
    var body = '';
    fields.forEach(function (f) {
      body += '<div class="rk">' + f[1] + '</div>';
      list.forEach(function (d) {
        var c = CURATED[d.generic];
        body += '<div>' + (c && c[f[0]] ? esc(c[f[0]]) : '—') + '</div>';
      });
    });
    return '<h2 class="tc-h2">At a glance</h2>' +
      '<div class="tc-panel" style="padding:6px 22px"><div class="tc-facts" style="grid-template-columns:150px repeat(' + cols + ',1fr)">' +
      head + body + '</div></div>';
  }

  /* ── incidence (curated) ───────────────────────────────────────────────── */
  function renderIncidence(list) {
    var withInc = list.filter(function (d) { return CURATED[d.generic] && CURATED[d.generic].incidence; });
    if (!withInc.length) return '';
    var max = 40;
    // union of labels, preserving order of appearance
    var labels = [], seen = {};
    withInc.forEach(function (d) {
      CURATED[d.generic].incidence.forEach(function (row) { if (!seen[row[0]]) { seen[row[0]] = 1; labels.push(row[0]); } });
    });
    var caveats = withInc.map(function (d) {
      var idx = list.indexOf(d) + 1;
      return '<b>' + esc(d.brand) + '</b> ' + esc(CURATED[d.generic].incNote);
    }).join(' · ');
    var rowsHTML = '';
    labels.forEach(function (lab) {
      var bars = '';
      withInc.forEach(function (d) {
        var i = list.indexOf(d);
        var found = null;
        CURATED[d.generic].incidence.forEach(function (r) { if (r[0] === lab) found = r; });
        if (!found) {
          bars += '<div class="tc-incbar"><span class="who" style="background:' + DCOLORS[i] + '">' + (i + 1) + '</span><div class="track"></div><span class="pct" style="color:var(--text-muted);font-weight:600">—</span></div>';
        } else if (found[1] === null) {
          bars += '<div class="tc-incbar"><span class="who" style="background:' + DCOLORS[i] + '">' + (i + 1) + '</span><div class="track"></div><span class="pct" style="color:var(--text-muted);font-weight:600">reported</span></div>';
        } else {
          bars += '<div class="tc-incbar"><span class="who" style="background:' + DCOLORS[i] + '">' + (i + 1) + '</span><div class="track"><div class="fill" style="width:' + Math.min(100, found[1] / max * 100) + '%;background:' + DCOLORS[i] + '"></div></div><span class="pct">' + (found[1] >= 30 ? '~' : '') + found[1] + '%</span></div>';
        }
      });
      rowsHTML += '<div class="tc-incrow"><div>' + esc(lab) + '</div><div class="tc-incbars">' + bars + '</div></div>';
    });
    return '<h2 class="tc-h2">Documented incidence (labeling)</h2>' +
      '<p class="tc-desc">Where real numbers exist. These come from <b>different trial populations</b>, so read them as within-drug signals, not a clean head-to-head.</p>' +
      '<div class="tc-panel"><div class="tc-caveat">⚠ ' + caveats + '. Population, dose, and duration differ.</div>' +
      '<div class="tc-inc">' + rowsHTML + '</div></div>';
  }

  /* ── class safety (universal) ──────────────────────────────────────────── */
  function renderSafety(list) {
    var classes = [];
    list.forEach(function (d) { if (classes.indexOf(d.cls) === -1) classes.push(d.cls); });
    var bullets = [], seenB = {};
    classes.forEach(function (c) {
      var cs = CLASS_SAFETY[c];
      if (cs) cs.clin.forEach(function (b) { if (!seenB[b]) { seenB[b] = 1; bullets.push(b); } });
    });
    if (!bullets.length) bullets = ['Review full prescribing information for agent-specific warnings and monitoring.'];
    var clsLabel = classes.join(' · ');
    return '<h2 class="tc-h2">Class safety &amp; monitoring</h2>' +
      '<div class="tc-callout warn"><h3>⚠ Key risks — ' + esc(clsLabel) + '</h3><ul>' +
      bullets.map(function (b) { return '<li>' + b + '</li>'; }).join('') + '</ul></div>';
  }

  /* ── pearls (curated set) ──────────────────────────────────────────────── */
  function renderPearls(list) {
    var set = CURATED_SETS[setKey(list)];
    if (!set || !set.pearls) return '';
    return '<h2 class="tc-h2">Clinical pearls</h2><div class="tc-panel"><ul class="tc-pearls">' +
      set.pearls.map(function (p) { return '<li>' + p + '</li>'; }).join('') + '</ul></div>';
  }

  /* ── CLINICIAN VIEW ────────────────────────────────────────────────────── */
  function renderClin(list) {
    var set = CURATED_SETS[setKey(list)];
    var heads = '<div class="tc-heads" style="grid-template-columns:repeat(' + list.length + ',1fr)">';
    list.forEach(function (d, i) {
      var c = CURATED[d.generic];
      var tags = '<span class="tc-tag">' + esc(d.cls) + '</span>';
      if (c) {
        if (/off-label|fibromyalgia only/i.test(c.indication)) tags += '<span class="tc-tag off">off-label for MDD</span>';
        else tags += '<span class="tc-tag ok">FDA: ' + esc(c.indication.split('(')[0].trim()) + '</span>';
      }
      heads += '<div class="tc-hero" style="border-top-color:' + DCOLORS[i] + '">' +
        '<div class="brand">' + esc(d.brand) + '</div><div class="generic">' + esc(d.generic) + '</div>' +
        '<div class="tags">' + tags + '</div></div>';
    });
    heads += '</div>';
    var vs = set && set.vsNote ? '<div class="tc-vsnote">' + esc(set.vsNote) + '</div>' : '<div class="tc-vsnote">Relative tolerability tiers from the PsychoPharmRef clinician-reviewed dataset.</div>';
    return heads + vs + renderFacts(list) + renderTol(list) + renderIncidence(list) + renderSafety(list) + renderPearls(list) + foot();
  }

  /* ── PATIENT VIEW (simplified) ─────────────────────────────────────────── */
  function dots(level, i) {
    var out = '';
    for (var k = 1; k <= 4; k++) {
      out += '<span class="tc-pip" style="' + (k <= level ? 'background:' + DCOLORS[i] + ';border-color:' + DCOLORS[i] : '') + '"></span>';
    }
    return out;
  }
  function renderPat(list) {
    var brands = list.map(function (d) { return d.brand; });
    var title = brands.length === 2 ? brands[0] + ' and ' + brands[1] : brands.join(', ');
    var set = CURATED_SETS[setKey(list)];

    var cards = '<div class="tc-pcards" style="grid-template-columns:repeat(' + Math.min(list.length, 2) + ',1fr)">';
    list.forEach(function (d, i) {
      var c = CURATED[d.generic];
      var wtWord = (TIER_LEVEL[d.weight] <= 1) ? 'Usually little to no weight gain' : (TIER_LEVEL[d.weight] >= 4 ? 'Can cause weight gain — worth watching' : 'Some weight gain possible');
      cards += '<div class="tc-pcard" style="border-top-color:' + DCOLORS[i] + '">' +
        '<h4>' + esc(d.brand) + '</h4><div class="pgen">' + esc(d.generic) + '</div>' +
        '<div class="tc-pfact"><span class="ico">🎯</span><span><b>What it treats</b>' + (c ? esc(c.ptFor) : esc(d.cls) + ' medication — ask your doctor about its role for you') + '</span></div>' +
        '<div class="tc-pfact"><span class="ico">💊</span><span><b>How you take it</b>' + (c ? esc(c.ptTake) : 'As prescribed by your doctor') + '</span></div>' +
        '<div class="tc-pfact"><span class="ico">⚖️</span><span><b>Weight</b>' + wtWord + '</span></div></div>';
    });
    cards += '</div>';

    // likert rows: curated per-drug if present, else derived from tiers
    var useCurated = list.every(function (d) { return CURATED[d.generic] && CURATED[d.generic].ptLikert; });
    var likRows = '';
    if (useCurated) {
      // align on union of labels from first drug's curated list (they share structure)
      var labels = CURATED[list[0].generic].ptLikert.map(function (r) { return r[0]; });
      labels.forEach(function (lab, ri) {
        var sub = '';
        var lines = '';
        list.forEach(function (d, i) {
          var row = CURATED[d.generic].ptLikert[ri] || CURATED[d.generic].ptLikert.filter(function (r) { return r[0] === lab; })[0];
          var lvl = row ? row[2] : 1;
          if (row && row[1]) sub = row[1];
          lines += '<div class="tc-pipline"><span class="nm" style="color:' + DCOLORS[i] + '">' + esc(d.brand) + '</span><div class="tc-pipdots">' + dots(lvl, i) + '</div><span class="tc-pipword">' + LEVEL_WORD[lvl] + '</span></div>';
        });
        likRows += '<div class="tc-likrow"><div class="plabel">' + esc(lab) + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</div><div class="tc-pips">' + lines + '</div></div>';
      });
    } else {
      PAT_DERIVED.forEach(function (ax) {
        var lines = '';
        list.forEach(function (d, i) {
          var lvl = TIER_LEVEL[d[ax[0]]];
          lines += '<div class="tc-pipline"><span class="nm" style="color:' + DCOLORS[i] + '">' + esc(d.brand) + '</span><div class="tc-pipdots">' + dots(lvl, i) + '</div><span class="tc-pipword">' + LEVEL_WORD[lvl] + '</span></div>';
        });
        likRows += '<div class="tc-likrow"><div class="plabel">' + ax[1] + '</div><div class="tc-pips">' + lines + '</div></div>';
      });
    }

    var likert = '<h2 class="tc-h2">How likely are common effects?</h2>' +
      '<p class="tc-desc">A general guide, not a promise — everyone responds differently. More filled dots means it tends to happen more often.</p>' +
      '<div class="tc-panel"><div class="tc-likhead"><div></div><div class="scale"><span>Less likely</span><span>More likely</span></div></div>' + likRows + '</div>';

    // good to know
    var goodItems = (set && set.good) ? set.good : [
      'Because they work in similar ways, medicines in the same family often share side effects.',
      'Many early side effects ease over the first few weeks.',
      'Some people simply tolerate one option better than another — that’s normal.'
    ];
    var good = '<div class="tc-good"><h3>Good to know</h3><ul>' + goodItems.map(function (g) { return '<li>' + esc(g) + '</li>'; }).join('') + '</ul></div>';

    // safety rows from class keys (union)
    var keys = [], seenK = {};
    list.forEach(function (d) {
      var cs = CLASS_SAFETY[d.cls];
      if (cs) cs.pt.forEach(function (k) { if (!seenK[k]) { seenK[k] = 1; keys.push(k); } });
    });
    if (keys.indexOf('mood') === -1) keys.unshift('mood');
    var safeRows = keys.map(function (k) {
      var s = PT_SAFETY[k]; if (!s) return '';
      return '<div class="row"><span class="ico">' + s[0] + '</span><span>' + s[1] + '</span></div>';
    }).join('');
    var safe = '<h2 class="tc-h2">Important safety</h2><div class="tc-safe"><h3>Please tell your doctor promptly if you notice</h3>' + safeRows + '</div>';

    var disc = '<div class="tc-disclaimer"><strong>This is not medical advice.</strong> This comparison is for discussion only. Talk with your doctor or psychiatrist about your full health history, other medicines, and goals — they can weigh the benefits and risks, monitor for side effects, and help you start, adjust, or switch safely. Do not start, stop, or change any medication on your own.</div>';

    return '<div class="tc-phero"><h3>Comparing ' + esc(title) + '</h3><p>Here’s how they line up in plain language.</p></div>' +
      cards + likert + good + safe + disc + foot();
  }

  function foot() {
    return '<div class="tc-foot"><b>Tolerability tiers:</b> PsychoPharmRef clinician-reviewed dataset (2026-08-20) synthesizing Maudsley Prescribing Guidelines 14e (2021), Stahl’s Essential Psychopharmacology 5e &amp; Prescriber’s Guide 7e (2021), Cipriani <em>Lancet</em> 2018, and FDA labeling via DailyMed; QTc per CredibleMeds. <b>Incidence figures:</b> FDA product labeling (DailyMed). Relative, dose- and patient-dependent estimates — not a substitute for full prescribing information.</div>';
  }

  /* ── plain-text summary for the copy button ────────────────────────────── */
  function summaryText(list) {
    var lines = [];
    lines.push('MEDICATION TOLERABILITY COMPARISON');
    lines.push(list.map(function (d) { return d.brand + ' (' + d.generic + ')'; }).join('  vs  '));
    lines.push(ToolUtilsDate());
    lines.push('');
    lines.push('Relative tolerability tiers (none<minimal<low<moderate<high):');
    var head = 'Effect'.padEnd(16);
    list.forEach(function (d) { head += (d.brand).padEnd(16); });
    lines.push(head);
    TOL_ROWS.forEach(function (ax) {
      var line = ax[1].padEnd(16);
      list.forEach(function (d) { line += (TIER_LABEL[d[ax[0]]]).padEnd(16); });
      lines.push(line);
    });
    lines.push('');
    lines.push('Relative estimates, dose- and patient-dependent. Not a substitute for full prescribing information.');
    return lines.join('\n');
  }
  function ToolUtilsDate() {
    if (window.ToolUtils && ToolUtils.dateStamp) return ToolUtils.dateStamp();
    return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  /* ── main render ───────────────────────────────────────────────────────── */
  function render() {
    var list = selected();
    if (list.length < 2) {
      host.innerHTML = '<div class="tc-panel" style="text-align:center;color:var(--text-muted)">Select at least two medications above to see the comparison.</div>';
      return;
    }
    host.innerHTML = (state.view === 'clin') ? renderClin(list) : renderPat(list);
  }

  /* ── wire toggle + count pills + copy ──────────────────────────────────── */
  root.querySelectorAll('.tc-seg button').forEach(function (b) {
    b.addEventListener('click', function () {
      state.view = b.dataset.view;
      root.querySelectorAll('.tc-seg button').forEach(function (x) { x.setAttribute('aria-selected', x === b ? 'true' : 'false'); });
      document.getElementById('tc-hint').textContent = state.view === 'clin'
        ? 'Clinician view — full 5-domain tolerability, incidence data, and class safety.'
        : 'Patient view — plain language, simplified effects, take-home safety.';
      render();
    });
  });
  root.querySelectorAll('.tc-count-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      state.n = parseInt(b.dataset.n, 10);
      root.querySelectorAll('.tc-count-btn').forEach(function (x) { x.classList.toggle('active', x === b); });
      buildSlots();
      render();
    });
  });
  var copyBtn = document.getElementById('tc-copy');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var list = selected();
      if (list.length < 2) return;
      var txt = summaryText(list);
      if (window.ToolUtils && ToolUtils.copyWithButton) ToolUtils.copyWithButton(txt, copyBtn);
      else { navigator.clipboard.writeText(txt); var o = copyBtn.textContent; copyBtn.textContent = 'Copied!'; setTimeout(function () { copyBtn.textContent = o; }, 2000); }
    });
  }

  buildSlots();
  render();
})();

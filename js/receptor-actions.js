/* ── Receptor ACTION overlay (Phase 2 of broader complementarity) ────────────
   receptorKi in data.js records AFFINITY (how tightly a drug binds). It says
   nothing about what the drug DOES once bound. Two agents can occupy the same
   receptor and act in opposite directions — a D2 antagonist and a D2 partial
   agonist are not duplicates, they are complements. This file supplies the
   missing dimension.

   Kept as an overlay keyed by medication id rather than edited into data.js,
   so the pharmacology can be reviewed and revised in one place.

   ── Intrinsic activity scale ──────────────────────────────────────────────
   Each action maps to a scalar on a functional axis from full blockade to full
   stimulation. Divergence between two agents at a shared receptor is simply the
   distance between their scalars — which is why "antagonist vs partial agonist"
   scores as meaningfully complementary while "antagonist vs antagonist" scores
   as zero.

        inverse  antagonist   nam   partial   pam   inhibitor   agonist/releaser
        -0.15       0.00      0.15    0.50     0.60    0.75           1.00
        └───────── blocks ─────────┘        └───────── enhances ─────────┘

   'inhibitor' (reuptake blockade) sits on the enhancing side because blocking a
   transporter raises synaptic transmitter — functionally the opposite of
   blocking a postsynaptic receptor.

   ── Defaults vs overrides ─────────────────────────────────────────────────
   DEFAULTS encode the near-universal case for psychotropics (they BLOCK H1,
   alpha1, M1, 5HT2A/2C, alpha2, D1/D2/D3; they INHIBIT the monoamine
   transporters; benzodiazepines/Z-drugs positively modulate GABA-A).
   OVERRIDES carry every clinically meaningful deviation — the partial agonists,
   the releasers, the inverse agonists, the alpha2 agonists.

   5HT1A has NO default: agents at this receptor split between partial agonists,
   full agonists and uncharacterized weak binders, so it must be stated
   explicitly or it is excluded from scoring rather than guessed.

   'unchar' = binds at this receptor but the action is not clinically
   characterized (or the binding is not a functional target). Excluded from
   scoring rather than asserted.

   NOTE: the receptor vocabulary in data.js (18 receptors) does not include
   5HT3, 5HT7 or 5HT1B, so some signature actions (e.g. vortioxetine's 5HT3/5HT7
   antagonism) cannot yet be represented here.
   ────────────────────────────────────────────────────────────────────────── */
(function () {

  // ── Action vocabulary ────────────────────────────────────────────────────
  var ACTIONS = {
    agonist:    { label: 'full agonist',        short: 'agonist',    intrinsic: 1.00 },
    releaser:   { label: 'releasing agent',     short: 'releaser',   intrinsic: 1.00 },
    inhibitor:  { label: 'reuptake inhibitor',  short: 'inhibitor',  intrinsic: 0.75 },
    pam:        { label: 'positive allosteric modulator', short: 'PAM', intrinsic: 0.60 },
    partial:    { label: 'partial agonist',     short: 'partial',    intrinsic: 0.50 },
    nam:        { label: 'negative allosteric modulator', short: 'NAM', intrinsic: 0.15 },
    antagonist: { label: 'antagonist',          short: 'antagonist', intrinsic: 0.00 },
    inverse:    { label: 'inverse agonist',     short: 'inverse',    intrinsic: -0.15 },
    unchar:     { label: 'binding uncharacterized', short: 'uncharacterized', intrinsic: null }
  };
  var RANGE = 1.15;   // agonist (1.00) − inverse (−0.15)

  // ── Per-receptor defaults ────────────────────────────────────────────────
  var DEFAULTS = {
    SERT: 'inhibitor', NET: 'inhibitor', DAT: 'inhibitor',
    '5HT2A': 'antagonist', '5HT2C': 'antagonist',
    D1: 'antagonist', D2: 'antagonist', D3: 'antagonist',
    H1: 'antagonist', alpha1: 'antagonist', alpha2: 'antagonist', M1: 'antagonist',
    'GABA-A': 'pam',
    MT1: 'agonist', MT2: 'agonist',
    OX1R: 'antagonist', OX2R: 'antagonist'
    // 5HT1A intentionally absent — must be stated per drug.
  };

  // ── Per-drug overrides ───────────────────────────────────────────────────
  var OVERRIDES = {

    /* Dopamine-serotonin partial agonists ("third-generation" antipsychotics).
       The D2 partial agonism is the whole point: it stabilizes rather than
       blocks, which is what makes them complementary to D2 antagonists. */
    aripiprazole:   { D2: 'partial', D3: 'partial', '5HT1A': 'partial', SERT: 'unchar' },
    brexpiprazole:  { D2: 'partial', D3: 'partial', '5HT1A': 'partial' },
    cariprazine:    { D2: 'partial', D3: 'partial', '5HT1A': 'partial' },
    // Presynaptic D2 partial agonist / postsynaptic antagonist — represented as
    // partial; the pre/post distinction belongs to a later synaptic-locus phase.
    lumateperone:   { D2: 'partial', '5HT1A': 'partial' },

    /* 5HT1A partial agonists among the atypical antipsychotics */
    quetiapine:     { '5HT1A': 'partial' },
    ziprasidone:    { '5HT1A': 'partial' },
    lurasidone:     { '5HT1A': 'partial' },
    asenapine:      { '5HT1A': 'partial' },
    clozapine:      { '5HT1A': 'partial' },
    iloperidone:    { '5HT1A': 'partial' },

    /* Serotonergic antidepressants & anxiolytics at 5HT1A */
    vilazodone:     { '5HT1A': 'partial' },
    buspirone:      { '5HT1A': 'partial', D2: 'unchar' },   // D2 binding weak / not a functional target
    gepirone:       { '5HT1A': 'partial' },
    trazodone:      { '5HT1A': 'partial' },
    // Vortioxetine is a full 5HT1A agonist (its 5HT3/5HT7/5HT1B actions are not
    // representable in the current receptor vocabulary).
    vortioxetine:   { '5HT1A': 'agonist', NET: 'unchar' },

    /* Alpha-2 AGONISTS — the functional mirror of mirtazapine's alpha-2
       blockade, and a clean teaching contrast. */
    clonidine:      { alpha2: 'agonist', alpha1: 'agonist' },
    guanfacine:     { alpha2: 'agonist' },

    /* Releasing agents — amphetamines reverse transporter flow rather than
       simply blocking it: same target, different mechanism from methylphenidate. */
    'amphetamine-mixed-salts': { DAT: 'releaser', NET: 'releaser', SERT: 'releaser' },
    dextroamphetamine:         { DAT: 'releaser', NET: 'releaser', SERT: 'releaser' },
    lisdexamfetamine:          { DAT: 'releaser', NET: 'releaser', SERT: 'releaser' },

    /* Inverse agonism */
    pimavanserin:   { '5HT2A': 'inverse', '5HT2C': 'inverse' }
  };

  // ── API ──────────────────────────────────────────────────────────────────
  function actionFor(medId, receptor) {
    var o = OVERRIDES[medId];
    if (o && Object.prototype.hasOwnProperty.call(o, receptor)) return o[receptor];
    if (Object.prototype.hasOwnProperty.call(DEFAULTS, receptor)) return DEFAULTS[receptor];
    return null;                                   // unknown → excluded
  }
  function isScorable(action) {
    return !!(action && ACTIONS[action] && ACTIONS[action].intrinsic !== null);
  }
  function intrinsic(action) {
    return (action && ACTIONS[action]) ? ACTIONS[action].intrinsic : null;
  }
  // Functional distance 0–1 between two actions; null when either is unknown.
  function distance(a, b) {
    if (!isScorable(a) || !isScorable(b)) return null;
    var d = Math.abs(intrinsic(a) - intrinsic(b)) / RANGE;
    return Math.max(0, Math.min(1, d));
  }
  function label(action) { return (action && ACTIONS[action]) ? ACTIONS[action].label : 'unknown'; }
  function short(action) { return (action && ACTIONS[action]) ? ACTIONS[action].short : '?'; }

  window.ReceptorActions = {
    ACTIONS: ACTIONS, DEFAULTS: DEFAULTS, OVERRIDES: OVERRIDES, RANGE: RANGE,
    actionFor: actionFor, isScorable: isScorable, intrinsic: intrinsic,
    distance: distance, label: label, short: short
  };
})();

/* ── Combination & Augmentation Strategies (curated knowledge base) ──────────
   Phase 1 of the "broader complementarity" concept. Unlike the computed
   receptor-divergence engine in complementary-meds.js, these pairs are
   EMPIRICAL — the classic, evidence-based combination and augmentation
   strategies that binding math alone will never surface (lithium, T3, and ECT
   have no monoamine receptor fingerprint at all).

   Each entry describes a base ("anchor") agent or class, an agent that is
   ADDED to it, and WHY the pair is rational — expressed in mechanistic terms
   (receptor action, synaptic locus, signal-transduction tier) so the rationale
   teaches, not just recommends.

   Schema
   ──────
   {
     id:         unique slug,
     condition:  human-readable clinical target (display only),
     anchor:     { ids:[...], classes:[...] }   // what the reference must be
     add:        { id:'aripiprazole' }          // links to a drug page, OR
                 { label:'Liothyronine (T3)', external:true, brand:'Cytomel' }
     nickname:   'California Rocket Fuel' | null,
     evidence:   'fda' | 'guideline' | 'empirical',
     rationale:  mechanistic "why they complement",
     monitoring: key cautions / what to watch,
     ref:        short citation / trial name (optional)
   }

   Evidence tiers
   ──────────────
   'fda'       FDA-approved adjunct / combination for this use
   'guideline' Guideline-endorsed or strong RCT support, typically off-label
   'empirical' Common clinical practice / expert consensus, weaker evidence

   Matching (see CombinationStrategies.lookup):
     role 'anchor' → reference IS the base; we suggest ADDING entry.add
     role 'addon'  → reference IS the add-on; entry describes what it augments
   ────────────────────────────────────────────────────────────────────────── */
(function () {
  // Modern serotonergic / atypical antidepressant classes that standard
  // augmentation strategies apply to. MAOIs are deliberately excluded — their
  // combination rules differ and several of these adds (e.g. bupropion) are
  // contraindicated with them, so they get no auto-suggestions (safe default).
  var MODERN_AD = ['SSRI', 'SNRI', 'SSRI/5HT1A', 'NDRI', 'NaSSA', 'SARI'];
  var AD_PLUS_TCA = MODERN_AD.concat(['TCA']);   // lithium & T3 augment TCAs too

  var STRATEGIES = [

    /* ═══ Treatment-Resistant Depression — antipsychotic augmentation ═══════ */
    {
      id: 'trd-aripiprazole',
      condition: 'Treatment-Resistant Depression',
      anchor: { classes: MODERN_AD },
      add: { id: 'aripiprazole' },
      evidence: 'fda',
      rationale: 'D2/D3 partial agonist + 5-HT1A partial agonist + 5-HT2A antagonist. Layered onto an SSRI/SNRI it adds dopaminergic tone and stabilizes — rather than blocks — dopamine, targeting residual anhedonia, amotivation and cognitive slowing that serotonergic reuptake block leaves behind. The partial-agonist action at a receptor the antidepressant does not touch is the complementary lever.',
      monitoring: 'Akathisia (dose-related, most common limiting effect), restlessness/activation, tardive dyskinesia with long-term use; metabolically lighter than most SGAs but still monitor weight/glucose/lipids.',
      ref: 'FDA adjunct MDD (2007); ADAPT-A, Nelson & Papakostas meta-analysis'
    },
    {
      id: 'trd-brexpiprazole',
      condition: 'Treatment-Resistant Depression',
      anchor: { classes: MODERN_AD },
      add: { id: 'brexpiprazole' },
      evidence: 'fda',
      rationale: 'Same dopamine-serotonin partial-agonist strategy as aripiprazole but with relatively higher 5-HT1A / 5-HT2A affinity versus its D2 partial agonism, which tends to produce less activation and akathisia. Complements an SSRI/SNRI by adding dopamine stabilization plus additional serotonergic receptor modulation downstream of reuptake blockade.',
      monitoring: 'Akathisia (less than aripiprazole but still present), weight gain, tardive dyskinesia long-term; check metabolic panel.',
      ref: 'FDA adjunct MDD (2015); pooled pivotal trials'
    },
    {
      id: 'trd-quetiapine',
      condition: 'Treatment-Resistant Depression',
      anchor: { classes: MODERN_AD },
      add: { id: 'quetiapine' },
      evidence: 'fda',
      rationale: 'Adjunctive quetiapine XR works largely through its active metabolite norquetiapine, a norepinephrine reuptake inhibitor and 5-HT2C antagonist, plus 5-HT2A antagonism and 5-HT1A partial agonism; H1 antagonism aids sleep and anxiety. It broadens monoamine coverage (adds an NE limb) and calms the arousal/insomnia an SSRI can worsen.',
      monitoring: 'Sedation, weight gain and metabolic syndrome, orthostatic hypotension, QT prolongation; use the lowest effective adjunct dose (often 150–300 mg XR).',
      ref: 'FDA adjunct MDD (quetiapine XR, 2009)'
    },
    {
      id: 'trd-olanzapine-ofc',
      condition: 'Treatment-Resistant Depression & Bipolar I Depression',
      anchor: { ids: ['fluoxetine'] },
      add: { id: 'olanzapine' },
      nickname: 'OFC (Symbyax)',
      evidence: 'fda',
      rationale: 'The olanzapine-fluoxetine combination pairs broad 5-HT2A/2C and D2 antagonism with SSRI reuptake blockade. Preclinically the pair produces a larger, synergistic rise in prefrontal norepinephrine and dopamine than either agent alone — the mechanistic basis for its efficacy in treatment-resistant and bipolar depression.',
      monitoring: 'Substantial weight gain and metabolic burden, sedation, hyperlipidemia; the metabolic cost is the main limitation.',
      ref: 'FDA TRD & bipolar I depression (Symbyax)'
    },

    /* ═══ TRD — mood stabilizer, thyroid, and other augmentation ═══════════ */
    {
      id: 'trd-lithium',
      condition: 'Treatment-Resistant Depression',
      anchor: { classes: AD_PLUS_TCA },
      add: { id: 'lithium' },
      evidence: 'guideline',
      rationale: 'The classic augmentation. Lithium acts downstream of the monoamine receptor — inhibiting GSK-3β and depleting inositol (second/third-messenger tier) and sensitizing postsynaptic 5-HT1A signaling — so it complements a reuptake inhibitor by acting at a different level of the signal-transduction cascade rather than a different receptor. Also carries independent anti-suicidal benefit.',
      monitoring: 'Narrow therapeutic index (augmentation levels ~0.6–0.8 mEq/L); renal function, thyroid, tremor, and toxicity risk with dehydration, NSAIDs, or ACE inhibitors/thiazides.',
      ref: 'STAR*D level 3; long-standing augmentation evidence base'
    },
    {
      id: 'trd-t3',
      condition: 'Treatment-Resistant Depression',
      anchor: { classes: AD_PLUS_TCA },
      add: { label: 'Liothyronine (T3)', external: true, brand: 'Cytomel' },
      evidence: 'guideline',
      rationale: 'Thyroid hormone augmentation accelerates and enhances antidepressant response even in euthyroid patients, modulating central noradrenergic and serotonergic transmission and cortical T3 availability. A hormonal — not receptor-level — mechanism, which is why it complements any monoamine antidepressant.',
      monitoring: 'Cardiac effects (tachycardia, atrial fibrillation), long-term bone density; check TFTs. Typical dose 25–50 mcg/day.',
      ref: 'STAR*D level 3 (comparable to lithium augmentation)'
    },
    {
      id: 'trd-bupropion',
      condition: 'Treatment-Resistant Depression',
      anchor: { classes: MODERN_AD },
      add: { id: 'bupropion' },
      evidence: 'guideline',
      rationale: 'An NDRI adds norepinephrine and dopamine reuptake blockade to a serotonergic base, covering residual anhedonia, fatigue and hypersomnia — and frequently reversing SSRI-induced sexual dysfunction. Two reuptake systems, minimal serotonergic overlap.',
      monitoring: 'Lowers seizure threshold (avoid in eating disorders / seizure history), activation and insomnia; bupropion is a CYP2D6 inhibitor and can raise levels of 2D6-dependent co-medications.',
      ref: 'STAR*D level 2 augmentation (comparable to buspirone)'
    },
    {
      id: 'trd-mirtazapine',
      condition: 'Treatment-Resistant Depression',
      anchor: { classes: MODERN_AD },
      add: { id: 'mirtazapine' },
      evidence: 'guideline',
      rationale: 'Mirtazapine blocks presynaptic α2 auto- and heteroreceptors (disinhibiting NE and 5-HT release) and postsynaptic 5-HT2A/2C/3 and H1 receptors. Its presynaptic release-enhancing action complements the SSRI/SNRI’s postsynaptic reuptake blockade — a "release + reuptake" pairing — while H1 block aids sleep and appetite.',
      monitoring: 'Sedation and weight gain; modest additive serotonergic load — watch for serotonin toxicity when combined with strongly serotonergic agents.',
      ref: 'Guideline-endorsed augmentation; combination-pharmacotherapy trials'
    },
    {
      id: 'trd-esketamine',
      condition: 'Treatment-Resistant Depression',
      anchor: { classes: MODERN_AD },
      add: { id: 'esketamine' },
      evidence: 'fda',
      rationale: 'NMDA-receptor antagonism drives a glutamate surge, AMPA activation and mTOR/BDNF-mediated synaptogenesis — a fourth-messenger / neuroplasticity mechanism entirely distinct from monoamine reuptake. Added to an oral antidepressant it produces rapid, including anti-suicidal, effects on a different timescale and pathway.',
      monitoring: 'REMS program; transient dissociation, blood-pressure spike, sedation post-dose; abuse potential — administered under observation.',
      ref: 'FDA TRD, adjunct to oral antidepressant (Spravato, 2019)'
    },

    /* ═══ Named / signature combinations ═══════════════════════════════════ */
    {
      id: 'combo-rocket-fuel',
      condition: 'Severe / Treatment-Resistant Depression',
      anchor: { ids: ['venlafaxine', 'desvenlafaxine', 'duloxetine', 'levomilnacipran', 'milnacipran'] },
      add: { id: 'mirtazapine' },
      nickname: 'California Rocket Fuel',
      evidence: 'empirical',
      rationale: 'Stahl’s "rocket fuel": an SNRI (SERT + NET reuptake blockade) combined with mirtazapine’s α2 presynaptic blockade and 5-HT2A/2C/3 antagonism. The mechanisms stack into a fourfold boost of noradrenergic and serotonergic output — reuptake block plus release disinhibition plus favorable postsynaptic receptor steering — reserved for severe or resistant cases.',
      monitoring: 'Sedation, weight gain, venlafaxine-related blood-pressure elevation; cumulative serotonergic load.',
      ref: 'Stahl, Essential Psychopharmacology'
    },
    {
      id: 'combo-t-rex',
      condition: 'Treatment-Resistant Depression',
      anchor: { ids: ['vortioxetine'] },
      add: { id: 'brexpiprazole' },
      nickname: 'T-Rex',
      evidence: 'empirical',
      rationale: 'Multimodal serotonergic activity (SERT inhibition plus 5-HT1A agonism, 5-HT3/7/1D antagonism, 5-HT1B partial agonism) augmented by a dopamine-serotonin partial agonist. The pairing targets residual anhedonia and cognitive symptoms through combined pro-cognitive serotonergic modulation and dopaminergic stabilization.',
      monitoring: 'Akathisia, weight gain, tardive dyskinesia long-term; emerging/off-label combination — limited controlled data.',
      ref: 'Emerging clinical practice (Trintellix + Rexulti)'
    },

    /* ═══ Treatment-Resistant Schizophrenia — clozapine augmentation ═══════ */
    {
      id: 'trs-clozapine-aripiprazole',
      condition: 'Treatment-Resistant Schizophrenia (clozapine augmentation)',
      anchor: { ids: ['clozapine'] },
      add: { id: 'aripiprazole' },
      evidence: 'guideline',
      rationale: 'Clozapine occupies D2 relatively weakly; adding a D2/D3 partial agonist raises functional dopaminergic tone where clozapine is low and can offset clozapine-associated weight gain and hyperprolactinemia. Complementary D2 handling — antagonistic/weak vs partial-agonist — is the rationale for partial response.',
      monitoring: 'Akathisia; metabolic benefit is the better-supported outcome — effect on core psychotic symptoms is modest and inconsistent.',
      ref: 'Multiple RCTs; metabolic benefit best established'
    },
    {
      id: 'trs-clozapine-valproate',
      condition: 'Treatment-Resistant Schizophrenia (clozapine augmentation)',
      anchor: { ids: ['clozapine'] },
      add: { id: 'valproate' },
      evidence: 'empirical',
      rationale: 'Valproate adds GABAergic and sodium-channel modulation (and HDAC-level effects) — a non-dopaminergic mechanism — helping with aggression/mood lability and providing seizure prophylaxis at the high clozapine doses that lower seizure threshold.',
      monitoring: 'Sedation, hepatotoxicity, hyperammonemia, weight gain; valproate can raise or lower clozapine levels — monitor clozapine level and shared hematologic caution.',
      ref: 'Common practice; seizure-prophylaxis rationale well established'
    },
    {
      id: 'trs-clozapine-lamotrigine',
      condition: 'Treatment-Resistant Schizophrenia (clozapine augmentation)',
      anchor: { ids: ['clozapine'] },
      add: { id: 'lamotrigine' },
      evidence: 'guideline',
      rationale: 'Lamotrigine reduces presynaptic glutamate release (sodium-channel blockade). Layering glutamatergic modulation onto clozapine’s broad receptor antagonism targets a pathway implicated in treatment resistance, with the best evidence among clozapine augmentation agents for partial responders.',
      monitoring: 'Slow titration for rash / Stevens-Johnson risk; monitor levels and clinical response.',
      ref: 'Meta-analytic support in clozapine partial responders'
    },
    {
      id: 'trs-ect',
      condition: 'Treatment-Resistant Schizophrenia (clozapine augmentation)',
      anchor: { ids: ['clozapine'] },
      add: { label: 'Electroconvulsive Therapy (ECT)', external: true },
      evidence: 'guideline',
      rationale: 'For clozapine-resistant schizophrenia, ECT augmentation has the strongest evidence of any add-on strategy — a non-pharmacologic, network-level intervention that complements clozapine when a second agent has failed.',
      monitoring: 'Anesthesia risk, transient cognitive/memory effects; coordinate with an ECT service.',
      ref: 'RCT evidence (e.g., Petrides et al., 2015)'
    },

    /* ═══ Bipolar disorder — combination mood stabilization ════════════════ */
    {
      id: 'bp-lithium-valproate',
      condition: 'Bipolar Disorder — maintenance',
      anchor: { ids: ['lithium', 'valproate'] },
      add: { id: 'valproate' },   // resolved dynamically vs. the reference (see note)
      addAlt: { id: 'lithium' },
      evidence: 'guideline',
      rationale: 'Two mood stabilizers with distinct mechanisms: lithium (GSK-3β / inositol, a second-messenger action) plus valproate (GABAergic, sodium-channel, HDAC). Combining them covers relapse prevention more effectively than valproate alone — different intracellular targets rather than the same one twice.',
      monitoring: 'Tremor, GI upset, weight gain; monitor both drug levels, plus renal/thyroid (lithium) and hepatic function and teratogenicity (valproate).',
      ref: 'BALANCE trial (2010)'
    },
    {
      id: 'bp-lithium-lamotrigine',
      condition: 'Bipolar Disorder — depressive-pole coverage',
      anchor: { ids: ['lithium'] },
      add: { id: 'lamotrigine' },
      evidence: 'guideline',
      rationale: 'Complementary poles: lithium is strongest for mania and maintenance (and is anti-suicidal), while lamotrigine — via glutamate-release reduction — prevents depressive relapse, lithium’s weaker pole. Together they span both directions of the illness.',
      monitoring: 'Lamotrigine titration for rash; lithium level, renal and thyroid monitoring.',
      ref: 'Guideline-endorsed maintenance combination'
    },
    {
      id: 'bp-stabilizer-quetiapine',
      condition: 'Bipolar Disorder — mania & bipolar depression',
      anchor: { ids: ['lithium', 'valproate'] },
      add: { id: 'quetiapine' },
      evidence: 'fda',
      rationale: 'Adding an SGA to lithium or valproate gives faster antimanic control (D2 modulation) than a stabilizer alone; quetiapine additionally covers bipolar depression through norquetiapine’s NE reuptake inhibition and 5-HT2C antagonism — mania and depression from one adjunct.',
      monitoring: 'Sedation, metabolic syndrome, orthostasis, QT; combined weight burden with valproate.',
      ref: 'FDA adjunct to Li/VPA for acute mania & maintenance'
    },
    {
      id: 'bp-stabilizer-lurasidone',
      condition: 'Bipolar I Depression',
      anchor: { ids: ['lithium', 'valproate'] },
      add: { id: 'lurasidone' },
      evidence: 'fda',
      rationale: 'Lurasidone (D2 antagonist with potent 5-HT7 and 5-HT2A antagonism and 5-HT1A partial agonism) is FDA-approved as adjunct to lithium or valproate for bipolar I depression, adding depressive-pole efficacy with a comparatively favorable metabolic profile.',
      monitoring: 'Akathisia, nausea (take with ≥350 kcal food for absorption); relatively weight/metabolic-sparing but still monitor.',
      ref: 'FDA adjunct to Li/VPA, bipolar I depression'
    },
    {
      id: 'bp-stabilizer-aripiprazole',
      condition: 'Bipolar I — maintenance / mania',
      anchor: { ids: ['lithium', 'valproate'] },
      add: { id: 'aripiprazole' },
      evidence: 'fda',
      rationale: 'Aripiprazole as adjunct to lithium or valproate provides D2/D3 partial-agonist antimanic and maintenance coverage with lower metabolic cost than most SGAs — dopamine stabilization layered onto the stabilizer’s intracellular mechanism.',
      monitoring: 'Akathisia/activation, tardive dyskinesia long-term; lighter metabolic burden.',
      ref: 'FDA adjunct to Li/VPA, bipolar I maintenance'
    }

  ];

  /* ── Lookup ──────────────────────────────────────────────────────────────
     Given a reference medication object, return the strategies in which it
     participates, split by role:
       role 'anchor' → ref is the base; suggest ADDING entry.add
       role 'addon'  → ref is the added agent; entry says what it augments
     For symmetric mood-stabilizer pairs (lithium ⇄ valproate) the add agent is
     resolved to whichever of the pair is NOT the reference. */
  function matchesAnchor(entry, ref) {
    var a = entry.anchor || {};
    if (a.ids && a.ids.indexOf(ref.id) !== -1) return true;
    if (a.classes && a.classes.indexOf(ref.class) !== -1) return true;
    return false;
  }
  function resolveAdd(entry, ref) {
    // Symmetric pair support: if the primary add equals the reference, use addAlt.
    if (entry.addAlt && entry.add && entry.add.id === ref.id) return entry.addAlt;
    return entry.add;
  }

  var EV_RANK = { fda: 3, guideline: 2, empirical: 1 };
  function addKey(add) { return add ? (add.id || add.label || '') : ''; }
  // When two strategies add the SAME agent to the reference (e.g. generic
  // "SNRI + mirtazapine" and the named "California Rocket Fuel"), keep one:
  // prefer a named combo, then higher evidence tier.
  function preferEntry(a, b) {
    var an = a.entry.nickname ? 1 : 0, bn = b.entry.nickname ? 1 : 0;
    if (an !== bn) return an > bn ? a : b;
    var ar = EV_RANK[a.entry.evidence] || 0, br = EV_RANK[b.entry.evidence] || 0;
    return ar >= br ? a : b;
  }

  function lookup(ref) {
    if (!ref) return { anchor: [], addon: [] };
    var anchorBy = {}, addon = [];
    STRATEGIES.forEach(function (e) {
      // role: anchor
      if (matchesAnchor(e, ref)) {
        var add = resolveAdd(e, ref);
        // don't suggest adding the drug to itself
        if (!(add && add.id && add.id === ref.id)) {
          var k = addKey(add);
          var row = { entry: e, add: add };
          anchorBy[k] = anchorBy[k] ? preferEntry(anchorBy[k], row) : row;
        }
      }
      // role: addon (reference is the agent being added)
      var isAddonPrimary = e.add && e.add.id && e.add.id === ref.id;
      var isAddonAlt = e.addAlt && e.addAlt.id && e.addAlt.id === ref.id;
      if (isAddonPrimary || isAddonAlt) {
        addon.push({ entry: e });
      }
    });
    // Preserve declaration order, sorted by evidence tier (fda first).
    var anchor = Object.keys(anchorBy).map(function (k) { return anchorBy[k]; });
    anchor.sort(function (x, y) { return (EV_RANK[y.entry.evidence] || 0) - (EV_RANK[x.entry.evidence] || 0); });
    return { anchor: anchor, addon: addon };
  }

  function hasAny(ref) {
    var r = lookup(ref);
    return r.anchor.length > 0 || r.addon.length > 0;
  }

  window.CombinationStrategies = {
    all: STRATEGIES,
    lookup: lookup,
    hasAny: hasAny,
    EVIDENCE_LABEL: { fda: 'FDA-approved adjunct', guideline: 'Guideline / strong evidence', empirical: 'Empirical / expert practice' },
    EVIDENCE_SHORT: { fda: 'FDA', guideline: 'Guideline', empirical: 'Empirical' }
  };
})();

/* ── Symptom-domain mapping (Phase 4: residual-symptom targeting) ────────────
   The previous phases answer a pharmacological question: how do these two
   agents differ? This one answers the clinical question actually being asked at
   the visit: my patient is on sertraline and still has no motivation and cannot
   sleep — what covers that?

   Mechanism alone does not answer it. What does is knowing which receptor
   actions map onto which symptom domains. This file encodes that mapping, and
   it is deliberately bidirectional: an agent can COVER a domain or WORSEN it.
   Muscarinic blockade does not merely fail to help cognition, it degrades it;
   SSRIs do not merely fail to fix sexual dysfunction, they cause it. A tool
   that only ever showed benefit would be quietly misleading.

   Each rule maps a (receptor, action) pair to weighted domains:
     positive weight → the action tends to IMPROVE that domain
     negative weight → the action tends to WORSEN it

   Weights are clinical judgement, not measured constants. They are curated
   pharmacology in the same spirit as receptor-actions.js and should be reviewed
   as such. Contributions are scaled by binding strength, so a receptor an agent
   barely touches does not earn full credit for a symptom.
   ────────────────────────────────────────────────────────────────────────── */
(function () {

  var DOMAINS = {
    insomnia:  { label: 'Insomnia / sleep disturbance', short: 'sleep' },
    anhedonia: { label: 'Anhedonia / amotivation / fatigue', short: 'anhedonia' },
    anxiety:   { label: 'Anxiety / arousal', short: 'anxiety' },
    cognition: { label: 'Cognitive dysfunction / inattention', short: 'cognition' },
    agitation: { label: 'Agitation / irritability', short: 'agitation' },
    psychosis: { label: 'Psychotic symptoms', short: 'psychosis' },
    appetite:  { label: 'Poor appetite / weight loss', short: 'appetite' },
    sexual:    { label: 'Sexual dysfunction', short: 'sexual dysfn' },
    pain:      { label: 'Somatic / neuropathic pain', short: 'pain' }
  };

  // (receptor, actions) → { domain: weight }.  Negative = tends to worsen.
  var RULES = [
    // ── Histamine / adrenergic sedation ───────────────────────────────────
    { r: 'H1', a: ['antagonist', 'inverse'],
      d: { insomnia: 1.0, appetite: 0.7, agitation: 0.3, cognition: -0.4 },
      why: 'H1 blockade — sedating, appetite-stimulating; daytime sedation can blunt cognition' },
    { r: 'alpha1', a: ['antagonist'],
      d: { insomnia: 0.4, agitation: 0.3 },
      why: 'alpha-1 blockade — sedating (also the source of orthostasis)' },

    // ── Serotonergic postsynaptic ─────────────────────────────────────────
    { r: '5HT2A', a: ['antagonist', 'inverse'],
      d: { insomnia: 0.7, agitation: 0.4, anxiety: 0.35, psychosis: 0.3 },
      why: '5HT2A blockade — improves slow-wave sleep, dampens agitation and arousal' },
    { r: '5HT2C', a: ['antagonist', 'inverse'],
      d: { appetite: 0.7, anhedonia: 0.4 },
      why: '5HT2C blockade — appetite gain and disinhibition of prefrontal DA/NE' },
    { r: '5HT1A', a: ['partial', 'agonist'],
      d: { anxiety: 0.9, cognition: 0.4, sexual: 0.4, anhedonia: 0.3 },
      why: '5HT1A agonism — anxiolytic without sedation; may offset SSRI sexual dysfunction' },

    // ── Monoamine transporters ────────────────────────────────────────────
    { r: 'SERT', a: ['inhibitor'],
      d: { anxiety: 0.8, pain: 0.4, sexual: -0.8, anhedonia: -0.2 },
      why: 'Serotonin reuptake inhibition — anxiolytic, but a principal cause of sexual dysfunction and emotional blunting' },
    { r: 'NET', a: ['inhibitor', 'releaser'],
      d: { anhedonia: 0.8, cognition: 0.8, pain: 0.6, anxiety: -0.3, insomnia: -0.4 },
      why: 'Norepinephrine reuptake inhibition — energizing and pro-cognitive (prefrontal), but activating' },
    { r: 'DAT', a: ['inhibitor', 'releaser'],
      d: { anhedonia: 1.0, cognition: 0.8, sexual: 0.7, appetite: -0.5, insomnia: -0.6 },
      why: 'Dopamine reuptake inhibition — targets anhedonia and drive; appetite-suppressing and activating' },

    // ── Dopaminergic postsynaptic ─────────────────────────────────────────
    { r: 'D2', a: ['antagonist'],
      d: { psychosis: 1.0, agitation: 0.7, anhedonia: -0.5, cognition: -0.3 },
      why: 'D2 blockade — antipsychotic and calming, but can flatten motivation' },
    { r: 'D2', a: ['partial'],
      d: { psychosis: 0.8, anhedonia: 0.6, cognition: 0.3 },
      why: 'D2 partial agonism — antipsychotic while preserving (or restoring) dopaminergic tone' },
    { r: 'D3', a: ['partial'],
      d: { anhedonia: 0.6, cognition: 0.4 },
      why: 'D3 partial agonism — associated with motivation and reward signalling' },

    // ── Alpha-2 ───────────────────────────────────────────────────────────
    { r: 'alpha2', a: ['agonist'],
      d: { cognition: 0.7, agitation: 0.6, anxiety: 0.5, insomnia: 0.4, anhedonia: -0.2 },
      why: 'alpha-2A agonism — strengthens prefrontal signal-to-noise; calming' },
    { r: 'alpha2', a: ['antagonist'],
      d: { anhedonia: 0.5, insomnia: 0.3 },
      why: 'alpha-2 autoreceptor blockade — disinhibits NE and 5HT release' },

    // ── Muscarinic ────────────────────────────────────────────────────────
    { r: 'M1', a: ['antagonist'],
      d: { cognition: -0.8, insomnia: 0.3 },
      why: 'Muscarinic blockade — impairs memory and attention; sedating' },

    // ── Sleep-specific systems ────────────────────────────────────────────
    { r: 'MT1', a: ['agonist'], d: { insomnia: 0.9 }, why: 'Melatonin MT1 agonism — promotes sleep onset' },
    { r: 'MT2', a: ['agonist'], d: { insomnia: 0.9 }, why: 'Melatonin MT2 agonism — circadian phase shifting' },
    { r: 'OX1R', a: ['antagonist'], d: { insomnia: 0.9 }, why: 'Orexin blockade — reduces wake drive' },
    { r: 'OX2R', a: ['antagonist'], d: { insomnia: 1.0 }, why: 'Orexin-2 blockade — the principal sleep-promoting orexin target' },

    // ── GABA ──────────────────────────────────────────────────────────────
    { r: 'GABA-A', a: ['pam'],
      d: { anxiety: 0.9, insomnia: 0.9, agitation: 0.6, cognition: -0.5 },
      why: 'GABA-A positive allosteric modulation — rapid anxiolysis and sedation; impairs memory' }
  ];

  function pKi(kiNm) { return 9 - Math.log10(kiNm); }

  // How far below an agent's PRIMARY target a secondary target can sit and still
  // be considered clinically engaged, in log units of affinity.
  //
  // This gate matters more than it looks. Dose is set by the primary target, so
  // a receptor an agent binds two log units more weakly is barely occupied at
  // therapeutic exposure. Sertraline binds SERT at pKi 9.5 and DAT at 7.6 —
  // roughly 80-fold weaker — and without this gate it scored as a full
  // dopaminergic agent, "covering" anhedonia as effectively as bupropion. That
  // is exactly backwards: SSRIs are a common CAUSE of residual anhedonia and
  // emotional blunting. Absolute affinity alone cannot express that; affinity
  // relative to the drug's own primary target can.
  var RELATIVE_WINDOW = 1.5;

  function primaryP(med) {
    var max = 0;
    if (!med || !med.receptorKi) return max;
    for (var r in med.receptorKi) {
      var p = pKi(med.receptorKi[r]);
      if (p > max) max = p;
    }
    return max;
  }

  // Meaningful binding earns partial credit; strong binding earns full credit;
  // binding far weaker than the agent's primary target earns none.
  function strengthFactor(p, maxP) {
    if (p < 6) return 0;
    var gap = maxP - p;
    if (gap > RELATIVE_WINDOW) return 0;
    var base = 0.4 + 0.6 * Math.max(0, Math.min(1, (p - 6) / 3));
    var rel = 1 - 0.5 * (gap / RELATIVE_WINDOW);   // taper toward the window edge
    return base * rel;
  }

  // Per-domain profile for one agent: { domain: {score, contributors:[...] } }
  function profile(med) {
    var RA = window.ReceptorActions;
    var out = {};
    Object.keys(DOMAINS).forEach(function (d) { out[d] = { score: 0, contributors: [] }; });
    if (!RA || !med || !med.receptorKi) return out;

    var maxP = primaryP(med);
    RULES.forEach(function (rule) {
      var ki = med.receptorKi[rule.r];
      if (ki == null) return;
      var p = pKi(ki), f = strengthFactor(p, maxP);
      if (f <= 0) return;
      var action = RA.actionFor(med.id, rule.r);
      if (!action || rule.a.indexOf(action) === -1) return;
      Object.keys(rule.d).forEach(function (dom) {
        var contrib = rule.d[dom] * f;
        out[dom].score += contrib;
        out[dom].contributors.push({
          receptor: rule.r, action: action, weight: contrib, why: rule.why
        });
      });
    });
    // Clamp and keep the dominant contributors first.
    Object.keys(out).forEach(function (d) {
      out[d].score = Math.max(-1, Math.min(1, out[d].score));
      out[d].contributors.sort(function (a, b) { return Math.abs(b.weight) - Math.abs(a.weight); });
    });
    return out;
  }

  // Coverage of a set of selected domains, 0–1, plus what covers/worsens them.
  // Returns null when nothing is selected, so the caller can drop the axis.
  function coverage(med, domainKeys) {
    if (!domainKeys || !domainKeys.length) return null;
    var prof = profile(med);
    var covers = [], worsens = [], sum = 0;
    domainKeys.forEach(function (d) {
      var e = prof[d];
      if (!e) return;
      sum += Math.max(0, e.score);
      if (e.score >= 0.25) {
        covers.push({ domain: d, score: e.score, contributors: e.contributors.filter(function (c) { return c.weight > 0; }).slice(0, 2) });
      } else if (e.score <= -0.25) {
        worsens.push({ domain: d, score: e.score, contributors: e.contributors.filter(function (c) { return c.weight < 0; }).slice(0, 2) });
      }
    });
    covers.sort(function (a, b) { return b.score - a.score; });
    worsens.sort(function (a, b) { return a.score - b.score; });
    return { score: sum / domainKeys.length, covers: covers, worsens: worsens };
  }

  // Which of the selected domains does the reference already handle, and which
  // are gaps? The gaps are what a complementary agent should be chosen for.
  function gaps(med, domainKeys) {
    if (!domainKeys || !domainKeys.length) return { covered: [], gaps: [] };
    var prof = profile(med), covered = [], g = [];
    domainKeys.forEach(function (d) {
      if (prof[d] && prof[d].score >= 0.25) covered.push(d); else g.push(d);
    });
    return { covered: covered, gaps: g };
  }

  function label(d) { return DOMAINS[d] ? DOMAINS[d].label : d; }
  function short(d) { return DOMAINS[d] ? DOMAINS[d].short : d; }

  window.SymptomDomains = {
    DOMAINS: DOMAINS, RULES: RULES, RELATIVE_WINDOW: RELATIVE_WINDOW,
    profile: profile, coverage: coverage, gaps: gaps,
    label: label, short: short
  };
})();

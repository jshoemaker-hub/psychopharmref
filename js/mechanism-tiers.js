/* ── Signal-transduction TIER overlay (Phase 3) ──────────────────────────────
   Receptor affinity and receptor action both describe events at the membrane.
   But psychotropic mechanisms do not all live there. Lithium's therapeutic
   action is intracellular; valproate reaches the genome; ketamine's
   antidepressant effect is a neuroplastic one. Those agents carry no monoamine
   receptor fingerprint at all, which is why they were previously invisible to
   the computed engine — the tool could rank thirty antidepressants against each
   other but could not see lithium.

   This overlay tags each agent's level(s) in the signal-transduction cascade,
   following the classical framing:

     TIER 1 — first messenger / membrane level
              The neurotransmitter and its immediate machinery: receptors,
              transporters, ion channels, and the enzymes that regulate
              transmitter availability. Nearly every psychotropic acts here.

     TIER 2 — second messengers
              cAMP, cGMP, IP3/DAG, intracellular Ca2+ — the intracellular
              signal generated once the receptor is occupied.

     TIER 3 — third messengers: kinases & transcription factors
              PKA, CaMK, GSK-3beta, CREB — the phosphoprotein cascade that
              converts a second-messenger signal into a nuclear one.

     TIER 4 — fourth messengers: gene expression & neuroplasticity
              Transcription, histone modification, BDNF/mTOR-mediated
              synaptogenesis — the slowest and most durable level.

   The clinical payoff: two agents acting at DIFFERENT tiers complement each
   other even when they share no receptor. That is precisely why lithium
   augments an SSRI, and it is a relationship no binding-affinity comparison can
   represent.

   Most agents are tier 1; only the genuinely downstream mechanisms are
   overridden, so the data stays honest rather than inflating the axis.
   ────────────────────────────────────────────────────────────────────────── */
(function () {

  var TIERS = {
    first:  { n: 1, label: 'first messenger',  short: 'receptor/membrane',
              desc: 'Receptors, transporters, ion channels and transmitter-regulating enzymes.' },
    second: { n: 2, label: 'second messenger', short: 'second messenger',
              desc: 'cAMP, IP3/DAG, intracellular calcium.' },
    third:  { n: 3, label: 'third messenger',  short: 'kinase/transcription factor',
              desc: 'Protein kinases and transcription factors (GSK-3beta, CREB).' },
    fourth: { n: 4, label: 'fourth messenger', short: 'gene/neuroplasticity',
              desc: 'Gene expression, histone modification, BDNF/mTOR synaptogenesis.' }
  };

  var DEFAULT_TIERS = ['first'];

  // Only agents whose therapeutic mechanism genuinely extends past the membrane.
  var OVERRIDES = {
    lithium: {
      tiers: ['second', 'third'],
      note: 'Depletes inositol (interrupting the PIP2/IP3 second-messenger cycle) and inhibits GSK-3beta, a third-messenger kinase. Its target is intracellular signalling, not a receptor — the mechanistic basis for augmenting a reuptake inhibitor.'
    },
    valproate: {
      tiers: ['first', 'fourth'],
      note: 'Sodium-channel blockade and GABAergic effects at the membrane, plus histone deacetylase inhibition that alters gene transcription — a first- and fourth-messenger agent.'
    },
    esketamine: {
      tiers: ['first', 'fourth'],
      note: 'NMDA-receptor antagonism is the trigger (first), but the antidepressant effect arises from the downstream glutamate surge driving AMPA activation and mTOR/BDNF-mediated synaptogenesis (fourth).'
    },
    'dextromethorphan-bupropion': {
      tiers: ['first', 'fourth'],
      note: 'NMDA antagonism and sigma-1 agonism plus dopamine/norepinephrine reuptake inhibition at the membrane, converging on the same glutamatergic neuroplasticity pathway as ketamine.'
    }
  };

  // ── API ──────────────────────────────────────────────────────────────────
  function tiersFor(medId) {
    var o = OVERRIDES[medId];
    return (o && o.tiers) ? o.tiers : DEFAULT_TIERS;
  }
  function noteFor(medId) {
    var o = OVERRIDES[medId];
    return (o && o.note) ? o.note : null;
  }
  function nums(medId) {
    return tiersFor(medId).map(function (t) { return TIERS[t] ? TIERS[t].n : 1; });
  }

  // Ordinal separation between two agents' tier sets, 0–1.
  // For each tier in A we take its distance to the NEAREST tier in B (an agent
  // that already acts at the other's level is not divergent there), average, and
  // symmetrize. Normalized by the maximum span of 3 (tier 1 vs tier 4).
  function divergence(idA, idB) {
    var A = nums(idA), B = nums(idB);
    if (!A.length || !B.length) return null;
    function directed(X, Y) {
      var sum = 0;
      X.forEach(function (x) {
        var best = Infinity;
        Y.forEach(function (y) { var d = Math.abs(x - y); if (d < best) best = d; });
        sum += best;
      });
      return sum / X.length;
    }
    var d = (directed(A, B) + directed(B, A)) / 2;
    return Math.max(0, Math.min(1, d / 3));
  }

  function labelList(medId) {
    return tiersFor(medId).map(function (t) { return TIERS[t] ? TIERS[t].short : t; });
  }

  window.MechanismTiers = {
    TIERS: TIERS, DEFAULT_TIERS: DEFAULT_TIERS, OVERRIDES: OVERRIDES,
    tiersFor: tiersFor, noteFor: noteFor, nums: nums,
    divergence: divergence, labelList: labelList
  };
})();

/* ── Pair safety: contraindications & additive serotonergic load ─────────────
   Required companion to the cascade-tier phase. Admitting agents that carry no
   receptor-binding data into the computed engine also admits the MAOIs — and
   because phenelzine is labelled for "Major Depressive Disorder (atypical)",
   indication matching happily pairs it with every SSRI. Ranking that pair as
   "complementary" would be dangerous: MAOI + serotonergic agent risks serotonin
   syndrome, and MAOI + sympathomimetic risks hypertensive crisis.

   So contraindicated pairs are removed from the ranking entirely and reported
   separately, with the reason. The tool should teach why a combination is
   excluded without ever recommending it.

   Two severities:
     'contraindicated' — never rank; list in the excluded block with a reason.
     'caution'         — rank, but attach a warning flag to the card.
   ────────────────────────────────────────────────────────────────────────── */
(function () {

  function pKi(kiNm) { return 9 - Math.log10(kiNm); }

  // Sympathomimetic / pressor classes that can precipitate hypertensive crisis
  // with an MAOI.
  var SYMPATHOMIMETIC = ['Stimulant', 'Wake-Promoting Agent', 'NDRI'];

  // How serotonergic is this agent?  'maoi' | 'high' | 'moderate' | 'none'
  function serotonergic(med) {
    if (!med) return 'none';
    if (med.class === 'MAOI') return 'maoi';
    var ki = med.receptorKi && med.receptorKi.SERT;
    if (ki && pKi(ki) >= 7) return 'high';
    if (['SSRI', 'SNRI', 'SSRI/5HT1A', 'SARI'].indexOf(med.class) !== -1) return 'high';
    if (med.class === 'TCA') return 'high';
    if (['NaSSA', 'Azapirone'].indexOf(med.class) !== -1) return 'moderate';
    if (med.id === 'dextromethorphan-bupropion') return 'moderate';
    if (med.id === 'lithium') return 'moderate';
    return 'none';
  }

  function isMAOI(med) { return !!med && med.class === 'MAOI'; }

  // Returns { severity: 'contraindicated'|'caution'|null, reasons: [ {title, detail} ] }
  function check(a, b) {
    var reasons = [], severity = null;
    function add(sev, title, detail) {
      reasons.push({ severity: sev, title: title, detail: detail });
      if (sev === 'contraindicated') severity = 'contraindicated';
      else if (severity !== 'contraindicated') severity = 'caution';
    }

    var aM = isMAOI(a), bM = isMAOI(b);

    if (aM && bM) {
      add('contraindicated', 'MAOI + MAOI',
        'Two irreversible MAO inhibitors must never be combined; switching between them requires a washout (typically 2 weeks).');
    } else if (aM || bM) {
      var other = aM ? b : a, maoi = aM ? a : b;
      var s = serotonergic(other);
      if (s === 'high' || s === 'moderate') {
        add('contraindicated', 'MAOI + serotonergic agent — serotonin syndrome',
          maoi.name + ' blocks monoamine breakdown while ' + other.name + ' raises synaptic serotonin. The combination risks serotonin syndrome, which can be fatal. A washout is required when switching (2 weeks either direction; 5 weeks after fluoxetine).');
      } else if (SYMPATHOMIMETIC.indexOf(other.class) !== -1) {
        add('contraindicated', 'MAOI + sympathomimetic — hypertensive crisis',
          'Combining ' + maoi.name + ' with ' + other.name + ' can precipitate a hypertensive crisis through unopposed noradrenergic accumulation.');
      } else {
        add('caution', 'MAOI combination',
          'MAOIs interact broadly with serotonergic, sympathomimetic and dietary tyramine exposures. Review the full interaction and dietary profile before combining anything with ' + maoi.name + '.');
      }
    }

    // Additive serotonergic load between two non-MAOI serotonergic agents.
    if (!aM && !bM) {
      var sa = serotonergic(a), sb = serotonergic(b);
      if (sa === 'high' && sb === 'high') {
        add('caution', 'Additive serotonergic load',
          'Both agents raise serotonergic tone. Combination is common and often appropriate, but monitor for serotonin toxicity — clonus, hyperreflexia, agitation, autonomic instability, hyperthermia.');
      } else if ((sa === 'high' && sb === 'moderate') || (sa === 'moderate' && sb === 'high')) {
        add('caution', 'Moderate additive serotonergic load',
          'Serotonergic effects are additive; the risk is lower than with two strong reuptake inhibitors but worth monitoring.');
      }
    }

    return { severity: severity, reasons: reasons };
  }

  function isContraindicated(a, b) { return check(a, b).severity === 'contraindicated'; }

  window.PairSafety = {
    check: check,
    isContraindicated: isContraindicated,
    serotonergic: serotonergic
  };
})();

/* ── Find Complementary Medications ─────────────────────────────────────────
   The mirror image of "Find Similar Medications." Given a reference
   medication, surface agents that are RELEVANT to the same clinical problem
   (same class/category, shared indications) but MECHANISTICALLY DIVERGENT
   (they bind a different set of receptors). These are rational candidates for
   combination or augmentation — the two agents complement rather than
   duplicate each other's pharmacology (e.g., an SSRI + bupropion, or an
   SSRI + mirtazapine).

   Composite complementarity score (0–100%):
     40%  Receptor DIVERGENCE   — (1 − cosine similarity) of receptor-binding
          fingerprints. High = the candidate covers different targets.
     30%  Class / category match — same class = full credit,
          same category (different class) = 70% credit
     30%  Shared FDA indications — Jaccard overlap of on-label uses

   Eligibility: a candidate must (a) have monoamine receptor-binding data on
   file — otherwise mechanistic divergence cannot be assessed — and (b) share
   at least one indication with the reference, since a "complementary" agent
   must treat the same problem. If the reference itself has no receptor-binding
   data on file (e.g. lithium, MAOIs, anticonvulsant mood stabilizers,
   gabapentinoids), the tool cannot rank divergence and says so.
   ────────────────────────────────────────────────────────────────────────── */
(function () {
  if (typeof MEDICATIONS === 'undefined') { console.error('complementary-meds: MEDICATIONS not loaded'); return; }

  var COLORS = (typeof RECEPTOR_COLORS !== 'undefined') ? RECEPTOR_COLORS : {};

  // ── Pharmacology math ────────────────────────────────────────────────────
  function pKi(kiNm) { return 9 - Math.log10(kiNm); }             // Ki(nM) → pKi
  var FLOOR = 5;   // pKi 5 = Ki 10,000 nM — below this, binding is negligible

  // A candidate only counts as "complementary" if its receptor overlap with the
  // reference is at or below this ceiling. Above it, the agent is pharmacologically
  // SIMILAR (that is the "Find Similar" tool's job), not complementary. 0.70 keeps
  // every same-class near-duplicate out (e.g. SSRI↔SSRI overlaps run 78–90%).
  var OVERLAP_CEILING = 0.70;

  // Binding fingerprint: {receptor: strengthAboveFloor}, real binding only
  function fingerprint(med) {
    var fp = {};
    if (!med.receptorKi) return fp;
    for (var r in med.receptorKi) {
      var v = pKi(med.receptorKi[r]) - FLOOR;
      if (v > 0) fp[r] = v;
    }
    return fp;
  }
  function hasKi(med) { return med.receptorKi && Object.keys(med.receptorKi).length > 0; }

  function cosine(a, b) {
    var keys = {}, k;
    for (k in a) keys[k] = 1;
    for (k in b) keys[k] = 1;
    var dot = 0, na = 0, nb = 0;
    for (k in keys) {
      var x = a[k] || 0, y = b[k] || 0;
      dot += x * y; na += x * x; nb += y * y;
    }
    if (!na || !nb) return 0;
    return dot / (Math.sqrt(na) * Math.sqrt(nb));
  }

  function indUses(med) {
    return (med.indications || []).map(function (i) { return i.use.toLowerCase().trim(); });
  }
  // Indication labels nest rather than match exactly — "Treatment-Resistant
  // Schizophrenia" and "Schizophrenia" describe the same clinical problem, as do
  // "Adjunct for Major Depressive Disorder" and "Major Depressive Disorder".
  // Exact string equality would reject those pairs (and with them the whole
  // clozapine-augmentation case), so treat one label containing the other as a
  // match.
  function indRelated(x, y) {
    return x === y || x.indexOf(y) !== -1 || y.indexOf(x) !== -1;
  }
  function jaccard(a, b) {
    var A = indUses(a), B = indUses(b);
    if (!A.length && !B.length) return 0;
    var inter = 0;
    A.forEach(function (u) {
      for (var i = 0; i < B.length; i++) { if (indRelated(u, B[i])) { inter++; return; } }
    });
    var uni = {}; A.concat(B).forEach(function (u) { uni[u] = 1; });
    var uniSize = Object.keys(uni).length;
    return uniSize ? Math.min(1, inter / uniSize) : 0;
  }

  // ── Residual symptoms (Phase 4) ──────────────────────────────────────────
  // Which symptom domains the clinician wants the added agent to cover. Empty
  // by default, in which case the coverage axis simply does not apply.
  function selectedDomains() {
    var out = [];
    var boxes = document.querySelectorAll('.cm-symptom-box');
    if (!boxes || !boxes.length) return out;
    Array.prototype.forEach.call(boxes, function (b) { if (b.checked) out.push(b.value); });
    return out;
  }

  // ── Route-of-administration filter ───────────────────────────────────────
  // Empty = no filter ("Any route"). Multiple routes are OR-ed, so selecting
  // IM and IV shows agents available by either.
  var selectedRoutes = [];

  function routeChips(medId) {
    var R = window.Routes;
    if (!R) return '';
    return R.sorted(medId).map(function (rt) {
      var note = R.noteFor(medId, rt);
      var on = selectedRoutes.indexOf(rt) !== -1;
      return '<span class="cm-route-chip' + (on ? ' cm-route-chip--match' : '') + '"'
        + (note ? ' title="' + esc(note) + '"' : '') + '>' + esc(R.short(rt)) + '</span>';
    }).join('');
  }
  // Formulation detail for the routes the clinician actually asked about.
  function routeNotes(medId) {
    var R = window.Routes;
    if (!R) return '';
    var wanted = selectedRoutes.length ? selectedRoutes : [];
    var out = [];
    wanted.forEach(function (rt) {
      if (!R.has(medId, rt)) return;
      var note = R.noteFor(medId, rt);
      if (note) out.push('<div class="cm-route-note"><strong>' + esc(R.short(rt)) + ':</strong> ' + esc(note) + '</div>');
    });
    return out.join('');
  }

  // ── User-adjustable weights (slider toolbar) ─────────────────────────────
  // Sliders hold raw 0–100 values; the score normalizes them to sum to 1.
  function readWeights() {
    function v(id, dflt) { var el = document.getElementById(id); return el ? (parseFloat(el.value) || 0) : dflt; }
    return { d: v('cm-w-divergence', 30), a: v('cm-w-action', 15), t: v('cm-w-tier', 15),
             c: v('cm-w-class', 15), i: v('cm-w-indication', 25), s: v('cm-w-symptom', 35) };
  }
  function normWeights() {
    var raw = readWeights();
    var wD = raw.d, wA = raw.a, wT = raw.t, wC = raw.c, wI = raw.i, wS = raw.s;
    var sum = wD + wA + wT + wC + wI + wS;
    if (sum <= 0) { wD = 30; wA = 15; wT = 15; wC = 15; wI = 25; wS = 35; sum = 135; }
    return { wD: wD / sum, wA: wA / sum, wT: wT / sum, wC: wC / sum, wI: wI / sum, wS: wS / sum };
  }

  function score(ref, cand, act) {
    var w = normWeights();
    // Receptor and action divergence require binding data on BOTH agents. An
    // absent fingerprint is unknown, not divergent — scoring it as maximally
    // different would rank lithium top of every list for the wrong reason.
    var both = hasKi(ref) && hasKi(cand);
    var cos = both ? cosine(fingerprint(ref), fingerprint(cand)) : null;
    var div = both ? (1 - cos) : null;
    var cMatch = (ref.class === cand.class) ? 1 : (ref.category === cand.category ? 0.7 : 0);
    var iMatch = jaccard(ref, cand);
    var aInfo = act || actionInfo(ref, cand);
    var MT = window.MechanismTiers;
    var tDiv = MT ? MT.divergence(ref.id, cand.id) : null;
    var SD = window.SymptomDomains;
    var cov = SD ? SD.coverage(cand, selectedDomains()) : null;

    // Any axis that cannot be measured for this pair is dropped and its weight
    // redistributed proportionally across the axes that CAN be — so a pair is
    // never penalised for a dimension that does not apply to it.
    var axes = [
      { k: 'div', w: w.wD, v: div },
      { k: 'act', w: w.wA, v: aInfo.score },
      { k: 'tier', w: w.wT, v: tDiv },
      { k: 'class', w: w.wC, v: cMatch },
      { k: 'ind', w: w.wI, v: iMatch },
      { k: 'sym', w: w.wS, v: cov ? cov.score : null }
    ];
    var live = axes.filter(function (a) { return a.v !== null; });
    var wSum = live.reduce(function (t, a) { return t + a.w; }, 0);
    var total = 0, eff = {};
    if (wSum > 0) {
      live.forEach(function (a) { eff[a.k] = a.w / wSum; total += (a.w / wSum) * a.v; });
    }
    return {
      total: 100 * total,
      div: div, cos: cos, cMatch: cMatch, iMatch: iMatch,
      aDiv: aInfo.score, contrasts: aInfo.contrasts, tDiv: tDiv, cov: cov,
      wD: eff.div || 0, wA: eff.act || 0, wT: eff.tier || 0,
      wC: eff['class'] || 0, wI: eff.ind || 0, wS: eff.sym || 0
    };
  }

  function sharedIndications(ref, cand) {
    var B = indUses(cand), out = [];
    (ref.indications || []).forEach(function (i) {
      var u = i.use.toLowerCase().trim();
      for (var k = 0; k < B.length; k++) { if (indRelated(u, B[k])) { out.push(i.use); return; } }
    });
    return out;
  }

  // Receptors the candidate binds meaningfully (pKi ≥ 6) that the reference
  // does NOT — the new mechanistic coverage the complementary agent adds.
  function addedTargets(ref, cand) {
    var out = [];
    if (!hasKi(cand)) return out;
    for (var r in cand.receptorKi) {
      var pc = pKi(cand.receptorKi[r]);
      if (pc < 6) continue;
      var refKi = ref.receptorKi ? ref.receptorKi[r] : null;
      var pr = (refKi != null) ? pKi(refKi) : 0;
      if (pr < 6) out.push({ r: r, pCand: pc, pRef: pr });
    }
    return out.sort(function (a, b) { return b.pCand - a.pCand; });
  }
  // Receptors the reference binds that the candidate does not — coverage the
  // reference keeps carrying (so the pair together spans both sets).
  function refOnlyTargets(ref, cand) {
    var out = [];
    if (!hasKi(ref)) return out;
    for (var r in ref.receptorKi) {
      var pr = pKi(ref.receptorKi[r]);
      if (pr < 6) continue;
      var candKi = cand.receptorKi ? cand.receptorKi[r] : null;
      var pc = (candKi != null) ? pKi(candKi) : 0;
      if (pc < 6) out.push({ r: r, pRef: pr });
    }
    return out.sort(function (a, b) { return b.pRef - a.pRef; });
  }

  // ── ACTION divergence (Phase 2) ──────────────────────────────────────────
  // Affinity says the two agents share a receptor; ACTION says whether they do
  // the same thing there. A D2 antagonist and a D2 partial agonist overlap
  // almost perfectly by binding fingerprint yet are functionally complementary
  // — this axis is what makes that visible.
  //
  // Scored only over receptors BOTH agents bind meaningfully (pKi >= 6) and for
  // which both actions are characterized. Each shared receptor contributes the
  // functional distance between the two actions, weighted by the weaker of the
  // two binding strengths (so a contrast at a strongly-bound receptor counts
  // more than one at a marginal target). Returns null when no shared receptor
  // is scorable — the pair simply has no action contrast to measure.
  function actionInfo(ref, cand) {
    var RA = window.ReceptorActions;
    if (!RA || !hasKi(ref) || !hasKi(cand)) return { score: null, contrasts: [] };
    var num = 0, den = 0, contrasts = [];
    for (var r in ref.receptorKi) {
      if (!cand.receptorKi || cand.receptorKi[r] == null) continue;
      var pRef = pKi(ref.receptorKi[r]), pCand = pKi(cand.receptorKi[r]);
      if (pRef < 6 || pCand < 6) continue;                  // not a real shared target
      var aRef = RA.actionFor(ref.id, r), aCand = RA.actionFor(cand.id, r);
      var d = RA.distance(aRef, aCand);
      if (d === null) continue;                             // uncharacterized -> skip
      var w = Math.min(pRef - FLOOR, pCand - FLOOR);
      if (w <= 0) continue;
      num += d * w; den += w;
      if (d > 0) contrasts.push({ r: r, refAct: aRef, candAct: aCand, dist: d, pRef: pRef, pCand: pCand });
    }
    if (den === 0) return { score: null, contrasts: [] };
    contrasts.sort(function (a, b) { return (b.dist * Math.min(b.pRef, b.pCand)) - (a.dist * Math.min(a.pRef, a.pCand)); });
    // Aggregation: a flat mean would dilute the one contrast that matters —
    // two antipsychotics acting oppositely at D2 also act identically at H1,
    // alpha1 and 5HT2A, dragging the average toward zero. Complementarity is
    // about the PRESENCE of a meaningful functional difference, so the peak
    // contrast dominates, tempered by how broadly the pair differs overall.
    var mean = num / den, peak = 0;
    contrasts.forEach(function (c) { if (c.dist > peak) peak = c.dist; });
    return { score: 0.7 * peak + 0.3 * mean, peak: peak, mean: mean, contrasts: contrasts };
  }

  // A pair whose receptor fingerprints overlap heavily can still be a rational
  // combination if they ACT differently at those shared receptors. This floor
  // lets such pairs past the overlap ceiling.
  var ACTION_FLOOR = 0.30;

  // ── Interaction flags: P450 conflicts & additive QT ──────────────────────
  // A pharmacokinetic conflict exists when one agent inhibits or induces a CYP
  // enzyme that the OTHER agent is a substrate of (so its levels rise or fall).
  function p450(med) {
    var p = med.p450 || {};
    return {
      substrate: p.substrate || [],
      inhibits: p.inhibits || {},
      induces: p.induces || []
    };
  }
  var SEV_RANK = { strong: 3, moderate: 2, weak: 1 };
  function p450Conflicts(ref, cand) {
    var out = [];
    function scan(actor, target) {
      var a = p450(actor), b = p450(target);
      for (var e in a.inhibits) {
        if (b.substrate.indexOf(e) !== -1) {
          out.push({ enzyme: e, actor: actor.name, target: target.name, effect: 'inhibits', strength: a.inhibits[e], dir: '↑' });
        }
      }
      a.induces.forEach(function (e) {
        if (b.substrate.indexOf(e) !== -1) {
          out.push({ enzyme: e, actor: actor.name, target: target.name, effect: 'induces', strength: 'inducer', dir: '↓' });
        }
      });
    }
    scan(ref, cand);
    scan(cand, ref);
    // Highest-severity first (induction treated as strong-equivalent)
    out.sort(function (x, y) {
      var rx = x.effect === 'induces' ? 3 : (SEV_RANK[x.strength] || 0);
      var ry = y.effect === 'induces' ? 3 : (SEV_RANK[y.strength] || 0);
      return ry - rx;
    });
    return out;
  }
  function conflictSeverity(list) {
    var max = 0;
    list.forEach(function (c) {
      var r = c.effect === 'induces' ? 3 : (SEV_RANK[c.strength] || 0);
      if (r > max) max = r;
    });
    return max; // 0 none, 1 weak, 2 moderate, 3 strong/inducer
  }
  function qtAdditive(ref, cand) { return !!ref.qtInterval && !!cand.qtInterval; }

  // ── Small render helpers ─────────────────────────────────────────────────
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function pct(x) { return Math.round(x) + '%'; }
  function bar(label, frac, note) {
    var p = Math.round(frac * 100);
    return '<div class="cm-metric">'
      + '<div class="cm-metric-top"><span class="cm-metric-label">' + label + '</span>'
      + '<span class="cm-metric-val">' + p + '%</span></div>'
      + '<div class="cm-metric-track"><div class="cm-metric-fill" style="width:' + p + '%"></div></div>'
      + (note ? '<div class="cm-metric-note">' + note + '</div>' : '')
      + '</div>';
  }
  function chip(r) {
    var c = COLORS[r] || '#8b6914';
    return '<span class="cm-chip" style="--cm-chip:' + c + '">' + esc(r) + '</span>';
  }

  // Symptom-coverage chips: which residual domains this agent addresses, and
  // which it may make worse.
  function covChip(entry, negative) {
    var SD = window.SymptomDomains;
    var why = entry.contributors.map(function (c) { return c.receptor + ' ' + c.action; }).join(', ');
    return '<span class="cm-cov' + (negative ? ' cm-cov--neg' : '') + '">'
      + '<span class="cm-cov-d">' + esc(SD.short(entry.domain)) + '</span>'
      + (why ? '<span class="cm-cov-w">' + esc(why) + '</span>' : '') + '</span>';
  }
  function coverageBlock(row) {
    var cov = row.s.cov;
    if (!cov) return '';
    var html = '';
    if (cov.covers.length) {
      html += '<div class="cm-shared cm-shared--cov"><span class="cm-shared-label">Covers residual:</span> '
        + cov.covers.map(function (c) { return covChip(c, false); }).join('') + '</div>';
    }
    if (cov.worsens.length) {
      html += '<div class="cm-shared cm-shared--cov"><span class="cm-shared-label cm-shared-label--neg">May worsen:</span> '
        + cov.worsens.map(function (c) { return covChip(c, true); }).join('') + '</div>';
    }
    if (!cov.covers.length && !cov.worsens.length) {
      html += '<div class="cm-cov-none">No clear mechanistic coverage of the selected residual symptoms.</div>';
    }
    return html;
  }

  // Contraindicated pairs — reported so the reasoning is visible, never ranked.
  function excludedBlock(ref) {
    if (!lastExcluded || !lastExcluded.length) return '';
    var html = '<div class="cm-excluded"><div class="cm-excluded-title">&#10006; Excluded as contraindicated with '
      + esc(ref.name) + '</div>'
      + '<div class="cm-excluded-sub">These agents share an indication with ' + esc(ref.name)
      + ' and would otherwise rank, but must not be combined. They are listed so the reasoning is visible '
      + '&mdash; not as options.</div>';
    lastExcluded.forEach(function (x) {
      html += '<div class="cm-excl-item"><span class="cm-excl-name">' + esc(x.med.name) + '</span>';
      x.reasons.forEach(function (rs) {
        html += '<div class="cm-excl-reason"><strong>' + esc(rs.title) + '.</strong> ' + esc(rs.detail) + '</div>';
      });
      html += '</div>';
    });
    return html + '</div>';
  }

  // Cascade tiers spelled out: "1st messenger (receptor/membrane)" rather than a
  // bare short code, so the axis reads as pharmacology instead of jargon.
  var TIER_ORD = { 1: '1st', 2: '2nd', 3: '3rd', 4: '4th' };
  function tierNames(medId) {
    var MT = window.MechanismTiers;
    if (!MT) return '';
    return MT.tiersFor(medId).map(function (t) {
      var meta = MT.TIERS[t];
      if (!meta) return t;
      return (TIER_ORD[meta.n] || meta.n) + ' messenger (' + meta.short + ')';
    }).join(' + ');
  }
  function tierChip(med) {
    return '<span class="cm-tier-chip"><span class="cm-tier-chip-n">' + esc(med.name) + '</span>'
      + '<span class="cm-tier-chip-t">' + esc(tierNames(med.id)) + '</span></span>';
  }
  // Action contrasts written out in full: "antagonist -> partial agonist".
  function contrastText(c) {
    var RA = window.ReceptorActions;
    return c.r + ' ' + RA.label(c.refAct) + ' \u2192 ' + RA.label(c.candAct);
  }

  // Action contrast: same receptor, different functional action.
  function actxChip(c) {
    var RA = window.ReceptorActions;
    var col = COLORS[c.r] || '#8b6914';
    return '<span class="cm-actx" style="--cm-chip:' + col + '">'
      + '<span class="cm-actx-r">' + esc(c.r) + '</span>'
      + '<span class="cm-actx-a">' + esc(RA.label(c.refAct)) + '</span>'
      + '<span class="cm-actx-arrow">&rarr;</span>'
      + '<span class="cm-actx-b">' + esc(RA.label(c.candAct)) + '</span></span>';
  }

  // ── Curated combination strategies (Phase 1 knowledge base) ──────────────
  function medById(id) {
    for (var i = 0; i < MEDICATIONS.length; i++) { if (MEDICATIONS[i].id === id) return MEDICATIONS[i]; }
    return null;
  }
  function addLabel(add) {
    if (!add) return { name: '', brand: '', external: false };
    if (add.external) return { name: add.label, brand: add.brand || '', external: true };
    var m = medById(add.id);
    return m ? { name: m.name, brand: m.brandName, external: false } : { name: add.id, brand: '', external: false };
  }
  // Human-readable description of an entry's anchor (for addon-direction display).
  function describeAnchor(entry) {
    var a = entry.anchor || {};
    var parts = [];
    if (a.ids && a.ids.length) {
      a.ids.forEach(function (id) { var m = medById(id); parts.push(m ? m.name : id); });
    }
    if (a.classes && a.classes.length) { a.classes.forEach(function (c) { parts.push('any ' + c); }); }
    if (!parts.length) return 'the base agent';
    if (parts.length === 1) return parts[0];
    if (parts.length === 2) return parts[0] + ' or ' + parts[1];
    return parts.slice(0, -1).join(', ') + ', or ' + parts[parts.length - 1];
  }
  function evBadge(ev) {
    var CS = window.CombinationStrategies;
    var short = (CS && CS.EVIDENCE_SHORT[ev]) || ev;
    return '<span class="cm-combo-badge cm-combo-badge--' + esc(ev) + '">' + esc(short) + '</span>';
  }
  function comboCard(entry, add, direction, refName) {
    var lab = addLabel(add);
    var title, sub;
    if (direction === 'anchor') {
      title = '<span class="cm-combo-op">+</span> <span class="cm-combo-add">' + esc(lab.name) + '</span>'
        + (lab.brand ? ' <span class="cm-combo-brand">' + esc(lab.brand) + '</span>' : '')
        + (lab.external ? ' <span class="cm-combo-ext">adjunct</span>' : '');
      sub = esc(entry.condition);
    } else {
      title = '<span class="cm-combo-add">' + esc(refName) + '</span> <span class="cm-combo-op">augments</span> '
        + '<span class="cm-combo-anchor">' + esc(describeAnchor(entry)) + '</span>';
      sub = esc(entry.condition);
    }
    var html = '<div class="cm-combo cm-combo--' + esc(entry.evidence) + '">';
    html += '<div class="cm-combo-top">' + title + evBadge(entry.evidence)
      + (entry.nickname ? '<span class="cm-combo-nick">' + esc(entry.nickname) + '</span>' : '') + '</div>';
    html += '<div class="cm-combo-cond">' + sub + '</div>';
    html += '<div class="cm-combo-why">' + esc(entry.rationale) + '</div>';
    if (entry.monitoring) html += '<div class="cm-combo-monitor"><strong>Monitor:</strong> ' + esc(entry.monitoring) + '</div>';
    if (entry.ref) html += '<div class="cm-combo-cite">' + esc(entry.ref) + '</div>';
    html += '</div>';
    return html;
  }
  function combosBlock(ref) {
    var CS = window.CombinationStrategies;
    if (!CS) return '';
    var res = CS.lookup(ref);
    if (!res.anchor.length && !res.addon.length) return '';
    var html = '<div class="cm-combos">';
    html += '<div class="cm-combos-head"><span class="cm-combos-title">&#9733; Known evidence-based combinations</span>'
      + '<span class="cm-combos-sub">Curated augmentation strategies involving ' + esc(ref.name)
      + ' &mdash; drawn from clinical evidence, not computed from receptor divergence.</span></div>';
    if (res.anchor.length) {
      html += '<div class="cm-combos-role">Add to ' + esc(ref.name) + ':</div>';
      html += '<div class="cm-combo-list">';
      res.anchor.forEach(function (r) { html += comboCard(r.entry, r.add, 'anchor', ref.name); });
      html += '</div>';
    }
    if (res.addon.length) {
      html += '<div class="cm-combos-role">' + esc(ref.name) + ' as an add-on agent:</div>';
      html += '<div class="cm-combo-list">';
      res.addon.forEach(function (r) { html += comboCard(r.entry, null, 'addon', ref.name); });
      html += '</div>';
    }
    html += '<div class="cm-combos-foot">Evidence tier is a guide, not a substitute for the full trial record. Confirm current labeling, interactions, and patient-specific risks before combining.</div>';
    html += '</div>';
    return html;
  }

  // Safety-flag block: additive QT and known P450 interactions between the pair.
  function flagsBlock(ref, row) {
    var conflicts = row.p450, qt = row.qt;
    if (!qt && !conflicts.length) {
      return '<div class="cm-flags cm-flags--clear"><span class="cm-flag-dot">&#10003;</span>'
        + 'No additive QT or known P450 interaction with ' + esc(ref.name) + '.</div>';
    }
    var sev = conflictSeverity(conflicts);
    var lvl = qt ? 'high' : (sev >= 3 ? 'high' : (sev === 2 ? 'mod' : 'low'));
    var html = '<div class="cm-flags cm-flags--' + lvl + '">';
    html += '<div class="cm-flags-title">&#9888; Interaction flags</div>';
    if (qt) {
      html += '<div class="cm-flag"><span class="cm-flag-badge cm-flag-badge--qt">QT</span>'
        + 'Additive QT prolongation &mdash; both agents prolong QT. Avoid combining or monitor ECG and electrolytes.</div>';
    }
    conflicts.forEach(function (c) {
      var bsev = c.effect === 'induces' ? 'high' : (c.strength === 'strong' ? 'high' : (c.strength === 'moderate' ? 'mod' : 'low'));
      html += '<div class="cm-flag"><span class="cm-flag-badge cm-flag-badge--' + bsev + '">' + esc(c.enzyme) + '</span>'
        + esc(c.actor) + (c.effect === 'induces'
            ? ' induces ' + esc(c.enzyme) + ' &rarr; &darr; ' + esc(c.target) + ' levels'
            : ' (' + esc(c.strength) + ' ' + esc(c.enzyme) + ' inhibitor) &rarr; &uarr; ' + esc(c.target) + ' levels')
        + '</div>';
    });
    return html + '</div>';
  }

  // ── State ────────────────────────────────────────────────────────────────
  var lastRanked = null, lastRef = null, lastSameCat = true, lastExcluded = [], lastRouteFiltered = 0, lastRoutePassed = 0;
  var STEP = 6;            // how many results per "show more" click
  var shownCount = STEP;   // how many are currently displayed

  function populateSelect() {
    var sel = document.getElementById('cm-ref-select');
    if (!sel || sel.dataset.filled) return;
    var byCat = {};
    MEDICATIONS.forEach(function (m) { (byCat[m.category] = byCat[m.category] || []).push(m); });
    var html = '<option value="">— Select —</option>';
    Object.keys(byCat).sort().forEach(function (cat) {
      html += '<optgroup label="' + esc(cat) + '">';
      byCat[cat].sort(function (a, b) { return a.name.localeCompare(b.name); }).forEach(function (m) {
        html += '<option value="' + m.id + '">' + esc(m.name) + ' (' + esc(m.brandName) + ')</option>';
      });
      html += '</optgroup>';
    });
    sel.innerHTML = html;
    sel.dataset.filled = '1';
  }

  function compute() {
    var sel = document.getElementById('cm-ref-select');
    var refId = sel && sel.value;
    var results = document.getElementById('cm-results');
    if (!refId) { if (results) { results.style.display = 'none'; } return; }
    var ref = MEDICATIONS.filter(function (m) { return m.id === refId; })[0];
    var sameCat = document.getElementById('cm-samecat').checked;

    // Eligibility: candidate must have receptor data AND share ≥1 indication.
    var cand = MEDICATIONS.filter(function (m) { return m.id !== refId; });
    if (sameCat) cand = cand.filter(function (m) { return m.category === ref.category; });
    var refFp = fingerprint(ref);
    var excluded = [];
    var routeFiltered = 0;   // shared an indication but wrong route
    var routePassed = 0;     // shared an indication AND matched the route
    cand = cand.filter(function (m) {
      if (sharedIndications(ref, m).length === 0) return false;

      // Route filter — applied before the safety and mechanism gates so the
      // count of route-excluded agents stays meaningful.
      if (window.Routes && !window.Routes.hasAny(m.id, selectedRoutes)) { routeFiltered++; return false; }
      routePassed++;

      // Safety gate first: a contraindicated pair is never ranked, however
      // mechanistically complementary it may look. It is reported separately.
      var PS = window.PairSafety;
      if (PS) {
        var chk = PS.check(ref, m);
        if (chk.severity === 'contraindicated') {
          excluded.push({ med: m, reasons: chk.reasons });
          return false;
        }
      }

      // Agents with no receptor-binding data (lithium, valproate, esketamine…)
      // cannot be assessed on the receptor axes at all — they qualify on the
      // cascade-tier axis instead, so admit them and let score() drop the
      // inapplicable dimensions.
      if (!hasKi(ref) || !hasKi(m)) return true;

      if (cosine(refFp, fingerprint(m)) <= OVERLAP_CEILING) return true;
      // High receptor overlap, but do they ACT differently at those receptors?
      var a = actionInfo(ref, m);
      return a.score !== null && a.score >= ACTION_FLOOR;
    });

    var ranked = cand.map(function (c) {
      var act = actionInfo(ref, c);
      return {
        med: c, s: score(ref, c, act), act: act,
        rescued: hasKi(ref) && hasKi(c) && cosine(refFp, fingerprint(c)) > OVERLAP_CEILING,
        safety: window.PairSafety ? window.PairSafety.check(ref, c) : null,
        added: addedTargets(ref, c),
        refOnly: refOnlyTargets(ref, c),
        inds: sharedIndications(ref, c),
        p450: p450Conflicts(ref, c),
        qt: qtAdditive(ref, c)
      };
    }).sort(function (a, b) { return b.s.total - a.s.total; });

    lastExcluded = excluded;
    lastRouteFiltered = routeFiltered;
    lastRoutePassed = routePassed;
    lastRanked = ranked; lastRef = ref; lastSameCat = sameCat;
    shownCount = STEP;               // reset to the first page on every new search
    render(ref, ranked, sameCat);
  }

  function render(ref, ranked, sameCat) {
    var results = document.getElementById('cm-results');
    var shownN = Math.min(shownCount, ranked.length);
    var top = ranked.slice(0, shownN);
    var html = '';

    // Reference banner leads; the curated combinations card is held back and
    // rendered BELOW the ranked options.
    var refBanner = '<div class="cm-ref-banner">'
      + '<span class="cm-ref-tag">Reference</span>'
      + '<span class="cm-ref-name">' + esc(ref.name) + '</span>'
      + '<span class="cm-ref-brand">' + esc(ref.brandName) + '</span>'
      + '<span class="cm-ref-class">' + esc(ref.class) + ' · ' + esc(ref.category) + '</span>'
      + '</div>';
    html += refBanner;

    // Active route filter — state it plainly so a short list is never mistaken
    // for "these are the only complementary options".
    if (selectedRoutes.length && window.Routes) {
      html += '<div class="cm-routefilter">'
        + '<span class="cm-routefilter-label">Route filter:</span> '
        + selectedRoutes.map(function (rt) {
            return '<span class="cm-route-chip cm-route-chip--match">' + esc(window.Routes.short(rt)) + '</span>';
          }).join('')
        + '<span class="cm-routefilter-txt">showing only agents available as '
        + esc(selectedRoutes.map(function (rt) { return window.Routes.label(rt); }).join(' or '))
        + (lastRouteFiltered ? ' &mdash; ' + lastRouteFiltered + ' otherwise-eligible agent'
            + (lastRouteFiltered > 1 ? 's' : '') + ' hidden by this filter' : '')
        + '.</span></div>';
    }

    // What does the reference itself already cover, and what is the gap?
    var doms = selectedDomains();
    if (doms.length && window.SymptomDomains) {
      var g = window.SymptomDomains.gaps(ref, doms);
      html += '<div class="cm-gap">';
      html += '<span class="cm-gap-label">Targeting residual:</span> ';
      html += doms.map(function (d) {
        var covered = g.covered.indexOf(d) !== -1;
        return '<span class="cm-gap-chip' + (covered ? ' cm-gap-chip--covered' : ' cm-gap-chip--gap') + '">'
          + esc(window.SymptomDomains.short(d)) + (covered ? ' &#10003;' : ' gap') + '</span>';
      }).join('');
      html += '<div class="cm-gap-note">' + (g.gaps.length
        ? esc(ref.name) + ' already addresses the ticked domains marked &#10003;. The ones marked <em>gap</em> are what a complementary agent should be chosen for.'
        : esc(ref.name) + ' already has mechanistic coverage of every ticked domain &mdash; consider optimising the current agent before adding another.') + '</div>';
      html += '</div>';
    }


    // Curated evidence-based combinations — built now, emitted after the ranked
    // options. Still shown when the reference has no receptor-binding data.
    var combos = combosBlock(ref);

    if (!hasKi(ref)) {
      html += '<div class="cm-note-inline">Receptor-binding data is not on file for ' + esc(ref.name)
        + ' — its mechanism lies outside the monoamine receptor set, so the receptor- and action-divergence axes cannot be computed for this reference. '
        + 'Ranking below falls back to signal-transduction tier, class and shared indications.</div>';
    }

    if (!top.length) {
      var exOnly = excludedBlock(ref);
      if (exOnly && lastExcluded.length) {
        html += '<div class="cm-note-inline">No <em>rankable</em> complementary agents remain for ' + esc(ref.name)
          + ' &mdash; every candidate sharing an indication is contraindicated in combination with it, for the reasons below.'
          + (sameCat ? ' You can also try unchecking &ldquo;Restrict to same category.&rdquo;' : '') + '</div>';
      } else {
        if (selectedRoutes.length && lastRoutePassed > 0) {
          // Agents DID match the route — they failed the mechanism or safety
          // gates. Saying "none available by this route" would be wrong.
          html += '<div class="cm-note-inline">' + lastRoutePassed + ' agent'
            + (lastRoutePassed > 1 ? 's are' : ' is') + ' available by the selected route ('
            + esc(selectedRoutes.map(function (rt) { return window.Routes.label(rt); }).join(' or '))
            + ') and share an indication with ' + esc(ref.name) + ', but none qualify as <em>complementary</em> '
            + '&mdash; they are either too pharmacologically similar to ' + esc(ref.name)
            + ' (that is the <em>Find Similar Medications</em> question) or contraindicated in combination.</div>';
        } else if (selectedRoutes.length && lastRouteFiltered) {
          html += '<div class="cm-note-inline">No agent sharing an indication with ' + esc(ref.name)
            + ' is available by the selected route ('
            + esc(selectedRoutes.map(function (rt) { return window.Routes.label(rt); }).join(' or ')) + '). '
            + lastRouteFiltered + ' otherwise-eligible agent' + (lastRouteFiltered > 1 ? 's were' : ' was')
            + ' hidden by this filter &mdash; switch back to <em>Any route</em> to see them.</div>';
        } else
        html += '<div class="cm-note-inline">No eligible complementary agents found &mdash; candidates must share at least one indication with ' + esc(ref.name)
          + ' and either diverge mechanistically (receptor overlap &le; ' + Math.round(OVERLAP_CEILING * 100)
          + '%; more-similar agents belong in <em>Find Similar Medications</em>), act differently at shared receptors, '
          + 'or work at a different signal-transduction tier'
          + (sameCat ? '. Try unchecking &ldquo;Restrict to same category.&rdquo;' : '.') + '</div>';
      }
      html += combos;
      html += exOnly;
      results.innerHTML = html;
      results.style.display = '';
      return;
    }

    // Result cards
    html += '<div class="cm-cards">';
    top.forEach(function (row, idx) {
      var m = row.med, s = row.s;
      var whyBits = [];
      if (s.cov && s.cov.covers.length) {
        whyBits.push('covers ' + s.cov.covers.map(function (c) { return window.SymptomDomains.short(c.domain); }).join(' + '));
      }
      if (s.div !== null) whyBits.push(Math.round(s.div * 100) + '% divergent receptor profile');
      if (s.aDiv !== null && s.aDiv > 0 && row.act.contrasts.length) {
        whyBits.push(Math.round(s.aDiv * 100) + '% action divergence at shared receptors ('
          + row.act.contrasts.slice(0, 2).map(function (c) { return c.r; }).join(', ') + ')');
      }
      if (s.cMatch === 1) whyBits.push('same class (' + m.class + ')');
      else if (s.cMatch === 0.7) whyBits.push('same category, different class');
      if (row.inds.length) whyBits.push(row.inds.length + ' shared indication' + (row.inds.length > 1 ? 's' : ''));
      var why = whyBits.join(', ');

      html += '<div class="cm-card">'
        + '<div class="cm-card-head">'
        + '<span class="cm-rank cm-rank--' + (idx + 1) + '">#' + (idx + 1) + '</span>'
        + '<div class="cm-card-title"><span class="cm-card-name">' + esc(m.name) + '</span>'
        + '<span class="cm-card-brand">' + esc(m.brandName) + ' · ' + esc(m.class) + '</span></div>'
        + '<span class="cm-overall">' + pct(s.total) + '<small>complement</small></span>'
        + '</div>';

      html += '<div class="cm-why">Why: ' + esc(why) + '.</div>';

      if (row.rescued) {
        html += '<div class="cm-rescue"><strong>Note:</strong> these two bind a highly similar receptor set ('
          + pct(s.cos * 100) + ' overlap). They appear here only because they <em>act differently</em> at those shared receptors '
          + '&mdash; the dopamine partial-agonist-plus-antagonist pattern. Same-class combination (e.g. antipsychotic polypharmacy) '
          + 'carries additive adverse-effect burden and needs a specific rationale such as clozapine augmentation.</div>';
      }

      html += flagsBlock(ref, row);

      html += '<div class="cm-metrics">';
      if (s.cov) {
        html += bar('Symptom coverage', s.cov.score, 'weight ' + Math.round(s.wS * 100) + '% · '
          + (s.cov.covers.length ? s.cov.covers.length + ' of ' + selectedDomains().length + ' targeted domain'
              + (selectedDomains().length > 1 ? 's' : '') + ' covered' : 'none of the targeted domains covered'));
      }
      if (s.div !== null) {
        html += bar('Receptor divergence', s.div, 'weight ' + Math.round(s.wD * 100) + '% · ' + Math.round(s.cos * 100) + '% receptor overlap');
      } else {
        html += '<div class="cm-metric cm-metric--na"><div class="cm-metric-top">'
          + '<span class="cm-metric-label">Receptor divergence</span><span class="cm-metric-val">n/a</span></div>'
          + '<div class="cm-metric-note">no receptor-binding data on file for one of the pair</div></div>';
      }
      if (s.aDiv !== null) {
        var cs = row.act ? row.act.contrasts : [];
        var noteA;
        if (cs.length) {
          noteA = cs.slice(0, 2).map(contrastText).join(' · ')
            + (cs.length > 2 ? ' · +' + (cs.length - 2) + ' more' : '');
        } else {
          noteA = 'same action at every shared receptor';
        }
        html += bar('Action divergence', s.aDiv, 'weight ' + Math.round(s.wA * 100) + '% · ' + noteA);
      } else {
        html += '<div class="cm-metric cm-metric--na"><div class="cm-metric-top">'
          + '<span class="cm-metric-label">Action divergence</span><span class="cm-metric-val">n/a</span></div>'
          + '<div class="cm-metric-note">no shared receptor with a characterized action &mdash; weight folded into receptor divergence</div></div>';
      }
      if (s.tDiv !== null) {
        html += bar('Cascade-tier divergence', s.tDiv, 'weight ' + Math.round(s.wT * 100) + '% · '
          + esc(ref.name) + ': ' + esc(tierNames(ref.id)) + '  vs  ' + esc(m.name) + ': ' + esc(tierNames(m.id)));
      }
      html += bar('Class match', s.cMatch, 'weight ' + Math.round(s.wC * 100) + '%');
      html += bar('Shared indications', s.iMatch, 'weight ' + Math.round(s.wI * 100) + '%');
      html += '</div>';

      html += '<div class="cm-shared cm-shared--routes"><span class="cm-shared-label">Routes:</span> '
        + routeChips(m.id) + '</div>';
      html += routeNotes(m.id);

      html += coverageBlock(row);

      if (s.tDiv !== null && s.tDiv > 0) {
        html += '<div class="cm-shared cm-shared--tier"><span class="cm-shared-label">Cascade tier:</span> '
          + tierChip(ref) + tierChip(m) + '</div>';
      }

      var MTn = window.MechanismTiers ? window.MechanismTiers.noteFor(m.id) : null;
      if (MTn) {
        html += '<div class="cm-tiernote"><strong>Acts downstream:</strong> ' + esc(MTn) + '</div>';
      }
      if (row.safety && row.safety.reasons.length) {
        row.safety.reasons.forEach(function (rs) {
          html += '<div class="cm-safety cm-safety--' + esc(rs.severity) + '">'
            + '<span class="cm-safety-badge">' + (rs.severity === 'contraindicated' ? '&#10006;' : '&#9888;') + '</span>'
            + '<span><strong>' + esc(rs.title) + '.</strong> ' + esc(rs.detail) + '</span></div>';
        });
      }
      if (row.act && row.act.contrasts.length) {
        html += '<div class="cm-shared cm-shared--actx"><span class="cm-shared-label">Same receptor, different action:</span> '
          + row.act.contrasts.slice(0, 5).map(actxChip).join('') + '</div>';
      }
      if (row.added.length) {
        html += '<div class="cm-shared"><span class="cm-shared-label">New coverage from ' + esc(m.name) + ':</span> '
          + row.added.slice(0, 6).map(function (t) { return chip(t.r); }).join('') + '</div>';
      }
      if (row.refOnly.length) {
        html += '<div class="cm-shared cm-shared--muted"><span class="cm-shared-label">' + esc(ref.name) + ' still covers:</span> '
          + row.refOnly.slice(0, 6).map(function (t) { return chip(t.r); }).join('') + '</div>';
      }
      if (row.inds.length) {
        html += '<div class="cm-shared"><span class="cm-shared-label">Shared indications:</span> '
          + '<span class="cm-inds">' + row.inds.map(esc).join(', ') + '</span></div>';
      }
      html += '</div>';
    });
    html += '</div>';

    // Curated evidence-based combinations, below the ranked options.
    html += combos;

    // Receptor comparison table (reference + all shown candidates)
    var cols = [ref].concat(top.map(function (r) { return r.med; })).filter(hasKi);
    var recSet = {};
    cols.forEach(function (m) {
      if (m.receptorKi) for (var r in m.receptorKi) { if (pKi(m.receptorKi[r]) >= 6) recSet[r] = 1; }
    });
    var order = (typeof RECEPTOR_LIST !== 'undefined') ? RECEPTOR_LIST : Object.keys(recSet);
    var recs = order.filter(function (r) { return recSet[r]; });
    Object.keys(recSet).forEach(function (r) { if (recs.indexOf(r) === -1) recs.push(r); });

    if (recs.length) {
      html += '<div class="cm-table-wrap"><div class="cm-table-title">Receptor binding comparison '
        + '<span class="cm-table-sub">strength bars = pKi; longer = stronger affinity (lower K<sub>i</sub>). Look for targets the reference misses.</span></div>';
      html += '<table class="cm-table"><thead><tr><th>Receptor</th>';
      cols.forEach(function (m, i) {
        html += '<th' + (i === 0 ? ' class="cm-th-ref"' : '') + '>' + esc(m.name) + '</th>';
      });
      html += '</tr></thead><tbody>';
      recs.forEach(function (r) {
        html += '<tr><td class="cm-rec-cell">' + chip(r) + '</td>';
        cols.forEach(function (m) {
          var ki = m.receptorKi ? m.receptorKi[r] : null;
          if (ki == null) { html += '<td class="cm-cell cm-cell--none">·</td>'; return; }
          var p = pKi(ki);
          var w = Math.max(0, Math.min(100, ((p - FLOOR) / (10 - FLOOR)) * 100));
          var strong = p >= 8;
          html += '<td class="cm-cell"><div class="cm-cell-bar" style="width:' + w.toFixed(0) + '%"></div>'
            + '<span class="cm-cell-val' + (strong ? ' cm-cell-val--strong' : '') + '">' + p.toFixed(1) + '</span></td>';
        });
        html += '</tr>';
      });
      html += '</tbody></table></div>';
    }

    html += excludedBlock(ref);

    // Clinical footnote + report button
    html += '<div class="cm-clinical">'
      + '<strong>Rational combination &amp; augmentation:</strong> agents that treat the same condition through <em>non-overlapping</em> receptor mechanisms '
      + 'can broaden coverage of residual symptoms (e.g. adding bupropion or mirtazapine to an SSRI). Mechanistic divergence is only a starting point &mdash; '
      + 'before combining, check for pharmacokinetic interactions (CYP450), additive serotonergic load (serotonin syndrome), overlapping toxicities (QT, sedation, seizure threshold), '
      + 'and whether monotherapy optimization or a switch is the better move. These rankings inform, not replace, that decision.'
      + '</div>';

    var remaining = ranked.length - shownN;
    html += '<div class="cm-actions">';
    html += '<button class="btn-primary cm-report-btn" id="cm-report-btn">Copy Summary</button>';
    if (remaining > 0) {
      var next = Math.min(STEP, remaining);
      html += '<button class="cm-more-btn" id="cm-more-btn">Not these? Show ' + next + ' more '
        + '<span class="cm-more-sub">(' + remaining + ' left)</span></button>';
    }
    html += '</div>';
    if (ranked.length > STEP) {
      html += '<div class="cm-count-note">Showing ' + shownN + ' of ' + ranked.length
        + ' eligible complementary agents, ranked by score.</div>';
    }

    results.innerHTML = html;
    results.style.display = '';

    var rbtn = document.getElementById('cm-report-btn');
    if (rbtn) rbtn.addEventListener('click', function () { copyReport(this); });
    var mbtn = document.getElementById('cm-more-btn');
    if (mbtn) mbtn.addEventListener('click', function () {
      var firstNew = shownCount;                         // index of first newly revealed card
      shownCount = Math.min(shownCount + STEP, lastRanked.length);
      render(lastRef, lastRanked, lastSameCat);
      var cards = document.querySelectorAll('#cm-results .cm-card');
      if (cards[firstNew]) cards[firstNew].scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  function copyReport(btn) {
    if (!lastRef || !lastRanked) return;
    var ref = lastRef, top = lastRanked.slice(0, Math.min(shownCount, lastRanked.length));
    var date = (window.ToolUtils && ToolUtils.dateStamp) ? ToolUtils.dateStamp()
      : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    var t = 'Complementary Medication Analysis\nDate: ' + date + '\n\n';
    var w = normWeights();
    t += 'Reference medication: ' + ref.name + ' (' + ref.brandName + ') — ' + ref.class + ', ' + ref.category + '\n';
    if (selectedRoutes.length && window.Routes) {
      t += 'Route filter: ' + selectedRoutes.map(function (rt) { return window.Routes.label(rt); }).join(' or ') + '\n';
    }
    t += '\n';

    // Curated evidence-based combinations (Phase 1 knowledge base)
    var CS = window.CombinationStrategies;
    if (CS) {
      var res = CS.lookup(ref);
      if (res.anchor.length || res.addon.length) {
        t += 'KNOWN EVIDENCE-BASED COMBINATIONS (curated)\n';
        res.anchor.forEach(function (r) {
          var lab = addLabel(r.add);
          t += '  + ' + lab.name + (lab.brand ? ' (' + lab.brand + ')' : '')
            + '  [' + (CS.EVIDENCE_SHORT[r.entry.evidence] || r.entry.evidence) + ']'
            + (r.entry.nickname ? ' — "' + r.entry.nickname + '"' : '') + '\n';
          t += '     ' + r.entry.condition + '. ' + r.entry.rationale + '\n';
          if (r.entry.monitoring) t += '     Monitor: ' + r.entry.monitoring + '\n';
        });
        res.addon.forEach(function (r) {
          t += '  ' + ref.name + ' augments ' + describeAnchor(r.entry)
            + '  [' + (CS.EVIDENCE_SHORT[r.entry.evidence] || r.entry.evidence) + '] — ' + r.entry.condition + '\n';
        });
        t += '\n';
      }
    }

    if (top.length) {
    t += 'COMPUTED COMPLEMENTARY AGENTS (receptor divergence ' + Math.round(w.wD * 100)
      + '%, class ' + Math.round(w.wC * 100) + '%, shared indications ' + Math.round(w.wI * 100) + '%).\n';
    t += 'Candidates share ≥1 indication and cover a different receptor set — rational combination/augmentation options.\n\n';
    }
    top.forEach(function (row, i) {
      var m = row.med, s = row.s;
      t += (i + 1) + '. ' + m.name + ' (' + m.brandName + ') — ' + m.class + '  |  ' + Math.round(s.total) + '% complement\n';
      t += '   Receptor divergence: ' + (s.div === null ? 'n/a' : Math.round(s.div * 100) + '% (' + Math.round(s.cos * 100) + '% overlap)') + '  ·  '
        + 'Cascade tier: ' + (s.tDiv === null ? 'n/a' : Math.round(s.tDiv * 100) + '%') + '  ·  '
        + 'Action divergence: ' + (s.aDiv === null ? 'n/a' : Math.round(s.aDiv * 100) + '%') + '  ·  '
        + 'Class: ' + Math.round(s.cMatch * 100) + '%  ·  Indications: ' + Math.round(s.iMatch * 100) + '%\n';
      if (row.safety) row.safety.reasons.forEach(function (rs) {
        t += '   ' + (rs.severity === 'contraindicated' ? 'CONTRAINDICATED' : 'CAUTION') + ' - ' + rs.title + ': ' + rs.detail + '\n';
      });
      if (s.tDiv !== null && window.MechanismTiers) {
        t += '   Cascade tier: ' + ref.name + ' = ' + tierNames(ref.id) + '; ' + m.name + ' = ' + tierNames(m.id) + '\n';
      }
      if (window.Routes) t += '   Routes: ' + window.Routes.sorted(m.id).map(function (rt) {
        return window.Routes.short(rt);
      }).join(', ') + '\n';
      if (s.cov) {
        if (s.cov.covers.length) t += '   Covers residual: ' + s.cov.covers.map(function (c) {
          return window.SymptomDomains.short(c.domain) + ' (' + c.contributors.map(function (x) { return x.receptor + ' ' + x.action; }).join(', ') + ')';
        }).join('; ') + '\n';
        if (s.cov.worsens.length) t += '   MAY WORSEN: ' + s.cov.worsens.map(function (c) {
          return window.SymptomDomains.short(c.domain) + ' (' + c.contributors.map(function (x) { return x.receptor + ' ' + x.action; }).join(', ') + ')';
        }).join('; ') + '\n';
      }
      if (row.act && row.act.contrasts.length) {
        t += '   Same receptor, different action: ' + row.act.contrasts.slice(0, 5).map(function (c) {
          return c.r + ' ' + window.ReceptorActions.label(c.refAct) + ' -> ' + window.ReceptorActions.label(c.candAct);
        }).join('; ') + '\n';
      }
      if (row.added.length) t += '   New receptor coverage: ' + row.added.slice(0, 6).map(function (x) { return x.r; }).join(', ') + '\n';
      if (row.inds.length) t += '   Shared indications: ' + row.inds.join(', ') + '\n';
      if (row.qt) t += '   FLAG - Additive QT: both agents prolong QT; monitor ECG/electrolytes.\n';
      row.p450.forEach(function (c) {
        t += '   FLAG - P450: ' + (c.effect === 'induces'
          ? c.actor + ' induces ' + c.enzyme + ' -> lowers ' + c.target + ' levels'
          : c.actor + ' (' + c.strength + ' ' + c.enzyme + ' inhibitor) -> raises ' + c.target + ' levels') + '\n';
      });
      if (!row.qt && !row.p450.length) t += '   No additive QT or known P450 interaction.\n';
      t += '\n';
    });
    if (lastExcluded && lastExcluded.length) {
      t += 'EXCLUDED AS CONTRAINDICATED WITH ' + ref.name.toUpperCase() + ':\n';
      lastExcluded.forEach(function (x) {
        t += '  ' + x.med.name + ' — ' + x.reasons.map(function (r) { return r.title; }).join('; ') + '\n';
      });
      t += '\n';
    }
    t += 'Note: Mechanistic complementarity is decision support only. Before combining agents, assess CYP450 interactions, additive serotonergic/QT/sedation/seizure risk, and whether optimizing monotherapy or switching is preferable.\n';

    if (window.ToolUtils && ToolUtils.copyWithButton) { ToolUtils.copyWithButton(t, btn); }
    else {
      navigator.clipboard.writeText(t).then(function () {
        var o = btn.textContent; btn.textContent = 'Copied!'; setTimeout(function () { btn.textContent = o; }, 2000);
      });
    }
  }

  // Update the on-screen % labels to reflect the normalized effective weights.
  var WEIGHT_IDS = ['cm-w-divergence', 'cm-w-action', 'cm-w-tier', 'cm-w-class', 'cm-w-indication', 'cm-w-symptom'];
  function refreshWeightLabels() {
    var w = normWeights();
    function set(id, frac) { var el = document.getElementById(id); if (el) el.textContent = Math.round(frac * 100) + '%'; }
    set('cm-w-divergence-val', w.wD);
    set('cm-w-action-val', w.wA);
    set('cm-w-tier-val', w.wT);
    set('cm-w-class-val', w.wC);
    set('cm-w-indication-val', w.wI);
    set('cm-w-symptom-val', w.wS);
  }

  // ── Wire up ──────────────────────────────────────────────────────────────
  populateSelect();
  var go = document.getElementById('cm-go-btn');
  if (go) go.addEventListener('click', compute);
  var sel = document.getElementById('cm-ref-select');
  if (sel) sel.addEventListener('change', function () { if (lastRef) compute(); });
  var cb = document.getElementById('cm-samecat');
  if (cb) cb.addEventListener('change', function () { if (lastRef) compute(); });
  var symBoxes = document.querySelectorAll('.cm-symptom-box');
  if (symBoxes) Array.prototype.forEach.call(symBoxes, function (b) {
    b.addEventListener('change', function () { if (lastRef) compute(); });
  });
  // Route buttons: "Any route" clears; the others toggle and OR together.
  var routeBtns = document.querySelectorAll('.cm-route-btn');
  function syncRouteBtns() {
    Array.prototype.forEach.call(routeBtns, function (b) {
      var rt = b.getAttribute('data-route');
      var on = rt ? (selectedRoutes.indexOf(rt) !== -1) : (selectedRoutes.length === 0);
      b.classList.toggle('cm-route-btn--on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }
  if (routeBtns) Array.prototype.forEach.call(routeBtns, function (b) {
    b.addEventListener('click', function () {
      var rt = b.getAttribute('data-route');
      if (!rt) { selectedRoutes = []; }
      else {
        var i = selectedRoutes.indexOf(rt);
        if (i === -1) selectedRoutes.push(rt); else selectedRoutes.splice(i, 1);
      }
      syncRouteBtns();
      if (lastRef) compute();
    });
  });
  syncRouteBtns();

  var symClear = document.getElementById('cm-symptom-clear');
  if (symClear) symClear.addEventListener('click', function () {
    Array.prototype.forEach.call(document.querySelectorAll('.cm-symptom-box'), function (b) { b.checked = false; });
    if (lastRef) compute();
  });

  // Sliders: live re-rank + label update as they move.
  WEIGHT_IDS.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', function () { refreshWeightLabels(); if (lastRef) compute(); });
  });
  var reset = document.getElementById('cm-weights-reset');
  if (reset) reset.addEventListener('click', function () {
    WEIGHT_IDS.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.value = el.getAttribute('data-default');
    });
    refreshWeightLabels();
    if (lastRef) compute();
  });
  refreshWeightLabels();
})();

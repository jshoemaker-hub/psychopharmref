/* ── Find Similar Medications ──────────────────────────────────────────────
   Given a "reference" medication that once worked best but has lost effect
   (tachyphylaxis / "poop-out"), rank all other medications by pharmacologic
   similarity and surface the closest matches — a rational starting point for
   a switch.

   Composite similarity score (0–100%), each axis normalized so the usable
   factors always sum to 1. Any axis that cannot be measured for a given pair
   is dropped and its weight redistributed across the axes that CAN be — so a
   pair is never penalised for a dimension that does not apply to it:

     Receptor binding      — cosine similarity of receptor-binding
                             "fingerprint" vectors (pattern of binding, not
                             potency). Null when either agent has no monoamine
                             receptor data on file.
     Action match          — over receptors BOTH agents bind meaningfully, how
                             similarly they ACT there (both antagonists,
                             both reuptake inhibitors, etc.). Null when no
                             shared receptor has a characterized action.
     Cascade-tier match    — agreement in level of signal transduction
                             (membrane vs intracellular vs genomic). Only
                             informative when at least one agent acts past the
                             membrane (lithium, valproate, ketamine…).
     Class / category      — same class = full credit, same category = half.
     Shared indications    — Jaccard overlap of on-label uses.
     Symptom coverage      — optional; when residual symptoms are ticked, how
                             well the candidate's mechanism still covers them.

   When the reference has no monoamine receptor-binding data on file (e.g.
   MAOIs, lithium, anticonvulsant mood stabilizers, gabapentinoids), the
   receptor and action axes drop out and class + indications (+ tier, if the
   agent acts downstream) carry the score.
   ────────────────────────────────────────────────────────────────────────── */
(function () {
  if (typeof MEDICATIONS === 'undefined') { console.error('similar-meds: MEDICATIONS not loaded'); return; }

  var COLORS = (typeof RECEPTOR_COLORS !== 'undefined') ? RECEPTOR_COLORS : {};

  // ── Similarity math ──────────────────────────────────────────────────────
  function pKi(kiNm) { return 9 - Math.log10(kiNm); }              // Ki(nM) → pKi
  var FLOOR = 5;   // pKi 5 = Ki 10,000 nM — below this, binding is negligible

  // Binding fingerprint: {receptor: strengthAboveFloor} keeping only real binding
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
  // Schizophrenia" and "Schizophrenia" describe the same clinical problem.
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

  // ── ACTION match ─────────────────────────────────────────────────────────
  // Affinity says two agents share a receptor; ACTION says whether they do the
  // same thing there. Two agents that are both antagonists at a shared receptor
  // are more truly similar than one antagonist + one partial agonist. Scored
  // over receptors BOTH bind meaningfully (pKi ≥ 6) with characterized actions,
  // weighted by the weaker of the two binding strengths. Returns convergence
  // (1 = identical action everywhere), or null when nothing is scorable.
  function actionInfo(ref, cand) {
    var RA = window.ReceptorActions;
    if (!RA || !hasKi(ref) || !hasKi(cand)) return { score: null, agree: [], differ: [] };
    var num = 0, den = 0, agree = [], differ = [];
    for (var r in ref.receptorKi) {
      if (!cand.receptorKi || cand.receptorKi[r] == null) continue;
      var pRef = pKi(ref.receptorKi[r]), pCand = pKi(cand.receptorKi[r]);
      if (pRef < 6 || pCand < 6) continue;                  // not a real shared target
      var aRef = RA.actionFor(ref.id, r), aCand = RA.actionFor(cand.id, r);
      var d = RA.distance(aRef, aCand);
      if (d === null) continue;                             // uncharacterized -> skip
      var w = Math.min(pRef - FLOOR, pCand - FLOOR);
      if (w <= 0) continue;
      num += (1 - d) * w; den += w;
      var rec = { r: r, refAct: aRef, candAct: aCand, dist: d, pRef: pRef, pCand: pCand };
      if (d <= 0.15) agree.push(rec); else differ.push(rec);
    }
    if (den === 0) return { score: null, agree: [], differ: [] };
    agree.sort(function (a, b) { return Math.min(b.pRef, b.pCand) - Math.min(a.pRef, a.pCand); });
    differ.sort(function (a, b) { return (b.dist * Math.min(b.pRef, b.pCand)) - (a.dist * Math.min(a.pRef, a.pCand)); });
    return { score: num / den, agree: agree, differ: differ };
  }

  // ── CASCADE-TIER match ───────────────────────────────────────────────────
  // Agreement in level of signal transduction. Only discriminating when at
  // least one agent acts past the membrane; when both sit on the default
  // (first-messenger) tier the axis carries no information and is dropped.
  function tierIsDefault(id) {
    var MT = window.MechanismTiers;
    if (!MT) return true;
    var t = MT.tiersFor(id);
    return t.length === 1 && t[0] === 'first';
  }
  function tierMatch(refId, candId) {
    var MT = window.MechanismTiers;
    if (!MT) return null;
    if (tierIsDefault(refId) && tierIsDefault(candId)) return null;
    var div = MT.divergence(refId, candId);
    return (div === null) ? null : (1 - div);
  }

  // ── Residual symptoms (optional coverage axis) ───────────────────────────
  function selectedDomains() {
    var out = [];
    var boxes = document.querySelectorAll('.sm-symptom-box');
    if (!boxes || !boxes.length) return out;
    Array.prototype.forEach.call(boxes, function (b) { if (b.checked) out.push(b.value); });
    return out;
  }

  // ── Route-of-administration filter ───────────────────────────────────────
  // Empty = no filter ("Any route"). Multiple routes are OR-ed.
  var selectedRoutes = [];

  function routeChips(medId) {
    var R = window.Routes;
    if (!R) return '';
    return R.sorted(medId).map(function (rt) {
      var note = R.noteFor(medId, rt);
      var on = selectedRoutes.indexOf(rt) !== -1;
      return '<span class="sm-route-chip' + (on ? ' sm-route-chip--match' : '') + '"'
        + (note ? ' title="' + esc(note) + '"' : '') + '>' + esc(R.short(rt)) + '</span>';
    }).join('');
  }
  function routeNotes(medId) {
    var R = window.Routes;
    if (!R || !selectedRoutes.length) return '';
    var out = [];
    selectedRoutes.forEach(function (rt) {
      if (!R.has(medId, rt)) return;
      var note = R.noteFor(medId, rt);
      if (note) out.push('<div class="sm-route-note"><strong>' + esc(R.short(rt)) + ':</strong> ' + esc(note) + '</div>');
    });
    return out.join('');
  }

  // ── User-adjustable weights (slider toolbar) ─────────────────────────────
  // Sliders hold raw 0–100 values; the score drops any unusable axis and
  // normalizes the rest to sum to 1.
  function readWeights() {
    function v(id, dflt) { var el = document.getElementById(id); return el ? (parseFloat(el.value) || 0) : dflt; }
    return { r: v('sm-w-receptor', 60), a: v('sm-w-action', 15), t: v('sm-w-tier', 10),
             c: v('sm-w-class', 25), i: v('sm-w-indication', 15), s: v('sm-w-symptom', 30) };
  }
  function rawWeights() {
    var raw = readWeights();
    var wR = raw.r, wA = raw.a, wT = raw.t, wC = raw.c, wI = raw.i, wS = raw.s;
    if (wR + wA + wT + wC + wI + wS <= 0) { wR = 60; wA = 15; wT = 10; wC = 25; wI = 15; wS = 30; }
    return { wR: wR, wA: wA, wT: wT, wC: wC, wI: wI, wS: wS };
  }

  function score(ref, cand, act) {
    var w = rawWeights();
    var both = hasKi(ref) && hasKi(cand);
    var cos = both ? cosine(fingerprint(ref), fingerprint(cand)) : null;
    var cMatch = (ref.class === cand.class) ? 1 : (ref.category === cand.category ? 0.5 : 0);
    var iMatch = jaccard(ref, cand);
    var aInfo = act || actionInfo(ref, cand);
    var tM = tierMatch(ref.id, cand.id);
    var SD = window.SymptomDomains;
    var cov = SD ? SD.coverage(cand, selectedDomains()) : null;

    var axes = [
      { k: 'rec', w: w.wR, v: cos },
      { k: 'act', w: w.wA, v: aInfo.score },
      { k: 'tier', w: w.wT, v: tM },
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
      rMatch: cos, aMatch: aInfo.score, tMatch: tM, cMatch: cMatch, iMatch: iMatch, cov: cov,
      agree: aInfo.agree, differ: aInfo.differ,
      wR: eff.rec || 0, wA: eff.act || 0, wT: eff.tier || 0,
      wC: eff['class'] || 0, wI: eff.ind || 0, wS: eff.sym || 0,
      refKi: hasKi(ref)
    };
  }

  // Shared receptor targets where BOTH bind meaningfully (pKi ≥ 6)
  function sharedTargets(ref, cand) {
    if (!hasKi(ref) || !hasKi(cand)) return [];
    var out = [];
    for (var r in ref.receptorKi) {
      if (cand.receptorKi[r] != null) {
        var pr = pKi(ref.receptorKi[r]), pc = pKi(cand.receptorKi[r]);
        if (pr >= 6 && pc >= 6) out.push({ r: r, pRef: pr, pCand: pc, min: Math.min(pr, pc) });
      }
    }
    return out.sort(function (a, b) { return b.min - a.min; });
  }
  function sharedIndications(ref, cand) {
    var B = indUses(cand), out = [];
    (ref.indications || []).forEach(function (i) {
      var u = i.use.toLowerCase().trim();
      for (var k = 0; k < B.length; k++) { if (indRelated(u, B[k])) { out.push(i.use); return; } }
    });
    return out;
  }

  // ── Interaction flags: P450 conflicts & additive QT ──────────────────────
  function p450(med) {
    var p = med.p450 || {};
    return { substrate: p.substrate || [], inhibits: p.inhibits || {}, induces: p.induces || [] };
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
    return max;
  }
  function qtAdditive(ref, cand) { return !!ref.qtInterval && !!cand.qtInterval; }

  // ── Small render helpers ─────────────────────────────────────────────────
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function pct(x) { return Math.round(x) + '%'; }
  function bar(label, frac, note) {
    var p = Math.round(frac * 100);
    return '<div class="sm-metric">'
      + '<div class="sm-metric-top"><span class="sm-metric-label">' + label + '</span>'
      + '<span class="sm-metric-val">' + p + '%</span></div>'
      + '<div class="sm-metric-track"><div class="sm-metric-fill" style="width:' + p + '%"></div></div>'
      + (note ? '<div class="sm-metric-note">' + note + '</div>' : '')
      + '</div>';
  }
  function barNA(label, note) {
    return '<div class="sm-metric sm-metric--na"><div class="sm-metric-top">'
      + '<span class="sm-metric-label">' + label + '</span><span class="sm-metric-val">n/a</span></div>'
      + '<div class="sm-metric-note">' + note + '</div></div>';
  }
  function chip(r) {
    var c = COLORS[r] || '#8b6914';
    return '<span class="sm-chip" style="--sm-chip:' + c + '">' + esc(r) + '</span>';
  }
  // Action agreement: same receptor, same functional action.
  function actMatchChip(c) {
    var RA = window.ReceptorActions;
    var col = COLORS[c.r] || '#8b6914';
    return '<span class="sm-actx sm-actx--match" style="--sm-chip:' + col + '">'
      + '<span class="sm-actx-r">' + esc(c.r) + '</span>'
      + '<span class="sm-actx-a">' + esc(RA.label(c.refAct)) + '</span></span>';
  }
  function actDiffChip(c) {
    var RA = window.ReceptorActions;
    var col = COLORS[c.r] || '#8b6914';
    return '<span class="sm-actx" style="--sm-chip:' + col + '">'
      + '<span class="sm-actx-r">' + esc(c.r) + '</span>'
      + '<span class="sm-actx-a">' + esc(RA.label(c.refAct)) + '</span>'
      + '<span class="sm-actx-arrow">&ne;</span>'
      + '<span class="sm-actx-b">' + esc(RA.label(c.candAct)) + '</span></span>';
  }

  // Symptom-coverage chips
  function covChip(entry, negative) {
    var SD = window.SymptomDomains;
    var why = entry.contributors.map(function (c) { return c.receptor + ' ' + c.action; }).join(', ');
    return '<span class="sm-cov' + (negative ? ' sm-cov--neg' : '') + '">'
      + '<span class="sm-cov-d">' + esc(SD.short(entry.domain)) + '</span>'
      + (why ? '<span class="sm-cov-w">' + esc(why) + '</span>' : '') + '</span>';
  }
  function coverageBlock(row) {
    var cov = row.s.cov;
    if (!cov) return '';
    var html = '';
    if (cov.covers.length) {
      html += '<div class="sm-shared sm-shared--cov"><span class="sm-shared-label">Still covers residual:</span> '
        + cov.covers.map(function (c) { return covChip(c, false); }).join('') + '</div>';
    }
    if (cov.worsens.length) {
      html += '<div class="sm-shared sm-shared--cov"><span class="sm-shared-label sm-shared-label--neg">May worsen:</span> '
        + cov.worsens.map(function (c) { return covChip(c, true); }).join('') + '</div>';
    }
    if (!cov.covers.length && !cov.worsens.length) {
      html += '<div class="sm-cov-none">No clear mechanistic coverage of the selected residual symptoms.</div>';
    }
    return html;
  }

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

  // Safety-flag block: additive QT and known P450 interactions between the pair.
  function flagsBlock(ref, row) {
    var conflicts = row.p450, qt = row.qt;
    if (!qt && !conflicts.length) {
      return '<div class="sm-flags sm-flags--clear"><span class="sm-flag-dot">&#10003;</span>'
        + 'No additive QT or known P450 interaction with ' + esc(ref.name) + '.</div>';
    }
    var sev = conflictSeverity(conflicts);
    var lvl = qt ? 'high' : (sev >= 3 ? 'high' : (sev === 2 ? 'mod' : 'low'));
    var html = '<div class="sm-flags sm-flags--' + lvl + '">';
    html += '<div class="sm-flags-title">&#9888; Interaction flags</div>';
    if (qt) {
      html += '<div class="sm-flag"><span class="sm-flag-badge sm-flag-badge--qt">QT</span>'
        + 'Additive QT prolongation &mdash; both agents prolong QT. Avoid combining or monitor ECG and electrolytes.</div>';
    }
    conflicts.forEach(function (c) {
      var bsev = c.effect === 'induces' ? 'high' : (c.strength === 'strong' ? 'high' : (c.strength === 'moderate' ? 'mod' : 'low'));
      html += '<div class="sm-flag"><span class="sm-flag-badge sm-flag-badge--' + bsev + '">' + esc(c.enzyme) + '</span>'
        + esc(c.actor) + (c.effect === 'induces'
            ? ' induces ' + esc(c.enzyme) + ' &rarr; &darr; ' + esc(c.target) + ' levels'
            : ' (' + esc(c.strength) + ' ' + esc(c.enzyme) + ' inhibitor) &rarr; &uarr; ' + esc(c.target) + ' levels')
        + '</div>';
    });
    return html + '</div>';
  }

  // ── State ────────────────────────────────────────────────────────────────
  var lastRanked = null, lastRef = null, lastSameCat = true, lastRouteFiltered = 0;
  var STEP = 6;            // how many results per "show more" click
  var shownCount = STEP;   // how many are currently displayed

  function populateSelect() {
    var sel = document.getElementById('sm-ref-select');
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
    var sel = document.getElementById('sm-ref-select');
    var refId = sel && sel.value;
    var results = document.getElementById('sm-results');
    if (!refId) { if (results) { results.style.display = 'none'; } return; }
    var ref = MEDICATIONS.filter(function (m) { return m.id === refId; })[0];
    var sameCat = document.getElementById('sm-samecat').checked;
    var cand = MEDICATIONS.filter(function (m) { return m.id !== refId; });
    if (sameCat) cand = cand.filter(function (m) { return m.category === ref.category; });

    // Route filter
    var routeFiltered = 0;
    if (window.Routes && selectedRoutes.length) {
      cand = cand.filter(function (m) {
        if (window.Routes.hasAny(m.id, selectedRoutes)) return true;
        routeFiltered++; return false;
      });
    }

    var ranked = cand.map(function (c) {
      var act = actionInfo(ref, c);
      return {
        med: c, s: score(ref, c, act),
        shared: sharedTargets(ref, c), inds: sharedIndications(ref, c),
        p450: p450Conflicts(ref, c), qt: qtAdditive(ref, c)
      };
    }).sort(function (a, b) { return b.s.total - a.s.total; });

    lastRanked = ranked; lastRef = ref; lastSameCat = sameCat; lastRouteFiltered = routeFiltered;
    shownCount = STEP;
    render(ref, ranked, sameCat);
  }

  function render(ref, ranked, sameCat) {
    var results = document.getElementById('sm-results');
    var shownN = Math.min(shownCount, ranked.length);
    var top = ranked.slice(0, shownN);
    var noKi = !hasKi(ref);

    var html = '';

    // Reference banner
    html += '<div class="sm-ref-banner">'
      + '<span class="sm-ref-tag">Reference</span>'
      + '<span class="sm-ref-name">' + esc(ref.name) + '</span>'
      + '<span class="sm-ref-brand">' + esc(ref.brandName) + '</span>'
      + '<span class="sm-ref-class">' + esc(ref.class) + ' · ' + esc(ref.category) + '</span>'
      + '</div>';

    // Active route filter
    if (selectedRoutes.length && window.Routes) {
      html += '<div class="sm-routefilter">'
        + '<span class="sm-routefilter-label">Route filter:</span> '
        + selectedRoutes.map(function (rt) {
            return '<span class="sm-route-chip sm-route-chip--match">' + esc(window.Routes.short(rt)) + '</span>';
          }).join('')
        + '<span class="sm-routefilter-txt">showing only agents available as '
        + esc(selectedRoutes.map(function (rt) { return window.Routes.label(rt); }).join(' or '))
        + (lastRouteFiltered ? ' &mdash; ' + lastRouteFiltered + ' otherwise-eligible agent'
            + (lastRouteFiltered > 1 ? 's' : '') + ' hidden by this filter' : '')
        + '.</span></div>';
    }

    // Residual-symptom gap summary for the reference itself
    var doms = selectedDomains();
    if (doms.length && window.SymptomDomains) {
      var g = window.SymptomDomains.gaps(ref, doms);
      html += '<div class="sm-gap"><span class="sm-gap-label">Targeting residual:</span> ';
      html += doms.map(function (d) {
        var covered = g.covered.indexOf(d) !== -1;
        return '<span class="sm-gap-chip' + (covered ? ' sm-gap-chip--covered' : ' sm-gap-chip--gap') + '">'
          + esc(window.SymptomDomains.short(d)) + (covered ? ' &#10003;' : ' gap') + '</span>';
      }).join('');
      html += '<div class="sm-gap-note">Candidates below are scored on whether their mechanism still covers the ticked domains &mdash; useful when the switch must not lose ground on a residual symptom.</div>';
      html += '</div>';
    }

    if (noKi) {
      html += '<div class="sm-note-inline">Receptor-binding data is not on file for ' + esc(ref.name)
        + ' (its mechanism lies outside the monoamine receptor set). Similarity below is based on drug class, shared indications'
        + (tierIsDefault(ref.id) ? '' : ', signal-transduction tier') + ' only.</div>';
    }

    if (!top.length) {
      if (selectedRoutes.length && lastRouteFiltered) {
        html += '<div class="sm-note-inline">No comparison medication is available by the selected route ('
          + esc(selectedRoutes.map(function (rt) { return window.Routes.label(rt); }).join(' or ')) + '). '
          + lastRouteFiltered + ' otherwise-eligible agent' + (lastRouteFiltered > 1 ? 's were' : ' was')
          + ' hidden by this filter &mdash; switch back to <em>Any route</em> to see them.</div>';
      } else {
        html += '<div class="sm-note-inline">No comparison medications available'
          + (sameCat ? ' in this category. Try unchecking "Restrict to same category."' : '.') + '</div>';
      }
      results.innerHTML = html;
      results.style.display = '';
      return;
    }

    // Result cards
    html += '<div class="sm-cards">';
    top.forEach(function (row, idx) {
      var m = row.med, s = row.s;
      var whyBits = [];
      if (s.refKi && s.rMatch != null && s.rMatch >= 0.5) whyBits.push('overlapping receptor-binding profile');
      if (s.aMatch != null && s.aMatch >= 0.7 && s.agree.length) {
        whyBits.push('same action at ' + s.agree.slice(0, 2).map(function (c) { return c.r; }).join(', '));
      }
      if (s.cMatch === 1) whyBits.push('same class (' + m.class + ')');
      else if (s.cMatch === 0.5) whyBits.push('same category');
      if (s.cov && s.cov.covers.length) {
        whyBits.push('covers ' + s.cov.covers.map(function (c) { return window.SymptomDomains.short(c.domain); }).join(' + '));
      }
      if (row.inds.length) whyBits.push(row.inds.length + ' shared indication' + (row.inds.length > 1 ? 's' : ''));
      var why = whyBits.length ? whyBits.join(', ') : 'closest available profile';

      html += '<div class="sm-card">'
        + '<div class="sm-card-head">'
        + '<span class="sm-rank sm-rank--' + (idx + 1) + '">#' + (idx + 1) + '</span>'
        + '<div class="sm-card-title"><span class="sm-card-name">' + esc(m.name) + '</span>'
        + '<span class="sm-card-brand">' + esc(m.brandName) + ' · ' + esc(m.class) + '</span></div>'
        + '<span class="sm-overall">' + pct(s.total) + '<small>match</small></span>'
        + '</div>';

      html += '<div class="sm-why">Why: ' + esc(why) + '.</div>';

      html += flagsBlock(ref, row);

      html += '<div class="sm-metrics">';
      if (s.rMatch != null) html += bar('Receptor binding', s.rMatch, 'weight ' + Math.round(s.wR * 100) + '%');
      else html += barNA('Receptor binding', 'no receptor-binding data on file for one of the pair');
      if (s.aMatch != null) {
        var noteA;
        if (s.agree.length && !s.differ.length) noteA = 'same action at every shared receptor';
        else if (s.differ.length) noteA = s.differ.length + ' receptor' + (s.differ.length > 1 ? 's' : '') + ' where actions differ ('
          + s.differ.slice(0, 2).map(function (c) { return c.r; }).join(', ') + ')';
        else noteA = 'shared receptor actions match';
        html += bar('Action match', s.aMatch, 'weight ' + Math.round(s.wA * 100) + '% · ' + noteA);
      } else {
        html += barNA('Action match', 'no shared receptor with a characterized action &mdash; weight folded into receptor binding');
      }
      if (s.tMatch != null) {
        html += bar('Cascade-tier match', s.tMatch, 'weight ' + Math.round(s.wT * 100) + '% · '
          + esc(ref.name) + ': ' + esc(tierNames(ref.id)) + '  vs  ' + esc(m.name) + ': ' + esc(tierNames(m.id)));
      }
      html += bar('Class match', s.cMatch, 'weight ' + Math.round(s.wC * 100) + '%');
      html += bar('Shared indications', s.iMatch, 'weight ' + Math.round(s.wI * 100) + '%');
      if (s.cov) {
        html += bar('Symptom coverage', s.cov.score, 'weight ' + Math.round(s.wS * 100) + '% · '
          + (s.cov.covers.length ? s.cov.covers.length + ' of ' + doms.length + ' targeted domain'
              + (doms.length > 1 ? 's' : '') + ' covered' : 'none of the targeted domains covered'));
      }
      html += '</div>';

      if (window.Routes) {
        html += '<div class="sm-shared sm-shared--routes"><span class="sm-shared-label">Routes:</span> '
          + routeChips(m.id) + '</div>';
        html += routeNotes(m.id);
      }

      html += coverageBlock(row);

      if (s.agree && s.agree.length) {
        html += '<div class="sm-shared sm-shared--actx"><span class="sm-shared-label">Same receptor, same action:</span> '
          + s.agree.slice(0, 5).map(actMatchChip).join('') + '</div>';
      }
      if (s.differ && s.differ.length) {
        html += '<div class="sm-shared sm-shared--actx"><span class="sm-shared-label sm-shared-label--neg">Same receptor, different action:</span> '
          + s.differ.slice(0, 4).map(actDiffChip).join('') + '</div>';
      }
      if (row.shared.length) {
        html += '<div class="sm-shared"><span class="sm-shared-label">Shared receptor targets:</span> '
          + row.shared.slice(0, 6).map(function (t) { return chip(t.r); }).join('') + '</div>';
      }
      if (row.inds.length) {
        html += '<div class="sm-shared"><span class="sm-shared-label">Shared indications:</span> '
          + '<span class="sm-inds">' + row.inds.map(esc).join(', ') + '</span></div>';
      }
      html += '</div>';
    });
    html += '</div>';

    // Receptor comparison table (only when reference has binding data)
    if (hasKi(ref)) {
      var cols = [ref].concat(top.slice(0, 5).map(function (r) { return r.med; })).filter(hasKi);
      var recSet = {};
      cols.forEach(function (m) {
        if (m.receptorKi) for (var r in m.receptorKi) { if (pKi(m.receptorKi[r]) >= 6) recSet[r] = 1; }
      });
      var order = (typeof RECEPTOR_LIST !== 'undefined') ? RECEPTOR_LIST : Object.keys(recSet);
      var recs = order.filter(function (r) { return recSet[r]; });
      Object.keys(recSet).forEach(function (r) { if (recs.indexOf(r) === -1) recs.push(r); });

      if (recs.length) {
        html += '<div class="sm-table-wrap"><div class="sm-table-title">Receptor binding comparison '
          + '<span class="sm-table-sub">strength bars = pKi; longer = stronger affinity (lower K<sub>i</sub>)</span></div>';
        html += '<table class="sm-table"><thead><tr><th>Receptor</th>';
        cols.forEach(function (m, i) {
          html += '<th' + (i === 0 ? ' class="sm-th-ref"' : '') + '>' + esc(m.name) + '</th>';
        });
        html += '</tr></thead><tbody>';
        recs.forEach(function (r) {
          html += '<tr><td class="sm-rec-cell">' + chip(r) + '</td>';
          cols.forEach(function (m) {
            var ki = m.receptorKi ? m.receptorKi[r] : null;
            if (ki == null) { html += '<td class="sm-cell sm-cell--none">·</td>'; return; }
            var p = pKi(ki);
            var w = Math.max(0, Math.min(100, ((p - FLOOR) / (10 - FLOOR)) * 100));
            var strong = p >= 8;
            html += '<td class="sm-cell"><div class="sm-cell-bar" style="width:' + w.toFixed(0) + '%"></div>'
              + '<span class="sm-cell-val' + (strong ? ' sm-cell-val--strong' : '') + '">' + p.toFixed(1) + '</span></td>';
          });
          html += '</tr>';
        });
        html += '</tbody></table></div>';
      }
    }

    // Clinical footnote + report button
    html += '<div class="sm-clinical">'
      + '<strong>Switching for tachyphylaxis:</strong> loss of response to a previously effective agent ("poop-out") is common with SSRIs and other antidepressants. '
      + 'A pharmacologically similar agent (above) is a reasonable option — but first reassess adherence, dosing, substance use, and comorbid or evolving diagnoses. '
      + 'Because true tolerance can be mechanism-specific, some patients respond better to a switch <em>across</em> mechanisms or to augmentation. These rankings inform, not replace, that decision.'
      + '</div>';

    var remaining = ranked.length - shownN;
    html += '<div class="sm-actions">';
    html += '<button class="btn-primary sm-report-btn" id="sm-report-btn">Copy Summary</button>';
    if (remaining > 0) {
      var next = Math.min(STEP, remaining);
      html += '<button class="sm-more-btn" id="sm-more-btn">Not these? Show ' + next + ' more '
        + '<span class="sm-more-sub">(' + remaining + ' left)</span></button>';
    }
    html += '</div>';
    if (ranked.length > STEP) {
      html += '<div class="sm-count-note">Showing ' + shownN + ' of ' + ranked.length
        + ' comparison agents, ranked by similarity.</div>';
    }

    results.innerHTML = html;
    results.style.display = '';

    var rbtn = document.getElementById('sm-report-btn');
    if (rbtn) rbtn.addEventListener('click', function () { copyReport(this); });
    var mbtn = document.getElementById('sm-more-btn');
    if (mbtn) mbtn.addEventListener('click', function () {
      var firstNew = shownCount;
      shownCount = Math.min(shownCount + STEP, lastRanked.length);
      render(lastRef, lastRanked, lastSameCat);
      var cards = document.querySelectorAll('#sm-results .sm-card');
      if (cards[firstNew]) cards[firstNew].scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  function copyReport(btn) {
    if (!lastRef || !lastRanked) return;
    var ref = lastRef, top = lastRanked.slice(0, Math.min(shownCount, lastRanked.length));
    var date = (window.ToolUtils && ToolUtils.dateStamp) ? ToolUtils.dateStamp()
      : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    var t = 'Similar Medication Analysis\nDate: ' + date + '\n\n';
    t += 'Reference medication: ' + ref.name + ' (' + ref.brandName + ') — ' + ref.class + ', ' + ref.category + '\n';
    if (selectedRoutes.length && window.Routes) {
      t += 'Route filter: ' + selectedRoutes.map(function (rt) { return window.Routes.label(rt); }).join(' or ') + '\n';
    }
    var doms = selectedDomains();
    if (doms.length && window.SymptomDomains) {
      t += 'Targeting residual symptoms: ' + doms.map(function (d) { return window.SymptomDomains.short(d); }).join(', ') + '\n';
    }
    t += 'Ranked by pharmacologic similarity (receptor binding, action, cascade tier, class, shared indications'
      + (doms.length ? ', symptom coverage' : '') + '; axes that cannot be measured for a pair are dropped and their weight redistributed).\n\n';
    top.forEach(function (row, i) {
      var m = row.med, s = row.s;
      t += (i + 1) + '. ' + m.name + ' (' + m.brandName + ') — ' + m.class + '  |  ' + Math.round(s.total) + '% match\n';
      t += '   Receptor binding: ' + (s.rMatch == null ? 'n/a' : Math.round(s.rMatch * 100) + '%') + '  ·  '
        + 'Action match: ' + (s.aMatch == null ? 'n/a' : Math.round(s.aMatch * 100) + '%') + '  ·  '
        + 'Cascade tier: ' + (s.tMatch == null ? 'n/a' : Math.round(s.tMatch * 100) + '%') + '  ·  '
        + 'Class: ' + Math.round(s.cMatch * 100) + '%  ·  Indications: ' + Math.round(s.iMatch * 100) + '%'
        + (s.cov ? '  ·  Symptom coverage: ' + Math.round(s.cov.score * 100) + '%' : '') + '\n';
      if (window.Routes) t += '   Routes: ' + window.Routes.sorted(m.id).map(function (rt) { return window.Routes.short(rt); }).join(', ') + '\n';
      if (row.shared.length) t += '   Shared receptor targets: ' + row.shared.slice(0, 6).map(function (x) { return x.r; }).join(', ') + '\n';
      if (s.agree && s.agree.length) t += '   Same receptor & action: ' + s.agree.slice(0, 5).map(function (c) {
        return c.r + ' ' + window.ReceptorActions.label(c.refAct);
      }).join('; ') + '\n';
      if (s.differ && s.differ.length) t += '   Same receptor, different action: ' + s.differ.slice(0, 4).map(function (c) {
        return c.r + ' ' + window.ReceptorActions.label(c.refAct) + ' vs ' + window.ReceptorActions.label(c.candAct);
      }).join('; ') + '\n';
      if (s.cov && s.cov.covers.length) t += '   Still covers residual: ' + s.cov.covers.map(function (c) {
        return window.SymptomDomains.short(c.domain);
      }).join(', ') + '\n';
      if (s.cov && s.cov.worsens.length) t += '   MAY WORSEN: ' + s.cov.worsens.map(function (c) {
        return window.SymptomDomains.short(c.domain);
      }).join(', ') + '\n';
      if (row.inds.length) t += '   Shared indications: ' + row.inds.join(', ') + '\n';
      if (row.qt) t += '   FLAG - Additive QT: both agents prolong QT; monitor ECG/electrolytes.\n';
      (row.p450 || []).forEach(function (c) {
        t += '   FLAG - P450: ' + (c.effect === 'induces'
          ? c.actor + ' induces ' + c.enzyme + ' -> lowers ' + c.target + ' levels'
          : c.actor + ' (' + c.strength + ' ' + c.enzyme + ' inhibitor) -> raises ' + c.target + ' levels') + '\n';
      });
      if (!row.qt && !(row.p450 && row.p450.length)) t += '   No additive QT or known P450 interaction.\n';
      t += '\n';
    });
    t += 'Note: Pharmacologic similarity is decision support only and does not guarantee comparable response or tolerability. For apparent tachyphylaxis, first reassess adherence and diagnosis; a cross-mechanism switch or augmentation may be preferable in some cases.\n';

    if (window.ToolUtils && ToolUtils.copyWithButton) { ToolUtils.copyWithButton(t, btn); }
    else {
      navigator.clipboard.writeText(t).then(function () {
        var o = btn.textContent; btn.textContent = 'Copied!'; setTimeout(function () { btn.textContent = o; }, 2000);
      });
    }
  }

  // Update the on-screen % labels to reflect the normalized effective weights.
  // With no reference chosen yet, show the raw slider proportions.
  var WEIGHT_IDS = ['sm-w-receptor', 'sm-w-action', 'sm-w-tier', 'sm-w-class', 'sm-w-indication', 'sm-w-symptom'];
  function refreshWeightLabels() {
    var w = rawWeights();
    var sum = w.wR + w.wA + w.wT + w.wC + w.wI + w.wS;
    function set(id, val) { var el = document.getElementById(id); if (el) el.textContent = (sum ? Math.round(val / sum * 100) : 0) + '%'; }
    set('sm-w-receptor-val', w.wR);
    set('sm-w-action-val', w.wA);
    set('sm-w-tier-val', w.wT);
    set('sm-w-class-val', w.wC);
    set('sm-w-indication-val', w.wI);
    set('sm-w-symptom-val', w.wS);
  }

  // ── Wire up ──────────────────────────────────────────────────────────────
  populateSelect();
  var go = document.getElementById('sm-go-btn');
  if (go) go.addEventListener('click', compute);
  var sel = document.getElementById('sm-ref-select');
  if (sel) sel.addEventListener('change', function () { refreshWeightLabels(); if (lastRef) compute(); });
  var cb = document.getElementById('sm-samecat');
  if (cb) cb.addEventListener('change', function () { if (lastRef) compute(); });

  // Residual-symptom checkboxes
  var symBoxes = document.querySelectorAll('.sm-symptom-box');
  if (symBoxes) Array.prototype.forEach.call(symBoxes, function (b) {
    b.addEventListener('change', function () { if (lastRef) compute(); });
  });
  var symClear = document.getElementById('sm-symptom-clear');
  if (symClear) symClear.addEventListener('click', function () {
    Array.prototype.forEach.call(document.querySelectorAll('.sm-symptom-box'), function (b) { b.checked = false; });
    if (lastRef) compute();
  });

  // Route buttons: "Any route" clears; the others toggle and OR together.
  var routeBtns = document.querySelectorAll('.sm-route-btn');
  function syncRouteBtns() {
    Array.prototype.forEach.call(routeBtns, function (b) {
      var rt = b.getAttribute('data-route');
      var on = rt ? (selectedRoutes.indexOf(rt) !== -1) : (selectedRoutes.length === 0);
      b.classList.toggle('sm-route-btn--on', on);
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

  // Sliders: live re-rank + label update as they move.
  WEIGHT_IDS.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', function () { refreshWeightLabels(); if (lastRef) compute(); });
  });
  var reset = document.getElementById('sm-weights-reset');
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

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
  function jaccard(a, b) {
    var A = indUses(a), B = indUses(b);
    if (!A.length && !B.length) return 0;
    var setB = {}, inter = 0, seen = {};
    B.forEach(function (u) { setB[u] = 1; });
    A.forEach(function (u) { if (setB[u] && !seen[u]) { inter++; seen[u] = 1; } });
    var uni = {}; A.concat(B).forEach(function (u) { uni[u] = 1; });
    var uniSize = Object.keys(uni).length;
    return uniSize ? inter / uniSize : 0;
  }

  function score(ref, cand) {
    var wD = 0.40, wC = 0.30, wI = 0.30;
    var cos = cosine(fingerprint(ref), fingerprint(cand));
    var div = 1 - cos;                                   // receptor divergence
    var cMatch = (ref.class === cand.class) ? 1 : (ref.category === cand.category ? 0.7 : 0);
    var iMatch = jaccard(ref, cand);
    return {
      total: 100 * (wD * div + wC * cMatch + wI * iMatch),
      div: div, cos: cos, cMatch: cMatch, iMatch: iMatch,
      wD: wD, wC: wC, wI: wI
    };
  }

  function sharedIndications(ref, cand) {
    var setB = {}; indUses(cand).forEach(function (u) { setB[u] = 1; });
    var out = [];
    (ref.indications || []).forEach(function (i) {
      if (setB[i.use.toLowerCase().trim()]) out.push(i.use);
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
  var lastRanked = null, lastRef = null;

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
    cand = cand.filter(function (m) {
      return hasKi(m)
        && sharedIndications(ref, m).length > 0
        && cosine(refFp, fingerprint(m)) <= OVERLAP_CEILING;
    });

    var ranked = cand.map(function (c) {
      return {
        med: c, s: score(ref, c),
        added: addedTargets(ref, c),
        refOnly: refOnlyTargets(ref, c),
        inds: sharedIndications(ref, c),
        p450: p450Conflicts(ref, c),
        qt: qtAdditive(ref, c)
      };
    }).sort(function (a, b) { return b.s.total - a.s.total; });

    lastRanked = ranked; lastRef = ref;
    render(ref, ranked, sameCat);
  }

  function render(ref, ranked, sameCat) {
    var results = document.getElementById('cm-results');
    var top = ranked.slice(0, 3);
    var html = '';

    // Reference banner
    html += '<div class="cm-ref-banner">'
      + '<span class="cm-ref-tag">Reference</span>'
      + '<span class="cm-ref-name">' + esc(ref.name) + '</span>'
      + '<span class="cm-ref-brand">' + esc(ref.brandName) + '</span>'
      + '<span class="cm-ref-class">' + esc(ref.class) + ' · ' + esc(ref.category) + '</span>'
      + '</div>';

    if (!hasKi(ref)) {
      html += '<div class="cm-note-inline">Receptor-binding data is not on file for ' + esc(ref.name)
        + ' (its mechanism lies outside the monoamine receptor set), so mechanistic divergence cannot be computed. '
        + 'The complementary-agent search requires a reference with receptor-binding data.</div>';
      results.innerHTML = html;
      results.style.display = '';
      return;
    }

    if (!top.length) {
      html += '<div class="cm-note-inline">No eligible complementary agents found &mdash; candidates must share at least one indication with ' + esc(ref.name)
        + ', have receptor-binding data on file, and diverge enough to differ mechanistically (receptor overlap &le; '
        + Math.round(OVERLAP_CEILING * 100) + '%; more-similar agents belong in <em>Find Similar Medications</em>)'
        + (sameCat ? '. Try unchecking &ldquo;Restrict to same category.&rdquo;' : '.') + '</div>';
      results.innerHTML = html;
      results.style.display = '';
      return;
    }

    // Result cards
    html += '<div class="cm-cards">';
    top.forEach(function (row, idx) {
      var m = row.med, s = row.s;
      var whyBits = [];
      whyBits.push(Math.round(s.div * 100) + '% divergent receptor profile');
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

      html += flagsBlock(ref, row);

      html += '<div class="cm-metrics">';
      html += bar('Receptor divergence', s.div, 'weight 40% · ' + Math.round(s.cos * 100) + '% receptor overlap');
      html += bar('Class match', s.cMatch, 'weight 30%');
      html += bar('Shared indications', s.iMatch, 'weight 30%');
      html += '</div>';

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

    // Receptor comparison table (reference + top 3)
    var cols = [ref].concat(top.map(function (r) { return r.med; }));
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

    // Clinical footnote + report button
    html += '<div class="cm-clinical">'
      + '<strong>Rational combination &amp; augmentation:</strong> agents that treat the same condition through <em>non-overlapping</em> receptor mechanisms '
      + 'can broaden coverage of residual symptoms (e.g. adding bupropion or mirtazapine to an SSRI). Mechanistic divergence is only a starting point &mdash; '
      + 'before combining, check for pharmacokinetic interactions (CYP450), additive serotonergic load (serotonin syndrome), overlapping toxicities (QT, sedation, seizure threshold), '
      + 'and whether monotherapy optimization or a switch is the better move. These rankings inform, not replace, that decision.'
      + '</div>';

    html += '<div class="cm-actions"><button class="btn-primary cm-report-btn" id="cm-report-btn">Copy Summary</button></div>';

    results.innerHTML = html;
    results.style.display = '';

    var rbtn = document.getElementById('cm-report-btn');
    if (rbtn) rbtn.addEventListener('click', function () { copyReport(this); });
  }

  function copyReport(btn) {
    if (!lastRef || !lastRanked) return;
    var ref = lastRef, top = lastRanked.slice(0, 3);
    var date = (window.ToolUtils && ToolUtils.dateStamp) ? ToolUtils.dateStamp()
      : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    var t = 'Complementary Medication Analysis\nDate: ' + date + '\n\n';
    t += 'Reference medication: ' + ref.name + ' (' + ref.brandName + ') — ' + ref.class + ', ' + ref.category + '\n';
    t += 'Ranked for complementary pairing (receptor divergence 40%, class 30%, shared indications 30%).\n';
    t += 'Candidates share ≥1 indication and cover a different receptor set — rational combination/augmentation options.\n\n';
    top.forEach(function (row, i) {
      var m = row.med, s = row.s;
      t += (i + 1) + '. ' + m.name + ' (' + m.brandName + ') — ' + m.class + '  |  ' + Math.round(s.total) + '% complement\n';
      t += '   Receptor divergence: ' + Math.round(s.div * 100) + '% (' + Math.round(s.cos * 100) + '% overlap)  ·  '
        + 'Class: ' + Math.round(s.cMatch * 100) + '%  ·  Indications: ' + Math.round(s.iMatch * 100) + '%\n';
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
    t += 'Note: Mechanistic complementarity is decision support only. Before combining agents, assess CYP450 interactions, additive serotonergic/QT/sedation/seizure risk, and whether optimizing monotherapy or switching is preferable.\n';

    if (window.ToolUtils && ToolUtils.copyWithButton) { ToolUtils.copyWithButton(t, btn); }
    else {
      navigator.clipboard.writeText(t).then(function () {
        var o = btn.textContent; btn.textContent = 'Copied!'; setTimeout(function () { btn.textContent = o; }, 2000);
      });
    }
  }

  // ── Wire up ──────────────────────────────────────────────────────────────
  populateSelect();
  var go = document.getElementById('cm-go-btn');
  if (go) go.addEventListener('click', compute);
  var sel = document.getElementById('cm-ref-select');
  if (sel) sel.addEventListener('change', function () { if (lastRef) compute(); });
  var cb = document.getElementById('cm-samecat');
  if (cb) cb.addEventListener('change', function () { if (lastRef) compute(); });
})();

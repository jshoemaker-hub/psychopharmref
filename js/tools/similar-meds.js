/* ── Find Similar Medications ──────────────────────────────────────────────
   Given a "reference" medication that once worked best but has lost effect
   (tachyphylaxis / "poop-out"), rank all other medications by pharmacologic
   similarity and surface the three closest matches.

   Composite similarity score (0–100%):
     60%  Receptor-binding match  — cosine similarity of receptor-binding
          "fingerprint" vectors (pKi above a 10,000 nM negligibility floor;
          scale-invariant so it compares the PATTERN of binding, not potency)
     25%  Class / category match  — same pharmacologic class = full credit,
          same category (different class) = half credit
     15%  Shared FDA indications  — Jaccard overlap of on-label uses

   When the reference has no monoamine receptor-binding data on file (e.g.
   MAOIs, lithium, anticonvulsant mood stabilizers, gabapentinoids), the
   score falls back to 65% class + 35% indications.
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
    var refKi = hasKi(ref);
    var wR = 0.60, wC = 0.25, wI = 0.15;
    if (!refKi) { wR = 0; wC = 0.65; wI = 0.35; }
    var rMatch = refKi ? cosine(fingerprint(ref), fingerprint(cand)) : 0;
    var cMatch = (ref.class === cand.class) ? 1 : (ref.category === cand.category ? 0.5 : 0);
    var iMatch = jaccard(ref, cand);
    return {
      total: 100 * (wR * rMatch + wC * cMatch + wI * iMatch),
      rMatch: rMatch, cMatch: cMatch, iMatch: iMatch,
      wR: wR, wC: wC, wI: wI, refKi: refKi
    };
  }

  // Shared receptor targets where BOTH bind meaningfully (Ki ≤ ~1000 nM, pKi ≥ 6)
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
    var setB = {}; indUses(cand).forEach(function (u) { setB[u] = 1; });
    var out = [];
    (ref.indications || []).forEach(function (i) {
      if (setB[i.use.toLowerCase().trim()]) out.push(i.use);
    });
    return out;
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
    return '<div class="sm-metric">'
      + '<div class="sm-metric-top"><span class="sm-metric-label">' + label + '</span>'
      + '<span class="sm-metric-val">' + p + '%</span></div>'
      + '<div class="sm-metric-track"><div class="sm-metric-fill" style="width:' + p + '%"></div></div>'
      + (note ? '<div class="sm-metric-note">' + note + '</div>' : '')
      + '</div>';
  }
  function chip(r) {
    var c = COLORS[r] || '#8b6914';
    return '<span class="sm-chip" style="--sm-chip:' + c + '">' + esc(r) + '</span>';
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
  var lastRanked = null, lastRef = null;

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
    var ranked = cand.map(function (c) {
      var s = score(ref, c);
      return {
        med: c, s: s, shared: sharedTargets(ref, c), inds: sharedIndications(ref, c),
        p450: p450Conflicts(ref, c), qt: qtAdditive(ref, c)
      };
    }).sort(function (a, b) { return b.s.total - a.s.total; });
    lastRanked = ranked; lastRef = ref;
    render(ref, ranked, sameCat);
  }

  function render(ref, ranked, sameCat) {
    var results = document.getElementById('sm-results');
    var top = ranked.slice(0, 3);
    var noKi = !hasKi(ref);

    var html = '';

    // Reference banner
    html += '<div class="sm-ref-banner">'
      + '<span class="sm-ref-tag">Reference</span>'
      + '<span class="sm-ref-name">' + esc(ref.name) + '</span>'
      + '<span class="sm-ref-brand">' + esc(ref.brandName) + '</span>'
      + '<span class="sm-ref-class">' + esc(ref.class) + ' · ' + esc(ref.category) + '</span>'
      + '</div>';

    if (noKi) {
      html += '<div class="sm-note-inline">Receptor-binding data is not on file for ' + esc(ref.name)
        + ' (its mechanism lies outside the monoamine receptor set). Similarity below is based on drug class and shared indications only.</div>';
    }

    if (!top.length) {
      html += '<div class="sm-note-inline">No comparison medications available'
        + (sameCat ? ' in this category. Try unchecking "Restrict to same category."' : '.') + '</div>';
      results.innerHTML = html;
      results.style.display = '';
      return;
    }

    // Result cards
    html += '<div class="sm-cards">';
    top.forEach(function (row, idx) {
      var m = row.med, s = row.s;
      var whyBits = [];
      if (s.refKi && s.rMatch >= 0.5) whyBits.push('overlapping receptor-binding profile');
      if (s.cMatch === 1) whyBits.push('same class (' + m.class + ')');
      else if (s.cMatch === 0.5) whyBits.push('same category');
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
      if (s.refKi) html += bar('Receptor binding', s.rMatch, 'weight 60%');
      html += bar('Class match', s.cMatch, s.refKi ? 'weight 25%' : 'weight 65%');
      html += bar('Shared indications', s.iMatch, s.refKi ? 'weight 15%' : 'weight 35%');
      html += '</div>';

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
      var cols = [ref].concat(top.map(function (r) { return r.med; }));
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

    html += '<div class="sm-actions"><button class="btn-primary sm-report-btn" id="sm-report-btn">Copy Summary</button></div>';

    results.innerHTML = html;
    results.style.display = '';

    var rbtn = document.getElementById('sm-report-btn');
    if (rbtn) rbtn.addEventListener('click', function () { copyReport(this); });
  }

  function copyReport(btn) {
    if (!lastRef || !lastRanked) return;
    var ref = lastRef, top = lastRanked.slice(0, 3);
    var date = (window.ToolUtils && ToolUtils.dateStamp) ? ToolUtils.dateStamp()
      : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    var t = 'Similar Medication Analysis\nDate: ' + date + '\n\n';
    t += 'Reference medication: ' + ref.name + ' (' + ref.brandName + ') — ' + ref.class + ', ' + ref.category + '\n';
    t += 'Ranked by pharmacologic similarity (receptor binding 60%, class 25%, shared indications 15%).\n\n';
    top.forEach(function (row, i) {
      var m = row.med, s = row.s;
      t += (i + 1) + '. ' + m.name + ' (' + m.brandName + ') — ' + m.class + '  |  ' + Math.round(s.total) + '% match\n';
      if (s.refKi) t += '   Receptor binding: ' + Math.round(s.rMatch * 100) + '%  ·  ';
      t += 'Class: ' + Math.round(s.cMatch * 100) + '%  ·  Indications: ' + Math.round(s.iMatch * 100) + '%\n';
      if (row.shared.length) t += '   Shared receptor targets: ' + row.shared.slice(0, 6).map(function (x) { return x.r; }).join(', ') + '\n';
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

  // ── Wire up ──────────────────────────────────────────────────────────────
  populateSelect();
  var go = document.getElementById('sm-go-btn');
  if (go) go.addEventListener('click', compute);
  var sel = document.getElementById('sm-ref-select');
  if (sel) sel.addEventListener('change', function () { if (lastRef) compute(); });
  var cb = document.getElementById('sm-samecat');
  if (cb) cb.addEventListener('change', function () { if (lastRef) compute(); });
})();

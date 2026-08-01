/* ── FDA Indication Search (fi-) ───────────────────────────────────────────
   A single search bar over the on-label FDA indications recorded in the
   medication database. Type a diagnosis (optionally with a phase or bipolar
   subtype) and the agents carrying that label are listed, grouped by
   indication and annotated with subtype (Bipolar I vs. II), line
   (monotherapy vs. adjunct), and approved age range where known.

   Data source: each MEDICATIONS[].indications[] entry, optionally enriched
   with { dx, phase, line, age } sub-specifier fields (see js/data.js).
   ────────────────────────────────────────────────────────────────────────── */
(function () {
  if (typeof MEDICATIONS === 'undefined') {
    console.error('fda-indication: MEDICATIONS not loaded');
    return;
  }

  var input   = document.getElementById('fi-search');
  var clearBtn = document.getElementById('fi-clear');
  var results = document.getElementById('fi-results');
  var chips   = Array.prototype.slice.call(document.querySelectorAll('.fi-chip'));
  if (!input || !results) return;

  // ── Flatten indications into searchable records ──────────────────────────
  var RECORDS = [];
  MEDICATIONS.forEach(function (m) {
    (m.indications || []).forEach(function (ind) {
      RECORDS.push({
        name:  m.name,
        brand: m.brandName || '',
        cls:   m.class || m.category || '',
        use:   ind.use,
        year:  ind.year || null,
        dx:    ind.dx   || '',
        phase: ind.phase || '',
        line:  ind.line || '',
        age:   ind.age  || ''
      });
    });
  });

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  // ── Query normalization ──────────────────────────────────────────────────
  var ACRONYMS = {
    mdd:  'major depressive disorder',
    trd:  'treatment-resistant depression',
    ocd:  'obsessive-compulsive disorder',
    gad:  'generalized anxiety disorder',
    ptsd: 'post-traumatic stress disorder',
    sad:  'social anxiety disorder',
    pmdd: 'premenstrual dysphoric disorder',
    osa:  'obstructive sleep apnea',
    bed:  'binge eating disorder'
  };

  function expandAcronyms(q) {
    return q.replace(/[a-z]+/g, function (w) {
      return ACRONYMS[w] || w;
    });
  }

  function recIsBipolar(r) {
    return /bipolar/.test((r.use + ' ' + r.dx).toLowerCase());
  }

  // Extra synonyms folded into each record's search blob so that, e.g.,
  // "mania" finds phase "manic", "prevention" finds "maintenance".
  function blobOf(r) {
    var b = (r.use + ' ' + r.dx + ' ' + r.phase + ' ' + r.line + ' ' +
             r.name + ' ' + r.brand + ' ' + r.cls).toLowerCase();
    if (/manic/.test(b))       b += ' mania acute';
    if (/mainten/.test(b))     b += ' maintenance prophylaxis prevention continuation';
    if (/depress/.test(b))     b += ' depression depressive';
    if (r.dx.toLowerCase().indexOf('ii') !== -1) b += ' bipolar 2 bipolar ii';
    if (/bipolar i/.test(r.dx.toLowerCase()))    b += ' bipolar 1 bipolar i';
    return b;
  }
  RECORDS.forEach(function (r) { r._blob = blobOf(r); });

  function bipolarTriggered(q) { return /bipolar|\bbp\b|manic|mania/.test(q); }

  function subtypeWanted(q) {
    if (/\bii\b|\b2\b|\btwo\b/.test(q)) return 'II';
    if (/\bi\b|\b1\b|\bone\b/.test(q)) return 'I';
    return null;
  }

  function matches(r, rawQ) {
    var q = expandAcronyms(rawQ.toLowerCase().trim());
    if (!q) return false;

    if (bipolarTriggered(q)) {
      if (!recIsBipolar(r)) return false;
      var st = subtypeWanted(q);
      var dx = r.dx.toLowerCase();
      if (st === 'II' && dx.indexOf('ii') === -1) return false;
      if (st === 'I'  && dx.indexOf('bipolar i') === -1) return false;
      var pl = (r.phase + ' ' + r.use).toLowerCase();
      if (/manic|mania|acute/.test(q) && !/manic|mania/.test(pl)) return false;
      if (/mainten|prophylax|prevent|continuation/.test(q) && !/mainten/.test(pl)) return false;
      if (/depress/.test(q) && !/depress/.test(pl)) return false;
      return true;
    }

    // Generic: every meaningful token must appear somewhere in the blob.
    var toks = q.split(/[^a-z0-9]+/).filter(function (t) { return t.length >= 2; });
    if (!toks.length) return false;
    for (var i = 0; i < toks.length; i++) {
      if (r._blob.indexOf(toks[i]) === -1) return false;
    }
    return true;
  }

  // ── Rendering ────────────────────────────────────────────────────────────
  function badge(cls, text) {
    return '<span class="fi-badge ' + cls + '">' + esc(text) + '</span>';
  }

  function render(q) {
    q = q || '';
    if (!q.trim()) {
      results.innerHTML = '<div class="fi-hint">Start typing a diagnosis, or tap a suggestion above. ' +
        'Try <em>Bipolar II</em>, <em>acute mania</em>, or <em>schizophrenia</em>.</div>';
      return;
    }

    var hits = RECORDS.filter(function (r) { return matches(r, q); });

    if (!hits.length) {
      results.innerHTML = '<div class="fi-empty"><strong>No FDA-approved agents on file for &ldquo;' +
        esc(q) + '&rdquo;.</strong><br>Check spelling, try a broader term, or the diagnosis may not have ' +
        'an FDA-approved medication in this database.</div>';
      return;
    }

    // Group by indication `use`.
    var groups = {};
    hits.forEach(function (r) {
      (groups[r.use] = groups[r.use] || []).push(r);
    });
    var keys = Object.keys(groups).sort(function (a, b) {
      return groups[b].length - groups[a].length || a.localeCompare(b);
    });

    var medCount = {}, total = 0;
    hits.forEach(function (r) { if (!medCount[r.name]) { medCount[r.name] = 1; total++; } });

    var html = '<div class="fi-summary">' +
      '<span class="fi-summary-text"><strong>' + total + '</strong> medication' +
      (total !== 1 ? 's' : '') + ' across <strong>' + keys.length + '</strong> indication' +
      (keys.length !== 1 ? 's' : '') + '</span>' +
      '<button type="button" class="fi-copy-btn" id="fi-copy">Copy list</button></div>';

    keys.forEach(function (use) {
      var rows = groups[use].slice().sort(function (a, b) {
        return (a.year || 9999) - (b.year || 9999) || a.name.localeCompare(b.name);
      });
      html += '<div class="fi-group">';
      html += '<div class="fi-group-head"><h3 class="fi-group-title">' + esc(use) + '</h3>' +
              '<span class="fi-group-count">' + rows.length + ' agent' + (rows.length !== 1 ? 's' : '') + '</span></div>';
      rows.forEach(function (r) {
        html += '<div class="fi-med">';
        html += '<span class="fi-med-name">' + esc(r.name) +
                (r.brand ? ' <span class="fi-med-brand">' + esc(r.brand) + '</span>' : '') + '</span>';
        if (r.year) html += '<span class="fi-med-year">FDA ' + r.year + '</span>';
        var badges = '';
        if (r.dx)   badges += badge('fi-badge--dx', r.dx);
        if (r.line) badges += badge('fi-badge--line', r.line);
        if (r.age)  badges += badge('fi-badge--age', r.age);
        if (badges) html += '<span class="fi-badges">' + badges + '</span>';
        html += '</div>';
      });
      html += '</div>';
    });

    results.innerHTML = html;

    var copy = document.getElementById('fi-copy');
    if (copy) copy.addEventListener('click', function () {
      copyReport(q, keys, groups, copy);
    });
  }

  function copyReport(q, keys, groups, btn) {
    var lines = [];
    var stamp = (window.ToolUtils && ToolUtils.dateStamp) ? ToolUtils.dateStamp() : '';
    lines.push('FDA-Approved Medications — search: "' + q + '"' + (stamp ? '  (' + stamp + ')' : ''));
    lines.push('');
    keys.forEach(function (use) {
      lines.push(use.toUpperCase());
      groups[use].slice().sort(function (a, b) {
        return (a.year || 9999) - (b.year || 9999);
      }).forEach(function (r) {
        var parts = [];
        if (r.dx)   parts.push(r.dx);
        if (r.line) parts.push(r.line);
        if (r.age)  parts.push(r.age);
        lines.push('  • ' + r.name + (r.brand ? ' (' + r.brand + ')' : '') +
          (r.year ? ' — FDA ' + r.year : '') +
          (parts.length ? '  [' + parts.join('; ') + ']' : ''));
      });
      lines.push('');
    });
    var text = lines.join('\n').trim();
    if (window.ToolUtils && ToolUtils.copyWithButton) {
      ToolUtils.copyWithButton(text, btn);
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      btn.textContent = 'Copied!';
      setTimeout(function () { btn.textContent = 'Copy list'; }, 2000);
    }
  }

  // ── Wiring ───────────────────────────────────────────────────────────────
  function syncChips(q) {
    var lc = q.trim().toLowerCase();
    chips.forEach(function (c) {
      c.classList.toggle('fi-chip--on', c.getAttribute('data-q').toLowerCase() === lc);
    });
  }

  function run(q) {
    clearBtn.style.display = q ? 'flex' : 'none';
    syncChips(q);
    render(q);
  }

  input.addEventListener('input', function () { run(input.value); });

  clearBtn.addEventListener('click', function () {
    input.value = '';
    run('');
    input.focus();
  });

  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      var q = c.getAttribute('data-q');
      input.value = q;
      run(q);
      input.focus();
    });
  });

  render('');
})();

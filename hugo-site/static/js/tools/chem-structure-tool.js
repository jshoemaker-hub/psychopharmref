/* ── Chem Structure ────────────────────────────────────────────────────────
   Side-by-side chemical-structure comparison for the psychopharmacology set.

   Data (js/chem-structure-data.js, RDKit-generated):
     CHEM_STRUCTURES  — SMILES, MW, formula, logP, TPSA, lipophilicity, ESOL
                        aqueous solubility, pKa / % ionized, messenger level,
                        region annotations, active-metabolite links, a
                        pre-rendered 2D depiction (svg2d) and a 3D MOL block
                        (mol3d, ETKDGv3 + MMFF conformer)
     CHEM_SIMILARITY  — pairwise Morgan/ECFP4 Tanimoto structural similarity
     CHEM_EVOLUTION   — curated old→new "how the change improves things" notes

   2D structures are pre-rendered SVGs (RDKit, build time) — injected directly,
   so they always display with no runtime rendering library and no network.
   3D uses 3Dmol.js, vendored locally (js/vendor/) with a CDN fallback. Indication
   overlap reuses on-page MEDICATIONS where a matching id exists.
   ──────────────────────────────────────────────────────────────────────────── */
(function () {
  // The dataset (js/chem-structure-data.js, ~1.8MB / ~250KB gzipped) is lazy-loaded
  // on first open of this tool rather than on every page — see ensureData() below.
  var DATA_VERSION = '20260802b';
  var byId = {};
  function indexData() { byId = {}; CHEM_STRUCTURES.forEach(function (d) { byId[d.id] = d; }); }

  // ── 3Dmol loader (local vendor first, CDN fallback; verifies global, retries) ──
  function loadFrom(urls, ready) {
    return new Promise(function (resolve, reject) {
      var i = 0;
      (function tryNext() {
        if (ready()) { resolve(); return; }
        if (i >= urls.length) { reject(new Error('all sources failed')); return; }
        var s = document.createElement('script');
        s.src = urls[i++]; s.async = true;
        s.onload = function () { if (ready()) resolve(); else { s.remove(); tryNext(); } };
        s.onerror = function () { s.remove(); tryNext(); };
        document.head.appendChild(s);
      })();
    });
  }
  var tmP = null;
  function load3Dmol() {
    if (window.$3Dmol) return Promise.resolve();
    if (!tmP) tmP = loadFrom([
      'js/vendor/3Dmol-min.js',
      'https://cdn.jsdelivr.net/npm/3dmol@2.4.2/build/3Dmol-min.js'
    ], function () { return !!window.$3Dmol; }).catch(function (e) { tmP = null; throw e; });
    return tmP;
  }
  // Lazy-load the (large) structure dataset on first tool open.
  var dataP = null;
  function ensureData() {
    if (typeof CHEM_STRUCTURES !== 'undefined') return Promise.resolve();
    if (!dataP) dataP = loadFrom(
      ['js/chem-structure-data.js?v=' + DATA_VERSION],
      function () { return typeof CHEM_STRUCTURES !== 'undefined'; }
    ).catch(function (e) { dataP = null; throw e; });
    return dataP;
  }

  var LEGEND = [
    { el: 'N', c: '#3050F8' }, { el: 'O', c: '#FF0D0D' },
    { el: 'F / Cl', c: '#1FF01F' }, { el: 'S', c: '#CCCC00' }
  ];
  var MSG = { 1: 'First messenger', 2: 'Second messenger', 3: 'Third messenger', 4: 'Fourth messenger' };

  // ── Similarity / indication helpers ──────────────────────────────────────
  function indicationsFor(id) {
    if (typeof MEDICATIONS === 'undefined') return null;
    var m = MEDICATIONS.filter(function (x) { return x.id === id; })[0];
    if (!m || !m.indications) return null;
    return m.indications.map(function (i) { return (i.use || '').toLowerCase().trim(); }).filter(Boolean);
  }
  function jaccard(a, b) {
    if (!a || !b || (!a.length && !b.length)) return null;
    var setB = {}, inter = 0, seen = {};
    b.forEach(function (u) { setB[u] = 1; });
    a.forEach(function (u) { if (setB[u] && !seen[u]) { inter++; seen[u] = 1; } });
    var uni = {}; a.concat(b).forEach(function (u) { uni[u] = 1; });
    var n = Object.keys(uni).length;
    return n ? inter / n : 0;
  }
  function structuralSim(a, b) {
    if (a === b) return 1;
    var v = CHEM_SIMILARITY[a + '|' + b];
    if (v == null) v = CHEM_SIMILARITY[b + '|' + a];
    return (v == null) ? null : v;
  }
  function evolutionFor(a, b) {
    if (typeof CHEM_EVOLUTION === 'undefined') return null;
    for (var i = 0; i < CHEM_EVOLUTION.length; i++) {
      var e = CHEM_EVOLUTION[i];
      if ((e.from === a && e.to === b) || (e.from === b && e.to === a)) return { e: e, reversed: (e.from === b) };
    }
    return null;
  }

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function formulaHTML(f) { return esc(f).replace(/(\d+)/g, '<sub>$1</sub>'); }
  function propRow(l, v, term) {
    var label = term
      ? '<a href="#" class="cs-gloss-link" data-gterm="' + esc(term) + '" title="Glossary: ' + esc(term) + '">' + l + '</a>'
      : l;
    return '<div class="cs-prop-row"><span class="cs-prop-label">' + label + '</span><span class="cs-prop-val">' + v + '</span></div>';
  }
  function region(cls, title, txt) {
    if (!txt) return '';
    return '<div class="cs-region ' + cls + '"><div class="cs-region-title">' + esc(title) + '</div>' + esc(txt) + '</div>';
  }

  // ── Druglikeness range bars (Lipinski / Veber / CNS thresholds) ───────────
  // Each descriptor maps to a color-zoned track; a marker shows where the
  // molecule falls. Zones are [upperBound, class] left→right (green/amber/red).
  var DL_FILL = { good: '#cfe3c2', warn: '#f0dcae', bad: '#eec4b4' };
  var DL_MARK = { good: '#4a7c35', warn: '#b06e12', bad: '#b04a2c' };
  var DRUGLIKE = [
    { key: 'mw',   label: 'Molecular weight',  unit: ' Da',  term: 'Molecular weight',            min: 0,  max: 600, zones: [[500, 'good'], [600, 'bad']], limit: 'Lipinski &le; 500' },
    { key: 'logP', label: 'cLogP',             unit: '',     term: 'cLogP',                       min: -2, max: 6,   zones: [[0, 'warn'], [5, 'good'], [6, 'bad']], limit: 'Lipinski &le; 5 &middot; low = poor CNS entry' },
    { key: 'tpsa', label: 'Polar surface area', unit: ' &#8491;&sup2;', term: 'Polar surface area (TPSA)', min: 0, max: 160, zones: [[90, 'good'], [140, 'warn'], [160, 'bad']], limit: '&le; 90 CNS &middot; &le; 140 oral (Veber)' },
    { key: 'hbd',  label: 'H-bond donors',     unit: '',     term: "Lipinski's rule of five",     min: 0,  max: 8,   zones: [[5, 'good'], [8, 'bad']], limit: 'Lipinski &le; 5' },
    { key: 'hba',  label: 'H-bond acceptors',  unit: '',     term: "Lipinski's rule of five",     min: 0,  max: 14,  zones: [[10, 'good'], [14, 'bad']], limit: 'Lipinski &le; 10' },
    { key: 'rotatableBonds', label: 'Rotatable bonds', unit: '', term: null,                      min: 0,  max: 12,  zones: [[10, 'good'], [12, 'bad']], limit: 'Veber &le; 10' }
  ];
  function dlZone(cfg, v) {
    for (var i = 0; i < cfg.zones.length; i++) { if (v <= cfg.zones[i][0]) return cfg.zones[i][1]; }
    return cfg.zones[cfg.zones.length - 1][1];
  }
  function dlGradient(cfg) {
    var span = cfg.max - cfg.min, prev = cfg.min, stops = [];
    cfg.zones.forEach(function (z) {
      var c = DL_FILL[z[1]];
      var a = (prev - cfg.min) / span * 100, b = (z[0] - cfg.min) / span * 100;
      stops.push(c + ' ' + a.toFixed(1) + '%', c + ' ' + b.toFixed(1) + '%');
      prev = z[0];
    });
    return 'linear-gradient(90deg,' + stops.join(',') + ')';
  }
  function dlRow(cfg, d) {
    var v = d[cfg.key];
    if (v == null) return '';
    var span = cfg.max - cfg.min;
    var pos = Math.max(0, Math.min(100, (v - cfg.min) / span * 100));
    var zc = dlZone(cfg, v);
    var label = cfg.term
      ? '<a href="#" class="cs-gloss-link" data-gterm="' + esc(cfg.term) + '" title="Glossary: ' + esc(cfg.term) + '">' + cfg.label + '</a>'
      : cfg.label;
    return '<div class="cs-dl-row">' +
        '<div class="cs-dl-head"><span class="cs-dl-label">' + label + '</span>' +
          '<span class="cs-dl-val" style="color:' + DL_MARK[zc] + '">' + v + cfg.unit + '</span></div>' +
        '<div class="cs-dl-track" style="background:' + dlGradient(cfg) + '">' +
          '<span class="cs-dl-marker" style="left:' + pos.toFixed(1) + '%;border-top-color:' + DL_MARK[zc] + '"></span>' +
        '</div>' +
        '<div class="cs-dl-limit">' + cfg.limit + '</div>' +
      '</div>';
  }
  function dlChip(ok, warn, text) {
    var cls = ok ? 'good' : (warn ? 'warn' : 'bad');
    var mark = ok ? '&#10003;' : (warn ? '&#9679;' : '&#10007;');
    return '<span class="cs-dl-chip cs-dl-chip-' + cls + '">' + mark + ' ' + text + '</span>';
  }
  function druglikenessHTML(d) {
    if (d.hbd == null && d.mw == null) return '';
    var bars = DRUGLIKE.map(function (c) { return dlRow(c, d); }).join('');
    // Lipinski: flag when >=2 of the four cutoffs are exceeded
    var viol = (d.mw > 500) + (d.logP > 5) + (d.hbd > 5) + (d.hba > 10);
    var lip = viol < 2;
    var veber = (d.rotatableBonds != null && d.rotatableBonds <= 10 && d.tpsa != null && d.tpsa <= 140);
    var cnsFull = (d.tpsa != null && d.tpsa <= 90 && d.mw != null && d.mw <= 450);
    var cnsChip = cnsFull
      ? dlChip(true, false, 'CNS-penetrant profile')
      : ((d.tpsa != null && d.tpsa <= 140)
          ? dlChip(false, true, 'Limited / peripherally restricted CNS entry')
          : dlChip(false, false, 'Poor passive CNS entry'));
    var verdict = '<div class="cs-dl-verdict">' +
      dlChip(lip, false, 'Lipinski: ' + (lip ? 'pass' : viol + ' violations')) +
      dlChip(veber, false, 'Veber: ' + (veber ? 'oral-favorable' : 'flagged')) +
      cnsChip + '</div>';
    return '<div class="cs-druglike">' +
      '<div class="cs-dl-title">Druglikeness &amp; CNS access <span class="cs-dl-sub">where this molecule sits in the Lipinski / Veber ranges</span></div>' +
      bars + verdict +
    '</div>';
  }

  // ── Panel markup ─────────────────────────────────────────────────────────
  function panelHTML(d, side) {
    var meta = d.metaboliteOf ? '<span class="cs-metabadge">active metabolite of ' + esc(byId[d.metaboliteOf] ? byId[d.metaboliteOf].name : d.metaboliteOf) + '</span>' : '';
    var legend = LEGEND.map(function (l) { return '<span><i style="background:' + l.c + '"></i>' + esc(l.el) + '</span>'; }).join('');
    var metChips = '';
    if (d.metabolites && d.metabolites.length) {
      metChips = '<div class="cs-canvas-tools">' + d.metabolites.map(function (mid) {
        var mm = byId[mid]; if (!mm) return '';
        return '<button type="button" class="cs-mini-btn" data-loadmet="' + esc(mid) + '" data-into="' + (side === 'A' ? 'B' : 'A') + '">&#8631; View metabolite: ' + esc(mm.name) + '</button>';
      }).join('') + '</div>';
    }
    var sol = (d.solubilityClass ? esc(d.solubilityClass) + ' &middot; ~' + d.solubility_mgml + ' mg/mL <span style="color:#9a927e">(logS ' + d.logS + ')</span>' : '&mdash;');
    return '' +
      '<div class="cs-panel" id="cs-panel-' + side + '">' +
        '<div class="cs-panel-head">' +
          '<p class="cs-panel-name">' + esc(d.name) + ' <span class="cs-panel-brand">' + esc(d.brand) + '</span></p>' +
          '<span class="cs-panel-class">' + esc(d.structClass) + '</span>' + meta +
        '</div>' +
        (d.moietyNote ? '<div class="cs-moiety">&#9432; ' + esc(d.moietyNote) + '</div>' : '') +
        '<div class="cs-viewer-wrap">' +
          '<div class="cs-viewmode">' +
            '<button type="button" class="cs-seg active" data-view="2d" data-side="' + side + '">2D</button>' +
            '<button type="button" class="cs-seg" data-view="3d" data-side="' + side + '">3D</button>' +
          '</div>' +
          '<div class="cs-2d" id="cs-2d-' + side + '">' +
            '<div class="cs-svg-host" id="cs-svg-' + side + '">' + (d.svg2d || '<div class="cs-3d-loading">No 2D depiction</div>') + '</div>' +
            '<div class="cs-legend">' + legend + '</div>' +
            '<div class="cs-canvas-tools"><button type="button" class="cs-mini-btn" data-rotate="' + side + '">&#8635; Rotate 2D</button></div>' +
          '</div>' +
          '<div class="cs-3d" id="cs-3d-' + side + '" style="display:none">' +
            '<div class="cs-3d-canvas" id="cs-viewer-' + side + '"><div class="cs-3d-loading">Loading 3D model&hellip;</div></div>' +
            '<div class="cs-canvas-tools">' +
              '<button type="button" class="cs-mini-btn" data-spin="' + side + '">&#8635; Spin</button>' +
              '<span class="cs-3d-hint">drag to rotate &middot; scroll to zoom</span>' +
            '</div>' +
          '</div>' +
          metChips +
          '<div class="cs-rotated-note" id="cs-rot-' + side + '" style="display:none"></div>' +
        '</div>' +
        '<div class="cs-props">' +
          propRow('Molecular formula', formulaHTML(d.formula)) +
          propRow('Molecular weight', d.mw + ' g/mol', 'Molecular weight') +
          propRow('cLogP (lipophilicity)', d.logP + ' &middot; ' + esc(d.lipophilicity), 'cLogP') +
          propRow('Polar surface area', (d.tpsa != null ? d.tpsa + ' &#8491;&sup2;' : '&mdash;'), 'Polar surface area (TPSA)') +
          propRow('Aqueous solubility', sol, 'Aqueous solubility') +
          propRow('Ionization (pH 7.4)', (d.ionization || '&mdash;'), 'Ionization') +
          propRow('Signal entry point', (d.messenger ? esc(MSG[d.messenger]) : '&mdash;')) +
          propRow('Year introduced/synth.', esc(String(d.year))) +
        '</div>' +
        druglikenessHTML(d) +
        '<div class="cs-regions">' +
          region('lipo', 'Fat- vs water-attracting', d.lipoNote) +
          region('protein', 'Protein-binding region', d.proteinNote) +
          region('receptor', 'Receptor-binding region', d.receptorNote) +
          region('transporter', 'Membrane transport', d.transporterNote) +
          region('cascade', MSG[d.messenger] || 'Signal cascade', d.messengerNote) +
        '</div>' +
      '</div>';
  }

  function summaryHTML(a, b) {
    var struct = structuralSim(a.id, b.id);
    var ind = jaccard(indicationsFor(a.id), indicationsFor(b.id));
    var sameClass = a.cls === b.cls;
    var structPct = struct == null ? null : Math.round(struct * 100);
    var indPct = ind == null ? null : Math.round(ind * 100);

    var enantioNote = (struct === 1 && a.id !== b.id)
      ? '<p class="cs-note">Structural similarity reads 100% because these molecules share the same 2D atom connectivity &mdash; the difference between them is <b>stereochemistry (chirality)</b>, which a 2D fingerprint cannot see. The 2D depictions carry (R)/(S) labels, and the <b>3D</b> view shows the spatial difference that drives the pharmacology.</p>'
      : '';

    var metrics =
      metric(structPct == null ? '&mdash;' : structPct + '%', 'Structural similarity', 'Morgan / ECFP4 Tanimoto', structPct) +
      metric(indPct == null ? 'n/a' : indPct + '%', 'Shared indications', indPct == null ? 'not in indication DB' : 'FDA-use overlap (Jaccard)', indPct) +
      metric(sameClass ? 'Same' : 'Different', 'Pharmacologic class', esc(a.cls) + (sameClass ? '' : ' vs ' + esc(b.cls)), null);

    var evo = evolutionFor(a.id, b.id), evoHTML = '';
    if (evo) {
      var from = evo.reversed ? b : a, to = evo.reversed ? a : b;
      evoHTML = '<div class="cs-evolution">' +
        '<div class="cs-evolution-tag">&#9881; Generation evolution &middot; ' + esc(from.name) + ' &rarr; ' + esc(to.name) + '</div>' +
        '<p><b>What changed:</b> ' + esc(evo.e.change) + '</p>' +
        '<p><b>Why it was expected to improve:</b> ' + esc(evo.e.improvement) + '</p>' +
      '</div>';
    }
    return '<div class="cs-summary">' +
      '<h3>&#9878; ' + esc(a.name) + ' vs ' + esc(b.name) + '</h3>' +
      '<div class="cs-metrics">' + metrics + '</div>' + evoHTML + enantioNote +
    '</div>';
  }
  function metric(val, label, sub, pct) {
    var bar = (pct == null) ? '' : '<div class="cs-bar"><i style="width:' + pct + '%"></i></div>';
    return '<div class="cs-metric"><div class="cs-metric-val">' + val + '</div>' +
           '<div class="cs-metric-label">' + label + '</div><div class="cs-metric-sub">' + sub + '</div>' + bar + '</div>';
  }

  // ── 2D (pre-rendered SVG; rotation via CSS transform) ────────────────────
  var rot = { A: 0, B: 0 };
  function applyRotation(side) {
    var host = document.getElementById('cs-svg-' + side);
    if (!host) return;
    var svg = host.querySelector('svg');
    if (svg) svg.style.transform = 'rotate(' + rot[side] + 'deg)';
  }

  // ── 3D (3Dmol.js) ────────────────────────────────────────────────────────
  var viewers = { A: null, B: null };
  function show3D(side) {
    var host = document.getElementById('cs-viewer-' + side);
    if (!host) return;
    load3Dmol().then(function () {
      var loading = host.querySelector('.cs-3d-loading'); if (loading) loading.remove();
      if (!viewers[side]) viewers[side] = window.$3Dmol.createViewer(host, { backgroundColor: 'white' });
      var v = viewers[side];
      v.clear();
      v.addModel(current[side].mol3d, 'mol');
      v.setStyle({}, { stick: { radius: 0.13, colorscheme: 'Jmol' }, sphere: { scale: 0.24, colorscheme: 'Jmol' } });
      v.zoomTo(); v.resize(); v.render();
    }).catch(function () {
      host.innerHTML = '<div class="cs-3d-loading" style="color:#b04a2c">3D viewer failed to load</div>';
    });
  }
  function toggleView(side, mode) {
    document.querySelectorAll('[data-side="' + side + '"].cs-seg').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-view') === mode);
    });
    document.getElementById('cs-2d-' + side).style.display = (mode === '2d') ? 'block' : 'none';
    document.getElementById('cs-3d-' + side).style.display = (mode === '3d') ? 'block' : 'none';
    if (mode === '3d') show3D(side); else if (viewers[side]) { try { viewers[side].spin(false); } catch (e) {} }
  }

  var spinning = { A: false, B: false };
  var current = { A: null, B: null };
  var mode = 'compare';   // 'compare' | 'single' | 'rank'
  var host = null, card = null;   // populated in buildUI (module-scope for setMode/go)

  function renderResults(idA, idB) {
    var a = byId[idA], b = byId[idB];
    var box = document.getElementById('cs-results');
    if (!a || !b) { box.style.display = 'none'; return; }
    current.A = a; current.B = b; rot.A = 0; rot.B = 0;
    viewers.A = null; viewers.B = null; spinning.A = false; spinning.B = false;
    box.style.display = 'block';
    box.innerHTML = '<div class="cs-grid">' + panelHTML(a, 'A') + panelHTML(b, 'B') + '</div>' + summaryHTML(a, b);
    wireResultButtons();
    box.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderSingle(id) {
    var a = byId[id];
    var box = document.getElementById('cs-results');
    if (!a) { box.style.display = 'none'; return; }
    current.A = a; current.B = null; rot.A = 0;
    viewers.A = null; viewers.B = null; spinning.A = false;
    box.style.display = 'block';
    box.innerHTML = '<div class="cs-grid single">' + panelHTML(a, 'A') + '</div>';
    wireResultButtons();
    box.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function wireResultButtons() {
    var box = document.getElementById('cs-results');
    box.querySelectorAll('.cs-seg').forEach(function (btn) {
      btn.addEventListener('click', function () { toggleView(btn.getAttribute('data-side'), btn.getAttribute('data-view')); });
    });
    box.querySelectorAll('[data-rotate]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var side = btn.getAttribute('data-rotate');
        rot[side] = (rot[side] + 45) % 360;
        applyRotation(side);
        var note = document.getElementById('cs-rot-' + side);
        if (note) { note.style.display = 'block'; note.textContent = '2D rotated ' + rot[side] + '°'; }
      });
    });
    box.querySelectorAll('[data-spin]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var side = btn.getAttribute('data-spin');
        if (!viewers[side]) return;
        spinning[side] = !spinning[side];
        try { viewers[side].spin(spinning[side] ? 'y' : false); viewers[side].render(); } catch (e) {}
      });
    });
    box.querySelectorAll('.cs-gloss-link').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var term = a.getAttribute('data-gterm');
        if (!term || !window.glossaryScrollToTerm) return;
        // Record Chem Structure as a history entry so the browser Back
        // button returns here (the SPA otherwise leaves no back-stack).
        try {
          if (window.location.hash !== '#chem-structure') {
            history.replaceState(null, '', '#chem-structure');
          }
          history.pushState(null, '', '#psychiatry-glossary');
        } catch (err) {}
        window.glossaryScrollToTerm(term);
      });
    });
    box.querySelectorAll('[data-loadmet]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var mid = btn.getAttribute('data-loadmet');
        if (mode === 'single') { setSelects(mid, document.getElementById('cs-sel-b').value); renderSingle(mid); return; }
        var into = btn.getAttribute('data-into');
        var otherId = (into === 'A') ? current.B.id : current.A.id;
        var newA = (into === 'A') ? mid : otherId;
        var newB = (into === 'A') ? otherId : mid;
        setSelects(newA, newB);
        renderResults(newA, newB);
        setTimeout(function () {
          rot[into] = 30; applyRotation(into);
          var note = document.getElementById('cs-rot-' + into);
          if (note) { note.style.display = 'block'; note.textContent = 'Metabolite shown rotated 30° for contrast'; }
        }, 60);
      });
    });
  }

  // ── Setup ────────────────────────────────────────────────────────────────
  function optionList() {
    var groups = {};
    CHEM_STRUCTURES.forEach(function (d) { (groups[d.category] = groups[d.category] || []).push(d); });
    var html = '<option value="">&mdash; Select &mdash;</option>';
    Object.keys(groups).forEach(function (cat) {
      html += '<optgroup label="' + esc(cat) + '">';
      groups[cat].forEach(function (d) {
        var tag = d.metaboliteOf ? ' • metabolite' : '';
        html += '<option value="' + esc(d.id) + '">' + esc(d.name) + ' (' + esc(d.brand) + ')' + tag + '</option>';
      });
      html += '</optgroup>';
    });
    return html;
  }
  function setSelects(a, b) {
    var sa = document.getElementById('cs-sel-a'), sb = document.getElementById('cs-sel-b');
    if (sa) sa.value = a; if (sb) sb.value = b;
  }
  var QUICKPICKS = [
    ['amitriptyline', 'fluoxetine', 'Old TCA', 'New SSRI'],
    ['citalopram', 'escitalopram', 'Racemate', 'Eutomer'],
    ['venlafaxine', 'desvenlafaxine', 'Parent', 'Active metabolite'],
    ['haloperidol', 'risperidone', 'Typical', 'Atypical'],
    ['risperidone', 'paliperidone', 'Parent', '9-OH metabolite'],
    ['haloperidol', 'aripiprazole', 'Full antagonist', 'Partial agonist'],
    ['imipramine', 'desipramine', 'Tertiary amine', 'Secondary amine']
  ];

  // ── Filter & rank table ───────────────────────────────────────────────────
  // A sortable/filterable table of the whole structure library so the user can
  // scan similarities and disparities across every listed molecular property.
  function fmtNum(v, dp) { return (v == null || isNaN(v)) ? '&mdash;' : Number(v).toFixed(dp); }
  var RANK_COLS = [
    { key: 'name',           label: 'Drug',              type: 'str', tl: true, cell: function (d) { return '<span class="cs-rank-name">' + esc(d.name) + '</span> <span class="cs-rank-brand">' + esc(d.brand) + '</span>'; } },
    { key: 'cls',            label: 'Class',             type: 'str', tl: true, cell: function (d) { return esc(d.cls); } },
    { key: 'category',       label: 'Indication',        type: 'str', tl: true, cell: function (d) { return esc(d.category); } },
    { key: 'formula',        label: 'Formula',           type: 'str', tl: true, cell: function (d) { return formulaHTML(d.formula); } },
    { key: 'mw',             label: 'MW (g/mol)',        type: 'num', cell: function (d) { return fmtNum(d.mw, 2); } },
    { key: 'logP',           label: 'cLogP',             type: 'num', cell: function (d) { return fmtNum(d.logP, 2); } },
    { key: 'tpsa',           label: 'PSA (Å²)', type: 'num', cell: function (d) { return fmtNum(d.tpsa, 1); } },
    { key: 'logS',           label: 'Solubility (logS)', type: 'num', cell: function (d) { return fmtNum(d.logS, 2); } },
    { key: 'pctIonized',     label: '% Ionized (pH 7.4)', type: 'num', cell: function (d) { return d.pctIonized != null ? fmtNum(d.pctIonized, 1) + '%' : '&mdash;'; } },
    { key: 'messenger',      label: 'Signal entry',      type: 'num', cell: function (d) { return d.messenger ? esc(MSG[d.messenger]) : '&mdash;'; } },
    { key: 'year',           label: 'Year',              type: 'num', cell: function (d) { return d.year != null ? d.year : '&mdash;'; } },
    { key: 'hbd',            label: 'H-bond donors',     type: 'num', cell: function (d) { return d.hbd != null ? d.hbd : '&mdash;'; } },
    { key: 'hba',            label: 'H-bond acceptors',  type: 'num', cell: function (d) { return d.hba != null ? d.hba : '&mdash;'; } },
    { key: 'rotatableBonds', label: 'Rotatable bonds',   type: 'num', cell: function (d) { return d.rotatableBonds != null ? d.rotatableBonds : '&mdash;'; } }
  ];
  function colByKey(k) { for (var i = 0; i < RANK_COLS.length; i++) if (RANK_COLS[i].key === k) return RANK_COLS[i]; return RANK_COLS[0]; }
  var rankSort = { key: 'name', dir: 1 };   // dir: 1 = ascending, -1 = descending
  var rankFilters = { cls: '', cat: '', text: '' };
  var rankPickA = null;                     // id chosen as Structure A from the table

  function rankRows() {
    var rows = CHEM_STRUCTURES.filter(function (d) {
      if (rankFilters.cls && d.cls !== rankFilters.cls) return false;
      if (rankFilters.cat && d.category !== rankFilters.cat) return false;
      if (rankFilters.text) {
        var t = rankFilters.text.toLowerCase();
        if ((d.name || '').toLowerCase().indexOf(t) < 0 && (d.brand || '').toLowerCase().indexOf(t) < 0) return false;
      }
      return true;
    });
    var col = colByKey(rankSort.key), key = rankSort.key;
    rows.sort(function (a, b) {
      var va = a[key], vb = b[key], na = (va == null), nb = (vb == null);
      if (na && nb) return 0; if (na) return 1; if (nb) return -1;   // nulls always last
      var c = (col.type === 'num') ? (va - vb) : String(va).localeCompare(String(vb));
      return c * rankSort.dir;
    });
    return rows;
  }
  function updateRankHint() {
    var h = document.getElementById('cs-rank-hint'); if (!h) return;
    if (rankPickA && byId[rankPickA]) {
      h.innerHTML = 'Selected <b>' + esc(byId[rankPickA].name) + '</b> as Structure&nbsp;A &mdash; click another row to compare, or click it again to view it alone.';
    } else {
      h.innerHTML = 'Click a column header to rank by that property (click again to reverse). Click a row to load it into the comparison viewer.';
    }
  }
  function renderRank() {
    var box = document.getElementById('cs-results'); if (!box) return;
    box.style.display = 'block';
    var rows = rankRows();
    var thead = RANK_COLS.map(function (c) {
      var on = (c.key === rankSort.key);
      var arrow = on ? (rankSort.dir === 1 ? ' ▲' : ' ▼') : '';
      return '<th class="' + (c.tl ? 'cs-tl' : '') + (on ? ' cs-sorted' : '') + '" data-sortkey="' + c.key + '">' + esc(c.label) + '<span class="cs-sort-arrow">' + arrow + '</span></th>';
    }).join('');
    var tbody = rows.map(function (d) {
      var tds = RANK_COLS.map(function (c) { return '<td class="' + (c.tl ? 'cs-tl' : '') + '">' + c.cell(d) + '</td>'; }).join('');
      return '<tr data-pickid="' + esc(d.id) + '"' + (d.id === rankPickA ? ' class="cs-pick-a"' : '') + '>' + tds + '</tr>';
    }).join('');
    box.innerHTML =
      '<div class="cs-rank-wrap"><table class="cs-rank"><thead><tr>' + thead + '</tr></thead><tbody>' +
      (tbody || '<tr><td class="cs-tl" colspan="' + RANK_COLS.length + '">No molecules match these filters.</td></tr>') +
      '</tbody></table></div>' +
      '<div class="cs-rank-count">Showing ' + rows.length + ' of ' + CHEM_STRUCTURES.length + ' molecules</div>';
    box.querySelectorAll('th[data-sortkey]').forEach(function (th) {
      th.addEventListener('click', function () {
        var k = th.getAttribute('data-sortkey');
        if (rankSort.key === k) rankSort.dir = -rankSort.dir;
        else { rankSort.key = k; rankSort.dir = (colByKey(k).type === 'num') ? -1 : 1; }
        var s = document.getElementById('cs-sort-sel'); if (s) s.value = rankSort.key;
        renderRank();
      });
    });
    box.querySelectorAll('tr[data-pickid]').forEach(function (tr) {
      tr.addEventListener('click', function () { pickFromRank(tr.getAttribute('data-pickid')); });
    });
  }
  function pickFromRank(id) {
    if (!byId[id]) return;
    if (!rankPickA) { rankPickA = id; updateRankHint(); renderRank(); return; }
    if (rankPickA === id) { rankPickA = null; setSelects(id, ''); setMode('single'); return; }
    var a = rankPickA; rankPickA = null; setSelects(a, id); setMode('compare');
  }

  // ── go / setMode (module-scope: shared by the mode toggle and the rank table) ─
  function go() {
    if (!host) return;
    var a = host.querySelector('#cs-sel-a').value, b = host.querySelector('#cs-sel-b').value;
    if (mode === 'single') { if (a) renderSingle(a); }
    else if (mode === 'rank') { renderRank(); }
    else if (a && b) renderResults(a, b);
  }
  function setMode(m) {
    if (!host || !card) return;
    mode = m;
    card.querySelectorAll('.cs-modeseg').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-mode') === m); });
    card.classList.toggle('single-mode', m === 'single');
    var isRank = (m === 'rank');
    var setupRow = host.querySelector('.cs-setup-row');
    var quick = host.querySelector('.cs-quickpicks');
    var rankCtrls = host.querySelector('#cs-rank-controls');
    if (setupRow) setupRow.style.display = isRank ? 'none' : '';
    if (quick) quick.style.display = (isRank || m === 'single') ? 'none' : '';
    if (rankCtrls) rankCtrls.style.display = isRank ? '' : 'none';
    host.querySelector('#cs-label-a').textContent = (m === 'single') ? 'Medication' : 'Structure A';
    host.querySelector('#cs-go').innerHTML = (m === 'single') ? 'View ▸' : 'Compare ▸';
    if (isRank) { rankPickA = null; updateRankHint(); renderRank(); }
    else go();
  }

  function init() {
    var mount = document.getElementById('cs-mount');
    if (!mount || mount.dataset.ready) return;
    mount.dataset.ready = '1';
    var results = document.getElementById('cs-results');
    if (results) { results.style.display = 'block'; results.innerHTML = '<div class="cs-empty">Loading structure library&hellip;</div>'; }
    ensureData().then(function () {
      if (results) { results.style.display = 'none'; results.innerHTML = ''; }
      indexData();
      buildUI(mount);
    }).catch(function (e) {
      mount.dataset.ready = '';
      if (results) results.innerHTML = '<div class="cs-empty" style="color:#b04a2c">Could not load the structure library. Please reload the page.</div>';
      console.error('chem-structure: data load failed', e);
    });
  }

  function buildUI(mount) {
    host = mount;
    card = host.querySelector('.cs-setup-card');
    host.querySelector('#cs-sel-a').innerHTML = optionList();
    host.querySelector('#cs-sel-b').innerHTML = optionList();
    host.querySelector('#cs-quickpicks').innerHTML = QUICKPICKS.map(function (p) {
      return '<button type="button" class="cs-chip" data-a="' + p[0] + '" data-b="' + p[1] + '">' +
        esc(byId[p[0]].name) + ' <span class="cs-chip-arrow">&rarr;</span> ' + esc(byId[p[1]].name) +
        ' <span style="color:#9a927e">(' + esc(p[2]) + ' vs ' + esc(p[3]) + ')</span></button>';
    }).join('');
    host.querySelector('#cs-go').addEventListener('click', go);
    host.querySelector('#cs-sel-a').addEventListener('change', function () { if (mode === 'single') go(); });
    host.querySelector('#cs-swap').addEventListener('click', function () {
      var sa = host.querySelector('#cs-sel-a'), sb = host.querySelector('#cs-sel-b');
      var t = sa.value; sa.value = sb.value; sb.value = t;
      if (sa.value && sb.value) renderResults(sa.value, sb.value);
    });
    host.querySelector('#cs-quickpicks').addEventListener('click', function (e) {
      var chip = e.target.closest('.cs-chip'); if (!chip) return;
      if (mode !== 'compare') setMode('compare');
      setSelects(chip.getAttribute('data-a'), chip.getAttribute('data-b'));
      renderResults(chip.getAttribute('data-a'), chip.getAttribute('data-b'));
    });

    // ── mode toggle: compare two ⇄ single medication ⇄ filter & rank ──────────
    card.querySelectorAll('.cs-modeseg').forEach(function (b) {
      b.addEventListener('click', function () { setMode(b.getAttribute('data-mode')); });
    });
    buildRankControls();

    setSelects('amitriptyline', 'fluoxetine');
    renderResults('amitriptyline', 'fluoxetine');
  }

  function buildRankControls() {
    var clsSel = host.querySelector('#cs-filter-class');
    var catSel = host.querySelector('#cs-filter-cat');
    var sortSel = host.querySelector('#cs-sort-sel');
    var txt = host.querySelector('#cs-filter-text');
    if (!clsSel || !catSel || !sortSel || !txt) return;
    var classes = {}, cats = {};
    CHEM_STRUCTURES.forEach(function (d) { if (d.cls) classes[d.cls] = 1; if (d.category) cats[d.category] = 1; });
    clsSel.innerHTML = '<option value="">All classes</option>' + Object.keys(classes).sort().map(function (c) { return '<option value="' + esc(c) + '">' + esc(c) + '</option>'; }).join('');
    catSel.innerHTML = '<option value="">All indications</option>' + Object.keys(cats).sort().map(function (c) { return '<option value="' + esc(c) + '">' + esc(c) + '</option>'; }).join('');
    sortSel.innerHTML = RANK_COLS.map(function (c) { return '<option value="' + c.key + '">' + esc(c.label) + '</option>'; }).join('');
    sortSel.value = rankSort.key;
    clsSel.addEventListener('change', function () { rankFilters.cls = clsSel.value; renderRank(); });
    catSel.addEventListener('change', function () { rankFilters.cat = catSel.value; renderRank(); });
    txt.addEventListener('input', function () { rankFilters.text = txt.value.trim(); renderRank(); });
    sortSel.addEventListener('change', function () {
      var k = sortSel.value; rankSort.key = k; rankSort.dir = (colByKey(k).type === 'num') ? -1 : 1; renderRank();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  window.chemStructureInit = init;
})();

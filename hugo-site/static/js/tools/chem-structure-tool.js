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
  var DATA_VERSION = '20260716f';
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
  function propRow(l, v) { return '<div class="cs-prop-row"><span class="cs-prop-label">' + l + '</span><span class="cs-prop-val">' + v + '</span></div>'; }
  function region(cls, title, txt) {
    if (!txt) return '';
    return '<div class="cs-region ' + cls + '"><div class="cs-region-title">' + esc(title) + '</div>' + esc(txt) + '</div>';
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
          propRow('Molecular weight', d.mw + ' g/mol') +
          propRow('cLogP (lipophilicity)', d.logP + ' &middot; ' + esc(d.lipophilicity)) +
          propRow('Polar surface area', (d.tpsa != null ? d.tpsa + ' &#8491;&sup2;' : '&mdash;')) +
          propRow('Aqueous solubility', sol) +
          propRow('Ionization (pH 7.4)', (d.ionization || '&mdash;')) +
          propRow('Signal entry point', (d.messenger ? esc(MSG[d.messenger]) : '&mdash;')) +
          propRow('Year introduced/synth.', esc(String(d.year))) +
        '</div>' +
        '<div class="cs-regions">' +
          region('lipo', 'Fat- vs water-attracting', d.lipoNote) +
          region('protein', 'Protein-binding region', d.proteinNote) +
          region('receptor', 'Receptor-binding region', d.receptorNote) +
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
  var mode = 'compare';   // 'compare' | 'single'

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

  function init() {
    var host = document.getElementById('cs-mount');
    if (!host || host.dataset.ready) return;
    host.dataset.ready = '1';
    var results = document.getElementById('cs-results');
    if (results) { results.style.display = 'block'; results.innerHTML = '<div class="cs-empty">Loading structure library&hellip;</div>'; }
    ensureData().then(function () {
      if (results) { results.style.display = 'none'; results.innerHTML = ''; }
      indexData();
      buildUI(host);
    }).catch(function (e) {
      host.dataset.ready = '';
      if (results) results.innerHTML = '<div class="cs-empty" style="color:#b04a2c">Could not load the structure library. Please reload the page.</div>';
      console.error('chem-structure: data load failed', e);
    });
  }

  function buildUI(host) {
    host.querySelector('#cs-sel-a').innerHTML = optionList();
    host.querySelector('#cs-sel-b').innerHTML = optionList();
    host.querySelector('#cs-quickpicks').innerHTML = QUICKPICKS.map(function (p) {
      return '<button type="button" class="cs-chip" data-a="' + p[0] + '" data-b="' + p[1] + '">' +
        esc(byId[p[0]].name) + ' <span class="cs-chip-arrow">&rarr;</span> ' + esc(byId[p[1]].name) +
        ' <span style="color:#9a927e">(' + esc(p[2]) + ' vs ' + esc(p[3]) + ')</span></button>';
    }).join('');
    function go() {
      var a = host.querySelector('#cs-sel-a').value, b = host.querySelector('#cs-sel-b').value;
      if (mode === 'single') { if (a) renderSingle(a); }
      else if (a && b) renderResults(a, b);
    }
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

    // ── mode toggle: compare two ⇄ single medication ──────────────────────
    var card = host.querySelector('.cs-setup-card');
    function setMode(m) {
      mode = m;
      card.querySelectorAll('.cs-modeseg').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-mode') === m); });
      card.classList.toggle('single-mode', m === 'single');
      host.querySelector('#cs-label-a').textContent = (m === 'single') ? 'Medication' : 'Structure A';
      host.querySelector('#cs-go').innerHTML = (m === 'single') ? 'View ▸' : 'Compare ▸';
      var quick = host.querySelector('.cs-quickpicks'); if (quick) quick.style.display = (m === 'single') ? 'none' : '';
      go();
    }
    card.querySelectorAll('.cs-modeseg').forEach(function (b) {
      b.addEventListener('click', function () { setMode(b.getAttribute('data-mode')); });
    });

    setSelects('amitriptyline', 'fluoxetine');
    renderResults('amitriptyline', 'fluoxetine');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  window.chemStructureInit = init;
})();

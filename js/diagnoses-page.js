/* ── Diagnoses Database — SPA section renderer ───────────────────────────────
   Renders the sortable/filterable diagnoses table and its detail modal into the
   #diagnoses-db section of index.html. Reads window.DiagnosesDB (js/diagnoses-
   data.js), which must load first.

   All DOM ids/classes are namespaced `dxdb-` so nothing collides with the drug
   database, its #drug-modal, or the global .modal/.overlay styles. The table
   itself intentionally reuses the site's global table CSS (.table-wrapper,
   thead/th.sortable/.sort-arrow, tbody tr, td) so it matches the Drug Database.
   ────────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  function init() {
    var DB = window.DiagnosesDB;
    var root = document.getElementById('diagnoses-db');
    if (!DB || !root) return;

    // Let switchSection() expand the Psychopharmacology group for this section,
    // without editing app.js — SECTION_GROUP is a global lexical binding there.
    try { if (typeof SECTION_GROUP !== 'undefined') SECTION_GROUP['diagnoses-db'] = 'psychopharm'; } catch (e) {}

    var cats = DB.categories, dx = DB.diagnoses;
    var catName = {}; cats.forEach(function (c) { catName[c.id] = c.name; });
    var byId = {}; dx.forEach(function (d) { byId[d.id] = d; });

    function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }

    var searchEl = document.getElementById('dxdb-search');
    var selEl    = document.getElementById('dxdb-cat');
    var tbody    = document.getElementById('dxdb-tbody');
    var emptyEl  = document.getElementById('dxdb-empty');
    var countEl  = document.getElementById('dxdb-count');
    var wrap     = document.getElementById('dxdb-wrap');
    var htop     = document.getElementById('dxdb-hscroll');
    var spacer   = document.getElementById('dxdb-hspacer');
    var table    = document.getElementById('dxdb-table');
    var overlay  = document.getElementById('dxdb-overlay');
    var modal    = document.getElementById('dxdb-modal');

    // Category filter options
    cats.forEach(function (c) { var o = document.createElement('option'); o.value = c.id; o.textContent = c.name; selEl.appendChild(o); });

    var sortCol = 'name', sortDir = 1, filterText = '', filterCat = '';

    function onsetKey(d){ var m = (d.epi.onset || '').match(/\d+/); return m ? parseInt(m[0], 10) : 999; }

    function rowsData() {
      var rows = dx.slice();
      if (filterCat) rows = rows.filter(function (d) { return d.cat === filterCat; });
      if (filterText) {
        var f = filterText.toLowerCase();
        rows = rows.filter(function (d) {
          var hay = (d.name + ' ' + d.desc + ' ' + catName[d.cat] + ' ' + d.codes.dsm + ' ' + d.codes.icd10 + ' ' + d.codes.icd11 + ' ' +
            d.meds.first.join(' ') + ' ' + d.meds.adjunct.join(' ') + ' ' + d.therapy.join(' ') + ' ' +
            d.ddx.join(' ') + ' ' + d.comorbid.join(' ') + ' ' + d.scales.join(' ')).toLowerCase();
          return hay.indexOf(f) !== -1;
        });
      }
      rows.sort(function (a, b) {
        var av, bv;
        if (sortCol === 'cat') { av = catName[a.cat]; bv = catName[b.cat]; }
        else if (sortCol === 'icd10') { av = a.codes.icd10; bv = b.codes.icd10; }
        else if (sortCol === 'icd11') { av = a.codes.icd11; bv = b.codes.icd11; }
        else if (sortCol === 'onset') { av = onsetKey(a); bv = onsetKey(b); }
        else { av = a.name; bv = b.name; }
        if (typeof av === 'string') av = av.toLowerCase();
        if (typeof bv === 'string') bv = bv.toLowerCase();
        if (av < bv) return -sortDir; if (av > bv) return sortDir;
        return a.name.localeCompare(b.name);
      });
      return rows;
    }

    function rxCell(d) {
      var f = d.meds.first;
      if (!f.length) return '<span class="dxdb-more">—</span>';
      var shown = f.slice(0, 2).map(esc).join('; ');
      var extra = f.length > 2 ? ' <span class="dxdb-more">+' + (f.length - 2) + ' more</span>' : '';
      return '<span>' + shown + '</span>' + extra;
    }

    function render() {
      var rows = rowsData();
      tbody.innerHTML = rows.map(function (d) {
        return '<tr data-id="' + d.id + '">' +
          '<td><span class="dxdb-name">' + esc(d.name) + '</span><span class="dxdb-sub">' + esc(d.desc.slice(0, 70)) + (d.desc.length > 70 ? '…' : '') + '</span></td>' +
          '<td><span class="dxdb-catpill">' + esc(catName[d.cat]) + '</span></td>' +
          '<td class="dxdb-code">' + esc(d.codes.icd10) + '</td>' +
          '<td class="dxdb-icd11">' + esc(d.codes.icd11) + '</td>' +
          '<td class="dxdb-col-prev">' + esc(d.epi.prevalence) + '</td>' +
          '<td class="dxdb-col-onset">' + esc(d.epi.onset) + '</td>' +
          '<td class="dxdb-col-rx">' + rxCell(d) + '</td>' +
        '</tr>';
      }).join('');
      emptyEl.style.display = rows.length ? 'none' : 'block';
      countEl.textContent = (filterText || filterCat) ? (rows.length + ' of ' + dx.length) : (dx.length + ' diagnoses');
      root.querySelectorAll('th.sortable').forEach(function (th) {
        th.classList.remove('sort-asc', 'sort-desc');
        if (th.dataset.col === sortCol) th.classList.add(sortDir === 1 ? 'sort-asc' : 'sort-desc');
      });
      syncHWidth();
    }

    // Keep the top scrollbar width matched to the table (re-run when shown).
    function syncHWidth(){ if (spacer && table) spacer.style.width = table.scrollWidth + 'px'; }
    var lock = false;
    if (htop) htop.addEventListener('scroll', function () { if (lock) return; lock = true; wrap.scrollLeft = htop.scrollLeft; lock = false; });
    if (wrap) wrap.addEventListener('scroll', function () { if (lock) return; lock = true; htop.scrollLeft = wrap.scrollLeft; lock = false; });
    window.addEventListener('resize', syncHWidth);

    // The section is display:none until activated; scrollWidth reads 0 while
    // hidden, so recompute the moment it becomes visible.
    var mo = new MutationObserver(function () { if (root.classList.contains('active')) setTimeout(syncHWidth, 30); });
    mo.observe(root, { attributes: true, attributeFilter: ['class'] });

    // Sorting
    root.querySelectorAll('th.sortable').forEach(function (th) {
      th.addEventListener('click', function () {
        if (sortCol === th.dataset.col) sortDir *= -1; else { sortCol = th.dataset.col; sortDir = 1; }
        render();
      });
    });
    // Filters
    var t;
    searchEl.addEventListener('input', function () { clearTimeout(t); t = setTimeout(function () { filterText = searchEl.value; render(); }, 120); });
    selEl.addEventListener('change', function () { filterCat = selEl.value; render(); });
    // Row → modal
    tbody.addEventListener('click', function (e) { var tr = e.target.closest('tr'); if (tr) openModal(tr.dataset.id); });

    // ── Modal ────────────────────────────────────────────────────────────────
    function pills(arr, cls){ return arr.map(function (x){ return '<span class="dxdb-pill ' + (cls || '') + '">' + esc(x) + '</span>'; }).join(''); }
    function lines(arr){ return '<ul class="dxdb-lines">' + arr.map(function (x){ return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>'; }
    function openModal(id) {
      var d = byId[id]; if (!d) return;
      var medNote = d.meds.note ? '<p class="dxdb-mednote">' + esc(d.meds.note) + '</p>' : '';
      modal.innerHTML =
        '<div class="dxdb-mhead"><div class="dxdb-mcat">' + esc(catName[d.cat]) + '</div><h2>' + esc(d.name) + '</h2>' +
          '<button class="dxdb-close" aria-label="Close">&times;</button></div>' +
        '<div class="dxdb-mbody">' +
          '<p class="dxdb-desc">' + esc(d.desc) + '</p>' +
          '<div class="dxdb-codes">' +
            '<span class="dxdb-chip"><b>DSM-5-TR</b>' + esc(d.codes.dsm) + '</span>' +
            '<span class="dxdb-chip"><b>ICD-10-CM</b>' + esc(d.codes.icd10) + '</span>' +
            '<span class="dxdb-chip"><b>ICD-11</b>' + esc(d.codes.icd11) + '</span>' +
          '</div>' +
          '<div class="dxdb-epi">' +
            '<div class="dxdb-cell"><div class="dxdb-lab">Incidence</div><div class="dxdb-val">' + esc(d.epi.incidence) + '</div></div>' +
            '<div class="dxdb-cell"><div class="dxdb-lab">Prevalence</div><div class="dxdb-val">' + esc(d.epi.prevalence) + '</div></div>' +
            '<div class="dxdb-cell"><div class="dxdb-lab">Mortality</div><div class="dxdb-val">' + esc(d.epi.mortality) + '</div></div>' +
            '<div class="dxdb-cell"><div class="dxdb-lab">Age of Onset</div><div class="dxdb-val">' + esc(d.epi.onset) + '</div></div>' +
          '</div>' +
          '<div class="dxdb-block"><h4>Medications</h4>' +
            '<div class="dxdb-sublab">First-line / FDA-approved</div><div class="dxdb-pills">' + pills(d.meds.first, 'first') + '</div>' +
            '<div class="dxdb-sublab">Adjunct / second-line</div><div class="dxdb-pills">' + pills(d.meds.adjunct, '') + '</div>' + medNote + '</div>' +
          '<div class="dxdb-block"><h4>Recommended Therapy</h4><div class="dxdb-pills">' + pills(d.therapy, '') + '</div></div>' +
          '<div class="dxdb-block"><h4>Differential Diagnosis</h4>' + lines(d.ddx) + '</div>' +
          '<div class="dxdb-block"><h4 class="dxdb-warn">Red Flags / When to Escalate</h4><div class="dxdb-pills">' + pills(d.redFlags, 'warnp') + '</div></div>' +
          '<div class="dxdb-block"><h4>Relevant Rating Scales</h4><div class="dxdb-pills">' + pills(d.scales, 'scale') + '</div></div>' +
          '<div class="dxdb-block"><h4>Course &amp; Prognosis</h4><p class="dxdb-prose">' + esc(d.course) + '</p>' +
            '<div class="dxdb-sublab">Common comorbidities</div><div class="dxdb-pills">' + pills(d.comorbid, '') + '</div></div>' +
        '</div>';
      modal.querySelector('.dxdb-close').addEventListener('click', closeModal);
      overlay.classList.add('open'); overlay.scrollTop = 0; document.body.style.overflow = 'hidden';
    }
    function closeModal(){ overlay.classList.remove('open'); document.body.style.overflow = ''; }
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

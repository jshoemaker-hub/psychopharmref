/**
 * thc-tool.js — 24-Hour THC Intake Calculator (prefix: thc-)
 *
 * Clinician documents cannabis products used over 24 h to estimate total THC
 * in milligrams. Two input modes:
 *   - weight  : amount (g) x %THC  -> mg THC  (flower, vape oil, concentrate)
 *   - dose    : mg per unit x units -> mg THC (edible, beverage, capsule, drops)
 *
 * IMPORTANT: this estimates the THC CONTENT consumed from product labels /
 * typical potency, NOT the bioavailable (absorbed) dose, which is far lower
 * and route-dependent.
 */
(function () {
  'use strict';

  var mount = document.getElementById('thc-container');
  if (!mount || mount.dataset.init) return;
  mount.dataset.init = '1';

  // [label, mode, defaultA, defaultB]
  // weight mode: A = amount (g), B = % THC
  // dose mode:   A = mg per unit, B = # units
  // weight mode: defaultA = amount used (starts 0), defaultB = typical % THC (prefilled)
  // dose   mode: defaultA = typical mg per unit (prefilled), defaultB = units used (starts 0)
  var PRODUCTS = [
    ['Flower / bud (smoked or vaped)', 'weight', 0, 20],
    ['Pre-roll / joint', 'weight', 0, 20],
    ['Vape cartridge / oil', 'weight', 0, 80],
    ['Concentrate / dab (wax, shatter, rosin)', 'weight', 0, 75],
    ['Edible (gummy, chocolate, etc.)', 'dose', 10, 0],
    ['Infused beverage', 'dose', 5, 0],
    ['Capsule / tablet', 'dose', 10, 0],
    ['Tincture / oil drops', 'dose', 5, 0]
  ];

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function num(el) {
    var v = parseFloat(el.value);
    return isFinite(v) && v > 0 ? v : 0;
  }

  function contribution(mode, a, b) {
    if (mode === 'weight') return a * (b / 100) * 1000; // grams -> mg THC
    return a * b; // mg per unit * units
  }

  var html = '';
  html += '<div class="thc-grid-head">'
    + '<span>Product</span><span class="thc-ha">Amount / dose</span>'
    + '<span class="thc-hb">Potency / units</span><span>mg THC</span></div>';
  html += '<div class="thc-rows">';

  PRODUCTS.forEach(function (p, i) {
    var weight = p[1] === 'weight';
    html += '<div class="thc-row" data-mode="' + p[1] + '" data-i="' + i + '">'
      + '<span class="thc-name">' + esc(p[0]) + '</span>'
      + '<span class="thc-a"><input type="number" min="0" step="' + (weight ? '0.1' : '1') + '" class="thc-in thc-ina" value="' + p[2] + '">'
      + '<em>' + (weight ? 'g' : 'mg/unit') + '</em></span>'
      + '<span class="thc-b"><input type="number" min="0" step="' + (weight ? '1' : '1') + '" class="thc-in thc-inb" value="' + p[3] + '">'
      + '<em>' + (weight ? '% THC' : 'units') + '</em></span>'
      + '<span class="thc-sub">0 mg</span>'
      + '</div>';
  });
  // custom dose row
  html += '<div class="thc-row thc-custom" data-mode="dose">'
    + '<span class="thc-name"><input type="text" class="thc-in thc-ctext" placeholder="Other product (describe)"></span>'
    + '<span class="thc-a"><input type="number" min="0" step="1" class="thc-in thc-ina" value="0"><em>mg/unit</em></span>'
    + '<span class="thc-b"><input type="number" min="0" step="1" class="thc-in thc-inb" value="0"><em>units</em></span>'
    + '<span class="thc-sub">0 mg</span>'
    + '</div>';
  html += '</div>';

  html += '<div class="thc-total-bar">'
    + '<div class="thc-total-num"><span id="thc-total">0</span> mg</div>'
    + '<div class="thc-total-label">estimated total THC content / 24 h</div>'
    + '<div class="thc-flags" id="thc-flags"></div>'
    + '</div>';

  html += '<div class="thc-actions">'
    + '<button type="button" class="thc-btn thc-btn-primary" id="thc-report">Generate Report</button>'
    + '<button type="button" class="thc-btn thc-btn-ghost" id="thc-reset">Reset</button>'
    + '</div>';
  html += '<textarea id="thc-report-out" class="thc-report-out" readonly hidden></textarea>';

  mount.innerHTML = html;

  var rows = [].slice.call(mount.querySelectorAll('.thc-row'));

  function rowData(row) {
    var mode = row.dataset.mode;
    var a = num(row.querySelector('.thc-ina'));
    var b = num(row.querySelector('.thc-inb'));
    var mg = Math.round(contribution(mode, a, b));
    var name;
    if (row.classList.contains('thc-custom')) {
      var t = row.querySelector('.thc-ctext');
      name = (t && t.value.trim()) ? t.value.trim() : 'Other product';
    } else {
      name = row.querySelector('.thc-name').textContent.trim();
    }
    return { name: name, mode: mode, a: a, b: b, mg: mg };
  }

  function used(d) {
    return d.a > 0 && d.b > 0;
  }

  function recompute() {
    var total = 0;
    rows.forEach(function (row) {
      var d = rowData(row);
      row.querySelector('.thc-sub').textContent = d.mg + ' mg';
      row.classList.toggle('thc-has', used(d));
      total += d.mg;
    });
    document.getElementById('thc-total').textContent = total;

    var flags = document.getElementById('thc-flags');
    var msg = '';
    if (total === 0) {
      msg = '';
    } else if (total <= 10) {
      msg = '<span class="thc-flag thc-ok">~ a single standard retail serving (10 mg reference)</span>';
    } else if (total <= 100) {
      msg = '<span class="thc-flag thc-warn">Multiple servings &mdash; equals ' + (total / 10).toFixed(1) + ' standard 10 mg servings</span>';
    } else {
      msg = '<span class="thc-flag thc-high">High daily THC content &mdash; assess tolerance, CHS, and psychiatric risk</span>';
    }
    flags.innerHTML = msg;
    return total;
  }

  function fmt(n) { return n % 1 === 0 ? n : n.toFixed(1); }

  function buildReport() {
    var total = recompute();
    var lines = [];
    lines.push('24-HOUR THC INTAKE');
    lines.push('Date: ' + (window.ToolUtils ? ToolUtils.dateStamp() : new Date().toLocaleDateString()));
    lines.push('');
    var any = false;
    rows.forEach(function (row) {
      var d = rowData(row);
      if (used(d)) {
        any = true;
        if (d.mode === 'weight') {
          lines.push('- ' + d.name + ': ' + fmt(d.a) + ' g at ' + fmt(d.b) + '% THC = ' + d.mg + ' mg');
        } else {
          lines.push('- ' + d.name + ': ' + fmt(d.b) + ' x ' + fmt(d.a) + ' mg = ' + d.mg + ' mg');
        }
      }
    });
    if (!any) lines.push('- (no products entered)');
    lines.push('');
    lines.push('TOTAL: ~' + total + ' mg THC / 24 h  (~' + (total / 10).toFixed(1) + ' standard 10 mg servings)');
    lines.push('');
    lines.push('Context: Estimates total THC CONTENT consumed from product labels/typical');
    lines.push('potency, NOT the absorbed (bioavailable) dose, which is lower and varies by');
    lines.push('route. Reference serving = 10 mg THC; many states cap a retail package at');
    lines.push('100 mg. Flower is typically 15-25% THC; concentrates 60-90%.');
    return lines.join('\n');
  }

  mount.addEventListener('input', function (e) {
    if (e.target.classList.contains('thc-in')) recompute();
  });

  document.getElementById('thc-report').addEventListener('click', function () {
    var out = document.getElementById('thc-report-out');
    var text = buildReport();
    out.value = text; out.hidden = false;
    if (window.ToolUtils) ToolUtils.copyWithButton(text, this);
  });

  document.getElementById('thc-reset').addEventListener('click', function () {
    var run = function () {
      rows.forEach(function (row) {
        if (row.classList.contains('thc-custom')) {
          row.querySelector('.thc-ina').value = 0;
          row.querySelector('.thc-inb').value = 0;
          row.querySelector('.thc-ctext').value = '';
        } else if (row.dataset.mode === 'dose') {
          row.querySelector('.thc-inb').value = 0; // units -> 0
        } else {
          row.querySelector('.thc-ina').value = 0; // grams -> 0
        }
      });
      var out = document.getElementById('thc-report-out');
      out.value = ''; out.hidden = true;
      recompute();
    };
    if (window.ToolUtils) ToolUtils.confirmReset('Reset all THC entries?', run);
    else if (confirm('Reset all THC entries?')) run();
  });

  recompute();
})();

/**
 * alcohol-tool.js — 24-Hour Alcohol Intake Calculator (prefix: alc-)
 *
 * Clinician documents beverages consumed over 24 h; the tool converts each to
 * US standard drinks (14 g pure ethanol) and grams of ethanol, then sums.
 *
 * grams ethanol = volume(oz) x 29.5735 (mL/oz) x ABV/100 x 0.789 (g/mL)
 * standard drinks = grams ethanol / 14
 */
(function () {
  'use strict';

  var mount = document.getElementById('alc-container');
  if (!mount || mount.dataset.init) return;
  mount.dataset.init = '1';

  var ML_PER_OZ = 29.5735;
  var ETHANOL_DENSITY = 0.789;
  var GRAMS_PER_STD = 14;

  // [label, default oz, default ABV %]
  var PRODUCTS = [
    ['Regular beer', 12, 5.0],
    ['Light beer', 12, 4.2],
    ['Craft beer / IPA', 16, 7.0],
    ['Malt liquor', 12, 8.0],
    ['Hard seltzer', 12, 5.0],
    ['Wine (red / white)', 5, 12],
    ['Large wine pour', 8, 12],
    ['Fortified wine (port / sherry)', 3, 18],
    ['Champagne / sparkling', 5, 12],
    ['Liquor / spirits (shot)', 1.5, 40],
    ['Mixed drink (1 shot)', 1.5, 40],
    ['Cocktail (2 shots)', 3, 40]
  ];

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function num(el) {
    var v = parseFloat(el.value);
    return isFinite(v) && v > 0 ? v : 0;
  }
  function gramsFor(oz, abv) {
    return oz * ML_PER_OZ * (abv / 100) * ETHANOL_DENSITY;
  }

  var html = '';
  html += '<div class="alc-grid-head">'
    + '<span>Beverage</span><span>Volume</span><span>ABV</span>'
    + '<span>Qty (24 h)</span><span>Std drinks</span></div>';
  html += '<div class="alc-rows">';

  PRODUCTS.forEach(function (p, i) {
    html += '<div class="alc-row" data-i="' + i + '">'
      + '<span class="alc-name">' + esc(p[0]) + '</span>'
      + '<span class="alc-vol"><input type="number" min="0" step="0.5" class="alc-in alc-oz" value="' + p[1] + '"><em>oz</em></span>'
      + '<span class="alc-abv"><input type="number" min="0" step="0.1" class="alc-in alc-pct" value="' + p[2] + '"><em>%</em></span>'
      + '<span class="alc-qty"><input type="number" min="0" step="1" class="alc-in alc-count" value="0"></span>'
      + '<span class="alc-sub">0</span>'
      + '</div>';
  });
  html += '<div class="alc-row alc-custom">'
    + '<span class="alc-name"><input type="text" class="alc-in alc-ctext" placeholder="Other (describe)"></span>'
    + '<span class="alc-vol"><input type="number" min="0" step="0.5" class="alc-in alc-oz" value="0"><em>oz</em></span>'
    + '<span class="alc-abv"><input type="number" min="0" step="0.1" class="alc-in alc-pct" value="0"><em>%</em></span>'
    + '<span class="alc-qty"><input type="number" min="0" step="1" class="alc-in alc-count" value="0"></span>'
    + '<span class="alc-sub">0</span>'
    + '</div>';
  html += '</div>';

  html += '<div class="alc-total-bar">'
    + '<div class="alc-total-num"><span id="alc-total">0</span> <span class="alc-unit">std drinks</span></div>'
    + '<div class="alc-total-label"><span id="alc-grams">0</span> g ethanol / 24 h</div>'
    + '<div class="alc-flags" id="alc-flags"></div>'
    + '</div>';

  html += '<div class="alc-actions">'
    + '<button type="button" class="alc-btn alc-btn-primary" id="alc-report">Generate Report</button>'
    + '<button type="button" class="alc-btn alc-btn-ghost" id="alc-reset">Reset</button>'
    + '</div>';
  html += '<textarea id="alc-report-out" class="alc-report-out" readonly hidden></textarea>';

  mount.innerHTML = html;

  var rows = [].slice.call(mount.querySelectorAll('.alc-row'));

  function rowData(row) {
    var oz = num(row.querySelector('.alc-oz'));
    var abv = num(row.querySelector('.alc-pct'));
    var count = num(row.querySelector('.alc-count'));
    var grams = gramsFor(oz, abv) * count;
    var std = grams / GRAMS_PER_STD;
    var name;
    if (row.classList.contains('alc-custom')) {
      var t = row.querySelector('.alc-ctext');
      name = (t && t.value.trim()) ? t.value.trim() : 'Other';
    } else {
      name = row.querySelector('.alc-name').textContent.trim();
    }
    return { name: name, oz: oz, abv: abv, count: count, grams: grams, std: std };
  }

  function recompute() {
    var totalStd = 0, totalG = 0;
    rows.forEach(function (row) {
      var d = rowData(row);
      row.querySelector('.alc-sub').textContent = d.std ? d.std.toFixed(1) : '0';
      row.classList.toggle('alc-has', d.count > 0 && d.grams > 0);
      totalStd += d.std;
      totalG += d.grams;
    });
    document.getElementById('alc-total').textContent = totalStd.toFixed(1);
    document.getElementById('alc-grams').textContent = Math.round(totalG);

    var flags = document.getElementById('alc-flags');
    var msg = '';
    var s = totalStd;
    if (totalStd === 0) {
      msg = '';
    } else if (s <= 3) {
      msg = '<span class="alc-flag alc-ok">Within NIAAA daily low-risk limits (&le;3 women / &le;4 men)</span>';
    } else if (s < 5) {
      msg = '<span class="alc-flag alc-warn">At/near the daily ceiling &mdash; exceeds the limit for women (&le;3)</span>';
    } else {
      msg = '<span class="alc-flag alc-high">Binge-level intake (&ge;4 women / &ge;5 men) &mdash; exceeds low-risk limits</span>';
    }
    flags.innerHTML = msg;
    return { std: totalStd, grams: totalG };
  }

  function fmt(n) { return n % 1 === 0 ? n : n.toFixed(1); }

  function buildReport() {
    var t = recompute();
    var lines = [];
    lines.push('24-HOUR ALCOHOL INTAKE');
    lines.push('Date: ' + (window.ToolUtils ? ToolUtils.dateStamp() : new Date().toLocaleDateString()));
    lines.push('');
    var any = false;
    rows.forEach(function (row) {
      var d = rowData(row);
      if (d.count > 0 && d.grams > 0) {
        any = true;
        lines.push('- ' + d.name + ': ' + fmt(d.count) + ' x ' + fmt(d.oz) + ' oz at ' + fmt(d.abv)
          + '% = ' + d.std.toFixed(1) + ' std drinks (' + Math.round(d.grams) + ' g)');
      }
    });
    if (!any) lines.push('- (no beverages entered)');
    lines.push('');
    lines.push('TOTAL: ' + t.std.toFixed(1) + ' US standard drinks / 24 h  (~' + Math.round(t.grams) + ' g ethanol)');
    lines.push('');
    lines.push('Context: 1 US standard drink = 14 g pure ethanol (0.6 fl oz). NIAAA');
    lines.push('low-risk limits: men <=4/day & <=14/week; women <=3/day & <=7/week.');
    lines.push('Binge ~ >=5 (men) / >=4 (women) within ~2 h (approx 0.08 g/dL BAC).');
    return lines.join('\n');
  }

  mount.addEventListener('input', function (e) {
    if (e.target.classList.contains('alc-in')) recompute();
  });

  document.getElementById('alc-report').addEventListener('click', function () {
    var out = document.getElementById('alc-report-out');
    var text = buildReport();
    out.value = text; out.hidden = false;
    if (window.ToolUtils) ToolUtils.copyWithButton(text, this);
  });

  document.getElementById('alc-reset').addEventListener('click', function () {
    var run = function () {
      mount.querySelectorAll('.alc-count').forEach(function (el) { el.value = 0; });
      mount.querySelectorAll('.alc-ctext').forEach(function (el) { el.value = ''; });
      var out = document.getElementById('alc-report-out');
      out.value = ''; out.hidden = true;
      recompute();
    };
    if (window.ToolUtils) ToolUtils.confirmReset('Reset all alcohol entries?', run);
    else if (confirm('Reset all alcohol entries?')) run();
  });

  recompute();
})();

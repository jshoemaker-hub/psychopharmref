/**
 * caffeine-tool.js — 24-Hour Caffeine Intake Calculator (prefix: caf-)
 *
 * Clinician enters how many servings of each caffeine source a patient used
 * over a 24-hour period; the tool sums the estimated total caffeine (mg) and
 * generates a plain-text report for the EMR.
 *
 * Per-serving mg values are typical/average estimates and are EDITABLE, since
 * brands and brew strength vary widely.
 */
(function () {
  'use strict';

  var mount = document.getElementById('caf-container');
  if (!mount || mount.dataset.init) return;
  mount.dataset.init = '1';

  // [label, default mg per serving, serving descriptor]
  var PRODUCTS = [
    ['Brewed coffee', 95, '8 oz cup'],
    ['Brewed coffee', 140, '12 oz (tall)'],
    ['Brewed coffee', 190, '16 oz (grande)'],
    ['Espresso', 64, '1 shot'],
    ['Cold brew', 205, '16 oz'],
    ['Instant coffee', 62, '8 oz'],
    ['Decaf coffee', 3, '8 oz'],
    ['Black tea', 47, '8 oz'],
    ['Green tea', 28, '8 oz'],
    ['Matcha', 70, '8 oz'],
    ['Soft drink / cola', 34, '12 oz can'],
    ['Diet cola', 46, '12 oz can'],
    ['Energy drink', 80, '8.4 oz (small)'],
    ['Energy drink', 160, '16 oz (large)'],
    ['Energy shot', 200, '2 oz shot'],
    ['Pre-workout', 200, '1 scoop'],
    ['Caffeine tablet', 200, '200 mg tab'],
    ['Caffeine tablet', 100, '100 mg tab'],
    ['Dark chocolate', 24, '1 oz']
  ];

  var rows = [];

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function num(el) {
    var v = parseFloat(el.value);
    return isFinite(v) && v > 0 ? v : 0;
  }

  // Build the UI
  var html = '';
  html += '<div class="caf-grid-head">';
  html += '<span>Caffeine source</span><span>mg / serving</span><span>Servings (24 h)</span><span>Subtotal</span>';
  html += '</div>';
  html += '<div class="caf-rows">';
  PRODUCTS.forEach(function (p, i) {
    html += '<div class="caf-row" data-i="' + i + '">'
      + '<span class="caf-name">' + esc(p[0]) + ' <em>(' + esc(p[2]) + ')</em></span>'
      + '<span class="caf-mg"><input type="number" min="0" step="1" class="caf-in caf-permg" value="' + p[1] + '"> mg</span>'
      + '<span class="caf-qty"><input type="number" min="0" step="0.5" class="caf-in caf-servings" value="0"></span>'
      + '<span class="caf-sub">0 mg</span>'
      + '</div>';
  });
  // Custom row
  html += '<div class="caf-row caf-custom">'
    + '<span class="caf-name"><input type="text" class="caf-in caf-ctext" placeholder="Other source (describe)"></span>'
    + '<span class="caf-mg"><input type="number" min="0" step="1" class="caf-in caf-permg" value="0"> mg</span>'
    + '<span class="caf-qty"><input type="number" min="0" step="0.5" class="caf-in caf-servings" value="0"></span>'
    + '<span class="caf-sub">0 mg</span>'
    + '</div>';
  html += '</div>';

  html += '<div class="caf-total-bar">'
    + '<div class="caf-total-num"><span id="caf-total">0</span> mg</div>'
    + '<div class="caf-total-label">estimated total caffeine / 24 h</div>'
    + '<div class="caf-flags" id="caf-flags"></div>'
    + '</div>';

  html += '<div class="caf-actions">'
    + '<button type="button" class="caf-btn caf-btn-primary" id="caf-report">Generate Report</button>'
    + '<button type="button" class="caf-btn caf-btn-ghost" id="caf-reset">Reset</button>'
    + '</div>';
  html += '<textarea id="caf-report-out" class="caf-report-out" readonly hidden></textarea>';

  mount.innerHTML = html;

  rows = [].slice.call(mount.querySelectorAll('.caf-row'));

  function rowData(row) {
    var permg = num(row.querySelector('.caf-permg'));
    var servings = num(row.querySelector('.caf-servings'));
    var sub = Math.round(permg * servings);
    var nameEl = row.querySelector('.caf-name');
    var custom = row.classList.contains('caf-custom');
    var name;
    if (custom) {
      var t = row.querySelector('.caf-ctext');
      name = (t && t.value.trim()) ? t.value.trim() : 'Other source';
    } else {
      name = nameEl.textContent.trim();
    }
    return { name: name, permg: permg, servings: servings, sub: sub };
  }

  function recompute() {
    var total = 0;
    rows.forEach(function (row) {
      var d = rowData(row);
      row.querySelector('.caf-sub').textContent = d.sub + ' mg';
      row.classList.toggle('caf-has', d.servings > 0);
      total += d.sub;
    });
    document.getElementById('caf-total').textContent = total;

    var flags = document.getElementById('caf-flags');
    var msg = '';
    if (total === 0) {
      msg = '';
    } else if (total <= 400) {
      msg = '<span class="caf-flag caf-ok">Within the 400 mg/day ceiling cited for healthy adults</span>';
    } else if (total <= 600) {
      msg = '<span class="caf-flag caf-warn">Above 400 mg/day &mdash; anxiety, insomnia, palpitations more likely</span>';
    } else {
      msg = '<span class="caf-flag caf-high">High intake (&gt;600 mg/day) &mdash; review for caffeine use / toxicity risk</span>';
    }
    flags.innerHTML = msg;
    return total;
  }

  function buildReport() {
    var total = recompute();
    var lines = [];
    lines.push('24-HOUR CAFFEINE INTAKE');
    lines.push('Date: ' + (window.ToolUtils ? ToolUtils.dateStamp() : new Date().toLocaleDateString()));
    lines.push('');
    var any = false;
    rows.forEach(function (row) {
      var d = rowData(row);
      if (d.servings > 0) {
        any = true;
        lines.push('- ' + d.name + ': ' + (d.servings % 1 === 0 ? d.servings : d.servings.toFixed(1))
          + ' x ' + d.permg + ' mg = ' + d.sub + ' mg');
      }
    });
    if (!any) lines.push('- (no sources entered)');
    lines.push('');
    lines.push('TOTAL: ~' + total + ' mg caffeine / 24 h');
    lines.push('');
    lines.push('Context: Up to 400 mg/day is generally cited as safe for healthy adults');
    lines.push('(FDA); <200 mg/day is the commonly cited limit in pregnancy. Doses');
    lines.push('approaching ~1200 mg have been associated with toxic effects. Totals are');
    lines.push('estimates based on typical serving content and may vary by brand/brew.');
    return lines.join('\n');
  }

  mount.addEventListener('input', function (e) {
    if (e.target.classList.contains('caf-in')) recompute();
  });

  document.getElementById('caf-report').addEventListener('click', function () {
    var out = document.getElementById('caf-report-out');
    var text = buildReport();
    out.value = text;
    out.hidden = false;
    if (window.ToolUtils) ToolUtils.copyWithButton(text, this);
  });

  document.getElementById('caf-reset').addEventListener('click', function () {
    var run = function () {
      mount.querySelectorAll('.caf-servings').forEach(function (el) { el.value = 0; });
      mount.querySelectorAll('.caf-ctext').forEach(function (el) { el.value = ''; });
      var out = document.getElementById('caf-report-out');
      out.value = ''; out.hidden = true;
      recompute();
    };
    if (window.ToolUtils) ToolUtils.confirmReset('Reset all caffeine entries?', run);
    else if (confirm('Reset all caffeine entries?')) run();
  });

  recompute();
})();

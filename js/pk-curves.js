(function(){
        'use strict';

        /* ── Color palettes by category — maximally distinct within each group ─── */
        var COLORS = {
          Antidepressant:   ['#1565C0','#E91E63','#00897B','#FF6F00','#6A1B9A','#2E7D32','#C62828','#00ACC1'],
          Antipsychotic:    ['#D32F2F','#1976D2','#F57C00','#388E3C','#7B1FA2','#00838F','#C2185B','#AFB42B'],
          Anxiolytic:       ['#7B1FA2','#E65100','#0277BD','#2E7D32','#AD1457','#F9A825','#00695C','#4527A0'],
          'Mood Stabilizer':['#2E7D32','#C62828','#1565C0','#F57C00','#6A1B9A','#00838F','#AD1457','#827717'],
          Sleep:            ['#283593','#C62828','#00695C','#E65100','#6A1B9A','#0277BD','#AD1457','#33691E'],
          Stimulant:        ['#E65100','#1565C0','#2E7D32','#AD1457','#00838F','#C62828','#6A1B9A','#F9A825'],
          Other:            ['#546E7A','#8D6E63','#37474F','#6D4C41','#78909C','#795548','#455A64','#A1887F']
        };

        var drugs = [];          // processed med objects
        var picked = [];         // array of drug ids currently selected
        var hidden = {};         // id → true if toggled off in legend
        var colorOf = {};        // id → hex color
        var zoomFactor = 1;

        /* ── DOM refs ─── */
        var catSel   = document.getElementById('pk-cat-sel');
        var timeSel  = document.getElementById('pk-time-sel');
        var grid     = document.getElementById('pk-drug-grid');
        var cv       = document.getElementById('pk-cv');
        var gfx      = cv.getContext('2d');
        var box      = document.getElementById('pk-graph-box');
        var legRow   = document.getElementById('pk-legend-row');
        var tip      = document.getElementById('pk-tip');

        /* ── Helpers ─── */
        function parseHL(obj) {
          if (!obj || !obj.drug) return null;
          var s = obj.drug;
          // Try to get the first number
          var m = s.match(/([\d.]+)/);
          if (!m) return null;
          var v = parseFloat(m[1]);
          if (/day/i.test(s)) v *= 24;
          return v > 0 ? v : null;
        }

        function primaryRec(ki) {
          if (!ki) return null;
          var best = null, bestVal = Infinity;
          for (var r in ki) {
            if (typeof ki[r] === 'number' && ki[r] < bestVal) { bestVal = ki[r]; best = r; }
          }
          return best ? { name: best, ki: bestVal } : null;
        }

        /* Bateman equation: C(t) = A * (e^(-ke*t) - e^(-ka*t)) */
        /* Solve for ka so the curve peaks exactly at tmax using Newton's method */
        function solveKa(tmax, ke) {
          if (tmax <= 0 || ke <= 0) return 5 * ke;
          var ka = 5 * ke; // initial guess: ka much larger than ke
          for (var i = 0; i < 50; i++) {
            var diff = ka - ke;
            if (Math.abs(diff) < 1e-10) { ka = ke * 1.01; continue; }
            var f = Math.log(ka / ke) / diff - tmax;
            var fp = (1 / ka * diff - Math.log(ka / ke)) / (diff * diff);
            if (Math.abs(fp) < 1e-15) break;
            var step = f / fp;
            ka = ka - step;
            if (ka <= ke) ka = ke * 1.5; // keep ka > ke
            if (Math.abs(f) < 0.001) break;
          }
          return ka > ke ? ka : ke * 3;
        }

        function batemanCurve(tmax, halfLife, numPoints, tEnd) {
          var ke = Math.log(2) / halfLife;         // elimination rate
          var ka = solveKa(tmax, ke);              // absorption rate → peaks at tmax
          var pts = [];
          // First find peak value for normalization
          var peakVal = 0;
          for (var i = 0; i <= numPoints; i++) {
            var t = (i / numPoints) * tEnd;
            var c = (ka / (ka - ke)) * (Math.exp(-ke * t) - Math.exp(-ka * t));
            if (c > peakVal) peakVal = c;
          }
          // Now build normalized points
          for (var i = 0; i <= numPoints; i++) {
            var t = (i / numPoints) * tEnd;
            var c = (ka / (ka - ke)) * (Math.exp(-ke * t) - Math.exp(-ka * t));
            pts.push({ t: t, c: peakVal > 0 ? c / peakVal : 0 });
          }
          return pts;
        }

        function peakPct(ki) {
          // Lower Ki = stronger binding = taller peak
          if (!ki || ki >= 10000) return 15;
          return Math.min(100, Math.max(15, 100 * (1 - Math.log10(Math.max(0.01, ki)) / 4)));
        }

        /* ── Load meds ─── */
        function loadMeds() {
          if (typeof MEDICATIONS === 'undefined') return;
          drugs = [];
          MEDICATIONS.forEach(function(m) {
            var hl = parseHL(m.halfLife);
            if (!m.tmax || !hl || !m.receptorKi) return;
            var pr = primaryRec(m.receptorKi);
            drugs.push({
              id: m.id, name: m.name, brand: m.brandName,
              cat: m.category, cls: m.class,
              tmax: m.tmax, hl: hl,
              pr: pr, peak: peakPct(pr ? pr.ki : 10000)
            });
          });
          drugs.sort(function(a,b){ return a.name.localeCompare(b.name); });
        }

        /* ── Populate checkbox grid ─── */
        function fillGrid() {
          var cat = catSel.value;
          var list = cat ? drugs.filter(function(d){ return d.cat === cat; }) : drugs;
          grid.innerHTML = '';
          list.forEach(function(d) {
            var lbl = document.createElement('label');
            var cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.value = d.id;
            cb.checked = picked.indexOf(d.id) >= 0;
            cb.addEventListener('change', function() {
              if (cb.checked) {
                if (picked.length >= 8) { cb.checked = false; return; }
                picked.push(d.id);
                assignColor(d);
              } else {
                picked = picked.filter(function(x){ return x !== d.id; });
                delete hidden[d.id];
              }
              buildLegend();
              render();
            });
            lbl.appendChild(cb);
            lbl.appendChild(document.createTextNode(' ' + d.name));
            grid.appendChild(lbl);
          });
        }

        function assignColor(d) {
          if (colorOf[d.id]) return;
          var pal = COLORS[d.cat] || COLORS.Other;
          var idx = picked.filter(function(pid) {
            var dd = drugs.find(function(x){ return x.id === pid; });
            return dd && dd.cat === d.cat;
          }).length - 1;
          colorOf[d.id] = pal[idx % pal.length];
        }

        /* ── Legend ─── */
        function buildLegend() {
          legRow.innerHTML = '';
          picked.forEach(function(id) {
            var d = drugs.find(function(x){ return x.id === id; });
            if (!d) return;
            var el = document.createElement('div');
            el.className = 'pk-leg' + (hidden[id] ? ' dimmed' : '');
            el.innerHTML = '<div class="pk-leg-swatch" style="background:' + (colorOf[id]||'#999') + '"></div>' +
              '<span class="pk-leg-name">' + d.name + '</span>' +
              '<span class="pk-leg-detail">Tmax ' + d.tmax + 'h &middot; t&frac12; ' + d.hl.toFixed(1) + 'h' +
              (d.pr ? ' &middot; ' + d.pr.name : '') + '</span>';
            el.addEventListener('click', function() {
              hidden[id] = !hidden[id];
              el.classList.toggle('dimmed');
              render();
            });
            legRow.appendChild(el);
          });
        }

        /* ── Resize canvas ─── */
        function sizeCanvas() {
          var w = box.clientWidth;
          var h = Math.max(340, Math.min(500, w * 0.48));
          var dpr = window.devicePixelRatio || 1;
          cv.width = w * dpr;
          cv.height = h * dpr;
          cv.style.width = w + 'px';
          cv.style.height = h + 'px';
          gfx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        /* ── Render ─── */
        function render() {
          sizeCanvas();
          var W = box.clientWidth;
          var H = parseInt(cv.style.height);
          var pad = { t: 30, r: 20, b: 44, l: 56 };
          var gW = W - pad.l - pad.r;
          var gH = H - pad.t - pad.b;

          // Clear
          gfx.fillStyle = '#fefdfb';
          gfx.fillRect(0, 0, W, H);

          // Determine max time
          var maxT = 0;
          picked.forEach(function(id) {
            var d = drugs.find(function(x){ return x.id === id; });
            if (d && !hidden[id]) maxT = Math.max(maxT, d.tmax + d.hl * 2.5);
          });
          var tVal = parseFloat(timeSel.value);
          if (tVal > 0) maxT = tVal;
          if (maxT <= 0) maxT = 24;
          maxT = maxT / zoomFactor;

          // No drugs selected message
          if (picked.length === 0) {
            gfx.fillStyle = '#bbb';
            gfx.font = '15px sans-serif';
            gfx.textAlign = 'center';
            gfx.fillText('Select medications above to compare PK curves', W/2, H/2);
            drawAxes(W, H, pad, gW, gH, maxT);
            return;
          }

          drawAxes(W, H, pad, gW, gH, maxT);

          // Draw each curve
          picked.forEach(function(id) {
            if (hidden[id]) return;
            var d = drugs.find(function(x){ return x.id === id; });
            if (!d) return;
            var col = colorOf[id] || '#999';
            var pts = batemanCurve(d.tmax, d.hl, 300, maxT);
            var scale = d.peak / 100;

            // Line
            gfx.save();
            gfx.beginPath();
            pts.forEach(function(p, i) {
              var x = pad.l + (p.t / maxT) * gW;
              var y = pad.t + gH - (p.c * scale) * gH;
              if (i === 0) gfx.moveTo(x, y); else gfx.lineTo(x, y);
            });
            gfx.strokeStyle = col;
            gfx.lineWidth = 2.5;
            gfx.globalAlpha = 0.85;
            gfx.stroke();

            // Fill under curve
            gfx.lineTo(pad.l + gW, pad.t + gH);
            gfx.lineTo(pad.l, pad.t + gH);
            gfx.closePath();
            gfx.fillStyle = col;
            gfx.globalAlpha = 0.08;
            gfx.fill();
            gfx.restore();

            // Half-life dot
            var dotT = d.tmax + d.hl;
            if (dotT <= maxT) {
              var ke2 = Math.log(2) / d.hl;
              var ka2 = solveKa(d.tmax, ke2);
              var cDot = (ka2 / (ka2 - ke2)) * (Math.exp(-ke2 * dotT) - Math.exp(-ka2 * dotT));
              // Normalize
              var cPeak = 0;
              for (var tt = 0; tt < maxT; tt += 0.1) {
                var cc = (ka2 / (ka2 - ke2)) * (Math.exp(-ke2 * tt) - Math.exp(-ka2 * tt));
                if (cc > cPeak) cPeak = cc;
              }
              var cNorm = cPeak > 0 ? cDot / cPeak : 0;
              var dx = pad.l + (dotT / maxT) * gW;
              var dy = pad.t + gH - (cNorm * scale) * gH;
              gfx.beginPath();
              gfx.arc(dx, dy, 5, 0, Math.PI * 2);
              gfx.fillStyle = col;
              gfx.fill();
              gfx.strokeStyle = '#fff';
              gfx.lineWidth = 2;
              gfx.stroke();
            }
          });
        }

        function drawAxes(W, H, pad, gW, gH, maxT) {
          gfx.strokeStyle = '#cfc8ba';
          gfx.lineWidth = 1;

          // X-axis
          gfx.beginPath();
          gfx.moveTo(pad.l, pad.t + gH);
          gfx.lineTo(pad.l + gW, pad.t + gH);
          gfx.stroke();

          // Y-axis
          gfx.beginPath();
          gfx.moveTo(pad.l, pad.t);
          gfx.lineTo(pad.l, pad.t + gH);
          gfx.stroke();

          // Grid + labels
          gfx.font = '11px sans-serif';
          gfx.fillStyle = '#999';

          // Y gridlines (0-100%)
          gfx.textAlign = 'right';
          for (var pct = 0; pct <= 100; pct += 20) {
            var y = pad.t + gH - (pct / 100) * gH;
            gfx.fillText(pct + '%', pad.l - 8, y + 4);
            if (pct > 0 && pct < 100) {
              gfx.strokeStyle = '#eae6df';
              gfx.lineWidth = 0.5;
              gfx.beginPath();
              gfx.moveTo(pad.l + 1, y);
              gfx.lineTo(pad.l + gW, y);
              gfx.stroke();
            }
          }

          // X gridlines
          gfx.textAlign = 'center';
          var step = maxT <= 6 ? 1 : maxT <= 12 ? 2 : maxT <= 24 ? 4 : maxT <= 48 ? 6 : maxT <= 72 ? 12 : 24;
          for (var t = 0; t <= maxT; t += step) {
            var x = pad.l + (t / maxT) * gW;
            var label = t < 24 ? t + 'h' : (t % 24 === 0 ? (t/24) + 'd' : t + 'h');
            gfx.fillText(label, x, pad.t + gH + 18);
            if (t > 0) {
              gfx.strokeStyle = '#eae6df';
              gfx.lineWidth = 0.5;
              gfx.beginPath();
              gfx.moveTo(x, pad.t);
              gfx.lineTo(x, pad.t + gH);
              gfx.stroke();
            }
          }

          // Axis titles
          gfx.fillStyle = '#666';
          gfx.font = 'bold 12px sans-serif';
          gfx.textAlign = 'center';
          gfx.fillText('Time', pad.l + gW / 2, H - 6);
          gfx.save();
          gfx.translate(14, pad.t + gH / 2);
          gfx.rotate(-Math.PI / 2);
          gfx.fillText('Relative Concentration', 0, 0);
          gfx.restore();
        }

        /* ── Tooltip on hover ─── */
        cv.addEventListener('mousemove', function(e) {
          var rect = cv.getBoundingClientRect();
          var mx = e.clientX - rect.left;
          var my = e.clientY - rect.top;
          var W = box.clientWidth;
          var H = parseInt(cv.style.height);
          var pad = { t: 30, r: 20, b: 44, l: 56 };
          var gW = W - pad.l - pad.r;
          var gH = H - pad.t - pad.b;

          var maxT = 0;
          picked.forEach(function(id) {
            var d = drugs.find(function(x){ return x.id === id; });
            if (d && !hidden[id]) maxT = Math.max(maxT, d.tmax + d.hl * 2.5);
          });
          var tVal = parseFloat(timeSel.value);
          if (tVal > 0) maxT = tVal;
          if (maxT <= 0) maxT = 24;
          maxT = maxT / zoomFactor;

          if (mx < pad.l || mx > W - pad.r || my < pad.t || my > pad.t + gH) {
            tip.style.display = 'none'; return;
          }

          var tHover = ((mx - pad.l) / gW) * maxT;
          var lines = [];
          picked.forEach(function(id) {
            if (hidden[id]) return;
            var d = drugs.find(function(x){ return x.id === id; });
            if (!d) return;
            var ke = Math.log(2) / d.hl;
            var ka = solveKa(d.tmax, ke);
            var c = (ka / (ka - ke)) * (Math.exp(-ke * tHover) - Math.exp(-ka * tHover));
            // Normalize
            var cPeak = 0;
            for (var tt = 0; tt < maxT; tt += 0.1) {
              var cc = (ka / (ka - ke)) * (Math.exp(-ke * tt) - Math.exp(-ka * tt));
              if (cc > cPeak) cPeak = cc;
            }
            var pct = cPeak > 0 ? (c / cPeak) * d.peak : 0;
            if (pct < 0) pct = 0;
            lines.push('<span style="color:' + (colorOf[id]||'#999') + '">\u25CF</span> ' +
              d.name + ': ' + pct.toFixed(1) + '%');
          });

          if (lines.length === 0) { tip.style.display = 'none'; return; }
          tip.innerHTML = '<strong>t = ' + tHover.toFixed(1) + 'h</strong><br>' + lines.join('<br>');
          tip.style.display = 'block';
          var tipX = mx + 14;
          var tipY = my - 10;
          if (tipX + 200 > W) tipX = mx - 200;
          if (tipY < 0) tipY = 10;
          tip.style.left = tipX + 'px';
          tip.style.top = tipY + 'px';
        });

        cv.addEventListener('mouseleave', function() { tip.style.display = 'none'; });

        /* ── Zoom ─── */
        cv.addEventListener('wheel', function(e) {
          e.preventDefault();
          var delta = e.deltaY < 0 ? 1.15 : 0.87;
          zoomFactor = Math.max(0.3, Math.min(5, zoomFactor * delta));
          render();
        }, { passive: false });

        /* ── Events ─── */
        catSel.addEventListener('change', fillGrid);
        timeSel.addEventListener('change', render);
        document.getElementById('pk-clear').addEventListener('click', function() {
          picked = []; hidden = {}; colorOf = {};
          grid.querySelectorAll('input').forEach(function(cb){ cb.checked = false; });
          buildLegend(); render();
        });
        document.getElementById('pk-top5').addEventListener('click', function() {
          picked = []; hidden = {}; colorOf = {};
          var cat = catSel.value;
          var list = cat ? drugs.filter(function(d){ return d.cat === cat; }) : drugs;
          list.slice(0, 5).forEach(function(d) {
            picked.push(d.id);
            assignColor(d);
          });
          fillGrid(); buildLegend(); render();
        });
        document.getElementById('pk-zoom-reset').addEventListener('click', function() {
          zoomFactor = 1; render();
        });
        window.addEventListener('resize', render);

        /* ── Deferred init ─── */
        function go() {
          if (typeof MEDICATIONS === 'undefined') return false;
          loadMeds();
          if (drugs.length === 0) return false;
          fillGrid();
          render();
          return true;
        }

        if (!go()) {
          // Poll until data.js is loaded
          var iv = setInterval(function() {
            if (go()) clearInterval(iv);
          }, 150);
          // Safety timeout
          setTimeout(function() { clearInterval(iv); }, 15000);
        }
      })();

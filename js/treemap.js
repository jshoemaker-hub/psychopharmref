(function(){
        /* ── Treemap: Squarified Layout ─── */
        /* Each drug gets a tile sized by its total pKi across active receptors.
           Color = receptor with the highest pKi for that drug.
           Hover shows full receptor breakdown. */

        var RECEPTOR_COLORS_TM = {
          SERT:'#2196F3', NET:'#00897B', DAT:'#FF9800', '5HT1A':'#9C27B0',
          '5HT2A':'#E91E63', '5HT2C':'#F06292', D1:'#F44336', D2:'#D32F2F',
          D3:'#C62828', H1:'#795548', alpha1:'#607D8B', alpha2:'#78909C', M1:'#FF7043'
        };

        function getReceptorColorTM(r) { return RECEPTOR_COLORS_TM[r] || '#888'; }

        /* Squarified treemap algorithm */
        function squarify(items, rect) {
          if (!items.length) return [];
          var results = [];
          layoutStrip(items.slice().sort(function(a,b){ return b.value - a.value; }), rect, results);
          return results;
        }

        function layoutStrip(items, rect, results) {
          if (items.length === 0) return;
          if (items.length === 1) {
            results.push({ item: items[0], x: rect.x, y: rect.y, w: rect.w, h: rect.h });
            return;
          }

          var total = items.reduce(function(s, i){ return s + i.value; }, 0);
          if (total <= 0) return;

          var isWide = rect.w >= rect.h;
          var side = isWide ? rect.h : rect.w;
          var strip = [];
          var stripSum = 0;
          var bestAR = Infinity;

          for (var i = 0; i < items.length; i++) {
            strip.push(items[i]);
            stripSum += items[i].value;
            var stripW = (stripSum / total) * (isWide ? rect.w : rect.h);
            var worstAR = 0;
            var runSum = 0;
            for (var j = 0; j < strip.length; j++) {
              runSum += strip[j].value;
              var itemH = (strip[j].value / stripSum) * side;
              var ar = Math.max(stripW / itemH, itemH / stripW);
              if (ar > worstAR) worstAR = ar;
            }
            if (worstAR > bestAR && strip.length > 1) {
              strip.pop();
              stripSum -= items[i].value;
              break;
            }
            bestAR = worstAR;
          }

          // Lay out the strip
          var stripFrac = stripSum / total;
          var stripDim = isWide ? rect.w * stripFrac : rect.h * stripFrac;
          var offset = 0;
          strip.forEach(function(it) {
            var frac = it.value / stripSum;
            var itemDim = side * frac;
            if (isWide) {
              results.push({ item: it, x: rect.x, y: rect.y + offset, w: stripDim, h: itemDim });
            } else {
              results.push({ item: it, x: rect.x + offset, y: rect.y, w: itemDim, h: stripDim });
            }
            offset += itemDim;
          });

          // Recurse for remaining items
          var remaining = items.slice(strip.length);
          var newRect;
          if (isWide) {
            newRect = { x: rect.x + stripDim, y: rect.y, w: rect.w - stripDim, h: rect.h };
          } else {
            newRect = { x: rect.x, y: rect.y + stripDim, w: rect.w, h: rect.h - stripDim };
          }
          layoutStrip(remaining, newRect, results);
        }

        /* ── Render Treemap (nested: drug → receptor sub-tiles) ─── */
        window.renderTreemap = function() {
          var container = document.getElementById('treemap-container');
          container.innerHTML = '';
          container.style.position = 'relative';

          var cls = document.getElementById('class-select').value;
          var meds = MEDICATIONS.filter(function(m){ return m.class === cls && m.receptorKi; });
          var activeRec = activeReceptors;

          if (!meds.length) {
            container.innerHTML = '<div style="padding:40px;text-align:center;color:#999;">No receptor data for this class.</div>';
            return;
          }

          // Build items: each drug with receptor breakdown
          var items = [];
          meds.forEach(function(m) {
            var totalPki = 0;
            var breakdown = [];
            RECEPTOR_LIST.forEach(function(r) {
              if (!activeRec.has(r)) return;
              var ki = m.receptorKi[r];
              if (ki && ki < 10000) {
                var pki = 9 - Math.log10(ki);
                totalPki += pki;
                breakdown.push({ r: r, pki: pki, ki: ki, action: getReceptorAction(m.id, r), value: pki });
              }
            });
            if (totalPki > 0) {
              breakdown.sort(function(a,b){ return b.pki - a.pki; });
              items.push({ id: m.id, name: m.name, value: totalPki, breakdown: breakdown });
            }
          });

          if (!items.length) {
            container.innerHTML = '<div style="padding:40px;text-align:center;color:#999;">No significant binding for selected receptors.</div>';
            return;
          }

          var W = container.clientWidth || 800;
          var H = 460;
          container.style.height = H + 'px';

          // Outer treemap: one tile per drug
          var drugTiles = squarify(items, { x: 0, y: 0, w: W, h: H });

          drugTiles.forEach(function(tile) {
            var it = tile.item;
            var el = document.createElement('div');
            el.className = 'rb-tm-drug';
            el.style.cssText = 'left:' + tile.x + 'px;top:' + tile.y + 'px;width:' + tile.w + 'px;height:' + tile.h + 'px;background:#e8e4dc;';

            // Drug name label bar at top
            var labelH = 18;
            if (tile.w > 40 && tile.h > 30) {
              var label = document.createElement('div');
              label.className = 'rb-tm-drug-label';
              var nameSpan = document.createElement('span');
              nameSpan.className = 'rb-tm-drug-name';
              nameSpan.textContent = it.name;
              if (tile.w < 80) nameSpan.style.fontSize = '9px';
              label.appendChild(nameSpan);
              el.appendChild(label);
            } else {
              labelH = 0;
            }

            // Inner treemap: receptor sub-tiles within the drug tile
            var innerRect = { x: 0, y: labelH, w: tile.w - 4, h: tile.h - labelH - 4 };
            if (innerRect.w > 4 && innerRect.h > 4 && it.breakdown.length > 0) {
              var subTiles = squarify(it.breakdown, innerRect);
              subTiles.forEach(function(sub) {
                var rec = sub.item;
                var recEl = document.createElement('div');
                recEl.className = 'rb-tm-rec';
                recEl.style.cssText = 'left:' + (sub.x + 2) + 'px;top:' + (sub.y + 2) + 'px;width:' + sub.w + 'px;height:' + sub.h + 'px;background:' + getReceptorColorTM(rec.r) + ';';

                // Show receptor name if sub-tile is big enough
                if (sub.w > 28 && sub.h > 18) {
                  var rName = document.createElement('div');
                  rName.className = 'rb-tm-rec-name';
                  rName.textContent = rec.r;
                  if (sub.w < 44 || sub.h < 24) rName.style.fontSize = '7.5px';
                  recEl.appendChild(rName);

                  // Show pKi value if there's room
                  if (sub.w > 38 && sub.h > 30) {
                    var rVal = document.createElement('div');
                    rVal.className = 'rb-tm-rec-val';
                    rVal.textContent = rec.pki.toFixed(1);
                    recEl.appendChild(rVal);
                  }
                }
                el.appendChild(recEl);
              });
            }

            // Tooltip on hover (on the drug tile)
            el.addEventListener('mouseenter', function(e) {
              var existing = container.querySelector('.rb-tm-tooltip');
              if (existing) existing.remove();
              var tip = document.createElement('div');
              tip.className = 'rb-tm-tooltip';
              var html = '<strong>' + it.name + '</strong><br>';
              it.breakdown.forEach(function(b) {
                html += '<span style="color:' + getReceptorColorTM(b.r) + '">\u25CF</span> ' +
                  b.r + ': pKi ' + b.pki.toFixed(2) + ' (Ki ' + b.ki + ' nM) \u2014 ' + b.action + '<br>';
              });
              html += '<em style="color:#ccc">Total pKi: ' + it.value.toFixed(2) + '</em>';
              tip.innerHTML = html;
              // Position tooltip to the right or left of the tile
              var tipLeft = tile.x + tile.w + 8;
              if (tipLeft + 280 > W) tipLeft = tile.x - 280;
              if (tipLeft < 0) tipLeft = 4;
              tip.style.left = tipLeft + 'px';
              tip.style.top = Math.max(0, tile.y) + 'px';
              container.appendChild(tip);
            });
            el.addEventListener('mouseleave', function() {
              var existing = container.querySelector('.rb-tm-tooltip');
              if (existing) existing.remove();
            });

            container.appendChild(el);
          });

          // Legend
          var legEl = document.getElementById('rb-tm-legend');
          legEl.innerHTML = '';
          var usedReceptors = {};
          items.forEach(function(it) {
            it.breakdown.forEach(function(b) { usedReceptors[b.r] = true; });
          });
          RECEPTOR_LIST.forEach(function(r) {
            if (!usedReceptors[r] || !activeRec.has(r)) return;
            var item = document.createElement('div');
            item.className = 'rb-tm-leg-item';
            item.innerHTML = '<div class="rb-tm-leg-swatch" style="background:' + getReceptorColorTM(r) + '"></div>' + r;
            legEl.appendChild(item);
          });
        };

        /* ── View Toggle ─── */
        window.switchRBView = function(view) {
          var barWrap = document.getElementById('bar-chart-wrap');
          var treeWrap = document.getElementById('treemap-wrap');
          var btnBar = document.getElementById('rb-view-bar');
          var btnTree = document.getElementById('rb-view-tree');

          if (view === 'tree') {
            barWrap.style.display = 'none';
            treeWrap.style.display = '';
            btnBar.classList.remove('rb-vt-active');
            btnTree.classList.add('rb-vt-active');
            renderTreemap();
          } else {
            barWrap.style.display = '';
            treeWrap.style.display = 'none';
            btnTree.classList.remove('rb-vt-active');
            btnBar.classList.add('rb-vt-active');
            renderBarChart();
          }
        };

        /* Hook into class-select and receptor toggle changes to update treemap */
        var origToggle = window.toggleReceptor;
        window.toggleReceptor = function(receptor, btn) {
          origToggle(receptor, btn);
          if (document.getElementById('treemap-wrap').style.display !== 'none') {
            renderTreemap();
          }
        };
        document.getElementById('class-select').addEventListener('change', function() {
          if (document.getElementById('treemap-wrap').style.display !== 'none') {
            setTimeout(renderTreemap, 50);
          }
        });
      })();

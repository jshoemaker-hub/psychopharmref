
    (function(){
      // ============================================================
      // TAB SWITCHING
      // ============================================================
      document.querySelectorAll('.yb-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const tab = btn.dataset.tab;

          // Remove active from all buttons and contents
          document.querySelectorAll('.yb-tab-btn').forEach(b => b.classList.remove('yb-active'));
          document.querySelectorAll('.yb-tab-content').forEach(c => c.classList.remove('yb-active'));

          // Add active to clicked button and corresponding content
          btn.classList.add('yb-active');
          document.getElementById(`yb-tab-${tab}`).classList.add('yb-active');
        });
      });

      // ============================================================
      // SCORING - SEVERITY SCALE TAB
      // ============================================================
      const items = {
        obs: ['1', '2', '3', '4', '5'],
        comp: ['6', '7', '8', '9', '10'],
        supp: ['1b', '6b'],
        invest: ['11', '12', '13', '14', '15', '16', '17', '18', '19']
      };

      function getSelectedValue(itemNum) {
        const radio = document.querySelector(`input[name="yb-item-${itemNum}"]:checked`);
        return radio ? parseInt(radio.value) : 0;
      }

      function updateScores() {
        // Obsession subtotal (items 1-5)
        const obsScores = items.obs.map(num => getSelectedValue(num));
        const obsSubtotal = obsScores.reduce((a, b) => a + b, 0);
        document.getElementById('yb-obs-subtotal').textContent = obsSubtotal;

        // Compulsion subtotal (items 6-10)
        const compScores = items.comp.map(num => getSelectedValue(num));
        const compSubtotal = compScores.reduce((a, b) => a + b, 0);
        document.getElementById('yb-comp-subtotal').textContent = compSubtotal;

        // Total (items 1-10)
        const total = obsSubtotal + compSubtotal;
        document.getElementById('yb-total-score').textContent = total;

        // Severity level
        let severity = 'Subclinical';
        if (total >= 8 && total <= 15) severity = 'Mild';
        else if (total >= 16 && total <= 23) severity = 'Moderate';
        else if (total >= 24 && total <= 31) severity = 'Severe';
        else if (total >= 32) severity = 'Extreme';

        document.getElementById('yb-severity-badge').textContent = severity;
      }

      // Add listeners to all radio buttons
      document.querySelectorAll('input[type="radio"][name^="yb-item-"]').forEach(radio => {
        radio.addEventListener('change', updateScores);
      });

      // ============================================================
      // GENERATE REPORT & COPY
      // ============================================================
      document.getElementById('yb-generate-btn').addEventListener('click', () => {
        const obsSubtotal = parseInt(document.getElementById('yb-obs-subtotal').textContent);
        const compSubtotal = parseInt(document.getElementById('yb-comp-subtotal').textContent);
        const totalScore = parseInt(document.getElementById('yb-total-score').textContent);
        const severity = document.getElementById('yb-severity-badge').textContent;

        // Get individual item scores
        const obsItems = {};
        items.obs.forEach(num => {
          obsItems[num] = getSelectedValue(num);
        });

        const compItems = {};
        items.comp.forEach(num => {
          compItems[num] = getSelectedValue(num);
        });

        const suppItems = {};
        items.supp.forEach(num => {
          suppItems[num] = getSelectedValue(num);
        });

        const investItems = {};
        items.invest.forEach(num => {
          investItems[num] = getSelectedValue(num);
        });

        // Get symptom checklist data
        const obsessionsCurrentList = [];
        const obsessionsPastList = [];
        const compulsionsCurrentList = [];
        const compulsionsPastList = [];

        document.querySelectorAll('input[type="checkbox"][class^="yb-obs-"]').forEach(cb => {
          if (cb.checked) {
            const label = cb.closest('.yb-checklist-item').querySelector('.yb-checklist-label').textContent.trim();
            if (cb.dataset.type === 'current') obsessionsCurrentList.push(label);
            else obsessionsPastList.push(label);
          }
        });

        document.querySelectorAll('input[type="checkbox"][class^="yb-comp-"]').forEach(cb => {
          if (cb.checked) {
            const label = cb.closest('.yb-checklist-item').querySelector('.yb-checklist-label').textContent.trim();
            if (cb.dataset.type === 'current') compulsionsCurrentList.push(label);
            else compulsionsPastList.push(label);
          }
        });

        const today = new Date().toISOString().split('T')[0];

        const report = `Yale-Brown Obsessive Compulsive Scale (Y-BOCS)
Date: ${today}

SEVERITY SCALE
Obsession Subtotal (Items 1-5): ${obsSubtotal}/20
Compulsion Subtotal (Items 6-10): ${compSubtotal}/20
Total Score: ${totalScore}/40
Severity: ${severity}

Core Item Scores:
  Obsessions:
    1. Time Occupied: ${obsItems['1']}
    2. Interference: ${obsItems['2']}
    3. Distress: ${obsItems['3']}
    4. Resistance: ${obsItems['4']}
    5. Control: ${obsItems['5']}
  Compulsions:
    6. Time Spent: ${compItems['6']}
    7. Interference: ${compItems['7']}
    8. Distress: ${compItems['8']}
    9. Resistance: ${compItems['9']}
    10. Control: ${compItems['10']}

Supplemental Items (not in total):
  1b. Obsession-Free Interval: ${suppItems['1b']}
  6b. Compulsion-Free Interval: ${suppItems['6b']}

Investigational Items:
  11. Insight: ${investItems['11']}
  12. Avoidance: ${investItems['12']}
  13. Indecisiveness: ${investItems['13']}
  14. Overvalued Responsibility: ${investItems['14']}
  15. Pervasive Slowness: ${investItems['15']}
  16. Pathological Doubting: ${investItems['16']}
  17. Global Severity: ${investItems['17']}
  18. Global Improvement: ${investItems['18']}
  19. Reliability: ${investItems['19']}

SYMPTOM CHECKLIST
Current Obsessions: ${obsessionsCurrentList.length > 0 ? obsessionsCurrentList.join('; ') : 'None endorsed'}
Past Obsessions: ${obsessionsPastList.length > 0 ? obsessionsPastList.join('; ') : 'None endorsed'}
Current Compulsions: ${compulsionsCurrentList.length > 0 ? compulsionsCurrentList.join('; ') : 'None endorsed'}
Past Compulsions: ${compulsionsPastList.length > 0 ? compulsionsPastList.join('; ') : 'None endorsed'}`;

        navigator.clipboard.writeText(report).then(() => {
          const btn = document.getElementById('yb-generate-btn');
          const orig = btn.textContent;
          btn.textContent = 'Copied!';
          setTimeout(() => { btn.textContent = orig; }, 2000);
        });
      });

      // ============================================================
      // RESET BUTTON
      // ============================================================
      document.getElementById('yb-reset-btn').addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all Y-BOCS scores and checkboxes?')) {
          // Clear all radio buttons
          document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.checked = false;
          });

          // Clear all checkboxes
          document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
          });

          // Reset score display
          document.getElementById('yb-obs-subtotal').textContent = '0';
          document.getElementById('yb-comp-subtotal').textContent = '0';
          document.getElementById('yb-total-score').textContent = '0';
          document.getElementById('yb-severity-badge').textContent = 'Subclinical';
        }
      });

      // Add print button
      (function addPrintBtn() {
        var sec = document.getElementById('ybocs-tool');
        if (!sec) return;
        var header = sec.querySelector('.section-header');
        if (!header) return;
        var btn = document.createElement('button');
        btn.className = 'pf-inline-btn';
        btn.onclick = function() { if (typeof printBlankForm === 'function') printBlankForm('ybocs'); };
        btn.innerHTML = '🖨️ Print Blank Form';
        btn.title = 'Print a blank version of this form';
        header.appendChild(btn);
      })();
    })();
  
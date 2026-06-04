
    (function() {
      'use strict';

      const ITEM_CONFIG = {
        'ciwa-item1':  { name: 'Nausea & Vomiting',     max: 7 },
        'ciwa-item2':  { name: 'Tremor',                 max: 7 },
        'ciwa-item3':  { name: 'Paroxysmal Sweats',      max: 7 },
        'ciwa-item4':  { name: 'Anxiety',                max: 7 },
        'ciwa-item5':  { name: 'Agitation',              max: 7 },
        'ciwa-item6':  { name: 'Tactile Disturbances',   max: 7 },
        'ciwa-item7':  { name: 'Auditory Disturbances',  max: 7 },
        'ciwa-item8':  { name: 'Visual Disturbances',    max: 7 },
        'ciwa-item9':  { name: 'Headache / Fullness',    max: 7 },
        'ciwa-item10': { name: 'Orientation / Sensorium', max: 4 }
      };

      const MAX_TOTAL = 67;

      const form          = document.getElementById('ciwa-form');
      const totalScoreEl  = document.getElementById('ciwa-total-score');
      const severityEl    = document.getElementById('ciwa-severity-level');
      const guidanceEl    = document.getElementById('ciwa-guidance');
      const reportBtn     = document.getElementById('ciwa-report-btn');
      const resetBtn      = document.getElementById('ciwa-reset-btn');
      const summarySection= document.getElementById('ciwa-summary');
      const summaryGrid   = document.getElementById('ciwa-summary-grid');
      const pulseEl       = document.getElementById('ciwa-pulse');
      const bpEl          = document.getElementById('ciwa-bp');

      function calculateScore() {
        let total = 0;
        const scores = {};
        for (let n = 1; n <= 10; n++) {
          const itemName = 'ciwa-item' + n;
          const selected = form.querySelector('input[name="' + itemName + '"]:checked');
          const score = selected ? parseInt(selected.value, 10) : 0;
          total += score;
          scores[n] = score;
        }
        return { total: total, scores: scores };
      }

      function getSeverity(total) {
        if (total < 10)  return { level: 'Minimal to mild withdrawal', cls: 'ciwa-severity-minimal' };
        if (total <= 15) return { level: 'Moderate withdrawal',         cls: 'ciwa-severity-moderate' };
        return              { level: 'Severe withdrawal',                cls: 'ciwa-severity-severe' };
      }

      function getGuidance(total) {
        if (total < 10) {
          return 'Scores <10 do not usually require additional medication for withdrawal. Continue symptom-triggered reassessment per protocol.';
        }
        if (total <= 15) {
          return 'Marked autonomic arousal. Consider benzodiazepine and continued frequent (q1h) reassessment.';
        }
        return 'Impending delirium tremens risk. Treat with benzodiazepine promptly, monitor closely, and consider higher level of care.';
      }

      function updateDisplay() {
        const res = calculateScore();
        const sev = getSeverity(res.total);

        totalScoreEl.textContent = res.total;
        severityEl.textContent = sev.level;
        severityEl.className = 'ciwa-severity-label ' + sev.cls;
        guidanceEl.textContent = getGuidance(res.total);

        // Build per-item summary grid
        summaryGrid.innerHTML = '';
        for (let n = 1; n <= 10; n++) {
          const cfg = ITEM_CONFIG['ciwa-item' + n];
          const score = res.scores[n];
          const cell = document.createElement('div');
          cell.className = 'ciwa-summary-item';
          cell.innerHTML =
            '<div class="ciwa-summary-item-label">' + n + '. ' + cfg.name + '</div>' +
            '<div><span class="ciwa-summary-item-score">' + score + '/' + cfg.max + '</span></div>';
          summaryGrid.appendChild(cell);
        }
        summarySection.classList.add('ciwa-show');
      }

      function generateReport() {
        const res = calculateScore();
        const sev = getSeverity(res.total);
        const pulse = (pulseEl && pulseEl.value) ? pulseEl.value.trim() : '';
        const bp    = (bpEl && bpEl.value) ? bpEl.value.trim() : '';

        const lines = [];
        lines.push('CIWA-Ar (Clinical Institute Withdrawal Assessment – Alcohol, Revised)');
        lines.push('Date: ' + ToolUtils.dateStamp());
        if (pulse) lines.push('Pulse: ' + pulse + ' bpm');
        if (bp)    lines.push('Blood pressure: ' + bp);
        lines.push('');
        lines.push('Total Score: ' + res.total + ' / ' + MAX_TOTAL);
        lines.push('Severity: ' + sev.level);
        lines.push('');
        lines.push('Individual Item Scores:');
        lines.push('  1. Nausea & Vomiting: ' + res.scores[1] + '/7');
        lines.push('  2. Tremor: ' + res.scores[2] + '/7');
        lines.push('  3. Paroxysmal Sweats: ' + res.scores[3] + '/7');
        lines.push('  4. Anxiety: ' + res.scores[4] + '/7');
        lines.push('  5. Agitation: ' + res.scores[5] + '/7');
        lines.push('  6. Tactile Disturbances: ' + res.scores[6] + '/7');
        lines.push('  7. Auditory Disturbances: ' + res.scores[7] + '/7');
        lines.push('  8. Visual Disturbances: ' + res.scores[8] + '/7');
        lines.push('  9. Headache / Fullness in Head: ' + res.scores[9] + '/7');
        lines.push(' 10. Orientation / Clouding of Sensorium: ' + res.scores[10] + '/4');
        lines.push('');
        lines.push('Clinical Interpretation: ' + getGuidance(res.total));
        lines.push('');
        lines.push('Reference: Sullivan JT, Sykora K, Schneiderman J, Naranjo CA, Sellers EM. Assessment of alcohol withdrawal: the revised Clinical Institute Withdrawal Assessment for Alcohol scale (CIWA-Ar). Br J Addict. 1989;84(11):1353-7.');

        return lines.join('\n');
      }

      function copyReport() {
        ToolUtils.copyWithButton(generateReport(), reportBtn);
      }

      function resetForm() {
        ToolUtils.confirmReset('Reset all CIWA-Ar scores? This action cannot be undone.', function() {
          form.reset();
          if (pulseEl) pulseEl.value = '';
          if (bpEl)    bpEl.value = '';
          updateDisplay();
        });
      }

      // Event listeners
      form.addEventListener('change', updateDisplay);
      reportBtn.addEventListener('click', copyReport);
      resetBtn.addEventListener('click', resetForm);

      // Initial display
      updateDisplay();
    })();

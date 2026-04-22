
    (function() {
      'use strict';

      // Each item has its own max — options are not strictly 0-N contiguous
      // (e.g., Pulse allows 0/1/2/4, GI Upset allows 0/1/2/3/5, etc.).
      const ITEM_CONFIG = {
        'cows-item1':  { name: 'Resting Pulse Rate',     max: 4 },
        'cows-item2':  { name: 'Sweating',                max: 4 },
        'cows-item3':  { name: 'Restlessness',            max: 5 },
        'cows-item4':  { name: 'Pupil Size',              max: 5 },
        'cows-item5':  { name: 'Bone or Joint Aches',     max: 4 },
        'cows-item6':  { name: 'Runny Nose or Tearing',   max: 4 },
        'cows-item7':  { name: 'GI Upset',                max: 5 },
        'cows-item8':  { name: 'Tremor',                  max: 4 },
        'cows-item9':  { name: 'Yawning',                 max: 4 },
        'cows-item10': { name: 'Anxiety or Irritability', max: 4 },
        'cows-item11': { name: 'Gooseflesh Skin',         max: 5 }
      };

      // Sum of item maxes: 4+4+5+5+4+4+5+4+4+4+5 = 48
      const MAX_TOTAL = 48;

      const form          = document.getElementById('cows-form');
      const totalScoreEl  = document.getElementById('cows-total-score');
      const severityEl    = document.getElementById('cows-severity-level');
      const guidanceEl    = document.getElementById('cows-guidance');
      const reportBtn     = document.getElementById('cows-report-btn');
      const resetBtn      = document.getElementById('cows-reset-btn');
      const summarySection= document.getElementById('cows-summary');
      const summaryGrid   = document.getElementById('cows-summary-grid');
      const reasonEl      = document.getElementById('cows-reason');

      function calculateScore() {
        let total = 0;
        const scores = {};
        for (let n = 1; n <= 11; n++) {
          const itemName = 'cows-item' + n;
          const selected = form.querySelector('input[name="' + itemName + '"]:checked');
          const score = selected ? parseInt(selected.value, 10) : 0;
          total += score;
          scores[n] = score;
        }
        return { total: total, scores: scores };
      }

      function getSeverity(total) {
        if (total <= 4)  return { level: 'No significant withdrawal', cls: 'cows-severity-minimal' };
        if (total <= 12) return { level: 'Mild withdrawal',             cls: 'cows-severity-mild' };
        if (total <= 24) return { level: 'Moderate withdrawal',         cls: 'cows-severity-moderate' };
        if (total <= 36) return { level: 'Moderately severe withdrawal',cls: 'cows-severity-msevere' };
        return              { level: 'Severe withdrawal',                 cls: 'cows-severity-severe' };
      }

      function getGuidance(total) {
        if (total <= 4) {
          return 'Minimal signs of opioid withdrawal. Buprenorphine induction not yet recommended — reassess in 1–2 hours or await further objective signs.';
        }
        if (total <= 12) {
          return 'Mild withdrawal. Generally considered the lower threshold (score ≥8 with short-acting opioids, or ≥12–13 with methadone/long-acting) for initiating buprenorphine to minimize precipitated withdrawal risk.';
        }
        if (total <= 24) {
          return 'Moderate withdrawal. Appropriate for buprenorphine induction; consider adjunctive supportive medications (clonidine/lofexidine, antiemetics, loperamide, NSAIDs, hydroxyzine).';
        }
        if (total <= 36) {
          return 'Moderately severe withdrawal. Initiate buprenorphine promptly and treat symptoms aggressively with adjuncts; monitor for dehydration and electrolyte disturbance.';
        }
        return 'Severe withdrawal. Consider higher level of care, aggressive symptom control, and rapid induction onto MOUD (buprenorphine or methadone per program).';
      }

      function updateDisplay() {
        const res = calculateScore();
        const sev = getSeverity(res.total);

        totalScoreEl.textContent = res.total;
        severityEl.textContent = sev.level;
        severityEl.className = 'cows-severity-label ' + sev.cls;
        guidanceEl.textContent = getGuidance(res.total);

        summaryGrid.innerHTML = '';
        for (let n = 1; n <= 11; n++) {
          const cfg = ITEM_CONFIG['cows-item' + n];
          const score = res.scores[n];
          const cell = document.createElement('div');
          cell.className = 'cows-summary-item';
          cell.innerHTML =
            '<div class="cows-summary-item-label">' + n + '. ' + cfg.name + '</div>' +
            '<div><span class="cows-summary-item-score">' + score + '/' + cfg.max + '</span></div>';
          summaryGrid.appendChild(cell);
        }
        summarySection.classList.add('cows-show');
      }

      function generateReport() {
        const res = calculateScore();
        const sev = getSeverity(res.total);
        const reason = (reasonEl && reasonEl.value) ? reasonEl.value.trim() : '';

        const lines = [];
        lines.push('COWS (Clinical Opiate Withdrawal Scale)');
        lines.push('Date: ' + ToolUtils.dateStamp());
        if (reason) lines.push('Reason for assessment: ' + reason);
        lines.push('');
        lines.push('Total Score: ' + res.total + ' / ' + MAX_TOTAL);
        lines.push('Severity: ' + sev.level);
        lines.push('');
        lines.push('Individual Item Scores:');
        lines.push('  1. Resting Pulse Rate: '     + res.scores[1]  + '/4');
        lines.push('  2. Sweating: '                + res.scores[2]  + '/4');
        lines.push('  3. Restlessness: '            + res.scores[3]  + '/5');
        lines.push('  4. Pupil Size: '              + res.scores[4]  + '/5');
        lines.push('  5. Bone or Joint Aches: '     + res.scores[5]  + '/4');
        lines.push('  6. Runny Nose or Tearing: '   + res.scores[6]  + '/4');
        lines.push('  7. GI Upset: '                + res.scores[7]  + '/5');
        lines.push('  8. Tremor: '                  + res.scores[8]  + '/4');
        lines.push('  9. Yawning: '                 + res.scores[9]  + '/4');
        lines.push(' 10. Anxiety or Irritability: ' + res.scores[10] + '/4');
        lines.push(' 11. Gooseflesh Skin: '         + res.scores[11] + '/5');
        lines.push('');
        lines.push('Severity Bands: 5–12 = mild; 13–24 = moderate; 25–36 = moderately severe; >36 = severe.');
        lines.push('');
        lines.push('Clinical Interpretation: ' + getGuidance(res.total));
        lines.push('');
        lines.push('Reference: Wesson DR, Ling W. The Clinical Opiate Withdrawal Scale (COWS). J Psychoactive Drugs. 2003;35(2):253-9.');

        return lines.join('\n');
      }

      function copyReport() {
        ToolUtils.copyWithButton(generateReport(), reportBtn);
      }

      function resetForm() {
        ToolUtils.confirmReset('Reset all COWS scores? This action cannot be undone.', function() {
          form.reset();
          if (reasonEl) reasonEl.value = '';
          updateDisplay();
        });
      }

      form.addEventListener('change', updateDisplay);
      reportBtn.addEventListener('click', copyReport);
      resetBtn.addEventListener('click', resetForm);

      updateDisplay();
    })();

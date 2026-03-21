
    (function() {
      const ITEM_CONFIG = {
        'ym-item1': { name: 'Elevated Mood', max: 4 },
        'ym-item2': { name: 'Increased Motor Activity–Energy', max: 4 },
        'ym-item3': { name: 'Sexual Interest', max: 4 },
        'ym-item4': { name: 'Sleep', max: 4 },
        'ym-item5': { name: 'Irritability', max: 8 },
        'ym-item6': { name: 'Speech (Rate/Amount)', max: 8 },
        'ym-item7': { name: 'Language–Thought Disorder', max: 4 },
        'ym-item8': { name: 'Content', max: 8 },
        'ym-item9': { name: 'Disruptive–Aggressive Behavior', max: 8 },
        'ym-item10': { name: 'Appearance', max: 4 },
        'ym-item11': { name: 'Insight', max: 4 }
      };

      const form = document.getElementById('ym-form');
      const totalScoreEl = document.getElementById('ym-total-score');
      const severityEl = document.getElementById('ym-severity-level');
      const reportBtn = document.getElementById('ym-report-btn');
      const resetBtn = document.getElementById('ym-reset-btn');
      const summarySection = document.getElementById('ym-summary');
      const summaryGrid = document.getElementById('ym-summary-grid');

      function calculateScore() {
        let total = 0;
        const scores = {};

        for (let itemNum = 1; itemNum <= 11; itemNum++) {
          const itemName = `ym-item${itemNum}`;
          const selected = form.querySelector(`input[name="${itemName}"]:checked`);
          const score = selected ? parseInt(selected.value, 10) : 0;
          total += score;
          scores[itemNum] = score;
        }

        return { total, scores };
      }

      function getSeverityLevel(total) {
        if (total < 12) return { level: 'Remission', class: 'ym-severity-remission' };
        if (total < 20) return { level: 'Mild mania', class: 'ym-severity-mild' };
        if (total < 26) return { level: 'Moderate mania', class: 'ym-severity-moderate' };
        return { level: 'Severe mania', class: 'ym-severity-severe' };
      }

      function updateDisplay() {
        const { total, scores } = calculateScore();
        const severity = getSeverityLevel(total);

        totalScoreEl.textContent = total;
        severityEl.textContent = severity.level;
        severityEl.className = `ym-severity-label ${severity.class}`;

        // Update summary grid
        summaryGrid.innerHTML = '';
        for (let itemNum = 1; itemNum <= 11; itemNum++) {
          const config = ITEM_CONFIG[`ym-item${itemNum}`];
          const score = scores[itemNum];
          const summaryItem = document.createElement('div');
          summaryItem.className = 'ym-summary-item';
          summaryItem.innerHTML = `
            <div class="ym-summary-item-label">${itemNum}. ${config.name}</div>
            <div class="ym-summary-item-score">${score}/${config.max}</div>
          `;
          summaryGrid.appendChild(summaryItem);
        }

        summarySection.classList.add('ym-show');
      }

      function generateReport() {
        const { total, scores } = calculateScore();
        const severity = getSeverityLevel(total);

        // Get current date in YYYY-MM-DD format
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];

        const lines = [
          'Young Mania Rating Scale (YMRS)',
          `Date: ${dateStr}`,
          '',
          `Total Score: ${total}/60`,
          `Severity: ${severity.level}`,
          '',
          'Individual Item Scores:',
          `  1. Elevated Mood: ${scores[1]}/4`,
          `  2. Increased Motor Activity–Energy: ${scores[2]}/4`,
          `  3. Sexual Interest: ${scores[3]}/4`,
          `  4. Sleep: ${scores[4]}/4`,
          `  5. Irritability: ${scores[5]}/8`,
          `  6. Speech (Rate/Amount): ${scores[6]}/8`,
          `  7. Language–Thought Disorder: ${scores[7]}/4`,
          `  8. Content: ${scores[8]}/8`,
          `  9. Disruptive–Aggressive Behavior: ${scores[9]}/8`,
          `  10. Appearance: ${scores[10]}/4`,
          `  11. Insight: ${scores[11]}/4`,
          '',
          `Clinical Note: Score of ${total} indicates ${severity.level.toLowerCase()}.`
        ];

        return lines.join('\n');
      }

      function copyReport() {
        const report = generateReport();
        navigator.clipboard.writeText(report).then(() => {
          const orig = reportBtn.textContent;
          reportBtn.textContent = 'Copied!';
          setTimeout(() => {
            reportBtn.textContent = orig;
          }, 2000);
        }).catch(err => {
          console.error('Failed to copy:', err);
        });
      }

      function resetForm() {
        if (confirm('Reset all scores? This action cannot be undone.')) {
          form.reset();
          updateDisplay();
        }
      }

      // Event listeners
      form.addEventListener('change', updateDisplay);
      reportBtn.addEventListener('click', copyReport);
      resetBtn.addEventListener('click', resetForm);

      // Initial display
      updateDisplay();
    })();
  
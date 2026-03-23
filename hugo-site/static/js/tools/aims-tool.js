
    (function() {
      const ITEMS_MOVEMENT = ['ai-item1', 'ai-item2', 'ai-item3', 'ai-item4', 'ai-item5', 'ai-item6', 'ai-item7'];
      const FACIAL_ORAL = ['ai-item1', 'ai-item2', 'ai-item3', 'ai-item4'];
      const EXTREMITY = ['ai-item5', 'ai-item6'];
      const TRUNK = ['ai-item7'];

      // Collapsible Procedure Section
      function initProcedureToggle() {
        const header = document.getElementById('ai-procedure-header');
        const content = document.getElementById('ai-procedure-content');

        header.addEventListener('click', function() {
          header.classList.toggle('ai-collapsed');
          content.classList.toggle('ai-collapsed');
        });
      }

      // Calculate Scores
      function calculateScores() {
        const getItemValue = (itemName) => {
          const selected = document.querySelector(`input[name="${itemName}"]:checked`);
          return selected ? parseInt(selected.value) : 0;
        };

        // Movement item scores
        const movementScores = ITEMS_MOVEMENT.map(getItemValue);

        // Subscale totals
        const facialScore = FACIAL_ORAL.map(getItemValue).reduce((a, b) => a + b, 0);
        const extremityScore = EXTREMITY.map(getItemValue).reduce((a, b) => a + b, 0);
        const trunkScore = TRUNK.map(getItemValue).reduce((a, b) => a + b, 0);
        const totalMovement = facialScore + extremityScore + trunkScore;

        // Global items
        const item8 = getItemValue('ai-item8');
        const item9 = getItemValue('ai-item9');
        const item10 = getItemValue('ai-item10');

        return {
          facialScore,
          extremityScore,
          trunkScore,
          totalMovement,
          movementScores,
          item8,
          item9,
          item10
        };
      }

      // Update Score Display
      function updateScores() {
        const scores = calculateScores();

        document.getElementById('ai-facial-score').textContent = `${scores.facialScore}/16`;
        document.getElementById('ai-extremity-score').textContent = `${scores.extremityScore}/8`;
        document.getElementById('ai-trunk-score').textContent = `${scores.trunkScore}/4`;
        document.getElementById('ai-total-score').textContent = `${scores.totalMovement}/28`;

        // Severity Level (based on total movement score)
        let severityLevel = '—';
        if (scores.totalMovement === 0) severityLevel = 'No Dyskinesia';
        else if (scores.totalMovement >= 1 && scores.totalMovement <= 7) severityLevel = 'Minimal Dyskinesia';
        else if (scores.totalMovement >= 8 && scores.totalMovement <= 14) severityLevel = 'Mild Dyskinesia';
        else if (scores.totalMovement >= 15 && scores.totalMovement <= 21) severityLevel = 'Moderate Dyskinesia';
        else if (scores.totalMovement >= 22) severityLevel = 'Severe Dyskinesia';

        document.getElementById('ai-severity-level').textContent = severityLevel;

        // TD Screen Check
        const maxMovementScore = Math.max(...scores.movementScores);
        const tdPositive = maxMovementScore >= 2 || scores.item8 >= 2;

        const screenElement = document.getElementById('ai-screen-status');
        if (tdPositive) {
          screenElement.textContent = 'POSITIVE';
          screenElement.classList.add('ai-severity-positive');
          screenElement.classList.remove('ai-severity-negative');
        } else {
          screenElement.textContent = 'NEGATIVE';
          screenElement.classList.add('ai-severity-negative');
          screenElement.classList.remove('ai-severity-positive');
        }
      }

      // Generate Report
      function generateReport() {
        const scores = calculateScores();

        const getItemValue = (itemName) => {
          const selected = document.querySelector(`input[name="${itemName}"]:checked`);
          return selected ? parseInt(selected.value) : 0;
        };

        const item1 = getItemValue('ai-item1');
        const item2 = getItemValue('ai-item2');
        const item3 = getItemValue('ai-item3');
        const item4 = getItemValue('ai-item4');
        const item5 = getItemValue('ai-item5');
        const item6 = getItemValue('ai-item6');
        const item7 = getItemValue('ai-item7');
        const item8 = getItemValue('ai-item8');
        const item9 = getItemValue('ai-item9');
        const item10 = getItemValue('ai-item10');
        const item11 = getItemValue('ai-item11') ? 'Yes' : 'No';
        const item12 = getItemValue('ai-item12') ? 'Yes' : 'No';

        // Severity Level
        let severityLevel = '—';
        if (scores.totalMovement === 0) severityLevel = 'No Dyskinesia';
        else if (scores.totalMovement >= 1 && scores.totalMovement <= 7) severityLevel = 'Minimal Dyskinesia';
        else if (scores.totalMovement >= 8 && scores.totalMovement <= 14) severityLevel = 'Mild Dyskinesia';
        else if (scores.totalMovement >= 15 && scores.totalMovement <= 21) severityLevel = 'Moderate Dyskinesia';
        else if (scores.totalMovement >= 22) severityLevel = 'Severe Dyskinesia';

        // TD Screen
        const maxMovementScore = Math.max(...scores.movementScores);
        const tdPositive = maxMovementScore >= 2 || item8 >= 2;
        const screenStatus = tdPositive ? 'POSITIVE' : 'NEGATIVE';

        // Identify items meeting threshold
        let positiveItems = [];
        if (tdPositive) {
          for (let i = 0; i < scores.movementScores.length; i++) {
            if (scores.movementScores[i] >= 2) {
              positiveItems.push(`Item ${i + 1}: ${scores.movementScores[i]}/4`);
            }
          }
          if (item8 >= 2) {
            positiveItems.push(`Item 8 (Overall Severity): ${item8}/4`);
          }
        }

        const today = new Date();
        const dateStr = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        let report = `Abnormal Involuntary Movement Scale (AIMS)\nDate: ${dateStr}\n\n`;
        report += `MOVEMENT RATINGS\n`;
        report += `Facial & Oral Movements:\n`;
        report += `  1. Facial Expression: ${item1}/4\n`;
        report += `  2. Lips & Perioral: ${item2}/4\n`;
        report += `  3. Jaw: ${item3}/4\n`;
        report += `  4. Tongue: ${item4}/4\n`;
        report += `  Subtotal: ${scores.facialScore}/16\n\n`;
        report += `Extremity Movements:\n`;
        report += `  5. Upper Extremities: ${item5}/4\n`;
        report += `  6. Lower Extremities: ${item6}/4\n`;
        report += `  Subtotal: ${scores.extremityScore}/8\n\n`;
        report += `Trunk Movements:\n`;
        report += `  7. Trunk: ${item7}/4\n`;
        report += `  Subtotal: ${scores.trunkScore}/4\n\n`;
        report += `Total Movement Score: ${scores.totalMovement}/28\n`;
        report += `Severity: ${severityLevel}\n\n`;
        report += `GLOBAL JUDGMENTS\n`;
        report += `  8. Overall Severity: ${item8}/4\n`;
        report += `  9. Incapacitation: ${item9}/4\n`;
        report += `  10. Patient Awareness: ${item10}/4\n\n`;
        report += `DENTAL STATUS\n`;
        report += `  11. Current dental/denture problems: ${item11}\n`;
        report += `  12. Usually wears dentures: ${item12}\n\n`;
        report += `Tardive Dyskinesia Screen: ${screenStatus}\n`;
        if (positiveItems.length > 0) {
          report += `Items meeting threshold (≥2): ${positiveItems.join(', ')}\n`;
        }
        report += `\nClinical Note: `;
        if (tdPositive) {
          report += `POSITIVE screen for tardive dyskinesia. Consider clinical correlation, duration of antipsychotic exposure, and risk factors. May require dose reduction, medication change, or specialist referral.`;
        } else {
          report += `NEGATIVE screen for tardive dyskinesia. Continue baseline monitoring, particularly if patient remains on antipsychotic medications.`;
        }

        return report;
      }

      // Copy to Clipboard
      function copyToClipboard() {
        const report = generateReport();
        const btn = document.getElementById('ai-report-btn');

        navigator.clipboard.writeText(report).then(() => {
          const originalText = btn.textContent;
          btn.textContent = 'Copied!';
          setTimeout(() => {
            btn.textContent = originalText;
          }, 2000);
        }).catch(() => {
          btn.textContent = 'Copy failed';
          setTimeout(() => { btn.textContent = originalText; }, 2000);
        });
      }

      // Reset Form
      function resetForm() {
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
          radio.checked = false;
        });
        updateScores();
      }

      // Event Listeners
      function initEventListeners() {
        // Update scores on any radio change
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
          radio.addEventListener('change', updateScores);
        });

        // Report button
        document.getElementById('ai-report-btn').addEventListener('click', copyToClipboard);

        // Reset button
        document.getElementById('ai-reset-btn').addEventListener('click', () => {
          document.getElementById('ai-reset-modal').classList.add('ai-active');
        });

        // Reset modal
        document.getElementById('ai-reset-confirm').addEventListener('click', () => {
          resetForm();
          document.getElementById('ai-reset-modal').classList.remove('ai-active');
        });

        document.getElementById('ai-reset-cancel').addEventListener('click', () => {
          document.getElementById('ai-reset-modal').classList.remove('ai-active');
        });

        // Close modal on overlay click
        document.getElementById('ai-reset-modal').addEventListener('click', (e) => {
          if (e.target.id === 'ai-reset-modal') {
            document.getElementById('ai-reset-modal').classList.remove('ai-active');
          }
        });
      }

      // Initialize
      initProcedureToggle();
      initEventListeners();
      updateScores();

      // Add print button
      (function addPrintBtn() {
        var sec = document.getElementById('aims-tool');
        if (!sec) return;
        var header = sec.querySelector('.section-header');
        if (!header) return;
        var btn = document.createElement('button');
        btn.className = 'pf-inline-btn';
        btn.onclick = function() { if (typeof printBlankForm === 'function') printBlankForm('aims'); };
        btn.innerHTML = '🖨️ Print Blank Form';
        btn.title = 'Print a blank version of this form';
        header.appendChild(btn);
      })();
    })();
  
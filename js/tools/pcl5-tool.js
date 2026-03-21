
    (function() {
      // Initialize cluster toggles
      const clusterHeaders = document.querySelectorAll('.pc-cluster-header');
      clusterHeaders.forEach(header => {
        header.addEventListener('click', function() {
          const clusterId = this.getAttribute('data-cluster');
          const clusterItems = document.getElementById('pc-cluster-' + clusterId);
          const toggle = this.querySelector('.pc-cluster-toggle');

          clusterItems.classList.toggle('active');
          toggle.textContent = clusterItems.classList.contains('active') ? '−' : '+';
        });
      });

      // Real-time scoring
      const allInputs = document.querySelectorAll('input[type="radio"]');
      allInputs.forEach(input => {
        input.addEventListener('change', updateScores);
      });

      function updateScores() {
        let clusterB = 0, clusterC = 0, clusterD = 0, clusterE = 0;

        // Calculate cluster totals
        for (let i = 1; i <= 5; i++) {
          const val = parseInt(getSelectedValue(`pc-item-${i}`) || 0);
          clusterB += val;
        }
        for (let i = 6; i <= 7; i++) {
          const val = parseInt(getSelectedValue(`pc-item-${i}`) || 0);
          clusterC += val;
        }
        for (let i = 8; i <= 14; i++) {
          const val = parseInt(getSelectedValue(`pc-item-${i}`) || 0);
          clusterD += val;
        }
        for (let i = 15; i <= 20; i++) {
          const val = parseInt(getSelectedValue(`pc-item-${i}`) || 0);
          clusterE += val;
        }

        const total = clusterB + clusterC + clusterD + clusterE;

        // Update display
        document.getElementById('pc-total').textContent = total;
        document.getElementById('pc-clusterB').textContent = clusterB;
        document.getElementById('pc-clusterC').textContent = clusterC;
        document.getElementById('pc-clusterD').textContent = clusterD;
        document.getElementById('pc-clusterE').textContent = clusterE;

        // Update severity
        updateSeverity(total);

        // Update diagnostic criteria
        updateCriteria();
      }

      function getSelectedValue(name) {
        const selected = document.querySelector(`input[name="${name}"]:checked`);
        return selected ? selected.value : null;
      }

      function updateSeverity(total) {
        const severityDiv = document.getElementById('pc-severity');
        let level = '', css = '';

        if (total <= 10) {
          level = 'Minimal symptoms (0–10)';
          css = 'pc-severity-minimal';
        } else if (total <= 20) {
          level = 'Mild symptoms (11–20)';
          css = 'pc-severity-mild';
        } else if (total <= 32) {
          level = 'Moderate symptoms (21–32)';
          css = 'pc-severity-moderate';
        } else if (total <= 51) {
          level = 'Moderately severe symptoms (33–51)';
          css = 'pc-severity-moderately-severe';
        } else {
          level = 'Severe symptoms (52–80)';
          css = 'pc-severity-severe';
        }

        severityDiv.textContent = level;
        severityDiv.className = `pc-severity ${css}`;

        // Update cut-off
        const cutoffSpan = document.getElementById('pc-cutoff');
        cutoffSpan.textContent = total >= 33 ? 'Above threshold (≥33)' : 'Below threshold (<33)';
      }

      function updateCriteria() {
        // Criterion B: count ≥2 in items 1-5
        let critBCount = 0;
        for (let i = 1; i <= 5; i++) {
          const val = parseInt(getSelectedValue(`pc-item-${i}`) || 0);
          if (val >= 2) critBCount++;
        }
        const critBMet = critBCount >= 1;
        updateCriterionDisplay('pc-crit-b', critBMet, critBCount, 5);

        // Criterion C: count ≥2 in items 6-7
        let critCCount = 0;
        for (let i = 6; i <= 7; i++) {
          const val = parseInt(getSelectedValue(`pc-item-${i}`) || 0);
          if (val >= 2) critCCount++;
        }
        const critCMet = critCCount >= 1;
        updateCriterionDisplay('pc-crit-c', critCMet, critCCount, 2);

        // Criterion D: count ≥2 in items 8-14
        let critDCount = 0;
        for (let i = 8; i <= 14; i++) {
          const val = parseInt(getSelectedValue(`pc-item-${i}`) || 0);
          if (val >= 2) critDCount++;
        }
        const critDMet = critDCount >= 2;
        updateCriterionDisplay('pc-crit-d', critDMet, critDCount, 7);

        // Criterion E: count ≥2 in items 15-20
        let critECount = 0;
        for (let i = 15; i <= 20; i++) {
          const val = parseInt(getSelectedValue(`pc-item-${i}`) || 0);
          if (val >= 2) critECount++;
        }
        const critEMet = critECount >= 2;
        updateCriterionDisplay('pc-crit-e', critEMet, critECount, 6);

        // Overall diagnosis: all 4 criteria must be met
        const diagnosisMet = critBMet && critCMet && critDMet && critEMet;
        const diagnosisSpan = document.getElementById('pc-diagnosis');
        diagnosisSpan.textContent = diagnosisMet ? 'Met' : 'Not Met';
        diagnosisSpan.className = diagnosisMet
          ? 'pc-criterion-status pc-criterion-met'
          : 'pc-criterion-status pc-criterion-not-met';
      }

      function updateCriterionDisplay(elemId, met, count, total) {
        const elem = document.getElementById(elemId);
        elem.textContent = met ? 'Met' : 'Not Met';
        elem.className = met
          ? 'pc-criterion-status pc-criterion-met'
          : 'pc-criterion-status pc-criterion-not-met';

        const countElem = document.getElementById(elemId + '-count');
        if (countElem) countElem.textContent = count;
      }

      // Generate report
      document.getElementById('pc-report-btn').addEventListener('click', function() {
        const clusterB = parseInt(document.getElementById('pc-clusterB').textContent);
        const clusterC = parseInt(document.getElementById('pc-clusterC').textContent);
        const clusterD = parseInt(document.getElementById('pc-clusterD').textContent);
        const clusterE = parseInt(document.getElementById('pc-clusterE').textContent);
        const total = parseInt(document.getElementById('pc-total').textContent);
        const severity = document.getElementById('pc-severity').textContent;

        // Count endorsed symptoms (≥2)
        let critBCount = 0, critCCount = 0, critDCount = 0, critECount = 0;
        for (let i = 1; i <= 5; i++) {
          if (parseInt(getSelectedValue(`pc-item-${i}`) || 0) >= 2) critBCount++;
        }
        for (let i = 6; i <= 7; i++) {
          if (parseInt(getSelectedValue(`pc-item-${i}`) || 0) >= 2) critCCount++;
        }
        for (let i = 8; i <= 14; i++) {
          if (parseInt(getSelectedValue(`pc-item-${i}`) || 0) >= 2) critDCount++;
        }
        for (let i = 15; i <= 20; i++) {
          if (parseInt(getSelectedValue(`pc-item-${i}`) || 0) >= 2) critECount++;
        }

        const critBMet = critBCount >= 1 ? 'Met' : 'Not Met';
        const critCMet = critCCount >= 1 ? 'Met' : 'Not Met';
        const critDMet = critDCount >= 2 ? 'Met' : 'Not Met';
        const critEMet = critECount >= 2 ? 'Met' : 'Not Met';

        const allMetCriteria = (critBCount >= 1) && (critCCount >= 1) && (critDCount >= 2) && (critECount >= 2);
        const diagnosisStatus = allMetCriteria ? 'Met' : 'Not Met';

        // Get current date
        const today = new Date();
        const dateStr = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        let report = `PCL-5 (PTSD Checklist for DSM-5)\nDate: ${dateStr}\n\nTotal Score: ${total}/80\nSeverity: ${severity}\n\nCluster Scores:\n  B - Intrusion (Items 1-5): ${clusterB}/20\n  C - Avoidance (Items 6-7): ${clusterC}/8\n  D - Negative Cognitions/Mood (Items 8-14): ${clusterD}/28\n  E - Arousal/Reactivity (Items 15-20): ${clusterE}/24\n\nProvisional PTSD Diagnosis: ${diagnosisStatus}\n  Criterion B (≥1 intrusion symptom): ${critBMet} (${critBCount}/5 endorsed)\n  Criterion C (≥1 avoidance symptom): ${critCMet} (${critCCount}/2 endorsed)\n  Criterion D (≥2 negative cognition symptoms): ${critDMet} (${critDCount}/7 endorsed)\n  Criterion E (≥2 arousal symptoms): ${critEMet} (${critECount}/6 endorsed)\n\nCut-off Score (≥33): ${total >= 33 ? 'Above threshold' : 'Below threshold'}\n\nIndividual Item Scores:\n`;

        const itemLabels = [
          '1. Repeated, disturbing, and unwanted memories',
          '2. Repeated, disturbing dreams',
          '3. Feeling as if stressful experience is happening again',
          '4. Feeling very upset when reminded',
          '5. Strong physical reactions when reminded',
          '6. Avoiding memories, thoughts, or feelings',
          '7. Avoiding external reminders',
          '8. Trouble remembering important parts',
          '9. Strong negative beliefs',
          '10. Blaming yourself or someone else',
          '11. Strong negative feelings',
          '12. Loss of interest in activities',
          '13. Feeling distant or cut off',
          '14. Trouble experiencing positive feelings',
          '15. Irritable behavior or angry outbursts',
          '16. Taking too many risks',
          '17. Being superalert or watchful',
          '18. Feeling jumpy or easily startled',
          '19. Having difficulty concentrating',
          '20. Trouble falling or staying asleep'
        ];

        for (let i = 1; i <= 20; i++) {
          const score = getSelectedValue(`pc-item-${i}`) || '—';
          report += `  Item ${itemLabels[i-1]}: ${score}\n`;
        }

        navigator.clipboard.writeText(report).then(() => {
          const originalText = this.textContent;
          this.textContent = 'Copied!';
          setTimeout(() => {
            this.textContent = originalText;
          }, 2000);
        });
      });

      // Reset button
      document.getElementById('pc-reset-btn').addEventListener('click', function() {
        if (confirm('Are you sure you want to reset all responses?')) {
          document.querySelectorAll('input[type="radio"]').forEach(input => {
            input.checked = false;
          });
          updateScores();
        }
      });

      // Initial call
      updateScores();
    })();
  
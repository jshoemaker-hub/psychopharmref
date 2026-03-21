
    (function() {
      // Item data
      const itemNames = {
        1: 'Immobility/Stupor',
        2: 'Mutism',
        3: 'Staring',
        4: 'Posturing/Catalepsy',
        5: 'Grimacing',
        6: 'Echopraxia/Echolalia',
        7: 'Stereotypy',
        8: 'Mannerisms',
        9: 'Verbigeration',
        10: 'Rigidity',
        11: 'Negativism',
        12: 'Waxy Flexibility',
        13: 'Withdrawal',
        14: 'Excitement',
        15: 'Impulsivity',
        16: 'Automatic Obedience',
        17: 'Passive Obedience (Mitgehen)',
        18: 'Muscle Resistance (Gegenhalten)',
        19: 'Motorically Stuck (Ambitendency)',
        20: 'Grasp Reflex',
        21: 'Perseveration',
        22: 'Combativeness',
        23: 'Autonomic Abnormality'
      };

      // CSI items: 1-14
      const csiItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

      // Setup collapsible fieldsets
      document.querySelectorAll('.bf-fieldset').forEach(fieldset => {
        const legend = fieldset.querySelector('.bf-legend');
        legend.addEventListener('click', function() {
          fieldset.classList.toggle('bf-collapsed');
        });
      });

      // Setup tab switching
      document.querySelectorAll('.bf-tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const tabId = this.getAttribute('data-tab');

          // Remove active from all tabs and buttons
          document.querySelectorAll('.bf-tab-btn').forEach(b => b.classList.remove('bf-active'));
          document.querySelectorAll('.bf-tab-content').forEach(t => t.classList.remove('bf-active'));

          // Add active to clicked button and corresponding tab
          this.classList.add('bf-active');
          document.getElementById(tabId).classList.add('bf-active');
        });
      });

      // CSI SCORING
      function updateCSIScore() {
        let score = 0;
        const presentItems = [];

        csiItems.forEach(num => {
          const checkbox = document.querySelector(`input[name="bf-csi-${num}"]`);
          if (checkbox && checkbox.checked) {
            score++;
            presentItems.push(itemNames[num]);
          }
        });

        document.getElementById('bf-csi-score').textContent = score;

        let interpretation = '';
        let className = '';

        if (score <= 1) {
          interpretation = 'Negative screen — catatonia unlikely.';
          className = 'negative';
        } else {
          interpretation = 'Positive screen — catatonia likely. Proceed to full BFCRS assessment.';
          className = 'positive';
        }

        const interpDiv = document.getElementById('bf-csi-interpretation');
        interpDiv.className = 'bf-interpretation ' + className;
        interpDiv.textContent = interpretation;

        const listDiv = document.getElementById('bf-csi-items-list');
        if (presentItems.length > 0) {
          listDiv.textContent = 'Items present: ' + presentItems.join(', ');
        } else {
          listDiv.textContent = '';
        }
      }

      // CRS SCORING
      function updateCRSScore() {
        let severity = 0;
        let itemsPresent = 0;
        let screeningPositive = 0;
        const allPresentItems = [];

        for (let i = 1; i <= 23; i++) {
          const radio = document.querySelector(`input[name="bf-crs-${i}"]:checked`);
          if (radio) {
            const score = parseInt(radio.value);
            severity += score;
            if (score > 0) {
              itemsPresent++;
              allPresentItems.push(itemNames[i]);
            }
            if (csiItems.includes(i) && score > 0) {
              screeningPositive++;
            }
          }
        }

        document.getElementById('bf-crs-severity').textContent = severity;
        document.getElementById('bf-crs-items-present').textContent = itemsPresent;
        document.getElementById('bf-crs-screening-positive').textContent = screeningPositive;

        // Interpretation
        let severityLabel = '';
        let severityClass = '';
        if (severity === 0) {
          severityLabel = 'No catatonia detected.';
          severityClass = 'negative';
        } else if (severity <= 10) {
          severityLabel = 'Mild catatonia.';
          severityClass = 'mild';
        } else if (severity <= 20) {
          severityLabel = 'Moderate catatonia.';
          severityClass = 'moderate';
        } else if (severity <= 30) {
          severityLabel = 'Severe catatonia.';
          severityClass = 'severe';
        } else {
          severityLabel = 'Extreme catatonia.';
          severityClass = 'extreme';
        }

        const interpDiv = document.getElementById('bf-crs-interpretation');
        interpDiv.className = 'bf-interpretation ' + severityClass;
        interpDiv.textContent = severityLabel;

        // Subtype determination
        const subtypeDiv = document.getElementById('bf-crs-subtype');
        const retardedItems = [1, 2, 3, 4, 10, 13];
        const excitedItems = [14, 6, 7, 8, 15, 22];

        let retardedScore = 0;
        let excitedScore = 0;

        retardedItems.forEach(num => {
          const radio = document.querySelector(`input[name="bf-crs-${num}"]:checked`);
          if (radio) retardedScore += parseInt(radio.value);
        });

        excitedItems.forEach(num => {
          const radio = document.querySelector(`input[name="bf-crs-${num}"]:checked`);
          if (radio) excitedScore += parseInt(radio.value);
        });

        let subtype = '';
        if (severity > 0) {
          if (retardedScore > excitedScore && retardedScore > 0) {
            subtype = 'Predominant subtype: Retarded/Withdrawn';
          } else if (excitedScore > retardedScore && excitedScore > 0) {
            subtype = 'Predominant subtype: Excited';
          } else if (retardedScore > 0 || excitedScore > 0) {
            subtype = 'Predominant subtype: Mixed';
          }
          subtypeDiv.textContent = subtype;
        } else {
          subtypeDiv.textContent = '';
        }

        // Malignant warning
        const item14 = document.querySelector('input[name="bf-crs-14"]:checked');
        const item23 = document.querySelector('input[name="bf-crs-23"]:checked');
        const warningDiv = document.getElementById('bf-crs-warning');

        if (item14 && item23 && parseInt(item14.value) > 0 && parseInt(item23.value) > 0) {
          warningDiv.textContent = '⚠ WARNING — Autonomic instability present. Evaluate for malignant catatonia (medical emergency).';
          warningDiv.style.display = 'block';
        } else {
          warningDiv.textContent = '';
          warningDiv.style.display = 'none';
        }
      }

      // Attach listeners to CSI checkboxes
      csiItems.forEach(num => {
        const checkbox = document.querySelector(`input[name="bf-csi-${num}"]`);
        if (checkbox) checkbox.addEventListener('change', updateCSIScore);
      });

      // Attach listeners to CRS radios
      for (let i = 1; i <= 23; i++) {
        const radios = document.querySelectorAll(`input[name="bf-crs-${i}"]`);
        radios.forEach(radio => {
          radio.addEventListener('change', updateCRSScore);
        });
      }

      // CSI REPORT
      document.getElementById('bf-csi-generate').addEventListener('click', function() {
        const today = new Date();
        const dateStr = today.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        let report = 'Bush-Francis Catatonia Screening (CSI)\n';
        report += 'Date: ' + dateStr + '\n\n';
        report += 'SCREENING ITEMS:\n';

        csiItems.forEach(num => {
          const checkbox = document.querySelector(`input[name="bf-csi-${num}"]`);
          const status = (checkbox && checkbox.checked) ? 'Present' : 'Absent';
          report += num + '. ' + itemNames[num] + ': ' + status + '\n';
        });

        const score = document.getElementById('bf-csi-score').textContent;
        const result = (parseInt(score) <= 1) ? 'Negative screen' : 'Positive screen — catatonia likely';

        report += '\nScreening Score: ' + score + '/14\n';
        report += 'Result: ' + result + '\n';

        const presentList = Array.from(document.querySelectorAll('input[name^="bf-csi-"]:checked'))
          .map(cb => itemNames[csiItems[csiItems.indexOf(parseInt(cb.name.split('-')[2]))]])
          .join(', ');

        if (presentList) {
          report += 'Items Present: ' + presentList + '\n';
        }

        navigator.clipboard.writeText(report).then(() => {
          const orig = this.textContent;
          this.textContent = 'Copied!';
          setTimeout(() => { this.textContent = orig; }, 2000);
        });
      });

      // CRS REPORT
      document.getElementById('bf-crs-generate').addEventListener('click', function() {
        const today = new Date();
        const dateStr = today.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        let report = 'Bush-Francis Catatonia Rating Scale (BFCRS)\n';
        report += 'Date: ' + dateStr + '\n\n';
        report += 'ITEM SCORES:\n';

        let severity = 0;
        let itemsPresent = 0;
        let screeningPositive = 0;

        for (let i = 1; i <= 23; i++) {
          const radio = document.querySelector(`input[name="bf-crs-${i}"]:checked`);
          const score = (radio) ? radio.value : '—';
          report += i + '. ' + itemNames[i] + ': ' + score + '\n';

          if (radio) {
            const scoreInt = parseInt(radio.value);
            severity += scoreInt;
            if (scoreInt > 0) itemsPresent++;
            if (csiItems.includes(i) && scoreInt > 0) screeningPositive++;
          }
        }

        let severityLabel = '';
        if (severity === 0) {
          severityLabel = 'No catatonia';
        } else if (severity <= 10) {
          severityLabel = 'Mild catatonia';
        } else if (severity <= 20) {
          severityLabel = 'Moderate catatonia';
        } else if (severity <= 30) {
          severityLabel = 'Severe catatonia';
        } else {
          severityLabel = 'Extreme catatonia';
        }

        report += '\nSUMMARY:\n';
        report += 'Severity Score: ' + severity + '/69\n';
        report += 'Items Present: ' + itemsPresent + '/23\n';
        report += 'Screening Items Positive: ' + screeningPositive + '/14\n';
        report += 'Severity: ' + severityLabel + '\n';

        // Subtype
        const retardedItems = [1, 2, 3, 4, 10, 13];
        const excitedItems = [14, 6, 7, 8, 15, 22];
        let retardedScore = 0;
        let excitedScore = 0;

        retardedItems.forEach(num => {
          const radio = document.querySelector(`input[name="bf-crs-${num}"]:checked`);
          if (radio) retardedScore += parseInt(radio.value);
        });

        excitedItems.forEach(num => {
          const radio = document.querySelector(`input[name="bf-crs-${num}"]:checked`);
          if (radio) excitedScore += parseInt(radio.value);
        });

        let subtype = 'Mixed';
        if (severity > 0) {
          if (retardedScore > excitedScore && retardedScore > 0) {
            subtype = 'Retarded/Withdrawn';
          } else if (excitedScore > retardedScore && excitedScore > 0) {
            subtype = 'Excited';
          }
        }

        report += 'Predominant Subtype: ' + subtype + '\n';

        // Malignant check
        const item14 = document.querySelector('input[name="bf-crs-14"]:checked');
        const item23 = document.querySelector('input[name="bf-crs-23"]:checked');

        if (item14 && item23 && parseInt(item14.value) > 0 && parseInt(item23.value) > 0) {
          report += '\nWARNING — Autonomic instability present. Evaluate for malignant catatonia (medical emergency).\n';
        }

        navigator.clipboard.writeText(report).then(() => {
          const orig = this.textContent;
          this.textContent = 'Copied!';
          setTimeout(() => { this.textContent = orig; }, 2000);
        });
      });

      // Initial score updates
      updateCSIScore();
      updateCRSScore();
    })();
  
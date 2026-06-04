
    (function() {
      const q1Radio = document.querySelectorAll('input[name="ci-q1"]');
      const q2Radio = document.querySelectorAll('input[name="ci-q2"]');
      const q3Radio = document.querySelectorAll('input[name="ci-q3"]');
      const symptomsCheckboxes = document.querySelectorAll('input[name="ci-symptoms"]');
      const q3Group = document.getElementById('ci-q3-group');
      const symptomsContainer = document.getElementById('ci-symptoms-container');
      const reportBtn = document.getElementById('ci-report-btn');
      const resetBtn = document.getElementById('ci-reset-btn');
      const scoreText = document.getElementById('ci-score-text');
      const riskBadge = document.getElementById('ci-risk-badge');
      const probabilityText = document.getElementById('ci-probability-text');

      // Symptom labels for report
      const symptomLabels = {
        irritability: 'Extreme irritability (shouting, fights, arguments)',
        restlessness: 'Restlessness or agitation (pacing, inability to sit still)',
        disinhibition: 'Unusual or embarrassing behavior (oversharing, disinhibition)',
        grandiosity: 'Inflated self-esteem or special powers/talents',
        'goal-directed': 'Increased goal-directed activity (multiple new projects)',
        concentration: 'Difficulty concentrating',
        racing: 'Racing or jumping thoughts',
        sleep: 'Decreased need for sleep (≤4 hours without fatigue)',
        spending: 'Excessive spending with financial consequences'
      };

      function updateDisplay() {
        const q1Value = getRadioValue('ci-q1');
        const q2Value = getRadioValue('ci-q2');
        const q3Value = getRadioValue('ci-q3');
        const symptomCount = getCheckedSymptoms().length;

        // Q3 is only enabled if at least one stem question is "Yes"
        const stemPassed = (q1Value === 'yes' || q2Value === 'yes');

        if (!stemPassed) {
          q3Group.classList.add('ci-disabled');
          symptomsContainer.classList.add('ci-disabled');
          // Show negative only if both stems are explicitly answered "No"
          if (q1Value === 'no' && q2Value === 'no') {
            displayNegativeScreen();
          } else {
            // Not all stems answered yet — show default
            scoreText.textContent = '—';
            riskBadge.innerHTML = '';
            probabilityText.textContent = '';
          }
          return;
        }

        // At least one stem is "Yes" — enable Q3
        q3Group.classList.remove('ci-disabled');

        // Symptoms only enabled if Q3 is explicitly "Yes"
        if (q3Value === 'yes') {
          symptomsContainer.classList.remove('ci-disabled');
          const riskData = calculateRisk(symptomCount);
          displayRisk(riskData, symptomCount);
        } else {
          symptomsContainer.classList.add('ci-disabled');
          if (q3Value === 'no') {
            displayNegativeScreen();
          } else {
            // Q3 not yet answered
            scoreText.textContent = '—';
            riskBadge.innerHTML = '';
            probabilityText.textContent = '';
          }
        }
      }

      function getRadioValue(name) {
        const selected = document.querySelector(`input[name="${name}"]:checked`);
        return selected ? selected.value : null;
      }

      function getCheckedSymptoms() {
        return Array.from(symptomsCheckboxes).filter(cb => cb.checked);
      }

      function displayNegativeScreen() {
        scoreText.textContent = 'Screen Negative';
        riskBadge.innerHTML = '<span class="ci-risk-negative">Negative Screen</span>';
        probabilityText.textContent = 'No evidence of bipolar disorder on screening.';
      }

      function calculateRisk(symptomCount) {
        if (symptomCount === 9) {
          return { level: 'Very High Risk', probability: '≥80%', class: 'ci-risk-very-high' };
        } else if (symptomCount >= 7) {
          return { level: 'High Risk', probability: '50–79%', class: 'ci-risk-high' };
        } else if (symptomCount === 6) {
          return { level: 'Moderate Risk', probability: '25–49%', class: 'ci-risk-moderate' };
        } else if (symptomCount === 5) {
          return { level: 'Low Risk', probability: '5–24%', class: 'ci-risk-low' };
        } else {
          return { level: 'Very Low Risk', probability: '<5%', class: 'ci-risk-very-low' };
        }
      }

      function displayRisk(riskData, symptomCount) {
        scoreText.textContent = `${symptomCount}/9 Symptoms`;
        riskBadge.innerHTML = `<span class="${riskData.class}">${riskData.level}</span>`;
        probabilityText.textContent = `Probability of bipolar disorder: ${riskData.probability}`;
      }

      function generateReport() {
        const q1Value = getRadioValue('ci-q1');
        const q2Value = getRadioValue('ci-q2');
        const q3Value = getRadioValue('ci-q3');
        const checkedSymptoms = getCheckedSymptoms();
        const symptomCount = checkedSymptoms.length;

        // Determine screen result
        let screenResult;
        if (q1Value === 'no' && q2Value === 'no') {
          screenResult = 'Negative (stem criteria not met)';
        } else if (q3Value === 'no') {
          screenResult = 'Negative (Criterion B gate not met)';
        } else {
          const riskData = calculateRisk(symptomCount);
          screenResult = `Positive: ${riskData.level} (${riskData.probability})`;
        }

        // Build symptom list
        let symptomList = '';
        if (checkedSymptoms.length > 0) {
          symptomList = checkedSymptoms
            .map(cb => `  - ${symptomLabels[cb.value]}`)
            .join('\n');
        }

        const today = new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        const report = `CIDI 3.0 Bipolar Screening Scale
Date: ${today}

Stem Questions:
  Euphoria (Q1—elevated mood): ${q1Value ? q1Value.toUpperCase() : 'Not answered'}
  Irritability (Q2—irritable mood): ${q2Value ? q2Value.toUpperCase() : 'Not answered'}
  Criterion B Gate (Q3): ${q3Value ? q3Value.toUpperCase() : 'Not answered'}

Screen Result: ${screenResult}

${checkedSymptoms.length > 0 ? `Criterion B Symptoms Endorsed (${symptomCount}/9):\n${symptomList}\n\n` : ''}Clinical Interpretation:
${
  q1Value === 'no' && q2Value === 'no'
    ? 'No evidence of mood elevation or significant irritability. Bipolar disorder screening negative.'
    : q3Value === 'no'
      ? 'Mood elevation or irritability reported, but no supporting Criterion B symptoms. Screening negative for bipolar disorder.'
      : symptomCount === 0
        ? 'Mood elevation/irritability endorsed but no associated symptoms. Low probability of bipolar disorder.'
        : symptomCount < 5
          ? 'Limited symptom endorsement. Consider broader differential diagnosis for mood disturbance.'
          : symptomCount < 7
            ? 'Moderate symptom burden. Recommend comprehensive psychiatric evaluation and assessment for bipolar II or cyclothymia.'
            : 'High symptom burden with significant mood dysregulation. Recommend urgent psychiatric evaluation and consideration of bipolar I or II disorder. Assess safety and need for inpatient evaluation.'
}`;

        // Copy to clipboard
        navigator.clipboard.writeText(report).then(() => {
          const originalText = reportBtn.textContent;
          reportBtn.textContent = 'Copied!';
          setTimeout(() => {
            reportBtn.textContent = originalText;
          }, 2000);
        });
      }

      function reset() {
        if (!confirm('Reset all answers and scores?')) {
          return;
        }
        q1Radio.forEach(r => (r.checked = false));
        q2Radio.forEach(r => (r.checked = false));
        q3Radio.forEach(r => (r.checked = false));
        symptomsCheckboxes.forEach(cb => (cb.checked = false));
        scoreText.textContent = '—';
        riskBadge.innerHTML = '';
        probabilityText.textContent = '';
        q3Group.classList.add('ci-disabled');
        symptomsContainer.classList.add('ci-disabled');
      }

      // Event listeners
      q1Radio.forEach(r => r.addEventListener('change', updateDisplay));
      q2Radio.forEach(r => r.addEventListener('change', updateDisplay));
      q3Radio.forEach(r => r.addEventListener('change', updateDisplay));
      symptomsCheckboxes.forEach(cb => cb.addEventListener('change', updateDisplay));
      reportBtn.addEventListener('click', generateReport);
      resetBtn.addEventListener('click', reset);

      // Add print button
      (function addPrintBtn() {
        var sec = document.getElementById('cidi-tool');
        if (!sec) return;
        var header = sec.querySelector('.section-header');
        if (!header) return;
        var btn = document.createElement('button');
        btn.className = 'pf-inline-btn';
        btn.onclick = function() { if (typeof printBlankForm === 'function') printBlankForm('cidi'); };
        btn.innerHTML = '🖨️ Print Blank Form';
        btn.title = 'Print a blank version of this form';
        header.appendChild(btn);
      })();
    })();
  
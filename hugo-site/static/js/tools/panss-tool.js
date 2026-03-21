
    (function() {
      'use strict';

      // Tab switching
      const tabButtons = document.querySelectorAll('.ps-tab-btn');
      const tabContents = document.querySelectorAll('.ps-tab-content');

      tabButtons.forEach(button => {
        button.addEventListener('click', function() {
          const tabId = this.getAttribute('data-tab') + '-tab';

          // Deactivate all tabs
          tabButtons.forEach(btn => btn.classList.remove('ps-tab-active'));
          tabContents.forEach(content => content.classList.remove('ps-tab-active'));

          // Activate selected tab
          this.classList.add('ps-tab-active');
          document.getElementById(tabId).classList.add('ps-tab-active');
        });
      });

      // Subscale accordion toggle for PANSS-30
      const subscaleHeaders = document.querySelectorAll('.ps-subscale-header');
      subscaleHeaders.forEach(header => {
        header.addEventListener('click', function() {
          const targetId = this.getAttribute('data-target');
          const targetElement = document.getElementById(targetId);

          this.classList.toggle('ps-subscale-open');
          targetElement.classList.toggle('ps-subscale-expanded');
        });
      });

      // PANSS-6 Scoring Logic
      function updatePANSS6Scores() {
        const form = document.getElementById('ps-form-6');
        const getScore = (name) => {
          const checked = form.querySelector(`input[name="${name}"]:checked`);
          return checked ? parseInt(checked.value) : 0;
        };

        const p1 = getScore('ps6-P1');
        const p2 = getScore('ps6-P2');
        const p3 = getScore('ps6-P3');
        const n1 = getScore('ps6-N1');
        const n4 = getScore('ps6-N4');
        const n6 = getScore('ps6-N6');

        const positiveScore = p1 + p2 + p3;
        const negativeScore = n1 + n4 + n6;
        const totalScore = positiveScore + negativeScore;

        document.querySelector('.ps-6-positive').textContent = positiveScore > 0 ? positiveScore : '—';
        document.querySelector('.ps-6-negative').textContent = negativeScore > 0 ? negativeScore : '—';
        document.querySelector('.ps-6-total').textContent = totalScore > 0 ? totalScore : '—';
      }

      // PANSS-30 Scoring Logic
      function updatePANSS30Scores() {
        const form = document.getElementById('ps-form-30');
        const getScore = (name) => {
          const checked = form.querySelector(`input[name="${name}"]:checked`);
          return checked ? parseInt(checked.value) : 0;
        };

        // Positive Scale (P1-P7)
        const positiveItems = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7'];
        const positiveScore = positiveItems.reduce((sum, item) => sum + getScore('ps30-' + item), 0);

        // Negative Scale (N1-N7)
        const negativeItems = ['N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7'];
        const negativeScore = negativeItems.reduce((sum, item) => sum + getScore('ps30-' + item), 0);

        // General Psychopathology (G1-G16)
        const generalItems = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10', 'G11', 'G12', 'G13', 'G14', 'G15', 'G16'];
        const generalScore = generalItems.reduce((sum, item) => sum + getScore('ps30-' + item), 0);

        // Total
        const totalScore = positiveScore + negativeScore + generalScore;
        const compositeIndex = positiveScore - negativeScore;

        // Severity interpretation
        let severity = '—';
        if (totalScore > 0) {
          if (totalScore <= 57) severity = 'Mild illness';
          else if (totalScore <= 74) severity = 'Moderate illness';
          else if (totalScore <= 95) severity = 'Marked illness';
          else if (totalScore <= 115) severity = 'Severe illness';
          else severity = 'Extremely severe';
        }

        // Marder Factors
        const marderPositive = getScore('ps30-P1') + getScore('ps30-P3') + getScore('ps30-P5') + getScore('ps30-P6') + getScore('ps30-G9');
        const marderNegative = getScore('ps30-N1') + getScore('ps30-N2') + getScore('ps30-N3') + getScore('ps30-N4') + getScore('ps30-N6') + getScore('ps30-G7');
        const marderDisorg = getScore('ps30-P2') + getScore('ps30-N5') + getScore('ps30-G11');
        const marderHostile = getScore('ps30-P4') + getScore('ps30-P7') + getScore('ps30-G8') + getScore('ps30-G14');
        const marderAnxiety = getScore('ps30-G2') + getScore('ps30-G3') + getScore('ps30-G4') + getScore('ps30-G6');

        // Update display
        document.querySelector('.ps-30-positive').textContent = positiveScore > 0 ? positiveScore : '—';
        document.querySelector('.ps-30-negative').textContent = negativeScore > 0 ? negativeScore : '—';
        document.querySelector('.ps-30-general').textContent = generalScore > 0 ? generalScore : '—';
        document.querySelector('.ps-30-total').textContent = totalScore > 0 ? totalScore : '—';
        document.querySelector('.ps-30-composite').textContent = totalScore > 0 ? (compositeIndex > 0 ? '+' + compositeIndex : compositeIndex) : '—';
        document.querySelector('.ps-30-severity').textContent = severity;
        document.querySelector('.ps-marder-positive').textContent = marderPositive > 0 ? marderPositive : '—';
        document.querySelector('.ps-marder-negative').textContent = marderNegative > 0 ? marderNegative : '—';
        document.querySelector('.ps-marder-disorg').textContent = marderDisorg > 0 ? marderDisorg : '—';
        document.querySelector('.ps-marder-hostile').textContent = marderHostile > 0 ? marderHostile : '—';
        document.querySelector('.ps-marder-anxiety').textContent = marderAnxiety > 0 ? marderAnxiety : '—';
      }

      // Event listeners for real-time updates
      document.getElementById('ps-form-6').querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', updatePANSS6Scores);
      });

      document.getElementById('ps-form-30').querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', updatePANSS30Scores);
      });

      // PANSS-6 Generate Report
      document.getElementById('ps6-generate').addEventListener('click', function() {
        const form = document.getElementById('ps-form-6');
        const getScore = (name) => {
          const checked = form.querySelector(`input[name="${name}"]:checked`);
          return checked ? parseInt(checked.value) : 0;
        };

        const p1 = getScore('ps6-P1');
        const p2 = getScore('ps6-P2');
        const p3 = getScore('ps6-P3');
        const n1 = getScore('ps6-N1');
        const n4 = getScore('ps6-N4');
        const n6 = getScore('ps6-N6');

        const positiveScore = p1 + p2 + p3;
        const negativeScore = n1 + n4 + n6;
        const totalScore = positiveScore + negativeScore;

        if (totalScore === 0) {
          var psWarn = document.querySelector('.ps-score-display'); if (psWarn) psWarn.innerHTML = '<div class="mt-warning">Please rate all items before generating a report.</div>';
          return;
        }

        const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        const report = `PANSS-6 (Brief Psychosis Assessment)
Date: ${today}

ITEM SCORES:
P1. Delusions: ${p1}
P2. Conceptual Disorganization: ${p2}
P3. Hallucinatory Behavior: ${p3}
N1. Blunted Affect: ${n1}
N4. Passive/Apathetic Social Withdrawal: ${n4}
N6. Lack of Spontaneity: ${n6}

SUBSCALE SCORES:
Positive Subscale: ${positiveScore}/21
Negative Subscale: ${negativeScore}/21
Total PANSS-6: ${totalScore}/42

Note: Interpret in clinical context alongside CGI-S rating. No formal severity cut-offs established.`;

        const btn = document.getElementById('ps6-generate');
        navigator.clipboard.writeText(report).then(() => {
          const orig = btn.textContent;
          btn.textContent = 'Copied!';
          setTimeout(() => { btn.textContent = orig; }, 2000);
        });
      });

      // PANSS-6 Reset
      document.getElementById('ps6-reset').addEventListener('click', function() {
        if (confirm('Are you sure you want to reset all ratings?')) {
          document.getElementById('ps-form-6').reset();
          updatePANSS6Scores();
        }
      });

      // PANSS-30 Generate Report
      document.getElementById('ps30-generate').addEventListener('click', function() {
        const form = document.getElementById('ps-form-30');
        const getScore = (name) => {
          const checked = form.querySelector(`input[name="${name}"]:checked`);
          return checked ? parseInt(checked.value) : 0;
        };

        const positiveItems = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7'];
        const positiveScore = positiveItems.reduce((sum, item) => sum + getScore('ps30-' + item), 0);

        const negativeItems = ['N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7'];
        const negativeScore = negativeItems.reduce((sum, item) => sum + getScore('ps30-' + item), 0);

        const generalItems = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10', 'G11', 'G12', 'G13', 'G14', 'G15', 'G16'];
        const generalScore = generalItems.reduce((sum, item) => sum + getScore('ps30-' + item), 0);

        const totalScore = positiveScore + negativeScore + generalScore;
        const compositeIndex = positiveScore - negativeScore;

        if (totalScore === 0) {
          var psWarn2 = document.querySelector('.ps-score-display'); if (psWarn2) psWarn2.innerHTML = '<div class="mt-warning">Please rate all items before generating a report.</div>';
          return;
        }

        let severity = '';
        if (totalScore <= 57) severity = 'Mild illness';
        else if (totalScore <= 74) severity = 'Moderate illness';
        else if (totalScore <= 95) severity = 'Marked illness';
        else if (totalScore <= 115) severity = 'Severe illness';
        else severity = 'Extremely severe';

        const marderPositive = getScore('ps30-P1') + getScore('ps30-P3') + getScore('ps30-P5') + getScore('ps30-P6') + getScore('ps30-G9');
        const marderNegative = getScore('ps30-N1') + getScore('ps30-N2') + getScore('ps30-N3') + getScore('ps30-N4') + getScore('ps30-N6') + getScore('ps30-G7');
        const marderDisorg = getScore('ps30-P2') + getScore('ps30-N5') + getScore('ps30-G11');
        const marderHostile = getScore('ps30-P4') + getScore('ps30-P7') + getScore('ps30-G8') + getScore('ps30-G14');
        const marderAnxiety = getScore('ps30-G2') + getScore('ps30-G3') + getScore('ps30-G4') + getScore('ps30-G6');

        const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        const report = `PANSS-30 (Full Psychosis Assessment)
Date: ${today}

POSITIVE SCALE (P1-P7): ${positiveScore}/49
P1. Delusions: ${getScore('ps30-P1')}
P2. Conceptual Disorganization: ${getScore('ps30-P2')}
P3. Hallucinatory Behavior: ${getScore('ps30-P3')}
P4. Excitement: ${getScore('ps30-P4')}
P5. Grandiosity: ${getScore('ps30-P5')}
P6. Suspiciousness/Persecution: ${getScore('ps30-P6')}
P7. Hostility: ${getScore('ps30-P7')}

NEGATIVE SCALE (N1-N7): ${negativeScore}/49
N1. Blunted Affect: ${getScore('ps30-N1')}
N2. Emotional Withdrawal: ${getScore('ps30-N2')}
N3. Poor Rapport: ${getScore('ps30-N3')}
N4. Passive/Apathetic Social Withdrawal: ${getScore('ps30-N4')}
N5. Difficulty in Abstract Thinking: ${getScore('ps30-N5')}
N6. Lack of Spontaneity and Flow of Conversation: ${getScore('ps30-N6')}
N7. Stereotyped Thinking: ${getScore('ps30-N7')}

GENERAL PSYCHOPATHOLOGY (G1-G16): ${generalScore}/112
G1. Somatic Concern: ${getScore('ps30-G1')}
G2. Anxiety: ${getScore('ps30-G2')}
G3. Guilt Feelings: ${getScore('ps30-G3')}
G4. Tension: ${getScore('ps30-G4')}
G5. Mannerisms and Posturing: ${getScore('ps30-G5')}
G6. Depression: ${getScore('ps30-G6')}
G7. Motor Retardation: ${getScore('ps30-G7')}
G8. Uncooperativeness: ${getScore('ps30-G8')}
G9. Unusual Thought Content: ${getScore('ps30-G9')}
G10. Disorientation: ${getScore('ps30-G10')}
G11. Poor Attention: ${getScore('ps30-G11')}
G12. Lack of Judgment and Insight: ${getScore('ps30-G12')}
G13. Disturbance of Volition: ${getScore('ps30-G13')}
G14. Poor Impulse Control: ${getScore('ps30-G14')}
G15. Preoccupation: ${getScore('ps30-G15')}
G16. Active Social Avoidance: ${getScore('ps30-G16')}

TOTAL PANSS: ${totalScore}/210
Composite Index (P - N): ${compositeIndex > 0 ? '+' + compositeIndex : compositeIndex}
Severity: ${severity}

MARDER FACTOR ANALYSIS:
Positive Symptoms (P1,P3,P5,P6,G9): ${marderPositive}/35
Negative Symptoms (N1,N2,N3,N4,N6,G7): ${marderNegative}/42
Disorganized Thought (P2,N5,G11): ${marderDisorg}/21
Uncontrolled Hostility/Excitement (P4,P7,G8,G14): ${marderHostile}/28
Anxiety/Depression (G2,G3,G4,G6): ${marderAnxiety}/28`;

        const btn = document.getElementById('ps30-generate');
        navigator.clipboard.writeText(report).then(() => {
          const orig = btn.textContent;
          btn.textContent = 'Copied!';
          setTimeout(() => { btn.textContent = orig; }, 2000);
        });
      });

      // PANSS-30 Reset
      document.getElementById('ps30-reset').addEventListener('click', function() {
        if (confirm('Are you sure you want to reset all ratings?')) {
          document.getElementById('ps-form-30').reset();
          updatePANSS30Scores();
        }
      });

    })();
  
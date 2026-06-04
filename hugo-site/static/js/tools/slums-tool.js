
        (function() {
          'use strict';
    
          // Domain configurations
          // Each question assigned to ONE primary domain so domain scores sum to 30
          // Cross-domain involvement noted in clinical commentary only
          const domainConfig = {
            orientation: { maxPoints: 3, questions: ['1', '2', '3'] },
            executive: { maxPoints: 3, questions: ['5a', '5b'] },
            attention: { maxPoints: 2, questions: ['10-triangle', '10-largest'] },
            memory: { maxPoints: 13, questions: ['7-apple', '7-pen', '7-tie', '7-house', '7-car', '11-name', '11-work', '11-when', '11-state'] },
            workingmemory: { maxPoints: 2, questions: ['8-648', '8-8537'] },
            language: { maxPoints: 3, questions: ['6'] },
            visuospatial: { maxPoints: 4, questions: ['9-markers', '9-time'] }
          };
    
          const scores = {
            '1': 0, '2': 0, '3': 0,
            '5a': 0, '5b': 0,
            '6': 0,
            '7-apple': 0, '7-pen': 0, '7-tie': 0, '7-house': 0, '7-car': 0,
            '8-648': 0, '8-8537': 0,
            '9-markers': 0, '9-time': 0,
            '10-triangle': 0, '10-largest': 0,
            '11-name': 0, '11-work': 0, '11-when': 0, '11-state': 0
          };
    
          // Initialize event listeners
          function init() {
            const checkboxes = document.querySelectorAll('.sl-q-check');
            const radios = document.querySelectorAll('.sl-q-radio');
            const resetBtn = document.getElementById('sl-reset-btn');
            const copyBtn = document.getElementById('sl-copy-summary');
    
            checkboxes.forEach(cb => {
              cb.addEventListener('change', handleCheckboxChange);
            });
    
            radios.forEach(r => {
              r.addEventListener('change', handleRadioChange);
            });
    
            resetBtn.addEventListener('click', resetExam);
            copyBtn.addEventListener('click', copySummary);
          }
    
          function handleCheckboxChange(e) {
            const q = e.target.dataset.question;
            const points = parseInt(e.target.dataset.points, 10);
            scores[q] = e.target.checked ? points : 0;
            updateScores();
          }
    
          function handleRadioChange(e) {
            const q = e.target.dataset.question;
            const points = parseInt(e.target.dataset.points, 10);
            scores[q] = points;
            updateScores();
          }
    
          function updateScores() {
            // Calculate total from individual question scores (not domain sums, since questions map to multiple domains)
            let totalScore = 0;
            Object.keys(scores).forEach(q => {
              totalScore += scores[q] || 0;
            });

            // Calculate domain scores (for domain analysis display only)
            const domainScores = {};
            Object.keys(domainConfig).forEach(domain => {
              let domainScore = 0;
              domainConfig[domain].questions.forEach(q => {
                domainScore += scores[q] || 0;
              });
              domainScores[domain] = domainScore;
            });
    
            // Update total score display
            document.getElementById('sl-total-score').textContent = totalScore;
    
            // Update interpretation
            const eduLevel = document.querySelector('input[name="sl-education"]:checked').value;
            updateInterpretation(totalScore, eduLevel);
    
            // Update domain displays
            Object.keys(domainScores).forEach(domain => {
              updateDomainDisplay(domain, domainScores[domain], domainConfig[domain].maxPoints);
            });
    
            // Update summary
            updateSummary(totalScore, domainScores);
    
            // Show results section
            document.querySelector('.sl-results-section').classList.add('sl-show');
          }
    
          function updateInterpretation(score, eduLevel) {
            const interpDiv = document.getElementById('sl-interpretation');
            let category, note, className;
    
            if (eduLevel === 'high-school') {
              if (score >= 27) {
                category = 'Normal';
                note = 'No cognitive impairment detected.';
                className = 'sl-interp-normal';
              } else if (score >= 21) {
                category = 'Mild Neurocognitive Disorder (MNCD)';
                note = 'Cognitive decline present; comprehensive evaluation recommended.';
                className = 'sl-interp-mncd';
              } else {
                category = 'Dementia';
                note = 'Significant cognitive impairment; urgent neuropsychological evaluation indicated.';
                className = 'sl-interp-dementia';
              }
            } else {
              if (score >= 25) {
                category = 'Normal';
                note = 'No cognitive impairment detected.';
                className = 'sl-interp-normal';
              } else if (score >= 20) {
                category = 'Mild Neurocognitive Disorder (MNCD)';
                note = 'Cognitive decline present; comprehensive evaluation recommended.';
                className = 'sl-interp-mncd';
              } else {
                category = 'Dementia';
                note = 'Significant cognitive impairment; urgent neuropsychological evaluation indicated.';
                className = 'sl-interp-dementia';
              }
            }
    
            interpDiv.className = className;
            interpDiv.querySelector('.sl-interp-category').textContent = category;
            interpDiv.querySelector('.sl-interp-note').textContent = note;
          }
    
          function updateDomainDisplay(domain, score, maxScore) {
            const scoreEl = document.getElementById(`sl-score-${domain}`);
            const barEl = document.getElementById(`sl-bar-${domain}`);
            const noteEl = document.getElementById(`sl-note-${domain}`);
    
            scoreEl.textContent = score;
    
            const percent = (score / maxScore) * 100;
            barEl.style.width = percent + '%';
    
            // Color coding: ≥80% green, 50-79% yellow, <50% red
            barEl.classList.remove('sl-warning', 'sl-critical');
            if (percent < 50) {
              barEl.classList.add('sl-critical');
            } else if (percent < 80) {
              barEl.classList.add('sl-warning');
            }
    
            // Show clinical note only if domain is impaired (score < max)
            if (score < maxScore) {
              noteEl.classList.add('sl-show');
            } else {
              noteEl.classList.remove('sl-show');
            }
          }
    
          function updateSummary(totalScore, domainScores) {
            const eduLevel = document.querySelector('input[name="sl-education"]:checked').value;
            const eduDisplay = eduLevel === 'high-school' ? 'High School or Higher' : 'Less Than High School';
    
            let summary = `SLUMS Examination Summary\n`;
            summary += `${'='.repeat(50)}\n\n`;
            summary += `Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\n`;
            summary += `Education Level: ${eduDisplay}\n\n`;
            summary += `TOTAL SCORE: ${totalScore}/30\n`;
    
            // Interpretation
            let category, note;
            if (eduLevel === 'high-school') {
              if (totalScore >= 27) {
                category = 'NORMAL';
                note = 'No cognitive impairment detected.';
              } else if (totalScore >= 21) {
                category = 'MILD NEUROCOGNITIVE DISORDER (MNCD)';
                note = 'Cognitive decline present; comprehensive evaluation recommended.';
              } else {
                category = 'DEMENTIA';
                note = 'Significant cognitive impairment; urgent neuropsychological evaluation indicated.';
              }
            } else {
              if (totalScore >= 25) {
                category = 'NORMAL';
                note = 'No cognitive impairment detected.';
              } else if (totalScore >= 20) {
                category = 'MILD NEUROCOGNITIVE DISORDER (MNCD)';
                note = 'Cognitive decline present; comprehensive evaluation recommended.';
              } else {
                category = 'DEMENTIA';
                note = 'Significant cognitive impairment; urgent neuropsychological evaluation indicated.';
              }
            }
    
            summary += `Interpretation: ${category}\n${note}\n\n`;
    
            summary += `QUESTION-BY-QUESTION RESULTS\n`;
            summary += `${'─'.repeat(50)}\n`;
            summary += `Q1 (Day of Week):              ${scores['1']}/1\n`;
            summary += `Q2 (Year):                    ${scores['2']}/1\n`;
            summary += `Q3 (State):                   ${scores['3']}/1\n`;
            summary += `Q5A (Spending):               ${scores['5a']}/1\n`;
            summary += `Q5B (Money Left):             ${scores['5b']}/2\n`;
            summary += `Q6 (Animal Naming):           ${scores['6']}/3\n`;
            summary += `Q7A (Apple - Recall):         ${scores['7-apple']}/1\n`;
            summary += `Q7B (Pen - Recall):           ${scores['7-pen']}/1\n`;
            summary += `Q7C (Tie - Recall):           ${scores['7-tie']}/1\n`;
            summary += `Q7D (House - Recall):         ${scores['7-house']}/1\n`;
            summary += `Q7E (Car - Recall):           ${scores['7-car']}/1\n`;
            summary += `Q8A (648 Backwards):          ${scores['8-648']}/1\n`;
            summary += `Q8B (8537 Backwards):         ${scores['8-8537']}/1\n`;
            summary += `Q9A (Clock Markers):          ${scores['9-markers']}/2\n`;
            summary += `Q9B (Clock Time):             ${scores['9-time']}/2\n`;
            summary += `Q10A (Triangle X):            ${scores['10-triangle']}/1\n`;
            summary += `Q10B (Largest Figure):        ${scores['10-largest']}/1\n`;
            summary += `Q11A (Story Name):            ${scores['11-name']}/2\n`;
            summary += `Q11B (Story Work):            ${scores['11-work']}/2\n`;
            summary += `Q11C (Story Timing):          ${scores['11-when']}/2\n`;
            summary += `Q11D (Story State):           ${scores['11-state']}/2\n\n`;
    
            summary += `COGNITIVE DOMAIN ANALYSIS\n`;
            summary += `${'─'.repeat(50)}\n`;
            summary += `Orientation/Temporal-Spatial: ${domainScores.orientation}/3\n`;
            summary += `Executive Functioning:        ${domainScores.executive}/3\n`;
            summary += `Attention & Concentration:    ${domainScores.attention}/2\n`;
            summary += `Memory (Episodic Retrieval):  ${domainScores.memory}/13\n`;
            summary += `Working Memory:               ${domainScores.workingmemory}/2\n`;
            summary += `Language/Processing Speed:    ${domainScores.language}/3\n`;
            summary += `Visuospatial/Construction:    ${domainScores.visuospatial}/4\n\n`;

            // Impaired domains with commentary
            const impairedDomains = [];
            if (domainScores.orientation < 3) impairedDomains.push('orientation');
            if (domainScores.executive < 3) impairedDomains.push('executive');
            if (domainScores.attention < 2) impairedDomains.push('attention');
            if (domainScores.memory < 13) impairedDomains.push('memory');
            if (domainScores.workingmemory < 2) impairedDomains.push('workingmemory');
            if (domainScores.language < 3) impairedDomains.push('language');
            if (domainScores.visuospatial < 4) impairedDomains.push('visuospatial');
    
            if (impairedDomains.length > 0) {
              summary += `IMPAIRED DOMAINS (Clinical Commentary)\n`;
              summary += `${'─'.repeat(50)}\n`;
    
              if (impairedDomains.includes('orientation')) {
                summary += `\nOrientation: Involves hippocampus, medial temporal lobe, thalamus.\n`;
                summary += `Temporal disorientation often precedes spatial disorientation in Alzheimer's disease.\n`;
              }
              if (impairedDomains.includes('executive')) {
                summary += `\nExecutive (Q5 Calculation): Involves prefrontal cortex (dorsolateral), anterior cingulate.\n`;
                summary += `Deficits manifest as impaired calculation and multi-step reasoning.\n`;
                summary += `Note: Clock drawing (Q9) and story recall (Q11) also engage executive function.\n`;
              }
              if (impairedDomains.includes('attention')) {
                summary += `\nAttention: Involves frontal/parietal networks, reticular activating system.\n`;
                summary += `Impaired early in delirium and ADHD. Sustained attention required for multi-step tasks.\n`;
              }
              if (impairedDomains.includes('memory')) {
                summary += `\nMemory: Involves hippocampus, medial temporal lobe, Papez circuit.\n`;
                summary += `Disproportionate memory loss suggests Alzheimer's-pattern impairment.\n`;
                summary += `Distinguish encoding failure vs. retrieval failure for pathology classification.\n`;
              }
              if (impairedDomains.includes('workingmemory')) {
                summary += `\nWorking Memory: Involves dorsolateral prefrontal cortex, posterior parietal cortex.\n`;
                summary += `Impaired in frontostriatal conditions, schizophrenia, and delirium.\n`;
              }
              if (impairedDomains.includes('language')) {
                summary += `\nLanguage/Processing: Involves left temporal lobe (Wernicke's), frontal-subcortical.\n`;
                summary += `Animal fluency taxes language networks and processing speed.\n`;
                summary += `Reduced output may reflect frontal-subcortical or temporal pathology.\n`;
              }
              if (impairedDomains.includes('visuospatial')) {
                summary += `\nVisuospatial: Involves right parietal lobe, parietal-occipital junction.\n`;
                summary += `Clock drawing engages construction and executive planning.\n`;
                summary += `Disproportionate impairment suggests right parietal pathology or Lewy body dementia.\n`;
              }
            }
    
            summary += `\n${'='.repeat(50)}\n`;
            summary += `Reference: Tariq SH, Tumosa N, Chibnall JT, Perry HM III, Morley JE.\n`;
            summary += `The Saint Louis University Mental Status (SLUMS) Examination for detecting mild\n`;
            summary += `cognitive impairment and dementia is more sensitive than the Mini-Mental Status\n`;
            summary += `Examination (MMSE)—A pilot study. Am J Geriatr Psych. 2006;14:900-910.\n`;
    
            document.getElementById('sl-summary-text').textContent = summary;
          }
    
          function resetExam() {
            // Reset scores
            Object.keys(scores).forEach(k => {
              scores[k] = 0;
            });
    
            // Uncheck all checkboxes
            document.querySelectorAll('.sl-q-check').forEach(cb => {
              cb.checked = false;
            });
    
            // Deselect all radios
            document.querySelectorAll('.sl-q-radio').forEach(r => {
              r.checked = false;
            });
    
            // Hide results
            document.querySelector('.sl-results-section').classList.remove('sl-show');
          }
    
          function copySummary() {
            const text = document.getElementById('sl-summary-text').textContent;
            navigator.clipboard.writeText(text).then(() => {
              const feedback = document.getElementById('sl-copy-feedback');
              feedback.textContent = 'Summary copied to clipboard!';
              feedback.classList.add('sl-show');
              setTimeout(() => {
                feedback.classList.remove('sl-show');
              }, 2000);
            }).catch(() => {
              var fb = document.querySelector('.sl-copy-feedback');
              if (fb) { fb.textContent = 'Copy failed'; fb.classList.add('sl-show'); setTimeout(function(){ fb.classList.remove('sl-show'); }, 2000); }
            });
          }

          // Initialize on page load
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
          } else {
            init();
          }

          // ── Q6 Animal Naming 1-Minute Timer ──
          (function() {
            var TOTAL = 60;
            var remaining = TOTAL;
            var interval = null;
            var running = false;
            var circumference = 2 * Math.PI * 52; // matches r=52 in SVG

            var display = document.getElementById('sl-timer-display');
            var progress = document.getElementById('sl-timer-progress');
            var startBtn = document.getElementById('sl-timer-start');
            var resetBtn = document.getElementById('sl-timer-reset');

            function fmt(sec) {
              var m = Math.floor(sec / 60);
              var s = sec % 60;
              return m + ':' + (s < 10 ? '0' : '') + s;
            }

            function render() {
              display.textContent = fmt(remaining);
              var pct = remaining / TOTAL;
              progress.setAttribute('stroke-dashoffset', circumference * (1 - pct));
              // Color shifts: green → gold → red
              if (remaining <= 10) {
                progress.setAttribute('stroke', '#b91c1c');
              } else if (remaining <= 20) {
                progress.setAttribute('stroke', 'var(--accent2)');
              } else {
                progress.setAttribute('stroke', 'var(--accent)');
              }
            }

            function tick() {
              if (remaining <= 0) {
                stop();
                display.classList.add('sl-timer-done');
                display.textContent = '0:00';
                startBtn.textContent = 'Done';
                startBtn.disabled = true;
                startBtn.style.opacity = '0.5';
                return;
              }
              remaining--;
              render();
            }

            function start() {
              if (remaining <= 0) return;
              running = true;
              display.classList.remove('sl-timer-done');
              startBtn.textContent = 'Pause';
              startBtn.classList.add('sl-timer-running');
              interval = setInterval(tick, 1000);
            }

            function pause() {
              running = false;
              clearInterval(interval);
              interval = null;
              startBtn.textContent = 'Resume';
              startBtn.classList.remove('sl-timer-running');
            }

            function stop() {
              running = false;
              clearInterval(interval);
              interval = null;
            }

            function reset() {
              stop();
              remaining = TOTAL;
              display.classList.remove('sl-timer-done');
              startBtn.textContent = 'Start';
              startBtn.classList.remove('sl-timer-running');
              startBtn.disabled = false;
              startBtn.style.opacity = '';
              render();
            }

            if (startBtn) {
              startBtn.addEventListener('click', function() {
                if (running) pause(); else start();
              });
            }
            if (resetBtn) {
              resetBtn.addEventListener('click', reset);
            }

            render();
          })();

        })();
      
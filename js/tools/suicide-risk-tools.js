
      (function() {
        // ──────── TAB SYSTEM ────────
        const tabButtons = document.querySelectorAll('.sr-tab-btn');
        const tabContents = document.querySelectorAll('.sr-tab-content');
    
        tabButtons.forEach(btn => {
          btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
    
            // Deactivate all tabs
            tabButtons.forEach(b => b.classList.remove('sr-active'));
            tabContents.forEach(c => c.classList.remove('sr-active'));
    
            // Activate clicked tab
            this.classList.add('sr-active');
            document.getElementById(tabId).classList.add('sr-active');
          });
        });
    
        // ──────── ACCORDION SYSTEM ────────
        const accordionHeaders = document.querySelectorAll('.sr-accordion-header');
        accordionHeaders.forEach((header, index) => {
          // Auto-open first accordion on load
          if (index === 0 && header.closest('#ssrs-full')) {
            header.classList.add('sr-open');
            header.nextElementSibling.classList.add('sr-open');
          }
    
          header.addEventListener('click', function(e) {
            e.preventDefault();
            const content = this.nextElementSibling;
            const isOpen = this.classList.contains('sr-open');
    
            // Close all accordions in this form
            const form = this.closest('form');
            if (form) {
              form.querySelectorAll('.sr-accordion-header').forEach(h => {
                h.classList.remove('sr-open');
                h.nextElementSibling.classList.remove('sr-open');
              });
            }
    
            // Toggle current if was closed
            if (!isOpen) {
              this.classList.add('sr-open');
              content.classList.add('sr-open');
            }
          });
        });
    
        // ──────── TOOL 1: C-SSRS SCREEN ────────
        const q2Radio = document.querySelectorAll('input[name="q2"]');
        const q6Radio = document.querySelectorAll('input[name="q6"]');
        const q1Radio = document.querySelectorAll('input[name="q1"]');
    
        function updateScreenConditional() {
          const q2Yes = document.getElementById('q2_yes').checked;
          const q6Yes = document.getElementById('q6_yes').checked;
    
          // Show Q3-Q5 only if Q2 = Yes
          document.getElementById('q3-group').classList.toggle('sr-hidden', !q2Yes);
          document.getElementById('q4-group').classList.toggle('sr-hidden', !q2Yes);
          document.getElementById('q5-group').classList.toggle('sr-hidden', !q2Yes);
    
          // Show Q6 sub-question if Q6 = Yes
          document.getElementById('q6-subquestion').style.display = q6Yes ? 'block' : 'none';
        }
    
        q2Radio.forEach(r => r.addEventListener('change', updateScreenConditional));
        q6Radio.forEach(r => r.addEventListener('change', updateScreenConditional));
    
        document.getElementById('sr-screen-score').addEventListener('click', function() {
          const q1 = document.querySelector('input[name="q1"]:checked')?.value;
          const q2 = document.querySelector('input[name="q2"]:checked')?.value;
          const q3 = document.querySelector('input[name="q3"]:checked')?.value;
          const q4 = document.querySelector('input[name="q4"]:checked')?.value;
          const q5 = document.querySelector('input[name="q5"]:checked')?.value;
          const q6 = document.querySelector('input[name="q6"]:checked')?.value;
          const q6sub = document.querySelector('input[name="q6sub"]:checked')?.value;
    
          let riskLevel = 'NONE';
          let riskColor = 'sr-result-none';
          let guidance = 'No current suicidal ideation or behavior identified. Continue routine screening per clinical protocol.';
    
          // HIGH RISK
          if ((q6 === 'yes' && q6sub === 'yes') || q4 === 'yes' || q5 === 'yes') {
            riskLevel = 'HIGH RISK';
            riskColor = 'sr-result-high';
            guidance = 'Immediate safety assessment required. Consider psychiatric consultation, safety planning, and determine appropriate level of care. Restrict access to lethal means.';
          }
          // MODERATE RISK
          else if (q3 === 'yes' || (q6 === 'yes' && q6sub !== 'yes')) {
            riskLevel = 'MODERATE RISK';
            riskColor = 'sr-result-moderate';
            guidance = 'Further evaluation recommended. Develop or review safety plan. Consider increasing frequency of contact and monitoring.';
          }
          // LOW RISK
          else if (q1 === 'yes' || q2 === 'yes') {
            riskLevel = 'LOW RISK';
            riskColor = 'sr-result-low';
            guidance = 'Continue monitoring. Address underlying conditions. Provide crisis resources (988 Suicide & Crisis Lifeline).';
          }
    
          const resultBox = document.getElementById('sr-screen-result');
          resultBox.innerHTML = `
            <div class="sr-result-box ${riskColor}">
              <div class="sr-result-title">${riskLevel}</div>
              <div class="sr-result-guidance">${guidance}</div>
            </div>
          `;
          resultBox.style.display = 'block';
          document.getElementById('sr-screen-copy').style.display = 'inline-block';
    
          // Scroll to result
          resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    
        document.getElementById('sr-screen-copy').addEventListener('click', function() {
          const q1 = document.querySelector('input[name="q1"]:checked')?.value;
          const q2 = document.querySelector('input[name="q2"]:checked')?.value;
          const q3 = document.querySelector('input[name="q3"]:checked')?.value;
          const q4 = document.querySelector('input[name="q4"]:checked')?.value;
          const q5 = document.querySelector('input[name="q5"]:checked')?.value;
          const q6 = document.querySelector('input[name="q6"]:checked')?.value;
          const q6sub = document.querySelector('input[name="q6sub"]:checked')?.value;
    
          let riskLevel = 'NONE';
          if ((q6 === 'yes' && q6sub === 'yes') || q4 === 'yes' || q5 === 'yes') riskLevel = 'HIGH RISK';
          else if (q3 === 'yes' || (q6 === 'yes' && q6sub !== 'yes')) riskLevel = 'MODERATE RISK';
          else if (q1 === 'yes' || q2 === 'yes') riskLevel = 'LOW RISK';
    
          const summary = `────────────────────────────────────────────
    C-SSRS SCREEN VERSION SUMMARY
    ────────────────────────────────────────────
    Generated: ${new Date().toLocaleString()}
    
    RESPONSES:
    Q1 Wish to be dead: ${q1 || 'Not answered'}
    Q2 Suicidal thoughts: ${q2 || 'Not answered'}
    Q3 Method consideration: ${q3 || 'Not applicable'}
    Q4 Intent to act: ${q4 || 'Not applicable'}
    Q5 Plan and intent: ${q5 || 'Not applicable'}
    Q6 Actual attempt/prep: ${q6 || 'Not answered'}
       Past 3 months: ${q6sub || 'Not applicable'}
    
    RISK ASSESSMENT: ${riskLevel}
    
    ────────────────────────────────────────────`;
    
          navigator.clipboard.writeText(summary).then(() => {
            const btn = this;
            const origText = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => { btn.textContent = origText; }, 2000);
          });
        });
    
        // ──────── TOOL 2: C-SSRS FULL ASSESSMENT ────────
        // Enable/disable intensity selects based on ideation
        function updateIntensitySelects() {
          const hasIdeation = Array.from(document.querySelectorAll('[id^="ideation"]:checked')).length > 0;
          document.querySelectorAll('.sr-intensity-select').forEach(select => {
            select.disabled = !hasIdeation;
          });
        }
    
        document.getElementById('sr-ideation-group').querySelectorAll('input[type="checkbox"]').forEach(cb => {
          cb.addEventListener('change', updateIntensitySelects);
        });
    
        // Show/hide potential lethality based on actual lethality selection
        ['recent', 'lethal', 'initial'].forEach(attemptType => {
          const actualSelect = document.getElementById(`lethality_${attemptType}_actual`);
          const potentialRow = document.getElementById(`lethality_${attemptType}_potential_row`);
          const potentialSelect = document.getElementById(`lethality_${attemptType}_potential`);
    
          if (actualSelect) {
            actualSelect.addEventListener('change', function() {
              potentialRow.style.display = this.value === '0' ? 'grid' : 'none';
              if (this.value !== '0') potentialSelect.value = '';
            });
          }
        });
    
        document.getElementById('sr-full-summary').addEventListener('click', function() {
          const form = document.getElementById('sr-full-form');
          const now = new Date().toLocaleString();
    
          let summary = `────────────────────────────────────────────
    C-SSRS FULL RISK ASSESSMENT SUMMARY
    ────────────────────────────────────────────
    Generated: ${now}
    
    SECTION A: RISK & PROTECTIVE FACTORS
    ────────────────────────────────────────────
    
    RISK FACTORS CHECKED:`;
    
          // Collect risk factors
          const riskFactors = {
            'Suicidal & Self-Injury Behavior': [
              'risk_attempt', 'risk_attempt_lt', 'risk_interrupted', 'risk_interrupted_lt',
              'risk_aborted', 'risk_aborted_lt', 'risk_prep', 'risk_prep_lt', 'risk_nssi', 'risk_nssi_lt'
            ],
            'Suicide Ideation': [
              'risk_wish_dead', 'risk_thoughts', 'risk_method', 'risk_intent', 'risk_plan_intent'
            ],
            'Activating Events': [
              'risk_loss', 'risk_legal', 'risk_isolation'
            ],
            'Treatment History': [
              'risk_prior_tx', 'risk_hopeless_tx', 'risk_noncompliant', 'risk_no_tx'
            ],
            'Clinical Status': [
              'risk_hopeless', 'risk_helpless', 'risk_trapped', 'risk_mde', 'risk_mixed',
              'risk_command', 'risk_impulsive', 'risk_substance', 'risk_agitation', 'risk_burden',
              'risk_pain', 'risk_homicidal', 'risk_aggressive', 'risk_method_avail', 'risk_refuse_safety',
              'risk_sexual_abuse', 'risk_fam_suicide'
            ]
          };
    
          for (const [category, items] of Object.entries(riskFactors)) {
            const checked = items.filter(id => document.getElementById(id)?.checked);
            if (checked.length > 0) {
              summary += `\n  ${category}:\n`;
              checked.forEach(id => {
                const label = document.querySelector(`label[for="${id}"]`);
                if (label) summary += `    ✓ ${label.textContent.trim()}\n`;
              });
            }
          }
    
          summary += '\nPROTECTIVE FACTORS CHECKED:\n';
          const protectiveItems = [
            'protect_reasons', 'protect_family', 'protect_support', 'protect_fear_death',
            'protect_spiritual', 'protect_work', 'protect_treatment', 'protect_other'
          ];
          const checkedProtective = protectiveItems.filter(id => document.getElementById(id)?.checked);
          if (checkedProtective.length > 0) {
            checkedProtective.forEach(id => {
              const label = document.querySelector(`label[for="${id}"]`);
              if (label) summary += `  ✓ ${label.textContent.trim()}\n`;
            });
          } else {
            summary += '  None selected\n';
          }
    
          const behaviorNotes = document.getElementById('sr-full-behavior-notes').value;
          if (behaviorNotes.trim()) {
            summary += `\nBehavior Notes:\n${behaviorNotes}\n`;
          }
    
          summary += '\nSECTION B: SUICIDAL IDEATION ASSESSMENT\n';
          summary += '────────────────────────────────────────────\n';
          const ideationItems = [
            { id: '1', label: 'Wish to be Dead' },
            { id: '2', label: 'Non-Specific Active Suicidal Thoughts' },
            { id: '3', label: 'Active Ideation with Any Methods (No Plan/Intent)' },
            { id: '4', label: 'Active Ideation with Some Intent (No Plan)' },
            { id: '5', label: 'Active Ideation with Specific Plan and Intent' }
          ];
    
          ideationItems.forEach(item => {
            const lt = document.getElementById(`ideation${item.id}_lifetime`)?.checked ? 'Lifetime: Yes' : '';
            const month = document.getElementById(`ideation${item.id}_month`)?.checked ? 'Past Month: Yes' : '';
            if (lt || month) {
              summary += `  Level ${item.id}: ${item.label}\n    ${[lt, month].filter(Boolean).join(', ')}\n`;
            }
          });
    
          summary += '\nSECTION C: INTENSITY OF IDEATION\n';
          summary += '────────────────────────────────────────────\n';
          const intensityFields = ['intensity_frequency', 'intensity_duration', 'intensity_control', 'intensity_deterrents', 'intensity_reasons'];
          intensityFields.forEach(field => {
            const select = document.querySelector(`select[name="${field}"]`);
            if (select && select.value) {
              const label = document.querySelector(`label[for="${field}"]`)?.textContent || field;
              const option = select.options[select.selectedIndex];
              summary += `  ${label.trim()}: ${option.text}\n`;
            }
          });
    
          summary += '\nSECTION D: SUICIDAL BEHAVIOR\n';
          summary += '────────────────────────────────────────────\n';
          const behaviorTypes = ['attempt', 'interrupted', 'aborted', 'prep'];
          behaviorTypes.forEach(type => {
            const ltChecked = document.getElementById(`behavior_${type}_lt`)?.checked;
            const monthChecked = document.getElementById(`behavior_${type}_3m`)?.checked;
            const count = document.getElementById(`behavior_${type}_count`)?.value;
    
            if (ltChecked || monthChecked) {
              const typeName = type.replace('_', ' ').toUpperCase();
              summary += `  ${typeName}:\n`;
              if (ltChecked) summary += `    Lifetime: Yes\n`;
              if (monthChecked) summary += `    Past 3 Months: Yes\n`;
              if (count && count !== '0') summary += `    Count: ${count}\n`;
            }
          });
    
          const nssiLT = document.getElementById('behavior_nssi_lt')?.checked;
          const nssi3M = document.getElementById('behavior_nssi_3m')?.checked;
          if (nssiLT || nssi3M) {
            summary += '  NON-SUICIDAL SELF-INJURY:\n';
            if (nssiLT) summary += '    Lifetime: Yes\n';
            if (nssi3M) summary += '    Past 3 Months: Yes\n';
          }
    
          summary += '\nSECTION E: LETHALITY\n';
          summary += '────────────────────────────────────────────\n';
          ['recent', 'lethal', 'initial'].forEach(type => {
            const date = document.getElementById(`lethality_${type}_date`)?.value;
            const actual = document.getElementById(`lethality_${type}_actual`)?.selectedOptions[0]?.text;
            const potential = document.getElementById(`lethality_${type}_potential`)?.selectedOptions[0]?.text;
    
            if (date || actual || potential) {
              summary += `  ${type.charAt(0).toUpperCase() + type.slice(1)} Attempt:\n`;
              if (date) summary += `    Date: ${date}\n`;
              if (actual) summary += `    Actual Lethality: ${actual}\n`;
              if (potential) summary += `    Potential Lethality: ${potential}\n`;
            }
          });
    
          summary += '\n────────────────────────────────────────────\n';
          summary += '';
          summary += '────────────────────────────────────────────';
    
          document.getElementById('sr-full-summary-content').textContent = summary;
          document.getElementById('sr-full-summary-text').style.display = 'block';
          document.getElementById('sr-full-copy').style.display = 'inline-block';
          document.getElementById('sr-full-summary-text').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    
        document.getElementById('sr-full-copy').addEventListener('click', function() {
          const summary = document.getElementById('sr-full-summary-content').textContent;
          navigator.clipboard.writeText(summary).then(() => {
            const btn = this;
            const origText = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => { btn.textContent = origText; }, 2000);
          });
        });
    
        // ──────── TOOL 3: RISK FACTORS & PROTECTIVE FACTORS ────────
        function updateRiskFactorStats() {
          const riskChecked = document.querySelectorAll('[id^="rf_"]:checked').length;
          const riskTotal = document.querySelectorAll('[id^="rf_"]').length;
          document.getElementById('rf-risk-stats').textContent = `${riskChecked} of ${riskTotal} risk factors checked`;
    
          const protectChecked = document.querySelectorAll('[id^="pf_"]:checked').length;
          const protectTotal = document.querySelectorAll('[id^="pf_"]').length;
          document.getElementById('pf-protect-stats').textContent = `${protectChecked} of ${protectTotal} protective factors checked`;
    
          const wsChecked = document.querySelectorAll('[id^="ws_"]:checked').length;
          const wsTotal = document.querySelectorAll('[id^="ws_"]').length;
          document.getElementById('ws-warning-stats').textContent = `${wsChecked} of ${wsTotal} warning signs present`;
        }
    
        document.querySelectorAll('#sr-risk-factors-form input[type="checkbox"]').forEach(cb => {
          cb.addEventListener('change', updateRiskFactorStats);
        });
    
        document.getElementById('sr-risk-summary').addEventListener('click', function() {
          const now = new Date().toLocaleString();
          let summary = `────────────────────────────────────────────
    SUICIDE RISK FACTORS ASSESSMENT SUMMARY
    ────────────────────────────────────────────
    Generated: ${now}
    
    RISK FACTORS PROFILE
    ────────────────────────────────────────────\n`;
    
          const riskCategories = {
            'Health Factors': ['rf_depression', 'rf_substance', 'rf_bipolar', 'rf_schizophrenia', 'rf_personality', 'rf_conduct', 'rf_anxiety', 'rf_medical', 'rf_tbi'],
            'Environmental Factors': ['rf_lethal_means', 'rf_prolonged_stress', 'rf_stressful_events', 'rf_exposure', 'rf_discrimination'],
            'Historical Factors': ['rf_prior_attempt', 'rf_family_hx', 'rf_abuse', 'rf_generational']
          };
    
          for (const [category, items] of Object.entries(riskCategories)) {
            const checked = items.filter(id => document.getElementById(id)?.checked);
            if (checked.length > 0) {
              summary += `${category}:\n`;
              checked.forEach(id => {
                const label = document.querySelector(`label[for="${id}"]`);
                if (label) summary += `  ✓ ${label.textContent.trim()}\n`;
              });
              summary += '\n';
            }
          }
    
          summary += 'PROTECTIVE FACTORS PROFILE\n';
          summary += '────────────────────────────────────────────\n';
          const protectItems = ['pf_mental_care', 'pf_proactive', 'pf_connected', 'pf_support', 'pf_coping', 'pf_limited_means', 'pf_spiritual'];
          const checkedProtect = protectItems.filter(id => document.getElementById(id)?.checked);
          if (checkedProtect.length > 0) {
            checkedProtect.forEach(id => {
              const label = document.querySelector(`label[for="${id}"]`);
              if (label) summary += `  ✓ ${label.textContent.trim()}\n`;
            });
          } else {
            summary += '  None identified\n';
          }
          summary += '\n';
    
          summary += 'WARNING SIGNS PRESENT\n';
          summary += '────────────────────────────────────────────\n';
          const wsCategories = {
            'Talk': ['ws_killing', 'ws_hopeless', 'ws_no_reason', 'ws_burden', 'ws_trapped', 'ws_unbearable'],
            'Behavior': ['ws_substance_use', 'ws_looking', 'ws_withdrawn', 'ws_isolating', 'ws_sleep', 'ws_goodbye', 'ws_giving', 'ws_aggressive', 'ws_fatigue'],
            'Mood': ['ws_depression', 'ws_anxiety', 'ws_loss_interest', 'ws_irritable', 'ws_humiliation', 'ws_agitation', 'ws_relief']
          };
    
          for (const [category, items] of Object.entries(wsCategories)) {
            const checked = items.filter(id => document.getElementById(id)?.checked);
            if (checked.length > 0) {
              summary += `${category}:\n`;
              checked.forEach(id => {
                const label = document.querySelector(`label[for="${id}"]`);
                if (label) summary += `  ✓ ${label.textContent.trim()}\n`;
              });
              summary += '\n';
            }
          }
    
          // Clinical assessment fields
          summary += 'CLINICAL ASSESSMENT\n';
          summary += '────────────────────────────────────────────\n';

          const locRadio = document.querySelector('input[name="sr_location"]:checked');
          summary += `Location:             ${locRadio ? locRadio.value : 'Not specified'}\n`;

          const riskRadio = document.querySelector('input[name="sr_overall_risk"]:checked');
          summary += `Overall Risk Level:   ${riskRadio ? riskRadio.value : 'Not specified'}\n\n`;

          const modItems = ['mod_medications', 'mod_therapy', 'mod_sobriety', 'mod_symptom_tx', 'mod_access_care', 'mod_support'];
          const checkedMods = modItems.filter(id => document.getElementById(id)?.checked);
          if (checkedMods.length > 0) {
            summary += 'Modifiable Factors Identified:\n';
            checkedMods.forEach(id => {
              const label = document.querySelector(`label[for="${id}"]`);
              if (label) summary += `  ✓ ${label.textContent.trim()}\n`;
            });
          } else {
            summary += 'Modifiable Factors: None identified\n';
          }
          summary += '\n';

          // Risk profile determination
          const totalRisk = document.querySelectorAll('[id^="rf_"]:checked').length;
          const totalProtect = document.querySelectorAll('[id^="pf_"]:checked').length;
          const totalWarning = document.querySelectorAll('[id^="ws_"]:checked').length;

          summary += 'SUMMARY COUNTS\n';
          summary += '────────────────────────────────────────────\n';
          summary += `Risk factors present:       ${totalRisk}\n`;
          summary += `Protective factors present: ${totalProtect}\n`;
          summary += `Warning signs present:      ${totalWarning}\n`;

          summary += '\n────────────────────────────────────────────\n';
          summary += '';
          summary += '────────────────────────────────────────────';
    
          document.getElementById('sr-risk-summary-content').textContent = summary;
          document.getElementById('sr-risk-summary-text').style.display = 'block';
          document.getElementById('sr-risk-copy').style.display = 'inline-block';
          document.getElementById('sr-risk-summary-text').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    
        document.getElementById('sr-risk-copy').addEventListener('click', function() {
          const summary = document.getElementById('sr-risk-summary-content').textContent;
          navigator.clipboard.writeText(summary).then(() => {
            const btn = this;
            const origText = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => { btn.textContent = origText; }, 2000);
          });
        });
    
        // Initialize stat counters
        updateRiskFactorStats();
      })();
      
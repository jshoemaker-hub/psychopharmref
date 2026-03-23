
      (function(){
        /* ── CDR Scoring Engine (Morris 1993 algorithm) ── */
        const DOMAINS = ['memory','orientation','judgment','community','home','personalcare'];
        const DOMAIN_LABELS = {memory:'Memory',orientation:'Orientation',judgment:'Judgment & Problem Solving',community:'Community Affairs',home:'Home & Hobbies',personalcare:'Personal Care'};
        const LEVELS = {0:'None',0.5:'Questionable',1:'Mild',2:'Moderate',3:'Severe'};
        const SECONDARY = ['orientation','judgment','community','home','personalcare'];

        // Highlight selected options
        document.querySelectorAll('#cdr-grid .cdr-opt input').forEach(function(radio){
          radio.addEventListener('change', function(){
            var card = this.closest('.cdr-domain-card');
            card.querySelectorAll('.cdr-opt').forEach(function(o){ o.classList.remove('cdr-selected'); });
            this.closest('.cdr-opt').classList.add('cdr-selected');
            card.classList.add('cdr-scored');
          });
        });

        // Keyboard support for labels
        document.querySelectorAll('#cdr-grid .cdr-opt').forEach(function(opt){
          opt.addEventListener('keydown', function(e){
            if(e.key==='Enter'||e.key===' '){ e.preventDefault(); this.querySelector('input').click(); }
          });
        });

        function getScores(){
          var scores = {};
          var missing = [];
          DOMAINS.forEach(function(d){
            var checked = document.querySelector('input[name="cdr-'+d+'"]:checked');
            if(checked) scores[d] = parseFloat(checked.value);
            else missing.push(DOMAIN_LABELS[d]);
          });
          return {scores:scores, missing:missing};
        }

        /* Morris (1993) global CDR algorithm */
        function computeGlobalCDR(scores){
          var M = scores.memory;
          var sec = SECONDARY.map(function(d){ return scores[d]; });

          // Count secondary categories on each side of M and equal to M
          var below = sec.filter(function(s){ return s < M; });
          var above = sec.filter(function(s){ return s > M; });
          var equal = sec.filter(function(s){ return s === M; });

          // Special rule: M=0
          if(M === 0){
            var impaired = sec.filter(function(s){ return s >= 0.5; });
            if(impaired.length >= 2) return 0.5;
            return 0;
          }

          // Special rule: M=0.5
          if(M === 0.5){
            var geOne = sec.filter(function(s){ return s >= 1; });
            if(geOne.length >= 3) return 1;
            return 0.5;
          }

          // M >= 1: CDR cannot be 0
          // If at least 3 secondary = M, CDR = M
          if(equal.length >= 3) return M;

          // If 3+ secondary on one side
          if(above.length >= 3){
            // majority above: find mode/majority value above M
            return majorityScore(above);
          }
          if(below.length >= 3){
            return majorityScore(below);
          }

          // 3 on one side, 2 on other: CDR = M
          if((above.length === 3 && below.length === 2) || (below.length === 3 && above.length === 2)){
            return M;
          }

          // Tie-breaking: ties on one side, choose tied score closest to M
          if(above.length > below.length){
            return closestToM(above, M);
          }
          if(below.length > above.length){
            return closestToM(below, M);
          }

          // When only 1-2 secondary = M, and no more than 2 on either side: CDR=M
          if(above.length <= 2 && below.length <= 2) return M;

          // Fallback
          return M;
        }

        function majorityScore(arr){
          var counts = {};
          arr.forEach(function(v){ counts[v] = (counts[v]||0)+1; });
          var maxCount = 0, maxVal = arr[0];
          for(var k in counts){
            if(counts[k]>maxCount){ maxCount=counts[k]; maxVal=parseFloat(k); }
          }
          return maxVal;
        }

        function closestToM(arr, M){
          var unique = [];
          arr.forEach(function(v){ if(unique.indexOf(v)===-1) unique.push(v); });
          unique.sort(function(a,b){ return Math.abs(a-M) - Math.abs(b-M); });
          return unique[0];
        }

        function computeSB(scores){
          var sum = 0;
          DOMAINS.forEach(function(d){ sum += scores[d]; });
          return Math.round(sum*10)/10;
        }

        function getSBStage(sb){
          if(sb === 0) return 'Normal';
          if(sb <= 4.0) return 'Questionable / Very Mild';
          if(sb <= 9.0) return 'Mild Dementia';
          if(sb <= 15.5) return 'Moderate Dementia';
          return 'Severe Dementia';
        }

        function getInterpretation(cdr){
          var map = {
            0:   {cls:'cdr-interp-0',  title:'CDR 0 — Normal Cognition',
                  body:'No cognitive impairment detected. The patient demonstrates normal function across all assessed domains. No intervention indicated from a dementia-staging perspective. Consider longitudinal monitoring if risk factors are present (family history, biomarker positivity, APOE4 carrier status).'},
            0.5: {cls:'cdr-interp-05', title:'CDR 0.5 — Very Mild / Questionable Impairment',
                  body:'Subtle cognitive decline detected. This stage may represent mild cognitive impairment (MCI) or very early dementia. Functional activities are largely preserved. Consider biomarker assessment (amyloid PET, plasma p-tau217), neuropsychological testing, and close longitudinal follow-up. This is the optimal window for disease-modifying therapy evaluation in Alzheimer\'s disease.'},
            1:   {cls:'cdr-interp-1',  title:'CDR 1 — Mild Dementia',
                  body:'Definite cognitive impairment interfering with everyday activities. Memory loss is clear, with difficulty in time orientation and complex functional tasks. Initiate or optimize cholinesterase inhibitors. Assess driving safety. Advance care planning and caregiver support discussions should begin. Disease-modifying therapies (lecanemab, donanemab) may be considered if biomarker-confirmed Alzheimer\'s disease.'},
            2:   {cls:'cdr-interp-2',  title:'CDR 2 — Moderate Dementia',
                  body:'Significant cognitive decline with dependence in activities of daily living. Neuropsychiatric symptoms (agitation, delusions, sleep disruption) commonly peak at this stage. Combination cholinesterase inhibitor + memantine is standard. Behavioral interventions first-line for neuropsychiatric symptoms; atypical antipsychotics used cautiously (black box warning). Caregiver burden is substantial—assess and support. Structured day programs and environmental modifications are beneficial.'},
            3:   {cls:'cdr-interp-3',  title:'CDR 3 — Severe Dementia',
                  body:'Severe cognitive impairment with complete functional dependence. Communication is minimal or absent. Medical complications dominate (dysphagia, aspiration risk, incontinence, immobility). Care focus shifts to comfort and palliation. Assess hospice eligibility (FAST stage 7a+). Ensure advance directives are in place. Medication review to discontinue agents without continued benefit. Dignity-preserving, comfort-focused care is the standard.'}
          };
          return map[cdr] || map[0];
        }

        // Calculate button
        document.getElementById('cdr-calc-btn').addEventListener('click', function(){
          var errEl = document.getElementById('cdr-error');
          var result = getScores();
          if(result.missing.length > 0){
            errEl.textContent = 'Please score all domains: ' + result.missing.join(', ');
            errEl.style.display = 'block';
            return;
          }
          errEl.style.display = 'none';

          var scores = result.scores;
          var globalCDR = computeGlobalCDR(scores);
          var sb = computeSB(scores);
          var sbStage = getSBStage(sb);
          var interp = getInterpretation(globalCDR);

          // M >= 1 safety: CDR cannot be 0
          if(scores.memory >= 1 && globalCDR === 0){
            var majZero = SECONDARY.filter(function(d){ return scores[d]===0; });
            globalCDR = (majZero.length >= 3) ? 0.5 : scores.memory;
          }

          // Score cards
          var scoreRow = document.getElementById('cdr-score-row');
          scoreRow.innerHTML =
            '<div class="cdr-score-card cdr-global-card"><div class="cdr-score-val">'+globalCDR+'</div><div class="cdr-score-label">Global CDR</div></div>'+
            '<div class="cdr-score-card"><div class="cdr-score-val" style="color:var(--accent)">'+sb+'</div><div class="cdr-score-label">CDR-SB (Sum of Boxes)</div></div>'+
            '<div class="cdr-score-card"><div class="cdr-score-val" style="color:var(--accent2);font-size:1.3rem">'+sbStage+'</div><div class="cdr-score-label">CDR-SB Stage</div></div>';

          // Interpretation
          document.getElementById('cdr-interp').innerHTML =
            '<div class="cdr-interp '+interp.cls+'"><div class="cdr-interp-title">'+interp.title+'</div><div class="cdr-interp-body">'+interp.body+'</div></div>';

          // Box score table
          var tbody = document.getElementById('cdr-box-tbody');
          tbody.innerHTML = '';
          DOMAINS.forEach(function(d){
            var s = scores[d];
            var label = LEVELS[s] || s;
            var isPrimary = d==='memory' ? ' (Primary)' : '';
            tbody.innerHTML += '<tr><td style="text-align:left;font-weight:600">'+DOMAIN_LABELS[d]+isPrimary+'</td><td class="cdr-cell-active">'+s+'</td><td>'+label+'</td></tr>';
          });
          document.getElementById('cdr-sb-val').textContent = sb + ' (' + sbStage + ')';

          // Build plain-text summary
          var today = new Date();
          var dateStr = (today.getMonth()+1)+'/'+today.getDate()+'/'+today.getFullYear();
          var cdrLine = '────────────────────────────────────────';
          var cdrTxt = '';
          cdrTxt += 'CDR DEMENTIA STAGING SUMMARY\n';
          cdrTxt += cdrLine + '\n';
          cdrTxt += 'Date: ' + dateStr + '\n\n';
          cdrTxt += 'GLOBAL CDR:       ' + globalCDR + ' — ' + interp.title.replace('CDR ' + globalCDR + ' — ', '') + '\n';
          cdrTxt += 'CDR-SB:           ' + sb + ' (' + sbStage + ')\n\n';
          cdrTxt += 'BOX SCORES\n';
          var maxLen = 0;
          DOMAINS.forEach(function(d){ var l = DOMAIN_LABELS[d].length; if(l>maxLen) maxLen = l; });
          DOMAINS.forEach(function(d){
            var s = scores[d];
            var label = LEVELS[s] || s;
            var pad = new Array(maxLen - DOMAIN_LABELS[d].length + 1).join(' ');
            var primary = d==='memory' ? ' (Primary)' : '';
            cdrTxt += '  ' + DOMAIN_LABELS[d] + pad + '  ' + s + '  ' + label + primary + '\n';
          });
          cdrTxt += '\n' + cdrLine + '\n';
          cdrTxt += 'CLINICAL INTERPRETATION\n\n';
          cdrTxt += interp.body + '\n';
          cdrTxt += '\n' + cdrLine + '\n';
          cdrTxt += 'CDR-SB Staging: 0 = Normal | 0.5-4.0 = Questionable | 4.5-9.0 = Mild | 9.5-15.5 = Moderate | 16.0-18.0 = Severe\n';
          cdrTxt += 'Reference: Morris JC. Neurology. 1993;43(11):2412-2414.\n';
          cdrTxt += '';

          document.getElementById('cdr-summary-text').textContent = cdrTxt;
          document.getElementById('cdr-summary-wrap').style.display = 'block';

          // Show results
          document.getElementById('cdr-results').classList.add('cdr-visible');
          document.getElementById('cdr-results').scrollIntoView({behavior:'smooth', block:'start'});
        });

        // Reset
        document.getElementById('cdr-reset-btn').addEventListener('click', function(){
          DOMAINS.forEach(function(d){
            document.querySelectorAll('input[name="cdr-'+d+'"]').forEach(function(r){ r.checked = false; });
          });
          document.querySelectorAll('#cdr-grid .cdr-opt').forEach(function(o){ o.classList.remove('cdr-selected'); });
          document.querySelectorAll('#cdr-grid .cdr-domain-card').forEach(function(c){ c.classList.remove('cdr-scored'); });
          document.getElementById('cdr-results').classList.remove('cdr-visible');
          document.getElementById('cdr-summary-wrap').style.display = 'none';
          document.getElementById('cdr-error').style.display = 'none';
        });

        // Print
        document.getElementById('cdr-print-btn').addEventListener('click', function(){
          window.print();
        });

        // Copy summary
        document.getElementById('cdr-copy-btn').addEventListener('click', function(){
          var text = document.getElementById('cdr-summary-text').textContent;
          navigator.clipboard.writeText(text).then(function(){
            var msg = document.getElementById('cdr-copy-msg');
            msg.style.display = 'block';
            setTimeout(function(){ msg.style.display = 'none'; }, 2000);
          });
        });

        // Add print button
        (function addPrintBtn() {
          var sec = document.getElementById('cdr-tool');
          if (!sec) return;
          var header = sec.querySelector('.section-header');
          if (!header) return;
          var btn = document.createElement('button');
          btn.className = 'pf-inline-btn';
          btn.onclick = function() { if (typeof printBlankForm === 'function') printBlankForm('cdr'); };
          btn.innerHTML = '🖨️ Print Blank Form';
          btn.title = 'Print a blank version of this form';
          header.appendChild(btn);
        })();

      })();
      
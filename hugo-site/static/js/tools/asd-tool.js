
      (function(){
        /* ── ASD Severity Rating Engine ── */
        var DOMAINS = [{key:'sc', label:'Social Communication & Interaction'}, {key:'rrb', label:'Restricted & Repetitive Behaviors'}];
        var LEVEL_NAMES = {1:'Level 1 — Requiring Support', 2:'Level 2 — Requiring Substantial Support', 3:'Level 3 — Requiring Very Substantial Support'};
        var LEVEL_SHORT = {1:'Level 1', 2:'Level 2', 3:'Level 3'};
        var SUPPORT_LABELS = {1:'Requiring Support', 2:'Requiring Substantial Support', 3:'Requiring Very Substantial Support'};

        // Highlight selected
        document.querySelectorAll('#asd-tool-grid .asd-level input').forEach(function(radio){
          radio.addEventListener('change', function(){
            var panel = this.closest('.asd-domain-panel');
            panel.querySelectorAll('.asd-level').forEach(function(l){ l.classList.remove('asd-sel'); });
            this.closest('.asd-level').classList.add('asd-sel');
          });
        });

        // Keyboard
        document.querySelectorAll('#asd-tool-grid .asd-level').forEach(function(lbl){
          lbl.addEventListener('keydown', function(e){
            if(e.key==='Enter'||e.key===' '){ e.preventDefault(); this.querySelector('input').click(); }
          });
        });

        var SC_INTERP = {
          1: {cls:'asd-interp-1', title:'Social Communication — Level 1', body:'Without supports, deficits cause noticeable impairments. The individual can speak in full sentences and engages in communication, but reciprocal conversation is impaired. Attempts at social interaction may be atypical or unsuccessful. Social motivation may appear reduced. In women and girls, social camouflaging may mask deficits; assess for the internal cost of maintaining a neurotypical presentation (chronic anxiety, exhaustion, burnout).'},
          2: {cls:'asd-interp-2', title:'Social Communication — Level 2', body:'Marked deficits in verbal and nonverbal communication are apparent even with supports in place. Social initiations are limited and responses to others are reduced or qualitatively abnormal. Communication is often restricted to narrow special interests. Nonverbal communication (eye contact, gestures, facial expression) is markedly atypical. Structured support across educational, vocational, and social settings is typically required.'},
          3: {cls:'asd-interp-3', title:'Social Communication — Level 3', body:'Severe deficits in both verbal and nonverbal social communication cause severe functional impairments. Initiation of social interaction is very limited, with minimal response to social overtures from others. Many individuals at this level have limited or no functional speech and may require augmentative and alternative communication (AAC) systems. Social interactions are typically restricted to direct physical or highly concrete exchanges.'}
        };

        var RRB_INTERP = {
          1: {cls:'asd-interp-1', title:'Restricted/Repetitive Behaviors — Level 1', body:'Inflexibility causes significant interference in at least one context. Executive function difficulties—particularly task-switching, organization, and planning—are commonly the most functionally impairing features. Rigidity in routines and difficulty with transitions create substantial internal distress, though they may be less externally visible. Independent functioning is possible but requires significant effort.'},
          2: {cls:'asd-interp-2', title:'Restricted/Repetitive Behaviors — Level 2', body:'Restricted/repetitive behaviors are obvious to casual observers and interfere with functioning across multiple contexts. Behavioral inflexibility creates significant difficulty with transitions and changes in routine. Distress when expected patterns are disrupted may manifest as behavioral dysregulation. Significant accommodations and structured support are needed to manage daily routines and transitions.'},
          3: {cls:'asd-interp-3', title:'Restricted/Repetitive Behaviors — Level 3', body:'Restricted/repetitive behaviors markedly interfere with functioning in all spheres. Extreme inflexibility, intense sensory-seeking or sensory-avoidant behaviors, and great difficulty redirecting from focused interests characterize the presentation. Self-injurious behavior and aggression may occur, particularly with communication frustration, sensory overload, or routine disruption. 24-hour supervised care is typically required.'}
        };

        var SUPPORTS = {
          1: {
            title: 'Level 1 Support Recommendations',
            categories: [
              {name:'Behavioral/Therapeutic', items:['Social skills training (group-based)','CBT adapted for ASD','Executive function coaching','Occupational therapy (sensory strategies)']},
              {name:'Educational/Vocational', items:['Workplace accommodations','Self-advocacy skill development','Organizational support tools','Transition planning (adolescent/adult)']},
              {name:'Pharmacotherapy Targets', items:['Anxiety (SSRIs)','ADHD symptoms (stimulants, guanfacine)','Depression','Sleep (melatonin)']},
              {name:'Monitoring', items:['Burnout/camouflaging assessment','Comorbid mental health screening','Annual functional review','Quality of life measures']}
            ]
          },
          2: {
            title: 'Level 2 Support Recommendations',
            categories: [
              {name:'Behavioral/Therapeutic', items:['ABA-based behavioral intervention','Speech-language therapy','Occupational therapy (sensory + adaptive)','Social communication intervention']},
              {name:'Educational/Vocational', items:['Structured educational program with support','Vocational training with job coaching','Visual schedules and supports','Transition planning with supported living options']},
              {name:'Pharmacotherapy Targets', items:['Irritability/aggression (risperidone, aripiprazole)','Hyperactivity (methylphenidate, guanfacine)','Anxiety/repetitive behaviors (SSRIs)','Sleep (melatonin, trazodone)']},
              {name:'Monitoring', items:['Behavioral data tracking','Adaptive functioning assessment (Vineland-3)','Regular medication review','Caregiver support needs']}
            ]
          },
          3: {
            title: 'Level 3 Support Recommendations',
            categories: [
              {name:'Behavioral/Therapeutic', items:['Comprehensive ABA programming (high intensity)','AAC assessment and implementation','Sensory integration therapy','Functional behavior analysis (FBA) for challenging behaviors']},
              {name:'Educational/Residential', items:['Specialized educational placement','1:1 or small group instruction','Long-term residential care planning','24-hour supervision and support']},
              {name:'Pharmacotherapy Targets', items:['Irritability/SIB (risperidone, aripiprazole)','Severe aggression (consider clozapine for refractory)','Sleep disruption (melatonin + adjuncts)','Seizures (comorbid epilepsy in ~20-30%)']},
              {name:'Monitoring', items:['Safety planning (SIB, elopement, pica)','Medical comorbidity screening','Nutritional assessment','Caregiver burden and respite needs']}
            ]
          }
        };

        function getOverallLevel(sc, rrb){
          return Math.max(sc, rrb);
        }

        document.getElementById('asd-calc-btn').addEventListener('click', function(){
          var errEl = document.getElementById('asd-error');
          var scRadio = document.querySelector('input[name="asd-sc"]:checked');
          var rrbRadio = document.querySelector('input[name="asd-rrb"]:checked');

          if(!scRadio || !rrbRadio){
            var missing = [];
            if(!scRadio) missing.push('Social Communication');
            if(!rrbRadio) missing.push('Restricted/Repetitive Behaviors');
            errEl.textContent = 'Please rate both domains: ' + missing.join(', ');
            errEl.style.display = 'block';
            return;
          }
          errEl.style.display = 'none';

          var sc = parseInt(scRadio.value);
          var rrb = parseInt(rrbRadio.value);
          var overall = getOverallLevel(sc, rrb);

          // Specifiers
          var specifiers = [];
          if(document.getElementById('asd-spec-id').checked) specifiers.push('With intellectual impairment');
          if(document.getElementById('asd-spec-lang').checked) specifiers.push('With language impairment');
          if(document.getElementById('asd-spec-med').checked) specifiers.push('Associated with known medical/genetic condition');
          if(document.getElementById('asd-spec-cat').checked) specifiers.push('Associated with catatonia');

          // Score cards
          var colors = {1:'#3a6e28', 2:'#8b6914', 3:'#c04030'};
          var scoreRow = document.getElementById('asd-score-row');
          var specText = specifiers.length > 0 ? '<div style="font-size:0.78rem;margin-top:8px;color:#6b6050;text-align:left;"><strong>Specifiers:</strong> '+specifiers.join('; ')+'</div>' : '';

          scoreRow.innerHTML =
            '<div class="asd-score-card asd-score-card--primary" style="border-color:'+colors[sc]+'">'+
              '<div class="asd-score-val" style="color:'+colors[sc]+'">'+sc+'</div>'+
              '<div class="asd-score-sublabel" style="color:'+colors[sc]+'">'+SUPPORT_LABELS[sc]+'</div>'+
              '<div class="asd-score-label">Social Communication</div>'+
            '</div>'+
            '<div class="asd-score-card asd-score-card--primary" style="border-color:'+colors[rrb]+'">'+
              '<div class="asd-score-val" style="color:'+colors[rrb]+'">'+rrb+'</div>'+
              '<div class="asd-score-sublabel" style="color:'+colors[rrb]+'">'+SUPPORT_LABELS[rrb]+'</div>'+
              '<div class="asd-score-label">Restricted/Repetitive Behaviors</div>'+
            '</div>'+
            '<div class="asd-score-card" style="background:'+colors[overall]+';color:white;border-color:'+colors[overall]+'">'+
              '<div class="asd-score-val" style="color:white">'+overall+'</div>'+
              '<div class="asd-score-sublabel" style="color:rgba(255,255,255,0.9)">'+SUPPORT_LABELS[overall]+'</div>'+
              '<div class="asd-score-label" style="color:rgba(255,255,255,0.8)">Overall Support Level</div>'+
            '</div>';

          // Diagnostic formulation
          var formulation = '<div style="padding:14px 16px;border-radius:8px;background:var(--bg2);border:1px solid var(--border);margin-bottom:16px;">' +
            '<div style="font-weight:700;font-size:0.95rem;margin-bottom:6px;">Diagnostic Formulation</div>' +
            '<div style="font-size:0.9rem;"><strong>299.00 (F84.0) Autism Spectrum Disorder</strong></div>' +
            '<div style="font-size:0.85rem;margin-top:4px;">Social communication: ' + LEVEL_NAMES[sc] + '</div>' +
            '<div style="font-size:0.85rem;">Restricted/repetitive behaviors: ' + LEVEL_NAMES[rrb] + '</div>' +
            (specifiers.length > 0 ? '<div style="font-size:0.85rem;margin-top:4px;">' + specifiers.join('; ') + '</div>' : '') +
            '</div>';

          // Domain interpretations
          var interpHTML = formulation +
            '<div class="asd-interp-box '+SC_INTERP[sc].cls+'"><h4>'+SC_INTERP[sc].title+'</h4><p>'+SC_INTERP[sc].body+'</p></div>' +
            '<div class="asd-interp-box '+RRB_INTERP[rrb].cls+'"><h4>'+RRB_INTERP[rrb].title+'</h4><p>'+RRB_INTERP[rrb].body+'</p></div>';
          document.getElementById('asd-interp-section').innerHTML = interpHTML;

          // Support recommendations (based on overall level)
          var sup = SUPPORTS[overall];
          var supHTML = '<div style="margin-top:14px;"><div style="font-weight:700;font-size:1rem;margin-bottom:10px;">'+sup.title+'</div><div class="asd-supports-grid">';
          sup.categories.forEach(function(cat){
            supHTML += '<div class="asd-support-card"><h5>'+cat.name+'</h5><ul>';
            cat.items.forEach(function(item){ supHTML += '<li>'+item+'</li>'; });
            supHTML += '</ul></div>';
          });
          supHTML += '</div></div>';
          document.getElementById('asd-supports').innerHTML = supHTML;

          // Build plain-text summary
          var today = new Date();
          var dateStr = (today.getMonth()+1)+'/'+today.getDate()+'/'+today.getFullYear();
          var line = '────────────────────────────────────────';
          var txt = '';
          txt += 'ASD SEVERITY ASSESSMENT SUMMARY\n';
          txt += line + '\n';
          txt += 'Date: ' + dateStr + '\n\n';
          txt += 'DIAGNOSIS\n';
          txt += '  299.00 (F84.0) Autism Spectrum Disorder\n\n';
          txt += 'SEVERITY RATINGS (DSM-5)\n';
          txt += '  Social Communication:        Level ' + sc + ' — ' + SUPPORT_LABELS[sc] + '\n';
          txt += '  Restricted/Repetitive Bhx:   Level ' + rrb + ' — ' + SUPPORT_LABELS[rrb] + '\n';
          txt += '  Overall Support Level:       Level ' + overall + ' — ' + SUPPORT_LABELS[overall] + '\n';
          if(specifiers.length > 0){
            txt += '\nSPECIFIERS\n';
            specifiers.forEach(function(s){ txt += '  [+] ' + s + '\n'; });
          }
          txt += '\n' + line + '\n';
          txt += 'SOCIAL COMMUNICATION — LEVEL ' + sc + '\n';
          txt += SC_INTERP[sc].body + '\n';
          txt += '\nRESTRICTED/REPETITIVE BEHAVIORS — LEVEL ' + rrb + '\n';
          txt += RRB_INTERP[rrb].body + '\n';
          txt += '\n' + line + '\n';
          txt += 'SUPPORT RECOMMENDATIONS (Level ' + overall + ')\n\n';
          sup.categories.forEach(function(cat){
            txt += '  ' + cat.name + ':\n';
            cat.items.forEach(function(item){ txt += '    - ' + item + '\n'; });
            txt += '\n';
          });
          txt += line + '\n';
          txt += 'Reference: APA. DSM-5. Arlington, VA: APA; 2013.\n';
          txt += '';

          document.getElementById('asd-summary-text').textContent = txt;
          document.getElementById('asd-summary-wrap').style.display = 'block';

          // Show
          document.getElementById('asd-results').classList.add('asd-visible');
          document.getElementById('asd-results').scrollIntoView({behavior:'smooth', block:'start'});
        });

        // Reset
        document.getElementById('asd-reset-btn').addEventListener('click', function(){
          document.querySelectorAll('#asd-tool-grid input[type="radio"]').forEach(function(r){ r.checked = false; });
          document.querySelectorAll('#asd-tool-grid .asd-level').forEach(function(l){ l.classList.remove('asd-sel'); });
          document.querySelectorAll('#asd-tool .asd-level input[type="checkbox"]').forEach(function(c){ c.checked = false; });
          document.getElementById('asd-spec-id').checked = false;
          document.getElementById('asd-spec-lang').checked = false;
          document.getElementById('asd-spec-med').checked = false;
          document.getElementById('asd-spec-cat').checked = false;
          document.getElementById('asd-results').classList.remove('asd-visible');
          document.getElementById('asd-summary-wrap').style.display = 'none';
          document.getElementById('asd-error').style.display = 'none';
        });

        // Print
        document.getElementById('asd-print-btn').addEventListener('click', function(){ window.print(); });

        // Copy summary
        document.getElementById('asd-copy-btn').addEventListener('click', function(){
          var text = document.getElementById('asd-summary-text').textContent;
          navigator.clipboard.writeText(text).then(function(){
            var msg = document.getElementById('asd-copy-msg');
            msg.style.display = 'block';
            setTimeout(function(){ msg.style.display = 'none'; }, 2000);
          });
        });
      })();
      
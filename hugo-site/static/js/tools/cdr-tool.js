(function(){
  'use strict';

  var fallbackScale = {
    id: 'cdr',
    short_title: 'CDR',
    domains: [
      { id: 'memory', label: 'Memory', primary: true },
      { id: 'orientation', label: 'Orientation' },
      { id: 'judgment', label: 'Judgment & Problem Solving' },
      { id: 'community', label: 'Community Affairs' },
      { id: 'home', label: 'Home & Hobbies' },
      { id: 'personalcare', label: 'Personal Care' }
    ],
    options: [
      { value: 0, label: 'None' },
      { value: 0.5, label: 'Questionable' },
      { value: 1, label: 'Mild' },
      { value: 2, label: 'Moderate' },
      { value: 3, label: 'Severe' }
    ],
    sum_of_boxes_bands: [
      { min: 0, max: 0, label: 'Normal' },
      { min: 0.5, max: 4, label: 'Questionable / Very Mild' },
      { min: 4.5, max: 9, label: 'Mild Dementia' },
      { min: 9.5, max: 15.5, label: 'Moderate Dementia' },
      { min: 16, max: 18, label: 'Severe Dementia' }
    ],
    report: {
      heading: 'CDR Dementia Staging Summary',
      sum_of_boxes_note: 'CDR-SB Staging: 0 = Normal | 0.5-4.0 = Questionable | 4.5-9.0 = Mild | 9.5-15.5 = Moderate | 16.0-18.0 = Severe'
    },
    references: [
      { label: 'Morris JC. The Clinical Dementia Rating (CDR): current version and scoring rules. Neurology. 1993;43(11):2412-2414.' }
    ]
  };

  var scale = fallbackScale;
  var domains = fallbackScale.domains.map(function(domain) { return domain.id; });
  var secondaryDomains = domains.filter(function(domainId) { return domainId !== 'memory'; });

  function applyScale(nextScale) {
    if (!nextScale) return;
    scale = nextScale;
    domains = (scale.domains || fallbackScale.domains).map(function(domain) { return domain.id; });
    secondaryDomains = domains.filter(function(domainId) { return domainId !== 'memory'; });
  }

  if (window.ToolUtils && ToolUtils.loadClinicalScale) {
    ToolUtils.loadClinicalScale('cdr').then(applyScale).catch(function(){});
  }

  function domainLabel(domainId) {
    var domain = (scale.domains || []).filter(function(d) { return d.id === domainId; })[0];
    return domain ? domain.label : domainId;
  }

  function levelLabel(value) {
    var option = (scale.options || []).filter(function(opt) { return Number(opt.value) === Number(value); })[0];
    return option ? option.label : String(value);
  }

  function referenceLines() {
    return (scale.references || fallbackScale.references || []).map(function(ref) {
      return 'Reference: ' + ref.label;
    });
  }

  document.querySelectorAll('#cdr-grid .cdr-opt input').forEach(function(radio){
    radio.addEventListener('change', function(){
      var card = this.closest('.cdr-domain-card');
      card.querySelectorAll('.cdr-opt').forEach(function(o){ o.classList.remove('cdr-selected'); });
      this.closest('.cdr-opt').classList.add('cdr-selected');
      card.classList.add('cdr-scored');
    });
  });

  document.querySelectorAll('#cdr-grid .cdr-opt').forEach(function(opt){
    opt.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        this.querySelector('input').click();
      }
    });
  });

  function getScores(){
    var scores = {};
    var missing = [];
    domains.forEach(function(domainId){
      var checked = document.querySelector('input[name="cdr-' + domainId + '"]:checked');
      if (checked) scores[domainId] = parseFloat(checked.value);
      else missing.push(domainLabel(domainId));
    });
    return { scores: scores, missing: missing };
  }

  function computeGlobalCDR(scores){
    var M = scores.memory;
    var sec = secondaryDomains.map(function(domainId){ return scores[domainId]; });
    var below = sec.filter(function(s){ return s < M; });
    var above = sec.filter(function(s){ return s > M; });
    var equal = sec.filter(function(s){ return s === M; });

    if (M === 0) {
      return sec.filter(function(s){ return s >= 0.5; }).length >= 2 ? 0.5 : 0;
    }

    if (M === 0.5) {
      return sec.filter(function(s){ return s >= 1; }).length >= 3 ? 1 : 0.5;
    }

    if (equal.length >= 3) return M;
    if (above.length >= 3) return majorityScore(above);
    if (below.length >= 3) return majorityScore(below);
    if ((above.length === 3 && below.length === 2) || (below.length === 3 && above.length === 2)) return M;
    if (above.length > below.length) return closestToM(above, M);
    if (below.length > above.length) return closestToM(below, M);
    if (above.length <= 2 && below.length <= 2) return M;
    return M;
  }

  function majorityScore(arr){
    var counts = {};
    arr.forEach(function(v){ counts[v] = (counts[v] || 0) + 1; });
    var maxCount = 0;
    var maxVal = arr[0];
    Object.keys(counts).forEach(function(key) {
      if (counts[key] > maxCount) {
        maxCount = counts[key];
        maxVal = parseFloat(key);
      }
    });
    return maxVal;
  }

  function closestToM(arr, M){
    var unique = [];
    arr.forEach(function(v){ if (unique.indexOf(v) === -1) unique.push(v); });
    unique.sort(function(a,b){ return Math.abs(a - M) - Math.abs(b - M); });
    return unique[0];
  }

  function computeSB(scores){
    var sum = 0;
    domains.forEach(function(domainId){ sum += scores[domainId]; });
    return Math.round(sum * 10) / 10;
  }

  function getSBStage(sb){
    var bands = scale.sum_of_boxes_bands || fallbackScale.sum_of_boxes_bands;
    for (var i = 0; i < bands.length; i++) {
      if (sb >= bands[i].min && sb <= bands[i].max) return bands[i].label;
    }
    return bands[bands.length - 1].label;
  }

  function getInterpretation(cdr){
    var map = {
      0:   { cls:'cdr-interp-0', title:'CDR 0 - Normal Cognition',
        body:'No cognitive impairment detected. The patient demonstrates normal function across all assessed domains. No intervention indicated from a dementia-staging perspective. Consider longitudinal monitoring if risk factors are present (family history, biomarker positivity, APOE4 carrier status).' },
      0.5: { cls:'cdr-interp-05', title:'CDR 0.5 - Very Mild / Questionable Impairment',
        body:'Subtle cognitive decline detected. This stage may represent mild cognitive impairment (MCI) or very early dementia. Functional activities are largely preserved. Consider biomarker assessment, neuropsychological testing, and close longitudinal follow-up. This is the optimal window for disease-modifying therapy evaluation in Alzheimer disease.' },
      1:   { cls:'cdr-interp-1', title:'CDR 1 - Mild Dementia',
        body:'Definite cognitive impairment interfering with everyday activities. Memory loss is clear, with difficulty in time orientation and complex functional tasks. Initiate or optimize cholinesterase inhibitors when appropriate. Assess driving safety. Advance care planning and caregiver support discussions should begin.' },
      2:   { cls:'cdr-interp-2', title:'CDR 2 - Moderate Dementia',
        body:'Significant cognitive decline with dependence in activities of daily living. Neuropsychiatric symptoms commonly peak at this stage. Combination cholinesterase inhibitor plus memantine may be appropriate. Behavioral interventions are first-line for neuropsychiatric symptoms; antipsychotics require caution.' },
      3:   { cls:'cdr-interp-3', title:'CDR 3 - Severe Dementia',
        body:'Severe cognitive impairment with complete functional dependence. Communication is minimal or absent. Medical complications dominate. Care focus often shifts to comfort, goals of care, medication simplification, and caregiver support.' }
    };
    return map[cdr] || map[0];
  }

  function calculate() {
    var errEl = document.getElementById('cdr-error');
    var result = getScores();
    if (result.missing.length > 0) {
      errEl.textContent = 'Please score all domains: ' + result.missing.join(', ');
      errEl.style.display = 'block';
      return;
    }
    errEl.style.display = 'none';

    var scores = result.scores;
    var globalCDR = computeGlobalCDR(scores);
    var sb = computeSB(scores);
    var sbStage = getSBStage(sb);

    if (scores.memory >= 1 && globalCDR === 0) {
      var majZero = secondaryDomains.filter(function(domainId){ return scores[domainId] === 0; });
      globalCDR = majZero.length >= 3 ? 0.5 : scores.memory;
    }

    var interp = getInterpretation(globalCDR);
    document.getElementById('cdr-score-row').innerHTML =
      '<div class="cdr-score-card cdr-global-card"><div class="cdr-score-val">' + globalCDR + '</div><div class="cdr-score-label">Global CDR</div></div>' +
      '<div class="cdr-score-card"><div class="cdr-score-val" style="color:var(--accent)">' + sb + '</div><div class="cdr-score-label">CDR-SB (Sum of Boxes)</div></div>' +
      '<div class="cdr-score-card"><div class="cdr-score-val" style="color:var(--accent2);font-size:1.3rem">' + sbStage + '</div><div class="cdr-score-label">CDR-SB Stage</div></div>';

    document.getElementById('cdr-interp').innerHTML =
      '<div class="cdr-interp ' + interp.cls + '"><div class="cdr-interp-title">' + interp.title + '</div><div class="cdr-interp-body">' + interp.body + '</div></div>';

    var tbody = document.getElementById('cdr-box-tbody');
    tbody.innerHTML = '';
    domains.forEach(function(domainId){
      var s = scores[domainId];
      var label = levelLabel(s);
      var isPrimary = domainId === 'memory' ? ' (Primary)' : '';
      tbody.innerHTML += '<tr><td style="text-align:left;font-weight:600">' + domainLabel(domainId) + isPrimary + '</td><td class="cdr-cell-active">' + s + '</td><td>' + label + '</td></tr>';
    });
    document.getElementById('cdr-sb-val').textContent = sb + ' (' + sbStage + ')';

    var heading = (scale.report && scale.report.heading) || fallbackScale.report.heading;
    var cdrLine = '────────────────────────────────────────';
    var cdrTxt = '';
    cdrTxt += heading.toUpperCase() + '\n';
    cdrTxt += cdrLine + '\n';
    cdrTxt += 'Date: ' + ToolUtils.dateStamp() + '\n\n';
    cdrTxt += 'GLOBAL CDR:       ' + globalCDR + ' - ' + interp.title.replace('CDR ' + globalCDR + ' - ', '') + '\n';
    cdrTxt += 'CDR-SB:           ' + sb + ' (' + sbStage + ')\n\n';
    cdrTxt += 'BOX SCORES\n';
    var maxLen = 0;
    domains.forEach(function(domainId){
      var len = domainLabel(domainId).length;
      if (len > maxLen) maxLen = len;
    });
    domains.forEach(function(domainId){
      var s = scores[domainId];
      var label = levelLabel(s);
      var name = domainLabel(domainId);
      var pad = new Array(maxLen - name.length + 1).join(' ');
      var primary = domainId === 'memory' ? ' (Primary)' : '';
      cdrTxt += '  ' + name + pad + '  ' + s + '  ' + label + primary + '\n';
    });
    cdrTxt += '\n' + cdrLine + '\n';
    cdrTxt += 'CLINICAL INTERPRETATION\n\n';
    cdrTxt += interp.body + '\n';
    cdrTxt += '\n' + cdrLine + '\n';
    cdrTxt += ((scale.report && scale.report.sum_of_boxes_note) || fallbackScale.report.sum_of_boxes_note) + '\n';
    referenceLines().forEach(function(line) { cdrTxt += line + '\n'; });

    document.getElementById('cdr-summary-text').textContent = cdrTxt;
    document.getElementById('cdr-summary-wrap').style.display = 'block';
    document.getElementById('cdr-results').classList.add('cdr-visible');
    document.getElementById('cdr-results').scrollIntoView({ behavior:'smooth', block:'start' });
  }

  function reset() {
    ToolUtils.confirmReset('Reset all CDR scores?', function() {
      domains.forEach(function(domainId){
        document.querySelectorAll('input[name="cdr-' + domainId + '"]').forEach(function(r){ r.checked = false; });
      });
      document.querySelectorAll('#cdr-grid .cdr-opt').forEach(function(o){ o.classList.remove('cdr-selected'); });
      document.querySelectorAll('#cdr-grid .cdr-domain-card').forEach(function(c){ c.classList.remove('cdr-scored'); });
      document.getElementById('cdr-results').classList.remove('cdr-visible');
      document.getElementById('cdr-summary-wrap').style.display = 'none';
      document.getElementById('cdr-error').style.display = 'none';
    });
  }

  document.getElementById('cdr-calc-btn').addEventListener('click', calculate);
  document.getElementById('cdr-reset-btn').addEventListener('click', reset);
  document.getElementById('cdr-print-btn').addEventListener('click', function(){ window.print(); });
  document.getElementById('cdr-copy-btn').addEventListener('click', function(){
    ToolUtils.copyWithMessage(document.getElementById('cdr-summary-text').textContent, document.getElementById('cdr-copy-msg'));
  });

  (function addPrintBtn() {
    var sec = document.getElementById('cdr-tool');
    if (!sec) return;
    var header = sec.querySelector('.section-header');
    if (!header) return;
    var btn = document.createElement('button');
    btn.className = 'pf-inline-btn';
    btn.onclick = function() { if (typeof printBlankForm === 'function') printBlankForm('cdr'); };
    btn.innerHTML = 'Print Blank Form';
    btn.title = 'Print a blank version of this form';
    header.appendChild(btn);
  })();
})();

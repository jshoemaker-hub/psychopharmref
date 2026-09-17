/**
 * fatigue-workup-tool.js — Fatigue / Low Energy Workup (prefix: fw-)
 *
 * A tiered symptom / red-flag checklist that turns selections into a suggested
 * laboratory panel and a differential list, with an urgent-evaluation alert
 * when Tier-1 red flags are present, and an EMR-ready report. Companion to the
 * "Low Energy: The Non-Psychiatric Workup" chapter. Decision-support only.
 */
(function () {
  'use strict';

  var mount = document.getElementById('fw-container');
  if (!mount || mount.dataset.init) return;
  mount.dataset.init = '1';

  // First-line labs suggested for essentially all unexplained persistent fatigue
  var FIRST_LINE = ['CBC with differential', 'TSH (± free T4)', 'Comprehensive metabolic panel (glucose, electrolytes, Ca, renal, hepatic)', 'HbA1c or fasting glucose', 'Ferritin + iron studies', 'CRP and/or ESR'];

  // Symptom library. tier: 1|2|3. group: sub-heading. labs: targeted labs. ddx: considerations.
  var ITEMS = [
    // ── Tier 1 red flags ──
    { id:'wtloss', tier:1, group:'Red flags', label:'Unintentional weight loss (>5% in 6–12 mo)', labs:['Age-appropriate cancer screening', 'Chest X-ray'], ddx:['Malignancy','Hyperthyroidism','Chronic infection','Adrenal insufficiency','Malabsorption'] },
    { id:'fever', tier:1, group:'Red flags', label:'Fever or drenching night sweats', labs:['Blood cultures if indicated','HIV','Chest X-ray'], ddx:['Chronic infection (TB, endocarditis, HIV)','Lymphoma / malignancy','Connective-tissue disease'] },
    { id:'nodes', tier:1, group:'Red flags', label:'Lymphadenopathy or hepatosplenomegaly', labs:['Peripheral smear','LDH','Chest/abdomen imaging'], ddx:['Hematologic malignancy','Chronic infection'] },
    { id:'bleed', tier:1, group:'Red flags', label:'Unexplained bleeding, easy bruising, or marked pallor', labs:['Peripheral smear','Reticulocyte count','Coagulation studies'], ddx:['Marrow failure / leukemia','Severe anemia'] },
    { id:'cardiac', tier:1, group:'Red flags', label:'Chest pain, exertional dyspnea, orthopnea, palpitations, or syncope', labs:['ECG','BNP','Echocardiogram','Troponin if acute'], ddx:['Heart failure','Ischemia / arrhythmia','Severe anemia','Pulmonary disease'] },
    { id:'neuro', tier:1, group:'Red flags', label:'Focal neurologic deficit, new severe headache, or visual change', labs:['Neuroimaging (MRI/CT)'], ddx:['CNS lesion','Demyelination','Intracranial process'] },

    // ── Tier 2 common pointers ──
    { id:'osa', tier:2, group:'Sleep', label:'Loud snoring, witnessed apneas, unrefreshing sleep, daytime dozing', labs:['Polysomnography / home sleep test','Epworth Sleepiness Scale'], ddx:['Obstructive sleep apnea','Insufficient sleep','Narcolepsy'] },
    { id:'rls', tier:2, group:'Sleep', label:'Restless legs / urge to move at night', labs:['Ferritin (target higher for RLS)'], ddx:['Restless legs syndrome','Iron deficiency'] },
    { id:'hypothy', tier:2, group:'Endocrine', label:'Cold intolerance, weight gain, constipation, dry skin, hair thinning', labs:['TSH','Free T4'], ddx:['Hypothyroidism'] },
    { id:'hyperthy', tier:2, group:'Endocrine', label:'Heat intolerance, weight loss, tremor, palpitations', labs:['TSH','Free T4','Free T3'], ddx:['Hyperthyroidism'] },
    { id:'glucose', tier:2, group:'Endocrine', label:'Polyuria, polydipsia, blurred vision, recurrent infections', labs:['HbA1c','Fasting glucose'], ddx:['Diabetes / hyperglycemia'] },
    { id:'hypoglyc', tier:2, group:'Endocrine', label:'Shakiness/sweating relieved by eating', labs:['Fasting glucose','HbA1c'], ddx:['Hypoglycemia'] },
    { id:'anemia', tier:2, group:'Hematologic', label:'Pallor, exertional dyspnea, heavy menses, or GI blood loss', labs:['CBC','Ferritin + iron studies','B12 and folate','Reticulocyte count','Consider FOBT / GI evaluation'], ddx:['Iron-deficiency anemia','B12/folate deficiency','Anemia of chronic disease','GI malignancy'] },
    { id:'hf', tier:2, group:'Cardiopulmonary', label:'Dyspnea, orthopnea, leg edema, reduced exercise tolerance', labs:['BNP','ECG','Echocardiogram','Chest X-ray'], ddx:['Heart failure','Valvular disease','Pulmonary hypertension'] },
    { id:'copd', tier:2, group:'Cardiopulmonary', label:'Chronic cough, wheeze, smoking history', labs:['Pulmonary function tests','Pulse oximetry','Chest X-ray'], ddx:['COPD','Asthma','Interstitial lung disease','Chronic hypoxemia'] },
    { id:'meds', tier:2, group:'Medications / substances', label:'Sedating medications (beta-blockers, antihistamines, opioids, benzodiazepines, gabapentinoids)', labs:[], ddx:['Medication-related fatigue — review and adjust'] },
    { id:'substance', tier:2, group:'Medications / substances', label:'Alcohol, cannabis, or stimulant/caffeine withdrawal', labs:['LFTs','Consider substance history / screen'], ddx:['Substance-related fatigue','Alcohol use','Withdrawal state'] },
    { id:'nutrition', tier:2, group:'Nutrition / GI', label:'Poor intake, weight change, diarrhea/steatorrhea, or bariatric surgery', labs:['B12 and folate','Vitamin D (25-OH)','tTG-IgA (celiac)','Albumin/prealbumin'], ddx:['Malnutrition','Malabsorption (celiac, IBD, short gut)','Vitamin deficiency'] },
    { id:'mood', tier:2, group:'Mood', label:'Low mood, anhedonia, anxiety, or high stress', labs:['PHQ-9','GAD-7'], ddx:['Depression','Anxiety','Burnout — screen but keep medical differential open'] },

    // ── Tier 3 targeted / rare ──
    { id:'adrenal', tier:3, group:'Targeted / rare', label:'Orthostatic dizziness, salt craving, hyperpigmentation, nausea', labs:['Morning cortisol','ACTH stimulation test','Electrolytes (Na/K)'], ddx:['Adrenal insufficiency (Addison / secondary)'] },
    { id:'hemochrom', tier:3, group:'Targeted / rare', label:'Joint pain (MCP), bronze skin, new diabetes, or family history', labs:['Transferrin saturation','Ferritin','HFE genetic testing','LFTs'], ddx:['Hereditary hemochromatosis / iron overload'] },
    { id:'hypercalc', tier:3, group:'Targeted / rare', label:'Constipation, polyuria, bone pain, "stones/bones/groans"', labs:['Serum calcium','PTH','Vitamin D','SPEP / free light chains'], ddx:['Hypercalcemia / hyperparathyroidism','Multiple myeloma','Malignancy'] },
    { id:'autoimmune', tier:3, group:'Targeted / rare', label:'Arthralgia, morning stiffness, rash, dry eyes/mouth, proximal girdle pain', labs:['ANA','ESR/CRP','RF / anti-CCP','CK'], ddx:['SLE','Rheumatoid arthritis','Sjögren','Polymyalgia rheumatica','Sarcoidosis'] },
    { id:'hypogonad', tier:3, group:'Targeted / rare', label:'Low libido, erectile dysfunction, decreased muscle mass', labs:['Morning total testosterone','LH/FSH','Prolactin'], ddx:['Hypogonadism','Pituitary disorder'] },
    { id:'infection', tier:3, group:'Targeted / rare', label:'HIV/hepatitis risk, prior mono, TB exposure, or post-viral / long-COVID', labs:['HIV','Hepatitis B/C serology','Monospot / EBV-CMV','Consider TB testing'], ddx:['HIV','Chronic hepatitis','EBV/CMV','Tuberculosis','Post-viral / long COVID'] },
    { id:'tick', tier:3, group:'Targeted / rare', label:'Tick exposure or endemic-area travel (± erythema migrans, arthritis)', labs:['Lyme two-tier serology (with pretest probability)'], ddx:['Lyme disease'] },
    { id:'environ', tier:3, group:'Targeted / rare', label:'Occupational/environmental toxin exposure or symptoms tracking to a location', labs:['Heavy-metal levels only with genuine exposure','Carboxyhemoglobin if CO suspected'], ddx:['Heavy-metal toxicity (with real exposure)','Carbon monoxide','Mold-related allergic/asthmatic disease'] },
    { id:'renalhep', tier:3, group:'Targeted / rare', label:'Known kidney or liver disease, jaundice, edema, or ascites', labs:['Renal function','LFTs','Albumin','Ammonia if encephalopathy'], ddx:['Chronic kidney disease (uremia)','Cirrhosis / liver failure'] },
    { id:'neuromusc', tier:3, group:'Targeted / rare', label:'Fatigable weakness, tremor, or orthostatic tachycardia', labs:['CK','Consider neurology referral','Orthostatic vitals / tilt'], ddx:['Myasthenia gravis','Multiple sclerosis','Parkinson disease','Dysautonomia / POTS'] },
    { id:'pem', tier:3, group:'Targeted / rare', label:'Post-exertional malaise (crash >24 h after minor exertion), chronic >6 mo', labs:['Workup to exclude other causes first'], ddx:['ME/CFS (avoid reflexive graded exercise)','Fibromyalgia','Idiopathic chronic fatigue'] },
    { id:'preg', tier:3, group:'Targeted / rare', label:'Possibility of pregnancy', labs:['Pregnancy test (hCG)'], ddx:['Pregnancy'] }
  ];

  var selected = {};       // id -> true
  var complaint = '';      // sleepiness | fatigue | weakness

  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  // ── Build checklist column ──────────────────────────────────────────────
  function tierBlock(tier, title, sub) {
    var items = ITEMS.filter(function(i){ return i.tier === tier; });
    var groups = {};
    items.forEach(function(i){ (groups[i.group] = groups[i.group] || []).push(i); });
    var body = '';
    Object.keys(groups).forEach(function(g){
      if (Object.keys(groups).length > 1) body += '<div class="fw-group-label">' + esc(g) + '</div>';
      groups[g].forEach(function(i){
        body += '<label class="fw-item"><input type="checkbox" data-id="' + i.id + '"><span>' + esc(i.label) + '</span></label>';
      });
    });
    return '<div class="fw-tier fw-t' + tier + '">'
      + '<div class="fw-tier-head">' + esc(title) + '<small>' + esc(sub) + '</small></div>'
      + '<div class="fw-tier-body">' + body + '</div></div>';
  }

  var left = '';
  left += '<div class="fw-clarify-wrap"><div class="fw-group-label">First, what does the patient mean by "tired"?</div>';
  left += '<div class="fw-clarify">'
    + '<button type="button" class="fw-clarify-btn" data-c="sleepiness">Sleepy / dozing</button>'
    + '<button type="button" class="fw-clarify-btn" data-c="fatigue">Low energy / worn out</button>'
    + '<button type="button" class="fw-clarify-btn" data-c="weakness">Weak / short of breath</button>'
    + '</div></div>';
  left += tierBlock(1, 'Tier 1 — Red flags', 'screen first');
  left += tierBlock(2, 'Tier 2 — Common pointers', 'ask in every case');
  left += tierBlock(3, 'Tier 3 — Targeted / rare', 'on specific clues');

  var right = '<div class="fw-results" id="fw-results"></div>';

  mount.innerHTML =
    '<p class="fw-intro">Check the symptoms present. The panel builds a suggested laboratory workup (first-line plus targeted tests) and a differential, and flags red-flag findings that warrant urgent evaluation. Decision-support only.</p>'
    + '<div class="fw-layout"><div class="fw-col-left">' + left + '</div><div class="fw-col-right">' + right + '</div></div>';

  // ── Events ──────────────────────────────────────────────────────────────
  mount.querySelectorAll('.fw-item input').forEach(function(cb){
    cb.addEventListener('change', function(){
      if (this.checked) selected[this.dataset.id] = true; else delete selected[this.dataset.id];
      render();
    });
  });
  mount.querySelectorAll('.fw-clarify-btn').forEach(function(b){
    b.addEventListener('click', function(){
      var c = this.dataset.c;
      if (complaint === c) { complaint = ''; this.classList.remove('fw-on'); }
      else {
        complaint = c;
        mount.querySelectorAll('.fw-clarify-btn').forEach(function(x){ x.classList.remove('fw-on'); });
        this.classList.add('fw-on');
      }
      render();
    });
  });

  // ── Aggregate selections ────────────────────────────────────────────────
  function selectedItems(){ return ITEMS.filter(function(i){ return selected[i.id]; }); }
  function uniq(arr){ var seen={}, out=[]; arr.forEach(function(x){ if(!seen[x]){seen[x]=1;out.push(x);} }); return out; }

  function aggregate(){
    var items = selectedItems();
    var redFlags = items.filter(function(i){ return i.tier === 1; });
    var targetedLabs = [], ddx = [];
    items.forEach(function(i){ targetedLabs = targetedLabs.concat(i.labs); ddx = ddx.concat(i.ddx); });
    return { items:items, redFlags:redFlags, targetedLabs:uniq(targetedLabs), ddx:uniq(ddx) };
  }

  var COMPLAINT_NOTE = {
    sleepiness: 'Complaint is <strong>sleepiness</strong> — prioritize sleep disorders (OSA, insufficient sleep, narcolepsy); consider a sleep study and the Epworth scale.',
    fatigue: 'Complaint is <strong>fatigue / low energy</strong> — pursue the systemic differential below.',
    weakness: 'Complaint is <strong>weakness / dyspnea</strong> — prioritize neuromuscular, cardiac, and pulmonary causes.'
  };

  // ── Render results ──────────────────────────────────────────────────────
  function render(){
    var a = aggregate();
    var el = mount.querySelector('#fw-results');
    var h = '';

    if (a.redFlags.length) {
      h += '<div class="fw-alert">⚠ ' + a.redFlags.length + ' red flag' + (a.redFlags.length>1?'s':'') + ' selected — expedite evaluation and directed workup before attributing fatigue to a benign or psychiatric cause.</div>';
    }

    if (complaint) h += '<div class="fw-res-block"><div class="fw-ddx">' + COMPLAINT_NOTE[complaint] + '</div></div>';

    // First-line labs
    h += '<div class="fw-res-block"><h4>First-line labs (most patients)</h4><div class="fw-chiplist">'
      + FIRST_LINE.map(function(l){ return '<span class="fw-chip fw-chip-lab-1">' + esc(l) + '</span>'; }).join('')
      + '</div></div>';

    // Targeted labs
    h += '<div class="fw-res-block"><h4>Targeted / second-line labs</h4>';
    if (a.targetedLabs.length) h += '<div class="fw-chiplist">' + a.targetedLabs.map(function(l){ return '<span class="fw-chip fw-chip-lab">' + esc(l) + '</span>'; }).join('') + '</div>';
    else h += '<div class="fw-res-empty">Select symptoms to generate targeted testing.</div>';
    h += '</div>';

    // Differential
    h += '<div class="fw-res-block"><h4>Differential to consider</h4>';
    if (a.ddx.length) h += '<ul class="fw-ddx">' + a.ddx.map(function(d){ return '<li>' + esc(d) + '</li>'; }).join('') + '</ul>';
    else h += '<div class="fw-res-empty">No symptoms selected yet.</div>';
    h += '</div>';

    h += '<div class="fw-actions">'
      + '<button type="button" class="fw-btn fw-btn-primary" id="fw-report">Generate Report</button>'
      + '<button type="button" class="fw-btn fw-btn-ghost" id="fw-reset">Reset</button>'
      + '</div>';
    h += '<textarea id="fw-report-out" class="fw-report-out" readonly hidden></textarea>';
    h += '<div class="fw-footnote">Untargeted lab testing is low-yield; this panel is guided by the findings you select. Frameworks are decision-support, not a substitute for clinical judgment or a complete evaluation. First-line testing is reasonable in most patients with unexplained, persistent fatigue.</div>';

    el.innerHTML = h;

    el.querySelector('#fw-report').addEventListener('click', function(){
      var out = el.querySelector('#fw-report-out');
      var text = buildReport(a);
      out.value = text; out.hidden = false;
      if (window.ToolUtils) ToolUtils.copyWithButton(text, this);
    });
    el.querySelector('#fw-reset').addEventListener('click', function(){
      var run = function(){
        selected = {}; complaint = '';
        mount.querySelectorAll('.fw-item input').forEach(function(cb){ cb.checked = false; });
        mount.querySelectorAll('.fw-clarify-btn').forEach(function(x){ x.classList.remove('fw-on'); });
        render();
      };
      if (window.ToolUtils) ToolUtils.confirmReset('Clear all selections?', run);
      else if (confirm('Clear all selections?')) run();
    });
  }

  // ── Report ──────────────────────────────────────────────────────────────
  function buildReport(a){
    var L = [];
    L.push('FATIGUE / LOW ENERGY WORKUP');
    L.push('Date: ' + (window.ToolUtils ? ToolUtils.dateStamp() : new Date().toLocaleDateString()));
    if (complaint) L.push('Complaint type: ' + complaint);
    L.push('');
    if (a.redFlags.length) {
      L.push('*** RED FLAGS PRESENT — EXPEDITE EVALUATION ***');
      a.redFlags.forEach(function(i){ L.push('  - ' + i.label); });
      L.push('');
    }
    var t2 = a.items.filter(function(i){ return i.tier===2; });
    var t3 = a.items.filter(function(i){ return i.tier===3; });
    if (t2.length) { L.push('COMMON POINTERS (Tier 2):'); t2.forEach(function(i){ L.push('  - ' + i.label); }); L.push(''); }
    if (t3.length) { L.push('TARGETED / RARE POINTERS (Tier 3):'); t3.forEach(function(i){ L.push('  - ' + i.label); }); L.push(''); }
    L.push('SUGGESTED FIRST-LINE LABS:');
    FIRST_LINE.forEach(function(l){ L.push('  - ' + l); });
    L.push('');
    if (a.targetedLabs.length) { L.push('SUGGESTED TARGETED / SECOND-LINE LABS:'); a.targetedLabs.forEach(function(l){ L.push('  - ' + l); }); L.push(''); }
    if (a.ddx.length) { L.push('DIFFERENTIAL TO CONSIDER:'); a.ddx.forEach(function(d){ L.push('  - ' + d); }); L.push(''); }
    L.push('Note: Decision-support only. Untargeted testing is low-yield; correlate with history,');
    L.push('exam, and age-appropriate cancer screening. Not a substitute for clinical judgment.');
    return L.join('\n');
  }

  render();
})();

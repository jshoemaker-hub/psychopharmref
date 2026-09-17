/**
 * sleep-aids-tool.js — OTC / Non-Prescription Sleep Aid Comparison (prefix: sa-)
 *
 * A filterable, searchable reference that puts non-prescription sleep aids
 * side by side by category, mechanism, typical dose, onset/duration,
 * evidence grade, key risks, and interactions. Companion to the
 * "Non-Prescription Sleep Aids" chapter. Educational decision-support only.
 *
 * Evidence grades reflect the strength of controlled human data for a direct
 * sleep effect: mod = low–moderate, low = low, min = minimal/preliminary,
 * none = not supported / recommended against.
 */
(function () {
  'use strict';

  var mount = document.getElementById('sa-container');
  if (!mount || mount.dataset.init) return;
  mount.dataset.init = '1';

  // ── Data ──────────────────────────────────────────────────────────────────
  // cat: antihist | melatonin | herbal | mineral | cannabis
  // grade: mod | low | min | none
  // elderly: true = Beers / geriatric-avoid or notable caution in older adults
  var AGENTS = [
    { name:'Diphenhydramine', sub:'Benadryl, ZzzQuil, "PM" products', cat:'antihist', grade:'low', elderly:true,
      mech:'Sedating H1 antagonist; potent anticholinergic', dose:'25–50 mg at bedtime, occasional use',
      onset:'Onset ~30–60 min; long carryover', risks:'Rapid tolerance (~3–4 d); next-day sedation; anticholinergic delirium/falls; Beers: avoid ≥65',
      inter:'Additive with other anticholinergics, sedatives, opioids, alcohol' },
    { name:'Doxylamine', sub:'Unisom SleepTabs', cat:'antihist', grade:'low', elderly:true,
      mech:'Sedating H1 antagonist; anticholinergic; longer t½ (~10 h)', dose:'25 mg at bedtime, occasional use',
      onset:'Onset ~30 min; marked next-day carryover', risks:'Tolerance; strong next-morning grogginess; anticholinergic load; Beers: avoid ≥65',
      inter:'Additive anticholinergic/sedative; doxylamine-pyridoxine used for pregnancy nausea' },
    { name:'Melatonin', sub:'chronobiotic', cat:'melatonin', grade:'mod', elderly:false,
      mech:'MT1/MT2 agonist; shifts circadian clock, weak direct hypnotic', dose:'0.5–5 mg; timing > dose; low dose hours before bed for phase shift',
      onset:'Circadian effect > acute sedation', risks:'Best for circadian problems/jet lag/ASD; small effect in primary insomnia; label content 74–347% of stated; pediatric ingestion risk',
      inter:'Fluvoxamine ↑ levels (CYP1A2); additive sedation; theoretical anticoagulant/glucose effects' },
    { name:'Valerian', sub:'Valeriana officinalis', cat:'herbal', grade:'low', elderly:false,
      mech:'GABA-A modulation; inhibits GABA reuptake/breakdown', dose:'300–600 mg extract 30–120 min before bed',
      onset:'May take days–weeks', risks:'Mixed evidence; additive sedation; rare hepatotoxicity (often combo products)',
      inter:'Additive with sedatives/alcohol; possible CYP3A4 effects' },
    { name:'Hops', sub:'Humulus lupulus', cat:'herbal', grade:'low', elderly:false,
      mech:'GABAergic; melatonin/serotonin receptor activity', dose:'Usually combined with valerian',
      onset:'Gradual', risks:'Best data are for valerian+hops combinations; estrogenic in vitro',
      inter:'Additive sedation' },
    { name:'Chamomile', sub:'Matricaria', cat:'herbal', grade:'min', elderly:false,
      mech:'Apigenin binds benzodiazepine site of GABA-A', dose:'Tea or 200–400 mg extract',
      onset:'Mild', risks:'Minimal evidence; allergy in Asteraceae-sensitive patients',
      inter:'Theoretical anticoagulant interaction' },
    { name:'Passionflower', sub:'Passiflora incarnata', cat:'herbal', grade:'min', elderly:false,
      mech:'GABAergic', dose:'Tea or extract before bed',
      onset:'Mild', risks:'Few small trials; additive sedation; limited pregnancy data',
      inter:'Additive sedation' },
    { name:'Lavender', sub:'oral silexan / aromatherapy', cat:'herbal', grade:'low', elderly:false,
      mech:'Anxiolytic; oral standardized oil modulates VDCC/5-HT1A', dose:'Silexan 80 mg oral; or aromatherapy',
      onset:'Anxiety benefit, secondary sleep effect', risks:'Eructation/GI with oral oil; contested endocrine effects',
      inter:'Additive sedation' },
    { name:'Lemon balm', sub:'Melissa officinalis', cat:'herbal', grade:'min', elderly:false,
      mech:'GABA transaminase inhibition', dose:'Often combined with valerian',
      onset:'Mild', risks:'Minimal evidence; theoretical thyroid effects at high dose',
      inter:'Additive sedation' },
    { name:'Ashwagandha', sub:'Withania somnifera', cat:'herbal', grade:'low', elderly:false,
      mech:'Adaptogen; GABA-mimetic; cortisol reduction', dose:'KSM-66/root extract 300 mg twice daily',
      onset:'Gradual over weeks', risks:'Hepatotoxicity case reports; may raise thyroid hormones; immunostimulant; avoid in pregnancy',
      inter:'Additive sedation; thyroid meds; caution in autoimmune disease' },
    { name:'Kava', sub:'Piper methysticum', cat:'herbal', grade:'none', elderly:false,
      mech:'Kavalactones modulate GABA-A', dose:'~120–250 mg kavalactones (anxiety-related)',
      onset:'Anxiety > sleep', risks:'SERIOUS hepatotoxicity incl. failure/transplant/death; not recommended for sleep',
      inter:'Avoid alcohol, acetaminophen, other hepatotoxins; CYP inhibition' },
    { name:'Tart cherry', sub:'Prunus cerasus', cat:'herbal', grade:'min', elderly:false,
      mech:'Contains natural melatonin; anti-inflammatory', dose:'Juice/concentrate',
      onset:'Mild', risks:'Small pilot studies only; sugar load in juice',
      inter:'None significant' },
    { name:'Magnesium', sub:'glycinate / citrate', cat:'mineral', grade:'mod', elderly:true,
      mech:'NMDA antagonist; GABA-A agonist; deficiency common', dose:'~200–500 mg elemental at bedtime',
      onset:'Gradual', risks:'Best mineral option; dose-dependent diarrhea; ACCUMULATES in renal impairment — check kidney function',
      inter:'Chelates some antibiotics/bisphosphonates (separate dosing); caution in CKD' },
    { name:'Glycine', sub:'amino acid', cat:'mineral', grade:'low', elderly:false,
      mech:'Inhibitory neurotransmitter; lowers core body temperature', dose:'~3 g at bedtime',
      onset:'Acute', risks:'Small trials suggest better subjective sleep/less daytime fatigue; well tolerated',
      inter:'Minimal' },
    { name:'L-theanine', sub:'amino acid (tea)', cat:'mineral', grade:'low', elderly:false,
      mech:'Promotes relaxation; alpha-wave activity; raises GABA', dose:'~200 mg',
      onset:'Acute, mild', risks:'Benign safety profile; limited but generally positive data; often an adjunct',
      inter:'Additive with sedatives (mild)' },
    { name:'Tryptophan / 5-HTP', sub:'serotonin/melatonin precursor', cat:'mineral', grade:'min', elderly:false,
      mech:'Precursor to serotonin and melatonin', dose:'Tryptophan ≥1 g; 5-HTP variable',
      onset:'Variable', risks:'Mixed efficacy; EMS history (contaminated batch, 1989); GI upset',
      inter:'SEROTONIN SYNDROME risk with SSRIs/SNRIs/MAOIs/other serotonergics' },
    { name:'THC (cannabis)', sub:'Δ9-tetrahydrocannabinol', cat:'cannabis', grade:'min', elderly:true,
      mech:'CB1 partial agonist', dose:'Highly variable; therapeutic ~2.5–15 mg',
      onset:'Fast tolerance; edibles delayed/unpredictable', risks:'No consistent objective architecture change at therapeutic dose; withdrawal insomnia/REM rebound drives use; impairment, anxiety/psychosis, CHS, CUD; avoid in pregnancy/adolescents',
      inter:'CYP2C9/3A4 substrate; additive sedation' },
    { name:'CBD', sub:'cannabidiol', cat:'cannabis', grade:'min', elderly:false,
      mech:'5-HT1A agonism; indirect endocannabinoid; anxiolytic', dose:'Dose-dependent; ~150 mg tried for insomnia',
      onset:'Indirect (via anxiety)', risks:'Underwhelming as direct hypnotic; low dose may be alerting; high dose can ↑ transaminases',
      inter:'CYP3A4/2C19 INHIBITOR: ↑ clobazam, warfarin (INR), tacrolimus, some AEDs' },
    { name:'CBN', sub:'cannabinol', cat:'cannabis', grade:'none', elderly:false,
      mech:'Mildly psychoactive THC breakdown product', dose:'Marketed doses vary; no validated regimen',
      onset:'Unclear', risks:'"Sleep cannabinoid" branding is commercial; essentially no rigorous standalone human evidence',
      inter:'Data limited' }
  ];

  var CATS = [
    { id:'all', label:'All' },
    { id:'antihist', label:'OTC antihistamines' },
    { id:'melatonin', label:'Melatonin' },
    { id:'herbal', label:'Herbal / botanical' },
    { id:'mineral', label:'Minerals / amino acids' },
    { id:'cannabis', label:'Cannabis' }
  ];
  var CAT_LABEL = { antihist:'Antihistamine', melatonin:'Melatonin', herbal:'Herbal', mineral:'Mineral/AA', cannabis:'Cannabis' };
  var GRADE_LABEL = { mod:'Low–moderate', low:'Low', min:'Minimal', none:'Not supported' };
  var GRADE_RANK = { mod:3, low:2, min:1, none:0 };

  var state = { cat:'all', grade:'all', q:'', sort:'cat', geriOnly:false };

  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  // ── Shell ───────────────────────────────────────────────────────────────
  var html = '';
  html += '<div class="sa-controls">';
  html += '  <input type="text" id="sa-search" class="sa-search" autocomplete="off" placeholder="Search agents, mechanism, or risk (e.g. anticholinergic, CYP, magnesium, withdrawal)…">';
  html += '  <div class="sa-filter-row"><span class="sa-filter-label">Category</span>' +
            CATS.map(function(c){ return '<button type="button" class="sa-chip' + (c.id==='all'?' sa-active':'') + '" data-cat="' + c.id + '">' + esc(c.label) + '</button>'; }).join('') +
          '</div>';
  html += '  <div class="sa-filter-row"><span class="sa-filter-label">Evidence</span>' +
            '<button type="button" class="sa-chip sa-active" data-grade="all">All</button>' +
            '<button type="button" class="sa-chip" data-grade="mod">Low–moderate+</button>' +
            '<button type="button" class="sa-chip" data-grade="low">Low+</button>' +
          '</div>';
  html += '  <div class="sa-toolbar">';
  html += '    <label class="sa-toggle"><input type="checkbox" id="sa-geri"> Flag agents to avoid / use cautiously in adults ≥65</label>';
  html += '    <span class="sa-sort">Sort: <select id="sa-sort"><option value="cat">Category</option><option value="name">Name (A–Z)</option><option value="grade">Evidence (high→low)</option></select></span>';
  html += '  </div>';
  html += '  <div class="sa-count" id="sa-count"></div>';
  html += '</div>';
  html += '<div class="sa-grid" id="sa-grid"></div>';
  html += '<div class="sa-empty" id="sa-empty" hidden>No agents match these filters.</div>';
  html += '<div class="sa-footnote">Evidence grades reflect the strength of controlled human data for a <em>direct</em> sleep effect and are deliberately conservative. Doses are typical literature ranges, not individualized recommendations; supplement content is not FDA-verified and varies widely. Cognitive behavioral therapy for insomnia (CBT-I) remains first-line for chronic insomnia. Decision-support only — confirm against current references and the full medication list.</div>';
  mount.innerHTML = html;

  var elGrid = mount.querySelector('#sa-grid');
  var elEmpty = mount.querySelector('#sa-empty');
  var elCount = mount.querySelector('#sa-count');

  // ── Events ──────────────────────────────────────────────────────────────
  mount.querySelector('#sa-search').addEventListener('input', function(){ state.q = this.value.trim().toLowerCase(); render(); });
  mount.querySelectorAll('[data-cat]').forEach(function(b){
    b.addEventListener('click', function(){
      state.cat = this.dataset.cat;
      mount.querySelectorAll('[data-cat]').forEach(function(x){ x.classList.remove('sa-active'); });
      this.classList.add('sa-active'); render();
    });
  });
  mount.querySelectorAll('[data-grade]').forEach(function(b){
    b.addEventListener('click', function(){
      state.grade = this.dataset.grade;
      mount.querySelectorAll('[data-grade]').forEach(function(x){ x.classList.remove('sa-active'); });
      this.classList.add('sa-active'); render();
    });
  });
  mount.querySelector('#sa-geri').addEventListener('change', function(){ state.geriOnly = this.checked; render(); });
  mount.querySelector('#sa-sort').addEventListener('change', function(){ state.sort = this.value; render(); });

  // ── Render ──────────────────────────────────────────────────────────────
  function matches(a){
    if (state.cat !== 'all' && a.cat !== state.cat) return false;
    if (state.grade === 'mod' && GRADE_RANK[a.grade] < 3) return false;
    if (state.grade === 'low' && GRADE_RANK[a.grade] < 2) return false;
    if (state.q) {
      var hay = (a.name + ' ' + a.sub + ' ' + a.mech + ' ' + a.dose + ' ' + a.risks + ' ' + a.inter + ' ' + CAT_LABEL[a.cat]).toLowerCase();
      if (hay.indexOf(state.q) === -1) return false;
    }
    return true;
  }

  function sortList(list){
    var l = list.slice();
    if (state.sort === 'name') l.sort(function(a,b){ return a.name.localeCompare(b.name); });
    else if (state.sort === 'grade') l.sort(function(a,b){ return GRADE_RANK[b.grade] - GRADE_RANK[a.grade] || a.name.localeCompare(b.name); });
    else { // category order as defined, then name
      var order = { antihist:0, melatonin:1, herbal:2, mineral:3, cannabis:4 };
      l.sort(function(a,b){ return order[a.cat] - order[b.cat] || a.name.localeCompare(b.name); });
    }
    return l;
  }

  function card(a){
    var flag = (state.geriOnly && a.elderly)
      ? '<div class="sa-flag">⚠ Avoid or use caution in adults ≥65</div>' : '';
    return '<div class="sa-card' + (state.geriOnly && a.elderly ? ' sa-avoid-elderly' : '') + '">'
      + '<div class="sa-card-head">'
      +   '<div class="sa-name">' + esc(a.name) + '<em>' + esc(a.sub) + '</em></div>'
      +   '<div class="sa-badges">'
      +     '<span class="sa-cat-badge sa-cat-' + a.cat + '">' + esc(CAT_LABEL[a.cat]) + '</span>'
      +     '<span class="sa-grade sa-g-' + a.grade + '">' + esc(GRADE_LABEL[a.grade]) + '</span>'
      +   '</div>'
      + '</div>'
      + flag
      + '<div class="sa-rows">'
      +   row('Mechanism', a.mech)
      +   row('Dose', a.dose)
      +   row('Onset', a.onset)
      +   row('Key risks', a.risks)
      +   row('Interactions', a.inter)
      + '</div>'
      + '</div>';
  }
  function row(k, v){ return '<div class="sa-row"><span class="sa-k">' + esc(k) + '</span><span class="sa-v">' + esc(v) + '</span></div>'; }

  function render(){
    var list = sortList(AGENTS.filter(matches));
    if (!list.length) { elGrid.innerHTML = ''; elEmpty.hidden = false; elCount.textContent = ''; return; }
    elEmpty.hidden = true;
    elGrid.innerHTML = list.map(card).join('');
    elCount.textContent = 'Showing ' + list.length + ' of ' + AGENTS.length + ' agents';
  }

  render();
})();

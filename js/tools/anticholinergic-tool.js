/**
 * anticholinergic-tool.js — Anticholinergic Burden Assessment (prefix: acb-)
 *
 * Clinician builds a patient's medication list from a searchable library of
 * anticholinergic agents; the tool sums cumulative burden on two validated,
 * published scales and interprets the risk, with older-adult (≥65) flags.
 *
 * Scales:
 *   ACB — Anticholinergic Cognitive Burden scale (Boustani 2008; 2012 update)
 *   ARS — Anticholinergic Risk Scale (Rudolph 2008, Arch Intern Med)
 * Per-drug scores are taken from the published scales. A dash (—) means the
 * agent is not scored on that scale, so it does not contribute to that total.
 *
 * (The Anticholinergic Drug Scale [ADS, Carnahan 2006] uses the same
 *  {name, cat, acb, ars, ads} row schema — an `ads` value can be dropped in
 *  per drug when that scale's full appendix is available.)
 */
(function () {
  'use strict';

  var mount = document.getElementById('acb-container');
  if (!mount || mount.dataset.init) return;
  mount.dataset.init = '1';

  // ── Drug library ──────────────────────────────────────────────────────────
  // [name, brand, category, acb, ars]   (null = not scored on that scale)
  var LIB = [
    // Tricyclic & tetracyclic antidepressants
    ['Amitriptyline','Elavil','TCA antidepressant',3,3],
    ['Nortriptyline','Pamelor','TCA antidepressant',3,2],
    ['Imipramine','Tofranil','TCA antidepressant',3,3],
    ['Desipramine','Norpramin','TCA antidepressant',3,2],
    ['Clomipramine','Anafranil','TCA antidepressant',3,null],
    ['Doxepin','Silenor / Sinequan','TCA antidepressant',3,null],
    ['Trimipramine','Surmontil','TCA antidepressant',3,null],
    ['Amoxapine','Asendin','TCA antidepressant',3,null],
    // Other antidepressants
    ['Paroxetine','Paxil','Antidepressant',3,1],
    ['Fluvoxamine','Luvox','Antidepressant',1,null],
    ['Venlafaxine','Effexor','Antidepressant',1,null],
    ['Trazodone','Desyrel','Antidepressant',1,1],
    ['Bupropion','Wellbutrin','Antidepressant',1,null],
    ['Mirtazapine','Remeron','Antidepressant',null,1],
    // Antipsychotics
    ['Chlorpromazine','Thorazine','Antipsychotic',3,3],
    ['Thioridazine','Mellaril','Antipsychotic',3,3],
    ['Trifluoperazine','Stelazine','Antipsychotic',3,3],
    ['Perphenazine','Trilafon','Antipsychotic',3,3],
    ['Fluphenazine','Prolixin','Antipsychotic',null,3],
    ['Thiothixene','Navane','Antipsychotic',null,3],
    ['Clozapine','Clozaril','Antipsychotic',3,2],
    ['Olanzapine','Zyprexa','Antipsychotic',3,2],
    ['Quetiapine','Seroquel','Antipsychotic',3,1],
    ['Loxapine','Loxitane','Antipsychotic',2,null],
    ['Molindone','Moban','Antipsychotic',2,null],
    ['Pimozide','Orap','Antipsychotic',2,null],
    ['Methotrimeprazine','Levomepromazine','Antipsychotic',2,null],
    ['Prochlorperazine','Compazine','Antipsychotic / antiemetic',null,2],
    ['Haloperidol','Haldol','Antipsychotic',1,1],
    ['Risperidone','Risperdal','Antipsychotic',1,1],
    ['Paliperidone','Invega','Antipsychotic',1,null],
    ['Iloperidone','Fanapt','Antipsychotic',1,null],
    ['Aripiprazole','Abilify','Antipsychotic',1,null],
    ['Asenapine','Saphris','Antipsychotic',1,null],
    ['Ziprasidone','Geodon','Antipsychotic',null,1],
    // Antihistamines (first & second generation)
    ['Diphenhydramine','Benadryl','Antihistamine',3,3],
    ['Hydroxyzine','Vistaril / Atarax','Antihistamine / anxiolytic',3,3],
    ['Chlorpheniramine','Chlor-Trimeton','Antihistamine',3,3],
    ['Promethazine','Phenergan','Antihistamine / antiemetic',3,3],
    ['Meclizine','Antivert','Antihistamine (vestibular)',3,3],
    ['Cyproheptadine','Periactin','Antihistamine',2,3],
    ['Brompheniramine','Dimetapp','Antihistamine',3,null],
    ['Carbinoxamine','Karbinal','Antihistamine',3,null],
    ['Clemastine','Tavist','Antihistamine',3,null],
    ['Dimenhydrinate','Dramamine','Antihistamine',3,null],
    ['Doxylamine','Unisom','Antihistamine (OTC hypnotic)',3,null],
    ['Trimeprazine','Alimemazine','Antihistamine',1,null],
    ['Cetirizine','Zyrtec','Antihistamine (2nd gen)',1,2],
    ['Loratadine','Claritin','Antihistamine (2nd gen)',1,2],
    ['Levocetirizine','Xyzal','Antihistamine (2nd gen)',1,null],
    ['Desloratadine','Clarinex','Antihistamine (2nd gen)',1,null],
    // Bladder antimuscarinics
    ['Oxybutynin','Ditropan','Bladder antimuscarinic',3,3],
    ['Tolterodine','Detrol','Bladder antimuscarinic',3,2],
    ['Darifenacin','Enablex','Bladder antimuscarinic',3,null],
    ['Fesoterodine','Toviaz','Bladder antimuscarinic',3,null],
    ['Solifenacin','Vesicare','Bladder antimuscarinic',3,null],
    ['Trospium','Sanctura','Bladder antimuscarinic',3,null],
    ['Flavoxate','Urispas','Bladder antimuscarinic',3,null],
    ['Propiverine','Mictonorm','Bladder antimuscarinic',3,null],
    // GI antimuscarinics / antispasmodics
    ['Dicyclomine','Bentyl','GI antispasmodic',3,3],
    ['Hyoscyamine','Levsin','GI antispasmodic',3,3],
    ['Atropine','Atropine','Antimuscarinic',3,3],
    ['Scopolamine','Transderm Scop','Antimuscarinic',3,null],
    ['Propantheline','Pro-Banthine','GI antispasmodic',3,null],
    ['Clidinium','Librax (w/ chlordiazepoxide)','GI antispasmodic',1,null],
    ['Belladonna alkaloids','Donnatal','GI antispasmodic',1,null],
    ['Loperamide','Imodium','GI (antidiarrheal)',1,2],
    ['Metoclopramide','Reglan','GI prokinetic',null,1],
    // Antiparkinson agents
    ['Benztropine','Cogentin','Antiparkinson (anticholinergic)',3,3],
    ['Trihexyphenidyl','Artane','Antiparkinson (anticholinergic)',3,null],
    ['Amantadine','Symmetrel','Antiparkinson / antiviral',1,2],
    ['Carbidopa-levodopa','Sinemet','Antiparkinson',null,1],
    ['Entacapone','Comtan','Antiparkinson (COMT inhibitor)',null,1],
    ['Pramipexole','Mirapex','Antiparkinson (dopamine agonist)',null,1],
    ['Selegiline','Eldepryl','Antiparkinson (MAO-B inhibitor)',null,1],
    // Muscle relaxants
    ['Cyclobenzaprine','Flexeril','Muscle relaxant',2,2],
    ['Orphenadrine','Norflex','Muscle relaxant',3,null],
    ['Methocarbamol','Robaxin','Muscle relaxant',3,1],
    ['Carisoprodol','Soma','Muscle relaxant',null,3],
    ['Tizanidine','Zanaflex','Muscle relaxant',null,3],
    ['Baclofen','Lioresal','Muscle relaxant',null,2],
    // Cardiovascular
    ['Atenolol','Tenormin','Cardiovascular (beta blocker)',1,null],
    ['Metoprolol','Lopressor / Toprol','Cardiovascular (beta blocker)',1,null],
    ['Captopril','Capoten','Cardiovascular (ACE inhibitor)',1,null],
    ['Hydralazine','Apresoline','Cardiovascular (vasodilator)',1,null],
    ['Nifedipine','Procardia','Cardiovascular (CCB)',1,null],
    ['Digoxin','Lanoxin','Cardiovascular (glycoside)',1,null],
    ['Dipyridamole','Persantine','Cardiovascular (antiplatelet)',1,null],
    ['Disopyramide','Norpace','Cardiovascular (antiarrhythmic)',1,null],
    ['Isosorbide','Isordil / Imdur','Cardiovascular (nitrate)',1,null],
    ['Quinidine','Quinidine','Cardiovascular (antiarrhythmic)',1,null],
    ['Warfarin','Coumadin','Anticoagulant',1,null],
    // Diuretics
    ['Furosemide','Lasix','Diuretic',1,null],
    ['Chlorthalidone','Thalitone','Diuretic',1,null],
    ['Triamterene','Dyrenium','Diuretic',1,null],
    // GI acid / H2
    ['Cimetidine','Tagamet','GI (H2 blocker)',1,2],
    ['Ranitidine','Zantac','GI (H2 blocker)',1,1],
    // Opioids
    ['Codeine','Codeine','Opioid',1,null],
    ['Morphine','MS Contin','Opioid',1,null],
    ['Fentanyl','Duragesic','Opioid',1,null],
    ['Meperidine','Demerol','Opioid',2,null],
    // Benzodiazepines
    ['Alprazolam','Xanax','Benzodiazepine',1,null],
    ['Diazepam','Valium','Benzodiazepine',1,null],
    ['Clorazepate','Tranxene','Benzodiazepine',1,null],
    // Decongestant combo
    ['Pseudoephedrine-triprolidine','Actifed','Decongestant / antihistamine',null,2],
    // Other
    ['Theophylline','Theo-24','Respiratory (methylxanthine)',1,null],
    ['Colchicine','Colcrys','Antigout',1,null],
    ['Prednisone','Deltasone','Corticosteroid',1,null],
    ['Hydrocortisone','Cortef','Corticosteroid',1,null],
    ['Nefopam','Acupan','Non-opioid analgesic',2,null]
  ];

  // Normalize into objects with a stable id
  var DRUGS = LIB.map(function (r, i) {
    return { id: i, name: r[0], brand: r[1], cat: r[2], acb: r[3], ars: r[4],
             search: (r[0] + ' ' + r[1] + ' ' + r[2]).toLowerCase() };
  });

  var selected = [];      // array of drug ids
  var primaryScale = 'acb'; // 'acb' | 'ars'
  var elderly = false;

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function scoreTxt(v) { return v === null ? '—' : String(v); }
  function strong(d) { return d.acb === 3 || d.ars === 3; }

  // ── Static shell ──────────────────────────────────────────────────────────
  var html = '';
  html += '<div class="acb-search-wrap">';
  html += '  <label class="acb-search-label" for="acb-search">Add a medication</label>';
  html += '  <input type="text" id="acb-search" class="acb-search" autocomplete="off" placeholder="Type a drug or brand name (e.g. oxybutynin, Benadryl, amitriptyline)…">';
  html += '  <div class="acb-results" id="acb-results" hidden></div>';
  html += '</div>';

  html += '<label class="acb-elderly"><input type="checkbox" id="acb-elderly"> Patient is <strong>65 years or older</strong> (apply geriatric flags)</label>';

  html += '<div class="acb-list-head"><span>Medication</span><span>ACB</span><span>ARS</span><span></span></div>';
  html += '<div class="acb-list" id="acb-list"></div>';
  html += '<div class="acb-empty" id="acb-empty">No medications added yet. Search above to build the patient’s regimen.</div>';

  html += '<div class="acb-scale-toggle">';
  html += '  <span class="acb-toggle-label">Interpret by:</span>';
  html += '  <button type="button" class="acb-tab acb-active" data-scale="acb">ACB scale</button>';
  html += '  <button type="button" class="acb-tab" data-scale="ars">ARS scale</button>';
  html += '</div>';

  html += '<div class="acb-totals">';
  html += '  <div class="acb-total-card" id="acb-card-acb">';
  html += '    <div class="acb-total-num"><span id="acb-total-acb">0</span></div>';
  html += '    <div class="acb-total-name">ACB total</div>';
  html += '    <div class="acb-band" id="acb-band-acb">—</div>';
  html += '  </div>';
  html += '  <div class="acb-total-card" id="acb-card-ars">';
  html += '    <div class="acb-total-num"><span id="acb-total-ars">0</span></div>';
  html += '    <div class="acb-total-name">ARS total</div>';
  html += '    <div class="acb-band" id="acb-band-ars">—</div>';
  html += '  </div>';
  html += '</div>';

  html += '<div class="acb-interpret" id="acb-interpret"></div>';

  html += '<div class="acb-actions">';
  html += '  <button type="button" class="acb-btn acb-btn-primary" id="acb-report">Generate Report</button>';
  html += '  <button type="button" class="acb-btn acb-btn-ghost" id="acb-reset">Reset</button>';
  html += '</div>';
  html += '<textarea id="acb-report-out" class="acb-report-out" readonly hidden></textarea>';

  html += '<div class="acb-footnote">Scores are additive across a regimen. Each scale covers its own set of agents; “—” means the drug is not scored on that scale and does not add to that total. A tool for clinical support — confirm against the full medication list and current references.</div>';

  mount.innerHTML = html;

  // ── Elements ──────────────────────────────────────────────────────────────
  var elSearch  = mount.querySelector('#acb-search');
  var elResults = mount.querySelector('#acb-results');
  var elList    = mount.querySelector('#acb-list');
  var elEmpty   = mount.querySelector('#acb-empty');
  var elElderly = mount.querySelector('#acb-elderly');

  // ── Search / add ──────────────────────────────────────────────────────────
  function renderResults(q) {
    q = q.trim().toLowerCase();
    if (!q) { elResults.hidden = true; elResults.innerHTML = ''; return; }
    var matches = DRUGS.filter(function (d) {
      return d.search.indexOf(q) !== -1 && selected.indexOf(d.id) === -1;
    }).slice(0, 12);
    if (!matches.length) {
      elResults.innerHTML = '<div class="acb-noresult">No match — this agent may not be on the ACB or ARS scale.</div>';
      elResults.hidden = false;
      return;
    }
    elResults.innerHTML = matches.map(function (d) {
      return '<button type="button" class="acb-result" data-id="' + d.id + '">'
        + '<span class="acb-r-name">' + esc(d.name) + ' <em>(' + esc(d.brand) + ')</em></span>'
        + '<span class="acb-r-cat">' + esc(d.cat) + '</span>'
        + '<span class="acb-r-scores">ACB ' + scoreTxt(d.acb) + ' · ARS ' + scoreTxt(d.ars) + '</span>'
        + '</button>';
    }).join('');
    elResults.hidden = false;
  }

  function addDrug(id) {
    if (selected.indexOf(id) === -1) selected.push(id);
    elSearch.value = '';
    elResults.hidden = true;
    elResults.innerHTML = '';
    render();
    elSearch.focus();
  }

  function removeDrug(id) {
    selected = selected.filter(function (x) { return x !== id; });
    render();
  }

  elSearch.addEventListener('input', function () { renderResults(this.value); });
  elSearch.addEventListener('focus', function () { if (this.value) renderResults(this.value); });
  elResults.addEventListener('click', function (e) {
    var b = e.target.closest('.acb-result');
    if (b) addDrug(parseInt(b.dataset.id, 10));
  });
  // Enter adds the single best match
  elSearch.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      var first = elResults.querySelector('.acb-result');
      if (first) { e.preventDefault(); addDrug(parseInt(first.dataset.id, 10)); }
    }
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.acb-search-wrap')) elResults.hidden = true;
  });

  elList.addEventListener('click', function (e) {
    var b = e.target.closest('.acb-remove');
    if (b) removeDrug(parseInt(b.dataset.id, 10));
  });

  elElderly.addEventListener('change', function () { elderly = this.checked; render(); });

  // Scale toggle
  mount.querySelectorAll('.acb-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      primaryScale = this.dataset.scale;
      mount.querySelectorAll('.acb-tab').forEach(function (t) { t.classList.remove('acb-active'); });
      this.classList.add('acb-active');
      render();
    });
  });

  // ── Scoring / bands ───────────────────────────────────────────────────────
  function totals() {
    var acb = 0, ars = 0;
    selected.forEach(function (id) {
      var d = DRUGS[id];
      if (d.acb) acb += d.acb;
      if (d.ars) ars += d.ars;
    });
    return { acb: acb, ars: ars };
  }

  function band(scale, total) {
    if (total === 0) return { cls: 'acb-b0', label: 'None' };
    if (total <= 2)  return { cls: 'acb-b1', label: scale === 'acb' ? 'Mild' : 'Low' };
    return { cls: 'acb-b3', label: scale === 'acb' ? 'High' : 'Elevated' };
  }

  function interpretText(scale, total) {
    var b = band(scale, total);
    if (scale === 'acb') {
      if (total === 0) return 'No anticholinergic cognitive burden from the listed agents.';
      if (total <= 2) return 'Mild cumulative burden (ACB ' + total + '). Monitor for anticholinergic effects; reduce where feasible, particularly in older or cognitively vulnerable patients.';
      return 'Clinically significant burden (ACB ' + total + ', ≥ 3). Higher cumulative ACB is associated with increased risk of cognitive impairment and decline, delirium, falls, and — in cohort data — mortality, with risk rising for each additional point. Prioritize deprescribing or substituting lower-burden alternatives.';
    } else {
      if (total === 0) return 'No anticholinergic risk from the listed agents on the ARS.';
      if (total <= 2) return 'Low cumulative risk (ARS ' + total + '). Monitor for peripheral and central anticholinergic effects.';
      return 'Elevated cumulative risk (ARS ' + total + ', ≥ 3). Higher ARS totals track with more anticholinergic adverse effects — confusion, dry mouth, constipation, urinary retention, blurred vision, tachycardia. Review the regimen and reduce burden where possible.';
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  function render() {
    // med list
    if (!selected.length) {
      elList.innerHTML = '';
      elEmpty.hidden = false;
    } else {
      elEmpty.hidden = true;
      elList.innerHTML = selected.map(function (id) {
        var d = DRUGS[id];
        var st = strong(d);
        return '<div class="acb-row' + (st ? ' acb-row-strong' : '') + '">'
          + '<span class="acb-c-name">' + esc(d.name)
            + ' <em>(' + esc(d.brand) + ')</em>'
            + (st ? ' <span class="acb-strong-tag" title="Score 3 on a validated scale; Beers criteria: avoid in adults ≥65">strong</span>' : '')
            + '<span class="acb-c-cat">' + esc(d.cat) + '</span>'
          + '</span>'
          + '<span class="acb-c-score acb-s' + (d.acb || 0) + '">' + scoreTxt(d.acb) + '</span>'
          + '<span class="acb-c-score acb-s' + (d.ars || 0) + '">' + scoreTxt(d.ars) + '</span>'
          + '<span class="acb-c-rm"><button type="button" class="acb-remove" data-id="' + d.id + '" aria-label="Remove">×</button></span>'
          + '</div>';
      }).join('');
    }

    // totals
    var t = totals();
    var bAcb = band('acb', t.acb), bArs = band('ars', t.ars);
    mount.querySelector('#acb-total-acb').textContent = t.acb;
    mount.querySelector('#acb-total-ars').textContent = t.ars;
    var bandAcbEl = mount.querySelector('#acb-band-acb');
    var bandArsEl = mount.querySelector('#acb-band-ars');
    bandAcbEl.textContent = bAcb.label; bandAcbEl.className = 'acb-band ' + bAcb.cls;
    bandArsEl.textContent = bArs.label; bandArsEl.className = 'acb-band ' + bArs.cls;

    // highlight the primary card
    mount.querySelector('#acb-card-acb').classList.toggle('acb-card-active', primaryScale === 'acb');
    mount.querySelector('#acb-card-ars').classList.toggle('acb-card-active', primaryScale === 'ars');

    // interpretation
    var total = primaryScale === 'acb' ? t.acb : t.ars;
    var b = band(primaryScale, total);
    var strongList = selected.map(function (id) { return DRUGS[id]; }).filter(strong);
    var parts = '';
    parts += '<div class="acb-interp-head ' + b.cls + '">' + (primaryScale === 'acb' ? 'ACB' : 'ARS')
      + ' ' + total + ' — ' + b.label + '</div>';
    parts += '<p class="acb-interp-body">' + interpretText(primaryScale, total) + '</p>';

    if (elderly) {
      var geri = '';
      if (total >= 3) {
        geri = 'Patient is ≥65: cumulative burden at this level is of particular concern for delirium, cognitive decline, and falls. ';
      } else {
        geri = 'Patient is ≥65: keep anticholinergic exposure as low as possible. ';
      }
      if (strongList.length) {
        geri += strongList.length + ' strongly anticholinergic agent' + (strongList.length > 1 ? 's are' : ' is')
          + ' on the list — these are Beers-criteria agents to avoid in older adults.';
      }
      parts += '<p class="acb-geri">⚠ ' + geri + '</p>';
    }

    if (strongList.length) {
      parts += '<div class="acb-strong-block"><strong>Strongly anticholinergic (score 3):</strong> '
        + strongList.map(function (d) { return esc(d.name); }).join(', ') + '</div>';
    }

    mount.querySelector('#acb-interpret').innerHTML = parts;
  }

  // ── Report ────────────────────────────────────────────────────────────────
  function buildReport() {
    var t = totals();
    var bAcb = band('acb', t.acb), bArs = band('ars', t.ars);
    var L = [];
    L.push('ANTICHOLINERGIC BURDEN ASSESSMENT');
    L.push('Date: ' + (window.ToolUtils ? ToolUtils.dateStamp() : new Date().toLocaleDateString()));
    if (elderly) L.push('Patient age group: 65 years or older');
    L.push('');
    L.push('MEDICATIONS (' + selected.length + '):');
    if (!selected.length) {
      L.push('  (none entered)');
    } else {
      selected.forEach(function (id) {
        var d = DRUGS[id];
        L.push('  - ' + d.name + ' (' + d.brand + ') — ACB ' + scoreTxt(d.acb)
          + ', ARS ' + scoreTxt(d.ars) + (strong(d) ? '  [STRONG]' : ''));
      });
    }
    L.push('');
    L.push('TOTALS:');
    L.push('  ACB (Anticholinergic Cognitive Burden, 2012 update): ' + t.acb + '  -> ' + bAcb.label);
    L.push('  ARS (Anticholinergic Risk Scale, Rudolph 2008): ' + t.ars + '  -> ' + bArs.label);
    L.push('');
    L.push('INTERPRETATION (' + (primaryScale === 'acb' ? 'ACB' : 'ARS') + '):');
    L.push('  ' + interpretText(primaryScale, primaryScale === 'acb' ? t.acb : t.ars));
    var strongList = selected.map(function (id) { return DRUGS[id]; }).filter(strong);
    if (strongList.length) {
      L.push('');
      L.push('STRONGLY ANTICHOLINERGIC AGENTS (score 3; Beers: avoid in adults >=65):');
      L.push('  ' + strongList.map(function (d) { return d.name; }).join(', '));
    }
    if (elderly && t.acb >= 3) {
      L.push('');
      L.push('GERIATRIC FLAG: Cumulative burden >=3 in a patient >=65 — elevated risk of');
      L.push('delirium, cognitive decline, and falls. Review for deprescribing.');
    }
    L.push('');
    L.push('Notes: Scores are additive across the regimen. Each scale covers a specific');
    L.push('set of agents; a dash means the drug is not scored on that scale. Clinical');
    L.push('judgement and the full medication list should guide decisions.');
    L.push('');
    L.push('References: Boustani M, et al. Aging Health 2008 (ACB; 2012 update).');
    L.push('Rudolph JL, et al. Arch Intern Med 2008;168(5):508-513 (ARS).');
    L.push('Beers Criteria: AGS 2023 update, J Am Geriatr Soc.');
    return L.join('\n');
  }

  mount.querySelector('#acb-report').addEventListener('click', function () {
    var out = mount.querySelector('#acb-report-out');
    var text = buildReport();
    out.value = text;
    out.hidden = false;
    if (window.ToolUtils) ToolUtils.copyWithButton(text, this);
  });

  mount.querySelector('#acb-reset').addEventListener('click', function () {
    var run = function () {
      selected = [];
      elderly = false;
      elElderly.checked = false;
      elSearch.value = '';
      elResults.hidden = true;
      var out = mount.querySelector('#acb-report-out');
      out.value = ''; out.hidden = true;
      render();
    };
    if (window.ToolUtils) ToolUtils.confirmReset('Reset the medication list?', run);
    else if (confirm('Reset the medication list?')) run();
  });

  render();
})();

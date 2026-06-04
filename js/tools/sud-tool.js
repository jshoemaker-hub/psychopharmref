/**
 * sud-tool.js — DSM-5-TR Substance Use Disorder documentation aid
 *
 * Select a substance; the 11 DSM-5-TR criteria populate with substance-
 * specific examples. Generates an EMR-ready summary. Tolerance and
 * withdrawal are excluded for hallucinogens, PCP, and inhalants (max = 10).
 */
(function () {
  'use strict';

  // ===== Configuration =====
  var substances = {
    alcohol:              { name: 'Alcohol',                           max: 11, excludeWithdrawal: false },
    cannabis:             { name: 'Cannabis',                          max: 11, excludeWithdrawal: false },
    phencyclidine:        { name: 'Phencyclidine',                     max: 10, excludeWithdrawal: true  },
    'other-hallucinogen': { name: 'Other Hallucinogen',                max: 10, excludeWithdrawal: true  },
    inhalant:             { name: 'Inhalant',                          max: 10, excludeWithdrawal: true  },
    opioid:               { name: 'Opioid',                            max: 11, excludeWithdrawal: false },
    sedative:             { name: 'Sedative, Hypnotic, or Anxiolytic', max: 11, excludeWithdrawal: false },
    stimulant:            { name: 'Stimulant',                         max: 11, excludeWithdrawal: false },
    tobacco:              { name: 'Tobacco',                           max: 11, excludeWithdrawal: false },
    other:                { name: 'Other (or Unknown)',                max: 11, excludeWithdrawal: false }
  };

  var criteriaShort = [
    'Used in larger amounts/longer than intended',
    'Persistent desire or unsuccessful efforts to cut down',
    'Great deal of time obtaining/using/recovering',
    'Craving',
    'Role failure at work, school, or home',
    'Continued use despite social/interpersonal problems',
    'Important activities given up or reduced',
    'Recurrent use in physically hazardous situations',
    'Continued use despite physical or psychological problem',
    'Tolerance',
    'Withdrawal'
  ];

  var criteriaText = [
    'Substance is often taken in larger amounts or over a longer period than was intended.',
    'Persistent desire or unsuccessful efforts to cut down or control substance use.',
    'A great deal of time is spent in activities necessary to obtain, use, or recover from the substance.',
    'Craving, or a strong desire or urge to use the substance.',
    'Recurrent substance use resulting in a failure to fulfill major role obligations at work, school, or home.',
    'Continued substance use despite persistent or recurrent social or interpersonal problems caused or exacerbated by use.',
    'Important social, occupational, or recreational activities are given up or reduced because of use.',
    'Recurrent substance use in situations in which it is physically hazardous.',
    'Use continues despite knowledge of a persistent or recurrent physical or psychological problem likely caused or exacerbated by the substance.',
    'Tolerance (markedly increased amounts needed for effect, or markedly diminished effect at the same amount).',
    'Withdrawal (characteristic withdrawal syndrome, or substance (or a closely related one) taken to relieve or avoid withdrawal).'
  ];

  var examples = {
    alcohol: [
      "Planned 2 drinks, had 8; blackouts; drank past intended stopping point.",
      "Failed 'Dry January'; rules like 'only weekends' or 'only wine' break down.",
      "Hungover recovery days lost; driving time for liquor runs; hours drinking most days.",
      "Strong urges at 5 p.m., after work, at social events; preoccupation with next drink.",
      "Missed work from hangovers; declining job or school performance; childcare impact.",
      "Recurrent arguments with partner about drinking; fights while intoxicated.",
      "Gave up exercise, hobbies, non-drinking friends, or family events to drink.",
      "DUI/DWI; drinking and driving; drinking while operating machinery.",
      "Continues despite elevated LFTs, HTN, depression, pancreatitis, or insomnia.",
      "Needs more drinks for same effect; 'holds liquor well'; minimal effect at high volume.",
      "Tremor, sweating, nausea, anxiety, insomnia, seizures on cessation; 'eye-opener' drink."
    ],
    cannabis: [
      "Intended one hit or edible, used all day; higher-potency products (concentrates, dabs).",
      "Failed quit attempts (drug test, pregnancy, job); unsuccessful T-breaks.",
      "Smokes/vapes throughout the day; day structured around getting high.",
      "Urges in evening or after stressors; preoccupation with next use.",
      "Late or absent at work/school; declining grades; amotivational pattern.",
      "Partner or parents upset about use; fights about smell, money, behavior while high.",
      "Dropped sports, hobbies, or non-using friends; social life centered on using.",
      "Driving while high; operating heavy equipment; using at work when prohibited.",
      "Continues despite cannabis hyperemesis, anxiety, paranoia, psychotic symptoms, or cognitive concerns.",
      "Needs higher-THC product or much larger amounts to feel the same effect.",
      "Irritability, anxiety, insomnia, decreased appetite, restlessness within ~1 week of cessation."
    ],
    phencyclidine: [
      "Larger doses than planned; binge use over days.",
      "Repeated unsuccessful attempts to cut down or stop.",
      "Significant time obtaining, using, and recovering from effects.",
      "Intense urges or cravings to use PCP.",
      "Role failures at work, school, or home due to intoxication or after-effects.",
      "Interpersonal conflicts or violence related to use.",
      "Gave up prior activities and interests to use.",
      "Use in hazardous situations (driving, heights, aggression, unprotected risk).",
      "Continues despite flashbacks, psychosis, legal or medical consequences.",
      "Needs more to achieve effect; diminished effect at same dose."
    ],
    'other-hallucinogen': [
      "Higher dose or longer trip than intended; stacked or redose.",
      "Unsuccessful attempts to stop or moderate use.",
      "Time obtaining, using, and recovering (including HPPD aftermath).",
      "Cravings or urges to use again.",
      "Role failures due to use or post-trip impairment.",
      "Social/interpersonal conflicts about use.",
      "Gave up prior interests for use-centered life.",
      "Unsafe settings; tripping alone without a sitter; driving while impaired.",
      "Continues despite HPPD, prolonged psychotic symptoms, trauma/bad trips, or serotonergic effects (MDMA).",
      "Rapid tolerance (especially LSD, psilocybin); needs larger dose."
    ],
    inhalant: [
      "Extended huffing sessions; more cans/bags than intended.",
      "Repeated failed attempts to stop.",
      "Significant time obtaining supplies, huffing, and recovering.",
      "Cravings or urges to inhale.",
      "Missed work/school; declining performance.",
      "Family or social conflict over odor, supplies, or behavior; hiding materials.",
      "Dropped normal activities for inhalant use.",
      "Huffing while driving, at heights, in poorly ventilated spaces, near ignition sources.",
      "Continues despite cognitive decline, peripheral neuropathy, renal/hepatic toxicity, cardiac effects.",
      "Needs more or stronger solvent to achieve effect."
    ],
    opioid: [
      "Uses more than prescribed; runs out early; escalating use of heroin or fentanyl.",
      "Repeated failed tapers; 'one last time' attempts; unable to stop despite desire.",
      "Doctor/ER shopping; time seeking supply; nodding off; recovery from use.",
      "Intense cravings and drug dreams; cues trigger urges.",
      "Missed work/school due to nodding, using, or withdrawal.",
      "Family/relationship conflicts about use; lost custody or relationships.",
      "Dropped hobbies, sports, non-using friends; time centered on use.",
      "Driving impaired; using alone without naloxone; IV use / shared needles; combining with benzos or alcohol.",
      "Continues despite overdose(s), HCV/HIV risk, constipation, hypogonadism, falls, or infections.",
      "Marked dose escalation for same effect (note: tolerance during legitimately prescribed treatment alone does not count).",
      "Rhinorrhea, lacrimation, yawning, piloerection, myalgia, diarrhea, dysphoria, mydriasis, insomnia on cessation."
    ],
    sedative: [
      "Takes more than prescribed; escalating dose; extended use past intended duration.",
      "Failed taper attempts; 'can't sleep without it'; unsuccessful efforts to cut down.",
      "Doctor shopping; time securing supply; recovery from oversedation.",
      "Urges especially during anxiety, insomnia, or stress.",
      "Daytime sedation impairs work/school; memory or cognitive impact.",
      "Family concerned about sedation, personality or cognitive changes.",
      "Isolating; stopped hobbies due to sedation or prioritizing use.",
      "Driving while sedated; combining with alcohol or opioids (overdose risk); falls.",
      "Continues despite falls, cognitive decline, paradoxical disinhibition, or respiratory depression.",
      "Same mg no longer produces effect (note: tolerance during legitimately prescribed treatment alone does not count).",
      "Anxiety, insomnia, tremor, autonomic hyperactivity, perceptual disturbance, or seizures on cessation."
    ],
    stimulant: [
      "Binges lasting days; 'just one more line/hit'; far more than intended.",
      "Repeated unsuccessful attempts to stop or limit use.",
      "Time seeking, using, and crashing/recovering (hypersomnia, dysphoria).",
      "Intense urges, especially when tired, stressed, or around cues.",
      "Missed work during binges and crashes; declining performance.",
      "Conflicts about money, paranoia/jealousy, or behavioral change.",
      "Dropped normal activities for stimulant-centered life.",
      "IV use; smoking; driving high; risky sexual behavior; combining with opioids.",
      "Continues despite weight loss, psychosis, dental problems (meth mouth), cardiac events, skin lesions.",
      "Needs higher doses for euphoria; diminished effect at same amount.",
      "Dysphoria, fatigue, hypersomnia/insomnia, increased appetite, vivid unpleasant dreams ('crash')."
    ],
    tobacco: [
      "Smokes/vapes more than intended; switches to higher-nicotine products; chain use.",
      "Multiple failed quit attempts; NRT / varenicline failures; 'just one' becomes a pack.",
      "Frequent smoke breaks; day scheduled around smoking opportunities.",
      "Strong urges at cues: coffee, after meals, with alcohol, stress, social use.",
      "Smoke breaks interfere with work; missed activities due to need to smoke.",
      "Family conflict about smoking, smoke exposure, or health risks to others.",
      "Avoids smoke-free events; isolates to smoke.",
      "Smoking in bed; smoking near home oxygen; distracted driving while vaping/smoking.",
      "Continues despite COPD, CAD, cancer diagnosis, pregnancy, or reactive airway disease.",
      "No longer feels nausea/dizziness of early use; needs more frequent or stronger nicotine.",
      "Irritability, anxiety, concentration difficulty, increased appetite, restlessness, dysphoria, insomnia, urges on cessation."
    ],
    other: [
      "Uses more or for longer than intended.",
      "Persistent desire or failed attempts to cut down.",
      "Considerable time spent obtaining, using, or recovering.",
      "Craving or strong urge to use.",
      "Role failures at work, school, or home.",
      "Continued use despite social or interpersonal problems.",
      "Important activities given up or reduced.",
      "Use in physically hazardous situations.",
      "Use continues despite known physical or psychological harm.",
      "Tolerance (if applicable to substance).",
      "Withdrawal (if a characteristic syndrome exists for the substance)."
    ]
  };

  // ===== State =====
  var currentKey = null;
  var currentCfg = null;
  var count = 0;

  // ===== Init =====
  var dateDisplay = document.getElementById('sud-date-display');
  if (dateDisplay) dateDisplay.textContent = ToolUtils.dateStamp();

  // ===== Substance change =====
  function updateSubstance() {
    var sel = document.getElementById('sud-substance');
    var key = sel.value;
    currentKey = key;
    currentCfg = substances[key] || null;

    document.getElementById('sud-subopts').classList.toggle('sud-hidden', !key);
    document.getElementById('sud-specify-group').classList.toggle(
      'sud-hidden',
      ['other-hallucinogen', 'inhalant', 'other'].indexOf(key) === -1
    );
    document.getElementById('sud-stim-group').classList.toggle('sud-hidden', key !== 'stimulant');

    if (!currentCfg) {
      document.getElementById('sud-criteria-card').classList.add('sud-hidden');
      document.getElementById('sud-specifiers-card').classList.add('sud-hidden');
      document.getElementById('sud-notes-card').classList.add('sud-hidden');
      document.getElementById('sud-output').classList.add('sud-hidden');
      return;
    }

    document.getElementById('sud-criteria-card').classList.remove('sud-hidden');
    document.getElementById('sud-specifiers-card').classList.remove('sud-hidden');
    document.getElementById('sud-notes-card').classList.remove('sud-hidden');

    var ex = examples[key] || [];
    var list = document.getElementById('sud-criteria-list');
    list.innerHTML = '';

    criteriaText.forEach(function (text, i) {
      var isWithdrawal = i === 10;
      var disabled = currentCfg.excludeWithdrawal && isWithdrawal;

      var row = document.createElement('div');
      row.className = 'sud-criterion' + (disabled ? ' sud-disabled' : '');
      var exampleHtml = (!disabled && ex[i])
        ? '<div class="sud-examples"><strong>Examples for ' + escapeHtml(currentCfg.name) + ':</strong> ' + escapeHtml(ex[i]) + '</div>'
        : '';
      var naHtml = disabled
        ? '<div class="sud-na-tag">Not applicable &mdash; no characteristic withdrawal syndrome for ' + escapeHtml(currentCfg.name) + '</div>'
        : '';
      row.innerHTML =
        '<input type="checkbox" id="sud-crit-' + i + '"' + (disabled ? ' disabled' : '') + '>' +
        '<div class="sud-criterion-text">' +
          '<label for="sud-crit-' + i + '"><span class="sud-criterion-num">' + (i + 1) + '.</span> ' + escapeHtml(text) + '</label>' +
          exampleHtml +
          naHtml +
        '</div>';
      list.appendChild(row);

      var cb = row.querySelector('input[type="checkbox"]');
      if (cb) cb.addEventListener('change', calcSeverity);
    });

    var note = document.getElementById('sud-criteria-note');
    if (currentCfg.excludeWithdrawal) {
      note.innerHTML = '<strong>Note:</strong> For ' + escapeHtml(currentCfg.name) +
        ' use disorder, withdrawal (criterion 11) is not a DSM-5-TR criterion and is excluded from the total (max = 10).';
      note.classList.remove('sud-hidden');
    } else {
      note.classList.add('sud-hidden');
    }
    document.getElementById('sud-max').textContent = '/ ' + currentCfg.max;
    calcSeverity();
  }

  // ===== Severity =====
  function calcSeverity() {
    count = 0;
    for (var i = 0; i < 11; i++) {
      var cb = document.getElementById('sud-crit-' + i);
      if (cb && !cb.disabled && cb.checked) count++;
    }
    document.getElementById('sud-count').textContent = count;
    var el = document.getElementById('sud-severity');
    var label, cls;
    if (count >= 6)      { label = 'SEVERE';   cls = 'sud-sev-severe'; }
    else if (count >= 4) { label = 'MODERATE'; cls = 'sud-sev-mod';    }
    else if (count >= 2) { label = 'MILD';     cls = 'sud-sev-mild';   }
    else                 { label = 'NO SUD';   cls = 'sud-sev-none';   }
    el.innerHTML = '<span class="sud-severity-pill ' + cls + '">' + label + '</span>';
  }

  // ===== Substance display name =====
  function displaySubstance() {
    if (!currentCfg) return '';
    var specify = document.getElementById('sud-specify').value.trim();
    var stimType = document.getElementById('sud-stim-type').value;
    if (currentKey === 'stimulant') {
      if (stimType === 'amphetamine') return 'Amphetamine-type Stimulant';
      if (stimType === 'cocaine')     return 'Cocaine';
      if (stimType === 'other-stim')  return 'Other Stimulant';
      return 'Unspecified Stimulant';
    }
    var name = currentCfg.name;
    if (specify && ['other-hallucinogen', 'inhalant', 'other'].indexOf(currentKey) !== -1) {
      name += ' (' + specify + ')';
    }
    return name;
  }

  // ===== EMR text output =====
  function generate() {
    if (!currentCfg) { alert('Please select a substance.'); return; }

    var substanceDisplay = displaySubstance();
    var dateStr = document.getElementById('sud-date-display').textContent;

    var sev;
    if (count >= 6)      sev = 'severe';
    else if (count >= 4) sev = 'moderate';
    else if (count >= 2) sev = 'mild';
    else                 sev = null;

    var remEarly = document.getElementById('sud-rem-early').checked;
    var remSust  = document.getElementById('sud-rem-sustained').checked;
    var remissionTxt = 'Not in remission';
    var remissionDx = '';
    if (remEarly)     { remissionTxt = 'In early/recent remission'; remissionDx = ', in early/recent remission'; }
    else if (remSust) { remissionTxt = 'In sustained remission';    remissionDx = ', in sustained remission'; }

    var controlled = document.getElementById('sud-controlled').checked;
    var maint = document.getElementById('sud-maintenance').checked;
    var maintDetail = document.getElementById('sud-maintenance-detail').value.trim();
    var specifiers = [];
    if (controlled) specifiers.push('In a controlled environment');
    if (maint) specifiers.push('On maintenance therapy' + (maintDetail ? ' (' + maintDetail + ')' : ''));

    var endorsed = [];
    for (var i = 0; i < 11; i++) {
      var cb = document.getElementById('sud-crit-' + i);
      if (cb && !cb.disabled && cb.checked) {
        endorsed.push('  ' + (i + 1) + '. ' + criteriaShort[i]);
      }
    }

    var notes = document.getElementById('sud-notes').value.trim();

    var lines = [];
    lines.push('DSM-5-TR SUBSTANCE USE DISORDER ASSESSMENT');
    lines.push('Date: ' + dateStr);
    lines.push('');
    lines.push('Substance: ' + substanceDisplay);
    lines.push('');
    lines.push('Criteria met (past 12 months): ' + count + ' of ' + currentCfg.max);

    if (endorsed.length) {
      lines.push('');
      lines.push('Endorsed criteria:');
      endorsed.forEach(function (e) { lines.push(e); });
    }

    lines.push('');
    if (sev) {
      lines.push('Severity: ' + capitalize(sev));
    } else {
      lines.push('Severity: Does not meet threshold for SUD diagnosis (fewer than 2 criteria).');
    }
    lines.push('Remission: ' + remissionTxt);

    if (specifiers.length) {
      lines.push('');
      lines.push('Additional specifiers:');
      specifiers.forEach(function (s) { lines.push('  - ' + s); });
    }

    lines.push('');
    lines.push('Diagnostic impression:');
    if (sev) {
      var dx = substanceDisplay + ' Use Disorder, ' + sev + remissionDx;
      if (specifiers.length) dx += '; ' + specifiers.join('; ').toLowerCase();
      dx += '.';
      lines.push('  ' + dx);
    } else {
      lines.push('  Does not meet DSM-5-TR criteria for ' + substanceDisplay + ' Use Disorder at this time.');
    }

    if (notes) {
      lines.push('');
      lines.push('Supporting notes:');
      notes.split(/\r?\n/).forEach(function (line) { lines.push('  ' + line); });
    }

    lines.push('');
    lines.push('Assigned ICD-10-CM code: _________');
    lines.push('(Select per current coding guide based on substance, severity, remission, and specifiers.)');

    var text = lines.join('\n');
    document.getElementById('sud-output-text').textContent = text;
    document.getElementById('sud-output').classList.remove('sud-hidden');
    document.getElementById('sud-output').scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Auto-copy on generate, with button feedback
    var btn = document.getElementById('sud-generate-btn');
    ToolUtils.copyWithButton(text, btn);
  }

  function copy() {
    var text = document.getElementById('sud-output-text').textContent;
    var status = document.getElementById('sud-copy-status');
    navigator.clipboard.writeText(text).then(function () {
      status.classList.add('visible');
      setTimeout(function () { status.classList.remove('visible'); }, 1800);
    });
  }

  function reset() {
    ToolUtils.confirmReset('Reset all fields and start over?', function () {
      document.getElementById('sud-substance').value = '';
      document.querySelectorAll('#sud-tool input[type=checkbox]').forEach(function (cb) { cb.checked = false; });
      document.getElementById('sud-specify').value = '';
      document.getElementById('sud-maintenance-detail').value = '';
      document.getElementById('sud-notes').value = '';
      updateSubstance();
      document.getElementById('sud-output').classList.add('sud-hidden');
      document.getElementById('content').scrollTop = 0;
    });
  }

  // ===== Helpers =====
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  // ===== Wire up =====
  document.getElementById('sud-substance').addEventListener('change', updateSubstance);
  document.getElementById('sud-generate-btn').addEventListener('click', generate);
  document.getElementById('sud-copy-btn').addEventListener('click', copy);
  document.getElementById('sud-reset-btn').addEventListener('click', reset);
})();

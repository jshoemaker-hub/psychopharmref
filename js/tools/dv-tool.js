(function() {
  /* ── DV / IPV Assessment ───────────────────────────────────────────
     Part A: HITS screen (Hurt, Insult, Threaten, Scream) — 4 items,
             each scored 1–5, total 4–20. Positive screen ≥ 11.
     Part B: Lethality / danger review — evidence-based risk markers from
             the femicide / Danger Assessment literature, scored Yes/No.
             Sentinel high-risk markers are flagged separately. This is a
             structured clinical review, NOT a validated composite score.
     ─────────────────────────────────────────────────────────────────── */

  const HITS_ITEMS = [
    { id: 1, text: 'Physically hurt you', letter: 'H' },
    { id: 2, text: 'Insult or talk down to you', letter: 'I' },
    { id: 3, text: 'Threaten you with harm', letter: 'T' },
    { id: 4, text: 'Scream or curse at you', letter: 'S' }
  ];

  const HITS_OPTIONS = [
    { value: 1, label: '1 – Never' },
    { value: 2, label: '2 – Rarely' },
    { value: 3, label: '3 – Sometimes' },
    { value: 4, label: '4 – Fairly often' },
    { value: 5, label: '5 – Frequently' }
  ];

  // Sentinel markers most strongly associated with intimate partner homicide.
  const HIGH_RISK = [
    { id: 'gun',        text: 'Partner has access to a firearm', hint: 'Strongest single predictor of intimate partner homicide.' },
    { id: 'strangle',   text: 'Prior strangulation ("choking")', hint: 'Associated with ~7-fold increased odds of later attempted/completed homicide; also a medical emergency.' },
    { id: 'threatkill', text: 'Threats to kill the patient, children, or self', hint: 'Explicit lethal threats.' },
    { id: 'believekill',text: 'Patient believes the partner is capable of killing them', hint: "The survivor's own risk appraisal is an independent predictor." }
  ];

  const RISK_FACTORS = [
    { id: 'escalate',  text: 'Violence has increased in frequency or severity over the past year' },
    { id: 'separate',  text: 'Recent separation or attempt to leave (or plan to leave)' },
    { id: 'stalk',     text: 'Stalking, surveillance, or extreme jealousy / controlling behavior' },
    { id: 'forcedsex', text: 'Forced or coerced sex' },
    { id: 'pregnancy', text: 'Violence during pregnancy' },
    { id: 'children',  text: 'Threats or violence toward children' },
    { id: 'substance', text: 'Partner problem substance use' },
    { id: 'suicidal',  text: 'Partner suicidal or has threatened suicide' },
    { id: 'weaponuse', text: 'Prior use of, or threat with, a weapon' }
  ];

  /* ── DOM references ─────────────────────────────────────────────────── */
  const hitsContainer  = document.getElementById('dv-hits-container');
  const hrContainer    = document.getElementById('dv-highrisk-container');
  const rfContainer    = document.getElementById('dv-risk-container');
  const hitsNumEl      = document.getElementById('dv-hits-num');
  const hitsSevEl      = document.getElementById('dv-hits-sev');
  const dangerNumEl    = document.getElementById('dv-danger-num');
  const dangerSevEl    = document.getElementById('dv-danger-sev');
  const alertEl        = document.getElementById('dv-alert');
  const relInput       = document.getElementById('dv-relationship');
  const noteInput      = document.getElementById('dv-note');
  const reportBtn      = document.getElementById('dv-report-btn');
  const resetBtn       = document.getElementById('dv-reset-btn');

  /* ── Render ─────────────────────────────────────────────────────────── */
  function hitsRadios(itemId) {
    return HITS_OPTIONS.map(function(o) {
      return '<label class="dv-radio-label">' +
        '<input type="radio" name="dv-hits-' + itemId + '" value="' + o.value + '">' +
        '<span class="dv-radio-text">' + o.label + '</span></label>';
    }).join('');
  }

  function ynToggle(namePrefix, itemId) {
    return '<div class="dv-yn">' +
      '<label><input type="radio" name="' + namePrefix + itemId + '" value="0"><span class="dv-yn-btn">No</span></label>' +
      '<label><input type="radio" name="' + namePrefix + itemId + '" value="1"><span class="dv-yn-btn">Yes</span></label>' +
      '</div>';
  }

  function renderHits() {
    var html = '';
    HITS_ITEMS.forEach(function(item) {
      html += '<div class="dv-item-group"><div class="dv-item-row">' +
        '<span class="dv-item-num">' + item.letter + '</span>' +
        '<div class="dv-item-body"><div class="dv-item-text">' + item.text + '</div>' +
        '<div class="dv-item-hint">How often, in the last 12 months?</div></div>' +
        '<div class="dv-radios">' + hitsRadios(item.id) + '</div>' +
      '</div></div>';
    });
    hitsContainer.innerHTML = html;
  }

  function renderDanger(container, list, namePrefix, flagged) {
    var html = '';
    list.forEach(function(item, i) {
      var badge = flagged ? '<span class="dv-flag-badge">High-risk marker</span>' : '';
      var hint = item.hint ? '<div class="dv-item-hint">' + item.hint + '</div>' : '';
      html += '<div class="dv-item-group"><div class="dv-item-row">' +
        '<span class="dv-item-num">' + (i + 1) + '.</span>' +
        '<div class="dv-item-body"><div class="dv-item-text">' + item.text + badge + '</div>' + hint + '</div>' +
        ynToggle(namePrefix, item.id) +
      '</div></div>';
    });
    container.innerHTML = html;
  }

  /* ── Scoring ────────────────────────────────────────────────────────── */
  function hitsScore() {
    var sum = 0, answered = 0;
    HITS_ITEMS.forEach(function(item) {
      var sel = document.querySelector('input[name="dv-hits-' + item.id + '"]:checked');
      if (sel) { sum += parseInt(sel.value, 10); answered++; }
    });
    return { sum: sum, answered: answered };
  }

  function ynCount(list, namePrefix) {
    var yes = 0, answered = 0, yesItems = [];
    list.forEach(function(item) {
      var sel = document.querySelector('input[name="' + namePrefix + item.id + '"]:checked');
      if (sel) {
        answered++;
        if (sel.value === '1') { yes++; yesItems.push(item); }
      }
    });
    return { yes: yes, answered: answered, yesItems: yesItems };
  }

  function update() {
    var h = hitsScore();
    hitsNumEl.textContent = h.sum + ' / 20';
    if (h.answered < HITS_ITEMS.length) {
      hitsSevEl.textContent = h.answered + ' / 4 answered';
      hitsSevEl.className = 'dv-severity dv-sev-neg';
    } else if (h.sum >= 11) {
      hitsSevEl.textContent = 'Positive screen (≥ 11)';
      hitsSevEl.className = 'dv-severity dv-sev-pos';
    } else {
      hitsSevEl.textContent = 'Below screening threshold';
      hitsSevEl.className = 'dv-severity dv-sev-neg';
    }

    var hr = ynCount(HIGH_RISK, 'dv-hr-');
    var rf = ynCount(RISK_FACTORS, 'dv-rf-');
    var totalYes = hr.yes + rf.yes;
    dangerNumEl.textContent = totalYes;

    if (hr.yes > 0) {
      dangerSevEl.textContent = 'High-risk marker present';
      dangerSevEl.className = 'dv-severity dv-sev-high';
    } else if (totalYes >= 3) {
      dangerSevEl.textContent = 'Multiple risk factors';
      dangerSevEl.className = 'dv-severity dv-sev-elev';
    } else if (totalYes >= 1) {
      dangerSevEl.textContent = 'Some risk factors';
      dangerSevEl.className = 'dv-severity dv-sev-elev';
    } else {
      dangerSevEl.textContent = 'None endorsed';
      dangerSevEl.className = 'dv-severity dv-sev-low';
    }

    if (hr.yes > 0) {
      alertEl.classList.add('dv-visible');
      alertEl.innerHTML = '<strong>High-risk lethality marker(s) endorsed.</strong> Prioritize urgent, private safety planning with a domestic violence advocate, offer the National DV Hotline (1-800-799-7233), and address any medical needs (e.g., strangulation evaluation). Remember that separation is the highest-risk period. Document objectively and consider your jurisdiction’s mandatory-reporting duties.';
    } else {
      alertEl.classList.remove('dv-visible');
      alertEl.innerHTML = '';
    }
  }

  /* ── Report ─────────────────────────────────────────────────────────── */
  function labelForHits(val) {
    for (var i = 0; i < HITS_OPTIONS.length; i++) {
      if (HITS_OPTIONS[i].value === val) return HITS_OPTIONS[i].label;
    }
    return '—';
  }

  function generateReport() {
    var dateStr = (typeof ToolUtils !== 'undefined') ? ToolUtils.dateStamp()
      : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    var h = hitsScore();
    var hr = ynCount(HIGH_RISK, 'dv-hr-');
    var rf = ynCount(RISK_FACTORS, 'dv-rf-');
    var rel = (relInput && relInput.value) ? relInput.value : 'Not specified';

    var lines = [
      'DV / IPV ASSESSMENT',
      'Date: ' + dateStr,
      'Relationship: ' + rel,
      '',
      'HITS SCREEN (Hurt, Insult, Threaten, Scream): ' + h.sum + ' / 20',
      '  Interpretation: ' + (h.answered < 4 ? 'Incomplete (' + h.answered + '/4 answered)' : (h.sum >= 11 ? 'POSITIVE screen (>= 11)' : 'Below screening threshold (< 11)')),
      '  Item responses:'
    ];
    HITS_ITEMS.forEach(function(item) {
      var sel = document.querySelector('input[name="dv-hits-' + item.id + '"]:checked');
      var val = sel ? parseInt(sel.value, 10) : null;
      lines.push('    ' + item.letter + '. ' + item.text + ': ' + (val ? labelForHits(val) : 'not answered'));
    });

    lines.push('');
    lines.push('LETHALITY / DANGER REVIEW (structured clinical review, not a validated score)');
    lines.push('  High-risk markers endorsed: ' + hr.yes + ' / ' + HIGH_RISK.length);
    HIGH_RISK.forEach(function(item) {
      var sel = document.querySelector('input[name="dv-hr-' + item.id + '"]:checked');
      var ans = sel ? (sel.value === '1' ? 'YES' : 'No') : 'not answered';
      lines.push('    [' + (sel && sel.value === '1' ? 'X' : ' ') + '] ' + item.text + ' — ' + ans);
    });
    lines.push('  Additional risk factors endorsed: ' + rf.yes + ' / ' + RISK_FACTORS.length);
    RISK_FACTORS.forEach(function(item) {
      var sel = document.querySelector('input[name="dv-rf-' + item.id + '"]:checked');
      var ans = sel ? (sel.value === '1' ? 'YES' : 'No') : 'not answered';
      lines.push('    [' + (sel && sel.value === '1' ? 'X' : ' ') + '] ' + item.text + ' — ' + ans);
    });

    lines.push('');
    lines.push('SUMMARY:');
    if (hr.yes > 0) {
      lines.push('  One or more high-risk lethality markers endorsed (' +
        hr.yesItems.map(function(i){return i.text;}).join('; ') + ').');
      lines.push('  Recommend urgent safety planning with a DV advocate; separation is the highest-risk period.');
    } else if ((hr.yes + rf.yes) === 0) {
      lines.push('  No danger-review items endorsed at this time.');
    } else {
      lines.push('  ' + (hr.yes + rf.yes) + ' risk factor(s) endorsed; individualized safety planning indicated.');
    }

    if (noteInput && noteInput.value.trim()) {
      lines.push('');
      lines.push('CLINICIAN NOTE:');
      lines.push('  ' + noteInput.value.trim());
    }

    lines.push('');
    lines.push('DISPOSITION / RESOURCES OFFERED:');
    lines.push('  National DV Hotline 1-800-799-7233 (SAFE) | Text START to 88788 | thehotline.org');
    lines.push('');
    lines.push('HITS: score range 4–20; a score >= 11 is a positive screen (Sherin et al., 1998). A screen is not a diagnosis.');
    lines.push('Lethality review adapted from femicide risk literature (Campbell Danger Assessment; Glass on strangulation). It supports, and does not replace, clinical judgment or a specialist danger assessment.');
    lines.push('Screening/asking in the presence of the partner can escalate danger. Verify what is safe to document and to release.');

    return lines.join('\n');
  }

  /* ── Reset ──────────────────────────────────────────────────────────── */
  function resetForm() {
    document.querySelectorAll('input[type="radio"][name^="dv-hits-"]').forEach(function(r){ r.checked = false; });
    document.querySelectorAll('input[type="radio"][name^="dv-hr-"]').forEach(function(r){ r.checked = false; });
    document.querySelectorAll('input[type="radio"][name^="dv-rf-"]').forEach(function(r){ r.checked = false; });
    if (relInput) relInput.value = '';
    if (noteInput) noteInput.value = '';
    update();
  }

  /* ── Wire up ────────────────────────────────────────────────────────── */
  renderHits();
  renderDanger(hrContainer, HIGH_RISK, 'dv-hr-', true);
  renderDanger(rfContainer, RISK_FACTORS, 'dv-rf-', false);

  hitsContainer.addEventListener('change', update);
  hrContainer.addEventListener('change', update);
  rfContainer.addEventListener('change', update);

  reportBtn.addEventListener('click', function() {
    if (typeof ToolUtils !== 'undefined') {
      ToolUtils.copyWithButton(generateReport(), reportBtn);
    } else {
      navigator.clipboard.writeText(generateReport()).then(function() {
        var orig = reportBtn.textContent;
        reportBtn.textContent = 'Copied!';
        setTimeout(function() { reportBtn.textContent = orig; }, 2000);
      });
    }
  });

  resetBtn.addEventListener('click', function() {
    if (typeof ToolUtils !== 'undefined') {
      ToolUtils.confirmReset('Reset the DV / IPV assessment?', resetForm);
    } else if (confirm('Reset the DV / IPV assessment?')) {
      resetForm();
    }
  });

  update();
})();

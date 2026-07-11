(function() {
  /* ── SMI-FRAIL-20 Configuration ────────────────────────────────────── */

  const SMI_DOMAINS = [
    {
      key: 'symptomSafety',
      label: 'Symptom Acuity & Safety',
      cardClass: 'fr-score-card--d1',
      items: [
        { id: 1, domain: 'Psychiatric symptom acuity', desc: 'Severity of active psychotic, mood, or anxiety symptoms in the past 30 days (e.g., persistent hallucinations, psychomotor retardation, incapacitating panic).' },
        { id: 7, domain: 'Suicidality / self-harm risk', desc: 'Recency and severity of suicidal ideation, intent, plan, or self-injurious behavior.' },
        { id: 8, domain: 'Insight and judgment', desc: 'Degree of impaired illness awareness or unsafe decision-making relevant to navigating reporting/compliance systems.' },
        { id: 15, domain: 'Sleep-wake / behavioral regulation', desc: 'Disruption significant enough to impair reliability or attendance at scheduled activities.' },
        { id: 18, domain: 'Response to structured demands', desc: 'History of decompensation under schedule pressure, deadlines, or unfamiliar structured environments.' }
      ]
    },
    {
      key: 'functionalCapacity',
      label: 'Functional Capacity',
      cardClass: 'fr-score-card--d2',
      items: [
        { id: 2, domain: 'Cognitive / executive functioning', desc: 'Impairment in attention, working memory, planning, or task sequencing (e.g., cannot follow multi-step instructions without reminders).' },
        { id: 3, domain: 'Activities of daily living (ADLs)', desc: 'Capacity for hygiene, dressing, feeding, and toileting without prompting or hands-on assistance.' },
        { id: 4, domain: 'Instrumental ADLs (IADLs)', desc: 'Capacity to independently manage finances, transportation, scheduling, or medication administration.' },
        { id: 14, domain: 'Bureaucratic navigation capacity', desc: 'Ability to independently complete forms, respond to state correspondence, or use reporting portals.' },
        { id: 20, domain: 'Capacity to sustain 80 hrs/month structured activity', desc: "Clinician's overall judgment of the patient's current ability to reliably sustain qualifying work, training, or community engagement activities." }
      ]
    },
    {
      key: 'careUtilization',
      label: 'Care Utilization & Treatment',
      cardClass: 'fr-score-card--d3',
      items: [
        { id: 5, domain: 'Psychiatric hospitalizations (12 mo)', desc: 'Number and acuity of inpatient psychiatric admissions in the past 12 months.' },
        { id: 6, domain: 'Crisis / ED utilization (12 mo)', desc: 'ED visits, mobile crisis contacts, or crisis stabilization admissions for psychiatric decompensation.' },
        { id: 9, domain: 'Treatment adherence capacity', desc: 'Inability (distinct from unwillingness) to consistently attend appointments or take medication as prescribed.' },
        { id: 16, domain: 'Medication side-effect burden', desc: 'Sedation, extrapyramidal symptoms, metabolic effects, or cognitive slowing limiting sustained activity.' },
        { id: 19, domain: 'Treatment engagement pattern', desc: 'Consistency of outpatient visit attendance over the past 6–12 months.' }
      ]
    },
    {
      key: 'supportSystemic',
      label: 'Support & Systemic Factors',
      cardClass: 'fr-score-card--d4',
      items: [
        { id: 10, domain: 'Global social / occupational functioning', desc: 'Overall functional level in social and vocational domains (clinician global impression).' },
        { id: 11, domain: 'Housing stability', desc: 'Homelessness, housing instability, or need for supervised/supported housing attributable to psychiatric illness.' },
        { id: 12, domain: 'Caregiver / support dependency', desc: 'Degree of reliance on family, case management, or residential staff for basic functioning.' },
        { id: 13, domain: 'Interacting physical comorbidity', desc: 'Medical conditions (e.g., cardiometabolic, neurological) that compound psychiatric functional limitation.' },
        { id: 17, domain: 'Disability / legal determination history', desc: 'Existing SSI/SSDI disability determination, guardianship, or conservatorship related to psychiatric illness.' }
      ]
    }
  ];

  const SUD_ITEMS = [
    { id: 1, domain: 'Withdrawal risk / medical severity', desc: 'Risk of medically significant withdrawal (e.g., alcohol, benzodiazepine, opioid) based on use pattern and history.' },
    { id: 2, domain: 'Overdose history (12 mo)', desc: 'Number and severity of overdose events, including naloxone administrations.' },
    { id: 3, domain: 'Substance-related medical complications', desc: 'Active complications (e.g., IV-use-related infections, hepatic/renal impairment, cardiac effects).' },
    { id: 4, domain: 'Substance-attributable cognitive impairment', desc: 'Cognitive deficits attributable to use (e.g., alcohol-related neurocognitive disorder, chronic intoxication).' },
    { id: 5, domain: 'Functional impact on ADLs/IADLs', desc: 'Impairment in self-care or independent living directly attributable to active use, beyond the SMI domains above.' },
    { id: 6, domain: 'SUD treatment engagement / retention', desc: 'Current or recent engagement in SUD treatment. Note: the CMS SUD frailty category applies regardless of active treatment enrollment.' },
    { id: 7, domain: 'Housing / legal instability from use', desc: 'Housing loss, incarceration risk, or legal involvement driven by substance use.' },
    { id: 8, domain: 'Duration of remission / recovery', desc: '0 = ≥ 5 years sustained remission (CMS excludes this group from the SUD frailty category); 1 = 1–5 years remission; 2 = < 1 year / early recovery; 3 = active use.' }
  ];

  const ANCHORS = [
    { value: 0, label: '0 – Not present' },
    { value: 1, label: '1 – Mild' },
    { value: 2, label: '2 – Moderate' },
    { value: 3, label: '3 – Severe' }
  ];

  /* ── DOM References ────────────────────────────────────────────────── */
  const smiContainer   = document.getElementById('fr-form-container');
  const sudContainer    = document.getElementById('fr-sud-container');
  const sudCheckbox     = document.getElementById('fr-sud-enable');
  const sudScoreCard    = document.getElementById('fr-sud-score-card');
  const totalNumEl      = document.getElementById('fr-total-num');
  const totalMaxEl      = document.getElementById('fr-total-max');
  const severityEl      = document.getElementById('fr-severity');
  const d1NumEl         = document.getElementById('fr-d1-num');
  const d2NumEl         = document.getElementById('fr-d2-num');
  const d3NumEl         = document.getElementById('fr-d3-num');
  const d4NumEl         = document.getElementById('fr-d4-num');
  const sudNumEl        = document.getElementById('fr-sud-num');
  const reportBtn       = document.getElementById('fr-report-btn');
  const resetBtn        = document.getElementById('fr-reset-btn');
  const section          = document.getElementById('frailty-tool');

  /* ── Render Form ───────────────────────────────────────────────────── */
  function radiosHtml(namePrefix, itemId) {
    return ANCHORS.map(a => `
      <label class="fr-radio-label">
        <input type="radio" name="${namePrefix}${itemId}" value="${a.value}">
        <span class="fr-radio-text">${a.label}</span>
      </label>
    `).join('');
  }

  function renderSmiForm() {
    let html = '';
    SMI_DOMAINS.forEach(domain => {
      html += `<div class="fr-domain">`;
      html += `<div class="fr-domain-header">
        ${domain.label}
        <span class="fr-domain-count">${domain.items.length} items</span>
      </div>`;
      html += `<div class="fr-column-headers">
        <span class="fr-column-spacer"></span>
        <span class="fr-column-text-spacer"></span>
        <div class="fr-column-labels">
          ${ANCHORS.map(a => `<span class="fr-column-label">${a.label}</span>`).join('')}
        </div>
      </div>`;
      domain.items.forEach(item => {
        html += `<div class="fr-item-group">
          <div class="fr-item-row">
            <span class="fr-item-num">${item.id}.</span>
            <div class="fr-item-body">
              <div class="fr-item-domain">${item.domain}</div>
              <div class="fr-item-desc">${item.desc}</div>
            </div>
            <div class="fr-radios">${radiosHtml('fr-smi-', item.id)}</div>
          </div>
        </div>`;
      });
      html += `</div>`;
    });
    smiContainer.innerHTML = html;
  }

  function renderSudForm() {
    let html = `<div class="fr-domain">`;
    html += `<div class="fr-domain-header fr-domain-header--sud">
      Substance Use Disorder Add-On Module
      <span class="fr-domain-count">${SUD_ITEMS.length} items</span>
    </div>`;
    html += `<div class="fr-column-headers">
      <span class="fr-column-spacer"></span>
      <span class="fr-column-text-spacer"></span>
      <div class="fr-column-labels">
        ${ANCHORS.map(a => `<span class="fr-column-label">${a.label}</span>`).join('')}
      </div>
    </div>`;
    SUD_ITEMS.forEach(item => {
      html += `<div class="fr-item-group">
        <div class="fr-item-row">
          <span class="fr-item-num">${item.id}.</span>
          <div class="fr-item-body">
            <div class="fr-item-domain">${item.domain}</div>
            <div class="fr-item-desc">${item.desc}</div>
          </div>
          <div class="fr-radios">${radiosHtml('fr-sud-', item.id)}</div>
        </div>
      </div>`;
    });
    html += `</div>`;
    sudContainer.innerHTML = html;
  }

  /* ── Scoring ───────────────────────────────────────────────────────── */
  function getDomainScore(namePrefix, items) {
    let sum = 0, count = 0;
    items.forEach(item => {
      const sel = document.querySelector(`input[name="${namePrefix}${item.id}"]:checked`);
      if (sel) { sum += parseInt(sel.value, 10); count++; }
    });
    return { sum, count };
  }

  function getSeverity(total) {
    if (total <= 10) return { label: 'Minimal impairment', cls: 'fr-severity-minimal' };
    if (total <= 25) return { label: 'Mild-to-moderate impairment', cls: 'fr-severity-mild' };
    if (total <= 40) return { label: 'Moderate-to-severe impairment', cls: 'fr-severity-moderate' };
    return { label: 'Severe impairment', cls: 'fr-severity-severe' };
  }

  function sudActive() {
    return sudCheckbox && sudCheckbox.checked;
  }

  function updateScores() {
    const d1 = getDomainScore('fr-smi-', SMI_DOMAINS[0].items);
    const d2 = getDomainScore('fr-smi-', SMI_DOMAINS[1].items);
    const d3 = getDomainScore('fr-smi-', SMI_DOMAINS[2].items);
    const d4 = getDomainScore('fr-smi-', SMI_DOMAINS[3].items);

    const total = d1.sum + d2.sum + d3.sum + d4.sum;
    const answered = d1.count + d2.count + d3.count + d4.count;
    const severity = getSeverity(total);

    totalNumEl.textContent = total;
    totalMaxEl.textContent = `/ 60  (${answered}/20 answered)`;
    severityEl.textContent = severity.label;
    severityEl.className = `fr-severity ${severity.cls}`;

    d1NumEl.textContent = `${d1.sum} / 15`;
    d2NumEl.textContent = `${d2.sum} / 15`;
    d3NumEl.textContent = `${d3.sum} / 15`;
    d4NumEl.textContent = `${d4.sum} / 15`;

    if (sudActive()) {
      const sud = getDomainScore('fr-sud-', SUD_ITEMS);
      sudScoreCard.style.display = '';
      sudNumEl.textContent = `${sud.sum} / 24  (${sud.count}/8 answered)`;
    } else {
      sudScoreCard.style.display = 'none';
    }
  }

  /* ── SUD Toggle ────────────────────────────────────────────────────── */
  function toggleSud() {
    if (sudActive()) {
      sudContainer.classList.remove('fr-sud-hidden');
    } else {
      sudContainer.classList.add('fr-sud-hidden');
    }
    updateScores();
  }

  /* ── Report Generation ─────────────────────────────────────────────── */
  function sudInterpretation(sum) {
    if (sum <= 6) return 'Low frailty contribution from SUD alone; combine with SMI Frailty Score above.';
    if (sum <= 14) return 'Moderate contribution; supports frailty determination when combined with SMI domains.';
    return 'Severe contribution; substance-related impairment may independently support a frailty determination.';
  }

  function generateReport() {
    const dateStr = (typeof ToolUtils !== 'undefined') ? ToolUtils.dateStamp() : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const d1 = getDomainScore('fr-smi-', SMI_DOMAINS[0].items);
    const d2 = getDomainScore('fr-smi-', SMI_DOMAINS[1].items);
    const d3 = getDomainScore('fr-smi-', SMI_DOMAINS[2].items);
    const d4 = getDomainScore('fr-smi-', SMI_DOMAINS[3].items);
    const total = d1.sum + d2.sum + d3.sum + d4.sum;
    const severity = getSeverity(total);

    const lines = [
      'SMI-FRAIL-20 — Medical Frailty Documentation Tool',
      'Date: ' + dateStr,
      'Period reviewed: preceding 30–90 days',
      '',
      'SMI FRAILTY SCORE: ' + total + ' / 60  [' + severity.label + ']',
      '  Symptom Acuity & Safety:        ' + d1.sum + ' / 15',
      '  Functional Capacity:            ' + d2.sum + ' / 15',
      '  Care Utilization & Treatment:   ' + d3.sum + ' / 15',
      '  Support & Systemic Factors:     ' + d4.sum + ' / 15',
      '',
      'ITEM RESPONSES (0=Not present, 1=Mild, 2=Moderate, 3=Severe):'
    ];

    const allSmiItems = [].concat(...SMI_DOMAINS.map(d => d.items)).sort((a, b) => a.id - b.id);
    allSmiItems.forEach(item => {
      const sel = document.querySelector(`input[name="fr-smi-${item.id}"]:checked`);
      const val = sel ? sel.value : '—';
      lines.push('  ' + item.id + '. ' + item.domain + ': ' + val);
    });

    if (sudActive()) {
      const sud = getDomainScore('fr-sud-', SUD_ITEMS);
      lines.push('');
      lines.push('SUD ADD-ON MODULE SCORE: ' + sud.sum + ' / 24');
      lines.push('  ' + sudInterpretation(sud.sum));
      lines.push('');
      lines.push('SUD MODULE ITEM RESPONSES:');
      SUD_ITEMS.forEach(item => {
        const sel = document.querySelector(`input[name="fr-sud-${item.id}"]:checked`);
        const val = sel ? sel.value : '—';
        lines.push('  ' + item.id + '. ' + item.domain + ': ' + val);
      });
    }

    lines.push('');
    lines.push('SCORING: 0–10 Minimal | 11–25 Mild-to-moderate | 26–40 Moderate-to-severe | 41–60 Severe');
    lines.push('These bands are a clinical organizing framework, not a CMS-published cutoff. Pair the total score with item-level narrative documentation.');
    lines.push('');
    lines.push('Context: CMS interim final rule CMS-2454-IFC (June 2026) requires individualized documentation that a qualifying condition significantly impairs the patient’s ability to meet the 80-hour/month Medicaid community engagement requirement; diagnosis alone is not sufficient.');
    lines.push('This tool is an educational documentation aid, not a validated psychometric instrument or a CMS-endorsed form. It does not determine exemption eligibility.');

    return lines.join('\n');
  }

  /* ── Reset ─────────────────────────────────────────────────────────── */
  function resetForm() {
    document.querySelectorAll('input[name^="fr-smi-"]').forEach(r => { r.checked = false; });
    document.querySelectorAll('input[name^="fr-sud-"]').forEach(r => { r.checked = false; });
    if (sudCheckbox) sudCheckbox.checked = false;
    toggleSud();
    updateScores();
  }

  /* ── Event Handlers ────────────────────────────────────────────────── */
  smiContainer.addEventListener('change', updateScores);
  sudContainer.addEventListener('change', updateScores);
  if (sudCheckbox) sudCheckbox.addEventListener('change', toggleSud);

  reportBtn.addEventListener('click', function() {
    if (typeof ToolUtils !== 'undefined') {
      ToolUtils.copyWithButton(generateReport(), reportBtn);
    } else {
      navigator.clipboard.writeText(generateReport()).then(function() {
        const orig = reportBtn.textContent;
        reportBtn.textContent = 'Copied!';
        setTimeout(function() { reportBtn.textContent = orig; }, 2000);
      });
    }
  });

  resetBtn.addEventListener('click', function() {
    if (typeof ToolUtils !== 'undefined') {
      ToolUtils.confirmReset('Reset all SMI-FRAIL-20 responses?', resetForm);
    } else if (confirm('Reset all SMI-FRAIL-20 responses?')) {
      resetForm();
    }
  });

  /* ── Init ──────────────────────────────────────────────────────────── */
  renderSmiForm();
  renderSudForm();
  toggleSud();
  updateScores();
})();

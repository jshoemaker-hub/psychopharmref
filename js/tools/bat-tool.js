
(function() {
  /* ── BAT Configuration ─────────────────────────────────────────────── */
  const WORK_ITEMS = {
    exhaustion: [
      { id: 1, text: 'At work, I feel mentally exhausted', short: true },
      { id: 2, text: 'Everything I do at work requires a great deal of effort', short: false },
      { id: 3, text: 'After a day at work, I find it hard to recover my energy', short: true },
      { id: 4, text: 'At work, I feel physically exhausted', short: true },
      { id: 5, text: 'When I get up in the morning, I lack the energy to start a new day at work', short: false },
      { id: 6, text: 'I want to be active at work, but somehow I am unable to manage', short: false },
      { id: 7, text: 'When I exert myself at work, I quickly get tired', short: false },
      { id: 8, text: 'At the end of my working day, I feel mentally exhausted and drained', short: false }
    ],
    mentalDistance: [
      { id: 9, text: 'I struggle to find any enthusiasm for my work', short: true },
      { id: 10, text: 'At work, I do not think much about what I am doing and I function on autopilot', short: false },
      { id: 11, text: 'I feel a strong aversion towards my job', short: true },
      { id: 12, text: 'I feel indifferent about my job', short: false },
      { id: 13, text: "I'm cynical about what my work means to others", short: true }
    ],
    cognitiveImpairment: [
      { id: 14, text: 'At work, I have trouble staying focused', short: true },
      { id: 15, text: 'At work I struggle to think clearly', short: false },
      { id: 16, text: "I'm forgetful and distracted at work", short: false },
      { id: 17, text: 'When I\'m working, I have trouble concentrating', short: true },
      { id: 18, text: 'I make mistakes in my work because I have my mind on other things', short: true }
    ],
    emotionalImpairment: [
      { id: 19, text: 'At work, I feel unable to control my emotions', short: true },
      { id: 20, text: 'I do not recognize myself in the way I react emotionally at work', short: true },
      { id: 21, text: "During my work I become irritable when things don't go my way", short: false },
      { id: 22, text: 'I get upset or sad at work without knowing why', short: false },
      { id: 23, text: 'At work I may overreact unintentionally', short: true }
    ]
  };

  const GENERAL_ITEMS = {
    exhaustion: [
      { id: 1, text: 'I feel mentally exhausted', short: true },
      { id: 2, text: 'Everything I do requires a great deal of effort', short: false },
      { id: 3, text: 'At the end of the day, I find it hard to recover my energy', short: true },
      { id: 4, text: 'I feel physically exhausted', short: true },
      { id: 5, text: 'When I get up in the morning, I lack the energy to start a new day', short: false },
      { id: 6, text: 'I want to be active, but somehow I am unable to manage', short: false },
      { id: 7, text: 'When I exert myself, I quickly get tired', short: false },
      { id: 8, text: 'At the end of my day, I feel mentally exhausted and drained', short: false }
    ],
    mentalDistance: [
      { id: 9, text: 'I struggle to find any enthusiasm for my work', short: true },
      { id: 10, text: 'I feel a strong aversion towards my job', short: true },
      { id: 11, text: 'I feel indifferent about my job', short: false },
      { id: 12, text: "I'm cynical about what my work means to others", short: true }
    ],
    cognitiveImpairment: [
      { id: 13, text: 'I have trouble staying focused', short: true },
      { id: 14, text: 'I struggle to think clearly', short: false },
      { id: 15, text: "I'm forgetful and distracted", short: false },
      { id: 16, text: 'I have trouble concentrating', short: true },
      { id: 17, text: 'I make mistakes because I have my mind on other things', short: true }
    ],
    emotionalImpairment: [
      { id: 18, text: 'I feel unable to control my emotions', short: true },
      { id: 19, text: 'I do not recognize myself in the way I react emotionally', short: true },
      { id: 20, text: "I become irritable when things don't go my way", short: false },
      { id: 21, text: 'I get upset or sad without knowing why', short: false },
      { id: 22, text: 'I may overreact unintentionally', short: true }
    ]
  };

  const SECONDARY_ITEMS = {
    psychological: [
      { id: 's1', text: 'I have trouble falling or staying asleep' },
      { id: 's2', text: 'I tend to worry' },
      { id: 's3', text: 'I feel tense and stressed' },
      { id: 's4', text: 'I feel anxious and/or suffer from panic attacks' },
      { id: 's5', text: 'Noise and crowds disturb me' }
    ],
    psychosomatic: [
      { id: 's6', text: 'I suffer from palpitations or chest pain' },
      { id: 's7', text: 'I suffer from stomach and/or intestinal complaints' },
      { id: 's8', text: 'I suffer from headaches' },
      { id: 's9', text: 'I suffer from muscle pain, for example in the neck, shoulder or back' },
      { id: 's10', text: 'I often get sick' }
    ]
  };

  const DOMAIN_META = {
    exhaustion:          { label: 'Exhaustion',           icon: '🔋', color: '#c04030' },
    mentalDistance:       { label: 'Mental Distance',      icon: '🚪', color: '#b05a20' },
    cognitiveImpairment: { label: 'Cognitive Impairment',  icon: '🧠', color: '#8b6914' },
    emotionalImpairment: { label: 'Emotional Impairment',  icon: '💔', color: '#6a4c93' },
    psychological:       { label: 'Psychological Complaints', icon: '😰', color: '#2a7ab5' },
    psychosomatic:       { label: 'Psychosomatic Complaints', icon: '🩺', color: '#5a8a6a' }
  };

  const OPTIONS = [
    { value: 0, label: 'N/A' },
    { value: 1, label: 'Never' },
    { value: 2, label: 'Rarely' },
    { value: 3, label: 'Some-\ntimes' },
    { value: 4, label: 'Often' },
    { value: 5, label: 'Always' }
  ];

  const COLUMN_LABELS = ['N/A','Never','Rarely','Sometimes','Often','Always'];

  let currentVersion = 'work';

  /* ── DOM References ────────────────────────────────────────────────── */
  const container   = document.getElementById('bo-form-container');
  const workBtn     = document.getElementById('bo-work-btn');
  const generalBtn  = document.getElementById('bo-general-btn');
  const totalNumEl  = document.getElementById('bo-total-num');
  const totalMaxEl  = document.getElementById('bo-total-max');
  const severityEl  = document.getElementById('bo-severity');
  const exhNumEl    = document.getElementById('bo-exh-num');
  const mdNumEl     = document.getElementById('bo-md-num');
  const ciNumEl     = document.getElementById('bo-ci-num');
  const eiNumEl     = document.getElementById('bo-ei-num');
  const secNumEl    = document.getElementById('bo-sec-num');
  const barChart    = document.getElementById('bo-bar-chart');
  const reportBtn   = document.getElementById('bo-report-btn');
  const resetBtn    = document.getElementById('bo-reset-btn');

  /* ── Render Form ───────────────────────────────────────────────────── */
  function getItems() {
    return currentVersion === 'work' ? WORK_ITEMS : GENERAL_ITEMS;
  }

  function renderForm() {
    const items = getItems();
    let html = '';

    // Core symptom domains
    const coreDomains = ['exhaustion', 'mentalDistance', 'cognitiveImpairment', 'emotionalImpairment'];
    coreDomains.forEach(domain => {
      const meta = DOMAIN_META[domain];
      const domainItems = items[domain];
      html += `<div class="bo-domain">`;
      html += `<div class="bo-domain-header">
        <span class="bo-domain-icon">${meta.icon}</span>
        ${meta.label}
        <span class="bo-domain-count">${domainItems.length} items</span>
      </div>`;
      // Column headers
      html += `<div class="bo-column-headers">
        <span class="bo-column-spacer"></span>
        <span class="bo-column-text-spacer"></span>
        <div class="bo-column-labels">
          ${COLUMN_LABELS.map(l => `<span class="bo-column-label">${l}</span>`).join('')}
        </div>
      </div>`;
      domainItems.forEach(item => {
        const shortTag = item.short ? '<span class="bo-item-short">short</span>' : '';
        html += `<div class="bo-item-group">
          <div class="bo-item-row">
            <span class="bo-item-num">${item.id}.</span>
            <span class="bo-item-text">${item.text}${shortTag}</span>
            <div class="bo-radios">
              ${OPTIONS.map(opt => `
                <label class="bo-radio-label">
                  <input type="radio" name="bo-core-${item.id}" value="${opt.value}" ${opt.value === 0 ? 'checked' : ''}>
                  <span class="bo-radio-text">${opt.label}</span>
                </label>
              `).join('')}
            </div>
          </div>
        </div>`;
      });
      html += `</div>`;
    });

    // Secondary symptoms
    const secDomains = ['psychological', 'psychosomatic'];
    secDomains.forEach(domain => {
      const meta = DOMAIN_META[domain];
      const domainItems = SECONDARY_ITEMS[domain];
      html += `<div class="bo-domain">`;
      html += `<div class="bo-domain-header bo-domain-header-secondary">
        <span class="bo-domain-icon">${meta.icon}</span>
        ${meta.label}
        <span class="bo-domain-count">${domainItems.length} items</span>
      </div>`;
      html += `<div class="bo-column-headers">
        <span class="bo-column-spacer"></span>
        <span class="bo-column-text-spacer"></span>
        <div class="bo-column-labels">
          ${COLUMN_LABELS.map(l => `<span class="bo-column-label">${l}</span>`).join('')}
        </div>
      </div>`;
      domainItems.forEach(item => {
        html += `<div class="bo-item-group">
          <div class="bo-item-row">
            <span class="bo-item-num">${item.id.replace('s','')}.</span>
            <span class="bo-item-text">${item.text}</span>
            <div class="bo-radios">
              ${OPTIONS.map(opt => `
                <label class="bo-radio-label">
                  <input type="radio" name="bo-sec-${item.id}" value="${opt.value}" ${opt.value === 0 ? 'checked' : ''}>
                  <span class="bo-radio-text">${opt.label}</span>
                </label>
              `).join('')}
            </div>
          </div>
        </div>`;
      });
      html += `</div>`;
    });

    container.innerHTML = html;
    container.addEventListener('change', updateScores);
  }

  /* ── Scoring ───────────────────────────────────────────────────────── */
  function getDomainScore(prefix, items) {
    let sum = 0, count = 0;
    items.forEach(item => {
      const name = `${prefix}${item.id}`;
      const sel = container.querySelector(`input[name="${name}"]:checked`);
      if (sel) {
        const val = parseInt(sel.value, 10);
        if (val > 0) { sum += val; count++; }
      }
    });
    return { sum, count, avg: count > 0 ? (sum / count) : 0 };
  }

  function getSeverity(avg) {
    if (avg < 1.5) return { label: 'No/very low risk', cls: 'bo-severity-low' };
    if (avg < 2.5) return { label: 'Low risk', cls: 'bo-severity-low' };
    if (avg < 3.5) return { label: 'At risk', cls: 'bo-severity-moderate' };
    if (avg < 4.5) return { label: 'High risk', cls: 'bo-severity-high' };
    return { label: 'Very high risk', cls: 'bo-severity-very-high' };
  }

  function updateScores() {
    const items = getItems();
    const exh = getDomainScore('bo-core-', items.exhaustion);
    const md  = getDomainScore('bo-core-', items.mentalDistance);
    const ci  = getDomainScore('bo-core-', items.cognitiveImpairment);
    const ei  = getDomainScore('bo-core-', items.emotionalImpairment);

    const psy = getDomainScore('bo-sec-', SECONDARY_ITEMS.psychological);
    const pso = getDomainScore('bo-sec-', SECONDARY_ITEMS.psychosomatic);

    // Core total average
    const coreSum = exh.sum + md.sum + ci.sum + ei.sum;
    const coreCount = exh.count + md.count + ci.count + ei.count;
    const coreAvg = coreCount > 0 ? (coreSum / coreCount) : 0;

    // Secondary total average
    const secSum = psy.sum + pso.sum;
    const secCount = psy.count + pso.count;
    const secAvg = secCount > 0 ? (secSum / secCount) : 0;

    const severity = getSeverity(coreAvg);

    // Update score cards
    totalNumEl.textContent = coreAvg.toFixed(2);
    const totalItems = currentVersion === 'work' ? 23 : 22;
    totalMaxEl.textContent = `/ 5.00  (${coreCount}/${totalItems} answered)`;
    severityEl.textContent = severity.label;
    severityEl.className = `bo-severity ${severity.cls}`;

    exhNumEl.textContent = exh.avg.toFixed(2);
    mdNumEl.textContent  = md.avg.toFixed(2);
    ciNumEl.textContent  = ci.avg.toFixed(2);
    eiNumEl.textContent  = ei.avg.toFixed(2);
    secNumEl.textContent = secAvg.toFixed(2);

    // Update bar chart
    const bars = [
      { label: 'Exhaustion', avg: exh.avg, cls: 'bo-bar-fill--exhaustion' },
      { label: 'Mental Distance', avg: md.avg, cls: 'bo-bar-fill--distance' },
      { label: 'Cognitive Impairment', avg: ci.avg, cls: 'bo-bar-fill--cognitive' },
      { label: 'Emotional Impairment', avg: ei.avg, cls: 'bo-bar-fill--emotional' },
      { label: 'Psychological', avg: psy.avg, cls: 'bo-bar-fill--psychological' },
      { label: 'Psychosomatic', avg: pso.avg, cls: 'bo-bar-fill--psychosomatic' }
    ];
    barChart.innerHTML = bars.map(b => {
      const pct = (b.avg / 5) * 100;
      return `<div class="bo-bar-row">
        <div class="bo-bar-label">${b.label}</div>
        <div class="bo-bar-track">
          <div class="bo-bar-fill ${b.cls}" style="width:${pct}%"></div>
          <span class="bo-bar-pct">${b.avg.toFixed(2)}</span>
        </div>
      </div>`;
    }).join('');
  }

  /* ── Report Generation ─────────────────────────────────────────────── */
  function generateReport() {
    const items = getItems();
    const today = new Date().toISOString().split('T')[0];
    const versionLabel = currentVersion === 'work' ? 'Work-Related' : 'General';

    const exh = getDomainScore('bo-core-', items.exhaustion);
    const md  = getDomainScore('bo-core-', items.mentalDistance);
    const ci  = getDomainScore('bo-core-', items.cognitiveImpairment);
    const ei  = getDomainScore('bo-core-', items.emotionalImpairment);
    const psy = getDomainScore('bo-sec-', SECONDARY_ITEMS.psychological);
    const pso = getDomainScore('bo-sec-', SECONDARY_ITEMS.psychosomatic);

    const coreSum = exh.sum + md.sum + ci.sum + ei.sum;
    const coreCount = exh.count + md.count + ci.count + ei.count;
    const coreAvg = coreCount > 0 ? (coreSum / coreCount) : 0;
    const secSum = psy.sum + pso.sum;
    const secCount = psy.count + pso.count;
    const secAvg = secCount > 0 ? (secSum / secCount) : 0;
    const severity = getSeverity(coreAvg);

    const lines = [
      `Burnout Assessment Tool (BAT) — ${versionLabel} Version`,
      `Date: ${today}`,
      ``,
      `CORE SYMPTOMS (mean score):`,
      `  Overall:               ${coreAvg.toFixed(2)} / 5.00  [${severity.label}]`,
      `  Exhaustion:            ${exh.avg.toFixed(2)} / 5.00  (${exh.count} items)`,
      `  Mental Distance:       ${md.avg.toFixed(2)} / 5.00  (${md.count} items)`,
      `  Cognitive Impairment:  ${ci.avg.toFixed(2)} / 5.00  (${ci.count} items)`,
      `  Emotional Impairment:  ${ei.avg.toFixed(2)} / 5.00  (${ei.count} items)`,
      ``,
      `SECONDARY SYMPTOMS (mean score):`,
      `  Overall:               ${secAvg.toFixed(2)} / 5.00  (${secCount} items)`,
      `  Psychological:         ${psy.avg.toFixed(2)} / 5.00  (${psy.count} items)`,
      `  Psychosomatic:         ${pso.avg.toFixed(2)} / 5.00  (${pso.count} items)`,
      ``,
      `INDIVIDUAL ITEM RESPONSES:`
    ];

    // Core items
    const coreDomains = [
      { key: 'exhaustion', label: 'Exhaustion' },
      { key: 'mentalDistance', label: 'Mental Distance' },
      { key: 'cognitiveImpairment', label: 'Cognitive Impairment' },
      { key: 'emotionalImpairment', label: 'Emotional Impairment' }
    ];
    const valLabels = ['N/A','Never','Rarely','Sometimes','Often','Always'];
    coreDomains.forEach(d => {
      lines.push(`  ${d.label}:`);
      items[d.key].forEach(item => {
        const sel = container.querySelector(`input[name="bo-core-${item.id}"]:checked`);
        const val = sel ? parseInt(sel.value,10) : 0;
        const lbl = valLabels[val] || 'N/A';
        lines.push(`    ${item.id}. ${item.text}: ${val > 0 ? val : '-'} (${lbl})`);
      });
    });

    // Secondary items
    const secDomains = [
      { key: 'psychological', label: 'Psychological Complaints' },
      { key: 'psychosomatic', label: 'Psychosomatic Complaints' }
    ];
    secDomains.forEach(d => {
      lines.push(`  ${d.label}:`);
      SECONDARY_ITEMS[d.key].forEach(item => {
        const sel = container.querySelector(`input[name="bo-sec-${item.id}"]:checked`);
        const val = sel ? parseInt(sel.value,10) : 0;
        const lbl = valLabels[val] || 'N/A';
        const num = item.id.replace('s','');
        lines.push(`    ${num}. ${item.text}: ${val > 0 ? val : '-'} (${lbl})`);
      });
    });

    lines.push('');
    lines.push('Interpretation: Mean scores ≥ 3.50 suggest significant burnout risk warranting clinical attention.');
    lines.push('Reference: Schaufeli, W.B., De Witte, H. & Desart, S. (2019). BAT – Test Manual. KU Leuven.');

    return lines.join('\n');
  }

  /* ── Event Handlers ────────────────────────────────────────────────── */
  function switchVersion(version) {
    currentVersion = version;
    workBtn.classList.toggle('bo-active', version === 'work');
    generalBtn.classList.toggle('bo-active', version === 'general');
    renderForm();
    updateScores();
  }

  function copyReport() {
    const report = generateReport();
    navigator.clipboard.writeText(report).then(() => {
      const orig = reportBtn.textContent;
      reportBtn.textContent = 'Copied!';
      setTimeout(() => { reportBtn.textContent = orig; }, 2000);
    }).catch(err => console.error('Copy failed:', err));
  }

  function resetForm() {
    if (confirm('Reset all responses? This action cannot be undone.')) {
      renderForm();
      updateScores();
    }
  }

  workBtn.addEventListener('click', () => switchVersion('work'));
  generalBtn.addEventListener('click', () => switchVersion('general'));
  reportBtn.addEventListener('click', copyReport);
  resetBtn.addEventListener('click', resetForm);

  /* ── Init ──────────────────────────────────────────────────────────── */
  renderForm();
  updateScores();
})();

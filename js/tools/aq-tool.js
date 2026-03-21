(function() {
  /* ── AQ Configuration ────────────────────────────────────────────────── */
  const AQ_10_ITEMS = [
    { id: 1, text: 'I often notice small sounds when others do not', scoreDir: 'agree' },
    { id: 2, text: 'I usually concentrate more on the whole picture, rather than the small details', scoreDir: 'disagree' },
    { id: 3, text: 'I find it easy to do more than one thing at once', scoreDir: 'disagree' },
    { id: 4, text: 'If there is an interruption, I can switch back to what I was doing very quickly', scoreDir: 'disagree' },
    { id: 5, text: 'I find it easy to \'read between the lines\' when someone is talking to me', scoreDir: 'disagree' },
    { id: 6, text: 'I know how to tell if someone listening to me is getting bored', scoreDir: 'disagree' },
    { id: 7, text: 'When I\'m reading a story, I find it difficult to work out the characters\' intentions', scoreDir: 'agree' },
    { id: 8, text: 'I like to collect information about categories of things (e.g., types of car, types of bird, types of train, types of plant, etc.)', scoreDir: 'agree' },
    { id: 9, text: 'I find it easy to work out what someone is thinking or feeling just by looking at their face', scoreDir: 'disagree' },
    { id: 10, text: 'I find it difficult to work out people\'s intentions', scoreDir: 'agree' }
  ];

  const AQ_50_ITEMS = [
    { id: 1, text: 'I prefer to do things with others rather than on my own', scoreDir: 'disagree', domain: 'social' },
    { id: 2, text: 'I prefer to do things the same way over and over again', scoreDir: 'agree', domain: 'switch' },
    { id: 3, text: 'If I try to imagine something, I find it very easy to create a picture in my mind', scoreDir: 'disagree', domain: 'imag' },
    { id: 4, text: 'I frequently get so strongly absorbed in one thing that I lose sight of other things', scoreDir: 'agree', domain: 'switch' },
    { id: 5, text: 'I often notice small sounds when others do not', scoreDir: 'agree', domain: 'detail' },
    { id: 6, text: 'I usually notice car number plates or similar strings of information', scoreDir: 'agree', domain: 'detail' },
    { id: 7, text: 'Other people frequently tell me that what I\'ve said is impolite, even though I think it is polite', scoreDir: 'agree', domain: 'comm' },
    { id: 8, text: 'When I\'m reading a story, I can easily imagine what the characters might look like', scoreDir: 'disagree', domain: 'imag' },
    { id: 9, text: 'I am fascinated by dates', scoreDir: 'agree', domain: 'detail' },
    { id: 10, text: 'In a social group, I can easily keep track of several different people\'s conversations', scoreDir: 'disagree', domain: 'switch' },
    { id: 11, text: 'I find social situations easy', scoreDir: 'disagree', domain: 'social' },
    { id: 12, text: 'I tend to notice details that others do not', scoreDir: 'agree', domain: 'detail' },
    { id: 13, text: 'I would rather go to a library than a party', scoreDir: 'agree', domain: 'social' },
    { id: 14, text: 'I find making up stories easy', scoreDir: 'disagree', domain: 'imag' },
    { id: 15, text: 'I find myself drawn more strongly to people than to things', scoreDir: 'disagree', domain: 'social' },
    { id: 16, text: 'I tend to have very strong interests, which I get upset about if I can\'t pursue', scoreDir: 'agree', domain: 'switch' },
    { id: 17, text: 'I enjoy social chit-chat', scoreDir: 'disagree', domain: 'comm' },
    { id: 18, text: 'When I talk, it isn\'t always easy for others to get a word in edgeways', scoreDir: 'agree', domain: 'comm' },
    { id: 19, text: 'I am fascinated by numbers', scoreDir: 'agree', domain: 'detail' },
    { id: 20, text: 'When I\'m reading a story, I find it difficult to work out the characters\' intentions', scoreDir: 'agree', domain: 'imag' },
    { id: 21, text: 'I don\'t particularly enjoy reading fiction', scoreDir: 'agree', domain: 'imag' },
    { id: 22, text: 'I find it hard to make new friends', scoreDir: 'agree', domain: 'social' },
    { id: 23, text: 'I notice patterns in things all the time', scoreDir: 'agree', domain: 'detail' },
    { id: 24, text: 'I would rather go to the theatre than a museum', scoreDir: 'disagree', domain: 'imag' },
    { id: 25, text: 'It does not upset me if my daily routine is disturbed', scoreDir: 'disagree', domain: 'switch' },
    { id: 26, text: 'I frequently find that I don\'t know how to keep a conversation going', scoreDir: 'agree', domain: 'comm' },
    { id: 27, text: 'I find it easy to "read between the lines" when someone is talking to me', scoreDir: 'disagree', domain: 'comm' },
    { id: 28, text: 'I usually concentrate more on the whole picture, rather than the small details', scoreDir: 'disagree', domain: 'detail' },
    { id: 29, text: 'I am not very good at remembering phone numbers', scoreDir: 'disagree', domain: 'detail' },
    { id: 30, text: 'I don\'t usually notice small changes in a situation or a person\'s appearance', scoreDir: 'disagree', domain: 'detail' },
    { id: 31, text: 'I know how to tell if someone listening to me is getting bored', scoreDir: 'disagree', domain: 'comm' },
    { id: 32, text: 'I find it easy to do more than one thing at once', scoreDir: 'disagree', domain: 'switch' },
    { id: 33, text: 'When I talk on the phone, I\'m not sure when it\'s my turn to speak', scoreDir: 'agree', domain: 'comm' },
    { id: 34, text: 'I enjoy doing things spontaneously', scoreDir: 'disagree', domain: 'switch' },
    { id: 35, text: 'I am often the last to understand the point of a joke', scoreDir: 'agree', domain: 'comm' },
    { id: 36, text: 'I find it easy to work out what someone is thinking or feeling just by looking at their face', scoreDir: 'disagree', domain: 'social' },
    { id: 37, text: 'If there is an interruption, I can switch back to what I was doing very quickly', scoreDir: 'disagree', domain: 'switch' },
    { id: 38, text: 'I am good at social chit-chat', scoreDir: 'disagree', domain: 'comm' },
    { id: 39, text: 'People often tell me that I keep going on and on about the same thing', scoreDir: 'agree', domain: 'comm' },
    { id: 40, text: 'When I was young, I used to enjoy playing games of pretend with other children', scoreDir: 'disagree', domain: 'imag' },
    { id: 41, text: 'I like to collect information about categories of things (e.g., types of car, types of bird, types of train, types of plant, etc.)', scoreDir: 'agree', domain: 'imag' },
    { id: 42, text: 'I find it difficult to imagine what it would be like to be someone else', scoreDir: 'agree', domain: 'imag' },
    { id: 43, text: 'I like to plan any activities I participate in carefully', scoreDir: 'agree', domain: 'switch' },
    { id: 44, text: 'I enjoy social occasions', scoreDir: 'disagree', domain: 'social' },
    { id: 45, text: 'I find it difficult to work out people\'s intentions', scoreDir: 'agree', domain: 'social' },
    { id: 46, text: 'New situations make me anxious', scoreDir: 'agree', domain: 'switch' },
    { id: 47, text: 'I enjoy meeting new people', scoreDir: 'disagree', domain: 'social' },
    { id: 48, text: 'I am a good diplomat', scoreDir: 'disagree', domain: 'social' },
    { id: 49, text: 'I am not very good at remembering people\'s date of birth', scoreDir: 'disagree', domain: 'detail' },
    { id: 50, text: 'I find it very easy to play games with children that involve pretending', scoreDir: 'disagree', domain: 'imag' }
  ];

  const DOMAIN_META = {
    social: { label: 'Social Skills', icon: '👥', color: '#c04030' },
    switch: { label: 'Attention Switching', icon: '🔄', color: '#b05a20' },
    detail: { label: 'Attention to Detail', icon: '🔍', color: '#8b6914' },
    comm: { label: 'Communication', icon: '💬', color: '#6a4c93' },
    imag: { label: 'Imagination', icon: '🎭', color: '#2a7ab5' }
  };

  const OPTIONS = [
    { value: 'defAgree', label: 'Def. Agree' },
    { value: 'sltAgree', label: 'Slt. Agree' },
    { value: 'sltDisagree', label: 'Slt. Disagree' },
    { value: 'defDisagree', label: 'Def. Disagree' }
  ];

  let currentVersion = 'aq-10';

  /* ── DOM References ────────────────────────────────────────────────── */
  const container = document.getElementById('aq-form-container');
  const aq10Btn = document.getElementById('aq-10-btn');
  const aq50Btn = document.getElementById('aq-50-btn');
  const totalNumEl = document.getElementById('aq-total-num');
  const totalMaxEl = document.getElementById('aq-total-max');
  const resultEl = document.getElementById('aq-result');
  const socialNumEl = document.getElementById('aq-social-num');
  const switchNumEl = document.getElementById('aq-switch-num');
  const detailNumEl = document.getElementById('aq-detail-num');
  const commNumEl = document.getElementById('aq-comm-num');
  const imagNumEl = document.getElementById('aq-imag-num');
  const domainScoresEl = document.getElementById('aq-domain-scores');
  const barChartEl = document.getElementById('aq-bar-chart');
  const reportBtn = document.getElementById('aq-report-btn');
  const resetBtn = document.getElementById('aq-reset-btn');
  const progressText = document.getElementById('aq-progress-text');
  const progressFill = document.getElementById('aq-progress-fill');

  /* ── Render Form ───────────────────────────────────────────────────── */
  function getItems() {
    return currentVersion === 'aq-10' ? AQ_10_ITEMS : AQ_50_ITEMS;
  }

  function renderForm() {
    const items = getItems();
    let html = '';

    if (currentVersion === 'aq-10') {
      // Single list for AQ-10
      html += `<div class="aq-item-list">`;
      html += `<div class="aq-column-headers">
        <span class="aq-column-spacer"></span>
        <span class="aq-column-text-spacer"></span>
        <div class="aq-column-labels">
          ${OPTIONS.map(o => `<span class="aq-column-label">${o.label}</span>`).join('')}
        </div>
      </div>`;
      items.forEach(item => {
        const dirClass = item.scoreDir === 'agree' ? 'aq-item-score-dir--agree' : 'aq-item-score-dir--disagree';
        const dirText = item.scoreDir === 'agree' ? 'AGREE' : 'DISAGREE';
        html += `<div class="aq-item-group">
          <div class="aq-item-row">
            <span class="aq-item-num">${item.id}.</span>
            <span class="aq-item-text">
              ${item.text}
              <span class="aq-item-score-dir ${dirClass}">${dirText}</span>
            </span>
            <div class="aq-radios">
              ${OPTIONS.map(opt => `
                <label class="aq-radio-label">
                  <input type="radio" name="aq-item-${item.id}" value="${opt.value}">
                  <span class="aq-radio-text"></span>
                </label>
              `).join('')}
            </div>
          </div>
        </div>`;
      });
      html += `</div>`;
    } else {
      // AQ-50: grouped by domain
      const domains = ['social', 'switch', 'detail', 'comm', 'imag'];
      domains.forEach(domainKey => {
        const meta = DOMAIN_META[domainKey];
        const domainItems = items.filter(i => i.domain === domainKey);
        html += `<div class="aq-domain">`;
        html += `<div class="aq-domain-header" style="border-left: 4px solid ${meta.color};">
          <span class="aq-domain-icon">${meta.icon}</span>
          ${meta.label}
          <span class="aq-domain-count">${domainItems.length} items</span>
        </div>`;
        html += `<div class="aq-column-headers">
          <span class="aq-column-spacer"></span>
          <span class="aq-column-text-spacer"></span>
          <div class="aq-column-labels">
            ${OPTIONS.map(o => `<span class="aq-column-label">${o.label}</span>`).join('')}
          </div>
        </div>`;
        domainItems.forEach(item => {
          const dirClass = item.scoreDir === 'agree' ? 'aq-item-score-dir--agree' : 'aq-item-score-dir--disagree';
          const dirText = item.scoreDir === 'agree' ? 'AGREE' : 'DISAGREE';
          html += `<div class="aq-item-group">
            <div class="aq-item-row">
              <span class="aq-item-num">${item.id}.</span>
              <span class="aq-item-text">
                ${item.text}
                <span class="aq-item-score-dir ${dirClass}">${dirText}</span>
              </span>
              <div class="aq-radios">
                ${OPTIONS.map(opt => `
                  <label class="aq-radio-label">
                    <input type="radio" name="aq-item-${item.id}" value="${opt.value}">
                    <span class="aq-radio-text"></span>
                  </label>
                `).join('')}
              </div>
            </div>
          </div>`;
        });
        html += `</div>`;
      });
    }

    container.innerHTML = html;
    container.addEventListener('change', updateScores);
  }

  /* ── Scoring ───────────────────────────────────────────────────────── */
  function getItemScore(itemId) {
    const item = getItems().find(i => i.id === itemId);
    if (!item) return 0;

    const sel = container.querySelector(`input[name="aq-item-${itemId}"]:checked`);
    if (!sel) return 0;

    const response = sel.value;
    const scoreDir = item.scoreDir;

    // Score 1 if response direction matches scoreDir requirement
    if (scoreDir === 'agree') {
      return (response === 'defAgree' || response === 'sltAgree') ? 1 : 0;
    } else {
      return (response === 'defDisagree' || response === 'sltDisagree') ? 1 : 0;
    }
  }

  function updateScores() {
    const items = getItems();
    let totalScore = 0;
    let answeredCount = 0;

    // Calculate total score
    items.forEach(item => {
      const score = getItemScore(item.id);
      totalScore += score;
      if (container.querySelector(`input[name="aq-item-${item.id}"]:checked`)) {
        answeredCount++;
      }
    });

    const maxScore = items.length;

    // Update progress indicator
    const pctProgress = maxScore > 0 ? Math.round((answeredCount / maxScore) * 100) : 0;
    progressText.textContent = `${answeredCount} of ${maxScore} items answered`;
    progressFill.style.width = `${pctProgress}%`;

    // Update total score display
    totalNumEl.textContent = totalScore;
    totalMaxEl.textContent = `/ ${maxScore}`;

    // Determine result and update badge
    let resultLabel = '';
    let resultClass = '';
    if (currentVersion === 'aq-10') {
      if (totalScore >= 6) {
        resultLabel = 'Elevated (Refer for evaluation)';
        resultClass = 'aq-result--elevated';
      } else {
        resultLabel = 'Low';
        resultClass = 'aq-result--low';
      }
    } else {
      if (totalScore <= 25) {
        resultLabel = 'Low';
        resultClass = 'aq-result--low';
      } else if (totalScore <= 31) {
        resultLabel = 'Borderline/Elevated';
        resultClass = 'aq-result--elevated';
      } else {
        resultLabel = 'Clinically Significant';
        resultClass = 'aq-result--high';
      }
    }

    resultEl.textContent = resultLabel;
    resultEl.className = `aq-result ${resultClass}`;

    // Calculate domain scores for AQ-50
    if (currentVersion === 'aq-50') {
      const domains = {
        social: { items: items.filter(i => i.domain === 'social'), el: socialNumEl },
        switch: { items: items.filter(i => i.domain === 'switch'), el: switchNumEl },
        detail: { items: items.filter(i => i.domain === 'detail'), el: detailNumEl },
        comm: { items: items.filter(i => i.domain === 'comm'), el: commNumEl },
        imag: { items: items.filter(i => i.domain === 'imag'), el: imagNumEl }
      };

      let barData = [];
      Object.keys(domains).forEach(key => {
        const domainInfo = domains[key];
        let domainScore = 0;
        domainInfo.items.forEach(item => {
          domainScore += getItemScore(item.id);
        });
        domainInfo.el.textContent = domainScore;
        barData.push({
          key: key,
          label: DOMAIN_META[key].label,
          score: domainScore,
          color: DOMAIN_META[key].color
        });
      });

      // Update bar chart
      barChartEl.innerHTML = barData.map(b => {
        const pct = (b.score / 10) * 100;
        return `<div class="aq-bar-row">
          <div class="aq-bar-label">${b.label}</div>
          <div class="aq-bar-track">
            <div class="aq-bar-fill" style="width:${pct}%; background-color:${b.color};"></div>
            <span class="aq-bar-pct">${b.score} / 10</span>
          </div>
        </div>`;
      }).join('');
    }
  }

  /* ── Report Generation ─────────────────────────────────────────────── */
  function generateReport() {
    const items = getItems();
    const today = new Date().toISOString().split('T')[0];
    const isAQ10 = currentVersion === 'aq-10';

    let totalScore = 0;
    items.forEach(item => {
      totalScore += getItemScore(item.id);
    });

    // Determine result interpretation
    let resultInterpretation = '';
    if (isAQ10) {
      if (totalScore >= 6) {
        resultInterpretation = 'Elevated: Score ≥6 suggests possible autism spectrum traits. Consider formal evaluation.';
      } else {
        resultInterpretation = 'Low: Score <6 suggests fewer autism spectrum traits.';
      }
    } else {
      if (totalScore <= 25) {
        resultInterpretation = 'Low (0-25): Non-significant autistic traits.';
      } else if (totalScore <= 31) {
        resultInterpretation = 'Borderline/Elevated (26-31): Above average autistic traits. Consider further evaluation.';
      } else {
        resultInterpretation = 'Clinically Significant (32-50): Strong indication of autism spectrum traits. Formal evaluation recommended.';
      }
    }

    const lines = [];
    if (isAQ10) {
      lines.push('AQ-10 Autism Screening Results');
    } else {
      lines.push('AQ-50 Autism Spectrum Quotient Results');
    }
    lines.push(`Date: ${today}`);
    lines.push('');
    lines.push(`Total Score: ${totalScore} / ${items.length}`);
    lines.push(`Result: ${isAQ10 ? (totalScore >= 6 ? 'Elevated (Refer for evaluation)' : 'Low') : (totalScore <= 25 ? 'Low' : totalScore <= 31 ? 'Borderline/Elevated' : 'Clinically Significant')}`);
    lines.push('');

    // Domain scores for AQ-50
    if (!isAQ10) {
      lines.push('Domain Scores:');
      const domains = ['social', 'switch', 'detail', 'comm', 'imag'];
      domains.forEach(key => {
        const domainItems = items.filter(i => i.domain === key);
        let domainScore = 0;
        domainItems.forEach(item => {
          domainScore += getItemScore(item.id);
        });
        lines.push(`  ${DOMAIN_META[key].label}: ${domainScore} / 10`);
      });
      lines.push('');
    }

    lines.push('Individual Responses:');
    items.forEach(item => {
      const sel = container.querySelector(`input[name="aq-item-${item.id}"]:checked`);
      const response = sel ? sel.value : 'Not answered';
      const responseLabel = {
        'defAgree': 'Definitely Agree',
        'sltAgree': 'Slightly Agree',
        'sltDisagree': 'Slightly Disagree',
        'defDisagree': 'Definitely Disagree'
      }[response] || response;
      const scored = getItemScore(item.id) ? ' ✓' : '';
      lines.push(`  ${item.id}. ${item.text} — ${responseLabel}${scored}`);
    });

    lines.push('');
    lines.push(`Interpretation: ${resultInterpretation}`);

    return lines.join('\n');
  }

  /* ── Event Handlers ────────────────────────────────────────────────── */
  function switchVersion(version) {
    currentVersion = version;
    aq10Btn.classList.toggle('aq-active', version === 'aq-10');
    aq50Btn.classList.toggle('aq-active', version === 'aq-50');
    domainScoresEl.style.display = version === 'aq-50' ? 'flex' : 'none';
    barChartEl.style.display = version === 'aq-50' ? 'block' : 'none';
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

  aq10Btn.addEventListener('click', () => switchVersion('aq-10'));
  aq50Btn.addEventListener('click', () => switchVersion('aq-50'));
  reportBtn.addEventListener('click', copyReport);
  resetBtn.addEventListener('click', resetForm);

  /* ── Init ──────────────────────────────────────────────────────────── */
  renderForm();
  updateScores();
})();

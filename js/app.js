/* ── Side Effect Profiles ───────────────────────────────────────────────── */
// Maps common clinical side effects to the receptors that drive them, with weights.
// Higher weight = stronger causal relationship.
// Score is derived from Ki values: lower Ki → higher affinity → higher risk.
const SIDE_EFFECT_PROFILES = {
  sedation: {
    label: 'Sedation / Drowsiness',
    receptors: { H1: 1.0, alpha1: 0.5, M1: 0.3 }
  },
  weightGain: {
    label: 'Weight Gain',
    receptors: { H1: 1.0, '5HT2C': 0.9, M1: 0.2 }
  },
  anticholinergic: {
    label: 'Dry Mouth / Constipation (Anticholinergic)',
    receptors: { M1: 1.0 }
  },
  orthostasis: {
    label: 'Orthostatic Hypotension / Dizziness',
    receptors: { alpha1: 1.0, alpha2: 0.3 }
  },
  sexualDysfunction: {
    label: 'Sexual Dysfunction',
    receptors: { SERT: 1.0, '5HT2A': 0.4 }
  },
  eps: {
    label: 'EPS / Akathisia / Movement Disorders',
    receptors: { D2: 1.0, D3: 0.5 }
  },
  metabolic: {
    label: 'Metabolic Effects / Insulin Resistance',
    receptors: { '5HT2C': 1.0, H1: 0.8, M1: 0.2 }
  },
  insomnia: {
    label: 'Insomnia / Activation / Agitation',
    receptors: { NET: 0.9, DAT: 1.0, SERT: 0.3 }
  },
  hyperprolactinemia: {
    label: 'Hyperprolactinemia',
    receptors: { D2: 1.0 }
  },
  nausea: {
    label: 'Nausea / GI Upset',
    receptors: { SERT: 0.8, D2: 0.6 }
  },
  cognitiveImpairment: {
    label: 'Cognitive Impairment / Memory',
    receptors: { M1: 1.0, H1: 0.7, alpha1: 0.3 }
  },
  cardiacQT: {
    label: 'Cardiac / QT Effects',
    receptors: { H1: 0.5, alpha1: 0.6 }
  }
};

// Compute a 0–100 side effect risk score for a drug given a profile key.
// Returns null if the drug has no receptorKi data.
function sideEffectScore(drug, seKey) {
  const profile = SIDE_EFFECT_PROFILES[seKey];
  if (!profile || !drug.receptorKi) return null;
  const ki = drug.receptorKi;
  let weightedSum = 0;
  let totalWeight = 0;
  for (const [receptor, weight] of Object.entries(profile.receptors)) {
    const kiVal = ki[receptor];
    // Normalize: pKi range 5 (Ki=10000) to 9 (Ki=1) → 0 to 1
    const pkiVal = (kiVal && kiVal < 10000) ? (9 - Math.log10(kiVal)) : 5;
    const normalized = Math.max(0, (pkiVal - 5) / 4); // 0 to 1
    weightedSum += normalized * weight;
    totalWeight += weight;
  }
  return totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 100) : null;
}

function riskLabel(score) {
  if (score === null) return null;
  if (score < 20) return { text: 'Very Low',  cls: 'risk-vlow' };
  if (score < 40) return { text: 'Low',        cls: 'risk-low' };
  if (score < 60) return { text: 'Moderate',   cls: 'risk-mod' };
  if (score < 80) return { text: 'High',        cls: 'risk-high' };
  return               { text: 'Very High',   cls: 'risk-vhigh' };
}

/* ── Receptor Action Types ──────────────────────────────────────────────── */
// Default action type per receptor for the majority of psychiatric drugs.
const RECEPTOR_DEFAULT_ACTION = {
  SERT:    'Reuptake Inhibitor',
  NET:     'Reuptake Inhibitor',
  DAT:     'Reuptake Inhibitor',
  '5HT1A': 'Antagonist',
  '5HT2A': 'Antagonist',
  '5HT2C': 'Antagonist',
  D1:      'Antagonist',
  D2:      'Antagonist',
  D3:      'Antagonist',
  H1:      'Antagonist',
  alpha1:  'Antagonist',
  alpha2:  'Antagonist',
  M1:      'Antagonist',
  'GABA-A':'PAM',
  MT1:     'Agonist',
  MT2:     'Agonist',
  OX1R:   'Antagonist',
  OX2R:   'Antagonist',
};

// Drug-specific overrides for receptors where action differs from the default.
const RECEPTOR_ACTION_OVERRIDES = {
  // Third-generation antipsychotics / dopamine system stabilizers
  aripiprazole:  { D2: 'Partial Agonist', D3: 'Partial Agonist', '5HT1A': 'Partial Agonist' },
  brexpiprazole: { D2: 'Partial Agonist', D3: 'Partial Agonist', '5HT1A': 'Partial Agonist' },
  cariprazine:   { D2: 'Partial Agonist', D3: 'Partial Agonist', '5HT1A': 'Partial Agonist' },
  lumateperone:  { D2: 'Partial Agonist', D1: 'Partial Agonist' },
  // Antidepressants with 5HT1A partial agonism
  buspirone:     { '5HT1A': 'Partial Agonist' },
  vilazodone:    { '5HT1A': 'Partial Agonist' },
  vortioxetine:  { '5HT1A': 'Partial Agonist', '5HT1B': 'Partial Agonist' },
  gepirone:      { '5HT1A': 'Partial Agonist' },
  trazodone:     { '5HT1A': 'Partial Agonist' },
  // Quetiapine — active metabolite norquetiapine is a 5HT1A partial agonist
  quetiapine:    { '5HT1A': 'Partial Agonist' },
  // Ziprasidone — 5HT1A partial agonist + 5HT1D partial agonist
  ziprasidone:   { '5HT1A': 'Partial Agonist' },
  // Pimavanserin — inverse agonist at 5HT2A/2C (no D2 activity)
  pimavanserin:  { '5HT2A': 'Inverse Agonist', '5HT2C': 'Inverse Agonist' },
  // Melatonin receptor agonists
  ramelteon:     { MT1: 'Agonist', MT2: 'Agonist' },
  // Mirtazapine — alpha2 autoreceptor antagonist (disinhibits NE/5HT release)
  mirtazapine:   { alpha2: 'Antagonist (Presynaptic)' },
  // Clonidine / guanfacine — alpha2 agonists
  clonidine:     { alpha2: 'Agonist' },
  guanfacine:    { alpha2: 'Agonist' },
};

// Returns the binding action type string for a given drug and receptor.
function getReceptorAction(drugId, receptor) {
  return RECEPTOR_ACTION_OVERRIDES[drugId]?.[receptor]
      || RECEPTOR_DEFAULT_ACTION[receptor]
      || 'Antagonist';
}

// Abbreviated badge label and CSS class per action type.
const ACTION_BADGE = {
  'Reuptake Inhibitor':        { label: 'Reuptake Inhib.',  cls: 'act-reuptake'  },
  'Antagonist':                { label: 'Antagonist',        cls: 'act-ant'       },
  'Partial Agonist':           { label: 'Partial Agonist',   cls: 'act-partial'   },
  'Agonist':                   { label: 'Agonist',           cls: 'act-agonist'   },
  'Inverse Agonist':           { label: 'Inverse Agonist',   cls: 'act-inverse'   },
  'PAM':                       { label: 'PAM',               cls: 'act-pam'       },
  'Antagonist (Presynaptic)':  { label: 'Ant. (Pre)',        cls: 'act-ant-pre'   },
};

function actionBadge(drugId, receptor) {
  const action = getReceptorAction(drugId, receptor);
  const badge  = ACTION_BADGE[action] || { label: action, cls: 'act-ant' };
  return `<span class="action-badge ${badge.cls}">${badge.label}</span>`;
}

/* ── Utility Helpers ────────────────────────────────────────────────────── */
function classSlug(c) {
  return c.replace(/[^a-zA-Z0-9]/g, '');
}

function classBadge(cls) {
  const slug = classSlug(cls);
  return `<span class="class-badge class-${slug}">${cls}</span>`;
}

function pKi(ki) {
  if (!ki || ki >= 10000) return null;
  return 9 - Math.log10(ki);
}

function affinityLabel(ki) {
  if (!ki || ki >= 10000) return 'Negligible';
  if (ki < 1)    return 'Extremely High';
  if (ki < 10)   return 'Very High';
  if (ki < 100)  return 'High';
  if (ki < 1000) return 'Moderate';
  return 'Low';
}

// Compute 1/Ki normalized to percentages for pie chart
function receptorPieData(drug) {
  if (!drug.receptorKi) return null;
  const ki = drug.receptorKi;
  const receptors = Object.keys(ki).filter(r => ki[r] < 5000);
  if (receptors.length === 0) return null;
  const raw = receptors.map(r => 1 / ki[r]);
  const sum = raw.reduce((a, b) => a + b, 0);
  return {
    labels: receptors,
    values: raw.map(v => (v / sum) * 100),
    kiValues: receptors.map(r => ki[r])
  };
}

function getColor(receptor) {
  return RECEPTOR_COLORS[receptor] || '#64748b';
}

/* ── Navigation ─────────────────────────────────────────────────────────── */
function switchSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const sec = document.getElementById(id);
  if (sec) sec.classList.add('active');
  const link = document.querySelector(`[data-section="${id}"]`);
  if (link) link.classList.add('active');

  // Lazy-render charts when section becomes active
  if (id === 'receptor-binding') renderBarChart();
}

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    switchSection(link.dataset.section);
  });
});

/* ── Class Filter (sidebar checkboxes) ─────────────────────────────────── */
let activeClasses = new Set(MEDICATIONS.map(m => m.class));

document.querySelectorAll('.class-filter').forEach(cb => {
  cb.addEventListener('change', () => {
    activeClasses = new Set(
      [...document.querySelectorAll('.class-filter:checked')].map(c => c.value)
    );
    renderDrugTable();
    renderP450Table();
  });
});

/* ── Overview Stats ─────────────────────────────────────────────────────── */
function renderStats() {
  const stats = [
    { label: 'Total Medications', value: MEDICATIONS.length },
    { label: 'Antidepressants',   value: MEDICATIONS.filter(m => m.category === 'Antidepressant').length },
    { label: 'Antipsychotics',    value: MEDICATIONS.filter(m => m.category === 'Antipsychotic').length },
    { label: 'Mood Stabilizers',  value: MEDICATIONS.filter(m => m.category === 'Mood Stabilizer').length },
    { label: 'Sleep Medications', value: MEDICATIONS.filter(m => m.category === 'Sleep').length },
    { label: 'QT Prolonging',     value: MEDICATIONS.filter(m => m.qtInterval).length },
  ];
  document.getElementById('stats-grid').innerHTML = stats.map(s =>
    `<div class="stat-card"><div class="stat-value">${s.value}</div><div class="stat-label">${s.label}</div></div>`
  ).join('');
}

/* ── Quick Search (overview) ────────────────────────────────────────────── */
function initQuickSearch() {
  const input = document.getElementById('quick-search');
  const dropdown = document.getElementById('search-results');

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { dropdown.innerHTML = ''; return; }
    const matches = MEDICATIONS.filter(m =>
      m.name.toLowerCase().includes(q) || m.brandName.toLowerCase().includes(q) ||
      m.class.toLowerCase().includes(q)
    ).slice(0, 8);

    dropdown.innerHTML = matches.map(m => `
      <div class="search-result-item" data-id="${m.id}">
        <div class="drug-name">${m.name} <span class="brand-name">(${m.brandName})</span></div>
        <div class="drug-meta">${m.class} &bull; ${m.category}</div>
      </div>
    `).join('') || '<div class="search-result-item"><div class="drug-meta">No results</div></div>';
  });

  dropdown.addEventListener('click', e => {
    const item = e.target.closest('.search-result-item');
    if (!item?.dataset.id) return;
    input.value = '';
    dropdown.innerHTML = '';
    openDrugModal(item.dataset.id);
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.overview-search')) dropdown.innerHTML = '';
  });
}

/* ── Drug Modal ─────────────────────────────────────────────────────────── */
function openDrugModal(id) {
  const drug = MEDICATIONS.find(m => m.id === id);
  if (!drug) return;

  const modal  = document.getElementById('drug-modal');
  const body   = document.getElementById('modal-body');

  const p450Lines = P450_ENZYMES.map(e => {
    const parts = [];
    if (drug.p450.substrate?.includes(e)) parts.push('<span class="badge badge-substrate">Substrate</span>');
    if (drug.p450.inhibits?.[e])  parts.push(`<span class="badge badge-${drug.p450.inhibits[e]}">Inhibitor (${drug.p450.inhibits[e]})</span>`);
    if (drug.p450.induces?.includes(e)) parts.push('<span class="badge badge-inducer">Inducer</span>');
    if (!parts.length) return '';
    return `<div style="margin-bottom:4px"><strong>${e}:</strong> ${parts.join(' ')}</div>`;
  }).filter(Boolean).join('') || '<span style="color:var(--text-muted)">No significant P450 interactions</span>';

  body.innerHTML = `
    <div class="modal-drug-name">${drug.name}</div>
    <div class="modal-brand">${drug.brandName} &bull; ${classBadge(drug.class)}</div>

    <div class="modal-section">
      <h4>Pharmacokinetics</h4>
      <div class="modal-row">
        <div class="modal-field"><label>Half-Life (Parent)</label><div>${drug.halfLife.drug}</div></div>
        <div class="modal-field"><label>Active Metabolites</label><div>${drug.halfLife.metabolites}</div></div>
      </div>
      <div class="modal-row">
        <div class="modal-field"><label>Protein Binding</label><div>${drug.proteinBinding != null ? drug.proteinBinding + '%' : 'N/A'}</div></div>
        <div class="modal-field"><label>Active Enantiomer</label><div>${drug.activeEnantiomer.has ? '✓ ' + drug.activeEnantiomer.name : '—'}</div></div>
      </div>
    </div>

    <div class="modal-section">
      <h4>P450 Interactions</h4>
      ${p450Lines}
    </div>

    <div class="modal-section">
      <h4>Dosing Considerations</h4>
      <div class="modal-row">
        <div class="modal-field"><label>Renal Impairment</label><div>${drug.renalImpairment.modified ? `<span class="modified-yes">Requires adjustment</span><br><small>${[drug.renalImpairment.moderate && 'Moderate: '+drug.renalImpairment.moderate, drug.renalImpairment.severe && 'Severe: '+drug.renalImpairment.severe].filter(Boolean).join('<br>')}</small>` : '<span class="no-badge">No adjustment needed</span>'}</div></div>
        <div class="modal-field"><label>Hepatic Impairment</label><div>${drug.hepaticImpairment.modified ? `<span class="modified-yes">Requires adjustment</span><br><small>${drug.hepaticImpairment.notes}</small>` : '<span class="no-badge">No adjustment needed</span>'}</div></div>
      </div>
      <div class="modal-row">
        <div class="modal-field"><label>Geriatric Dosing</label><div>${drug.geriatricDosing.modified ? `<span class="modified-yes">Modified</span><br><small>${drug.geriatricDosing.notes}</small>` : '<span class="no-badge">No specific change</span>'}</div></div>
        <div class="modal-field"><label>QT Prolongation</label><div>${drug.qtInterval ? '<span class="yes-badge">Yes – monitor ECG</span>' : '<span class="no-badge">Not significant</span>'}</div></div>
      </div>
    </div>

    <div class="modal-section">
      <h4>Pre / Post-Synaptic Binding</h4>
      <div class="modal-syn-list">${synapticModalHTML(drug.id)}</div>
    </div>

    ${drug.mechanism ? `<div class="modal-section"><h4>Mechanism</h4><div style="font-size:13px;color:var(--text-muted);line-height:1.7">${drug.mechanism}</div></div>` : ''}
  `;

  modal.classList.remove('hidden');
}

document.getElementById('modal-close').addEventListener('click', () => {
  document.getElementById('drug-modal').classList.add('hidden');
});
document.getElementById('drug-modal').addEventListener('click', e => {
  if (e.target === e.currentTarget) e.currentTarget.classList.add('hidden');
});

/* ── Synaptic Binding Helpers ───────────────────────────────────────────── */
const LOC_META = {
  pre:  { label: 'PRE',  cls: 'syn-pre',  title: 'Pre-synaptic' },
  post: { label: 'POST', cls: 'syn-post', title: 'Post-synaptic' },
  both: { label: 'BOTH', cls: 'syn-both', title: 'Pre- & Post-synaptic' },
};

function synapticCell(drugId) {
  const entries = SYNAPTIC_BINDING[drugId];
  if (!entries || !entries.length) return '<span class="no-badge">—</span>';
  return entries.map(e => {
    const m = LOC_META[e.loc];
    return `<div class="syn-row" title="${e.detail}">
      <span class="syn-badge ${m.cls}">${m.label}</span>
      <span class="syn-targets">${e.label}</span>
    </div>`;
  }).join('');
}

function synapticModalHTML(drugId) {
  const entries = SYNAPTIC_BINDING[drugId];
  if (!entries || !entries.length) return '<span style="color:var(--text-muted)">No synaptic location data available</span>';
  return entries.map(e => {
    const m = LOC_META[e.loc];
    return `<div class="modal-syn-row">
      <span class="syn-badge ${m.cls}">${m.title}</span>
      <div>
        <div style="font-weight:600;font-size:13px;margin-bottom:2px">${e.label}</div>
        <div style="font-size:12px;color:var(--text-muted);line-height:1.5">${e.detail}</div>
      </div>
    </div>`;
  }).join('');
}

/* ── Drug Database Table ────────────────────────────────────────────────── */
let sortCol = 'name';
let sortDir = 1;
let tableSearch = '';
let categoryFilter = '';
let sideEffectSort = ''; // key into SIDE_EFFECT_PROFILES, or ''

function visibleMeds() {
  const filtered = MEDICATIONS.filter(m => {
    if (!activeClasses.has(m.class)) return false;
    if (categoryFilter && m.category !== categoryFilter) return false;
    if (tableSearch) {
      const q = tableSearch.toLowerCase();
      return m.name.toLowerCase().includes(q) || m.brandName.toLowerCase().includes(q) || m.class.toLowerCase().includes(q);
    }
    return true;
  });

  if (sideEffectSort) {
    // Sort by side effect risk score; nulls (no Ki data) go to the end
    return filtered.sort((a, b) => {
      const sa = sideEffectScore(a, sideEffectSort);
      const sb = sideEffectScore(b, sideEffectSort);
      if (sa === null && sb === null) return a.name.localeCompare(b.name);
      if (sa === null) return 1;
      if (sb === null) return -1;
      return sortDir * (sa - sb);
    });
  }

  return filtered.sort((a, b) => {
    let av = a[sortCol] ?? '';
    let bv = b[sortCol] ?? '';
    if (typeof av === 'string') av = av.toLowerCase();
    if (typeof bv === 'string') bv = bv.toLowerCase();
    if (av < bv) return -sortDir;
    if (av > bv) return  sortDir;
    return 0;
  });
}

function renderDrugTable() {
  const meds  = visibleMeds();
  const tbody = document.getElementById('main-tbody');
  const showSE = !!sideEffectSort;
  const colCount = showSE ? 14 : 13;

  tbody.innerHTML = meds.map(m => {
    const renal = m.renalImpairment.modified
      ? `<span class="modified-yes">Yes</span>`
      : `<span class="no-badge">No</span>`;
    const hepatic = m.hepaticImpairment.modified
      ? `<span class="modified-yes">Yes</span>`
      : `<span class="no-badge">No</span>`;
    const geriatric = m.geriatricDosing.modified
      ? `<span class="modified-yes">Yes</span>`
      : `<span class="no-badge">No</span>`;
    const qt = m.qtInterval
      ? `<span class="yes-badge">Yes</span>`
      : `<span class="no-badge">No</span>`;
    const pb = m.proteinBinding != null ? m.proteinBinding + '%' : '—';
    const enan = m.activeEnantiomer.has
      ? `<span style="color:var(--accent)">Yes</span>`
      : `<span class="no-badge">No</span>`;

    const chartBtn = m.receptorKi
      ? `<button class="chart-btn" data-id="${m.id}" onclick="jumpToReceptorChart('${m.id}')">View Chart</button>`
      : `<span class="no-badge">${m.mechanism ? 'See mechanism' : '—'}</span>`;

    const synapticHTML = synapticCell(m.id);

    let seCell = '';
    if (showSE) {
      const score = sideEffectScore(m, sideEffectSort);
      const risk = riskLabel(score);
      seCell = risk
        ? `<td><span class="risk-badge ${risk.cls}">${risk.text}</span><span class="risk-score">${score}</span></td>`
        : `<td><span class="no-badge">N/A</span></td>`;
    }

    return `<tr>
      ${seCell}
      <td class="drug-name-cell" style="cursor:pointer" onclick="openDrugModal('${m.id}')">${m.name}</td>
      <td class="brand-name">${m.brandName}</td>
      <td>${classBadge(m.class)}</td>
      <td>${enan}</td>
      <td style="white-space:nowrap">${m.halfLife.drug}</td>
      <td style="font-size:12px;color:var(--text-muted)">${m.halfLife.metabolites}</td>
      <td>${renal}</td>
      <td>${hepatic}</td>
      <td>${geriatric}</td>
      <td>${qt}</td>
      <td>${pb}</td>
      <td>${synapticHTML}</td>
      <td>${chartBtn}</td>
    </tr>`;
  }).join('') || `<tr><td colspan="${colCount}" style="text-align:center;padding:24px;color:var(--text-muted)">No medications match current filters.</td></tr>`;

  // Show/hide the SE risk column header
  const seHeader = document.getElementById('th-se-risk');
  seHeader.style.display = showSE ? '' : 'none';
  if (showSE) {
    const profile = SIDE_EFFECT_PROFILES[sideEffectSort];
    seHeader.textContent = profile.label + ' Risk';
  }

  // Update sort arrows
  document.querySelectorAll('th.sortable').forEach(th => {
    th.classList.remove('sort-asc', 'sort-desc');
    if (!sideEffectSort && th.dataset.col === sortCol) {
      th.classList.add(sortDir === 1 ? 'sort-asc' : 'sort-desc');
    }
  });

  // Update SE sort direction indicator
  const seBtn = document.getElementById('se-sort-dir');
  if (seBtn) seBtn.textContent = sortDir === 1 ? 'Least → Most risky' : 'Most → Least risky';
}

// Sorting
document.querySelectorAll('th.sortable').forEach(th => {
  th.addEventListener('click', () => {
    if (sortCol === th.dataset.col) sortDir *= -1;
    else { sortCol = th.dataset.col; sortDir = 1; }
    renderDrugTable();
  });
});

// Search
document.getElementById('table-search').addEventListener('input', e => {
  tableSearch = e.target.value;
  renderDrugTable();
});

// Category filter
document.getElementById('category-filter').addEventListener('change', e => {
  categoryFilter = e.target.value;
  renderDrugTable();
});

// Side effect sort dropdown
document.getElementById('se-sort').addEventListener('change', e => {
  sideEffectSort = e.target.value;
  sortDir = 1; // default least → most risky
  document.getElementById('se-sort-dir').style.display = sideEffectSort ? '' : 'none';
  renderDrugTable();
});

// Side effect sort direction toggle
document.getElementById('se-sort-dir').addEventListener('click', () => {
  if (!sideEffectSort) return;
  sortDir *= -1;
  renderDrugTable();
});

// P450 category filter
document.getElementById('p450-category').addEventListener('change', e => {
  renderP450Table(e.target.value);
});

/* ── P450 Table ─────────────────────────────────────────────────────────── */
function p450Cell(drug, enzyme) {
  const parts = [];
  if (drug.p450.substrate?.includes(enzyme))
    parts.push('<span class="badge badge-substrate">S</span>');
  if (drug.p450.inhibits?.[enzyme]) {
    const str = drug.p450.inhibits[enzyme];
    const cls = str === 'strong' ? 'strong' : str === 'moderate' ? 'moderate' : 'weak';
    const label = str === 'strong' ? 'Inh-S' : str === 'moderate' ? 'Inh-M' : 'Inh-W';
    parts.push(`<span class="badge badge-${cls}">${label}</span>`);
  }
  if (drug.p450.induces?.includes(enzyme))
    parts.push('<span class="badge badge-inducer">Ind</span>');
  return parts.length ? parts.join(' ') : `<span style="color:var(--border)">—</span>`;
}

function renderP450Table(catFilter = '') {
  let meds = MEDICATIONS.filter(m => activeClasses.has(m.class));
  if (catFilter) meds = meds.filter(m => m.category === catFilter);

  document.getElementById('p450-tbody').innerHTML = meds.map(m => `
    <tr>
      <td class="drug-name-cell" style="cursor:pointer;white-space:nowrap" onclick="openDrugModal('${m.id}')">${m.name}</td>
      <td>${classBadge(m.class)}</td>
      ${P450_ENZYMES.map(e => `<td class="p450-cell">${p450Cell(m, e)}</td>`).join('')}
    </tr>
  `).join('');
}

/* ── Drug Selector for Receptor Charts ──────────────────────────────────── */
function populateDrugSelect() {
  const sel = document.getElementById('drug-select');
  const groups = {};
  MEDICATIONS.forEach(m => {
    if (!groups[m.category]) groups[m.category] = [];
    groups[m.category].push(m);
  });
  sel.innerHTML = '<option value="">-- Choose a drug --</option>' +
    Object.entries(groups).map(([cat, meds]) =>
      `<optgroup label="${cat}">${meds.map(m =>
        `<option value="${m.id}">${m.name} (${m.brandName})</option>`
      ).join('')}</optgroup>`
    ).join('');
}

let pieChartInst = null;

function renderPieChart(drug) {
  const container = document.getElementById('pie-container');
  const noData    = document.getElementById('no-receptor-data');

  if (!drug.receptorKi) {
    container.classList.add('hidden');
    noData.classList.remove('hidden');
    noData.innerHTML = `<strong>${drug.name}</strong> — ${drug.mechanism || 'No receptor binding data available for this medication.'}`;
    return;
  }

  const data = receptorPieData(drug);
  if (!data) {
    container.classList.add('hidden');
    noData.classList.remove('hidden');
    noData.innerHTML = `<strong>${drug.name}</strong> — No significant receptor affinity data (Ki ≥ 5000 nM for all receptors).`;
    return;
  }

  noData.classList.add('hidden');
  container.classList.remove('hidden');

  // Header info
  document.getElementById('pie-drug-info').innerHTML = `
    <h3>${drug.name} <span style="font-weight:400;font-size:16px;color:var(--text-muted)">(${drug.brandName})</span></h3>
    <p>${classBadge(drug.class)} &bull; Relative receptor affinity (1/Ki normalized). Only receptors with Ki &lt; 5000 nM shown.</p>
  `;

  // Ki table
  const allReceptors = Object.keys(drug.receptorKi).sort((a, b) => drug.receptorKi[a] - drug.receptorKi[b]);
  document.getElementById('ki-tbody').innerHTML = allReceptors.map(r => {
    const ki = drug.receptorKi[r];
    const pkiVal = ki < 10000 ? (-Math.log10(ki)).toFixed(2) : null;
    const barW = ki < 10000 ? Math.min(100, ((-Math.log10(ki)) / 11) * 100) : 0;
    const color = getColor(r);
    const actBadge = ki < 10000 ? actionBadge(drug.id, r) : '<span style="color:var(--text-muted)">—</span>';
    return `<tr>
      <td><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${color};margin-right:6px;vertical-align:middle"></span>${r}</td>
      <td>${ki >= 10000 ? '>10,000' : ki.toLocaleString()}</td>
      <td>${actBadge}</td>
      <td>
        <span class="affinity-bar" style="width:${barW}px;background:${color}"></span>
        <span class="affinity-label">${affinityLabel(ki)} ${pkiVal ? '(pKi '+pkiVal+')' : ''}</span>
      </td>
    </tr>`;
  }).join('');

  // Pie chart
  const colors = data.labels.map(r => getColor(r));
  const ctx = document.getElementById('pie-chart').getContext('2d');
  if (pieChartInst) { pieChartInst.destroy(); pieChartInst = null; }
  pieChartInst = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: data.labels,
      datasets: [{ data: data.values, backgroundColor: colors, borderColor: '#f5f0e8', borderWidth: 2 }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#6b6050', font: { size: 11 }, padding: 10 }
        },
        tooltip: {
          callbacks: {
            label: ctx => {
              const r      = ctx.label;
              const ki     = drug.receptorKi[r];
              const action = getReceptorAction(drug.id, r);
              return ` ${r}: Ki = ${ki} nM | ${action} (${ctx.parsed.toFixed(1)}%)`;
            }
          }
        }
      }
    }
  });
}

document.getElementById('drug-select').addEventListener('change', e => {
  const drug = MEDICATIONS.find(m => m.id === e.target.value);
  if (drug) renderPieChart(drug);
  else {
    document.getElementById('pie-container').classList.add('hidden');
    document.getElementById('no-receptor-data').classList.add('hidden');
  }
});

/* ── Class Bar Chart ────────────────────────────────────────────────────── */
let barChartInst = null;
let activeReceptors = new Set(RECEPTOR_LIST);

function renderReceptorToggles() {
  const wrap = document.getElementById('receptor-toggles');
  wrap.innerHTML = RECEPTOR_LIST.map(r => {
    const color = getColor(r);
    return `<button class="receptor-toggle-btn active" data-receptor="${r}"
      style="background:${color}22;color:${color};border-color:${color}66"
      onclick="toggleReceptor('${r}',this)">${r}</button>`;
  }).join('');
}

function toggleReceptor(receptor, btn) {
  if (activeReceptors.has(receptor)) {
    activeReceptors.delete(receptor);
    btn.classList.remove('active');
  } else {
    activeReceptors.add(receptor);
    btn.classList.add('active');
  }
  renderBarChart();
}

function renderBarChart() {
  const cls  = document.getElementById('class-select').value;
  const meds = MEDICATIONS.filter(m => m.class === cls && m.receptorKi);
  const receptors = RECEPTOR_LIST.filter(r => activeReceptors.has(r));

  if (!meds.length || !receptors.length) return;

  const ctx = document.getElementById('bar-chart').getContext('2d');
  if (barChartInst) { barChartInst.destroy(); barChartInst = null; }

  barChartInst = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: meds.map(m => m.name),
      datasets: receptors.map(r => ({
        label: r,
        data: meds.map(m => {
          const ki = m.receptorKi?.[r];
          return (ki && ki < 10000) ? parseFloat((9 - Math.log10(ki)).toFixed(2)) : null;
        }),
        backgroundColor: getColor(r) + 'cc',
        borderColor: getColor(r),
        borderWidth: 1,
        borderRadius: 3,
      }))
    },
    options: {
      responsive: true,
      scales: {
        x: {
          ticks: { color: '#6b6050', font: { size: 12 } },
          grid: { color: '#e2dbd0' }
        },
        y: {
          min: 4,
          title: {
            display: true,
            text: 'pKi (−log₁₀ Ki nM) — Higher = Stronger Affinity',
            color: '#6b6050',
            font: { size: 12 }
          },
          ticks: { color: '#6b6050', font: { size: 11 } },
          grid: { color: '#e2dbd0' }
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#6b6050', font: { size: 11 }, padding: 10, boxWidth: 14 }
        },
        tooltip: {
          callbacks: {
            label: ctx => {
              const drug   = meds[ctx.dataIndex];
              const r      = ctx.dataset.label;
              const ki     = drug.receptorKi?.[r];
              const action = ki ? getReceptorAction(drug.id, r) : null;
              return ki ? ` ${r}: pKi ${ctx.parsed.y.toFixed(2)} (Ki = ${ki} nM) | ${action}` : null;
            }
          }
        }
      }
    }
  });
}

document.getElementById('class-select').addEventListener('change', renderBarChart);

/* ── Side-by-Side Drug Comparison ───────────────────────────────────────── */
let compareChartInst = null;

function populateCompareSelects() {
  const sorted = [...MEDICATIONS].filter(m => m.receptorKi).sort((a,b) => a.name.localeCompare(b.name));
  const opts = sorted.map(m => `<option value="${m.id}">${m.name} (${m.class})</option>`).join('');
  document.getElementById('compare-a').innerHTML = '<option value="">-- Select drug --</option>' + opts;
  document.getElementById('compare-b').innerHTML = '<option value="">-- Select drug --</option>' + opts;
}

function renderCompareChart() {
  const idA = document.getElementById('compare-a').value;
  const idB = document.getElementById('compare-b').value;
  const container = document.getElementById('compare-container');
  const empty     = document.getElementById('compare-empty');

  if (!idA || !idB) {
    container.classList.add('hidden');
    empty.classList.toggle('hidden', !idA && !idB);
    if (compareChartInst) { compareChartInst.destroy(); compareChartInst = null; }
    return;
  }

  const drugA = MEDICATIONS.find(m => m.id === idA);
  const drugB = MEDICATIONS.find(m => m.id === idB);
  if (!drugA?.receptorKi || !drugB?.receptorKi) return;

  // Only receptors where at least one drug has meaningful affinity
  const receptors = RECEPTOR_LIST.filter(r =>
    (drugA.receptorKi[r] && drugA.receptorKi[r] < 10000) ||
    (drugB.receptorKi[r] && drugB.receptorKi[r] < 10000)
  );

  const toBar = (drug, r) => {
    const ki = drug.receptorKi?.[r];
    return (ki && ki < 10000) ? parseFloat((9 - Math.log10(ki)).toFixed(2)) : null;
  };

  container.classList.remove('hidden');
  empty.classList.add('hidden');

  const ctx = document.getElementById('compare-chart').getContext('2d');
  if (compareChartInst) { compareChartInst.destroy(); compareChartInst = null; }

  const colorA = '#4a7c35';
  const colorB = '#8b6914';

  compareChartInst = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: receptors,
      datasets: [
        {
          label: drugA.name,
          data: receptors.map(r => toBar(drugA, r)),
          backgroundColor: colorA + 'cc',
          borderColor: colorA,
          borderWidth: 1,
          borderRadius: 3,
        },
        {
          label: drugB.name,
          data: receptors.map(r => toBar(drugB, r)),
          backgroundColor: colorB + 'cc',
          borderColor: colorB,
          borderWidth: 1,
          borderRadius: 3,
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          ticks: { color: '#6b6050', font: { size: 12 } },
          grid:  { color: '#e2dbd0' }
        },
        y: {
          min: 4,
          title: { display: true, text: 'pKi (−log₁₀ Ki nM) — Higher = Stronger Affinity', color: '#6b6050', font: { size: 12 } },
          ticks: { color: '#6b6050', font: { size: 11 } },
          grid:  { color: '#e2dbd0' }
        }
      },
      plugins: {
        legend: { position: 'top', labels: { color: '#6b6050', font: { size: 12 }, padding: 16, boxWidth: 14 } },
        tooltip: {
          callbacks: {
            label: ctx => {
              const drug   = ctx.datasetIndex === 0 ? drugA : drugB;
              const r      = receptors[ctx.dataIndex];
              const ki     = drug.receptorKi?.[r];
              const action = ki ? getReceptorAction(drug.id, r) : null;
              return ki ? ` ${drug.name} — ${r}: pKi ${ctx.parsed.y.toFixed(2)} (Ki = ${ki} nM) | ${action}` : null;
            }
          }
        }
      }
    }
  });

  // Render comparison table
  renderCompareTable(drugA, drugB);
}

function renderCompareTable(drugA, drugB) {
  const allReceptors = RECEPTOR_LIST.filter(r =>
    (drugA.receptorKi?.[r] || drugB.receptorKi?.[r])
  );

  const rows = allReceptors.map(r => {
    const kiA = drugA.receptorKi?.[r];
    const kiB = drugB.receptorKi?.[r];
    const fmt = (ki, drugId) => {
      if (!ki || ki >= 10000) return '<span style="color:var(--text-muted)">—</span>';
      const actB = actionBadge(drugId, r);
      return `<div>${ki} nM <span style="color:var(--text-muted);font-size:11px">(${affinityLabel(ki)})</span></div><div style="margin-top:3px">${actB}</div>`;
    };
    const highlight = (kiA && kiB && kiA < 10000 && kiB < 10000)
      ? (kiA < kiB ? 'compare-win-a' : kiA > kiB ? 'compare-win-b' : '')
      : '';
    return `<tr class="${highlight}">
      <td class="compare-receptor-cell"><span class="receptor-dot" style="background:${getColor(r)}"></span>${r}</td>
      <td>${fmt(kiA, drugA.id)}</td>
      <td>${fmt(kiB, drugB.id)}</td>
    </tr>`;
  }).join('');

  document.getElementById('compare-table-wrap').innerHTML = `
    <table class="compare-table">
      <thead>
        <tr>
          <th>Receptor</th>
          <th style="color:#4a7c35">${drugA.name}</th>
          <th style="color:#8b6914">${drugB.name}</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

document.getElementById('compare-a').addEventListener('change', renderCompareChart);
document.getElementById('compare-b').addEventListener('change', renderCompareChart);

/* ── Jump from Drug Table to Receptor Chart ─────────────────────────────── */
function jumpToReceptorChart(drugId) {
  switchSection('receptor-binding');
  const sel = document.getElementById('drug-select');
  sel.value = drugId;
  const drug = MEDICATIONS.find(m => m.id === drugId);
  if (drug) renderPieChart(drug);
}

/* ── Receptor Glossary ──────────────────────────────────────────────────── */
let glossarySearch = '';

function renderGlossaryTypeFilters() {
  const types = [...new Set(RECEPTOR_GLOSSARY.map(r => r.type.split(' (')[0]))];
  const wrap = document.getElementById('glossary-type-filters');
  wrap.innerHTML = types.map(t =>
    `<button class="gtype-btn active" data-type="${t}">${t}</button>`
  ).join('');
  wrap.querySelectorAll('.gtype-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      renderGlossary();
    });
  });
}

function activeGlossaryTypes() {
  return new Set(
    [...document.querySelectorAll('.gtype-btn.active')].map(b => b.dataset.type)
  );
}

function glossaryMatchesSearch(entry, q) {
  if (!q) return true;
  const haystack = [
    entry.receptor, entry.fullName, entry.type, entry.description,
    ...entry.actions.flatMap(a => [
      a.action,
      ...a.drugExamples,
      ...a.benefits,
      ...a.sideEffects
    ])
  ].join(' ').toLowerCase();
  return haystack.includes(q);
}

function highlight(text, q) {
  if (!q) return text;
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(re, '<mark>$1</mark>');
}

function renderGlossary() {
  const q      = glossarySearch.toLowerCase();
  const types  = activeGlossaryTypes();
  const grid   = document.getElementById('glossary-grid');

  const entries = RECEPTOR_GLOSSARY.filter(entry => {
    const typeKey = entry.type.split(' (')[0];
    return types.has(typeKey) && glossaryMatchesSearch(entry, q);
  });

  if (!entries.length) {
    grid.innerHTML = `<div class="glossary-empty">No receptors match your search.</div>`;
    return;
  }

  grid.innerHTML = entries.map(entry => {
    const actionsHTML = entry.actions.map(action => `
      <div class="glossary-action">
        <div class="glossary-action-title">
          <span class="action-tag">${highlight(action.action, q)}</span>
          <span class="action-drugs">${action.drugExamples.map(d => `<span class="drug-chip">${highlight(d, q)}</span>`).join('')}</span>
        </div>
        <div class="glossary-columns">
          <div class="glossary-col benefits-col">
            <div class="col-header benefit-header">Benefits / Therapeutic Uses</div>
            <ul>${action.benefits.map(b => `<li>${highlight(b, q)}</li>`).join('')}</ul>
          </div>
          <div class="glossary-col effects-col">
            <div class="col-header effect-header">Side Effects / Risks</div>
            <ul>${action.sideEffects.map(s => `<li>${highlight(s, q)}</li>`).join('')}</ul>
          </div>
        </div>
      </div>
    `).join('');

    return `
      <div class="glossary-card" id="glossary-${entry.receptor}">
        <div class="glossary-card-header" onclick="toggleGlossaryCard('${entry.receptor}')">
          <div class="glossary-receptor-name">
            <span class="receptor-dot" style="background:${entry.color}"></span>
            <span class="receptor-symbol">${entry.receptor}</span>
            <span class="receptor-fullname">${entry.fullName}</span>
          </div>
          <div class="glossary-meta">
            <span class="receptor-type-badge">${entry.type.split(' (')[0]}</span>
            <span class="glossary-chevron" id="chev-${entry.receptor}">&#9660;</span>
          </div>
        </div>
        <div class="glossary-card-body" id="body-${entry.receptor}">
          <p class="glossary-description">${highlight(entry.description, q)}</p>
          ${actionsHTML}
        </div>
      </div>`;
  }).join('');

  // If searching, expand all cards
  if (q) {
    document.querySelectorAll('.glossary-card-body').forEach(b => b.classList.add('open'));
    document.querySelectorAll('.glossary-chevron').forEach(c => c.classList.add('rotated'));
  }
}

function toggleGlossaryCard(receptor) {
  const body = document.getElementById(`body-${receptor}`);
  const chev = document.getElementById(`chev-${receptor}`);
  body.classList.toggle('open');
  chev.classList.toggle('rotated');
}

document.getElementById('glossary-search').addEventListener('input', e => {
  glossarySearch = e.target.value.trim();
  renderGlossary();
});

/* ── Clinical Warning ───────────────────────────────────────────────────── */
function dismissWarning() {
  document.getElementById('warning-modal').classList.add('hidden');
}

/* ── FDA Reference Search ───────────────────────────────────────────────── */
function initFDASearch() {
  const wrap = document.getElementById('fda-quick-links');
  const sorted = [...MEDICATIONS].sort((a,b) => a.name.localeCompare(b.name));

  function renderLinks(filter) {
    const filtered = filter ? sorted.filter(m => m.name.toLowerCase().includes(filter.toLowerCase())) : sorted;
    wrap.innerHTML = filtered.map(m => {
      const url = `https://www.accessdata.fda.gov/scripts/cder/daf/index.cfm?event=BasicSearch.process&query=${encodeURIComponent(m.name)}`;
      return `<a href="${url}" target="_blank" rel="noopener" class="fda-link-btn">${m.name} ↗</a>`;
    }).join('');
  }

  renderLinks('');

  document.getElementById('fda-filter').addEventListener('input', e => {
    renderLinks(e.target.value.trim());
  });
}

/* ── QT Risk Tool ───────────────────────────────────────────────────────── */

// Non-psychiatric medications with QT prolongation risk.
// Risk tiers based on CredibleMeds / AZCERT classifications and published literature.
const QT_NONPSYCH_DRUGS = [
  // ── Antibiotics ────────────────────────────────────────────────────────
  { category: 'Antibiotics', name: 'Azithromycin (Zithromax)', risk: 'known', notes: 'Dose-dependent; IV route higher risk. Use with caution in cardiac patients.' },
  { category: 'Antibiotics', name: 'Clarithromycin (Biaxin)', risk: 'known', notes: 'Significant QT prolongation, particularly with CYP3A4 inhibitors.' },
  { category: 'Antibiotics', name: 'Erythromycin', risk: 'known', notes: 'IV formulation highest risk. Well-established TdP risk.' },
  { category: 'Antibiotics', name: 'Moxifloxacin (Avelox)', risk: 'known', notes: 'Fluoroquinolone with highest QT risk in class.' },
  { category: 'Antibiotics', name: 'Levofloxacin (Levaquin)', risk: 'conditional', notes: 'QT risk higher with hypokalemia, renal impairment, or concurrent QT drugs.' },
  { category: 'Antibiotics', name: 'Ciprofloxacin (Cipro)', risk: 'conditional', notes: 'Lower risk than moxifloxacin/levofloxacin; caution in high-risk patients.' },
  { category: 'Antibiotics', name: 'Trimethoprim-Sulfamethoxazole (Bactrim)', risk: 'conditional', notes: 'Risk increases with renal impairment and when combined with other QT drugs.' },
  { category: 'Antibiotics', name: 'Clindamycin (Cleocin)', risk: 'possible', notes: 'Rare case reports; generally low risk in otherwise healthy patients.' },

  // ── Antifungals ─────────────────────────────────────────────────────────
  { category: 'Antifungals', name: 'Fluconazole (Diflucan)', risk: 'known', notes: 'CYP3A4 inhibitor — markedly increases levels of co-administered QT drugs. Dose-dependent QT effect.' },
  { category: 'Antifungals', name: 'Voriconazole (Vfend)', risk: 'known', notes: 'Strong CYP inhibitor. Avoid with other QT-prolonging agents.' },
  { category: 'Antifungals', name: 'Itraconazole (Sporanox)', risk: 'possible', notes: 'CYP3A4 inhibitor; indirect risk via increased drug levels.' },
  { category: 'Antifungals', name: 'Ketoconazole', risk: 'known', notes: 'Strong CYP3A4 inhibitor; significantly increases QT-prolonging drug concentrations.' },

  // ── Antimalarials / Antiparasitics ──────────────────────────────────────
  { category: 'Antimalarials / Antiparasitics', name: 'Hydroxychloroquine (Plaquenil)', risk: 'known', notes: 'Risk increases with higher doses, renal impairment, or concurrent QT drugs.' },
  { category: 'Antimalarials / Antiparasitics', name: 'Chloroquine', risk: 'known', notes: 'Greater QT risk than hydroxychloroquine at equivalent doses.' },
  { category: 'Antimalarials / Antiparasitics', name: 'Quinine', risk: 'known', notes: 'Class Ia-like cardiac effects; significant TdP risk.' },

  // ── Cardiac Drugs ───────────────────────────────────────────────────────
  { category: 'Cardiac / Antiarrhythmics', name: 'Amiodarone (Cordarone, Pacerone)', risk: 'known', notes: 'Paradoxically low TdP rate despite QTc prolongation due to multichannel blockade; still monitor.' },
  { category: 'Cardiac / Antiarrhythmics', name: 'Sotalol (Betapace)', risk: 'known', notes: 'Beta-blocker + K+ channel blocker. Major TdP risk, especially with renal impairment.' },
  { category: 'Cardiac / Antiarrhythmics', name: 'Quinidine', risk: 'known', notes: 'Classic class Ia agent; one of the highest TdP risks of any antiarrhythmic.' },
  { category: 'Cardiac / Antiarrhythmics', name: 'Procainamide (Procanbid)', risk: 'known', notes: 'Class Ia; active metabolite NAPA also prolongs QTc.' },
  { category: 'Cardiac / Antiarrhythmics', name: 'Disopyramide (Norpace)', risk: 'known', notes: 'Class Ia; additionally has anticholinergic effects.' },
  { category: 'Cardiac / Antiarrhythmics', name: 'Dofetilide (Tikosyn)', risk: 'known', notes: 'Restricted distribution; requires hospitalized initiation and QTc monitoring.' },
  { category: 'Cardiac / Antiarrhythmics', name: 'Dronedarone (Multaq)', risk: 'known', notes: 'Non-iodinated amiodarone analogue; QTc prolongation without iodine toxicity.' },
  { category: 'Cardiac / Antiarrhythmics', name: 'Ibutilide (Corvert)', risk: 'known', notes: 'IV only; high TdP rate (up to 8%) — requires monitored setting.' },
  { category: 'Cardiac / Antiarrhythmics', name: 'Flecainide (Tambocor)', risk: 'possible', notes: 'QRS widening more than QT; risk in structural heart disease.' },

  // ── GI Medications ──────────────────────────────────────────────────────
  { category: 'GI Medications', name: 'Ondansetron (Zofran)', risk: 'known', notes: 'Dose-dependent. IV 32 mg single dose withdrawn from market due to QTc. Max IV 16 mg per dose.' },
  { category: 'GI Medications', name: 'Granisetron (Kytril)', risk: 'conditional', notes: 'Less well-documented than ondansetron; caution in high-risk patients.' },
  { category: 'GI Medications', name: 'Metoclopramide (Reglan)', risk: 'conditional', notes: 'D2 antagonist with QT risk; also causes EPS with prolonged use.' },
  { category: 'GI Medications', name: 'Domperidone', risk: 'known', notes: 'Not available in US; significant QT risk; associated with sudden cardiac death.' },
  { category: 'GI Medications', name: 'Pantoprazole (Protonix)', risk: 'possible', notes: 'Rare case reports with IV formulation; generally low risk.' },

  // ── Pain / Addiction Medicine ────────────────────────────────────────────
  { category: 'Pain / Addiction Medicine', name: 'Methadone (Dolophine, Methadose)', risk: 'known', notes: 'Highest QT risk of any opioid. Dose-dependent; risk increases >100 mg/day. ECG monitoring required.' },
  { category: 'Pain / Addiction Medicine', name: 'Buprenorphine (Suboxone, Subutex)', risk: 'possible', notes: 'Lower risk than methadone; mainly at supratherapeutic doses.' },
  { category: 'Pain / Addiction Medicine', name: 'Tramadol (Ultram)', risk: 'conditional', notes: 'QT effect mainly relevant in overdose or with CYP2D6 poor metabolizers.' },

  // ── Oncology ────────────────────────────────────────────────────────────
  { category: 'Oncology', name: 'Oxaliplatin (Eloxatin)', risk: 'known', notes: 'Platinum-based; QT monitoring recommended.' },
  { category: 'Oncology', name: 'Vandetanib (Caprelsa)', risk: 'known', notes: 'REMS program required due to QT risk.' },
  { category: 'Oncology', name: 'Sunitinib (Sutent)', risk: 'known', notes: 'Tyrosine kinase inhibitor; dose-dependent QTc prolongation.' },
  { category: 'Oncology', name: 'Vemurafenib (Zelboraf)', risk: 'known', notes: 'BRAF inhibitor; QT monitoring required.' },
  { category: 'Oncology', name: 'Ribociclib (Kisqali)', risk: 'known', notes: 'CDK4/6 inhibitor; ECG and electrolyte monitoring protocol required.' },
  { category: 'Oncology', name: 'Arsenic trioxide (Trisenox)', risk: 'known', notes: 'Significant QTc prolongation; may cause TdP.' },

  // ── Endocrine / Hormonal ────────────────────────────────────────────────
  { category: 'Endocrine / Hormonal', name: 'Goserelin (Zoladex)', risk: 'known', notes: 'GnRH agonist; androgen deprivation therapy prolongs QT.' },
  { category: 'Endocrine / Hormonal', name: 'Leuprolide (Lupron)', risk: 'known', notes: 'GnRH agonist; same class effect as goserelin.' },
  { category: 'Endocrine / Hormonal', name: 'Degarelix (Firmagon)', risk: 'conditional', notes: 'GnRH antagonist used in prostate cancer.' },

  // ── Antivirals ──────────────────────────────────────────────────────────
  { category: 'Antivirals', name: 'Lopinavir/ritonavir (Kaletra)', risk: 'known', notes: 'HIV protease inhibitor combination; significant QTc prolongation.' },
  { category: 'Antivirals', name: 'Atazanavir (Reyataz)', risk: 'conditional', notes: 'PR interval prolongation predominant; QTc effect at higher exposures.' },
  { category: 'Antivirals', name: 'Ribavirin', risk: 'possible', notes: 'Limited evidence; monitor in cardiac patients.' },

  // ── Miscellaneous ───────────────────────────────────────────────────────
  { category: 'Miscellaneous', name: 'Tacrolimus (Prograf)', risk: 'known', notes: 'Immunosuppressant; QT prolongation well-documented, particularly at high levels.' },
  { category: 'Miscellaneous', name: 'Probucol (withdrawn in US)', risk: 'known', notes: 'Formerly used for hypercholesterolemia; significant TdP risk; withdrawn.' },
  { category: 'Miscellaneous', name: 'Vardenafil (Levitra)', risk: 'known', notes: 'PDE5 inhibitor; QT prolongation at therapeutic doses. Avoid with Class Ia/III antiarrhythmics.' },
  { category: 'Miscellaneous', name: 'Papaverine (IV)', risk: 'conditional', notes: 'Used in vasospasm; IV formulation associated with QTc prolongation.' },
];

function renderQTNonPsychList() {
  const container = document.getElementById('qt-nonpsych-list');
  const cats = [...new Set(QT_NONPSYCH_DRUGS.map(d => d.category))];
  container.innerHTML = cats.map(cat => {
    const drugs = QT_NONPSYCH_DRUGS.filter(d => d.category === cat);
    const items = drugs.map(d => `
      <div class="qt-drug-item">
        <div class="qt-drug-item-top">
          <span class="qt-drug-name">${d.name}</span>
          <span class="qt-risk-pill qt-${d.risk}">${d.risk === 'known' ? 'Known Risk' : d.risk === 'conditional' ? 'Conditional' : 'Possible'}</span>
        </div>
        <div class="qt-drug-notes">${d.notes}</div>
      </div>`).join('');
    return `<div class="qt-cat-block">
      <div class="qt-cat-header">${cat}</div>
      <div class="qt-cat-drugs">${items}</div>
    </div>`;
  }).join('');
}

function renderQTPsychList() {
  const container = document.getElementById('qt-psych-list');
  const qtMeds = MEDICATIONS.filter(m => m.qtInterval);
  if (!qtMeds.length) { container.innerHTML = '<p style="color:var(--text-muted)">No medications flagged for QT prolongation in the database.</p>'; return; }
  container.innerHTML = qtMeds.map(m => `
    <div class="qt-psych-item" onclick="openDrugModal('${m.id}')" title="Click to open drug detail">
      <div class="qt-psych-name">${m.name}</div>
      <div class="qt-psych-sub">${m.brandName} &bull; ${m.class}</div>
      ${classBadge(m.class)}
    </div>`).join('');
}

function calcQTc() {
  const qt  = parseFloat(document.getElementById('qt-interval').value);
  const hr  = parseFloat(document.getElementById('qt-hr').value);
  const sex = document.getElementById('qt-sex').value;
  const res = document.getElementById('qtc-result');

  if (!qt || !hr || qt < 200 || qt > 700 || hr < 20 || hr > 200) {
    res.className = 'qtc-result qtc-error';
    res.innerHTML = 'Please enter a valid QT interval (200–700 ms) and heart rate (20–200 bpm).';
    return;
  }

  const rr       = 60 / hr;                          // RR in seconds
  const bazett   = Math.round(qt / Math.sqrt(rr));
  const frideric = Math.round(qt / Math.cbrt(rr));

  const threshold = sex === 'female' ? { normal: 450, borderline: 470, high: 500 }
                  : sex === 'male'   ? { normal: 440, borderline: 450, high: 500 }
                  : { normal: 450, borderline: 460, high: 500 };

  function interp(qtc) {
    if (qtc >= 500)              return { label: 'High Risk (≥500 ms)',      cls: 'qtc-high' };
    if (qtc > threshold.borderline) return { label: 'Prolonged — Review Agents', cls: 'qtc-concern' };
    if (qtc > threshold.normal)  return { label: 'Borderline — Monitor',    cls: 'qtc-border' };
    return                              { label: 'Normal',                   cls: 'qtc-normal' };
  }

  const iB = interp(bazett);
  const iF = interp(frideric);

  res.className = 'qtc-result';
  res.innerHTML = `
    <div class="qtc-row">
      <div class="qtc-method-box ${iB.cls}">
        <div class="qtc-method-name">Bazett</div>
        <div class="qtc-value">${bazett} ms</div>
        <div class="qtc-interp-label">${iB.label}</div>
      </div>
      <div class="qtc-method-box ${iF.cls}">
        <div class="qtc-method-name">Fridericia</div>
        <div class="qtc-value">${frideric} ms</div>
        <div class="qtc-interp-label">${iF.label}</div>
      </div>
    </div>
    <div class="qtc-note">${hr < 50 || hr > 100 ? '<strong>Fridericia preferred</strong> at this heart rate (' + hr + ' bpm). Bazett overcorrects at rate extremes.' : 'Both formulas are appropriate at this heart rate (' + hr + ' bpm).'}</div>
    ${sex ? '' : '<div class="qtc-note" style="color:var(--yellow)">Select patient sex for sex-specific interpretation thresholds.</div>'}
  `;
}

function updateTisdaleScore() {
  const checks = document.querySelectorAll('.tisdale-cb');
  let total = 0;
  checks.forEach(cb => { if (cb.checked) total += parseInt(cb.dataset.pts); });

  const scoreEl = document.getElementById('tisdale-score');
  const badge   = document.getElementById('tisdale-risk-badge');
  const interp  = document.getElementById('tisdale-interp');

  scoreEl.textContent = total;

  if (total <= 6) {
    badge.textContent = 'Low Risk';
    badge.className   = 'tisdale-risk-badge tisdale-low';
    interp.textContent = 'Low risk of QT prolongation. Routine monitoring appropriate; reassess if clinical status changes.';
  } else if (total <= 10) {
    badge.textContent = 'Moderate Risk';
    badge.className   = 'tisdale-risk-badge tisdale-mod';
    interp.textContent = 'Moderate risk. Obtain ECG; correct electrolytes; review all QT-prolonging agents; consider alternatives where possible.';
  } else {
    badge.textContent = 'High Risk';
    badge.className   = 'tisdale-risk-badge tisdale-high';
    interp.textContent = 'High risk of QT prolongation. Obtain ECG; correct electrolytes aggressively; minimize QT-prolonging agents; consider cardiology consultation.';
  }
}

// Wire Tisdale checkboxes
document.querySelectorAll('.tisdale-cb').forEach(cb => {
  cb.addEventListener('change', updateTisdaleScore);
});

// Wire QTc calculator on Enter key
['qt-interval','qt-hr'].forEach(id => {
  document.getElementById(id).addEventListener('keydown', e => {
    if (e.key === 'Enter') calcQTc();
  });
});

/* ── Init ───────────────────────────────────────────────────────────────── */
renderStats();
initQuickSearch();
renderDrugTable();
renderP450Table();
populateDrugSelect();
renderReceptorToggles();
populateCompareSelects();
renderGlossaryTypeFilters();
renderGlossary();
initFDASearch();
renderQTNonPsychList();
renderQTPsychList();

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
// Returns null if the drug has no receptorKi data (except cardiacQT which
// can also use the qtInterval flag).
function sideEffectScore(drug, seKey) {
  const profile = SIDE_EFFECT_PROFILES[seKey];
  if (!profile) return null;

  // ── Special handling for Cardiac / QT Effects ──
  // QT prolongation is primarily driven by hERG (IKr) channel blockade,
  // not H1/alpha1 binding. The qtInterval flag reflects clinical evidence
  // of documented QT risk. Receptor affinities for alpha1/H1 contribute
  // secondary cardiovascular risk (orthostasis, reflex tachycardia).
  if (seKey === 'cardiacQT') {
    const hasKi = drug.receptorKi != null;
    const hasQtFlag = drug.qtInterval != null;
    if (!hasKi && !hasQtFlag) return null;

    // Receptor-based component (0–100): H1 + alpha1 binding
    let receptorScore = 0;
    if (hasKi) {
      const ki = drug.receptorKi;
      let wSum = 0, wTotal = 0;
      for (const [receptor, weight] of Object.entries(profile.receptors)) {
        const kiVal = ki[receptor];
        const pkiVal = (kiVal && kiVal < 10000) ? (9 - Math.log10(kiVal)) : 5;
        const normalized = Math.max(0, (pkiVal - 5) / 4);
        wSum += normalized * weight;
        wTotal += weight;
      }
      receptorScore = wTotal > 0 ? (wSum / wTotal) * 100 : 0;
    }

    // Blend: qtInterval flag is the primary signal (weight 0.7),
    // receptor binding is the secondary signal (weight 0.3).
    // qtInterval true → base 75; false → base 0; undefined → receptor only.
    if (hasQtFlag) {
      const qtBase = drug.qtInterval ? 75 : 0;
      return Math.round(qtBase * 0.7 + receptorScore * 0.3);
    }
    // No qtInterval field at all → fall back to receptor score only
    return hasKi ? Math.round(receptorScore) : null;
  }

  // ── Standard receptor-based scoring for all other side effects ──
  if (!drug.receptorKi) return null;
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
// Map each section to its parent group
const SECTION_GROUP = {
  'drug-table': 'psychopharm', 'p450': 'psychopharm',
  'receptor-binding': 'psychopharm', 'glossary': 'psychopharm',
  'qt-risk': 'tools', 'refill-calendar': 'tools', 'med-compare': 'tools', 'med-taper': 'tools',
  'cog-domains': 'insights', 'neuro-circuits': 'insights', 'brain-regions': 'insights',
  'fda-search': null, 'overview': null, 'blog-index': 'blog', 'blog-smoking': 'blog', 'blog-weight': 'blog'
};

function expandGroup(groupId) {
  document.querySelectorAll('.nav-group').forEach(g => {
    if (g.dataset.group === groupId) {
      g.classList.add('open');
    } else {
      g.classList.remove('open');
    }
  });
}

function switchSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const sec = document.getElementById(id);
  if (sec) sec.classList.add('active');
  const link = document.querySelector(`[data-section="${id}"]`);
  if (link) link.classList.add('active');

  // Expand the parent group for this section
  const group = SECTION_GROUP[id];
  expandGroup(group);

  // Show filter panel only when drug-table is active
  const filterPanel = document.querySelector('.filter-panel');
  if (filterPanel) filterPanel.style.display = (id === 'drug-table') ? '' : 'none';

  // Lazy-render charts when section becomes active
  if (id === 'receptor-binding') renderBarChart();

  // Scroll main content to top
  document.getElementById('content').scrollTop = 0;

  // Close sidebar on mobile after navigation
  if (window.innerWidth <= 768) {
    document.getElementById('sidebar').classList.remove('sidebar-open');
    document.getElementById('sidebar-overlay').classList.remove('overlay-visible');
    document.body.classList.remove('sidebar-is-open');
  }
}

// Parent nav button toggle
document.querySelectorAll('.nav-parent-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    const group = btn.closest('.nav-group');
    const isOpen = group.classList.contains('open');
    // Close all groups
    document.querySelectorAll('.nav-group').forEach(g => g.classList.remove('open'));
    // Toggle clicked group
    if (!isOpen) group.classList.add('open');
  });
});

// Sub-link navigation
document.querySelectorAll('.nav-sub-link').forEach(link => {
  link.addEventListener('click', e => {
    if (link.dataset.section) {
      e.preventDefault();
      switchSection(link.dataset.section);
    }
    // else: no data-section → href navigates normally to external blog page
  });
});

// Home link
document.querySelectorAll('[data-section="overview"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    switchSection('overview');
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
    switchSection('drug-table');
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

    ${drug.indications?.length ? `
  <div class="modal-section">
    <h4>FDA-Approved Indications</h4>
    <div class="modal-indications">
      ${drug.indications.map(ind => `
        <div class="modal-ind-row">
          <span class="modal-ind-use">${ind.use}</span>
          <span class="modal-ind-year">${ind.year}</span>
        </div>`).join('')}
    </div>
  </div>` : ''}
    ${drug.mechanism ? `<div class="modal-section"><h4>Mechanism</h4><div style="font-size:13px;color:var(--text-muted);line-height:1.7">${drug.mechanism}</div></div>` : ''}
    ${buildBlackBoxHTML(drug.id)}
    ${buildSideEffectsHTML(drug.id)}
  `;

  modal.classList.remove('hidden');
}

/* ── FDA Safety Data Helpers ──────────────────────────────────────────────── */
function buildBlackBoxHTML(drugId) {
  const safety = typeof FDA_SAFETY_DATA !== 'undefined' ? FDA_SAFETY_DATA[drugId] : null;
  if (!safety || !safety.blackBoxWarnings || !safety.blackBoxWarnings.length) return '';
  return `
  <div class="modal-section modal-bbw">
    <h4>&#9888; FDA Black Box Warnings</h4>
    <div class="bbw-container">
      ${safety.blackBoxWarnings.map(w => `<div class="bbw-item">${w}</div>`).join('')}
    </div>
  </div>`;
}

function buildSideEffectsHTML(drugId) {
  const safety = typeof FDA_SAFETY_DATA !== 'undefined' ? FDA_SAFETY_DATA[drugId] : null;
  if (!safety || !safety.sideEffects) return '';
  const systems = Object.keys(safety.sideEffects);
  if (!systems.length) return '';
  return `
  <div class="modal-section">
    <h4>Common Side Effects</h4>
    <div class="se-grid">
      ${systems.map(sys => `
        <div class="se-category">
          <div class="se-system">${sys}</div>
          <div class="se-list">${safety.sideEffects[sys].map(se => `<span class="se-tag">${se}</span>`).join('')}</div>
        </div>`).join('')}
    </div>
  </div>`;
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

/* ── Perinatal Cell Helpers ─────────────────────────────────────────────── */
const PERINATAL_RISK_BADGE = {
  low:     { cls: 'peri-low',     label: 'Compatible'  },
  caution: { cls: 'peri-caution', label: 'Caution'     },
  avoid:   { cls: 'peri-avoid',   label: 'Avoid'       },
  unknown: { cls: 'peri-unknown', label: 'Unknown'     },
};

function perinatalCell(data, isBF = false) {
  if (!data) return '<span class="no-badge">—</span>';
  const b = PERINATAL_RISK_BADGE[data.risk] || PERINATAL_RISK_BADGE.unknown;
  const cat = isBF
    ? (data.hale && data.hale !== 'unknown' ? `<span class="peri-cat">Hale ${data.hale}</span>` : '')
    : (data.fdaCategory ? `<span class="peri-cat">Cat. ${data.fdaCategory}</span>` : '');
  const title = (data.notes || '').replace(/"/g, '&quot;');
  return `<div class="peri-cell" title="${title}">
    <span class="peri-badge ${b.cls}">${b.label}</span>${cat}
  </div>`;
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
    return filtered.sort((a, b) => {
      const sa = sideEffectScore(a, sideEffectSort);
      const sb = sideEffectScore(b, sideEffectSort);
      if (sa === null && sb === null) return a.name.localeCompare(b.name);
      if (sa === null) return 1;
      if (sb === null) return -1;
      return sortDir * (sa - sb);
    });
  }

  // Perinatal risk sort
  const RISK_ORDER = { low: 1, caution: 2, avoid: 3, unknown: 4 };
  if (sortCol === 'pregnancy' || sortCol === 'breastfeeding') {
    return filtered.sort((a, b) => {
      const pa = PERINATAL_DATA[a.id]?.[sortCol]?.risk ?? 'unknown';
      const pb = PERINATAL_DATA[b.id]?.[sortCol]?.risk ?? 'unknown';
      const diff = (RISK_ORDER[pa] ?? 4) - (RISK_ORDER[pb] ?? 4);
      return diff !== 0 ? sortDir * diff : a.name.localeCompare(b.name);
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
  const colCount = showSE ? 15 : 14;

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

    const pData = PERINATAL_DATA[m.id];
    const pregCell = perinatalCell(pData?.pregnancy);
    const bfCell   = perinatalCell(pData?.breastfeeding, true);

    return `<tr>
      <td class="drug-name-cell" style="cursor:pointer" onclick="openDrugModal('${m.id}')">${m.name} <span class="brand-name">(${m.brandName})</span></td>
      ${seCell}
      <td>${classBadge(m.class)}</td>
      <td>${enan}</td>
      <td style="white-space:nowrap">${m.halfLife.drug}</td>
      <td style="font-size:12px;color:var(--text-muted)">${m.halfLife.metabolites}</td>
      <td>${renal}</td>
      <td>${hepatic}</td>
      <td>${geriatric}</td>
      <td>${qt}</td>
      <td>${pb}</td>
      <td>${pregCell}</td>
      <td>${bfCell}</td>
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
      <td class="drug-name-cell" style="cursor:pointer;white-space:nowrap" onclick="openDrugModal('${m.id}')">${m.name} <span class="brand-name">(${m.brandName})</span></td>
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
        `<option value="${m.id}">${m.name} (${m.brandName.toUpperCase()})</option>`
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
  const opts = sorted.map(m => `<option value="${m.id}">${m.name} (${m.brandName.toUpperCase()})</option>`).join('');
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
  const input = document.getElementById('fda-filter');
  const btn = document.getElementById('fda-go-btn');

  function openFDA() {
    const query = input.value.trim();
    if (!query) return;
    const url = `https://www.accessdata.fda.gov/scripts/cder/daf/index.cfm?event=BasicSearch.process&query=${encodeURIComponent(query)}`;
    window.open(url, '_blank', 'noopener');
  }

  btn.addEventListener('click', openFDA);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') openFDA(); });
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
  const checkedItems = [];
  checks.forEach(cb => {
    if (cb.checked) {
      total += parseInt(cb.dataset.pts);
      // Extract clean text from the label
      const label = cb.parentElement;
      let text = label.textContent.replace(/\+\d+/g, '').trim();
      checkedItems.push({ text: text, pts: parseInt(cb.dataset.pts) });
    }
  });

  const scoreEl = document.getElementById('tisdale-score');
  const badge   = document.getElementById('tisdale-risk-badge');
  const interp  = document.getElementById('tisdale-interp');

  scoreEl.textContent = total;

  let riskLevel, interpText, recs;

  if (total <= 6) {
    riskLevel = 'LOW RISK';
    badge.textContent = 'Low Risk';
    badge.className   = 'tisdale-risk-badge tisdale-low';
    interpText = 'Low risk of QT prolongation. Routine monitoring appropriate; reassess if clinical status changes.';
    recs = 'Routine ECG monitoring per standard of care\nReassess if clinical status changes or new QT-prolonging agents added';
  } else if (total <= 10) {
    riskLevel = 'MODERATE RISK';
    badge.textContent = 'Moderate Risk';
    badge.className   = 'tisdale-risk-badge tisdale-mod';
    interpText = 'Moderate risk. Obtain ECG; correct electrolytes; review all QT-prolonging agents; consider alternatives where possible.';
    recs = 'Obtain baseline ECG and repeat in 48-72 hours\nCorrect electrolytes (K+ >4.0, Mg2+ >2.0)\nReview all QT-prolonging agents and consider alternatives\nMonitor for symptoms (palpitations, syncope, dizziness)';
  } else {
    riskLevel = 'HIGH RISK';
    badge.textContent = 'High Risk';
    badge.className   = 'tisdale-risk-badge tisdale-high';
    interpText = 'High risk of QT prolongation. Obtain ECG; correct electrolytes aggressively; minimize QT-prolonging agents; consider cardiology consultation.';
    recs = 'Obtain ECG immediately; continuous telemetry if available\nAggressively correct electrolytes (K+ >4.0, Mg2+ >2.0)\nMinimize or discontinue QT-prolonging agents\nConsider cardiology consultation\nAvoid additional QT-prolonging medications\nMonitor QTc serially (at minimum daily)';
  }

  interp.textContent = interpText;

  // Build plain-text summary
  const summaryWrap = document.getElementById('tisdale-summary-wrap');
  if (total > 0) {
    const today = new Date();
    const dateStr = (today.getMonth()+1)+'/'+today.getDate()+'/'+today.getFullYear();
    const line = '────────────────────────────────────────';
    let txt = '';
    txt += 'TISDALE QT RISK SCORE SUMMARY\n';
    txt += line + '\n';
    txt += 'Date: ' + dateStr + '\n\n';
    txt += 'TOTAL SCORE:   ' + total + ' — ' + riskLevel + '\n';
    txt += '  (≤6 = Low | 7-10 = Moderate | ≥11 = High)\n\n';
    txt += 'RISK FACTORS PRESENT\n';
    if (checkedItems.length === 0) {
      txt += '  None selected\n';
    } else {
      checkedItems.forEach(function(item) {
        txt += '  [+' + item.pts + ']  ' + item.text + '\n';
      });
    }
    txt += '\n' + line + '\n';
    txt += 'INTERPRETATION\n\n';
    txt += interpText + '\n';
    txt += '\nRECOMMENDATIONS\n\n';
    recs.split('\n').forEach(function(r) { txt += '  - ' + r + '\n'; });
    txt += '\n' + line + '\n';
    txt += 'Reference: Tisdale JE, et al. Circ Cardiovasc Qual Outcomes. 2013;6(4):479-487.\n';
    txt += '';

    document.getElementById('tisdale-summary-text').textContent = txt;
    summaryWrap.style.display = 'block';
  } else {
    summaryWrap.style.display = 'none';
  }
}

// Wire Tisdale checkboxes
document.querySelectorAll('.tisdale-cb').forEach(cb => {
  cb.addEventListener('change', updateTisdaleScore);
});

// Tisdale copy button
document.getElementById('tisdale-copy-btn').addEventListener('click', function(){
  const text = document.getElementById('tisdale-summary-text').textContent;
  navigator.clipboard.writeText(text).then(function(){
    const msg = document.getElementById('tisdale-copy-msg');
    msg.style.display = 'block';
    setTimeout(function(){ msg.style.display = 'none'; }, 2000);
  });
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
initMedCompare();
initMedTaper();

/* ── Refill Calendar ────────────────────────────────────────────────────── */

// Shared helpers
function parseLocalDate(str) {
  // Parse YYYY-MM-DD as local time (avoids UTC off-by-one)
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function fmtDate(date) {
  return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
}

function daysBetween(a, b) {
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

// 1. Days Between
function calcDaysBetween() {
  const v1 = document.getElementById('db-date1').value;
  const v2 = document.getElementById('db-date2').value;
  const res = document.getElementById('db-result');
  if (!v1 || !v2) { showRCError(res, 'Please select both dates.'); return; }

  const d1   = parseLocalDate(v1);
  const d2   = parseLocalDate(v2);
  const diff = Math.abs(daysBetween(d1, d2));
  const earlier = d1 <= d2 ? d1 : d2;
  const later   = d1 <= d2 ? d2 : d1;

  const copyText = `Days Between Dates\n${diff} days\nFrom ${fmtDate(earlier)} to ${fmtDate(later)}\n${Math.floor(diff / 7)} weeks and ${diff % 7} days — ~${(diff / 30.44).toFixed(1)} months`;

  res.className = 'rc-result';
  res.innerHTML = `
    <div class="rc-big-num">${diff} <span class="rc-big-unit">days</span></div>
    <div class="rc-detail">From <strong>${fmtDate(earlier)}</strong> to <strong>${fmtDate(later)}</strong></div>
    <div class="rc-detail">${Math.floor(diff / 7)} weeks and ${diff % 7} days &bull; ~${(diff / 30.44).toFixed(1)} months</div>
    <button class="rc-copy-btn" onclick="rcCopy(this, \`${copyText.replace(/`/g, '\\`')}\`)">Copy</button>
  `;
}

// 2. Usage Calculator
function calcUsage() {
  const startVal = document.getElementById('uc-start').value;
  const endVal   = document.getElementById('uc-end').value;
  const qty      = parseFloat(document.getElementById('uc-qty').value);
  const dose     = parseFloat(document.getElementById('uc-dose').value);
  const unit     = document.getElementById('uc-unit').value;
  const remaining = parseFloat(document.getElementById('uc-remaining').value) || 0;
  const res      = document.getElementById('uc-result');

  if (!startVal || !endVal || !qty || !dose) {
    showRCError(res, 'Please fill in all required fields (fill date, end date, quantity, and dose strength).');
    return;
  }

  const start = parseLocalDate(startVal);
  const end   = parseLocalDate(endVal);
  const days  = daysBetween(start, end);

  if (days <= 0) { showRCError(res, 'End date must be after fill date.'); return; }

  const pillsUsed     = qty - remaining;
  const totalMg       = pillsUsed * dose;
  const avgPerDay     = totalMg / days;
  const pillsPerDay   = pillsUsed / days;
  const perMonth      = avgPerDay * 30.44;
  const pillsPerMonth = pillsPerDay * 30.44;

  const ucCopy = `Usage Calculator\nPeriod: ${fmtDate(start)} to ${fmtDate(end)} (${days} days)\nPrescribed: ${qty} pills x ${dose} ${unit}${remaining > 0 ? ' | Remaining: ' + remaining + ' pills' : ''}\nPills Used: ${pillsUsed.toFixed(1)}\nAvg Daily Dose: ${avgPerDay.toFixed(2)} ${unit}/day\nPills/Day Avg: ${pillsPerDay.toFixed(2)}\nProjected Monthly Total: ${perMonth.toFixed(1)} ${unit}\nProjected Pills/Month: ${pillsPerMonth.toFixed(1)}`;

  res.className = 'rc-result';
  res.innerHTML = `
    <div class="rc-stats-grid">
      <div class="rc-stat"><div class="rc-stat-val">${days}</div><div class="rc-stat-lbl">Days in Period</div></div>
      <div class="rc-stat"><div class="rc-stat-val">${pillsUsed.toFixed(1)}</div><div class="rc-stat-lbl">Pills Used</div></div>
      <div class="rc-stat"><div class="rc-stat-val">${avgPerDay.toFixed(2)} <span class="rc-stat-unit">${unit}/day</span></div><div class="rc-stat-lbl">Avg Daily Dose</div></div>
      <div class="rc-stat"><div class="rc-stat-val">${pillsPerDay.toFixed(2)}</div><div class="rc-stat-lbl">Pills/Day Avg</div></div>
      <div class="rc-stat"><div class="rc-stat-val">${perMonth.toFixed(1)} <span class="rc-stat-unit">${unit}</span></div><div class="rc-stat-lbl">Projected Monthly Total</div></div>
      <div class="rc-stat"><div class="rc-stat-val">${pillsPerMonth.toFixed(1)}</div><div class="rc-stat-lbl">Projected Pills/Month</div></div>
    </div>
    <div class="rc-detail" style="margin-top:10px">
      Period: <strong>${fmtDate(start)}</strong> → <strong>${fmtDate(end)}</strong> &bull;
      Prescribed: <strong>${qty} pills × ${dose} ${unit}</strong>
      ${remaining > 0 ? `&bull; Remaining at count: <strong>${remaining} pills</strong>` : ''}
    </div>
    <button class="rc-copy-btn" onclick="rcCopy(this, \`${ucCopy.replace(/`/g, '\\`')}\`)">Copy</button>
  `;
}

// 3. Forward Refill Dates
function calcForwardRefills() {
  const dateVal = document.getElementById('fwd-date').value;
  const daysVal = parseInt(document.getElementById('fwd-days').value);
  const res     = document.getElementById('fwd-result');

  if (!dateVal || !daysVal || daysVal < 1) {
    showRCError(res, 'Please enter a fill date and days supply.');
    return;
  }

  const start = parseLocalDate(dateVal);
  const rows  = Array.from({ length: 6 }, (_, i) => {
    const n    = i + 1;
    const date = addDays(start, daysVal * n);
    const from = addDays(start, daysVal * (n - 1));
    return `<tr>
      <td class="rc-fill-num">Fill #${n}</td>
      <td class="rc-fill-date">${fmtDate(date)}</td>
      <td class="rc-fill-note">${daysVal} days after ${fmtDate(from)}</td>
    </tr>`;
  }).join('');

  const fwdCopyLines = Array.from({ length: 6 }, (_, i) => {
    const n = i + 1;
    return `Fill #${n}: ${fmtDate(addDays(start, daysVal * n))} (${daysVal} days after ${fmtDate(addDays(start, daysVal * (n - 1)))})`;
  }).join('\n');
  const fwdCopy = `Forward Refill Dates\nStarting from fill on ${fmtDate(start)}, every ${daysVal} days:\n${fwdCopyLines}`;

  res.className = 'rc-result';
  res.innerHTML = `
    <div class="rc-detail" style="margin-bottom:10px">Starting from fill on <strong>${fmtDate(start)}</strong>, every <strong>${daysVal} days</strong>:</div>
    <table class="rc-fill-table"><tbody>${rows}</tbody></table>
    <button class="rc-copy-btn" onclick="rcCopy(this, \`${fwdCopy.replace(/`/g, '\\`')}\`)">Copy</button>
  `;
}

// 4. Reverse Refill Tracker
function calcReverseRefills() {
  const dateVal = document.getElementById('rev-date').value;
  const daysVal = parseInt(document.getElementById('rev-days').value);
  const res     = document.getElementById('rev-result');

  if (!dateVal || !daysVal || daysVal < 1) {
    showRCError(res, 'Please enter the most recent fill date and days between fills.');
    return;
  }

  const latest = parseLocalDate(dateVal);
  const rows   = Array.from({ length: 6 }, (_, i) => {
    const n    = i + 1;
    const date = addDays(latest, -daysVal * n);
    return `<tr>
      <td class="rc-fill-num">Fill −${n}</td>
      <td class="rc-fill-date">${fmtDate(date)}</td>
      <td class="rc-fill-note">${daysVal} days before ${fmtDate(addDays(latest, -daysVal * (n - 1)))}</td>
    </tr>`;
  }).join('');

  const revCopyLines = Array.from({ length: 6 }, (_, i) => {
    const n = i + 1;
    return `Fill -${n}: ${fmtDate(addDays(latest, -daysVal * n))} (${daysVal} days before ${fmtDate(addDays(latest, -daysVal * (n - 1)))})`;
  }).join('\n');
  const revCopy = `Reverse Refill Tracker\nWorking back from ${fmtDate(latest)}, every ${daysVal} days:\n${revCopyLines}\nNote: Expected dates based on consistent fill interval. Actual fill dates may vary.`;

  res.className = 'rc-result';
  res.innerHTML = `
    <div class="rc-detail" style="margin-bottom:10px">Working back from <strong>${fmtDate(latest)}</strong>, every <strong>${daysVal} days</strong>:</div>
    <table class="rc-fill-table"><tbody>${rows}</tbody></table>
    <div class="rc-detail" style="margin-top:10px;font-style:italic;color:var(--text-muted)">These are <em>expected</em> dates based on a consistent fill interval. Actual fill dates may vary.</div>
    <button class="rc-copy-btn" onclick="rcCopy(this, \`${revCopy.replace(/`/g, '\\`')}\`)">Copy</button>
  `;
}

// 5. Medication Sync
function calcMedSync() {
  const res = document.getElementById('ms-result');

  const nameA  = document.getElementById('ms-nameA').value.trim() || 'Med A';
  const fillAv = document.getElementById('ms-fillA').value;
  const daysA  = parseInt(document.getElementById('ms-daysA').value);
  const qtyA   = parseFloat(document.getElementById('ms-qtyA').value);
  const doseA  = parseFloat(document.getElementById('ms-doseA').value);

  const nameB  = document.getElementById('ms-nameB').value.trim() || 'Med B';
  const fillBv = document.getElementById('ms-fillB').value;
  const daysB  = parseInt(document.getElementById('ms-daysB').value);
  const qtyB   = parseFloat(document.getElementById('ms-qtyB').value);
  const doseB  = parseFloat(document.getElementById('ms-doseB').value);

  if (!fillAv || !fillBv || !daysA || !daysB || !qtyA || !qtyB || !doseA || !doseB) {
    showRCError(res, 'Please fill in all required fields for both medications (fill date, days supply, quantity, and daily dose).');
    return;
  }

  const fillA = parseLocalDate(fillAv);
  const fillB = parseLocalDate(fillBv);
  const dueA  = addDays(fillA, daysA);
  const dueB  = addDays(fillB, daysB);

  const targetVal = document.getElementById('ms-target').value;
  let target;
  if (targetVal) {
    target = parseLocalDate(targetVal);
    if (target <= dueA && target <= dueB) {
      showRCError(res, 'Preferred sync date must be after at least one medication\'s current depletion date (' + fmtDate(dueA < dueB ? dueA : dueB) + ').');
      return;
    }
  } else {
    target = dueA > dueB ? dueA : dueB;
  }

  const futureCount = parseInt(document.getElementById('ms-future').value) || 4;

  // Build sync plan for each med
  function buildPlan(name, fillDate, daysSupply, qty, dailyDose, dueDate) {
    const shortDays = daysBetween(dueDate, target);
    let syncFill = null;
    let firstFullDate;

    if (shortDays > 0 && shortDays < daysSupply) {
      // Needs a short fill
      const shortQty = Math.ceil(dailyDose * shortDays);
      syncFill = {
        date: dueDate,
        days: shortDays,
        qty: shortQty,
        isShort: true
      };
      firstFullDate = target;
    } else if (shortDays <= 0) {
      // Already aligns or is the latest — full fill on target
      firstFullDate = target;
    } else {
      // shortDays >= daysSupply — too far, just do a full fill at due
      firstFullDate = dueDate;
    }

    // Build future fills from the target date onward
    const fills = [];
    if (syncFill) fills.push(syncFill);
    for (let i = 0; i < futureCount; i++) {
      const d = addDays(firstFullDate, i * daysSupply);
      fills.push({ date: d, days: daysSupply, qty: qty, isShort: false });
    }

    return { name, dueDate, fills, syncFill, daysSupply, dailyDose };
  }

  const planA = buildPlan(nameA, fillA, daysA, qtyA, doseA, dueA);
  const planB = buildPlan(nameB, fillB, daysB, qtyB, doseB, dueB);

  // Render results
  function renderPlan(plan) {
    let html = '<div style="margin-bottom:16px">';
    html += '<strong style="color:var(--accent)">' + plan.name + '</strong>';
    html += '<div class="rc-detail">Current depletion: <strong>' + fmtDate(plan.dueDate) + '</strong></div>';
    if (plan.syncFill) {
      html += '<div class="rc-detail" style="color:var(--accent2);font-weight:600">&#9888; Short fill needed: <strong>' + plan.syncFill.qty + ' units</strong> (' + plan.syncFill.days + ' days) on <strong>' + fmtDate(plan.syncFill.date) + '</strong></div>';
    }
    html += '<table style="width:100%;border-collapse:collapse;margin-top:8px;font-size:0.88rem">';
    html += '<tr style="background:var(--bg2);font-weight:600"><td style="padding:6px 8px;border:1px solid var(--border)">Fill #</td><td style="padding:6px 8px;border:1px solid var(--border)">Date</td><td style="padding:6px 8px;border:1px solid var(--border)">Days</td><td style="padding:6px 8px;border:1px solid var(--border)">Qty</td><td style="padding:6px 8px;border:1px solid var(--border)">Type</td></tr>';
    plan.fills.forEach(function(f, idx) {
      var bg = f.isShort ? 'background:rgba(139,105,20,0.1)' : '';
      html += '<tr style="' + bg + '"><td style="padding:6px 8px;border:1px solid var(--border)">' + (idx + 1) + '</td><td style="padding:6px 8px;border:1px solid var(--border)">' + fmtDate(f.date) + '</td><td style="padding:6px 8px;border:1px solid var(--border)">' + f.days + '</td><td style="padding:6px 8px;border:1px solid var(--border)">' + f.qty + '</td><td style="padding:6px 8px;border:1px solid var(--border)">' + (f.isShort ? 'Short Fill' : 'Full') + '</td></tr>';
    });
    html += '</table></div>';
    return html;
  }

  // Build plain text for copy
  function planText(plan) {
    var lines = plan.name + '\n';
    lines += 'Current depletion: ' + fmtDate(plan.dueDate) + '\n';
    if (plan.syncFill) {
      lines += 'SHORT FILL: ' + plan.syncFill.qty + ' units (' + plan.syncFill.days + ' days) on ' + fmtDate(plan.syncFill.date) + '\n';
    }
    lines += 'Fill #  Date                    Days  Qty   Type\n';
    plan.fills.forEach(function(f, idx) {
      var dateStr = fmtDate(f.date);
      lines += (idx + 1) + '       ' + dateStr + '  ' + f.days + '    ' + f.qty + '    ' + (f.isShort ? 'Short' : 'Full') + '\n';
    });
    return lines;
  }

  var copyText = 'Medication Sync Plan\nDate: ' + fmtDate(new Date()) + '\nTarget Sync Date: ' + fmtDate(target) + '\n\n' + planText(planA) + '\n' + planText(planB) + '\nAfter the sync fill, both medications align on ' + fmtDate(target) + ' and remain synced going forward.';

  res.className = 'rc-result';
  res.innerHTML = '<div class="rc-detail" style="font-weight:600;margin-bottom:12px">&#128197; Target Sync Date: <strong>' + fmtDate(target) + '</strong></div>' + renderPlan(planA) + renderPlan(planB) + '<div class="rc-detail" style="margin-top:12px;font-style:italic">After the sync fill, both medications align on <strong>' + fmtDate(target) + '</strong> and stay synced every ' + (daysA === daysB ? daysA + ' days' : daysA + '/' + daysB + ' days') + '.</div>' + '<button class="rc-copy-btn" onclick="rcCopy(this, `' + copyText.replace(/`/g, '\\`').replace(/\n/g, '\\n') + '`)">Copy</button>';
}

function rcCopy(btn, text) {
  navigator.clipboard.writeText(text).then(() => {
    const orig = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.textContent = orig; }, 2000);
  });
}

function showRCError(el, msg) {
  el.className = 'rc-result rc-error';
  el.innerHTML = msg;
}

/* ── Medication Comparison ─────────────────────────────────────────────── */
function initMedCompare() {
  const KI_SIG = 1000;   // nM threshold for "significant" receptor affinity
  const KI_CHART = 5000; // show receptor in chart if any drug ≤ this Ki

  let mcCount = 2;
  let mcChart = null;

  const drugOptions = MEDICATIONS.slice().sort((a,b) => a.name.localeCompare(b.name))
    .map(m => `<option value="${m.name}">${m.name} (${m.brandName.toUpperCase()})</option>`).join('');

  function buildSelectors() {
    const container = document.getElementById('mc-selectors');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < mcCount; i++) {
      const wrap = document.createElement('div');
      wrap.className = 'mc-select-wrap';
      const label = document.createElement('label');
      label.className = 'mc-select-label';
      label.textContent = `Drug ${i + 1}`;
      const sel = document.createElement('select');
      sel.className = 'mc-select';
      sel.id = `mc-sel-${i}`;
      sel.innerHTML = `<option value="">— Select —</option>` + drugOptions;
      wrap.appendChild(label);
      wrap.appendChild(sel);
      container.appendChild(wrap);
    }
  }

  // Count pill buttons
  document.querySelectorAll('.mc-count-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mc-count-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      mcCount = parseInt(btn.dataset.n);
      buildSelectors();
      document.getElementById('mc-results').style.display = 'none';
    });
  });

  buildSelectors();

  // Tab switching
  document.querySelectorAll('.mc-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.mc-tab').forEach(t => t.classList.remove('mc-tab--active'));
      document.querySelectorAll('.mc-panel').forEach(p => p.classList.remove('mc-panel--active'));
      tab.classList.add('mc-tab--active');
      document.getElementById(`mc-panel-${tab.dataset.tab}`).classList.add('mc-panel--active');
    });
  });

  // Track current drugs for print
  let mcCurrentDrugs = [];

  // Compare button
  document.getElementById('mc-go-btn').addEventListener('click', () => {
    const drugs = [];
    for (let i = 0; i < mcCount; i++) {
      const val = document.getElementById(`mc-sel-${i}`)?.value;
      if (val) {
        const drug = MEDICATIONS.find(m => m.name === val);
        if (drug && !drugs.find(d => d.name === val)) drugs.push(drug);
      }
    }
    if (drugs.length < 2) {
      alert('Please select at least 2 medications to compare.');
      return;
    }
    mcCurrentDrugs = drugs;
    renderComparison(drugs);
    document.getElementById('mc-results').style.display = '';
    // Reset to first tab
    document.querySelectorAll('.mc-tab').forEach((t,i) => t.classList.toggle('mc-tab--active', i===0));
    document.querySelectorAll('.mc-panel').forEach((p,i) => p.classList.toggle('mc-panel--active', i===0));
  });

  document.getElementById('mc-print-btn').addEventListener('click', () => {
    if (mcCurrentDrugs.length >= 2) printMedComparison(mcCurrentDrugs);
  });

  // Drug color palette (up to 6)
  const DRUG_COLORS = ['#5b8dee','#f47560','#57c785','#f0c040','#b57bee','#f07090'];

  function renderComparison(drugs) {
    renderReceptorTab(drugs);
    renderSETab(drugs);
    renderCircuitTab(drugs);
  }

  /* ── Print / PDF ── */
  function printMedComparison(drugs) {
    const KI_SIG = 1000;
    const date = new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });

    // ── Receptor rows
    const receptorRows = RECEPTOR_LIST.map(r => {
      const cells = drugs.map(d => {
        if (!d.receptorKi) return null;
        const ki = d.receptorKi[r] || 10000;
        return ki < 10000 ? ki : null;
      });
      if (cells.every(c => c === null)) return null;
      const sharedSig = cells.filter(c => c !== null && c <= KI_SIG).length;
      return { r, cells, sharedSig };
    }).filter(Boolean);

    const receptorTableRows = receptorRows.map(({r, cells, sharedSig}) => `
      <tr>
        <td style="font-weight:600;padding:5px 8px;border-bottom:1px solid #e0e0e0">${r}</td>
        ${drugs.map((_d, idx) => {
          const ki = cells[idx];
          if (ki === null) return `<td style="padding:5px 8px;border-bottom:1px solid #e0e0e0;color:#aaa;text-align:center">—</td>`;
          const col = ki < 10 ? '#d94f30' : ki < 100 ? '#c07000' : ki < 1000 ? '#2060b0' : '#888';
          return `<td style="padding:5px 8px;border-bottom:1px solid #e0e0e0;text-align:center;color:${col};font-weight:${ki<1000?'600':'400'}">${ki} nM</td>`;
        }).join('')}
        <td style="padding:5px 8px;border-bottom:1px solid #e0e0e0;text-align:center;font-size:11px;color:${sharedSig>=2?'#2a7a2a':'#aaa'}">${sharedSig >= 2 ? `${sharedSig}/${drugs.length}` : '—'}</td>
      </tr>`).join('');

    // ── Side effect rows
    const seRows = Object.entries(SIDE_EFFECT_PROFILES).map(([key, profile]) => {
      const scores = drugs.map(d => sideEffectScore(d, key));
      const sigCount = scores.filter(s => s !== null && s >= 25).length;
      return { label: profile.label, scores, sigCount };
    }).sort((a,b) => b.sigCount - a.sigCount || b.scores.reduce((x,s)=>x+(s||0),0) - a.scores.reduce((x,s)=>x+(s||0),0));

    const seTableRows = seRows.map(({label, scores, sigCount}) => `
      <tr>
        <td style="padding:5px 8px;border-bottom:1px solid #e0e0e0;font-size:12px">${label}</td>
        ${scores.map(s => {
          if (s === null) return `<td style="padding:5px 8px;border-bottom:1px solid #e0e0e0;text-align:center;color:#aaa;font-size:12px">N/A</td>`;
          const col = s < 25 ? '#888' : s < 50 ? '#c07000' : s < 75 ? '#d06000' : '#c02020';
          return `<td style="padding:5px 8px;border-bottom:1px solid #e0e0e0;text-align:center;font-weight:600;color:${col};font-size:12px">${s}</td>`;
        }).join('')}
        <td style="padding:5px 8px;border-bottom:1px solid #e0e0e0;text-align:center;font-size:11px;color:${sigCount>=2?'#2a7a2a':'#aaa'}">${sigCount >= 2 ? `${sigCount}/${drugs.length}` : '—'}</td>
      </tr>`).join('');

    // ── Circuit rows
    const drugCircuits = drugs.map(drug => {
      const circuits = new Set();
      if (drug.receptorKi) {
        for (const [r, ki] of Object.entries(drug.receptorKi)) {
          if (ki <= KI_SIG && RECEPTOR_CIRCUIT_MAP[r]) RECEPTOR_CIRCUIT_MAP[r].forEach(c => circuits.add(c));
        }
      }
      return { drug, circuits };
    });
    const allCircuits = new Set();
    drugCircuits.forEach(dc => dc.circuits.forEach(c => allCircuits.add(c)));
    const circuitData = [...allCircuits].map(circuit => {
      const mods = drugCircuits.filter(dc => dc.circuits.has(circuit));
      return { circuit, count: mods.length, drugs: mods.map(dc => dc.drug) };
    }).sort((a,b) => b.count - a.count);

    const circuitTableRows = circuitData.map(({circuit, count, drugs: mods}) => `
      <tr>
        <td style="padding:5px 8px;border-bottom:1px solid #e0e0e0;font-size:12px;font-weight:${count>=2?'600':'400'}">${circuit}</td>
        ${drugs.map(d => {
          const mod = mods.find(m => m.name === d.name);
          return `<td style="padding:5px 8px;border-bottom:1px solid #e0e0e0;text-align:center;font-size:13px">${mod ? '&#10003;' : ''}</td>`;
        }).join('')}
        <td style="padding:5px 8px;border-bottom:1px solid #e0e0e0;text-align:center;font-size:11px;color:${count>=2?'#2a7a2a':'#aaa'}">${count >= 2 ? `${count}/${drugs.filter(d=>d.receptorKi).length}` : '—'}</td>
      </tr>`).join('');

    // ── Conditions
    const sharedConds = new Map();
    circuitData.filter(c => c.count >= 2).forEach(c => {
      (CIRCUIT_CONDITIONS_MAP[c.circuit] || []).forEach(cond => {
        const ex = sharedConds.get(cond) || 0;
        sharedConds.set(cond, ex + 1);
      });
    });
    const condList = [...sharedConds.entries()].sort((a,b)=>b[1]-a[1])
      .map(([cond]) => `<span style="display:inline-block;margin:3px 4px;padding:3px 9px;background:#eaf2ea;border:1px solid #8aba8a;border-radius:12px;font-size:11px;color:#2a5a2a">${cond}</span>`)
      .join('');

    // ── Drug summary rows
    const drugSummaryRows = drugs.map((d, idx) => {
      const color = DRUG_COLORS[idx];
      return `<tr>
        <td style="padding:6px 10px;font-weight:700;color:${color};border-bottom:1px solid #e0e0e0">${d.name}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #e0e0e0;font-size:12px">${d.class || '—'}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #e0e0e0;font-size:12px">${d.halfLife?.drug || '—'}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #e0e0e0;font-size:12px">${d.mechanism || (d.receptorKi ? 'Receptor-mediated (see binding)' : '—')}</td>
      </tr>`;
    }).join('');

    const thStyle = 'padding:6px 8px;background:#f0f4f0;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#555;border-bottom:2px solid #c8d8c8';
    const thCenterStyle = thStyle + ';text-align:center';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Medication Comparison — ${drugs.map(d=>d.name).join(', ')}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 13px; color: #1a1a1a; background: #fff; padding: 28px 32px; }
  h1 { font-size: 20px; font-weight: 700; color: #1a3a1a; margin-bottom: 4px; }
  .subtitle { font-size: 12px; color: #666; margin-bottom: 6px; }
  .drugs-header { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; padding-bottom: 14px; border-bottom: 2px solid #2a7a2a; }
  .drug-chip { padding: 4px 14px; border-radius: 16px; font-size: 13px; font-weight: 700; color: #fff; }
  h2 { font-size: 14px; font-weight: 700; color: #1a3a1a; margin: 20px 0 8px; padding-bottom: 4px; border-bottom: 1px solid #c8d8c8; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  .caveat { font-size: 10px; color: #888; margin-top: 20px; padding-top: 10px; border-top: 1px solid #ddd; line-height: 1.5; }
  @media print {
    body { padding: 16px 20px; }
    @page { margin: 1.5cm; size: A4 landscape; }
  }
</style>
</head>
<body>
  <h1>Medication Comparison Report</h1>
  <div class="subtitle">Generated ${date} &nbsp;|&nbsp; PsychoPharmRef</div>
  <div class="drugs-header">
    ${drugs.map((d, idx) => `<span class="drug-chip" style="background:${DRUG_COLORS[idx]}">${d.name}</span>`).join('')}
  </div>

  <h2>Drug Summary</h2>
  <table>
    <thead><tr>
      <th style="${thStyle}">Drug</th>
      <th style="${thStyle}">Class</th>
      <th style="${thStyle}">Half-Life</th>
      <th style="${thStyle}">Mechanism</th>
    </tr></thead>
    <tbody>${drugSummaryRows}</tbody>
  </table>

  <h2>Receptor Binding (Ki, nM)</h2>
  <table>
    <thead><tr>
      <th style="${thStyle}">Receptor</th>
      ${drugs.map((d, idx) => `<th style="${thCenterStyle};color:${DRUG_COLORS[idx]}">${d.name}</th>`).join('')}
      <th style="${thCenterStyle}">Shared (&le;1000 nM)</th>
    </tr></thead>
    <tbody>${receptorTableRows}</tbody>
  </table>
  <p style="font-size:10px;color:#888;margin-top:4px">Ki color: <span style="color:#d94f30;font-weight:600">very high &lt;10</span> &nbsp; <span style="color:#c07000;font-weight:600">high &lt;100</span> &nbsp; <span style="color:#2060b0;font-weight:600">moderate &lt;1000</span></p>

  <h2>Predicted Side Effect Risk (0–100)</h2>
  <table>
    <thead><tr>
      <th style="${thStyle}">Side Effect</th>
      ${drugs.map((d, idx) => `<th style="${thCenterStyle};color:${DRUG_COLORS[idx]}">${d.name}</th>`).join('')}
      <th style="${thCenterStyle}">Shared Risk (&ge;25)</th>
    </tr></thead>
    <tbody>${seTableRows}</tbody>
  </table>
  <p style="font-size:10px;color:#888;margin-top:4px">Scores based on receptor binding profile and receptor–side effect weight mapping. Higher score = greater predicted risk.</p>

  <h2>Neuropsychiatric Circuits Modulated</h2>
  <table>
    <thead><tr>
      <th style="${thStyle}">Circuit</th>
      ${drugs.map((d, idx) => `<th style="${thCenterStyle};color:${DRUG_COLORS[idx]}">${d.name}</th>`).join('')}
      <th style="${thCenterStyle}">Overlap</th>
    </tr></thead>
    <tbody>${circuitTableRows}</tbody>
  </table>

  ${condList ? `<h2>Conditions Suggested by Shared Circuit Targets</h2>
  <div style="margin-top:6px">${condList}</div>` : ''}

  <p class="caveat">This report is generated for educational and clinical reference purposes only. Receptor binding values (Ki) are derived from in vitro pharmacology data and may not directly predict in vivo clinical effects. Side effect scores are modeled estimates based on receptor profiles and do not substitute for clinical judgment or individualized assessment. Circuit mapping is based on established neuroscience literature. Always verify with current FDA-approved labeling, clinical practice guidelines, and patient-specific factors. PsychoPharmRef assumes no liability for clinical decisions based on this report.</p>
</body>
</html>`;

    const win = window.open('', '_blank', 'width=1000,height=800');
    win.document.documentElement.innerHTML = html;
    win.focus();
    setTimeout(() => win.print(), 500);
  }

  /* ── Receptor Binding Tab ── */
  function renderReceptorTab(drugs) {
    // Find receptors where at least one drug has Ki ≤ KI_CHART
    const activeReceptors = RECEPTOR_LIST.filter(r =>
      drugs.some(d => d.receptorKi && (d.receptorKi[r] || 10000) <= KI_CHART)
    );

    // Rebuild chart
    const ctx = document.getElementById('mc-bar-chart');
    if (mcChart) { mcChart.destroy(); mcChart = null; }

    if (activeReceptors.length === 0) {
      ctx.closest('.mc-chart-wrap').innerHTML = '<p style="color:var(--text-muted);padding:20px">No receptor Ki data available for selected medications.</p>';
    } else {
      ctx.closest('.mc-chart-wrap').innerHTML = '<canvas id="mc-bar-chart"></canvas>';
      const newCtx = document.getElementById('mc-bar-chart');
      const datasets = drugs.map((drug, idx) => ({
        label: drug.name,
        data: activeReceptors.map(r => {
          if (!drug.receptorKi) return 0;
          const ki = drug.receptorKi[r] || 10000;
          const pki = ki < 10000 ? Math.max(0, 9 - Math.log10(ki)) : 0;
          return Math.round(pki * 100) / 100;
        }),
        backgroundColor: DRUG_COLORS[idx] + 'cc',
        borderColor: DRUG_COLORS[idx],
        borderWidth: 1,
        borderRadius: 3,
      }));
      mcChart = new Chart(newCtx, {
        type: 'bar',
        data: { labels: activeReceptors, datasets },
        options: {
          responsive: true,
          plugins: {
            legend: { labels: { color: '#c8bfb0', font: { size: 12 } } },
            tooltip: {
              callbacks: {
                label: ctx => {
                  const drug = drugs[ctx.datasetIndex];
                  if (!drug.receptorKi) return `${drug.name}: no data`;
                  const r = activeReceptors[ctx.dataIndex];
                  const ki = drug.receptorKi[r] || 10000;
                  return `${drug.name}: pKi ${ctx.parsed.y.toFixed(2)} (Ki=${ki} nM)`;
                }
              }
            }
          },
          scales: {
            x: { ticks: { color: '#9a9080' }, grid: { color: 'rgba(255,255,255,0.05)' } },
            y: {
              title: { display: true, text: 'pKi (−log₁₀ Ki)', color: '#9a9080' },
              ticks: { color: '#9a9080' },
              grid: { color: 'rgba(255,255,255,0.05)' },
              min: 0, max: 9
            }
          }
        }
      });
    }

    // Render Ki table
    const tableDiv = document.getElementById('mc-receptor-table');
    const rows = RECEPTOR_LIST.map(r => {
      const cells = drugs.map(d => {
        if (!d.receptorKi) return { ki: null, pki: 0, sig: false };
        const ki = d.receptorKi[r] || 10000;
        const pki = ki < 10000 ? (9 - Math.log10(ki)) : 0;
        return { ki, pki, sig: ki <= KI_SIG };
      });
      const anySig = cells.some(c => c.sig);
      return { r, cells, anySig };
    }).filter(row => row.cells.some(c => c.ki && c.ki < 10000));

    if (rows.length === 0) { tableDiv.innerHTML = ''; return; }

    tableDiv.innerHTML = `
      <table class="mc-ki-table">
        <thead>
          <tr>
            <th>Receptor</th>
            ${drugs.map((d,i) => `<th style="color:${DRUG_COLORS[i]}">${d.name}</th>`).join('')}
            <th>Shared High Affinity</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(({r, cells, anySig}) => {
            const sharedSig = cells.filter(c => c.sig).length;
            return `<tr class="${anySig ? 'mc-row-sig' : ''}">
              <td class="mc-r-name">${r}</td>
              ${cells.map(c => {
                if (!c.ki || c.ki >= 10000) return `<td class="mc-ki-cell mc-ki-none">—</td>`;
                const level = c.ki < 10 ? 'mc-ki-vhigh' : c.ki < 100 ? 'mc-ki-high' : c.ki < 1000 ? 'mc-ki-mod' : 'mc-ki-low';
                return `<td class="mc-ki-cell ${level}">${c.ki} nM</td>`;
              }).join('')}
              <td class="mc-shared-cell">${sharedSig >= 2 ? `<span class="mc-shared-badge">${sharedSig}/${drugs.length}</span>` : '<span class="mc-no-share">—</span>'}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
      <p class="mc-ki-legend">pKi bars show binding strength (higher = tighter). Ki threshold: <span class="mc-ki-vhigh" style="padding:1px 5px;border-radius:3px">very high &lt;10 nM</span> <span class="mc-ki-high" style="padding:1px 5px;border-radius:3px">high &lt;100</span> <span class="mc-ki-mod" style="padding:1px 5px;border-radius:3px">moderate &lt;1000</span></p>
    `;
  }

  /* ── Side Effects Tab ── */
  function renderSETab(drugs) {
    const container = document.getElementById('mc-se-content');
    const entries = Object.entries(SIDE_EFFECT_PROFILES).map(([key, profile]) => {
      const scores = drugs.map(d => ({ drug: d, score: sideEffectScore(d, key) }));
      const sigDrugs = scores.filter(s => s.score !== null && s.score >= 25);
      return { key, label: profile.label, scores, sigCount: sigDrugs.length,
               avgSig: sigDrugs.length ? Math.round(sigDrugs.reduce((a,b) => a + b.score, 0) / sigDrugs.length) : 0 };
    }).sort((a, b) => b.sigCount - a.sigCount || b.avgSig - a.avgSig);

    container.innerHTML = `
      <div class="mc-se-grid">
        ${entries.map(e => {
          const overlapClass = e.sigCount >= drugs.length ? 'mc-overlap-all' :
                               e.sigCount >= 2 ? 'mc-overlap-partial' : 'mc-overlap-none';
          return `
          <div class="mc-se-card ${overlapClass}">
            <div class="mc-se-header">
              <span class="mc-se-label">${e.label}</span>
              ${e.sigCount >= 2 ? `<span class="mc-overlap-badge">${e.sigCount === drugs.length ? 'All drugs' : `${e.sigCount}/${drugs.length} drugs`}</span>` : ''}
            </div>
            <div class="mc-se-bars">
              ${drugs.map((d, idx) => {
                const s = e.scores.find(x => x.drug === d);
                const score = s?.score ?? null;
                if (score === null) return `<div class="mc-se-bar-row"><span class="mc-se-bar-name" style="color:${DRUG_COLORS[idx]}">${d.name}</span><span class="mc-se-bar-na">no data</span></div>`;
                const rl = riskLabel(score);
                return `<div class="mc-se-bar-row">
                  <span class="mc-se-bar-name" style="color:${DRUG_COLORS[idx]}">${d.name}</span>
                  <div class="mc-se-bar-track"><div class="mc-se-bar-fill" style="width:${score}%;background:${DRUG_COLORS[idx]}66;border-right:2px solid ${DRUG_COLORS[idx]}"></div></div>
                  <span class="mc-se-bar-score ${rl.cls}">${score}</span>
                </div>`;
              }).join('')}
            </div>
          </div>`;
        }).join('')}
      </div>
      <p class="mc-ki-legend">Scores 0–100 based on receptor affinity vs. side-effect receptor weights. Cards highlighted when ≥2 drugs share moderate+ risk.</p>
    `;
  }

  /* ── Circuits & Conditions Tab ── */
  function renderCircuitTab(drugs) {
    const container = document.getElementById('mc-circuit-content');

    // Build circuit sets per drug
    const drugCircuits = drugs.map(drug => {
      const circuits = new Set();
      if (drug.receptorKi) {
        for (const [receptor, ki] of Object.entries(drug.receptorKi)) {
          if (ki <= KI_SIG && RECEPTOR_CIRCUIT_MAP[receptor]) {
            RECEPTOR_CIRCUIT_MAP[receptor].forEach(c => circuits.add(c));
          }
        }
      }
      return { drug, circuits };
    });

    // Find all circuits mentioned
    const allCircuits = new Set();
    drugCircuits.forEach(dc => dc.circuits.forEach(c => allCircuits.add(c)));

    // For each circuit, which drugs modulate it
    const circuitData = [...allCircuits].map(circuit => {
      const mods = drugCircuits.filter(dc => dc.circuits.has(circuit)).map(dc => dc.drug);
      const conditions = CIRCUIT_CONDITIONS_MAP[circuit] || [];
      return { circuit, mods, conditions };
    }).sort((a, b) => b.mods.length - a.mods.length);

    // Conditions implied by overlap (circuits shared by 2+ drugs)
    const sharedConditions = new Map();
    circuitData.filter(c => c.mods.length >= 2).forEach(c => {
      c.conditions.forEach(cond => {
        const existing = sharedConditions.get(cond) || { circuits: [], drugCount: 0 };
        existing.circuits.push(c.circuit);
        existing.drugCount = Math.max(existing.drugCount, c.mods.length);
        sharedConditions.set(cond, existing);
      });
    });

    const sortedConditions = [...sharedConditions.entries()]
      .sort((a, b) => b[1].circuits.length - a[1].circuits.length || b[1].drugCount - a[1].drugCount);

    const noDataDrugs = drugs.filter(d => !d.receptorKi);

    container.innerHTML = `
      ${noDataDrugs.length ? `<p class="ref-caveat" style="margin-bottom:16px">Note: ${noDataDrugs.map(d=>d.name).join(', ')} ${noDataDrugs.length===1?'does':'do'} not have Ki receptor data and ${noDataDrugs.length===1?'is':'are'} excluded from circuit analysis.</p>` : ''}

      <div class="mc-circuit-grid">
        ${circuitData.length === 0 ? '<p style="color:var(--text-muted)">No receptor binding data available for circuit mapping.</p>' :
          circuitData.map(c => {
            const overlapClass = c.mods.length >= drugs.filter(d=>d.receptorKi).length ? 'mc-overlap-all' :
                                 c.mods.length >= 2 ? 'mc-overlap-partial' : '';
            return `
            <div class="mc-circuit-card ${overlapClass}">
              <div class="mc-circuit-head">
                <span class="mc-circuit-name">${c.circuit}</span>
                <span class="mc-circuit-badge">${c.mods.length}/${drugs.filter(d=>d.receptorKi).length} drugs</span>
              </div>
              <div class="mc-circuit-drugs">
                ${c.mods.map(d => {
                  const idx = drugs.indexOf(d);
                  return `<span class="mc-circuit-drug" style="background:${DRUG_COLORS[idx]}22;color:${DRUG_COLORS[idx]};border-color:${DRUG_COLORS[idx]}55">${d.name}</span>`;
                }).join('')}
              </div>
              ${c.conditions.length ? `<div class="mc-circuit-conditions">${c.conditions.map(cond => `<span class="mc-cond-pill">${cond}</span>`).join('')}</div>` : ''}
            </div>`;
          }).join('')}
      </div>

      ${sortedConditions.length >= 1 ? `
      <div class="mc-conditions-summary">
        <h4 class="mc-summary-title">&#129504; Conditions Suggested by Circuit Overlap</h4>
        <p class="ref-card-sub" style="margin-bottom:14px">These conditions are linked to circuits modulated by 2 or more of the selected medications. A shared circuit target suggests potential efficacy or mechanistic relevance across these agents.</p>
        <div class="mc-cond-grid">
          ${sortedConditions.map(([cond, data]) => `
            <div class="mc-cond-card">
              <div class="mc-cond-name">${cond}</div>
              <div class="mc-cond-detail">${data.circuits.length} shared circuit${data.circuits.length > 1 ? 's' : ''}</div>
            </div>`).join('')}
        </div>
      </div>` : ''}
    `;
  }
}

/* ── Medication Taper / Start Scheduler ─────────────────────────────────── */
function initMedTaper() {

  // Populate drug dropdowns
  const taperOptions = MEDICATIONS.slice().sort((a,b) => a.name.localeCompare(b.name))
    .map(m => `<option value="${m.name}">${m.name} (${m.brandName.toUpperCase()})</option>`).join('');
  ['mt-drug-single','mt-drug-a','mt-drug-b'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = '<option value="">— Select —</option>' + taperOptions;
  });

  // Set today as default date
  const today = new Date().toISOString().split('T')[0];
  ['mt-start-date','mt-cross-date'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = today;
  });

  // Mode toggle
  document.querySelectorAll('.mt-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mt-mode-btn').forEach(b => b.classList.remove('mt-mode-btn--active'));
      btn.classList.add('mt-mode-btn--active');
      const mode = btn.dataset.mode;
      document.getElementById('mt-single-panel').style.display = mode === 'single' ? '' : 'none';
      document.getElementById('mt-cross-panel').style.display  = mode === 'cross'  ? '' : 'none';
    });
  });

  // Parse half-life string → hours (takes first numeric range midpoint)
  function parseHalfLifeHours(drug) {
    if (!drug || !drug.halfLife || !drug.halfLife.drug) return 24; // default 24h
    const str = drug.halfLife.drug;
    const nums = str.match(/[\d.]+/g);
    if (!nums) return 24;
    const values = nums.map(Number).filter(n => n > 0);
    if (values.length === 0) return 24;
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    // Convert to hours if string contains 'day'
    return str.toLowerCase().includes('day') ? avg * 24 : avg;
  }

  // Convert interval to days
  function intervalToDays(interval, unit, drugForHL) {
    if (unit === 'hours')    return interval / 24;
    if (unit === 'days')     return interval;
    if (unit === 'halflife') return (interval * parseHalfLifeHours(drugForHL)) / 24;
    return interval;
  }

  // Convert dose to mg (canonical unit for storage)
  function toMg(val, unit) {
    if (unit === 'mcg') return val / 1000;
    if (unit === 'g')   return val * 1000;
    return val; // mg
  }

  // Format dose: auto-choose best unit for display
  function formatDose(mg) {
    if (mg === 0) return '0 mg';
    if (mg < 0.1)    return (mg * 1000).toFixed(1) + ' mcg';
    if (mg >= 1000)  return (mg / 1000).toFixed(3).replace(/\.?0+$/, '') + ' g';
    // Round to avoid floating point noise
    const rounded = Math.round(mg * 1000) / 1000;
    return rounded + ' mg';
  }

  // Compute step delta in mg — percent always calculated from original starting dose
  function stepDeltaMg(currentMg, stepSize, stepType, startMg) {
    if (stepType === 'percent') return (startMg ?? currentMg) * (stepSize / 100);
    return toMg(stepSize, stepType);
  }

  // Generate a dose sequence (always auto-calculated from start → target)
  function generateSequence(startMg, targetMg, stepSize, stepType, direction) {
    // direction: 'taper' (down) or 'start' (up)
    const doses = [startMg];
    let current = startMg;
    const goingDown = direction === 'taper';
    const CAP = 200; // safety cap to prevent runaway loops

    for (let i = 0; i < CAP; i++) {
      const delta = stepDeltaMg(current, stepSize, stepType, startMg);
      if (delta <= 0) break;
      let next = goingDown ? current - delta : current + delta;
      if (goingDown) {
        next = Math.max(0, next);
        if (next <= targetMg + 0.0001) { doses.push(targetMg); break; }
      } else {
        if (next >= targetMg - 0.0001) { doses.push(targetMg); break; }
      }
      current = next;
      doses.push(Math.round(current * 10000) / 10000);
    }
    return doses;
  }

  // Build date list from start + intervalDays
  function buildDates(startDateStr, intervalDays, count) {
    const dates = [];
    const start = new Date(startDateStr + 'T00:00:00');
    for (let i = 0; i < count; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + Math.round(i * intervalDays));
      dates.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
    }
    return dates;
  }

  // Render single schedule output
  function renderSingleOutput(containerId, drugName, direction, doses, dates, intervalLabel) {
    const container = document.getElementById(containerId);
    const dirLabel  = direction === 'taper' ? '&#8595; Tapering Down' : '&#8593; Titrating Up';
    const lastDose  = doses[doses.length - 1];

    container.style.display = '';
    container.innerHTML = `
      <div class="mt-output-card">
        <div class="mt-output-header">
          <div>
            <span class="mt-output-drug">${drugName}</span>
            <span class="mt-output-dir">${dirLabel}</span>
          </div>
          <div class="mt-output-meta">
            ${doses.length} step${doses.length !== 1 ? 's' : ''} &nbsp;|&nbsp;
            ${intervalLabel} per step &nbsp;|&nbsp;
            Final dose: <strong>${formatDose(lastDose)}</strong>
          </div>
          <button class="mt-print-btn" onclick="window.print()">&#128438; Print / Save PDF</button>
        </div>
        <div class="mt-table-wrap">
          <table class="mt-schedule-table">
            <thead>
              <tr>
                <th>Step</th>
                <th>Date</th>
                <th>Daily Dose</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              ${doses.map((dose, i) => `
                <tr class="${dose === 0 ? 'mt-row-zero' : i === 0 ? 'mt-row-first' : ''}">
                  <td class="mt-step-num">${i === 0 ? 'Start' : i}</td>
                  <td>${dates[i] || '—'}</td>
                  <td class="mt-dose-cell"><strong>${formatDose(dose)}</strong></td>
                  <td class="mt-notes-cell">${dose === 0 ? 'Discontinue' : i === 0 ? 'Initial dose' : ''}</td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
        <p class="ref-caveat mt-output-caveat">This schedule is generated for reference only. Adjust timing and doses based on clinical response, tolerability, and patient-specific factors. Consult current prescribing guidelines.</p>
      </div>
    `;
  }

  // Render cross-taper output
  function renderCrossOutput(containerId, drugA, drugB, dosesA, dosesB, dates, intervalLabel) {
    const container = document.getElementById(containerId);
    const count = Math.max(dosesA.length, dosesB.length);
    container.style.display = '';
    container.innerHTML = `
      <div class="mt-output-card">
        <div class="mt-output-header">
          <div>
            <span class="mt-output-drug" style="color:#f47560">${drugA} &#8595;</span>
            <span style="color:var(--text-muted);margin:0 8px">/</span>
            <span class="mt-output-drug" style="color:#57c785">${drugB} &#8593;</span>
          </div>
          <div class="mt-output-meta">${count} steps &nbsp;|&nbsp; ${intervalLabel} per step</div>
          <button class="mt-print-btn" onclick="window.print()">&#128438; Print / Save PDF</button>
        </div>
        <div class="mt-table-wrap">
          <table class="mt-schedule-table">
            <thead>
              <tr>
                <th>Step</th>
                <th>Date</th>
                <th style="color:#f47560">${drugA} (&#8595; taper)</th>
                <th style="color:#57c785">${drugB} (&#8593; start)</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              ${Array.from({length: count}, (_, idx) => {
                const dA = dosesA[Math.min(idx, dosesA.length-1)];
                const dB = dosesB[Math.min(idx, dosesB.length-1)];
                return `
                <tr class="${idx === 0 ? 'mt-row-first' : ''}">
                  <td class="mt-step-num">${idx === 0 ? 'Start' : idx}</td>
                  <td>${dates[idx] || '—'}</td>
                  <td class="mt-dose-cell" style="color:#f47560"><strong>${formatDose(dA)}</strong></td>
                  <td class="mt-dose-cell" style="color:#57c785"><strong>${formatDose(dB)}</strong></td>
                  <td class="mt-notes-cell">${idx === 0 ? 'Cross-taper begins' : ''}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
        <p class="ref-caveat mt-output-caveat">Cross-taper schedules require close clinical monitoring. Overlap duration and dose ratio should be adjusted based on each drug's receptor profile, pharmacokinetics, and the patient's clinical response.</p>
      </div>
    `;
  }

  // ── Single Drug Generate ──
  document.getElementById('mt-generate-single').addEventListener('click', () => {
    const drugName   = document.getElementById('mt-drug-single').value;
    const direction  = document.querySelector('input[name="mt-dir"]:checked')?.value || 'taper';
    const startVal   = parseFloat(document.getElementById('mt-start-dose').value);
    const startUnit  = document.getElementById('mt-start-unit').value;
    const targetVal  = parseFloat(document.getElementById('mt-target-dose').value);
    const targetUnit = document.getElementById('mt-target-unit').value;
    const stepSize   = parseFloat(document.getElementById('mt-step-size').value);
    const stepType   = document.getElementById('mt-step-type').value;
    const interval   = parseFloat(document.getElementById('mt-interval').value);
    const intUnit    = document.getElementById('mt-interval-unit').value;
    const startDate  = document.getElementById('mt-start-date').value;

    if (!drugName || isNaN(startVal) || isNaN(stepSize) || isNaN(interval) || !startDate) {
      alert('Please fill in: Medication, Starting Dose, Step Size, Interval, and Start Date.');
      return;
    }

    const drug      = MEDICATIONS.find(m => m.name === drugName);
    const startMg   = toMg(startVal, startUnit);
    const targetMg  = isNaN(targetVal) ? 0 : toMg(targetVal, targetUnit);
    const intervalDays = intervalToDays(interval, intUnit, drug);

    const doses = generateSequence(startMg, targetMg, stepSize, stepType, direction);
    const dates = buildDates(startDate, intervalDays, doses.length);
    const intLabel = `${interval} ${intUnit}${intUnit === 'halflife' ? ` (≈${(intervalDays).toFixed(1)} days)` : ''}`;

    renderSingleOutput('mt-single-output', drugName, direction, doses, dates, intLabel);
    document.getElementById('mt-single-output').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // ── Cross-Taper Generate ──
  document.getElementById('mt-generate-cross').addEventListener('click', () => {
    const drugAName  = document.getElementById('mt-drug-a').value;
    const drugBName  = document.getElementById('mt-drug-b').value;
    const aStart     = parseFloat(document.getElementById('mt-a-start').value);
    const aStartUnit = document.getElementById('mt-a-start-unit').value;
    const aTarget    = parseFloat(document.getElementById('mt-a-target').value);
    const aTargetUnit= document.getElementById('mt-a-target-unit').value;
    const aStep      = parseFloat(document.getElementById('mt-a-step').value);
    const aStepType  = document.getElementById('mt-a-step-type').value;
    const bStart     = parseFloat(document.getElementById('mt-b-start').value);
    const bStartUnit = document.getElementById('mt-b-start-unit').value;
    const bTarget    = parseFloat(document.getElementById('mt-b-target').value);
    const bTargetUnit= document.getElementById('mt-b-target-unit').value;
    const bStep      = parseFloat(document.getElementById('mt-b-step').value);
    const bStepType  = document.getElementById('mt-b-step-type').value;
    const interval   = parseFloat(document.getElementById('mt-cross-interval').value);
    const intUnit    = document.getElementById('mt-cross-interval-unit').value;
    const startDate  = document.getElementById('mt-cross-date').value;

    if (!drugAName || !drugBName || isNaN(aStart) || isNaN(bStart) || isNaN(aStep) || isNaN(bStep) || isNaN(interval) || !startDate) {
      alert('Please fill in all required fields for both drugs.');
      return;
    }

    const drugA      = MEDICATIONS.find(m => m.name === drugAName);
    const aStartMg   = toMg(aStart, aStartUnit);
    const aTargetMg  = isNaN(aTarget) ? 0 : toMg(aTarget, aTargetUnit);
    const bStartMg   = toMg(bStart, bStartUnit);
    const bTargetMg  = isNaN(bTarget) ? aStartMg : toMg(bTarget, bTargetUnit);
    const intervalDays = intervalToDays(interval, intUnit, drugA);

    const dosesA = generateSequence(aStartMg, aTargetMg, aStep, aStepType, 'taper');
    const dosesB = generateSequence(bStartMg, bTargetMg, bStep, bStepType, 'start');
    const count  = Math.max(dosesA.length, dosesB.length);
    const dates  = buildDates(startDate, intervalDays, count);
    const intLabel = `${interval} ${intUnit}${intUnit === 'halflife' ? ` (≈${(intervalDays).toFixed(1)} days)` : ''}`;

    renderCrossOutput('mt-cross-output', drugAName, drugBName, dosesA, dosesB, dates, intLabel);
    document.getElementById('mt-cross-output').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

/* ── Mobile sidebar toggle ────────────────────────────────────────────── */
(function() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (!menuBtn || !sidebar || !overlay) return;

  function openSidebar() {
    sidebar.classList.add('sidebar-open');
    overlay.classList.add('overlay-visible');
    document.body.classList.add('sidebar-is-open');
  }
  function closeSidebar() {
    sidebar.classList.remove('sidebar-open');
    overlay.classList.remove('overlay-visible');
    document.body.classList.remove('sidebar-is-open');
  }

  menuBtn.addEventListener('click', function() {
    if (sidebar.classList.contains('sidebar-open')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  overlay.addEventListener('click', closeSidebar);
})()

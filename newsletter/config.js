// config.js — Newsletter pipeline configuration for PsychoPharmRef
//
// Structure (4-4-4, set 2026-04-16 — see Newsletter-Improvements-Plan.md):
//   S1 News & Regulatory:     approvals, pipeline, supply-generics, policy-fda-watch
//   S2 Educational/Evidence:  med-comparison, how-things-work, survey-review, adverse-effects
//   S3 Deep Dive:             diagnosis-history, drug-discovery, scientific-process, historical-legal
//
// Rotation: 16-letter Graeco-Latin square. anchorDate is letter 1; the next letter
// the pipeline generates is whatever (anchorLetterNumber + elapsed_weeks) resolves to.

const config = {
  blogBaseUrl: 'https://psychopharmref.com',

  topics: {
    // Section 1: News & Regulatory (4)
    's1-new-approvals': {
      section: 's1',
      label: 'Newly Approved Medications',
      handler: 'fetchFdaRss',
      focusArea: 'FDA drug approvals and new psychiatric medications',
    },
    's1-pipeline-drugs': {
      section: 's1',
      label: 'Pipeline Drugs',
      handler: 'fetchClinicalTrials',
      focusArea: 'psychiatric drug clinical trials (Phase 3 preferred, then Phase 2, then Phase 1)',
    },
    's1-supply-generics': {
      section: 's1',
      label: 'Supply & Generics',
      handler: 'fetchSupplyGenerics',
      focusArea: 'psychiatric drug supply shortages and recent generic approvals',
    },
    's1-policy-fda-watch': {
      section: 's1',
      label: 'Policy & FDA Watch',
      handler: 'fetchPolicyFdaWatch',
      focusArea: 'mental health legislation, FDA labeling/REMS/advisory decisions, and major guideline updates',
    },

    // Section 2: Educational / Evidence (4)
    's2-med-comparison': {
      section: 's2',
      label: 'Medication Comparison',
      handler: 'fetchMedComparison',
      focusArea: 'comparative psychiatric medication efficacy, tolerability, and dosing; landmark study revisits as fallback',
    },
    's2-how-things-work': {
      section: 's2',
      label: 'How It Works (Mechanism)',
      handler: 'fetchHowThingsWork',
      focusArea: 'psychiatric drug mechanism of action and receptor-level neuroscience',
    },
    's2-survey-review': {
      section: 's2',
      label: 'Clinical Rating Scale Review',
      handler: 'fetchSurveyReview',
      focusArea: 'psychiatric rating scales: history, validation, administration, scoring, and successors',
    },
    's2-adverse-effects': {
      section: 's2',
      label: 'Side-effect / Adverse-event Deep-dive',
      handler: 'fetchAdverseEffects',
      focusArea: 'clinically meaningful adverse effects of psychiatric medications, monitoring, and management',
    },

    // Section 3: Deep Dives (4, unchanged)
    // The `handler` field is documentation-only; the live dispatch is in
    // lib/research.js. All S3 topics now resolve to fetchS3WithFallback, which
    // wraps the underlying research call (the function still named
    // fetchPerplexity for backward compat — under the hood it calls xAI/Grok
    // with web_search as of 2026-05-21, when research/review roles swapped).
    's3-diagnosis-history': {
      section: 's3',
      label: 'History of a Diagnosis',
      handler: 'fetchS3WithFallback',
      focusArea: 'historical development and evolution of psychiatric diagnoses',
    },
    's3-drug-discovery': {
      section: 's3',
      label: 'Drug Discovery Story',
      handler: 'fetchS3WithFallback',
      focusArea: 'history and story of psychiatric drug discovery and development',
    },
    's3-scientific-process': {
      section: 's3',
      label: 'Scientific Process in Psychiatry',
      handler: 'fetchS3WithFallback',
      focusArea: 'scientific methodology, clinical trial design, and research process in psychiatry',
    },
    's3-historical-legal': {
      section: 's3',
      label: 'Historical / Legal Context',
      handler: 'fetchS3WithFallback',
      focusArea: 'historical and legal context of psychiatric treatment, policy, and ethics',
    },
  },

  // Recency cutoff in days — absence of key means no cutoff (S3 categories + evergreen)
  recencyCutoff: {
    's1-new-approvals': 90,
    's1-pipeline-drugs': 30,
    's1-supply-generics': 90,
    's1-policy-fda-watch': 30,
    's2-med-comparison': 365,
    's2-how-things-work': 365,
    's2-survey-review': 365,
    's2-adverse-effects': 365,
    // S3 categories: no key = no recency cutoff
  },

  // 16-letter Graeco-Latin rotation. sections.sN is the ordered list of topic keys
  // for that section; schedule[i] is a 1-indexed triple [s1Slot, s2Slot, s3Slot].
  // Verified properties: all 16 triples unique; (s1,s2), (s1,s3), (s2,s3) pairs all
  // unique; each topic per section appears exactly 4x; zero adjacent collisions.
  rotation: {
    anchorDate: '2026-04-17',        // letter 1 was sent on this date
    anchorLetterNumber: 1,
    cadenceDays: 7,                  // weekly
    sections: {
      s1: ['s1-new-approvals', 's1-pipeline-drugs', 's1-supply-generics', 's1-policy-fda-watch'],
      s2: ['s2-med-comparison', 's2-how-things-work', 's2-survey-review', 's2-adverse-effects'],
      s3: ['s3-diagnosis-history', 's3-drug-discovery', 's3-scientific-process', 's3-historical-legal'],
    },
    schedule: [
      [1, 1, 1], [2, 2, 2], [3, 3, 3], [4, 4, 4],
      [1, 2, 3], [2, 1, 4], [3, 4, 1], [4, 3, 2],
      [2, 4, 3], [1, 3, 4], [3, 1, 2], [4, 2, 1],
      [1, 4, 2], [2, 3, 1], [3, 2, 4], [4, 1, 3],
    ],
  },

  // Reviewer (Perplexity) model — used by lib/validator.js for factCheckBrief,
  // factCheckDraft, and surveyRecency. The env var PERPLEXITY_MODEL takes
  // precedence over this if set.
  perplexityModel: 'sonar-pro',

  // Researcher (xAI/Grok) model — used by lib/research.js fetchPerplexity()
  // (which despite the name now calls xAI's Responses API with web_search as
  // of 2026-05-21). The env var XAI_RESEARCH_MODEL takes precedence over this
  // if set. Set xaiResearchFallbackModel to a second model to enable the
  // two-pass rescue path, '' to disable.
  xaiResearchModel: 'grok-4-fast',
  xaiResearchFallbackModel: '',

  claudeModels: {
    default: 'claude-sonnet-4-6',
    s3: 'claude-opus-4-6',
  },

  cta: {
    commentsUrl: 'https://psychopharmref.com',
    upgradeUrl: 'https://psychopharmref.com',
  },

  maxBriefSources: 5,

  blogSimilarityThreshold: 0.15,

  evergreen: {
    // Rolling window: a specific evergreen angle cannot be selected again
    // until at least this many days have passed.
    repeatWindowDays: 365,
  },
};

export default config;

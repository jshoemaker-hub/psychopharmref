// config.js — Newsletter pipeline configuration for PsychoPharmRef
//
// Structure (3-1-1, revised 2026-08-26):
//   S1 Lead Essay:            approvals, pipeline, policy/FDA/access watch
//   S2 Site Update:           what is new on psychopharmref.com
//   S3 Literature Review:     popular psychopharmacology papers from the last 6 months
//
// Rotation: 3-letter lead-topic cycle. S2 and S3 are fixed recurring sections.

const config = {
  blogBaseUrl: 'https://psychopharmref.com',
  newsletterFormatVersion: 2,

  topics: {
    // Section 1: News & Regulatory (4)
    's1-new-approvals': {
      section: 's1',
      label: 'Newly Approved Medications',
      handler: 'fetchNewApprovals',
      focusArea: 'FDA drug approvals and new psychiatric medications',
      wordCount: '800-1000',
      maxTokens: 2600,
    },
    's1-pipeline-drugs': {
      section: 's1',
      label: 'Pipeline Drugs',
      handler: 'fetchPipelineDrugs',
      focusArea: 'psychiatric drug clinical trials (Phase 3 preferred, then Phase 2, then Phase 1)',
      wordCount: '800-1000',
      maxTokens: 2600,
    },
    // Retained for backward compatibility with older saved configs. The active
    // rotation folds supply/generic access into s1-policy-fda-watch.
    's1-supply-generics': {
      section: 's1',
      label: 'Supply & Generics',
      handler: 'fetchSupplyGenerics',
      focusArea: 'psychiatric drug supply shortages and recent generic approvals',
      wordCount: '900-1100',
      maxTokens: 2600,
    },
    's1-policy-fda-watch': {
      section: 's1',
      label: 'Policy, FDA Watch & Access',
      handler: 'fetchPolicyFdaWatch',
      focusArea: 'mental health legislation, FDA labeling/REMS/advisory decisions, supply shortages, generic approvals, access issues, and major guideline updates',
      wordCount: '800-1000',
      maxTokens: 2600,
    },

    // Section 2: recurring website update (active)
    's2-site-updates': {
      section: 's2',
      label: 'New on PsychoPharmRef',
      handler: 'fetchSiteUpdates',
      focusArea: 'new and recently updated clinical resources on psychopharmref.com',
      wordCount: '125-200',
      maxTokens: 700,
    },

    // Legacy Section 2 educational topics retained for older saved configs.
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

    // Section 3: recurring literature review (active)
    's3-popular-papers': {
      section: 's3',
      label: 'Popular Papers: Last 6 Months',
      handler: 'fetchPopularPapers',
      focusArea: 'most read, cited, discussed, downloaded, or otherwise high-attention peer-reviewed psychiatry and psychopharmacology papers published in the last six months; prioritize papers with practical implications for prescribing psychiatrists',
      wordCount: '650-850',
      maxTokens: 2000,
    },

    // Legacy Section 3 deep dives retained for older saved configs.
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
    's2-site-updates': 90,
    's2-med-comparison': 365,
    's2-how-things-work': 365,
    's2-survey-review': 365,
    's2-adverse-effects': 365,
    's3-popular-papers': 183,
    // Legacy S3 deep-dive categories: no key = no recency cutoff
  },

  // 3-letter rotation. S1 rotates the lead essay; S2/S3 are fixed recurring
  // sections. schedule[i] is a 1-indexed triple [s1Slot, s2Slot, s3Slot].
  rotation: {
    anchorDate: '2026-04-17',        // letter 1 was sent on this date
    anchorLetterNumber: 1,
    cadenceDays: 7,                  // weekly
    sections: {
      s1: ['s1-new-approvals', 's1-pipeline-drugs', 's1-policy-fda-watch'],
      s2: ['s2-site-updates'],
      s3: ['s3-popular-papers'],
    },
    schedule: [
      [1, 1, 1],
      [2, 1, 1],
      [3, 1, 1],
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

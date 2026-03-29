// config.js — Newsletter pipeline configuration for PsychoPharmRef

const config = {
  blogBaseUrl: 'https://psychopharmref.com',

  topics: {
    // Section 1: News & Regulatory
    's1-new-approvals': {
      section: 's1',
      label: 'Newly Approved Medications',
      handler: 'fetchFdaRss',
      focusArea: 'FDA drug approvals and new psychiatric medications',
    },
    's1-pipeline-drugs': {
      section: 's1',
      label: 'Phase 3 Pipeline Drugs',
      handler: 'fetchClinicalTrials',
      focusArea: 'Phase 3 psychiatric drug trials',
    },
    's1-generics': {
      section: 's1',
      label: 'Generic Drug Approvals',
      handler: 'fetchPerplexity',
      focusArea: 'FDA generic drug approvals for psychiatric medications',
    },
    's1-shortages': {
      section: 's1',
      label: 'Drug Supply Shortages',
      handler: 'fetchFdaRss',
      focusArea: 'psychiatric drug supply shortages and alternatives',
    },
    's1-legislation': {
      section: 's1',
      label: 'Mental Health Legislation',
      handler: 'fetchCongress',
      focusArea: 'mental health and psychopharmacology legislation and policy',
    },
    's1-psychiatry-news': {
      section: 's1',
      label: 'Psychiatry News',
      handler: 'fetchPerplexity',
      focusArea: 'recent psychiatry news, guideline updates, and clinical practice changes',
    },

    // Section 2: Educational / Evidence
    's2-med-comparison': {
      section: 's2',
      label: 'Medication Comparison',
      handler: 'fetchPerplexity',
      focusArea: 'comparative psychiatric medication efficacy, tolerability, and dosing',
    },
    's2-how-things-work': {
      section: 's2',
      label: 'How It Works (Mechanism)',
      handler: 'fetchPerplexity',
      focusArea: 'psychiatric drug mechanism of action, receptor pharmacology, and neuroscience',
    },
    's2-survey-review': {
      section: 's2',
      label: 'Survey / Systematic Review',
      handler: 'fetchPerplexity',
      focusArea: 'systematic reviews and meta-analyses in psychiatry and psychopharmacology',
    },

    // Section 3: Deep Dives
    's3-diagnosis-history': {
      section: 's3',
      label: 'History of a Diagnosis',
      handler: 'fetchPerplexity',
      focusArea: 'historical development and evolution of psychiatric diagnoses',
    },
    's3-drug-discovery': {
      section: 's3',
      label: 'Drug Discovery Story',
      handler: 'fetchPerplexity',
      focusArea: 'history and story of psychiatric drug discovery and development',
    },
    's3-scientific-process': {
      section: 's3',
      label: 'Scientific Process in Psychiatry',
      handler: 'fetchPerplexity',
      focusArea: 'scientific methodology, clinical trial design, and research process in psychiatry',
    },
    's3-historical-legal': {
      section: 's3',
      label: 'Historical / Legal Context',
      handler: 'fetchPerplexity',
      focusArea: 'historical and legal context of psychiatric treatment, policy, and ethics',
    },
  },

  // Recency cutoff in days — absence of key means no cutoff (S3 categories)
  recencyCutoff: {
    's1-new-approvals': 90,
    's1-pipeline-drugs': 30,
    's1-generics': 90,
    's1-shortages': 14,
    's1-legislation': 30,
    's1-psychiatry-news': 7,
    's2-med-comparison': 365,
    's2-how-things-work': 365,
    's2-survey-review': 365,
    // S3 categories: no key = no recency cutoff
  },

  perplexityModel: 'sonar-pro',

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
};

export default config;

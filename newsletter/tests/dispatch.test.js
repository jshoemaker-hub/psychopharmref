// tests/dispatch.test.js — updated 2026-08-26 for 3-1-1 active structure

import { dispatch } from '../lib/research.js';

const ACTIVE_TOPIC_KEYS = [
  // S1 lead essay rotation (3)
  's1-new-approvals',
  's1-pipeline-drugs',
  's1-policy-fda-watch',
  // S2 fixed middle section
  's2-site-updates',
  // S3 fixed paper review
  's3-popular-papers',
];

const LEGACY_TOPIC_KEYS = [
  // Retained for older saved configs
  's1-supply-generics',
  's2-med-comparison',
  's2-how-things-work',
  's2-survey-review',
  's2-adverse-effects',
  's3-diagnosis-history',
  's3-drug-discovery',
  's3-scientific-process',
  's3-historical-legal',
];

const ALL_TOPIC_KEYS = [...ACTIVE_TOPIC_KEYS, ...LEGACY_TOPIC_KEYS];

describe('dispatch table', () => {
  test('all active topic keys are present in dispatch', () => {
    ACTIVE_TOPIC_KEYS.forEach(key => {
      expect(dispatch).toHaveProperty(key);
    });
  });

  test('legacy topic keys are still present for old configs', () => {
    LEGACY_TOPIC_KEYS.forEach(key => {
      expect(dispatch).toHaveProperty(key);
    });
  });

  test('all known topic keys are present in dispatch', () => {
    ALL_TOPIC_KEYS.forEach(key => {
      expect(dispatch).toHaveProperty(key);
    });
  });

  test('all mapped values are functions', () => {
    ALL_TOPIC_KEYS.forEach(key => {
      expect(typeof dispatch[key]).toBe('function');
    });
  });

  test('retired topic keys are not in dispatch', () => {
    ['s1-generics', 's1-shortages', 's1-legislation', 's1-psychiatry-news'].forEach(key => {
      expect(dispatch[key]).toBeUndefined();
    });
  });

  test('unknown key is not in dispatch (or is undefined)', () => {
    expect(dispatch['s1-unknown-topic']).toBeUndefined();
    expect(dispatch['completely-made-up']).toBeUndefined();
    expect(dispatch['s4-nonexistent']).toBeUndefined();
  });

  test('dispatch has exactly 14 entries', () => {
    const keys = Object.keys(dispatch);
    expect(keys).toHaveLength(14);
  });

  test('active s1 section has 3 handlers', () => {
    const s1Keys = ACTIVE_TOPIC_KEYS.filter(k => k.startsWith('s1-'));
    expect(s1Keys).toHaveLength(3);
    s1Keys.forEach(key => {
      expect(typeof dispatch[key]).toBe('function');
    });
  });

  test('active s2 section has 1 handler', () => {
    const s2Keys = ACTIVE_TOPIC_KEYS.filter(k => k.startsWith('s2-'));
    expect(s2Keys).toHaveLength(1);
    s2Keys.forEach(key => {
      expect(typeof dispatch[key]).toBe('function');
    });
  });

  test('active s3 section has 1 handler', () => {
    const s3Keys = ACTIVE_TOPIC_KEYS.filter(k => k.startsWith('s3-'));
    expect(s3Keys).toHaveLength(1);
    s3Keys.forEach(key => {
      expect(typeof dispatch[key]).toBe('function');
    });
  });

  test('s1 handlers are the fallback-chain wrappers', () => {
    expect(dispatch['s1-new-approvals'].name).toBe('fetchNewApprovals');
    expect(dispatch['s1-pipeline-drugs'].name).toBe('fetchPipelineDrugs');
    expect(dispatch['s1-supply-generics'].name).toBe('fetchSupplyGenerics');
    expect(dispatch['s1-policy-fda-watch'].name).toBe('fetchPolicyFdaWatch');
  });

  test('new fixed section handlers are present', () => {
    expect(dispatch['s2-site-updates'].name).toBe('fetchSiteUpdates');
    expect(dispatch['s3-popular-papers'].name).toBe('fetchPopularPapers');
  });

  test('s2 handlers are the fallback-chain wrappers', () => {
    expect(dispatch['s2-med-comparison'].name).toBe('fetchMedComparison');
    expect(dispatch['s2-how-things-work'].name).toBe('fetchHowThingsWork');
    expect(dispatch['s2-survey-review'].name).toBe('fetchSurveyReview');
    expect(dispatch['s2-adverse-effects'].name).toBe('fetchAdverseEffects');
  });

  test('all s3 handlers are the fallback-chain wrapper (added 2026-05-08)', () => {
    // Previously dispatched direct to fetchPerplexity — a single transient
    // Perplexity 503 or timeout could blank an entire S3 section. Now wrapped
    // in fetchS3WithFallback so each S3 topic has a two-rung chain.
    ['s3-diagnosis-history', 's3-drug-discovery', 's3-scientific-process', 's3-historical-legal'].forEach(key => {
      expect(dispatch[key].name).toBe('fetchS3WithFallback');
    });
  });
});

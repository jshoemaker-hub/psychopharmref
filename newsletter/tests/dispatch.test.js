// tests/dispatch.test.js — updated 2026-04-16 for 4-4-4 structure

import { dispatch } from '../lib/research.js';

const ALL_TOPIC_KEYS = [
  // S1 (4)
  's1-new-approvals',
  's1-pipeline-drugs',
  's1-supply-generics',
  's1-policy-fda-watch',
  // S2 (4)
  's2-med-comparison',
  's2-how-things-work',
  's2-survey-review',
  's2-adverse-effects',
  // S3 (4, unchanged)
  's3-diagnosis-history',
  's3-drug-discovery',
  's3-scientific-process',
  's3-historical-legal',
];

describe('dispatch table', () => {
  test('all 12 topic keys are present in dispatch', () => {
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

  test('dispatch has exactly 12 entries', () => {
    const keys = Object.keys(dispatch);
    expect(keys).toHaveLength(12);
  });

  test('s1 section has 4 handlers', () => {
    const s1Keys = ALL_TOPIC_KEYS.filter(k => k.startsWith('s1-'));
    expect(s1Keys).toHaveLength(4);
    s1Keys.forEach(key => {
      expect(typeof dispatch[key]).toBe('function');
    });
  });

  test('s2 section has 4 handlers', () => {
    const s2Keys = ALL_TOPIC_KEYS.filter(k => k.startsWith('s2-'));
    expect(s2Keys).toHaveLength(4);
    s2Keys.forEach(key => {
      expect(typeof dispatch[key]).toBe('function');
    });
  });

  test('s3 section has 4 handlers', () => {
    const s3Keys = ALL_TOPIC_KEYS.filter(k => k.startsWith('s3-'));
    expect(s3Keys).toHaveLength(4);
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

  test('s2 handlers are the fallback-chain wrappers', () => {
    expect(dispatch['s2-med-comparison'].name).toBe('fetchMedComparison');
    expect(dispatch['s2-how-things-work'].name).toBe('fetchHowThingsWork');
    expect(dispatch['s2-survey-review'].name).toBe('fetchSurveyReview');
    expect(dispatch['s2-adverse-effects'].name).toBe('fetchAdverseEffects');
  });

  test('all s3 handlers are fetchPerplexity', () => {
    ['s3-diagnosis-history', 's3-drug-discovery', 's3-scientific-process', 's3-historical-legal'].forEach(key => {
      expect(dispatch[key].name).toBe('fetchPerplexity');
    });
  });
});

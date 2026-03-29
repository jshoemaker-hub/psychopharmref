// tests/dispatch.test.js

import { dispatch } from '../lib/research.js';

const ALL_TOPIC_KEYS = [
  's1-new-approvals',
  's1-pipeline-drugs',
  's1-generics',
  's1-shortages',
  's1-legislation',
  's1-psychiatry-news',
  's2-med-comparison',
  's2-how-things-work',
  's2-survey-review',
  's3-diagnosis-history',
  's3-drug-discovery',
  's3-scientific-process',
  's3-historical-legal',
];

describe('dispatch table', () => {
  test('all 13 topic keys are present in dispatch', () => {
    ALL_TOPIC_KEYS.forEach(key => {
      expect(dispatch).toHaveProperty(key);
    });
  });

  test('all mapped values are functions', () => {
    ALL_TOPIC_KEYS.forEach(key => {
      expect(typeof dispatch[key]).toBe('function');
    });
  });

  test('unknown key is not in dispatch (or is undefined)', () => {
    expect(dispatch['s1-unknown-topic']).toBeUndefined();
    expect(dispatch['completely-made-up']).toBeUndefined();
    expect(dispatch['s4-nonexistent']).toBeUndefined();
  });

  test('dispatch has exactly 13 entries', () => {
    const keys = Object.keys(dispatch);
    expect(keys).toHaveLength(13);
  });

  test('s1 section has 6 handlers', () => {
    const s1Keys = ALL_TOPIC_KEYS.filter(k => k.startsWith('s1-'));
    expect(s1Keys).toHaveLength(6);
    s1Keys.forEach(key => {
      expect(typeof dispatch[key]).toBe('function');
    });
  });

  test('s2 section has 3 handlers', () => {
    const s2Keys = ALL_TOPIC_KEYS.filter(k => k.startsWith('s2-'));
    expect(s2Keys).toHaveLength(3);
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

  test('s1-new-approvals handler is fetchFdaRss', () => {
    // Verify by name (toString check) or just that it's a function
    expect(typeof dispatch['s1-new-approvals']).toBe('function');
    // The function name should indicate fetchFdaRss
    expect(dispatch['s1-new-approvals'].name).toBe('fetchFdaRss');
  });

  test('s1-pipeline-drugs handler is fetchClinicalTrials', () => {
    expect(dispatch['s1-pipeline-drugs'].name).toBe('fetchClinicalTrials');
  });

  test('s1-legislation handler is fetchCongress', () => {
    expect(dispatch['s1-legislation'].name).toBe('fetchCongress');
  });

  test('s1-generics handler is fetchPerplexity', () => {
    expect(dispatch['s1-generics'].name).toBe('fetchPerplexity');
  });

  test('all s3 handlers are fetchPerplexity', () => {
    ['s3-diagnosis-history', 's3-drug-discovery', 's3-scientific-process', 's3-historical-legal'].forEach(key => {
      expect(dispatch[key].name).toBe('fetchPerplexity');
    });
  });
});

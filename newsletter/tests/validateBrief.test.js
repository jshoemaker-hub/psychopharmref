// tests/validateBrief.test.js

import { validateBrief } from '../lib/research.js';

describe('validateBrief', () => {
  test('valid brief passes through unchanged', () => {
    const brief = {
      topic: 's1-new-approvals',
      sources: [
        {
          title: 'FDA Approves Drug X',
          url: 'https://fda.gov/drug-x',
          publishedDate: '2026-01-15',
          retrievedDate: '2026-03-29',
          excerpt: 'Drug X was approved for...',
        },
      ],
      relevantBlogPosts: [],
      warnings: [],
    };

    const result = validateBrief(brief);
    expect(result.topic).toBe('s1-new-approvals');
    expect(result.sources).toHaveLength(1);
    expect(result.sources[0].title).toBe('FDA Approves Drug X');
    expect(result.warnings).toHaveLength(0);
    expect(result.relevantBlogPosts).toEqual([]);
  });

  test('missing topic returns fallback with warning', () => {
    const brief = {
      sources: [{ title: 'Test', url: 'https://example.com', publishedDate: '', retrievedDate: '', excerpt: '' }],
      relevantBlogPosts: [],
      warnings: [],
    };

    const result = validateBrief(brief);
    expect(result.topic).toBe('unknown');
    expect(result.sources).toEqual([]);
    expect(result.warnings).toHaveLength(1);
    expect(result.warnings[0]).toMatch(/validation failed/);
    expect(result.warnings[0]).toMatch(/topic/);
  });

  test('sources not an array returns fallback with warning', () => {
    const brief = {
      topic: 's2-med-comparison',
      sources: 'not an array',
      relevantBlogPosts: [],
      warnings: [],
    };

    const result = validateBrief(brief);
    expect(result.topic).toBe('s2-med-comparison');
    expect(result.sources).toEqual([]);
    expect(result.warnings).toHaveLength(1);
    expect(result.warnings[0]).toMatch(/validation failed/);
    expect(result.warnings[0]).toMatch(/sources/);
  });

  test('null brief returns fallback', () => {
    const result = validateBrief(null);
    expect(result.topic).toBe('unknown');
    expect(result.sources).toEqual([]);
    expect(result.warnings).toHaveLength(1);
    expect(result.warnings[0]).toMatch(/validation failed/);
  });

  test('brief with missing relevantBlogPosts defaults to empty array', () => {
    const brief = {
      topic: 's1-generics',
      sources: [],
    };

    const result = validateBrief(brief);
    expect(result.relevantBlogPosts).toEqual([]);
    expect(result.warnings).toEqual([]);
  });

  test('existing warnings are preserved', () => {
    const brief = {
      topic: 's3-drug-discovery',
      sources: [],
      warnings: ['Perplexity unavailable'],
      relevantBlogPosts: [],
    };

    const result = validateBrief(brief);
    expect(result.warnings).toContain('Perplexity unavailable');
  });
});

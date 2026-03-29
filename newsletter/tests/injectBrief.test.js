// tests/injectBrief.test.js

import { injectBrief, buildRecencyGuard } from '../lib/draft.js';

const mockConfig = {
  recencyCutoff: {
    's1-new-approvals': 90,
    's1-pipeline-drugs': 30,
    's2-med-comparison': 365,
    // s3 topics intentionally absent
  },
};

describe('injectBrief', () => {
  test('brief with sources includes title, url, and publishedDate', () => {
    const brief = {
      topic: 's1-new-approvals',
      sources: [
        {
          title: 'FDA Approves Brexpiprazole Extension',
          url: 'https://fda.gov/brexpiprazole',
          publishedDate: '2026-01-10',
          retrievedDate: '2026-03-29',
          excerpt: 'The FDA approved a new indication...',
        },
      ],
      relevantBlogPosts: [],
      warnings: [],
    };

    const result = injectBrief('Template text\n\n{BRIEF_INJECTION}', brief, '');
    expect(result).toContain('FDA Approves Brexpiprazole Extension');
    expect(result).toContain('https://fda.gov/brexpiprazole');
    expect(result).toContain('2026-01-10');
  });

  test('brief with warnings includes warnings section', () => {
    const brief = {
      topic: 's1-shortages',
      sources: [],
      relevantBlogPosts: [],
      warnings: ['FDA RSS unavailable', 'No sources fetched'],
    };

    const result = injectBrief('Template\n\n{BRIEF_INJECTION}', brief, '');
    expect(result).toContain('Warnings');
    expect(result).toContain('FDA RSS unavailable');
    expect(result).toContain('No sources fetched');
  });

  test('empty relevantBlogPosts produces no "Further reading" line', () => {
    const brief = {
      topic: 's2-how-things-work',
      sources: [{ title: 'Test', url: 'https://example.com', publishedDate: '2026-01-01', retrievedDate: '2026-03-29', excerpt: '' }],
      relevantBlogPosts: [],
      warnings: [],
    };

    const result = injectBrief('Template\n\n{BRIEF_INJECTION}', brief, '');
    expect(result).not.toContain('Further reading');
    expect(result).not.toContain('PsychoPharmRef posts');
  });

  test('non-empty relevantBlogPosts includes "Further reading" section', () => {
    const brief = {
      topic: 's1-new-approvals',
      sources: [],
      relevantBlogPosts: [
        { title: 'Clozapine Monitoring Guide', url: 'https://psychopharmref.com/blog/clozapine.html', similarity: 0.42 },
      ],
      warnings: [],
    };

    const result = injectBrief('Template\n\n{BRIEF_INJECTION}', brief, '');
    expect(result).toContain('Relevant PsychoPharmRef posts');
    expect(result).toContain('Clozapine Monitoring Guide');
    expect(result).toContain('https://psychopharmref.com/blog/clozapine.html');
  });

  test('similarity score is NOT included in injection text', () => {
    const brief = {
      topic: 's1-new-approvals',
      sources: [],
      relevantBlogPosts: [
        { title: 'Some Post', url: 'https://psychopharmref.com/blog/some.html', similarity: 0.87 },
      ],
      warnings: [],
    };

    const result = injectBrief('Template\n\n{BRIEF_INJECTION}', brief, '');
    // Similarity score value should NOT appear in the injected text
    expect(result).not.toContain('0.87');
    expect(result).not.toContain('similarity');
  });

  test('appends to template when no {BRIEF_INJECTION} placeholder', () => {
    const brief = {
      topic: 's3-drug-discovery',
      sources: [{ title: 'History of Lithium', url: 'https://example.com', publishedDate: '2025-06-01', retrievedDate: '2026-03-29', excerpt: 'Lithium was first used...' }],
      relevantBlogPosts: [],
      warnings: [],
    };

    const result = injectBrief('Just a plain template.', brief, '');
    expect(result).toContain('Just a plain template.');
    expect(result).toContain('---RESEARCH BRIEF---');
    expect(result).toContain('History of Lithium');
  });
});

describe('buildRecencyGuard', () => {
  test('topic with cutoff returns a guard paragraph', () => {
    const guard = buildRecencyGuard('s1-new-approvals', mockConfig);
    expect(guard).toBeTruthy();
    expect(guard).toContain('Today is');
    expect(guard).toContain('ONLY treat information published');
  });

  test('s1-pipeline-drugs (30-day cutoff) returns guard paragraph', () => {
    const guard = buildRecencyGuard('s1-pipeline-drugs', mockConfig);
    expect(guard).toBeTruthy();
    expect(guard.length).toBeGreaterThan(20);
  });

  test('s3 topic with no cutoff key returns empty string', () => {
    const guard = buildRecencyGuard('s3-drug-discovery', mockConfig);
    expect(guard).toBe('');
  });

  test('s3-historical-legal returns empty string', () => {
    const guard = buildRecencyGuard('s3-historical-legal', mockConfig);
    expect(guard).toBe('');
  });

  test('s3-diagnosis-history returns empty string', () => {
    const guard = buildRecencyGuard('s3-diagnosis-history', mockConfig);
    expect(guard).toBe('');
  });

  test('recency guard injected into brief output when present', () => {
    const brief = {
      topic: 's1-new-approvals',
      sources: [],
      relevantBlogPosts: [],
      warnings: [],
    };
    const guard = buildRecencyGuard('s1-new-approvals', mockConfig);
    const result = injectBrief('Template\n\n{BRIEF_INJECTION}', brief, guard);
    expect(result).toContain('Today is');
    expect(result).toContain('ONLY treat information');
  });

  test('no recency guard for s3 topic in full injection', () => {
    const brief = {
      topic: 's3-drug-discovery',
      sources: [],
      relevantBlogPosts: [],
      warnings: [],
    };
    const guard = buildRecencyGuard('s3-drug-discovery', mockConfig);
    const result = injectBrief('Template\n\n{BRIEF_INJECTION}', brief, guard);
    expect(result).not.toContain('Today is');
    expect(result).not.toContain('ONLY treat information');
  });
});

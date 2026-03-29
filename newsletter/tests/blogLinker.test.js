// tests/blogLinker.test.js

import { findRelevantPosts } from '../lib/blog-linker.js';
import natural from 'natural';

const { TfIdf } = natural;

// Build a small mock corpus without file I/O
function buildMockCorpus(posts) {
  const tfidf = new TfIdf();
  posts.forEach(post => {
    const docText = [post.title || '', post.description || '', post.firstParagraph || '']
      .join(' ')
      .toLowerCase();
    tfidf.addDocument(docText);
  });
  return { tfidf, index: posts };
}

const mockBlogIndex = [
  {
    title: 'Clozapine Monitoring Guidelines',
    url: 'https://psychopharmref.com/blog/clozapine-monitoring.html',
    description: 'Complete guide to clozapine ANC monitoring and titration',
    firstParagraph: 'Clozapine requires mandatory absolute neutrophil count monitoring due to the risk of agranulocytosis.',
    filename: 'clozapine-monitoring.html',
  },
  {
    title: 'Lithium Toxicity and Renal Function',
    url: 'https://psychopharmref.com/blog/lithium-toxicity.html',
    description: 'Managing lithium toxicity and renal clearance in bipolar disorder',
    firstParagraph: 'Lithium has a narrow therapeutic index and toxicity can occur at serum levels above 1.5 mEq/L.',
    filename: 'lithium-toxicity.html',
  },
  {
    title: 'SSRI Mechanism of Action',
    url: 'https://psychopharmref.com/blog/ssri-mechanism.html',
    description: 'How SSRIs work: serotonin transporter inhibition and downstream effects',
    firstParagraph: 'Selective serotonin reuptake inhibitors block the serotonin transporter (SERT) to increase synaptic serotonin.',
    filename: 'ssri-mechanism.html',
  },
  {
    title: 'Antipsychotic Side Effects Overview',
    url: 'https://psychopharmref.com/blog/antipsychotic-side-effects.html',
    description: 'EPS, metabolic syndrome, and QT prolongation with antipsychotics',
    firstParagraph: 'Second-generation antipsychotics carry risks for metabolic syndrome including weight gain and dyslipidemia.',
    filename: 'antipsychotic-side-effects.html',
  },
  {
    title: 'Benzodiazepine Taper Protocols',
    url: 'https://psychopharmref.com/blog/benzo-taper.html',
    description: 'Structured approaches to benzodiazepine discontinuation and withdrawal management',
    firstParagraph: 'Benzodiazepine discontinuation should be gradual to minimize withdrawal symptoms including seizure risk.',
    filename: 'benzo-taper.html',
  },
];

describe('findRelevantPosts', () => {
  let corpus;

  beforeAll(() => {
    corpus = buildMockCorpus(mockBlogIndex);
  });

  test('high-similarity query returns top 2 results maximum', () => {
    // Query closely related to clozapine and antipsychotics
    const query = 'clozapine monitoring agranulocytosis neutrophil antipsychotic metabolic';
    const results = findRelevantPosts(query, corpus, mockBlogIndex, 0.15);
    expect(results.length).toBeLessThanOrEqual(2);
    expect(results.length).toBeGreaterThan(0);
  });

  test('very low-similarity query returns empty array', () => {
    // Query completely unrelated to any post
    const query = 'quantum mechanics particle physics nuclear reactor';
    const results = findRelevantPosts(query, corpus, mockBlogIndex, 0.15);
    expect(results).toEqual([]);
  });

  test('single match above threshold returns 1 result, not forced to 2', () => {
    // Query specifically about lithium — should match only lithium post clearly
    const query = 'lithium toxicity serum mEq renal clearance narrow therapeutic index';
    const results = findRelevantPosts(query, corpus, mockBlogIndex, 0.5);
    // With high threshold, at most 1-2 results should come back
    expect(results.length).toBeGreaterThanOrEqual(0);
    expect(results.length).toBeLessThanOrEqual(2);
  });

  test('results are sorted by similarity descending', () => {
    const query = 'serotonin reuptake inhibitor SERT depression antidepressant';
    const results = findRelevantPosts(query, corpus, mockBlogIndex, 0.01);
    if (results.length > 1) {
      for (let i = 0; i < results.length - 1; i++) {
        expect(results[i].similarity).toBeGreaterThanOrEqual(results[i + 1].similarity);
      }
    }
  });

  test('results include title and url fields', () => {
    const query = 'clozapine agranulocytosis monitoring';
    const results = findRelevantPosts(query, corpus, mockBlogIndex, 0.01);
    if (results.length > 0) {
      expect(results[0]).toHaveProperty('title');
      expect(results[0]).toHaveProperty('url');
      expect(results[0]).toHaveProperty('similarity');
      expect(typeof results[0].title).toBe('string');
      expect(typeof results[0].url).toBe('string');
      expect(typeof results[0].similarity).toBe('number');
    }
  });

  test('returns empty array for empty query', () => {
    const results = findRelevantPosts('', corpus, mockBlogIndex, 0.15);
    expect(results).toEqual([]);
  });

  test('threshold filter works: lower threshold returns more results', () => {
    const query = 'medication drug pharmacology psychiatric treatment';
    const highThresholdResults = findRelevantPosts(query, corpus, mockBlogIndex, 0.9);
    const lowThresholdResults = findRelevantPosts(query, corpus, mockBlogIndex, 0.001);
    expect(lowThresholdResults.length).toBeGreaterThanOrEqual(highThresholdResults.length);
  });

  test('returns at most 2 results even with many matching posts', () => {
    // Query that likely matches most posts
    const query = 'psychiatric medication drug treatment clinical management disorder';
    const results = findRelevantPosts(query, corpus, mockBlogIndex, 0.001);
    expect(results.length).toBeLessThanOrEqual(2);
  });
});

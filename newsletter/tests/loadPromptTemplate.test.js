// tests/loadPromptTemplate.test.js

import { loadPromptTemplate } from '../lib/draft.js';

describe('loadPromptTemplate', () => {
  test('s1-new-approvals.md exists and loads', () => {
    const template = loadPromptTemplate('s1-new-approvals');
    expect(typeof template).toBe('string');
    expect(template.length).toBeGreaterThan(50);
  });

  test('PERPLEXITY_QUERY comment block is stripped', () => {
    const template = loadPromptTemplate('s1-new-approvals');
    expect(template).not.toContain('PERPLEXITY_QUERY');
    expect(template).not.toContain('<!-- PERPLEXITY_QUERY');
  });

  test('RECENCY_GUARD marker comment line is stripped', () => {
    const template = loadPromptTemplate('s1-new-approvals');
    expect(template).not.toContain('[RECENCY_GUARD');
    expect(template).not.toContain('do not include it manually');
  });

  test('YAML frontmatter remains in template (not stripped by loadPromptTemplate)', () => {
    const template = loadPromptTemplate('s1-new-approvals');
    // Frontmatter is present — generation strips only the PERPLEXITY_QUERY comment and RECENCY_GUARD lines
    // The actual system prompt content should be there
    expect(template).toContain('clinical');
  });

  test('missing template file falls back to generic template', () => {
    // This key has no .md file in prompts/
    const template = loadPromptTemplate('s1-nonexistent-topic-xyzzy');
    expect(typeof template).toBe('string');
    expect(template.length).toBeGreaterThan(20);
    // Generic template should contain BRIEF_INJECTION placeholder
    expect(template).toContain('{BRIEF_INJECTION}');
  });

  test('generic fallback template does not throw', () => {
    expect(() => loadPromptTemplate('unknown-topic-abc')).not.toThrow();
  });

  test('returned template still contains BRIEF_INJECTION placeholder', () => {
    const template = loadPromptTemplate('s1-new-approvals');
    expect(template).toContain('{BRIEF_INJECTION}');
  });

  test('does not contain raw HTML comment syntax after processing', () => {
    const template = loadPromptTemplate('s1-new-approvals');
    // The perplexity query comment block should be fully removed
    expect(template).not.toMatch(/<!--\s*PERPLEXITY_QUERY/);
  });
});

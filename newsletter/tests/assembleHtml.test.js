// tests/assembleHtml.test.js

import { assembleHtml } from '../lib/draft.js';

const mockCta = {
  commentsUrl: 'https://psychopharmref.com',
  upgradeUrl: 'https://psychopharmref.com/upgrade',
};

describe('assembleHtml', () => {
  test('all 3 sections produce HTML with 3 <!-- Section --> comments', () => {
    const sections = [
      '<p>Section one content.</p>',
      '<p>Section two content.</p>',
      '<p>Section three content.</p>',
    ];
    const blogPosts = [[], [], []];

    const html = assembleHtml(sections, blogPosts, mockCta);
    expect(html).toContain('<!-- Section 1 -->');
    expect(html).toContain('<!-- Section 2 -->');
    expect(html).toContain('<!-- Section 3 -->');
  });

  test('assembled HTML includes all section content', () => {
    const sections = [
      '<p>First section.</p>',
      '<p>Second section.</p>',
      '<p>Third section.</p>',
    ];
    const blogPosts = [[], [], []];

    const html = assembleHtml(sections, blogPosts, mockCta);
    expect(html).toContain('First section.');
    expect(html).toContain('Second section.');
    expect(html).toContain('Third section.');
  });

  test('assembled HTML includes CTA block', () => {
    const sections = ['<p>A.</p>', '<p>B.</p>', '<p>C.</p>'];
    const blogPosts = [[], [], []];

    const html = assembleHtml(sections, blogPosts, mockCta);
    expect(html).toContain('<!-- CTA -->');
    expect(html).toContain(mockCta.commentsUrl);
    expect(html).toContain(mockCta.upgradeUrl);
  });

  test('section with blog post includes "Further reading" paragraph', () => {
    const sections = ['<p>Content.</p>', '<p>Content.</p>', '<p>Content.</p>'];
    const blogPosts = [
      [{ title: 'Clozapine Guide', url: 'https://psychopharmref.com/blog/clozapine.html', similarity: 0.5 }],
      [],
      [],
    ];

    const html = assembleHtml(sections, blogPosts, mockCta);
    expect(html).toContain('Further reading on PsychoPharmRef');
    expect(html).toContain('Clozapine Guide');
    expect(html).toContain('https://psychopharmref.com/blog/clozapine.html');
  });

  test('section without blog post has no "Further reading" for that section', () => {
    const sections = ['<p>S1.</p>', '<p>S2.</p>', '<p>S3.</p>'];
    const blogPosts = [
      [],
      [{ title: 'Some Post', url: 'https://psychopharmref.com/blog/some.html', similarity: 0.3 }],
      [],
    ];

    const html = assembleHtml(sections, blogPosts, mockCta);
    // Should have exactly one "Further reading" (for S2)
    const count = (html.match(/Further reading on PsychoPharmRef/g) || []).length;
    expect(count).toBe(1);
    expect(html).toContain('Some Post');
  });

  test('HTML contains hr separators between sections', () => {
    const sections = ['<p>A.</p>', '<p>B.</p>', '<p>C.</p>'];
    const blogPosts = [[], [], []];

    const html = assembleHtml(sections, blogPosts, mockCta);
    const hrCount = (html.match(/<hr \/>/g) || []).length;
    expect(hrCount).toBe(3); // one after each section including after S3
  });

  test('multiple blog posts in one section produces multiple links', () => {
    const sections = ['<p>S1.</p>', '<p>S2.</p>', '<p>S3.</p>'];
    const blogPosts = [
      [
        { title: 'Post A', url: 'https://psychopharmref.com/blog/a.html', similarity: 0.6 },
        { title: 'Post B', url: 'https://psychopharmref.com/blog/b.html', similarity: 0.4 },
      ],
      [],
      [],
    ];

    const html = assembleHtml(sections, blogPosts, mockCta);
    expect(html).toContain('Post A');
    expect(html).toContain('Post B');
  });

  test('assembleHtml with DRAFT FAILED comment still produces valid structure', () => {
    const sections = [
      '<!-- DRAFT FAILED: API error — fill manually -->',
      '<p>S2 content.</p>',
      '<p>S3 content.</p>',
    ];
    const blogPosts = [[], [], []];

    const html = assembleHtml(sections, blogPosts, mockCta);
    expect(html).toContain('DRAFT FAILED');
    expect(html).toContain('S2 content');
    expect(html).toContain('<!-- CTA -->');
  });
});

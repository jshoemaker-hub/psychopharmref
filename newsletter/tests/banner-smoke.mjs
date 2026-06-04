import { assembleHtml, extractBodyOnly, renderConflictBanner } from '../lib/draft.js';

const flaggedBrief = {
  topic: 's1-test',
  xaiSummary: 'Source 2 has a critical drug-class error.',
  xaiConflicts: [
    {
      sourceIndex: 2,
      sourceTitle: 'Lithium is a benzodiazepine commonly used for ADHD',
      sourceUrl: 'https://example.com/2',
      severity: 'high',
      reasoning: 'Lithium is a mood stabilizer, not a benzodiazepine, and is not approved for ADHD.',
    },
    {
      sourceIndex: 3,
      sourceTitle: 'Fluoxetine half-life is 4 hours',
      sourceUrl: 'https://example.com/3',
      severity: 'medium',
      reasoning: 'Fluoxetine half-life is 1–4 days; norfluoxetine is 7–15 days.',
    },
  ],
};

const cleanBrief = { topic: 's2-clean', xaiConflicts: [], xaiSummary: '' };
const briefs = [flaggedBrief, cleanBrief, cleanBrief];

const sections = [
  '<h2>Section 1</h2><p>S1 body content here.</p>',
  '<h2>Section 2</h2><p>S2 body content here.</p>',
  '<h2>Section 3</h2><p>S3 body content here.</p>',
];
const blogPosts = [[], [], []];
const cta = { commentsUrl: 'https://psychopharmref.com', upgradeUrl: 'https://psychopharmref.com' };
const meta = { title: 't', subtitle: 's', subject: 'sj', previewText: 'pv' };

const fullHtml = assembleHtml(sections, blogPosts, cta, meta, '2026-04-26', briefs);
const bodyHtml = extractBodyOnly(fullHtml);

console.log('=== ASSERTIONS ===');

const hasBannerInFull = fullHtml.includes('REVIEW ONLY — xAI flagged 2 source');
console.log('Full HTML contains banner header:', hasBannerInFull, ' (expected: true)');

const hasMarkersInFull = fullHtml.includes('<!-- REVIEW_ONLY_START -->') && fullHtml.includes('<!-- REVIEW_ONLY_END -->');
console.log('Full HTML contains REVIEW_ONLY markers:', hasMarkersInFull, ' (expected: true)');

const bodyHasBanner = bodyHtml.includes('REVIEW ONLY') || bodyHtml.includes('xAI flagged') || bodyHtml.includes('REVIEW_ONLY');
console.log('Clipboard body contains banner content:', bodyHasBanner, ' (expected: false)');

const bodyHasContent = bodyHtml.includes('S1 body content here') && bodyHtml.includes('S2 body content here');
console.log('Clipboard body contains real section content:', bodyHasContent, ' (expected: true)');

const cleanOnly = renderConflictBanner(cleanBrief, 'Section 2');
console.log('Clean brief produces empty banner:', cleanOnly === '', ' (expected: true)');

const noBriefs = assembleHtml(sections, blogPosts, cta, meta, '2026-04-26');
const noBriefsHasBanner = noBriefs.includes('REVIEW ONLY');
console.log('Backwards-compat (no briefs arg) skips banners:', !noBriefsHasBanner, ' (expected: true)');

const allPass = hasBannerInFull && hasMarkersInFull && !bodyHasBanner && bodyHasContent && cleanOnly === '' && !noBriefsHasBanner;
if (!allPass) {
  console.error('\nFAIL — see expected/actual above');
  process.exit(1);
}
console.log('\n✓ all banner round-trip assertions passed');

console.log('\n=== SAMPLE: banner from full HTML (~first 60 lines surrounding banner) ===');
const start = fullHtml.indexOf('REVIEW_ONLY_START');
console.log(fullHtml.slice(start - 50, start + 1400));

import 'dotenv/config';
import { factCheckBrief, formatReport } from '../lib/validator.js';

const brief = {
  topic: 's2-test',
  sources: [
    {
      title: 'Fluoxetine is an SSRI antidepressant',
      url: 'https://example.com/1',
      publishedDate: '2024-01-01',
      excerpt: 'Fluoxetine (Prozac) is a selective serotonin reuptake inhibitor first approved by the FDA in 1987 for major depressive disorder.',
    },
    {
      title: 'Lithium is a benzodiazepine commonly used for ADHD',
      url: 'https://example.com/2',
      publishedDate: '2024-01-01',
      excerpt: 'Lithium carbonate is a benzodiazepine that acts on GABA-A receptors and is FDA-approved for attention deficit hyperactivity disorder in children.',
    },
    {
      title: 'PSYCH-9182 trial completes phase 2 with novel kappa-opioid agonist',
      url: 'https://example.com/3',
      publishedDate: '2026-04-20',
      excerpt: 'A made-up clinical trial of a fictitious compound that did not happen and is not in any database. Published last week.',
    },
  ],
};

const result = await factCheckBrief(brief, {
  sectionLabel: 'TEST: validator smoke',
  focusArea: 'mixed truth fixtures',
});

console.log('\n=== FORMATTED ===');
console.log(formatReport('TEST', result));

console.log('\n=== ASSERTIONS ===');
const v1 = result.verdicts.find(v => v.sourceIndex === 1);
const v2 = result.verdicts.find(v => v.sourceIndex === 2);
const v3 = result.verdicts.find(v => v.sourceIndex === 3);
console.log('Source 1 (true)        verdict:', v1?.verdict, '  expected: agree');
console.log('Source 2 (false)       verdict:', v2?.verdict, 'severity:', v2?.severity, '  expected: disagree/high');
console.log('Source 3 (made-up)     verdict:', v3?.verdict, '  expected: unverified');
console.log('\noverall ok:', result.ok, '  (expected: false, because of source 2)');
console.log('disagreementCount:', result.disagreementCount);
console.log('tokens:', result.usage?.prompt_tokens, 'in /', result.usage?.completion_tokens, 'out');

if (v2?.verdict !== 'disagree') { console.error('\nFAIL: source 2 should disagree'); process.exit(1); }
if (result.ok !== false) { console.error('\nFAIL: result.ok should be false'); process.exit(1); }
console.log('\n✓ smoke test PASSED');

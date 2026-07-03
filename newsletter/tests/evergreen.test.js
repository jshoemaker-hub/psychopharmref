import {
  buildEvergreenRotationContext,
  findEvergreenRepeatViolations,
  planEvergreenUsage,
  selectEvergreenAngle,
} from '../lib/evergreen.js';

const testCatalog = {
  s1: [
    { id: 's1-a', title: 'Angle A', instructions: 'Write angle A.' },
    { id: 's1-b', title: 'Angle B', instructions: 'Write angle B.' },
  ],
};

describe('evergreen rotation guard', () => {
  test('selects an eligible angle that has not been used within the yearly window', () => {
    const plan = planEvergreenUsage({
      date: '2026-06-01',
      section: 's1',
      topicKey: 's1-test',
      catalog: testCatalog,
      windowDays: 365,
      selectedAt: '2026-06-01T00:00:00.000Z',
      entries: [
        {
          date: '2026-01-01',
          section: 's1',
          angleId: 's1-a',
          angleTitle: 'Angle A',
        },
      ],
    });

    expect(plan.created).toBe(true);
    expect(plan.angle.id).toBe('s1-b');
    expect(plan.entry.angleId).toBe('s1-b');
  });

  test('reuses an existing date and section assignment on rerun', () => {
    const existing = {
      date: '2026-06-01',
      section: 's1',
      topicKey: 's1-test',
      angleId: 's1-a',
      angleTitle: 'Angle A',
    };

    const plan = planEvergreenUsage({
      date: '2026-06-01',
      section: 's1',
      topicKey: 's1-test',
      catalog: testCatalog,
      entries: [existing],
    });

    expect(plan.created).toBe(false);
    expect(plan.entry).toBe(existing);
    expect(plan.angle.id).toBe('s1-a');
  });

  test('throws before drafting when every angle is blocked', () => {
    expect(() => selectEvergreenAngle({
      date: '2026-06-01',
      section: 's1',
      catalog: testCatalog,
      windowDays: 365,
      entries: [
        { date: '2026-01-01', section: 's1', angleId: 's1-a' },
        { date: '2026-02-01', section: 's1', angleId: 's1-b' },
      ],
    })).toThrow(/No eligible evergreen angles/);
  });

  test('legacy pre-guard repeats do not create permanent status failures', () => {
    const violations = findEvergreenRepeatViolations([
      { date: '2026-01-01', section: 's1', angleId: 's1-a', enforced: false },
      { date: '2026-02-01', section: 's1', angleId: 's1-a', enforced: false },
      { date: '2026-03-01', section: 's1', angleId: 's1-a' },
    ], 365);

    expect(violations).toHaveLength(1);
    expect(violations[0].current.date).toBe('2026-03-01');
  });

  test('rotation context locks the prompt to the selected angle', () => {
    const context = buildEvergreenRotationContext({
      windowDays: 365,
      angle: testCatalog.s1[0],
      blockedAngles: [
        {
          angle: testCatalog.s1[1],
          lastDate: '2026-01-01',
          eligibleDate: '2027-01-01',
        },
      ],
    });

    expect(context).toContain('Use exactly this evergreen angle');
    expect(context).toContain('Angle A (s1-a)');
    expect(context).toContain('within 365 days');
    expect(context).toContain('Angle B');
  });
});

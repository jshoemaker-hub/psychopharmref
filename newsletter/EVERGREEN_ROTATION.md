# Evergreen Rotation Guard

The newsletter can fall back to evergreen content when a section has no usable sources. To keep that content from repeating too often, evergreen angles now use a rolling 365-day repeat window.

## Normal Workflow

1. Run topic picking and research as usual.
2. Before drafting, optionally check availability:

   ```bash
   node generate.js --evergreen-status
   ```

3. Run the draft command as usual:

   ```bash
   node generate.js --draft
   ```

If any section brief has `"fallback": "evergreen"`, the draft step selects one eligible evergreen angle for that section, injects it into the prompt as a locked rotation guard, and records the selection in `briefs/evergreen-log.json`.

## Rule

A specific evergreen angle cannot be selected again until at least 365 days have passed since its logged use. If every angle for a section is blocked, `--draft` stops before calling Claude so the issue can be fixed by adding more evergreen angles or manually changing the newsletter plan.

## Manual Entries

If you manually write or send an evergreen section outside the generator, add an entry to `briefs/evergreen-log.json` with:

```json
{
  "date": "2026-06-16",
  "section": "s2",
  "topicKey": "manual",
  "angleId": "s2-qtc-prolongation",
  "angleTitle": "QTc prolongation in psychiatric prescribing",
  "repeatWindowDays": 365,
  "selectedAt": "2026-06-16T00:00:00.000Z"
}
```

Use `node generate.js --evergreen-status --date YYYY-MM-DD` to check eligibility for a future planned issue.

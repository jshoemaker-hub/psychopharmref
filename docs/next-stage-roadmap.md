# PsychoPharmRef Next-Stage Roadmap

This roadmap turns the current project from a fast-moving expert-built reference
site into a durable clinical product. The goal is not to slow down iteration. The
goal is to make each new tool, chapter, and data update easier to verify.

## Current Character

PsychoPharmRef is now a feature-rich clinical reference platform: drug database,
psychopharmacology visualizations, clinical scales, documentation tools, blog
chapters, slide-style teaching material, newsletter infrastructure, and question
bank experiments.

The next maturity step is operational: fewer manual deploy traps, clearer data
provenance, stronger checks, and cleaner boundaries between product surfaces.

## Phase 1: Guardrails Before More Growth

Status: started.

What this phase adds:

- `npm run check:release` for release hygiene.
- Mirror drift checks between source files and `hugo-site/static`.
- Lazy-tool asset checks for every `data-lazy-tool` section.
- Cache-bust checks for local JS/CSS loaded by `index.html`.
- Basic HTML tag-balance checks for the root and deployed SPA copies.

Run before deploy:

```bash
npm run check
```

Run the fuller content-source audit when you are deciding whether legacy blog
content or Hugo content is authoritative:

```bash
npm run check:full
```

Current known content-source finding: `natural-methods-depression-anxiety.html`
has a longer legacy `blog/` body than the Hugo source. Because the Hugo version
is what deploys, decide intentionally whether the extra legacy material belongs
in that chapter before syncing it.

Definition of done:

- A normal deploy candidate has zero mirror drift.
- New tools cannot be added without matching JS/CSS source and Hugo static assets.
- Cache-bust/version mistakes are caught before the live site serves stale code.

## Phase 2: Clinical Data Source Of Truth

Status: started with PHQ-9, GAD-7, ESS, and MSI-BPD schemas; all four now
consume their schemas at runtime with embedded fallbacks.

Move high-value clinical data into structured, reviewable sources before it is
rendered into UI.

Recommended source layout:

```text
data/clinical/
  medications.json
  receptor-profiles.json
  p450-interactions.json
  pregnancy-lactation.json
  clinical-scales/
    phq9.json
    gad7.json
    aims.json
  sources.json
```

Every clinical datum that affects recommendations should eventually carry:

- `value`
- `source_id`
- `last_reviewed`
- `review_status`
- `notes`

Definition of done:

- One important table, preferably pregnancy/lactation or receptor data, is driven
  from structured data instead of hand-edited markup.
- A build or validation script fails when required provenance fields are missing.

Current pilot:

- `data/clinical/sources.json`
- `data/clinical/scales/phq9.json`
- `data/clinical/scales/gad7.json`
- `data/clinical/scales/ess.json`
- `data/clinical/scales/msibpd.json`
- `npm run check:clinical`

These files do not yet drive the runtime UI. They are the first reviewable,
testable source-of-truth layer for scoring, severity bands, report notes, source
citations, and safety flags.

PHQ-9, GAD-7, ESS, and MSI-BPD are the first runtime consumers. Their tool scripts load
`data/clinical/scales/<scale>.json` through `ToolUtils.loadClinicalScale()`,
then use the schemas for score range, severity bands, action text, item report
text, source citation, and PHQ-9 Item 9 safety flag behavior.

The shared runtime glue lives in `ToolUtils.createScaleTool()`. New scale
migrations should provide a fallback schema plus selectors/config, then let the
helper handle score updates, incomplete response labels, reports, reset, schema
loading, and copy-to-clipboard behavior.

## Phase 3: Generated Tools And Tests

Clinical scales should become schema-driven where practical. A scale schema can
describe items, scoring rules, severity bands, report text, and reset/copy
behavior. The UI can still be custom when the tool deserves it, but ordinary
scoring logic should not be rewritten from scratch each time.

Minimum checks:

- Unit tests for scoring logic.
- Smoke tests that each lazy tool loads.
- Link checks for sidebar and blog routes.
- HTML validation after generated content changes.

Definition of done:

- At least one existing scale is converted to a schema-backed implementation.
- Scoring tests cover normal, boundary, and missing-response states.

## Phase 4: Product Boundaries

Separate the surfaces mentally and eventually structurally:

- Point-of-care reference: fast, searchable, interaction-heavy.
- Clinical tools: validated calculators and documentation helpers.
- Chapters/blog: evergreen educational content and SEO.
- Question bank: learning product with its own user/account assumptions.
- Newsletter: publishing workflow, not core runtime.

Definition of done:

- Navigation and code ownership reflect those surfaces.
- New work lands in the correct surface rather than expanding the SPA by habit.

## Strategic Bias

Build the guardrails first, then migrate the highest-risk data first. The project
does not need a full rewrite to mature. It needs a reliable path from clinical
source material to tested, deployable UI.

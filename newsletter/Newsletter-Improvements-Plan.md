# PsychoPharmRef Newsletter — Improvements Plan

Author: planning pass for Jerad Shoemaker, MD
Date: 2026-04-16
Status: decisions locked in 2026-04-16; no code changed yet; evergreen briefs drafted

This document walks through each of the five fixes you proposed, what the concrete decision is for each one, and exactly where in the pipeline (`config.js`, `prompts/`, `lib/research.js`, `generate.js`) the change will land. Nothing in this document is speculative — every choice is traceable to the notes in `Newsletter improvements.txt` plus the clarifying answers you gave.

---

## TL;DR of decisions

- Move to **4–4–4** structure (4 topics per section).
- **Section 1** goes from 7 topics to 4 by merging related buckets: Approvals, Pipeline, Supply/Generics, Policy/Regulation.
- **Section 2** gains a 4th topic: Side-effect / Adverse-event Deep-dive.
- **Section 3** already has 4 topics — no change.
- Every topic gets a formal fallback chain so a null fetch never produces an empty section.
- A pre-baked 16-letter rotation (Graeco-Latin square) is the source of truth for topic selection. No exact (S1, S2, S3) triple and no pairwise (S1, S2), (S1, S3), or (S2, S3) pair repeats within 16 letters.
- Every unique named entity (pipeline drug, bill, FDA action, rating scale, historical figure) gets a one- to two-sentence primer the first time it appears.

---

## Fix 1 — Rebalance sections to 4–4–4

### Section 1: News & Regulatory (4)

Current (`config.js`) has 7 S1 keys: `s1-new-approvals`, `s1-pipeline-drugs`, `s1-generics`, `s1-shortages`, `s1-legislation`, `s1-psychiatry-news`, plus an implicit "FDA announcements" intent. Merging related buckets gives:

1. **Newly Approved Medications** — unchanged (`s1-new-approvals`).
2. **Pipeline Drugs** — unchanged (`s1-pipeline-drugs`).
3. **Supply & Generics** — new merged key `s1-supply-generics`. Absorbs `s1-shortages` and `s1-generics`. The prompt treats "what moved in the last cycle" as the story — a shortage, a newly-available generic, or a discontinued product. If nothing moved, fall back per Fix 3.
4. **Policy & FDA Watch** — new merged key `s1-policy-regulation`. Absorbs `s1-legislation`, `s1-psychiatry-news`, and the stand-alone "review of recent FDA announcements" idea. The story is whatever in the last cycle most changes clinical practice or access: a federal bill, an FDA labeling change, a CMS decision, a state scope-of-practice shift, or a major guideline update.

Rationale for the merges: you already told the pipeline these are alternative answers to the same reader question ("what's new in the world around my prescribing?"), and three news handlers competing for the same slot means we rarely pick two of them anyway. Collapsing also makes the fallback logic (Fix 3) cleaner — one fallback chain per merged bucket instead of three thin ones.

### Section 2: Educational / Evidence (4)

1. **Medication Comparison** — unchanged (`s2-med-comparison`).
2. **How It Works (Mechanism)** — unchanged (`s2-how-things-work`).
3. **Clinical Rating Scale Review** — unchanged (`s2-survey-review`).
4. **Side-effect / Adverse-event Deep-dive** — new key `s2-adverse-effects`. Focus area: "clinically meaningful adverse effects, risk stratification, monitoring, and management of psychiatric medications." Examples: SSRI-associated bleeding, metabolic syndrome on second-generation antipsychotics, lithium and renal function, QTc prolongation on citalopram, serotonin syndrome, NMS.

### Section 3: Deep Dive (4, unchanged)

1. History of a Diagnosis (`s3-diagnosis-history`)
2. Drug Discovery Story (`s3-drug-discovery`)
3. Scientific Process in Psychiatry (`s3-scientific-process`)
4. Historical / Legal Context (`s3-historical-legal`)

### Files touched

- `config.js` — delete three S1 keys (`s1-generics`, `s1-shortages`, `s1-legislation`, `s1-psychiatry-news`), add two (`s1-supply-generics`, `s1-policy-regulation`), add one S2 (`s2-adverse-effects`). Update `recencyCutoff` accordingly.
- `prompts/` — delete `s1-generics.md`, `s1-shortages.md`, `s1-legislation.md`, `s1-psychiatry-news.md`. Add `s1-supply-generics.md`, `s1-policy-regulation.md`, `s2-adverse-effects.md`.
- `lib/research.js` — extend the `dispatch` table: the merged S1 handlers wrap the existing `fetchFdaRss` / `fetchCongress` / `fetchPerplexity` with an internal fallback order (see Fix 3). Add a Perplexity-based handler for `s2-adverse-effects`.

---

## Fix 2 — Null responses never leave a blank section

Handled entirely through Fix 3. Every topic has a deterministic fallback chain; the draft step never sees an empty brief. Any cascade event is captured in `brief.warnings[]` (that array already exists in `validateBrief` in `lib/research.js`) so you can see in the draft review which topics fell through and why.

Operational rule: **if every fallback in a topic's chain returns null, the pipeline escalates to a "house" evergreen brief for that section rather than emitting an empty section.** Evergreen briefs live under `prompts/evergreen/` and are hand-curated (one per section) so you always have a safety net.

---

## Fix 3 — Fallback chains, topic by topic

Format below: each chain reads top-to-bottom. The pipeline moves down only when the step above returns no usable result (empty sources array, or all sources older than the recency cutoff).

### S1-1. Newly Approved Medications
1. FDA approval in the last 90 days (current `recencyCutoff` for `s1-new-approvals`).
2. Most recent FDA approval in the last **3 years**, framed as a retrospective ("one year in: how bremelanotide changed the conversation"). Include the phrase "looking back" so the reader knows it's not brand-new.
3. Fall through to S1-2 (Pipeline Drugs).

### S1-2. Pipeline Drugs
1. Phase 3 trial with recent activity (start, completion, results posting).
2. Phase 2 with recent activity.
3. Phase 1 with recent activity.
4. Fall through to S1-3.

At each phase layer, the prompt must flag the phase number explicitly so the reader calibrates how close this is to clinical availability.

### S1-3. Supply & Generics (merged)
1. Active FDA drug shortage affecting a psychiatric medication.
2. New generic approval in the last 12 months.
3. Most notable historical shortage in the relevant class, framed as a short essay ("what happened the last time Adderall went short, and what we learned").
4. Fall through to S1-1.

### S1-4. Policy & FDA Watch (merged)
1. Federal mental-health legislation with recent action (introduced, markup, passed, signed) — uses `fetchCongress`.
2. New FDA action: boxed warning added/removed, labeling change, REMS update, advisory committee vote — uses `fetchFdaRss`.
3. CMS, state scope-of-practice, or major guideline update (APA, AACAP, VA/DoD) — uses `fetchPerplexity`.
4. Fall through to S1-1.

### S2-1. Medication Comparison
1. A current comparison request tied to a recent guideline or evidence update.
2. Landmark study revisit from the canon: **STAR*D, CATIE, CUtLASS, EUFEST, RAISE, TADS, TMAP, CATIE-AD, TURNS**; for OCD/PTSD/ADHD/autism/dementia add per your list. Also: overlap studies on anticholinergic burden, chronic opioid use in depression, folate augmentation.
3. Fall through to S2-2.

### S2-2. How It Works (Mechanism)
1. Mechanism of a currently clinically relevant drug.
2. **Receptor-level deep dive** — pick one receptor (e.g., 5-HT2A, D2, α2, mGluR5, orexin), describe function in health, dysfunction in disease, and what drugs act there.
3. Fall through to S2-3.

### S2-3. Clinical Rating Scale Review
1. A scale tied to a recent evidence or implementation story.
2. **History of a scale** — who invented it, where, why, short biography of the inventor, how the scale was validated, what its successors are. Candidates: Hamilton, MADRS, YBOCS, Y-MRS, PANSS, MMSE/MoCA, C-SSRS, AIMS.
3. Fall through to S2-4.

### S2-4. Side-effect / Adverse-event Deep-dive (new)
1. An adverse event tied to a recent label change, black-box warning, or notable case series.
2. Evergreen adverse event chosen from the evergreen list (see `prompts/evergreen/s2-adverse-effects.md`).
3. Fall through to S2-1.

### S3 — all four topics
No fallback needed per your notes ("works well"). If the S3 handler returns empty, use the section's evergreen brief.

### Files touched

- `lib/research.js` — each S1 and S2 handler becomes a thin wrapper over an ordered list of sub-handlers. The wrapper returns the first non-empty result and appends a `warnings[]` entry describing which step succeeded.
- `prompts/*.md` — each prompt gains a "Fallback context" block that tells Claude which rung of the chain produced the brief, so the drafted copy opens appropriately ("Looking back three years…" vs. "This week…").

---

## Fix 4 — 16-letter rotation (pre-baked sequence)

### Design constraint

You asked that no topic repeat within 16 letters and that the mix stay balanced. The strongest way to satisfy this with 4-4-4 sections is a **Graeco-Latin square of order 4**: a 16-row sequence where every (S1, S2) pair, every (S1, S3) pair, and every (S2, S3) pair appears exactly once. That automatically means no exact triple repeats, and each individual section cycles through its four options exactly four times across the 16 letters.

### The schedule

Index columns: S1 = News/Regulatory slot (1 Approvals, 2 Pipeline, 3 Supply/Generics, 4 Policy/Regulation). S2 = Educational (1 Med Comparison, 2 Mechanism, 3 Rating Scale, 4 Adverse Events). S3 = Deep Dive (1 Diagnosis History, 2 Drug Discovery, 3 Scientific Process, 4 Historical/Legal).

| Letter | S1 | S2 | S3 |
|:------:|:--:|:--:|:--:|
| 1  | 1 | 1 | 1 |
| 2  | 2 | 2 | 2 |
| 3  | 3 | 3 | 3 |
| 4  | 4 | 4 | 4 |
| 5  | 1 | 2 | 3 |
| 6  | 2 | 1 | 4 |
| 7  | 3 | 4 | 1 |
| 8  | 4 | 3 | 2 |
| 9  | 2 | 4 | 3 |
| 10 | 1 | 3 | 4 |
| 11 | 3 | 1 | 2 |
| 12 | 4 | 2 | 1 |
| 13 | 1 | 4 | 2 |
| 14 | 2 | 3 | 1 |
| 15 | 3 | 2 | 4 |
| 16 | 4 | 1 | 3 |

### Verified properties

- All 16 triples are unique (no exact combo repeats inside a 16-letter window).
- Every (S1, S2) pair is unique across 16 rows — same for (S1, S3) and (S2, S3).
- Each topic in each section appears exactly 4 times.
- **Zero adjacent collisions**: no two consecutive letters share any section topic.

### What happens at letter 17

The square guarantees the 16-window property, but letter 17 needs a second cycle. Two options, in order of preference:

1. **Rotate the permutation.** For letters 17–32, relabel the columns (e.g., rotate S1 by +1: 1→2, 2→3, 3→4, 4→1). That produces a second 16-letter block with the same Graeco-Latin guarantees and no clash with the first block at the wraparound.
2. **Rolling log fallback.** If the rotated schedule is ever inconvenient (e.g., you hand-pick a topic for a breaking story), the pipeline falls back to a rolling 16-letter log: pick any (S1, S2, S3) triple that does not equal any of the last 16 letters. The Graeco-Latin property is downgraded in this mode, but the no-repeat rule still holds.

### Files touched

- `config.js` — add a `rotation` object: an array of 16 `[s1, s2, s3]` indices plus a `start` date so the pipeline can compute "which letter number is today's?"
- `generate.js` — new `--schedule` command that prints the upcoming rotation. `--pick-topics` becomes `--pick-topics [--override]`: by default it reads the next slot from the rotation instead of prompting. `--override` re-enables the current interactive menu for breaking-story weeks.
- New file `briefs/rotation-log.json` — append-only log of `{ letterNumber, date, s1Key, s2Key, s3Key }` so you always have a record of what actually shipped (which may differ from the schedule if you overrode).

---

## Fix 5 — Primers for unique named entities

Every time the draft introduces a specific drug, bill, FDA action, study, rating scale, or historical figure that a generalist psychiatrist might not recognize, the first mention is followed by a **one- to two-sentence primer**. The primer answers "what is this, in one breath?" for the reader — not a full explanation, just enough to orient.

### Where this is enforced

In each prompt file under `prompts/`, add a shared block (probably pulled in from a single `prompts/_shared/primer-rule.md`) with wording like:

> The first time you mention a named entity that is not already common knowledge to a practicing US psychiatrist — specifically: pipeline drug code names or new generic/brand names, specific bills or public laws by number, FDA actions (labeling changes, REMS, advisory committee votes) by name, rating-scale eponyms, or historical figures — follow that first mention with a parenthetical one- to two-sentence primer. The primer states (a) what the entity is, (b) why a reader should care. Do not primer things a psychiatrist would obviously know: SSRIs, Prozac, DSM, APA, FDA itself.

This keeps the letters educational without condescending. The draft-time Claude model already handles in-prompt instructions like this reliably, so no code change is needed beyond editing the prompt files and adding the shared snippet.

### Files touched

- New file `prompts/_shared/primer-rule.md`.
- Each existing `prompts/*.md` gets a single-line include or a copy-pasted block referencing the primer rule.

---

## Implementation order (when you're ready to move from doc → code)

1. **Structural config** — rewrite `config.js` with the new 4-4-4 topic keys, recency cutoffs, and the `rotation` array (Fix 1 + Fix 4 skeleton).
2. **Prompts** — delete/add files under `prompts/`, ship the shared primer rule, add the fallback-context block to each (Fix 1 + Fix 5).
3. **Dispatch wrappers** — in `lib/research.js`, wrap each new S1/S2 handler with its fallback chain; add the evergreen fallback hook (Fix 2 + Fix 3).
4. **Scheduler** — update `generate.js` so `--pick-topics` reads the next rotation slot by default; add `--schedule` and `--override`; write `rotation-log.json` on each run (Fix 4 runtime).
5. **Evergreen safety net** — author one evergreen brief per section so no letter can ever go out with an empty bucket.
6. **Smoke test** — run `--pick-topics` → `--research` → `--draft` against a past date where you know the real brief, and confirm the schedule-driven pick plus fallback chain produces something you'd be willing to send.

---

## Decisions (locked 2026-04-16)

- **Merged S1-4 slot name:** Policy & FDA Watch.
- **Evergreen safety-net briefs:** drafted by Claude (see `prompts/evergreen/s1-evergreen.md`, `s2-evergreen.md`, `s3-evergreen.md`). Review and edit to taste before first use.
- **Primer rule scope:** include international readers. The rule now exempts only things a generalist *practicing psychiatrist anywhere* would recognize (DSM, SSRI, Prozac, FDA/EMA/MHRA as acronyms, APA, DSM/ICD). US-specific entities — CMS, state scope-of-practice, ACA, specific FDA committee names — still get a primer. So do non-US entities a US reader might not know (NICE, MHRA, TGA, PBAC).
- **Rotation anchor:** the **next letter you send is letter 2** of the schedule. Row 2 is S1=2 Pipeline Drugs, S2=2 Mechanism, S3=2 Drug Discovery Story. The 2026-04-17 letter currently in `briefs/` is treated as letter 1 retroactively (row 1 would have been S1=1, S2=1, S3=1 = Approvals / Med Comparison / Diagnosis History). `config.js` will encode this by setting `rotation.anchorLetterNumber: 1` and `rotation.anchorDate: "2026-04-17"` so the pipeline can compute "which letter number is today's?" from there.

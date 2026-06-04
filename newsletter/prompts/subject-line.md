You are generating metadata for a clinical psychiatry newsletter aimed at practicing psychiatrists and medical students. Given three section topic labels, produce four distinct fields:

1. **title** — the web-version post title. A descriptive noun phrase under ~65 characters. Names the substance of the letter, not the newsletter itself. Read as a thoughtful table-of-contents line.

2. **subtitle** — a one-sentence deck head that runs under the title on the web version. Under ~120 characters. Frames what the reader will take away. Complements the title; does not restate it.

3. **subject** — the email inbox subject line. Under ~70 characters. Slightly more conversational than the title — what a prescriber scanning an inbox would click. No exclamation marks. No emojis. Never names the newsletter itself.

4. **previewText** — the inbox preheader. Under ~100 characters. One sentence that teases the content without repeating the subject verbatim.

Shared rules:
- Clinical-audience register. No "we," no "our," no self-promotion, no "must-read," no superlatives.
- Do not name the newsletter (no "PsychoPharmRef," no "Weekly").
- No all-caps words except standard acronyms (FDA, REMS, SSRI, etc.).
- Do not number or label sections ("Section 1:", "Part 2:").
- Output valid JSON only, with exactly these four keys. No text outside the JSON.

Example input:
  Section 1: Newly Approved Medications
  Section 2: Medication Comparison
  Section 3: History of a Diagnosis

Example output:
  {
    "title": "New FDA approvals, antipsychotic comparisons, and diagnostic history",
    "subtitle": "What got approved this cycle, how the comparators stack up, and how we arrived at the modern category",
    "subject": "New approvals, a drug-class comparison, and how a diagnosis became official",
    "previewText": "The approvals, the evidence behind the comparison, and the history that shapes how the diagnosis reads today."
  }

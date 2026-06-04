<!-- SHARED RULE: auto-inlined into every section prompt by lib/draft.js. -->

# Output format: title line first, body second

Every section you draft must begin with a single line of the exact form:

  TITLE: [4 to 10 word descriptive title for this specific piece]

Then a blank line. Then the body paragraphs.

The title describes the specific content of **this** week's piece. It is not the generic topic name, not a marketing headline, and not a question. A reader looking at a table of contents should be able to guess what the piece is actually about from the title alone.

Good titles:
  TITLE: The 2024 IM haloperidol shortage and what it taught us
  TITLE: Kuhn, imipramine, and the accidental antidepressant
  TITLE: Why the PHQ-9 still carries the depression-screening load
  TITLE: Clozapine myocarditis — the risk that kills the drug most often

Bad titles:
  TITLE: Supply and generics              (that is the topic, not the piece)
  TITLE: This week in psychiatry          (not descriptive)
  TITLE: A look at rating scales          (not specific)
  TITLE: Are SSRIs safe?                  (not a question)
  TITLE: THE ADDERALL SHORTAGE CRISIS     (no all-caps, no "crisis")

Formatting rules:
- The prefix must be exactly "TITLE:" — capital letters, colon, single space after.
- The title line stands alone. Do not include it inside a paragraph. Do not wrap it in markdown (no #, no **).
- After the blank line, begin the body immediately. Do not re-state the title as the body's first sentence.
- Do not include a byline, a date line, or "by PsychoPharmRef" anywhere in the body. The pipeline adds attribution.

The rest of the section follows the body rules already in this prompt (prose paragraphs, no markdown headers, no bullet lists, inline citations, etc.).

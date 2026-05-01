<!-- EVERGREEN S3: no external research brief. Used only when the S3 handler
     returns empty. Claude writes from its own knowledge. -->
---
section: s3
category: s3-evergreen
wordCount: 500-800
tone: narrative-clinical
evergreen: true
---

You are a clinical newsletter writer for psychiatrists. This week's Deep Dive has no qualifying current research brief. Write an evergreen narrative piece from the history of psychiatry that a practicing clinician will find both enjoyable and useful.

Pick **one** of the following angles (rotate; do not repeat within 8 letters):

1. The discovery of chlorpromazine — Laborit in Paris, the "artificial hibernation" cocktail, Delay and Deniker at Sainte-Anne, the first antipsychotic era and why it reshaped asylum psychiatry.
2. Kuhn and imipramine at Münsterlingen — how a failed antihistamine became the first tricyclic antidepressant, and how Kuhn identified the signal in under 40 patients.
3. Cade and lithium — the urate experiments in guinea pigs, Trundle Asylum, the decade it took for Schou's Danish trials to vindicate the finding, and why lithium remained unavailable in the US until 1970.
4. The Rosenhan study and the crisis of diagnostic reliability — what the "pseudopatients" actually did, how the field responded with DSM-III, and which of Rosenhan's criticisms have since held up vs. been contested.
5. The long arc of ECT — Cerletti and Bini in Rome, the mid-century overuse, the anesthesia era, and what modern practice actually looks like.
6. The clozapine story — why it was withdrawn in 1975 after the Finnish agranulocytosis deaths, the Kane study that brought it back in 1988, and the REMS-era legacy.
7. The Decade of the Brain and what it didn't deliver — the 1990s NIMH pivot to neuroscience, the reasons psychiatric drug discovery slowed instead of accelerated, and where the field recalibrated in the 2010s.
8. The emergence of DSM-III — Spitzer, the Task Force, the break from psychoanalytic nosology, the invention of operationalized criteria, and the costs that came with the gain.
9. O'Connor v. Donaldson (1975) and the constitutional limits on civil commitment — the case, Justice Stewart's opinion, and the lasting effect on state inpatient psychiatry.
10. Phenelzine and the cheese reaction — how the MAOI/tyramine interaction was pieced together, and why the episode still governs MAOI prescribing practice.

# Writing instructions

Write 500-800 words in narrative-clinical prose. This is a long-form piece — use paragraphs that develop, not paragraphs that list. Anchor every major claim to a person, place, year, or study. Do not invent quotes. Do not embellish the emotional stakes.

Open in medias res with a scene or a specific moment (Laborit in the operating theater; Cade counting guinea pigs; Rosenhan's pseudopatients memorizing their scripts). Close by landing the story in present-day practice — what a clinician does today because of what happened then.

Apply the primer rule from `prompts/_shared/primer-rule.md`. This matters especially in S3 because historical figures (Laborit, Cade, Kuhn, Cerletti, Spitzer) are not household names.

Use the opus-tier Claude model per `config.claudeModels.s3`. This section rewards narrative craft.

# Output format

Plain paragraphs only. No markdown headers. No bullet lists. No self-referential language.

Close with either: "For a deeper look at [related topic], see the PsychoPharmRef post linked below." if blog posts are present, or end on the last substantive sentence.

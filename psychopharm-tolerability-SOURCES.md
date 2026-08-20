# PsychoPharmRef — Relative Tolerability Tiers: Data Sources & Methodology

**Status:** Clinician-reviewed 2026-08-20.
**Compiled:** 2026-08-20 · **Scope:** 51 agents (24 antipsychotics, 27 antidepressants).
**Companion data file:** `psychopharm-tolerability.csv`

> **Review note (2026-08-20):** Table validated against UpToDate, APA schizophrenia
> guidelines, network meta-analyses, and product labeling. Two refinements applied
> on review: **Gepirone QTc** raised low → **moderate** (FDA labeling requires
> baseline/periodic ECG; ~18 ms mean prolongation at higher exposure), and
> **dextromethorphan/bupropion (Auvelity) sexual dysfunction** raised minimal →
> **low** (~6% vs 0% placebo — below classic SSRIs but not fully minimal).

## What the tiers mean

Each drug is rated on five axes — **weight gain, sedation, sexual dysfunction,
anticholinergic burden (dry mouth / constipation / urinary retention / blurred
vision), and QTc prolongation** — using a five-step ordinal scale:

`none < minimal < low < moderate < high`

Ratings are **relative within the psychotropic class landscape**, not absolute
incidence rates. "High" means high *relative to other psychotropics*, not a
specific percentage. Tiers are a triage/teaching aid and are **not a substitute
for the full prescribing information** of any individual agent.

## Primary sources

1. **Taylor DM, Barnes TRE, Young AH.** *The Maudsley Prescribing Guidelines in
   Psychiatry.* 14th ed. Hoboken, NJ: Wiley-Blackwell; 2021.
2. **Stahl SM.** *Stahl's Essential Psychopharmacology: Neuroscientific Basis and
   Practical Applications.* 5th ed. Cambridge: Cambridge University Press; 2021.
3. **Stahl SM.** *Stahl's Essential Psychopharmacology: The Prescriber's Guide.*
   7th ed. Cambridge: Cambridge University Press; 2021.
4. **Leucht S, Cipriani A, Spineli L, et al.** Comparative efficacy and
   tolerability of 15 antipsychotic drugs in schizophrenia: a multiple-treatments
   meta-analysis. *Lancet.* 2013;382(9896):951–962.
   doi:10.1016/S0140-6736(13)60733-3
5. **Huhn M, Nikolakopoulou A, Schneider-Thoma J, et al.** Comparative efficacy
   and tolerability of 32 oral antipsychotics for the acute treatment of adults
   with multi-episode schizophrenia: a systematic review and network
   meta-analysis. *Lancet.* 2019;394(10202):939–951.
   doi:10.1016/S0140-6736(19)31135-3
6. **Cipriani A, Furukawa TA, Salanti G, et al.** Comparative efficacy and
   acceptability of 21 antidepressant drugs for the acute treatment of adults
   with major depressive disorder: a systematic review and network
   meta-analysis. *Lancet.* 2018;391(10128):1357–1366.
   doi:10.1016/S0140-6736(17)32802-7
7. **U.S. Food & Drug Administration product labeling**, accessed via DailyMed
   (National Library of Medicine), https://dailymed.nlm.nih.gov — for
   drug-specific adverse-effect frequencies, warnings, and QTc data.
8. **Woosley RL, Heise CW, Gallo T, Woosley RD, Romero KA.** QTdrugs List.
   AZCERT / CredibleMeds®, https://crediblemeds.org — for QTc-prolongation
   risk stratification.

## Axis → principal source mapping

| Axis | Primary basis |
|---|---|
| Weight gain | Leucht 2013, Huhn 2019 (antipsychotics); Cipriani 2018, Maudsley (antidepressants) |
| Sedation | Huhn 2019, Maudsley, Stahl (receptor-affinity reasoning: H1) |
| Sexual dysfunction | Maudsley, Stahl; prolactin/serotonergic profiles |
| Anticholinergic | Stahl (muscarinic affinity), Maudsley; FDA labeling |
| QTc | CredibleMeds QTdrugs List, FDA labeling, Maudsley |

## Limitations

Tiers reflect a synthesis across the sources above and, where head-to-head data
are absent, receptor-pharmacology reasoning (e.g., H1 affinity → sedation, M1
affinity → anticholinergic burden). They are dose-independent generalizations;
several effects (QTc especially) are dose- and route-dependent. Newer agents
(esketamine, brexanolone, zuranolone, dextromethorphan/bupropion, gepirone,
lumateperone) have limited comparative data and carry greater uncertainty. All
values are flagged `review: true` in `data.js` and should be verified by the
reviewing clinician before publication.

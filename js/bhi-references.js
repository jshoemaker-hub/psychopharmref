/**
 * bhi-references.js — BHI (Integrated Behavioral Health) medication references.
 *
 * Concise, primary-care-facing prescribing references that Jerad appends to
 * integrated behavioral care notes. Each entry is keyed by the medication `id`
 * used in MEDICATIONS (js/data.js) so the Drug Database can surface a "BHI Ref"
 * card for any medication that has an entry here.
 *
 * Field contract (all strings, plain clinician prose — no markdown):
 *   generic     Generic name
 *   brand       Brand name
 *   classLine   One-line class / role in BHI context
 *   context     What it treats + practical framing for the PCP
 *   starting    How to start / titrate
 *   stopping    How to stop / taper
 *   missed      What to do about missed doses
 *   converting  Switching to/from another agent
 *   fdaLabel    Direct link to the FDA package insert (accessdata.fda.gov)
 *   fdaLabelDate  Year of the label version linked (for display)
 *
 * Sourcing standard: FDA package insert (official prescribing information).
 * Dosing framing reflects typical BHI/outpatient use; always individualize.
 */
var BHI_REFERENCES = {

  lamotrigine: {
    generic: 'Lamotrigine',
    brand: 'Lamictal',
    classLine: 'Anticonvulsant mood stabilizer — bipolar maintenance / bipolar depression',
    context: 'Used for maintenance treatment of bipolar I disorder (FDA-approved for maintenance, not for acute mania or acute depression; frequently used off-label for acute bipolar depression in more moderate cases). This is not a rescue medication — it requires a multi-week titration before reaching an effective dose.',
    starting: 'Slow titration is mandatory to reduce the risk of serious rash (Stevens-Johnson syndrome). Standard schedule with no interacting medications: 25 mg PO daily for weeks 1-2, 50 mg daily for weeks 3-4, 100 mg daily for week 5, then 200 mg daily (usual target) at week 6. Some patients need up to 400 mg/day. If the patient also takes valproate/divalproex, halve the schedule (start 25 mg every other day; target ~100 mg/day) because valproate roughly doubles lamotrigine levels. If on an enzyme inducer (e.g., carbamazepine) without valproate, higher/faster dosing is used. Do not exceed the recommended escalation steps.',
    stopping: 'Taper over at least 2 weeks (about a 50% dose reduction per week) rather than stopping abruptly, unless a serious rash or other safety concern requires immediate discontinuation. In patients with epilepsy, abrupt withdrawal can precipitate seizures.',
    missed: 'Take a missed dose as soon as remembered the same day; if it is almost time for the next dose, skip it and do not double up. Important: if more than about 5 consecutive days are missed, the full titration must be restarted from 25 mg to re-establish tolerance and limit rash risk.',
    converting: 'When switching from another mood stabilizer, cross-taper — titrate lamotrigine up to target while gradually withdrawing the prior agent. Remember the dose adjustments above if the other agent is valproate (halve lamotrigine) or an enzyme inducer.',
    fdaLabel: 'https://www.accessdata.fda.gov/drugsatfda_docs/label/2025/020241s068s069,020764s061s062,022251s032s033lbl.pdf',
    fdaLabelDate: '2025'
  },

  escitalopram: {
    generic: 'Escitalopram',
    brand: 'Lexapro',
    classLine: 'SSRI — depression and anxiety disorders',
    context: 'SSRI for major depressive disorder and generalized anxiety disorder; also used for panic disorder, OCD, PTSD, and social anxiety. Allow about 4 weeks at an adequate dose to judge antidepressant response.',
    starting: 'Usual start is 10 mg PO daily; consider 5 mg daily in older or sensitive patients or to limit initial GI upset and activation. May increase to 20 mg daily after at least 1 week if needed. Maximum 20 mg/day — but limit to 10 mg/day in hepatic impairment and in geriatric patients because of QT-prolongation risk.',
    stopping: 'Do not stop abruptly. Taper gradually over 2-4 weeks to avoid discontinuation syndrome (dizziness, flu-like symptoms, paresthesias, irritability, mood changes). Longer or higher-dose treatment, or a prior history of discontinuation symptoms, may warrant a slower taper over months.',
    missed: 'Take the missed dose as soon as remembered that day; skip it if it is nearly time for the next dose and do not double up. A single missed dose is usually well tolerated given the ~27-32 hour half-life.',
    converting: 'Switching to or from another SSRI/SNRI is usually done as a direct switch or a brief cross-taper. Switching to or from an MAOI requires a 14-day washout in both directions to avoid serotonin syndrome.',
    fdaLabel: 'https://www.accessdata.fda.gov/drugsatfda_docs/label/2023/021323s055,021365s039lbl.pdf',
    fdaLabelDate: '2023'
  },

  aripiprazole: {
    generic: 'Aripiprazole',
    brand: 'Abilify',
    classLine: 'Atypical antipsychotic — MDD adjunct, bipolar, schizophrenia',
    context: 'Atypical (dopamine partial agonist) antipsychotic used for schizophrenia and bipolar disorder and, in the BHI setting most often, as an adjunct to an antidepressant for treatment-resistant major depression. Akathisia (an inner restlessness) is a common, dose-related early effect to counsel patients about.',
    starting: 'For adjunctive treatment of MDD, start low: 2-5 mg PO daily. Titrate in increments of up to 5 mg at intervals of at least 1 week to a usual 5-10 mg/day (maximum 15 mg/day for the MDD-adjunct indication). Higher doses are used for bipolar and schizophrenia per the label.',
    stopping: 'There is no physiologic withdrawal, but abrupt discontinuation can allow the underlying condition to relapse, so taper when clinically feasible. Because of the long half-life (~75 hours, with an active metabolite lasting longer), both benefits and side effects resolve slowly after stopping.',
    missed: 'Take the missed dose when remembered; if it is close to the next scheduled dose, skip it and resume the normal schedule. The long half-life buffers the effect of a single missed dose.',
    converting: 'When switching from another antipsychotic, cross-taper over roughly 1-2 weeks rather than stopping the prior agent abruptly. Metabolic and movement-disorder (EPS) profiles differ between agents, so repeat AIMS screening and metabolic monitoring after the switch.',
    fdaLabel: 'https://www.accessdata.fda.gov/drugsatfda_docs/label/2022/021436s048lbledit.pdf',
    fdaLabelDate: '2022'
  },

  lorazepam: {
    generic: 'Lorazepam',
    brand: 'Ativan',
    classLine: 'Benzodiazepine — short-term anxiety / panic',
    context: 'Benzodiazepine used in BHI for short-term treatment of anxiety, often panic attacks — typically as a bridge until an SSRI and therapy take effect. It has no active metabolites, which makes it a preferred benzodiazepine in hepatic impairment and, cautiously, in older adults. Carries risks of sedation, dependence, and withdrawal.',
    starting: 'Typical dosing is 0.5-1 mg PO two to three times daily as needed; it is unusual to exceed 6 mg/day. Intend short-term use — the usual goal is 4-6 weeks, then begin tapering. Start at the low end in older adults given fall, confusion, and oversedation risk, and counsel against combining with opioids or alcohol.',
    stopping: 'After regular use, do not stop abruptly — abrupt discontinuation can cause a withdrawal syndrome that may include seizures. Taper gradually (for example, reduce by about 0.5 mg every 1-2 weeks, slower after longer or higher-dose use). For difficult tapers, consider transitioning to a longer-acting benzodiazepine first.',
    missed: 'For as-needed use, simply take a dose when symptoms warrant. For scheduled dosing, take a missed dose when remembered unless it is nearly time for the next one, and do not double up. In a physically dependent patient, missed doses can precipitate withdrawal.',
    converting: 'When transitioning to a longer-term agent (SSRI, buspirone, etc.), start the new medication and overlap while it takes effect, then taper the lorazepam off. To switch to another benzodiazepine, use approximately equivalent dosing and cross-taper.',
    fdaLabel: 'https://www.accessdata.fda.gov/drugsatfda_docs/label/2021/017794s048lbl.pdf',
    fdaLabelDate: '2021'
  },

  // ─── The entries below are sourced to DailyMed (official NLM label repository).
  //     fdaLabelDate intentionally blank; the card shows "via DailyMed". ───

  fluoxetine: {
    generic: 'Fluoxetine',
    brand: 'Prozac',
    classLine: 'SSRI — depression, anxiety, OCD, bulimia, PMDD',
    context: 'Long-acting SSRI for major depression, anxiety disorders, OCD, bulimia, panic, and PMDD. Its very long half-life (active metabolite norfluoxetine ~1-2 weeks) makes it forgiving of missed doses and largely self-tapering. Can be activating — dose in the morning.',
    starting: 'Usual start is 20 mg PO each morning; consider 10 mg in anxious or sensitive patients. Increase after several weeks if needed; usual range 20-60 mg/day (up to 80 mg for OCD/bulimia). Allow ~4 weeks at an adequate dose to judge response.',
    stopping: 'Discontinuation symptoms are uncommon because of the long half-life, so it usually self-tapers; a formal taper is generally unnecessary except from high doses. Note the long washout when planning subsequent medication changes.',
    missed: 'Take when remembered, or skip if nearly time for the next dose — do not double up. A single missed dose is inconsequential given the multi-week half-life.',
    converting: 'Switching to/from another SSRI/SNRI is usually a direct switch or brief cross-taper. Because of the long half-life, wait 5 weeks after stopping fluoxetine before starting an MAOI; wait 14 days after an MAOI before starting fluoxetine.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=fluoxetine',
    fdaLabelDate: ''
  },

  sertraline: {
    generic: 'Sertraline',
    brand: 'Zoloft',
    classLine: 'SSRI — depression, anxiety, panic, OCD, PTSD, PMDD',
    context: 'Broadly used first-line SSRI for depression and the full range of anxiety disorders, panic, OCD, PTSD, and PMDD. Well tolerated; GI upset (loose stools, nausea) is the most common early effect and usually settles. Take with food.',
    starting: 'Start 50 mg PO daily (25 mg in panic/anxiety-prone patients to limit early jitteriness); titrate in 25-50 mg steps at intervals of at least 1 week as tolerated. Usual range 50-200 mg/day. Allow ~4 weeks to judge antidepressant response.',
    stopping: 'Do not stop abruptly. Taper over 2-4 weeks to avoid discontinuation syndrome (dizziness, flu-like symptoms, paresthesias, irritability); slower if long-term or high-dose.',
    missed: 'Take when remembered that day; skip if nearly time for the next dose and do not double up. Occasional missed doses may cause transient discontinuation symptoms.',
    converting: 'Direct switch or brief cross-taper to/from another SSRI/SNRI. A 14-day washout is required in both directions when switching to/from an MAOI.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=sertraline',
    fdaLabelDate: ''
  },

  paroxetine: {
    generic: 'Paroxetine',
    brand: 'Paxil',
    classLine: 'SSRI — depression, anxiety, panic, OCD, PTSD',
    context: 'Effective SSRI but the most anticholinergic and sedating, with the shortest half-life — so it has the most prominent discontinuation syndrome and requires careful tapering. Associated with weight gain and, in pregnancy, cardiac malformation risk (avoid when possible).',
    starting: 'Start 20 mg PO daily (10 mg in older or sensitive patients); increase in 10 mg steps at intervals of at least 1 week if needed. Usual range 20-50 mg/day (controlled-release 25-62.5 mg). Take in the morning; if sedating, evening dosing is an option.',
    stopping: 'Taper slowly — paroxetine has the most severe SSRI discontinuation syndrome. Reduce gradually over weeks (sometimes months for long-term use); consider the smallest tablet increments or alternate-day dosing near the end.',
    missed: 'Take when remembered that day; skip if nearly time for the next dose. Even a single missed dose can trigger discontinuation symptoms because of the short half-life.',
    converting: 'Cross-taper to/from other SSRIs/SNRIs, mindful of paroxetine\'s discontinuation profile. A 14-day washout is required in both directions with MAOIs.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=paroxetine',
    fdaLabelDate: ''
  },

  citalopram: {
    generic: 'Citalopram',
    brand: 'Celexa',
    classLine: 'SSRI — depression, anxiety',
    context: 'Well-tolerated SSRI for depression and anxiety. The key caveat is dose-dependent QT prolongation, which caps the maximum dose — obtain an ECG when there is cardiac risk, electrolyte disturbance, or interacting drugs.',
    starting: 'Start 20 mg PO daily; may increase to a maximum of 40 mg/day after at least 1 week. Limit to 20 mg/day in patients over 60, in hepatic impairment, in CYP2C19 poor metabolizers, or with CYP2C19 inhibitors, because of QT risk.',
    stopping: 'Do not stop abruptly. Taper over 2-4 weeks to avoid discontinuation symptoms; slower after long-term use.',
    missed: 'Take when remembered that day; skip if nearly time for the next dose and do not double up.',
    converting: 'Direct switch or brief cross-taper to/from other SSRIs/SNRIs. A 14-day washout is required in both directions with MAOIs.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=citalopram',
    fdaLabelDate: ''
  },

  fluvoxamine: {
    generic: 'Fluvoxamine',
    brand: 'Luvox',
    classLine: 'SSRI — OCD, anxiety',
    context: 'SSRI used primarily for OCD and anxiety disorders. Notable as a potent CYP1A2 and CYP2C19 inhibitor, so it carries a high drug-interaction burden (e.g., with caffeine, theophylline, clozapine, tizanidine) — review interactions before prescribing.',
    starting: 'Start 50 mg PO at bedtime; titrate in 50 mg steps every 4-7 days as tolerated. Usual range 100-300 mg/day; divide doses above 100 mg/day (larger portion at night). Sedation and nausea are common early.',
    stopping: 'Do not stop abruptly. Taper over 2-4 weeks to avoid discontinuation syndrome; short half-life makes symptoms more likely, so taper deliberately.',
    missed: 'Take when remembered that day; skip if nearly time for the next dose and do not double up.',
    converting: 'Cross-taper to/from other serotonergic agents, accounting for its enzyme inhibition when the other drug is a CYP1A2/2C19 substrate. A 14-day washout is required in both directions with MAOIs.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=fluvoxamine',
    fdaLabelDate: ''
  },

  vilazodone: {
    generic: 'Vilazodone',
    brand: 'Viibryd',
    classLine: 'SSRI / 5-HT1A partial agonist — depression',
    context: 'Serotonin reuptake inhibitor with 5-HT1A partial agonism, used for major depression. Marketed as potentially lower sexual dysfunction; GI upset (diarrhea, nausea) is the main early effect. Must be taken with food for adequate absorption.',
    starting: 'Start 10 mg PO daily with food for 7 days, then 20 mg for 7 days, then 40 mg daily (target). Taking with food roughly doubles absorption — doses taken fasting may be ineffective.',
    stopping: 'Do not stop abruptly. Taper gradually to avoid discontinuation symptoms; reduce toward 20 mg before stopping.',
    missed: 'Take with food when remembered that day; skip if nearly time for the next dose and do not double up.',
    converting: 'Cross-taper to/from other serotonergic antidepressants. A 14-day washout is required in both directions with MAOIs.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=vilazodone',
    fdaLabelDate: ''
  },

  vortioxetine: {
    generic: 'Vortioxetine',
    brand: 'Trintellix',
    classLine: 'Multimodal serotonergic antidepressant — depression',
    context: 'Multimodal antidepressant (SERT inhibition plus several 5-HT receptor actions) for major depression, with possible pro-cognitive benefit and relatively low sexual dysfunction. Nausea is the most common, usually dose-related, early effect. Long half-life (~66 hours).',
    starting: 'Start 10 mg PO daily; increase to 20 mg as tolerated (target). Reduce to 5 mg if 10 mg is not tolerated. No dose adjustment in mild-moderate hepatic/renal impairment; not recommended in severe hepatic impairment.',
    stopping: 'Discontinuation symptoms are uncommon given the long half-life, but taper the 20 mg dose (e.g., to 10 mg for a week) before stopping. Abrupt stops from higher doses can still cause transient symptoms.',
    missed: 'Take when remembered, or skip if nearly time for the next dose. The long half-life buffers an occasional missed dose.',
    converting: 'Cross-taper to/from other serotonergic antidepressants. A 21-day washout is advised after stopping vortioxetine before an MAOI; wait 14 days after an MAOI before starting it.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=vortioxetine',
    fdaLabelDate: ''
  },

  venlafaxine: {
    generic: 'Venlafaxine',
    brand: 'Effexor',
    classLine: 'SNRI — depression, GAD, panic, social anxiety',
    context: 'SNRI for depression and anxiety disorders. Serotonergic at low doses and increasingly noradrenergic as the dose rises. Dose-dependent blood-pressure elevation and a pronounced discontinuation syndrome are the key practical issues — monitor BP and taper carefully.',
    starting: 'Use the XR form: start 37.5-75 mg PO daily with food; titrate in ~75 mg steps at intervals of at least 4-7 days. Usual range 75-225 mg/day (IR max 375 mg/day divided). Check blood pressure at higher doses.',
    stopping: 'Taper slowly — venlafaxine has one of the most intense SSRI/SNRI discontinuation syndromes because of its short half-life. Reduce gradually over weeks to months; some patients bridge with a longer-acting agent.',
    missed: 'Take when remembered that day; skip if nearly time for the next dose. Even one missed dose can precipitate discontinuation symptoms.',
    converting: 'Cross-taper to/from other serotonergic agents, mindful of the discontinuation profile. A 14-day washout is required in both directions with MAOIs.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=venlafaxine',
    fdaLabelDate: ''
  },

  duloxetine: {
    generic: 'Duloxetine',
    brand: 'Cymbalta',
    classLine: 'SNRI — depression, GAD, neuropathic and musculoskeletal pain',
    context: 'SNRI for depression and generalized anxiety that is also first-line for several pain conditions (diabetic neuropathy, fibromyalgia, chronic musculoskeletal pain), making it useful when mood and pain coexist. Avoid in significant hepatic disease or heavy alcohol use.',
    starting: 'Start 30 mg PO daily for 1 week, then 60 mg daily (target); some go to 90-120 mg/day, though benefit above 60 mg is limited for depression. Nausea is common early and usually transient.',
    stopping: 'Do not stop abruptly. Taper gradually over at least 2 weeks to limit discontinuation symptoms; the capsule cannot be split, which complicates fine tapering — consider alternate-day dosing near the end.',
    missed: 'Take when remembered that day; skip if nearly time for the next dose and do not double up.',
    converting: 'Cross-taper to/from other serotonergic antidepressants. A 14-day washout (5 days after stopping duloxetine before an MAOI) applies with MAOIs.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=duloxetine',
    fdaLabelDate: ''
  },

  desvenlafaxine: {
    generic: 'Desvenlafaxine',
    brand: 'Pristiq',
    classLine: 'SNRI — depression',
    context: 'Active metabolite of venlafaxine, used for major depression. Its advantage is a flat dose-response: the starting dose is usually the therapeutic dose, so titration is generally unnecessary. Minimal CYP2D6 metabolism means fewer interactions than venlafaxine.',
    starting: 'Start 50 mg PO daily — this is also the target dose for most patients; higher doses (up to 100 mg, occasionally more) add tolerability burden without much added benefit. Do not crush or chew the extended-release tablet.',
    stopping: 'Do not stop abruptly. Taper gradually (e.g., alternate-day dosing or a step down using the 25 mg strength) to avoid discontinuation symptoms.',
    missed: 'Take when remembered that day; skip if nearly time for the next dose and do not double up.',
    converting: 'Cross-taper to/from other serotonergic agents. A 14-day washout is required in both directions with MAOIs.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=desvenlafaxine',
    fdaLabelDate: ''
  },

  milnacipran: {
    generic: 'Milnacipran',
    brand: 'Savella',
    classLine: 'SNRI — fibromyalgia (not FDA-approved for depression in the US)',
    context: 'SNRI approved in the US specifically for fibromyalgia (not for depression, unlike its enantiomer levomilnacipran). More noradrenergic than serotonergic; monitor blood pressure and heart rate. Useful when a BHI patient\'s primary problem is fibromyalgia-related pain.',
    starting: 'Titrate: 12.5 mg once on day 1, 12.5 mg twice daily on days 2-3, 25 mg twice daily on days 4-7, then 50 mg twice daily (target 100 mg/day). May increase to 200 mg/day. Avoid in severe hepatic impairment.',
    stopping: 'Do not stop abruptly. Taper gradually to avoid discontinuation symptoms.',
    missed: 'Take when remembered unless close to the next dose; do not double up. Twice-daily dosing makes consistent timing important.',
    converting: 'Cross-taper to/from other serotonergic/noradrenergic agents. A 14-day washout is required in both directions with MAOIs.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=milnacipran',
    fdaLabelDate: ''
  },

  levomilnacipran: {
    generic: 'Levomilnacipran',
    brand: 'Fetzima',
    classLine: 'SNRI — depression',
    context: 'Extended-release enantiomer of milnacipran, approved for major depression. Relatively more noradrenergic than most SNRIs; monitor blood pressure and heart rate. Requires renal dose adjustment.',
    starting: 'Start 20 mg PO daily for 2 days, then 40 mg daily; may increase in 40 mg steps at intervals of at least 2 days to a range of 40-120 mg/day. Reduce the maximum in moderate-severe renal impairment (e.g., cap at 80 mg, then 40 mg).',
    stopping: 'Do not stop abruptly. Taper gradually to avoid discontinuation symptoms.',
    missed: 'Take when remembered that day; skip if nearly time for the next dose. Swallow the capsule whole.',
    converting: 'Cross-taper to/from other serotonergic/noradrenergic agents. A 14-day washout is required in both directions with MAOIs.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=levomilnacipran',
    fdaLabelDate: ''
  },

  amitriptyline: {
    generic: 'Amitriptyline',
    brand: 'Elavil',
    classLine: 'Tricyclic antidepressant — depression; off-label chronic pain, migraine, insomnia',
    context: 'Sedating tertiary-amine TCA. In practice used more often at low doses for neuropathic/chronic pain, migraine prophylaxis, and insomnia than as a first-line antidepressant. Strongly anticholinergic and dangerous in overdose (cardiac conduction, arrhythmia) — limit dispensed quantity when overdose risk exists.',
    starting: 'For depression, start 25-50 mg PO at bedtime; titrate toward 75-150 mg/day (higher only with monitoring). For pain/migraine/insomnia, much lower doses (10-25 mg at night) are typical. Consider a baseline ECG in older or cardiac patients.',
    stopping: 'Taper gradually rather than stopping abruptly to avoid cholinergic rebound (nausea, malaise, sleep disturbance). Reduce over 2-4 weeks or longer for higher doses.',
    missed: 'For bedtime dosing, take when remembered that evening; skip if it is nearly morning and do not double up.',
    converting: 'Cross-taper cautiously with other antidepressants, watching additive anticholinergic/sedative and serotonergic effects. A 14-day washout is required in both directions with MAOIs.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=amitriptyline',
    fdaLabelDate: ''
  },

  nortriptyline: {
    generic: 'Nortriptyline',
    brand: 'Pamelor',
    classLine: 'Tricyclic antidepressant — depression; off-label pain',
    context: 'Secondary-amine TCA and the active metabolite of amitriptyline. Better tolerated than tertiary TCAs (less sedation and orthostasis) and has a well-defined therapeutic serum level, so it is often the preferred TCA. Also used for neuropathic pain. Overdose risk applies as with all TCAs.',
    starting: 'Start 25 mg PO at bedtime (or divided); titrate toward 75-100 mg/day. Serum levels have a therapeutic window (~50-150 ng/mL) — check a level when optimizing dose or if response/tolerability is unclear. Baseline ECG in older or cardiac patients.',
    stopping: 'Taper gradually over 2-4 weeks to avoid cholinergic rebound and discontinuation symptoms.',
    missed: 'Take when remembered that day; skip if nearly time for the next dose and do not double up.',
    converting: 'Cross-taper cautiously with other antidepressants. A 14-day washout is required in both directions with MAOIs.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=nortriptyline',
    fdaLabelDate: ''
  },

  imipramine: {
    generic: 'Imipramine',
    brand: 'Tofranil',
    classLine: 'Tricyclic antidepressant — depression, panic; childhood enuresis',
    context: 'Tertiary-amine TCA used for depression and panic disorder, and historically for childhood nocturnal enuresis. Anticholinergic, sedating, and orthostatic; dangerous in overdose. Overdose risk warrants limiting quantity in at-risk patients.',
    starting: 'Start 25-75 mg PO daily (often at bedtime); titrate toward 150-200 mg/day (max 300 mg/day in specialist settings). Baseline ECG in older or cardiac patients.',
    stopping: 'Taper gradually over 2-4 weeks to avoid cholinergic rebound and discontinuation symptoms.',
    missed: 'Take when remembered that day; skip if nearly time for the next dose and do not double up.',
    converting: 'Cross-taper cautiously with other antidepressants. A 14-day washout is required in both directions with MAOIs.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=imipramine',
    fdaLabelDate: ''
  },

  doxepin: {
    generic: 'Doxepin',
    brand: 'Sinequan / Silenor',
    classLine: 'Tricyclic antidepressant (high dose); potent H1 antihistamine hypnotic (low dose)',
    context: 'TCA with a dual identity: at antidepressant doses it behaves like other tertiary TCAs, while at very low doses (3-6 mg, branded Silenor) it is a selective H1 antihistamine used purely as a hypnotic for sleep maintenance, with little anticholinergic effect at that dose.',
    starting: 'For insomnia, start 3-6 mg PO about 30 minutes before bed (do not take within 3 hours of a meal). For depression, doses are much higher (start 25-75 mg/day, titrate toward 150 mg/day) and carry the usual TCA cautions and overdose risk.',
    stopping: 'Low-dose hypnotic use can generally be stopped without a formal taper; taper antidepressant doses gradually to avoid cholinergic rebound.',
    missed: 'For sleep dosing, only take at bedtime — skip if the night is over. For antidepressant dosing, take when remembered that day and do not double up.',
    converting: 'Cross-taper cautiously at antidepressant doses. A 14-day washout is required in both directions with MAOIs.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=doxepin',
    fdaLabelDate: ''
  },

  phenelzine: {
    generic: 'Phenelzine',
    brand: 'Nardil',
    classLine: 'Irreversible MAOI — treatment-resistant / atypical depression',
    context: 'Irreversible nonselective MAO inhibitor, generally reserved for treatment-resistant or atypical depression. Effective but requires a tyramine-restricted diet and strict avoidance of interacting drugs to prevent hypertensive crisis and serotonin syndrome — patient education is essential.',
    starting: 'Start 15 mg PO three times daily; titrate as tolerated to 60-90 mg/day. Full antidepressant benefit and the dietary/drug restrictions both take effect over the first weeks. Provide written tyramine and drug-interaction guidance.',
    stopping: 'Taper gradually. After stopping, MAO activity takes about 2 weeks to regenerate, so dietary and drug restrictions must continue for 14 days after the last dose.',
    missed: 'Take when remembered unless close to the next dose; do not double up. Maintain dietary restrictions regardless of missed doses.',
    converting: 'Requires washouts: 14 days between an MAOI and most serotonergic drugs in both directions (5 weeks after stopping fluoxetine before starting an MAOI). Never combine with SSRIs/SNRIs, TCAs, other MAOIs, or sympathomimetics.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=phenelzine',
    fdaLabelDate: ''
  },

  tranylcypromine: {
    generic: 'Tranylcypromine',
    brand: 'Parnate',
    classLine: 'Irreversible MAOI — treatment-resistant depression',
    context: 'Irreversible nonselective MAOI, structurally amphetamine-like and somewhat activating. Reserved for treatment-resistant depression, with the same tyramine-diet and drug-interaction requirements as other MAOIs (hypertensive crisis, serotonin syndrome).',
    starting: 'Start 10 mg PO twice daily; titrate as tolerated toward 30-60 mg/day. Because it is activating, avoid late-day dosing to limit insomnia. Provide written tyramine and drug-interaction guidance.',
    stopping: 'Taper gradually. Continue dietary and drug restrictions for about 2 weeks after the last dose while MAO activity regenerates.',
    missed: 'Take when remembered unless close to the next dose; do not double up. Maintain dietary restrictions regardless.',
    converting: 'Requires washouts as with other MAOIs: 14 days in both directions with serotonergic drugs (5 weeks after fluoxetine). Never combine with SSRIs/SNRIs, TCAs, other MAOIs, or sympathomimetics.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=tranylcypromine',
    fdaLabelDate: ''
  },

  bupropion: {
    generic: 'Bupropion',
    brand: 'Wellbutrin',
    classLine: 'NDRI — depression, seasonal affective disorder, smoking cessation',
    context: 'Norepinephrine-dopamine reuptake inhibitor for depression and seasonal affective disorder, and (as Zyban) for smoking cessation. Favored for no sexual dysfunction and no weight gain, and is activating. Lowers the seizure threshold — contraindicated in seizure disorders and in current/prior eating disorders.',
    starting: 'SR: start 150 mg PO each morning for 3 days, then 150 mg twice daily (max 200 mg twice daily). XL: start 150 mg each morning, increase to 300 mg after several days (max 450 mg). Avoid late-day dosing because it is activating; keep single doses within limits to reduce seizure risk.',
    stopping: 'No major discontinuation syndrome; taper is generally not required, though tapering is reasonable after long-term high-dose use.',
    missed: 'Take when remembered earlier in the day; skip if it is late or nearly time for the next dose — do not double up (seizure risk). Never take two doses together.',
    converting: 'Can be combined with or switched to/from SSRIs/SNRIs (sometimes added to counter sexual side effects). A 14-day washout is required in both directions with MAOIs.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=bupropion',
    fdaLabelDate: ''
  },

  mirtazapine: {
    generic: 'Mirtazapine',
    brand: 'Remeron',
    classLine: 'Noradrenergic/specific serotonergic antidepressant (NaSSA) — depression',
    context: 'Antidepressant that is sedating and appetite-stimulating, which makes it useful when depression comes with insomnia and poor appetite/weight loss. Minimal sexual dysfunction and little GI upset. Sedation is often strongest at low doses and can lessen as the dose increases.',
    starting: 'Start 15 mg PO at bedtime; titrate toward 30-45 mg/day (max 45 mg). If daytime grogginess is a problem, increasing the dose (more noradrenergic effect) can paradoxically help.',
    stopping: 'Taper gradually to avoid discontinuation symptoms, though these are generally milder than with SSRIs/SNRIs.',
    missed: 'For bedtime dosing, take when remembered that evening; skip if it is nearly morning and do not double up.',
    converting: 'Cross-taper with other antidepressants; often combined with an SSRI/SNRI. A 14-day washout is required in both directions with MAOIs.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=mirtazapine',
    fdaLabelDate: ''
  },

  trazodone: {
    generic: 'Trazodone',
    brand: 'Desyrel',
    classLine: 'Serotonin antagonist/reuptake inhibitor (SARI) — insomnia (low dose), depression (high dose)',
    context: 'Most often used at low doses as a non-habit-forming hypnotic for insomnia; at full doses it is an antidepressant, though sedation limits how high many patients tolerate. Counsel about orthostatic hypotension and the rare but urgent risk of priapism.',
    starting: 'For insomnia, start 25-100 mg PO at bedtime. For depression, titrate to 150-300 mg/day (usually divided or weighted to bedtime; max 400 mg/day outpatient). Rise slowly from sitting to limit orthostasis.',
    stopping: 'Low-dose hypnotic use can usually be stopped without a formal taper; taper antidepressant doses gradually to avoid discontinuation symptoms.',
    missed: 'For sleep dosing, take only at bedtime and skip if the night is over. For divided antidepressant dosing, take when remembered and do not double up.',
    converting: 'Cross-taper with other serotonergic agents (watch additive sedation/serotonergic effects). A 14-day washout is required in both directions with MAOIs. Seek care immediately for an erection lasting over 4 hours.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=trazodone',
    fdaLabelDate: ''
  },

  buspirone: {
    generic: 'Buspirone',
    brand: 'BuSpar',
    classLine: '5-HT1A partial agonist — generalized anxiety',
    context: 'Non-sedating, non-dependence-forming anxiolytic for generalized anxiety. It is not a PRN medication and does not help acute anxiety — benefit builds over 2-4 weeks of scheduled dosing, which is important to explain so patients do not abandon it early. No withdrawal or abuse potential.',
    starting: 'Start 7.5 mg PO twice daily; increase by 5 mg every 2-3 days as needed. Usual range 20-30 mg/day divided twice or three times daily (max 60 mg/day). Avoid grapefruit juice (raises levels via CYP3A4).',
    stopping: 'No physiologic dependence, so it can generally be stopped without a taper; tapering is optional after long-term use.',
    missed: 'Take when remembered unless close to the next dose; do not double up. Consistent twice/three-times-daily dosing matters because of the short half-life.',
    converting: 'Can be added to an SSRI/SNRI or cross-tapered when switching. A 14-day washout is required in both directions with MAOIs.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=buspirone',
    fdaLabelDate: ''
  },

  gepirone: {
    generic: 'Gepirone',
    brand: 'Exxua',
    classLine: '5-HT1A agonist (extended-release) — depression',
    context: 'Selective 5-HT1A agonist in an extended-release oral form, approved for major depression (2023). Marketed for low rates of sexual dysfunction and weight gain. Carries QT considerations — avoid in congenital long QT syndrome and review interacting drugs/CYP3A4 inhibitors.',
    starting: 'Start 18.2 mg PO once daily with food for about a week, then increase to 36.3 mg daily; may titrate further (e.g., to 54.5-79.5 mg/day) as tolerated. Take consistently with food. Avoid strong CYP3A4 inhibitors/inducers.',
    stopping: 'Taper gradually to avoid discontinuation symptoms rather than stopping abruptly.',
    missed: 'Take with food when remembered that day; skip if nearly time for the next dose and do not double up.',
    converting: 'Cross-taper with other serotonergic antidepressants. A 14-day washout is required in both directions with MAOIs.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=gepirone',
    fdaLabelDate: ''
  },

  haloperidol: {
    generic: 'Haloperidol',
    brand: 'Haldol',
    classLine: 'High-potency first-generation antipsychotic — schizophrenia, acute agitation, Tourette',
    context: 'High-potency typical antipsychotic for schizophrenia, acute agitation, and Tourette syndrome. Little sedation or anticholinergic effect but a high rate of extrapyramidal symptoms (acute dystonia, akathisia, parkinsonism) and tardive dyskinesia with long-term use. Available oral, short-acting IM, and long-acting decanoate.',
    starting: 'For chronic oral treatment, start 0.5-5 mg PO two to three times daily; usual range 5-20 mg/day. Start lower in older or antipsychotic-naive patients. Monitor for EPS and consider prophylactic/PRN anticholinergic; screen for tardive dyskinesia (AIMS) periodically.',
    stopping: 'Taper gradually rather than stopping abruptly to limit relapse and withdrawal dyskinesia. Extrapyramidal symptoms may take time to resolve.',
    missed: 'Take when remembered that day; skip if nearly time for the next dose and do not double up.',
    converting: 'Cross-taper over 1-2 weeks when switching antipsychotics. Repeat AIMS and metabolic monitoring after a switch. For patients on decanoate, coordinate oral overlap around the injection schedule.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=haloperidol',
    fdaLabelDate: ''
  },

  chlorpromazine: {
    generic: 'Chlorpromazine',
    brand: 'Thorazine',
    classLine: 'Low-potency first-generation antipsychotic — schizophrenia, severe agitation',
    context: 'Low-potency typical antipsychotic. Fewer extrapyramidal symptoms than high-potency agents but much more sedation, orthostatic hypotension, anticholinergic effect, and photosensitivity. Also used for intractable hiccups and nausea. QT prolongation is a consideration.',
    starting: 'Start 25-50 mg PO two to three times daily; titrate as tolerated toward 200-800 mg/day for schizophrenia. Rise slowly from sitting (orthostasis) and counsel on sun protection.',
    stopping: 'Taper gradually to avoid cholinergic rebound (nausea, insomnia) and relapse.',
    missed: 'Take when remembered that day; skip if nearly time for the next dose and do not double up.',
    converting: 'Cross-taper over 1-2 weeks when switching antipsychotics, watching additive sedation, orthostasis, and anticholinergic load. Repeat AIMS and metabolic monitoring after a switch.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=chlorpromazine',
    fdaLabelDate: ''
  },

  fluphenazine: {
    generic: 'Fluphenazine',
    brand: 'Prolixin',
    classLine: 'High-potency first-generation antipsychotic — schizophrenia',
    context: 'High-potency typical antipsychotic for schizophrenia, available oral and as a long-acting decanoate injection for adherence support. Low sedation/anticholinergic burden but high EPS and tardive dyskinesia risk.',
    starting: 'Start 2.5-10 mg/day PO in divided doses; usual maintenance 5-20 mg/day. Start lower in older patients. Monitor for EPS and screen periodically for tardive dyskinesia (AIMS).',
    stopping: 'Taper gradually to limit relapse and withdrawal dyskinesia.',
    missed: 'Take when remembered that day; skip if nearly time for the next dose and do not double up.',
    converting: 'Cross-taper over 1-2 weeks when switching. For decanoate, coordinate oral overlap around the injection interval. Repeat AIMS and metabolic monitoring after a switch.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=fluphenazine',
    fdaLabelDate: ''
  },

  trifluoperazine: {
    generic: 'Trifluoperazine',
    brand: 'Stelazine',
    classLine: 'High-potency first-generation antipsychotic — schizophrenia, short-term anxiety',
    context: 'High-potency typical antipsychotic for schizophrenia, also labeled for short-term non-psychotic anxiety (rarely used that way now). High EPS/tardive dyskinesia risk, modest sedation.',
    starting: 'For schizophrenia, start 2-5 mg PO twice daily; usual range 15-40 mg/day. Start lower in older patients. Monitor for EPS and screen for tardive dyskinesia (AIMS).',
    stopping: 'Taper gradually to limit relapse and withdrawal dyskinesia.',
    missed: 'Take when remembered that day; skip if nearly time for the next dose and do not double up.',
    converting: 'Cross-taper over 1-2 weeks when switching antipsychotics; repeat AIMS and metabolic monitoring after a switch.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=trifluoperazine',
    fdaLabelDate: ''
  },

  perphenazine: {
    generic: 'Perphenazine',
    brand: 'Trilafon',
    classLine: 'Mid-potency first-generation antipsychotic — schizophrenia',
    context: 'Mid-potency typical antipsychotic for schizophrenia, with a moderate balance of EPS versus sedation/anticholinergic effects. Performed comparably to several second-generation agents in the CATIE trial, making it a reasonable, lower-cost typical option.',
    starting: 'Start 4-8 mg PO three times daily; usual range 8-64 mg/day (divided). Start lower in older patients. Monitor for EPS and screen for tardive dyskinesia (AIMS).',
    stopping: 'Taper gradually to limit relapse and withdrawal dyskinesia.',
    missed: 'Take when remembered that day; skip if nearly time for the next dose and do not double up.',
    converting: 'Cross-taper over 1-2 weeks when switching antipsychotics; repeat AIMS and metabolic monitoring after a switch.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=perphenazine',
    fdaLabelDate: ''
  },

  thiothixene: {
    generic: 'Thiothixene',
    brand: 'Navane',
    classLine: 'High-potency first-generation antipsychotic (thioxanthene) — schizophrenia',
    context: 'High-potency thioxanthene antipsychotic for schizophrenia, clinically similar to haloperidol — low sedation/anticholinergic effect with high EPS and tardive dyskinesia risk.',
    starting: 'Start 2-5 mg PO twice daily; usual range 15-30 mg/day (max ~60 mg/day). Start lower in older patients. Monitor for EPS and screen for tardive dyskinesia (AIMS).',
    stopping: 'Taper gradually to limit relapse and withdrawal dyskinesia.',
    missed: 'Take when remembered that day; skip if nearly time for the next dose and do not double up.',
    converting: 'Cross-taper over 1-2 weeks when switching antipsychotics; repeat AIMS and metabolic monitoring after a switch.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=thiothixene',
    fdaLabelDate: ''
  },

  pimozide: {
    generic: 'Pimozide',
    brand: 'Orap',
    classLine: 'High-potency first-generation antipsychotic — Tourette syndrome',
    context: 'High-potency typical antipsychotic reserved in the US for Tourette syndrome when other agents fail. Its defining risk is dose-dependent QT prolongation, so it requires baseline and follow-up ECGs and careful attention to CYP3A4/2D6 interactions (many drugs raise its level).',
    starting: 'Start 1-2 mg PO daily in divided doses; titrate slowly every few days as tolerated. Maximum roughly 10 mg/day (or 0.2 mg/kg). Obtain a baseline ECG and monitor QT with dose increases; correct hypokalemia/hypomagnesemia.',
    stopping: 'Taper gradually to limit relapse and withdrawal dyskinesia.',
    missed: 'Take when remembered that day; skip if nearly time for the next dose and do not double up.',
    converting: 'Cross-taper cautiously when switching, avoiding overlap with other QT-prolonging drugs. Recheck ECG as needed and screen for tardive dyskinesia (AIMS).',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=pimozide',
    fdaLabelDate: ''
  },

  thioridazine: {
    generic: 'Thioridazine',
    brand: 'Mellaril',
    classLine: 'Low-potency first-generation antipsychotic — refractory schizophrenia (limited use)',
    context: 'Low-potency typical antipsychotic now rarely used because of a boxed warning for dose-related QT prolongation and torsades de pointes; reserved for schizophrenia unresponsive to other agents. Very sedating and anticholinergic; can cause pigmentary retinopathy at high doses.',
    starting: 'Reserved use only, with a baseline ECG and electrolyte check first. Typical schizophrenia dosing is 50-100 mg PO three times daily, titrated cautiously; avoid other QT-prolonging drugs and CYP2D6 inhibitors.',
    stopping: 'Taper gradually to limit relapse and cholinergic rebound.',
    missed: 'Take when remembered that day; skip if nearly time for the next dose and do not double up.',
    converting: 'Cross-taper cautiously when switching, avoiding overlap with other QT-prolonging agents; recheck ECG and screen for tardive dyskinesia (AIMS).',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=thioridazine',
    fdaLabelDate: ''
  },

  loxapine: {
    generic: 'Loxapine',
    brand: 'Loxitane',
    classLine: 'Mid-high-potency first-generation antipsychotic — schizophrenia',
    context: 'Mid-to-high-potency typical antipsychotic for schizophrenia (some consider it to have atypical-like properties). An inhaled form (Adasuve) is used for acute agitation under a REMS because of bronchospasm risk. Oral use carries the usual EPS and tardive dyskinesia risks.',
    starting: 'Oral: start 10 mg PO twice daily; usual range 60-100 mg/day (max ~250 mg/day). Start lower in older patients. Monitor for EPS and screen for tardive dyskinesia (AIMS).',
    stopping: 'Taper gradually to limit relapse and withdrawal dyskinesia.',
    missed: 'Take when remembered that day; skip if nearly time for the next dose and do not double up.',
    converting: 'Cross-taper over 1-2 weeks when switching antipsychotics; repeat AIMS and metabolic monitoring after a switch.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=loxapine',
    fdaLabelDate: ''
  },

  molindone: {
    generic: 'Molindone',
    brand: 'Moban',
    classLine: 'Mid-potency first-generation antipsychotic — schizophrenia',
    context: 'Mid-potency typical antipsychotic for schizophrenia, notable for being relatively weight-neutral (sometimes associated with weight loss), which can be an advantage when metabolic concerns dominate. Standard EPS and tardive dyskinesia risks apply.',
    starting: 'Start 50-75 mg/day PO in divided doses; titrate as tolerated. Usual range 15-225 mg/day. Start lower in older patients. Monitor for EPS and screen for tardive dyskinesia (AIMS).',
    stopping: 'Taper gradually to limit relapse and withdrawal dyskinesia.',
    missed: 'Take when remembered that day; skip if nearly time for the next dose and do not double up.',
    converting: 'Cross-taper over 1-2 weeks when switching antipsychotics; repeat AIMS and metabolic monitoring after a switch.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=molindone',
    fdaLabelDate: ''
  },

  risperidone: {
    generic: 'Risperidone',
    brand: 'Risperdal',
    classLine: 'Second-generation antipsychotic — schizophrenia, bipolar mania, autism irritability',
    context: 'Widely used atypical antipsychotic for schizophrenia and bipolar mania, and for irritability in autism. Effective and relatively inexpensive, but it causes the most prolactin elevation of the atypicals and becomes increasingly EPS-prone at higher doses. Long-acting injectable available.',
    starting: 'Start 1-2 mg/day PO (once daily or divided); titrate as tolerated to a usual 2-6 mg/day. Start lower (0.25-0.5 mg) in older patients. Watch for orthostasis early, EPS at higher doses, and prolactin-related effects (galactorrhea, menstrual changes, sexual dysfunction).',
    stopping: 'Taper gradually to limit relapse and withdrawal dyskinesia.',
    missed: 'Take when remembered that day; skip if nearly time for the next dose and do not double up.',
    converting: 'Cross-taper over 1-2 weeks when switching. For the long-acting injectable, continue oral coverage for the first ~3 weeks. Repeat AIMS and metabolic monitoring after a switch.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=risperidone',
    fdaLabelDate: ''
  },

  olanzapine: {
    generic: 'Olanzapine',
    brand: 'Zyprexa',
    classLine: 'Second-generation antipsychotic — schizophrenia, bipolar',
    context: 'Highly effective atypical for schizophrenia and bipolar disorder, but with the least favorable metabolic profile (weight gain, dyslipidemia, hyperglycemia) — reserve monitoring attention accordingly. Sedating and low in EPS. The long-acting injectable carries a post-injection delirium/sedation risk requiring a monitored setting.',
    starting: 'Start 5-10 mg PO at bedtime; titrate to a usual 10-20 mg/day. Start 2.5-5 mg in older patients. Establish baseline weight, waist, glucose, and lipids and monitor on a schedule.',
    stopping: 'Taper gradually to limit relapse and cholinergic rebound.',
    missed: 'Take when remembered that day; skip if nearly time for the next dose and do not double up.',
    converting: 'Cross-taper over 1-2 weeks when switching. Repeat AIMS and metabolic monitoring after a switch. (The oral/IM combination with samidorphan is a separate product.)',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=olanzapine',
    fdaLabelDate: ''
  },

  quetiapine: {
    generic: 'Quetiapine',
    brand: 'Seroquel',
    classLine: 'Second-generation antipsychotic — schizophrenia, bipolar, MDD adjunct',
    context: 'Sedating atypical with very low EPS, used for schizophrenia, bipolar mania and depression, and as an adjunct in major depression. Frequently misused off-label at low doses purely for sleep — a practice worth discouraging given metabolic and other risks. Orthostasis and metabolic effects are dose-relevant.',
    starting: 'Depends on indication: bipolar depression 50 mg PO at bedtime titrated to 300 mg; schizophrenia titrated to 400-800 mg/day (XR simplifies to once daily). Rise slowly from sitting early on. Baseline and ongoing metabolic monitoring.',
    stopping: 'Taper gradually to avoid discontinuation symptoms (insomnia, nausea) and relapse.',
    missed: 'Take when remembered that day; skip if nearly time for the next dose and do not double up.',
    converting: 'Cross-taper over 1-2 weeks when switching antipsychotics. Repeat AIMS and metabolic monitoring after a switch.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=quetiapine',
    fdaLabelDate: ''
  },

  clozapine: {
    generic: 'Clozapine',
    brand: 'Clozaril',
    classLine: 'Second-generation antipsychotic — treatment-resistant schizophrenia; suicidality reduction',
    context: 'The most effective antipsychotic for treatment-resistant schizophrenia and the only one shown to reduce suicidality, but it demands intensive safety oversight. Requires an ANC-monitoring program (agranulocytosis) and vigilance for myocarditis, seizures, severe constipation/ileus, sialorrhea, orthostasis, and metabolic effects. Managed by or with a clozapine-experienced prescriber.',
    starting: 'Titrate slowly: start 12.5-25 mg PO daily and increase by 25-50 mg/day as tolerated toward 300-450 mg/day (divided), with ANC checks on the required schedule. Slow titration limits hypotension, sedation, and seizure risk. Screen for constipation actively.',
    stopping: 'If stopping is planned, taper gradually. If abruptly interrupted for more than ~48 hours, re-titrate from the low starting dose. Watch for cholinergic rebound and rapid relapse.',
    missed: 'Take when remembered that day; do not double up. If more than about 2 days are missed, contact the prescriber — the dose must be re-titrated from the start for safety.',
    converting: 'Cross-taper carefully with continued ANC monitoring; avoid combining with other marrow-suppressing agents. Repeat AIMS and metabolic monitoring after a switch.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=clozapine',
    fdaLabelDate: ''
  },

  ziprasidone: {
    generic: 'Ziprasidone',
    brand: 'Geodon',
    classLine: 'Second-generation antipsychotic — schizophrenia, bipolar mania',
    context: 'Weight- and metabolically-favorable atypical for schizophrenia and bipolar mania. Two practical caveats: it prolongs the QT interval, and absorption roughly doubles when taken with food — so it must be taken with a meal of at least 500 calories to work reliably.',
    starting: 'Start 20 mg PO twice daily with food; titrate to a usual 40-80 mg twice daily (max 80 mg twice daily). Always dose with a substantial meal. Consider ECG when cardiac risk or interacting QT drugs are present.',
    stopping: 'Taper gradually to limit relapse; discontinuation is otherwise generally mild.',
    missed: 'Take with food when remembered; skip if nearly time for the next dose. Doses taken without adequate food may be subtherapeutic.',
    converting: 'Cross-taper over 1-2 weeks when switching, avoiding overlap with other QT-prolonging drugs. Repeat AIMS and metabolic monitoring after a switch.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=ziprasidone',
    fdaLabelDate: ''
  },

  lurasidone: {
    generic: 'Lurasidone',
    brand: 'Latuda',
    classLine: 'Second-generation antipsychotic — schizophrenia, bipolar depression',
    context: 'Metabolically favorable atypical for schizophrenia and bipolar depression, with low weight-gain risk. Akathisia and some sedation are the main early effects. Absorption depends on food — it must be taken with a meal of at least 350 calories.',
    starting: 'Start 20-40 mg PO once daily with food; titrate to a usual 40-160 mg/day (schizophrenia) or 20-120 mg/day (bipolar depression). Always dose with a substantial meal. Reduce the maximum with moderate-severe renal or hepatic impairment and with CYP3A4 inhibitors.',
    stopping: 'Taper gradually to limit relapse; discontinuation is otherwise generally mild.',
    missed: 'Take with food when remembered that day; skip if nearly time for the next dose. Doses taken fasting may be subtherapeutic.',
    converting: 'Cross-taper over 1-2 weeks when switching. Repeat AIMS and metabolic monitoring after a switch.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=lurasidone',
    fdaLabelDate: ''
  },

  asenapine: {
    generic: 'Asenapine',
    brand: 'Saphris',
    classLine: 'Second-generation antipsychotic — schizophrenia, bipolar mania',
    context: 'Atypical for schizophrenia and bipolar mania given as a sublingual tablet (a transdermal patch also exists). Sublingual administration causes transient oral numbness and requires avoiding food and drink for 10 minutes afterward. Watch for the rare risk of serious allergic reactions.',
    starting: 'Start 5 mg sublingually twice daily (bipolar mania may start at 10 mg twice daily); usual range 5-10 mg twice daily. Place under the tongue and avoid eating or drinking for 10 minutes. Do not swallow the tablet.',
    stopping: 'Taper gradually to limit relapse; discontinuation is otherwise generally mild.',
    missed: 'Take sublingually when remembered; skip if nearly time for the next dose and do not double up.',
    converting: 'Cross-taper over 1-2 weeks when switching. Repeat AIMS and metabolic monitoring after a switch.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=asenapine',
    fdaLabelDate: ''
  },

  paliperidone: {
    generic: 'Paliperidone',
    brand: 'Invega',
    classLine: 'Second-generation antipsychotic — schizophrenia, schizoaffective disorder',
    context: 'Active metabolite of risperidone, used for schizophrenia and schizoaffective disorder. Primarily renally eliminated (so dose by renal function, not hepatic) and, like risperidone, raises prolactin. Its long-acting injectables (monthly, every-3-month, every-6-month) are a major adherence tool.',
    starting: 'Oral extended-release: start 6 mg PO each morning (no titration needed for many); range 3-12 mg/day. Swallow whole. Reduce the dose in renal impairment. Long-acting injectable initiation follows a specific loading schedule.',
    stopping: 'Taper oral therapy gradually to limit relapse. For injectables, effects persist for weeks to months after the last dose.',
    missed: 'For oral, take when remembered that day; skip if nearly time for the next dose. For injectables, follow the label window and contact the clinic if the window is missed.',
    converting: 'Cross-taper from oral agents; injectable initiation may allow stopping the prior oral antipsychotic per the loading regimen. Repeat AIMS and metabolic monitoring after a switch.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=paliperidone',
    fdaLabelDate: ''
  },

  iloperidone: {
    generic: 'Iloperidone',
    brand: 'Fanapt',
    classLine: 'Second-generation antipsychotic — schizophrenia, bipolar mania',
    context: 'Atypical for schizophrenia (and more recently bipolar I mania). It requires a slow initial titration to limit orthostatic hypotension, which means it is not suited to acute stabilization. It also prolongs the QT interval.',
    starting: 'Start 1 mg PO twice daily and titrate over about a week (e.g., 2, 4, 6 mg twice daily) to a usual 6-12 mg twice daily (max 24 mg/day). The mandatory slow titration limits orthostasis but delays full effect. Consider ECG with cardiac risk.',
    stopping: 'Taper gradually to limit relapse. If restarting after an interruption of more than a few days, repeat the initial titration.',
    missed: 'Take when remembered that day; skip if nearly time for the next dose. After a multi-day gap, re-titrate from the start.',
    converting: 'Cross-taper over 1-2 weeks when switching, avoiding overlap with other QT-prolonging drugs. Repeat AIMS and metabolic monitoring after a switch.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=iloperidone',
    fdaLabelDate: ''
  },

  brexpiprazole: {
    generic: 'Brexpiprazole',
    brand: 'Rexulti',
    classLine: 'Second-generation antipsychotic (D2 partial agonist) — schizophrenia, MDD adjunct, Alzheimer\'s agitation',
    context: 'Dopamine partial agonist related to aripiprazole, used for schizophrenia, as an adjunct in major depression, and for agitation associated with Alzheimer\'s dementia. Tends to cause less akathisia and activation than aripiprazole. Note the class boxed warning on increased mortality when antipsychotics are used for dementia-related psychosis.',
    starting: 'For MDD adjunct, start 0.5-1 mg PO daily and titrate weekly to a target of 2 mg/day (max 3 mg). For schizophrenia, titrate to 2-4 mg/day. Adjust the dose with strong CYP2D6/3A4 inhibitors and in poor metabolizers.',
    stopping: 'No physiologic withdrawal, but taper when feasible to avoid relapse. The long half-life means effects resolve slowly.',
    missed: 'Take when remembered that day; skip if nearly time for the next dose. The long half-life buffers a single missed dose.',
    converting: 'Cross-taper over 1-2 weeks when switching antipsychotics; screen for EPS/akathisia and repeat metabolic monitoring after a switch.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=brexpiprazole',
    fdaLabelDate: ''
  },

  cariprazine: {
    generic: 'Cariprazine',
    brand: 'Vraylar',
    classLine: 'Second-generation antipsychotic (D3-preferring partial agonist) — schizophrenia, bipolar, MDD adjunct',
    context: 'Dopamine D3-preferring partial agonist for schizophrenia, bipolar mania and depression, and adjunctive major depression. Its very long-acting active metabolites mean both benefits and side effects change slowly with dose adjustments. Akathisia is the most common early effect.',
    starting: 'Start 1.5 mg PO daily; titrate as needed to a usual 1.5-6 mg/day (indication-dependent). Because of the long effective half-life, wait several days between adjustments and expect delayed steady state. Counsel about akathisia.',
    stopping: 'No abrupt-withdrawal syndrome, but taper when feasible. Effects persist for weeks after stopping because of the long-acting metabolites.',
    missed: 'Take when remembered that day; skip if nearly time for the next dose. The long half-life buffers a single missed dose.',
    converting: 'Cross-taper over 1-2 weeks when switching, remembering the slow offset. Screen for akathisia and repeat metabolic monitoring after a switch.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=cariprazine',
    fdaLabelDate: ''
  },

  lumateperone: {
    generic: 'Lumateperone',
    brand: 'Caplyta',
    classLine: 'Second-generation antipsychotic — schizophrenia, bipolar depression',
    context: 'Atypical for schizophrenia and bipolar depression (monotherapy or adjunct) with a favorable metabolic and EPS profile and simple once-daily dosing without titration. Somewhat sedating.',
    starting: 'Take 42 mg PO once daily; no titration is required. Avoid or adjust with strong/moderate CYP3A4 inhibitors and inducers. Standard metabolic monitoring still applies.',
    stopping: 'Taper gradually to limit relapse; discontinuation is otherwise generally mild.',
    missed: 'Take when remembered that day; skip if nearly time for the next dose and do not double up.',
    converting: 'Cross-taper over 1-2 weeks when switching antipsychotics. Repeat AIMS and metabolic monitoring after a switch.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=lumateperone',
    fdaLabelDate: ''
  },

  pimavanserin: {
    generic: 'Pimavanserin',
    brand: 'Nuplazid',
    classLine: 'Selective 5-HT2A inverse agonist — Parkinson\'s disease psychosis',
    context: 'Unusual antipsychotic with no dopamine-blocking activity — a selective 5-HT2A inverse agonist approved specifically for hallucinations and delusions in Parkinson\'s disease psychosis, where it does not worsen motor symptoms. It prolongs the QT interval and carries the class dementia-related mortality boxed warning.',
    starting: 'Take 34 mg PO once daily; no titration is required. Avoid other QT-prolonging drugs; reduce the dose with strong CYP3A4 inhibitors. Effect on psychosis may take a few weeks.',
    stopping: 'Can generally be stopped without a taper; monitor for return of hallucinations/delusions.',
    missed: 'Take when remembered that day; skip if nearly time for the next dose and do not double up.',
    converting: 'When replacing a dopamine-blocking antipsychotic that was worsening Parkinsonism, coordinate the switch with the treating neurologist; avoid combining with other QT-prolonging agents.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=pimavanserin',
    fdaLabelDate: ''
  },

  lithium: {
    generic: 'Lithium',
    brand: 'Lithobid',
    classLine: 'Mood stabilizer — bipolar maintenance and mania; anti-suicidal',
    context: 'Gold-standard mood stabilizer for bipolar disorder and the agent with the best evidence for reducing suicide. It has a narrow therapeutic index, so serum levels and renal/thyroid function must be monitored, and dehydration, NSAIDs, thiazides, and ACE inhibitors/ARBs can raise levels into the toxic range.',
    starting: 'Start 300 mg PO two to three times daily (or extended-release equivalent); adjust to a maintenance level of about 0.6-1.0 mEq/L (up to ~1.2 for acute mania). Check a level ~5 days after starting or changing dose (drawn ~12 hours post-dose), plus baseline renal function, thyroid, and pregnancy status. Counsel on steady salt/fluid intake and toxicity signs (tremor, ataxia, confusion, vomiting).',
    stopping: 'Taper gradually — abrupt discontinuation markedly increases the risk of manic relapse and may blunt future lithium response. Reduce over weeks unless toxicity requires faster action.',
    missed: 'Take when remembered unless close to the next dose; never double up (toxicity risk). Repeated missed doses destabilize levels — resume the schedule and keep monitoring.',
    converting: 'When switching mood stabilizers, cross-taper while tracking symptoms and lithium levels. Review interacting drugs (diuretics, NSAIDs, ACE inhibitors/ARBs) at every transition.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=lithium',
    fdaLabelDate: ''
  },

  valproate: {
    generic: 'Valproate / Divalproex',
    brand: 'Depakote',
    classLine: 'Mood stabilizer / anticonvulsant — bipolar mania, seizures, migraine prophylaxis',
    context: 'Effective for acute mania and mixed states, as well as seizures and migraine prevention. Key risks are hepatotoxicity, pancreatitis, thrombocytopenia, and high teratogenicity (neural tube defects and reduced IQ) — it should be avoided in people who can become pregnant unless clearly necessary with contraception.',
    starting: 'Start 250-500 mg PO twice daily (divalproex ER once daily); titrate to a trough level of roughly 50-125 mcg/mL for mania. Obtain baseline LFTs, CBC/platelets, and pregnancy status, and recheck periodically. Weight-based loading is sometimes used for acute mania in monitored settings.',
    stopping: 'Taper gradually to avoid destabilization; in patients with epilepsy, abrupt withdrawal can precipitate seizures.',
    missed: 'Take when remembered that day; skip if nearly time for the next dose and do not double up.',
    converting: 'Cross-taper when switching mood stabilizers. Remember valproate roughly doubles lamotrigine levels — halve the lamotrigine schedule if combining or converting.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=divalproex',
    fdaLabelDate: ''
  },

  carbamazepine: {
    generic: 'Carbamazepine',
    brand: 'Tegretol',
    classLine: 'Mood stabilizer / anticonvulsant — bipolar mania, seizures, neuralgia',
    context: 'Anticonvulsant mood stabilizer for mania, seizures, and trigeminal neuralgia. Clinically demanding: it induces its own metabolism (levels drift down over the first weeks), interacts with many CYP3A4 substrates, causes hyponatremia and blood dyscrasias, and carries an SJS risk tied to HLA-B*1502 (test patients of Asian ancestry before starting).',
    starting: 'Start 200 mg PO twice daily; titrate as tolerated to a level of about 4-12 mcg/mL, rechecking after a few weeks because of autoinduction. Baseline CBC, LFTs, sodium, and HLA-B*1502 (where indicated); monitor CBC and sodium over time.',
    stopping: 'Taper gradually to avoid destabilization and seizures.',
    missed: 'Take when remembered that day; skip if nearly time for the next dose and do not double up.',
    converting: 'Cross-taper carefully, anticipating that carbamazepine induction lowers levels of many co-prescribed drugs (oral contraceptives, some antipsychotics, lamotrigine). Re-verify those doses during and after the switch.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=carbamazepine',
    fdaLabelDate: ''
  },

  oxcarbazepine: {
    generic: 'Oxcarbazepine',
    brand: 'Trileptal',
    classLine: 'Anticonvulsant — seizures; off-label bipolar',
    context: 'Keto-analog of carbamazepine used for seizures and, off-label, for bipolar disorder. It has less enzyme induction and fewer drug interactions than carbamazepine and does not require routine level monitoring, but it causes clinically significant hyponatremia more often — check sodium, especially in older patients.',
    starting: 'Start 300 mg PO twice daily; titrate in ~300-600 mg/day steps to a usual 1200-2400 mg/day. Check baseline and periodic sodium. No adjustment for mild-moderate hepatic impairment; avoid in severe impairment.',
    stopping: 'Taper gradually to avoid destabilization and seizures.',
    missed: 'Take when remembered that day; skip if nearly time for the next dose and do not double up.',
    converting: 'Cross-taper when switching. It still modestly lowers hormonal-contraceptive levels — counsel on backup contraception. Do not assume a 1:1 dose relationship when converting from carbamazepine.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=oxcarbazepine',
    fdaLabelDate: ''
  },

  topiramate: {
    generic: 'Topiramate',
    brand: 'Topamax',
    classLine: 'Anticonvulsant — migraine, weight/alcohol-use adjunct (not a primary mood stabilizer)',
    context: 'Anticonvulsant used in psychiatry mostly as an adjunct — for migraine prophylaxis, weight mitigation, alcohol use disorder, and occasionally augmentation — rather than as a standalone mood stabilizer. Dose-related cognitive slowing and word-finding difficulty ("dopamax") are common; also paresthesias, kidney stones, metabolic acidosis, and rare acute glaucoma.',
    starting: 'Start low and titrate slowly to limit cognitive effects: 25 mg PO daily, increasing by 25-50 mg/week to the target for the indication (often 50-200 mg/day divided). Encourage hydration; counsel on paresthesias and to report eye pain or vision change urgently.',
    stopping: 'Taper gradually (e.g., over 2-4 weeks) to avoid withdrawal seizures.',
    missed: 'Take when remembered that day; skip if nearly time for the next dose and do not double up.',
    converting: 'Cross-taper when adjusting adjuncts. It modestly lowers hormonal-contraceptive levels at higher doses — counsel accordingly.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=topiramate',
    fdaLabelDate: ''
  },

  gabapentin: {
    generic: 'Gabapentin',
    brand: 'Neurontin',
    classLine: 'Gabapentinoid — neuropathic pain, seizures; off-label anxiety, alcohol use',
    context: 'Gabapentinoid used for neuropathic pain and seizures and, off-label, for anxiety and alcohol use disorder. Renally cleared (not hepatically metabolized), so dose by kidney function. Generally well tolerated (sedation, dizziness); has recognized misuse potential, particularly with opioids, and additive sedation is a caution.',
    starting: 'Start 300 mg PO at bedtime (or 100-300 mg in older/sensitive patients), then increase to two to three times daily over days; usual range 900-3600 mg/day divided. Reduce the dose in renal impairment. Absorption is saturable, so divide larger totals.',
    stopping: 'Taper over at least a week to avoid withdrawal (anxiety, insomnia, and, in those with seizure history, seizures).',
    missed: 'Take when remembered unless close to the next dose; do not double up.',
    converting: 'Cross-taper when substituting for another agent. Watch additive CNS depression when combined with opioids, benzodiazepines, or alcohol.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=gabapentin',
    fdaLabelDate: ''
  },

  pregabalin: {
    generic: 'Pregabalin',
    brand: 'Lyrica',
    classLine: 'Gabapentinoid (Schedule V) — neuropathic pain, fibromyalgia, anxiety',
    context: 'Gabapentinoid for neuropathic pain and fibromyalgia (and generalized anxiety outside the US), with more predictable absorption than gabapentin. It is a Schedule V controlled substance with misuse potential and renally cleared, so dose by kidney function and be alert to additive sedation with other CNS depressants.',
    starting: 'Start 75 mg PO twice daily (or 50 mg three times daily); titrate within a week toward 150-300 mg/day, up to 450-600 mg/day for some indications. Reduce the dose in renal impairment.',
    stopping: 'Taper over at least a week to avoid withdrawal (insomnia, anxiety, nausea, and seizures in predisposed patients).',
    missed: 'Take when remembered unless close to the next dose; do not double up.',
    converting: 'Cross-taper when switching from gabapentin or another agent (doses are not interchangeable milligram-for-milligram). Watch additive CNS depression with opioids, benzodiazepines, or alcohol.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=pregabalin',
    fdaLabelDate: ''
  },

  esketamine: {
    generic: 'Esketamine',
    brand: 'Spravato',
    classLine: 'NMDA antagonist (intranasal) — treatment-resistant depression; MDD with acute suicidality',
    context: 'Intranasal NMDA-receptor antagonist for treatment-resistant depression and for depressive symptoms with acute suicidality, always given alongside an oral antidepressant. It is administered in a certified setting under a REMS because of dissociation, sedation, and blood-pressure elevation, with post-dose monitoring.',
    starting: 'Given in-office: induction is typically twice weekly for 4 weeks (e.g., 56 mg then 56-84 mg per session), then tapering to weekly and every-other-week maintenance. Patients self-administer the nasal device under supervision, are monitored for at least 2 hours, check blood pressure, and cannot drive until the next day.',
    stopping: 'There is no fixed course — continuation depends on response. When stopping, space sessions out and maintain the oral antidepressant; monitor for relapse.',
    missed: 'Sessions are scheduled in clinic; a missed appointment is rescheduled per the treatment plan rather than made up at home. This is not a take-home medication.',
    converting: 'Continue an oral antidepressant throughout. Coordinate any change of the background antidepressant with the treating team; do not combine with other intranasal ketamine products.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=esketamine',
    fdaLabelDate: ''
  },

  brexanolone: {
    generic: 'Brexanolone',
    brand: 'Zulresso',
    classLine: 'Neuroactive steroid (IV) — postpartum depression',
    context: 'Neuroactive steroid (a GABA-A modulator) given as a one-time continuous IV infusion for postpartum depression, producing rapid improvement. Because of excessive sedation and sudden loss of consciousness, it is delivered in a monitored healthcare setting under a REMS. Largely superseded in practice by oral zuranolone for convenience.',
    starting: 'Administered as a continuous IV infusion titrated up and down over about 60 hours (roughly 2.5 days) in a certified facility, with continuous monitoring for excessive sedation and hypoxia. Not self-administered.',
    stopping: 'It is a single time-limited infusion rather than an ongoing medication; the infusion is tapered off at the end per protocol.',
    missed: 'Not applicable — this is a one-time supervised infusion, not a daily dose.',
    converting: 'Coordinate with any ongoing antidepressant and outpatient follow-up after the infusion, since the acute benefit must be sustained by continued care.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=brexanolone',
    fdaLabelDate: ''
  },

  zuranolone: {
    generic: 'Zuranolone',
    brand: 'Zurzuvae',
    classLine: 'Neuroactive steroid (oral) — postpartum depression',
    context: 'Oral neuroactive steroid (GABA-A modulator) taken as a short, fixed 14-day course for postpartum depression, offering rapid relief without an infusion. It causes dose-related CNS depression, so patients must not drive or operate machinery for at least 12 hours after each dose.',
    starting: 'Take 50 mg PO once daily in the evening with a fatty meal for 14 days (reduce to 40 mg with CNS effects or with CYP3A4 inhibitors, and in hepatic/renal impairment). Counsel firmly about the 12-hour driving restriction after each dose and additive sedation with alcohol or other depressants.',
    stopping: 'The course is fixed at 14 days and simply ends — no taper is needed. If depression persists after the course, transition to standard ongoing treatment.',
    missed: 'Take the missed evening dose as soon as remembered that night with food; if it is the next day, skip it and resume the schedule (do not double up). The full course still ends at 14 days.',
    converting: 'Can follow or precede standard antidepressant therapy; coordinate ongoing treatment since zuranolone itself is only a 2-week course. Avoid combining with other strong CNS depressants.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=zuranolone',
    fdaLabelDate: ''
  },

  'dextromethorphan-bupropion': {
    generic: 'Dextromethorphan / Bupropion',
    brand: 'Auvelity',
    classLine: 'NMDA antagonist + CYP2D6 inhibitor combination — depression',
    context: 'Oral combination in which bupropion inhibits CYP2D6 to raise dextromethorphan levels, and dextromethorphan acts as an NMDA antagonist/sigma-1 agonist to produce a relatively rapid antidepressant effect. Because it contains bupropion, it lowers the seizure threshold (contraindicated in seizure and eating disorders) and can raise blood pressure.',
    starting: 'Start one tablet (dextromethorphan 45 mg / bupropion 105 mg) PO each morning for 3 days, then one tablet twice daily at least 8 hours apart (maximum two tablets/day). Check blood pressure; avoid other serotonergic drugs and additional bupropion-containing products.',
    stopping: 'No major discontinuation syndrome; taper is generally unnecessary, though it can be tapered after long-term use.',
    missed: 'Take when remembered earlier in the day; skip if it is late or close to the next dose — do not double up (seizure risk from the bupropion component).',
    converting: 'A 14-day washout is required in both directions with MAOIs. Do not combine with other bupropion products or, without care, with additional serotonergic agents; note the CYP2D6-inhibiting effect on co-prescribed substrates.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=dextromethorphan+bupropion',
    fdaLabelDate: ''
  },

  alprazolam: {
    generic: 'Alprazolam',
    brand: 'Xanax',
    classLine: 'High-potency short-acting benzodiazepine — panic, anxiety',
    context: 'High-potency, short-acting benzodiazepine for panic and anxiety. Its rapid onset and short duration make it prone to interdose rebound anxiety, dependence, and an especially difficult withdrawal, so many clinicians prefer a longer-acting agent for scheduled use. Additive sedation with opioids/alcohol carries a boxed warning.',
    starting: 'Start 0.25-0.5 mg PO three times daily as needed; the extended-release form is used once daily for panic. Keep courses short and doses low, especially in older adults (falls, confusion). Counsel against combining with opioids or alcohol.',
    stopping: 'Do not stop abruptly after regular use — withdrawal can include seizures. Taper very slowly (often by ~0.25 mg or less every 1-2 weeks); consider switching to a longer-acting benzodiazepine first for a smoother taper.',
    missed: 'For as-needed use, take when symptoms warrant. For scheduled use, take when remembered unless close to the next dose, and do not double up; missed doses can trigger rebound or withdrawal.',
    converting: 'To move off alprazolam, cross-taper to a longer-acting benzodiazepine (e.g., clonazepam or diazepam) at roughly equivalent dosing, then taper that agent. Start definitive therapy (SSRI/SNRI) for the underlying disorder in parallel.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=alprazolam',
    fdaLabelDate: ''
  },

  clonazepam: {
    generic: 'Clonazepam',
    brand: 'Klonopin',
    classLine: 'High-potency long-acting benzodiazepine — panic, anxiety, seizures',
    context: 'High-potency but longer-acting benzodiazepine, which gives smoother coverage than alprazolam for panic and anxiety and makes tapering somewhat easier. Still carries dependence, withdrawal, sedation, and the opioid co-use boxed warning; use caution and low doses in older adults.',
    starting: 'Start 0.25-0.5 mg PO twice daily; usual range 0.5-2 mg/day. Intend short-term use with a plan to taper. Counsel against combining with opioids or alcohol.',
    stopping: 'Do not stop abruptly after regular use (seizure risk). Taper gradually (e.g., reduce by ~0.25-0.5 mg every 1-2 weeks, slower after long or high-dose use).',
    missed: 'For as-needed use, take when symptoms warrant. For scheduled use, take when remembered unless close to the next dose; do not double up.',
    converting: 'Often used as the longer-acting agent to cross-taper patients off alprazolam. When transitioning to definitive therapy (SSRI/SNRI, buspirone), overlap and then taper the clonazepam.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=clonazepam',
    fdaLabelDate: ''
  },

  diazepam: {
    generic: 'Diazepam',
    brand: 'Valium',
    classLine: 'Long-acting benzodiazepine — anxiety, muscle spasm, alcohol withdrawal, seizures',
    context: 'Long-acting benzodiazepine with rapid onset and active metabolites, used for anxiety, muscle spasm, alcohol withdrawal, and seizures. The long half-life allows self-tapering but causes accumulation in older adults and in hepatic impairment, where a shorter-acting agent is safer.',
    starting: 'Start 2-10 mg PO two to four times daily depending on indication. Use lower doses and longer intervals in older or hepatically impaired patients because of accumulation. Counsel against combining with opioids or alcohol.',
    stopping: 'Do not stop abruptly after regular use (seizure risk). Taper gradually; the long half-life makes the taper relatively smooth, and diazepam is itself often used to taper other benzodiazepines.',
    missed: 'Take when remembered unless close to the next dose; do not double up. The long half-life buffers an occasional missed dose.',
    converting: 'Commonly the agent patients are cross-tapered onto when withdrawing from shorter-acting benzodiazepines, then tapered slowly. Use approximate equivalency tables when converting.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=diazepam',
    fdaLabelDate: ''
  },

  oxazepam: {
    generic: 'Oxazepam',
    brand: 'Serax',
    classLine: 'Low-potency benzodiazepine — anxiety, alcohol withdrawal',
    context: 'Low-potency, slower-onset benzodiazepine cleared by direct glucuronidation (no active metabolites), which — like lorazepam — makes it a preferred choice in liver disease and for alcohol withdrawal in hepatic impairment. Its gradual onset gives it relatively low abuse appeal.',
    starting: 'Start 10-15 mg PO three to four times daily for anxiety; higher divided dosing is used for alcohol withdrawal. Its slower onset means it is less useful for acute, on-demand relief. Use caution in older adults despite the favorable metabolism.',
    stopping: 'Do not stop abruptly after regular use (seizure risk). Taper gradually.',
    missed: 'Take when remembered unless close to the next dose; do not double up.',
    converting: 'A reasonable target agent when a hepatically impaired patient needs to move off a longer-acting benzodiazepine. Cross-taper using approximate equivalency.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=oxazepam',
    fdaLabelDate: ''
  },

  chlordiazepoxide: {
    generic: 'Chlordiazepoxide',
    brand: 'Librium',
    classLine: 'Long-acting benzodiazepine — alcohol withdrawal, anxiety',
    context: 'Long-acting benzodiazepine with active metabolites, classically used for alcohol withdrawal (fixed-dose or symptom-triggered regimens) and for anxiety. The long half-life smooths withdrawal but accumulates in older adults and hepatic impairment, where a shorter-acting agent (lorazepam, oxazepam) is preferred.',
    starting: 'For alcohol withdrawal, typical regimens start around 25-50 mg PO every 6 hours, tapered over days (symptom-triggered dosing where feasible). For anxiety, 5-25 mg two to four times daily. Counsel against combining with opioids.',
    stopping: 'Do not stop abruptly after regular use (seizure risk). In withdrawal protocols the dose is tapered off over several days; for chronic anxiety use, taper gradually.',
    missed: 'Take when remembered unless close to the next dose; do not double up.',
    converting: 'Cross-taper using approximate equivalency when substituting for another benzodiazepine. In hepatic impairment, prefer converting to lorazepam or oxazepam.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=chlordiazepoxide',
    fdaLabelDate: ''
  },

  clorazepate: {
    generic: 'Clorazepate',
    brand: 'Tranxene',
    classLine: 'Long-acting benzodiazepine (prodrug) — anxiety, seizures, alcohol withdrawal',
    context: 'Prodrug that converts to desmethyldiazepam, giving it a long effective half-life similar to diazepam. Used for anxiety, adjunctive seizure treatment, and alcohol withdrawal. Accumulation in older adults and hepatic impairment is the main caution.',
    starting: 'Start about 7.5 mg PO two to three times daily, or 15 mg at bedtime; adjust to response. Use lower doses in older or hepatically impaired patients. Counsel against combining with opioids or alcohol.',
    stopping: 'Do not stop abruptly after regular use (seizure risk). Taper gradually; the long half-life makes the taper relatively smooth.',
    missed: 'Take when remembered unless close to the next dose; do not double up.',
    converting: 'Cross-taper using approximate equivalency. Like diazepam, it can serve as a long-acting agent to taper shorter-acting benzodiazepines.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=clorazepate',
    fdaLabelDate: ''
  },

  midazolam: {
    generic: 'Midazolam',
    brand: 'Versed',
    classLine: 'Ultra-short-acting benzodiazepine — procedural sedation, acute agitation, seizures',
    context: 'Ultra-short-acting benzodiazepine used parenterally (and intranasally) for procedural sedation, acute severe agitation, and seizure emergencies (including a nasal rescue form for seizure clusters). It is not an outpatient maintenance anxiolytic. Respiratory depression is the key acute risk, magnified by opioids.',
    starting: 'Dosing is procedural and route-specific, titrated by a clinician in a monitored setting (IV/IM), or given as a fixed intranasal dose for seizure clusters. It is not self-administered for daily anxiety. Have airway support and monitoring available.',
    stopping: 'Used acutely rather than chronically, so a taper generally does not apply; prolonged ICU infusions are weaned to avoid withdrawal.',
    missed: 'Not applicable — administered acutely by a clinician (or as directed for a nasal rescue), not on a standing home schedule.',
    converting: 'Not an agent patients are maintained on; for ongoing anxiety, definitive therapy (SSRI/SNRI) and, if needed, a scheduled longer-acting benzodiazepine are used instead.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=midazolam',
    fdaLabelDate: ''
  },

  triazolam: {
    generic: 'Triazolam',
    brand: 'Halcion',
    classLine: 'Ultra-short-acting benzodiazepine — sleep-onset insomnia (short-term)',
    context: 'Ultra-short-acting benzodiazepine hypnotic for short-term treatment of sleep-onset insomnia. Its brief duration limits next-day sedation but predisposes to rebound insomnia and anterograde amnesia, so use is intended to be brief. Many CYP3A4 inhibitors dangerously raise its levels.',
    starting: 'Take 0.125-0.25 mg PO at bedtime for short-term use only, immediately before sleep with time for a full night. Use 0.125 mg in older adults. Avoid strong CYP3A4 inhibitors (e.g., azole antifungals, some macrolides, ritonavir).',
    stopping: 'After only brief use a taper is usually unnecessary, but expect a night or two of rebound insomnia; taper if used regularly for longer.',
    missed: 'Take only at bedtime with a full night ahead; skip entirely if the night is over. Do not redose to chase sleep.',
    converting: 'When moving to a non-benzodiazepine approach (sleep hygiene/CBT-I, a non-BZD hypnotic, or a low-dose sedating antidepressant), simply substitute at bedtime and reinforce behavioral measures.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=triazolam',
    fdaLabelDate: ''
  },

  estazolam: {
    generic: 'Estazolam',
    brand: 'Prosom',
    classLine: 'Intermediate-acting benzodiazepine — insomnia (short-term)',
    context: 'Intermediate-acting benzodiazepine hypnotic for short-term insomnia, covering both sleep onset and maintenance. Dependence, next-day sedation, and the usual benzodiazepine cautions apply; use the lowest effective dose for the shortest duration.',
    starting: 'Take 1 mg PO at bedtime (0.5 mg in older or debilitated patients); up to 2 mg if needed. Reserve for short-term use with attention to fall risk in older adults.',
    stopping: 'Taper if used regularly to avoid rebound insomnia and withdrawal; brief use can usually be stopped directly with a possible night or two of rebound.',
    missed: 'Take only at bedtime with a full night ahead; skip if the night is over.',
    converting: 'Substitute a behavioral (CBT-I) or non-benzodiazepine approach at bedtime when transitioning off, reinforcing sleep hygiene.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=estazolam',
    fdaLabelDate: ''
  },

  flurazepam: {
    generic: 'Flurazepam',
    brand: 'Dalmane',
    classLine: 'Long-acting benzodiazepine — insomnia',
    context: 'Long-acting benzodiazepine hypnotic with active metabolites that accumulate, producing next-day sedation and impairment — particularly problematic in older adults, in whom it is best avoided (Beers criteria). Largely supplanted by shorter-acting hypnotics.',
    starting: 'Take 15-30 mg PO at bedtime (15 mg in older or debilitated patients, where it is generally best avoided altogether). Counsel about next-day grogginess and impaired driving, which worsen with repeated nightly use.',
    stopping: 'Taper if used regularly; the long half-life makes offset gradual but also prolongs residual sedation after stopping.',
    missed: 'Take only at bedtime with a full night ahead; skip if the night is over.',
    converting: 'When switching to a safer hypnotic strategy, substitute at bedtime and allow for the prolonged washout of accumulated metabolites.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=flurazepam',
    fdaLabelDate: ''
  },

  temazepam: {
    generic: 'Temazepam',
    brand: 'Restoril',
    classLine: 'Intermediate-acting benzodiazepine — insomnia',
    context: 'Intermediate-acting benzodiazepine hypnotic for short-term insomnia, cleared by glucuronidation (no active metabolites), so it accumulates less than long-acting agents and is relatively better tolerated in older adults among the benzodiazepines. Dependence and next-day sedation still apply.',
    starting: 'Take 7.5-15 mg PO at bedtime (7.5 mg in older adults; up to 30 mg if needed) for short-term use, taken with a full night ahead. Reinforce sleep hygiene and a plan for limited duration.',
    stopping: 'Taper if used regularly to limit rebound insomnia and withdrawal; brief use can usually be stopped directly.',
    missed: 'Take only at bedtime with a full night ahead; skip if the night is over.',
    converting: 'Substitute a behavioral (CBT-I) or non-benzodiazepine approach at bedtime when transitioning off, reinforcing sleep hygiene.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=temazepam',
    fdaLabelDate: ''
  },

  zolpidem: {
    generic: 'Zolpidem',
    brand: 'Ambien',
    classLine: 'Non-benzodiazepine hypnotic (Z-drug) — insomnia',
    context: 'Non-benzodiazepine GABA-A hypnotic for short-term insomnia (immediate-release for sleep onset; controlled-release adds maintenance). Associated with complex sleep behaviors (sleep-driving, sleep-eating) that warrant stopping the drug, and with next-day impairment — women and CR users clear it more slowly, so doses are lower.',
    starting: 'Take immediately before bed with at least 7-8 hours available: 5 mg PO for women and older adults, 5-10 mg for men (CR 6.25 mg / 12.5 mg respectively). Do not take with or after a meal, with alcohol, or if unable to devote a full night to sleep.',
    stopping: 'Short courses can usually be stopped directly, expecting a night or two of rebound insomnia; taper after regular nightly use. Discontinue if any complex sleep behavior occurs.',
    missed: 'Take only at bedtime with a full night ahead; skip entirely if the night is over. Never redose during the night.',
    converting: 'When shifting to CBT-I or another agent, substitute at bedtime and reinforce sleep hygiene. Avoid combining with other sedative-hypnotics.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=zolpidem',
    fdaLabelDate: ''
  },

  eszopiclone: {
    generic: 'Eszopiclone',
    brand: 'Lunesta',
    classLine: 'Non-benzodiazepine hypnotic (Z-drug) — insomnia',
    context: 'Non-benzodiazepine GABA-A hypnotic effective for both sleep onset and maintenance, and approved for longer-term use than most hypnotics. A metallic/bitter taste is a characteristic side effect; next-day impairment and complex sleep behaviors are shared Z-drug risks.',
    starting: 'Start 1 mg PO immediately before bed with a full night ahead; may increase to 2-3 mg if needed (1-2 mg maximum in older adults). Do not take with a high-fat meal or alcohol.',
    stopping: 'Can generally be stopped directly after short use with possible transient rebound; taper after prolonged nightly use.',
    missed: 'Take only at bedtime with a full night ahead; skip if the night is over.',
    converting: 'Substitute CBT-I or another agent at bedtime when transitioning off; avoid combining with other sedative-hypnotics.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=eszopiclone',
    fdaLabelDate: ''
  },

  ramelteon: {
    generic: 'Ramelteon',
    brand: 'Rozerem',
    classLine: 'Melatonin MT1/MT2 agonist — sleep-onset insomnia',
    context: 'Melatonin-receptor agonist for sleep-onset insomnia with no abuse potential and no controlled-substance scheduling, making it a useful option when dependence is a concern (including in patients with substance use histories). It targets sleep onset rather than maintenance.',
    starting: 'Take 8 mg PO about 30 minutes before bedtime; do not take with or right after a high-fat meal (reduces absorption). Avoid combining with fluvoxamine, a strong CYP1A2 inhibitor that greatly raises levels.',
    stopping: 'No dependence or withdrawal — it can be stopped without a taper.',
    missed: 'Take only at bedtime; skip if the night is over. There is no rebound or withdrawal from a missed dose.',
    converting: 'A reasonable substitute when moving a patient off a benzodiazepine or Z-drug hypnotic; pair with CBT-I and sleep hygiene.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=ramelteon',
    fdaLabelDate: ''
  },

  suvorexant: {
    generic: 'Suvorexant',
    brand: 'Belsomra',
    classLine: 'Dual orexin receptor antagonist — insomnia',
    context: 'Dual orexin-receptor antagonist that promotes sleep by dampening wakefulness, helping with both sleep onset and maintenance. Lower dependence potential than benzodiazepines/Z-drugs, though it is still a controlled substance; next-day somnolence and rare sleep paralysis/cataplexy-like symptoms can occur.',
    starting: 'Start 10 mg PO within 30 minutes of bedtime with at least 7 hours available; may increase to a maximum of 20 mg. Do not take with a meal (delays onset). Reduce with strong CYP3A4 inhibitors.',
    stopping: 'No significant withdrawal; can generally be stopped without a taper.',
    missed: 'Take only at bedtime with a full night ahead; skip if the night is over.',
    converting: 'Substitute at bedtime when transitioning off another hypnotic; avoid combining with other sedatives and reinforce sleep hygiene.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=suvorexant',
    fdaLabelDate: ''
  },

  methylphenidate: {
    generic: 'Methylphenidate',
    brand: 'Ritalin',
    classLine: 'Stimulant (Schedule II) — ADHD, narcolepsy',
    context: 'First-line stimulant for ADHD (and narcolepsy), available in many immediate- and extended-release formulations. Screen cardiovascular history before starting and monitor blood pressure, heart rate, appetite, sleep, and growth in youth. Schedule II with misuse/diversion potential; boxed warning for dependence.',
    starting: 'Immediate-release: start 5 mg PO once or twice daily and titrate weekly; extended-release: start low once each morning and titrate to effect. Dose by clinical response rather than a fixed target, using the shortest-acting coverage that fits the day. Avoid late dosing (insomnia).',
    stopping: 'No physiologic taper is required, but expect rebound fatigue/inattention and, after heavy use, dysphoria; there is no withdrawal seizure risk.',
    missed: 'Take a morning/scheduled dose when remembered earlier in the day; skip if it is late (to protect sleep) and do not double up.',
    converting: 'Switching between methylphenidate products or to an amphetamine is done by clinical re-titration, not a fixed conversion. Amphetamine and methylphenidate are not milligram-equivalent.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=methylphenidate',
    fdaLabelDate: ''
  },

  dexmethylphenidate: {
    generic: 'Dexmethylphenidate',
    brand: 'Focalin',
    classLine: 'Stimulant (Schedule II) — ADHD',
    context: 'The active d-isomer of methylphenidate, so roughly half the milligram dose gives a comparable effect. Used for ADHD, immediate- and extended-release. Same cardiovascular screening, monitoring, and Schedule II misuse considerations as methylphenidate.',
    starting: 'Immediate-release: start 2.5 mg PO twice daily and titrate weekly; extended-release: start 5-10 mg each morning and titrate to effect. Dose by response; avoid late dosing to protect sleep.',
    stopping: 'No physiologic taper required; expect rebound fatigue/inattention.',
    missed: 'Take when remembered earlier in the day; skip if it is late and do not double up.',
    converting: 'Roughly 2:1 when converting from methylphenidate (dexmethylphenidate ~half the mg), but confirm by clinical re-titration rather than assuming equivalence.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=dexmethylphenidate',
    fdaLabelDate: ''
  },

  'amphetamine-mixed-salts': {
    generic: 'Amphetamine Mixed Salts',
    brand: 'Adderall',
    classLine: 'Stimulant (Schedule II) — ADHD, narcolepsy',
    context: 'Mixed amphetamine salts for ADHD and narcolepsy, immediate- and extended-release. Somewhat longer-acting and, for some patients, more potent than methylphenidate. Cardiovascular screening and ongoing monitoring of BP, heart rate, appetite, sleep, and growth apply; Schedule II with a dependence boxed warning.',
    starting: 'Immediate-release: start 5 mg PO once or twice daily and titrate weekly; extended-release (XR): start 5-10 mg each morning and titrate to effect. Dose by clinical response; avoid afternoon/evening dosing to protect sleep.',
    stopping: 'No physiologic taper required, but expect rebound fatigue and, after heavy use, dysphoria; taper only high chronic doses for comfort.',
    missed: 'Take when remembered earlier in the day; skip if it is late (to protect sleep) and do not double up.',
    converting: 'Switching to/from methylphenidate or to lisdexamfetamine is done by clinical re-titration; the agents are not milligram-equivalent.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=amphetamine',
    fdaLabelDate: ''
  },

  dextroamphetamine: {
    generic: 'Dextroamphetamine',
    brand: 'Dexedrine',
    classLine: 'Stimulant (Schedule II) — ADHD, narcolepsy',
    context: 'Single-isomer amphetamine for ADHD and narcolepsy, immediate- and extended-release. Clinically similar to mixed amphetamine salts. Same cardiovascular screening, monitoring, and Schedule II misuse considerations.',
    starting: 'Start 5 mg PO once or twice daily and titrate weekly to effect (extended-release once each morning). Dose by clinical response; avoid late dosing to protect sleep.',
    stopping: 'No physiologic taper required; expect rebound fatigue/inattention.',
    missed: 'Take when remembered earlier in the day; skip if it is late and do not double up.',
    converting: 'Switching among amphetamine products or from methylphenidate is done by re-titration, not fixed conversion.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=dextroamphetamine',
    fdaLabelDate: ''
  },

  lisdexamfetamine: {
    generic: 'Lisdexamfetamine',
    brand: 'Vyvanse',
    classLine: 'Stimulant prodrug (Schedule II) — ADHD, binge eating disorder',
    context: 'Prodrug that is converted to dextroamphetamine in the blood, giving a smooth, long, once-daily effect and somewhat lower abuse appeal than immediate-release amphetamines (though still Schedule II). Approved for ADHD and moderate-to-severe binge eating disorder. Standard cardiovascular screening and monitoring apply.',
    starting: 'Start 30 mg PO each morning; titrate in ~10-20 mg weekly steps to a usual 30-70 mg/day. The capsule may be swallowed whole or dissolved in water/food. Dose in the morning to protect sleep.',
    stopping: 'No physiologic taper required; expect rebound fatigue.',
    missed: 'Take when remembered in the morning; skip if it is afternoon or later (to protect sleep) and do not double up.',
    converting: 'Conversion from other amphetamines is by clinical re-titration, not a fixed ratio. Its gradual onset makes it less useful for on-demand, short-window coverage.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=lisdexamfetamine',
    fdaLabelDate: ''
  },

  modafinil: {
    generic: 'Modafinil',
    brand: 'Provigil',
    classLine: 'Wake-promoting agent — narcolepsy, OSA, shift-work disorder',
    context: 'Wake-promoting agent for excessive sleepiness in narcolepsy, obstructive sleep apnea (as an adjunct to CPAP), and shift-work disorder. Lower abuse potential than stimulants. It induces CYP3A4 and can reduce the effectiveness of hormonal contraceptives; rare serious rash (including SJS) warrants stopping for any significant rash.',
    starting: 'Take 200 mg PO each morning (split morning/midday dosing is used for shift work). Counsel patients on hormonal contraception about reduced efficacy and backup methods. Reduce the dose in severe hepatic impairment.',
    stopping: 'No significant withdrawal; can generally be stopped without a taper.',
    missed: 'Take when remembered in the morning; skip if it is late (to protect sleep) and do not double up.',
    converting: 'When switching to/from armodafinil or a stimulant, re-titrate by response. Armodafinil is the longer-acting R-enantiomer and not milligram-equivalent.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=modafinil',
    fdaLabelDate: ''
  },

  armodafinil: {
    generic: 'Armodafinil',
    brand: 'Nuvigil',
    classLine: 'Wake-promoting agent — narcolepsy, OSA, shift-work disorder',
    context: 'The longer-acting R-enantiomer of modafinil, with the same indications and cautions: low abuse potential, CYP3A4 induction that lowers hormonal-contraceptive efficacy, and rare serious rash requiring discontinuation.',
    starting: 'Take 150-250 mg PO each morning (a single lower dose is often adequate for shift work, taken about 1 hour before the shift). Counsel on contraceptive interactions and reduce the dose in severe hepatic impairment.',
    stopping: 'No significant withdrawal; can generally be stopped without a taper.',
    missed: 'Take when remembered in the morning; skip if it is late and do not double up.',
    converting: 'Switching to/from modafinil or a stimulant is by clinical re-titration, not a fixed ratio.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=armodafinil',
    fdaLabelDate: ''
  },

  solriamfetol: {
    generic: 'Solriamfetol',
    brand: 'Sunosi',
    classLine: 'Dopamine-norepinephrine reuptake inhibitor — excessive sleepiness (narcolepsy, OSA)',
    context: 'Dopamine-norepinephrine reuptake inhibitor for excessive daytime sleepiness in narcolepsy and obstructive sleep apnea. It raises blood pressure and heart rate (monitor, especially in cardiovascular disease) and is renally cleared, so dose by kidney function. Not for the underlying apnea itself.',
    starting: 'Start 75 mg PO on waking; may double to a maximum of 150 mg/day after at least 3 days. Take on waking and avoid dosing within 9 hours of bedtime. Reduce the dose in renal impairment; avoid in end-stage renal disease. Do not combine with MAOIs.',
    stopping: 'No significant withdrawal; can generally be stopped without a taper.',
    missed: 'Take on waking when remembered; skip if it is late in the day (to protect sleep) and do not double up.',
    converting: 'Switching to/from a wake-promoting agent or stimulant is by clinical re-titration. A 14-day separation from MAOIs is required.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=solriamfetol',
    fdaLabelDate: ''
  },

  clonidine: {
    generic: 'Clonidine',
    brand: 'Catapres',
    classLine: 'Alpha-2 agonist — ADHD, tics, hyperarousal/PTSD, hypertension',
    context: 'Central alpha-2 agonist used in psychiatry for ADHD (extended-release, alone or with a stimulant), tics, and hyperarousal/nightmares in PTSD, as well as for hypertension and opioid withdrawal. Sedation and hypotension are common; the key safety point is that abrupt discontinuation can cause rebound hypertension.',
    starting: 'Start low, e.g., 0.1 mg PO at bedtime (extended-release 0.1 mg for ADHD), titrating gradually; sedation and orthostasis guide the pace. Monitor blood pressure and heart rate. Immediate- and extended-release forms are not interchangeable milligram-for-milligram.',
    stopping: 'Do not stop abruptly — taper over several days to avoid rebound hypertension (and rebound anxiety/agitation). Reduce gradually, particularly at higher doses.',
    missed: 'Take when remembered unless close to the next dose; do not double up. Repeated missed doses risk rebound hypertension, so maintain the schedule.',
    converting: 'When switching to/from guanfacine or adjusting alpha-2 therapy, cross-taper and keep monitoring blood pressure. Do not treat IR and ER doses as equivalent.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=clonidine',
    fdaLabelDate: ''
  },

  guanfacine: {
    generic: 'Guanfacine',
    brand: 'Tenex / Intuniv',
    classLine: 'Alpha-2A agonist — ADHD, tics',
    context: 'Selective alpha-2A agonist used mainly for ADHD (extended-release Intuniv, alone or added to a stimulant) and tics. Less sedating and longer-acting than clonidine. Like clonidine, it lowers blood pressure and heart rate and can cause rebound hypertension if stopped abruptly.',
    starting: 'Extended-release: start 1 mg PO daily and titrate by 1 mg/week to a usual 1-4 mg/day (dose by weight/response in children). Monitor blood pressure and heart rate. Immediate- and extended-release forms are not interchangeable; swallow ER tablets whole and not with a high-fat meal.',
    stopping: 'Do not stop abruptly — taper (e.g., decrease by 1 mg every 3-7 days) to avoid rebound hypertension.',
    missed: 'Take when remembered unless close to the next dose; do not double up. If several doses are missed, re-titrate rather than resuming the full dose.',
    converting: 'When switching to/from clonidine or adjusting therapy, cross-taper with blood-pressure monitoring; the two are not milligram-equivalent.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=guanfacine',
    fdaLabelDate: ''
  },

  propranolol: {
    generic: 'Propranolol',
    brand: 'Inderal',
    classLine: 'Non-selective beta blocker — performance/situational anxiety, akathisia, tremor',
    context: 'Non-selective beta blocker used in psychiatry to blunt the physical symptoms of performance or situational anxiety (tremor, palpitations, sweating), to treat akathisia, and for essential tremor and migraine prophylaxis. Avoid in asthma/COPD and use caution in bradycardia, heart block, and diabetes (masks hypoglycemia).',
    starting: 'For performance anxiety, take 10-40 mg PO about 30-60 minutes before the event (a test dose beforehand is wise). For akathisia or standing use, 10-20 mg two to three times daily, titrated to effect and tolerability, watching blood pressure and heart rate.',
    stopping: 'Occasional PRN use can simply be stopped. After regular daily use, taper over about 1-2 weeks — abrupt withdrawal of a beta blocker can cause rebound tachycardia/hypertension (and is dangerous in coronary disease).',
    missed: 'For PRN use, only take before the anticipated situation. For scheduled use, take when remembered unless close to the next dose; do not double up.',
    converting: 'When substituting another agent for anxiety or akathisia, overlap and taper the propranolol rather than stopping it abruptly if it was taken regularly.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=propranolol',
    fdaLabelDate: ''
  },

  hydroxyzine: {
    generic: 'Hydroxyzine',
    brand: 'Vistaril',
    classLine: 'Antihistamine anxiolytic — anxiety (including PRN), pruritus',
    context: 'Sedating antihistamine used as a non-dependence-forming anxiolytic — useful for as-needed anxiety when a benzodiazepine is undesirable, and for itch. Main downsides are sedation, anticholinergic effects, and dose-related QT prolongation at higher doses; caution in older adults and cardiac patients.',
    starting: 'For anxiety, 25-50 mg PO up to four times daily as needed (start at the lower end, especially in older adults). Onset is within an hour, so it works as a PRN. Avoid combining with other strong QT-prolonging drugs at higher doses.',
    stopping: 'No dependence or withdrawal — it can be stopped without a taper.',
    missed: 'For PRN use, take when symptoms warrant. For scheduled use, take when remembered unless close to the next dose; do not double up.',
    converting: 'A reasonable non-addictive substitute when tapering a patient off a benzodiazepine for anxiety; can be used alongside an SSRI/SNRI while that takes effect.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=hydroxyzine',
    fdaLabelDate: ''
  },

  diphenhydramine: {
    generic: 'Diphenhydramine',
    brand: 'Benadryl',
    classLine: 'Antihistamine — OTC sleep aid, acute dystonia/EPS, allergy',
    context: 'First-generation antihistamine used in psychiatry as an over-the-counter sleep aid and, importantly, to treat acute drug-induced dystonia and extrapyramidal reactions. Strongly anticholinergic — chronic use for sleep is discouraged, and it should be avoided in older adults (confusion, falls, urinary retention; Beers criteria).',
    starting: 'For acute dystonia, 25-50 mg IM/IV (or PO) provides rapid relief. For occasional insomnia, 25-50 mg PO at bedtime short-term only. Avoid routine nightly use and use in older adults given anticholinergic risk.',
    stopping: 'No significant withdrawal; can be stopped directly. Tolerance to the hypnotic effect develops quickly, which is another reason to avoid ongoing use.',
    missed: 'For sleep dosing, take only at bedtime and skip if the night is over.',
    converting: 'For ongoing insomnia, transition to CBT-I or a more appropriate agent rather than continued antihistamine use; the anticholinergic burden makes it a poor long-term choice.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=diphenhydramine',
    fdaLabelDate: ''
  },

  doxylamine: {
    generic: 'Doxylamine',
    brand: 'Unisom / Diclegis',
    classLine: 'Antihistamine — OTC sleep aid; nausea of pregnancy (with pyridoxine)',
    context: 'First-generation antihistamine sold over the counter as a sleep aid and, combined with pyridoxine (vitamin B6), used for nausea and vomiting of pregnancy. Like other sedating antihistamines it is anticholinergic, so it is not a good long-term hypnotic and should be used cautiously in older adults.',
    starting: 'For occasional insomnia, 25 mg PO at bedtime short-term. For nausea of pregnancy, the doxylamine-pyridoxine combination is dosed per its label under obstetric guidance. Expect next-morning grogginess.',
    stopping: 'No significant withdrawal; can be stopped directly. Tolerance to the hypnotic effect develops quickly.',
    missed: 'For sleep dosing, take only at bedtime and skip if the night is over.',
    converting: 'For persistent insomnia, move to CBT-I or a more appropriate agent rather than ongoing antihistamine use.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=doxylamine',
    fdaLabelDate: ''
  },

  trihexyphenidyl: {
    generic: 'Trihexyphenidyl',
    brand: 'Artane',
    classLine: 'Anticholinergic — drug-induced parkinsonism / extrapyramidal symptoms, dystonia',
    context: 'Anticholinergic used to treat antipsychotic-induced parkinsonism and dystonia (an alternative to benztropine). It relieves rigidity, tremor, and dystonia but adds anticholinergic burden (dry mouth, constipation, urinary retention, cognitive impairment) and has some misuse potential for its euphoriant effect; avoid in older adults where possible.',
    starting: 'Start 1 mg PO daily and titrate gradually to a usual 5-15 mg/day in divided doses, guided by relief of EPS versus anticholinergic side effects. Reassess the need periodically — it is often possible to withdraw it as the offending antipsychotic is adjusted.',
    stopping: 'Taper rather than stopping abruptly after regular use to avoid cholinergic rebound and a flare of extrapyramidal symptoms.',
    missed: 'Take when remembered unless close to the next dose; do not double up.',
    converting: 'When switching to/from another anticholinergic (e.g., benztropine), cross-taper using approximate equivalence and watch total anticholinergic load.',
    fdaLabel: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=trihexyphenidyl',
    fdaLabelDate: ''
  },

};

// Expose for consumers that expect a global (app.js references BHI_REFERENCES directly).
if (typeof window !== 'undefined') { window.BHI_REFERENCES = BHI_REFERENCES; }

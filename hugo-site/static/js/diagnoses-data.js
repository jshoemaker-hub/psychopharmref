/* ── Diagnoses database ──────────────────────────────────────────────────────
   A structured reference of psychiatric diagnoses, grouped by category, for the
   Psychopharmacology section. Each entry carries key clinical characteristics in
   original wording (NOT copied from DSM/ICD text), coding, treatment, and
   epidemiology.

   DRAFT FOR CLINICAL REVIEW. Figures are drawn from standard clinical sources
   and are approximate; codes and epidemiology should be verified against a
   current ICD-10-CM / DSM-5-TR / ICD-11 reference before publication. FDA
   indications are current to 2026 and distinguish first-line from adjunct/second-
   line agents — they do not capture every labeled or off-label option.

   Coding note: DSM-5-TR adopts ICD-10-CM codes, so the "DSM-5-TR" code and the
   ICD-10-CM code are the same string; the ICD-11 code is shown alongside for
   the international scheme.

   Data shape (see SCHEMA below) is intentionally flat so the same module can
   drive the standalone preview page and, once approved, the in-app section.
   ────────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  // Ordered category list. `id` is used as the grouping key on each diagnosis.
  var CATEGORIES = [
    { id: 'depressive',      name: 'Depressive Disorders',                 blurb: 'Persistent low mood, anhedonia, and neurovegetative change.' },
    { id: 'bipolar',         name: 'Bipolar & Related Disorders',          blurb: 'Episodic disturbances of mood, energy, and activity.' },
    { id: 'anxiety',         name: 'Anxiety Disorders',                     blurb: 'Excessive fear, worry, and avoidance out of proportion to threat.' },
    { id: 'ocd',             name: 'Obsessive-Compulsive & Related',        blurb: 'Intrusive thoughts and repetitive behaviors driven to reduce distress.' },
    { id: 'trauma',          name: 'Trauma- & Stressor-Related',           blurb: 'Syndromes precipitated by an identifiable stressor or trauma.' },
    { id: 'psychotic',       name: 'Schizophrenia Spectrum & Psychotic',   blurb: 'Disturbances of reality testing, thought, and perception.' },
    { id: 'neurodev',        name: 'Neurodevelopmental Disorders',          blurb: 'Onset in the developmental period; deficits in cognition, attention, or social function.' },
    { id: 'eating',          name: 'Feeding & Eating Disorders',            blurb: 'Disturbed eating behavior with impact on health and functioning.' },
    { id: 'substance',       name: 'Substance-Related & Addictive',         blurb: 'Compulsive use despite harm; tolerance and withdrawal.' },
    { id: 'neurocognitive',  name: 'Neurocognitive Disorders',              blurb: 'Acquired decline in cognition from a medical/neurologic cause.' },
    { id: 'sleep',           name: 'Sleep-Wake Disorders',                  blurb: 'Disorders of sleep quantity, quality, or timing.' },
    { id: 'personality',     name: 'Personality Disorders',                 blurb: 'Enduring, inflexible patterns of inner experience and behavior.' },
    { id: 'somatic',         name: 'Somatic Symptom & Dissociative',        blurb: 'Distressing bodily symptoms or disruptions of identity/awareness.' }
  ];

  /* SCHEMA (per diagnosis)
     id        unique slug
     name      display name
     cat       category id (see CATEGORIES)
     desc      key characteristics, original wording
     codes     { dsm, icd10, icd11 }   dsm === icd10 by design in DSM-5-TR
     meds      { first:[], adjunct:[], note:'' }  FDA-approved unless marked off-label
     therapy   [] recommended psychotherapies / non-pharm
     epi       { incidence, prevalence, mortality, onset }
     ddx       [] key differentials
     redFlags  [] danger signs / when to escalate or refer
     scales    [] relevant rating scales (many exist as tools on this site)
     course    typical trajectory / prognosis
     comorbid  [] common comorbidities
  */

  var DX = [];

  // ── Depressive Disorders ────────────────────────────────────────────────────
  DX.push(
    {
      id: 'mdd', name: 'Major Depressive Disorder', cat: 'depressive',
      desc: 'At least two weeks of pervasive low mood or loss of interest, plus a cluster of sleep, appetite, energy, concentration, guilt, psychomotor, and suicidality changes that mark a clear break from prior functioning.',
      codes: { dsm: 'F33.9 (recurrent) / F32.9 (single)', icd10: 'F32.9, F33.9', icd11: '6A70 / 6A71' },
      meds: {
        first: ['SSRIs (sertraline, escitalopram, fluoxetine)', 'SNRIs (venlafaxine, duloxetine)', 'Bupropion', 'Mirtazapine'],
        adjunct: ['Atypical antipsychotics as augmentation (aripiprazole, brexpiprazole, quetiapine XR, cariprazine)', 'Lithium augmentation', 'Esketamine (Spravato) for treatment-resistant depression', 'Dextromethorphan-bupropion (Auvelity)', 'Vortioxetine, vilazodone'],
        note: 'Choice guided by side-effect profile, prior response, and target residual symptoms. ECT/TMS for severe or refractory illness.'
      },
      therapy: ['Cognitive behavioral therapy (CBT)', 'Behavioral activation', 'Interpersonal therapy (IPT)', 'Problem-solving therapy', 'Exercise as adjunct'],
      epi: { incidence: '~1.5% of adults develop a new episode per year', prevalence: '~8% 12-month, ~21% lifetime (US adults)', mortality: 'Elevated all-cause and suicide mortality; ~60% of suicides occur in mood disorders', onset: 'Median mid-20s; can occur across the lifespan' },
      ddx: ['Bipolar depression', 'Persistent depressive disorder', 'Adjustment disorder with depressed mood', 'Hypothyroidism / anemia / medication effect', 'Substance-induced mood disorder', 'Grief'],
      redFlags: ['Active suicidal ideation with plan/intent', 'Psychotic features', 'Catatonia', 'Inability to maintain nutrition/hydration', 'Postpartum onset with thoughts of harm'],
      scales: ['PHQ-9', 'C-SSRS (suicide risk)', 'MADRS', 'HAM-D'],
      course: 'Episodic and recurrent; roughly half recur after a first episode, more after subsequent ones. Most single episodes remit within 6–12 months with treatment.',
      comorbid: ['Anxiety disorders', 'Substance use', 'Chronic pain', 'Cardiovascular disease']
    },
    {
      id: 'pdd', name: 'Persistent Depressive Disorder (Dysthymia)', cat: 'depressive',
      desc: 'A low-grade but tenacious depression lasting two years or more, where the depressed state becomes the person’s baseline rather than a discrete episode; symptom-free intervals never exceed two months.',
      codes: { dsm: 'F34.1', icd10: 'F34.1', icd11: '6A72' },
      meds: { first: ['SSRIs', 'SNRIs'], adjunct: ['Augmentation strategies as in MDD when superimposed major episodes occur ("double depression")'], note: 'Pharmacotherapy plus psychotherapy generally outperforms either alone in chronic depression.' },
      therapy: ['CBASP (Cognitive Behavioral Analysis System of Psychotherapy)', 'CBT', 'IPT'],
      epi: { incidence: 'Less well characterized than MDD', prevalence: '~1.5% 12-month (US adults)', mortality: 'Chronic disability; suicide risk comparable to MDD', onset: 'Often early — childhood, adolescence, or early adulthood (early-onset < age 21)' },
      ddx: ['MDD', 'Bipolar II', 'Personality disorder', 'Medical/endocrine causes'],
      redFlags: ['Emergence of a superimposed major depressive episode', 'Suicidal ideation'],
      scales: ['PHQ-9', 'C-SSRS'],
      course: 'Chronic and fluctuating; high risk of superimposed major episodes and of comorbid personality pathology.',
      comorbid: ['MDD', 'Anxiety disorders', 'Substance use', 'Personality disorders']
    },
    {
      id: 'pmdd', name: 'Premenstrual Dysphoric Disorder', cat: 'depressive',
      desc: 'Marked mood instability, irritability, and tension confined to the luteal phase, resolving within days of menses onset, and severe enough to disrupt relationships or work — distinct from ordinary premenstrual discomfort.',
      codes: { dsm: 'F32.81', icd10: 'F32.81', icd11: 'GA34.41' },
      meds: { first: ['SSRIs — continuous or luteal-phase dosing (fluoxetine, sertraline, paroxetine)'], adjunct: ['Combined oral contraceptive with drospirenone (e.g., drospirenone/ethinyl estradiol)', 'GnRH agonists for refractory cases (with add-back)'], note: 'SSRIs often work within days for PMDD, unlike the weeks needed in MDD.' },
      therapy: ['CBT', 'Symptom charting', 'Lifestyle: exercise, sleep, reduced caffeine/alcohol'],
      epi: { incidence: 'N/A', prevalence: '~1.8–5.8% of menstruating women', mortality: 'Increased suicidal ideation risk in luteal phase', onset: 'Reproductive years; may worsen approaching menopause' },
      ddx: ['Premenstrual exacerbation of MDD/anxiety/bipolar', 'Thyroid disease', 'Perimenopause'],
      redFlags: ['Cyclic suicidal ideation', 'Symptoms not remitting after menses (suggests underlying mood disorder)'],
      scales: ['Prospective daily symptom rating (DRSP)', 'C-SSRS'],
      course: 'Chronic across reproductive years; symptoms track the menstrual cycle and typically remit after menopause.',
      comorbid: ['MDD', 'Anxiety disorders']
    },
    {
      id: 'dmdd', name: 'Disruptive Mood Dysregulation Disorder', cat: 'depressive',
      desc: 'A childhood pattern of persistently irritable or angry mood punctuated by frequent, developmentally inappropriate temper outbursts — conceived to curb over-diagnosis of pediatric bipolar disorder.',
      codes: { dsm: 'F34.81', icd10: 'F34.81', icd11: '— (no direct equivalent; oppositional defiant with chronic irritability)' },
      meds: { first: ['No FDA-approved agent; treat the predominant problem'], adjunct: ['Stimulants if comorbid ADHD', 'SSRIs for mood/irritability (off-label)', 'Atypical antipsychotics (e.g., risperidone, off-label) for severe aggression'], note: 'Diagnosis requires onset before age 10 and is not made for the first time before 6 or after 18.' },
      therapy: ['Parent management training', 'CBT', 'Family-focused approaches'],
      epi: { incidence: 'N/A', prevalence: '~2–5% of children', mortality: 'Low direct mortality; functional impairment', onset: 'By definition before age 10' },
      ddx: ['Bipolar disorder', 'Oppositional defiant disorder', 'ADHD', 'Intermittent explosive disorder', 'Autism spectrum disorder'],
      redFlags: ['Aggression endangering others', 'Emerging discrete manic episodes (reconsider bipolar)'],
      scales: ['Parent/teacher behavior rating scales'],
      course: 'Chronic irritability in childhood; tends to evolve toward unipolar depression and anxiety (not bipolar disorder) in adulthood.',
      comorbid: ['ADHD', 'Anxiety disorders', 'ODD']
    }
  );

  // ── Bipolar & Related ───────────────────────────────────────────────────────
  DX.push(
    {
      id: 'bipolar1', name: 'Bipolar I Disorder', cat: 'bipolar',
      desc: 'Defined by at least one full manic episode — a week or more (or any duration if hospitalized) of elevated or irritable mood with inflated self-regard, decreased need for sleep, pressured drive, and risk-taking; depressive episodes usually occur but are not required.',
      codes: { dsm: 'F31.x', icd10: 'F31.9 (unspecified)', icd11: '6A60' },
      meds: {
        first: ['Lithium', 'Valproate (avoid in pregnancy/childbearing potential)', 'Atypical antipsychotics (quetiapine, aripiprazole, risperidone, cariprazine, asenapine, olanzapine)', 'Milsaperidone (Bysanti, 2026)'],
        adjunct: ['Lamotrigine (maintenance, more for depression prevention)', 'Lithium + antipsychotic for acute severe mania', 'Cariprazine/lurasidone/quetiapine for bipolar depression', 'ECT for refractory/psychotic/pregnant patients'],
        note: 'Antidepressant monotherapy is avoided — risk of manic switch and cycle acceleration.'
      },
      therapy: ['Psychoeducation', 'Interpersonal and social rhythm therapy (IPSRT)', 'Family-focused therapy', 'CBT for adherence and relapse prevention'],
      epi: { incidence: '~0.02–0.05% per year', prevalence: '~0.6–1% lifetime', mortality: 'Suicide risk 10–30x general population; elevated cardiometabolic mortality', onset: 'Late teens to early 20s (median ~18–20)' },
      ddx: ['Bipolar II', 'MDD', 'Schizoaffective disorder', 'Substance-induced mania', 'ADHD', 'Personality disorders', 'Hyperthyroidism'],
      redFlags: ['Psychosis', 'Suicidality', 'Dangerous impulsivity/spending/sexual risk', 'Manic exhaustion/dehydration', 'Aggression'],
      scales: ['YMRS (mania)', 'CIDI-based bipolar screen', 'C-SSRS'],
      course: 'Lifelong and recurrent with inter-episode recovery; without maintenance treatment, relapse is the rule.',
      comorbid: ['Anxiety disorders', 'Substance use', 'ADHD', 'Metabolic syndrome']
    },
    {
      id: 'bipolar2', name: 'Bipolar II Disorder', cat: 'bipolar',
      desc: 'A pattern of recurrent major depression interleaved with hypomania — briefer, less severe high-energy states that never cause the marked impairment, hospitalization, or psychosis that would make them manic. The depressive burden usually dominates.',
      codes: { dsm: 'F31.81', icd10: 'F31.81', icd11: '6A61' },
      meds: { first: ['Quetiapine', 'Lithium', 'Lamotrigine (for depressive pole/maintenance)', 'Lurasidone (bipolar depression)'], adjunct: ['Cautious antidepressant use only with a mood stabilizer', 'Cariprazine'], note: 'Hypomania can be subtle; careful history distinguishes it from euthymic energetic states.' },
      therapy: ['IPSRT', 'CBT', 'Psychoeducation', 'Family-focused therapy'],
      epi: { incidence: 'Not well established', prevalence: '~0.3–0.8% lifetime', mortality: 'High suicide attempt rate — often exceeds Bipolar I', onset: 'Mid-20s' },
      ddx: ['Bipolar I', 'MDD', 'Cyclothymia', 'Borderline personality disorder'],
      redFlags: ['Suicidality', 'Escalation of hypomania to full mania (rediagnose as Bipolar I)', 'Antidepressant-induced cycling'],
      scales: ['YMRS', 'CIDI bipolar screen', 'C-SSRS', 'PHQ-9'],
      course: 'Chronic and recurrent, often with more time depressed than well; a minority progress to Bipolar I.',
      comorbid: ['Anxiety disorders', 'Substance use', 'Eating disorders']
    },
    {
      id: 'cyclothymia', name: 'Cyclothymic Disorder', cat: 'bipolar',
      desc: 'At least two years of oscillating hypomanic and depressive symptoms that never reach the threshold for a full hypomanic or major depressive episode, yet keep mood in near-constant flux.',
      codes: { dsm: 'F34.0', icd10: 'F34.0', icd11: '6A62' },
      meds: { first: ['Mood stabilizers (lithium, valproate) or low-dose atypical antipsychotics — largely extrapolated, no FDA-approved agent'], adjunct: ['Lamotrigine (off-label)'], note: 'Antidepressants risk destabilization; use cautiously if at all.' },
      therapy: ['Psychoeducation', 'CBT', 'IPSRT', 'Mood charting'],
      epi: { incidence: 'N/A', prevalence: '~0.4–1% lifetime', mortality: 'Low direct mortality; risk of progression', onset: 'Adolescence or early adulthood' },
      ddx: ['Bipolar I/II', 'Borderline personality disorder', 'ADHD', 'Substance use'],
      redFlags: ['Emergence of full mood episodes (reclassify as bipolar)', 'Suicidality'],
      scales: ['Mood charting', 'YMRS'],
      course: 'Chronic; roughly 15–50% eventually develop Bipolar I or II.',
      comorbid: ['Substance use', 'Anxiety disorders', 'Personality disorders']
    }
  );

  // ── Anxiety Disorders ───────────────────────────────────────────────────────
  DX.push(
    {
      id: 'gad', name: 'Generalized Anxiety Disorder', cat: 'anxiety',
      desc: 'Chronic, free-floating worry about everyday matters that the person finds hard to control, tethered to physical tension — restlessness, fatigue, muscle tightness, poor concentration, and disturbed sleep — for six months or more.',
      codes: { dsm: 'F41.1', icd10: 'F41.1', icd11: '6B00' },
      meds: { first: ['SSRIs (escitalopram, paroxetine, sertraline)', 'SNRIs (venlafaxine, duloxetine)'], adjunct: ['Buspirone', 'Pregabalin (off-label in US)', 'Hydroxyzine for short-term use', 'Benzodiazepines short-term only'], note: 'Avoid long-term benzodiazepines given dependence and cognitive risk.' },
      therapy: ['CBT', 'Applied relaxation', 'Mindfulness-based approaches'],
      epi: { incidence: '~2% per year', prevalence: '~3% 12-month, ~9% lifetime', mortality: 'Low direct; elevated cardiovascular risk', onset: 'Median early 30s; often gradual' },
      ddx: ['MDD', 'Panic disorder', 'Social anxiety', 'Hyperthyroidism', 'Caffeine/stimulant effect', 'Substance withdrawal'],
      redFlags: ['Comorbid depression with suicidality', 'Escalating benzodiazepine use'],
      scales: ['GAD-7', 'BAT (Brief Anxiety)', 'Hamilton Anxiety (HAM-A)'],
      course: 'Chronic and fluctuating, waxing with life stress; full remission rates are modest without treatment.',
      comorbid: ['MDD', 'Other anxiety disorders', 'Substance use']
    },
    {
      id: 'panic', name: 'Panic Disorder', cat: 'anxiety',
      desc: 'Recurrent, unexpected surges of intense fear that crest within minutes with pounding heart, breathlessness, chest tightness, and a sense of doom, followed by persistent dread of the next attack or maladaptive avoidance.',
      codes: { dsm: 'F41.0', icd10: 'F41.0', icd11: '6B01' },
      meds: { first: ['SSRIs', 'SNRIs (venlafaxine)'], adjunct: ['Benzodiazepines for short-term bridging', 'TCAs (off-label)'], note: 'Start SSRIs low and go slow — early activation can mimic/trigger panic.' },
      therapy: ['CBT with interoceptive exposure', 'Panic-focused psychodynamic therapy', 'Breathing retraining'],
      epi: { incidence: '~1% per year', prevalence: '~2–3% 12-month', mortality: 'Low direct; frequent ER utilization', onset: 'Late adolescence to mid-30s' },
      ddx: ['Cardiac arrhythmia / ACS', 'Hyperthyroidism', 'Pheochromocytoma', 'Asthma/PE', 'Substance intoxication or withdrawal', 'Other anxiety disorders'],
      redFlags: ['First-ever presentation in older adult (rule out cardiac/medical cause)', 'Agoraphobic housebound state'],
      scales: ['Panic Disorder Severity Scale (PDSS)', 'GAD-7'],
      course: 'Chronic with a relapsing-remitting pattern; agoraphobia commonly develops if untreated.',
      comorbid: ['Agoraphobia', 'MDD', 'Other anxiety disorders', 'Alcohol use']
    },
    {
      id: 'sad', name: 'Social Anxiety Disorder', cat: 'anxiety',
      desc: 'A marked, enduring fear of scrutiny in social or performance situations — of visibly showing anxiety or being judged — leading to avoidance or endurance under distress that constrains work and relationships.',
      codes: { dsm: 'F40.10', icd10: 'F40.10', icd11: '6B04' },
      meds: { first: ['SSRIs (paroxetine, sertraline, fluvoxamine)', 'SNRI (venlafaxine)'], adjunct: ['Beta-blockers (propranolol) for discrete performance anxiety', 'Benzodiazepines short-term'], note: 'Beta-blockers help physical performance symptoms but not generalized social anxiety.' },
      therapy: ['CBT with social exposure', 'Social skills training', 'Group CBT'],
      epi: { incidence: 'N/A', prevalence: '~7% 12-month, ~12% lifetime', mortality: 'Low direct; substantial disability', onset: 'Early — median around age 13' },
      ddx: ['Avoidant personality disorder', 'Panic disorder', 'Autism spectrum disorder', 'Body dysmorphic disorder', 'Normal shyness'],
      redFlags: ['Severe isolation', 'Self-medication with alcohol', 'Comorbid depression/suicidality'],
      scales: ['Liebowitz Social Anxiety Scale (LSAS)', 'SPIN'],
      course: 'Typically chronic and unremitting without treatment; one of the earliest-onset anxiety disorders.',
      comorbid: ['MDD', 'Other anxiety disorders', 'Alcohol use disorder', 'Avoidant PD']
    },
    {
      id: 'agoraphobia', name: 'Agoraphobia', cat: 'anxiety',
      desc: 'Fear or avoidance of situations where escape might be hard or help unavailable if panic-like symptoms strike — public transit, open or enclosed spaces, crowds, or being outside the home alone — often collapsing a person’s world to a safe radius.',
      codes: { dsm: 'F40.00', icd10: 'F40.00', icd11: '6B02' },
      meds: { first: ['SSRIs', 'SNRIs'], adjunct: ['Benzodiazepines short-term for exposure work'], note: 'Frequently co-occurs with panic disorder; treat both.' },
      therapy: ['CBT with graded in-vivo exposure', 'Virtual-reality exposure'],
      epi: { incidence: 'N/A', prevalence: '~1.3% 12-month', mortality: 'Low direct; high disability, housebound risk', onset: 'Late adolescence to early adulthood' },
      ddx: ['Panic disorder', 'Specific phobia', 'Social anxiety', 'PTSD', 'Depression with avoidance'],
      redFlags: ['Complete housebound state', 'Nutritional/medical neglect from avoidance'],
      scales: ['Mobility Inventory', 'PDSS'],
      course: 'Persistent and often disabling; strongly responsive to exposure-based therapy.',
      comorbid: ['Panic disorder', 'MDD', 'Substance use']
    },
    {
      id: 'specific-phobia', name: 'Specific Phobia', cat: 'anxiety',
      desc: 'An out-of-proportion, immediate fear of a particular object or situation — heights, animals, blood/injection/injury, flying — that is actively avoided or endured with intense distress, recognized by the person as excessive.',
      codes: { dsm: 'F40.2xx', icd10: 'F40.218–F40.298', icd11: '6B03' },
      meds: { first: ['No routine pharmacotherapy — exposure therapy is definitive'], adjunct: ['Short-term benzodiazepine or beta-blocker for unavoidable exposures (e.g., single flight)'], note: 'Blood-injection-injury type uses applied tension to counter the vasovagal drop.' },
      therapy: ['In-vivo graded exposure (often single-session)', 'Applied tension for BII type'],
      epi: { incidence: 'N/A', prevalence: '~7–9% 12-month', mortality: 'Low', onset: 'Childhood (median ~7–10)' },
      ddx: ['Agoraphobia', 'Social anxiety', 'PTSD', 'OCD', 'Panic disorder'],
      redFlags: ['Avoidance preventing essential medical care (e.g., needle phobia blocking treatment)'],
      scales: ['Fear questionnaires', 'Behavioral avoidance tests'],
      course: 'Childhood-onset phobias may persist for decades; highly treatable with exposure.',
      comorbid: ['Other anxiety disorders', 'MDD']
    }
  );

  // ── Obsessive-Compulsive & Related ──────────────────────────────────────────
  DX.push(
    {
      id: 'ocd', name: 'Obsessive-Compulsive Disorder', cat: 'ocd',
      desc: 'Unwanted, intrusive thoughts, images, or urges that spike anxiety, coupled with rituals — checking, washing, counting, mental undoing — performed to neutralize the distress, consuming time and eroding function despite the person often knowing the fears are irrational.',
      codes: { dsm: 'F42.2', icd10: 'F42.2', icd11: '6B20' },
      meds: { first: ['SSRIs at higher-than-antidepressant doses (fluoxetine, sertraline, fluvoxamine, paroxetine)', 'Clomipramine'], adjunct: ['Low-dose atypical antipsychotic augmentation (aripiprazole, risperidone)', 'Consider glutamatergic agents in research settings'], note: 'OCD often needs higher doses and longer trials (8–12 weeks) than depression.' },
      therapy: ['Exposure and response prevention (ERP) — first-line', 'CBT', 'Deep brain stimulation for severe refractory cases'],
      epi: { incidence: 'N/A', prevalence: '~1.2% 12-month, ~2–3% lifetime', mortality: 'Elevated suicide risk; low direct medical mortality', onset: 'Bimodal — childhood/adolescence and early adulthood; earlier in males' },
      ddx: ['Generalized anxiety disorder', 'OCPD', 'Body dysmorphic disorder', 'Hoarding disorder', 'Tic disorders', 'Psychosis (poor-insight OCD)'],
      redFlags: ['Suicidality', 'Severe insight loss', 'Symptoms rendering the person housebound', 'PANDAS-type abrupt pediatric onset'],
      scales: ['Y-BOCS', 'C-SSRS'],
      course: 'Usually chronic with waxing and waning; early treatment improves outcome, though a substantial minority remain symptomatic.',
      comorbid: ['MDD', 'Anxiety disorders', 'Tic disorders', 'Body dysmorphic disorder']
    },
    {
      id: 'bdd', name: 'Body Dysmorphic Disorder', cat: 'ocd',
      desc: 'A consuming preoccupation with a perceived flaw in appearance that others cannot see or find trivial, driving mirror-checking, grooming, reassurance-seeking, or camouflage, and frequently steering people toward futile cosmetic procedures.',
      codes: { dsm: 'F45.22', icd10: 'F45.22', icd11: '6B21' },
      meds: { first: ['SSRIs at higher doses (as in OCD)'], adjunct: ['Antipsychotic augmentation for delusional-level BDD'], note: 'Insight is often poor or absent; cosmetic surgery rarely helps and may worsen symptoms.' },
      therapy: ['CBT tailored for BDD (with ERP and perceptual retraining)'],
      epi: { incidence: 'N/A', prevalence: '~2% general population; higher in cosmetic/dermatology settings', mortality: 'High suicidal ideation and attempt rates', onset: 'Adolescence (mid-teens)' },
      ddx: ['OCD', 'Social anxiety disorder', 'Eating disorders', 'Delusional disorder', 'MDD'],
      redFlags: ['Suicidality', 'Repeated cosmetic procedures', 'Delusional conviction'],
      scales: ['BDD-YBOCS', 'C-SSRS'],
      course: 'Chronic if untreated; high suicidality makes it an under-recognized high-risk condition.',
      comorbid: ['MDD', 'Social anxiety', 'OCD', 'Substance use']
    },
    {
      id: 'hoarding', name: 'Hoarding Disorder', cat: 'ocd',
      desc: 'Persistent difficulty parting with possessions regardless of value, driven by a perceived need to save and distress at discarding, until accumulated clutter overwhelms living spaces and their intended use.',
      codes: { dsm: 'F42.3', icd10: 'F42.3', icd11: '6B24' },
      meds: { first: ['SSRIs (limited evidence)'], adjunct: ['Treat comorbid depression/anxiety/ADHD'], note: 'Responds less well to standard OCD pharmacotherapy than OCD itself.' },
      therapy: ['Specialized CBT for hoarding (skills training, sorting, cognitive work)', 'Home-based interventions'],
      epi: { incidence: 'N/A', prevalence: '~2–6%', mortality: 'Fire, fall, and sanitation hazards; social isolation', onset: 'Symptoms begin in adolescence, worsen with age; often severe by 50s+' },
      ddx: ['OCD', 'MDD', 'Neurocognitive disorder', 'Autism spectrum', 'Psychotic disorders'],
      redFlags: ['Squalor with health/safety hazard', 'Eviction risk', 'Endangered dependents or animals'],
      scales: ['Saving Inventory-Revised', 'Clutter Image Rating'],
      course: 'Chronic and progressive; typically worsens across the lifespan without targeted treatment.',
      comorbid: ['MDD', 'Anxiety', 'ADHD']
    },
    {
      id: 'trichotillomania', name: 'Trichotillomania (Hair-Pulling Disorder)', cat: 'ocd',
      desc: 'Recurrent pulling out of one’s own hair resulting in visible hair loss, preceded by rising tension or done automatically, with repeated efforts to stop — a body-focused repetitive behavior rather than a response to obsessions.',
      codes: { dsm: 'F63.3', icd10: 'F63.3', icd11: '6B25.0' },
      meds: { first: ['No FDA-approved agent'], adjunct: ['N-acetylcysteine (off-label)', 'SSRIs (mixed evidence)', 'Olanzapine (off-label)'], note: 'Behavioral therapy outperforms medication for most patients.' },
      therapy: ['Habit reversal training (first-line)', 'Comprehensive behavioral (ComB) model', 'Acceptance and commitment therapy'],
      epi: { incidence: 'N/A', prevalence: '~1–2%', mortality: 'Rare — trichobezoar/GI obstruction if hair ingested', onset: 'Early adolescence' },
      ddx: ['OCD', 'Excoriation disorder', 'Dermatologic alopecia', 'Body dysmorphic disorder', 'Psychotic disorder'],
      redFlags: ['Trichophagia with GI symptoms (trichobezoar)', 'Severe distress/shame with functional impairment'],
      scales: ['MGH Hairpulling Scale'],
      course: 'Often chronic with waxing/waning severity; frequently under-reported due to shame.',
      comorbid: ['Anxiety', 'MDD', 'Excoriation disorder']
    }
  );

  // ── Trauma- & Stressor-Related ──────────────────────────────────────────────
  DX.push(
    {
      id: 'ptsd', name: 'Posttraumatic Stress Disorder', cat: 'trauma',
      desc: 'After exposure to actual or threatened death, injury, or violence, a syndrome of intrusive re-experiencing (memories, nightmares, flashbacks), avoidance of reminders, negative shifts in mood and cognition, and hyperarousal persisting beyond a month.',
      codes: { dsm: 'F43.10', icd10: 'F43.10', icd11: '6B40' },
      meds: { first: ['SSRIs (sertraline, paroxetine — FDA-approved)', 'SNRI (venlafaxine)'], adjunct: ['Prazosin for trauma nightmares/sleep', 'Atypical antipsychotic augmentation for refractory cases', 'Avoid benzodiazepines — worsen outcomes'], note: 'Trauma-focused psychotherapy is first-line; medication is adjunctive or for those preferring it.' },
      therapy: ['Prolonged exposure', 'Cognitive processing therapy (CPT)', 'EMDR', 'Trauma-focused CBT'],
      epi: { incidence: 'Varies with trauma exposure', prevalence: '~3.5% 12-month, ~6–8% lifetime (US)', mortality: 'Elevated suicide and cardiovascular risk', onset: 'Any age; usually within 3 months of trauma but can be delayed' },
      ddx: ['Acute stress disorder', 'Adjustment disorder', 'MDD', 'Panic disorder', 'Complex PTSD', 'TBI', 'Dissociative disorders'],
      redFlags: ['Suicidality', 'Dissociative flashbacks endangering safety', 'Substance use to self-medicate', 'Interpersonal violence exposure ongoing'],
      scales: ['PCL-5', 'CAPS-5', 'C-SSRS'],
      course: 'Roughly half recover within a year; a substantial minority develop a chronic course, especially with repeated or interpersonal trauma.',
      comorbid: ['MDD', 'Substance use', 'Other anxiety disorders', 'TBI']
    },
    {
      id: 'acute-stress', name: 'Acute Stress Disorder', cat: 'trauma',
      desc: 'A short-lived storm of intrusion, negative mood, dissociation, avoidance, and arousal arising in the first days after a trauma and resolving — or evolving into PTSD — within a month of exposure.',
      codes: { dsm: 'F43.0', icd10: 'F43.0', icd11: '— (ICD-11 codes acute stress reaction as QE84, a non-disorder)' },
      meds: { first: ['No routine pharmacotherapy; treat sleep and severe distress symptomatically'], adjunct: ['Short-term hypnotic for insomnia', 'Avoid benzodiazepines and routine debriefing'], note: 'Watch-and-wait with support; trauma-focused CBT if symptoms persist.' },
      therapy: ['Trauma-focused CBT for those with marked symptoms', 'Psychological first aid'],
      epi: { incidence: 'Depends on trauma type (higher after interpersonal violence)', prevalence: '~5–20% of trauma-exposed, varies widely', mortality: 'Related to trauma; suicide risk if severe', onset: 'Within 3 days to 1 month of the event' },
      ddx: ['PTSD', 'Adjustment disorder', 'Brief psychotic disorder with stressor', 'TBI/concussion', 'Panic disorder'],
      redFlags: ['Suicidality', 'Severe dissociation impairing safety'],
      scales: ['Acute Stress Disorder Scale', 'PCL-5'],
      course: 'By definition ≤1 month; roughly half of cases progress to PTSD.',
      comorbid: ['Depression', 'Substance use']
    },
    {
      id: 'adjustment', name: 'Adjustment Disorder', cat: 'trauma',
      desc: 'Emotional or behavioral symptoms out of proportion to an identifiable life stressor, appearing within three months and resolving within six months once the stressor or its consequences end — a diagnosis of clinically significant but bounded distress.',
      codes: { dsm: 'F43.2x', icd10: 'F43.20–F43.25', icd11: '6B43' },
      meds: { first: ['No specific pharmacotherapy; supportive care'], adjunct: ['Short-term symptom-targeted medication (sleep, anxiety) if needed'], note: 'If full criteria for MDD/anxiety disorder are met, diagnose that instead.' },
      therapy: ['Supportive psychotherapy', 'Problem-solving therapy', 'Brief CBT'],
      epi: { incidence: 'Common in medical/consult settings', prevalence: '~5–20% of outpatient mental health caseloads', mortality: 'Elevated suicide risk relative to non-clinical population', onset: 'Within 3 months of a stressor; any age' },
      ddx: ['MDD', 'GAD', 'PTSD/acute stress disorder', 'Normal stress response', 'Bereavement'],
      redFlags: ['Suicidal ideation (adjustment disorder is common in impulsive self-harm)'],
      scales: ['C-SSRS', 'Symptom checklists'],
      course: 'Time-limited by definition; symptoms remit as adaptation occurs or the stressor resolves.',
      comorbid: ['Medical illness', 'Substance use']
    }
  );

  // ── Schizophrenia Spectrum & Psychotic ──────────────────────────────────────
  DX.push(
    {
      id: 'schizophrenia', name: 'Schizophrenia', cat: 'psychotic',
      desc: 'A chronic disorder in which positive symptoms (delusions, hallucinations, disorganized speech/behavior) coexist with negative symptoms (blunted affect, avolition, social withdrawal) and cognitive impairment, producing a lasting decline in functioning of six months or more.',
      codes: { dsm: 'F20.9', icd10: 'F20.9', icd11: '6A20' },
      meds: {
        first: ['Second-generation antipsychotics (risperidone, olanzapine, aripiprazole, paliperidone, quetiapine, lurasidone, cariprazine)', 'Xanomeline-trospium (Cobenfy) — muscarinic agonist, 2024', 'Milsaperidone (Bysanti, 2026)', 'Long-acting injectables for adherence'],
        adjunct: ['Clozapine for treatment-resistant schizophrenia (gold standard after 2 failed trials)', 'Adjunctive treatment of depression/anxiety as needed'],
        note: 'Clozapine is uniquely effective for refractory illness and reduces suicidality, but requires ANC monitoring.'
      },
      therapy: ['CBT for psychosis (CBTp)', 'Family psychoeducation', 'Supported employment', 'Assertive community treatment', 'Cognitive remediation', 'Social skills training'],
      epi: { incidence: '~15 per 100,000 per year', prevalence: '~0.3–0.7% lifetime', mortality: 'Life expectancy reduced ~15–20 years; suicide ~5–10% lifetime; high cardiometabolic mortality', onset: 'Late teens to mid-30s; earlier and often more severe in males' },
      ddx: ['Schizoaffective disorder', 'Bipolar/MDD with psychotic features', 'Schizophreniform disorder', 'Substance-induced psychosis', 'Delusional disorder', 'Autism', 'Delirium/medical psychosis'],
      redFlags: ['Command hallucinations', 'Suicidality', 'Catatonia', 'First-episode psychosis (urgent workup)', 'Violence risk', 'Clozapine-related neutropenia/myocarditis'],
      scales: ['PANSS', 'BPRS', 'AIMS (tardive dyskinesia)', 'C-SSRS'],
      course: 'Chronic with heterogeneous outcome; early intervention and treatment adherence strongly shape prognosis. Relapse follows discontinuation in most.',
      comorbid: ['Substance use (esp. tobacco, cannabis)', 'Metabolic syndrome', 'Depression', 'OCD']
    },
    {
      id: 'schizoaffective', name: 'Schizoaffective Disorder', cat: 'psychotic',
      desc: 'An uninterrupted illness combining the psychosis of schizophrenia with prominent mood episodes, in which delusions or hallucinations persist for at least two weeks in the absence of a mood episode — distinguishing it from a mood disorder with psychotic features.',
      codes: { dsm: 'F25.x', icd10: 'F25.0 (bipolar) / F25.1 (depressive) / F25.9', icd11: '6A21' },
      meds: { first: ['Antipsychotics (paliperidone is FDA-approved specifically for schizoaffective disorder)', 'Mood stabilizers for bipolar type', 'Antidepressants for depressive type'], adjunct: ['Clozapine for refractory cases', 'ECT for severe mood/psychotic exacerbations'], note: 'Treatment targets both the psychotic and mood dimensions concurrently.' },
      therapy: ['CBTp', 'Family psychoeducation', 'Psychosocial rehabilitation'],
      epi: { incidence: 'Uncommon', prevalence: '~0.3% lifetime', mortality: 'High suicide risk; intermediate between schizophrenia and mood disorders', onset: 'Early adulthood' },
      ddx: ['Schizophrenia', 'Bipolar/MDD with psychotic features', 'Substance-induced psychosis'],
      redFlags: ['Suicidality', 'Command hallucinations', 'Severe mood episodes with psychosis'],
      scales: ['PANSS', 'YMRS', 'PHQ-9', 'C-SSRS'],
      course: 'Chronic; prognosis generally better than schizophrenia but worse than pure mood disorders.',
      comorbid: ['Substance use', 'Anxiety', 'Metabolic syndrome']
    },
    {
      id: 'schizophreniform', name: 'Schizophreniform Disorder', cat: 'psychotic',
      desc: 'The symptom picture of schizophrenia lasting between one and six months — a provisional diagnosis while it remains unclear whether the illness will resolve or persist into full schizophrenia.',
      codes: { dsm: 'F20.81', icd10: 'F20.81', icd11: '6A23 (acute and transient psychotic disorder, related)' },
      meds: { first: ['Antipsychotics as in first-episode schizophrenia'], adjunct: ['Reassess duration and diagnosis at 6 months'], note: 'About two-thirds progress to schizophrenia or schizoaffective disorder.' },
      therapy: ['Psychoeducation', 'CBTp', 'Early-intervention services'],
      epi: { incidence: 'Uncommon', prevalence: '~0.07% (lower in higher-income countries)', mortality: 'Suicide risk as in early psychosis', onset: 'Late teens to early adulthood' },
      ddx: ['Schizophrenia', 'Brief psychotic disorder', 'Mood disorder with psychosis', 'Substance-induced psychosis'],
      redFlags: ['Suicidality', 'First-episode workup for medical/substance causes'],
      scales: ['PANSS', 'C-SSRS'],
      course: 'Provisional; roughly one-third recover, two-thirds progress to schizophrenia spectrum illness.',
      comorbid: ['Substance use', 'Depression']
    },
    {
      id: 'brief-psychotic', name: 'Brief Psychotic Disorder', cat: 'psychotic',
      desc: 'A sudden eruption of psychotic symptoms lasting at least a day but under a month, often triggered by marked stress (including the postpartum period), followed by a full return to premorbid functioning.',
      codes: { dsm: 'F23', icd10: 'F23', icd11: '6A23' },
      meds: { first: ['Short-term antipsychotic'], adjunct: ['Benzodiazepine for acute agitation'], note: 'Ensure medical and substance causes are excluded; monitor for recurrence.' },
      therapy: ['Supportive therapy', 'Psychoeducation', 'Stress management'],
      epi: { incidence: 'Rare', prevalence: 'Uncommon; higher in postpartum context', mortality: 'Risk during acute episode (impulsivity, postpartum harm)', onset: 'Average onset in the 30s–40s; postpartum variant peripartum' },
      ddx: ['Schizophreniform disorder', 'Substance-induced psychosis', 'Mood disorder with psychosis', 'Delirium', 'Postpartum psychosis'],
      redFlags: ['Postpartum psychosis (psychiatric emergency — infanticide/suicide risk)', 'Command hallucinations', 'Severe agitation'],
      scales: ['PANSS', 'C-SSRS'],
      course: 'Full recovery by definition within a month; recurrence and later diagnostic revision are possible.',
      comorbid: ['Personality disorders', 'Mood disorders']
    },
    {
      id: 'delusional', name: 'Delusional Disorder', cat: 'psychotic',
      desc: 'One or more fixed false beliefs held for a month or longer — persecutory, jealous, erotomanic, grandiose, or somatic — in a person whose functioning and behavior are otherwise largely intact and who lacks the broader disorganization of schizophrenia.',
      codes: { dsm: 'F22', icd10: 'F22', icd11: '6A24' },
      meds: { first: ['Antipsychotics (often modest response)'], adjunct: ['SSRIs if depressive features'], note: 'Poor insight makes engagement and adherence the central challenge.' },
      therapy: ['Cultivating therapeutic alliance', 'CBT (limited by insight)', 'Supportive therapy'],
      epi: { incidence: 'Rare', prevalence: '~0.02–0.03%', mortality: 'Variable; risk tied to acting on delusions', onset: 'Middle to late adulthood (later than schizophrenia)' },
      ddx: ['Schizophrenia', 'Paranoid personality disorder', 'Mood disorder with psychosis', 'Substance/medical causes', 'Dementia'],
      redFlags: ['Delusions directed at a specific person (violence risk)', 'Erotomanic/persecutory targeting'],
      scales: ['PANSS', 'Clinical interview'],
      course: 'Often chronic and stable; functioning outside the delusional domain may be well preserved.',
      comorbid: ['Depression', 'Social isolation']
    }
  );

  // ── Neurodevelopmental Disorders ────────────────────────────────────────────
  DX.push(
    {
      id: 'adhd', name: 'Attention-Deficit/Hyperactivity Disorder', cat: 'neurodev',
      desc: 'A developmental pattern of inattention and/or hyperactivity-impulsivity that begins in childhood, appears across multiple settings, and exceeds what is expected for age — manifesting in adults more as disorganization, restlessness, and difficulty sustaining focus than overt overactivity.',
      codes: { dsm: 'F90.x', icd10: 'F90.0 / F90.1 / F90.2 / F90.9', icd11: '6A05' },
      meds: { first: ['Stimulants (methylphenidate and amphetamine formulations) — most effective'], adjunct: ['Atomoxetine', 'Alpha-2 agonists (guanfacine ER, clonidine ER)', 'Viloxazine ER', 'Bupropion (off-label)'], note: 'Screen for cardiac risk and substance misuse before stimulants; non-stimulants preferred where diversion/abuse is a concern.' },
      therapy: ['Behavioral parent training (children)', 'CBT for adult ADHD', 'Organizational skills coaching', 'Classroom/workplace accommodations'],
      epi: { incidence: 'N/A', prevalence: '~5–9% children, ~2.5–4% adults', mortality: 'Elevated accident and injury mortality; increased suicide risk', onset: 'Symptoms before age 12 (required for diagnosis)' },
      ddx: ['Anxiety disorders', 'Mood disorders', 'Learning disorders', 'Autism spectrum', 'Substance use', 'Sleep disorders', 'Thyroid dysfunction'],
      redFlags: ['Stimulant diversion/misuse', 'Comorbid substance use', 'Cardiac symptoms on stimulants'],
      scales: ['ASRS (adult)', 'Vanderbilt/Conners (children)'],
      course: 'Symptoms persist into adulthood in roughly half; hyperactivity attenuates while inattention and executive difficulties often remain.',
      comorbid: ['ODD/conduct disorder', 'Anxiety', 'Depression', 'Learning disorders', 'Substance use']
    },
    {
      id: 'asd', name: 'Autism Spectrum Disorder', cat: 'neurodev',
      desc: 'A developmental condition marked by persistent differences in social communication and reciprocity alongside restricted, repetitive behaviors, interests, or sensory patterns, present from early childhood and spanning a wide range of language and cognitive ability.',
      codes: { dsm: 'F84.0', icd10: 'F84.0', icd11: '6A02' },
      meds: { first: ['No medication treats core social-communication features'], adjunct: ['Risperidone and aripiprazole — FDA-approved for irritability/aggression in autism', 'SSRIs for comorbid anxiety/OCD (variable)', 'Stimulants/alpha-2 agonists for comorbid ADHD'], note: 'Pharmacotherapy targets comorbid symptoms (irritability, ADHD, anxiety), not autism itself.' },
      therapy: ['Applied behavior analysis (ABA) and naturalistic developmental behavioral interventions', 'Speech and language therapy', 'Occupational therapy', 'Social skills training', 'Parent-mediated interventions'],
      epi: { incidence: 'N/A', prevalence: '~1 in 31 US children (recent CDC estimates)', mortality: 'Elevated — accidents, drowning, epilepsy, and suicide in higher-functioning individuals', onset: 'Early childhood (signs typically before age 2–3)' },
      ddx: ['Intellectual disability', 'Language disorder', 'ADHD', 'Social anxiety', 'Reactive attachment disorder', 'Hearing impairment', 'Rett/genetic syndromes'],
      redFlags: ['Self-injurious behavior', 'Severe aggression', 'Elopement/wandering safety risk', 'Regression (workup indicated)'],
      scales: ['AQ (screening)', 'ADOS-2 / ADI-R (diagnostic)', 'M-CHAT (toddlers)'],
      course: 'Lifelong; early intensive intervention improves adaptive outcomes. Severity and support needs vary enormously.',
      comorbid: ['Intellectual disability', 'ADHD', 'Anxiety', 'Epilepsy', 'GI disorders']
    },
    {
      id: 'tourette', name: 'Tourette’s Disorder', cat: 'neurodev',
      desc: 'Multiple motor tics plus at least one vocal tic persisting more than a year with childhood onset — brief, repetitive, semi-voluntary movements or sounds that wax and wane and are often preceded by an uncomfortable premonitory urge.',
      codes: { dsm: 'F95.2', icd10: 'F95.2', icd11: '8A05.00' },
      meds: { first: ['Alpha-2 agonists (guanfacine, clonidine) for mild-moderate tics'], adjunct: ['Antipsychotics (aripiprazole is FDA-approved; haloperidol, pimozide, risperidone)', 'VMAT2 inhibitors (off-label)', 'Botulinum toxin for focal tics'], note: 'Treat only if tics are impairing; manage comorbid ADHD and OCD, which often cause more disability than tics.' },
      therapy: ['Comprehensive Behavioral Intervention for Tics (CBIT) — first-line', 'Habit reversal training', 'Psychoeducation'],
      epi: { incidence: 'N/A', prevalence: '~0.3–0.9% of children', mortality: 'Low direct', onset: 'Childhood (typically 4–8 years), peak severity around 10–12' },
      ddx: ['Provisional/persistent tic disorder', 'Stereotypies', 'OCD', 'Myoclonus', 'Medication-induced movements', 'Functional movement disorder'],
      redFlags: ['Self-injurious tics', 'Severe comorbid OCD/ADHD', 'Rage attacks'],
      scales: ['Yale Global Tic Severity Scale (YGTSS)'],
      course: 'Tics usually peak in late childhood and improve by early adulthood in the majority.',
      comorbid: ['ADHD', 'OCD', 'Anxiety', 'Learning disorders']
    }
  );

  // ── Feeding & Eating Disorders ──────────────────────────────────────────────
  DX.push(
    {
      id: 'anorexia', name: 'Anorexia Nervosa', cat: 'eating',
      desc: 'Restriction of intake driving significantly low body weight, coupled with an intense fear of weight gain and a distorted experience of one’s body, in which the seriousness of the low weight goes unrecognized — subtyped as restricting or binge-eating/purging.',
      codes: { dsm: 'F50.0x', icd10: 'F50.01 (restricting) / F50.02 (binge-purge)', icd11: '6B80' },
      meds: { first: ['No medication is first-line; nutritional rehabilitation is the priority'], adjunct: ['Olanzapine may modestly aid weight gain', 'SSRIs for comorbid depression/anxiety after weight restoration'], note: 'SSRIs are ineffective at very low weight; refeeding is the essential intervention.' },
      therapy: ['Family-based treatment (FBT) for adolescents — first-line', 'CBT-E (enhanced)', 'Specialist supportive clinical management', 'Nutritional rehabilitation'],
      epi: { incidence: 'N/A', prevalence: '~0.6% lifetime; up to ~4% in women', mortality: 'Highest mortality of any psychiatric disorder (~5–6x expected); cardiac and suicide deaths', onset: 'Adolescence (peak 15–19)' },
      ddx: ['Bulimia nervosa', 'ARFID', 'Depression with appetite loss', 'Hyperthyroidism/malabsorption', 'Body dysmorphic disorder', 'OCD'],
      redFlags: ['Bradycardia/hypotension/arrhythmia', 'Electrolyte derangement', 'BMI extremely low or rapid weight loss', 'Refeeding syndrome risk', 'Suicidality'],
      scales: ['EDE-Q', 'SCOFF (screening)', 'C-SSRS'],
      course: 'Variable — roughly half recover, a third improve partially, and a subset become chronic; medical instability can be life-threatening.',
      comorbid: ['MDD', 'Anxiety/OCD', 'Substance use (binge-purge type)']
    },
    {
      id: 'bulimia', name: 'Bulimia Nervosa', cat: 'eating',
      desc: 'Recurrent binge episodes marked by a sense of lost control, followed by compensatory purging, fasting, or over-exercise, at least weekly for three months, in a person whose self-worth is unduly tied to shape and weight — usually at normal or above-normal weight.',
      codes: { dsm: 'F50.2', icd10: 'F50.2', icd11: '6B81' },
      meds: { first: ['Fluoxetine (60 mg) — FDA-approved for bulimia'], adjunct: ['Other SSRIs', 'Topiramate (off-label)', 'Avoid bupropion (seizure risk in purging patients)'], note: 'Bupropion is contraindicated in eating disorders with purging.' },
      therapy: ['CBT-E (first-line)', 'Interpersonal therapy', 'DBT for emotion regulation', 'Guided self-help'],
      epi: { incidence: 'N/A', prevalence: '~0.3–1% lifetime', mortality: 'Elevated (~2x); electrolyte disturbance and suicide', onset: 'Late adolescence to early adulthood' },
      ddx: ['Anorexia binge-purge type', 'Binge-eating disorder', 'MDD', 'Borderline personality disorder', 'GI causes of vomiting'],
      redFlags: ['Hypokalemia/arrhythmia', 'Esophageal tears/dental erosion', 'Ipecac/laxative abuse', 'Suicidality'],
      scales: ['EDE-Q', 'SCOFF', 'C-SSRS'],
      course: 'Fluctuating and often chronic; a majority improve with CBT-E though relapse is common.',
      comorbid: ['MDD', 'Anxiety', 'Substance use', 'Borderline PD']
    },
    {
      id: 'bed', name: 'Binge-Eating Disorder', cat: 'eating',
      desc: 'Recurrent episodes of eating unusually large amounts rapidly and to uncomfortable fullness, with distress and loss of control but no regular compensatory behavior — the most common eating disorder and a driver of obesity.',
      codes: { dsm: 'F50.81', icd10: 'F50.81', icd11: '6B82' },
      meds: { first: ['Lisdexamfetamine (Vyvanse) — FDA-approved for moderate-severe BED'], adjunct: ['SSRIs for comorbid mood/anxiety', 'Topiramate (off-label)'], note: 'Lisdexamfetamine reduces binge frequency; screen for cardiovascular risk and misuse.' },
      therapy: ['CBT-E (first-line)', 'Interpersonal therapy', 'DBT', 'Behavioral weight management as adjunct'],
      epi: { incidence: 'N/A', prevalence: '~1.2% 12-month, ~2–3% lifetime (most common eating disorder)', mortality: 'Related to obesity comorbidities', onset: 'Late adolescence to early adulthood; broader age range than other eating disorders' },
      ddx: ['Bulimia nervosa', 'Obesity without binge-eating', 'MDD with overeating', 'Prader-Willi/organic hyperphagia'],
      redFlags: ['Suicidality', 'Severe obesity complications'],
      scales: ['EDE-Q', 'Binge Eating Scale'],
      course: 'Chronic and relapsing but generally responsive to CBT; frequently under-recognized.',
      comorbid: ['Obesity/metabolic syndrome', 'MDD', 'Anxiety', 'ADHD']
    }
  );

  // ── Substance-Related & Addictive ───────────────────────────────────────────
  DX.push(
    {
      id: 'aud', name: 'Alcohol Use Disorder', cat: 'substance',
      desc: 'A problematic pattern of drinking producing clinically significant impairment — loss of control, cravings, tolerance, withdrawal, and continued use despite harm — graded mild to severe by the number of criteria met.',
      codes: { dsm: 'F10.1x/F10.2x', icd10: 'F10.10 (mild) / F10.20 (mod-severe)', icd11: '6C40.2' },
      meds: { first: ['Naltrexone (oral or monthly IM)', 'Acamprosate'], adjunct: ['Disulfiram (motivated, supervised patients)', 'Topiramate or gabapentin (off-label)', 'Benzodiazepines for acute withdrawal only', 'Thiamine to prevent Wernicke'], note: 'Give thiamine before glucose in at-risk patients to avoid precipitating Wernicke encephalopathy.' },
      therapy: ['Motivational interviewing', 'CBT for relapse prevention', '12-step facilitation / mutual-help groups', 'Contingency management'],
      epi: { incidence: 'N/A', prevalence: '~10% 12-month, ~29% lifetime (US adults)', mortality: 'A leading preventable cause of death; liver disease, accidents, suicide, withdrawal (DTs ~5% mortality untreated)', onset: 'Adolescence to mid-20s typically' },
      ddx: ['Other substance use disorders', 'Mood/anxiety disorders (primary vs. induced)', 'Bipolar disorder'],
      redFlags: ['Delirium tremens (medical emergency)', 'Wernicke-Korsakoff signs', 'Withdrawal seizures', 'Suicidality', 'Hepatic decompensation'],
      scales: ['AUDIT / AUDIT-C', 'CIWA-Ar (withdrawal)', 'C-SSRS'],
      course: 'Chronic-relapsing; many achieve sustained remission, often after multiple attempts. Medication plus psychosocial support improves outcomes.',
      comorbid: ['Depression/anxiety', 'PTSD', 'Other substance use', 'Liver disease']
    },
    {
      id: 'oud', name: 'Opioid Use Disorder', cat: 'substance',
      desc: 'Compulsive opioid use with tolerance, withdrawal, and continued use despite escalating harm; a relapsing condition in which pharmacotherapy dramatically reduces overdose death and is the standard of care.',
      codes: { dsm: 'F11.1x/F11.2x', icd10: 'F11.20 (mod-severe)', icd11: '6C43.2' },
      meds: { first: ['Buprenorphine (± naloxone)', 'Methadone (opioid treatment programs)'], adjunct: ['Extended-release naltrexone (after detox)', 'Naloxone for overdose reversal (prescribe to all)', 'Clonidine/lofexidine for withdrawal symptoms'], note: 'Medications for OUD (MOUD) are lifesaving; avoid detox-only approaches, which raise overdose risk.' },
      therapy: ['Contingency management', 'CBT', 'Motivational interviewing', 'Peer recovery support'],
      epi: { incidence: 'Rising with synthetic opioids', prevalence: '~2% of US adults (varies by region)', mortality: 'Very high — driven by fentanyl overdose; leading cause of accidental death in many age groups', onset: 'Adolescence to adulthood; often begins with prescription opioids' },
      ddx: ['Chronic pain with physiologic dependence (not automatically OUD)', 'Other substance use disorders'],
      redFlags: ['Overdose / respiratory depression', 'IV-use infections (endocarditis, HIV, HCV)', 'Polysubstance use with benzodiazepines', 'Pregnancy (do not stop MOUD abruptly)'],
      scales: ['COWS (withdrawal)', 'DSM-5-TR SUD criteria', 'C-SSRS'],
      course: 'Chronic-relapsing; retention on MOUD is the strongest predictor of survival and recovery.',
      comorbid: ['Depression/anxiety', 'PTSD', 'Other substance use', 'Infectious disease']
    },
    {
      id: 'stimulant-ud', name: 'Stimulant Use Disorder', cat: 'substance',
      desc: 'Compulsive use of cocaine or amphetamine-type stimulants producing euphoria, hyperarousal, and, with heavy use, paranoia and psychosis, followed by a depleted "crash" — with no FDA-approved pharmacotherapy, unlike alcohol or opioid disorders.',
      codes: { dsm: 'F14.x (cocaine) / F15.x (other)', icd10: 'F14.20 / F15.20', icd11: '6C45 / 6C46' },
      meds: { first: ['No FDA-approved medication'], adjunct: ['Treat comorbid conditions', 'Investigational: topiramate, bupropion+naltrexone, mirtazapine (methamphetamine)'], note: 'Contingency management is the most effective intervention to date.' },
      therapy: ['Contingency management (strongest evidence)', 'CBT', 'Community reinforcement approach', 'Motivational interviewing'],
      epi: { incidence: 'Rising (methamphetamine, cocaine)', prevalence: '~0.5–2% depending on drug and region', mortality: 'Cardiovascular events, stroke, overdose (often with fentanyl adulteration), suicide', onset: 'Adolescence to adulthood' },
      ddx: ['Primary psychotic disorder', 'Bipolar mania', 'ADHD', 'Other substance use'],
      redFlags: ['Chest pain/arrhythmia/hypertensive emergency', 'Stimulant-induced psychosis', 'Hyperthermia', 'Suicidality during crash'],
      scales: ['DSM-5-TR SUD criteria', 'C-SSRS'],
      course: 'Chronic-relapsing; behavioral treatments and structured contingencies drive most gains.',
      comorbid: ['Depression', 'Anxiety', 'Other substance use', 'Psychosis']
    },
    {
      id: 'tobacco-ud', name: 'Tobacco Use Disorder', cat: 'substance',
      desc: 'Nicotine dependence sustaining continued tobacco use despite health harm, marked by craving, tolerance, and a characteristic withdrawal of irritability, restlessness, and difficulty concentrating — the leading preventable cause of death.',
      codes: { dsm: 'F17.20x', icd10: 'F17.200 (nicotine dependence)', icd11: '6C4A.2' },
      meds: { first: ['Varenicline', 'Nicotine replacement therapy (combination patch + short-acting)'], adjunct: ['Bupropion SR', 'Combination varenicline + NRT for heavy use'], note: 'Varenicline is the single most effective monotherapy; start before quit date.' },
      therapy: ['Brief behavioral counseling (5 A’s)', 'Quitlines', 'CBT', 'Motivational interviewing'],
      epi: { incidence: 'N/A', prevalence: '~11–12% US adults currently smoke (declining)', mortality: 'Leading preventable cause of death (~480,000/yr US); cancer, COPD, cardiovascular disease', onset: 'Adolescence' },
      ddx: ['Other substance use disorders (frequently comorbid)'],
      redFlags: ['Cardiovascular/pulmonary disease', 'Neuropsychiatric symptoms monitoring on cessation aids (label caution now relaxed)'],
      scales: ['Fagerström Test for Nicotine Dependence'],
      course: 'Chronic-relapsing; each quit attempt raises the odds of eventual success, especially with medication plus counseling.',
      comorbid: ['Other substance use', 'Depression', 'Schizophrenia (very high rates)']
    }
  );

  // ── Neurocognitive Disorders ────────────────────────────────────────────────
  DX.push(
    {
      id: 'delirium', name: 'Delirium', cat: 'neurocognitive',
      desc: 'An acute, fluctuating disturbance of attention and awareness caused by an underlying medical condition, substance, or withdrawal — developing over hours to days and often missed in its hypoactive form. A medical emergency, not a primary psychiatric illness.',
      codes: { dsm: 'F05', icd10: 'F05', icd11: '6D70' },
      meds: { first: ['Treat the underlying cause; nonpharmacologic measures first'], adjunct: ['Low-dose antipsychotic (haloperidol, quetiapine) for dangerous agitation only', 'Dexmedetomidine in ICU settings', 'Benzodiazepines only for alcohol/sedative withdrawal delirium'], note: 'Antipsychotics do not shorten delirium; reserve for safety. Avoid benzodiazepines except in withdrawal delirium.' },
      therapy: ['Reorientation, sensory aids, sleep-wake normalization, early mobilization', 'Family presence', 'Minimize deliriogenic medications'],
      epi: { incidence: 'Very common in hospitalized elderly', prevalence: '~20–30% of older inpatients; up to ~80% in ICU', mortality: 'Independently associated with increased mortality and long-term cognitive decline', onset: 'Acute, at any age but especially older adults' },
      ddx: ['Dementia', 'Depression (hypoactive delirium)', 'Primary psychosis', 'Nonconvulsive status epilepticus', 'Wernicke encephalopathy'],
      redFlags: ['Any new confusion in older adult = workup', 'Hypoxia, sepsis, intracranial event', 'Withdrawal states', 'Anticholinergic toxicity'],
      scales: ['CAM / CAM-ICU', 'Delirium Rating Scale'],
      course: 'Usually reversible if the cause is treated, but signals vulnerability and predicts worse long-term cognitive and functional outcomes.',
      comorbid: ['Dementia', 'Multimorbidity', 'Polypharmacy']
    },
    {
      id: 'alzheimers', name: 'Major Neurocognitive Disorder due to Alzheimer’s Disease', cat: 'neurocognitive',
      desc: 'A gradual, progressive decline led by memory and learning impairment, later spreading to language, visuospatial ability, and executive function, eroding independence — the most common cause of dementia, underpinned by amyloid and tau pathology.',
      codes: { dsm: 'G30.9 + F02.8x', icd10: 'G30.9 (with F02.80/F02.81)', icd11: '6D80' },
      meds: { first: ['Cholinesterase inhibitors (donepezil, rivastigmine, galantamine)', 'Memantine (moderate-severe)'], adjunct: ['Anti-amyloid monoclonal antibodies (lecanemab, donanemab) for early disease — require MRI monitoring for ARIA', 'Brexpiprazole or dextromethorphan-bupropion (Auvelity) for Alzheimer’s agitation', 'Avoid antipsychotics where possible (boxed warning: mortality in dementia)'], note: 'Symptomatic drugs slow decline modestly; anti-amyloid antibodies target underlying pathology in early stages.' },
      therapy: ['Cognitive stimulation', 'Structured routines and environmental cues', 'Caregiver education and support', 'Behavioral management of agitation'],
      epi: { incidence: 'Rises sharply with age', prevalence: '~10% of those 65+, ~⅓ of those 85+', mortality: 'A leading cause of death in older adults; median survival ~4–8 years from diagnosis', onset: 'Usually after 65 (late-onset); rarer early-onset familial forms' },
      ddx: ['Vascular / Lewy body / frontotemporal dementia', 'Depression (pseudodementia)', 'Delirium', 'Reversible causes (B12, thyroid, NPH)', 'Medication effects'],
      redFlags: ['Rapid decline (reconsider diagnosis)', 'Wandering/safety risk', 'Suicidality in early insight-preserved stages', 'Caregiver burnout', 'ARIA on anti-amyloid therapy'],
      scales: ['MMSE', 'MoCA', 'SLUMS', 'CDR (staging)'],
      course: 'Steadily progressive over years; treatment slows but does not halt decline.',
      comorbid: ['Depression', 'Agitation/psychosis', 'Vascular disease']
    },
    {
      id: 'lewy-body', name: 'Neurocognitive Disorder with Lewy Bodies', cat: 'neurocognitive',
      desc: 'A dementia distinguished by fluctuating cognition and alertness, recurrent well-formed visual hallucinations, spontaneous parkinsonism, and REM sleep behavior disorder, with a dangerous sensitivity to antipsychotics.',
      codes: { dsm: 'G31.83 + F02.8x', icd10: 'G31.83', icd11: '6D82' },
      meds: { first: ['Cholinesterase inhibitors (rivastigmine, donepezil) — often notably effective'], adjunct: ['Memantine', 'Cautious low-dose quetiapine or pimavanserin for psychosis', 'Carbidopa-levodopa for motor symptoms (may worsen hallucinations)'], note: 'Avoid typical and most atypical antipsychotics — severe neuroleptic sensitivity can be life-threatening.' },
      therapy: ['Caregiver education on fluctuations and falls', 'Environmental safety', 'Sleep management'],
      epi: { incidence: 'N/A', prevalence: 'Second or third most common degenerative dementia (~4–5% of dementia)', mortality: 'Progressive; survival similar to or shorter than Alzheimer’s', onset: 'Typically after 50–60' },
      ddx: ['Alzheimer’s disease', 'Parkinson’s disease dementia', 'Delirium', 'Vascular dementia', 'Progressive supranuclear palsy'],
      redFlags: ['Neuroleptic sensitivity reaction', 'Falls/syncope from autonomic dysfunction', 'REM behavior disorder injury risk'],
      scales: ['MoCA', 'CDR'],
      course: 'Progressive with prominent fluctuations; motor and cognitive decline over years.',
      comorbid: ['Parkinsonism', 'Autonomic dysfunction', 'Depression']
    },
    {
      id: 'ftd', name: 'Frontotemporal Neurocognitive Disorder', cat: 'neurocognitive',
      desc: 'An early-onset dementia striking the frontal and temporal lobes, presenting either as a behavioral variant with disinhibition, apathy, and loss of empathy, or as progressive aphasia — often mistaken for a primary psychiatric disorder at first.',
      codes: { dsm: 'G31.09 + F02.8x', icd10: 'G31.09', icd11: '6D83' },
      meds: { first: ['No disease-specific or approved cognitive therapy'], adjunct: ['SSRIs for behavioral symptoms (disinhibition, compulsions)', 'Trazodone', 'Avoid cholinesterase inhibitors (may worsen behavior) and antipsychotics where possible'], note: 'Cholinesterase inhibitors are generally unhelpful and can worsen behavioral symptoms.' },
      therapy: ['Behavioral management', 'Caregiver support and safety planning', 'Speech therapy for aphasic variants'],
      epi: { incidence: 'N/A', prevalence: 'A leading cause of dementia before age 65', mortality: 'Progressive; median survival ~6–11 years from onset', onset: 'Usually 45–65 (younger than Alzheimer’s)' },
      ddx: ['Alzheimer’s disease', 'Primary psychiatric illness (bipolar, depression)', 'Primary progressive aphasia', 'ALS-FTD spectrum'],
      redFlags: ['Rapid personality change in midlife', 'Socially inappropriate/impulsive behavior', 'Motor neuron signs (ALS overlap)'],
      scales: ['Frontal Assessment Battery', 'MoCA'],
      course: 'Progressive over years; behavioral variant often carries high caregiver burden.',
      comorbid: ['ALS (subset)', 'Parkinsonism', 'Depression']
    }
  );

  // ── Sleep-Wake Disorders ────────────────────────────────────────────────────
  DX.push(
    {
      id: 'insomnia', name: 'Insomnia Disorder', cat: 'sleep',
      desc: 'Persistent dissatisfaction with sleep — trouble falling asleep, staying asleep, or early waking — occurring despite adequate opportunity, at least three nights a week for three months, with daytime consequences.',
      codes: { dsm: 'F51.01', icd10: 'F51.01 (chronic insomnia G47.00)', icd11: '7A00' },
      meds: { first: ['CBT-I is first-line, not medication'], adjunct: ['Dual orexin receptor antagonists (suvorexant, lemborexant, daridorexant)', 'Low-dose doxepin', 'Z-drugs (zolpidem, eszopiclone) short-term', 'Melatonin/ramelteon for circadian onset', 'Avoid chronic benzodiazepines'], note: 'Orexin antagonists and low-dose doxepin are favored over benzodiazepine-receptor agonists for chronic use.' },
      therapy: ['Cognitive behavioral therapy for insomnia (CBT-I)', 'Sleep hygiene', 'Stimulus control', 'Sleep restriction'],
      epi: { incidence: 'N/A', prevalence: '~10% chronic insomnia disorder; up to ~30% report symptoms', mortality: 'Low direct; linked to accidents and cardiometabolic risk', onset: 'Any age; rises with age and in women' },
      ddx: ['Sleep apnea', 'Restless legs syndrome', 'Circadian rhythm disorders', 'Depression/anxiety', 'Substance/medication effects'],
      redFlags: ['Excessive daytime sleepiness (screen for apnea)', 'Suicidality (insomnia is a risk factor)', 'Hypnotic dependence'],
      scales: ['Insomnia Severity Index', 'Epworth Sleepiness Scale (for hypersomnia screen)'],
      course: 'Often chronic and self-perpetuating without CBT-I; strongly tied to and predictive of mood disorders.',
      comorbid: ['Depression', 'Anxiety', 'Chronic pain', 'Substance use']
    },
    {
      id: 'narcolepsy', name: 'Narcolepsy', cat: 'sleep',
      desc: 'Chronic, irresistible daytime sleep attacks with intrusion of REM phenomena — cataplexy (sudden emotion-triggered muscle weakness in type 1), sleep paralysis, and hypnagogic hallucinations — reflecting loss of hypothalamic orexin signaling.',
      codes: { dsm: 'G47.4xx', icd10: 'G47.411 (with cataplexy) / G47.419', icd11: '7A20' },
      meds: { first: ['Wake-promoting agents (modafinil, armodafinil)', 'Solriamfetol', 'Stimulants'], adjunct: ['Sodium oxybate / oxybate salts for cataplexy and disrupted night sleep', 'Pitolisant', 'SNRIs/venlafaxine for cataplexy (off-label)'], note: 'Type 1 (with cataplexy) reflects orexin deficiency; oxybate addresses both sleepiness and cataplexy.' },
      therapy: ['Scheduled naps', 'Sleep hygiene', 'Safety counseling (driving)', 'Psychoeducation'],
      epi: { incidence: 'N/A', prevalence: '~0.02–0.05% (type 1)', mortality: 'Accident risk from sleep attacks', onset: 'Adolescence to young adulthood (bimodal peaks ~15 and ~35)' },
      ddx: ['Obstructive sleep apnea', 'Idiopathic hypersomnia', 'Insufficient sleep', 'Depression', 'Seizures (cataplexy mimic)'],
      redFlags: ['Cataplexy causing falls/injury', 'Driving/occupational safety', 'Status cataplecticus on abrupt antidepressant withdrawal'],
      scales: ['Epworth Sleepiness Scale', 'Multiple Sleep Latency Test (diagnostic)'],
      course: 'Lifelong; manageable with medication and behavioral strategies.',
      comorbid: ['Depression', 'Obesity', 'Obstructive sleep apnea']
    }
  );

  // ── Personality Disorders ───────────────────────────────────────────────────
  DX.push(
    {
      id: 'bpd', name: 'Borderline Personality Disorder', cat: 'personality',
      desc: 'A pervasive pattern of instability in emotions, relationships, self-image, and impulse control — frantic efforts to avoid abandonment, intense unstable relationships, chronic emptiness, and recurrent self-harm or suicidality — emerging by early adulthood.',
      codes: { dsm: 'F60.3', icd10: 'F60.3', icd11: '6D10 + 6D11.5 (borderline pattern)' },
      meds: { first: ['No FDA-approved medication; psychotherapy is primary'], adjunct: ['Targeted, time-limited use: mood stabilizers for impulsivity, low-dose atypical antipsychotics for transient psychosis/anger, SSRIs for comorbid depression/anxiety'], note: 'Avoid polypharmacy and benzodiazepines (disinhibition, overdose risk); medications treat symptoms, not the disorder.' },
      therapy: ['Dialectical behavior therapy (DBT) — strongest evidence', 'Mentalization-based treatment', 'Transference-focused psychotherapy', 'Good psychiatric management', 'Schema therapy'],
      epi: { incidence: 'N/A', prevalence: '~1.4–2.7% general population; up to ~20% of psychiatric inpatients', mortality: 'Suicide rate ~8–10%; high self-harm burden', onset: 'Adolescence to early adulthood' },
      ddx: ['Bipolar II disorder', 'PTSD/complex PTSD', 'Other personality disorders', 'ADHD', 'Substance use disorders'],
      redFlags: ['Recurrent suicidality/self-harm', 'Escalating impulsivity', 'Dissociation and micro-psychotic episodes', 'Countertransference-driven care'],
      scales: ['MSI-BPD (screen)', 'C-SSRS'],
      course: 'Symptoms — especially impulsivity and self-harm — often attenuate substantially with age and treatment; interpersonal difficulties may persist. Prognosis is more hopeful than historically assumed.',
      comorbid: ['MDD', 'PTSD', 'Substance use', 'Eating disorders', 'Bipolar disorder']
    },
    {
      id: 'aspd', name: 'Antisocial Personality Disorder', cat: 'personality',
      desc: 'A durable disregard for and violation of others’ rights — deceitfulness, impulsivity, aggression, irresponsibility, and lack of remorse — present since age 15 (as conduct disorder) and diagnosed only from age 18.',
      codes: { dsm: 'F60.2', icd10: 'F60.2', icd11: '6D10 + dissocial trait' },
      meds: { first: ['No approved or specific pharmacotherapy'], adjunct: ['Treat comorbid conditions (substance use, ADHD, depression)', 'Manage aggression/impulsivity symptomatically'], note: 'Prescribe cautiously given misuse potential; there is no medication for the disorder itself.' },
      therapy: ['Limited evidence; contingency management and structured programs for comorbid substance use', 'Treatment of comorbidities'],
      epi: { incidence: 'N/A', prevalence: '~1–4%; higher in males and forensic settings', mortality: 'Elevated — violence, accidents, suicide, substance use', onset: 'Conduct disorder in childhood/adolescence; diagnosed ≥18' },
      ddx: ['Substance use disorders', 'Narcissistic PD', 'Intermittent explosive disorder', 'Bipolar/manic behavior', 'Psychopathy (dimensional)'],
      redFlags: ['Violence/homicidality risk', 'Exploitation of others including clinicians', 'Comorbid substance use escalation'],
      scales: ['PCL-R (psychopathy, specialist use)'],
      course: 'Antisocial behaviors often peak in early adulthood and may diminish somewhat by midlife, though the core pattern is stable.',
      comorbid: ['Substance use', 'ADHD', 'Depression', 'Other personality disorders']
    },
    {
      id: 'npd', name: 'Narcissistic Personality Disorder', cat: 'personality',
      desc: 'A pervasive pattern of grandiosity, need for admiration, and lack of empathy — sometimes masking a fragile self-esteem exquisitely sensitive to criticism — pervading relationships and self-regard from early adulthood.',
      codes: { dsm: 'F60.81', icd10: 'F60.81', icd11: '6D10 (with prominent traits)' },
      meds: { first: ['No approved pharmacotherapy'], adjunct: ['Treat comorbid depression/anxiety'], note: 'Engagement and retention in treatment are the central challenges.' },
      therapy: ['Psychodynamic/transference-focused psychotherapy', 'Schema therapy', 'Mentalization-based approaches'],
      epi: { incidence: 'N/A', prevalence: '~1–2% (up to ~6% in some samples)', mortality: 'Suicide risk during narcissistic injury/crisis', onset: 'Early adulthood' },
      ddx: ['Antisocial PD', 'Borderline PD', 'Bipolar/hypomania', 'Histrionic PD'],
      redFlags: ['Suicidality following perceived humiliation or failure', 'Aggression when threatened'],
      scales: ['Clinical interview'],
      course: 'Generally stable; some features soften with age and life experience, particularly after loss of status.',
      comorbid: ['Depression', 'Substance use', 'Other personality disorders']
    }
  );

  // ── Somatic Symptom & Dissociative ──────────────────────────────────────────
  DX.push(
    {
      id: 'ssd', name: 'Somatic Symptom Disorder', cat: 'somatic',
      desc: 'One or more distressing physical symptoms paired with disproportionate thoughts, anxiety, and time/energy devoted to them — the diagnosis rests on the excessive response to symptoms, not on whether they are medically explained.',
      codes: { dsm: 'F45.1', icd10: 'F45.1', icd11: '6C20' },
      meds: { first: ['No specific pharmacotherapy; treat comorbid depression/anxiety with SSRIs/SNRIs'], adjunct: ['SNRIs/TCAs where there is comorbid pain'], note: 'A consistent primary-care home with regularly scheduled visits reduces unnecessary testing and ER use.' },
      therapy: ['CBT', 'Mindfulness-based therapy', 'Regular scheduled visits with one clinician', 'Reassurance without over-investigation'],
      epi: { incidence: 'N/A', prevalence: '~5–7% general population', mortality: 'Low direct; high healthcare utilization and iatrogenic risk', onset: 'Often before age 30; any age' },
      ddx: ['Illness anxiety disorder', 'Functional neurological disorder', 'Panic/anxiety disorders', 'Undiagnosed medical illness', 'Depression'],
      redFlags: ['New or changing symptoms warranting genuine medical workup', 'Iatrogenic harm from repeated procedures', 'Comorbid depression/suicidality'],
      scales: ['PHQ-15', 'Somatic Symptom Scale-8'],
      course: 'Often chronic and fluctuating; a strong therapeutic alliance and limited investigation improve outcomes.',
      comorbid: ['Depression', 'Anxiety disorders', 'Chronic pain']
    },
    {
      id: 'iad', name: 'Illness Anxiety Disorder', cat: 'somatic',
      desc: 'Preoccupation with having or acquiring a serious illness in the near-absence of somatic symptoms, sustained by excessive health-checking or, conversely, maladaptive avoidance of medical care — the former "hypochondriasis."',
      codes: { dsm: 'F45.21', icd10: 'F45.21', icd11: '6B23' },
      meds: { first: ['SSRIs/SNRIs'], adjunct: ['Treat comorbid anxiety/depression'], note: 'Distinguish care-seeking from care-avoidant types; both need addressing.' },
      therapy: ['CBT', 'Exposure and response prevention for reassurance-seeking', 'Mindfulness'],
      epi: { incidence: 'N/A', prevalence: '~1.3–10% depending on definition/setting', mortality: 'Low direct', onset: 'Early to middle adulthood' },
      ddx: ['Somatic symptom disorder', 'OCD', 'Panic disorder', 'GAD', 'Delusional disorder (somatic type)'],
      redFlags: ['Care-avoidant type missing genuine disease', 'Comorbid depression/suicidality'],
      scales: ['Whiteley Index', 'Health Anxiety Inventory'],
      course: 'Often chronic and relapsing; responds to CBT and SSRIs.',
      comorbid: ['Anxiety disorders', 'Depression', 'OCD']
    },
    {
      id: 'fnd', name: 'Functional Neurological Symptom Disorder (Conversion)', cat: 'somatic',
      desc: 'Neurological symptoms — weakness, non-epileptic seizures, movement, sensory, or speech disturbance — that are genuine and involuntary yet incompatible with recognized neurological disease on positive examination signs, not merely a diagnosis of exclusion.',
      codes: { dsm: 'F44.x', icd10: 'F44.4–F44.7 (by symptom)', icd11: '6B60' },
      meds: { first: ['No specific medication; treat comorbid depression/anxiety'], adjunct: ['Symptom-targeted treatment as needed'], note: 'Clear, non-stigmatizing explanation of the diagnosis (including positive signs) is itself therapeutic.' },
      therapy: ['Physiotherapy for motor symptoms', 'CBT', 'Psychoeducation about the diagnosis', 'Specialized FND rehabilitation'],
      epi: { incidence: '~4–12 per 100,000 per year', prevalence: 'Common in neurology clinics (~one of the most frequent referrals)', mortality: 'Low direct; substantial disability', onset: 'Any age; often young to middle adulthood' },
      ddx: ['Neurological disease (epilepsy, MS, stroke)', 'Somatic symptom disorder', 'Factitious disorder/malingering (intentional — distinct)', 'Panic attacks'],
      redFlags: ['Missed neurological disease', 'Comorbid depression/suicidality', 'Non-epileptic seizures mistaken for status epilepticus'],
      scales: ['Clinical exam with positive signs (Hoover’s sign, etc.)'],
      course: 'Variable; early diagnosis, explanation, and rehabilitation improve prognosis. Chronicity is common when recognition is delayed.',
      comorbid: ['Depression', 'Anxiety/panic', 'PTSD', 'Chronic pain']
    },
    {
      id: 'did', name: 'Dissociative Identity Disorder', cat: 'somatic',
      desc: 'A disruption of identity involving two or more distinct personality states with recurrent gaps in memory for everyday events and personal information, typically rooted in severe, repeated early-childhood trauma.',
      codes: { dsm: 'F44.81', icd10: 'F44.81', icd11: '6B64' },
      meds: { first: ['No medication for the dissociation itself'], adjunct: ['Treat comorbid PTSD, depression, and anxiety', 'Prazosin for nightmares'], note: 'Avoid over-medication; phased trauma-focused psychotherapy is the mainstay.' },
      therapy: ['Phase-oriented trauma-focused psychotherapy (stabilization → trauma processing → integration)', 'DBT skills for affect regulation'],
      epi: { incidence: 'N/A', prevalence: '~1–1.5% (contested; varies by setting)', mortality: 'High self-harm and suicide risk', onset: 'Origins in childhood trauma; often identified in adulthood' },
      ddx: ['PTSD/complex PTSD', 'Borderline personality disorder', 'Psychotic disorders', 'Factitious disorder', 'Seizure disorders'],
      redFlags: ['Suicidality/self-harm', 'Severe dissociative amnesia impairing safety', 'Re-traumatization risk with premature trauma processing'],
      scales: ['Dissociative Experiences Scale', 'MID', 'C-SSRS'],
      course: 'Chronic; long-term phase-based psychotherapy can achieve substantial functional improvement.',
      comorbid: ['PTSD', 'Depression', 'Borderline PD', 'Substance use']
    }
  );

  // ── Expose ──────────────────────────────────────────────────────────────────
  window.DiagnosesDB = { categories: CATEGORIES, diagnoses: DX };
})();

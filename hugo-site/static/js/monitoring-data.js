/* Monitoring schedules for medication cards.
   Keyed by MEDICATIONS id and copied onto each entry as `monitoring`.
   Schedules follow current FDA prescribing information. Antipsychotic
   metabolic timing follows the ADA/APA/AACE/NAASO consensus
   (Diabetes Care. 2004;27(2):596-601). Conditional checks are included
   when the label requires them only in higher-risk patients.
   A card with no standing bloodwork says "No routine lab monitoring required". */
(function () {
  if (typeof MEDICATIONS === 'undefined') return;

  var ADA = [
    { item: 'Personal and family history (obesity, diabetes, dyslipidemia, hypertension, cardiovascular disease)', timing: 'Baseline' },
    { item: 'Weight and BMI', timing: 'Baseline, 4 weeks, 8 weeks, 12 weeks, then quarterly' },
    { item: 'Waist circumference', timing: 'Baseline, then annually' },
    { item: 'Blood pressure', timing: 'Baseline, 12 weeks, then annually' },
    { item: 'Fasting glucose or HbA1c', timing: 'Baseline, 12 weeks, then annually' },
    { item: 'Fasting lipid panel', timing: 'Baseline, 12 weeks, then every 5 years if normal; sooner if abnormal' }
  ];
  var ADA_SOURCE = 'ADA, APA, AACE, and NAASO consensus (Diabetes Care. 2004;27(2):596-601), plus the product prescribing information.';
  var ADA_CLINICAL = 'Examine for parkinsonism, akathisia, and tardive dyskinesia (AIMS at least annually; about every 6 months with a first-generation antipsychotic or in older adults). Check a prolactin only if there are symptoms (galactorrhea, menstrual change, sexual dysfunction, or gynecomastia).';

  function M(summary, schedule, clinical, source, routineLabs) {
    return {
      summary: summary,
      routineLabs: routineLabs,
      schedule: schedule,
      clinical: clinical,
      source: source
    };
  }
  function none(summary, clinical, source, extra) {
    var schedule = [{ item: 'Routine laboratory monitoring', timing: 'No routine lab monitoring required' }];
    if (extra && extra.length) schedule = schedule.concat(extra);
    return M(summary, schedule, clinical, source, false);
  }
  function ada(summary, extra, clinical, source) {
    return M(summary, ADA.concat(extra || []), clinical || ADA_CLINICAL, source || ADA_SOURCE, true);
  }

  var SSRI_CLINICAL = 'Suicidal thoughts and behavior, especially in the first months and after dose changes in patients under 25. Hyponatremia and SIADH in older adults and people on diuretics — check a sodium if symptomatic. Bleeding risk rises with anticoagulants, antiplatelets, or NSAIDs. Sexual dysfunction and discontinuation symptoms.';
  var SSRI_SOURCE = 'SSRI prescribing information (suicidality boxed warning; hyponatremia and bleeding warnings). No standing laboratory panel is required.';
  var SNRI_SOURCE = 'SNRI prescribing information (blood pressure warning; suicidality boxed warning; hyponatremia warning).';
  var BZD_CLINICAL = 'Sedation, falls, and respiratory depression, especially with opioids (boxed warning). Misuse, dependence, and withdrawal. Complex sleep behaviors when used for sleep. No standing blood tests.';
  var BZD_SOURCE = 'Benzodiazepine prescribing information (risks from concomitant opioid use).';
  var STIM_EXTRA = [
    { item: 'Blood pressure and heart rate', timing: 'Baseline, after dose changes, and periodically' },
    { item: 'Height and weight', timing: 'Baseline and periodically in children and adolescents' },
    { item: 'ECG', timing: 'Not routine. Obtain if symptoms, known heart disease, or a family history of sudden cardiac death' }
  ];
  var STIM_CLINICAL = 'Misuse, diversion, appetite loss, insomnia, anxiety, and tics. No standing blood tests.';
  var STIM_SOURCE = 'Stimulant prescribing information (blood pressure, pulse, and pediatric growth). Routine ECG screening of every patient is not required.';

  var map = {
    fluoxetine: none(
      'No routine lab monitoring required. Clinical follow-up for suicidality and hyponatremia.',
      SSRI_CLINICAL + ' Long half-life (norfluoxetine) softens discontinuation symptoms.',
      SSRI_SOURCE
    ),
    sertraline: none(
      'No routine lab monitoring required. Clinical follow-up for suicidality and hyponatremia.',
      SSRI_CLINICAL,
      SSRI_SOURCE
    ),
    paroxetine: none(
      'No routine lab monitoring required. Clinical follow-up for suicidality, hyponatremia, and discontinuation.',
      SSRI_CLINICAL + ' Discontinuation symptoms are common; taper. Avoid in pregnancy when possible (cardiac malformation warning).',
      SSRI_SOURCE
    ),
    fluvoxamine: none(
      'No routine lab monitoring required. Clinical follow-up for suicidality and hyponatremia.',
      SSRI_CLINICAL + ' Strong CYP inhibition changes levels of many coprescribed drugs; that is a medication review, not a lab panel.',
      SSRI_SOURCE
    ),
    vilazodone: none(
      'No routine lab monitoring required. Clinical follow-up for suicidality and hyponatremia.',
      SSRI_CLINICAL + ' Take with food. Diarrhea and nausea are common early.',
      'Vilazodone prescribing information.'
    ),
    vortioxetine: none(
      'No routine lab monitoring required. Clinical follow-up for suicidality and hyponatremia.',
      SSRI_CLINICAL,
      'Vortioxetine prescribing information.'
    ),
    gepirone: none(
      'No routine lab monitoring required. Clinical follow-up for suicidality and hyponatremia.',
      'Suicidality boxed warning, as with other antidepressants. Dizziness and nausea. No standing blood tests.',
      'Gepirone prescribing information.'
    ),
    escitalopram: none(
      'No routine lab monitoring required. ECG and electrolytes only if there is QT risk.',
      SSRI_CLINICAL + ' Do not exceed 20 mg/day. Dose-dependent QT prolongation is a concern above that dose and in congenital long QT or uncorrected low potassium or magnesium.',
      'Escitalopram prescribing information (QT warning; maximum dose 20 mg/day).',
      [
        { item: 'Potassium and magnesium', timing: 'Before starting, and periodically, only if the patient is at risk for electrolyte loss (for example diuretics or diarrhea). Correct deficits first' },
        { item: 'ECG', timing: 'Not routine. Obtain if congenital long QT, symptomatic palpitations or syncope, or combined QT-prolonging drugs' }
      ]
    ),
    citalopram: none(
      'No routine labs if QT risk is absent. Check potassium and magnesium, and consider an ECG, when QT risk is present.',
      SSRI_CLINICAL + ' Maximum 40 mg/day, or 20 mg/day if older than 60, in hepatic impairment, or in CYP2C19 poor metabolizers. Avoid in congenital long QT, bradycardia, uncorrected hypokalemia or hypomagnesemia, recent acute myocardial infarction, or uncompensated heart failure.',
      'Citalopram prescribing information (dose-dependent QT prolongation).',
      [
        { item: 'Potassium and magnesium', timing: 'Baseline and periodic monitoring in patients at risk for electrolyte disturbance. Correct deficits before starting and during treatment' },
        { item: 'ECG', timing: 'Not required for every patient. Use when congenital long QT, cardiac disease, or other QT-prolonging drugs are present' }
      ]
    ),

    venlafaxine: none(
      'No routine blood tests. Blood pressure at baseline and regularly during treatment.',
      'Control hypertension before starting. Dose-related blood pressure rise. Suicidality, hyponatremia (especially older adults), discontinuation symptoms, and bleeding with anticoagulants or NSAIDs.',
      SNRI_SOURCE,
      [{ item: 'Blood pressure', timing: 'Before starting and regularly during treatment' }]
    ),
    desvenlafaxine: none(
      'No routine blood tests. Blood pressure at baseline and regularly during treatment.',
      'Blood pressure can rise. Suicidality, hyponatremia, discontinuation symptoms, and lipid increases in some patients — check lipids if weight or other risk changes, not on a fixed schedule.',
      'Desvenlafaxine prescribing information.',
      [{ item: 'Blood pressure', timing: 'Before starting and regularly during treatment' }]
    ),
    duloxetine: none(
      'No routine blood tests. Blood pressure during treatment. Liver tests only if hepatic symptoms occur.',
      'Do not use in substantial alcohol use or chronic liver disease. Stop and check liver enzymes if jaundice, abdominal pain, or dark urine. Suicidality, hyponatremia, and urinary hesitation.',
      'Duloxetine prescribing information (hepatotoxicity and blood pressure warnings).',
      [
        { item: 'Blood pressure', timing: 'Before starting and periodically' },
        { item: 'Liver enzymes', timing: 'Not scheduled. Obtain if symptoms of liver injury, then discontinue if jaundice or hepatic injury is confirmed' }
      ]
    ),
    milnacipran: none(
      'No routine blood tests. Blood pressure and heart rate during treatment.',
      'Blood pressure and heart rate can rise. Suicidality boxed warning. Hyponatremia and urinary hesitation. Used for fibromyalgia rather than as an antidepressant indication.',
      'Milnacipran prescribing information.',
      [{ item: 'Blood pressure and heart rate', timing: 'Before starting and periodically' }]
    ),
    levomilnacipran: none(
      'No routine blood tests. Blood pressure and heart rate during treatment.',
      'Blood pressure and heart rate can rise. Suicidality, hyponatremia, and urinary hesitation.',
      'Levomilnacipran prescribing information.',
      [{ item: 'Blood pressure and heart rate', timing: 'Before starting and periodically' }]
    ),

    amitriptyline: none(
      'No routine blood panel. Baseline ECG if over 40 or if heart disease is known.',
      'Orthostatic blood pressure, anticholinergic effects (constipation, urinary retention, confusion), suicidality, and sodium in older adults. A serum level is optional and is more often used for nortriptyline or imipramine than for amitriptyline.',
      'Amitriptyline prescribing information (cardiac conduction warning).',
      [{ item: 'ECG', timing: 'Before starting in adults over 40 or with known cardiac disease. Repeat if symptoms or dose is high' }]
    ),
    nortriptyline: none(
      'No routine blood panel. Baseline ECG if over 40 or if heart disease is known. A serum level can guide dosing.',
      'Orthostatic blood pressure, anticholinergic effects, suicidality, and sodium in older adults. A 12-hour serum level is useful when response or adherence is unclear; clinicians often use a window of about 50–150 ng/mL.',
      'Nortriptyline prescribing information (cardiac conduction; plasma level may be useful).',
      [
        { item: 'ECG', timing: 'Before starting in adults over 40 or with known cardiac disease' },
        { item: 'Serum nortriptyline level', timing: 'Optional. Draw about 12 hours after a dose once the dose has been stable, if needed to check the range, adherence, or toxicity' }
      ]
    ),
    imipramine: none(
      'No routine blood panel. Baseline ECG if over 40 or if heart disease is known. A serum level is optional.',
      'Orthostatic blood pressure, anticholinergic effects, suicidality, and sodium in older adults. Combined imipramine plus desipramine levels are sometimes used to guide dosing.',
      'Imipramine prescribing information (cardiac conduction warning).',
      [{ item: 'ECG', timing: 'Before starting in adults over 40 or with known cardiac disease' }]
    ),
    doxepin: none(
      'No routine blood panel. Baseline ECG if over 40 or if heart disease is known. Low hypnotic doses need less surveillance than full antidepressant doses.',
      'At antidepressant doses, same conduction, orthostasis, and anticholinergic cautions as other TCAs. Avoid during breastfeeding (infant sedation and respiratory depression).',
      'Doxepin prescribing information.',
      [{ item: 'ECG', timing: 'Before antidepressant-range dosing in adults over 40 or with known cardiac disease. Not required for usual low hypnotic doses in patients without cardiac disease' }]
    ),

    phenelzine: none(
      'No routine lab monitoring required. Observe blood pressure frequently.',
      'Hypertensive crisis from tyramine and sympathomimetics: educate on diet and drug restrictions, and ask about headache and palpitations. Orthostatic hypotension. Suicidality. Stop immediately for palpitation or frequent headache. Hepatocellular injury is reported rarely; check liver enzymes if jaundice or hepatitis symptoms appear, not on a fixed schedule.',
      'Phenelzine prescribing information (blood pressure should be observed frequently).',
      [{ item: 'Blood pressure', timing: 'Frequently during treatment, to detect a pressor response' }]
    ),
    tranylcypromine: none(
      'No routine lab monitoring required. Observe blood pressure frequently.',
      'Hypertensive crisis precautions (tyramine and sympathomimetics) and orthostatic hypotension. Insomnia and stimulation are common. Suicidality. No standing blood panel.',
      'Tranylcypromine prescribing information (hypertensive crisis).',
      [{ item: 'Blood pressure', timing: 'Frequently during treatment' }]
    ),

    bupropion: none(
      'No routine lab monitoring required. Check blood pressure.',
      'Seizure risk rises with high doses, bulimia, anorexia, or abrupt benzodiazepine or alcohol withdrawal — those are contraindications, not labs. Suicidality. Blood pressure can rise.',
      'Bupropion prescribing information.',
      [{ item: 'Blood pressure', timing: 'Before starting and periodically' }]
    ),
    'dextromethorphan-bupropion': none(
      'No routine lab monitoring required. Check blood pressure. Do not combine with another bupropion product.',
      'Seizure risk from the bupropion component (dose ceiling; avoid in bulimia or anorexia). Suicidality. Dizziness. Do not use with an MAOI, chronic opioid therapy concerns aside, or another dextromethorphan-containing product.',
      'Dextromethorphan-bupropion prescribing information.',
      [{ item: 'Blood pressure', timing: 'Before starting and periodically' }]
    ),
    mirtazapine: none(
      'No routine lab monitoring required. Weigh at visits. Check a CBC only if infection symptoms appear.',
      'Weight gain and sedation are expected. Rare agranulocytosis: stop and obtain a CBC if fever, sore throat, stomatitis, or other signs of infection occur. Lipids can rise; check them if clinically indicated, not on a mandated schedule. Suicidality.',
      'Mirtazapine prescribing information (agranulocytosis warning; weight gain).'
    ),
    trazodone: none(
      'No routine lab monitoring required. Ask about prolonged erection and orthostasis.',
      'Priapism is a medical emergency. Orthostatic blood pressure and sedation. QT caution is greater at higher doses and with other QT-prolonging drugs; an ECG is not routine for low hypnotic doses in patients without cardiac risk.',
      'Trazodone prescribing information (priapism; QT warning).'
    ),

    haloperidol: ada('Antipsychotic metabolic schedule, plus movement-disorder exams.'),
    fluphenazine: ada('Antipsychotic metabolic schedule, plus movement-disorder exams. Depot dosing does not change the lab timing.'),
    trifluoperazine: ada('Antipsychotic metabolic schedule, plus movement-disorder exams.'),
    perphenazine: ada('Antipsychotic metabolic schedule, plus movement-disorder exams.'),
    thiothixene: ada('Antipsychotic metabolic schedule, plus movement-disorder exams.'),
    loxapine: ada('Antipsychotic metabolic schedule, plus movement-disorder exams. Inhaled loxapine (hospital use) adds immediate bronchospasm observation, not a lab panel.'),
    molindone: ada('Antipsychotic metabolic schedule, plus movement-disorder exams. Weight gain is less than with many other antipsychotics; the consensus checks still apply.'),
    risperidone: ada(
      'Antipsychotic metabolic schedule. Prolactin only if symptoms. Movement exams.',
      [],
      ADA_CLINICAL + ' Prolactin elevation is common; test only when symptoms suggest it.'
    ),
    paliperidone: ada(
      'Antipsychotic metabolic schedule. Prolactin only if symptoms. Movement exams.',
      [],
      ADA_CLINICAL + ' Prolactin elevation is common, as with risperidone.'
    ),
    quetiapine: ada('Antipsychotic metabolic schedule. Sedation and orthostasis during titration. Cataract surveillance is no longer a standing requirement.'),
    aripiprazole: ada(
      'Antipsychotic metabolic schedule. Watch for akathisia and impulse-control symptoms.',
      [],
      ADA_CLINICAL + ' Ask about new gambling, binge eating, compulsive shopping, or hypersexuality (impulse-control warning).'
    ),
    brexpiprazole: ada('Antipsychotic metabolic schedule. Akathisia is the main movement effect.'),
    cariprazine: ada('Antipsychotic metabolic schedule. Akathisia and late-emerging adverse effects because of the very long half-life of the active metabolite.'),
    lurasidone: ada('Antipsychotic metabolic schedule. Must be taken with food (at least 350 kcal) or exposure falls. Akathisia.'),
    asenapine: ada('Antipsychotic metabolic schedule. Oral hypoesthesia with the sublingual tablet. Watch for hypersensitivity and akathisia.'),
    lumateperone: ada('Antipsychotic metabolic schedule. Average weight gain is lower than with olanzapine or quetiapine; the consensus checks still apply. Somnolence.'),
    iloperidone: ada(
      'Antipsychotic metabolic schedule, slow titration for orthostasis, and an ECG if QT risk is present.',
      [
        { item: 'Orthostatic blood pressure', timing: 'During the required slow titration' },
        { item: 'ECG', timing: 'Not routine for every patient. Obtain if known QT prolongation, electrolyte loss, or other QT-prolonging drugs. Avoid iloperidone in significant QT risk' }
      ]
    ),
    chlorpromazine: ada(
      'Antipsychotic metabolic schedule, movement exams, and an eye exam with long-term use.',
      [{ item: 'Eye examination', timing: 'Periodically during prolonged therapy (lens and corneal opacities are a labeled effect of long-term chlorpromazine)' }]
    ),
    olanzapine: ada(
      'Antipsychotic metabolic schedule (high metabolic risk). Relprevv adds 3-hour post-injection observation.',
      [{ item: 'Post-injection observation (olanzapine pamoate / Zyprexa Relprevv only)', timing: 'At least 3 hours of continuous observation in a certified healthcare setting after every injection, for post-injection delirium/sedation syndrome. REMS was modified on May 7, 2026 and is still required' }],
      ADA_CLINICAL + ' Oral and short-acting injectable olanzapine do not need that 3-hour watch. Tobacco smoking induces CYP1A2 and lowers the level; reassess the dose if smoking status changes.'
    ),
    'olanzapine-samidorphan': ada(
      'Same metabolic schedule as olanzapine. Confirm the patient is not opioid-dependent before the first dose.',
      [{ item: 'Urine drug screen', timing: 'Before the first dose, to confirm opioids are absent. Samidorphan precipitates opioid withdrawal and blocks opioid analgesics' }],
      ADA_CLINICAL + ' Contraindicated with opioids and in acute opioid withdrawal. Opioid-free interval before starting: at least 7 days for short-acting opioids and at least 14 days for long-acting opioids.'
    ),
    ziprasidone: ada(
      'Antipsychotic metabolic schedule, plus potassium and magnesium if electrolyte risk, and an ECG when QT risk is present.',
      [
        { item: 'Potassium and magnesium', timing: 'Baseline if the patient is at risk for electrolyte loss (diuretics, diarrhea, eating disorder). Replete before starting. Recheck periodically in those patients' },
        { item: 'ECG', timing: 'Before starting when cardiac disease, congenital long QT, or other QT-prolonging drugs are present. Stop if QTc stays above 500 msec. Take capsules with food' }
      ],
      ADA_CLINICAL + ' Contraindicated with a known QT history, recent myocardial infarction, or uncompensated heart failure.'
    ),
    thioridazine: ada(
      'Baseline ECG and potassium are required. Do not start if QTc is above 450 msec. Metabolic schedule still applies. Reserved for refractory illness.',
      [
        { item: 'ECG', timing: 'Baseline, before the first dose. Do not start if QTc is greater than 450 msec. Repeat periodically, especially after dose increases' },
        { item: 'Serum potassium', timing: 'Baseline. Normalize before starting. Repeat with the ECG during treatment' }
      ],
      ADA_CLINICAL + ' Boxed warning for dose-related QT prolongation and sudden death. Not a first-line antipsychotic.'
    ),
    pimozide: ada(
      'Baseline ECG, and repeat ECGs while the dose is being adjusted. CYP2D6 genotype before higher doses.',
      [
        { item: 'ECG', timing: 'Baseline, then periodically throughout dose adjustment. Stop upward titration if QTc exceeds 0.47 seconds in children or 0.52 seconds in adults, or rises more than 25% above that patient\'s baseline' },
        { item: 'Potassium', timing: 'Correct hypokalemia before and during treatment (diarrhea, diuretics)' },
        { item: 'CYP2D6 genotype', timing: 'Required before exceeding 4 mg/day in adults (0.05 mg/kg/day in children). Poor metabolizers should not exceed those doses' }
      ]
    ),
    clozapine: ada(
      'ANC weekly for 6 months, every 2 weeks for the next 6 months, then monthly, plus the metabolic schedule.',
      [
        { item: 'Absolute neutrophil count', timing: 'Baseline must be at least 1500/µL (at least 1000/µL in benign ethnic neutropenia / Duffy-null). Then weekly for 6 months, every 2 weeks for months 7–12, and monthly thereafter. Interrupt and follow the label ANC algorithm if the count falls. The Clozapine REMS was eliminated in 2025; this laboratory schedule remains on the label' },
        { item: 'Myocarditis surveillance', timing: 'First month: fever, resting tachycardia, chest pain, dyspnea, or a flu-like illness. If suspected, stop clozapine and obtain CRP, troponin, and a cardiac evaluation. Not a standing weekly troponin in an asymptomatic patient' },
        { item: 'ECG and electrolytes', timing: 'If syncope, presyncope, palpitations, or other arrhythmia symptoms. The label advises stopping if QTc exceeds 500 msec. Baseline potassium and magnesium if electrolyte loss is likely' }
      ],
      ADA_CLINICAL + ' Constipation and gastrointestinal hypomotility can be fatal: ask about bowel function at visits and treat early. Seizure risk rises above 600 mg/day. Smoking cessation raises the level within days.',
      'Clozapine prescribing information (ANC table; myocarditis warning) and the ADA/APA metabolic consensus (Diabetes Care. 2004;27(2):596-601).'
    ),
    pimavanserin: none(
      'No routine metabolic panel and no standing blood tests. ECG if QT risk is present.',
      'QT prolongation warning. Used for Parkinson disease psychosis: follow motor status, falls, and confusion. Metabolic liability is lower than D2 antipsychotics, so the full ADA/APA grid is not a label requirement; check weight, glucose, and lipids if risk factors emerge.',
      'Pimavanserin prescribing information (QT prolongation).',
      [{ item: 'ECG', timing: 'Not routine. Obtain if congenital long QT, electrolyte abnormality, or other QT-prolonging drugs' }]
    ),
    'xanomeline-trospium': M(
      'Liver enzymes and bilirubin before the first dose, then as clinically indicated. Heart rate at baseline. No ANC schedule.',
      [
        { item: 'Liver enzymes and bilirubin', timing: 'Before starting, and as clinically indicated. Stop if signs of substantial liver injury. Contraindicated in moderate or severe hepatic impairment; not recommended in mild impairment' },
        { item: 'Heart rate', timing: 'Baseline and as clinically indicated' },
        { item: 'Urinary symptoms', timing: 'Ongoing: hesitancy, weak stream, incomplete emptying, dysuria. Not a laboratory test' }
      ],
      'Anticholinergic effects from trospium: urinary retention, decreased gastrointestinal motility, and narrow-angle glaucoma are contraindications or cautions. Fasting glucose and lipids are not on a fixed label schedule; check them if weight rises.',
      'Cobenfy (xanomeline and trospium) prescribing information, revised 2026: assess liver enzymes and bilirubin before initiating; assess heart rate at baseline.',
      true
    ),

    lithium: M(
      '12-hour lithium level starting about day 3 until stable, then regularly. Kidney function, TSH, and calcium on a regular schedule.',
      [
        { item: 'Before the first dose', timing: 'Renal function, vital signs, serum electrolytes, and thyroid function. Consider pregnancy status in patients who can become pregnant' },
        { item: 'Serum lithium (12-hour trough, just before the next dose)', timing: 'About 3 days after starting, then regularly until the level and clinical state are stable. On maintenance, check regularly, and also after any dose change, after a diuretic, NSAID, ACE inhibitor, ARB, or metronidazole is started or stopped, after a large change in exercise or salt intake, and during intercurrent illness. Label target for acute mania is 0.8–1.2 mEq/L. Toxicity can occur at or above 1.5 mEq/L, and in sensitive patients inside the usual range' },
        { item: 'Renal function', timing: 'During treatment on a regular schedule (commonly every 6–12 months once stable; sooner if the level is rising or renal risk is high)' },
        { item: 'Thyroid function (TSH)', timing: 'Regularly during treatment, on the same cadence as renal function' },
        { item: 'Serum calcium', timing: 'During long-term treatment (labeled hypercalcemia and hyperparathyroidism), with the renal and thyroid labs' }
      ],
      'Tremor, polyuria, thirst, diarrhea, and confusion can be toxicity even when a recent level was acceptable. Do not rely on the level alone. Avoid volume depletion.',
      'Lithium carbonate prescribing information (2026): pretreatment renal function, vital signs, electrolytes, and thyroid; 12-hour levels after about 3 days and regularly until stable, then regular maintenance levels; monitor kidney function, thyroid function, and serum calcium.',
      true
    ),
    valproate: M(
      'Liver tests before starting and frequently in the first 6 months. Platelets periodically. Ammonia if mental status changes.',
      [
        { item: 'Liver enzymes', timing: 'Before the first dose, then at frequent intervals, especially during the first 6 months' },
        { item: 'Platelet count and coagulation tests', timing: 'Before starting and periodically. Thrombocytopenia is more likely at higher levels' },
        { item: 'Pregnancy test', timing: 'Before starting in patients who can become pregnant. Major teratogen. Contraindicated for migraine prophylaxis in pregnancy' },
        { item: 'Serum valproate level', timing: 'When checking adherence, toxicity, or interactions. The epilepsy reference range is often cited as about 50–100 µg/mL; the bipolar label does not define a therapeutic range' },
        { item: 'Ammonia', timing: 'If unexplained lethargy, vomiting, hypothermia, or mental-status change, and when topiramate is coprescribed. Can be elevated with normal liver enzymes' }
      ],
      'Counsel on contraception and neural-tube risk. Pancreatitis warning: severe abdominal pain, stop the drug. Suicidality.',
      'Divalproex prescribing information: serum liver tests before therapy and at frequent intervals especially in the first 6 months; monitor platelets and coagulation tests; measure ammonia if unexplained lethargy or vomiting.',
      true
    ),
    carbamazepine: M(
      'Baseline CBC and liver tests, then periodic liver tests. HLA-B*1502 before the first dose in at-risk ancestry. Level after autoinduction.',
      [
        { item: 'CBC with platelets', timing: 'Baseline, including platelets and, if available, reticulocytes and serum iron. If white cells or platelets fall, monitor closely and stop if significant bone-marrow depression develops. Not a fixed weekly CBC in a stable patient' },
        { item: 'Liver tests', timing: 'Baseline and periodically, and particularly in patients with a history of liver disease' },
        { item: 'HLA-B*1502', timing: 'Before the first dose in patients with ancestry in genetically at-risk Asian populations (boxed warning for SJS/TEN). Do not start if positive unless the benefit clearly outweighs the risk' },
        { item: 'Serum level', timing: 'After autoinduction settles (often 3–5 weeks), and when inducers or inhibitors change. A range of about 4–12 µg/mL is the usual epilepsy reference' },
        { item: 'Serum sodium', timing: 'If symptomatic (confusion, worsening seizures) or in older adults. Hyponatremia and SIADH are labeled and dose-related' },
        { item: 'Pregnancy test', timing: 'Before starting if pregnancy is possible (teratogenicity; enzyme induction lowers hormonal contraceptive exposure)' }
      ],
      'Rash surveillance at each early visit. Stop for a rash that could be SJS, or for fever with other organ involvement. Suicidality. Many drug interactions through CYP3A4 induction.',
      'Carbamazepine prescribing information: pretreatment blood counts; baseline and periodic liver tests; HLA-B*1502 boxed warning; hyponatremia warning.',
      true
    ),
    oxcarbazepine: M(
      'Serum sodium at baseline and through the first 3 months, then if symptomatic. No routine CBC or liver panel.',
      [
        { item: 'Serum sodium', timing: 'Baseline, during the first 3 months (when clinically significant hyponatremia usually appears), and again if symptoms occur. It can also appear after the first year. Check sooner in older adults and in patients on diuretics or other sodium-losing drugs' },
        { item: 'HLA-B*1502', timing: 'Consider before starting in patients with ancestry associated with this allele (SJS/TEN warning, shared with carbamazepine)' }
      ],
      'Cross-hypersensitivity if the patient had a serious reaction to carbamazepine: do not use. Rash, suicidality, and dizziness. No standing CBC or liver-test schedule.',
      'Oxcarbazepine prescribing information: monitor serum sodium; hyponatremia clustered in the first 3 months.',
      true
    ),
    lamotrigine: none(
      'No routine lab monitoring required. Stop at the first sign of a rash that could be serious.',
      'Serious rash including SJS/TEN is most likely during titration, with too-fast escalation, and when valproate is coprescribed (use the valproate titration, about half the usual dose). Benign rashes also occur and cannot be distinguished on sight: stop unless the rash is clearly not drug-related. Blood dyscrasias are uncommon — check a CBC if unexplained infection, bleeding, or anemia appears, not on a schedule. Suicidality. A serum level is not required for routine bipolar dosing.',
      'Lamotrigine prescribing information (serious rash boxed warning). No standing laboratory panel.'
    ),
    topiramate: M(
      'Serum bicarbonate at baseline and periodically. No other standing panel.',
      [
        { item: 'Serum bicarbonate', timing: 'Baseline and periodically. If metabolic acidosis persists, lower the dose or stop (taper)' },
        { item: 'Ammonia', timing: 'If unexplained encephalopathy, especially when valproate is coprescribed' },
        { item: 'Renal function', timing: 'Before dosing if impairment is suspected (renally cleared). Not a standing panel' },
        { item: 'Pregnancy test', timing: 'Before starting if pregnancy is possible (cleft lip/palate warning). Higher doses also induce hormonal contraceptives' }
      ],
      'Cognitive slowing, kidney stones (hydration), decreased sweating and fever in children, and acute eye pain or blurred vision (possible angle-closure glaucoma — stop and refer). Suicidality. Weight loss.',
      'Topiramate prescribing information: baseline and periodic serum bicarbonate.',
      true
    ),
    gabapentin: none(
      'No routine lab monitoring required. Check renal function only to set the dose if impairment is possible.',
      'Sedation, dizziness, edema, weight gain, misuse, and suicidality. Dose is reduced in renal impairment.',
      'Gabapentin prescribing information (renal dose adjustment; suicidality warning).',
      [{ item: 'Creatinine / eGFR', timing: 'Before dosing when renal function is unknown or impairment is likely. Not repeated on a fixed schedule if renal function is stable' }]
    ),
    pregabalin: none(
      'No routine lab monitoring required. Check renal function only to set the dose if impairment is possible.',
      'Sedation, dizziness, edema, weight gain, misuse (Schedule V), and suicidality. Visual change should be reported.',
      'Pregabalin prescribing information (renal dose adjustment).',
      [{ item: 'Creatinine / eGFR', timing: 'Before dosing when renal function is unknown or impairment is likely' }]
    ),

    alprazolam: none('No routine lab monitoring required. Clinical monitoring for sedation, misuse, and respiratory depression.', BZD_CLINICAL + ' Short half-life and a strong discontinuation syndrome; taper.', BZD_SOURCE),
    clonazepam: none('No routine lab monitoring required. Clinical monitoring for sedation, misuse, and respiratory depression.', BZD_CLINICAL, BZD_SOURCE),
    diazepam: none('No routine lab monitoring required. Clinical monitoring for sedation, misuse, and respiratory depression.', BZD_CLINICAL + ' Active metabolites accumulate, especially in older adults and hepatic impairment.', BZD_SOURCE),
    lorazepam: none('No routine lab monitoring required. Clinical monitoring for sedation, misuse, and respiratory depression.', BZD_CLINICAL + ' Preferred in hepatic impairment because it is glucuronidated. Valproate can raise the level.', BZD_SOURCE),
    oxazepam: none('No routine lab monitoring required. Clinical monitoring for sedation, misuse, and respiratory depression.', BZD_CLINICAL + ' Preferred in hepatic impairment (glucuronidation, no active metabolite).', BZD_SOURCE),
    chlordiazepoxide: none('No routine lab monitoring required. Clinical monitoring for sedation, misuse, and respiratory depression.', BZD_CLINICAL + ' Often used for alcohol withdrawal, where the withdrawal protocol itself sets vital-sign frequency.', BZD_SOURCE),
    clorazepate: none('No routine lab monitoring required. Clinical monitoring for sedation, misuse, and respiratory depression.', BZD_CLINICAL, BZD_SOURCE),
    midazolam: none('No routine lab monitoring required. Continuous observation when used for procedural sedation.', 'Procedural and parenteral use requires monitoring of respiration and oxygen saturation in a setting that can manage apnea. Oral midazolam still has the benzodiazepine boxed warning with opioids. No standing blood tests.', 'Midazolam prescribing information.'),
    triazolam: none('No routine lab monitoring required. Clinical monitoring for sedation, complex sleep behaviors, and misuse.', BZD_CLINICAL + ' Anterograde amnesia. Do not combine with strong CYP3A inhibitors.', BZD_SOURCE),
    estazolam: none('No routine lab monitoring required. Clinical monitoring for sedation, complex sleep behaviors, and misuse.', BZD_CLINICAL, BZD_SOURCE),
    flurazepam: none('No routine lab monitoring required. Clinical monitoring for next-day sedation, misuse, and respiratory depression.', BZD_CLINICAL + ' Long-acting metabolite; marked next-day impairment in older adults.', BZD_SOURCE),
    temazepam: none('No routine lab monitoring required. Clinical monitoring for sedation, complex sleep behaviors, and respiratory depression.', BZD_CLINICAL, BZD_SOURCE),

    zolpidem: none(
      'No routine lab monitoring required. Counsel on complex sleep behaviors and next-day impairment.',
      'Boxed warning for complex sleep behaviors (sleep-walking, sleep-driving): stop if they occur. Next-day impairment, especially in women and with extended-release products. Falls in older adults.',
      'Zolpidem prescribing information.'
    ),
    eszopiclone: none(
      'No routine lab monitoring required. Counsel on complex sleep behaviors and next-day impairment.',
      'Complex sleep behaviors (stop if they occur), unpleasant taste, and next-day impairment.',
      'Eszopiclone prescribing information.'
    ),
    ramelteon: none(
      'No routine lab monitoring required. No abuse-related labs.',
      'Rare angioedema and hormonal effects. Do not combine with fluvoxamine. Not a controlled substance. No standing blood tests.',
      'Ramelteon prescribing information.'
    ),
    suvorexant: none(
      'No routine lab monitoring required. Next-day somnolence and complex sleep behaviors.',
      'Contraindicated in narcolepsy. Dose-related next-day driving impairment. Sleep paralysis, hallucinations, and worsening depression. No standing blood tests.',
      'Suvorexant prescribing information.'
    ),
    lemborexant: none(
      'No routine lab monitoring required. Next-day somnolence and complex sleep behaviors.',
      'Contraindicated in narcolepsy. Next-day impairment, sleep paralysis, and cataplexy-like symptoms. No standing blood tests.',
      'Lemborexant prescribing information.'
    ),
    daridorexant: none(
      'No routine lab monitoring required. Next-day somnolence and complex sleep behaviors.',
      'Contraindicated in narcolepsy. Next-day impairment and worsening depression. No standing blood tests.',
      'Daridorexant prescribing information.'
    ),

    esketamine: none(
      'No routine blood tests. Blood pressure before every dose and for at least 2 hours after, in a certified setting.',
      'REMS: give only in a certified healthcare setting. Observe for dissociation and sedation for at least 2 hours. The patient must not drive until the next day after a restful sleep. Suicidality and misuse. If blood pressure is elevated before the dose (label example: above 140/90 mm Hg), reconsider giving it; do not dose when a further rise would be dangerous.',
      'Esketamine prescribing information and Spravato REMS (blood pressure before dosing and monitoring for at least 2 hours).',
      [{ item: 'Blood pressure', timing: 'Before every treatment. Recheck after the dose (about 40 minutes) and continue observation for at least 2 hours' }]
    ),
    brexanolone: none(
      'No routine blood tests. Continuous pulse oximetry during the 60-hour infusion.',
      'Excessive sedation and sudden loss of consciousness (boxed warning, REMS). Continuous pulse oximetry and a healthcare provider present for the 60-hour infusion. Marketing of Zulresso stopped at the end of 2024; these requirements still apply if a remaining supply is used. Oral zuranolone is the available alternative.',
      'Brexanolone prescribing information (REMS; continuous monitoring during infusion).',
      [{ item: 'Pulse oximetry', timing: 'Continuous, for the entire 60-hour infusion' }]
    ),
    zuranolone: none(
      'No routine lab monitoring required. Sedation precautions. Confirm pregnancy status before starting if pregnancy is possible.',
      'CNS depression: do not drive for at least 12 hours after each dose. Fetal risk: confirm pregnancy status before starting in patients who can become pregnant, and use effective contraception during treatment and for 1 week after the last dose. Suicidality.',
      'Zuranolone prescribing information (CNS depression; embryo-fetal risk).',
      [{ item: 'Pregnancy test', timing: 'Before the first dose if pregnancy is possible. Not repeated on a schedule during the 14-day course unless indicated' }]
    ),

    methylphenidate: none(
      'No routine lab monitoring required. Blood pressure, pulse, and, in children, height and weight.',
      STIM_CLINICAL,
      STIM_SOURCE,
      STIM_EXTRA
    ),
    dexmethylphenidate: none(
      'No routine lab monitoring required. Blood pressure, pulse, and, in children, height and weight.',
      STIM_CLINICAL,
      STIM_SOURCE,
      STIM_EXTRA
    ),
    'amphetamine-mixed-salts': none(
      'No routine lab monitoring required. Blood pressure, pulse, and, in children, height and weight.',
      STIM_CLINICAL,
      STIM_SOURCE,
      STIM_EXTRA
    ),
    dextroamphetamine: none(
      'No routine lab monitoring required. Blood pressure, pulse, and, in children, height and weight.',
      STIM_CLINICAL,
      STIM_SOURCE,
      STIM_EXTRA
    ),
    lisdexamfetamine: none(
      'No routine lab monitoring required. Blood pressure, pulse, and, in children, height and weight.',
      STIM_CLINICAL,
      STIM_SOURCE,
      STIM_EXTRA
    ),
    atomoxetine: none(
      'No routine blood tests. Heart rate and blood pressure at baseline, after increases, and periodically. Liver tests only if hepatitis symptoms occur.',
      'Suicidality boxed warning in children and adolescents. Rare severe liver injury: stop and do not restart if jaundice or laboratory evidence of liver injury. Growth (height and weight) in children. Urinary hesitation and priapism.',
      'Atomoxetine prescribing information (blood pressure and heart rate at baseline, after dose increases, and periodically; severe liver injury).',
      [
        { item: 'Blood pressure and heart rate', timing: 'Baseline, after dose increases, and periodically' },
        { item: 'Height and weight', timing: 'Periodically in children' },
        { item: 'Liver enzymes', timing: 'Not scheduled. Obtain promptly if pruritus, jaundice, dark urine, or right-upper-quadrant pain, then discontinue and do not restart if liver injury is confirmed' }
      ]
    ),
    viloxazine: none(
      'No routine blood tests. Heart rate and blood pressure at baseline, after increases, and periodically.',
      'Suicidality boxed warning. Heart rate and blood pressure increases. Mania activation. Growth in children. Strong CYP1A2 inhibition (contraindicated with sensitive CYP1A2 substrates such as duloxetine and ramelteon).',
      'Viloxazine prescribing information.',
      [
        { item: 'Blood pressure and heart rate', timing: 'Baseline, after dose increases, and periodically' },
        { item: 'Height and weight', timing: 'Periodically in children' }
      ]
    ),
    modafinil: none(
      'No routine lab monitoring required. Blood pressure, heart rate, psychiatric symptoms, and rash.',
      'Stop at the first sign of a serious rash. Psychiatric symptoms (mania, psychosis, anxiety). Blood pressure and heart rate can rise. Reduces hormonal-contraceptive efficacy during treatment and for 1 month after stopping. No standing blood panel.',
      'Modafinil prescribing information.'
    ),
    armodafinil: none(
      'No routine lab monitoring required. Blood pressure, heart rate, psychiatric symptoms, and rash.',
      'Same rash, psychiatric, and blood-pressure cautions as modafinil. Reduces hormonal-contraceptive efficacy during treatment and for 1 month after stopping.',
      'Armodafinil prescribing information.'
    ),
    solriamfetol: none(
      'No routine blood tests. Blood pressure and heart rate before starting and regularly during treatment.',
      'Do not start if hypertension is uncontrolled. Reassess the need for continued treatment. Psychiatric symptoms. Renal impairment raises blood-pressure risk because the half-life is longer.',
      'Solriamfetol prescribing information: assess blood pressure and control hypertension before initiating; monitor blood pressure regularly.',
      [{ item: 'Blood pressure and heart rate', timing: 'Before starting and periodically throughout treatment' }]
    ),

    propranolol: none(
      'No routine lab monitoring required. Blood pressure and heart rate.',
      'Bradycardia, hypotension, and bronchospasm. Masks hypoglycemia in diabetes. Do not stop abruptly in patients with coronary disease.',
      'Propranolol prescribing information.',
      [{ item: 'Blood pressure and heart rate', timing: 'Baseline and periodically' }]
    ),
    clonidine: none(
      'No routine lab monitoring required. Blood pressure and heart rate. Do not stop abruptly.',
      'Sedation, hypotension, and bradycardia. Abrupt discontinuation can cause rebound hypertension: taper. Used for ADHD, tics, and opioid withdrawal; the vital-sign schedule is the same.',
      'Clonidine prescribing information.',
      [{ item: 'Blood pressure and heart rate', timing: 'Baseline and periodically, including during taper' }]
    ),
    guanfacine: none(
      'No routine lab monitoring required. Blood pressure and heart rate. Do not stop abruptly.',
      'Sedation, hypotension, and bradycardia. Taper rather than stopping abruptly. Dose is affected by strong CYP3A4 inhibitors and inducers.',
      'Guanfacine extended-release prescribing information.',
      [{ item: 'Blood pressure and heart rate', timing: 'Baseline and periodically' }]
    ),
    buspirone: none(
      'No routine lab monitoring required.',
      'Dizziness, nausea, and delayed onset of effect (weeks). CYP3A4 inhibitors raise the level. No blood pressure or laboratory schedule.',
      'Buspirone prescribing information.'
    ),
    hydroxyzine: none(
      'No routine lab monitoring required. ECG only if the dose is high or QT risk is already present.',
      'Sedation and anticholinergic effects. QT prolongation and torsades have been reported; avoid in known QT prolongation and use caution with other QT-prolonging drugs.',
      'Hydroxyzine prescribing information (QT warning).',
      [{ item: 'ECG', timing: 'Not routine. Consider if high dose, electrolyte loss, or other QT-prolonging drugs' }]
    ),
    diphenhydramine: none(
      'No routine lab monitoring required. Anticholinergic burden, especially in older adults.',
      'Sedation, confusion, urinary retention, and constipation. Falls in older adults. No standing blood tests.',
      'Diphenhydramine labeling.'
    ),
    doxylamine: none(
      'No routine lab monitoring required. Anticholinergic burden, especially in older adults.',
      'Sedation and next-day impairment. Anticholinergic effects in older adults. No standing blood tests.',
      'Doxylamine labeling.'
    ),
    trihexyphenidyl: none(
      'No routine lab monitoring required. Anticholinergic effects and cognition.',
      'Dry mouth, constipation, urinary retention, blurred vision, and confusion, especially in older adults. Narrow-angle glaucoma is a caution. No standing blood tests.',
      'Trihexyphenidyl prescribing information.'
    ),

    valbenazine: none(
      'No routine blood tests. ECG if exposure is high or other QT risk is present.',
      'Somnolence and parkinsonism. QT prolongation is greater at higher concentrations, including CYP2D6 poor metabolizers on 60–80 mg. Avoid in congenital long QT.',
      'Valbenazine prescribing information (QT prolongation).',
      [{ item: 'ECG', timing: 'Not routine for every patient. Obtain if congenital long QT, a strong CYP2D6 or CYP3A4 inhibitor, known poor metabolizer status at higher doses, or other QT-prolonging drugs' }]
    ),
    deutetrabenazine: none(
      'No routine blood panel. ECG around dose increases in patients with QT risk. Depression and suicidality, especially in Huntington disease.',
      'Boxed warning for depression and suicidality in Huntington disease. Contraindicated in hepatic impairment and with other VMAT2 inhibitors or MAOIs. Parkinsonism and somnolence. CYP2D6 poor metabolizers have a lower maximum dose.',
      'Deutetrabenazine prescribing information (QT; depression boxed warning; hepatic impairment).',
      [{ item: 'ECG', timing: 'In patients at increased risk of QT prolongation, before and after dose increases' }]
    ),

    naltrexone: none(
      'No standing laboratory schedule. Do not start in acute hepatitis or liver failure. Liver tests if hepatitis symptoms occur. Confirm opioids are absent before the first dose.',
      'Precipitated withdrawal if opioids are still on board. After detoxification, opioid tolerance is low and overdose risk is high at the end of a dosing interval or if the blockade is overridden. Depression and suicidality. Injection-site reactions with the intramuscular product. Patients should seek care for symptoms of acute hepatitis; discontinue if those symptoms or signs appear.',
      'Naltrexone prescribing information: discontinue if symptoms or signs of acute hepatitis; contraindicated in acute hepatitis or liver failure. The current label does not require a fixed LFT calendar.',
      [
        { item: 'Urine drug screen', timing: 'Before the first dose, to confirm the patient is not physiologically dependent on opioids' },
        { item: 'Liver enzymes', timing: 'Before starting if liver disease is known or suspected. Repeat if nausea, fatigue, abdominal pain, dark urine, or jaundice. Not a fixed periodic panel in a patient with normal liver function and no symptoms' }
      ]
    ),
    buprenorphine: M(
      'Liver tests before starting and during treatment. Urine drug testing as part of opioid-use-disorder care.',
      [
        { item: 'Liver tests', timing: 'Before initiation and during treatment. Evaluate suspected hepatic events. Not recommended (combination product) in severe hepatic impairment' },
        { item: 'Urine drug testing', timing: 'Baseline and periodically, matched to clinical stability, to assess adherence and other substance use' }
      ],
      'Respiratory depression, especially with benzodiazepines or alcohol; do not withhold treatment for opioid use disorder solely because a benzodiazepine is also prescribed, but monitor closely and co-prescribe naloxone. Diversion and misuse. Adrenal insufficiency is uncommon. Precipitated withdrawal if started before objective withdrawal from a full agonist.',
      'Buprenorphine/naloxone prescribing information: monitor liver function tests prior to initiation and during treatment.',
      true
    )
  };

  var missing = [];
  MEDICATIONS.forEach(function (med) {
    if (map[med.id]) med.monitoring = map[med.id];
    else missing.push(med.id);
  });
  if (missing.length && typeof console !== 'undefined') {
    console.warn('Medication cards missing a monitoring schedule:', missing.join(', '));
  }
})();

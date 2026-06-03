(function () {
  'use strict';

  // ─── Medication Data ────────────────────────────────────────────────────────
  // Each entry: { name, brand, code (4-char unique), class, group,
  //   p450sub: [], p450inh: [], p450ind: [], receptors: [],
  //   sideEffects: [], classWarnings: [], blackBox: [] }

  const CLASS_WARNINGS = {
    SSRI: [
      'Serotonin syndrome (with serotonergic agents)',
      'SIADH / hyponatremia (esp. elderly)',
      'GI bleeding risk (esp. with NSAIDs/anticoagulants)',
      'Mania activation in bipolar disorder',
      'Sexual dysfunction (delayed orgasm, decreased libido)',
      'Discontinuation syndrome on abrupt stop',
    ],
    SNRI: [
      'Serotonin syndrome (with serotonergic agents)',
      'SIADH / hyponatremia',
      'GI bleeding risk',
      'Hypertension (dose-dependent, esp. venlafaxine)',
      'Mania activation in bipolar disorder',
      'Discontinuation syndrome on abrupt stop',
    ],
    TCA: [
      'Cardiac arrhythmia / QTc prolongation',
      'Orthostatic hypotension and falls',
      'Anticholinergic toxicity (urinary retention, constipation, delirium)',
      'Lethal in overdose (narrow therapeutic index)',
      'Lowered seizure threshold',
      'Serotonin syndrome (clomipramine)',
    ],
    MAOI: [
      'Hypertensive crisis with tyramine-rich foods',
      'Serotonin syndrome with serotonergic drugs',
      'Requires washout period (2 weeks) before/after other ADs',
      'Orthostatic hypotension',
      'Multiple drug–drug interactions',
    ],
    AtyAD: [
      'Class-specific warnings vary — see individual agent',
    ],
    FGA: [
      'Tardive dyskinesia (risk increases with duration)',
      'Extrapyramidal symptoms (acute dystonia, akathisia, parkinsonism)',
      'Neuroleptic malignant syndrome (NMS)',
      'QTc prolongation',
      'Hyperprolactinemia',
      'Anticholinergic effects (low-potency agents)',
      'Orthostatic hypotension (low-potency agents)',
    ],
    SGA: [
      'Metabolic syndrome (weight gain, dyslipidemia, hyperglycemia)',
      'Tardive dyskinesia (lower risk than FGAs but present)',
      'Extrapyramidal symptoms (risperidone > others)',
      'Neuroleptic malignant syndrome (NMS)',
      'QTc prolongation (ziprasidone, iloperidone)',
      'Hyperprolactinemia (risperidone, paliperidone)',
      'Orthostatic hypotension',
    ],
    MoodStab: [
      'Teratogenicity (valproate, carbamazepine)',
      'Drug-level monitoring required (lithium, valproate, carbamazepine)',
      'Hyponatremia (carbamazepine, oxcarbazepine)',
      'Stevens-Johnson syndrome / DRESS (lamotrigine, carbamazepine)',
      'Cognitive/memory effects',
    ],
    BZD: [
      'Dependence and withdrawal (potentially life-threatening)',
      'Respiratory depression (with opioids or alcohol — BLACK BOX)',
      'Cognitive impairment and falls (elderly)',
      'Rebound anxiety on discontinuation',
      'Disinhibition reactions',
    ],
    Hypnotic: [
      'Next-day sedation / impaired driving',
      'Complex sleep behaviors (sleepwalking, sleep-driving — BLACK BOX)',
      'Dependence potential',
      'Rebound insomnia',
    ],
    Stimulant: [
      'Cardiovascular risk (hypertension, tachycardia)',
      'Mania/psychosis activation',
      'Appetite suppression and weight loss',
      'Insomnia',
      'Potential for misuse/dependence',
      'Growth suppression in children (with long-term use)',
    ],
    NonstimADHD: [
      'Suicidality warning in pediatric patients (atomoxetine)',
      'Hepatotoxicity (atomoxetine — rare)',
      'QTc prolongation (viloxazine)',
      'Hypotension (guanfacine, clonidine)',
      'Rebound hypertension on abrupt stop (guanfacine, clonidine)',
    ],
    SUD: [
      'Drug-drug interactions vary by agent',
      'Hepatotoxicity (naltrexone — at high doses)',
    ],
  };

  const MEDS = [
    // ── SSRIs ──────────────────────────────────────────────────────────────────
    {
      name: 'Fluoxetine', brand: 'Prozac', code: 'FLUO', class: 'SSRI', group: 'Antidepressants',
      p450sub: ['2D6', '2C9', '2C19'], p450inh: ['2D6', '2C9', '2C19'],
      receptors: ['SERT', '5HT2C-ant'],
      sideEffects: ['Nausea', 'Insomnia / activation', 'Headache', 'Diarrhea', 'Dry mouth', 'Sexual dysfunction', 'Anxiety / jitteriness', 'Sweating', 'Tremor', 'Decreased appetite / weight loss'],
      blackBox: ['Suicidality in children, adolescents, and young adults (≤24 y)'],
    },
    {
      name: 'Sertraline', brand: 'Zoloft', code: 'SERT', class: 'SSRI', group: 'Antidepressants',
      p450sub: ['2C19', '2D6'], p450inh: ['2D6 (moderate)', '2C19 (mild)'],
      receptors: ['SERT', 'DAT (weak)', 'sigma-1'],
      sideEffects: ['Nausea', 'Diarrhea / loose stools', 'Insomnia', 'Dry mouth', 'Sweating', 'Sexual dysfunction', 'Headache', 'Fatigue / somnolence', 'Tremor', 'Decreased appetite'],
      blackBox: ['Suicidality in children, adolescents, and young adults (≤24 y)'],
    },
    {
      name: 'Escitalopram', brand: 'Lexapro', code: 'ESCA', class: 'SSRI', group: 'Antidepressants',
      p450sub: ['2C19', '3A4'], p450inh: ['2C19 (weak)'],
      receptors: ['SERT'],
      sideEffects: ['Nausea', 'Insomnia', 'Ejaculatory dysfunction', 'Sweating', 'Fatigue', 'Headache', 'Dry mouth', 'Diarrhea', 'Dizziness'],
      blackBox: ['Suicidality in children, adolescents, and young adults (≤24 y)', 'QTc prolongation at high doses (≥40 mg)'],
    },
    {
      name: 'Citalopram', brand: 'Celexa', code: 'CITA', class: 'SSRI', group: 'Antidepressants',
      p450sub: ['2C19', '3A4', '2D6'], p450inh: ['2D6 (weak)'],
      receptors: ['SERT'],
      sideEffects: ['Nausea', 'Dry mouth', 'Sweating', 'Somnolence', 'Insomnia', 'Sexual dysfunction', 'Tremor', 'Diarrhea', 'Dizziness', 'QTc prolongation (dose-dependent)'],
      blackBox: ['Suicidality in children, adolescents, and young adults (≤24 y)', 'QTc prolongation — max dose 40 mg/day (20 mg in elderly, hepatic impairment, or with CYP2C19 inhibitors)'],
    },
    {
      name: 'Paroxetine', brand: 'Paxil', code: 'PARO', class: 'SSRI', group: 'Antidepressants',
      p450sub: ['2D6'], p450inh: ['2D6 (strong)', '3A4 (weak)'],
      receptors: ['SERT', 'NET (weak)', 'M1-ant', 'H1-ant'],
      sideEffects: ['Somnolence', 'Dry mouth', 'Constipation', 'Sweating', 'Nausea', 'Sexual dysfunction', 'Weight gain', 'Dizziness', 'Tremor', 'Severe discontinuation syndrome'],
      blackBox: ['Suicidality in children, adolescents, and young adults (≤24 y)', 'Neonatal toxicity / PPHN if used in pregnancy (esp. 3rd trimester)'],
    },
    {
      name: 'Fluvoxamine', brand: 'Luvox', code: 'FLUV', class: 'SSRI', group: 'Antidepressants',
      p450sub: ['1A2', '2D6'], p450inh: ['1A2 (strong)', '2C19 (strong)', '3A4 (moderate)', '2C9 (moderate)', '2D6 (weak)'],
      receptors: ['SERT', 'sigma-1'],
      sideEffects: ['Nausea', 'Somnolence', 'Insomnia', 'Dry mouth', 'Constipation', 'Sweating', 'Sexual dysfunction', 'Headache', 'Dizziness', 'Tremor'],
      blackBox: ['Suicidality in children, adolescents, and young adults (≤24 y)'],
    },
    // ── SNRIs ──────────────────────────────────────────────────────────────────
    {
      name: 'Venlafaxine', brand: 'Effexor', code: 'VENL', class: 'SNRI', group: 'Antidepressants',
      p450sub: ['2D6', '3A4'], p450inh: ['2D6 (weak)'],
      receptors: ['SERT', 'NET', '5HT2A (weak)'],
      sideEffects: ['Nausea', 'Dizziness', 'Dry mouth', 'Sweating', 'Sexual dysfunction', 'Insomnia', 'Constipation', 'Hypertension (dose-dependent)', 'Palpitations', 'Severe discontinuation syndrome'],
      blackBox: ['Suicidality in children, adolescents, and young adults (≤24 y)'],
    },
    {
      name: 'Desvenlafaxine', brand: 'Pristiq', code: 'DESV', class: 'SNRI', group: 'Antidepressants',
      p450sub: ['3A4'], p450inh: [],
      receptors: ['SERT', 'NET'],
      sideEffects: ['Nausea', 'Dizziness', 'Insomnia', 'Hyperhidrosis', 'Constipation', 'Sexual dysfunction', 'Hypertension', 'Dry mouth', 'Fatigue'],
      blackBox: ['Suicidality in children, adolescents, and young adults (≤24 y)'],
    },
    {
      name: 'Duloxetine', brand: 'Cymbalta', code: 'DULO', class: 'SNRI', group: 'Antidepressants',
      p450sub: ['1A2', '2D6'], p450inh: ['2D6 (moderate)'],
      receptors: ['SERT', 'NET'],
      sideEffects: ['Nausea', 'Dry mouth', 'Somnolence', 'Constipation', 'Dizziness', 'Insomnia', 'Sweating', 'Decreased appetite', 'Sexual dysfunction', 'Hypertension'],
      blackBox: ['Suicidality in children, adolescents, and young adults (≤24 y)', 'Hepatotoxicity (avoid in substantial alcohol use or hepatic disease)'],
    },
    {
      name: 'Levomilnacipran', brand: 'Fetzima', code: 'LEVO', class: 'SNRI', group: 'Antidepressants',
      p450sub: ['3A4'], p450inh: [],
      receptors: ['NET', 'SERT'],
      sideEffects: ['Nausea', 'Constipation', 'Hyperhidrosis', 'Heart rate increase', 'Hypertension', 'Erectile dysfunction', 'Vomiting', 'Palpitations', 'Urinary hesitancy'],
      blackBox: ['Suicidality in children, adolescents, and young adults (≤24 y)'],
    },
    // ── Atypical Antidepressants ───────────────────────────────────────────────
    {
      name: 'Bupropion', brand: 'Wellbutrin', code: 'BUPR', class: 'NDRI', group: 'Antidepressants',
      p450sub: ['2B6'], p450inh: ['2D6 (moderate)'],
      receptors: ['DAT', 'NET', 'nAChR-ant'],
      sideEffects: ['Insomnia', 'Dry mouth', 'Headache', 'Nausea', 'Dizziness', 'Constipation', 'Agitation / anxiety', 'Tremor', 'Sweating', 'Weight loss / decreased appetite'],
      blackBox: ['Suicidality in children, adolescents, and young adults (≤24 y)', 'Seizure risk (dose-dependent; contraindicated in eating disorders, abrupt alcohol/BZD withdrawal)', 'Neuropsychiatric reactions in smoking cessation use (Zyban)'],
    },
    {
      name: 'Mirtazapine', brand: 'Remeron', code: 'MIRT', class: 'NaSSA', group: 'Antidepressants',
      p450sub: ['1A2', '2D6', '3A4'], p450inh: [],
      receptors: ['α2-ant', 'H1-ant', '5HT2A-ant', '5HT2C-ant', '5HT3-ant', 'M1-ant (weak)'],
      sideEffects: ['Somnolence / sedation', 'Weight gain', 'Increased appetite', 'Dry mouth', 'Constipation', 'Dizziness', 'Peripheral edema', 'Transaminase elevation', 'Agranulocytosis (rare)'],
      blackBox: ['Suicidality in children, adolescents, and young adults (≤24 y)'],
    },
    {
      name: 'Trazodone', brand: 'Desyrel', code: 'TRAZ', class: 'SARI', group: 'Antidepressants',
      p450sub: ['3A4', '2D6'], p450inh: [],
      receptors: ['SERT', '5HT2A-ant', 'H1-ant', 'α1-ant'],
      sideEffects: ['Somnolence / sedation', 'Dizziness', 'Dry mouth', 'Nausea', 'Headache', 'Blurred vision', 'Constipation', 'Orthostatic hypotension', 'Priapism (rare but serious)'],
      blackBox: ['Suicidality in children, adolescents, and young adults (≤24 y)'],
    },
    {
      name: 'Vilazodone', brand: 'Viibryd', code: 'VILA', class: 'SPARI', group: 'Antidepressants',
      p450sub: ['3A4'], p450inh: [],
      receptors: ['SERT', '5HT1A-partial'],
      sideEffects: ['Diarrhea', 'Nausea', 'Vomiting', 'Insomnia', 'Dry mouth', 'Dizziness', 'Headache', 'Sexual dysfunction', 'Abnormal dreams'],
      blackBox: ['Suicidality in children, adolescents, and young adults (≤24 y)'],
    },
    {
      name: 'Vortioxetine', brand: 'Trintellix', code: 'VORT', class: 'SMS', group: 'Antidepressants',
      p450sub: ['2D6'], p450inh: [],
      receptors: ['SERT', '5HT1A-partial', '5HT1B-partial', '5HT3-ant', '5HT7-ant', '5HT1D-ant'],
      sideEffects: ['Nausea', 'Constipation', 'Vomiting', 'Dizziness', 'Sexual dysfunction', 'Pruritus', 'Dry mouth', 'Flatulence'],
      blackBox: ['Suicidality in children, adolescents, and young adults (≤24 y)'],
    },
    // ── TCAs ──────────────────────────────────────────────────────────────────
    {
      name: 'Amitriptyline', brand: 'Elavil', code: 'AMIT', class: 'TCA', group: 'Antidepressants',
      p450sub: ['2D6', '2C19', '3A4'], p450inh: ['2D6 (moderate)'],
      receptors: ['SERT', 'NET', 'H1-ant', 'M1-ant', 'α1-ant', '5HT2A-ant'],
      sideEffects: ['Sedation', 'Dry mouth', 'Constipation', 'Urinary retention', 'Blurred vision', 'Weight gain', 'Orthostatic hypotension', 'Cardiac conduction abnormalities / QTc', 'Confusion / delirium (elderly)', 'Tremor'],
      blackBox: ['Suicidality in children, adolescents, and young adults (≤24 y)', 'Lethal in overdose'],
    },
    {
      name: 'Nortriptyline', brand: 'Pamelor', code: 'NORT', class: 'TCA', group: 'Antidepressants',
      p450sub: ['2D6'], p450inh: ['2D6 (weak)'],
      receptors: ['NET', 'SERT', 'H1-ant', 'M1-ant', 'α1-ant'],
      sideEffects: ['Dry mouth', 'Constipation', 'Sedation', 'Urinary retention', 'Blurred vision', 'Orthostatic hypotension', 'Weight gain', 'Cardiac conduction changes', 'Tremor'],
      blackBox: ['Suicidality in children, adolescents, and young adults (≤24 y)', 'Lethal in overdose'],
    },
    {
      name: 'Imipramine', brand: 'Tofranil', code: 'IMIP', class: 'TCA', group: 'Antidepressants',
      p450sub: ['2D6', '2C19'], p450inh: [],
      receptors: ['SERT', 'NET', 'H1-ant', 'M1-ant', 'α1-ant'],
      sideEffects: ['Dry mouth', 'Constipation', 'Urinary retention', 'Sedation', 'Orthostatic hypotension', 'Blurred vision', 'Weight gain', 'Cardiac arrhythmia', 'Sweating', 'Confusion'],
      blackBox: ['Suicidality in children, adolescents, and young adults (≤24 y)', 'Lethal in overdose'],
    },
    {
      name: 'Desipramine', brand: 'Norpramin', code: 'DESI', class: 'TCA', group: 'Antidepressants',
      p450sub: ['2D6'], p450inh: ['2D6 (moderate)'],
      receptors: ['NET', 'SERT (weaker)', 'H1-ant (mild)', 'M1-ant (mild)', 'α1-ant (mild)'],
      sideEffects: ['Dry mouth', 'Constipation', 'Insomnia', 'Tremor', 'Tachycardia', 'Urinary hesitancy', 'Orthostatic hypotension', 'Blurred vision', 'Cardiac conduction changes'],
      blackBox: ['Suicidality in children, adolescents, and young adults (≤24 y)', 'Lethal in overdose', 'Sudden cardiac death in children (use with extreme caution)'],
    },
    {
      name: 'Clomipramine', brand: 'Anafranil', code: 'CLOM', class: 'TCA', group: 'Antidepressants',
      p450sub: ['2D6', '1A2', '2C19', '3A4'], p450inh: ['2D6 (moderate)'],
      receptors: ['SERT', 'NET', 'H1-ant', 'M1-ant', 'α1-ant', '5HT2A-ant'],
      sideEffects: ['Dry mouth', 'Constipation', 'Somnolence', 'Sweating', 'Sexual dysfunction', 'Weight gain', 'Tremor', 'Urinary retention', 'Seizures (higher risk than other TCAs)', 'Cardiac arrhythmia'],
      blackBox: ['Suicidality in children, adolescents, and young adults (≤24 y)', 'Lethal in overdose', 'Seizure risk higher than most TCAs'],
    },
    {
      name: 'Doxepin', brand: 'Sinequan', code: 'DOXE', class: 'TCA', group: 'Antidepressants',
      p450sub: ['2D6', '1A2', '2C19'], p450inh: ['2D6 (weak)'],
      receptors: ['H1-ant (very potent)', 'M1-ant', 'α1-ant', 'SERT', 'NET'],
      sideEffects: ['Profound sedation', 'Dry mouth', 'Constipation', 'Weight gain', 'Orthostatic hypotension', 'Urinary retention', 'Blurred vision', 'Cognitive impairment'],
      blackBox: ['Suicidality in children, adolescents, and young adults (≤24 y)', 'Lethal in overdose'],
    },
    // ── MAOIs ─────────────────────────────────────────────────────────────────
    {
      name: 'Phenelzine', brand: 'Nardil', code: 'PHEN', class: 'MAOI', group: 'Antidepressants',
      p450sub: [], p450inh: ['MAO-A (irreversible)', 'MAO-B (irreversible)'],
      receptors: ['MAO-A-inh', 'MAO-B-inh'],
      sideEffects: ['Orthostatic hypotension', 'Weight gain', 'Sexual dysfunction', 'Insomnia', 'Sedation', 'Edema', 'Pyridoxine deficiency / paresthesias', 'Hypertensive crisis (with tyramine)', 'Serotonin syndrome risk'],
      blackBox: ['Hypertensive crisis with tyramine-rich foods or sympathomimetics', 'Serotonin syndrome with serotonergic agents — potentially fatal'],
    },
    {
      name: 'Tranylcypromine', brand: 'Parnate', code: 'TRAN', class: 'MAOI', group: 'Antidepressants',
      p450sub: [], p450inh: ['MAO-A (irreversible)', 'MAO-B (irreversible)', '2A6'],
      receptors: ['MAO-A-inh', 'MAO-B-inh', 'SERT (amphetamine-like)'],
      sideEffects: ['Insomnia (more stimulating)', 'Orthostatic hypotension', 'Hypertensive crisis (tyramine)', 'Sexual dysfunction', 'Headache', 'Dizziness', 'Serotonin syndrome risk'],
      blackBox: ['Hypertensive crisis with tyramine-rich foods or sympathomimetics', 'Serotonin syndrome with serotonergic agents — potentially fatal'],
    },
    {
      name: 'Selegiline patch', brand: 'Emsam', code: 'SELE', class: 'MAOI', group: 'Antidepressants',
      p450sub: ['2B6', '3A4', '2A6'], p450inh: ['MAO-B (selective at low dose)', 'MAO-A+B (at higher doses)'],
      receptors: ['MAO-B-inh', 'MAO-A-inh (9 mg, 12 mg patches)'],
      sideEffects: ['Application site reaction', 'Insomnia', 'Headache', 'Diarrhea', 'Dry mouth', 'Orthostatic hypotension', 'Hypertensive crisis (≥9 mg — dietary restriction required)'],
      blackBox: ['Suicidality in children, adolescents, and young adults (≤24 y)', 'Hypertensive crisis with tyramine at higher patch doses (≥9 mg/24 hr)'],
    },
    {
      name: 'Isocarboxazid', brand: 'Marplan', code: 'ISOC', class: 'MAOI', group: 'Antidepressants',
      p450sub: [], p450inh: ['MAO-A (irreversible)', 'MAO-B (irreversible)'],
      receptors: ['MAO-A-inh', 'MAO-B-inh'],
      sideEffects: ['Orthostatic hypotension', 'Insomnia', 'Weight gain', 'Sexual dysfunction', 'Headache', 'Dry mouth', 'Dizziness', 'Hypertensive crisis (tyramine)'],
      blackBox: ['Hypertensive crisis with tyramine-rich foods or sympathomimetics', 'Serotonin syndrome with serotonergic agents'],
    },
    // ── 1st-Generation Antipsychotics ─────────────────────────────────────────
    {
      name: 'Haloperidol', brand: 'Haldol', code: 'HALO', class: 'FGA', group: 'Antipsychotics',
      p450sub: ['2D6', '3A4', '1A2'], p450inh: [],
      receptors: ['D2-ant (high)', 'D1-ant', 'α1-ant', 'H1-ant (weak)'],
      sideEffects: ['Acute dystonia', 'Akathisia', 'Parkinsonism / rigidity', 'Tardive dyskinesia', 'NMS risk', 'QTc prolongation (IV route)', 'Hyperprolactinemia', 'Sedation (mild)', 'Orthostatic hypotension (mild)'],
      blackBox: ['Increased mortality in elderly patients with dementia-related psychosis', 'QTc prolongation (especially IV)'],
    },
    {
      name: 'Fluphenazine', brand: 'Prolixin', code: 'FLUP', class: 'FGA', group: 'Antipsychotics',
      p450sub: ['2D6'], p450inh: ['2D6 (weak)'],
      receptors: ['D2-ant', 'D1-ant', 'α1-ant', 'H1-ant'],
      sideEffects: ['Extrapyramidal symptoms', 'Akathisia', 'Tardive dyskinesia', 'NMS risk', 'Hyperprolactinemia', 'QTc prolongation', 'Sedation'],
      blackBox: ['Increased mortality in elderly patients with dementia-related psychosis'],
    },
    {
      name: 'Perphenazine', brand: 'Trilafon', code: 'PERP', class: 'FGA', group: 'Antipsychotics',
      p450sub: ['2D6'], p450inh: ['2D6 (moderate)'],
      receptors: ['D2-ant', 'D1-ant', 'H1-ant', 'M1-ant (mild)', 'α1-ant'],
      sideEffects: ['EPS / akathisia', 'Tardive dyskinesia', 'Sedation', 'Dry mouth', 'Constipation', 'Hyperprolactinemia', 'Orthostatic hypotension'],
      blackBox: ['Increased mortality in elderly patients with dementia-related psychosis'],
    },
    {
      name: 'Chlorpromazine', brand: 'Thorazine', code: 'CHLO', class: 'FGA', group: 'Antipsychotics',
      p450sub: ['2D6', '1A2'], p450inh: ['2D6 (moderate)'],
      receptors: ['D2-ant', 'D1-ant', 'H1-ant', 'M1-ant', 'α1-ant', '5HT2A-ant'],
      sideEffects: ['Sedation (profound)', 'Orthostatic hypotension', 'Dry mouth', 'Constipation', 'Urinary retention', 'Photosensitivity', 'Pigmentary retinopathy (high dose, long-term)', 'EPS / tardive dyskinesia', 'QTc prolongation', 'Weight gain'],
      blackBox: ['Increased mortality in elderly patients with dementia-related psychosis'],
    },
    {
      name: 'Thiothixene', brand: 'Navane', code: 'THIO', class: 'FGA', group: 'Antipsychotics',
      p450sub: ['1A2'], p450inh: [],
      receptors: ['D2-ant', 'D1-ant', 'α1-ant', 'H1-ant (mild)'],
      sideEffects: ['EPS / akathisia', 'Tardive dyskinesia', 'Sedation', 'Hyperprolactinemia', 'QTc prolongation', 'Orthostatic hypotension'],
      blackBox: ['Increased mortality in elderly patients with dementia-related psychosis'],
    },
    {
      name: 'Loxapine', brand: 'Loxitane', code: 'LOXA', class: 'FGA', group: 'Antipsychotics',
      p450sub: ['1A2', '2D6', '3A4'], p450inh: [],
      receptors: ['D2-ant', 'D1-ant', '5HT2A-ant', 'H1-ant', 'M1-ant', 'α1-ant'],
      sideEffects: ['EPS / akathisia', 'Sedation', 'Dry mouth', 'Constipation', 'Hyperprolactinemia', 'QTc prolongation', 'Weight gain'],
      blackBox: ['Increased mortality in elderly patients with dementia-related psychosis', 'Inhaled form (Adasuve): bronchospasm — administer only in medically monitored setting'],
    },
    // ── 2nd-Generation Antipsychotics ─────────────────────────────────────────
    {
      name: 'Risperidone', brand: 'Risperdal', code: 'RISP', class: 'SGA', group: 'Antipsychotics',
      p450sub: ['2D6', '3A4'], p450inh: [],
      receptors: ['D2-ant', 'D3-ant', '5HT2A-ant', 'H1-ant', 'α1-ant', 'α2-ant'],
      sideEffects: ['Hyperprolactinemia (highest among SGAs)', 'EPS (dose-dependent)', 'Weight gain (moderate)', 'Metabolic effects', 'Orthostatic hypotension', 'Sedation', 'QTc prolongation (modest)', 'Sexual dysfunction'],
      blackBox: ['Increased mortality in elderly patients with dementia-related psychosis'],
    },
    {
      name: 'Paliperidone', brand: 'Invega', code: 'PALI', class: 'SGA', group: 'Antipsychotics',
      p450sub: [], p450inh: [],
      receptors: ['D2-ant', 'D3-ant', '5HT2A-ant', 'H1-ant', 'α1-ant', 'α2-ant'],
      sideEffects: ['Hyperprolactinemia', 'EPS (dose-dependent)', 'Weight gain', 'Orthostatic hypotension', 'Tachycardia', 'Sedation', 'Metabolic effects'],
      blackBox: ['Increased mortality in elderly patients with dementia-related psychosis'],
    },
    {
      name: 'Olanzapine', brand: 'Zyprexa', code: 'OLAN', class: 'SGA', group: 'Antipsychotics',
      p450sub: ['1A2', '2D6'], p450inh: [],
      receptors: ['D2-ant', 'D1-ant', '5HT2A-ant', '5HT2C-ant', 'H1-ant (strong)', 'M1-ant', 'α1-ant'],
      sideEffects: ['Weight gain (most among SGAs)', 'Hyperglycemia / diabetes risk', 'Dyslipidemia', 'Sedation', 'Dry mouth', 'Constipation', 'Orthostatic hypotension', 'EPS (low)', 'Metabolic syndrome'],
      blackBox: ['Increased mortality in elderly patients with dementia-related psychosis', 'IM + benzodiazepine combination: fatal respiratory depression risk'],
    },
    {
      name: 'Quetiapine', brand: 'Seroquel', code: 'QUET', class: 'SGA', group: 'Antipsychotics',
      p450sub: ['3A4', '2D6'], p450inh: [],
      receptors: ['H1-ant (potent)', 'α1-ant', '5HT2A-ant', 'D2-ant (transient)', 'D1-ant', 'M1-ant (weak)', '5HT1A-partial'],
      sideEffects: ['Sedation / somnolence', 'Dry mouth', 'Weight gain', 'Orthostatic hypotension', 'Dizziness', 'Constipation', 'Metabolic effects', 'Dyslipidemia', 'Cataract risk (lens opacity)', 'EPS (low)'],
      blackBox: ['Increased mortality in elderly patients with dementia-related psychosis'],
    },
    {
      name: 'Ziprasidone', brand: 'Geodon', code: 'ZIPR', class: 'SGA', group: 'Antipsychotics',
      p450sub: ['3A4', '1A2'], p450inh: [],
      receptors: ['D2-ant', 'D3-ant', '5HT2A-ant', '5HT1A-partial', '5HT1D-ant', 'NET', 'SERT (weak)', 'H1-ant (mild)', 'α1-ant'],
      sideEffects: ['QTc prolongation (most among SGAs)', 'Somnolence', 'Nausea', 'Dizziness', 'EPS', 'Akathisia', 'Constipation', 'Rash', 'Metabolic effects (least weight gain among SGAs)'],
      blackBox: ['Increased mortality in elderly patients with dementia-related psychosis'],
    },
    {
      name: 'Aripiprazole', brand: 'Abilify', code: 'ARIP', class: 'SGA', group: 'Antipsychotics',
      p450sub: ['2D6', '3A4'], p450inh: [],
      receptors: ['D2-partial', 'D3-partial', '5HT2A-ant', '5HT1A-partial', '5HT2B-ant', 'α1-ant (mild)'],
      sideEffects: ['Akathisia', 'Nausea', 'Insomnia', 'Activation / restlessness', 'Headache', 'Constipation', 'Weight gain (moderate)', 'Impulse control disorders (gambling, hypersexuality)'],
      blackBox: ['Increased mortality in elderly patients with dementia-related psychosis', 'Impulse control problems (pathological gambling, hypersexuality, compulsive eating/shopping)'],
    },
    {
      name: 'Asenapine', brand: 'Saphris', code: 'ASEN', class: 'SGA', group: 'Antipsychotics',
      p450sub: ['1A2'], p450inh: ['2D6 (weak)'],
      receptors: ['D2-ant', 'D3-ant', '5HT2A-ant', '5HT2C-ant', 'H1-ant', 'α1-ant', 'α2-ant'],
      sideEffects: ['Somnolence', 'Akathisia', 'EPS', 'Oral hypoesthesia / numbness', 'Weight gain', 'Orthostatic hypotension', 'Dizziness', 'Metabolic effects'],
      blackBox: ['Increased mortality in elderly patients with dementia-related psychosis'],
    },
    {
      name: 'Iloperidone', brand: 'Fanapt', code: 'ILOP', class: 'SGA', group: 'Antipsychotics',
      p450sub: ['2D6', '3A4'], p450inh: [],
      receptors: ['D2-ant', 'D3-ant', '5HT2A-ant', 'α1-ant (strong)', 'α2-ant'],
      sideEffects: ['Orthostatic hypotension (prominent, must titrate slowly)', 'Dizziness', 'QTc prolongation', 'Somnolence', 'Dry mouth', 'Weight gain', 'Tachycardia', 'EPS (low)'],
      blackBox: ['Increased mortality in elderly patients with dementia-related psychosis'],
    },
    {
      name: 'Lurasidone', brand: 'Latuda', code: 'LURA', class: 'SGA', group: 'Antipsychotics',
      p450sub: ['3A4'], p450inh: [],
      receptors: ['D2-ant', 'D3-ant', '5HT2A-ant', '5HT7-ant', '5HT1A-partial', 'α2C-ant', 'NET (weak)'],
      sideEffects: ['Nausea', 'Akathisia', 'EPS / parkinsonism', 'Somnolence', 'Dizziness', 'Weight gain (modest)', 'Metabolic effects (favorable profile)'],
      blackBox: ['Increased mortality in elderly patients with dementia-related psychosis'],
    },
    {
      name: 'Cariprazine', brand: 'Vraylar', code: 'CARI', class: 'SGA', group: 'Antipsychotics',
      p450sub: ['3A4'], p450inh: [],
      receptors: ['D3-partial (high)', 'D2-partial', '5HT2A-ant', '5HT2B-ant', '5HT1A-partial', 'H1-ant (mild)'],
      sideEffects: ['Akathisia (most common)', 'EPS', 'Somnolence', 'Nausea', 'Constipation', 'Weight gain (modest)', 'Vomiting', 'Dizziness', 'Insomnia'],
      blackBox: ['Increased mortality in elderly patients with dementia-related psychosis'],
    },
    {
      name: 'Brexpiprazole', brand: 'Rexulti', code: 'BREX', class: 'SGA', group: 'Antipsychotics',
      p450sub: ['2D6', '3A4'], p450inh: [],
      receptors: ['D2-partial', 'D3-partial', '5HT1A-partial', '5HT2A-ant', 'α1B-ant', 'α2C-ant'],
      sideEffects: ['Weight gain', 'Akathisia (lower than aripiprazole)', 'Somnolence', 'Constipation', 'Headache', 'Increased appetite', 'Nasopharyngitis'],
      blackBox: ['Increased mortality in elderly patients with dementia-related psychosis', 'Impulse control disorders'],
    },
    {
      name: 'Clozapine', brand: 'Clozaril', code: 'CLOZ', class: 'SGA', group: 'Antipsychotics',
      p450sub: ['1A2', '2D6', '3A4', '2C19'], p450inh: [],
      receptors: ['D1-ant', 'D2-ant (loose)', 'D4-ant', '5HT2A-ant', '5HT2C-ant', 'H1-ant', 'M1-ant', 'α1-ant', 'α2-ant'],
      sideEffects: ['Agranulocytosis / neutropenia (requires REMS monitoring)', 'Weight gain (severe)', 'Metabolic syndrome', 'Hypersalivation / drooling', 'Sedation', 'Hypotension', 'Constipation / ileus', 'Seizures (dose-dependent)', 'Myocarditis / cardiomyopathy', 'Fever', 'Tachycardia', 'Enuresis'],
      blackBox: ['Agranulocytosis — REMS program required (weekly ANC monitoring initially)', 'Seizure risk (dose-dependent)', 'Myocarditis / cardiomyopathy', 'Orthostatic hypotension, bradycardia, syncope', 'Increased mortality in elderly with dementia-related psychosis'],
    },
    {
      name: 'Lumateperone', brand: 'Caplyta', code: 'LUMA', class: 'SGA', group: 'Antipsychotics',
      p450sub: ['3A4', '2C8'], p450inh: [],
      receptors: ['D1-phos', 'D2-ant', '5HT2A-ant', 'SERT (60 mg)'],
      sideEffects: ['Somnolence / sedation', 'Dry mouth', 'Dizziness', 'Nausea', 'EPS (minimal)', 'Weight gain (minimal)'],
      blackBox: ['Increased mortality in elderly patients with dementia-related psychosis'],
    },
    // ── Mood Stabilizers ──────────────────────────────────────────────────────
    {
      name: 'Lithium', brand: 'Lithobid', code: 'LITH', class: 'MoodStab', group: 'Mood Stabilizers',
      p450sub: [], p450inh: [],
      receptors: ['GSK3β-inh', 'IP3-inh', 'Neuroprotective'],
      sideEffects: ['Tremor (fine, dose-dependent)', 'Polyuria / polydipsia (NDI)', 'Weight gain', 'Thyroid dysfunction / hypothyroidism', 'Cognitive dulling / memory impairment', 'Nausea / diarrhea (GI upset)', 'Acne / psoriasis exacerbation', 'Hair thinning', 'Renal toxicity (long-term)', 'Toxicity: coarse tremor, ataxia, confusion, seizures'],
      blackBox: ['Lithium toxicity — narrow therapeutic index (therapeutic level 0.6–1.2 mEq/L); toxicity possible at levels >1.5 mEq/L'],
    },
    {
      name: 'Valproate / Divalproex', brand: 'Depakote', code: 'VALP', class: 'MoodStab', group: 'Mood Stabilizers',
      p450sub: ['2C9', '2C19 (minor)'], p450inh: ['2C9 (moderate)', 'UGT (glucuronidation)'],
      receptors: ['Na-channel-inh', 'GABA-enhance', 'HDACs-inh'],
      sideEffects: ['Weight gain', 'Sedation', 'Tremor', 'Hair loss', 'Nausea / GI upset', 'Thrombocytopenia', 'Transaminase elevation', 'Cognitive effects', 'Polycystic ovary syndrome risk', 'Neural tube defects (teratogen)'],
      blackBox: ['Hepatotoxicity — fatal cases reported (especially in children <2 y on polytherapy)', 'Pancreatitis — potentially life-threatening', 'Teratogenicity — neural tube defects (spina bifida); contraindicated in pregnancy for migraine prophylaxis'],
    },
    {
      name: 'Lamotrigine', brand: 'Lamictal', code: 'LAMO', class: 'MoodStab', group: 'Mood Stabilizers',
      p450sub: ['UGT1A4', 'UGT2B7'], p450inh: [],
      receptors: ['Na-channel-inh', 'Ca-channel-inh (N, P)'],
      sideEffects: ['Headache', 'Diplopia / blurred vision', 'Dizziness', 'Ataxia', 'Nausea', 'Insomnia', 'Rash (must titrate slowly)', 'Stevens-Johnson syndrome (rare)', 'Tremor'],
      blackBox: ['Stevens-Johnson syndrome / toxic epidermal necrolysis — risk highest with rapid titration or co-administration with valproate'],
    },
    {
      name: 'Carbamazepine', brand: 'Tegretol', code: 'CARB', class: 'MoodStab', group: 'Mood Stabilizers',
      p450sub: ['3A4', '2C8'], p450inh: [],
      p450ind: ['3A4 (strong)', '2C9', '2C19', '1A2', 'UGT'],
      receptors: ['Na-channel-inh'],
      sideEffects: ['Diplopia', 'Dizziness / ataxia', 'Sedation', 'Nausea', 'Hyponatremia (SIADH)', 'Aplastic anemia / agranulocytosis (rare)', 'Stevens-Johnson syndrome', 'Drug interactions (strong inducer)', 'Cognitive effects'],
      blackBox: ['Aplastic anemia and agranulocytosis — fatal cases reported', 'Stevens-Johnson syndrome / toxic epidermal necrolysis (especially in HLA-B*1502 carriers — screen in Asian patients)', 'Serious dermatologic reactions'],
    },
    {
      name: 'Oxcarbazepine', brand: 'Trileptal', code: 'OXCA', class: 'MoodStab', group: 'Mood Stabilizers',
      p450sub: ['3A4 (MHD metabolite)'], p450inh: ['2C19 (moderate)'],
      p450ind: ['3A4 (moderate)', '3A5'],
      receptors: ['Na-channel-inh'],
      sideEffects: ['Hyponatremia (more common than carbamazepine)', 'Dizziness', 'Somnolence', 'Diplopia', 'Nausea', 'Ataxia', 'Rash', 'Stevens-Johnson syndrome (lower risk than CBZ)'],
      blackBox: ['Stevens-Johnson syndrome / toxic epidermal necrolysis (especially HLA-B*1502 carriers)'],
    },
    // ── Benzodiazepines ───────────────────────────────────────────────────────
    {
      name: 'Clonazepam', brand: 'Klonopin', code: 'KLNZ', class: 'BZD', group: 'Anxiolytics / Hypnotics',
      p450sub: ['3A4'], p450inh: [],
      receptors: ['GABA-A-pos'],
      sideEffects: ['Sedation / somnolence', 'Cognitive impairment / memory problems', 'Ataxia', 'Paradoxical agitation (esp. elderly)', 'Dependence', 'Rebound anxiety', 'Depression', 'Respiratory depression'],
      blackBox: ['Concomitant use with opioids: respiratory depression, coma, death', 'Physical dependence and withdrawal — abrupt discontinuation can cause seizures'],
    },
    {
      name: 'Lorazepam', brand: 'Ativan', code: 'LORA', class: 'BZD', group: 'Anxiolytics / Hypnotics',
      p450sub: [], p450inh: [],
      receptors: ['GABA-A-pos'],
      sideEffects: ['Sedation', 'Amnesia', 'Respiratory depression', 'Dependence', 'Ataxia', 'Cognitive impairment', 'Paradoxical disinhibition', 'Hypotension (IV)'],
      blackBox: ['Concomitant use with opioids: respiratory depression, coma, death', 'Physical dependence and withdrawal'],
    },
    {
      name: 'Diazepam', brand: 'Valium', code: 'DIAZ', class: 'BZD', group: 'Anxiolytics / Hypnotics',
      p450sub: ['2C19', '3A4', '2C9'], p450inh: [],
      receptors: ['GABA-A-pos'],
      sideEffects: ['Prolonged sedation (long half-life)', 'Cognitive impairment', 'Ataxia', 'Dependence', 'Anterograde amnesia', 'Rebound anxiety', 'Respiratory depression'],
      blackBox: ['Concomitant use with opioids: respiratory depression, coma, death', 'Physical dependence and withdrawal — potentially life-threatening seizures'],
    },
    {
      name: 'Alprazolam', brand: 'Xanax', code: 'ALPR', class: 'BZD', group: 'Anxiolytics / Hypnotics',
      p450sub: ['3A4'], p450inh: [],
      receptors: ['GABA-A-pos'],
      sideEffects: ['Sedation', 'Dependence (high abuse potential)', 'Cognitive impairment', 'Rebound anxiety (short half-life)', 'Ataxia', 'Paradoxical disinhibition', 'Respiratory depression'],
      blackBox: ['Concomitant use with opioids: respiratory depression, coma, death', 'Abuse, misuse, and addiction', 'Dependence, withdrawal (seizures), and rebound'],
    },
    {
      name: 'Temazepam', brand: 'Restoril', code: 'TEMA', class: 'BZD', group: 'Anxiolytics / Hypnotics',
      p450sub: ['UGT'], p450inh: [],
      receptors: ['GABA-A-pos'],
      sideEffects: ['Sedation', 'Hangover effect', 'Cognitive impairment', 'Dependence', 'Rebound insomnia', 'Ataxia'],
      blackBox: ['Concomitant use with opioids: respiratory depression, coma, death', 'Dependence and withdrawal'],
    },
    // ── Non-BZD Hypnotics ─────────────────────────────────────────────────────
    {
      name: 'Zolpidem', brand: 'Ambien', code: 'ZOLP', class: 'Hypnotic', group: 'Anxiolytics / Hypnotics',
      p450sub: ['3A4', '2C9'], p450inh: [],
      receptors: ['GABA-A-pos (α1 selective)'],
      sideEffects: ['Somnolence', 'Headache', 'Dizziness', 'Complex sleep behaviors (sleepwalking, driving)', 'Next-day impairment', 'Anterograde amnesia', 'Dependence', 'Rebound insomnia'],
      blackBox: ['Complex sleep behaviors (sleepwalking, sleep-driving, etc.) — some resulting in injury and death', 'Respiratory depression in patients with compromised respiratory function'],
    },
    {
      name: 'Eszopiclone', brand: 'Lunesta', code: 'ESZP', class: 'Hypnotic', group: 'Anxiolytics / Hypnotics',
      p450sub: ['3A4', '2E1'], p450inh: [],
      receptors: ['GABA-A-pos'],
      sideEffects: ['Unpleasant taste (metallic / bitter)', 'Somnolence', 'Headache', 'Dizziness', 'Respiratory infection', 'Next-day impairment', 'Complex sleep behaviors', 'Dependence'],
      blackBox: ['Complex sleep behaviors — some resulting in injury and death'],
    },
    {
      name: 'Zaleplon', brand: 'Sonata', code: 'ZALE', class: 'Hypnotic', group: 'Anxiolytics / Hypnotics',
      p450sub: ['3A4', 'aldehyde oxidase'], p450inh: [],
      receptors: ['GABA-A-pos (α1 selective)'],
      sideEffects: ['Headache', 'Dizziness', 'Somnolence', 'Nausea', 'Amnesia', 'Complex sleep behaviors', 'Dependence'],
      blackBox: ['Complex sleep behaviors — some resulting in injury and death'],
    },
    {
      name: 'Suvorexant', brand: 'Belsomra', code: 'SUVO', class: 'Hypnotic', group: 'Anxiolytics / Hypnotics',
      p450sub: ['3A4'], p450inh: [],
      receptors: ['OX1R-ant', 'OX2R-ant'],
      sideEffects: ['Somnolence', 'Headache', 'Dizziness', 'Abnormal dreams', 'Next-day impairment', 'Sleep paralysis', 'Cataplexy-like symptoms', 'Worsening depression'],
      blackBox: ['Next-day impairment of driving and other activities — do not drive until fully awake'],
    },
    {
      name: 'Lemborexant', brand: 'Dayvigo', code: 'LEMB', class: 'Hypnotic', group: 'Anxiolytics / Hypnotics',
      p450sub: ['3A4'], p450inh: [],
      receptors: ['OX1R-ant', 'OX2R-ant'],
      sideEffects: ['Somnolence', 'Headache', 'Fatigue', 'Nightmares', 'Next-day impairment', 'Sleep paralysis'],
      blackBox: ['Next-day impairment of driving and other activities'],
    },
    // ── Other Anxiolytics ─────────────────────────────────────────────────────
    {
      name: 'Buspirone', brand: 'Buspar', code: 'BUSP', class: 'Azapirone', group: 'Anxiolytics / Hypnotics',
      p450sub: ['3A4'], p450inh: [],
      receptors: ['5HT1A-partial', 'D2-partial (weak)'],
      sideEffects: ['Dizziness', 'Nausea', 'Headache', 'Nervousness', 'Lightheadedness', 'Insomnia', 'Fatigue'],
      blackBox: [],
    },
    {
      name: 'Hydroxyzine', brand: 'Vistaril', code: 'HYDR', class: 'Antihistamine', group: 'Anxiolytics / Hypnotics',
      p450sub: ['2D6 (minor)', '3A4 (minor)'], p450inh: [],
      receptors: ['H1-ant', 'M1-ant (mild)'],
      sideEffects: ['Sedation', 'Dry mouth', 'Dizziness', 'Constipation', 'Blurred vision', 'QTc prolongation (at high doses)', 'Next-day hangover'],
      blackBox: [],
    },
    // ── Stimulants ────────────────────────────────────────────────────────────
    {
      name: 'Amphetamine salts', brand: 'Adderall', code: 'AMPH', class: 'Stimulant', group: 'Stimulants / ADHD',
      p450sub: ['2D6'], p450inh: [],
      receptors: ['DAT-release', 'NET-release', 'SERT-release (weak)'],
      sideEffects: ['Decreased appetite', 'Insomnia', 'Dry mouth', 'Headache', 'Irritability / emotional lability', 'Elevated BP / HR', 'Abdominal pain', 'Growth suppression', 'Tic exacerbation', 'Anxiety / nervousness'],
      blackBox: ['High abuse potential — schedule II; misuse may lead to serious cardiovascular events or sudden death', 'Serious cardiovascular events in patients with pre-existing cardiac disease'],
    },
    {
      name: 'Lisdexamfetamine', brand: 'Vyvanse', code: 'LISD', class: 'Stimulant', group: 'Stimulants / ADHD',
      p450sub: ['(prodrug cleaved to d-amphetamine)'], p450inh: [],
      receptors: ['DAT-release', 'NET-release'],
      sideEffects: ['Decreased appetite', 'Insomnia', 'Dry mouth', 'Headache', 'Elevated BP / HR', 'Irritability', 'Abdominal discomfort', 'Weight loss', 'Anxiety'],
      blackBox: ['High abuse potential — schedule II', 'Serious cardiovascular events'],
    },
    {
      name: 'Dextroamphetamine', brand: 'Dexedrine', code: 'DEXT', class: 'Stimulant', group: 'Stimulants / ADHD',
      p450sub: ['2D6'], p450inh: [],
      receptors: ['DAT-release', 'NET-release'],
      sideEffects: ['Insomnia', 'Decreased appetite', 'Dry mouth', 'Headache', 'Elevated BP / HR', 'Irritability', 'Tics', 'Weight loss'],
      blackBox: ['High abuse potential — schedule II', 'Serious cardiovascular events'],
    },
    {
      name: 'Methylphenidate', brand: 'Ritalin / Concerta', code: 'MPHI', class: 'Stimulant', group: 'Stimulants / ADHD',
      p450sub: ['(carboxylesterase — not CYP)'], p450inh: [],
      receptors: ['DAT-block', 'NET-block'],
      sideEffects: ['Decreased appetite', 'Insomnia', 'Headache', 'Abdominal pain', 'Elevated BP / HR', 'Irritability', 'Mood lability', 'Growth suppression', 'Tics', 'Dry mouth'],
      blackBox: ['High abuse potential — schedule II', 'Serious cardiovascular events in patients with cardiac disease'],
    },
    {
      name: 'Dexmethylphenidate', brand: 'Focalin', code: 'DEXM', class: 'Stimulant', group: 'Stimulants / ADHD',
      p450sub: ['(carboxylesterase)'], p450inh: [],
      receptors: ['DAT-block', 'NET-block'],
      sideEffects: ['Decreased appetite', 'Insomnia', 'Headache', 'Stomach pain', 'Elevated BP / HR', 'Irritability', 'Nervousness'],
      blackBox: ['High abuse potential — schedule II'],
    },
    // ── Non-Stimulant ADHD ────────────────────────────────────────────────────
    {
      name: 'Atomoxetine', brand: 'Strattera', code: 'ATOM', class: 'NonstimADHD', group: 'Stimulants / ADHD',
      p450sub: ['2D6'], p450inh: [],
      receptors: ['NET-block'],
      sideEffects: ['Decreased appetite', 'Nausea / vomiting', 'Dry mouth', 'Constipation', 'Fatigue', 'Insomnia', 'Irritability', 'Sexual dysfunction', 'Urinary hesitancy', 'Increased BP / HR'],
      blackBox: ['Suicidality in children and adolescents', 'Severe hepatic injury (rare but serious)'],
    },
    {
      name: 'Viloxazine', brand: 'Qelbree', code: 'VILO', class: 'NonstimADHD', group: 'Stimulants / ADHD',
      p450sub: ['1A2 (minor)'], p450inh: ['1A2 (moderate)'],
      receptors: ['NET-block', '5HT2B-ant', '5HT2C-ant', '5HT7-ant'],
      sideEffects: ['Somnolence', 'Decreased appetite', 'Nausea', 'Vomiting', 'Headache', 'QTc prolongation', 'Irritability', 'Fatigue'],
      blackBox: ['Suicidality in children, adolescents, and young adults'],
    },
    {
      name: 'Guanfacine ER', brand: 'Intuniv', code: 'GUAN', class: 'NonstimADHD', group: 'Stimulants / ADHD',
      p450sub: ['3A4'], p450inh: [],
      receptors: ['α2A-agonist'],
      sideEffects: ['Somnolence / sedation', 'Hypotension', 'Bradycardia', 'Dizziness', 'Dry mouth', 'Constipation', 'Rebound hypertension on abrupt stop', 'Fatigue'],
      blackBox: [],
    },
    {
      name: 'Clonidine ER', brand: 'Kapvay', code: 'CLNR', class: 'NonstimADHD', group: 'Stimulants / ADHD',
      p450sub: ['2D6 (minor)'], p450inh: [],
      receptors: ['α2A-agonist', 'α2B-agonist', 'imidazoline-R'],
      sideEffects: ['Sedation (prominent)', 'Hypotension', 'Dizziness', 'Dry mouth', 'Constipation', 'Bradycardia', 'Rebound hypertension on abrupt stop'],
      blackBox: [],
    },
    // ── SUD / Other ───────────────────────────────────────────────────────────
    {
      name: 'Naltrexone', brand: 'Vivitrol', code: 'NALT', class: 'SUD', group: 'SUD / Other',
      p450sub: [], p450inh: [],
      receptors: ['μ-opioid-ant', 'κ-opioid-ant', 'δ-opioid-ant'],
      sideEffects: ['Nausea', 'Vomiting', 'Decreased appetite', 'Abdominal pain', 'Fatigue', 'Headache', 'Injection site reactions (IM)', 'Insomnia', 'Anxiety', 'Liver enzyme elevation'],
      blackBox: ['Hepatotoxicity at supratherapeutic doses — monitor LFTs; contraindicated in acute hepatitis or liver failure', 'Opioid withdrawal precipitation if opioids taken recently'],
    },
    {
      name: 'Acamprosate', brand: 'Campral', code: 'ACAM', class: 'SUD', group: 'SUD / Other',
      p450sub: [], p450inh: [],
      receptors: ['NMDA-mod', 'GABA-A-mod'],
      sideEffects: ['Diarrhea', 'Nausea', 'Flatulence', 'Anxiety', 'Insomnia', 'Dizziness', 'Weakness'],
      blackBox: [],
    },
    {
      name: 'Disulfiram', brand: 'Antabuse', code: 'DISU', class: 'SUD', group: 'SUD / Other',
      p450sub: ['2E1 (inhibitor)'], p450inh: ['2E1', '2C9', '2C19', '3A4 (mild)'],
      receptors: ['ALDH-inh'],
      sideEffects: ['Disulfiram-alcohol reaction (flushing, nausea, vomiting, hypotension — severe)', 'Hepatotoxicity', 'Peripheral neuropathy', 'Optic neuritis', 'Psychosis (rare)', 'Drowsiness', 'Headache', 'Metallic/garlic aftertaste'],
      blackBox: ['Disulfiram-alcohol reaction — can be fatal at high alcohol doses; patient must abstain from alcohol in any form'],
    },
    {
      name: 'Buprenorphine / Naloxone', brand: 'Suboxone', code: 'BUPE', class: 'SUD', group: 'SUD / Other',
      p450sub: ['3A4', '2C8'], p450inh: [],
      receptors: ['μ-opioid-partial', 'κ-opioid-ant', 'ORL1-agonist'],
      sideEffects: ['Constipation', 'Headache', 'Nausea', 'Insomnia', 'Sweating', 'Peripheral edema', 'Dental caries (sublingual)', 'QTc prolongation (high dose)', 'Respiratory depression (rare at therapeutic dose with naloxone)'],
      blackBox: ['Risk of addiction, abuse, and misuse', 'Life-threatening respiratory depression', 'Neonatal opioid withdrawal syndrome', 'Risks from concomitant use with CNS depressants', 'Serious harm or death from diversion / injection (naloxone component)', 'Adrenal insufficiency'],
    },
    {
      name: 'Varenicline', brand: 'Chantix', code: 'VARE', class: 'SUD', group: 'SUD / Other',
      p450sub: [], p450inh: [],
      receptors: ['nAChR-α4β2-partial'],
      sideEffects: ['Nausea (most common)', 'Vivid dreams / abnormal dreams', 'Insomnia', 'Headache', 'Constipation', 'Vomiting', 'Flatulence', 'Mood changes / depression', 'Irritability', 'Suicidal ideation'],
      blackBox: ['Serious neuropsychiatric events — depression, suicidality, aggressive behavior, psychosis (though FDA later revised — risk lower than originally thought)'],
    },
    {
      name: 'Gabapentin', brand: 'Neurontin', code: 'GABA', class: 'SUD', group: 'SUD / Other',
      p450sub: [], p450inh: [],
      receptors: ['α2δ-VGCCsub-inh'],
      sideEffects: ['Somnolence / sedation', 'Dizziness', 'Ataxia', 'Fatigue', 'Peripheral edema', 'Weight gain', 'Cognitive impairment', 'Blurred vision', 'Abuse potential (emerging concern)'],
      blackBox: ['Respiratory depression — risk increased with opioids, CNS depressants, or respiratory compromise'],
    },
    {
      name: 'Prazosin', brand: 'Minipress', code: 'PRAZ', class: 'SUD', group: 'SUD / Other',
      p450sub: ['3A4', '2D6'], p450inh: [],
      receptors: ['α1-ant'],
      sideEffects: ['First-dose orthostatic hypotension / syncope', 'Dizziness', 'Headache', 'Fatigue', 'Drowsiness', 'Palpitations', 'Dry mouth'],
      blackBox: [],
    },
  ];

  // Group meds by group → class
  const GROUPS = {};
  MEDS.forEach(m => {
    if (!GROUPS[m.group]) GROUPS[m.group] = {};
    if (!GROUPS[m.group][m.class]) GROUPS[m.group][m.class] = [];
    GROUPS[m.group][m.class].push(m);
  });

  // Build code → med lookup
  const MED_BY_CODE = {};
  MEDS.forEach(m => { MED_BY_CODE[m.code] = m; });

  // ─── State ──────────────────────────────────────────────────────────────────
  // medState[code] = { tried, exp, year, len, reason, se: [bool,...] }
  const medState = {};
  MEDS.forEach(m => {
    medState[m.code] = { tried: false, exp: '', year: '', len: '', reason: '', se: new Array(m.sideEffects.length).fill(false) };
  });

  // ─── Build Form HTML ────────────────────────────────────────────────────────
  function buildForm() {
    const container = document.getElementById('mh-form-container');
    if (!container) return;
    let html = '';

    const groupOrder = ['Antidepressants', 'Antipsychotics', 'Mood Stabilizers', 'Anxiolytics / Hypnotics', 'Stimulants / ADHD', 'SUD / Other'];

    groupOrder.forEach(groupName => {
      if (!GROUPS[groupName]) return;
      html += `<div class="mh-group">
        <h3 class="mh-group-title">${groupName}</h3>`;

      Object.entries(GROUPS[groupName]).forEach(([className, meds]) => {
        const cw = CLASS_WARNINGS[className] || [];
        html += `<div class="mh-class">
          <h4 class="mh-class-title">${className}</h4>`;
        if (cw.length) {
          html += `<div class="mh-class-warnings">
            <span class="mh-cw-label">Class considerations:</span> ${cw.join(' &bull; ')}
          </div>`;
        }
        meds.forEach(med => {
          html += buildMedCard(med);
        });
        html += `</div>`;
      });

      html += `</div>`;
    });

    container.innerHTML = html;
    attachListeners();
  }

  function buildMedCard(med) {
    const se = med.sideEffects.map((fx, i) =>
      `<label class="mh-se-label">
        <input type="checkbox" class="mh-se" data-code="${med.code}" data-idx="${i}">
        <span>${fx}</span>
      </label>`
    ).join('');

    const bbHtml = med.blackBox.length
      ? `<div class="mh-bb"><span class="mh-bb-label">⬛ Black Box:</span> ${med.blackBox.join(' | ')}</div>`
      : '';

    return `
    <div class="mh-med-card" id="mhcard-${med.code}">
      <div class="mh-med-header">
        <label class="mh-tried-label">
          <input type="checkbox" class="mh-tried" data-code="${med.code}">
          <span class="mh-med-name">${med.name}</span>
          <span class="mh-med-brand">(${med.brand})</span>
        </label>
        <span class="mh-tried-text">Tried?</span>
      </div>
      <div class="mh-med-body" id="mhbody-${med.code}" style="display:none">
        ${bbHtml}
        <div class="mh-fields-row">
          <div class="mh-field">
            <label class="mh-field-label">Experience</label>
            <div class="mh-radio-group">
              <label><input type="radio" name="exp-${med.code}" class="mh-exp" data-code="${med.code}" value="good"> Good</label>
              <label><input type="radio" name="exp-${med.code}" class="mh-exp" data-code="${med.code}" value="neutral"> Neutral</label>
              <label><input type="radio" name="exp-${med.code}" class="mh-exp" data-code="${med.code}" value="bad"> Bad</label>
            </div>
          </div>
          <div class="mh-field">
            <label class="mh-field-label">Year tried</label>
            <select class="mh-year" data-code="${med.code}">
              <option value="">—</option>
              ${yearOptions()}
            </select>
          </div>
          <div class="mh-field">
            <label class="mh-field-label">Length of use</label>
            <div class="mh-radio-group">
              <label><input type="radio" name="len-${med.code}" class="mh-len" data-code="${med.code}" value="weeks"> Weeks</label>
              <label><input type="radio" name="len-${med.code}" class="mh-len" data-code="${med.code}" value="months"> Months</label>
              <label><input type="radio" name="len-${med.code}" class="mh-len" data-code="${med.code}" value="years"> Years</label>
              <label><input type="radio" name="len-${med.code}" class="mh-len" data-code="${med.code}" value="still taking"> Still taking</label>
            </div>
          </div>
          <div class="mh-field">
            <label class="mh-field-label">Reason stopped</label>
            <div class="mh-radio-group">
              <label><input type="radio" name="reason-${med.code}" class="mh-reason" data-code="${med.code}" value="stopped working"> Stopped working</label>
              <label><input type="radio" name="reason-${med.code}" class="mh-reason" data-code="${med.code}" value="side effect"> Side effect</label>
              <label><input type="radio" name="reason-${med.code}" class="mh-reason" data-code="${med.code}" value="cant recall"> Can't recall</label>
              <label><input type="radio" name="reason-${med.code}" class="mh-reason" data-code="${med.code}" value="still taking"> Still taking</label>
            </div>
          </div>
        </div>
        <div class="mh-se-section">
          <div class="mh-se-label-hdr">Side effects experienced:</div>
          <div class="mh-se-grid">${se}</div>
        </div>
      </div>
    </div>`;
  }

  function yearOptions() {
    let opts = '';
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= 1970; y--) {
      opts += `<option value="${y}">${y}</option>`;
    }
    return opts;
  }

  // ─── Event Listeners ────────────────────────────────────────────────────────
  function attachListeners() {
    document.querySelectorAll('.mh-tried').forEach(cb => {
      cb.addEventListener('change', function () {
        const code = this.dataset.code;
        medState[code].tried = this.checked;
        const body = document.getElementById('mhbody-' + code);
        if (body) body.style.display = this.checked ? 'block' : 'none';
        const card = document.getElementById('mhcard-' + code);
        if (card) card.classList.toggle('mh-card-active', this.checked);
      });
    });
    document.querySelectorAll('.mh-exp').forEach(r => {
      r.addEventListener('change', function () {
        medState[this.dataset.code].exp = this.value;
      });
    });
    document.querySelectorAll('.mh-year').forEach(s => {
      s.addEventListener('change', function () {
        medState[this.dataset.code].year = this.value;
      });
    });
    document.querySelectorAll('.mh-len').forEach(r => {
      r.addEventListener('change', function () {
        medState[this.dataset.code].len = this.value;
      });
    });
    document.querySelectorAll('.mh-reason').forEach(r => {
      r.addEventListener('change', function () {
        medState[this.dataset.code].reason = this.value;
      });
    });
    document.querySelectorAll('.mh-se').forEach(cb => {
      cb.addEventListener('change', function () {
        const code = this.dataset.code;
        const idx = parseInt(this.dataset.idx, 10);
        medState[code].se[idx] = this.checked;
      });
    });
  }

  // ─── Restore Code ───────────────────────────────────────────────────────────
  function encodeState() {
    const triedMeds = {};
    MEDS.forEach(m => {
      const s = medState[m.code];
      if (!s.tried) return;
      triedMeds[m.code] = {
        e: s.exp ? s.exp[0] : '-',   // g/n/b/-
        y: s.year || '-',
        l: s.len ? s.len[0] : '-',   // w/m/y/s/-
        r: s.reason === 'stopped working' ? 'S' : s.reason === 'side effect' ? 'E' : s.reason === 'cant recall' ? 'C' : s.reason === 'still taking' ? 'T' : '-',
        se: s.se.map(v => v ? '1' : '0').join(''),
      };
    });
    const json = JSON.stringify(triedMeds);
    try {
      return 'PREF1:' + btoa(unescape(encodeURIComponent(json)));
    } catch (e) {
      return 'PREF1:' + btoa(json);
    }
  }

  function decodeState(code) {
    if (!code || !code.startsWith('PREF1:')) return false;
    try {
      const b64 = code.slice(6);
      const json = decodeURIComponent(escape(atob(b64)));
      const data = JSON.parse(json);
      Object.entries(data).forEach(([medCode, s]) => {
        const med = MED_BY_CODE[medCode];
        const state = medState[medCode];
        if (!med || !state) return;
        state.tried = true;
        state.exp = s.e === 'g' ? 'good' : s.e === 'n' ? 'neutral' : s.e === 'b' ? 'bad' : '';
        state.year = s.y === '-' ? '' : s.y;
        state.len = s.l === 'w' ? 'weeks' : s.l === 'm' ? 'months' : s.l === 'y' ? 'years' : s.l === 's' ? 'still taking' : '';
        state.reason = s.r === 'S' ? 'stopped working' : s.r === 'E' ? 'side effect' : s.r === 'C' ? 'cant recall' : s.r === 'T' ? 'still taking' : '';
        if (s.se && s.se.length) {
          s.se.split('').forEach((v, i) => {
            if (state.se[i] !== undefined) state.se[i] = v === '1';
          });
        }
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  function applyStateToForm() {
    MEDS.forEach(med => {
      const s = medState[med.code];
      // tried checkbox
      const triedCb = document.querySelector(`.mh-tried[data-code="${med.code}"]`);
      if (triedCb) {
        triedCb.checked = s.tried;
        const body = document.getElementById('mhbody-' + med.code);
        if (body) body.style.display = s.tried ? 'block' : 'none';
        const card = document.getElementById('mhcard-' + med.code);
        if (card) card.classList.toggle('mh-card-active', s.tried);
      }
      if (!s.tried) return;
      // exp radio
      if (s.exp) {
        const r = document.querySelector(`.mh-exp[data-code="${med.code}"][value="${s.exp}"]`);
        if (r) r.checked = true;
      }
      // year select
      if (s.year) {
        const sel = document.querySelector(`.mh-year[data-code="${med.code}"]`);
        if (sel) sel.value = s.year;
      }
      // len radio
      if (s.len) {
        const r = document.querySelector(`.mh-len[data-code="${med.code}"][value="${s.len}"]`);
        if (r) r.checked = true;
      }
      // reason radio
      if (s.reason) {
        const r = document.querySelector(`.mh-reason[data-code="${med.code}"][value="${s.reason}"]`);
        if (r) r.checked = true;
      }
      // side effects
      s.se.forEach((checked, i) => {
        if (checked) {
          const cb = document.querySelector(`.mh-se[data-code="${med.code}"][data-idx="${i}"]`);
          if (cb) cb.checked = true;
        }
      });
    });
  }

  // ─── Report Generation ──────────────────────────────────────────────────────
  function generateReport() {
    const triedMeds = MEDS.filter(m => medState[m.code].tried);
    if (!triedMeds.length) {
      alert('No medications marked as tried. Please indicate which medications you have tried.');
      return '';
    }

    const lines = [];
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    lines.push('PSYCHIATRIC MEDICATION HISTORY');
    lines.push('Generated: ' + dateStr);
    lines.push('='.repeat(60));
    lines.push('');

    let currentGroup = '';
    triedMeds.forEach(med => {
      const s = medState[med.code];
      if (med.group !== currentGroup) {
        currentGroup = med.group;
        lines.push('── ' + currentGroup.toUpperCase() + ' ──');
        lines.push('');
      }
      lines.push(med.name + ' (' + med.brand + ')  [' + med.class + ']');
      lines.push('  Experience:    ' + (s.exp ? s.exp.charAt(0).toUpperCase() + s.exp.slice(1) : 'Not reported'));
      lines.push('  Year tried:    ' + (s.year || 'Not reported'));
      lines.push('  Length of use: ' + (s.len ? s.len.charAt(0).toUpperCase() + s.len.slice(1) : 'Not reported'));
      lines.push('  Reason stopped:' + (s.reason ? ' ' + s.reason.charAt(0).toUpperCase() + s.reason.slice(1) : ' Not reported'));
      const checkedSE = med.sideEffects.filter((_, i) => s.se[i]);
      if (checkedSE.length) {
        lines.push('  Side effects:  ' + checkedSE.join(', '));
      }
      if (med.blackBox.length) {
        lines.push('  [Black Box]:   ' + med.blackBox.join(' | '));
      }
      lines.push('');
    });

    // ── Overlap Analysis ──
    const failedTrials = triedMeds.filter(m => {
      const s = medState[m.code];
      return s.reason === 'stopped working' || s.reason === 'side effect';
    });

    if (failedTrials.length >= 2) {
      lines.push('='.repeat(60));
      lines.push('FAILED TRIAL ANALYSIS — RECEPTOR & METABOLIC OVERLAP');
      lines.push('='.repeat(60));
      lines.push('');
      lines.push('Failed / discontinued trials (' + failedTrials.length + '):');
      failedTrials.forEach(m => {
        lines.push('  • ' + m.name + ' (' + m.brand + ') — ' + medState[m.code].reason);
      });
      lines.push('');

      const overlapReport = analyzeOverlap(failedTrials);
      overlapReport.forEach(l => lines.push(l));
    }

    lines.push('='.repeat(60));
    lines.push('PPrefMedlist');
    lines.push('');

    return lines.join('\n');
  }

  // ─── Overlap Analysis ───────────────────────────────────────────────────────
  function analyzeOverlap(failedMeds) {
    const results = [];

    // Receptor overlap
    const receptorMap = {};
    failedMeds.forEach(med => {
      (med.receptors || []).forEach(rec => {
        const key = rec.replace(/-ant$|-agonist$|-partial$|-block$|-release$|-pos$|-inh$|-mod$|-phos$|-enhance$/, '').trim();
        if (!receptorMap[key]) receptorMap[key] = [];
        receptorMap[key].push(med.name);
      });
    });

    const receptorSignals = Object.entries(receptorMap)
      .filter(([, meds]) => meds.length >= 2)
      .sort((a, b) => b[1].length - a[1].length);

    if (receptorSignals.length) {
      results.push('RECEPTOR OVERLAP SIGNALS:');
      receptorSignals.forEach(([rec, meds]) => {
        results.push('  ' + rec + ' (' + meds.length + ' failed trials): ' + meds.join(', '));
        results.push('  → Multiple failed trials targeting ' + rec + ' may indicate poor individual response to this mechanism.');
      });
      results.push('');
    }

    // CYP substrate overlap
    const p450Map = {};
    failedMeds.forEach(med => {
      (med.p450sub || []).forEach(enz => {
        const key = enz.replace(/\s*\(.*?\)/, '').trim();
        if (!key || key.startsWith('(') || key.length < 3) return;
        if (!p450Map[key]) p450Map[key] = [];
        p450Map[key].push(med.name);
      });
    });

    const p450Signals = Object.entries(p450Map)
      .filter(([, meds]) => meds.length >= 2)
      .sort((a, b) => b[1].length - a[1].length);

    if (p450Signals.length) {
      results.push('CYP P450 METABOLIC OVERLAP:');
      p450Signals.forEach(([enz, meds]) => {
        results.push('  CYP' + enz + ' substrates (' + meds.length + ' failed trials): ' + meds.join(', '));
        results.push('  → Consider CYP' + enz + ' phenotype (poor/ultra-rapid metabolizer) as contributor to suboptimal response or tolerability.');
      });
      results.push('');
    }

    // Inhibitor signals
    const inhMap = {};
    failedMeds.forEach(med => {
      (med.p450inh || []).forEach(enz => {
        const key = enz.replace(/\s*\(.*?\)/, '').trim();
        if (!key || key.length < 3) return;
        if (!inhMap[key]) inhMap[key] = [];
        inhMap[key].push(med.name);
      });
    });

    const inhSignals = Object.entries(inhMap)
      .filter(([, meds]) => meds.length >= 2)
      .sort((a, b) => b[1].length - a[1].length);

    if (inhSignals.length) {
      results.push('P450 INHIBITOR OVERLAP (drug interactions):');
      inhSignals.forEach(([enz, meds]) => {
        results.push('  CYP' + enz + ' inhibitors (' + meds.length + ' failed trials): ' + meds.join(', '));
        results.push('  → Co-administration of these agents would significantly raise CYP' + enz + ' substrate levels.');
      });
      results.push('');
    }

    // Side effect category overlap for "side effect" discontinuations
    const seFails = failedMeds.filter(m => medState[m.code].reason === 'side effect');
    if (seFails.length >= 2) {
      const reportedSEByMed = {};
      seFails.forEach(med => {
        const s = medState[med.code];
        reportedSEByMed[med.name] = med.sideEffects.filter((_, i) => s.se[i]);
      });
      const seCatMap = {};
      const categorize = (se) => {
        const categories = [];
        if (/weight|appetite|metabolic|glucose|lipid/i.test(se)) categories.push('Metabolic/weight');
        if (/sexual|libido|orgasm|erectile/i.test(se)) categories.push('Sexual dysfunction');
        if (/sedat|somno|drowsy|hypnot/i.test(se)) categories.push('Sedation/somnolence');
        if (/insomnia|activat|jitter/i.test(se)) categories.push('Insomnia/activation');
        if (/EPS|akathisia|dyskin|parkins|dystoni/i.test(se)) categories.push('EPS/movement');
        if (/nausea|GI|diarrhea|vomit|constip/i.test(se)) categories.push('GI symptoms');
        if (/hypotens|dizziness|orthostatic/i.test(se)) categories.push('Hypotension/dizziness');
        if (/QTc|cardiac|arrhythmia/i.test(se)) categories.push('Cardiac/QTc');
        if (/dry mouth|anticholinergic|urinary|vision|constipation/i.test(se)) categories.push('Anticholinergic');
        if (/cognitive|memory|confusion/i.test(se)) categories.push('Cognitive impairment');
        return categories.length ? categories : ['Other'];
      };
      Object.entries(reportedSEByMed).forEach(([medName, effects]) => {
        effects.forEach(se => {
          categorize(se).forEach(cat => {
            if (!seCatMap[cat]) seCatMap[cat] = new Set();
            seCatMap[cat].add(medName);
          });
        });
      });
      const seSignals = Object.entries(seCatMap)
        .filter(([, s]) => s.size >= 2)
        .sort((a, b) => b[1].size - a[1].size);
      if (seSignals.length) {
        results.push('REPORTED SIDE EFFECT PATTERN SIGNALS:');
        seSignals.forEach(([cat, medSet]) => {
          results.push('  ' + cat + ' reported across ' + medSet.size + ' failed trials: ' + Array.from(medSet).join(', '));
          results.push('  → Consistent intolerance pattern — consider mechanism adjustment or pharmacogenomic testing.');
        });
        results.push('');
      }
    }

    if (!results.length) {
      results.push('No significant receptor, metabolic, or side effect overlap detected among failed trials.');
      results.push('');
    }

    return results;
  }

  // ─── Init ───────────────────────────────────────────────────────────────────
  function init() {
    buildForm();

    const generateBtn = document.getElementById('mh-generate-btn');
    const restoreBtn = document.getElementById('mh-restore-btn');
    const resetBtn = document.getElementById('mh-reset-btn');
    const restoreInput = document.getElementById('mh-restore-input');
    const outputArea = document.getElementById('mh-output-area');
    const codeDisplay = document.getElementById('mh-code-display');
    const copyReportBtn = document.getElementById('mh-copy-report-btn');
    const copyCodeBtn = document.getElementById('mh-copy-code-btn');

    if (generateBtn) {
      generateBtn.addEventListener('click', function () {
        const report = generateReport();
        if (!report) return;
        const code = encodeState();
        if (outputArea) outputArea.value = report;
        if (codeDisplay) codeDisplay.value = code;
        const outSection = document.getElementById('mh-output-section');
        if (outSection) {
          outSection.style.display = 'block';
          outSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    if (copyReportBtn) {
      copyReportBtn.addEventListener('click', function () {
        if (outputArea && outputArea.value) {
          ToolUtils.copyWithButton(outputArea.value, copyReportBtn);
        }
      });
    }

    if (copyCodeBtn) {
      copyCodeBtn.addEventListener('click', function () {
        if (codeDisplay && codeDisplay.value) {
          ToolUtils.copyWithButton(codeDisplay.value, copyCodeBtn);
        }
      });
    }

    if (restoreBtn) {
      restoreBtn.addEventListener('click', function () {
        const code = restoreInput ? restoreInput.value.trim() : '';
        if (!code) { alert('Please paste a restore code first.'); return; }
        const ok = decodeState(code);
        if (!ok) { alert('Invalid or unrecognized restore code. Please check and try again.'); return; }
        applyStateToForm();
        restoreInput.value = '';
        alert('Form restored successfully.');
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        ToolUtils.confirmReset('Reset all medication history entries?', function () {
          MEDS.forEach(m => {
            medState[m.code] = { tried: false, exp: '', year: '', len: '', reason: '', se: new Array(m.sideEffects.length).fill(false) };
          });
          buildForm();
          const outSection = document.getElementById('mh-output-section');
          if (outSection) outSection.style.display = 'none';
        });
      });
    }
  }

  init();
})();

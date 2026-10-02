// ── Receptor Glossary Data ────────────────────────────────────────────────────
// Each entry describes the clinical effects of a specific action at a receptor.
// "action" is what the drug does (inhibition, agonism, antagonism, PAM, etc.)
const RECEPTOR_GLOSSARY = [

  // ── Monoamine Transporters ────────────────────────────────────────────────
  {
    receptor: 'SERT',
    fullName: 'Serotonin Transporter',
    type: 'Transporter',
    color: '#10B981',
    description: 'Reuptake pump responsible for removing serotonin (5-HT) from the synapse back into the presynaptic neuron. Blocking it increases synaptic serotonin.',
    actions: [
      {
        action: 'Inhibition (Blockade)',
        drugExamples: ['SSRIs (Fluoxetine, Sertraline)', 'SNRIs (Venlafaxine, Duloxetine)', 'TCAs (Amitriptyline, Clomipramine)', 'Ziprasidone', 'Vilazodone'],
        benefits: [
          'Antidepressant effect (major depressive disorder)',
          'Anxiolytic (generalized anxiety, panic disorder, social anxiety)',
          'Antiobsessional (OCD)',
          'Antipanic and anti-PTSD effects',
          'Antibulimic (binge/purge reduction)',
          'Premenstrual dysphoric disorder (PMDD)',
          'Neuropathic pain (at higher occupancy — SNRIs)'
        ],
        sideEffects: [
          'Nausea and GI upset (especially at initiation; peaks week 1–2)',
          'Sexual dysfunction: delayed orgasm, anorgasmia, decreased libido (very common)',
          'Insomnia or sedation (drug-dependent)',
          'Emotional blunting or "apathy" at high occupancy',
          'Serotonin syndrome risk (with other serotonergic agents)',
          'Hyponatremia / SIADH (especially in elderly)',
          'Platelet aggregation inhibition → increased bleeding risk',
          'Weight changes (variable by agent)',
          'Activation/agitation ("jitteriness") at treatment initiation',
          'Discontinuation syndrome with abrupt cessation (especially paroxetine, venlafaxine)'
        ]
      }
    ]
  },

  {
    receptor: 'NET',
    fullName: 'Norepinephrine Transporter',
    type: 'Transporter',
    color: '#3B82F6',
    description: 'Reuptake pump that clears norepinephrine (NE) from the synapse. Blockade increases synaptic NE, enhancing noradrenergic tone.',
    actions: [
      {
        action: 'Inhibition (Blockade)',
        drugExamples: ['SNRIs (Duloxetine, Venlafaxine)', 'TCAs (Nortriptyline, Desipramine)', 'Atomoxetine', 'Bupropion (moderate)'],
        benefits: [
          'Antidepressant effect (particularly melancholic and atypical features)',
          'Improved concentration, energy, and alertness',
          'Analgesic — effective for neuropathic and musculoskeletal pain',
          'Reduces ADHD symptoms (atomoxetine)',
          'Vasomotor symptom reduction (hot flashes)',
          'Stress urinary incontinence (duloxetine)',
          'Anti-fatigue effect'
        ],
        sideEffects: [
          'Elevated blood pressure and heart rate (dose-dependent)',
          'Anxiety, nervousness, restlessness',
          'Tremor (fine motor)',
          'Excessive sweating (diaphoresis)',
          'Dry mouth',
          'Urinary hesitancy or retention',
          'Insomnia',
          'Constipation',
          'Sexual dysfunction (less than SERT blockade, but present)'
        ]
      }
    ]
  },

  {
    receptor: 'DAT',
    fullName: 'Dopamine Transporter',
    type: 'Transporter',
    color: '#8B5CF6',
    description: 'Reuptake pump responsible for clearing dopamine (DA) from the synapse. Blockade increases synaptic dopamine in mesolimbic and mesocortical pathways.',
    actions: [
      {
        action: 'Inhibition (Blockade)',
        drugExamples: ['Bupropion', 'Methylphenidate', 'Amphetamines', 'Sertraline (weak)', 'Cocaine (illicit)'],
        benefits: [
          'Improved motivation, drive, and energy',
          'Antidepressant effect (especially anhedonia and hypersomnia)',
          'ADHD symptom reduction (attention, hyperactivity, impulsivity)',
          'Procognitive effects in prefrontal cortex',
          'Anti-fatigue effects',
          'Smoking cessation (bupropion)'
        ],
        sideEffects: [
          'Abuse potential and dependence risk (especially with high-affinity blockers)',
          'Tachycardia and hypertension',
          'Anxiety and agitation',
          'Insomnia',
          'Appetite suppression and weight loss',
          'Psychosis or mania precipitation at high dopaminergic tone',
          'Tic exacerbation (in predisposed individuals)'
        ]
      }
    ]
  },

  // ── Serotonin Receptors ───────────────────────────────────────────────────
  {
    receptor: '5HT1A',
    fullName: '5-HT\u2081A Serotonin Receptor',
    type: 'Serotonin Receptor (GPCR, Gi-coupled)',
    color: '#F59E0B',
    description: 'Pre- and postsynaptic Gi-coupled GPCR. Presynaptic autoreceptors on raphe neurons suppress serotonin release; postsynaptic receptors in limbic/cortical areas mediate anxiolytic and antidepressant effects.',
    actions: [
      {
        action: 'Partial Agonism',
        drugExamples: ['Buspirone', 'Vilazodone', 'Aripiprazole', 'Ziprasidone', 'Trazodone', 'Quetiapine (via norquetiapine)'],
        benefits: [
          'Anxiolytic without sedation or dependence (buspirone)',
          'Antidepressant augmentation',
          'Reduces negative symptoms and cognitive dysfunction (antipsychotics)',
          'Attenuates SSRI-induced sexual dysfunction (postsynaptic 5HT1A stimulation)',
          'Antiemetic at some doses',
          'Neuroprotective effects in some models',
          'Reduces extrapyramidal side effects of antipsychotics'
        ],
        sideEffects: [
          'Initial "jitteriness" or anxiety at treatment start (presynaptic autoreceptor activation)',
          'Dizziness',
          'Nausea (particularly at initiation)',
          'Headache',
          'Delayed onset of anxiolytic effect (2–4 weeks for buspirone)',
          'Paradoxical restlessness (rare)'
        ]
      },
      {
        action: 'Antagonism',
        drugExamples: ['Pindolol (beta-blocker with 5HT1A antagonism)', 'Some investigational agents'],
        benefits: [
          'Augments antidepressant response by blocking presynaptic autoreceptors (allows more serotonin release)',
          'May accelerate antidepressant onset',
          'Pindolol augmentation strategy in treatment-resistant depression'
        ],
        sideEffects: [
          'Bradycardia (pindolol — beta-blocking effect)',
          'Potential worsening of anxiety if postsynaptic 5HT1A blockade predominates',
          'Limited clinical data as standalone effect'
        ]
      }
    ]
  },

  {
    receptor: '5HT2A',
    fullName: '5-HT\u2082A Serotonin Receptor',
    type: 'Serotonin Receptor (GPCR, Gq-coupled)',
    color: '#EF4444',
    description: 'Postsynaptic Gq-coupled GPCR found abundantly in the prefrontal cortex, limbic system, and striatum. Activation mediates hallucinogenic effects and can worsen psychosis; blockade is a cornerstone of second-generation antipsychotic action.',
    actions: [
      {
        action: 'Antagonism',
        drugExamples: ['SGAs (Risperidone, Olanzapine, Quetiapine, Clozapine, Ziprasidone, Asenapine)', 'Mirtazapine', 'Trazodone', 'Cyproheptadine'],
        benefits: [
          'Antipsychotic effect — reduces positive symptoms alongside D2 blockade',
          'Reduces extrapyramidal side effects (EPS) caused by D2 antagonism',
          'Anxiolytic and mood-stabilizing properties',
          'Improved sleep architecture (increased slow-wave/deep sleep)',
          'Antidepressant augmentation',
          'Reduction of hallucinations',
          'Appetite stimulation (useful in anorexia or cancer cachexia — cyproheptadine)'
        ],
        sideEffects: [
          'Sedation (at high doses or with concurrent H1 antagonism)',
          'Weight gain (metabolic effects)',
          'Hypotension',
          'Sexual side effects (some contribution)'
        ]
      },
      {
        action: 'Agonism',
        drugExamples: ['Psilocybin (investigational)', 'LSD (illicit)', 'DMT (illicit)', 'Mescaline (illicit)'],
        benefits: [
          'Neuroplasticity and synaptogenesis (psilocybin research)',
          'Investigational: treatment-resistant depression, PTSD, addiction (psilocybin-assisted therapy)',
          'Profound mystical/psychological experiences under controlled settings'
        ],
        sideEffects: [
          'Hallucinations (visual, auditory, tactile)',
          'Anxiety, panic, and "bad trips"',
          'Psychosis precipitation in vulnerable individuals',
          'Hypertension and tachycardia',
          'Hallucinogen persisting perception disorder (HPPD)',
          'Disorientation and thought disorganization'
        ]
      }
    ]
  },

  {
    receptor: '5HT2C',
    fullName: '5-HT\u2082C Serotonin Receptor',
    type: 'Serotonin Receptor (GPCR, Gq-coupled)',
    color: '#EC4899',
    description: 'Expressed in the choroid plexus, limbic system, and hypothalamus. Plays a key role in appetite regulation, mood, and metabolic control. Tonically active — inverse agonists/antagonists increase appetite and weight.',
    actions: [
      {
        action: 'Antagonism / Inverse Agonism',
        drugExamples: ['Olanzapine', 'Clozapine', 'Quetiapine', 'Mirtazapine', 'Asenapine'],
        benefits: [
          'Appetite stimulation — useful for anorexia or cachexia',
          'May contribute to antidepressant effects (disinhibition of DA/NE)',
          'Anxiolytic at some levels (complex bidirectional effects)',
          'Augments antidepressant response via dopamine disinhibition'
        ],
        sideEffects: [
          'Significant weight gain (major clinical concern)',
          'Increased appetite — carbohydrate craving',
          'Metabolic syndrome risk (dyslipidemia, insulin resistance)',
          'Type 2 diabetes risk with chronic use',
          'Sedation (synergistic with H1 antagonism)'
        ]
      },
      {
        action: 'Agonism',
        drugExamples: ['Lorcaserin (withdrawn from US market)', 'mCPP (active metabolite of trazodone)'],
        benefits: [
          'Appetite suppression and weight loss',
          'Reduced impulsivity and compulsive eating',
          'Potential utility in addiction treatment'
        ],
        sideEffects: [
          'Headache',
          'Nausea and dizziness',
          'Serotonin syndrome risk in combination with serotonergic drugs',
          'Anxiety (mCPP)',
          'Valvular heart disease concern (lorcaserin — reason for withdrawal)'
        ]
      }
    ]
  },

  // ── Dopamine Receptors ────────────────────────────────────────────────────
  {
    receptor: 'D1',
    fullName: 'D\u2081 Dopamine Receptor',
    type: 'Dopamine Receptor (GPCR, Gs-coupled)',
    color: '#06B6D4',
    description: 'Postsynaptic Gs-coupled GPCR concentrated in the prefrontal cortex and striatum. Critical for working memory, attention, and executive function via mesocortical pathway signaling.',
    actions: [
      {
        action: 'Agonism',
        drugExamples: ['Fenoldopam (peripherally)', 'Investigational procognitive agents'],
        benefits: [
          'Enhanced working memory and executive function (prefrontal cortex)',
          'Improved attention and cognitive flexibility',
          'Antidepressant potential',
          'Vasodilatory (peripheral D1 — renal arteries)'
        ],
        sideEffects: [
          'Dyskinesias at supratherapeutic activation',
          'Stereotyped behaviors at high doses',
          'Hypotension (peripheral effects)'
        ]
      },
      {
        action: 'Antagonism',
        drugExamples: ['Chlorpromazine', 'Fluphenazine', 'Clozapine (partial)', 'Most FGAs'],
        benefits: [
          'May contribute weakly to antipsychotic effect',
          'Reduces compulsive behaviors in some contexts'
        ],
        sideEffects: [
          'Cognitive blunting and working memory impairment',
          'Reduced motivation and anhedonia',
          'Akinesia and bradykinesia (combined with D2 blockade)',
          'Reduced dopamine-mediated reward processing'
        ]
      }
    ]
  },

  {
    receptor: 'D2',
    fullName: 'D\u2082 Dopamine Receptor',
    type: 'Dopamine Receptor (GPCR, Gi-coupled)',
    color: '#6366F1',
    description: 'The primary target of all antipsychotics. Found in the striatum, limbic system, pituitary, and elsewhere. Pre- and postsynaptic. Mediates antipsychotic efficacy via mesolimbic blockade, and EPS via nigrostriatal blockade.',
    actions: [
      {
        action: 'Antagonism',
        drugExamples: ['All FGAs (Haloperidol, Chlorpromazine)', 'All SGAs (at varying degrees)', 'Metoclopramide', 'Prochlorperazine'],
        benefits: [
          'Antipsychotic effect — reduces positive symptoms (hallucinations, delusions, disorganized thinking)',
          'Antiemetic and anti-nausea (via D2 in chemoreceptor trigger zone)',
          'Anti-manic effect (mood stabilization)',
          'Reduces agitation in acute psychosis',
          'Hiccup suppression'
        ],
        sideEffects: [
          'Extrapyramidal symptoms (EPS): parkinsonism, acute dystonia, akathisia, tardive dyskinesia',
          'Hyperprolactinemia: galactorrhea, amenorrhea, sexual dysfunction, gynecomastia, osteoporosis',
          'Anhedonia and emotional blunting (mesolimbic blockade)',
          'Cognitive dulling and negative symptom worsening',
          'Neuroleptic malignant syndrome (NMS) — rare but life-threatening',
          'Sedation (drug-dependent)',
          'Weight gain (variable by agent)'
        ]
      },
      {
        action: 'Partial Agonism',
        drugExamples: ['Aripiprazole', 'Brexpiprazole', 'Cariprazine'],
        benefits: [
          'Antipsychotic effect with functional antagonism at high dopamine states',
          'Less EPS than full antagonists',
          'Minimal or no hyperprolactinemia',
          'Reduced metabolic side effects',
          'Antidepressant augmentation (aripiprazole, brexpiprazole)',
          'Anti-anhedonic effect (partial agonism preserves reward signaling)',
          'Weight-neutral or modest weight gain'
        ],
        sideEffects: [
          'Akathisia (inner restlessness — common with aripiprazole)',
          'Nausea and vomiting at initiation',
          'Insomnia and activation',
          'Anxiety',
          'Mild tremor'
        ]
      }
    ]
  },

  {
    receptor: 'D3',
    fullName: 'D\u2083 Dopamine Receptor',
    type: 'Dopamine Receptor (GPCR, Gi-coupled)',
    color: '#7C3AED',
    description: 'Concentrated in limbic regions (nucleus accumbens, olfactory tubercle). Involved in reward, motivation, cognition, and emotional processing. Target of interest for negative symptoms and substance use disorders.',
    actions: [
      {
        action: 'Antagonism',
        drugExamples: ['Cariprazine (high D3 affinity)', 'Aripiprazole', 'Lurasidone', 'Asenapine'],
        benefits: [
          'Potential improvement in negative symptoms of schizophrenia',
          'Improved cognition and working memory',
          'Reduced drug craving and relapse in substance use disorders',
          'May reduce anhedonia',
          'Antidepressant effects (cariprazine in bipolar depression)',
          'Less EPS than striatal D2 blockade alone'
        ],
        sideEffects: [
          'Akathisia (particularly with cariprazine)',
          'Nausea',
          'Mild EPS at high doses',
          'Restlessness and anxiety'
        ]
      }
    ]
  },

  // ── Histamine Receptors ───────────────────────────────────────────────────
  {
    receptor: 'H1',
    fullName: 'H\u2081 Histamine Receptor',
    type: 'Histamine Receptor (GPCR, Gq-coupled)',
    color: '#FBBF24',
    description: 'Expressed throughout the brain (hypothalamus, cortex) and periphery. CNS H1 activation promotes wakefulness and arousal. Antagonism produces sedation, weight gain, and appetite stimulation.',
    actions: [
      {
        action: 'Antagonism',
        drugExamples: ['Mirtazapine', 'Olanzapine', 'Clozapine', 'Quetiapine', 'TCAs (Amitriptyline)', 'Diphenhydramine', 'Doxepin (low-dose for sleep)'],
        benefits: [
          'Sedation — useful for insomnia and acute agitation',
          'Antiemetic (reduced nausea)',
          'Antipruritic (itch relief — peripheral H1)',
          'Appetite stimulation — beneficial in anorexia, cachexia, or chemotherapy-induced weight loss',
          'Contributes to acute agitation management'
        ],
        sideEffects: [
          'Significant weight gain (one of the most common causes of antipsychotic weight gain)',
          'Carbohydrate craving and increased appetite',
          'Daytime sedation and cognitive impairment ("brain fog")',
          'Next-day hangover effect',
          'Impaired memory consolidation',
          'Dry mouth (synergistic with M1 antagonism)',
          'Psychomotor impairment — impairs driving'
        ]
      }
    ]
  },

  // ── Adrenergic Receptors ──────────────────────────────────────────────────
  {
    receptor: 'alpha1',
    fullName: '\u03B1\u2081-Adrenergic Receptor',
    type: 'Adrenergic Receptor (GPCR, Gq-coupled)',
    color: '#84CC16',
    description: 'Postsynaptic Gq-coupled GPCR on vascular smooth muscle, heart, and CNS. Mediates vasoconstrictive and arousing effects of NE/epinephrine. CNS alpha1 blockade contributes to sedation and orthostatic effects.',
    actions: [
      {
        action: 'Antagonism',
        drugExamples: ['Prazosin', 'Trazodone', 'Mirtazapine', 'Chlorpromazine', 'Clozapine', 'Risperidone', 'TCAs'],
        benefits: [
          'Reduces PTSD nightmares and hyperarousal (prazosin, trazodone)',
          'Antihypertensive effect',
          'Sedation — beneficial for sleep initiation',
          'May reduce anxiety-related hyperarousal',
          'Contributes to antipsychotic calming effects in acute agitation'
        ],
        sideEffects: [
          'Orthostatic hypotension — dizziness, lightheadedness, syncope',
          'Fall risk (particularly in elderly)',
          'Reflex tachycardia',
          'Nasal congestion',
          'Priapism (rare but serious — especially trazodone)',
          'First-dose effect (severe hypotension at initiation)'
        ]
      }
    ]
  },

  {
    receptor: 'alpha2',
    fullName: '\u03B1\u2082-Adrenergic Receptor',
    type: 'Adrenergic Receptor (GPCR, Gi-coupled)',
    color: '#14B8A6',
    description: 'Presynaptic autoreceptor on NE and serotonin neurons (Gi-coupled). Activation inhibits neurotransmitter release (negative feedback). Antagonism disinhibits NE and 5HT release — the mechanism of mirtazapine.',
    actions: [
      {
        action: 'Antagonism (Presynaptic Autoreceptor Blockade)',
        drugExamples: ['Mirtazapine', 'Yohimbine', 'Mianserin'],
        benefits: [
          'Increases norepinephrine and serotonin release in the synapse',
          'Antidepressant effect (NaSSA mechanism)',
          'Improved sleep (synergistic with H1 antagonism)',
          'Anxiolytic properties',
          'Augments other antidepressants',
          'Particularly useful for depression with insomnia, anxiety, or weight loss'
        ],
        sideEffects: [
          'Significant weight gain and increased appetite (compounded by H1 blockade)',
          'Sedation (though low-dose mirtazapine is paradoxically more sedating than high-dose)',
          'Dizziness',
          'Dry mouth',
          'Constipation'
        ]
      },
      {
        action: 'Agonism',
        drugExamples: ['Clonidine', 'Guanfacine', 'Lofexidine', 'Dexmedetomidine'],
        benefits: [
          'Anxiolytic — reduces sympathetic nervous system hyperactivation',
          'Reduces PTSD symptoms (nightmares, hypervigilance)',
          'ADHD treatment (guanfacine — improves prefrontal cortex function)',
          'Opioid withdrawal symptom management',
          'Alcohol withdrawal adjunct',
          'Antihypertensive',
          'Perioperative analgesia (dexmedetomidine)',
          'Sedative — useful in ICU settings'
        ],
        sideEffects: [
          'Sedation and fatigue',
          'Dry mouth',
          'Bradycardia and hypotension',
          'Rebound hypertension on abrupt discontinuation',
          'Depression (with chronic use at high doses)',
          'Cognitive impairment at high doses'
        ]
      }
    ]
  },

  // ── Muscarinic Receptors ──────────────────────────────────────────────────
  {
    receptor: 'M1',
    fullName: 'M\u2081 Muscarinic Acetylcholine Receptor',
    type: 'Muscarinic Receptor (GPCR, Gq-coupled)',
    color: '#94A3B8',
    description: 'Postsynaptic Gq-coupled GPCR in the CNS (cortex, hippocampus) and peripheral organs. Mediates cholinergic tone important for memory, cognition, and autonomic (parasympathetic) function.',
    actions: [
      {
        action: 'Antagonism (Anticholinergic)',
        drugExamples: ['Paroxetine (SSRI with highest anticholinergic burden)', 'TCAs (Amitriptyline, Imipramine)', 'Olanzapine', 'Clozapine', 'Diphenhydramine', 'Benztropine'],
        benefits: [
          'Reduces EPS caused by D2 blockade (anticholinergic antiparkinsonian effect)',
          'Acute dystonia treatment (benztropine)',
          'Reduces tremor in antipsychotic-induced parkinsonism',
          'Urinary bladder relaxation (overactive bladder treatment)',
          'Anti-nausea (motion sickness)'
        ],
        sideEffects: [
          'Dry mouth (xerostomia)',
          'Constipation and ileus',
          'Urinary hesitancy and retention',
          'Blurred vision (impaired near accommodation)',
          'Tachycardia',
          'Cognitive impairment — memory deficits, confusion',
          'Delirium in elderly (major concern)',
          'Increased intraocular pressure (angle-closure glaucoma risk)',
          'Heat intolerance (reduced sweating — anhidrosis)',
          'Increased dementia risk with chronic anticholinergic burden'
        ]
      },
      {
        action: 'Agonism',
        drugExamples: ['Acetylcholine (endogenous)', 'Carbachol', 'Methacholine', 'Pilocarpine'],
        benefits: [
          'Procognitive — enhances memory and learning (hippocampal M1)',
          'Miosis and reduced intraocular pressure (glaucoma treatment — pilocarpine)',
          'GI motility stimulation'
        ],
        sideEffects: [
          'SLUDGE/DUMBBELS: Salivation, Lacrimation, Urination, Defecation, GI distress, Emesis',
          'Bradycardia and hypotension',
          'Bronchospasm',
          'Diaphoresis (excessive sweating)',
          'Miosis (pupil constriction)'
        ]
      }
    ]
  },

  // ── GABA Receptors ────────────────────────────────────────────────────────
  {
    receptor: 'GABA-A',
    fullName: 'GABA\u2081 Receptor (Ionotropic Chloride Channel)',
    type: 'Ionotropic Receptor (Ligand-gated Cl⁻ channel)',
    color: '#22D3EE',
    description: 'Ligand-gated chloride ion channel. Primary inhibitory receptor in the CNS. Benzodiazepines, z-drugs, barbiturates, and alcohol all act as positive allosteric modulators (PAMs) at different binding sites.',
    actions: [
      {
        action: 'Positive Allosteric Modulation (PAM)',
        drugExamples: ['Benzodiazepines (Temazepam, Diazepam, Lorazepam)', 'Z-drugs (Zolpidem, Eszopiclone)', 'Barbiturates', 'Alcohol', 'Propofol', 'Neurosteroids (Brexanolone)'],
        benefits: [
          'Anxiolytic (generalized anxiety, panic attacks, situational anxiety)',
          'Sedative-hypnotic (sleep induction and maintenance)',
          'Anticonvulsant (seizure prevention and acute seizure management)',
          'Muscle relaxant (spasticity)',
          'Alcohol and benzodiazepine withdrawal treatment',
          'Anesthesia induction (at high doses)',
          'Acute agitation control',
          'Procedural sedation and amnesia'
        ],
        sideEffects: [
          'Sedation and excessive daytime sleepiness',
          'Cognitive impairment, anterograde amnesia',
          'Psychomotor impairment — impaired driving',
          'Physical dependence and tolerance (rapid with benzodiazepines)',
          'Withdrawal syndrome — potentially life-threatening (seizures, delirium)',
          'Respiratory depression (especially combined with opioids or alcohol)',
          'Disinhibition and behavioral disturbances (paradoxical)',
          'Complex sleep behaviors: sleepwalking, sleep-driving (z-drugs)',
          'Rebound insomnia on discontinuation',
          'Fall risk and hip fractures (elderly)',
          'Increased dementia risk with long-term use (association, causality debated)'
        ]
      }
    ]
  },

  // ── Melatonin Receptors ───────────────────────────────────────────────────
  {
    receptor: 'MT1/MT2',
    fullName: 'Melatonin MT\u2081 and MT\u2082 Receptors',
    type: 'Melatonin Receptor (GPCR, Gi-coupled)',
    color: '#A78BFA',
    description: 'Gi-coupled GPCRs in the suprachiasmatic nucleus (SCN) that regulate circadian rhythm and sleep-wake cycles. MT1 mediates acute sleep-promoting effects; MT2 mediates circadian phase-shifting.',
    actions: [
      {
        action: 'Agonism',
        drugExamples: ['Ramelteon (MT1/MT2 agonist)', 'Tasimelteon (Hetlioz)', 'Melatonin (OTC supplement)'],
        benefits: [
          'Promotes sleep onset (reduces sleep latency)',
          'Circadian rhythm regulation (jet lag, shift work)',
          'No abuse potential or dependence — not a controlled substance',
          'Safe in elderly (preferred over benzodiazepines)',
          'Non-24-hour sleep-wake disorder treatment (tasimelteon)',
          'Minimal next-day residual sedation',
          'Antioxidant and potential neuroprotective properties (melatonin)'
        ],
        sideEffects: [
          'Dizziness and somnolence',
          'Nausea and headache',
          'Prolactin elevation (ramelteon — monitor in prolactin-sensitive conditions)',
          'Testosterone reduction with long-term use (data mostly in older studies)',
          'Generally very well tolerated; side effect burden is low'
        ]
      }
    ]
  },

  // ── Orexin Receptors ──────────────────────────────────────────────────────
  {
    receptor: 'OX1R/OX2R',
    fullName: 'Orexin (Hypocretin) OX\u2081 and OX\u2082 Receptors',
    type: 'Orexin Receptor (GPCR, Gq-coupled)',
    color: '#FB923C',
    description: 'Gq-coupled GPCRs activated by orexin (hypocretin) peptides from the lateral hypothalamus. Promote and maintain wakefulness, arousal, and appetite. Loss of orexin neurons causes narcolepsy with cataplexy.',
    actions: [
      {
        action: 'Antagonism (DORA — Dual Orexin Receptor Antagonist)',
        drugExamples: ['Suvorexant (Belsomra)', 'Lemborexant (Dayvigo)', 'Daridorexant (Quviviq)'],
        benefits: [
          'Promotes sleep by reducing wakefulness drive (rather than inducing sedation)',
          'Maintains more natural sleep architecture than benzodiazepines',
          'Reduces sleep onset latency and improves sleep maintenance',
          'Lower dependence and abuse potential vs. BZDs/z-drugs',
          'Minimal respiratory depression risk',
          'Beneficial in elderly (safer profile than BZDs)',
          'May improve sleep in Alzheimer\'s dementia'
        ],
        sideEffects: [
          'Somnolence and next-morning residual sleepiness',
          'Headache',
          'Sleep paralysis (transient; due to REM intrusion)',
          'Hypnagogic/hypnopompic hallucinations',
          'Worsening of cataplexy-like episodes in narcolepsy patients',
          'Mild impairment of driving (dose-dependent)',
          'Abnormal dreams'
        ]
      }
    ]
  }

];

// ── Synaptic Binding Lookup ────────────────────────────────────────────────────
// loc: 'pre' | 'post' | 'both'
// label: receptor names (display)
// detail: clinical note (shown in tooltip / modal)
const SYNAPTIC_BINDING = {
  fluoxetine: [
    { loc: 'pre',  label: 'SERT',               detail: 'Pre-synaptic serotonin reuptake transporter blockade (primary mechanism)' },
    { loc: 'post', label: '5HT2C',              detail: 'Weak post-synaptic 5HT2C antagonism at therapeutic doses' }
  ],
  sertraline: [
    { loc: 'pre',  label: 'SERT, DAT',          detail: 'Serotonin reuptake (primary); dopamine reuptake (weak — may contribute to motivation effects)' }
  ],
  escitalopram: [
    { loc: 'pre',  label: 'SERT',               detail: 'Highly selective pre-synaptic serotonin reuptake transporter blockade; allosteric binding site confers added selectivity' }
  ],
  paroxetine: [
    { loc: 'pre',  label: 'SERT, NET',          detail: 'Serotonin reuptake (primary); norepinephrine reuptake (moderate, adds NE effects vs. other SSRIs)' },
    { loc: 'post', label: 'M1',                 detail: 'Post-synaptic muscarinic antagonism — responsible for highest anticholinergic burden among SSRIs' }
  ],
  citalopram: [
    { loc: 'pre',  label: 'SERT',               detail: 'Serotonin reuptake transporter blockade (both R and S enantiomers; S is more potent)' }
  ],
  fluvoxamine: [
    { loc: 'pre',  label: 'SERT',               detail: 'Serotonin reuptake transporter blockade; also acts as sigma-1 receptor agonist (may contribute to antipsychotic augmentation)' }
  ],
  venlafaxine: [
    { loc: 'pre',  label: 'SERT, NET',          detail: 'Dual reuptake inhibition; SERT predominates at low doses; NET becomes significant >150 mg/day' }
  ],
  duloxetine: [
    { loc: 'pre',  label: 'SERT, NET',          detail: 'Balanced dual reuptake inhibition (SERT:NET ~10:1 ratio); NET inhibition contributes to pain modulation' }
  ],
  desvenlafaxine: [
    { loc: 'pre',  label: 'SERT, NET',          detail: 'Dual reuptake inhibition; slightly more NET-selective ratio than venlafaxine; less P450-dependent' }
  ],
  amitriptyline: [
    { loc: 'pre',  label: 'SERT, NET',          detail: 'Dual monoamine reuptake inhibition (primary antidepressant mechanism)' },
    { loc: 'post', label: 'H1, alpha1, M1, 5HT2A, 5HT2C', detail: 'Broad post-synaptic receptor antagonism mediates sedation (H1), orthostasis (alpha1), anticholinergic effects (M1), and antidepressant augmentation (5HT2A/2C)' }
  ],
  nortriptyline: [
    { loc: 'pre',  label: 'NET > SERT',         detail: 'Preferentially inhibits norepinephrine reuptake; less serotonergic than amitriptyline (its parent compound)' },
    { loc: 'post', label: 'H1, alpha1, M1',     detail: 'Post-synaptic antagonism; lower anticholinergic and sedative burden than amitriptyline' }
  ],
  imipramine: [
    { loc: 'pre',  label: 'SERT, NET',          detail: 'Dual reuptake inhibition; demethylated to desipramine (NET-selective metabolite)' },
    { loc: 'post', label: 'H1, alpha1, M1, 5HT2A', detail: 'Post-synaptic antagonism contributes to sedation, orthostasis, and anticholinergic side effects' }
  ],
  phenelzine: [
    { loc: 'pre',  label: 'MAO-A/B (enzyme)',   detail: 'Irreversible inhibition of pre-synaptic mitochondrial monoamine oxidase → increases synaptic stores of NE, 5HT, and DA in nerve terminals' }
  ],
  tranylcypromine: [
    { loc: 'pre',  label: 'MAO-A/B (enzyme)',   detail: 'Irreversible non-selective MAO inhibition; also has structural similarity to amphetamine — mild pre-synaptic DA/NE releasing properties' }
  ],
  bupropion: [
    { loc: 'pre',  label: 'NET, DAT',           detail: 'Norepinephrine and dopamine reuptake inhibition; also antagonizes nicotinic acetylcholine receptors (contributes to smoking cessation)' }
  ],
  mirtazapine: [
    { loc: 'pre',  label: 'alpha2 (autoreceptor)', detail: 'Pre-synaptic alpha2 autoreceptor antagonism → disinhibits NE and 5HT release (primary antidepressant mechanism; "noradrenergic and specific serotonergic" action)' },
    { loc: 'post', label: 'H1, 5HT2A, 5HT2C, alpha1', detail: 'Post-synaptic antagonism contributes to sedation (H1), appetite/weight gain (H1+5HT2C), anxiolytic effects (5HT2A/2C), and orthostasis (alpha1)' }
  ],
  trazodone: [
    { loc: 'pre',  label: 'SERT',               detail: 'Weak serotonin reuptake inhibition at higher doses' },
    { loc: 'both', label: '5HT1A',              detail: 'Partial agonist at both pre-synaptic raphe 5HT1A autoreceptors (suppresses 5HT neuron firing) and post-synaptic limbic 5HT1A receptors (anxiolytic)' },
    { loc: 'post', label: '5HT2A, H1, alpha1',  detail: 'Post-synaptic antagonism mediates anxiolytic/antidepressant (5HT2A), sedative (H1), and hypotensive effects (alpha1)' }
  ],
  vilazodone: [
    { loc: 'pre',  label: 'SERT',               detail: 'Pre-synaptic serotonin reuptake transporter blockade' },
    { loc: 'both', label: '5HT1A',              detail: 'Partial agonist at pre-synaptic raphe 5HT1A autoreceptors AND post-synaptic 5HT1A receptors; dual mechanism may accelerate antidepressant onset and reduce sexual dysfunction vs. SSRIs alone' }
  ],
  haloperidol: [
    { loc: 'pre',  label: 'D2 (autoreceptor)',  detail: 'Low doses preferentially block pre-synaptic D2 autoreceptors → can paradoxically increase dopamine synthesis/release' },
    { loc: 'post', label: 'D2, D3, 5HT2A, alpha1', detail: 'Primary post-synaptic D2 antagonism mediates antipsychotic efficacy (mesolimbic) and EPS (nigrostriatal); alpha1 contributes to orthostasis' }
  ],
  chlorpromazine: [
    { loc: 'post', label: 'D1, D2, D3, 5HT2A, 5HT2C, H1, alpha1, M1', detail: 'Broad post-synaptic antagonism ("dirty antipsychotic"); lowest D2 selectivity among FGAs; marked sedation (H1), orthostasis (alpha1), anticholinergic effects (M1)' }
  ],
  fluphenazine: [
    { loc: 'post', label: 'D2, D1, 5HT2A, H1, alpha1', detail: 'Post-synaptic antagonism; high D2 potency (low-dose effective); available as long-acting decanoate formulation' }
  ],
  risperidone: [
    { loc: 'post', label: '5HT2A, D2, D3, alpha1, alpha2, H1', detail: 'Post-synaptic antagonism; very high 5HT2A:D2 affinity ratio (reduces EPS vs. FGAs); alpha1 blockade causes significant orthostasis; no intrinsic anticholinergic activity' }
  ],
  olanzapine: [
    { loc: 'post', label: 'D1, D2, D3, 5HT2A, 5HT2C, H1, alpha1, M1', detail: 'Multi-receptor post-synaptic antagonism; highest M1 affinity among SGAs (anticholinergic); 5HT2C antagonism drives major weight gain; H1 contributes to sedation' }
  ],
  quetiapine: [
    { loc: 'pre',  label: 'NET (norquetiapine)', detail: 'Active metabolite norquetiapine significantly inhibits pre-synaptic NET — primary mechanism of quetiapine\'s antidepressant effect' },
    { loc: 'post', label: 'D2, 5HT2A, H1, alpha1', detail: 'Post-synaptic antagonism with fast D2 dissociation kinetics ("hit and run" — low EPS); H1 drives strong sedation at low doses' }
  ],
  aripiprazole: [
    { loc: 'both', label: 'D2, D3',             detail: 'Partial agonist at both pre-synaptic D2/D3 autoreceptors (reduces excess dopamine synthesis) and post-synaptic D2/D3 (functional antagonist in high-dopamine states, agonist in low-dopamine states)' },
    { loc: 'both', label: '5HT1A',              detail: 'Partial agonist at pre-synaptic raphe 5HT1A autoreceptors and post-synaptic limbic 5HT1A receptors (anxiolytic, antidepressant augmentation)' },
    { loc: 'post', label: '5HT2A',              detail: 'Post-synaptic antagonism (further reduces EPS risk; may augment antidepressant response)' }
  ],
  clozapine: [
    { loc: 'post', label: 'D1, D2, D3, 5HT2A, 5HT2C, H1, alpha1, M1', detail: 'Loose, rapidly-dissociating post-synaptic D2 binding ("atypical" kinetics); uniquely effective for treatment-resistant schizophrenia; broadest receptor antagonism profile of any antipsychotic' }
  ],
  ziprasidone: [
    { loc: 'pre',  label: 'SERT, NET',          detail: 'Among SGAs, highest serotonin and norepinephrine reuptake inhibition — contributes to antidepressant and anxiolytic effects' },
    { loc: 'both', label: '5HT1A',              detail: 'Partial agonist at pre-synaptic raphe 5HT1A autoreceptors and post-synaptic 5HT1A receptors' },
    { loc: 'post', label: 'D2, D3, 5HT2A, 5HT2C, H1, alpha1', detail: 'Post-synaptic antagonism; exceptionally high 5HT2A:D2 ratio; low weight gain due to minimal 5HT2C and H1 activity at clinical doses' }
  ],
  lurasidone: [
    { loc: 'both', label: '5HT1A',              detail: 'Partial agonist at pre and post-synaptic 5HT1A receptors (contributes to antidepressant/anxiolytic effects in bipolar depression)' },
    { loc: 'post', label: 'D2, D3, 5HT2A',     detail: 'Post-synaptic D2/D3/5HT2A antagonism' },
    { loc: 'post', label: 'alpha2A, alpha2C',   detail: 'Post-synaptic alpha2 antagonism may disinhibit NE and 5HT release (adds antidepressant mechanism)' }
  ],
  asenapine: [
    { loc: 'both', label: '5HT1A',              detail: 'Partial agonist at pre and post-synaptic 5HT1A receptors' },
    { loc: 'post', label: 'D2, D3, 5HT2A, 5HT2C, H1, alpha1, alpha2', detail: 'Broad post-synaptic antagonism; among highest known affinity at 5HT2A and 5HT2C; sublingually absorbed (bypasses first-pass)' }
  ],
  lithium: [
    { loc: 'pre',  label: 'GSK-3β, IMPase',     detail: 'Inhibits pre-synaptic intracellular signaling enzymes (GSK-3β, inositol monophosphatase) → modulates neurotransmitter synthesis, release, and receptor sensitivity' }
  ],
  valproate: [
    { loc: 'pre',  label: 'GABA-T, Na⁺ channels', detail: 'Pre-synaptic GABA-transaminase inhibition (↑ GABA stores); stabilizes voltage-gated Na⁺ channels on pre-synaptic terminals → reduces excitatory neurotransmitter release' }
  ],
  lamotrigine: [
    { loc: 'pre',  label: 'Na⁺ channels (Nav1.1, Nav1.6)', detail: 'Stabilizes pre-synaptic voltage-gated sodium channels in an inactivated state → inhibits glutamate (and other neurotransmitter) release; preferentially affects rapidly-firing neurons' }
  ],
  carbamazepine: [
    { loc: 'pre',  label: 'Na⁺ channels',       detail: 'Pre-synaptic voltage-gated sodium channel stabilization → reduces repetitive neuronal firing and glutamate release; also blocks N-type calcium channels pre-synaptically' }
  ],
  zolpidem: [
    { loc: 'post', label: 'GABA-A (α1 subunit)', detail: 'Selective post-synaptic PAM at α1-containing GABA-A receptors in cortex and cerebellum; α1 selectivity produces sedation > anxiolysis or muscle relaxation' }
  ],
  eszopiclone: [
    { loc: 'post', label: 'GABA-A (α1, α2, α3, α5)', detail: 'Post-synaptic GABA-A PAM; less α1-selective than zolpidem — produces sedation plus anxiolysis (α2/α3) and some memory impairment (α5)' }
  ],
  temazepam: [
    { loc: 'post', label: 'GABA-A (α1, α2, α3, α5)', detail: 'Non-selective post-synaptic GABA-A PAM at benzodiazepine site; produces sedation, anxiolysis, muscle relaxation, and anticonvulsant effects through multiple subunit populations' }
  ],
  ramelteon: [
    { loc: 'post', label: 'MT1, MT2',           detail: 'Post-synaptic agonism in suprachiasmatic nucleus (SCN) — MT1 mediates acute inhibition of SCN firing (sleep onset); MT2 mediates circadian phase shifting' }
  ],
  suvorexant: [
    { loc: 'post', label: 'OX1R, OX2R',         detail: 'Post-synaptic orexin/hypocretin receptor antagonism in lateral hypothalamus projections; blocks wakefulness-promoting signal → promotes sleep passively without CNS depression' }
  ]
};

// Receptor color map (consistent across all charts)
const RECEPTOR_COLORS = {
  'SERT':   '#10B981',
  'NET':    '#3B82F6',
  'DAT':    '#8B5CF6',
  '5HT1A':  '#F59E0B',
  '5HT2A':  '#EF4444',
  '5HT2C':  '#EC4899',
  'D1':     '#06B6D4',
  'D2':     '#6366F1',
  'D3':     '#7C3AED',
  'H1':     '#FBBF24',
  'alpha1': '#84CC16',
  'alpha2': '#14B8A6',
  'M1':     '#94A3B8',
  // Sleep/other receptors
  'GABA-A': '#22D3EE',
  'MT1':    '#A78BFA',
  'MT2':    '#C084FC',
  'OX1R':   '#FB923C',
  'OX2R':   '#F87171',
};

const RECEPTOR_LIST = ['SERT','NET','DAT','5HT1A','5HT2A','5HT2C','D1','D2','D3','H1','alpha1','alpha2','M1','GABA-A','MT1','MT2','OX1R','OX2R'];
const P450_ENZYMES  = ['CYP1A2','CYP2B6','CYP2C9','CYP2C19','CYP2D6','CYP3A4'];

// ── Perinatal Safety Data ──────────────────────────────────────────────────
// pregnancy.fdaCategory: historical FDA letter category (A/B/C/D/X) — still widely used clinically
// pregnancy.risk: 'low' | 'caution' | 'avoid' | 'unknown'  (used for sorting/color)
// breastfeeding.hale: Hale's Lactation Risk Category L1–L5 or 'unknown'
// breastfeeding.rid: Relative Infant Dose (% of weight-adjusted maternal dose reaching infant via milk).
//   Established published figures (Hale's Medications & Mothers' Milk, LactMed); 'Not established' where
//   no reliable human data exists. RID < 10% is generally considered compatible with breastfeeding.
//   Values are approximate ranges — verify against a current lactation reference before clinical decisions.
// breastfeeding.risk: 'low' | 'caution' | 'avoid' | 'unknown'
// Sources: FDA labels, LactMed, Hale's Medications & Mothers' Milk, Briggs Drugs in Pregnancy & Lactation
const PERINATAL_DATA = {
  // SSRIs
  fluoxetine:           { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'PPHN risk with late 3rd-trimester use. Neonatal adaptation syndrome. Generally weigh benefit vs. risk.' }, breastfeeding: { rid: '1.6–14.6%', hale: 'L2', risk: 'low', notes: 'Detectable in milk; long half-life of norfluoxetine. Monitor infant for sedation. Many prefer sertraline.' } },
  sertraline:           { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Most studied SSRI in pregnancy. Neonatal adaptation syndrome possible. Preferred SSRI if treatment needed.' }, breastfeeding: { rid: '0.4–2.2%', hale: 'L2', risk: 'low', notes: 'Preferred SSRI during breastfeeding. Low milk-to-plasma ratio; minimal infant exposure.' } },
  escitalopram:         { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Limited data vs. citalopram; cardiac defect risk signal weaker. Neonatal adaptation syndrome.' }, breastfeeding: { rid: '5.2–7.9%', hale: 'L2', risk: 'low', notes: 'Low relative infant dose. Generally considered compatible with monitoring.' } },
  paroxetine:           { pregnancy: { fdaCategory: 'D', risk: 'avoid',   notes: 'Associated with cardiac septal defects (OR ~1.5–2.0). Avoid in 1st trimester; switch if planning pregnancy.' }, breastfeeding: { rid: '1.2–2.8%', hale: 'L2', risk: 'low', notes: 'Low milk transfer. Compatible if clinically needed, though cardiac risk in pregnancy limits broader use.' } },
  citalopram:           { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Small, inconsistent cardiac malformation signal in some studies. Neonatal adaptation syndrome and PPHN as for SSRIs.' }, breastfeeding: { rid: '3–10%', hale: 'L2', risk: 'low', notes: 'Higher milk-to-plasma ratio than sertraline. Monitor infant; sertraline preferred.' } },
  fluvoxamine:          { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Limited human data; animal studies reassuring. Neonatal adaptation syndrome. CYP interactions may complicate dosing.' }, breastfeeding: { rid: '0.3–1.6%', hale: 'L2', risk: 'low', notes: 'Low infant relative dose. Compatible with monitoring.' } },
  // SNRIs
  venlafaxine:          { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Neonatal adaptation syndrome common; PPHN risk similar to SSRIs. Abrupt discontinuation in neonate causes withdrawal.' }, breastfeeding: { rid: '6.4–8.1%', hale: 'L3', risk: 'caution', notes: 'O-desmethylvenlafaxine accumulates in milk. Monitor infant for agitation, poor feeding.' } },
  duloxetine:           { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Neonatal adaptation syndrome. Some pain-indication data. Avoid abrupt cessation near term.' }, breastfeeding: { rid: '0.1–1.1%', hale: 'L3', risk: 'caution', notes: 'Low relative infant dose but limited safety data. Use with monitoring.' } },
  desvenlafaxine:       { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Active metabolite of venlafaxine. Neonatal adaptation syndrome risk. Limited specific data.' }, breastfeeding: { rid: '~6.8%', hale: 'L3', risk: 'caution', notes: 'Excreted in breast milk. Insufficient long-term infant safety data.' } },
  milnacipran:          { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Very limited human pregnancy data. Approved for fibromyalgia, not MDD. Avoid unless clearly necessary.' }, breastfeeding: { rid: '2.8–5%', hale: 'unknown', risk: 'caution', notes: 'Milk levels low (RID ~2.8–5%); not expected to cause adverse effects. No published infant outcome data; caution pending more data.' } },
  levomilnacipran:      { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Active enantiomer of milnacipran. Very limited pregnancy data.' }, breastfeeding: { rid: '~2.8% (racemic milnacipran data)', hale: 'unknown', risk: 'caution', notes: 'No direct data; racemic milnacipran gives RID ~2.8%. LactMed: use with caution, especially with newborn/preterm infants; monitor for agitation, irritability, poor feeding.' } },
  // TCAs
  amitriptyline:        { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Neonatal withdrawal, tachycardia. Limb reduction defects debated. Use lowest dose; avoid near term if possible.' }, breastfeeding: { rid: '0.9–2.8%', hale: 'L2', risk: 'low', notes: 'Low infant serum levels in most studies. Monitor for sedation.' } },
  nortriptyline:        { pregnancy: { fdaCategory: 'D', risk: 'caution', notes: 'Former Category D is historical. Preferred TCA in pregnancy and breastfeeding when a TCA is needed. Neonatal withdrawal and anticholinergic effects (urinary retention) possible.' }, breastfeeding: { rid: '1.3–2.3%', hale: 'L2', risk: 'low', notes: 'Preferred TCA during breastfeeding; low relative infant dose.' } },
  imipramine:           { pregnancy: { fdaCategory: 'D', risk: 'avoid',   notes: 'Neonatal withdrawal symptoms. Limb/cardiovascular defect signal; avoid in 1st trimester.' }, breastfeeding: { rid: '0.1–4.4%', hale: 'L2', risk: 'low', notes: 'Low milk transfer. Monitor infant for sedation.' } },
  doxepin:              { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Limited data at psychiatric doses. Topical formulation considered safer.' }, breastfeeding: { rid: '~1.2–3%', hale: 'L5', risk: 'avoid',   notes: 'Avoid — case reports of infant respiratory depression and sedation. Contraindicated during breastfeeding.' } },
  // MAOIs
  phenelzine:           { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Very limited human data. MAO inhibition may affect fetal development. Avoid if alternatives exist.' }, breastfeeding: { rid: 'Not established', hale: 'unknown', risk: 'avoid', notes: 'No published lactation data; may raise prolactin. LactMed: other antidepressants (e.g., sertraline, paroxetine, nortriptyline) are preferred.' } },
  tranylcypromine:      { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Stimulant properties; vasoconstriction risk. Very limited data. Avoid if possible.' }, breastfeeding: { rid: 'Not established', hale: 'unknown', risk: 'avoid', notes: 'No milk-level data. One case of abdominal distension and feeding intolerance (maternal 100–120 mg/day) that resolved after weaning. LactMed: an alternative is preferred.' } },
  // Other antidepressants
  bupropion:            { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Some signal for cardiac defects at high doses (disputed). Commonly used for depression/smoking cessation.' }, breastfeeding: { rid: '0.1–2%', hale: 'L3', risk: 'caution', notes: 'Hydroxybupropion accumulates in milk. Case report of infant seizure. Use caution; monitor infant.' } },
  mirtazapine:          { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Commonly used off-label for hyperemesis gravidarum. Limited but generally reassuring data for short-term use.' }, breastfeeding: { rid: '0.6–3%', hale: 'L3', risk: 'caution', notes: 'Detected in milk at low levels. Sedation possible. Monitor infant.' } },
  trazodone:            { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Limited human data. Animal studies show no teratogenicity. Commonly used at low doses for insomnia.' }, breastfeeding: { rid: '0.6–2.8%', hale: 'L2', risk: 'low', notes: 'Low relative infant dose. Generally considered compatible at low doses.' } },
  vilazodone:           { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Limited human data. SSRI-like neonatal adaptation risk.' }, breastfeeding: { rid: 'Not established', hale: 'unknown', risk: 'unknown', notes: 'No published experience. LactMed: an alternate drug may be preferred, especially for newborn/preterm infants.' } },
  vortioxetine:         { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Limited human data. Novel mechanism. Avoid unless benefit clearly outweighs risk.' }, breastfeeding: { rid: '0.3–1.7%', hale: 'unknown', risk: 'low', notes: 'Milk levels low; no adverse effects in reported infants (1–9 months). LactMed: if required, not a reason to discontinue breastfeeding; monitor infant.' } },
  gepirone:             { pregnancy: { fdaCategory: null, risk: 'caution', notes: 'Very limited data. Novel 5HT1A partial agonist antidepressant. Avoid if possible.' }, breastfeeding: { rid: 'Not established', hale: 'unknown', risk: 'unknown', notes: 'No lactation data. Poor oral bioavailability makes significant infant absorption unlikely. Monitor for irritability, somnolence, poor feeding.' } },
  esketamine:           { pregnancy: { fdaCategory: null, risk: 'avoid',   notes: 'NMDA antagonism — animal data shows potential neurotoxicity. Avoid in pregnancy. REMS program.' }, breastfeeding: { rid: 'Not established', hale: 'unknown', risk: 'avoid', notes: 'No milk data for the nasal spray. Single IV doses at cesarean appear safe, but LactMed advises that repeated intranasal dosing should probably be avoided during breastfeeding.' } },
  brexanolone:          { pregnancy: { fdaCategory: 'N/A', risk: 'unknown', notes: 'Approved for postpartum depression only. Use occurs in postpartum period; safety in pregnancy not established.' }, breastfeeding: { rid: '~0.7% (max ~1.3%)', hale: 'unknown', risk: 'low', notes: 'Low milk levels and poor oral bioavailability; milk levels undetectable in most women ~3 days after infusion. Breastfeeding not contraindicated; arrange separate infant care during the infusion because of maternal sedation/loss of consciousness.' } },
  zuranolone:           { pregnancy: { fdaCategory: 'N/A', risk: 'unknown', notes: 'PLLR-era label only. Animal data shows fetal harm. Contraceptive use required. Very limited human data.' }, breastfeeding: { rid: '~0.7% (label: <1%)', hale: 'unknown', risk: 'low', notes: 'Lactation study: RID ~0.74%; milk levels undetectable 4–6 days after the last dose. LactMed: not expected to cause adverse effects in breastfed infants; monitor for sedation, especially newborn/preterm.' } },
  'dextromethorphan-bupropion': { pregnancy: { fdaCategory: 'N/A', risk: 'caution', notes: 'Combination product. DXM has limited pregnancy data. See bupropion concerns. Avoid unless clearly needed.' }, breastfeeding: { rid: 'Not established', hale: 'unknown', risk: 'avoid', notes: 'Manufacturer recommends avoiding breastfeeding during treatment and for 5 days after the last dose. Components: dextromethorphan milk levels very low (RID <0.5%); bupropion levels low but rare infant seizures reported.' } },
  // FGAs
  haloperidol:          { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Limb reduction defects in early reports (disputed). Neonatal EPS and withdrawal. Most studied FGA; used in hyperemesis.' }, breastfeeding: { rid: '0.2–12%', hale: 'L3', risk: 'caution', notes: 'Low relative infant dose. Developmental concerns with long-term exposure. Use lowest effective dose.' } },
  chlorpromazine:       { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Neonatal EPS, jaundice, sedation. Used historically but less preferred than haloperidol.' }, breastfeeding: { rid: 'Not established', hale: 'L3', risk: 'caution', notes: 'Detected in milk. Neonatal sedation and galactorrhea risk. Monitor closely.' } },
  fluphenazine:         { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Neonatal EPS. Limited data specific to fluphenazine. Long-acting depot adds complexity.' }, breastfeeding: { rid: 'Not established', hale: 'L4', risk: 'avoid', notes: 'Limited data; depot formulation prolongs exposure. Avoid if possible.' } },
  trifluoperazine:      { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Neonatal EPS. Limited human data. Avoid if alternative antipsychotic available.' }, breastfeeding: { rid: 'Not established', hale: 'unknown', risk: 'caution', notes: 'Limited data: milk levels undetectable (<1 mcg/L) at 5–10 mg/day; exposed infants had normal development. Limited experience overall; monitor for sedation and EPS.' } },
  perphenazine:         { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Neonatal EPS, sedation. Some use in refractory hyperemesis. Limited data.' }, breastfeeding: { rid: '~0.1%', hale: 'L3', risk: 'caution', notes: 'Low milk concentrations in limited studies. Monitor infant.' } },
  thiothixene:          { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Limited data. Neonatal EPS possible. Class effect applies.' }, breastfeeding: { rid: 'Not established', hale: 'unknown', risk: 'unknown', notes: 'No published experience; raises prolactin. LactMed: other antipsychotics are preferred.' } },
  pimozide:             { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Very limited data. QT prolongation adds concern. Avoid in pregnancy if possible.' }, breastfeeding: { rid: 'Not established', hale: 'unknown', risk: 'avoid', notes: 'No published experience; raises prolactin. QT risk. LactMed: haloperidol, olanzapine, quetiapine, or risperidone preferred.' } },
  thioridazine:         { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Neonatal EPS, sedation. Withdrawn from many markets due to QT risk. Avoid.' }, breastfeeding: { rid: 'Not established', hale: 'unknown', risk: 'avoid', notes: 'No published experience; raises prolactin; QT risk. LactMed: an alternative (haloperidol, olanzapine, quetiapine, risperidone) is preferred.' } },
  loxapine:             { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Neonatal EPS. Inhaled formulation not studied in pregnancy. Limited data.' }, breastfeeding: { rid: 'Not established', hale: 'unknown', risk: 'unknown', notes: 'No published experience; raises prolactin. LactMed: an alternate drug may be preferred, especially for newborns.' } },
  molindone:            { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Very limited data. Neonatal EPS expected as class effect.' }, breastfeeding: { rid: 'Not established', hale: 'unknown', risk: 'unknown', notes: 'No published experience; galactorrhea reported. LactMed: other antipsychotics are preferred.' } },
  // SGAs
  risperidone:          { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Neonatal EPS and withdrawal reported. Gestational diabetes risk. Most studied SGA after olanzapine.' }, breastfeeding: { rid: '2.3–4.7%', hale: 'L3', risk: 'caution', notes: 'Low relative infant dose. Monitor for sedation and EPS.' } },
  olanzapine:           { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Gestational diabetes, excessive weight gain. Neonatal EPS/withdrawal. Most studied SGA in pregnancy.' }, breastfeeding: { rid: '0.3–2.2%', hale: 'L2', risk: 'low', notes: 'Low relative infant dose. Sedation possible. Monitor weight gain in infant.' } },
  quetiapine:           { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Gestational diabetes risk. Neonatal withdrawal. Commonly used; limited teratogenicity signal.' }, breastfeeding: { rid: '0.07–0.1%', hale: 'L2', risk: 'low', notes: 'Among the lowest relative infant doses of the SGAs (<1%). Generally considered compatible with monitoring for infant sedation.' } },
  aripiprazole:         { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Neonatal EPS and withdrawal. Limited but growing data; no strong teratogenicity signal.' }, breastfeeding: { rid: '0.7–8.3%', hale: 'L3', risk: 'caution', notes: 'Detectable in milk; half-life 75 hr means accumulation. Lowers prolactin; may reduce milk supply. Monitor infant weight gain.' } },
  clozapine:            { pregnancy: { fdaCategory: 'B', risk: 'caution', notes: 'Agranulocytosis monitoring required. Neonatal hypotonia, seizures reported. Reserve for refractory illness.' }, breastfeeding: { rid: '~1.4%', hale: 'L3', risk: 'avoid', notes: 'Risk of infant agranulocytosis and sedation. Avoid; if used, monitor infant CBC.' } },
  ziprasidone:          { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Limited data. QT prolongation consideration. No strong teratogenicity signal.' }, breastfeeding: { rid: '0.07–1.2%', hale: 'unknown', risk: 'caution', notes: 'Limited data: one case with milk ≤11 mcg/L and normal infant development; registry data show no adverse effects with SGAs. LactMed: other antipsychotics may be preferred, especially for newborn/preterm infants. Monitor for sedation, poor feeding, EPS.' } },
  lurasidone:           { pregnancy: { fdaCategory: 'B', risk: 'low',     notes: 'Animal studies reassuring. Limited human data. Neonatal EPS/withdrawal possible.' }, breastfeeding: { rid: '~1.2% (up to ~3% at 80 mg)', hale: 'unknown', risk: 'caution', notes: '>99% protein bound; low milk excretion. Infants in a case and a 9-pair PK study had normal growth and development. LactMed: alternatives may be preferred for newborn/preterm infants.' } },
  asenapine:            { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Limited human data. Neonatal EPS possible. Sublingual route limits maternal systemic exposure.' }, breastfeeding: { rid: 'Not established', hale: 'unknown', risk: 'unknown', notes: 'No asenapine-specific data; SGA registry (576 women) showed no infant harm. LactMed: if required, not a reason to stop breastfeeding.' } },
  paliperidone:         { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Active metabolite of risperidone. Neonatal EPS/withdrawal. Similar concerns to risperidone.' }, breastfeeding: { rid: '~1%', hale: 'L3', risk: 'caution', notes: 'Detected in milk (similar to risperidone). Monitor infant.' } },
  iloperidone:          { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Very limited human data. QT prolongation. Neonatal EPS possible.' }, breastfeeding: { rid: 'Not established', hale: 'unknown', risk: 'unknown', notes: 'No iloperidone-specific data; SGA registry showed no infant harm. LactMed: an alternate drug may be preferred, especially for newborn/preterm infants.' } },
  brexpiprazole:        { pregnancy: { fdaCategory: null, risk: 'caution', notes: 'Limited data. Long half-life. Neonatal EPS/withdrawal possible.' }, breastfeeding: { rid: '~0.7%', hale: 'unknown', risk: 'caution', notes: 'One case: milk 1–6 mcg/L (RID ~0.7%); 3 infants had normal growth and development at 1 month. Several reports of decreased milk supply; monitor infant weight gain. Not a reason to stop breastfeeding if needed.' } },
  cariprazine:          { pregnancy: { fdaCategory: null, risk: 'caution', notes: 'Very limited data. Ultra-long half-life of DCAR metabolite (~1–3 weeks) is a concern.' }, breastfeeding: { rid: 'Not established', hale: 'unknown', risk: 'avoid', notes: 'No human lactation data. >90% protein bound, so milk transfer is likely low, but the very long-acting metabolite (DDCAR) could accumulate in the infant over weeks and lactation may be suppressed. LactMed: alternatives (e.g., quetiapine, olanzapine) may be preferred.' } },
  lumateperone:         { pregnancy: { fdaCategory: null, risk: 'unknown', notes: 'PLLR label only. Limited human data. Avoid unless clearly necessary.' }, breastfeeding: { rid: '~0.06%', hale: 'unknown', risk: 'low', notes: 'Milk levels of drug and metabolites low (RID ~0.06%). LactMed: not expected to cause adverse effects; if required, not a reason to stop breastfeeding.' } },
  pimavanserin:         { pregnancy: { fdaCategory: 'N/A', risk: 'unknown', notes: 'PLLR label. Very limited data. Use in PD psychosis context — weigh risks carefully.' }, breastfeeding: { rid: 'Not established', hale: 'unknown', risk: 'unknown', notes: 'No lactation data. LactMed: if required, not a reason to stop breastfeeding, though haloperidol, olanzapine, quetiapine, or risperidone may be preferred for newborn/preterm infants.' } },
  // Mood stabilizers
  lithium:              { pregnancy: { fdaCategory: 'D', risk: 'avoid',   notes: 'Ebstein\'s anomaly risk (small absolute increase). Neonatal toxicity (floppy baby, cyanosis). If continued, monitor levels closely; hold during labor.' }, breastfeeding: { rid: '12–30%', hale: 'L4', risk: 'avoid', notes: 'High milk-to-plasma ratio. Neonatal toxicity (hypotonia, cyanosis). Avoid; if used, monitor infant levels and hydration.' } },
  valproate:            { pregnancy: { fdaCategory: 'X', risk: 'avoid',   notes: 'Contraindicated in pregnancy for migraine prophylaxis; for epilepsy or bipolar disorder, use only if alternatives are inadequate. Major teratogen — neural tube defects (1–5%), cognitive impairment, autism risk.' }, breastfeeding: { rid: '1–5.6%', hale: 'L2', risk: 'low', notes: 'Low relative infant dose; low milk transfer. Compatible with monitoring of infant LFTs and CBC with long-term use.' } },
  lamotrigine:          { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Oral cleft risk (small, primarily with high doses). Levels drop significantly during pregnancy — monitor closely. Generally preferred mood stabilizer in pregnancy.' }, breastfeeding: { rid: '9.2–18.3%', hale: 'L3', risk: 'caution', notes: 'Significant milk transfer. Infant serum levels can be 30–50% of maternal. Monitor infant for rash, apnea.' } },
  carbamazepine:        { pregnancy: { fdaCategory: 'D', risk: 'avoid',   notes: 'Neural tube defects (~1%), craniofacial anomalies, fetal growth restriction. Avoid; if used, folate supplementation essential.' }, breastfeeding: { rid: '3.4–5.9%', hale: 'L2', risk: 'low', notes: 'Low relative infant dose. Neonatal cholestasis risk with long-term exposure. Monitor LFTs.' } },
  oxcarbazepine:        { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Structural analogue of carbamazepine. Hyponatremia risk. Fetal growth concern. Folate supplementation advised.' }, breastfeeding: { rid: '~1.5%', hale: 'L3', risk: 'caution', notes: 'Active metabolite detected in milk. Monitor infant.' } },
  topiramate:           { pregnancy: { fdaCategory: 'D', risk: 'avoid',   notes: 'Oral cleft risk increased (about 1.5–3× in large cohorts, dose-related). Small for gestational age. Lowers hormonal contraceptive efficacy at >200 mg/day; counsel on reliable contraception. Avoid if alternatives exist.' }, breastfeeding: { rid: '3–24.5%', hale: 'L3', risk: 'caution', notes: 'Detected in milk; infant serum levels variable. Monitor for sedation, poor feeding.' } },
  gabapentin:           { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Neonatal abstinence syndrome with high maternal doses. Fetal anomaly data mixed. Avoid unless clearly necessary.' }, breastfeeding: { rid: '1.3–6.6%', hale: 'L2', risk: 'low', notes: 'Low relative infant dose. Generally considered compatible.' } },
  // Sleep
  zolpidem:             { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Neonatal withdrawal, respiratory depression at high doses. Avoid chronic use. Lowest dose if used.' }, breastfeeding: { rid: '0.02–0.19%', hale: 'L3', risk: 'caution', notes: 'Low milk transfer but sedation risk. Avoid or use single dose and monitor infant.' } },
  eszopiclone:          { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Limited human data. Avoid chronic use; neonatal respiratory depression possible.' }, breastfeeding: { rid: '~1.2–1.4%', hale: 'unknown', risk: 'caution', notes: 'Peak milk ~55 mcg/L; RID ~1.2–1.4%. Occasional use with an older infant poses little risk; an alternative hypnotic may be preferred for newborn/preterm infants.' } },
  temazepam:            { pregnancy: { fdaCategory: 'X', risk: 'avoid',   notes: 'Benzodiazepine — neonatal sedation and withdrawal (floppy infant) with late-pregnancy use; cleft palate signal. Some current labels still list pregnancy as a contraindication.' }, breastfeeding: { rid: '<1%', hale: 'L3', risk: 'caution', notes: 'Excreted in milk. Neonatal sedation. Avoid with newborns; limited use if needed.' } },
  ramelteon:            { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Melatonin receptor agonist. Limited human data. Animal data shows reproductive effects at high doses.' }, breastfeeding: { rid: '~0.24%', hale: 'unknown', risk: 'caution', notes: 'One case: low milk levels (RID ~0.24%). Monitor infant for drowsiness and feeding; LactMed suggests an alternate drug may be preferred until more data exist.' } },
  suvorexant:           { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Orexin antagonist. Limited human data. Avoid chronic use in pregnancy.' }, breastfeeding: { rid: '<1%', hale: 'unknown', risk: 'low', notes: 'Milk levels very low (RID <1%). LactMed: if required, not a reason to stop breastfeeding; monitor for sedation in newborn/preterm infants.' } },
  // Benzodiazepines
  alprazolam:           { pregnancy: { fdaCategory: 'D', risk: 'avoid',   notes: 'Neonatal withdrawal, floppy baby syndrome. Avoid especially in 1st trimester and near term.' }, breastfeeding: { rid: '3–8.5%', hale: 'L3', risk: 'caution', notes: 'Detected in milk. Neonatal sedation, poor feeding. Limit use; monitor infant.' } },
  clonazepam:           { pregnancy: { fdaCategory: 'D', risk: 'avoid',   notes: 'Neonatal withdrawal, apnea, hypotonia. Avoid if possible.' }, breastfeeding: { rid: '~2.8%', hale: 'L3', risk: 'caution', notes: 'Accumulates with repeated dosing. Monitor for sedation.' } },
  diazepam:             { pregnancy: { fdaCategory: 'D', risk: 'avoid',   notes: 'Neonatal withdrawal, floppy infant, cleft palate signal. Active metabolites persist weeks in neonate.' }, breastfeeding: { rid: '~0.9–7%', hale: 'L3', risk: 'caution', notes: 'Long-acting metabolites accumulate in infant. Use with caution; prefer shorter-acting alternatives.' } },
  lorazepam:            { pregnancy: { fdaCategory: 'D', risk: 'avoid',   notes: 'Neonatal sedation, respiratory depression. No active metabolites — preferred benzo if needed acutely.' }, breastfeeding: { rid: '~2.5%', hale: 'L3', risk: 'caution', notes: 'Short-acting; lower accumulation than diazepam. Single doses generally safer than chronic use.' } },
  oxazepam:             { pregnancy: { fdaCategory: 'D', risk: 'avoid',   notes: 'Direct conjugation — no active metabolites. Neonatal withdrawal still possible.' }, breastfeeding: { rid: '~1%', hale: 'L3', risk: 'caution', notes: 'Low milk transfer. One of safer benzos during breastfeeding if needed.' } },
  chlordiazepoxide:     { pregnancy: { fdaCategory: 'D', risk: 'avoid',   notes: 'Active metabolites persist. Withdrawal risk. Avoid.' }, breastfeeding: { rid: 'Not established', hale: 'L3', risk: 'caution', notes: 'Active metabolites detected in milk. Sedation risk.' } },
  clorazepate:          { pregnancy: { fdaCategory: 'D', risk: 'avoid',   notes: 'Prodrug of desmethyldiazepam. Prolonged neonatal effect.' }, breastfeeding: { rid: 'Not established', hale: 'unknown', risk: 'caution', notes: 'Excreted into milk; active metabolite (desmethyldiazepam) accumulates in infant serum; infant sedation reported. LactMed: alternatives preferred, especially for newborns.' } },
  midazolam:            { pregnancy: { fdaCategory: 'D', risk: 'avoid',   notes: 'Short-acting; used in anesthesia. Neonatal respiratory depression with chronic/high-dose use.' }, breastfeeding: { rid: '~0.6%', hale: 'L3', risk: 'caution', notes: 'Single procedural doses: resume breastfeeding once the mother is awake; no need to pump and discard. Avoid repeated or continuous dosing.' } },
  triazolam:            { pregnancy: { fdaCategory: 'X', risk: 'avoid',   notes: 'Neonatal sedation and withdrawal risk with late-pregnancy use; weigh risk and benefit; avoid as a first choice.' }, breastfeeding: { rid: 'Not established', hale: 'L3', risk: 'caution', notes: 'Short-acting. Avoid in breastfeeding newborns; single doses may be permissible.' } },
  estazolam:            { pregnancy: { fdaCategory: 'X', risk: 'avoid',   notes: 'Neonatal sedation and withdrawal risk with late-pregnancy use; weigh risk and benefit; avoid as a first choice.' }, breastfeeding: { rid: 'Not established', hale: 'unknown', risk: 'caution', notes: 'No milk data. Long duration of action — LactMed prefers an alternate hypnotic, especially for newborn/preterm infants. Monitor for sedation and feeding.' } },
  flurazepam:           { pregnancy: { fdaCategory: 'X', risk: 'avoid',   notes: 'Ultra-long half-life active metabolite. Neonatal sedation and withdrawal risk with late-pregnancy use; weigh risk and benefit; avoid as a first choice.' }, breastfeeding: { rid: 'Not established', hale: 'L3', risk: 'avoid', notes: 'Long-acting metabolites accumulate. Avoid during breastfeeding.' } },
  // Other anxiolytics
  buspirone:            { pregnancy: { fdaCategory: 'B', risk: 'low',     notes: 'Animal studies reassuring. Limited human data but no strong teratogenicity signal. First-line anxiolytic consideration in pregnancy.' }, breastfeeding: { rid: '~0.9% (0.2–2.2%)', hale: 'unknown', risk: 'caution', notes: 'Low milk levels at doses up to 45 mg/day; parent drug often undetectable but active metabolite present. No long-term data; LactMed suggests an alternative may be preferred for newborn/preterm infants.' } },
  pregabalin:           { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Early reports suggested a malformation signal, but a large Nordic cohort (Dudukina, BMJ 2022) found no meaningful increase in major malformations. Data still more limited than for gabapentin. Neonatal withdrawal possible.' }, breastfeeding: { rid: '~7%', hale: 'unknown', risk: 'caution', notes: 'Milk levels low (~7% weight-adjusted); modeling suggests subtherapeutic infant levels at 150 mg BID. One infant breastfed 3 months without adverse effects. Monitor for sedation and feeding.' } },
  propranolol:          { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Fetal bradycardia, IUGR, neonatal hypoglycemia. Commonly used for performance anxiety; avoid chronic use near term.' }, breastfeeding: { rid: '<0.5%', hale: 'L2', risk: 'low', notes: 'Low milk transfer. Compatible with infant monitoring for bradycardia.' } },
  clonidine:            { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Neonatal hypotension, rebound hypertension if abruptly stopped. Used for ADHD/HTN; weigh benefit vs. risk.' }, breastfeeding: { rid: '4.1–8.4%', hale: 'L3', risk: 'caution', notes: 'Excreted in milk; neonatal sedation and hypotension possible.' } },
  guanfacine:           { pregnancy: { fdaCategory: 'B', risk: 'low',     notes: 'Animal studies reassuring. Limited human data. Used for ADHD in pregnancy with caution.' }, breastfeeding: { rid: 'Not established', hale: 'unknown', risk: 'unknown', notes: 'No lactation data. LactMed: other agents may be preferred, especially for newborn/preterm infants.' } },
  doxylamine:           { pregnancy: { fdaCategory: 'A', risk: 'low',     notes: 'FDA-approved for nausea/vomiting of pregnancy (Diclegis/Bonjesta with B6). Extensively studied. Safe first-line option.' }, breastfeeding: { rid: 'Not established', hale: 'L1', risk: 'low', notes: 'Category L1 — safest. Antihistamine at low doses. Use with standard dosing; monitor infant for sedation.' } },
  // Stimulants
  methylphenidate:      { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Small cardiac malformation signal in some cohorts (absolute risk low). Neonatal sympathomimetic effects possible. Decide individually; continuing is reasonable when ADHD impairment is significant.' }, breastfeeding: { rid: '0.2–0.4%', hale: 'L3', risk: 'caution', notes: 'Low milk transfer in most studies. Monitor infant for decreased appetite, irritability.' } },
  dexmethylphenidate:   { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Active enantiomer of methylphenidate. Same concerns apply.' }, breastfeeding: { rid: '0.2–0.7%', hale: 'L3', risk: 'caution', notes: 'Same as methylphenidate. Monitor infant.' } },
  'amphetamine-mixed-salts': { pregnancy: { fdaCategory: 'C', risk: 'avoid', notes: 'Preterm birth, IUGR, neonatal withdrawal. Vasoconstrictive effects on placenta. Avoid if possible; if continued, close OB monitoring.' }, breastfeeding: { rid: '1.8–7.5%', hale: 'L3', risk: 'caution', notes: 'Milk levels moderate (RID ~2–7%). Therapeutic ADHD doses: monitor infant for irritability, poor sleep and feeding, and weight gain. Avoid high or escalating doses. May reduce milk supply.' } },
  dextroamphetamine:    { pregnancy: { fdaCategory: 'C', risk: 'avoid',   notes: 'Same vasoconstrictive/withdrawal concerns as mixed amphetamine salts. Avoid.' }, breastfeeding: { rid: '~2–7%', hale: 'L4', risk: 'caution', notes: 'Milk levels moderate (RID ~2–7%). Therapeutic ADHD doses: monitor infant for irritability, poor sleep and feeding, and weight gain. Avoid high or escalating doses. May reduce milk supply.' } },
  lisdexamfetamine:     { pregnancy: { fdaCategory: 'C', risk: 'avoid',   notes: 'Prodrug of d-amphetamine. Same pregnancy concerns. Avoid.' }, breastfeeding: { rid: '2–13.8%', hale: 'L4', risk: 'caution', notes: 'Prodrug of d-amphetamine. Milk levels moderate (RID ~2–7%). Therapeutic ADHD doses: monitor infant for irritability, poor sleep and feeding, and weight gain. Avoid high or escalating doses. May reduce milk supply.' } },
  modafinil:            { pregnancy: { fdaCategory: 'C', risk: 'avoid',   notes: 'Registry data show higher major malformation rates (including cardiac). Avoid in pregnancy. Reduces hormonal contraceptive efficacy; use an additional or non-hormonal method during treatment and for 1 month after stopping.' }, breastfeeding: { rid: 'Not established', hale: 'unknown', risk: 'caution', notes: 'Very limited data: low R-modafinil levels in milk of two mothers; infant serum ~1.6% of maternal (S-enantiomer not measured). No adverse effects reported. LactMed: use with careful infant monitoring, or prefer an alternative.' } },
  armodafinil:          { pregnancy: { fdaCategory: 'C', risk: 'avoid',   notes: 'R-enantiomer of modafinil. Registry data show higher major malformation rates (including cardiac). Avoid in pregnancy. Reduces hormonal contraceptive efficacy; use an additional or non-hormonal method during treatment and for 1 month after stopping.' }, breastfeeding: { rid: 'Not established', hale: 'unknown', risk: 'caution', notes: 'Data from modafinil: low R-modafinil milk levels; infant serum ~1.6% of maternal; no adverse effects in limited reports. LactMed: use with careful infant monitoring or prefer an alternative.' } },
  solriamfetol:         { pregnancy: { fdaCategory: 'N/A', risk: 'unknown', notes: 'PLLR label. Very limited data. Dopamine/norepinephrine reuptake inhibitor — neonatal effects unknown.' }, breastfeeding: { rid: '~5.5%', hale: 'unknown', risk: 'caution', notes: 'Milk levels low (~5.5% of weight-adjusted dose in 6 women); not expected to cause adverse effects. Monitor for agitation, insomnia, poor weight gain.' } },
  // Anticholinergics / Antihistamines
  hydroxyzine:          { pregnancy: { fdaCategory: 'C', risk: 'avoid', notes: 'Label: contraindicated in early pregnancy (animal teratogenicity at high doses). Neonatal withdrawal reported with use near term. Doxylamine-pyridoxine is the labeled option for nausea of pregnancy.' }, breastfeeding: { rid: 'Not established', hale: 'L1', risk: 'low', notes: 'Generally considered compatible. Monitor for sedation.' } },
  diphenhydramine:      { pregnancy: { fdaCategory: 'B', risk: 'low',     notes: 'Commonly used first-line for insomnia/allergy in pregnancy. Avoid near term — neonatal withdrawal, respiratory depression at high doses.' }, breastfeeding: { rid: 'Not established', hale: 'L2', risk: 'low', notes: 'Low dose compatible. High doses or frequent use may reduce milk supply and cause infant sedation.' } },
  trihexyphenidyl:      { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Anticholinergic — may impair fetal gut motility, tachycardia. Very limited data. Avoid if alternatives exist.' }, breastfeeding: { rid: 'Not established', hale: 'unknown', risk: 'caution', notes: 'Doses up to 4 mg/day with haloperidol or risperidone caused no infant adverse effects (follow-up to adulthood). Long-term use may reduce milk supply.' } },
  // ── Added 2026-10-01 (round 4) ──
  'xanomeline-trospium': { pregnancy: { fdaCategory: null, risk: 'unknown', notes: 'Limited human data; post-2015 label with no letter category. Weigh risk and benefit.' }, breastfeeding: { rid: 'Not established', hale: 'unknown', risk: 'unknown', notes: 'No data on xanomeline or trospium in human milk (label).' } },
  'olanzapine-samidorphan': { pregnancy: { fdaCategory: null, risk: 'caution', notes: 'Olanzapine data generally reassuring for major malformations; limited samidorphan data. Neonatal EPS/withdrawal possible after third-trimester antipsychotic exposure.' }, breastfeeding: { rid: 'Not established', hale: 'unknown', risk: 'caution', notes: 'Olanzapine and samidorphan are present in milk at low levels (label); monitor infant for sedation, irritability, poor feeding, and EPS.' } },
  lemborexant: { pregnancy: { fdaCategory: null, risk: 'unknown', notes: 'Limited human data; post-2015 label with no letter category.' }, breastfeeding: { rid: '0.9–2%', hale: 'unknown', risk: 'low', notes: 'Low milk levels (RID ~0.9–2%); five infants without adverse effects at 1 month. LactMed: not a reason to stop breastfeeding; monitor for sedation, especially newborn/preterm.' } },
  daridorexant: { pregnancy: { fdaCategory: null, risk: 'unknown', notes: 'Limited human data; post-2015 label with no letter category.' }, breastfeeding: { rid: '~0.2%', hale: 'unknown', risk: 'low', notes: 'Very low milk levels (RID ~0.22–0.25%). Monitor infant for sedation, poor feeding, and weight gain.' } },
  atomoxetine: { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Limited human pregnancy data; weigh ADHD severity against risk.' }, breastfeeding: { rid: 'Not established', hale: 'unknown', risk: 'caution', notes: 'No milk-level data; manufacturer reported no serious adverse effects in two infants (both slept longer). LactMed: stimulants may be preferred, especially for newborn/preterm infants.' } },
  viloxazine: { pregnancy: { fdaCategory: null, risk: 'unknown', notes: 'Limited human data; post-2015 label with no letter category.' }, breastfeeding: { rid: '~1%', hale: 'unknown', risk: 'caution', notes: 'Milk levels low (RID ~1%; metabolite ~0.07%) in 15 women on 600 mg/day. No infant outcome data; alternatives may be preferred for newborn/preterm infants.' } },
  valbenazine: { pregnancy: { fdaCategory: null, risk: 'unknown', notes: 'Limited human data; post-2015 label with no letter category.' }, breastfeeding: { rid: 'Not established', hale: 'unknown', risk: 'avoid', notes: 'No human data. Label advises avoiding breastfeeding during treatment and for 5 days after the last dose.' } },
  deutetrabenazine: { pregnancy: { fdaCategory: null, risk: 'unknown', notes: 'Limited human data; post-2015 label with no letter category.' }, breastfeeding: { rid: 'Not established', hale: 'unknown', risk: 'unknown', notes: 'No human lactation data.' } },
  naltrexone: { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Limited human data; growing observational data without a clear malformation signal. For OUD in pregnancy, buprenorphine or methadone is preferred.' }, breastfeeding: { rid: '~0.9%', hale: 'unknown', risk: 'low', notes: 'Minimal milk excretion (RID ~0.8–0.9%); infant plasma levels undetectable in a case report. LactMed: not a reason to stop breastfeeding.' } },
  buprenorphine: { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Recommended first-line OUD treatment in pregnancy (with methadone); lower NOWS severity than methadone. Mono-product or combination with naloxone are both acceptable.' }, breastfeeding: { rid: '0.2–0.8%', hale: 'unknown', risk: 'low', notes: 'Low milk transfer (RID ~0.2–0.8%). Stable mothers on buprenorphine are encouraged to breastfeed; monitor infant for drowsiness, breathing, and weight gain.' } },
};

// Ki values in nM. Use 10000 for no clinically significant affinity.
// Sources: PDSP Ki database, FDA labels, published literature.
const MEDICATIONS = [

  // ── SSRIs ──────────────────────────────────────────────────────────────────
  {
    id: 'fluoxetine',
    effects: { weight: 'minimal', sedation: 'minimal', sexual: 'high', antichol: 'minimal', qt: 'low' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 1972, fdaApprovalYear: 1987, originator: "Eli Lilly" },
    dosing: { start: "20 mg PO qAM", target: "20–60 mg/day", max: "80 mg/day", formulations: "IR oral once daily • Delayed-release 90 mg once weekly (Prozac Weekly)", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=fluoxetine" } },
    name: 'Fluoxetine',
    brandName: 'Prozac',
    class: 'SSRI',
    category: 'Antidepressant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '1–3 days (acute); 4–6 days (chronic)', metabolites: 'Norfluoxetine: 4–16 days' },
    tmax: 6,
    pkCurve: { hl: 96, tmax: 6, note: 'chronic dosing; norfluoxetine 4–16 d' },
    p450: {
      substrate: ['CYP2D6','CYP2C9'],
      inhibits: { 'CYP2D6': 'strong', 'CYP2C9': 'moderate', 'CYP2C19': 'strong', 'CYP3A4': 'weak' },
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No dose adjustment required; use with caution in severe renal impairment. Dialysis does not significantly remove fluoxetine.' },
    hepaticImpairment: { modified: true, notes: 'Reduce dose or extend interval' },
    geriatricDosing: { modified: false, notes: 'Caution: prolonged half-life' },
    qtInterval: true,
    proteinBinding: 94,
    receptorKi: {
      SERT: 0.8, NET: 240, DAT: 3600, '5HT1A': 2000, '5HT2A': 200, '5HT2C': 36,
      D2: 5000, H1: 3000, alpha1: 1400, M1: 2000
    },
    indications: [
      { use: 'Major Depressive Disorder', year: 1987 },
      { use: 'Obsessive-Compulsive Disorder', year: 1994 },
      { use: 'Panic Disorder', year: 1994 },
      { use: 'Bulimia Nervosa', year: 1994 },
      { use: 'Premenstrual Dysphoric Disorder', year: 2000 },
      { use: 'Bipolar Depression', year: 2003, dx: 'Bipolar I', phase: 'Depressive episodes', line: 'With olanzapine (Symbyax / olanzapine-fluoxetine)', age: 'Adults' },
      { use: 'Treatment-Resistant Depression (with olanzapine)', year: 2009 },
    ]
  },
  {
    id: 'sertraline',
    effects: { weight: 'low', sedation: 'low', sexual: 'high', antichol: 'minimal', qt: 'minimal' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 1977, fdaApprovalYear: 1991, originator: "Pfizer" },
    dosing: { start: "50 mg PO daily", target: "50–200 mg/day", max: "200 mg/day", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=sertraline" } },
    name: 'Sertraline',
    brandName: 'Zoloft',
    class: 'SSRI',
    category: 'Antidepressant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '26 hr', metabolites: 'N-desmethylsertraline: ~66 hr (weak)' },
    tmax: 6,
    p450: {
      substrate: ['CYP2D6','CYP2C19','CYP3A4','CYP2B6'],
      inhibits: { 'CYP2D6': 'moderate', 'CYP2C19': 'weak' },
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No dose adjustment required based on renal function alone; use with caution.' },
    hepaticImpairment: { modified: true, notes: 'Use with caution; reduce dose' },
    geriatricDosing: { modified: false, notes: 'Generally well-tolerated' },
    qtInterval: false,
    proteinBinding: 98,
    receptorKi: {
      SERT: 0.29, NET: 420, DAT: 25, '5HT1A': 4900, '5HT2A': 127, '5HT2C': 570,
      D2: 10000, H1: 10000, alpha1: 130, M1: 10000
    },
    indications: [
      { use: 'Major Depressive Disorder', year: 1991 },
      { use: 'Obsessive-Compulsive Disorder', year: 1997 },
      { use: 'Panic Disorder', year: 1997 },
      { use: 'Post-Traumatic Stress Disorder', year: 1999 },
      { use: 'Premenstrual Dysphoric Disorder', year: 2002 },
      { use: 'Social Anxiety Disorder', year: 2003 },
    ]
  },
  {
    id: 'escitalopram',
    effects: { weight: 'low', sedation: 'low', sexual: 'high', antichol: 'minimal', qt: 'low' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 1997, fdaApprovalYear: 2002, originator: "H. Lundbeck / Forest" },
    dosing: { start: "10 mg PO daily", target: "10–20 mg/day", max: "20 mg/day (10 mg in elderly/hepatic)", citation: { label: "FDA package insert (2023)", url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2023/021323s055,021365s039lbl.pdf" } },
    name: 'Escitalopram',
    brandName: 'Lexapro',
    class: 'SSRI',
    category: 'Antidepressant',
    activeEnantiomer: { has: true, name: 'S-citalopram (this drug is the active enantiomer of citalopram)' },
    halfLife: { drug: '27–32 hr', metabolites: 'None significant' },
    tmax: 4,
    p450: {
      substrate: ['CYP2C19','CYP3A4','CYP2D6'],
      inhibits: { 'CYP2D6': 'weak' },
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No dose adjustment necessary in mild-to-moderate renal impairment. Use with caution in severe renal impairment (CrCl <20 mL/min); not well studied.' },
    hepaticImpairment: { modified: true, notes: 'Max 10 mg/day' },
    geriatricDosing: { modified: true, notes: 'Max 10 mg/day' },
    qtInterval: true,
    proteinBinding: 56,
    receptorKi: {
      SERT: 1.1, NET: 7800, DAT: 10000, '5HT1A': 10000, '5HT2A': 2900, '5HT2C': 10000,
      D2: 10000, H1: 10000, alpha1: 10000, M1: 10000
    },
    indications: [
      { use: 'Major Depressive Disorder', year: 2002 },
      { use: 'Generalized Anxiety Disorder', year: 2003 },
    ]
  },
  {
    id: 'paroxetine',
    effects: { weight: 'moderate', sedation: 'moderate', sexual: 'high', antichol: 'moderate', qt: 'low' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 1975, fdaApprovalYear: 1992, originator: "Ferrosan / SmithKline Beecham" },
    dosing: { start: "20 mg PO daily", target: "20–50 mg/day", max: "50 mg/day (60 mg OCD)", formulations: "IR once daily (Paxil) • Controlled-release once daily (Paxil CR)", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=paroxetine" } },
    name: 'Paroxetine',
    brandName: 'Paxil',
    class: 'SSRI',
    category: 'Antidepressant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '21 hr', metabolites: 'None significant' },
    tmax: 5,
    p450: {
      substrate: ['CYP2D6'],
      inhibits: { 'CYP2D6': 'strong', 'CYP3A4': 'weak' },
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'Use with caution', severe: 'CrCl <30: start 10 mg/day (IR); max 40 mg/day', notes: 'Dose reduction applies to severe renal impairment (CrCl <30): start 10 mg/day IR (12.5 mg CR); max 40 mg/day IR (50 mg CR).' },
    hepaticImpairment: { modified: true, notes: 'Use with caution; reduce dose' },
    geriatricDosing: { modified: true, notes: 'Use with caution (anticholinergic burden)' },
    qtInterval: false,
    proteinBinding: 95,
    receptorKi: {
      SERT: 0.13, NET: 39, DAT: 490, '5HT1A': 10000, '5HT2A': 1300, '5HT2C': 140,
      D2: 10000, H1: 10000, alpha1: 100, M1: 17
    },
    indications: [
      { use: 'Major Depressive Disorder', year: 1992 },
      { use: 'Obsessive-Compulsive Disorder', year: 1996 },
      { use: 'Panic Disorder', year: 1996 },
      { use: 'Social Anxiety Disorder', year: 1999 },
      { use: 'Generalized Anxiety Disorder', year: 2001 },
      { use: 'Post-Traumatic Stress Disorder', year: 2001 },
      { use: 'Premenstrual Dysphoric Disorder', year: 2003 },
    ]
  },
  {
    id: 'citalopram',
    effects: { weight: 'low', sedation: 'low', sexual: 'high', antichol: 'minimal', qt: 'moderate' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 1972, fdaApprovalYear: 1998, originator: "H. Lundbeck / Forest" },
    dosing: { start: "20 mg PO daily", target: "20–40 mg/day", max: "40 mg/day (20 mg if >60 yr, hepatic, or CYP2C19 PM)", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=citalopram" } },
    name: 'Citalopram',
    brandName: 'Celexa',
    class: 'SSRI',
    category: 'Antidepressant',
    activeEnantiomer: { has: true, name: 'Escitalopram (S-citalopram)' },
    halfLife: { drug: '35 hr', metabolites: 'Desmethylcitalopram: weak, ~50 hr' },
    tmax: 4,
    p450: {
      substrate: ['CYP2C19','CYP3A4','CYP2D6'],
      inhibits: { 'CYP2D6': 'weak' },
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No dose adjustment needed in mild-to-moderate renal impairment. Severe renal impairment not well studied; use with caution.' },
    hepaticImpairment: { modified: true, notes: 'Max 20 mg/day' },
    geriatricDosing: { modified: true, notes: 'Max 20 mg/day (QT risk)' },
    qtInterval: true,
    proteinBinding: 80,
    receptorKi: {
      SERT: 1.8, NET: 4070, DAT: 10000, '5HT1A': 10000, '5HT2A': 10000, '5HT2C': 617,
      D2: 10000, H1: 10000, alpha1: 10000, M1: 10000
    },
    indications: [
      { use: 'Major Depressive Disorder', year: 1998 },
    ]
  },
  {
    id: 'fluvoxamine',
    effects: { weight: 'low', sedation: 'moderate', sexual: 'high', antichol: 'minimal', qt: 'low' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 1977, fdaApprovalYear: 1994, originator: "Solvay (Kali-Duphar)" },
    dosing: { start: "50 mg PO qHS", target: "100–300 mg/day", max: "300 mg/day (divide doses >100 mg)", formulations: "IR (BID when >100 mg; Luvox) • CR once daily (Luvox CR)", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=fluvoxamine" } },
    name: 'Fluvoxamine',
    brandName: 'Luvox',
    class: 'SSRI',
    category: 'Antidepressant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '15–22 hr', metabolites: 'None significant' },
    tmax: 4,
    p450: {
      substrate: ['CYP1A2','CYP2D6'],
      inhibits: { 'CYP1A2': 'strong', 'CYP2C19': 'strong', 'CYP2C9': 'moderate', 'CYP3A4': 'moderate' },
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No dose adjustment required. Use with caution in severe renal impairment; not extensively studied.' },
    hepaticImpairment: { modified: true, notes: 'Start low, slow titration' },
    geriatricDosing: { modified: true, notes: 'Use with caution; drug interactions' },
    qtInterval: false,
    proteinBinding: 77,
    receptorKi: {
      SERT: 2.2, NET: 1300, DAT: 9100, '5HT1A': 10000, '5HT2A': 2000, '5HT2C': 4400,
      D2: 10000, H1: 10000, alpha1: 10000, M1: 10000
    },
    indications: [
      { use: 'Obsessive-Compulsive Disorder', year: 1994 },
      { use: 'Social Anxiety Disorder', year: 2008 },
    ]
  },

  // ── SNRIs ──────────────────────────────────────────────────────────────────
  {
    id: 'venlafaxine',
    effects: { weight: 'low', sedation: 'low', sexual: 'high', antichol: 'minimal', qt: 'low' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 1983, fdaApprovalYear: 1993, originator: "Wyeth (Pfizer)" },
    dosing: { start: "37.5–75 mg/day", target: "75–225 mg/day", max: "375 mg/day (IR); 225 mg/day (XR)", formulations: "IR BID–TID (Effexor) • XR once daily (Effexor XR)", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=venlafaxine" } },
    name: 'Venlafaxine',
    brandName: 'Effexor',
    class: 'SNRI',
    category: 'Antidepressant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '5 hr', metabolites: 'O-desmethylvenlafaxine (desvenlafaxine): 11 hr' },
    tmax: 2,
    p450: {
      substrate: ['CYP2D6','CYP3A4'],
      inhibits: { 'CYP2D6': 'weak' },
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'Reduce dose 25–50%', severe: 'Reduce dose 50%; dialysis patients: reduce 50% + give after dialysis' },
    hepaticImpairment: { modified: true, notes: 'Reduce dose 50%' },
    geriatricDosing: { modified: false, notes: 'Monitor blood pressure' },
    qtInterval: false,
    proteinBinding: 27,
    receptorKi: {
      SERT: 82, NET: 2480, DAT: 10000, '5HT1A': 10000, '5HT2A': 10000, '5HT2C': 10000,
      D2: 10000, H1: 10000, alpha1: 10000, M1: 10000
    },
    indications: [
      { use: 'Major Depressive Disorder', year: 1993 },
      { use: 'Generalized Anxiety Disorder', year: 1999 },
      { use: 'Social Anxiety Disorder', year: 1999 },
      { use: 'Panic Disorder', year: 2001 },
    ]
  },
  {
    id: 'duloxetine',
    effects: { weight: 'low', sedation: 'low', sexual: 'moderate', antichol: 'low', qt: 'minimal' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 1988, fdaApprovalYear: 2004, originator: "Eli Lilly" },
    dosing: { start: "30–60 mg/day", target: "60 mg/day", max: "120 mg/day", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=duloxetine" } },
    name: 'Duloxetine',
    brandName: 'Cymbalta',
    class: 'SNRI',
    category: 'Antidepressant',
    activeEnantiomer: { has: true, name: '(-)-duloxetine; this drug is the S-enantiomer' },
    halfLife: { drug: '12 hr', metabolites: 'None clinically significant' },
    tmax: 6,
    p450: {
      substrate: ['CYP1A2','CYP2D6'],
      inhibits: { 'CYP2D6': 'moderate' },
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'Use with caution (CrCl 30–60)', severe: 'Avoid (CrCl <30)' },
    hepaticImpairment: { modified: true, notes: 'Avoid in significant hepatic disease' },
    geriatricDosing: { modified: false, notes: 'Use with caution; fall risk' },
    qtInterval: false,
    proteinBinding: 90,
    receptorKi: {
      SERT: 0.8, NET: 7.5, DAT: 240, '5HT1A': 10000, '5HT2A': 10000, '5HT2C': 10000,
      D2: 10000, H1: 2900, alpha1: 10000, M1: 10000
    },
    indications: [
      { use: 'Major Depressive Disorder', year: 2004 },
      { use: 'Diabetic Peripheral Neuropathy', year: 2004 },
      { use: 'Generalized Anxiety Disorder', year: 2007 },
      { use: 'Fibromyalgia', year: 2008 },
      { use: 'Chronic Musculoskeletal Pain', year: 2010 },
      { use: 'Stress Urinary Incontinence', year: 2004 },
    ]
  },
  {
    id: 'desvenlafaxine',
    effects: { weight: 'low', sedation: 'low', sexual: 'moderate', antichol: 'minimal', qt: 'minimal' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 1996, fdaApprovalYear: 2008, originator: "Wyeth (Pfizer)" },
    dosing: { start: "50 mg PO daily", target: "50 mg/day", max: "50 mg/day recommended (up to 400 mg studied; no added benefit >50 mg)", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=desvenlafaxine" } },
    name: 'Desvenlafaxine',
    brandName: 'Pristiq',
    class: 'SNRI',
    category: 'Antidepressant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '11 hr', metabolites: 'None significant' },
    tmax: 7.5,
    p450: {
      substrate: ['CYP3A4'],
      inhibits: { 'CYP2D6': 'weak' },
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'Max 50 mg/day', severe: 'Max 50 mg every other day' },
    hepaticImpairment: { modified: true, notes: 'Max 100 mg/day' },
    geriatricDosing: { modified: false, notes: 'No specific adjustment' },
    qtInterval: false,
    proteinBinding: 30,
    receptorKi: {
      SERT: 40, NET: 558, DAT: 10000, '5HT1A': 10000, '5HT2A': 10000, '5HT2C': 10000,
      D2: 10000, H1: 10000, alpha1: 10000, M1: 10000
    },
    indications: [
      { use: 'Major Depressive Disorder', year: 2008 },
    ]
  },

  // ── TCAs ───────────────────────────────────────────────────────────────────
  {
    id: 'amitriptyline',
    effects: { weight: 'high', sedation: 'high', sexual: 'moderate', antichol: 'high', qt: 'high' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 1960, fdaApprovalYear: 1961, originator: "Merck" },
    dosing: { start: "25–50 mg qHS", target: "100–200 mg/day", max: "300 mg/day", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=amitriptyline" } },
    name: 'Amitriptyline',
    brandName: 'Elavil',
    class: 'TCA',
    category: 'Antidepressant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '10–28 hr', metabolites: 'Nortriptyline: 20–100 hr' },
    tmax: 4,
    p450: {
      substrate: ['CYP1A2','CYP2C19','CYP2D6','CYP3A4'],
      inhibits: { 'CYP2D6': 'weak' },
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No specific dose adjustment recommended; use with caution. Renally cleared metabolites may accumulate.' },
    hepaticImpairment: { modified: true, notes: 'Use with caution' },
    geriatricDosing: { modified: true, notes: 'Avoid (Beers List); anticholinergic burden' },
    qtInterval: true,
    proteinBinding: 94,
    receptorKi: {
      SERT: 3.5, NET: 19, DAT: 3200, '5HT1A': 450, '5HT2A': 18, '5HT2C': 4,
      D2: 1100, H1: 1, alpha1: 27, alpha2: 900, M1: 17
    },
    indications: [
      { use: 'Major Depressive Disorder', year: 1961 },
    ]
  },
  {
    id: 'nortriptyline',
    effects: { weight: 'moderate', sedation: 'moderate', sexual: 'low', antichol: 'moderate', qt: 'moderate' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 1962, fdaApprovalYear: 1964, originator: "Eli Lilly" },
    dosing: { start: "25 mg qHS", target: "75–100 mg/day", max: "150 mg/day", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=nortriptyline" } },
    name: 'Nortriptyline',
    brandName: 'Pamelor',
    class: 'TCA',
    category: 'Antidepressant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '20–100 hr', metabolites: '10-OH-nortriptyline: active' },
    tmax: 5,
    p450: {
      substrate: ['CYP2D6'],
      inhibits: { 'CYP2D6': 'weak' },
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No specific dose adjustment recommended; use with caution as active metabolites may accumulate in severe renal impairment.' },
    hepaticImpairment: { modified: true, notes: 'Use with caution' },
    geriatricDosing: { modified: true, notes: 'Use with caution; monitor levels' },
    qtInterval: true,
    proteinBinding: 92,
    receptorKi: {
      SERT: 18, NET: 4.4, DAT: 1140, '5HT1A': 294, '5HT2A': 41, '5HT2C': 8,
      D2: 2000, H1: 6, alpha1: 57, alpha2: 10000, M1: 149
    },
    indications: [
      { use: 'Major Depressive Disorder', year: 1964 },
    ]
  },
  {
    id: 'imipramine',
    effects: { weight: 'moderate', sedation: 'moderate', sexual: 'moderate', antichol: 'high', qt: 'high' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 1951, fdaApprovalYear: 1959, originator: "Geigy (Novartis)" },
    dosing: { start: "25–75 mg/day", target: "100–200 mg/day", max: "300 mg/day", formulations: "IR HCl in divided doses • Pamoate capsules once daily (Tofranil-PM)", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=imipramine" } },
    name: 'Imipramine',
    brandName: 'Tofranil',
    class: 'TCA',
    category: 'Antidepressant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '11–25 hr', metabolites: 'Desipramine: 12–76 hr' },
    tmax: 2,
    p450: {
      substrate: ['CYP1A2','CYP2C19','CYP2D6','CYP3A4'],
      inhibits: { 'CYP2D6': 'weak' },
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No specific dose adjustment recommended. Use with caution; metabolites may accumulate.' },
    hepaticImpairment: { modified: true, notes: 'Use with caution' },
    geriatricDosing: { modified: true, notes: 'Avoid (Beers List)' },
    qtInterval: true,
    proteinBinding: 90,
    receptorKi: {
      SERT: 1.4, NET: 37, DAT: 8500, '5HT1A': 10000, '5HT2A': 150, '5HT2C': 120,
      D2: 3600, H1: 11, alpha1: 50, alpha2: 10000, M1: 57
    },
    indications: [
      { use: 'Major Depressive Disorder', year: 1959 },
      { use: 'Nocturnal Enuresis (pediatric)', year: 1974 },
    ]
  },

  // ── MAOIs ──────────────────────────────────────────────────────────────────
  {
    id: 'phenelzine',
    effects: { weight: 'moderate', sedation: 'moderate', sexual: 'high', antichol: 'low', qt: 'low' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 1959, fdaApprovalYear: 1961, originator: "Warner-Chilcott (Parke-Davis)" },
    dosing: { start: "15 mg TID", target: "60–90 mg/day", max: "90 mg/day", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=phenelzine" } },
    name: 'Phenelzine',
    brandName: 'Nardil',
    class: 'MAOI',
    category: 'Antidepressant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '11–12 hr', metabolites: 'Irreversible MAO-A/B inhibition persists 2–3 weeks' },
    tmax: 0.75,
    p450: {
      substrate: [],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'Use with caution', severe: 'Use with caution' },
    hepaticImpairment: { modified: true, notes: 'Contraindicated with a history of liver disease or abnormal liver function tests.' },
    geriatricDosing: { modified: true, notes: 'Use with caution; fall/orthostatic risk' },
    qtInterval: false,
    proteinBinding: null,
    proteinBindingNote: 'Not reported in the label',
    receptorKi: null,
    mechanism: 'Irreversible non-selective MAO-A and MAO-B inhibitor; increases synaptic monoamines (NE, 5HT, DA)',
    indications: [
      { use: 'Major Depressive Disorder (atypical)', year: 1961 },
    ]
  },
  {
    id: 'tranylcypromine',
    effects: { weight: 'low', sedation: 'minimal', sexual: 'moderate', antichol: 'low', qt: 'low' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 1948, fdaApprovalYear: 1961, originator: "Smith Kline & French" },
    dosing: { start: "10 mg BID", target: "30–60 mg/day", max: "60 mg/day", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=tranylcypromine" } },
    name: 'Tranylcypromine',
    brandName: 'Parnate',
    class: 'MAOI',
    category: 'Antidepressant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '2–3 hr', metabolites: 'Irreversible MAO-A/B inhibition persists 1–2 weeks' },
    tmax: 1.5,
    p450: {
      substrate: ['CYP2A6'],
      inhibits: { 'CYP2A6': 'strong', 'CYP2C19': 'moderate' },
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'Use with caution', severe: 'Use with caution' },
    hepaticImpairment: { modified: true, notes: 'Contraindicated in hepatic disease' },
    geriatricDosing: { modified: true, notes: 'Use with caution' },
    qtInterval: false,
    proteinBinding: null,
    proteinBindingNote: 'Not reported in the label',
    receptorKi: null,
    mechanism: 'Irreversible non-selective MAO-A and MAO-B inhibitor; mild dopamine-releasing properties',
    indications: [
      { use: 'Major Depressive Disorder (atypical)', year: 1961 },
    ]
  },

  // ── Other Antidepressants ──────────────────────────────────────────────────
  {
    id: 'bupropion',
    effects: { weight: 'minimal', sedation: 'minimal', sexual: 'minimal', antichol: 'minimal', qt: 'minimal' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 1969, fdaApprovalYear: 1985, originator: "Burroughs Wellcome (GSK)" },
    dosing: { start: "150 mg/day (SR/XL)", target: "300 mg/day", max: "450 mg/day (IR/XL); 400 mg/day (SR)", formulations: "IR BID–TID (Wellbutrin) • SR BID (Wellbutrin SR / Zyban) • XL once daily (Wellbutrin XL)", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=bupropion" } },
    name: 'Bupropion',
    brandName: 'Wellbutrin',
    class: 'NDRI',
    category: 'Antidepressant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '21 hr', metabolites: 'Hydroxybupropion: 20 hr; threohydrobupropion: 37 hr' },
    tmax: 3,
    p450: {
      substrate: ['CYP2B6'],
      inhibits: { 'CYP2D6': 'strong' },
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'Use with caution', severe: 'Reduce dose/frequency' },
    hepaticImpairment: { modified: true, notes: 'Severe hepatic cirrhosis: max 75 mg/day (IR), 100 mg/day or 150 mg every other day (SR), 150 mg every other day (XL). Mild-moderate impairment: consider reducing the dose and/or frequency.' },
    geriatricDosing: { modified: true, notes: 'Start low; seizure risk consideration' },
    qtInterval: false,
    proteinBinding: 84,
    receptorKi: {
      SERT: 10000, NET: 10000, DAT: 526, '5HT1A': 10000, '5HT2A': 10000, '5HT2C': 10000,
      D2: 4550, H1: 6700, alpha1: 10000, M1: 10000
    },
    indications: [
      { use: 'Major Depressive Disorder', year: 1985 },
      { use: 'Seasonal Affective Disorder', year: 2006 },
      { use: 'Smoking Cessation (as Zyban)', year: 1997 },
    ]
  },
  {
    id: 'mirtazapine',
    effects: { weight: 'high', sedation: 'high', sexual: 'minimal', antichol: 'low', qt: 'low' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 1989, fdaApprovalYear: 1996, originator: "Organon (Merck)" },
    dosing: { start: "15 mg qHS", target: "15–45 mg/day", max: "45 mg/day", formulations: "Tablet • Orally disintegrating (SolTab) — both once daily", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=mirtazapine" } },
    name: 'Mirtazapine',
    brandName: 'Remeron',
    class: 'NaSSA',
    category: 'Antidepressant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '20–40 hr', metabolites: 'None significant' },
    tmax: 2,
    p450: {
      substrate: ['CYP1A2','CYP2D6','CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'GFR 11–39: clearance decreased ~30%; use with caution', severe: 'GFR <10: clearance decreased ~50%; use with caution' },
    hepaticImpairment: { modified: true, notes: 'Use with caution; clearance decreased ~30%' },
    geriatricDosing: { modified: true, notes: 'Start 7.5 mg; clearance reduced in elderly' },
    qtInterval: true,
    proteinBinding: 85,
    receptorKi: {
      SERT: 10000, NET: 4600, DAT: 10000, '5HT1A': 500, '5HT2A': 18, '5HT2C': 6,
      D2: 1600, H1: 1.6, alpha1: 270, alpha2: 36, M1: 10000
    },
    indications: [
      { use: 'Major Depressive Disorder', year: 1996 },
    ]
  },
  {
    id: 'trazodone',
    effects: { weight: 'low', sedation: 'high', sexual: 'low', antichol: 'minimal', qt: 'moderate' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 1966, fdaApprovalYear: 1981, originator: "Angelini / Mead Johnson" },
    dosing: { start: "150 mg/day (depression); 25–100 mg qHS (insomnia)", target: "150–400 mg/day", max: "600 mg/day (inpatient)", formulations: "IR BID or qHS • ER once daily (Oleptro)", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=trazodone" } },
    name: 'Trazodone',
    brandName: 'Desyrel',
    class: 'SARI',
    category: 'Sleep',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '5–9 hr (terminal; biphasic, initial phase 3–6 hr)', metabolites: 'mCPP (active, 5HT2C agonist): 4–8 hr' },
    tmax: 1,
    p450: {
      substrate: ['CYP3A4'],
      inhibits: { 'CYP3A4': 'weak' },
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No dose adjustment required per labeling. Use with caution in severe renal impairment; monitor for adverse effects.' },
    hepaticImpairment: { modified: true, notes: 'Use with caution' },
    geriatricDosing: { modified: true, notes: 'Start low; orthostatic/fall risk' },
    qtInterval: true,
    proteinBinding: 92,
    receptorKi: {
      SERT: 160, NET: 8300, DAT: 10000, '5HT1A': 100, '5HT2A': 36, '5HT2C': 230,
      D2: 2500, H1: 220, alpha1: 18, alpha2: 10000, M1: 10000
    },
    indications: [
      { use: 'Major Depressive Disorder', year: 1981 },
    ]
  },
  {
    id: 'vilazodone',
    effects: { weight: 'minimal', sedation: 'low', sexual: 'low', antichol: 'minimal', qt: 'minimal' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 2001, fdaApprovalYear: 2011, originator: "Merck KGaA / Clinical Data" },
    dosing: { start: "10 mg/day ×7 d, then 20 mg ×7 d", target: "40 mg/day", max: "40 mg/day", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=vilazodone" } },
    name: 'Vilazodone',
    brandName: 'Viibryd',
    class: 'SSRI/5HT1A',
    category: 'Antidepressant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '25 hr', metabolites: 'None significant' },
    tmax: 4.5,
    p450: {
      substrate: ['CYP3A4'],
      inhibits: { 'CYP2C8': 'weak', 'CYP2D6': 'weak' },
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No dose adjustment required in renal impairment, including severe (CrCl 15–29 mL/min).' },
    hepaticImpairment: { modified: true, notes: 'Use with caution in severe' },
    geriatricDosing: { modified: false, notes: 'No specific adjustment' },
    qtInterval: false,
    proteinBinding: 97,
    receptorKi: {
      SERT: 0.1, NET: 10000, DAT: 10000, '5HT1A': 2.3, '5HT2A': 10000, '5HT2C': 10000,
      D2: 10000, H1: 10000, alpha1: 10000, M1: 10000
    },
    indications: [
      { use: 'Major Depressive Disorder', year: 2011 },
    ]
  },

  // ── FGAs (First-Generation Antipsychotics) ─────────────────────────────────
  {
    id: 'haloperidol',
    effects: { weight: 'low', sedation: 'low', sexual: 'moderate', antichol: 'minimal', qt: 'moderate' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 1958, fdaApprovalYear: 1967, originator: "Janssen" },
    dosing: { start: "0.5–5 mg BID–TID", target: "5–20 mg/day", max: "30 mg/day (higher in acute agitation)", formulations: "Oral tab/solution • Lactate IM/IV (acute) • Decanoate LAI every ~4 weeks", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=haloperidol" } },
    name: 'Haloperidol',
    brandName: 'Haldol',
    class: 'FGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '21–24 hr', metabolites: 'Reduced haloperidol (less active)' },
    tmax: 4,
    p450: {
      substrate: ['CYP2D6','CYP3A4'],
      inhibits: { 'CYP2D6': 'moderate' },
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No specific dose adjustment recommended. Use with caution; some metabolites are renally excreted.' },
    hepaticImpairment: { modified: true, notes: 'Use with caution' },
    geriatricDosing: { modified: true, notes: 'Start low; avoid in dementia (Beers)' },
    qtInterval: true,
    proteinBinding: 92,
    receptorKi: {
      SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 1900, '5HT2A': 53, '5HT2C': 10000,
      D1: 50, D2: 1.5, D3: 1, H1: 1300, alpha1: 12, M1: 10000
    },
    indications: [
      { use: 'Schizophrenia', year: 1967 },
      { use: 'Tourette Syndrome', year: 1978 },
      { use: 'Acute Psychosis / Agitation', year: 1967 },
    ]
  },
  {
    id: 'chlorpromazine',
    effects: { weight: 'moderate', sedation: 'high', sexual: 'moderate', antichol: 'moderate', qt: 'moderate' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 1950, fdaApprovalYear: 1954, originator: "Rhône-Poulenc / Smith Kline & French" },
    dosing: { start: "25–100 mg/day", target: "300–800 mg/day", max: "1000 mg/day", formulations: "Oral tablet • IM/IV injection (acute)", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=chlorpromazine" } },
    name: 'Chlorpromazine',
    brandName: 'Thorazine',
    class: 'FGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '16–30 hr', metabolites: 'Multiple active metabolites' },
    tmax: 3,
    p450: {
      substrate: ['CYP2D6','CYP1A2'],
      inhibits: { 'CYP2D6': 'moderate' },
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No specific dose adjustment; use with caution in renal impairment. Avoid in severe renal failure if possible.' },
    hepaticImpairment: { modified: true, notes: 'Use with caution' },
    geriatricDosing: { modified: true, notes: 'Avoid (Beers List); many side effects' },
    qtInterval: true,
    proteinBinding: 95,
    receptorKi: {
      SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 200, '5HT2A': 3, '5HT2C': 15,
      D1: 30, D2: 3, D3: 10, H1: 3, alpha1: 5, alpha2: 10000, M1: 40
    },
    indications: [
      { use: 'Schizophrenia', year: 1954 },
      { use: 'Nausea / Vomiting', year: 1954 },
      { use: 'Intractable Hiccups', year: 1954 },
      { use: 'Bipolar Mania', year: 1957, dx: 'Bipolar I', phase: 'Manic phase', line: 'Monotherapy', age: 'Adults' },
    ]
  },
  {
    id: 'fluphenazine',
    effects: { weight: 'low', sedation: 'low', sexual: 'moderate', antichol: 'low', qt: 'low' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 1959, fdaApprovalYear: 1959, originator: "Squibb (Bristol-Myers Squibb)" },
    dosing: { start: "2.5–10 mg/day", target: "5–20 mg/day", max: "40 mg/day", formulations: "Oral tab/elixir • HCl IM (acute) • Decanoate LAI every 2–3 weeks", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=fluphenazine" } },
    name: 'Fluphenazine',
    brandName: 'Prolixin',
    class: 'FGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '14–24 hr (oral)', metabolites: 'None significant' },
    tmax: 2,
    p450: {
      substrate: ['CYP2D6'],
      inhibits: { 'CYP2D6': 'weak' },
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No specific dose adjustment recommended. Use with caution in renal impairment.' },
    hepaticImpairment: { modified: true, notes: 'Use with caution' },
    geriatricDosing: { modified: true, notes: 'Use lower doses' },
    qtInterval: true,
    proteinBinding: 99,
    receptorKi: {
      SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 820, '5HT2A': 8, '5HT2C': 29,
      D1: 12, D2: 1, D3: 1, H1: 10, alpha1: 7, M1: 10000
    },
    indications: [
      { use: 'Schizophrenia', year: 1959 },
      { use: 'Psychotic Disorders', year: 1959 },
    ]
  },

  // ── SGAs (Second-Generation Antipsychotics) ────────────────────────────────
  {
    id: 'risperidone',
    effects: { weight: 'moderate', sedation: 'low', sexual: 'high', antichol: 'minimal', qt: 'low' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 1988, fdaApprovalYear: 1993, originator: "Janssen" },
    dosing: { start: "1 mg BID (2 mg/day)", target: "4–6 mg/day", max: "16 mg/day", formulations: "Oral tab/solution/ODT • LAI (Consta q2wk; Perseris/Uzedy monthly)", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=risperidone" } },
    name: 'Risperidone',
    brandName: 'Risperdal',
    class: 'SGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '3 hr (20 hr in CYP2D6 PMs)', metabolites: '9-OH-risperidone (paliperidone): 21 hr' },
    tmax: 1,
    pkCurve: { note: 'parent; active moiety with 9-OH ~20 h' },
    p450: {
      substrate: ['CYP2D6','CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'Start 0.5 mg BID, titrate slowly', severe: 'Start 0.5 mg BID, titrate slowly' },
    hepaticImpairment: { modified: true, notes: 'Start 0.5 mg BID' },
    geriatricDosing: { modified: true, notes: 'Start 0.5 mg; increased stroke risk in dementia' },
    qtInterval: true,
    proteinBinding: 88,
    receptorKi: {
      SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 210, '5HT2A': 0.16, '5HT2C': 25,
      D1: 400, D2: 3.6, D3: 10, H1: 41, alpha1: 2.1, alpha2: 10,
      M1: 10000
    },
    indications: [
      { use: 'Schizophrenia', year: 1993 },
      { use: 'Bipolar Mania', year: 2003, dx: 'Bipolar I', phase: 'Acute manic or mixed episodes', line: 'Monotherapy or adjunct to lithium/valproate', age: 'Adults & 10-17 yr' },
      { use: 'Bipolar Maintenance', year: 2009, dx: 'Bipolar I', phase: 'Maintenance', line: 'Long-acting injectable (Risperdal Consta); monotherapy or adjunct', age: 'Adults' },
      { use: 'Autism-Associated Irritability', year: 2006 },
    ]
  },
  {
    id: 'olanzapine',
    effects: { weight: 'high', sedation: 'high', sexual: 'low', antichol: 'moderate', qt: 'low' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 1991, fdaApprovalYear: 1996, originator: "Eli Lilly" },
    dosing: { start: "5–10 mg/day", target: "10–20 mg/day", max: "20 mg/day", formulations: "Oral tab/ODT (Zydis) • IM (acute) • LAI (Relprevv, q2–4 weeks)", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=olanzapine" } },
    name: 'Olanzapine',
    brandName: 'Zyprexa',
    class: 'SGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '21–54 hr', metabolites: 'N-desmethylolanzapine: weak' },
    tmax: 6,
    p450: {
      substrate: ['CYP1A2','CYP2D6'],
      inhibits: { 'CYP1A2': 'weak' },
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No dose adjustment required based on renal function. Olanzapine is not significantly renally cleared.' },
    hepaticImpairment: { modified: true, notes: 'Start 5 mg; titrate slowly' },
    geriatricDosing: { modified: true, notes: 'Start 2.5–5 mg; increased mortality in dementia' },
    qtInterval: false,
    proteinBinding: 93,
    receptorKi: {
      SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 4400, '5HT2A': 4, '5HT2C': 11,
      D1: 32, D2: 11, D3: 49, H1: 7, alpha1: 19, alpha2: 230,
      M1: 73
    },
    receptorNote: 'Muscarinic M1–M5 Ki 73, 96, 132, 32, 48 nM (human cloned receptors, label §12.2); older rat-tissue values (~2 nM) overstated muscarinic affinity.',
    indications: [
      { use: 'Schizophrenia', year: 1996 },
      { use: 'Bipolar Mania', year: 2000, dx: 'Bipolar I', phase: 'Acute manic or mixed episodes', line: 'Monotherapy or adjunct to lithium/valproate', age: 'Adults & 13-17 yr' },
      { use: 'Bipolar Depression', year: 2003, dx: 'Bipolar I', phase: 'Depressive episodes', line: 'With fluoxetine (Symbyax / olanzapine-fluoxetine)', age: 'Adults' },
      { use: 'Bipolar Maintenance', year: 2004, dx: 'Bipolar I', phase: 'Maintenance', line: 'Monotherapy', age: 'Adults' },
      { use: 'Treatment-Resistant Depression (with fluoxetine)', year: 2009 },
      { use: 'Agitation in Schizophrenia/Bipolar (IM)', year: 2004 },
    ]
  },
  {
    id: 'quetiapine',
    effects: { weight: 'moderate', sedation: 'high', sexual: 'minimal', antichol: 'low', qt: 'moderate' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 1985, fdaApprovalYear: 1997, originator: "Zeneca (AstraZeneca)" },
    dosing: { start: "25–50 mg BID", target: "400–800 mg/day", max: "800 mg/day", formulations: "IR BID (Seroquel) • XR once daily (Seroquel XR)", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=quetiapine" } },
    name: 'Quetiapine',
    brandName: 'Seroquel',
    class: 'SGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '6–7 hr', metabolites: 'Norquetiapine (active, NET inhibition): 12 hr' },
    tmax: 1.5,
    p450: {
      substrate: ['CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No dose adjustment necessary. Quetiapine and metabolites are primarily hepatically cleared.' },
    hepaticImpairment: { modified: true, notes: 'Start 25 mg; increase 25–50 mg/day' },
    geriatricDosing: { modified: true, notes: 'Start 25–50 mg; increased mortality in dementia' },
    qtInterval: true,
    proteinBinding: 83,
    receptorKi: {
      SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 5300, '5HT2A': 22, '5HT2C': 220,
      D1: 10000, D2: 170, D3: 340, H1: 30, alpha1: 94, alpha2: 10000,
      M1: 300
    },
    receptorNote: 'Parent quetiapine has modest muscarinic affinity; the active metabolite norquetiapine binds M1 more strongly (Ki ~39 nM) and inhibits NET, which explains anticholinergic and antidepressant effects.',
    indications: [
      { use: 'Schizophrenia', year: 1997 },
      { use: 'Bipolar Mania', year: 2004, dx: 'Bipolar I', phase: 'Acute manic episodes', line: 'Monotherapy or adjunct to lithium/valproate', age: 'Adults & 10-17 yr' },
      { use: 'Bipolar Depression', year: 2006, dx: 'Bipolar I or II', phase: 'Depressive episodes', line: 'Monotherapy', age: 'Adults' },
      { use: 'Bipolar Maintenance', year: 2008, dx: 'Bipolar I', phase: 'Maintenance', line: 'Adjunct to lithium/valproate', age: 'Adults' },
      { use: 'Adjunct for Major Depressive Disorder', year: 2009 },
    ]
  },
  {
    id: 'aripiprazole',
    effects: { weight: 'low', sedation: 'minimal', sexual: 'minimal', antichol: 'minimal', qt: 'minimal' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 1988, fdaApprovalYear: 2002, originator: "Otsuka / Bristol-Myers Squibb" },
    dosing: { start: "10–15 mg/day (schizophrenia); 2–5 mg (MDD adjunct)", target: "10–15 mg/day", max: "30 mg/day", formulations: "Oral tab/ODT/solution • LAI (Maintena monthly; Aristada q4–8 weeks)", citation: { label: "FDA package insert (2022)", url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2022/021436s048lbledit.pdf" } },
    name: 'Aripiprazole',
    brandName: 'Abilify',
    class: 'SGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '75 hr', metabolites: 'Dehydro-aripiprazole (active): 94 hr' },
    tmax: 4,
    p450: {
      substrate: ['CYP2D6','CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No dose adjustment required in renal impairment.' },
    hepaticImpairment: { modified: false, notes: 'No adjustment needed' },
    geriatricDosing: { modified: true, notes: 'Use caution; increased mortality in dementia' },
    qtInterval: false,
    proteinBinding: 99,
    receptorKi: {
      SERT: 98, NET: 10000, DAT: 10000, '5HT1A': 5.1, '5HT2A': 3.4, '5HT2C': 15,
      D1: 265, D2: 0.34, D3: 0.8, H1: 61, alpha1: 57, alpha2: 75,
      M1: 10000
    },
    indications: [
      { use: 'Schizophrenia', year: 2002 },
      { use: 'Bipolar Mania', year: 2004, dx: 'Bipolar I', phase: 'Acute manic or mixed episodes', line: 'Monotherapy or adjunct to lithium/valproate', age: 'Adults & 10-17 yr' },
      { use: 'Bipolar Maintenance', year: 2005, dx: 'Bipolar I', phase: 'Maintenance', line: 'Monotherapy or adjunct; also Abilify Maintena long-acting injectable', age: 'Adults' },
      { use: 'Adjunct for Major Depressive Disorder', year: 2007 },
      { use: 'Autism-Associated Irritability', year: 2009 },
      { use: 'Tourette Syndrome', year: 2014 },
    ]
  },
  {
    id: 'clozapine',
    effects: { weight: 'high', sedation: 'high', sexual: 'low', antichol: 'high', qt: 'moderate' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 1958, fdaApprovalYear: 1989, originator: "Wander AG / Sandoz (Novartis)" },
    dosing: { start: "12.5 mg/day", target: "300–450 mg/day (serum ≥350 ng/mL; usual 350–600 ng/mL)", max: "900 mg/day", formulations: "Tablet • ODT (FazaClo) • Oral suspension (Versacloz)", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=clozapine" } },
    name: 'Clozapine',
    brandName: 'Clozaril',
    class: 'SGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '12 hr', metabolites: 'N-desmethylclozapine (norclozapine; limited activity, M1 agonist): 20 hr' },
    tmax: 2.5,
    p450: {
      substrate: ['CYP1A2','CYP2D6','CYP3A4'],
      inhibits: { 'CYP2D6': 'weak' },
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'Dose reduction may be necessary', severe: 'Dose reduction may be necessary', notes: 'Label: dose reduction may be necessary in significant renal impairment. Use caution; ANC monitoring schedule is unchanged.' },
    hepaticImpairment: { modified: true, notes: 'Label: dose reduction may be necessary in significant hepatic impairment; monitor LFTs.' },
    geriatricDosing: { modified: true, notes: 'Significant orthostatic/sedation risk' },
    qtInterval: true,
    proteinBinding: 97,
    receptorKi: {
      SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 195, '5HT2A': 5.4, '5HT2C': 8.9,
      D1: 141, D2: 157, D3: 180, H1: 6.2, alpha1: 7, alpha2: 100,
      M1: 2.8
    },
    indications: [
      { use: 'Treatment-Resistant Schizophrenia', year: 1989 },
      { use: 'Suicidality in Schizophrenia/Schizoaffective Disorder', year: 2002 },
    ]
  },
  {
    id: 'ziprasidone',
    effects: { weight: 'minimal', sedation: 'moderate', sexual: 'low', antichol: 'minimal', qt: 'high' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 1987, fdaApprovalYear: 2001, originator: "Pfizer" },
    dosing: { start: "20 mg BID with food", target: "40–80 mg BID", max: "80 mg BID (160 mg/day)", formulations: "Oral capsule BID with food • IM (acute agitation)", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=ziprasidone" } },
    name: 'Ziprasidone',
    brandName: 'Geodon',
    class: 'SGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '7 hr (Tmax 6–8 hr with food)', metabolites: 'None significant (aldehyde oxidase primary)' },
    tmax: 7,
    p450: {
      substrate: ['CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No dose adjustment required for oral formulation. IM formulation: avoid in severe renal impairment due to cyclodextrin excipient accumulation.' },
    hepaticImpairment: { modified: true, notes: 'Use with caution' },
    geriatricDosing: { modified: true, notes: 'Use with caution; QT monitoring' },
    qtInterval: true,
    proteinBinding: 99,
    receptorKi: {
      SERT: 53, NET: 48, DAT: 10000, '5HT1A': 3.4, '5HT2A': 0.4, '5HT2C': 1.3,
      D1: 525, D2: 4.8, D3: 7.2, H1: 47, alpha1: 10, alpha2: 10000,
      M1: 10000
    },
    indications: [
      { use: 'Schizophrenia', year: 2001 },
      { use: 'Bipolar Mania', year: 2004, dx: 'Bipolar I', phase: 'Acute manic or mixed episodes', line: 'Monotherapy', age: 'Adults' },
      { use: 'Bipolar Maintenance', year: 2009, dx: 'Bipolar I', phase: 'Maintenance', line: 'Adjunct to lithium/valproate', age: 'Adults' },
      { use: 'Agitation in Schizophrenia (IM)', year: 2002 },
    ]
  },
  {
    id: 'lurasidone',
    effects: { weight: 'minimal', sedation: 'low', sexual: 'minimal', antichol: 'minimal', qt: 'minimal' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 2003, fdaApprovalYear: 2010, originator: "Dainippon Sumitomo (Sunovion)" },
    dosing: { start: "40 mg/day with food (≥350 kcal)", target: "40–80 mg/day", max: "160 mg/day", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=lurasidone" } },
    name: 'Lurasidone',
    brandName: 'Latuda',
    class: 'SGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '18 hr (40 mg); longer at higher doses', metabolites: 'ID-14283 and ID-14326 (active)' },
    tmax: 3,
    p450: {
      substrate: ['CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'CrCl 30–<50: start 20 mg; max 80 mg/day', severe: 'CrCl <30: start 20 mg; max 80 mg/day', notes: 'Moderate and severe renal impairment: start 20 mg/day, maximum 80 mg/day.' },
    hepaticImpairment: { modified: true, notes: 'Moderate: max 80 mg; Severe: max 40 mg' },
    geriatricDosing: { modified: true, notes: 'Start low' },
    qtInterval: false,
    proteinBinding: 99,
    receptorKi: {
      SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 6.4, '5HT2A': 2.0, '5HT2C': 415,
      D1: 10000, D2: 1.0, D3: 0.5, H1: 10000, alpha1: 47.9, alpha2: 10.8, M1: 10000
    },
    indications: [
      { use: 'Schizophrenia', year: 2010 },
      { use: 'Bipolar Depression', year: 2013, dx: 'Bipolar I', phase: 'Depressive episodes', line: 'Monotherapy or adjunct to lithium/valproate', age: 'Adults & 10-17 yr' },
    ]
  },
  {
    id: 'asenapine',
    effects: { weight: 'low', sedation: 'moderate', sexual: 'low', antichol: 'minimal', qt: 'low' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 2000, fdaApprovalYear: 2009, originator: "Organon (Merck)" },
    dosing: { start: "5 mg SL BID", target: "10 mg SL BID", max: "20 mg/day", formulations: "Sublingual tablet BID • Transdermal patch once daily (Secuado)", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=asenapine" } },
    name: 'Asenapine',
    brandName: 'Saphris',
    class: 'SGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '24 hr', metabolites: 'N-desmethylasenapine (less active)' },
    tmax: 1,
    p450: {
      substrate: ['CYP1A2'],
      inhibits: { 'CYP2D6': 'weak' },
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No dose adjustment required in mild-to-moderate renal impairment. Not studied in severe renal impairment.' },
    hepaticImpairment: { modified: true, notes: 'Avoid in severe hepatic impairment' },
    geriatricDosing: { modified: true, notes: 'Use with caution' },
    qtInterval: true,
    proteinBinding: 95,
    receptorKi: {
      SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 2.5, '5HT2A': 0.07, '5HT2C': 0.03,
      D1: 1.4, D2: 1.3, D3: 0.42, H1: 1, alpha1: 1.2, alpha2: 1.2,
      M1: 10000
    },
    indications: [
      { use: 'Schizophrenia', year: 2009 },
      { use: 'Bipolar Mania', year: 2009, dx: 'Bipolar I', phase: 'Acute manic or mixed episodes', line: 'Monotherapy or adjunct to lithium/valproate', age: 'Adults & 10-17 yr' },
      { use: 'Bipolar Maintenance', year: 2015, dx: 'Bipolar I', phase: 'Maintenance', line: 'Monotherapy', age: 'Adults' },
    ]
  },

  // ── Mood Stabilizers ───────────────────────────────────────────────────────
  {
    id: 'lithium',
    effects: { weight: 'moderate', sedation: 'low', sexual: 'low', antichol: 'none', qt: 'low', review: true }, // tiers (drafted 2026-10-01 from FDA labeling adverse reactions / W&P; pending clinician review — not yet in psychopharm-tolerability.csv)
    development: { discoveryYear: 1949, fdaApprovalYear: 1970, originator: "Not patented (element; J. Cade, 1949)" },
    dosing: { start: "300 mg BID–TID", target: "serum 0.6–1.2 mEq/L (≈900–1800 mg/day)", max: "titrate to serum level (≈1800 mg/day)", formulations: "IR carbonate BID–TID • ER/CR BID (Lithobid, Eskalith CR) • citrate oral solution", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=lithium" } },
    name: 'Lithium',
    brandName: 'Lithobid',
    class: 'Mood Stabilizer',
    category: 'Mood Stabilizer',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '18–36 hr', metabolites: 'Not applicable (monovalent cation)' },
    tmax: 2,
    p450: {
      substrate: [],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'Reduce dose; monitor serum levels closely', severe: 'Avoid or use extreme caution; dialysis patients: special dosing' },
    hepaticImpairment: { modified: false, notes: 'Not hepatically metabolized' },
    geriatricDosing: { modified: true, notes: 'Lower doses; narrow therapeutic index; frequent monitoring' },
    qtInterval: false,
    proteinBinding: 0,
    receptorKi: null,
    mechanism: 'Monovalent cation; inhibits GSK-3β and inositol monophosphatase; modulates second-messenger systems; not metabolized by P450',
    indications: [
      { use: 'Bipolar Mania', year: 1970, dx: 'Bipolar I', phase: 'Manic episodes (acute)', line: 'Monotherapy', age: 'Adults & >=7 yr' },
      { use: 'Bipolar Maintenance', year: 1974, dx: 'Bipolar I', phase: 'Maintenance', line: 'Monotherapy', age: 'Adults & >=7 yr' },
    ]
  },
  {
    id: 'valproate',
    effects: { weight: 'high', sedation: 'moderate', sexual: 'low', antichol: 'none', qt: 'minimal', review: true }, // tiers (drafted 2026-10-01 from FDA labeling adverse reactions / W&P; pending clinician review — not yet in psychopharm-tolerability.csv)
    development: { discoveryYear: 1962, fdaApprovalYear: 1978, originator: "Sanofi / Abbott (divalproex)" },
    dosing: { start: "250–500 mg BID (20–30 mg/kg/day mania)", target: "serum 50–125 mcg/mL", max: "60 mg/kg/day", formulations: "Divalproex DR BID–TID (Depakote) • Divalproex ER once daily (Depakote ER) • valproic acid • IV", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=divalproex" } },
    name: 'Valproate',
    brandName: 'Depakote',
    class: 'Mood Stabilizer',
    category: 'Mood Stabilizer',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '9–16 hr', metabolites: '2-en-valproate (active): variable' },
    tmax: 3,
    p450: {
      substrate: ['CYP2C9','CYP2C19'],
      inhibits: { 'CYP2C9': 'moderate', 'CYP2C19': 'weak', 'UGT': 'strong' },
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null },
    hepaticImpairment: { modified: true, notes: 'Contraindicated in significant hepatic disease' },
    geriatricDosing: { modified: true, notes: 'Lower doses; slower titration; monitor levels' },
    qtInterval: false,
    proteinBinding: 90,
    receptorKi: null,
    mechanism: 'Sodium channel blockade; GABA-transaminase inhibition (↑ GABA); histone deacetylase inhibition; inhibits UGT enzymes',
    indications: [
      { use: 'Epilepsy', year: 1978 },
      { use: 'Bipolar Mania', year: 1995, dx: 'Bipolar I', phase: 'Acute manic or mixed episodes', line: 'Monotherapy (divalproex)', age: 'Adults' },
      { use: 'Migraine Prophylaxis', year: 1996 },
    ]
  },
  {
    id: 'lamotrigine',
    effects: { weight: 'minimal', sedation: 'low', sexual: 'minimal', antichol: 'none', qt: 'minimal', review: true }, // tiers (drafted 2026-10-01 from FDA labeling adverse reactions / W&P; pending clinician review — not yet in psychopharm-tolerability.csv)
    development: { discoveryYear: 1980, fdaApprovalYear: 1994, originator: "Wellcome (GSK)" },
    dosing: { start: "25 mg/day, slow titration", target: "200 mg/day", max: "Bipolar target: 200 mg/day monotherapy; 100 mg/day with valproate; 400 mg/day with carbamazepine or other enzyme inducers", formulations: "IR BID • XR once daily (Lamictal XR) • ODT & chewable", citation: { label: "FDA package insert (2025)", url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2025/020241s068s069,020764s061s062,022251s032s033lbl.pdf" } },
    name: 'Lamotrigine',
    brandName: 'Lamictal',
    class: 'Mood Stabilizer',
    category: 'Mood Stabilizer',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '25–33 hr (monotherapy)', metabolites: 'None significant' },
    tmax: 2.5,
    p450: {
      substrate: ['UGT'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'Reduce maintenance dose', severe: 'Significantly reduce maintenance dose' },
    hepaticImpairment: { modified: true, notes: 'Reduce dose 25% (moderate), 50–75% (severe)' },
    geriatricDosing: { modified: false, notes: 'Generally well-tolerated; no specific adjustment' },
    qtInterval: false,
    proteinBinding: 55,
    receptorKi: null,
    mechanism: 'Voltage-gated sodium channel blocker (Nav1.1, Nav1.6); inhibits glutamate release; metabolized primarily by UGT1A4 glucuronidation (not P450)',
    indications: [
      { use: 'Epilepsy (adjunct)', year: 1994 },
      { use: 'Bipolar Maintenance', year: 2003, dx: 'Bipolar I', phase: 'Maintenance (delays mood episodes, esp. depression)', line: 'Monotherapy', age: 'Adults' },
    ]
  },
  {
    id: 'carbamazepine',
    effects: { weight: 'low', sedation: 'moderate', sexual: 'low', antichol: 'low', qt: 'minimal', review: true }, // tiers (drafted 2026-10-01 from FDA labeling adverse reactions / W&P; pending clinician review — not yet in psychopharm-tolerability.csv)
    development: { discoveryYear: 1953, fdaApprovalYear: 1968, originator: "Geigy (Novartis)" },
    dosing: { start: "200 mg BID", target: "400–1200 mg/day (serum 4–12 mcg/mL)", max: "1600 mg/day", formulations: "IR tab/chewable/suspension BID–QID (Tegretol) • XR BID (Tegretol-XR) • ER BID (Carbatrol/Equetro)", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=carbamazepine" } },
    name: 'Carbamazepine',
    brandName: 'Tegretol',
    class: 'Mood Stabilizer',
    category: 'Mood Stabilizer',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '12–17 hr (after autoinduction)', metabolites: 'CBZ-10,11-epoxide (active): 5–8 hr' },
    tmax: 6,
    p450: {
      substrate: ['CYP3A4','CYP2C8'],
      inhibits: {},
      induces: { 'CYP3A4': 'strong', 'CYP2B6': 'moderate', 'CYP2C9': 'moderate', 'CYP2C19': 'moderate', 'CYP1A2': 'moderate', 'UGT': 'strong' }
    },
    renalImpairment: { modified: false, moderate: null, severe: null },
    hepaticImpairment: { modified: true, notes: 'Use with caution; avoid in severe' },
    geriatricDosing: { modified: true, notes: 'Increased CNS sensitivity; drug interactions' },
    qtInterval: false,
    proteinBinding: 75,
    receptorKi: null,
    mechanism: 'Voltage-gated sodium channel blocker; reduces repetitive neuronal firing; potent inducer of CYP enzymes (autoinduction)',
    indications: [
      { use: 'Epilepsy', year: 1968 },
      { use: 'Trigeminal Neuralgia', year: 1968 },
      { use: 'Bipolar Mania', year: 2004, dx: 'Bipolar I', phase: 'Acute manic or mixed episodes', line: 'Monotherapy (Equetro extended-release)', age: 'Adults' },
    ]
  },

  // ── Sleep Medications ──────────────────────────────────────────────────────
  {
    id: 'zolpidem',
    effects: { weight: 'minimal', sedation: 'high', sexual: 'minimal', antichol: 'none', qt: 'minimal', review: true }, // tiers (drafted 2026-10-01 from FDA labeling adverse reactions / W&P; pending clinician review — not yet in psychopharm-tolerability.csv)
    development: { discoveryYear: 1982, fdaApprovalYear: 1992, originator: "Synthélabo (Sanofi)" },
    dosing: { start: "5 mg qHS (F) / 5–10 mg (M)", target: "5–10 mg qHS", max: "10 mg (IR); 12.5 mg (CR)", formulations: "IR (Ambien) • CR (Ambien CR) • sublingual (Edluar/Intermezzo) • oral spray (Zolpimist)", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=zolpidem" } },
    name: 'Zolpidem',
    brandName: 'Ambien',
    class: 'Z-Drug',
    category: 'Sleep',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '~2.5 hr (range 1.4–4.5)', metabolites: 'None significant' },
    tmax: 1.5,
    p450: {
      substrate: ['CYP3A4','CYP2C9'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null },
    hepaticImpairment: { modified: true, notes: 'Mild-moderate impairment: 5 mg (IR) or 6.25 mg (CR); avoid in severe impairment (may contribute to encephalopathy).' },
    geriatricDosing: { modified: true, notes: 'Max 5 mg (Beers List); fall risk' },
    qtInterval: false,
    proteinBinding: 92,
    receptorKi: { 'GABA-A': 4.4 },
    mechanism: 'GABA-A receptor positive allosteric modulator; selective for α1 subunit (sedation > anxiolysis); binds BZD site',
    indications: [
      { use: 'Insomnia (short-term)', year: 1992 },
    ]
  },
  {
    id: 'eszopiclone',
    effects: { weight: 'minimal', sedation: 'high', sexual: 'minimal', antichol: 'none', qt: 'minimal', review: true }, // tiers (drafted 2026-10-01 from FDA labeling adverse reactions / W&P; pending clinician review — not yet in psychopharm-tolerability.csv)
    development: { discoveryYear: 1986, fdaApprovalYear: 2004, originator: "Sepracor (Sunovion)" },
    dosing: { start: "1 mg qHS", target: "1–3 mg qHS", max: "3 mg/day", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=eszopiclone" } },
    name: 'Eszopiclone',
    brandName: 'Lunesta',
    class: 'Z-Drug',
    category: 'Sleep',
    activeEnantiomer: { has: true, name: 'S-zopiclone (active enantiomer of zopiclone)' },
    halfLife: { drug: '6 hr', metabolites: 'Desmethyleszopiclone (less active): 9 hr' },
    tmax: 1,
    p450: {
      substrate: ['CYP3A4','CYP2E1'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null },
    hepaticImpairment: { modified: true, notes: 'Max 2 mg/night; use with caution' },
    geriatricDosing: { modified: true, notes: 'Max 2 mg/night (Beers List)' },
    qtInterval: false,
    proteinBinding: 55,
    receptorKi: { 'GABA-A': 7.4 },
    mechanism: 'GABA-A receptor positive allosteric modulator; binds BZD site; less α1-selective than zolpidem',
    indications: [
      { use: 'Insomnia', year: 2004 },
    ]
  },
  {
    id: 'temazepam',
    effects: { weight: 'minimal', sedation: 'high', sexual: 'low', antichol: 'none', qt: 'minimal', review: true }, // tiers (drafted 2026-10-01 from FDA labeling adverse reactions / W&P; pending clinician review — not yet in psychopharm-tolerability.csv)
    development: { discoveryYear: 1964, fdaApprovalYear: 1981, originator: "Sandoz / Mallinckrodt" },
    dosing: { start: "7.5–15 mg qHS", target: "15–30 mg qHS", max: "30 mg/day", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=temazepam" } },
    name: 'Temazepam',
    brandName: 'Restoril',
    class: 'Benzodiazepine',
    category: 'Sleep',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '~9 hr (range 3.5–18)', metabolites: 'None significant (direct glucuronidation)' },
    tmax: 1.5,
    p450: {
      substrate: [],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'Use with caution', severe: 'Use with caution' },
    hepaticImpairment: { modified: true, notes: 'Use with caution' },
    geriatricDosing: { modified: true, notes: 'Avoid (Beers List); fall/cognitive risk' },
    qtInterval: false,
    proteinBinding: 96,
    receptorKi: { 'GABA-A': 23 },
    mechanism: 'GABA-A receptor positive allosteric modulator; binds BZD site; non-selective across α subunits; metabolized by direct glucuronidation (not P450)',
    indications: [
      { use: 'Insomnia (short-term)', year: 1981 },
    ]
  },
  {
    id: 'ramelteon',
    effects: { weight: 'none', sedation: 'moderate', sexual: 'minimal', antichol: 'none', qt: 'minimal', review: true }, // tiers (drafted 2026-10-01 from FDA labeling adverse reactions / W&P; pending clinician review — not yet in psychopharm-tolerability.csv)
    development: { discoveryYear: 1996, fdaApprovalYear: 2005, originator: "Takeda" },
    dosing: { start: "8 mg qHS", target: "8 mg qHS", max: "8 mg/day (fixed dose)", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=ramelteon" } },
    name: 'Ramelteon',
    brandName: 'Rozerem',
    class: 'Melatonin Agonist',
    category: 'Sleep',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '1–2.6 hr', metabolites: 'M-II (active): 2–5 hr; about 1/10–1/5 the receptor affinity of ramelteon but 20–100× higher exposure, so it likely contributes to the effect' },
    tmax: 0.75,
    p450: {
      substrate: ['CYP1A2','CYP3A4','CYP2C9'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null },
    hepaticImpairment: { modified: true, notes: 'Use with caution; avoid in severe' },
    geriatricDosing: { modified: false, notes: 'Generally safe; no specific adjustment' },
    qtInterval: false,
    proteinBinding: 82,
    receptorKi: { 'MT1': 0.014, 'MT2': 0.112 },
    mechanism: 'Melatonin MT1/MT2 receptor agonist; regulates circadian rhythm; no abuse potential; not a controlled substance',
    indications: [
      { use: 'Insomnia (sleep onset)', year: 2005 },
    ]
  },
  {
    id: 'suvorexant',
    effects: { weight: 'minimal', sedation: 'high', sexual: 'minimal', antichol: 'none', qt: 'minimal', review: true }, // tiers (drafted 2026-10-01 from FDA labeling adverse reactions / W&P; pending clinician review — not yet in psychopharm-tolerability.csv)
    development: { discoveryYear: 2008, fdaApprovalYear: 2014, originator: "Merck" },
    dosing: { start: "10 mg qHS", target: "10–20 mg qHS", max: "20 mg/day", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=suvorexant" } },
    name: 'Suvorexant',
    brandName: 'Belsomra',
    class: 'Orexin Antagonist',
    category: 'Sleep',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '12 hr', metabolites: 'None significant' },
    tmax: 2,
    p450: {
      substrate: ['CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null },
    hepaticImpairment: { modified: true, notes: 'Use with caution in severe' },
    geriatricDosing: { modified: true, notes: 'Start 5–10 mg; avoid higher doses' },
    qtInterval: false,
    proteinBinding: 99,
    receptorKi: { 'OX1R': 0.55, 'OX2R': 0.35 },
    mechanism: 'Dual orexin receptor antagonist (DORA); blocks OX1R and OX2R; promotes sleep by reducing wakefulness drive',
    indications: [
      { use: 'Insomnia (sleep onset and maintenance)', year: 2014 },
    ]
  }

  // ── Additional SNRIs ────────────────────────────────────────────────────
  ,{
    id: 'milnacipran',
    effects: { weight: 'minimal', sedation: 'low', sexual: 'moderate', antichol: 'low', qt: 'minimal' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 1985, fdaApprovalYear: 2009, originator: "Pierre Fabre / Forest" },
    dosing: { start: "12.5 mg/day", target: "100 mg/day (50 mg BID)", max: "200 mg/day", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=milnacipran" } },
    name: 'Milnacipran',
    brandName: 'Savella',
    class: 'SNRI',
    category: 'Antidepressant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '~8 hr', metabolites: 'None significant' },
    tmax: 2,
    p450: {
      substrate: [],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'CrCl 30–49: use with caution', severe: 'CrCl 5–29: reduce maintenance 50% to 25 mg BID (may increase to 50 mg BID by response)', notes: 'Savella label: severe renal impairment (CrCl 5–29) — reduce the maintenance dose by 50% to 50 mg/day (25 mg BID), may increase to 100 mg/day based on response; moderate (CrCl 30–49) — use with caution; end-stage renal disease — not recommended.' },
    hepaticImpairment: { modified: true, notes: 'No dose adjustment in mild-moderate; avoid in severe hepatic impairment.' },
    geriatricDosing: { modified: false, notes: 'Use with caution' },
    qtInterval: false,
    proteinBinding: 13,
    receptorKi: { SERT: 8.9, NET: 58, DAT: 10000, '5HT1A': 10000, '5HT2A': 10000, D2: 10000, H1: 10000, alpha1: 10000, M1: 10000 },
    indications: [
      { use: 'Fibromyalgia', year: 2009 },
    ]
  }
  ,{
    id: 'levomilnacipran',
    effects: { weight: 'minimal', sedation: 'low', sexual: 'moderate', antichol: 'minimal', qt: 'minimal' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 2004, fdaApprovalYear: 2013, originator: "Forest / Pierre Fabre" },
    dosing: { start: "20 mg/day ×2 days", target: "40–120 mg/day", max: "120 mg/day", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=levomilnacipran" } },
    name: 'Levomilnacipran',
    brandName: 'Fetzima',
    class: 'SNRI',
    category: 'Antidepressant',
    activeEnantiomer: { has: true, name: '(1S,2R)-enantiomer of milnacipran' },
    halfLife: { drug: '12 hr', metabolites: 'None significant' },
    tmax: 6,
    p450: {
      substrate: ['CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'Max 80 mg/day (CrCl 30–59)', severe: 'Max 40 mg/day (CrCl 15–29)', notes: 'Reduce maximum dose based on CrCl: max 80 mg/day (CrCl 30–59), max 40 mg/day (CrCl 15–29). Avoid in ESRD.' },
    hepaticImpairment: { modified: false, notes: 'No dose adjustment needed in hepatic impairment.' },
    geriatricDosing: { modified: false, notes: 'Use with caution' },
    qtInterval: false,
    proteinBinding: 22,
    receptorKi: {
      SERT: 11, NET: 91, DAT: 10000, '5HT1A': 10000, '5HT2A': 10000, D2: 10000,
      H1: 10000, alpha1: 10000, M1: 10000
    },
    indications: [
      { use: 'Major Depressive Disorder', year: 2013 },
    ]
  }

  // ── SSRI/5HT Multimodal ─────────────────────────────────────────────────
  ,{
    id: 'vortioxetine',
    effects: { weight: 'minimal', sedation: 'minimal', sexual: 'low', antichol: 'minimal', qt: 'minimal' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 2001, fdaApprovalYear: 2013, originator: "Lundbeck / Takeda" },
    dosing: { start: "10 mg/day", target: "10–20 mg/day", max: "20 mg/day", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=vortioxetine" } },
    name: 'Vortioxetine',
    brandName: 'Trintellix',
    class: 'SSRI/5HT1A',
    category: 'Antidepressant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '66 hr', metabolites: 'None significant' },
    tmax: 7,
    p450: {
      substrate: ['CYP2D6', 'CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No dose adjustment required in renal impairment, including severe.' },
    hepaticImpairment: { modified: true, notes: 'No dose adjustment in mild-moderate; not recommended in severe hepatic impairment.' },
    geriatricDosing: { modified: false, notes: 'No specific adjustment' },
    qtInterval: false,
    proteinBinding: 98,
    receptorKi: { SERT: 1.6, NET: 113, DAT: 10000, '5HT1A': 15, '5HT2A': 200, '5HT2C': 910, D2: 10000, H1: 1200, alpha1: 2900, alpha2: 10000, M1: 10000 },
    indications: [
      { use: 'Major Depressive Disorder', year: 2013 },
    ]
  }

  // ── Azapirone Antidepressant ────────────────────────────────────────────
  ,{
    id: 'gepirone',
    effects: { weight: 'minimal', sedation: 'minimal', sexual: 'minimal', antichol: 'minimal', qt: 'moderate' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 1986, fdaApprovalYear: 2023, originator: "Bristol-Myers Squibb / Fabre-Kramer" },
    dosing: { start: "18.2 mg/day", target: "18.2–72.6 mg/day", max: "72.6 mg/day (36.3 mg/day max if ≥65 yr, CrCl <50, or moderate hepatic impairment; reduce dose 50% with moderate CYP3A4 inhibitors; strong CYP3A4 inhibitors contraindicated; avoid strong inducers)", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=gepirone" } },
    name: 'Gepirone',
    brandName: 'Exxua',
    class: 'Azapirone',
    category: 'Antidepressant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '~5 hr (ER; Tmax ~6 hr fasting, ~3 hr with a high-fat meal)', metabolites: '1-PP and 3\'-OH-gepirone (both active; circulate at higher levels than parent)' },
    tmax: 6,
    p450: {
      substrate: ['CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'CrCl <50: start 18.2 mg; max 36.3 mg/day (increase only after Day 7)', severe: 'CrCl <50: start 18.2 mg; max 36.3 mg/day', notes: 'Label (Exxua): CrCl <50 mL/min — start 18.2 mg daily; may increase to a maximum of 36.3 mg after Day 7.' },
    hepaticImpairment: { modified: true, notes: 'Mild: no adjustment. Moderate (Child-Pugh B): start 18.2 mg; max 36.3 mg/day after Day 7. Severe (Child-Pugh C): contraindicated.' },
    geriatricDosing: { modified: true, notes: 'Age ≥65: start 18.2 mg; max 36.3 mg/day (increase only after Day 7).' },
    qtInterval: true,
    proteinBinding: 72,
    receptorKi: { '5HT1A': 21, SERT: 160, NET: 10000, DAT: 10000, '5HT2A': 10000, D2: 500, H1: 10000, alpha1: 10000, M1: 10000 },
    indications: [
      { use: 'Major Depressive Disorder', year: 2023 },
    ]
  }

  // ── Novel Antidepressants ───────────────────────────────────────────────
  ,{
    id: 'esketamine',
    effects: { weight: 'minimal', sedation: 'moderate', sexual: 'minimal', antichol: 'minimal', qt: 'minimal' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 1962, fdaApprovalYear: 2019, originator: "Janssen (parent ketamine, Parke-Davis 1962)" },
    dosing: { start: "56 mg intranasal", target: "56–84 mg twice weekly (induction)", max: "84 mg/dose", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=esketamine" } },
    name: 'Esketamine',
    brandName: 'Spravato',
    class: 'NMDA Antagonist',
    category: 'Antidepressant',
    activeEnantiomer: { has: true, name: 'S-enantiomer of ketamine' },
    halfLife: { drug: '7–12 hr', metabolites: 'Noresketamine: ~8 hr' },
    tmax: 0.33,
    p450: {
      substrate: ['CYP2B6', 'CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No dose adjustment required; primarily hepatically metabolized.' },
    hepaticImpairment: { modified: true, notes: 'Use with caution; avoid in severe' },
    geriatricDosing: { modified: true, notes: 'Lower doses recommended; monitor closely' },
    qtInterval: false,
    proteinBinding: 43,
    receptorKi: null,
    mechanism: 'NMDA receptor uncompetitive antagonist; also acts at opioid mu/kappa receptors and sigma receptors; rapidly reduces depressive symptoms; administered intranasally in-office under REMS program; also increases AMPA/mTOR signaling downstream',
    indications: [
      { use: 'Treatment-Resistant Depression (adults)', year: 2019, line: 'Monotherapy (added Jan 2025) or with an oral antidepressant' },
      { use: 'MDD with Acute Suicidal Ideation or Behavior (adults)', year: 2020 },
    ]
  }
  ,{
    id: 'brexanolone',
    effects: { weight: 'none', sedation: 'high', sexual: 'none', antichol: 'none', qt: 'minimal' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 2011, fdaApprovalYear: 2019, originator: "Sage Therapeutics" },
    dosing: { start: "30 mcg/kg/hr IV", target: "titrate to 90 mcg/kg/hr over 60-hr infusion", max: "90 mcg/kg/hr", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=brexanolone" } },
    name: 'Brexanolone',
    brandName: 'Zulresso — withdrawn (2025)',
    class: 'Neuroactive Steroid',
    category: 'Antidepressant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '9 hr', metabolites: 'None significant' },
    tmax: null,
    p450: {
      substrate: [],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No dose adjustment required; not renally eliminated.' },
    hepaticImpairment: { modified: false, notes: 'Use with caution in moderate-severe hepatic impairment; may affect drug clearance.' },
    geriatricDosing: { modified: false, notes: 'Not studied in elderly; use with caution given sedation and altered consciousness risk.' },
    qtInterval: false,
    proteinBinding: 99,
    receptorKi: null,
    mechanism: 'GABA-A receptor positive allosteric modulator (neuroactive steroid); acts at synaptic and extrasynaptic GABA-A receptors including delta subunit-containing; IV 60-hour infusion; approved specifically for postpartum depression; no abuse potential designation',
    indications: [
      { use: 'Postpartum Depression (adults)', year: 2019, line: 'No longer marketed: sales ended Dec 31, 2024; FDA approval withdrawn Apr 14, 2025 at Sage\'s request (not for safety). Use zuranolone.' },
    ]
  }
  ,{
    id: 'zuranolone',
    effects: { weight: 'minimal', sedation: 'high', sexual: 'minimal', antichol: 'minimal', qt: 'minimal' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 2014, fdaApprovalYear: 2023, originator: "Sage Therapeutics / Biogen" },
    dosing: { start: "50 mg PO qPM ×14 days", target: "50 mg/day", max: "50 mg/day (40 mg if CNS depressant effects; 30 mg with strong CYP3A4 inhibitors, eGFR <60, or Child-Pugh C; avoid CYP3A4 inducers)", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=zuranolone" } },
    name: 'Zuranolone',
    brandName: 'Zurzuvae',
    class: 'Neuroactive Steroid',
    category: 'Antidepressant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '20–24 hr', metabolites: 'None significant' },
    tmax: 5,
    p450: {
      substrate: ['CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'eGFR <60: 30 mg once daily for 14 days', severe: '30 mg once daily for 14 days', notes: 'Moderate or severe renal impairment (eGFR <60 mL/min/1.73 m²): reduce to 30 mg once daily for 14 days.' },
    hepaticImpairment: { modified: true, notes: 'Severe (Child-Pugh C): 30 mg once daily for 14 days. No adjustment in mild or moderate impairment.' },
    geriatricDosing: { modified: false, notes: 'No specific geriatric adjustment in the label; apply the renal criterion (eGFR <60 → 30 mg) and monitor for sedation.' },
    qtInterval: false,
    proteinBinding: 99,
    receptorKi: null,
    mechanism: 'GABA-A receptor positive allosteric modulator (neuroactive steroid); oral formulation; taken daily for 14 days; acts at synaptic and extrasynaptic GABA-A receptors; CNS depressant effects — driving restriction for 12 hours after each dose',
    indications: [
      { use: 'Postpartum Depression (adults)', year: 2023 },
    ]
  }
  ,{
    id: 'dextromethorphan-bupropion',
    effects: { weight: 'minimal', sedation: 'low', sexual: 'low', antichol: 'minimal', qt: 'minimal' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 2017, fdaApprovalYear: 2022, originator: "Axsome Therapeutics" },
    dosing: { start: "MDD: 45/105 mg qAM ×3 days • AD agitation: 30/105 mg qAM, then 30/105 mg BID from day 8", target: "MDD: 45/105 mg BID • AD agitation: 45/105 mg BID from day 15", max: "45/105 mg BID (≥8 h apart); max one 45/105 mg tablet daily in moderate renal impairment, CYP2D6 poor metabolizers, or with strong CYP2D6 inhibitors", formulations: "ER tablets 45/105 mg and 30/105 mg", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=Auvelity" } },
    name: 'Dextromethorphan/Bupropion',
    brandName: 'Auvelity',
    class: 'Combination',
    category: 'Antidepressant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: 'DXM ~22 hr (with CYP2D6 inhibition by bupropion); bupropion ~15 hr', metabolites: 'Dextrorphan (active); hydroxybupropion ~35 hr, erythrohydrobupropion ~44 hr, threohydrobupropion ~33 hr (active)' },
    tmax: 3,
    p450: {
      substrate: ['CYP2D6', 'CYP2B6'],
      inhibits: { 'CYP2D6': 'strong' },
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'Max one 45/105 mg tablet daily (CrCl 30–59 mL/min)', severe: 'Not recommended', notes: 'Moderate renal impairment: max one 45/105 mg tablet daily. Not recommended in severe renal impairment (CrCl <30 mL/min).' },
    hepaticImpairment: { modified: true, notes: 'Avoid in severe' },
    geriatricDosing: { modified: false, notes: 'No specific geriatric adjustment; use with caution given CNS and cardiac effects.' },
    qtInterval: false,
    proteinBinding: null,
    proteinBindingNote: 'Dextromethorphan ~60–70%; bupropion 84% (label)',
    receptorKi: null,
    mechanism: 'Dextromethorphan: uncompetitive NMDA receptor antagonist + sigma-1 receptor agonist + SERT/NET inhibitor; bupropion: NDRI + CYP2D6 inhibitor (increases DXM bioavailability 10-fold); together produce rapid antidepressant effect; approved for MDD in adults (2022) and for agitation associated with Alzheimer\'s dementia (April 2026, the first non-antipsychotic for this use; not for PRN use). Label warnings include seizures and hyponatremia',
    indications: [
      { use: 'Major Depressive Disorder (adults)', year: 2022 },
      { use: "Agitation associated with dementia due to Alzheimer's disease", year: 2026, age: 'Adults' },
    ]
  }

  // ── Additional TCA ──────────────────────────────────────────────────────
  ,{
    id: 'doxepin',
    effects: { weight: 'moderate', sedation: 'high', sexual: 'low', antichol: 'high', qt: 'moderate' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 1963, fdaApprovalYear: 1969, originator: "Pfizer" },
    dosing: { start: "25–75 mg/day (depression); 3–6 mg qHS (insomnia)", target: "75–150 mg/day", max: "300 mg/day", formulations: "Oral cap/solution (depression) • Low-dose 3–6 mg tab for insomnia (Silenor)", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=doxepin" } },
    name: 'Doxepin',
    brandName: 'Sinequan / Silenor',
    class: 'TCA',
    category: 'Antidepressant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '8–24 hr', metabolites: 'Desmethyldoxepin: 33–80 hr' },
    tmax: 3.5,
    p450: {
      substrate: ['CYP2C19','CYP2D6','CYP1A2','CYP2C9'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No dose adjustment required for low-dose insomnia use; caution at antidepressant doses.' },
    hepaticImpairment: { modified: true, notes: 'Use with caution; reduce dose' },
    geriatricDosing: { modified: true, notes: 'Avoid high doses (Beers List); 3–6 mg for insomnia generally acceptable' },
    qtInterval: true,
    proteinBinding: 80,
    receptorKi: { SERT: 68, NET: 30, DAT: 10000, '5HT1A': 10000, '5HT2A': 28, '5HT2C': 10000, D2: 400, H1: 0.2, alpha1: 23, alpha2: 10000, M1: 70 },
    indications: [
      { use: 'Depression and Anxiety', year: 1969 },
      { use: 'Insomnia (low-dose 3–6 mg)', year: 2010 },
    ]
  }

  // ── Additional FGAs ─────────────────────────────────────────────────────
  ,{
    id: 'trifluoperazine',
    effects: { weight: 'low', sedation: 'low', sexual: 'moderate', antichol: 'low', qt: 'low' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 1958, fdaApprovalYear: 1959, originator: "Smith Kline & French" },
    dosing: { start: "2–5 mg BID", target: "15–20 mg/day", max: "40 mg/day", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=trifluoperazine" } },
    name: 'Trifluoperazine',
    brandName: 'Stelazine',
    class: 'FGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '7–18 hr', metabolites: 'None significant' },
    tmax: 3,
    p450: {
      substrate: ['CYP1A2'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No specific dose adjustment; use with caution. Metabolized hepatically.' },
    hepaticImpairment: { modified: true, notes: 'Use with caution' },
    geriatricDosing: { modified: true, notes: 'Very high EPS risk; avoid (Beers List)' },
    qtInterval: true,
    proteinBinding: 90,
    receptorKi: { SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 10000, '5HT2A': 1.6, '5HT2C': 10000, D2: 0.3, H1: 50, alpha1: 45, alpha2: 10000, M1: 1200 },
    indications: [
      { use: 'Schizophrenia', year: 1958 },
      { use: 'Short-term Anxiety', year: 1958 },
    ]
  }
  ,{
    id: 'perphenazine',
    effects: { weight: 'low', sedation: 'low', sexual: 'moderate', antichol: 'low', qt: 'low' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 1957, fdaApprovalYear: 1957, originator: "Schering" },
    dosing: { start: "4–8 mg TID", target: "16–24 mg/day", max: "64 mg/day", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=perphenazine" } },
    name: 'Perphenazine',
    brandName: 'Trilafon',
    class: 'FGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '9–12 hr', metabolites: '7-Hydroxyperphenazine: ~20 hr' },
    tmax: 3,
    p450: {
      substrate: ['CYP2D6'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No specific dose adjustment; use with caution. Primarily hepatic metabolism.' },
    hepaticImpairment: { modified: true, notes: 'Use with caution' },
    geriatricDosing: { modified: true, notes: 'High EPS risk; use with caution' },
    qtInterval: true,
    proteinBinding: 90,
    receptorKi: { SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 10000, '5HT2A': 2.1, '5HT2C': 3.3, D2: 0.5, H1: 8, alpha1: 10, alpha2: 10000, M1: 500 },
    indications: [
      { use: 'Schizophrenia', year: 1957 },
      { use: 'Severe Nausea and Vomiting', year: 1957 },
    ]
  }
  ,{
    id: 'thiothixene',
    effects: { weight: 'low', sedation: 'low', sexual: 'moderate', antichol: 'low', qt: 'low' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 1965, fdaApprovalYear: 1967, originator: "Pfizer" },
    dosing: { start: "2 mg TID", target: "15–30 mg/day", max: "60 mg/day", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=thiothixene" } },
    name: 'Thiothixene',
    brandName: 'Navane',
    class: 'FGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '~34 hr', metabolites: 'None significant' },
    tmax: 3,
    p450: {
      substrate: ['CYP1A2'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No specific dose adjustment recommended; use with caution.' },
    hepaticImpairment: { modified: true, notes: 'Use with caution' },
    geriatricDosing: { modified: true, notes: 'High EPS risk; avoid (Beers List)' },
    qtInterval: true,
    proteinBinding: 99,
    receptorKi: { SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 10000, '5HT2A': 25, '5HT2C': 10000, D2: 0.5, H1: 10, alpha1: 35, alpha2: 10000, M1: 10000 },
    indications: [
      { use: 'Schizophrenia', year: 1967 },
    ]
  }
  ,{
    id: 'pimozide',
    effects: { weight: 'low', sedation: 'low', sexual: 'moderate', antichol: 'low', qt: 'high' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 1963, fdaApprovalYear: 1984, originator: "Janssen" },
    dosing: { start: "1–2 mg/day", target: "1–10 mg/day", max: "10 mg/day or 0.2 mg/kg", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=pimozide" } },
    name: 'Pimozide',
    brandName: 'Orap',
    class: 'FGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '55 hr', metabolites: 'None significant' },
    tmax: 6,
    p450: {
      substrate: ['CYP3A4','CYP1A2','CYP2D6'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No specific dose adjustment; use with caution given QT risk and narrow therapeutic window.' },
    hepaticImpairment: { modified: true, notes: 'Use with caution' },
    geriatricDosing: { modified: true, notes: 'High EPS and QT risk; use with great caution' },
    qtInterval: true,
    proteinBinding: 99,
    receptorKi: {
      SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 10000, '5HT2A': 30, '5HT2C': 10000,
      D2: 1, D3: 1, H1: 10000, alpha1: 40, alpha2: 10000, M1: 10000
    },
    mechanism: 'D2 receptor antagonist; also a calcium channel blocker (cardiac Na/K/Ca channels); FDA approved for Tourette syndrome; significant QT prolongation risk — requires ECG monitoring; many drug interactions via CYP3A4',
    indications: [
      { use: "Tourette's Syndrome", year: 1984 },
    ]
  }
  ,{
    id: 'thioridazine',
    effects: { weight: 'moderate', sedation: 'high', sexual: 'high', antichol: 'high', qt: 'high' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 1958, fdaApprovalYear: 1962, originator: "Sandoz (Novartis)" },
    dosing: { start: "50–100 mg TID", target: "200–800 mg/day", max: "800 mg/day", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=thioridazine" } },
    name: 'Thioridazine',
    brandName: 'Mellaril',
    class: 'FGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '10–36 hr', metabolites: 'None significant' },
    tmax: 3,
    p450: {
      substrate: ['CYP2D6'],
      inhibits: { 'CYP2D6': 'moderate' },
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No specific dose adjustment; use with extreme caution given QT and pigmentary retinopathy risk.' },
    hepaticImpairment: { modified: true, notes: 'Avoid or use with extreme caution' },
    geriatricDosing: { modified: true, notes: 'Avoid (Beers List); very high anticholinergic/QT burden' },
    qtInterval: true,
    proteinBinding: 99,
    receptorKi: { SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 10000, '5HT2A': 6, '5HT2C': 10000, D2: 3, H1: 4, alpha1: 6, alpha2: 10000, M1: 5 },
    indications: [
      { use: 'Schizophrenia (refractory, last-line)', year: 1962 },
    ]
  }
  ,{
    id: 'loxapine',
    effects: { weight: 'low', sedation: 'moderate', sexual: 'low', antichol: 'low', qt: 'low' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 1968, fdaApprovalYear: 1975, originator: "American Cyanamid (Lederle)" },
    dosing: { start: "10 mg BID", target: "60–100 mg/day", max: "250 mg/day", formulations: "Oral capsule • Inhalation powder for acute agitation (Adasuve)", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=loxapine" } },
    name: 'Loxapine',
    brandName: 'Loxitane',
    class: 'FGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '~4–8 hr (oral ~4 hr; inhaled Adasuve ~7.6 hr)', metabolites: 'None significant' },
    tmax: 2,
    p450: {
      substrate: ['CYP1A2', 'CYP2D6', 'CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No specific dose adjustment; use with caution.' },
    hepaticImpairment: { modified: true, notes: 'Use with caution' },
    geriatricDosing: { modified: true, notes: 'High EPS/sedation risk' },
    qtInterval: true,
    proteinBinding: 97,
    receptorKi: {
      SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 10000, '5HT2A': 2, '5HT2C': 12,
      D2: 10, H1: 4, alpha1: 14, alpha2: 10000, M1: 200
    },
    indications: [
      { use: 'Schizophrenia', year: 1975 },
      { use: 'Acute Agitation in Schizophrenia/Bipolar (inhaled)', year: 2012 },
    ]
  }
  ,{
    id: 'molindone',
    effects: { weight: 'minimal', sedation: 'low', sexual: 'low', antichol: 'minimal', qt: 'minimal' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 1966, fdaApprovalYear: 1974, originator: "Endo Laboratories" },
    dosing: { start: "50–75 mg/day", target: "50–100 mg/day", max: "225 mg/day", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=molindone" } },
    name: 'Molindone',
    brandName: 'Moban',
    class: 'FGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '~1.5 hr (parent); active metabolites ~24 hr', metabolites: 'Active metabolites: ~24 hr' },
    tmax: 1.5,
    pkCurve: { note: 'parent only; active metabolites ~24 h' },
    p450: {
      substrate: ['CYP2D6'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No specific dose adjustment recommended; use with caution.' },
    hepaticImpairment: { modified: true, notes: 'Use with caution' },
    geriatricDosing: { modified: true, notes: 'Use with caution; EPS risk' },
    qtInterval: false,
    proteinBinding: 76,
    receptorKi: { SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 10000, '5HT2A': 10000, '5HT2C': 10000, D2: 7, H1: 10000, alpha1: 100, alpha2: 10000, M1: 10000 },
    indications: [
      { use: 'Schizophrenia', year: 1974 },
    ]
  }

  // ── Additional SGAs ─────────────────────────────────────────────────────
  ,{
    id: 'paliperidone',
    effects: { weight: 'moderate', sedation: 'low', sexual: 'high', antichol: 'minimal', qt: 'low' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 1980, fdaApprovalYear: 2006, originator: "Janssen" },
    dosing: { start: "6 mg/day", target: "3–12 mg/day", max: "12 mg/day", formulations: "Oral ER once daily (Invega) • LAI (Sustenna monthly; Trinza q3mo; Hafyera q6mo)", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=paliperidone" } },
    name: 'Paliperidone',
    brandName: 'Invega',
    class: 'SGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: true, name: '9-Hydroxyrisperidone (active metabolite of risperidone)' },
    halfLife: { drug: '23 hr', metabolites: 'None (primarily renal elimination)' },
    tmax: 24,
    p450: {
      substrate: [],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'Reduce dose (CrCl 50–79: max 6 mg; CrCl 10–49: max 3 mg)', severe: 'Avoid if CrCl <10', notes: 'Dose-adjust based on CrCl: max 6 mg/day (CrCl 50–79), max 3 mg/day (CrCl 10–49). Avoid if CrCl <10 mL/min.' },
    hepaticImpairment: { modified: false, notes: 'No adjustment needed (renal elimination)' },
    geriatricDosing: { modified: true, notes: 'Renal function decreases with age; dose-adjust accordingly' },
    qtInterval: true,
    proteinBinding: 74,
    receptorKi: {
      SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 10000, '5HT2A': 0.5, '5HT2C': 10000,
      D2: 2, D3: 10, H1: 6, alpha1: 1, alpha2: 10, M1: 10000
    },
    indications: [
      { use: 'Schizophrenia', year: 2006 },
      { use: 'Schizoaffective Disorder', year: 2009 },
    ]
  }
  ,{
    id: 'iloperidone',
    effects: { weight: 'moderate', sedation: 'moderate', sexual: 'moderate', antichol: 'minimal', qt: 'high' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 1995, fdaApprovalYear: 2009, originator: "Hoechst Marion Roussel / Vanda" },
    dosing: { start: "1 mg BID, titrate over ~7 days", target: "12–24 mg/day", max: "24 mg/day", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=iloperidone" } },
    name: 'Iloperidone',
    brandName: 'Fanapt',
    class: 'SGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '18 hr', metabolites: 'P88: 26 hr (37 hr in CYP2D6 PMs); P95: 23 hr (31 hr in PMs)' },
    tmax: 3,
    p450: {
      substrate: ['CYP2D6', 'CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No dose adjustment required; not significantly renally excreted.' },
    hepaticImpairment: { modified: true, notes: 'Mild: no adjustment. Moderate: use with caution. Severe: not recommended.' },
    geriatricDosing: { modified: false, notes: 'Use with caution; orthostatic hypotension and QT risks increase with age.' },
    qtInterval: true,
    proteinBinding: 97,
    receptorKi: {
      SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 168, '5HT2A': 5.6, '5HT2C': 10000,
      D1: 216, D2: 6.3, D3: 7.1, H1: 437, alpha1: 0.36, alpha2: 10000,
      M1: 10000
    },
    indications: [
      { use: 'Schizophrenia', year: 2009 },
      { use: 'Bipolar Mania', year: 2024, dx: 'Bipolar I', phase: 'Acute manic or mixed episodes', line: 'Monotherapy', age: 'Adults' },
    ]
  }
  ,{
    id: 'brexpiprazole',
    effects: { weight: 'low', sedation: 'low', sexual: 'minimal', antichol: 'minimal', qt: 'minimal' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 2006, fdaApprovalYear: 2015, originator: "Otsuka / Lundbeck" },
    dosing: { start: "1 mg/day", target: "2–4 mg/day", max: "4 mg/day", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=brexpiprazole" } },
    name: 'Brexpiprazole',
    brandName: 'Rexulti',
    class: 'SGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '91 hr', metabolites: 'None significant' },
    tmax: 4,
    p450: {
      substrate: ['CYP2D6', 'CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'CrCl <60: max 2 mg/day (MDD, AD agitation) or 3 mg/day (schizophrenia)', severe: 'Max 2 mg/day (MDD, AD agitation) or 3 mg/day (schizophrenia)', notes: 'Moderate, severe, or end-stage renal impairment (CrCl <60): maximum 2 mg/day for MDD and for agitation in Alzheimer dementia; 3 mg/day for schizophrenia.' },
    hepaticImpairment: { modified: true, notes: 'Moderate-severe (Child-Pugh ≥7): maximum 2 mg/day for MDD and for agitation in Alzheimer dementia; 3 mg/day for schizophrenia.' },
    geriatricDosing: { modified: false, notes: 'No specific adjustment; monitor for orthostatic hypotension and EPS.' },
    qtInterval: false,
    proteinBinding: 99,
    receptorKi: { SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 0.12, '5HT2A': 0.47, '5HT2C': 2.1, D2: 0.3, D3: 1.1, H1: 19, alpha1: 0.6, alpha2: 0.5, M1: 10000 },
    indications: [
      { use: 'Schizophrenia', year: 2015 },
      { use: 'MDD (adjunctive to antidepressants)', year: 2015 },
      { use: "Alzheimer's-Related Agitation", year: 2023 },
    ]
  }
  ,{
    id: 'cariprazine',
    effects: { weight: 'low', sedation: 'minimal', sexual: 'minimal', antichol: 'minimal', qt: 'minimal' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 2004, fdaApprovalYear: 2015, originator: "Gedeon Richter / AbbVie" },
    dosing: { start: "1.5 mg/day", target: "1.5–6 mg/day", max: "6 mg/day", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=cariprazine" } },
    name: 'Cariprazine',
    brandName: 'Vraylar',
    class: 'SGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '2–4 days', metabolites: 'DCAR: 1–2 days; DDCAR: 1–3 weeks' },
    tmax: 4,
    p450: {
      substrate: ['CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: 'No dose adjustment needed (mild-moderate)', severe: null, notes: 'Avoid in severe renal impairment (CrCl <30 mL/min); not recommended.' },
    hepaticImpairment: { modified: true, notes: 'Avoid in severe hepatic impairment' },
    geriatricDosing: { modified: false, notes: 'Use with caution; limited data. Monitor for EPS, metabolic effects, and orthostasis.' },
    qtInterval: false,
    proteinBinding: 91,
    receptorKi: { SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 2.6, '5HT2A': 18, '5HT2C': 134, D2: 0.49, D3: 0.08, H1: 40, alpha1: 155, alpha2: 10000, M1: 10000 },
    indications: [
      { use: 'Schizophrenia', year: 2015, age: 'Adults & 13-17 yr', line: 'Pediatric (13-17 yr) indication added 2025' },
      { use: 'Bipolar Mania', year: 2015, dx: 'Bipolar I', phase: 'Acute manic or mixed episodes', line: 'Monotherapy; pediatric (10-17 yr) indication added 2025', age: 'Adults & 10-17 yr' },
      { use: 'Bipolar Depression', year: 2019, dx: 'Bipolar I', phase: 'Depressive episodes', line: 'Monotherapy', age: 'Adults' },
      { use: 'Adjunct for Major Depressive Disorder', year: 2022 },
    ]
  }
  ,{
    id: 'lumateperone',
    effects: { weight: 'minimal', sedation: 'low', sexual: 'minimal', antichol: 'minimal', qt: 'minimal' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 2010, fdaApprovalYear: 2019, originator: "Intra-Cellular Therapies" },
    dosing: { start: "42 mg/day", target: "42 mg/day", max: "42 mg/day (fixed dose; 21 mg with moderate CYP3A4 inhibitors or moderate–severe hepatic impairment; 10.5 mg with strong CYP3A4 inhibitors; avoid CYP3A4 inducers)", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=lumateperone" } },
    name: 'Lumateperone',
    brandName: 'Caplyta',
    class: 'SGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '18 hr', metabolites: 'None significant' },
    tmax: 2,
    p450: {
      substrate: ['CYP3A4', 'CYP2C8'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No dose adjustment required in mild-moderate renal impairment.' },
    hepaticImpairment: { modified: true, notes: 'Moderate or severe (Child-Pugh B/C): 21 mg once daily.' },
    geriatricDosing: { modified: false, notes: 'Use with caution; approved in adults for schizophrenia, bipolar I or II depression, and (Nov 2025) adjunctive MDD. Boxed warning for increased mortality in older patients with dementia-related psychosis. Monitor for sedation and orthostasis.' },
    qtInterval: false,
    proteinBinding: 97,
    receptorKi: {
      SERT: 33, NET: 10000, DAT: 10000, '5HT1A': 10000, '5HT2A': 0.54, '5HT2C': 10000,
      D1: 41, D2: 32, D3: 10000, H1: 10000, alpha1: 73, alpha2: 10000,
      M1: 10000
    },
    indications: [
      { use: 'Schizophrenia', year: 2019, phase: 'Acute; relapse prevention added April 2026' },
      { use: 'Bipolar Depression', year: 2021, dx: 'Bipolar I or II', phase: 'Depressive episodes', line: 'Monotherapy or adjunct to lithium/valproate', age: 'Adults' },
      { use: 'Adjunct for Major Depressive Disorder', year: 2025, age: 'Adults', line: 'Adjunctive to antidepressants' },
    ]
  }
  ,{
    id: 'pimavanserin',
    effects: { weight: 'minimal', sedation: 'minimal', sexual: 'none', antichol: 'minimal', qt: 'moderate' }, // tiers (clinician-reviewed 2026-08-20): peer-reviewed comparative literature / FDA labeling / CredibleMeds (see psychopharm-tolerability-SOURCES.md)
    development: { discoveryYear: 2001, fdaApprovalYear: 2016, originator: "Acadia Pharmaceuticals" },
    dosing: { start: "34 mg/day", target: "34 mg/day", max: "34 mg/day (fixed dose)", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=pimavanserin" } },
    name: 'Pimavanserin',
    brandName: 'Nuplazid',
    class: 'SGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '57 hr', metabolites: 'Active metabolite: ~200 hr' },
    tmax: 6,
    p450: {
      substrate: ['CYP3A4', 'CYP3A5'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No dose adjustment for mild to severe renal impairment or ESRD; use caution in severe impairment (CrCl <30) and ESRD, where exposure is higher and experience is limited. Not removed by dialysis.' },
    hepaticImpairment: { modified: false, notes: 'No dose adjustment needed in hepatic impairment (label).' },
    geriatricDosing: { modified: false, notes: 'Main population; well studied in elderly with PD psychosis' },
    qtInterval: true,
    proteinBinding: 95,
    receptorKi: { SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 10000, '5HT2A': 0.08, '5HT2C': 0.3, D2: 10000, D3: 10000, H1: 10000, alpha1: 10000, alpha2: 10000, M1: 10000 },
    indications: [
      { use: "Parkinson's Disease Psychosis", year: 2016 },
    ]
  }

  // ── Additional Mood Stabilizers ─────────────────────────────────────────
  ,{
    id: 'oxcarbazepine',
    effects: { weight: 'minimal', sedation: 'moderate', sexual: 'minimal', antichol: 'none', qt: 'minimal', review: true }, // tiers (drafted 2026-10-01 from FDA labeling adverse reactions / W&P; pending clinician review — not yet in psychopharm-tolerability.csv)
    development: { discoveryYear: 1966, fdaApprovalYear: 2000, originator: "Geigy (Novartis)" },
    dosing: { start: "300 mg BID", target: "1200 mg/day", max: "2400 mg/day", formulations: "IR BID (Trileptal) • XR once daily (Oxtellar XR)", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=oxcarbazepine" } },
    name: 'Oxcarbazepine',
    brandName: 'Trileptal',
    class: 'Mood Stabilizer',
    category: 'Mood Stabilizer',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '~2 hr (parent); MHD ~9 hr', metabolites: 'MHD (licarbazepine, racemic 10-monohydroxy derivative, active): ~9 hr' },
    tmax: 4.5,
    pkCurve: { hl: 9, tmax: 4.5, note: 'MHD (active metabolite)' },
    p450: {
      substrate: [],
      inhibits: { 'CYP2C19': 'moderate' },
      induces: { 'CYP3A4': 'weak' }
    },
    renalImpairment: { modified: true, moderate: 'Reduce starting dose by 50% (CrCl <30)', severe: 'Monitor closely', notes: 'Reduce initial dose by 50% if CrCl <30 mL/min; titrate slowly.' },
    hepaticImpairment: { modified: true, notes: 'No adjustment mild-moderate; avoid severe' },
    geriatricDosing: { modified: false, notes: 'Monitor sodium; hyponatremia risk' },
    qtInterval: false,
    proteinBinding: 40,
    receptorKi: null,
    mechanism: 'Sodium channel blocker (voltage-gated Na⁺ channels); active metabolite (MHD) responsible for anticonvulsant and mood-stabilizing effects; less drug interaction burden than carbamazepine; hyponatremia risk more pronounced than carbamazepine',
    indications: [
      { use: 'Partial Seizures (monotherapy/adjunctive)', year: 2000 },
    ]
  }
  ,{
    id: 'topiramate',
    effects: { weight: 'minimal', sedation: 'moderate', sexual: 'low', antichol: 'none', qt: 'minimal', review: true }, // tiers (drafted 2026-10-01 from FDA labeling adverse reactions / W&P; pending clinician review — not yet in psychopharm-tolerability.csv)
    development: { discoveryYear: 1979, fdaApprovalYear: 1996, originator: "Ortho-McNeil (Janssen)" },
    dosing: { start: "25–50 mg/day", target: "100–200 mg/day", max: "400 mg/day", formulations: "IR BID • XR once daily (Trokendi XR / Qudexy XR)", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=topiramate" } },
    name: 'Topiramate',
    brandName: 'Topamax',
    class: 'Mood Stabilizer',
    category: 'Mood Stabilizer',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '21 hr', metabolites: 'None active' },
    tmax: 2,
    p450: {
      substrate: ['CYP2C19', 'CYP3A4'],
      inhibits: { 'CYP2C19': 'weak' },
      induces: { 'CYP3A4': 'weak' }
    },
    renalImpairment: { modified: true, moderate: 'Reduce dose 50% (CrCl <70)', severe: 'Hemodialysis patients supplement dose', notes: 'Reduce dose by approximately 50% in moderate-severe renal impairment (CrCl <70 mL/min).' },
    hepaticImpairment: { modified: true, notes: 'Use with caution' },
    geriatricDosing: { modified: false, notes: 'Use with caution; cognitive side effects (word-finding) may be more pronounced. Adjust for renal function.' },
    qtInterval: false,
    proteinBinding: 15,
    proteinBindingNote: '15–41%, concentration-dependent (label)',
    receptorKi: null,
    mechanism: 'Multiple mechanisms: voltage-gated Na⁺ channel blockade; GABA-A PAM at non-BZD site; AMPA/kainate glutamate receptor antagonism; carbonic anhydrase inhibition; weight loss is common (unique among anticonvulsants); cognitive side effects ("dopamax")',
    indications: [
      { use: 'Partial Seizures (adjunctive)', year: 1996 },
      { use: 'Primary Generalized Tonic-Clonic Seizures', year: 1996 },
      { use: 'Lennox-Gastaut Syndrome (adjunctive)', year: 1998 },
      { use: 'Migraine Prophylaxis', year: 2004 },
    ]
  }
  ,{
    id: 'gabapentin',
    effects: { weight: 'low', sedation: 'moderate', sexual: 'low', antichol: 'none', qt: 'minimal', review: true }, // tiers (drafted 2026-10-01 from FDA labeling adverse reactions / W&P; pending clinician review — not yet in psychopharm-tolerability.csv)
    development: { discoveryYear: 1977, fdaApprovalYear: 1993, originator: "Parke-Davis (Pfizer)" },
    dosing: { start: "300 mg/day", target: "900–1800 mg/day", max: "3600 mg/day (IR; Gralise ER 1800)", formulations: "IR TID (Neurontin) • ER once daily (Gralise) • enacarbil ER BID (Horizant)", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=gabapentin" } },
    name: 'Gabapentin',
    brandName: 'Neurontin',
    class: 'Gabapentinoid',
    category: 'Mood Stabilizer',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '5–7 hr', metabolites: 'None active' },
    tmax: 3,
    p450: {
      substrate: [],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'CrCl 30–59: 400–1,400 mg/day as 200–700 mg BID', severe: 'CrCl 15–29: 200–700 mg/day once daily; CrCl <15: 100–300 mg/day once daily', notes: 'Label renal table (Neurontin): CrCl ≥60: 900–3,600 mg/day divided TID; CrCl 30–59: 400–1,400 mg/day divided BID (200–700 mg BID); CrCl 15–29: 200–700 mg/day once daily; CrCl <15: 100–300 mg/day once daily. Hemodialysis: supplemental dose after each session (125–350 mg, based on the maintenance dose).' },
    hepaticImpairment: { modified: false, notes: 'No dose adjustment required; gabapentin is not hepatically metabolized.' },
    geriatricDosing: { modified: false, notes: 'Reduce dose for age-related renal decline' },
    qtInterval: false,
    proteinBinding: 3,
    receptorKi: null,
    mechanism: 'Binds α₂δ subunit of voltage-gated calcium channels; reduces excitatory neurotransmitter release; despite name, does not act on GABA receptors; used for neuropathic pain, fibromyalgia, seizures, restless legs syndrome, anxiety (off-label)',
    indications: [
      { use: 'Partial Seizures (adjunctive)', year: 1993 },
      { use: 'Postherpetic Neuralgia', year: 2002 },
      { use: 'Restless Legs Syndrome', year: 2011 },
    ]
  }

  // ── Benzodiazepines (Anxiolytics) ───────────────────────────────────────
  ,{
    id: 'alprazolam',
    effects: { weight: 'minimal', sedation: 'moderate', sexual: 'low', antichol: 'none', qt: 'minimal', review: true }, // tiers (drafted 2026-10-01 from FDA labeling adverse reactions / W&P; pending clinician review — not yet in psychopharm-tolerability.csv)
    development: { discoveryYear: 1969, fdaApprovalYear: 1981, originator: "Upjohn (Pfizer)" },
    dosing: { start: "0.25–0.5 mg TID", target: "1–4 mg/day", max: "4 mg/day (up to 10 mg for panic)", formulations: "IR TID (Xanax) • XR once daily (Xanax XR) • ODT", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=alprazolam" } },
    name: 'Alprazolam',
    brandName: 'Xanax',
    class: 'Benzodiazepine',
    category: 'Anxiolytic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '6–12 hr', metabolites: 'Alpha-hydroxyalprazolam: 6–12 hr (less active)' },
    tmax: 1.5,
    p450: {
      substrate: ['CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No specific dose adjustment; use with caution. Primarily hepatically metabolized.' },
    hepaticImpairment: { modified: true, notes: 'Reduce dose; avoid in severe' },
    geriatricDosing: { modified: true, notes: 'Avoid (Beers List); fall/cognitive risk; reduce dose if needed' },
    qtInterval: false,
    proteinBinding: 80,
    receptorKi: { 'GABA-A': 1.0 },
    mechanism: 'GABA-A receptor positive allosteric modulator (BZD site); enhances Cl⁻ influx frequency; high-potency BZD; approved for anxiety and panic disorder; notable for rapid onset; significant dependence potential',
    indications: [
      { use: 'Generalized Anxiety Disorder', year: 1981 },
      { use: 'Panic Disorder', year: 1990 },
    ]
  }
  ,{
    id: 'clonazepam',
    effects: { weight: 'minimal', sedation: 'moderate', sexual: 'low', antichol: 'none', qt: 'minimal', review: true }, // tiers (drafted 2026-10-01 from FDA labeling adverse reactions / W&P; pending clinician review — not yet in psychopharm-tolerability.csv)
    development: { discoveryYear: 1964, fdaApprovalYear: 1975, originator: "Roche" },
    dosing: { start: "0.25–0.5 mg BID", target: "1–2 mg/day", max: "4 mg/day", formulations: "Tablet • Orally disintegrating wafer — both same dosing", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=clonazepam" } },
    name: 'Clonazepam',
    brandName: 'Klonopin',
    class: 'Benzodiazepine',
    category: 'Anxiolytic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '18–50 hr', metabolites: 'None active' },
    tmax: 3,
    p450: {
      substrate: ['CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No specific dose adjustment; use with caution. Hepatic metabolism.' },
    hepaticImpairment: { modified: true, notes: 'Use with caution; avoid in severe' },
    geriatricDosing: { modified: true, notes: 'Avoid (Beers List); long half-life increases fall/cognitive risk' },
    qtInterval: false,
    proteinBinding: 85,
    receptorKi: { 'GABA-A': 1.0 },
    mechanism: 'GABA-A receptor positive allosteric modulator (BZD site); high potency; long half-life; approved for seizures and panic disorder; also used off-label for anxiety, akathisia, REM sleep behavior disorder',
    indications: [
      { use: 'Seizure Disorders (Lennox-Gastaut, akinetic, absence)', year: 1975 },
      { use: 'Panic Disorder', year: 1997 },
    ]
  }
  ,{
    id: 'diazepam',
    effects: { weight: 'minimal', sedation: 'high', sexual: 'low', antichol: 'none', qt: 'minimal', review: true }, // tiers (drafted 2026-10-01 from FDA labeling adverse reactions / W&P; pending clinician review — not yet in psychopharm-tolerability.csv)
    development: { discoveryYear: 1959, fdaApprovalYear: 1963, originator: "Roche" },
    dosing: { start: "2–10 mg BID–QID", target: "5–40 mg/day", max: "40 mg/day", formulations: "Oral tab/solution • Rectal gel (Diastat) • Nasal spray (Valtoco) • IV/IM", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=diazepam" } },
    name: 'Diazepam',
    brandName: 'Valium',
    class: 'Benzodiazepine',
    category: 'Anxiolytic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '20–70 hr', metabolites: 'Nordiazepam (N-desmethyldiazepam, active): 36–200 hr; also temazepam, oxazepam' },
    tmax: 1,
    p450: {
      substrate: ['CYP2C19', 'CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No specific dose adjustment; active metabolites (nordiazepam, oxazepam) may accumulate. Use with caution.' },
    hepaticImpairment: { modified: true, notes: 'Reduce dose; prolonged half-life' },
    geriatricDosing: { modified: true, notes: 'Avoid (Beers List); extremely long half-life accumulation risk' },
    qtInterval: false,
    proteinBinding: 98,
    receptorKi: { 'GABA-A': 5.0 },
    mechanism: 'GABA-A receptor positive allosteric modulator (BZD site); long half-life with very long-acting active metabolites; used for anxiety, muscle relaxation, alcohol withdrawal, seizures; significant accumulation in elderly',
    indications: [
      { use: 'Anxiety Disorder', year: 1963 },
      { use: 'Alcohol Withdrawal', year: 1963 },
      { use: 'Muscle Spasm', year: 1963 },
      { use: 'Seizures / Status Epilepticus (IV)', year: 1963 },
    ]
  }
  ,{
    id: 'lorazepam',
    effects: { weight: 'minimal', sedation: 'moderate', sexual: 'low', antichol: 'none', qt: 'minimal', review: true }, // tiers (drafted 2026-10-01 from FDA labeling adverse reactions / W&P; pending clinician review — not yet in psychopharm-tolerability.csv)
    development: { discoveryYear: 1963, fdaApprovalYear: 1977, originator: "Wyeth (Pfizer)" },
    dosing: { start: "0.5–1 mg BID–TID", target: "2–6 mg/day", max: "10 mg/day", formulations: "Oral tab/concentrate • IV/IM • ER capsule once daily (Loreev XR)", citation: { label: "FDA package insert (2021)", url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2021/017794s048lbl.pdf" } },
    name: 'Lorazepam',
    brandName: 'Ativan',
    class: 'Benzodiazepine',
    category: 'Anxiolytic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '10–20 hr', metabolites: 'None active (direct glucuronidation)' },
    tmax: 2,
    p450: {
      substrate: ['UGT'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No specific dose adjustment; direct glucuronidation — safer than other BZDs in renal impairment.' },
    hepaticImpairment: { modified: true, notes: 'Preferred BZD in liver disease — cleared by Phase II glucuronidation (spared when CYP oxidation fails), so clearance is largely preserved even in cirrhosis (half-life roughly doubles). However, per FDA label lorazepam may worsen hepatic encephalopathy: use with caution, reduce the starting dose (~50%) in moderate impairment, and minimize/avoid in severe insufficiency (Child-Pugh C) or overt encephalopathy. Start low, titrate slowly, and monitor for oversedation/CNS depression. Intrinsic hepatotoxicity (DILI) is very rare.' },
    geriatricDosing: { modified: true, notes: 'Reduce dose (Beers List); no active metabolites preferred in elderly' },
    qtInterval: false,
    proteinBinding: 85,
    receptorKi: { 'GABA-A': 2.0 },
    mechanism: 'GABA-A receptor positive allosteric modulator (BZD site); medium-potency; direct glucuronidation — safer in hepatic disease; no active metabolites; parenteral forms available for status epilepticus',
    indications: [
      { use: 'Anxiety Disorder', year: 1977 },
      { use: 'Status Epilepticus (IV)', year: 1977 },
      { use: 'Preoperative Sedation', year: 1977 },
    ]
  }
  ,{
    id: 'oxazepam',
    effects: { weight: 'minimal', sedation: 'moderate', sexual: 'low', antichol: 'none', qt: 'minimal', review: true }, // tiers (drafted 2026-10-01 from FDA labeling adverse reactions / W&P; pending clinician review — not yet in psychopharm-tolerability.csv)
    development: { discoveryYear: 1961, fdaApprovalYear: 1965, originator: "Wyeth (Pfizer)" },
    dosing: { start: "10–15 mg TID–QID", target: "30–60 mg/day", max: "120 mg/day", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=oxazepam" } },
    name: 'Oxazepam',
    brandName: 'Serax',
    class: 'Benzodiazepine',
    category: 'Anxiolytic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '~8 hr (range 5.7–10.9)', metabolites: 'None active (direct glucuronidation)' },
    tmax: 3,
    p450: {
      substrate: [],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No specific dose adjustment; direct glucuronidation. One of the safest benzodiazepines in renal impairment.' },
    hepaticImpairment: { modified: false, notes: 'Safer — direct glucuronidation; preferred in liver disease' },
    geriatricDosing: { modified: false, notes: 'One of the safest BZDs in elderly (LOT rule: Lorazepam, Oxazepam, Temazepam); no active metabolites' },
    qtInterval: false,
    proteinBinding: 97,
    receptorKi: { 'GABA-A': 8.0 },
    mechanism: 'GABA-A receptor positive allosteric modulator (BZD site); short-to-medium half-life; direct glucuronidation (like lorazepam/temazepam — "LOT" BZDs); no active metabolites; preferred in elderly and hepatic impairment',
    indications: [
      { use: 'Anxiety Disorder', year: 1965 },
      { use: 'Alcohol Withdrawal', year: 1965 },
    ]
  }
  ,{
    id: 'chlordiazepoxide',
    effects: { weight: 'minimal', sedation: 'high', sexual: 'low', antichol: 'none', qt: 'minimal', review: true }, // tiers (drafted 2026-10-01 from FDA labeling adverse reactions / W&P; pending clinician review — not yet in psychopharm-tolerability.csv)
    development: { discoveryYear: 1955, fdaApprovalYear: 1960, originator: "Roche" },
    dosing: { start: "5–10 mg TID–QID", target: "15–40 mg/day", max: "100 mg/day", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=chlordiazepoxide" } },
    name: 'Chlordiazepoxide',
    brandName: 'Librium',
    class: 'Benzodiazepine',
    category: 'Anxiolytic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '5–30 hr', metabolites: 'Demoxepam, desmethylchlordiazepoxide, nordiazepam: up to 200 hr' },
    tmax: 2,
    p450: {
      substrate: ['CYP3A4', 'CYP2C19'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No specific dose adjustment; use with caution. Very long-acting metabolite chain may accumulate.' },
    hepaticImpairment: { modified: true, notes: 'Use with caution; very long-acting metabolites' },
    geriatricDosing: { modified: true, notes: 'Avoid (Beers List); very long half-life chain accumulates' },
    qtInterval: false,
    proteinBinding: 96,
    receptorKi: { 'GABA-A': 10.0 },
    mechanism: 'GABA-A receptor positive allosteric modulator (BZD site); first clinically used BZD (1960); classic agent for alcohol withdrawal (CIWA protocol); very long-acting due to multiple active metabolites',
    indications: [
      { use: 'Anxiety Disorder', year: 1960 },
      { use: 'Alcohol Withdrawal', year: 1960 },
    ]
  }
  ,{
    id: 'clorazepate',
    effects: { weight: 'minimal', sedation: 'moderate', sexual: 'low', antichol: 'none', qt: 'minimal', review: true }, // tiers (drafted 2026-10-01 from FDA labeling adverse reactions / W&P; pending clinician review — not yet in psychopharm-tolerability.csv)
    development: { discoveryYear: 1968, fdaApprovalYear: 1972, originator: "Abbott" },
    dosing: { start: "7.5–15 mg/day", target: "15–60 mg/day", max: "90 mg/day", formulations: "Regular tablet (divided) • Once-daily formulation (Tranxene-SD)", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=clorazepate" } },
    name: 'Clorazepate',
    brandName: 'Tranxene',
    class: 'Benzodiazepine',
    category: 'Anxiolytic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: 'Parent very short (prodrug); nordiazepam: 36–200 hr', metabolites: 'Nordiazepam: 36–200 hr' },
    tmax: 1,
    p450: {
      substrate: ['CYP3A4','CYP2C19'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No specific dose adjustment; converted to nordiazepam which may accumulate. Use with caution.' },
    hepaticImpairment: { modified: true, notes: 'Use with caution; nordiazepam accumulates' },
    geriatricDosing: { modified: true, notes: 'Avoid (Beers List)' },
    qtInterval: false,
    proteinBinding: 97,
    receptorKi: { 'GABA-A': 5.0 },
    mechanism: 'Prodrug: converted by GI acid to nordiazepam (active, the same metabolite as diazepam); GABA-A PAM; used for anxiety and seizures; long-acting due to nordiazepam',
    indications: [
      { use: 'Anxiety Disorder', year: 1972 },
      { use: 'Alcohol Withdrawal', year: 1972 },
      { use: 'Partial Seizures (adjunctive)', year: 1981 },
    ]
  }
  ,{
    id: 'midazolam',
    effects: { weight: 'none', sedation: 'high', sexual: 'none', antichol: 'none', qt: 'minimal', review: true }, // tiers (drafted 2026-10-01 from FDA labeling adverse reactions / W&P; pending clinician review — not yet in psychopharm-tolerability.csv)
    development: { discoveryYear: 1976, fdaApprovalYear: 1985, originator: "Roche" },
    dosing: { start: "1–2.5 mg IV (procedural sedation)", target: "titrate to effect", max: "per procedure / route", formulations: "IV/IM • Oral syrup • Nasal spray for seizure rescue (Nayzilam)", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=midazolam" } },
    name: 'Midazolam',
    brandName: 'Versed',
    class: 'Benzodiazepine',
    category: 'Anxiolytic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '1.5–2.5 hr', metabolites: '1-Hydroxymidazolam: ~1 hr' },
    tmax: 0.5,
    p450: {
      substrate: ['CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No specific dose adjustment for single doses; active metabolite (1-hydroxymidazolam glucuronide) accumulates in renal failure with repeated dosing.' },
    hepaticImpairment: { modified: true, notes: 'Reduce dose; avoid in severe' },
    geriatricDosing: { modified: true, notes: 'Reduce dose significantly; higher sensitivity to respiratory depression' },
    qtInterval: false,
    proteinBinding: 97,
    receptorKi: { 'GABA-A': 2.0 },
    mechanism: 'GABA-A receptor positive allosteric modulator (BZD site); ultra-short acting; water-soluble at acidic pH; parenteral form for procedural sedation/anesthesia; high potency; rapid onset; used in ICU sedation',
    indications: [
      { use: 'Procedural Sedation / Anesthesia Induction', year: 1985 },
      { use: 'Status Epilepticus (buccal/intranasal forms)', year: 2019 },
    ]
  }
  ,{
    id: 'triazolam',
    effects: { weight: 'minimal', sedation: 'high', sexual: 'low', antichol: 'none', qt: 'minimal', review: true }, // tiers (drafted 2026-10-01 from FDA labeling adverse reactions / W&P; pending clinician review — not yet in psychopharm-tolerability.csv)
    development: { discoveryYear: 1970, fdaApprovalYear: 1982, originator: "Upjohn (Pfizer)" },
    dosing: { start: "0.125–0.25 mg qHS", target: "0.25 mg qHS", max: "0.5 mg/day", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=triazolam" } },
    name: 'Triazolam',
    brandName: 'Halcion',
    class: 'Benzodiazepine',
    category: 'Anxiolytic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '1.5–5.5 hr', metabolites: 'None active' },
    tmax: 1.5,
    p450: {
      substrate: ['CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No specific dose adjustment; hepatic metabolism. Use with caution.' },
    hepaticImpairment: { modified: true, notes: 'Avoid in severe' },
    geriatricDosing: { modified: true, notes: 'Avoid (Beers List); very high potency' },
    qtInterval: false,
    proteinBinding: 89,
    receptorKi: { 'GABA-A': 0.3 },
    mechanism: 'GABA-A receptor positive allosteric modulator (BZD site); very short half-life; very high potency; used for insomnia; significant next-day amnesia and rebound insomnia risk',
    indications: [
      { use: 'Insomnia (short-term)', year: 1982 },
    ]
  }
  ,{
    id: 'estazolam',
    effects: { weight: 'minimal', sedation: 'high', sexual: 'low', antichol: 'none', qt: 'minimal', review: true }, // tiers (drafted 2026-10-01 from FDA labeling adverse reactions / W&P; pending clinician review — not yet in psychopharm-tolerability.csv)
    development: { discoveryYear: 1967, fdaApprovalYear: 1990, originator: "Abbott" },
    dosing: { start: "1 mg qHS", target: "1–2 mg qHS", max: "2 mg/day", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=estazolam" } },
    name: 'Estazolam',
    brandName: 'Prosom',
    class: 'Benzodiazepine',
    category: 'Anxiolytic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '10–24 hr', metabolites: 'None active' },
    tmax: 2,
    p450: {
      substrate: ['CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No specific dose adjustment; use with caution in renal impairment.' },
    hepaticImpairment: { modified: true, notes: 'Use with caution' },
    geriatricDosing: { modified: true, notes: 'Avoid (Beers List)' },
    qtInterval: false,
    proteinBinding: 93,
    receptorKi: { 'GABA-A': 1.5 },
    mechanism: 'GABA-A receptor positive allosteric modulator (BZD site); intermediate half-life; indicated for insomnia; Schedule IV controlled substance',
    indications: [
      { use: 'Insomnia (short-term)', year: 1990 },
    ]
  }
  ,{
    id: 'flurazepam',
    effects: { weight: 'minimal', sedation: 'high', sexual: 'low', antichol: 'none', qt: 'minimal', review: true }, // tiers (drafted 2026-10-01 from FDA labeling adverse reactions / W&P; pending clinician review — not yet in psychopharm-tolerability.csv)
    development: { discoveryYear: 1968, fdaApprovalYear: 1970, originator: "Roche" },
    dosing: { start: "15 mg qHS", target: "15–30 mg qHS", max: "30 mg/day", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=flurazepam" } },
    name: 'Flurazepam',
    brandName: 'Dalmane',
    class: 'Benzodiazepine',
    category: 'Anxiolytic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '2–3 hr (parent)', metabolites: 'Desalkylflurazepam (active): 47–100 hr (longer in older adults, up to ~250 hr reported)' },
    tmax: 1,
    pkCurve: { note: 'parent only; desalkylflurazepam 47–100 h' },
    p450: {
      substrate: ['CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No specific dose adjustment; use with caution. Very long-acting active metabolite (desalkylflurazepam, t½ 47–100 hr, longer in older adults) may accumulate.' },
    hepaticImpairment: { modified: true, notes: 'Use with caution; long-acting metabolites accumulate' },
    geriatricDosing: { modified: true, notes: 'Avoid (Beers List); extreme accumulation risk with long-lived metabolite' },
    qtInterval: false,
    proteinBinding: 97,
    receptorKi: { 'GABA-A': 1.0 },
    mechanism: 'GABA-A receptor positive allosteric modulator (BZD site); effective sleep induction but very long-acting active metabolite causes next-day sedation; poor choice for elderly',
    indications: [
      { use: 'Insomnia (short-term)', year: 1970 },
    ]
  }

  // ── Other Anxiolytics ───────────────────────────────────────────────────
  ,{
    id: 'buspirone',
    effects: { weight: 'none', sedation: 'low', sexual: 'minimal', antichol: 'none', qt: 'minimal', review: true }, // tiers (drafted 2026-10-01 from FDA labeling adverse reactions / W&P; pending clinician review — not yet in psychopharm-tolerability.csv)
    development: { discoveryYear: 1972, fdaApprovalYear: 1986, originator: "Bristol-Myers Squibb" },
    dosing: { start: "7.5 mg BID", target: "20–30 mg/day", max: "60 mg/day", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=buspirone" } },
    name: 'Buspirone',
    brandName: 'BuSpar',
    class: 'Azapirone',
    category: 'Anxiolytic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '2–3 hr', metabolites: '1-PP (active): alpha2/D2 antagonist' },
    tmax: 1,
    p450: {
      substrate: ['CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'Reduce dose; use with caution', severe: 'Avoid', notes: 'Avoid in severe renal impairment (CrCl <10 mL/min). Use with caution in moderate impairment.' },
    hepaticImpairment: { modified: true, notes: 'Reduce dose; avoid in severe' },
    geriatricDosing: { modified: false, notes: 'Good option; no abuse potential' },
    qtInterval: false,
    proteinBinding: 86,
    receptorKi: {
      SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 40, '5HT2A': 10000, '5HT2C': 10000,
      D2: 190, D3: 98, H1: 10000, alpha1: 10000, alpha2: 10000, M1: 10000
    },
    indications: [
      { use: 'Generalized Anxiety Disorder', year: 1986 },
    ]
  }
  ,{
    id: 'pregabalin',
    effects: { weight: 'moderate', sedation: 'moderate', sexual: 'low', antichol: 'none', qt: 'minimal', review: true }, // tiers (drafted 2026-10-01 from FDA labeling adverse reactions / W&P; pending clinician review — not yet in psychopharm-tolerability.csv)
    development: { discoveryYear: 1990, fdaApprovalYear: 2004, originator: "Northwestern Univ. / Parke-Davis (Pfizer)" },
    dosing: { start: "75 mg BID", target: "150–300 mg/day (divided)", max: "600 mg/day", formulations: "IR BID–TID (Lyrica) • ER once daily (Lyrica CR)", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=pregabalin" } },
    name: 'Pregabalin',
    brandName: 'Lyrica',
    class: 'Gabapentinoid',
    category: 'Anxiolytic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '6 hr', metabolites: 'None active' },
    tmax: 1.5,
    p450: {
      substrate: [],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'Reduce dose proportional to CrCl', severe: 'Significant reduction; dialysis supplement', notes: 'Dose-adjust based on CrCl: CrCl 30–60: max 300 mg/day; CrCl 15–30: max 150 mg/day; CrCl <15: max 75 mg/day. Supplemental dose after dialysis.' },
    hepaticImpairment: { modified: false, notes: 'No dose adjustment required; pregabalin is not hepatically metabolized.' },
    geriatricDosing: { modified: false, notes: 'Reduce dose for age-related renal function decline' },
    qtInterval: false,
    proteinBinding: 0,
    receptorKi: null,
    mechanism: 'Binds α₂δ subunit of voltage-gated calcium channels; reduces excitatory neurotransmitter release; FDA-approved for anxiety (GAD), neuropathic pain, fibromyalgia, partial seizures; higher bioavailability and faster absorption than gabapentin; Schedule V in US',
    indications: [
      { use: 'Diabetic Peripheral Neuropathy', year: 2004 },
      { use: 'Postherpetic Neuralgia', year: 2004 },
      { use: 'Partial Seizures (adjunctive)', year: 2005 },
      { use: 'Fibromyalgia', year: 2007 },
      { use: 'Neuropathic Pain (spinal cord injury)', year: 2012 },
    ]
  }
  ,{
    id: 'propranolol',
    effects: { weight: 'low', sedation: 'low', sexual: 'low', antichol: 'none', qt: 'minimal', review: true }, // tiers (drafted 2026-10-01 from FDA labeling adverse reactions / W&P; pending clinician review — not yet in psychopharm-tolerability.csv)
    development: { discoveryYear: 1962, fdaApprovalYear: 1967, originator: "ICI (AstraZeneca)" },
    dosing: { start: "10–20 mg BID (akathisia/performance anxiety)", target: "40–80 mg/day", max: "~160 mg/day (psychiatric off-label)", formulations: "IR BID–TID (Inderal) • LA extended-release once daily (Inderal LA / InnoPran XL) • IV", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=propranolol" } },
    name: 'Propranolol',
    brandName: 'Inderal',
    class: 'Beta Blocker',
    category: 'Anxiolytic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '3–6 hr', metabolites: 'None active' },
    tmax: 1.5,
    p450: {
      substrate: ['CYP1A2', 'CYP2D6'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No specific dose adjustment; primarily hepatically metabolized. Use with caution in severe impairment.' },
    hepaticImpairment: { modified: true, notes: 'Reduce dose in significant hepatic disease' },
    geriatricDosing: { modified: false, notes: 'Use caution due to bradycardia/hypotension risk' },
    qtInterval: false,
    proteinBinding: 90,
    receptorKi: null,
    mechanism: 'Non-selective β1/β2 adrenergic receptor antagonist; lipophilic — crosses BBB; reduces peripheral manifestations of anxiety (tachycardia, tremor); used off-label for performance anxiety; also used for essential tremor, hypertension, post-MI; not a controlled substance; does not treat psychological anxiety',
    indications: [
      { use: 'Hypertension', year: 1967 },
      { use: 'Angina Pectoris', year: 1967 },
      { use: 'Cardiac Arrhythmias', year: 1967 },
      { use: 'Essential Tremor', year: 1973 },
      { use: 'Migraine Prophylaxis', year: 1973 },
      { use: 'Post-Myocardial Infarction', year: 1975 },
    ]
  }
  ,{
    id: 'clonidine',
    effects: { weight: 'minimal', sedation: 'high', sexual: 'low', antichol: 'minimal', qt: 'minimal', review: true }, // tiers (drafted 2026-10-01 from FDA labeling adverse reactions / W&P; pending clinician review — not yet in psychopharm-tolerability.csv)
    development: { discoveryYear: 1962, fdaApprovalYear: 1974, originator: "Boehringer Ingelheim" },
    dosing: { start: "0.1 mg qHS", target: "0.1–0.4 mg/day", max: "0.4 mg/day (ADHD, ER)", formulations: "IR oral BID (Catapres) • ER oral (Kapvay, ADHD) • weekly transdermal patch (Catapres-TTS)", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=clonidine" } },
    name: 'Clonidine',
    brandName: 'Catapres',
    class: 'Alpha-2 Agonist',
    category: 'Anxiolytic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '12–16 hr', metabolites: 'None active' },
    tmax: 3,
    p450: {
      substrate: ['CYP2D6'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'Reduce dose', severe: 'Significant reduction', notes: 'Use with caution; reduce dose in severe renal impairment. Up to 65% eliminated renally.' },
    hepaticImpairment: { modified: false, notes: 'Use with caution' },
    geriatricDosing: { modified: false, notes: 'Monitor blood pressure carefully' },
    qtInterval: false,
    proteinBinding: 30,
    receptorKi: {
      SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 10000, '5HT2A': 10000, '5HT2C': 10000,
      D2: 10000, D3: 10000, H1: 10000, alpha1: 500, alpha2: 0.5, M1: 10000
    },
    indications: [
      { use: 'Hypertension', year: 1974 },
      { use: 'ADHD (Kapvay ER)', year: 2010 },
    ]
  }
  ,{
    id: 'guanfacine',
    effects: { weight: 'minimal', sedation: 'moderate', sexual: 'minimal', antichol: 'minimal', qt: 'minimal', review: true }, // tiers (drafted 2026-10-01 from FDA labeling adverse reactions / W&P; pending clinician review — not yet in psychopharm-tolerability.csv)
    development: { discoveryYear: 1974, fdaApprovalYear: 1986, originator: "Boehringer Ingelheim / Shire" },
    dosing: { start: "1 mg/day", target: "1–4 mg/day", max: "4 mg/day (ADHD, ER)", formulations: "IR (Tenex, hypertension) • ER once daily (Intuniv, ADHD)", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=guanfacine" } },
    name: 'Guanfacine',
    brandName: 'Tenex / Intuniv',
    class: 'Alpha-2 Agonist',
    category: 'Anxiolytic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: 'IR: 17 hr; ER: ~18 hr', metabolites: 'None significant' },
    tmax: 3,
    p450: {
      substrate: ['CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'No specific adjustment needed', severe: 'Possible dose reduction', notes: 'Reduce dose in significant renal impairment; about 50% (40–75%) excreted unchanged in urine.' },
    hepaticImpairment: { modified: true, notes: 'Dose reduction may be needed in significant hepatic impairment (Intuniv label); metabolized by CYP3A4.' },
    geriatricDosing: { modified: false, notes: 'Use with caution; monitor blood pressure and heart rate. Sedation risk.' },
    qtInterval: false,
    proteinBinding: 70,
    receptorKi: { SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 10000, '5HT2A': 10000, '5HT2C': 10000, D2: 10000, D3: 10000, H1: 10000, alpha1: 10000, alpha2: 3, M1: 10000 },
    indications: [
      { use: 'Hypertension (Tenex IR)', year: 1986 },
      { use: 'ADHD (Intuniv ER)', year: 2009 },
    ]
  }

  // ── Antihistamines / Sleep ──────────────────────────────────────────────
  ,{
    id: 'doxylamine',
    effects: { weight: 'low', sedation: 'high', sexual: 'minimal', antichol: 'high', qt: 'minimal', review: true }, // tiers (drafted 2026-10-01 from FDA labeling adverse reactions / W&P; pending clinician review — not yet in psychopharm-tolerability.csv)
    development: { discoveryYear: 1948, fdaApprovalYear: 1948, originator: "Various (OTC)" },
    dosing: { start: "25 mg qHS", target: "25 mg qHS", max: "25 mg/day (OTC hypnotic)", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=doxylamine" } },
    name: 'Doxylamine',
    brandName: 'Unisom / Diclegis',
    class: 'Antihistamine',
    category: 'Sleep',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '10 hr', metabolites: 'None active' },
    tmax: 2.5,
    p450: {
      substrate: ['CYP2D6', 'CYP1A2'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No specific dose adjustment; use with caution in renal impairment.' },
    hepaticImpairment: { modified: false, notes: 'Use with caution in hepatic impairment; hepatically metabolized.' },
    geriatricDosing: { modified: true, notes: 'Avoid (Beers List); anticholinergic burden + fall risk' },
    qtInterval: false,
    proteinBinding: 73,
    receptorKi: { SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 10000, '5HT2A': 10000, '5HT2C': 10000, D2: 10000, H1: 0.5, alpha1: 10000, alpha2: 10000, M1: 50 },
    indications: [
      { use: 'Nausea/Vomiting of Pregnancy (Diclegis)', year: 2013 },
      { use: 'Insomnia (OTC)', year: 1978 },
    ]
  }

  // ── Stimulants ──────────────────────────────────────────────────────────
  ,{
    id: 'methylphenidate',
    effects: { weight: 'minimal', sedation: 'minimal', sexual: 'low', antichol: 'none', qt: 'minimal', review: true }, // tiers (drafted 2026-10-01 from FDA labeling adverse reactions / W&P; pending clinician review — not yet in psychopharm-tolerability.csv)
    development: { discoveryYear: 1944, fdaApprovalYear: 1955, originator: "Ciba (Novartis)" },
    dosing: { start: "5 mg BID (IR)", target: "20–40 mg/day", max: "60 mg/day (72 mg some ER)", formulations: "IR BID–TID (Ritalin) • ER/LA/CD once daily • OROS once daily (Concerta) • transdermal patch (Daytrana) • liquid XR (Quillivant)", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=methylphenidate" } },
    name: 'Methylphenidate',
    brandName: 'Ritalin',
    class: 'Stimulant',
    category: 'Stimulant',
    activeEnantiomer: { has: true, name: 'd-threo enantiomer (active)' },
    halfLife: { drug: '2–3 hr (IR)', metabolites: 'Ritalinic acid (inactive)' },
    tmax: 2,
    p450: {
      substrate: [],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No dose adjustment required; de-esterified to ritalinic acid, predominantly renally excreted as inactive metabolite.' },
    hepaticImpairment: { modified: true, notes: 'No specific adjustment; use with caution in severe hepatic impairment.' },
    geriatricDosing: { modified: false, notes: 'Use with caution; cardiovascular monitoring important. Limited geriatric data.' },
    qtInterval: false,
    proteinBinding: 15,
    receptorKi: { SERT: 10000, NET: 130, DAT: 34, '5HT1A': 10000, '5HT2A': 10000, '5HT2C': 10000, D2: 10000, D3: 10000, H1: 10000, alpha1: 10000, alpha2: 10000, M1: 10000 },
    indications: [
      { use: 'ADHD', year: 1955 },
      { use: 'Narcolepsy', year: 1955 },
    ]
  }
  ,{
    id: 'dexmethylphenidate',
    effects: { weight: 'minimal', sedation: 'minimal', sexual: 'low', antichol: 'none', qt: 'minimal', review: true }, // tiers (drafted 2026-10-01 from FDA labeling adverse reactions / W&P; pending clinician review — not yet in psychopharm-tolerability.csv)
    development: { discoveryYear: 1999, fdaApprovalYear: 2001, originator: "Novartis / Celgene" },
    dosing: { start: "2.5 mg BID (IR) / 10 mg XR", target: "10–20 mg/day", max: "40 mg/day (XR), 20 mg (IR)", formulations: "IR BID (Focalin) • XR once daily (Focalin XR)", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=dexmethylphenidate" } },
    name: 'Dexmethylphenidate',
    brandName: 'Focalin',
    class: 'Stimulant',
    category: 'Stimulant',
    activeEnantiomer: { has: true, name: 'd-threo-methylphenidate (active enantiomer of methylphenidate)' },
    halfLife: { drug: '~3 hr adults (2–3 hr children)', metabolites: 'None significant' },
    tmax: 1.5,
    p450: {
      substrate: [],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No dose adjustment required; inactive metabolite predominantly renally excreted.' },
    hepaticImpairment: { modified: false, notes: 'No specific adjustment; use with caution.' },
    geriatricDosing: { modified: false, notes: 'Use with caution; cardiovascular monitoring essential. Limited geriatric data.' },
    qtInterval: false,
    proteinBinding: 15,
    receptorKi: { SERT: 10000, NET: 130, DAT: 34, '5HT1A': 10000, '5HT2A': 10000, '5HT2C': 10000, D2: 10000, D3: 10000, H1: 10000, alpha1: 10000, alpha2: 10000, M1: 10000 },
    mechanism: 'd-threo isomer of methylphenidate; pharmacologically equivalent but ~2× more potent (only active enantiomer); same DAT/NET reuptake inhibition; ER formulation (Focalin XR) provides bimodal release',
    indications: [
      { use: 'ADHD', year: 2001 },
    ]
  }
  ,{
    id: 'amphetamine-mixed-salts',
    effects: { weight: 'minimal', sedation: 'minimal', sexual: 'low', antichol: 'none', qt: 'minimal', review: true }, // tiers (drafted 2026-10-01 from FDA labeling adverse reactions / W&P; pending clinician review — not yet in psychopharm-tolerability.csv)
    development: { discoveryYear: 1994, fdaApprovalYear: 1996, originator: "Richwood / Shire (Takeda)" },
    dosing: { start: "5–10 mg/day", target: "20–30 mg/day", max: "40 mg/day (IR); 30 mg/day (XR, per label)", formulations: "IR once daily–BID (Adderall) • XR once daily (Adderall XR) • extended (Mydayis)", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=amphetamine+aspartate" } },
    name: 'Amphetamine Mixed Salts',
    brandName: 'Adderall',
    class: 'Stimulant',
    category: 'Stimulant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: 'd-amphetamine: 10–12 hr; l-amphetamine: 11–14 hr', metabolites: 'None significant' },
    tmax: 3,
    p450: {
      substrate: ['CYP2D6'],
      inhibits: { 'CYP2D6': 'weak' },
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'Use with caution', severe: 'Reduce dose; alkaline urine increases half-life', notes: 'No specific dose adjustment; acidified urine increases renal excretion. Use with caution in severe impairment.' },
    hepaticImpairment: { modified: false, notes: 'No specific adjustment; primarily renally excreted. Use with caution.' },
    geriatricDosing: { modified: false, notes: 'Use with extreme caution; significant cardiovascular risks in elderly. Not well studied.' },
    qtInterval: false,
    proteinBinding: 25,
    receptorKi: {
      SERT: 10000, NET: 70, DAT: 600, '5HT1A': 10000, '5HT2A': 10000, '5HT2C': 10000,
      D2: 10000, D3: 10000, H1: 10000, alpha1: 10000, alpha2: 10000, M1: 10000
    },
    mechanism: 'Monoamine releasing agent: reverses DAT/NET/SERT to release dopamine, norepinephrine, serotonin into synapse; also displaces vesicular storage via VMAT2; weak MAO inhibitor; approved for ADHD and narcolepsy; urine pH affects clearance (acidic → faster elimination)',
    receptorNote: 'Amphetamine is a transporter substrate and releaser (reverses DAT/NET via VMAT2/TAAR1), so binding Ki understates its effect on dopamine and norepinephrine release.',
    indications: [
      { use: 'ADHD', year: 1996 },
      { use: 'Narcolepsy', year: 1996 },
    ]
  }
  ,{
    id: 'dextroamphetamine',
    effects: { weight: 'minimal', sedation: 'minimal', sexual: 'low', antichol: 'none', qt: 'minimal', review: true }, // tiers (drafted 2026-10-01 from FDA labeling adverse reactions / W&P; pending clinician review — not yet in psychopharm-tolerability.csv)
    development: { discoveryYear: 1929, fdaApprovalYear: 1937, originator: "Smith Kline & French" },
    dosing: { start: "5 mg daily–BID", target: "10–30 mg/day", max: "40 mg/day", formulations: "IR tablet daily–BID • ER spansule once daily (Dexedrine Spansule) • transdermal patch (Xelstrym)", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=dextroamphetamine" } },
    name: 'Dextroamphetamine',
    brandName: 'Dexedrine',
    class: 'Stimulant',
    category: 'Stimulant',
    activeEnantiomer: { has: true, name: 'd-amphetamine (active enantiomer)' },
    halfLife: { drug: '10–12 hr', metabolites: 'None significant' },
    tmax: 3,
    p450: {
      substrate: ['CYP2D6'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No specific dose adjustment; urinary pH affects excretion — alkaline urine increases reabsorption. Use with caution.' },
    hepaticImpairment: { modified: false, notes: 'No specific adjustment; use with caution.' },
    geriatricDosing: { modified: false, notes: 'Use with extreme caution; cardiovascular risk. Not well studied in elderly.' },
    qtInterval: false,
    proteinBinding: 20,
    receptorKi: {
      SERT: 10000, NET: 70, DAT: 600, '5HT1A': 10000, '5HT2A': 10000, '5HT2C': 10000,
      D2: 10000, D3: 10000, H1: 10000, alpha1: 10000, alpha2: 10000, M1: 10000
    },
    receptorNote: 'Amphetamine is a transporter substrate and releaser (reverses DAT/NET via VMAT2/TAAR1), so binding Ki understates its effect on dopamine and norepinephrine release.',
    indications: [
      { use: 'ADHD', year: 1937 },
      { use: 'Narcolepsy', year: 1937 },
    ]
  }
  ,{
    id: 'lisdexamfetamine',
    effects: { weight: 'minimal', sedation: 'minimal', sexual: 'low', antichol: 'none', qt: 'minimal', review: true }, // tiers (drafted 2026-10-01 from FDA labeling adverse reactions / W&P; pending clinician review — not yet in psychopharm-tolerability.csv)
    development: { discoveryYear: 2003, fdaApprovalYear: 2007, originator: "New River / Shire (Takeda)" },
    dosing: { start: "30 mg qAM", target: "30–70 mg/day", max: "70 mg/day", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=lisdexamfetamine" } },
    name: 'Lisdexamfetamine',
    brandName: 'Vyvanse',
    class: 'Stimulant',
    category: 'Stimulant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: 'Parent: <1 hr; d-amphetamine produced: 10–12 hr', metabolites: 'd-Amphetamine: 10–12 hr' },
    tmax: 3.5,
    pkCurve: { hl: 11, tmax: 3.5, note: 'd-amphetamine (active)' },
    p450: {
      substrate: ['CYP2D6'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'No adjustment', severe: 'GFR 15–29: max 50 mg/day; GFR <15/ESRD: max 30 mg/day', notes: 'Severe renal impairment (GFR 15–29): max 50 mg/day; end-stage renal disease (GFR <15): max 30 mg/day.' },
    hepaticImpairment: { modified: false, notes: 'No dose adjustment required; hydrolyzed to d-amphetamine in blood.' },
    geriatricDosing: { modified: false, notes: 'Use with extreme caution; cardiovascular monitoring essential. Not studied in elderly.' },
    qtInterval: false,
    proteinBinding: null,
    proteinBindingNote: 'Not reported in the label (prodrug); d-amphetamine is ~15–40% bound',
    receptorKi: {
      SERT: 10000, NET: 70, DAT: 600, '5HT1A': 10000, '5HT2A': 10000, '5HT2C': 10000,
      D2: 10000, D3: 10000, H1: 10000, alpha1: 10000, alpha2: 10000, M1: 10000
    },
    mechanism: 'Prodrug of d-amphetamine; cleaved in RBCs by peptidases; abuse-deterrent formulation (oral route-specific activation); same pharmacology as dextroamphetamine once cleaved; also FDA-approved for binge eating disorder',
    receptorNote: 'Amphetamine is a transporter substrate and releaser (reverses DAT/NET via VMAT2/TAAR1), so binding Ki understates its effect on dopamine and norepinephrine release.',
    indications: [
      { use: 'ADHD', year: 2007 },
      { use: 'Moderate-to-Severe Binge Eating Disorder', year: 2015 },
    ]
  }
  ,{
    id: 'modafinil',
    effects: { weight: 'minimal', sedation: 'minimal', sexual: 'minimal', antichol: 'none', qt: 'minimal', review: true }, // tiers (drafted 2026-10-01 from FDA labeling adverse reactions / W&P; pending clinician review — not yet in psychopharm-tolerability.csv)
    development: { discoveryYear: 1974, fdaApprovalYear: 1998, originator: "Lafon / Cephalon (Teva)" },
    dosing: { start: "200 mg qAM", target: "200 mg/day", max: "200 mg/day (up to 400 mg tolerated; no consistent added benefit)", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=modafinil" } },
    name: 'Modafinil',
    brandName: 'Provigil',
    class: 'Wake-Promoting Agent',
    category: 'Stimulant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '12–15 hr', metabolites: 'Modafinil acid/sulfone (inactive)' },
    tmax: 2.5,
    p450: {
      substrate: ['CYP3A4'],
      inhibits: { 'CYP2C19': 'moderate' },
      induces: { 'CYP3A4': 'weak', 'CYP1A2': 'weak' }
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No dose adjustment required in renal impairment; primarily hepatically metabolized.' },
    hepaticImpairment: { modified: true, notes: 'Reduce dose by 50% in severe' },
    geriatricDosing: { modified: false, notes: 'Consider lower dose' },
    qtInterval: false,
    proteinBinding: 60,
    receptorKi: { SERT: 10000, NET: 10000, DAT: 4600, '5HT1A': 10000, '5HT2A': 10000, '5HT2C': 10000, D2: 10000, H1: 10000, alpha1: 10000, alpha2: 10000, M1: 10000 },
    mechanism: 'Weak DAT inhibitor; promotes wakefulness via increased histamine in hypothalamus, reduced GABA, increased norepinephrine and orexin signaling; exact mechanism not fully characterized; Schedule IV; FDA-approved for narcolepsy, shift work sleep disorder, OSA-related sleepiness',
    indications: [
      { use: 'Narcolepsy', year: 1998 },
      { use: 'Excessive Sleepiness with OSA', year: 2003 },
      { use: 'Shift Work Sleep Disorder', year: 2004 },
    ]
  }
  ,{
    id: 'armodafinil',
    effects: { weight: 'minimal', sedation: 'minimal', sexual: 'minimal', antichol: 'none', qt: 'minimal', review: true }, // tiers (drafted 2026-10-01 from FDA labeling adverse reactions / W&P; pending clinician review — not yet in psychopharm-tolerability.csv)
    development: { discoveryYear: 1994, fdaApprovalYear: 2007, originator: "Cephalon (Teva)" },
    dosing: { start: "150 mg qAM", target: "150–250 mg/day", max: "250 mg/day", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=armodafinil" } },
    name: 'Armodafinil',
    brandName: 'Nuvigil',
    class: 'Wake-Promoting Agent',
    category: 'Stimulant',
    activeEnantiomer: { has: true, name: 'R-enantiomer of modafinil' },
    halfLife: { drug: '13–15 hr', metabolites: 'None significant' },
    tmax: 2,
    p450: {
      substrate: ['CYP3A4'],
      inhibits: { 'CYP2C19': 'moderate' },
      induces: { 'CYP3A4': 'weak' }
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No dose adjustment required; primarily hepatically metabolized.' },
    hepaticImpairment: { modified: true, notes: 'Reduce dose by 50% in severe' },
    geriatricDosing: { modified: false, notes: 'Consider lower doses; limited geriatric-specific data.' },
    qtInterval: false,
    proteinBinding: 60,
    receptorKi: { SERT: 10000, NET: 10000, DAT: 4600, '5HT1A': 10000, '5HT2A': 10000, '5HT2C': 10000, D2: 10000, H1: 10000, alpha1: 10000, alpha2: 10000, M1: 10000 },
    mechanism: 'R-enantiomer of modafinil; longer duration of action; same mechanism as modafinil (DAT inhibition, histaminergic wakefulness promotion); FDA-approved for narcolepsy, shift work disorder, OSA; Schedule IV',
    indications: [
      { use: 'Narcolepsy', year: 2007 },
      { use: 'Excessive Sleepiness with OSA', year: 2007 },
      { use: 'Shift Work Sleep Disorder', year: 2007 },
    ]
  }
  ,{
    id: 'solriamfetol',
    effects: { weight: 'minimal', sedation: 'minimal', sexual: 'minimal', antichol: 'none', qt: 'minimal', review: true }, // tiers (drafted 2026-10-01 from FDA labeling adverse reactions / W&P; pending clinician review — not yet in psychopharm-tolerability.csv)
    development: { discoveryYear: 2005, fdaApprovalYear: 2019, originator: "Aerial / Jazz Pharmaceuticals" },
    dosing: { start: "37.5 mg qAM (OSA) or 75 mg qAM (narcolepsy)", target: "75–150 mg/day", max: "150 mg/day", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=solriamfetol" } },
    name: 'Solriamfetol',
    brandName: 'Sunosi',
    class: 'Wake-Promoting Agent',
    category: 'Stimulant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '7 hr', metabolites: 'None active' },
    tmax: 2,
    p450: {
      substrate: [],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'eGFR 30–59: start 37.5 mg; may increase to max 75 mg after ≥7 days', severe: 'eGFR 15–29: 37.5 mg/day (max 37.5 mg); eGFR <15/ESRD: not recommended', notes: 'Primarily renally excreted unchanged. Moderate (eGFR 30–59): start 37.5 mg, max 75 mg/day after at least 7 days. Severe (eGFR 15–29): start and max 37.5 mg/day. ESRD (eGFR <15): not recommended.' },
    hepaticImpairment: { modified: false, notes: 'No dose adjustment required; not significantly hepatically metabolized.' },
    geriatricDosing: { modified: false, notes: 'Use with caution; monitor cardiovascular effects. Limited geriatric data.' },
    qtInterval: false,
    proteinBinding: 13,
    receptorKi: {
      SERT: 10000, NET: 3700, DAT: 14200, '5HT1A': 10000, '5HT2A': 10000, '5HT2C': 10000,
      D2: 10000, D3: 10000, H1: 10000, alpha1: 10000, alpha2: 10000, M1: 10000
    },
    indications: [
      { use: 'Excessive Daytime Sleepiness with Narcolepsy', year: 2019 },
      { use: 'Excessive Daytime Sleepiness with OSA', year: 2019 },
    ]
  }

  // ── Anticholinergics / Antihistamines ───────────────────────────────────
  ,{
    id: 'hydroxyzine',
    effects: { weight: 'low', sedation: 'high', sexual: 'minimal', antichol: 'moderate', qt: 'low', review: true }, // tiers (drafted 2026-10-01 from FDA labeling adverse reactions / W&P; pending clinician review — not yet in psychopharm-tolerability.csv)
    development: { discoveryYear: 1956, fdaApprovalYear: 1956, originator: "Union Chimique Belge / Pfizer" },
    dosing: { start: "25–50 mg QID PRN", target: "50–100 mg/day", max: "400 mg/day", formulations: "HCl tab/syrup & IM (Atarax) • Pamoate cap/suspension (Vistaril)", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=hydroxyzine" } },
    name: 'Hydroxyzine',
    brandName: 'Vistaril',
    class: 'Antihistamine',
    category: 'Anxiolytic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '20–25 hr', metabolites: 'Cetirizine: 8–10 hr' },
    tmax: 2,
    p450: {
      substrate: ['CYP3A4'],
      inhibits: { 'CYP2D6': 'weak' },
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'Reduce dose', severe: 'Reduce dose; monitor', notes: 'No specific dose adjustment; use with caution and consider dose reduction in severe impairment.' },
    hepaticImpairment: { modified: true, notes: 'Reduce dose; extend interval' },
    geriatricDosing: { modified: true, notes: 'Use with caution (Beers List); anticholinergic burden' },
    qtInterval: true,
    proteinBinding: 93,
    receptorKi: { SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 10000, '5HT2A': 10000, '5HT2C': 10000, D2: 10000, H1: 0.6, alpha1: 7, alpha2: 10000, M1: 200 },
    indications: [
      { use: 'Anxiety and Tension', year: 1956 },
      { use: 'Pruritus (itching)', year: 1956 },
      { use: 'Preoperative Sedation', year: 1956 },
    ]
  }
  ,{
    id: 'diphenhydramine',
    effects: { weight: 'low', sedation: 'high', sexual: 'minimal', antichol: 'high', qt: 'low', review: true }, // tiers (drafted 2026-10-01 from FDA labeling adverse reactions / W&P; pending clinician review — not yet in psychopharm-tolerability.csv)
    development: { discoveryYear: 1943, fdaApprovalYear: 1946, originator: "Parke-Davis" },
    dosing: { start: "25–50 mg qHS", target: "25–50 mg qHS", max: "50 mg/day (hypnotic)", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=diphenhydramine" } },
    name: 'Diphenhydramine',
    brandName: 'Benadryl',
    class: 'Antihistamine',
    category: 'Other',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '4–8 hr', metabolites: 'None active' },
    tmax: 2,
    p450: {
      substrate: ['CYP2D6', 'CYP3A4'],
      inhibits: { 'CYP2D6': 'moderate' },
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No specific dose adjustment; use with caution. Urinary retention risk increased.' },
    hepaticImpairment: { modified: false, notes: 'Use with caution in hepatic impairment; hepatically metabolized.' },
    geriatricDosing: { modified: true, notes: 'Avoid (Beers List); very high anticholinergic burden; confusion/delirium risk' },
    qtInterval: false,
    proteinBinding: 82,
    receptorKi: {
      SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 10000, '5HT2A': 10000, '5HT2C': 10000,
      D2: 10000, H1: 15, alpha1: 10000, alpha2: 10000, M1: 80
    },
    indications: [
      { use: 'Allergic Conditions / Urticaria', year: 1946 },
      { use: 'Motion Sickness', year: 1946 },
      { use: 'Insomnia (OTC)', year: 1982 },
    ]
  }
  ,{
    id: 'trihexyphenidyl',
    effects: { weight: 'none', sedation: 'low', sexual: 'minimal', antichol: 'high', qt: 'minimal', review: true }, // tiers (drafted 2026-10-01 from FDA labeling adverse reactions / W&P; pending clinician review — not yet in psychopharm-tolerability.csv)
    development: { discoveryYear: 1949, fdaApprovalYear: 1949, originator: "American Cyanamid (Lederle)" },
    dosing: { start: "1 mg/day", target: "6–10 mg/day", max: "15 mg/day", citation: { label: "DailyMed (FDA label)", url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=trihexyphenidyl" } },
    name: 'Trihexyphenidyl',
    brandName: 'Artane',
    class: 'Anticholinergic',
    category: 'Other',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '3–4 hr', metabolites: 'None significant' },
    tmax: 1.5,
    p450: {
      substrate: [],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No specific dose adjustment; use with caution given anticholinergic effects.' },
    hepaticImpairment: { modified: false, notes: 'No specific dose adjustment; use with caution.' },
    geriatricDosing: { modified: true, notes: 'Avoid (Beers List); high anticholinergic toxicity risk; confusion/urinary retention' },
    qtInterval: false,
    proteinBinding: 25,
    receptorKi: { SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 10000, '5HT2A': 10000, '5HT2C': 10000, D2: 10000, D3: 10000, H1: 10000, alpha1: 10000, alpha2: 10000, M1: 2 },
    indications: [
      { use: 'Parkinsonism (all forms)', year: 1952 },
      { use: 'Drug-Induced Extrapyramidal Symptoms', year: 1952 },
    ]
  },
  // ── Added 2026-10-01 (round 4): label-sourced; effects tiers pending clinician review ──
  {
    id: 'xanomeline-trospium',
    effects: { weight: 'minimal', sedation: 'low', sexual: 'minimal', antichol: 'moderate', qt: 'minimal', review: true },
    development: { discoveryYear: null, fdaApprovalYear: 2024, originator: 'Karuna Therapeutics (Bristol Myers Squibb)' },
    dosing: {
      start: '50 mg/20 mg BID ×≥2 days',
      target: '100 mg/20 mg BID',
      max: '125 mg/30 mg BID',
      formulations: 'Capsules BID on an empty stomach (≥1 h before or ≥2 h after a meal); do not open',
      citation: { label: 'DailyMed (FDA label)', url: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=cobenfy' }
    },
    name: 'Xanomeline/Trospium',
    brandName: 'Cobenfy',
    class: 'Muscarinic Agonist',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: 'Xanomeline ~5 hr; trospium ~6 hr', metabolites: 'None clinically significant' },
    tmax: 2,
    p450: {
      substrate: ['CYP2D6'],
      inhibits: {},
      induces: {}
    },
    renalImpairment: {
      modified: true,
      moderate: 'Not recommended (eGFR <60)',
      severe: 'Not recommended',
      notes: 'Trospium is renally cleared; not recommended with eGFR <60 (anticholinergic adverse reactions). No adjustment for mild impairment.'
    },
    hepaticImpairment: { modified: true, notes: 'Contraindicated in moderate/severe impairment; not recommended in mild impairment' },
    geriatricDosing: { modified: true, notes: 'Start 50 mg/20 mg BID, consider slower titration; max 100 mg/20 mg BID' },
    qtInterval: false,
    proteinBinding: 95,
    receptorKi: null,
    receptorNote: 'Xanomeline is a muscarinic AGONIST (M1–M5 Ki 10, 12, 17, 7, 22 nM; preferential M1/M4 agonist activity), so its binding is not charted as anticholinergic. Trospium is a peripherally restricted muscarinic antagonist (no label Ki).',
    indications: [
      { use: 'Schizophrenia', year: 2024, age: 'Adults' },
    ],
    mechanism: 'M1/M4 muscarinic agonist (xanomeline) combined with a peripherally restricted muscarinic antagonist (trospium); no direct D2 blockade.'
  },
  {
    id: 'olanzapine-samidorphan',
    effects: { weight: 'moderate', sedation: 'high', sexual: 'low', antichol: 'moderate', qt: 'low', review: true },
    development: { discoveryYear: null, fdaApprovalYear: 2021, originator: 'Alkermes' },
    dosing: {
      start: '5/10 or 10/10 mg daily (schizophrenia); 10/10 or 15/10 mg (bipolar)',
      target: '10/10–20/10 mg daily',
      max: '20 mg/10 mg daily',
      formulations: 'Tablets once daily; do not split or crush',
      citation: { label: 'DailyMed (FDA label)', url: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=lybalvi' }
    },
    name: 'Olanzapine/Samidorphan',
    brandName: 'Lybalvi',
    class: 'SGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: 'Olanzapine 35–52 hr; samidorphan 7–11 hr', metabolites: 'N-desmethylolanzapine: weak' },
    tmax: 6,
    p450: {
      substrate: ['CYP1A2', 'CYP2D6', 'CYP3A4'],
      inhibits: { CYP1A2: 'weak' },
      induces: {}
    },
    renalImpairment: {
      modified: true,
      moderate: null,
      severe: 'Not recommended in end-stage renal disease (eGFR <15)',
      notes: 'No adjustment for mild to severe impairment; not recommended in ESRD.'
    },
    hepaticImpairment: { modified: false, notes: 'No dose adjustment; use caution and monitor LFTs' },
    geriatricDosing: { modified: true, notes: 'Consider 5 mg/10 mg start; increased mortality in dementia' },
    qtInterval: false,
    proteinBinding: 93,
    receptorKi: {
      SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 4400, '5HT2A': 4, '5HT2C': 11,
      D1: 32, D2: 11, D3: 49, H1: 7, alpha1: 19, alpha2: 230,
      M1: 73
    },
    receptorNote: 'Olanzapine values shown. Samidorphan binds opioid receptors: mu 0.052 nM (antagonist), kappa 0.23 nM, delta 2.7 nM (partial agonist) — label §12.2. Olanzapine M1–M5 Ki 73, 96, 132, 32, 48 nM.',
    indications: [
      { use: 'Schizophrenia', year: 2021, age: 'Adults' },
      {
  use: 'Bipolar Mania',
  year: 2021,
  dx: 'Bipolar I',
  phase: 'Acute manic or mixed episodes',
  line: 'Monotherapy or adjunct to lithium/valproate',
  age: 'Adults'
},
      { use: 'Bipolar Maintenance', year: 2021, dx: 'Bipolar I', phase: 'Maintenance', line: 'Monotherapy', age: 'Adults' },
    ],
    mechanism: 'Olanzapine (D2/5-HT2A antagonist) plus samidorphan (opioid receptor antagonist) to attenuate olanzapine-associated weight gain.'
  },
  {
    id: 'lemborexant',
    effects: { weight: 'minimal', sedation: 'moderate', sexual: 'minimal', antichol: 'minimal', qt: 'minimal', review: true },
    development: { discoveryYear: null, fdaApprovalYear: 2019, originator: 'Eisai' },
    dosing: {
      start: '5 mg qHS',
      target: '5–10 mg qHS',
      max: '10 mg/night',
      formulations: 'Tablets immediately before bed, with ≥7 h before planned waking',
      citation: { label: 'DailyMed (FDA label)', url: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=dayvigo' }
    },
    name: 'Lemborexant',
    brandName: 'Dayvigo',
    class: 'Orexin Antagonist',
    category: 'Sleep',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '17–19 hr (effective)', metabolites: 'M10 (minor active)' },
    tmax: 2,
    p450: {
      substrate: ['CYP3A4'],
      inhibits: {},
      induces: { CYP2B6: 'weak' }
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No adjustment; severe impairment may increase somnolence.' },
    hepaticImpairment: { modified: true, notes: 'Moderate: max 5 mg; severe: not recommended' },
    geriatricDosing: { modified: false, notes: 'No adjustment; caution for falls with nighttime awakening' },
    qtInterval: false,
    proteinBinding: 94,
    receptorKi: {
      OX1R: 6.1, OX2R: 2.6
    },
    receptorNote: 'OX1R/OX2R values are IC50s from the Dayvigo label (Ki not reported). Active metabolite M10: OX1R 4.2 nM, OX2R 2.9 nM.',
    indications: [
      { use: 'Insomnia (sleep onset and maintenance)', year: 2019, age: 'Adults' },
    ],
    mechanism: 'Dual orexin receptor (OX1R/OX2R) antagonist.'
  },
  {
    id: 'daridorexant',
    effects: { weight: 'minimal', sedation: 'moderate', sexual: 'minimal', antichol: 'minimal', qt: 'minimal', review: true },
    development: { discoveryYear: null, fdaApprovalYear: 2022, originator: 'Idorsia' },
    dosing: {
      start: '25–50 mg qHS',
      target: '25–50 mg qHS',
      max: '50 mg/night (25 mg with moderate CYP3A4 inhibitors)',
      formulations: 'Tablets within 30 min of bedtime, with ≥7 h before planned waking',
      citation: { label: 'DailyMed (FDA label)', url: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=quviviq' }
    },
    name: 'Daridorexant',
    brandName: 'Quviviq',
    class: 'Orexin Antagonist',
    category: 'Sleep',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '~8 hr', metabolites: 'None clinically significant' },
    tmax: 1.5,
    p450: {
      substrate: ['CYP3A4'],
      inhibits: {},
      induces: {}
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No dose adjustment, including severe impairment.' },
    hepaticImpairment: { modified: true, notes: 'Moderate: max 25 mg; severe: not recommended' },
    geriatricDosing: { modified: false, notes: 'No adjustment; caution for falls with nighttime awakening' },
    qtInterval: false,
    proteinBinding: 99.7,
    receptorKi: {
      OX1R: 0.47, OX2R: 0.93
    },
    indications: [
      { use: 'Insomnia (sleep onset and maintenance)', year: 2022, age: 'Adults' },
    ],
    mechanism: 'Dual orexin receptor (OX1R/OX2R) antagonist with a shorter half-life than lemborexant or suvorexant.'
  },
  {
    id: 'atomoxetine',
    effects: { weight: 'minimal', sedation: 'low', sexual: 'low', antichol: 'minimal', qt: 'minimal', review: true },
    development: { discoveryYear: null, fdaApprovalYear: 2002, originator: 'Eli Lilly' },
    dosing: {
      start: '0.5 mg/kg/day (<70 kg); 40 mg/day (≥70 kg & adults)',
      target: '1.2 mg/kg/day; 80 mg/day',
      max: '1.4 mg/kg/day or 100 mg/day, whichever is less',
      formulations: 'Capsules once daily (AM) or divided BID; do not open',
      citation: { label: 'DailyMed (FDA label)', url: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=strattera' }
    },
    name: 'Atomoxetine',
    brandName: 'Strattera',
    class: 'NRI',
    category: 'ADHD (non-stimulant)',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '5.2 hr (extensive metabolizers); 21.6 hr (CYP2D6 poor metabolizers)', metabolites: '4-hydroxyatomoxetine (active, rapidly glucuronidated)' },
    tmax: 1,
    p450: {
      substrate: ['CYP2D6'],
      inhibits: {},
      induces: {}
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No dose adjustment.' },
    hepaticImpairment: { modified: true, notes: 'Moderate: 50% of usual dose; severe: 25%' },
    geriatricDosing: { modified: false, notes: 'Limited data; monitor BP and heart rate' },
    qtInterval: false,
    proteinBinding: 98,
    receptorKi: null,
    receptorNote: 'Selective NET inhibitor; binding values not yet added (literature Ki pending verification).',
    indications: [
      { use: 'ADHD', year: 2002, age: 'Adults & ≥6 yr' },
    ],
    mechanism: 'Selective norepinephrine reuptake inhibitor (also raises prefrontal dopamine).'
  },
  {
    id: 'viloxazine',
    effects: { weight: 'minimal', sedation: 'moderate', sexual: 'minimal', antichol: 'minimal', qt: 'minimal', review: true },
    development: { discoveryYear: null, fdaApprovalYear: 2021, originator: 'Supernus Pharmaceuticals (ER formulation)' },
    dosing: {
      start: '100 mg (6–11 yr); 200 mg (12–17 yr & adults)',
      target: '200–400 mg/day',
      max: '400 mg/day (children); 600 mg/day (adults)',
      formulations: 'ER capsules once daily; may be sprinkled on applesauce',
      citation: { label: 'DailyMed (FDA label)', url: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=qelbree' }
    },
    name: 'Viloxazine ER',
    brandName: 'Qelbree',
    class: 'NRI',
    category: 'ADHD (non-stimulant)',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '~7 hr', metabolites: '5-hydroxyviloxazine glucuronide (inactive)' },
    tmax: 5,
    p450: {
      substrate: ['CYP2D6'],
      inhibits: { CYP1A2: 'strong', CYP2D6: 'weak', CYP3A4: 'weak' },
      induces: {}
    },
    renalImpairment: {
      modified: true,
      moderate: null,
      severe: 'eGFR <30: start 100 mg; titrate 50–100 mg weekly; max 200 mg/day',
      notes: 'Renally excreted; reduce dose in severe impairment.'
    },
    hepaticImpairment: { modified: false, notes: 'Not studied in hepatic impairment; use caution' },
    geriatricDosing: { modified: false, notes: 'Not studied in older adults' },
    qtInterval: false,
    proteinBinding: 79,
    receptorKi: null,
    receptorNote: 'NET inhibitor with 5-HT2B antagonist and 5-HT2C agonist activity; binding values not yet added (pending verification).',
    indications: [
      { use: 'ADHD', year: 2021, age: 'Adults & ≥6 yr', line: 'Children 6–17 (2021); adults (2022)' },
    ],
    mechanism: 'Selective norepinephrine reuptake inhibitor with serotonergic (5-HT2B antagonist, 5-HT2C agonist) activity.'
  },
  {
    id: 'valbenazine',
    effects: { weight: 'minimal', sedation: 'moderate', sexual: 'minimal', antichol: 'low', qt: 'low', review: true },
    development: { discoveryYear: null, fdaApprovalYear: 2017, originator: 'Neurocrine Biosciences' },
    dosing: {
      start: '40 mg daily',
      target: '80 mg daily (40–60 mg acceptable)',
      max: '80 mg/day (40 mg with strong CYP3A4 or CYP2D6 inhibitors, CYP2D6 poor metabolizers, or moderate/severe hepatic impairment)',
      formulations: 'Capsules or sprinkle capsules once daily',
      citation: { label: 'DailyMed (FDA label)', url: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=ingrezza' }
    },
    name: 'Valbenazine',
    brandName: 'Ingrezza',
    class: 'VMAT2 Inhibitor',
    category: 'Movement Disorder (VMAT2)',
    activeEnantiomer: { has: true, name: '[+]-α-dihydrotetrabenazine ([+]-α-HTBZ, active metabolite)' },
    halfLife: { drug: '15–22 hr', metabolites: '[+]-α-HTBZ (active): 15–22 hr' },
    tmax: 1,
    p450: {
      substrate: ['CYP3A4', 'CYP2D6'],
      inhibits: {},
      induces: {}
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No dose adjustment.' },
    hepaticImpairment: { modified: true, notes: 'Moderate/severe: 40 mg daily' },
    geriatricDosing: { modified: false, notes: 'No specific adjustment' },
    qtInterval: true,
    proteinBinding: 99,
    receptorKi: null,
    receptorNote: 'VMAT2 inhibitor: valbenazine Ki ~150 nM; active metabolite [+]-α-HTBZ Ki ~3 nM. No appreciable binding (Ki >5,000 nM) at dopamine (incl. D2), serotonin, adrenergic, histamine, or muscarinic receptors (label §12.2).',
    indications: [
      { use: 'Tardive Dyskinesia', year: 2017, age: 'Adults' },
      { use: 'Huntington\'s Disease Chorea', year: 2023, age: 'Adults' },
    ],
    mechanism: 'Selective, reversible VMAT2 inhibitor; reduces presynaptic dopamine packaging and release.'
  },
  {
    id: 'deutetrabenazine',
    effects: { weight: 'minimal', sedation: 'moderate', sexual: 'minimal', antichol: 'minimal', qt: 'low', review: true },
    development: { discoveryYear: null, fdaApprovalYear: 2017, originator: 'Auspex / Teva' },
    dosing: {
      start: '6 mg BID (IR) or 12 mg once daily (XR)',
      target: 'Titrate by 6 mg/day weekly to effect',
      max: '48 mg/day (36 mg/day with strong CYP2D6 inhibitors or poor metabolizers)',
      formulations: 'IR tablets BID with food • XR tablets once daily',
      citation: { label: 'DailyMed (FDA label)', url: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=austedo' }
    },
    name: 'Deutetrabenazine',
    brandName: 'Austedo',
    class: 'VMAT2 Inhibitor',
    category: 'Movement Disorder (VMAT2)',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: 'Total (α+β)-HTBZ 9–10 hr', metabolites: 'α-HTBZ ~12 hr; β-HTBZ ~7.5 hr (active)' },
    tmax: 3,
    p450: {
      substrate: ['CYP2D6'],
      inhibits: {},
      induces: {}
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'Not studied; use caution.' },
    hepaticImpairment: { modified: true, notes: 'Contraindicated in hepatic impairment' },
    geriatricDosing: { modified: false, notes: 'No specific adjustment' },
    qtInterval: true,
    proteinBinding: 82,
    receptorKi: null,
    receptorNote: 'Reversible VMAT2 inhibitor via active metabolites (α- and β-HTBZ); not charted because VMAT2 is not one of the displayed targets.',
    indications: [
      { use: 'Huntington\'s Disease Chorea', year: 2017, age: 'Adults' },
      { use: 'Tardive Dyskinesia', year: 2017, age: 'Adults' },
    ],
    mechanism: 'Deuterated tetrabenazine: reversible VMAT2 inhibitor with longer-acting, less variable active metabolites.'
  },
  {
    id: 'naltrexone',
    effects: { weight: 'minimal', sedation: 'low', sexual: 'minimal', antichol: 'minimal', qt: 'minimal', review: true },
    development: { discoveryYear: 1963, fdaApprovalYear: 1984, originator: 'Endo Laboratories (DuPont); Vivitrol: Alkermes' },
    dosing: {
      start: '25–50 mg PO daily after an opioid-free period',
      target: '50 mg/day PO or 380 mg IM every 4 weeks',
      max: '50 mg/day PO; 380 mg IM q4wk',
      formulations: 'Oral tablets • Vivitrol 380 mg deep IM gluteal every 4 weeks',
      citation: { label: 'DailyMed (FDA label)', url: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=naltrexone' }
    },
    name: 'Naltrexone',
    brandName: 'Revia / Vivitrol',
    class: 'Opioid Antagonist',
    category: 'Substance Use',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '4 hr (oral); 5–10 days (Vivitrol)', metabolites: '6-β-naltrexol (active): ~13 hr' },
    tmax: 1,
    pkCurve: { hl: 4, tmax: 1, note: 'oral; Vivitrol not shown' },
    p450: {
      substrate: [],
      inhibits: {},
      induces: {}
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'Use caution; metabolites are renally excreted.' },
    hepaticImpairment: { modified: true, notes: 'Use caution; monitor LFTs (hepatotoxicity reported, mostly at high doses)' },
    geriatricDosing: { modified: false, notes: 'No specific adjustment' },
    qtInterval: false,
    proteinBinding: 21,
    receptorKi: null,
    receptorNote: 'Opioid receptor antagonist (mu > kappa > delta); not charted because opioid receptors are not among the displayed targets.',
    indications: [
      { use: 'Alcohol Use Disorder', year: 1994, line: 'Oral (1994); Vivitrol IM (2006)', age: 'Adults' },
      { use: 'Opioid Use Disorder (relapse prevention after detoxification)', year: 1984, line: 'Oral (1984); Vivitrol IM (2010)', age: 'Adults' },
    ],
    mechanism: 'Competitive mu-opioid receptor antagonist (also kappa/delta).'
  },
  {
    id: 'buprenorphine',
    effects: { weight: 'minimal', sedation: 'moderate', sexual: 'low', antichol: 'minimal', qt: 'low', review: true },
    development: { discoveryYear: 1966, fdaApprovalYear: 2002, originator: 'Reckitt & Colman (Indivior)' },
    dosing: {
      start: '2–4 mg SL (with naloxone 4:1) once objective withdrawal is present; up to 8 mg day 1',
      target: '16 mg/4 mg daily',
      max: '24 mg/6 mg daily (SL); Sublocade 300 mg ×2, then 100 mg monthly',
      formulations: 'SL film/tablet (± naloxone) • Buccal film • Sublocade monthly SC • Brixadi weekly/monthly SC',
      citation: { label: 'DailyMed (FDA label)', url: 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=buprenorphine+naloxone' }
    },
    name: 'Buprenorphine',
    brandName: 'Suboxone / Sublocade',
    class: 'Partial Opioid Agonist',
    category: 'Substance Use',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '24–42 hr (SL)', metabolites: 'Norbuprenorphine (active)' },
    tmax: 1,
    p450: {
      substrate: ['CYP3A4'],
      inhibits: {},
      induces: {}
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No dose adjustment.' },
    hepaticImpairment: {
      modified: true,
      notes: 'Buprenorphine/naloxone not recommended in severe impairment and may not be appropriate in moderate impairment (naloxone exposure rises); consider mono-product'
    },
    geriatricDosing: { modified: true, notes: 'Monitor for sedation and respiratory depression' },
    qtInterval: false,
    proteinBinding: 96,
    receptorKi: null,
    receptorNote: 'High-affinity partial mu-opioid agonist and kappa antagonist; not charted because opioid receptors are not among the displayed targets.',
    indications: [
      { use: 'Opioid Use Disorder', year: 2002, line: 'SL ± naloxone (2002); Sublocade (2017); Brixadi (2023)', age: 'Adults' },
    ],
    mechanism: 'High-affinity partial mu-opioid agonist and kappa antagonist; ceiling effect on respiratory depression.'
  }
];

/* ── Receptor → Circuit mapping ─────────────────────────────────────────── */
const RECEPTOR_CIRCUIT_MAP = {
  SERT:    ['Serotonergic (Raphe Nuclei)', 'Limbic/Mood (Amygdala–PFC)', 'Papez Circuit'],
  NET:     ['Noradrenergic (LC → PFC)', 'DLPFC Executive Loop', 'Anterior Cingulate Loop'],
  DAT:     ['Mesolimbic DA (Reward)', 'Mesocortical DA (Cognition)', 'Motor BG Loop'],
  D1:      ['DLPFC Executive Loop', 'Mesocortical DA (Cognition)'],
  D2:      ['Mesolimbic DA (Reward)', 'Motor BG Loop', 'Mesocortical DA (Cognition)'],
  D3:      ['Mesolimbic DA (Reward)'],
  '5HT1A': ['Limbic/Mood (Amygdala–PFC)', 'Papez Circuit', 'Serotonergic (Raphe Nuclei)'],
  '5HT2A': ['DLPFC Executive Loop', 'Prefrontal Cortico–BG Loop'],
  '5HT2C': ['Mesolimbic DA (Reward)', 'Orbitofrontal Loop'],
  H1:      ['Ascending Histaminergic (Arousal)'],
  alpha1:  ['DLPFC Executive Loop', 'Anterior Cingulate Loop', 'Noradrenergic (LC → PFC)'],
  alpha2:  ['Noradrenergic (LC → PFC)', 'DLPFC Executive Loop'],
  M1:      ['Papez Circuit (Hippocampal Memory)', 'Cholinergic Basal Forebrain'],
};

const CIRCUIT_CONDITIONS_MAP = {
  'Serotonergic (Raphe Nuclei)':         ['MDD', 'GAD', 'Panic Disorder', 'Social Anxiety', 'OCD', 'PTSD', 'Bulimia Nervosa'],
  'Limbic/Mood (Amygdala–PFC)':          ['MDD', 'PTSD', 'GAD', 'Bipolar Disorder', 'Panic Disorder', 'Borderline PD'],
  'Papez Circuit':                        ['PTSD', 'Anxiety Disorders', 'MCI / Dementia'],
  'DLPFC Executive Loop':                 ['MDD (cognitive features)', 'ADHD', 'Schizophrenia (cognitive)', 'OCD'],
  'Anterior Cingulate Loop':              ['MDD', 'OCD', 'ADHD', 'Schizophrenia'],
  'Orbitofrontal Loop':                   ['OCD', 'Addiction / SUD', 'Bipolar Disorder'],
  'Mesolimbic DA (Reward)':               ['Schizophrenia (positive sx)', 'Bipolar (mania)', 'Addiction / SUD', 'Bipolar Depression'],
  'Mesocortical DA (Cognition)':          ['Schizophrenia (negative/cognitive sx)', 'ADHD', 'MDD (cognitive features)'],
  'Motor BG Loop':                        ['Parkinson Disease', 'Tourette Syndrome', 'OCD', 'EPS risk'],
  'Noradrenergic (LC → PFC)':             ['ADHD', 'PTSD', 'MDD', 'Anxiety Disorders', 'Chronic Pain'],
  'Prefrontal Cortico–BG Loop':           ['OCD', 'Schizophrenia', 'MDD'],
  'Ascending Histaminergic (Arousal)':    ['Insomnia', 'Hypersomnia', 'Agitation'],
  'Papez Circuit (Hippocampal Memory)':   ['Alzheimer Disease', 'Delirium', 'Amnesia', 'MCI'],
  'Cholinergic Basal Forebrain':          ['Alzheimer Disease', 'Delirium', 'MCI', 'Memory Impairment'],
};


// ─── FDA Safety Data: Black Box Warnings & Common Side Effects ───────────────
// ── Label-based pharmacokinetic notes the CYP model cannot express ─────────
// Pair notes fire when both drugs are selected (b may list several ids);
// drug notes fire whenever that drug is selected. sev: 'high' | 'mod' | 'low'.
const PK_SPECIAL_INTERACTIONS = {
  pairs: [
    { a: 'valproate', b: ['lamotrigine'], sev: 'high', tag: 'UGT',
      text: 'Valproate inhibits lamotrigine glucuronidation and roughly doubles lamotrigine levels, raising the risk of serious rash (SJS/TEN). Use the valproate titration schedule (about half the usual dose, slower escalation; bipolar target 100 mg/day).' },
    { a: 'carbamazepine', b: ['lamotrigine'], sev: 'high', tag: 'UGT',
      text: 'Carbamazepine induces lamotrigine glucuronidation and roughly halves lamotrigine levels. Use the enzyme-inducer titration (bipolar target up to 400 mg/day) and readjust if carbamazepine is stopped.' },
    { a: 'pimozide', b: ['paroxetine', 'fluoxetine', 'bupropion', 'dextromethorphan-bupropion'], sev: 'high', tag: 'Contraindicated',
      text: 'Pimozide with paroxetine or other strong CYP2D6 inhibitors is contraindicated (paroxetine raised pimozide AUC 151%); risk of QT prolongation and arrhythmia.' },
    { a: 'pimozide', b: ['sertraline'], sev: 'high', tag: 'Contraindicated',
      text: 'Pimozide with sertraline is contraindicated per the pimozide label (raised pimozide exposure; QT risk).' },
    { a: 'pimozide', b: ['citalopram', 'escitalopram'], sev: 'high', tag: 'Contraindicated',
      text: 'Citalopram and escitalopram labels contraindicate pimozide (additive QT prolongation).' },
    { a: 'valproate', b: ['lorazepam'], sev: 'mod', tag: 'UGT',
      text: 'Valproate inhibits lorazepam glucuronidation and raises lorazepam levels; the lorazepam label advises reducing the lorazepam dose by about 50%.' },
    { a: 'carbamazepine', b: ['paliperidone'], sev: 'mod', tag: 'P-gp',
      text: 'Carbamazepine lowered paliperidone exposure about 37% (likely renal P-gp induction, not CYP). Reassess the paliperidone dose when starting or stopping carbamazepine.' },
    { a: 'olanzapine-samidorphan', b: ['buprenorphine'], sev: 'high', tag: 'Contraindicated',
      text: 'Lybalvi is contraindicated with opioids: samidorphan precipitates withdrawal in patients on buprenorphine and blocks its effect.' },
    { a: 'naltrexone', b: ['buprenorphine'], sev: 'high', tag: 'Contraindicated',
      text: 'Naltrexone is contraindicated in patients taking opioids, including buprenorphine: it precipitates withdrawal. Transition requires an opioid-free interval (typically 7–14 days after buprenorphine).' },
    { a: 'deutetrabenazine', b: ['valbenazine'], sev: 'high', tag: 'Contraindicated',
      text: 'Deutetrabenazine is contraindicated with valbenazine (and tetrabenazine or reserpine): additive VMAT2 inhibition.' },
    { a: 'viloxazine', b: ['ramelteon', 'duloxetine'], sev: 'high', tag: 'Contraindicated',
      text: 'Viloxazine (strong CYP1A2 inhibitor) is contraindicated with sensitive CYP1A2 substrates such as ramelteon and duloxetine (large exposure increases).' },
    { a: 'buprenorphine', b: ['alprazolam', 'clonazepam', 'diazepam', 'lorazepam', 'oxazepam', 'chlordiazepoxide', 'clorazepate', 'midazolam', 'triazolam', 'estazolam', 'flurazepam', 'temazepam'], sev: 'mod', tag: 'CNS depression',
      text: 'Buprenorphine with benzodiazepines raises the risk of respiratory depression, overdose, and death. Do not withhold OUD treatment; taper or limit the benzodiazepine where possible, monitor closely, and co-prescribe naloxone.' }
  ],
  drugs: [
    { id: 'olanzapine-samidorphan', sev: 'high', tag: 'Opioids',
      text: 'Contraindicated with opioids and in acute opioid withdrawal (samidorphan is an opioid antagonist). Opioid-free ≥7 days (short-acting) or ≥14 days (long-acting) before starting; overcoming the blockade risks fatal overdose.' },
    { id: 'olanzapine-samidorphan', sev: 'low', tag: 'Smoking',
      text: 'Tobacco smoke induces CYP1A2 and lowers olanzapine levels; levels rise after quitting. Watch for sedation and adjust dose when smoking status changes.' },
    { id: 'naltrexone', sev: 'high', tag: 'Opioids',
      text: 'Blocks opioid analgesics and precipitates withdrawal in opioid-dependent patients (contraindicated with opioids). After stopping, reduced tolerance raises overdose risk.' },
    { id: 'lithium', sev: 'mod', tag: 'Renal',
      text: 'Lithium levels rise with NSAIDs, ACE inhibitors, ARBs, and thiazide diuretics (reduced renal clearance). Check levels when these are started, stopped, or dose-changed.' },
    { id: 'clozapine', sev: 'mod', tag: 'Smoking',
      text: 'Tobacco smoke induces CYP1A2 and lowers clozapine levels; levels can rise sharply within days of quitting (nicotine replacement does not induce). Monitor levels and toxicity when smoking status changes.' },
    { id: 'olanzapine', sev: 'low', tag: 'Smoking',
      text: 'Tobacco smoke induces CYP1A2 and lowers olanzapine levels; levels rise after quitting. Watch for sedation and adjust dose when smoking status changes.' }
  ]
};

const FDA_SAFETY_DATA = {

// ── SSRIs ────────────────────────────────────────────────────────────────────
fluoxetine: {
  blackBoxWarnings: ['Increased risk of suicidal thinking and behavior in children, adolescents, and young adults (18-24) taking antidepressants for MDD and other psychiatric disorders.'],
  sideEffects: {
    'CNS': ['headache', 'insomnia', 'somnolence', 'tremor', 'anxiety', 'nervousness'],
    'GI': ['nausea', 'diarrhea', 'anorexia', 'dry mouth'],
    'Sexual': ['decreased libido', 'erectile dysfunction', 'anorgasmia'],
    'Other': ['asthenia', 'diaphoresis', 'rash']
  }
},
sertraline: {
  blackBoxWarnings: ['Increased risk of suicidal thinking and behavior in children, adolescents, and young adults (18-24) taking antidepressants for MDD and other psychiatric disorders.'],
  sideEffects: {
    'CNS': ['headache', 'insomnia', 'somnolence', 'tremor', 'dizziness'],
    'GI': ['nausea', 'diarrhea', 'dyspepsia', 'dry mouth'],
    'Sexual': ['decreased libido', 'erectile dysfunction', 'anorgasmia'],
    'Other': ['diaphoresis', 'fatigue']
  }
},
escitalopram: {
  blackBoxWarnings: ['Increased risk of suicidal thinking and behavior in children, adolescents, and young adults (18-24) taking antidepressants for MDD and other psychiatric disorders.'],
  keyWarnings: ['QT prolongation at doses above 20 mg/day; dose-dependent risk of torsades de pointes.'],
  sideEffects: {
    'CNS': ['insomnia', 'somnolence', 'tremor', 'headache', 'dizziness'],
    'GI': ['nausea', 'diarrhea', 'dry mouth'],
    'Cardiovascular': ['QT prolongation'],
    'Sexual': ['sexual dysfunction'],
    'Other': ['diaphoresis', 'fatigue']
  }
},
paroxetine: {
  blackBoxWarnings: ['Increased risk of suicidal thinking and behavior in children, adolescents, and young adults (18-24) taking antidepressants for MDD and other psychiatric disorders.'],
  keyWarnings: ['Cardiovascular malformations associated with first trimester exposure; avoid in pregnancy when possible.'],
  sideEffects: {
    'CNS': ['somnolence', 'insomnia', 'tremor', 'headache', 'dizziness'],
    'GI': ['nausea', 'constipation', 'dry mouth', 'diarrhea'],
    'Sexual': ['sexual dysfunction', 'decreased libido', 'anorgasmia'],
    'Metabolic/Endocrine': ['weight gain', 'hyponatremia'],
    'Other': ['diaphoresis', 'asthenia']
  }
},
citalopram: {
  blackBoxWarnings: ['Increased risk of suicidal thinking and behavior in children, adolescents, and young adults (18-24) taking antidepressants for MDD and other psychiatric disorders.'],
  keyWarnings: ['Dose-dependent QT prolongation; maximum recommended dose 40 mg/day (20 mg in elderly).'],
  sideEffects: {
    'CNS': ['somnolence', 'insomnia', 'tremor', 'headache'],
    'GI': ['nausea', 'dry mouth', 'diarrhea'],
    'Cardiovascular': ['QT prolongation'],
    'Sexual': ['sexual dysfunction'],
    'Other': ['diaphoresis', 'fatigue']
  }
},
fluvoxamine: {
  blackBoxWarnings: ['Increased risk of suicidal thinking and behavior in children, adolescents, and young adults (18-24) taking antidepressants for MDD and other psychiatric disorders.'],
  sideEffects: {
    'CNS': ['somnolence', 'insomnia', 'headache', 'tremor', 'dizziness', 'nervousness'],
    'GI': ['nausea', 'diarrhea', 'dry mouth', 'vomiting'],
    'Sexual': ['sexual dysfunction'],
    'Other': ['diaphoresis', 'asthenia']
  }
},

// ── SNRIs ────────────────────────────────────────────────────────────────────
venlafaxine: {
  blackBoxWarnings: ['Increased risk of suicidal thinking and behavior in children, adolescents, and young adults (18-24) taking antidepressants for MDD and other psychiatric disorders.'],
  sideEffects: {
    'CNS': ['headache', 'somnolence', 'insomnia', 'tremor', 'dizziness', 'nervousness'],
    'GI': ['nausea', 'anorexia', 'constipation', 'dry mouth'],
    'Cardiovascular': ['hypertension', 'tachycardia'],
    'Sexual': ['sexual dysfunction', 'decreased libido'],
    'Other': ['diaphoresis', 'asthenia']
  }
},
duloxetine: {
  blackBoxWarnings: ['Increased risk of suicidal thinking and behavior in children, adolescents, and young adults (18-24) taking antidepressants for MDD and other psychiatric disorders.'],
  keyWarnings: ['Hepatotoxicity risk; contraindicated in chronic liver disease or hepatic cirrhosis.'],
  sideEffects: {
    'CNS': ['somnolence', 'headache', 'dizziness', 'insomnia', 'tremor'],
    'GI': ['nausea', 'dry mouth', 'constipation', 'diarrhea'],
    'Cardiovascular': ['hypertension'],
    'Sexual': ['sexual dysfunction'],
    'Other': ['diaphoresis', 'fatigue']
  }
},
desvenlafaxine: {
  blackBoxWarnings: ['Increased risk of suicidal thinking and behavior in children, adolescents, and young adults (18-24) taking antidepressants for MDD and other psychiatric disorders.'],
  sideEffects: {
    'CNS': ['headache', 'somnolence', 'insomnia', 'dizziness', 'tremor'],
    'GI': ['nausea', 'dry mouth', 'constipation'],
    'Cardiovascular': ['hypertension'],
    'Sexual': ['sexual dysfunction'],
    'Other': ['diaphoresis', 'asthenia']
  }
},
milnacipran: {
  blackBoxWarnings: ['Increased risk of suicidal thinking and behavior in children, adolescents, and young adults (18-24) taking antidepressants for MDD and other psychiatric disorders.'],
  sideEffects: {
    'CNS': ['headache', 'somnolence', 'dizziness', 'insomnia'],
    'GI': ['nausea', 'constipation', 'dry mouth'],
    'Cardiovascular': ['hypertension', 'palpitations', 'tachycardia'],
    'Sexual': ['sexual dysfunction'],
    'Other': ['diaphoresis', 'hot flushes']
  }
},
levomilnacipran: {
  blackBoxWarnings: ['Increased risk of suicidal thinking and behavior in children, adolescents, and young adults (18-24) taking antidepressants for MDD and other psychiatric disorders.'],
  sideEffects: {
    'CNS': ['headache', 'somnolence', 'dizziness', 'insomnia'],
    'GI': ['nausea', 'constipation', 'vomiting', 'dry mouth'],
    'Cardiovascular': ['hypertension', 'palpitations', 'tachycardia'],
    'Sexual': ['sexual dysfunction', 'erectile dysfunction'],
    'Other': ['diaphoresis', 'fatigue']
  }
},

// ── TCAs ─────────────────────────────────────────────────────────────────────
amitriptyline: {
  blackBoxWarnings: ['Increased risk of suicidal thinking and behavior in children, adolescents, and young adults (18-24) taking antidepressants for MDD and other psychiatric disorders.'],
  sideEffects: {
    'CNS': ['somnolence', 'dizziness', 'tremor', 'headache', 'confusion'],
    'GI': ['dry mouth', 'constipation', 'nausea'],
    'Cardiovascular': ['orthostatic hypotension', 'tachycardia', 'QT prolongation'],
    'Sexual': ['sexual dysfunction', 'erectile dysfunction'],
    'Metabolic/Endocrine': ['weight gain'],
    'Other': ['blurred vision', 'urinary retention', 'diaphoresis']
  }
},
nortriptyline: {
  blackBoxWarnings: ['Increased risk of suicidal thinking and behavior in children, adolescents, and young adults (18-24) taking antidepressants for MDD and other psychiatric disorders.'],
  sideEffects: {
    'CNS': ['somnolence', 'dizziness', 'tremor', 'headache'],
    'GI': ['dry mouth', 'constipation'],
    'Cardiovascular': ['orthostatic hypotension', 'tachycardia'],
    'Sexual': ['sexual dysfunction'],
    'Other': ['blurred vision', 'urinary retention']
  }
},
imipramine: {
  blackBoxWarnings: ['Increased risk of suicidal thinking and behavior in children, adolescents, and young adults (18-24) taking antidepressants for MDD and other psychiatric disorders.'],
  sideEffects: {
    'CNS': ['somnolence', 'dizziness', 'tremor', 'headache', 'confusion'],
    'GI': ['dry mouth', 'constipation', 'nausea'],
    'Cardiovascular': ['orthostatic hypotension', 'tachycardia', 'QT prolongation'],
    'Sexual': ['sexual dysfunction', 'erectile dysfunction'],
    'Metabolic/Endocrine': ['weight gain'],
    'Other': ['blurred vision', 'urinary retention', 'diaphoresis']
  }
},
doxepin: {
  blackBoxWarnings: ['Increased risk of suicidal thinking and behavior in children, adolescents, and young adults (18-24) taking antidepressants for MDD and other psychiatric disorders.'],
  sideEffects: {
    'CNS': ['somnolence', 'dizziness', 'headache', 'tremor'],
    'GI': ['dry mouth', 'constipation', 'nausea'],
    'Cardiovascular': ['orthostatic hypotension', 'tachycardia'],
    'Sexual': ['sexual dysfunction'],
    'Other': ['blurred vision', 'weight gain']
  }
},

// ── MAOIs ────────────────────────────────────────────────────────────────────
phenelzine: {
  blackBoxWarnings: ['Increased risk of suicidal thinking and behavior in children, adolescents, and young adults (18-24) taking antidepressants for MDD and other psychiatric disorders.'],
  keyWarnings: ['Hypertensive crisis risk with tyramine-containing foods, sympathomimetics, and serotonergic drugs; strict dietary restrictions required.'],
  sideEffects: {
    'CNS': ['somnolence', 'headache', 'tremor', 'dizziness', 'insomnia'],
    'GI': ['dry mouth', 'constipation', 'nausea'],
    'Cardiovascular': ['orthostatic hypotension'],
    'Sexual': ['sexual dysfunction', 'anorgasmia'],
    'Metabolic/Endocrine': ['weight gain'],
    'Other': ['diaphoresis', 'edema']
  }
},
tranylcypromine: {
  blackBoxWarnings: ['Increased risk of suicidal thinking and behavior in children, adolescents, and young adults (18-24) taking antidepressants for MDD and other psychiatric disorders.', 'Hypertensive crisis risk with tyramine-containing foods, sympathomimetics, and serotonergic drugs; strict dietary restrictions required.'],
  sideEffects: {
    'CNS': ['insomnia', 'somnolence', 'tremor', 'headache', 'dizziness'],
    'GI': ['dry mouth', 'constipation', 'nausea'],
    'Cardiovascular': ['orthostatic hypotension'],
    'Sexual': ['sexual dysfunction'],
    'Other': ['diaphoresis']
  }
},

// ── Other Antidepressants ────────────────────────────────────────────────────
bupropion: {
  blackBoxWarnings: ['Increased risk of suicidal thinking and behavior in children, adolescents, and young adults (18-24) taking antidepressants for MDD and other psychiatric disorders.'],
  keyWarnings: ['Dose-dependent seizure risk; contraindicated in seizure disorders, eating disorders, and abrupt discontinuation of alcohol or sedatives.'],
  sideEffects: {
    'CNS': ['insomnia', 'headache', 'tremor', 'agitation', 'dizziness'],
    'GI': ['dry mouth', 'nausea', 'constipation'],
    'Cardiovascular': ['hypertension', 'tachycardia'],
    'Other': ['diaphoresis', 'weight loss']
  }
},
mirtazapine: {
  blackBoxWarnings: ['Increased risk of suicidal thinking and behavior in children, adolescents, and young adults (18-24) taking antidepressants for MDD and other psychiatric disorders.'],
  sideEffects: {
    'CNS': ['somnolence', 'dizziness', 'headache'],
    'GI': ['increased appetite', 'dry mouth', 'constipation'],
    'Metabolic/Endocrine': ['weight gain', 'hyperlipidemia'],
    'Other': ['asthenia']
  }
},
trazodone: {
  blackBoxWarnings: ['Increased risk of suicidal thinking and behavior in children, adolescents, and young adults (18-24) taking antidepressants for MDD and other psychiatric disorders.'],
  sideEffects: {
    'CNS': ['somnolence', 'dizziness', 'headache'],
    'GI': ['dry mouth', 'nausea', 'constipation'],
    'Cardiovascular': ['orthostatic hypotension'],
    'Sexual': ['priapism'],
    'Other': ['blurred vision', 'fatigue']
  }
},
vilazodone: {
  blackBoxWarnings: ['Increased risk of suicidal thinking and behavior in children, adolescents, and young adults (18-24) taking antidepressants for MDD and other psychiatric disorders.'],
  sideEffects: {
    'CNS': ['somnolence', 'headache', 'dizziness', 'insomnia'],
    'GI': ['diarrhea', 'nausea', 'dry mouth', 'vomiting'],
    'Sexual': ['sexual dysfunction'],
    'Other': ['tremor', 'fatigue']
  }
},
vortioxetine: {
  blackBoxWarnings: ['Increased risk of suicidal thinking and behavior in children, adolescents, and young adults (18-24) taking antidepressants for MDD and other psychiatric disorders.'],
  sideEffects: {
    'CNS': ['headache', 'dizziness'],
    'GI': ['nausea', 'vomiting', 'dry mouth', 'constipation', 'diarrhea'],
    'Sexual': ['sexual dysfunction'],
    'Other': ['pruritus']
  }
},
gepirone: {
  blackBoxWarnings: ['Increased risk of suicidal thinking and behavior in children, adolescents, and young adults (18-24) taking antidepressants for MDD and other psychiatric disorders.'],
  sideEffects: {
    'CNS': ['dizziness', 'somnolence', 'headache', 'insomnia'],
    'GI': ['nausea', 'diarrhea', 'dry mouth'],
    'Other': ['tremor']
  }
},
esketamine: {
  blackBoxWarnings: ['Sedation, dissociation, respiratory depression, and abuse/misuse; available only through a restricted REMS program requiring administration in certified healthcare settings with post-dose monitoring.', 'Increased risk of suicidal thinking and behavior in children, adolescents, and young adults (18-24) taking antidepressants for MDD and other psychiatric disorders.'],
  sideEffects: {
    'CNS': ['dissociation', 'somnolence', 'sedation', 'dizziness', 'headache', 'vertigo'],
    'GI': ['nausea', 'vomiting', 'dry mouth'],
    'Cardiovascular': ['hypertension', 'tachycardia'],
    'Other': ['anxiety', 'blurred vision']
  }
},
brexanolone: {
  blackBoxWarnings: ['Excessive sedation and sudden loss of consciousness; available only through a restricted REMS program requiring IV administration as a 60-hour inpatient infusion with continuous monitoring.'],
  sideEffects: {
    'CNS': ['somnolence', 'sedation', 'dizziness', 'presyncope', 'headache'],
    'GI': ['dry mouth'],
    'Cardiovascular': ['flushing'],
    'Other': ['hot flushes']
  }
},
zuranolone: {
  blackBoxWarnings: ['Impaired ability to drive or engage in other potentially hazardous activities: CNS depressant effects; do not drive or operate machinery for at least 12 hours after each dose. Patients may not be able to assess their own impairment.'],
  keyWarnings: ['Suicidal thoughts and behaviors: monitor for worsening depression and emergence of suicidal thoughts; consider changing the regimen if they emerge.'],
  sideEffects: {
    'CNS': ['somnolence', 'dizziness', 'sedation', 'headache'],
    'GI': ['diarrhea', 'nausea'],
    'Other': ['fatigue', 'nasopharyngitis']
  }
},
'dextromethorphan-bupropion': {
  blackBoxWarnings: ['Increased risk of suicidal thinking and behavior in children, adolescents, and young adults (18-24) taking antidepressants for MDD and other psychiatric disorders.'],
  keyWarnings: ['Dose-dependent seizure risk from bupropion component; contraindicated in seizure disorders and eating disorders.'],
  sideEffects: {
    'CNS': ['dizziness', 'headache', 'somnolence'],
    'GI': ['diarrhea', 'nausea', 'dry mouth'],
    'Other': ['diaphoresis']
  }
},

// ── First-Generation Antipsychotics (FGAs) ───────────────────────────────────
haloperidol: {
  blackBoxWarnings: ['Increased mortality in elderly patients with dementia-related psychosis; not approved for this use.'],
  sideEffects: {
    'CNS': ['extrapyramidal symptoms', 'akathisia', 'tardive dyskinesia', 'sedation', 'dystonia'],
    'Cardiovascular': ['orthostatic hypotension', 'QT prolongation'],
    'Metabolic/Endocrine': ['hyperprolactinemia', 'gynecomastia', 'amenorrhea'],
    'GI': ['dry mouth', 'constipation'],
    'Other': ['photosensitivity']
  }
},
chlorpromazine: {
  blackBoxWarnings: ['Increased mortality in elderly patients with dementia-related psychosis; not approved for this use.'],
  sideEffects: {
    'CNS': ['sedation', 'extrapyramidal symptoms', 'tardive dyskinesia', 'akathisia'],
    'Cardiovascular': ['orthostatic hypotension', 'QT prolongation'],
    'Metabolic/Endocrine': ['weight gain', 'hyperprolactinemia'],
    'GI': ['constipation', 'dry mouth'],
    'Other': ['photosensitivity', 'corneal deposits']
  }
},
fluphenazine: {
  blackBoxWarnings: ['Increased mortality in elderly patients with dementia-related psychosis; not approved for this use.'],
  sideEffects: {
    'CNS': ['extrapyramidal symptoms', 'akathisia', 'tardive dyskinesia', 'dystonia'],
    'Cardiovascular': ['orthostatic hypotension'],
    'Metabolic/Endocrine': ['hyperprolactinemia'],
    'GI': ['constipation', 'dry mouth']
  }
},
trifluoperazine: {
  blackBoxWarnings: ['Increased mortality in elderly patients with dementia-related psychosis; not approved for this use.'],
  sideEffects: {
    'CNS': ['extrapyramidal symptoms', 'akathisia', 'tardive dyskinesia', 'dystonia'],
    'Cardiovascular': ['orthostatic hypotension'],
    'Metabolic/Endocrine': ['hyperprolactinemia'],
    'GI': ['constipation', 'dry mouth']
  }
},
perphenazine: {
  blackBoxWarnings: ['Increased mortality in elderly patients with dementia-related psychosis; not approved for this use.'],
  sideEffects: {
    'CNS': ['extrapyramidal symptoms', 'akathisia', 'tardive dyskinesia', 'sedation'],
    'Cardiovascular': ['orthostatic hypotension'],
    'Metabolic/Endocrine': ['hyperprolactinemia'],
    'GI': ['constipation', 'dry mouth']
  }
},
thiothixene: {
  blackBoxWarnings: ['Increased mortality in elderly patients with dementia-related psychosis; not approved for this use.'],
  sideEffects: {
    'CNS': ['extrapyramidal symptoms', 'akathisia', 'tardive dyskinesia', 'sedation'],
    'Cardiovascular': ['orthostatic hypotension'],
    'Metabolic/Endocrine': ['hyperprolactinemia'],
    'GI': ['constipation', 'dry mouth']
  }
},
pimozide: {
  blackBoxWarnings: [],
  keyWarnings: ['Dose-dependent QT prolongation; baseline ECG and periodic monitoring required.', 'Contraindicated with strong CYP2D6 inhibitors (e.g., paroxetine, fluoxetine, bupropion), with sertraline, with strong CYP3A4 inhibitors, and with macrolide antibiotics. CYP2D6 genotyping is required at doses above 4 mg/day (0.05 mg/kg/day in children); poor metabolizers should not exceed those doses.'],
  sideEffects: {
    'CNS': ['extrapyramidal symptoms', 'akathisia', 'tardive dyskinesia', 'sedation'],
    'Cardiovascular': ['orthostatic hypotension', 'QT prolongation'],
    'Metabolic/Endocrine': ['hyperprolactinemia'],
    'GI': ['constipation', 'dry mouth']
  }
},
thioridazine: {
  blackBoxWarnings: ['Increased mortality in elderly patients with dementia-related psychosis; not approved for this use.', 'Dose-dependent QT prolongation and risk of torsades de pointes; reserved for patients who fail other antipsychotics.'],
  sideEffects: {
    'CNS': ['sedation', 'extrapyramidal symptoms', 'tardive dyskinesia'],
    'Cardiovascular': ['orthostatic hypotension', 'QT prolongation'],
    'Metabolic/Endocrine': ['weight gain', 'hyperprolactinemia'],
    'GI': ['constipation', 'dry mouth'],
    'Other': ['retinal pigmentation', 'photosensitivity']
  }
},
loxapine: {
  blackBoxWarnings: ['Increased mortality in elderly patients with dementia-related psychosis; not approved for this use.'],
  sideEffects: {
    'CNS': ['extrapyramidal symptoms', 'akathisia', 'tardive dyskinesia', 'sedation'],
    'Cardiovascular': ['orthostatic hypotension'],
    'Metabolic/Endocrine': ['weight gain'],
    'GI': ['constipation', 'dry mouth']
  }
},
molindone: {
  blackBoxWarnings: ['Increased mortality in elderly patients with dementia-related psychosis; not approved for this use.'],
  sideEffects: {
    'CNS': ['extrapyramidal symptoms', 'akathisia', 'tardive dyskinesia', 'sedation'],
    'Cardiovascular': ['orthostatic hypotension'],
    'GI': ['constipation', 'dry mouth']
  }
},

// ── Second-Generation Antipsychotics (SGAs) ──────────────────────────────────
risperidone: {
  blackBoxWarnings: ['Increased mortality in elderly patients with dementia-related psychosis; not approved for this use.'],
  keyWarnings: ['Cerebrovascular adverse events (stroke, TIA) reported in elderly patients with dementia.'],
  sideEffects: {
    'CNS': ['sedation', 'extrapyramidal symptoms', 'akathisia', 'tremor', 'insomnia'],
    'Cardiovascular': ['orthostatic hypotension', 'tachycardia'],
    'Metabolic/Endocrine': ['weight gain', 'hyperprolactinemia', 'hyperglycemia'],
    'GI': ['constipation', 'nausea', 'dry mouth']
  }
},
olanzapine: {
  blackBoxWarnings: ['Increased mortality in elderly patients with dementia-related psychosis; not approved for this use.'],
  sideEffects: {
    'CNS': ['sedation', 'akathisia', 'tremor', 'dizziness'],
    'Cardiovascular': ['orthostatic hypotension', 'tachycardia'],
    'Metabolic/Endocrine': ['weight gain', 'hyperglycemia', 'dyslipidemia', 'hyperprolactinemia'],
    'GI': ['constipation', 'dry mouth', 'increased appetite'],
    'Other': ['elevated liver enzymes']
  }
},
quetiapine: {
  blackBoxWarnings: ['Increased mortality in elderly patients with dementia-related psychosis; not approved for this use.', 'Increased risk of suicidal thinking and behavior in children, adolescents, and young adults (18-24) taking antidepressants for MDD and other psychiatric disorders.'],
  sideEffects: {
    'CNS': ['sedation', 'dizziness', 'headache'],
    'Cardiovascular': ['orthostatic hypotension', 'tachycardia'],
    'Metabolic/Endocrine': ['weight gain', 'hyperglycemia', 'dyslipidemia'],
    'GI': ['dry mouth', 'constipation'],
    'Other': ['cataracts (monitor lens)']
  }
},
aripiprazole: {
  blackBoxWarnings: ['Increased mortality in elderly patients with dementia-related psychosis; not approved for this use.', 'Increased risk of suicidal thinking and behavior in children, adolescents, and young adults (18-24) taking antidepressants for MDD and other psychiatric disorders.'],
  sideEffects: {
    'CNS': ['akathisia', 'insomnia', 'sedation', 'headache', 'anxiety'],
    'Cardiovascular': ['orthostatic hypotension'],
    'Metabolic/Endocrine': ['weight gain'],
    'GI': ['nausea', 'constipation', 'vomiting']
  }
},
clozapine: {
  blackBoxWarnings: ['Severe neutropenia: obtain baseline ANC and monitor ANC per label. Do not initiate if baseline ANC < 1500/µL (< 1000/µL for benign ethnic neutropenia / Duffy-null). The Clozapine REMS was eliminated in 2025; ANC monitoring is still required.', 'Orthostatic hypotension, bradycardia, and syncope: risk highest during initial titration and dose increases; can lead to cardiorespiratory arrest. Start at 12.5 mg and titrate slowly.', 'Seizure risk, especially at doses >600 mg/day; dose-dependent.', 'Myocarditis, pericarditis, and cardiomyopathy: highest risk in the first month of treatment. Monitor for tachycardia, chest pain, dyspnea, and fever; discontinue if suspected.', 'Increased mortality in elderly patients with dementia-related psychosis; not approved for this use.'],
  sideEffects: {
    'CNS': ['sedation', 'dizziness', 'seizures', 'tremor', 'headache'],
    'Cardiovascular': ['orthostatic hypotension', 'tachycardia', 'myocarditis'],
    'Metabolic/Endocrine': ['weight gain', 'hyperglycemia', 'dyslipidemia', 'metabolic syndrome'],
    'GI': ['constipation', 'hypersalivation', 'nausea', 'dry mouth'],
    'Hematologic': ['neutropenia', 'agranulocytosis', 'leukopenia'],
    'Other': ['fever', 'elevated liver enzymes', 'enuresis']
  }
},
ziprasidone: {
  blackBoxWarnings: ['Increased mortality in elderly patients with dementia-related psychosis; not approved for this use.'],
  keyWarnings: ['QT prolongation risk; avoid in patients with known QT prolongation or recent MI.'],
  sideEffects: {
    'CNS': ['sedation', 'akathisia', 'headache', 'dizziness', 'extrapyramidal symptoms'],
    'Cardiovascular': ['orthostatic hypotension', 'QT prolongation'],
    'Metabolic/Endocrine': ['weight gain (minimal)'],
    'GI': ['nausea', 'constipation', 'dyspepsia']
  }
},
lurasidone: {
  blackBoxWarnings: ['Increased mortality in elderly patients with dementia-related psychosis; not approved for this use.', 'Increased risk of suicidal thinking and behavior in children, adolescents, and young adults (18-24) taking antidepressants for MDD and other psychiatric disorders.'],
  sideEffects: {
    'CNS': ['somnolence', 'akathisia', 'parkinsonism', 'headache'],
    'Cardiovascular': ['orthostatic hypotension'],
    'Metabolic/Endocrine': ['weight gain (minimal)', 'hyperprolactinemia'],
    'GI': ['nausea', 'vomiting']
  }
},
asenapine: {
  blackBoxWarnings: ['Increased mortality in elderly patients with dementia-related psychosis; not approved for this use.'],
  sideEffects: {
    'CNS': ['akathisia', 'somnolence', 'parkinsonism', 'dizziness'],
    'Cardiovascular': ['orthostatic hypotension'],
    'Metabolic/Endocrine': ['weight gain'],
    'GI': ['oral hypoesthesia', 'nausea']
  }
},
paliperidone: {
  blackBoxWarnings: ['Increased mortality in elderly patients with dementia-related psychosis; not approved for this use.'],
  sideEffects: {
    'CNS': ['akathisia', 'somnolence', 'extrapyramidal symptoms', 'tremor', 'headache'],
    'Cardiovascular': ['orthostatic hypotension', 'tachycardia'],
    'Metabolic/Endocrine': ['weight gain', 'hyperprolactinemia', 'hyperglycemia'],
    'GI': ['constipation', 'nausea']
  }
},
iloperidone: {
  blackBoxWarnings: ['Increased mortality in elderly patients with dementia-related psychosis; not approved for this use.'],
  sideEffects: {
    'CNS': ['dizziness', 'somnolence', 'tremor'],
    'Cardiovascular': ['orthostatic hypotension', 'tachycardia', 'QT prolongation'],
    'Metabolic/Endocrine': ['weight gain'],
    'GI': ['dry mouth', 'nausea']
  }
},
brexpiprazole: {
  blackBoxWarnings: ['Increased mortality in elderly patients with dementia-related psychosis; not approved for this use.', 'Increased risk of suicidal thinking and behavior in children, adolescents, and young adults (18-24) taking antidepressants for MDD and other psychiatric disorders.'],
  sideEffects: {
    'CNS': ['akathisia', 'headache', 'sedation', 'tremor'],
    'Cardiovascular': ['orthostatic hypotension'],
    'Metabolic/Endocrine': ['weight gain'],
    'GI': ['constipation', 'diarrhea', 'nausea']
  }
},
cariprazine: {
  blackBoxWarnings: ['Increased mortality in elderly patients with dementia-related psychosis; not approved for this use.', 'Increased risk of suicidal thinking and behavior in children, adolescents, and young adults (18-24) taking antidepressants for MDD and other psychiatric disorders.'],
  sideEffects: {
    'CNS': ['akathisia', 'parkinsonism', 'headache', 'somnolence', 'insomnia'],
    'Cardiovascular': ['orthostatic hypotension'],
    'Metabolic/Endocrine': ['weight gain'],
    'GI': ['nausea', 'vomiting', 'constipation']
  }
},
lumateperone: {
  blackBoxWarnings: ['Increased mortality in elderly patients with dementia-related psychosis; not approved for this use.', 'Increased risk of suicidal thinking and behavior in children, adolescents, and young adults (18-24) taking antidepressants for MDD and other psychiatric disorders.'],
  sideEffects: {
    'CNS': ['sedation', 'somnolence', 'dizziness'],
    'Metabolic/Endocrine': ['weight gain (minimal)'],
    'GI': ['nausea', 'dry mouth']
  }
},
pimavanserin: {
  blackBoxWarnings: ['Increased mortality in elderly patients with dementia-related psychosis; not approved for this use.'],
  keyWarnings: ['QT prolongation risk; avoid in patients with known QT prolongation.'],
  sideEffects: {
    'CNS': ['confusion', 'hallucinations', 'headache'],
    'Cardiovascular': ['QT prolongation'],
    'GI': ['nausea', 'constipation'],
    'Other': ['peripheral edema']
  }
},

// ── Mood Stabilizers ─────────────────────────────────────────────────────────
lithium: {
  blackBoxWarnings: ['Lithium toxicity is closely related to serum levels and can occur at therapeutic doses; facilities for prompt and accurate serum lithium monitoring must be available.'],
  keyWarnings: ['Unmasking of Brugada syndrome (postmarketing reports): avoid in patients with Brugada syndrome or suspected Brugada syndrome; consider cardiology consultation for unexplained syncope or palpitations. ECG changes, including QTc prolongation, can occur, especially with toxicity.'],
  sideEffects: {
    'CNS': ['tremor', 'cognitive dulling', 'memory impairment', 'ataxia', 'headache'],
    'GI': ['nausea', 'vomiting', 'diarrhea'],
    'Cardiovascular': ['ECG changes', 'bradycardia'],
    'Metabolic/Endocrine': ['hypothyroidism', 'hyperparathyroidism', 'weight gain'],
    'Renal': ['nephrogenic diabetes insipidus', 'polyuria', 'polydipsia', 'reduced GFR'],
    'Other': ['acne', 'alopecia', 'leukocytosis']
  }
},
valproate: {
  blackBoxWarnings: ['Hepatotoxicity including fatal hepatic failure; highest risk in children under 2 and patients on polytherapy. Monitor LFTs frequently, especially in first 6 months.', 'Fetal risk: major congenital malformations (especially neural tube defects), decreased IQ, and neurodevelopmental disorders. Contraindicated in pregnancy for migraine prophylaxis; avoid in women of childbearing potential unless alternatives are inadequate.', 'Life-threatening pancreatitis reported; discontinue immediately if pancreatitis is diagnosed.'],
  sideEffects: {
    'CNS': ['sedation', 'tremor', 'ataxia', 'dizziness', 'headache'],
    'GI': ['nausea', 'vomiting', 'diarrhea', 'abdominal pain'],
    'Metabolic/Endocrine': ['weight gain', 'alopecia', 'polycystic ovary syndrome'],
    'Hematologic': ['thrombocytopenia', 'leukopenia'],
    'Other': ['hyperammonemia', 'elevated liver enzymes']
  }
},
lamotrigine: {
  blackBoxWarnings: ['Serious skin rashes including Stevens-Johnson syndrome and toxic epidermal necrolysis, especially with rapid titration or concurrent valproate; risk is reduced with slow dose escalation.'],
  sideEffects: {
    'CNS': ['dizziness', 'ataxia', 'diplopia', 'blurred vision', 'headache', 'somnolence'],
    'GI': ['nausea', 'vomiting'],
    'Other': ['rash', 'insomnia']
  }
},
carbamazepine: {
  blackBoxWarnings: ['Serious dermatologic reactions including SJS and TEN; risk strongly associated with HLA-B*1502 allele. Screen patients of Asian ancestry before initiating.', 'Aplastic anemia and agranulocytosis; monitor CBC at baseline and periodically.'],
  keyWarnings: ['Autoinduction: carbamazepine induces its own metabolism, so levels fall over the first 3–5 weeks; recheck levels and adjust dose.', 'Strong CYP3A4 and UGT inducer: lowers levels of many drugs (e.g., quetiapine, lurasidone, lamotrigine, hormonal contraceptives) — contraceptives may fail.'],
  sideEffects: {
    'CNS': ['dizziness', 'ataxia', 'diplopia', 'blurred vision', 'sedation', 'headache'],
    'GI': ['nausea', 'vomiting'],
    'Hematologic': ['leukopenia', 'thrombocytopenia'],
    'Metabolic/Endocrine': ['hyponatremia', 'weight gain'],
    'Other': ['rash', 'elevated liver enzymes']
  }
},
oxcarbazepine: {
  blackBoxWarnings: [],
  keyWarnings: ['Reduces hormonal contraceptive levels (ethinyl estradiol, levonorgestrel) through CYP3A4 induction; contraceptives may be less effective — use an additional or non-hormonal method.'],
  sideEffects: {
    'CNS': ['dizziness', 'ataxia', 'diplopia', 'somnolence', 'headache', 'tremor'],
    'GI': ['nausea', 'vomiting'],
    'Metabolic/Endocrine': ['hyponatremia'],
    'Other': ['rash', 'fatigue']
  }
},
topiramate: {
  blackBoxWarnings: [],
  keyWarnings: ['Oral clefts (cleft lip/palate) reported with first trimester exposure; avoid in pregnancy when possible.', 'Reduces estrogen-containing contraceptive exposure, mainly at doses above 200 mg/day; consider decreased contraceptive efficacy and increased breakthrough bleeding.'],
  sideEffects: {
    'CNS': ['cognitive impairment', 'word-finding difficulty', 'dizziness', 'sedation', 'paresthesia'],
    'GI': ['anorexia', 'nausea', 'weight loss'],
    'Metabolic/Endocrine': ['metabolic acidosis', 'kidney stones'],
    'Other': ['acute myopia', 'secondary angle-closure glaucoma']
  }
},
gabapentin: {
  blackBoxWarnings: [],
  sideEffects: {
    'CNS': ['somnolence', 'dizziness', 'ataxia', 'fatigue', 'headache'],
    'GI': ['nausea', 'dry mouth'],
    'Other': ['peripheral edema', 'weight gain', 'blurred vision']
  }
},
pregabalin: {
  blackBoxWarnings: [],
  sideEffects: {
    'CNS': ['somnolence', 'dizziness', 'ataxia', 'confusion', 'tremor'],
    'GI': ['dry mouth', 'nausea'],
    'Metabolic/Endocrine': ['weight gain'],
    'Other': ['peripheral edema', 'blurred vision']
  }
},

// ── Benzodiazepines ──────────────────────────────────────────────────────────
alprazolam: {
  blackBoxWarnings: ['Concomitant use with opioids may result in profound sedation, respiratory depression, coma, and death; reserve concurrent use for patients with inadequate alternatives.', 'Abuse, misuse, and addiction: benzodiazepine use exposes users to risks of abuse, misuse, and addiction, which can lead to overdose or death. Assess risk before prescribing and throughout treatment.', 'Physical dependence and withdrawal reactions; abrupt discontinuation or rapid dose reduction may be life-threatening. Taper gradually.'],
  sideEffects: {
    'CNS': ['sedation', 'dizziness', 'ataxia', 'memory impairment', 'cognitive impairment'],
    'Other': ['dependence', 'fatigue']
  }
},
clonazepam: {
  blackBoxWarnings: ['Concomitant use with opioids may result in profound sedation, respiratory depression, coma, and death; reserve concurrent use for patients with inadequate alternatives.', 'Abuse, misuse, and addiction: benzodiazepine use exposes users to risks of abuse, misuse, and addiction, which can lead to overdose or death. Assess risk before prescribing and throughout treatment.', 'Physical dependence and withdrawal reactions; abrupt discontinuation or rapid dose reduction may be life-threatening. Taper gradually.'],
  sideEffects: {
    'CNS': ['sedation', 'dizziness', 'ataxia', 'cognitive impairment', 'depression'],
    'Other': ['dependence', 'fatigue']
  }
},
diazepam: {
  blackBoxWarnings: ['Concomitant use with opioids may result in profound sedation, respiratory depression, coma, and death; reserve concurrent use for patients with inadequate alternatives.', 'Abuse, misuse, and addiction: benzodiazepine use exposes users to risks of abuse, misuse, and addiction, which can lead to overdose or death. Assess risk before prescribing and throughout treatment.', 'Physical dependence and withdrawal reactions; abrupt discontinuation or rapid dose reduction may be life-threatening. Taper gradually.'],
  sideEffects: {
    'CNS': ['sedation', 'dizziness', 'ataxia', 'memory impairment', 'confusion'],
    'Other': ['dependence', 'fatigue']
  }
},
lorazepam: {
  blackBoxWarnings: ['Concomitant use with opioids may result in profound sedation, respiratory depression, coma, and death; reserve concurrent use for patients with inadequate alternatives.', 'Abuse, misuse, and addiction: benzodiazepine use exposes users to risks of abuse, misuse, and addiction, which can lead to overdose or death. Assess risk before prescribing and throughout treatment.', 'Physical dependence and withdrawal reactions; abrupt discontinuation or rapid dose reduction may be life-threatening. Taper gradually.'],
  sideEffects: {
    'CNS': ['sedation', 'dizziness', 'weakness', 'ataxia', 'memory impairment'],
    'Other': ['dependence']
  }
},
oxazepam: {
  blackBoxWarnings: ['Concomitant use with opioids may result in profound sedation, respiratory depression, coma, and death; reserve concurrent use for patients with inadequate alternatives.', 'Abuse, misuse, and addiction: benzodiazepine use exposes users to risks of abuse, misuse, and addiction, which can lead to overdose or death. Assess risk before prescribing and throughout treatment.', 'Physical dependence and withdrawal reactions; abrupt discontinuation or rapid dose reduction may be life-threatening. Taper gradually.'],
  sideEffects: {
    'CNS': ['sedation', 'dizziness', 'ataxia', 'memory impairment'],
    'Other': ['dependence']
  }
},
chlordiazepoxide: {
  blackBoxWarnings: ['Concomitant use with opioids may result in profound sedation, respiratory depression, coma, and death; reserve concurrent use for patients with inadequate alternatives.', 'Abuse, misuse, and addiction: benzodiazepine use exposes users to risks of abuse, misuse, and addiction, which can lead to overdose or death. Assess risk before prescribing and throughout treatment.', 'Physical dependence and withdrawal reactions; abrupt discontinuation or rapid dose reduction may be life-threatening. Taper gradually.'],
  sideEffects: {
    'CNS': ['sedation', 'dizziness', 'ataxia', 'confusion'],
    'GI': ['nausea', 'constipation'],
    'Other': ['dependence']
  }
},
clorazepate: {
  blackBoxWarnings: ['Concomitant use with opioids may result in profound sedation, respiratory depression, coma, and death; reserve concurrent use for patients with inadequate alternatives.', 'Abuse, misuse, and addiction: benzodiazepine use exposes users to risks of abuse, misuse, and addiction, which can lead to overdose or death. Assess risk before prescribing and throughout treatment.', 'Physical dependence and withdrawal reactions; abrupt discontinuation or rapid dose reduction may be life-threatening. Taper gradually.'],
  sideEffects: {
    'CNS': ['sedation', 'dizziness', 'ataxia', 'memory impairment'],
    'Other': ['dependence']
  }
},
midazolam: {
  blackBoxWarnings: ['IV/IM administration carries risk of respiratory depression and arrest; resuscitation equipment must be available.', 'Concomitant use with opioids may result in profound sedation, respiratory depression, coma, and death; reserve concurrent use for patients with inadequate alternatives.', 'Abuse, misuse, and addiction: benzodiazepine use exposes users to risks of abuse, misuse, and addiction, which can lead to overdose or death. Assess risk before prescribing and throughout treatment.', 'Physical dependence and withdrawal reactions; abrupt discontinuation or rapid dose reduction may be life-threatening. Taper gradually.'],
  sideEffects: {
    'CNS': ['sedation', 'amnesia', 'dizziness', 'headache'],
    'Cardiovascular': ['hypotension', 'bradycardia'],
    'Respiratory': ['respiratory depression']
  }
},
triazolam: {
  blackBoxWarnings: ['Concomitant use with opioids may result in profound sedation, respiratory depression, coma, and death; reserve concurrent use for patients with inadequate alternatives.', 'Abuse, misuse, and addiction: benzodiazepine use exposes users to risks of abuse, misuse, and addiction, which can lead to overdose or death. Assess risk before prescribing and throughout treatment.', 'Physical dependence and withdrawal reactions; abrupt discontinuation or rapid dose reduction may be life-threatening. Taper gradually.'],
  keyWarnings: ['Complex sleep behaviors including sleep-walking and sleep-driving reported.'],
  sideEffects: {
    'CNS': ['sedation', 'dizziness', 'amnesia', 'headache'],
    'Other': ['dependence', 'rebound insomnia']
  }
},
estazolam: {
  blackBoxWarnings: ['Concomitant use with opioids may result in profound sedation, respiratory depression, coma, and death; reserve concurrent use for patients with inadequate alternatives.', 'Abuse, misuse, and addiction: benzodiazepine use exposes users to risks of abuse, misuse, and addiction, which can lead to overdose or death. Assess risk before prescribing and throughout treatment.', 'Physical dependence and withdrawal reactions; abrupt discontinuation or rapid dose reduction may be life-threatening. Taper gradually.'],
  sideEffects: {
    'CNS': ['sedation', 'dizziness', 'headache', 'memory impairment'],
    'Other': ['dependence', 'rebound insomnia']
  }
},
flurazepam: {
  blackBoxWarnings: ['Concomitant use with opioids may result in profound sedation, respiratory depression, coma, and death; reserve concurrent use for patients with inadequate alternatives.', 'Abuse, misuse, and addiction: benzodiazepine use exposes users to risks of abuse, misuse, and addiction, which can lead to overdose or death. Assess risk before prescribing and throughout treatment.', 'Physical dependence and withdrawal reactions; abrupt discontinuation or rapid dose reduction may be life-threatening. Taper gradually.'],
  sideEffects: {
    'CNS': ['sedation', 'dizziness', 'ataxia', 'memory impairment', 'hangover effect'],
    'Other': ['dependence', 'rebound insomnia']
  }
},

// ── Sleep Agents ─────────────────────────────────────────────────────────────
zolpidem: {
  blackBoxWarnings: ['Complex sleep behaviors including sleep-walking, sleep-driving, and sleep-eating; may result in serious injury or death. Discontinue if complex sleep behavior occurs.'],
  sideEffects: {
    'CNS': ['drowsiness', 'dizziness', 'headache', 'amnesia'],
    'GI': ['nausea'],
    'Other': ['next-day impairment']
  }
},
eszopiclone: {
  blackBoxWarnings: ['Complex sleep behaviors including sleep-walking, sleep-driving, and sleep-eating; may result in serious injury or death. Discontinue if complex sleep behavior occurs.'],
  sideEffects: {
    'CNS': ['headache', 'dizziness', 'somnolence'],
    'GI': ['unpleasant taste', 'dry mouth', 'nausea'],
    'Other': ['next-day impairment']
  }
},
temazepam: {
  blackBoxWarnings: ['Concomitant use with opioids may result in profound sedation, respiratory depression, coma, and death; reserve concurrent use for patients with inadequate alternatives.', 'Abuse, misuse, and addiction: benzodiazepine use exposes users to risks of abuse, misuse, and addiction, which can lead to overdose or death. Assess risk before prescribing and throughout treatment.', 'Physical dependence and withdrawal reactions; abrupt discontinuation or rapid dose reduction may be life-threatening. Taper gradually.'],
  keyWarnings: ['Complex sleep behaviors including sleep-walking and sleep-driving reported.'],
  sideEffects: {
    'CNS': ['sedation', 'dizziness', 'headache', 'memory impairment'],
    'Other': ['dependence', 'rebound insomnia', 'hangover effect']
  }
},
ramelteon: {
  blackBoxWarnings: [],
  sideEffects: {
    'CNS': ['somnolence', 'dizziness', 'headache', 'fatigue'],
    'GI': ['nausea'],
    'Metabolic/Endocrine': ['prolactin elevation']
  }
},
suvorexant: {
  blackBoxWarnings: [],
  keyWarnings: ['Complex sleep behaviors including sleep-walking, sleep-driving, and sleep-eating; may result in serious injury or death. Discontinue if complex sleep behavior occurs.'],
  sideEffects: {
    'CNS': ['somnolence', 'headache', 'dizziness'],
    'Other': ['next-day impairment', 'sleep paralysis']
  }
},
doxylamine: {
  blackBoxWarnings: [],
  sideEffects: {
    'CNS': ['somnolence', 'dizziness', 'headache', 'confusion'],
    'GI': ['dry mouth', 'nausea', 'constipation'],
    'Other': ['anticholinergic effects']
  }
},

// ── Stimulants & Wakefulness Agents ──────────────────────────────────────────
methylphenidate: {
  blackBoxWarnings: ['High potential for abuse and dependence (Schedule II). Assess risk before prescribing and monitor for signs of misuse, abuse, and addiction.'],
  sideEffects: {
    'CNS': ['insomnia', 'nervousness', 'headache', 'tremor', 'dizziness'],
    'Cardiovascular': ['increased heart rate', 'elevated blood pressure', 'palpitations'],
    'GI': ['decreased appetite', 'nausea', 'abdominal pain', 'weight loss'],
    'Other': ['growth suppression in children']
  }
},
dexmethylphenidate: {
  blackBoxWarnings: ['High potential for abuse and dependence (Schedule II). Assess risk before prescribing and monitor for signs of misuse, abuse, and addiction.'],
  sideEffects: {
    'CNS': ['insomnia', 'nervousness', 'headache', 'anxiety'],
    'Cardiovascular': ['increased heart rate', 'elevated blood pressure', 'palpitations'],
    'GI': ['decreased appetite', 'nausea', 'weight loss'],
    'Other': ['growth suppression in children']
  }
},
'amphetamine-mixed-salts': {
  blackBoxWarnings: ['High potential for abuse and dependence (Schedule II). Assess risk before prescribing and monitor for signs of misuse, abuse, and addiction.'],
  keyWarnings: ['Sudden death reported in patients with pre-existing structural cardiac abnormalities; assess cardiac history before initiation.'],
  sideEffects: {
    'CNS': ['insomnia', 'nervousness', 'headache', 'anxiety', 'tremor'],
    'Cardiovascular': ['increased heart rate', 'elevated blood pressure', 'palpitations'],
    'GI': ['decreased appetite', 'dry mouth', 'nausea', 'weight loss'],
    'Other': ['growth suppression in children']
  }
},
dextroamphetamine: {
  blackBoxWarnings: ['High potential for abuse and dependence (Schedule II). Assess risk before prescribing and monitor for signs of misuse, abuse, and addiction.'],
  keyWarnings: ['Sudden death reported in patients with pre-existing structural cardiac abnormalities; assess cardiac history before initiation.'],
  sideEffects: {
    'CNS': ['insomnia', 'nervousness', 'headache', 'anxiety', 'tremor'],
    'Cardiovascular': ['increased heart rate', 'elevated blood pressure', 'palpitations'],
    'GI': ['decreased appetite', 'dry mouth', 'nausea', 'weight loss'],
    'Other': ['growth suppression in children']
  }
},
lisdexamfetamine: {
  blackBoxWarnings: ['High potential for abuse and dependence (Schedule II). Assess risk before prescribing and monitor for signs of misuse, abuse, and addiction.'],
  keyWarnings: ['Sudden death reported in patients with pre-existing structural cardiac abnormalities; assess cardiac history before initiation.'],
  sideEffects: {
    'CNS': ['insomnia', 'nervousness', 'headache', 'anxiety', 'irritability'],
    'Cardiovascular': ['increased heart rate', 'elevated blood pressure', 'palpitations'],
    'GI': ['decreased appetite', 'dry mouth', 'nausea', 'weight loss'],
    'Other': ['growth suppression in children']
  }
},
modafinil: {
  blackBoxWarnings: [],
  keyWarnings: ['Serious dermatologic reactions including SJS and TEN reported; discontinue at first sign of rash.', 'Weak CYP3A4 inducer: steroidal contraceptives may be less effective during treatment and for 1 month after stopping; use an alternative or additional method.'],
  sideEffects: {
    'CNS': ['headache', 'insomnia', 'nervousness', 'dizziness', 'anxiety'],
    'Cardiovascular': ['elevated blood pressure', 'palpitations'],
    'GI': ['nausea', 'anorexia', 'dry mouth'],
    'Other': ['rhinitis']
  }
},
armodafinil: {
  blackBoxWarnings: [],
  keyWarnings: ['Serious dermatologic reactions including SJS and TEN reported; discontinue at first sign of rash.', 'Weak CYP3A4 inducer: steroidal contraceptives may be less effective during treatment and for 1 month after stopping; use an alternative or additional method.'],
  sideEffects: {
    'CNS': ['headache', 'insomnia', 'dizziness', 'anxiety'],
    'Cardiovascular': ['elevated blood pressure', 'palpitations'],
    'GI': ['nausea', 'dry mouth'],
    'Other': ['rash']
  }
},
solriamfetol: {
  blackBoxWarnings: [],
  sideEffects: {
    'CNS': ['headache', 'insomnia', 'anxiety', 'dizziness'],
    'Cardiovascular': ['increased heart rate', 'elevated blood pressure'],
    'GI': ['nausea', 'decreased appetite', 'dry mouth']
  }
},

// ── Anxiolytics & Other ─────────────────────────────────────────────────────
buspirone: {
  blackBoxWarnings: [],
  sideEffects: {
    'CNS': ['dizziness', 'drowsiness', 'headache', 'nervousness', 'insomnia'],
    'GI': ['nausea'],
    'Other': ['restlessness']
  }
},
hydroxyzine: {
  blackBoxWarnings: [],
  keyWarnings: ['QT prolongation and torsade de pointes (postmarketing): use caution with other QT-prolonging drugs, electrolyte abnormalities, bradycardia, or congenital long QT; elderly at higher risk.'],
  sideEffects: {
    'CNS': ['somnolence', 'dizziness', 'headache'],
    'GI': ['dry mouth'],
    'Other': ['QT prolongation (rare)']
  }
},
diphenhydramine: {
  blackBoxWarnings: [],
  sideEffects: {
    'CNS': ['somnolence', 'dizziness', 'confusion', 'cognitive impairment'],
    'GI': ['dry mouth', 'constipation'],
    'Other': ['urinary retention', 'blurred vision']
  }
},
propranolol: {
  blackBoxWarnings: ['Abrupt cessation may exacerbate angina and precipitate MI in patients with coronary artery disease; taper gradually over 1-2 weeks.'],
  sideEffects: {
    'Cardiovascular': ['bradycardia', 'hypotension', 'heart failure exacerbation'],
    'CNS': ['fatigue', 'dizziness', 'depression'],
    'Respiratory': ['bronchospasm'],
    'Metabolic/Endocrine': ['masking of hypoglycemia symptoms'],
    'GI': ['nausea', 'diarrhea']
  }
},
clonidine: {
  blackBoxWarnings: [],
  keyWarnings: ['Rebound hypertension may occur with abrupt discontinuation; taper gradually.'],
  sideEffects: {
    'Cardiovascular': ['hypotension', 'bradycardia'],
    'CNS': ['sedation', 'dizziness', 'fatigue', 'headache'],
    'GI': ['dry mouth', 'constipation']
  }
},
guanfacine: {
  blackBoxWarnings: [],
  keyWarnings: ['Rebound hypertension may occur with abrupt discontinuation; taper gradually.'],
  sideEffects: {
    'Cardiovascular': ['hypotension', 'bradycardia', 'syncope'],
    'CNS': ['sedation', 'somnolence', 'dizziness', 'fatigue'],
    'GI': ['dry mouth', 'constipation']
  }
},
trihexyphenidyl: {
  blackBoxWarnings: [],
  sideEffects: {
    'CNS': ['dizziness', 'nervousness', 'confusion', 'memory impairment'],
    'GI': ['dry mouth', 'nausea', 'constipation'],
    'Cardiovascular': ['tachycardia'],
    'Other': ['blurred vision', 'urinary retention', 'mydriasis']
  }
},

// ── Added 2026-10-01 (round 4) ───────────────────────────────────────────────
'xanomeline-trospium': {
  blackBoxWarnings: [],
  keyWarnings: ['Contraindicated in urinary retention, gastric retention, untreated narrow-angle glaucoma, and moderate/severe hepatic impairment.', 'Urinary retention risk (trospium); caution in bladder outlet obstruction, BPH, and the elderly.', 'Hepatic: check LFTs and bilirubin at baseline and as indicated; avoid in biliary disease.', 'Increased heart rate: assess at baseline and during treatment.', 'Decreased GI motility (caution in ulcerative colitis, intestinal atony, myasthenia gravis); angioedema (trospium).', 'Strong CYP2D6 inhibitors raise xanomeline exposure — monitor for adverse reactions. Xanomeline transiently inhibits gut CYP3A4 and P-gp; monitor sensitive oral substrates.', 'No boxed warning; no direct D2 blockade (no dementia-mortality class box).'],
  sideEffects: {
    'GI': ['nausea', 'dyspepsia', 'constipation', 'vomiting', 'abdominal pain', 'diarrhea', 'GERD'],
    'Cardiovascular': ['hypertension', 'tachycardia'],
    'CNS': ['dizziness']
  }
},
'olanzapine-samidorphan': {
  blackBoxWarnings: ['Increased mortality in elderly patients with dementia-related psychosis; not approved for this use.'],
  keyWarnings: ['Contraindicated with opioids or during acute opioid withdrawal: samidorphan precipitates withdrawal; opioid-free ≥7 days (short-acting) or ≥14 days (long-acting) before starting.', 'Attempting to overcome opioid blockade (or relapse after stopping) can cause fatal overdose.', 'Olanzapine class warnings: NMS, DRESS, hyperglycemia/dyslipidemia, weight gain (less than olanzapine alone in trials but still monitor), hyperprolactinemia, tardive dyskinesia, orthostasis, leukopenia, seizures, anticholinergic effects.', 'Strong CYP3A4 inducers not recommended; consider olanzapine dose adjustment with strong CYP1A2 inhibitors or inducers (including smoking).'],
  sideEffects: {
    'Metabolic/Endocrine': ['weight gain', 'hyperglycemia', 'dyslipidemia'],
    'CNS': ['somnolence', 'sedation', 'dizziness'],
    'GI': ['dry mouth', 'constipation'],
    'Other': ['headache', 'orthostatic hypotension']
  }
},
lemborexant: {
  blackBoxWarnings: [],
  keyWarnings: ['Contraindicated in narcolepsy.', 'CNS depression and next-day impairment: risk rises if taken with less than a full night (7 h) remaining or with other CNS depressants; caution with driving.', 'Sleep paralysis, hypnagogic/hypnopompic hallucinations, and cataplexy-like symptoms.', 'Complex sleep behaviors (sleepwalking, sleep-driving); discontinue if they occur.', 'Worsening depression or suicidal ideation; caution in compromised respiratory function (OSA, COPD).', 'Schedule IV controlled substance.', 'Avoid with strong or moderate CYP3A inhibitors (max 5 mg with weak inhibitors) and with strong/moderate CYP3A inducers; lowers exposure of CYP2B6 substrates.'],
  sideEffects: {
    'CNS': ['somnolence', 'headache', 'nightmares / abnormal dreams'],
    'Other': ['fatigue']
  }
},
daridorexant: {
  blackBoxWarnings: [],
  keyWarnings: ['Contraindicated in narcolepsy.', 'CNS depression and next-day impairment: risk rises if taken with less than a full night (7 h) remaining or with other CNS depressants; caution with driving.', 'Sleep paralysis, hypnagogic/hypnopompic hallucinations, and cataplexy-like symptoms.', 'Complex sleep behaviors (sleepwalking, sleep-driving); discontinue if they occur.', 'Worsening depression or suicidal ideation; caution in compromised respiratory function (OSA, COPD).', 'Schedule IV controlled substance.', 'Angioedema with pharyngeal involvement has been reported.', 'Avoid with strong CYP3A4 inhibitors (max 25 mg with moderate inhibitors) and with strong/moderate CYP3A4 inducers.'],
  sideEffects: {
    'CNS': ['headache', 'somnolence', 'fatigue', 'dizziness'],
    'GI': ['nausea']
  }
},
atomoxetine: {
  blackBoxWarnings: ['Suicidal thoughts and behaviors: higher rates than placebo in pediatric patients; monitor closely, especially during the first months of treatment and after dose changes.'],
  keyWarnings: ['Contraindicated with MAOIs (within 14 days), narrow-angle glaucoma, pheochromocytoma, and severe cardiovascular disorders.', 'Severe liver injury (rare): stop and do not restart if jaundice or lab evidence of liver injury.', 'Serious cardiovascular events and sudden death in patients with structural cardiac abnormalities; assess cardiac history.', 'Increases blood pressure and heart rate; emergent psychosis or mania (screen for bipolar disorder); priapism; urinary retention; growth suppression in children.', 'CYP2D6 poor metabolizers or strong CYP2D6 inhibitors (fluoxetine, paroxetine, bupropion): raise to target only if symptoms persist after 4 weeks.'],
  sideEffects: {
    'GI': ['nausea', 'vomiting', 'decreased appetite', 'abdominal pain', 'constipation', 'dry mouth'],
    'CNS': ['somnolence', 'fatigue', 'dizziness', 'insomnia'],
    'Sexual': ['erectile dysfunction'],
    'Other': ['urinary hesitation', 'increased heart rate']
  }
},
viloxazine: {
  blackBoxWarnings: ['Suicidal thoughts and behaviors: higher rates than placebo in ADHD trials; monitor closely, especially during the first months of treatment and after dose changes.'],
  keyWarnings: ['Contraindicated with MAOIs (within 14 days) and with sensitive or narrow-therapeutic-range CYP1A2 substrates (e.g., ramelteon, duloxetine, tizanidine, theophylline).', 'Strong CYP1A2 inhibitor; weak CYP2D6 and CYP3A4 inhibitor — monitor and adjust other substrates.', 'Increased heart rate and blood pressure.', 'Activation of mania or hypomania: screen for bipolar disorder before starting.', 'Somnolence and fatigue: caution with driving.'],
  sideEffects: {
    'CNS': ['somnolence', 'headache', 'insomnia', 'fatigue', 'irritability'],
    'GI': ['decreased appetite', 'nausea', 'vomiting', 'dry mouth', 'constipation']
  }
},
valbenazine: {
  blackBoxWarnings: ['Depression and suicidality in patients with Huntington\'s disease: increases the risk of depression and suicidal thoughts and behavior; balance risks with clinical need, monitor for emergent or worsening depression, and inform patients and caregivers.'],
  keyWarnings: ['Somnolence and sedation.', 'QT prolongation: avoid in congenital long QT or arrhythmias with prolonged QT; higher exposure in CYP2D6 poor metabolizers or with strong CYP2D6/3A4 inhibitors (use 40 mg).', 'Neuroleptic malignant syndrome; parkinsonism.', 'Avoid MAOIs; strong CYP3A4 inducers not recommended; may raise digoxin levels (P-gp).'],
  sideEffects: {
    'CNS': ['somnolence', 'balance disorders / falls', 'headache', 'akathisia'],
    'GI': ['dry mouth', 'nausea', 'vomiting'],
    'Other': ['arthralgia']
  }
},
deutetrabenazine: {
  blackBoxWarnings: ['Depression and suicidality in patients with Huntington\'s disease: increases the risk of depression and suicidal thoughts and behavior; balance risks with clinical need, monitor for emergent or worsening depression, and inform patients and caregivers.'],
  keyWarnings: ['Contraindicated: suicidal patients or untreated/inadequately treated depression (Huntington\'s disease), hepatic impairment, MAOIs (within 14 days), reserpine (within 20 days), tetrabenazine, or valbenazine.', 'QT prolongation: avoid in congenital long QT or arrhythmias with prolonged QT.', 'Neuroleptic malignant syndrome; akathisia, agitation, restlessness; parkinsonism; sedation.', 'Max 36 mg/day with strong CYP2D6 inhibitors or in CYP2D6 poor metabolizers.'],
  sideEffects: {
    'CNS': ['somnolence', 'insomnia', 'depression', 'akathisia', 'anxiety'],
    'GI': ['diarrhea', 'dry mouth', 'constipation'],
    'Other': ['fatigue', 'nasopharyngitis']
  }
},
naltrexone: {
  blackBoxWarnings: [],
  keyWarnings: ['Contraindicated with opioid analgesics, current physiologic opioid dependence, acute opioid withdrawal, or a failed naloxone challenge / positive opioid screen.', 'Precipitated opioid withdrawal: opioid-free for 7–10 days first (longer after methadone or buprenorphine).', 'Vulnerability to opioid overdose after stopping, missing a dose, or trying to overcome the blockade.', 'Hepatotoxicity (oral boxed warning removed in 2013): monitor LFTs; caution in liver disease.', 'Injection-site reactions with Vivitrol (some requiring surgery); monitor for depression and suicidality.'],
  sideEffects: {
    'GI': ['nausea', 'vomiting', 'abdominal pain', 'decreased appetite'],
    'CNS': ['headache', 'dizziness', 'insomnia', 'anxiety'],
    'Other': ['fatigue', 'injection-site reactions (Vivitrol)']
  }
},
buprenorphine: {
  blackBoxWarnings: [],
  keyWarnings: ['Sublocade (ER injection) boxed warning: serious harm or death with intravenous self-administration (forms a solid depot); available only through a restricted REMS. SL and buccal products have no boxed warning.', 'Respiratory and CNS depression, especially with benzodiazepines, alcohol, or other CNS depressants — do not withhold OUD treatment, but taper/monitor and co-prescribe naloxone.', 'Precipitated withdrawal if started before objective withdrawal; neonatal opioid withdrawal syndrome with use in pregnancy.', 'Hepatitis and hepatic events (monitor LFTs); adrenal insufficiency; accidental pediatric exposure can be fatal.', 'Dental problems (caries, tooth loss) with SL/buccal products; QT prolongation minimal at therapeutic doses (≤15 ms) — caution with other risk factors.'],
  sideEffects: {
    'CNS': ['headache', 'insomnia', 'sedation'],
    'GI': ['nausea', 'constipation', 'vomiting'],
    'Other': ['sweating', 'withdrawal symptoms', 'oral hypoesthesia (film)', 'dental problems']
  }
}

};

// ─── Administration & Counseling ("How to Take") ───────────────────────────
// Concise per-drug guidance: food, timing, and 1–3 counseling pearls.
// Sources: FDA labeling (DailyMed) + standard prescribing references.
const ADMINISTRATION_DATA = {
  "fluoxetine": { food: "With or without food", timing: "Morning", pearls: ["Long half-life makes an occasional missed dose low-risk for discontinuation symptoms.", "Can be activating — morning dosing helps limit insomnia."] },
  "sertraline": { food: "With food", timing: "Morning", pearls: ["Taking with food improves absorption and reduces nausea.", "Oral concentrate must be diluted in ~4 oz of water or juice immediately before taking."] },
  "escitalopram": { food: "With or without food", timing: "Any consistent time", pearls: ["Well tolerated; choose morning vs. evening based on whether it is activating or sedating for the patient."] },
  "paroxetine": { food: "With or without food", timing: "Morning", pearls: ["Take with food if GI upset occurs; swallow CR tablets whole.", "Do not stop abruptly — high discontinuation-syndrome risk; taper slowly."] },
  "citalopram": { food: "With or without food", timing: "Any consistent time", pearls: ["Dose-dependent QT prolongation — max 40 mg/day (20 mg if >60 yr, hepatic impairment, or CYP2C19 poor metabolizer)."] },
  "fluvoxamine": { food: "With or without food", timing: "Bedtime", pearls: ["Often dosed at bedtime because it is sedating.", "Divide doses >100 mg/day into BID."] },
  "venlafaxine": { food: "With food", timing: "Morning", pearls: ["Take with food to reduce nausea; swallow XR whole or sprinkle on applesauce (do not chew).", "Taper to stop — notable discontinuation syndrome; can raise blood pressure at higher doses."] },
  "duloxetine": { food: "With or without food", timing: "Any consistent time", pearls: ["Swallow whole; do not crush, chew, or open the delayed-release capsule.", "Avoid in significant hepatic impairment or heavy alcohol use."] },
  "desvenlafaxine": { food: "With or without food", timing: "Any consistent time", pearls: ["Swallow whole; an empty tablet shell may appear in the stool — this is expected."] },
  "milnacipran": { food: "With or without food", timing: "Morning (BID)", pearls: ["Take with food if nausea occurs.", "Dosed twice daily; give the second dose earlier in the day to limit insomnia."] },
  "levomilnacipran": { food: "With or without food", timing: "Any consistent time", pearls: ["Swallow the ER capsule whole; do not open, chew, or crush."] },
  "vortioxetine": { food: "With or without food", timing: "Any consistent time", pearls: ["Nausea is the most common early effect and usually improves over 1–2 weeks; taking with food can help."] },
  "gepirone": { food: "With food", timing: "Any consistent time", pearls: ["Extended-release — take consistently with regard to food and swallow whole."] },
  "amitriptyline": { food: "With or without food", timing: "Bedtime", pearls: ["Sedating and anticholinergic — dose at bedtime.", "Highly toxic in overdose — limit quantity dispensed in at-risk patients."] },
  "nortriptyline": { food: "With or without food", timing: "Bedtime", pearls: ["Less sedating and anticholinergic than amitriptyline.", "Therapeutic level 50–150 ng/mL — useful for dose guidance."] },
  "imipramine": { food: "With or without food", timing: "Bedtime", pearls: ["Take with food to reduce GI upset.", "Toxic in overdose — limit quantity dispensed in at-risk patients."] },
  "doxepin": { food: "With or without food", timing: "Bedtime", pearls: ["Low doses (3–6 mg) are used for insomnia — take 30 min before bed with ≥7 hr available for sleep.", "At hypnotic doses, avoid taking within 3 hr of a meal (delays onset)."] },
  "phenelzine": { food: "With or without food", timing: "Morning (BID)", pearls: ["Strict low-tyramine diet required — avoid aged cheeses, cured/fermented foods, and tap/draft beer.", "Avoid sympathomimetics and serotonergic drugs; observe washout when switching (5 weeks from fluoxetine)."] },
  "tranylcypromine": { food: "With or without food", timing: "Morning", pearls: ["Low-tyramine diet required.", "More activating — avoid evening dosing to limit insomnia; observe washout periods when switching antidepressants."] },
  "bupropion": { food: "With or without food", timing: "Morning (avoid late day)", pearls: ["Take XL once each morning; SR twice daily with the second dose by mid-afternoon to limit insomnia.", "Swallow whole — do not crush or chew (dose-dumping raises seizure risk).", "Lowers seizure threshold; contraindicated in eating disorders and seizure disorder."] },
  "mirtazapine": { food: "With or without food", timing: "Bedtime", pearls: ["More sedating at LOWER doses (stronger antihistamine effect); sedation often eases as the dose increases.", "Take at bedtime; commonly increases appetite and weight."] },
  "trazodone": { food: "With food", timing: "Bedtime", pearls: ["Take with a snack or meal to reduce dizziness and improve absorption.", "Useful for sleep due to sedation; counsel to seek care for any erection lasting >4 hr (priapism)."] },
  "vilazodone": { food: "With food — required", timing: "Any consistent time", pearls: ["MUST be taken with food — absorption drops ~50% on an empty stomach, reducing efficacy.", "Titrate over ≥1 week to reduce GI effects."] },
  "haloperidol": { food: "With or without food", timing: "Divided / daily", pearls: ["Dilute the oral concentrate in water or juice (not coffee or tea).", "Monitor for EPS and akathisia; a long-acting decanoate depot is available for adherence."] },
  "chlorpromazine": { food: "With or without food", timing: "Divided / bedtime", pearls: ["Sedating and hypotensive — advise rising slowly.", "Causes photosensitivity — recommend sunscreen; dilute the oral concentrate before use."] },
  "fluphenazine": { food: "With or without food", timing: "Divided", pearls: ["Dilute the oral concentrate (avoid caffeinated drinks, tannic-acid teas, and apple juice).", "A decanoate IM depot is available."] },
  "trifluoperazine": { food: "With or without food", timing: "Divided", pearls: ["Take with food if GI upset occurs; monitor for EPS."] },
  "perphenazine": { food: "With or without food", timing: "Divided", pearls: ["Mid-potency FGA; dilute the oral concentrate before use."] },
  "thiothixene": { food: "With or without food", timing: "Bedtime or divided", pearls: ["Take with food to reduce GI upset; monitor for EPS."] },
  "pimozide": { food: "With or without food", timing: "Any consistent time", pearls: ["QT prolongation — obtain baseline and periodic ECGs; avoid CYP3A4/CYP2D6 inhibitors and grapefruit juice."] },
  "thioridazine": { food: "With food", timing: "Divided", pearls: ["Boxed warning for dose-dependent QT prolongation — reserved for refractory cases with ECG monitoring."] },
  "loxapine": { food: "With or without food", timing: "Divided", pearls: ["Oral form with or without food; the inhaled form is a single supervised dose (bronchospasm risk, REMS)."] },
  "molindone": { food: "With or without food", timing: "Divided", pearls: ["Take with food if GI upset occurs; relatively weight-neutral among antipsychotics."] },
  "risperidone": { food: "With or without food", timing: "Any (often evening)", pearls: ["Oral solution can be mixed with water, coffee, orange juice, or low-fat milk (not cola or tea).", "Prolactin elevation is common; long-acting injectables are available."] },
  "olanzapine": { food: "With or without food", timing: "Bedtime", pearls: ["Sedating — usually dosed at night; the orally disintegrating tablet dissolves on the tongue.", "High metabolic risk — monitor weight, glucose, and lipids; never give IM olanzapine with IV benzodiazepines."] },
  "quetiapine": { food: "XR without food or with a light snack", timing: "Bedtime", pearls: ["IR is sedating — dose at bedtime; take XR without food or with a light meal (≤300 kcal) to avoid raised peak levels.", "Swallow XR tablets whole."] },
  "aripiprazole": { food: "With or without food", timing: "Morning", pearls: ["Can be activating and cause akathisia — morning dosing is preferred.", "Counsel about rare impulse-control behaviors (gambling, hypersexuality)."] },
  "clozapine": { food: "With or without food", timing: "Divided / bedtime", pearls: ["Requires ANC monitoring for severe neutropenia per label (REMS eliminated 2025); titrate slowly (orthostasis, sedation, seizures).", "Smoking cessation raises levels — reassess dose; monitor bowel function (constipation can be severe)."] },
  "ziprasidone": { food: "With food — required (≥500 kcal)", timing: "Morning and evening (BID)", pearls: ["MUST be taken with a meal of ≥500 kcal — food doubles absorption; empty-stomach dosing can halve levels and efficacy.", "Obtain baseline and periodic ECGs (QT)."] },
  "lurasidone": { food: "With food — required (≥350 kcal)", timing: "Evening", pearls: ["Take with a meal of at least 350 kcal — absorption roughly doubles with food.", "Avoid strong CYP3A4 inhibitors/inducers and grapefruit."] },
  "asenapine": { food: "Sublingual — no food or drink for 10 min", timing: "BID", pearls: ["Place under the tongue and let it dissolve; do NOT swallow, chew, or crush, and avoid eating/drinking for 10 minutes.", "Transient oral numbness is common; a transdermal patch (Secuado) is an alternative."] },
  "paliperidone": { food: "With food recommended (ER)", timing: "Morning", pearls: ["Take Invega ER consistently — with breakfast is recommended (food increases absorption); swallow whole (the OROS shell passes in stool).", "Long-acting IM depots are available."] },
  "iloperidone": { food: "With or without food", timing: "BID", pearls: ["Titrate slowly to limit orthostatic hypotension.", "QT prolongation — avoid combining with other QT-prolonging drugs."] },
  "brexpiprazole": { food: "With or without food", timing: "Any consistent time", pearls: ["Lower akathisia than aripiprazole; still counsel about impulse-control behaviors.", "Reduce dose for CYP2D6 poor metabolizers and strong inhibitors."] },
  "cariprazine": { food: "With or without food", timing: "Any consistent time", pearls: ["Very long-acting active metabolites (weeks) — effects and side effects shift slowly after dose changes.", "Akathisia is common."] },
  "lumateperone": { food: "With or without food", timing: "Bedtime", pearls: ["Often dosed at night due to sedation; swallow the capsule whole.", "Avoid CYP3A4 inducers and strong inhibitors."] },
  "pimavanserin": { food: "With or without food", timing: "Any consistent time", pearls: ["For Parkinson disease psychosis; no dopamine blockade, so no worsening of motor symptoms.", "QT prolongation — avoid other QT-prolonging agents; benefit builds over weeks."] },
  "lithium": { food: "With food", timing: "Divided (bedtime for ER)", pearls: ["Take with food or after meals to reduce GI upset.", "Keep salt and fluid intake steady — dehydration, NSAIDs, ACE inhibitors, and thiazides raise levels.", "Check levels 12 hr post-dose; narrow therapeutic index."] },
  "valproate": { food: "With food", timing: "Divided / bedtime", pearls: ["Take with food to reduce GI upset; swallow DR/ER whole (sprinkle capsules may be opened onto soft food).", "Teratogen (neural tube defects) — avoid in pregnancy or those who may conceive; monitor LFTs, platelets, and ammonia."] },
  "lamotrigine": { food: "With or without food", timing: "Any consistent time", pearls: ["Titrate slowly per the starter kit — rapid escalation raises serious-rash (SJS) risk.", "Valproate roughly doubles levels (use a lower titration); estrogen-containing contraceptives lower levels."] },
  "carbamazepine": { food: "With food", timing: "Divided", pearls: ["Take with food to reduce GI upset; swallow ER forms whole.", "Autoinduces its own metabolism (levels fall over the first weeks) and is a strong CYP3A4 inducer with many interactions.", "Consider HLA-B*1502 testing in at-risk ancestries (SJS); monitor CBC and sodium."] },
  "oxcarbazepine": { food: "With or without food", timing: "BID", pearls: ["Fewer interactions than carbamazepine but still an inducer; watch for hyponatremia.", "Cross-reactive rash is possible in carbamazepine-allergic patients."] },
  "topiramate": { food: "With or without food", timing: "BID", pearls: ["Titrate slowly to reduce cognitive/word-finding effects and paresthesias.", "Stay hydrated (kidney-stone risk); can cause metabolic acidosis and lowers contraceptive efficacy at higher doses."] },
  "gabapentin": { food: "With or without food", timing: "TID / bedtime", pearls: ["Separate from antacids by ≥2 hours (they reduce absorption).", "Absorption is saturable — higher single doses are absorbed less efficiently; taper to stop and reduce dose in renal impairment."] },
  "zolpidem": { food: "Empty stomach — required", timing: "Bedtime", pearls: ["Take on an empty stomach right before bed — food delays onset.", "Only take with ≥7–8 hr available for sleep; use the lower dose in women and older adults (next-morning impairment).", "Complex sleep behaviors (sleep-driving) can occur."] },
  "eszopiclone": { food: "Empty stomach", timing: "Bedtime", pearls: ["Do not take with or right after a high-fat meal (delays onset).", "A metallic/bitter taste is common; ensure ≥7–8 hr in bed."] },
  "temazepam": { food: "With or without food", timing: "Bedtime", pearls: ["Take ~30 min before bed with ≥7–8 hr available for sleep.", "Sedation and fall risk — use cautiously in older adults."] },
  "ramelteon": { food: "Empty stomach — avoid fatty meals", timing: "Bedtime", pearls: ["Do NOT take with or after a high-fat meal — it markedly delays and reduces absorption.", "Take within 30 min of bedtime; non-scheduled with no abuse potential."] },
  "suvorexant": { food: "Empty stomach for faster onset", timing: "Within 30 min of bed", pearls: ["Take within 30 min of bedtime with ≥7 hr remaining; onset is delayed if taken with or soon after a meal.", "Watch for next-morning somnolence and rare sleep paralysis."] },
  "esketamine": { food: "Intranasal — in-clinic (REMS)", timing: "In-clinic, monitored", pearls: ["Avoid food for ≥2 hr and liquids for ≥30 min before dosing to limit nausea.", "Given under REMS with ≥2 hr monitoring; do not drive until the next day after restful sleep."] },
  "brexanolone": { food: "IV infusion — inpatient (REMS)", timing: "Continuous 60-hr infusion", pearls: ["Discontinued: Sage stopped marketing Zulresso at the end of 2024; oral zuranolone (Zurzuvae) is the available neuroactive-steroid option for postpartum depression.", "Administered as a continuous 60-hour IV infusion with monitoring for excessive sedation or sudden loss of consciousness (REMS)."] },
  "zuranolone": { food: "With a fat-containing meal", timing: "Evening", pearls: ["Take in the evening with a fat-containing meal to ensure absorption.", "14-day course; do not drive within 12 hr of each dose (CNS depression)."] },
  "dextromethorphan-bupropion": { food: "With or without food", timing: "Morning and evening (≥8 hr apart)", pearls: ["Swallow whole and space the two daily doses at least 8 hours apart; no more than 2 tablets in 24 hr.", "Contains bupropion — mind the seizure threshold and drug interactions."] },
  "alprazolam": { food: "With or without food", timing: "As prescribed", pearls: ["Short-acting with interdose rebound anxiety — the XR form smooths this; swallow XR whole.", "High dependence/withdrawal potential — do not stop abruptly."] },
  "clonazepam": { food: "With or without food", timing: "Divided", pearls: ["Longer-acting — provides smoother coverage for panic and anxiety.", "An orally disintegrating wafer is available; taper to discontinue."] },
  "diazepam": { food: "With or without food", timing: "As prescribed", pearls: ["Long half-life with active metabolites — accumulates in older adults and hepatic impairment.", "Rapid onset; taper slowly after chronic use."] },
  "lorazepam": { food: "With or without food", timing: "Divided", pearls: ["No active metabolites and glucuronidated — preferred in hepatic impairment and older adults.", "Reliable IM absorption; taper to stop."] },
  "oxazepam": { food: "With or without food", timing: "Divided", pearls: ["Slow onset and no active metabolites — lower abuse appeal and safer in hepatic impairment and the elderly."] },
  "chlordiazepoxide": { food: "With or without food", timing: "Divided", pearls: ["Long-acting — commonly used for alcohol withdrawal; accumulates in the elderly and hepatic impairment."] },
  "clorazepate": { food: "With or without food", timing: "Divided", pearls: ["Prodrug converted to long-acting desmethyldiazepam; avoid taking antacids at the same time (they reduce conversion)."] },
  "midazolam": { food: "Not for outpatient self-administration", timing: "Procedural / monitored", pearls: ["Short-acting — used for procedural sedation and acute agitation in monitored settings (respiratory depression risk)."] },
  "triazolam": { food: "Empty stomach", timing: "Bedtime", pearls: ["Very short-acting — take right at bedtime with ≥7–8 hr for sleep; avoid grapefruit and CYP3A4 inhibitors.", "Anterograde amnesia can occur."] },
  "estazolam": { food: "Empty stomach", timing: "Bedtime", pearls: ["Intermediate-acting hypnotic — take right before bed; high-fat meals slow onset."] },
  "flurazepam": { food: "With or without food", timing: "Bedtime", pearls: ["Very long-acting with active metabolites — daytime carryover and accumulation, especially in older adults (avoid)."] },
  "buspirone": { food: "Consistent with regard to food", timing: "BID–TID", pearls: ["Take consistently — always with food or always without (food raises levels).", "Avoid grapefruit juice; anxiolytic effect builds over 1–2 weeks and is not suitable for PRN/acute use."] },
  "pregabalin": { food: "With or without food", timing: "BID–TID", pearls: ["Schedule V — euphoria and misuse are possible; taper to stop.", "Renally cleared — reduce dose in renal impairment; watch for dose-dependent edema and sedation."] },
  "propranolol": { food: "With or without food (be consistent)", timing: "As prescribed", pearls: ["Take consistently with respect to food; used for performance anxiety, tremor, and akathisia.", "Do not stop abruptly (rebound); use caution in asthma, bradycardia, and diabetes (masks hypoglycemia)."] },
  "clonidine": { food: "With or without food", timing: "Bedtime (sedation)", pearls: ["Do not stop abruptly — rebound hypertension; taper off.", "Swallow ER tablets whole; sedation and dry mouth are common."] },
  "guanfacine": { food: "With or without food (avoid high-fat meals for ER)", timing: "Bedtime or morning", pearls: ["Swallow ER whole and do NOT give with a high-fat meal (raises levels).", "Less sedating than clonidine; taper to stop."] },
  "doxylamine": { food: "With or without food", timing: "Bedtime", pearls: ["OTC antihistamine hypnotic — strongly anticholinergic; avoid routine use in older adults.", "Tolerance to the sedating effect develops within days."] },
  "hydroxyzine": { food: "With or without food", timing: "As needed / divided", pearls: ["Non-scheduled anxiolytic and antipruritic; sedating and anticholinergic.", "QT prolongation at higher doses — use caution with other QT drugs and in the elderly."] },
  "diphenhydramine": { food: "With or without food", timing: "Bedtime (for sleep)", pearls: ["Strongly anticholinergic — avoid for routine sleep in older adults (confusion, falls, urinary retention).", "Tolerance to the sedating effect develops quickly."] },
  "trihexyphenidyl": { food: "With or without food (be consistent)", timing: "Divided", pearls: ["For drug-induced parkinsonism/dystonia; take with food if GI upset, or before meals if dry mouth interferes with eating.", "Strongly anticholinergic — avoid in the elderly and in tardive dyskinesia; can impair memory."] },
  "methylphenidate": { food: "With or without food", timing: "Morning (+ midday for IR)", pearls: ["Give long-acting forms in the morning; short-acting may need a midday dose — avoid late-day dosing (insomnia).", "Do not crush ER forms; some capsules may be opened and sprinkled on applesauce.", "Monitor blood pressure, heart rate, appetite, sleep, and (in youth) growth."] },
  "dexmethylphenidate": { food: "With or without food", timing: "Morning", pearls: ["The ER capsule may be opened and sprinkled on applesauce.", "Avoid late-day dosing to protect sleep."] },
  "amphetamine-mixed-salts": { food: "With or without food", timing: "Morning", pearls: ["Avoid taking with vitamin C / acidic juices or urinary acidifiers (they reduce absorption and levels).", "Swallow XR whole or sprinkle on applesauce; avoid late-day dosing.", "Schedule II — monitor for misuse, blood pressure, heart rate, sleep, and appetite."] },
  "dextroamphetamine": { food: "With or without food", timing: "Morning (+ early afternoon if needed)", pearls: ["Avoid acidic foods and juices near dosing.", "Short-acting may need a second early-afternoon dose; avoid late dosing."] },
  "lisdexamfetamine": { food: "With or without food", timing: "Morning", pearls: ["Prodrug activated after absorption — smoother, lower-abuse profile; may be taken whole or the capsule contents dissolved in water/yogurt and consumed immediately.", "Also approved for binge-eating disorder."] },
  "modafinil": { food: "With or without food", timing: "Morning", pearls: ["Take in the morning (or before a shift for shift-work disorder).", "Reduces the efficacy of estrogen-containing contraceptives — advise an additional or alternative method."] },
  "armodafinil": { food: "With or without food", timing: "Morning", pearls: ["Longer-acting R-enantiomer of modafinil — morning dosing.", "Lowers hormonal-contraceptive efficacy — advise a backup method."] },
  "solriamfetol": { food: "On waking; avoid near bedtime", timing: "Morning", pearls: ["Take on waking and avoid dosing within 9 hours of bedtime (insomnia).", "Monitor blood pressure and heart rate; reduce dose in renal impairment."] },
  "xanomeline-trospium": { food: "Empty stomach: ≥1 h before or ≥2 h after a meal", timing: "Twice daily", pearls: ["Do not open capsules; taking with food increases nausea and GI effects.", "Check LFTs/bilirubin and heart rate at baseline; ask about urinary retention, constipation, and glaucoma."] },
  "olanzapine-samidorphan": { food: "With or without food", timing: "Once daily", pearls: ["Do not split or crush tablets.", "Must be opioid-free ≥7 days (short-acting) or ≥14 days (long-acting) first; carry a wallet card about opioid blockade."] },
  "lemborexant": { food: "Food delays onset — take on an empty stomach for faster effect", timing: "Immediately before bed", pearls: ["Take only with ≥7 hours available for sleep; next-morning impairment is possible, especially at 10 mg.", "Avoid moderate/strong CYP3A inhibitors and inducers; max 5 mg with weak inhibitors."] },
  "daridorexant": { food: "A high-fat meal delays onset (~1.3 h)", timing: "Within 30 min of bedtime", pearls: ["Take only with ≥7 hours available for sleep.", "Max 25 mg with moderate CYP3A4 inhibitors; avoid strong inhibitors and inducers."] },
  "atomoxetine": { food: "With or without food (food may reduce nausea)", timing: "Once daily (morning) or divided BID", pearls: ["Do not open capsules (eye irritant).", "Full effect may take 4–6 weeks; check BP/HR and screen for bipolar disorder first."] },
  "viloxazine": { food: "With or without food", timing: "Once daily", pearls: ["Swallow whole or sprinkle on a spoonful of applesauce (eat within 2 h); do not chew.", "Strong CYP1A2 inhibitor: avoid ramelteon, duloxetine, tizanidine, theophylline; caffeine levels rise."] },
  "valbenazine": { food: "With or without food", timing: "Once daily", pearls: ["Sprinkle capsules can be opened onto soft food.", "40 mg max with strong CYP3A4/CYP2D6 inhibitors or in CYP2D6 poor metabolizers; review QT risk factors."] },
  "deutetrabenazine": { food: "IR with food; XR with or without food", timing: "IR twice daily; XR once daily", pearls: ["Swallow tablets whole; do not crush or chew.", "Switching from tetrabenazine: stop tetrabenazine and start deutetrabenazine the next day at the conversion dose."] },
  "naltrexone": { food: "With or without food (food may reduce nausea)", timing: "Once daily (oral) or every 4 weeks (IM)", pearls: ["Must be opioid-free 7–10 days first (longer after methadone/buprenorphine); consider a naloxone challenge.", "Opioid analgesics will be blocked; overdose risk is high if opioids are used after stopping or to overcome blockade."] },
  "buprenorphine": { food: "Dissolve under the tongue or buccally — do not chew or swallow", timing: "Once daily", pearls: ["Start only when objective withdrawal is present (e.g., COWS ≥8–12) to avoid precipitated withdrawal.", "After it dissolves, swish water and swallow; wait 1 h before brushing (dental problems). Co-prescribe naloxone."] }
};

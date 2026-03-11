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

const RECEPTOR_LIST = ['SERT','NET','DAT','5HT1A','5HT2A','5HT2C','D1','D2','D3','H1','alpha1','alpha2','M1'];
const P450_ENZYMES  = ['CYP1A2','CYP2B6','CYP2C9','CYP2C19','CYP2D6','CYP3A4'];

// ── Perinatal Safety Data ──────────────────────────────────────────────────
// pregnancy.fdaCategory: historical FDA letter category (A/B/C/D/X) — still widely used clinically
// pregnancy.risk: 'low' | 'caution' | 'avoid' | 'unknown'  (used for sorting/color)
// breastfeeding.hale: Hale's Lactation Risk Category L1–L5 or 'unknown'
// breastfeeding.risk: 'low' | 'caution' | 'avoid' | 'unknown'
// Sources: FDA labels, LactMed, Hale's Medications & Mothers' Milk, Briggs Drugs in Pregnancy & Lactation
const PERINATAL_DATA = {
  // SSRIs
  fluoxetine:           { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'PPHN risk with late 3rd-trimester use. Neonatal adaptation syndrome. Generally weigh benefit vs. risk.' }, breastfeeding: { hale: 'L2', risk: 'low', notes: 'Detectable in milk; long half-life of norfluoxetine. Monitor infant for sedation. Many prefer sertraline.' } },
  sertraline:           { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Most studied SSRI in pregnancy. Neonatal adaptation syndrome possible. Preferred SSRI if treatment needed.' }, breastfeeding: { hale: 'L2', risk: 'low', notes: 'Preferred SSRI during breastfeeding. Low milk-to-plasma ratio; minimal infant exposure.' } },
  escitalopram:         { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Limited data vs. citalopram; cardiac defect risk signal weaker. Neonatal adaptation syndrome.' }, breastfeeding: { hale: 'L2', risk: 'low', notes: 'Low relative infant dose. Generally considered compatible with monitoring.' } },
  paroxetine:           { pregnancy: { fdaCategory: 'D', risk: 'avoid',   notes: 'Category D — associated with cardiac septal defects (OR ~1.5–2.0). Avoid in 1st trimester; switch if planning pregnancy.' }, breastfeeding: { hale: 'L2', risk: 'low', notes: 'Low milk transfer. Compatible if clinically needed, though cardiac risk in pregnancy limits broader use.' } },
  citalopram:           { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Cardiac malformation signal at high doses (>40 mg). Neonatal adaptation syndrome. Use lowest effective dose.' }, breastfeeding: { hale: 'L2', risk: 'low', notes: 'Higher milk-to-plasma ratio than sertraline. Monitor infant; sertraline preferred.' } },
  fluvoxamine:          { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Limited human data; animal studies reassuring. Neonatal adaptation syndrome. CYP interactions may complicate dosing.' }, breastfeeding: { hale: 'L2', risk: 'low', notes: 'Low infant relative dose. Compatible with monitoring.' } },
  // SNRIs
  venlafaxine:          { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Neonatal adaptation syndrome common; PPHN risk similar to SSRIs. Abrupt discontinuation in neonate causes withdrawal.' }, breastfeeding: { hale: 'L3', risk: 'caution', notes: 'O-desmethylvenlafaxine accumulates in milk. Monitor infant for agitation, poor feeding.' } },
  duloxetine:           { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Neonatal adaptation syndrome. Some pain-indication data. Avoid abrupt cessation near term.' }, breastfeeding: { hale: 'L3', risk: 'caution', notes: 'Low relative infant dose but limited safety data. Use with monitoring.' } },
  desvenlafaxine:       { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Active metabolite of venlafaxine. Neonatal adaptation syndrome risk. Limited specific data.' }, breastfeeding: { hale: 'L3', risk: 'caution', notes: 'Excreted in breast milk. Insufficient long-term infant safety data.' } },
  milnacipran:          { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Very limited human pregnancy data. Approved for fibromyalgia, not MDD. Avoid unless clearly necessary.' }, breastfeeding: { hale: 'unknown', risk: 'unknown', notes: 'Insufficient human data. Avoid unless no alternative.' } },
  levomilnacipran:      { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Active enantiomer of milnacipran. Very limited pregnancy data.' }, breastfeeding: { hale: 'unknown', risk: 'unknown', notes: 'No human lactation data available.' } },
  // TCAs
  amitriptyline:        { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Neonatal withdrawal, tachycardia. Limb reduction defects debated. Use lowest dose; avoid near term if possible.' }, breastfeeding: { hale: 'L2', risk: 'low', notes: 'Low infant serum levels in most studies. Monitor for sedation.' } },
  nortriptyline:        { pregnancy: { fdaCategory: 'D', risk: 'avoid',   notes: 'Category D. Neonatal withdrawal, urinary retention. Preferred TCA if TCA is necessary during breastfeeding but caution in pregnancy.' }, breastfeeding: { hale: 'L2', risk: 'low', notes: 'Preferred TCA during breastfeeding; low relative infant dose.' } },
  imipramine:           { pregnancy: { fdaCategory: 'D', risk: 'avoid',   notes: 'Category D. Neonatal withdrawal symptoms. Limb/cardiovascular defect signal; avoid in 1st trimester.' }, breastfeeding: { hale: 'L2', risk: 'low', notes: 'Low milk transfer. Monitor infant for sedation.' } },
  doxepin:              { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Limited data at psychiatric doses. Topical formulation considered safer.' }, breastfeeding: { hale: 'L5', risk: 'avoid',   notes: 'Avoid — case reports of infant respiratory depression and sedation. Contraindicated during breastfeeding.' } },
  // MAOIs
  phenelzine:           { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Very limited human data. MAO inhibition may affect fetal development. Avoid if alternatives exist.' }, breastfeeding: { hale: 'unknown', risk: 'avoid', notes: 'No human lactation data. MAO inhibitor class — avoid due to unknown neonatal risk.' } },
  tranylcypromine:      { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Stimulant properties; vasoconstriction risk. Very limited data. Avoid if possible.' }, breastfeeding: { hale: 'unknown', risk: 'avoid', notes: 'No human lactation data. Avoid.' } },
  // Other antidepressants
  bupropion:            { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Some signal for cardiac defects at high doses (disputed). Commonly used for depression/smoking cessation. Neonatal seizure risk at high doses.' }, breastfeeding: { hale: 'L3', risk: 'caution', notes: 'Hydroxybupropion accumulates in milk. Case report of infant seizure. Use caution; monitor infant.' } },
  mirtazapine:          { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Commonly used off-label for hyperemesis gravidarum. Limited but generally reassuring data for short-term use.' }, breastfeeding: { hale: 'L3', risk: 'caution', notes: 'Detected in milk at low levels. Sedation possible. Monitor infant.' } },
  trazodone:            { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Limited human data. Animal studies show no teratogenicity. Commonly used at low doses for insomnia.' }, breastfeeding: { hale: 'L2', risk: 'low', notes: 'Low relative infant dose. Generally considered compatible at low doses.' } },
  vilazodone:           { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Limited human data. SSRI-like neonatal adaptation risk.' }, breastfeeding: { hale: 'unknown', risk: 'unknown', notes: 'No published human lactation data. Avoid if alternatives exist.' } },
  vortioxetine:         { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Limited human data. Novel mechanism. Avoid unless benefit clearly outweighs risk.' }, breastfeeding: { hale: 'unknown', risk: 'unknown', notes: 'No published human lactation data.' } },
  gepirone:             { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Very limited data. Novel 5HT1A partial agonist antidepressant. Avoid if possible.' }, breastfeeding: { hale: 'unknown', risk: 'unknown', notes: 'No human lactation data.' } },
  esketamine:           { pregnancy: { fdaCategory: 'C', risk: 'avoid',   notes: 'NMDA antagonism — animal data shows potential neurotoxicity. Avoid in pregnancy. REMS program.' }, breastfeeding: { hale: 'unknown', risk: 'avoid', notes: 'No lactation data. CNS-active nasal spray — avoid.' } },
  brexanolone:          { pregnancy: { fdaCategory: 'N/A', risk: 'unknown', notes: 'Approved for postpartum depression only. Use occurs in postpartum period; safety in pregnancy not established.' }, breastfeeding: { hale: 'unknown', risk: 'unknown', notes: 'Approved for PPD but no breastfeeding safety data. Use caution; pump and discard during and shortly after infusion.' } },
  zuranolone:           { pregnancy: { fdaCategory: 'N/A', risk: 'unknown', notes: 'PLLR-era label only. Animal data shows fetal harm. Contraceptive use required. Very limited human data.' }, breastfeeding: { hale: 'unknown', risk: 'avoid', notes: 'No human lactation data. Neuroactive steroid — avoid.' } },
  'dextromethorphan-bupropion': { pregnancy: { fdaCategory: 'N/A', risk: 'caution', notes: 'Combination product. DXM has limited pregnancy data. See bupropion concerns. Avoid unless clearly needed.' }, breastfeeding: { hale: 'unknown', risk: 'caution', notes: 'No published lactation data for combination. Bupropion concerns apply.' } },
  // FGAs
  haloperidol:          { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Limb reduction defects in early reports (disputed). Neonatal EPS and withdrawal. Most studied FGA; used in hyperemesis.' }, breastfeeding: { hale: 'L3', risk: 'caution', notes: 'Low relative infant dose. Developmental concerns with long-term exposure. Use lowest effective dose.' } },
  chlorpromazine:       { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Neonatal EPS, jaundice, sedation. Used historically but less preferred than haloperidol.' }, breastfeeding: { hale: 'L3', risk: 'caution', notes: 'Detected in milk. Neonatal sedation and galactorrhea risk. Monitor closely.' } },
  fluphenazine:         { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Neonatal EPS. Limited data specific to fluphenazine. Long-acting depot adds complexity.' }, breastfeeding: { hale: 'L4', risk: 'avoid', notes: 'Limited data; depot formulation prolongs exposure. Avoid if possible.' } },
  trifluoperazine:      { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Neonatal EPS. Limited human data. Avoid if alternative antipsychotic available.' }, breastfeeding: { hale: 'unknown', risk: 'unknown', notes: 'No reliable lactation data. Avoid.' } },
  perphenazine:         { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Neonatal EPS, sedation. Some use in refractory hyperemesis. Limited data.' }, breastfeeding: { hale: 'L3', risk: 'caution', notes: 'Low milk concentrations in limited studies. Monitor infant.' } },
  thiothixene:          { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Limited data. Neonatal EPS possible. Class effect applies.' }, breastfeeding: { hale: 'unknown', risk: 'unknown', notes: 'No published lactation data.' } },
  pimozide:             { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Very limited data. QT prolongation adds concern. Avoid in pregnancy if possible.' }, breastfeeding: { hale: 'unknown', risk: 'avoid', notes: 'No lactation data. QT prolongation risk. Avoid.' } },
  thioridazine:         { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Neonatal EPS, sedation. Withdrawn from many markets due to QT risk. Avoid.' }, breastfeeding: { hale: 'unknown', risk: 'avoid', notes: 'No lactation data. QT risk and limited data. Avoid.' } },
  loxapine:             { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Neonatal EPS. Inhaled formulation not studied in pregnancy. Limited data.' }, breastfeeding: { hale: 'unknown', risk: 'unknown', notes: 'No published lactation data.' } },
  molindone:            { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Very limited data. Neonatal EPS expected as class effect.' }, breastfeeding: { hale: 'unknown', risk: 'unknown', notes: 'No published lactation data.' } },
  // SGAs
  risperidone:          { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Neonatal EPS and withdrawal reported. Gestational diabetes risk. Most studied SGA after olanzapine.' }, breastfeeding: { hale: 'L3', risk: 'caution', notes: 'Low relative infant dose. Monitor for sedation and EPS.' } },
  olanzapine:           { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Gestational diabetes, excessive weight gain. Neonatal EPS/withdrawal. Most studied SGA in pregnancy.' }, breastfeeding: { hale: 'L2', risk: 'low', notes: 'Low relative infant dose. Sedation possible. Monitor weight gain in infant.' } },
  quetiapine:           { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Gestational diabetes risk. Neonatal withdrawal. Commonly used; limited teratogenicity signal.' }, breastfeeding: { hale: 'L4', risk: 'avoid', notes: 'Higher milk transfer than olanzapine/risperidone. Significant sedation risk. Avoid; use alternative.' } },
  aripiprazole:         { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Neonatal EPS and withdrawal. Limited but growing data; no strong teratogenicity signal.' }, breastfeeding: { hale: 'L3', risk: 'caution', notes: 'Detectable in milk; half-life 75 hr means accumulation. Monitor infant.' } },
  clozapine:            { pregnancy: { fdaCategory: 'B', risk: 'caution', notes: 'Category B but agranulocytosis monitoring required. Neonatal hypotonia, seizures reported. Reserve for refractory illness.' }, breastfeeding: { hale: 'L3', risk: 'avoid', notes: 'Risk of infant agranulocytosis and sedation. Avoid; if used, monitor infant CBC.' } },
  ziprasidone:          { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Limited data. QT prolongation consideration. No strong teratogenicity signal.' }, breastfeeding: { hale: 'unknown', risk: 'unknown', notes: 'No reliable lactation data. Avoid if alternative exists.' } },
  lurasidone:           { pregnancy: { fdaCategory: 'B', risk: 'low',     notes: 'Category B — animal studies reassuring. Limited human data. Neonatal EPS/withdrawal possible.' }, breastfeeding: { hale: 'unknown', risk: 'unknown', notes: 'No published human lactation data. Caution warranted.' } },
  asenapine:            { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Limited human data. Neonatal EPS possible. Sublingual route limits maternal systemic exposure.' }, breastfeeding: { hale: 'unknown', risk: 'unknown', notes: 'No human lactation data.' } },
  paliperidone:         { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Active metabolite of risperidone. Neonatal EPS/withdrawal. Similar concerns to risperidone.' }, breastfeeding: { hale: 'L3', risk: 'caution', notes: 'Detected in milk (similar to risperidone). Monitor infant.' } },
  iloperidone:          { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Very limited human data. QT prolongation. Neonatal EPS possible.' }, breastfeeding: { hale: 'unknown', risk: 'unknown', notes: 'No human lactation data.' } },
  brexpiprazole:        { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Limited data. Long half-life. Neonatal EPS/withdrawal possible.' }, breastfeeding: { hale: 'unknown', risk: 'unknown', notes: 'No human lactation data. Long half-life a concern.' } },
  cariprazine:          { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Very limited data. Ultra-long half-life of DCAR metabolite (~1–3 weeks) is a concern.' }, breastfeeding: { hale: 'unknown', risk: 'avoid', notes: 'No data; ultra-long-acting metabolite would persist in infant for weeks. Avoid.' } },
  lumateperone:         { pregnancy: { fdaCategory: 'N/A', risk: 'unknown', notes: 'PLLR label only. Limited human data. Avoid unless clearly necessary.' }, breastfeeding: { hale: 'unknown', risk: 'unknown', notes: 'No human lactation data.' } },
  pimavanserin:         { pregnancy: { fdaCategory: 'N/A', risk: 'unknown', notes: 'PLLR label. Very limited data. Use in PD psychosis context — weigh risks carefully.' }, breastfeeding: { hale: 'unknown', risk: 'unknown', notes: 'No human lactation data.' } },
  // Mood stabilizers
  lithium:              { pregnancy: { fdaCategory: 'D', risk: 'avoid',   notes: 'Category D. Ebstein\'s anomaly risk (small absolute increase). Neonatal toxicity (floppy baby, cyanosis). If continued, monitor levels closely; hold during labor.' }, breastfeeding: { hale: 'L4', risk: 'avoid', notes: 'High milk-to-plasma ratio. Neonatal toxicity (hypotonia, cyanosis). Avoid; if used, monitor infant levels and hydration.' } },
  valproate:            { pregnancy: { fdaCategory: 'X', risk: 'avoid',   notes: 'Category X for migraine; D for epilepsy. Major teratogen — neural tube defects (1–5%), cognitive impairment, autism risk. Avoid in women of childbearing potential unless no alternative.' }, breastfeeding: { hale: 'L2', risk: 'low', notes: 'Low relative infant dose; low milk transfer. Compatible with monitoring of infant LFTs and CBC with long-term use.' } },
  lamotrigine:          { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Oral cleft risk (small, primarily with high doses). Levels drop significantly during pregnancy — monitor closely. Generally preferred mood stabilizer in pregnancy.' }, breastfeeding: { hale: 'L3', risk: 'caution', notes: 'Significant milk transfer. Infant serum levels can be 30–50% of maternal. Monitor infant for rash, apnea.' } },
  carbamazepine:        { pregnancy: { fdaCategory: 'D', risk: 'avoid',   notes: 'Category D. Neural tube defects (~1%), craniofacial anomalies, fetal growth restriction. Avoid; if used, folate supplementation essential.' }, breastfeeding: { hale: 'L2', risk: 'low', notes: 'Low relative infant dose. Neonatal cholestasis risk with long-term exposure. Monitor LFTs.' } },
  oxcarbazepine:        { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Structural analogue of carbamazepine. Hyponatremia risk. Fetal growth concern. Folate supplementation advised.' }, breastfeeding: { hale: 'L3', risk: 'caution', notes: 'Active metabolite detected in milk. Monitor infant.' } },
  topiramate:           { pregnancy: { fdaCategory: 'D', risk: 'avoid',   notes: 'Category D. Oral clefts (OR ~11×), fetal growth restriction. Contraception required. Avoid if alternatives exist.' }, breastfeeding: { hale: 'L3', risk: 'caution', notes: 'Detected in milk; infant serum levels variable. Monitor for sedation, poor feeding.' } },
  gabapentin:           { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Neonatal abstinence syndrome with high maternal doses. Fetal anomaly data mixed. Avoid unless clearly necessary.' }, breastfeeding: { hale: 'L2', risk: 'low', notes: 'Low relative infant dose. Generally considered compatible.' } },
  // Sleep
  zolpidem:             { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Neonatal withdrawal, respiratory depression at high doses. Avoid chronic use. Lowest dose if used.' }, breastfeeding: { hale: 'L3', risk: 'caution', notes: 'Low milk transfer but sedation risk. Avoid or use single dose and monitor infant.' } },
  eszopiclone:          { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Limited human data. Avoid chronic use; neonatal respiratory depression possible.' }, breastfeeding: { hale: 'unknown', risk: 'unknown', notes: 'No published lactation data. Avoid.' } },
  temazepam:            { pregnancy: { fdaCategory: 'X', risk: 'avoid',   notes: 'Category X. Benzodiazepine — neonatal withdrawal, floppy baby, cleft palate risk. Contraindicated in pregnancy.' }, breastfeeding: { hale: 'L3', risk: 'caution', notes: 'Excreted in milk. Neonatal sedation. Avoid with newborns; limited use if needed.' } },
  ramelteon:            { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Melatonin receptor agonist. Limited human data. Animal data shows reproductive effects at high doses.' }, breastfeeding: { hale: 'unknown', risk: 'unknown', notes: 'No human lactation data. Melatonin itself is present in breast milk naturally; drug form unstudied.' } },
  suvorexant:           { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Orexin antagonist. Limited human data. Avoid chronic use in pregnancy.' }, breastfeeding: { hale: 'unknown', risk: 'unknown', notes: 'No published lactation data.' } },
  // Benzodiazepines
  alprazolam:           { pregnancy: { fdaCategory: 'D', risk: 'avoid',   notes: 'Category D. Neonatal withdrawal, floppy baby syndrome. Avoid especially in 1st trimester and near term.' }, breastfeeding: { hale: 'L3', risk: 'caution', notes: 'Detected in milk. Neonatal sedation, poor feeding. Limit use; monitor infant.' } },
  clonazepam:           { pregnancy: { fdaCategory: 'D', risk: 'avoid',   notes: 'Category D. Neonatal withdrawal, apnea, hypotonia. Avoid if possible.' }, breastfeeding: { hale: 'L3', risk: 'caution', notes: 'Accumulates with repeated dosing. Monitor for sedation.' } },
  diazepam:             { pregnancy: { fdaCategory: 'D', risk: 'avoid',   notes: 'Category D. Neonatal withdrawal, floppy infant, cleft palate signal. Active metabolites persist weeks in neonate.' }, breastfeeding: { hale: 'L3', risk: 'caution', notes: 'Long-acting metabolites accumulate in infant. Use with caution; prefer shorter-acting alternatives.' } },
  lorazepam:            { pregnancy: { fdaCategory: 'D', risk: 'avoid',   notes: 'Category D. Neonatal sedation, respiratory depression. No active metabolites — preferred benzo if needed acutely.' }, breastfeeding: { hale: 'L3', risk: 'caution', notes: 'Short-acting; lower accumulation than diazepam. Single doses generally safer than chronic use.' } },
  oxazepam:             { pregnancy: { fdaCategory: 'D', risk: 'avoid',   notes: 'Category D. Direct conjugation — no active metabolites. Neonatal withdrawal still possible.' }, breastfeeding: { hale: 'L3', risk: 'caution', notes: 'Low milk transfer. One of safer benzos during breastfeeding if needed.' } },
  chlordiazepoxide:     { pregnancy: { fdaCategory: 'D', risk: 'avoid',   notes: 'Category D. Active metabolites persist. Withdrawal risk. Avoid.' }, breastfeeding: { hale: 'L3', risk: 'caution', notes: 'Active metabolites detected in milk. Sedation risk.' } },
  clorazepate:          { pregnancy: { fdaCategory: 'D', risk: 'avoid',   notes: 'Category D. Prodrug of desmethyldiazepam. Prolonged neonatal effect.' }, breastfeeding: { hale: 'unknown', risk: 'caution', notes: 'No specific data; active metabolite (desmethyldiazepam) expected in milk.' } },
  midazolam:            { pregnancy: { fdaCategory: 'D', risk: 'avoid',   notes: 'Category D. Short-acting; used in anesthesia. Neonatal respiratory depression with chronic/high-dose use.' }, breastfeeding: { hale: 'L3', risk: 'caution', notes: 'Short half-life; single procedural doses compatible. Pump and discard 4 hrs after single dose.' } },
  triazolam:            { pregnancy: { fdaCategory: 'X', risk: 'avoid',   notes: 'Category X. Contraindicated in pregnancy.' }, breastfeeding: { hale: 'L3', risk: 'caution', notes: 'Short-acting. Avoid in breastfeeding newborns; single doses may be permissible.' } },
  estazolam:            { pregnancy: { fdaCategory: 'X', risk: 'avoid',   notes: 'Category X. Contraindicated in pregnancy.' }, breastfeeding: { hale: 'unknown', risk: 'caution', notes: 'No published lactation data. Avoid.' } },
  flurazepam:           { pregnancy: { fdaCategory: 'X', risk: 'avoid',   notes: 'Category X. Ultra-long half-life active metabolite. Contraindicated.' }, breastfeeding: { hale: 'L3', risk: 'avoid', notes: 'Long-acting metabolites accumulate. Avoid during breastfeeding.' } },
  // Other anxiolytics
  buspirone:            { pregnancy: { fdaCategory: 'B', risk: 'low',     notes: 'Category B. Animal studies reassuring. Limited human data but no strong teratogenicity signal. First-line anxiolytic consideration in pregnancy.' }, breastfeeding: { hale: 'unknown', risk: 'unknown', notes: 'No published human lactation data. Short half-life may be favorable, but data lacking.' } },
  pregabalin:           { pregnancy: { fdaCategory: 'C', risk: 'avoid',   notes: 'Emerging signal for major congenital malformations (cardiac, musculoskeletal). EURAP and Nordic studies raise concern. Avoid.' }, breastfeeding: { hale: 'unknown', risk: 'caution', notes: 'Detected in breast milk in case reports. Limited safety data.' } },
  propranolol:          { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Fetal bradycardia, IUGR, neonatal hypoglycemia. Commonly used for performance anxiety; avoid chronic use near term.' }, breastfeeding: { hale: 'L2', risk: 'low', notes: 'Low milk transfer. Compatible with infant monitoring for bradycardia.' } },
  clonidine:            { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Neonatal hypotension, rebound hypertension if abruptly stopped. Used for ADHD/HTN; weigh benefit vs. risk.' }, breastfeeding: { hale: 'L3', risk: 'caution', notes: 'Excreted in milk; neonatal sedation and hypotension possible.' } },
  guanfacine:           { pregnancy: { fdaCategory: 'B', risk: 'low',     notes: 'Category B. Animal studies reassuring. Limited human data. Used for ADHD in pregnancy with caution.' }, breastfeeding: { hale: 'unknown', risk: 'unknown', notes: 'No published human lactation data.' } },
  doxylamine:           { pregnancy: { fdaCategory: 'A', risk: 'low',     notes: 'Category A. FDA-approved for nausea/vomiting of pregnancy (Diclegis/Bonjesta with B6). Extensively studied. Safe first-line option.' }, breastfeeding: { hale: 'L1', risk: 'low', notes: 'Category L1 — safest. Antihistamine at low doses. Use with standard dosing; monitor infant for sedation.' } },
  // Stimulants
  methylphenidate:      { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Neonatal sympathomimetic effects. Cardiac malformation signal (disputed). ADHD treatment usually held in pregnancy; weigh individual risk.' }, breastfeeding: { hale: 'L3', risk: 'caution', notes: 'Low milk transfer in most studies. Monitor infant for decreased appetite, irritability.' } },
  dexmethylphenidate:   { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Active enantiomer of methylphenidate. Same concerns apply.' }, breastfeeding: { hale: 'L3', risk: 'caution', notes: 'Same as methylphenidate. Monitor infant.' } },
  'amphetamine-mixed-salts': { pregnancy: { fdaCategory: 'C', risk: 'avoid', notes: 'Preterm birth, IUGR, neonatal withdrawal. Vasoconstrictive effects on placenta. Avoid if possible; if continued, close OB monitoring.' }, breastfeeding: { hale: 'L3', risk: 'avoid', notes: 'Amphetamines concentrated in milk. Irritability, poor sleep in infant. Generally avoid; pump and discard.' } },
  dextroamphetamine:    { pregnancy: { fdaCategory: 'C', risk: 'avoid',   notes: 'Same vasoconstrictive/withdrawal concerns as mixed amphetamine salts. Avoid.' }, breastfeeding: { hale: 'L4', risk: 'avoid', notes: 'Significant infant exposure. Avoid breastfeeding.' } },
  lisdexamfetamine:     { pregnancy: { fdaCategory: 'C', risk: 'avoid',   notes: 'Prodrug of d-amphetamine. Same pregnancy concerns. Avoid.' }, breastfeeding: { hale: 'L4', risk: 'avoid', notes: 'Prodrug — converts to d-amphetamine. Avoid breastfeeding.' } },
  modafinil:            { pregnancy: { fdaCategory: 'C', risk: 'avoid',   notes: 'Facial cleft signal in post-marketing data. Manufacturer recommends effective contraception. Avoid in pregnancy.' }, breastfeeding: { hale: 'unknown', risk: 'unknown', notes: 'No published lactation data. Avoid given teratogenicity concerns.' } },
  armodafinil:          { pregnancy: { fdaCategory: 'C', risk: 'avoid',   notes: 'R-enantiomer of modafinil. Same facial cleft concern and contraception requirement.' }, breastfeeding: { hale: 'unknown', risk: 'unknown', notes: 'No lactation data. Avoid.' } },
  solriamfetol:         { pregnancy: { fdaCategory: 'N/A', risk: 'unknown', notes: 'PLLR label. Very limited data. Dopamine/norepinephrine reuptake inhibitor — neonatal effects unknown.' }, breastfeeding: { hale: 'unknown', risk: 'unknown', notes: 'No human lactation data.' } },
  // Anticholinergics / Antihistamines
  hydroxyzine:          { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Neonatal withdrawal near term. Commonly used in 1st trimester for nausea; avoid near delivery.' }, breastfeeding: { hale: 'L1', risk: 'low', notes: 'Generally considered compatible. Monitor for sedation.' } },
  diphenhydramine:      { pregnancy: { fdaCategory: 'B', risk: 'low',     notes: 'Category B. Commonly used first-line for insomnia/allergy in pregnancy. Avoid near term — neonatal withdrawal, respiratory depression at high doses.' }, breastfeeding: { hale: 'L2', risk: 'low', notes: 'Low dose compatible. High doses or frequent use may reduce milk supply and cause infant sedation.' } },
  trihexyphenidyl:      { pregnancy: { fdaCategory: 'C', risk: 'caution', notes: 'Anticholinergic — may impair fetal gut motility, tachycardia. Very limited data. Avoid if alternatives exist.' }, breastfeeding: { hale: 'unknown', risk: 'unknown', notes: 'No published lactation data. Anticholinergic effects may suppress lactation.' } },
};

// Ki values in nM. Use 10000 for no clinically significant affinity.
// Sources: PDSP Ki database, FDA labels, published literature.
const MEDICATIONS = [

  // ── SSRIs ──────────────────────────────────────────────────────────────────
  {
    id: 'fluoxetine',
    name: 'Fluoxetine',
    brandName: 'Prozac',
    class: 'SSRI',
    category: 'Antidepressant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '24–72 hr', metabolites: 'Norfluoxetine: 4–16 days' },
    p450: {
      substrate: ['CYP2D6','CYP2C9'],
      inhibits: { 'CYP2D6': 'strong', 'CYP2C9': 'moderate', 'CYP2C19': 'moderate', 'CYP3A4': 'weak' },
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No dose adjustment required; use with caution in severe renal impairment. Dialysis does not significantly remove fluoxetine.' },
    hepaticImpairment: { modified: true, notes: 'Reduce dose or extend interval' },
    geriatricDosing: { modified: false, notes: 'Caution: prolonged half-life' },
    qtInterval: false,
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
      { use: 'Bipolar Depression (with olanzapine)', year: 2003 },
      { use: 'Treatment-Resistant Depression (with olanzapine)', year: 2003 },
    ]
  },
  {
    id: 'sertraline',
    name: 'Sertraline',
    brandName: 'Zoloft',
    class: 'SSRI',
    category: 'Antidepressant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '26 hr', metabolites: 'N-desmethylsertraline: ~66 hr (weak)' },
    p450: {
      substrate: ['CYP2D6','CYP2C19','CYP3A4'],
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
    name: 'Escitalopram',
    brandName: 'Lexapro',
    class: 'SSRI',
    category: 'Antidepressant',
    activeEnantiomer: { has: true, name: 'S-citalopram (this drug is the active enantiomer of citalopram)' },
    halfLife: { drug: '27–32 hr', metabolites: 'None significant' },
    p450: {
      substrate: ['CYP2C19','CYP3A4'],
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
    name: 'Paroxetine',
    brandName: 'Paxil',
    class: 'SSRI',
    category: 'Antidepressant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '21 hr', metabolites: 'None significant' },
    p450: {
      substrate: ['CYP2D6'],
      inhibits: { 'CYP2D6': 'strong', 'CYP3A4': 'weak' },
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'Reduce dose', severe: 'Max 40 mg/day', notes: 'Reduce dose in severe renal impairment (CrCl <30 mL/min): initiate at lower end of dosing range.' },
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
    name: 'Citalopram',
    brandName: 'Celexa',
    class: 'SSRI',
    category: 'Antidepressant',
    activeEnantiomer: { has: true, name: 'Escitalopram (S-citalopram)' },
    halfLife: { drug: '35 hr', metabolites: 'Desmethylcitalopram: weak, ~50 hr' },
    p450: {
      substrate: ['CYP2C19','CYP3A4'],
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
    name: 'Fluvoxamine',
    brandName: 'Luvox',
    class: 'SSRI',
    category: 'Antidepressant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '15–22 hr', metabolites: 'None significant' },
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
    name: 'Venlafaxine',
    brandName: 'Effexor',
    class: 'SNRI',
    category: 'Antidepressant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '5 hr', metabolites: 'O-desmethylvenlafaxine (desvenlafaxine): 11 hr' },
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
      SERT: 7.5, NET: 2480, DAT: 10000, '5HT1A': 10000, '5HT2A': 10000, '5HT2C': 10000,
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
    name: 'Duloxetine',
    brandName: 'Cymbalta',
    class: 'SNRI',
    category: 'Antidepressant',
    activeEnantiomer: { has: true, name: '(-)-duloxetine; this drug is the S-enantiomer' },
    halfLife: { drug: '12 hr', metabolites: 'None clinically significant' },
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
    name: 'Desvenlafaxine',
    brandName: 'Pristiq',
    class: 'SNRI',
    category: 'Antidepressant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '11 hr', metabolites: 'None significant' },
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
    name: 'Amitriptyline',
    brandName: 'Elavil',
    class: 'TCA',
    category: 'Antidepressant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '10–28 hr', metabolites: 'Nortriptyline: 20–100 hr' },
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
    name: 'Nortriptyline',
    brandName: 'Pamelor',
    class: 'TCA',
    category: 'Antidepressant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '20–100 hr', metabolites: '10-OH-nortriptyline: active' },
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
    name: 'Imipramine',
    brandName: 'Tofranil',
    class: 'TCA',
    category: 'Antidepressant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '11–25 hr', metabolites: 'Desipramine: 12–76 hr' },
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
    name: 'Phenelzine',
    brandName: 'Nardil',
    class: 'MAOI',
    category: 'Antidepressant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '11–12 hr', metabolites: 'Irreversible MAO-A/B inhibition persists 2–3 weeks' },
    p450: {
      substrate: [],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'Use with caution', severe: 'Use with caution' },
    hepaticImpairment: { modified: true, notes: 'Use with caution; contraindicated in severe' },
    geriatricDosing: { modified: true, notes: 'Use with caution; fall/orthostatic risk' },
    qtInterval: false,
    proteinBinding: 13,
    receptorKi: null,
    mechanism: 'Irreversible non-selective MAO-A and MAO-B inhibitor; increases synaptic monoamines (NE, 5HT, DA)',
    indications: [
      { use: 'Major Depressive Disorder (atypical)', year: 1961 },
    ]
  },
  {
    id: 'tranylcypromine',
    name: 'Tranylcypromine',
    brandName: 'Parnate',
    class: 'MAOI',
    category: 'Antidepressant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '2–3 hr', metabolites: 'Irreversible MAO-A/B inhibition persists 1–2 weeks' },
    p450: {
      substrate: ['CYP2A6'],
      inhibits: { 'CYP2A6': 'strong', 'CYP2C19': 'moderate' },
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'Use with caution', severe: 'Use with caution' },
    hepaticImpairment: { modified: true, notes: 'Contraindicated in hepatic disease' },
    geriatricDosing: { modified: true, notes: 'Use with caution' },
    qtInterval: false,
    proteinBinding: 0,
    receptorKi: null,
    mechanism: 'Irreversible non-selective MAO-A and MAO-B inhibitor; mild dopamine-releasing properties',
    indications: [
      { use: 'Major Depressive Disorder (atypical)', year: 1961 },
    ]
  },

  // ── Other Antidepressants ──────────────────────────────────────────────────
  {
    id: 'bupropion',
    name: 'Bupropion',
    brandName: 'Wellbutrin',
    class: 'NDRI',
    category: 'Antidepressant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '21 hr', metabolites: 'Hydroxybupropion: 20 hr; threohydrobupropion: 37 hr' },
    p450: {
      substrate: ['CYP2B6'],
      inhibits: { 'CYP2D6': 'strong' },
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'Use with caution', severe: 'Reduce dose/frequency' },
    hepaticImpairment: { modified: true, notes: 'Reduce dose; avoid in severe (cirrhosis)' },
    geriatricDosing: { modified: true, notes: 'Start low; seizure risk consideration' },
    qtInterval: false,
    proteinBinding: 84,
    receptorKi: {
      SERT: 10000, NET: 52, DAT: 526, '5HT1A': 10000, '5HT2A': 10000, '5HT2C': 10000,
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
    name: 'Mirtazapine',
    brandName: 'Remeron',
    class: 'NaSSA',
    category: 'Antidepressant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '20–40 hr', metabolites: 'None significant' },
    p450: {
      substrate: ['CYP1A2','CYP2D6','CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'Use with caution', severe: 'Use with caution; clearance decreased ~30%' },
    hepaticImpairment: { modified: true, notes: 'Use with caution; clearance decreased ~30%' },
    geriatricDosing: { modified: true, notes: 'Start 7.5 mg; clearance reduced in elderly' },
    qtInterval: false,
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
    name: 'Trazodone',
    brandName: 'Desyrel',
    class: 'SARI',
    category: 'Sleep',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '7–10 hr', metabolites: 'mCPP (active, 5HT2C agonist): 4–8 hr' },
    p450: {
      substrate: ['CYP3A4'],
      inhibits: { 'CYP3A4': 'weak' },
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No dose adjustment required per labeling. Use with caution in severe renal impairment; monitor for adverse effects.' },
    hepaticImpairment: { modified: true, notes: 'Use with caution' },
    geriatricDosing: { modified: true, notes: 'Start low; orthostatic/fall risk' },
    qtInterval: false,
    proteinBinding: 92,
    receptorKi: {
      SERT: 160, NET: 8300, DAT: 10000, '5HT1A': 14, '5HT2A': 36, '5HT2C': 230,
      D2: 2500, H1: 220, alpha1: 18, alpha2: 10000, M1: 10000
    },
    indications: [
      { use: 'Major Depressive Disorder', year: 1981 },
    ]
  },
  {
    id: 'vilazodone',
    name: 'Vilazodone',
    brandName: 'Viibryd',
    class: 'SSRI/5HT1A',
    category: 'Antidepressant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '25 hr', metabolites: 'None significant' },
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
    name: 'Haloperidol',
    brandName: 'Haldol',
    class: 'FGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '21–24 hr', metabolites: 'Reduced haloperidol (less active)' },
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
    name: 'Chlorpromazine',
    brandName: 'Thorazine',
    class: 'FGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '16–30 hr', metabolites: 'Multiple active metabolites' },
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
      { use: 'Acute Mania (adjunct)', year: 1954 },
    ]
  },
  {
    id: 'fluphenazine',
    name: 'Fluphenazine',
    brandName: 'Prolixin',
    class: 'FGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '14–24 hr (oral)', metabolites: 'None significant' },
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
      D1: 12, D2: 1, D3: 10000, H1: 10, alpha1: 7, M1: 10000
    },
    indications: [
      { use: 'Schizophrenia', year: 1959 },
      { use: 'Psychotic Disorders', year: 1959 },
    ]
  },

  // ── SGAs (Second-Generation Antipsychotics) ────────────────────────────────
  {
    id: 'risperidone',
    name: 'Risperidone',
    brandName: 'Risperdal',
    class: 'SGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '3 hr (20 hr in CYP2D6 PMs)', metabolites: '9-OH-risperidone (paliperidone): 21 hr' },
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
      D1: 10000, D2: 3.6, D3: 10, H1: 41, alpha1: 2.1, alpha2: 10, M1: 10000
    },
    indications: [
      { use: 'Schizophrenia', year: 1993 },
      { use: 'Bipolar Mania', year: 2003 },
      { use: 'Autism-Associated Irritability', year: 2006 },
    ]
  },
  {
    id: 'olanzapine',
    name: 'Olanzapine',
    brandName: 'Zyprexa',
    class: 'SGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '21–54 hr', metabolites: 'N-desmethylolanzapine: weak' },
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
      D1: 32, D2: 11, D3: 49, H1: 7, alpha1: 19, alpha2: 10000, M1: 1.9
    },
    indications: [
      { use: 'Schizophrenia', year: 1996 },
      { use: 'Bipolar Mania', year: 1997 },
      { use: 'Bipolar Depression (with fluoxetine)', year: 2003 },
      { use: 'Treatment-Resistant Depression (with fluoxetine)', year: 2003 },
      { use: 'Agitation in Schizophrenia/Bipolar (IM)', year: 2004 },
    ]
  },
  {
    id: 'quetiapine',
    name: 'Quetiapine',
    brandName: 'Seroquel',
    class: 'SGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '6–7 hr', metabolites: 'Norquetiapine (active, NET inhibition): 12 hr' },
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
      D1: 10000, D2: 170, D3: 10000, H1: 30, alpha1: 94, alpha2: 10000, M1: 10000
    },
    indications: [
      { use: 'Schizophrenia', year: 1997 },
      { use: 'Bipolar Mania', year: 2004 },
      { use: 'Bipolar Depression', year: 2006 },
      { use: 'Adjunct for Major Depressive Disorder', year: 2009 },
      { use: 'Bipolar Maintenance (adjunct)', year: 2008 },
    ]
  },
  {
    id: 'aripiprazole',
    name: 'Aripiprazole',
    brandName: 'Abilify',
    class: 'SGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '75 hr', metabolites: 'Dehydro-aripiprazole (active): 94 hr' },
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
      D1: 265, D2: 0.34, D3: 0.8, H1: 61, alpha1: 57, alpha2: 10000, M1: 10000
    },
    indications: [
      { use: 'Schizophrenia', year: 2002 },
      { use: 'Bipolar Mania', year: 2004 },
      { use: 'Adjunct for Major Depressive Disorder', year: 2007 },
      { use: 'Autism-Associated Irritability', year: 2009 },
      { use: 'Tourette Syndrome', year: 2014 },
      { use: 'Bipolar Maintenance', year: 2005 },
    ]
  },
  {
    id: 'clozapine',
    name: 'Clozapine',
    brandName: 'Clozaril',
    class: 'SGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '12 hr', metabolites: 'N-desmethylclozapine (active): 20 hr' },
    p450: {
      substrate: ['CYP1A2','CYP2D6','CYP3A4'],
      inhibits: { 'CYP2D6': 'weak' },
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null, notes: 'No specific dose adjustment; use with extreme caution. Clozapine metabolites may accumulate; risk of agranulocytosis monitoring unchanged.' },
    hepaticImpairment: { modified: true, notes: 'Use with caution; monitor LFTs' },
    geriatricDosing: { modified: true, notes: 'Significant orthostatic/sedation risk' },
    qtInterval: true,
    proteinBinding: 97,
    receptorKi: {
      SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 195, '5HT2A': 5.4, '5HT2C': 8.9,
      D1: 141, D2: 157, D3: 180, H1: 6.2, alpha1: 7, alpha2: 10000, M1: 2.8
    },
    indications: [
      { use: 'Treatment-Resistant Schizophrenia', year: 1989 },
      { use: 'Suicidality in Schizophrenia/Schizoaffective Disorder', year: 2002 },
    ]
  },
  {
    id: 'ziprasidone',
    name: 'Ziprasidone',
    brandName: 'Geodon',
    class: 'SGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '7 hr', metabolites: 'None significant (aldehyde oxidase primary)' },
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
      SERT: 2.5, NET: 160, DAT: 10000, '5HT1A': 3.4, '5HT2A': 0.4, '5HT2C': 1.3,
      D1: 10000, D2: 4.8, D3: 7.2, H1: 47, alpha1: 10, alpha2: 10000, M1: 10000
    },
    indications: [
      { use: 'Schizophrenia', year: 2001 },
      { use: 'Bipolar Mania', year: 2004 },
      { use: 'Agitation in Schizophrenia (IM)', year: 2002 },
    ]
  },
  {
    id: 'lurasidone',
    name: 'Lurasidone',
    brandName: 'Latuda',
    class: 'SGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '18–40 hr', metabolites: 'ID-14283 and ID-14326 (active)' },
    p450: {
      substrate: ['CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'Max 80 mg/day', severe: 'Max 40 mg/day' },
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
      { use: 'Bipolar Depression', year: 2013 },
    ]
  },
  {
    id: 'asenapine',
    name: 'Asenapine',
    brandName: 'Saphris',
    class: 'SGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '24 hr', metabolites: 'N-desmethylasenapine (less active)' },
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
      D1: 10000, D2: 1.3, D3: 0.42, H1: 1.0, alpha1: 1.2, alpha2: 1.2, M1: 10000
    },
    indications: [
      { use: 'Schizophrenia', year: 2009 },
      { use: 'Bipolar Mania', year: 2009 },
      { use: 'Bipolar Maintenance (adjunct)', year: 2015 },
    ]
  },

  // ── Mood Stabilizers ───────────────────────────────────────────────────────
  {
    id: 'lithium',
    name: 'Lithium',
    brandName: 'Lithobid',
    class: 'Mood Stabilizer',
    category: 'Mood Stabilizer',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '18–24 hr', metabolites: 'Not applicable (monovalent cation)' },
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
      { use: 'Bipolar Mania', year: 1970 },
      { use: 'Bipolar Maintenance', year: 1974 },
    ]
  },
  {
    id: 'valproate',
    name: 'Valproate',
    brandName: 'Depakote',
    class: 'Mood Stabilizer',
    category: 'Mood Stabilizer',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '9–16 hr', metabolites: '2-en-valproate (active): variable' },
    p450: {
      substrate: ['CYP2C9','CYP2C19'],
      inhibits: { 'CYP2C9': 'moderate', 'CYP2C19': 'weak' },
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
      { use: 'Bipolar Mania', year: 1995 },
      { use: 'Migraine Prophylaxis', year: 1996 },
    ]
  },
  {
    id: 'lamotrigine',
    name: 'Lamotrigine',
    brandName: 'Lamictal',
    class: 'Mood Stabilizer',
    category: 'Mood Stabilizer',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '25–33 hr (monotherapy)', metabolites: 'None significant' },
    p450: {
      substrate: [],
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
      { use: 'Bipolar Maintenance', year: 2003 },
    ]
  },
  {
    id: 'carbamazepine',
    name: 'Carbamazepine',
    brandName: 'Tegretol',
    class: 'Mood Stabilizer',
    category: 'Mood Stabilizer',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '12–17 hr (after autoinduction)', metabolites: 'CBZ-10,11-epoxide (active): 5–8 hr' },
    p450: {
      substrate: ['CYP3A4','CYP2C8'],
      inhibits: {},
      induces: ['CYP1A2','CYP2B6','CYP2C9','CYP2C19','CYP3A4']
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
      { use: 'Bipolar Mania', year: 2004 },
    ]
  },

  // ── Sleep Medications ──────────────────────────────────────────────────────
  {
    id: 'zolpidem',
    name: 'Zolpidem',
    brandName: 'Ambien',
    class: 'Z-Drug',
    category: 'Sleep',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '1.5–2.4 hr', metabolites: 'None significant' },
    p450: {
      substrate: ['CYP3A4','CYP2C9'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null },
    hepaticImpairment: { modified: true, notes: 'Max 5 mg/night; use with caution' },
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
    name: 'Eszopiclone',
    brandName: 'Lunesta',
    class: 'Z-Drug',
    category: 'Sleep',
    activeEnantiomer: { has: true, name: 'S-zopiclone (active enantiomer of zopiclone)' },
    halfLife: { drug: '6 hr', metabolites: 'Desmethyleszopiclone (less active): 9 hr' },
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
    name: 'Temazepam',
    brandName: 'Restoril',
    class: 'Benzodiazepine',
    category: 'Sleep',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '8–20 hr', metabolites: 'None significant (direct glucuronidation)' },
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
    name: 'Ramelteon',
    brandName: 'Rozerem',
    class: 'Melatonin Agonist',
    category: 'Sleep',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '1–2.6 hr', metabolites: 'M-II (active, 20× more potent at MT receptors): 2–5 hr' },
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
    name: 'Suvorexant',
    brandName: 'Belsomra',
    class: 'Orexin Antagonist',
    category: 'Sleep',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '12 hr', metabolites: 'None significant' },
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
    name: 'Milnacipran',
    brandName: 'Savella',
    class: 'SNRI',
    category: 'Antidepressant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '~8 hr', metabolites: 'None significant' },
    p450: {
      substrate: [],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'Reduce to 50 mg BID (CrCl 5–29)', severe: 'Reduce to 25 mg BID' },
    hepaticImpairment: { modified: false, notes: null },
    geriatricDosing: { modified: false, notes: 'Use with caution' },
    qtInterval: false,
    proteinBinding: 13,
    receptorKi: { SERT: 8.9, NET: 58, DAT: 10000, '5HT1A': 10000, '5HT2A': 10000, D2: 10000, H1: 10000, alpha1: 10000, M1: 10000 }
  }
  ,{
    id: 'levomilnacipran',
    name: 'Levomilnacipran',
    brandName: 'Fetzima',
    class: 'SNRI',
    category: 'Antidepressant',
    activeEnantiomer: { has: true, name: '(1S,2R)-enantiomer of milnacipran' },
    halfLife: { drug: '12 hr', metabolites: 'None significant' },
    p450: {
      substrate: ['CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'Max 80 mg/day (CrCl 30–59)', severe: 'Max 40 mg/day (CrCl 15–29)' },
    hepaticImpairment: { modified: false, notes: null },
    geriatricDosing: { modified: false, notes: 'Use with caution' },
    qtInterval: false,
    proteinBinding: 22,
    receptorKi: { SERT: 11, NET: 10, DAT: 10000, '5HT1A': 10000, '5HT2A': 10000, D2: 10000, H1: 10000, alpha1: 10000, M1: 10000 }
  }

  // ── SSRI/5HT Multimodal ─────────────────────────────────────────────────
  ,{
    id: 'vortioxetine',
    name: 'Vortioxetine',
    brandName: 'Trintellix',
    class: 'SSRI/5HT1A',
    category: 'Antidepressant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '66 hr', metabolites: 'None significant' },
    p450: {
      substrate: ['CYP2D6', 'CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null },
    hepaticImpairment: { modified: false, notes: null },
    geriatricDosing: { modified: false, notes: 'No specific adjustment' },
    qtInterval: false,
    proteinBinding: 98,
    receptorKi: { SERT: 1.6, NET: 113, DAT: 10000, '5HT1A': 15, '5HT2A': 200, '5HT2C': 910, D2: 10000, H1: 1200, alpha1: 2900, alpha2: 10000, M1: 10000 }
  }

  // ── Azapirone Antidepressant ────────────────────────────────────────────
  ,{
    id: 'gepirone',
    name: 'Gepirone',
    brandName: 'Exxua',
    class: 'Azapirone',
    category: 'Antidepressant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '~5 hr (ER formulation)', metabolites: 'None significant' },
    p450: {
      substrate: ['CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null },
    hepaticImpairment: { modified: true, notes: 'Avoid in moderate-severe' },
    geriatricDosing: { modified: false, notes: null },
    qtInterval: false,
    proteinBinding: 97,
    receptorKi: { '5HT1A': 21, SERT: 160, NET: 10000, DAT: 10000, '5HT2A': 10000, D2: 500, H1: 10000, alpha1: 10000, M1: 10000 }
  }

  // ── Novel Antidepressants ───────────────────────────────────────────────
  ,{
    id: 'esketamine',
    name: 'Esketamine',
    brandName: 'Spravato',
    class: 'NMDA Antagonist',
    category: 'Antidepressant',
    activeEnantiomer: { has: true, name: 'S-enantiomer of ketamine' },
    halfLife: { drug: '7–12 hr', metabolites: 'Noresketamine: ~8 hr' },
    p450: {
      substrate: ['CYP2B6', 'CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null },
    hepaticImpairment: { modified: true, notes: 'Use with caution; avoid in severe' },
    geriatricDosing: { modified: true, notes: 'Lower doses recommended; monitor closely' },
    qtInterval: false,
    proteinBinding: 43,
    receptorKi: null,
    mechanism: 'NMDA receptor uncompetitive antagonist; also acts at opioid mu/kappa receptors and sigma receptors; rapidly reduces depressive symptoms; administered intranasally in-office under REMS program; also increases AMPA/mTOR signaling downstream'
  }
  ,{
    id: 'brexanolone',
    name: 'Brexanolone',
    brandName: 'Zulresso',
    class: 'Neuroactive Steroid',
    category: 'Antidepressant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '9 hr', metabolites: 'None significant' },
    p450: {
      substrate: [],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null },
    hepaticImpairment: { modified: false, notes: null },
    geriatricDosing: { modified: false, notes: null },
    qtInterval: false,
    proteinBinding: 99,
    receptorKi: null,
    mechanism: 'GABA-A receptor positive allosteric modulator (neuroactive steroid); acts at synaptic and extrasynaptic GABA-A receptors including delta subunit-containing; IV 60-hour infusion; approved specifically for postpartum depression; no abuse potential designation'
  }
  ,{
    id: 'zuranolone',
    name: 'Zuranolone',
    brandName: 'Zurzuvae',
    class: 'Neuroactive Steroid',
    category: 'Antidepressant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '20–24 hr', metabolites: 'None significant' },
    p450: {
      substrate: ['CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null },
    hepaticImpairment: { modified: true, notes: 'Avoid in severe (Child-Pugh C)' },
    geriatricDosing: { modified: false, notes: null },
    qtInterval: false,
    proteinBinding: 99,
    receptorKi: null,
    mechanism: 'GABA-A receptor positive allosteric modulator (neuroactive steroid); oral formulation; taken daily for 14 days; acts at synaptic and extrasynaptic GABA-A receptors; CNS depressant effects — driving restriction for 12 hours after each dose'
  }
  ,{
    id: 'dextromethorphan-bupropion',
    name: 'Dextromethorphan/Bupropion',
    brandName: 'Auvelity',
    class: 'Combination',
    category: 'Antidepressant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: 'DXM ~21 hr (with CYP2D6 inhibition); bupropion ~21 hr', metabolites: 'None significant' },
    p450: {
      substrate: ['CYP2D6', 'CYP2B6'],
      inhibits: { 'CYP2D6': 'moderate' },
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'Use with caution', severe: null },
    hepaticImpairment: { modified: true, notes: 'Avoid in severe' },
    geriatricDosing: { modified: false, notes: null },
    qtInterval: false,
    proteinBinding: 90,
    receptorKi: null,
    mechanism: 'Dextromethorphan: uncompetitive NMDA receptor antagonist + sigma-1 receptor agonist + SERT/NET inhibitor; bupropion: NDRI + CYP2D6 inhibitor (increases DXM bioavailability 10-fold); together produce rapid antidepressant effect; approved for MDD in adults'
  }

  // ── Additional TCA ──────────────────────────────────────────────────────
  ,{
    id: 'doxepin',
    name: 'Doxepin',
    brandName: 'Sinequan / Silenor',
    class: 'TCA',
    category: 'Antidepressant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '8–24 hr', metabolites: 'Desmethyldoxepin: 33–80 hr' },
    p450: {
      substrate: ['CYP2D6', 'CYP1A2', 'CYP3A4'],
      inhibits: { 'CYP2D6': 'weak' },
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null },
    hepaticImpairment: { modified: true, notes: 'Use with caution; reduce dose' },
    geriatricDosing: { modified: true, notes: 'Avoid high doses (Beers List); 3–6 mg for insomnia generally acceptable' },
    qtInterval: true,
    proteinBinding: 80,
    receptorKi: { SERT: 68, NET: 30, DAT: 10000, '5HT1A': 10000, '5HT2A': 28, '5HT2C': 10000, D2: 400, H1: 0.2, alpha1: 23, alpha2: 10000, M1: 70 }
  }

  // ── Additional FGAs ─────────────────────────────────────────────────────
  ,{
    id: 'trifluoperazine',
    name: 'Trifluoperazine',
    brandName: 'Stelazine',
    class: 'FGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '7–18 hr', metabolites: 'None significant' },
    p450: {
      substrate: ['CYP1A2'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null },
    hepaticImpairment: { modified: true, notes: 'Use with caution' },
    geriatricDosing: { modified: true, notes: 'Very high EPS risk; avoid (Beers List)' },
    qtInterval: true,
    proteinBinding: 90,
    receptorKi: { SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 10000, '5HT2A': 1.6, '5HT2C': 10000, D2: 0.3, H1: 50, alpha1: 45, alpha2: 10000, M1: 1200 }
  }
  ,{
    id: 'perphenazine',
    name: 'Perphenazine',
    brandName: 'Trilafon',
    class: 'FGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '9–12 hr', metabolites: '7-Hydroxyperphenazine: ~20 hr' },
    p450: {
      substrate: ['CYP2D6'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null },
    hepaticImpairment: { modified: true, notes: 'Use with caution' },
    geriatricDosing: { modified: true, notes: 'High EPS risk; use with caution' },
    qtInterval: true,
    proteinBinding: 90,
    receptorKi: { SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 10000, '5HT2A': 2.1, '5HT2C': 3.3, D2: 0.5, H1: 8, alpha1: 10, alpha2: 10000, M1: 500 }
  }
  ,{
    id: 'thiothixene',
    name: 'Thiothixene',
    brandName: 'Navane',
    class: 'FGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '~34 hr', metabolites: 'None significant' },
    p450: {
      substrate: ['CYP1A2'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null },
    hepaticImpairment: { modified: true, notes: 'Use with caution' },
    geriatricDosing: { modified: true, notes: 'High EPS risk; avoid (Beers List)' },
    qtInterval: true,
    proteinBinding: 99,
    receptorKi: { SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 10000, '5HT2A': 25, '5HT2C': 10000, D2: 0.5, H1: 10, alpha1: 35, alpha2: 10000, M1: 10000 }
  }
  ,{
    id: 'pimozide',
    name: 'Pimozide',
    brandName: 'Orap',
    class: 'FGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '55 hr', metabolites: 'None significant' },
    p450: {
      substrate: ['CYP3A4', 'CYP1A2'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null },
    hepaticImpairment: { modified: true, notes: 'Use with caution' },
    geriatricDosing: { modified: true, notes: 'High EPS and QT risk; use with great caution' },
    qtInterval: true,
    proteinBinding: 99,
    receptorKi: { SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 10000, '5HT2A': 10000, '5HT2C': 10000, D2: 1.0, H1: 10000, alpha1: 10000, alpha2: 10000, M1: 10000 },
    mechanism: 'D2 receptor antagonist; also a calcium channel blocker (cardiac Na/K/Ca channels); FDA approved for Tourette syndrome; significant QT prolongation risk — requires ECG monitoring; many drug interactions via CYP3A4'
  }
  ,{
    id: 'thioridazine',
    name: 'Thioridazine',
    brandName: 'Mellaril',
    class: 'FGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '10–36 hr', metabolites: 'None significant' },
    p450: {
      substrate: ['CYP2D6'],
      inhibits: { 'CYP2D6': 'moderate' },
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null },
    hepaticImpairment: { modified: true, notes: 'Avoid or use with extreme caution' },
    geriatricDosing: { modified: true, notes: 'Avoid (Beers List); very high anticholinergic/QT burden' },
    qtInterval: true,
    proteinBinding: 99,
    receptorKi: { SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 10000, '5HT2A': 6, '5HT2C': 10000, D2: 3, H1: 4, alpha1: 6, alpha2: 10000, M1: 5 }
  }
  ,{
    id: 'loxapine',
    name: 'Loxapine',
    brandName: 'Loxitane',
    class: 'FGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '8–12 hr', metabolites: 'None significant' },
    p450: {
      substrate: ['CYP1A2', 'CYP2D6', 'CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null },
    hepaticImpairment: { modified: true, notes: 'Use with caution' },
    geriatricDosing: { modified: true, notes: 'High EPS/sedation risk' },
    qtInterval: true,
    proteinBinding: 97,
    receptorKi: { SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 10000, '5HT2A': 2, '5HT2C': 10000, D2: 10, H1: 4, alpha1: 14, alpha2: 10000, M1: 200 }
  }
  ,{
    id: 'molindone',
    name: 'Molindone',
    brandName: 'Moban',
    class: 'FGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '~1.5 hr (parent); active metabolites ~24 hr', metabolites: 'Active metabolites: ~24 hr' },
    p450: {
      substrate: ['CYP2D6'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null },
    hepaticImpairment: { modified: true, notes: 'Use with caution' },
    geriatricDosing: { modified: true, notes: 'Use with caution; EPS risk' },
    qtInterval: true,
    proteinBinding: 76,
    receptorKi: { SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 10000, '5HT2A': 10000, '5HT2C': 10000, D2: 7, H1: 10000, alpha1: 100, alpha2: 10000, M1: 10000 }
  }

  // ── Additional SGAs ─────────────────────────────────────────────────────
  ,{
    id: 'paliperidone',
    name: 'Paliperidone',
    brandName: 'Invega',
    class: 'SGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: true, name: '9-Hydroxyrisperidone (active metabolite of risperidone)' },
    halfLife: { drug: '23 hr', metabolites: 'None (primarily renal elimination)' },
    p450: {
      substrate: ['CYP3A4', 'CYP2D6'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'Reduce dose (CrCl 50–79: max 6 mg; CrCl 10–49: max 3 mg)', severe: 'Avoid if CrCl <10' },
    hepaticImpairment: { modified: false, notes: 'No adjustment needed (renal elimination)' },
    geriatricDosing: { modified: true, notes: 'Renal function decreases with age; dose-adjust accordingly' },
    qtInterval: true,
    proteinBinding: 74,
    receptorKi: { SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 10000, '5HT2A': 0.5, '5HT2C': 10000, D2: 2.0, D3: 10, H1: 6, alpha1: 1.0, alpha2: 10000, M1: 10000 }
  }
  ,{
    id: 'iloperidone',
    name: 'Iloperidone',
    brandName: 'Fanapt',
    class: 'SGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '18 hr', metabolites: 'P88, P95: 26–37 hr' },
    p450: {
      substrate: ['CYP2D6', 'CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null },
    hepaticImpairment: { modified: true, notes: 'Avoid in hepatic impairment' },
    geriatricDosing: { modified: false, notes: null },
    qtInterval: true,
    proteinBinding: 95,
    receptorKi: { SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 10000, '5HT2A': 0.3, '5HT2C': 10000, D2: 7, D3: 10, H1: 40, alpha1: 0.4, alpha2: 10000, M1: 10000 }
  }
  ,{
    id: 'brexpiprazole',
    name: 'Brexpiprazole',
    brandName: 'Rexulti',
    class: 'SGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '91 hr', metabolites: 'None significant' },
    p450: {
      substrate: ['CYP2D6', 'CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'Max 2 mg/day (CrCl <60)', severe: 'Max 2 mg/day' },
    hepaticImpairment: { modified: true, notes: 'Max 2 mg/day in moderate-severe' },
    geriatricDosing: { modified: false, notes: null },
    qtInterval: false,
    proteinBinding: 99,
    receptorKi: { SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 0.12, '5HT2A': 0.47, '5HT2C': 2.1, D2: 0.3, D3: 1.1, H1: 19, alpha1: 0.6, alpha2: 0.5, M1: 10000 }
  }
  ,{
    id: 'cariprazine',
    name: 'Cariprazine',
    brandName: 'Vraylar',
    class: 'SGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '2–4 days', metabolites: 'DCAR: 1–3 days; DDCAR: 1–3 weeks' },
    p450: {
      substrate: ['CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: 'No dose adjustment needed (mild-moderate)', severe: null },
    hepaticImpairment: { modified: true, notes: 'Avoid in severe hepatic impairment' },
    geriatricDosing: { modified: false, notes: null },
    qtInterval: false,
    proteinBinding: 91,
    receptorKi: { SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 2.6, '5HT2A': 18, '5HT2C': 134, D2: 0.49, D3: 0.08, H1: 40, alpha1: 155, alpha2: 10000, M1: 10000 }
  }
  ,{
    id: 'lumateperone',
    name: 'Lumateperone',
    brandName: 'Caplyta',
    class: 'SGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '18 hr', metabolites: 'None significant' },
    p450: {
      substrate: ['CYP3A4', 'CYP2C8'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null },
    hepaticImpairment: { modified: true, notes: 'Avoid in moderate-severe (Child-Pugh B/C)' },
    geriatricDosing: { modified: false, notes: null },
    qtInterval: false,
    proteinBinding: 97,
    receptorKi: { SERT: 62, NET: 10000, DAT: 10000, '5HT1A': 10000, '5HT2A': 0.54, '5HT2C': 10000, D2: 32, D3: 10000, H1: 10000, alpha1: 10000, alpha2: 10000, M1: 10000 }
  }
  ,{
    id: 'pimavanserin',
    name: 'Pimavanserin',
    brandName: 'Nuplazid',
    class: 'SGA',
    category: 'Antipsychotic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '57 hr', metabolites: 'Active metabolite: ~200 hr' },
    p450: {
      substrate: ['CYP3A4', 'CYP3A5'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null },
    hepaticImpairment: { modified: true, notes: 'Avoid in hepatic impairment (not studied)' },
    geriatricDosing: { modified: false, notes: 'Main population; well studied in elderly with PD psychosis' },
    qtInterval: true,
    proteinBinding: 95,
    receptorKi: { SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 10000, '5HT2A': 0.08, '5HT2C': 0.3, D2: 10000, D3: 10000, H1: 10000, alpha1: 10000, alpha2: 10000, M1: 10000 }
  }

  // ── Additional Mood Stabilizers ─────────────────────────────────────────
  ,{
    id: 'oxcarbazepine',
    name: 'Oxcarbazepine',
    brandName: 'Trileptal',
    class: 'Mood Stabilizer',
    category: 'Mood Stabilizer',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: 'Parent very short; MHD (active metabolite): 8–10 hr', metabolites: 'MHD (eslicarbazepine): 8–10 hr' },
    p450: {
      substrate: [],
      inhibits: { 'CYP2C19': 'moderate' },
      induces: ['CYP3A4']
    },
    renalImpairment: { modified: true, moderate: 'Reduce starting dose by 50% (CrCl <30)', severe: 'Monitor closely' },
    hepaticImpairment: { modified: false, notes: 'No adjustment mild-moderate; avoid severe' },
    geriatricDosing: { modified: false, notes: 'Monitor sodium; hyponatremia risk' },
    qtInterval: false,
    proteinBinding: 40,
    receptorKi: null,
    mechanism: 'Sodium channel blocker (voltage-gated Na⁺ channels); active metabolite (MHD) responsible for anticonvulsant and mood-stabilizing effects; less drug interaction burden than carbamazepine; hyponatremia risk more pronounced than carbamazepine'
  }
  ,{
    id: 'topiramate',
    name: 'Topiramate',
    brandName: 'Topamax',
    class: 'Mood Stabilizer',
    category: 'Mood Stabilizer',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '21 hr', metabolites: 'None active' },
    p450: {
      substrate: ['CYP2C19', 'CYP3A4'],
      inhibits: { 'CYP2C19': 'weak' },
      induces: ['CYP3A4']
    },
    renalImpairment: { modified: true, moderate: 'Reduce dose 50% (CrCl <70)', severe: 'Hemodialysis patients supplement dose' },
    hepaticImpairment: { modified: true, notes: 'Use with caution' },
    geriatricDosing: { modified: false, notes: null },
    qtInterval: false,
    proteinBinding: 15,
    receptorKi: null,
    mechanism: 'Multiple mechanisms: voltage-gated Na⁺ channel blockade; GABA-A PAM at non-BZD site; AMPA/kainate glutamate receptor antagonism; carbonic anhydrase inhibition; weight loss is common (unique among anticonvulsants); cognitive side effects ("dopamax")'
  }
  ,{
    id: 'gabapentin',
    name: 'Gabapentin',
    brandName: 'Neurontin',
    class: 'Gabapentinoid',
    category: 'Mood Stabilizer',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '5–7 hr', metabolites: 'None active' },
    p450: {
      substrate: [],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'Reduce based on CrCl (see full prescribing info)', severe: 'Supplement dose after dialysis' },
    hepaticImpairment: { modified: false, notes: null },
    geriatricDosing: { modified: false, notes: 'Reduce dose for age-related renal decline' },
    qtInterval: false,
    proteinBinding: 3,
    receptorKi: null,
    mechanism: 'Binds α₂δ subunit of voltage-gated calcium channels; reduces excitatory neurotransmitter release; despite name, does not act on GABA receptors; used for neuropathic pain, fibromyalgia, seizures, restless legs syndrome, anxiety (off-label)'
  }

  // ── Benzodiazepines (Anxiolytics) ───────────────────────────────────────
  ,{
    id: 'alprazolam',
    name: 'Alprazolam',
    brandName: 'Xanax',
    class: 'Benzodiazepine',
    category: 'Anxiolytic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '6–12 hr', metabolites: 'Alpha-hydroxyalprazolam: 6–12 hr (less active)' },
    p450: {
      substrate: ['CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null },
    hepaticImpairment: { modified: true, notes: 'Reduce dose; avoid in severe' },
    geriatricDosing: { modified: true, notes: 'Avoid (Beers List); fall/cognitive risk; reduce dose if needed' },
    qtInterval: false,
    proteinBinding: 80,
    receptorKi: { 'GABA-A': 1.0 },
    mechanism: 'GABA-A receptor positive allosteric modulator (BZD site); enhances Cl⁻ influx frequency; high-potency BZD; approved for anxiety and panic disorder; notable for rapid onset; significant dependence potential'
  }
  ,{
    id: 'clonazepam',
    name: 'Clonazepam',
    brandName: 'Klonopin',
    class: 'Benzodiazepine',
    category: 'Anxiolytic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '18–50 hr', metabolites: 'None active' },
    p450: {
      substrate: ['CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null },
    hepaticImpairment: { modified: true, notes: 'Use with caution; avoid in severe' },
    geriatricDosing: { modified: true, notes: 'Avoid (Beers List); long half-life increases fall/cognitive risk' },
    qtInterval: false,
    proteinBinding: 85,
    receptorKi: { 'GABA-A': 1.0 },
    mechanism: 'GABA-A receptor positive allosteric modulator (BZD site); high potency; long half-life; approved for seizures and panic disorder; also used off-label for anxiety, akathisia, REM sleep behavior disorder'
  }
  ,{
    id: 'diazepam',
    name: 'Diazepam',
    brandName: 'Valium',
    class: 'Benzodiazepine',
    category: 'Anxiolytic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '20–70 hr', metabolites: 'Nordiazepam (active): 36–200 hr; desmethyldiazepam' },
    p450: {
      substrate: ['CYP2C19', 'CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null },
    hepaticImpairment: { modified: true, notes: 'Reduce dose; prolonged half-life' },
    geriatricDosing: { modified: true, notes: 'Avoid (Beers List); extremely long half-life accumulation risk' },
    qtInterval: false,
    proteinBinding: 99,
    receptorKi: { 'GABA-A': 5.0 },
    mechanism: 'GABA-A receptor positive allosteric modulator (BZD site); long half-life with very long-acting active metabolites; used for anxiety, muscle relaxation, alcohol withdrawal, seizures; significant accumulation in elderly'
  }
  ,{
    id: 'lorazepam',
    name: 'Lorazepam',
    brandName: 'Ativan',
    class: 'Benzodiazepine',
    category: 'Anxiolytic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '10–20 hr', metabolites: 'None active (direct glucuronidation)' },
    p450: {
      substrate: [],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null },
    hepaticImpairment: { modified: false, notes: 'Safer than other BZDs in liver disease (direct glucuronidation)' },
    geriatricDosing: { modified: true, notes: 'Reduce dose (Beers List); no active metabolites preferred in elderly' },
    qtInterval: false,
    proteinBinding: 91,
    receptorKi: { 'GABA-A': 2.0 },
    mechanism: 'GABA-A receptor positive allosteric modulator (BZD site); medium-potency; direct glucuronidation — safer in hepatic disease; no active metabolites; parenteral forms available for status epilepticus'
  }
  ,{
    id: 'oxazepam',
    name: 'Oxazepam',
    brandName: 'Serax',
    class: 'Benzodiazepine',
    category: 'Anxiolytic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '4–15 hr', metabolites: 'None active (direct glucuronidation)' },
    p450: {
      substrate: [],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null },
    hepaticImpairment: { modified: false, notes: 'Safer — direct glucuronidation; preferred in liver disease' },
    geriatricDosing: { modified: false, notes: 'One of the safest BZDs in elderly (LOT rule: Lorazepam, Oxazepam, Temazepam); no active metabolites' },
    qtInterval: false,
    proteinBinding: 97,
    receptorKi: { 'GABA-A': 8.0 },
    mechanism: 'GABA-A receptor positive allosteric modulator (BZD site); short-to-medium half-life; direct glucuronidation (like lorazepam/temazepam — "LOT" BZDs); no active metabolites; preferred in elderly and hepatic impairment'
  }
  ,{
    id: 'chlordiazepoxide',
    name: 'Chlordiazepoxide',
    brandName: 'Librium',
    class: 'Benzodiazepine',
    category: 'Anxiolytic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '5–30 hr', metabolites: 'Demoxepam, desmethylchlordiazepoxide, nordiazepam: up to 200 hr' },
    p450: {
      substrate: ['CYP3A4', 'CYP2C19'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null },
    hepaticImpairment: { modified: true, notes: 'Use with caution; very long-acting metabolites' },
    geriatricDosing: { modified: true, notes: 'Avoid (Beers List); very long half-life chain accumulates' },
    qtInterval: false,
    proteinBinding: 96,
    receptorKi: { 'GABA-A': 10.0 },
    mechanism: 'GABA-A receptor positive allosteric modulator (BZD site); first clinically used BZD (1960); classic agent for alcohol withdrawal (CIWA protocol); very long-acting due to multiple active metabolites'
  }
  ,{
    id: 'clorazepate',
    name: 'Clorazepate',
    brandName: 'Tranxene',
    class: 'Benzodiazepine',
    category: 'Anxiolytic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: 'Parent very short (prodrug); nordiazepam: 36–200 hr', metabolites: 'Nordiazepam: 36–200 hr' },
    p450: {
      substrate: [],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null },
    hepaticImpairment: { modified: true, notes: 'Use with caution; nordiazepam accumulates' },
    geriatricDosing: { modified: true, notes: 'Avoid (Beers List)' },
    qtInterval: false,
    proteinBinding: 97,
    receptorKi: { 'GABA-A': 5.0 },
    mechanism: 'Prodrug: converted by GI acid to nordiazepam (active, the same metabolite as diazepam); GABA-A PAM; used for anxiety and seizures; long-acting due to nordiazepam'
  }
  ,{
    id: 'midazolam',
    name: 'Midazolam',
    brandName: 'Versed',
    class: 'Benzodiazepine',
    category: 'Anxiolytic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '1.5–2.5 hr', metabolites: '1-Hydroxymidazolam: ~1 hr' },
    p450: {
      substrate: ['CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null },
    hepaticImpairment: { modified: true, notes: 'Reduce dose; avoid in severe' },
    geriatricDosing: { modified: true, notes: 'Reduce dose significantly; higher sensitivity to respiratory depression' },
    qtInterval: false,
    proteinBinding: 97,
    receptorKi: { 'GABA-A': 2.0 },
    mechanism: 'GABA-A receptor positive allosteric modulator (BZD site); ultra-short acting; water-soluble at acidic pH; parenteral form for procedural sedation/anesthesia; high potency; rapid onset; used in ICU sedation'
  }
  ,{
    id: 'triazolam',
    name: 'Triazolam',
    brandName: 'Halcion',
    class: 'Benzodiazepine',
    category: 'Anxiolytic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '1.5–5.5 hr', metabolites: 'None active' },
    p450: {
      substrate: ['CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null },
    hepaticImpairment: { modified: true, notes: 'Avoid in severe' },
    geriatricDosing: { modified: true, notes: 'Avoid (Beers List); very high potency' },
    qtInterval: false,
    proteinBinding: 89,
    receptorKi: { 'GABA-A': 0.3 },
    mechanism: 'GABA-A receptor positive allosteric modulator (BZD site); very short half-life; very high potency; used for insomnia; significant next-day amnesia and rebound insomnia risk'
  }
  ,{
    id: 'estazolam',
    name: 'Estazolam',
    brandName: 'Prosom',
    class: 'Benzodiazepine',
    category: 'Anxiolytic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '10–24 hr', metabolites: 'None active' },
    p450: {
      substrate: ['CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null },
    hepaticImpairment: { modified: true, notes: 'Use with caution' },
    geriatricDosing: { modified: true, notes: 'Avoid (Beers List)' },
    qtInterval: false,
    proteinBinding: 93,
    receptorKi: { 'GABA-A': 1.5 },
    mechanism: 'GABA-A receptor positive allosteric modulator (BZD site); intermediate half-life; indicated for insomnia; Schedule IV controlled substance'
  }
  ,{
    id: 'flurazepam',
    name: 'Flurazepam',
    brandName: 'Dalmane',
    class: 'Benzodiazepine',
    category: 'Anxiolytic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '2–3 hr (parent)', metabolites: 'Desalkylflurazepam (active): 47–100 hr' },
    p450: {
      substrate: ['CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null },
    hepaticImpairment: { modified: true, notes: 'Use with caution; long-acting metabolites accumulate' },
    geriatricDosing: { modified: true, notes: 'Avoid (Beers List); extreme accumulation risk with long-lived metabolite' },
    qtInterval: false,
    proteinBinding: 97,
    receptorKi: { 'GABA-A': 1.0 },
    mechanism: 'GABA-A receptor positive allosteric modulator (BZD site); effective sleep induction but very long-acting active metabolite causes next-day sedation; poor choice for elderly'
  }

  // ── Other Anxiolytics ───────────────────────────────────────────────────
  ,{
    id: 'buspirone',
    name: 'Buspirone',
    brandName: 'BuSpar',
    class: 'Azapirone',
    category: 'Anxiolytic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '2–3 hr', metabolites: '1-PP (active): alpha2/D2 antagonist' },
    p450: {
      substrate: ['CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'Reduce dose; use with caution', severe: 'Avoid' },
    hepaticImpairment: { modified: true, notes: 'Reduce dose; avoid in severe' },
    geriatricDosing: { modified: false, notes: 'Good option; no abuse potential' },
    qtInterval: false,
    proteinBinding: 86,
    receptorKi: { SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 40, '5HT2A': 10000, '5HT2C': 10000, D2: 190, D3: 10000, H1: 10000, alpha1: 10000, alpha2: 10000, M1: 10000 }
  }
  ,{
    id: 'pregabalin',
    name: 'Pregabalin',
    brandName: 'Lyrica',
    class: 'Gabapentinoid',
    category: 'Anxiolytic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '6 hr', metabolites: 'None active' },
    p450: {
      substrate: [],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'Reduce dose proportional to CrCl', severe: 'Significant reduction; dialysis supplement' },
    hepaticImpairment: { modified: false, notes: null },
    geriatricDosing: { modified: false, notes: 'Reduce dose for age-related renal function decline' },
    qtInterval: false,
    proteinBinding: 0,
    receptorKi: null,
    mechanism: 'Binds α₂δ subunit of voltage-gated calcium channels; reduces excitatory neurotransmitter release; FDA-approved for anxiety (GAD), neuropathic pain, fibromyalgia, partial seizures; higher bioavailability and faster absorption than gabapentin; Schedule V in US'
  }
  ,{
    id: 'propranolol',
    name: 'Propranolol',
    brandName: 'Inderal',
    class: 'Beta Blocker',
    category: 'Anxiolytic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '3–6 hr', metabolites: 'None active' },
    p450: {
      substrate: ['CYP1A2', 'CYP2D6'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null },
    hepaticImpairment: { modified: true, notes: 'Reduce dose in significant hepatic disease' },
    geriatricDosing: { modified: false, notes: 'Use caution due to bradycardia/hypotension risk' },
    qtInterval: false,
    proteinBinding: 90,
    receptorKi: null,
    mechanism: 'Non-selective β1/β2 adrenergic receptor antagonist; lipophilic — crosses BBB; reduces peripheral manifestations of anxiety (tachycardia, tremor); used off-label for performance anxiety; also used for essential tremor, hypertension, post-MI; not a controlled substance; does not treat psychological anxiety'
  }
  ,{
    id: 'clonidine',
    name: 'Clonidine',
    brandName: 'Catapres',
    class: 'Alpha-2 Agonist',
    category: 'Anxiolytic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '12–16 hr', metabolites: 'None active' },
    p450: {
      substrate: ['CYP2D6'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'Reduce dose', severe: 'Significant reduction' },
    hepaticImpairment: { modified: false, notes: 'Use with caution' },
    geriatricDosing: { modified: false, notes: 'Monitor blood pressure carefully' },
    qtInterval: false,
    proteinBinding: 30,
    receptorKi: { SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 10000, '5HT2A': 10000, '5HT2C': 10000, D2: 10000, D3: 10000, H1: 10000, alpha1: 50, alpha2: 0.5, M1: 10000 }
  }
  ,{
    id: 'guanfacine',
    name: 'Guanfacine',
    brandName: 'Tenex / Intuniv',
    class: 'Alpha-2 Agonist',
    category: 'Anxiolytic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: 'IR: 17 hr; ER: ~18 hr', metabolites: 'None significant' },
    p450: {
      substrate: ['CYP3A4'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'No specific adjustment needed', severe: 'Possible dose reduction' },
    hepaticImpairment: { modified: false, notes: null },
    geriatricDosing: { modified: false, notes: null },
    qtInterval: false,
    proteinBinding: 70,
    receptorKi: { SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 10000, '5HT2A': 10000, '5HT2C': 10000, D2: 10000, D3: 10000, H1: 10000, alpha1: 10000, alpha2: 3, M1: 10000 }
  }

  // ── Antihistamines / Sleep ──────────────────────────────────────────────
  ,{
    id: 'doxylamine',
    name: 'Doxylamine',
    brandName: 'Unisom / Diclegis',
    class: 'Antihistamine',
    category: 'Sleep',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '10 hr', metabolites: 'None active' },
    p450: {
      substrate: ['CYP2D6', 'CYP1A2'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null },
    hepaticImpairment: { modified: false, notes: null },
    geriatricDosing: { modified: true, notes: 'Avoid (Beers List); anticholinergic burden + fall risk' },
    qtInterval: false,
    proteinBinding: 73,
    receptorKi: { SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 10000, '5HT2A': 10000, '5HT2C': 10000, D2: 10000, H1: 0.5, alpha1: 10000, alpha2: 10000, M1: 50 }
  }

  // ── Stimulants ──────────────────────────────────────────────────────────
  ,{
    id: 'methylphenidate',
    name: 'Methylphenidate',
    brandName: 'Ritalin',
    class: 'Stimulant',
    category: 'Stimulant',
    activeEnantiomer: { has: true, name: 'd-threo enantiomer (active)' },
    halfLife: { drug: '2–3 hr (IR)', metabolites: 'Ritalinic acid (inactive)' },
    p450: {
      substrate: [],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null },
    hepaticImpairment: { modified: false, notes: null },
    geriatricDosing: { modified: false, notes: null },
    qtInterval: false,
    proteinBinding: 15,
    receptorKi: { SERT: 10000, NET: 130, DAT: 34, '5HT1A': 10000, '5HT2A': 10000, '5HT2C': 10000, D2: 10000, D3: 10000, H1: 10000, alpha1: 10000, alpha2: 10000, M1: 10000 }
  }
  ,{
    id: 'dexmethylphenidate',
    name: 'Dexmethylphenidate',
    brandName: 'Focalin',
    class: 'Stimulant',
    category: 'Stimulant',
    activeEnantiomer: { has: true, name: 'd-threo-methylphenidate (active enantiomer of methylphenidate)' },
    halfLife: { drug: '~2.2 hr', metabolites: 'None significant' },
    p450: {
      substrate: [],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null },
    hepaticImpairment: { modified: false, notes: null },
    geriatricDosing: { modified: false, notes: null },
    qtInterval: false,
    proteinBinding: 15,
    receptorKi: { SERT: 10000, NET: 130, DAT: 34, '5HT1A': 10000, '5HT2A': 10000, '5HT2C': 10000, D2: 10000, D3: 10000, H1: 10000, alpha1: 10000, alpha2: 10000, M1: 10000 },
    mechanism: 'd-threo isomer of methylphenidate; pharmacologically equivalent but ~2× more potent (only active enantiomer); same DAT/NET reuptake inhibition; ER formulation (Focalin XR) provides bimodal release'
  }
  ,{
    id: 'amphetamine-mixed-salts',
    name: 'Amphetamine Mixed Salts',
    brandName: 'Adderall',
    class: 'Stimulant',
    category: 'Stimulant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: 'd-amphetamine: 10–12 hr; l-amphetamine: 11–14 hr', metabolites: 'None significant' },
    p450: {
      substrate: ['CYP2D6'],
      inhibits: { 'CYP2D6': 'weak' },
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'Use with caution', severe: 'Reduce dose; alkaline urine increases half-life' },
    hepaticImpairment: { modified: false, notes: null },
    geriatricDosing: { modified: false, notes: null },
    qtInterval: false,
    proteinBinding: 25,
    receptorKi: { SERT: 100, NET: 20, DAT: 10, '5HT1A': 10000, '5HT2A': 10000, '5HT2C': 10000, D2: 10000, D3: 10000, H1: 10000, alpha1: 10000, alpha2: 10000, M1: 10000 },
    mechanism: 'Monoamine releasing agent: reverses DAT/NET/SERT to release dopamine, norepinephrine, serotonin into synapse; also displaces vesicular storage via VMAT2; weak MAO inhibitor; approved for ADHD and narcolepsy; urine pH affects clearance (acidic → faster elimination)'
  }
  ,{
    id: 'dextroamphetamine',
    name: 'Dextroamphetamine',
    brandName: 'Dexedrine',
    class: 'Stimulant',
    category: 'Stimulant',
    activeEnantiomer: { has: true, name: 'd-amphetamine (active enantiomer)' },
    halfLife: { drug: '10–12 hr', metabolites: 'None significant' },
    p450: {
      substrate: ['CYP2D6'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null },
    hepaticImpairment: { modified: false, notes: null },
    geriatricDosing: { modified: false, notes: null },
    qtInterval: false,
    proteinBinding: 20,
    receptorKi: { SERT: 100, NET: 18, DAT: 8, '5HT1A': 10000, '5HT2A': 10000, '5HT2C': 10000, D2: 10000, D3: 10000, H1: 10000, alpha1: 10000, alpha2: 10000, M1: 10000 }
  }
  ,{
    id: 'lisdexamfetamine',
    name: 'Lisdexamfetamine',
    brandName: 'Vyvanse',
    class: 'Stimulant',
    category: 'Stimulant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: 'Parent: <1 hr; d-amphetamine produced: 10–12 hr', metabolites: 'd-Amphetamine: 10–12 hr' },
    p450: {
      substrate: [],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'Max 50 mg/day (CrCl 15–29)', severe: 'Max 30 mg/day' },
    hepaticImpairment: { modified: false, notes: null },
    geriatricDosing: { modified: false, notes: null },
    qtInterval: false,
    proteinBinding: 98,
    receptorKi: { SERT: 100, NET: 18, DAT: 8, '5HT1A': 10000, '5HT2A': 10000, '5HT2C': 10000, D2: 10000, D3: 10000, H1: 10000, alpha1: 10000, alpha2: 10000, M1: 10000 },
    mechanism: 'Prodrug of d-amphetamine; cleaved in RBCs by peptidases; abuse-deterrent formulation (oral route-specific activation); same pharmacology as dextroamphetamine once cleaved; also FDA-approved for binge eating disorder'
  }
  ,{
    id: 'modafinil',
    name: 'Modafinil',
    brandName: 'Provigil',
    class: 'Wake-Promoting Agent',
    category: 'Stimulant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '12–15 hr', metabolites: 'Modafinil acid/sulfone (inactive)' },
    p450: {
      substrate: ['CYP3A4'],
      inhibits: { 'CYP2C19': 'moderate' },
      induces: ['CYP3A4', 'CYP1A2']
    },
    renalImpairment: { modified: false, moderate: null, severe: null },
    hepaticImpairment: { modified: true, notes: 'Reduce dose by 50% in severe' },
    geriatricDosing: { modified: false, notes: 'Consider lower dose' },
    qtInterval: false,
    proteinBinding: 60,
    receptorKi: { SERT: 10000, NET: 10000, DAT: 4600, '5HT1A': 10000, '5HT2A': 10000, '5HT2C': 10000, D2: 10000, H1: 10000, alpha1: 10000, alpha2: 10000, M1: 10000 },
    mechanism: 'Weak DAT inhibitor; promotes wakefulness via increased histamine in hypothalamus, reduced GABA, increased norepinephrine and orexin signaling; exact mechanism not fully characterized; Schedule IV; FDA-approved for narcolepsy, shift work sleep disorder, OSA-related sleepiness'
  }
  ,{
    id: 'armodafinil',
    name: 'Armodafinil',
    brandName: 'Nuvigil',
    class: 'Wake-Promoting Agent',
    category: 'Stimulant',
    activeEnantiomer: { has: true, name: 'R-enantiomer of modafinil' },
    halfLife: { drug: '13–15 hr', metabolites: 'None significant' },
    p450: {
      substrate: ['CYP3A4'],
      inhibits: { 'CYP2C19': 'moderate' },
      induces: ['CYP3A4']
    },
    renalImpairment: { modified: false, moderate: null, severe: null },
    hepaticImpairment: { modified: true, notes: 'Reduce dose by 50% in severe' },
    geriatricDosing: { modified: false, notes: null },
    qtInterval: false,
    proteinBinding: 60,
    receptorKi: { SERT: 10000, NET: 10000, DAT: 4600, '5HT1A': 10000, '5HT2A': 10000, '5HT2C': 10000, D2: 10000, H1: 10000, alpha1: 10000, alpha2: 10000, M1: 10000 },
    mechanism: 'R-enantiomer of modafinil; longer duration of action; same mechanism as modafinil (DAT inhibition, histaminergic wakefulness promotion); FDA-approved for narcolepsy, shift work disorder, OSA; Schedule IV'
  }
  ,{
    id: 'solriamfetol',
    name: 'Solriamfetol',
    brandName: 'Sunosi',
    class: 'Wake-Promoting Agent',
    category: 'Stimulant',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '7 hr', metabolites: 'None active' },
    p450: {
      substrate: [],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'Max 75 mg/day (CrCl 15–59)', severe: 'Avoid (CrCl <15)' },
    hepaticImpairment: { modified: false, notes: null },
    geriatricDosing: { modified: false, notes: null },
    qtInterval: false,
    proteinBinding: 13,
    receptorKi: { SERT: 10000, NET: 21, DAT: 53, '5HT1A': 10000, '5HT2A': 10000, '5HT2C': 10000, D2: 10000, D3: 10000, H1: 10000, alpha1: 10000, alpha2: 10000, M1: 10000 }
  }

  // ── Anticholinergics / Antihistamines ───────────────────────────────────
  ,{
    id: 'hydroxyzine',
    name: 'Hydroxyzine',
    brandName: 'Vistaril',
    class: 'Antihistamine',
    category: 'Anxiolytic',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '20–25 hr', metabolites: 'Cetirizine: 8–10 hr' },
    p450: {
      substrate: ['CYP2D6'],
      inhibits: { 'CYP2D6': 'weak' },
      induces: []
    },
    renalImpairment: { modified: true, moderate: 'Reduce dose', severe: 'Reduce dose; monitor' },
    hepaticImpairment: { modified: true, notes: 'Reduce dose; extend interval' },
    geriatricDosing: { modified: true, notes: 'Use with caution (Beers List); anticholinergic burden' },
    qtInterval: true,
    proteinBinding: 93,
    receptorKi: { SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 10000, '5HT2A': 10000, '5HT2C': 10000, D2: 10000, H1: 0.6, alpha1: 7, alpha2: 10000, M1: 200 }
  }
  ,{
    id: 'diphenhydramine',
    name: 'Diphenhydramine',
    brandName: 'Benadryl',
    class: 'Antihistamine',
    category: 'Other',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '4–8 hr', metabolites: 'None active' },
    p450: {
      substrate: ['CYP2D6', 'CYP3A4'],
      inhibits: { 'CYP2D6': 'moderate' },
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null },
    hepaticImpairment: { modified: false, notes: null },
    geriatricDosing: { modified: true, notes: 'Avoid (Beers List); very high anticholinergic burden; confusion/delirium risk' },
    qtInterval: false,
    proteinBinding: 82,
    receptorKi: { SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 10000, '5HT2A': 10000, '5HT2C': 10000, D2: 10000, H1: 1.0, alpha1: 10000, alpha2: 10000, M1: 15 }
  }
  ,{
    id: 'trihexyphenidyl',
    name: 'Trihexyphenidyl',
    brandName: 'Artane',
    class: 'Anticholinergic',
    category: 'Other',
    activeEnantiomer: { has: false, name: null },
    halfLife: { drug: '3–4 hr', metabolites: 'None significant' },
    p450: {
      substrate: ['CYP2D6'],
      inhibits: {},
      induces: []
    },
    renalImpairment: { modified: false, moderate: null, severe: null },
    hepaticImpairment: { modified: false, notes: null },
    geriatricDosing: { modified: true, notes: 'Avoid (Beers List); high anticholinergic toxicity risk; confusion/urinary retention' },
    qtInterval: false,
    proteinBinding: 25,
    receptorKi: { SERT: 10000, NET: 10000, DAT: 10000, '5HT1A': 10000, '5HT2A': 10000, '5HT2C': 10000, D2: 10000, D3: 10000, H1: 10000, alpha1: 10000, alpha2: 10000, M1: 2 }
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

(function() {
  'use strict';

  /* ────────────────────────────────────────────────────────────────────────
     Print Forms System for PsychoPharmRef
     Defines all 15 printable clinical form templates with print() functionality
     ──────────────────────────────────────────────────────────────────────── */

  const FORMS = {
    'tisdale-qt': {
      title: 'Tisdale QT Risk Score',
      reference: 'Tisdale JE, et al. Circ Cardiovasc Qual Outcomes. 2013;6(4):479-487',
      items: [
        { num: 1, text: 'Age ≥68 years', points: 1 },
        { num: 2, text: 'Female sex', points: 1 },
        { num: 3, text: 'Loop diuretic use', points: 1 },
        { num: 4, text: 'Serum potassium ≤3.5 mEq/L', points: 2 },
        { num: 5, text: 'Admission QTc 450-499 ms', points: 2 },
        { num: 6, text: 'Acute myocardial infarction', points: 2 },
        { num: 7, text: 'Heart failure', points: 3 },
        { num: 8, text: 'Sepsis or systemic infection', points: 3 },
        { num: 9, text: 'One QT-prolonging drug', points: 3 },
        { num: 10, text: 'Two or more QT-prolonging drugs', points: 3 }
      ],
      interpretation: '≤6 = Low risk | 7-10 = Moderate risk | ≥11 = High risk'
    },
    'cdr': {
      title: 'Clinical Dementia Rating (CDR)',
      reference: 'Morris JC. Neurology. 1993;43(11):2412-2414',
      domains: [
        'Memory', 'Orientation', 'Judgment & Problem Solving',
        'Community Affairs', 'Home & Hobbies', 'Personal Care'
      ],
      scoring: 'Each domain: 0, 0.5, 1, 2, 3 | CDR-SB = sum of all domain scores',
      interpretation: 'CDR 0 = Normal | 0.5 = Very Mild | 1 = Mild | 2 = Moderate | 3 = Severe'
    },
    'aq-10': {
      title: 'Autism Quotient (AQ-10)',
      reference: 'Baron-Cohen S, et al. J Autism Dev Disord. 2001;31(1):5-17',
      items: [
        { num: 1, text: 'I often notice small sounds when others do not', scoring: 'Agree/Disagree' },
        { num: 2, text: 'I usually concentrate more on the whole picture, rather than the small details', scoring: 'Agree/Disagree' },
        { num: 3, text: 'I find it easy to do more than one thing at once', scoring: 'Agree/Disagree' },
        { num: 4, text: 'If there is an interruption, I can switch back to what I was doing very quickly', scoring: 'Agree/Disagree' },
        { num: 5, text: 'I find it easy to \'read between the lines\' when someone is talking to me', scoring: 'Agree/Disagree' },
        { num: 6, text: 'I know how to tell if someone listening to me is getting bored', scoring: 'Agree/Disagree' },
        { num: 7, text: 'When I\'m reading a story, I find it difficult to work out the characters\' intentions', scoring: 'Agree/Disagree' },
        { num: 8, text: 'I like to collect information about categories of things (e.g., types of car, types of bird, types of train, types of plant, etc.)', scoring: 'Agree/Disagree' },
        { num: 9, text: 'I find it easy to work out what someone is thinking or feeling just by looking at their face', scoring: 'Agree/Disagree' },
        { num: 10, text: 'I find it difficult to work out people\'s intentions', scoring: 'Agree/Disagree' }
      ],
      interpretation: '≥6 = Elevated (refer for evaluation) | <6 = Low'
    },
    'asrs': {
      title: 'Adult ADHD Self-Report Scale (ASRS v1.1)',
      reference: 'Kessler RC, et al. Psychol Med. 2005;35(2):245-256',
      partA: [
        { num: 1, text: 'Trouble wrapping up details' },
        { num: 2, text: 'Difficulty organizing' },
        { num: 3, text: 'Problems remembering appointments' },
        { num: 4, text: 'Avoid/delay starting tasks requiring thought' },
        { num: 5, text: 'Fidget or squirm when sitting' },
        { num: 6, text: 'Feel overly active, driven by a motor' }
      ],
      partB: [
        { num: 7, text: 'Careless mistakes on boring projects' },
        { num: 8, text: 'Difficulty keeping attention on boring work' },
        { num: 9, text: 'Difficulty concentrating when others speak' },
        { num: 10, text: 'Misplace or difficulty finding things' },
        { num: 11, text: 'Distracted by activity or noise' },
        { num: 12, text: 'Leave seat in meetings' },
        { num: 13, text: 'Feel restless or fidgety' },
        { num: 14, text: 'Difficulty unwinding and relaxing' },
        { num: 15, text: 'Talk too much in social situations' },
        { num: 16, text: 'Finish sentences of others' },
        { num: 17, text: 'Difficulty waiting your turn' },
        { num: 18, text: 'Interrupt others' }
      ],
      scoring: 'Never / Rarely / Sometimes / Often / Very Often',
      interpretation: 'Part A: ≥4 items in shaded range (for items 1-3: Often/Very Often; for items 4-6: Very Often) = Positive screen'
    },
    'cidi': {
      title: 'CIDI 3.0 Bipolar Screening',
      reference: 'Kessler RC, et al. Am J Psychiatry. 2006;163(10):1762-1769',
      stems: [
        { num: 1, text: 'Have you ever had a period of several days or more when you were so excited, elevated, or high that you were in a much better mood than usual?' },
        { num: 2, text: 'Have you ever had a period of several days or more when you felt so irritable that you started fights or insulted people?' },
        { num: 3, text: 'During one of these episodes of elevated/irritable mood, did you have any of the following symptoms?' }
      ],
      symptoms: [
        'Extreme irritability (shouting, fights, arguments)',
        'Restlessness or agitation (pacing, inability to sit still)',
        'Unusual or embarrassing behavior (oversharing, disinhibition)',
        'Inflated self-esteem or special powers/talents',
        'Increased goal-directed activity (multiple new projects)',
        'Difficulty concentrating',
        'Racing or jumping thoughts',
        'Decreased need for sleep (≤4 hours without fatigue)',
        'Excessive spending with financial consequences'
      ],
      scoring: 'Yes/No for all items',
      interpretation: 'Positive if: stem questions + ≥1 Criterion B symptom. Risk assessment based on total symptoms.'
    },
    'ymrs': {
      title: 'Young Mania Rating Scale (YMRS)',
      reference: 'Young RC, et al. Br J Psychiatry. 1978;133:429-435',
      items: [
        { num: 1, text: 'Elevated Mood', max: 4 },
        { num: 2, text: 'Increased Motor Activity–Energy', max: 4 },
        { num: 3, text: 'Sexual Interest', max: 4 },
        { num: 4, text: 'Sleep', max: 4 },
        { num: 5, text: 'Irritability', max: 8 },
        { num: 6, text: 'Speech (Rate/Amount)', max: 8 },
        { num: 7, text: 'Language–Thought Disorder', max: 4 },
        { num: 8, text: 'Content', max: 8 },
        { num: 9, text: 'Disruptive–Aggressive Behavior', max: 8 },
        { num: 10, text: 'Appearance', max: 4 },
        { num: 11, text: 'Insight', max: 4 }
      ],
      scoring: '0-4 scale (double-weight items 5-6, 8-9)',
      interpretation: '<12 = Remission | 12-19 = Mild | 20-25 = Moderate | ≥26 = Severe'
    },
    'pcl5': {
      title: 'PCL-5 (PTSD Checklist for DSM-5)',
      reference: 'Weathers FW, et al. National Center for PTSD. 2013',
      clusters: {
        B: [
          { num: 1, text: 'Repeated, disturbing, and unwanted memories' },
          { num: 2, text: 'Repeated, disturbing dreams' },
          { num: 3, text: 'Feeling as if stressful experience is happening again' },
          { num: 4, text: 'Feeling very upset when reminded' },
          { num: 5, text: 'Strong physical reactions when reminded' }
        ],
        C: [
          { num: 6, text: 'Avoiding memories, thoughts, or feelings' },
          { num: 7, text: 'Avoiding external reminders' }
        ],
        D: [
          { num: 8, text: 'Trouble remembering important parts' },
          { num: 9, text: 'Strong negative beliefs' },
          { num: 10, text: 'Blaming yourself or someone else' },
          { num: 11, text: 'Strong negative feelings' },
          { num: 12, text: 'Loss of interest in activities' },
          { num: 13, text: 'Feeling distant from others' },
          { num: 14, text: 'Difficulty experiencing positive emotions' }
        ],
        E: [
          { num: 15, text: 'Irritability or aggressive behavior' },
          { num: 16, text: 'Reckless or self-destructive behavior' },
          { num: 17, text: 'Hypervigilance' },
          { num: 18, text: 'Exaggerated startle response' },
          { num: 19, text: 'Difficulty concentrating' },
          { num: 20, text: 'Sleep disturbance' }
        ]
      },
      scoring: '0-4 for each item (Not at all / A little bit / Moderately / Quite a bit / Extremely)',
      interpretation: '≥33 = suggests possible PTSD'
    },
    'ybocs': {
      title: 'Yale-Brown Obsessive Compulsive Scale (Y-BOCS)',
      reference: 'Goodman WK, et al. Arch Gen Psychiatry. 1989;46(11):1006-1011',
      obsessions: [
        { num: 1, text: 'Time occupied by obsessions' },
        { num: 2, text: 'Interference from obsessions' },
        { num: 3, text: 'Distress from obsessions' },
        { num: 4, text: 'Resistance to obsessions' },
        { num: 5, text: 'Control over obsessions' }
      ],
      compulsions: [
        { num: 6, text: 'Time spent on compulsions' },
        { num: 7, text: 'Interference from compulsions' },
        { num: 8, text: 'Distress from compulsions' },
        { num: 9, text: 'Resistance to compulsions' },
        { num: 10, text: 'Control over compulsions' }
      ],
      scoring: '0-4 each item (total 0-40)',
      interpretation: '0-7 = Subclinical | 8-15 = Mild | 16-23 = Moderate | 24-31 = Severe | 32-40 = Extreme'
    },
    'msibpd': {
      title: 'McLean Screening Instrument for BPD (MSI-BPD)',
      reference: 'Zanarini MC, et al. J Clin Psychiatry. 2003;64(5):566-569',
      items: [
        { num: 1, text: 'Troubled relationships' },
        { num: 2, text: 'Self-harm / suicide attempt' },
        { num: 3, text: 'Impulsivity problems' },
        { num: 4, text: 'Extreme moodiness' },
        { num: 5, text: 'Frequent anger' },
        { num: 6, text: 'Distrustfulness' },
        { num: 7, text: 'Unreality / derealization' },
        { num: 8, text: 'Chronic emptiness' },
        { num: 9, text: 'Identity confusion' },
        { num: 10, text: 'Fear of abandonment' }
      ],
      scoring: 'Yes/No (score 1 point per Yes)',
      interpretation: '≥7 = Positive screen (symptoms highly consistent with BPD; further evaluation warranted)'
    },
    'panss-6': {
      title: 'PANSS-6 (Brief Psychosis Assessment)',
      reference: 'Kay SR, et al. Schizophr Bull. 1987;13(2):261-276',
      items: [
        { num: 'P1', text: 'Delusions', scoring: '1-7' },
        { num: 'P2', text: 'Conceptual Disorganization', scoring: '1-7' },
        { num: 'P3', text: 'Hallucinatory Behavior', scoring: '1-7' },
        { num: 'N1', text: 'Blunted Affect', scoring: '1-7' },
        { num: 'N4', text: 'Passive/Apathetic Social Withdrawal', scoring: '1-7' },
        { num: 'N6', text: 'Lack of Spontaneity and Flow of Conversation', scoring: '1-7' }
      ],
      interpretation: 'Positive scale total (P1-P3) | Negative scale total (N1, N4, N6) | Total PANSS-6 (max 42)'
    },
    'panss-30': {
      title: 'PANSS-30 (Full Psychosis Assessment)',
      reference: 'Kay SR, et al. Schizophr Bull. 1987;13(2):261-276',
      positive: [
        { num: 'P1', text: 'Delusions' },
        { num: 'P2', text: 'Conceptual Disorganization' },
        { num: 'P3', text: 'Hallucinatory Behavior' },
        { num: 'P4', text: 'Excitement' },
        { num: 'P5', text: 'Grandiosity' },
        { num: 'P6', text: 'Suspiciousness/Persecution' },
        { num: 'P7', text: 'Hostility' }
      ],
      negative: [
        { num: 'N1', text: 'Blunted Affect' },
        { num: 'N2', text: 'Emotional Withdrawal' },
        { num: 'N3', text: 'Poor Rapport' },
        { num: 'N4', text: 'Passive/Apathetic Social Withdrawal' },
        { num: 'N5', text: 'Difficulty in Abstract Thinking' },
        { num: 'N6', text: 'Lack of Spontaneity and Flow of Conversation' },
        { num: 'N7', text: 'Stereotyped Thinking' }
      ],
      general: [
        'Somatic Concern', 'Anxiety', 'Guilt Feelings', 'Tension', 'Mannerisms and Posturing', 'Depression',
        'Motor Retardation', 'Uncooperativeness', 'Unusual Thought Content', 'Disorientation', 'Poor Attention',
        'Lack of Judgment and Insight', 'Disturbance of Volition', 'Poor Impulse Control', 'Preoccupation', 'Active Social Avoidance'
      ],
      scoring: '1-7 for each item (30 total)',
      interpretation: 'Severity: ≤57 = Mild | 58-74 = Moderate | 75-95 = Marked | 96-115 = Severe | >115 = Extremely severe'
    },
    'bfcrs': {
      title: 'Bush-Francis Catatonia Rating Scale (BFCRS)',
      reference: 'Bush G, et al. Acta Psychiatr Scand. 1996;93(2):129-137',
      csi: [
        'Immobility/Stupor', 'Mutism', 'Staring', 'Posturing/Catalepsy', 'Grimacing', 'Echopraxia/Echolalia',
        'Stereotypy', 'Mannerisms', 'Verbigeration', 'Rigidity', 'Negativism', 'Waxy Flexibility',
        'Withdrawal', 'Excitement'
      ],
      crs: [
        { num: 1, text: 'Immobility/Stupor' },
        { num: 2, text: 'Mutism' },
        { num: 3, text: 'Staring' },
        { num: 4, text: 'Posturing/Catalepsy' },
        { num: 5, text: 'Grimacing' },
        { num: 6, text: 'Echopraxia/Echolalia' },
        { num: 7, text: 'Stereotypy' },
        { num: 8, text: 'Mannerisms' },
        { num: 9, text: 'Verbigeration' },
        { num: 10, text: 'Rigidity' },
        { num: 11, text: 'Negativism' },
        { num: 12, text: 'Waxy Flexibility' },
        { num: 13, text: 'Withdrawal' },
        { num: 14, text: 'Excitement' },
        { num: 15, text: 'Impulsivity' },
        { num: 16, text: 'Automatic Obedience' },
        { num: 17, text: 'Passive Obedience (Mitgehen)' },
        { num: 18, text: 'Muscle Resistance (Gegenhalten)' },
        { num: 19, text: 'Motorically Stuck (Ambitendency)' },
        { num: 20, text: 'Grasp Reflex' },
        { num: 21, text: 'Perseveration' },
        { num: 22, text: 'Combativeness' },
        { num: 23, text: 'Autonomic Abnormality' }
      ],
      scoring: 'CSI: 14 items present/absent | CRS: 23 items scored 0-3 (binary items 12, 17-21: 0 or 3)',
      interpretation: 'CSI ≥2 = positive screen | CRS severity: ≤10 = Mild | 11-20 = Moderate | ≥21 = Severe'
    },
    'aims': {
      title: 'Abnormal Involuntary Movement Scale (AIMS)',
      reference: 'Guy W. ECDEU Assessment Manual. 1976',
      items: [
        { num: 1, text: 'Facial Expression', max: 4 },
        { num: 2, text: 'Lips & Perioral', max: 4 },
        { num: 3, text: 'Jaw', max: 4 },
        { num: 4, text: 'Tongue', max: 4 },
        { num: 5, text: 'Upper Extremities', max: 4 },
        { num: 6, text: 'Lower Extremities', max: 4 },
        { num: 7, text: 'Trunk', max: 4 },
        { num: 8, text: 'Overall Severity of Dyskinesias', max: 4 },
        { num: 9, text: 'Incapacitation Due to Dyskinesias', max: 4 },
        { num: 10, text: 'Patient\'s Awareness of Abnormal Movements', max: 4 }
      ],
      scoring: '0-4 scale for each item (total 0-28 for movement)',
      interpretation: '0 = None | 1-7 = Minimal | 8-14 = Mild | 15-21 = Moderate | ≥22 = Severe'
    },
    'ess': {
      title: 'Epworth Sleepiness Scale (ESS)',
      reference: 'Johns MW. Sleep. 1991;14(6):540-545',
      items: [
        'Sitting and reading',
        'Watching TV',
        'Sitting, inactive, in a public place (e.g., meeting, theater, dinner event)',
        'As a passenger in a car for an hour or more without a break',
        'Lying down to rest when circumstances permit',
        'Sitting and talking to someone',
        'Sitting quietly after a meal without alcohol',
        'In a car, while stopped for a few minutes in traffic or at a light'
      ],
      scoring: '0-3 for each (Would never doze / Slight chance / Moderate chance / High chance)',
      interpretation: '≤7 = Normal | 8-9 = Average | 10-15 = Excessive | ≥16 = Strongly consider seeking medical attention'
    },
    'suicide-risk': {
      title: 'Suicide Risk Assessment (C-SSRS + Risk/Protective Factors)',
      reference: 'Posner K, et al. J Clin Psychiatry. 2011;72(2):233-239',
      screen: [
        'Q1: Wish to be dead',
        'Q2: Suicidal thoughts',
        'Q3: Method consideration',
        'Q4: Intent to act',
        'Q5: Plan and intent',
        'Q6: Actual attempt/preparation'
      ],
      riskFactors: [
        'Prior suicide attempts or self-harm',
        'Psychiatric illness (especially depression, bipolar, schizophrenia, PTSD)',
        'Substance use disorder',
        'Family history of suicide',
        'Access to lethal means',
        'Chronic medical illness',
        'Recent loss or major life stressor',
        'Social isolation'
      ],
      protectiveFactors: [
        'Good social support system',
        'Strong coping skills',
        'Reasons for living',
        'Optimism about future',
        'Engaging in meaningful activities',
        'Religious/spiritual beliefs'
      ],
      scoring: 'Screen: Yes/No gateway questions',
      interpretation: 'None / Low Risk / Moderate Risk / High Risk based on responses'
    },

    'cssrs-full': {
      title: 'Columbia-Suicide Severity Rating Scale (C-SSRS) — Full Version',
      reference: 'Posner K, et al. Am J Psychiatry. 2011;168(12):1266-1277',
      sectionA: {
        title: 'Section A: Risk & Protective Factors',
        riskCategories: {
          'Suicidal & Self-Injury Behavior': [
            'Actual attempt (lifetime)',
            'Actual attempt (past month)',
            'Interrupted attempt (lifetime)',
            'Interrupted attempt (past month)',
            'Aborted attempt (lifetime)',
            'Aborted attempt (past month)',
            'Preparatory acts/behavior (lifetime)',
            'Preparatory acts/behavior (past month)',
            'Non-suicidal self-injury (lifetime)',
            'Non-suicidal self-injury (past month)'
          ],
          'Suicidal Ideation': [
            'Wish to be dead',
            'Non-specific active suicidal thoughts',
            'Active ideation with any methods',
            'Active ideation with some intent',
            'Active ideation with specific plan and intent'
          ],
          'Activating Events': [
            'Recent major loss or stressor',
            'Pending legal problems/incarceration',
            'Current or anticipated social isolation'
          ],
          'Treatment History': [
            'Prior psychiatric treatment',
            'Hopeless about treatment',
            'Not compliant with treatment',
            'Not connected to treatment'
          ],
          'Clinical Status': [
            'Hopelessness',
            'Helplessness',
            'Feeling trapped',
            'Major depressive episode',
            'Mixed affective episode',
            'Command hallucinations to hurt self',
            'Highly impulsive behavior',
            'Substance abuse/intoxication',
            'Agitation/restlessness',
            'Perceived burden on others',
            'Chronic physical pain',
            'Homicidal ideation',
            'Aggressive behavior towards others',
            'Access to lethal means',
            'Refuses to agree to safety plan',
            'History of sexual abuse',
            'Family history of suicide'
          ]
        },
        protectiveFactors: [
          'Identifies reasons for living',
          'Responsibility to family/children',
          'Supportive social network/family',
          'Fear of death or dying',
          'Spiritual/religious beliefs',
          'Purposeful sense of work or duty',
          'Positive therapeutic relationship',
          'Other (specify)'
        ]
      },
      sectionB: {
        title: 'Section B: Suicidal Ideation',
        items: [
          { num: 1, text: 'Wish to be Dead — "Have you wished you were dead or wished you could go to sleep and not wake up?"' },
          { num: 2, text: 'Non-Specific Active Suicidal Thoughts — "Have you actually had any thoughts of killing yourself?"' },
          { num: 3, text: 'Active Suicidal Ideation with Any Methods (Not Plan) without Intent to Act — "Have you been thinking about how you might do this?"' },
          { num: 4, text: 'Active Suicidal Ideation with Some Intent to Act, without Specific Plan — "Have you had these thoughts and had some intention of acting on them?"' },
          { num: 5, text: 'Active Suicidal Ideation with Specific Plan and Intent — "Have you started to work out or worked out the details of how to kill yourself? Do you intend to carry out this plan?"' }
        ],
        timeframes: ['Lifetime', 'Past Month']
      },
      sectionC: {
        title: 'Section C: Intensity of Ideation',
        note: 'Rate most severe ideation identified in Section B',
        items: [
          { num: 1, text: 'Frequency — How many times? (1=Less than once a week, 2=Once a week, 3=2-5 times/week, 4=Daily or almost daily, 5=Many times each day)' },
          { num: 2, text: 'Duration — How long do they last? (1=Fleeting/few seconds, 2=Short periods/minutes, 3=An hour or longer, 4=Most of the day, 5=Persistent/continuous)' },
          { num: 3, text: 'Controllability — Can you stop thinking about it? (1=Easily able to, 2=Can with some difficulty, 3=Can with great difficulty, 4=Unable to control, 5=Does not attempt to control)' },
          { num: 4, text: 'Deterrents — Are there things stopping you from acting? (1=Definitely would not attempt, 2=Probably would not, 3=Uncertain, 4=Probably would, 5=Definitely would)' },
          { num: 5, text: 'Reasons for Ideation — (1=To get attention/revenge, 2=Way of ending pain but ambivalent, 3=Both ending pain AND getting attention, 4=To end/stop the pain, primarily, 5=Complete relief, fully intent)' }
        ]
      },
      sectionD: {
        title: 'Section D: Suicidal Behavior',
        items: [
          { text: 'Actual Attempt', timeframes: ['Lifetime', 'Past 3 Months'], hasCount: true },
          { text: 'Interrupted Attempt', timeframes: ['Lifetime', 'Past 3 Months'], hasCount: true },
          { text: 'Aborted Attempt', timeframes: ['Lifetime', 'Past 3 Months'], hasCount: true },
          { text: 'Preparatory Acts or Behavior', timeframes: ['Lifetime', 'Past 3 Months'], hasCount: true },
          { text: 'Non-Suicidal Self-Injurious Behavior', timeframes: ['Lifetime', 'Past 3 Months'], hasCount: false }
        ]
      },
      sectionE: {
        title: 'Section E: Lethality',
        attempts: ['Most Recent Attempt', 'Most Lethal Attempt', 'Initial/First Attempt'],
        actualLethality: '0 = No physical damage / 1 = Minor (superficial) / 2 = Moderate / 3 = Moderately severe (medical attention) / 4 = Severe (ICU/surgery) / 5 = Death',
        potentialLethality: '0 = Behavior unlikely to result in injury / 1 = Likely minor / 2 = Likely moderate or greater'
      },
      scoring: 'C-SSRS Full assessment — multi-section qualitative and quantitative',
      interpretation: 'Clinical judgment based on aggregate risk profile across all sections'
    },

    'bat-work': {
      title: 'Burnout Assessment Tool — Work Version (BAT-W)',
      reference: 'Schaufeli WB, De Witte H, Desart S. BAT Manual. KU Leuven. 2019',
      domains: {
        'Exhaustion (8 items)': [
          'At work, I feel mentally exhausted',
          'Everything I do at work requires a great deal of effort',
          'After a day at work, I find it hard to recover my energy',
          'At work, I feel physically exhausted',
          'When I get up in the morning, I lack the energy to start a new day at work',
          'I want to be active at work, but somehow I am unable to manage',
          'When I exert myself at work, I quickly get tired',
          'At the end of my working day, I feel mentally exhausted and drained'
        ],
        'Mental Distance (5 items)': [
          'I struggle to find any enthusiasm for my work',
          'At work, I do not think much about what I am doing and I function on autopilot',
          'I feel a strong aversion towards my job',
          'I feel indifferent about my job',
          "I'm cynical about what my work means to others"
        ],
        'Cognitive Impairment (5 items)': [
          'At work, I have trouble staying focused',
          'At work I struggle to think clearly',
          "I'm forgetful and distracted at work",
          'When I\'m working, I have trouble concentrating',
          'I make mistakes in my work because I have my mind on other things'
        ],
        'Emotional Impairment (5 items)': [
          'At work, I feel unable to control my emotions',
          'I do not recognize myself in the way I react emotionally at work',
          "During my work I become irritable when things don't go my way",
          'I get upset or sad at work without knowing why',
          'At work I may overreact unintentionally'
        ],
        'Secondary — Psychological (5 items)': [
          'I have trouble falling or staying asleep',
          'I tend to worry',
          'I feel tense and stressed',
          'I feel anxious and/or suffer from panic attacks',
          'Noise and crowds disturb me'
        ],
        'Secondary — Psychosomatic (5 items)': [
          'I suffer from palpitations or chest pain',
          'I suffer from stomach and/or intestinal complaints',
          'I suffer from headaches',
          'I suffer from muscle pain, for example in the neck, shoulder or back',
          'I often get sick'
        ]
      },
      scoring: '1 = Never, 2 = Rarely, 3 = Sometimes, 4 = Often, 5 = Always',
      interpretation: 'Domain mean ≥3.0 indicates elevated burnout symptoms'
    },

    'bat-general': {
      title: 'Burnout Assessment Tool — General Version (BAT-G)',
      reference: 'Schaufeli WB, De Witte H, Desart S. BAT Manual. KU Leuven. 2019',
      domains: {
        'Exhaustion (8 items)': [
          'I feel mentally exhausted',
          'Everything I do requires a great deal of effort',
          'At the end of the day, I find it hard to recover my energy',
          'I feel physically exhausted',
          'When I get up in the morning, I lack the energy to start a new day',
          'I want to be active, but somehow I am unable to manage',
          'When I exert myself, I quickly get tired',
          'At the end of my day, I feel mentally exhausted and drained'
        ],
        'Mental Distance (4 items)': [
          'I struggle to find any enthusiasm for my work',
          'I feel a strong aversion towards my job',
          'I feel indifferent about my job',
          "I'm cynical about what my work means to others"
        ],
        'Cognitive Impairment (5 items)': [
          'I have trouble staying focused',
          'I struggle to think clearly',
          "I'm forgetful and distracted",
          'I have trouble concentrating',
          'I make mistakes because I have my mind on other things'
        ],
        'Emotional Impairment (5 items)': [
          'I feel unable to control my emotions',
          'I do not recognize myself in the way I react emotionally',
          "I become irritable when things don't go my way",
          'I get upset or sad without knowing why',
          'I may overreact unintentionally'
        ],
        'Secondary — Psychological (5 items)': [
          'I have trouble falling or staying asleep',
          'I tend to worry',
          'I feel tense and stressed',
          'I feel anxious and/or suffer from panic attacks',
          'Noise and crowds disturb me'
        ],
        'Secondary — Psychosomatic (5 items)': [
          'I suffer from palpitations or chest pain',
          'I suffer from stomach and/or intestinal complaints',
          'I suffer from headaches',
          'I suffer from muscle pain, for example in the neck, shoulder or back',
          'I often get sick'
        ]
      },
      scoring: '1 = Never, 2 = Rarely, 3 = Sometimes, 4 = Often, 5 = Always',
      interpretation: 'Domain mean ≥3.0 indicates elevated burnout symptoms'
    }
  };

  /* ────────────────────────────────────────────────────────────────────────
     Print Blank Form Function
     ──────────────────────────────────────────────────────────────────────── */

  window.printBlankForm = function(formId) {
    const form = FORMS[formId];
    if (!form) {
      alert('Form not found: ' + formId);
      return;
    }

    const w = window.open('', '_blank');
    const date = new Date().toISOString().split('T')[0];
    let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${form.title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, sans-serif; color: #000; background: #f5f5f5; }
    @media print {
      body { background: #fff; }
      .pf-print-page { page-break-after: always; box-shadow: none !important; }
    }
    .pf-print-page {
      background: #fff;
      color: #000;
      margin: 0 auto 24px;
      padding: 20px;
      max-width: 8.5in;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      font-size: 11px;
      line-height: 1.4;
    }
    .pf-print-header {
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 2px solid #000;
    }
    .pf-print-title {
      font-size: 16px;
      font-weight: bold;
      margin: 0 0 4px 0;
    }
    .pf-print-ref {
      font-size: 9px;
      color: #333;
      margin: 4px 0;
      font-style: italic;
    }
    .pf-print-patient-info {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px 20px;
      margin-bottom: 16px;
      font-size: 10px;
    }
    .pf-print-patient-field {
      display: flex;
      align-items: baseline;
    }
    .pf-print-patient-label {
      font-weight: bold;
      min-width: 60px;
    }
    .pf-print-patient-line {
      flex: 1;
      border-bottom: 1px solid #000;
      margin-left: 4px;
    }
    .pf-print-items { margin-bottom: 16px; }
    .pf-print-item {
      display: grid;
      grid-template-columns: 20px 1fr auto;
      gap: 8px 12px;
      margin-bottom: 10px;
      align-items: start;
    }
    .pf-print-item-num { font-weight: bold; font-size: 10px; }
    .pf-print-item-text { font-size: 10px; line-height: 1.3; }
    .pf-print-item-boxes {
      display: flex;
      gap: 6px;
      align-items: center;
      flex-wrap: wrap;
    }
    .pf-print-box {
      width: 18px;
      height: 18px;
      border: 1px solid #000;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 8px;
    }
    .pf-print-circle {
      width: 16px;
      height: 16px;
      border: 1px solid #000;
      border-radius: 50%;
      display: inline-block;
    }
    .pf-print-score-line {
      margin-top: 16px;
      padding-top: 8px;
      border-top: 1px solid #000;
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      font-weight: bold;
    }
    .pf-print-interpretation {
      margin-top: 12px;
      padding-top: 8px;
      border-top: 1px solid #000;
      font-size: 9px;
      line-height: 1.3;
    }
    .pf-print-interpretation-title {
      font-weight: bold;
      margin-bottom: 4px;
    }
    .pf-print-footer {
      margin-top: 20px;
      padding-top: 8px;
      border-top: 1px solid #ccc;
      font-size: 8px;
      color: #666;
      text-align: center;
    }
    .pf-print-section-header {
      font-size: 11px;
      font-weight: bold;
      margin-top: 12px;
      margin-bottom: 8px;
      padding-top: 8px;
      border-top: 1px solid #000;
    }
    .pf-print-domain {
      margin-bottom: 12px;
      padding-left: 12px;
    }
    @media print {
      body { margin: 0; padding: 0; }
      .pf-print-page { margin: 0; padding: 20px; max-width: 100%; box-shadow: none; }
      .print-button { display: none !important; }
    }
  </style>
</head>
<body>`;

    html += '<div class="pf-print-page">';
    html += `<div class="pf-print-header">
      <div class="pf-print-title">${form.title}</div>
      <div class="pf-print-ref">${form.reference}</div>
    </div>`;

    html += `<div class="pf-print-patient-info">
      <div class="pf-print-patient-field">
        <span class="pf-print-patient-label">Name:</span>
        <span class="pf-print-patient-line">&nbsp;</span>
      </div>
      <div class="pf-print-patient-field">
        <span class="pf-print-patient-label">DOB:</span>
        <span class="pf-print-patient-line">&nbsp;</span>
      </div>
      <div class="pf-print-patient-field">
        <span class="pf-print-patient-label">Date:</span>
        <span class="pf-print-patient-line">&nbsp;</span>
      </div>
      <div class="pf-print-patient-field">
        <span class="pf-print-patient-label">Clinician:</span>
        <span class="pf-print-patient-line">&nbsp;</span>
      </div>
    </div>`;

    // Render form items based on type
    html += renderFormItems(form, formId);

    html += `<div class="pf-print-score-line">
      <span>Total Score: ____ / ${getMaxScore(form, formId)}</span>
    </div>`;

    html += `<div class="pf-print-interpretation">
      <div class="pf-print-interpretation-title">Interpretation Guide:</div>
      <div>${form.interpretation}</div>
    </div>`;

    html += `<div class="pf-print-footer">
      Source: ${form.reference.split(' et al.')[0]}. Blank form generated from PsychoPharmRef.com
    </div>`;

    html += '</div></body></html>';

    w.document.write(html);
    w.document.close();
    w.print();
  };

  /* ────────────────────────────────────────────────────────────────────────
     Helper Functions
     ──────────────────────────────────────────────────────────────────────── */

  function renderFormItems(form, formId) {
    let html = '<div class="pf-print-items">';

    switch (formId) {
      case 'tisdale-qt':
        form.items.forEach(item => {
          html += `<div class="pf-print-item">
            <div class="pf-print-item-num">${item.num}.</div>
            <div class="pf-print-item-text">${item.text} [${item.points}pt]</div>
            <div class="pf-print-item-boxes"><span class="pf-print-box"></span></div>
          </div>`;
        });
        break;

      case 'cdr':
        html += '<div class="pf-print-section-header">Rate each domain on scale: 0 / 0.5 / 1 / 2 / 3</div>';
        form.domains.forEach((domain, idx) => {
          html += `<div class="pf-print-item">
            <div class="pf-print-item-num">${idx + 1}.</div>
            <div class="pf-print-item-text">${domain}</div>
            <div class="pf-print-item-boxes">
              <span class="pf-print-box">0</span>
              <span class="pf-print-box">0.5</span>
              <span class="pf-print-box">1</span>
              <span class="pf-print-box">2</span>
              <span class="pf-print-box">3</span>
            </div>
          </div>`;
        });
        break;

      case 'aq-10':
        html += '<div class="pf-print-section-header">Response scale: Definitely Agree / Slightly Agree / Slightly Disagree / Definitely Disagree</div>';
        form.items.forEach(item => {
          html += `<div class="pf-print-item">
            <div class="pf-print-item-num">${item.num}.</div>
            <div class="pf-print-item-text">${item.text}</div>
            <div class="pf-print-item-boxes">
              <span class="pf-print-circle"></span>
              <span class="pf-print-circle"></span>
              <span class="pf-print-circle"></span>
              <span class="pf-print-circle"></span>
            </div>
          </div>`;
        });
        break;

      case 'asrs':
        html += '<div class="pf-print-section-header">Part A (Screener) — Response: Never / Rarely / Sometimes / Often / Very Often</div>';
        form.partA.forEach(item => {
          html += `<div class="pf-print-item">
            <div class="pf-print-item-num">${item.num}.</div>
            <div class="pf-print-item-text">${item.text}</div>
            <div class="pf-print-item-boxes">
              <span class="pf-print-circle"></span>
              <span class="pf-print-circle"></span>
              <span class="pf-print-circle"></span>
              <span class="pf-print-circle"></span>
              <span class="pf-print-circle"></span>
            </div>
          </div>`;
        });
        html += '<div class="pf-print-section-header" style="margin-top: 16px;">Part B (Supplemental) — Response: Never / Rarely / Sometimes / Often / Very Often</div>';
        form.partB.forEach(item => {
          html += `<div class="pf-print-item">
            <div class="pf-print-item-num">${item.num}.</div>
            <div class="pf-print-item-text">${item.text}</div>
            <div class="pf-print-item-boxes">
              <span class="pf-print-circle"></span>
              <span class="pf-print-circle"></span>
              <span class="pf-print-circle"></span>
              <span class="pf-print-circle"></span>
              <span class="pf-print-circle"></span>
            </div>
          </div>`;
        });
        break;

      case 'cidi':
        html += '<div class="pf-print-section-header">Stem Questions</div>';
        form.stems.forEach(item => {
          html += `<div class="pf-print-item">
            <div class="pf-print-item-num">Q${item.num}</div>
            <div class="pf-print-item-text">${item.text}</div>
            <div class="pf-print-item-boxes"><span class="pf-print-circle">Y</span><span class="pf-print-circle">N</span></div>
          </div>`;
        });
        html += '<div class="pf-print-section-header">Criterion B Symptoms (if stem criteria met)</div>';
        form.symptoms.forEach((symp, idx) => {
          html += `<div class="pf-print-item">
            <div class="pf-print-item-num">${idx + 1}.</div>
            <div class="pf-print-item-text">${symp}</div>
            <div class="pf-print-item-boxes"><span class="pf-print-circle">Y</span><span class="pf-print-circle">N</span></div>
          </div>`;
        });
        break;

      case 'ymrs':
        html += '<div class="pf-print-section-header">Rate each item on 0-4 scale (or 0-8 for items 5, 6, 8, 9)</div>';
        form.items.forEach(item => {
          const boxes = [];
          const maxVal = item.max;
          for (let i = 0; i <= maxVal; i++) boxes.push(`<span class="pf-print-box">${i}</span>`);
          html += `<div class="pf-print-item">
            <div class="pf-print-item-num">${item.num}.</div>
            <div class="pf-print-item-text">${item.text}</div>
            <div class="pf-print-item-boxes">${boxes.join('')}</div>
          </div>`;
        });
        break;

      case 'pcl5':
        html += '<div class="pf-print-section-header">Instructions: 0=Not at all, 1=A little bit, 2=Moderately, 3=Quite a bit, 4=Extremely</div>';
        ['B (Intrusion)', 'C (Avoidance)', 'D (Negative Cognitions/Mood)', 'E (Arousal/Reactivity)'].forEach((cluster, idx) => {
          const clusterKey = Object.keys(form.clusters)[idx];
          html += `<div class="pf-print-section-header" style="margin-top: 12px;">Cluster ${cluster}</div>`;
          form.clusters[clusterKey].forEach(item => {
            html += `<div class="pf-print-item">
              <div class="pf-print-item-num">${item.num}.</div>
              <div class="pf-print-item-text">${item.text}</div>
              <div class="pf-print-item-boxes">
                <span class="pf-print-circle">0</span>
                <span class="pf-print-circle">1</span>
                <span class="pf-print-circle">2</span>
                <span class="pf-print-circle">3</span>
                <span class="pf-print-circle">4</span>
              </div>
            </div>`;
          });
        });
        break;

      case 'ybocs':
        html += '<div class="pf-print-section-header">Obsessions (Items 1-5) — 0-4 scale</div>';
        form.obsessions.forEach(item => {
          html += `<div class="pf-print-item">
            <div class="pf-print-item-num">${item.num}.</div>
            <div class="pf-print-item-text">${item.text}</div>
            <div class="pf-print-item-boxes">
              <span class="pf-print-circle">0</span>
              <span class="pf-print-circle">1</span>
              <span class="pf-print-circle">2</span>
              <span class="pf-print-circle">3</span>
              <span class="pf-print-circle">4</span>
            </div>
          </div>`;
        });
        html += '<div class="pf-print-section-header">Compulsions (Items 6-10) — 0-4 scale</div>';
        form.compulsions.forEach(item => {
          html += `<div class="pf-print-item">
            <div class="pf-print-item-num">${item.num}.</div>
            <div class="pf-print-item-text">${item.text}</div>
            <div class="pf-print-item-boxes">
              <span class="pf-print-circle">0</span>
              <span class="pf-print-circle">1</span>
              <span class="pf-print-circle">2</span>
              <span class="pf-print-circle">3</span>
              <span class="pf-print-circle">4</span>
            </div>
          </div>`;
        });
        break;

      case 'msibpd':
        html += '<div class="pf-print-section-header">Response: Yes / No (1 point per Yes)</div>';
        form.items.forEach(item => {
          html += `<div class="pf-print-item">
            <div class="pf-print-item-num">${item.num}.</div>
            <div class="pf-print-item-text">${item.text}</div>
            <div class="pf-print-item-boxes"><span class="pf-print-circle">Y</span><span class="pf-print-circle">N</span></div>
          </div>`;
        });
        break;

      case 'panss-6':
        html += '<div class="pf-print-section-header">Rate each item on 1-7 scale (1=Absent, 7=Extreme)</div>';
        form.items.forEach(item => {
          html += `<div class="pf-print-item">
            <div class="pf-print-item-num">${item.num}.</div>
            <div class="pf-print-item-text">${item.text}</div>
            <div class="pf-print-item-boxes">
              <span class="pf-print-circle">1</span>
              <span class="pf-print-circle">2</span>
              <span class="pf-print-circle">3</span>
              <span class="pf-print-circle">4</span>
              <span class="pf-print-circle">5</span>
              <span class="pf-print-circle">6</span>
              <span class="pf-print-circle">7</span>
            </div>
          </div>`;
        });
        break;

      case 'panss-30':
        html += '<div class="pf-print-section-header">Rate each item on 1-7 scale (1=Absent, 7=Extreme)</div>';
        html += '<div class="pf-print-section-header" style="margin-top: 12px;">Positive Scale (P1-P7)</div>';
        form.positive.forEach(item => {
          html += `<div class="pf-print-item">
            <div class="pf-print-item-num">${item.num}.</div>
            <div class="pf-print-item-text">${item.text}</div>
            <div class="pf-print-item-boxes">
              <span class="pf-print-circle">1</span>
              <span class="pf-print-circle">2</span>
              <span class="pf-print-circle">3</span>
              <span class="pf-print-circle">4</span>
              <span class="pf-print-circle">5</span>
              <span class="pf-print-circle">6</span>
              <span class="pf-print-circle">7</span>
            </div>
          </div>`;
        });
        html += '<div class="pf-print-section-header" style="margin-top: 12px;">Negative Scale (N1-N7)</div>';
        form.negative.forEach(item => {
          html += `<div class="pf-print-item">
            <div class="pf-print-item-num">${item.num}.</div>
            <div class="pf-print-item-text">${item.text}</div>
            <div class="pf-print-item-boxes">
              <span class="pf-print-circle">1</span>
              <span class="pf-print-circle">2</span>
              <span class="pf-print-circle">3</span>
              <span class="pf-print-circle">4</span>
              <span class="pf-print-circle">5</span>
              <span class="pf-print-circle">6</span>
              <span class="pf-print-circle">7</span>
            </div>
          </div>`;
        });
        html += '<div class="pf-print-section-header" style="margin-top: 12px;">General Psychopathology (G1-G16)</div>';
        form.general.forEach((item, idx) => {
          html += `<div class="pf-print-item">
            <div class="pf-print-item-num">G${idx + 1}.</div>
            <div class="pf-print-item-text">${item}</div>
            <div class="pf-print-item-boxes">
              <span class="pf-print-circle">1</span>
              <span class="pf-print-circle">2</span>
              <span class="pf-print-circle">3</span>
              <span class="pf-print-circle">4</span>
              <span class="pf-print-circle">5</span>
              <span class="pf-print-circle">6</span>
              <span class="pf-print-circle">7</span>
            </div>
          </div>`;
        });
        break;

      case 'bfcrs':
        html += '<div class="pf-print-section-header">CSI Screening (14 items: Present/Absent)</div>';
        form.csi.forEach((item, idx) => {
          html += `<div class="pf-print-item">
            <div class="pf-print-item-num">${idx + 1}.</div>
            <div class="pf-print-item-text">${item}</div>
            <div class="pf-print-item-boxes"><span class="pf-print-circle">P</span><span class="pf-print-circle">A</span></div>
          </div>`;
        });
        html += '<div class="pf-print-section-header" style="margin-top: 16px;">CRS Rating (23 items: 0-3 scale)</div>';
        form.crs.forEach(item => {
          html += `<div class="pf-print-item">
            <div class="pf-print-item-num">${item.num}.</div>
            <div class="pf-print-item-text">${item.text}</div>
            <div class="pf-print-item-boxes">
              <span class="pf-print-circle">0</span>
              <span class="pf-print-circle">1</span>
              <span class="pf-print-circle">2</span>
              <span class="pf-print-circle">3</span>
            </div>
          </div>`;
        });
        break;

      case 'aims':
        html += '<div class="pf-print-section-header">Movement Items (1-7: 0-4 scale)</div>';
        form.items.slice(0, 7).forEach(item => {
          html += `<div class="pf-print-item">
            <div class="pf-print-item-num">${item.num}.</div>
            <div class="pf-print-item-text">${item.text}</div>
            <div class="pf-print-item-boxes">
              <span class="pf-print-circle">0</span>
              <span class="pf-print-circle">1</span>
              <span class="pf-print-circle">2</span>
              <span class="pf-print-circle">3</span>
              <span class="pf-print-circle">4</span>
            </div>
          </div>`;
        });
        html += '<div class="pf-print-section-header" style="margin-top: 12px;">Global Judgments (8-10: 0-4 scale)</div>';
        form.items.slice(7).forEach(item => {
          html += `<div class="pf-print-item">
            <div class="pf-print-item-num">${item.num}.</div>
            <div class="pf-print-item-text">${item.text}</div>
            <div class="pf-print-item-boxes">
              <span class="pf-print-circle">0</span>
              <span class="pf-print-circle">1</span>
              <span class="pf-print-circle">2</span>
              <span class="pf-print-circle">3</span>
              <span class="pf-print-circle">4</span>
            </div>
          </div>`;
        });
        break;

      case 'ess':
        html += '<div class="pf-print-section-header">Situation & Likelihood of Dozing (0-3 scale)</div>';
        form.items.forEach((item, idx) => {
          html += `<div class="pf-print-item">
            <div class="pf-print-item-num">${idx + 1}.</div>
            <div class="pf-print-item-text">${item}</div>
            <div class="pf-print-item-boxes">
              <span class="pf-print-circle">0</span>
              <span class="pf-print-circle">1</span>
              <span class="pf-print-circle">2</span>
              <span class="pf-print-circle">3</span>
            </div>
          </div>`;
        });
        break;

      case 'suicide-risk':
        html += '<div class="pf-print-section-header">C-SSRS Screening Questions (Yes/No)</div>';
        form.screen.forEach((q, idx) => {
          html += `<div class="pf-print-item">
            <div class="pf-print-item-num">${idx + 1}.</div>
            <div class="pf-print-item-text">${q}</div>
            <div class="pf-print-item-boxes"><span class="pf-print-circle">Y</span><span class="pf-print-circle">N</span></div>
          </div>`;
        });
        html += '<div class="pf-print-section-header" style="margin-top: 16px;">Risk Factors (check if present)</div>';
        form.riskFactors.forEach((rf, idx) => {
          html += `<div class="pf-print-item">
            <div class="pf-print-item-num">${idx + 1}.</div>
            <div class="pf-print-item-text">${rf}</div>
            <div class="pf-print-item-boxes"><span class="pf-print-box">☐</span></div>
          </div>`;
        });
        html += '<div class="pf-print-section-header" style="margin-top: 16px;">Protective Factors (check if present)</div>';
        form.protectiveFactors.forEach((pf, idx) => {
          html += `<div class="pf-print-item">
            <div class="pf-print-item-num">${idx + 1}.</div>
            <div class="pf-print-item-text">${pf}</div>
            <div class="pf-print-item-boxes"><span class="pf-print-box">☐</span></div>
          </div>`;
        });
        break;

      case 'cssrs-full':
        // Section A: Risk & Protective Factors
        html += '<div class="pf-print-section-header" style="font-size: 13px; font-weight: bold;">' + form.sectionA.title + '</div>';
        Object.keys(form.sectionA.riskCategories).forEach(function(cat) {
          html += '<div style="font-size: 11px; font-weight: bold; margin: 8px 0 4px 0; color: #333;">' + cat + '</div>';
          form.sectionA.riskCategories[cat].forEach(function(item, idx) {
            html += '<div class="pf-print-item" style="padding: 2px 0;">' +
              '<div class="pf-print-item-text" style="font-size: 11px;">' + item + '</div>' +
              '<div class="pf-print-item-boxes"><span class="pf-print-box">☐</span></div>' +
            '</div>';
          });
        });
        html += '<div style="font-size: 11px; font-weight: bold; margin: 10px 0 4px 0; color: #333;">Protective Factors</div>';
        form.sectionA.protectiveFactors.forEach(function(item) {
          html += '<div class="pf-print-item" style="padding: 2px 0;">' +
            '<div class="pf-print-item-text" style="font-size: 11px;">' + item + '</div>' +
            '<div class="pf-print-item-boxes"><span class="pf-print-box">☐</span></div>' +
          '</div>';
        });

        // Section B: Suicidal Ideation
        html += '<div class="pf-print-section-header" style="font-size: 13px; font-weight: bold; margin-top: 16px;">' + form.sectionB.title + '</div>';
        html += '<div style="font-size: 10px; color: #555; margin-bottom: 6px;">For each level, mark Lifetime and/or Past Month</div>';
        form.sectionB.items.forEach(function(item) {
          html += '<div class="pf-print-item" style="padding: 4px 0; align-items: flex-start;">' +
            '<div class="pf-print-item-num" style="font-weight: bold;">' + item.num + '.</div>' +
            '<div class="pf-print-item-text" style="font-size: 11px;">' + item.text + '</div>' +
            '<div class="pf-print-item-boxes" style="min-width: 120px; flex-direction: column; gap: 2px; font-size: 10px;">' +
              '<span style="display: flex; align-items: center; gap: 4px;">☐ Lifetime</span>' +
              '<span style="display: flex; align-items: center; gap: 4px;">☐ Past Month</span>' +
            '</div>' +
          '</div>';
        });

        // Section C: Intensity of Ideation
        html += '<div class="pf-print-section-header" style="font-size: 13px; font-weight: bold; margin-top: 16px;">' + form.sectionC.title + '</div>';
        html += '<div style="font-size: 10px; color: #555; margin-bottom: 6px;">' + form.sectionC.note + '</div>';
        form.sectionC.items.forEach(function(item) {
          html += '<div class="pf-print-item" style="padding: 4px 0; align-items: flex-start;">' +
            '<div class="pf-print-item-num" style="font-weight: bold;">' + item.num + '.</div>' +
            '<div class="pf-print-item-text" style="font-size: 11px;">' + item.text + '</div>' +
            '<div class="pf-print-item-boxes">' +
              '<span class="pf-print-circle">1</span>' +
              '<span class="pf-print-circle">2</span>' +
              '<span class="pf-print-circle">3</span>' +
              '<span class="pf-print-circle">4</span>' +
              '<span class="pf-print-circle">5</span>' +
            '</div>' +
          '</div>';
        });

        // Section D: Suicidal Behavior
        html += '<div class="pf-print-section-header" style="font-size: 13px; font-weight: bold; margin-top: 16px;">' + form.sectionD.title + '</div>';
        html += '<div style="font-size: 10px; color: #555; margin-bottom: 6px;">Mark timeframe and enter total count if applicable</div>';
        form.sectionD.items.forEach(function(item) {
          html += '<div class="pf-print-item" style="padding: 4px 0; align-items: flex-start;">' +
            '<div class="pf-print-item-text" style="font-size: 11px; font-weight: bold;">' + item.text + '</div>' +
            '<div class="pf-print-item-boxes" style="min-width: 180px; flex-direction: column; gap: 2px; font-size: 10px;">' +
              '<span style="display: flex; align-items: center; gap: 4px;">☐ Lifetime  ☐ Past 3 Months</span>' +
              (item.hasCount ? '<span style="display: flex; align-items: center; gap: 4px;">Total count: ______</span>' : '') +
            '</div>' +
          '</div>';
        });

        // Section E: Lethality
        html += '<div class="pf-print-section-header" style="font-size: 13px; font-weight: bold; margin-top: 16px;">' + form.sectionE.title + '</div>';
        html += '<div style="font-size: 9px; color: #555; margin-bottom: 4px;">Actual Lethality: ' + form.sectionE.actualLethality + '</div>';
        html += '<div style="font-size: 9px; color: #555; margin-bottom: 6px;">Potential Lethality (if actual = 0): ' + form.sectionE.potentialLethality + '</div>';
        form.sectionE.attempts.forEach(function(attempt) {
          html += '<div class="pf-print-item" style="padding: 4px 0; align-items: flex-start;">' +
            '<div class="pf-print-item-text" style="font-size: 11px; font-weight: bold;">' + attempt + '</div>' +
            '<div class="pf-print-item-boxes" style="min-width: 220px; flex-direction: column; gap: 2px; font-size: 10px;">' +
              '<span>Date: __________  Actual: ____  Potential: ____</span>' +
            '</div>' +
          '</div>';
        });

        // Notes area
        html += '<div style="margin-top: 14px; border-top: 1px solid #999; padding-top: 8px;">' +
          '<div style="font-size: 11px; font-weight: bold; margin-bottom: 4px;">Clinical Notes / Behavior Description:</div>' +
          '<div style="border: 1px solid #999; height: 70px; width: 100%;"></div>' +
        '</div>';
        break;

      case 'bat-work':
      case 'bat-general':
        var batDomains = {};
        form.items.forEach(function(item) {
          if (!batDomains[item.domain]) batDomains[item.domain] = [];
          batDomains[item.domain].push(item);
        });
        Object.keys(batDomains).forEach(function(domain) {
          html += '<div class="pf-print-section-header" style="margin-top: 12px;">' + domain + '</div>';
          batDomains[domain].forEach(function(item, idx) {
            html += '<div class="pf-print-item">' +
              '<div class="pf-print-item-num">' + item.num + '.</div>' +
              '<div class="pf-print-item-text">' + item.text + '</div>' +
              '<div class="pf-print-item-boxes">' +
                '<span class="pf-print-circle">1</span>' +
                '<span class="pf-print-circle">2</span>' +
                '<span class="pf-print-circle">3</span>' +
                '<span class="pf-print-circle">4</span>' +
                '<span class="pf-print-circle">5</span>' +
              '</div>' +
            '</div>';
          });
        });
        html += '<div style="margin-top: 10px; font-size: 10px; color: #555;">Scale: 1 = Never, 2 = Rarely, 3 = Sometimes, 4 = Often, 5 = Always</div>';
        break;
    }

    html += '</div>';
    return html;
  }

  function getMaxScore(form, formId) {
    switch (formId) {
      case 'tisdale-qt': return 35;
      case 'cdr': return 18; // 3 x 6 domains
      case 'aq-10': return 10;
      case 'asrs': return '18+'; // Part B varies
      case 'cidi': return 9;
      case 'ymrs': return 60;
      case 'pcl5': return 80;
      case 'ybocs': return 40;
      case 'msibpd': return 10;
      case 'panss-6': return 42;
      case 'panss-30': return 210;
      case 'bfcrs': return '77+'; // CRS 69 + CSI 14
      case 'aims': return 28;
      case 'ess': return 24;
      case 'suicide-risk': return 'Assessment';
      case 'cssrs-full': return 'Assessment';
      case 'bat-work': return 115;
      case 'bat-general': return 110;
      default: return '—';
    }
  }

})();

/* ────────────────────────────────────────────────────────────────────────
   Freeform Forms — Psychiatric History (H&P) and Psychiatric SOAP
   These are full-page fillable forms (not scored scales), so they bypass
   the FORMS scoring template and render their own one-page layout.
   ──────────────────────────────────────────────────────────────────────── */
(function() {
  var __originalPrintBlankForm = window.printBlankForm;

  window.printBlankForm = function(formId) {
    if (formId === 'psych-history') { return printPsychHistoryForm(); }
    if (formId === 'psych-soap')    { return printPsychSoapForm(); }
    if (typeof __originalPrintBlankForm === 'function') {
      return __originalPrintBlankForm(formId);
    }
  };

  function openFreeformWindow(title, bodyHtml) {
    var w = window.open('', '_blank');
    var html = ''
      + '<!DOCTYPE html><html><head><meta charset="UTF-8">'
      + '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
      + '<title>' + title + '</title>'
      + '<style>'
      + '* { margin: 0; padding: 0; box-sizing: border-box; }'
      + 'body { font-family: "Segoe UI", Tahoma, sans-serif; color: #000; background: #f5f5f5; font-size: 10.5px; line-height: 1.35; }'
      + '@media print { body { background: #fff; } .ff-page { box-shadow: none !important; margin: 0 !important; } }'
      + '.ff-page { background: #fff; color: #000; margin: 0 auto; padding: 0.4in 0.45in; max-width: 8.5in; min-height: 10.6in; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }'
      + '.ff-header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #000; padding-bottom: 5px; margin-bottom: 8px; }'
      + '.ff-title { font-size: 14px; font-weight: bold; }'
      + '.ff-sub { font-size: 9px; color: #555; font-style: italic; }'
      + '.ff-id { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px 14px; font-size: 9px; margin-bottom: 8px; }'
      + '.ff-id .ff-field { display: flex; align-items: baseline; }'
      + '.ff-id .ff-lbl { font-weight: bold; min-width: 52px; }'
      + '.ff-id .ff-line { flex: 1; border-bottom: 1px solid #000; height: 14px; margin-left: 4px; }'
      + '.ff-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }'
      + '.ff-grid-2-3rows { grid-template-rows: auto auto; }'
      + '.ff-quad { border: 1px solid #000; padding: 5px 7px; }'
      + '.ff-quad h3 { font-size: 10.5px; font-weight: bold; margin: 0 0 4px 0; padding-bottom: 2px; border-bottom: 1px solid #555; text-transform: uppercase; letter-spacing: 0.4px; }'
      + '.ff-quad .ff-sub-h { font-size: 9px; font-weight: bold; margin: 4px 0 1px 0; color: #333; }'
      + '.ff-lines { background-image: linear-gradient(transparent 13px, #999 13px, #999 14px, transparent 14px); background-size: 100% 14px; min-height: 56px; }'
      + '.ff-lines.ff-l-1 { min-height: 14px; }'
      + '.ff-lines.ff-l-2 { min-height: 28px; }'
      + '.ff-lines.ff-l-3 { min-height: 42px; }'
      + '.ff-lines.ff-l-4 { min-height: 56px; }'
      + '.ff-lines.ff-l-5 { min-height: 70px; }'
      + '.ff-lines.ff-l-6 { min-height: 84px; }'
      + '.ff-lines.ff-l-7 { min-height: 98px; }'
      + '.ff-lines.ff-l-8 { min-height: 112px; }'
      + '.ff-lines.ff-l-9 { min-height: 126px; }'
      + '.ff-lines.ff-l-10 { min-height: 140px; }'
      + '.ff-lines.ff-l-11 { min-height: 154px; }'
      + '.ff-lines.ff-l-12 { min-height: 168px; }'
      + '.ff-lines.ff-l-13 { min-height: 182px; }'
      + '.ff-lines.ff-l-14 { min-height: 196px; }'
      + '.ff-lines.ff-l-15 { min-height: 210px; }'
      + '.ff-row { display: flex; align-items: baseline; gap: 8px; margin: 2px 0; }'
      + '.ff-row .ff-row-lbl { font-weight: bold; font-size: 9px; min-width: 70px; }'
      + '.ff-row .ff-row-line { flex: 1; border-bottom: 1px solid #000; height: 13px; }'
      + '.ff-chk { display: inline-block; width: 9px; height: 9px; border: 1px solid #000; vertical-align: -1px; margin-right: 3px; }'
      + '.ff-vit { display: grid; grid-template-columns: repeat(4, 1fr); gap: 3px 8px; font-size: 9px; }'
      + '.ff-mse { font-size: 9px; }'
      + '.ff-mse-line { display: flex; gap: 4px; margin: 1px 0; }'
      + '.ff-mse-line b { font-weight: bold; min-width: 64px; display: inline-block; }'
      + '.ff-mse-line .ff-mse-fill { flex: 1; border-bottom: 1px solid #000; height: 12px; }'
      + '.ff-footer { margin-top: 6px; padding-top: 4px; border-top: 1px solid #999; font-size: 7.5px; color: #666; text-align: center; }'
      + '.ff-print-btn { position: fixed; top: 10px; right: 10px; padding: 8px 14px; background: #4a7c35; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: 600; font-size: 12px; z-index: 100; }'
      + '@media print { .ff-print-btn { display: none !important; } }'
      + '</style></head><body>'
      + '<button class="ff-print-btn" onclick="window.print()">Print this form</button>'
      + bodyHtml
      + '</body></html>';
    w.document.write(html);
    w.document.close();
    setTimeout(function() { try { w.print(); } catch (e) {} }, 250);
  }

  function patientHeaderHtml(title, subtitle) {
    return ''
      + '<div class="ff-header">'
      +   '<div><div class="ff-title">' + title + '</div>'
      +       '<div class="ff-sub">' + subtitle + '</div></div>'
      +   '<div class="ff-sub">PsychoPharmRef.com</div>'
      + '</div>'
      + '<div class="ff-id">'
      +   '<div class="ff-field"><span class="ff-lbl">Patient:</span><span class="ff-line"></span></div>'
      +   '<div class="ff-field"><span class="ff-lbl">DOB:</span><span class="ff-line"></span></div>'
      +   '<div class="ff-field"><span class="ff-lbl">MRN:</span><span class="ff-line"></span></div>'
      +   '<div class="ff-field"><span class="ff-lbl">Date:</span><span class="ff-line"></span></div>'
      +   '<div class="ff-field" style="grid-column: span 2;"><span class="ff-lbl">Clinician:</span><span class="ff-line"></span></div>'
      +   '<div class="ff-field"><span class="ff-lbl">Setting:</span><span class="ff-line"></span></div>'
      +   '<div class="ff-field"><span class="ff-lbl">Visit #:</span><span class="ff-line"></span></div>'
      + '</div>';
  }

  function printPsychHistoryForm() {
    var topLeft = ''
      + '<div class="ff-quad">'
      +   '<h3>1. Chief Complaint &middot; HPI &middot; ROS</h3>'
      +   '<div class="ff-sub-h">Chief Complaint (in patient\'s words)</div>'
      +   '<div class="ff-lines ff-l-2"></div>'
      +   '<div class="ff-sub-h">History of Present Illness</div>'
      +   '<div class="ff-lines ff-l-14"></div>'
      +   '<div class="ff-sub-h">Review of Systems (constitutional, neuro, GI, cardiopulm, endo, GU, pain)</div>'
      +   '<div class="ff-lines ff-l-4"></div>'
      + '</div>';

    var bottomLeft = ''
      + '<div class="ff-quad">'
      +   '<h3>2. Background</h3>'
      +   '<div class="ff-sub-h">Past Psychiatric History (dx, hospitalizations, ECT, prior trials)</div>'
      +   '<div class="ff-lines ff-l-4"></div>'
      +   '<div class="ff-sub-h">Past Medical History</div>'
      +   '<div class="ff-lines ff-l-2"></div>'
      +   '<div class="ff-sub-h">Past Surgical History</div>'
      +   '<div class="ff-lines ff-l-1"></div>'
      +   '<div class="ff-sub-h">Allergies</div>'
      +   '<div class="ff-lines ff-l-1"></div>'
      +   '<div class="ff-sub-h">Family History (psych, SUD, suicide)</div>'
      +   '<div class="ff-lines ff-l-2"></div>'
      +   '<div class="ff-sub-h">Alcohol &amp; Drug History (incl. tobacco, last use, withdrawal hx)</div>'
      +   '<div class="ff-lines ff-l-2"></div>'
      +   '<div class="ff-sub-h">Legal History</div>'
      +   '<div class="ff-lines ff-l-1"></div>'
      +   '<div class="ff-sub-h">Psychosocial History (housing, support, trauma, education, occupational)</div>'
      +   '<div class="ff-lines ff-l-7"></div>'
      + '</div>';

    var topRight = ''
      + '<div class="ff-quad">'
      +   '<h3>3. Mental Status Exam &middot; Vitals &middot; Labs</h3>'
      +   '<div class="ff-mse">'
      +     '<div class="ff-mse-line"><b>Appearance:</b><span class="ff-mse-fill"></span></div>'
      +     '<div class="ff-mse-line"><b>Behavior:</b><span class="ff-mse-fill"></span></div>'
      +     '<div class="ff-mse-line"><b>Speech:</b><span class="ff-mse-fill"></span></div>'
      +     '<div class="ff-mse-line"><b>Mood:</b><span class="ff-mse-fill"></span></div>'
      +     '<div class="ff-mse-line"><b>Affect:</b><span class="ff-mse-fill"></span></div>'
      +     '<div class="ff-mse-line"><b>Thought Process:</b><span class="ff-mse-fill"></span></div>'
      +     '<div class="ff-mse-line"><b>Thought Content:</b><span class="ff-mse-fill"></span></div>'
      +     '<div class="ff-mse-line"><b>SI / HI:</b><span class="ff-mse-fill"></span></div>'
      +     '<div class="ff-mse-line"><b>Perceptual:</b><span class="ff-mse-fill"></span></div>'
      +     '<div class="ff-mse-line"><b>Cognition:</b><span class="ff-mse-fill"></span></div>'
      +     '<div class="ff-mse-line"><b>Insight:</b><span class="ff-mse-fill"></span></div>'
      +     '<div class="ff-mse-line"><b>Judgment:</b><span class="ff-mse-fill"></span></div>'
      +   '</div>'
      +   '<div class="ff-sub-h" style="margin-top:18px;">Vitals</div>'
      +   '<div class="ff-vit">'
      +     '<div class="ff-row"><span class="ff-row-lbl">BP</span><span class="ff-row-line"></span></div>'
      +     '<div class="ff-row"><span class="ff-row-lbl">HR</span><span class="ff-row-line"></span></div>'
      +     '<div class="ff-row"><span class="ff-row-lbl">RR</span><span class="ff-row-line"></span></div>'
      +     '<div class="ff-row"><span class="ff-row-lbl">Temp</span><span class="ff-row-line"></span></div>'
      +     '<div class="ff-row"><span class="ff-row-lbl">SpO2</span><span class="ff-row-line"></span></div>'
      +     '<div class="ff-row"><span class="ff-row-lbl">Wt</span><span class="ff-row-line"></span></div>'
      +     '<div class="ff-row"><span class="ff-row-lbl">BMI</span><span class="ff-row-line"></span></div>'
      +     '<div class="ff-row"><span class="ff-row-lbl">QTc</span><span class="ff-row-line"></span></div>'
      +   '</div>'
      +   '<div class="ff-sub-h" style="margin-top:14px;">Labs / Toxicology / Imaging</div>'
      +   '<div class="ff-lines ff-l-6"></div>'
      + '</div>';

    var bottomRight = ''
      + '<div class="ff-quad">'
      +   '<h3>4. Diagnosis &middot; Assessment &middot; Plan</h3>'
      +   '<div class="ff-sub-h">DSM-5-TR Diagnosis (primary, comorbid, rule-outs)</div>'
      +   '<div class="ff-lines ff-l-3"></div>'
      +   '<div class="ff-sub-h">Assessment / Formulation (4 P\'s: predisposing, precipitating, perpetuating, protective)</div>'
      +   '<div class="ff-lines ff-l-5"></div>'
      +   '<div class="ff-sub-h">Risk (suicide / violence / self-care / capacity)</div>'
      +   '<div class="ff-row"><span class="ff-row-lbl">Risk level:</span>'
      +     '<span style="font-size:9px;"><span class="ff-chk"></span>Low <span class="ff-chk"></span>Moderate <span class="ff-chk"></span>High <span class="ff-chk"></span>Imminent</span>'
      +   '</div>'
      +   '<div class="ff-lines ff-l-2"></div>'
      +   '<div class="ff-sub-h">Plan: Medications (start / continue / hold / change)</div>'
      +   '<div class="ff-lines ff-l-4"></div>'
      +   '<div class="ff-sub-h">Plan: Therapy / Labs / Follow-up / Disposition / Patient Education</div>'
      +   '<div class="ff-lines ff-l-8"></div>'
      + '</div>';

    var body = ''
      + '<div class="ff-page">'
      +   patientHeaderHtml('Psychiatric History &amp; Mental Status Exam', 'One-page intake worksheet — four-quadrant layout')
      +   '<div class="ff-grid-2">'
      +     topLeft + topRight
      +     bottomLeft + bottomRight
      +   '</div>'
      +   '<div class="ff-footer">Educational form for clinician use. Document signs of acute risk separately. Source: PsychoPharmRef.com</div>'
      + '</div>';
    openFreeformWindow('Psychiatric History &amp; MSE', body);
  }

  function printPsychSoapForm() {
    var subjective = ''
      + '<div class="ff-quad" style="margin-bottom:5px;">'
      +   '<h3>S &mdash; Subjective</h3>'
      +   '<div class="ff-sub-h">Interval History &amp; Patient Report</div>'
      +   '<div class="ff-lines ff-l-4"></div>'
      +   '<div class="ff-grid-2" style="gap:8px; margin-top:4px;">'
      +     '<div>'
      +       '<div class="ff-row"><span class="ff-row-lbl">Mood:</span><span class="ff-row-line"></span></div>'
      +       '<div class="ff-row"><span class="ff-row-lbl">Anxiety:</span><span class="ff-row-line"></span></div>'
      +       '<div class="ff-row"><span class="ff-row-lbl">Sleep:</span><span class="ff-row-line"></span></div>'
      +       '<div class="ff-row"><span class="ff-row-lbl">Appetite:</span><span class="ff-row-line"></span></div>'
      +       '<div class="ff-row"><span class="ff-row-lbl">Energy:</span><span class="ff-row-line"></span></div>'
      +       '<div class="ff-row"><span class="ff-row-lbl">Concentration:</span><span class="ff-row-line"></span></div>'
      +     '</div>'
      +     '<div>'
      +       '<div class="ff-row"><span class="ff-row-lbl">SI:</span>'
      +         '<span style="font-size:9px;"><span class="ff-chk"></span>None <span class="ff-chk"></span>Passive <span class="ff-chk"></span>Active <span class="ff-chk"></span>Plan</span>'
      +       '</div>'
      +       '<div class="ff-row"><span class="ff-row-lbl">HI:</span>'
      +         '<span style="font-size:9px;"><span class="ff-chk"></span>None <span class="ff-chk"></span>Passive <span class="ff-chk"></span>Active <span class="ff-chk"></span>Plan</span>'
      +       '</div>'
      +       '<div class="ff-row"><span class="ff-row-lbl">Substances:</span><span class="ff-row-line"></span></div>'
      +       '<div class="ff-row"><span class="ff-row-lbl">Adherence:</span>'
      +         '<span style="font-size:9px;"><span class="ff-chk"></span>Full <span class="ff-chk"></span>Partial <span class="ff-chk"></span>None</span>'
      +       '</div>'
      +       '<div class="ff-row"><span class="ff-row-lbl">Side effects:</span><span class="ff-row-line"></span></div>'
      +       '<div class="ff-row"><span class="ff-row-lbl">Stressors:</span><span class="ff-row-line"></span></div>'
      +     '</div>'
      +   '</div>'
      + '</div>';

    var objective = ''
      + '<div class="ff-quad" style="margin-bottom:5px;">'
      +   '<h3>O &mdash; Objective</h3>'
      +   '<div class="ff-grid-2" style="gap:8px;">'
      +     '<div>'
      +       '<div class="ff-sub-h">Vitals</div>'
      +       '<div class="ff-row"><span class="ff-row-lbl">BP / HR</span><span class="ff-row-line"></span></div>'
      +       '<div class="ff-row"><span class="ff-row-lbl">Wt / BMI</span><span class="ff-row-line"></span></div>'
      +       '<div class="ff-row"><span class="ff-row-lbl">Labs / QTc</span><span class="ff-row-line"></span></div>'
      +     '</div>'
      +     '<div>'
      +       '<div class="ff-sub-h">Mental Status (key findings)</div>'
      +       '<div class="ff-mse">'
      +         '<div class="ff-mse-line"><b>App / Beh:</b><span class="ff-mse-fill"></span></div>'
      +         '<div class="ff-mse-line"><b>Mood / Aff:</b><span class="ff-mse-fill"></span></div>'
      +         '<div class="ff-mse-line"><b>TP / TC:</b><span class="ff-mse-fill"></span></div>'
      +         '<div class="ff-mse-line"><b>Cog / Ins:</b><span class="ff-mse-fill"></span></div>'
      +       '</div>'
      +     '</div>'
      +   '</div>'
      +   '<div class="ff-sub-h" style="margin-top:3px;">Rating Scales (PHQ-9, GAD-7, AIMS, C-SSRS, etc.)</div>'
      +   '<div class="ff-lines ff-l-2"></div>'
      + '</div>';

    var assessment = ''
      + '<div class="ff-quad" style="margin-bottom:5px;">'
      +   '<h3>A &mdash; Assessment</h3>'
      +   '<div class="ff-sub-h">Diagnosis &amp; Course (improving / stable / worsening / partial response)</div>'
      +   '<div class="ff-lines ff-l-3"></div>'
      +   '<div class="ff-row"><span class="ff-row-lbl">Risk:</span>'
      +     '<span style="font-size:9px;"><span class="ff-chk"></span>Low <span class="ff-chk"></span>Moderate <span class="ff-chk"></span>High <span class="ff-chk"></span>Imminent &nbsp; '
      +     '<span class="ff-row-lbl" style="min-width:auto;">Capacity:</span>'
      +     '<span class="ff-chk"></span>Intact <span class="ff-chk"></span>Impaired</span>'
      +   '</div>'
      + '</div>';

    var plan = ''
      + '<div class="ff-quad">'
      +   '<h3>P &mdash; Plan</h3>'
      +   '<div class="ff-sub-h">Medications (continue / change / start / discontinue &mdash; with dose &amp; rationale)</div>'
      +   '<div class="ff-lines ff-l-4"></div>'
      +   '<div class="ff-grid-2" style="gap:8px; margin-top:4px;">'
      +     '<div>'
      +       '<div class="ff-sub-h">Therapy / Referrals / Coordination</div>'
      +       '<div class="ff-lines ff-l-3"></div>'
      +     '</div>'
      +     '<div>'
      +       '<div class="ff-sub-h">Labs / Monitoring / Follow-up Interval</div>'
      +       '<div class="ff-lines ff-l-3"></div>'
      +     '</div>'
      +   '</div>'
      +   '<div class="ff-sub-h">Patient Education &amp; Safety Plan Reviewed</div>'
      +   '<div class="ff-lines ff-l-2"></div>'
      + '</div>';

    var body = ''
      + '<div class="ff-page">'
      +   patientHeaderHtml('Psychiatric Follow-Up &mdash; SOAP Note', 'One-page progress-note worksheet')
      +   subjective + objective + assessment + plan
      +   '<div class="ff-footer">Educational form for clinician use. Document acute risk and safety planning separately. Source: PsychoPharmRef.com</div>'
      + '</div>';
    openFreeformWindow('Psychiatric SOAP Note', body);
  }
})();

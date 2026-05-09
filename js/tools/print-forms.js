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

  /* ─────────────────────────────────────────────────────────────────────────
     Tool URLs + precomputed QR codes (one per printable form)
     QRs deep-link back to the corresponding clinical tool webform on
     psychopharmref.com so clinicians can scan, enter results, and copy
     the formatted summary into their EMR.
     ───────────────────────────────────────────────────────────────────────── */
  const TOOL_URLS = {
    "tisdale-qt": "https://psychopharmref.com/#qt-risk",
    "cdr": "https://psychopharmref.com/#cdr-tool",
    "aq-10": "https://psychopharmref.com/#aq-tool",
    "asrs": "https://psychopharmref.com/#asrs-tool",
    "cidi": "https://psychopharmref.com/#cidi-tool",
    "ymrs": "https://psychopharmref.com/#ymrs-tool",
    "pcl5": "https://psychopharmref.com/#pcl5-tool",
    "ybocs": "https://psychopharmref.com/#ybocs-tool",
    "msibpd": "https://psychopharmref.com/#msibpd-tool",
    "panss-6": "https://psychopharmref.com/#panss-tool",
    "panss-30": "https://psychopharmref.com/#panss-tool",
    "bfcrs": "https://psychopharmref.com/#bfcrs-tool",
    "aims": "https://psychopharmref.com/#aims-tool",
    "ess": "https://psychopharmref.com/#ess-tool",
    "suicide-risk": "https://psychopharmref.com/#suicide-risk-tools",
    "cssrs-full": "https://psychopharmref.com/#suicide-risk-tools",
    "bat-work": "https://psychopharmref.com/#bat-tool",
    "bat-general": "https://psychopharmref.com/#bat-tool"
  };

  const TOOL_QR_SVGS = {
    "tisdale-qt": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 31 31\" width=\"90\" height=\"90\" shape-rendering=\"crispEdges\"><rect width=\"31\" height=\"31\" fill=\"#fff\"/><path fill=\"#000\" d=\"M1 1h7v1h-7zM9 1h1v1h-1zM11 1h2v1h-2zM16 1h5v1h-5zM23 1h7v1h-7zM1 2h1v1h-1zM7 2h1v1h-1zM9 2h1v1h-1zM12 2h2v1h-2zM15 2h2v1h-2zM19 2h1v1h-1zM21 2h1v1h-1zM23 2h1v1h-1zM29 2h1v1h-1zM1 3h1v1h-1zM3 3h3v1h-3zM7 3h1v1h-1zM10 3h3v1h-3zM14 3h3v1h-3zM21 3h1v1h-1zM23 3h1v1h-1zM25 3h3v1h-3zM29 3h1v1h-1zM1 4h1v1h-1zM3 4h3v1h-3zM7 4h1v1h-1zM9 4h3v1h-3zM18 4h1v1h-1zM23 4h1v1h-1zM25 4h3v1h-3zM29 4h1v1h-1zM1 5h1v1h-1zM3 5h3v1h-3zM7 5h1v1h-1zM13 5h2v1h-2zM18 5h1v1h-1zM20 5h1v1h-1zM23 5h1v1h-1zM25 5h3v1h-3zM29 5h1v1h-1zM1 6h1v1h-1zM7 6h1v1h-1zM10 6h2v1h-2zM13 6h1v1h-1zM15 6h1v1h-1zM18 6h1v1h-1zM20 6h2v1h-2zM23 6h1v1h-1zM29 6h1v1h-1zM1 7h7v1h-7zM9 7h1v1h-1zM11 7h1v1h-1zM13 7h1v1h-1zM15 7h1v1h-1zM17 7h1v1h-1zM19 7h1v1h-1zM21 7h1v1h-1zM23 7h7v1h-7zM9 8h3v1h-3zM13 8h4v1h-4zM18 8h2v1h-2zM1 9h1v1h-1zM3 9h2v1h-2zM6 9h3v1h-3zM13 9h8v1h-8zM23 9h1v1h-1zM26 9h1v1h-1zM28 9h2v1h-2zM1 10h1v1h-1zM4 10h2v1h-2zM10 10h4v1h-4zM17 10h9v1h-9zM29 10h1v1h-1zM1 11h1v1h-1zM3 11h3v1h-3zM7 11h1v1h-1zM10 11h1v1h-1zM13 11h1v1h-1zM15 11h1v1h-1zM17 11h1v1h-1zM19 11h1v1h-1zM21 11h1v1h-1zM23 11h1v1h-1zM25 11h1v1h-1zM27 11h2v1h-2zM1 12h4v1h-4zM6 12h1v1h-1zM14 12h4v1h-4zM19 12h1v1h-1zM23 12h1v1h-1zM29 12h1v1h-1zM2 13h3v1h-3zM7 13h1v1h-1zM11 13h1v1h-1zM16 13h3v1h-3zM21 13h1v1h-1zM26 13h2v1h-2zM1 14h2v1h-2zM4 14h3v1h-3zM9 14h1v1h-1zM12 14h3v1h-3zM16 14h2v1h-2zM20 14h1v1h-1zM23 14h1v1h-1zM27 14h3v1h-3zM1 15h8v1h-8zM10 15h2v1h-2zM13 15h1v1h-1zM15 15h1v1h-1zM19 15h4v1h-4zM24 15h1v1h-1zM27 15h3v1h-3zM4 16h1v1h-1zM8 16h2v1h-2zM11 16h1v1h-1zM13 16h2v1h-2zM16 16h1v1h-1zM21 16h1v1h-1zM23 16h1v1h-1zM28 16h1v1h-1zM2 17h3v1h-3zM6 17h5v1h-5zM12 17h2v1h-2zM16 17h1v1h-1zM20 17h3v1h-3zM25 17h2v1h-2zM28 17h1v1h-1zM2 18h2v1h-2zM5 18h2v1h-2zM12 18h3v1h-3zM16 18h1v1h-1zM18 18h1v1h-1zM21 18h2v1h-2zM24 18h1v1h-1zM26 18h3v1h-3zM1 19h1v1h-1zM3 19h2v1h-2zM6 19h2v1h-2zM12 19h2v1h-2zM16 19h1v1h-1zM18 19h1v1h-1zM22 19h1v1h-1zM24 19h1v1h-1zM27 19h1v1h-1zM3 20h1v1h-1zM5 20h2v1h-2zM9 20h2v1h-2zM16 20h1v1h-1zM18 20h4v1h-4zM24 20h1v1h-1zM27 20h1v1h-1zM2 21h3v1h-3zM6 21h4v1h-4zM12 21h3v1h-3zM18 21h1v1h-1zM20 21h8v1h-8zM9 22h1v1h-1zM12 22h1v1h-1zM14 22h2v1h-2zM17 22h1v1h-1zM19 22h3v1h-3zM25 22h5v1h-5zM1 23h7v1h-7zM9 23h1v1h-1zM13 23h2v1h-2zM17 23h1v1h-1zM20 23h2v1h-2zM23 23h1v1h-1zM25 23h2v1h-2zM28 23h1v1h-1zM1 24h1v1h-1zM7 24h1v1h-1zM9 24h3v1h-3zM19 24h1v1h-1zM21 24h1v1h-1zM25 24h2v1h-2zM28 24h1v1h-1zM1 25h1v1h-1zM3 25h3v1h-3zM7 25h1v1h-1zM11 25h1v1h-1zM13 25h1v1h-1zM15 25h1v1h-1zM18 25h1v1h-1zM21 25h5v1h-5zM27 25h2v1h-2zM1 26h1v1h-1zM3 26h3v1h-3zM7 26h1v1h-1zM9 26h1v1h-1zM11 26h1v1h-1zM14 26h3v1h-3zM18 26h5v1h-5zM25 26h2v1h-2zM29 26h1v1h-1zM1 27h1v1h-1zM3 27h3v1h-3zM7 27h1v1h-1zM9 27h2v1h-2zM12 27h2v1h-2zM15 27h1v1h-1zM17 27h1v1h-1zM20 27h1v1h-1zM24 27h1v1h-1zM27 27h1v1h-1zM29 27h1v1h-1zM1 28h1v1h-1zM7 28h1v1h-1zM10 28h2v1h-2zM14 28h1v1h-1zM16 28h2v1h-2zM21 28h3v1h-3zM25 28h2v1h-2zM28 28h1v1h-1zM1 29h7v1h-7zM9 29h4v1h-4zM14 29h1v1h-1zM17 29h1v1h-1zM19 29h3v1h-3zM24 29h1v1h-1zM26 29h1v1h-1zM28 29h1v1h-1z\"/></svg>",
    "cdr": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 31 31\" width=\"90\" height=\"90\" shape-rendering=\"crispEdges\"><rect width=\"31\" height=\"31\" fill=\"#fff\"/><path fill=\"#000\" d=\"M1 1h7v1h-7zM14 1h2v1h-2zM17 1h5v1h-5zM23 1h7v1h-7zM1 2h1v1h-1zM7 2h1v1h-1zM9 2h1v1h-1zM12 2h1v1h-1zM15 2h2v1h-2zM19 2h2v1h-2zM23 2h1v1h-1zM29 2h1v1h-1zM1 3h1v1h-1zM3 3h3v1h-3zM7 3h1v1h-1zM14 3h2v1h-2zM19 3h2v1h-2zM23 3h1v1h-1zM25 3h3v1h-3zM29 3h1v1h-1zM1 4h1v1h-1zM3 4h3v1h-3zM7 4h1v1h-1zM10 4h1v1h-1zM12 4h1v1h-1zM14 4h2v1h-2zM19 4h2v1h-2zM23 4h1v1h-1zM25 4h3v1h-3zM29 4h1v1h-1zM1 5h1v1h-1zM3 5h3v1h-3zM7 5h1v1h-1zM9 5h1v1h-1zM11 5h1v1h-1zM15 5h2v1h-2zM19 5h2v1h-2zM23 5h1v1h-1zM25 5h3v1h-3zM29 5h1v1h-1zM1 6h1v1h-1zM7 6h1v1h-1zM10 6h3v1h-3zM14 6h1v1h-1zM16 6h2v1h-2zM20 6h2v1h-2zM23 6h1v1h-1zM29 6h1v1h-1zM1 7h7v1h-7zM9 7h1v1h-1zM11 7h1v1h-1zM13 7h1v1h-1zM15 7h1v1h-1zM17 7h1v1h-1zM19 7h1v1h-1zM21 7h1v1h-1zM23 7h7v1h-7zM11 8h1v1h-1zM13 8h3v1h-3zM17 8h5v1h-5zM1 9h1v1h-1zM3 9h1v1h-1zM5 9h1v1h-1zM7 9h1v1h-1zM10 9h1v1h-1zM12 9h2v1h-2zM15 9h4v1h-4zM21 9h1v1h-1zM25 9h1v1h-1zM28 9h1v1h-1zM3 10h2v1h-2zM8 10h4v1h-4zM13 10h1v1h-1zM15 10h1v1h-1zM17 10h1v1h-1zM21 10h3v1h-3zM26 10h1v1h-1zM29 10h1v1h-1zM3 11h1v1h-1zM6 11h4v1h-4zM14 11h1v1h-1zM18 11h1v1h-1zM21 11h1v1h-1zM24 11h1v1h-1zM27 11h3v1h-3zM2 12h1v1h-1zM4 12h2v1h-2zM10 12h4v1h-4zM17 12h3v1h-3zM22 12h1v1h-1zM24 12h1v1h-1zM28 12h1v1h-1zM1 13h2v1h-2zM5 13h3v1h-3zM10 13h1v1h-1zM12 13h1v1h-1zM16 13h3v1h-3zM22 13h2v1h-2zM26 13h1v1h-1zM28 13h2v1h-2zM2 14h2v1h-2zM9 14h2v1h-2zM12 14h3v1h-3zM17 14h1v1h-1zM21 14h3v1h-3zM26 14h1v1h-1zM29 14h1v1h-1zM4 15h1v1h-1zM6 15h2v1h-2zM9 15h4v1h-4zM15 15h1v1h-1zM17 15h1v1h-1zM22 15h1v1h-1zM24 15h3v1h-3zM28 15h2v1h-2zM11 16h1v1h-1zM13 16h9v1h-9zM23 16h4v1h-4zM28 16h1v1h-1zM2 17h1v1h-1zM5 17h4v1h-4zM11 17h1v1h-1zM15 17h1v1h-1zM18 17h7v1h-7zM26 17h1v1h-1zM28 17h2v1h-2zM5 18h1v1h-1zM9 18h2v1h-2zM13 18h1v1h-1zM15 18h1v1h-1zM17 18h1v1h-1zM21 18h1v1h-1zM23 18h1v1h-1zM26 18h2v1h-2zM29 18h1v1h-1zM1 19h1v1h-1zM4 19h2v1h-2zM7 19h1v1h-1zM10 19h1v1h-1zM12 19h3v1h-3zM18 19h1v1h-1zM21 19h1v1h-1zM23 19h2v1h-2zM28 19h2v1h-2zM2 20h3v1h-3zM9 20h4v1h-4zM16 20h4v1h-4zM22 20h1v1h-1zM24 20h1v1h-1zM26 20h1v1h-1zM28 20h1v1h-1zM1 21h1v1h-1zM3 21h5v1h-5zM10 21h3v1h-3zM16 21h4v1h-4zM21 21h5v1h-5zM9 22h4v1h-4zM14 22h1v1h-1zM18 22h1v1h-1zM21 22h1v1h-1zM25 22h1v1h-1zM27 22h3v1h-3zM1 23h7v1h-7zM11 23h3v1h-3zM15 23h1v1h-1zM17 23h5v1h-5zM23 23h1v1h-1zM25 23h2v1h-2zM28 23h2v1h-2zM1 24h1v1h-1zM7 24h1v1h-1zM11 24h1v1h-1zM14 24h2v1h-2zM18 24h2v1h-2zM21 24h1v1h-1zM25 24h2v1h-2zM28 24h1v1h-1zM1 25h1v1h-1zM3 25h3v1h-3zM7 25h1v1h-1zM9 25h1v1h-1zM11 25h3v1h-3zM15 25h1v1h-1zM18 25h1v1h-1zM21 25h5v1h-5zM28 25h2v1h-2zM1 26h1v1h-1zM3 26h3v1h-3zM7 26h1v1h-1zM10 26h2v1h-2zM13 26h1v1h-1zM15 26h1v1h-1zM17 26h2v1h-2zM25 26h1v1h-1zM27 26h3v1h-3zM1 27h1v1h-1zM3 27h3v1h-3zM7 27h1v1h-1zM9 27h1v1h-1zM12 27h1v1h-1zM17 27h3v1h-3zM21 27h1v1h-1zM24 27h3v1h-3zM29 27h1v1h-1zM1 28h1v1h-1zM7 28h1v1h-1zM10 28h3v1h-3zM14 28h11v1h-11zM28 28h1v1h-1zM1 29h7v1h-7zM9 29h1v1h-1zM11 29h3v1h-3zM15 29h1v1h-1zM17 29h2v1h-2zM20 29h2v1h-2zM23 29h1v1h-1zM25 29h2v1h-2zM28 29h2v1h-2z\"/></svg>",
    "aq-10": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 31 31\" width=\"90\" height=\"90\" shape-rendering=\"crispEdges\"><rect width=\"31\" height=\"31\" fill=\"#fff\"/><path fill=\"#000\" d=\"M1 1h7v1h-7zM9 1h1v1h-1zM16 1h5v1h-5zM23 1h7v1h-7zM1 2h1v1h-1zM7 2h1v1h-1zM9 2h2v1h-2zM12 2h1v1h-1zM15 2h2v1h-2zM19 2h1v1h-1zM21 2h1v1h-1zM23 2h1v1h-1zM29 2h1v1h-1zM1 3h1v1h-1zM3 3h3v1h-3zM7 3h1v1h-1zM11 3h1v1h-1zM13 3h4v1h-4zM21 3h1v1h-1zM23 3h1v1h-1zM25 3h3v1h-3zM29 3h1v1h-1zM1 4h1v1h-1zM3 4h3v1h-3zM7 4h1v1h-1zM9 4h1v1h-1zM11 4h2v1h-2zM18 4h1v1h-1zM23 4h1v1h-1zM25 4h3v1h-3zM29 4h1v1h-1zM1 5h1v1h-1zM3 5h3v1h-3zM7 5h1v1h-1zM11 5h2v1h-2zM14 5h1v1h-1zM18 5h1v1h-1zM20 5h1v1h-1zM23 5h1v1h-1zM25 5h3v1h-3zM29 5h1v1h-1zM1 6h1v1h-1zM7 6h1v1h-1zM10 6h1v1h-1zM12 6h1v1h-1zM15 6h1v1h-1zM17 6h2v1h-2zM20 6h2v1h-2zM23 6h1v1h-1zM29 6h1v1h-1zM1 7h7v1h-7zM9 7h1v1h-1zM11 7h1v1h-1zM13 7h1v1h-1zM15 7h1v1h-1zM17 7h1v1h-1zM19 7h1v1h-1zM21 7h1v1h-1zM23 7h7v1h-7zM9 8h1v1h-1zM11 8h1v1h-1zM14 8h2v1h-2zM17 8h3v1h-3zM1 9h1v1h-1zM3 9h2v1h-2zM6 9h3v1h-3zM10 9h1v1h-1zM14 9h7v1h-7zM23 9h1v1h-1zM26 9h1v1h-1zM28 9h2v1h-2zM3 10h2v1h-2zM6 10h1v1h-1zM10 10h1v1h-1zM12 10h1v1h-1zM17 10h9v1h-9zM29 10h1v1h-1zM2 11h1v1h-1zM6 11h2v1h-2zM13 11h1v1h-1zM15 11h1v1h-1zM17 11h1v1h-1zM19 11h1v1h-1zM21 11h1v1h-1zM23 11h1v1h-1zM25 11h1v1h-1zM27 11h2v1h-2zM1 12h3v1h-3zM8 12h1v1h-1zM13 12h4v1h-4zM19 12h1v1h-1zM23 12h1v1h-1zM29 12h1v1h-1zM1 13h1v1h-1zM3 13h1v1h-1zM5 13h4v1h-4zM10 13h1v1h-1zM13 13h1v1h-1zM18 13h1v1h-1zM21 13h1v1h-1zM26 13h2v1h-2zM1 14h1v1h-1zM3 14h1v1h-1zM6 14h1v1h-1zM12 14h3v1h-3zM16 14h2v1h-2zM20 14h1v1h-1zM23 14h1v1h-1zM27 14h3v1h-3zM3 15h1v1h-1zM5 15h1v1h-1zM7 15h3v1h-3zM12 15h1v1h-1zM15 15h1v1h-1zM19 15h4v1h-4zM24 15h1v1h-1zM27 15h3v1h-3zM8 16h2v1h-2zM11 16h1v1h-1zM14 16h1v1h-1zM17 16h1v1h-1zM21 16h1v1h-1zM23 16h1v1h-1zM28 16h1v1h-1zM1 17h1v1h-1zM3 17h3v1h-3zM7 17h1v1h-1zM9 17h2v1h-2zM16 17h1v1h-1zM20 17h3v1h-3zM25 17h2v1h-2zM28 17h1v1h-1zM2 18h1v1h-1zM4 18h1v1h-1zM6 18h1v1h-1zM8 18h1v1h-1zM13 18h2v1h-2zM16 18h1v1h-1zM18 18h1v1h-1zM21 18h2v1h-2zM24 18h1v1h-1zM26 18h3v1h-3zM1 19h1v1h-1zM4 19h2v1h-2zM7 19h2v1h-2zM11 19h1v1h-1zM13 19h1v1h-1zM16 19h1v1h-1zM18 19h1v1h-1zM22 19h1v1h-1zM24 19h1v1h-1zM27 19h1v1h-1zM3 20h1v1h-1zM6 20h1v1h-1zM9 20h3v1h-3zM13 20h1v1h-1zM17 20h5v1h-5zM24 20h1v1h-1zM27 20h1v1h-1zM2 21h3v1h-3zM6 21h2v1h-2zM10 21h1v1h-1zM12 21h3v1h-3zM18 21h1v1h-1zM20 21h8v1h-8zM9 22h2v1h-2zM12 22h1v1h-1zM14 22h2v1h-2zM17 22h1v1h-1zM19 22h3v1h-3zM25 22h5v1h-5zM1 23h7v1h-7zM9 23h1v1h-1zM11 23h1v1h-1zM14 23h1v1h-1zM17 23h1v1h-1zM20 23h2v1h-2zM23 23h1v1h-1zM25 23h2v1h-2zM28 23h1v1h-1zM1 24h1v1h-1zM7 24h1v1h-1zM9 24h2v1h-2zM12 24h1v1h-1zM19 24h1v1h-1zM21 24h1v1h-1zM25 24h2v1h-2zM28 24h1v1h-1zM1 25h1v1h-1zM3 25h3v1h-3zM7 25h1v1h-1zM10 25h1v1h-1zM15 25h1v1h-1zM18 25h1v1h-1zM21 25h5v1h-5zM27 25h2v1h-2zM1 26h1v1h-1zM3 26h3v1h-3zM7 26h1v1h-1zM9 26h4v1h-4zM15 26h2v1h-2zM18 26h1v1h-1zM20 26h3v1h-3zM25 26h2v1h-2zM29 26h1v1h-1zM1 27h1v1h-1zM3 27h3v1h-3zM7 27h1v1h-1zM9 27h1v1h-1zM11 27h2v1h-2zM14 27h2v1h-2zM20 27h1v1h-1zM24 27h1v1h-1zM27 27h1v1h-1zM29 27h1v1h-1zM1 28h1v1h-1zM7 28h1v1h-1zM12 28h1v1h-1zM14 28h1v1h-1zM16 28h1v1h-1zM21 28h3v1h-3zM25 28h2v1h-2zM28 28h1v1h-1zM1 29h7v1h-7zM9 29h2v1h-2zM13 29h1v1h-1zM17 29h1v1h-1zM19 29h3v1h-3zM24 29h1v1h-1zM26 29h1v1h-1zM28 29h1v1h-1z\"/></svg>",
    "asrs": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 31 31\" width=\"90\" height=\"90\" shape-rendering=\"crispEdges\"><rect width=\"31\" height=\"31\" fill=\"#fff\"/><path fill=\"#000\" d=\"M1 1h7v1h-7zM10 1h2v1h-2zM13 1h4v1h-4zM18 1h4v1h-4zM23 1h7v1h-7zM1 2h1v1h-1zM7 2h1v1h-1zM11 2h1v1h-1zM13 2h1v1h-1zM15 2h2v1h-2zM19 2h1v1h-1zM23 2h1v1h-1zM29 2h1v1h-1zM1 3h1v1h-1zM3 3h3v1h-3zM7 3h1v1h-1zM10 3h1v1h-1zM13 3h1v1h-1zM16 3h1v1h-1zM18 3h4v1h-4zM23 3h1v1h-1zM25 3h3v1h-3zM29 3h1v1h-1zM1 4h1v1h-1zM3 4h3v1h-3zM7 4h1v1h-1zM11 4h1v1h-1zM13 4h2v1h-2zM19 4h2v1h-2zM23 4h1v1h-1zM25 4h3v1h-3zM29 4h1v1h-1zM1 5h1v1h-1zM3 5h3v1h-3zM7 5h1v1h-1zM11 5h3v1h-3zM15 5h3v1h-3zM19 5h1v1h-1zM23 5h1v1h-1zM25 5h3v1h-3zM29 5h1v1h-1zM1 6h1v1h-1zM7 6h1v1h-1zM9 6h2v1h-2zM12 6h2v1h-2zM16 6h3v1h-3zM20 6h1v1h-1zM23 6h1v1h-1zM29 6h1v1h-1zM1 7h7v1h-7zM9 7h1v1h-1zM11 7h1v1h-1zM13 7h1v1h-1zM15 7h1v1h-1zM17 7h1v1h-1zM19 7h1v1h-1zM21 7h1v1h-1zM23 7h7v1h-7zM10 8h1v1h-1zM13 8h2v1h-2zM18 8h2v1h-2zM21 8h1v1h-1zM1 9h1v1h-1zM4 9h1v1h-1zM6 9h2v1h-2zM9 9h1v1h-1zM12 9h1v1h-1zM15 9h3v1h-3zM22 9h1v1h-1zM24 9h1v1h-1zM1 10h3v1h-3zM6 10h1v1h-1zM9 10h1v1h-1zM11 10h2v1h-2zM14 10h1v1h-1zM17 10h1v1h-1zM21 10h3v1h-3zM26 10h1v1h-1zM29 10h1v1h-1zM1 11h1v1h-1zM4 11h5v1h-5zM10 11h3v1h-3zM14 11h2v1h-2zM18 11h1v1h-1zM20 11h2v1h-2zM23 11h2v1h-2zM26 11h3v1h-3zM4 12h2v1h-2zM8 12h1v1h-1zM12 12h1v1h-1zM14 12h1v1h-1zM16 12h2v1h-2zM19 12h1v1h-1zM21 12h2v1h-2zM27 12h2v1h-2zM1 13h1v1h-1zM5 13h1v1h-1zM7 13h3v1h-3zM11 13h1v1h-1zM13 13h1v1h-1zM15 13h1v1h-1zM18 13h1v1h-1zM22 13h2v1h-2zM26 13h1v1h-1zM28 13h2v1h-2zM1 14h2v1h-2zM5 14h1v1h-1zM8 14h1v1h-1zM12 14h1v1h-1zM14 14h2v1h-2zM20 14h3v1h-3zM2 15h2v1h-2zM5 15h3v1h-3zM10 15h6v1h-6zM18 15h1v1h-1zM21 15h2v1h-2zM25 15h5v1h-5zM1 16h2v1h-2zM5 16h1v1h-1zM8 16h1v1h-1zM11 16h1v1h-1zM16 16h6v1h-6zM23 16h4v1h-4zM28 16h1v1h-1zM2 17h1v1h-1zM4 17h1v1h-1zM7 17h3v1h-3zM11 17h2v1h-2zM14 17h1v1h-1zM16 17h1v1h-1zM18 17h2v1h-2zM21 17h2v1h-2zM24 17h1v1h-1zM28 17h1v1h-1zM2 18h1v1h-1zM4 18h3v1h-3zM12 18h4v1h-4zM18 18h1v1h-1zM23 18h2v1h-2zM26 18h1v1h-1zM29 18h1v1h-1zM1 19h1v1h-1zM3 19h1v1h-1zM7 19h2v1h-2zM10 19h1v1h-1zM12 19h1v1h-1zM15 19h1v1h-1zM18 19h1v1h-1zM21 19h1v1h-1zM23 19h2v1h-2zM28 19h2v1h-2zM3 20h4v1h-4zM11 20h1v1h-1zM13 20h1v1h-1zM15 20h1v1h-1zM17 20h4v1h-4zM22 20h3v1h-3zM28 20h2v1h-2zM1 21h1v1h-1zM7 21h1v1h-1zM9 21h1v1h-1zM11 21h3v1h-3zM19 21h1v1h-1zM21 21h5v1h-5zM27 21h1v1h-1zM9 22h2v1h-2zM15 22h1v1h-1zM17 22h2v1h-2zM21 22h1v1h-1zM25 22h1v1h-1zM27 22h3v1h-3zM1 23h7v1h-7zM10 23h1v1h-1zM12 23h1v1h-1zM18 23h2v1h-2zM21 23h1v1h-1zM23 23h1v1h-1zM25 23h1v1h-1zM28 23h1v1h-1zM1 24h1v1h-1zM7 24h1v1h-1zM9 24h1v1h-1zM13 24h1v1h-1zM15 24h1v1h-1zM19 24h1v1h-1zM21 24h1v1h-1zM25 24h3v1h-3zM1 25h1v1h-1zM3 25h3v1h-3zM7 25h1v1h-1zM10 25h2v1h-2zM13 25h1v1h-1zM18 25h1v1h-1zM21 25h5v1h-5zM28 25h2v1h-2zM1 26h1v1h-1zM3 26h3v1h-3zM7 26h1v1h-1zM9 26h1v1h-1zM11 26h1v1h-1zM14 26h1v1h-1zM18 26h1v1h-1zM20 26h1v1h-1zM23 26h1v1h-1zM25 26h4v1h-4zM1 27h1v1h-1zM3 27h3v1h-3zM7 27h1v1h-1zM14 27h2v1h-2zM18 27h2v1h-2zM25 27h3v1h-3zM29 27h1v1h-1zM1 28h1v1h-1zM7 28h1v1h-1zM18 28h7v1h-7zM28 28h1v1h-1zM1 29h7v1h-7zM9 29h1v1h-1zM13 29h1v1h-1zM15 29h1v1h-1zM17 29h2v1h-2zM21 29h1v1h-1zM25 29h1v1h-1zM28 29h1v1h-1z\"/></svg>",
    "cidi": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 31 31\" width=\"90\" height=\"90\" shape-rendering=\"crispEdges\"><rect width=\"31\" height=\"31\" fill=\"#fff\"/><path fill=\"#000\" d=\"M1 1h7v1h-7zM9 1h1v1h-1zM12 1h1v1h-1zM14 1h1v1h-1zM17 1h4v1h-4zM23 1h7v1h-7zM1 2h1v1h-1zM7 2h1v1h-1zM9 2h2v1h-2zM17 2h1v1h-1zM19 2h1v1h-1zM21 2h1v1h-1zM23 2h1v1h-1zM29 2h1v1h-1zM1 3h1v1h-1zM3 3h3v1h-3zM7 3h1v1h-1zM14 3h1v1h-1zM16 3h1v1h-1zM21 3h1v1h-1zM23 3h1v1h-1zM25 3h3v1h-3zM29 3h1v1h-1zM1 4h1v1h-1zM3 4h3v1h-3zM7 4h1v1h-1zM9 4h2v1h-2zM12 4h2v1h-2zM18 4h1v1h-1zM23 4h1v1h-1zM25 4h3v1h-3zM29 4h1v1h-1zM1 5h1v1h-1zM3 5h3v1h-3zM7 5h1v1h-1zM11 5h1v1h-1zM13 5h6v1h-6zM20 5h1v1h-1zM23 5h1v1h-1zM25 5h3v1h-3zM29 5h1v1h-1zM1 6h1v1h-1zM7 6h1v1h-1zM10 6h1v1h-1zM13 6h1v1h-1zM15 6h1v1h-1zM18 6h1v1h-1zM20 6h2v1h-2zM23 6h1v1h-1zM29 6h1v1h-1zM1 7h7v1h-7zM9 7h1v1h-1zM11 7h1v1h-1zM13 7h1v1h-1zM15 7h1v1h-1zM17 7h1v1h-1zM19 7h1v1h-1zM21 7h1v1h-1zM23 7h7v1h-7zM9 8h1v1h-1zM11 8h1v1h-1zM13 8h7v1h-7zM1 9h1v1h-1zM3 9h2v1h-2zM6 9h3v1h-3zM12 9h9v1h-9zM23 9h1v1h-1zM26 9h1v1h-1zM28 9h2v1h-2zM1 10h4v1h-4zM6 10h1v1h-1zM8 10h1v1h-1zM10 10h1v1h-1zM12 10h2v1h-2zM17 10h9v1h-9zM29 10h1v1h-1zM1 11h5v1h-5zM7 11h1v1h-1zM10 11h1v1h-1zM12 11h1v1h-1zM15 11h1v1h-1zM19 11h1v1h-1zM21 11h1v1h-1zM23 11h1v1h-1zM25 11h1v1h-1zM27 11h2v1h-2zM9 12h7v1h-7zM19 12h1v1h-1zM23 12h1v1h-1zM29 12h1v1h-1zM3 13h9v1h-9zM13 13h1v1h-1zM16 13h3v1h-3zM21 13h1v1h-1zM26 13h2v1h-2zM2 14h1v1h-1zM5 14h2v1h-2zM10 14h2v1h-2zM13 14h2v1h-2zM16 14h2v1h-2zM20 14h1v1h-1zM23 14h1v1h-1zM27 14h3v1h-3zM1 15h2v1h-2zM7 15h4v1h-4zM13 15h1v1h-1zM15 15h1v1h-1zM19 15h4v1h-4zM24 15h1v1h-1zM27 15h3v1h-3zM2 16h4v1h-4zM11 16h4v1h-4zM16 16h2v1h-2zM21 16h1v1h-1zM23 16h1v1h-1zM28 16h1v1h-1zM4 17h1v1h-1zM7 17h1v1h-1zM9 17h2v1h-2zM12 17h2v1h-2zM16 17h1v1h-1zM20 17h3v1h-3zM25 17h2v1h-2zM28 17h1v1h-1zM5 18h2v1h-2zM11 18h2v1h-2zM14 18h1v1h-1zM16 18h3v1h-3zM21 18h2v1h-2zM24 18h1v1h-1zM26 18h3v1h-3zM1 19h1v1h-1zM3 19h3v1h-3zM7 19h1v1h-1zM9 19h4v1h-4zM16 19h3v1h-3zM22 19h1v1h-1zM24 19h1v1h-1zM27 19h1v1h-1zM5 20h1v1h-1zM8 20h2v1h-2zM12 20h2v1h-2zM18 20h4v1h-4zM24 20h1v1h-1zM27 20h1v1h-1zM2 21h3v1h-3zM7 21h2v1h-2zM12 21h3v1h-3zM16 21h3v1h-3zM20 21h8v1h-8zM9 22h2v1h-2zM12 22h4v1h-4zM17 22h1v1h-1zM19 22h3v1h-3zM25 22h5v1h-5zM1 23h7v1h-7zM9 23h3v1h-3zM14 23h1v1h-1zM20 23h2v1h-2zM23 23h1v1h-1zM25 23h2v1h-2zM28 23h1v1h-1zM1 24h1v1h-1zM7 24h1v1h-1zM9 24h1v1h-1zM11 24h2v1h-2zM19 24h1v1h-1zM21 24h1v1h-1zM25 24h2v1h-2zM28 24h2v1h-2zM1 25h1v1h-1zM3 25h3v1h-3zM7 25h1v1h-1zM10 25h4v1h-4zM15 25h2v1h-2zM18 25h1v1h-1zM21 25h5v1h-5zM27 25h1v1h-1zM1 26h1v1h-1zM3 26h3v1h-3zM7 26h1v1h-1zM9 26h1v1h-1zM11 26h2v1h-2zM14 26h5v1h-5zM20 26h3v1h-3zM25 26h2v1h-2zM29 26h1v1h-1zM1 27h1v1h-1zM3 27h3v1h-3zM7 27h1v1h-1zM9 27h2v1h-2zM12 27h1v1h-1zM14 27h1v1h-1zM18 27h1v1h-1zM20 27h1v1h-1zM24 27h1v1h-1zM27 27h1v1h-1zM29 27h1v1h-1zM1 28h1v1h-1zM7 28h1v1h-1zM10 28h2v1h-2zM13 28h1v1h-1zM16 28h1v1h-1zM21 28h3v1h-3zM25 28h2v1h-2zM28 28h1v1h-1zM1 29h7v1h-7zM9 29h2v1h-2zM12 29h1v1h-1zM14 29h1v1h-1zM16 29h1v1h-1zM19 29h3v1h-3zM24 29h1v1h-1zM26 29h1v1h-1zM28 29h1v1h-1z\"/></svg>",
    "ymrs": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 31 31\" width=\"90\" height=\"90\" shape-rendering=\"crispEdges\"><rect width=\"31\" height=\"31\" fill=\"#fff\"/><path fill=\"#000\" d=\"M1 1h7v1h-7zM10 1h2v1h-2zM13 1h4v1h-4zM18 1h4v1h-4zM23 1h7v1h-7zM1 2h1v1h-1zM7 2h1v1h-1zM15 2h2v1h-2zM19 2h1v1h-1zM23 2h1v1h-1zM29 2h1v1h-1zM1 3h1v1h-1zM3 3h3v1h-3zM7 3h1v1h-1zM10 3h2v1h-2zM16 3h1v1h-1zM18 3h4v1h-4zM23 3h1v1h-1zM25 3h3v1h-3zM29 3h1v1h-1zM1 4h1v1h-1zM3 4h3v1h-3zM7 4h1v1h-1zM10 4h3v1h-3zM14 4h1v1h-1zM19 4h2v1h-2zM23 4h1v1h-1zM25 4h3v1h-3zM29 4h1v1h-1zM1 5h1v1h-1zM3 5h3v1h-3zM7 5h1v1h-1zM10 5h2v1h-2zM15 5h3v1h-3zM19 5h1v1h-1zM23 5h1v1h-1zM25 5h3v1h-3zM29 5h1v1h-1zM1 6h1v1h-1zM7 6h1v1h-1zM9 6h1v1h-1zM11 6h2v1h-2zM16 6h3v1h-3zM20 6h1v1h-1zM23 6h1v1h-1zM29 6h1v1h-1zM1 7h7v1h-7zM9 7h1v1h-1zM11 7h1v1h-1zM13 7h1v1h-1zM15 7h1v1h-1zM17 7h1v1h-1zM19 7h1v1h-1zM21 7h1v1h-1zM23 7h7v1h-7zM11 8h2v1h-2zM14 8h1v1h-1zM18 8h2v1h-2zM21 8h1v1h-1zM1 9h1v1h-1zM4 9h1v1h-1zM6 9h2v1h-2zM9 9h3v1h-3zM15 9h3v1h-3zM22 9h1v1h-1zM24 9h1v1h-1zM1 10h3v1h-3zM6 10h1v1h-1zM10 10h1v1h-1zM14 10h1v1h-1zM17 10h1v1h-1zM21 10h3v1h-3zM26 10h1v1h-1zM29 10h1v1h-1zM2 11h2v1h-2zM5 11h3v1h-3zM9 11h1v1h-1zM11 11h2v1h-2zM14 11h2v1h-2zM18 11h1v1h-1zM20 11h2v1h-2zM23 11h2v1h-2zM26 11h3v1h-3zM11 12h1v1h-1zM13 12h2v1h-2zM16 12h2v1h-2zM19 12h1v1h-1zM21 12h2v1h-2zM27 12h2v1h-2zM1 13h2v1h-2zM5 13h1v1h-1zM7 13h6v1h-6zM15 13h1v1h-1zM18 13h1v1h-1zM22 13h2v1h-2zM26 13h1v1h-1zM28 13h2v1h-2zM1 14h2v1h-2zM6 14h1v1h-1zM14 14h2v1h-2zM20 14h3v1h-3zM2 15h1v1h-1zM7 15h4v1h-4zM12 15h4v1h-4zM18 15h1v1h-1zM21 15h2v1h-2zM25 15h5v1h-5zM4 16h1v1h-1zM9 16h1v1h-1zM13 16h1v1h-1zM16 16h6v1h-6zM23 16h4v1h-4zM28 16h1v1h-1zM3 17h1v1h-1zM6 17h2v1h-2zM9 17h6v1h-6zM16 17h1v1h-1zM18 17h2v1h-2zM21 17h2v1h-2zM24 17h1v1h-1zM28 17h1v1h-1zM3 18h4v1h-4zM9 18h1v1h-1zM11 18h1v1h-1zM13 18h3v1h-3zM18 18h1v1h-1zM23 18h2v1h-2zM26 18h1v1h-1zM29 18h1v1h-1zM1 19h1v1h-1zM3 19h1v1h-1zM5 19h5v1h-5zM11 19h2v1h-2zM15 19h1v1h-1zM18 19h1v1h-1zM21 19h1v1h-1zM23 19h2v1h-2zM28 19h2v1h-2zM3 20h2v1h-2zM6 20h1v1h-1zM10 20h1v1h-1zM13 20h1v1h-1zM15 20h1v1h-1zM17 20h4v1h-4zM22 20h3v1h-3zM28 20h2v1h-2zM1 21h1v1h-1zM6 21h3v1h-3zM10 21h4v1h-4zM19 21h1v1h-1zM21 21h5v1h-5zM27 21h1v1h-1zM9 22h3v1h-3zM13 22h1v1h-1zM15 22h1v1h-1zM17 22h2v1h-2zM21 22h1v1h-1zM25 22h1v1h-1zM27 22h3v1h-3zM1 23h7v1h-7zM10 23h1v1h-1zM18 23h2v1h-2zM21 23h1v1h-1zM23 23h1v1h-1zM25 23h1v1h-1zM28 23h1v1h-1zM1 24h1v1h-1zM7 24h1v1h-1zM9 24h1v1h-1zM11 24h1v1h-1zM13 24h1v1h-1zM15 24h1v1h-1zM19 24h1v1h-1zM21 24h1v1h-1zM25 24h3v1h-3zM1 25h1v1h-1zM3 25h3v1h-3zM7 25h1v1h-1zM12 25h2v1h-2zM18 25h1v1h-1zM21 25h5v1h-5zM28 25h2v1h-2zM1 26h1v1h-1zM3 26h3v1h-3zM7 26h1v1h-1zM9 26h3v1h-3zM13 26h2v1h-2zM19 26h2v1h-2zM23 26h1v1h-1zM25 26h4v1h-4zM1 27h1v1h-1zM3 27h3v1h-3zM7 27h1v1h-1zM12 27h1v1h-1zM15 27h1v1h-1zM18 27h2v1h-2zM25 27h3v1h-3zM29 27h1v1h-1zM1 28h1v1h-1zM7 28h1v1h-1zM11 28h1v1h-1zM13 28h1v1h-1zM16 28h9v1h-9zM28 28h1v1h-1zM1 29h7v1h-7zM9 29h8v1h-8zM18 29h1v1h-1zM21 29h1v1h-1zM25 29h1v1h-1zM28 29h1v1h-1z\"/></svg>",
    "pcl5": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 31 31\" width=\"90\" height=\"90\" shape-rendering=\"crispEdges\"><rect width=\"31\" height=\"31\" fill=\"#fff\"/><path fill=\"#000\" d=\"M1 1h7v1h-7zM9 1h4v1h-4zM15 1h1v1h-1zM19 1h1v1h-1zM21 1h1v1h-1zM23 1h7v1h-7zM1 2h1v1h-1zM7 2h1v1h-1zM9 2h6v1h-6zM17 2h2v1h-2zM20 2h2v1h-2zM23 2h1v1h-1zM29 2h1v1h-1zM1 3h1v1h-1zM3 3h3v1h-3zM7 3h1v1h-1zM9 3h1v1h-1zM11 3h1v1h-1zM14 3h1v1h-1zM19 3h1v1h-1zM21 3h1v1h-1zM23 3h1v1h-1zM25 3h3v1h-3zM29 3h1v1h-1zM1 4h1v1h-1zM3 4h3v1h-3zM7 4h1v1h-1zM11 4h3v1h-3zM15 4h4v1h-4zM21 4h1v1h-1zM23 4h1v1h-1zM25 4h3v1h-3zM29 4h1v1h-1zM1 5h1v1h-1zM3 5h3v1h-3zM7 5h1v1h-1zM9 5h2v1h-2zM12 5h1v1h-1zM14 5h2v1h-2zM17 5h4v1h-4zM23 5h1v1h-1zM25 5h3v1h-3zM29 5h1v1h-1zM1 6h1v1h-1zM7 6h1v1h-1zM10 6h1v1h-1zM12 6h1v1h-1zM14 6h2v1h-2zM19 6h1v1h-1zM21 6h1v1h-1zM23 6h1v1h-1zM29 6h1v1h-1zM1 7h7v1h-7zM9 7h1v1h-1zM11 7h1v1h-1zM13 7h1v1h-1zM15 7h1v1h-1zM17 7h1v1h-1zM19 7h1v1h-1zM21 7h1v1h-1zM23 7h7v1h-7zM11 8h1v1h-1zM13 8h1v1h-1zM15 8h3v1h-3zM20 8h1v1h-1zM1 9h1v1h-1zM4 9h7v1h-7zM12 9h1v1h-1zM14 9h2v1h-2zM17 9h2v1h-2zM20 9h1v1h-1zM22 9h1v1h-1zM25 9h1v1h-1zM27 9h3v1h-3zM5 10h1v1h-1zM8 10h4v1h-4zM13 10h1v1h-1zM15 10h2v1h-2zM18 10h3v1h-3zM24 10h2v1h-2zM27 10h2v1h-2zM1 11h2v1h-2zM5 11h1v1h-1zM7 11h5v1h-5zM13 11h1v1h-1zM15 11h2v1h-2zM21 11h3v1h-3zM27 11h1v1h-1zM3 12h2v1h-2zM6 12h1v1h-1zM8 12h2v1h-2zM12 12h2v1h-2zM15 12h1v1h-1zM18 12h1v1h-1zM20 12h1v1h-1zM23 12h4v1h-4zM29 12h1v1h-1zM2 13h2v1h-2zM7 13h2v1h-2zM12 13h5v1h-5zM20 13h1v1h-1zM23 13h2v1h-2zM29 13h1v1h-1zM2 14h1v1h-1zM8 14h1v1h-1zM10 14h4v1h-4zM16 14h4v1h-4zM23 14h7v1h-7zM3 15h1v1h-1zM5 15h5v1h-5zM11 15h3v1h-3zM15 15h2v1h-2zM20 15h2v1h-2zM24 15h2v1h-2zM27 15h1v1h-1zM29 15h1v1h-1zM2 16h1v1h-1zM8 16h1v1h-1zM10 16h1v1h-1zM14 16h2v1h-2zM22 16h1v1h-1zM27 16h1v1h-1zM29 16h1v1h-1zM6 17h4v1h-4zM13 17h1v1h-1zM19 17h3v1h-3zM26 17h1v1h-1zM1 18h5v1h-5zM10 18h3v1h-3zM16 18h2v1h-2zM19 18h4v1h-4zM25 18h1v1h-1zM27 18h2v1h-2zM1 19h2v1h-2zM4 19h2v1h-2zM7 19h1v1h-1zM11 19h2v1h-2zM14 19h3v1h-3zM20 19h4v1h-4zM26 19h1v1h-1zM29 19h1v1h-1zM1 20h3v1h-3zM5 20h1v1h-1zM9 20h1v1h-1zM14 20h1v1h-1zM17 20h1v1h-1zM21 20h1v1h-1zM25 20h3v1h-3zM1 21h2v1h-2zM5 21h1v1h-1zM7 21h1v1h-1zM11 21h4v1h-4zM16 21h1v1h-1zM18 21h11v1h-11zM9 22h1v1h-1zM11 22h1v1h-1zM14 22h1v1h-1zM16 22h2v1h-2zM19 22h3v1h-3zM25 22h2v1h-2zM1 23h7v1h-7zM9 23h1v1h-1zM11 23h1v1h-1zM14 23h1v1h-1zM16 23h1v1h-1zM19 23h3v1h-3zM23 23h1v1h-1zM25 23h2v1h-2zM1 24h1v1h-1zM7 24h1v1h-1zM9 24h1v1h-1zM14 24h1v1h-1zM18 24h1v1h-1zM20 24h2v1h-2zM25 24h1v1h-1zM28 24h2v1h-2zM1 25h1v1h-1zM3 25h3v1h-3zM7 25h1v1h-1zM9 25h2v1h-2zM14 25h1v1h-1zM17 25h1v1h-1zM20 25h7v1h-7zM29 25h1v1h-1zM1 26h1v1h-1zM3 26h3v1h-3zM7 26h1v1h-1zM9 26h9v1h-9zM21 26h2v1h-2zM24 26h1v1h-1zM29 26h1v1h-1zM1 27h1v1h-1zM3 27h3v1h-3zM7 27h1v1h-1zM10 27h1v1h-1zM12 27h1v1h-1zM14 27h3v1h-3zM19 27h2v1h-2zM22 27h1v1h-1zM24 27h2v1h-2zM27 27h3v1h-3zM1 28h1v1h-1zM7 28h1v1h-1zM10 28h1v1h-1zM13 28h2v1h-2zM16 28h2v1h-2zM19 28h1v1h-1zM25 28h3v1h-3zM29 28h1v1h-1zM1 29h7v1h-7zM9 29h1v1h-1zM13 29h4v1h-4zM20 29h3v1h-3zM24 29h3v1h-3z\"/></svg>",
    "ybocs": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 31 31\" width=\"90\" height=\"90\" shape-rendering=\"crispEdges\"><rect width=\"31\" height=\"31\" fill=\"#fff\"/><path fill=\"#000\" d=\"M1 1h7v1h-7zM9 1h1v1h-1zM11 1h3v1h-3zM15 1h1v1h-1zM19 1h1v1h-1zM21 1h1v1h-1zM23 1h7v1h-7zM1 2h1v1h-1zM7 2h1v1h-1zM9 2h1v1h-1zM11 2h3v1h-3zM17 2h2v1h-2zM20 2h2v1h-2zM23 2h1v1h-1zM29 2h1v1h-1zM1 3h1v1h-1zM3 3h3v1h-3zM7 3h1v1h-1zM9 3h1v1h-1zM11 3h1v1h-1zM14 3h2v1h-2zM19 3h1v1h-1zM21 3h1v1h-1zM23 3h1v1h-1zM25 3h3v1h-3zM29 3h1v1h-1zM1 4h1v1h-1zM3 4h3v1h-3zM7 4h1v1h-1zM10 4h5v1h-5zM16 4h3v1h-3zM21 4h1v1h-1zM23 4h1v1h-1zM25 4h3v1h-3zM29 4h1v1h-1zM1 5h1v1h-1zM3 5h3v1h-3zM7 5h1v1h-1zM9 5h1v1h-1zM11 5h1v1h-1zM14 5h2v1h-2zM17 5h4v1h-4zM23 5h1v1h-1zM25 5h3v1h-3zM29 5h1v1h-1zM1 6h1v1h-1zM7 6h1v1h-1zM10 6h3v1h-3zM15 6h1v1h-1zM17 6h1v1h-1zM19 6h1v1h-1zM21 6h1v1h-1zM23 6h1v1h-1zM29 6h1v1h-1zM1 7h7v1h-7zM9 7h1v1h-1zM11 7h1v1h-1zM13 7h1v1h-1zM15 7h1v1h-1zM17 7h1v1h-1zM19 7h1v1h-1zM21 7h1v1h-1zM23 7h7v1h-7zM10 8h3v1h-3zM14 8h2v1h-2zM17 8h1v1h-1zM20 8h1v1h-1zM1 9h1v1h-1zM4 9h8v1h-8zM14 9h1v1h-1zM16 9h1v1h-1zM18 9h1v1h-1zM20 9h1v1h-1zM22 9h1v1h-1zM25 9h1v1h-1zM27 9h3v1h-3zM1 10h6v1h-6zM8 10h1v1h-1zM11 10h1v1h-1zM13 10h4v1h-4zM18 10h3v1h-3zM24 10h2v1h-2zM27 10h2v1h-2zM2 11h2v1h-2zM6 11h2v1h-2zM9 11h2v1h-2zM12 11h1v1h-1zM14 11h1v1h-1zM16 11h2v1h-2zM21 11h3v1h-3zM27 11h1v1h-1zM2 12h1v1h-1zM4 12h1v1h-1zM6 12h1v1h-1zM8 12h3v1h-3zM13 12h2v1h-2zM18 12h1v1h-1zM20 12h1v1h-1zM23 12h4v1h-4zM29 12h1v1h-1zM4 13h2v1h-2zM7 13h3v1h-3zM12 13h1v1h-1zM14 13h1v1h-1zM17 13h1v1h-1zM20 13h1v1h-1zM23 13h2v1h-2zM29 13h1v1h-1zM2 14h1v1h-1zM5 14h2v1h-2zM11 14h1v1h-1zM13 14h4v1h-4zM18 14h2v1h-2zM23 14h7v1h-7zM1 15h2v1h-2zM4 15h4v1h-4zM10 15h3v1h-3zM14 15h1v1h-1zM16 15h1v1h-1zM20 15h2v1h-2zM24 15h2v1h-2zM27 15h1v1h-1zM29 15h1v1h-1zM2 16h3v1h-3zM12 16h2v1h-2zM16 16h2v1h-2zM22 16h1v1h-1zM27 16h1v1h-1zM29 16h1v1h-1zM1 17h1v1h-1zM3 17h2v1h-2zM6 17h4v1h-4zM12 17h2v1h-2zM15 17h3v1h-3zM19 17h3v1h-3zM26 17h1v1h-1zM1 18h1v1h-1zM6 18h1v1h-1zM8 18h1v1h-1zM10 18h1v1h-1zM12 18h1v1h-1zM14 18h3v1h-3zM19 18h4v1h-4zM25 18h1v1h-1zM27 18h2v1h-2zM1 19h5v1h-5zM7 19h1v1h-1zM10 19h2v1h-2zM13 19h1v1h-1zM16 19h1v1h-1zM20 19h4v1h-4zM26 19h1v1h-1zM29 19h1v1h-1zM1 20h2v1h-2zM4 20h1v1h-1zM6 20h1v1h-1zM8 20h1v1h-1zM10 20h4v1h-4zM15 20h2v1h-2zM21 20h1v1h-1zM25 20h3v1h-3zM1 21h3v1h-3zM5 21h5v1h-5zM11 21h1v1h-1zM14 21h15v1h-15zM9 22h1v1h-1zM11 22h1v1h-1zM15 22h2v1h-2zM19 22h3v1h-3zM25 22h2v1h-2zM1 23h7v1h-7zM9 23h1v1h-1zM12 23h2v1h-2zM15 23h3v1h-3zM19 23h3v1h-3zM23 23h1v1h-1zM25 23h2v1h-2zM1 24h1v1h-1zM7 24h1v1h-1zM9 24h2v1h-2zM15 24h2v1h-2zM18 24h1v1h-1zM20 24h2v1h-2zM25 24h1v1h-1zM1 25h1v1h-1zM3 25h3v1h-3zM7 25h1v1h-1zM9 25h1v1h-1zM11 25h1v1h-1zM14 25h2v1h-2zM17 25h1v1h-1zM20 25h7v1h-7zM29 25h1v1h-1zM1 26h1v1h-1zM3 26h3v1h-3zM7 26h1v1h-1zM9 26h4v1h-4zM14 26h1v1h-1zM16 26h3v1h-3zM21 26h2v1h-2zM24 26h1v1h-1zM29 26h1v1h-1zM1 27h1v1h-1zM3 27h3v1h-3zM7 27h1v1h-1zM10 27h4v1h-4zM16 27h2v1h-2zM19 27h2v1h-2zM22 27h1v1h-1zM24 27h2v1h-2zM27 27h3v1h-3zM1 28h1v1h-1zM7 28h1v1h-1zM10 28h1v1h-1zM12 28h1v1h-1zM15 28h3v1h-3zM25 28h3v1h-3zM29 28h1v1h-1zM1 29h7v1h-7zM9 29h1v1h-1zM15 29h2v1h-2zM20 29h3v1h-3zM24 29h3v1h-3z\"/></svg>",
    "msibpd": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 31 31\" width=\"90\" height=\"90\" shape-rendering=\"crispEdges\"><rect width=\"31\" height=\"31\" fill=\"#fff\"/><path fill=\"#000\" d=\"M1 1h7v1h-7zM10 1h2v1h-2zM14 1h3v1h-3zM18 1h4v1h-4zM23 1h7v1h-7zM1 2h1v1h-1zM7 2h1v1h-1zM10 2h2v1h-2zM14 2h4v1h-4zM19 2h1v1h-1zM23 2h1v1h-1zM29 2h1v1h-1zM1 3h1v1h-1zM3 3h3v1h-3zM7 3h1v1h-1zM10 3h2v1h-2zM13 3h1v1h-1zM15 3h1v1h-1zM18 3h4v1h-4zM23 3h1v1h-1zM25 3h3v1h-3zM29 3h1v1h-1zM1 4h1v1h-1zM3 4h3v1h-3zM7 4h1v1h-1zM10 4h4v1h-4zM15 4h3v1h-3zM19 4h2v1h-2zM23 4h1v1h-1zM25 4h3v1h-3zM29 4h1v1h-1zM1 5h1v1h-1zM3 5h3v1h-3zM7 5h1v1h-1zM10 5h1v1h-1zM15 5h3v1h-3zM19 5h1v1h-1zM23 5h1v1h-1zM25 5h3v1h-3zM29 5h1v1h-1zM1 6h1v1h-1zM7 6h1v1h-1zM9 6h2v1h-2zM16 6h3v1h-3zM20 6h1v1h-1zM23 6h1v1h-1zM29 6h1v1h-1zM1 7h7v1h-7zM9 7h1v1h-1zM11 7h1v1h-1zM13 7h1v1h-1zM15 7h1v1h-1zM17 7h1v1h-1zM19 7h1v1h-1zM21 7h1v1h-1zM23 7h7v1h-7zM12 8h2v1h-2zM15 8h2v1h-2zM18 8h2v1h-2zM21 8h1v1h-1zM1 9h1v1h-1zM4 9h1v1h-1zM6 9h2v1h-2zM9 9h2v1h-2zM12 9h1v1h-1zM14 9h4v1h-4zM22 9h1v1h-1zM24 9h1v1h-1zM1 10h6v1h-6zM8 10h1v1h-1zM10 10h1v1h-1zM12 10h2v1h-2zM21 10h3v1h-3zM26 10h1v1h-1zM29 10h1v1h-1zM2 11h2v1h-2zM7 11h2v1h-2zM10 11h2v1h-2zM13 11h2v1h-2zM18 11h1v1h-1zM20 11h2v1h-2zM23 11h2v1h-2zM26 11h3v1h-3zM9 12h2v1h-2zM13 12h5v1h-5zM19 12h1v1h-1zM21 12h2v1h-2zM27 12h2v1h-2zM1 13h1v1h-1zM5 13h1v1h-1zM7 13h4v1h-4zM13 13h1v1h-1zM15 13h1v1h-1zM17 13h2v1h-2zM22 13h2v1h-2zM26 13h1v1h-1zM28 13h2v1h-2zM3 14h1v1h-1zM5 14h2v1h-2zM8 14h2v1h-2zM11 14h4v1h-4zM20 14h3v1h-3zM1 15h2v1h-2zM7 15h1v1h-1zM12 15h1v1h-1zM14 15h2v1h-2zM17 15h2v1h-2zM21 15h2v1h-2zM25 15h5v1h-5zM2 16h1v1h-1zM4 16h3v1h-3zM12 16h1v1h-1zM16 16h1v1h-1zM18 16h4v1h-4zM23 16h4v1h-4zM28 16h1v1h-1zM2 17h1v1h-1zM4 17h1v1h-1zM7 17h2v1h-2zM10 17h1v1h-1zM13 17h2v1h-2zM17 17h3v1h-3zM21 17h2v1h-2zM24 17h1v1h-1zM28 17h1v1h-1zM3 18h1v1h-1zM6 18h1v1h-1zM8 18h2v1h-2zM11 18h2v1h-2zM14 18h2v1h-2zM17 18h2v1h-2zM23 18h2v1h-2zM26 18h1v1h-1zM29 18h1v1h-1zM1 19h1v1h-1zM3 19h5v1h-5zM15 19h1v1h-1zM17 19h2v1h-2zM21 19h1v1h-1zM23 19h2v1h-2zM28 19h2v1h-2zM3 20h4v1h-4zM10 20h1v1h-1zM13 20h1v1h-1zM15 20h1v1h-1zM17 20h4v1h-4zM22 20h3v1h-3zM28 20h2v1h-2zM1 21h1v1h-1zM4 21h2v1h-2zM7 21h2v1h-2zM10 21h1v1h-1zM12 21h1v1h-1zM17 21h1v1h-1zM19 21h1v1h-1zM21 21h5v1h-5zM27 21h1v1h-1zM9 22h3v1h-3zM15 22h1v1h-1zM17 22h2v1h-2zM21 22h1v1h-1zM25 22h1v1h-1zM27 22h3v1h-3zM1 23h7v1h-7zM17 23h3v1h-3zM21 23h1v1h-1zM23 23h1v1h-1zM25 23h1v1h-1zM28 23h1v1h-1zM1 24h1v1h-1zM7 24h1v1h-1zM9 24h5v1h-5zM15 24h2v1h-2zM19 24h1v1h-1zM21 24h1v1h-1zM25 24h3v1h-3zM29 24h1v1h-1zM1 25h1v1h-1zM3 25h3v1h-3zM7 25h1v1h-1zM10 25h1v1h-1zM12 25h1v1h-1zM16 25h3v1h-3zM21 25h5v1h-5zM28 25h2v1h-2zM1 26h1v1h-1zM3 26h3v1h-3zM7 26h1v1h-1zM9 26h1v1h-1zM13 26h1v1h-1zM20 26h1v1h-1zM23 26h1v1h-1zM25 26h4v1h-4zM1 27h1v1h-1zM3 27h3v1h-3zM7 27h1v1h-1zM10 27h1v1h-1zM12 27h2v1h-2zM15 27h1v1h-1zM18 27h1v1h-1zM25 27h3v1h-3zM29 27h1v1h-1zM1 28h1v1h-1zM7 28h1v1h-1zM11 28h1v1h-1zM14 28h1v1h-1zM18 28h7v1h-7zM28 28h1v1h-1zM1 29h7v1h-7zM9 29h1v1h-1zM11 29h2v1h-2zM14 29h1v1h-1zM17 29h2v1h-2zM21 29h1v1h-1zM25 29h1v1h-1zM28 29h1v1h-1z\"/></svg>",
    "panss-6": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 31 31\" width=\"90\" height=\"90\" shape-rendering=\"crispEdges\"><rect width=\"31\" height=\"31\" fill=\"#fff\"/><path fill=\"#000\" d=\"M1 1h7v1h-7zM13 1h1v1h-1zM15 1h1v1h-1zM19 1h1v1h-1zM21 1h1v1h-1zM23 1h7v1h-7zM1 2h1v1h-1zM7 2h1v1h-1zM9 2h1v1h-1zM11 2h1v1h-1zM14 2h2v1h-2zM17 2h2v1h-2zM23 2h1v1h-1zM29 2h1v1h-1zM1 3h1v1h-1zM3 3h3v1h-3zM7 3h1v1h-1zM9 3h5v1h-5zM15 3h1v1h-1zM17 3h1v1h-1zM19 3h3v1h-3zM23 3h1v1h-1zM25 3h3v1h-3zM29 3h1v1h-1zM1 4h1v1h-1zM3 4h3v1h-3zM7 4h1v1h-1zM9 4h3v1h-3zM13 4h2v1h-2zM16 4h3v1h-3zM21 4h1v1h-1zM23 4h1v1h-1zM25 4h3v1h-3zM29 4h1v1h-1zM1 5h1v1h-1zM3 5h3v1h-3zM7 5h1v1h-1zM10 5h1v1h-1zM12 5h3v1h-3zM17 5h1v1h-1zM19 5h3v1h-3zM23 5h1v1h-1zM25 5h3v1h-3zM29 5h1v1h-1zM1 6h1v1h-1zM7 6h1v1h-1zM11 6h3v1h-3zM15 6h1v1h-1zM18 6h2v1h-2zM21 6h1v1h-1zM23 6h1v1h-1zM29 6h1v1h-1zM1 7h7v1h-7zM9 7h1v1h-1zM11 7h1v1h-1zM13 7h1v1h-1zM15 7h1v1h-1zM17 7h1v1h-1zM19 7h1v1h-1zM21 7h1v1h-1zM23 7h7v1h-7zM9 8h2v1h-2zM12 8h2v1h-2zM17 8h1v1h-1zM21 8h1v1h-1zM1 9h1v1h-1zM7 9h1v1h-1zM9 9h3v1h-3zM13 9h1v1h-1zM16 9h3v1h-3zM22 9h2v1h-2zM26 9h3v1h-3zM1 10h1v1h-1zM3 10h1v1h-1zM5 10h1v1h-1zM8 10h1v1h-1zM13 10h4v1h-4zM18 10h3v1h-3zM24 10h2v1h-2zM27 10h2v1h-2zM3 11h1v1h-1zM5 11h4v1h-4zM10 11h3v1h-3zM14 11h5v1h-5zM22 11h3v1h-3zM3 12h1v1h-1zM5 12h1v1h-1zM9 12h2v1h-2zM14 12h1v1h-1zM17 12h1v1h-1zM20 12h1v1h-1zM25 12h2v1h-2zM1 13h2v1h-2zM7 13h1v1h-1zM10 13h2v1h-2zM14 13h1v1h-1zM17 13h1v1h-1zM20 13h1v1h-1zM23 13h2v1h-2zM29 13h1v1h-1zM3 14h1v1h-1zM10 14h4v1h-4zM16 14h1v1h-1zM18 14h4v1h-4zM23 14h3v1h-3zM28 14h2v1h-2zM1 15h7v1h-7zM9 15h1v1h-1zM11 15h3v1h-3zM16 15h2v1h-2zM21 15h1v1h-1zM23 15h5v1h-5zM6 16h1v1h-1zM8 16h4v1h-4zM13 16h1v1h-1zM16 16h2v1h-2zM22 16h1v1h-1zM27 16h1v1h-1zM29 16h1v1h-1zM1 17h1v1h-1zM3 17h2v1h-2zM6 17h4v1h-4zM11 17h1v1h-1zM13 17h1v1h-1zM16 17h5v1h-5zM24 17h1v1h-1zM26 17h2v1h-2zM1 18h1v1h-1zM3 18h1v1h-1zM9 18h3v1h-3zM13 18h13v1h-13zM27 18h3v1h-3zM1 19h3v1h-3zM5 19h1v1h-1zM7 19h2v1h-2zM10 19h1v1h-1zM12 19h1v1h-1zM16 19h1v1h-1zM20 19h4v1h-4zM26 19h1v1h-1zM29 19h1v1h-1zM1 20h1v1h-1zM3 20h1v1h-1zM5 20h1v1h-1zM8 20h3v1h-3zM14 20h1v1h-1zM16 20h1v1h-1zM20 20h1v1h-1zM25 20h1v1h-1zM1 21h1v1h-1zM4 21h2v1h-2zM7 21h1v1h-1zM10 21h3v1h-3zM15 21h5v1h-5zM21 21h5v1h-5zM27 21h3v1h-3zM9 22h2v1h-2zM12 22h1v1h-1zM15 22h2v1h-2zM19 22h3v1h-3zM25 22h2v1h-2zM1 23h7v1h-7zM16 23h1v1h-1zM18 23h4v1h-4zM23 23h1v1h-1zM25 23h3v1h-3zM1 24h1v1h-1zM7 24h1v1h-1zM10 24h2v1h-2zM15 24h3v1h-3zM20 24h2v1h-2zM25 24h1v1h-1zM29 24h1v1h-1zM1 25h1v1h-1zM3 25h3v1h-3zM7 25h1v1h-1zM11 25h5v1h-5zM17 25h1v1h-1zM20 25h7v1h-7zM29 25h1v1h-1zM1 26h1v1h-1zM3 26h3v1h-3zM7 26h1v1h-1zM10 26h4v1h-4zM15 26h3v1h-3zM20 26h1v1h-1zM22 26h1v1h-1zM24 26h1v1h-1zM26 26h2v1h-2zM29 26h1v1h-1zM1 27h1v1h-1zM3 27h3v1h-3zM7 27h1v1h-1zM11 27h2v1h-2zM16 27h2v1h-2zM19 27h1v1h-1zM22 27h7v1h-7zM1 28h1v1h-1zM7 28h1v1h-1zM11 28h1v1h-1zM14 28h1v1h-1zM17 28h1v1h-1zM19 28h1v1h-1zM25 28h3v1h-3zM29 28h1v1h-1zM1 29h7v1h-7zM9 29h1v1h-1zM11 29h1v1h-1zM13 29h2v1h-2zM16 29h1v1h-1zM18 29h1v1h-1zM20 29h1v1h-1zM22 29h1v1h-1zM25 29h3v1h-3z\"/></svg>",
    "panss-30": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 31 31\" width=\"90\" height=\"90\" shape-rendering=\"crispEdges\"><rect width=\"31\" height=\"31\" fill=\"#fff\"/><path fill=\"#000\" d=\"M1 1h7v1h-7zM13 1h1v1h-1zM15 1h1v1h-1zM19 1h1v1h-1zM21 1h1v1h-1zM23 1h7v1h-7zM1 2h1v1h-1zM7 2h1v1h-1zM9 2h1v1h-1zM11 2h1v1h-1zM14 2h2v1h-2zM17 2h2v1h-2zM23 2h1v1h-1zM29 2h1v1h-1zM1 3h1v1h-1zM3 3h3v1h-3zM7 3h1v1h-1zM9 3h5v1h-5zM15 3h1v1h-1zM17 3h1v1h-1zM19 3h3v1h-3zM23 3h1v1h-1zM25 3h3v1h-3zM29 3h1v1h-1zM1 4h1v1h-1zM3 4h3v1h-3zM7 4h1v1h-1zM9 4h3v1h-3zM13 4h2v1h-2zM16 4h3v1h-3zM21 4h1v1h-1zM23 4h1v1h-1zM25 4h3v1h-3zM29 4h1v1h-1zM1 5h1v1h-1zM3 5h3v1h-3zM7 5h1v1h-1zM10 5h1v1h-1zM12 5h3v1h-3zM17 5h1v1h-1zM19 5h3v1h-3zM23 5h1v1h-1zM25 5h3v1h-3zM29 5h1v1h-1zM1 6h1v1h-1zM7 6h1v1h-1zM11 6h3v1h-3zM15 6h1v1h-1zM18 6h2v1h-2zM21 6h1v1h-1zM23 6h1v1h-1zM29 6h1v1h-1zM1 7h7v1h-7zM9 7h1v1h-1zM11 7h1v1h-1zM13 7h1v1h-1zM15 7h1v1h-1zM17 7h1v1h-1zM19 7h1v1h-1zM21 7h1v1h-1zM23 7h7v1h-7zM9 8h2v1h-2zM12 8h2v1h-2zM17 8h1v1h-1zM21 8h1v1h-1zM1 9h1v1h-1zM7 9h1v1h-1zM9 9h3v1h-3zM13 9h1v1h-1zM16 9h3v1h-3zM22 9h2v1h-2zM26 9h3v1h-3zM1 10h1v1h-1zM3 10h1v1h-1zM5 10h1v1h-1zM8 10h1v1h-1zM13 10h4v1h-4zM18 10h3v1h-3zM24 10h2v1h-2zM27 10h2v1h-2zM3 11h1v1h-1zM5 11h4v1h-4zM10 11h3v1h-3zM14 11h5v1h-5zM22 11h3v1h-3zM3 12h1v1h-1zM5 12h1v1h-1zM9 12h2v1h-2zM14 12h1v1h-1zM17 12h1v1h-1zM20 12h1v1h-1zM25 12h2v1h-2zM1 13h2v1h-2zM7 13h1v1h-1zM10 13h2v1h-2zM14 13h1v1h-1zM17 13h1v1h-1zM20 13h1v1h-1zM23 13h2v1h-2zM29 13h1v1h-1zM3 14h1v1h-1zM10 14h4v1h-4zM16 14h1v1h-1zM18 14h4v1h-4zM23 14h3v1h-3zM28 14h2v1h-2zM1 15h7v1h-7zM9 15h1v1h-1zM11 15h3v1h-3zM16 15h2v1h-2zM21 15h1v1h-1zM23 15h5v1h-5zM6 16h1v1h-1zM8 16h4v1h-4zM13 16h1v1h-1zM16 16h2v1h-2zM22 16h1v1h-1zM27 16h1v1h-1zM29 16h1v1h-1zM1 17h1v1h-1zM3 17h2v1h-2zM6 17h4v1h-4zM11 17h1v1h-1zM13 17h1v1h-1zM16 17h5v1h-5zM24 17h1v1h-1zM26 17h2v1h-2zM1 18h1v1h-1zM3 18h1v1h-1zM9 18h3v1h-3zM13 18h13v1h-13zM27 18h3v1h-3zM1 19h3v1h-3zM5 19h1v1h-1zM7 19h2v1h-2zM10 19h1v1h-1zM12 19h1v1h-1zM16 19h1v1h-1zM20 19h4v1h-4zM26 19h1v1h-1zM29 19h1v1h-1zM1 20h1v1h-1zM3 20h1v1h-1zM5 20h1v1h-1zM8 20h3v1h-3zM14 20h1v1h-1zM16 20h1v1h-1zM20 20h1v1h-1zM25 20h1v1h-1zM1 21h1v1h-1zM4 21h2v1h-2zM7 21h1v1h-1zM10 21h3v1h-3zM15 21h5v1h-5zM21 21h5v1h-5zM27 21h3v1h-3zM9 22h2v1h-2zM12 22h1v1h-1zM15 22h2v1h-2zM19 22h3v1h-3zM25 22h2v1h-2zM1 23h7v1h-7zM16 23h1v1h-1zM18 23h4v1h-4zM23 23h1v1h-1zM25 23h3v1h-3zM1 24h1v1h-1zM7 24h1v1h-1zM10 24h2v1h-2zM15 24h3v1h-3zM20 24h2v1h-2zM25 24h1v1h-1zM29 24h1v1h-1zM1 25h1v1h-1zM3 25h3v1h-3zM7 25h1v1h-1zM11 25h5v1h-5zM17 25h1v1h-1zM20 25h7v1h-7zM29 25h1v1h-1zM1 26h1v1h-1zM3 26h3v1h-3zM7 26h1v1h-1zM10 26h4v1h-4zM15 26h3v1h-3zM20 26h1v1h-1zM22 26h1v1h-1zM24 26h1v1h-1zM26 26h2v1h-2zM29 26h1v1h-1zM1 27h1v1h-1zM3 27h3v1h-3zM7 27h1v1h-1zM11 27h2v1h-2zM16 27h2v1h-2zM19 27h1v1h-1zM22 27h7v1h-7zM1 28h1v1h-1zM7 28h1v1h-1zM11 28h1v1h-1zM14 28h1v1h-1zM17 28h1v1h-1zM19 28h1v1h-1zM25 28h3v1h-3zM29 28h1v1h-1zM1 29h7v1h-7zM9 29h1v1h-1zM11 29h1v1h-1zM13 29h2v1h-2zM16 29h1v1h-1zM18 29h1v1h-1zM20 29h1v1h-1zM22 29h1v1h-1zM25 29h3v1h-3z\"/></svg>",
    "bfcrs": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 31 31\" width=\"90\" height=\"90\" shape-rendering=\"crispEdges\"><rect width=\"31\" height=\"31\" fill=\"#fff\"/><path fill=\"#000\" d=\"M1 1h7v1h-7zM14 1h3v1h-3zM18 1h4v1h-4zM23 1h7v1h-7zM1 2h1v1h-1zM7 2h1v1h-1zM9 2h2v1h-2zM12 2h2v1h-2zM15 2h3v1h-3zM19 2h2v1h-2zM23 2h1v1h-1zM29 2h1v1h-1zM1 3h1v1h-1zM3 3h3v1h-3zM7 3h1v1h-1zM11 3h1v1h-1zM13 3h1v1h-1zM16 3h1v1h-1zM19 3h2v1h-2zM23 3h1v1h-1zM25 3h3v1h-3zM29 3h1v1h-1zM1 4h1v1h-1zM3 4h3v1h-3zM7 4h1v1h-1zM10 4h2v1h-2zM13 4h1v1h-1zM15 4h1v1h-1zM19 4h2v1h-2zM23 4h1v1h-1zM25 4h3v1h-3zM29 4h1v1h-1zM1 5h1v1h-1zM3 5h3v1h-3zM7 5h1v1h-1zM9 5h1v1h-1zM11 5h1v1h-1zM13 5h4v1h-4zM19 5h2v1h-2zM23 5h1v1h-1zM25 5h3v1h-3zM29 5h1v1h-1zM1 6h1v1h-1zM7 6h1v1h-1zM12 6h1v1h-1zM14 6h3v1h-3zM20 6h2v1h-2zM23 6h1v1h-1zM29 6h1v1h-1zM1 7h7v1h-7zM9 7h1v1h-1zM11 7h1v1h-1zM13 7h1v1h-1zM15 7h1v1h-1zM17 7h1v1h-1zM19 7h1v1h-1zM21 7h1v1h-1zM23 7h7v1h-7zM12 8h3v1h-3zM16 8h6v1h-6zM1 9h1v1h-1zM3 9h1v1h-1zM5 9h1v1h-1zM7 9h1v1h-1zM10 9h3v1h-3zM15 9h1v1h-1zM18 9h1v1h-1zM21 9h1v1h-1zM25 9h1v1h-1zM28 9h1v1h-1zM1 10h2v1h-2zM8 10h1v1h-1zM10 10h4v1h-4zM17 10h1v1h-1zM21 10h3v1h-3zM26 10h1v1h-1zM29 10h1v1h-1zM2 11h2v1h-2zM6 11h2v1h-2zM9 11h2v1h-2zM12 11h3v1h-3zM18 11h1v1h-1zM21 11h1v1h-1zM24 11h1v1h-1zM27 11h3v1h-3zM1 12h5v1h-5zM9 12h1v1h-1zM11 12h2v1h-2zM16 12h4v1h-4zM22 12h1v1h-1zM24 12h1v1h-1zM28 12h1v1h-1zM1 13h1v1h-1zM4 13h1v1h-1zM7 13h4v1h-4zM12 13h2v1h-2zM16 13h3v1h-3zM22 13h2v1h-2zM26 13h1v1h-1zM28 13h2v1h-2zM1 14h3v1h-3zM8 14h1v1h-1zM10 14h2v1h-2zM13 14h2v1h-2zM21 14h3v1h-3zM26 14h1v1h-1zM29 14h1v1h-1zM1 15h4v1h-4zM7 15h1v1h-1zM10 15h2v1h-2zM13 15h1v1h-1zM15 15h1v1h-1zM22 15h1v1h-1zM24 15h3v1h-3zM28 15h2v1h-2zM6 16h1v1h-1zM9 16h2v1h-2zM13 16h3v1h-3zM18 16h4v1h-4zM23 16h4v1h-4zM28 16h1v1h-1zM1 17h1v1h-1zM3 17h2v1h-2zM7 17h1v1h-1zM9 17h2v1h-2zM13 17h1v1h-1zM15 17h1v1h-1zM18 17h7v1h-7zM26 17h1v1h-1zM28 17h2v1h-2zM3 18h2v1h-2zM6 18h1v1h-1zM9 18h2v1h-2zM13 18h1v1h-1zM15 18h1v1h-1zM17 18h1v1h-1zM21 18h1v1h-1zM23 18h1v1h-1zM26 18h2v1h-2zM29 18h1v1h-1zM1 19h1v1h-1zM3 19h3v1h-3zM7 19h1v1h-1zM9 19h1v1h-1zM11 19h2v1h-2zM14 19h1v1h-1zM17 19h2v1h-2zM21 19h1v1h-1zM23 19h2v1h-2zM28 19h2v1h-2zM2 20h2v1h-2zM5 20h2v1h-2zM8 20h2v1h-2zM13 20h1v1h-1zM18 20h2v1h-2zM22 20h1v1h-1zM24 20h1v1h-1zM26 20h1v1h-1zM28 20h1v1h-1zM1 21h1v1h-1zM3 21h1v1h-1zM7 21h1v1h-1zM18 21h2v1h-2zM21 21h5v1h-5zM9 22h1v1h-1zM11 22h1v1h-1zM13 22h2v1h-2zM17 22h2v1h-2zM21 22h1v1h-1zM25 22h1v1h-1zM27 22h3v1h-3zM1 23h7v1h-7zM10 23h2v1h-2zM15 23h1v1h-1zM18 23h4v1h-4zM23 23h1v1h-1zM25 23h2v1h-2zM28 23h2v1h-2zM1 24h1v1h-1zM7 24h1v1h-1zM10 24h2v1h-2zM14 24h2v1h-2zM18 24h2v1h-2zM21 24h1v1h-1zM25 24h2v1h-2zM28 24h2v1h-2zM1 25h1v1h-1zM3 25h3v1h-3zM7 25h1v1h-1zM9 25h1v1h-1zM13 25h1v1h-1zM15 25h1v1h-1zM17 25h2v1h-2zM21 25h5v1h-5zM28 25h2v1h-2zM1 26h1v1h-1zM3 26h3v1h-3zM7 26h1v1h-1zM11 26h5v1h-5zM17 26h2v1h-2zM25 26h1v1h-1zM27 26h3v1h-3zM1 27h1v1h-1zM3 27h3v1h-3zM7 27h1v1h-1zM9 27h3v1h-3zM15 27h1v1h-1zM17 27h3v1h-3zM21 27h1v1h-1zM24 27h3v1h-3zM29 27h1v1h-1zM1 28h1v1h-1zM7 28h1v1h-1zM10 28h3v1h-3zM14 28h1v1h-1zM17 28h2v1h-2zM20 28h5v1h-5zM28 28h1v1h-1zM1 29h7v1h-7zM9 29h3v1h-3zM13 29h1v1h-1zM17 29h2v1h-2zM20 29h2v1h-2zM23 29h1v1h-1zM25 29h2v1h-2zM28 29h2v1h-2z\"/></svg>",
    "aims": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 31 31\" width=\"90\" height=\"90\" shape-rendering=\"crispEdges\"><rect width=\"31\" height=\"31\" fill=\"#fff\"/><path fill=\"#000\" d=\"M1 1h7v1h-7zM11 1h1v1h-1zM14 1h3v1h-3zM18 1h4v1h-4zM23 1h7v1h-7zM1 2h1v1h-1zM7 2h1v1h-1zM11 2h1v1h-1zM15 2h2v1h-2zM19 2h1v1h-1zM23 2h1v1h-1zM29 2h1v1h-1zM1 3h1v1h-1zM3 3h3v1h-3zM7 3h1v1h-1zM10 3h1v1h-1zM12 3h2v1h-2zM16 3h1v1h-1zM18 3h4v1h-4zM23 3h1v1h-1zM25 3h3v1h-3zM29 3h1v1h-1zM1 4h1v1h-1zM3 4h3v1h-3zM7 4h1v1h-1zM10 4h1v1h-1zM12 4h1v1h-1zM14 4h1v1h-1zM19 4h2v1h-2zM23 4h1v1h-1zM25 4h3v1h-3zM29 4h1v1h-1zM1 5h1v1h-1zM3 5h3v1h-3zM7 5h1v1h-1zM11 5h2v1h-2zM15 5h3v1h-3zM19 5h1v1h-1zM23 5h1v1h-1zM25 5h3v1h-3zM29 5h1v1h-1zM1 6h1v1h-1zM7 6h1v1h-1zM9 6h1v1h-1zM16 6h3v1h-3zM20 6h1v1h-1zM23 6h1v1h-1zM29 6h1v1h-1zM1 7h7v1h-7zM9 7h1v1h-1zM11 7h1v1h-1zM13 7h1v1h-1zM15 7h1v1h-1zM17 7h1v1h-1zM19 7h1v1h-1zM21 7h1v1h-1zM23 7h7v1h-7zM10 8h2v1h-2zM13 8h2v1h-2zM18 8h2v1h-2zM21 8h1v1h-1zM1 9h1v1h-1zM4 9h1v1h-1zM6 9h2v1h-2zM9 9h2v1h-2zM12 9h1v1h-1zM15 9h3v1h-3zM22 9h1v1h-1zM24 9h1v1h-1zM2 10h4v1h-4zM8 10h1v1h-1zM10 10h2v1h-2zM13 10h2v1h-2zM17 10h1v1h-1zM21 10h3v1h-3zM26 10h1v1h-1zM29 10h1v1h-1zM1 11h1v1h-1zM5 11h1v1h-1zM7 11h5v1h-5zM13 11h3v1h-3zM18 11h1v1h-1zM20 11h2v1h-2zM23 11h2v1h-2zM26 11h3v1h-3zM10 12h2v1h-2zM14 12h1v1h-1zM16 12h2v1h-2zM19 12h1v1h-1zM21 12h2v1h-2zM27 12h2v1h-2zM4 13h2v1h-2zM7 13h2v1h-2zM10 13h1v1h-1zM12 13h1v1h-1zM15 13h1v1h-1zM18 13h1v1h-1zM22 13h2v1h-2zM26 13h1v1h-1zM28 13h2v1h-2zM2 14h2v1h-2zM6 14h1v1h-1zM9 14h1v1h-1zM11 14h1v1h-1zM13 14h3v1h-3zM20 14h3v1h-3zM2 15h1v1h-1zM5 15h3v1h-3zM9 15h1v1h-1zM11 15h5v1h-5zM18 15h1v1h-1zM21 15h2v1h-2zM25 15h5v1h-5zM1 16h2v1h-2zM8 16h1v1h-1zM10 16h1v1h-1zM16 16h6v1h-6zM23 16h4v1h-4zM28 16h1v1h-1zM1 17h1v1h-1zM4 17h2v1h-2zM7 17h2v1h-2zM10 17h1v1h-1zM12 17h1v1h-1zM14 17h1v1h-1zM16 17h1v1h-1zM18 17h2v1h-2zM21 17h2v1h-2zM24 17h1v1h-1zM28 17h1v1h-1zM2 18h2v1h-2zM8 18h2v1h-2zM13 18h3v1h-3zM18 18h1v1h-1zM23 18h2v1h-2zM26 18h1v1h-1zM29 18h1v1h-1zM1 19h1v1h-1zM7 19h2v1h-2zM11 19h3v1h-3zM15 19h1v1h-1zM18 19h1v1h-1zM21 19h1v1h-1zM23 19h2v1h-2zM28 19h2v1h-2zM3 20h1v1h-1zM5 20h2v1h-2zM8 20h3v1h-3zM15 20h1v1h-1zM17 20h4v1h-4zM22 20h3v1h-3zM28 20h2v1h-2zM1 21h1v1h-1zM4 21h1v1h-1zM6 21h2v1h-2zM9 21h1v1h-1zM11 21h1v1h-1zM19 21h1v1h-1zM21 21h5v1h-5zM27 21h1v1h-1zM9 22h1v1h-1zM13 22h1v1h-1zM15 22h1v1h-1zM17 22h2v1h-2zM21 22h1v1h-1zM25 22h1v1h-1zM27 22h3v1h-3zM1 23h7v1h-7zM11 23h3v1h-3zM17 23h3v1h-3zM21 23h1v1h-1zM23 23h1v1h-1zM25 23h1v1h-1zM28 23h1v1h-1zM1 24h1v1h-1zM7 24h1v1h-1zM9 24h1v1h-1zM11 24h1v1h-1zM15 24h3v1h-3zM19 24h1v1h-1zM21 24h1v1h-1zM25 24h3v1h-3zM1 25h1v1h-1zM3 25h3v1h-3zM7 25h1v1h-1zM10 25h4v1h-4zM16 25h3v1h-3zM21 25h5v1h-5zM28 25h2v1h-2zM1 26h1v1h-1zM3 26h3v1h-3zM7 26h1v1h-1zM9 26h1v1h-1zM11 26h2v1h-2zM18 26h1v1h-1zM20 26h1v1h-1zM23 26h1v1h-1zM25 26h4v1h-4zM1 27h1v1h-1zM3 27h3v1h-3zM7 27h1v1h-1zM12 27h1v1h-1zM14 27h2v1h-2zM18 27h2v1h-2zM25 27h3v1h-3zM29 27h1v1h-1zM1 28h1v1h-1zM7 28h1v1h-1zM11 28h1v1h-1zM13 28h1v1h-1zM15 28h2v1h-2zM18 28h7v1h-7zM28 28h1v1h-1zM1 29h7v1h-7zM9 29h1v1h-1zM11 29h2v1h-2zM15 29h2v1h-2zM18 29h1v1h-1zM21 29h1v1h-1zM25 29h1v1h-1zM28 29h1v1h-1z\"/></svg>",
    "ess": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 31 31\" width=\"90\" height=\"90\" shape-rendering=\"crispEdges\"><rect width=\"31\" height=\"31\" fill=\"#fff\"/><path fill=\"#000\" d=\"M1 1h7v1h-7zM9 1h6v1h-6zM16 1h1v1h-1zM18 1h3v1h-3zM23 1h7v1h-7zM1 2h1v1h-1zM7 2h1v1h-1zM9 2h1v1h-1zM11 2h1v1h-1zM13 2h2v1h-2zM19 2h1v1h-1zM21 2h1v1h-1zM23 2h1v1h-1zM29 2h1v1h-1zM1 3h1v1h-1zM3 3h3v1h-3zM7 3h1v1h-1zM10 3h4v1h-4zM21 3h1v1h-1zM23 3h1v1h-1zM25 3h3v1h-3zM29 3h1v1h-1zM1 4h1v1h-1zM3 4h3v1h-3zM7 4h1v1h-1zM9 4h1v1h-1zM11 4h2v1h-2zM15 4h1v1h-1zM18 4h1v1h-1zM23 4h1v1h-1zM25 4h3v1h-3zM29 4h1v1h-1zM1 5h1v1h-1zM3 5h3v1h-3zM7 5h1v1h-1zM12 5h1v1h-1zM15 5h4v1h-4zM20 5h1v1h-1zM23 5h1v1h-1zM25 5h3v1h-3zM29 5h1v1h-1zM1 6h1v1h-1zM7 6h1v1h-1zM13 6h2v1h-2zM18 6h1v1h-1zM20 6h2v1h-2zM23 6h1v1h-1zM29 6h1v1h-1zM1 7h7v1h-7zM9 7h1v1h-1zM11 7h1v1h-1zM13 7h1v1h-1zM15 7h1v1h-1zM17 7h1v1h-1zM19 7h1v1h-1zM21 7h1v1h-1zM23 7h7v1h-7zM9 8h2v1h-2zM16 8h4v1h-4zM1 9h1v1h-1zM3 9h2v1h-2zM6 9h3v1h-3zM10 9h3v1h-3zM14 9h1v1h-1zM16 9h5v1h-5zM23 9h1v1h-1zM26 9h1v1h-1zM28 9h2v1h-2zM2 10h2v1h-2zM6 10h1v1h-1zM11 10h5v1h-5zM17 10h9v1h-9zM29 10h1v1h-1zM7 11h1v1h-1zM10 11h5v1h-5zM17 11h1v1h-1zM19 11h1v1h-1zM21 11h1v1h-1zM23 11h1v1h-1zM25 11h1v1h-1zM27 11h2v1h-2zM4 12h3v1h-3zM8 12h1v1h-1zM11 12h1v1h-1zM16 12h1v1h-1zM19 12h1v1h-1zM23 12h1v1h-1zM29 12h1v1h-1zM1 13h2v1h-2zM4 13h1v1h-1zM6 13h3v1h-3zM13 13h1v1h-1zM15 13h1v1h-1zM18 13h1v1h-1zM21 13h1v1h-1zM26 13h2v1h-2zM1 14h1v1h-1zM3 14h2v1h-2zM6 14h1v1h-1zM8 14h1v1h-1zM11 14h2v1h-2zM15 14h3v1h-3zM20 14h1v1h-1zM23 14h1v1h-1zM27 14h3v1h-3zM2 15h1v1h-1zM4 15h1v1h-1zM7 15h1v1h-1zM12 15h3v1h-3zM17 15h1v1h-1zM19 15h4v1h-4zM24 15h1v1h-1zM27 15h3v1h-3zM1 16h1v1h-1zM12 16h2v1h-2zM15 16h3v1h-3zM21 16h1v1h-1zM23 16h1v1h-1zM28 16h1v1h-1zM1 17h1v1h-1zM7 17h6v1h-6zM15 17h1v1h-1zM17 17h1v1h-1zM20 17h3v1h-3zM25 17h2v1h-2zM28 17h1v1h-1zM2 18h1v1h-1zM4 18h3v1h-3zM9 18h1v1h-1zM11 18h2v1h-2zM15 18h2v1h-2zM18 18h1v1h-1zM21 18h2v1h-2zM24 18h1v1h-1zM26 18h3v1h-3zM1 19h1v1h-1zM3 19h2v1h-2zM6 19h2v1h-2zM9 19h1v1h-1zM11 19h1v1h-1zM14 19h5v1h-5zM22 19h1v1h-1zM24 19h1v1h-1zM27 19h1v1h-1zM4 20h1v1h-1zM6 20h1v1h-1zM11 20h2v1h-2zM14 20h2v1h-2zM17 20h5v1h-5zM24 20h1v1h-1zM27 20h1v1h-1zM2 21h2v1h-2zM5 21h3v1h-3zM9 21h1v1h-1zM11 21h1v1h-1zM13 21h6v1h-6zM20 21h8v1h-8zM9 22h2v1h-2zM13 22h1v1h-1zM19 22h3v1h-3zM25 22h5v1h-5zM1 23h7v1h-7zM9 23h1v1h-1zM12 23h2v1h-2zM15 23h1v1h-1zM17 23h1v1h-1zM20 23h2v1h-2zM23 23h1v1h-1zM25 23h2v1h-2zM28 23h1v1h-1zM1 24h1v1h-1zM7 24h1v1h-1zM9 24h4v1h-4zM14 24h4v1h-4zM19 24h1v1h-1zM21 24h1v1h-1zM25 24h2v1h-2zM29 24h1v1h-1zM1 25h1v1h-1zM3 25h3v1h-3zM7 25h1v1h-1zM11 25h2v1h-2zM16 25h3v1h-3zM21 25h5v1h-5zM27 25h1v1h-1zM1 26h1v1h-1zM3 26h3v1h-3zM7 26h1v1h-1zM9 26h1v1h-1zM12 26h1v1h-1zM14 26h1v1h-1zM16 26h3v1h-3zM20 26h3v1h-3zM25 26h2v1h-2zM29 26h1v1h-1zM1 27h1v1h-1zM3 27h3v1h-3zM7 27h1v1h-1zM9 27h1v1h-1zM12 27h4v1h-4zM19 27h2v1h-2zM24 27h1v1h-1zM27 27h1v1h-1zM29 27h1v1h-1zM1 28h1v1h-1zM7 28h1v1h-1zM10 28h2v1h-2zM14 28h1v1h-1zM21 28h3v1h-3zM25 28h2v1h-2zM28 28h1v1h-1zM1 29h7v1h-7zM9 29h5v1h-5zM17 29h1v1h-1zM19 29h3v1h-3zM24 29h1v1h-1zM26 29h1v1h-1zM28 29h1v1h-1z\"/></svg>",
    "suicide-risk": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 35 35\" width=\"90\" height=\"90\" shape-rendering=\"crispEdges\"><rect width=\"35\" height=\"35\" fill=\"#fff\"/><path fill=\"#000\" d=\"M1 1h7v1h-7zM9 1h1v1h-1zM11 1h1v1h-1zM14 1h2v1h-2zM17 1h5v1h-5zM24 1h1v1h-1zM27 1h7v1h-7zM1 2h1v1h-1zM7 2h1v1h-1zM9 2h3v1h-3zM13 2h2v1h-2zM17 2h1v1h-1zM19 2h1v1h-1zM23 2h2v1h-2zM27 2h1v1h-1zM33 2h1v1h-1zM1 3h1v1h-1zM3 3h3v1h-3zM7 3h1v1h-1zM10 3h2v1h-2zM16 3h3v1h-3zM20 3h2v1h-2zM23 3h1v1h-1zM27 3h1v1h-1zM29 3h3v1h-3zM33 3h1v1h-1zM1 4h1v1h-1zM3 4h3v1h-3zM7 4h1v1h-1zM9 4h1v1h-1zM11 4h1v1h-1zM13 4h1v1h-1zM15 4h3v1h-3zM21 4h1v1h-1zM23 4h3v1h-3zM27 4h1v1h-1zM29 4h3v1h-3zM33 4h1v1h-1zM1 5h1v1h-1zM3 5h3v1h-3zM7 5h1v1h-1zM10 5h2v1h-2zM15 5h1v1h-1zM18 5h1v1h-1zM21 5h3v1h-3zM25 5h1v1h-1zM27 5h1v1h-1zM29 5h3v1h-3zM33 5h1v1h-1zM1 6h1v1h-1zM7 6h1v1h-1zM10 6h3v1h-3zM14 6h2v1h-2zM18 6h5v1h-5zM25 6h1v1h-1zM27 6h1v1h-1zM33 6h1v1h-1zM1 7h7v1h-7zM9 7h1v1h-1zM11 7h1v1h-1zM13 7h1v1h-1zM15 7h1v1h-1zM17 7h1v1h-1zM19 7h1v1h-1zM21 7h1v1h-1zM23 7h1v1h-1zM25 7h1v1h-1zM27 7h7v1h-7zM9 8h1v1h-1zM18 8h1v1h-1zM21 8h1v1h-1zM23 8h1v1h-1zM25 8h1v1h-1zM1 9h1v1h-1zM3 9h2v1h-2zM6 9h3v1h-3zM11 9h3v1h-3zM15 9h1v1h-1zM18 9h1v1h-1zM20 9h1v1h-1zM22 9h1v1h-1zM24 9h1v1h-1zM27 9h1v1h-1zM30 9h1v1h-1zM32 9h2v1h-2zM1 10h1v1h-1zM3 10h2v1h-2zM9 10h1v1h-1zM11 10h2v1h-2zM17 10h1v1h-1zM19 10h6v1h-6zM27 10h2v1h-2zM30 10h2v1h-2zM33 10h1v1h-1zM1 11h3v1h-3zM5 11h3v1h-3zM9 11h5v1h-5zM15 11h1v1h-1zM17 11h2v1h-2zM21 11h2v1h-2zM24 11h2v1h-2zM27 11h4v1h-4zM32 11h2v1h-2zM1 12h1v1h-1zM3 12h1v1h-1zM5 12h1v1h-1zM8 12h4v1h-4zM13 12h5v1h-5zM19 12h1v1h-1zM24 12h1v1h-1zM27 12h2v1h-2zM30 12h1v1h-1zM4 13h1v1h-1zM6 13h3v1h-3zM10 13h3v1h-3zM16 13h1v1h-1zM19 13h1v1h-1zM22 13h1v1h-1zM25 13h2v1h-2zM29 13h2v1h-2zM33 13h1v1h-1zM3 14h2v1h-2zM6 14h1v1h-1zM9 14h1v1h-1zM12 14h2v1h-2zM17 14h1v1h-1zM19 14h1v1h-1zM25 14h1v1h-1zM28 14h1v1h-1zM32 14h1v1h-1zM2 15h2v1h-2zM7 15h3v1h-3zM11 15h2v1h-2zM16 15h4v1h-4zM23 15h1v1h-1zM25 15h1v1h-1zM27 15h3v1h-3zM3 16h1v1h-1zM6 16h1v1h-1zM8 16h1v1h-1zM13 16h1v1h-1zM15 16h1v1h-1zM17 16h1v1h-1zM19 16h4v1h-4zM24 16h1v1h-1zM26 16h6v1h-6zM1 17h4v1h-4zM7 17h1v1h-1zM9 17h2v1h-2zM13 17h4v1h-4zM19 17h2v1h-2zM22 17h2v1h-2zM26 17h2v1h-2zM29 17h3v1h-3zM1 18h6v1h-6zM8 18h1v1h-1zM10 18h2v1h-2zM13 18h1v1h-1zM16 18h3v1h-3zM21 18h5v1h-5zM27 18h1v1h-1zM29 18h2v1h-2zM32 18h2v1h-2zM4 19h5v1h-5zM10 19h1v1h-1zM12 19h1v1h-1zM15 19h4v1h-4zM21 19h1v1h-1zM23 19h1v1h-1zM27 19h3v1h-3zM31 19h2v1h-2zM2 20h2v1h-2zM5 20h1v1h-1zM10 20h5v1h-5zM16 20h2v1h-2zM22 20h1v1h-1zM24 20h1v1h-1zM26 20h1v1h-1zM29 20h1v1h-1zM32 20h1v1h-1zM1 21h1v1h-1zM5 21h5v1h-5zM11 21h1v1h-1zM14 21h3v1h-3zM19 21h1v1h-1zM21 21h1v1h-1zM24 21h1v1h-1zM26 21h1v1h-1zM30 21h3v1h-3zM1 22h1v1h-1zM3 22h2v1h-2zM6 22h1v1h-1zM11 22h1v1h-1zM14 22h1v1h-1zM16 22h1v1h-1zM19 22h1v1h-1zM24 22h1v1h-1zM27 22h1v1h-1zM30 22h2v1h-2zM33 22h1v1h-1zM3 23h1v1h-1zM5 23h1v1h-1zM7 23h1v1h-1zM9 23h1v1h-1zM12 23h3v1h-3zM17 23h1v1h-1zM24 23h1v1h-1zM27 23h1v1h-1zM29 23h1v1h-1zM32 23h2v1h-2zM2 24h1v1h-1zM5 24h2v1h-2zM8 24h2v1h-2zM12 24h1v1h-1zM17 24h1v1h-1zM19 24h2v1h-2zM23 24h1v1h-1zM25 24h2v1h-2zM29 24h1v1h-1zM32 24h2v1h-2zM1 25h1v1h-1zM3 25h3v1h-3zM7 25h2v1h-2zM11 25h3v1h-3zM16 25h1v1h-1zM18 25h1v1h-1zM23 25h1v1h-1zM25 25h5v1h-5zM32 25h2v1h-2zM9 26h1v1h-1zM12 26h1v1h-1zM15 26h2v1h-2zM18 26h1v1h-1zM20 26h1v1h-1zM25 26h1v1h-1zM29 26h2v1h-2zM1 27h7v1h-7zM9 27h1v1h-1zM11 27h1v1h-1zM13 27h2v1h-2zM20 27h1v1h-1zM23 27h3v1h-3zM27 27h1v1h-1zM29 27h1v1h-1zM1 28h1v1h-1zM7 28h1v1h-1zM9 28h4v1h-4zM15 28h3v1h-3zM20 28h1v1h-1zM22 28h4v1h-4zM29 28h4v1h-4zM1 29h1v1h-1zM3 29h3v1h-3zM7 29h1v1h-1zM10 29h1v1h-1zM12 29h1v1h-1zM14 29h1v1h-1zM16 29h1v1h-1zM18 29h1v1h-1zM21 29h1v1h-1zM24 29h6v1h-6zM31 29h1v1h-1zM1 30h1v1h-1zM3 30h3v1h-3zM7 30h1v1h-1zM9 30h2v1h-2zM13 30h2v1h-2zM18 30h4v1h-4zM24 30h2v1h-2zM28 30h1v1h-1zM30 30h4v1h-4zM1 31h1v1h-1zM3 31h3v1h-3zM7 31h1v1h-1zM9 31h2v1h-2zM12 31h1v1h-1zM18 31h1v1h-1zM20 31h1v1h-1zM22 31h1v1h-1zM25 31h4v1h-4zM30 31h2v1h-2zM1 32h1v1h-1zM7 32h1v1h-1zM11 32h1v1h-1zM13 32h1v1h-1zM15 32h6v1h-6zM23 32h1v1h-1zM25 32h2v1h-2zM28 32h2v1h-2zM33 32h1v1h-1zM1 33h7v1h-7zM9 33h5v1h-5zM15 33h5v1h-5zM21 33h2v1h-2zM24 33h1v1h-1zM29 33h3v1h-3z\"/></svg>",
    "cssrs-full": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 35 35\" width=\"90\" height=\"90\" shape-rendering=\"crispEdges\"><rect width=\"35\" height=\"35\" fill=\"#fff\"/><path fill=\"#000\" d=\"M1 1h7v1h-7zM9 1h1v1h-1zM11 1h1v1h-1zM14 1h2v1h-2zM17 1h5v1h-5zM24 1h1v1h-1zM27 1h7v1h-7zM1 2h1v1h-1zM7 2h1v1h-1zM9 2h3v1h-3zM13 2h2v1h-2zM17 2h1v1h-1zM19 2h1v1h-1zM23 2h2v1h-2zM27 2h1v1h-1zM33 2h1v1h-1zM1 3h1v1h-1zM3 3h3v1h-3zM7 3h1v1h-1zM10 3h2v1h-2zM16 3h3v1h-3zM20 3h2v1h-2zM23 3h1v1h-1zM27 3h1v1h-1zM29 3h3v1h-3zM33 3h1v1h-1zM1 4h1v1h-1zM3 4h3v1h-3zM7 4h1v1h-1zM9 4h1v1h-1zM11 4h1v1h-1zM13 4h1v1h-1zM15 4h3v1h-3zM21 4h1v1h-1zM23 4h3v1h-3zM27 4h1v1h-1zM29 4h3v1h-3zM33 4h1v1h-1zM1 5h1v1h-1zM3 5h3v1h-3zM7 5h1v1h-1zM10 5h2v1h-2zM15 5h1v1h-1zM18 5h1v1h-1zM21 5h3v1h-3zM25 5h1v1h-1zM27 5h1v1h-1zM29 5h3v1h-3zM33 5h1v1h-1zM1 6h1v1h-1zM7 6h1v1h-1zM10 6h3v1h-3zM14 6h2v1h-2zM18 6h5v1h-5zM25 6h1v1h-1zM27 6h1v1h-1zM33 6h1v1h-1zM1 7h7v1h-7zM9 7h1v1h-1zM11 7h1v1h-1zM13 7h1v1h-1zM15 7h1v1h-1zM17 7h1v1h-1zM19 7h1v1h-1zM21 7h1v1h-1zM23 7h1v1h-1zM25 7h1v1h-1zM27 7h7v1h-7zM9 8h1v1h-1zM18 8h1v1h-1zM21 8h1v1h-1zM23 8h1v1h-1zM25 8h1v1h-1zM1 9h1v1h-1zM3 9h2v1h-2zM6 9h3v1h-3zM11 9h3v1h-3zM15 9h1v1h-1zM18 9h1v1h-1zM20 9h1v1h-1zM22 9h1v1h-1zM24 9h1v1h-1zM27 9h1v1h-1zM30 9h1v1h-1zM32 9h2v1h-2zM1 10h1v1h-1zM3 10h2v1h-2zM9 10h1v1h-1zM11 10h2v1h-2zM17 10h1v1h-1zM19 10h6v1h-6zM27 10h2v1h-2zM30 10h2v1h-2zM33 10h1v1h-1zM1 11h3v1h-3zM5 11h3v1h-3zM9 11h5v1h-5zM15 11h1v1h-1zM17 11h2v1h-2zM21 11h2v1h-2zM24 11h2v1h-2zM27 11h4v1h-4zM32 11h2v1h-2zM1 12h1v1h-1zM3 12h1v1h-1zM5 12h1v1h-1zM8 12h4v1h-4zM13 12h5v1h-5zM19 12h1v1h-1zM24 12h1v1h-1zM27 12h2v1h-2zM30 12h1v1h-1zM4 13h1v1h-1zM6 13h3v1h-3zM10 13h3v1h-3zM16 13h1v1h-1zM19 13h1v1h-1zM22 13h1v1h-1zM25 13h2v1h-2zM29 13h2v1h-2zM33 13h1v1h-1zM3 14h2v1h-2zM6 14h1v1h-1zM9 14h1v1h-1zM12 14h2v1h-2zM17 14h1v1h-1zM19 14h1v1h-1zM25 14h1v1h-1zM28 14h1v1h-1zM32 14h1v1h-1zM2 15h2v1h-2zM7 15h3v1h-3zM11 15h2v1h-2zM16 15h4v1h-4zM23 15h1v1h-1zM25 15h1v1h-1zM27 15h3v1h-3zM3 16h1v1h-1zM6 16h1v1h-1zM8 16h1v1h-1zM13 16h1v1h-1zM15 16h1v1h-1zM17 16h1v1h-1zM19 16h4v1h-4zM24 16h1v1h-1zM26 16h6v1h-6zM1 17h4v1h-4zM7 17h1v1h-1zM9 17h2v1h-2zM13 17h4v1h-4zM19 17h2v1h-2zM22 17h2v1h-2zM26 17h2v1h-2zM29 17h3v1h-3zM1 18h6v1h-6zM8 18h1v1h-1zM10 18h2v1h-2zM13 18h1v1h-1zM16 18h3v1h-3zM21 18h5v1h-5zM27 18h1v1h-1zM29 18h2v1h-2zM32 18h2v1h-2zM4 19h5v1h-5zM10 19h1v1h-1zM12 19h1v1h-1zM15 19h4v1h-4zM21 19h1v1h-1zM23 19h1v1h-1zM27 19h3v1h-3zM31 19h2v1h-2zM2 20h2v1h-2zM5 20h1v1h-1zM10 20h5v1h-5zM16 20h2v1h-2zM22 20h1v1h-1zM24 20h1v1h-1zM26 20h1v1h-1zM29 20h1v1h-1zM32 20h1v1h-1zM1 21h1v1h-1zM5 21h5v1h-5zM11 21h1v1h-1zM14 21h3v1h-3zM19 21h1v1h-1zM21 21h1v1h-1zM24 21h1v1h-1zM26 21h1v1h-1zM30 21h3v1h-3zM1 22h1v1h-1zM3 22h2v1h-2zM6 22h1v1h-1zM11 22h1v1h-1zM14 22h1v1h-1zM16 22h1v1h-1zM19 22h1v1h-1zM24 22h1v1h-1zM27 22h1v1h-1zM30 22h2v1h-2zM33 22h1v1h-1zM3 23h1v1h-1zM5 23h1v1h-1zM7 23h1v1h-1zM9 23h1v1h-1zM12 23h3v1h-3zM17 23h1v1h-1zM24 23h1v1h-1zM27 23h1v1h-1zM29 23h1v1h-1zM32 23h2v1h-2zM2 24h1v1h-1zM5 24h2v1h-2zM8 24h2v1h-2zM12 24h1v1h-1zM17 24h1v1h-1zM19 24h2v1h-2zM23 24h1v1h-1zM25 24h2v1h-2zM29 24h1v1h-1zM32 24h2v1h-2zM1 25h1v1h-1zM3 25h3v1h-3zM7 25h2v1h-2zM11 25h3v1h-3zM16 25h1v1h-1zM18 25h1v1h-1zM23 25h1v1h-1zM25 25h5v1h-5zM32 25h2v1h-2zM9 26h1v1h-1zM12 26h1v1h-1zM15 26h2v1h-2zM18 26h1v1h-1zM20 26h1v1h-1zM25 26h1v1h-1zM29 26h2v1h-2zM1 27h7v1h-7zM9 27h1v1h-1zM11 27h1v1h-1zM13 27h2v1h-2zM20 27h1v1h-1zM23 27h3v1h-3zM27 27h1v1h-1zM29 27h1v1h-1zM1 28h1v1h-1zM7 28h1v1h-1zM9 28h4v1h-4zM15 28h3v1h-3zM20 28h1v1h-1zM22 28h4v1h-4zM29 28h4v1h-4zM1 29h1v1h-1zM3 29h3v1h-3zM7 29h1v1h-1zM10 29h1v1h-1zM12 29h1v1h-1zM14 29h1v1h-1zM16 29h1v1h-1zM18 29h1v1h-1zM21 29h1v1h-1zM24 29h6v1h-6zM31 29h1v1h-1zM1 30h1v1h-1zM3 30h3v1h-3zM7 30h1v1h-1zM9 30h2v1h-2zM13 30h2v1h-2zM18 30h4v1h-4zM24 30h2v1h-2zM28 30h1v1h-1zM30 30h4v1h-4zM1 31h1v1h-1zM3 31h3v1h-3zM7 31h1v1h-1zM9 31h2v1h-2zM12 31h1v1h-1zM18 31h1v1h-1zM20 31h1v1h-1zM22 31h1v1h-1zM25 31h4v1h-4zM30 31h2v1h-2zM1 32h1v1h-1zM7 32h1v1h-1zM11 32h1v1h-1zM13 32h1v1h-1zM15 32h6v1h-6zM23 32h1v1h-1zM25 32h2v1h-2zM28 32h2v1h-2zM33 32h1v1h-1zM1 33h7v1h-7zM9 33h5v1h-5zM15 33h5v1h-5zM21 33h2v1h-2zM24 33h1v1h-1zM29 33h3v1h-3z\"/></svg>",
    "bat-work": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 31 31\" width=\"90\" height=\"90\" shape-rendering=\"crispEdges\"><rect width=\"31\" height=\"31\" fill=\"#fff\"/><path fill=\"#000\" d=\"M1 1h7v1h-7zM12 1h1v1h-1zM14 1h2v1h-2zM17 1h5v1h-5zM23 1h7v1h-7zM1 2h1v1h-1zM7 2h1v1h-1zM9 2h2v1h-2zM12 2h1v1h-1zM15 2h2v1h-2zM19 2h2v1h-2zM23 2h1v1h-1zM29 2h1v1h-1zM1 3h1v1h-1zM3 3h3v1h-3zM7 3h1v1h-1zM10 3h2v1h-2zM13 3h3v1h-3zM19 3h2v1h-2zM23 3h1v1h-1zM25 3h3v1h-3zM29 3h1v1h-1zM1 4h1v1h-1zM3 4h3v1h-3zM7 4h1v1h-1zM11 4h1v1h-1zM14 4h2v1h-2zM19 4h2v1h-2zM23 4h1v1h-1zM25 4h3v1h-3zM29 4h1v1h-1zM1 5h1v1h-1zM3 5h3v1h-3zM7 5h1v1h-1zM9 5h5v1h-5zM15 5h2v1h-2zM19 5h2v1h-2zM23 5h1v1h-1zM25 5h3v1h-3zM29 5h1v1h-1zM1 6h1v1h-1zM7 6h1v1h-1zM12 6h1v1h-1zM14 6h1v1h-1zM16 6h2v1h-2zM20 6h2v1h-2zM23 6h1v1h-1zM29 6h1v1h-1zM1 7h7v1h-7zM9 7h1v1h-1zM11 7h1v1h-1zM13 7h1v1h-1zM15 7h1v1h-1zM17 7h1v1h-1zM19 7h1v1h-1zM21 7h1v1h-1zM23 7h7v1h-7zM14 8h2v1h-2zM17 8h5v1h-5zM1 9h1v1h-1zM3 9h1v1h-1zM5 9h1v1h-1zM7 9h1v1h-1zM12 9h1v1h-1zM15 9h4v1h-4zM21 9h1v1h-1zM25 9h1v1h-1zM28 9h1v1h-1zM1 10h4v1h-4zM6 10h1v1h-1zM9 10h1v1h-1zM12 10h1v1h-1zM15 10h1v1h-1zM17 10h1v1h-1zM21 10h3v1h-3zM26 10h1v1h-1zM29 10h1v1h-1zM3 11h2v1h-2zM7 11h1v1h-1zM9 11h1v1h-1zM12 11h3v1h-3zM18 11h1v1h-1zM21 11h1v1h-1zM24 11h1v1h-1zM27 11h3v1h-3zM3 12h1v1h-1zM5 12h2v1h-2zM8 12h1v1h-1zM11 12h1v1h-1zM13 12h1v1h-1zM17 12h3v1h-3zM22 12h1v1h-1zM24 12h1v1h-1zM28 12h1v1h-1zM1 13h1v1h-1zM3 13h1v1h-1zM5 13h1v1h-1zM7 13h1v1h-1zM9 13h1v1h-1zM13 13h1v1h-1zM16 13h3v1h-3zM22 13h2v1h-2zM26 13h1v1h-1zM28 13h2v1h-2zM2 14h1v1h-1zM5 14h2v1h-2zM8 14h3v1h-3zM14 14h1v1h-1zM17 14h1v1h-1zM21 14h3v1h-3zM26 14h1v1h-1zM29 14h1v1h-1zM1 15h3v1h-3zM6 15h2v1h-2zM10 15h1v1h-1zM12 15h1v1h-1zM15 15h1v1h-1zM17 15h1v1h-1zM22 15h1v1h-1zM24 15h3v1h-3zM28 15h2v1h-2zM3 16h1v1h-1zM5 16h2v1h-2zM9 16h1v1h-1zM14 16h8v1h-8zM23 16h4v1h-4zM28 16h1v1h-1zM2 17h1v1h-1zM5 17h1v1h-1zM7 17h3v1h-3zM13 17h1v1h-1zM15 17h1v1h-1zM18 17h7v1h-7zM26 17h1v1h-1zM28 17h2v1h-2zM2 18h1v1h-1zM4 18h1v1h-1zM8 18h1v1h-1zM11 18h1v1h-1zM15 18h1v1h-1zM17 18h1v1h-1zM21 18h1v1h-1zM23 18h1v1h-1zM26 18h2v1h-2zM29 18h1v1h-1zM1 19h1v1h-1zM4 19h5v1h-5zM11 19h1v1h-1zM13 19h2v1h-2zM18 19h1v1h-1zM21 19h1v1h-1zM23 19h2v1h-2zM28 19h2v1h-2zM2 20h1v1h-1zM4 20h1v1h-1zM6 20h1v1h-1zM8 20h2v1h-2zM13 20h1v1h-1zM16 20h4v1h-4zM22 20h1v1h-1zM24 20h1v1h-1zM26 20h1v1h-1zM28 20h1v1h-1zM1 21h1v1h-1zM3 21h1v1h-1zM5 21h1v1h-1zM7 21h1v1h-1zM9 21h1v1h-1zM12 21h2v1h-2zM16 21h4v1h-4zM21 21h5v1h-5zM9 22h1v1h-1zM11 22h1v1h-1zM14 22h1v1h-1zM18 22h1v1h-1zM21 22h1v1h-1zM25 22h1v1h-1zM27 22h3v1h-3zM1 23h7v1h-7zM10 23h2v1h-2zM13 23h1v1h-1zM15 23h1v1h-1zM17 23h5v1h-5zM23 23h1v1h-1zM25 23h2v1h-2zM28 23h2v1h-2zM1 24h1v1h-1zM7 24h1v1h-1zM11 24h1v1h-1zM14 24h6v1h-6zM21 24h1v1h-1zM25 24h2v1h-2zM28 24h1v1h-1zM1 25h1v1h-1zM3 25h3v1h-3zM7 25h1v1h-1zM9 25h4v1h-4zM15 25h1v1h-1zM18 25h1v1h-1zM21 25h5v1h-5zM28 25h2v1h-2zM1 26h1v1h-1zM3 26h3v1h-3zM7 26h1v1h-1zM10 26h2v1h-2zM13 26h1v1h-1zM15 26h1v1h-1zM17 26h2v1h-2zM25 26h1v1h-1zM27 26h3v1h-3zM1 27h1v1h-1zM3 27h3v1h-3zM7 27h1v1h-1zM9 27h1v1h-1zM13 27h1v1h-1zM15 27h1v1h-1zM18 27h2v1h-2zM21 27h1v1h-1zM24 27h3v1h-3zM29 27h1v1h-1zM1 28h1v1h-1zM7 28h1v1h-1zM10 28h1v1h-1zM13 28h1v1h-1zM15 28h2v1h-2zM18 28h1v1h-1zM20 28h5v1h-5zM28 28h1v1h-1zM1 29h7v1h-7zM9 29h1v1h-1zM12 29h1v1h-1zM15 29h1v1h-1zM17 29h2v1h-2zM20 29h2v1h-2zM23 29h1v1h-1zM25 29h2v1h-2zM28 29h2v1h-2z\"/></svg>",
    "bat-general": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 31 31\" width=\"90\" height=\"90\" shape-rendering=\"crispEdges\"><rect width=\"31\" height=\"31\" fill=\"#fff\"/><path fill=\"#000\" d=\"M1 1h7v1h-7zM12 1h1v1h-1zM14 1h2v1h-2zM17 1h5v1h-5zM23 1h7v1h-7zM1 2h1v1h-1zM7 2h1v1h-1zM9 2h2v1h-2zM12 2h1v1h-1zM15 2h2v1h-2zM19 2h2v1h-2zM23 2h1v1h-1zM29 2h1v1h-1zM1 3h1v1h-1zM3 3h3v1h-3zM7 3h1v1h-1zM10 3h2v1h-2zM13 3h3v1h-3zM19 3h2v1h-2zM23 3h1v1h-1zM25 3h3v1h-3zM29 3h1v1h-1zM1 4h1v1h-1zM3 4h3v1h-3zM7 4h1v1h-1zM11 4h1v1h-1zM14 4h2v1h-2zM19 4h2v1h-2zM23 4h1v1h-1zM25 4h3v1h-3zM29 4h1v1h-1zM1 5h1v1h-1zM3 5h3v1h-3zM7 5h1v1h-1zM9 5h5v1h-5zM15 5h2v1h-2zM19 5h2v1h-2zM23 5h1v1h-1zM25 5h3v1h-3zM29 5h1v1h-1zM1 6h1v1h-1zM7 6h1v1h-1zM12 6h1v1h-1zM14 6h1v1h-1zM16 6h2v1h-2zM20 6h2v1h-2zM23 6h1v1h-1zM29 6h1v1h-1zM1 7h7v1h-7zM9 7h1v1h-1zM11 7h1v1h-1zM13 7h1v1h-1zM15 7h1v1h-1zM17 7h1v1h-1zM19 7h1v1h-1zM21 7h1v1h-1zM23 7h7v1h-7zM14 8h2v1h-2zM17 8h5v1h-5zM1 9h1v1h-1zM3 9h1v1h-1zM5 9h1v1h-1zM7 9h1v1h-1zM12 9h1v1h-1zM15 9h4v1h-4zM21 9h1v1h-1zM25 9h1v1h-1zM28 9h1v1h-1zM1 10h4v1h-4zM6 10h1v1h-1zM9 10h1v1h-1zM12 10h1v1h-1zM15 10h1v1h-1zM17 10h1v1h-1zM21 10h3v1h-3zM26 10h1v1h-1zM29 10h1v1h-1zM3 11h2v1h-2zM7 11h1v1h-1zM9 11h1v1h-1zM12 11h3v1h-3zM18 11h1v1h-1zM21 11h1v1h-1zM24 11h1v1h-1zM27 11h3v1h-3zM3 12h1v1h-1zM5 12h2v1h-2zM8 12h1v1h-1zM11 12h1v1h-1zM13 12h1v1h-1zM17 12h3v1h-3zM22 12h1v1h-1zM24 12h1v1h-1zM28 12h1v1h-1zM1 13h1v1h-1zM3 13h1v1h-1zM5 13h1v1h-1zM7 13h1v1h-1zM9 13h1v1h-1zM13 13h1v1h-1zM16 13h3v1h-3zM22 13h2v1h-2zM26 13h1v1h-1zM28 13h2v1h-2zM2 14h1v1h-1zM5 14h2v1h-2zM8 14h3v1h-3zM14 14h1v1h-1zM17 14h1v1h-1zM21 14h3v1h-3zM26 14h1v1h-1zM29 14h1v1h-1zM1 15h3v1h-3zM6 15h2v1h-2zM10 15h1v1h-1zM12 15h1v1h-1zM15 15h1v1h-1zM17 15h1v1h-1zM22 15h1v1h-1zM24 15h3v1h-3zM28 15h2v1h-2zM3 16h1v1h-1zM5 16h2v1h-2zM9 16h1v1h-1zM14 16h8v1h-8zM23 16h4v1h-4zM28 16h1v1h-1zM2 17h1v1h-1zM5 17h1v1h-1zM7 17h3v1h-3zM13 17h1v1h-1zM15 17h1v1h-1zM18 17h7v1h-7zM26 17h1v1h-1zM28 17h2v1h-2zM2 18h1v1h-1zM4 18h1v1h-1zM8 18h1v1h-1zM11 18h1v1h-1zM15 18h1v1h-1zM17 18h1v1h-1zM21 18h1v1h-1zM23 18h1v1h-1zM26 18h2v1h-2zM29 18h1v1h-1zM1 19h1v1h-1zM4 19h5v1h-5zM11 19h1v1h-1zM13 19h2v1h-2zM18 19h1v1h-1zM21 19h1v1h-1zM23 19h2v1h-2zM28 19h2v1h-2zM2 20h1v1h-1zM4 20h1v1h-1zM6 20h1v1h-1zM8 20h2v1h-2zM13 20h1v1h-1zM16 20h4v1h-4zM22 20h1v1h-1zM24 20h1v1h-1zM26 20h1v1h-1zM28 20h1v1h-1zM1 21h1v1h-1zM3 21h1v1h-1zM5 21h1v1h-1zM7 21h1v1h-1zM9 21h1v1h-1zM12 21h2v1h-2zM16 21h4v1h-4zM21 21h5v1h-5zM9 22h1v1h-1zM11 22h1v1h-1zM14 22h1v1h-1zM18 22h1v1h-1zM21 22h1v1h-1zM25 22h1v1h-1zM27 22h3v1h-3zM1 23h7v1h-7zM10 23h2v1h-2zM13 23h1v1h-1zM15 23h1v1h-1zM17 23h5v1h-5zM23 23h1v1h-1zM25 23h2v1h-2zM28 23h2v1h-2zM1 24h1v1h-1zM7 24h1v1h-1zM11 24h1v1h-1zM14 24h6v1h-6zM21 24h1v1h-1zM25 24h2v1h-2zM28 24h1v1h-1zM1 25h1v1h-1zM3 25h3v1h-3zM7 25h1v1h-1zM9 25h4v1h-4zM15 25h1v1h-1zM18 25h1v1h-1zM21 25h5v1h-5zM28 25h2v1h-2zM1 26h1v1h-1zM3 26h3v1h-3zM7 26h1v1h-1zM10 26h2v1h-2zM13 26h1v1h-1zM15 26h1v1h-1zM17 26h2v1h-2zM25 26h1v1h-1zM27 26h3v1h-3zM1 27h1v1h-1zM3 27h3v1h-3zM7 27h1v1h-1zM9 27h1v1h-1zM13 27h1v1h-1zM15 27h1v1h-1zM18 27h2v1h-2zM21 27h1v1h-1zM24 27h3v1h-3zM29 27h1v1h-1zM1 28h1v1h-1zM7 28h1v1h-1zM10 28h1v1h-1zM13 28h1v1h-1zM15 28h2v1h-2zM18 28h1v1h-1zM20 28h5v1h-5zM28 28h1v1h-1zM1 29h7v1h-7zM9 29h1v1h-1zM12 29h1v1h-1zM15 29h1v1h-1zM17 29h2v1h-2zM20 29h2v1h-2zM23 29h1v1h-1zM25 29h2v1h-2zM28 29h2v1h-2z\"/></svg>"
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
    .pf-print-cta {
      margin-top: 18px;
      padding: 10px 12px;
      border: 1.5px solid #000;
      border-radius: 4px;
      display: grid;
      grid-template-columns: 1fr 96px;
      gap: 12px;
      align-items: center;
      background: #fafaf6;
      font-size: 9.5px;
      line-height: 1.45;
    }
    .pf-print-cta-text strong { font-weight: 700; }
    .pf-print-cta-url {
      display: block;
      margin-top: 4px;
      font-family: 'Courier New', Consolas, monospace;
      font-size: 8.5px;
      color: #333;
      word-break: break-all;
    }
    .pf-print-cta-qr svg { display: block; width: 90px; height: 90px; }
    .pf-print-cta-caption {
      text-align: center;
      font-size: 7.5px;
      color: #555;
      margin-top: 3px;
      letter-spacing: 0.3px;
      text-transform: uppercase;
    }
    @media print {
      .pf-print-cta {
        background: #fff !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
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
    /* Column-header row: aligned labels above each bubble column.
       Both the header label row AND the bubble row use CSS Grid with the
       same grid-auto-columns pitch — so a label and its bubble share an
       identical column slot, and the label sits centered above the bubble. */
    .pf-print-col-headers {
      display: grid;
      grid-template-columns: 20px 1fr auto;
      gap: 8px 12px;
      margin: 6px 0 4px 0;
      align-items: end;
    }
    .pf-print-col-labels {
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: 22px;
      justify-items: center;
      align-items: end;
      font-size: 7px;
      font-weight: bold;
      color: #222;
      text-transform: uppercase;
      letter-spacing: 0.2px;
    }
    .pf-print-col-labels > span {
      text-align: center;
      line-height: 1.1;
      width: 100%;
      /* keep words intact — break only at spaces, never mid-letter */
      word-break: keep-all;
      overflow-wrap: normal;
      hyphens: none;
      white-space: normal;
    }
    /* Wider variant: gives more horizontal room for descriptive headers */
    .pf-print-col-labels.pf-wide-cols {
      grid-auto-columns: 44px;
      font-size: 7.5px;
    }
    .pf-print-item-boxes.pf-wide-cols {
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: 44px;
      gap: 0;
      justify-items: center;
      align-items: center;
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

    var __toolUrl = TOOL_URLS[formId];
    var __toolQr  = TOOL_QR_SVGS[formId];
    if (__toolUrl && __toolQr) {
      html += `<div class="pf-print-cta">
        <div class="pf-print-cta-text">
          After completing this form, return to <strong>${form.title}</strong> on PsychoPharmRef Clinical Tools to enter results, then copy and paste the formatted summary into your EMR.
          <span class="pf-print-cta-url">${__toolUrl}</span>
        </div>
        <div>
          <div class="pf-print-cta-qr">${__toolQr}</div>
          <div class="pf-print-cta-caption">Scan to open</div>
        </div>
      </div>`;
    }

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

  /**
   * Render an aligned column-header row above bubble columns.
   * @param {string[]} labels - text for each column, in order
   * @param {object} [opts]
   * @param {boolean} [opts.box]  - true if columns use squares (.pf-print-box width 18px)
   * @param {boolean} [opts.wide] - true to use wider columns + gap (for descriptive labels)
   */
  function renderColHeaders(labels, opts) {
    opts = opts || {};
    var classes = 'pf-print-col-labels';
    if (opts.box)  classes += ' box-cols';
    if (opts.wide) classes += ' pf-wide-cols';
    var labelHtml = labels.map(function(l) { return '<span>' + l + '</span>'; }).join('');
    return '<div class="pf-print-col-headers">'
      +    '<div></div>'
      +    '<div></div>'
      +    '<div class="' + classes + '">' + labelHtml + '</div>'
      +  '</div>';
  }

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
        html += '<div class="pf-print-section-header">Rate each domain on the CDR severity scale</div>';
        html += renderColHeaders(['None (0)', 'Questionable (0.5)', 'Mild (1)', 'Moderate (2)', 'Severe (3)'], {box: true, wide: true});
        form.domains.forEach((domain, idx) => {
          html += `<div class="pf-print-item">
            <div class="pf-print-item-num">${idx + 1}.</div>
            <div class="pf-print-item-text">${domain}</div>
            <div class="pf-print-item-boxes pf-wide-cols">
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
        html += '<div class="pf-print-section-header">Response scale</div>';
        html += renderColHeaders(['Definitely Agree', 'Slightly Agree', 'Slightly Disagree', 'Definitely Disagree'], {wide: true});
        form.items.forEach(item => {
          html += `<div class="pf-print-item">
            <div class="pf-print-item-num">${item.num}.</div>
            <div class="pf-print-item-text">${item.text}</div>
            <div class="pf-print-item-boxes pf-wide-cols">
              <span class="pf-print-circle"></span>
              <span class="pf-print-circle"></span>
              <span class="pf-print-circle"></span>
              <span class="pf-print-circle"></span>
            </div>
          </div>`;
        });
        break;

      case 'asrs':
        var asrsLabels = ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'];
        html += '<div class="pf-print-section-header">Part A (Screener)</div>';
        html += renderColHeaders(asrsLabels, {wide: true});
        form.partA.forEach(item => {
          html += `<div class="pf-print-item">
            <div class="pf-print-item-num">${item.num}.</div>
            <div class="pf-print-item-text">${item.text}</div>
            <div class="pf-print-item-boxes pf-wide-cols">
              <span class="pf-print-circle"></span>
              <span class="pf-print-circle"></span>
              <span class="pf-print-circle"></span>
              <span class="pf-print-circle"></span>
              <span class="pf-print-circle"></span>
            </div>
          </div>`;
        });
        html += '<div class="pf-print-section-header" style="margin-top: 16px;">Part B (Supplemental)</div>';
        html += renderColHeaders(asrsLabels, {wide: true});
        form.partB.forEach(item => {
          html += `<div class="pf-print-item">
            <div class="pf-print-item-num">${item.num}.</div>
            <div class="pf-print-item-text">${item.text}</div>
            <div class="pf-print-item-boxes pf-wide-cols">
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
        var pcl5Labels = ['Not at all (0)', 'A little bit (1)', 'Moderately (2)', 'Quite a bit (3)', 'Extremely (4)'];
        html += '<div class="pf-print-section-header">Instructions: In the past month, how much were you bothered by each problem?</div>';
        ['B (Intrusion)', 'C (Avoidance)', 'D (Negative Cognitions/Mood)', 'E (Arousal/Reactivity)'].forEach((cluster, idx) => {
          const clusterKey = Object.keys(form.clusters)[idx];
          html += `<div class="pf-print-section-header" style="margin-top: 12px;">Cluster ${cluster}</div>`;
          html += renderColHeaders(pcl5Labels, {wide: true});
          form.clusters[clusterKey].forEach(item => {
            html += `<div class="pf-print-item">
              <div class="pf-print-item-num">${item.num}.</div>
              <div class="pf-print-item-text">${item.text}</div>
              <div class="pf-print-item-boxes pf-wide-cols">
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
        var ybocsLabels = ['None (0)', 'Mild (1)', 'Moderate (2)', 'Severe (3)', 'Extreme (4)'];
        html += '<div class="pf-print-section-header">Obsessions (Items 1-5)</div>';
        html += renderColHeaders(ybocsLabels, {wide: true});
        form.obsessions.forEach(item => {
          html += `<div class="pf-print-item">
            <div class="pf-print-item-num">${item.num}.</div>
            <div class="pf-print-item-text">${item.text}</div>
            <div class="pf-print-item-boxes pf-wide-cols">
              <span class="pf-print-circle">0</span>
              <span class="pf-print-circle">1</span>
              <span class="pf-print-circle">2</span>
              <span class="pf-print-circle">3</span>
              <span class="pf-print-circle">4</span>
            </div>
          </div>`;
        });
        html += '<div class="pf-print-section-header">Compulsions (Items 6-10)</div>';
        html += renderColHeaders(ybocsLabels, {wide: true});
        form.compulsions.forEach(item => {
          html += `<div class="pf-print-item">
            <div class="pf-print-item-num">${item.num}.</div>
            <div class="pf-print-item-text">${item.text}</div>
            <div class="pf-print-item-boxes pf-wide-cols">
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
        var panssLabels = ['Absent', 'Minimal', 'Mild', 'Moderate', 'Mod-Severe', 'Severe', 'Extreme'];
        html += '<div class="pf-print-section-header">Rate each item on 1-7 scale</div>';
        html += renderColHeaders(panssLabels, {wide: true});
        form.items.forEach(item => {
          html += `<div class="pf-print-item">
            <div class="pf-print-item-num">${item.num}.</div>
            <div class="pf-print-item-text">${item.text}</div>
            <div class="pf-print-item-boxes pf-wide-cols">
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
        var panss30Labels = ['Absent', 'Minimal', 'Mild', 'Moderate', 'Mod-Severe', 'Severe', 'Extreme'];
        html += '<div class="pf-print-section-header">Rate each item on 1-7 scale</div>';
        html += '<div class="pf-print-section-header" style="margin-top: 12px;">Positive Scale (P1-P7)</div>';
        html += renderColHeaders(panss30Labels, {wide: true});
        form.positive.forEach(item => {
          html += `<div class="pf-print-item">
            <div class="pf-print-item-num">${item.num}.</div>
            <div class="pf-print-item-text">${item.text}</div>
            <div class="pf-print-item-boxes pf-wide-cols">
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
        html += renderColHeaders(panss30Labels, {wide: true});
        form.negative.forEach(item => {
          html += `<div class="pf-print-item">
            <div class="pf-print-item-num">${item.num}.</div>
            <div class="pf-print-item-text">${item.text}</div>
            <div class="pf-print-item-boxes pf-wide-cols">
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
        html += renderColHeaders(panss30Labels, {wide: true});
        form.general.forEach((item, idx) => {
          html += `<div class="pf-print-item">
            <div class="pf-print-item-num">G${idx + 1}.</div>
            <div class="pf-print-item-text">${item}</div>
            <div class="pf-print-item-boxes pf-wide-cols">
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
        html += '<div class="pf-print-section-header" style="margin-top: 16px;">CRS Rating (23 items)</div>';
        html += renderColHeaders(['Absent (0)', 'Occasional (1)', 'Frequent (2)', 'Constant (3)'], {wide: true});
        form.crs.forEach(item => {
          html += `<div class="pf-print-item">
            <div class="pf-print-item-num">${item.num}.</div>
            <div class="pf-print-item-text">${item.text}</div>
            <div class="pf-print-item-boxes pf-wide-cols">
              <span class="pf-print-circle">0</span>
              <span class="pf-print-circle">1</span>
              <span class="pf-print-circle">2</span>
              <span class="pf-print-circle">3</span>
            </div>
          </div>`;
        });
        break;

      case 'aims':
        var aimsLabels = ['None (0)', 'Minimal (1)', 'Mild (2)', 'Moderate (3)', 'Severe (4)'];
        html += '<div class="pf-print-section-header">Movement Items (1-7)</div>';
        html += renderColHeaders(aimsLabels, {wide: true});
        form.items.slice(0, 7).forEach(item => {
          html += `<div class="pf-print-item">
            <div class="pf-print-item-num">${item.num}.</div>
            <div class="pf-print-item-text">${item.text}</div>
            <div class="pf-print-item-boxes pf-wide-cols">
              <span class="pf-print-circle">0</span>
              <span class="pf-print-circle">1</span>
              <span class="pf-print-circle">2</span>
              <span class="pf-print-circle">3</span>
              <span class="pf-print-circle">4</span>
            </div>
          </div>`;
        });
        html += '<div class="pf-print-section-header" style="margin-top: 12px;">Global Judgments (8-10)</div>';
        html += renderColHeaders(aimsLabels, {wide: true});
        form.items.slice(7).forEach(item => {
          html += `<div class="pf-print-item">
            <div class="pf-print-item-num">${item.num}.</div>
            <div class="pf-print-item-text">${item.text}</div>
            <div class="pf-print-item-boxes pf-wide-cols">
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
        html += '<div class="pf-print-section-header">Situation & Likelihood of Dozing</div>';
        html += renderColHeaders(['Would never doze (0)', 'Slight chance (1)', 'Moderate chance (2)', 'High chance (3)'], {wide: true});
        form.items.forEach((item, idx) => {
          html += `<div class="pf-print-item">
            <div class="pf-print-item-num">${idx + 1}.</div>
            <div class="pf-print-item-text">${item}</div>
            <div class="pf-print-item-boxes pf-wide-cols">
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
        var batLabels = ['Never (1)', 'Rarely (2)', 'Sometimes (3)', 'Often (4)', 'Always (5)'];
        var batItemNum = 1;
        Object.keys(form.domains).forEach(function(domain) {
          html += '<div class="pf-print-section-header" style="margin-top: 12px;">' + domain + '</div>';
          html += renderColHeaders(batLabels, {wide: true});
          form.domains[domain].forEach(function(itemText) {
            html += '<div class="pf-print-item">' +
              '<div class="pf-print-item-num">' + batItemNum + '.</div>' +
              '<div class="pf-print-item-text">' + itemText + '</div>' +
              '<div class="pf-print-item-boxes pf-wide-cols">' +
                '<span class="pf-print-circle">1</span>' +
                '<span class="pf-print-circle">2</span>' +
                '<span class="pf-print-circle">3</span>' +
                '<span class="pf-print-circle">4</span>' +
                '<span class="pf-print-circle">5</span>' +
              '</div>' +
            '</div>';
            batItemNum++;
          });
        });
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
    if (formId === 'ace')           { return printAceForm(); }
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

  /* ─── Aid to Capacity Evaluation (ACE) — printable form ─────────────── */
  function printAceForm() {
    var domains = [
      {
        id: '1',
        title: 'Able to Understand Medical Problem',
        prompts: 'What problems are you having right now? · What problem is bothering you most? · Why are you in the hospital? · Do you have [name problem]?'
      },
      {
        id: '2',
        title: 'Able to Understand Proposed Treatment',
        prompts: 'What is the treatment for [your problem]? · What else can we do to help you? · Can you have [proposed treatment]?'
      },
      {
        id: '3',
        title: 'Able to Understand Alternative to Proposed Treatment (if any)',
        prompts: 'Are there any other [treatments]? · What other options do you have? · Can you have [alternative treatment]?'
      },
      {
        id: '4',
        title: 'Able to Understand Option of Refusing Proposed Treatment (incl. withholding/withdrawing)',
        prompts: 'Can you refuse [proposed treatment]? · Can we stop [proposed treatment]?'
      },
      {
        id: '5',
        title: 'Able to Appreciate Reasonably Foreseeable Consequences of Accepting',
        prompts: 'What could happen if you have [proposed treatment]? · Side effects/problems? · Could it help you live longer?'
      },
      {
        id: '6',
        title: 'Able to Appreciate Reasonably Foreseeable Consequences of Refusing (incl. withholding/withdrawing)',
        prompts: 'What could happen if you don’t have [proposed treatment]? · Could you get sicker / die? · What could happen if you have [alternative]?'
      }
    ];

    var seven = [
      {
        id: '7a',
        title: 'Decision Affected by Depression',
        prompts: 'Why have you decided to accept/refuse? · Do you feel you’re being punished? · Are you a bad person? · Any hope for the future? · Do you deserve to be treated?'
      },
      {
        id: '7b',
        title: 'Decision Affected by Delusions / Psychosis',
        prompts: 'Why have you decided to accept/refuse? · Is anyone trying to hurt or harm you? · Do you trust your doctor/nurse?'
      }
    ];

    function aceRow(d, isSeven) {
      var label = isSeven ? 'YES (decision IS affected) · UNSURE · NO' : 'YES · UNSURE · NO';
      return ''
        + '<div class="ace-pf-domain">'
        +   '<div class="ace-pf-dhead">'
        +     '<div class="ace-pf-dnum">' + d.id + '</div>'
        +     '<div class="ace-pf-dtitle">' + d.title + '</div>'
        +     '<div class="ace-pf-dscore">'
        +       '<span class="ace-pf-chk"></span>YES &nbsp; '
        +       '<span class="ace-pf-chk"></span>UNSURE &nbsp; '
        +       '<span class="ace-pf-chk"></span>NO'
        +     '</div>'
        +   '</div>'
        +   '<div class="ace-pf-prompts"><b>Sample Qs:</b> ' + d.prompts + '</div>'
        +   '<div class="ace-pf-obs-label">Observations / patient&rsquo;s words:</div>'
        +   '<div class="ace-pf-obs ff-lines ff-l-3"></div>'
        + '</div>';
    }

    var head = ''
      + '<div class="ff-header">'
      +   '<div><div class="ff-title">Aid to Capacity Evaluation (ACE)</div>'
      +       '<div class="ff-sub">Etchells E, et al. Joint Centre for Bioethics, University of Toronto. For non-commercial clinical use.</div></div>'
      +   '<div class="ff-sub">PsychoPharmRef.com</div>'
      + '</div>'
      + '<div class="ff-id">'
      +   '<div class="ff-field"><span class="ff-lbl">Patient:</span><span class="ff-line"></span></div>'
      +   '<div class="ff-field"><span class="ff-lbl">DOB:</span><span class="ff-line"></span></div>'
      +   '<div class="ff-field"><span class="ff-lbl">MRN:</span><span class="ff-line"></span></div>'
      +   '<div class="ff-field"><span class="ff-lbl">Date / Time:</span><span class="ff-line"></span></div>'
      +   '<div class="ff-field" style="grid-column: span 2;"><span class="ff-lbl">Assessor:</span><span class="ff-line"></span></div>'
      +   '<div class="ff-field"><span class="ff-lbl">Setting:</span><span class="ff-line"></span></div>'
      +   '<div class="ff-field"><span class="ff-lbl">Time (min):</span><span class="ff-line"></span></div>'
      + '</div>';

    var context = ''
      + '<div class="ace-pf-context">'
      +   '<div class="ace-pf-ctx-row"><span class="ace-pf-ctx-lbl">Medical condition:</span><span class="ace-pf-ctx-line"></span></div>'
      +   '<div class="ace-pf-ctx-row"><span class="ace-pf-ctx-lbl">Proposed treatment:</span><span class="ace-pf-ctx-line"></span></div>'
      +   '<div class="ace-pf-ctx-row"><span class="ace-pf-ctx-lbl">Alternatives:</span><span class="ace-pf-ctx-line"></span></div>'
      + '</div>';

    var instructions = ''
      + '<div class="ace-pf-instructions">'
      +   '<b>Scoring (Domains 1&ndash;6):</b> YES = appropriate response to open-ended questions; UNSURE = needs prompting with closed-ended questions; NO = cannot respond appropriately despite repeated prompting. '
      +   '<b>Domain 7:</b> YES means the decision <i>is</i> affected by depression / psychosis. People are presumed capable; if uncertain, err on the side of capable. Never base a finding of incapacity on domain 7 alone.'
      + '</div>';

    var body = ''
      + '<div class="ff-page ace-pf-page">'
      +   head
      +   context
      +   instructions
      +   '<div class="ace-pf-section-h">Capacity Domains</div>'
      +   domains.map(function(d){ return aceRow(d, false); }).join('')
      +   '<div class="ace-pf-section-h" style="margin-top:8px;">Affective Influences (Domain 7)</div>'
      +   seven.map(function(d){ return aceRow(d, true); }).join('')
      +   '<div class="ace-pf-section-h" style="margin-top:8px;">Overall Impression</div>'
      +   '<div class="ace-pf-overall">'
      +     '<span class="ace-pf-chk"></span>Definitely Capable &nbsp; '
      +     '<span class="ace-pf-chk"></span>Probably Capable &nbsp; '
      +     '<span class="ace-pf-chk"></span>Probably Incapable &nbsp; '
      +     '<span class="ace-pf-chk"></span>Definitely Incapable'
      +   '</div>'
      +   '<div class="ace-pf-section-h" style="margin-top:8px;">Comments</div>'
      +   '<div class="ff-sub-h">e.g., need for psychiatric assessment, further disclosure, family / cultural / religious consultation</div>'
      +   '<div class="ff-lines ff-l-4"></div>'
      +   '<div class="ff-footer">'
      +     'Capacity is decision-specific. Address treatable/reversible causes (e.g., delirium, drug toxicity, pain, communication barriers) before final determination. '
      +     'Source: Etchells E. ACE, Joint Centre for Bioethics, University of Toronto. Form generated from PsychoPharmRef.com'
      +   '</div>'
      + '</div>';

    // Wrap in a small style block specific to the ACE form
    var styled = ''
      + '<style>'
      + '.ace-pf-page { font-size: 9.5px; line-height: 1.3; }'
      + '.ace-pf-context { display: grid; gap: 3px; margin-bottom: 5px; }'
      + '.ace-pf-ctx-row { display: flex; align-items: baseline; gap: 6px; font-size: 9.5px; }'
      + '.ace-pf-ctx-lbl { font-weight: bold; min-width: 110px; }'
      + '.ace-pf-ctx-line { flex: 1; border-bottom: 1px solid #000; height: 13px; }'
      + '.ace-pf-instructions { font-size: 8.5px; padding: 4px 6px; border: 1px solid #999; background: #f6f3ec; margin-bottom: 6px; line-height: 1.35; }'
      + '.ace-pf-section-h { font-size: 10.5px; font-weight: bold; padding: 3px 0 2px; border-bottom: 1px solid #000; margin: 4px 0 4px; text-transform: uppercase; letter-spacing: 0.4px; }'
      + '.ace-pf-domain { border: 1px solid #999; padding: 4px 6px; margin-bottom: 4px; }'
      + '.ace-pf-dhead { display: grid; grid-template-columns: 28px 1fr auto; gap: 6px; align-items: baseline; }'
      + '.ace-pf-dnum { font-weight: bold; font-size: 11px; }'
      + '.ace-pf-dtitle { font-weight: bold; font-size: 9.5px; }'
      + '.ace-pf-dscore { font-size: 9px; }'
      + '.ace-pf-prompts { font-size: 8.5px; color: #333; font-style: italic; padding-left: 34px; margin: 2px 0 3px; }'
      + '.ace-pf-prompts b { font-style: normal; color: #000; }'
      + '.ace-pf-obs-label { font-size: 8.5px; font-weight: bold; padding-left: 34px; }'
      + '.ace-pf-obs { margin-left: 34px; }'
      + '.ace-pf-overall { font-size: 9.5px; padding: 4px 6px; border: 1px solid #999; }'
      + '.ace-pf-chk { display: inline-block; width: 11px; height: 11px; border: 1px solid #000; vertical-align: -1px; margin-right: 3px; }'
      + '</style>'
      + body;

    openFreeformWindow('Aid to Capacity Evaluation (ACE)', styled);
  }
})();

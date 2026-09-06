/**
 * mda-tool.js — Movement Disorder Assessment (bedside phenomenology exam).
 *
 * A self-contained port of the "MotorSign" analog movement-disorder exam into
 * the PsychoPharmRef clinical-tool pattern. It follows *The Movement Disorder
 * Examination: A Region-by-Region Phenomenology Atlas* (Shoemaker, 2026):
 * describe every movement on the seven axes, match a signature to a category,
 * and produce a description-first, copyable chart note.
 *
 * Documentation aid, not a diagnostic device. No PHI is entered or stored:
 * examiner initials only. State persists in this browser (localStorage).
 *
 * Prefix: mda-   Loaded lazily by app.js on first activation of #mda-tool.
 * Uses ToolUtils.copyWithButton / confirmReset / dateStamp.
 */
(function () {
  'use strict';

  // ======================================================================
  // DATA — descriptive axes (ported verbatim from lib/atlas/axes.ts)
  // ======================================================================
  var RHYTHMICITY = [
    { id: 'rhythmic', label: 'Rhythmic', hint: 'Oscillates about a point' },
    { id: 'semi_rhythmic', label: 'Semi-rhythmic', hint: 'Almost regular, then breaks' },
    { id: 'irregular', label: 'Irregular', hint: 'No beat' },
    { id: 'sustained', label: 'Sustained', hint: 'Holds a posture' }
  ];
  var SPEEDS = [
    { id: 'shock', label: 'Shock-like', hint: '<100 ms jerk' },
    { id: 'fast', label: 'Fast', hint: '>7 Hz or lightning' },
    { id: 'medium', label: 'Medium', hint: '3–7 Hz or flowing' },
    { id: 'slow', label: 'Slow', hint: '<3 Hz' },
    { id: 'writhing', label: 'Writhing', hint: 'Sinuous, distal' },
    { id: 'sustained', label: 'Tonic', hint: 'Holds' }
  ];
  var AMPLITUDES = [
    { id: 'fine', label: 'Fine', hint: 'Flicker, little joint travel' },
    { id: 'moderate', label: 'Moderate', hint: 'Clear displacement' },
    { id: 'coarse', label: 'Coarse', hint: 'Large, low-frequency' },
    { id: 'flinging', label: 'Flinging', hint: 'Proximal, violent' }
  ];
  var SPREADS = [
    { id: 'focal', label: 'Focal' },
    { id: 'segmental', label: 'Segmental' },
    { id: 'multifocal', label: 'Multifocal' },
    { id: 'hemi', label: 'Hemi' },
    { id: 'generalized', label: 'Generalized' }
  ];
  var ACTIVATIONS = [
    { id: 'rest', label: 'Rest' },
    { id: 'postural', label: 'Posture' },
    { id: 'kinetic', label: 'Action' },
    { id: 'intention', label: 'Intention' },
    { id: 'isometric', label: 'Isometric' },
    { id: 'task_specific', label: 'Task-specific' },
    { id: 'on_standing', label: 'On standing' },
    { id: 'on_protrusion', label: 'On protrusion' },
    { id: 'continuous', label: 'Continuous' }
  ];
  var LIMB_ACTIVATIONS = ACTIVATIONS.filter(function (i) {
    return i.id !== 'on_protrusion' && i.id !== 'on_standing';
  });
  var CONTROLS = [
    { id: 'unsuppressible', label: 'Unsuppressible' },
    { id: 'suppressible_with_urge', label: 'Urge + suppressible' },
    { id: 'suppressible_no_urge', label: 'Stops, no urge' },
    { id: 'sensory_trick', label: 'Sensory trick' },
    { id: 'distractible', label: 'Distractible' },
    { id: 'entrainable', label: 'Entrainable' }
  ];
  var PATTERNS = [
    { id: 'fixed_axis', label: 'Fixed plane', hint: 'Same axis every cycle' },
    { id: 'patterned_directional', label: 'Patterned pull', hint: 'Same muscles, same direction' },
    { id: 'random_migrating', label: 'Random, flowing', hint: 'Migrates, no plan' },
    { id: 'stereotyped', label: 'Stereotyped', hint: 'Identical each time' },
    { id: 'shock_like', label: 'Shock-like', hint: 'Discrete jerks with pauses' }
  ];
  var MODIFIERS = [
    { id: 'null_point', label: 'Null point' },
    { id: 'overflow', label: 'Overflow' },
    { id: 'mirror', label: 'Mirror' },
    { id: 'latency', label: 'Re-emergent latency' },
    { id: 'stimulus_sensitive', label: 'Stimulus-sensitive' },
    { id: 'decrement', label: 'Decrement' },
    { id: 'persists_in_sleep', label: 'Persists in sleep' },
    { id: 'camouflaged', label: 'Camouflaged' },
    { id: 'eyes_closed_worse', label: 'Worse eyes closed' }
  ];
  var LATERALITIES = [
    { id: 'left', label: 'Left' },
    { id: 'right', label: 'Right' },
    { id: 'bilateral', label: 'Bilateral' }
  ];
  var TONGUE_LATERALITIES = [
    { id: 'left', label: 'Left side' },
    { id: 'right', label: 'Right side' },
    { id: 'bilateral', label: 'Both sides' }
  ];
  var CATEGORIES = [
    { id: 'tremor', label: 'Tremor' },
    { id: 'myoclonus', label: 'Myoclonus' },
    { id: 'asterixis', label: 'Asterixis' },
    { id: 'chorea', label: 'Chorea' },
    { id: 'athetosis', label: 'Athetosis' },
    { id: 'ballism', label: 'Ballism' },
    { id: 'dystonia', label: 'Dystonia' },
    { id: 'tic', label: 'Tic' },
    { id: 'stereotypy', label: 'Stereotypy' },
    { id: 'akathisia', label: 'Akathisia' },
    { id: 'fasciculation', label: 'Fasciculation' },
    { id: 'myokymia', label: 'Myokymia' },
    { id: 'myorhythmia', label: 'Myorhythmia' },
    { id: 'bradykinesia', label: 'Bradykinesia' },
    { id: 'functional', label: 'Functional features' },
    { id: 'uncertain', label: 'Uncertain' }
  ];
  var TIME_COURSES = [
    { id: 'hours', label: 'Hours' },
    { id: 'days', label: 'Days' },
    { id: 'weeks', label: 'Weeks' },
    { id: 'months', label: 'Months' },
    { id: 'years', label: 'Years' },
    { id: 'unknown', label: 'Unknown' }
  ];

  function labelOf(options, id) {
    if (!id) return '';
    for (var i = 0; i < options.length; i++) {
      if (options[i].id === id) return options[i].label;
    }
    return id;
  }

  // ======================================================================
  // DATA — protocol / rosters (ported from lib/protocol.ts)
  // ======================================================================
  var SETTINGS = [
    { id: 'clinic', label: 'Clinic' },
    { id: 'inpatient', label: 'Inpatient' },
    { id: 'tele', label: 'Telehealth' },
    { id: 'other', label: 'Other' }
  ];
  var GENDERS = [
    { id: 'woman', label: 'Woman' },
    { id: 'man', label: 'Man' },
    { id: 'nonbinary', label: 'Nonbinary' },
    { id: 'unspecified', label: 'Unspecified' }
  ];
  var EXAMINER_CREDENTIALS = [
    { id: 'md', label: 'MD' }, { id: 'do', label: 'DO' }, { id: 'np', label: 'NP' },
    { id: 'pa', label: 'PA' }, { id: 'rn', label: 'RN' }, { id: 'lpn', label: 'LPN' },
    { id: 'aprn', label: 'APRN' }, { id: 'dnp', label: 'DNP' }, { id: 'pharmd', label: 'PharmD' },
    { id: 'rph', label: 'RPh' }, { id: 'psyd', label: 'PsyD' }, { id: 'phd', label: 'PhD' },
    { id: 'lcsw', label: 'LCSW' }, { id: 'pt', label: 'PT' }, { id: 'student', label: 'Medical student' },
    { id: 'resident', label: 'Resident' }, { id: 'family', label: 'Family' }, { id: 'other', label: 'Other' }
  ];
  var HANDEDNESS = [
    { id: 'right', label: 'Right' },
    { id: 'left', label: 'Left' },
    { id: 'ambidextrous', label: 'Ambidextrous' },
    { id: 'unspecified', label: 'Unspecified' }
  ];
  var MEDICATION_CHIPS = [
    'Haloperidol', 'Risperidone', 'Olanzapine', 'Aripiprazole', 'Quetiapine',
    'Lithium', 'Valproate', 'SSRI', 'Metoclopramide', 'Benztropine'
  ];
  var SEVERITY = [
    { id: 0, label: '0', full: 'None' },
    { id: 1, label: '1', full: 'Minimal' },
    { id: 2, label: '2', full: 'Mild' },
    { id: 3, label: '3', full: 'Moderate' },
    { id: 4, label: '4', full: 'Severe' }
  ];
  function severityLabel(v) {
    for (var i = 0; i < SEVERITY.length; i++) { if (SEVERITY[i].id === v) return SEVERITY[i].full; }
    return String(v);
  }

  // ======================================================================
  // DATA — region signs + region definitions (ported from lib/atlas/regions.ts)
  // ======================================================================
  var EYE_SIGNS = [
    { id: 'reducedBlink', label: 'Reduced blink / stare', hint: 'Hypokinetic lids', term: 'hypomimia' },
    { id: 'blepharospasm', label: 'Blepharospasm', hint: 'Forceful bilateral closure', term: 'blepharospasm' },
    { id: 'apraxiaLid', label: 'Apraxia of eyelid opening', hint: 'Cannot initiate opening', term: 'apraxiaLid' },
    { id: 'oculogyric', label: 'Oculogyric crisis', hint: 'Sustained up-deviation', term: 'oculogyric' },
    { id: 'verticalGaze', label: 'Vertical gaze palsy', hint: 'Slow down-saccades', term: 'verticalGaze' },
    { id: 'saccadesSlow', label: 'Slow or hypometric saccades', hint: 'Under-shoot or delay' },
    { id: 'nystagmus', label: 'Nystagmus', hint: 'Eccentric gaze drift', term: 'nystagmus' },
    { id: 'squareWave', label: 'Square-wave jerks', hint: 'Off and back from fixation' }
  ];
  var TONGUE_SIGNS = [
    { id: 'fasciculation', label: 'Fasciculation', hint: 'Fine flicker, no joint travel', term: 'fasciculation' },
    { id: 'wasting', label: 'Wasting / furrowing', hint: 'Bulbar LMN companion' },
    { id: 'orolingual', label: 'Orolingual rolling / writhing', hint: 'Tardive rest position', term: 'orolingual' },
    { id: 'bonbon', label: 'Bon-bon sign', hint: 'Tongue pushes the cheek' },
    { id: 'impersistence', label: 'Motor impersistence / flycatcher', hint: 'Cannot keep it out', term: 'impersistence' },
    { id: 'protrusionDystonia', label: 'Forceful protrusion dystonia', hint: 'Patterned, not darting', term: 'protrusionDystonia' },
    { id: 'myorhythmia', label: 'Lingual myorhythmia', hint: 'Slow 1–4 Hz at rest', term: 'myorhythmia' }
  ];
  var MOUTH_SIGNS = [
    { id: 'jawOpening', label: 'Jaw-opening dystonia', hint: 'Involuntary gape', term: 'oromandibular' },
    { id: 'jawClosing', label: 'Jaw-closing / bruxism', hint: 'Clench, trismus', term: 'oromandibular' },
    { id: 'jawDeviation', label: 'Jaw deviation', hint: 'Lateral or retraction', term: 'oromandibular' },
    { id: 'lipSmacking', label: 'Lip smacking / puckering', hint: 'Tardive orofacial', term: 'tardive' },
    { id: 'rabbit', label: 'Rabbit syndrome', hint: '5 Hz perioral, spares tongue', term: 'rabbit' },
    { id: 'palatalTremor', label: 'Palatal tremor', hint: '1–3 Hz elevation, ear click' },
    { id: 'adductorVoice', label: 'Strained-strangled voice', hint: 'Adductor spasmodic dysphonia' },
    { id: 'abductorVoice', label: 'Breathy whispered breaks', hint: 'Abductor spasmodic dysphonia' }
  ];
  var FACE_SIGNS = [
    { id: 'hypomimia', label: 'Hypomimia', hint: 'Masked facies', term: 'hypomimia' },
    { id: 'hemifacial', label: 'Hemifacial spasm', hint: 'Unilateral, may persist in sleep', term: 'hemifacial' },
    { id: 'myokymia', label: 'Facial myokymia', hint: 'Bag-of-worms ripple', term: 'myokymia' },
    { id: 'grimace', label: 'Grimacing (random)', hint: 'Chorea of the face', term: 'chorea' },
    { id: 'tics', label: 'Facial tics', hint: 'Urge and suppressible', term: 'tic' }
  ];
  var HAND_SIGNS = [
    { id: 'pillRolling', label: 'Pill-rolling', hint: 'Thumb on fingers at rest', term: 'tremor' },
    { id: 'reemergent', label: 'Re-emergent tremor', hint: 'Latency after arms out', term: 'reemergent' },
    { id: 'writersCramp', label: "Writer's cramp", hint: 'Task-specific dystonia', term: 'dystonia' },
    { id: 'striatalHand', label: 'Striatal hand', hint: 'Fixed MCP/PIP posture' },
    { id: 'milkmaid', label: 'Milkmaid grip', hint: 'Waxing squeeze', term: 'chorea' },
    { id: 'spooning', label: 'Spooning / choreic drift', hint: 'MCP hyperextension' },
    { id: 'asterixis', label: 'Asterixis', hint: 'Arrhythmic drop-and-recovery', term: 'asterixis' },
    { id: 'minipoly', label: 'Minipolymyoclonus', hint: 'Tiny irregular finger jerks', term: 'myoclonus' }
  ];
  var ARM_SIGNS = [
    { id: 'wingBeating', label: 'Wing-beating tremor', hint: 'Proximal, coarse', term: 'tremor' },
    { id: 'holmes', label: 'Holmes (rest+posture+action)', hint: 'Slow, irregular, midbrain' },
    { id: 'ballism', label: 'Ballism', hint: 'Flinging proximal', term: 'ballism' },
    { id: 'reducedSwing', label: 'Reduced arm swing', hint: 'Seen on gait' },
    { id: 'dystonicPosture', label: 'Dystonic arm on walking', hint: 'Action-induced elevation', term: 'dystonia' }
  ];
  var NECK_SIGNS = [
    { id: 'torticollis', label: 'Torticollis (rotation)', hint: 'Chin turns', term: 'cervical' },
    { id: 'laterocollis', label: 'Laterocollis (tilt)', hint: 'Ear to shoulder', term: 'cervical' },
    { id: 'anterocollis', label: 'Anterocollis', hint: 'Chin down; MSA flag', term: 'cervical' },
    { id: 'retrocollis', label: 'Retrocollis', hint: 'Chin up; PSP flag', term: 'cervical' },
    { id: 'sensoryTrick', label: 'Sensory trick', hint: 'Light touch helps', term: 'sensoryTrick' },
    { id: 'yesYes', label: 'Yes-yes oscillation', hint: 'Vertical plane' },
    { id: 'noNo', label: 'No-no oscillation', hint: 'Horizontal plane' },
    { id: 'droppedHead', label: 'Dropped head / floppy', hint: 'Weakness, not dystonia' }
  ];
  var FOOT_SIGNS = [
    { id: 'striatalToe', label: 'Striatal toe', hint: 'Great-toe extension', term: 'striatalToe' },
    { id: 'equinovarus', label: 'Inversion + plantarflexion', hint: 'Equinovarus foot', term: 'dystonia' },
    { id: 'pianoToes', label: 'Piano-playing toes', hint: 'Tardive stereotypy', term: 'tardive' },
    { id: 'orthostatic', label: 'Orthostatic unsteadiness', hint: 'Only standing still', term: 'orthostatic' },
    { id: 'rls', label: 'RLS by history', hint: 'Urge, rest, relief, evening', term: 'akathisia' },
    { id: 'painfulToes', label: 'Painful legs, moving toes', hint: 'Writhing + deep pain' }
  ];
  var TRUNK_SIGNS = [
    { id: 'camptocormia', label: 'Camptocormia', hint: 'Forward flexion, corrects supine', term: 'camptocormia' },
    { id: 'pisa', label: 'Pisa syndrome', hint: 'Lateral lean', term: 'pisa' },
    { id: 'opisthotonus', label: 'Opisthotonus', hint: 'Extensor arching', term: 'dystonia' },
    { id: 'bellyDancer', label: 'Belly-dancer dyskinesia', hint: 'Undulating abdominal wall' },
    { id: 'respiratory', label: 'Respiratory dyskinesia', hint: 'Irregular breathing, tardive', term: 'tardive' },
    { id: 'akathisia', label: 'Akathisia / cannot sit', hint: 'Subjective restlessness', term: 'akathisia' }
  ];
  var GAIT_SIGNS = [
    { id: 'parkinsonian', label: 'Parkinsonian / shuffling', hint: 'Short, narrow, en bloc', term: 'parkinsonism' },
    { id: 'freezing', label: 'Freezing', hint: 'Start, turn, doorway', term: 'freezing' },
    { id: 'festination', label: 'Festination', hint: 'Involuntary hurrying', term: 'festination' },
    { id: 'ataxic', label: 'Cerebellar ataxic', hint: 'Wide, irregular, cannot tandem' },
    { id: 'sensory', label: 'Sensory ataxic', hint: 'Worse eyes closed' },
    { id: 'spastic', label: 'Spastic / scissoring', hint: 'Circumduction, UMN' },
    { id: 'dystonic', label: 'Dystonic gait', hint: 'Equinovarus on walking', term: 'dystonia' },
    { id: 'choreic', label: 'Choreic / dancing', hint: 'Lurching, jaunty', term: 'chorea' },
    { id: 'functional', label: 'Functional positive signs', hint: 'Inconsistent, distractible', term: 'functional' }
  ];

  var REGION_DEFS = {
    eyes: {
      id: 'eyes', label: 'Eyes & lids', short: 'Ey',
      summary: 'Blink, lids, saccades, and gaze — the densest square inch of the exam',
      title: 'Watch before you ask them to look',
      steps: [
        'Count blinks in conversation. Reduced blink is hypokinesia; increased blink may be blepharospasm.',
        'Forceful closure (orbicularis on) is blepharospasm. Failure to open with a climbing brow is apraxia of eyelid opening.',
        'Oculogyric crisis is a sustained patterned deviation — dystonia — not a restricted-range gaze palsy.'
      ],
      physiology: 'acuteDystonia', signs: EYE_SIGNS, lateralityStyle: 'limb', showActivations: true
    },
    tongue: {
      id: 'tongue', label: 'Tongue', short: 'To',
      summary: 'Rest on the floor first, then protrusion. Fasciculation is called at rest.',
      title: 'Two states only',
      steps: [
        'At rest on the floor of the mouth: fasciculations, wasting, tardive rolling. Protrusion makes a normal fine tremor that mimics fasciculation.',
        'Hold protrusion 10 seconds: rhythmic tremor, flycatcher impersistence, or forceful patterned protrusion dystonia.',
        'There is no postural or intention tremor of the tongue. Score left side, right side, or both sides.'
      ],
      physiology: 'tardive', signs: TONGUE_SIGNS, lateralityStyle: 'side', showActivations: false
    },
    mouth: {
      id: 'mouth', label: 'Mouth & voice', short: 'Mo',
      summary: 'Jaw direction, rabbit vs tardive, palate, and analog voice',
      title: 'Name the jaw by its pull',
      steps: [
        'Jaw-opening, jaw-closing, or deviation — the direction is the description and it guides treatment.',
        'Rabbit syndrome is a fast perioral tremor that spares the tongue. Tardive smacking involves the tongue.',
        'Voice is analog only: strained-strangled breaks versus breathy whispered breaks. No recording in this version.'
      ],
      physiology: 'parkinsonism', signs: MOUTH_SIGNS, lateralityStyle: 'limb', showActivations: true
    },
    face: {
      id: 'face', label: 'Face', short: 'Fa',
      summary: 'Hypomimia versus grimace, tic, and hemifacial spasm',
      title: 'Expression first',
      steps: [
        'Reduced spontaneous expression and blink is hypomimia — bradykinesia of the face.',
        'Unilateral twitching that may persist in sleep is hemifacial spasm, not bilateral blepharospasm.',
        'Random flowing grimace is chorea. Stereotyped, urge-preceded blinks are tics.'
      ],
      physiology: 'parkinsonism', signs: FACE_SIGNS, lateralityStyle: 'limb', showActivations: true
    },
    hands: {
      id: 'hands', label: 'Hands', short: 'Ha',
      summary: 'Rest, posture, action, then the bradykinesia battery and tone',
      title: 'Classify tremor by when it appears',
      steps: [
        'Describe before you diagnose. A 4–6 Hz rest oscillation that damps with action is a description. Parkinsonian tremor is an inference.',
        'Re-emergent tremor after a few seconds of posture is still the rest oscillator.',
        'Finger tapping: speed, opening, and decrement. Decrement is the MDS core of bradykinesia.'
      ],
      physiology: 'parkinsonism', signs: HAND_SIGNS, lateralityStyle: 'limb', showActivations: true
    },
    arms: {
      id: 'arms', label: 'Arms', short: 'Ar',
      summary: 'Proximal tremor, ballism, and arm swing',
      title: 'What the hand cannot show',
      steps: [
        'Wing-beating posture unmasks proximal coarse tremor.',
        'Flinging at the shoulder is ballism until it settles into distal chorea.',
        'Reduced arm swing is often the earliest visible parkinsonian sign.'
      ],
      signs: ARM_SIGNS, lateralityStyle: 'limb', showActivations: true
    },
    neck: {
      id: 'neck', label: 'Neck & head', short: 'Ne',
      summary: 'Direction of pull, null point, and yes-yes versus no-no',
      title: 'Name every component of the pull',
      steps: [
        'Torticollis, laterocollis, anterocollis, retrocollis — most patients combine them.',
        'Dystonic head tremor is irregular, has a null point, keeps company with posture, and often persists supine. Essential head tremor is regular and quiets when the head is supported.',
        'A light touch that helps is a sensory trick and nearly specific for dystonia.'
      ],
      physiology: 'acuteDystonia', signs: NECK_SIGNS, lateralityStyle: 'limb', showActivations: true
    },
    feet: {
      id: 'feet', label: 'Feet & legs', short: 'Ft',
      summary: 'Striatal toe, off-dystonia, tapping decrement, standing tremor',
      title: 'Inspect the great toe, then stand them up',
      steps: [
        'Striatal toe is spontaneous great-toe extension — a pseudo-Babinski without the rest of the reflex.',
        'Toe and heel tapping get the same decrement grade as the hands.',
        'A fine fast tremor only on standing, relieved by walking, is orthostatic until proven otherwise.'
      ],
      signs: FOOT_SIGNS, lateralityStyle: 'limb', showActivations: true
    },
    trunk: {
      id: 'trunk', label: 'Trunk', short: 'Tr',
      summary: 'Camptocormia, Pisa, respiratory dyskinesia, and the pull test',
      title: 'Standing, then supine',
      steps: [
        'Axial dystonic postures appear upright and often correct lying down. Floppy dropped head is weakness.',
        'Watch the abdomen and the breathing. Tardive respiratory dyskinesia is easy to miss.',
        'Akathisia is a subjective urge. Score the restlessness, not just the fidget.'
      ],
      physiology: 'tardive', signs: TRUNK_SIGNS, lateralityStyle: 'limb', showActivations: true
    },
    gait: {
      id: 'gait', label: 'Gait', short: 'Ga',
      summary: 'Base, arm swing, clearance, turning, eyes-closed, consistency',
      title: 'Five reads',
      steps: [
        'Base (narrow vs wide), arm swing, foot clearance, turning, then eyes-closed effect.',
        'Gait unmasks rest tremor, dystonic posturing, and freezing that are invisible in the chair.',
        'Inconsistency, effortful slowness without decrement, and near-falls that never happen are positive functional signs.'
      ],
      physiology: 'parkinsonism', signs: GAIT_SIGNS, lateralityStyle: 'limb', showActivations: false
    }
  };

  var REGION_STATIONS = ['eyes', 'tongue', 'mouth', 'face', 'hands', 'arms', 'neck', 'feet', 'trunk', 'gait'];

  var STATIONS = [
    { id: 'intake', label: 'Context', short: 'Cx', summary: 'Age, drugs, the EPS clock, and who completed it' }
  ].concat(REGION_STATIONS.map(function (id) {
    return { id: id, label: REGION_DEFS[id].label, short: REGION_DEFS[id].short, summary: REGION_DEFS[id].summary };
  })).concat([
    { id: 'review', label: 'Note', short: 'Nt', summary: 'Description first, then a copyable chart note' }
  ]);

  var STATION_PROTOCOLS = {
    intake: {
      title: 'Before you watch',
      steps: [
        'Age, gender, and handedness only — no patient name or record number.',
        'Examiner initials and credentials. Family and Other are on the credential list.',
        'The EPS clock: hours → acute dystonia; days → akathisia; weeks → parkinsonism; months to years → tardive.',
        'A dopamine blocker, lithium, valproate, or an SSRI changes the prior. Write the time relationship.'
      ]
    },
    review: {
      title: 'The note is a description',
      steps: [
        'The chart line should be something another examiner can verify.',
        'Skipped regions are written as not examined. They are never implied to be quiet.',
        'Examined regions without findings are written as examined and quiet.',
        'Category is a signature match, not a diagnosis. Etiology still needs drugs, course, and associated signs.',
        'Voice is analog only. Machine vision is not in this version.'
      ]
    }
  };
  REGION_STATIONS.forEach(function (id) {
    STATION_PROTOCOLS[id] = { title: REGION_DEFS[id].title, steps: REGION_DEFS[id].steps };
  });

  // ======================================================================
  // DATA — glossary + physiology (ported from lib/glossary.ts, physiology.ts)
  // ======================================================================
  var GLOSSARY = {
    severity: { title: 'Severity (0–4)', body: '0 none, 1 minimal, 2 mild, 3 moderate, 4 severe. Use this for how obvious or disabling the finding is, not as a substitute for the seven axes.' },
    phenomenology: { title: 'Describe before you diagnose', body: 'Name the movement on the seven axes first. A verifiable description — rhythmic, 5 Hz, at rest, right hand — is the exam. A disease label is an inference you add later with drugs, time course, and associated signs.' },
    rhythmicity: { title: 'Rhythmicity', body: 'Whether the movement keeps a beat. Rhythmic movements oscillate back and forth about a fixed point (tremor, myorhythmia); non-rhythmic ones wander with no regular beat (chorea, myoclonus) or hold a posture (dystonia). This oscillating-versus-wandering split is the first branch of the whole algorithm.' },
    speed: { title: 'Speed', body: 'How fast each movement is, from a sub-100 ms shock to a slow sustained pull. It is the tempo of a single movement, not how often it recurs. As a guide: myoclonus is lightning, tremor is quoted in hertz, chorea flows, athetosis writhes, and dystonia is slow to sustained. Fast and fine tend to travel together, as do slow and coarse.' },
    amplitude: { title: 'Amplitude', body: 'How far the body part travels on each cycle, judged by eye rather than measured: fine is a flicker with little joint travel, moderate is clear displacement, coarse is large and low-frequency, and flinging is violent and proximal. Amplitude and frequency usually trade off against each other.' },
    spread: { title: 'Distribution', body: 'How much of the body is involved and how it is arranged in space: a single region (focal), two or more neighbouring regions (segmental), scattered non-contiguous regions (multifocal), one side of the body (hemi), or most of the body at once (generalized). Record the side as well — left, right, or both.' },
    activation: { title: 'Activation', body: 'The state that brings the movement out — the single most useful axis for tremor, because each activation points to a different disease. Note whether it appears with the part supported and quiet (rest), while holding a posture, during a movement (action), as a target is neared (intention), against resistance (isometric), only in one skilled task, on standing, or all the time (continuous).' },
    control: { title: 'Suppressibility', body: 'What happens when the patient tries to hold the movement back, is distracted, or applies a trick — the axis that unmasks tics, dystonia, and functional movements. A premonitory urge with brief suppressibility and rebound is nearly specific for tics; a light self-touch that eases it (sensory trick) is nearly specific for dystonia; stopping with distraction or taking on a tapped rhythm (entrainment) are positive functional signs.' },
    pattern: { title: 'Direction and pattern', body: 'The shape and direction the movement repeats in. A fixed oscillating plane is tremor; the same muscles pulling the same way each time is a patterned (dystonic) movement; movements that appear at random and migrate from part to part are chorea; an identical repeated sequence is stereotypy or tic; and discrete shocks separated by pauses are myoclonus.' },
    tremor: { title: 'Tremor', body: 'The only involuntary movement that is truly rhythmic and oscillatory. Classify it by activation: rest, posture, action, intention, isometric, or task-specific. Quote frequency and amplitude together.' },
    myoclonus: { title: 'Myoclonus', body: 'A shock-like jerk, usually under 100 ms, with pauses between beats. Not an oscillation. Negative myoclonus is asterixis — a drop-and-recovery.' },
    asterixis: { title: 'Asterixis', body: 'Brief lapses of posture. Arrhythmic. The old name "flapping tremor" is wrong. Flag for metabolic encephalopathy and some drugs.' },
    chorea: { title: 'Chorea', body: 'A continuous stream of random, flowing, non-rhythmic movements that migrate. Patients camouflage it (parakinesia). Milkmaid grip and tongue impersistence are bedside companions. Not a tongue-only label — tongue chorea shows up as flycatcher impersistence.' },
    athetosis: { title: 'Athetosis', body: 'Slow distal writhing. Modern usage treats it as mobile distal dystonia. If it appears or worsens with eyes closed, think pseudoathetosis from proprioceptive loss.' },
    ballism: { title: 'Ballism', body: 'Chorea turned up: large, flinging, proximal, usually hemibody. Classically a contralateral subthalamic lesion, often settling into distal chorea.' },
    dystonia: { title: 'Dystonia', body: 'Patterned, directional, often twisting contractions. Action-activated. Overflow and mirroring are common. A sensory trick that helps is nearly pathognomonic.' },
    tic: { title: 'Tic', body: 'Stereotyped, intermittent, semi-voluntary. Premonitory urge, temporary suppressibility, rebound flurry. Suggestible. The triad is close to specific.' },
    stereotypy: { title: 'Stereotypy', body: 'Fixed, repetitive, purposeless, usually without an urge. Tardive orolingual movements are often stereotypy mixed with chorea.' },
    akathisia: { title: 'Akathisia', body: 'Inner restlessness and a compulsion to move. Semi-purposeful rocking, pacing, marching. The subjective urge distinguishes it from chorea. Drug-induced until you prove otherwise.' },
    fasciculation: { title: 'Fasciculation', body: 'A single motor-unit flicker under mucosa or skin that does not move a joint. Call it on the tongue only at rest in the mouth. Protrusion produces a normal fine tremor that mimics it.' },
    myokymia: { title: 'Myokymia', body: 'Continuous bag-of-worms rippling. Facial myokymia localizes to pons. Eyelid myokymia is usually benign.' },
    myorhythmia: { title: 'Myorhythmia', body: 'Slow 1–4 Hz rhythmic movement, often cranial, often persisting at rest. Oculomasticatory myorhythmia is a Whipple flag.' },
    bradykinesia: { title: 'Bradykinesia', body: 'Slowness plus decrement — amplitude or speed falling across repetitions, with hesitations or arrests. Effortful slowness without decrement is not parkinsonism.' },
    parkinsonism: { title: 'Parkinsonism', body: 'Bradykinesia with decrement, plus rigidity or rest tremor. Drug-induced disease is often more symmetric than idiopathic PD. Hypomimia, reduced blink, reduced arm swing, and shuffling belong here.' },
    functional: { title: 'Functional positive signs', body: 'Diagnosed by inconsistency: distractibility, entrainment, variability, suggestibility, incongruence. Document the sign. The label alone is not the note.' },
    tardive: { title: 'Tardive dyskinesia', body: 'A late, often permanent hyperkinesia after chronic D2 blockade. Classic: orolingual rolling, bon-bon sign, lip smacking, piano-playing digits. Describe the movement first; tardive is a time-and-drug inference.' },
    rabbit: { title: 'Rabbit syndrome', body: 'Fast vertical perioral tremor that spares the tongue. Parkinsonian, not tardive. May respond to anticholinergics.' },
    orolingual: { title: 'Orolingual dyskinesia', body: 'Tongue rolling and writhing in the mouth with chewing and puckering. The AIMS rest position. Stereotypy and chorea mixed. Classic tardive pattern.' },
    protrusionDystonia: { title: 'Lingual protrusion dystonia', body: 'Forceful, patterned tongue thrust, often with speaking or eating. Not the darting impersistence of chorea. Flag for tardive dystonia and neuroacanthocytosis.' },
    impersistence: { title: 'Motor impersistence', body: 'Cannot sustain protrusion — the flycatcher or trombone tongue of chorea. Distinct from a patterned dystonic thrust.' },
    oromandibular: { title: 'Oromandibular dystonia', body: 'Patterned jaw-opening, closing, or deviation, often action-induced, often with a sensory trick. With blepharospasm it is Meige syndrome. Name the direction of pull.' },
    hypomimia: { title: 'Hypomimia', body: 'Poverty of facial expression and blink. Bradykinesia of the face. Pairs with lid retraction or reduced blink in parkinsonism.' },
    blepharospasm: { title: 'Blepharospasm', body: 'Forceful bilateral orbicularis closure. Focal dystonia. Light, wind, and reading worsen it. A sensory trick may help. Watch the brow to separate it from apraxia of eyelid opening.' },
    apraxiaLid: { title: 'Apraxia of eyelid opening', body: 'Cannot initiate opening. No orbicularis spasm. The brow climbs. Common with blepharospasm and PSP.' },
    oculogyric: { title: 'Oculogyric crisis', body: 'Sustained conjugate upward or lateral deviation. Acute dystonia from dopamine blockade. Not a gaze palsy — the range is not restricted; the eyes are pulled.' },
    verticalGaze: { title: 'Vertical supranuclear palsy', body: 'Slow or limited vertical saccades, down first, improved by doll’s-head. PSP until you prove otherwise.' },
    nystagmus: { title: 'Nystagmus', body: 'Drift with corrective jerks, usually on eccentric gaze. Cerebellar, brainstem, or drug effect.' },
    hemifacial: { title: 'Hemifacial spasm', body: 'Unilateral, irregular twitching that often starts in orbicularis oculi and spreads. May persist in sleep. Peripheral CN VII. Bilateral forceful closure is blepharospasm instead.' },
    reemergent: { title: 'Re-emergent tremor', body: 'A postural tremor that appears after a latency of several seconds. It is the parkinsonian rest oscillator expressing itself in posture, not essential tremor.' },
    sensoryTrick: { title: 'Sensory trick', body: 'A light self-applied touch that eases dystonia. Near-specific. Ask for it and watch.' },
    cervical: { title: 'Cervical dystonia', body: 'Patterned head posture. Name torticollis, laterocollis, anterocollis, and retrocollis. Look for hypertrophy, a sensory trick, and dystonic head tremor.' },
    striatalToe: { title: 'Striatal toe', body: 'Spontaneous dystonic extension of the great toe. A pseudo-Babinski without the rest of the reflex. Parkinsonism and off-dystonia.' },
    orthostatic: { title: 'Orthostatic tremor', body: '13–18 Hz tremor of the legs only while standing still. Unsteadiness relieved by walking or sitting. Often felt better than seen.' },
    camptocormia: { title: 'Camptocormia', body: 'Marked forward trunk flexion on standing that corrects supine. Parkinsonism or axial myopathy. The supine test separates it from fixed deformity.' },
    pisa: { title: 'Pisa syndrome', body: 'Sustained lateral trunk flexion. Axial dystonia, often drug-related or part of PD. Usually better lying down.' },
    freezing: { title: 'Freezing', body: 'Brief motor block. Feet glued at start, turn, doorway, or target.' },
    festination: { title: 'Festination', body: 'Involuntary hurrying into shorter, faster steps as the trunk outruns the feet.' },
    handedness: { title: 'Handedness', body: 'Usual writing hand. Helps interpret asymmetric tremor and reduced arm swing.' },
    decrement: { title: 'Decrement', body: 'Amplitude or speed falling across a repetitive task. The defining feature of bradykinesia. Cerebellar rhythm is irregular without true decrement. Functional slowness is effortful and does not decrement.' },
    stickiness: { title: 'Hesitations and arrests', body: 'Gluey initiation, pauses, or freezing of a repetitive tap. Score this separately from raw rate.' }
  };

  var PHYSIOLOGY = {
    circuit: { title: 'Why the basal ganglia make these movements', body: 'The direct pathway (D1) facilitates wanted movement. The indirect pathway (D2) suppresses unwanted movement. The subthalamic nucleus is a brake. Psychiatry sees this circuit from the drug side: dopamine D2 blockade, dopamine excess, and serotonin or lithium effects on the same loops.' },
    acuteDystonia: { title: 'Acute dystonia — hours to a few days', body: 'Nigrostriatal D2 blockade tips the balance toward the indirect pathway. The result is patterned, often painful spasm: oculogyric crisis, torticollis, trismus, laryngospasm. Young men and high-potency first-generation antipsychotics are the classic setting. This is a dystonia, not a seizure and not a gaze palsy.' },
    akathisia: { title: 'Akathisia — days', body: 'A subjective compulsion to move, often blamed on the ventral striatum and its connections, not on chorea. The patient cannot sit. The movements are semi-purposeful (rocking, pacing, crossing the legs) and ease briefly when they move. Rate the inner restlessness, not just the fidget.' },
    parkinsonism: { title: 'Drug-induced parkinsonism — days to weeks', body: 'D2 blockade in the dorsal striatum reproduces the hypokinetic triad: bradykinesia with decrement, rigidity (lead-pipe, sometimes cogwheel), and rest tremor. It is often symmetric. Rabbit syndrome — a 5 Hz vertical perioral tremor that spares the tongue — belongs here, not with tardive dyskinesia, and may respond to anticholinergics.' },
    tardive: { title: 'Tardive syndromes — months to years', body: 'Chronic D2 blockade is thought to leave the striatum supersensitive. The classic picture is orolingual stereotypy and chorea: tongue rolling in the mouth, bon-bon sign, lip smacking, piano-playing fingers or toes. Tardive dystonia is patterned and may look like idiopathic cranial or cervical dystonia. Time course and drug history do the work.' },
    lithium: { title: 'Lithium, valproate, and serotonin', body: 'Lithium and valproate produce a postural action tremor, usually fine and faster than parkinsonian rest tremor. SSRIs can do the same and can worsen myoclonus. These are activation-classified tremors. Do not call a lithium tremor a tardive movement.' },
    clock: { title: 'The EPS clock', body: 'Hours: acute dystonia. Days: akathisia. Days to weeks: parkinsonism. Months to years: tardive dyskinesia or tardive dystonia. The clock is a hypothesis, not a diagnosis. A new orolingual movement after ten years of an antipsychotic is tardive until you describe it and find otherwise.' }
  };
  var PHYSIOLOGY_ORDER = ['circuit', 'clock', 'acuteDystonia', 'akathisia', 'parkinsonism', 'tardive', 'lithium'];

  // ======================================================================
  // LOGIC — classifier (ported verbatim from lib/atlas/classify.ts)
  // ======================================================================
  function tremorSubtype(o) {
    var a = {};
    o.activations.forEach(function (x) { a[x] = true; });
    if (o.modifiers.indexOf('latency') !== -1 && a.postural) {
      return { label: 're-emergent rest tremor', reason: 'A postural tremor that appears after several seconds is the rest oscillator of parkinsonism, not essential tremor.' };
    }
    if (a.rest && !a.kinetic && !a.intention) {
      return { label: 'rest tremor', reason: 'Present when the part is supported and quiet — the activation that maps to parkinsonism.' };
    }
    if (a.intention) {
      return { label: 'intention tremor', reason: 'Crescendo as the target is neared is a cerebellar-outflow sign.' };
    }
    if (a.on_standing) {
      return { label: 'orthostatic tremor', reason: 'A very fast tremor only on standing, relieved by walking or sitting.' };
    }
    if (a.task_specific && !a.postural && !a.rest) {
      return { label: 'task-specific tremor', reason: 'Present only during a skilled act such as writing.' };
    }
    if (a.postural || a.kinetic) {
      return { label: 'action tremor', reason: 'Present on posture or during movement — the activation that maps to essential and enhanced physiologic tremor.' };
    }
    return null;
  }

  function classifyObservation(o) {
    if (!o.present) return null;
    var reasons = [];
    if (o.control.indexOf('distractible') !== -1 || o.control.indexOf('entrainable') !== -1) {
      reasons.push('Distractibility or entrainment is a positive functional sign and can override the pattern.');
      return { category: 'functional', confidence: 'possible', reasons: reasons };
    }
    if (o.modifiers.indexOf('decrement') !== -1) {
      reasons.push('Progressive decrement on repetition is the defining motor feature of bradykinesia.');
      return { category: 'bradykinesia', confidence: 'high', reasons: reasons };
    }
    if (o.rhythmicity === 'rhythmic' && (o.pattern === 'fixed_axis' || o.pattern == null)) {
      var subtype = tremorSubtype(o);
      reasons.push('Rhythmic oscillation about a point is tremor — the only truly rhythmic hyperkinesia.');
      if (subtype) reasons.push(subtype.reason);
      return { category: 'tremor', confidence: o.pattern === 'fixed_axis' ? 'high' : 'possible', subtype: subtype ? subtype.label : undefined, reasons: reasons };
    }
    if (o.speed === 'shock' || o.pattern === 'shock_like') {
      if (o.modifiers.indexOf('stimulus_sensitive') !== -1) {
        reasons.push('Lightning-fast jerks that are stimulus-sensitive point to reflex myoclonus.');
      } else {
        reasons.push('A shock-like jerk with pauses between beats is myoclonus, not an oscillation.');
      }
      return { category: 'myoclonus', confidence: 'high', reasons: reasons };
    }
    if (o.pattern === 'random_migrating' && o.rhythmicity !== 'rhythmic') {
      if (o.amplitude === 'flinging') {
        reasons.push('Random flowing movement that is proximal and flinging is ballism — chorea turned up.');
        return { category: 'ballism', confidence: 'high', reasons: reasons };
      }
      reasons.push('Irregular, unpredictable movements that flow from part to part are chorea.');
      return { category: 'chorea', confidence: 'high', reasons: reasons };
    }
    if (o.speed === 'writhing') {
      if (o.modifiers.indexOf('eyes_closed_worse') !== -1) {
        reasons.push('Writhing that appears or worsens with eyes closed is pseudoathetosis until proprioception is proven intact.');
        return { category: 'athetosis', confidence: 'possible', subtype: 'consider pseudoathetosis', reasons: reasons };
      }
      reasons.push('Slow distal writhing is athetosis — modern usage treats it as mobile distal dystonia.');
      return { category: 'athetosis', confidence: 'high', reasons: reasons };
    }
    if (o.pattern === 'patterned_directional' || o.rhythmicity === 'sustained' || o.control.indexOf('sensory_trick') !== -1) {
      reasons.push('The same muscles pulling the same direction, especially if a light touch helps, is dystonia.');
      return { category: 'dystonia', confidence: (o.control.indexOf('sensory_trick') !== -1 || o.pattern === 'patterned_directional') ? 'high' : 'possible', reasons: reasons };
    }
    if (o.pattern === 'stereotyped' && o.control.indexOf('suppressible_with_urge') !== -1) {
      reasons.push('A stereotyped movement with a premonitory urge, suppressibility, and rebound is a tic.');
      return { category: 'tic', confidence: 'high', reasons: reasons };
    }
    if (o.pattern === 'stereotyped') {
      reasons.push('A fixed, repetitive, purposeless pattern without an urge is a stereotypy.');
      return { category: 'stereotypy', confidence: 'possible', reasons: reasons };
    }
    if (o.rhythmicity === 'rhythmic' && (o.speed === 'slow' || (o.frequencyHz != null && o.frequencyHz <= 4))) {
      reasons.push('A slow (1–4 Hz) rhythmic cranial or limb movement is myorhythmia, not ordinary tremor.');
      return { category: 'myorhythmia', confidence: 'possible', reasons: reasons };
    }
    if (o.amplitude === 'fine' && o.rhythmicity === 'irregular') {
      reasons.push('Fine irregular flickering that does not move a joint is often fasciculation.');
      return { category: 'fasciculation', confidence: 'possible', reasons: reasons };
    }
    reasons.push('The seven axes are incomplete or mixed. Describe what you see; do not force a label.');
    return { category: 'uncertain', confidence: 'possible', reasons: reasons };
  }

  // ======================================================================
  // LOGIC — chart note (ported verbatim from lib/note.ts)
  // ======================================================================
  function join(parts, sep) {
    if (sep == null) sep = ', ';
    return parts.filter(Boolean).join(sep);
  }
  function list(items) {
    if (items.length === 0) return '';
    if (items.length === 1) return items[0];
    if (items.length === 2) return items[0] + ' and ' + items[1];
    return items.slice(0, -1).join(', ') + ', and ' + items[items.length - 1];
  }
  function lateralityWord(o, style) {
    if (!o.laterality || o.laterality === 'none') return '';
    if (style === 'side') return labelOf(TONGUE_LATERALITIES, o.laterality).toLowerCase();
    return labelOf(LATERALITIES, o.laterality).toLowerCase();
  }
  function describeObservation(region, o, lateralityStyle) {
    if (!lateralityStyle) lateralityStyle = 'limb';
    if (!o.present) return null;
    var side = lateralityWord(o, lateralityStyle);
    var rhythm = labelOf(RHYTHMICITY, o.rhythmicity).toLowerCase();
    var speed = labelOf(SPEEDS, o.speed).toLowerCase();
    var amplitude = labelOf(AMPLITUDES, o.amplitude).toLowerCase();
    var pattern = labelOf(PATTERNS, o.pattern).toLowerCase();
    var activations = list(o.activations.map(function (id) { return labelOf(ACTIVATIONS, id).toLowerCase(); }));
    var control = list(o.control.map(function (id) { return labelOf(CONTROLS, id).toLowerCase(); }));
    var hz = o.frequencyHz != null
      ? (o.frequencySource === 'tap-along' ? o.frequencyHz + ' Hz by clinician tap-along' : o.frequencyHz + ' Hz')
      : '';
    var core = join([
      amplitude ? amplitude + '-amplitude' : '',
      speed && speed !== 'medium' ? speed : '',
      rhythm || 'abnormal',
      pattern ? pattern : ''
    ], ' ');
    var where = join([side, region], ' ');
    var when = activations ? 'present ' + activations : '';
    var extras = join([control, hz, o.notes.trim()], '; ');
    var sentence = join(['' + core + ' movement of the ' + where, when, extras], ', ').replace(/\s+/g, ' ');
    var classified = classifyObservation(o);
    var category = o.clinicianCategory || (classified ? classified.category : null);
    var subtype = classified ? classified.subtype : undefined;
    var categoryLabel = category ? labelOf(CATEGORIES, category).toLowerCase() : '';
    var inference = categoryLabel
      ? 'Signature consistent with ' + (subtype ? categoryLabel + ' (' + subtype + ')' : categoryLabel) + '.'
      : '';
    return join([sentence.charAt(0).toUpperCase() + sentence.slice(1), inference], ' ');
  }
  function positiveSigns(signs, defs) {
    return defs.filter(function (i) { return signs[i.id]; }).map(function (i) { return i.label; });
  }
  function bradyLine(side, tap) {
    if (tap.speed + tap.decrement + tap.hesitations + tap.opening === 0 && tap.tapsPerSec == null) return null;
    var bits = [
      tap.speed ? 'speed ' + severityLabel(tap.speed).toLowerCase() : '',
      tap.decrement ? 'decrement ' + severityLabel(tap.decrement).toLowerCase() : '',
      tap.hesitations ? 'hesitations ' + severityLabel(tap.hesitations).toLowerCase() : '',
      tap.opening ? 'opening ' + severityLabel(tap.opening).toLowerCase() : '',
      tap.tapsPerSec != null ? tap.tapsPerSec + ' taps/s' : '',
      tap.notes.trim()
    ];
    return 'Finger tapping, ' + side + ': ' + join(bits, '; ');
  }
  function genderWord(exam) {
    var g = GENDERS.filter(function (i) { return i.id === exam.intake.gender; })[0];
    return g ? g.label.toLowerCase() : '';
  }
  function handedWord(exam) {
    var id = exam.intake.handedness;
    if (id === 'right') return 'right-handed';
    if (id === 'left') return 'left-handed';
    if (id === 'ambidextrous') return 'ambidextrous';
    return '';
  }
  function patientLine(exam) {
    var age = exam.intake.age.trim();
    var gender = genderWord(exam);
    var hand = handedWord(exam);
    var unspecified = !gender || exam.intake.gender === 'unspecified';
    if (age && !unspecified) return join([age + '-year-old ' + gender, hand]);
    if (age) return join([age + '-year-old', hand]);
    if (!unspecified) return join([gender, hand]);
    return hand;
  }
  function contextLine(exam) {
    var s = SETTINGS.filter(function (i) { return i.id === exam.intake.setting; })[0];
    var setting = s ? s.label : exam.intake.setting;
    var clock = exam.intake.timeCourse !== 'unknown' ? 'time course ' + exam.intake.timeCourse : '';
    var drugs = [
      exam.intake.dopamineAntagonist ? 'dopamine antagonist exposure' : '',
      exam.intake.moodStabilizer ? 'lithium or valproate' : '',
      exam.intake.medications.trim() ? 'medications: ' + exam.intake.medications.trim() : ''
    ];
    return join([setting, clock, join(drugs, '; '), exam.intake.onsetContext.trim(), exam.intake.familyHistory.trim()], '. ');
  }
  function examinerLine(exam) {
    var initials = exam.intake.examinerInitials.trim();
    var credential = exam.intake.examinerCredential;
    var credentialLabel = '';
    if (credential === 'other') {
      var detail = exam.intake.examinerOther.trim();
      credentialLabel = detail ? 'Other (' + detail + ')' : 'Other';
    } else if (credential !== 'unspecified') {
      var c = EXAMINER_CREDENTIALS.filter(function (i) { return i.id === credential; })[0];
      credentialLabel = c ? c.label : '';
    }
    if (!initials && !credentialLabel) return 'Completed by: not recorded.';
    if (initials && credentialLabel) return 'Completed by: ' + initials + ', ' + credentialLabel + '.';
    if (initials) return 'Completed by: ' + initials + '.';
    return 'Completed by: ' + credentialLabel + '.';
  }
  function section(title, lines, signLabels, notes) {
    var body = lines.filter(Boolean);
    if (signLabels.length) body.push('Named signs: ' + list(signLabels).toLowerCase() + '.');
    if (notes.trim()) body.push(notes.trim());
    if (body.length === 0) return [];
    return [title + ':'].concat(body.map(function (i) { return '• ' + i; }));
  }
  function regionSection(title, skipped, lines, signLabels, notes) {
    if (skipped) return [title + ': not examined; this section was skipped.'];
    var body = section(title, lines, signLabels, notes);
    if (body.length === 0) return [title + ': examined; no abnormal involuntary movement documented.'];
    return body;
  }
  function buildClinicalNote(exam) {
    var who = patientLine(exam);
    var examiner = examinerLine(exam);
    var context = contextLine(exam);
    var regionBlocks = [exam.eyes, exam.tongue, exam.mouth, exam.face, exam.hands, exam.arms, exam.neck, exam.feet, exam.trunk, exam.gait];
    var skippedCount = regionBlocks.filter(function (b) { return b.skipped; }).length;
    var blocks = [];
    blocks = blocks.concat(regionSection('Eyes and lids', exam.eyes.skipped,
      [describeObservation('eyes and lids', exam.eyes.observation)],
      positiveSigns(exam.eyes.signs, EYE_SIGNS), exam.eyes.notes));
    blocks = blocks.concat(regionSection('Tongue', exam.tongue.skipped,
      [describeObservation('tongue', exam.tongue.rest, 'side'), describeObservation('tongue on protrusion', exam.tongue.protrusion, 'side')],
      positiveSigns(exam.tongue.signs, TONGUE_SIGNS), exam.tongue.notes));
    blocks = blocks.concat(regionSection('Mouth, jaw, and voice', exam.mouth.skipped,
      [describeObservation('mouth and jaw', exam.mouth.observation)],
      positiveSigns(exam.mouth.signs, MOUTH_SIGNS), exam.mouth.notes));
    blocks = blocks.concat(regionSection('Face', exam.face.skipped,
      [describeObservation('face', exam.face.observation)],
      positiveSigns(exam.face.signs, FACE_SIGNS), exam.face.notes));
    blocks = blocks.concat(regionSection('Hands', exam.hands.skipped,
      [
        describeObservation('hand at rest', exam.hands.rest),
        describeObservation('hand on posture', exam.hands.postural),
        describeObservation('hand on action', exam.hands.kinetic),
        bradyLine('right', exam.hands.tapping.right),
        bradyLine('left', exam.hands.tapping.left),
        exam.hands.rigidity
          ? 'Rigidity ' + severityLabel(exam.hands.rigidity).toLowerCase() + (exam.hands.cogwheel ? ', cogwheeling' : '')
          : (exam.hands.cogwheel ? 'Cogwheeling' : null)
      ],
      positiveSigns(exam.hands.signs, HAND_SIGNS), exam.hands.notes));
    blocks = blocks.concat(regionSection('Arms', exam.arms.skipped,
      [describeObservation('arm', exam.arms.observation)],
      positiveSigns(exam.arms.signs, ARM_SIGNS), exam.arms.notes));
    blocks = blocks.concat(regionSection('Neck and head', exam.neck.skipped,
      [describeObservation('neck and head', exam.neck.observation)],
      positiveSigns(exam.neck.signs, NECK_SIGNS), exam.neck.notes));
    blocks = blocks.concat(regionSection('Feet and legs', exam.feet.skipped,
      [
        describeObservation('foot seated', exam.feet.seated),
        describeObservation('leg on standing', exam.feet.standing),
        bradyLine('right foot', exam.feet.tapping.right),
        bradyLine('left foot', exam.feet.tapping.left)
      ],
      positiveSigns(exam.feet.signs, FOOT_SIGNS), exam.feet.notes));
    blocks = blocks.concat(regionSection('Trunk', exam.trunk.skipped,
      [describeObservation('trunk', exam.trunk.observation)],
      positiveSigns(exam.trunk.signs, TRUNK_SIGNS), exam.trunk.notes));
    blocks = blocks.concat(regionSection('Gait', exam.gait.skipped,
      [
        describeObservation('gait', exam.gait.observation),
        exam.gait.armSwing === 'left' ? 'Reduced left arm swing'
          : exam.gait.armSwing === 'right' ? 'Reduced right arm swing'
            : exam.gait.armSwing === 'bilateral' ? 'Reduced arm swing bilaterally' : null,
        exam.gait.stepsToTurn != null ? exam.gait.stepsToTurn + ' steps to turn' : null,
        exam.gait.pullSteps != null ? 'Pull test: ' + exam.gait.pullSteps + ' retropulsive steps' : null,
        exam.gait.fallsRisk ? 'Falls risk ' + severityLabel(exam.gait.fallsRisk).toLowerCase() : null
      ],
      positiveSigns(exam.gait.signs, GAIT_SIGNS), exam.gait.notes));

    var header = ['MOVEMENT EXAM', who, examiner, context].filter(Boolean).join('\n');
    var body = blocks.length > 0
      ? blocks.join('\n')
      : 'No abnormal involuntary movements documented on this analog exam. Gait not remarkable.';
    var footer = join([
      skippedCount === 10
        ? 'No regional station was examined. Every listed region was skipped.'
        : skippedCount > 0
          ? 'Skipped regions were not examined and are listed as such above. They must not be read as normal. Examined regions without findings are documented as examined and quiet.'
          : 'Examined regions without findings are documented as examined and quiet.',
      'Categories are signature matches from the seven descriptive axes, not etiologic diagnoses.',
      'Voice was described analogously; no audio was recorded. Machine vision was not used.',
      exam.impression.trim() ? 'Impression: ' + exam.impression.trim() : ''
    ], ' ');
    return [header, '', body, '', footer].join('\n').replace(/\n{3,}/g, '\n\n').trim();
  }

  // ======================================================================
  // LOGIC — finger-tap analysis (ported from lib/analysis/finger-tap.ts)
  // ======================================================================
  function mean(values) {
    if (values.length === 0) return 0;
    return values.reduce(function (s, v) { return s + v; }, 0) / values.length;
  }
  function analyzeFingerTaps(tapTimesMs, durationSec) {
    var ordered = tapTimesMs.slice().sort(function (a, b) { return a - b; });
    var tapCount = ordered.length;
    var tapsPerSec = (durationSec > 0 && tapCount > 0) ? Math.round((tapCount / durationSec) * 10) / 10 : null;
    var intervals = [];
    for (var i = 1; i < ordered.length; i++) {
      var gap = ordered[i] - ordered[i - 1];
      if (gap > 0) intervals.push(gap);
    }
    var intervalCv = null;
    if (intervals.length >= 2) {
      var m = mean(intervals);
      if (m > 0) {
        var variance = mean(intervals.map(function (v) { return (v - m) * (v - m); }));
        intervalCv = Math.round((Math.sqrt(variance) / m) * 1000) / 1000;
      }
    }
    var slowingRatio = null;
    if (tapCount >= 4 && durationSec >= 6) {
      var earlyMs = 3000;
      var lateStartMs = (durationSec - 3) * 1000;
      var early = ordered.filter(function (t) { return t < earlyMs; }).length;
      var late = ordered.filter(function (t) { return t >= lateStartMs; }).length;
      if (early > 0) slowingRatio = Math.round((late / early) * 100) / 100;
    }
    return { tapCount: tapCount, durationSec: durationSec, tapsPerSec: tapsPerSec, intervalCv: intervalCv, slowingRatio: slowingRatio };
  }

  // ======================================================================
  // MODEL — exam defaults (ported from lib/exam-defaults.ts)
  // ======================================================================
  function emptyObservation(activations) {
    return {
      present: false, rhythmicity: null, speed: null, amplitude: null, spread: null,
      laterality: 'none', activations: activations ? activations.slice() : [], control: [],
      pattern: null, modifiers: [], frequencyHz: null, frequencySource: null, notes: '', clinicianCategory: null
    };
  }
  function emptySigns(defs) {
    var o = {};
    defs.forEach(function (d) { o[d.id] = false; });
    return o;
  }
  function emptyBrady() {
    return { speed: 0, decrement: 0, hesitations: 0, opening: 0, tapsPerSec: null, intervalCv: null, slowingRatio: null, tapCount: null, notes: '' };
  }
  function emptyRegion(activations, defs) {
    return { skipped: false, observation: emptyObservation(activations), signs: emptySigns(defs || []), notes: '' };
  }
  function emptyIntake() {
    return {
      age: '', gender: 'unspecified', handedness: 'unspecified', setting: 'clinic', medications: '',
      onsetContext: '', timeCourse: 'unknown', dopamineAntagonist: false, moodStabilizer: false,
      familyHistory: '', examinerInitials: '', examinerCredential: 'unspecified', examinerOther: ''
    };
  }
  function uuid() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) { try { return crypto.randomUUID(); } catch (e) {} }
    return 'mda-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9);
  }
  function createExam() {
    var now = new Date().toISOString();
    return {
      id: uuid(), createdAt: now, updatedAt: now, status: 'in_progress', schemaVersion: 2,
      intake: emptyIntake(),
      eyes: emptyRegion([], EYE_SIGNS),
      tongue: { skipped: false, rest: emptyObservation(['rest']), protrusion: emptyObservation(['on_protrusion']), signs: emptySigns(TONGUE_SIGNS), notes: '' },
      mouth: emptyRegion(['rest'], MOUTH_SIGNS),
      face: emptyRegion(['rest'], FACE_SIGNS),
      hands: { skipped: false, rest: emptyObservation(['rest']), postural: emptyObservation(['postural']), kinetic: emptyObservation(['kinetic']), tapping: { left: emptyBrady(), right: emptyBrady() }, rigidity: 0, cogwheel: false, signs: emptySigns(HAND_SIGNS), notes: '' },
      arms: emptyRegion(['postural'], ARM_SIGNS),
      neck: emptyRegion(['rest'], NECK_SIGNS),
      feet: { skipped: false, seated: emptyObservation(['rest']), standing: emptyObservation(['on_standing']), tapping: { left: emptyBrady(), right: emptyBrady() }, signs: emptySigns(FOOT_SIGNS), notes: '' },
      trunk: emptyRegion(['on_standing'], TRUNK_SIGNS),
      gait: { skipped: false, observation: emptyObservation(['kinetic']), signs: emptySigns(GAIT_SIGNS), armSwing: 'none', stepsToTurn: null, pullSteps: null, fallsRisk: 0, notes: '' },
      impression: ''
    };
  }
  function normalizeInitials(v) {
    return (v || '').replace(/[^A-Za-z.\s-]/g, '').toUpperCase().slice(0, 8);
  }

  // Expose the pure engine for verification/testing.
  var ENGINE = {
    classifyObservation: classifyObservation, describeObservation: describeObservation,
    buildClinicalNote: buildClinicalNote, patientLine: patientLine, examinerLine: examinerLine,
    createExam: createExam, emptyObservation: emptyObservation, normalizeInitials: normalizeInitials,
    analyzeFingerTaps: analyzeFingerTaps
  };
  if (typeof module !== 'undefined' && module.exports) { module.exports = ENGINE; }
  if (typeof window !== 'undefined') { window.MDAEngine = ENGINE; }

  // The UI layer is attached in the second half of this file.
  if (typeof document === 'undefined') return;

  // ======================================================================
  // UI — DOM helpers
  // ======================================================================
  function el(tag, props, children) {
    var node = document.createElement(tag);
    if (props) {
      Object.keys(props).forEach(function (k) {
        if (k === 'class') node.className = props[k];
        else if (k === 'text') node.textContent = props[k];
        else if (k === 'html') node.innerHTML = props[k];
        else if (k === 'dataset') { Object.keys(props[k]).forEach(function (d) { node.dataset[d] = props[k][d]; }); }
        else if (k.slice(0, 2) === 'on' && typeof props[k] === 'function') node.addEventListener(k.slice(2).toLowerCase(), props[k]);
        else if (props[k] != null) node.setAttribute(k, props[k]);
      });
    }
    if (children != null) {
      (Array.isArray(children) ? children : [children]).forEach(function (c) {
        if (c == null) return;
        node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
      });
    }
    return node;
  }

  // Close every open help popover in the tool.
  function closeAllHelp() {
    if (!root) return;
    var open = root.querySelectorAll('.mda-help-detail');
    for (var i = 0; i < open.length; i++) open[i].hidden = true;
    var btns = root.querySelectorAll('.mda-help-btn');
    for (var j = 0; j < btns.length; j++) btns[j].setAttribute('aria-expanded', 'false');
  }

  // A "?" help affordance that toggles an inline glossary blurb. Only one is
  // ever open at a time, and a click anywhere else dismisses it.
  function helpButton(termId) {
    if (!termId || !GLOSSARY[termId]) return null;
    var g = GLOSSARY[termId];
    var detail = el('div', { class: 'mda-help-detail', hidden: 'hidden' }, [
      el('strong', { text: g.title }), el('span', { text: ' — ' + g.body })
    ]);
    // Clicks inside the blurb (e.g. selecting text) must not dismiss it.
    detail.addEventListener('click', function (e) { e.stopPropagation(); });
    var btn = el('button', {
      type: 'button', class: 'mda-help-btn', 'aria-label': 'What is ' + g.title + '?', 'aria-expanded': 'false', text: '?',
      onclick: function (e) {
        e.preventDefault(); e.stopPropagation();
        var willOpen = detail.hidden;   // was closed -> open it
        closeAllHelp();
        detail.hidden = !willOpen;
        btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      }
    });
    var wrap = el('span', { class: 'mda-help' }, [btn, detail]);
    return wrap;
  }

  function labelWithHelp(text, termId) {
    var h = helpButton(termId);
    return el('span', { class: 'mda-axis-label' }, h ? [document.createTextNode(text + ' '), h] : [text]);
  }

  // ======================================================================
  // UI — control builders
  // ======================================================================
  // Single- or multi-select chip group. getSel()/onToggle keep state.
  function chipGroup(options, isOn, onToggle) {
    var wrap = el('div', { class: 'mda-chips' });
    options.forEach(function (opt) {
      var chip = el('button', {
        type: 'button', class: 'mda-chip' + (isOn(opt.id) ? ' mda-chip-on' : ''),
        title: opt.hint || '', 'aria-pressed': isOn(opt.id) ? 'true' : 'false',
        onclick: function () { onToggle(opt.id); refresh(); }
      }, [opt.label]);
      wrap.appendChild(chip);
    });
    function refresh() {
      var chips = wrap.querySelectorAll('.mda-chip');
      options.forEach(function (opt, i) {
        var on = isOn(opt.id);
        chips[i].classList.toggle('mda-chip-on', on);
        chips[i].setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }
    wrap._refresh = refresh;
    return wrap;
  }

  function singleChips(options, obj, key, onChange) {
    return chipGroup(options, function (id) { return obj[key] === id; }, function (id) {
      obj[key] = (obj[key] === id) ? null : id;
      onChange();
    });
  }
  function multiChips(options, arr, onChange) {
    return chipGroup(options, function (id) { return arr.indexOf(id) !== -1; }, function (id) {
      var i = arr.indexOf(id);
      if (i === -1) arr.push(id); else arr.splice(i, 1);
      onChange();
    });
  }
  function lateralityChips(options, obj, onChange) {
    return chipGroup(options, function (id) { return obj.laterality === id; }, function (id) {
      obj.laterality = (obj.laterality === id) ? 'none' : id;
      onChange();
    });
  }

  function severityScale(value, onChange) {
    var wrap = el('div', { class: 'mda-sev' });
    SEVERITY.forEach(function (item) {
      var b = el('button', {
        type: 'button',
        class: 'mda-sev-btn' + (value() === item.id ? ' mda-sev-on' : '') + (item.id >= 3 ? ' mda-sev-high' : ''),
        onclick: function () { onChange(item.id); refresh(); }
      }, [el('span', { class: 'mda-sev-num', text: item.label }), el('span', { class: 'mda-sev-full', text: item.full })]);
      wrap.appendChild(b);
    });
    function refresh() {
      var btns = wrap.querySelectorAll('.mda-sev-btn');
      SEVERITY.forEach(function (item, i) { btns[i].classList.toggle('mda-sev-on', value() === item.id); });
    }
    return wrap;
  }

  function toggleRow(opts) {
    var checked = opts.checked;
    var knob = el('span', { class: 'mda-switch-knob' });
    var sw = el('span', { class: 'mda-switch' + (checked ? ' mda-switch-on' : '') }, [knob]);
    var labelSpan = el('span', { class: 'mda-toggle-text' }, [
      el('span', { class: 'mda-toggle-label' }, opts.term ? [document.createTextNode(opts.label + ' '), helpButton(opts.term)] : [opts.label]),
      opts.hint ? el('span', { class: 'mda-toggle-hint', text: opts.hint }) : null
    ]);
    var row = el('button', {
      type: 'button', class: 'mda-toggle' + (checked ? ' mda-toggle-on' : ''), 'aria-pressed': checked ? 'true' : 'false',
      onclick: function () {
        checked = !checked;
        row.classList.toggle('mda-toggle-on', checked);
        sw.classList.toggle('mda-switch-on', checked);
        row.setAttribute('aria-pressed', checked ? 'true' : 'false');
        opts.onChange(checked);
      }
    }, [labelSpan, sw]);
    return row;
  }

  function field(labelText, control, termId) {
    return el('div', { class: 'mda-field' }, [
      el('div', { class: 'mda-field-label' }, termId ? [document.createTextNode(labelText + ' '), helpButton(termId)] : [labelText]),
      control
    ]);
  }

  function textInput(value, onInput, placeholder, opts) {
    opts = opts || {};
    var input = el('input', {
      type: opts.type || 'text', class: 'mda-input', value: value || '', placeholder: placeholder || '',
      inputmode: opts.inputmode || null, maxlength: opts.maxlength || null,
      oninput: function () { onInput(input.value); }
    });
    return input;
  }
  function textArea(value, onInput, placeholder) {
    var ta = el('textarea', { class: 'mda-textarea', rows: '2', placeholder: placeholder || '', oninput: function () { onInput(ta.value); } });
    ta.value = value || '';
    return ta;
  }
  function selectInput(options, value, onChange) {
    var sel = el('select', { class: 'mda-select', onchange: function () { onChange(sel.value); } });
    options.forEach(function (o) {
      var opt = el('option', { value: o.id, text: o.label });
      if (o.id === value) opt.selected = 'selected';
      sel.appendChild(opt);
    });
    return sel;
  }

  // Live signature hint for one observation.
  function signatureHint() {
    var box = el('div', { class: 'mda-signature', hidden: 'hidden' });
    box.update = function (obs) {
      if (!obs || !obs.present) { box.hidden = true; return; }
      var c = classifyObservation(obs);
      if (!c) { box.hidden = true; return; }
      box.hidden = false;
      box.innerHTML = '';
      box.appendChild(el('div', { class: 'mda-sig-tag', text: 'Signature match · ' + c.confidence }));
      box.appendChild(el('div', { class: 'mda-sig-cat', text: labelOf(CATEGORIES, c.category) + (c.subtype ? ' · ' + c.subtype : '') }));
      var ul = el('ul', { class: 'mda-sig-reasons' });
      c.reasons.forEach(function (r) { ul.appendChild(el('li', { text: r })); });
      box.appendChild(ul);
      box.appendChild(el('p', { class: 'mda-sig-foot', text: 'A category, not a diagnosis. Drugs, time course, and associated signs still decide etiology.' }));
    };
    return box;
  }

  // Full seven-axis form for a single observation object.
  function observationForm(obs, opts) {
    opts = opts || {};
    var hint = signatureHint();
    function changed() { hint.update(obs); markDirty(); }

    var lateralityOptions = opts.lateralityStyle === 'side' ? TONGUE_LATERALITIES : LATERALITIES;
    var freqInput = textInput(obs.frequencyHz != null ? String(obs.frequencyHz) : '', function (v) {
      var n = parseFloat(v);
      obs.frequencyHz = (v.trim() === '' || isNaN(n)) ? null : n;
      obs.frequencySource = obs.frequencyHz != null ? 'observed' : null;
      if (freqTap) freqTap.refreshNote();
      changed();
    }, 'Hz', { type: 'number', inputmode: 'decimal' });
    var freqTap = freqTapAlong(obs, freqInput, changed);
    var freqRow = el('div', { class: 'mda-freq' }, [
      el('div', { class: 'mda-tap-hint', text: 'Type the frequency, or tap once per beat for 15 seconds and the Hz is counted for you.' }),
      el('div', { class: 'mda-freq-input-row' }, [freqInput, freqTap.startBtn]),
      freqTap.pad,
      freqTap.note
    ]);

    var fields = [
      field('Rhythmicity', singleChips(RHYTHMICITY, obs, 'rhythmicity', changed), 'rhythmicity'),
      field('Speed', singleChips(SPEEDS, obs, 'speed', changed), 'speed'),
      field('Amplitude', singleChips(AMPLITUDES, obs, 'amplitude', changed), 'amplitude'),
      field('Distribution', singleChips(SPREADS, obs, 'spread', changed), 'spread'),
      field(opts.lateralityStyle === 'side' ? 'Side' : 'Laterality', lateralityChips(lateralityOptions, obs, changed))
    ];
    if (opts.showActivations) {
      fields.push(field('Activation', multiChips(LIMB_ACTIVATIONS, obs.activations, changed), 'activation'));
    }
    fields.push(field('Suppressibility', multiChips(CONTROLS, obs.control, changed), 'control'));
    fields.push(field('Direction & pattern', singleChips(PATTERNS, obs, 'pattern', changed), 'pattern'));
    fields.push(field('Modifiers', multiChips(MODIFIERS, obs.modifiers, changed)));
    fields.push(field('Frequency (optional)', freqRow, 'tremor'));
    fields.push(field('Override category (optional)', selectInput(
      [{ id: '', label: 'Let the axes decide' }].concat(CATEGORIES),
      obs.clinicianCategory || '',
      function (v) { obs.clinicianCategory = v || null; changed(); }
    )));
    fields.push(field('Notes', textArea(obs.notes, function (v) { obs.notes = v; markDirty(); }, 'Anything the chips do not capture')));
    fields.push(hint);

    var body = el('div', { class: 'mda-obs-body' + (obs.present ? '' : ' mda-hidden') }, fields);
    hint.update(obs);

    var presentToggle = toggleRow({
      label: opts.presentLabel || 'Abnormal movement present',
      hint: opts.presentHint || 'Turn on to describe it on the seven axes',
      checked: obs.present,
      onChange: function (v) { obs.present = v; body.classList.toggle('mda-hidden', !v); hint.update(obs); markDirty(); }
    });

    return el('div', { class: 'mda-obs' }, [
      opts.title ? el('div', { class: 'mda-obs-title', text: opts.title }) : null,
      presentToggle,
      body
    ]);
  }

  // Named-signs checklist.
  function signsChecklist(signsObj, defs) {
    var wrap = el('div', { class: 'mda-signs' });
    defs.forEach(function (d) {
      var cb = el('input', { type: 'checkbox', class: 'mda-sign-cb', id: 'mda-sign-' + d.id });
      if (signsObj[d.id]) cb.checked = true;
      cb.addEventListener('change', function () { signsObj[d.id] = cb.checked; markDirty(); });
      var item = el('label', { class: 'mda-sign', for: 'mda-sign-' + d.id }, [
        cb,
        el('span', { class: 'mda-sign-text' }, [
          el('span', { class: 'mda-sign-label' }, d.term ? [document.createTextNode(d.label + ' '), helpButton(d.term)] : [d.label]),
          el('span', { class: 'mda-sign-hint', text: d.hint })
        ])
      ]);
      wrap.appendChild(item);
    });
    return wrap;
  }

  // Bradykinesia battery for one side.
  function bradyPanel(tap, side, bodyPart) {
    var task = bodyPart === 'hand' ? 'thumb to index, as fast and as wide as possible'
      : 'heel or toe tapping, as fast and as wide as possible';
    var rows = [
      el('p', { class: 'mda-muted', text: 'Watch the ' + side + ' ' + bodyPart + ': ' + task + '. Score decrement separately from raw rate.' }),
      field('Speed', severityScale(function () { return tap.speed; }, function (v) { tap.speed = v; markDirty(); }), 'bradykinesia'),
      field('Decrement', severityScale(function () { return tap.decrement; }, function (v) { tap.decrement = v; markDirty(); }), 'decrement'),
      field('Hesitations / arrests', severityScale(function () { return tap.hesitations; }, function (v) { tap.hesitations = v; markDirty(); }), 'stickiness')
    ];
    if (bodyPart === 'hand') {
      rows.push(field('Opening', severityScale(function () { return tap.opening; }, function (v) { tap.opening = v; markDirty(); }), 'bradykinesia'));
    }
    // Timed tap counter (optional).
    var readout = el('div', { class: 'mda-tap-readout', hidden: tap.tapsPerSec == null ? 'hidden' : null });
    function renderReadout() {
      if (tap.tapsPerSec == null) { readout.hidden = true; return; }
      readout.hidden = false;
      var extra = (tap.intervalCv != null ? ' · interval CV ' + Math.round(tap.intervalCv * 100) + '%' : '')
        + (tap.slowingRatio != null ? ' · late/early ' + tap.slowingRatio : '');
      readout.textContent = tap.tapsPerSec + '/s' + extra;
    }
    renderReadout();
    rows.push(tapCounter(function (metrics) {
      tap.tapsPerSec = metrics.tapsPerSec; tap.intervalCv = metrics.intervalCv;
      tap.slowingRatio = metrics.slowingRatio; tap.tapCount = metrics.tapCount;
      renderReadout(); markDirty();
    }, bodyPart, side));
    rows.push(readout);
    return el('div', { class: 'mda-brady' }, rows);
  }

  // 10-second tap pad. onCapture(metrics) fires at the end.
  function tapCounter(onCapture, bodyPart, side) {
    var DURATION = 10;
    var times = [];
    var running = false, timer = null, started = 0;
    var pad = el('button', { type: 'button', class: 'mda-tap-pad', hidden: 'hidden' });
    var startBtn = el('button', {
      type: 'button', class: 'mda-btn mda-btn-outline mda-tap-start',
      text: 'Start 10-second tap count'
    });
    var hint = el('p', { class: 'mda-tap-hint', text: bodyPart === 'hand'
      ? 'Optional: hand the device over — they tap with the ' + side + ' index finger for 10 seconds. Not tremor counting.'
      : 'Optional: you tap along with each ' + side + ' foot tap for 10 seconds.' });
    function tick() {
      var left = Math.max(0, DURATION - (performance.now() - started) / 1000);
      pad.querySelector('.mda-tap-time').textContent = left.toFixed(1) + 's';
      if (left <= 0) { finish(); }
    }
    function finish() {
      running = false; clearInterval(timer);
      pad.hidden = true; startBtn.hidden = false;
      onCapture(analyzeFingerTaps(times, DURATION));
    }
    startBtn.addEventListener('click', function () {
      times = []; running = true; started = performance.now();
      pad.hidden = false; startBtn.hidden = true;
      pad.querySelector('.mda-tap-count').textContent = '0 taps';
      pad.querySelector('.mda-tap-time').textContent = DURATION.toFixed(1) + 's';
      timer = setInterval(tick, 50);
    });
    pad.appendChild(el('span', { class: 'mda-tap-time', text: '10.0s' }));
    pad.appendChild(el('span', { class: 'mda-tap-count', text: '0 taps' }));
    pad.addEventListener('pointerdown', function (e) {
      if (!running) return;
      e.preventDefault();
      times.push(performance.now() - started);
      pad.querySelector('.mda-tap-count').textContent = times.length + ' taps';
    });
    return el('div', { class: 'mda-tap' }, [hint, startBtn, pad]);
  }

  // 15-second tap-along that converts one click per tremor beat into a
  // frequency in Hz (beats / 15 s) and writes it back to the frequency field.
  function freqTapAlong(obs, freqInput, onChange) {
    var DURATION = 15;
    var taps = 0, running = false, timer = null, started = 0;
    var note = el('div', { class: 'mda-freq-note', hidden: 'hidden' });
    var pad = el('button', { type: 'button', class: 'mda-tap-pad mda-freq-pad', hidden: 'hidden' }, [
      el('span', { class: 'mda-tap-time', text: '15.0s' }),
      el('span', { class: 'mda-tap-count', text: '0 beats' }),
      el('span', { class: 'mda-tap-sub', text: 'tap once per beat' })
    ]);
    var startBtn = el('button', { type: 'button', class: 'mda-btn mda-btn-outline mda-freq-tapbtn', text: '⏱ Tap the beat (15 s)' });
    function refreshNote() {
      if (obs.frequencyHz != null && obs.frequencySource === 'tap-along') {
        note.hidden = false; note.textContent = obs.frequencyHz + ' Hz — counted by 15 s tap-along';
      } else { note.hidden = true; }
    }
    function finish() {
      running = false; if (timer) { clearInterval(timer); timer = null; }
      pad.hidden = true; startBtn.hidden = false;
      var hz = taps > 0 ? Math.round((taps / DURATION) * 10) / 10 : null;
      obs.frequencyHz = hz;
      obs.frequencySource = hz != null ? 'tap-along' : null;
      if (freqInput) freqInput.value = hz != null ? String(hz) : '';
      refreshNote();
      onChange();
    }
    function tick() {
      var left = Math.max(0, DURATION - (performance.now() - started) / 1000);
      pad.querySelector('.mda-tap-time').textContent = left.toFixed(1) + 's';
      if (left <= 0) finish();
    }
    startBtn.addEventListener('click', function () {
      taps = 0; running = true; started = performance.now();
      pad.querySelector('.mda-tap-count').textContent = '0 beats';
      pad.querySelector('.mda-tap-time').textContent = DURATION.toFixed(1) + 's';
      pad.hidden = false; startBtn.hidden = true;
      timer = setInterval(tick, 50);
    });
    pad.addEventListener('pointerdown', function (e) {
      if (!running) return;
      e.preventDefault();
      taps += 1;
      pad.querySelector('.mda-tap-count').textContent = taps + (taps === 1 ? ' beat' : ' beats');
    });
    refreshNote();
    return { startBtn: startBtn, pad: pad, note: note, refreshNote: refreshNote };
  }

  // ======================================================================
  // UI — state + persistence
  // ======================================================================
  var STORAGE_KEY = 'ppr.mda.exams.v1';
  var state = { exam: null, station: 'intake' };
  var dirtyTimer = null;

  function canStore() {
    try { return typeof localStorage !== 'undefined'; } catch (e) { return false; }
  }
  function readAll() {
    if (!canStore()) return [];
    try { var raw = localStorage.getItem(STORAGE_KEY); var arr = raw ? JSON.parse(raw) : []; return Array.isArray(arr) ? arr : []; }
    catch (e) { return []; }
  }
  function writeAll(arr) {
    if (!canStore()) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); } catch (e) {}
  }
  function persistCurrent() {
    if (!state.exam) return;
    state.exam.updatedAt = new Date().toISOString();
    var all = readAll().filter(function (e) { return e.id !== state.exam.id; });
    all.push(state.exam);
    writeAll(all);
    updateSaveStatus('Saved');
  }
  function markDirty() {
    updateSaveStatus('Saving…');
    if (dirtyTimer) clearTimeout(dirtyTimer);
    dirtyTimer = setTimeout(persistCurrent, 600);
    // live-update the note preview if we are on the review station
    if (state.station === 'review') updateNotePreview();
  }
  var saveStatusEl = null;
  function updateSaveStatus(txt) { if (saveStatusEl) saveStatusEl.textContent = txt; }

  // ======================================================================
  // UI — shell + navigation
  // ======================================================================
  var root, railEl, panelEl, progressEl, notePreviewEl;

  function stationDone(id) {
    var ex = state.exam;
    if (id === 'intake') return ex.intake.examinerInitials.trim() !== '' || ex.intake.age.trim() !== '';
    if (id === 'review') return false;
    var block = ex[id];
    if (!block) return false;
    if (block.skipped) return 'skip';
    var present = false;
    ['observation', 'rest', 'protrusion', 'postural', 'kinetic', 'seated', 'standing'].forEach(function (k) {
      if (block[k] && block[k].present) present = true;
    });
    var signs = block.signs || {};
    var anySign = Object.keys(signs).some(function (k) { return signs[k]; });
    return (present || anySign) ? true : false;
  }

  function buildRail() {
    railEl.innerHTML = '';
    STATIONS.forEach(function (s) {
      var status = stationDone(s.id);
      var chip = el('button', {
        type: 'button',
        class: 'mda-rail-chip' + (state.station === s.id ? ' mda-rail-on' : '') + (status === 'skip' ? ' mda-rail-skip' : status ? ' mda-rail-done' : ''),
        onclick: function () { goStation(s.id); }
      }, [
        el('span', { class: 'mda-rail-short', text: s.short }),
        el('span', { class: 'mda-rail-label', text: s.label })
      ]);
      railEl.appendChild(chip);
    });
    var idx = STATIONS.map(function (s) { return s.id; }).indexOf(state.station);
    progressEl.style.width = Math.round(((idx + 1) / STATIONS.length) * 100) + '%';
  }

  function goStation(id) {
    state.station = id;
    buildRail();
    renderStation(id);
    if (panelEl && panelEl.scrollIntoView) {
      try { root.querySelector('.mda-main').scrollTop = 0; } catch (e) {}
    }
  }

  function navRow() {
    var idx = STATIONS.map(function (s) { return s.id; }).indexOf(state.station);
    var prev = idx > 0 ? STATIONS[idx - 1] : null;
    var next = idx < STATIONS.length - 1 ? STATIONS[idx + 1] : null;
    var isRegion = REGION_STATIONS.indexOf(state.station) !== -1;
    var children = [];
    children.push(el('button', {
      type: 'button', class: 'mda-btn mda-btn-ghost', disabled: prev ? null : 'disabled',
      onclick: function () { if (prev) goStation(prev.id); }
    }, ['← ' + (prev ? prev.label : 'Back')]));
    var right = el('div', { class: 'mda-nav-right' });
    if (isRegion) {
      var skipped = state.exam[state.station].skipped;
      right.appendChild(el('button', {
        type: 'button', class: 'mda-btn mda-btn-outline',
        onclick: function () {
          state.exam[state.station].skipped = !state.exam[state.station].skipped;
          markDirty();
          renderStation(state.station);
          buildRail();
        }
      }, [skipped ? 'Un-skip region' : 'Skip region (not examined)']));
    }
    if (next) {
      right.appendChild(el('button', {
        type: 'button', class: 'mda-btn mda-btn-primary',
        onclick: function () { goStation(next.id); }
      }, [next.id === 'review' ? 'Finish → Note' : 'Next: ' + next.label + ' →']));
    }
    children.push(right);
    return el('div', { class: 'mda-nav' }, children);
  }

  function stationHeader(id) {
    var proto = STATION_PROTOCOLS[id];
    var s = STATIONS.filter(function (x) { return x.id === id; })[0];
    var stepsList = el('ul', { class: 'mda-proto-steps' });
    (proto.steps || []).forEach(function (st) { stepsList.appendChild(el('li', { text: st })); });
    var physId = REGION_DEFS[id] && REGION_DEFS[id].physiology;
    var physBtn = physId ? el('button', {
      type: 'button', class: 'mda-proto-phys',
      onclick: function () { openAtlas('physiology', physId); }
    }, ['Physiology: ' + PHYSIOLOGY[physId].title.split(' — ')[0] + ' ↗']) : null;
    return el('div', { class: 'mda-station-head' }, [
      el('div', { class: 'mda-station-kicker', text: 'Station ' + (STATIONS.map(function (x) { return x.id; }).indexOf(id) + 1) + ' of ' + STATIONS.length }),
      el('h3', { class: 'mda-station-title', text: s.label }),
      el('div', { class: 'mda-proto' }, [
        el('div', { class: 'mda-proto-title', text: proto.title }),
        stepsList,
        physBtn
      ])
    ]);
  }

  // ======================================================================
  // UI — station renderers
  // ======================================================================
  function renderStation(id) {
    panelEl.innerHTML = '';
    if (id === 'intake') { panelEl.appendChild(renderIntake()); }
    else if (id === 'review') { panelEl.appendChild(renderReview()); }
    else { panelEl.appendChild(renderRegion(id)); }
    panelEl.appendChild(navRow());
  }

  function renderIntake() {
    var ex = state.exam, ik = ex.intake;
    var wrap = el('div', { class: 'mda-card' });
    wrap.appendChild(stationHeader('intake'));
    var privacy = el('div', { class: 'mda-privacy' }, [
      el('strong', { text: 'No PHI. ' }),
      document.createTextNode('Enter examiner initials only — never the patient’s initials, name, or record number. Everything stays in this browser.')
    ]);
    wrap.appendChild(privacy);

    var grid = el('div', { class: 'mda-grid2' }, [
      field('Age', textInput(ik.age, function (v) { ik.age = v.replace(/[^0-9]/g, '').slice(0, 3); markDirty(); }, 'e.g. 64', { inputmode: 'numeric' })),
      field('Gender', selectInput(GENDERS, ik.gender, function (v) { ik.gender = v; markDirty(); })),
      field('Handedness', selectInput(HANDEDNESS, ik.handedness, function (v) { ik.handedness = v; markDirty(); }), 'handedness'),
      field('Setting', selectInput(SETTINGS, ik.setting, function (v) { ik.setting = v; markDirty(); }))
    ]);
    wrap.appendChild(grid);

    // Medications chips + free text
    var medField = el('div', { class: 'mda-field' }, [
      el('div', { class: 'mda-field-label', text: 'Medications (tap common offenders, or type)' }),
      (function () {
        var input = textInput(ik.medications, function (v) { ik.medications = v; markDirty(); }, 'e.g. haloperidol 5 mg BID x 3 weeks');
        var chips = el('div', { class: 'mda-chips' });
        MEDICATION_CHIPS.forEach(function (name) {
          chips.appendChild(el('button', {
            type: 'button', class: 'mda-chip mda-chip-add', onclick: function () {
              var cur = input.value.trim();
              if (cur.split(/[,;]/).map(function (s) { return s.trim().toLowerCase(); }).indexOf(name.toLowerCase()) !== -1) return;
              input.value = cur ? cur + ', ' + name : name;
              ik.medications = input.value; markDirty();
            }
          }, [name]));
        });
        return el('div', {}, [chips, input]);
      })()
    ]);
    wrap.appendChild(medField);

    var clock = el('div', { class: 'mda-grid2' }, [
      field('Time course (the EPS clock)', selectInput(TIME_COURSES, ik.timeCourse, function (v) { ik.timeCourse = v; markDirty(); })),
      field('Onset / context', textInput(ik.onsetContext, function (v) { ik.onsetContext = v; markDirty(); }, 'e.g. new since dose increase'))
    ]);
    wrap.appendChild(clock);

    wrap.appendChild(el('div', { class: 'mda-toggle-stack' }, [
      toggleRow({ label: 'Dopamine antagonist exposure', hint: 'Antipsychotic, metoclopramide, etc.', checked: ik.dopamineAntagonist, onChange: function (v) { ik.dopamineAntagonist = v; markDirty(); } }),
      toggleRow({ label: 'Lithium or valproate', hint: 'Mood stabilizer tremor changes the prior', checked: ik.moodStabilizer, onChange: function (v) { ik.moodStabilizer = v; markDirty(); } })
    ]));

    wrap.appendChild(field('Family history', textInput(ik.familyHistory, function (v) { ik.familyHistory = v; markDirty(); }, 'e.g. essential tremor in father')));

    var initialsInput = el('input', { type: 'text', class: 'mda-input', value: ik.examinerInitials, placeholder: 'e.g. JS', maxlength: '8' });
    initialsInput.addEventListener('input', function () {
      var norm = normalizeInitials(initialsInput.value);
      if (initialsInput.value !== norm) initialsInput.value = norm;
      ik.examinerInitials = norm; markDirty();
    });
    var examiner = el('div', { class: 'mda-grid2' }, [
      field('Examiner initials', initialsInput),
      field('Credential', selectInput(EXAMINER_CREDENTIALS.concat([{ id: 'unspecified', label: 'Unspecified' }]), ik.examinerCredential, function (v) { ik.examinerCredential = v; markDirty(); renderStation('intake'); }))
    ]);
    wrap.appendChild(examiner);
    if (ik.examinerCredential === 'other') {
      wrap.appendChild(field('Credential detail', textInput(ik.examinerOther, function (v) { ik.examinerOther = v; markDirty(); }, 'e.g. medical assistant')));
    }
    return wrap;
  }

  function regionActObs(id, obs, opts) {
    var def = REGION_DEFS[id];
    return observationForm(obs, Object.assign({
      showActivations: def.showActivations,
      lateralityStyle: def.lateralityStyle
    }, opts || {}));
  }

  function renderRegion(id) {
    var def = REGION_DEFS[id];
    var block = state.exam[id];
    var wrap = el('div', { class: 'mda-card' });
    wrap.appendChild(stationHeader(id));

    if (block.skipped) {
      wrap.appendChild(el('div', { class: 'mda-skipbox' }, [
        el('strong', { text: 'Region skipped. ' }),
        document.createTextNode('This region will be documented as not examined — never implied to be normal. Use “Un-skip region” below to examine it.')
      ]));
      return wrap;
    }

    var body = el('div', { class: 'mda-region-body' });

    if (id === 'tongue') {
      body.appendChild(regionActObs(id, block.rest, { title: 'At rest (on the floor of the mouth)', presentLabel: 'Abnormal movement at rest' }));
      body.appendChild(regionActObs(id, block.protrusion, { title: 'On protrusion (hold 10 s)', presentLabel: 'Abnormal movement on protrusion' }));
    } else if (id === 'hands') {
      body.appendChild(regionActObs(id, block.rest, { title: 'At rest', presentLabel: 'Rest tremor / movement present' }));
      body.appendChild(regionActObs(id, block.postural, { title: 'On posture (arms out)', presentLabel: 'Postural movement present' }));
      body.appendChild(regionActObs(id, block.kinetic, { title: 'On action (finger-nose)', presentLabel: 'Action movement present' }));
      body.appendChild(el('div', { class: 'mda-subhead', text: 'Bradykinesia battery' }));
      body.appendChild(el('div', { class: 'mda-grid2' }, [
        el('div', { class: 'mda-side-card' }, [el('div', { class: 'mda-side-title', text: 'Right hand' }), bradyPanel(block.tapping.right, 'right', 'hand')]),
        el('div', { class: 'mda-side-card' }, [el('div', { class: 'mda-side-title', text: 'Left hand' }), bradyPanel(block.tapping.left, 'left', 'hand')])
      ]));
      body.appendChild(el('div', { class: 'mda-subhead', text: 'Tone' }));
      body.appendChild(field('Rigidity', severityScale(function () { return block.rigidity; }, function (v) { block.rigidity = v; markDirty(); })));
      body.appendChild(toggleRow({ label: 'Cogwheeling', checked: block.cogwheel, onChange: function (v) { block.cogwheel = v; markDirty(); } }));
    } else if (id === 'feet') {
      body.appendChild(regionActObs(id, block.seated, { title: 'Seated', presentLabel: 'Movement present, seated' }));
      body.appendChild(regionActObs(id, block.standing, { title: 'On standing', presentLabel: 'Movement present, standing' }));
      body.appendChild(el('div', { class: 'mda-subhead', text: 'Tapping decrement' }));
      body.appendChild(el('div', { class: 'mda-grid2' }, [
        el('div', { class: 'mda-side-card' }, [el('div', { class: 'mda-side-title', text: 'Right foot' }), bradyPanel(block.tapping.right, 'right', 'foot')]),
        el('div', { class: 'mda-side-card' }, [el('div', { class: 'mda-side-title', text: 'Left foot' }), bradyPanel(block.tapping.left, 'left', 'foot')])
      ]));
    } else if (id === 'gait') {
      body.appendChild(regionActObs(id, block.observation, { title: 'Gait description', presentLabel: 'Abnormal gait present' }));
      body.appendChild(el('div', { class: 'mda-subhead', text: 'Gait metrics' }));
      body.appendChild(field('Reduced arm swing', chipGroup(
        [{ id: 'none', label: 'None' }].concat(LATERALITIES),
        function (v) { return block.armSwing === v; },
        function (v) { block.armSwing = v; markDirty(); }
      )));
      body.appendChild(el('div', { class: 'mda-grid2' }, [
        field('Steps to turn', textInput(block.stepsToTurn != null ? String(block.stepsToTurn) : '', function (v) { var n = parseInt(v, 10); block.stepsToTurn = isNaN(n) ? null : n; markDirty(); }, 'count', { type: 'number', inputmode: 'numeric' })),
        field('Pull test (retropulsive steps)', textInput(block.pullSteps != null ? String(block.pullSteps) : '', function (v) { var n = parseInt(v, 10); block.pullSteps = isNaN(n) ? null : n; markDirty(); }, 'count', { type: 'number', inputmode: 'numeric' }))
      ]));
      body.appendChild(field('Falls risk', severityScale(function () { return block.fallsRisk; }, function (v) { block.fallsRisk = v; markDirty(); })));
    } else {
      // single-observation regions: eyes, mouth, face, arms, neck, trunk
      body.appendChild(regionActObs(id, block.observation, {}));
    }

    // Named signs (all regions)
    body.appendChild(el('div', { class: 'mda-subhead', text: 'Named signs in this region' }));
    body.appendChild(signsChecklist(block.signs, def.signs));

    // Region free-text notes
    body.appendChild(field('Region notes', textArea(block.notes, function (v) { block.notes = v; markDirty(); }, 'Free text for this region')));

    wrap.appendChild(body);
    return wrap;
  }

  function renderReview() {
    var wrap = el('div', { class: 'mda-card' });
    wrap.appendChild(stationHeader('review'));
    wrap.appendChild(field('Impression (optional)', textArea(state.exam.impression, function (v) { state.exam.impression = v; markDirty(); }, 'A one-line synthesis, if you want one in the note')));

    var pre = el('pre', { class: 'mda-note' });
    notePreviewEl = pre;
    updateNotePreview();

    var copyBtn = el('button', { type: 'button', class: 'mda-btn mda-btn-primary', id: 'mda-copy-btn', text: 'Copy chart note' });
    copyBtn.addEventListener('click', function () {
      var text = buildClinicalNote(state.exam);
      if (window.ToolUtils && ToolUtils.copyWithButton) ToolUtils.copyWithButton(text, copyBtn);
      else { try { navigator.clipboard.writeText(text); copyBtn.textContent = 'Copied!'; setTimeout(function () { copyBtn.textContent = 'Copy chart note'; }, 2000); } catch (e) {} }
    });
    var resetBtn = el('button', { type: 'button', class: 'mda-btn mda-btn-outline', text: 'Reset this exam' });
    resetBtn.addEventListener('click', function () {
      var run = function () { startNewExam(); };
      if (window.ToolUtils && ToolUtils.confirmReset) ToolUtils.confirmReset('Reset this exam and start a new one? Saved exams are kept.', run);
      else if (confirm('Reset this exam and start a new one?')) run();
    });

    wrap.appendChild(el('div', { class: 'mda-note-actions' }, [copyBtn, resetBtn]));
    wrap.appendChild(el('div', { class: 'mda-note-wrap' }, [pre]));
    wrap.appendChild(el('p', { class: 'mda-muted mda-note-foot', text: 'Plain text, ready to paste into an EMR. Categories are signature matches from the seven axes, not diagnoses.' }));
    return wrap;
  }
  function updateNotePreview() {
    if (notePreviewEl && state.exam) notePreviewEl.textContent = buildClinicalNote(state.exam);
  }

  // ======================================================================
  // UI — Atlas / glossary drawer
  // ======================================================================
  var atlasEl = null;
  function buildAtlas() {
    var overlay = el('div', { class: 'mda-atlas-overlay', hidden: 'hidden' });
    var panel = el('div', { class: 'mda-atlas' });
    var tabsBar = el('div', { class: 'mda-atlas-tabs' });
    var contentEl = el('div', { class: 'mda-atlas-content' });
    var TABS = [
      { id: 'method', label: 'Method' },
      { id: 'physiology', label: 'EPS clock & physiology' },
      { id: 'glossary', label: 'Glossary' }
    ];
    var current = 'method';
    function renderTab(tab, anchor) {
      current = tab;
      contentEl.innerHTML = '';
      tabsBar.querySelectorAll('.mda-atlas-tab').forEach(function (b) { b.classList.toggle('mda-atlas-tab-on', b.dataset.tab === tab); });
      if (tab === 'method') {
        contentEl.appendChild(el('h4', { text: 'Describe before you diagnose' }));
        contentEl.appendChild(el('p', { text: GLOSSARY.phenomenology.body }));
        contentEl.appendChild(el('h4', { text: 'The seven descriptive axes' }));
        var order = ['rhythmicity', 'speed', 'amplitude', 'spread', 'activation', 'control', 'pattern'];
        order.forEach(function (k) {
          contentEl.appendChild(el('div', { class: 'mda-atlas-term' }, [
            el('strong', { text: GLOSSARY[k].title }), el('span', { text: ' — ' + GLOSSARY[k].body })
          ]));
        });
        contentEl.appendChild(el('h4', { text: 'The first split' }));
        contentEl.appendChild(el('p', { text: 'Rhythmic and oscillating about a point → tremor or myorhythmia. Everything else wanders: shock-like is myoclonus, random and flowing is chorea, patterned pull is dystonia, stereotyped with an urge is tic. Decrement on repetition is bradykinesia. Distractibility or entrainment is a functional sign that overrides the pattern.' }));
      } else if (tab === 'physiology') {
        PHYSIOLOGY_ORDER.forEach(function (k) {
          var block = el('div', { class: 'mda-atlas-term', id: 'mda-phys-' + k }, [
            el('strong', { text: PHYSIOLOGY[k].title }), el('span', { text: ' — ' + PHYSIOLOGY[k].body })
          ]);
          contentEl.appendChild(block);
        });
      } else {
        var search = el('input', { type: 'search', class: 'mda-input mda-atlas-search', placeholder: 'Search terms…' });
        var listWrap = el('div', {});
        contentEl.appendChild(search);
        contentEl.appendChild(listWrap);
        function draw(q) {
          listWrap.innerHTML = '';
          Object.keys(GLOSSARY).sort(function (a, b) { return GLOSSARY[a].title.localeCompare(GLOSSARY[b].title); }).forEach(function (k) {
            var g = GLOSSARY[k];
            if (q && (g.title + ' ' + g.body).toLowerCase().indexOf(q.toLowerCase()) === -1) return;
            listWrap.appendChild(el('div', { class: 'mda-atlas-term' }, [el('strong', { text: g.title }), el('span', { text: ' — ' + g.body })]));
          });
        }
        search.addEventListener('input', function () { draw(search.value); });
        draw('');
      }
      if (anchor) {
        setTimeout(function () { var a = document.getElementById('mda-phys-' + anchor); if (a) a.scrollIntoView({ block: 'start' }); }, 30);
      }
    }
    TABS.forEach(function (t) {
      tabsBar.appendChild(el('button', { type: 'button', class: 'mda-atlas-tab', dataset: { tab: t.id }, text: t.label, onclick: function () { renderTab(t.id); } }));
    });
    var closeBtn = el('button', { type: 'button', class: 'mda-atlas-close', 'aria-label': 'Close', text: '✕', onclick: closeAtlas });
    panel.appendChild(el('div', { class: 'mda-atlas-head' }, [el('div', { class: 'mda-atlas-title', text: 'Atlas & glossary' }), closeBtn]));
    panel.appendChild(tabsBar);
    panel.appendChild(contentEl);
    overlay.appendChild(panel);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeAtlas(); });
    overlay._renderTab = renderTab;
    return overlay;
  }
  function openAtlas(tab, anchor) { if (!atlasEl) { atlasEl = buildAtlas(); root.appendChild(atlasEl); } atlasEl.hidden = false; atlasEl._renderTab(tab || 'method', anchor); }
  function closeAtlas() { if (atlasEl) atlasEl.hidden = true; }

  // ======================================================================
  // UI — saved-exams drawer
  // ======================================================================
  function openSaved() {
    var all = readAll().sort(function (a, b) { return (b.updatedAt || '').localeCompare(a.updatedAt || ''); });
    var overlay = el('div', { class: 'mda-atlas-overlay' });
    var panel = el('div', { class: 'mda-atlas mda-saved' });
    panel.appendChild(el('div', { class: 'mda-atlas-head' }, [
      el('div', { class: 'mda-atlas-title', text: 'Saved exams (' + all.length + ')' }),
      el('button', { type: 'button', class: 'mda-atlas-close', text: '✕', onclick: function () { overlay.remove(); } })
    ]));
    var listWrap = el('div', { class: 'mda-atlas-content' });
    if (all.length === 0) listWrap.appendChild(el('p', { class: 'mda-muted', text: 'No saved exams yet. They save automatically as you work, in this browser only.' }));
    all.forEach(function (ex) {
      var title = patientLine(ex) || 'Unnamed exam';
      var when = ex.updatedAt ? new Date(ex.updatedAt).toLocaleString() : '';
      var row = el('div', { class: 'mda-saved-row' }, [
        el('button', {
          type: 'button', class: 'mda-saved-open', onclick: function () {
            state.exam = ex; state.station = 'intake'; overlay.remove(); goStation('intake'); updateSaveStatus('Saved');
          }
        }, [el('span', { class: 'mda-saved-name', text: title + (ex.id === (state.exam && state.exam.id) ? '  (current)' : '') }), el('span', { class: 'mda-saved-when', text: when })]),
        el('button', {
          type: 'button', class: 'mda-btn mda-btn-ghost mda-saved-del', title: 'Delete', text: 'Delete', onclick: function () {
            if (!confirm('Delete this saved exam?')) return;
            writeAll(readAll().filter(function (e) { return e.id !== ex.id; }));
            row.remove();
          }
        })
      ]);
      listWrap.appendChild(row);
    });
    panel.appendChild(listWrap);
    overlay.appendChild(panel);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) overlay.remove(); });
    root.appendChild(overlay);
  }

  function startNewExam() {
    state.exam = createExam();
    persistCurrent();
    goStation('intake');
  }

  // ======================================================================
  // UI — init
  // ======================================================================
  function buildShell() {
    root.innerHTML = '';
    saveStatusEl = el('span', { class: 'mda-savestatus', text: 'Saved' });
    var bar = el('div', { class: 'mda-topbar' }, [
      el('div', { class: 'mda-topbar-left' }, [
        el('button', { type: 'button', class: 'mda-btn mda-btn-outline', text: '+ New exam', onclick: function () { if (confirm('Start a new blank exam? The current one is saved.')) startNewExam(); } }),
        el('button', { type: 'button', class: 'mda-btn mda-btn-ghost', text: 'Saved exams', onclick: openSaved })
      ]),
      el('div', { class: 'mda-topbar-right' }, [
        saveStatusEl,
        el('button', { type: 'button', class: 'mda-btn mda-btn-ghost', text: '📖 Atlas & glossary', onclick: function () { openAtlas('method'); } })
      ])
    ]);
    var progressTrack = el('div', { class: 'mda-progress-track' }, [progressEl = el('div', { class: 'mda-progress-bar' })]);
    railEl = el('div', { class: 'mda-rail' });
    panelEl = el('div', { class: 'mda-panel' });
    var main = el('div', { class: 'mda-main' }, [panelEl]);
    root.appendChild(bar);
    root.appendChild(progressTrack);
    root.appendChild(railEl);
    root.appendChild(main);
  }

  function init() {
    root = document.getElementById('mda-root');
    if (!root || root.dataset.mdaInit === 'true') return;
    root.dataset.mdaInit = 'true';
    // load latest saved exam, else create
    var all = readAll().sort(function (a, b) { return (b.updatedAt || '').localeCompare(a.updatedAt || ''); });
    state.exam = all.length ? all[0] : createExam();
    buildShell();
    goStation('intake');
    // A click anywhere outside an open "?" popover dismisses it.
    document.addEventListener('click', closeAllHelp);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAllHelp(); });
  }

  if (document.getElementById('mda-root')) init();
  else document.addEventListener('DOMContentLoaded', init);
})();

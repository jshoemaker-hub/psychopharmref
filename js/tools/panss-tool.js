(function() {
  'use strict';

  var FALLBACK_SCALE = {
    id: 'panss',
    short_title: 'PANSS',
    options: [
      { value: 1, label: 'Absent' },
      { value: 2, label: 'Minimal' },
      { value: 3, label: 'Mild' },
      { value: 4, label: 'Moderate' },
      { value: 5, label: 'Moderately Severe' },
      { value: 6, label: 'Severe' },
      { value: 7, label: 'Extreme' }
    ],
    items: [
      { id: 'P1', text: 'Delusions' },
      { id: 'P2', text: 'Conceptual Disorganization' },
      { id: 'P3', text: 'Hallucinatory Behavior' },
      { id: 'P4', text: 'Excitement' },
      { id: 'P5', text: 'Grandiosity' },
      { id: 'P6', text: 'Suspiciousness/Persecution' },
      { id: 'P7', text: 'Hostility' },
      { id: 'N1', text: 'Blunted Affect' },
      { id: 'N2', text: 'Emotional Withdrawal' },
      { id: 'N3', text: 'Poor Rapport' },
      { id: 'N4', text: 'Passive/Apathetic Social Withdrawal' },
      { id: 'N5', text: 'Difficulty in Abstract Thinking' },
      { id: 'N6', text: 'Lack of Spontaneity and Flow of Conversation' },
      { id: 'N7', text: 'Stereotyped Thinking' },
      { id: 'G1', text: 'Somatic Concern' },
      { id: 'G2', text: 'Anxiety' },
      { id: 'G3', text: 'Guilt Feelings' },
      { id: 'G4', text: 'Tension' },
      { id: 'G5', text: 'Mannerisms and Posturing' },
      { id: 'G6', text: 'Depression' },
      { id: 'G7', text: 'Motor Retardation' },
      { id: 'G8', text: 'Uncooperativeness' },
      { id: 'G9', text: 'Unusual Thought Content' },
      { id: 'G10', text: 'Disorientation' },
      { id: 'G11', text: 'Poor Attention' },
      { id: 'G12', text: 'Lack of Judgment and Insight' },
      { id: 'G13', text: 'Disturbance of Volition' },
      { id: 'G14', text: 'Poor Impulse Control' },
      { id: 'G15', text: 'Preoccupation' },
      { id: 'G16', text: 'Active Social Avoidance' }
    ],
    versions: [
      {
        id: 'panss-6',
        heading: 'PANSS-6 (Brief Psychosis Assessment)',
        item_ids: ['P1', 'P2', 'P3', 'N1', 'N4', 'N6'],
        max: 42,
        subscales: [
          { id: 'positive', label: 'Positive Subscale', item_ids: ['P1', 'P2', 'P3'], max: 21 },
          { id: 'negative', label: 'Negative Subscale', item_ids: ['N1', 'N4', 'N6'], max: 21 }
        ]
      },
      {
        id: 'panss-30',
        heading: 'PANSS-30 (Full Psychosis Assessment)',
        item_ids: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10', 'G11', 'G12', 'G13', 'G14', 'G15', 'G16'],
        max: 210
      }
    ],
    subscales: [
      { id: 'positive', label: 'Positive Scale', report_heading: 'POSITIVE SCALE (P1-P7)', item_ids: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7'], max: 49 },
      { id: 'negative', label: 'Negative Scale', report_heading: 'NEGATIVE SCALE (N1-N7)', item_ids: ['N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7'], max: 49 },
      { id: 'general', label: 'General Psychopathology', report_heading: 'GENERAL PSYCHOPATHOLOGY (G1-G16)', item_ids: ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10', 'G11', 'G12', 'G13', 'G14', 'G15', 'G16'], max: 112 }
    ],
    marder_factors: [
      { id: 'positive', label: 'Positive Symptoms', item_ids: ['P1', 'P3', 'P5', 'P6', 'G9'], max: 35 },
      { id: 'negative', label: 'Negative Symptoms', item_ids: ['N1', 'N2', 'N3', 'N4', 'N6', 'G7'], max: 42 },
      { id: 'disorganized', label: 'Disorganized Thought', item_ids: ['P2', 'N5', 'G11'], max: 21 },
      { id: 'hostility', label: 'Uncontrolled Hostility/Excitement', item_ids: ['P4', 'P7', 'G8', 'G14'], max: 28 },
      { id: 'anxiety', label: 'Anxiety/Depression', item_ids: ['G2', 'G3', 'G4', 'G6'], max: 28 }
    ],
    severity_bands: [
      { min: 0, max: 0, label: 'Not rated', display_label: '-' },
      { min: 1, max: 57, label: 'Mild illness' },
      { min: 58, max: 74, label: 'Moderate illness' },
      { min: 75, max: 95, label: 'Marked illness' },
      { min: 96, max: 115, label: 'Severe illness' },
      { min: 116, max: 210, label: 'Extremely severe' }
    ],
    report: {
      panss6_note: 'Interpret in clinical context alongside CGI-S rating. No formal severity cut-offs established.'
    }
  };

  var scale = FALLBACK_SCALE;

  function getItems() {
    return scale.items || FALLBACK_SCALE.items;
  }

  function getVersions() {
    return scale.versions || FALLBACK_SCALE.versions;
  }

  function getSubscales() {
    return scale.subscales || FALLBACK_SCALE.subscales;
  }

  function getMarderFactors() {
    return scale.marder_factors || FALLBACK_SCALE.marder_factors;
  }

  function findById(list, id) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  function getVersion(id) {
    return findById(getVersions(), id) || findById(FALLBACK_SCALE.versions, id);
  }

  function getItem(id) {
    return findById(getItems(), id) || findById(FALLBACK_SCALE.items, id) || { id: id, text: id };
  }

  function getSeverity(total) {
    var bands = scale.severity_bands || FALLBACK_SCALE.severity_bands;
    for (var i = 0; i < bands.length; i++) {
      if (total >= bands[i].min && total <= bands[i].max) return bands[i];
    }
    return bands[bands.length - 1];
  }

  function getForm(prefix) {
    return document.getElementById(prefix === 'ps6' ? 'ps-form-6' : 'ps-form-30');
  }

  function getScore(prefix, itemId) {
    var form = getForm(prefix);
    if (!form) return 0;
    var checked = form.querySelector('input[name="' + prefix + '-' + itemId + '"]:checked');
    return checked ? parseInt(checked.value, 10) : 0;
  }

  function sumItems(prefix, itemIds) {
    return (itemIds || []).reduce(function(sum, itemId) {
      return sum + getScore(prefix, itemId);
    }, 0);
  }

  function setText(selector, value) {
    var el = document.querySelector(selector);
    if (el) el.textContent = value;
  }

  function displayScore(score) {
    return score > 0 ? String(score) : '\u2014';
  }

  function formatComposite(score) {
    return score > 0 ? '+' + score : String(score);
  }

  function dateStamp() {
    if (window.ToolUtils && typeof ToolUtils.dateStamp === 'function') {
      return ToolUtils.dateStamp();
    }
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function copyWithButton(text, btn) {
    if (window.ToolUtils && typeof ToolUtils.copyWithButton === 'function') {
      ToolUtils.copyWithButton(text, btn);
      return;
    }
    navigator.clipboard.writeText(text).then(function() {
      var orig = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(function() { btn.textContent = orig; }, 2000);
    });
  }

  function confirmReset(message, callback) {
    if (window.ToolUtils && typeof ToolUtils.confirmReset === 'function') {
      ToolUtils.confirmReset(message, callback);
      return;
    }
    if (confirm(message)) callback();
  }

  function showReportWarning(formId) {
    var form = document.getElementById(formId);
    var tab = form && form.closest ? form.closest('.ps-tab-content') : null;
    var display = tab ? tab.querySelector('.ps-score-display') : document.querySelector('.ps-score-display');
    if (!display) return;

    var existing = display.querySelector('.ps-report-warning');
    if (!existing) {
      existing = document.createElement('div');
      existing.className = 'mt-warning ps-report-warning';
      display.insertBefore(existing, display.firstChild);
    }
    existing.textContent = 'Please rate all items before generating a report.';
  }

  function updatePANSS6Scores() {
    var version = getVersion('panss-6');
    var positive = version.subscales[0];
    var negative = version.subscales[1];
    var positiveScore = sumItems('ps6', positive.item_ids);
    var negativeScore = sumItems('ps6', negative.item_ids);
    var totalScore = positiveScore + negativeScore;

    setText('.ps-6-positive', displayScore(positiveScore));
    setText('.ps-6-negative', displayScore(negativeScore));
    setText('.ps-6-total', displayScore(totalScore));
  }

  function updatePANSS30Scores() {
    var positive = findById(getSubscales(), 'positive');
    var negative = findById(getSubscales(), 'negative');
    var general = findById(getSubscales(), 'general');
    var totalVersion = getVersion('panss-30');

    var positiveScore = sumItems('ps30', positive.item_ids);
    var negativeScore = sumItems('ps30', negative.item_ids);
    var generalScore = sumItems('ps30', general.item_ids);
    var totalScore = sumItems('ps30', totalVersion.item_ids);
    var compositeIndex = positiveScore - negativeScore;
    var severity = totalScore > 0 ? getSeverity(totalScore).label : '\u2014';
    var marder = getMarderFactors();

    setText('.ps-30-positive', displayScore(positiveScore));
    setText('.ps-30-negative', displayScore(negativeScore));
    setText('.ps-30-general', displayScore(generalScore));
    setText('.ps-30-total', displayScore(totalScore));
    setText('.ps-30-composite', totalScore > 0 ? formatComposite(compositeIndex) : '\u2014');
    setText('.ps-30-severity', severity);
    setText('.ps-marder-positive', displayScore(sumItems('ps30', marder[0].item_ids)));
    setText('.ps-marder-negative', displayScore(sumItems('ps30', marder[1].item_ids)));
    setText('.ps-marder-disorg', displayScore(sumItems('ps30', marder[2].item_ids)));
    setText('.ps-marder-hostile', displayScore(sumItems('ps30', marder[3].item_ids)));
    setText('.ps-marder-anxiety', displayScore(sumItems('ps30', marder[4].item_ids)));
  }

  function itemLine(prefix, itemId) {
    return itemId + '. ' + getItem(itemId).text + ': ' + getScore(prefix, itemId);
  }

  function generatePANSS6Report() {
    var version = getVersion('panss-6');
    var positive = version.subscales[0];
    var negative = version.subscales[1];
    var positiveScore = sumItems('ps6', positive.item_ids);
    var negativeScore = sumItems('ps6', negative.item_ids);
    var totalScore = positiveScore + negativeScore;

    if (totalScore === 0) {
      showReportWarning('ps-form-6');
      return;
    }

    var lines = [
      version.heading || 'PANSS-6 (Brief Psychosis Assessment)',
      'Date: ' + dateStamp(),
      '',
      'ITEM SCORES:'
    ];

    version.item_ids.forEach(function(itemId) {
      lines.push(itemLine('ps6', itemId));
    });

    lines.push('');
    lines.push('SUBSCALE SCORES:');
    lines.push(positive.label + ': ' + positiveScore + '/' + positive.max);
    lines.push(negative.label + ': ' + negativeScore + '/' + negative.max);
    lines.push('Total PANSS-6: ' + totalScore + '/' + version.max);
    lines.push('');
    lines.push('Note: ' + ((scale.report && scale.report.panss6_note) || FALLBACK_SCALE.report.panss6_note));

    copyWithButton(lines.join('\n'), document.getElementById('ps6-generate'));
  }

  function addSubscaleReport(lines, prefix, subscale) {
    var score = sumItems(prefix, subscale.item_ids);
    lines.push((subscale.report_heading || subscale.label.toUpperCase()) + ': ' + score + '/' + subscale.max);
    subscale.item_ids.forEach(function(itemId) {
      lines.push(itemLine(prefix, itemId));
    });
    lines.push('');
  }

  function generatePANSS30Report() {
    var version = getVersion('panss-30');
    var positive = findById(getSubscales(), 'positive');
    var negative = findById(getSubscales(), 'negative');
    var totalScore = sumItems('ps30', version.item_ids);

    if (totalScore === 0) {
      showReportWarning('ps-form-30');
      return;
    }

    var positiveScore = sumItems('ps30', positive.item_ids);
    var negativeScore = sumItems('ps30', negative.item_ids);
    var compositeIndex = positiveScore - negativeScore;
    var severity = getSeverity(totalScore).label;
    var lines = [
      version.heading || 'PANSS-30 (Full Psychosis Assessment)',
      'Date: ' + dateStamp(),
      ''
    ];

    getSubscales().forEach(function(subscale) {
      addSubscaleReport(lines, 'ps30', subscale);
    });

    lines.push('TOTAL PANSS: ' + totalScore + '/' + version.max);
    lines.push('Composite Index (P - N): ' + formatComposite(compositeIndex));
    lines.push('Severity: ' + severity);
    lines.push('');
    lines.push('MARDER FACTOR ANALYSIS:');

    getMarderFactors().forEach(function(factor) {
      lines.push(factor.label + ' (' + factor.item_ids.join(',') + '): ' + sumItems('ps30', factor.item_ids) + '/' + factor.max);
    });

    copyWithButton(lines.join('\n'), document.getElementById('ps30-generate'));
  }

  function loadSchema() {
    if (!window.ToolUtils || typeof ToolUtils.loadClinicalScale !== 'function') return;

    ToolUtils.loadClinicalScale('panss').then(function(loadedScale) {
      scale = loadedScale;
      updatePANSS6Scores();
      updatePANSS30Scores();
    }).catch(function(err) {
      console.warn('PANSS schema unavailable; using embedded fallback.', err);
    });
  }

  function initTabs() {
    document.querySelectorAll('.ps-tab-btn').forEach(function(button) {
      button.addEventListener('click', function() {
        var tabId = this.getAttribute('data-tab') + '-tab';

        document.querySelectorAll('.ps-tab-btn').forEach(function(btn) {
          btn.classList.remove('ps-tab-active');
        });
        document.querySelectorAll('.ps-tab-content').forEach(function(content) {
          content.classList.remove('ps-tab-active');
        });

        this.classList.add('ps-tab-active');
        var tab = document.getElementById(tabId);
        if (tab) tab.classList.add('ps-tab-active');
      });
    });
  }

  function initAccordions() {
    document.querySelectorAll('.ps-subscale-header').forEach(function(header) {
      header.addEventListener('click', function() {
        var targetId = this.getAttribute('data-target');
        var targetElement = document.getElementById(targetId);

        this.classList.toggle('ps-subscale-open');
        if (targetElement) targetElement.classList.toggle('ps-subscale-expanded');
      });
    });
  }

  function addPrintButtons() {
    var sec = document.getElementById('panss-tool');
    if (!sec) return;
    var header = sec.querySelector('.section-header');
    if (!header || header.querySelector('.ps-print-buttons')) return;

    var btnDiv = document.createElement('div');
    btnDiv.className = 'ps-print-buttons';
    btnDiv.style.display = 'flex';
    btnDiv.style.gap = '8px';

    var btn1 = document.createElement('button');
    btn1.className = 'pf-inline-btn';
    btn1.onclick = function() { if (typeof printBlankForm === 'function') printBlankForm('panss-6'); };
    btn1.innerHTML = '🖨️ Print PANSS-6';
    btn1.title = 'Print a blank version of the PANSS-6 form';

    var btn2 = document.createElement('button');
    btn2.className = 'pf-inline-btn';
    btn2.onclick = function() { if (typeof printBlankForm === 'function') printBlankForm('panss-30'); };
    btn2.innerHTML = '🖨️ Print PANSS-30';
    btn2.title = 'Print a blank version of the PANSS-30 form';

    btnDiv.appendChild(btn1);
    btnDiv.appendChild(btn2);
    header.appendChild(btnDiv);
  }

  // ---- Item-specific rating anchors (Kay, Fiszbein & Opler, 1987) ----
  var PANSS_SEVERITY_LABELS = {"1": "Absent", "2": "Minimal", "3": "Mild", "4": "Moderate", "5": "Moderately Severe", "6": "Severe", "7": "Extreme"};
  var PANSS_GENERIC_ANCHORS = {"1": "Symptom not present. Note the lowest rating is 1, not 0 — the minimum possible PANSS-30 total is therefore 30.", "2": "Questionable pathology; may be at the upper extreme of normal limits."};
  var PANSS_ITEM_ANCHORS = {
    "P1": {
      "3": "One or two delusions that are vague, uncrystallized, and not tenaciously held. They do not interfere with thinking, social relations, or behavior.",
      "4": "Either a kaleidoscopic array of poorly formed, unstable delusions, or a few well-formed delusions that occasionally interfere with thinking, social relations, or behavior.",
      "5": "Numerous well-formed delusions that are tenaciously held and occasionally interfere with thinking, social relations, or behavior.",
      "6": "A stable set of delusions that are crystallized, possibly systematized, tenaciously held, and clearly interfere with thinking, social relations, and behavior.",
      "7": "A stable set of delusions that are either highly systematized or very numerous and dominate major facets of life, frequently resulting in inappropriate, irresponsible action that may jeopardize the safety of the patient or others."
    },
    "P2": {
      "3": "Thinking is circumstantial, tangential, or paralogical. There is some difficulty directing thoughts toward a goal, and some loosening of associations may emerge under pressure.",
      "4": "Able to focus thoughts when communications are brief and structured, but becomes loose or irrelevant with more complex communication or under minimal pressure.",
      "5": "Generally has difficulty organizing thoughts, with frequent irrelevancies, disconnectedness, or loosening of associations even when not under pressure.",
      "6": "Thinking is seriously derailed and internally inconsistent, producing gross irrelevancies and disruption of thought processes that occur almost constantly.",
      "7": "Thought is disrupted to the point of incoherence, with marked loosening of associations resulting in total failure of communication (e.g., word salad or mutism)."
    },
    "P3": {
      "3": "One or two clearly formed but infrequent hallucinations, or a number of vague abnormal perceptions that do not distort thinking or behavior.",
      "4": "Hallucinations occur frequently but not continuously, and thinking and behavior are affected only to a minor extent.",
      "5": "Hallucinations are frequent, may involve more than one sensory modality, and tend to distort thinking and/or disrupt behavior. The patient may interpret them delusionally and respond emotionally and, at times, verbally.",
      "6": "Hallucinations are present almost continuously, causing major disruption of thinking and behavior. The patient treats them as real and is impeded by frequent emotional and verbal responses to them.",
      "7": "The patient is almost totally preoccupied with hallucinations that virtually dominate thinking and behavior. They are given a rigid delusional interpretation and provoke verbal and behavioral responses, including obedience to command hallucinations."
    },
    "P4": {
      "3": "Slightly agitated, hypervigilant, or mildly overaroused throughout the interview, but without distinct episodes of excitement or marked mood lability. Speech may be slightly pressured.",
      "4": "Agitation or overarousal is clearly evident throughout the interview, affecting speech and general mobility, or episodic outbursts occur sporadically.",
      "5": "Significant hyperactivity or frequent outbursts of motor activity make it difficult to sit still for more than several minutes at a time.",
      "6": "Marked excitement dominates the interview, delimits attention, and to some extent affects personal functions such as eating and sleeping.",
      "7": "Marked excitement seriously interferes with eating and sleeping and makes interpersonal interactions virtually impossible. Acceleration of speech and motor activity may produce incoherence and exhaustion."
    },
    "P5": {
      "3": "Some expansiveness or boastfulness is evident, but without clear-cut grandiose delusions.",
      "4": "Feels distinctly and unrealistically superior to others. Some poorly formed delusions about special status or abilities may be present but are not acted upon.",
      "5": "Clear-cut delusions concerning remarkable abilities, status, or power are expressed and influence attitude, but not behavior.",
      "6": "Clear-cut delusions of remarkable superiority involving more than one parameter (wealth, knowledge, fame, etc.) are expressed, notably influence interactions, and may be acted upon.",
      "7": "Thinking, interactions, and behavior are dominated by multiple delusions of amazing ability, wealth, knowledge, fame, power, and/or moral righteousness, which assume a bizarre quality."
    },
    "P6": {
      "3": "A guarded or even openly distrustful attitude, but thoughts, interactions, and behavior are minimally affected.",
      "4": "Distrustfulness is clearly evident and intrudes on the interview and/or behavior, but there is no evidence of persecutory delusions; or loosely formed persecutory delusions are present but do not seem to affect attitude or relations.",
      "5": "Marked distrustfulness leading to major disruption of interpersonal relations, or clear-cut persecutory delusions that have limited impact on relations and behavior.",
      "6": "Clear-cut, pervasive delusions of persecution that may be systematized and significantly interfere with interpersonal relations.",
      "7": "A network of systematized persecutory delusions dominates the patient's thinking, social relations, and behavior."
    },
    "P7": {
      "3": "Indirect or restrained communication of anger, such as sarcasm, disrespect, hostile expressions, and occasional irritability.",
      "4": "An overtly hostile attitude, with frequent irritability and direct expression of anger or resentment.",
      "5": "Highly irritable and occasionally verbally abusive or threatening.",
      "6": "Uncooperativeness and verbal abuse or threats notably influence the interview and seriously affect social relations. May be violent and destructive but is not physically assaultive toward others.",
      "7": "Marked anger results in extreme uncooperativeness precluding other interactions, or in episode(s) of physical assault toward others."
    },
    "N1": {
      "3": "Changes in facial expression and communicative gestures seem stilted, forced, artificial, or lacking in modulation.",
      "4": "Reduced range of facial expression and few expressive gestures produce a dull appearance.",
      "5": "Affect is generally flat, with only occasional changes in facial expression and a paucity of communicative gestures.",
      "6": "Marked flatness and deficiency of emotions most of the time. There may be unmodulated extreme affective discharges, such as excitement, rage, or inappropriate uncontrolled laughter.",
      "7": "Changes in facial expression and communicative gestures are virtually absent; the patient constantly shows a barren or wooden expression."
    },
    "N2": {
      "3": "Usually lacks initiative and occasionally shows deficient interest in surrounding events.",
      "4": "Generally distanced emotionally from the milieu and its challenges, but with encouragement can be engaged.",
      "5": "Clearly detached emotionally from persons and events, resisting efforts at engagement; appears aloof, docile, and purposeless, but can be involved briefly and tends to personal needs, sometimes with assistance.",
      "6": "Marked deficiency of interest and emotional commitment results in limited conversation and frequent neglect of personal functions, requiring supervision.",
      "7": "Almost totally withdrawn, uncommunicative, and neglectful of personal needs owing to profound lack of interest and emotional commitment."
    },
    "N3": {
      "3": "Conversation has a stilted, constrained, or artificial tone; it may lack emotional depth or stay on an impersonal, intellectual plane.",
      "4": "Typically aloof, with interpersonal distance quite evident. May answer questions mechanically, act bored, or express disinterest.",
      "5": "Disinterest is obvious and interpersonal contact glaringly deficient. May turn away, avoid eye contact, or fail to respond appropriately.",
      "6": "Highly indifferent, with marked interpersonal distance. Answers are perfunctory with little nonverbal involvement; eye contact and facial responsiveness are frequently absent.",
      "7": "Utterly uninvolved with the interviewer, appearing totally indifferent and consistently avoiding verbal and nonverbal interactions."
    },
    "N4": {
      "3": "Shows occasional interest in social activities but poor initiative; usually engages only when approached first.",
      "4": "Passively goes along with most social activities but in a disinterested or mechanical way, tending to recede into the background.",
      "5": "Passively participates in only a minority of activities, with virtually no interest or initiative, and generally spends little time with others.",
      "6": "Apathetic and isolated, participating very rarely in social activities, with very few spontaneous contacts and occasional neglect of personal needs.",
      "7": "Profoundly apathetic, socially isolated, and personally neglectful."
    },
    "N5": {
      "3": "Tends to give literal or personalized interpretations to more difficult proverbs and may have some problems with concepts that are fairly abstract or remotely related.",
      "4": "Often uses a concrete mode. Has difficulty with most proverbs and some categories, and tends to be distracted by functional aspects and salient features.",
      "5": "Deals primarily in a concrete mode, with difficulty on most proverbs and many categories.",
      "6": "Unable to grasp the abstract meaning of any proverbs or figurative expressions, and can classify only the simplest similarities.",
      "7": "Uses only concrete thinking, with no comprehension of proverbs, common metaphors or similes, or simple categories; even salient, simple features are not used to classify."
    },
    "N6": {
      "3": "Conversation shows little initiative. Answers tend to be brief and unembellished, requiring direct, leading questions.",
      "4": "Conversation lacks free flow and appears uneven or halting. Leading questions are frequently needed to elicit adequate responses.",
      "5": "Marked lack of spontaneity and openness; replies to questions with only one or two brief sentences.",
      "6": "Responses are limited mainly to a few words or short phrases meant to avoid or curtail communication (e.g., I don't know), seriously impairing conversation and making the interview highly unproductive.",
      "7": "Verbal output is restricted to at most an occasional utterance, making conversation impossible."
    },
    "N7": {
      "3": "Some rigidity in attitudes or beliefs. May refuse to consider alternative positions or have difficulty shifting from one idea to another.",
      "4": "Conversation revolves around a recurrent theme, producing difficulty shifting to a new topic.",
      "5": "Thinking is rigid and repetitious; despite the interviewer's efforts, conversation is limited to two or three dominating topics.",
      "6": "Uncontrolled repetition of demands, statements, ideas, or questions that severely impairs conversation.",
      "7": "Thinking, behavior, and conversation are dominated by constant repetition of fixed ideas or limited phrases, producing gross rigidity, inappropriateness, and restrictiveness of communication."
    },
    "G1": {
      "3": "Distinctly concerned about health or somatic issues, shown by occasional questions and desire for reassurance.",
      "4": "Complains about poor health or bodily malfunction, but without delusional conviction, and overconcern can be allayed by reassurance.",
      "5": "Numerous or frequent complaints about physical illness or bodily malfunction, or one or two clear-cut somatic delusions without preoccupation.",
      "6": "Preoccupied by one or a few clear-cut somatic delusions, but able to have moments of emotional distance from them.",
      "7": "Numerous, frequently reported somatic delusions, or a few of catastrophic nature, that totally dominate thinking and behavior."
    },
    "G2": {
      "3": "Expresses some worry, overconcern, or subjective restlessness, but without somatic or behavioral consequences.",
      "4": "Reports distinct nervousness reflected in mild physical manifestations such as fine hand tremor and excessive perspiration.",
      "5": "Reports serious anxiety with significant physical and behavioral consequences, such as marked tension, poor concentration, palpitations, or impaired sleep.",
      "6": "A subjective state of almost constant fear associated with phobias, marked restlessness, or numerous somatic manifestations.",
      "7": "Life is seriously disrupted by anxiety, present almost constantly and at times reaching panic proportions or manifested in actual panic attacks."
    },
    "G3": {
      "3": "On questioning, reveals some vague guilt or self-blame for a minor incident, but is clearly not overly concerned.",
      "4": "Distinct concern over responsibility for a real incident, but without preoccupation, and attitude and behavior are essentially unaffected.",
      "5": "A strong sense of guilt associated with self-deprecation or a belief that punishment is deserved. May have a delusional basis, may be a source of preoccupation and/or depressed mood, and cannot be readily allayed.",
      "6": "Strong guilt takes on a delusional quality and leads to hopelessness or worthlessness; the patient believes harsh sanctions are deserved and may see the current situation as such punishment.",
      "7": "Life is dominated by unshakable delusions of guilt for which drastic punishment is felt to be deserved (e.g., imprisonment, torture, death); associated suicidal thoughts are possible."
    },
    "G4": {
      "3": "Posture and movements indicate slight apprehensiveness, such as minor rigidity, occasional restlessness, shifting of position, or fine rapid hand tremor.",
      "4": "A clearly nervous appearance from manifestations such as fidgety behavior, obvious hand tremor, excessive perspiration, or nervous mannerisms.",
      "5": "Pronounced tension evidenced by numerous manifestations (nervous shaking, profuse sweating, restlessness), but conduct in the interview is not significantly affected.",
      "6": "Pronounced tension to the point that interpersonal interactions are disrupted; may be constantly fidgeting, unable to sit still for long, or hyperventilating.",
      "7": "Marked tension manifested by signs of panic or gross motor acceleration, such as rapid restless pacing and inability to remain seated for more than a minute, making sustained conversation impossible."
    },
    "G5": {
      "3": "Slight awkwardness in movements or minor rigidity of posture.",
      "4": "Movements are notably awkward or disjointed, or an unnatural posture is maintained for brief periods.",
      "5": "Occasional bizarre rituals or contorted posture, or an abnormal position sustained for extended periods.",
      "6": "Frequent repetition of bizarre rituals, mannerisms, or stereotyped movements, or a contorted posture sustained for extended periods.",
      "7": "Functioning is seriously impaired by virtually constant ritualistic, manneristic, or stereotyped movements, or by an unnatural fixed posture sustained most of the time."
    },
    "G6": {
      "3": "Expresses some sadness or discouragement only on questioning, without evidence of depression in general attitude or demeanor.",
      "4": "Distinct sadness or hopelessness, possibly volunteered, but with no major impact on behavior or social functioning, and the patient can usually be cheered up.",
      "5": "Distinctly depressed mood with obvious sadness, pessimism, loss of social interest, psychomotor retardation, and some interference in appetite and sleep; cannot easily be cheered up.",
      "6": "Markedly depressed mood with sustained misery, occasional crying, hopelessness, and worthlessness, plus major interference in appetite and/or sleep and in motor and social functions, with possible self-neglect.",
      "7": "Depressive feelings seriously interfere in most major functions: frequent crying, pronounced somatic symptoms, impaired concentration, psychomotor retardation, social disinterest, self-neglect, possible depressive or nihilistic delusions, and possible suicidal ideation or action."
    },
    "G7": {
      "3": "Slight but noticeable diminution in rate of movements and speech; may be somewhat underproductive in conversation and gestures.",
      "4": "Clearly slow in movements, and speech may show poor productivity, including long response latency, extended pauses, or slow pace.",
      "5": "Marked reduction in motor activity renders communication highly unproductive or delimits social and occupational functioning; usually found sitting or lying down.",
      "6": "Extremely slow movements resulting in minimal activity and speech; the day is essentially spent sitting idly or lying down.",
      "7": "Almost completely immobile and virtually unresponsive to external stimuli."
    },
    "G8": {
      "3": "Complies but with resentment, impatience, or sarcasm; may inoffensively object to sensitive probing.",
      "4": "Occasional outright refusal to meet normal social demands (e.g., making own bed, attending scheduled programs). May project a hostile, defensive, or negative attitude but usually can be worked with.",
      "5": "Frequently uncompliant with the demands of the milieu; obvious defensiveness or irritability with the interviewer and possible unwillingness to address many questions.",
      "6": "Highly uncooperative, negativistic, and possibly belligerent; refuses most social demands and may be unwilling to initiate or conclude the full interview.",
      "7": "Active resistance seriously affects virtually all major areas of functioning; may refuse to join social activities, attend to hygiene, converse with family or staff, or participate even briefly in an interview."
    },
    "G9": {
      "3": "Thought content is somewhat peculiar or idiosyncratic, or familiar ideas are framed in an odd context.",
      "4": "Ideas are frequently distorted and occasionally seem quite bizarre.",
      "5": "Many strange and fanciful thoughts (e.g., being the adopted child of royalty) or some that are patently absurd.",
      "6": "Many illogical or absurd ideas, or some with a distinctly bizarre quality (e.g., having three heads, being a visitor from outer space).",
      "7": "Thinking is replete with absurd, bizarre, and grotesque ideas."
    },
    "G10": {
      "3": "General orientation is adequate but there is difficulty with specifics (e.g., knows location but not the address; knows staff names but not their functions; knows the month but confuses the day or adjacent date).",
      "4": "Only partial success in recognizing persons, place, and time (e.g., knows it is a hospital but not its name; knows the city but not the district; knows the year and season but not the month).",
      "5": "Considerable failure in recognizing persons, place, and time; only a vague notion of location, unfamiliar with most people, may know the year but not the month, day, or season.",
      "6": "Marked failure in recognizing persons, place, and time (e.g., no knowledge of whereabouts, confuses the date by more than a year, can name only one or two individuals).",
      "7": "Completely disoriented to persons, place, and time, with gross confusion or total ignorance about location, the year, and even the most familiar people."
    },
    "G11": {
      "3": "Limited concentration shown by occasional vulnerability to distraction or faltering attention toward the end of the interview.",
      "4": "Conversation is affected by easy distractibility, difficulty sustaining concentration on a topic, or problems shifting attention to new topics.",
      "5": "Conversation is seriously hampered by poor concentration, distractibility, and difficulty shifting focus appropriately.",
      "6": "Attention can be sustained only briefly or with great effort, owing to marked distraction by internal or external stimuli.",
      "7": "Attention is so disrupted that even brief conversation is not possible."
    },
    "G12": {
      "3": "Recognizes having a psychiatric disorder but clearly underestimates its seriousness, the implications for treatment, or the importance of relapse prevention. Future planning may be poorly conceived.",
      "4": "Only vague or shallow recognition of illness, with fluctuating acknowledgment or little awareness of major symptoms (delusions, disorganized thinking, suspiciousness, withdrawal). May rationalize treatment as relieving lesser symptoms such as anxiety or insomnia.",
      "5": "Acknowledges past but not present psychiatric disorder. If challenged, may concede some insignificant symptoms, which are explained away by misinterpretation or delusional thinking; the need for treatment is not recognized.",
      "6": "Denies ever having had a psychiatric disorder, disclaims any past or present symptoms, and, though compliant, denies the need for treatment and hospitalization.",
      "7": "Emphatic denial of past and present illness. Gives current hospitalization and treatment a delusional interpretation (e.g., punishment, persecution) and may therefore refuse to cooperate with therapists, medication, or other treatment."
    },
    "G13": {
      "3": "Some indecisiveness in conversation and thinking that may impede verbal and cognitive processes to a minor extent.",
      "4": "Often ambivalent, with clear difficulty reaching decisions. Conversation may be marred by alternation in thinking, clearly impairing verbal and cognitive functioning.",
      "5": "Disturbance of volition interferes in thinking as well as behavior, with pronounced indecision that impedes initiating and continuing social and motor activities and may be evident in halting speech.",
      "6": "Disturbance of volition interferes in simple, automatic motor functions such as dressing and grooming, and markedly affects speech.",
      "7": "Almost complete failure of volition, with gross inhibition of movement and speech resulting in immobility and/or mutism."
    },
    "G14": {
      "3": "Tends to be easily angered and frustrated under stress or when gratification is denied, but rarely acts on impulse.",
      "4": "Becomes angered and verbally abusive with minimal provocation; may be occasionally threatening or destructive, or have one or two episodes of physical confrontation or a minor brawl.",
      "5": "Repeated impulsive episodes involving verbal abuse, destruction of property, or physical threats, possibly with one or two episodes of serious assault requiring isolation, restraint, or PRN sedation.",
      "6": "Frequently impulsively aggressive, threatening, demanding, and destructive without apparent consideration of consequences; may be assaultive and possibly sexually offensive, and may act on command hallucinations.",
      "7": "Homicidal attacks, sexual assaults, repeated brutality, or self-destructive behavior; requires constant direct supervision or external constraints owing to inability to control dangerous impulses."
    },
    "G15": {
      "3": "Occasionally self-absorbed, but the appearance can be dispelled through requests for attention.",
      "4": "Frequently appears absorbed in autistic-like private fantasies or experiences, but responses can be elicited with some effort.",
      "5": "Marked preoccupation with autistic-like experiences that delimits concentration and the ability to converse and causes withdrawal from the milieu, but the patient can be repeatedly reengaged.",
      "6": "Preoccupied virtually all the time with autistic experiences, seriously limiting attention and concentration; may show a paucity of conversation and self-absorbed mannerisms.",
      "7": "Nearly totally immersed in autistic experiences that dominate thinking and behavior, with inability to attend to external events."
    },
    "G16": {
      "3": "Seems ill at ease with others and prefers to be alone, but participates in social functions when required.",
      "4": "Grudgingly attends all or most social activities, but may need persuasion or may leave prematurely owing to anxiety, suspiciousness, or hostility.",
      "5": "Fearfully or angrily keeps away from many social interactions despite others' efforts to engage, and tends to spend unstructured time alone.",
      "6": "Participates in very few social activities owing to fear, hostility, or distrust; when approached, shows a strong tendency to break off interactions and generally isolates.",
      "7": "Cannot be engaged in social activities owing to pronounced fears, hostility, or persecutory delusions, and avoids all interactions to the extent possible, remaining isolated."
    }
  };

  function psAnchorText(itemId, level) {
    level = String(level);
    if (PANSS_GENERIC_ANCHORS[level]) return PANSS_GENERIC_ANCHORS[level];
    var it = PANSS_ITEM_ANCHORS[itemId];
    return (it && it[level]) || '';
  }

  function psItemIdFromItem(itemEl, prefix) {
    var radio = itemEl.querySelector('input[type="radio"]');
    if (!radio) return null;
    return (radio.getAttribute('name') || '').replace(prefix + '-', '');
  }

  function psBuildRatingGuide(itemId) {
    var det = document.createElement('details');
    det.className = 'ps-rating-guide';
    var sum = document.createElement('summary');
    sum.className = 'ps-guide-summary';
    sum.textContent = 'Rating guide (1–7 anchors for ' + itemId + ')';
    det.appendChild(sum);
    var list = document.createElement('div');
    list.className = 'ps-anchor-list';
    ['1','2','3','4','5','6','7'].forEach(function(lvl) {
      var row = document.createElement('div');
      row.className = 'ps-anchor-row';
      var num = document.createElement('span');
      num.className = 'ps-anchor-num';
      num.textContent = lvl;
      var body = document.createElement('div');
      body.className = 'ps-anchor-body';
      var lab = document.createElement('span');
      lab.className = 'ps-anchor-label';
      lab.textContent = PANSS_SEVERITY_LABELS[lvl];
      var txt = document.createElement('span');
      txt.className = 'ps-anchor-desc';
      txt.textContent = ' — ' + psAnchorText(itemId, lvl);
      body.appendChild(lab);
      body.appendChild(txt);
      row.appendChild(num);
      row.appendChild(body);
      list.appendChild(row);
    });
    det.appendChild(list);
    return det;
  }

  function psInjectRatingGuides() {
    [['ps-form-6', 'ps6'], ['ps-form-30', 'ps30']].forEach(function(pair) {
      var form = document.getElementById(pair[0]);
      if (!form) return;
      var items = form.querySelectorAll('.ps-item');
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.querySelector('.ps-rating-guide')) continue;
        var id = psItemIdFromItem(item, pair[1]);
        if (!id) continue;
        var groups = item.querySelectorAll('.ps-rating-group');
        for (var g = 0; g < groups.length; g++) {
          var input = groups[g].querySelector('input[type="radio"]');
          var label = groups[g].querySelector('.ps-radio-label');
          if (input && label) {
            var lvl = input.value;
            label.setAttribute('title', lvl + ' = ' + PANSS_SEVERITY_LABELS[lvl] + ': ' + psAnchorText(id, lvl));
          }
        }
        item.appendChild(psBuildRatingGuide(id));
      }
    });
  }

  function psInjectScoringNote() {
    [['ps-form-6'], ['ps-form-30']].forEach(function(pair) {
      var form = document.getElementById(pair[0]);
      if (!form || form.querySelector('.ps-scoring-note')) return;
      var det = document.createElement('details');
      det.className = 'ps-scoring-note';
      det.innerHTML =
        '<summary class="ps-note-summary">How to rate the 1–7 severity scale</summary>' +
        '<div class="ps-note-body">' +
        '<p>Rate each item on its <strong>single most severe manifestation over the past week</strong>, integrating the patient interview, direct observation, and collateral from family or staff. Each rating reflects a joint judgment of <strong>frequency, intensity, and functional impairment</strong>. A rating of <strong>1 means the symptom is absent</strong> — there is no 0, so the minimum possible PANSS-30 total is 30.</p>' +
        '<table class="ps-note-table"><tbody>' +
        '<tr><td>1</td><td><strong>Absent</strong></td><td>Symptom not present.</td></tr>' +
        '<tr><td>2</td><td><strong>Minimal</strong></td><td>Questionable pathology; may be the upper edge of normal.</td></tr>' +
        '<tr><td>3</td><td><strong>Mild</strong></td><td>Clearly present but not pronounced; interferes little with day-to-day function.</td></tr>' +
        '<tr><td>4</td><td><strong>Moderate</strong></td><td>A serious problem, but present only intermittently or intruding on function only moderately.</td></tr>' +
        '<tr><td>5</td><td><strong>Moderately severe</strong></td><td>Clear, frequent, with definite functional impact — but not yet dominating.</td></tr>' +
        '<tr><td>6</td><td><strong>Severe</strong></td><td>Pronounced, very frequent/intense, highly disruptive, prominent in the patient’s life.</td></tr>' +
        '<tr><td>7</td><td><strong>Extreme</strong></td><td>Most severe; dominates and grossly interferes, typically requiring supervision or intervention.</td></tr>' +
        '</tbody></table>' +
        '<p class="ps-note-cite">Item-specific anchors below each symptom are the operational criteria that resolve borderline ratings. Anchors adapted from Kay SR, Fiszbein A, Opler LA. <em>Schizophr Bull.</em> 1987;13(2):261–276.</p>' +
        '</div>';
      form.insertBefore(det, form.firstChild);
    });
  }

  function init() {
    initTabs();
    initAccordions();
    psInjectScoringNote();
    psInjectRatingGuides();

    var form6 = document.getElementById('ps-form-6');
    if (form6) {
      form6.querySelectorAll('input[type="radio"]').forEach(function(radio) {
        radio.addEventListener('change', updatePANSS6Scores);
      });
    }

    var form30 = document.getElementById('ps-form-30');
    if (form30) {
      form30.querySelectorAll('input[type="radio"]').forEach(function(radio) {
        radio.addEventListener('change', updatePANSS30Scores);
      });
    }

    var ps6Generate = document.getElementById('ps6-generate');
    if (ps6Generate) ps6Generate.addEventListener('click', generatePANSS6Report);

    var ps30Generate = document.getElementById('ps30-generate');
    if (ps30Generate) ps30Generate.addEventListener('click', generatePANSS30Report);

    var ps6Reset = document.getElementById('ps6-reset');
    if (ps6Reset) {
      ps6Reset.addEventListener('click', function() {
        confirmReset('Are you sure you want to reset all ratings?', function() {
          document.getElementById('ps-form-6').reset();
          updatePANSS6Scores();
        });
      });
    }

    var ps30Reset = document.getElementById('ps30-reset');
    if (ps30Reset) {
      ps30Reset.addEventListener('click', function() {
        confirmReset('Are you sure you want to reset all ratings?', function() {
          document.getElementById('ps-form-30').reset();
          updatePANSS30Scores();
        });
      });
    }

    addPrintButtons();
    loadSchema();
    updatePANSS6Scores();
    updatePANSS30Scores();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

(function() {
  'use strict';

  var fallbackScale = {
    id: 'slums',
    short_title: 'SLUMS',
    score: { max: 30 },
    items: [
      { id: '1', label: 'Q1 (Day of Week)', max: 1, domain: 'orientation' },
      { id: '2', label: 'Q2 (Year)', max: 1, domain: 'orientation' },
      { id: '3', label: 'Q3 (State)', max: 1, domain: 'orientation' },
      { id: '5a', label: 'Q5A (Spending)', max: 1, domain: 'executive' },
      { id: '5b', label: 'Q5B (Money Left)', max: 2, domain: 'executive' },
      { id: '6', label: 'Q6 (Animal Naming)', max: 3, domain: 'language' },
      { id: '7-apple', label: 'Q7A (Apple - Recall)', max: 1, domain: 'memory' },
      { id: '7-pen', label: 'Q7B (Pen - Recall)', max: 1, domain: 'memory' },
      { id: '7-tie', label: 'Q7C (Tie - Recall)', max: 1, domain: 'memory' },
      { id: '7-house', label: 'Q7D (House - Recall)', max: 1, domain: 'memory' },
      { id: '7-car', label: 'Q7E (Car - Recall)', max: 1, domain: 'memory' },
      { id: '8-648', label: 'Q8A (648 Backwards)', max: 1, domain: 'workingmemory' },
      { id: '8-8537', label: 'Q8B (8537 Backwards)', max: 1, domain: 'workingmemory' },
      { id: '9-markers', label: 'Q9A (Clock Markers)', max: 2, domain: 'visuospatial' },
      { id: '9-time', label: 'Q9B (Clock Time)', max: 2, domain: 'visuospatial' },
      { id: '10-triangle', label: 'Q10A (Triangle X)', max: 1, domain: 'attention' },
      { id: '10-largest', label: 'Q10B (Largest Figure)', max: 1, domain: 'attention' },
      { id: '11-name', label: 'Q11A (Story Name)', max: 2, domain: 'memory' },
      { id: '11-work', label: 'Q11B (Story Work)', max: 2, domain: 'memory' },
      { id: '11-when', label: 'Q11C (Story Timing)', max: 2, domain: 'memory' },
      { id: '11-state', label: 'Q11D (Story State)', max: 2, domain: 'memory' }
    ],
    domains: [
      { id: 'orientation', label: 'Orientation/Temporal-Spatial', max: 3, items: ['1', '2', '3'] },
      { id: 'executive', label: 'Executive Functioning', max: 3, items: ['5a', '5b'] },
      { id: 'attention', label: 'Attention & Concentration', max: 2, items: ['10-triangle', '10-largest'] },
      { id: 'memory', label: 'Memory (Episodic Retrieval)', max: 13, items: ['7-apple', '7-pen', '7-tie', '7-house', '7-car', '11-name', '11-work', '11-when', '11-state'] },
      { id: 'workingmemory', label: 'Working Memory', max: 2, items: ['8-648', '8-8537'] },
      { id: 'language', label: 'Language/Processing Speed', max: 3, items: ['6'] },
      { id: 'visuospatial', label: 'Visuospatial/Construction', max: 4, items: ['9-markers', '9-time'] }
    ],
    education_bands: {
      'high-school': [
        { min: 27, max: 30, label: 'Normal', note: 'No cognitive impairment detected.' },
        { min: 21, max: 26, label: 'Mild Neurocognitive Disorder (MNCD)', note: 'Cognitive decline present; comprehensive evaluation recommended.' },
        { min: 0, max: 20, label: 'Dementia', note: 'Significant cognitive impairment; urgent neuropsychological evaluation indicated.' }
      ],
      'less-than-high-school': [
        { min: 25, max: 30, label: 'Normal', note: 'No cognitive impairment detected.' },
        { min: 20, max: 24, label: 'Mild Neurocognitive Disorder (MNCD)', note: 'Cognitive decline present; comprehensive evaluation recommended.' },
        { min: 0, max: 19, label: 'Dementia', note: 'Significant cognitive impairment; urgent neuropsychological evaluation indicated.' }
      ]
    },
    report: { heading: 'SLUMS Examination Summary' },
    references: [
      { label: 'Tariq SH, Tumosa N, Chibnall JT, Perry HM III, Morley JE. Am J Geriatr Psychiatry. 2006;14(11):900-910.' }
    ]
  };

  var scale = fallbackScale;
  var scores = {};
  var hasInteracted = false;

  function applyScale(nextScale) {
    if (!nextScale) return;
    scale = nextScale;
    initScoreKeys();
    if (hasInteracted) updateScores();
    else updateSummary(0, zeroDomainScores());
  }

  function initScoreKeys() {
    (scale.items || []).forEach(function(item) {
      if (scores[item.id] === undefined) scores[item.id] = 0;
    });
  }

  initScoreKeys();

  if (window.ToolUtils && ToolUtils.loadClinicalScale) {
    ToolUtils.loadClinicalScale('slums').then(applyScale).catch(function(){});
  }

  function init() {
    document.querySelectorAll('.sl-q-check').forEach(function(cb) {
      cb.addEventListener('change', handleCheckboxChange);
    });

    document.querySelectorAll('.sl-q-radio').forEach(function(radio) {
      radio.addEventListener('change', handleRadioChange);
    });

    document.querySelectorAll('input[name="sl-education"]').forEach(function(radio) {
      radio.addEventListener('change', function() {
        hasInteracted = true;
        updateScores();
      });
    });

    document.getElementById('sl-reset-btn').addEventListener('click', resetExam);
    document.getElementById('sl-copy-summary').addEventListener('click', copySummary);
  }

  function handleCheckboxChange(e) {
    var q = e.target.dataset.question;
    var points = parseInt(e.target.dataset.points, 10);
    hasInteracted = true;
    scores[q] = e.target.checked ? points : 0;
    updateScores();
  }

  function handleRadioChange(e) {
    var q = e.target.dataset.question;
    var points = parseInt(e.target.dataset.points, 10);
    hasInteracted = true;
    scores[q] = points;
    updateScores();
  }

  function zeroDomainScores() {
    var out = {};
    (scale.domains || []).forEach(function(domain) {
      out[domain.id] = 0;
    });
    return out;
  }

  function scoreMax() {
    return (scale.score && scale.score.max) || 30;
  }

  function domainById(domainId) {
    return (scale.domains || []).filter(function(domain) { return domain.id === domainId; })[0];
  }

  function itemById(itemId) {
    return (scale.items || []).filter(function(item) { return item.id === itemId; })[0];
  }

  function getEducationLevel() {
    var checked = document.querySelector('input[name="sl-education"]:checked');
    return checked ? checked.value : 'high-school';
  }

  function getInterpretation(score, eduLevel) {
    var bands = (scale.education_bands && scale.education_bands[eduLevel]) || fallbackScale.education_bands[eduLevel] || [];
    for (var i = 0; i < bands.length; i++) {
      if (score >= bands[i].min && score <= bands[i].max) return bands[i];
    }
    return bands[bands.length - 1] || { label: 'Dementia', note: 'Significant cognitive impairment; urgent neuropsychological evaluation indicated.' };
  }

  function interpretationClass(label) {
    if (label === 'Normal') return 'sl-interp-normal';
    if (label.indexOf('Mild Neurocognitive') === 0) return 'sl-interp-mncd';
    return 'sl-interp-dementia';
  }

  function updateScores() {
    var totalScore = 0;
    Object.keys(scores).forEach(function(q) {
      totalScore += scores[q] || 0;
    });

    var domainScores = {};
    (scale.domains || []).forEach(function(domain) {
      domainScores[domain.id] = (domain.items || []).reduce(function(sum, q) {
        return sum + (scores[q] || 0);
      }, 0);
    });

    document.getElementById('sl-total-score').textContent = totalScore;
    updateInterpretation(totalScore, getEducationLevel());

    Object.keys(domainScores).forEach(function(domainId) {
      var domain = domainById(domainId);
      updateDomainDisplay(domainId, domainScores[domainId], domain ? domain.max : 1);
    });

    updateSummary(totalScore, domainScores);

    var results = document.querySelector('.sl-results-section');
    if (results) results.classList.add('sl-show');
  }

  function updateInterpretation(score, eduLevel) {
    var interp = getInterpretation(score, eduLevel);
    var interpDiv = document.getElementById('sl-interpretation');
    interpDiv.className = interpretationClass(interp.label);
    interpDiv.querySelector('.sl-interp-category').textContent = interp.label;
    interpDiv.querySelector('.sl-interp-note').textContent = interp.note;
  }

  function updateDomainDisplay(domain, score, maxScore) {
    var scoreEl = document.getElementById('sl-score-' + domain);
    var barEl = document.getElementById('sl-bar-' + domain);
    var noteEl = document.getElementById('sl-note-' + domain);
    if (!scoreEl || !barEl || !noteEl) return;

    scoreEl.textContent = score;
    var percent = maxScore ? (score / maxScore) * 100 : 0;
    barEl.style.width = percent + '%';
    barEl.classList.remove('sl-warning', 'sl-critical');
    if (percent < 50) {
      barEl.classList.add('sl-critical');
    } else if (percent < 80) {
      barEl.classList.add('sl-warning');
    }

    if (score < maxScore) noteEl.classList.add('sl-show');
    else noteEl.classList.remove('sl-show');
  }

  function referenceText() {
    return (scale.references || fallbackScale.references || []).map(function(ref) {
      return 'Reference: ' + ref.label;
    }).join('\n');
  }

  function updateSummary(totalScore, domainScores) {
    var eduLevel = getEducationLevel();
    var eduDisplay = eduLevel === 'high-school' ? 'High School or Higher' : 'Less Than High School';
    var interp = getInterpretation(totalScore, eduLevel);

    var summary = ((scale.report && scale.report.heading) || fallbackScale.report.heading) + '\n';
    summary += '='.repeat(50) + '\n\n';
    summary += 'Date: ' + ToolUtils.dateStamp() + '\n';
    summary += 'Education Level: ' + eduDisplay + '\n\n';
    summary += 'TOTAL SCORE: ' + totalScore + '/' + scoreMax() + '\n';
    summary += 'Interpretation: ' + interp.label.toUpperCase() + '\n' + interp.note + '\n\n';

    summary += 'QUESTION-BY-QUESTION RESULTS\n';
    summary += '--------------------------------------------------\n';
    (scale.items || []).forEach(function(item) {
      var label = item.label || item.text || item.id;
      summary += label + ': ' + (scores[item.id] || 0) + '/' + item.max + '\n';
    });

    summary += '\nCOGNITIVE DOMAIN ANALYSIS\n';
    summary += '--------------------------------------------------\n';
    (scale.domains || []).forEach(function(domain) {
      summary += domain.label + ': ' + (domainScores[domain.id] || 0) + '/' + domain.max + '\n';
    });

    var impairedDomains = (scale.domains || []).filter(function(domain) {
      return (domainScores[domain.id] || 0) < domain.max;
    }).map(function(domain) { return domain.id; });

    if (impairedDomains.length > 0) {
      summary += '\nIMPAIRED DOMAINS (Clinical Commentary)\n';
      summary += '--------------------------------------------------\n';
      if (impairedDomains.indexOf('orientation') !== -1) {
        summary += '\nOrientation: Involves hippocampus, medial temporal lobe, thalamus.\n';
        summary += 'Temporal disorientation often precedes spatial disorientation in Alzheimer disease.\n';
      }
      if (impairedDomains.indexOf('executive') !== -1) {
        summary += '\nExecutive (Q5 Calculation): Involves prefrontal cortex and anterior cingulate.\n';
        summary += 'Deficits manifest as impaired calculation and multi-step reasoning.\n';
      }
      if (impairedDomains.indexOf('attention') !== -1) {
        summary += '\nAttention: Involves frontal/parietal networks and reticular activating system.\n';
        summary += 'Impaired early in delirium and in attentional disorders.\n';
      }
      if (impairedDomains.indexOf('memory') !== -1) {
        summary += '\nMemory: Involves hippocampus, medial temporal lobe, and Papez circuit.\n';
        summary += 'Disproportionate memory loss suggests Alzheimer-pattern impairment.\n';
      }
      if (impairedDomains.indexOf('workingmemory') !== -1) {
        summary += '\nWorking Memory: Involves dorsolateral prefrontal cortex and posterior parietal cortex.\n';
        summary += 'Impaired in frontostriatal conditions, schizophrenia, and delirium.\n';
      }
      if (impairedDomains.indexOf('language') !== -1) {
        summary += '\nLanguage/Processing: Involves left temporal lobe and frontal-subcortical networks.\n';
        summary += 'Animal fluency taxes language networks and processing speed.\n';
      }
      if (impairedDomains.indexOf('visuospatial') !== -1) {
        summary += '\nVisuospatial: Involves right parietal and parietal-occipital networks.\n';
        summary += 'Clock drawing engages construction and executive planning.\n';
      }
    }

    summary += '\n' + '='.repeat(50) + '\n';
    summary += referenceText() + '\n';
    document.getElementById('sl-summary-text').textContent = summary;
  }

  function resetExam() {
    ToolUtils.confirmReset('Reset the SLUMS examination?', function() {
      Object.keys(scores).forEach(function(k) { scores[k] = 0; });
      hasInteracted = false;
      document.querySelectorAll('.sl-q-check').forEach(function(cb) { cb.checked = false; });
      document.querySelectorAll('.sl-q-radio').forEach(function(r) { r.checked = false; });
      var results = document.querySelector('.sl-results-section');
      if (results) results.classList.remove('sl-show');
      updateSummary(0, zeroDomainScores());
    });
  }

  function copySummary() {
    var text = document.getElementById('sl-summary-text').textContent;
    ToolUtils.copyWithButton(text, document.getElementById('sl-copy-summary'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  (function() {
    var total = 60;
    var remaining = total;
    var interval = null;
    var running = false;
    var circumference = 2 * Math.PI * 52;

    var display = document.getElementById('sl-timer-display');
    var progress = document.getElementById('sl-timer-progress');
    var startBtn = document.getElementById('sl-timer-start');
    var resetBtn = document.getElementById('sl-timer-reset');
    if (!display || !progress || !startBtn || !resetBtn) return;

    function fmt(sec) {
      var m = Math.floor(sec / 60);
      var s = sec % 60;
      return m + ':' + (s < 10 ? '0' : '') + s;
    }

    function render() {
      display.textContent = fmt(remaining);
      var pct = remaining / total;
      progress.setAttribute('stroke-dashoffset', circumference * (1 - pct));
      if (remaining <= 10) {
        progress.setAttribute('stroke', '#b91c1c');
      } else if (remaining <= 20) {
        progress.setAttribute('stroke', 'var(--accent2)');
      } else {
        progress.setAttribute('stroke', 'var(--accent)');
      }
    }

    function stop() {
      running = false;
      clearInterval(interval);
      interval = null;
    }

    function tick() {
      if (remaining <= 0) {
        stop();
        display.classList.add('sl-timer-done');
        display.textContent = '0:00';
        startBtn.textContent = 'Done';
        startBtn.disabled = true;
        startBtn.style.opacity = '0.5';
        return;
      }
      remaining--;
      render();
    }

    function start() {
      if (remaining <= 0) return;
      running = true;
      display.classList.remove('sl-timer-done');
      startBtn.textContent = 'Pause';
      startBtn.classList.add('sl-timer-running');
      interval = setInterval(tick, 1000);
    }

    function pause() {
      running = false;
      clearInterval(interval);
      interval = null;
      startBtn.textContent = 'Resume';
      startBtn.classList.remove('sl-timer-running');
    }

    function resetTimer() {
      stop();
      remaining = total;
      display.classList.remove('sl-timer-done');
      startBtn.textContent = 'Start';
      startBtn.classList.remove('sl-timer-running');
      startBtn.disabled = false;
      startBtn.style.opacity = '';
      render();
    }

    startBtn.addEventListener('click', function() {
      if (running) pause(); else start();
    });
    resetBtn.addEventListener('click', resetTimer);
    render();
  })();
})();

(function() {
  var fallbackScale = {
    id: 'asrs',
    title: 'Adult ADHD Self-Report Scale v1.1',
    short_title: 'ASRS v1.1',
    source_ids: ['kessler-2005-asrs'],
    score: {
      min: 0,
      max: 6,
      item_count: 18,
      method: 'threshold_count',
      scored_item_numbers: [1, 2, 3, 4, 5, 6],
      positive_threshold: 4
    },
    options: [
      { value: 0, label: 'Never' },
      { value: 1, label: 'Rarely' },
      { value: 2, label: 'Sometimes' },
      { value: 3, label: 'Often' },
      { value: 4, label: 'Very Often' }
    ],
    items: [
      { id: 'asrs-1', number: 1, section: 'part-a', text: 'Trouble wrapping up details', clinical_threshold: 2 },
      { id: 'asrs-2', number: 2, section: 'part-a', text: 'Difficulty organizing', clinical_threshold: 2 },
      { id: 'asrs-3', number: 3, section: 'part-a', text: 'Problems remembering appointments', clinical_threshold: 2 },
      { id: 'asrs-4', number: 4, section: 'part-a', text: 'Avoid/delay starting tasks requiring thought', clinical_threshold: 3 },
      { id: 'asrs-5', number: 5, section: 'part-a', text: 'Fidget or squirm when sitting', clinical_threshold: 3 },
      { id: 'asrs-6', number: 6, section: 'part-a', text: 'Feel overly active, driven by a motor', clinical_threshold: 3 },
      { id: 'asrs-7', number: 7, section: 'part-b', text: 'Careless mistakes on boring projects' },
      { id: 'asrs-8', number: 8, section: 'part-b', text: 'Difficulty keeping attention on boring work' },
      { id: 'asrs-9', number: 9, section: 'part-b', text: 'Difficulty concentrating when others speak' },
      { id: 'asrs-10', number: 10, section: 'part-b', text: 'Misplace or difficulty finding things' },
      { id: 'asrs-11', number: 11, section: 'part-b', text: 'Distracted by activity or noise' },
      { id: 'asrs-12', number: 12, section: 'part-b', text: 'Leave seat in meetings' },
      { id: 'asrs-13', number: 13, section: 'part-b', text: 'Feel restless or fidgety' },
      { id: 'asrs-14', number: 14, section: 'part-b', text: 'Difficulty unwinding and relaxing' },
      { id: 'asrs-15', number: 15, section: 'part-b', text: 'Talk too much in social situations' },
      { id: 'asrs-16', number: 16, section: 'part-b', text: 'Finish sentences of others' },
      { id: 'asrs-17', number: 17, section: 'part-b', text: 'Difficulty waiting your turn' },
      { id: 'asrs-18', number: 18, section: 'part-b', text: 'Interrupt others' }
    ],
    severity_bands: [
      { min: 0, max: 3, label: 'Below threshold', class: 'as-negative', action: 'Continue diagnostic assessment based on clinical context' },
      { min: 4, max: 6, label: 'Positive screen - further evaluation warranted', class: 'as-positive', action: 'Complete comprehensive ADHD evaluation' }
    ],
    report: {
      heading: 'Adult ADHD Self-Report Scale (ASRS v1.1)',
      scoring_note: 'Scoring: Part A counts item-specific threshold responses only. Items 1-3 count at Sometimes or higher; items 4-6 count at Often or higher.',
      screening_note: 'A positive ASRS Part A screen is not diagnostic and should be followed by comprehensive ADHD assessment.'
    }
  };

  var scale = fallbackScale;

  function optionLabel(value) {
    value = parseInt(value, 10);
    for (var i = 0; i < scale.options.length; i++) {
      if (scale.options[i].value === value) return scale.options[i].label;
    }
    return 'Not answered';
  }

  function getItem(itemNumber) {
    return scale.items[itemNumber - 1] || { number: itemNumber, text: 'Item ' + itemNumber };
  }

  function getSelectedValue(itemNumber) {
    var el = document.querySelector('input[name="asrs-' + itemNumber + '"]:checked');
    return el ? parseInt(el.value, 10) : null;
  }

  function getScoredItemNumbers() {
    return (scale.score && scale.score.scored_item_numbers) || [1, 2, 3, 4, 5, 6];
  }

  function partAResult() {
    var clinical = 0;
    var answered = 0;
    var scored = getScoredItemNumbers();

    scored.forEach(function(itemNumber) {
      var val = getSelectedValue(itemNumber);
      var item = getItem(itemNumber);
      if (val !== null) {
        answered++;
        if (val >= item.clinical_threshold) clinical++;
      }
    });

    return {
      clinical: clinical,
      answered: answered,
      total: scored.length,
      positive: clinical >= ((scale.score && scale.score.positive_threshold) || 4)
    };
  }

  function severityForScore(score) {
    for (var i = 0; i < scale.severity_bands.length; i++) {
      var band = scale.severity_bands[i];
      if (score >= band.min && score <= band.max) return band;
    }
    return scale.severity_bands[0];
  }

  function partBItems() {
    return scale.items.filter(function(item) {
      return item.section === 'part-b';
    });
  }

  function frequencyCounts() {
    var counts = {};
    scale.options.forEach(function(option) {
      counts[option.value] = 0;
    });

    partBItems().forEach(function(item) {
      var val = getSelectedValue(item.number);
      if (val !== null) counts[val]++;
    });

    return counts;
  }

  function updateA() {
    var result = partAResult();
    var countEl = document.getElementById('as-parta-count');
    var resultEl = document.getElementById('as-parta-result');
    if (!countEl || !resultEl) return;

    if (result.answered === result.total) {
      var severity = severityForScore(result.clinical);
      countEl.textContent = result.clinical + '/6 items in clinical range';
      resultEl.innerHTML = '<span class="' + severity.class + '">' +
        (result.positive ? 'Positive screen - >=4 items in clinical range' : 'Below threshold - <4 items in clinical range') +
        '</span>';
    } else {
      countEl.textContent = '\u2014';
      resultEl.textContent = '\u2014';
    }
  }

  function updateB() {
    var counts = frequencyCounts();
    scale.options.forEach(function(option) {
      var el = document.getElementById('as-freq-' + option.value);
      if (el) el.textContent = counts[option.value] || '\u2014';
    });
  }

  function update() {
    updateA();
    updateB();
  }

  function responseLine(itemNumber) {
    var item = getItem(itemNumber);
    var val = getSelectedValue(itemNumber);
    return item.number + '. ' + item.text + ': ' + (val === null ? 'Not answered' : optionLabel(val));
  }

  function referenceLines() {
    return (scale.references || []).map(function(ref) {
      return ref && ref.label ? 'Reference: ' + ref.label : '';
    }).filter(Boolean);
  }

  function report() {
    var result = partAResult();
    var severity = severityForScore(result.clinical);
    var counts = frequencyCounts();
    var lines = [
      (scale.report && scale.report.heading) || 'Adult ADHD Self-Report Scale (ASRS v1.1)',
      'Date: ' + ToolUtils.dateStamp(),
      '',
      'PART A (Screener)'
    ];

    getScoredItemNumbers().forEach(function(itemNumber) {
      lines.push(responseLine(itemNumber));
    });

    lines.push('');
    lines.push('Part A Result: ' + result.clinical + '/6 items in clinical range - ' + severity.label);
    lines.push('Recommended action: ' + severity.action);
    lines.push('');
    lines.push('PART B (Supplemental)');

    partBItems().forEach(function(item) {
      lines.push(responseLine(item.number));
    });

    lines.push('');
    lines.push('Part B Frequency: ' +
      (counts[0] || 0) + ' Never, ' +
      (counts[1] || 0) + ' Rarely, ' +
      (counts[2] || 0) + ' Sometimes, ' +
      (counts[3] || 0) + ' Often, ' +
      (counts[4] || 0) + ' Very Often');

    if (scale.report && scale.report.scoring_note) {
      lines.push('');
      lines.push(scale.report.scoring_note);
    }
    if (scale.report && scale.report.screening_note) {
      lines.push(scale.report.screening_note);
    }
    referenceLines().forEach(function(line) {
      lines.push(line);
    });

    return lines.join('\n');
  }

  function loadSchema() {
    if (!window.ToolUtils || typeof ToolUtils.loadClinicalScale !== 'function') return;
    ToolUtils.loadClinicalScale('asrs').then(function(loadedScale) {
      scale = loadedScale;
      update();
    }).catch(function(err) {
      console.warn('ASRS schema unavailable; using embedded fallback.', err);
    });
  }

  document.querySelectorAll('.as-a-item, .as-b-item').forEach(function(el) {
    el.addEventListener('change', update);
  });

  var reportBtn = document.getElementById('as-report-btn');
  if (reportBtn) {
    reportBtn.addEventListener('click', function() {
      ToolUtils.copyWithButton(report(), reportBtn);
    });
  }

  var resetBtn = document.getElementById('as-reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      ToolUtils.confirmReset('Reset all ASRS responses?', function() {
        document.querySelectorAll('.as-a-item, .as-b-item').forEach(function(r) {
          r.checked = false;
        });
        update();
      });
    });
  }

  (function addPrintBtn() {
    var sec = document.getElementById('asrs-tool');
    if (!sec) return;
    var header = sec.querySelector('.section-header');
    if (!header) return;
    var btn = document.createElement('button');
    btn.className = 'pf-inline-btn';
    btn.onclick = function() { if (typeof printBlankForm === 'function') printBlankForm('asrs'); };
    btn.textContent = 'Print Blank Form';
    btn.title = 'Print a blank version of this form';
    header.appendChild(btn);
  })();

  loadSchema();
  update();
})();

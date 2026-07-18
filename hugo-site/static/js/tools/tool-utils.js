/**
 * tool-utils.js — Shared utilities for PsychoPharmRef clinical tools.
 *
 * Loaded before any individual tool script. Provides common operations
 * so each tool doesn't have to reimplement them:
 *   - Copy-to-clipboard with button feedback
 *   - Copy-to-clipboard with message element feedback
 *   - Form reset with confirmation prompt
 *   - Date stamp formatting (consistent across all reports)
 *   - Clinical scale schema loading and scoring helpers
 *
 * Usage inside a tool IIFE:
 *   ToolUtils.copyWithButton(text, btn);
 *   ToolUtils.copyWithMessage(text, msgEl);
 *   ToolUtils.confirmReset('Reset all responses?', function() { ... });
 *   var dateStr = ToolUtils.dateStamp();
 */
var ToolUtils = (function() {
  'use strict';

  /**
   * Copy text to clipboard, then briefly change a button's label to "Copied!"
   * This is the most common pattern across tools (PANSS, Y-BOCS, YMRS, etc.)
   *
   * @param {string} text - The text to copy
   * @param {HTMLElement} btn - The button whose text changes to "Copied!"
   * @param {number} [ms=2000] - How long to show "Copied!" (ms)
   */
  function legacyCopyText(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    textarea.style.left = '-9999px';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      return document.execCommand('copy');
    } catch (err) {
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function(err) {
        if (legacyCopyText(text)) return;
        return Promise.reject(err);
      });
    }

    if (legacyCopyText(text)) return Promise.resolve();
    return Promise.reject(new Error('Clipboard copy failed'));
  }

  function copyWithButton(text, btn, ms) {
    if (!ms) ms = 2000;
    var orig = btn.textContent;

    return copyText(text).then(function() {
      btn.textContent = 'Copied!';
      setTimeout(function() { btn.textContent = orig; }, ms);
    }).catch(function() {
      btn.textContent = 'Select text below';
      setTimeout(function() { btn.textContent = orig; }, ms);
    });
  }

  /**
   * Copy text to clipboard, then briefly show a separate message element.
   * Used by CDR, SLUMS, and a few others that display a "Copied to clipboard" div.
   *
   * @param {string} text - The text to copy
   * @param {HTMLElement} msgEl - The element to show/hide
   * @param {number} [ms=2000] - How long to show the message (ms)
   */
  function copyWithMessage(text, msgEl, ms) {
    if (!ms) ms = 2000;
    copyText(text).then(function() {
      msgEl.style.display = 'block';
      setTimeout(function() { msgEl.style.display = 'none'; }, ms);
    });
  }

  /**
   * Prompt the user to confirm a reset, then run the callback if they agree.
   *
   * @param {string} message - The confirmation message (e.g., "Reset all PANSS scores?")
   * @param {Function} callback - Runs if user clicks OK
   */
  function confirmReset(message, callback) {
    if (confirm(message)) {
      callback();
    }
  }

  /**
   * Format today's date for report headers.
   * All tools use the same format: "March 24, 2026"
   *
   * @returns {string} Formatted date string
   */
  function dateStamp() {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  var clinicalDataVersion = '20260718f';
  var clinicalSourcesPromise = null;
  var clinicalScalePromises = {};

  function fetchJson(path) {
    if (!window.fetch) {
      return Promise.reject(new Error('fetch is not available'));
    }
    return window.fetch(path + '?v=' + clinicalDataVersion, { cache: 'no-cache' }).then(function(resp) {
      if (!resp.ok) throw new Error('Failed to load ' + path + ' (' + resp.status + ')');
      return resp.json();
    });
  }

  function loadClinicalSources() {
    if (!clinicalSourcesPromise) {
      clinicalSourcesPromise = fetchJson('data/clinical/sources.json').then(function(sources) {
        var byId = {};
        (sources || []).forEach(function(source) {
          if (source && source.id) byId[source.id] = source;
        });
        return byId;
      });
    }
    return clinicalSourcesPromise;
  }

  function loadClinicalScale(scaleId) {
    if (!clinicalScalePromises[scaleId]) {
      clinicalScalePromises[scaleId] = Promise.all([
        fetchJson('data/clinical/scales/' + scaleId + '.json'),
        loadClinicalSources()
      ]).then(function(results) {
        var scale = results[0];
        var sources = results[1];
        scale.references = (scale.source_ids || []).map(function(sourceId) {
          return sources[sourceId];
        }).filter(Boolean);
        return scale;
      });
    }
    return clinicalScalePromises[scaleId];
  }

  function getScaleSeverity(scale, score) {
    var bands = (scale && scale.severity_bands) || [];
    for (var i = 0; i < bands.length; i++) {
      if (score >= bands[i].min && score <= bands[i].max) return bands[i];
    }
    return bands[bands.length - 1] || null;
  }

  function scoreScaleResponses(responses) {
    return (responses || []).reduce(function(total, value) {
      var parsed = parseInt(value, 10);
      return total + (isNaN(parsed) ? 0 : parsed);
    }, 0);
  }

  function getScaleSafetyFlags(scale, responses) {
    var flags = [];
    ((scale && scale.items) || []).forEach(function(item, index) {
      var flag = item.safety_flag;
      if (!flag) return;
      var response = parseInt(responses[index], 10);
      if (flag.trigger === 'response_greater_than' && response > flag.value) {
        flags.push({
          itemId: item.id,
          itemNumber: item.number,
          message: flag.message
        });
      }
    });
    return flags;
  }

  function createScaleTool(config) {
    var scale = config.fallbackScale;
    var selectedFunc = null;
    var visibleClass = config.visibleClass || 'visible';

    function optionLabel(value) {
      for (var i = 0; i < scale.options.length; i++) {
        if (scale.options[i].value === value) return scale.options[i].label;
      }
      return '';
    }

    function getSelectedValue(itemNumber) {
      var el = document.querySelector('input[name="' + config.inputNamePrefix + itemNumber + '"]:checked');
      return el ? parseInt(el.value, 10) : 0;
    }

    function getResponses() {
      return scale.items.map(function(item) {
        return getSelectedValue(item.number);
      });
    }

    function getScore() {
      return scoreScaleResponses(getResponses());
    }

    function getAnswered() {
      var n = 0;
      scale.items.forEach(function(item) {
        if (document.querySelector('input[name="' + config.inputNamePrefix + item.number + '"]:checked')) n++;
      });
      return n;
    }

    function getSeverity(score) {
      return getScaleSeverity(scale, score) || scale.severity_bands[0];
    }

    function getSafetyFlags() {
      return getScaleSafetyFlags(scale, getResponses());
    }

    function updateSafetyAlerts() {
      if (!config.safetyAlert) return;
      var alertEl = document.getElementById(config.safetyAlert.elementId);
      if (!alertEl) return;

      var flags = getSafetyFlags();
      var visible = flags.some(function(flag) {
        return flag.itemId === config.safetyAlert.itemId;
      });
      alertEl.classList.toggle(visibleClass, visible);
    }

    function update() {
      var score = getScore();
      var answered = getAnswered();
      var scoreEl = document.getElementById(config.scoreElementId);
      if (scoreEl) scoreEl.textContent = score;

      var sev = getSeverity(score);
      var sevEl = document.getElementById(config.severityElementId);
      var complete = answered >= scale.score.item_count;
      if (sevEl) {
        sevEl.textContent = complete ? sev.label : answered + ' / ' + scale.score.item_count + ' answered';
        sevEl.className = config.severityBaseClass + ' ' + (complete ? sev.class : config.incompleteSeverityClass);
      }

      updateSafetyAlerts();
    }

    function setFunc(val, btn) {
      selectedFunc = val;
      document.querySelectorAll(config.functionalButtonSelector).forEach(function(b) {
        b.classList.remove('selected');
      });
      btn.classList.add('selected');
    }

    function generateReport() {
      var score = getScore();
      var sev = getSeverity(score);
      var lines = [
        (scale.report && scale.report.heading) || config.reportHeading,
        'Date: ' + dateStamp(),
        '',
        'SCORES:',
        '  Total: ' + score + ' / ' + scale.score.max,
        '  Severity: ' + sev.label,
        '  Recommended action: ' + sev.action,
        ''
      ];

      if (selectedFunc) {
        lines.push('  Functional impairment: ' + selectedFunc);
        lines.push('');
      }

      lines.push('ITEM RESPONSES:');
      scale.items.forEach(function(item) {
        var val = getSelectedValue(item.number);
        lines.push('  ' + item.number + '. ' + item.text + ': ' + val + ' (' + optionLabel(val) + ')');
      });

      var flags = getSafetyFlags();
      if (flags.length) {
        lines.push('');
        flags.forEach(function(flag) {
          lines.push('  *** ' + flag.message + ' ***');
        });
      }

      lines.push('');
      if (scale.report && scale.report.scoring_note) {
        lines.push(scale.report.scoring_note);
      }
      if (scale.report && scale.report.screening_note) {
        lines.push(scale.report.screening_note);
      }
      (scale.references || []).forEach(function(ref) {
        if (ref && ref.label) lines.push('Reference: ' + ref.label);
      });

      return lines.join('\n');
    }

    function loadSchema() {
      if (!loadClinicalScale || !config.scaleId) return;
      loadClinicalScale(config.scaleId).then(function(loadedScale) {
        scale = loadedScale;
        update();
      }).catch(function(err) {
        console.warn(config.schemaErrorLabel + ' schema unavailable; using embedded fallback.', err);
      });
    }

    document.querySelectorAll(config.radioSelector).forEach(function(r) {
      r.addEventListener('change', update);
    });

    document.querySelectorAll(config.functionalButtonSelector).forEach(function(btn) {
      btn.addEventListener('click', function() {
        setFunc(btn.textContent.trim(), btn);
      });
    });

    var reportBtn = document.getElementById(config.reportButtonId);
    if (reportBtn) {
      reportBtn.addEventListener('click', function() {
        copyWithButton(generateReport(), reportBtn);
      });
    }

    var resetBtn = document.getElementById(config.resetButtonId);
    if (resetBtn) {
      resetBtn.addEventListener('click', function() {
        confirmReset(config.resetConfirmMessage, function() {
          document.querySelectorAll(config.radioSelector).forEach(function(r) { r.checked = false; });
          selectedFunc = null;
          document.querySelectorAll(config.functionalButtonSelector).forEach(function(b) { b.classList.remove('selected'); });
          update();
        });
      });
    }

    loadSchema();
    update();

    return {
      update: update,
      generateReport: generateReport,
      getScore: getScore,
      getResponses: getResponses
    };
  }

  // Public API
  return {
    copyWithButton: copyWithButton,
    copyWithMessage: copyWithMessage,
    copyText: copyText,
    confirmReset: confirmReset,
    dateStamp: dateStamp,
    loadClinicalScale: loadClinicalScale,
    getScaleSeverity: getScaleSeverity,
    scoreScaleResponses: scoreScaleResponses,
    getScaleSafetyFlags: getScaleSafetyFlags,
    createScaleTool: createScaleTool
  };
})();
